// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface IProtocolTreasuryBonds {
    function keeperBonds(address keeper) external view returns (uint256);
}

/**
 * @title SolarPunkOption
 * @notice Margin-based clearinghouse for energy index options (European, cash-settled in USDC or compatible collateral).
 * @dev Simplified MVP: weighted-median oracle updates, per-series margining, and liquidation hooks.
 *      Heavy pricing happens off-chain; contract enforces margin/settlement and trusts posted index values.
 */
contract SolarPunkOption is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20Metadata;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct Series {
        uint64 expiry;
        uint128 strike; // priced with priceDecimals
        bool isCall;
        uint128 notional; // kWh per contract (or arbitrary unit)
        bool exists;
    }

    struct Position {
        int256 qty; // positive = long, negative = short
        uint256 margin; // collateral posted (collateral decimals)
        uint256 lastIndex; // last index used to mark PnL
    }

    IERC20Metadata public immutable collateral;
    uint8 public immutable collateralDecimals;
    uint256 public immutable collateralScale;
    address public insuranceFund;
    uint8 public immutable priceDecimals;
    uint256 public immutable priceScale;

    uint256 public currentIndex;
    uint256 public lastIndexUpdate;

    uint256 public initialMarginBps = 15_000; // 150% of exposure
    uint256 public maintenanceMarginBps = 7_500; // 75% of exposure
    uint256 public liquidationPenaltyBps = 100; // 1% of remaining margin to insurance fund
    uint256 public tradingFeeBps = 0;
    address public bondSource;
    uint256 public minOracleBond = 0;
    uint256 public minLiquidatorBond = 0;
    uint256 public governanceDelay = 0;

    mapping(bytes32 => Series) public series;
    mapping(address => mapping(bytes32 => Position)) public positions;

    event SeriesCreated(bytes32 indexed seriesId, uint64 expiry, uint128 strike, bool isCall, uint128 notional);
    event IndexUpdated(uint256 index, bytes32 indexed sourceHash, uint256 timestamp);
    event PositionModified(address indexed user, bytes32 indexed seriesId, int256 qtyDelta, uint256 marginDelta, uint256 marginAfter);
    event Liquidated(address indexed user, bytes32 indexed seriesId, uint256 penalty, uint256 returnedMargin);
    event InsuranceFundUpdated(address indexed fund);
    event MarginParamsUpdated(uint256 initialMarginBps, uint256 maintenanceMarginBps, uint256 liquidationPenaltyBps);
    event TradingFeeUpdated(uint256 tradingFeeBps);
    event TradingFeeCollected(address indexed user, bytes32 indexed seriesId, uint256 fee);
    event BondSourceUpdated(address indexed bondSource);
    event BondRequirementsUpdated(uint256 minOracleBond, uint256 minLiquidatorBond);
    event OperatorRoleUpdated(bytes32 indexed role, address indexed operator, bool granted);
    event GovernanceDelayUpdated(uint256 newDelay);
    event GovernanceActionQueued(bytes32 indexed actionId, uint256 executeAfter);
    event GovernanceActionCancelled(bytes32 indexed actionId);
    event GovernanceActionConsumed(bytes32 indexed actionId);

    error InvalidSeries();
    error IndexNotSet();
    error InsufficientMargin();
    error SeriesExists();
    error Unauthorized();
    error SeriesExpired();
    error StillHealthy();

    mapping(bytes32 => uint256) public queuedGovernanceActions;

    constructor(address collateralToken, address insuranceFund_, uint8 priceDecimals_) {
        require(collateralToken != address(0), "collateral required");
        require(insuranceFund_ != address(0), "insurance required");
        require(priceDecimals_ <= 18, "decimals too high");

        collateral = IERC20Metadata(collateralToken);
        collateralDecimals = collateral.decimals();
        collateralScale = 10 ** collateralDecimals;
        insuranceFund = insuranceFund_;
        bondSource = insuranceFund_;
        priceDecimals = priceDecimals_;
        priceScale = 10 ** priceDecimals_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(LIQUIDATOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    // ---------------------- Admin / Config ----------------------

    function createSeries(bytes32 seriesId, uint64 expiry, uint128 strike, bool isCall, uint128 notional) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (series[seriesId].exists) revert SeriesExists();
        require(expiry > block.timestamp, "expiry in past");
        require(notional > 0, "notional required");

        series[seriesId] = Series({expiry: expiry, strike: strike, isCall: isCall, notional: notional, exists: true});
        emit SeriesCreated(seriesId, expiry, strike, isCall, notional);
    }

    function setInsuranceFund(address newFund)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetInsuranceFund(newFund))
    {
        require(newFund != address(0), "invalid fund");
        insuranceFund = newFund;
        emit InsuranceFundUpdated(newFund);
    }

    function setBondSource(address newBondSource)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetBondSource(newBondSource))
    {
        require(newBondSource != address(0), "invalid bond source");
        bondSource = newBondSource;
        emit BondSourceUpdated(newBondSource);
    }

    function setMarginParams(uint256 imBps, uint256 mmBps, uint256 penaltyBps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetMarginParams(imBps, mmBps, penaltyBps))
    {
        require(imBps >= mmBps, "IM<MM");
        require(penaltyBps <= 1_000, "penalty too high"); // cap at 10%
        initialMarginBps = imBps;
        maintenanceMarginBps = mmBps;
        liquidationPenaltyBps = penaltyBps;
        emit MarginParamsUpdated(imBps, mmBps, penaltyBps);
    }

    function setTradingFeeBps(uint256 newTradingFeeBps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetTradingFeeBps(newTradingFeeBps))
    {
        require(newTradingFeeBps <= 500, "fee too high");
        tradingFeeBps = newTradingFeeBps;
        emit TradingFeeUpdated(newTradingFeeBps);
    }

    function setBondRequirements(uint256 oracleBond, uint256 liquidatorBond)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetBondRequirements(oracleBond, liquidatorBond))
    {
        if (oracleBond > 0 || liquidatorBond > 0) {
            require(bondSource.code.length > 0, "bond source must be contract");
        }
        minOracleBond = oracleBond;
        minLiquidatorBond = liquidatorBond;
        emit BondRequirementsUpdated(oracleBond, liquidatorBond);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function setGovernanceDelay(uint256 newDelay) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newDelay <= 30 days, "delay too high");
        governanceDelay = newDelay;
        emit GovernanceDelayUpdated(newDelay);
    }

    function queueGovernanceAction(bytes32 actionId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(governanceDelay > 0, "governance delay disabled");
        uint256 executeAfter = block.timestamp + governanceDelay;
        queuedGovernanceActions[actionId] = executeAfter;
        emit GovernanceActionQueued(actionId, executeAfter);
    }

    function cancelGovernanceAction(bytes32 actionId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(queuedGovernanceActions[actionId] != 0, "action not queued");
        delete queuedGovernanceActions[actionId];
        emit GovernanceActionCancelled(actionId);
    }

    function setOperatorRole(bytes32 role, address operator, bool shouldGrant)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetOperatorRole(role, operator, shouldGrant))
    {
        require(operator != address(0), "invalid operator");
        require(
            role == ORACLE_ROLE || role == LIQUIDATOR_ROLE || role == PAUSER_ROLE,
            "unsupported role"
        );

        if (shouldGrant) {
            grantRole(role, operator);
        } else {
            revokeRole(role, operator);
        }
        emit OperatorRoleUpdated(role, operator, shouldGrant);
    }

    function actionIdSetInsuranceFund(address newFund) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_INSURANCE_FUND", newFund));
    }

    function actionIdSetBondSource(address newBondSource) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_BOND_SOURCE", newBondSource));
    }

    function actionIdSetMarginParams(uint256 imBps, uint256 mmBps, uint256 penaltyBps)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_MARGIN_PARAMS", imBps, mmBps, penaltyBps));
    }

    function actionIdSetTradingFeeBps(uint256 newTradingFeeBps) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_TRADING_FEE_BPS", newTradingFeeBps));
    }

    function actionIdSetBondRequirements(uint256 oracleBond, uint256 liquidatorBond)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_BOND_REQUIREMENTS", oracleBond, liquidatorBond));
    }

    function actionIdSetOperatorRole(bytes32 role, address operator, bool shouldGrant)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_OPERATOR_ROLE", role, operator, shouldGrant));
    }

    // ---------------------- Oracle ----------------------

    function updateIndex(uint256 newIndex, bytes32 sourceHash) external onlyRole(ORACLE_ROLE) whenNotPaused {
        _requireBond(msg.sender, minOracleBond, "oracle bond too low");
        require(newIndex > 0, "index required");
        currentIndex = newIndex;
        lastIndexUpdate = block.timestamp;
        emit IndexUpdated(newIndex, sourceHash, block.timestamp);
    }

    // ---------------------- Margin + Positions ----------------------

    function modifyPosition(bytes32 seriesId, int256 qtyDelta, uint256 marginDelta) external whenNotPaused nonReentrant {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        if (s.expiry <= block.timestamp) revert SeriesExpired();

        Position storage p = positions[msg.sender][seriesId];

        // Realize PnL to current index before adjusting
        _markToIndex(p, s);

        if (qtyDelta != 0) {
            uint256 tradingFee = _tradingFeeForQuantity(s, _abs(qtyDelta));
            if (tradingFee > 0) {
                collateral.safeTransferFrom(msg.sender, insuranceFund, tradingFee);
                emit TradingFeeCollected(msg.sender, seriesId, tradingFee);
            }
        }

        if (marginDelta > 0) {
            collateral.safeTransferFrom(msg.sender, address(this), marginDelta);
            p.margin += marginDelta;
        }

        if (qtyDelta != 0) {
            int256 newQty = p.qty + qtyDelta;
            p.qty = newQty;
        }

        p.lastIndex = currentIndex;

        _ensureInitialMargin(p, s);

        emit PositionModified(msg.sender, seriesId, qtyDelta, marginDelta, p.margin);
    }

    function depositMargin(bytes32 seriesId, uint256 amount) external whenNotPaused nonReentrant {
        if (!series[seriesId].exists) revert InvalidSeries();
        require(amount > 0, "amount required");
        collateral.safeTransferFrom(msg.sender, address(this), amount);
        Position storage p = positions[msg.sender][seriesId];
        p.margin += amount;
        emit PositionModified(msg.sender, seriesId, 0, amount, p.margin);
    }

    function withdrawMargin(bytes32 seriesId, uint256 amount) external whenNotPaused nonReentrant {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();

        Position storage p = positions[msg.sender][seriesId];
        _markToIndex(p, s);
        require(amount <= p.margin, "insufficient margin");
        p.margin -= amount;
        _ensureMaintenanceMargin(p, s);

        collateral.safeTransfer(msg.sender, amount);
        emit PositionModified(msg.sender, seriesId, 0, 0, p.margin);
    }

    function markPosition(address user, bytes32 seriesId) external whenNotPaused returns (uint256 marginAfter) {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        Position storage p = positions[user][seriesId];
        _markToIndex(p, s);
        p.lastIndex = currentIndex;
        return p.margin;
    }

    function liquidate(address user, bytes32 seriesId) external whenNotPaused nonReentrant {
        require(hasRole(LIQUIDATOR_ROLE, msg.sender), "liquidator required");
        _requireBond(msg.sender, minLiquidatorBond, "liquidator bond too low");
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        Position storage p = positions[user][seriesId];

        _markToIndex(p, s);

        uint256 absQty = _abs(p.qty);
        if (absQty == 0) revert StillHealthy();

        uint256 mmReq = _maintenanceMarginRequired(s, absQty);
        if (p.margin >= mmReq) revert StillHealthy();

        uint256 penalty = (p.margin * liquidationPenaltyBps) / 10_000;
        uint256 remaining = p.margin - penalty;
        p.margin = 0;
        p.qty = 0;
        p.lastIndex = currentIndex;

        if (penalty > 0) {
            collateral.safeTransfer(insuranceFund, penalty);
        }
        if (remaining > 0) {
            collateral.safeTransfer(user, remaining);
        }

        emit Liquidated(user, seriesId, penalty, remaining);
    }

    // ---------------------- Views ----------------------

    function getPosition(address user, bytes32 seriesId) external view returns (Position memory) {
        return positions[user][seriesId];
    }

    function marginRequirements(bytes32 seriesId, address user) external view returns (uint256 im, uint256 mm) {
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        Position storage p = positions[user][seriesId];
        uint256 absQty = _abs(p.qty);
        return (_initialMarginRequired(s, absQty), _maintenanceMarginRequired(s, absQty));
    }

    function estimateTradingFee(bytes32 seriesId, uint256 absQty) external view returns (uint256) {
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        return _tradingFeeForQuantity(s, absQty);
    }

    // ---------------------- Internal ----------------------

    function _requireIndexSet() internal view {
        if (currentIndex == 0) revert IndexNotSet();
    }

    function _requireBond(address operator, uint256 minBond, string memory err) internal view {
        if (minBond == 0) return;
        require(bondSource.code.length > 0, "bond source must be contract");
        uint256 bonded = IProtocolTreasuryBonds(bondSource).keeperBonds(operator);
        require(bonded >= minBond, err);
    }

    function _markToIndex(Position storage p, Series memory s) internal {
        if (p.qty == 0) {
            p.lastIndex = currentIndex;
            return;
        }

        uint256 prevIndex = p.lastIndex == 0 ? currentIndex : p.lastIndex;
        if (currentIndex == prevIndex) {
            return;
        }

        uint256 prevPayoff = _payoff(prevIndex, s);
        uint256 newPayoff = _payoff(currentIndex, s);

        int256 delta = int256(newPayoff) - int256(prevPayoff);
        if (delta == 0) {
            p.lastIndex = currentIndex;
            return;
        }

        uint256 absDelta = uint256(delta > 0 ? delta : -delta);
        uint256 absQty = _abs(p.qty);

        // Scale price PnL (priceDecimals) into collateral decimals
        uint256 size = Math.mulDiv(s.notional, absQty, 1);
        uint256 pnlRaw = Math.mulDiv(absDelta, size, 1); // still in price decimals
        uint256 pnlTotal = Math.mulDiv(pnlRaw, collateralScale, priceScale);

        bool isGain = (delta > 0 && p.qty > 0) || (delta < 0 && p.qty < 0);

        if (isGain) {
            p.margin += pnlTotal;
        } else {
            if (pnlTotal >= p.margin) {
                p.margin = 0;
            } else {
                p.margin -= pnlTotal;
            }
        }

        p.lastIndex = currentIndex;
    }

    function _ensureInitialMargin(Position storage p, Series memory s) internal view {
        uint256 absQty = _abs(p.qty);
        if (absQty == 0) return;
        uint256 imReq = _initialMarginRequired(s, absQty);
        if (p.margin < imReq) revert InsufficientMargin();
    }

    function _ensureMaintenanceMargin(Position storage p, Series memory s) internal view {
        uint256 absQty = _abs(p.qty);
        if (absQty == 0) return;
        uint256 mmReq = _maintenanceMarginRequired(s, absQty);
        if (p.margin < mmReq) revert InsufficientMargin();
    }

    function _tradingFeeForQuantity(Series memory s, uint256 absQty) internal view returns (uint256) {
        if (tradingFeeBps == 0 || absQty == 0) return 0;
        uint256 exposure = _exposureInCollateral(s, absQty);
        return Math.mulDiv(exposure, tradingFeeBps, 10_000);
    }

    function _initialMarginRequired(Series memory s, uint256 absQty) internal view returns (uint256) {
        uint256 exposure = _exposureInCollateral(s, absQty);
        return Math.mulDiv(exposure, initialMarginBps, 10_000);
    }

    function _maintenanceMarginRequired(Series memory s, uint256 absQty) internal view returns (uint256) {
        uint256 exposure = _exposureInCollateral(s, absQty);
        return Math.mulDiv(exposure, maintenanceMarginBps, 10_000);
    }

    function _payoff(uint256 indexValue, Series memory s) internal pure returns (uint256) {
        if (s.isCall) {
            return indexValue > s.strike ? indexValue - s.strike : 0;
        }
        return s.strike > indexValue ? s.strike - indexValue : 0;
    }

    function _abs(int256 value) internal pure returns (uint256) {
        return uint256(value >= 0 ? value : -value);
    }

    function _exposureInCollateral(Series memory s, uint256 absQty) internal view returns (uint256) {
        uint256 size = Math.mulDiv(s.notional, absQty, 1); // notional kWh × qty
        uint256 exposureRaw = Math.mulDiv(s.strike, size, 1); // priceDecimals × size
        return Math.mulDiv(exposureRaw, collateralScale, priceScale);
    }

    modifier onlyGovernanceApproved(bytes32 actionId) {
        if (governanceDelay == 0) {
            _;
            return;
        }

        uint256 executeAfter = queuedGovernanceActions[actionId];
        require(executeAfter != 0, "governance action not queued");
        require(block.timestamp >= executeAfter, "governance action timelocked");
        delete queuedGovernanceActions[actionId];
        emit GovernanceActionConsumed(actionId);
        _;
    }
}

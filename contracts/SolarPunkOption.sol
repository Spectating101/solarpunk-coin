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
 * @dev Bilateral, explicitly approved matching with limited recourse to each pair's posted margin.
 *      Positive PnL is transferred from the matched loser, never created from unrelated deposits.
 *      Price-gap losses are capped at posted pair collateral; oracle prices remain trusted inputs.
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

    uint256 public initialMarginBps = 25_000; // 250% of exposure
    uint256 public maintenanceMarginBps = 12_500; // 125% of exposure
    uint256 public liquidationPenaltyBps = 100; // 1% of remaining margin to insurance fund
    uint256 public tradingFeeBps = 0;
    address public bondSource;
    uint256 public minOracleBond = 0;
    uint256 public minLiquidatorBond = 0;
    uint256 public governanceDelay = 0;

    mapping(bytes32 => Series) public series;
    mapping(address => mapping(bytes32 => Position)) public positions;
    mapping(address => mapping(bytes32 => address)) public counterparties;
    mapping(bytes32 => bool) public approvedMatches;
    mapping(bytes32 => uint256) public settlementIndexes;
    uint256 public totalMarginLiability;

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
    event SettlementIndexSet(bytes32 indexed seriesId, uint256 index, bytes32 sourceHash);
    event PositionSettled(address indexed user, bytes32 indexed seriesId, uint256 finalPayoff, uint256 marginReturned);

    error InvalidSeries();
    error IndexNotSet();
    error InsufficientMargin();
    error SeriesExists();
    error Unauthorized();
    error SeriesExpired();
    error StillHealthy();
    error MatchedTradeRequired();
    error SettlementIndexRequired();

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

    /// @notice Freeze a series-specific expiry price. Later global updates cannot change it.
    function setSettlementIndex(bytes32 seriesId, uint256 index, bytes32 sourceHash)
        external onlyRole(ORACLE_ROLE)
    {
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        require(block.timestamp >= s.expiry, "series not expired");
        require(index > 0 && settlementIndexes[seriesId] == 0, "invalid or frozen settlement index");
        _requireBond(msg.sender, minOracleBond, "oracle bond too low");
        settlementIndexes[seriesId] = index;
        emit SettlementIndexSet(seriesId, index, sourceHash);
    }

    function matchedPositionHash(bytes32 seriesId, address party, address counterparty,
        int256 quantity, uint256 ownMargin, uint256 otherMargin, uint64 deadline)
        public view returns (bytes32)
    {
        return keccak256(abi.encode(block.chainid, address(this), seriesId, party,
            counterparty, quantity, ownMargin, otherMargin, deadline));
    }

    /// @notice Approve or revoke exact, one-use terms; ERC20 allowance alone is not trade consent.
    function approveMatchedPosition(bytes32 seriesId, address counterparty, int256 quantity,
        uint256 ownMargin, uint256 otherMargin, uint64 deadline, bool approved) external
    {
        require(counterparty != address(0) && counterparty != msg.sender, "invalid counterparty");
        require(quantity != 0 && quantity != type(int256).min, "invalid quantity");
        if (approved) require(deadline >= block.timestamp, "match expired");
        approvedMatches[matchedPositionHash(seriesId, msg.sender, counterparty,
            quantity, ownMargin, otherMargin, deadline)] = approved;
    }

    function openMatchedPosition(bytes32 seriesId, address counterparty, int256 quantity,
        uint256 ownMargin, uint256 otherMargin, uint64 deadline)
        external whenNotPaused nonReentrant
    {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        if (s.expiry <= block.timestamp) revert SeriesExpired();
        require(counterparty != address(0) && counterparty != msg.sender, "invalid counterparty");
        require(quantity != 0 && quantity != type(int256).min, "invalid quantity");
        require(deadline >= block.timestamp, "match expired");
        Position storage p = positions[msg.sender][seriesId];
        Position storage other = positions[counterparty][seriesId];
        require(p.qty == 0 && other.qty == 0, "position already matched");
        bytes32 approval = matchedPositionHash(seriesId, counterparty, msg.sender,
            -quantity, otherMargin, ownMargin, deadline);
        require(approvedMatches[approval], "counterparty approval required");
        delete approvedMatches[approval];
        _deposit(p, msg.sender, ownMargin);
        _deposit(other, counterparty, otherMargin);
        p.qty = quantity;
        other.qty = -quantity;
        p.lastIndex = currentIndex;
        other.lastIndex = currentIndex;
        counterparties[msg.sender][seriesId] = counterparty;
        counterparties[counterparty][seriesId] = msg.sender;
        _ensureInitialMargin(p, s);
        _ensureInitialMargin(other, s);
        uint256 fee = _tradingFeeForQuantity(s, _abs(quantity));
        if (fee > 0) {
            collateral.safeTransferFrom(msg.sender, insuranceFund, fee);
            emit TradingFeeCollected(msg.sender, seriesId, fee);
        }
        emit PositionModified(msg.sender, seriesId, quantity, ownMargin, p.margin);
        emit PositionModified(counterparty, seriesId, -quantity, otherMargin, other.margin);
    }

    // ---------------------- Margin + Positions ----------------------

    function modifyPosition(bytes32 seriesId, int256 qtyDelta, uint256 marginDelta) external whenNotPaused nonReentrant {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        if (s.expiry <= block.timestamp) revert SeriesExpired();

        Position storage p = positions[msg.sender][seriesId];

        // Realize PnL to current index before adjusting
        _markPair(msg.sender, seriesId, s);

        if (qtyDelta != 0) {
            uint256 tradingFee = _tradingFeeForQuantity(s, _abs(qtyDelta));
            if (tradingFee > 0) {
                collateral.safeTransferFrom(msg.sender, insuranceFund, tradingFee);
                emit TradingFeeCollected(msg.sender, seriesId, tradingFee);
            }
        }

        _deposit(p, msg.sender, marginDelta);
        if (qtyDelta != 0) _reducePair(msg.sender, seriesId, qtyDelta);

        _ensureInitialMargin(p, s);

        emit PositionModified(msg.sender, seriesId, qtyDelta, marginDelta, p.margin);
    }

    function depositMargin(bytes32 seriesId, uint256 amount) external whenNotPaused nonReentrant {
        if (!series[seriesId].exists) revert InvalidSeries();
        require(amount > 0, "amount required");
        Position storage p = positions[msg.sender][seriesId];
        _deposit(p, msg.sender, amount);
        emit PositionModified(msg.sender, seriesId, 0, amount, p.margin);
    }

    function withdrawMargin(bytes32 seriesId, uint256 amount) external whenNotPaused nonReentrant {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        if (s.expiry <= block.timestamp && positions[msg.sender][seriesId].qty != 0) revert SeriesExpired(); // flat margin can always exit

        Position storage p = positions[msg.sender][seriesId];
        _markPair(msg.sender, seriesId, s);
        require(amount <= p.margin, "insufficient margin");
        p.margin -= amount;
        totalMarginLiability -= amount;
        _ensureMaintenanceMargin(p, s);

        collateral.safeTransfer(msg.sender, amount);
        emit PositionModified(msg.sender, seriesId, 0, 0, p.margin);
    }

    function markPosition(address user, bytes32 seriesId) external whenNotPaused returns (uint256 marginAfter) {
        _requireIndexSet();
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        Position storage p = positions[user][seriesId];
        _markPair(user, seriesId, s);
        return p.margin;
    }

    function liquidate(address user, bytes32 seriesId) external whenNotPaused nonReentrant {
        require(hasRole(LIQUIDATOR_ROLE, msg.sender), "liquidator required");
        _requireBond(msg.sender, minLiquidatorBond, "liquidator bond too low");
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        Position storage p = positions[user][seriesId];

        _markPair(user, seriesId, s);

        uint256 absQty = _abs(p.qty);
        if (absQty == 0) revert StillHealthy();

        uint256 mmReq = _maintenanceMarginRequired(s, absQty);
        if (p.margin >= mmReq) revert StillHealthy();

        uint256 penalty = (p.margin * liquidationPenaltyBps) / 10_000;
        uint256 remaining = p.margin - penalty;
        p.margin = 0;
        _reducePair(user, seriesId, -p.qty);
        totalMarginLiability -= penalty + remaining;

        if (penalty > 0) {
            collateral.safeTransfer(insuranceFund, penalty);
        }
        if (remaining > 0) {
            collateral.safeTransfer(user, remaining);
        }

        emit Liquidated(user, seriesId, penalty, remaining);
    }

    // ---------------------- Settlement ----------------------

    /**
     * @notice Settle an expired position and return remaining collateral
     * @dev Called by any position holder after series expiry. Marks PnL to the
     *      series-specific settlement index frozen by the oracle, closes the position, and returns all remaining margin.
     *      `modifyPosition` blocks with SeriesExpired after expiry, so this is
     *      the only exit path for open positions once a series expires.
     * @param seriesId The series to settle
     */
    function settle(bytes32 seriesId) external nonReentrant {
        Series memory s = series[seriesId];
        if (!s.exists) revert InvalidSeries();
        require(s.expiry <= block.timestamp, "Series not yet expired");
        Position storage p = positions[msg.sender][seriesId];
        require(p.qty != 0 || p.margin > 0, "No position to settle");

        // Realize all PnL at final settlement index
        _markPair(msg.sender, seriesId, s);
        uint256 marginToReturn = p.margin;
        uint256 finalPayoff = _payoff(settlementIndexes[seriesId], s);
        if (p.qty != 0) _reducePair(msg.sender, seriesId, -p.qty);
        p.margin = 0;
        totalMarginLiability -= marginToReturn;

        if (marginToReturn > 0) {
            collateral.safeTransfer(msg.sender, marginToReturn);
        }

        emit PositionSettled(msg.sender, seriesId, finalPayoff, marginToReturn);
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

    function _deposit(Position storage p, address party, uint256 amount) internal {
        if (amount == 0) return;
        uint256 beforeBalance = collateral.balanceOf(address(this));
        collateral.safeTransferFrom(party, address(this), amount);
        // Exact incoming collateral is required before increasing liabilities; this rejects transfer fees.
        // slither-disable-next-line incorrect-equality
        require(collateral.balanceOf(address(this)) - beforeBalance == amount, "unsupported transfer-fee collateral");
        p.margin += amount;
        totalMarginLiability += amount;
    }

    function _reducePair(address user, bytes32 seriesId, int256 delta) internal {
        Position storage p = positions[user][seriesId];
        int256 next = p.qty + delta;
        if (p.qty == 0 || _abs(next) >= _abs(p.qty)
            || (next != 0 && (next > 0) != (p.qty > 0))) revert MatchedTradeRequired();
        address counterparty = counterparties[user][seriesId];
        require(counterparty != address(0), "missing matched counterparty");
        Position storage other = positions[counterparty][seriesId];
        require(other.qty == -p.qty, "pair quantity mismatch");
        p.qty = next;
        other.qty = -next;
        if (next == 0) {
            delete counterparties[user][seriesId];
            delete counterparties[counterparty][seriesId];
        }
    }

    function _markPair(address user, bytes32 seriesId, Series memory s) internal {
        Position storage p = positions[user][seriesId];
        if (p.qty == 0) return;
        uint256 index = currentIndex;
        if (block.timestamp >= s.expiry) {
            index = settlementIndexes[seriesId];
            if (index == 0) revert SettlementIndexRequired();
        }
        address counterparty = counterparties[user][seriesId];
        require(counterparty != address(0), "missing matched counterparty");
        Position storage other = positions[counterparty][seriesId];
        require(other.qty == -p.qty && other.lastIndex == p.lastIndex, "pair state mismatch");
        int256 delta = int256(_payoff(index, s)) - int256(_payoff(p.lastIndex, s));
        if (delta != 0) {
            uint256 absDelta = uint256(delta > 0 ? delta : -delta);
            uint256 size = Math.mulDiv(s.notional, _abs(p.qty), 1);
            uint256 pnl = Math.mulDiv(Math.mulDiv(absDelta, size, 1), collateralScale, priceScale);
            bool gain = (delta > 0 && p.qty > 0) || (delta < 0 && p.qty < 0);
            Position storage loser = gain ? other : p;
            Position storage winner = gain ? p : other;
            uint256 fundedPnl = pnl > loser.margin ? loser.margin : pnl;
            loser.margin -= fundedPnl;
            winner.margin += fundedPnl;
        }
        p.lastIndex = index;
        other.lastIndex = index;
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

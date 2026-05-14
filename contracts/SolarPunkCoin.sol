// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

interface IProtocolTreasuryBondView {
    function keeperBonds(address keeper) external view returns (uint256);
}

interface IStabilityPool {
    function withdraw(address token, address to, uint256 amount) external;
}

/**
 * @title SolarPunkCoin (SPK)
 * @notice Energy-backed stablecoin pegged to renewable energy prices
 * @dev Implements Rules A-J from SolarPunkCoin design:
 *      A: Surplus-only issuance via oracle
 *      B: Intrinsic redemption guarantee for electricity
 *      C: Cost-value parity via stability fees
 *      D: Peg stability band with PI control
 *      E: Grid stress safeguard (halt on low reserves)
 *      F: Green energy constraint (enforced offchain, flagged onchain)
 *      G: Verifiable green proof (oracle signatures + audit trail)
 *      H: Transparent reserve + fee model
 *      I: Fair distribution (future DAO parameter)
 *      J: Decentralized governance (DAO upgradeable)
 */
contract SolarPunkCoin is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    Ownable,
    AccessControl,
    Initializable
{
    using SafeERC20 for IERC20;
    // ============ Roles ============
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant RESERVE_MANAGER_ROLE =
        keccak256("RESERVE_MANAGER_ROLE");
    bytes32 public constant STABILIZER_ROLE = keccak256("STABILIZER_ROLE");
    bytes32 private constant MINT_FEE_KIND = keccak256("MINT_FEE");
    bytes32 private constant REDEEM_FEE_KIND = keccak256("REDEEM_FEE");

    // ============ State Variables: Peg Parameters ============
    /// @notice Target peg price in USD (1e18 = $1.00)
    uint256 public pegTarget = 1e18;

    /// @notice Peg stability band (e.g., 5e16 = ±5%)
    uint256 public pegBand = 5e16; // ±5%

    /// @notice Proportional gain for PI controller (e.g., 1e16 = 1%)
    uint256 public proportionalGain = 1e16;

    /// @notice Integral gain for PI controller accumulation
    uint256 public integralGain = 5e15; // 0.5%

    /// @notice Cumulative integral error (for PI controller)
    int256 public integralError = 0;

    /// @notice Minting fee (basis points: 10 = 0.1%)
    uint256 public mintingFee = 10; // 0.1%

    /// @notice Redemption fee (basis points)
    uint256 public redemptionFee = 10; // 0.1%

    /// @notice Maximum supply cap to prevent runaway inflation
    uint256 public supplyCap = 1_000_000_000e18; // 1 billion SPK max

    // ============ State Variables: Oracle & Data ============
    /// @notice Latest observed price from oracle (in USD, 1e18 = $1)
    uint256 public lastOraclePrice = 1e18;

    /// @notice Timestamp of last oracle update
    uint256 public lastOracleUpdate = 0;

    /// @notice Oracle staleness threshold (86400 = 1 day)
    uint256 public oracleStalenessThreshold = 86400;

    // ============ State Variables: Reserves & Accounting ============
    /// @notice Reserve token held for backing (stored in reserve token decimals)
    uint256 public usdcReserve = 0;
    IERC20 public immutable reserveToken;
    uint8 public immutable reserveTokenDecimals;

    /// @notice Address holding stabilization inventory
    address public stabilityPool;

    /// @notice Address receiving protocol fees and treasury disbursements
    address public treasury;
    address public bondSource;
    uint256 public minMinterBond = 0;
    uint256 public minOracleBond = 0;
    uint256 public governanceDelay = 0;

    /// @notice Energy price per kWh in USD (1e18 = $1.00). Set by oracle.
    ///         Determines how many SPK are minted per kWh of surplus.
    ///         Default 1e18 ($1.00/kWh) for backward compatibility.
    uint256 public energyPricePerKwh = 1e18;
    uint256 public lastEnergyPriceUpdate = 0;

    /// @notice Fraction of mint fee routed to stability pool (basis points).
    ///         Remainder goes to treasury. Stability pool needs a token balance
    ///         for the PI controller burn path to function.
    uint256 public stabilityFeeShare = 5000; // 50%

    /// @notice Cumulative surplus kWh recorded
    uint256 public cumulativeSurplusKwh = 0;

    /// @notice Total SPK redeemed (for tracking)
    uint256 public totalRedeemed = 0;

    // ============ State Variables: Grid Safety ============
    /// @notice Minimum reserve margin % to allow minting (e.g., 10)
    uint256 public minReserveMarginPercent = 10;

    /// @notice Is grid in stress (manual override or reserve < threshold)?
    bool public gridStressed = false;
    bool public manualGridStress = false;

    // ============ Events ============
    event SurplusRecorded(uint256 indexed kwhAmount, uint256 timestamp);
    event SPKMinted(
        address indexed to,
        uint256 amount,
        uint256 kwhBacked,
        uint256 fee
    );
    event SPKBurned(address indexed from, uint256 amount);
    event SPKRedeemed(address indexed user, uint256 amount);
    event PegAdjusted(uint256 newPrice, bool isMint);
    event OraclePriceUpdated(uint256 price, uint256 timestamp);
    event GridStressToggled(bool isStressed);
    event ReserveDeposited(address indexed from, uint256 amount);
    event ReserveWithdrawn(address indexed to, uint256 amount);
    event StabilityPoolUpdated(address indexed newPool);
    event StabilityPoolDisbursed(address indexed to, uint256 amount);
    event TreasuryUpdated(address indexed treasury);
    event BondSourceUpdated(address indexed bondSource);
    event BondRequirementsUpdated(uint256 minMinterBond, uint256 minOracleBond);
    event FeeCollected(address indexed payer, address indexed treasury, uint256 amount, bytes32 feeKind);
    event GridStressManualOverride(bool isStressed);
    event ParameterUpdated(string paramName, uint256 newValue);
    event GovernanceDelayUpdated(uint256 newDelay);
    event GovernanceActionQueued(bytes32 indexed actionId, uint256 executeAfter);
    event GovernanceActionCancelled(bytes32 indexed actionId);
    event GovernanceActionConsumed(bytes32 indexed actionId);
    event EnergyPriceUpdated(uint256 price, uint256 timestamp);
    event StabilityFeeShareUpdated(uint256 newShare);
    event SurplusAttestationMinted(
        bytes32 indexed attestationHash,
        address indexed attestor,
        address indexed recipient,
        uint256 surplusKwh,
        uint64 windowStart,
        uint64 windowEnd,
        bytes32 sourceHash
    );

    mapping(bytes32 => uint256) public queuedGovernanceActions;
    mapping(bytes32 => bool) public usedSurplusAttestations;
    mapping(bytes32 => bool) public usedSurplusSourceHashes;

    // ============ Modifiers ============
    modifier onlyOracle() {
        require(hasRole(ORACLE_ROLE, msg.sender), "Must have ORACLE_ROLE");
        _;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Must have MINTER_ROLE");
        _;
    }

    modifier gridNotStressed() {
        require(!_isGridStressedForSupply(totalSupply()), "Grid stressed: minting paused");
        _;
    }

    modifier oracleNotStale() {
        require(
            block.timestamp - lastOracleUpdate < oracleStalenessThreshold,
            "Oracle price stale"
        );
        _;
    }

    function _scaledReserve() internal view returns (uint256) {
        if (reserveTokenDecimals == 18) return usdcReserve;
        if (reserveTokenDecimals < 18) {
            return usdcReserve * (10 ** (18 - reserveTokenDecimals));
        }
        return usdcReserve / (10 ** (reserveTokenDecimals - 18));
    }

    function _reserveRatioForSupply(uint256 supply) internal view returns (uint256) {
        if (supply == 0) return 100;
        uint256 reserveScaled = _scaledReserve();
        return (reserveScaled * 100) / supply;
    }

    function _isGridStressedForSupply(uint256 supply) internal view returns (bool) {
        if (manualGridStress) return true;
        if (minReserveMarginPercent == 0) return false;
        return _reserveRatioForSupply(supply) < minReserveMarginPercent;
    }

    function _updateGridStress() internal {
        bool shouldStress = _isGridStressedForSupply(totalSupply());
        if (shouldStress != gridStressed) {
            gridStressed = shouldStress;
            emit GridStressToggled(shouldStress);
        }
    }

    // ============ Constructor & Initialization ============
    constructor(address reserveTokenAddress)
        ERC20("SolarPunkCoin", "SPK")
        Ownable(msg.sender)
    {
        require(reserveTokenAddress != address(0), "Invalid reserve token");
        reserveToken = IERC20(reserveTokenAddress);
        reserveTokenDecimals = IERC20Metadata(reserveTokenAddress).decimals();
        stabilityPool = address(this);
        treasury = msg.sender;
        bondSource = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(RESERVE_MANAGER_ROLE, msg.sender);
        _grantRole(STABILIZER_ROLE, msg.sender);
    }

    // ============ Core Functions: Minting & Surplus ============

    /**
     * @notice Mint SPK based on verified renewable energy surplus
     * @dev Rule A: Only mint when oracle confirms curtailment/surplus
     * @param surplusKwh Amount of surplus kWh to back new SPK
     * @param recipient Address to receive newly minted SPK
     */
    function mintFromSurplus(
        uint256 surplusKwh,
        address recipient
    ) external onlyMinter gridNotStressed oracleNotStale returns (uint256) {
        _requireBond(msg.sender, minMinterBond, "minter bond too low");
        return _mintFromVerifiedSurplus(surplusKwh, recipient);
    }

    /**
     * @notice Mint SPK from an oracle-signed surplus energy attestation.
     * @dev A unique source hash can only be consumed once. The signature binds
     *      the record to this chain and contract, preventing cross-chain replay.
     */
    function mintFromSurplusAttestation(
        uint256 surplusKwh,
        address recipient,
        uint64 windowStart,
        uint64 windowEnd,
        uint64 validAfter,
        uint64 validBefore,
        bytes32 sourceHash,
        bytes calldata oracleSignature
    ) external onlyMinter gridNotStressed oracleNotStale returns (uint256) {
        _requireBond(msg.sender, minMinterBond, "minter bond too low");
        require(sourceHash != bytes32(0), "source hash required");
        require(windowStart < windowEnd, "invalid attestation window");
        require(windowEnd <= block.timestamp, "attestation window not closed");
        require(block.timestamp >= validAfter, "attestation not active");
        require(block.timestamp <= validBefore, "attestation expired");

        bytes32 attestationHash = surplusAttestationHash(
            surplusKwh,
            recipient,
            windowStart,
            windowEnd,
            validAfter,
            validBefore,
            sourceHash
        );
        require(!usedSurplusAttestations[attestationHash], "attestation already used");
        require(!usedSurplusSourceHashes[sourceHash], "source hash already used");

        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", attestationHash));
        address attestor = ECDSA.recover(signedHash, oracleSignature);
        require(hasRole(ORACLE_ROLE, attestor), "invalid surplus attestor");
        _requireBond(attestor, minOracleBond, "oracle bond too low");

        usedSurplusAttestations[attestationHash] = true;
        usedSurplusSourceHashes[sourceHash] = true;
        uint256 minted = _mintFromVerifiedSurplus(surplusKwh, recipient);

        emit SurplusAttestationMinted(
            attestationHash,
            attestor,
            recipient,
            surplusKwh,
            windowStart,
            windowEnd,
            sourceHash
        );

        return minted;
    }

    function surplusAttestationHash(
        uint256 surplusKwh,
        address recipient,
        uint64 windowStart,
        uint64 windowEnd,
        uint64 validAfter,
        uint64 validBefore,
        bytes32 sourceHash
    ) public view returns (bytes32) {
        return keccak256(
            abi.encode(
                "SPK_SURPLUS_ATTESTATION_V1",
                block.chainid,
                address(this),
                surplusKwh,
                recipient,
                windowStart,
                windowEnd,
                validAfter,
                validBefore,
                sourceHash
            )
        );
    }

    function _mintFromVerifiedSurplus(uint256 surplusKwh, address recipient) internal returns (uint256) {
        require(surplusKwh > 0, "Surplus must be > 0");
        require(recipient != address(0), "Invalid recipient");

        // SPK amount = surplusKwh × energyPricePerKwh (set by energy price oracle)
        // e.g., 100 kWh × $0.05/kWh = $5 = 5 SPK (peg $1.00)
        uint256 baseSPK = surplusKwh * energyPricePerKwh;

        // Apply minting fee (seigniorage)
        uint256 fee = (baseSPK * mintingFee) / 10000;
        uint256 amountToMint = baseSPK - fee;

        // Check supply cap
        uint256 newSupply = totalSupply() + amountToMint + fee;
        require(newSupply <= supplyCap, "Supply cap exceeded");
        require(!_isGridStressedForSupply(newSupply), "Grid stressed: minting paused");

        // Record surplus
        cumulativeSurplusKwh += surplusKwh;

        // Mint tokens to recipient
        _mint(recipient, amountToMint);

        // Split fee: stabilityFeeShare goes to stability pool (enables PI burn path),
        // remainder goes to treasury
        if (fee > 0) {
            uint256 stabilityAmount = (fee * stabilityFeeShare) / 10000;
            uint256 treasuryAmount = fee - stabilityAmount;
            if (stabilityAmount > 0) {
                _mint(stabilityPool, stabilityAmount);
            }
            if (treasuryAmount > 0) {
                _mint(treasury, treasuryAmount);
                emit FeeCollected(msg.sender, treasury, treasuryAmount, MINT_FEE_KIND);
            }
        }

        emit SurplusRecorded(surplusKwh, block.timestamp);
        emit SPKMinted(recipient, amountToMint, surplusKwh, fee);
        _updateGridStress();

        return amountToMint;
    }

    // ============ Peg Stabilization: PI Control ============

    /**
     * @notice Update oracle price and apply PI control for peg stability
     * @dev Rule D: Automatically adjust supply via mint/burn to maintain peg
     * @param newPrice Current market price from oracle (in USD, 1e18 = $1)
     */
    function updateOraclePriceAndAdjust(uint256 newPrice)
        external
        onlyOracle
        returns (bool adjusted)
    {
        _requireBond(msg.sender, minOracleBond, "oracle bond too low");
        require(newPrice > 0, "Price must be positive");

        // Update oracle state
        lastOraclePrice = newPrice;
        lastOracleUpdate = block.timestamp;

        emit OraclePriceUpdated(newPrice, block.timestamp);

        // Apply PI control to stabilize peg
        adjusted = _applyPIControl(newPrice);

        return adjusted;
    }

    /**
     * @notice PI (Proportional-Integral) control loop
     * @dev When price deviates from peg, mint or burn to bring it back
     * @param currentPrice Current market price
     */
    function _applyPIControl(uint256 currentPrice) internal returns (bool) {
        int256 priceDelta = int256(currentPrice) - int256(pegTarget);
        bool adjusted = false;
        uint256 supply = totalSupply();
        if (supply == 0) return false;

        // Scale control signal as a fraction of total supply relative to peg deviation.
        // Formula: (priceDelta / pegTarget) * gain * supply
        // This ensures the response is proportional to market size at any supply level.
        // Units: (1e18 * 1e18 * 1e18) / (1e18 * 1e18) = 1e18 (SPK token units)
        int256 proportional = (priceDelta * int256(proportionalGain) * int256(supply))
            / (int256(pegTarget) * 1e18);

        // Integral term: accumulates peg error over time, prevents steady-state drift
        integralError += priceDelta;
        if (integralError > 10e18) integralError = 10e18;
        if (integralError < -10e18) integralError = -10e18;

        int256 integral = (integralError * int256(integralGain) * int256(supply))
            / (int256(pegTarget) * 1e18);

        int256 controlSignal = proportional + integral;

        // If price too high: mint to stability pool to increase supply
        if (controlSignal > 0) {
            uint256 mintAmount = uint256(controlSignal);
            uint256 maxCanMint = supply / 100; // cap: 1% of current supply per update
            if (mintAmount > 0 && maxCanMint > 0) {
                uint256 actualMint = mintAmount > maxCanMint ? maxCanMint : mintAmount;
                uint256 newSupply = supply + actualMint;
                if (newSupply <= supplyCap && !_isGridStressedForSupply(newSupply)) {
                    _mint(stabilityPool, actualMint);
                    emit PegAdjusted(currentPrice, true);
                    adjusted = true;
                }
            }
        }
        // If price too low: burn from stability pool to reduce supply
        else if (controlSignal < 0) {
            uint256 burnAmount = uint256(-controlSignal);
            uint256 maxCanBurn = supply / 100; // cap: 1% of current supply per update
            uint256 availableToBurn = balanceOf(stabilityPool);
            if (burnAmount > 0 && maxCanBurn > 0 && availableToBurn > 0) {
                uint256 actualBurn = burnAmount;
                if (actualBurn > maxCanBurn) actualBurn = maxCanBurn;
                if (actualBurn > availableToBurn) actualBurn = availableToBurn;
                _burn(stabilityPool, actualBurn);
                emit SPKBurned(stabilityPool, actualBurn);
                emit PegAdjusted(currentPrice, false);
                adjusted = true;
            }
        }

        if (adjusted) {
            _updateGridStress();
        }

        return adjusted;
    }

    // ============ Redemption Mechanism ============

    /**
     * @notice Redeem SPK for energy at utilities
     * @dev Rule B: SPK holders can redeem at guaranteed rate
     *      Actual energy redemption happens offchain via utility integration
     * @param amount SPK to redeem
     */
    function redeemForEnergy(uint256 amount) external returns (bool) {
        require(amount > 0, "Redeem amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient SPK balance");

        // Apply redemption fee
        uint256 fee = (amount * redemptionFee) / 10000;
        uint256 netAmount = amount - fee;

        // Burn the SPK
        _burn(msg.sender, amount);
        emit SPKBurned(msg.sender, amount);

        // Fee goes to treasury so redemptions still contribute to protocol funding
        if (fee > 0) {
            _mint(treasury, fee);
            emit FeeCollected(msg.sender, treasury, fee, REDEEM_FEE_KIND);
        }

        // Track redemption
        totalRedeemed += netAmount;

        emit SPKRedeemed(msg.sender, amount);
        _updateGridStress();

        return true;
    }

    // ============ Grid Safety (Rule E) ============

    /**
     * @notice Toggle grid stress state (blocks minting if stressed)
     * @dev Only oracle can call. Used when grid reserve < threshold
     * @param isStressed True if grid reserve < min threshold
     */
    function setGridStressed(bool isStressed) external onlyOracle {
        _requireBond(msg.sender, minOracleBond, "oracle bond too low");
        manualGridStress = isStressed;
        emit GridStressManualOverride(isStressed);
        _updateGridStress();
    }

    // ============ Oracle & Parameter Management ============

    /**
     * @notice Update peg stability parameters
     * @dev Owner/DAO can adjust these for fine-tuning
     * @param newBand New stability band (e.g., 5e16 = ±5%)
     * @param newPropGain New proportional gain
     * @param newIntGain New integral gain
     */
    function updateControlParameters(
        uint256 newBand,
        uint256 newPropGain,
        uint256 newIntGain
    ) external onlyOwner onlyGovernanceApproved(actionIdUpdateControlParameters(newBand, newPropGain, newIntGain)) {
        require(newBand > 0 && newBand <= 1e17, "Invalid band"); // Max 10%
        require(newPropGain > 0, "Invalid prop gain");
        require(newIntGain > 0, "Invalid int gain");

        pegBand = newBand;
        proportionalGain = newPropGain;
        integralGain = newIntGain;

        emit ParameterUpdated("pegBand", newBand);
        emit ParameterUpdated("proportionalGain", newPropGain);
        emit ParameterUpdated("integralGain", newIntGain);
    }

    /**
     * @notice Update fee structure
     * @param newMintFee Minting fee in basis points
     * @param newRedeemFee Redemption fee in basis points
     */
    function updateFees(uint256 newMintFee, uint256 newRedeemFee)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdUpdateFees(newMintFee, newRedeemFee))
    {
        require(newMintFee <= 5000, "Mint fee too high"); // Max 50%
        require(newRedeemFee <= 5000, "Redeem fee too high");

        mintingFee = newMintFee;
        redemptionFee = newRedeemFee;

        emit ParameterUpdated("mintingFee", newMintFee);
        emit ParameterUpdated("redemptionFee", newRedeemFee);
    }

    function setTreasury(address newTreasury)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetTreasury(newTreasury))
    {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
        if (bondSource == oldTreasury) {
            bondSource = newTreasury;
            emit BondSourceUpdated(newTreasury);
        }
    }

    function setBondSource(address newBondSource)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetBondSource(newBondSource))
    {
        require(newBondSource != address(0), "Invalid bond source");
        bondSource = newBondSource;
        emit BondSourceUpdated(newBondSource);
    }

    function setBondRequirements(uint256 newMinMinterBond, uint256 newMinOracleBond)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetBondRequirements(newMinMinterBond, newMinOracleBond))
    {
        if (newMinMinterBond > 0 || newMinOracleBond > 0) {
            require(bondSource.code.length > 0, "Bond source must be contract");
        }
        minMinterBond = newMinMinterBond;
        minOracleBond = newMinOracleBond;
        emit BondRequirementsUpdated(newMinMinterBond, newMinOracleBond);
    }

    function _requireBond(address operator, uint256 minBond, string memory err)
        internal
        view
    {
        if (minBond == 0) return;
        require(bondSource.code.length > 0, "Bond source must be contract");
        uint256 bonded = IProtocolTreasuryBondView(bondSource).keeperBonds(operator);
        require(bonded >= minBond, err);
    }

    function updateReserveParameters(uint256 newMinReserveMarginPercent)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdUpdateReserveParameters(newMinReserveMarginPercent))
    {
        require(newMinReserveMarginPercent <= 100, "Invalid reserve margin");
        minReserveMarginPercent = newMinReserveMarginPercent;
        emit ParameterUpdated("minReserveMarginPercent", newMinReserveMarginPercent);
        _updateGridStress();
    }

    function setStabilityPool(address newPool)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetStabilityPool(newPool))
    {
        require(newPool != address(0), "Invalid stability pool");
        stabilityPool = newPool;
        emit StabilityPoolUpdated(newPool);
    }

    function depositReserve(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        reserveToken.safeTransferFrom(msg.sender, address(this), amount);
        usdcReserve += amount;
        emit ReserveDeposited(msg.sender, amount);
        _updateGridStress();
    }

    function withdrawReserve(uint256 amount, address to)
        external
        onlyRole(RESERVE_MANAGER_ROLE)
    {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(amount <= usdcReserve, "Insufficient reserve");
        usdcReserve -= amount;
        reserveToken.safeTransfer(to, amount);
        emit ReserveWithdrawn(to, amount);
        _updateGridStress();
    }

    function syncReserve() external {
        usdcReserve = reserveToken.balanceOf(address(this));
        _updateGridStress();
    }

    function disburseStabilityPool(address to, uint256 amount)
        external
        onlyRole(STABILIZER_ROLE)
    {
        require(to != address(0), "Invalid recipient");
        if (stabilityPool == address(this)) {
            // Internal pool: coin contract holds inventory directly
            _transfer(address(this), to, amount);
        } else {
            // External StabilityPool contract: delegate to its withdraw function
            IStabilityPool(stabilityPool).withdraw(address(this), to, amount);
        }
        emit StabilityPoolDisbursed(to, amount);
    }

    /**
     * @notice Grant or revoke oracle role (for oracle rotation)
     * @param oracle Address to grant/revoke
     * @param shouldGrant True to grant, false to revoke
     */
    function setOracleRole(address oracle, bool shouldGrant)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetOracleRole(oracle, shouldGrant))
    {
        require(oracle != address(0), "Invalid oracle address");
        if (shouldGrant) {
            grantRole(ORACLE_ROLE, oracle);
        } else {
            revokeRole(ORACLE_ROLE, oracle);
        }
    }

    /**
     * @notice Update the energy price oracle (USD per kWh, 1e18 = $1.00)
     * @dev Sets how many SPK are minted per kWh of verified surplus.
     *      At $0.05/kWh: 100 kWh → 5 SPK. Requires ORACLE_ROLE.
     * @param newPrice New energy price in USD (1e18 precision)
     */
    function updateEnergyPrice(uint256 newPrice) external onlyOracle {
        _requireBond(msg.sender, minOracleBond, "oracle bond too low");
        require(newPrice > 0, "Price must be positive");
        energyPricePerKwh = newPrice;
        lastEnergyPriceUpdate = block.timestamp;
        emit EnergyPriceUpdated(newPrice, block.timestamp);
    }

    /**
     * @notice Set what fraction of mint fees are routed to the stability pool
     * @dev Stability pool needs balance for the PI burn path to work.
     *      100% → all fees to stability pool (no treasury revenue from minting).
     *      0% → all fees to treasury (stability pool must be funded externally).
     * @param newShare Fraction in basis points (0–10000)
     */
    function setStabilityFeeShare(uint256 newShare)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetStabilityFeeShare(newShare))
    {
        require(newShare <= 10000, "Share exceeds 100%");
        stabilityFeeShare = newShare;
        emit StabilityFeeShareUpdated(newShare);
    }

    /**
     * @notice Atomically transfer both Ownable ownership and DEFAULT_ADMIN_ROLE
     * @dev Prevents the Ownable owner and AccessControl admin from drifting out of
     *      sync after a governance handoff. Call this instead of transferOwnership().
     * @param newAdmin Address that will receive both owner() and DEFAULT_ADMIN_ROLE
     */
    function handoffAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "Invalid admin");
        address oldAdmin = owner();
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        _revokeRole(DEFAULT_ADMIN_ROLE, oldAdmin);
        _transferOwnership(newAdmin); // emits OwnershipTransferred
    }

    // ============ View Functions ============

    /**
     * @notice Check if SPK price is within peg band
     * @return Within peg band?
     */
    function isPegStable() external view returns (bool) {
        uint256 upperBound = pegTarget + pegBand;
        uint256 lowerBound = pegTarget > pegBand ? pegTarget - pegBand : 0;
        return lastOraclePrice >= lowerBound && lastOraclePrice <= upperBound;
    }

    /**
     * @notice Get current peg deviation (negative = underpriced)
     * @return Deviation in basis points
     */
    function getPegDeviation() external view returns (int256) {
        int256 deviation = (int256(lastOraclePrice) - int256(pegTarget)) * 10000 /
            int256(pegTarget);
        return deviation;
    }

    /**
     * @notice Estimate SPK amount for given surplus kWh
     * @param surplusKwh Surplus renewable energy in kWh
     * @return Estimated SPK after fees
     */
    function estimateMintAmount(uint256 surplusKwh)
        external
        view
        returns (uint256)
    {
        uint256 baseSPK = surplusKwh * energyPricePerKwh;
        uint256 fee = (baseSPK * mintingFee) / 10000;
        return baseSPK - fee;
    }

    /**
     * @notice Get reserve ratio (collateral / total supply)
     * @return Reserve ratio in percentage (reserve normalized to 18 decimals)
     */
    function getReserveRatio() external view returns (uint256) {
        return _reserveRatioForSupply(totalSupply());
    }

    // ============ Internal Overrides (Pausable) ============

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        super._update(from, to, amount);
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency pause in case of attack or bug
     * @dev Only PAUSER_ROLE can call
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Emergency unpause
     * @dev Only owner can call
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    function setGovernanceDelay(uint256 newDelay) external onlyOwner {
        require(newDelay <= 30 days, "Delay too high");
        governanceDelay = newDelay;
        emit GovernanceDelayUpdated(newDelay);
    }

    function queueGovernanceAction(bytes32 actionId) external onlyOwner {
        require(governanceDelay > 0, "Governance delay disabled");
        uint256 executeAfter = block.timestamp + governanceDelay;
        queuedGovernanceActions[actionId] = executeAfter;
        emit GovernanceActionQueued(actionId, executeAfter);
    }

    function cancelGovernanceAction(bytes32 actionId) external onlyOwner {
        require(queuedGovernanceActions[actionId] != 0, "Action not queued");
        delete queuedGovernanceActions[actionId];
        emit GovernanceActionCancelled(actionId);
    }

    function actionIdUpdateControlParameters(uint256 newBand, uint256 newPropGain, uint256 newIntGain)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("UPDATE_CONTROL_PARAMETERS", newBand, newPropGain, newIntGain));
    }

    function actionIdUpdateFees(uint256 newMintFee, uint256 newRedeemFee) public pure returns (bytes32) {
        return keccak256(abi.encode("UPDATE_FEES", newMintFee, newRedeemFee));
    }

    function actionIdSetTreasury(address newTreasury) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_TREASURY", newTreasury));
    }

    function actionIdSetBondSource(address newBondSource) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_BOND_SOURCE", newBondSource));
    }

    function actionIdSetBondRequirements(uint256 newMinMinterBond, uint256 newMinOracleBond)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_BOND_REQUIREMENTS", newMinMinterBond, newMinOracleBond));
    }

    function actionIdUpdateReserveParameters(uint256 newMinReserveMarginPercent)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("UPDATE_RESERVE_PARAMETERS", newMinReserveMarginPercent));
    }

    function actionIdSetStabilityFeeShare(uint256 newShare) public pure returns (bytes32) {
        return keccak256(abi.encode("setStabilityFeeShare", newShare));
    }

    function actionIdSetStabilityPool(address newPool) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_STABILITY_POOL", newPool));
    }

    function actionIdSetOracleRole(address oracle, bool shouldGrant) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_ORACLE_ROLE", oracle, shouldGrant));
    }

    function actionIdSetOperatorRole(bytes32 role, address operator, bool shouldGrant)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_OPERATOR_ROLE", role, operator, shouldGrant));
    }

    function setOperatorRole(bytes32 role, address operator, bool shouldGrant)
        external
        onlyOwner
        onlyGovernanceApproved(actionIdSetOperatorRole(role, operator, shouldGrant))
    {
        require(operator != address(0), "Invalid operator address");
        require(
            role == MINTER_ROLE ||
            role == ORACLE_ROLE ||
            role == PAUSER_ROLE ||
            role == RESERVE_MANAGER_ROLE ||
            role == STABILIZER_ROLE,
            "Unsupported role"
        );

        if (shouldGrant) {
            grantRole(role, operator);
        } else {
            revokeRole(role, operator);
        }
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

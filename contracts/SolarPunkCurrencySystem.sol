// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface ISolarPunkEnergyToken is IERC20Metadata {
    function energyPricePerKwh() external view returns (uint256);
    function redeemForEnergy(uint256 amount) external returns (bool);
}

/**
 * @title SolarPunkCurrencySystem
 * @notice Currency-framework layer for SPK invoice settlement and energy-credit redemption.
 * @dev This contract deliberately does not mint SPK. It consumes the existing SPK token:
 *      1. invoice settlement transfers SPK between real parties and records a replay-safe invoice hash;
 *      2. redemption transfers SPK into this contract, burns it through SPK.redeemForEnergy(),
 *         and records the owed kWh plus later delivery resolution.
 */
contract SolarPunkCurrencySystem is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    enum RedemptionState {
        Pending,
        Fulfilled,
        Shortfall,
        Disputed
    }

    struct Payment {
        uint256 id;
        address payer;
        address payee;
        uint256 spkAmount;
        bytes32 invoiceHash;
        uint64 settledAt;
    }

    struct Redemption {
        uint256 id;
        address redeemer;
        address beneficiary;
        uint256 spkAmount;
        uint256 energyPricePerKwh;
        uint256 owedKwhWad;
        uint256 deliveredKwhWad;
        uint256 shortfallKwhWad;
        uint64 requestedAt;
        uint64 resolvedAt;
        bytes32 sourceHash;
        bytes32 resolutionHash;
        RedemptionState state;
    }

    ISolarPunkEnergyToken public immutable spk;
    IERC20 public immutable spkToken;

    uint256 public nextPaymentId = 1;
    uint256 public nextRedemptionId = 1;
    uint256 public totalSettledSpk;
    uint256 public totalRedeemedSpk;
    uint256 public totalOwedKwhWad;
    uint256 public totalDeliveredKwhWad;
    uint256 public totalShortfallKwhWad;

    mapping(uint256 => Payment) public payments;
    mapping(uint256 => Redemption) public redemptions;
    mapping(bytes32 => bool) public usedInvoiceHashes;
    mapping(bytes32 => bool) public usedRedemptionSourceHashes;

    event InvoiceSettled(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed payee,
        uint256 spkAmount,
        bytes32 invoiceHash
    );
    event RedemptionOpened(
        uint256 indexed redemptionId,
        address indexed redeemer,
        address indexed beneficiary,
        uint256 spkAmount,
        uint256 owedKwhWad,
        uint256 energyPricePerKwh,
        bytes32 sourceHash
    );
    event RedemptionResolved(
        uint256 indexed redemptionId,
        RedemptionState state,
        uint256 deliveredKwhWad,
        uint256 shortfallKwhWad,
        bytes32 resolutionHash
    );
    event RedemptionDisputed(uint256 indexed redemptionId, address indexed caller, bytes32 disputeHash);

    error InvalidAddress();
    error InvalidAmount();
    error HashRequired();
    error HashAlreadyUsed();
    error SlippageExceeded();
    error RedemptionMissing();
    error RedemptionStateInvalid();
    error UnauthorizedActor();

    constructor(address spkAddress, address admin) {
        if (spkAddress == address(0)) revert InvalidAddress();
        address initialAdmin = admin == address(0) ? msg.sender : admin;

        spk = ISolarPunkEnergyToken(spkAddress);
        spkToken = IERC20(spkAddress);

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(OPERATOR_ROLE, initialAdmin);
        _grantRole(PAUSER_ROLE, initialAdmin);
    }

    function settleInvoice(address payee, uint256 spkAmount, bytes32 invoiceHash)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 paymentId)
    {
        if (payee == address(0)) revert InvalidAddress();
        if (spkAmount == 0) revert InvalidAmount();
        if (invoiceHash == bytes32(0)) revert HashRequired();
        if (usedInvoiceHashes[invoiceHash]) revert HashAlreadyUsed();

        paymentId = nextPaymentId;
        nextPaymentId += 1;
        usedInvoiceHashes[invoiceHash] = true;
        totalSettledSpk += spkAmount;

        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            payee: payee,
            spkAmount: spkAmount,
            invoiceHash: invoiceHash,
            settledAt: uint64(block.timestamp)
        });

        spkToken.safeTransferFrom(msg.sender, payee, spkAmount);

        emit InvoiceSettled(paymentId, msg.sender, payee, spkAmount, invoiceHash);
    }

    function quoteRedemption(uint256 spkAmount)
        public
        view
        returns (uint256 energyPricePerKwh, uint256 owedKwhWad)
    {
        if (spkAmount == 0) revert InvalidAmount();
        energyPricePerKwh = spk.energyPricePerKwh();
        if (energyPricePerKwh == 0) revert InvalidAmount();
        owedKwhWad = Math.mulDiv(spkAmount, 1e18, energyPricePerKwh);
    }

    function openRedemption(
        address beneficiary,
        uint256 spkAmount,
        uint256 minKwhWad,
        bytes32 sourceHash
    ) external nonReentrant whenNotPaused returns (uint256 redemptionId) {
        if (beneficiary == address(0)) revert InvalidAddress();
        if (sourceHash == bytes32(0)) revert HashRequired();
        if (usedRedemptionSourceHashes[sourceHash]) revert HashAlreadyUsed();

        (uint256 energyPricePerKwh, uint256 owedKwhWad) = quoteRedemption(spkAmount);
        if (owedKwhWad < minKwhWad) revert SlippageExceeded();

        redemptionId = nextRedemptionId;
        nextRedemptionId += 1;
        usedRedemptionSourceHashes[sourceHash] = true;
        totalRedeemedSpk += spkAmount;
        totalOwedKwhWad += owedKwhWad;

        redemptions[redemptionId] = Redemption({
            id: redemptionId,
            redeemer: msg.sender,
            beneficiary: beneficiary,
            spkAmount: spkAmount,
            energyPricePerKwh: energyPricePerKwh,
            owedKwhWad: owedKwhWad,
            deliveredKwhWad: 0,
            shortfallKwhWad: 0,
            requestedAt: uint64(block.timestamp),
            resolvedAt: 0,
            sourceHash: sourceHash,
            resolutionHash: bytes32(0),
            state: RedemptionState.Pending
        });

        spkToken.safeTransferFrom(msg.sender, address(this), spkAmount);
        bool ok = spk.redeemForEnergy(spkAmount);
        require(ok, "SPK redemption failed");

        emit RedemptionOpened(
            redemptionId,
            msg.sender,
            beneficiary,
            spkAmount,
            owedKwhWad,
            energyPricePerKwh,
            sourceHash
        );
    }

    function resolveRedemption(
        uint256 redemptionId,
        uint256 deliveredKwhWad,
        bytes32 resolutionHash
    ) external onlyRole(OPERATOR_ROLE) whenNotPaused {
        if (resolutionHash == bytes32(0)) revert HashRequired();

        Redemption storage redemption = redemptions[redemptionId];
        if (redemption.id == 0) revert RedemptionMissing();
        if (
            redemption.state != RedemptionState.Pending &&
            redemption.state != RedemptionState.Disputed
        ) {
            revert RedemptionStateInvalid();
        }

        if (redemption.resolvedAt != 0) {
            totalDeliveredKwhWad -= redemption.deliveredKwhWad;
            totalShortfallKwhWad -= redemption.shortfallKwhWad;
        }

        redemption.deliveredKwhWad = deliveredKwhWad;
        redemption.resolvedAt = uint64(block.timestamp);
        redemption.resolutionHash = resolutionHash;

        uint256 shortfallKwhWad = 0;
        if (deliveredKwhWad >= redemption.owedKwhWad) {
            redemption.state = RedemptionState.Fulfilled;
        } else {
            redemption.state = RedemptionState.Shortfall;
            shortfallKwhWad = redemption.owedKwhWad - deliveredKwhWad;
        }
        redemption.shortfallKwhWad = shortfallKwhWad;
        totalDeliveredKwhWad += deliveredKwhWad;
        totalShortfallKwhWad += shortfallKwhWad;

        emit RedemptionResolved(
            redemptionId,
            redemption.state,
            deliveredKwhWad,
            shortfallKwhWad,
            resolutionHash
        );
    }

    function disputeRedemption(uint256 redemptionId, bytes32 disputeHash) external whenNotPaused {
        if (disputeHash == bytes32(0)) revert HashRequired();

        Redemption storage redemption = redemptions[redemptionId];
        if (redemption.id == 0) revert RedemptionMissing();
        if (msg.sender != redemption.redeemer && msg.sender != redemption.beneficiary) {
            revert UnauthorizedActor();
        }
        if (
            redemption.state != RedemptionState.Pending &&
            redemption.state != RedemptionState.Fulfilled &&
            redemption.state != RedemptionState.Shortfall
        ) {
            revert RedemptionStateInvalid();
        }

        redemption.state = RedemptionState.Disputed;
        redemption.resolutionHash = disputeHash;

        emit RedemptionDisputed(redemptionId, msg.sender, disputeHash);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}

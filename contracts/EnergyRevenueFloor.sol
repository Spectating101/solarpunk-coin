// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EnergyRevenueFloor
 * @notice Commercial pilot module for kWh floor-protection products.
 * @dev A payer buys a policy tied to a producer and a time window.
 *      If measured kWh is below target, the contract pays a capped amount.
 */
contract EnergyRevenueFloor is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20Metadata;

    bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");
    bytes32 public constant LIQUIDITY_ROLE = keccak256("LIQUIDITY_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    enum PolicyState {
        Active,
        Reported,
        Disputed,
        Settled,
        Cancelled,
        Expired
    }

    struct Producer {
        address owner;
        string siteName;
        string location;
        uint256 capacityKw;
        uint32 heartbeatSeconds;
        bool active;
        uint64 totalPolicies;
        uint64 createdAt;
        uint64 lastReportAt;
    }

    struct FloorPolicy {
        bytes32 producerId;
        address payer;
        uint64 periodStart;
        uint64 periodEnd;
        uint64 reportDeadline;
        uint64 disputeDeadline;
        uint256 targetKwh;
        uint256 floorPricePerKwh;
        uint256 premiumBps;
        uint256 premiumPaid;
        uint256 maxPayout;
        uint256 lockedLiquidity;
        uint256 realizedKwh;
        uint256 payout;
        uint64 reportAt;
        uint64 settledAt;
        address reporter;
        bytes32 sourceHash;
        PolicyState state;
        bool disputed;
    }

    IERC20Metadata public immutable settlementToken;
    address public treasury;
    uint8 public immutable settlementTokenDecimals;

    uint256 public totalLockedLiquidity;
    uint256 public nextPolicyId = 1;
    uint256 public nextProducerCounter;

    uint256 public maxPremiumBps = 1_500;
    uint256 public minPremiumBps = 50;
    uint256 public maxReportDriftSeconds = 1 days;
    uint256 public reportSubmissionWindowSeconds = 4 days;
    uint256 public disputeWindowSeconds = 1 days;

    mapping(bytes32 => Producer) public producers;
    mapping(bytes32 => bool) public producerExists;
    mapping(address => bytes32[]) public producersByOwner;
    mapping(uint256 => FloorPolicy) public policies;
    mapping(address => uint256[]) public policiesByPayer;
    mapping(address => uint256) public reportNonces;

    event ProducerRegistered(
        bytes32 indexed producerId,
        address indexed owner,
        string siteName,
        string location,
        uint256 capacityKw,
        uint32 heartbeatSeconds
    );
    event ProducerUpdated(
        bytes32 indexed producerId,
        string siteName,
        string location,
        uint256 capacityKw,
        uint32 heartbeatSeconds,
        bool active
    );
    event ProducerHeartbeat(bytes32 indexed producerId, uint64 lastReportAt);
    event LiquidityDeposited(address indexed operator, uint256 amount, uint256 beforeLocked);
    event LiquidityWithdrawn(address indexed operator, uint256 amount, address indexed destination, uint256 beforeLocked);
    event PolicyOpened(
        uint256 indexed policyId,
        bytes32 indexed producerId,
        address indexed payer,
        uint64 periodStart,
        uint64 periodEnd,
        uint256 targetKwh,
        uint256 floorPricePerKwh,
        uint256 premium,
        uint256 maxPayout,
        uint256 premiumBps
    );
    event PolicyReportSubmitted(
        uint256 indexed policyId,
        uint256 realizedKwh,
        uint64 measuredAt,
        address indexed reporter,
        bytes32 sourceHash
    );
    event PolicyDisputed(uint256 indexed policyId, address indexed payer, string reason);
    event PolicySettled(uint256 indexed policyId, uint256 realizedKwh, uint256 payout, uint64 settledAt);
    event PolicyCancelled(uint256 indexed policyId, address indexed payer);
    event PolicyExpired(uint256 indexed policyId, uint64 periodEnd);
    event PolicyDisputeResolved(uint256 indexed policyId, uint256 realizedKwh, bytes32 sourceHash, address indexed auditor);
    event ParametersUpdated(bytes32 indexed key, uint256 value);
    event TreasuryUpdated(address indexed previousTreasury, address indexed nextTreasury);

    error ProducerMissing();
    error InvalidProducerState();
    error PolicyNotFound();
    error PolicyStateInvalid();
    error NotEnoughLiquidity();
    error DeadlineMissed();
    error InvalidWindow();
    error UnauthorizedActor();
    error MathOverflow();

    constructor(address settlementTokenAddress, address treasury_) {
        require(settlementTokenAddress != address(0), "invalid settlement token");
        settlementToken = IERC20Metadata(settlementTokenAddress);
        settlementTokenDecimals = settlementToken.decimals();
        treasury = treasury_ == address(0) ? msg.sender : treasury_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REPORTER_ROLE, msg.sender);
        _grantRole(LIQUIDITY_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    modifier onlyProducerOwner(bytes32 producerId) {
        Producer storage producer = producers[producerId];
        if (!producerExists[producerId]) revert ProducerMissing();
        if (producer.owner != msg.sender) revert UnauthorizedActor();
        _;
    }

    modifier onlyPolicyBuyer(uint256 policyId) {
        if (policies[policyId].payer == address(0)) revert PolicyNotFound();
        if (policies[policyId].payer != msg.sender) revert UnauthorizedActor();
        _;
    }

    function registerProducer(
        string calldata siteName,
        string calldata location,
        uint256 capacityKw,
        uint32 heartbeatSeconds
    ) external whenNotPaused returns (bytes32 producerId) {
        require(bytes(siteName).length > 0, "site required");
        require(bytes(location).length > 0, "location required");
        require(capacityKw > 0, "capacity required");
        require(heartbeatSeconds >= 30 && heartbeatSeconds <= 7 days, "heartbeat invalid");

        producerId = keccak256(
            abi.encodePacked(msg.sender, block.chainid, address(this), nextProducerCounter)
        );
        nextProducerCounter += 1;
        require(!producerExists[producerId], "producer id collision");

        producers[producerId] = Producer({
            owner: msg.sender,
            siteName: siteName,
            location: location,
            capacityKw: capacityKw,
            heartbeatSeconds: heartbeatSeconds,
            active: true,
            totalPolicies: 0,
            createdAt: uint64(block.timestamp),
            lastReportAt: 0
        });
        producerExists[producerId] = true;
        producersByOwner[msg.sender].push(producerId);

        emit ProducerRegistered(
            producerId,
            msg.sender,
            siteName,
            location,
            capacityKw,
            heartbeatSeconds
        );
    }

    function setProducerMetadata(
        bytes32 producerId,
        string calldata siteName,
        string calldata location,
        uint256 capacityKw,
        uint32 heartbeatSeconds,
        bool active
    ) external onlyProducerOwner(producerId) whenNotPaused {
        require(bytes(siteName).length > 0, "site required");
        require(bytes(location).length > 0, "location required");
        require(capacityKw > 0, "capacity required");
        require(heartbeatSeconds >= 30 && heartbeatSeconds <= 7 days, "heartbeat invalid");

        Producer storage producer = producers[producerId];
        producer.siteName = siteName;
        producer.location = location;
        producer.capacityKw = capacityKw;
        producer.heartbeatSeconds = heartbeatSeconds;
        producer.active = active;

        emit ProducerUpdated(
            producerId,
            siteName,
            location,
            capacityKw,
            heartbeatSeconds,
            active
        );
    }

    function setProducerHeartbeat(bytes32 producerId) external onlyProducerOwner(producerId) {
        Producer storage producer = producers[producerId];
        producer.lastReportAt = uint64(block.timestamp);
        emit ProducerHeartbeat(producerId, producer.lastReportAt);
    }

    function heartbeatIsFresh(bytes32 producerId) public view returns (bool) {
        if (!producerExists[producerId]) return false;
        Producer memory producer = producers[producerId];
        if (!producer.active) return false;
        if (producer.lastReportAt == 0) return true;
        return block.timestamp - producer.lastReportAt <= producer.heartbeatSeconds;
    }

    function estimatePolicy(
        uint256 targetKwh,
        uint256 floorPricePerKwh,
        uint256 premiumBps
    )
        public
        view
        returns (uint256 maxPayout, uint256 premium, uint256 minPremiumBpsValue, uint256 maxPremiumBpsValue)
    {
        require(targetKwh > 0, "kwh required");
        require(floorPricePerKwh > 0, "price required");
        require(premiumBps >= minPremiumBps && premiumBps <= maxPremiumBps, "premium out of range");
        maxPayout = targetKwh * floorPricePerKwh;
        premium = (maxPayout * premiumBps) / 10_000;
        require(maxPayout > 0, "invalid payout");
        minPremiumBpsValue = minPremiumBps;
        maxPremiumBpsValue = maxPremiumBps;
    }

    function openFloorPolicy(
        bytes32 producerId,
        uint64 periodStart,
        uint64 periodEnd,
        uint256 targetKwh,
        uint256 floorPricePerKwh,
        uint256 premiumBps,
        address payer
    ) external nonReentrant onlyProducerOwner(producerId) whenNotPaused returns (uint256 policyId) {
        if (payer == address(0)) revert UnauthorizedActor();
        Producer storage producer = producers[producerId];
        if (!producer.active) revert InvalidProducerState();
        if (!heartbeatIsFresh(producerId)) revert DeadlineMissed();
        if (periodStart <= block.timestamp) revert InvalidWindow();
        if (periodEnd <= periodStart) revert InvalidWindow();
        if (targetKwh == 0 || floorPricePerKwh == 0) revert InvalidWindow();
        if (premiumBps < minPremiumBps || premiumBps > maxPremiumBps) revert InvalidWindow();

        (uint256 maxPayout, uint256 premium, , ) = estimatePolicy(targetKwh, floorPricePerKwh, premiumBps);
        if (settlementToken.balanceOf(address(this)) < totalLockedLiquidity + maxPayout) revert NotEnoughLiquidity();

        policyId = nextPolicyId;
        nextPolicyId += 1;
        uint64 reportDeadline = periodEnd + uint64(reportSubmissionWindowSeconds);

        policies[policyId] = FloorPolicy({
            producerId: producerId,
            payer: payer,
            periodStart: periodStart,
            periodEnd: periodEnd,
            reportDeadline: reportDeadline,
            disputeDeadline: 0,
            targetKwh: targetKwh,
            floorPricePerKwh: floorPricePerKwh,
            premiumBps: premiumBps,
            premiumPaid: premium,
            maxPayout: maxPayout,
            lockedLiquidity: maxPayout,
            realizedKwh: 0,
            payout: 0,
            reportAt: 0,
            settledAt: 0,
            reporter: address(0),
            sourceHash: bytes32(0),
            state: PolicyState.Active,
            disputed: false
        });

        totalLockedLiquidity += maxPayout;
        producer.totalPolicies += 1;
        policiesByPayer[payer].push(policyId);

        settlementToken.safeTransferFrom(payer, treasury, premium);

        emit PolicyOpened(
            policyId,
            producerId,
            payer,
            periodStart,
            periodEnd,
            targetKwh,
            floorPricePerKwh,
            premium,
            maxPayout,
            premiumBps
        );
    }

    function cancelPolicy(uint256 policyId) external nonReentrant onlyPolicyBuyer(policyId) whenNotPaused {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Active) revert PolicyStateInvalid();
        if (block.timestamp >= policy.periodEnd) revert InvalidWindow();

        policy.state = PolicyState.Cancelled;
        totalLockedLiquidity -= policy.lockedLiquidity;
        policy.lockedLiquidity = 0;

        emit PolicyCancelled(policyId, msg.sender);
    }

    function submitSignedProductionReport(
        uint256 policyId,
        uint256 realizedKwh,
        uint64 measuredAt,
        uint256 reporterNonce,
        bytes32 sourceHash,
        bytes calldata reporterSig
    ) external whenNotPaused {
        if (block.timestamp < measuredAt) revert InvalidWindow();
        _submitReport(policyId, realizedKwh, measuredAt, sourceHash, reporterSig, reporterNonce, true);
    }

    function submitManualProductionReport(
        uint256 policyId,
        uint256 realizedKwh,
        uint64 measuredAt,
        bytes32 sourceHash
    ) external nonReentrant onlyRole(REPORTER_ROLE) whenNotPaused {
        if (block.timestamp < measuredAt) revert InvalidWindow();
        _submitReport(policyId, realizedKwh, measuredAt, sourceHash, "", 0, false);
    }

    function _submitReport(
        uint256 policyId,
        uint256 realizedKwh,
        uint64 measuredAt,
        bytes32 sourceHash,
        bytes memory reporterSig,
        uint256 reporterNonce,
        bool requireSignature
    ) internal {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Active && policy.state != PolicyState.Reported) revert PolicyStateInvalid();
        if (block.timestamp > policy.reportDeadline) revert DeadlineMissed();
        if (measuredAt < policy.periodStart || measuredAt > policy.periodEnd) revert InvalidWindow();
        if (block.timestamp - measuredAt > maxReportDriftSeconds) revert InvalidWindow();
        if (policy.state == PolicyState.Reported) revert PolicyStateInvalid();

        address reporter = msg.sender;
        if (requireSignature) {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    block.chainid,
                    address(this),
                    policyId,
                    realizedKwh,
                    measuredAt,
                    reporterNonce
                )
            );
            bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", digest));
            reporter = ECDSA.recover(hash, reporterSig);
            if (!hasRole(REPORTER_ROLE, reporter)) revert UnauthorizedActor();
            if (reporterNonce != reportNonces[reporter]) revert UnauthorizedActor();
            reportNonces[reporter] = reporterNonce + 1;
        }

        policy.realizedKwh = realizedKwh;
        policy.reportAt = uint64(block.timestamp);
        policy.reporter = reporter;
        policy.sourceHash = sourceHash;
        policy.disputed = false;
        policy.state = PolicyState.Reported;
        policy.disputeDeadline = uint64(block.timestamp + disputeWindowSeconds);

        producers[policy.producerId].lastReportAt = uint64(block.timestamp);

        emit PolicyReportSubmitted(policyId, realizedKwh, measuredAt, reporter, sourceHash);
    }

    function requestDispute(uint256 policyId, string calldata reason) external onlyPolicyBuyer(policyId) {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Reported) revert PolicyStateInvalid();
        if (block.timestamp > policy.disputeDeadline) revert DeadlineMissed();
        policy.state = PolicyState.Disputed;
        policy.disputed = true;
        emit PolicyDisputed(policyId, msg.sender, reason);
    }

    function resolveDispute(
        uint256 policyId,
        uint256 realizedKwh,
        bytes32 sourceHash
    ) external onlyRole(AUDITOR_ROLE) {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Disputed) revert PolicyStateInvalid();
        policy.realizedKwh = realizedKwh;
        policy.sourceHash = sourceHash;
        _finalizePolicy(policyId);
        emit PolicyDisputeResolved(policyId, realizedKwh, sourceHash, msg.sender);
    }

    function finalizePolicy(uint256 policyId) external onlyPolicyBuyer(policyId) {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Reported) revert PolicyStateInvalid();
        if (policy.disputed) revert PolicyStateInvalid();
        if (block.timestamp <= policy.disputeDeadline) revert DeadlineMissed();
        _finalizePolicy(policyId);
    }

    function expirePolicy(uint256 policyId) external {
        FloorPolicy storage policy = policies[policyId];
        if (policy.state != PolicyState.Active) revert PolicyStateInvalid();
        if (block.timestamp <= policy.periodEnd + reportSubmissionWindowSeconds) revert InvalidWindow();

        policy.state = PolicyState.Expired;
        totalLockedLiquidity -= policy.lockedLiquidity;
        policy.lockedLiquidity = 0;
        emit PolicyExpired(policyId, policy.periodEnd);
    }

    function _finalizePolicy(uint256 policyId) internal nonReentrant {
        FloorPolicy storage policy = policies[policyId];
        require(policy.lockedLiquidity > 0, "already finalized");

        uint256 lossKwh = 0;
        if (policy.targetKwh > policy.realizedKwh) {
            lossKwh = policy.targetKwh - policy.realizedKwh;
        }
        uint256 payout = lossKwh * policy.floorPricePerKwh;
        if (payout > policy.maxPayout) payout = policy.maxPayout;

        policy.state = PolicyState.Settled;
        policy.payout = payout;
        policy.settledAt = uint64(block.timestamp);
        policy.disputed = false;

        uint256 lock = policy.lockedLiquidity;
        policy.lockedLiquidity = 0;
        totalLockedLiquidity -= lock;

        if (payout > 0) {
            if (settlementToken.balanceOf(address(this)) < payout) revert NotEnoughLiquidity();
            settlementToken.safeTransfer(policy.payer, payout);
        }

        emit PolicySettled(policyId, policy.realizedKwh, payout, policy.settledAt);
    }

    function depositLiquidity(uint256 amount) external nonReentrant onlyRole(LIQUIDITY_ROLE) {
        require(amount > 0, "amount required");
        settlementToken.safeTransferFrom(msg.sender, address(this), amount);
        emit LiquidityDeposited(msg.sender, amount, totalLockedLiquidity);
    }

    function withdrawLiquidity(uint256 amount, address destination) external nonReentrant onlyRole(LIQUIDITY_ROLE) {
        require(amount > 0, "amount required");
        require(destination != address(0), "invalid destination");
        require(freeLiquidity() >= amount, "active locks");
        settlementToken.safeTransfer(destination, amount);
        emit LiquidityWithdrawn(msg.sender, amount, destination, totalLockedLiquidity);
    }

    function freeLiquidity() public view returns (uint256) {
        uint256 balance = settlementToken.balanceOf(address(this));
        if (balance < totalLockedLiquidity) return 0;
        return balance - totalLockedLiquidity;
    }

    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "invalid treasury");
        address previous = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(previous, newTreasury);
    }

    function setPolicyParams(
        uint256 newMaxPremiumBps,
        uint256 newMinPremiumBps,
        uint256 newReportSubmissionWindowSeconds,
        uint256 newDisputeWindowSeconds,
        uint256 newMaxReportDriftSeconds
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMinPremiumBps > 0, "min premium required");
        require(newMinPremiumBps <= newMaxPremiumBps, "bad premium bounds");
        require(newReportSubmissionWindowSeconds >= 1 hours, "report window too short");
        require(newDisputeWindowSeconds > 0 && newDisputeWindowSeconds <= newReportSubmissionWindowSeconds, "dispute window invalid");
        require(newMaxReportDriftSeconds > 0 && newMaxReportDriftSeconds <= newReportSubmissionWindowSeconds, "drift too long");

        maxPremiumBps = newMaxPremiumBps;
        minPremiumBps = newMinPremiumBps;
        reportSubmissionWindowSeconds = newReportSubmissionWindowSeconds;
        disputeWindowSeconds = newDisputeWindowSeconds;
        maxReportDriftSeconds = newMaxReportDriftSeconds;

        emit ParametersUpdated(keccak256(bytes("maxPremiumBps")), maxPremiumBps);
        emit ParametersUpdated(keccak256(bytes("minPremiumBps")), minPremiumBps);
        emit ParametersUpdated(keccak256(bytes("reportWindow")), reportSubmissionWindowSeconds);
        emit ParametersUpdated(keccak256(bytes("disputeWindow")), disputeWindowSeconds);
        emit ParametersUpdated(keccak256(bytes("maxReportDrift")), maxReportDriftSeconds);
    }

    function getProducerIds(address owner, uint256 start, uint256 limit) external view returns (bytes32[] memory ids, uint256 nextStart) {
        bytes32[] storage list = producersByOwner[owner];
        if (start >= list.length) {
            return (new bytes32[](0), start);
        }

        uint256 end = start + limit;
        if (limit == 0 || end > list.length) {
            end = list.length;
        }
        uint256 length = end - start;
        ids = new bytes32[](length);
        for (uint256 i = 0; i < length; i++) {
            ids[i] = list[start + i];
        }
        nextStart = end;
    }

    function getPolicyIdsForPayer(address payer, uint256 start, uint256 limit) external view returns (uint256[] memory ids, uint256 nextStart) {
        uint256[] storage list = policiesByPayer[payer];
        if (start >= list.length) {
            return (new uint256[](0), start);
        }

        uint256 end = start + limit;
        if (limit == 0 || end > list.length) {
            end = list.length;
        }
        uint256 length = end - start;
        ids = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            ids[i] = list[start + i];
        }
        nextStart = end;
    }

    function policyState(uint256 policyId) public view returns (uint8) {
        return uint8(policies[policyId].state);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}

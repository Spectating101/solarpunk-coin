// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ProtocolTreasury
 * @notice Fee vault, budget router, and bond escrow for the SolarPunk protocol.
 * @dev Receives mint/redemption fees, liquidation penalties, and bonded collateral.
 *      Budget splits are configurable so future ops can route funds into reserve,
 *      insurance, operations, and audit buckets without changing the source contracts.
 */
contract ProtocolTreasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant BUDGET_MANAGER_ROLE = keccak256("BUDGET_MANAGER_ROLE");
    bytes32 public constant SLASHER_ROLE = keccak256("SLASHER_ROLE");

    bytes32 private constant BUCKET_RESERVE = keccak256("RESERVE");
    bytes32 private constant BUCKET_INSURANCE = keccak256("INSURANCE");
    bytes32 private constant BUCKET_OPS = keccak256("OPS");
    bytes32 private constant BUCKET_AUDIT = keccak256("AUDIT");

    struct BudgetPolicy {
        uint16 reserveBps;
        uint16 insuranceBps;
        uint16 opsBps;
        uint16 auditBps;
    }

    IERC20 public immutable reserveToken;
    address public reserveVault;
    address public insuranceVault;
    address public opsVault;
    address public auditVault;

    uint256 public bondCooldown = 1 days;
    uint256 public governanceDelay = 0;

    BudgetPolicy public budgetPolicy;
    mapping(address => uint256) public keeperBonds;
    mapping(address => uint256) public keeperBondUnlockAt;

    event BudgetPolicyUpdated(
        uint16 reserveBps,
        uint16 insuranceBps,
        uint16 opsBps,
        uint16 auditBps
    );
    event BudgetVaultsUpdated(
        address indexed reserveVault,
        address indexed insuranceVault,
        address indexed opsVault,
        address auditVault
    );
    event BondCooldownUpdated(uint256 bondCooldown);
    event BondDeposited(address indexed keeper, uint256 amount, uint256 unlockAt);
    event BondWithdrawn(address indexed keeper, uint256 amount);
    event BondSlashed(address indexed keeper, address indexed to, uint256 amount);
    event TreasuryDisbursed(address indexed token, address indexed to, uint256 amount, bytes32 indexed bucket);
    event GovernanceDelayUpdated(uint256 newDelay);
    event GovernanceActionQueued(bytes32 indexed actionId, uint256 executeAfter);
    event GovernanceActionCancelled(bytes32 indexed actionId);
    event GovernanceActionConsumed(bytes32 indexed actionId);
    event OperatorRoleUpdated(bytes32 indexed role, address indexed operator, bool granted);

    mapping(bytes32 => uint256) public queuedGovernanceActions;

    constructor(address reserveTokenAddress) {
        require(reserveTokenAddress != address(0), "reserve token required");

        reserveToken = IERC20(reserveTokenAddress);
        reserveVault = msg.sender;
        insuranceVault = msg.sender;
        opsVault = msg.sender;
        auditVault = msg.sender;
        budgetPolicy = BudgetPolicy({
            reserveBps: 4_000,
            insuranceBps: 2_500,
            opsBps: 2_500,
            auditBps: 1_000
        });

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BUDGET_MANAGER_ROLE, msg.sender);
        _grantRole(SLASHER_ROLE, msg.sender);
    }

    function setBudgetPolicy(
        uint16 reserveBps,
        uint16 insuranceBps,
        uint16 opsBps,
        uint16 auditBps
    ) external onlyRole(DEFAULT_ADMIN_ROLE) onlyGovernanceApproved(actionIdSetBudgetPolicy(reserveBps, insuranceBps, opsBps, auditBps)) {
        require(
            uint256(reserveBps) + insuranceBps + opsBps + auditBps == 10_000,
            "invalid policy"
        );

        budgetPolicy = BudgetPolicy({
            reserveBps: reserveBps,
            insuranceBps: insuranceBps,
            opsBps: opsBps,
            auditBps: auditBps
        });

        emit BudgetPolicyUpdated(reserveBps, insuranceBps, opsBps, auditBps);
    }

    function setBudgetVaults(
        address newReserveVault,
        address newInsuranceVault,
        address newOpsVault,
        address newAuditVault
    ) external onlyRole(DEFAULT_ADMIN_ROLE) onlyGovernanceApproved(actionIdSetBudgetVaults(newReserveVault, newInsuranceVault, newOpsVault, newAuditVault)) {
        require(newReserveVault != address(0), "invalid reserve vault");
        require(newInsuranceVault != address(0), "invalid insurance vault");
        require(newOpsVault != address(0), "invalid ops vault");
        require(newAuditVault != address(0), "invalid audit vault");

        reserveVault = newReserveVault;
        insuranceVault = newInsuranceVault;
        opsVault = newOpsVault;
        auditVault = newAuditVault;

        emit BudgetVaultsUpdated(newReserveVault, newInsuranceVault, newOpsVault, newAuditVault);
    }

    function setBondCooldown(uint256 newBondCooldown)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyGovernanceApproved(actionIdSetBondCooldown(newBondCooldown))
    {
        require(newBondCooldown <= 30 days, "bond cooldown too high");
        bondCooldown = newBondCooldown;
        emit BondCooldownUpdated(newBondCooldown);
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
        require(role == BUDGET_MANAGER_ROLE || role == SLASHER_ROLE, "unsupported role");

        if (shouldGrant) {
            grantRole(role, operator);
        } else {
            revokeRole(role, operator);
        }
        emit OperatorRoleUpdated(role, operator, shouldGrant);
    }

    function actionIdSetBudgetPolicy(
        uint16 reserveBps,
        uint16 insuranceBps,
        uint16 opsBps,
        uint16 auditBps
    ) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_BUDGET_POLICY", reserveBps, insuranceBps, opsBps, auditBps));
    }

    function actionIdSetBudgetVaults(
        address newReserveVault,
        address newInsuranceVault,
        address newOpsVault,
        address newAuditVault
    ) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_BUDGET_VAULTS", newReserveVault, newInsuranceVault, newOpsVault, newAuditVault));
    }

    function actionIdSetBondCooldown(uint256 newBondCooldown) public pure returns (bytes32) {
        return keccak256(abi.encode("SET_BOND_COOLDOWN", newBondCooldown));
    }

    function actionIdSetOperatorRole(bytes32 role, address operator, bool shouldGrant)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode("SET_OPERATOR_ROLE", role, operator, shouldGrant));
    }

    function depositBond(uint256 amount) external nonReentrant {
        require(amount > 0, "amount must be > 0");

        reserveToken.safeTransferFrom(msg.sender, address(this), amount);
        keeperBonds[msg.sender] += amount;
        keeperBondUnlockAt[msg.sender] = block.timestamp + bondCooldown;

        emit BondDeposited(msg.sender, amount, keeperBondUnlockAt[msg.sender]);
    }

    function withdrawBond(uint256 amount) external nonReentrant {
        require(amount > 0, "amount must be > 0");
        require(block.timestamp >= keeperBondUnlockAt[msg.sender], "bond locked");

        uint256 bondedAmount = keeperBonds[msg.sender];
        require(amount <= bondedAmount, "insufficient bond");

        keeperBonds[msg.sender] = bondedAmount - amount;
        reserveToken.safeTransfer(msg.sender, amount);

        emit BondWithdrawn(msg.sender, amount);
    }

    function slashBond(address keeper, address to, uint256 amount)
        external
        onlyRole(SLASHER_ROLE)
        nonReentrant
    {
        require(keeper != address(0), "invalid keeper");
        require(to != address(0), "invalid recipient");
        require(amount > 0, "amount must be > 0");

        uint256 bondedAmount = keeperBonds[keeper];
        require(amount <= bondedAmount, "insufficient bond");

        keeperBonds[keeper] = bondedAmount - amount;
        reserveToken.safeTransfer(to, amount);

        emit BondSlashed(keeper, to, amount);
    }

    function previewBudget(uint256 amount)
        public
        view
        returns (uint256 reserveAmount, uint256 insuranceAmount, uint256 opsAmount, uint256 auditAmount)
    {
        reserveAmount = (amount * budgetPolicy.reserveBps) / 10_000;
        insuranceAmount = (amount * budgetPolicy.insuranceBps) / 10_000;
        opsAmount = (amount * budgetPolicy.opsBps) / 10_000;
        auditAmount = amount - reserveAmount - insuranceAmount - opsAmount;
    }

    function disburseToken(address token, uint256 amount)
        public
        onlyRole(BUDGET_MANAGER_ROLE)
        nonReentrant
    {
        _disburseToken(token, amount);
    }

    function _disburseToken(address token, uint256 amount) internal {
        require(token != address(0), "invalid token");
        require(amount > 0, "amount must be > 0");

        IERC20 tokenContract = IERC20(token);
        (uint256 reserveAmount, uint256 insuranceAmount, uint256 opsAmount, uint256 auditAmount) =
            previewBudget(amount);

        if (reserveAmount > 0) {
            tokenContract.safeTransfer(reserveVault, reserveAmount);
            emit TreasuryDisbursed(token, reserveVault, reserveAmount, BUCKET_RESERVE);
        }
        if (insuranceAmount > 0) {
            tokenContract.safeTransfer(insuranceVault, insuranceAmount);
            emit TreasuryDisbursed(token, insuranceVault, insuranceAmount, BUCKET_INSURANCE);
        }
        if (opsAmount > 0) {
            tokenContract.safeTransfer(opsVault, opsAmount);
            emit TreasuryDisbursed(token, opsVault, opsAmount, BUCKET_OPS);
        }
        if (auditAmount > 0) {
            tokenContract.safeTransfer(auditVault, auditAmount);
            emit TreasuryDisbursed(token, auditVault, auditAmount, BUCKET_AUDIT);
        }
    }

    function disburseReserveToken(uint256 amount)
        external
        onlyRole(BUDGET_MANAGER_ROLE)
        nonReentrant
    {
        _disburseToken(address(reserveToken), amount);
    }

    function treasuryBalance(address token) external view returns (uint256) {
        require(token != address(0), "invalid token");
        return IERC20(token).balanceOf(address(this));
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

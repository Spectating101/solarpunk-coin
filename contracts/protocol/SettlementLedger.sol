// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ClaimRegistry} from "./ClaimRegistry.sol";

/// @title SettlementLedger
/// @notice Records explicit claim obligations against declared settlement capacity.
/// @dev Capacity is an input to this ledger. The contract does not custody reserves or prove legal redemption rights.
contract SettlementLedger is AccessControl {
    bytes32 public constant SETTLEMENT_OPERATOR_ROLE = keccak256("SETTLEMENT_OPERATOR_ROLE");

    struct SettlementRecord {
        uint128 outstandingQuantity;
        uint128 declaredCapacity;
        uint128 coveredQuantity;
        uint128 shortfallQuantity;
        uint64 recordedAt;
    }

    ClaimRegistry public immutable claimRegistry;
    mapping(bytes32 claimId => SettlementRecord record) private _latestSettlement;

    event SettlementEvaluated(
        bytes32 indexed claimId,
        uint128 outstandingQuantity,
        uint128 declaredCapacity,
        uint128 coveredQuantity,
        uint128 shortfallQuantity
    );

    error InvalidRegistry();
    error ClaimHasNoIssuedQuantity();

    constructor(address admin, ClaimRegistry registry) {
        if (address(registry) == address(0)) revert InvalidRegistry();
        claimRegistry = registry;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SETTLEMENT_OPERATOR_ROLE, admin);
    }

    function evaluateSettlement(
        bytes32 claimId,
        uint128 declaredCapacity
    ) external onlyRole(SETTLEMENT_OPERATOR_ROLE) returns (SettlementRecord memory record) {
        uint128 outstanding = claimRegistry.issuedQuantity(claimId);
        if (outstanding == 0) revert ClaimHasNoIssuedQuantity();

        uint128 covered = declaredCapacity > outstanding ? outstanding : declaredCapacity;
        uint128 shortfall = outstanding - covered;
        record = SettlementRecord({
            outstandingQuantity: outstanding,
            declaredCapacity: declaredCapacity,
            coveredQuantity: covered,
            shortfallQuantity: shortfall,
            recordedAt: uint64(block.timestamp)
        });
        _latestSettlement[claimId] = record;
        claimRegistry.recordSettlementResult(claimId, covered, shortfall);

        emit SettlementEvaluated(claimId, outstanding, declaredCapacity, covered, shortfall);
    }

    function latestSettlement(bytes32 claimId) external view returns (SettlementRecord memory) {
        return _latestSettlement[claimId];
    }
}

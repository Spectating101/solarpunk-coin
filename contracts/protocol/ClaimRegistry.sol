// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ClaimRegistry
/// @notice Minimal public-alpha state machine for bounded claims admitted under an external policy.
/// @dev This registry does not represent token ownership, legal redemption rights, or reserve custody.
contract ClaimRegistry is AccessControl {
    bytes32 public constant CLAIM_ISSUER_ROLE = keccak256("CLAIM_ISSUER_ROLE");
    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");

    enum ClaimState {
        None,
        Admitted,
        Issued,
        Active,
        SettlementDue,
        Settled,
        Partial,
        Shortfall,
        Disputed,
        Revoked,
        Expired
    }

    struct Claim {
        bytes32 evidenceHash;
        bytes32 policyId;
        uint128 admittedQuantity;
        uint128 issuedQuantity;
        address subject;
        ClaimState state;
        uint64 createdAt;
    }

    mapping(bytes32 claimId => Claim claim) private _claims;

    event ClaimCreated(
        bytes32 indexed claimId,
        bytes32 indexed evidenceHash,
        bytes32 indexed policyId,
        uint128 admittedQuantity,
        address subject
    );
    event ClaimIssued(bytes32 indexed claimId, uint128 quantity);
    event ClaimStateChanged(bytes32 indexed claimId, ClaimState fromState, ClaimState toState, bytes32 reasonCode);
    event ClaimSettlementRecorded(bytes32 indexed claimId, uint128 coveredQuantity, uint128 shortfallQuantity, ClaimState resultState);

    error ClaimAlreadyExists();
    error ClaimNotFound();
    error InvalidClaimInput();
    error InvalidState();
    error QuantityExceedsAdmission();
    error SettlementDoesNotReconcile();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CLAIM_ISSUER_ROLE, admin);
    }

    function createClaim(
        bytes32 claimId,
        bytes32 evidenceHash,
        bytes32 policyId,
        uint128 admittedQuantity,
        address subject
    ) external onlyRole(CLAIM_ISSUER_ROLE) {
        if (_claims[claimId].state != ClaimState.None) revert ClaimAlreadyExists();
        if (
            claimId == bytes32(0) ||
            evidenceHash == bytes32(0) ||
            policyId == bytes32(0) ||
            admittedQuantity == 0 ||
            subject == address(0)
        ) revert InvalidClaimInput();

        _claims[claimId] = Claim({
            evidenceHash: evidenceHash,
            policyId: policyId,
            admittedQuantity: admittedQuantity,
            issuedQuantity: 0,
            subject: subject,
            state: ClaimState.Admitted,
            createdAt: uint64(block.timestamp)
        });

        emit ClaimCreated(claimId, evidenceHash, policyId, admittedQuantity, subject);
    }

    function issueClaim(bytes32 claimId, uint128 quantity) external onlyRole(CLAIM_ISSUER_ROLE) {
        Claim storage claim = _claim(claimId);
        if (claim.state != ClaimState.Admitted) revert InvalidState();
        if (quantity == 0 || quantity > claim.admittedQuantity) revert QuantityExceedsAdmission();
        claim.issuedQuantity = quantity;
        _transition(claimId, claim, ClaimState.Issued, keccak256("BOUNDED_ISSUANCE"));
        emit ClaimIssued(claimId, quantity);
    }

    function activateClaim(bytes32 claimId) external onlyRole(CLAIM_ISSUER_ROLE) {
        Claim storage claim = _claim(claimId);
        if (claim.state != ClaimState.Issued) revert InvalidState();
        _transition(claimId, claim, ClaimState.Active, keccak256("ACTIVATE"));
    }

    function markDisputed(bytes32 claimId, bytes32 reasonCode) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Claim storage claim = _claim(claimId);
        if (claim.state != ClaimState.Active && claim.state != ClaimState.SettlementDue && claim.state != ClaimState.Partial && claim.state != ClaimState.Shortfall) {
            revert InvalidState();
        }
        _transition(claimId, claim, ClaimState.Disputed, reasonCode);
    }

    function revokeClaim(bytes32 claimId, bytes32 reasonCode) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Claim storage claim = _claim(claimId);
        if (claim.state == ClaimState.Settled || claim.state == ClaimState.Revoked || claim.state == ClaimState.Expired) revert InvalidState();
        _transition(claimId, claim, ClaimState.Revoked, reasonCode);
    }

    function recordSettlementResult(
        bytes32 claimId,
        uint128 coveredQuantity,
        uint128 shortfallQuantity
    ) external onlyRole(SETTLEMENT_ROLE) {
        Claim storage claim = _claim(claimId);
        if (
            claim.state != ClaimState.Active &&
            claim.state != ClaimState.SettlementDue &&
            claim.state != ClaimState.Partial &&
            claim.state != ClaimState.Shortfall
        ) revert InvalidState();
        if (uint256(coveredQuantity) + uint256(shortfallQuantity) != claim.issuedQuantity) {
            revert SettlementDoesNotReconcile();
        }

        if (claim.state != ClaimState.SettlementDue) {
            _transition(claimId, claim, ClaimState.SettlementDue, keccak256("SETTLEMENT_DUE"));
        }

        ClaimState resultState;
        if (shortfallQuantity == 0) resultState = ClaimState.Settled;
        else if (coveredQuantity == 0) resultState = ClaimState.Shortfall;
        else resultState = ClaimState.Partial;

        _transition(claimId, claim, resultState, keccak256("SETTLEMENT_RESULT"));
        emit ClaimSettlementRecorded(claimId, coveredQuantity, shortfallQuantity, resultState);
    }

    function getClaim(bytes32 claimId) external view returns (Claim memory) {
        Claim memory claim = _claims[claimId];
        if (claim.state == ClaimState.None) revert ClaimNotFound();
        return claim;
    }

    function issuedQuantity(bytes32 claimId) external view returns (uint128) {
        return _claimView(claimId).issuedQuantity;
    }

    function claimState(bytes32 claimId) external view returns (ClaimState) {
        return _claimView(claimId).state;
    }

    function _claim(bytes32 claimId) private view returns (Claim storage claim) {
        claim = _claims[claimId];
        if (claim.state == ClaimState.None) revert ClaimNotFound();
    }

    function _claimView(bytes32 claimId) private view returns (Claim storage claim) {
        claim = _claims[claimId];
        if (claim.state == ClaimState.None) revert ClaimNotFound();
    }

    function _transition(
        bytes32 claimId,
        Claim storage claim,
        ClaimState toState,
        bytes32 reasonCode
    ) private {
        ClaimState fromState = claim.state;
        claim.state = toState;
        emit ClaimStateChanged(claimId, fromState, toState, reasonCode);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PolicyRegistry
/// @notice Versioned registry of constraint-policy manifests. The contract stores hashes and URIs,
///         not arbitrary policy execution. Deterministic policy engines can independently verify
///         the manifest hash before evaluating evidence.
contract PolicyRegistry is AccessControl {
    bytes32 public constant POLICY_PUBLISHER_ROLE = keccak256("POLICY_PUBLISHER_ROLE");

    struct Policy {
        bytes32 manifestHash;
        uint64 version;
        address authority;
        bool active;
        string uri;
    }

    mapping(bytes32 policyId => Policy policy) private _policies;

    event PolicyPublished(
        bytes32 indexed policyId,
        uint64 indexed version,
        bytes32 indexed manifestHash,
        address authority,
        string uri
    );
    event PolicyDeactivated(bytes32 indexed policyId, uint64 indexed version, address authority);

    error InvalidPolicyId();
    error InvalidManifestHash();
    error VersionMustIncrease();
    error PolicyNotFound();

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(POLICY_PUBLISHER_ROLE, admin);
    }

    function publishPolicy(
        bytes32 policyId,
        bytes32 manifestHash,
        uint64 version,
        string calldata uri
    ) external onlyRole(POLICY_PUBLISHER_ROLE) {
        if (policyId == bytes32(0)) revert InvalidPolicyId();
        if (manifestHash == bytes32(0)) revert InvalidManifestHash();

        Policy storage current = _policies[policyId];
        if (current.version != 0 && version <= current.version) revert VersionMustIncrease();

        _policies[policyId] = Policy({
            manifestHash: manifestHash,
            version: version,
            authority: msg.sender,
            active: true,
            uri: uri
        });

        emit PolicyPublished(policyId, version, manifestHash, msg.sender, uri);
    }

    function deactivatePolicy(bytes32 policyId) external onlyRole(POLICY_PUBLISHER_ROLE) {
        Policy storage policy = _policies[policyId];
        if (policy.version == 0) revert PolicyNotFound();
        policy.active = false;
        emit PolicyDeactivated(policyId, policy.version, msg.sender);
    }

    function getPolicy(bytes32 policyId) external view returns (Policy memory) {
        Policy memory policy = _policies[policyId];
        if (policy.version == 0) revert PolicyNotFound();
        return policy;
    }
}

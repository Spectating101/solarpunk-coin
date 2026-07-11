# Constraint Policy Manifest v1

Public Alpha treats policies as versioned, hashable rule objects rather than hard-coded product narratives.

Schema identifier:

```text
solarpunk.constraint.policy_manifest.v1
```

## Canonical committed manifests

The executable built-in policies have exact JSON manifests under:

```text
protocol/policies/LAB-OPEN-001.json
protocol/policies/ENERGY-PILOT-002.json
protocol/policies/ENERGY-STRICT-003.json
protocol/policies/SPK-ENERGY-001.json
```

CI compares each committed JSON object with the evaluator's canonical `policyManifestBody()` output. A drift between documentation and executable policy fails the conformance test.

## Minimum manifest shape

```json
{
  "schema": "solarpunk.constraint.policy_manifest.v1",
  "id": "ENERGY-PILOT-002",
  "version": "1.0.0",
  "name": "Risk-boxed Energy Pilot",
  "description": "Closed-pilot candidate policy for signed live inverter or gateway counters with a provenance haircut and bounded claim size.",
  "min_provenance_level": "L2",
  "admission": {
    "require_positive_surplus": true,
    "require_zero_blockers": true,
    "require_signed_evidence": true,
    "require_external_corroboration": false
  },
  "issuance": {
    "unit": "ENERGY_CLAIM_UNIT",
    "decimals": 6,
    "rate_per_surplus_kwh": 1,
    "haircut_pct": 30,
    "absolute_cap": 2500
  },
  "settlement": {
    "explicit_capacity_required": true,
    "legal_redemption_not_implied": true
  },
  "governance": {
    "authority": "named pilot policy authority",
    "mutable_by": "governed policy registry"
  }
}
```

## Canonical hash

`@solarpunk/constraint-core` constructs the canonical manifest body, serializes it with stable recursively sorted object keys, and computes SHA-256.

```text
policy manifest JSON object
        ↓
policyManifestBody(policy)
        ↓
stableStringify(sorted keys)
        ↓
SHA-256
        ↓
32-byte manifest hash
```

Whitespace and JSON file indentation do not affect the hash. Changing a policy field does.

`PolicyRegistry.sol` stores the 32-byte hash and URI. It does not parse arbitrary JSON or execute the policy in Solidity.

## Registry version mapping

Human policy versions use semantic `major.minor.patch`.

The alpha maps them to the monotonic `uint64` registry version:

```text
major * 1,000,000 + minor * 1,000 + patch
```

Examples:

```text
1.0.0 → 1,000,000
1.2.3 → 1,002,003
```

Each semantic component is limited to 0-999 in Public Alpha.

## Evaluation order

1. Check provenance rank against the policy minimum.
2. Check positive admitted surplus when required.
3. Check envelope-level blockers.
4. Check signature capability when required.
5. Check external corroboration when required.
6. Compute gross claim quantity from evidence surplus and policy rate.
7. Apply the policy haircut.
8. Apply the absolute policy cap.
9. Return `ADMIT_WITH_LIMIT` or `BLOCKED` with explicit reasons.

Rejected rows in a signed evidence bundle are excluded from the accepted subset. They are warnings when valid accepted attestations remain; they become an envelope blocker only when no accepted evidence remains.

## Public-alpha policies

| Policy | Min provenance | Signed | External corroboration | Haircut | Cap | Decimals |
|---|---|---|---|---:|---:|---:|
| `LAB-OPEN-001` | L0 | no | no | 0% | 10,000 | 6 |
| `ENERGY-PILOT-002` | L2 | yes | no | 30% | 2,500 | 6 |
| `ENERGY-STRICT-003` | L4 | yes | yes | 5% | 50,000 | 6 |
| `SPK-ENERGY-001` | L1 | yes | no | 60% | 250 | 6 |

`LAB-OPEN-001` is deliberately non-live and illustrative. It exists to make the public workbench executable without misrepresenting sample evidence as pilot-grade provenance.

## On-chain binding and trust boundary

`PolicyRegistry.sol` stores:

- policy identifier;
- monotonically increasing numeric registry version;
- manifest hash;
- publisher/authority;
- active flag;
- external URI.

`ClaimRegistry.sol` accepts a claim only when the supplied policy version and manifest hash exactly match the active registry entry.

The authorized `CLAIM_ISSUER_ROLE` still attests that deterministic off-chain policy evaluation was performed. Public Alpha does **not** prove arbitrary JavaScript policy execution inside the EVM. The registry binds the claim to a public rule object; it does not remove issuer governance risk.

A future protocol version may investigate constrained WASM, optimistic execution proofs, or zero-knowledge policy execution. Those are explicitly outside Public Alpha.

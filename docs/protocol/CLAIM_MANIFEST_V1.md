# Constraint Claim Manifest v1

Schema identifier:

```text
solarpunk.constraint.claim_manifest.v1
```

A claim manifest binds one deterministic evidence envelope to one exact versioned policy manifest and records the maximum admitted quantity before issuance.

## Required fields

| Field | Meaning |
|---|---|
| `claim_id` | Deterministic SHA-256 identifier over evidence, policy binding, subject, scaled quantity, and unit |
| `evidence_hash` | SHA-256 evidence-envelope hash |
| `policy_id` | Policy identifier |
| `policy_version` | Semantic policy version that evaluated the evidence |
| `policy_manifest_hash` | SHA-256 hash of the exact canonical policy manifest |
| `provenance_level` | L0-L4 evidence-assurance class at evaluation time |
| `subject` | Claim subject or local simulation subject |
| `quantity` | Human-readable maximum admitted quantity |
| `quantity_base_units` | Decimal-safe integer quantity encoded as a string |
| `quantity_decimals` | Decimal scale declared by the policy |
| `unit` | Policy-declared claim unit |
| `decision` | `ADMIT_WITH_LIMIT` or `BLOCKED` |
| `state` | Current claim state |
| `settlement_capacity_required` | Whether settlement capacity must be explicitly modeled |
| `blockers` | Deterministic reasons the policy blocked admission |
| `warnings` | Non-blocking boundaries and risk notes |
| `history` | Ordered state-transition history |

## Policy binding

A claim ID includes:

```text
evidence_hash
policy_id
policy_version
policy_manifest_hash
subject
quantity_base_units
quantity_decimals
unit
```

Changing the rule, rule version, admitted amount, evidence, subject, or unit produces a different claim ID.

The reference `ClaimRegistry.sol` also checks that `policy_manifest_hash` and the numeric policy version match the active entry in `PolicyRegistry.sol` before admitting a claim.

## Decimal-safe quantities

Policy manifests declare `issuance.decimals` from 0 to 18.

Example:

```text
quantity            = 996.2 CLAIM_UNIT
quantity_decimals   = 6
quantity_base_units = 996200000
```

The shared core provides:

```text
quantityToBaseUnits()
baseUnitsToQuantityString()
```

Hidden precision beyond the policy's declared decimals is rejected rather than silently rounded into a contract quantity.

## State machine

The alpha implementation permits:

```text
RAW -> NORMALIZED | BLOCKED
NORMALIZED -> VERIFIED | BLOCKED
VERIFIED -> ADMITTED | BLOCKED
ADMITTED -> ISSUABLE | REVOKED | EXPIRED
ISSUABLE -> ISSUED | REVOKED | EXPIRED
ISSUED -> ACTIVE | REVOKED
ACTIVE -> SETTLEMENT_DUE | DISPUTED | REVOKED | EXPIRED
SETTLEMENT_DUE -> SETTLED | PARTIAL | SHORTFALL | DISPUTED
PARTIAL -> SETTLEMENT_DUE | SETTLED | SHORTFALL | DISPUTED
SHORTFALL -> SETTLEMENT_DUE | SETTLED | DISPUTED
DISPUTED -> ACTIVE | REVOKED | EXPIRED
```

`BLOCKED`, `SETTLED`, `REVOKED`, and `EXPIRED` are terminal in Public Alpha.

The browser/SDK state model is intentionally richer than the minimal EVM reference registry. The contract starts at `Admitted` because normalization and verification are off-chain evidence-processing stages.

## Settlement result

A settlement result binds to `claim_id` and records:

```text
outstanding claim quantity
explicit settlement capacity
covered quantity
shortfall quantity
result: SETTLED | PARTIAL | SHORTFALL
```

Human-readable quantities and decimal-safe base-unit strings are both included in the local result.

## Boundary

The manifest is a protocol decision record. It is not a bearer instrument and does not by itself establish title, beneficial ownership, environmental-attribute ownership, reserve custody, or enforceable redemption rights.

`ClaimRegistry` binds a role-gated claim assertion to an active policy manifest. Public Alpha does not cryptographically prove arbitrary off-chain policy execution inside the EVM.

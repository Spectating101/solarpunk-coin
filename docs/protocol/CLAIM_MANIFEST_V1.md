# Constraint Claim Manifest v1

Schema identifier:

```text
solarpunk.constraint.claim_manifest.v1
```

A claim manifest binds one evidence envelope to one versioned policy decision and records the maximum admitted quantity before issuance.

## Required fields

| Field | Meaning |
|---|---|
| `claim_id` | Deterministic SHA-256 identifier over evidence, policy, subject, quantity, and unit |
| `evidence_hash` | SHA-256 evidence-envelope hash |
| `policy_id` | Policy identifier |
| `policy_version` | Policy version that evaluated the evidence |
| `provenance_level` | L0-L4 evidence-assurance class at evaluation time |
| `subject` | Claim subject or local simulation subject |
| `quantity` | Maximum admitted quantity |
| `unit` | Policy-declared claim unit |
| `decision` | `ADMIT_WITH_LIMIT` or `BLOCKED` |
| `state` | Current claim state |
| `settlement_capacity_required` | Whether settlement capacity must be explicitly modeled |
| `blockers` | Deterministic reasons the policy blocked admission |
| `warnings` | Non-blocking boundaries and risk notes |
| `history` | Ordered state-transition history |

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

## Boundary

The manifest is a protocol decision record. It is not a bearer instrument and does not by itself establish title, beneficial ownership, environmental-attribute ownership, or enforceable redemption rights.

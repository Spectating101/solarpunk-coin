# Constraint Protocol JSON Schemas

Public Alpha publishes machine-readable Draft 2020-12 JSON Schemas for its four portable protocol objects and the provenance decision.

| Schema | Runtime identifier |
|---|---|
| `evidence-envelope.v1.schema.json` | `solarpunk.constraint.evidence_envelope.v1` |
| `provenance-decision.v1.schema.json` | `solarpunk.constraint.provenance_decision.v1` |
| `policy-manifest.v1.schema.json` | `solarpunk.constraint.policy_manifest.v1` |
| `claim-manifest.v1.schema.json` | `solarpunk.constraint.claim_manifest.v1` |
| `settlement-result.v1.schema.json` | `solarpunk.constraint.settlement_result.v1` |

These schemas define portable object shapes. They do not certify the truth of evidence or the authority of an issuer.

## Deterministic identity

The evidence, policy, and claim objects also use deterministic hashes implemented by `@solarpunk/constraint-core`.

A JSON object can be structurally schema-valid while still failing:

- evidence diagnostics;
- provenance classification;
- policy admission;
- policy manifest hash binding;
- settlement coverage.

Schema validation is therefore a syntax/interoperability layer, not the financial decision.

## Compatibility rule

Public Alpha uses explicit schema identifiers ending in `.v1`.

A future incompatible object shape must use a new identifier and schema file. Policy content changes use the policy's semantic version and manifest hash rather than changing the generic policy schema identifier.

# Constraint Protocol JSON Schemas

Public Alpha publishes machine-readable Draft 2020-12 JSON Schemas for portable protocol objects and the provenance decision. The case-workbench V2 branch extends that portable object set without changing the existing v1 evidence, provenance, policy, claim, or settlement identifiers.

| Schema | Runtime identifier |
|---|---|
| `evidence-envelope.v1.schema.json` | `solarpunk.constraint.evidence_envelope.v1` |
| `provenance-decision.v1.schema.json` | `solarpunk.constraint.provenance_decision.v1` |
| `policy-manifest.v1.schema.json` | `solarpunk.constraint.policy_manifest.v1` |
| `policy-manifest.v2.schema.json` | `solarpunk.constraint.policy_manifest.v2` |
| `claim-manifest.v1.schema.json` | `solarpunk.constraint.claim_manifest.v1` |
| `settlement-result.v1.schema.json` | `solarpunk.constraint.settlement_result.v1` |
| `case-manifest.v1.schema.json` | `solarpunk.constraint.case_manifest.v1` |
| `context-manifest.v1.schema.json` | `solarpunk.constraint.context_manifest.v1` |
| `constraint-evaluation.v1.schema.json` | `solarpunk.constraint.constraint_evaluation.v1` |
| `decision-result.v1.schema.json` | `solarpunk.constraint.decision_result.v1` |
| `decision-receipt.v1.schema.json` | `solarpunk.constraint.decision_receipt.v1` |

These schemas define portable object shapes. They do not certify the truth of evidence or the authority of an issuer.

## Policy schema split

`policy_manifest.v1` remains the Public Alpha fixed-haircut policy shape used by the existing Claim Lab.

`policy_manifest.v2` is the case-workbench rule-list shape. It declares ordered admission and quantity rules by calculator ID and parameter object. Existing v1 policy IDs are not reused with different rule semantics.

The V2 policy schema does not define a universal rules language. It references a bounded deterministic calculator registry published by the core package.

## Case-workbench decision boundary

The V2 portable objects separate three rule classes:

```text
ADMISSION_GATE
QUANTITY_CEILING
SETTLEMENT_CONSTRAINT
```

Admission gates determine whether quantity evaluation may proceed. Applicable quantity ceilings must use the same claim unit and decimal semantics before a minimum can be attributed as binding. Settlement remains a separate obligation-stage evaluation.

A `DecisionResult` is therefore a deterministic research decision under declared inputs. It is not legal issuance authority.

`DecisionReceipt` adds evaluation time, runtime/source revision, and a shareable rule summary around a deterministic `decision_id`. The receipt does not change the underlying decision identity.

## Deterministic identity

The evidence, policy, claim, case, context, constraint-evaluation, and decision objects use deterministic hashes implemented by `@solarpunk/constraint-core` where their object contracts define identity.

A JSON object can be structurally schema-valid while still failing:

- evidence diagnostics;
- provenance classification;
- policy admission;
- policy manifest hash binding;
- typed admission rules;
- quantity-unit compatibility;
- binding-capacity evaluation;
- settlement coverage.

Schema validation is therefore a syntax/interoperability layer, not the financial decision.

## Compatibility rule

Published portable objects use explicit schema identifiers ending in `.v1` or another explicit version suffix.

A future incompatible object shape must use a new identifier and schema file. Policy content changes use the policy's semantic version and manifest hash rather than changing a generic policy schema identifier. Existing v1 policy IDs must not be silently reused with different V2 rule semantics.

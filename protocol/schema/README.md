# Constraint Protocol JSON Schemas

Public Alpha publishes machine-readable Draft 2020-12 JSON Schemas for portable protocol objects and the provenance decision. The case-workbench V2 object set extends the portable contracts without changing the existing v1 evidence, provenance, policy, claim, or settlement identifiers.

| Schema | Runtime identifier |
|---|---|
| `evidence-envelope.v1.schema.json` | `solarpunk.constraint.evidence_envelope.v1` |
| `provenance-decision.v1.schema.json` | `solarpunk.constraint.provenance_decision.v1` |
| `provenance-scenario.v1.schema.json` | `solarpunk.constraint.provenance_scenario.v1` |
| `policy-manifest.v1.schema.json` | `solarpunk.constraint.policy_manifest.v1` |
| `policy-manifest.v2.schema.json` | `solarpunk.constraint.policy_manifest.v2` |
| `claim-manifest.v1.schema.json` | `solarpunk.constraint.claim_manifest.v1` |
| `settlement-result.v1.schema.json` | `solarpunk.constraint.settlement_result.v1` |
| `case-manifest.v1.schema.json` | `solarpunk.constraint.case_manifest.v1` |
| `case-pack.v1.schema.json` | `solarpunk.constraint.case_pack.v1` |
| `context-manifest.v1.schema.json` | `solarpunk.constraint.context_manifest.v1` |
| `constraint-evaluation.v1.schema.json` | `solarpunk.constraint.constraint_evaluation.v1` |
| `decision-result.v1.schema.json` | `solarpunk.constraint.decision_result.v1` |
| `decision-receipt.v1.schema.json` | `solarpunk.constraint.decision_receipt.v1` |
| `operator-source-manifest.v1.schema.json` | `solarpunk.operator_source_manifest.v1` |
| `operator-source-receipt.v1.schema.json` | `solarpunk.operator_source_receipt.v1` |

These schemas define portable object shapes. They do not certify the truth of evidence or the authority of an issuer.

## Operator source intake boundary

The operator source manifest records declared custody, acquisition, permission, measurement semantics, device metadata, assertions, and referenced artifacts before normalization.

The corresponding receipt binds the source-file hash and canonical manifest hash while excluding raw source rows. It fixes:

```text
default_assurance_scenario = PROVENANCE-L0-BASE
automatic_promotion_allowed = false
source_truth_certification = NOT_CLAIMED
```

Permission to publish is not provenance. Declared artifact filenames are not verified artifacts. A self-authored manifest cannot establish L1–L4 assurance.

## Policy schema split

`policy_manifest.v1` remains the Public Alpha fixed-haircut policy shape used by the existing Claim Lab.

`policy_manifest.v2` is the case-workbench rule-list shape. It declares ordered admission and quantity rules by calculator ID and parameter object. Existing v1 policy IDs are not reused with different rule semantics.

The V2 policy schema does not define a universal rules language. It references a bounded deterministic calculator registry published by the core package.

## Case packs and assurance scenarios

`case_pack.v1` is a manifest for a bounded research case set. It identifies case, evidence, context, assurance-scenario, and policy files plus the pack's empirical-claim boundary.

`provenance_scenario.v1` represents a declared classification context used to test assurance counterfactuals. Its contract fixes `observed_evidence_changed` to `false` so a higher-assurance scenario cannot be presented as though new evidence was silently supplied.

A provenance scenario is not a provenance decision. The existing classifier still derives the L0-L4 `ProvenanceDecision` from evidence plus the declared context.

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

The evidence, policy, claim, case, context, constraint-evaluation, decision, operator-source manifest, and operator-source receipt objects use deterministic hashes implemented by `@solarpunk/constraint-core` where their contracts define identity.

V2 decision evaluation recomputes the portable evidence identity body before accepting an `evidence_hash`. Retaining an old hash after modifying source semantics, canonical intervals, summary, or capabilities fails closed. Diagnostics and presentation metadata remain outside evidence identity according to the existing evidence-envelope contract.

A JSON object can be structurally schema-valid while still failing:

- source-file or custody-receipt identity verification;
- evidence identity verification;
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

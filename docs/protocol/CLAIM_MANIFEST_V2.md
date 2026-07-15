# Claim Manifest v2 — Decision-Bound Research Claims

Runtime identifier:

```text
solarpunk.constraint.claim_manifest.v2
```

Schema:

```text
protocol/schema/claim-manifest.v2.schema.json
```

## Why v2 exists

`claim_manifest.v1` belongs to the Public Alpha evidence → `PolicyDecision` → claim path used by the existing Claim Lab.

The case workbench introduces a different deterministic decision object:

```text
CaseManifest
      ↓
Evidence + Context + Provenance
      ↓
Policy Manifest v2
      ↓
Typed admission gates
      ↓
Typed comparable quantity ceilings
      ↓
DecisionResult
      ↓
Claim Manifest v2
```

Changing the existing v1 claim object in place would make the old Claim Lab and its portable-object contract ambiguous. V2 therefore uses a new schema identifier.

## Identity boundary

A v2 claim binds the deterministic `DecisionResult` identity:

```text
decision_id
case_id
subject
policy_id
policy_version
policy_manifest_hash
evidence_hashes
quantity_base_units
quantity_decimals
unit
```

`createDecisionClaimManifest()` first validates the complete `DecisionResult`, recomputes the deterministic decision hash, and rejects a retained old `decision_id` after a material decision field is changed.

Only a DecisionResult with an evaluated, positive admitted maximum can become a v2 research claim.

A blocked decision has:

```text
capacity.evaluated = false
admitted_maximum = 0
```

and therefore cannot create a v2 claim.

## What the claim means

The claim records:

- the decision that bounded the quantity;
- the case identity;
- evidence identities;
- policy identity and manifest hash;
- the exact bounded quantity and base-unit representation;
- lifecycle history.

It does **not** establish:

- legal entitlement;
- environmental-attribute ownership;
- physical truth of the evidence source;
- reserve custody;
- redemption enforceability;
- production mint authority.

The initial lifecycle event is:

```text
VERIFIED → ADMITTED
```

with actor:

```text
case-decision-engine
```

This means the deterministic research decision admitted a bounded quantity. It does not mean a regulator, utility, issuer, or settlement operator approved the claim.

## Settlement remains separate

Claim v2 does not collapse settlement capacity into the admission or quantity-ceiling minimum.

The workbench sequence is:

```text
DecisionResult
      ↓
bounded research claim
      ↓
issued quantity
      ↓
SETTLEMENT_CAPACITY evaluation
      ↓
SETTLED / PARTIAL / SHORTFALL
```

The typed `SETTLEMENT_CAPACITY` calculator wraps the existing settlement engine as a `SETTLEMENT_CONSTRAINT` evaluation.

When the workbench supplies a numeric settlement-capacity stress input, that value is labeled a **declared research input** unless an independent evidence/context object supports it.

## Compatibility

The v1 Claim Lab remains valid and continues using `claim_manifest.v1`.

The case workbench uses `claim_manifest.v2`.

Do not silently convert one schema into the other or reuse an existing v1 claim ID after changing the identity contract.

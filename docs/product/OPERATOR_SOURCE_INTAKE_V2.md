# Operator source intake v2

**Purpose:** establish source-file identity, declared custody, permission scope, and measurement semantics before normalization.  
**Default assurance:** `PROVENANCE-L0-BASE`  
**Source-truth certification:** `NOT_CLAIMED`

## Why this exists

A CSV profile, a local signing key, or a claimed provenance label must not promote evidence to L1–L4 by itself. The first real-operator gate requires a defensible acquisition trail:

```text
Owner/operator-supplied file
→ immutable source hash
→ custody and permission manifest
→ privacy-safe intake receipt
→ registered normalization adapter
→ evidence diagnostics
→ artifact verification
→ only then consider assurance promotion
```

The intake receipt deliberately stops before provenance promotion.

## Files

- Schema: `protocol/schema/operator-source-manifest.v1.schema.json`
- Template: `data/operator/operator_source_manifest.template.json`
- Core: `packages/constraint-core/src/operatorIntake.js`
- CLI: `scripts/prepare_operator_source_intake.mjs`

## Prepare a private intake

Copy the template outside the repository and fill it with a pseudonymous source identifier, acquisition path, permission scope, measurement window, sign convention, and any artifact references.

```bash
npm --prefix packages/constraint-core run operator-intake -- \
  --source=/private/operator-export.csv \
  --manifest=/private/operator-source-manifest.json \
  --out=state/private/operator-source-receipt.json
```

Run the focused tests with:

```bash
npm --prefix packages/constraint-core run operator-intake:test
```

The command writes **only the receipt**. It does not copy the raw source file.

## Receipt contents

The receipt binds:

- source filename, SHA-256, and byte length;
- canonical source-manifest hash;
- custodian relationship and pseudonymous identifier;
- acquisition method and custody statement;
- explicit publication permission;
- measurement window;
- declared artifact references;
- promotion requirements;
- receipt identity.

It does not include raw interval rows.

## Permission scopes

| Scope | Public receipt | Public aggregates | Public raw data |
|---|---:|---:|---:|
| `private_validation` | No | No | No |
| `public_metadata_only` | Yes | No | No |
| `public_anonymized_aggregate` | Yes | Yes | No |
| `public_raw` | Yes | Yes | Yes |

Permission does not establish provenance. It only governs publication.

## Assurance boundary

Even when a manifest declares a live API, device signature, revenue-grade meter, or utility corroboration, the receipt records those as **unverified assertions**. It always emits:

```text
default_assurance_scenario: PROVENANCE-L0-BASE
automatic_promotion_allowed: false
source_truth_certification: NOT_CLAIMED
```

Promotion requires separate verification against the referenced artifact and the same source identity and measurement window.

## Gate 1 workflow

For the next owner-supplied source:

1. Keep the raw export outside the public repository.
2. Complete the source manifest with the owner/operator.
3. Generate the intake receipt.
4. Verify that source and manifest hashes reproduce.
5. Normalize through a registered adapter.
6. Preserve the intake source hash in the evidence transformation record.
7. Evaluate at L0 first.
8. Verify signatures, registry, API identity, or corroboration artifacts independently.
9. Promote assurance only through the V2 provenance rules supported by those verified facts.
10. Publish only the outputs permitted by the manifest.

A policy BLOCK remains an acceptable Gate 1 result.

## Legacy warning

`scripts/operator_data_intake.js` and its generated commercial/demo report predate the V2 custody model. They may generate locally signed demonstration readings and mint previews. They must not be used as proof of operator custody or as a V2 assurance classifier. Use this intake receipt first.

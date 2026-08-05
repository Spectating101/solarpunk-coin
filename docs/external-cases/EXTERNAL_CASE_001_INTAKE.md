# External Case 001 — intake and publication workflow

**Tracker:** issue #26  
**Status:** source-independent intake kit implemented; real source not yet acquired  
**Default assurance:** `PROVENANCE-L0-BASE`  
**Source-truth certification:** `NOT_CLAIMED`

## Objective

Process one attributable, permissioned owner/operator energy-data export through the custody-first Policy Lab workflow while keeping observed source data, modeled context, declared policy, counterfactual assurance scenarios, and derived results separate.

A blocked result is acceptable. The objective is to validate the external evidence workflow, not manufacture admission.

## Create the private workspace

Run from the repository root:

```bash
node scripts/scaffold_external_case_001.mjs \
  --out=/private/external-case-001
```

The scaffold creates:

```text
/private/external-case-001/
├── operator_source_manifest.json
├── column_mapping.json
├── source_holder_confirmation.md
├── raw/
├── private/
├── review/
├── public/
├── .gitignore
└── README.md
```

It never copies source data. The target should normally be outside the public repository.

## Minimum source package

The source holder must provide:

1. One original historical export from an inverter, gateway, meter, EMS, utility portal, registry, or equivalent source.
2. A documented relationship to the source.
3. Acquisition date and transfer path.
4. Measurement window, timezone, units, interval semantics, and sign conventions.
5. Explicit permission scope.
6. Any available device, registry, signature, API, utility, or corroboration artifacts.

Small, manually inspectable exports are preferred for the first case. Attribution and semantics matter more than row count.

## Permission scopes

| Scope | Receipt | Aggregates | Raw rows |
|---|---:|---:|---:|
| `private_validation` | private | private | private |
| `public_metadata_only` | public privacy-safe metadata | private | private |
| `public_anonymized_aggregate` | public privacy-safe metadata | public anonymized aggregates | private |
| `public_raw` | public | public | public |

Permission controls publication only. It does not establish provenance or assurance.

## Stage 1 — custody receipt

After replacing all `REPLACE` values and placing the untouched source file under `raw/`, generate the receipt:

```bash
node scripts/prepare_operator_source_intake.mjs \
  --source=/private/external-case-001/raw/source-export.csv \
  --manifest=/private/external-case-001/operator_source_manifest.json \
  --out=/private/external-case-001/private/operator-source-receipt.json
```

The receipt binds:

- source filename, SHA-256, and byte length;
- canonical manifest hash;
- custodian relationship and private/pseudonymous identifier;
- acquisition method and custody statement;
- permission scope;
- measurement window;
- declared artifact references;
- promotion requirements;
- receipt identity.

It does not include raw interval rows.

## Stage 2 — mapping and diagnostics

Complete `column_mapping.json` before adapting the source. Explicitly document:

- interval versus cumulative semantics;
- timestamp fields and timezone behavior;
- generation, site-load, export, and curtailed fields;
- source and target units;
- conversions;
- missing-value tokens;
- whether export is directly measured or derived;
- reset, rollover, duplicate, malformed, and missing-interval behavior.

Do not silently infer unavailable fields. Missing semantics must remain visible as diagnostics or blockers.

Normalize through an existing registered adapter where possible. Add a source-specific adapter only when the source cannot be represented truthfully by an existing adapter, and keep the mapping documented and tested.

## Stage 3 — assurance assessment

The source begins at `PROVENANCE-L0-BASE`.

Self-authored claims such as “revenue grade,” “live API,” “operator signed,” or “utility corroborated” are declarations until the referenced artifact is independently verified against the same source identity and measurement window.

A declared L2/L4 scenario may be used to inspect policy behavior only when clearly labeled counterfactual. It must not replace the actual source assurance state.

## Stage 4 — policy and settlement

Evaluate at least:

- open policy;
- pilot policy.

Include strict policy when it adds a meaningful comparison.

Record every admission gate, applicable quantity ceiling, blocking rule, binding rule, and decision identity. Run settlement only after admission. A blocked decision has no justified claim quantity to settle.

## Stage 5 — reproduction artifacts

Produce and verify:

- `EvidenceEnvelope`;
- `DecisionResult`;
- `SettlementResult` where applicable;
- `DecisionReceipt`;
- privacy-safe `ResearchCapsule`;
- declared-file closure;
- file hashes and byte lengths;
- cross-object agreement;
- deterministic replay.

Raw source rows remain excluded unless permission explicitly allows `public_raw`.

## Stage 6 — factual and technical review

The source holder reviews factual source metadata and the publication boundary. The source holder cannot alter deterministic results or remove unfavorable diagnostics.

At least one external technical or academic reviewer should inspect the public package, reproduction instructions, and non-claims. Preserve review comments and resulting corrections.

## Public case memo

The final public memo should contain:

1. Source and permission summary.
2. Evidence diagnostics.
3. Actual assurance conclusion.
4. Any counterfactual assurance scenarios, separately labeled.
5. Policy comparison.
6. Requested, justified, covered, and shortfall quantities where applicable.
7. Blocking or binding explanation.
8. Reproduction instructions.
9. Publication boundary.
10. Explicit non-claims and unresolved gaps.

## Non-claims

Completion does not by itself establish:

- physical meter certification;
- source truth beyond the verified custody/artifact chain;
- legal issuance authority;
- reserve custody;
- redemption enforceability;
- production governance;
- customer willingness to pay;
- repeatable commercial demand;
- general validation of CL–ECI from one case.

## Current dependency

The intake software and templates can be completed without a source. Actual case execution now depends on one source holder providing a bounded export and permission record.

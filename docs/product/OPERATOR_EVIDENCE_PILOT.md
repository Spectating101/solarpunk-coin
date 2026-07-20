# Operator evidence pilot (Gate 1)

**Branch:** `feat/operator-evidence-pilot`  
**Status:** pack-integrated pilot — operator-shaped CSV through the full Case Workbench V2 pipeline  
**Thesis PDF:** out of scope for this gate

## Goal

Force one external-shaped evidence source through:

```text
External source
→ normalized evidence
→ diagnostics
→ evidence hash
→ provenance classification
→ CaseManifest
→ policy decision
→ settlement stress
→ receipt
→ research capsule
```

without pretending the source is stronger than it is.

## Source chosen

| Field | Value |
|-------|--------|
| Path | `data/operator/sample_operator_export.csv` |
| Shape | Operator intake CSV (window_start/end, generation, site_load, export, …) |
| Adapter | `generic-interval-csv` via `normalizeGenericCsv` |
| Case | `OPS-001` |
| Evidence file | `protocol/cases/energy-v1/evidence/ops-sample-evidence.json` |

This is the **checked-in operator-format public-lab sample**, not a named closed-pilot custody archive. That is intentional for Gate 1 reproducibility: the pipeline and honesty boundaries are what we prove first. A later named operator file can replace the CSV without changing the adapter path.

## Honesty boundaries

- `capabilities.signed = false`
- `operator_signed = false`
- `sample_fixture = false` on source (unlike TYN/AUS/PHX controlled fixtures)
- Diagnostic `operator_format_sample` WARNING on the envelope
- Case boundaries state: not mint authority; TYN PVWatts context is TMY alignment only
- Capsule / receipt: `raw_evidence_included = false` (hashes + metadata only)

## Expected decisions (L0 base scenario)

| Policy | Expected | Why |
|--------|----------|-----|
| `ENERGY-CASE-PILOT-005` | **BLOCKED** | Requires signed evidence + MIN_PROVENANCE L2 |
| `LAB-CASE-OPEN-004` | **ADMIT_WITH_LIMIT** @ 103.8 | Positive surplus + zero blockers; evidence-backed capacity binds |

A blocked pilot result is a **successful** Gate 1 scientific outcome.

## Commands

```bash
# Rebuild committed evidence + case from the CSV (deterministic)
node scripts/build_operator_case_evidence.mjs

# Unit / integration tests
node --test packages/constraint-core/test/operator-evidence-gate1.test.mjs
node --test packages/constraint-core/test/energy-case-pack.test.mjs

# Full report + privacy-safe capsule artifacts
npm run case:gate1
# → state/product/operator_evidence_gate1/
```

In the browser workbench (after this branch is running locally): open **Cases → OPS-001**, leave assurance at L0, compare pilot vs open policies, export capsule from Receipts.

## Completion checklist

- [x] External-shaped source through normalize → envelope → case pack  
- [x] Explicit identity, window, and data boundary  
- [x] Diagnostics visible (operator_format_sample warning)  
- [x] Raw evidence can stay out of exports (capsule metadata only)  
- [x] Rerun produces the same evidence hash / decision path under tests  
- [ ] Named real operator archive (next increment — swap CSV, keep adapter)

## What this does *not* do

- No IndexedDB project workspace (Gate 2)  
- No unrestricted policy editor (Gate 3)  
- No independent capsule verifier CLI (Gate 4)  
- No UI redesign of Overview / Cases  
- No thesis PDF / Docs publish changes  

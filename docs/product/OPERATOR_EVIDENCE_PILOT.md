# Operator-format evidence pipeline pilot (Gate 1A)

**Status:** pack-integrated synthetic operator-format fixture through the full Case Workbench V2 pipeline  
**Real-operator Gate 1:** still open  
**Thesis PDF:** out of scope

## Goal

Validate the complete software path:

```text
Operator-format CSV fixture
→ generic adapter normalization
→ diagnostics
→ evidence hash
→ provenance classification
→ CaseManifest
→ policy decision
→ settlement stress
→ receipt
→ privacy-safe research capsule
```

without implying that a synthetic sample is observed operator evidence.

## Source

| Field | Value |
|---|---|
| Path | `data/operator/sample_operator_export.csv` |
| Epistemic status | Synthetic public-lab fixture using an operator-like column shape |
| Adapter | `generic-interval-csv` via `normalizeGenericCsv` |
| Case | `OPS-001` |
| Evidence | `protocol/cases/energy-v1/evidence/ops-sample-evidence.json` |

The source is deliberately reproducible and public. It does **not** have named operator custody, trusted identity, device signatures, or external corroboration.

## Declared boundaries

- `source.operator_format_sample = true`
- `source.sample_fixture = true`
- `capabilities.signed = false`
- `capabilities.cryptographically_verified = false`
- `capabilities.external_corroboration = false`
- diagnostic `operator_format_sample = WARNING`
- raw interval rows are excluded from receipts and capsules
- the reused Taoyuan PVWatts context is modeled TMY context, not observed generation

## Expected L0 decisions

| Policy | Expected | Reason |
|---|---|---|
| `ENERGY-CASE-PILOT-005` | **BLOCKED** | `SIGNED_EVIDENCE` and `MIN_PROVENANCE` fail |
| `LAB-CASE-OPEN-004` | **ADMIT_WITH_LIMIT** at **103.8** | Evidence-backed capacity binds |

A blocked pilot result is the correct scientific outcome for unsigned fixture evidence.

## Commands

```bash
# Rebuild committed evidence and case objects deterministically
npm run case:ops-evidence

# Gate 1A unit and pack tests
npm run case:gate1:test

# Generate the end-to-end report and privacy-safe capsule locally
npm run case:gate1
# output: state/product/operator_evidence_gate1/
```

In the browser, open **Cases → OPS-001**, keep assurance at L0, compare pilot and open policies, inspect settlement stress, and export the receipt/capsule.

## Gate 1A completion

- [x] Adapter accepts an operator-format CSV shape
- [x] Normalization and evidence hashing are deterministic
- [x] Unsigned provenance remains L0
- [x] Pilot policy blocks before quantity evaluation
- [x] Open policy admits with an evidence-backed ceiling
- [x] Settlement shortfall remains visible
- [x] Receipt and capsule exclude raw interval rows
- [x] Public interface exposes the case

## What remains for real-operator Gate 1

Run the same path against a source with at least one of the following:

- named operator provenance and documented custody;
- an exported inverter or utility file supplied by its owner;
- signed meter evidence tied to a declared device registry;
- an anonymized real archive whose origin and transformation steps can be documented.

That later result may still be blocked. The completion criterion is credible source provenance and reproducible processing, not admission.

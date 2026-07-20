# Field-ready alpha — release notes

**Tag:** `v0.2.0-field-ready-alpha`  
**Commit:** `c32a484` (published `main`)  
**Demo:** https://spectating101.github.io/solarpunk-coin/demo/

## What this alpha is

A **field-ready** Policy Lab alpha for private operator evidence pilots. The public demo is a deterministic research workbench, not a token product.

## Included

### Four-case deterministic workbench
- TYN-001, AUS-001, PHX-001 (controlled fixtures)
- OPS-001 (**Gate 1A** — synthetic operator-format CSV through the real adapter path)
- Compare matrix is pack-driven: **4 cases × 3 policies = 12 decisions**

### OPS-001 Gate 1A boundary
- Operator-**shaped** public sample, not a named field operator
- `sample_fixture: true`; unsigned; not cryptographically verified; no external corroboration
- No asserted physical map location (`spatial_identity: null`)
- Pilot policy blocks at L0; open policy admits for mechanics only
- Raw intervals stay out of receipts and capsules

### Closed-world capsule verifier
- Exactly 12 hashed portable files + `capsule.json`
- Digest and byte-length checks; no undeclared/hidden extras
- Cross-object agreement and optional committed-pack replay
- CLI: `npm run case:verify-capsule -- <bundle.json> [--replay-from-pack]`

### Custody-first private intake
- Source receipt before normalization
- Template: `data/operator/operator_source_manifest.template.json`
- Command: `npm --prefix packages/constraint-core run operator-intake -- --source=... --manifest=... --out=...`
- Always: `PROVENANCE-L0-BASE`, `automatic_promotion_allowed=false`, `source_truth_certification=NOT_CLAIMED`
- Raw source is not copied by the intake command and private output paths are ignored by Git
- Docs: `docs/product/OPERATOR_SOURCE_INTAKE_V2.md`

### Explicit non-claims
- Not a token sale, peg, mainnet currency, or legal redemption instrument
- Browser validation is not L2 provenance
- CEIR does not validate SPK
- OPS-001 does not establish source truth or geospatial performance
- Capsule reproducibility does not establish physical truth

### Remaining field gate
**Issue #3** (open): Field validation — admit one real L2 operator / inverter evidence source.

| Sub-gate | Milestone |
|----------|-----------|
| **1B** | Real-source software validation (external custody-documented export → L0 → capsule → verify). BLOCKED is OK. |
| **1C** | Authenticated operator evidence with independently checkable identity/custody (path toward L1) |
| **1D** | Signed live-gateway validation with documented key custody (real L2) |

## Freeze policy

After the freeze document lands on `main`, accept only defects; security/privacy fixes; real-source ingestion or verification changes; operator-feedback usability changes; and minimal field-program documentation or release metadata.

# Fiscal Choke Points — Zenodo release manifest

**Preparation date:** 2026-09-15  
**Package ID / citation version:** `DT-FCP-2026-001`  
**Archive state:** `BUNDLE_PREPARATION_READY / DOI_NOT_RESERVED / NOT_PUBLISHED`  
**Human gate:** any Zenodo draft creation tied to the author's account, DOI reservation, license selection, and Publish action

## 1. Archive objective

Freeze a citable research object for **Fiscal Choke Points: Transaction-Node Architecture and Operational Fiscal Capacity in Southeast Asian Digital Tax Administration** without turning the living `solarpunk-coin` repository or its broader Policy Lab metadata into the scholarly citation object.

The archive should preserve three distinct layers:

1. the reader-facing manuscript (`PDF`, with `DOCX` retained as an editable companion);
2. the source/claim/coding/validation package under `IE-JDE/Digital_Tax_Design/rebuilt_2026/`;
3. provenance metadata binding the deposited files to an exact Git source state.

## 2. Source package integrity lock

Repository: `Spectating101/solarpunk-coin`  
Research branch: `digital-tax/rebuild-2026`  
Evidence-package source commit: `6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd`  
Commit date: `2026-09-14T12:16:02Z`  
Commit message: `Require venue and AI disclosure in DT publication gate`

The archive-preparation branch `digital-tax/archive-metadata-20260915` is based on that exact source commit and may add archive metadata only. It must not silently alter the claim register, source catalog, path codings, comparative propositions, boundary cases, operational-capacity evidence, canonical publication candidate, or validation scripts without creating a new source snapshot and rerunning the publication gates.

### Exact-head validation evidence

The source commit `6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd` has recorded successful GitHub Actions runs for:

- `Digital Tax package validation` — run `34842498334` — SUCCESS;
- `Secrets Scan` — SUCCESS;
- `Tests & Coverage` — SUCCESS;
- Solidity tests/security — SUCCESS.

These runs establish internal package consistency only. They do not establish peer review, external reproduction, causal identification, or venue acceptance.

## 3. Canonical research-control package

The deposited source package must preserve the research directory at the source snapshot, including at minimum:

### Source and inference controls

- `CLAIM_BOUNDARIES.md`
- `SOURCE_CATALOG.csv`
- `CLAIM_REGISTER.csv`
- `CODING_RULES.md`
- `NOVELTY_AND_PRIOR_ART_AUDIT.md`
- `OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md`
- `AI_ASSISTANCE_DISCLOSURE.md`

### Comparative evidence

- `COUNTRY_PATH_CODINGS.csv`
- `COUNTRY_ARCHITECTURE.csv`
- `CASE_CHRONOLOGY.csv`
- `NODE_SELECTION_CONDITIONS.csv`
- `BOUNDARY_CASES.csv`
- `RECONCILIATION_EVIDENCE_MATRIX.csv`
- `OPERATIONAL_CAPACITY_MATRIX.csv`
- `DERIVED_ARCHITECTURE_SUMMARY.md`

### Analytical / publication controls

- `LITERATURE_POSITIONING.md`
- `COMPARATIVE_PROPOSITIONS.md`
- `ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md`
- `REVIEWER_RISK_REGISTER.md`
- `FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md`
- `MANUSCRIPT_SOURCE_MAP.csv`
- `PACKAGE_MANIFEST.md`
- `PUBLICATION_READINESS.md`
- `QUALITY_GATE.md`
- `SUBMISSION_MATERIALS.md`
- `VALIDATION_REPORT_2026-09-14.md`

### Executable controls

- `derive_comparative_findings.py`
- `validate_boundary_layer.py`
- `validate_operational_capacity.py`
- `validate_package.py`
- `validate_publication_candidate.py`

The exact Git commit remains the authoritative integrity lock for the source package; this manifest does not attempt to duplicate every Git object hash manually.

## 4. Reader-facing manuscript pair

The current formatted manuscript pair selected for the archive is external to the Git research branch and is bound here by SHA-256:

| File | Bytes | SHA-256 |
|---|---:|---|
| `Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.pdf` | 195111 | `8ef8b215c7e1340f7c7c8f97c2e0449cad8c571077ea4ee2dd4332a41d133ba6` |
| `Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.docx` | 55093 | `d44b87e06a56977e98f8b5a23965c0cd3eca6796f9f2459acdff6e83a915f05b` |

Before any public deposit, verify that the PDF and DOCX remain semantically aligned with the source-controlled publication candidate and that no later corrected reader-facing version supersedes either hash.

## 5. Citation metadata

DT-specific citation metadata is stored in this research directory as `CITATION.cff` so it does not overwrite the repository-root citation identity.

Current citation identity:

- title: **Fiscal Choke Points: Transaction-Node Architecture and Operational Fiscal Capacity in Southeast Asian Digital Tax Administration**;
- creator: **Christopher Ongko**;
- affiliation: **Yuan Ze University**;
- citation version: **DT-FCP-2026-001**;
- DOI: **not reserved / not assigned**;
- release date: **not assigned until public release**;
- release license: **unresolved**.

Do not add a DOI or release date to `CITATION.cff` before those values exist.

## 6. Proposed Zenodo record metadata — prefill only

These values are safe to prefill in a draft record:

### Title

`Fiscal Choke Points: Transaction-Node Architecture and Operational Fiscal Capacity in Southeast Asian Digital Tax Administration`

### Creator

`Ongko, Christopher` — Yuan Ze University

Do not invent an ORCID or other creator identifier.

### Description

A source-controlled comparative research package examining how five Southeast Asian jurisdictions assign bounded fiscal functions to nodes inside seven digital-tax transaction paths. The package codes taxable object, liable node, destination or nexus evidence, transaction rail, and reconciliation power; separates node locus from event coupling; tests within-regime boundary cases; and distinguishes Stage-A legal architecture from Stage-B operational/procedural capacity. The contribution is comparative and institutional rather than causal. The archive contains the reader-facing manuscript, structured claim/source/path controls, comparative matrices, derivation scripts, validation checks, publication-boundary documentation, and provenance metadata.

### Keywords

- digital taxation
- tax administration
- VAT
- GST
- e-commerce
- regulatory intermediaries
- transaction paths
- Southeast Asia

### Related source

Git repository: `https://github.com/Spectating101/solarpunk-coin`  
Source branch: `digital-tax/rebuild-2026`  
Evidence commit: `6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd`

## 7. Deliberately unresolved deposit fields

### Resource type

`UNRESOLVED`

The deposit is a mixed scholarly object containing a publication, structured research data, and executable validation code. Zenodo instructs mixed uploads to use the resource type that best reflects the object. Choose deliberately in the live form after reviewing how the record is intended to be cited; do not infer a type merely from the host Git repository.

### License / rights

`UNRESOLVED — HUMAN LEGAL/PUBLICATION GATE`

The repository root currently carries an MIT software license, but that fact alone is not treated here as an affirmative decision about the intended reuse terms for the scholarly manuscript, structured research data, source extracts/metadata, and archive as a whole. Select the release license only after confirming rights and desired reuse terms.

No public DOI deposit should be published until this field is explicit.

### DOI

`NOT_RESERVED`

Zenodo allows a DOI to be reserved on a draft before publication. Reserving a DOI is still an external account mutation and must be a deliberate human-author action. The DOI is registered when the record is published.

### Publication date

`UNRESOLVED UNTIL PUBLIC RELEASE`

Do not backfill a release date merely because the paper is dated September 2026. Use the actual public-release semantics required by the deposit record.

## 8. Recommended deposit file set

Prepare a single deterministic bundle directory containing:

1. `Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.pdf`;
2. `Fiscal_Choke_Points_SSRN_Working_Paper_2026_FINAL.docx`;
3. a frozen copy of `IE-JDE/Digital_Tax_Design/rebuilt_2026/` from the exact archive source snapshot, including `CITATION.cff` and this release manifest;
4. a plain-text SHA-256 checksum file covering the deposited top-level files and source-package archive;
5. a small `ARCHIVE_PROVENANCE.md`/equivalent if the source subtree is compressed, recording the source repository, branch, commit and archive-build timestamp.

Prefer preservation-friendly/open formats where available; retain the PDF as the primary reader-facing manuscript even if DOCX is also supplied.

## 9. Release gate

A public Zenodo release may proceed only when all of the following are true:

- [x] Source/claim/path control package located and exact source commit locked.
- [x] Current source head has successful Digital Tax package validation.
- [x] DT-specific `CITATION.cff` added without altering repository-root citation identity.
- [x] Reader-facing PDF/DOCX selected and SHA-256 values recorded.
- [ ] Reader-facing pair checked against the source-controlled publication candidate for semantic alignment.
- [ ] Independent spot recode / external path-source check completed or explicitly deferred with the release labeled accordingly.
- [ ] Final legal-currentness sweep completed for the public release date.
- [ ] Release license/rights decision made explicitly.
- [ ] Zenodo resource type selected explicitly.
- [ ] Deposit bundle built and checksums verified.
- [ ] Zenodo draft metadata reviewed.
- [ ] DOI reserved only if desired for inclusion in the files.
- [ ] Human author approves **Publish**.
- [ ] Published DOI and record URL written back to `CITATION.cff` in a post-release versioned change.

Until those remaining gates close, the correct state is **ARCHIVE_PREPARED**, not DOI-published.

## 10. Nonclaims

Publishing the archive would establish a frozen, citable research object. It would **not** establish:

- peer review;
- independent replication;
- external validation of the legal coding;
- causal administrative effectiveness;
- journal acceptance;
- endorsement by any tax authority or institution.

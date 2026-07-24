# Superseded thesis iterations (archived 2026-07-25)

Everything in this folder predates the 2026-07-10 CEIR negative-control audit
(`thesis_package/CEIR_FINAL_DIAGNOSIS.md`, `thesis_package/CEIR_DATA_LINEAGE_AUDIT.md`)
and states or builds toward the retired Chapter 3 claim: that the CEIR level
regression shows a real, energy-specific, regime-dependent valuation effect
with a significant Chow break.

The audit found that claim does not survive negative controls: CEIR is
statistically indistinguishable from a plain cumulative-TWh or cumulative-days
ratio (log-ratio correlation 0.999989 with the TWh version), the panel's
`electricity_price` column is a broken merge that is ~constant at $0.076/kWh
for nearly the whole sample, the pre-ban coefficient collapses toward
insignificance once the unexplained 2018 cost seed is zeroed, and the
preferred robust joint-Wald break test does not reject stability (p ≈ 0.13),
unlike the classical Chow test these older drafts cite.

**Canonical thesis now:** `energy_constraint_thesis_final_submission.pdf`
(repo root). It is a directly-maintained document (no markdown/DOCX build
pipeline) that incorporates the corrected Chapter 3 negative-identification
result and the newer case-workbench material in Chapter 5.

## What's here and why it's retired

| File | Why archived |
|---|---|
| `THESIS_GROUNDED_MANUSCRIPT.md` | Source for the old md→DOCX build pipeline (`build_grounded_thesis.py`). States the retired Ch3 claim verbatim. No longer maintained. |
| `energy_constraint_thesis_final_submission_v2*.{pdf,docx}` | Early export of the same retired-claim manuscript. |
| `energy_constraint_thesis_final_submission_v3.{pdf,docx,md}` | Same manuscript, later export. Identical content to the archived `THESIS_GROUNDED_MANUSCRIPT.md`. |
| `energy_constraint_thesis_v8_audited_final_submission_preview.pdf` | Same manuscript, post-DOCX-formatting-audit export. Formatting fixes only; empirical claim unchanged. |
| `energy_constraint_thesis_final_submission_v10.pdf` | Same manuscript, latest pre-correction export. |
| `Energy_As_Money_Polished_Thesis_Spine.{pdf,docx}` | Older four-constraint "ENERGY AS MONEY" framing, already flagged for retirement in `THESIS_SOURCE_OF_TRUTH.md` before this cleanup. |
| `thesis-draft.md` | Same four-constraint draft, markdown source. Overclaiming language ("credibly sound," "minimum viable architecture") not used in the current framing. |

Kept for provenance/history only — do not pull numbers or prose from this
folder into new work. If you need the CEIR audit trail itself, it's not here:
see `thesis_package/CEIR_FINAL_DIAGNOSIS.md` and `CEIR_DATA_LINEAGE_AUDIT.md`
in the parent directory, which remain active reference documents.

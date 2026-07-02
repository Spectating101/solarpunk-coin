# Thesis build (grounded chapters → DOCX)

## Source files

| File | Role |
|------|------|
| `CHAPTER_*_GROUNDED_DRAFT.md` | Editable chapter drafts (edit here) |
| `THESIS_SOURCE_OF_TRUTH.md` | Canonical numbers, framing, phrases |
| `THESIS_NUMBERS_MANIFEST.md` | Auto-generated verification snapshot (run `npm run thesis:verify`) |
| `THESIS_CHAPTER_MAP.md` | Chapter purposes and continuity rules |
| `THESIS_VISUAL_CATALOG.md` | Figure and table index per chapter |
| `generate_thesis_tables.py` | Auto Tables 3.2–3.6 and 4.4–4.6 → `empirical_results/tables/` |
| `SUBMIT_TO_ADVISOR.md` | What to attach, Word finishing steps, sample cover email |
| `ADVISOR_FEEDBACK_CHECKLIST.md` | Pre-send claim discipline checklist |
| `docs/foundation/OSS_LANDSCAPE.md` | OSS/GitHub catalog for maps, attestation, stablecoin comparators |
| `state/runtime/spk_v1.json` | Live Sepolia metrics for Ch 5 |

## Build commands

```bash
# Regenerate figures + pricing CSVs + CEIR appendix + empirical tables + verify numbers
npm run thesis:figures

# Verify canonical numbers only (no DOCX)
npm run thesis:verify

# Markdown only (fast; includes figures + evidence refresh)
npm run thesis:build

# Full Word export + per-chapter DOCX + root submission copy
npm run thesis:all

# Refresh Ch 5 evidence only
npm run thesis:evidence
```

## Outputs

| Output | Path |
|--------|------|
| Combined markdown | `thesis_package/THESIS_GROUNDED_MANUSCRIPT.md` |
| Full thesis DOCX | `thesis_package/output/THESIS_GROUNDED.docx` |
| Chapter DOCX (1–6) | `thesis_package/output/chapters/CHAPTER_N.docx` |
| SPK evidence pack | `thesis_package/SPK_V1_EVIDENCE.md` |
| Empirical figures | `thesis_package/empirical_results/figures/*.png` |
| CEIR reproduction | `thesis_package/CEIR_REPRODUCTION.md` |

## Word finishing steps

1. Open `THESIS_GROUNDED.docx` in Word.
2. Right-click **Table of Contents** → **Update Field** → update entire table.
3. Check heading levels and table formatting.
4. Add page numbers (Insert → Page Number) if required by department.
5. Run spell-check; verify numbers with `npm run thesis:verify` → `THESIS_NUMBERS_MANIFEST.md`.

## Chapter 5 evidence (automatic)

The full Sepolia payment ledger (21 rows), contracts table, live metrics, and operator-cycle log are **embedded automatically** into Chapter 5 before §5.11 when you run `npm run thesis:docx`. No manual copy-paste from `SPK_V1_EVIDENCE.md`.

## Edit workflow

1. Edit the relevant `CHAPTER_N_GROUNDED_DRAFT.md`.
2. If Ch 5 numbers change on-chain: `npm run foundation:sync` then `npm run thesis:docx`.
3. Send advisor a single chapter: `output/chapters/CHAPTER_5.docx` includes the ledger tables.

## Dependencies

```bash
pip install -r thesis_package/requirements-docx.txt
```

(`python-docx`, `mistune`)

# Thesis build (grounded chapters → DOCX)

## Source files

| File | Role |
|------|------|
| `CHAPTER_*_GROUNDED_DRAFT.md` | Editable chapter drafts (edit here) |
| `THESIS_SOURCE_OF_TRUTH.md` | Canonical numbers, framing, phrases |
| `THESIS_CHAPTER_MAP.md` | Chapter purposes and continuity rules |
| `state/runtime/spk_v1.json` | Live Sepolia metrics for Ch 5 |

## Build commands

```bash
# Markdown only (fast)
npm run thesis:build

# Full Word export + per-chapter DOCX
npm run thesis:docx

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

## Word finishing steps

1. Open `THESIS_GROUNDED.docx` in Word.
2. Right-click **Table of Contents** → **Update Field** → update entire table.
3. Check heading levels and table formatting.
4. Add page numbers (Insert → Page Number) if required by department.
5. Run spell-check; verify Ch 3–4 numbers against `THESIS_SOURCE_OF_TRUTH.md`.

## Edit workflow

1. Edit the relevant `CHAPTER_N_GROUNDED_DRAFT.md`.
2. If Ch 5 numbers change on-chain: `npm run foundation:sync` then `npm run thesis:docx`.
3. Send advisor a single chapter: `output/chapters/CHAPTER_3.docx`.

## Dependencies

```bash
pip install -r thesis_package/requirements-docx.txt
```

(`python-docx`, `mistune`)

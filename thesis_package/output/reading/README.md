# Thesis reading pack

Built: 2026-07-01 15:37 UTC

Use this folder to read the thesis chapter by chapter in PDF, Word, or Markdown.

## Full manuscript

| Format | File |
|---|---|
| Markdown | [full/THESIS_GROUNDED.md](full/THESIS_GROUNDED.md) |
| Word | [full/THESIS_GROUNDED.docx](full/THESIS_GROUNDED.docx) |
| PDF | [full/THESIS_GROUNDED.pdf](full/THESIS_GROUNDED.pdf) |

## Chapters

| # | Title | PDF | Word | Markdown |
|---:|---|---|---|---|
| 1 | Introduction | [PDF](chapters/Chapter_01_Introduction.pdf) | [DOCX](chapters/Chapter_01_Introduction.docx) | [MD](chapters/Chapter_01_Introduction.md) |
| 2 | Literature Review | [PDF](chapters/Chapter_02_Literature_Review.pdf) | [DOCX](chapters/Chapter_02_Literature_Review.docx) | [MD](chapters/Chapter_02_Literature_Review.md) |
| 3 | Bitcoin Energy Empirics | [PDF](chapters/Chapter_03_Bitcoin_Energy_Empirics.pdf) | [DOCX](chapters/Chapter_03_Bitcoin_Energy_Empirics.docx) | [MD](chapters/Chapter_03_Bitcoin_Energy_Empirics.md) |
| 4 | Renewable Energy Pricing | [PDF](chapters/Chapter_04_Renewable_Energy_Pricing.pdf) | [DOCX](chapters/Chapter_04_Renewable_Energy_Pricing.docx) | [MD](chapters/Chapter_04_Renewable_Energy_Pricing.md) |
| 5 | Constraints and Implementation | [PDF](chapters/Chapter_05_Constraints_and_Implementation.pdf) | [DOCX](chapters/Chapter_05_Constraints_and_Implementation.docx) | [MD](chapters/Chapter_05_Constraints_and_Implementation.md) |
| 6 | Conclusion | [PDF](chapters/Chapter_06_Conclusion.pdf) | [DOCX](chapters/Chapter_06_Conclusion.docx) | [MD](chapters/Chapter_06_Conclusion.md) |

## Refresh

From the repo root:

```bash
npm run thesis:reading
```

Markdown + Word only (no PDF):

```bash
npm run thesis:docx
```

PDF conversion uses LibreOffice (`libreoffice --headless`).

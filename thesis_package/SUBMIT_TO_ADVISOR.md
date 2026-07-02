# Submitting to Advisor — Quick Handoff

**Primary file to send:** `energy_constraint_thesis_final_submission_v3.docx` (repo root, auto-exported)

**Source build:** `thesis_package/output/THESIS_GROUNDED.docx`

**Optional:** Per-chapter files in `thesis_package/output/chapters/CHAPTER_1.docx` … `CHAPTER_6.docx` if your advisor prefers reviewing one chapter at a time.

---

## Before you attach the file (5 minutes)

1. Open `THESIS_GROUNDED.docx` in Word.
2. **References → Update Table of Contents** (entire table).
3. Skim the **Abstract** and **Chapter 6 §6.2 roadmap** — they state the bounded claim in one page.
4. Confirm your name and student ID on the cover block (edit in `build_grounded_thesis.py` → `build_front_matter()` if needed, then `npm run thesis:all`).
5. Add page numbers if your department requires them (Insert → Page Number).

---

## What this draft is asking the advisor to judge

| Layer | Claim | Boundary |
|---|---|---|
| Concept | Energy can **constrain** digital finance when five rules hold together | Not “energy = money” |
| Empirics (Ch 3) | CEIR level spec ≈ −0.26 pre-ban (sig.), ≈ −0.07 post-ban (weak); Chow break; trading rule underperforms | Not a trading rule; Bitcoin-only |
| Pricing (Ch 4) | Taiwan ATM call ≈ $0.01917 (binomial), ≈ $0.01957 (MC); oracle tolerance table | GBM benchmark; irradiance σ proxy |
| Pricing (Ch 4) | Transparent option-style framework from public data | Not final market model |
| Implementation (Ch 5) | Sepolia SPK v1 proves rules are **buildable** | Not production-ready; peg off |
| Product framing | Research + feasibility | **Not** a stablecoin launch |

---

## Suggested cover note (copy/edit)

> Dear Professor [Name],
>
> Please find attached my grounded thesis draft: *Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance*.
>
> The argument is conditional: energy can discipline digital financial claims only when reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance are designed together. Chapter 3 uses Bitcoin mining energy cost (CEIR); Chapter 4 prices renewable-energy risk; Chapter 5 maps the five-constraint framework to a Sepolia proof-of-concept (SPK v1). I do not claim production readiness or stablecoin parity.
>
> Each chapter opens with an “At a glance” summary. A one-page reader’s guide is in the repo at `thesis_package/THESIS_READERS_GUIDE.md` if useful.
>
> I would especially welcome feedback on [Ch 3 specification / Ch 4 pricing assumptions / Ch 5 implementation boundaries / overall framing].
>
> Thank you,  
> Christopher Ongko

---

## Rebuild after any edit

```bash
npm run thesis:all
```

This runs: figures → pricing → CEIR appendix → **number verification** → evidence refresh → DOCX → copies `energy_constraint_thesis_final_submission_v3.docx` to repo root.

Canonical numbers snapshot: `thesis_package/THESIS_NUMBERS_MANIFEST.md` (auto-generated).

Sources live in `thesis_package/CHAPTER_*_GROUNDED_DRAFT.md`. Canonical numbers: `THESIS_SOURCE_OF_TRUTH.md`.

---

## Internal checklist

See `ADVISOR_FEEDBACK_CHECKLIST.md` for claim discipline and formatting items.

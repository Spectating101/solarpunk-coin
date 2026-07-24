# Submitting to Advisor — Quick Handoff

**Primary file to send:** `energy_constraint_thesis_final_submission.pdf` (repo root)

This is a directly-maintained document — there is no markdown/DOCX build pipeline behind it. Edit it in your word processor directly; there is no `npm run thesis:all` step to rerun afterward.

Canonical numbers/framing reference (for checking any edits you make): `thesis_package/THESIS_SOURCE_OF_TRUTH.md`.

---

## Known outstanding fixes before you send it

1. **Citation error:** References cite "National Laboratory of the Rockies" / `developer.nlr.gov` — this should be **National Renewable Energy Laboratory (NREL)** / `developer.nrel.gov`. Appears in Ch.2 §2.7, Ch.4 §4.3/§4.3.1, and the References list.
2. Double-check the Ethereum "The Merge" reference URL (`https://ethereum.org/roadmap/merge/`) resolves — an earlier draft used `https://ethereum.org/en/upgrades/merge/`.

## Before you attach the file (5 minutes)

1. Fix the two citation issues above.
2. Skim the **Abstract** and **Chapter 6 §6.5–6.7** — they state the bounded, conditional claim in one page, including the negative Chapter 3 identification result.
3. Confirm your name, student ID, and advisor name on the cover page.
4. Add page numbers / update any Word field codes if your department requires it.

---

## What this draft is asking the advisor to judge

| Layer | Claim | Boundary |
|---|---|---|
| Concept | Energy can **constrain** digital finance when five rules hold together | Not "energy = money" |
| Empirics (Ch 3) | CEIR association is reproducible but does **not** identify an energy-specific effect — negative controls (TWh/days ratios), a broken price-merge, seed sensitivity, and the preferred robust break test all point the same way | Not "energy anchors Bitcoin"; this is a negative/boundary finding |
| Pricing (Ch 4) | Taiwan ATM call ≈ $0.0192/kWh (binomial), ≈ $0.0196/kWh (MC); oracle-tolerance table | Declared-scenario inputs, not observed market data; GBM benchmark |
| Implementation (Ch 5) | Sepolia SPK v1 + V2 case workbench prove the constraint architecture is **buildable** and produces auditable, reproducible decisions | Not production-ready; peg off; controlled fixtures, not operator data |
| Product framing | Research + feasibility | **Not** a stablecoin launch |

---

## Suggested cover note (copy/edit)

> Dear Professor Kong,
>
> Please find attached my thesis draft: *Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance*.
>
> The argument is conditional: energy can discipline digital financial claims only when reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance are designed together. Chapter 3 tests Bitcoin mining-cost valuation (CEIR) and reports a negative identification result — the apparent association does not survive negative-control and robust break tests, which I treat as a finding rather than a setback. Chapter 4 prices renewable-energy risk under declared assumptions; Chapter 5 maps the five-constraint framework to a Sepolia proof-of-concept and a deterministic case-decision workbench. I do not claim production readiness or stablecoin parity.
>
> I would especially welcome feedback on [Ch 3's negative-identification framing / Ch 4 pricing assumptions / Ch 5 implementation boundaries / overall structure].
>
> Thank you,
> Christopher Ongko

---

## If you need to hand a chapter-by-chapter version to your advisor

There is currently no automated chapter-splitter for this document (the old one built from the retired manuscript — see `thesis_package/_archive/superseded_2026-07/`). Export chapters manually from your word processor if needed.

## Internal checklist

See `ADVISOR_FEEDBACK_CHECKLIST.md` for claim discipline and formatting items (note: written against the earlier draft framing — re-check items against `THESIS_SOURCE_OF_TRUTH.md` before relying on it).

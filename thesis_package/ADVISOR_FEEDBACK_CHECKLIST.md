# Advisor Feedback Checklist

This file tracks manuscript-level cleanup items before sending the thesis for advisor review. It is not a rewrite plan; it is a discipline checklist to prevent older drafts and unsupported claims from leaking into the final version.

| Item | Current Status | Action |
|---|---|---|
| Explain proof-of-work from scratch | Mostly addressed in Chapters 2 and 3 | Verify that a non-crypto reader can understand why Bitcoin mining uses electricity before CEIR is introduced. |
| Cite Chapter 1 claims | Partially addressed | Add or verify citations for gold, fiat credibility, Bitcoin mining, renewable-energy data, and energy-finance claims. |
| Define CEIR explicitly | Addressed in Chapter 3 draft after consolidation | Keep `CEIR_t = MarketCap_t / CumulativeEnergyCost_t` and do not use the inverse formula. |
| Explain CEIR sign logic | Addressed in Chapter 3 draft after consolidation | Keep the interpretation: higher CEIR means more expensive relative to cumulative energy cost, so the expected coefficient on later returns is negative. |
| Explain return horizon | Addressed in Chapter 3 draft after consolidation | Use forward 30-day Bitcoin return and mention overlapping-return risk. |
| Number equations | Partially addressed | Preserve Equation 3.1 and Equation 3.2 in Chapter 3; add final numbering during DOCX formatting if needed. |
| Explain Bitcoin-only focus | Mostly addressed | Keep the single-asset limitation in Chapter 3 and Chapter 6. |
| Remove or avoid RDD framing | Addressed in grounded chapters | Do not reintroduce regression-discontinuity language unless the method is actually used. |
| Separate methodology and results | Mostly addressed | Chapter 3 now separates measurement/design/results/robustness; keep that structure. |
| Make tables self-explanatory | Partially addressed | Add captions and notes during final formatting. |
| Pricing source of truth | Addressed in Chapter 4 draft after consolidation | Use the Taiwan base-case table and cross-location table as canonical. |
| Framework consistency | Addressed | Use the five-constraint framework everywhere: data, issuance, pricing, settlement, governance. |
| Implementation boundaries | Addressed | Use proof-of-concept/testnet/feasibility language; avoid production-ready claims. |
| Correlation matrix | Optional / advisor-dependent | Add only if requested or if Chapter 3 needs a compact controls/diagnostics table. |
| Formatting | Not done | Final DOCX should follow department rules, likely Times New Roman 12, proper references, figure numbering, and table captions. |

## Final Pre-Send Rule

Before sending the thesis, check that the main text never claims:

- energy automatically becomes money;
- SolarPunk is production-ready;
- CEIR is a trading strategy;
- satellite data proves site-level energy production;
- the five-constraint framework proves market adoption.

# Advisor Feedback Checklist

Manuscript-level cleanup before advisor review. Prevents older drafts and unsupported claims from leaking into the final version.

**Status:** Ready for advisor read (Jun 2026 grounded build). Re-run `npm run thesis:docx` after any chapter edit.

| Item | Status | Notes |
|---|---|---|
| Explain proof-of-work from scratch | **Done** | Ch 2 §§2.5–2.6; minimal reminder in Ch 3 §3.2 |
| Cite Chapter 1 claims | **Done** | Gold, fiat, Bitcoin, renewable data, IEA/OECD in Ch 1 refs |
| Define CEIR explicitly | **Done** | `CEIR_t = MarketCap_t / CumulativeEnergyCost_t`; Equation 3.1 |
| Explain CEIR sign logic | **Done** | Higher CEIR → weaker later returns → negative β |
| Explain return horizon | **Done** | Forward 30-day return; overlapping-window caveat + HAC(30) |
| Number equations | **Done** | Equations 3.1–3.2 in text; final numbering in Word if dept requires |
| Explain Bitcoin-only focus | **Done** | Ch 3 Table 3.1 + Ch 6 limitations |
| Remove RDD framing | **Done** | Structural break / Chow only; no regression-discontinuity language |
| Separate methodology and results | **Done** | Ch 3: design (§3.4) → results (§3.5) → robustness (§3.6) |
| Make tables self-explanatory | **Mostly done** | At-a-glance tables per chapter; update TOC/captions in Word |
| Pricing source of truth | **Done** | Taiwan + ATM cross-location in Ch 4; `cross_location_pricing.csv`; verify via `npm run thesis:verify` |
| Five-constraint framework | **Done** | Ch 2 §2.7, Ch 5 §5.2, abstract, Ch 6 |
| Implementation boundaries | **Done** | Proof-of-concept / testnet / feasibility throughout Ch 5–6 |
| Stablecoin framing | **Done** | Ch 2 §2.9 comparator only; not thesis identity |
| Chapter digestibility | **Done** | At-a-glance openers + key takeaways; `THESIS_READERS_GUIDE.md` |
| Correlation matrix | **Done** | Table 3.6 (auto-generated) |
| Descriptive statistics | **Done** | Tables 3.2–3.6 via `generate_thesis_tables.py` |
| Department formatting | **Done** | Times New Roman 12pt, double-spaced, justified body, APA-style references (hanging indent, alphabetical), 1.25″ left margin |

## Final pre-send rule

The main text must **not** claim:

- energy automatically becomes money;
- SolarPunk / SPK v1 is production-ready;
- CEIR is a trading strategy;
- satellite data proves site-level production;
- the five-constraint framework proves market adoption;
- this thesis is an energy stablecoin or dollar-peg product.

## Send package

| File | Purpose |
|---|---|
| `output/THESIS_GROUNDED.docx` | **Main attachment** |
| `SUBMIT_TO_ADVISOR.md` | Handoff instructions + sample email |
| `THESIS_READERS_GUIDE.md` | Optional digest for advisor |

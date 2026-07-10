# CEIR Final Diagnosis

**Date:** 2026-07-10  
**Purpose:** Close the CEIR investigation. Do **not** rescue an energy-specific coefficient.  
**Companion CSV:** `empirical_results/ceir_final_negative_controls.csv`  
**Reproduce:** `python3 thesis_package/ceir_final_diagnostics.py`

## Verdict

> Passive mining-cost ratios do **not** cleanly identify an energy-value anchor.

Apparent CEIR–return association in the legacy panel is **not distinguishable** from persistent valuation relative to a slowly rising denominator (cumulative energy quantity or even cumulative calendar time). Electricity-price construction in the canonical panel is defective; the 2018 cumulative-cost stock matters; robust joint break evidence is insignificant; trading underperforms.

**Chapter 3 role going forward:** boundary / negative identification diagnosis that motivates explicit constraints (Chapters 4–5).

## Stationarity and common-trend diagnostics

| Series | ADF p-value (lower ⇒ more evidence against unit root) |
|--------|------------------------------------------------------:|
| log(CEIR) | 0.3341 |
| log(MarketCap) | 0.4851 |
| log(cumulative cost) | 0.008409 |
| log(cumulative TWh) | 0.1571 |
| log(Price) | 0.4833 |
| ret_30d | 1.544e-09 |

| Pair | Corr of log ratios |
|------|-------------------:|
| CEIR vs MCap/cum TWh | 0.999989 |
| CEIR vs MCap/cum days | 0.8993 |

| Cointegration (Engle–Granger) | p-value |
|-------------------------------|--------:|
| log(MCap) ~ log(cum cost) | 0.5835 |
| log(MCap) ~ log(cum TWh) | 0.5836 |

**Reading:** CEIR and MCap/cum-TWh log-ratios are essentially the same object under the legacy near-constant tariff (corr ≈ 1). That alone ends any claim that geography-weighted electricity pricing drives the result. Engle–Granger cointegration does not support a stable long-run MCap–cost equilibrium in this panel.

## Negative-control comparison

### Preferred overlapping 30-day returns (pre-ban)

| Regressor | β | HAC p | N |
|-----------|--:|------:|--:|
| CEIR | -0.2629 | 0.0004867 | 892 |
| MCap / cum TWh | -0.2623 | 0.0004904 | 892 |
| MCap / cum days | -0.2799 | 0.0002057 | 892 |

### Non-overlapping 30-day and monthly (pre-ban; small N — interpretive only)

| Spec | β (CEIR) | HAC p | N |
|------|---------:|------:|--:|
| Non-overlapping 30d | -0.2206 | 0.0008458 | 30 |
| Month-end → next month | -0.2236 | 0.001331 | 29 |

**Caveat:** Thinned samples remain numerically close across CEIR / TWh / days. They do **not** restore an electricity-price-specific identification. Post-ban overlapping 30d CEIR remains weak (β ≈ −0.07, HAC p ≈ 0.13). Full table: `ceir_final_negative_controls.csv`.

## Prior audit facts retained

1. Legacy `electricity_price` ≈ constant 0.076 with 29 month-start spikes (failed merge) — see `CEIR_DATA_LINEAGE_AUDIT.md`.  
2. ~$3.30bn on 2019-01-01 = 2018 cumsum under that constant (`ceir_cumulative_seed_audit.json`).  
3. Uniform ±20% price scaling is a mathematical identity under constant p, not robustness.  
4. Regime horse races with price/momentum are collinear/unstable (sign flips).  
5. Joint robust Wald on full post-ban interactions: HAC p ≈ 0.13 (does **not** reject stability).  
6. Trading rule underperforms buy-and-hold (+176% vs +2771%).

## What this does **not** kill

- Energy expenditure in Bitcoin mining is real.  
- The five-constraint architecture (data, issuance, pricing, settlement, governance).  
- Public Lab issuance/settlement demonstration on Sepolia.

## What this does kill / retire

- CEIR as a clean energy-specific valuation factor.  
- China ban as a strongly identified structural break under robust joint tests.  
- “Canonical weighted electricity-cost denominator” as currently stored.  
- Any bridge that says CEIR validates SolarPunk issuance.

## Stop rule

No further CEIR coefficient hunting. Optional later work is only documentation hygiene or a fully rebuilt panel for appendix transparency — not thesis-centre rescue.

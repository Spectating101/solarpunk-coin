# Thesis Numbers Manifest

**Generated:** 2026-06-30 15:44 UTC  
**Verification:** PASS  
**Regenerate:** `npm run thesis:verify` or `npm run thesis:figures`

Canonical values below are what Chapters 3–5 should cite. Prose may round;
tables and at-a-glance boxes should match within ±0.01 unless noted.

## Chapter 3 — CEIR (Bitcoin)

| Item | Value | Source |
|------|------:|--------|
| Pre-ban N | 872 | `ceir_analysis_summary.csv` |
| Post-ban N | 1408 | same |
| Pre-ban β (log CEIR) | -0.2623 | same |
| Post-ban β (log CEIR) | -0.0708 | same |
| Chow p-value | 1.11e-16 | same |
| Trading rule | 176.4% vs 2771% buy-and-hold; Sharpe 0.72 vs 1.13 | `ceir_trading_rule_summary.json` |

## Chapter 4 — Pricing (Taiwan base)

| Item | Value | Source |
|------|------:|--------|
| S₀ | $0.0525/kWh | `options_pricing.py` |
| σ | 189% | same |
| Binomial call | $0.01920/kWh | `cross_location_pricing.csv` |
| Monte Carlo call | $0.01960/kWh | same |
| Method gap | 2.08% | same |
| Strike convention | K = S₀ per location (ATM) | Table 4.2 |
| Taiwan margin (1.5× VaR₉₉) | ~$0.63/kWh | `margin_stress_table.csv` |

## Chapter 5 — SPK v1 (Sepolia runtime)

| Item | Value | Source |
|------|------:|--------|
| Total supply | 5499.015 SPK | `state/runtime/spk_v1.json` |
| Settled | 442.0 SPK | same |
| Network payments | 21 | same |
| Circulation share | 96.71% | same |
| Peg enabled | False | same |
| Synced at | 2026-06-10T16:45:22.112606Z | same |

## Figures (embedded in DOCX)

| Figure | File | Chapter |
|--------|------|---------|
| CEIR timeline | `ceir_timeline.png` | 3 |
| CEIR forward returns (illustrative) | `ceir_forward_returns.png` | 3 |
| Trading rule negative result | `trading_rule_comparison.png` | 3 |
| Cross-location pricing | `cross_location_pricing.png` | 4 |
| Binomial convergence | `binomial_convergence.png` | 4 |
| Margin stress | `margin_stress_taiwan.png` | 4 |

## Literature (Ch 2)

No automated numeric check. Ch 2 cites Kydland & Prescott, Barro & Gordon, Bordo,
Eichengreen, Hayes, Liu & Tsyvinski, Black–Scholes, CRR, Bessembinder & Lemmon,
Cong & He, BIS (2023), Chainlink oracle docs. Merged at build into final References.

# Pillar 2 — Pricing Robustness

## Canonical run (cite in thesis)

**Script:** `thesis_package/options_pricing.py`  
**Strike convention:** `K = S₀` per location (ATM)  
**Outputs:** `empirical_results/cross_location_pricing.csv`, `pricing_convergence_summary.csv`

| Location | S0 | σ | Binomial | MC | % Diff |
| --- | --- | --- | --- | --- | --- |
| Germany | 0.0250 | 0.45 | 0.00234 | 0.00236 | +0.9% |
| Taiwan | 0.0525 | 1.89 | 0.01917 | 0.01957 | +2.1% |
| Saudi Arabia | 0.0550 | 1.72 | 0.01841 | 0.01876 | +1.9% |
| Arizona, USA | 0.0580 | 1.65 | 0.01877 | 0.01911 | +1.8% |
| Brazil | 0.0950 | 1.98 | 0.03702 | 0.03781 | +2.1% |

Taiwan base-case margin (1.5× VaR₉₉, spot formula): **~$0.633/kWh** at `S₀ = 0.0525`, `σ = 1.89`, `T = 0.25`.

## Legacy fixed-K prototype (do not cite as canonical)

Earlier drafts held `K = $0.0525/kWh` for all locations. That inflated Saudi Arabia, Arizona, and Brazil relative to the current ATM convention. Those numbers appear only in archived notes and must not be mixed with Table 4.2.

## Sensitivity checklist

- Vary σ ±25%; report convexity of option value to σ.
- Vary S₀ ±20%; report delta changes.
- Horizon: `T` from 0.25 to 1.0 years (GBM more defensible at short horizons).
- Convergence: `binomial_convergence.csv` (Taiwan); Figure 4.3.

## Limitations (state in thesis)

- GBM benchmark; no jumps/mean reversion in the canonical run.
- Irradiance-derived σ ≠ traded power-price volatility.
- No liquid implied-vol market; cold-start inputs from public data.

## Regenerate

```bash
python thesis_package/options_pricing.py
python thesis_package/verify_thesis_numbers.py
```

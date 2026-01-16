# Pillar 2 — Pricing Robustness (Dec 2025)

## Inputs & Assumptions
- Model: European call on $/kWh with GBM, quarterly horizon (T=0.25), r=2.5%.
- Strikes: K=$0.0525/kWh (cost floor example).
- Volatility: Location-specific σ from NASA irradiance-derived variability (used as proxy for price volatility in constrained grids). S0 per location reflects representative spot.
- Methods: Binomial (N=400) vs Monte Carlo (10,000 paths, daily steps). Convergence tested across locations.

## Convergence & Cross-Location Summary
Source: `empirical/pricing_convergence_summary.csv`

| Location | S0 | σ | Binomial | MC | % Diff |
| --- | --- | --- | --- | --- | --- |
| Germany | 0.0250 | 0.45 | 0.000001 | 0.0000009 | -19.7%* |
| Taiwan | 0.0525 | 1.89 | 0.01917 | 0.02025 | +5.6% |
| Saudi Arabia | 0.0550 | 1.72 | 0.01929 | 0.01945 | +0.85% |
| Arizona | 0.0580 | 1.65 | 0.02068 | 0.02100 | +1.55% |
| Brazil | 0.0950 | 1.98 | 0.05373 | 0.05449 | +1.42% |

\*Germany price is near-zero because K >> S0; relative diff is inflated on a tiny base. All other locations converge within ~1–6%.

## Sensitivity Checklist (to include in thesis text)
- Vary σ: show pricing and Greeks for σ ±25%; note convexity of option value to σ.
- Vary S0: ±20% spot shift; report delta changes and re-hedge guidance.
- Horizon: T from 0.25 to 1.0 (GBM assumption more defensible ≤1y).
- Steps/paths: convergence curves generated (Taiwan params) in `empirical/pricing_convergence_plots.png`, with raw data in `empirical/binomial_convergence.csv` and `empirical/mc_convergence.csv`.
- σ/S0 grid (MC 5k paths): see `empirical/pricing_sensitivity_grid.csv` (S0 multipliers 0.8–1.2, σ multipliers 0.75–1.25). Prices rise smoothly with both; use in thesis as a compact sensitivity table.

## Greeks (recompute per current parameters)
- `empirical/pricing_greeks_taiwan_smooth.csv` (MC finite differences, 40k paths, common shocks): smoother delta/gamma for Taiwan params; still caution on gamma at high σ. `pricing_greeks_taiwan.csv` (20k paths) is retained for reference.
- Map to hedge behavior: high vega and gamma (when estimated cleanly) imply frequent rebalancing; theta modest vs σ-driven moves.

## Limitations to state explicitly
- Process: GBM, no jumps/mean reversion; acceptable for ≤1y horizon but not for long-tenor or high-jump regimes.
- Data: Satellite-derived σ ≠ realized price; basis risk vs actual settlement price.
- Market incompleteness: No implied vols; this is a physics-informed starting point.

## Next optional steps (if time)
- Add convergence plots (price vs steps/paths).
- Add σ and S0 sensitivity tables to thesis figures.
- If ground-truth price data exists, back-cast σ and compare to NASA-based σ.

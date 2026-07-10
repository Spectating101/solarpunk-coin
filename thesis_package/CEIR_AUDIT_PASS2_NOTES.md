# CEIR Audit Pass 2 Notes

**Status:** Analytical only — do **not** treat as v11 authorization.

## Cumulative-cost “seed” (~$3.30bn on 2019-01-01)

See `empirical_results/ceir_cumulative_seed_audit.json`.

- Complete panel starts **2018-01-01** with `cumulative_cost = daily_cost` (no pre-2018 stock).
- Sum of 2018 daily costs ≈ **$3.292bn**.
- On **2019-01-01**, cumulative ≈ **$3.300bn** (= 2018 sum + that day’s cost).
- Analysis panel drops 2018 rows but **keeps** that cumulative stock in the denominator.
- Built under near-constant `electricity_price ≈ 0.076234375`.

## Incremental information (regime-specific)

See `ceir_incremental_information_by_regime.csv`.

Interpret pre-ban and post-ban blocks separately. Pooled-only horse races can average away the thesis claim.

## Joint break Wald

See `ceir_joint_break_wald.json`.

Language until joint evidence is clear and stable across constructions:

> specification-dependent or suggestive evidence of parameter instability

## Economic constructions

See `ceir_economic_constructions.csv` for alternative geography price vectors, post-2022 rules,
seed scales, and non-price ratios (MCap/cum TWh, MCap/cum days).

If non-price ratios behave like CEIR, electricity pricing is not adding identifiable information.

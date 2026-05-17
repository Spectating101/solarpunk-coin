# SolarPunk Empirical Finance Backtest

- generated_at: `2026-05-17T05:03:28.266Z`
- thesis: This backtest asks whether the energy-standard monetary mechanics survive contact with historical resource data and conventional project-finance ratios.

## Input Basis

| Item | Value |
|---|---|
| Resource source | NASA POWER Daily API |
| Resource query | https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=121.3&latitude=24.99&start=20240101&end=20260517&format=JSON |
| Location | Taoyuan, Taiwan (24.99, 121.3) |
| Window | 2024-01-01 -> 2026-05-12 |
| Observed days | 862 |
| Solar model | `daily_ac_kwh = GHI_kWh_m2_day * kWdc * (1 - PVWatts_loss_pct)` |
| Energy basis | $0.05/kWh |
| Retail offset | $0.12/kWh |
| Export credit | $0.05/kWh |
| Capex assumption | $3.15/Wdc |

## Finance Claims

| Claim | Value |
|---|---:|
| Empirical days | 862 |
| Rooftop p50 annual energy value | $1,067.84 |
| Rooftop p50 DSCR | 0.325x |
| Rooftop p10 DSCR | 0.2684x |
| Rooftop monthly revenue-at-risk vs p50 | $27.92 |
| Empirical status | `resource_real_but_finance_requires_better_tariff_capex_or_capital_structure` |

## Result Meaning

The historical resource series supports the physical energy model, but the stated tariff, capex, debt, and self-consumption assumptions do not yet clear conventional project-finance thresholds.
The product implication is direct: paid launch needs at least one of better tariff/PPA economics, lower installed cost, subsidy/incentive capture, more favorable capital structure, or a non-energy-value revenue layer.

## Archetype Backtest

| Archetype | P50 annual value | P10 annual value | P50 DSCR | P10 DSCR | P50 payback | Monthly reserve target | Daily CV | Longest below-P25 run |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 kW solar home | $1,067.84 | $881.9 | 0.325x | 0.2684x | 29.5y | $27.92 | 0.4448 | 8d |
| 250 kW neighborhood cluster | $28,807.5 | $23,791.27 | 0.3507x | 0.2896x | 27.34y | $753.25 | 0.4448 | 8d |
| 1 MW commercial portfolio | $123,676.16 | $102,140.53 | 0.3764x | 0.3108x | 25.47y | $3,233.86 | 0.4448 | 8d |

## Hard Boundaries

- NASA irradiance is real public resource data, not signed meter production.
- PV conversion, tariffs, export credit, debt terms, capex, and self-consumption are explicit assumptions.
- This improves empirical finance evidence but does not prove customer demand, legal redemption, or real revenue.
- SPK minting still requires accepted signed meter or inverter surplus attestations.

## Reproduce

```bash
npm run product:empirical-backtest
npm run product:empirical-backtest:test
```

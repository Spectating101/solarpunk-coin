# SolarPunk Energy-Money Simulation

- generated_at: `2026-05-16T16:50:48.588Z`
- framing: This is the currency-system model: measured renewable resource -> explicit surplus assumptions -> SPK issuance -> settlement velocity -> redemption claims -> delivery shortfall reserves.
- value_proposition: SolarPunk is not merely a pilot proof machine. The product claim is an energy-standard monetary framework whose supply expansion is tied to measured productive energy and whose redemption risk is visible before launch.

## Input Basis

| Item | Value |
|---|---|
| resource_signal | `state/keeper_logs/summary.json recent Sepolia keeper runs` |
| resource_signal_type | `real NASA POWER-derived daily solar index already written through the public lab keeper` |
| base_production_model | `state/product/resource_benchmark_lab.json 10 kWdc PV conversion` |
| energy_price_usd_per_kwh | `0.05` |
| mint_fee_bps | `10` |
| redemption_fee_bps | `10` |
| settlement_fee_bps | `0` |
| observed_days | `14` |
| first_observed_date | `2026-05-03` |
| last_observed_date | `2026-05-16` |
| annualization_factor | `26.071429` |

## Archetype Results

| Archetype | Capacity | Self-use | Redeem | Shortfall | Reserve | Window SPK | Annualized SPK | Annualized shortfall liability | Annualized reserve gap |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 kW solar home | 10 kW | 55% | 35% | 1% | $5 | 7.6795 | 200.22 | $0.7 | $0 |
| 250 kW neighborhood cluster | 250 kW | 65% | 50% | 3% | $500 | 149.3245 | 3,893.1 | $58.4 | $0 |
| 1 MW commercial portfolio | 1,000 kW | 75% | 45% | 5% | $5,000 | 426.6416 | 11,123.16 | $250.27 | $0 |

## Network Totals

| Metric | Observed Window | Annualized Projection |
|---|---:|---:|
| Eligible surplus | 11,684.6 kWh | 304,634.16 kWh |
| SPK issued | 583.6457 | 15,216.48 |
| Settlement volume | 1,664.7554 | 43,402.55 |
| Redeemed SPK | 269.3388 | 7,022.05 |
| Active supply | 314.3068 | 8,194.43 |
| Additional reserve gap | $0 | $0 |
| Conservation check | `true` | `true` |

## Hard Boundaries

- This is a transparent simulation, not a claim of current real users or revenue.
- NASA/keeper resource signals are real; self-consumption, redemption, velocity, and shortfall values are explicit assumptions.
- Model-estimated surplus cannot mint SPK unless replaced by accepted signed meter or inverter attestations.
- The simulation strengthens the currency-framework argument; it does not remove the need for a real pilot, audit, or legal redemption terms.

# SolarPunk Economic Launch Readiness

- generated_at: `2026-05-17T05:01:50.317Z`
- thesis: This artifact converts the empirical resource backtest into launch economics: DSCR targets, required realized $/kWh, capex ceiling, support capital, sensitivity paths, and explicit launch decisions.

## Decision

| Mode | Economic status |
|---|---|
| Public lab | `economic_evidence_ready` |
| Closed pilot | `requires_anchor_tariff_ppa_capex_reduction_or_support_capital` |
| Paid/mainnet | `blocked_by_unit_economics_and_protocol_revenue` |

The empirical economics are now measurable and externally inspectable, but current assumptions do not justify an unsupported paid launch.

## Input Basis

| Item | Value |
|---|---:|
| Empirical window | 2024-01-01 -> 2026-05-11 |
| Empirical days | 861 |
| Target p50 DSCR | 1.2x |
| Target p10 DSCR | 1x |
| Target max simple payback | 15 years |

## Current Unit Economics

| Archetype | Current p50 DSCR | Current p10 DSCR | Current payback | Required realized value | Required value multiplier | Max launch capex | Annual support gap | Capital support gap | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 10 kW solar home | 0.325x | 0.2679x | 29.5y | $0.3304/kWh | 3.73x | $0.8438/Wdc | $2,875 | $23,062 | `needs_anchor_tariff_ppa_capex_reduction_or_support_capital` |
| 250 kW neighborhood cluster | 0.3507x | 0.2891x | 27.34y | $0.3304/kWh | 3.46x | $0.9105/Wdc | $69,776 | $559,863 | `needs_anchor_tariff_ppa_capex_reduction_or_support_capital` |
| 1 MW commercial portfolio | 0.3764x | 0.3103x | 25.47y | $0.3304/kWh | 3.22x | $0.9773/Wdc | $270,656 | $2,172,709 | `needs_anchor_tariff_ppa_capex_reduction_or_support_capital` |

## Best Near-Term Economic Paths

The lowest absolute support path is **10 kW solar home**. The best scaled economics path is **1 MW commercial portfolio**.

| Path | Required value | Value multiplier | Max launch capex | Annual support gap | Capital support gap |
|---|---:|---:|---:|---:|---:|
| 10 kW solar home | $0.3304/kWh | 3.73x | $0.8438/Wdc | $2,875 | $23,062 |
| 1 MW commercial portfolio | $0.3304/kWh | 3.22x | $0.9773/Wdc | $270,656 | $2,172,709 |

## Protocol Revenue Gap

| Metric | Value |
|---|---:|
| Annual protocol fee revenue | $22.24 |
| Annual opex assumption | $120,000 |
| Opex coverage | 0.0185% |
| Fee base gap | 5,396.04x |
| Minimum closed-pilot finance stack | $175,746 |

## Minimum Viable Sensitivity Rows

Tested 1,080 combinations; 828 clear the launch economics thresholds.

| Archetype | Value multiplier | Capex reduction | Debt share | Debt rate | P50 DSCR | P10 DSCR | Payback |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 MW commercial portfolio | 1.5x | 15% | 30% | 8% | 1.55x | 1.28x | 14.43y |
| 1 MW commercial portfolio | 1x | 45% | 30% | 8% | 1.6x | 1.32x | 14.01y |
| 1 MW commercial portfolio | 1.5x | 15% | 30% | 6% | 1.7x | 1.4x | 14.43y |
| 1 MW commercial portfolio | 1x | 45% | 30% | 6% | 1.75x | 1.44x | 14.01y |
| 1 MW commercial portfolio | 1.5x | 15% | 30% | 4% | 1.87x | 1.54x | 14.43y |
| 10 kW solar home | 2x | 0% | 30% | 8% | 1.52x | 1.25x | 14.75y |
| 250 kW neighborhood cluster | 2x | 0% | 30% | 8% | 1.64x | 1.35x | 13.67y |
| 1 MW commercial portfolio | 2x | 0% | 30% | 8% | 1.76x | 1.45x | 12.73y |

## Readiness Checks

- PASS empirical_resource_window: 861 observed NASA POWER days are available for launch economics.
- BLOCKED project_finance_targets: Best current p50 DSCR is 0.3764x; target is 1.2x.
- BLOCKED protocol_fee_self_funding: Protocol fee revenue covers 0.0185% of the current operating-budget assumption.
- PASS minimum_viable_scenario_exists: Sensitivity grid contains launch-economics-positive scenarios once tariff/value, capex, and capital terms improve.
- PASS paid_launch_gate_still_blocks: Paid/mainnet remains blocked until non-economic controls are also complete.

## Launch Terms Required

- A signed tariff, PPA, or internal value-of-energy term high enough to clear the required blended realized $/kWh threshold.
- A capex quote or subsidy/incentive package that moves installed cost below the max launch capex threshold.
- A debt/equity structure that clears p50 and p10 DSCR simultaneously instead of relying on average-year production.
- A named reserve and shortfall policy matching the finance dossier and monetary stress harness.
- Separate business revenue terms for the operator/service layer, because protocol fees alone do not self-fund operations at the current scale.

## Hard Boundaries

- This is launch economics evidence, not investment advice, not a securities offering, and not a revenue promise.
- NASA POWER data is empirical resource data, not signed meter production.
- Sensitivity rows are mechanical thresholds; they are not market forecasts or guaranteed terms.
- Paid launch remains blocked until real meter data, governed deployment, audit, legal terms, reserve policy, and customer/counterparty terms exist.

## Reproduce

```bash
npm run product:economic-launch
npm run product:economic-launch:test
```

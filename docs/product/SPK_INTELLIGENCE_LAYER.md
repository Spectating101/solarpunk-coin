# SolarPunk Intelligence Layer v1

Off-chain AI/statistical intelligence for renewable-energy mint claims, pilot risk, and finance readiness. AI advises; contracts decide.

## Current Result

- generated_at: `2026-05-21T16:05:30.139Z`
- implementation_stage: `deterministic_risk_stack_v1_no_llm_required`
- advisory_only: `true`
- overall_risk: `normal_public_lab_fixture`
- risk_stack_readiness: `public_lab_only`
- rows_scored: `7`
- max_anomaly_score: `0.1176`
- provenance_level: `L0`
- nrel_training_rows: `1095`
- adversarial_checks: `4/4`

## NREL Training Baseline

- available: `true`
- training_stage: `public_model_baseline_ready`
- reference_site: Taoyuan 10 kW rooftop
- reference_site_annual_ac_kwh: `11743.0994`
- reference_weather_source: NSRDB PSM V3 Himawari tmy-2020 3.2.0
- operator_crosscheck_average_absolute_deviation_pct: `32.8559%`

This improves forecasting and anomaly scoring, but it is modeled public-resource data, not real meter proof.

## Audit Dossier

- operator_submitted: 235.7 kWh generation, 103.8 kWh eligible surplus
- expected_range: 17.8761-42.6276 kWh/day
- deviation: 3.3805% average daily deviation from NASA/PV benchmark
- risk: `normal_public_lab_fixture`
- review_note: Energy values are statistically plausible for a public-lab sample, but L0 provenance means the data cannot support real-value SPK issuance.
- contract_boundary: AI advises; contracts decide. SPK minting still depends on signed attestations, replay protection, oracle roles, source-hash uniqueness, reserve checks, and contract rules.

## Risk Stack

| Risk type | Score | Status | Evidence | Interpretation |
|---|---:|---|---|---|
| Physical plausibility | 0.1176 | `normal` | 7 rows scored; 0 rows flagged | Some rows deviate from the modeled baseline but stay below review thresholds. |
| Data quality/signatures | 0.0536 | `normal` | 7/7 signatures verified; average quality 0.9757 | Checks whether accepted rows are signed and meet quality thresholds. |
| Hardware/data provenance | 0.95 | `blocked` | L0 | Adapter sample or fixture; Software normalization, signing, replay protection, and verifier compatibility. |
| Economic viability | 0.6863 | `suspicious` | best current p50 DSCR 0.3764x | The empirical economics are now measurable and externally inspectable, but current assumptions do not justify an unsupported paid launch. |
| Redemption/shortfall reserve | 0.3941 | `review` | $3940.99 worst additional buffer required | Stress scenarios need a named reserve before real-value redemption can be promised. |
| Overall pilot readiness | 0.9 | `blocked` | real_value_mint_allowed=false; provenance=L0 | Current sample remains public-lab only; closed pilot needs real operator hardware evidence and economics. |

## Seven-Day Forecast

- method: `capacity_scaled_nasa_pvwatts_with_observed_surplus_ratio`
- confidence: `wide_public_lab_band`
- observed_surplus_ratio: `0.44039`

| Scenario | Generation kWh | Eligible surplus kWh | Net SPK preview |
|---|---:|---:|---:|
| low | 125.1327 | 55.1072 | 2.752607 |
| base | 192.5119 | 84.7804 | 4.23478 |
| high | 298.3934 | 131.4096 | 6.563909 |

Forecast uses current sample surplus ratio and resource baseline; it is not a production forecast until real site telemetry exists.

## Finance Readiness

- stage: `finance_model_ready_but_capital_and_revenue_blocked`
- closed_pilot_economic_status: `requires_anchor_tariff_ppa_capex_reduction_or_support_capital`
- paid_mainnet_economic_status: `blocked_by_unit_economics_and_protocol_revenue`
- minimum_annual_support_required_usd: `$2875.48`
- minimum_capital_support_required_usd: `$23046.29`
- opex_coverage_ratio: `0.000185`
- worst_additional_buffer_required_usd: `$3940.99`

Finance intelligence is advisory: it sizes support, revenue, and reserve gaps; it does not authorize paid launch.

## Adversarial Checks

| Scenario | Caught | Risk | Score | Flags |
|---|---|---|---:|---|
| impossible_generation | `true` | `suspicious` | 1 | physical_or_energy_balance_violation, above_expected_solar_range |
| export_exceeds_generation | `true` | `suspicious` | 1 | physical_or_energy_balance_violation, below_expected_solar_range, very_high_export_ratio |
| surplus_overclaim | `true` | `suspicious` | 1 | physical_or_energy_balance_violation, below_expected_solar_range |
| low_quality_claim | `true` | `review` | 0.3719 | below_expected_solar_range, low_quality_score |

## Scored Rows

| Date | Generation kWh | Expected kWh | Range kWh | Deviation | Score | Risk | Flags |
|---|---:|---:|---:|---:|---:|---|---|
| 2026-05-01 | 31.2 | 47.8112 | 31.0773-74.1074 | -34.7433% | 0 | `normal` | within_expected_range |
| 2026-05-02 | 28.6 | 20.5992 | 13.3895-31.9288 | 38.8403% | 0 | `normal` | within_expected_range |
| 2026-05-03 | 34.9 | 36.4735 | 23.7078-56.5339 | -4.3141% | 0 | `normal` | within_expected_range |
| 2026-05-04 | 41.3 | 36.2815 | 23.583-56.2363 | 13.8321% | 0 | `normal` | within_expected_range |
| 2026-05-05 | 22.4 | 39.3264 | 25.5622-60.9559 | -43.0408% | 0.0773 | `normal` | below_expected_solar_range |
| 2026-05-06 | 37.8 | 21.7048 | 14.1081-33.6424 | 74.155% | 0.1176 | `normal` | above_expected_solar_range |
| 2026-05-07 | 39.5 | 50.0414 | 32.5269-77.5642 | -21.0654% | 0 | `normal` | within_expected_range |

## AI Boundary

> AI advises; contracts decide.

- This layer does not mint SPK and does not approve SPK minting.
- It does not prove physical truth; it flags whether reported values look plausible against a resource baseline.
- Current sample is L0 public-lab data, so real-value issuance remains blocked even when risk is normal.
- Production use would need real operator data, stronger hardware provenance, audit scope, and legal redemption terms.

## Contract Authority Remains Deterministic

- registered signatures
- oracle role
- source-hash replay protection
- attestation validity windows
- reserve and grid-stress controls
- supply cap and fee logic

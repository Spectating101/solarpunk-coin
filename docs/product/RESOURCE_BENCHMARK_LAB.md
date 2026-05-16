# SolarPunk Multi-Resource Benchmark Lab

- generated_at: `2026-05-16T07:30:22.728Z`
- location: `Taoyuan, Taiwan` (24.99, 121.3)
- fetch_status: `live_nasa_power`
- thesis: Expand SPK from a solar-only narrative into a measured renewable-resource framework while preserving the rule that only signed surplus-energy attestations can mint.

## What This Adds

This artifact turns the product from a solar-only pitch into a renewable-resource benchmark layer:

- solar gets measured NASA irradiance plus a standard 10 kWdc PV conversion and installation-cost assumption
- wind gets measured NASA 10 m wind speed plus a resource-density conversion
- geothermal, tidal, hydro, and biogas/biomass get explicit benchmark-only capacity-factor models
- oil is included only as a fossil energy-unit benchmark and is not SPK mint-eligible

## NASA Resource Window

| Field | Value |
|---|---:|
| Requested window | `2026-05-01 -> 2026-05-11` |
| GHI observations | `11` |
| Wind observations | `11` |
| Temperature observations | `11` |
| Approx NASA grid-cell area | `2808 km2` |

## Standard Solar PV Conversion

| Metric | Value |
|---|---:|
| System size | `10 kWdc` |
| Module efficiency assumption | `20%` |
| Panel area | `50 m2` |
| PVWatts-style loss assumption | `14%` |
| Latest NASA GHI | `3.2566 kWh/m2/day` |
| Average window GHI | `3.1979 kWh/m2/day` |
| Latest day AC output | `28.0068 kWh` |
| Average window day AC output | `27.5017 kWh` |
| Annualized AC output from window average | `10038.12 kWh` |
| Residential installed-cost assumption | `$3.15/Wdc` |
| Installed cost before incentives | `$31500` |

Formula:

```text
daily_ac_kwh = NASA_GHI_kWh_m2_day * system_kWdc * (1 - PVWatts_loss_pct)
area_m2 = kWdc / module_efficiency, assuming 1 kW/m2 STC irradiance
```

## Solar Value Sensitivity

| Energy price | Latest day value | Latest day SPK after fee | Annualized value | Simple capex payback |
|---:|---:|---:|---:|---:|
| $0.05/kWh | $1.4003 | 1.3989 SPK | $501.91 | 62.76 years |
| $0.1/kWh | $2.8007 | 2.7979 SPK | $1003.81 | 31.38 years |
| $0.2/kWh | $5.6014 | 5.5958 SPK | $2007.62 | 15.69 years |

## Wind Resource Density

| Metric | Latest | Window Average |
|---|---:|---:|
| 10 m wind speed | `1.76 m/s` | `2.8209 m/s` |
| Hub-height estimate | `2.0526 m/s` | `3.2899 m/s` |
| Recoverable kWh per swept m2 per day | `0.040046` | `0.164887` |
| Recoverable kWh/day at 50 m2 swept area | `2.0023` | `8.2443` |

## Resource Matrix

| Resource | Evidence status | Measured input | Benchmark output | Mint eligibility | Next data needed |
|---|---|---:|---:|---|---|
| Solar PV rooftop | `measured_resource_estimate` | `true` | `28.0068 kWh/day` | `eligible_after_signed_meter_attestation` | Real inverter or revenue-grade meter export for the same site. |
| Wind turbine | `measured_resource_density` | `true` | `8.2443 kWh/day` | `eligible_after_signed_meter_attestation` | Turbine power curve, hub-height wind study, and metered generation/export. |
| Geothermal | `dispatchable_benchmark_only` | `false` | `216 kWh/day` | `eligible_after_signed_meter_attestation_and_resource_policy` | Site reservoir data, plant technology, interconnection, and metered generation. |
| Tidal / marine | `site_resource_required` | `false` | `84 kWh/day` | `eligible_after_signed_meter_attestation_and_resource_policy` | Bathymetry, tidal-current measurements, permits, turbine curve, and metered generation. |
| Small hydro | `site_resource_required` | `false` | `120 kWh/day` | `eligible_after_signed_meter_attestation_and_resource_policy` | Flow-duration curve, head, permits, turbine curve, and metered generation. |
| Biogas / biomass | `fuel_chain_required` | `false` | `192 kWh/day` | `eligible_after_signed_meter_attestation_and_resource_policy` | Renewable fuel provenance, emissions boundary, generator metering, and policy review. |
| Crude oil benchmark | `unit_conversion_benchmark` | `false` | `1699.81 kWh thermal / barrel` | `not_eligible` | Oil is included only to compare energy units and fossil baselines; it is not renewable and cannot mint SPK. |

## Protocol Bridge

1. `resource_data_or_site_model`
2. `real_meter_or_inverter_export`
3. `signed_meter_reading`
4. `derive_meter_attestations`
5. `accepted_surplus_kwh`
6. `mintFromSurplusAttestation`
7. `SolarPunkCurrencySystem_invoice_settlement`
8. `redemption_burn_into_owed_kwh_receipt`
9. `delivery_resolution`

## Hard Boundaries

- A NASA resource estimate is not mint evidence.
- A capacity-factor benchmark is not mint evidence.
- Oil is a fossil benchmark only and is never SPK mint-eligible under the renewable surplus thesis.
- All SPK issuance still needs accepted signed meter or inverter surplus attestations.
- Installation cost is an assumption for sizing, not a vendor quote or investment return promise.

## References

- [NASA POWER Daily API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/) - ALLSKY_SFC_SW_DWN, WS10M, T2M daily point data and 0.5 degree grid-cell warning.
- [NREL PVWatts V8 API](https://developer.nrel.gov/docs/solar/pvwatts/v8/) - PVWatts-style PV system capacity/loss modelling conventions.
- [DOE Solar Photovoltaic System Cost Benchmarks](https://www.energy.gov/eere/solar/solar-photovoltaic-system-cost-benchmarks) - Residential PV installed-cost benchmark assumption.
- [NREL Annual Technology Baseline 2024](https://atb.nrel.gov/electricity/2024/index) - Technology-wide electricity cost/performance benchmark framing.
- [EIA Energy Conversion Calculators](https://www.eia.gov/energyexplained/units-and-calculators/energy-conversion-calculators.php) - Btu/kWh conversion anchor for fossil energy-unit comparison.

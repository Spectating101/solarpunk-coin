# NREL Solar Map Scenarios

Compact map-ready PVWatts scenarios for the frontend: one modeled 10 kW rooftop point per geography, without storing full hourly or daily traces.

## Result

- generated_at: `2026-05-21T16:36:49.923Z`
- frontend_stage: `map_simulation_ready`
- map_points: `12`
- annual AC range: `8677.8852-17615.3739 kWh`
- strongest_site: `dubai_10kw`
- weakest_site: `berlin_10kw`
- api_key_written_to_artifact: `false`

## Map Points

| Site | Region | Annual AC kWh | SPK ceiling | Value at $0.05/kWh | Tier | Weather source |
|---|---|---:|---:|---:|---|---|
| Taoyuan 10 kW rooftop | reference | 11743.0994 | 586.567815 | $587.15 | `moderate_solar` | NSRDB PSM V3 Himawari tmy-2020 3.2.0 |
| Austin 10 kW rooftop | reference | 14761.5443 | 737.339138 | $738.08 | `strong_solar` | NSRDB PSM V3 GOES tmy-2020 3.2.0 |
| Phoenix 10 kW rooftop | reference | 17551.196 | 876.68224 | $877.56 | `high_solar` | NSRDB PSM V3 GOES tmy-2020 3.2.0 |
| Los Angeles 10 kW rooftop | US West Coast | 16771.081 | 837.715496 | $838.55 | `high_solar` | NSRDB PSM V3 GOES tmy-2020 3.2.0 |
| New York 10 kW rooftop | US Northeast | 12913.5277 | 645.030709 | $645.68 | `moderate_solar` | NSRDB PSM V3 GOES tmy-2020 3.2.0 |
| Berlin 10 kW rooftop | Europe | 8677.8852 | 433.460366 | $433.89 | `lower_solar` | PVWatts International |
| Singapore 10 kW rooftop | Southeast Asia | 11915.886 | 595.198506 | $595.79 | `moderate_solar` | PVWatts International |
| Tokyo 10 kW rooftop | East Asia | 11373.3953 | 568.101095 | $568.67 | `moderate_solar` | PVWatts International |
| Sydney 10 kW rooftop | Australia | 10284.7291 | 513.722219 | $514.24 | `lower_solar` | PVWatts International |
| Nairobi 10 kW rooftop | East Africa | 13662.0073 | 682.417265 | $683.1 | `strong_solar` | PVWatts International |
| Dubai 10 kW rooftop | Middle East | 17615.3739 | 879.887926 | $880.77 | `high_solar` | PVWatts International |
| Sao Paulo 10 kW rooftop | South America | 10840.0572 | 541.460857 | $542 | `lower_solar` | PVWatts International |

## Boundaries

- Map points are modeled 10 kW rooftop scenarios, not real customer sites.
- Modeled SPK ceiling assumes all generated kWh is export-eligible; real SPK requires signed surplus meter data.
- This compact artifact is intended for frontend simulation and reviewer explanation, not mint authorization.
- The NREL API key is supplied only at runtime and is not written into repo artifacts.

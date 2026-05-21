# NREL Solar Training Lab

Build a sanitized PVWatts/NSRDB baseline dataset for SPK claim scoring, forecasting, and future model training.

## Result

- generated_at: `2026-05-21T16:02:34.357Z`
- training_stage: `public_model_baseline_ready`
- sites: `3`
- daily training rows: `1095`
- annual AC range: `11743.0994-17551.196 kWh`
- api_key_written_to_artifact: `false`

## Site Baselines

| Site | Dataset | Annual AC kWh | Capacity factor | Weather source |
|---|---|---:|---:|---|
| Taoyuan 10 kW rooftop | nsrdb | 11743.0994 | 13.4054% | NSRDB PSM V3 Himawari tmy-2020 3.2.0 |
| Austin 10 kW rooftop | nsrdb | 14761.5443 | 16.8511% | NSRDB PSM V3 GOES tmy-2020 3.2.0 |
| Phoenix 10 kW rooftop | nsrdb | 17551.196 | 20.0356% | NSRDB PSM V3 GOES tmy-2020 3.2.0 |

## Operator Sample Crosscheck

- rows_compared: `7`
- average_deviation_pct: `3.3805%`
- average_absolute_deviation_pct: `32.8559%`

| Date | Reported kWh | NREL modeled kWh | Deviation |
|---|---:|---:|---:|
| 2026-05-01 | 31.2 | 47.8112 | -34.7433% |
| 2026-05-02 | 28.6 | 20.5992 | 38.8403% |
| 2026-05-03 | 34.9 | 36.4735 | -4.3141% |
| 2026-05-04 | 41.3 | 36.2815 | 13.8321% |
| 2026-05-05 | 22.4 | 39.3264 | -43.0408% |
| 2026-05-06 | 37.8 | 21.7048 | 74.155% |
| 2026-05-07 | 39.5 | 50.0414 | -21.0654% |

## Monthly Baselines

### Taoyuan 10 kW rooftop

| Month | AC kWh | Avg daily AC kWh | Avg capacity factor |
|---|---:|---:|---:|
| Jan | 730.832 | 23.5752 | 0.09823 |
| Feb | 861.4556 | 30.7663 | 0.128193 |
| Mar | 1084.8634 | 34.9956 | 0.145815 |
| Apr | 1011.6161 | 33.7205 | 0.140502 |
| May | 1001.4645 | 32.3053 | 0.134605 |
| Jun | 1050.4338 | 35.0145 | 0.145894 |
| Jul | 1319.7496 | 42.5726 | 0.177386 |
| Aug | 1247.7002 | 40.2484 | 0.167702 |
| Sep | 1179.9174 | 39.3306 | 0.163877 |
| Oct | 1026.6339 | 33.1172 | 0.137988 |
| Nov | 797.2803 | 26.576 | 0.110733 |
| Dec | 431.1516 | 13.9081 | 0.05795 |

### Austin 10 kW rooftop

| Month | AC kWh | Avg daily AC kWh | Avg capacity factor |
|---|---:|---:|---:|
| Jan | 1015.6694 | 32.7635 | 0.136515 |
| Feb | 920.9452 | 32.8909 | 0.137045 |
| Mar | 1181.4208 | 38.1103 | 0.158793 |
| Apr | 1327.7375 | 44.2579 | 0.184408 |
| May | 1370.0326 | 44.1946 | 0.184144 |
| Jun | 1409.0984 | 46.9699 | 0.195708 |
| Jul | 1482.9652 | 47.8376 | 0.199323 |
| Aug | 1517.7832 | 48.9607 | 0.204003 |
| Sep | 1285.703 | 42.8568 | 0.17857 |
| Oct | 1233.5797 | 39.7929 | 0.165804 |
| Nov | 1069.1324 | 35.6377 | 0.148491 |
| Dec | 947.4773 | 30.5638 | 0.127349 |

### Phoenix 10 kW rooftop

| Month | AC kWh | Avg daily AC kWh | Avg capacity factor |
|---|---:|---:|---:|
| Jan | 1179.4606 | 38.0471 | 0.15853 |
| Feb | 1218.6204 | 43.5222 | 0.181342 |
| Mar | 1538.2239 | 49.6201 | 0.20675 |
| Apr | 1711.0188 | 57.034 | 0.237641 |
| May | 1797.4435 | 57.982 | 0.241592 |
| Jun | 1726.8043 | 57.5601 | 0.239834 |
| Jul | 1564.4969 | 50.4676 | 0.210282 |
| Aug | 1534.8799 | 49.5123 | 0.206301 |
| Sep | 1478.3629 | 49.2788 | 0.205328 |
| Oct | 1405.3538 | 45.334 | 0.188892 |
| Nov | 1230.8103 | 41.027 | 0.170946 |
| Dec | 1165.7209 | 37.6039 | 0.156683 |

## Boundaries

- NREL/PVWatts output is modeled solar production, not signed meter data.
- This artifact is appropriate for training baselines, forecasts, anomaly thresholds, and reviewer demos.
- It cannot authorize real-value SPK minting without signed operator meter or inverter attestations.
- The NREL API key is supplied only at runtime and is not written into repo artifacts.

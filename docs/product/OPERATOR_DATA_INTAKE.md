# SolarPunk Operator Data Intake

This is the bridge for a real solar owner, lab, or university: send a CSV export, SolarPunk validates the rows, signs or verifies them, computes eligible surplus, and previews how much SPK cryptocurrency the data would mint under current testnet rules.

## Input

- csv_path: `data/operator/sample_operator_export.csv`
- profile_path: `data/operator/sample_operator_profile.json`
- operator_name: `SolarPunk sample 10 kW rooftop`
- meter_id: `TW-TY-0001`
- site_id: `sample-rooftop-10kw`
- capacity_kw: `10`
- unsigned: `false`
- private_key_written_to_repo: `false`

## Validation Result

| Metric | Value |
|---|---:|
| Rows | `7` |
| Accepted records | `7` |
| Rejected records | `0` |
| Verified signatures | `7` |
| Solar generation | `235.7 kWh` |
| Export surplus | `103.8 kWh` |
| Eligible surplus | `103.8 kWh` |
| Average quality | `0.975714` |

## SPK Cryptocurrency Preview

| Metric | Value |
|---|---:|
| Source hash | `0xca0ac0052f6f7a01ba6151f2883db55c2f227c65c90a2b7f44ee6fcb1dba4b19` |
| On-chain surplus | `103 kWh` |
| Energy price basis | `$0.05/kWh` |
| Mint fee | `10 bps` |
| Net SPK preview | `5.14485 SPK` |
| Can mint in lab/testnet | `true` |

## Provenance

- level: `L0`
- label: `Sample or public-lab fixture`
- stage: `public_lab_only`
- real_operator_source: `false`
- closed_pilot_ready: `false`
- paid_launch_ready: `false`

Checked-in sample is useful for demo and reviewer reproduction only; it cannot support real-value SPK issuance.

## Daily Case Study Rows

| Date | Generation kWh | Site load kWh | Export kWh | Eligible surplus kWh | Quality |
|---|---:|---:|---:|---:|---:|
| 2026-05-01 | 31.2 | 18.4 | 12.8 | 12.8 | 0.98 |
| 2026-05-02 | 28.6 | 20.2 | 8.4 | 8.4 | 0.97 |
| 2026-05-03 | 34.9 | 16.1 | 18.8 | 18.8 | 0.98 |
| 2026-05-04 | 41.3 | 19.7 | 21.6 | 21.6 | 0.99 |
| 2026-05-05 | 22.4 | 21 | 1.4 | 1.4 | 0.95 |
| 2026-05-06 | 37.8 | 18.9 | 18.9 | 18.9 | 0.98 |
| 2026-05-07 | 39.5 | 17.6 | 21.9 | 21.9 | 0.98 |

## Commercial Pilot Offers

- `data_only_case_study` (500-1500): Turn one anonymized solar export into an SPK mint preview, dashboard metric, and public/private case-study report.
- `weekly_shadow_pilot` (1500-5000/month): Process weekly exports, track accepted/rejected data, and show cumulative SPK preview under capped rules.
- `closed_beta_setup` (7500-25000): Wire a signed inverter/gateway source, governed testnet deployment, monitoring, and audit-ready evidence.

## Run With A Real Operator File

```bash
METER_PRIVATE_KEY=0x... node scripts/operator_data_intake.js \
  --csv=data/operator/operator_export.csv \
  --profile=data/operator/operator_profile.json \
  --now=2026-05-19T00:00:00Z
```

## Boundaries

- The sample file proves the intake mechanics, not a real external solar source.
- Unsigned data is schema-review evidence only and cannot mint SPK.
- L0/L1 data can support demos and shadow pilots, but not paid public SPK issuance.
- Paid public SPK still needs audit, legal/commercial scope, production deployment, reserve policy, and stronger hardware provenance.
- No private key is written to repo outputs.

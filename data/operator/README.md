# Operator Data Intake

This folder defines the minimum file a real solar operator, lab, university, or homeowner can send to SolarPunk.

## Required CSV Shape

```csv
window_start,window_end,generation_kwh,site_load_kwh,export_kwh,curtailed_kwh,quality_score,source
2026-05-01T00:00:00Z,2026-05-01T23:59:59Z,31.2,18.4,12.8,0,0.98,operator_csv_v1
```

`site_load_kwh` means solar generation consumed on site inside the SPK accounting window. If the operator only has gross building consumption, provide `gross_consumption_kwh` and `export_kwh`; the intake script derives the solar self-consumed value needed by the verifier.

## Optional Aliases

The intake script also accepts common column names:

- `production_kwh`, `pv_generation_kwh`, or `solar_generation_kwh` for `generation_kwh`.
- `load_kwh`, `consumption_kwh`, or `gross_consumption_kwh` for load.
- `grid_export_kwh` or `export_surplus_kwh` for `export_kwh`.
- `curtailment_kwh` for `curtailed_kwh`.
- `data_quality` for `quality_score`.

## Run

```bash
npm run product:operator-intake
```

For a real file:

```bash
METER_PRIVATE_KEY=0x... node scripts/operator_data_intake.js \
  --csv=data/operator/operator_export.csv \
  --profile=data/operator/operator_profile.json \
  --now=2026-05-19T00:00:00Z
```

The private key is read from the environment and is not written into repo outputs.

## Boundary

The checked-in sample is only a reproducible public-lab fixture. A real closed pilot needs a named operator, archived source file, signer custody, and preferably live inverter/gateway or utility-corroborated data.

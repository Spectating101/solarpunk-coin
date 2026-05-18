# SolarPunk Pilot Operator Packet

## Purpose

This packet is for one renewable-energy operator, homeowner, researcher, or integrator who can share a meter or inverter export.

The goal is narrow: convert one CSV export into public lab proof that shows accepted readings, rejected readings, surplus kWh, source hash, and SPK mint preview. It is not a paid pilot, token sale, or legal redemption offer.

## What To Send

Preferred CSV columns:

```csv
window_start,window_end,generation_kwh,site_load_kwh,export_kwh,curtailed_kwh,quality_score
2026-05-01T00:00:00Z,2026-05-02T00:00:00Z,3200.5,1250.25,1800.25,150,0.98
```

Minimum requirements:

- `window_start` and `window_end` in ISO timestamp format.
- `generation_kwh`, `site_load_kwh`, `export_kwh`, and `curtailed_kwh` as numeric kWh fields.
- `quality_score` from `0` to `1`, with `0.9` or higher preferred for the current lab threshold.
- Optional anonymization is acceptable if the export still preserves timing, energy totals, and source provenance.

Do not send:

- Private keys, wallet seed phrases, grid account passwords, or login credentials.
- Personally sensitive customer data.
- Financial account data.

## What SolarPunk Produces

Running the pilot path produces:

- `state/product/pilot_csv_raw_readings.json` — canonical raw readings generated from the CSV.
- `state/product/pilot_csv_attestation_bundle.json` — accepted/rejected verifier result.
- `state/product/pilot_csv_receipt.json` — reviewer-facing summary with mint preview.
- `docs/product/PILOT_CSV_RECEIPT.md` — human-readable proof.

The current sample run accepts `2` rows, records `1,985.5 kWh` surplus, floors on-chain surplus to `1,985 kWh`, and previews `99.15075 SPK` at the `$0.05/kWh` basis after 10 bps mint fee.

## Reproducible Command

```bash
npm run product:pilot-csv
```

For a real operator file, use:

```bash
METER_PRIVATE_KEY=0x... node scripts/pilot_csv_receipt.js \
  --csv=data/attestations/operator_export.csv \
  --meter-id=OPERATOR-METER-001 \
  --site-id=operator-site-a \
  --now=2026-05-17T00:00:00Z
```

The private key is read from the environment and is not written into repo outputs.

## Boundary

This packet proves ingestion and accounting readiness only. It does not certify hardware custody, guarantee redemption, imply investment return, or authorize paid/mainnet use. The next upgrade is one real operator export plus a governed Sepolia run, still before real-value launch.

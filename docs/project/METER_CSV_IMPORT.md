# Meter CSV Import

This is the first pilot-facing adapter path for turning a solar inverter or revenue meter export into the signed raw-reading JSON accepted by the SPK attestation pipeline.

It does not prove physical truth by itself. It proves that a named meter export can be canonicalized, signed by the registered meter key, checked against the registry, and then passed through the same verifier used by the public SPK mint proof.

## CSV Schema

Required columns:

- `window_start`
- `window_end`
- `generation_kwh`
- `site_load_kwh`
- `export_kwh`
- `curtailed_kwh`
- `quality_score`

Optional columns:

- `meter_id`
- `site_id`
- `nonce`
- `source`

If `meter_id` or `site_id` are omitted from the CSV, pass them on the command line. If `nonce` is omitted, the importer derives one from the meter and window.

## Import Command

First register the meter address if it is not already in the registry:

```bash
npm run meter:onboard -- \
  --meter-id=TW-TY-0001 \
  --site-id=taoyuan-rooftop-a \
  --device-address=0x... \
  --capacity-kw=120 \
  --active-after=2026-01-01T00:00:00Z \
  --active-until=2027-01-01T00:00:00Z
```

Then import and sign the CSV export:

```bash
METER_PRIVATE_KEY=0x... npm run attestations:import-csv -- \
  --csv=data/attestations/sample_meter_export.csv \
  --registry=data/attestations/meter_registry.json \
  --out=data/attestations/raw_meter_readings_from_csv.json \
  --meter-id=TW-TY-0001 \
  --site-id=taoyuan-rooftop-a \
  --batch-id=csv_demo_2026_02_13
```

Then derive the bundle from that imported payload:

```bash
node scripts/derive_meter_attestations.js \
  --input=data/attestations/raw_meter_readings_from_csv.json \
  --registry=data/attestations/meter_registry.json \
  --out-json=state/attestations/csv_attestation_bundle.json \
  --out-md=docs/project/METER_CSV_ATTESTATION_BUNDLE.md
```

## Safety Checks

The importer refuses to sign unless:

- the meter exists in `meter_registry.json`
- the supplied `site_id` matches the registry
- `METER_PRIVATE_KEY` recovers to the registered `device_address`

For review-only imports, use `--unsigned`. The downstream verifier will reject those rows with `invalid meter signature`, which is intentional.

## Production Requirements

Before this becomes a real hardware adapter, the project still needs:

- hardware-backed or gateway-backed key custody
- tamper-evident export logs
- operator/auditor identity trail
- retry and duplicate-window handling
- per-device revocation process
- signed raw archive retention policy

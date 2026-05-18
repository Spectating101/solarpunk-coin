# SolarPunk Inverter/Meter Adapter Receipt

- generated_at: `2026-05-18T09:53:40.453Z`
- provider: `sample-cumulative`
- source_mode: `sample_cumulative_snapshot_pair`
- evidence_grade: `adapter_sample_or_review`
- interval_method: `cumulative_counter_delta`
- meter_id: `TW-TY-0001`
- site_id: `taoyuan-rooftop-a`
- unsigned: `false`
- private_key_written_to_repo: `false`
- real_operator_source: `false`

## Purpose

Normalize a meter or inverter interval into signed raw readings, then run the same attestation verifier used by SPK minting.

## Normalized Interval

| Field | Value |
|---|---:|
| Window start | `2026-02-14T00:00:00Z` |
| Window end | `2026-02-14T23:59:59Z` |
| Generation | `1388.6 kWh` |
| Site load | `392.4 kWh` |
| Export | `821.2 kWh` |
| Curtailed | `175 kWh` |
| Quality score | `0.97` |

## Attestation Result

| Metric | Value |
|---|---:|
| Accepted readings | `1` |
| Rejected readings | `0` |
| Verified signatures | `1` |
| Accepted surplus | `996.2 kWh` |
| Can mint from adapter | `true` |

## Rejections

- none

## Official Integration Anchors

- [Fronius Solar API JSON](https://www.fronius.com/en/help-center/solar-energy/products/monitoring-control/solutions/open-interfaces/fronius-solar-api-json-) - Fronius states that the inverter or Datamanager exposes a local REST API and returns inverter, meter, and component data as JSON.
- [SunSpec Modbus specifications](https://sunspec.org/specifications/) - SunSpec Modbus is the broader open DER interoperability standard for inverters, meters, batteries, and trackers.
- [SunSpec Information Model Reference](https://sunspec.org/sunspec-information-model-reference-sunspec-alliance/) - SunSpec describes Modbus data points and information models for DER devices including inverters and meters.

## Hard Boundaries

- This adapter does not certify the physical meter or inverter by itself.
- Sample mode proves the integration path only; it is not a real operator source.
- Fronius PowerFlow mode uses local inverter API data but still needs operator custody and sign-convention validation before production minting.
- Production SPK minting should prefer cumulative meter/inverter counters over instantaneous power estimates.
- No private key is written to repo outputs.

## Real Inverter Command

For a Fronius inverter on the same LAN:

```bash
METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
  --provider=fronius-powerflow \
  --host=192.168.1.50 \
  --sample-seconds=300 \
  --meter-id=TW-TY-0001 \
  --site-id=taoyuan-rooftop-a \
  --real-operator-source
```

For cumulative counter exports from another inverter, gateway, or revenue meter:

```bash
METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
  --provider=cumulative-json \
  --start=data/inverter/operator_start.json \
  --end=data/inverter/operator_end.json \
  --meter-id=OPERATOR-METER-001 \
  --site-id=operator-site-a \
  --real-operator-source
```

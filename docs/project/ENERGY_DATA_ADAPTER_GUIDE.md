# Energy Data Adapter Guide

How to connect **meter or inverter export data** to the SolarPunk Public Lab attestation and mint pipeline.

This is a **research adapter guide**, not a production certification standard.

---

## Pipeline overview

```
Meter/inverter export
  → normalize interval (generation, load, export, curtailment)
  → sign readings (device key)
  → attestation bundle (accepted / rejected rows)
  → source hash (replay-safe)
  → bounded SPK mint preview or Sepolia mint
  → network payment / settlement metrics
```

Public Lab today uses **L0 fixture/sample** data for the open demo. The **next external gate** is one real operator export (L2+ provenance) — see [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md).

---

## Supported entry points

| Command | Use case |
|---------|----------|
| `npm run attestations:fixture` | Build signed fixture bundle from repo sample |
| `npm run attestations:import-csv` | CSV with interval counters |
| `npm run meter:onboard` | Register meter metadata (site, capacity, device address) |
| `npm run meter:inverter-adapter` | Cumulative snapshot pair → signed readings |
| `CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia` | End-to-end testnet cycle from bundle |

Detailed inverter sample: [`INVERTER_METER_ADAPTER.md`](../product/INVERTER_METER_ADAPTER.md)

---

## Minimum interval fields

| Field | Description |
|-------|-------------|
| Window start / end | ISO-8601 UTC |
| Generation kWh | Interval or cumulative delta |
| Site load kWh | If available |
| Export kWh | Surplus to grid |
| Curtailment | Or zero |
| `meter_id` / `site_id` | Stable identifiers |
| Device signing key | **Off-repo** — never commit |

---

## Sample workflow (fixture)

```bash
npm run attestations:fixture
npm run attestations:build
node scripts/derive_meter_attestations.js --help
```

Inspect outputs under `data/` and `state/product/` (paths vary by script; see script `--help`).

---

## Real operator workflow (closed pilot)

1. Read [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md) and [`CLOSED_PILOT_EXECUTION_PACKAGE.md`](../product/CLOSED_PILOT_EXECUTION_PACKAGE.md).
2. Open an [energy data experiment issue](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md) — **do not** paste raw customer data publicly.
3. Maintainer provides scoped intake (private channel if needed).
4. Run adapter in **real-operator** mode only after custody and sign conventions are validated.

Example flag pattern (from closed pilot docs):

```bash
npm run meter:inverter-adapter -- \
  --provider=cumulative-json \
  --start=path/to/start.json \
  --end=path/to/end.json \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id \
  --real-operator-source
```

---

## Hardware / API anchors

Common integration references (not endorsements):

- Fronius Solar API (local REST JSON)
- SunSpec Modbus / information models for inverters and meters

See links in [`INVERTER_METER_ADAPTER.md`](../product/INVERTER_METER_ADAPTER.md).

---

## Hard boundaries

- Adapter output **does not** certify physical metering accuracy.
- Sample mode proves **integration path only**.
- Public repo must not contain production private keys or identifiable customer exports.
- Minting on Sepolia is **bounded testnet issuance**, not legal money or delivered energy.
- Closed pilot may require separate data-use terms.

---

## Extension

To add a new provider (e.g. Modbus poll, vendor API):

1. Add normalizer under `scripts/` (follow `inverter_meter_adapter.js` patterns).
2. Add fixture test in `test-node/`.
3. Document CLI flags here and in `OPEN_LAB_WORKFLOWS.md`.
4. Do not change mainnet or peg policy in the same PR without explicit governance review.

See [`EXTENSION_POINTS.md`](./EXTENSION_POINTS.md).

# Meter Evidence — Tier C P1

**Purpose:** Document when meter-based minting counts as **production-side stitch evidence** (off-thesis).

---

## Pass criteria (exploration)

| Gate | Requirement | Current anchor |
|------|-------------|----------------|
| **Bundle** | `state/attestations/latest_attestation_bundle.json` with ≥1 accepted attestation | Taoyuan fixtures, 2606.7 kWh total, schema **V2** |
| **Regime tags** | `location_country`, `grid_zone`, `energy_vintage` on accepted rows | TW / TW-TPC-NORTH / 2026-02 |
| **Quality filter** | ≥1 rejected row (duplicate nonce / low quality) | 2 rejected in bundle |
| **On-chain meter mint** | Sepolia cycle with `mint_mode: meter` | Cycle `2026-06-07T16-25-38-349Z` |
| **Public tx** | Attested mint from scaled meter bundle | `0x3527585fd110ae3e135e76b870232d1b30411d76953c15c94a237743a0d1754d` |

**Not required for P1 pass (yet):** hardware certification, legal operator liability, production gateway SLA.

---

## Canonical meter mint (Sepolia)

| Field | Value |
|-------|-------|
| Network | Sepolia |
| `mint_mode` | `meter` |
| Source bundle | `state/attestations/latest_attestation_bundle.json` |
| Scale | `0.02` (replay-safe cycle uniquification) |
| Surplus minted | 52 kWh → ~51.948 SPK |
| `batch_id` | `batch_2026_02_12_a:cycle:2026-06-07T16-25-38-349Z` |
| Tx | [`0x352758…`](https://sepolia.etherscan.io/tx/0x3527585fd110ae3e135e76b870232d1b30411d76953c15c94a237743a0d1754d) |

Full ops log: `state/runtime/spk_v1.json` → search `"mint_mode": "meter"`.

---

## Data path (production side)

```text
meter / inverter export
    → signed readings (raw_meter_readings.json)
    → registry + quality filter
    → latest_attestation_bundle.json
    → uniquifyMeterBundle(cycleId, scale)
    → mintFromSurplusAttestation on SolarPunkCoin
```

Scripts: `import_meter_csv.js`, `inverter_meter_adapter.js`, `derive_meter_attestations.js`, `lib/spk_v1_meter_bundle.js`.

---

## Reproduce

```bash
# Refresh exploration status (includes P1 gates)
npm run exploration:tier-c

# New meter cycle (Sepolia — needs .env)
CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia
npm run spk:v1:sync
npm run exploration:tier-c
```

After each new meter mint, update the **Canonical meter mint** table above if tx hash changes.

---

## Contrast with CEIR data path

| | CEIR (Ch 3) | Meter mint (P1) |
|---|-------------|-----------------|
| Energy | Mining **consumption** | Export **surplus** |
| Data | Cambridge CBECI | Signed meter attestations |
| Use | Explanatory regression | Issuance gate |

See [`PRODUCTION_VS_CONSUMPTION.md`](./PRODUCTION_VS_CONSUMPTION.md).

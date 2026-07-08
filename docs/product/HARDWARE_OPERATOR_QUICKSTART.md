# Hardware Operator Quickstart

**Goal:** Anyone with a meter or inverter can test whether their energy export data passes the same attestation pipeline used by SPK v1 — without asking the maintainer first.

This is **Public Lab validation**, not a token sale or mainnet launch.

---

## Three paths (pick one)

| Path | Who | What you prove | Sepolia mint on canonical contracts? |
|------|-----|----------------|--------------------------------------|
| **A. Sample (no hardware)** | Developer / student | Pipeline works end-to-end | No — local Hardhat only |
| **B. Your hardware → validate** | Site owner / integrator | Your counters sign and verify | **Your deploy** only (see below) |
| **C. Closed pilot** | Partner with data terms | L2+ provenance for lab report | Maintainer-governed (by invitation) |

**Important:** Canonical Sepolia SPK (`0x8e189…`) minting is **operator-gated** (minter role). External hardware operators should **deploy their own Sepolia stack** or run **local Hardhat** — not expect permissionless mint on the public reference deployment.

---

## Path A — Sample validation (5 minutes)

No hardware. Confirms your clone runs the verifier.

```bash
git clone https://github.com/Spectating101/solarpunk-coin.git
cd solarpunk-coin
npm install
npx hardhat compile
npm run hardware:validate
```

**Pass:** `accepted_records: 1`, `can_mint_from_adapter: true`, hardware level **L0** (fixture).

**Local mint test:**

```bash
npm run spk:v1:launch
CYCLE_MINT_MODE=meter npm run spk:v1:cycle
```

---

## Path B — Real hardware (self-service)

### 1. Prepare cumulative counter snapshots

Export **two snapshots** of cumulative kWh counters (start and end of a closed window). See template:

- [`data/inverter/operator_snapshot_template.json`](../../data/inverter/operator_snapshot_template.json)
- [`data/inverter/README.md`](../../data/inverter/README.md)

Required counters per snapshot:

- `generation_kwh_total`
- `site_load_kwh_total`
- `export_kwh_total`
- `curtailed_kwh_total` (or `0`)

Save as (gitignored paths recommended):

```
data/inverter/my_site_start.json
data/inverter/my_site_end.json
```

**Do not commit** real operator files or private keys to the public repo.

### 2. Generate a device signing key

The registered `device_address` must match the key that signs readings.

```bash
# Example: create a throwaway key for pilot testing
node -e "const {Wallet}=require('ethers'); const w=Wallet.createRandom(); console.log('address',w.address); console.log('METER_PRIVATE_KEY='+w.privateKey)"
```

Keep the private key **off-repo** (env var only).

### 3. Onboard your meter

```bash
npm run meter:onboard -- \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id \
  --device-address=0xYourSignerAddress \
  --capacity-kw=10 \
  --replace
```

### 4. Validate through the adapter

**Cumulative JSON export:**

```bash
METER_PRIVATE_KEY=0x... npm run hardware:validate -- \
  --operator \
  --provider=cumulative-json \
  --start=data/inverter/my_site_start.json \
  --end=data/inverter/my_site_end.json \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id
```

**Fronius on your LAN** (live REST poll):

```bash
METER_PRIVATE_KEY=0x... npm run hardware:validate -- \
  --operator \
  --provider=fronius-powerflow \
  --host=192.168.1.50 \
  --sample-seconds=300 \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id
```

**Pass:** `accepted_records >= 1`, surplus kWh > 0, hardware level **L1–L2** when `--operator` / `--real-operator-source` is set.

Outputs:

| File | Purpose |
|------|---------|
| `state/attestations/latest_attestation_bundle.json` | Verifier output (mint input) |
| `state/product/hardware_validate_receipt.json` | Summary for issues / reports |
| `docs/product/HARDWARE_PROVENANCE_MODEL.md` | Tier, haircut, caps |

### 4. CSV or Green Button export

```bash
# Green Button / utility interval CSV → SPK daily windows
npm run meter:green-button -- --in=data/meter/your_green_button.csv --out=data/meter/normalized.csv

METER_PRIVATE_KEY=0x... npm run hardware:validate -- \
  --operator \
  --csv=data/meter/normalized.csv \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id
```

Templates: [`data/meter/README.md`](../../data/meter/README.md)

### 5. Mint on **your** stack (not canonical Sepolia)

```bash
# .env: SEPOLIA_RPC + PRIVATE_KEY (your deployer)
npm run spk:v1:deploy:sepolia:lean
npm run spk:v1:launch:sepolia:lean
CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia
npm run spk:v1:sync
```

Your deployer wallet holds **minter** on your contracts. Canonical `0x8e189…` remains the **public reference** only.

### 6. Optional — CSV instead of JSON

```bash
npm run attestations:import-csv -- --help
npm run attestations:build
npm run product:hardware-provenance
```

---

## Path C — Closed pilot (canonical lab upgrade)

If you want your data tied to the **public reference** deployment and a short pilot report:

1. Read [`PILOT_DATA_ASK.md`](./PILOT_DATA_ASK.md)
2. Open an [energy data experiment issue](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md) — **no secrets in the issue**
3. Share exports through a private channel if needed

This upgrades hardware provenance from **L0 → L2+** on the lab record; it does **not** open mainnet or token-sale gates.

---

## Hardware provenance tiers (short)

| Level | Meaning | Public lab | Closed pilot |
|-------|---------|------------|--------------|
| L0 | Fixture / sample | ✓ | ✗ |
| L1 | Operator-signed export | shadow | ✗ |
| L2 | Live gateway / inverter counters | shadow | ✓ candidate |
| L3+ | Revenue-grade / utility corroboration | — | toward paid path |

Full model: [`HARDWARE_PROVENANCE_MODEL.md`](./HARDWARE_PROVENANCE_MODEL.md)

---

## Common failures

| Symptom | Fix |
|---------|-----|
| `invalid meter signature` | `device_address` in registry ≠ `METER_PRIVATE_KEY` signer |
| `accepted_records: 0` | Missing key (`METER_PRIVATE_KEY`) or counters moved backwards |
| `meter not registered` | Run `meter:onboard` first |
| Sepolia mint reverts on `0x8e189…` | You are not the canonical minter — deploy your own stack |
| Quality rejected | Lower `--min-quality` only for debugging; fix data source in production |

---

## Related docs

- [`PUBLIC_LAB_DEPLOYMENT.md`](./PUBLIC_LAB_DEPLOYMENT.md)
- [`ENERGY_DATA_ADAPTER_GUIDE.md`](../project/ENERGY_DATA_ADAPTER_GUIDE.md)
- [`OPEN_LAB_WORKFLOWS.md`](../project/OPEN_LAB_WORKFLOWS.md)
- [`EXTENSION_POINTS.md`](../project/EXTENSION_POINTS.md)
- [`INVERTER_METER_ADAPTER.md`](./INVERTER_METER_ADAPTER.md) (generated receipt)

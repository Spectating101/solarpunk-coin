# Extension Points

Where to modify SolarPunk Public Lab **safely** when forking or contributing.

**Rule:** extend the lab apparatus; do not silently remove launch gates or non-claims.

---

## Layer map

| Layer | Path | Safe extensions |
|-------|------|-----------------|
| **Evidence intake** | `scripts/onboard_meter.js`, `scripts/import_meter_csv.js`, `scripts/inverter_meter_adapter.js`, `scripts/derive_meter_attestations.js` | New CSV schemas, inverter APIs, validation rules |
| **Attestation** | `data/`, `state/product/*attestation*` | Fixture bundles, rejection rules, provenance tiers |
| **Issuance** | `contracts/SolarPunkCoin.sol`, `scripts/mint_spk_v1_attested.js`, `scripts/run_spk_v1_operator_cycle.js` | Mint caps, surplus formula (with tests), cycle modes |
| **Settlement** | `contracts/SolarPunkCurrencySystem.sol`, `frontend/src/lib/pay.js` | Payment types, payee registry in runtime JSON |
| **Runtime / sync** | `spk_v1/`, `scripts/sync_spk_v1_runtime.js`, `state/runtime/spk_v1.json` | Indexers, metrics, export formats |
| **Public UI** | `frontend/src/components/PublicLabLanding.jsx`, `SpkV1Console.jsx`, `frontend/src/index.css` | Copy, layout, proof display — not wallet-first hero |
| **Launch policy** | `docs/product/PUBLIC_LAB_V1.md`, `scripts/product_launch_gate.js` | New gates, evidence checks |
| **Foundation** | `docs/foundation/`, `npm run foundation:*` | Status exports, health checks |

**Archived (do not wire to App):** `frontend/src/components/archive/`

---

## Issuance rule fork

To experiment with “how much SPK per kWh surplus”:

1. Read `monetary_policy` in `state/runtime/spk_v1.json`.
2. Change constants in `SolarPunkCoin.sol` or policy JSON **on a forked deploy** — not the canonical Sepolia addresses without governance.
3. Run `npx hardhat test` + local `npm run spk:v1:launch`.
4. Document peg remains **off** unless you explicitly scope a peg experiment per `foundation:peg-check`.

---

## Settlement rule fork

`SolarPunkCurrencySystem.sol` — typed payments (SERVICE, LABOR, GOODS, NETWORK).  
Runtime payees: `state/runtime/spk_v1.json` → `counterparties`.

Frontend send path: `frontend/src/lib/pay.js`, `SpkV1Console.jsx`.

---

## Adapter fork

Add provider under `scripts/`:

- Input: vendor export
- Output: signed reading rows matching attestation verifier expectations
- Tests: `test-node/meter_*.test.js`

Do not commit operator private keys or raw customer exports.

---

## Frontend fork

Live tabs: **Public Lab** (landing) + **SPK console** (wallet).  
`App.jsx` is the router — keep console secondary to landing for Public Lab framing.

Visual audit: `npm run demo:screenshots` → `docs/project/VISUAL_REVIEW_WORKFLOW.md`.

---

## Explicitly gated (do not merge casually)

| Change | Why gated |
|--------|-----------|
| Mainnet deploy scripts | Legal, audit, reserves |
| `peg_enabled: true` on canonical deployment | Monetary claim |
| Remove non-claims from landing | Misleading public |
| Token sale / ICO language | Regulatory |
| Publishing real operator datasets | Privacy / contract |

---

## Python / pricing track (thesis Ch.4)

Separate from SPK v1 settlement loop:

- `energy_derivatives/spk_derivatives/` — options pricing, NASA data
- `npm run exploration:*` — off-thesis experiments

Forking pricing math does not change Sepolia SPK v1 unless you explicitly bridge them.

---

## Questions

Open a [research replication](https://github.com/Spectating101/solarpunk-coin/issues/new?template=research-replication.md) or [energy data experiment](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md) issue.

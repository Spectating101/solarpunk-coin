# Open Lab Workflows

How to use SolarPunk Public Lab **without the maintainer in the loop** — for replication, teaching, and bounded experiments.

**Canonical product doc:** [`PUBLIC_LAB_V1.md`](../product/PUBLIC_LAB_V1.md)

---

## 1. Run the local lab

Reproduce contract logic and the operator loop on a local Hardhat chain.

```bash
git clone https://github.com/Spectating101/solarpunk-coin.git
cd solarpunk-coin
npm install
npx hardhat compile
npx hardhat test                    # 109 contract tests
npm run spk:v1:launch               # local deploy + genesis cycle
```

**Outputs:** local deployment artifacts under `state/`, runtime JSON pattern in `state/runtime/spk_v1.json`.

**Frontend (optional):**

```bash
cd frontend && npm install && npm run dev
```

Open Public Lab landing + SPK console at `http://localhost:3000`.

---

## 2. Run the Sepolia lab

Inspect or extend the **public reference deployment** (requires your own Sepolia ETH and RPC).

**Prerequisites (`.env` at repo root):**

```bash
SEPOLIA_RPC=https://...          # Alchemy/Infura recommended; public RPCs often 403
PRIVATE_KEY=0x...                # operator wallet — never commit
```

**Read live state (no keys needed):**

```bash
npm run spk:v1:sync
cat state/runtime/spk_v1.json
npm run foundation:health
```

**Operator cycle (mints + payments on testnet):**

```bash
npm run spk:v1:cycle:sepolia
npm run foundation:sync
npm run spk:v1:evidence:export
```

**Canonical Sepolia addresses** (see `state/runtime/spk_v1.json`):

| Contract | Address |
|----------|---------|
| SPK (lab unit) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Currency / payments | `0x520162252F9B94824417678525FFd69145014970` |

**Public demo:** https://spectating101.github.io/solarpunk-coin/demo/

---

## 3. Export evidence

Regenerate the evidence pack for papers, issues, or advisor review.

```bash
npm run spk:v1:sync
npm run spk:v1:evidence:export
# or Python path:
npm run spk:v1:evidence:py
```

**Primary artifacts:**

| File | Purpose |
|------|---------|
| `thesis_package/SPK_V1_EVIDENCE.md` | Human-readable tx tables |
| `state/runtime/spk_v1.json` | Machine-readable state |
| `docs/foundation/FOUNDATION_STATUS.md` | Generated metrics |

**Screenshots (visual audit):**

```bash
npx playwright install chromium
npm run demo:screenshots
# → screenshots/chatgpt-visual-audit-live.zip
```

---

## 4. Adapt a meter/inverter dataset

Test the **energy evidence → attestation** path with sample or your own data.

**Sample / fixture path (no real operator):**

```bash
npm run attestations:fixture
npm run meter:onboard -- --help
npm run meter:inverter-adapter -- --help
```

**Import CSV:**

```bash
npm run attestations:import-csv -- --help
```

**Meter-mode Sepolia cycle (scaled, replay-safe):**

```bash
CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia
```

Full adapter spec: [`ENERGY_DATA_ADAPTER_GUIDE.md`](./ENERGY_DATA_ADAPTER_GUIDE.md)  
Closed pilot intake: [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md)

**Do not** commit real operator exports, private keys, or customer-identifying fields to the public repo.

---

## 5. Fork issuance / settlement rules

Safe extension surfaces (see [`EXTENSION_POINTS.md`](./EXTENSION_POINTS.md)):

| Layer | Where |
|-------|--------|
| Attestation / meter schema | `scripts/derive_meter_attestations.js`, `data/` fixtures |
| Mint bounds | `contracts/SolarPunkCoin.sol`, operator cycle scripts |
| Payment types | `contracts/SolarPunkCurrencySystem.sol` |
| Launch gates / policy | `docs/product/`, `scripts/product_launch_gate.js` |
| Public UI | `frontend/src/components/PublicLabLanding.jsx`, `SpkV1Console.jsx` |

**Blocked without explicit governance work:** mainnet, peg-on production, token sale, legal-tender claims.

---

## Governance boundaries (read this)

| Open | Gated |
|------|--------|
| Clone, test, fork MIT code | Mainnet deployment |
| Sepolia experiments with your own ETH | Real-money settlement claims |
| Sample/fixture meter data in repo | Publishing real operator exports |
| Evidence export & replication | Audit / legal / production governance |
| Issues & PRs on docs/tests | Removing non-claims or launch gates from product docs |

---

## Get help

- **Replication stuck?** [Research replication issue](https://github.com/Spectating101/solarpunk-coin/issues/new?template=research-replication.md)
- **Have energy data?** [Energy data experiment issue](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md)
- **Bug?** [Bug report](https://github.com/Spectating101/solarpunk-coin/issues/new?template=bug_report.md)

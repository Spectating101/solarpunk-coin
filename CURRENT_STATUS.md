# Current status

**Updated:** 2026-06-08  
**Entry point:** [`docs/foundation/README.md`](./docs/foundation/README.md) · [`DOCS.md`](./DOCS.md)

---

## What this is

**Product:** Energy-anchored testnet money on Sepolia — mint from surplus kWh, circulate via on-chain payments, USD reference for expression (peg **off**).

**Horizon:** Operating laboratory (structure), not stablecoin war (scale).

---

## Live now

| | |
|---|---|
| Demo | https://spectating101.github.io/solarpunk-coin/demo/ |
| SPK | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Payments contract | `0x520162252F9B94824417678525FFd69145014970` |
| Foundation status | [`docs/foundation/FOUNDATION_STATUS.md`](./docs/foundation/FOUNDATION_STATUS.md) |
| Runtime | `state/runtime/spk_v1.json` |

**On-chain (last sync):** ~5,454 SPK supply · 404 SPK settled · **17** network payments · ~97.6% circulation · peg off · $0.05/kWh reference.

---

## Operator (you)

| Check | Command |
|-------|---------|
| Gas + sync health | `npm run foundation:health` |
| Sync ledger | `npm run foundation:sync` |
| Full cycle | `npm run foundation:cycle` *(needs ≥0.01 Sepolia ETH on deployer)* |
| Refresh public demo | `npm run foundation:refresh` |
| Fund demo wallet | `RECIPIENT=0x… AMOUNT=50 npm run spk:v1:fund` |

**Deployer:** `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` — **low ETH blocks cycles** until faucet top-up.

---

## Tests

| Command | What |
|---------|------|
| `npx hardhat test` | 109 contract tests |
| `npm run spk:v1:backend:check` | Python sync + API |
| `npm run foundation:health` | Operator readiness |

---

## Next foundation builds

1. Top up operator Sepolia ETH → resume weekly `foundation:cycle`  
2. Multisig handoff when ops are boring (`docs/foundation/GOVERNANCE.md`)  
3. Meter mint cycle (`npm run foundation:cycle:meter`)  
4. Peg-on experiment (after simulation discipline)

Thesis track: **paused** — product foundation only.

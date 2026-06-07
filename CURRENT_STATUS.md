# Current status

**Updated:** 2026-06-07  
**Doc entry point:** [`DOCS.md`](./DOCS.md) — read that first if you're catching up.

---

## What this is

**Product:** SPK v1 testnet money on Sepolia — mint from energy surplus, pay people on-chain, optional burn-for-energy-credit.

**Also:** Finance Master's thesis (Yuan Ze) — Bitcoin energy-cost empirics, options pricing, five-constraint framework.

Not mainnet. Not audited for production. Deployer key runs testnet demos.

---

## SPK v1 on Sepolia (canonical)

| | |
|---|---|
| SPK token | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` [verified](https://sepolia.etherscan.io/address/0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128#code) |
| Payment contract | `0x520162252F9B94824417678525FFd69145014970` [verified](https://sepolia.etherscan.io/address/0x520162252F9B94824417678525FFd69145014970#code) |
| Runtime JSON | `state/runtime/spk_v1.json` |
| Demo UI | https://spectating101.github.io/solarpunk-coin/ (SPK v1 tab) |

**On-chain (last sync):** ~5,400+ SPK supply · 383 SPK settled · 14 network payments · 97.5% circulation share · 4 counterparties holding SPK.

```bash
npm run spk:v1:cycle:sepolia   # weekly: mint + pay + log
npm run spk:v1:sync            # pull chain state into JSON
```

---

## Tests

| Command | What |
|---------|------|
| `npx hardhat test` | **109** contract tests |
| `npm run spk:v1:test` | Runtime smoke |
| `npm run attestations:test` | Meter signature pipeline |
| `pytest energy_derivatives/tests/` | Options pricing math |

Pass counts are not product readiness. See [`docs/project/TEST_ANALYSIS.md`](./docs/project/TEST_ANALYSIS.md).

---

## Archive deployments (do not confuse with SPK v1)

| Stack | When | Purpose now |
|-------|------|-------------|
| `0x1D55…` + Safe + options | Apr 2026 | UI archive / keeper demo |
| `0x8ceDa…` attested mint | May 2026 | Thesis historical proof |

Full list: [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md)

---

## What works locally (no Sepolia needed)

```bash
npx hardhat test
npm run spk:v1:launch              # full local loop
npm run proof:spk-attested-mint    # meter → mint proof
```

---

## Honest gaps

| Gap | Detail |
|-----|--------|
| Real hardware | Mint proofs use fixtures / sample CSV, not live site meters |
| Governance | SPK v1 uses deployer EOA, not Safe multisig |
| Keeper | NASA→Sepolia automation stale since May 2026 |
| Doc drift | Old files may cite wrong test counts — trust `DOCS.md` + this file |
| Production | No audit, no mainnet, no legal classification |

---

## One line

Live testnet cryptocurrency prototype with thesis documentation — compound circulation on SPK v1, don't redeploy unless bytecode changes.

**Read next:** [`DOCS.md`](./DOCS.md) · [`README.md`](./README.md) · [`thesis_package/SPK_V1_EVIDENCE.md`](./thesis_package/SPK_V1_EVIDENCE.md)

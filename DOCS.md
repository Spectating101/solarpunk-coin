# Documentation map

**If you're human or an AI catching up: read this file first.**  
Then `CURRENT_STATUS.md`, then everything else.

---

## What this project is (plain)

SolarPunk **SPK v1** is testnet money on Ethereum Sepolia:

1. Extra electricity (kWh) → mint SPK  
2. SPK pays for services, labor, goods (on-chain)  
3. Burning SPK for energy credit is optional, not the main path  

A Finance Master's thesis documents the research. The **product** is the live testnet loop.

**Not claimed:** mainnet, real dollars, production audit, legal tender.

---

## Canonical files (trust these)

| File | Use |
|------|-----|
| [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) | Live snapshot: addresses, metrics, gaps |
| [`state/runtime/spk_v1.json`](./state/runtime/spk_v1.json) | Machine-readable testnet state |
| [`README.md`](./README.md) | Quick start commands |
| [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) | All Sepolia addresses |
| [`docs/product/SPK_V1.md`](./docs/product/SPK_V1.md) | Product constitution |
| [`docs/product/SPK_V1_OPERATOR.md`](./docs/product/SPK_V1_OPERATOR.md) | How to run weekly cycles |
| [`thesis_package/THESIS_SOURCE_OF_TRUTH.md`](./thesis_package/THESIS_SOURCE_OF_TRUTH.md) | Thesis numbers and framing |
| [`thesis_package/SPK_V1_EVIDENCE.md`](./thesis_package/SPK_V1_EVIDENCE.md) | Etherscan tx tables for Ch 5 |
| [`EVIDENCE.md`](./EVIDENCE.md) | Full proof register (empirics + testnet) |

**When docs disagree:** `CURRENT_STATUS.md` + `spk_v1.json` win.

---

## Commands that matter

```bash
npm run spk:v1:cycle:sepolia    # mint + pay + log (weekly)
npm run spk:v1:sync             # refresh state from chain
npm run spk:v1:evidence:export  # regenerate thesis tx tables
npx hardhat test                # 109 contract tests
```

Credentials: `.env` with `PRIVATE_KEY` and `SEPOLIA_RPC`.

---

## Sepolia addresses (SPK v1 — canonical)

| | Address |
|---|---------|
| SPK token | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Payment contract | `0x520162252F9B94824417678525FFd69145014970` |

Both verified on Etherscan. Demo UI: https://spectating101.github.io/solarpunk-coin/

---

## Folder guide

| Path | What |
|------|------|
| `contracts/` | Solidity source |
| `scripts/` | Deploy, mint, operator cycle |
| `frontend/` | Web UI (SPK v1 tab is primary) |
| `thesis_package/` | Thesis chapters and empirics |
| `energy_derivatives/` | Options pricing Python SDK |
| `state/runtime/` | Live testnet JSON |
| `state/product/` | Local lab script outputs (not live chain) |
| `docs/product/` | Product docs; **see archive list below** |
| `docs/grants/` | **Archived** — grant phase ended |
| `docs/archive/` | Old snapshots |

---

## Stale — do not use as current truth

These exist for history. They will mislead LLMs:

| File / area | Why stale |
|-------------|-----------|
| `docs/product/SOLARPUNK_FULL_CONTEXT_FOR_CLAUDE.md` | Replaced by this file |
| `docs/product/PUBLIC_LAB.md`, `PRODUCT_LAUNCH_GATE.md` | Launch-outreach phase |
| `docs/grants/*` | Grant submission phase |
| `PRODUCT_LAUNCH_READINESS.md` | Launch readiness theater |
| `MASTER_HANDOFF.md` | Long narrative; verify numbers via CURRENT_STATUS |
| `docs/product/CURRENCY_FRAMEWORK_READINESS.md` | Local lab scores, not product status |
| `docs/product/ECONOMIC_LAUNCH_READINESS.md` | Same |
| Any doc citing **79/102 tests**, **Polygon Amoy**, or **"launchable now"** | Out of date |

Legacy Sepolia stacks (`0x1D55…` options demo, `0x8ceDa…` May 2026 proof) are **archive**, not the product.

---

## Thesis vs product

| | Product | Thesis |
|---|---------|--------|
| Goal | Working testnet money loop | Bounded academic claims |
| Evidence | Sepolia txs, `spk_v1.json` | Ch 3–5 + `SPK_V1_EVIDENCE.md` |
| Tone | Ship and compound | "Proof of concept, not production" |

---

## Maintenance

See [`docs/project/DOC_MAINTENANCE.md`](./docs/project/DOC_MAINTENANCE.md).  
After operator cycles: `spk:v1:sync` then `spk:v1:evidence:export`.

# SolarPunk — SPK v1 Network Money

**Energy-attested issuance. Circulation-first settlement. Optional energy exit.**

SPK v1 is a live testnet cryptocurrency system on Ethereum Sepolia: verified surplus kWh mints SPK, participants settle network payments on-chain, redemption is secondary.

> **Documentation:** [`DOCS.md`](./DOCS.md) is the map — especially for AI assistants catching up.  
> **Live snapshot:** [`CURRENT_STATUS.md`](./CURRENT_STATUS.md)

**Demo UI:** https://spectating101.github.io/solarpunk-coin/ (SPK v1 tab)  
**Operator guide:** [`docs/product/SPK_V1_OPERATOR.md`](./docs/product/SPK_V1_OPERATOR.md)

---

## Quick start

```bash
npm install && npx hardhat compile

# Local full loop
npm run spk:v1:launch

# Sepolia — compound circulation (requires .env PRIVATE_KEY + SEPOLIA_RPC)
npm run spk:v1:cycle:sepolia
npm run spk:v1:sync
npm run spk:v1:evidence:export
```

**Canonical runtime:** `state/runtime/spk_v1.json` → `frontend/public/spk_v1.json`

| Contract | Sepolia address |
|----------|-----------------|
| SolarPunkCoin | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SolarPunkCurrencySystem | `0x520162252F9B94824417678525FFd69145014970` |

---

## What SPK v1 proves

1. **Issuance** — oracle-signed attestation or surplus mint → energy-native SPK (peg off)
2. **Circulation** — typed network payments (SERVICE, LABOR, GOODS, NETWORK) with invoice replay protection
3. **Metrics** — `networkMetrics()` circulation vs redemption share on-chain
4. **Operation** — repeatable operator cycles + indexed payment ledger

Not claimed: mainnet readiness, legal tender, revenue-grade meter finality, production governance.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run spk:v1:cycle:sepolia` | Attested mint + 4-party payments + optional redeem |
| `CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia` | Mint from real meter bundle (scaled, replay-safe) |
| `npm run spk:v1:sync` | Index chain events → runtime JSON |
| `npm run spk:v1:evidence:export` | Regenerate thesis evidence pack |
| `npx hardhat test` | 109 on-chain rule tests |

---

## Repo map

| Track | Location |
|-------|----------|
| Product / testnet | `docs/product/SPK_V1.md`, `state/runtime/` |
| Thesis (bounded) | `thesis_package/`, `thesis_package/SPK_V1_EVIDENCE.md` |
| Archive demos | Legacy Safe stack, May 2026 attested proof — see `CONTRACT_ADDRESSES.md` |
| Bitcoin CEIR empirics | `thesis_package/empirical_results/` |
| Options pricing | `energy_derivatives/spk_derivatives/` |

---

## Thesis

Finance Master's thesis (Yuan Ze University) runs **alongside** the build. Chapter 5 uses SPK v1 Sepolia evidence as implementation proof for the five-constraint framework. Canonical framing: [`thesis_package/THESIS_SOURCE_OF_TRUTH.md`](./thesis_package/THESIS_SOURCE_OF_TRUTH.md).

---

## Development

```bash
cd frontend && npm install && npm run dev   # local UI
npx hardhat test                            # contracts
npm run spk:v1:test                         # runtime smoke
```

Push to `main` deploys the frontend to GitHub Pages via `.github/workflows/deploy.yml`.

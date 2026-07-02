# SolarPunk Public Lab v1.0

**A renewable-energy issuance standard for programmable settlement.**

SolarPunk Public Lab is a public Sepolia testnet laboratory for an energy-standard settlement architecture: verified renewable-surplus evidence can produce bounded SPK issuance, circulate through network payments, and remain constrained by explicit settlement and governance gates.

It is **not** a monetary product, token sale, stablecoin, legal tender, mainnet launch, or legal claim on delivered energy.

> **Start here:** [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md)  
> **Current state:** [`CURRENT_STATUS.md`](./CURRENT_STATUS.md)  
> **Documentation map:** [`DOCS.md`](./DOCS.md)

**Demo:** https://spectating101.github.io/solarpunk-coin/demo/  
**Closed pilot data ask:** [`docs/product/PILOT_DATA_ASK.md`](./docs/product/PILOT_DATA_ASK.md)

---

## Quick start

```bash
npm install && npx hardhat compile

# Local full loop
npm run spk:v1:launch

# Sepolia — operator cycle (requires .env PRIVATE_KEY + SEPOLIA_RPC)
npm run spk:v1:cycle:sepolia
npm run spk:v1:sync
npm run spk:v1:evidence:export
```

**Canonical runtime:** `state/runtime/spk_v1.json` → `frontend/public/spk_v1.json`

| Contract | Sepolia address |
|----------|-----------------|
| SolarPunkCoin (lab unit SPK) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SolarPunkCurrencySystem | `0x520162252F9B94824417678525FFd69145014970` |

---

## What Public Lab v1.0 proves

1. **Energy evidence → issuance** — signed surplus attestation or meter bundle → bounded SPK mint (peg off)
2. **Circulation** — typed network payments (SERVICE, LABOR, GOODS, NETWORK) with invoice replay protection
3. **Settlement metrics** — on-chain circulation vs redemption share
4. **Reproducibility** — operator cycles, sync, evidence export, 109 contract tests

**SPK** is the **lab unit** inside this architecture (~1 kWh surplus per SPK on testnet), not a claim of legal money.

Not claimed: mainnet, token sale, legal tender, revenue-grade meter finality, production governance, live dollar peg.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run spk:v1:cycle:sepolia` | Attested mint + network payments + optional redeem |
| `CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia` | Mint from meter bundle (scaled, replay-safe) |
| `npm run spk:v1:sync` | Index chain events → runtime JSON |
| `npm run spk:v1:evidence:export` | Regenerate evidence pack |
| `npm run foundation:health` | Operator + sync readiness |
| `npx hardhat test` | 109 on-chain rule tests |

---

## Repo map

| Track | Location |
|-------|----------|
| **Public Lab v1.0** | `docs/product/PUBLIC_LAB_V1.md` |
| SPK v1 technical spec | `docs/product/SPK_V1.md`, `state/runtime/` |
| Thesis (bounded) | `thesis_package/`, `thesis_package/SPK_V1_EVIDENCE.md` |
| Institutional path (post-thesis) | `docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md` |
| Bitcoin CEIR empirics | `thesis_package/empirical_results/` |
| CEIR → SPK exploration (off-thesis) | `docs/exploration/`, `npm run exploration:tier-c` |
| Options pricing | `energy_derivatives/spk_derivatives/` |

---

## Foundation layer

Energy-standard settlement with **USD reference for expression** (peg **off** on chain) — research laboratory, not L1 competition.

- [`docs/foundation/MONETARY_FOUNDATION.md`](./docs/foundation/MONETARY_FOUNDATION.md) — architecture north star
- [`docs/foundation/FOUNDATION_STATUS.md`](./docs/foundation/FOUNDATION_STATUS.md) — generated metrics

```bash
npm run foundation:build   # export foundation status from runtime
npm run foundation:sync    # Sepolia sync + foundation export
npm run foundation:cycle   # operator cycle + sync + foundation
```

---

## Development

```bash
cd frontend && npm install && npm run dev   # Public Lab landing + SPK console
npx hardhat test                            # contracts
npm run spk:v1:test                         # runtime smoke
```

Push to `main` deploys the frontend to GitHub Pages via `.github/workflows/deploy.yml`.

**Release:** tag `public-lab-v1.0` — see [`docs/product/PUBLIC_LAB_V1_RELEASE_NOTE.md`](./docs/product/PUBLIC_LAB_V1_RELEASE_NOTE.md).

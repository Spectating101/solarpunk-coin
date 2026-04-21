# SolarPunk Protocol

SolarPunk is **renewable-energy financial infrastructure** that turns verified energy value into programmable settlement, hedging, and treasury flows.

## What it is

A niche protocol for renewable-energy finance — comparable in scope to Centrifuge or Voltz, purpose-built for energy markets. Three contracts work together:

- **`SolarPunkCoin`** — energy-backed stablecoin with PI controller for peg stability, oracle-gated minting, reserve ratio checks, bond-gated operators
- **`SolarPunkOption`** — margin-based clearinghouse for European energy index options (cash-settled, mark-to-market, liquidation)
- **`ProtocolTreasury`** — fee vault with 4-bucket budget split (reserve / insurance / ops / audit), keeper bond escrow with cooldown and slash

This is a **serious prototype** with a live testnet deployment — not a production network.

## Live deployment (Sepolia testnet — 2026-04-20)

| Contract | Address | Explorer |
|---|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Etherscan ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Etherscan ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Etherscan ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

All three contracts source-verified on Etherscan. See [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) for full details.

## What problem it solves

Renewable projects face volatile prices and weak hedging access. SolarPunk makes these flows inspectable and programmable:

- represent energy value in a financial layer (SPK backed by verified kWh surplus)
- hedge price risk with margin-aware options contracts
- route protocol revenue into reserve, insurance, ops, and audit budgets automatically

## What already works

- **77/77 smart contract tests passing** (`npx hardhat test --no-compile`)
- **Live Sepolia deployment** — 4 contracts deployed, source-verified, publicly readable
- **7-transaction interaction proof** on Sepolia — mint, redeem, oracle update, option open, mark-to-market ([proof artifact](./state/proofs/sepolia_interaction_proof.json))
- local treasury demo (`npm run demo:treasury`)
- local break-even model (`npm run model:treasury`)

## What does not yet work / not yet done

- no external security audit yet
- no confirmed pilot counterparties yet
- mainnet gated until audit completes

## How to inspect it quickly

```bash
# contracts and integration tests
npx hardhat test --no-compile

# protocol flow demonstration (fees, liquidation, treasury, bonds)
npm run demo:treasury

# simple monthly sustainability model
npm run model:treasury
```

## Academic foundation

The protocol is grounded in a Finance Masters thesis (Yuan Ze University) with three empirical pillars:

1. **CEIR analysis** — Amihud-Hurvich bias-corrected predictive regression, Chow test, block bootstrap (2000 reps), China mining ban natural experiment
2. **Options pricing** — Black-Scholes adapted for solar irradiance volatility (NASA data)
3. **Contract feasibility** — the smart contract layer implemented here

See `thesis-draft.md` and `thesis_package/` for the research layer.

## Next milestone

**Milestone 3: Security credibility**

- external security audit (Code4rena, Sherlock, or private firm)
- pilot counterparty engagement
- governance delay and bond requirements configured for non-zero values

See [`ROADMAP.md`](./ROADMAP.md) for the full ladder.

## Docs

- [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) — canonical stage snapshot
- [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) — deployed addresses and explorer links
- [`DEMO_WALKTHROUGH.md`](./DEMO_WALKTHROUGH.md) — testnet proof and local demo commands
- [`ARCHITECTURE_OVERVIEW.md`](./ARCHITECTURE_OVERVIEW.md) — system design
- [`ROADMAP.md`](./ROADMAP.md) — milestone plan
- [`docs/project/DAILY_EXPERIMENT_STATUS.md`](./docs/project/DAILY_EXPERIMENT_STATUS.md) — rolling Sepolia NASA oracle experiment summary
- [`AUDIT_READINESS.md`](./AUDIT_READINESS.md) — audit-facing context
- [`THREAT_MODEL.md`](./THREAT_MODEL.md) — attack surface categories
- [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md) — explicit trust boundaries
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — deploy instructions
- [`docs/grants/GRANT_PROPOSAL.md`](./docs/grants/GRANT_PROPOSAL.md)
- [`docs/grants/MILESTONES_AND_BUDGET.md`](./docs/grants/MILESTONES_AND_BUDGET.md)

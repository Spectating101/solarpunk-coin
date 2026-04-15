# SolarPunk Protocol

SolarPunk is **renewable-energy financial infrastructure** that turns verified energy value into programmable settlement, hedging, and treasury flows.

## What it is

SolarPunk is a niche protocol for renewable-energy finance. It combines:

- energy-backed settlement logic (`SolarPunkCoin`)
- options clearing and liquidation logic (`SolarPunkOption`)
- fee routing and bond-based treasury controls (`ProtocolTreasury`)

This is a **serious prototype**, not a production network.

## What problem it solves

Renewable projects face volatile prices and weak hedging access. SolarPunk is designed to make these flows inspectable and programmable:

- represent energy value in a financial layer
- hedge risk with margin-aware contracts
- route protocol revenue into reserve, insurance, ops, and audit budgets

## Current stage

See [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) for the canonical status table.

**Short status line:** Prototype complete, economics wired, public proof still pending.

## What already works

- 55/55 smart contract tests passing (`npx hardhat test --no-compile`)
- local treasury demo (`npm run demo:treasury`)
- local break-even model (`npm run model:treasury`)
- interaction-proof runner for deployed testnet stacks (`PROOF_NETWORK=amoy npm run proof:interaction`)
- proof-surface publisher for addresses/status (`PROOF_NETWORK=amoy npm run proof:publish`)
- full-stack deploy path ready for Amoy (`./scripts/deploy_amoy.sh`)

## What does not yet work / not yet done

- no published public Amoy contract addresses yet
- no completed external security audit yet
- no confirmed pilot counterparties yet
- mainnet remains gated

## How to inspect it quickly

```bash
# contracts and integration tests
npx hardhat test --no-compile

# protocol flow demonstration (fees, liquidation, treasury, bonds)
npm run demo:treasury

# simple monthly sustainability model
npm run model:treasury
```

## Next milestone

**Milestone 2: External inspectability**

- deploy full stack to Amoy
- publish addresses and explorer links
- publish walkthrough and interaction proof

See:

- [`TESTNET_DEPLOYMENT.md`](./TESTNET_DEPLOYMENT.md)
- [`DEMO_WALKTHROUGH.md`](./DEMO_WALKTHROUGH.md)
- [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md)

## Docs

- [`ARCHITECTURE_OVERVIEW.md`](./ARCHITECTURE_OVERVIEW.md)
- [`CURRENT_STATUS.md`](./CURRENT_STATUS.md)
- [`ROADMAP.md`](./ROADMAP.md)
- [`AUDIT_READINESS.md`](./AUDIT_READINESS.md)
- [`THREAT_MODEL.md`](./THREAT_MODEL.md)
- [`TRUST_ASSUMPTIONS.md`](./TRUST_ASSUMPTIONS.md)
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- [`docs/project/PROJECT_OPERATIONS.md`](./docs/project/PROJECT_OPERATIONS.md)
- [`docs/grants/GRANT_PROPOSAL.md`](./docs/grants/GRANT_PROPOSAL.md)
- [`docs/grants/MILESTONES_AND_BUDGET.md`](./docs/grants/MILESTONES_AND_BUDGET.md)

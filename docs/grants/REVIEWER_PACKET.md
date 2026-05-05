# SolarPunk Protocol — Reviewer Packet

**Last updated:** 2026-05-05  
**Purpose:** one-page orientation for grant reviewers, advisors, and ecosystem partners.

## One-line summary

SolarPunk is an open-source Ethereum testnet prototype for renewable-energy hedging: NASA POWER solar irradiance is transformed into an energy index, posted on-chain, and used by a margin-based option clearinghouse prototype.

## Current proof surface

| Proof item | Current status | Where to verify |
|---|---|---|
| Live contracts | 5 verified Sepolia contracts | [`CONTRACT_ADDRESSES.md`](../../CONTRACT_ADDRESSES.md) |
| Tests | 79/79 Hardhat tests passing | `npx hardhat test` |
| Daily real-data run | NASA POWER -> Sepolia keeper running since 2026-04-20 | [`docs/project/DAILY_EXPERIMENT_STATUS.md`](../project/DAILY_EXPERIMENT_STATUS.md) |
| Latest keeper tx | 2026-05-05 `updateIndex` tx | [`EVIDENCE.md`](../../EVIDENCE.md) |
| Frontend demo | Vite/React proof dashboard with live Sepolia reads | `cd frontend && npx -y node@20 ./node_modules/vite/bin/vite.js` |
| Security posture | Independent code review complete; formal audit not yet started | [`AUDIT_READINESS.md`](../../AUDIT_READINESS.md) |

## Four-click reviewer path

1. Open [`EVIDENCE.md`](../../EVIDENCE.md) and inspect the latest keeper transaction.
2. Open [`state/keeper_logs/summary.json`](../../state/keeper_logs/summary.json) and confirm the latest NASA-derived index.
3. Open the Sepolia `SolarPunkOption` contract and read `currentIndex`, `initialMarginBps`, and `maintenanceMarginBps`.
4. Run the frontend and check that the Proof tab matches the committed keeper summary and live RPC state.

## What is real today

- Real NASA POWER data is ingested daily and pushed to Sepolia.
- Source-verified contracts are deployed and externally inspectable.
- The repo contains on-chain transaction receipts, keeper artifacts, tests, threat model, trust assumptions, audit handoff, and grant drafts.
- The frontend demo now distinguishes proof, market state, hedge preview, and maturity/status claims.

## What is not claimed

- No mainnet deployment.
- No formal security audit.
- No production oracle finality.
- No executed counterparty pilot or solar operator LOI yet.
- No claim that the current Sepolia parameters are final production parameters.

## Important parameter note

The live Sepolia `SolarPunkOption` deployment currently reports:

- `initialMarginBps = 15000` (150%)
- `maintenanceMarginBps = 7500` (75%)

The stress memo identifies **250% initial / 125% maintenance** as the next risk-boxed pilot hardening target before larger exposure. Applications should not claim that the live deployment already enforces 250% / 125%.

## Why funding is useful

Grant funding should not be framed as generic runway. It unlocks specific missing proof surfaces:

- Formal smart contract audit and remediation.
- Chainlink Automation / Functions migration away from GitHub Actions keeper.
- Risk-boxed L2 pilot with strict open-interest caps.
- Partner-facing reporting and pilot documentation.
- Public technical report connecting thesis, testnet evidence, and production constraints.


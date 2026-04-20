# CURRENT STATUS

This file is the canonical stage snapshot for external reviewers.

## Status table

| Area | Current status |
|---|---|
| Stage | Serious prototype — publicly deployed |
| Smart contracts | 77/77 tests passing |
| Treasury loop | Implemented (mint/redeem fees, trading fees, liquidation penalties, bond slashing) |
| Bond-gated operators | Supported in options layer (configurable oracle/liquidator minimum bonds) |
| Local demo | Available (`npm run demo:treasury`) |
| Economics model | Available (`npm run model:treasury`) |
| Public testnet deployment | **Live on Sepolia** (2026-04-20) |
| Source verification | Pending (Etherscan verify not yet run) |
| Security audit | Not started |
| Pilot counterparties | Not yet secured |
| Mainnet readiness | NO_GO until audit + deployment evidence pass |

## Deployed contracts (Sepolia)

| Contract | Address |
|---|---|
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |

See [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) for full details and explorer links.

## Honest status line

Prototype complete, economics wired, **first public deployment live on Sepolia testnet.**

## What this means

SolarPunk has cleared its first external credibility milestone. Remaining gates before mainnet:

1. Source verification on Etherscan (contracts readable publicly)
2. Interaction proof — run transactions on Sepolia and publish the tx hashes
3. Security review / audit
4. Pilot counterparty confirmation

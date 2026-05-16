# SolarPunk Protocol — Reviewer Packet

**Last updated:** 2026-05-14
**Purpose:** one-page orientation for grant reviewers, advisors, and ecosystem partners.

## One-line summary

SolarPunk is an open-source Ethereum prototype for energy-minted money: accepted surplus renewable-energy kWh is converted into SPK through a signed, replay-protected oracle attestation.

## Current proof surface

| Proof item | Current status | Where to verify |
|---|---|---|
| Live contracts | 5 verified Sepolia contracts for the earlier core prototype + 3 verified contracts in the fresh attested SPK proof stack | [`CONTRACT_ADDRESSES.md`](../../CONTRACT_ADDRESSES.md) |
| SPK product proof | Signed raw meter readings -> verified bundle -> source hash -> oracle signature -> Sepolia SPK mint | [`docs/product/SPK_ATTESTED_MINT_PROOF.md`](../product/SPK_ATTESTED_MINT_PROOF.md) |
| Public proof readback | Read-only Sepolia check of tx success, consumed attestation hash, consumed source hash, and recipient balance | [`docs/product/SPK_PUBLIC_READBACK.md`](../product/SPK_PUBLIC_READBACK.md) |
| Pilot meter import | Meter onboarding + CSV import path for inverter/meter exports | [`docs/project/METER_CSV_IMPORT.md`](../project/METER_CSV_IMPORT.md) |
| Product empirics | Single-product empirical dossier tying thesis evidence to SPK | [`docs/product/SPK_PRODUCT_EMPIRICS.md`](../product/SPK_PRODUCT_EMPIRICS.md) |
| Tests | 102/102 Hardhat tests passing | `npx hardhat test` |
| Daily real-data run | NASA POWER -> Sepolia keeper running since 2026-04-20 | [`docs/project/DAILY_EXPERIMENT_STATUS.md`](../project/DAILY_EXPERIMENT_STATUS.md) |
| Latest keeper tx | 2026-05-14 `updateIndex` tx | [`EVIDENCE.md`](../../EVIDENCE.md) |
| Frontend demo | Vite/React proof dashboard with live Sepolia reads | https://spectating101.github.io/solarpunk-coin/ |
| Security posture | Independent code review complete; formal audit not yet started | [`AUDIT_READINESS.md`](../../AUDIT_READINESS.md) |

## Four-click reviewer path

1. Open [`docs/product/SPK_PRODUCT_EMPIRICS.md`](../product/SPK_PRODUCT_EMPIRICS.md) and read the product claim.
2. Open [`docs/product/SPK_ATTESTED_MINT_PROOF.md`](../product/SPK_ATTESTED_MINT_PROOF.md) and confirm the meter-to-mint receipt.
3. Open [`docs/product/SPK_PUBLIC_READBACK.md`](../product/SPK_PUBLIC_READBACK.md) and confirm the Sepolia replay guards are consumed.
4. Open [`EVIDENCE.md`](../../EVIDENCE.md) and inspect the daily keeper and Sepolia transaction trail.

## What is real today

- Real NASA POWER data is ingested daily and pushed to Sepolia.
- The latest SPK contract can mint from signed surplus-energy attestations and reject replayed, reused-source, non-oracle, expired, future-window, zero-source, or invalid-window attestations.
- The sample meter pipeline verifies 2 device signatures, rejects duplicate/low-quality readings, accepts 2,606.7 kWh, and the Sepolia proof mints 130.1697 SPK from 2,606 on-chain kWh.
- The pilot CSV bridge imports meter/inverter rows into signed raw readings and derives a 1,985.5 kWh accepted-surplus bundle.
- Source-verified contracts are deployed and externally inspectable.
- The repo contains on-chain transaction receipts, keeper artifacts, tests, threat model, trust assumptions, audit handoff, and grant drafts.
- The frontend demo now foregrounds the SPK mint product path and distinguishes the proof-scoped attested stack from the older legacy Sepolia stack.

## What is not claimed

- No mainnet deployment.
- No formal security audit.
- No production oracle finality.
- No production-governed attestation-enabled SPK deployment yet; the current fresh Sepolia stack is source-verified but proof-scoped.
- No certified hardware meter adapter yet.
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
- Production-governed redeploy and source verification of the governed attestation-enabled SPK contract.
- Real signed meter adapter and operating runbook.
- Chainlink Automation / Functions migration away from GitHub Actions keeper.
- Risk-boxed L2 pilot with strict open-interest caps.
- Partner-facing reporting and pilot documentation.
- Public technical report connecting thesis, testnet evidence, and production constraints.

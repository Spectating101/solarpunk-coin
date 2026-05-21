# SolarPunk Protocol — Reviewer Packet

**Last updated:** 2026-05-21
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
| Pilot CSV proof | CSV export -> signed readings -> accepted bundle -> source hash -> SPK mint preview | [`docs/product/PILOT_CSV_RECEIPT.md`](../product/PILOT_CSV_RECEIPT.md) |
| Public solar replay | Public historical rooftop-solar data -> normalized export surplus -> SPK mint preview | [`docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`](../product/PUBLIC_SOLAR_DATA_REPLAY.md) |
| Operator data intake | Generic solar operator CSV/profile -> validation -> eligible surplus -> SPK cryptocurrency preview | [`docs/product/OPERATOR_DATA_INTAKE.md`](../product/OPERATOR_DATA_INTAKE.md) |
| NREL solar training lab | NREL/PVWatts V8 baseline -> 1,095 daily modeled rows for SPK forecasting and anomaly scoring | [`docs/product/NREL_SOLAR_TRAINING_LAB.md`](../product/NREL_SOLAR_TRAINING_LAB.md) |
| NREL solar map scenarios | NREL/PVWatts compact 12-site solar-potential map pack for the frontend demo | [`docs/product/NREL_SOLAR_MAP_SCENARIOS.md`](../product/NREL_SOLAR_MAP_SCENARIOS.md) |
| Inverter/meter adapter | Cumulative counter snapshots or Fronius PowerFlow -> signed readings -> accepted surplus bundle | [`docs/product/INVERTER_METER_ADAPTER.md`](../product/INVERTER_METER_ADAPTER.md) |
| Hardware provenance model | L0-L4 hardware assurance tiers, risk haircuts, kWh caps, and upgrade checklist | [`docs/product/HARDWARE_PROVENANCE_MODEL.md`](../product/HARDWARE_PROVENANCE_MODEL.md) |
| Closed pilot execution package | Operator intake, commands, action queue, owners, and acceptance criteria for the next pilot lane | [`docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`](../product/CLOSED_PILOT_EXECUTION_PACKAGE.md) |
| Monetary stress harness | Redemption-wave and physical-shortfall scenarios with explicit reserve gaps | [`docs/product/MONETARY_STRESS_HARNESS.md`](../product/MONETARY_STRESS_HARNESS.md) |
| Energy-money simulation | Measured keeper resource signals drive SPK issuance, settlement, redemption, and reserve modeling | [`docs/product/ENERGY_MONEY_SIMULATION.md`](../product/ENERGY_MONEY_SIMULATION.md) |
| SPK finance dossier | Income statement, balance-sheet liability, break-even fee-base gap, reserve coverage, and closed-pilot finance stack | [`docs/product/SPK_FINANCE_DOSSIER.md`](../product/SPK_FINANCE_DOSSIER.md) |
| Empirical finance backtest | 862-day NASA POWER historical resource-to-finance backtest for DSCR, payback, and reserve-at-risk | [`docs/product/EMPIRICAL_FINANCE_BACKTEST.md`](../product/EMPIRICAL_FINANCE_BACKTEST.md) |
| Economic launch readiness | Empirical launch thresholds: required realized $/kWh, max capex, support gaps, sensitivity paths, and paid-launch blocker | [`docs/product/ECONOMIC_LAUNCH_READINESS.md`](../product/ECONOMIC_LAUNCH_READINESS.md) |
| SPK intelligence layer | Advisory risk stack for energy claims, provenance, forecast, finance readiness, adversarial checks, and explicit non-authority boundary | [`docs/product/SPK_INTELLIGENCE_LAYER.md`](../product/SPK_INTELLIGENCE_LAYER.md) |
| Governed pilot-stack scaffold | Deploy/readback scripts for SPK + treasury + currency system pilot stack | [`docs/project/PILOT_STACK_DEPLOYMENT.md`](../project/PILOT_STACK_DEPLOYMENT.md) |
| Product empirics | Single-product empirical dossier tying thesis evidence to SPK | [`docs/product/SPK_PRODUCT_EMPIRICS.md`](../product/SPK_PRODUCT_EMPIRICS.md) |
| Tests | 103/103 Hardhat tests passing | `npx hardhat test` |
| Daily real-data run | NASA POWER -> Sepolia keeper running since 2026-04-20 | [`docs/project/DAILY_EXPERIMENT_STATUS.md`](../project/DAILY_EXPERIMENT_STATUS.md) |
| Latest keeper tx | 2026-05-18 `updateIndex` tx | [`EVIDENCE.md`](../../EVIDENCE.md) |
| Frontend demo | Vite/React proof dashboard with live Sepolia reads | https://spectating101.github.io/solarpunk-coin/ |
| Security posture | Independent code review complete; formal audit not yet started | [`AUDIT_READINESS.md`](../../AUDIT_READINESS.md) |

## Reviewer path

1. Open [`docs/product/SPK_PRODUCT_EMPIRICS.md`](../product/SPK_PRODUCT_EMPIRICS.md) and read the product claim.
2. Open [`docs/product/SPK_ATTESTED_MINT_PROOF.md`](../product/SPK_ATTESTED_MINT_PROOF.md) and confirm the meter-to-mint proof.
3. Open [`docs/product/SPK_PUBLIC_READBACK.md`](../product/SPK_PUBLIC_READBACK.md) and confirm the Sepolia replay guards are consumed.
4. Open [`docs/product/PILOT_CSV_RECEIPT.md`](../product/PILOT_CSV_RECEIPT.md) and confirm the operator-style CSV bridge.
5. Open [`docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`](../product/PUBLIC_SOLAR_DATA_REPLAY.md) and confirm the public historical solar replay boundary.
6. Open [`docs/product/OPERATOR_DATA_INTAKE.md`](../product/OPERATOR_DATA_INTAKE.md) and confirm the generic real-data handoff path.
7. Open [`docs/product/INVERTER_METER_ADAPTER.md`](../product/INVERTER_METER_ADAPTER.md) and confirm the direct adapter path.
8. Open [`docs/product/HARDWARE_PROVENANCE_MODEL.md`](../product/HARDWARE_PROVENANCE_MODEL.md) and confirm the real hardware boundary.
9. Open [`docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`](../product/CLOSED_PILOT_EXECUTION_PACKAGE.md) and inspect the operator/action queue.
10. Open [`docs/product/MONETARY_STRESS_HARNESS.md`](../product/MONETARY_STRESS_HARNESS.md) and inspect the shortfall/reserve table.
11. Open [`docs/product/SPK_INTELLIGENCE_LAYER.md`](../product/SPK_INTELLIGENCE_LAYER.md) and confirm the AI boundary: AI advises; contracts decide.
12. Open [`EVIDENCE.md`](../../EVIDENCE.md) and inspect the daily keeper and Sepolia transaction trail.

## What is real today

- Real NASA POWER data is ingested daily and pushed to Sepolia.
- The latest SPK contract can mint from signed surplus-energy attestations and reject replayed, reused-source, non-oracle, expired, future-window, zero-source, or invalid-window attestations.
- The sample meter pipeline verifies 2 device signatures, rejects duplicate/low-quality readings, accepts 2,606.7 kWh, and the Sepolia proof mints 130.1697 SPK from 2,606 on-chain kWh.
- The pilot CSV bridge imports meter/inverter rows into signed raw readings, derives a 1,985.5 kWh accepted-surplus bundle, and previews 99.15075 SPK.
- The public solar replay runs historical Ausgrid rooftop-solar data through normalized export-surplus math and previews SPK without claiming live hardware provenance.
- The operator data intake path accepts a generic solar CSV/profile and produces a case-study artifact; the current sample validates 7 daily rows, 103.8 kWh eligible surplus, and 5.14485 SPK preview.
- The NREL solar training lab pulls PVWatts V8 public-model output and produces 1,095 daily rows across Taoyuan, Austin, and Phoenix, giving the AI/statistical layer a concrete baseline before private operator data exists.
- The NREL solar map scenarios produce 12 compact geography points for the frontend so reviewers can see how modeled solar potential varies without reading raw tables.
- The SPK intelligence layer scores those 7 operator rows against date-matched NREL/PVWatts expectations, separates physical/data/provenance/economic/shortfall risk, catches 4/4 adversarial bad-claim fixtures, and keeps real-value minting blocked.
- The inverter/meter adapter normalizes cumulative counter snapshots into one accepted signed interval with 996.2 kWh accepted surplus and includes a Fronius LAN PowerFlow mode for real inverter testing.
- The hardware provenance model keeps the adapter honest: current sample mode is L0 with 0 kWh real-value cap; closed pilot needs L2 or better real-operator evidence.
- The closed-pilot execution package maps remaining pilot work into concrete inputs, commands, acceptance criteria, and owners instead of leaving vague blockers.
- The energy-money simulation uses recent real keeper-index days to project 15,216.48 SPK annualized issuance across transparent rooftop/neighborhood/commercial archetypes.
- The monetary stress harness maps redemption waves into owed kWh, delivered kWh, shortfall kWh, fee buffer, and additional reserve requirement.
- The SPK finance dossier shows annualized protocol fee revenue, active-supply liability, fee break-even gap, and a closed-pilot finance stack instead of hiding the non-self-funding stage.
- The empirical finance backtest uses 862 observed NASA POWER daily records and shows p50 10 kW rooftop DSCR of `0.325x`, proving the resource model is grounded while exposing the tariff/capex/capital-structure blocker.
- The economic launch-readiness gate shows exactly what must change before launch economics clear: the best current p50 DSCR is `0.3764x`, the lowest absolute 10 kW pilot path needs roughly `$0.33/kWh` realized value, and protocol fees cover only `0.0185%` of the current opex assumption.
- Source-verified contracts are deployed and externally inspectable.
- The repo contains on-chain transaction proof links, keeper artifacts, tests, threat model, trust assumptions, audit handoff, and grant drafts.
- The frontend demo now foregrounds the SPK mint product path and distinguishes the proof-scoped attested stack from the older legacy Sepolia stack.

## What is not claimed

- No mainnet deployment.
- No formal security audit.
- No production oracle finality.
- No production-governed attestation-enabled SPK deployment yet; the current fresh Sepolia stack is source-verified but proof-scoped.
- No certified hardware meter adapter yet; the new adapter proves the software bridge, not physical finality.
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

# SolarPunk Protocol

SolarPunk is an **energy-standard cryptocurrency**: a modern gold-standard system where verified renewable-energy surplus replaces gold as the backing base. The current launch surface is the SolarPunk Public Lab: an open Sepolia/testnet environment for inspecting and reproducing the SPK proof path before any paid or mainnet launch.

The primary product is SolarPunkCoin (SPK): accepted surplus renewable-energy kWh can mint SPK only through a replay-protected oracle attestation.

**Status (May 2026):** Live Sepolia prototype for the earlier core contracts, public attested SPK mint proof, 102/102 contract tests, daily NASA -> on-chain oracle keeper running since April 20, independent code review complete.

**Public demo:** https://spectating101.github.io/solarpunk-coin/

---

## Quick links

| Document | Purpose |
|---|---|
| [`EVIDENCE.md`](./EVIDENCE.md) | **Start here for external reviewers** — clickable receipts for every claim |
| [`docs/product/PUBLIC_LAB.md`](./docs/product/PUBLIC_LAB.md) | Current public lab operating model and participation boundary |
| [`docs/product/PUBLIC_LAB_SOCIAL_KIT.md`](./docs/product/PUBLIC_LAB_SOCIAL_KIT.md) | Public announcement copy, social guardrails, and validation metrics |
| [`docs/product/PRODUCT_LAUNCH_GATE.md`](./docs/product/PRODUCT_LAUNCH_GATE.md) | Launch gate: public lab/testnet launchable; paid/mainnet blocked |
| [`docs/product/CURRENCY_SYSTEM_LAB.md`](./docs/product/CURRENCY_SYSTEM_LAB.md) | Four-layer currency-system lab: public proof, local field receipt, redemption framework, settlement framework |
| [`docs/product/CURRENCY_FRAMEWORK_READINESS.md`](./docs/product/CURRENCY_FRAMEWORK_READINESS.md) | Internal currency-framework readiness: issuance, settlement, redemption, delivery resolution |
| [`docs/product/FIELD_RECEIPT_LOOP.md`](./docs/product/FIELD_RECEIPT_LOOP.md) | Local end-to-end field receipt: signed meter surplus -> mint -> settlement -> redemption -> delivery |
| [`docs/product/INVERTER_METER_ADAPTER.md`](./docs/product/INVERTER_METER_ADAPTER.md) | Inverter/meter adapter receipt: cumulative counter snapshots or Fronius PowerFlow -> signed readings -> accepted surplus bundle |
| [`docs/product/HARDWARE_PROVENANCE_MODEL.md`](./docs/product/HARDWARE_PROVENANCE_MODEL.md) | Hardware assurance tiers: evidence score, risk haircut, issuance cap, and upgrade checklist for real meter/inverter data |
| [`docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`](./docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md) | Closed-pilot execution package: operator intake, action queue, commands, caps, and acceptance criteria |
| [`docs/product/PILOT_CSV_RECEIPT.md`](./docs/product/PILOT_CSV_RECEIPT.md) | Pilot CSV receipt: meter/inverter export -> signed readings -> source hash -> SPK mint preview |
| [`docs/product/MONETARY_STRESS_HARNESS.md`](./docs/product/MONETARY_STRESS_HARNESS.md) | Redemption/shortfall stress table for the SPK currency model |
| [`docs/product/ENERGY_MONEY_SIMULATION.md`](./docs/product/ENERGY_MONEY_SIMULATION.md) | Energy-standard monetary simulation: measured resource signal -> SPK issuance -> settlement -> redemption risk |
| [`docs/product/SPK_FINANCE_DOSSIER.md`](./docs/product/SPK_FINANCE_DOSSIER.md) | Finance dossier: income statement, balance-sheet liability, break-even fee base, reserve coverage, and closed-pilot finance stack |
| [`docs/product/EMPIRICAL_FINANCE_BACKTEST.md`](./docs/product/EMPIRICAL_FINANCE_BACKTEST.md) | 862-day NASA POWER historical resource-to-finance backtest: DSCR, payback, reserve-at-risk, and finance blockers |
| [`docs/product/ECONOMIC_LAUNCH_READINESS.md`](./docs/product/ECONOMIC_LAUNCH_READINESS.md) | Economic launch gate: required realized $/kWh, max capex, support gaps, sensitivity paths, and paid-launch blocker |
| [`docs/product/PILOT_OPERATOR_PACKET.md`](./docs/product/PILOT_OPERATOR_PACKET.md) | What a real meter/inverter operator should send and what SolarPunk returns |
| [`docs/product/PILOT_REVIEWER_PACKET.md`](./docs/product/PILOT_REVIEWER_PACKET.md) | One-page pilot proof checklist for skeptical reviewers |
| [`docs/product/CURRENCY_THEORY_AND_COMPARABLES.md`](./docs/product/CURRENCY_THEORY_AND_COMPARABLES.md) | Theory anchors and comparable systems: RECs, SolarCoin, Powerledger, Energy Web, stablecoin frameworks |
| [`docs/product/RESOURCE_BENCHMARK_LAB.md`](./docs/product/RESOURCE_BENCHMARK_LAB.md) | Multi-resource benchmark: NASA solar/wind, standard PV conversion, install cost, geothermal/tidal/hydro/biomass benchmarks, oil comparison |
| [`docs/product/ENERGY_STANDARD_ECONOMICS.md`](./docs/product/ENERGY_STANDARD_ECONOMICS.md) | Economic/finance spine: gold-standard mapping, issuance equations, kWh/SPK convertibility, scale scenarios, velocity, and risk register |
| [`docs/product/SPK_PRODUCT_EMPIRICS.md`](./docs/product/SPK_PRODUCT_EMPIRICS.md) | Single-product SPK proof and empirical dossier |
| [`docs/product/SPK_ATTESTED_MINT_PROOF.md`](./docs/product/SPK_ATTESTED_MINT_PROOF.md) | Reproducible meter-bundle -> oracle-signature -> SPK mint receipt |
| [`docs/product/SPK_PUBLIC_READBACK.md`](./docs/product/SPK_PUBLIC_READBACK.md) | Read-only Sepolia verification of consumed attestation/source hashes |
| [`docs/project/ATTESTED_SPK_DEPLOYMENT.md`](./docs/project/ATTESTED_SPK_DEPLOYMENT.md) | Public Sepolia proof-stack deployment receipt |
| [`docs/project/PILOT_STACK_DEPLOYMENT.md`](./docs/project/PILOT_STACK_DEPLOYMENT.md) | Local governed-pilot-stack deployment receipt and Sepolia deployment command |
| [`docs/specs/METER_ATTESTATION_SPEC.md`](./docs/specs/METER_ATTESTATION_SPEC.md) | Signed meter-reading validation spec |
| [`docs/project/METER_CSV_IMPORT.md`](./docs/project/METER_CSV_IMPORT.md) | Pilot-facing CSV import path for meter/inverter exports |
| [`docs/project/METER_CSV_ATTESTATION_BUNDLE.md`](./docs/project/METER_CSV_ATTESTATION_BUNDLE.md) | CSV-imported meter bundle receipt |
| [`MASTER_HANDOFF.md`](./MASTER_HANDOFF.md) | Full context: architecture, design decisions, operations, prospects |
| [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) | One-page stage snapshot |
| [`docs/project/REPO_STRUCTURE.md`](./docs/project/REPO_STRUCTURE.md) | What each repo area is, and what is safe/unsafe to clean |
| [`docs/grants/REVIEWER_PACKET.md`](./docs/grants/REVIEWER_PACKET.md) | One-page grant/reviewer packet and demo walkthrough |
| [`PROTOCOL_MATURITY_REPORT_2026.md`](./PROTOCOL_MATURITY_REPORT_2026.md) | 90-day stress test memo and solvency envelope |
| [`THREAT_MODEL.md`](./THREAT_MODEL.md) | Attack surface and trust assumptions |

---

## What it is

Primary SPK product path:

1. A registered meter signs raw renewable-energy readings.
2. `scripts/derive_meter_attestations.js` verifies signatures, duplicate nonces, closed windows, quality thresholds, capacity bounds, and energy balance.
3. `scripts/mint_spk_from_meter_bundle.js` hashes the accepted bundle, signs an oracle attestation, and calls `mintFromSurplusAttestation`.
4. `SolarPunkCoin` verifies the minter role, oracle signature, closed measurement window, source-hash single use, validity window, attestation replay status, grid stress, oracle freshness, reserve ratio, supply cap, fee split, and recipient before minting SPK.

Supporting modules:

- **`SolarPunkCoin`** — energy-backed token with signed surplus-attestation minting, PI controller, oracle-gated minting, reserve ratio checks, bond-gated operators
- **`SolarPunkCurrencySystem`** — SPK invoice-settlement and energy-redemption registry; transfers SPK against hashed invoices, burns SPK into owed-kWh receipts, and records fulfillment/shortfall/dispute states
- **`SolarPunkOption`** — margin-based clearinghouse for European energy index options; useful for hedging and stress-testing the same energy-price basis
- **`ProtocolTreasury`** — fee vault with 4-bucket budget split, keeper bond escrow with slashing
- **`StabilityPool`** — dedicated peg-stability vault (separated from coin contract for blast-radius isolation)
- **`ChainlinkOracleAdapter`** — bridges AggregatorV3Interface feeds to internal contract surfaces, normalises decimals to 1e18
- **`EnergyRevenueFloor`** — secondary pilot module for revenue-floor protection; not the primary product claim

---

## Live deployment (Sepolia, April 2026)

These public contracts prove the earlier SPK system state and daily keeper path. A separate fresh Sepolia proof stack now proves the signed surplus-attestation mint path publicly.

| Contract | Address | Etherscan |
|---|---|---|
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Verified ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Verified ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Verified ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` | Verified |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` | Verified |
| EnergyRevenueFloor | `0x0000000000000000000000000000000000000000` (not deployed yet) | — |
| Safe (admin) | `0xB95586775C73feB0154828c77832E106425C818A` | [Safe app](https://app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A) |

### Attested SPK public proof stack (Sepolia, May 2026)

| Contract / proof | Address / tx | Link |
|---|---|---|
| Attestation-enabled SolarPunkCoin | `0x8ceDa149EDE44078bf151b3334513916a84df820` | [Verified ✓](https://sepolia.etherscan.io/address/0x8ceDa149EDE44078bf151b3334513916a84df820#code) |
| Proof MockUSDC | `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268` | [Verified ✓](https://sepolia.etherscan.io/address/0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268#code) |
| Proof ProtocolTreasury | `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F` | [Verified ✓](https://sepolia.etherscan.io/address/0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F#code) |
| Signed-meter SPK mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` | [Etherscan](https://sepolia.etherscan.io/tx/0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d) |

---

## What is verified and running

- **102/102 smart contract tests** — `npx hardhat test`
- **Public attested SPK mint proof** — see `docs/product/SPK_ATTESTED_MINT_PROOF.md`
  - Sample bundle: `4` signed raw readings, `2` accepted, `2` rejected, `2` verified device signatures
  - Accepted surplus: `2606.7` kWh
  - On-chain integer mint: `2606` kWh
  - Mint result: `130.1697` SPK at `$0.05/kWh` after 10 bps mint fee
  - Public readback: `docs/product/SPK_PUBLIC_READBACK.md` confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus
  - Receipt: `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- **Pilot meter CSV bridge** — see `docs/project/METER_CSV_IMPORT.md`
  - Meter onboarding command writes a registry receipt without storing private keys
  - CSV import signs meter/inverter rows and feeds the same verifier as the public SPK proof
  - Sample CSV-derived bundle: `2` accepted, `0` rejected, `1,985.5` kWh surplus
- **Inverter/meter adapter bridge** — see `docs/product/INVERTER_METER_ADAPTER.md`
  - Cumulative inverter/meter snapshots normalize into `SPK_RAW_METER_READINGS_V1`
  - Sample adapter receipt: `1` accepted signed interval, `996.2` kWh accepted surplus
  - Fronius PowerFlow mode can poll a LAN inverter with `--host`, while production minting should prefer cumulative counters and hardware/gateway key custody
- **Hardware provenance model** — see `docs/product/HARDWARE_PROVENANCE_MODEL.md`
  - Current adapter sample is `L0`: acceptable for public lab, `0` kWh real-value cap
  - Closed pilot requires `L2` or better: named operator, live inverter/gateway counters, signed intervals, and archived raw source files
  - Real-value scale requires `L3/L4`: revenue-grade or utility-corroborated metering plus audit/legal/reserve controls
- **Closed pilot execution package** — see `docs/product/CLOSED_PILOT_EXECUTION_PACKAGE.md`
  - Public lab is `ready_now`; operator shadow pilot is `ready_when_operator_file_arrives`
  - External inputs are mapped to owners, commands, and acceptance criteria instead of left as vague blockers
  - Current economics target for the 10 kW path is about `$0.3298/kWh` or `$2,875.48/year` equivalent support
- **Pilot CSV receipt** — see `docs/product/PILOT_CSV_RECEIPT.md`
  - Sample CSV -> `2` accepted rows -> `1,985.5` kWh surplus -> deterministic source hash
  - Mint preview: `99.15075 SPK` at `$0.05/kWh` after 10 bps mint fee
  - Explicit boundary: no private key written, unsigned mode cannot mint, no hardware-finality claim
- **Monetary stress harness** — see `docs/product/MONETARY_STRESS_HARNESS.md`
  - Stresses redemption waves, delivery shortfalls, fee buffers, and additional reserve requirements
  - All conservation checks pass; shortfall scenarios intentionally expose where named reserve capital is needed
- **Energy-money simulation** — see `docs/product/ENERGY_MONEY_SIMULATION.md`
  - Uses real NASA/Sepolia keeper resource-index days plus explicit site assumptions
  - Simulates SPK issuance, settlement velocity, redemption claims, active supply, and reserve gaps across rooftop, neighborhood, and commercial archetypes
- **Governed pilot-stack scaffold** — see `docs/project/PILOT_STACK_DEPLOYMENT.md`
  - Deploys MockUSDC, ProtocolTreasury, SolarPunkCoin, and SolarPunkCurrencySystem together
  - Includes role assignment, reserve seeding, energy price basis, optional strict admin handoff, and readback script for persistent networks
- **Independent code review** (Codex, April 2026) — 5 findings fixed, regression tests added (commit `5176317`)
- **Safe multisig admin** — deployer EOA has zero authority on any contract
- **24h governance timelock** — active on all parameter changes
- **100 USDC bond escrow** — for oracle, minter, liquidator roles
- **Daily NASA keeper** — fetches real Taoyuan irradiance, pushes to Sepolia, commits log back to repo
  - Keeper logs: `state/keeper_logs/` (YYYY-MM-DD.json with on-chain TX hashes)
  - Workflow: `.github/workflows/nasa_keeper.yml`
- **Multi-resource benchmark lab** — fetches NASA POWER solar/wind/temperature data for Taoyuan and converts it into a 10 kWdc PV output/cost model, wind resource-density model, renewable benchmark matrix, and oil-only energy-unit comparison
  - Solar: latest 2026-05-11 NASA GHI `3.2566 kWh/m2/day` -> `28.0068 kWh/day` on a 10 kWdc / 50 m2 / 14% loss model
  - Oil: `1699.81 kWh` thermal per barrel benchmark only; not SPK mint-eligible
- **Energy-standard economics** — translates the proof stack into the monetary equation: accepted surplus kWh * energy price -> SPK issuance; at `$0.05/kWh`, `1 SPK = 20 kWh` basis and the proof mint formula matches `130.1697 SPK`
- **Empirical finance backtest** — converts 862 observed NASA POWER daily irradiance records for Taoyuan into project-finance distributions across 10 kW, 250 kW, and 1 MW archetypes; current assumptions produce a 10 kW p50 DSCR of `0.325x`, so the resource model is real but paid launch still needs better tariff/PPA, lower capex, incentives, or different capital structure
- **Economic launch readiness** — turns the empirical backtest into launch thresholds: current best p50 DSCR is `0.3764x`, paid launch is economically blocked, and the lowest absolute pilot path needs about `$0.33/kWh` realized value or support terms before it clears DSCR/payback targets
- **Python SDK** — `pip install spk-derivatives` (v0.5.0, PyPI)
- **Frontend** — Vite/React, reads live Sepolia state every 30 seconds, and includes an interactive energy-money workbench for SPK issuance, settlement, redemption, and reserve-risk scenarios

---

## What does not yet exist

- No production-governed redeploy of the latest attestation-enabled `SolarPunkCoin` yet; current fresh Sepolia stack is source-verified but proof-scoped
- No certified hardware meter adapter or production meter-signing process
- No formal security audit (required for mainnet; ~$25k; primary grant deliverable)
- 1-of-1 Safe (signer threshold expansion is post-grant)
- No counterparty pilots (highest-leverage gap — see `EVIDENCE.md` §4)
- Mainnet: NO_GO until audit

---

## How to run it

```bash
# Install
npm install

# Run all tests (102 passing)
npx hardhat test

# Reproduce the SPK product proof
npm run attestations:fixture
npm run attestations:build
npm run proof:spk-attested-mint
npm run proof:spk-public-readback
npm run product:empirics
npm run product:launch-gate
npm run product:currency-lab
npm run product:currency-framework
npm run product:field-receipt
npm run product:resource-benchmark
npm run product:energy-standard
npm run product:pilot-csv
npm run product:monetary-stress
npm run product:energy-money-sim
npm run product:empirical-backtest
npm run product:economic-launch
npm run deploy:pilot-stack:hardhat

# Import a pilot-style meter CSV into signed raw readings
npm run meter:onboard -- --meter-id=TW-TY-0001 --site-id=taoyuan-rooftop-a --device-address=0x... --capacity-kw=120
METER_PRIVATE_KEY=0x... npm run attestations:import-csv -- --csv=data/attestations/sample_meter_export.csv --meter-id=TW-TY-0001 --site-id=taoyuan-rooftop-a

# Frontend dev server (reads live Sepolia)
cd frontend && npm install && npm run dev

# Python SDK chain client (reads live Sepolia)
pip install spk-derivatives web3
python -m spk_derivatives.chain_client

# Manual NASA keeper run
npx hardhat run scripts/nasa_keeper.js --network sepolia

# Check DISBURSER_ROLE state
npx hardhat run scripts/fix_disburser_role.js --network sepolia
```

---

## Academic foundation

This repo is the implementation layer of a Finance Master's thesis (Yuan Ze University) with three pillars:

1. **Pillar 1 — CEIR analysis:** energy-cost information ratio regression and structural break analysis. Current reproducible CSV summary: pre-ban coefficient = `-0.257`, post-ban coefficient = `-0.634`, Chow p-value = `1.11e-16`, with 898 pre-ban and 1,044 post-ban observations.

2. **Pillar 2 — Physics-based pricing:** NASA satellite irradiance → volatility calibration (σ = 189.5%, Jarque-Bera p = 0.349), binomial trees, Monte Carlo. 2.08% divergence at 20,000 paths. Validated across 5 global markets.

3. **Pillar 3 — Contract feasibility:** Oracle tolerance thresholds (Taiwan: 21.7% error for VR ≥ 95%), VaR-based margin (motivates 10-15× spot collateral, driving clearinghouse structure). Supplemented by live Sepolia deployment (Appendix D of thesis).

Empirical data: `thesis_package/empirical_results/`
Pricing library: `energy_derivatives/spk_derivatives/`
Thesis draft: `thesis-draft.md`

---

## Grant applications

Active submission-ready drafts:
- `GRANT_SUBMISSIONS/ETHEREUM_ESP_APPLICATION.txt`
- `GRANT_SUBMISSIONS/CHAINLINK/BUILD_APPLICATION.md`

Use `docs/grants/TOMORROW_SUBMISSION_BRIEF.md` as the current send-order guide. Older grant drafts were moved to `docs/archive/legacy-grant-submissions/` and should not be used without a fresh factual pass.

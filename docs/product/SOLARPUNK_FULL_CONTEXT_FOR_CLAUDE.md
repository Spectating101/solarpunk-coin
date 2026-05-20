# SolarPunk Full Context For Claude

**Date:** 2026-05-19  
**Repo:** `/home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin`  
**Branch:** `main`  
**Purpose:** give Claude enough context to continue product, frontend, docs, or grant/pilot work without re-deriving the project from scratch.

## Non-Negotiable Context

- Do not touch `IE-JDE/`. That folder is separate academic research by the user and is not part of SolarPunk.
- Use plain product language. The user dislikes jargon like "on-chain energy receipt". Prefer "SPK cryptocurrency", "SolarPunk Coin", "crypto coin minted from verified surplus renewable energy", "proof", "mint preview", "case study", or "operator data".
- Do not tell the user the project is done. The public lab is launchable. The real-money system is not.
- Do not overclaim. Public lab proof, testnet proof, and simulations are real. Paid/mainnet launch, live inverter integration, legal readiness, and audited production use are still blocked.
- The primary product is **SolarPunkCoin / SPK**, not `EnergyRevenueFloor`. EnergyRevenueFloor is secondary and should not dominate product messaging.
- The user wants speed, but not fake safety. Recommended posture: push aggressively in parallel while keeping launch gates explicit.

## One-Sentence Product Definition

SolarPunk is an energy-standard cryptocurrency project where verified surplus renewable-energy kWh can mint SPK through a signed, replay-protected attestation pipeline.

## Five-Year-Old Explanation

A solar panel makes electricity. A house uses some. If there is extra electricity left over, SolarPunk measures the extra and can create SPK coins from that verified surplus.

## Serious Product Explanation

SolarPunk tries to modernize the gold-standard idea. Instead of gold backing a currency, accepted surplus renewable energy becomes the issuance base. The protocol ingests energy data, validates it, signs it, computes eligible surplus, and mints SPK only when the attestation is valid and not replayed.

The core thesis is:

```text
verified surplus renewable kWh * energy price basis = SPK issuance
```

The current product is not a public money machine. It is a public lab plus testnet proof system showing that the data-to-SPK path works and can be inspected.

## Current Stage

SolarPunk is in the **Public Lab** stage.

Current launch gate:

| Mode | Status | Meaning |
|---|---|---|
| SolarPunk Public Lab | `launchable` | Demo, docs, Sepolia proof, public solar replay, operator intake, economic simulations, and frontend are ready to show |
| Closed testnet pilot | `blocked` | Needs governed attested-SPK redeploy, one real operator meter/inverter source, L2+ hardware provenance, and economic/support terms |
| Paid/mainnet product | `blocked` | Needs closed-pilot evidence plus audit, legal/commercial scope, redemption policy, production deployment, and real demand |

As of the current generated launch gate:

- Public Lab: `16` passed, `0` blocking.
- Closed testnet pilot: `17` passed, `4` blocking.
- Paid/mainnet product: `17` passed, `9` blocking.

Primary launch-gate artifact:

- `docs/product/PRODUCT_LAUNCH_GATE.md`
- `state/product/launch_gate.json`

## What Is Real Today

- Smart contracts pass `102/102` Hardhat tests.
- A fresh attestation-enabled SPK proof stack is deployed and source-verified on Sepolia.
- A public Sepolia transaction proves signed meter-style data can mint SPK.
- The repo has a local currency-system contract for invoice settlement and owed-kWh claim tracking.
- The frontend is a Vite/React public lab interface with SPK mint proof, currency lab, launch console, and energy-money workbench.
- The daily NASA keeper has been running since 2026-04-20 and logs daily resource/on-chain evidence.
- Public historical Ausgrid solar data is replayed through the SPK verifier and mint math.
- A generic operator data intake path now exists for external solar datasets.
- Economic simulations, finance dossier, monetary stress harness, resource benchmarks, and launch thresholds exist.

## What Is Not Real Yet

- No public mainnet SPK product.
- No audited production deployment.
- No legal/commercial launch terms.
- No live solar house or live inverter connected to SPK in production.
- No certified hardware provenance.
- No named pilot counterparty.
- No real demand side for SPK value.
- No claim that SPK is a REC, SREC, legal energy credit, or guaranteed income stream.

## Contract Context

Legacy Sepolia core prototype:

| Contract | Address |
|---|---|
| `SolarPunkCoin` | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| `SolarPunkOption` | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| `ProtocolTreasury` | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| `StabilityPool` | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| `ChainlinkOracleAdapter` | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| Safe admin | `0xB95586775C73feB0154828c77832E106425C818A` |

Fresh attested SPK public proof stack:

| Contract / proof | Address / tx |
|---|---|
| Attestation-enabled `SolarPunkCoin` | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Proof `MockUSDC` | `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268` |
| Proof `ProtocolTreasury` | `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F` |
| Signed-meter SPK mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |

Important nuance:

- The older Safe-admin Sepolia deployment proves the earlier core protocol and daily keeper path.
- The fresh attested-SPK proof stack proves the signed surplus-attestation mint path.
- The fresh proof stack is source-verified but proof-scoped, not yet production-governed under the Safe/admin separation needed for closed pilot.

## Core Data-To-SPK Pipeline

The product path is:

1. A meter/inverter/gateway produces renewable-energy data.
2. Data is normalized into raw readings.
3. Registered meter/device identity signs the readings.
4. `derive_meter_attestations.js` validates the readings.
5. Accepted records become an accepted surplus bundle.
6. The accepted bundle creates a deterministic source hash.
7. Oracle/minter attestation signs the source hash and metadata.
8. `SolarPunkCoin.mintFromSurplusAttestation` verifies and mints SPK.

Validation checks include:

- Registered meter identity.
- Signature verification.
- Measurement window closed.
- No duplicate nonce.
- No duplicate meter window.
- Quality threshold.
- Capacity sanity bound.
- Energy balance tolerance.
- Surplus greater than zero.
- Source hash single use.
- Attestation replay protection.

## Current Proof Surfaces

### 1. Public Attested SPK Mint

Artifact:

- `docs/product/SPK_ATTESTED_MINT_PROOF.md`
- `docs/product/SPK_PUBLIC_READBACK.md`

Current public proof:

- Accepted surplus: `2606.7 kWh`.
- On-chain integer surplus: `2606 kWh`.
- Mint result: `130.1697 SPK`.
- Sepolia tx: `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d`.

Meaning:

- This is the strongest on-chain proof that the SPK attestation mint path works.

Boundary:

- It uses proof/fixture-style meter data, not a real operator's live hardware.

### 2. Pilot CSV Proof

Artifact:

- `scripts/pilot_csv_receipt.js`
- `docs/product/PILOT_CSV_RECEIPT.md`
- `state/product/pilot_csv_receipt.json`

Current sample:

- `2` accepted rows.
- `1985.5 kWh` accepted surplus.
- `99.15075 SPK` mint preview.

Meaning:

- A meter/inverter CSV can become signed raw readings, accepted verifier output, source hash, and SPK mint preview.

Boundary:

- Still sample data unless replaced with a real operator file and credible device/signer custody.

### 3. Public Solar Data Replay

Artifact:

- `scripts/public_solar_data_replay.js`
- `docs/product/PUBLIC_SOLAR_DATA_REPLAY.md`
- `state/product/public_solar_data_replay.json`

Current sample:

- `3` historical Ausgrid rooftop-solar days.
- `29.775 kWh` solar generation.
- `18.715 kWh` export surplus.
- `0.8991 SPK` mint preview.

Meaning:

- SPK mint math can ingest real-world public solar profiles.

Boundary:

- Public historical data has no original device signatures, so the lab re-signs normalized rows for replay. This is economic/model evidence, not live hardware provenance.

### 4. Operator Data Intake

Artifact:

- `scripts/operator_data_intake.js`
- `docs/product/OPERATOR_DATA_INTAKE.md`
- `data/operator/README.md`
- `data/operator/sample_operator_export.csv`
- `data/operator/sample_operator_profile.json`
- `state/product/operator_data_intake.json`

Current sample:

- `7` accepted daily rows.
- `235.7 kWh` solar generation.
- `103.8 kWh` eligible surplus.
- `5.14485 SPK` mint preview.
- Provenance: `L0`, sample/public-lab fixture.

Meaning:

- This is the practical bridge for a real solar owner, lab, or university. If someone sends a CSV, the repo can process it into SPK preview and case-study output.

Boundary:

- The checked-in sample is not a real external source. Real paid/closed pilot needs named operator data.

### 5. Inverter/Meter Adapter

Artifact:

- `scripts/inverter_meter_adapter.js`
- `docs/product/INVERTER_METER_ADAPTER.md`
- `state/product/inverter_meter_adapter_receipt.json`

Current sample:

- `1` accepted signed interval.
- `996.2 kWh` accepted surplus.
- Supports cumulative snapshots and Fronius PowerFlow mode.

Meaning:

- First direct hardware-facing adapter path exists.

Boundary:

- Sample mode is not physical finality. Closed pilot needs real operator source and custody.

## Hardware Provenance Model

Artifact:

- `scripts/hardware_provenance_model.js`
- `docs/product/HARDWARE_PROVENANCE_MODEL.md`

Levels:

| Level | Meaning | Use |
|---|---|---|
| `L0` | Sample or fixture | Public lab only |
| `L1` | Operator-signed CSV export | Shadow pilot/review |
| `L2` | Live inverter/gateway signed counter | Closed pilot candidate |
| `L3` | Revenue-grade meter with gateway custody | Risk-boxed pilot |
| `L4` | Utility or settlement-corroborated meter | Production candidate after audit |

Current level:

- `L0`.

Closed pilot target:

- `L2` or better.

Paid public launch target:

- `L4` or equivalent, plus audit/legal/reserve/governance gates.

## Currency-System Layer

`SolarPunkCurrencySystem` exists locally and models SPK moving through:

- Invoice settlement.
- SPK transfer against hashed invoices.
- Redemption burn into owed-kWh claims.
- Fulfillment, shortfall, and dispute states.

Related artifacts:

- `contracts/SolarPunkCurrencySystem.sol`
- `test/SolarPunkCurrencySystem.test.js`
- `docs/product/CURRENCY_SYSTEM_LAB.md`
- `docs/product/CURRENCY_FRAMEWORK_READINESS.md`
- `docs/product/FIELD_RECEIPT_LOOP.md`

Current local SPK loop:

- Signed meter surplus -> SPK mint.
- `75 SPK` settled.
- `20 SPK` redeemed.
- `400 kWh` delivered in the local model.

Boundary:

- This is internal currency-mechanics proof. It is not proof of external adoption or real-world energy delivery.

## Economic And Finance Layer

Artifacts:

- `docs/product/ENERGY_STANDARD_ECONOMICS.md`
- `docs/product/ENERGY_MONEY_SIMULATION.md`
- `docs/product/MONETARY_STRESS_HARNESS.md`
- `docs/product/SPK_FINANCE_DOSSIER.md`
- `docs/product/EMPIRICAL_FINANCE_BACKTEST.md`
- `docs/product/ECONOMIC_LAUNCH_READINESS.md`

Core findings:

- Energy basis currently uses `$0.05/kWh`, so `1 SPK = 20 kWh` at that basis.
- The simulation and stress harness preserve accounting conservation.
- Historical NASA POWER backtest uses `862` observed days.
- Current 10 kW economics are not self-funding under default assumptions.
- The current lowest-support 10 kW pilot path needs roughly `$0.33/kWh` realized value or equivalent support.
- Protocol fee revenue is far too small at current tiny scale to fund operations alone.

Interpretation:

- The resource model is coherent.
- The economic launch gap is not hidden.
- The likely first money is not public SPK speculation. It is paid pilot service, sponsorship, ecosystem support, grant, or partner-funded case study.

## Commercial Strategy

Do not pitch:

- "Plug in solar and guaranteed print money."
- "This is a finished public currency."
- "SPK is already a legal energy credit."

Pitch:

- "SolarPunk turns solar production/export data into an SPK cryptocurrency mint preview, dashboard, and case-study report."
- "The first professional product is a paid research/demo/pilot service, not a public token sale."

Pilot packages already documented:

- `docs/product/PILOT_COMMERCIAL_PACKET.md`

Pricing ladder:

| Package | Price band | Output |
|---|---:|---|
| Data-only case study | `$500-$1,500` | One dataset -> SPK preview + report |
| Weekly shadow pilot | `$1,500-$5,000/month` | Repeated weekly processing + dashboard + cumulative report |
| Closed beta setup | `$7,500-$25,000` | Signed source, governed testnet deployment, monitoring, audit-ready packet |

Best target channels:

- Web3/ReFi/DePIN ecosystem sponsors.
- Energy Web / Chainlink / ReFi networks.
- Universities and solar labs.
- Solar installers/developers.
- Campus or corporate sustainability offices.

Outreach artifacts:

- `docs/product/DATA_REQUEST_OUTREACH.md`
- `data/operator/README.md`
- `data/operator/sample_operator_export.csv`
- `data/operator/sample_operator_profile.json`

## Grant Context

The user has already applied for some grants. Grant path remains useful, but the current strategic move is not to wait passively.

Recommended framing:

- Grants fund audit, security, public-good infrastructure, open-source pilot, and external data validation.
- Paid pilot/service funds the first commercial proof and possibly audit.
- External data is the highest-leverage missing proof surface.

Grant docs:

- `docs/grants/REVIEWER_PACKET.md`
- `docs/grants/GRANT_EXECUTION_PLAN.md`
- `docs/grants/GRANT_BUDGET_AND_MILESTONES.md`
- `docs/grants/GRANT_COPY_PASTE_ANSWERS.md`
- `docs/grants/OUTREACH_TEMPLATES.md`

## Frontend Context

Frontend lives in:

- `frontend/`

Important component:

- `frontend/src/components/CurrencyLab.jsx`

Recent frontend wiring:

- Imports `state/product/operator_data_intake.json`.
- Displays "Operator Intake" with `5.14485 SPK`, `7` accepted rows, `L0` provenance, and `103.8 kWh` eligible surplus.

The frontend is for demo and reviewer comprehension. It should show the system as powerful but not hide boundaries.

When improving frontend:

- Make SPK understandable as a cryptocurrency minted from verified surplus renewable energy.
- Make the proof flow visual: solar data -> validation -> eligible surplus -> SPK preview/mint.
- Keep status badges clear: Public Lab ready, Closed Pilot blocked, Paid/Mainnet blocked.
- Avoid making the UI sound like guaranteed yield.

## Most Important Files For Claude To Read First

Read these in order:

1. `CURRENT_STATUS.md`
2. `EVIDENCE.md`
3. `docs/product/PRODUCT_LAUNCH_GATE.md`
4. `docs/product/OPERATOR_DATA_INTAKE.md`
5. `docs/product/PILOT_COMMERCIAL_PACKET.md`
6. `docs/product/DATA_REQUEST_OUTREACH.md`
7. `docs/product/HARDWARE_PROVENANCE_MODEL.md`
8. `docs/product/ECONOMIC_LAUNCH_READINESS.md`
9. `docs/product/PUBLIC_LAB.md`
10. `README.md`

If working on contracts:

1. `contracts/SolarPunkCoin.sol`
2. `contracts/SolarPunkCurrencySystem.sol`
3. `test/SolarPunkCoin.test.js`
4. `test/SolarPunkCurrencySystem.test.js`

If working on data intake:

1. `scripts/operator_data_intake.js`
2. `scripts/pilot_csv_receipt.js`
3. `scripts/import_meter_csv.js`
4. `scripts/derive_meter_attestations.js`
5. `test-node/operator_data_intake.test.js`

## Commands

Use Node 22:

```bash
source ~/.nvm/nvm.sh && nvm use 22
```

Core checks:

```bash
npm test
npm run product:operator-intake:test
npm run product:launch-gate:test
npm run product:public-solar-replay:test
npm run product:pilot-csv:test
```

Generate current product artifacts:

```bash
npm run product:operator-intake
npm run product:public-solar-replay
npm run product:pilot-csv
npm run product:launch-gate
```

Frontend:

```bash
cd frontend
npm test -- --run
npm run build
```

Recent verification from Codex:

- `npm test` -> `102 passing`.
- `npm run product:operator-intake:test` -> `5 passing`.
- `npm run product:launch-gate:test` -> `3 passing`.
- `npm run product:public-solar-replay:test` -> `4 passing`.
- `npm run product:pilot-csv:test` -> `5 passing`.
- Frontend `npm test -- --run` -> `7 passing`.
- Frontend `npm run build` -> passed.
- `git diff --check` -> clean.

## Current Working Tree Note

At the time this file was created, the operator-intake work was present in the working tree and not yet committed. If Claude is continuing immediately after Codex, check:

```bash
git status --short --untracked-files=all
```

Expected new/modified areas include:

- `scripts/operator_data_intake.js`
- `test-node/operator_data_intake.test.js`
- `data/operator/`
- `docs/product/OPERATOR_DATA_INTAKE.md`
- `docs/product/DATA_REQUEST_OUTREACH.md`
- `docs/product/PILOT_COMMERCIAL_PACKET.md`
- `frontend/src/components/CurrencyLab.jsx`
- `scripts/product_launch_gate.js`
- `state/product/operator_data_*`
- `state/product/launch_gate.json`

Do not revert these unless the user explicitly asks.

## Immediate Next Steps

Best next sequence:

1. Commit current operator-intake and documentation work.
2. Send the data-request emails from `docs/product/DATA_REQUEST_OUTREACH.md`.
3. Keep improving the frontend proof flow so non-technical reviewers understand SPK in under one minute.
4. Build a "real operator case study" page/template that auto-updates from `state/product/operator_data_intake.json`.
5. In parallel, prepare governed attested-SPK redeploy/readback for closed testnet pilot.
6. If any real CSV arrives, process it the same day through `npm run product:operator-intake`.
7. Publish the first external case study as "real solar data -> SPK cryptocurrency preview".
8. Use that case study to pitch paid pilot, sponsor, ecosystem support, or audit funding.

## What Not To Do Next

- Do not add random abstract protocol layers unless they connect directly to external data, frontend demo clarity, pilot conversion, or launch gates.
- Do not keep saying "we need real stuff" without turning that into a concrete ask, email, CSV schema, or integration target.
- Do not make SPK sound like guaranteed income.
- Do not spend time on full public mainnet launch before closed pilot gates improve.
- Do not bury the simple product story under academic language.

## Honest Strategic Assessment

The project is not a toy anymore. It has real contracts, public testnet proof, data pipelines, simulations, frontend, launch gates, and a credible energy-standard currency thesis.

It is also not yet a professional money system. The missing professional bridge is external validation:

- one real solar dataset,
- one named partner or operator,
- one repeated pilot loop,
- one audit/security review,
- one clear legal/commercial frame,
- one demand-side reason for SPK to matter.

The strongest near-term path is:

```text
Public Lab -> Real Solar CSV Case Study -> Paid Shadow Pilot -> Closed Testnet Beta -> Audit/Legal -> Limited SPK Launch
```

This is not "grant or nothing". The commercial wedge is the pilot service: turning solar data into SPK mint preview, dashboard, report, and launch-readiness path. It is modest at first, but it is the fastest route from impressive prototype to professional project.

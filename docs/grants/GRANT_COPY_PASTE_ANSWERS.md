# Grant Copy-Paste Answers

Use these answers as field-ready text. Edit only for word limits and the specific portal.

## Project Name

SolarPunk Protocol

## One-Line Description

Open-source Ethereum testnet infrastructure for renewable-energy hedging, using NASA POWER data, source-verified smart contracts, and a live Sepolia oracle experiment.

## Short Description

SolarPunk Protocol is a renewable-energy risk infrastructure project that explores how public solar irradiance data can support transparent on-chain hedging. The project combines a Python pricing engine, source-verified Solidity contracts, a daily NASA POWER -> Sepolia oracle keeper, and a React proof dashboard that reads live contract state.

The current system is a serious testnet prototype, not a mainnet product: 79/79 smart contract tests pass, five Sepolia contracts are source-verified, a Safe controls the three core contracts, and daily real-data keeper artifacts are committed to the repo with public transaction hashes. Grant funding would support audit, oracle hardening, Chainlink Automation/Functions work, and a risk-boxed L2 pilot.

## Problem

Renewable-energy projects face revenue volatility from weather and production variability. Smaller solar operators often cannot access institutional hedging markets, making financing harder and increasing the cost of capital. Existing DeFi tools are mostly generic financial speculation; they do not encode the physical data and risk constraints needed for energy markets.

## Solution

SolarPunk builds an open-source prototype for energy-linked settlement and hedging. NASA POWER solar irradiance is normalized into an energy index, posted to Sepolia, and made externally inspectable through transaction links, committed keeper artifacts, and live RPC reads. A margin-based option clearinghouse prototype demonstrates how energy derivatives could be settled transparently on Ethereum infrastructure.

## Current Traction / Evidence

- 79/79 smart contract tests passing.
- Five source-verified Sepolia contracts.
- Daily NASA POWER -> Sepolia keeper running since 2026-04-20.
- Latest keeper run recorded in `state/keeper_logs/summary.json`.
- Public evidence register at `EVIDENCE.md`.
- Independent Codex review found and fixed five issues.
- Audit-readiness, threat model, trust assumptions, and invariant checklist prepared.
- React frontend demo reads live Sepolia state and explains the reviewer proof path.
- Python pricing library published as `spk-derivatives` v0.5.0.

## Honest Current Limitations

- No formal smart contract audit yet.
- No mainnet deployment.
- No production oracle finality.
- No signed solar-operator pilot or LOI yet.
- Safe is currently 1-of-1.
- Live Sepolia margin is currently 150% initial / 75% maintenance; 250% / 125% is the next risk-boxed pilot target from stress testing.

## Why Now

The project has crossed the line from concept to public proof: deployed contracts, daily real-data on-chain updates, source-verifiable artifacts, and a functioning frontend. The next bottleneck is not ideation; it is external validation, audit, oracle hardening, and a capped pilot path. Grant funding is appropriate because the work is open-source infrastructure and produces public technical outputs, not private runway alone.

## Funding Request

Requested amount: **$48,000**.

Use of funds:

- $24,000 smart contract audit and remediation.
- $10,000 oracle productionization and Chainlink Automation/Functions prototype.
- $6,000 L2 deployment and monitoring.
- $4,000 hosted demo and reviewer proof surface.
- $4,000 public technical report and research outputs.

Minimum useful partial grant: **$25,000**, focused on external audit/review and remediation.

## What Funding Unlocks

Grant funding turns SolarPunk from a strong testnet proof into an externally reviewable pilot candidate. The concrete outputs are an audit report or external review, fixed findings with regression tests, hardened oracle flow, a capped L2 deployment plan, public demo/reporting, and a clearer path to operator/advisor validation.

## Ethereum ESP-Specific Answer

SolarPunk contributes to Ethereum by demonstrating a new public-good settlement primitive: renewable-energy risk infrastructure. The code is open-source, the data pipeline uses public NASA POWER inputs, and the proof surface is externally inspectable through Sepolia transactions and committed artifacts.

ESP support would fund work that benefits the Ethereum ecosystem broadly: audit-readiness, oracle-hardening patterns, L2 settlement analysis, and public reporting on how Ethereum infrastructure can support non-speculative real-world financial primitives.

The project is not asking ESP to fund solvency reserves or private liquidity. The ask is for open-source infrastructure, security review, oracle productionization, and public technical outputs.

## Chainlink BUILD-Specific Answer

SolarPunk is fundamentally oracle-dependent. Energy derivatives cannot function without trusted external data and robust automation. Today, a ChainlinkOracleAdapter is deployed on Sepolia and the NASA POWER keeper runs through GitHub Actions. The next milestone is to migrate the data path toward Chainlink Automation and Functions so oracle updates, stale-data handling, and settlement triggers are less centralized and more production-like.

SolarPunk also creates a potential new Chainlink vertical: energy and climate data feeds. NASA POWER irradiance, wholesale electricity prices, renewable energy certificate prices, and regional capacity factors are all data categories that could support a broader energy-data oracle ecosystem.

## Academic Grant-Specific Answer

SolarPunk is the implementation layer of a finance master's thesis on energy-backed settlement and derivatives. The research contribution is the connection between empirical energy-market modeling, physics-based pricing, and programmable settlement.

Grant funding would support adversarial mechanism analysis, margin-regime comparison, oracle-risk modeling, and a public technical report connecting the thesis, the deployed Sepolia prototype, and the limitations of production deployment.

## Team

Christopher Ongko, solo founder/developer and finance master's student at Yuan Ze University. Background includes Solidity, Python, React, Hardhat testing, derivatives pricing, and environmental/energy finance research. ORCID: `0009-0007-9339-9098`.

## Links

- GitHub: `https://github.com/Spectating101/solarpunk-coin`
- Evidence register: `EVIDENCE.md`
- Reviewer packet: `docs/grants/REVIEWER_PACKET.md`
- Daily experiment status: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- Audit readiness: `AUDIT_READINESS.md`
- Contract addresses: `CONTRACT_ADDRESSES.md`


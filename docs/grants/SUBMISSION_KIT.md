# Grant Submission Kit (Ready-to-Fill)

Use this to answer typical grant forms for climate/infra programs (Polygon Village/Community Grants, climate RFPs, Gitcoin Climate rounds, Celo Climate Collective, ecosystem accelerators).

## Quick Targets
- Polygon Community Grants / Village (climate + infra alignment).
- Climate-focused rounds (e.g., Gitcoin Climate) and ReFi/infra accelerators (Celo/Climate Collective).
- Optional: RWA/DeFi incubators that accept climate hedging primitives.

## One-Liner
Physics-priced revenue floors for renewable assets, settled on Polygon. Empirical data → risk engine → on-chain margin and settlement.

## Problem
Small/medium solar producers face extreme price volatility and curtailment; no accessible hedges. Grid stability suffers from misaligned incentives.

## Solution
Three-pillar stack:
- Pillar 1 (Empirics): NASA irradiance + wholesale feeds to model localized risk.
- Pillar 2 (Pricing): Python risk engine for premiums/VaR; PI tuning for peg control.
- Pillar 3 (Execution): Solidity clearinghouse (SolarPunkCoin + SolarPunkOption) enforcing margin/solvency on Polygon.

## Proof-of-Work (current)
- `./verify_all.sh` passes: Python risk engine OK, 46 Hardhat tests (SPK + options) passing, frontend build green.
- Contracts: `SolarPunkCoin.sol`, `SolarPunkOption.sol` (margin/liquidation).
- Scripts: deploy, oracle/risk sims (`scripts/pillar3_engine.py`, `simulate_peg.py`).
- UI: React/Vite dApp (wallet connect, hedge flow) wired to ABI; set `VITE_OPTION_ADDRESS` after deploy.

## Milestones (6 months, baseline)
1) Testnet launch (Mumbai): deploy SPK + Option, wire UI, publish addresses, recorded demo. Success: live testnet trade, explorer links, demo video.
2) Oracle + tuning: daily index service with staleness/deviation gates; tuning report vs baseline 6.5% in-band; monitoring dashboards. Success: documented improvement, alerting live.
3) Pilot + UX/SDK: execute pilot hedge with partner; publish SDK + ops runbook. Success: settled pilot trade, testimonial/quote, user docs.

## Budget (baseline $50k; stretch $75k)
Baseline: $12k options clearinghouse/testnet, $10k oracle+monitoring, $10k pilot incentives, $10k UI/SDK, $8k ops buffer.  
Stretch: +$10k liquidity incentives, +$8k audit top-up, +$7k community/docs/conferences.

## Why Polygon
Low fees for oracle updates and micro-hedges; strong climate/Refi narrative; tooling already in Hardhat/Vite; Mumbai/mainnet ready scripts.

## Risks & Mitigations
- Oracle/basis risk: weighted median, staleness/deviation gates, basis tolerance bands (see `docs/economics/BASIS_AND_TOLERANCE.md`).
- Liquidity/capital efficiency: VaR-based IM/MM per zone (see `docs/economics/IM_CALIBRATION.md`), pilot-size OI caps, maker incentives.
- Regulatory: position as pilot/commodity-style cash-settled option; avoid “stablecoin” framing.

## Team / Credibility
- Academic foundation (thesis + RESEARCH docs).
- Rigor: full tests, risk sims, and integration script.

## Fields to Fill Before Submission
- Testnet addresses (SPK, Option), explorer links.
- Demo video/screenshot link.
- Partner/advisor LOI or quote (optional but strong).
- Contact info and repo URL.

## Suggested Attachments/Links
- Repo: <repo URL>
- Docs index: START_HERE.md
- Grant brief: docs/GRANT_BRIEF_POLYGON.md
- Economics notes: docs/economics/ (basis, IM calibration, pilot plan)
- Simulation outputs: spk_simulation.png (if requested)

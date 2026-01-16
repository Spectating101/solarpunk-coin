# SolarPunk Protocol — Grant Brief (Polygon-ready)

**Mission:** Revenue floors for renewable assets via physics-priced hedges settled on Polygon.

**What it is:** Three-pillar stack — empirical irradiance data, Python pricing/risk engine, and solvency-first smart contracts with a React UI.

**Current proof-of-work (Jan 2026):**
- `./verify_all.sh` passes: Python risk engine OK, **46 Hardhat tests** (SPK + options clearinghouse) passing, frontend build green.
- Options clearinghouse contract implemented: `contracts/SolarPunkOption.sol` with margin/liquidation; deployment script `scripts/deploy_pillar3.js`.
- Risk engine scripts: `scripts/pillar3_engine.py`, `simulate_peg.py` (baseline PI control tuning in progress).
- UI prototype (React/Vite) for wallet connect + hedge UX, wired to current ABI.

**Problem:** Small/medium solar producers face extreme price volatility and curtailment with no accessible hedges. Grid stability suffers because incentives are misaligned.

**Solution:** Sell put-style protection on verified surplus energy. Price with NASA irradiance data (physics, not hype), enforce solvency and peg control on-chain (reserve ratios + PI control), and settle cheaply on Polygon.

---

## Grant Ask (baseline)
- **Request:** $50k over ~6 months
- **Use of funds:** ship options clearinghouse + oracle service, testnet pilot, audit prep, and user-facing UX/SDK.

### Budget (baseline $50k)
- $12k — Options clearinghouse contract + Hardhat tests + deployment (testnet)
- $10k — Oracle/data service (irradiance + price) + monitoring
- $10k — Pilot setup + incentives (testnet users/partners)
- $10k — UI/SDK polish and integration with deployed contracts
- $8k  — Ops/infra/testing buffer

### Stretch (+$25k, total $75k)
- $10k — Extended liquidity/pilot incentives
- $8k  — External security review/audit top-up
- $7k  — Community/docs/education + conference submission

---

## Roadmap & Deliverables
**Milestone 1 (Months 1–2): Options Clearinghouse + Testnet Launch**
- Deliverables: Options clearinghouse contract (Pillar 3) with margining + liquidation tests, deployed on Polygon testnet; UI wired to live address; test logs + verify scripts.
- Success: All contract tests passing; testnet address + block explorer link; recorded demo of hedge flow.

**Milestone 2 (Months 3–4): Oracle Service + Stability Tuning**
- Deliverables: Oracle service pulling irradiance + price data with staleness/circuit-breaker controls; tuning report vs baseline PI control; monitoring dashboards.
- Success: Documented improvement over current 6.5% in-band baseline; alerting for oracle deviation/staleness.

**Milestone 3 (Months 5–6): Pilot + UX/SDK**
- Deliverables: Pilot LOI and at least one on-chain hedge execution on testnet; SDK + improved UI for non-dev users; incident/ops runbook.
- Success: Pilot trade settled; partner testimonial/quote; user-facing docs.

---

## Why Polygon
- Low fees → micro-hedges and frequent oracle updates are viable.
- Strong RWA/Refi positioning and climate narrative.
- Tooling familiarity (Hardhat + Ethers) and existing deployment scripts for Mumbai/mainnet.

---

## Risks & Mitigations
- **Oracle/data quality:** Use weighted-median + staleness gating; monitor with alerts; fail-closed minting when feeds are stale.
- **Volatility/peg control:** Continue PI tuning with simulation (`simulate_peg.py`) and testnet data; add manual overrides for stress events.
- **Liquidity/user adoption:** Start with pilot incentives + partner coop; keep collateral in USDC to reduce risk.

---

## What we still need (pre-submission)
- Testnet deployment + recorded demo/screenshots for SolarPunkOption.
- Optional: LOI/interest email from a solar coop or advisor.

**Contact:** Christopher Ongko  
**Repo:** https://github.com/ (SolarPunk Protocol)  
**Quick run:** `./verify_all.sh` (root)

# SolarPunk Protocol: Energy-Backed Derivatives and Stablecoins
**Grant Proposal: Polygon Community Grants / Ecosystem Fund**

**Project Title:** SolarPunk Protocol: Decentralized Hedging for Renewable Energy
**Funding Requested:** $50,000 USD (baseline) | $75,000 USD (stretch)
**Duration:** 6 Months
**Status:** MVP complete (46 tests passing; testnet deployment pending RPC/keys)

---

## 1. The "Why": Solving the Volatility Problem in Renewable Energy

**The Problem:**
Renewable energy is non-storable and volatile. Small and medium solar farms cannot access hedge products.
- Curtailment: excess energy drives prices negative.
- Volatility: empirical analysis shows extreme swings in spot prices.
- Access gap: current hedging instruments are centralized and inaccessible.

**The Solution:**
**SolarPunk Protocol** is a decentralized revenue floor engine on Polygon.
It lets solar producers buy energy-backed put options priced using physics-based data and settled on-chain.

---

## 2. What We Have Built (MVP)

We are not asking for funding to explore an idea. We are asking for funding to harden, tune, and deploy a working MVP.

### 2.1 The Solvency Engine (Pillar 3)
- **Artifact:** `contracts/SolarPunkOption.sol`
- **Function:** Options clearinghouse with margining and liquidation
- **Status:** Tested (10 Pillar 3 tests; 46 total across contracts). Deployment scripts ready; testnet pending.

### 2.2 The Pricing Oracle (Pillar 2)
- **Artifact:** `scripts/pillar3_engine.py`, `scripts/sensitivity_check.py`
- **Function:** Fair premium calculation using NASA irradiance data
- **Status:** Verified (<1.4% convergence error between models)

### 2.3 The Empirical Foundation (Pillar 1)
- **Artifact:** Research papers and thesis materials
- **Function:** Empirical justification for energy-anchored stability and derivatives

---

## 2.4 Baseline Stability Results (Current)
- 1000-day simulation baseline shows 6.5% in-band with PI tuning needed
- Avg price ~$2.33, volatility ~5% per day in the current run
- Grant scope includes stability tuning and guardrail calibration

---

## 2.6 Extended Capabilities (Multi-Energy Support) **[NEW]**

Since the initial MVP, we have extended the pricing framework beyond solar to include **Wind and Hydroelectric** assets, making SolarPunk a comprehensive **Renewable Energy Derivatives Protocol**.

### A. The "Multi-Energy" Engine
We have implemented physics-based valuation models for:
- **Wind Power:** Implements Betz Law ($P \propto v^3$) calibrated on NASA MERRA-2 wind speed/direction data. Configurable for turbine rotor diameter and hub height.
- **Hydro Power:** Implements hydrological flow dynamics ($P \propto Q \cdot h$) calibrated on NASA precipitation catchment data. Configurable for dam height and turbine efficiency.

### B. The "Self-Hosted" Oracle Microservice
We have delivered a **FastAPI-based Microservice** (`energy_derivatives/api/`) that allows any DAO or Solar Farm to run their own pricing node.
- **Capabilities:** Exposes endpoints for `/price/wind`, `/price/hydro`, and `/price/solar`.
- **Decentralization:** No centralized server dependency. Users can deploy the Docker container on their own infrastructure (local or cloud) to fetch NASA data and price assets autonomously.

---

## 2.7 Technical Readiness and Risk Controls

**Already implemented:**
- Oracle staleness gating and settlement finalization
- Weighted-median aggregation with quorum + deviation circuit breaker
- Reserve ratio enforcement for minting
- Stability pool mechanics with PI control

**Grant scope items:**
- Security audit and remediation
- Off-chain oracle data service + monitoring
- Stability tuning and market ops automation
- Pilot partner onboarding and liquidity incentives

---

## 3. Execution Plan (6 Months)

### Milestone 1: Security and Testnet Launch (Month 1-2)
- Deliverables: audit report, patched fixes, verified testnet deployment
- Success: zero critical/high issues open; health checks green

### Milestone 2: Multi-Energy Calibration & Oracle Service (Month 3-4)
- Deliverables: calibrated parameters for 5 wind/hydro sites; updated self-hosted oracle container
- Success: documented <2% pricing error against historical data for Wind/Hydro

### Milestone 3: Pilot + UI (Month 5-6)
- Deliverables: pilot agreement, on-chain pilot trade, UI/SDK for non-dev users
- Success: first on-chain hedge executed and documented

---

## 4. Budget (Tiered)

### Baseline Ask: $50,000
- Security audit: $15,000
- Oracle service + monitoring: $8,000
- Pilot setup + liquidity incentives: $12,000
- UI/SDK development: $10,000
- Ops/infra buffer: $5,000

### Stretch Add-On: +$25,000 (Total $75,000)
- **Multi-Energy Calibration (Wind/Hydro):** $10,000 (Data validation & model tuning)
- Extended liquidity incentives: $5,000
- Community + documentation: $5,000
- Academic publication + conferences: $5,000

---

## 5. Why Polygon
- Low fees make micro-hedges viable
- RWA focus aligns with energy derivatives
- Sustainability positioning aligns with climate impact

---

## 6. ROI for Polygon
- New asset class (energy derivatives) on-chain
- Real-world adoption in the renewable sector
- Open-source infrastructure for ReFi and RWA builders

---

## 7. Proof Points (Planned During Grant)
- Pilot outreach status and initial partner conversations
- Independent technical review (audit) once funded
- Testnet addresses + health check output after deployment

---

**Repository:** [GitHub link]
**Demo:** [Video link]
**Contact:** Christopher Ongko

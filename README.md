# SolarPunk Protocol ☀️⚡

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Network](https://img.shields.io/badge/network-Polygon-purple)]()
[![Status](https://img.shields.io/badge/status-Local%20MVP-yellow)]()

> **The "Bretton Woods" of the Energy Transition.**
> A decentralized protocol to hedge renewable energy volatility using physics-priced derivatives.

---

## 🚀 The Problem: 189% Volatility
Renewable energy is non-storable and extremely volatile.
*   **Solar Farms** face negative prices (curtailment) and cannot hedge.
*   **The Grid** suffers from instability because financial incentives are misaligned.
*   **Current Solution:** None. Wall Street doesn't touch small producers.

## 🛠 The Solution: Active Energy Anchoring
SolarPunk Protocol is a **Revenue Floor Engine** deployed on Polygon.
1.  **Pillar 1 (Empirics):** We use **NASA Satellite Data** (Irradiance) to model localized risk.
2.  **Pillar 2 (Pricing):** Our **Python Risk Engine** prices options where no market exists.
3.  **Pillar 3 (Execution):** Our **Smart Contract** enforces solvency via VaR-based margining.

---

## ⚡ Quick Start (For Judges & Devs)

We believe in "Don't Trust, Verify." Run our entire engine with one command:

```bash
./verify_all.sh
```

**Or run components individually:**

### 1. The Risk Engine (Off-Chain)
Calculates the "Fair Price" of a solar hedge using Weighted Median Oracles.
```bash
python3 scripts/pillar3_engine.py
```

### 2. The Smart Contract (On-Chain)
Deploys the Clearinghouse and simulates a settlement lifecycle.
```bash
npx hardhat test
```

### 3. The Dashboard (Frontend)
Launch the React DApp to see the user interface.
```bash
cd frontend && npm run dev
```

---

## 🧪 Evidence (For Grant Reviewers)

**What Works Today:**
- ✅ **Smart Contracts**: 46/46 tests passing ([test suite](test/))
- ⚙️ **Testnet Deployment**: Infrastructure ready ([scripts/deploy_amoy.sh](scripts/deploy_amoy.sh)). Pending public deployment due to faucet verification barriers (requires social media accounts). Available for immediate deployment upon request for technical review.
- ✅ **Pricing Engine**: Python library validated against 3 years NASA data ([spk-derivatives](https://github.com/spectating101/spk-derivatives))
- ✅ **Run Tests**: `npx hardhat test` (takes ~30 seconds)

**Repository Structure:**
- **This repo** ([solarpunk-coin/tree/master](https://github.com/Spectating101/solarpunk-coin/tree/master)): Smart contracts, frontend, grant materials (use master branch)
- **Supporting library** ([spk-derivatives](https://github.com/spectating101/spk-derivatives)): Python pricing engine (v0.4.0, pip-installable)

---

## 🏛 Architecture

| Component | Tech Stack | Responsibility |
| :--- | :--- | :--- |
| **Settlement Layer** | Solidity (EVM) | Holds collateral, enforces liquidations. |
| **Pricing Oracle** | Python / NumPy | Calculates premiums using NASA data. |
| **Interface** | React / Vite | User dashboard for hedging. |
| **Data Feed** | Chainlink / API | Ingests spot prices & solar irradiance. |

---

## 📄 Academic Foundation
This project is not a hackathon toy. It is based on a comprehensive **Master's Thesis**:
*   **[THESIS_DEFENSE_STRATEGY.md](./docs/thesis/THESIS_DEFENSE_STRATEGY.md):** How we solve the "GBM" and "Oracle" critiques.
*   **[PACKAGE_SUMMARY.md](./docs/thesis/PACKAGE_SUMMARY.md):** Mapping code to academic claims.

## 💰 Grant Proposal
We are applying for the Polygon Community Grant to move from **MVP** to **Pilot**.
*   **[Read the Proposal](./GRANT_PROPOSAL.md)**
*   **[Grant Sponsorship Package](./GRANT_SPONSORSHIP_PACKAGE.md)**
*   **[Funding Package Index](./FUNDING_PACKAGE_INDEX.md)**

### Reproducible grant evidence (before submission)
```bash
bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json
python3 scripts/build_grant_readiness_pack.py
```

## 🧭 Independent Project Operations
SolarPunk is now structured as an independent project with seven operating modes:
1. Research mode (empirical and economics outputs)
2. Protocol mode (contracts + oracle + frontend verification)
3. Funding mode (submission package generation)
4. Commercial mode (pilot term sheets and client artifacts)
5. Monetary-system mode (currency-protocol readiness checks)
6. Phase-gate mode (GO/NO_GO progression enforcement)
7. Evidence-validation mode (deployment + audit proof validation)

Canonical one-command operating cycle:
```bash
bash scripts/run_project_operating_cycle.sh
```

Project-level status output:
- `docs/project/PROJECT_READINESS_PACK.md`
- `docs/project/PROJECT_READINESS_PACK.json`
- `docs/project/PROJECT_DASHBOARD.html`
- `docs/project/MONETARY_SYSTEM_READINESS.md`
- `docs/project/PROTOCOL_PHASE_GATES.md`
- `docs/project/METER_ATTESTATION_BUNDLE.md`
- `docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md`
- `docs/project/SECURITY_AUDIT_VALIDATION.md`

Independent operations reference:
- `docs/project/PROJECT_OPERATIONS.md`
- `docs/project/MONETARY_SYSTEM_BLUEPRINT.md`

## 💼 Commercial Pilot Mode
SolarPunk can run as a revenue-facing risk desk for renewable operators:
1. Build project integrity artifacts:
```bash
bash scripts/run_project_operating_cycle.sh
```
2. Build indicative pilot term sheet from client profile:
```bash
python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json
```
3. Run the full commercial cycle:
```bash
bash scripts/run_commercial_cycle.sh
```

Commercial operations reference:
- `docs/commercial/COMMERCIAL_OPERATING_MODEL.md`

## 🪙 Monetary-System Readiness
To evaluate Solarpunk as a standalone energy-native monetary protocol:
```bash
python3 scripts/build_monetary_system_readiness.py
```
Or run the full cycle:
```bash
bash scripts/run_project_operating_cycle.sh
```

Strict phase-gate enforcement (example target phase 1):
```bash
bash scripts/run_protocol_gate.sh 1
```

Evidence validation commands:
```bash
python3 scripts/build_deployment_receipt.py
python3 scripts/confirm_deployment_onchain.py
python3 scripts/validate_deployment_receipt.py
python3 scripts/record_audit_update.py --status IN_PROGRESS
python3 scripts/render_security_audit_status.py
python3 scripts/validate_audit_status.py
```
Local deployment simulation (single command, persistent local chain):
```bash
bash scripts/simulate_local_deployment.sh
```
Policy references:
- `docs/project/DEPLOYMENT_EVIDENCE_POLICY.md`
- `docs/project/SECURITY_AUDIT_STATUS.json`
- `docs/project/PHASE3_UNLOCK_RUNBOOK.md`

## 🎯 For Grant Reviewers

**What We're Building With Funding:**
- 🚀 Mainnet deployment with $100K+ TVL target
- 🚀 Integration with 3 pilot solar farms (LOI outreach in progress)
- 🚀 Professional security audit (OpenZeppelin/ConsenSys)
- 🚀 Chainlink oracle integration for live price feeds

**6-Month Milestones:** See [GRANT_PROPOSAL.md](./GRANT_PROPOSAL.md) for detailed roadmap.

**Contact:**
- **Developer**: Christopher Ongko (s1133958@mail.yzu.edu.tw)
- **Location**: Taiwan (Indonesian national)
- **ORCID**: [0009-0007-9339-9098](https://orcid.org/0009-0007-9339-9098)

---

**© 2026 Christopher Ongko** | Built for the SolarPunk Future.

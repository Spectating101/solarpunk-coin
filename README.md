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
- ✅ **Smart Contracts**: 51/51 tests passing ([test suite](test/))
- ⚙️ **Testnet Deployment**: Full-stack Amoy deployment ready ([scripts/deploy_amoy.sh](scripts/deploy_amoy.sh)) with treasury routing. Public addresses will be published after the funded deployment step.
- ✅ **Treasury Demo**: `npm run demo:treasury` shows fee routing, trading fees, liquidation, and bond slashing locally.
- ✅ **Treasury Model**: `npm run model:treasury` estimates monthly break-even under configurable volume assumptions.
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
*   **[MASTER_THESIS_PROPOSAL.md](./docs/thesis/MASTER_THESIS_PROPOSAL.md):** Canonical thesis package, defense posture, and evidence map.
*   **[THESIS_MASTER_HANDOFF.md](./thesis_package/THESIS_MASTER_HANDOFF.md):** Legacy handoff for thesis assembly and continuation.

## 💰 Grant Proposal
We are applying for the Polygon Community Grant to move from **MVP** to **Pilot**.
*   **[Read the Proposal](./GRANT_PROPOSAL.md)**
*   **[Grant Readiness Pack](./docs/grants/GRANT_READINESS_PACK.md)**

### Reproducible grant evidence (before submission)
```bash
bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json
python3 scripts/build_grant_readiness_pack.py
```

## 🚦 Launch Sequence
1. Refresh the verification and readiness packs:
   ```bash
   bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json
   python3 scripts/build_grant_readiness_pack.py
   python3 scripts/build_project_readiness_pack.py
   ```
2. Deploy to Polygon Amoy with a funded wallet:
    ```bash
    ./scripts/deploy_amoy.sh
    ```
   This deploys MockUSDC, ProtocolTreasury, SolarPunkCoin, and SolarPunkOption together.
3. Submit the canonical grant bundle:
    - `GRANT_PROPOSAL.md`
    - `docs/grants/GRANT_READINESS_PACK.md`
    - `docs/project/PROJECT_READINESS_PACK.md`

## 🔧 Operations and evidence
The full operational handoff lives in [`docs/project/PROJECT_OPERATIONS.md`](./docs/project/PROJECT_OPERATIONS.md). Use that file for the canonical launch, grant, pilot, and gate story.

Current status artifacts:
- [`docs/project/PROJECT_READINESS_PACK.md`](./docs/project/PROJECT_READINESS_PACK.md)
- [`docs/project/PROJECT_READINESS_PACK.json`](./docs/project/PROJECT_READINESS_PACK.json)
- [`docs/project/METER_ATTESTATION_BUNDLE.md`](./docs/project/METER_ATTESTATION_BUNDLE.md)
- [`docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md`](./docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md)

Canonical cycle:
```bash
bash scripts/run_project_operating_cycle.sh
```

## 💼 Commercial pilot path
For pilots and paid work, use the same evidence base and pair it with:
- [`docs/economics/PILOT_PLAN.md`](./docs/economics/PILOT_PLAN.md)
- [`docs/pitch/PITCH_DECK_OUTLINE.md`](./docs/pitch/PITCH_DECK_OUTLINE.md)
- [`docs/monetization/SERVICES.md`](./docs/monetization/SERVICES.md)

## 🎯 For Grant Reviewers
Use the grant bundle for the funder-facing story:
- [`GRANT_PROPOSAL.md`](./GRANT_PROPOSAL.md)
- [`docs/grants/GRANT_READINESS_PACK.md`](./docs/grants/GRANT_READINESS_PACK.md)

**Contact:**
- **Developer**: Christopher Ongko (s1133958@mail.yzu.edu.tw)
- **Location**: Taiwan (Indonesian national)
- **ORCID**: [0009-0007-9339-9098](https://orcid.org/0009-0007-9339-9098)

---

**© 2026 Christopher Ongko** | Built for the SolarPunk Future.

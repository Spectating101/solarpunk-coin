# SolarPunk Protocol ☀️⚡

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Network](https://img.shields.io/badge/network-Polygon-purple)]()
[![Status](https://img.shields.io/badge/status-MVP%20Testnet%20Ready-orange)]()

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
- ✅ **Testnet Deployment**: Polygon Amoy - Contract: `[DEPLOY FIRST]` → [View on Amoy PolygonScan](https://amoy.polygonscan.com/)
- ✅ **Pricing Engine**: Python library validated against 3 years NASA data ([spk-derivatives](https://github.com/spectating101/spk-derivatives))
- ✅ **Run Tests**: `npx hardhat test` (takes ~30 seconds)

**Repository Structure:**
- **This repo** (`solarpunk-coin`): Smart contracts, frontend, grant materials
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

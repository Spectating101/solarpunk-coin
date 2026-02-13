# Chainlink BUILD Program Application
# SolarPunk Protocol - Renewable Energy Derivatives

**Application Portal:** https://chainlinkcommunity.typeform.com/BUILD
**Alt Portal:** https://docs.google.com/forms/d/e/1FAIpQLSciJKkVo28bN6RMsQa0Am8LpTwhOgN5gIeWZZ8rflUDzOHN-g/viewform
**Program Terms:** https://chainlinklabs.com/build-terms
**Status:** Rolling applications (no deadline)

---

## PROJECT INFORMATION

**Project Name:** SolarPunk Protocol

**One-Line Description:** Decentralized derivatives protocol enabling renewable energy producers to hedge revenue volatility using physics-calibrated pricing and on-chain settlement.

**Category:** DeFi / Real World Assets / Climate

**Website:** https://github.com/Spectating101/solarpunk-coin

**Current Stage:** Local MVP (46/46 smart contract tests, 8/8 pricing engine tests, testnet deployment ready)

---

## PROJECT DESCRIPTION (For Form Field)

SolarPunk Protocol is a derivatives infrastructure for renewable energy markets. Solar farms, wind operators, and hydroelectric plants face 189% annual price volatility but have zero access to hedging tools - they're too small for Wall Street and too niche for existing DeFi.

We solve this with three components:

1. **Pricing Oracle**: A Python engine calibrated on NASA POWER satellite data that computes fair option premiums for any location on Earth. Supports binomial trees, Monte Carlo simulation, mean-reversion (Ornstein-Uhlenbeck), and jump-diffusion (Merton) models. Published as a pip-installable package (v0.5.0).

2. **Settlement Layer**: Solidity smart contracts implementing a clearinghouse with VaR-based margining, auto-liquidation, and a PI-controlled stablecoin (SPK). 46/46 unit tests passing. Validated via 1000-day multi-agent simulation (93.2% peg stability under normal conditions, 89.5% under combined stress).

3. **Data Integration**: The protocol fundamentally depends on reliable off-chain data feeds for energy spot prices, solar irradiance, and wholesale electricity rates. This is where Chainlink is architecturally essential - not optional.

**Why we cannot function without Chainlink:** Energy derivatives require trusted, tamper-proof price feeds. There are no standardized energy price oracles today. Our protocol needs Chainlink to bridge the gap between NASA satellite data, wholesale electricity markets, and on-chain settlement.

---

## CHAINLINK INTEGRATION (Critical Section)

### Products We Will Use

| Chainlink Product | Our Use Case | Integration Depth |
|---|---|---|
| **Data Feeds** | Energy spot price feeds (solar irradiance, wholesale electricity prices, REC prices) | CORE - primary oracle dependency; protocol cannot function without it |
| **CCIP** | Cross-chain derivative settlement across Polygon, Arbitrum, Base | HIGH - enables global energy markets |
| **Automation** | Automated settlement triggers, PI controller supply adjustments, margin call execution | HIGH - replaces manual keeper infrastructure |
| **VRF** | Fair randomization for derivative settlement ordering, preventing front-running | MEDIUM - ensures fair execution |
| **Functions** | Off-chain computation for Python pricing engine results, NASA API data fetching | MEDIUM - bridges our pricing oracle to on-chain contracts |

**Total Products: 5** (most BUILD projects use 1-2)

### Custom Data Feed Opportunity

**Energy price data feeds do not currently exist as standard Chainlink feeds.** If SolarPunk joins BUILD, this creates a new Chainlink product offering:

- Solar irradiance feeds (sourced from NASA POWER API)
- Wholesale electricity spot prices (sourced from grid operator APIs: ERCOT, CAISO, NEM)
- Renewable Energy Certificate (REC) prices
- Regional capacity factors

This custom DON (Decentralized Oracle Network) would benefit the entire Chainlink ecosystem, not just SolarPunk.

---

## TOKEN INFORMATION

**Token:** SPK (SolarPunkCoin)

**Type:** Energy-backed stablecoin with PI control mechanism

**Total Supply:** 1,000,000,000 (1B cap, dynamic supply via mint/burn)

**Token Utility:**
- Medium of exchange for energy derivative settlement
- Collateral for margin positions
- Governance over protocol parameters

**Chainlink Commitment:** 3% of total token supply (30,000,000 SPK), vested over 5 years to Chainlink service providers. This follows precedent from Dolomite (3%), Folks Finance (3%), and Brickken (3.5%).

---

## TEAM

**Christopher Ongko** - Founder & Lead Developer
- Master's student, Yuan Ze University, Taiwan
- Research: Energy-backed monetary systems, on-chain derivatives
- ORCID: 0009-0007-9339-9098
- Skills: Solidity, Python (NumPy/SciPy), React, Hardhat
- Published: spk-derivatives pricing library (PyPI)

**Advisory Support:**
- Finance professor (thesis advisor) - derivative pricing validation
- Control systems engineer - PI controller tuning verification

---

## WHAT WE'VE BUILT (Evidence)

| Component | Status | Evidence |
|---|---|---|
| Smart Contracts | 46/46 tests passing | `npx hardhat test` |
| Pricing Engine | 8/8 tests passing | `pytest energy_derivatives/tests/` |
| Peg Simulation | 93.2% in-band (baseline) | `python3 scripts/simulate_peg.py` |
| Economic Simulation | All 6 stress tests passed | `python3 scripts/simulate_economy.py` |
| API Service | Live with rate limiting, CORS | `uvicorn energy_derivatives.api.main:app` |
| Docker Deployment | Ready | `docker build -t solarpunk-api .` |
| Frontend | React/Vite with wallet integration | `cd frontend && npm run dev` |

---

## ROADMAP WITH CHAINLINK

**Month 1-2: Integration Foundation**
- Deploy to Polygon testnet (Amoy)
- Integrate Chainlink Data Feeds for energy price data
- Implement Chainlink Automation for settlement triggers
- Set up custom DON specification for energy data

**Month 3-4: Cross-Chain & Functions**
- Implement CCIP for multi-chain settlement
- Deploy Chainlink Functions for off-chain pricing oracle
- Launch VRF integration for fair settlement ordering
- Begin security audit process

**Month 5-6: Mainnet & Pilot**
- Deploy to Polygon mainnet
- Execute first pilot hedge with a solar farm operator
- Publish custom energy data feed specification for Chainlink ecosystem
- Launch public API with Chainlink-verified data

---

## WHY CHAINLINK BUILD (For "Why" Field)

SolarPunk Protocol represents a new category for the Chainlink ecosystem: **energy commodity derivatives on-chain**. This is significant because:

1. **New data vertical**: Energy price feeds don't exist in Chainlink's current offering. Our integration creates a template for energy data DONs that serves the entire ecosystem.

2. **Deep integration**: We use 5 Chainlink products (Data Feeds, CCIP, Automation, VRF, Functions) - more than most BUILD applicants. This isn't bolted-on integration; Chainlink is our core infrastructure.

3. **Real-world impact**: Renewable energy producers lose $500M+ annually to price volatility they can't hedge. Chainlink + SolarPunk = the oracle infrastructure that makes energy derivatives possible.

4. **Academic rigor**: Unlike typical DeFi projects, our pricing models are based on published research, validated against 3 years of NASA satellite data, and tested via multi-agent economic simulation.

5. **ESG narrative**: Chainlink has published research with Tecnalia on clean energy transition. SolarPunk directly advances that mission.

---

## COPY-PASTE READY: FORM RESPONSES

### "Describe your project" (Short)
SolarPunk Protocol is a decentralized derivatives infrastructure for renewable energy hedging. We use NASA satellite data to calibrate location-specific risk models, price energy options using institutional-grade methods (binomial trees, Monte Carlo, mean-reversion), and settle hedges on-chain via Solidity smart contracts with VaR-based margining. 46/46 contract tests and 8/8 pricing engine tests passing.

### "How do you use Chainlink?" (Medium)
We plan to integrate 5 Chainlink products: (1) Data Feeds for energy spot prices and solar irradiance - our core oracle dependency; (2) CCIP for cross-chain derivative settlement; (3) Automation for settlement triggers and margin call execution; (4) VRF for fair settlement ordering; (5) Functions for off-chain pricing computation via our Python engine. Critically, energy price data feeds don't exist as standard Chainlink feeds today - our integration would create a new data vertical for the ecosystem.

### "Token commitment"
3% of total SPK supply (30M tokens), vested over 5 years to Chainlink service providers.

---

## BEFORE SUBMITTING CHECKLIST

- [ ] Review terms at https://chainlinklabs.com/build-terms
- [ ] Ensure GitHub repo is public and links work
- [ ] Run `npx hardhat test` to confirm 46/46 passing
- [ ] Run `pytest energy_derivatives/tests/` to confirm 8/8 passing
- [ ] Have token supply allocation document ready
- [ ] Proofread all form fields
- [ ] Submit via Typeform at https://chainlinkcommunity.typeform.com/BUILD

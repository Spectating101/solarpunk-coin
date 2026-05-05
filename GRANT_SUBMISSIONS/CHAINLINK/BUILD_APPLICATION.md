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

**Public Demo:** https://spectating101.github.io/solarpunk-coin/demo/

**Current Stage:** Live Sepolia testnet pilot. 79/79 smart contract tests passing (50 SPK + 21 Option + 8 Treasury). All 3 core contracts deployed and source-verified. Safe multisig admin handoff complete with 24h governance timelock active. Independent code review complete (Codex, April 2026) with all 5 findings fixed. NASA POWER → Sepolia keeper running daily on GitHub Actions cron. Python pricing library v0.5.0 published.

---

## PROJECT DESCRIPTION (For Form Field)

SolarPunk Protocol is a derivatives infrastructure for renewable energy markets. Solar farms face 200%+ annual price volatility but have zero access to hedging tools - they're too small for legacy finance and too niche for generic DeFi.

We solve this with three components:

1. **Pricing Oracle**: A Python engine (v0.5.0) calibrated on NASA POWER satellite data that computes risk-bounded premiums. Supports binomial trees, Monte Carlo, and jump-diffusion (Merton) models tailored for energy price spikes.

2. **Settlement Layer**: Solidity contracts (0.8.20) implementing a clearinghouse with margin enforcement, auto-liquidation, and a PI-controlled stablecoin (SPK). Live Sepolia is currently configured at 150% initial / 75% maintenance margin; our stress-tested next pilot target is 250% / 125%. 79/79 tests passing. Publicly deployed to Sepolia.

3. **Data Integration**: Our protocol fundamentally depends on reliable off-chain data feeds. We have already deployed a `ChainlinkOracleAdapter` on Sepolia to bridge NASA satellite truth to on-chain settlement.

**Why we cannot function without Chainlink:** Energy derivatives require trusted, physics-anchored data. Our recent stress tests prove that "Gap Risk" (price jumps between updates) is the primary threat to solvency. Chainlink's low-latency automation and data feeds are not optional; they are the protocol's primary security layer.

---

## CHAINLINK INTEGRATION (Critical Section)

### Products We Will Use

| Chainlink Product | Our Use Case | Integration Status |
|---|---|---|
| **Data Feeds** | Energy spot price feeds + reading any future AggregatorV3 feed (solar irradiance, wholesale electricity) | **LIVE ON SEPOLIA** — `ChainlinkOracleAdapter.sol` deployed at 0x... reads AggregatorV3Interface, normalises decimals to 1e18, includes manual fallback path for energy price |
| **Automation** | Replace our current GitHub Actions cron keeper with on-chain triggers for daily oracle pushes, margin calls, expiry settlements | **NEXT MILESTONE** (Months 1-2 of grant) |
| **Functions** | Off-chain computation for direct NASA POWER API fetch with verifiable execution; eliminates the centralised keeper | **NEXT MILESTONE** (Months 1-2) |
| **CCIP** | Cross-chain derivative settlement when we expand from Arbitrum to additional L2s | **PLANNED** (Months 4-6) |
| **VRF** | Fair settlement-order randomisation if/when we move to a continuous (rather than European) settlement model | **CONTINGENT** on v2 design |

**Honest framing:** Today, Data Feeds integration is live (adapter + manual fallback). The other four products are planned milestones, not present claims. Our keeper is currently a cron — replacing it with Automation + Functions is exactly what BUILD support enables, and is the integration we are most committed to.

### Custom Data Feed Opportunity

**Energy price data feeds do not currently exist as standard Chainlink feeds.** If SolarPunk joins BUILD, this creates a new Chainlink product offering:

- Solar irradiance feeds (sourced from NASA POWER API)
- Wholesale electricity spot prices (sourced from grid operator APIs: ERCOT, CAISO, NEM)
- Renewable Energy Certificate (REC) prices
- Regional capacity factors

This custom DON (Decentralized Oracle Network) would benefit the entire Chainlink ecosystem, not just SolarPunk.

---

## TOKEN INFORMATION

**Stablecoin:** SPK (SolarPunkCoin) — energy-backed peg-controlled stablecoin. NOT a governance/utility token; mint/burn supply is determined algorithmically by the PI controller against the energy peg, so allocating SPK supply to a third party is structurally inconsistent with the peg mechanism.

**Governance / Utility Token (planned):** A separate $SPNK governance and fee-share token will be introduced at L2 mainnet launch (Month 6 of grant). Its supply will be fixed and unrelated to the SPK peg.

**Chainlink Commitment (BUILD-aligned):**

We are open to either of the structures BUILD has used with prior cohorts, whichever the program prefers:

- **Option A — Token allocation:** 3% of $SPNK total supply (governance/utility token), vested over 5 years to Chainlink service providers. This mirrors Dolomite (3%), Folks Finance (3%), and Brickken (3.5%) precedents.
- **Option B — Protocol fee share:** 5% of all settlement and option-trading fees collected on the protocol, paid in stablecoins (USDC) directly to Chainlink-designated treasury, in perpetuity.

We default to Option A unless BUILD prefers Option B. Either way, the commitment is to a non-peg-bearing instrument so the SPK peg mechanism remains intact.

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
| Smart Contracts | 79/79 tests passing | `npx hardhat test` (50 SPK + 21 Option + 8 Treasury) |
| Independent Code Review | 5 findings fixed | Codex review, April 2026 — regression tests added |
| Testnet Deploy | All 3 contracts source-verified | SolarPunkCoin 0x1D55C6...407F, SolarPunkOption 0xe40A88...4104, ProtocolTreasury 0x138e79...dd2c |
| Multisig + Governance | Active | Safe 0xB95586...818A holds DEFAULT_ADMIN_ROLE; 24h timelock on all parameter changes |
| Pricing Engine | 8/8 tests passing | `pytest energy_derivatives/tests/` |
| Live Oracle Keeper | Daily NASA POWER push | GitHub Actions cron, 01:00 UTC, source-hash provenance |
| Maturity Report | 90-day stress test, 80.24% unassisted survival | `PROTOCOL_MATURITY_REPORT_2026.md` |
| API Service | Live v0.5.0 (PyPI) | SaaS-ready with auth + rate limiting |
| Frontend | React/Vite | Live Sepolia reads, 30s polling |

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
SolarPunk Protocol is a decentralized derivatives infrastructure for renewable energy hedging, live on Ethereum Sepolia. We use NASA POWER satellite data to calibrate location-specific risk models, price energy options using institutional-grade methods (binomial trees, Monte Carlo, jump-diffusion), and settle hedges on-chain via Solidity smart contracts with VaR-based margining. Live Sepolia is currently configured at 150% IM / 75% MM, with 250% IM / 125% MM established as the next risk-boxed pilot target in the stress memo. 79/79 contract tests + pricing engine tests passing. Source-verified deployment with Safe multisig admin and 24h governance timelock, running a live daily NASA → on-chain oracle keeper.

### "How do you use Chainlink?" (Medium)
Today: ChainlinkOracleAdapter is deployed on Sepolia, normalising any AggregatorV3 feed to 1e18 with manual fallback for energy price. Planned during the BUILD program: (1) Automation to replace our current GitHub Actions cron keeper with on-chain triggers for daily oracle updates and expiry settlements; (2) Functions to fetch NASA POWER data with verifiable execution, removing the centralised keeper entirely; (3) CCIP for cross-chain settlement once we expand beyond a single L2; (4) VRF if/when we move to continuous (rather than European) settlement. Energy price feeds don't currently exist as standard Chainlink feeds — our integration would create a new energy-data vertical for the broader ecosystem.

### "Token commitment"
3% of $SPNK governance/utility token supply (planned at L2 mainnet launch), vested over 5 years to Chainlink service providers — OR equivalent 5% of protocol fees in stablecoin, BUILD's preference. SPK stablecoin supply is not pledged because it is algorithmically peg-controlled.

---

## BEFORE SUBMITTING CHECKLIST

- [ ] Review terms at https://chainlinklabs.com/build-terms
- [ ] Ensure GitHub repo is public and links work
- [ ] Run `npx hardhat test` to confirm 79/79 passing
- [ ] Run `pytest energy_derivatives/tests/` to confirm 8/8 passing
- [ ] Have token supply allocation document ready
- [ ] Proofread all form fields
- [ ] Submit via Typeform at https://chainlinkcommunity.typeform.com/BUILD

# Chainlink BUILD Program Application
# SolarPunk Protocol - Renewable Energy Derivatives

**Application Portal:** https://chainlinkcommunity.typeform.com/BUILD
**Build on Ethereum:** https://chain.link/economics/build-program/build-ethereum
**Alt Portal:** https://docs.google.com/forms/d/e/1FAIpQLSciJKkVo28bN6RMsQa0Am8LpTwhOgN5gIeWZZ8rflUDzOHN-g/viewform
**Program Terms:** https://chainlinklabs.com/build-terms
**Status:** Rolling applications (no deadline)

---

## PROJECT INFORMATION

**Project Name:** SolarPunk Protocol

**One-Line Description:** Oracle-verified renewable-energy infrastructure where signed surplus kWh can mint SPK and support future energy hedging products.

**Category:** DeFi / Real World Assets / Climate

**Best Program Lane:** Chainlink BUILD, preferably Build on Ethereum if available.

**Website:** https://github.com/Spectating101/solarpunk-coin

**Public Demo:** https://spectating101.github.io/solarpunk-coin/

**Current Stage:** Live Sepolia testnet prototype. 96/96 smart contract tests passing. Five legacy contracts are source-verified, and the fresh attested SPK proof stack has three additional source-verified contracts. The public SPK proof mints 130.1697 SPK from a signed meter bundle with 2,606.7 kWh accepted surplus, and a read-only Sepolia readback confirms the consumed attestation/source hashes. EnergyRevenueFloor pilot module is implemented but not deployed yet. Safe admin handoff is complete for the three core contracts, with 24h governance timelock active. Independent code review complete (Codex, April 2026) with all 5 findings fixed. NASA POWER -> Sepolia keeper running daily on GitHub Actions cron. Python pricing library published.

---

## PROJECT DESCRIPTION (For Form Field)

SolarPunk Protocol is a prototype for renewable-energy data and derivatives infrastructure. Small and mid-sized renewable operators face production and revenue volatility, but the hedging tools used in large commodity markets are often inaccessible, opaque, or poorly matched to local solar-production risk.

We solve this with three components:

1. **Pricing and Margin Engine**: A Python engine calibrated with NASA POWER satellite data and stress scenarios. Supports binomial trees, Monte Carlo, and jump-diffusion style analysis for risk-bounded pilot parameters.

2. **Settlement Layer**: Solidity contracts (0.8.20) implementing replay-protected SPK attestation minting, a clearinghouse with margin enforcement, auto-liquidation, and a PI-controlled stablecoin (SPK). Live Sepolia is currently configured at 150% initial / 75% maintenance margin; our stress-tested next pilot target is 250% / 125%. 96/96 tests passing. Publicly deployed to Sepolia.

3. **Data Integration**: Our protocol fundamentally depends on reliable off-chain data feeds. We have already deployed a `ChainlinkOracleAdapter` on Sepolia and run a daily NASA POWER -> Sepolia keeper with committed transaction artifacts.

**Why Chainlink matters:** Energy derivatives require trusted, physics-anchored data and reliable automation. Our stress work identifies gap risk, stale data, and update latency as major threats. Chainlink Automation and Functions are the natural next step from the current GitHub Actions keeper toward a more production-like oracle path.

---

## CHAINLINK INTEGRATION (Critical Section)

### Products We Will Use

| Chainlink Product | Our Use Case | Integration Status |
|---|---|---|
| **Data Feeds** | Reading AggregatorV3Interface-compatible feeds and future energy/climate feeds | **LIVE ON SEPOLIA** — `ChainlinkOracleAdapter.sol` reads AggregatorV3Interface, normalises decimals to 1e18, and includes manual fallback path for energy price |
| **Automation** | Replace our current GitHub Actions cron keeper with on-chain triggers for daily oracle pushes, margin calls, expiry settlements | **NEXT MILESTONE** (Months 1-2 of grant) |
| **Functions** | Off-chain computation for direct NASA POWER API fetch with verifiable execution; eliminates the centralised keeper | **NEXT MILESTONE** (Months 1-2) |
| **CCIP** | Cross-chain derivative settlement when we expand from Arbitrum to additional L2s | **PLANNED** (Months 4-6) |
| **VRF** | Fair settlement-order randomisation if/when we move to a continuous (rather than European) settlement model | **CONTINGENT** on v2 design |

**Honest framing:** Today, Data Feeds integration is live (adapter + manual fallback). The other four products are planned milestones, not present claims. Our keeper is currently a cron — replacing it with Automation + Functions is exactly what BUILD support enables, and is the integration we are most committed to.

### Custom Data Feed Opportunity

**Energy price and climate data feeds are still an emerging oracle category.** If SolarPunk joins BUILD, it could help define requirements for a broader Chainlink energy-data vertical:

- Solar irradiance feeds (sourced from NASA POWER API)
- Wholesale electricity spot prices (sourced from grid operator APIs: ERCOT, CAISO, NEM)
- Renewable Energy Certificate (REC) prices
- Regional capacity factors

This custom DON (Decentralized Oracle Network) would benefit the entire Chainlink ecosystem, not just SolarPunk.

---

## TOKEN INFORMATION

**Stablecoin prototype:** SPK (SolarPunkCoin) — energy-indexed peg-control research prototype. It is not appropriate to allocate SPK supply to a third party because supply is part of the peg-control mechanism.

**Governance / Utility Token (possible future design):** A separate $SPNK governance and fee-share token may be introduced only after legal review, security review, and a real L2 pilot decision. Its supply would be fixed and unrelated to the SPK peg.

**Chainlink Commitment (BUILD-aligned):**

We are open to discussing a BUILD-aligned commitment only after confirming the legal/token structure. Two possible structures:

- **Option A — Token allocation:** a future $SPNK governance/utility token allocation, vested over time to Chainlink service providers, only if/when such a token is legally and technically appropriate.
- **Option B — Protocol fee share:** 5% of all settlement and option-trading fees collected on the protocol, paid in stablecoins (USDC) directly to Chainlink-designated treasury, in perpetuity.

Either way, the commitment would be to a non-peg-bearing instrument or fee stream so the SPK peg mechanism remains intact.

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
| Smart Contracts | 96/96 tests passing | `npx hardhat test` |
| SPK Attested Mint | Public Sepolia proof live | 4 signed readings, 2 accepted, 2 rejected, 2,606.7 kWh accepted surplus, 130.1697 SPK minted |
| Public Proof Readback | 7/7 checks passing | `docs/product/SPK_PUBLIC_READBACK.md` confirms tx success, consumed attestation hash, consumed source hash, recipient balance, and cumulative surplus |
| Independent Code Review | 5 findings fixed | Codex review, April 2026 — regression tests added |
| Testnet Deploy | 5 legacy contracts + 3 attested proof contracts source-verified | SolarPunkCoin legacy 0x1D55C6...407F; attested SPK proof 0x8ceDa1...820 |
| Multisig + Governance | Active | Safe 0xB95586...818A holds DEFAULT_ADMIN_ROLE; 24h timelock on all parameter changes |
| Pricing Engine | 8/8 tests passing | `pytest energy_derivatives/tests/` |
| Live Oracle Keeper | Daily NASA POWER push | GitHub Actions cron, 01:00 UTC, source-hash provenance |
| Maturity Report | 90-day stress test, 80.24% unassisted survival | `PROTOCOL_MATURITY_REPORT_2026.md` |
| API Service | Live v0.5.0 (PyPI) | SaaS-ready with auth + rate limiting |
| Frontend | React/Vite | Live Sepolia reads, 30s polling |

---

## ROADMAP WITH CHAINLINK

**Month 1-2: Automation + Functions Prototype**
- Specify the current NASA POWER keeper flow as a Chainlink Automation / Functions migration target.
- Prototype Automation-compatible triggers for daily oracle updates and expiry checks.
- Prototype Functions-compatible NASA POWER fetch and normalization path.
- Publish stale-data and oracle-failure policy.

**Month 3-4: Oracle Hardening + Review**
- Integrate the hardened oracle path into Sepolia contracts or a new test deployment.
- Add monitoring and alerting around missed updates, stale data, and abnormal index movement.
- Begin external smart contract review or audit preparation.

**Month 5-6: L2 Pilot Readiness**
- Publish L2 deployment analysis for Arbitrum / Optimism.
- Deploy a capped test environment if audit/review status supports it.
- Publish energy-data feed specification for the broader Chainlink ecosystem.
- Continue operator/advisor discovery; do not claim production pilot until signed.

---

## WHY CHAINLINK BUILD (For "Why" Field)

SolarPunk Protocol represents a new category for the Chainlink ecosystem: **energy commodity derivatives on-chain**. This is significant because:

1. **New data vertical**: Energy price feeds don't exist in Chainlink's current offering. Our integration creates a template for energy data DONs that serves the entire ecosystem.

2. **Deep integration path**: We already have an AggregatorV3-compatible adapter and a live keeper. Automation and Functions are the immediate next milestones; CCIP and VRF are later design options, not present claims.

3. **Real-world impact path**: Renewable energy needs transparent, trustworthy data infrastructure before serious on-chain hedging can exist. Chainlink + SolarPunk would test that path in a public, inspectable way.

4. **Academic rigor**: The work connects a finance master's thesis, NASA satellite data, pricing models, stress testing, smart contracts, and a public proof dashboard.

5. **ESG narrative**: Chainlink has published research with Tecnalia on clean energy transition. SolarPunk directly advances that mission.

---

## COPY-PASTE READY: FORM RESPONSES

### "Describe your project" (Short)
SolarPunk Protocol is renewable-energy data infrastructure live on Ethereum Sepolia. Registered meter readings can be verified into a surplus bundle, signed by an oracle role, and minted into SPK through a replay-protected contract path; the current public proof mints 130.1697 SPK from 2,606.7 kWh accepted surplus and has a read-only Sepolia readback confirming consumed source/attestation hashes. The repo also uses NASA POWER satellite data to calibrate location-specific risk models and price energy options using binomial trees, Monte Carlo, and stress tests. 96/96 contract tests passing. Source-verified deployments, Safe multisig admin on the legacy core contracts, 24h governance timelock, and a live daily NASA -> on-chain oracle keeper.

### "How do you use Chainlink?" (Medium)
Today: ChainlinkOracleAdapter is deployed on Sepolia, normalising any AggregatorV3 feed to 1e18 with manual fallback for energy price. Planned during the BUILD program: (1) Automation to replace our current GitHub Actions cron keeper with on-chain triggers for daily oracle updates and expiry settlements; (2) Functions to fetch NASA POWER data with verifiable execution, removing the centralised keeper entirely; (3) CCIP for cross-chain settlement once we expand beyond a single L2; (4) VRF if/when we move to continuous (rather than European) settlement. Energy price feeds don't currently exist as standard Chainlink feeds — our integration would create a new energy-data vertical for the broader ecosystem.

### "Token commitment"
We cannot pledge SPK stablecoin supply because SPK is part of the peg-control prototype. We are open to discussing either a future non-peg-bearing $SPNK governance/utility token allocation or an equivalent protocol-fee share, subject to legal review and BUILD's preferred structure.

---

## BEFORE SUBMITTING CHECKLIST

- [ ] Review terms at https://chainlinklabs.com/build-terms
- [ ] Ensure GitHub repo is public and links work
- [ ] Run `npx hardhat test` to confirm 96/96 passing
- [ ] Run `npm run proof:spk-public-readback` to refresh the public readback
- [ ] Run `pytest energy_derivatives/tests/` to confirm 8/8 passing
- [ ] Prepare token/fee-share discussion note without promising SPK supply
- [ ] Proofread all form fields
- [ ] Submit via Typeform at https://chainlinkcommunity.typeform.com/BUILD

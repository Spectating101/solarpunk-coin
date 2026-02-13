# Ethereum Foundation Academic Grants Application
# SolarPunk Protocol - Energy-Backed Settlement Infrastructure

**Application Portal:** https://esp.ethereum.foundation/academic-grants
**Alternative:** https://esp.ethereum.foundation/applicants (general inquiries)
**Office Hours:** https://esp.ethereum.foundation/applicants/office-hours/apply
**Contact:** academic-grants@ethereum.org

---

## IMPORTANT: ELIGIBILITY NOTE

The **EF PhD Fellowship** (deadline April 1, 2026) requires active PhD enrollment - Christopher is a master's student, so **not eligible for the PhD Fellowship specifically**.

However, the **EF Academic Grants Round** accepts master's students with supervisor support. This document is prepared for that program. The next round is expected to open in 2026 with $1.5-2M in available funding.

**Recommended immediate action:**
1. Email academic-grants@ethereum.org to ask when the next Academic Grants Round opens
2. Request office hours at https://esp.ethereum.foundation/applicants/office-hours/apply
3. If Christopher enrolls in a PhD program before April 1, the PhD Fellowship also becomes viable

---

## PROPOSAL SUMMARY

**Title:** Programmable Settlement Infrastructure for Energy Derivative Markets: A Mechanism Design Approach

**Research Category:** Economics & Game Theory / Mechanism Design

**Principal Investigator:** Christopher Ongko, M.S. Candidate
**Institution:** Yuan Ze University (YZU), Taiwan
**ORCID:** 0009-0007-9339-9098
**Email:** s1133958@mail.yzu.edu.tw

**Requested Amount:** $30,000 - $50,000 USD (12-month project)

---

## ABSTRACT (250 words)

This research investigates how Ethereum's programmable settlement infrastructure can reduce operational friction in energy derivative markets - a domain where no efficient hedging tools exist for small-to-medium renewable energy producers.

We present SolarPunk Protocol, an open-source implementation of a decentralized clearinghouse for energy options, combining mechanism design principles with control theory for stablecoin peg management. The protocol uses NASA satellite data to calibrate location-specific risk models, prices derivatives via binomial trees and Monte Carlo simulation, and settles contracts on-chain via VaR-based margining.

Our contribution is threefold:

1. **Mechanism Design**: We formalize the incentive structure of a decentralized energy derivatives clearinghouse, proving that VaR-based margining with auto-liquidation creates a strategy-proof mechanism where rational participants maintain system solvency.

2. **Empirical Validation**: We demonstrate through multi-agent simulation (35 agents, 6 stress scenarios, 1000-day horizons) that PI-controlled supply adjustment achieves 93.2% peg stability under normal conditions and survives all tested stress scenarios including coordinated speculative attacks.

3. **Implementation**: We provide working Solidity smart contracts (46/46 tests), a Python pricing library (8/8 tests, pip-installable), and a FastAPI service - all open-source under MIT license.

This work contributes to the Ethereum ecosystem by demonstrating how programmable settlement can unlock an entirely new asset class (energy derivatives) that traditional financial infrastructure cannot serve, while providing formal analysis of the mechanism design properties that make it viable.

---

## RESEARCH QUESTIONS

1. **Mechanism Design**: Under what conditions does a decentralized energy derivatives clearinghouse achieve strategy-proofness? What are the necessary margin ratios and liquidation thresholds?

2. **Control Theory**: Can PI-controlled supply adjustment maintain stablecoin peg stability in the presence of adversarial agents? What are the theoretical bounds on peg deviation?

3. **Empirical**: How do calibrated energy derivative prices compare to theoretical Black-Scholes prices, and what is the impact of mean-reversion and jump-diffusion on pricing accuracy?

4. **Infrastructure**: What are the gas cost, latency, and throughput characteristics of on-chain energy derivative settlement on Ethereum L2s?

---

## METHODOLOGY

### Phase 1: Formal Analysis (Months 1-3)
- Formalize the clearinghouse mechanism as a Bayesian game
- Prove strategy-proofness of VaR-based margining
- Derive theoretical bounds on PI controller stability
- Literature review: mechanism design for automated market makers (Roughgarden, 2020), control theory for algorithmic stablecoins (Klages-Mundt et al., 2020)

### Phase 2: Empirical Validation (Months 4-8)
- Extend multi-agent simulation with adversarial agents
- Calibrate models against historical ERCOT/CAISO/NEM spot price data
- Compare pricing accuracy: energy-specific models vs. standard Black-Scholes
- Measure gas costs and settlement latency on Polygon, Arbitrum, Base

### Phase 3: Publication & Dissemination (Months 9-12)
- Paper 1: "Strategy-Proof Energy Derivatives on Ethereum: A Mechanism Design Analysis" (target: ACM CCS or Financial Cryptography)
- Paper 2: "PI-Controlled Stablecoins: Formal Analysis and Multi-Agent Simulation" (target: DeFi workshop at IEEE S&P)
- Open-source all research artifacts (code, data, simulation scripts)

---

## EXISTING WORK (What's Already Built)

| Artifact | Status | Location |
|---|---|---|
| SolarPunkCoin.sol (stablecoin) | 36/36 tests | contracts/SolarPunkCoin.sol |
| SolarPunkOption.sol (clearinghouse) | 10/10 tests | contracts/SolarPunkOption.sol |
| Pricing engine (Python) | 8/8 tests, v0.5.0 | energy_derivatives/spk_derivatives/ |
| Multi-agent simulation | 6 scenarios, all pass | scripts/simulate_economy.py |
| Peg stabilization sim | 78.6% in-band (basic), 93.2% (multi-agent) | scripts/simulate_peg.py |
| FastAPI service | Live with auth + rate limiting | energy_derivatives/api/main.py |
| Thesis materials | Defense strategy + bibliography | docs/thesis/ |

**GitHub:** https://github.com/Spectating101/solarpunk-coin
**Python Package:** spk-derivatives (PyPI)

---

## RELEVANCE TO ETHEREUM

This research directly addresses Ethereum's value proposition as **programmable settlement infrastructure**:

1. **New Asset Class**: Energy derivatives are a $500M+ annual market gap. Ethereum L2s can serve this market because traditional infrastructure won't.

2. **Mechanism Design Contribution**: Our formal analysis of VaR-based margining and auto-liquidation provides reusable theory for any DeFi derivatives protocol.

3. **Control Theory for DeFi**: The PI controller analysis provides formal tools for evaluating algorithmic stablecoin stability - relevant beyond our specific application.

4. **Real-World Data Integration**: Our oracle design for energy prices demonstrates how Ethereum can interface with physical-world data feeds, extending the RWA narrative.

---

## BUDGET

| Item | Amount | Justification |
|---|---|---|
| PI researcher stipend | $18,000 | 12 months at $1,500/month (supplementing existing funding) |
| Testnet/mainnet deployment costs | $3,000 | Gas for deployment, testing, and pilot transactions |
| Data acquisition | $2,000 | Historical energy market data (ERCOT, CAISO APIs) |
| Conference travel | $4,000 | 1-2 conferences for paper presentation |
| Security audit (partial) | $5,000 | Contribution toward professional audit |
| Equipment/cloud | $3,000 | Compute for Monte Carlo simulations |
| **Total** | **$35,000** | |

---

## DELIVERABLES

1. Two academic papers (open-access, submitted to peer-reviewed venues)
2. Updated open-source codebase with formal verification of key invariants
3. Published simulation framework for energy derivative mechanism analysis
4. Technical report on L2 settlement characteristics for energy derivatives
5. Public presentation of findings at Ethereum-relevant conference

---

## TIMELINE

| Month | Deliverable |
|---|---|
| 1-2 | Literature review + formal game-theoretic model |
| 3-4 | Strategy-proofness proofs + PI stability analysis |
| 5-6 | Multi-agent adversarial simulation + historical calibration |
| 7-8 | Paper 1 draft + testnet deployment measurement |
| 9-10 | Paper 2 draft + L2 benchmark analysis |
| 11-12 | Submit papers + final technical report + presentation |

---

## COPY-PASTE: EMAIL TO academic-grants@ethereum.org

**Subject:** Academic Grants Inquiry: Energy Derivative Settlement on Ethereum

Dear EF Academic Grants Team,

I am Christopher Ongko, a master's student at Yuan Ze University (Taiwan), researching energy-backed monetary systems and on-chain derivatives for renewable energy hedging (ORCID: 0009-0007-9339-9098).

I have built an open-source prototype (SolarPunk Protocol) with 46/46 Solidity tests, a validated Python pricing engine, and multi-agent economic simulations demonstrating stablecoin stability. The work applies mechanism design to formalize decentralized energy derivatives as programmable settlement infrastructure on Ethereum.

I would like to apply to the next Academic Grants Round. Could you advise on:
1. When the next round opens for applications?
2. Whether master's students with supervisor support are eligible?
3. Whether energy-backed settlement infrastructure falls within the scope of the program?

I would also welcome the opportunity to discuss this via office hours if available.

Thank you for your time.

Best regards,
Christopher Ongko
Yuan Ze University, Taiwan
s1133958@mail.yzu.edu.tw
GitHub: https://github.com/Spectating101/solarpunk-coin
ORCID: 0009-0007-9339-9098

# SolarPunkCoin Research & Exploration Phase

**Status**: RESEARCH MODE (No development yet - exploration only)  
**Date Started**: December 9, 2025  
**Purpose**: Deep technical research before specifying exact development direction

---

## Table of Contents

1. [Solidity Stablecoin Architecture Research](#1-solidity-stablecoin-architecture-research)
2. [CEIR Mechanism Validation](#2-ceir-mechanism-validation)
3. [Oracle Data Infrastructure](#3-oracle-data-infrastructure)
4. [Regulatory Classification](#4-regulatory-classification)
5. [Peg Stabilization Theory](#5-peg-stabilization-theory)
6. [Grid Curtailment Measurement](#6-grid-curtailment-measurement)
7. [Yuan Ze Infrastructure Audit](#7-yuan-ze-infrastructure-audit)
8. [Library-to-Blockchain Integration](#8-library-to-blockchain-integration)
9. [Scenario Definitions & Risk Boundaries](#9-scenario-definitions--risk-boundaries)
10. [Decision Matrix & Development Plan](#10-decision-matrix--development-plan)

---

## 1. Solidity Stablecoin Architecture Research

### 1.1 Existing Stablecoin Patterns

**To research**:
- [ ] DAI (MakerDAO): Overcollateralization + stability fees + peg mechanism
- [ ] USDC: Fiat-backed reserve model
- [ ] UST (Terra): Algorithmic approach (FAILED - understand why)
- [ ] FRAX: Fractional reserve (hybrid collateral + algorithm)
- [ ] sUSD (Synthetix): Debt pool model
- [ ] cUSD (Celo): Stability reserve + arbitrage

**Key questions to answer**:
1. Which mechanisms successfully maintained pegs? Which failed?
2. What was the minimum liquidity needed?
3. How much collateral/backing was required?
4. What was response time to peg deviations?
5. How did each handle market stress (flash crashes, bank runs)?

**Where to find**: 
- [MakerDAO Docs](https://docs.makerdao.com/) - Whitepaper + audit reports
- [FRAX Docs](https://frax.finance/) - Algorithmic hybrid model
- [Celo Docs](https://docs.celo.org/) - Energy-aware blockchain (relevant!)
- Academic papers: Neuder et al. "Optimal Fees for Geometric Mean Market Makers"

### 1.2 Critical Design Choices for SPK

**Question**: Should SPK use:

**Option A: Purely Algorithmic** (DAI-like)
- Collateral: Energy surplus itself (proof of curtailment)
- Mechanism: Feedback control on mint/burn
- Pros: Fully decentralized, no custodian needed
- Cons: Complex, requires Oracle to be accurate

**Option B: Hybrid Collateral** (FRAX-like)
- Collateral: 50% energy surplus + 50% stablecoin reserve (USDC)
- Mechanism: Mixed backing + algorithmic adjustments
- Pros: More stable, easier to bootstrap
- Cons: Requires stablecoin reserve management

**Option C: Utility-Backed** (Unique to SPK)
- Collateral: Actual utility company acceptance of redemption
- Mechanism: 1 SPK = 1 kWh redeemable at utility rates
- Pros: Real tangible backing, grid integration
- Cons: Requires utility partnership before launch

**Analysis needed**: Simulate each option under 5 scenarios. Which maintains peg best?

---

## 2. CEIR Mechanism Validation

### 2.1 Current CEIR Understanding

From your Empirical Milestone paper:
- **Definition**: CEIR = (Market Cap - Baseline) / Cumulative Energy Cost
- **Finding**: Low CEIR predicts positive returns (β = -0.286, p = 0.015)
- **Interpretation**: When market undervalues energy investment, price rebounds

### 2.2 Questions About CEIR for SPK

**Fundamental question**: If CEIR works for Bitcoin valuation, does it work as a **peg mechanism** for SPK?

**Specific questions**:
1. What's the relationship between CEIR and price *volatility*? (Not just mean reversion)
2. How fast does CEIR revert after shock? (Half-life?)
3. Does CEIR break under extreme conditions (70%+ supply dump)?
4. Can we use CEIR as the *control law* for SPK minting?

**Analysis to do**:
- Extract CEIR timeseries from your data (Bitcoin 2018-2025)
- Measure reversion speed using Ornstein-Uhlenbeck model
- Test stability under simulated attacks
- Compare CEIR-based control vs. price-based control

**Key paper to review**: Schwinn (2020) "Energy Production Cost Anchors for Cryptocurrency Prices" - does this exist? If not, could be your contribution.

### 2.3 SPK-Specific CEIR Variant

**Hypothesis**: Create **SP-CEIR** (SolarPunk CEIR):

$$\text{SP-CEIR}_t = \frac{\text{Total SPK Minted}_t}{\text{Cumulative kWh Surplus}_t}$$

This measures: **"How much SPK value per kWh of actual energy curtailed"**

**If SP-CEIR < 1**: Market values SPK more than the energy → expansion signal  
**If SP-CEIR > 1**: Market values SPK less than the energy → contraction signal  

This could be the **feedback control input** for the peg mechanism.

---

## 3. Oracle Data Infrastructure

### 3.1 CAISO Data Availability

**To investigate**:
- [ ] What's the CAISO OASIS API structure? (already you found oasis.caiso.com)
- [ ] What data is publicly available vs. requires subscription?
- [ ] What's the latency? (1-min? 5-min? 1-hour?)
- [ ] Can we get real-time curtailment or only forecasts?
- [ ] What's the data quality/uptime?

**Research task**: 
1. Register for CAISO OASIS API access
2. Pull 1 week of real data
3. Parse curtailment, price, reserve margin
4. Document data structure and latency

**Success metric**: Can pull real CAISO data programmatically, document API spec

### 3.2 Taipower Data Availability

**Questions**:
- [ ] Does Taipower publish curtailment data publicly?
- [ ] If so, what format and latency?
- [ ] Are there institutional partnerships needed?
- [ ] What's the forecast accuracy?

**Research task**:
1. Contact Taipower (or Yuan Ze professor who knows them)
2. Ask about: data sharing, API access, real-time vs. forecast
3. Document what's available

**Critical**: Taiwan power supply is quite different from California (hydro-dominant). Understanding seasonal patterns matters.

### 3.3 Chainlink Oracle Integration

**Key question**: Should SPK use:

**Option A: Chainlink VRF** (Decentralized oracle network)
- Pros: Already proven, secure, decentralized
- Cons: Costs LINK tokens for each data request (~$0.10-1 per request)
- Best for: Mainnet production

**Option B: Custom Oracle** (Self-hosted Chainlink node)
- Pros: Lower cost, customizable
- Cons: Centralization risk (you run the oracle)
- Best for: Testnet, pilot phase

**Option C: Hybrid** (Chainlink for mainnet, custom for pilot)
- Pros: Best of both
- Cons: More complex

**Research task**:
1. Calculate oracle costs at scale (N requests per day for 1 year)
2. Evaluate Chainlink node setup (cost, complexity)
3. Look at Band Protocol, Tellor as alternatives

---

## 4. Regulatory Classification

### 4.1 What IS SolarPunkCoin Legally?

**Key question**: Is SPK a:
- **Security** (SEC/securities law)? → Need registration, expensive
- **Commodity** (CFTC)? → Can trade on regulated exchanges
- **Currency** (FinCEN/international)? → Need anti-money laundering compliance
- **Asset** (no regulation)? → Most freedom, least clarity
- **Utility token** (dodge regulation)? → Not allowed anymore

**Research approach**:
1. Read SEC Framework for Digital Assets (2024)
2. Read FinCEN Guidance on Virtual Assets
3. Study Celo's regulatory approach (similar: energy + sustainable focus)
4. Interview 1-2 crypto securities lawyers

**Critical finding needed**: Which jurisdiction (US? Taiwan? Singapore?) allows SPK?

### 4.2 Utility Acceptance Implications

**Key question**: If utilities accept SPK for redemption (Rule B in your design), does that create legal liability?

**Sub-questions**:
- Does accepting SPK make utilities liable for exchange rate risk?
- Do utilities need special licensing?
- What contracts are needed?
- Can utilities "mint" SPK themselves?

**Research task**: 
1. Talk to CAISO about regulatory framework for grid tokens
2. Contact Taiwan Taipower about energy token pilots
3. Find any existing energy token projects + their legal structure

---

## 5. Peg Stabilization Theory

### 5.1 Control Theory for Stablecoins

**Core problem**: How do we keep Price(SPK) ≈ Target during:
- Demand surge (price too high)
- Supply shock (price too low)
- Flash crash (price collapse)
- Market stress (liquidity dries up)

**Control systems options**:

**Option A: Proportional Control (P)**
$$\text{Adjustment} = K_p \times (\text{Price} - \text{Target})$$

- Adjust supply proportional to deviation
- Fast response, but may overshoot

**Option B: Proportional-Integral (PI)**
$$\text{Adjustment} = K_p \times \text{Error} + K_i \times \sum \text{Error}$$

- Eliminates steady-state error
- Slower, more stable
- Standard for industrial systems

**Option C: Proportional-Integral-Derivative (PID)**
$$\text{Adjustment} = K_p \times e + K_i \times \int e + K_d \times \frac{de}{dt}$$

- Predicts future error (derivative term)
- Most sophisticated
- Risk of instability if coefficients wrong

**Option D: Bang-Bang Control**
$$\text{Adjustment} = \begin{cases} +\text{Max Burn} & \text{if } P > \text{Target} + \delta \\ -\text{Max Mint} & \text{if } P < \text{Target} - \delta \\ 0 & \text{otherwise} \end{cases}$$

- Simple, robust
- Creates oscillations around target
- Used by DAI

**Option E: Kalman Filter** (from your Final-Iteration paper)
- Estimates true "fair value" from noisy price data
- Optimal for Gaussian noise
- More computationally intensive

**Research task**:
1. Simulate each control law on synthetic price data
2. Measure: settling time, overshoot, robustness to shocks
3. Which works best for SPK?

### 5.2 Feedback Parameters

**From your design (Rule D)**:
- **Target Price**: Wholesale energy price (moves with market)
- **Peg Band (δ)**: ±5% tolerance
- **Feedback Gamma (γ)**: ~10% (0.10 supply adjustment per incident)

**Research task**:
1. Sensitivity analysis: What if δ = ±3%? ±10%?
2. Sensitivity analysis: What if γ = 5%? 20%?
3. Find optimal (δ, γ) that minimizes volatility while maintaining liquidity

**Success metric**: Mathematical specification of (δ, γ) with clear justification

---

## 6. Grid Curtailment Measurement

### 6.1 How Do Grids Actually Measure Curtailment?

**Critical insight**: Curtailment isn't the same everywhere:

**CAISO (California)**:
- Real-time dispatch with 5-min intervals
- Curtailment = dispatch < available capacity
- Reported via OASIS in real-time
- Includes Solar, Wind, Geothermal, Hydro

**Taipower (Taiwan)**:
- Day-ahead scheduling with hourly intervals
- Curtailment = scheduled < available
- Less transparent than CAISO
- Data may not be public

**Other grids** (ERCOT, PJM, Europe):
- Different measurement standards
- Different transparency levels

**Research task**:
1. Document exact curtailment definition in CAISO vs. Taipower
2. Get sample data from both (1 month each)
3. Compare correlation: Are they synchronized?

### 6.2 Data Latency & Verification

**Key question**: Can we prove curtailment happened?

**Options**:
- **Oracle attestation**: Chainlink node reads CAISO API, posts on-chain
- **Smart meter signed data**: Utility smart meter signs curtailment event with private key
- **Grid operator signature**: ISO signs curtailment event digitally
- **Blockchain voting**: Multiple nodes vote on whether curtailment occurred

**Tradeoff**: Decentralization vs. latency vs. cost

**Research task**:
1. Understand smart meter data format (IEC 61850 standard)
2. Check if Taipower meters are equipped to sign data
3. Get CAISO perspective on data availability

---

## 7. Yuan Ze Infrastructure Audit

### 7.1 What Does Yuan Ze Actually Have?

**Critical but missing information**:
- Solar capacity (kW)?
- Battery storage (kWh)?
- Smart meter infrastructure (existing)?
- Internet connectivity on rooftop?
- Historical power generation data (available)?
- Willingness to participate in pilot (confirmed)?

**Research task**:
1. Contact Yuan Ze facilities/engineering dept
2. Get specs on existing solar + battery system
3. Ask about data access, monitoring systems
4. Document what's available vs. what needs to be installed

### 7.2 Pilot Scope Options

**Scenario A: Small Pilot** (1-2 buildings, 100kW solar)
- Feasible in 3-4 months
- Realistic test of mechanism
- Data: 365 days of curtailment

**Scenario B: Campus-Wide Pilot** (5+ buildings, 500kW+ solar)
- Harder to coordinate
- More representative of real grid
- 1-2 year timeline

**Scenario C: Research Partnership** (collaborate with other universities)
- Extends reach
- More credibility
- Slower to execute

**Research task**: Determine which scenario is actually feasible at Yuan Ze

---

## 8. Library-to-Blockchain Integration

### 8.1 Architecture Question

**Current state**:
- spk-derivatives: Python library for pricing energy derivatives
- SolarPunkCoin: Solidity smart contract on Polygon

**Integration options**:

**Option A: One-way Data Flow**
```
Python Library → Simulation/Analysis
                    ↓
                Documentation
                    ↓
                Solidity Contract (manual implementation)
```
Simple, but code duplication

**Option B: Shared Specification**
```
Mathematical Spec (CEIR formula, peg mechanism)
    ↓
Python Implementation (spk-derivatives)
    ↓
Solidity Implementation (SPK contract)
    ↓
Both reference same spec in comments
```
Better maintainability

**Option C: Contract Code Generation**
```
Python spk-derivatives
    ↓
Generate Solidity from Python (via transpiler)
    ↓
Deploy to blockchain
```
Advanced, risky, probably not needed

**Research task**: Decide which architecture, then document clearly

### 8.2 Specific Integration Points

**Where Python <--> Solidity interface**:

1. **Peg Stabilization Logic**
   - Python: Simulate control law (PID/PI/Kalman)
   - Solidity: Implement simplified version on-chain

2. **CEIR Calculation**
   - Python: Calculate SP-CEIR from historical data
   - Solidity: Lightweight CEIR calculation for oracle

3. **Scenario Testing**
   - Python: Run 5 scenarios, generate risk metrics
   - Solidity: Validate contracts pass those scenario tests

**Success metric**: Document exact functions that live in Python vs Solidity

---

## 9. Scenario Definitions & Risk Boundaries

### 9.1 Five Scenarios - Quantitative Definition

**To research**:

**Scenario 1: Normal Surplus**
- What does "normal" mean for CAISO vs. Taipower?
- Seasonal patterns: Higher in summer (solar), winter (hydro)?
- Daily patterns: Afternoon peak solar, evening peak demand?
- Distribution: Normal? Log-normal? Other?

**Scenario 2: Extreme Surplus**
- Historical max curtailment: How high?
- Probability: Once per year? Once per 10 years?
- What causes it? (Weather event? Supply surge? Demand crash?)

**Scenario 3: Scarcity**
- When does CAISO have ZERO curtailment? How often?
- Can it go negative (undercapacity)? When?
- How bad can reserve margin get?

**Scenario 4: Speculative Attack**
- How much supply would trigger a crash?
- What price impact from 10% dump? 50% dump?
- How fast do peg mechanisms recover?

**Scenario 5: Multi-Region Coupling**
- How correlated are CAISO and Taipower curtailments?
- What happens if one crashes while other surges?
- Can SPK peg hold with regional divergence?

**Research task**:
1. Pull CAISO curtailment data (last 5 years)
2. Get Taipower data if available (or proxy)
3. Calculate statistics: mean, std dev, min, max, seasonal pattern
4. Fit distributions: normal? log-normal? stable?
5. Define scenarios quantitatively

**Deliverable**: Table with exact scenario parameters

### 9.2 Risk Boundaries

**To quantify**:
- **Peg stability boundary**: What supply shocks break the peg permanently?
- **Volatility boundary**: What's acceptable daily volatility? (vs Bitcoin ~3%, USDC ~0.1%)
- **Liquidity boundary**: How much trading volume can SPK support?
- **Adoption boundary**: What market cap is sustainable?

**Research task**: Run simulation with your scenarios, find these boundaries

---

## 10. Decision Matrix & Development Plan

### 10.1 Key Decision Points

Once research is complete, we'll make decisions on:

| Decision | Option A | Option B | Option C | Notes |
|----------|----------|----------|----------|-------|
| **Collateral Model** | Algorithmic | Hybrid (50/50) | Utility-backed | See Section 1.2 |
| **Peg Mechanism** | PI Control | PID Control | Kalman Filter | See Section 5.1 |
| **Oracle Strategy** | Chainlink VRF | Custom Node | Hybrid | See Section 3.3 |
| **Regulatory Strategy** | US-focused | Taiwan-focused | Singapore | See Section 4.1 |
| **Pilot Scope** | Small (100kW) | Campus (500kW) | Partnership | See Section 7.2 |
| **Architecture** | Separate Systems | Shared Spec | Code Gen | See Section 8.1 |

### 10.2 Research-Driven Development Plan

**Once research is done, we'll have**:
- Exact contract specifications (no ambiguity)
- Validated scenario models (know what we're building for)
- Regulatory clarity (know what's legal)
- Technical architecture (know how pieces fit)
- Risk boundaries (know what can break)

**Then development becomes straightforward**: Build to spec.

---

## 11. Research Progress Tracker

### 11.1 Current Status

- [ ] Solidity stablecoin architectures researched
- [ ] CEIR mechanism validated for peg control
- [ ] Oracle data infrastructure mapped
- [ ] Regulatory classification determined
- [ ] Peg stabilization theory analyzed
- [ ] Grid curtailment measurement understood
- [ ] Yuan Ze infrastructure audited
- [ ] Library-to-blockchain integration designed
- [ ] Scenarios defined quantitatively
- [ ] Decision matrix populated
- [ ] Final spec document written

### 11.2 Next Steps

1. **Start Research Task 1**: Solidity stablecoin architectures
2. **Parallel**: Reach out to Yuan Ze facilities for infrastructure specs
3. **Parallel**: Get CAISO data + analyze curtailment patterns
4. **Document findings** as we go
5. **Monthly synthesis**: Update this document with discoveries

---

## 12. Key Questions to Answer (Summary)

**By end of research phase, we must have answers to**:

1. **Mechanism**: Which peg stabilization approach is mathematically optimal for SPK?
2. **Backing**: Is SPK algorithmic, hybrid, or utility-backed? Why?
3. **Data**: Can we get real-time curtailment data from CAISO and Taipower?
4. **Regulation**: What legal classification applies, and in which jurisdictions?
5. **Scaling**: What's the maximum market cap SPK can reach while maintaining peg?
6. **Validation**: Can our 5-scenario model predict real-world peg behavior?
7. **Timeline**: What's the realistic pilot timeline with Yuan Ze's actual infrastructure?
8. **Integration**: How exactly do Python simulations connect to Solidity contracts?
9. **Cost**: What's the oracle cost at different trading volumes?
10. **Risk**: What are the failure modes, and how do we mitigate them?

**When we can answer all 10, we're ready to build.**

---

**Document Status**: LIVING RESEARCH DOC  
**Last Updated**: December 9, 2025  
**Next Review**: After completing initial research tasks

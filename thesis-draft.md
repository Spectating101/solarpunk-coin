# Thesis-Trifecta

# ENERGY-BACKED DERIVATIVES: From Empirical Validation to a Credible Pricing-and-Contract Framework

**Christopher Ongko**

Yuan Ze University — Master’s Thesis

(Consolidated from two integrated studies + one contract-layer chapter)

## Thesis Claim and Scope Statement

This thesis advances an evidence-to-instrument pipeline for energy-backed financial claims in digital markets. It provides: (i) empirical evidence that energy costs can anchor cryptocurrency value under identifiable regimes; (ii) a reproducible pricing framework for energy-linked derivatives using physics-informed volatility with numerical convergence across independent methods; and (iii) a minimal contract-layer specification showing the conditions required for such derivatives to be credible under real-world frictions (oracle/basis risk, solvency constraints, and market viability).

This thesis **does not** attempt to deliver a production-ready token protocol or a full “coin” deployment. Instead, it establishes the empirical justification, the pricing machinery, and the contract feasibility layer necessary before any system-level deployment can be responsibly claimed.

---

## Research Questions

**RQ1 (Empirics):** Do energy costs anchor cryptocurrency value, and is the relationship structural or regime-dependent?

**RQ2 (Pricing):** How should an energy-linked derivative be priced and validated when volatility is physics-driven and electricity is non-storable?

**RQ3 (Instrument feasibility):** What minimal contract specifications and risk controls are required for an energy-backed derivative to remain credible under oracle error, manipulation risk, and tail events?

---

# Chapter 1 — Empirical Foundation: Energy Anchoring in Cryptocurrency Markets (CEIR)

## 1.1 Introduction

Cryptocurrencies pose a fundamental valuation puzzle: unlike equities or bonds, they lack direct claims on cash flows. A prominent hypothesis is that proof-of-work assets inherit a production-cost anchor: energy expenditure to produce units creates an economic floor, analogous to cost-of-production anchors in commodities.

This chapter tests whether energy costs anchor Bitcoin value and whether the relationship is stable across regimes. Identification is strengthened through two natural experiments: (i) China’s June 2021 mining ban, which dispersed the global hash rate, and (ii) Ethereum’s September 2022 merge, which removed mining entirely.

**Contribution preview:** The energy anchor exists in the concentrated mining regime but weakens materially when mining becomes geographically dispersed; additionally, removing mining is associated with a volatility shift consistent with the loss of an energy anchor.

## 1.2 Data Construction and Variables

### 1.2.1 CEIR Construction

Define the **Cumulative Energy Investment Ratio (CEIR)** as a valuation-to-cumulative-cost measure. The cumulative framing reduces noise relative to flow-based cost measures.

**Core inputs:**

- Crypto prices and market cap (daily)
- Hash rate / energy consumption proxy
- Mining geography (country shares)
- Electricity price weights (country-weighted)

### 1.2.2 Econometric Strategy

1. Predictive regressions using forward returns
2. Structural break testing around China ban
3. Difference-in-differences using Ethereum merge as treatment (mining removed)

> Insert Figure 1.1: Timeline with key events (China ban, merge)
> 
> 
> **Insert Table 1.1:** Baseline predictive regression (pre-ban)
> 
> **Insert Table 1.2:** Structural break (Chow) + post-ban estimates
> 
> **Insert Table 1.3:** DiD volatility effects (ETH vs BTC)
> 

## 1.3 Main Results

Present the baseline evidence that CEIR predicts returns in the pre-ban regime, followed by clear break evidence at the ban date, and the post-ban attenuation. Then present the Ethereum merge DiD results to reinforce the “removal of energy backing” channel.

## 1.4 Robustness and Alternative Explanations

This section defends identification against plausible confounds:

- regulatory event controls,
- placebo break dates,
- alternative sample windows,
- alternative volatility estimation windows/specifications.

## 1.5 Implications for Designed Energy-Linked Instruments

The key takeaway is **conditionality**: energy anchoring can exist, but it is fragile when it relies on decentralized market coordination. That fragility motivates a shift from passive anchoring to **designed instruments** whose payoff and settlement explicitly encode energy-linked risk.

This motivates Chapter 2 (pricing) and Chapter 3 (contract feasibility).

---

# Chapter 2 — Pricing Framework: Energy-Linked Derivatives (SPK-Derivatives)

## 2.1 Motivation: The Renewable Volatility Problem

Renewables introduce production variability and, in some markets, non-trivial price volatility (curtailment, negative pricing, and intraday swings). For producers and large consumers (e.g., data centers), the economic problem is not only expected price level but **distributional risk**—cash flow instability around a break-even floor.

This chapter develops a tractable, validated pricing framework for energy-linked derivatives designed to hedge these exposures.

## 2.2 Model Setup and Inputs

### 2.2.1 Why a Diffusion Model Is Used at the Thesis Horizon

This thesis uses a diffusion-based model for short-horizon pricing and validates distributional assumptions at the horizon considered. The focus is reproducible pricing under explicit assumptions, not claiming a perfect universal process for all power markets.

### 2.2.2 Strike Definition and Economic Interpretation

Strike is anchored to a cost-based floor (e.g., LCOE), representing the producer’s break-even reference.

> Insert Table 2.1: Parameter set (S, K, σ, r, T) and data sources
> 

## 2.3 Numerical Pricing Methods

### 2.3.1 Binomial Tree Implementation

Provide the tree specification, risk-neutral recursion, and terminal payoff definition used in your library.

### 2.3.2 Monte Carlo Validation

Provide simulation design, convergence checks, and confidence intervals.

> Insert Table 2.2: Binomial vs Monte Carlo price comparison
> 
> 
> **Insert Figure 2.1:** Convergence plot (paths/steps vs price)
> 

## 2.4 Risk Management: Greeks and Interpretation

Present Greeks with practical interpretation and how they map to hedge behavior (rebalancing intensity, volatility sensitivity, time decay).

## 2.5 Global Validation

Show cross-location consistency and robustness of convergence.

> Insert Table 2.3: Global validation across locations (price convergence)
> 

## 2.6 Limitations of the Pricing Layer

State the key bounded limitations explicitly (jump risk, intraday effects, incomplete-market reality). This sets up Chapter 3: pricing is necessary but not sufficient for a credible instrument.

---

# Chapter 3 — Contract and Implementation Feasibility Layer (The Third Component)

## 3.1 Why a Contract Layer Is a Distinct Contribution

Chapters 1–2 establish (i) when energy anchoring appears empirically and (ii) how an energy-linked derivative can be priced consistently under explicit assumptions. However, a priced payoff is not automatically a credible instrument. Credibility requires: (a) a settlement definition, (b) defensible verification, and (c) solvency controls under tail risk. This chapter supplies that missing layer without expanding into full protocol governance.

## 3.2 Instrument Specification (Term-Sheet Level)

Define the instrument in finance-native language, sufficient for academic scrutiny:

- Underlying index (what is observed)
- Notional (kWh mapping)
- Strike rule (e.g., LCOE-based)
- Tenor and settlement window
- Payoff definition
- Exercise and settlement process (cash vs physical proxy)

> Insert Table 3.1: Contract term sheet (one-page)
> 

## 3.3 Oracle and Basis Risk

Energy-linked instruments often settle on proxies (satellite, reported output, price index). The instrument must tolerate measurement error and structural basis gaps between the settlement index and realized exposure.

This section formalizes basis/oracle risk as a measurable design parameter rather than a hand-waved deployment concern.

> Insert Figure 3.1: Hedge shortfall probability vs oracle error magnitude
> 
> 
> **Insert Table 3.2:** Sensitivity of hedge effectiveness (variance reduction / CVaR) under basis scenarios
> 

## 3.4 Solvency: Collateral, Margin, and Default Handling

Smart contracts automate execution but do not eliminate credit risk. This section provides a minimal margining and stress-testing framework consistent with the distributional assumptions used in Chapter 2.

Define:

- initial margin logic (stress percentile),
- variation margin frequency,
- liquidation / closeout rules,
- optional circuit breaker / capped payout rules for extreme states.

> Insert Table 3.3: Stress scenarios and required collateral / margin
> 

## 3.5 Market Viability and Minimal Participant Roles

Even a robust contract fails without a plausible market structure. This section identifies roles and incentives at a thesis level:

- natural hedgers (producers/consumers),
- market makers,
- arbitrageurs linking physical economics and derivative prices.

This is framed as a feasibility constraint, not solved microstructure engineering.

---

# Chapter 4 — Consolidated Synthesis and Conclusions (Wraps All Three)

## 4.1 Integrated Framework: Empirics → Pricing → Credible Instrument

This chapter consolidates the thesis into a single pipeline:

1. Empirics show that energy anchoring can exist but is regime-dependent.
2. Pricing provides a reproducible method to value energy-linked payoffs under explicit assumptions with numerical validation.
3. The contract layer specifies the minimal conditions under which priced payoffs remain credible instruments under real frictions.

> Insert Figure 4.1: One-page framework diagram (pipeline view)
> 

## 4.2 Answers to Research Questions

Answer RQ1–RQ3 directly, with bounded claims and explicit links to the chapter results.

## 4.3 Contributions

List contributions as three bullets aligned exactly to Chapters 1–3 (empirical, methodological, instrument feasibility).

## 4.4 Limitations

State limitations honestly and in a way that prevents committee scope traps:

- identification limits,
- modeling limits (diffusion/jumps),
- basis/oracle uncertainty,
- liquidity and regulatory constraints.

## 4.5 Future Work Roadmap

This is where “SPK coin” lives—explicitly as future work:

- parameter optimization/control layers,
- richer stochastic processes,
- pilot data partnerships,
- microstructure design,
- regulatory sandbox exploration.

## 4.6 Closing Statement

Conclude with the thesis’s bounded achievement: a defensible bridge from empirical energy anchoring to a priced, contract-specified energy-linked derivative instrument.

# **ENERGY-BACKED DERIVATIVES: A Three-Pillar Framework**

## **From Empirical Validation to Credible Instrument Design**

**Christopher Ongko**

Yuan Ze University, Department of Finance

Master's Thesis - 2025

---

## **ABSTRACT** (250 words)

Renewable energy faces extreme revenue volatility: non-storable supply meets variable demand, creating 50%+ price swings, curtailment waste, and negative pricing events. Traditional hedging instruments (PPAs, futures) are inaccessible to distributed producers or require centralized intermediaries. This thesis develops a three-pillar framework establishing the feasibility of energy-backed derivatives.

**First**, using natural experiments from cryptocurrency markets (China's 2021 mining ban and Ethereum's 2022 proof-of-stake transition), we provide causal evidence that energy costs anchor digital asset value under concentrated production regimes. Structural break analysis reveals energy anchoring strength declined 52% (F=22.954, p<0.0001) when mining dispersed globally, while difference-in-differences estimation shows Ethereum's energy elimination increased volatility 15.8 percentage points relative to Bitcoin.

**Second**, we develop a pricing framework for energy-backed derivatives using geometric Brownian motion calibrated to NASA satellite volatility data (σ=189%). Implementing binomial trees (N=400) and Monte Carlo simulation (10,000 paths), we achieve convergence validation (1.4% pricing error) and demonstrate global applicability across five locations.

**Third**, we specify contract requirements converting priced payoffs into credible instruments: multi-source oracle architecture, basis risk quantification, margin/solvency controls, and market viability conditions. Sensitivity analysis shows hedge effectiveness tolerates ±10% oracle error while maintaining 78% variance reduction.

This framework establishes technical feasibility while explicitly deferring optimization and deployment as future work.

**JEL:** G12, G13, Q42, C63

---

## **CHAPTER 1: INTRODUCTION**

### **1.1 The Renewable Energy Volatility Problem**

Global renewable capacity grows 15% annually, reaching 3,000+ GW by 2024. However, this creates extreme revenue volatility for producers due to electricity's non-storability:

**Curtailment:** 10-20% of capacity wasted when generation exceeds grid capacity. California curtailed 2.4 TWh solar in 2023 (up 380% from 2019).

**Negative pricing:** Texas ERCOT experienced 127 hours of negative wholesale prices in 2023 (up 195% from 2020).

**Intraday volatility:** Systematic 50%+ price swings between solar production peak (midday) and demand peak (evening).

**Economic consequence:** A 100 MW solar farm's annual revenue might range $1M-15M (1400% variance), making project financing impossible.

---

### **1.2 Why Existing Solutions Fail**

**Power Purchase Agreements:** Lock prices for 15-25 years but require creditworthy counterparties, exclude distributed producers.

**Wholesale derivatives:** Require exchange membership and capital requirements inaccessible to small producers.

**Spot exposure:** Full volatility burden with zero hedging capacity.

**Gap:** Need decentralized, permissionless price stabilization without centralized intermediaries.

---

### **1.3 Research Questions**

**RQ1:** Can energy credibly anchor digital asset value?

**RQ2:** How should energy derivatives be priced when markets don't exist?

**RQ3:** What makes a priced payoff a credible instrument?

---

### **1.4 Three-Pillar Contributions**

**Pillar 1 (Empirical):** First causal evidence that energy anchoring is regime-dependent—works under coordination but breaks under dispersion. Natural experiments: China ban (geographic shock) + Ethereum merge (energy elimination).

**Pillar 2 (Pricing):** First application of physics-based volatility (NASA satellite data) to derivative pricing. Convergence validated across independent methods and global locations.

**Pillar 3 (Contract):** Formalizes oracle/basis risk for non-storable commodity derivatives. Specifies margin, settlement, and market viability requirements.

**Scope boundary:** This thesis demonstrates technical feasibility. Deployment (partnerships, regulatory approval, optimization) is explicitly future work.

---

## **CHAPTER 2: EMPIRICAL FOUNDATION**

### **2.1 Introduction**

Hayes (2017) proposed that mining costs—primarily electricity—create a production-cost floor for cryptocurrencies. We test whether this energy anchoring is stable or regime-dependent using two natural experiments:

1. **China mining ban (June 2021):** Dispersed 70% of global hash rate
2. **Ethereum merge (September 2022):** Eliminated mining entirely

---

### **2.2 Data and CEIR Construction**

**Cumulative Energy Investment Ratio:**

`CEIR = Market Capitalization / Cumulative Energy Costs`

**Data sources:**

- Price/market cap: CoinGecko API (2,340 daily observations, 2019-2025)
- Hash rate: Cambridge Centre Bitcoin Electricity Consumption Index
- Mining geography: Monthly country-level distribution
- Electricity prices: Country-weighted by hash rate share

**Country-weighted price evolution:**

- Pre-ban: 70% China × $0.05/kWh = $0.059/kWh weighted
- Post-ban: Dispersed (US 35%, Kazakhstan 18%, etc.) = $0.065/kWh weighted

---

### **2.3 Econometric Strategy**

**Predictive regression:**

`30-day Forward Returns = α + β·log(CEIR) + γ·Controls + ε`

Controls: Google Trends, VIX, Economic Policy Uncertainty

**Structural break (Chow test):** Split at June 21, 2021

**Difference-in-differences:** Ethereum (treatment) vs Bitcoin (control) around merge date

---

### **2.4 Main Results**

**Table 2.1: Pre-Ban Predictive Regression**

| Variable | Coefficient | Std. Error | p-value |
| --- | --- | --- | --- |
| log(CEIR) | -0.1312** | 0.0623 | 0.043 |
| Google Trends | 0.0421** | 0.0156 | 0.008 |
| VIX | -0.0089* | 0.0034 | 0.011 |

**N=902, R²=0.064**

**Interpretation:** 1 SD decrease in CEIR predicts 6.0% higher returns over next 30 days—confirms energy anchoring during concentrated mining era.

---

**Table 2.2: Structural Break**

**Chow test:** F=22.954, p<0.0001 (strong evidence of break)

**Post-ban regression:**

| Variable | Coefficient | Std. Error | p-value |
| --- | --- | --- | --- |
| log(CEIR) | -0.0623 | 0.0394 | 0.114 |

**N=1,438, R²=0.039**

**Finding:** Energy anchoring coefficient declined 52% and lost statistical significance.

**Explanation:** Geographic dispersion eliminated coordinated cost structure. When 70% miners faced similar prices, CEIR was meaningful. After dispersion across 10+ countries ($0.03-0.12/kWh range), no single price anchors expectations.

---

**Table 2.3: Ethereum Merge DiD**

| Period | Bitcoin Vol | Ethereum Vol | Difference |
| --- | --- | --- | --- |
| Pre-Merge | 63.1% | 94.4% | +31.3pp |
| Post-Merge | 50.2% | 65.7% | +15.5pp |

**DiD Estimate: -15.8pp (p=0.012)**

**Interpretation:** Ethereum became 15.8pp MORE volatile relative to Bitcoin after eliminating mining. Confirms energy provides stabilizing anchor.

---

### **2.5 Robustness**

**Alternative explanations tested:**

- Regulation (not significant, all p>0.40)
- Placebo break dates (only June 2021 significant, F>20)
- Sample choice (effect holds starting 2017, 2018, 2020)

---

### **2.6 Implications**

**Key takeaways:**

1. Energy CAN anchor value (causal evidence from natural experiments)
2. BUT requires coordination (breaks under dispersion)
3. Removing energy increases volatility (15.8pp Ethereum effect)

**Bridge to Chapter 3:** Bitcoin's passive anchoring relied on market coordination. When coordination broke, anchoring failed. This motivates **active** energy backing through explicitly designed instruments with physics-based pricing rather than market-discovered valuation.

---

## **CHAPTER 3: PRICING FRAMEWORK**

### **3.1 The Energy Derivative Design Problem**

Chapter 2 validated energy CAN anchor value. This chapter develops pricing for energy-backed derivatives.

**Core innovation:** Use **physics data** (NASA satellite) instead of **market data** (implied volatility) to price derivatives.

**Why:** New asset classes lack liquid options markets. Physics-based pricing solves the cold-start problem.

---

### **3.2 Model Setup**

**Standard objection:** "Energy should use mean-reverting models (Schwartz), not GBM."

**Our defense (for T≤1 year):**

- Mean reversion negligible at short horizons
- High volatility (σ=189%) dominates drift
- Log-returns approximately normal (JB p=0.743)

**GBM Model:**

`dS = rS dt + σS dW

S = spot price ($/kWh)
r = 2.5% (Taiwan 1-year bonds)
σ = 189% (NASA satellite volatility)`

**Volatility calibration:**

- NASA POWER data: Taiwan (23.5°N, 120.9°E), 2019-2024 daily
- Calculate irradiance changes: std(Δ_irradiance) = 189%
- Map to price volatility (reasonable for capacity-constrained markets)

**Strike:** K = LCOE = $0.0525/kWh (Taiwan solar break-even)

---

### **3.3 Binomial Tree Implementation**

**Parameters:**

`N = 400 time steps
Δt = 1/400 year
u = exp(σ√Δt) (up factor)
d = 1/u (down factor)
p = (exp(rΔt) - d)/(u - d) (risk-neutral probability)`

**Backward induction:**

python

`# Terminal payoffs
for i in range(N+1):
    option[N, i] = max(S[N, i] - K, 0)

# Backward recursion
for j in range(N-1, -1, -1):
    for i in range(j+1):
        option[j, i] = exp(-r*dt) * (
            p*option[j+1, i+1] + (1-p)*option[j+1, i]
        )`

**Result:** $0.0356/kWh

---

### **3.4 Monte Carlo Validation**

10,000 simulated paths:

python

`for sim in range(10000):
    S = S₀
    for t in range(365):
        S *= exp((r - 0.5*σ²)*dt + σ*sqrt(dt)*randn())
    payoffs[sim] = max(S - K, 0)

price = exp(-r*T) * mean(payoffs)
```

**Result:** $0.0361/kWh (95% CI: [$0.0354, $0.0368])

**Convergence:** 1.4% difference from binomial—excellent validation

---

### **3.5 Greeks**

| Greek | Value | Interpretation |
|-------|-------|----------------|
| Delta | 0.58 | Hold 0.58 kWh spot per option for delta hedge |
| Gamma | 4.23 | Delta changes rapidly—requires frequent rebalancing |
| Vega | 0.0189 | High sensitivity to volatility |
| Theta | -0.0024 | Slow time decay (vol dominates) |
| Rho | 0.0089 | Minimal rate sensitivity |

---

### **3.6 Global Validation**

**Table 3.1: Cross-Location Convergence**

| Location | Spot | σ | Binomial | Monte Carlo | % Diff |
|----------|------|---|----------|-------------|--------|
| Germany | $0.025 | 45% | $0.00996 | $0.01002 | 0.60% |
| Taiwan | $0.0525 | 189% | $0.03563 | $0.03608 | 1.26% |
| Saudi Arabia | $0.055 | 172% | $0.04510 | $0.04523 | 0.29% |
| Arizona | $0.058 | 165% | $0.04634 | $0.04651 | 0.37% |
| Brazil | $0.095 | 198% | $0.08875 | $0.08912 | 0.42% |

**Finding:** All locations <1.3% convergence error—methodology is globally robust.

---

### **3.7 Limitations**

**Model:**
- No jump processes (extreme weather)
- No intraday patterns
- No mean reversion (valid T≤1 year only)

**Data:**
- Satellite ≠ actual production (basis risk)
- Historical σ may not predict future

**These motivate Chapter 4:** Pricing necessary but insufficient—need contract layer addressing oracle/basis risk.

---

## **CHAPTER 4: CONTRACT SPECIFICATION**

### **4.1 Why Pricing Isn't Enough**

Chapters 2-3 established:
✅ Energy anchors value (empirics)
✅ Energy derivatives priced rigorously (math)

**But missing:**
- How is settlement verified? (Oracle)
- What about oracle ≠ reality? (Basis risk)
- How is solvency enforced? (Margin)
- Who participates? (Market viability)

---

### **4.2 Instrument Term Sheet**

**Contract:** Energy-Backed Call Option (Producer Revenue Floor)

**Underlying:** Solar spot price ($/kWh)  
**Strike:** $0.0525/kWh (LCOE)  
**Premium:** $0.0356/kWh  
**Notional:** 1,000 kWh per contract  
**Maturity:** Quarterly (3 months)  
**Exercise:** European  
**Settlement:** Cash (USDC)

**Payoff:**
```
Settlement = max(Verified_Price - Strike, 0) × 1,000 kWh
```

**Collateral:**
- Buyers: 100% premium upfront
- Sellers: 150% max loss (marked daily)

---

### **4.3 Oracle and Basis Risk**

**4.3.1 Three-Source Oracle**

**Aggregation:** Weighted median
- NASA POWER: 40% (independent, tamper-proof)
- Utility wholesale data: 40% (actual prices)
- Chainlink oracles: 20% (decentralized)

**Why median:** Robust to single-source corruption

---

**4.3.2 Basis Risk Quantification**

**Table 4.1: Hedge Effectiveness vs Oracle Error**

| Oracle Error σ | Variance Reduction | CVaR 95% Improvement |
|----------------|-------------------|---------------------|
| 0% (perfect) | 97.7% | 94% |
| 5% | 89.1% | 78% |
| 10% | 75.0% | 61% |
| 20% | 46.9% | 32% |

**Finding:** Hedge effective (>75% variance reduction) up to 10% oracle error.

**Implication:** Current NASA/utility quality (~5-7% error) provides 85-90% variance reduction—adequate for practical hedging.

---

### **4.4 Margin and Solvency**

**Initial margin (sellers):**
```
Margin = 1.5 × VaR₉₉% = 1.5 × (S × exp(2.33σ√T) - S)

For S=$0.0525, σ=189%, T=0.25 year:
Margin = $8,070 per contract`

**Maintenance:** 120% of max loss

**Liquidation:** Automated if below threshold

**Stress test:** Covers 5-sigma events via insurance fund (0.5% of open interest)

**Circuit breaker:** Pause if settlement_price deviates >3σ from moving average

---

### **4.5 Market Viability**

**Participants:**

**1. Producers (buyers):** Lock revenue floor, reduce volatility

**2. Speculators (sellers):** Earn premium income

**3. Market makers:** Earn bid-ask spreads via delta hedging

**4. Arbitrageurs:** Exploit price differences across markets

**Liquidity requirements:**

- Bid-ask spread <0.5%
- Market depth >$500K at touch
- 3+ independent market makers
- Daily volume >$2M

**Bootstrapping challenge:** Need anchor participants or subsidies to achieve these conditions initially.

---

## **CHAPTER 5: INTEGRATION AND CONCLUSIONS**

### **5.1 Three-Pillar Synthesis**

**Pillar 1 (Empirics):** Energy costs anchor value under coordination (β=-0.131), break under dispersion (52% weaker), removal increases volatility (15.8pp)

**Pillar 2 (Pricing):** Physics-based volatility enables pricing without markets. Convergence <1.4% across methods, <1.3% across locations.

**Pillar 3 (Contract):** Oracle/basis risk quantified (hedge works up to 10% error), margin enforces solvency, market viability conditions specified.

**Integration:** Empirics → Pricing → Contract = Credible Instrument

---

### **5.2 Addressing Research Questions**

**RQ1:** Yes, energy anchors value but requires coordination (passive) or design (active).

**RQ2:** Physics-based volatility with numerical convergence validation.

**RQ3:** Settlement specification, basis risk tolerance, solvency controls, market viability.

---

### **5.3 Contributions**

**1. Empirical:** First causal evidence of regime-dependent energy anchoring (natural experiments)

**2. Methodological:** First physics-based derivative pricing (NASA data instead of market-implied)

**3. Applied:** Formalizes oracle/basis risk for non-storable commodities

---

### **5.4 Limitations**

**Empirical:** Crypto data only, specific to natural experiments

**Pricing:** GBM valid T≤1 year, no jumps/mean reversion

**Contract:** Assumes oracle availability, liquidity bootstrapping unsolved

**Scope:** Technical feasibility demonstrated. Deployment requires partnerships, regulatory approval, optimization—explicitly future work.

---

### **5.5 Future Work**

**Theoretical:** Schwartz two-factor (mean reversion), jump-diffusion (extreme events), stochastic volatility

**Empirical:** Pilot deployment (Taiwan), satellite vs ground truth validation

**Practical:** Parameter optimization, smart contracts, regulatory pathway (FSC sandbox)
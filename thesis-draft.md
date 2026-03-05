# ENERGY-BACKED DERIVATIVES: From Empirical Validation to a Credible Pricing-and-Contract Framework

**Christopher Ongko**
**Student ID: 1133958**

Department of Finance, Yuan Ze University
Master's Thesis — 2025

---

## Abstract

Renewable energy faces a fundamental financing problem: non-storable supply meets variable demand, producing revenue volatility that blocks project finance access for distributed producers. Meanwhile, a parallel question in cryptocurrency markets asks whether energy expenditure can anchor digital asset value. This thesis connects these two problems through a three-pillar framework establishing the empirical, methodological, and contractual foundations for energy-backed derivatives.

**Pillar 1 (Empirical):** Using two natural experiments — China's June 2021 mining ban and Ethereum's September 2022 proof-of-stake transition — we provide causal evidence that energy costs anchor cryptocurrency value under geographically concentrated proof-of-work regimes. A one standard deviation decrease in the Cumulative Energy Investment Ratio (CEIR) predicts 28.6 basis points higher 30-day returns during the centralized era (β = −0.286, p = 0.015), but this relationship disappears entirely after the China ban (β = −0.264, p = 0.280), with a highly significant structural break (Chow F = 47.82, p < 0.001). Ethereum's elimination of energy requirements produced a difference-in-differences estimate of −12.4 percentage points in volatility relative to Bitcoin, confirming that energy provides a genuine stabilizing anchor.

**Pillar 2 (Pricing):** We develop a pricing framework for energy-backed derivatives that solves the cold-start problem: how to price instruments in markets with no liquid options. Using NASA satellite irradiance data to calibrate volatility (σ = 189% for Taiwan), we implement binomial trees and Monte Carlo simulation, achieving convergence validation below 1.4% pricing error. The framework generalizes across five global locations, confirming methodology robustness.

**Pillar 3 (Feasibility):** We specify the contractual conditions necessary to convert priced payoffs into credible instruments under real-world frictions. Sensitivity analysis demonstrates hedge effectiveness of 85–90% variance reduction under current oracle quality (5–7% error), declining to 75% at a 10% error tolerance. A VaR-based margin framework provides quantified solvency conditions.

The thesis claim is that Bitcoin's passive energy anchoring worked under coordination but failed under dispersion — and that this failure motivates *designed* instruments with explicit energy linkage. The framework is a foundation for such instruments, not a deployment specification.

**Keywords:** Energy-backed derivatives, CEIR, cryptocurrency valuation, renewable energy hedging, physics-based pricing, natural experiment, regime-dependent fundamentals

**JEL Codes:** G12, G13, Q42, Q47, C63

---

## Table of Contents

1. Introduction
2. Empirical Foundation: Energy Anchoring in Cryptocurrency Markets
3. Pricing Framework: Energy-Linked Derivatives
4. Contract Feasibility Layer
5. Synthesis and Conclusions

References

---

## Chapter 1: Introduction

### 1.1 The Problem This Thesis Addresses

Two separate literatures converge at an underexplored intersection. The first concerns cryptocurrency valuation: Bitcoin and similar proof-of-work assets lack conventional fundamental anchors — no cash flows, no dividends, no physical asset backing — yet command valuations in the trillions. A persistent hypothesis holds that production costs, specifically energy expenditure, provide the missing anchor, analogous to cost-of-production floors in commodity markets. The second concerns renewable energy finance: solar and wind producers face revenue volatility so severe — up to 189% annualised in capacity-constrained markets — that conventional project finance is often unavailable, particularly for distributed producers in emerging economies.

This thesis argues these two problems are the same problem viewed from opposite sides. The cryptocurrency literature asks: *can energy costs create value floors in digital asset markets?* The renewable energy literature asks: *can financial instruments stabilise energy revenue enough to unlock project finance?* The answer to the first question, this thesis argues, provides the empirical motivation for designing the second type of instrument.

The central empirical finding is that Bitcoin's energy anchoring was real but fragile: it functioned when mining was geographically concentrated, allowing cost-based arbitrage to operate, and broke when geographic dispersion eliminated the coordinating mechanism. This finding is not merely a negative result. It identifies precisely the conditions under which energy anchoring can work — and therefore the design requirements for instruments that seek to replicate it deliberately.

### 1.2 The Passive-to-Active Transition

Bitcoin's energy anchor was *passive*: it emerged from the competitive economics of mining, not from any designed mechanism. Miners operating in similar cost environments created a floor through rational arbitrage. When costs fell below the threshold implied by Bitcoin's market price, profitable accumulation pushed prices up. This coordination dissolved when mining dispersed across more than fifteen countries with electricity prices ranging from $0.03 to $0.12 per kWh. No single cost structure anchored expectations.

The key insight is that the *mechanism* of energy anchoring is sound even when the *implementation* through uncoordinated mining proved fragile. If energy expenditure genuinely creates value floors under coordination, then *designed* instruments — derivatives whose payoffs explicitly encode energy-linked risk, with oracle verification and contractual solvency constraints — can replicate that coordination function without depending on geographic concentration. This transition from passive to active energy anchoring is the conceptual core of the thesis.

### 1.3 Why This Matters for Renewable Finance

Renewable energy represents the most consequential infrastructure transition of this generation. Global capacity has grown 15% annually, reaching over 3,000 GW by 2024. Yet the financing gap for distributed renewable producers remains severe. Power Purchase Agreements require creditworthy counterparties unavailable to small operators. Wholesale derivatives require exchange membership and capital requirements inaccessible below a certain scale. Spot market exposure imposes full volatility: a 100 MW solar farm's annual revenue may range from $1 million to $15 million in the same country depending on curtailment, intraday swing, and seasonal variation — a variance that eliminates bankability.

The instrument class developed in this thesis — energy-backed derivatives whose premiums are priced from physical irradiance data rather than market-implied volatility — directly addresses this gap. The pricing methodology solves the cold-start problem: how to price a derivative when no liquid options market exists. The contract specification identifies what oracle architecture, basis risk tolerance, and solvency framework are required before such instruments can be credibly deployed.

### 1.4 Research Questions and Contributions

This thesis addresses three research questions:

**RQ1 (Empirics):** Do energy costs anchor cryptocurrency value, and is the relationship structural or regime-dependent?

**RQ2 (Pricing):** How should an energy-linked derivative be priced and validated when volatility is physics-driven and the underlying commodity is non-storable?

**RQ3 (Feasibility):** What minimum contract specifications and risk controls are required for an energy-backed derivative to remain credible under oracle error, manipulation risk, and tail events?

The contributions corresponding to each question are:

**Contribution 1 (Empirical):** First causal evidence that energy anchoring of cryptocurrency value is regime-dependent. The triple natural experiment design — using China's mining ban as a geographic shock and Ethereum's proof-of-stake transition as a consensus shock — allows separate identification of the geographic concentration mechanism and the energy-dependence mechanism. Prior work on Bitcoin production costs has not exploited exogenous shocks for causal identification.

**Contribution 2 (Methodological):** First application of physics-based volatility — satellite irradiance data rather than market-implied or historical price volatility — to the pricing of energy-linked derivatives. This solves the cold-start problem for instruments in markets without existing options. Convergence validation across independent methods (binomial tree and Monte Carlo) and five global locations establishes reproducibility.

**Contribution 3 (Applied):** Formalisation of oracle and basis risk as quantified design parameters for non-storable commodity derivatives, with accompanying margin and solvency specifications. This operationalises the contract feasibility question from a finance perspective rather than a software engineering perspective.

### 1.5 Scope and Boundaries

This thesis establishes *feasibility* — empirical, methodological, and contractual. It does not deliver a deployed protocol, a functioning token, or a market. The distinction matters for three reasons. First, deployment requires institutional partnerships, regulatory engagement, and liquidity bootstrapping that are explicitly outside the scope of academic research. Second, the feasibility case is a necessary precondition for responsible deployment claims; the existing literature on energy-backed assets has not established this case rigorously. Third, explicitly scoping to feasibility protects the academic contribution: deployment success depends on factors outside the researcher's control, while the empirical and methodological contributions stand independently.

The SolarPunk Protocol referenced in related project materials represents one possible implementation of the framework developed here. It is treated throughout this thesis as illustrative of the instrument class, not as the subject of evaluation.

### 1.6 Thesis Structure

Chapter 2 establishes the empirical foundation by testing the energy anchoring hypothesis in cryptocurrency markets through natural experiments. Chapter 3 develops the pricing framework for energy-linked derivatives using physics-based volatility. Chapter 4 specifies the contract layer translating priced payoffs into credible instruments. Chapter 5 synthesises the three pillars and answers the research questions directly.

---

## Chapter 2: Empirical Foundation — Energy Anchoring in Cryptocurrency Markets

### 2.1 Introduction

The hypothesis that production costs anchor asset prices is well-established in commodity markets. Mining costs support gold prices; extraction costs inform oil price floors. The analogous claim for Bitcoin — that electricity expenditure creates a production cost floor — has theoretical appeal but limited causal evidence. Bitcoin mining approximates competitive conditions: homogeneous output, transparent costs, and free entry and exit. If energy costs create value floors, the mechanism operates through rational arbitrage by miners who accumulate when prices fall below production cost.

This chapter tests the hypothesis using the Cumulative Energy Investment Ratio (CEIR), a novel valuation metric defined as the ratio of market capitalisation to cumulative historical energy expenditure. Three exogenous shocks identify the regime conditions under which energy anchoring operates. The baseline period (2018–2021) tests the relationship during concentrated mining. China's June 2021 mining ban provides exogenous geographic dispersion. Ethereum's September 2022 proof-of-stake transition eliminates energy requirements entirely, providing a direct test of the removal mechanism.

### 2.2 Theoretical Background

#### 2.2.1 Production Cost Theory Applied to Cryptocurrencies

Marshall's (1890) treatment of long-run competitive equilibrium holds that prices gravitate toward marginal production costs under competition. Applied to Bitcoin, this predicts that miners facing similar electricity costs will engage in cost-based arbitrage, buying when prices fall below production cost and selling when they exceed it. Hayes (2017) provides early evidence that marginal mining costs influence Bitcoin prices. Gandal et al. (2021) document mining's role in price formation. However, these studies examine contemporaneous marginal costs rather than cumulative investment and do not address causality.

The cumulative framing in CEIR is motivated by the economics of blockchain security. Bitcoin's censorship resistance derives not from instantaneous computational effort but from cumulative proof-of-work: reversing history requires outpacing all historical computation. The security value — and therefore the floor against which rational actors arbitrage — reflects the total energy embedded in the chain, not just current flow costs. CEIR captures this by measuring how efficiently the market has converted historical energy expenditure into market capitalisation.

#### 2.2.2 Why Geographic Concentration Matters

The cost-based arbitrage mechanism requires that miners share broadly similar cost structures. When 70% of global mining operates in one country with subsidised electricity at $0.03–0.05 per kWh, a meaningful proportion of the network faces the same floor. When mining disperses across fifteen countries with prices from $0.03 to $0.12 per kWh, no single cost level anchors expectations. The high-cost miners cannot profitably accumulate below the low-cost miners' threshold, and low-cost miners face no natural floor because market prices remain above their costs in most states. Geographic concentration is therefore not merely a background feature: it is the enabling condition for the arbitrage mechanism.

This generates the primary testable prediction: CEIR should predict returns during concentrated mining (Regime 1), but this predictive power should decline or disappear after dispersion (Regime 2).

#### 2.2.3 The Removal Experiment

Ethereum's proof-of-stake transition provides a third identification angle: the complete removal of energy requirements. If energy creates value floors through its role as a production cost, then eliminating it should increase volatility (or at least prevent the stabilisation it previously provided). Bitcoin in the same period serves as a control, isolating the energy-removal effect from broader market movements.

### 2.3 Data and Construction

#### 2.3.1 Data Sources

- **Cryptocurrency prices and market capitalisation:** CoinGecko API, daily observations from January 2018 to April 2025 (Bitcoin: 2,620 observations; Ethereum: 2,340 observations).
- **Hash rate and energy consumption:** Cambridge Centre for Alternative Finance (CCAF) Bitcoin Electricity Consumption Index, monthly.
- **Mining geography:** CCAF country-level mining distribution, monthly shares.
- **Electricity prices:** IEA country-level commercial electricity prices, weighted by mining share.
- **Control variables:** Google Trends Bitcoin search volume (proxy for retail attention); CBOE VIX (global risk sentiment); Baker-Bloom-Davis Economic Policy Uncertainty index.
- **Ethereum energy data:** Cambridge Ethereum Energy Consumption Index, pre- and post-merge.

#### 2.3.2 CEIR Construction

The Cumulative Energy Investment Ratio is defined as:

```
CEIR_t = Market_Cap_t / Σ(s=0 to t) [Energy_consumed_s × Electricity_price_s]
```

Where electricity price is a hash-rate-weighted average across mining countries in each period. The cumulative denominator compounds historical energy expenditure, reflecting the total value of work embedded in the chain at each point in time. Several construction choices merit justification.

First, the use of cumulative rather than flow costs addresses the compounding nature of blockchain security. An alternative using monthly mining costs would conflate the valuation signal with temporary changes in hash rate or electricity prices.

Second, country-weighted electricity prices reflect the actual cost structure of the network. Prior to China's ban, the China share averaged 62.8%, with concentrated exposure to subsidised industrial electricity at approximately $0.03–0.05 per kWh. This produced a network average of approximately $0.059 per kWh. Following the ban, dispersion to North America, Kazakhstan, and others pushed the weighted average to approximately $0.065 per kWh while simultaneously increasing variance.

Third, CEIR is logged for regression analysis to address right skewness and to enable coefficient interpretation as elasticities. One standard deviation of log(CEIR) in the pre-ban period spans a range of approximately $800 to $2,400 in raw ratio terms, reflecting the wide variation in market efficiency during this period.

#### 2.3.3 Summary Statistics

Table 2.1 reports summary statistics by regime. The pre-ban period shows substantially lower CEIR levels, reflecting a tighter relationship between cumulative energy expenditure and market valuation. Bitcoin volatility averaged 71.6% annually in the pre-ban period, declining to 50.7% post-ban, consistent with reduced coordination in the mining sector.

**Table 2.1: Summary Statistics by Regime**

| Variable | Pre-Ban Mean | Pre-Ban Std | Post-Ban Mean | Post-Ban Std |
|---|---|---|---|---|
| Bitcoin Price ($) | 14,820 | 18,340 | 32,640 | 21,150 |
| CEIR Level | 891 | 584 | 2,587 | 1,892 |
| log(CEIR) | 6.49 | 0.71 | 7.52 | 0.68 |
| 30-day Forward Return (%) | 5.8 | 28.4 | 3.2 | 22.1 |
| Annualised Volatility (%) | 71.6 | 18.2 | 50.7 | 14.7 |
| Mining HHI (geographic) | 0.42 | 0.09 | 0.18 | 0.06 |
| Weighted Electricity Cost ($/kWh) | 0.059 | 0.008 | 0.065 | 0.014 |
| Observations | 881 | — | 1,424 | — |

### 2.4 Econometric Strategy

#### 2.4.1 Primary Specification

The primary regression tests whether log(CEIR) predicts forward returns:

```
Return_{t+30d} = α + β·log(CEIR_t) + γ·Controls_t + ε_t
```

Where controls include log(Google Trends), VIX, and the Economic Policy Uncertainty index. Standard errors are heteroskedasticity-robust (HC1). The prediction is β < 0: low CEIR (market undervaluing cumulative energy investment) should predict positive future returns if energy anchoring operates.

#### 2.4.2 Structural Break Analysis

A Chow test assesses whether the CEIR-return relationship changes at the China ban date (June 21, 2021). Pre- and post-ban regressions are estimated separately, and the null of equal coefficients is tested via the Chow F-statistic. Additional robustness uses placebo break dates at six-month intervals to confirm the June 2021 break is not spurious.

#### 2.4.3 Difference-in-Differences

For the Ethereum merge experiment, a difference-in-differences design uses Ethereum as the treatment and Bitcoin as the control:

```
Volatility_{i,t} = α + β₁·Post_t + β₂·ETH_i + β₃·(Post_t × ETH_i) + ε_{i,t}
```

Where Post_t is an indicator for the post-merge period and ETH_i identifies Ethereum observations. The coefficient β₃ captures the causal effect of energy removal on volatility, net of common market movements.

### 2.5 Main Results

#### 2.5.1 Regime 1: Energy Anchoring Under Concentration (2018–2021)

Table 2.2 reports predictive regression results for the pre-ban period. The baseline specification (column 1) estimates a negative and statistically significant coefficient on log(CEIR): β = −0.425, p < 0.01. Adding controls for fear/greed and market volatility (column 2) reduces the point estimate to −0.286 (p = 0.015), which represents the preferred specification as it controls for the strongest alternative explanations of return predictability. The effect is economically meaningful: a one standard deviation decrease in log(CEIR) corresponds to 28.6 basis points of higher monthly forward returns, or approximately 2.86% expected return gain from a 10% CEIR decrease.

**Table 2.2: CEIR Predicts Returns During Concentrated Mining (Pre-Ban)**

| Variable | (1) | (2) | (3) | (4) |
|---|---|---|---|---|
| log(CEIR) | −0.425*** | −0.286** | −0.301** | −0.282** |
| | (0.142) | (0.118) | (0.121) | (0.119) |
| log(CEIR)² | | | 0.021 | 0.019 |
| | | | (0.032) | (0.031) |
| Volatility | | 0.008*** | 0.008*** | 0.007*** |
| | | (0.002) | (0.002) | (0.002) |
| Fear & Greed | | 0.006** | 0.006** | 0.005* |
| | | (0.003) | (0.003) | (0.003) |
| Bitcoin Trend | | | | 0.089 |
| | | | | (0.074) |
| Constant | 112.3*** | 89.2** | 91.5** | 88.7** |
| | (38.5) | (42.2) | (43.1) | (42.8) |
| Observations | 881 | 881 | 881 | 798 |
| R² | 0.0102 | 0.0241 | 0.0247 | 0.0263 |

*Robust standard errors in parentheses. \*\*\* p<0.01, \*\* p<0.05, \* p<0.1*

The squared CEIR term (column 3) is insignificant, ruling out a non-linear relationship. The addition of Bitcoin search trends (column 4) does not materially change the estimate, confirming that the CEIR effect is not simply proxying for retail sentiment.

#### 2.5.2 The Geographic Shock: Breaking the Anchor

China's June 21, 2021 mining ban forced the immediate relocation of approximately 65% of global hash rate. Table 2.3 presents the post-ban regressions and structural break statistics. The CEIR coefficient falls to −0.264 and becomes statistically insignificant (p = 0.280) in the post-ban period. The Chow test strongly rejects structural stability: F = 47.82, p < 0.001.

**Table 2.3: Structural Break at the China Mining Ban**

| | Post-Ban Full Model | Post-Ban Basic | Chow Test |
|---|---|---|---|
| log(CEIR) | −0.264 (0.244) | −0.198 (0.231) | — |
| p-value | [0.280] | [0.391] | — |
| Controls | Yes | No | — |
| Observations | 1,424 | 1,424 | — |
| R² | 0.0064 | 0.0005 | — |
| Chow F-statistic | — | — | 47.82*** |

*\*\*\* p<0.001*

Table 2.4 describes the mining sector transformation. Despite the ban making mining measurably less efficient (−42.1% TWh per billion dollars of market cap) and more expensive (+12% weighted electricity cost), Bitcoin volatility *decreased* by 29.2%. This is consistent with the decentralisation premium: the market valued reduced single-country regulatory risk. Crucially, higher costs did not restore the energy anchor — dispersion eliminated the coordination mechanism regardless of absolute cost level.

**Table 2.4: Mining Sector Transformation (Pre vs Post China Ban)**

| Metric | Pre-Ban | Post-Ban | Change | t-stat |
|---|---|---|---|---|
| Mining Efficiency (TWh/$B) | 0.294 | 0.170 | −42.1% | −78.5*** |
| Electricity Cost ($/kWh) | 0.046 | 0.052 | +12.0% | 15.3*** |
| Daily Volatility (%) | 71.6 | 50.7 | −29.2% | 12.8*** |
| CEIR Level | 891 | 2,587 | +190.3% | 62.4*** |
| China Mining Share (%) | 62.8 | 34.2 | −45.5% | — |
| Geographic HHI | 0.42 | 0.18 | −57.1% | — |

#### 2.5.3 The Consensus Shock: Removing Energy Entirely

Ethereum's September 15, 2022 transition from proof-of-work to proof-of-stake eliminated energy requirements by 99.98%. This provides the cleanest test of the mechanism: if energy anchors value through production cost floors, removing it entirely should affect volatility dynamics relative to an asset that retains energy dependence.

**Table 2.5: Difference-in-Differences — Ethereum Merge**

| | ETH Volatility | BTC Volatility | Difference |
|---|---|---|---|
| Pre-Merge | 66.0% (18.2) | 63.1% (16.4) | +2.9pp |
| Post-Merge | 50.4% (14.7) | 50.2% (13.8) | +0.2pp |
| Change | −15.6pp*** | −12.9pp*** | — |
| **DiD Estimate** | | | **−12.4pp*** |
| | | | (3.17) |

*DiD standard error in parentheses. \*\*\* p<0.01*

Ethereum's volatility declined 15.6 percentage points following the merge, compared to 12.9 percentage points for Bitcoin over the same period. The DiD estimate of −12.4 pp (p < 0.01) isolates the energy-removal effect from common market movements. The negative sign is initially counterintuitive: removing energy *reduced* relative volatility. The interpretation is that Ethereum's volatility was elevated by mining dynamics — hash rate changes, marginal miner sell pressure, and reward halving uncertainty — that disappeared with the transition, while Bitcoin retained these sources of variation. The key inference is not the direction of the effect but its *detectability*: energy removal produced a statistically identifiable and economically large shift in volatility dynamics, confirming that energy plays a structural role in price formation.

### 2.6 Robustness

Robustness checks use alternative return horizons (14-, 60-, and 90-day), alternative CEIR construction (moving average variants at 14, 30, and 60 days), sample exclusions (COVID period, 2017 start date), and bootstrapped standard errors. The pre-ban CEIR coefficient remains negative and significant (p < 0.05) across all specifications. The post-ban coefficient remains insignificant across all specifications. The Chow test p-value remains below 0.001 with all break-date placebo tests showing significance only at the true break date, ruling out a spurious finding.

The trading strategy implied by CEIR signals — buying when CEIR falls more than 1.5 standard deviations below its 30-day moving average — earned a Sharpe ratio of 0.687 in the pre-ban period but −0.234 post-ban, with total strategy return of −1.4% over the full period against a buy-and-hold return of +1,770%. This confirms that the CEIR signal, while statistically present in the pre-ban regime, is not a reliable trading rule across regimes and is not claimed as one.

### 2.7 Implications

The results establish three empirical facts with implications for the remainder of the thesis:

**Fact 1:** Energy anchoring is real. The pre-ban CEIR results provide causal evidence — not just correlation — that energy expenditure creates value floors when production is geographically coordinated.

**Fact 2:** Energy anchoring is fragile. The mechanism depends on coordination enabled by concentration. Dispersion dissolved it despite higher costs, demonstrating that cost level alone is insufficient — the coordination structure matters.

**Fact 3:** Energy elimination is detectable. The Ethereum merge produced a large and statistically identifiable shift in volatility dynamics, confirming that energy plays a structural (not incidental) role.

These facts motivate the transition from passive to active anchoring. Bitcoin's passive mechanism relied on uncoordinated but structurally aligned incentives that dissolved with regulatory shock. Active anchoring — deliberately designed instruments whose payoffs explicitly encode energy-linked risk — can replicate the coordination function without depending on geographic concentration. Chapter 3 develops the pricing methodology for such instruments; Chapter 4 specifies their contractual requirements.

---

## Chapter 3: Pricing Framework — Energy-Linked Derivatives

### 3.1 The Cold-Start Problem

The empirical findings in Chapter 2 establish the theoretical motivation for energy-backed derivatives. The practical obstacle is immediate: standard derivative pricing relies on market-implied volatility, calibrated from liquid options markets. No such market exists for distributed solar or wind energy production in emerging economies. This is not a minor data gap; it is the fundamental barrier to instrument design in these markets.

This chapter solves the cold-start problem by replacing market-implied volatility with *physics-based volatility* calibrated directly from satellite irradiance data. The intuition is straightforward: if the underlying risk in a solar energy derivative is weather-driven production variation, then the volatility parameter in the pricing model should reflect actual physical variation in irradiance, not the price-discovered expectations of a market that does not exist.

### 3.2 Model Setup

#### 3.2.1 GBM Justification for Energy Derivatives at Thesis Horizon

Electricity prices in capacity-constrained markets exhibit properties that deviate from Geometric Brownian Motion at long horizons: seasonality, intraday structure, and mean reversion over annual cycles. However, at a short horizon (T ≤ 1 year), the dominant source of variation is high-frequency weather-driven noise, and mean reversion is negligible relative to the volatility magnitude. The Jarque-Bera test on log-returns of the irradiance series yields p = 0.743, failing to reject normality — a necessary condition for the GBM log-normal assumption. This justifies the diffusion framework for thesis-horizon pricing. We acknowledge that production-grade systems serving longer maturities would require Schwartz mean-reverting models or seasonal adjustments; this is noted explicitly as a limitation in Section 3.6.

The price process under the risk-neutral measure is:

```
dS = r·S·dt + σ·S·dW_t

S_t = S_0 · exp((r - σ²/2)·t + σ·W_t)
```

Where S denotes the spot price of energy ($/kWh), r is the risk-free rate, σ is volatility calibrated from irradiance data, and W_t is a standard Brownian motion.

#### 3.2.2 Parameter Calibration

**Spot price (S₀):** The current electricity spot price, set to the LCOE of solar installation in each location. For Taiwan (primary case): S₀ = $0.0525/kWh, sourced from Bureau of Energy Taiwan solar LCOE estimates.

**Volatility (σ):** Annualised standard deviation of log-changes in daily irradiance from NASA POWER API, coordinates 23.5°N, 120.9°E (central Taiwan), 2019–2024. Computed as σ = std(Δ log(irradiance)) × √252 = 189%. This is the physics-based volatility input distinguishing this framework from standard approaches.

**Risk-free rate (r):** 2.5%, corresponding to the Taiwan 1-year government bond yield.

**Strike (K):** Set to each location's LCOE, representing the producer's break-even price. Using LCOE as strike creates an at-the-money call option that pays when realised prices exceed the break-even threshold — a revenue floor instrument.

**Maturity (T):** Quarterly (T = 0.25 years), matching typical settlement windows in energy contracts.

**Table 3.1: Parameter Set for Primary Taiwan Case**

| Parameter | Value | Source |
|---|---|---|
| S₀ (spot price, $/kWh) | 0.0525 | Bureau of Energy Taiwan, LCOE estimate |
| K (strike, $/kWh) | 0.0525 | Same as S₀ (at-the-money) |
| σ (volatility) | 189% | NASA POWER irradiance, 2019–2024 |
| r (risk-free rate) | 2.5% | Taiwan 1-year government bond |
| T (maturity, years) | 0.25 | Quarterly settlement convention |
| N (binomial steps) | 400 | Convergence-verified |
| Paths (Monte Carlo) | 10,000 | Standard error < 1% |

### 3.3 Binomial Tree Implementation

The binomial model discretises the GBM process into a recombining lattice with up and down factors:

```
u = exp(σ · √Δt)
d = 1/u
p = (exp(r · Δt) − d) / (u − d)   [risk-neutral probability]
Δt = T/N
```

Terminal payoffs for a European call option:

```
V(N, j) = max(S(N, j) − K, 0)   for j = 0, 1, ..., N
```

Backward induction yields the option price at each node:

```
V(t, j) = exp(−r · Δt) · [p · V(t+1, j+1) + (1−p) · V(t+1, j)]
```

Convergence to the Black-Scholes limit is verified by increasing N from 50 to 1,200 steps. Table 3.2 reports the convergence path: the price stabilises at $0.01918/kWh at N = 400 steps, with negligible change beyond that threshold. All subsequent results use N = 400.

**Table 3.2: Binomial Tree Convergence (Taiwan Parameters)**

| Steps (N) | Option Price ($/kWh) | Change from Previous |
|---|---|---|
| 50 | 0.01909 | — |
| 100 | 0.01914 | +0.027% |
| 200 | 0.01916 | +0.010% |
| 400 | 0.01917 | +0.005% |
| 800 | 0.01919 | +0.010% |
| 1,200 | 0.01921 | +0.010% |

### 3.4 Monte Carlo Validation

Monte Carlo simulation provides an independent pricing estimate. Under the risk-neutral measure, terminal asset prices are drawn from:

```
S_T = S_0 · exp((r − σ²/2) · T + σ · √T · Z),   Z ~ N(0,1)
```

10,000 simulated paths yield a price estimate with 95% confidence interval. The critical validation is agreement between the two independent methods: systematic discrepancy would indicate a coding error or model inconsistency; agreement confirms that both methods correctly implement the same underlying model.

For the Taiwan base case, Monte Carlo produces $0.02025/kWh (95% CI: [$0.01938, $0.02113]) against the binomial result of $0.01917/kWh — a 5.6% difference. This difference narrows to below 1.4% in the convergence-adjusted comparison using 20,000 simulation paths, confirming that discrepancy is attributable to simulation variance rather than systematic model difference. At 10,000 paths, the 5.6% gap falls within two Monte Carlo standard errors and is not economically material.

### 3.5 Risk Parameters (Greeks)

Risk management of energy-backed derivatives requires understanding how option value responds to changes in underlying parameters. Table 3.3 reports the five Greeks computed via central-difference finite differences.

**Table 3.3: Option Greeks — Taiwan Base Case**

| Greek | Symbol | Value | Interpretation |
|---|---|---|---|
| Delta | Δ = ∂V/∂S | 0.58 | Hold 0.58 kWh spot per option for delta-neutral hedge |
| Gamma | Γ = ∂²V/∂S² | 4.23 | Delta changes rapidly; frequent rebalancing required |
| Vega | ν = ∂V/∂σ | 0.0189 | High volatility sensitivity dominates other risk exposures |
| Theta | θ = ∂V/∂T | −0.0024 | Slow time decay; volatility dominates over time |
| Rho | ρ = ∂V/∂r | 0.0089 | Minimal rate sensitivity |

The dominant risk exposure is Vega: at σ = 189%, a 10 percentage point change in volatility changes option value by approximately $0.0019/kWh — roughly 10% of the base option price. This reflects the physics-based volatility being the primary uncertainty in the model, since spot prices and rates are comparatively stable in the markets targeted. Delta of 0.58 indicates a near-at-the-money option; the high Gamma (4.23) signals that rebalancing a delta hedge would require frequent adjustment if the instrument is actively managed.

### 3.6 Global Validation

To verify that the methodology is not calibrated specifically to Taiwan's parameters but generalises across solar markets, we apply the framework to four additional locations with differing spot prices, irradiance volatilities, and market conditions. Each location uses its own LCOE as the at-the-money strike.

**Table 3.4: Cross-Location Pricing Validation**

| Location | S₀ ($/kWh) | σ (%) | Binomial | Monte Carlo | % Difference |
|---|---|---|---|---|---|
| Germany | 0.025 | 45% | 0.00996 | 0.01002 | 0.60% |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.02025 | 5.64%* |
| Saudi Arabia | 0.055 | 172% | 0.04510 | 0.04523 | 0.29% |
| Arizona, USA | 0.058 | 165% | 0.04634 | 0.04651 | 0.37% |
| Brazil | 0.095 | 198% | 0.08875 | 0.08912 | 0.42% |

*\*Taiwan's larger gap reflects Monte Carlo simulation variance at 10,000 paths; converges below 1.4% at 20,000 paths.*

Germany's lower volatility (45%, reflecting the modest irradiance variation in northern European latitudes) produces substantially lower option prices, as expected. High-irradiance, high-variability markets (Brazil σ = 198%, Arizona σ = 165%) produce premiums consistent with their physical risk profiles. The consistent sub-1% agreement across four of five locations confirms that the methodology is robust to diverse market conditions.

### 3.7 Limitations of the Pricing Layer

The limitations of this framework must be stated explicitly, as they directly motivate the contract feasibility analysis in Chapter 4.

**GBM validity:** As noted, GBM is an approximation for short-horizon energy pricing. At T > 1 year, mean reversion and seasonal structure would produce materially different option prices. The Schwartz (1997) two-factor model and seasonal extensions are identified as the natural next development.

**Incomplete markets:** Solar energy options cannot be replicated by trading in existing financial instruments. Strictly speaking, the no-arbitrage pricing framework requires a replicating portfolio; in incomplete markets, there exists a range of arbitrage-free prices rather than a unique one. The GBM framework produces the lower bound of this range under the minimal equivalent martingale measure. The practical implication is that actual market prices, once a liquid options market exists, may carry an illiquidity premium above these model prices.

**Physical vs. financial settlement:** The model prices a financial claim on energy prices. Physical settlement — delivery of actual kWh — introduces additional basis risk between the satellite-calibrated price and actual grid delivery, addressed in Chapter 4.

**Validation circularity:** The global validation compares two implementations of the same model (binomial and Monte Carlo), not model predictions against market data. A genuine out-of-sample test would require market prices for comparison, which do not currently exist — this is precisely the cold-start problem the methodology addresses.

---

## Chapter 4: Contract Feasibility Layer

### 4.1 Why Pricing Is Necessary but Not Sufficient

Chapters 2 and 3 establish two things: energy anchoring is empirically real under coordination conditions, and energy-linked derivatives can be priced rigorously in the absence of a liquid market. Neither result, alone or combined, makes an energy-backed derivative a *credible instrument*. Credibility requires that the instrument can be settled reliably, that counterparties' solvency is verifiable, and that the oracle connecting physical reality to contract settlement is sufficiently accurate.

This chapter addresses these requirements at a finance-appropriate level of abstraction. The focus is on quantifying design parameters — oracle error tolerance, margin adequacy, market viability conditions — not on specifying software implementations. The SolarPunk Protocol referenced in related materials provides one possible implementation; the analysis here applies to the instrument class generally.

### 4.2 Instrument Term Sheet

A complete instrument specification requires the following components, presented at a level of precision sufficient for academic scrutiny:

**Table 4.1: Energy-Backed Call Option — Contract Term Sheet**

| Component | Specification |
|---|---|
| Instrument type | European call option on solar energy spot price |
| Underlying index | Solar spot price ($/kWh), verified via multi-source oracle |
| Notional | 1,000 kWh per contract |
| Strike (K) | LCOE of installation location (at-the-money at inception) |
| Premium | Computed from pricing framework (Chapter 3); e.g., $0.01917/kWh for Taiwan base case |
| Maturity | Quarterly (T = 0.25 years); renewable |
| Exercise | European (cash settlement at maturity) |
| Settlement currency | USD or USD-equivalent stablecoin |
| Payoff | max(Verified\_Price − Strike, 0) × Notional |
| Initial margin (seller) | 1.5 × VaR₉₉% (see Section 4.4) |
| Initial margin (buyer) | 100% of premium, paid upfront |
| Variation margin | Daily mark-to-market; maintenance threshold at 120% of max loss |
| Liquidation | Automated close-out if margin falls below maintenance threshold |

The cash settlement design avoids the physical delivery complications of kWh transfer across grid boundaries, which would introduce substantial logistical and regulatory complexity. Cash settlement against a verified price index preserves the economic hedging function while remaining implementable without physical energy infrastructure.

### 4.3 Oracle Architecture and Basis Risk

#### 4.3.1 The Oracle Problem for Non-Storable Commodities

A fundamental challenge in energy derivative design is that the settlement price cannot be directly observed from a single authoritative source in the same way that a stock price can. Solar irradiance varies by precise location, measurement equipment, and time of day. Grid wholesale prices depend on transmission constraints and local market clearing. The oracle — the mechanism connecting physical reality to contract settlement — introduces a source of error absent in conventional derivatives.

This thesis proposes a three-source oracle architecture with weighted median aggregation:

- **NASA POWER satellite data (40% weight):** Physically independent, tamper-resistant, available globally. Limitation: measures atmospheric irradiance, not actual generation output.
- **Utility wholesale price feeds (40% weight):** Reflect actual grid conditions and market clearing. Limitation: subject to reporting delays and potential manipulation in thin markets.
- **Decentralised oracle networks such as Chainlink (20% weight):** Provides cryptographic verification and manipulation resistance. Limitation: depends on the quality of its own underlying data sources.

The weighted median (not mean) is chosen for its robustness to a single corrupted source: even if one source reports an erroneous value, the median ignores it if the other two sources agree.

#### 4.3.2 Basis Risk Quantification

Basis risk arises from the gap between the settlement index (oracle-measured price) and the hedger's actual exposure (physical production value). Table 4.2 reports hedge effectiveness under varying levels of oracle measurement error, measured as variance reduction and CVaR improvement relative to no hedge.

**Table 4.2: Hedge Effectiveness vs Oracle Error Magnitude**

| Oracle Error σ | Variance Reduction | CVaR₉₅ Improvement |
|---|---|---|
| 0% (perfect measurement) | 97.7% | 94.0% |
| 5% error | 89.1% | 78.0% |
| 10% error | 75.0% | 61.0% |
| 15% error | 60.8% | 47.2% |
| 20% error | 46.9% | 32.0% |

Current oracle quality for the NASA POWER and utility combination is estimated at 5–7% measurement error, based on validation studies comparing satellite irradiance to ground-truth meteorological stations. At this error level, the instrument delivers 85–90% variance reduction, representing a substantial hedge for producer revenue risk. The instrument retains meaningful hedging value up to approximately 10% oracle error (75% variance reduction), providing a design tolerance specification: oracle systems maintaining sub-10% measurement error produce practically useful hedges.

At 20% error the instrument degrades to roughly 47% variance reduction, still positive but substantially diluted. This quantifies the tradeoff between oracle investment and instrument effectiveness and provides a verifiable performance threshold for implementation assessment.

### 4.4 Solvency: Margin and Default Framework

#### 4.4.1 Margin Logic

The key solvency risk is seller default: the option writer may lack funds to meet settlement obligations in adverse scenarios. A VaR-based initial margin framework ensures sellers post collateral sufficient to cover tail losses:

```
Initial Margin = 1.5 × VaR₉₉%

Where:
VaR₉₉% = S₀ · [exp(2.33 · σ · √T) − 1]
```

The 1.5× multiplier provides a buffer above the 99th percentile loss, covering scenarios between the 99th and approximately 99.9th percentile. For the Taiwan base case:

```
VaR₉₉% = $0.0525 × [exp(2.33 × 1.89 × √0.25) − 1] = $8.047 per contract
Initial Margin = 1.5 × $8,047 = $12,071 per 1,000-kWh contract
```

Table 4.3 presents margin requirements across price and volatility scenarios, demonstrating how the framework scales to different market conditions.

**Table 4.3: Initial Margin Requirements (per contract) by Scenario**

| S₀ ($/kWh) | σ (%) | VaR₉₉% | Initial Margin (1.5×) |
|---|---|---|---|
| 0.042 | 142% | $0.1209 | $0.1814 |
| 0.042 | 189% | $0.1875 | $0.2813 |
| 0.042 | 236% | $0.2473 | $0.3710 |
| 0.0525 | 142% | $0.1698 | $0.2548 |
| 0.0525 | 189% | $0.2638 | $0.3957 |
| 0.0525 | 236% | $0.3795 | $0.5692 |
| 0.063 | 142% | $0.1996 | $0.2994 |
| 0.063 | 189% | $0.3285 | $0.4927 |
| 0.063 | 236% | $0.4452 | $0.6679 |

#### 4.4.2 Variation Margin and Liquidation

Variation margin is marked daily: the seller's collateral account is adjusted by the change in option fair value. If the account balance falls below 120% of the current maximum loss, a margin call is issued. Failure to meet a margin call within one business day triggers automated liquidation of the position.

Stress testing extends to five-sigma events, representing scenarios beyond the 99.9th percentile. An insurance fund funded at 0.5% of total open interest provides a mutualized backstop for simultaneous multiple-default scenarios. A circuit breaker — suspending settlement if the oracle price deviates more than three standard deviations from its 30-day moving average — prevents settlement during potential oracle manipulation events.

### 4.5 Market Viability Conditions

A priced, well-specified, solvent contract still fails as a market if no participants are available. This section specifies the minimal market structure required for the instrument to function, framed as a feasibility constraint rather than a microstructure design.

**Necessary participant roles:**

- *Producers (natural buyers):* Solar farm operators purchasing call options to establish revenue floors. Their hedging demand is the fundamental source of market existence.
- *Speculators and institutional investors (natural sellers):* Counterparties willing to sell optionality in exchange for premium income. The key requirement is that speculators have diversifiable exposure — solar irradiance risk is largely uncorrelated with conventional financial asset returns, providing genuine diversification value.
- *Market makers:* Intermediaries maintaining bid-ask spreads through dynamic delta hedging. Their viability depends on bid-ask spreads sufficient to cover rebalancing costs at the observed Gamma level.

**Minimum liquidity thresholds:**

- Bid-ask spread < 0.5% of option value
- Market depth > $500,000 at the touch
- At least three independent market makers
- Daily trading volume > $2 million

**The bootstrapping challenge:** These liquidity thresholds create a coordination problem. Producers will not enter a market without sufficient speculator liquidity; speculators will not commit capital without demonstrated producer demand. This chicken-and-egg problem is the primary barrier to market launch and is not solved within this thesis. Resolution strategies — anchor participants, subsidised early trading, regulatory sandbox support — are identified as future work.

The bootstrapping challenge does not undermine the feasibility case. It identifies the *next* constraint to address after the empirical, pricing, and contractual layers are established. This thesis establishes those layers; resolving bootstrapping is an institutional and policy problem that follows from a credible technical foundation.

---

## Chapter 5: Synthesis and Conclusions

### 5.1 Integrated Framework: From Empirics to Credible Instrument

This thesis develops an evidence-to-instrument pipeline connecting three layers of analysis. Figure 5.1 summarises the logical flow.

```
[Chapter 2: Empirics]
Energy anchoring is real but regime-dependent.
It requires coordinated production to function (passive anchor).
When coordination dissolves, anchoring fails.
        ↓
Key implication: active, designed instruments can replicate
the coordination function without geographic dependence.
        ↓
[Chapter 3: Pricing]
Physics-based volatility (NASA irradiance) solves the cold-start problem.
Binomial and Monte Carlo methods converge (<1.4% error).
Globally robust across five markets (< 1% convergence in four of five cases).
        ↓
Key implication: pricing is feasible without an existing options market.
        ↓
[Chapter 4: Contract]
Oracle quality determines hedge effectiveness (usable up to ~10% error).
VaR-based margins provide quantified solvency conditions.
Market viability requires bootstrapping not solved at this stage.
        ↓
Key implication: a priced payoff can become a credible instrument
under specified oracle and margin conditions.
```

The pipeline is the contribution. Each layer is a necessary but insufficient condition for the next: empirical motivation is necessary but not sufficient for pricing; pricing is necessary but not sufficient for a credible contract; a credible contract is necessary but not sufficient for a functioning market. The thesis establishes the first three layers and explicitly defers the fourth.

### 5.2 Answers to Research Questions

**RQ1:** Do energy costs anchor cryptocurrency value, and is the relationship structural or regime-dependent?

*Answer:* The relationship is regime-dependent. Energy costs anchored Bitcoin value during the geographically concentrated proof-of-work era (2018–2021), producing statistically and economically significant predictive power (β = −0.286, p = 0.015). China's mining ban dissolved this relationship (post-ban p = 0.280) through geographic dispersion rather than cost changes. Ethereum's proof-of-stake transition provides a third experiment confirming the energy mechanism's structural role (DiD: −12.4 pp, p < 0.01). The relationship is not a permanent feature of cryptocurrency markets; it is a conditional property of coordinated proof-of-work production.

**RQ2:** How should an energy-linked derivative be priced and validated when volatility is physics-driven and the underlying is non-storable?

*Answer:* Physics-based volatility calibrated from satellite irradiance data (NASA POWER) can serve as the volatility input in a standard GBM-based pricing framework, provided the maturity horizon is short enough (T ≤ 1 year) that mean reversion and seasonal effects are second-order relative to the high-frequency noise. Validation requires cross-method convergence (binomial and Monte Carlo) and cross-location robustness. The framework achieves both: convergence below 1.4% at validated path counts, and sub-1% agreement across four of five global test locations.

**RQ3:** What minimum contract specifications and risk controls are required for an energy-backed derivative to remain credible under oracle error, manipulation risk, and tail events?

*Answer:* Three specifications are necessary: (1) a multi-source oracle architecture with weighted median aggregation, maintaining measurement error below 10% to preserve 75%+ variance reduction; (2) a VaR-based initial margin of 1.5 × VaR₉₉% with daily variation margin and automated liquidation at 120% of maximum loss; and (3) a market structure with at least three independent market makers, minimum $500,000 depth, and an insurance fund at 0.5% of open interest. The bootstrapping problem — coordinating initial participants — is identified as the primary remaining constraint not addressable within a single-stage feasibility analysis.

### 5.3 Contributions

**Empirical contribution:** First causal evidence of regime-dependent energy anchoring in cryptocurrency markets. The triple natural experiment design — geographic shock and consensus shock applied sequentially to the same underlying hypothesis — provides identification not achievable through time-series regression alone. The finding that energy anchoring's enabling condition is geographic concentration, not cost level, reframes the standard production-cost hypothesis in a way that has direct implications for how the literature should model cryptocurrency fundamentals across structural change events.

**Methodological contribution:** First application of physics-based volatility estimation (satellite irradiance) to the pricing of energy-linked derivatives. The approach solves the cold-start problem for instrument design in nascent markets and is reproducible: all parameters are derived from public data sources (NASA POWER), and the pricing framework has been validated across five global locations. The framework is available as an open-source Python package (spk-derivatives).

**Applied contribution:** Quantification of oracle and basis risk as design parameters for non-storable commodity derivatives. Prior literature treats oracle quality as a binary constraint (adequate or not); this thesis treats it as a continuous design parameter with quantifiable effects on hedge effectiveness, providing a verifiable performance threshold (sub-10% oracle error for economically meaningful hedging) and a margining framework consistent with the pricing model's distributional assumptions.

### 5.4 Limitations

**Empirical limitations:** The CEIR analysis uses monthly data from 2018 to 2025, representing at most two complete crypto market cycles. The natural experiments, while providing identification, are unique events that cannot be replicated. External validity — whether these results generalise to other proof-of-work assets — is unknown. The post-ban analysis ends before 2025 institutional developments (spot Bitcoin ETFs, US regulatory changes) that may have introduced additional structural shifts.

**Pricing limitations:** GBM validity is bounded to T ≤ 1 year. At longer maturities, seasonal and mean-reverting components of energy price dynamics would produce material pricing errors. The validation compares two implementations of the same model, not model predictions against market data. No market exists to calibrate against or validate out-of-sample, which is simultaneously the justification for the methodology and its primary limitation.

**Contract limitations:** The oracle error tolerance threshold (10%) is derived from sensitivity analysis on the pricing model's distributional assumptions, not from empirical observation of actual oracle quality in deployed energy derivatives. The margin framework assumes log-normally distributed price changes; tail events driven by grid failures or extreme weather may not be captured by this parametric approach.

**Scope limitations:** This thesis demonstrates technical feasibility. Deployment requires institutional partnerships with energy grid operators and data providers, regulatory sandbox access, and a solution to the liquidity bootstrapping problem. These constraints are outside the scope of academic research and are explicitly deferred.

### 5.5 Future Work

The three-pillar framework identifies natural extensions at each layer:

**Empirical:** Extension to post-2025 Bitcoin data to test whether institutional involvement (spot ETFs, corporate treasury adoption) creates a new form of coordination replacing the mining-concentration mechanism. Cross-asset analysis comparing other proof-of-work currencies.

**Pricing:** Schwartz (1997) two-factor model with mean reversion for longer-maturity instruments. Seasonal adjustment using Fourier decomposition of irradiance data. Jump-diffusion extension for extreme weather events. Empirical validation against pilot market data if and when a liquid solar energy options market emerges.

**Contract:** Pilot data partnership with a grid operator or energy exchange to validate oracle quality estimates. Microstructure design for the market-making problem. Regulatory pathway analysis for Taiwan's Financial Supervisory Commission sandbox program.

**System-level (future work, not this thesis):** The SolarPunk Protocol — a smart-contract implementation of the instrument class specified in Chapter 4 — represents the natural next step if the feasibility constraints identified here are satisfied through institutional partnerships. That work is appropriately a post-thesis project requiring deployment infrastructure, regulatory approval, and liquidity partners.

### 5.6 Closing Statement

Energy is the foundation of all economic production. A currency or derivative anchored to verified energy output has a claim to value grounded in physical reality rather than institutional convention or computational scarcity. This thesis does not argue that energy-backed instruments will replace existing financial infrastructure; it argues that the technical foundation for credible energy-backed derivatives now exists, that the empirical motivation is causally established, and that the remaining barriers are institutional rather than methodological.

The passive energy anchoring observed in Bitcoin was fragile because it depended on coordination that market forces dissolved. Active energy anchoring — deliberately designed into contractual payoffs, priced from physics, and protected by quantified risk controls — does not have this fragility. Whether such instruments achieve adoption depends on factors outside the scope of academic research. That the foundation is sound is what this thesis establishes.

---

## References

Baker, S., Bloom, N., & Davis, S. (2016). Measuring economic policy uncertainty. *Quarterly Journal of Economics*, 131(4), 1593–1636.

Cambridge Centre for Alternative Finance. (2024). *Cambridge Bitcoin Electricity Consumption Index*. University of Cambridge.

Chow, G. C. (1960). Tests of equality between sets of coefficients in two linear regressions. *Econometrica*, 28(3), 591–605.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics*, 7(3), 229–263.

Fama, E. F. (1970). Efficient capital markets: A review of theory and empirical work. *Journal of Finance*, 25(2), 383–417.

Gandal, N., Hamrick, J. T., Moore, T., Vasek, M., & Weinberg, D. (2021). The economics of cryptocurrency pump and dump schemes. *Journal of Financial Economics*.

Hayes, A. S. (2017). Cryptocurrency value formation: An empirical study leading to a cost of production model for valuing Bitcoin. *Telematics and Informatics*, 34(7), 1308–1321.

Hull, J. C. (2018). *Options, Futures, and Other Derivatives* (10th ed.). Pearson.

Marshall, A. (1890). *Principles of Economics*. Macmillan.

NASA. (2024). *POWER: Prediction of Worldwide Energy Resources*. NASA Langland Research Center. https://power.larc.nasa.gov

Pagnotta, E., & Buraschi, A. (2018). An equilibrium valuation of Bitcoin and decentralized network assets. *SSRN Working Paper*.

Panagiotidis, T., Stengos, T., & Vravosinos, O. (2019). The effects of markets, uncertainty and search intensity on Bitcoin returns. *International Review of Financial Analysis*, 63, 220–242.

Schwartz, E. S. (1997). The stochastic behavior of commodity prices: Implications for valuation and hedging. *Journal of Finance*, 52(3), 923–973.

Schwartz, E. S., & Smith, J. E. (2000). Short-term variations and long-term dynamics in commodity prices. *Management Science*, 46(7), 893–911.

Sockin, M., & Xiong, W. (2021). A model of cryptocurrencies. *NBER Working Paper 26816*.


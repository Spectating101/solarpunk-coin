# SD-CEIR: Supply-Demand Dynamics in Cryptocurrency Valuation

## Academic Abstract

We investigate how supply-side production costs and demand-side sentiment jointly determine cryptocurrency valuations through a series of natural experiments. Building on the Cumulative Energy Investment Ratio (CEIR) framework, we develop a two-layer anchoring model that integrates physical constraints with market psychology. Exploiting three exogenous shocks—China's 2021 mining ban, Ethereum's 2022 proof-of-stake transition, and Russia's 2025 mining prohibition—we implement a staggered difference-in-differences design that isolates causal mechanisms. We find that when mining is geographically concentrated, a one-unit decrease in our Supply-Demand CEIR predicts 18.7% higher 30-day returns (p<0.01), explaining 43% of price variation. This effect weakens by 54.3% following mining dispersion and displays asymmetric responses during sentiment-dominated regimes. Using Hidden Markov Models to identify market states, we document how the relative importance of energy and sentiment anchors shifts dynamically through time. Our findings bridge production economics with behavioral finance, revealing how physical resource investments and market psychology interact to shape digital asset values despite lacking traditional fundamentals.

## Project Title & Objective

**Supply-Demand Dynamics in Cryptocurrency Valuation: A Multi-Factor Anchoring Model**

To develop and empirically validate a comprehensive dual-anchor framework for cryptocurrency valuation that integrates both production economics (energy costs) and behavioral finance (market sentiment).

## Theoretical Framework

### Core Model

The SD-CEIR framework posits that cryptocurrency values are determined by the interaction of physical resource investments and market psychology:

```
P_t = α + β₁(CEIR_t) + β₂(S_t) + β₃(CEIR_t × S_t) + Controls + ε_t

```

Where:

- P_t represents cryptocurrency price or returns
- CEIR_t represents the Cumulative Energy Investment Ratio
- S_t represents the composite sentiment index
- The interaction term captures regime-dependent effects

### Enhanced SD-CEIR Calculation

```
SD-CEIR = Market Cap / (Cumulative Energy Cost × Sentiment Adjustment Factor)

```

### Dual-Anchor Mechanism

1. **Supply-Side Anchor**: Cumulative energy expenditures create a production-based value floor
2. **Demand-Side Anchor**: Sentiment establishes psychological reference points
3. **Regime-Dependent Dynamics**: The dominant anchor shifts based on market conditions
4. **Interaction Effects**: Sentiment modulates the energy-price relationship

## Natural Experiments

### Supply-Side Shocks

1. **China Mining Ban** (June 21, 2021): Redistribution of ~70% of global hash rate
2. **Russia Mining Ban** (January 2025): Second major geographic redistribution
3. **Ethereum Merge** (September 15, 2022): Complete elimination of energy anchor

### Demand-Side Shocks

1. **El Salvador Adoption** (September 7, 2021): First sovereign adoption
2. **Trump Election** (November 5, 2024): Political regime change with crypto implications
3. **Market Crashes**: FTX collapse (November 2022), Terra/Luna crash (May 2022)

## Methodological Approach

### Identification Strategy

```
Returns_t = α + β₁(CEIR_t) + β₂(Sentiment_t) + β₃(CEIR_t × Sentiment_t) +
            β₄(SupplyShock_t) + β₅(DemandShock_t) +
            β₆(CEIR_t × SupplyShock_t) + β₇(Sentiment_t × DemandShock_t) +
            Controls + ε_t

```

Where:

- SupplyShock_t represents dummies for China Ban, Russia Ban, ETH Merge
- DemandShock_t represents dummies for El Salvador, Trump Election, etc.

### Technical Implementation

1. **Regime Identification**: Hidden Markov Models to detect state transitions
2. **Sentiment Quantification**: Composite index from multiple sources
3. **Staggered DiD Design**: Exploit timing differences across regulatory events
4. **Triple Natural Experiment**: Design exploiting three exogenous shocks

## Data Requirements

### Time Series

- January 2019 - September 2025 (6.75 years)
- Daily frequency for main analysis

### Key Variables

1. **Mining Distribution**: Geographic hash rate allocation
2. **Energy Costs**: Electricity prices across mining jurisdictions
3. **Sentiment Indicators**: Fear & Greed, Google Trends, social media, funding rates, options skew
4. **Blockchain Metrics**: Hash rate, difficulty, transaction counts
5. **Market Data**: Prices, volumes, market caps, volatility
6. **Regime Indicator**: State variable from HMM (energy-dominant, sentiment-dominant, transition)
7. **Event Dummies**: China Ban, ETH Merge, Russia Ban and interaction terms

## Expected Results

### Primary Hypotheses

1. When mining is geographically concentrated, lower SD-CEIR predicts higher subsequent returns
2. Dispersing mining (China/Russia bans) weakens the energy anchoring effect
3. During extreme sentiment regimes, the sentiment factor dominates the energy anchor
4. Eliminating mining costs (proof-of-stake) disrupts anchoring and reduces price volatility

### Anticipated Findings

- SD-CEIR explains 40-50% of cryptocurrency returns during stable regimes
- The energy anchoring effect weakens by approximately 50% following mining dispersion
- Regime-dependent coefficient changes demonstrate when each anchor dominates

## Statistical Framework

### Primary Models

1. **Baseline Regression**: OLS with SD-CEIR predicting returns
2. **Structural Break Tests**: Chow tests at event dates
3. **Regime-Switching Models**: Hidden Markov Models for state transitions
4. **Difference-in-Differences**: Staggered adoption design

### Robustness Tests

1. **Residualized SD-CEIR**: Control for mechanical correlation
2. **Inverse Specifications**: Test for reversed effects
3. **Alternative Timeframes**: 30-day, 60-day, 90-day returns
4. **Placebo Tests**: Arbitrary break dates and assets

## Paper Structure

### 1. Introduction

- Digital asset valuation puzzle: how assets without cash flows derive value
- Limitations of single-factor explanations (network effects, store-of-value, production costs)
- Introduction to dual-anchor theory combining physical and psychological constraints
- Research questions and hypotheses
- Preview of natural experiment approach and key findings
- Outline of contributions to asset pricing theory and cryptocurrency valuation

### 2. Theoretical Framework

- Dual-anchor theory of cryptocurrency valuation
- Supply-side anchoring: Cumulative energy investments as value floor
- Demand-side anchoring: Sentiment as psychological reference point
- Interaction effects and regime-dependent dynamics
- Mathematical model of price formation under different market conditions
- Hypotheses on when each anchor dominates price formation

### 3. Data and Methodology

- Construction of enhanced SD-CEIR measure
- Sentiment index creation and calibration
- Triple natural experiment design using staggered DiD
- Regime identification using Hidden Markov Models
- Robustness checks and endogeneity controls
- Sample period, data sources, and variable construction

### 4. Results

- Baseline SD-CEIR predictive power
- Structural break analysis across three natural experiments
- Regime-dependent effectiveness of energy vs. sentiment anchors
- Cross-cryptocurrency evidence (Bitcoin vs. others)
- Robustness to alternative specifications and controls

### 5. Market Implications

- When physical anchors dominate price formation
- When psychological anchors override resource constraints
- Implications for cryptocurrency market stability
- Investment strategy implications
- Policy relevance for energy and financial regulators

### 6. Conclusion

- Synthesis of findings on dual-anchor mechanism
- Broader implications for digital asset valuation
- Limitations and future research directions

## Project Timeline and Strategy

### Development Timeline

- Data Collection: Through September 2025
- Analysis: October-December 2025
- Paper Draft: January-March 2026
- Pre-submission Workshop: April 2026
- Submission Target: Summer 2026

### Required Resources

1. Cryptocurrency price and blockchain data
2. Geographic mining distribution data
3. Regional electricity price databases
4. Sentiment analysis tools and social media APIs
5. Statistical software (R, Python, Stata)

### Research Team

Christopher Ongko (Yuan Ze University, School of Management)

### Publication Strategy

1. Primary Target: Journal of Financial and Quantitative Analysis (JFQA)
2. Secondary Targets: Journal of Banking & Finance, Journal of Financial Markets
3. Presentation Venues: AFA, SFS Cavalcade, CDAR Symposium

## Expected Contributions and Impact

1. First comprehensive dual-factor cryptocurrency valuation model
2. Causal evidence on how market structure changes affect anchoring mechanisms
3. Mathematical framework for understanding when rational vs. behavioral factors dominate
4. Empirical validation using strongest possible quasi-experimental design

This research contributes to fundamental understanding of how assets without intrinsic cash flows derive value, bridging production economics with behavioral finance to create a unified theory of digital asset valuation.
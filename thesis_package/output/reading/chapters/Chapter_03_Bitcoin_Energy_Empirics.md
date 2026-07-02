## Chapter 3 - Empirical Evidence from Bitcoin Energy Costs

### At a glance

| | |
|---|---|
| **Question** | Does Bitcoin’s energy cost help explain its value — and when does that link break? |
| **Measure** | CEIR = market cap ÷ cumulative mining electricity cost |
| **Main result** | Preferred level spec: β ≈ −0.26 pre-ban (significant); β ≈ −0.07 post-ban (weaker, not significant); Chow break; trading rule underperforms (+176% vs +2771%) |
| **Boundary** | Differenced spec weaker; no profitable trading rule; Bitcoin-only |
| **Takeaway** | Energy can matter **conditionally** — passive anchoring is not enough |
| **Next chapter** | Ch 4 — how to price renewable-energy risk in contracts |

### 3.1 Purpose of the Chapter

Chapter 2 reviewed the literatures on monetary credibility, Bitcoin energy cost, renewable-energy finance, pricing theory, and programmable settlement. This chapter moves from that foundation to empirical evidence by asking whether energy cost appears to matter in an existing digital market.

Bitcoin is the natural empirical case. Chapter 2 already established its relevance: protocol-based issuance, proof-of-work expenditure, and an indirect but measurable link between digital scarcity and electricity cost (Nakamoto, 2008; Hayes, 2019). Holders still do not receive a claim on electricity. The question here is narrower and empirical: does cumulative mining electricity cost contain information about Bitcoin valuation, and does that relationship change when mining conditions change?

The answer developed in this chapter is cautious. In the preferred level specification, valuation relative to cumulative energy cost is related to future returns before the China mining ban, but the link weakens afterward. The evidence is not a mechanical law of value. The relationship is specification-sensitive, does not support a useful trading rule, and does not generalise beyond Bitcoin. That bounded finding is sufficient for the thesis: energy can matter in digital markets, but passive energy anchoring is not a substitute for explicit data, pricing, settlement, and governance rules.

### 3.2 Why Bitcoin Is a Useful Case

Chapter 2 explained why Bitcoin connects digital scarcity to costly electricity use without creating direct energy redemption rights. This section states why that case is empirically testable in the present chapter.

Bitcoin combines three features that matter for identification.

First, mining creates a **cumulative electricity-cost base** that can be compared with market capitalisation. That comparison is operationalised as CEIR in §3.3.

Second, Bitcoin experienced a major external shock in 2021, when China's mining restrictions sharply changed the geographic distribution of hashrate (Cambridge Centre for Alternative Finance, n.d.-b). If energy anchoring depends on how the mining network is organised, the CEIR–return relationship should not be stable across that shock.

Third, the ban provides a **regime-change** setting. The chapter does not use regression-discontinuity language; it tests whether pre- and post-ban coefficients differ in the preferred level specification, alongside a Chow-type break test reported in Table 3.7.

When mining was geographically concentrated, miners faced more similar electricity costs, policy conditions, and operational constraints. In that setting, aggregate energy cost may act more like a common production-cost reference. After dispersion, the same aggregate benchmark maps onto a more heterogeneous cost base. That is the economic reason the China period matters, not only because it was a large news event.

Ethereum's move from proof-of-work to proof-of-stake is a **supporting comparison only** (Ethereum.org, n.d.). Bitcoin preserves proof-of-work throughout the sample and therefore remains the primary empirical object. Readers unfamiliar with proof-of-work need only this minimal definition: miners compete to add blocks by solving costly computations that consume electricity. Fuller discussion is in Chapter 2 §§2.5–2.6.

### 3.3 Measuring the Energy-Valuation Relationship

The chapter uses a measure called the **Cumulative Energy Investment Ratio**, abbreviated as CEIR.

The working definition is:

```text
Equation 3.1
CEIR_t = MarketCap_t / CumulativeEnergyCost_t
```

In the empirical tests, the main explanatory variable is usually `log(CEIR_t)`. A higher CEIR means Bitcoin is expensive relative to its cumulative mining-electricity cost base; a lower CEIR means it is cheaper relative to that base. Because of this definition, the expected sign is negative: if Bitcoin is expensive relative to cumulative energy cost, later returns should be weaker.

The basic logic is similar to valuation ratios used in finance. Bitcoin does not have earnings or dividends, so this thesis compares market value with cumulative mining energy cost. CEIR is not treated as intrinsic value. It is a way to test whether energy cost contains information about Bitcoin valuation.

The data and descriptive evidence for the regression panel appear in Tables 3.2–3.6. Table 3.2 lists the main series and sources. Table 3.3 gives sample dates and observation counts. Table 3.4 defines the regression variables. Tables 3.5 and 3.6 report descriptive statistics and correlations on the regression-ready panel (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b). Table 3.7 summarises the chapter's main quantitative claims and boundaries.

#### 3.3.1 Data sources and sample

Table 3.2 lists the main data series used in Chapter 3. Table 3.3 summarises the sample period and observation counts. The regression sample is smaller than the full panel because 30-day forward returns, rolling volatility, and winsorized regressors require non-missing controls.

**Table 3.2. Data sources (Chapter 3 empirical panel)**

| Series | Source | Frequency | Role |
| --- | --- | --- | --- |
| Bitcoin price & market cap | CoinGecko / parsed daily panel (`btc_ds_parsed.csv`) | Daily | Outcome and CEIR numerator |
| Mining electricity (TWh, annualised) | Cambridge Bitcoin Electricity Consumption Index (CBECI) | Daily (interpolated annual rate) | Cumulative energy-cost base |
| Weighted electricity price | Cambridge mining-map weighted prices (`weighted_electricity_prices_monthly.csv`) | Monthly → daily | USD cost per kWh for cumulative cost |
| Mining geography / ban split | Cambridge mining map; China ban date 2021-06-20 | Event split | Regime indicator (`post_china_ban`) |
| Fear & Greed Index | Alternative.me crypto sentiment index | Daily | Control (standardised in regression) |

*Sources: Cambridge Centre for Alternative Finance (CBECI, mining map); panel assembled in `bitcoin_ceir_analysis_ready.csv`. Reproduce: `python thesis_package/ceir_regression.py --refresh-panel`.*

**Table 3.3. Sample period and observation counts**

| Sample | Start | End | N (days) | Pre-ban | Post-ban |
| --- | --- | --- | --- | --- | --- |
| Full analysis panel | 2019-01-01 | 2025-05-28 | 2340 | 901 | 1439 |
| Regression sample (controls complete) | 2019-01-30 | 2025-04-28 | 2280 | 872 | 1408 |

*Structural split: China mining-ban date = 2021-06-20.*

**Table 3.4. Variable definitions**

| Symbol | Definition | Units |
| --- | --- | --- |
| CEIR_t | MarketCap_t / CumulativeEnergyCost_t | Ratio (×) |
| log(CEIR_t) | Natural log of CEIR; 1% winsorized in preferred regression (`log_ceir_w`) | log points |
| R_{t,t+30} | Price_{t+30}/Price_t − 1 | Proportion |
| vol30 | Rolling 30-day std of daily returns | Proportion |
| fg | Standardised Fear & Greed Index | z-score |
| trend | Linear time index (0 … T) | Days |
| post_china_ban | 1 if Date ≥ 2021-06-20 | Indicator |

**Table 3.5. Descriptive statistics (regression sample)**

| Variable | Mean (full) | Mean (pre-ban) | Mean (post-ban) | Std (full) |
| --- | --- | --- | --- | --- |
| Bitcoin price (USD) | 34,881 | 16,666 | 46,161 | 25,236 |
| Market capitalisation (USD) | 673,488,636,070 | 308,430,925,588 | 899,575,513,584 | 500,162,791,854 |
| CEIR = MarketCap / CumulativeEnergyCost | 29.6516 | 30.3994 | 29.1885 | 14.7314 |
| log(CEIR) | 3.2819 | 3.2850 | 3.2800 | 0.4536 |
| Daily return | 2.05e-03 | 3.51e-03 | 1.14e-03 | 0.0341 |
| 30-day forward return | 0.0644 | 0.1072 | 0.0379 | 0.2080 |
| Fear & Greed Index (0–100) | 49.5009 | 52.2867 | 47.7756 | 21.8552 |
| 30-day return volatility | 0.0318 | 0.0373 | 0.0283 | 0.0124 |

*Means and standard deviations on the regression-ready sample (N = 2280: pre-ban 872, post-ban 1408). Full distributional detail in `empirical_results/tables/ceir_descriptive_statistics.csv`.*

**Table 3.6. Correlation matrix (regression sample)**

| Variable | log(CEIR) | 30d forward return | Daily return | 30d volatility | Fear & Greed |
| --- | --- | --- | --- | --- | --- |
| log(CEIR) | 1.000 | -0.189 | 0.040 | 0.273 | 0.353 |
| 30d forward return | -0.189 | 1.000 | 0.021 | 0.015 | 0.134 |
| Daily return | 0.040 | 0.021 | 1.000 | 9.76e-03 | 0.211 |
| 30d volatility | 0.273 | 0.015 | 9.76e-03 | 1.000 | -0.141 |
| Fear & Greed | 0.353 | 0.134 | 0.211 | -0.141 | 1.000 |

*Pearson correlations on the same regression sample. Overlapping 30-day returns induce serial correlation; inference uses HAC(30) in Table 3.7.*


### 3.4 Empirical Design

Tables 3.2–3.6 describe the panel used in this chapter. This section states the identification strategy applied to that panel.

The empirical design has three parts.

First, the chapter tests whether Bitcoin valuation relative to cumulative energy cost predicts forward 30-day returns. In regression terms, this predicts a negative coefficient on `log(CEIR)`.

The baseline predictive regression can be written as:

```text
Equation 3.2
R_{t,t+30} = alpha + beta * log(CEIR_t) + gamma' * Controls_t + epsilon_t
```

`R_{t,t+30}` is the forward 30-day Bitcoin return. The control set includes trend, sentiment, and volatility where available. Because 30-day forward returns overlap in daily data, inference uses HAC(30) standard errors, month clustering, and differenced specifications as discipline checks—not a single naive regression claim.

Second, the chapter tests whether the relationship changes around the China mining-ban period (2021-06-20). A structural break would suggest that the energy–valuation link depends on mining geography and coordination, not on a universal constant.

Third, the chapter uses robustness checks to avoid overstating the finding: differenced CEIR, alternative error structures, and a simple trading backtest.

The purpose is not to prove that energy mechanically determines Bitcoin's price. It is to test whether energy cost appears to be part of the valuation structure, and whether that structure is stable or conditional.

### 3.5 Main Results

The preferred level specification supports a relationship between Bitcoin valuation and cumulative energy cost. Table 3.7 reports the full regression summary.

Pre-ban, the coefficient on winsorized `log(CEIR)` is negative and statistically significant. Post-ban, the estimate remains negative but is smaller and not significant at conventional levels. A Chow test rejects coefficient equality across the split. The break is therefore real, but the post-ban regime shows a weaker energy-valuation link, not a stronger one.

![Pre- vs post-ban CEIR coefficients (preferred level specification).](empirical_results/figures/ceir_coef_pre_post.png)

*Figure 3.1. Regime split (Table 3.7).*

Table 3.5 and Figure 3.1b help interpret the split without overclaiming causality. Mean Bitcoin price rises sharply post-ban while mean CEIR remains in a similar range; `log(CEIR)` distributions overlap but shift. Table 3.6 reports a negative correlation between `log(CEIR)` and forward returns, consistent with the preferred sign—though overlapping windows mean formal inference still relies on HAC(30), not raw correlations alone.

![log(CEIR) distribution by pre/post China ban regime.](empirical_results/figures/ceir_distribution_by_regime.png)

*Figure 3.1b. Distribution by regime (Table 3.5).*

Pre-ban, when Bitcoin is high relative to its cumulative energy-cost base, later 30-day returns tend to be weaker. That pattern is consistent with energy cost acting as a valuation reference in the concentrated-mining period. Post-ban, the same specification does not support the same strength of inference.

The disciplined reading is that energy cost can contain valuation information, but the relationship is regime-dependent. It should not be stated as "energy always anchors Bitcoin." In the preferred level specification, Bitcoin's energy-cost base carries information before the mining network disperses; afterward, the same test does not support equally strong inference.

**Table 3.7. Preferred level specification — pre/post China mining-ban split**

| Period | N (days) | β on log(CEIR) | HAC p | Chow / break |
|---|---:|---:|---:|---|
| Pre-ban (level spec) | 872 | −0.262 | ≈ 0.0005 | — |
| Post-ban (level spec) | 1,408 | −0.071 | ≈ 0.13 | Chow p ≈ 1.1×10⁻¹⁶ |
| Differenced CEIR | same split | not significant | — | break remains |

![CEIR level and forward returns around the China mining-ban window.](empirical_results/figures/ceir_timeline.png)

*Figure 3.2. CEIR timeline and forward-return panel.*

The timeline panel situates the Chow break in price, CEIR, and forward-return space rather than reporting coefficients alone.

![Binned pre-ban relationship between log(CEIR) and forward 30-day returns.](empirical_results/figures/ceir_forward_returns.png)

*Figure 3.3. Illustrative pre-ban decile means (not the preferred regression).*

That conditional result motivates the rest of the thesis. If passive energy anchoring depends on market structure, designed energy-linked finance cannot assume cost discipline emerges on its own. It must be built into data, pricing, settlement, and governance rules (Chapters 4–5).

### 3.6 Robustness and Negative Results

The robustness checks matter because they prevent the chapter from overstating the evidence.

First, the differenced CEIR specification is weaker. When CEIR is differenced to reduce trend concerns, effects lose statistical significance. The level specification supports the main interpretation; the differenced model is a boundary condition.

Second, the relationship does not produce a useful trading rule. On the same analysis panel, a simple CEIR-based rule earns about +176% total return versus about +2771% for buy-and-hold, with Sharpe ratios 0.72 versus 1.13. CEIR should not be presented as a trading signal. Its role in this thesis is explanatory, not predictive in a commercial sense.

![CEIR trading rule vs buy-and-hold total returns.](empirical_results/figures/trading_rule_comparison.png)

*Figure 3.4. Trading-rule negative result.*

Third, the dataset has a natural limit. Cambridge mining electricity data extend further than the geographic mining-distribution data needed for concentration arguments. The chapter uses the period where both are available.

Fourth, Bitcoin is a single asset. Extension to a broader proof-of-work panel would require separate identification work. This thesis does not attempt it.

These limitations sharpen rather than destroy the claim. The evidence supports a conditional relationship between energy cost and digital value, not a universal law of energy-backed money.

### 3.7 Interpretation and Implications

The empirical evidence should be interpreted in three layers.

First, energy cost is not irrelevant. The preferred specification finds that Bitcoin valuation relative to cumulative energy cost contains information about later returns in the pre-ban period.

Second, the relationship is not stable across regimes. The China mining-ban period weakens the link, which suggests that mining geography, cost dispersion, and coordination matter for any energy–valuation connection.

Third, passive anchoring is insufficient. Bitcoin connects digital value to energy expenditure through mining, but it does not provide enforceable energy claims, collateral rules, or settlement paths. The result motivates designed constraints rather than proof that Bitcoin already solves energy-linked finance.

A credible energy-linked system must therefore define data sources, issuance rules, pricing of risk, collateral or margin protection, settlement and dispute rules, and governance limits—not informal recognition of mining cost alone. Chapter 4 prices renewable-energy risk under explicit assumptions. Chapter 5 asks which rules must hold in code for such claims to be credible.

### 3.8 Chapter Conclusion

This chapter examined whether energy cost appears to matter in an existing digital market. Bitcoin is the clearest case because proof-of-work mining connects coin production to electricity use.

The evidence supports a bounded conclusion. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns before the China ban, and the relationship weakens afterward. The result is specification-sensitive, does not generate a useful trading strategy, and is limited by data availability and the single-asset setting.

The chapter therefore supports the thesis in a disciplined way. It does not prove that energy automatically backs digital money. It shows that energy cost can matter, and that the relationship is conditional. That is the bridge to pricing in Chapter 4 and implementation in Chapter 5.

> **Key takeaway:** Energy cost can carry valuation information—but only conditionally. Designed systems must add explicit rules; passive mining expenditure is not enough.

The preferred level specification appears in Table 3.7. This appendix records supplementary boundary checks only.

### 3.10 CEIR Regression Appendix (supplementary) (auto-generated)

#### Table A.2 — Differenced CEIR (boundary condition)

| Item | Value |
|------|------:|
| Pre-ban β (Δlog CEIR) | -0.2357 (p=0.424) |
| Post-ban β (Δlog CEIR) | 0.1424 (p=0.378) |

CEIR effects are not robust to differencing — cite as a boundary condition.

#### Table A.3 — Trading-rule negative result

| Metric | Value |
|--------|------:|
| Strategy total return (%) | 176.4 |
| Buy-and-hold total return (%) | 2771 |
| Sharpe (strategy) | 0.723 |
| Sharpe (buy-and-hold) | 1.132 |

**Interpretation:** CEIR is explanatory evidence, not a viable trading strategy.



## References

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

Bank for International Settlements. (2023). *Annual Economic Report 2023: Blueprint for the future monetary system*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Bessembinder, H., & Lemmon, M. L. (2002). Equilibrium pricing and optimal hedging in electricity forward markets. *Journal of Finance, 57*(3), 1347-1382.

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Bordo, M. D. (1993). The gold standard, Bretton Woods and other monetary regimes: A historical appraisal. *Federal Reserve Bank of St. Louis Review, 75*(2), 123-191.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Chainlink. (2025). *The blockchain oracle problem*. https://chain.link/education-hub/oracle-problem

Cong, L. W., & He, Z. (2019). Blockchain disruption and smart contracts. *The Review of Financial Studies, 32*(5), 1754-1797.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Deng, S. J., & Oren, S. S. (2006). Electricity derivatives and risk management. *Energy, 31*(6-7), 940-953.

Federal Reserve Bank of St. Louis. (2010). *Central bank credibility and inflation expectations*. https://www.stlouisfed.org/publications/regional-economist/january-2010/central-bank-credibility-and-inflation-expectations

Kydland, F. E., & Prescott, E. C. (1977). Rules rather than discretion: The inconsistency of optimal plans. *Journal of Political Economy, 85*(3), 473-491.

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

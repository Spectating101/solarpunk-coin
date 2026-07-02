# Chapter 3 - Empirical Evidence from Bitcoin Energy Costs

## At a glance

| | |
|---|---|
| **Question** | Does Bitcoin’s energy cost help explain its value — and when does that link break? |
| **Measure** | CEIR = market cap ÷ cumulative mining electricity cost |
| **Main result** | Preferred level spec: β ≈ −0.26 pre-ban (significant); β ≈ −0.07 post-ban (weaker, not significant); Chow break; trading rule underperforms (+176% vs +2771%) |
| **Boundary** | Differenced spec weaker; no profitable trading rule; Bitcoin-only |
| **Takeaway** | Energy can matter **conditionally** — passive anchoring is not enough |
| **Next chapter** | Ch 4 — how to price renewable-energy risk in contracts |

## 3.1 Purpose of the Chapter

Chapter 2 reviewed the literatures on monetary credibility, Bitcoin energy cost, renewable-energy finance, pricing theory, and programmable settlement. This chapter moves from that foundation to empirical evidence by asking whether energy cost appears to matter in an existing digital market.

Bitcoin is the natural empirical case. Chapter 2 already established its relevance: protocol-based issuance, proof-of-work expenditure, and an indirect but measurable link between digital scarcity and electricity cost (Nakamoto, 2008; Hayes, 2019). Holders still do not receive a claim on electricity. The question here is narrower and empirical: does cumulative mining electricity cost contain information about Bitcoin valuation, and does that relationship change when mining conditions change?

The answer developed in this chapter is cautious. In the preferred level specification, valuation relative to cumulative energy cost is related to future returns before the China mining ban, but the link weakens afterward. The evidence is not a mechanical law of value. The relationship is specification-sensitive, does not support a useful trading rule, and does not generalise beyond Bitcoin. That bounded finding is sufficient for the thesis: energy can matter in digital markets, but passive energy anchoring is not a substitute for explicit data, pricing, settlement, and governance rules.

## 3.2 Why Bitcoin Is a Useful Case

Chapter 2 explained why Bitcoin connects digital scarcity to costly electricity use without creating direct energy redemption rights. This section states why that case is empirically testable in the present chapter.

Bitcoin combines three features that matter for identification.

First, mining creates a **cumulative electricity-cost base** that can be compared with market capitalisation. That comparison is operationalised as CEIR in §3.3.

Second, Bitcoin experienced a major external shock in 2021, when China's mining restrictions sharply changed the geographic distribution of hashrate (Cambridge Centre for Alternative Finance, n.d.-b). If energy anchoring depends on how the mining network is organised, the CEIR–return relationship should not be stable across that shock.

Third, the ban provides a **regime-change** setting. The chapter does not use regression-discontinuity language; it tests whether pre- and post-ban coefficients differ in the preferred level specification, alongside a Chow-type break test reported in Table 3.7.

When mining was geographically concentrated, miners faced more similar electricity costs, policy conditions, and operational constraints. In that setting, aggregate energy cost may act more like a common production-cost reference. After dispersion, the same aggregate benchmark maps onto a more heterogeneous cost base. That is the economic reason the China period matters, not only because it was a large news event.

Ethereum's move from proof-of-work to proof-of-stake is a **supporting comparison only** (Ethereum.org, n.d.). Bitcoin preserves proof-of-work throughout the sample and therefore remains the primary empirical object. Readers unfamiliar with proof-of-work need only this minimal definition: miners compete to add blocks by solving costly computations that consume electricity. Fuller discussion is in Chapter 2 §§2.5–2.6.

## 3.3 Measuring the Energy-Valuation Relationship

The chapter uses a measure called the **Cumulative Energy Investment Ratio**, abbreviated as CEIR.

The working definition is:

```text
Equation 3.1
CEIR_t = MarketCap_t / CumulativeEnergyCost_t
```

In the empirical tests, the main explanatory variable is usually `log(CEIR_t)`. A higher CEIR means Bitcoin is expensive relative to its cumulative mining-electricity cost base; a lower CEIR means it is cheaper relative to that base. Because of this definition, the expected sign is negative: if Bitcoin is expensive relative to cumulative energy cost, later returns should be weaker.

The basic logic is similar to valuation ratios used in finance. Bitcoin does not have earnings or dividends, so this thesis compares market value with cumulative mining energy cost. CEIR is not treated as intrinsic value. It is a way to test whether energy cost contains information about Bitcoin valuation.

The data and descriptive evidence for the regression panel appear in Tables 3.2–3.6. Table 3.2 lists the main series and sources. Table 3.3 gives sample dates and observation counts. Table 3.4 defines the regression variables. Tables 3.5 and 3.6 report descriptive statistics and correlations on the regression-ready panel (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b; Cambridge Centre for Alternative Finance, n.d.-c). Table 3.7 summarises the chapter's main quantitative claims and boundaries.

<!-- INJECT_CH3_EMPIRICAL_TABLES -->

## 3.4 Empirical Design

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

## 3.5 Main Results

The preferred level specification supports a relationship between Bitcoin valuation and cumulative energy cost. Table 3.7 reports the full regression summary.

Pre-ban, the coefficient on winsorized `log(CEIR)` is negative and statistically significant. Post-ban, the estimate remains negative but is smaller and not significant at conventional levels. A Chow test rejects coefficient equality across the split. The break is therefore real, but the post-ban regime shows a weaker energy-valuation link, not a stronger one.

![Pre- vs post-ban CEIR coefficients (preferred level specification).](empirical_results/figures/ceir_coef_pre_post.png)

*Figure 3.1. Regime split (Table 3.7). Pre-ban β ≈ −0.26 (HAC p < 0.001); post-ban β ≈ −0.07 (HAC p ≈ 0.13). Chow break p ≈ 1.1×10⁻¹⁶; N pre = 872, post = 1,408.*

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

## 3.6 Robustness and Negative Results

The robustness checks matter because they prevent the chapter from overstating the evidence.

First, the differenced CEIR specification is weaker. When CEIR is differenced to reduce trend concerns, effects lose statistical significance. The level specification supports the main interpretation; the differenced model is a boundary condition.

Second, the relationship does not produce a useful trading rule. On the same analysis panel, a simple CEIR-based rule earns about +176% total return versus about +2771% for buy-and-hold, with Sharpe ratios 0.72 versus 1.13. CEIR should not be presented as a trading signal. Its role in this thesis is explanatory, not predictive in a commercial sense.

![CEIR trading rule vs buy-and-hold total returns.](empirical_results/figures/trading_rule_comparison.png)

*Figure 3.4. Trading-rule negative result.*

Third, the dataset has a natural limit. Cambridge mining electricity data extend further than the geographic mining-distribution data needed for concentration arguments. The chapter uses the period where both are available.

Fourth, Bitcoin is a single asset. Extension to a broader proof-of-work panel would require separate identification work. This thesis does not attempt it.

These limitations sharpen rather than destroy the claim. The evidence supports a conditional relationship between energy cost and digital value, not a universal law of energy-backed money.

## 3.7 Interpretation and Implications

The empirical evidence should be interpreted in three layers.

First, energy cost is not irrelevant. The preferred specification finds that Bitcoin valuation relative to cumulative energy cost contains information about later returns in the pre-ban period.

Second, the relationship is not stable across regimes. The China mining-ban period weakens the link, which suggests that mining geography, cost dispersion, and coordination matter for any energy–valuation connection.

Third, passive anchoring is insufficient. Bitcoin connects digital value to energy expenditure through mining, but it does not provide enforceable energy claims, collateral rules, or settlement paths. The result motivates designed constraints rather than proof that Bitcoin already solves energy-linked finance.

A credible energy-linked system must therefore define data sources, issuance rules, pricing of risk, collateral or margin protection, settlement and dispute rules, and governance limits—not informal recognition of mining cost alone. Chapter 4 prices renewable-energy risk under explicit assumptions. Chapter 5 asks which rules must hold in code for such claims to be credible.

## 3.8 Chapter Conclusion

This chapter examined whether energy cost appears to matter in an existing digital market. Bitcoin is the clearest case because proof-of-work mining connects coin production to electricity use.

The evidence supports a bounded conclusion. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns before the China ban, and the relationship weakens afterward. The result is specification-sensitive, does not generate a useful trading strategy, and is limited by data availability and the single-asset setting.

The chapter therefore supports the thesis in a disciplined way. It does not prove that energy automatically backs digital money. It shows that energy cost can matter, and that the relationship is conditional. That is the bridge to pricing in Chapter 4 and implementation in Chapter 5.

> **Key takeaway:** Energy cost can carry valuation information—but only conditionally. Designed systems must add explicit rules; passive mining expenditure is not enough.

## References

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Cambridge Centre for Alternative Finance. (n.d.-c). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

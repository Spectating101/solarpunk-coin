# Chapter 3 - Empirical Evidence from Bitcoin Energy Costs

## 3.1 Purpose of the Chapter

Chapter 2 argued that energy is worth studying as a possible constraint for digital finance because it has real production cost, economic usefulness, and increasing measurability. This chapter asks whether energy cost appears to matter in an existing digital market.

Bitcoin is the natural case to study. It is a digital monetary asset whose issuance and security depend on proof-of-work mining. Mining requires electricity and hardware, so Bitcoin is not created without real resource expenditure. Bitcoin is not an energy-backed currency in the direct sense, because holders do not receive a claim on electricity. But it is the clearest existing case where digital value and energy cost are connected.

The empirical question is therefore:

Does the cost of energy used in Bitcoin mining help explain Bitcoin market value, and does that relationship change when mining conditions change?

The answer in this chapter is cautious. The evidence suggests that energy cost is not irrelevant. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns, and the relationship changes sharply around the China mining-ban period. However, the evidence is not a mechanical law of value. The relationship is sensitive to specification, especially when differenced measures are used, and it does not produce a useful trading rule. This supports the thesis argument in a bounded way: energy can matter, but passive energy anchoring is not enough. Credible energy-linked digital finance still needs explicit rules for data, pricing, settlement, and governance.

## 3.2 Why Bitcoin Is a Useful Case

Bitcoin is useful for this thesis because it combines three features.

First, Bitcoin has a fixed issuance rule. New Bitcoin is created according to protocol rules rather than by a central issuer (Nakamoto, 2008).

Second, Bitcoin mining requires energy. Miners compete by performing computational work, and that work requires electricity. This creates a production-cost channel that is absent from many other digital assets.

Third, Bitcoin experienced a major external shock in 2021. China's mining restrictions sharply changed the geographic distribution of mining activity. This provides a useful setting for studying whether the energy-value relationship depends on mining geography and coordination.

The China mining-ban period matters because energy costs do not affect all miners equally. If mining is geographically concentrated, miners face more similar electricity costs, policy conditions, and operational constraints. In that setting, energy cost may act more like a common production-cost reference. If mining becomes more geographically dispersed, the cost base becomes more heterogeneous. The same aggregate energy-cost measure may then become less stable as a valuation anchor.

Ethereum's move from proof-of-work to proof-of-stake is used only as a supporting comparison. It is not the primary identification event in this thesis. Its role is to show that when a major network removes mining, the relationship between energy expenditure and network operation changes fundamentally (Ethereum.org, n.d.).

## 3.3 Measuring the Energy-Valuation Relationship

The chapter uses a measure called the **Cumulative Energy Investment Ratio**, abbreviated as CEIR.

The name is technical, but the idea is simple:

CEIR compares Bitcoin's market value with the cumulative electricity cost used to secure the network.

The working definition is:

```text
Equation 3.1
CEIR_t = MarketCap_t / CumulativeEnergyCost_t
```

In the empirical tests, the main explanatory variable is usually `log(CEIR_t)`. A higher CEIR means Bitcoin is expensive relative to its cumulative mining-electricity cost base. A lower CEIR means Bitcoin is cheaper relative to that cost base. Because of this definition, the expected sign is negative: if Bitcoin is expensive relative to cumulative energy cost, later returns should be weaker.

In plain language, it asks:

Is Bitcoin expensive or cheap relative to the historical energy cost that has gone into mining it?

The basic logic is similar to valuation ratios used in finance. A stock price can be compared with earnings, book value, or cash flow. Bitcoin does not have earnings or dividends, so this thesis compares market value with cumulative mining energy cost.

The measure is not treated as a perfect measure of intrinsic value. It is a way to test whether energy cost contains information about Bitcoin valuation.

The main data inputs are:

- Bitcoin market value and returns.
- Bitcoin mining electricity consumption.
- Mining geography, where available.
- Electricity-cost assumptions across mining regions.
- Market controls such as volatility and sentiment where appropriate.

The electricity and mining data rely heavily on Cambridge Bitcoin Electricity Consumption Index and Cambridge mining-map materials, which provide estimates of Bitcoin electricity demand and geographic hashrate distribution (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b).

Table 3.1 records the empirical values used as the current source of truth in this chapter.

| Item | Canonical Chapter 3 Treatment |
|---|---|
| CEIR definition | `CEIR_t = MarketCap_t / CumulativeEnergyCost_t`. |
| Main outcome | Forward 30-day Bitcoin return. |
| Expected sign | Negative coefficient on `log(CEIR_t)`. |
| Preferred model | Corrected level specification from the current robustness notes. |
| Preferred coefficient | Approximately `-0.26` pre-ban in the preferred level specification. |
| Structural break | The China mining-ban period shows a sharp structural break in the level specification. |
| Differenced specification | Weaker; CEIR effects lose significance and are treated as a boundary condition. |
| Trading rule | Negative result; CEIR is not presented as a viable trading strategy. |
| Generalisation | Bitcoin-focused evidence, not a proof for all proof-of-work assets. |

## 3.4 Empirical Design

The empirical design has three parts.

First, the chapter tests whether Bitcoin valuation relative to cumulative energy cost predicts forward 30-day returns. If Bitcoin is expensive relative to its energy-cost base, later returns should be weaker. If Bitcoin is cheap relative to its energy-cost base, later returns should be stronger. In regression terms, this predicts a negative coefficient on CEIR: higher market value relative to energy cost should be followed by lower future returns.

The baseline predictive regression can be written as:

```text
Equation 3.2
R_{t,t+30} = alpha + beta * log(CEIR_t) + gamma' * Controls_t + epsilon_t
```

Here, `R_{t,t+30}` is the forward 30-day Bitcoin return. The control set varies across specifications, but includes market-risk and sentiment controls where available. Because 30-day forward returns can overlap in daily data, the current thesis treats standard errors carefully and relies on HAC(30), clustering, and differenced specifications as discipline checks rather than presenting one naive regression as decisive.

Second, the chapter tests whether the relationship changes around the China mining-ban period. The China shock is useful because it changed mining geography and therefore the structure of mining costs. A structural break around this period would suggest that the energy-value relationship depends on market structure rather than being a universal constant.

Third, the chapter uses robustness checks to avoid overstating the finding. These include alternative specifications, differenced CEIR measures, clustered or heteroskedasticity-robust standard errors, and checks against practical trading performance.

The purpose of the empirical design is not to prove that energy mechanically determines Bitcoin's price. The purpose is to test whether energy cost appears to be part of the valuation structure, and whether that structure is stable or conditional.

## 3.5 Main Results

The preferred level specification supports a relationship between Bitcoin valuation and cumulative energy cost.

In the corrected level specification, the pre-ban CEIR coefficient is negative and statistically significant, approximately `-0.26` in the current robustness notes, with significance surviving clustered standard errors. This means that when Bitcoin is high relative to its cumulative energy-cost base, later returns tend to be weaker. That result is consistent with the idea that energy cost can act as a valuation reference.

The relationship also changes strongly around the China mining-ban period. The current source-of-truth results show a sharp structural break, with a Chow-test p-value near zero in the level specification. This means that the relationship before and after the ban is not stable.

This is the key empirical point for the thesis:

Energy cost appears to matter, but the relationship is regime-dependent.

The result should not be stated as "energy always anchors Bitcoin." It should be stated more carefully:

Bitcoin's energy-cost base contains valuation information in the preferred level specification, but the relationship changes when the mining system changes.

That finding is exactly why the thesis moves from passive energy anchoring to designed financial architecture. If energy anchoring depends on market structure, then a serious energy-linked financial system cannot simply assume that energy cost will discipline value by itself. It must build the discipline into data rules, pricing rules, settlement rules, and governance rules.

## 3.6 Robustness and Negative Results

The robustness checks are important because they prevent the chapter from overstating the evidence.

First, the differenced CEIR specification is weaker. When CEIR is differenced to reduce trend concerns, the CEIR effects lose statistical significance in the current robustness notes. This means the result is sensitive to how the energy-valuation measure is specified. The preferred level model supports the energy-anchoring interpretation, but the differenced model is a boundary condition.

Second, the relationship does not produce a useful trading rule. The current robustness notes state that a simple CEIR-based trading rule performs poorly compared with buy-and-hold. That is an important negative result. It means CEIR should not be presented as a trading signal or investment strategy. Its role in this thesis is explanatory, not predictive in a commercial trading sense.

Third, the dataset has a natural limit. Cambridge mining electricity data extends further than the geographic mining-distribution data. The mining map data needed for concentration analysis does not extend cleanly through the later period. Because mining concentration is central to the thesis argument, the chapter focuses on the period where both energy and geography variables are available. This is a methodological choice, not a claim that later data is unimportant.

Fourth, Bitcoin is a single asset. A broader claim about energy anchoring across all proof-of-work assets would require a panel of assets and additional identification work. This thesis does not make that broader claim.

These limitations do not make the empirical chapter useless. They make the claim more precise. The evidence supports a conditional relationship between energy cost and digital value. It does not prove a universal law of energy-backed money.

## 3.7 Interpretation

The empirical evidence should be interpreted in three layers.

First, energy cost is not irrelevant. The preferred specification finds that Bitcoin valuation relative to cumulative energy cost contains information about later returns. This supports the idea that markets can treat energy expenditure as part of a digital asset's economic structure.

Second, the relationship is not stable across all regimes. The China mining-ban period changes the relationship, which suggests that energy anchoring depends on how the production network is organised. Mining geography, cost dispersion, and market coordination matter.

Third, passive anchoring is not enough. Bitcoin connects digital value to energy expenditure indirectly through mining. But it does not provide a direct energy claim, a formal settlement rule, or a collateral structure. This is why the evidence motivates a designed system rather than proving that Bitcoin already solves the problem.

This interpretation connects Chapter 3 to the rest of the thesis. Chapter 3 provides evidence that energy can matter. Chapter 4 asks how energy-linked risk can be priced. Chapter 5 asks what rules would be needed to make energy-linked claims credible rather than passive.

## 3.8 Implications for Energy-Linked Digital Finance

The main implication is that energy should not be treated as an automatic backing asset.

If energy anchoring were automatic, Bitcoin's energy-cost relationship would be stable across regimes and robust across all specifications. The evidence is more nuanced. Energy cost matters in some specifications and changes under structural shocks. That is useful because it tells us what a designed system must improve.

A designed energy-linked system should not rely only on market participants informally recognising energy cost. It should define:

- the energy data source;
- the rule for creating tokens or contracts;
- the pricing method for energy risk;
- the collateral, reserve, or margin protection;
- the settlement rule when energy output or data quality fails;
- the governance rule for changing system parameters.

This is the transition from empirical evidence to architecture. Bitcoin shows that energy can be connected to digital value. It also shows that the connection is fragile when it is left to market structure alone.

## 3.9 Chapter Conclusion

This chapter examined whether energy cost appears to matter in an existing digital market. Bitcoin is the clearest case because proof-of-work mining connects coin production to electricity use.

The evidence supports a bounded conclusion. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns, and the relationship changes sharply around the China mining-ban period. However, the result is specification-sensitive, does not generate a useful trading strategy, and is limited by data availability and the single-asset setting.

The chapter therefore supports the thesis, but in a disciplined way. It does not prove that energy automatically backs digital money. It shows that energy cost can matter, and that the relationship is conditional. This motivates Chapter 4, which moves from Bitcoin as passive evidence to the practical problem of pricing renewable-energy-linked financial contracts.

## References

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

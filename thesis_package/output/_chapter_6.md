## Chapter 6 - Conclusion

### 6.1 Purpose of the Chapter

This thesis asked whether energy can act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work.

The answer is conditional.

Energy is not money by itself. A kilowatt-hour does not automatically become a currency. But energy has properties that make it worth studying as a financial constraint: it has real production cost, it is economically useful, it is increasingly measurable, and it can be connected to rule-based digital contracts.

The thesis has argued that energy can support digital monetary credibility only when it is embedded in a broader architecture. That architecture requires reliable data, rule-bound issuance, explicit risk pricing, protected settlement, and limited governance.

The main result is therefore not a finished currency. It is a framework for testing and building energy-linked digital finance without relying on vague claims that "energy backs money."

### 6.2 Summary of the Argument

Chapter 1 introduced the problem. Digital money can be technically scarce but still lack economic credibility. Fiat money depends on institutional judgment. Cryptocurrency can depend on code. But neither institutional discretion nor code alone necessarily creates a verifiable link to real production.

Chapter 2 explained why energy is worth studying as a candidate constraint. Gold once provided a physical limit on money creation, but gold-backed systems suffered from custody, verification, settlement, and political problems. Fiat money solved some operational problems but shifted credibility toward institutions. Bitcoin introduced code-based scarcity and proof-of-work mining, but its energy link is indirect. Energy is interesting because it combines cost, usefulness, measurability, and compatibility with digital enforcement.

Chapter 3 tested whether energy cost appears to matter in an existing digital market. Bitcoin was used because proof-of-work mining connects digital value to electricity use. The empirical evidence supports a bounded conclusion: Bitcoin valuation relative to cumulative energy cost is informative in the preferred level specification, and the relationship changes around the China mining-ban period. But the evidence is specification-sensitive and does not produce a useful trading rule. Energy cost matters conditionally; it does not mechanically determine digital value.

Chapter 4 developed the pricing layer. Renewable-energy-linked claims cannot be credible unless their risk is priced. The chapter used public energy data and option-style numerical methods to show how energy-linked payoffs can be valued under explicit assumptions. It also connected pricing to oracle tolerance, margin, and collateral requirements. The pricing framework is not final, but it shows how energy risk can be made inspectable.

Chapter 5 presented the constraints framework and proof-of-concept implementation. It showed how reliable energy data, rule-bound issuance, pricing, settlement protection, and governance limits can be connected in a technical system. The proof-of-concept demonstrates that the core rules can be expressed in code and tested. It does not demonstrate production readiness.

Taken together, the chapters support the central thesis:

Energy can serve as a credible constraint for digital finance only when the system can verify energy data, limit issuance by rule, price uncertainty, protect settlement, and restrict discretionary governance.

### 6.3 Main Contributions

The first contribution is conceptual. The thesis reframes energy not only as a commodity or climate asset, but as a possible constraint on digital financial claims. This shifts the question from "can energy be tokenized?" to "can energy limit digital issuance and settlement in a credible way?"

The second contribution is empirical. The Bitcoin analysis shows that energy cost can contain valuation information, but that the relationship is conditional and regime-dependent. This avoids two extremes. It does not dismiss energy cost as irrelevant, but it also does not claim that energy mechanically explains digital value.

The third contribution is methodological. The pricing chapter shows how renewable-energy-linked risk can be modelled with public data and standard numerical methods when liquid derivatives markets are unavailable. This provides a practical cold-start approach for pricing and collateral analysis.

The fourth contribution is architectural. The constraints framework identifies the minimum categories of rules needed for credible energy-linked digital finance: data, issuance, pricing, settlement, and governance.

The fifth contribution is technical feasibility. The proof-of-concept implementation shows that the framework can be represented in software. Signed energy-style readings can be checked, source hashes can be consumed, token minting can be tied to accepted surplus, invoice settlement can be recorded, and redemption accounting can track owed-kWh claims and delivery outcomes.

The most important contribution is the integration. Energy is studied as a production cost, a renewable resource, a pricing problem, and a contract-enforced settlement constraint within one thesis.

### 6.4 What the Thesis Does Not Claim

The thesis does not claim that energy should immediately replace fiat money.

It does not claim that a token linked to energy is automatically safe, legal, or valuable.

It does not claim that Bitcoin is already a complete energy-backed currency.

It does not claim that satellite data alone proves actual site-level energy production.

It does not claim that the proof-of-concept implementation is production-ready.

It does not claim that liquidity, legal enforceability, user demand, reserve capital, or utility regulation have been solved.

These boundaries are important. The thesis is a research contribution, not a product launch document. Its purpose is to define and test the conditions under which energy could become a credible constraint in digital finance.

### 6.5 Limitations

The thesis has several limitations.

First, the empirical evidence is based primarily on Bitcoin. Bitcoin is the most important proof-of-work asset, but it is still one asset. A stronger empirical claim would require a panel of proof-of-work assets and more external shocks.

Second, the CEIR evidence is specification-sensitive. The preferred level specification supports the energy-cost interpretation, but differenced specifications are weaker. This means CEIR should be treated as evidence of conditional anchoring, not as a universal valuation law.

Third, mining geography data is limited. Cambridge mining-distribution data does not provide a complete long post-2022 geography series. This limits the ability to extend the concentration-dependent analysis through later years without using weaker proxy assumptions.

Fourth, the pricing model is simplified. Geometric Brownian motion is useful as a transparent short-horizon benchmark, but electricity and renewable-energy markets can show jumps, seasonality, mean reversion, negative prices, curtailment, and local grid constraints.

Fifth, public energy data has limits. NASA POWER and NREL/PVWatts-style data are useful for resource modelling and baseline estimation, but actual site-level settlement requires meter, inverter, grid, or audited operator data.

Sixth, the proof-of-concept implementation is not production-ready. It lacks a real operator meter source, external audit, legal framework, production governance, reserve policy, and live counterparties.

Seventh, the thesis does not solve adoption. A technically credible energy-linked instrument still needs users, market makers, operators, regulators, and liquidity.

### 6.6 What Would Falsify or Weaken the Thesis

A strong thesis should be clear about what would weaken it.

The empirical part would be weakened if broader proof-of-work asset panels showed no relationship between energy cost and valuation under any specification or regime.

The Bitcoin result would be weakened if the CEIR relationship disappeared under more robust controls, non-overlapping return windows, alternative energy-cost constructions, or better post-2022 mining geography data.

The pricing framework would be weakened if public energy-data volatility proved consistently unrelated to actual settlement risk, or if the proposed numerical methods failed under realistic jump, curtailment, or negative-price scenarios.

The implementation argument would be weakened if signed meter data, source-hash controls, replay protection, and settlement accounting could not be made reliable with real operator data.

The broader framework would be weakened if energy-linked claims could not attract counterparties, legal enforceability, or reserve structures even after the technical and pricing problems were solved.

These possible failures do not undermine the current research contribution. They define the next tests.

### 6.7 Future Work

Future work should proceed in five directions.

First, the empirical analysis should be extended. This includes testing other proof-of-work assets, developing better post-2022 mining geography proxies, using non-overlapping return windows, and adding further robustness checks.

Second, the pricing model should be expanded. Future models should test jump diffusion, mean reversion, seasonality, curtailment risk, negative prices, and multi-factor energy-price dynamics.

Third, the data layer should move from public modelling data toward real operator data. A real meter, inverter, grid, or utility-export dataset would significantly strengthen the practical case.

Fourth, the proof-of-concept should be tested in a closed pilot. A closed pilot should use governed deployment, capped exposure, written terms, real data, and no public real-value claims until audit and legal review are complete.

Fifth, legal and market structure need separate study. Energy-linked digital finance raises questions about securities law, commodity law, utility regulation, consumer protection, reserve custody, and redemption obligations. These issues are beyond this thesis but essential before deployment.

### 6.8 Closing Statement

This thesis began with a simple problem: digital money can be created by institutions or code, but credibility still depends on limits that users can understand and verify.

Energy is a serious candidate for such a limit because it is costly, useful, measurable, and connected to real production. But energy does not become money automatically. It must be measured, priced, constrained, settled, and governed.

The thesis therefore does not conclude that energy is a direct replacement for gold or that a prototype can replace existing money. It concludes that energy-linked digital finance is a credible research direction if it is built around constraints rather than claims.

The strongest version of the argument is modest but important:

Energy can help discipline digital financial claims when reliable data, rule-bound issuance, explicit pricing, protected settlement, and governance limits are designed together.

That is the framework this thesis contributes.

## References

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

International Energy Agency. (2024). *World Energy Investment 2024*. https://www.iea.org/reports/world-energy-investment-2024

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

OECD. (2024). *Bridging the Clean Energy Investment Gap: Cost of Capital in the Transition to Net-Zero Emissions*. https://www.oecd.org/en/publications/bridging-the-clean-energy-investment-gap_1ae47659-en.html

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

Cambridge Centre for Alternative Finance. (n.d.). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

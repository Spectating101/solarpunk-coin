# Chapter 2 - Literature Review and Theoretical Background

## At a glance

| | |
|---|---|
| **Question** | What literatures define “credible constraint,” and where does energy-linked digital finance enter? |
| **Takeaway** | Credibility needs verifiable limits; energy is a serious candidate only with data, pricing, settlement, and governance rules. |
| **Key idea** | Technical scarcity (code, fixed supply) ≠ economic credibility (real cost, enforceable rules). |
| **Not claimed** | Energy stablecoin, USDC replacement, or “energy backs money” by slogan |
| **Next chapter** | Ch 3 — does energy cost show up in Bitcoin’s market data? |

## 2.1 Purpose of the Chapter

Chapter 1 introduced the central research problem: digital systems can create technical scarcity, but scarcity alone does not guarantee economic credibility. This chapter reviews the literatures needed to evaluate whether energy can act as a credible constraint for digital financial claims.

The review is organised around one guiding question: **what makes a financial claim credibly constrained?** Monetary economics explains why commitment and limits on discretion matter (Kydland and Prescott, 1977; Barro and Gordon, 1983). Gold and Bretton Woods show how physical convertibility can discipline claims, but also how that discipline can fail when settlement and institutional support weaken (Bordo, 1993; Eichengreen, 1992; Federal Reserve History, 2013). Bitcoin introduces protocol-based scarcity and proof-of-work expenditure (Nakamoto, 2008), while renewable-energy finance shows that real energy production has value but also uncertainty (International Energy Agency, 2023; Lazard, 2025). Pricing and smart-contract literature then help explain how uncertainty and rules might be represented in digital financial systems (Black and Scholes, 1973; Cox, Ross, and Rubinstein, 1979; Cong and He, 2019).

The purpose is not to treat these literatures as separate background topics. It is to show how they jointly define the gap this thesis addresses. Existing research explains important parts of the problem, but not a complete architecture for using verified energy production as a digital financial constraint.

## 2.2 Monetary Credibility, Rules, and Discretion

A central theme in monetary economics is that credibility depends on commitment. Kydland and Prescott (1977) argue that discretionary policymaking can become time-inconsistent: a policy that appears optimal before expectations are formed may no longer be optimal after private agents adjust. Users of money and financial claims therefore care not only about present rules, but also about whether those rules can be changed opportunistically later. For this thesis, the lesson is that a credible financial constraint must limit future discretion, not merely declare an intention to be constrained.

Barro and Gordon (1983) extend this credibility problem by showing how reputation and expectations shape inflation outcomes under discretion. When authorities have incentives to create surprise inflation, rational agents anticipate that possibility, weakening credibility in advance. The broader implication is that credibility depends on whether promises are enforceable, reputation-sensitive, or institutionally difficult to break. In digital finance, a token may claim limited supply, reserve backing, or energy linkage, but those claims remain weak if administrators can freely mint, alter rules, replace data sources, or avoid redemption.

The rules-versus-discretion literature therefore supports a central design implication: credibility depends on mechanisms that constrain discretionary action. In this thesis, reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance are treated as ways to reduce discretion and make the constraint observable.

This literature explains why constraints matter, but not which real-world constraint should discipline a digital financial claim. That opening motivates the historical and digital cases reviewed in the sections that follow.

Table 2.1 summarises how different monetary systems have approached constraint.

| System | Main Constraint | Main Strength | Main Failure Mode |
|---|---|---|---|
| Gold-backed money | Physical scarcity and redemption into gold | Hard to create gold from nothing | Custody, verification, physical settlement, and redemption pressure |
| Fiat money | Institutional credibility and policy discipline | Flexible and operationally scalable | Discretion, policy inconsistency, and dependence on trust |
| Bitcoin | Code-based supply rule and proof-of-work mining | Transparent technical scarcity and real mining cost | Indirect energy link; value still depends on market demand and coordination |
| Energy-linked digital finance | Reliable data plus rule-bound issuance, pricing, settlement, and governance limits | Potential link between digital claims and real production | Must verify data, price risk, protect settlement, and limit governance discretion |

For this thesis, the important distinction within Table 2.1 is between **technical scarcity** and **economic credibility**. Technical scarcity means a system has a rule limiting creation. Economic credibility means users believe that the rule is meaningful, enforceable, and connected to real value. The question is whether energy can help close this gap when measurement, pricing, settlement, and governance are designed explicitly.

## 2.3 Gold, Bretton Woods, and Physical Monetary Constraint

Gold-backed monetary systems provide the standard historical example of discipline through physical convertibility. Under gold-linked arrangements, monetary claims were credible partly because they could, in principle, be redeemed for a scarce physical asset. Bordo (1993) frames the classical gold standard as a monetary rule that worked partly because it operated as a commitment mechanism. Convertibility created discipline because excessive issuance could create redemption pressure and weaken confidence in the issuer’s ability to maintain the promise.

Gold-backed money also had operational weaknesses. Most users did not personally inspect gold reserves. They trusted banks, governments, vaults, auditors, and international settlement arrangements. Gold was expensive and slow to move. Supply was geographically and politically concentrated. Convertibility created pressure during stress, when holders had incentives to demand gold early. These problems became visible in the breakdown of Bretton Woods.

The Bretton Woods system extended gold-convertibility logic into the post-war international monetary order. Foreign currencies were fixed to the U.S. dollar, and the dollar was convertible into gold at a fixed rate of $35 per ounce for official foreign holders. Federal Reserve History describes Bretton Woods as a system of currency convertibility that lasted until 1971. Eichengreen (1992) emphasises that the arrangement depended on confidence in U.S. reserve management, policy discipline, and political commitment as much as on gold itself.

Bretton Woods was therefore a **hybrid** system. Most countries held dollars as reserves rather than converting every international claim directly into bullion. The United States became the central reserve issuer. As world trade and foreign dollar holdings grew, official dollar claims could rise toward — and in crisis conditions beyond — the quantity of gold the United States was willing or able to redeem at the fixed price. Economists often describe this as a **Triffin-style tension**: the reserve-currency country must supply international liquidity, but growing liability issuance can undermine confidence in convertibility.

By the late 1960s, that tension became harder to manage. U.S. balance-of-payments deficits, Vietnam War and Great Society spending, and rising foreign official dollar holdings increased redemption pressure. Federal Reserve History and U.S. Department of State accounts link the closing of the gold window in August 1971 to those pressures: foreign governments and central banks sought gold for dollars faster than the U.S. gold stock could comfortably support at the fixed price (Federal Reserve History, 2013; U.S. Department of State, n.d.). President Nixon suspended dollar–gold convertibility and announced temporary wage and price controls — the “Nixon shock.” Bretton Woods did not collapse because gold ceased to be scarce, but because **paper claims grew faster than credible settlement capacity**.

The suspension of dollar–gold convertibility in 1971 shows the operational fragility of physical backing. The lesson is not simply that gold failed. It is that a physical backing system can break when redemption promises, reserve capacity, political commitments, and international confidence no longer align. For an energy-linked system, the implication is direct: a claim linked to a real asset is only credible if the settlement architecture can actually support the claim — not merely if the asset exists in principle.

Gold is useful as a historical analogy, but the analogy must be limited. Gold is scarce, durable, relatively uniform, and directly storable. Energy is time-dependent, location-dependent, infrastructure-dependent, and difficult to store directly at scale without conversion or storage technologies. Energy therefore cannot simply copy gold convertibility. If energy is to act as a constraint, it requires verified production data, risk pricing, settlement rules, and governance limits rather than physical hoarding alone.

## 2.4 Fiat Money and Institutional Credibility

Fiat money provides a contrasting model of credibility. In fiat systems, money is supported by legal tender status, state authority, payment infrastructure, taxation systems, central-bank credibility, and public acceptance. This makes fiat a system of institutional constraint rather than physical convertibility.

The strength of fiat money is flexibility. Without a fixed commodity constraint, monetary authorities can manage liquidity, support payment systems, act as lenders of last resort, and respond to crises. However, the same flexibility creates the discipline problem discussed by Kydland and Prescott (1977) and Barro and Gordon (1983). When issuance is not constrained by convertibility, users must trust institutions to manage monetary discretion responsibly. Fiat credibility therefore shifts from physical convertibility to institutional quality.

Central-bank credibility depends heavily on whether public expectations remain anchored. When economic agents view a central bank as credible, inflation expectations are more likely to remain stable, strengthening the effectiveness of monetary policy (Federal Reserve Bank of St. Louis, 2010). Institutional credibility is not automatic. It must be maintained through policy performance, communication, legal authority, and expectations management.

Fiat systems also embed credibility in **infrastructure and law**, not only in central-bank reputation. Legal tender status, taxation in the unit of account, lender-of-last-resort facilities, deposit insurance in many jurisdictions, and payment-system oversight create switching costs and shared expectations. These structures are difficult for a permissionless token issuer to replicate. A smart contract can encode transfer rules, but it cannot automatically inherit tax authority, crisis liquidity backstops, or the legal enforceability that supports sovereign money.

The fiat model matters for energy-linked digital finance because many digital systems attempt to create claims without the institutional depth that supports sovereign money. Central banks operate within legal mandates, payment systems, public accountability structures, and macroeconomic policy frameworks. A token issuer or smart-contract system may not have comparable safeguards. If an energy-linked digital claim is not supported by full institutional credibility, it must rely more heavily on transparent rules, reliable data, priced risk, settlement protection, and constrained governance. Where sovereign money relies on law and policy credibility, an energy-linked claim would need a narrower but **inspectable** substitute: verified production evidence, bounded issuance, explicit pricing, protected settlement, and governance limits.

This thesis does not argue that energy should replace fiat money in general. It asks a narrower question: whether energy can provide a credible constraint for specific digital financial claims under carefully defined conditions.

## 2.5 Bitcoin, Protocol Scarcity, and Proof-of-Work

Bitcoin is the central digital-asset case for this thesis because it introduced a protocol-based model of scarcity. Nakamoto (2008) proposed a peer-to-peer electronic cash system that uses proof-of-work to timestamp transactions and make historical changes costly. Bitcoin’s issuance schedule is defined by protocol rules rather than discretionary monetary policy. This gives Bitcoin a different credibility structure from both gold and fiat: it is neither physically redeemable like gold nor institutionally managed like fiat, but constrained by code, distributed consensus, and proof-of-work mining.

Proof-of-work connects digital scarcity to physical resource expenditure. Miners use electricity and hardware to compete for block rewards and transaction fees. This makes Bitcoin different from ordinary digital information, which can usually be copied at low cost. However, Bitcoin resembles gold in costly production but not in redeemable backing. Bitcoin holders do not receive a claim on the electricity used to mine Bitcoin. Mining expenditure supports network security and issuance competition, but it does not create a direct energy entitlement.

Bitcoin therefore provides evidence that energy can matter in digital value formation, but not that energy cost mechanically determines market value. Cryptocurrency-return literature supports caution. Liu and Tsyvinski (2021) document that cryptocurrency returns behave differently from traditional asset classes and are shaped by crypto-specific factors. Energy expenditure may be informative without being sufficient. A serious empirical design must treat energy cost as one possible valuation component among several, not as the single determinant of price.

Bitcoin’s limitation motivates the thesis’s move from passive energy expenditure to designed energy-linked claims. If energy is to constrain digital financial claims more directly, the system must specify accepted energy data, issuance rules, valuation methods, settlement obligations, and governance limits. Bitcoin serves as the empirical starting point, not the final model.

![Bitcoin (consumption) vs SPK (production) — architectural contrast.](empirical_results/figures/production_vs_consumption.png)

*Figure 2.2. Passive mining expenditure vs designed surplus-production rules (Ch 3 vs Ch 5).*

## 2.6 Bitcoin Energy Valuation and Cryptocurrency Returns

Bitcoin energy-valuation literature asks whether mining cost helps explain Bitcoin’s market value. Hayes (2019) studies Bitcoin price relative to marginal production cost and finds support for a fundamental-value interpretation linked to mining inputs. This literature is important because it treats Bitcoin as a digital asset whose production requires measurable expenditure, especially electricity cost and hardware efficiency.

Hayes’s production-cost logic is useful motivation for empirical testing, but it should not be interpreted as proving a guaranteed intrinsic value or a mechanical energy floor. Mining costs vary with electricity prices, hardware efficiency, network difficulty, and miner behaviour. Market price can diverge from production cost during bubbles, crashes, and changing demand conditions. The thesis therefore uses production-cost logic as motivation for Chapter 3, not as a complete theory of Bitcoin value.

Improved measurability of mining electricity use strengthens the empirical opportunity. The Cambridge Bitcoin Electricity Consumption Index provides estimates of Bitcoin’s power demand and electricity consumption, while Cambridge mining-map materials track geographic hashrate distribution over time (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b; Cambridge Centre for Alternative Finance, n.d.-c). Cambridge’s methodology updates make clear that these measures are model-based estimates rather than direct observation of every miner’s electricity use. This distinction matters because any cumulative energy-cost benchmark depends on estimated inputs.

Mining geography matters because energy cost is location-dependent. Electricity prices, energy mixes, regulatory conditions, and infrastructure constraints vary across locations. The China mining-ban period is especially relevant because it created a major shift in the geographic distribution of Bitcoin mining. If mining geography changes, the cost structure of mining may also change, which may affect any relationship between energy cost and Bitcoin valuation.

This thesis uses the Cumulative Energy Investment Ratio, or CEIR, as a valuation-ratio test rather than a claim of intrinsic value. CEIR compares Bitcoin’s market capitalisation with cumulative estimated mining electricity cost and asks whether that ratio contains information about future returns. Chapter 3 tests this question directly. The literature reviewed here motivates that test; it does not prejudge the result.

## 2.7 Renewable-Energy Finance, Data, and Risk

Renewable-energy finance provides the production side of the thesis because it concerns real electricity output rather than electricity consumed in mining. Renewable assets generate output that can serve households, firms, grids, and infrastructure. However, renewable-energy production does not have stable or uniform financial value. Its value depends on output variability, location, timing, grid connection, storage, tariffs, curtailment, and settlement rules.

Levelised-cost studies such as Lazard (2025) show that renewables can be highly cost-competitive for new-build generation. Cost competitiveness matters because the thesis is not based on the idea that renewable energy is merely symbolic. However, levelised cost does not itself create a financial claim. A low generation cost does not prove that a token linked to energy is credible. Credibility still requires measurement, pricing, claim definition, and settlement.

The International Energy Agency (2023) emphasises that mobilising investment and finance remains a central challenge for clean-energy transitions, especially in emerging and developing economies. Energy-linked digital finance can be framed as a possible financing architecture, not merely a token experiment. However, digital finance does not automatically reduce financing risk unless it improves the credibility of claims.

Public energy datasets are useful for modelling but insufficient for final settlement. NASA POWER provides satellite-derived solar and meteorological data, while NREL PVWatts estimates photovoltaic production from location and system inputs (NASA POWER, n.d.; NREL, n.d.). These tools support benchmarking and cold-start analysis. They cannot by themselves prove that a specific site produced, exported, stored, or settled a given amount of electricity. For energy-linked finance, modelling data and settlement-grade evidence must be treated as different categories.

Because renewable-energy output and value are uncertain, energy-linked digital claims should not be issued merely because a project is associated with renewable production. A credible claim requires a method for translating energy uncertainty into financial terms, including expected production, volatility, shortfall risk, basis risk, settlement timing, and data reliability. Renewable-energy finance therefore leads directly into the pricing literature reviewed next.

## 2.8 Pricing Energy-Linked Claims

Pricing is necessary because energy-linked claims have uncertain payoffs. Black and Scholes (1973) introduced a foundational continuous-time option-pricing framework, while Cox, Ross, and Rubinstein (1979) developed a binomial approach that represents uncertainty through discrete up-and-down movements. These models are not directly sufficient for all electricity markets, but they provide a disciplined language for modelling uncertainty, volatility, time, discounting, and payoff structure. This thesis uses that logic to frame renewable-energy-linked claims as uncertain financial claims rather than simple fixed promises.

Black–Scholes is useful as a benchmark, but its standard assumptions are restrictive for electricity and renewable-energy applications. Electricity prices can show spikes, seasonality, mean reversion, congestion effects, and non-storability. Renewable-energy output depends on weather and site conditions rather than only traded asset dynamics. This thesis does not treat Black–Scholes as a final electricity-market model. It uses option-style reasoning as a transparent starting point.

The Cox–Ross–Rubinstein binomial model is especially useful because it provides a transparent numerical method that can be explained and implemented in a thesis setting. For an energy-linked claim, binomial pricing can serve as a cold-start approach under explicit assumptions about volatility, time horizon, discount rate, and payoff structure. Chapter 4 implements this approach; the present section only positions it in the literature.

Electricity-market literature shows why energy pricing is more difficult than standard financial pricing. Bessembinder and Lemmon (2002) emphasise that electricity cannot be economically stored and that familiar arbitrage-based methods are not directly applicable for pricing power derivative contracts. Deng and Oren (2006) review electricity derivatives and risk-management practices in power markets, highlighting distinctive risks faced by generators, load-serving entities, and market participants. A renewable-energy-linked claim is exposed not only to ordinary price uncertainty, but also to physical and market-structure constraints.

For this thesis, pricing is part of credibility, not only valuation. If an energy-linked claim is issued without accounting for volatility, output uncertainty, location, shortfall risk, oracle error, or settlement timing, then the claim may be under-collateralised or misleading. Explicit pricing makes these risks visible before issuance and settlement. That is why Chapter 4 precedes the implementation framework in Chapter 5.

## 2.9 Smart Contracts, Oracles, Tokenisation, and Governance

Smart contracts are relevant because they can encode rules for issuance, transfer, redemption, and settlement. Cong and He (2019) analyse how blockchain and smart contracts can affect economic organisation by reducing certain verification and enforcement costs. Automation can make rules more transparent, but it does not guarantee credibility. A smart contract can enforce a weak rule, accept bad data, or automate an under-collateralised claim.

Tokenisation is relevant because energy-linked finance would likely involve digital claims representing some relationship to energy production, value, or settlement. Bank for International Settlements (2023) work on tokenisation and unified ledgers emphasises that tokenisation can improve programmability and settlement when assets and money exist on a common platform with clear rules and governance. Tokenisation by itself does not make a claim credible. The question is what the token represents, how the obligation is verified, how settlement occurs, and who can change the rules.

The oracle problem is central because energy production is off-chain. Blockchains cannot natively observe physical energy production. A contract cannot independently know whether electricity was generated, exported, stored, curtailed, or settled without a data bridge. Oracle systems provide that bridge, but they introduce trust, reliability, and governance problems (Chainlink, 2025). For energy-linked claims, oracle design is part of the financial constraint, not a minor technical detail.

Decentralised oracle networks may reduce reliance on single data providers, but distributing data on-chain does not automatically solve the truth problem. If the underlying meter, reporting process, or data source is unreliable, aggregation does not make it true. Governance therefore matters because administrative powers can undermine otherwise credible constraints. If an administrator can mint without evidence, change pricing parameters without limits, replace oracles without delay, or override redemption rules, then energy is not truly constraining the system.

Smart contracts can help express the thesis’s five conditions in software, but production readiness would still require legal agreements, audits, live data infrastructure, reserves, dispute mechanisms, cybersecurity, and regulatory analysis. Chapter 5 tests technical expressibility under those limits.

### 2.9.1 Relation to Stablecoin Design (Comparison, Not Identity)

Readers familiar with stablecoins may ask how this thesis relates to USDC, DAI, or other dollar-pegged instruments.

**Stablecoins** are mainly **liability designs**: who holds reserves, how redemption works, how the peg is defended under stress, and how attestations are published. **This thesis** studies whether **energy production and measurement** can act as an **issuance and settlement constraint** — with USD used only as a **valuation reference** in the pricing layer, not as a promised market peg.

That makes the present work a **step before** stablecoin claims. A credible stablecoin story would still need everything in this thesis — verified data, bounded issuance, priced risk, protected settlement, and governance limits — **plus** reserve policy, legal classification, liquidity, and peg operations at scale. The Sepolia prototype in Chapter 5 is feasibility evidence for the constraint layer, not proof of dollar parity.

## 2.10 Synthesis and Research Gap

The literatures reviewed in this chapter show that credible financial systems depend on constraints, but those constraints differ across systems. Gold uses physical convertibility, fiat money uses institutional credibility, Bitcoin uses protocol scarcity and proof-of-work, renewable energy provides real production under uncertainty, pricing theory models uncertain payoffs, and smart contracts encode rules. The thesis problem appears at their intersection: how to connect real energy production or cost to digital financial claims without overclaiming backing, ignoring risk, or relying on unrestricted discretion.

The gap is not that no one has studied credibility, Bitcoin energy use, renewable-energy finance, option pricing, or smart contracts. The gap is that these literatures do not yet provide a joint framework for using energy as a credible digital financial constraint. Bitcoin literature shows energy expenditure but not direct energy claims. Renewable-energy finance shows real production but not token issuance rules. Pricing literature shows how to value uncertainty but not how to connect valuation to digital settlement. Smart-contract literature shows programmable enforcement but not whether the enforced claim is economically credible.

This thesis responds to the gap with a five-condition framework. Energy can act as a credible constraint only when:

**1. Reliable energy data.** The system must define what is measured and accept only evidence strong enough for the claim. Satellite irradiance is not a signed meter reading. Modelling data is not final site-level settlement.

**2. Rule-bound issuance.** Tokens or contracts may be created only when accepted energy evidence is present. If an issuer can mint without verification, energy is not constraining the system.

**3. Explicit pricing and risk controls.** Renewable output is uncertain. Volatility, shortfall risk, basis risk, and oracle error must be priced or bounded before claims are issued at scale.

**4. Protected settlement.** The system must define what is owed, what happens under shortfall or dispute, and what collateral, reserve, or margin rules apply.

**5. Limited governance.** Administrators must not be able to override constraints instantly. Governance delay, role separation, audit trails, and emergency procedures are part of credibility.

Several objections to energy as a monetary or financial constraint remain important. Energy is not storable like gold; measurement can be manipulated; kilowatt-hours are not uniform across time and place; and financial claims still need demand, liquidity, law, and trust. This thesis accepts those limits. It does not claim that energy by itself is already money. It claims that energy may provide a verifiable constraint for digital financial claims when the five conditions are met.

The remaining chapters operationalise this gap. Chapter 3 tests whether energy cost appears to matter in Bitcoin valuation. Chapter 4 develops a renewable-energy pricing framework to make energy-linked risk explicit before issuance. Chapter 5 turns the framework into proof-of-concept software to test whether the constraints can be represented in smart contracts.

## 2.11 Chapter Conclusion

This chapter has argued that the central issue is not whether money should be gold, fiat, Bitcoin, or energy. The central issue is credibility: what limits money or financial claims, and can users verify those limits?

Gold provided a physical production constraint but failed as a scalable modern settlement system. Fiat money provides flexibility but depends on institutional credibility. Bitcoin provides technical scarcity and an indirect energy cost, but its connection between energy and value is passive and market-dependent. Renewable-energy finance and pricing literature show that real production and uncertain payoffs must be treated explicitly. Smart-contract and oracle literature show that rules can be encoded, but not that weak claims become credible through automation alone.

Energy is worth testing because it combines real production cost, economic usefulness, increasing measurability, and compatibility with digital contract rules. But energy also creates hard problems: locality, volatility, non-storability, measurement risk, and settlement risk.

The conclusion is therefore bounded. Energy is not automatically a monetary base. It becomes relevant only if a system can measure it, price its risk, limit issuance by rule, protect settlement, and limit governance. Chapter 3 begins the empirical test using Bitcoin, the clearest existing case of digital money connected to energy expenditure.

> **Key takeaway:** Every monetary system uses a constraint — gold, institutions, or code. Energy is worth testing because it ties claims to real production, but only with explicit data, pricing, settlement, and governance rules.

## References

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Bessembinder, H., & Lemmon, M. L. (2002). Equilibrium pricing and optimal hedging in electricity forward markets. *Journal of Finance, 57*(3), 1347-1382.

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Bordo, M. D. (1993). The gold standard, Bretton Woods and other monetary regimes: A historical appraisal. *Federal Reserve Bank of St. Louis Review, 75*(2), 123-191.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Cambridge Centre for Alternative Finance. (n.d.-c). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Chainlink. (2025). *The blockchain oracle problem*. https://chain.link/education-hub/oracle-problem

Cong, L. W., & He, Z. (2019). Blockchain disruption and smart contracts. *The Review of Financial Studies, 32*(5), 1754-1797.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Deng, S. J., & Oren, S. S. (2006). Electricity derivatives and risk management. *Energy, 31*(6-7), 940-953.

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Federal Reserve Bank of St. Louis. (2010). *Central bank credibility and inflation expectations*. https://www.stlouisfed.org/publications/regional-economist/january-2010/central-bank-credibility-and-inflation-expectations

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

Kydland, F. E., & Prescott, E. C. (1977). Rules rather than discretion: The inconsistency of optimal plans. *Journal of Political Economy, 85*(3), 473-491.

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus-lcoeplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

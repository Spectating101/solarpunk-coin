# Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance

**Christopher Ongko**  
**Student ID: 1133958**

Department of Finance, Yuan Ze University  
Master's Thesis — July 2026

---

## Abstract

This thesis asks whether energy can act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work.

The answer is conditional. Energy is not money by itself, but it combines production cost, economic usefulness, measurability, and compatibility with rule-based digital enforcement. The thesis argues that credibility requires five integrated constraints: reliable energy data, rule-bound issuance, explicit pricing and risk controls, protected settlement and redemption accounting, and limited governance.

The empirical chapters study Bitcoin as evidence that energy cost can matter for digital valuation, but only conditionally and specification-sensitively. The pricing chapter develops a reproducible option-style framework for renewable-energy-linked claims using public data, numerical validation, and oracle-tolerance analysis. The implementation chapter maps the constraints to a proof-of-concept smart contract system on Ethereum Sepolia, including an energy-native SPK v1 circulation loop with indexed on-chain payments.

The contribution is a bounded research framework—not a production-ready currency or stablecoin launch. The thesis shows how energy-linked digital finance can be studied, priced, and prototyped under explicit limits that users can inspect.

**Keywords:** Energy-linked finance, digital money, monetary credibility, renewable energy risk, Bitcoin energy cost, smart contracts, proof-of-concept

**JEL Codes:** E42, G13, Q42, Q47

## Table of Contents

1. Chapter 1 — Introduction  
2. Chapter 2 — Literature Review and Theoretical Background  
3. Chapter 3 — Empirical Evidence from Bitcoin Energy Costs  
4. Chapter 4 — Pricing Renewable-Energy Risk  
5. Chapter 5 — Constraints Framework and Proof-of-Concept Implementation  
6. Chapter 6 — Conclusion  
7. References  

## Chapter 1 - Introduction

### At a glance

| | |
|---|---|
| **Question** | Can energy credibly constrain digital money — and under what rules? |
| **Takeaway** | Energy is not money by itself; credibility needs verifiable limits on data, issuance, pricing, settlement, and governance. |
| **Evidence path** | Bitcoin empirics → renewable-energy pricing → Sepolia proof-of-concept |
| **This is not** | A stablecoin launch, a gold replacement, or a production-ready currency |
| **Next chapter** | Ch 2 — literature review on monetary credibility, energy finance, and programmable settlement |

### 1.1 Research Motivation

Modern monetary credibility changed after the breakdown of gold convertibility. Under gold-linked systems, money was partly disciplined by the promise of conversion into a scarce physical asset. After the suspension of dollar–gold convertibility in 1971, major monetary systems moved further toward fiat money, where credibility depended more on institutions, legal authority, policy discipline, and public confidence (Eichengreen, 1992; Federal Reserve History, 2013). The source of monetary discipline therefore shifted from physical convertibility toward institutional commitment.

Fiat money solved several practical limits of commodity-backed systems. Without a fixed gold constraint, governments and central banks gained more room to manage liquidity, support payment systems, and respond to financial crises. This flexibility helped fiat money fit the scale and complexity of modern financial systems. At the same time, the loss of commodity convertibility made monetary credibility depend more heavily on policy credibility, legal authority, and trust that discretion would not be abused (Friedman, 1960; Barro and Gordon, 1983).

Bitcoin introduced another response to the problem of monetary discipline. Instead of relying on gold convertibility or central-bank discretion, Bitcoin limits issuance through code and secures the ledger through proof-of-work mining (Nakamoto, 2008). Mining requires electricity, hardware, and computation, giving Bitcoin a real resource-cost dimension. Bitcoin therefore matters to this thesis because it connects digital scarcity to physical expenditure without relying on a central issuer.

Bitcoin’s connection to energy is real, but indirect. Miners consume electricity to secure the network and compete for block rewards, but Bitcoin holders do not receive a claim on the electricity used in mining. Energy expenditure supports the asset’s production and security, but it does not create a redeemable energy-backed claim. This distinction leads to the broader question of whether energy could constrain digital financial claims more directly.

Gold, fiat money, and Bitcoin each represent a different model of constraint: physical convertibility, institutional credibility, and protocol-based scarcity. Each model also leaves a problem unresolved. Gold is operationally fragile, fiat depends on institutional discipline, and Bitcoin links scarcity to energy without creating direct energy settlement claims. This thesis therefore asks whether verified data, pricing, settlement, and governance rules can make energy a credible digital financial constraint. Chapter 2 reviews the literatures that define that question.

### 1.2 Problem Statement

Digital finance can create technical scarcity, but scarcity alone does not guarantee economic credibility. A token, contract, or digital asset can be limited by code, but that limitation does not automatically make the claim valuable, safe, or financially meaningful. Scarcity becomes credible only when users understand what limits the claim, what supports its value, and what happens during issuance, transfer, redemption, or dispute.

Bitcoin shows that energy cost can matter in digital scarcity, but it does not fully solve the credibility problem. Its proof-of-work system requires miners to spend electricity and hardware resources, which gives Bitcoin a real cost structure. However, mining cost does not mechanically determine Bitcoin’s market value. Bitcoin prices are also shaped by demand, liquidity, speculation, regulation, market cycles, and broader financial conditions (Hayes, 2019; Liu and Tsyvinski, 2021). Bitcoin is therefore useful as evidence that energy cost may matter, but insufficient as proof that energy can automatically anchor digital financial value.

Renewable energy creates a different but related problem. Unlike Bitcoin mining, renewable-energy production generates electricity that can be directly useful to households, firms, grids, and infrastructure. Yet the value of that output depends on weather, location, grid access, timing, tariffs, curtailment, storage, and settlement arrangements. A kilowatt-hour generated in one place or time is not financially identical to a kilowatt-hour generated somewhere else. Energy is real production, but it still requires pricing and risk treatment (International Energy Agency, 2023; Lazard, 2025).

The thesis is motivated by the gap between these two sides of the problem. Digital finance can create scarcity, but often lacks a direct connection to real production. Renewable energy creates real production, but its value is variable, local, and settlement-dependent. The research problem is how these two sides could be connected without reducing energy-linked finance to branding, speculation, or unsupported token issuance.

This thesis treats energy-linked digital finance as a **constraint-design problem**. The question is not simply whether energy has value, or whether digital tokens can represent energy. The deeper question is what conditions must hold before energy can credibly limit digital financial claims. A system that can issue claims without reliable data, ignore risk, avoid settlement obligations, or rely on unrestricted governance would not be meaningfully constrained by energy. Chapter 2 develops the literatures behind those conditions; Chapter 5 implements them in proof-of-concept form.

### 1.3 Research Question

The main research question is:

Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

This question does not assume that energy automatically becomes money, nor that digital tokens become credible simply because they refer to energy. Instead, it asks what would be required for energy to discipline digital financial claims in a way that is economically meaningful, technically enforceable, and institutionally bounded.

The thesis answers the question through three supporting questions.

First, does energy cost appear to matter in an existing digital monetary asset? Bitcoin provides the clearest case because mining connects digital scarcity to electricity expenditure.

Second, can renewable-energy risk be priced in a way that makes energy-linked claims financially inspectable? Renewable output is uncertain; claims need explicit volatility, margin, and oracle-tolerance analysis.

Third, can the basic rules of an energy-linked financial system be represented through smart-contract implementation? A theory of energy-linked digital finance is weak if it cannot be translated into enforceable rules.

These questions define the thesis as a first-step study of energy as a financial constraint. The thesis does not attempt to prove that energy can immediately replace fiat money, nor does it claim to design a complete production-ready currency system.

### 1.4 Research Design

The thesis uses three connected types of evidence: Bitcoin empirics, renewable-energy pricing, and proof-of-concept implementation. These components form a sequence rather than three separate projects placed side by side.

The Bitcoin analysis tests whether valuation relative to cumulative mining electricity cost contains information about future returns. This is done through the Cumulative Energy Investment Ratio, or CEIR, which compares Bitcoin’s market value with estimated cumulative mining electricity cost. The China mining-ban period is used to test whether the CEIR–return relationship is regime-dependent, because that shock altered mining geography and therefore the structure of mining costs (Cambridge Centre for Alternative Finance, n.d.-b). Ethereum’s move from proof-of-work to proof-of-stake is used only as a supporting comparison, not the primary identification event (Ethereum.org, n.d.).

The renewable-energy pricing analysis estimates how energy-linked uncertainty can be translated into financial risk. Unlike Bitcoin mining cost, renewable-energy output is tied to electricity that may have direct economic use, but its value is uncertain. The pricing analysis connects energy-output variability to collateral logic, oracle tolerance, and settlement protection. Chapter 2 reviews the pricing literature; Chapter 4 implements a transparent cold-start benchmark.

The implementation analysis tests whether basic energy-linked rules can be represented in smart-contract software. The proof-of-concept does not attempt to launch a production system. It tests whether attestation, issuance, payment, redemption accounting, and claim resolution can be expressed through rule-based software under controlled assumptions.

Together, these evidence paths connect market behaviour, financial risk modelling, and technical feasibility. Chapter 3 asks whether energy cost matters in an existing digital market. Chapter 4 asks how energy-linked risk can be priced. Chapter 5 asks what rules are necessary for energy-linked claims to be credible in implementation.

![Thesis evidence path: Bitcoin empirics → renewable pricing → proof-of-concept rules.](empirical_results/figures/thesis_evidence_path.png)

*Figure 1.1. Three-part evidence design (§1.4). One argument in sequence, not three unrelated studies.*

![Five-constraint architecture for credible energy-linked digital finance.](empirical_results/figures/five_constraints_flow.png)

*Figure 1.2. Integrated constraints preview — developed fully in Chapter 5.*

### 1.5 Contributions

This thesis contributes a conceptual framing, empirical evidence, a pricing method, an architectural framework, and technical feasibility evidence. These contributions are connected by a single argument: energy can only constrain digital financial claims when it is supported by reliable data, explicit valuation logic, settlement protection, and limited governance.

The **conceptual contribution** is to frame energy as a possible financial constraint between monetary credibility and digital scarcity. Existing discussions often treat gold, fiat money, and Bitcoin as separate models of monetary discipline. This thesis connects those models by asking whether energy can provide a real-world production constraint for digital finance without simply copying gold convertibility or relying only on Bitcoin-style proof-of-work.

The **empirical contribution** is to test whether Bitcoin valuation is related to cumulative mining electricity cost through CEIR. Bitcoin is not treated as an energy-backed currency, but as the most visible case where digital scarcity and energy expenditure are connected.

The **pricing contribution** is to develop a method for evaluating renewable-energy-linked claims under uncertainty using option-style numerical methods and public energy data.

The **architectural contribution** is to identify five conditions for credible energy-linked digital finance: reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance.

The **implementation contribution** is to show that parts of the framework can be represented in software on a public testnet, providing feasibility evidence rather than production readiness.

The broader contribution is integration across monetary credibility, Bitcoin mining cost, renewable-energy finance, pricing theory, and smart-contract enforcement.

### 1.6 Scope of the Thesis

The thesis is intentionally limited in scope. It does not claim that energy should immediately replace fiat money, that energy-linked tokens are automatically safe, or that the proposed system is legally or commercially ready. It also does not claim that Bitcoin is already an energy-backed monetary system, or that public satellite data alone proves actual site-level energy production.

The evidence is limited to Bitcoin as a case study of conditional energy-cost relevance, renewable-energy modelling as a transparent cold-start pricing framework, and proof-of-concept smart contracts as feasibility evidence rather than deployment evidence.

Several important issues remain outside the main scope: legal classification, consumer protection, market liquidity, reserve custody, production-grade cybersecurity, utility regulation, tax treatment, and long-term governance in live markets. These issues are essential for real deployment, but they are beyond this thesis’s main purpose. The thesis focuses on the prior question: what architecture is required before energy can credibly constrain digital financial claims at all?

### 1.7 Structure of the Thesis

Chapter 2 reviews the literature and identifies the research gap. It examines monetary credibility, gold and Bretton Woods, fiat money, Bitcoin proof-of-work, Bitcoin energy-cost valuation, renewable-energy finance, pricing theory, and programmable settlement. Its purpose is to show that existing research explains separate parts of the problem, but does not provide an integrated framework for energy-linked digital financial constraints.

Chapter 3 studies Bitcoin as the empirical case for energy-cost valuation. It tests whether Bitcoin’s market value relative to cumulative mining electricity cost contains information about future returns and whether this relationship changes around the China mining-ban period.

Chapter 4 develops the renewable-energy pricing method. It moves from Bitcoin evidence to the problem of valuing energy-linked claims under uncertainty.

Chapter 5 presents the constraints framework and proof-of-concept implementation. It defines the requirements for credible energy-linked digital finance and shows how parts of those requirements can be represented in software.

Chapter 6 concludes by summarising the findings, identifying limitations, and explaining what future research must test before energy-linked digital finance can move closer to deployment.

> **Key takeaway:** Credibility needs verifiable limits — not slogans. This thesis tests whether energy can supply those limits when data, issuance, pricing, settlement, and governance are designed together.

## Chapter 2 - Literature Review and Theoretical Background

### At a glance

| | |
|---|---|
| **Question** | What literatures define “credible constraint,” and where does energy-linked digital finance enter? |
| **Takeaway** | Credibility needs verifiable limits; energy is a serious candidate only with data, pricing, settlement, and governance rules. |
| **Key idea** | Technical scarcity (code, fixed supply) ≠ economic credibility (real cost, enforceable rules). |
| **Not claimed** | Energy stablecoin, USDC replacement, or “energy backs money” by slogan |
| **Next chapter** | Ch 3 — does energy cost show up in Bitcoin’s market data? |

### 2.1 Purpose of the Chapter

Chapter 1 introduced the central research problem: digital systems can create technical scarcity, but scarcity alone does not guarantee economic credibility. This chapter reviews the literatures needed to evaluate whether energy can act as a credible constraint for digital financial claims.

The review is organised around one guiding question: **what makes a financial claim credibly constrained?** Monetary economics explains why commitment and limits on discretion matter (Kydland and Prescott, 1977; Barro and Gordon, 1983). Gold and Bretton Woods show how physical convertibility can discipline claims, but also how that discipline can fail when settlement and institutional support weaken (Bordo, 1993; Eichengreen, 1992; Federal Reserve History, 2013). Bitcoin introduces protocol-based scarcity and proof-of-work expenditure (Nakamoto, 2008), while renewable-energy finance shows that real energy production has value but also uncertainty (International Energy Agency, 2023; Lazard, 2025). Pricing and smart-contract literature then help explain how uncertainty and rules might be represented in digital financial systems (Black and Scholes, 1973; Cox, Ross, and Rubinstein, 1979; Cong and He, 2019).

The purpose is not to treat these literatures as separate background topics. It is to show how they jointly define the gap this thesis addresses. Existing research explains important parts of the problem, but not a complete architecture for using verified energy production as a digital financial constraint.

### 2.2 Monetary Credibility, Rules, and Discretion

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

### 2.3 Gold, Bretton Woods, and Physical Monetary Constraint

Gold-backed monetary systems provide the standard historical example of discipline through physical convertibility. Under gold-linked arrangements, monetary claims were credible partly because they could, in principle, be redeemed for a scarce physical asset. Bordo (1993) frames the classical gold standard as a monetary rule that worked partly because it operated as a commitment mechanism. Convertibility created discipline because excessive issuance could create redemption pressure and weaken confidence in the issuer’s ability to maintain the promise.

Gold-backed money also had operational weaknesses. Most users did not personally inspect gold reserves. They trusted banks, governments, vaults, auditors, and international settlement arrangements. Gold was expensive and slow to move. Supply was geographically and politically concentrated. Convertibility created pressure during stress, when holders had incentives to demand gold early. These problems became visible in the breakdown of Bretton Woods.

The Bretton Woods system extended gold-convertibility logic into the post-war international monetary order. Foreign currencies were fixed to the U.S. dollar, and the dollar was convertible into gold at a fixed rate of $35 per ounce for official foreign holders. Federal Reserve History describes Bretton Woods as a system of currency convertibility that lasted until 1971. Eichengreen (1992) emphasises that the arrangement depended on confidence in U.S. reserve management, policy discipline, and political commitment as much as on gold itself.

Bretton Woods was therefore a **hybrid** system. Most countries held dollars as reserves rather than converting every international claim directly into bullion. The United States became the central reserve issuer. As world trade and foreign dollar holdings grew, official dollar claims could rise toward — and in crisis conditions beyond — the quantity of gold the United States was willing or able to redeem at the fixed price. Economists often describe this as a **Triffin-style tension**: the reserve-currency country must supply international liquidity, but growing liability issuance can undermine confidence in convertibility.

By the late 1960s, that tension became harder to manage. U.S. balance-of-payments deficits, Vietnam War and Great Society spending, and rising foreign official dollar holdings increased redemption pressure. Federal Reserve History and U.S. Department of State accounts link the closing of the gold window in August 1971 to those pressures: foreign governments and central banks sought gold for dollars faster than the U.S. gold stock could comfortably support at the fixed price (Federal Reserve History, 2013; U.S. Department of State, n.d.). President Nixon suspended dollar–gold convertibility and announced temporary wage and price controls — the “Nixon shock.” Bretton Woods did not collapse because gold ceased to be scarce, but because **paper claims grew faster than credible settlement capacity**.

The suspension of dollar–gold convertibility in 1971 shows the operational fragility of physical backing. The lesson is not simply that gold failed. It is that a physical backing system can break when redemption promises, reserve capacity, political commitments, and international confidence no longer align. For an energy-linked system, the implication is direct: a claim linked to a real asset is only credible if the settlement architecture can actually support the claim — not merely if the asset exists in principle.

Gold is useful as a historical analogy, but the analogy must be limited. Gold is scarce, durable, relatively uniform, and directly storable. Energy is time-dependent, location-dependent, infrastructure-dependent, and difficult to store directly at scale without conversion or storage technologies. Energy therefore cannot simply copy gold convertibility. If energy is to act as a constraint, it requires verified production data, risk pricing, settlement rules, and governance limits rather than physical hoarding alone.

### 2.4 Fiat Money and Institutional Credibility

Fiat money provides a contrasting model of credibility. In fiat systems, money is supported by legal tender status, state authority, payment infrastructure, taxation systems, central-bank credibility, and public acceptance. This makes fiat a system of institutional constraint rather than physical convertibility.

The strength of fiat money is flexibility. Without a fixed commodity constraint, monetary authorities can manage liquidity, support payment systems, act as lenders of last resort, and respond to crises. However, the same flexibility creates the discipline problem discussed by Kydland and Prescott (1977) and Barro and Gordon (1983). When issuance is not constrained by convertibility, users must trust institutions to manage monetary discretion responsibly. Fiat credibility therefore shifts from physical convertibility to institutional quality.

Central-bank credibility depends heavily on whether public expectations remain anchored. When economic agents view a central bank as credible, inflation expectations are more likely to remain stable, strengthening the effectiveness of monetary policy (Federal Reserve Bank of St. Louis, 2010). Institutional credibility is not automatic. It must be maintained through policy performance, communication, legal authority, and expectations management.

Fiat systems also embed credibility in **infrastructure and law**, not only in central-bank reputation. Legal tender status, taxation in the unit of account, lender-of-last-resort facilities, deposit insurance in many jurisdictions, and payment-system oversight create switching costs and shared expectations. These structures are difficult for a permissionless token issuer to replicate. A smart contract can encode transfer rules, but it cannot automatically inherit tax authority, crisis liquidity backstops, or the legal enforceability that supports sovereign money.

The fiat model matters for energy-linked digital finance because many digital systems attempt to create claims without the institutional depth that supports sovereign money. Central banks operate within legal mandates, payment systems, public accountability structures, and macroeconomic policy frameworks. A token issuer or smart-contract system may not have comparable safeguards. If an energy-linked digital claim is not supported by full institutional credibility, it must rely more heavily on transparent rules, reliable data, priced risk, settlement protection, and constrained governance. Where sovereign money relies on law and policy credibility, an energy-linked claim would need a narrower but **inspectable** substitute: verified production evidence, bounded issuance, explicit pricing, protected settlement, and governance limits.

This thesis does not argue that energy should replace fiat money in general. It asks a narrower question: whether energy can provide a credible constraint for specific digital financial claims under carefully defined conditions.

### 2.5 Bitcoin, Protocol Scarcity, and Proof-of-Work

Bitcoin is the central digital-asset case for this thesis because it introduced a protocol-based model of scarcity. Nakamoto (2008) proposed a peer-to-peer electronic cash system that uses proof-of-work to timestamp transactions and make historical changes costly. Bitcoin’s issuance schedule is defined by protocol rules rather than discretionary monetary policy. This gives Bitcoin a different credibility structure from both gold and fiat: it is neither physically redeemable like gold nor institutionally managed like fiat, but constrained by code, distributed consensus, and proof-of-work mining.

Proof-of-work connects digital scarcity to physical resource expenditure. Miners use electricity and hardware to compete for block rewards and transaction fees. This makes Bitcoin different from ordinary digital information, which can usually be copied at low cost. However, Bitcoin resembles gold in costly production but not in redeemable backing. Bitcoin holders do not receive a claim on the electricity used to mine Bitcoin. Mining expenditure supports network security and issuance competition, but it does not create a direct energy entitlement.

Bitcoin therefore provides evidence that energy can matter in digital value formation, but not that energy cost mechanically determines market value. Cryptocurrency-return literature supports caution. Liu and Tsyvinski (2021) document that cryptocurrency returns behave differently from traditional asset classes and are shaped by crypto-specific factors. Energy expenditure may be informative without being sufficient. A serious empirical design must treat energy cost as one possible valuation component among several, not as the single determinant of price.

Bitcoin’s limitation motivates the thesis’s move from passive energy expenditure to designed energy-linked claims. If energy is to constrain digital financial claims more directly, the system must specify accepted energy data, issuance rules, valuation methods, settlement obligations, and governance limits. Bitcoin serves as the empirical starting point, not the final model.

![Bitcoin (consumption) vs SPK (production) — architectural contrast.](empirical_results/figures/production_vs_consumption.png)

*Figure 2.2. Passive mining expenditure vs designed surplus-production rules (Ch 3 vs Ch 5).*

### 2.6 Bitcoin Energy Valuation and Cryptocurrency Returns

Bitcoin energy-valuation literature asks whether mining cost helps explain Bitcoin’s market value. Hayes (2019) studies Bitcoin price relative to marginal production cost and finds support for a fundamental-value interpretation linked to mining inputs. This literature is important because it treats Bitcoin as a digital asset whose production requires measurable expenditure, especially electricity cost and hardware efficiency.

Hayes’s production-cost logic is useful motivation for empirical testing, but it should not be interpreted as proving a guaranteed intrinsic value or a mechanical energy floor. Mining costs vary with electricity prices, hardware efficiency, network difficulty, and miner behaviour. Market price can diverge from production cost during bubbles, crashes, and changing demand conditions. The thesis therefore uses production-cost logic as motivation for Chapter 3, not as a complete theory of Bitcoin value.

Improved measurability of mining electricity use strengthens the empirical opportunity. The Cambridge Bitcoin Electricity Consumption Index provides estimates of Bitcoin’s power demand and electricity consumption, while Cambridge mining-map materials track geographic hashrate distribution over time (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b; Cambridge Centre for Alternative Finance, n.d.-c). Cambridge’s methodology updates make clear that these measures are model-based estimates rather than direct observation of every miner’s electricity use. This distinction matters because any cumulative energy-cost benchmark depends on estimated inputs.

Mining geography matters because energy cost is location-dependent. Electricity prices, energy mixes, regulatory conditions, and infrastructure constraints vary across locations. The China mining-ban period is especially relevant because it created a major shift in the geographic distribution of Bitcoin mining. If mining geography changes, the cost structure of mining may also change, which may affect any relationship between energy cost and Bitcoin valuation.

This thesis uses the Cumulative Energy Investment Ratio, or CEIR, as a valuation-ratio test rather than a claim of intrinsic value. CEIR compares Bitcoin’s market capitalisation with cumulative estimated mining electricity cost and asks whether that ratio contains information about future returns. Chapter 3 tests this question directly. The literature reviewed here motivates that test; it does not prejudge the result.

### 2.7 Renewable-Energy Finance, Data, and Risk

Renewable-energy finance provides the production side of the thesis because it concerns real electricity output rather than electricity consumed in mining. Renewable assets generate output that can serve households, firms, grids, and infrastructure. However, renewable-energy production does not have stable or uniform financial value. Its value depends on output variability, location, timing, grid connection, storage, tariffs, curtailment, and settlement rules.

Levelised-cost studies such as Lazard (2025) show that renewables can be highly cost-competitive for new-build generation. Cost competitiveness matters because the thesis is not based on the idea that renewable energy is merely symbolic. However, levelised cost does not itself create a financial claim. A low generation cost does not prove that a token linked to energy is credible. Credibility still requires measurement, pricing, claim definition, and settlement.

The International Energy Agency (2023) emphasises that mobilising investment and finance remains a central challenge for clean-energy transitions, especially in emerging and developing economies. Energy-linked digital finance can be framed as a possible financing architecture, not merely a token experiment. However, digital finance does not automatically reduce financing risk unless it improves the credibility of claims.

Public energy datasets are useful for modelling but insufficient for final settlement. NASA POWER provides satellite-derived solar and meteorological data, while NREL PVWatts estimates photovoltaic production from location and system inputs (NASA POWER, n.d.; NREL, n.d.). These tools support benchmarking and cold-start analysis. They cannot by themselves prove that a specific site produced, exported, stored, or settled a given amount of electricity. For energy-linked finance, modelling data and settlement-grade evidence must be treated as different categories.

Because renewable-energy output and value are uncertain, energy-linked digital claims should not be issued merely because a project is associated with renewable production. A credible claim requires a method for translating energy uncertainty into financial terms, including expected production, volatility, shortfall risk, basis risk, settlement timing, and data reliability. Renewable-energy finance therefore leads directly into the pricing literature reviewed next.

### 2.8 Pricing Energy-Linked Claims

Pricing is necessary because energy-linked claims have uncertain payoffs. Black and Scholes (1973) introduced a foundational continuous-time option-pricing framework, while Cox, Ross, and Rubinstein (1979) developed a binomial approach that represents uncertainty through discrete up-and-down movements. These models are not directly sufficient for all electricity markets, but they provide a disciplined language for modelling uncertainty, volatility, time, discounting, and payoff structure. This thesis uses that logic to frame renewable-energy-linked claims as uncertain financial claims rather than simple fixed promises.

Black–Scholes is useful as a benchmark, but its standard assumptions are restrictive for electricity and renewable-energy applications. Electricity prices can show spikes, seasonality, mean reversion, congestion effects, and non-storability. Renewable-energy output depends on weather and site conditions rather than only traded asset dynamics. This thesis does not treat Black–Scholes as a final electricity-market model. It uses option-style reasoning as a transparent starting point.

The Cox–Ross–Rubinstein binomial model is especially useful because it provides a transparent numerical method that can be explained and implemented in a thesis setting. For an energy-linked claim, binomial pricing can serve as a cold-start approach under explicit assumptions about volatility, time horizon, discount rate, and payoff structure. Chapter 4 implements this approach; the present section only positions it in the literature.

Electricity-market literature shows why energy pricing is more difficult than standard financial pricing. Bessembinder and Lemmon (2002) emphasise that electricity cannot be economically stored and that familiar arbitrage-based methods are not directly applicable for pricing power derivative contracts. Deng and Oren (2006) review electricity derivatives and risk-management practices in power markets, highlighting distinctive risks faced by generators, load-serving entities, and market participants. A renewable-energy-linked claim is exposed not only to ordinary price uncertainty, but also to physical and market-structure constraints.

For this thesis, pricing is part of credibility, not only valuation. If an energy-linked claim is issued without accounting for volatility, output uncertainty, location, shortfall risk, oracle error, or settlement timing, then the claim may be under-collateralised or misleading. Explicit pricing makes these risks visible before issuance and settlement. That is why Chapter 4 precedes the implementation framework in Chapter 5.

### 2.9 Smart Contracts, Oracles, Tokenisation, and Governance

Smart contracts are relevant because they can encode rules for issuance, transfer, redemption, and settlement. Cong and He (2019) analyse how blockchain and smart contracts can affect economic organisation by reducing certain verification and enforcement costs. Automation can make rules more transparent, but it does not guarantee credibility. A smart contract can enforce a weak rule, accept bad data, or automate an under-collateralised claim.

Tokenisation is relevant because energy-linked finance would likely involve digital claims representing some relationship to energy production, value, or settlement. Bank for International Settlements (2023) work on tokenisation and unified ledgers emphasises that tokenisation can improve programmability and settlement when assets and money exist on a common platform with clear rules and governance. Tokenisation by itself does not make a claim credible. The question is what the token represents, how the obligation is verified, how settlement occurs, and who can change the rules.

The oracle problem is central because energy production is off-chain. Blockchains cannot natively observe physical energy production. A contract cannot independently know whether electricity was generated, exported, stored, curtailed, or settled without a data bridge. Oracle systems provide that bridge, but they introduce trust, reliability, and governance problems (Chainlink, 2025). For energy-linked claims, oracle design is part of the financial constraint, not a minor technical detail.

Decentralised oracle networks may reduce reliance on single data providers, but distributing data on-chain does not automatically solve the truth problem. If the underlying meter, reporting process, or data source is unreliable, aggregation does not make it true. Governance therefore matters because administrative powers can undermine otherwise credible constraints. If an administrator can mint without evidence, change pricing parameters without limits, replace oracles without delay, or override redemption rules, then energy is not truly constraining the system.

Smart contracts can help express the thesis’s five conditions in software, but production readiness would still require legal agreements, audits, live data infrastructure, reserves, dispute mechanisms, cybersecurity, and regulatory analysis. Chapter 5 tests technical expressibility under those limits.

#### 2.9.1 Relation to Stablecoin Design (Comparison, Not Identity)

Readers familiar with stablecoins may ask how this thesis relates to USDC, DAI, or other dollar-pegged instruments.

**Stablecoins** are mainly **liability designs**: who holds reserves, how redemption works, how the peg is defended under stress, and how attestations are published. **This thesis** studies whether **energy production and measurement** can act as an **issuance and settlement constraint** — with USD used only as a **valuation reference** in the pricing layer, not as a promised market peg.

That makes the present work a **step before** stablecoin claims. A credible stablecoin story would still need everything in this thesis — verified data, bounded issuance, priced risk, protected settlement, and governance limits — **plus** reserve policy, legal classification, liquidity, and peg operations at scale. The Sepolia prototype in Chapter 5 is feasibility evidence for the constraint layer, not proof of dollar parity.

### 2.10 Synthesis and Research Gap

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

### 2.11 Chapter Conclusion

This chapter has argued that the central issue is not whether money should be gold, fiat, Bitcoin, or energy. The central issue is credibility: what limits money or financial claims, and can users verify those limits?

Gold provided a physical production constraint but failed as a scalable modern settlement system. Fiat money provides flexibility but depends on institutional credibility. Bitcoin provides technical scarcity and an indirect energy cost, but its connection between energy and value is passive and market-dependent. Renewable-energy finance and pricing literature show that real production and uncertain payoffs must be treated explicitly. Smart-contract and oracle literature show that rules can be encoded, but not that weak claims become credible through automation alone.

Energy is worth testing because it combines real production cost, economic usefulness, increasing measurability, and compatibility with digital contract rules. But energy also creates hard problems: locality, volatility, non-storability, measurement risk, and settlement risk.

The conclusion is therefore bounded. Energy is not automatically a monetary base. It becomes relevant only if a system can measure it, price its risk, limit issuance by rule, protect settlement, and limit governance. Chapter 3 begins the empirical test using Bitcoin, the clearest existing case of digital money connected to energy expenditure.

> **Key takeaway:** Every monetary system uses a constraint — gold, institutions, or code. Energy is worth testing because it ties claims to real production, but only with explicit data, pricing, settlement, and governance rules.

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

The data and descriptive evidence for the regression panel appear in Tables 3.2–3.6. Table 3.2 lists the main series and sources. Table 3.3 gives sample dates and observation counts. Table 3.4 defines the regression variables. Tables 3.5 and 3.6 report descriptive statistics and correlations on the regression-ready panel (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b; Cambridge Centre for Alternative Finance, n.d.-c). Table 3.7 summarises the chapter's main quantitative claims and boundaries.

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

The preferred level specification appears in Table 3.7. Section 3.9 records supplementary boundary checks only.

### 3.9 Supplementary CEIR Checks 

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

## Chapter 4 - Pricing Renewable-Energy Risk

### At a glance

| | |
|---|---|
| **Question** | How do you price an energy-linked claim when there is no liquid options market? |
| **Method** | Option-style model on $/kWh; binomial tree + Monte Carlo cross-check |
| **Base case** | Taiwan: S₀ = $0.0525/kWh, σ ≈ 189%, call ≈ $0.0192/kWh (binomial) |
| **Also covers** | Cross-location comparison, oracle tolerance, collars, margin |
| **Takeaway** | Risk must be **inspectable** before settlement rules can be credible |
| **Next chapter** | Ch 5 — five constraints + Sepolia implementation |

### 4.1 Purpose of the Chapter

Chapter 2 argued that renewable-energy-linked claims require explicit pricing before issuance can be credible. Chapter 3 showed that energy cost can matter in a digital market, but that the relationship is conditional and regime-dependent. This chapter implements the pricing layer.

If energy is going to constrain digital money or energy-linked contracts, the system must be able to price energy risk. Energy production is not constant. Solar and wind output vary by location, season, weather, and grid conditions. A financial claim linked to energy cannot be credible if it ignores that variability.

This chapter therefore asks how an energy-linked financial contract can be priced when the underlying source is variable, local, and not supported by a liquid options market.

The answer developed here is a practical **cold-start** pricing framework. It does not claim to be the final model for all electricity markets. It provides a reproducible starting point when implied volatility and liquid derivatives are unavailable: use public energy data to estimate volatility, define a simple payoff, price the payoff with standard numerical methods, and test whether the result is stable enough to inform collateral and settlement rules.

This matters for the thesis because pricing is one of the conditions that turns "energy-linked" from a label into a credible financial constraint. If risk is not priced, token creation or settlement promises can become under-collateralised claims.

### 4.2 Why Pricing Comes Before Settlement

An energy-linked contract cannot be credible only because it references energy. It must also define the value and risk of that reference.

For example, suppose a contract promises protection against low renewable-energy output or creates a token based on verified renewable generation. Several questions immediately appear: how much the energy is worth; how variable output is; what collateral or reserve should be posted; how much oracle or measurement error the system can tolerate; and which locations are suitable for the design.

These are pricing questions before they are implementation questions. A smart contract can enforce a rule, but it cannot make a bad rule economically sound. If the pricing model underestimates volatility or shortfall risk, the contract can still execute correctly while producing a fragile financial instrument.

For this reason, this chapter treats pricing as part of credibility. A system that links financial claims to energy must measure not only expected energy value, but also uncertainty around that value.

### 4.3 The Underlying Risk

Renewable output varies with irradiance, weather, season, equipment, and grid conditions. A kilowatt-hour is not a uniform financial object; its value depends on where and when it is produced and how the market prices it.

The chapter focuses on solar-linked examples because public resource data are widely available (NASA POWER; NREL PVWatts). Those datasets support modelling and benchmarking. They do not substitute for meter or inverter evidence at settlement—a distinction developed further in Chapter 5.

#### 4.3.1 Location inputs and volatility calibration

Table 4.4 records the cross-location inputs used in Chapter 4. Spot proxies `S₀` follow published LCOE or tariff proxies; volatilities are **cold-start** estimates from NASA POWER irradiance variability, not market-implied option vols. Taiwan σ = 189.5% under the preferred `thesis_reconstructed` method (`calibration_diagnostics_real.csv`; Jarque–Bera p = 0.349).

**Table 4.4. Location parameters and volatility calibration inputs**

| Location | Latitude | Longitude | S₀ ($/kWh) | σ (annual, %) | Risk-free r | σ source |
| --- | --- | --- | --- | --- | --- | --- |
| Taiwan | 23.5000 | 120.9000 | 0.0525 | 189% | 2.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Saudi Arabia | 24.7000 | 46.7000 | 0.0550 | 172% | 2.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Arizona, USA | 33.4000 | -112.1000 | 0.0580 | 165% | 4.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Brazil | -23.5000 | -46.6000 | 0.0950 | 198% | 13.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Germany | 48.1000 | 11.6000 | 0.0250 | 45% | 3.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |

*Horizon T = 0.25 years for all sites; ATM convention K = S₀ per location (Table 4.2). Script: `options_pricing.py`.*

**Table 4.5. Binomial tree convergence (Taiwan base case)**

| Steps (N) | Option Price ($/kWh) | Change from Previous |
| --- | --- | --- |
| 50 | 0.0191 | — |
| 100 | 0.0191 | +0.247% |
| 200 | 0.0192 | +0.124% |
| 400 | 0.0192 | +0.062% |
| 800 | 0.0192 | +0.031% |
| 1200 | 0.0192 | +0.010% |

*Preferred engine setting: N = 400 steps. Source: `binomial_convergence_table.csv`.*

**Table 4.6. Margin stress grid (selected S₀ and σ)**

| S₀ | σ | VaR₉₉ | Initial margin (1.5×) |
| --- | --- | --- | --- |
| $0.0420 | 142% | $0.1776 | $0.2665 |
| $0.0420 | 189% | $0.3378 | $0.5066 |
| $0.0420 | 236% | $0.6146 | $0.9219 |
| $0.0525 | 142% | $0.2220 | $0.3331 |
| $0.0525 | 189% | $0.4222 | $0.6333 |
| $0.0525 | 236% | $0.7682 | $1.1524 |
| $0.0630 | 142% | $0.2665 | $0.3997 |
| $0.0630 | 189% | $0.5066 | $0.7599 |
| $0.0630 | 236% | $0.9219 | $1.3828 |

*Initial margin = 1.5 × VaR₉₉ of spot; Taiwan base case highlighted at S₀ = $0.0525/kWh, σ = 189%. Full grid: `margin_stress_table.csv`.*


### 4.4 Model Setup

The pricing framework treats energy value as the underlying for a short-horizon option-style claim, expressed in dollars per kilowatt-hour ($/kWh). The main inputs are the spot proxy `S₀`, strike `K`, volatility σ, risk-free rate `r`, and horizon `T`.

The chapter uses a Taiwan base case at `T = 0.25` years as the preferred numerical anchor (Table 4.1). Location-level values for `S₀`, `r`, and cold-start σ appear in Table 4.4 (§4.3.1). Volatility is estimated from NASA POWER irradiance variability because traded option implied volatility is not available for these sites. Geometric Brownian motion is used as a transparent short-horizon benchmark. It is not a claim that electricity prices follow GBM everywhere; jumps, seasonality, negative prices, and mean reversion remain extensions for future work.

**Table 4.1. Taiwan base case (numerical anchor)**

| Parameter | Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.01957/kWh` |
| Method gap | About `+2.1%` Monte Carlo vs binomial |

### 4.5 Numerical Pricing Methods

The chapter prices the payoff with two standard numerical methods: a binomial tree (Cox, Ross, and Rubinstein, 1979) and Monte Carlo simulation. Agreement between the two methods under identical assumptions supports reproducibility.

Table 4.2 and Figure 4.2 report cross-location at-the-money values, with `K = S₀` at each site. For high-volatility locations, binomial and Monte Carlo values differ by about 2%. Germany's option value is small because both `S₀` and σ are low; Brazil's is large because both are high. Older runs that fixed `K = $0.0525` across all sites are retained only as non-canonical robustness artifacts (`PRICING_ROBUSTNESS_NOTES.md`).

Table 4.5 and Figure 4.3 show that Taiwan binomial prices stabilise by about `N = 400` steps, which is the engine default.

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | % Diff (B vs MC) |
|---|---:|---:|---:|---:|---:|
| Germany | 0.0250 | 45% | 0.00234 | 0.00236 | 0.9% |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.01957 | 2.1% |
| Saudi Arabia | 0.0550 | 172% | 0.01841 | 0.01876 | 1.9% |
| Arizona, USA | 0.0580 | 165% | 0.01877 | 0.01911 | 1.8% |
| Brazil | 0.0950 | 198% | 0.03702 | 0.03781 | 2.1% |

*Strike: `K = S₀` per location. Source: `cross_location_pricing.csv`.*

![Cross-location binomial vs Monte Carlo ATM call values.](empirical_results/figures/cross_location_pricing.png)

*Figure 4.2. Cross-location ATM comparison.*

![Binomial tree convergence for Taiwan parameters.](empirical_results/figures/binomial_convergence.png)

*Figure 4.3. Binomial convergence (Taiwan).*

### 4.6 Cross-Location Results

Renewable risk is local. Inputs in Table 4.4 produce the option values in Table 4.2 and the collateral implications in Table 4.6. High-volatility sites such as Brazil and Taiwan require larger option values and margins than Germany.

The contribution is therefore not a single universal energy price. It is a location-specific, inspectable risk toolkit whose assumptions can be challenged and rerun. A credible energy-linked contract should state its inputs openly rather than hide them behind a generic label.

### 4.7 Collars, Oracle Tolerance, and Margin

Beyond the base call valuation, the chapter tests three design-relevant extensions.

First, collars limit upside and downside with paired options. Under symmetric percentage strikes in a lognormal model, a net credit can arise structurally because the out-of-the-money call sits closer in log space than the out-of-the-money put. Credit magnitude grows with σ; it is not presented here as a discovered volatility threshold.

Second, oracle tolerance asks how much measurement error a hedge can tolerate before effectiveness falls below a target (Table 4.3, Figure 4.5). High-volatility sites accept more error than Germany for the same variance-reduction goal. That result is directly relevant to whether meter-grade data, inverter logs, or satellite proxies are adequate for a given claim.

![Oracle tolerance by location (variance reduction ≥ 95%).](empirical_results/figures/oracle_tolerance_bars.png)

*Figure 4.5. Oracle tolerance by location.*

Third, margin and collateral requirements rise with `S₀` and σ (Table 4.6, Figure 4.4). At Taiwan's spot proxy with σ = 189%, initial margin is about `$0.63/kWh` under a 1.5× VaR₉₉ rule. Issuance without stress-aware collateral rules would therefore be irresponsible even if the contract executes correctly on-chain.

![Initial margin vs volatility at Taiwan spot proxy.](empirical_results/figures/margin_stress_taiwan.png)

*Figure 4.4. Margin stress (Taiwan S₀).*

**Table 4.3. Maximum oracle error for variance reduction ≥ 95%**

| Location | Maximum Oracle Error for Variance Reduction >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

### 4.8 What the Pricing Layer Proves and Does Not Prove

The pricing layer supports four bounded claims. First, energy-linked payoffs can be valued under explicit assumptions. Second, public data can supply cold-start volatility when implied volatility is absent. Third, independent numerical methods can cross-check stability. Fourth, the resulting outputs can inform margin and oracle-tolerance design.

The pricing layer does not show that GBM is universally correct, that it replaces market-implied volatility where markets exist, or that it resolves liquidity, legal enforceability, basis risk, or physical settlement. This cold-start layer supports modelling and stress-testing under transparent assumptions; meter verification and contract law remain separate problems, developed further in Chapter 5.

The contribution is therefore methodological: a path from public energy data to transparent risk metrics, not a completed market design.

### 4.9 Chapter Conclusion

Chapter 3 showed conditional evidence that energy cost can matter in digital markets. This chapter showed how renewable-energy-linked risk can be priced and stress-tested under explicit, location-specific assumptions.

Pricing is not optional for credible energy-linked finance. A rule-bound contract without a pricing and collateral layer can still be economically fragile even when it executes faithfully in software.

Chapter 5 turns to the rules—data, issuance, settlement, and governance—that must wrap any such pricing in enforceable implementation.

> **Key takeaway:** Public data and transparent numerics can support collateral and oracle design—they do not replace meter verification or legal settlement.

## Chapter 5 - Constraints Framework and Proof-of-Concept Implementation

### At a glance

| | |
|---|---|
| **Question** | What rules must hold in code for energy-linked finance to be credible? |
| **Framework** | Five constraints: data → issuance → pricing → settlement → governance |
| **Evidence** | Sepolia SPK v1: ~5,499 SPK, 21 payments, peg off, circulation-first |
| **Staging** | Public lab now; closed pilot and mainnet product deliberately blocked |
| **Takeaway** | Technically buildable ≠ production-ready; prototype supports feasibility only |
| **Next chapter** | Ch 6 — answer, limits, and what would falsify the thesis |

### 5.1 Purpose of the Chapter

Chapters 2 through 4 established the thesis in three steps. Chapter 2 reviewed the literatures and identified the five-condition gap. Chapter 3 showed that energy cost can matter in an existing digital market, but that the relationship is conditional. Chapter 4 showed that renewable-energy-linked risk can be priced under explicit assumptions.

This chapter asks what rules are needed for an energy-linked digital instrument to be credible in implementation.

The key point is that a working contract is not enough. A smart contract can execute rules, but the rules must be economically meaningful. If the data is unreliable, issuance is discretionary, pricing ignores risk, or settlement is unprotected, then the instrument is not credible simply because it uses code.

The chapter therefore presents a constraints framework and a Sepolia proof-of-concept (SPK v1). The implementation is feasibility evidence: it shows that the core rules can be expressed in software and tested. It is not presented as a production-ready financial system.

### 5.2 The Constraints Framework

The framework has five core constraints.

First, energy data must be reliable enough for the claim being made. Modelled solar potential is useful for forecasting and benchmarking, but actual site-level settlement requires stronger evidence such as meter data, inverter logs, grid records, or audited operator files.

Second, issuance must be rule-bound. If a token or financial claim can be created without verified energy evidence, then energy is not constraining the system.

Third, risk must be priced explicitly. Energy output and energy value are uncertain. A credible system must account for volatility, shortfall risk, oracle error, and basis risk (Chapter 4, Tables 4.3–4.4 and 4.6).

Fourth, settlement must be protected. If users can redeem or settle claims, the system must define what is owed, who owes it, what happens during shortfall, and what collateral or reserve rules apply.

Fifth, governance must be limited. If administrators can change rules instantly or override constraints, then the system reintroduces discretionary control.

These constraints are not independent decorations. They work together. Reliable data without settlement protection creates weak claims. Pricing without verifiable data prices the wrong object. Rule-bound issuance without governance limits can be changed after users rely on the rules.

Table 5.1 summarises the five-constraint framework used in this thesis.

| Constraint | Purpose | Failure If Missing |
|---|---|---|
| Reliable energy data | Defines what energy evidence the system accepts | The system may price or mint against false or weak claims |
| Rule-bound issuance | Limits token or contract creation to accepted evidence | The issuer regains discretionary creation power |
| Explicit pricing and risk controls | Accounts for volatility, basis risk, oracle error, and shortfall risk | Claims become underpriced or under-collateralised |
| Protected settlement and redemption accounting | Defines what is owed and what happens during fulfillment, shortfall, or dispute | Users hold claims without credible resolution rules |
| Limited governance | Restricts discretionary parameter changes and role abuse | The system can override its own constraints |

### 5.3 Constraint 1: Reliable Energy Data

Energy-linked design fails when it confuses resource potential, modelled output, actual generation, surplus export, and tariff value. The proof-of-concept therefore separates modelling data (NASA POWER, PVWatts—for baselines and anomaly checks) from claim data (meter or inverter readings for minting).

The attested mint path follows five steps. First, meter-style readings are submitted. Second, readings are verified and accepted or rejected. Third, accepted readings form a deterministic source hash. Fourth, an attestation signs surplus and metadata. Fifth, the contract mints only after attestation checks pass.

![Attested mint path from meter data to SPK balance.](empirical_results/figures/mint_attestation_flow.png)

*Figure 5.1. Data-to-mint pipeline — source and attestation hashes consumed on-chain.*

The sample data do not prove revenue-grade meter finality. They do prove that accepted and rejected paths can be separated, bound to minting, and protected against replay.

### 5.4 Constraint 2: Rule-Bound Issuance

Issuance must not depend on an administrator's word alone. In the proof-of-concept, rule-bound issuance means that token creation is tied to a verified surplus claim rather than to discretionary minting authority.

The surplus-attestation path binds the recipient, surplus kWh, measurement and validity windows, source hash, chain ID, and contract address into one auditable bundle. Source and attestation hashes are consumed after use, so the same energy claim cannot mint twice. That design turns issuance from a governance decision into a verifiable event.

The public Sepolia record illustrates how this works in practice. In an earlier dollar-translated proof, a signed bundle recorded `2606.7` kWh of accepted surplus and minted `130.1697` SPK at a `$0.05/kWh` basis. The transaction is inspectable on-chain. That result demonstrates implementability. It does not demonstrate production readiness, live operator meters, or legal enforceability.

### 5.5 Constraint 3: Explicit Pricing and Risk Controls

Energy data do not imply financial value. Chapter 4 priced renewable risk under explicit assumptions. Tables 4.3–4.4 (oracle tolerance and location σ) and Table 4.6 (margin stress) are the templates a production system would need, even though SPK v1 does not embed that full pricing engine on-chain.

In the prototype, pricing appears through three channels. At mint, the system applies an energy-price basis (for example `$0.05/kWh` in an earlier proof, or energy-native `1 kWh → 1 SPK` in SPK v1). At redemption, quotes convert burned tokens into owed kWh. In stress artifacts, reserve and shortfall requirements are exposed before any real-value deployment. Together, these channels prevent issuance and settlement from becoming blind accounting.

### 5.6 Constraint 4: Settlement and Redemption Accounting

Issuance without settlement clarity leaves users unsure what they hold. The currency-system contract supports invoice settlement (SPK transferred against a hashed invoice with replay protection) and redemption accounting (tokens burned into owed-kWh claims resolved as fulfilled, shortfall, or disputed).

This is rule enforcement and record-keeping, not guaranteed physical delivery. Real deployment still needs counterparties, legal terms, operator obligations, and reserve policy. The research point is that minting, circulation, redemption, and resolution can be connected in one auditable path.

### 5.7 Constraint 5: Governance Limits and Launch Gates

Unlimited administrative power would reintroduce discretionary issuance into a system that claims to be energy-constrained. The implementation therefore uses role separation, pausing, and governance-delay patterns in the broader design. These controls are directionally correct, but they are not sufficient on their own for production deployment.

Launch gates provide a second layer of discipline by separating three stages: public lab, closed testnet pilot, and paid or mainnet product. Only the public lab stage is launchable under the current evidence base. The pilot and mainnet stages remain blocked until governed deployment, real operator data, hardware provenance, economics, audit, legal scope, redemption policy, and production evidence are in place.

Stating those blockers explicitly is a methodological strength of the thesis. The project does not present testnet demonstration code as finished money. Table 5.2 summarises the staging logic, and Figure 5.6 visualises it.

| Stage | Current Status | Interpretation |
|---|---|---|
| Public lab | Launchable as proof/demo/research evidence | Suitable for advisor, reviewer, and public-lab inspection |
| Closed testnet pilot | Blocked | Needs governed deployment, real operator data, stronger hardware provenance, and anchor economics/support terms |
| Paid/mainnet product | Blocked | Needs audit, legal/commercial scope, redemption policy, production deployment, reserves, real counterparties, and demand |

![Launch-gate staging: public lab vs blocked pilot and mainnet.](empirical_results/figures/launch_gate_stages.png)

*Figure 5.6. Launch-gate staging (§5.7).*

### 5.8 What the Proof-of-Concept Demonstrates — and What It Does Not

The proof-of-concept demonstrates several things. First, an energy-data-to-token path can be implemented with attestation and replay protection. Second, token circulation and redemption accounting can be recorded on-chain. Third, public testnet evidence can be produced and indexed. Fourth, readiness can be separated by stage through launch gates.

It also has clear limits. It does not prove production readiness, legal classification, revenue-grade operator meters, market demand, liquidity, external audit, legally enforceable redemption, or fully funded reserve policy.

These limits matter because they prevent overclaiming. The thesis uses the implementation to support a narrower claim: the constraints framework is technically buildable as a proof of concept. It does not claim the prototype is ready to handle public financial value.

### 5.9 SPK v1 on Sepolia

After an earlier dollar-translated attested mint in May 2026 (contract `0x8ceDa…`), the project deployed SPK v1 on Sepolia in June 2026. SPK v1 is an energy-native, circulation-first implementation of the same constraints framework developed earlier in the chapter.

The following table compares SPK v1 with the earlier attested proof. The earlier proof translated energy into dollars at mint through a `$0.05/kWh` basis and emphasised mint proof plus lab settlement. SPK v1 defaults to energy-native issuance (`1 kWh → 1 SPK`), emphasises network circulation through `settleNetworkPayment`, and keeps the dollar peg off by default. The primary contracts are `0x8e189…` for SPK and `0x52016…` for the CurrencySystem.

![SPK v1 on-chain activity mix (settled vs redeemed vs held).](empirical_results/figures/spk_circulation_share.png)

*Figure 5.7. On-chain activity mix (synced runtime).*

| Parameter | SPK v1 (Jun 2026) | Earlier attested proof |
|---|---|---|
| Issuance | Energy-native (`1 kWh → 1 SPK` default) | Dollar-translated via `$0.05/kWh` basis |
| Primary use | Network circulation (`settleNetworkPayment`) | Mint proof + lab settlement |
| Peg | Off by default | Dollar basis implicit |
| Contracts | `0x8e189…` (SPK), `0x52016…` (CurrencySystem) | `0x8ceDa…` |

SPK v1 is product-oriented evidence rather than a new theoretical claim. The same five constraints appear in a circulation-first posture: hash-consumed issuance, typed network payments with invoice-hash replay protection, gated redemption, and testnet-only operator keys.

Subsections 5.9.1–5.9.2 report canonical contracts, live runtime metrics, and the indexed payment ledger (Table 5.4). These blocks are refreshed from Sepolia testnet state on each thesis build.

Figure 5.7 visualises the activity mix. Payment #15 is a wallet-initiated pilot transfer of 5 SPK. Payment #3 is operator testnet choreography of 180 SPK in NETWORK form, not external commerce.

SPK v1 therefore demonstrates that the framework can support energy-native circulation on a public testnet. It does not demonstrate mainnet readiness, legal money status, or real-site meter finality, as discussed in §5.8.

_Metrics and ledger entries below are synced from public Sepolia testnet state (generated 2026-06-30T15:44:16.534445+00:00)._


##### 5.9.1 Canonical contracts and live metrics


| Contract | Address |
|----------|---------|
| mock_usdc | `0xaD2A7169CfFBA9Bef8C45515fc85178DbBfEc2C9` |
| solar_punk_coin | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| currency_system | `0x520162252F9B94824417678525FFd69145014970` |


- Total supply: **5499.015 SPK**
- Settled: **442.0 SPK**
- Network payments: **21**
- Circulation share: **96.71%**

##### 5.9.2 Indexed payment ledger (Table 5.4)


| # | Kind | SPK | Payee | Payer | Tx |
|---|------|-----|-------|-------|-----|
| 1 | SERVICE | 12.0 | Gateway | Operator | 0x6c65e0ae… |
| 2 | LABOR | 40.0 | Maintenance | Operator | 0x8ad9f3ce… |
| 3 | NETWORK | 180.0 | Operator | Operator | 0x6dbbf639… |
| 4 | GOODS | 55.0 | Merchant | Operator | 0x0d7e506b… |
| 5 | SERVICE | 8.0 | Gateway | Operator | 0xeacc17a4… |
| 6 | GOODS | 12.0 | Merchant | Operator | 0xb4972856… |
| 7 | SERVICE | 6.0 | Gateway | Operator | 0x7bf52655… |
| 8 | LABOR | 10.0 | Maintenance | Operator | 0x1f7cd596… |
| 9 | GOODS | 14.0 | Merchant | Operator | 0x3b912b39… |
| 10 | NETWORK | 8.0 | Network peer | Operator | 0x100b4dec… |
| 11 | SERVICE | 6.0 | Gateway | Operator | 0x7d68647a… |
| 12 | LABOR | 10.0 | Maintenance | Operator | 0xc1eb24c0… |
| 13 | GOODS | 14.0 | Merchant | Operator | 0xd01d4ab8… |
| 14 | NETWORK | 8.0 | Network peer | Operator | 0x2b8e8efb… |
| 15 | GOODS | 5.0 | Merchant | Pilot payer | 0xbd7bb0e5… |
| 16 | SERVICE | 6.0 | Gateway | Operator | 0x7bd6389e… |
| 17 | LABOR | 10.0 | Maintenance | Operator | 0x2fd62cdc… |
| 18 | SERVICE | 6.0 | Gateway | Operator | 0xfc63cd22… |
| 19 | LABOR | 10.0 | Maintenance | Operator | 0xb620ea8c… |
| 20 | GOODS | 14.0 | Merchant | Operator | 0x6b1f3801… |
| 21 | NETWORK | 8.0 | Network peer | Operator | 0x5a72cc73… |

*Table 5.4. Indexed network payments on Sepolia (SPK v1). Payment #15 is the wallet-initiated pilot transfer (Pilot payer → Merchant).*

### 5.10 Chapter Conclusion

Energy-linked digital finance requires all five constraints together: reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance.

The Sepolia prototype shows that the core path can be expressed in code—attested minting, replay-protected payments, redemption accounting, and staged launch gates—while keeping production, legal, and peg claims off the table.

Chapter 6 summarises the bounded thesis answer and what would strengthen or falsify it.

> **Key takeaway:** All five constraints must work together. SPK v1 shows the rules can run on testnet; it does not prove production readiness, a dollar peg, or legal money.

## Chapter 6 - Conclusion

### At a glance

| | |
|---|---|
| **Answer** | Energy can constrain digital finance **only if** the five-part architecture holds together |
| **Contributions** | Conceptual reframe, conditional Bitcoin empirics, pricing method, constraint architecture, Sepolia feasibility |
| **Not claimed** | Stablecoin, fiat replacement, production readiness, legal money |
| **If you remember one line** | Credibility requires verifiable limits — not slogans about “energy-backed money” |

### 6.1 Purpose of the Chapter

This thesis asked whether energy can act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work.

The answer is conditional.

Energy is not money by itself. A kilowatt-hour does not automatically become a currency. But energy has properties that make it worth studying as a financial constraint: it has real production cost, it is economically useful, it is increasingly measurable, and it can be connected to rule-based digital contracts.

The thesis has argued that energy can support digital monetary credibility only when it is embedded in a broader architecture. That architecture requires reliable data, rule-bound issuance, explicit risk pricing, protected settlement, and limited governance.

The main result is therefore not a finished currency. It is a framework for testing and building energy-linked digital finance without relying on vague claims that "energy backs money."

### 6.2 How the Chapters Connect

The argument moves from introduction and literature (Chapters 1–2) through Bitcoin empirics and renewable-energy pricing (Chapters 3–4) to enforceable constraints and Sepolia feasibility (Chapter 5), then closes with limits and falsifiers in this chapter.

![Thesis evidence path (summary diagram).](empirical_results/figures/thesis_evidence_path.png)

*Figure 6.1. How the chapters connect — empirics, pricing, enforceable rules.*

### 6.3 Summary of the Argument

Chapter 1 introduced the problem. Digital money can be technically scarce but still lack economic credibility. Fiat money depends on institutional judgment. Cryptocurrency can depend on code. But neither institutional discretion nor code alone necessarily creates a verifiable link to real production.

Chapter 2 reviewed the literatures on monetary credibility, energy finance, pricing, and programmable settlement, and identified the integrated research gap the thesis addresses. Gold once provided a physical limit on money creation, but gold-backed systems suffered from custody, verification, settlement, and political problems. Fiat money solved some operational problems but shifted credibility toward institutions. Bitcoin introduced code-based scarcity and proof-of-work mining, but its energy link is indirect. Energy is interesting because it combines cost, usefulness, measurability, and compatibility with digital enforcement when the five conditions hold.

Chapter 3 tested whether energy cost appears to matter in an existing digital market. Bitcoin was used because proof-of-work mining connects digital value to electricity use. The empirical evidence supports a bounded conclusion: in the preferred level specification, pre-ban log(CEIR) ≈ −0.26 (significant) and post-ban ≈ −0.07 (weaker, not significant), with a sharp Chow break at the China mining-ban period; a simple trading rule still underperforms buy-and-hold. Energy cost matters conditionally in the pre-ban regime; it does not mechanically determine digital value.

Chapter 4 developed the pricing layer. Renewable-energy-linked claims cannot be credible unless their risk is priced. The chapter used public energy data and option-style numerical methods to show how energy-linked payoffs can be valued under explicit assumptions. It also connected pricing to oracle tolerance, margin, and collateral requirements. The pricing framework is not final, but it shows how energy risk can be made inspectable.

Chapter 5 presented the constraints framework and proof-of-concept implementation. It showed how reliable energy data, rule-bound issuance, pricing, settlement protection, and governance limits can be connected in a technical system. The proof-of-concept demonstrates that the core rules can be expressed in code and tested. It does not demonstrate production readiness.

Taken together, the chapters support the central thesis:

Energy can serve as a credible constraint for digital finance only when the system can verify energy data, limit issuance by rule, price uncertainty, protect settlement, and restrict discretionary governance.

### 6.4 Main Contributions

The first contribution is conceptual. The thesis reframes energy not only as a commodity or climate asset, but as a possible constraint on digital financial claims, and integrates monetary, energy-finance, pricing, and smart-contract literatures into one bounded framework.

The second contribution is empirical. The Bitcoin analysis shows that energy cost can contain valuation information, but that the relationship is conditional and regime-dependent. This avoids two extremes. It does not dismiss energy cost as irrelevant, but it also does not claim that energy mechanically explains digital value.

The third contribution is methodological. The pricing chapter shows how renewable-energy-linked risk can be modelled with public data and standard numerical methods when liquid derivatives markets are unavailable. This provides a practical cold-start approach for pricing and collateral analysis.

The fourth contribution is architectural. The constraints framework identifies the minimum categories of rules needed for credible energy-linked digital finance: data, issuance, pricing, settlement, and governance.

The fifth contribution is technical feasibility. The proof-of-concept implementation shows that the framework can be represented in software. Signed energy-style readings can be checked, source hashes can be consumed, token minting can be tied to accepted surplus, invoice settlement can be recorded, and redemption accounting can track owed-kWh claims and delivery outcomes.

The most important contribution is the integration. Energy is studied as a production cost, a renewable resource, a pricing problem, and a contract-enforced settlement constraint within one thesis.

### 6.5 What the Thesis Does Not Claim

The thesis does not claim that energy should immediately replace fiat money.

It does not claim that a token linked to energy is automatically safe, legal, or valuable.

It does not claim that Bitcoin is already a complete energy-backed currency.

It does not claim that satellite data alone proves actual site-level energy production.

It does not claim that the proof-of-concept implementation is production-ready.

It does not claim that liquidity, legal enforceability, user demand, reserve capital, or utility regulation have been solved.

These boundaries are important. The thesis is a research contribution, not a product launch document. Its purpose is to define and test the conditions under which energy could become a credible constraint in digital finance.

### 6.6 Limitations

The thesis has several limitations.

First, the empirical evidence is based primarily on Bitcoin. Bitcoin is the most important proof-of-work asset, but it is still one asset. A stronger empirical claim would require a panel of proof-of-work assets and more external shocks.

Second, the CEIR evidence is specification-sensitive. The preferred level specification supports the energy-cost interpretation, but differenced specifications are weaker. This means CEIR should be treated as evidence of conditional anchoring, not as a universal valuation law.

Third, mining geography data is limited. Cambridge mining-distribution data does not provide a complete long post-2022 geography series. This limits the ability to extend the concentration-dependent analysis through later years without using weaker proxy assumptions.

Fourth, the pricing model is simplified. Geometric Brownian motion is useful as a transparent short-horizon benchmark, but electricity and renewable-energy markets can show jumps, seasonality, mean reversion, negative prices, curtailment, and local grid constraints.

Fifth, public energy data has limits. NASA POWER and NREL/PVWatts-style data are useful for resource modelling and baseline estimation, but actual site-level settlement requires meter, inverter, grid, or audited operator data.

Sixth, the proof-of-concept implementation is not production-ready. It lacks a real operator meter source, external audit, legal framework, production governance, reserve policy, and live counterparties.

Seventh, the thesis does not solve adoption. A technically credible energy-linked instrument still needs users, market makers, operators, regulators, and liquidity.

### 6.7 What Would Falsify or Weaken the Thesis

A strong thesis should be clear about what would weaken it.

The empirical part would be weakened if broader proof-of-work asset panels showed no relationship between energy cost and valuation under any specification or regime.

The Bitcoin result would be weakened if the CEIR relationship disappeared under more robust controls, non-overlapping return windows, alternative energy-cost constructions, or better post-2022 mining geography data.

The pricing framework would be weakened if public energy-data volatility proved consistently unrelated to actual settlement risk, or if the proposed numerical methods failed under realistic jump, curtailment, or negative-price scenarios.

The implementation argument would be weakened if signed meter data, source-hash controls, replay protection, and settlement accounting could not be made reliable with real operator data.

The broader framework would be weakened if energy-linked claims could not attract counterparties, legal enforceability, or reserve structures even after the technical and pricing problems were solved.

These possible failures do not undermine the current research contribution. They define the next tests.

### 6.8 Future Work

Future work should proceed in five directions.

First, the empirical analysis should be extended. This includes testing other proof-of-work assets, developing better post-2022 mining geography proxies, using non-overlapping return windows, and adding further robustness checks.

Second, the pricing model should be expanded. Future models should test jump diffusion, mean reversion, seasonality, curtailment risk, negative prices, and multi-factor energy-price dynamics.

Third, the data layer should move from public modelling data toward real operator data. A real meter, inverter, grid, or utility-export dataset would significantly strengthen the practical case.

Fourth, the proof-of-concept should be tested in a closed pilot. A closed pilot should use governed deployment, capped exposure, written terms, real data, and no public real-value claims until audit and legal review are complete.

Fifth, legal and market structure need separate study. Energy-linked digital finance raises questions about securities law, commodity law, utility regulation, consumer protection, reserve custody, and redemption obligations. These issues are beyond this thesis but essential before deployment.

### 6.9 Closing Statement

This thesis began with a simple problem: digital money can be created by institutions or code, but credibility still depends on limits that users can understand and verify.

Energy is a serious candidate for such a limit because it is costly, useful, measurable, and connected to real production. But energy does not become money automatically. It must be measured, priced, constrained, settled, and governed.

The thesis therefore does not conclude that energy is a direct replacement for gold or that a prototype can replace existing money. It concludes that energy-linked digital finance is a credible research direction if it is built around constraints rather than claims.

The strongest version of the argument is modest but important:

Energy can help discipline digital financial claims when reliable data, rule-bound issuance, explicit pricing, protected settlement, and governance limits are designed together.

That is the framework this thesis contributes.

## References

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. Bank for International Settlements. https://www.bis.org/publ/arpdf/ar2023e3.htm

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Bessembinder, H., & Lemmon, M. L. (2002). Equilibrium pricing and optimal hedging in electricity forward markets. *Journal of Finance, 57*(3), 1347-1382.

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Bordo, M. D. (1993). The gold standard, Bretton Woods and other monetary regimes: A historical appraisal. *Federal Reserve Bank of St. Louis Review, 75*(2), 123-191.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Cambridge Centre for Alternative Finance. (n.d.-c). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Chainlink. (2025). *The blockchain oracle problem*. https://chain.link/education-hub/oracle-problem

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

Cong, L. W., & He, Z. (2019). Blockchain disruption and smart contracts. *The Review of Financial Studies, 32*(5), 1754-1797.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Deng, S. J., & Oren, S. S. (2006). Electricity derivatives and risk management. *Energy, 31*(6-7), 940-953.

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Federal Reserve Bank of St. Louis. (2010). *Central bank credibility and inflation expectations*. https://www.stlouisfed.org/publications/regional-economist/january-2010/central-bank-credibility-and-inflation-expectations

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

Kydland, F. E., & Prescott, E. C. (1977). Rules rather than discretion: The inconsistency of optimal plans. *Journal of Political Economy, 85*(3), 473-491.

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). *SPK attested mint proof, currency system lab notes, readiness checklist, and product launch gate documentation* [Internal project documentation].

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

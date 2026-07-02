# Chapter 1 - Introduction

## At a glance

| | |
|---|---|
| **Question** | Can energy credibly constrain digital money — and under what rules? |
| **Takeaway** | Energy is not money by itself; credibility needs verifiable limits on data, issuance, pricing, settlement, and governance. |
| **Evidence path** | Bitcoin empirics → renewable-energy pricing → Sepolia proof-of-concept |
| **This is not** | A stablecoin launch, a gold replacement, or a production-ready currency |
| **Next chapter** | Ch 2 — literature review on monetary credibility, energy finance, and programmable settlement |

## 1.1 Research Motivation

Modern monetary credibility changed after the breakdown of gold convertibility. Under gold-linked systems, money was partly disciplined by the promise of conversion into a scarce physical asset. After the suspension of dollar–gold convertibility in 1971, major monetary systems moved further toward fiat money, where credibility depended more on institutions, legal authority, policy discipline, and public confidence (Eichengreen, 1992; Federal Reserve History, 2013). The source of monetary discipline therefore shifted from physical convertibility toward institutional commitment.

Fiat money solved several practical limits of commodity-backed systems. Without a fixed gold constraint, governments and central banks gained more room to manage liquidity, support payment systems, and respond to financial crises. This flexibility helped fiat money fit the scale and complexity of modern financial systems. At the same time, the loss of commodity convertibility made monetary credibility depend more heavily on policy credibility, legal authority, and trust that discretion would not be abused (Friedman, 1960; Barro and Gordon, 1983).

Bitcoin introduced another response to the problem of monetary discipline. Instead of relying on gold convertibility or central-bank discretion, Bitcoin limits issuance through code and secures the ledger through proof-of-work mining (Nakamoto, 2008). Mining requires electricity, hardware, and computation, giving Bitcoin a real resource-cost dimension. Bitcoin therefore matters to this thesis because it connects digital scarcity to physical expenditure without relying on a central issuer.

Bitcoin’s connection to energy is real, but indirect. Miners consume electricity to secure the network and compete for block rewards, but Bitcoin holders do not receive a claim on the electricity used in mining. Energy expenditure supports the asset’s production and security, but it does not create a redeemable energy-backed claim. This distinction leads to the broader question of whether energy could constrain digital financial claims more directly.

Gold, fiat money, and Bitcoin each represent a different model of constraint: physical convertibility, institutional credibility, and protocol-based scarcity. Each model also leaves a problem unresolved. Gold is operationally fragile, fiat depends on institutional discipline, and Bitcoin links scarcity to energy without creating direct energy settlement claims. This thesis therefore asks whether verified data, pricing, settlement, and governance rules can make energy a credible digital financial constraint. Chapter 2 reviews the literatures that define that question.

## 1.2 Problem Statement

Digital finance can create technical scarcity, but scarcity alone does not guarantee economic credibility. A token, contract, or digital asset can be limited by code, but that limitation does not automatically make the claim valuable, safe, or financially meaningful. Scarcity becomes credible only when users understand what limits the claim, what supports its value, and what happens during issuance, transfer, redemption, or dispute.

Bitcoin shows that energy cost can matter in digital scarcity, but it does not fully solve the credibility problem. Its proof-of-work system requires miners to spend electricity and hardware resources, which gives Bitcoin a real cost structure. However, mining cost does not mechanically determine Bitcoin’s market value. Bitcoin prices are also shaped by demand, liquidity, speculation, regulation, market cycles, and broader financial conditions (Hayes, 2019; Liu and Tsyvinski, 2021). Bitcoin is therefore useful as evidence that energy cost may matter, but insufficient as proof that energy can automatically anchor digital financial value.

Renewable energy creates a different but related problem. Unlike Bitcoin mining, renewable-energy production generates electricity that can be directly useful to households, firms, grids, and infrastructure. Yet the value of that output depends on weather, location, grid access, timing, tariffs, curtailment, storage, and settlement arrangements. A kilowatt-hour generated in one place or time is not financially identical to a kilowatt-hour generated somewhere else. Energy is real production, but it still requires pricing and risk treatment (International Energy Agency, 2023; Lazard, 2025).

The thesis is motivated by the gap between these two sides of the problem. Digital finance can create scarcity, but often lacks a direct connection to real production. Renewable energy creates real production, but its value is variable, local, and settlement-dependent. The research problem is how these two sides could be connected without reducing energy-linked finance to branding, speculation, or unsupported token issuance.

This thesis treats energy-linked digital finance as a **constraint-design problem**. The question is not simply whether energy has value, or whether digital tokens can represent energy. The deeper question is what conditions must hold before energy can credibly limit digital financial claims. A system that can issue claims without reliable data, ignore risk, avoid settlement obligations, or rely on unrestricted governance would not be meaningfully constrained by energy. Chapter 2 develops the literatures behind those conditions; Chapter 5 implements them in proof-of-concept form.

## 1.3 Research Question

The main research question is:

Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

This question does not assume that energy automatically becomes money, nor that digital tokens become credible simply because they refer to energy. Instead, it asks what would be required for energy to discipline digital financial claims in a way that is economically meaningful, technically enforceable, and institutionally bounded.

The thesis answers the question through three supporting questions.

First, does energy cost appear to matter in an existing digital monetary asset? Bitcoin provides the clearest case because mining connects digital scarcity to electricity expenditure.

Second, can renewable-energy risk be priced in a way that makes energy-linked claims financially inspectable? Renewable output is uncertain; claims need explicit volatility, margin, and oracle-tolerance analysis.

Third, can the basic rules of an energy-linked financial system be represented through smart-contract implementation? A theory of energy-linked digital finance is weak if it cannot be translated into enforceable rules.

These questions define the thesis as a first-step study of energy as a financial constraint. The thesis does not attempt to prove that energy can immediately replace fiat money, nor does it claim to design a complete production-ready currency system.

## 1.4 Research Design

The thesis uses three connected types of evidence: Bitcoin empirics, renewable-energy pricing, and proof-of-concept implementation. These components form a sequence rather than three separate projects placed side by side.

The Bitcoin analysis tests whether valuation relative to cumulative mining electricity cost contains information about future returns. This is done through the Cumulative Energy Investment Ratio, or CEIR, which compares Bitcoin’s market value with estimated cumulative mining electricity cost. The China mining-ban period is used to test whether the CEIR–return relationship is regime-dependent, because that shock altered mining geography and therefore the structure of mining costs (Cambridge Centre for Alternative Finance, n.d.-b). Ethereum’s move from proof-of-work to proof-of-stake is used only as a supporting comparison, not the primary identification event (Ethereum.org, n.d.).

The renewable-energy pricing analysis estimates how energy-linked uncertainty can be translated into financial risk. Unlike Bitcoin mining cost, renewable-energy output is tied to electricity that may have direct economic use, but its value is uncertain. The pricing analysis connects energy-output variability to collateral logic, oracle tolerance, and settlement protection. Chapter 2 reviews the pricing literature; Chapter 4 implements a transparent cold-start benchmark.

The implementation analysis tests whether basic energy-linked rules can be represented in smart-contract software. The proof-of-concept does not attempt to launch a production system. It tests whether attestation, issuance, payment, redemption accounting, and claim resolution can be expressed through rule-based software under controlled assumptions.

Together, these evidence paths connect market behaviour, financial risk modelling, and technical feasibility. Chapter 3 asks whether energy cost matters in an existing digital market. Chapter 4 asks how energy-linked risk can be priced. Chapter 5 asks what rules are necessary for energy-linked claims to be credible in implementation.

![Thesis evidence path: Bitcoin empirics → renewable pricing → proof-of-concept rules.](empirical_results/figures/thesis_evidence_path.png)

*Figure 1.1. Three-part evidence design (§1.4). One argument in sequence, not three unrelated studies.*

![Five-constraint architecture for credible energy-linked digital finance.](empirical_results/figures/five_constraints_flow.png)

*Figure 1.2. Integrated constraints preview — developed fully in Chapter 5.*

## 1.5 Contributions

This thesis contributes a conceptual framing, empirical evidence, a pricing method, an architectural framework, and technical feasibility evidence. These contributions are connected by a single argument: energy can only constrain digital financial claims when it is supported by reliable data, explicit valuation logic, settlement protection, and limited governance.

The **conceptual contribution** is to frame energy as a possible financial constraint between monetary credibility and digital scarcity. Existing discussions often treat gold, fiat money, and Bitcoin as separate models of monetary discipline. This thesis connects those models by asking whether energy can provide a real-world production constraint for digital finance without simply copying gold convertibility or relying only on Bitcoin-style proof-of-work.

The **empirical contribution** is to test whether Bitcoin valuation is related to cumulative mining electricity cost through CEIR. Bitcoin is not treated as an energy-backed currency, but as the most visible case where digital scarcity and energy expenditure are connected.

The **pricing contribution** is to develop a method for evaluating renewable-energy-linked claims under uncertainty using option-style numerical methods and public energy data.

The **architectural contribution** is to identify five conditions for credible energy-linked digital finance: reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance.

The **implementation contribution** is to show that parts of the framework can be represented in software on a public testnet, providing feasibility evidence rather than production readiness.

The broader contribution is integration across monetary credibility, Bitcoin mining cost, renewable-energy finance, pricing theory, and smart-contract enforcement.

## 1.6 Scope of the Thesis

The thesis is intentionally limited in scope. It does not claim that energy should immediately replace fiat money, that energy-linked tokens are automatically safe, or that the proposed system is legally or commercially ready. It also does not claim that Bitcoin is already an energy-backed monetary system, or that public satellite data alone proves actual site-level energy production.

The evidence is limited to Bitcoin as a case study of conditional energy-cost relevance, renewable-energy modelling as a transparent cold-start pricing framework, and proof-of-concept smart contracts as feasibility evidence rather than deployment evidence.

Several important issues remain outside the main scope: legal classification, consumer protection, market liquidity, reserve custody, production-grade cybersecurity, utility regulation, tax treatment, and long-term governance in live markets. These issues are essential for real deployment, but they are beyond this thesis’s main purpose. The thesis focuses on the prior question: what architecture is required before energy can credibly constrain digital financial claims at all?

## 1.7 Structure of the Thesis

Chapter 2 reviews the literature and identifies the research gap. It examines monetary credibility, gold and Bretton Woods, fiat money, Bitcoin proof-of-work, Bitcoin energy-cost valuation, renewable-energy finance, pricing theory, and programmable settlement. Its purpose is to show that existing research explains separate parts of the problem, but does not provide an integrated framework for energy-linked digital financial constraints.

Chapter 3 studies Bitcoin as the empirical case for energy-cost valuation. It tests whether Bitcoin’s market value relative to cumulative mining electricity cost contains information about future returns and whether this relationship changes around the China mining-ban period.

Chapter 4 develops the renewable-energy pricing method. It moves from Bitcoin evidence to the problem of valuing energy-linked claims under uncertainty.

Chapter 5 presents the constraints framework and proof-of-concept implementation. It defines the requirements for credible energy-linked digital finance and shows how parts of those requirements can be represented in software.

Chapter 6 concludes by summarising the findings, identifying limitations, and explaining what future research must test before energy-linked digital finance can move closer to deployment.

> **Key takeaway:** Credibility needs verifiable limits — not slogans. This thesis tests whether energy can supply those limits when data, issuance, pricing, settlement, and governance are designed together.

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

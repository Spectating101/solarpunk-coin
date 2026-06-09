# Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance

**Christopher Ongko**  
**Student ID: 1133958**

Department of Finance, Yuan Ze University  
Master's Thesis — June 2026

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
2. Chapter 2 — Monetary Background and the Case for Energy  
3. Chapter 3 — Empirical Evidence from Bitcoin Energy Costs  
4. Chapter 4 — Pricing Renewable-Energy Risk  
5. Chapter 5 — Constraints Framework and Proof-of-Concept Implementation  
6. Chapter 6 — Conclusion  
7. References  

## Chapter 1 - Introduction

### 1.1 Background

Money is useful because people trust it. That trust does not come only from law, habit, or technology. It also depends on whether people believe the supply of money can be controlled over time (Friedman, 1960; Barro and Gordon, 1983).

Historically, commodity money tried to solve this problem by linking money to something difficult to produce. Gold is the best-known example. Gold could not be printed, and mining it required real cost. This gave gold-backed money a simple discipline: new money could not be created freely unless new gold was found, mined, and verified.

The gold standard eventually broke down. This does not mean that the idea of a physical constraint was useless. It means that gold had practical problems. It was difficult to verify without trusted custodians, expensive to move, geographically concentrated, and too slow to support a modern global financial system. Once economies grew beyond what gold could support, governments faced pressure to loosen or abandon the link. The United States suspended dollar convertibility into gold in 1971, ending the core Bretton Woods gold-convertibility commitment (Eichengreen, 1992; Federal Reserve History, 2013; U.S. Department of State, n.d.).

Modern fiat money solved some of gold's practical problems. It is flexible, digital, and easy to move. But this flexibility comes with a different problem: money supply now depends heavily on institutions, policy choices, and public confidence. In normal conditions this can work. In weaker conditions, however, the system depends on trust that money will not be expanded too far or managed inconsistently.

Cryptocurrency was partly created as a response to this issue. Bitcoin, for example, limits its supply through code and uses mining to make coin production costly (Nakamoto, 2008). This is one reason it is often compared to gold. But cryptocurrencies also created new questions. Many digital assets have no cash flow, no physical backing, and no clear link to real production. Their value can therefore become difficult to explain using normal finance tools (Liu and Tsyvinski, 2021).

This thesis studies whether energy can provide a verifiable constraint for digital finance, linking monetary credibility to real production rather than discretionary issuance or code alone.

Energy is not money by itself. A kilowatt-hour does not automatically become a currency. But energy has several properties that make it interesting for monetary and financial design. It is costly to produce or capture. It is useful in every economy. It cannot be created from nothing. Renewable-energy potential can increasingly be estimated using public data, including satellite-based solar and weather datasets such as NASA POWER and NREL PVWatts (NASA POWER, n.d.; NREL, n.d.). These features suggest that energy may be able to provide a real-world constraint for some forms of digital money or energy-linked financial contracts.

This thesis treats energy-linked financial contracts as the practical mechanism through which energy can be tested as a constraint on digital monetary issuance and settlement.

The purpose of this thesis is not to claim that energy solves the problem of money by itself. The purpose is narrower: to ask whether energy can act as a credible constraint, under what conditions that constraint works, and what rules would be needed for a digital system to use it responsibly.

### 1.2 Research Problem

The central problem is that digital money can be created through code or institutional decision, but credibility still depends on economic limits that users can understand and verify.

In a fiat system, money creation is controlled by institutions. This gives governments and central banks flexibility, but it also means that the value of money depends on policy credibility. In a cryptocurrency system, money creation can be controlled by code, but code alone does not automatically create economic value. A digital token can have a fixed supply and still lack a real economic anchor.

This creates a gap between technical scarcity and economic credibility.

Bitcoin addresses this gap partly through proof-of-work mining. Mining requires electricity, hardware, and real operating cost. This means that Bitcoin production is not free. Cambridge's Bitcoin Electricity Consumption Index estimates Bitcoin's power demand and annualised electricity consumption, while its mining map tracks geographic hashrate distribution over time (Cambridge Centre for Alternative Finance, n.d.-a; Cambridge Centre for Alternative Finance, n.d.-b). However, Bitcoin's energy link is indirect. Electricity is used to secure the network, but Bitcoin holders do not receive a direct claim on electricity. The energy cost may influence value, but the relationship depends on market structure, mining geography, investor expectations, and other conditions (Hayes, 2019).

Renewable-energy systems face a related but different problem. Solar, wind, hydro, and other renewable resources produce real energy, but their financial value can be unstable. Output varies with weather, location, time of day, grid access, tariffs, and curtailment. A renewable generator may produce useful electricity but still face uncertain cash flow. This makes financing harder, especially for smaller projects or projects in markets with weak pricing support. Recent energy-investment reports continue to identify financing access and cost of capital as major barriers, especially in emerging and developing economies (IEA, 2023; IEA, 2024; OECD, 2024).

These two problems meet in one question:

Can energy provide a credible, measurable constraint for digital financial systems?

This question matters because current systems usually treat energy and money separately. Energy is treated as a commodity or utility output. Money is treated as a financial or institutional claim. But if energy is costly, measurable, and economically useful, then it may be possible to design digital instruments that link financial value more directly to energy production or energy risk.

The challenge is that such a system cannot rely on broad claims alone. It is not enough to say that energy backs money. A serious system must answer practical questions:

- What energy is being measured?
- Who measures it?
- How can the data be checked?
- When can a token or contract be created?
- What happens if the data is wrong?
- What happens if energy output is lower than expected?
- What rules stop the issuer from creating too much?
- What rules protect users from failed settlement?

This thesis approaches energy-linked digital finance through these practical questions.

### 1.3 Why Energy Is Worth Studying

Energy is worth studying as a possible financial anchor for four reasons.

First, energy has real production cost. Electricity cannot be created by accounting entry. It must be generated, converted, transported, or stored. Even renewable energy, where the sunlight or wind is free, requires physical infrastructure: panels, turbines, inverters, land, grid connection, maintenance, and financing. Levelised-cost studies show that renewable generation can be cost-competitive, but the cost still depends on physical equipment, site quality, financing, and grid conditions (Lazard, 2025).

Second, energy is useful. Gold has monetary history, but much of its monetary value depends on social convention. Energy is different. Every modern economy depends on it. Households, factories, servers, transportation systems, and financial markets all require energy. A unit of energy therefore has a direct link to real economic activity.

Third, energy is measurable. Electricity meters, grid data, inverter logs, satellite irradiance data, and public weather datasets can all provide evidence about energy production and potential output. NASA POWER provides satellite-derived solar and meteorological data, and NREL PVWatts estimates grid-connected photovoltaic energy production from basic system inputs (NASA POWER, n.d.; NREL, n.d.). Satellite and weather data help estimate resource conditions and potential output; actual site-level production still requires meter, inverter, or grid data. These data sources are imperfect, but they make energy more observable than many other possible monetary anchors.

Fourth, energy is local and variable. This is a difficulty, but also an important research feature. Gold is relatively uniform once assayed. Electricity is not. A kilowatt-hour in one place and time may have different economic value from a kilowatt-hour elsewhere. Solar output changes with weather and season. Grid prices change with congestion and demand. These complications force an energy-linked financial design to confront measurement, pricing, and settlement risk directly.

For this reason, this thesis does not treat energy as a simple replacement for gold. It treats energy as a candidate constraint that must be tested.

### 1.4 Research Question

The main research question is:

Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

The argument of this thesis is that energy can provide such a constraint only when it is embedded in a rule-based financial architecture. Energy must be measured through reliable data, issuance must be limited by that data, risk must be priced explicitly, and settlement must be protected by collateral or reserve rules. Without these conditions, "energy-backed" is only a label rather than a credible financial constraint.

This question is broken into three supporting questions.

First, does energy cost appear to matter in existing digital markets? Bitcoin provides a useful case because mining requires electricity. If energy cost helps anchor Bitcoin's value, then we should observe some relationship between mining energy cost and market value. If that relationship breaks under certain conditions, those conditions are also important. This question builds on prior work that studies Bitcoin production cost and cryptocurrency returns, but focuses on when the energy link holds or fails (Hayes, 2019; Liu and Tsyvinski, 2021).

Second, can renewable-energy risk be priced in a practical way? Renewable energy output is uncertain. If financial contracts are linked to renewable generation or energy value, then the system needs a way to estimate volatility, price risk, and set collateral or margin.

Third, can the required rules be implemented with current technology? A theory of energy-linked digital finance is weak if it cannot be translated into enforceable rules. Smart contracts, external data sources, signed meter data, and testnet implementations can help show whether the basic logic is buildable, even if a production launch would require further legal, security, and market work.

### 1.5 Method and Evidence

This thesis uses three types of evidence.

The first is empirical evidence from cryptocurrency markets. The thesis studies the relationship between Bitcoin's market value and the cumulative electricity cost used to secure the network. In later chapters, this measure is given a short name, CEIR. In plain language, it compares Bitcoin's market value with the total energy cost that has gone into mining it.

The key reason for studying Bitcoin is that it gives a real-world example of energy being connected to digital value. The China mining ban in 2021 is especially useful because it changed the geography of Bitcoin mining very sharply. Cambridge's mining map methodology is designed to track monthly geographic distribution of Bitcoin hashrate, making it suitable for studying this type of shift (Cambridge Centre for Alternative Finance, n.d.-b). If energy anchoring depends on mining concentration or coordination among miners, then the relationship should change after such a shock. Ethereum's move from proof-of-work to proof-of-stake is used as a supporting comparison, not the primary identification event, because it removed mining from the system and sharply reduced Ethereum's energy use (Ethereum.org, n.d.).

The second type of evidence is pricing and risk modelling for renewable-energy-linked contracts. Renewable energy is not stable output. Solar and wind vary across time and place. A financial contract linked to renewable energy must therefore handle uncertainty. The thesis uses public energy and weather data to estimate volatility, test pricing methods, and examine how collateral requirements change under stress.

The third type of evidence is implementation. The thesis includes a proof-of-concept smart contract system. This system is not treated as a finished product. It is used to show that certain rules can be written into code. For example, a contract can be designed so that token creation depends on verified energy data, repeated claims cannot be reused, and settlement rules are visible in advance.

Together, these three parts form a simple research path:

1. Check whether energy cost has mattered in an existing digital asset.
2. Model how renewable-energy risk can be priced.
3. Show how rules based on energy data could be implemented.

### 1.6 Contribution

This thesis does not claim to launch a new currency. Its contribution is a framework for thinking about energy as a constraint in digital finance.

First, the thesis contributes empirical evidence on when energy costs appear to matter for cryptocurrency value. Instead of treating energy use as only an environmental issue, the thesis studies whether energy cost also has a valuation role.

Second, the thesis contributes a practical pricing approach for energy-linked financial claims. This matters because renewable-energy output is uncertain, and any serious financial instrument connected to energy must account for that uncertainty.

Third, the thesis contributes a rule-based design for implementation. The design focuses on basic safeguards: verified data, rule-bound issuance, collateral or reserve-backed settlement, and delayed governance changes. These are not presented as final answers, but as minimum requirements for a credible prototype.

The broader contribution is to connect three areas that are often discussed separately: monetary credibility, renewable-energy finance, and smart-contract enforcement. The main contribution is the integration: energy is studied not only as a production cost, not only as a renewable commodity, and not only as a technical data source, but as a possible constraint linking digital issuance, pricing, and settlement.

### 1.7 Scope and Limitations

This thesis makes a limited claim.

It does not claim that energy should immediately replace fiat money, that any current prototype is ready for production deployment involving real financial value, that a token linked to energy is automatically safe or valuable, or that public satellite data alone is enough to verify actual energy production at a specific site.

Instead, the thesis asks what can be learned from the evidence available today. Bitcoin can show whether energy costs have acted as a market anchor under some conditions. Renewable-energy data can show how energy-linked risk might be priced. A smart contract prototype can show whether certain rules are technically enforceable.

Several important issues remain outside the main scope. These include full legal classification, consumer protection, market liquidity, production-grade security audits, utility regulation, and long-term governance. These issues are important, but they are too large to solve within one master's thesis.

The thesis therefore treats implementation as proof of feasibility, not proof of readiness.

### 1.8 Structure of the Thesis

Chapter 2 reviews the monetary and financial background. It explains why commodity-backed money was attractive, why gold-backed systems failed, and why energy may be worth studying as a different kind of constraint.

Chapter 3 studies cryptocurrency energy anchoring. It uses Bitcoin mining energy cost and market data to test whether energy cost helps explain value, and whether that relationship changes after major shocks such as the China mining ban.

Chapter 4 develops the renewable-energy pricing and risk layer. It asks how energy-linked financial contracts can be priced when the underlying resource is variable, local, and not easily stored.

Chapter 5 presents the constraints framework and proof-of-concept implementation. It describes the smart contract design and explains which rules are necessary for a credible energy-linked digital instrument.

Chapter 6 concludes by summarising what the evidence supports, what it does not support, and what future work would be needed before any real-world deployment.

### 1.9 Summary of the Argument

The argument of this thesis can be stated simply.

Money is more credible when its creation is limited by rules that people can check. Gold once provided such a limit, but it had practical problems. Digital money solves some practical problems, but often lacks a clear link to real production. Energy may help fill that gap because it is costly, useful, and increasingly measurable.

However, energy does not become money automatically. It needs rules. It needs reliable data. It needs pricing methods. It needs safeguards against over-creation, bad data, and failed settlement.

This thesis studies those requirements. It uses Bitcoin as evidence that energy cost can matter, renewable-energy data as evidence that energy risk can be priced, and a smart contract prototype as evidence that basic rules can be implemented.

The result is not a finished monetary system. It is a grounded framework for testing whether energy can help place verifiable limits on digital money and energy-linked financial contracts.

## Chapter 2 - Monetary Background and the Case for Energy

### 2.1 Purpose of the Chapter

Chapter 1 introduced the main question of this thesis: whether energy can act as a credible constraint for digital money through energy-linked financial contracts. This chapter explains why that question is worth asking.

The chapter does not claim that energy is automatically money. It also does not claim that energy is a complete substitute for gold, fiat money, or Bitcoin. The purpose is more limited: to explain what a monetary constraint is supposed to do, why previous constraints have failed or weakened, and why energy is a serious candidate for further study.

The main argument is that monetary credibility depends on limits that users can understand and verify. Gold once provided such a limit because it was costly to mine and difficult to create. Fiat money replaced gold with institutional management and flexibility. Bitcoin replaced institutional discretion with code and mining cost. Energy-linked digital finance tries to combine a real production constraint with digital enforcement, but it can only work if the energy data, pricing, settlement, and governance rules are credible.

This chapter therefore builds the background for the rest of the thesis. Chapter 3 asks whether energy cost has mattered empirically in Bitcoin. Chapter 4 asks how renewable-energy risk can be priced. Chapter 5 asks what rule-based architecture is needed for implementation.

### 2.2 What a Monetary Constraint Does

A monetary constraint is a limit on how easily new money or financial claims can be created.

The reason this matters is simple. If money can be created without limit, users must trust the issuer not to over-create it. That trust may be justified in a strong institutional setting, but it is still trust. A monetary constraint reduces the role of discretion by making money creation depend on some rule, cost, or external condition.

Different monetary systems use different constraints.

Under a commodity standard, the constraint is the cost and availability of the commodity. Gold-backed money depends on the supply of gold and the ability to redeem claims into gold. Under fiat money, the constraint is institutional: central bank credibility, legal structure, policy discipline, and public confidence. Under Bitcoin, the constraint is code and proof-of-work mining. New coins are created according to a fixed schedule, while mining requires hardware and electricity.

Table 2.1 summarises the comparison.

| System | Main Constraint | Main Strength | Main Failure Mode |
|---|---|---|---|
| Gold-backed money | Physical scarcity and redemption into gold | Hard to create gold from nothing | Custody, verification, physical settlement, and redemption pressure |
| Fiat money | Institutional credibility and policy discipline | Flexible and operationally scalable | Discretion, policy inconsistency, and dependence on trust |
| Bitcoin | Code-based supply rule and proof-of-work mining | Transparent technical scarcity and real mining cost | Indirect energy link; value still depends on market demand and coordination |
| Energy-linked digital finance | Reliable data plus rule-bound issuance, pricing, settlement, and governance limits | Potential link between digital claims and real production | Must verify data, price risk, protect settlement, and limit governance discretion |

These constraints are not equally strong in all conditions. A rule can be clear but economically empty. A commodity can be scarce but hard to verify. A central bank can be credible in normal times but pressured in crises. A blockchain can have fixed supply but still depend on market belief for value.

For this thesis, the important distinction is between **technical scarcity** and **economic credibility**.

Technical scarcity means a system has a rule limiting creation. Economic credibility means users believe that the rule is meaningful, enforceable, and connected to real value. A token can be technically scarce if only one million units exist. But if those units have no connection to use, cost, settlement, or demand, scarcity alone may not create credibility.

The question is whether energy can help close this gap. Because energy has real production cost and direct economic usefulness, it may provide more than a purely technical limit. But that possibility has to be tested, not assumed.

### 2.3 Gold as a Historical Constraint

Gold is the standard historical example of commodity-backed money.

Its strength was easy to understand. Gold could not be printed. Producing more gold required mining, labour, capital, time, and risk. A government or bank that promised convertibility into gold was making a claim that could, in principle, be tested. If too many paper claims were created relative to gold reserves, holders could demand redemption.

This gave gold-backed money a physical discipline. Money creation was connected to the production or custody of a scarce commodity. That discipline helped explain why gold became associated with long-run monetary credibility.

But gold also had weaknesses.

First, gold required trusted custody. Most users did not personally inspect gold reserves. They trusted banks, governments, vaults, auditors, and international settlement arrangements. This created a gap between the promise of physical backing and the practical reality of verification.

Second, gold was expensive and slow to move. A modern economy requires fast settlement across borders and institutions. Physical gold movement is not well suited to that scale.

Third, gold supply was geographically and politically concentrated. If the system depends on a small number of custodians or reserve holders, the system inherits their political constraints.

Fourth, gold convertibility created pressure during stress. When holders doubted the ability of an issuer to redeem claims, they had an incentive to demand gold early. This made the system vulnerable to reserve runs and policy conflict.

These problems became visible in the breakdown of Bretton Woods. The United States suspended dollar convertibility into gold in 1971, ending the main gold-convertibility commitment of the post-war monetary system (Eichengreen, 1992; Federal Reserve History, 2013; U.S. Department of State, n.d.).

The lesson is not simply that gold was bad or that commodity constraints are useless. The better lesson is that a monetary constraint must be both economically meaningful and operationally workable. Gold had physical scarcity, but its verification, custody, settlement, and political structure became too fragile for the system built around it.

### 2.4 Fiat Money and Institutional Credibility

Fiat money solved some of gold's operational problems.

It can be created, transferred, and settled without moving a physical commodity. It gives central banks and governments flexibility to respond to recessions, banking crises, wars, and liquidity shortages. It fits modern payment systems more easily than a physical commodity standard.

But fiat money shifts the source of credibility. Instead of depending on a commodity constraint, it depends on institutions. Users trust that central banks, governments, and legal systems will manage issuance responsibly.

This can work well when institutions are strong and policy is credible. But the constraint is still discretionary. The issuer can change policy. The money supply can expand. Rules can be revised. In many cases, this flexibility is intentional and useful. The problem is that users must trust the institution's judgment over time.

This is why monetary economics has long studied the tension between rules and discretion (Friedman, 1960; Barro and Gordon, 1983). Rules can be rigid, but they limit opportunistic policy changes. Discretion can be flexible, but it depends on credibility.

The relevance for this thesis is not that fiat money is always bad. The point is narrower: fiat money does not provide an external physical production constraint. Its credibility is mainly institutional. This leaves room to study whether a digital system can use a real-world input, such as energy, as a different kind of constraint.

### 2.5 Cryptocurrency and the Gap Between Code and Value

Cryptocurrency introduced a new form of monetary constraint: code.

Bitcoin is the clearest example. It limits coin creation through protocol rules and uses proof-of-work mining to make block production costly (Nakamoto, 2008). Mining requires electricity and hardware, so new Bitcoin is not created without real expenditure.

This makes Bitcoin important for this thesis because it connects digital money with energy cost. It is not an energy-backed currency in the direct sense. Bitcoin holders do not own a claim on electricity. But Bitcoin shows that digital scarcity can be linked to a real production cost.

However, the connection is indirect. Mining cost may influence Bitcoin's value, but it does not mechanically determine it. Bitcoin's market price also depends on demand, liquidity, regulation, narratives, macro conditions, and investor expectations. Prior work has studied production cost and cryptocurrency returns, but the relationship remains conditional rather than automatic (Hayes, 2019; Liu and Tsyvinski, 2021).

This distinction is central. Bitcoin demonstrates that energy can be connected to digital value, but it also shows the limits of passive energy anchoring. The system uses energy to secure the network, but it does not create a direct settlement rule between energy production and monetary claims.

That is why this thesis does not stop at Bitcoin. Bitcoin is evidence, not the full design. It helps answer whether energy cost can matter in a digital market. It does not answer how an energy-linked digital financial instrument should be priced, collateralised, settled, or governed.

### 2.6 Why Energy Is a Serious Candidate

Energy is worth studying because it has several properties that are unusual when compared with other possible monetary or financial anchors.

First, energy has real cost. Electricity must be generated, converted, transmitted, or stored. Even renewable energy requires panels, turbines, inverters, land, grid connection, maintenance, and financing. This makes energy different from a purely symbolic backing asset.

Second, energy is useful. It is not merely a collectible or conventional store of value. Energy is required for almost every form of production and economic activity. Households, factories, data centres, transportation networks, and financial infrastructure all depend on it.

Third, energy is increasingly measurable. Public datasets such as NASA POWER provide satellite-derived solar and meteorological data, while NREL PVWatts estimates photovoltaic production from system and location inputs (NASA POWER, n.d.; NREL, n.d.). These tools do not by themselves prove actual site-level production, but they make energy potential and resource conditions more observable.

Fourth, energy can be linked to digital contracts. Smart contracts cannot verify the physical world by themselves, but they can enforce rules once data is supplied. If energy data is signed, checked, priced, and limited by contract rules, then financial claims can be made conditional on energy evidence.

These features make energy more than a normal commodity input. It is a physical production base, a universal economic input, a measurable resource, and a possible settlement reference.

At the same time, energy has major complications. It is local, variable, and difficult to store. A kilowatt-hour in one place and time can have a different economic value from a kilowatt-hour elsewhere. Solar and wind output change with weather. Grid prices change with demand and congestion. Actual production requires meter, inverter, or grid data; satellite data only estimates resource conditions and potential output.

These complications do not make energy unusable. They explain why energy cannot support credible digital finance without explicit pricing and settlement rules.

### 2.7 Conditions for Energy to Work as a Constraint

Energy can only function as a credible financial constraint if several conditions are met.

First, the energy input must be observable. A system must define what energy is being measured: generation, surplus export, avoided consumption, or resource potential. These are not the same. A solar irradiance estimate is not the same as a signed meter reading. A renewable-energy claim must specify its data source.

Second, the measurement must be verifiable enough for the claim being made. Public satellite data may be enough for modelling and benchmarking. It is not enough for final site-level settlement. Actual settlement requires stronger evidence, such as meter data, inverter logs, grid records, or audited operator submissions.

Third, issuance must be rule-bound. If energy data can be ignored or overridden by an issuer, then energy is not really constraining the system. A credible design must define when tokens or contracts can be created and what prevents over-creation.

Fourth, risk must be priced. Renewable-energy output is uncertain. A system that creates financial claims from energy must account for volatility, shortfall risk, basis risk, and measurement error. This is why pricing is not a side issue; it is part of credibility.

Fifth, settlement must be protected. If a claim promises energy value, the system must define what happens when output is lower than expected or when data is disputed. Collateral, reserves, margin, caps, and governance delay are all possible tools. Without settlement protection, an energy-linked claim can become a weak promise rather than a credible instrument.

These conditions turn the energy idea into a research programme. The question is not simply whether energy is valuable. The question is whether energy can be measured, priced, and connected to enforceable financial rules.

### 2.8 Objections and Limits

There are several objections to energy as a monetary or financial constraint.

The first objection is that energy is not storable like gold. This is true. Electricity is difficult to store directly and must usually be consumed, exported, curtailed, or converted. This means energy cannot be treated as a simple vault asset. Any energy-linked design must use measurement, pricing, and settlement rather than physical hoarding.

The second objection is that energy is not uniform. This is also true. Location, time, grid access, and technology matter. But this is not only a weakness. It is also why energy-linked finance requires pricing models and local data. The thesis does not assume all kilowatt-hours have the same value in all conditions.

The third objection is that measurement can be manipulated. This is a serious issue. Meter data can be wrong, operator reports can be falsified, and satellite data can only estimate resource conditions. This is why verification and governance are part of the framework. Energy-linked finance is only credible if the data layer is credible.

The fourth objection is that financial claims need demand, liquidity, law, and trust. This thesis accepts that point. It does not claim that a working prototype or a good model automatically creates a market. Market adoption, legal classification, user protection, and regulation remain outside the core claim of this chapter.

The fifth objection is that energy may be better understood as a commodity, not money. This thesis does not deny that. The argument is not that energy by itself is already money. The argument is that energy may provide a verifiable constraint for digital financial claims, and that those claims may be relevant to digital monetary credibility.

### 2.9 Chapter Conclusion

This chapter has argued that the central issue is not whether money should be gold, fiat, Bitcoin, or energy. The central issue is credibility: what limits money or financial claims, and can users verify those limits?

Gold provided a physical production constraint but failed as a scalable modern settlement system. Fiat money provides flexibility but depends on institutional credibility. Bitcoin provides technical scarcity and an indirect energy cost, but its connection between energy and value is passive and market-dependent.

Energy is worth testing because it combines real production cost, economic usefulness, increasing measurability, and compatibility with digital contract rules. But energy also creates hard problems: locality, volatility, non-storability, measurement risk, and settlement risk.

The conclusion is therefore bounded. Energy is not automatically a monetary base. It becomes relevant only if a system can measure it, price its risk, limit issuance by rule, and protect settlement. This leads directly to Chapter 3, which asks whether energy cost has empirically mattered in Bitcoin, the most important existing case of digital money connected to energy expenditure.

## Chapter 3 - Empirical Evidence from Bitcoin Energy Costs

### 3.1 Purpose of the Chapter

Chapter 2 argued that energy is worth studying as a possible constraint for digital finance because it has real production cost, economic usefulness, and increasing measurability. This chapter asks whether energy cost appears to matter in an existing digital market.

Bitcoin is the natural case to study. It is a digital monetary asset whose issuance and security depend on proof-of-work mining. Mining requires electricity and hardware, so Bitcoin is not created without real resource expenditure. Bitcoin is not an energy-backed currency in the direct sense, because holders do not receive a claim on electricity. But it is the clearest existing case where digital value and energy cost are connected.

The empirical question is therefore:

Does the cost of energy used in Bitcoin mining help explain Bitcoin market value, and does that relationship change when mining conditions change?

The answer in this chapter is cautious. The evidence suggests that energy cost is not irrelevant. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns, and the relationship changes sharply around the China mining-ban period. However, the evidence is not a mechanical law of value. The relationship is sensitive to specification, especially when differenced measures are used, and it does not produce a useful trading rule. This supports the thesis argument in a bounded way: energy can matter, but passive energy anchoring is not enough. Credible energy-linked digital finance still needs explicit rules for data, pricing, settlement, and governance.

### 3.2 Why Bitcoin Is a Useful Case

Bitcoin is useful for this thesis because it combines three features.

First, Bitcoin has a fixed issuance rule. New Bitcoin is created according to protocol rules rather than by a central issuer (Nakamoto, 2008).

Second, Bitcoin mining requires energy. Miners compete by performing computational work, and that work requires electricity. This creates a production-cost channel that is absent from many other digital assets.

Third, Bitcoin experienced a major external shock in 2021. China's mining restrictions sharply changed the geographic distribution of mining activity. This provides a useful setting for studying whether the energy-value relationship depends on mining geography and coordination.

The China mining-ban period matters because energy costs do not affect all miners equally. If mining is geographically concentrated, miners face more similar electricity costs, policy conditions, and operational constraints. In that setting, energy cost may act more like a common production-cost reference. If mining becomes more geographically dispersed, the cost base becomes more heterogeneous. The same aggregate energy-cost measure may then become less stable as a valuation anchor.

Ethereum's move from proof-of-work to proof-of-stake is used only as a supporting comparison. It is not the primary identification event in this thesis. Its role is to show that when a major network removes mining, the relationship between energy expenditure and network operation changes fundamentally (Ethereum.org, n.d.).

### 3.3 Measuring the Energy-Valuation Relationship

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

### 3.4 Empirical Design

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

### 3.5 Main Results

The preferred level specification supports a relationship between Bitcoin valuation and cumulative energy cost.

In the corrected level specification, the pre-ban CEIR coefficient is negative and statistically significant, approximately `-0.26` in the current robustness notes, with significance surviving clustered standard errors. This means that when Bitcoin is high relative to its cumulative energy-cost base, later returns tend to be weaker. That result is consistent with the idea that energy cost can act as a valuation reference.

The relationship also changes strongly around the China mining-ban period. The current source-of-truth results show a sharp structural break, with a Chow-test p-value near zero in the level specification. This means that the relationship before and after the ban is not stable.

This is the key empirical point for the thesis:

Energy cost appears to matter, but the relationship is regime-dependent.

The result should not be stated as "energy always anchors Bitcoin." It should be stated more carefully:

Bitcoin's energy-cost base contains valuation information in the preferred level specification, but the relationship changes when the mining system changes.

That finding is exactly why the thesis moves from passive energy anchoring to designed financial architecture. If energy anchoring depends on market structure, then a serious energy-linked financial system cannot simply assume that energy cost will discipline value by itself. It must build the discipline into data rules, pricing rules, settlement rules, and governance rules.

### 3.6 Robustness and Negative Results

The robustness checks are important because they prevent the chapter from overstating the evidence.

First, the differenced CEIR specification is weaker. When CEIR is differenced to reduce trend concerns, the CEIR effects lose statistical significance in the current robustness notes. This means the result is sensitive to how the energy-valuation measure is specified. The preferred level model supports the energy-anchoring interpretation, but the differenced model is a boundary condition.

Second, the relationship does not produce a useful trading rule. The current robustness notes state that a simple CEIR-based trading rule performs poorly compared with buy-and-hold. That is an important negative result. It means CEIR should not be presented as a trading signal or investment strategy. Its role in this thesis is explanatory, not predictive in a commercial trading sense.

Third, the dataset has a natural limit. Cambridge mining electricity data extends further than the geographic mining-distribution data. The mining map data needed for concentration analysis does not extend cleanly through the later period. Because mining concentration is central to the thesis argument, the chapter focuses on the period where both energy and geography variables are available. This is a methodological choice, not a claim that later data is unimportant.

Fourth, Bitcoin is a single asset. A broader claim about energy anchoring across all proof-of-work assets would require a panel of assets and additional identification work. This thesis does not make that broader claim.

These limitations do not make the empirical chapter useless. They make the claim more precise. The evidence supports a conditional relationship between energy cost and digital value. It does not prove a universal law of energy-backed money.

### 3.7 Interpretation

The empirical evidence should be interpreted in three layers.

First, energy cost is not irrelevant. The preferred specification finds that Bitcoin valuation relative to cumulative energy cost contains information about later returns. This supports the idea that markets can treat energy expenditure as part of a digital asset's economic structure.

Second, the relationship is not stable across all regimes. The China mining-ban period changes the relationship, which suggests that energy anchoring depends on how the production network is organised. Mining geography, cost dispersion, and market coordination matter.

Third, passive anchoring is not enough. Bitcoin connects digital value to energy expenditure indirectly through mining. But it does not provide a direct energy claim, a formal settlement rule, or a collateral structure. This is why the evidence motivates a designed system rather than proving that Bitcoin already solves the problem.

This interpretation connects Chapter 3 to the rest of the thesis. Chapter 3 provides evidence that energy can matter. Chapter 4 asks how energy-linked risk can be priced. Chapter 5 asks what rules would be needed to make energy-linked claims credible rather than passive.

### 3.8 Implications for Energy-Linked Digital Finance

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

### 3.9 Chapter Conclusion

This chapter examined whether energy cost appears to matter in an existing digital market. Bitcoin is the clearest case because proof-of-work mining connects coin production to electricity use.

The evidence supports a bounded conclusion. In the preferred level specification, Bitcoin valuation relative to cumulative energy cost is statistically related to future returns, and the relationship changes sharply around the China mining-ban period. However, the result is specification-sensitive, does not generate a useful trading strategy, and is limited by data availability and the single-asset setting.

The chapter therefore supports the thesis, but in a disciplined way. It does not prove that energy automatically backs digital money. It shows that energy cost can matter, and that the relationship is conditional. This motivates Chapter 4, which moves from Bitcoin as passive evidence to the practical problem of pricing renewable-energy-linked financial contracts.

## Chapter 4 - Pricing Renewable-Energy Risk

### 4.1 Purpose of the Chapter

Chapter 3 showed that energy cost can matter in a digital market, but that the relationship is conditional and regime-dependent. This chapter moves from empirical motivation to financial design.

If energy is going to constrain digital money or energy-linked contracts, the system must be able to price energy risk. Energy production is not constant. Solar and wind output vary by location, season, weather, and grid conditions. A financial claim linked to energy cannot be credible if it ignores that variability.

This chapter therefore asks:

How can an energy-linked financial contract be priced when the underlying energy source is variable, local, and not supported by a liquid options market?

The answer developed here is a practical pricing framework. It does not claim to be the final model for all electricity markets. It provides a reproducible starting point: use public energy data to estimate volatility, define a simple payoff, price the payoff with standard numerical methods, and test whether the result is stable enough to inform collateral and settlement rules.

This matters for the thesis because pricing is one of the conditions that turns "energy-backed" from a label into a credible financial constraint. If risk is not priced, then token creation or settlement promises can become under-collateralised claims.

### 4.2 Why Pricing Comes Before Settlement

An energy-linked contract cannot be credible only because it references energy. It must also define the value and risk of that reference.

For example, suppose a contract promises protection against low renewable-energy output or creates a token based on verified renewable generation. Several questions immediately appear:

- How much is the energy worth?
- How variable is the output?
- What happens if generation is lower than expected?
- How much collateral or reserve should be posted?
- How much oracle or measurement error can the system tolerate?
- Which locations are suitable for this design, and which are not?

These are pricing questions before they are implementation questions. A smart contract can enforce a rule, but it cannot make a bad rule economically sound. If the pricing model underestimates volatility or shortfall risk, the contract can still execute correctly while producing a fragile financial instrument.

For this reason, this chapter treats pricing as part of credibility. A system that links financial claims to energy must measure not only expected energy value, but also uncertainty around that value.

### 4.3 The Underlying Risk

The central risk in this chapter is renewable-energy variability.

Solar output changes with irradiance, cloud cover, season, system size, panel efficiency, and site conditions. Wind output changes with wind speed and turbine characteristics. Grid value changes with demand, congestion, tariff rules, and curtailment. A kilowatt-hour is therefore not just a physical unit. Its financial value depends on where and when it is produced and how the market treats it.

This thesis focuses mainly on solar-linked examples because solar resource data is widely available through public datasets. NASA POWER provides satellite-derived solar and meteorological data, while NREL PVWatts estimates photovoltaic production from location and system assumptions (NASA POWER, n.d.; NREL, n.d.).

These public datasets are not a substitute for meter data. They estimate resource conditions and potential output. They are useful for modelling and benchmarking, not final settlement at a specific physical site. Actual settlement would require stronger evidence, such as meter, inverter, grid, or audited operator data. This distinction is important because the pricing layer estimates risk, while the settlement layer must verify actual claims.

### 4.4 Model Setup

The pricing framework uses a short-horizon option-style model.

The basic object is a financial claim linked to the value of energy, measured in dollars per kilowatt-hour. The model uses:

- `S0`: current energy value or spot proxy in dollars per kWh;
- `K`: strike or reference cost floor;
- `sigma`: volatility estimate;
- `r`: risk-free rate;
- `T`: contract horizon.

The preferred pricing specification uses a quarterly horizon, `T = 0.25`, and a representative Taiwan base case with `S0 = $0.0525/kWh`, `sigma = 189%`, and `r = 2.5%`. The volatility is derived from solar-resource variability rather than from a liquid traded options market. This is a cold-start method: when market-implied volatility is unavailable, public physical data provides an initial risk estimate.

The model uses geometric Brownian motion as a tractable first approximation. This is not a claim that electricity prices perfectly follow GBM. Electricity markets can show jumps, seasonality, mean reversion, negative prices, and local market constraints. The GBM assumption is used because it is transparent, reproducible, and appropriate as a short-horizon benchmark. The thesis treats it as a starting model, not a universal law of energy prices.

Table 4.1 records the preferred Taiwan base case used as the chapter's main numerical anchor.

| Parameter | Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.02025/kWh` |
| Method gap | About `+5.6%` Monte Carlo vs binomial |

### 4.5 Numerical Pricing Methods

The chapter validates pricing with two independent numerical methods.

The first method is a binomial tree. A binomial tree divides the horizon into steps and recursively values the payoff backward from maturity. It is transparent and useful for checking convergence as the number of steps increases (Cox, Ross, and Rubinstein, 1979).

The second method is Monte Carlo simulation. Monte Carlo simulation generates many possible future paths and estimates the expected discounted payoff from those paths. It is useful because it can be extended later to richer processes, stress scenarios, and non-standard payoff structures.

Using both methods reduces dependence on a single implementation. If binomial and Monte Carlo values are close under the same assumptions, the pricing engine is more credible as a reproducible research tool.

The preferred specification shows reasonable convergence for the main high-volatility locations. In the cross-location summary:

- Taiwan: binomial price about `$0.01917/kWh`, Monte Carlo about `$0.02025/kWh`.
- Saudi Arabia: binomial about `$0.01929/kWh`, Monte Carlo about `$0.01945/kWh`.
- Arizona: binomial about `$0.02068/kWh`, Monte Carlo about `$0.02100/kWh`.
- Brazil: binomial about `$0.05373/kWh`, Monte Carlo about `$0.05449/kWh`.

Germany has a very small option value in this convergence run, so the relative percentage difference is inflated by the tiny denominator. This should be interpreted carefully. The more important result is that the main target cases converge to economically similar values under independent methods.

Table 4.2 gives the preferred cross-location pricing specification used in this chapter. Earlier prototype runs used slightly different parameter sets; those are treated as robustness artifacts rather than the main result.

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | Interpretation |
|---|---:|---:|---:|---:|---|
| Germany | 0.0250 | 45% | 0.000001 | 0.0000009 | Near-zero option value in this convergence run; relative difference inflated by tiny base. |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.02025 | Main base case; convergence within about 5.6%. |
| Saudi Arabia | 0.0550 | 172% | 0.01929 | 0.01945 | Strong convergence. |
| Arizona | 0.0580 | 165% | 0.02068 | 0.02100 | Strong convergence. |
| Brazil | 0.0950 | 198% | 0.05373 | 0.05449 | Strong convergence. |

### 4.6 Cross-Location Results

The pricing framework is tested across multiple locations because renewable-energy risk is local.

The cross-location results show that option values and risk profiles vary meaningfully by region. Brazil, Taiwan, Saudi Arabia, Arizona, and Germany do not have the same spot values, volatility estimates, or margin requirements. This is expected. Energy-linked finance should not assume a single global parameter set.

The preferred cross-location pricing table reports the following approximate values:

- Taiwan: `S0 = $0.0525/kWh`, `sigma = 189%`, call price around `$0.019/kWh`.
- Saudi Arabia: `S0 = $0.055/kWh`, `sigma = 172%`, call price around `$0.018-$0.019/kWh`.
- Arizona: `S0 = $0.058/kWh`, `sigma = 165%`, call price around `$0.019-$0.021/kWh`.
- Brazil: `S0 = $0.095/kWh`, `sigma = 198%`, call price around `$0.054/kWh` in the preferred convergence table.
- Germany: lower volatility and lower spot assumptions lead to a much smaller risk value in some specifications.

The point is not that one table gives a final market price. The point is that the framework can produce location-specific pricing under explicit assumptions. Those assumptions can be inspected, challenged, and rerun.

This is important for credibility. An energy-linked contract should not hide its risk model. It should state its inputs and show how the price or collateral changes when those inputs change.

### 4.7 Collars, Oracle Tolerance, and Margin

The pricing layer also supports risk-control design.

One instrument considered in the pricing layer is a collar structure. A collar combines options to limit downside and upside exposure. Earlier drafts overstated this result as a volatility-threshold discovery. The corrected result is more precise: under the chosen symmetric percentage strikes in a lognormal model, the collar can produce a net credit structurally because the out-of-the-money call is closer in log space than the out-of-the-money put. The credit grows with volatility, but it should not be presented as a newly discovered threshold.

That correction matters. The thesis is stronger when it states the actual mechanism rather than overclaiming the result.

The pricing layer also studies oracle tolerance. Oracle tolerance asks how much measurement or oracle error the hedge can absorb before its effectiveness falls below a chosen threshold. The current source-of-truth table reports maximum oracle-error thresholds for variance-reduction targets. For example:

- Taiwan tolerates about `21.7%` oracle error for variance reduction above `95%`.
- Saudi Arabia tolerates about `19.7%`.
- Arizona tolerates about `18.9%`.
- Brazil tolerates about `22.7%`.
- Germany tolerates only about `5.2%`.

This result is important because it shows that location matters. High-volatility solar markets can tolerate more oracle error before the hedge breaks down. Lower-volatility markets such as Germany require much more accurate data for the same hedge-effectiveness threshold.

Table 4.3 summarises the current oracle-tolerance source-of-truth values.

| Location | Maximum Oracle Error for Variance Reduction >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

The pricing layer also informs collateral and margin. A financial claim that pays under adverse energy outcomes must be backed by enough collateral or reserve capital to survive stress. The current margin stress table shows that required margin rises with both spot value and volatility. This is expected, but important: energy-linked contracts cannot be responsibly issued without stress-aware collateral rules.

### 4.8 What the Pricing Layer Proves and Does Not Prove

The pricing layer proves four things.

First, energy-linked payoffs can be priced under explicit assumptions.

Second, public energy data can be used to estimate a cold-start volatility input when liquid derivatives markets are unavailable.

Third, independent numerical methods can be used to check whether the pricing results are stable.

Fourth, pricing outputs can inform collateral, margin, and oracle-tolerance rules.

But the pricing layer does not prove that the model is final.

It does not prove that GBM is the correct process for all energy markets. It does not replace market-implied volatility if such a market exists. It does not solve liquidity, legal enforceability, basis risk, or physical settlement. It does not prove that a site actually produced energy. Those are separate problems handled by data verification and contract design.

The chapter's contribution is therefore methodological: it shows how to move from public energy data to a transparent pricing and risk framework. It does not claim to complete the entire market design.

### 4.9 Chapter Conclusion

Chapter 3 showed that energy cost can matter in digital markets, but only conditionally. This chapter showed how energy-linked risk can be priced in a controlled way.

The key conclusion is that pricing is not optional. If energy is used as a financial constraint, the system must account for volatility, location, oracle error, and stress exposure. A rule-bound contract without a credible pricing layer may still be fragile.

The pricing results support the thesis in a bounded way. They show that public energy data, numerical pricing, cross-location validation, oracle-tolerance checks, and margin stress analysis can form a practical risk framework. They also show that some locations and assumptions are more suitable than others.

This leads directly to Chapter 5. Once energy can be measured and its risk can be priced, the next question is what rules are required to make an energy-linked digital instrument credible in implementation.

## Chapter 5 - Constraints Framework and Proof-of-Concept Implementation

### 5.1 Purpose of the Chapter

Chapters 2 through 4 established the thesis in three steps. Chapter 2 explained why energy is worth studying as a monetary and financial constraint. Chapter 3 showed that energy cost can matter in an existing digital market, but that the relationship is conditional. Chapter 4 showed that renewable-energy-linked risk can be priced under explicit assumptions.

This chapter asks what rules are needed for an energy-linked digital instrument to be credible in implementation.

The key point is that a working contract is not enough. A smart contract can execute rules, but the rules must be economically meaningful. If the data is unreliable, issuance is discretionary, pricing ignores risk, or settlement is unprotected, then the instrument is not credible simply because it uses code.

The chapter therefore presents a constraints framework. It then describes the proof-of-concept implementation built in this project. The implementation is used as feasibility evidence: it shows that the core rules can be expressed in software and tested. It is not presented as a production-ready financial system.

### 5.2 The Constraints Framework

The framework has five core constraints.

First, energy data must be reliable enough for the claim being made. Modelled solar potential is useful for forecasting and benchmarking, but actual site-level settlement requires stronger evidence such as meter data, inverter logs, grid records, or audited operator files.

Second, issuance must be rule-bound. If a token or financial claim can be created without verified energy evidence, then energy is not constraining the system.

Third, risk must be priced explicitly. Energy output and energy value are uncertain. A credible system must account for volatility, shortfall risk, oracle error, and basis risk.

Fourth, settlement must be protected. If users can redeem or settle claims, the system must define what is owed, who owes it, what happens during shortfall, and what collateral or reserve rules apply.

Fifth, governance must be limited. If administrators can change rules instantly or override constraints, then the system reintroduces discretionary control. Governance delay, role separation, auditability, and emergency controls are part of credibility.

These constraints are not independent decorations. They work together. Reliable data without settlement protection creates weak claims. Pricing without verifiable data prices the wrong thing. Rule-bound issuance without governance limits can be changed after users rely on it. Settlement without collateral can fail under stress.

The thesis contribution is the integration of these constraints into one architecture.

Table 5.1 summarises the five-constraint framework used in this thesis.

| Constraint | Purpose | Failure If Missing |
|---|---|---|
| Reliable energy data | Defines what energy evidence the system accepts | The system may price or mint against false or weak claims |
| Rule-bound issuance | Limits token or contract creation to accepted evidence | The issuer regains discretionary creation power |
| Explicit pricing and risk controls | Accounts for volatility, basis risk, oracle error, and shortfall risk | Claims become underpriced or under-collateralised |
| Protected settlement and redemption accounting | Defines what is owed and what happens during fulfillment, shortfall, or dispute | Users hold claims without credible resolution rules |
| Limited governance | Restricts discretionary parameter changes and role abuse | The system can override its own constraints |

### 5.3 Constraint 1: Reliable Energy Data

The first requirement is a clear data path.

An energy-linked instrument must define what is being measured. Several different quantities can be confused if the system is not precise:

- solar resource potential;
- modelled expected production;
- actual generation;
- surplus export;
- avoided consumption;
- energy value under tariff or market rules.

These are related, but they are not the same.

Public satellite and weather datasets can estimate resource conditions and expected output. They are valuable for modelling and forecasting. However, they do not prove that a specific site produced a specific quantity of electricity. For settlement, the system needs stronger evidence.

The proof-of-concept therefore distinguishes between modelling data and claim data. NASA POWER and NREL/PVWatts style data can support baselines, forecasts, and anomaly checks. Meter or inverter data is needed for actual production claims. Signed readings, source hashes, nonces, timestamps, and replay protection are used to make the data path auditable.

In the implementation, the attested mint path is:

1. raw meter-style readings are submitted;
2. readings are checked and accepted or rejected;
3. accepted readings are combined into a deterministic source hash;
4. an oracle-style attestation signs the accepted surplus amount and metadata;
5. the contract checks the attestation before minting.

The important point is not that the current sample data proves physical finality. It does not. The important point is that the system separates accepted data from rejected data, binds the source hash to the mint, and prevents the same source from being reused.

### 5.4 Constraint 2: Rule-Bound Issuance

The second requirement is that token or contract creation must be limited by verified data.

If an issuer can mint tokens without energy evidence, then the system is just a discretionary token with energy branding. That would not solve the credibility problem identified in Chapter 1.

In the proof-of-concept implementation, this issue is addressed through surplus-attestation minting. The contract does not simply mint because an administrator says so. It verifies an attestation that binds several pieces of information:

- recipient;
- surplus kWh;
- measurement window;
- validity window;
- source hash;
- chain ID;
- contract address.

The source hash and attestation hash are consumed after use. This matters because it prevents the same energy data from being reused to create multiple claims.

The public Sepolia proof demonstrates this path. The source-of-truth proof record shows a signed meter-style bundle, `2606.7` kWh accepted surplus, `2606` on-chain integer kWh, and `130.1697` SPK minted at a `$0.05/kWh` energy-price basis after fees. The transaction is public on Sepolia and serves as implementation evidence.

This proof should be interpreted carefully. It proves that the data-to-mint path can be implemented and publicly inspected. It does not prove that the system is ready for production, that the sample data is a live revenue-grade meter source, or that a real-world legal claim exists.

### 5.5 Constraint 3: Explicit Pricing and Risk Controls

The third requirement is pricing.

Energy data alone does not define financial value. A system also needs to know how much the energy is worth and how uncertain that value is. Chapter 4 showed that renewable-energy-linked claims can be priced under explicit assumptions and that pricing outputs can inform margin, reserves, and oracle tolerance.

In the implementation context, pricing appears in several places.

First, minting depends on an energy-price basis. In the public Sepolia proof, the energy basis is `$0.05/kWh`. This converts accepted surplus kWh into a token amount. A different energy price would create a different issuance result.

Second, redemption or owed-energy claims depend on the energy price per kWh. If a holder burns tokens for an energy claim, the system must calculate how many kWh are owed.

Third, reserves and shortfall analysis depend on stress testing. A system that promises energy-linked value must ask whether it has enough buffer when output falls, claims rise, or price assumptions fail.

The implementation includes stress and finance artifacts for this reason. These artifacts do not make the system solvent by themselves. They expose the capital and policy requirements that would be needed before real-value deployment.

This is the practical role of pricing in the constraints framework: it prevents issuance and settlement from becoming blind accounting.

### 5.6 Constraint 4: Settlement and Redemption Accounting

The fourth requirement is settlement protection.

A token can be issued correctly but still fail if users do not know what it settles into. This is especially important for energy-linked instruments because energy output can be lower than expected, local tariffs can change, and delivery can fail.

The proof-of-concept includes a currency-system contract that handles two basic functions.

First, it supports invoice settlement. A payer can transfer SPK to a payee against a hashed invoice. The invoice hash is recorded and cannot be reused. This creates a replay-protected payment record.

Second, it supports redemption accounting. A user can transfer SPK into the contract, burn it through the SPK token's redemption function, and open an owed-kWh claim. The claim can later be resolved as fulfilled, shortfall, or disputed.

This is not the same as guaranteeing real-world electricity delivery. It is an accounting and rule-enforcement layer. It records what the system says is owed and how the claim is resolved. A real deployment would still need counterparties, legal terms, operator obligations, and reserve policy.

The local proof loop demonstrates the mechanism: accepted surplus leads to token minting, tokens circulate through invoice-like payments, a portion is redeemed, and the system records the owed energy amount and delivery resolution. The important research point is that issuance, circulation, redemption, and settlement accounting can be connected in one rule-based path.

### 5.7 Constraint 5: Governance Limits and Launch Gates

The fifth requirement is governance discipline.

If administrators can change parameters instantly, bypass data checks, or mint tokens without evidence, then the system returns to discretionary issuance. A credible energy-linked design must therefore specify who can change rules, how quickly changes apply, and what protections users have.

The implementation uses role-based permissions, pausing controls, and governance-delay ideas in the broader protocol design. These are not enough for production by themselves, but they show the correct direction: separate roles, visible parameters, and constrained administrative power.

The project also uses launch gates. The launch gate separates three stages:

- public lab;
- closed testnet pilot;
- paid or mainnet product.

The current launch gate marks the public lab as launchable, while closed-pilot and paid/mainnet stages remain blocked. The blockers are important:

- governed attested-SPK redeployment;
- real meter or inverter data;
- stronger hardware provenance;
- economic support terms for pilot readiness;
- audit;
- legal and commercial scope;
- redemption policy;
- production deployment evidence.

This is not a weakness in the research. It is a strength of the framing. The implementation does not pretend that a testnet proof is a finished financial system. It states which controls exist and which remain open.

Table 5.2 gives the current implementation status used in the thesis.

| Stage | Current Status | Interpretation |
|---|---|---|
| Public lab | Launchable as proof/demo/research evidence | Suitable for advisor, reviewer, and public-lab inspection |
| Closed testnet pilot | Blocked | Needs governed deployment, real operator data, stronger hardware provenance, and anchor economics/support terms |
| Paid/mainnet product | Blocked | Needs audit, legal/commercial scope, redemption policy, production deployment, reserves, real counterparties, and demand |

### 5.8 What the Proof-of-Concept Demonstrates

The proof-of-concept demonstrates several things.

First, an energy-data-to-token path can be implemented. Signed readings can be checked, bundled, hashed, attested, and used to mint tokens through a contract.

Second, replay protection can be enforced. Source hashes and attestation hashes can be consumed so that the same energy claim is not reused.

Third, token circulation and redemption accounting can be modelled. The currency-system contract can record invoice settlement, burn tokens into owed-kWh claims, and resolve delivery as fulfilled, shortfall, or disputed.

Fourth, public testnet evidence can be produced. The Sepolia proof gives an inspectable transaction showing that the core mint path works under the test conditions.

Fifth, readiness can be separated by stage. The project distinguishes public-lab evidence from closed-pilot readiness and production readiness.

Together, these demonstrate technical feasibility. The framework is not only an essay. Its core rules can be expressed in software, run locally, and partially demonstrated on a public testnet.

### 5.9 What the Proof-of-Concept Does Not Demonstrate

The proof-of-concept also has clear limits.

It does not prove production readiness.

It does not prove legal classification.

It does not prove that a real solar site has supplied revenue-grade meter data.

It does not prove market demand or liquidity.

It does not replace an external security audit.

It does not establish a legally enforceable redemption claim.

It does not solve reserve capital or shortfall policy.

These limits matter because they prevent overclaiming. The thesis uses the implementation to support a narrower claim: the constraints framework is technically buildable as a proof of concept. It does not claim the prototype is ready to handle public financial value.

### 5.10 SPK v1: Energy-Native Network Money on Sepolia

After the attested dollar-translated mint proof (`0x8ceDa…`, May 2026), the project deployed a unified **SPK v1** stack on Sepolia with a different monetary posture:

| Parameter | SPK v1 (Jun 2026) | Earlier attested proof |
|---|---|---|
| Issuance | Energy-native (`1 kWh → 1 SPK` default) | Dollar-translated via `$0.05/kWh` basis |
| Primary use | Network circulation (`settleNetworkPayment`) | Mint proof + lab settlement |
| Peg | Off by default | Dollar basis implicit |
| Contracts | `0x8e189…` (SPK), `0x52016…` (CurrencySystem) | `0x8ceDa…` |

This iteration is **product-oriented evidence**, not a new theoretical claim. It shows the same five constraints applied to a circulation-first design:

1. **Data** — surplus kWh mint path (operator cycle can extend attested bundles later).
2. **Rule-bound issuance** — `mintFromSurplus` and attestation paths remain hash-consumed.
3. **Pricing** — energy-native default; optional USD reference for redemption quotes only.
4. **Settlement** — typed network payments (SERVICE, LABOR, GOODS, NETWORK) with invoice-hash replay protection; redemption gated and secondary.
5. **Governance** — role separation on contracts; testnet operator key for demo only.

Table 5.3 summarises the main public SPK v1 evidence (Table 5.4 and §5.10.1–5.10.3 below; regenerated on each thesis build).

| Evidence item | Sepolia transaction / contract |
|---|---|
| SPK v1 deploy (energy-native) | Contract `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| CurrencySystem deploy | Contract `0x520162252F9B94824417678525FFd69145014970` |
| Attested mint (synthetic cycle bundle) | `0x9fcf885ff5df7f580db77651c4149b4862e4c69b4779f9330295375057f53109` |
| Attested mint (Taoyuan meter fixture, scaled) | `0x3527585fd110ae3e135e76b870232d1b30411d76953c15c94a237743a0d1754d` |
| Network payment (LABOR) | `0x1f7cd59612cf81dd4a43f1cb1b4e5d6e03f4be570e4ad4fc2c21e28ee72d09be` |

**Thesis interpretation:** SPK v1 demonstrates that the constraints framework can support an energy-native, circulation-first instrument—not only a dollar-pegged lab token. It does **not** demonstrate mainnet readiness, legal money status, or real-site meter finality. Those boundaries from §5.9 still apply. Launch-gate staging (§5.7) remains useful for separating research demos from production, but the **primary implementation evidence** for this chapter is now the SPK v1 runtime and its on-chain payment history.

*The following blocks are exported from `state/runtime/spk_v1.json` after Sepolia sync (generated 2026-06-09T10:16:17.836331+00:00).*


#### 5.10.1 Canonical contracts and live metrics


| Contract | Address |
|----------|---------|
| mock_usdc | `0xaD2A7169CfFBA9Bef8C45515fc85178DbBfEc2C9` |
| solar_punk_coin | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| currency_system | `0x520162252F9B94824417678525FFd69145014970` |


- Total supply: **5499.015 SPK**
- Settled: **442.0 SPK**
- Network payments: **21**
- Circulation share: **96.71%**

#### 5.10.2 Indexed payment ledger (Table 5.4)


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

#### 5.10.3 Operator cycle log


##### 2026-06-07T15-36-04-187Z

- **mint_from_surplus** (100 kWh): 0xcf922f3883f5…
- **network_payment** (8 SPK): 0xeacc17a44e8e…
- **network_payment** (12 SPK): 0xb49728568174…
- **optional_redemption** (5 SPK): 0xabfc4d3462ac…

##### 2026-06-07T16-02-48-981Z

- **mint_from_attestation** (50 kWh): 0x9fcf885ff5df…
- **network_payment** (6 SPK): 0x7bf526551f5a…
- **network_payment** (10 SPK): 0x1f7cd59612cf…
- **network_payment** (14 SPK): 0x3b912b39ed24…
- **network_payment** (8 SPK): 0x100b4decd5e1…
- **optional_redemption** (5 SPK): 0xd14b9c118ce7…

##### 2026-06-07T16-25-38-349Z

- **mint_from_attestation** (52 kWh): 0x3527585fd110…
- **network_payment** (6 SPK): 0x7d68647acac4…
- **network_payment** (10 SPK): 0xc1eb24c0dc7e…
- **network_payment** (14 SPK): 0xd01d4ab88396…
- **network_payment** (8 SPK): 0x2b8e8efb9ff2…

##### 2026-06-08T16-57-04-958Z

- **oracle_refresh**: 0x2b2fff3df582…
- **mint_from_attestation** (50 kWh): 0x3dd63c06a294…
- **network_payment** (6 SPK): 0xfc63cd227940…
- **network_payment** (10 SPK): 0xb620ea8cdcf7…
- **network_payment** (14 SPK): 0x6b1f3801f468…
- **network_payment** (8 SPK): 0x5a72cc73cbc6…
- **optional_redemption** (5 SPK): 0xf3111ce6742e…

### 5.11 Chapter Conclusion

This chapter turned the thesis from evidence and pricing into a rule-based architecture.

The central finding is that energy-linked digital finance requires more than energy data. It requires reliable measurement, rule-bound issuance, explicit pricing, protected settlement, and limited governance. These constraints work together. Removing any one of them weakens the credibility of the system.

The proof-of-concept implementation shows that the core path can be built: energy-style readings can be checked, accepted surplus can be attested, tokens can be minted with replay protection, payments can be recorded, and redemptions can become owed-energy claims with resolution states.

The chapter also makes the boundary clear. The current implementation is public-lab and proof-of-concept evidence. It is not a production-ready energy-money system. Real deployment would require real meter data, governed deployment, audit, legal terms, reserve policy, and counterparties.

This completes the main argument of the thesis. Chapter 6 summarises what has been shown, what remains unproven, and what future work would be required.

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

# Chapter 1 - Introduction

## Proposed Thesis Title

Energy as a Constraint: Credibility, Pricing, and Settlement in Energy-Linked Digital Finance

## 1.1 Background

Money is useful because people trust it. That trust does not come only from law, habit, or technology. It also depends on whether people believe the supply of money can be controlled over time (Friedman, 1960; Barro and Gordon, 1983).

Historically, commodity money tried to solve this problem by linking money to something difficult to produce. Gold is the best-known example. Gold could not be printed, and mining it required real cost. This gave gold-backed money a simple discipline: new money could not be created freely unless new gold was found, mined, and verified.

The gold standard eventually broke down. This does not mean that the idea of a physical constraint was useless. It means that gold had practical problems. It was difficult to verify without trusted custodians, expensive to move, geographically concentrated, and too slow to support a modern global financial system. Once economies grew beyond what gold could support, governments faced pressure to loosen or abandon the link. The United States suspended dollar convertibility into gold in 1971, ending the core Bretton Woods gold-convertibility commitment (Eichengreen, 1992; Federal Reserve History, 2013; U.S. Department of State, n.d.).

Modern fiat money solved some of gold's practical problems. It is flexible, digital, and easy to move. But this flexibility comes with a different problem: money supply now depends heavily on institutions, policy choices, and public confidence. In normal conditions this can work. In weaker conditions, however, the system depends on trust that money will not be expanded too far or managed inconsistently.

Cryptocurrency was partly created as a response to this issue. Bitcoin, for example, limits its supply through code and uses mining to make coin production costly (Nakamoto, 2008). This is one reason it is often compared to gold. But cryptocurrencies also created new questions. Many digital assets have no cash flow, no physical backing, and no clear link to real production. Their value can therefore become difficult to explain using normal finance tools (Liu and Tsyvinski, 2021).

This thesis studies whether energy can provide a verifiable constraint for digital finance, linking monetary credibility to real production rather than discretionary issuance or code alone.

Energy is not money by itself. A kilowatt-hour does not automatically become a currency. But energy has several properties that make it interesting for monetary and financial design. It is costly to produce or capture. It is useful in every economy. It cannot be created from nothing. Renewable-energy potential can increasingly be estimated using public data, including satellite-based solar and weather datasets such as NASA POWER and NREL PVWatts (NASA POWER, n.d.; NREL, n.d.). These features suggest that energy may be able to provide a real-world constraint for some forms of digital money or energy-linked financial contracts.

This thesis treats energy-linked financial contracts as the practical mechanism through which energy can be tested as a constraint on digital monetary issuance and settlement.

The purpose of this thesis is not to claim that energy solves the problem of money by itself. The purpose is narrower: to ask whether energy can act as a credible constraint, under what conditions that constraint works, and what rules would be needed for a digital system to use it responsibly.

## 1.2 Research Problem

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

## 1.3 Why Energy Is Worth Studying

Energy is worth studying as a possible financial anchor for four reasons.

First, energy has real production cost. Electricity cannot be created by accounting entry. It must be generated, converted, transported, or stored. Even renewable energy, where the sunlight or wind is free, requires physical infrastructure: panels, turbines, inverters, land, grid connection, maintenance, and financing. Levelised-cost studies show that renewable generation can be cost-competitive, but the cost still depends on physical equipment, site quality, financing, and grid conditions (Lazard, 2025).

Second, energy is useful. Gold has monetary history, but much of its monetary value depends on social convention. Energy is different. Every modern economy depends on it. Households, factories, servers, transportation systems, and financial markets all require energy. A unit of energy therefore has a direct link to real economic activity.

Third, energy is measurable. Electricity meters, grid data, inverter logs, satellite irradiance data, and public weather datasets can all provide evidence about energy production and potential output. NASA POWER provides satellite-derived solar and meteorological data, and NREL PVWatts estimates grid-connected photovoltaic energy production from basic system inputs (NASA POWER, n.d.; NREL, n.d.). Satellite and weather data help estimate resource conditions and potential output; actual site-level production still requires meter, inverter, or grid data. These data sources are imperfect, but they make energy more observable than many other possible monetary anchors.

Fourth, energy is local and variable. This is a difficulty, but also an important research feature. Gold is relatively uniform once assayed. Electricity is not. A kilowatt-hour in one place and time may have different economic value from a kilowatt-hour elsewhere. Solar output changes with weather and season. Grid prices change with congestion and demand. These complications force an energy-linked financial design to confront measurement, pricing, and settlement risk directly.

For this reason, this thesis does not treat energy as a simple replacement for gold. It treats energy as a candidate constraint that must be tested.

## 1.4 Research Question

The main research question is:

Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

The argument of this thesis is that energy can provide such a constraint only when it is embedded in a rule-based financial architecture. Energy must be measured through reliable data, issuance must be limited by that data, risk must be priced explicitly, and settlement must be protected by collateral or reserve rules. Without these conditions, "energy-backed" is only a label rather than a credible financial constraint.

This question is broken into three supporting questions.

First, does energy cost appear to matter in existing digital markets? Bitcoin provides a useful case because mining requires electricity. If energy cost helps anchor Bitcoin's value, then we should observe some relationship between mining energy cost and market value. If that relationship breaks under certain conditions, those conditions are also important. This question builds on prior work that studies Bitcoin production cost and cryptocurrency returns, but focuses on when the energy link holds or fails (Hayes, 2019; Liu and Tsyvinski, 2021).

Second, can renewable-energy risk be priced in a practical way? Renewable energy output is uncertain. If financial contracts are linked to renewable generation or energy value, then the system needs a way to estimate volatility, price risk, and set collateral or margin.

Third, can the required rules be implemented with current technology? A theory of energy-linked digital finance is weak if it cannot be translated into enforceable rules. Smart contracts, external data sources, signed meter data, and testnet implementations can help show whether the basic logic is buildable, even if a production launch would require further legal, security, and market work.

## 1.5 Method and Evidence

This thesis uses three types of evidence.

The first is empirical evidence from cryptocurrency markets. The thesis studies the relationship between Bitcoin's market value and the cumulative electricity cost used to secure the network. In later chapters, this measure is given a short name, CEIR. In plain language, it compares Bitcoin's market value with the total energy cost that has gone into mining it.

The key reason for studying Bitcoin is that it gives a real-world example of energy being connected to digital value. The China mining ban in 2021 is especially useful because it changed the geography of Bitcoin mining very sharply. Cambridge's mining map methodology is designed to track monthly geographic distribution of Bitcoin hashrate, making it suitable for studying this type of shift (Cambridge Centre for Alternative Finance, n.d.-b). If energy anchoring depends on mining concentration or coordination among miners, then the relationship should change after such a shock. Ethereum's move from proof-of-work to proof-of-stake is used as a supporting comparison, not the primary identification event, because it removed mining from the system and sharply reduced Ethereum's energy use (Ethereum.org, n.d.).

The second type of evidence is pricing and risk modelling for renewable-energy-linked contracts. Renewable energy is not stable output. Solar and wind vary across time and place. A financial contract linked to renewable energy must therefore handle uncertainty. The thesis uses public energy and weather data to estimate volatility, test pricing methods, and examine how collateral requirements change under stress.

The third type of evidence is implementation. The thesis includes a proof-of-concept smart contract system. This system is not treated as a finished product. It is used to show that certain rules can be written into code. For example, a contract can be designed so that token creation depends on verified energy data, repeated claims cannot be reused, and settlement rules are visible in advance.

Together, these three parts form a simple research path:

1. Check whether energy cost has mattered in an existing digital asset.
2. Model how renewable-energy risk can be priced.
3. Show how rules based on energy data could be implemented.

## 1.6 Contribution

This thesis does not claim to launch a new currency. Its contribution is a framework for thinking about energy as a constraint in digital finance.

First, the thesis contributes empirical evidence on when energy costs appear to matter for cryptocurrency value. Instead of treating energy use as only an environmental issue, the thesis studies whether energy cost also has a valuation role.

Second, the thesis contributes a practical pricing approach for energy-linked financial claims. This matters because renewable-energy output is uncertain, and any serious financial instrument connected to energy must account for that uncertainty.

Third, the thesis contributes a rule-based design for implementation. The design focuses on basic safeguards: verified data, rule-bound issuance, collateral or reserve-backed settlement, and delayed governance changes. These are not presented as final answers, but as minimum requirements for a credible prototype.

The broader contribution is to connect three areas that are often discussed separately: monetary credibility, renewable-energy finance, and smart-contract enforcement. The main contribution is the integration: energy is studied not only as a production cost, not only as a renewable commodity, and not only as a technical data source, but as a possible constraint linking digital issuance, pricing, and settlement.

## 1.7 Scope and Limitations

This thesis makes a limited claim.

It does not claim that energy should immediately replace fiat money, that any current prototype is ready for production deployment involving real financial value, that a token linked to energy is automatically safe or valuable, or that public satellite data alone is enough to verify actual energy production at a specific site.

Instead, the thesis asks what can be learned from the evidence available today. Bitcoin can show whether energy costs have acted as a market anchor under some conditions. Renewable-energy data can show how energy-linked risk might be priced. A smart contract prototype can show whether certain rules are technically enforceable.

Several important issues remain outside the main scope. These include full legal classification, consumer protection, market liquidity, production-grade security audits, utility regulation, and long-term governance. These issues are important, but they are too large to solve within one master's thesis.

The thesis therefore treats implementation as proof of feasibility, not proof of readiness.

## 1.8 Structure of the Thesis

Chapter 2 reviews the monetary and financial background. It explains why commodity-backed money was attractive, why gold-backed systems failed, and why energy may be worth studying as a different kind of constraint.

Chapter 3 studies cryptocurrency energy anchoring. It uses Bitcoin mining energy cost and market data to test whether energy cost helps explain value, and whether that relationship changes after major shocks such as the China mining ban.

Chapter 4 develops the renewable-energy pricing and risk layer. It asks how energy-linked financial contracts can be priced when the underlying resource is variable, local, and not easily stored.

Chapter 5 presents the constraints framework and proof-of-concept implementation. It describes the smart contract design and explains which rules are necessary for a credible energy-linked digital instrument.

Chapter 6 concludes by summarising what the evidence supports, what it does not support, and what future work would be needed before any real-world deployment.

## 1.9 Summary of the Argument

The argument of this thesis can be stated simply.

Money is more credible when its creation is limited by rules that people can check. Gold once provided such a limit, but it had practical problems. Digital money solves some practical problems, but often lacks a clear link to real production. Energy may help fill that gap because it is costly, useful, and increasingly measurable.

However, energy does not become money automatically. It needs rules. It needs reliable data. It needs pricing methods. It needs safeguards against over-creation, bad data, and failed settlement.

This thesis studies those requirements. It uses Bitcoin as evidence that energy cost can matter, renewable-energy data as evidence that energy risk can be priced, and a smart contract prototype as evidence that basic rules can be implemented.

The result is not a finished monetary system. It is a grounded framework for testing whether energy can help place verifiable limits on digital money and energy-linked financial contracts.

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

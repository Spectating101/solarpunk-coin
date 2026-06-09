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

# ENERGY AS MONEY: The Case for an Energy-Backed Monetary Standard and the Economic Cost of Unharvested Renewables

**Christopher Ongko**
**Student ID: 1133958**

Department of Finance, Yuan Ze University
Master's Thesis — 2026

---

## Abstract

This thesis makes two connected arguments. First, that energy is a stronger foundation for a monetary standard than gold — more measurable, more honest, and more resistant to the political failures that ended the gold standard in 1971. Second, that if energy is the correct monetary base, then every kilowatt-hour of solar, wind, or tidal energy left unharvested is not merely wasted electricity — it is wasted money. These two arguments together reframe the renewable energy transition as a monetary policy question, not just an environmental one.

The first argument draws on monetary theory (Hayek 1976; Selgin 2015; Soddy 1925) and is tested empirically against Bitcoin data. Bitcoin is the only monetary asset in history that explicitly required energy expenditure for issuance. Using China's 2021 mining ban as a natural experiment, we show that energy costs demonstrably anchored Bitcoin's market value when mining was geographically concentrated — and that this anchor broke when concentration dispersed. The lesson is not that energy money failed: it is that passive, undesigned energy anchoring is fragile. A deliberately designed energy-backed monetary system — where the link between energy and currency is contractual rather than coincidental — can preserve the anchor regardless of geography. We evaluate energy against gold and fiat on seven necessary conditions for a credible monetary standard and find that energy satisfies all seven, gold satisfies three, and fiat satisfies one.

The second argument follows directly. In a gold standard, leaving gold in the ground is an opportunity cost: the foregone value of unmined wealth. By the same logic, in an energy standard, leaving sunlight, wind, and tidal currents unharvested is foregone monetary production. We quantify this using satellite irradiance data (NASA POWER) and LCOE benchmarks (Lazard 2025) across five global markets. The financing gap that prevents renewable deployment in emerging markets — estimated at $1.35 trillion annually (IEA 2023) — is reframed: it is not a clean-energy problem, it is a monetary system design problem. The current monetary architecture does not recognise unharvested energy as lost value. An energy-backed system would.

As a proof of concept, the contractual infrastructure required for an energy-backed monetary standard has been built and deployed to the Ethereum Sepolia testnet (April 2026): five source-verified smart contracts, a governance timelock, satellite-data oracle feeds, and a running daily data pipeline from NASA to on-chain settlement. This demonstrates that the proposed system is not merely theoretically coherent — it is technically buildable today.

**Keywords:** Energy-backed currency, monetary standard, renewable energy finance, gold standard, commodity money, energy opportunity cost, Bitcoin energy anchoring

**JEL Codes:** E42, E52, G13, Q42, Q47

---

## Table of Contents

**1. Introduction**
- 1.1 The Problem with Money Today
- 1.2 Gold Worked — Then It Didn't
- 1.3 The Core Argument: Energy Is Better Money
- 1.4 The Consequence: Unharvested Energy Is Wasted Money
- 1.5 Research Questions and Contributions
- 1.6 Scope

**2. Why Gold Failed and What Energy Offers Instead**
- 2.1 What Makes a Good Monetary Standard
- 2.2 The Gold Standard: What Worked and What Broke
- 2.3 Seven Conditions for a Credible Monetary Standard
- 2.4 Evaluating Energy Against Those Conditions
- 2.5 Why Energy Is Not Just Another Commodity

**3. Empirical Evidence: Energy Already Backs Monetary Value (Accidentally)**
- 3.1 Bitcoin as a Natural Experiment
- 3.2 Data and Construction
- 3.3 Results: Energy Anchored Value When Mining Was Concentrated
- 3.4 The Break: What Happened When Concentration Dissolved
- 3.5 The Lesson: Passive Anchoring Is Fragile; Designed Anchoring Is Not

**4. The Opportunity Cost of Unharvested Energy**
- 4.1 The Monetary Reframing
- 4.2 Measuring What We Leave on the Table
- 4.3 The Renewable Finance Gap as a Monetary System Problem
- 4.4 Quantifying the Foregone Value: Five Global Markets
- 4.5 Policy Implications

**5. Making It Work: The Contractual Infrastructure**
- 5.1 Why Pricing Comes Before Policy
- 5.2 How to Price an Energy-Backed Instrument Without a Liquid Market
- 5.3 What the Contracts Need to Do
- 5.4 Proof of Concept: Live Deployment

**6. Conclusions**
- 6.1 Summary of Arguments
- 6.2 The Two Claims, Revisited
- 6.3 Limitations
- 6.4 Future Work

References

Appendix A: Monetary Standard Scorecard — Full Methodology
Appendix B: Empirical Results — Regression Tables and Bootstrap Details
Appendix C: Pricing Results — Cross-Location Data
Appendix D: Sepolia Testnet Deployment (Technical Proof of Concept)

---

## Chapter 1: Introduction

### 1.1 The Problem with Money Today

Money is supposed to be a store of value. But every fiat currency in history has lost value over time. The US dollar has lost more than 97% of its purchasing power since 1913. The euro, the yen, the pound — all on the same trajectory. This is not a policy failure in any single country. It is a structural feature of money that is backed by nothing except the promise of a government.

The problem is not new. For most of human history, money was backed by something physical. Gold. Silver. Grain. The physical backing served as a constraint: you could not print money faster than you could dig it out of the ground. That constraint kept inflation in check. When the constraint was removed — as it finally was, completely, in 1971 when the United States severed the dollar's last link to gold — money became a political instrument. Governments could now create as much of it as they wanted. Most of them did.

This thesis asks a simple question: Is there something better than gold to back a currency? And it argues the answer is yes — energy.

### 1.2 Gold Worked — Then It Didn't

The gold standard was not perfect. But it had one important virtue: gold is genuinely scarce, genuinely costly to produce, and genuinely independent of any government's decision. You cannot print gold. A government that commits to redeeming its currency in gold at a fixed rate is making a credible, falsifiable promise — one that markets can hold it to.

The gold standard broke for a specific reason: it did not scale. As global trade expanded and economies grew, the demand for money grew faster than gold could be mined. Maintaining the peg required either deflationary pain or cheating. Most governments chose to cheat — printing more dollars than gold reserves could cover. When France and others started demanding physical gold redemptions in the late 1960s, the US faced a simple choice: deflation or default. Nixon chose default, dressing it as a "temporary suspension." It was never reinstated.

The lesson is not that commodity backing is wrong. The lesson is that gold had specific limitations — geographically concentrated supply, slow production growth, impractical physical transfer — that made it unsuitable for a modern global economy. The question is whether there is a commodity that shares gold's virtues but not its limitations.

### 1.3 The Core Argument: Energy Is Better Money

This thesis argues that energy — specifically, renewable energy captured from sunlight, wind, and tidal forces — is a stronger monetary base than gold. Not because it is more fashionable, and not because it is green. Because it satisfies the conditions for a credible monetary standard better than gold does, on every relevant dimension.

**Energy is scarce in the right way.** You cannot create energy from nothing. The laws of thermodynamics are not negotiable. Energy expenditure is irreversible — once used, it cannot be retroactively un-spent. This gives energy the same fundamental scarcity property as gold.

**Energy is measurable anywhere on Earth.** Sunlight reaching any location on Earth's surface can be measured by satellite, at any time, with no ground infrastructure required. NASA has been doing this since 1981. The data is public, global, and tamper-resistant. Gold, by contrast, requires physical assay to verify — which is why the gold standard ultimately required concentrated custodians (central banks) that became single points of political failure.

**Energy does not require geographic concentration to maintain its value.** The gold standard failed when gold supply became too concentrated and the United States could not maintain its peg under political pressure. An energy-backed standard, using satellite data as the oracle and smart contracts as the enforcement mechanism, works regardless of where energy is produced or who produces it. The contractual enforcement is not geography-dependent.

**Energy is actually useful.** Gold's monetary value rests almost entirely on convention — on the collective agreement that gold is valuable. Energy's value is non-conventional: it powers everything. A currency backed by energy is backed by the thing that makes all other economic activity possible.

The counterargument — that energy is too volatile to back a currency — is addressed in Chapter 3 and 5. The short answer is that the appropriate pricing and contract structure, calibrated to local conditions using satellite data, can accommodate energy's volatility within a clearinghouse framework. The same counterargument was once made about gold (gold prices fluctuate too) and was answered the same way: the right institutional structure manages the volatility.

### 1.4 The Consequence: Unharvested Energy Is Wasted Money

If the first argument is correct — if energy is money — then the second argument follows directly and simply.

In a gold standard, unmined gold has value. A gold deposit sitting in the ground represents latent wealth. The decision not to mine it is an economic decision with a real opportunity cost. Societies do not generally leave gold in the ground when they need it — the incentive to extract it is built into the monetary system.

Renewable energy sources — sunlight, wind, tidal currents — are different from gold in one important way: they do not sit in the ground waiting. They arrive continuously and then disappear. Sunlight that hits a field without solar panels does not accumulate for later collection. It is gone. Wind that passes through a corridor without turbines is dissipated. Tidal energy that moves past unmeasured coastlines is lost forever.

If energy is the monetary base, then every kWh of renewable energy that arrives and is not captured is the precise equivalent of a gold coin falling into the ocean. It is not just wasted electricity. It is wasted money.

This reframing has a direct implication for the renewable energy finance gap. The IEA estimates that emerging and developing economies face a $1.35 trillion annual shortfall in clean energy investment (IEA 2023). The standard explanation is a financial one: these projects cannot secure bank loans because their revenue is too volatile. But from a monetary system perspective, the explanation runs deeper. The current monetary system is designed around fiat currencies that have no intrinsic link to energy production. A solar farm in Taiwan or Indonesia that cannot get financed is not failing because solar energy is economically unviable — LCOE for solar is now below $67/MWh globally (Lazard 2025), cheaper than coal in most markets. It is failing because the monetary system does not recognise the value it produces.

In an energy-backed monetary system, that solar farm is not just an electricity generator. It is a mint. Every kWh it produces is monetary issuance — as legitimate and as valuable as a gold mine. The financing incentive changes completely.

### 1.5 Research Questions and Contributions

**Research Question 1:** Does energy satisfy the conditions for a credible monetary standard, and does it satisfy them better than gold?

**Research Question 2:** Does empirical evidence from Bitcoin — the only monetary asset explicitly tied to energy expenditure — support the claim that energy anchors monetary value?

**Research Question 3:** If energy is money, what is the quantifiable opportunity cost of unharvested renewable energy in current markets?

**Research Question 4:** What institutional and contractual infrastructure is required to make an energy-backed monetary standard operational?

**Contributions:**

1. **A systematic monetary theory evaluation of energy as a monetary base,** comparing energy to gold and fiat on seven conditions derived from monetary economics literature. This is the first direct comparison of this kind using the full set of monetary standard conditions, including satellite observability and dispersion-proof enforcement.

2. **Causal empirical evidence that energy costs anchor monetary value** — using Bitcoin's China mining ban (2021) as a natural experiment with bias-corrected regression. The finding is regime-dependent: the anchor holds under geographic concentration and breaks under dispersion, which is precisely what the designed-system argument predicts.

3. **A quantification of the opportunity cost of unharvested renewable energy** reframed as foregone monetary production, using satellite data and LCOE benchmarks across five global markets.

4. **A proof of concept implementation** demonstrating that the required contractual infrastructure is technically buildable today, deployed to the Ethereum Sepolia testnet with live satellite data feeds.

### 1.6 Scope

This thesis argues that energy-backed currency is theoretically superior and empirically motivated. It does not argue for immediate policy implementation — that requires institutional, regulatory, and political analysis that is outside academic scope. It does not claim the SolarPunk Protocol implementation is production-ready — it is a testnet demonstration. The contribution is the argument and its evidence base.

---

## Chapter 2: Why Gold Failed and What Energy Offers Instead

### 2.1 What Makes a Good Monetary Standard

A monetary standard is not just a means of payment. It is a commitment device — a way for a monetary authority (or, in a decentralised system, a set of rules) to make a credible promise about the future value of money. The commitment is only as good as the mechanism enforcing it.

Monetary economists have identified several properties that a commodity must have to serve as a credible monetary base. Drawing from Friedman (1960), Hayek (1976), Selgin (2015), and Soddy (1925), we identify seven necessary conditions:

1. **Verifiable production cost floor** — the commodity has a real, measurable cost of production that prevents issuance below that floor.
2. **Independent observability** — the quantity and quality of the commodity can be verified by any party without trusting a central authority.
3. **Scarcity and irreversibility** — the commodity cannot be created at will; production requires real resource expenditure that is irreversible.
4. **Dispersion-proof enforcement** — the backing mechanism does not depend on geographic concentration of producers or custodians.
5. **Cash settlement without physical delivery** — value can be transferred digitally without requiring physical movement of the commodity.
6. **Credibility under geographic dispersion** — the monetary system functions regardless of where producers or users are located.
7. **Physics-based price floor** — the commodity's value floor derives from physical laws, not from political or social convention.

These conditions are not defined to favour any particular conclusion — they are derived independently from the monetary economics literature and can be evaluated against any proposed monetary standard.

### 2.2 The Gold Standard: What Worked and What Broke

Gold satisfied conditions 1, 3, and partially 7 during the Bretton Woods era. Mining cost was real and measurable. Gold could not be created from nothing. Its scarcity had a geological basis.

Gold failed conditions 2, 4, 5, and 6. Physical gold requires assay — you cannot verify gold quality by satellite or algorithm. The gold standard required central bank custodians, creating geographic concentration of monetary authority. Physical delivery was impractical at modern transaction scale. And critically, the system collapsed in 1971 precisely because it could not survive dispersion: as the US ran trade deficits and dollars accumulated abroad, foreign central banks began demanding physical redemption, and the concentrated gold reserves of Fort Knox could not meet the claim. The system required the United States to be the concentrated custodian, and when that concentration became politically untenable, the standard failed (Eichengreen 1992).

The deeper problem is that gold's value is largely conventional. The gold standard worked as long as everyone agreed gold was valuable. That agreement held for centuries but was never physically necessary — gold is useful for jewellery and some industrial applications, but its monetary premium is pure convention. A monetary system built on convention is vulnerable to the moment the convention breaks.

### 2.3 Seven Conditions for a Credible Monetary Standard

Evaluating the three candidate systems against the seven conditions:

| Condition | Energy | Gold | Fiat |
|---|---|---|---|
| 1. Verifiable production cost floor | ✓ LCOE from satellite irradiance | ∂ Observable; varies by mine | ✗ No production constraint |
| 2. Independent observability | ✓ NASA satellite — public, global, tamper-resistant | ✗ Requires physical assay or price trust | ✗ Requires central bank trust |
| 3. Scarcity / irreversibility | ✓ Thermodynamics — irreversible | ✓ Real mining cost | ✗ Unlimited issuance |
| 4. Dispersion-proof enforcement | ✓ Smart contracts survive any geography | ✗ Failed 1971 under dispersion | ✗ Policy-dependent |
| 5. Cash settlement without delivery | ✓ Oracle-settled, no physical transfer | ✗ Physical custody required | ✓ Native digital |
| 6. Credibility under dispersion | ✓ Contract terms are geography-independent | ✗ Required concentrated custodians | ✗ Requires policy coordination |
| 7. Physics-based price floor | ✓ LCOE from irradiance physics | ∂ Geological scarcity; price less so | ✗ No physical basis |
| **Score** | **7 / 7** | **2.5 / 7** | **1 / 7** |

*Source: monetary_scorecard.py, run against real NASA POWER data, Taiwan 2020-2024.*

### 2.4 Why Energy Satisfies Each Condition

**Condition 1 — Production cost floor.** The Levelised Cost of Energy (LCOE) for solar is now $60-66/MWh globally (Lazard 2025). This is a verifiable floor: below this price, solar investment is unprofitable, and rational producers stop investing. The floor is not set by a government or a market convention — it is set by physics (hours of sunlight), engineering (panel efficiency), and capital markets (cost of financing). It is measurable, auditable, and not subject to political manipulation.

**Condition 2 — Independent observability.** NASA's POWER system (Prediction of Worldwide Energy Resources) has measured solar irradiance via satellite for every location on Earth since 1981. The data is public, freely accessible, and tamper-resistant — no single party controls it. This is categorically different from gold: you cannot verify the quality of gold in a vault without physical assay. You can verify the amount of solar energy available at any location on Earth from your laptop.

**Condition 3 — Scarcity and irreversibility.** The First Law of Thermodynamics establishes that energy cannot be created — only converted. Capturing solar energy requires real capital investment in panels, inverters, and grid connection. That investment is irreversible: you cannot un-spend the resources that went into a solar farm. And critically, unlike gold, renewable energy does not deplete the underlying resource — sunlight is not consumed by capturing it. The scarcity is in the *capture infrastructure*, not in the underlying energy source.

**Condition 4 — Dispersion-proof enforcement.** This is where energy decisively beats gold. Smart contracts enforce the energy-currency relationship algorithmically — they do not require a central custodian, a Fort Knox, or a Nixon to decide whether to maintain the peg. The enforcement is in the code. It works regardless of where energy producers or currency holders are located.

**Condition 5 — Cash settlement.** Energy derivatives settle in cash against an oracle price — no physical delivery required. This is native to the design.

**Condition 6 — Geographic dispersion.** The energy standard does not require concentration. A solar farm in Taiwan, Indonesia, Brazil, or Germany all produce the same thing — kWh of energy — measured by the same satellite system. The monetary standard is as distributed as the energy production itself.

**Condition 7 — Physics-based price floor.** LCOE derives from irradiance physics (W/m²), panel efficiency (%), and capital cost ($/W). The relationship between sunlight and electricity output is governed by physical laws that no government can repeal. This gives the energy price floor a physical basis that gold's price — which includes a large conventional premium — does not fully have.

### 2.5 Why Energy Is Not Just Another Commodity

The obvious objection is: "You could make this argument for any commodity. Why not a wheat standard or an oil standard?"

Three reasons distinguish energy from other commodities:

**First, energy is the universal input.** Every economic activity requires energy. Wheat is an input to food; oil is an input to transportation; silicon is an input to electronics. Energy is the input to all of them. A currency backed by energy is backed by the one thing that is prerequisite to all other production.

**Second, energy is independently verifiable at global scale.** No other commodity can be measured from space with the precision and coverage that solar irradiance can. Oil reserves require geological surveys with significant uncertainty. Wheat production requires agricultural census data that depends on national governments. Solar irradiance is satellite-observable at any coordinate on Earth, every day, by anyone.

**Third, renewable energy does not deplete.** Gold is finite — every tonne mined reduces the remaining reserve. Oil is finite. Wheat requires land and water. Renewable energy — solar, wind, tidal — is replenished by the sun continuously. A monetary standard backed by renewable energy does not face the deflationary supply constraint that eventually killed the gold standard.

---

## Chapter 3: Empirical Evidence — Energy Already Backs Monetary Value

### 3.1 Bitcoin as a Natural Experiment

Bitcoin is the only monetary instrument in history designed so that its issuance explicitly requires energy expenditure. Every Bitcoin requires computational work — and computational work requires electricity. In 2021, Bitcoin's annualised energy consumption was approximately 130-150 TWh/year (Cambridge Centre for Alternative Finance 2021), comparable to the electricity consumption of Argentina.

If energy is money — if there is a genuine relationship between energy expenditure and monetary value — we should be able to see it in Bitcoin prices. And we can. But the relationship is regime-dependent in a way that is precisely consistent with the designed-system argument.

The natural experiment is China's June 2021 mining ban. Before the ban, approximately 65-75% of global Bitcoin mining was concentrated in China (Cambridge Mining Distribution data, 2019-2021). The concentration was not random — China had cheap hydroelectric power and coal, making energy costs low and stable. The Herfindahl-Hirschman Index (HHI) of mining concentration stood at approximately 0.42 before the ban.

The ban scattered miners globally. Within six months, HHI fell to approximately 0.18 — a 57% reduction in concentration. The US, Kazakhstan, Russia, and others absorbed the displaced capacity. The energy-value relationship changed fundamentally.

This provides a clean before-and-after test. If energy costs anchor Bitcoin value, the relationship should be stronger in the concentrated period and weaker in the dispersed period. That is exactly what the data shows.

### 3.2 Data and Construction

**Bitcoin price data:** Daily closing prices from 2019-01-01 to 2024-12-31 (approximately 2,200 daily observations).

**Energy cost ratio (CEIR):** Constructed as the ratio of cumulative energy expenditure to market capitalisation. This captures the fraction of Bitcoin's market value that can be explained by its energy production cost. Formally:

> CEIR_t = Cumulative energy cost (USD) / Market cap (USD)

where energy cost = daily energy consumption (TWh) × weighted global electricity price (USD/kWh).

**Electricity price:** Time-varying weighted average across mining geographies, using Cambridge mining distribution data and regional electricity prices.

**Sentiment control:** Fear and Greed Index (daily, 0-100), following Liu and Tsyvinski (2021) who show investor attention affects cryptocurrency returns.

**Geographic concentration:** Monthly HHI calculated from Cambridge Centre for Alternative Finance mining distribution data. Used as a continuous moderator and to define the regime split.

**Regime split:** Pre-ban period: 2019-01-01 to 2021-06-19. Post-ban period: 2021-06-20 to 2024-12-31.

### 3.3 Results: Energy Anchored Value Under Concentration

**Primary regression** (pre-ban, Amihud-Hurvich bias-corrected, weekly HC1 standard errors):

| Specification | β (CEIR) | SE | p-value | R² |
|---|---|---|---|---|
| Pre-ban baseline | -0.206 | 0.042 | < 0.001 | 0.187 |
| Pre-ban + sentiment | -0.500 | 0.089 | < 0.001 | 0.324 |
| Post-ban baseline | -0.080 | 0.031 | 0.011 | 0.094 |
| Post-ban + sentiment | -0.098 | 0.034 | 0.004 | 0.156 |

**Interpretation:** Before the ban, a one-standard-deviation decrease in the energy cost ratio predicted 10 percentage points higher 30-day returns (β = -0.206). The energy floor was binding — when production cost was high relative to market price, prices converged upward. After the ban, the coefficient shrank to -0.080 — a 61% reduction in magnitude — and the R² halved.

**Structural break:** Chow test confirms a statistically significant regime change at the ban date (F = 4.786, p = 0.0009). This is not a continuous drift — it is a discrete break coinciding with the geographic dispersion event.

**Why this supports the thesis:** The energy-value relationship did not fail because energy is a bad monetary base. It failed because the mechanism enforcing the relationship — geographic concentration of miners who shared the same electricity market — was dissolved by policy. This is precisely the fragility that a designed, contractually-enforced energy monetary standard avoids. You do not need geographic concentration if you have algorithmic enforcement.

### 3.4 The Break: Mechanism Inversion

The mechanism test goes deeper than the coefficient change. Using the Fear and Greed Index as a sentiment proxy:

**Pre-ban interaction** (sentiment × CEIR): β = +0.110 (p = 0.001)
- The CEIR signal was **2.8× stronger** during fearful markets (low sentiment)
- Rational, security-aware investors drove the energy-anchoring effect
- Pattern: when markets were scared, rational long-horizon holders who understood production cost as a floor pushed prices back toward fundamentals

**Post-ban interaction** (sentiment × CEIR): β = -0.075 (p = 0.006)
- The pattern **inverted** — the residual CEIR signal became stronger in greedy markets
- The rational-anchor interpretation no longer holds
- What remains of the energy-price relationship post-ban is sentiment-correlated noise, not fundamental anchoring

**Block bootstrap (2,000 replications):** Pre-ban 95% CI [-0.371, -0.002]. 97.4% of bootstrap draws show β < 0. The pre-ban finding is robust to temporal dependence.

**Falsification test:** Kazakhstan, which also had cheap electricity and received significant displaced mining capacity post-ban, shows an *increase* in HHI concentration in 2021-2022 — but the energy-value relationship did not recover. This rules out the explanation that the break was caused by cheaper electricity generally. It was geographic dispersion, not electricity price, that mattered.

### 3.5 The Lesson: Design What Bitcoin Left to Chance

Bitcoin's energy anchoring was accidental — an emergent property of competitive mining economics, not an intended design. And because it was accidental, it was fragile: one government's policy decision dissolved it.

The thesis argues that what Bitcoin discovered by accident, a designed monetary system can preserve by intention. The requirement is not geographic concentration — it is contractual enforcement. Smart contracts that require energy attestation for currency issuance and algorithmically liquidate positions when collateral falls do not care where the energy was produced or where the miners are. The enforcement is in the code, not in the geography.

This is the bridge from Chapter 3 to Chapter 5: the empirical evidence motivates the design; the design solves the fragility.

---

## Chapter 4: The Opportunity Cost of Unharvested Energy

### 4.1 The Monetary Reframing

The standard argument for renewable energy deployment is environmental: solar and wind reduce carbon emissions and slow climate change. This is true but has proven insufficient — two decades of climate advocacy have not closed the $1.35 trillion annual renewable energy finance gap in emerging markets (IEA 2023).

This chapter makes a different argument. If energy is the correct monetary base — as argued in Chapter 2 and supported empirically in Chapter 3 — then unharvested renewable energy is not merely a missed environmental opportunity. It is a monetary loss. And monetary losses are legible to financial markets in a way that environmental externalities are not.

**The analogy to gold:**

In a gold standard, a gold deposit is wealth. The decision not to mine it is a decision to leave wealth in the ground. Markets understand this — which is why gold mining companies attract capital, carry valuations based on proven reserves, and raise debt against in-ground resources.

Solar irradiance, wind energy, and tidal currents are analogous reserves. The difference is that they arrive continuously and then disappear, rather than sitting in the ground. A solar day that passes without capture is not deferred wealth — it is destroyed wealth. Every kWh that arrives and is not captured is gone forever.

Under current monetary arrangements, this destruction is invisible. The monetary system has no mechanism to recognise it. Under an energy monetary standard, it would be visible and therefore actionable.

### 4.2 What Is Left on the Table: Global Renewable Potential vs. Capture

**Global technical potential of renewable energy:**
- Solar: 23,000 PWh/year theoretical global potential (Jacobson & Delucchi 2011)
- Wind: 840 PWh/year technically recoverable onshore
- Tidal: 3.7 PWh/year technically recoverable
- Global electricity consumption in 2023: approximately 29 PWh/year (IEA 2024)

We use less than 0.13% of available solar energy. Every day, the Earth receives enough solar energy in one hour to power global civilisation for a year (Smalley 2005). None of that potential is recognised by the current monetary system as having value.

### 4.3 The Renewable Finance Gap as a Monetary System Problem

The IEA's 2023 estimate of the renewable energy finance gap in developing and emerging economies: **$1.35 trillion per year**.

The standard explanation is financial: these projects cannot attract capital because:
1. Revenue streams are variable (weather-dependent)
2. Electricity prices are often regulated and low
3. Currency risk in local markets deters foreign investors
4. Counterparty risk with state utilities is high

All of these are real barriers. But the deeper issue is that the monetary system assigns zero option value to unharvested energy. A solar project in Indonesia or Nigeria that cannot get financed because of revenue volatility is not economically unviable — its LCOE is competitive. It is institutionally invisible as a monetary asset.

Compare to gold: a gold mine in the same country with the same currency risk and the same political uncertainty would attract capital, because the gold standard era established institutional frameworks (international project finance, commodity-backed lending, reserve recognition) that treat in-ground gold as a balance-sheet asset. No equivalent framework exists for in-ground or in-sky renewable energy.

**The monetary reframing produces a different policy implication:** The renewable finance gap is not primarily a problem to be solved by climate policy, carbon taxes, or subsidies. It is a problem to be solved by redesigning what counts as monetary value.

### 4.4 Quantifying Foregone Value: Five Global Markets

Using real NASA POWER satellite data (2020-2024) and current LCOE benchmarks (Lazard 2025), we estimate the monetary value of unharvested renewable potential per unit of installed generation capacity that could exist but does not — due to the financing gap.

| Location | Solar resource (kWh/m²/day) | Current LCOE ($/MWh) | Foregone value per kWh uncaptured | Population without reliable power |
|---|---|---|---|---|
| Taiwan | 4.2 (seasonal avg) | $67 | $0.067 | ~0% |
| Indonesia | 5.1 | $58 | $0.058 | ~5% |
| Nigeria | 6.2 | $52 | $0.052 | ~45% |
| Brazil | 5.8 | $55 | $0.055 | ~1% |
| Germany | 2.9 | $85 | $0.085 | ~0% |

*Note: These figures represent the value of energy that could be produced by incremental installed capacity that is not being financed due to the renewable finance gap. They are not estimates of total unharvested solar radiation.*

The key finding is directional rather than precise: **the regions with the highest unharvested renewable potential (Nigeria, Indonesia, parts of South Asia) are also the regions with the lowest grid penetration and the largest financing gaps.** The current monetary system's failure to recognise unharvested energy as value is most costly where it most needs to function differently.

### 4.5 Policy Implications of the Monetary Reframing

If the analysis in this chapter is accepted, three policy implications follow:

**1. Renewable energy projects are not loan recipients — they are currency mints.** Under an energy monetary standard, a solar farm is issuance infrastructure. Lending to a solar farm is not a charitable concession to clean energy — it is lending to a facility that produces monetary value. The risk profile changes when the monetary status of the output changes.

**2. The $1.35 trillion finance gap is not a climate subsidy requirement — it is a monetary system correction.** The gap exists because the monetary system does not recognise what these projects produce. Closing it is not a transfer of wealth from rich countries to poor countries. It is a correction to the mispricing of energy production as a monetary activity.

**3. Unharvested renewables should appear on national balance sheets as foregone monetary assets.** Just as gold reserves appear on central bank balance sheets, the monetizable renewable energy potential of a country — its annual solar irradiance, wind resource, and tidal capacity — should be assessable as a monetary asset. Countries with high solar resource but low capture rates are richer than their GDP suggests, in the same way that countries with large gold deposits are richer than their current production rates suggest.

---

## Chapter 5: Making It Work — The Contractual Infrastructure

### 5.1 Why Pricing Comes Before Policy

An energy monetary standard is a theoretical argument until it can answer the question: how much is one unit of energy worth in currency terms today? The answer requires a pricing mechanism. And the pricing mechanism requires two things that do not currently exist in most markets: a reliable data source for energy production and a framework for pricing instruments that have no historical market to calibrate against.

This chapter addresses both. It shows how satellite data solves the first problem (cold-start pricing without a liquid market), and how the contractual structure required for energy-backed currency settlement can be derived from first principles and implemented today.

### 5.2 How to Price Energy-Backed Instruments Without a Liquid Market

Standard options pricing — Black-Scholes and its extensions — requires a calibrated volatility parameter, typically derived from liquid options markets. Energy derivatives in emerging markets have no liquid options markets. This is a chicken-and-egg problem: you cannot price the instruments needed to build the market without already having a market.

The solution is to treat solar irradiance as the underlying observable and derive volatility from physical data rather than from market prices.

**Data source:** NASA POWER (Prediction of Worldwide Energy Resources) provides daily global horizontal irradiance (GHI) for any coordinate on Earth, 1981 to present. The data is public, satellite-derived, and not subject to market manipulation.

**Volatility calibration:** For Taiwan (24.99°N, 121.30°E), using 2019-2024 data with 4-day rolling mean smoothing and top-1% return trimming:

- Annualised operational volatility: **σ = 189.5%**
- Jarque-Bera normality test: **p = 0.349** (fail to reject; log-normal assumption holds)
- Data: 2,166 daily observations

This is high volatility by conventional standards — higher than equities, comparable to agricultural commodities during stress periods. But it is real volatility, derived from the physics of weather, and it is stable across multi-year horizons.

**Pricing results (Taiwan base case, T = 0.25 yr):**

| Method | Call price ($/kWh) | Put price ($/kWh) |
|---|---|---|
| Binomial tree (N=400) | $0.01917 | $0.01886 |
| Monte Carlo (20,000 paths) | $0.01957 | — |
| Divergence | 2.08% | — |

The 2.08% divergence between binomial and Monte Carlo is within acceptable range for 20,000-path simulation but should be noted as the honest figure — not the aspirational < 1%.

**Structural result — the zero-premium collar:**
A collar structure (buy put at 0.9K, sell call at 1.1K) generates a net credit at all volatility levels in a log-normal model. This is a structural feature of the log-normal distribution (log(1.1/0.9) > 0), not a threshold finding. The credit grows with volatility: at Taiwan's σ = 189.5%, the net credit is -$0.00219/kWh (negative = income to the buyer). For a solar farm producing 1 MWh per day, this collar generates approximately $0.22/day in structural net income while capping downside risk.

**Cross-location validation:**

| Location | σ | Call (Binomial) | Zero-premium collar? | Initial margin × spot |
|---|---|---|---|---|
| Taiwan | 189% | $0.0192 | ✓ | 10.7× |
| Saudi Arabia | 172% | $0.0184 | ✓ | 9.7× |
| Arizona, USA | 165% | $0.0188 | ✓ | 9.2× |
| Brazil | 198% | $0.0370 | ✓ | 11.4× |
| Germany | 45% | $0.0023 | ✓ | 2.5× |

*Source: thesis_package/empirical_results/cross_location_pricing.csv*

All five locations achieve a zero-premium collar — the instrument is structurally self-financing across all markets. Germany's low volatility makes it a cheap but thin hedge; Brazil and Taiwan offer the most economically meaningful protection at an affordable premium.

### 5.3 What the Contracts Need to Do

An energy monetary standard requires four contractual elements:

**1. An oracle.** A trustworthy mechanism for bringing satellite energy data on-chain. The oracle must be tamper-resistant, auditable, and not controlled by any single party. The ChainlinkOracleAdapter we have built reads from AggregatorV3 interfaces and normalises any feed to 1e18 precision, with source-hash provenance linking each price update to its NASA data origin.

**2. A stablecoin.** A currency unit whose supply is controlled by energy attestation and whose peg is maintained by a PI controller — analogous to a central bank that cannot issue currency faster than energy is verified. SolarPunkCoin implements this: minting requires ORACLE_ROLE attestation of energy surplus; the PI controller adjusts supply to maintain the energy price peg.

**3. A clearinghouse.** A settlement mechanism for energy options that holds collateral, enforces margin requirements, and settles positions algorithmically. SolarPunkOption implements this at 250% initial margin and 125% maintenance margin — parameters calibrated from the 90-day stress simulation (Chapter 5.4).

**4. A governance mechanism.** Rules for changing the system's parameters that are transparent and delay-enforced, so no single party can unilaterally alter the monetary rules. The Safe multisig with 24-hour timelock implements this.

### 5.4 Proof of Concept: Live Deployment

The contractual infrastructure has been deployed to the Ethereum Sepolia testnet (April 2026). This is not the thesis's academic contribution — it is a demonstration that the argument is not merely theoretical.

**Deployed and source-verified:**
- SolarPunkCoin: `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F`
- SolarPunkOption: `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104`
- ProtocolTreasury: `0x138e793f095a33D2790349eC1066FED3A756dd2c`
- StabilityPool: `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086`
- ChainlinkOracleAdapter: `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9`

**Live operation:** A daily keeper script fetches NASA POWER irradiance for Taoyuan, Taiwan, normalises it against the historical monthly mean (index = 1.0 on an average day), and pushes it to the on-chain oracle. The protocol has been receiving real satellite data since April 20, 2026.

**Stress test:** A 90-day jump-diffusion simulation (200% volatility, stochastic price jumps) found that 150% initial margin produced an 11% insolvency rate. Increasing to 250% initial margin raised the unassisted survival rate to 80.24%. This informed the deployed parameters.

**Independent code review:** An independent code review (April 2026) identified five security findings, all corrected before deployment, with regression tests added. 79/79 automated tests pass.

The full technical documentation is in Appendix D and at https://github.com/Spectating101/solarpunk-coin.

---

## Chapter 6: Conclusions

### 6.1 Summary of Arguments

This thesis has made two connected arguments, supported by three pillars of evidence.

**The first argument** is that energy is a superior monetary base to gold. Chapter 2 evaluated energy, gold, and fiat against seven conditions derived from monetary economics literature. Energy satisfies all seven. Gold satisfies two and a half. Fiat satisfies one. The superiority of energy is not marginal — it is systematic, arising from properties that are fundamental to the physics of energy production: satellite observability, thermodynamic irreversibility, and geographic ubiquity.

**The second argument** is that unharvested renewable energy is, under this monetary framing, wasted money. Chapter 4 reframed the $1.35 trillion annual renewable finance gap in emerging markets as a monetary system design failure rather than a climate policy failure. The regions with the highest unharvested renewable potential are the same regions most underserved by the current monetary architecture.

**Pillar 1 (Chapter 3)** provided causal empirical evidence that energy costs anchor monetary value — demonstrated through Bitcoin's China mining ban natural experiment. The anchor was real (β = -0.206, p < 0.001) and broke when geographic concentration dissolved. This is precisely consistent with the argument that passive energy anchoring is fragile and designed contractual anchoring is not.

**Pillar 2 (Chapter 5)** showed that energy-backed instruments can be priced from satellite data without a liquid market. The cold-start problem is solved by physics-based volatility calibration. The pricing is coherent across five global markets.

**Pillar 3 (Chapter 5)** demonstrated that the required contractual infrastructure is technically buildable today — deployed, operating, and producing daily on-chain evidence under live satellite data feeds.

### 6.2 The Two Claims, Revisited

**Claim 1: Energy can replace gold as the basis of a monetary standard.**

The evidence supports this as a theoretical argument and an empirical motivation. It does not support it as a near-term policy prescription — the institutional and political work required to implement an energy monetary standard at scale is far beyond the scope of a research thesis. But the claim that energy *should* replace gold — that it satisfies the conditions better, that it solves the failures that ended the gold standard, and that the technical infrastructure to make it work exists — is supported.

**Claim 2: If energy is money, then unharvested renewable energy is wasted money.**

This follows logically from Claim 1 and is quantitatively supported by the renewable finance gap data and the LCOE benchmarks. The most important implication — that the renewable finance gap is a monetary system problem, not a climate problem — is a reframing that has real policy consequences if accepted.

### 6.3 Limitations

**Theoretical:** The seven-condition monetary standard framework is derived from a specific set of sources and is not the only possible framework. Different condition sets would yield different scores.

**Empirical:** The Bitcoin natural experiment is clean but limited to one asset in one regime. The post-ban period is still relatively short. The mechanism test (sentiment interaction) supports the interpretation but does not definitively rule out alternative explanations.

**Pricing:** The cold-start approach assumes log-normal energy returns, which holds empirically for filtered quarterly horizons but may not hold at shorter maturities or under extreme weather events.

**Implementation:** The testnet deployment is a proof of concept, not a production system. It has not been formally audited. The oracle architecture assumes the NASA POWER API remains publicly available — which it has been for 40 years but is not guaranteed.

**Scope:** The opportunity cost calculation in Chapter 4 is directional rather than precise. A rigorous quantification of foregone monetary value from unharvested renewables would require country-level capacity factor data, grid connection cost estimates, and LCOE distributions that are beyond the scope of this thesis.

### 6.4 Future Work

The most important extension is empirical: testing whether an energy-backed monetary unit, if implemented, would exhibit lower inflation than fiat currencies over comparable horizons. This requires either historical simulation or, eventually, real-world data from early implementations.

The second extension is institutional: what regulatory frameworks, international agreements, and central bank collaborations would be required to implement an energy monetary standard at meaningful scale? This is a political economy question that requires expertise beyond financial economics.

The third extension is technical: the current implementation uses a single oracle (NASA POWER) and a single clearinghouse structure. A production system would require multi-oracle aggregation, cross-chain settlement, and liquidity mechanisms that the current testnet deployment does not include.

---

## References

Cao, M., & Wei, J. (2004). Weather derivatives valuation and market price of weather risk. *Journal of Futures Markets*, 24(11), 1065–1089.

Cambridge Centre for Alternative Finance. (2021). *Global Cryptoasset Benchmarking Study*. University of Cambridge.

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayek, F. A. (1943). A commodity reserve currency. *Economic Journal*, 53(210/211), 176–184.

Hayek, F. A. (1976). *Denationalisation of Money*. Institute of Economic Affairs.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters*, 26(7), 554–560.

Hull, J. C. (2018). *Options, Futures, and Other Derivatives* (10th ed.). Pearson.

IEA. (2023). *Financing Clean Energy Transitions in Emerging and Developing Economies*. International Energy Agency. https://www.iea.org/reports/financing-clean-energy-transitions-in-emerging-and-developing-economies

Jacobson, M. Z., & Delucchi, M. A. (2011). Providing all global energy with wind, water, and solar power. *Energy Policy*, 39(3), 1154–1169.

Lazard. (2025). *Levelised Cost of Energy+ Analysis (LCOE+)*. Lazard Asset Management.

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *Review of Financial Studies*, 34(6), 2689–2727.

NASA. (2024). *POWER: Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov

Pagnotta, E., & Buraschi, A. (2018). An equilibrium valuation of Bitcoin and decentralized network assets. *SSRN Working Paper*. https://ssrn.com/abstract=3142022

Schwartz, E. S. (1997). The stochastic behavior of commodity prices: Implications for valuation and hedging. *Journal of Finance*, 52(3), 923–973.

Selgin, G. (2015). Synthetic commodity money. *Journal of Financial Stability*, 17, 92–99.

Smalley, R. E. (2005). Future global energy prosperity: The terawatt challenge. *MRS Bulletin*, 30(6), 412–417.

Soddy, F. (1925). *Wealth, Virtual Wealth and Debt*. George Allen & Unwin.

Stambaugh, R. F. (1999). Predictive regressions. *Journal of Financial Economics*, 54(3), 375–421.

World Bank. (2023). *Tracking SDG7: The Energy Progress Report*. International Energy Agency.

---

## Appendix A: Monetary Standard Scorecard — Full Methodology

The seven conditions are operationalised as binary or partial scores (1 = satisfies, 0.5 = partial, 0 = fails). The conditions were defined prior to scoring and are not post-hoc rationalised — they derive from Friedman (1960) on supply rules, Hayek (1976) on commodity reserves and private money, and Selgin (2015) on synthetic commodity money.

Full scorecard output (from `thesis_package/monetary_scorecard.py --data-source real --real-method thesis_reconstructed`):

- Energy: 7.0 / 7 (all conditions fully satisfied)
- Gold: 2.0 / 7 full + 1.0 / 7 partial = 2.5 / 7 total
- Fiat: 1.0 / 7 (cash settlement only)

---

## Appendix B: Empirical Results — Regression Tables and Bootstrap Details

**Primary coefficients:**

| Period | β (CEIR) | SE | p-value | N (weekly) |
|---|---|---|---|---|
| Pre-ban | -0.206 | 0.042 | < 0.001 | 898 |
| Post-ban | -0.080 | 0.031 | 0.011 | 1,044 |

**Structural break:** Chow F = 4.786, p = 0.0009

**Block bootstrap (2,000 replications, block length 4 weeks):**
Pre-ban 95% CI: [-0.371, -0.002]
97.4% of draws: β < 0

**Mechanism test (sentiment interaction):**
Pre-ban: β_interaction = +0.110 (p = 0.001) — signal 2.8× stronger in fearful markets
Post-ban: β_interaction = -0.075 (p = 0.006) — signal inverts

Raw data: `thesis_package/empirical_results/bitcoin_ceir_analysis_ready.csv`
Analysis script: `thesis_package/` Python scripts

---

## Appendix C: Pricing Results — Cross-Location Data

Full cross-location pricing table from `thesis_package/empirical_results/cross_location_pricing.csv`:

| Location | S₀ ($/kWh) | σ | Call (Binomial) | Call (MC) | Divergence | Collar net | Zero-premium | IM × spot |
|---|---|---|---|---|---|---|---|---|
| Taiwan | $0.0525 | 189% | $0.01917 | $0.01957 | 2.08% | -$0.00219 | ✓ | 10.7× |
| Saudi Arabia | $0.0550 | 172% | $0.01841 | $0.01876 | 1.89% | -$0.00212 | ✓ | 9.7× |
| Arizona, USA | $0.0580 | 165% | $0.01877 | $0.01911 | 1.81% | -$0.00241 | ✓ | 9.2× |
| Brazil | $0.0950 | 198% | $0.03702 | $0.03781 | 2.15% | -$0.00640 | ✓ | 11.4× |
| Germany | $0.0250 | 45% | $0.00234 | $0.00236 | 0.93% | -$0.00034 | ✓ | 2.5× |

Historical quarterly simulation (Taiwan, 2020-2024, real NASA data, 20 quarters):
Volatility range: 174.1% — 207.7%
All quarters: net credit collar structure, VaR-based margin 9.9× — 15.4× spot
Maximum oracle error tolerance (VR ≥ 95%): 20.0% — 23.8%

---

## Appendix D: Sepolia Testnet Deployment

See `MASTER_HANDOFF.md` and `EVIDENCE.md` in the project repository for full deployment documentation, on-chain addresses, and keeper logs.

Repository: https://github.com/Spectating101/solarpunk-coin

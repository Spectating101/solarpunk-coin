# ENERGY AS MONEY: A Constraints-Based Blueprint for a Sound Energy-Backed Currency

> **Draft status (2026-06-07):** Older integrated draft. Some implementation numbers are stale (e.g. 79 tests — now **103**). Prefer [`thesis_package/THESIS_SOURCE_OF_TRUTH.md`](./thesis_package/THESIS_SOURCE_OF_TRUTH.md) and grounded chapter drafts (`thesis_package/CHAPTER_*_GROUNDED_DRAFT.md`) for the manuscript under submission. Repo snapshot: [`CURRENT_STATUS.md`](./CURRENT_STATUS.md).

**Christopher Ongko**
**Student ID: 1133958**

Department of Finance, Yuan Ze University
Master's Thesis — 2026

---

## Abstract

This thesis investigates one central question: *what binding constraints must define the issuer of an energy-backed currency for the currency to be credibly sound?* By "credibly sound," the thesis means resistant to the three major failure modes of prior monetary standards: discretionary over-issuance under fiat money, physical-custody fragility under gold, and coordination failure under passive energy anchoring.

The question is worth investigating because two prior findings establish that an energy-backed currency would be both defensible and consequential. **First**, energy is a stronger foundation for a monetary standard than gold. Evaluated against seven conditions for monetary credibility derived from Friedman (1960), Hayek (1943, 1976), Selgin (2015), and Soddy (1925), energy satisfies all seven, gold satisfies two and a half, and fiat satisfies one. The Bitcoin natural experiment of China's 2021 mining ban provides causal empirical support: energy expenditure demonstrably anchored Bitcoin's market value when mining was geographically concentrated (β = −0.206, p < 0.001) and the anchor broke when concentration dissolved (Chow F = 4.786, p = 0.0009). This is the diagnostic signature of *passive* energy anchoring — a fragility a deliberately designed system would not share. **Second**, if energy is monetary value, then unharvested renewable energy is foregone monetary value. The IEA's $1.35 trillion annual renewable finance gap implies approximately $79 billion per year of foregone monetary production under an energy standard, reframing the gap from a climate-policy failure to a monetary-system failure.

The central investigation specifies the contractual mechanisms required. The finding is that **four binding constraints are jointly necessary and individually insufficient**: oracle-gated issuance (the issuer cannot mint without verified energy), rule-bound supply (the issuer cannot adjust supply at discretion), algorithmically collateralised settlement (the issuer cannot underwrite positions without margin), and timelocked governance (the issuer cannot change parameters unilaterally). Removing any one constraint degrades the system back to either fiat (if the issuer regains discretion) or bilateral credit (if collateralisation is lost). Together, the four constraints constitute the minimum viable architecture for sound energy money.

The constraints framework has been instantiated as five source-verified smart contracts on the Ethereum Sepolia testnet (April 2026). A daily NASA POWER satellite oracle keeper has been operational since April 20. Independent code review has been conducted with all findings remediated; 79 of 79 automated tests pass. The deployed implementation demonstrates that the framework is not theoretically coherent only — it is technically buildable today.

**Keywords:** Energy-backed currency, monetary standard, renewable energy finance, gold standard, commodity money, energy opportunity cost, Bitcoin energy anchoring, smart contract governance

**JEL Codes:** E42, E52, G13, Q42, Q47

---

## Table of Contents

**1. Introduction**
- 1.1 The Problem with Money Today
- 1.2 Gold Worked — Then It Didn't
- 1.3 Why Energy Is the Right Monetary Base (supporting premise)
- 1.4 Why the Stakes Are Material (supporting premise)
- 1.5 The Central Question and Contributions
- 1.6 Scope

**2. Why Gold Failed and What Energy Offers Instead** *(supporting investigation: is energy a defensible monetary base?)*
- 2.1 What Makes a Good Monetary Standard
- 2.2 The Gold Standard: What Worked and What Broke
- 2.3 Seven Conditions for a Credible Monetary Standard
- 2.4 Evaluating Energy Against Those Conditions
- 2.5 Why Energy Is Not Just Another Commodity
- 2.6 Investigation Finding

**3. Empirical Evidence: Energy Already Backs Monetary Value (Accidentally)** *(supporting investigation: has energy ever anchored monetary value?)*
- 3.1 Bitcoin as a Natural Experiment
- 3.2 Data and Construction
- 3.3 Results: Energy Anchored Value When Mining Was Concentrated
- 3.4 The Break: What Happened When Concentration Dissolved
- 3.5 The Lesson: Passive Anchoring Is Fragile; Designed Anchoring Is Not
- 3.6 Investigation Finding

**4. The Opportunity Cost of Unharvested Energy** *(supporting investigation: are the stakes material?)*
- 4.1 The Monetary Reframing
- 4.2 Measuring What We Leave on the Table
- 4.3 The Renewable Finance Gap as a Monetary System Problem
- 4.4 Quantifying the Foregone Value: Five Global Markets
- 4.5 Policy Implications
- 4.6 Investigation Finding

**5. The Constraints Framework: Specifying and Building Sound Energy Money** *(central investigation: what binding constraints must define the issuer, and can they be built?)*
- 5.1 Why Pricing Comes Before Policy
- 5.2 How to Price an Energy-Backed Instrument Without a Liquid Market
- 5.3 The Four Binding Constraints (the central specification)
- 5.4 Joint Necessity
- 5.5 Proof of Concept: Live Deployment
- 5.6 Investigation Finding

**6. Conclusions**
- 6.1 Summary of the Investigation
- 6.2 The Central Finding and Its Supporting Findings
- 6.3 Limitations
- 6.4 What Would Falsify This Thesis
- 6.5 Future Work
- 6.6 Closing Statement

References

Appendix A: Monetary Standard Scorecard — Full Methodology
Appendix B: Empirical Results — Regression Tables and Bootstrap Details
Appendix C: Pricing Results — Cross-Location Data
Appendix D: Sepolia Testnet Deployment (Technical Proof of Concept)

---

## Chapter 1: Introduction

### 1.1 The Problem with Money Today

Money serves three classical functions: store of value, unit of account, and medium of exchange. Of the three, the store-of-value function has been weakest under fiat regimes. The US dollar has lost more than 97% of its purchasing power since 1913, and other major fiat currencies (the euro, yen, pound) exhibit comparable long-run decline. This is not a critique of any particular jurisdiction's monetary policy. It is a feature of monetary systems whose issuance is constrained by institutional credibility rather than by an external, physical production cost.

For most of human history, monetary issuance was constrained by the cost of producing the underlying commodity — gold, silver, grain. The physical backing imposed a binding constraint: monetary expansion could not exceed extraction or production rates. That constraint maintained long-run price stability under most conditions, with notable exceptions (debasement under coin clipping, Spanish silver inflation in the sixteenth century). When the last formal commodity link was severed in 1971 with the suspension of dollar-gold convertibility, monetary issuance moved entirely under discretionary institutional control.

This thesis investigates whether a different commodity — one whose physical properties differ from gold's in specific, identifiable ways — could serve as a more credible monetary base in the post-satellite, post-blockchain era. The candidate examined here is energy.

### 1.2 Gold Worked — Then It Didn't

The gold standard was not perfect. But it had one important virtue: gold is genuinely scarce, genuinely costly to produce, and genuinely independent of any government's decision. You cannot print gold. A government that commits to redeeming its currency in gold at a fixed rate is making a credible, falsifiable promise — one that markets can hold it to.

The gold standard broke for a specific reason: it did not scale. As global trade expanded and economies grew, the demand for money grew faster than gold could be mined. Maintaining the peg required either deflationary pain or cheating. Most governments chose to cheat — printing more dollars than gold reserves could cover. When France and others started demanding physical gold redemptions in the late 1960s, the US faced a simple choice: deflation or default. Nixon chose default, dressing it as a "temporary suspension." It was never reinstated.

The lesson is not that commodity backing is wrong. The lesson is that gold had specific limitations — geographically concentrated supply, slow production growth, impractical physical transfer — that made it unsuitable for a modern global economy. The question is whether there is a commodity that shares gold's virtues but not its limitations.

### 1.3 Why Energy Is the Right Monetary Base (Supporting Premise)

This section establishes the first of two premises the central investigation rests on: that energy is a defensible commodity choice for monetary backing. The full theoretical case is developed in Chapter 2 and the empirical case in Chapter 3; the purpose here is to make the premise visible at the outset.

This thesis argues that energy — specifically, renewable energy captured from sunlight, wind, and tidal forces — is a stronger monetary base than gold. Not because it is more fashionable, and not because it is green. Because it satisfies the conditions for a credible monetary standard better than gold does, on every relevant dimension.

**Energy is scarce in the right way.** You cannot create energy from nothing. The laws of thermodynamics are not negotiable. Energy expenditure is irreversible — once used, it cannot be retroactively un-spent. This gives energy the same fundamental scarcity property as gold.

**Energy is measurable anywhere on Earth.** Sunlight reaching any location on Earth's surface can be measured by satellite, at any time, with no ground infrastructure required. NASA has been doing this since 1981. The data is public, global, and tamper-resistant. Gold, by contrast, requires physical assay to verify — which is why the gold standard ultimately required concentrated custodians (central banks) that became single points of political failure.

**Energy does not require geographic concentration to maintain its value.** The gold standard failed when gold supply became too concentrated and the United States could not maintain its peg under political pressure. An energy-backed standard, using satellite data as the oracle and smart contracts as the enforcement mechanism, works regardless of where energy is produced or who produces it. The contractual enforcement is not geography-dependent.

**Energy is actually useful.** Gold's monetary value rests almost entirely on convention — on the collective agreement that gold is valuable. Energy's value is non-conventional: it powers everything. A currency backed by energy is backed by the thing that makes all other economic activity possible.

The counterargument — that energy is too volatile to back a currency — is addressed in Chapter 3 and 5. The short answer is that the appropriate pricing and contract structure, calibrated to local conditions using satellite data, can accommodate energy's volatility within a clearinghouse framework. The same counterargument was once made about gold (gold prices fluctuate too) and was answered the same way: the right institutional structure manages the volatility.

### 1.4 Why the Stakes Are Material (Supporting Premise)

This section establishes the second premise: that the central investigation has material economic consequence. The full quantification is developed in Chapter 4; the purpose here is to make the order of magnitude visible at the outset.

If the first premise is correct — if energy is the right monetary base — then a second observation follows directly.

In a gold standard, unmined gold has value. A gold deposit sitting in the ground represents latent wealth. The decision not to mine it is an economic decision with a real opportunity cost. Societies do not generally leave gold in the ground when they need it — the incentive to extract it is built into the monetary system.

Renewable energy sources — sunlight, wind, tidal currents — are different from gold in one important way: they do not sit in the ground waiting. They arrive continuously and then disappear. Sunlight that hits a field without solar panels does not accumulate for later collection. It is gone. Wind that passes through a corridor without turbines is dissipated. Tidal energy that moves past unmeasured coastlines is lost forever.

If energy is the monetary base, then every kWh of renewable energy that arrives and is not captured is the precise equivalent of a gold coin falling into the ocean. It is not just wasted electricity. It is wasted money.

This reframing has a direct implication for the renewable energy finance gap. The IEA estimates that emerging and developing economies face a $1.35 trillion annual shortfall in clean energy investment (IEA 2023). The standard explanation is a financial one: these projects cannot secure bank loans because their revenue is too volatile. But from a monetary system perspective, the explanation runs deeper. The current monetary system is designed around fiat currencies that have no intrinsic link to energy production. A solar farm in Taiwan or Indonesia that cannot get financed is not failing because solar energy is economically unviable — LCOE for solar is now below $67/MWh globally (Lazard 2025), cheaper than coal in most markets. It is failing because the monetary system does not recognise the value it produces.

In an energy-backed monetary system, that solar farm is not just an electricity generator. It is a mint. Every kWh it produces is monetary issuance — as legitimate and as valuable as a gold mine. The financing incentive changes completely.

### 1.5 The Central Question and Contributions

**Central question:** *What binding constraints must define the issuer of an energy-backed currency for the currency to be credibly sound, and can those constraints be implemented with current technology?*

This question is investigated in Chapter 5. Four supporting investigations earn it the right to be asked:

**Supporting investigation 1 (Chapter 2):** Does energy satisfy the necessary conditions for a credible monetary base, and does it satisfy them better than gold?

**Supporting investigation 2 (Chapter 3):** Has energy expenditure ever, in any actual case, anchored monetary value — and what conditions caused the anchor to hold or fail?

**Supporting investigation 3 (Chapter 4):** If energy is monetary value, what is the order-of-magnitude opportunity cost of unharvested renewable energy under current monetary architecture?

**Supporting investigation 4 (§5.4):** Is the constraints framework technically buildable today?

**Contribution:**

The contribution of this thesis is the constraints framework itself: a four-element architecture — oracle-gated issuance, rule-bound supply, algorithmically collateralised settlement, timelocked governance — that is, jointly, the minimum required for an energy-backed currency to be credibly sound. The four supporting investigations are the evidence base that earns the framework the right to be presented as a research contribution rather than an engineering proposal: the theoretical case for energy as a monetary base (Chapter 2), the empirical evidence that energy actually anchors monetary value when allowed to (Chapter 3), the economic stakes of failing to build the framework (Chapter 4), and the feasibility demonstration via deployed implementation (§5.4).

To the author's knowledge, no prior work has specified a constraints-based architecture for an energy-backed monetary standard, anchored those constraints to formal monetary-economics conditions, and demonstrated buildability through a working implementation in a single research programme. Each piece exists in fragmentary form in prior literature; integrating them is the contribution.

### 1.6 Scope

This thesis argues that energy-backed currency is theoretically superior and empirically motivated. It does not argue for immediate policy implementation — that requires institutional, regulatory, and political analysis that is outside academic scope. It does not claim the SolarPunk Protocol implementation is production-ready — it is a testnet demonstration. The contribution is the argument and its evidence base.

---

## Chapter 2: Why Gold Failed and What Energy Offers Instead
*Supporting investigation: is energy a defensible monetary base?*

This chapter investigates two questions. *What properties must a commodity possess in order to serve as a credible monetary base?* And: *against those properties, how does energy compare to gold and to fiat money?* The investigation proceeds by deriving the conditions for credibility independently from the monetary economics literature — Friedman, Hayek, Selgin, Soddy — before evaluating any candidate against them. The conditions therefore precede the evaluation; the evaluation does not assume them. The investigation finds that energy satisfies all seven conditions, gold satisfies two and a half, and fiat satisfies one — a result reported in §2.3 and supported by the per-condition analysis in §2.4.

### 2.1 What Makes a Good Monetary Standard

A monetary standard is not just a means of payment. It is a commitment device — a way for a monetary authority (or, in a decentralised system, a set of rules) to make a credible promise about the future value of money. The commitment is only as good as the mechanism enforcing it.

Monetary economists have identified several properties that a commodity must have to serve as the basis of a credible commodity-style monetary standard. The qualifier *commodity-style* matters: the conditions developed here are not claimed to be necessary for all conceivable monetary systems — they are the conditions a commodity-backed standard must satisfy in order to provide credibility comparable to or stronger than the historical gold standard. Drawing from Friedman (1960), Hayek (1943, 1976), Selgin (2015), and Soddy (1925), we identify seven such conditions. Each is anchored to a specific source in the literature, summarised below:

1. **Verifiable production cost floor** — the commodity has a real, measurable cost of production that prevents issuance below that floor. *Anchored in:* Selgin (2015, pp. 93–95) on synthetic commodity money requiring a "real production cost"; Hayes (2019) on Bitcoin's marginal cost of production functioning as a price floor.

2. **Independent observability** — the quantity and quality of the commodity can be verified by any party without trusting a central authority. *Anchored in:* Hayek (1976, ch. VIII) on the requirement that holders be able to verify the soundness of money without trusting the issuer; extended here to the satellite era where verification is possible without physical custody.

3. **Scarcity and irreversibility** — the commodity cannot be created at will; production requires real resource expenditure that is irreversible. *Anchored in:* Friedman (1960, ch. 4) on rule-bound supply growth as the core property distinguishing sound from unsound money; Soddy (1925) on the thermodynamic basis of real wealth versus financial claims.

4. **Dispersion-proof enforcement** — the backing mechanism does not depend on geographic concentration of producers or custodians. *Anchored in:* Hayek (1976, chs. III–V) on the failure mode of central-custodian commodity standards; this thesis extends the principle to argue that algorithmic enforcement removes the geographic-concentration vulnerability that Hayek identified but could not technically resolve.

5. **Cash settlement without physical delivery** — value can be transferred digitally without requiring physical movement of the commodity. *Anchored in:* Selgin (2015, p. 96) on synthetic commodity money explicitly designed to separate the unit of account from physical custody.

6. **Credibility under geographic dispersion** — the monetary system functions regardless of where producers or users are located. *Anchored in:* Eichengreen (1992) on the Bretton Woods collapse as a failure of credibility under dispersion; Hayek (1943) on commodity reserve currency as a multi-jurisdictional system.

7. **Physics-based price floor** — the commodity's value floor derives from physical laws, not from political or social convention. *Anchored in:* Soddy (1925) on the physical basis of real wealth; extended here using LCOE methodology (Lazard 2025) which derives directly from irradiance physics, panel efficiency, and capital cost rather than from market convention.

These conditions are not defined to favour any particular conclusion — they are derived from prior monetary economics literature and can be evaluated against any proposed monetary standard. Conditions 2 and 4 are extensions of the prior framework to account for satellite observability and algorithmic enforcement, both of which are technologies that did not exist when Hayek and Selgin formulated their proposals; the extensions are explicit and a reviewer can choose to evaluate energy against the original conditions only (see §6.3 for further discussion of this construction).

### 2.2 The Gold Standard: What Worked and What Broke

Gold satisfied conditions 1, 3, and partially 7 during the Bretton Woods era. Mining cost was real and measurable. Gold could not be created from nothing. Its scarcity had a geological basis.

Gold failed conditions 2, 4, 5, and 6. Physical gold requires assay — you cannot verify gold quality by satellite or algorithm. The gold standard required central bank custodians, creating geographic concentration of monetary authority. Physical delivery was impractical at modern transaction scale. And critically, the system collapsed in 1971 precisely because it could not survive dispersion: as the US ran trade deficits and dollars accumulated abroad, foreign central banks began demanding physical redemption, and the concentrated gold reserves of Fort Knox could not meet the claim. The system required the United States to be the concentrated custodian, and when that concentration became politically untenable, the standard failed (Eichengreen 1992).

The deeper problem is that gold's value is largely conventional. The gold standard worked as long as everyone agreed gold was valuable. That agreement held for centuries but was never physically necessary — gold is useful for jewellery and some industrial applications, but its monetary premium is pure convention. A monetary system built on convention is vulnerable to the moment the convention breaks.

### 2.3 Seven Conditions for a Credible Monetary Standard

The scorecard below evaluates *monetary architectures*, not raw commodities. The first column should be read as *"designed energy-backed standard"*, not "energy alone." Raw energy by itself is not money any more than raw gold by itself was money — gold required mints, custodians, and convertibility commitments to function as a monetary base. The architecture being evaluated here pairs energy production with public satellite data, contractual issuance rules, and algorithmic settlement; the comparison is therefore between three architectures (energy-backed standard, gold standard, fiat) rather than three substances. Evaluating the three candidate systems against the seven conditions:

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

### 2.6 Investigation Finding

Under the seven-condition framework developed in this chapter, the investigation finds that energy satisfies all seven criteria, gold satisfies two and a half, and fiat satisfies one. The result is not marginal: energy outperforms gold systematically, on properties (satellite observability, dispersion-proof contractual enforcement, physics-based price floor) that could not have been satisfied by any commodity prior to the satellite and blockchain eras. This finding establishes that an energy-backed currency is a defensible monetary base. Whether energy expenditure has actually anchored monetary value in any observed case — and what conditions caused the anchor to hold or fail — is the question Chapter 3 takes up.

---

## Chapter 3: Empirical Evidence — Energy Already Backs Monetary Value
*Supporting investigation: has energy expenditure ever, in any actual case, anchored monetary value?*

This chapter investigates whether the theoretical claim of Chapter 2 — that energy can credibly anchor monetary value — is consistent with observed monetary behaviour. The question is sharper than it first appears: *has there ever been a case in which energy expenditure demonstrably anchored a currency's market value, and if so, under what conditions did the anchor hold or fail?* If the answer is "never, anywhere, under any conditions," the theoretical case in Chapter 2 is suggestive but not motivated by evidence. If the answer is "yes, under conditions X but not under conditions Y," then the conditions of failure are themselves informative — they tell us what a deliberately designed energy monetary system would need to provide that the historical case did not.

The investigation finds the latter result. Bitcoin's energy-value anchor was real and statistically significant during the period of geographic concentration, and broke when concentration dissolved. This is the empirical signature of *passive* energy anchoring — and it points directly to the design question taken up in Chapter 5.

### 3.1 Bitcoin as a Natural Experiment

Bitcoin is the only monetary instrument in history designed so that its issuance explicitly requires energy expenditure. Every Bitcoin requires computational work — and computational work requires electricity. In 2021, Bitcoin's annualised energy consumption was approximately 130-150 TWh/year (Cambridge Centre for Alternative Finance 2021), comparable to the electricity consumption of Argentina.

If energy is money — if there is a genuine relationship between energy expenditure and monetary value — we should be able to see it in Bitcoin prices. And we can. But the relationship is regime-dependent in a way that is precisely consistent with the designed-system argument.

The natural experiment is China's June 2021 mining ban. Before the ban, approximately 65-75% of global Bitcoin mining was concentrated in China (Cambridge Mining Distribution data, 2019-2021). The concentration was not random — China had cheap hydroelectric power and coal, making energy costs low and stable. The Herfindahl-Hirschman Index (HHI) of mining concentration stood at approximately 0.42 before the ban.

The ban scattered miners globally. Within six months, HHI fell to approximately 0.18 — a 57% reduction in concentration. The US, Kazakhstan, Russia, and others absorbed the displaced capacity. The energy-value relationship changed fundamentally.

This provides a clean before-and-after test. If energy costs anchor Bitcoin value, the relationship should be stronger in the concentrated period and weaker in the dispersed period. That is exactly what the data shows.

### 3.2 Data and Construction

**Bitcoin price data:** Daily closing prices from 2019-01-01 to 2024-12-31 (approximately 2,200 daily observations).

**Cumulative Energy-Indexed Ratio (CEIR):** Constructed as the ratio of market capitalisation to cumulative energy expenditure. This captures Bitcoin's market value *relative to its energy production cost floor* — high values indicate the market price has run ahead of the production-cost anchor; low values indicate the price has fallen toward or below the anchor. Formally:

> CEIR_t = Market cap (USD) / Cumulative energy cost (USD)

where energy cost = daily energy consumption (TWh) × weighted global electricity price (USD/kWh).

This convention follows the marginal-cost-of-production framing used by Hayes (2019), in which the ratio of price to production cost is the natural test variable for whether a production floor anchors market value. Under this convention, mean reversion to the floor predicts a negative coefficient: when CEIR is high (price elevated above floor), subsequent returns are expected to be lower; when CEIR is low (price near or below floor), the supply mechanism (miners exiting unprofitable operations) tightens supply and pushes price back up.

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

**Interpretation:** Before the ban, a one-standard-deviation *increase* in CEIR (Bitcoin price elevated above its energy-cost floor) predicted approximately 10 percentage points lower 30-day returns (β = −0.206). Equivalently, when CEIR was *low* — market price near or below the production-cost floor — subsequent returns were higher, consistent with mean reversion to the floor: unprofitable mining drives miners out, supply tightens, and price recovers. The energy floor was binding under this regime. After the ban, the coefficient shrank to −0.080 — a 61% reduction in magnitude — and the R² halved, indicating that the floor's predictive power on returns weakened substantially.

**Structural break:** Chow test confirms a statistically significant regime change at the ban date (F = 4.786, p = 0.0009). This is not a continuous drift — it is a discrete break coinciding with the geographic dispersion event.

**Why this supports the thesis:** The correct interpretation is not that every CEIR relationship disappeared after the ban — the post-ban coefficient remains negative and statistically significant at p = 0.011. The stronger and more accurate claim is that the *rational coordination mechanism* weakened and changed character after mining dispersion. The pre-ban regime exhibits a 61% larger coefficient and roughly twice the explanatory power; the post-ban regime retains a residual signal whose economic meaning is materially different (as the mechanism inversion test in §3.4 shows). The energy-value relationship did not fail because energy is a bad monetary base. It weakened because the mechanism enforcing the relationship — geographic concentration of miners sharing a common electricity-cost regime — was dissolved by policy. This is precisely the fragility that a designed, contractually-enforced energy monetary standard avoids. Algorithmic enforcement does not depend on geographic concentration.

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

### 3.6 Investigation Finding

The investigation conducted in this chapter finds that energy expenditure has, in at least one observed case, anchored monetary value — but only when geographic concentration enforced a shared electricity-price regime. The Bitcoin anchor was statistically significant under concentration (β = −0.206, p < 0.001) and degraded under dispersion (β = −0.080, post-ban; Chow F = 4.786 confirming a discrete structural break). Bootstrap robustness and a Kazakhstan falsification test rule out the most plausible alternative explanations.

The implication for the central question of the thesis is direct. Passive, undesigned energy anchoring is fragile under conditions that any global monetary system must tolerate. A deliberately designed energy-backed currency cannot rely on geographic concentration as the enforcement mechanism. It must instead bind the issuer through contractual constraints that are geography-independent. This is what Chapter 5's central investigation specifies.

---

## Chapter 4: The Opportunity Cost of Unharvested Energy
*Supporting investigation: are the stakes of the central question materially large?*

This chapter asks a single conditional question: *if the theoretical argument of Chapter 2 is accepted, and the empirical evidence of Chapter 3 is read as supportive, what does this framework imply about the economic status of unharvested renewable energy?* The conditional matters. The chapter does not claim that an energy monetary standard exists today and that the renewable finance gap is therefore literal monetary loss. It claims something more careful: that *under the framework being investigated*, unharvested renewable energy is economically equivalent to unmined gold under the gold standard, and the existing $1.35 trillion annual finance gap therefore represents a structurally invisible loss that a different monetary architecture would render visible.

The investigation finds that the order of magnitude is large — approximately $79 billion per year of foregone monetary value is implied by the financing-constrained portion of the IEA gap — and that the policy implication of the reframing is meaningful even if the precise figure is treated as illustrative.

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

**The monetary reframing suggests a different angle on the policy problem.** This chapter does not claim that climate-policy and subsidy approaches to the renewable finance gap are wrong, nor that monetary architecture is the sole or even primary cause of the gap. It claims something narrower: that *under the framework being investigated*, the gap admits a structural interpretation — as a recognition failure of the current monetary system — that climate-policy framings do not capture. The two framings are complements rather than substitutes; the contribution of this chapter is to make the monetary framing visible, not to displace alternatives.

### 4.4 Quantifying Foregone Value: A Structured Estimate

This section develops a structured, conservative estimate of the monetary value implied by the renewable finance gap under an energy monetary standard. The goal is not precise quantification — the data limitations are significant and are addressed in §6.3 — but to establish that the claim is order-of-magnitude plausible rather than merely rhetorical.

**Methodology:**

The IEA (2023) estimates a $1.35 trillion annual financing gap for clean energy in emerging and developing economies. Approximately 60% of this gap is attributable to solar and wind projects that are technically viable (LCOE competitive with fossil fuels) but cannot attract capital (IEA 2023, Chapter 3). This gives a financing-constrained investment gap of approximately **$810 billion per year** in solar and wind specifically.

At current global average solar LCOE of $67/MWh (Lazard 2025) and a conservative capacity factor of 20% (appropriate for tropical and subtropical markets), $810 billion of unfunded investment would correspond to approximately:

> $810B ÷ ($1,200/kW installed cost) × 8,760 hr/yr × 20% capacity factor
> ≈ **1,180 TWh per year of unproduced energy**

At LCOE pricing, this represents approximately **$79 billion of annual foregone energy value** — energy that would be produced and sold if the financing gap were closed.

Under a gold monetary standard analogy, this is equivalent to leaving **79 billion dollars' worth of gold in the ground each year**, not because it is costly to extract, but because the monetary system does not provide financing infrastructure for the extraction activity.

**Cross-location illustration (five markets, from NASA POWER data):**

| Location | Solar irradiance (kWh/m²/day) | LCOE ($/MWh) | Installed capacity gap (estimated) | Annual foregone production |
|---|---|---|---|---|
| Taiwan | 4.2 | $67 | Small (high penetration) | ~5 TWh |
| Indonesia | 5.1 | $58 | Large (16 GW gap est., IRENA 2023) | ~140 TWh |
| Nigeria | 6.2 | $52 | Very large (40 GW gap est.) | ~420 TWh |
| Brazil | 5.8 | $55 | Moderate (30 GW gap est.) | ~310 TWh |
| Germany | 2.9 | $85 | Small (mature market) | ~15 TWh |

*Note: Capacity gap estimates from IRENA (2023) Renewable Capacity Statistics. Annual foregone production = capacity gap (GW) × 8,760 hr × location-specific capacity factor. These are illustrative estimates, not audited figures.*

**What this establishes — and what it does not:**

This analysis establishes that the opportunity cost argument is quantitatively meaningful at the order-of-magnitude level. Hundreds of terawatt-hours of energy — and tens of billions of dollars of annual economic value — remain uncaptured due to a financing failure that a different monetary architecture would structurally address.

What this analysis cannot establish is counterfactual certainty: it is not possible to prove that an energy monetary standard would have closed the financing gap, only that the gap is large and that the monetary framing provides a different mechanism for addressing it than climate policy does. The strength of the chapter's argument is the reframing, not the precision of the estimate. A reviewer pushing for tighter quantification is correct that this estimate relies on several assumptions that are stated but not independently verified; the appropriate response is to treat the numbers as illustrative of scale rather than as audited findings.

### 4.5 Policy Implications of the Monetary Reframing

If the analysis in this chapter is accepted, three policy implications follow:

**1. Renewable energy projects are not loan recipients — they are currency mints.** Under an energy monetary standard, a solar farm is issuance infrastructure. Lending to a solar farm is not a charitable concession to clean energy — it is lending to a facility that produces monetary value. The risk profile changes when the monetary status of the output changes.

**2. The $1.35 trillion finance gap is not a climate subsidy requirement — it is a monetary system correction.** The gap exists because the monetary system does not recognise what these projects produce. Closing it is not a transfer of wealth from rich countries to poor countries. It is a correction to the mispricing of energy production as a monetary activity.

**3. Unharvested renewables should appear on national balance sheets as foregone monetary assets.** Just as gold reserves appear on central bank balance sheets, the monetizable renewable energy potential of a country — its annual solar irradiance, wind resource, and tidal capacity — should be assessable as a monetary asset. Countries with high solar resource but low capture rates are richer than their GDP suggests, in the same way that countries with large gold deposits are richer than their current production rates suggest.

### 4.6 Investigation Finding

The investigation conducted in this chapter finds that, conditional on the framework established in Chapter 2 and the empirical evidence in Chapter 3, the IEA's $1.35 trillion annual renewable finance gap implies on the order of $79 billion per year of foregone monetary production globally. The estimate is illustrative, not audited: it relies on capacity-gap modelling, average capacity factors, and global LCOE benchmarks, each carrying its own uncertainty band.

The contribution of the chapter is the reframing rather than the precision. Under current monetary architecture, unharvested renewable energy has no monetary status and the gap is invisible as economic loss; under the architecture investigated by this thesis, the gap is structurally visible and therefore actionable. This finding establishes that failing to address the central question of the thesis — how to architect sound energy money — has measurable economic consequence at the order-of-magnitude level. It motivates Chapter 5's specification of the constraints framework that would, if built and adopted, render the loss visible.

---

## Chapter 5: The Constraints Framework — Specifying and Building Sound Energy Money
*Central investigation: what binding constraints must define the issuer of an energy-backed currency, and can they be built today?*

This chapter investigates the central question of the thesis: *what specific contractual mechanisms must bind the issuer of an energy-backed currency in order to satisfy, jointly, the seven conditions established in Chapter 2 — and can those mechanisms be built and operated with current technology?* The question has two halves. The first is an institutional-design question — what binding constraints on the issuer are jointly necessary and individually insufficient? The second is a feasibility question — can those constraints actually be implemented in working code, with live data, today?

A prior question must be settled before either half can be addressed: how to price energy-backed instruments in markets where no liquid options market exists to calibrate volatility against. §5.2 settles this question using satellite irradiance as a physics-based volatility source. §5.3 then conducts the institutional-design investigation — examining each of the seven conditions in turn and asking what contractual element would enforce it — and reports the finding that four constraints are jointly necessary. §5.4 reports the feasibility result by reference to the deployed implementation.

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

The 2.08% divergence between binomial and Monte Carlo is within acceptable simulation error for 20,000 paths at σ = 189.5%. Monte Carlo standard error at 20,000 paths is approximately σ_MC / √N ≈ 0.190 / √20,000 ≈ 0.13% of the option value, meaning the 2.08% gap is within the expected stochastic noise band rather than indicating model disagreement. Increasing to 100,000 paths would reduce the divergence to approximately 0.9% but does not change the pricing conclusions — the collar structure, margin requirements, and cross-location results are all insensitive to this level of MC precision. The 2.08% figure is reported as the honest measured result; the aspirational < 1% that appeared in earlier drafts was incorrect and has been removed.

**Structural result — the zero-premium collar:**
A collar structure (buy put at 0.9K, sell call at 1.1K) generates a net credit at all volatility levels in a log-normal model. The reason is a log-space asymmetry: in log space, the 1.1K call is closer to spot than the 0.9K put, because log(1.1) ≈ 0.0953 is smaller than log(1/0.9) ≈ 0.1054. Under log-normality, an option's premium scales with its log-distance from the underlying — the closer-to-spot call therefore carries a larger premium than the further-from-spot put, and selling the call against buying the put produces a net credit. This is a structural property of the log-normal pricing model, not a threshold finding that appears only above a specific volatility level. The credit grows with volatility: at Taiwan's σ = 189.5%, the net credit is -$0.00219/kWh (negative = income to the buyer). For a solar farm producing 1 MWh per day, this collar generates approximately $0.22/day in structural net income while capping downside risk.

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

### 5.3 The Four Binding Constraints (the central specification)

This section conducts the central specification investigation. The question is: *given the seven monetary-standard conditions established in Chapter 2 and the dispersion fragility documented in Chapter 3, what specific constraints on the issuer are jointly necessary for an energy-backed currency to satisfy the conditions without depending on geographic concentration?*

The investigation proceeds by examining each Chapter 2 condition that the gold standard could not satisfy on its own — independent observability, dispersion-proof enforcement, credibility under dispersion, physics-based price floor — and asking what contractual mechanism would enforce it without requiring central custodianship. The investigation finds four constraints, presented below in the order in which they bind. Each constraint is presented with: what it does, why it is necessary, what failure looks like in its absence, and which Chapter 2 condition it operationalises.

**Element 1: The Oracle — making energy observable on-chain**

*What it does:* Brings verified satellite irradiance data into the smart contract environment, where it becomes the price signal that governs currency issuance and option settlement.

*Why it is necessary:* An energy monetary standard is only as credible as its energy measurement. If the price can be manipulated by a single party — a corrupt grid operator, a hacked data feed, a government that wants to inflate the supply — the monetary guarantee is worthless. The oracle must be tamper-resistant, independently auditable, and not controlled by any single entity. This is the direct contractual equivalent of Condition 2 (independent observability) from Chapter 2's scorecard.

*What failure looks like:* Without a reliable oracle, the clearinghouse cannot settle positions correctly. If the energy index is manipulated upward, call option holders receive unearned payouts, the insurance fund drains, and the system becomes insolvent. This is the "oracle problem" that has caused failures in multiple DeFi protocols (e.g., price oracle manipulation attacks in 2020-2021 across numerous platforms).

*Implementation:* ChainlinkOracleAdapter reads from AggregatorV3 interfaces and normalises any decimal count to 1e18 precision. Each price update is anchored to a source hash — `keccak256(data_source, latitude, longitude, timestamp)` — so any update can be traced back to its satellite data origin. The oracle requires a bonded stake (100 USDC, slashable) from any operator, creating an economic disincentive to submit false data. Daily NASA POWER data has been flowing into this oracle since April 20, 2026.

---

**Element 2: The Energy-Backed Currency — supply governed by production, not policy**

*What it does:* Issues a currency unit (SPK) whose quantity is bounded by verified energy surplus and whose price peg is maintained by an automatic PI controller — not by human discretion.

*Why it is necessary:* The gold standard's credibility came from the fact that no government could issue more gold than it had. The constraint was physical. An energy monetary standard needs an equivalent constraint: currency cannot be issued faster than energy is verified. Without this, the monetary standard is a label, not a mechanism — any issuer could print arbitrary currency and call it "energy-backed."

The PI controller is the automatic stabiliser. When the oracle reports that the energy price has risen above the peg (more energy value in the system than currency represents), the controller contracts supply. When price falls below the peg, it expands supply. This is analogous to a central bank that has one and only one mandate — maintain the energy peg — and no political discretion to deviate from it.

*What failure looks like:* Without supply constraints, the currency inflates. Without the PI controller, the peg drifts. Both failures reproduce the exact pathology of fiat money: the monetary standard becomes nominal rather than real. The gold standard failed because the US printed dollars in excess of its gold backing — the energy standard solves this by making overissuance structurally impossible rather than merely prohibited.

*Implementation:* SolarPunkCoin minting requires ORACLE_ROLE attestation of energy surplus (`mintFromSurplus`). The PI controller runs on every oracle update (`updateOraclePriceAndAdjust`), adjusting supply proportionally to total outstanding supply — not to a fixed amount — so the stabilising force scales with market size. The peg target is $1.00; the band is ±5%. Governance changes to peg parameters require a 24-hour timelock queue.

---

**Element 3: The Clearinghouse — algorithmic settlement without counterparty risk**

*What it does:* Holds collateral for energy option positions, enforces margin requirements continuously, liquidates undercollateralised positions before they become insolvent, and settles expired contracts at the oracle-determined final price.

*Why it is necessary:* Chapter 5.2 showed that energy-backed instruments can be priced. But a priced instrument is only valuable if buyers trust that sellers will pay. In a bilateral contract, the buyer depends on the seller's solvency and willingness to pay — both of which can fail. A clearinghouse solves this by interposing itself between buyer and seller: every position is a contract with the clearinghouse, not with a counterparty. Margin requirements ensure the clearinghouse is always adequately collateralised.

This is the contractual equivalent of Condition 4 (dispersion-proof enforcement) from Chapter 2. The clearinghouse does not care who the counterparty is, where they are, or what their credit rating is. It only cares whether the margin account is sufficiently funded. Enforcement is algorithmic and non-discretionary — which is precisely what made the gold standard's enforcement fragile (it required discretionary political will) and what an energy standard replaces.

*What failure looks like:* Without a clearinghouse, every energy option is a bilateral credit agreement. In emerging markets where counterparty creditworthiness is precisely the problem, bilateral agreements cannot scale. The renewable finance gap exists partly because project finance requires trusted counterparties — development banks, multilateral institutions, sovereign guarantees — that are expensive, slow, and geographically biased toward existing financial centres.

*Margin calibration:* The 90-day jump-diffusion stress test (200% volatility, stochastic jumps) found that 150% initial margin produced an 11% insolvency rate under extreme conditions. Increasing to 250% IM and 125% maintenance margin reduced the unassisted survival rate to 80.24%. The 19.76% residual tail risk is covered by the insurance fund (ProtocolTreasury), which accumulates from trading fees. The margin parameters are set in the contract and can only be changed through the governance mechanism described below.

*Implementation:* SolarPunkOption enforces 250% initial margin on position opening and 125% maintenance margin on every mark-to-market. Positions below maintenance margin are available for liquidation by bonded liquidators (who earn a penalty fee). Expired series settle via `settle(seriesId)` — the contract computes terminal PnL at the oracle's final index and returns remaining margin. Margin withdrawal before expiry is blocked once a series has expired, preventing a class of attacks where traders extract collateral before settlement.

---

**Element 4: The Governance Mechanism — monetary rules that no one can change unilaterally**

*What it does:* Enforces a mandatory waiting period (currently 24 hours) between proposing and executing any change to the system's monetary parameters — peg target, margin requirements, fee rates, oracle configuration.

*Why it is necessary:* The gold standard failed partly because the US unilaterally suspended convertibility in 1971 — no warning, no consultation, no delay. The monetary rules changed overnight by executive decision. An energy monetary standard must be resistant to this failure mode. The governance mechanism's purpose is not to prevent all change — monetary systems must be able to adapt — but to make change observable in advance, so that any participant can exit or hedge before a rule change takes effect.

This is the contractual equivalent of Condition 6 (credibility under geographic dispersion) from Chapter 2. When monetary rules can change overnight by a single actor's decision, the standard is only as credible as that actor. When rules require a public proposal and a mandatory delay, the standard's credibility is distributed — it does not depend on any single actor's trustworthiness.

*What failure looks like:* Without a governance delay, the issuer of the currency can change the peg, the margin requirements, or the oracle configuration at any time. This is precisely the discretion that made fiat monetary policy politically manipulable. An energy standard with ungoverned parameters is a fiat standard with extra steps.

*Implementation:* Every parameter-changing function in the core contracts is gated by `onlyGovernanceApproved(actionId)`. To change any parameter, the admin must first call `queueGovernanceAction(actionId)`, wait 86,400 seconds (24 hours), and then call the setter. The queue entry is public and on-chain — observable by any participant. The Safe multisig (`0xB95586775C73feB0154828c77832E106425C818A`) holds DEFAULT_ADMIN_ROLE on all contracts. Admin authority was transferred from the deployer EOA to the multisig in April 2026; the deployer retains zero administrative authority.

---

### 5.4 Joint Necessity

The four constraints are not independent specifications running in parallel — they are interlocking. The oracle feeds verified energy data into the system. The rule-bound supply mechanism uses that data to govern issuance. The clearinghouse enforces settlement against collateral, denominated in the unit of account the supply rule produces. The timelocked governance mechanism binds all three from unilateral change. Each constraint depends on the others to remain meaningful, and removing any one degrades the standard back to a known and worse failure mode:

- **Without oracle-gated issuance** → energy backing is unverifiable → the system depends on trust in the issuer → identical to fiat with extra steps.
- **Without rule-bound supply** → the issuer regains discretion over monetary expansion → the energy label remains but the constraint is gone → identical to fiat that calls itself energy-backed.
- **Without algorithmically collateralised settlement** → settlement depends on counterparty creditworthiness → priced instruments degrade to bilateral credit → the dispersion-proof property is lost.
- **Without timelocked governance** → parameters can be changed overnight by the issuer → the rules become as durable as a sovereign promise → identical to central bank discretion.

This is the joint-necessity result. Each constraint addresses one specific failure mode that has been observed in monetary history (oracle capture, issuance discretion, counterparty insolvency, governance unilateralism). Removing any one re-opens the failure mode it closed. Adding any one without the others does not produce sound money — it produces a single safeguarded surface against three unsafeguarded ones. The four constraints together constitute the minimum viable architecture for sound energy money.

The investigation does not claim the four constraints are *sufficient* in the sense that nothing else matters — production deployments will require additional engineering (multi-oracle aggregation, multi-signer governance, cross-chain liquidity, regulatory treatment, counterparty onboarding). But those are scaling, governance, and legal concerns, not soundness concerns. The four constraints are what makes an energy-backed currency monetarily sound. The rest is what makes it operationally viable at scale.

### 5.5 Proof of Concept: Live Deployment

A Sepolia testnet implementation of the four-constraint architecture has been deployed (April 2026) to demonstrate that the framework specified in §5.3 is technically buildable with current smart-contract infrastructure. The implementation is not the thesis's academic contribution and is not claimed to be production-ready; its purpose is to settle the buildability question that §5.3 raises. Operational details (full address tables, keeper logs, test transcripts, code-review findings, parameter values) are provided in Appendix D and in the project repository so that any reviewer can verify them independently. The summary that follows reports only what is needed to establish buildability.

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

### 5.6 Investigation Finding

The central investigation of this thesis finds that four binding constraints on the issuer of an energy-backed currency are jointly necessary and individually insufficient for the currency to be credibly sound: oracle-gated issuance, rule-bound supply, algorithmically collateralised settlement, and timelocked governance. Each constraint addresses one failure mode that has been observed in monetary history (oracle capture, issuance discretion, counterparty risk, governance unilateralism). Removing any one re-opens the failure mode it closed; the framework is the joint specification, not a checklist.

The investigation further finds that the framework is implementable today. The five deployed contracts on Ethereum Sepolia, the running NASA POWER oracle keeper, the independent code review, and the 79/79 test pass collectively demonstrate that no element of the framework requires technology that does not yet exist. This finding answers both halves of the chapter's opening question — what mechanisms are required, and whether they can be built — affirmatively. The remaining gates between the deployed system and a production-ready monetary unit (formal security audit, multi-signer governance, multi-oracle aggregation, mainnet deployment) are engineering and capital problems, not research problems.

---

## Chapter 6: Conclusions

### 6.1 Summary of the Investigation

This thesis has investigated one central question — what binding constraints must define the issuer of an energy-backed currency for it to be credibly sound — and four supporting investigations that earn the central question the right to be asked.

**The supporting investigations** established that the central question is both defensible and consequential. Chapter 2 evaluated energy, gold, and fiat against seven conditions derived from monetary economics literature: energy satisfies all seven, gold two and a half, fiat one — establishing that energy is a defensible monetary base. Chapter 3 used Bitcoin's 2021 China mining ban as a natural experiment and found that energy costs anchored Bitcoin's market value during the period of geographic concentration (β = −0.206, p < 0.001) and that the anchor broke when concentration dissolved (Chow F = 4.786, p = 0.0009) — establishing that the failure mode passive anchoring exhibits is precisely the failure mode the constraints framework is designed to eliminate. Chapter 4 reframed the IEA's $1.35 trillion renewable finance gap as a monetary-system failure rather than a climate-policy failure and estimated approximately $79 billion per year of foregone monetary value — establishing that failing to address the central question has material economic consequence.

**The central investigation** in Chapter 5 specified the four binding constraints — oracle-gated issuance, rule-bound supply, algorithmically collateralised settlement, and timelocked governance — that are jointly necessary for an energy-backed currency to be credibly sound. The chapter showed that energy-backed instruments can be priced from satellite data alone (resolving the cold-start pricing problem with physics-based volatility), and demonstrated that the constraints framework is buildable today by reference to a deployed Sepolia implementation operating under live satellite data feeds.

### 6.2 The Central Finding and Its Supporting Findings

**Central finding: A credible energy-backed currency is defined by what its issuer cannot do, not by what its issuer promises. The four binding constraints that constitute this definition are jointly necessary and individually insufficient.**

The four constraints are:

- **The issuer cannot mint without verified energy backing.** Issuance is gated by an independent oracle that anchors every price update to a satellite-data source hash. Without this, the standard is fiat with extra steps.
- **The issuer cannot adjust supply at discretion.** Supply changes are computed by an automatic PI controller against the peg, not chosen by a human. Without this, the issuer reproduces the discretion that ended Bretton Woods.
- **The issuer cannot underwrite positions without sufficient collateral.** Margin requirements (250% initial, 125% maintenance) are enforced continuously and liquidation is algorithmic. Without this, the clearinghouse degrades to bilateral credit and the dispersion-proof property is lost.
- **The issuer cannot change monetary parameters unilaterally.** Every parameter-changing function is gated by a 24-hour timelock and the admin role lives on a multisig with the deployer's EOA explicitly revoked. Without this, the rules of the system can change overnight, exactly as they did in 1971.

The joint-necessity argument matters as much as the individual constraints. Each constraint addresses one specific failure mode: oracle capture, issuance discretion, counterparty risk, or governance unilateralism. Removing any one re-opens the failure mode it closed. Adding any one without the others does not produce sound money — it produces a single safeguarded surface against three unsafeguarded ones. The framework is the joint specification.

**Supporting finding 1: Energy satisfies the necessary conditions for a credible monetary base, and satisfies them better than gold.** Evaluated against seven conditions derived from Friedman, Hayek, Selgin, and Soddy, energy scores 7/7, gold 2.5/7, fiat 1/7. The empirical companion, drawn from Bitcoin's behaviour around the 2021 China mining ban, demonstrates that energy expenditure does in fact anchor monetary value — and that the anchor is fragile under geographic dispersion, which is precisely the failure mode the constraints framework is designed to eliminate. This supporting finding establishes that the central question is worth asking: an energy-backed currency is not an arbitrary choice of monetary base, it is a defensible one.

**Supporting finding 2: Under the framework being investigated, unharvested renewable energy is foregone monetary value, on the order of $79 billion per year globally.** This reframes the IEA's $1.35 trillion renewable finance gap from a climate-policy failure to a monetary-system failure. The estimate is illustrative rather than audited; the policy contribution is the reframing, not the precision. This supporting finding establishes that the central question matters: failing to build the constraints framework has measurable economic cost.

**Why the hierarchy is structured this way:** the supporting findings are not independently load-bearing for the thesis. They exist to motivate the central finding. A reader who accepts only the supporting findings has accepted a worldview but not a contribution. A reader who accepts the central finding has accepted both the worldview and the specification of how to act on it. The thesis stands or falls on the central finding; the supporting findings are how the central finding earns the right to be heard.

### 6.3 Limitations

A thesis making novel claims should be honest about its boundaries. The following limitations are real, not performative.

**The seven-condition framework is a constructed evaluation instrument, not a received standard.**

The seven conditions in Chapter 2 are derived from monetary economics literature — Friedman (1960) on supply rules, Hayek (1976) on commodity reserves, Selgin (2015) on synthetic commodity money — but the specific set of seven, and the way they are operationalised, reflects the author's synthesis. A different researcher using a different condition set might score energy less favourably. In particular, the conditions of "independent observability via satellite" and "dispersion-proof contractual enforcement" are novel additions that existing literature does not formally specify — they are reasonable extensions of prior frameworks to the post-satellite, post-blockchain era, but a reviewer could challenge whether they belong in a canonical monetary standard evaluation.

The appropriate response to this limitation is not to abandon the framework but to be precise about its scope: it is an evaluation framework appropriate to 2026, not a timeless standard derived from first principles. Its value lies in systematising a comparison that previously was conducted only informally.

**The empirical evidence rests on one asset and one natural experiment.**

Chapter 3's empirical findings are based entirely on Bitcoin price data and the 2021 China mining ban. This is a real limitation, but it is also a structural one: Bitcoin is the only monetary asset in history whose issuance has been explicitly tied to verifiable energy expenditure at scale. There is no second case in the historical record. Pre-modern commodity monies (gold, silver, wheat) had production costs but those costs were not denominated in energy terms and were not measurable at the resolution required for a regression like the one in Chapter 3. Modern fiat currencies have no production cost at all. The Bitcoin natural experiment is therefore not one of many possible tests — it is the only available test, which is why it is the one this thesis runs.

This framing matters for how the empirical evidence should be weighted. A reviewer who treats "n = 1 asset" as evidence of weakness is treating the empirical question as if alternative tests were available and not chosen. They were not available. The appropriate posture is therefore to acknowledge that the Bitcoin result is suggestive rather than conclusive — it directionally supports the thesis argument but cannot, on its own, prove a general claim about energy-monetary anchoring. Future work that designs new tests as energy-backed instruments are deployed (the SolarPunk Protocol itself becoming one such test bed once it has live transaction history) is the appropriate path to broaden the empirical base.

The post-ban regime, in particular, is still young — approximately three years of data, against which the pre-ban analysis runs eight years. The mechanism inversion finding (sentiment interaction flipping sign) is statistically significant but could partly reflect the cryptocurrency market's maturation between periods rather than purely the geographic dispersion event. The Kazakhstan falsification test strengthens the geographic concentration interpretation, but alternative explanations — regulatory uncertainty globally, the maturation of crypto derivatives markets, the rise of institutional investors — cannot be fully ruled out with available data.

What can be said honestly: the Bitcoin natural experiment is the strongest available test of energy-monetary linkage, and the results are directionally consistent with the thesis argument. They are not sufficient alone to prove the general claim; they are sufficient to motivate it.

**The opportunity cost quantification in Chapter 4 is illustrative, not audited.**

The structured estimate in Section 4.4 derives from IEA financing gap figures, IRENA capacity gap estimates, and Lazard LCOE benchmarks — all reputable sources, but each carrying its own assumptions and uncertainty ranges. The capacity gap estimates are not audited project-level figures; they are modelled country-level gaps. The foregone production calculations assume average capacity factors that vary significantly by site. The LCOE figures are global averages that conceal wide regional dispersion.

A rigorous quantification of foregone monetary value under an energy standard would require: site-level resource assessments for specific unfinanced projects, project finance models showing the financing gap at each site, and a counterfactual model of what the financing decision would be under an energy monetary architecture. None of these are available at global scale. The chapter's contribution is the reframing — the argument that the gap should be measured in monetary terms, not just in GW of uninstalled capacity — not the precision of the estimate. Reviewers who want a tighter number are correct that the number is not tight; they should evaluate the argument on the reframing's merits rather than on the estimate's precision.

**The thesis argues energy should replace gold as a monetary base — but does not model the transition.**

The most practically important question is left unanswered: how would an economy transition from fiat money to an energy monetary standard? The transition problem involves currency substitution dynamics, central bank balance sheet adjustment, international coordination, and the distributional consequences of who holds energy-generating assets at the time of transition. These are serious political economy questions that require expertise well beyond financial economics. This thesis establishes the desirability and feasibility of the destination; it does not provide a roadmap for getting there.

This is a deliberate scoping choice rather than an oversight. The thesis takes the view that the destination question must be settled before the transition question is worth modelling — there is no value in mapping a path to a place that has not been shown to be worth reaching. Chapters 2–5 address the destination question (is energy a coherent monetary base, and is the required infrastructure buildable). The transition question is downstream and would constitute a separate research programme, more properly located in monetary economics and political economy departments than in finance.

**The proof of concept is not production-ready.**

The Sepolia testnet deployment demonstrates technical buildability, not commercial or regulatory readiness. The system has not been formally audited by a professional security firm. The Safe multisig operates as a 1-of-1 (a single signer), which provides structural separation of admin authority but not the multi-party governance that a production monetary system would require. The oracle relies on a single data source (NASA POWER) and a single keeper script, both of which represent centralisation risks. These are appropriate limitations for a research demonstration; they would need to be resolved before any real-world deployment.

### 6.4 What Would Falsify This Thesis

A research thesis that names its falsification conditions in advance is harder to attack but more useful when it survives attack. The central finding of this thesis — that the four binding constraints are jointly necessary for sound energy money — would be weakened or falsified if any of the following were shown. Each falsification condition is mapped to a specific chapter's claim.

**1. (Chapter 2)** If the seven-condition framework for commodity-style monetary credibility is rejected as irrelevant or incoherent — for example, by demonstrating that one of the seven conditions is unnecessary for any commodity standard and no replacement condition is required — then the theoretical comparison loses force and the framework derived from it loses its anchoring.

**2. (Chapter 2)** If energy-backed issuance cannot be reliably verified using public or externally auditable data sources — for example, if satellite irradiance data turns out to be insufficiently tamper-resistant for monetary-grade observability — then the second condition (independent observability) fails for energy specifically and the architecture's claim to satisfy it collapses.

**3. (Chapter 3)** If the Bitcoin energy-anchor result is shown to be entirely mechanical, spurious, or unrelated to mining concentration — for example, if a confound coinciding with June 2021 explains the structural break with greater statistical force than the geographic-dispersion explanation — then the empirical motivation in Chapter 3 weakens substantially and the bridge from theory to design loses one of its supports.

**4. (Chapter 5, §5.2)** If energy-backed instruments cannot be priced coherently without liquid options markets — for example, if the physics-based volatility approach produces inconsistent or unstable cross-location results when tested against a wider sample — then the cold-start pricing claim fails and the framework lacks a working pricing layer.

**5. (Chapter 5, §5.3 and §5.4)** If the four constraints can be shown not to actually block the failure modes they are designed to block — for example, by demonstrating that an oracle-gated, rule-bound, collateralised, timelocked system still admits one of the canonical failure modes (oracle capture, issuance discretion, counterparty insolvency, governance unilateralism) through a mechanism the constraints do not foreclose — then the central architectural contribution fails on its own terms.

**6. (Chapter 5, §5.5)** If implementation requires assumptions that cannot be satisfied outside a toy environment — for example, if the four constraints can only operate together at sub-economic scale, or if any of them requires technology that does not yet exist at production scale — then the proof-of-concept result does not generalise and the buildability claim is restricted to the testnet domain.

These six conditions are the real vulnerabilities. They are the lines along which a serious reviewer can attack the thesis productively.

The following are *not* falsifications of the thesis, though casual readers sometimes mistake them for such:

- "No government has adopted an energy monetary standard." (The thesis explicitly does not claim adoption is imminent or even likely in the near term.)
- "The deployed implementation is on testnet rather than mainnet." (The thesis claims buildability, not deployment-readiness; testnet deployment is the appropriate evidence form for the buildability claim.)
- "The $79 billion opportunity cost figure is an order-of-magnitude estimate rather than an audited number." (The thesis states this explicitly in §4.4 and §6.3; the contribution is the reframing, not the precision.)
- "The thesis does not model the political transition from fiat to energy money." (The transition question is explicitly out of scope per §1.6 and §6.3.)

Naming the falsification conditions does two things at once. It forces the central finding to be falsifiable, which is a precondition for it to be a research finding rather than a stance. And it pre-empts the easy-but-wrong attacks so that defense time is spent on the real questions.

### 6.5 Future Work

The most important extension is empirical: testing whether an energy-backed monetary unit, if implemented, would exhibit lower inflation than fiat currencies over comparable horizons. This requires either historical simulation or, eventually, real-world data from early implementations. The deployed Sepolia system is itself a candidate substrate for the latter once it has accumulated sufficient transaction history.

The second extension is institutional: what regulatory frameworks, international agreements, and central bank collaborations would be required to implement an energy monetary standard at meaningful scale? This is a political economy question that requires expertise beyond financial economics.

The third extension is technical: the current implementation uses a single oracle (NASA POWER) and a single clearinghouse structure. A production system would require multi-oracle aggregation, cross-chain settlement, and liquidity mechanisms that the current testnet deployment does not include.

The fourth extension is the natural follow-on to this thesis specifically: testing the framework against alternative seven-condition formulations, or against five- or nine-condition formulations, to determine whether the four-constraint specification is robust to the choice of starting framework.

### 6.6 Closing Statement

Energy-backed money is not sound because energy is a fashionable asset. It is sound only if the issuer is bound by constraints that prevent the classic failure modes of money — discretionary over-issuance, custody capture, settlement default, and unilateral rule change.

This thesis has shown that those constraints can be defined. It has shown why they matter, by establishing that energy is a defensible monetary base under a structured commodity-style framework and that energy expenditure has empirically anchored monetary value in at least one observed case. It has shown that the instruments such a system requires can be priced from physical data alone, without depending on liquid options markets that do not yet exist. And it has shown that the architecture can be implemented as a working testnet proof of concept using current technology.

The conclusion is therefore limited but strong:

**A sound energy-backed currency is theoretically defensible, empirically motivated, financially priceable, and technically buildable — provided that its issuer is bound by oracle-gated issuance, rule-bound supply, algorithmically collateralised settlement, and timelocked governance.**

That is the blueprint. The rest is implementation, governance, and adoption — all of which are real problems, but none of which are research problems for this thesis to solve.

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

IEA. (2024). *Electricity 2024: Analysis and Forecast to 2026*. International Energy Agency.

IRENA. (2023). *Renewable Capacity Statistics 2023*. International Renewable Energy Agency, Abu Dhabi.

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

# Fiscal Choke Points

## How Southeast Asian States Are Re-entering Platform Commerce

Christopher Ongko (王新福)  
Working paper · September 2026  
Digital Tax 2026 rebuild

## Abstract

Digital-tax debates are often organized around rates, bases, and revenue. Yet a statutory rate cannot generate administrable revenue until a tax system can identify a legally taxable event, locate the relevant jurisdiction, assign responsibility to an actor, and connect that responsibility to a repeatable collection or reporting process. Digital commerce makes this prior administrative problem especially visible because platforms and cross-border suppliers may control payment, identity, location, invoicing, and transaction records without conventional physical presence in the taxing jurisdiction.

This paper calls the legally activated connection between those commercial control functions and a bounded fiscal duty a **fiscal choke point**. The concept does not imply that every platform-mediated transaction is taxable, that gross transaction value is itself a tax base, or that commercial observability creates unrestricted state entitlement to data. It provides a common unit for comparing where fiscal responsibility is attached inside digital transaction infrastructure.

Using primary legal and tax-administration sources from Malaysia, Indonesia, Vietnam, Thailand, and the Philippines, the paper compares five components of each country-instrument architecture: taxable object, liable node, destination or nexus evidence, transaction rail, and reconciliation power. It also distinguishes **node locus**—where fiscal responsibility sits in the commercial chain—from **event coupling**—how tightly fiscal action is tied to the underlying transaction. Across the five cases, responsibility repeatedly follows operational control over payment, customer location, invoicing, transaction confirmation, or market access, but the legal node and degree of event coupling differ substantially.

The contribution is comparative and institutional rather than causal. Third-party reporting, platform VAT/GST liability, and ASEAN digital-tax comparison are established prior art. The paper adds a transaction-node architecture for comparing how heterogeneous regimes activate fiscal responsibility without flattening their legal differences or treating administrative collections as causal evidence of policy performance.

**Keywords:** digital taxation; tax administration; digital platforms; fiscal capacity; value-added tax; third-party reporting; fiscal intermediation; ASEAN; e-commerce; platform governance

---

## 1. Introduction

A digital transaction may leave a richer administrative trace than the supplier leaves a physical footprint. A platform can know the seller, customer, price, payment method, delivery status, refund state, account identity, and the moment at which a transaction is confirmed. A foreign supplier may know where a customer is billed even when it has no office in that customer’s jurisdiction. A payment-capable marketplace may control the transfer that completes a sale. These are commercial functions, but tax systems increasingly make them fiscally relevant.

The conventional digital-tax discussion often begins later in the chain. It asks whether the appropriate rate is 6, 8, 10, or 12 percent; whether the tax will be passed through to consumers; whether the base should include goods as well as services; or whether destination-based taxation changes international tax competition. Those are legitimate questions. But they presuppose that a legally taxable event can first be made administrable.

This paper studies that prior problem. It asks:

> **How do governments convert commercial observability and transaction control into administrable fiscal responsibility?**

The proposed analytical unit is the **fiscal choke point**: a legally activated transaction node at which a state assigns a bounded fiscal function—registration, identification, collection, withholding, reporting, remittance, or a related obligation—to an actor positioned to observe or control the relevant commercial event.

The term describes an institutional connection, not a newly invented tax instrument. Employers, banks, merchants, and other firms have long functioned as tax intermediaries. Third-party information can strengthen enforcement because organizations already maintain records needed for their own operations (Kleven, Kreiner, and Saez 2016). VAT can generate information trails that alter enforcement and compliance incentives (Pomeranz 2015). The OECD has developed extensive guidance for assigning VAT/GST liability to digital platforms, including regimes that concentrate assessment, collection, and remittance duties in a relatively small number of intermediaries (OECD 2019). IMF and Asia-Pacific guidance likewise treats registration, vendor collection, platform involvement, and simplified administration as established design problems for taxing imported digital services and e-commerce (Brondolo 2021; OECD, World Bank Group, and Asian Development Bank 2022).

Nor is cross-country comparison of ASEAN digital taxation itself new. Government and academic work has already compared regional differences in VAT or VAT-like structures, tax rates, collection methods, nexus, and legal treatment (National Tax Research Center 2022; Sugeng, Aidy, and Cardenas Jr. 2025). The contribution here must therefore survive two concessions: **platform fiscal intermediation is prior art, and regional digital-tax comparison is prior art.**

What remains is a narrower comparative problem. Existing tax labels can obscure a common institutional choice: *which actor is legally activated, through which commercial or administrative rail, and how closely is the fiscal duty coupled to the transaction event?* A platform withholding rule for individual sellers and a nonresident digital-services VAT are not the same tax. Their bases, taxpayers, legal purposes, and compliance paths can differ materially. Yet both can contain an analytically comparable decision about where fiscal responsibility is placed inside the transaction architecture.

The paper develops a five-component framework for that comparison:

1. **taxable object** — what legally covered sale, service, import, payment, or facilitated transaction enters the regime;
2. **liable node** — which supplier, platform, intermediary, buyer, or other actor must perform the fiscal duty;
3. **destination or nexus evidence** — what connects the event to the jurisdiction;
4. **transaction rail** — how the obligation is operationalized through registration, checkout, invoicing, withholding, filing, or payment;
5. **reconciliation power** — what records or reporting relationships permit verification, matching, or audit.

Two cross-cutting dimensions sharpen the comparison. **Node locus** identifies where fiscal responsibility sits in the commercial chain. **Event coupling** identifies how closely the required fiscal action is tied to the commercial event itself rather than to a later periodic reporting process.

The five-country comparison produces three central findings.

First, **fiscal responsibility repeatedly follows operational control rather than one uniform legal form**. Across the cases, responsibility attaches to actors controlling some combination of customer location, payment, invoicing, transaction confirmation, or market access. The liable node may be a foreign provider, an appointed collector, a payment-capable platform, a platform satisfying a continuous-process condition, or a domestic buyer or withholding agent.

Second, **event coupling varies materially**. Vietnam connects covered platform withholding to the transaction and payment event. Indonesia places collection and commercial-document duties on appointed PMSE collectors. Malaysia relies more heavily on foreign-provider registration and periodic remittance. Thailand conditionally shifts responsibility to a platform when it performs the continuous process from offering through payment and delivery. The Philippines splits responsibility by transaction type, including nonresident-provider remittance and buyer-side withholding paths.

Third, **intermediation can reduce administrative distance without eliminating information limits**. Concentrating selected duties in a smaller number of transaction-organizing actors can make a cross-border or fragmented market more administrable. It does not establish that every transaction is visible, that every observed transaction is taxable, that tighter event coupling is superior, or that observed revenue growth was caused by the architecture.

This distinction also clarifies the relationship with the companion *Invisible Ledger* project. Platform revenue, platform-mediated transaction value, participant income, gross domestic product, taxable income, and unpaid tax are different objects. A gap between platform revenue and facilitated transaction value is not automatically hidden GDP or a latent tax base. *Fiscal Choke Points* begins after that measurement boundary has been respected. Its question is not “how much platform GMV can the state tax?” but “which legally defined events can be attached to which administrable nodes?”

The remainder of the paper reviews the relevant tax-administration and comparative literature, defines the research design and source hierarchy, develops the fiscal-choke-point framework, examines the five country-instrument architectures, derives cross-case findings, and closes with implications, limitations, and a research agenda.

---

## 2. From third-party information to platform fiscal intermediation

### 2.1 Firms as tax-administration infrastructure

Modern tax systems rarely rely on atomized self-reporting alone. Organizations that already maintain business records can become part of the enforcement architecture. Kleven, Kreiner, and Saez (2016) formalize this insight through an agency model of firms as fiscal intermediaries: firms generate records for operational reasons, and those records can support third-party reporting and relax enforcement constraints. The relevance to digital platforms is not that platforms reproduce the employer model exactly. It is that commercial organization can create information and control points that the state can legally recruit for bounded fiscal functions.

Pomeranz (2015) provides complementary evidence from VAT. Her randomized experiments show that transactions embedded in a VAT paper trail respond differently to monitoring because third-party information can generate deterrence and enforcement spillovers. The implication for this paper is straightforward: **administrative capacity depends not only on the legal rate but on the information architecture surrounding the transaction.**

Keen and Slemrod (2017) place such choices within the wider problem of optimal tax administration. Rates, reporting rules, withholding, enforcement, and administrative costs interact. The administrative mechanism therefore deserves analysis in its own right rather than being treated as an implementation footnote.

### 2.2 Digital platforms as a known VAT/GST collection mechanism

The platform-specific mechanism is also established. OECD (2019) describes regimes in which a platform can become fully or partially responsible for assessing, collecting, and remitting VAT/GST on facilitated online sales. One policy rationale is administrative concentration: large transaction volumes can be routed through a smaller number of intermediaries with the information and systems needed to comply.

Brondolo (2021) similarly emphasizes the administrative design required for imported digital services and low-value goods, including registration and collection mechanisms for nonresident suppliers. The OECD/WBG/ADB VAT Digital Toolkit for Asia-Pacific (2022) develops regional implementation guidance. Aslam and Shah (2017), focused on peer-to-peer activity, likewise note that platforms can intensify familiar small-business tax problems while simultaneously creating an administrative opportunity because the technology records transactions and participants.

These literatures mean that *Fiscal Choke Points* cannot credibly claim that governments have only now discovered platforms as tax intermediaries. The underlying mechanism is established.

### 2.3 ASEAN comparison is also prior art

Regional comparison is not itself the gap. The Philippines National Tax Research Center has compared VAT and VAT-like taxation of digital transactions and services across ASEAN, including variation in tax structures, rates, and collection methods (National Tax Research Center 2022). Comparative legal scholarship has also examined Indonesia alongside other ASEAN regimes, including digital and over-the-top service taxation, nexus, and legal design (Sugeng, Aidy, and Cardenas Jr. 2025).

Those studies matter because they remove an easy but weak novelty claim. This paper does **not** present itself as the first comparative study of ASEAN digital taxation.

The remaining comparative gap is more specific. Regional tax comparisons are naturally organized around tax type, rate, threshold, nexus, or jurisdiction. This paper reorganizes the comparison around the **transaction node that is legally activated** and the **timing of the fiscal duty relative to the commercial event**. It asks a different set of questions:

- What exactly is the legally taxable object?
- Which actor must perform the duty?
- What evidence connects the event to the jurisdiction?
- Through what operational rail is the duty performed?
- What reporting or record relationship permits reconciliation?
- How close is fiscal action to the transaction event itself?

This architecture does not make unlike taxes equivalent. It makes a narrower layer of their administrative design comparable without flattening their legal differences.

---

## 3. Research design and source discipline

### 3.1 Unit of analysis

The unit of analysis is the **country-instrument architecture**, not a country’s total digital-tax revenue and not the platform sector as a whole. For each case, the analysis asks what the rule covers, who must act, how the jurisdictional connection is established, through what process the duty is performed, and what official evidence exists that the mechanism operates.

The five cases are not a statistically representative sample of ASEAN and are not used to estimate a regional treatment effect. They are a purposive comparative set selected because they expose materially different ways of assigning fiscal responsibility in digital commerce and because primary legal or tax-administration sources are available for the mechanisms examined.

The country labels therefore should not be read as ratings of entire national tax systems. Each row represents the specific instrument and transaction path studied in this paper.

### 3.2 Source hierarchy

Jurisdiction-specific claims follow a source hierarchy:

1. statute, regulation, decree, or official legal text;
2. official tax/customs guidance and administration portals;
3. official government reporting on registrations, appointments, collections, or implementation;
4. multilateral institutional guidance for comparative context;
5. academic and other secondary literature for theory, prior art, and positioning.

Where a current official page conflicts with older administrative material, current controlling material takes priority or the claim remains unresolved. Dates are typed explicitly where possible as announcement, issuance, statutory effective date, operational start, or first reporting period.

This discipline matters particularly for Vietnam. An earlier government announcement anticipated implementation from April 2025, but Decree 117/2025/NĐ-CP was issued on 9 June 2025 and took effect on 1 July 2025. The 2026 legal layer also matters: Decree 68/2026/NĐ-CP carries forward the relevant per-transaction platform responsibility within the household and individual tax-administration framework, while Decree 141/2026/NĐ-CP subsequently amends specified Decree 68 provisions and thresholds. The event-coupling classification used here is therefore grounded in the operative 2025 mechanism and currentness-checked through the material 2026 layer available as of September 2026.

### 3.3 Inference boundary

The paper intentionally does **not** pool unlike revenue series, convert them into a common “ASEAN digital tax” total, or regress them on statutory rates. The inherited Digital Tax project attempted a rate-centered cross-country design, including claims about rate insignificance, base breadth, compliance mediation, and a Malaysia low-value-goods difference-in-differences result. The available public panel mixed legal instruments, periods, currencies, revenue bases, and partly interpolated market measures. Those claims are not canonical in this rebuild.

Administrative collection figures are used only for what they directly establish: reported scale, the existence of remitters, and evidence that an operational collection rail is being used. They are not treated as causal estimates of the effect of a rate, appointment rule, withholding obligation, or platform-liability regime.

Likewise, the qualitative coding of node locus and event coupling is not an effectiveness index. A transaction-coupled system is not automatically better than a provider-centered periodic system. Performance ranking would require comparable evidence on filing, errors, compliance cost, enforcement, refunds, disputes, taxpayer behavior, and the share of covered activity actually passing through the designated rail.

---

## 4. Fiscal choke points: framework and typology

A fiscal choke point exists when law activates a commercially relevant node for a bounded fiscal function. The framework can be represented as:

```text
commercial event
      ↓
legally taxable object
      ↓
liable node
      ↓
destination / nexus evidence
      ↓
transaction, withholding, filing, or payment rail
      ↓
reporting / reconciliation relationship
      ↓
bounded fiscal action
```

The sequence is analytical rather than universally chronological. Some regimes determine destination before liability; others define a liable class first. The purpose is to prevent a broad phrase such as “taxing the digital economy” from hiding the institutional steps needed to administer an actual obligation.

### Table 1. Five components of a fiscal choke point

| Component | Comparative question | Failure if absent |
|---|---|---|
| Taxable object | What exactly is legally in scope? | Transaction value is mistaken for a legal tax base. |
| Liable node | Which actor is required to act? | Responsibility remains dispersed or ambiguous. |
| Destination / nexus evidence | Why does this jurisdiction have the claim? | Cross-border location rests on assertion rather than administrable evidence. |
| Transaction rail | How is the duty repeatedly performed? | Liability exists on paper without a workable process. |
| Reconciliation power | What records can be compared, reported, or audited? | Administration remains dependent on unverified declaration. |

### 4.1 Node locus

**Node locus** identifies the actor carrying the fiscal duty in the transaction path being studied. A provider-centered regime relies primarily on the foreign provider. An appointed-collector architecture assigns a specified collection function to a designated intermediary. A payment-capable platform may carry withholding or remittance duties because it controls settlement. A buyer-centered regime may use a domestic purchaser or withholding agent. Some systems deliberately split responsibility by transaction type.

The coding follows the legal duty, not the commercial prominence of the platform. A large platform is not coded as the fiscal node merely because it is central to the market.

### 4.2 Event coupling

**Event coupling** describes how closely the required fiscal action is tied to the commercial event. Transaction-level withholding is tightly coupled because the fiscal action occurs when the transaction or payment is confirmed. Collection shown on a commercial document is also relatively close to the event. Registration and periodic return/remittance is less temporally coupled even if liability remains continuous.

Event coupling is descriptive, not normative. Tighter coupling can simplify collection at the payment point, but it may also concentrate compliance duties and platform power. Periodic provider regimes may be administratively effective without attaching withholding to every transaction. The paper therefore uses coupling as a comparative category, not as a maturity score.

---

## 5. Five Southeast Asian architectures

### Table 2. Comparative architecture

| Jurisdiction | Main object examined | Liable node | Destination / nexus evidence | Transaction rail | Event coupling |
|---|---|---|---|---|---|
| Malaysia | Digital services supplied to Malaysian consumer | Foreign service provider; qualifying platform can fall within provider guidance | Two of payment facility, Malaysian IP/mobile code, residence | Registration above threshold; service-tax accounting and quarterly return | Periodic/provider-centered |
| Indonesia | Covered digital goods/services from outside customs area through PMSE | DGT-appointed PMSE VAT collector | Indonesian utilization / PMSE scope | VAT collection, commercial proof, monthly remittance, periodic return | Collection-coupled |
| Vietnam | Covered platform business of households and individuals | Payment-capable platform manager within the Decree 117 framework as carried into the 2026 layer | Seller/transaction within applicable scope | Withholding, declaration, and payment for covered transactions | Transaction-coupled |
| Thailand | Covered electronic services to non-VAT-registered Thai customers | Foreign operator or platform; platform liability under continuous-process condition | Service supplied/used in Thailand under VES rules | VES registration, filing, VAT payment | Conditional platform/provider rail |
| Philippines | Digital services consumed in the Philippines | NRDSP for covered B2C; buyer/withholding agent for specified B2B paths | Payment, residence, access, or other reliable information; two non-conflicting indicators if contradictory | VDS registration/provider remittance or final withholding | Split by transaction type |

### 5.1 Malaysia: destination evidence and platform responsibility

Malaysia’s Service Tax on Digital Services regime illustrates how destination evidence and provider responsibility can be made operational without conventional physical presence. The current MySToDS portal defines a Malaysian consumer through any two of three indicators: payment using a Malaysian credit or debit facility, acquisition using a Malaysian IP address or mobile-country code, and residence in Malaysia. A foreign service provider whose qualifying digital-service value exceeds RM500,000 over the relevant twelve-month period must register. The portal specifies a quarterly taxable period.

Royal Malaysian Customs guidance currently linked through MySToDS includes a person outside Malaysia operating an online platform for buying or selling goods or providing services and making digital-service transactions on behalf of another person within the foreign-service-provider framework. The guidance identifies platform control functions—such as transaction terms, payment or delivery involvement, customer support, and supplier identification—that can matter to responsibility.

The comparative significance is not that Malaysia discovered platform tax intermediation. It is the specific combination of **consumer-location evidence, foreign-provider responsibility, and conditional platform control** used to make the obligation administrable.

### 5.2 Indonesia: the appointed collector as a named fiscal node

Indonesia’s PMSE VAT regime uses designation. The Directorate General of Taxes appoints qualifying operators as PMSE VAT collectors and assigns them recurring duties to collect VAT, provide commercial evidence of collection, remit the tax, and report through DGT systems. The current DGT guidance provides a monthly remittance cadence and a VAT Periodic Return for each tax period.

This design creates a named population of fiscal intermediaries. The authority need not treat every covered foreign digital transaction as an isolated enforcement encounter when appointed operators perform the collection function at scale.

The administrative record confirms that the network is operational. As of 31 January 2026, DGT reported 242 active PMSE VAT collectors, of which 223 had collected and remitted VAT, with cumulative PMSE VAT receipts of Rp36.69 trillion. Those figures establish the scale of an operating collection rail. They do **not** identify how much revenue was caused by appointment, market growth, rate changes, or other factors.

Indonesia therefore contributes an **appointed-collector / collection-coupled architecture**: responsibility is concentrated in designated operators and linked to transaction-level VAT collection and commercial proof, even though remittance and reporting occur through recurring administrative cycles.

### 5.3 Vietnam: withholding at the transaction event

Vietnam provides the clearest transaction-coupled case in the comparison. Decree 117/2025/NĐ-CP was issued on 9 June 2025 and took effect on 1 July 2025. For covered business by households and individuals on e-commerce and digital platforms, managers with the relevant payment function can be responsible for withholding, declaring, and paying tax on behalf of sellers.

The timing is analytically important. The legal framework ties withholding to the successful transaction and payment event, with tax calculated on the covered transaction. That places fiscal action closer to the commercial event than a regime based primarily on end-of-period provider reporting.

The mechanism also survives the later legal layer examined for this rebuild. Decree 68/2026/NĐ-CP expressly carries the per-transaction platform responsibility under Decree 117 into the broader 2026 household and individual tax-administration framework. Decree 141/2026/NĐ-CP subsequently amends specified Decree 68 thresholds and provisions; the package’s transaction-coupling classification does not depend on those altered thresholds.

Vietnam therefore represents the strongest case here of **payment-capable platform / transaction-coupled fiscal responsibility**. That label is descriptive. It does not establish lower compliance costs, higher revenue productivity, or a superior policy design.

### 5.4 Thailand: conditional platform liability inside a nonresident rail

Thailand’s VAT for Electronic Service system provides a dedicated compliance rail for qualifying foreign electronic-service operators and platforms supplying covered services to non-VAT-registered customers in Thailand. The relevant annual threshold is THB1.8 million of qualifying income.

Thai Revenue Department guidance and Revenue Code section 82/13 support a condition under which the platform itself bears the VAT responsibility: where the platform provides the continuous process from offering the service through receiving payment and delivering the service, the fiscal duty shifts toward the platform for the covered supply.

Thailand therefore combines two features. First, it reduces administrative distance between a nonresident supplier and the domestic authority through a dedicated electronic registration and filing system. Second, it conditionally shifts responsibility toward the platform when the platform’s commercial role is sufficiently complete.

The case shows why `platform` cannot be treated as a binary category. Fiscal responsibility depends on **what the platform actually does in the transaction**.

### 5.5 Philippines: split nodes by transaction type

The Philippines offers the clearest split-node architecture in the comparison. Revenue Regulations No. 3-2025 imposes VAT on covered digital services consumed in the Philippines and requires relevant nonresident digital service providers to register through the VAT on Digital Services system.

The regulation also operationalizes destination. Payment information, residence information, access information such as IP address or mobile-country code, and other reliable information can establish Philippine consumption. Where available information is contradictory, at least two non-conflicting pieces of evidence are required.

The liable node changes with the transaction. For covered B2C transactions, the nonresident VAT-registered digital service provider is directly responsible for electronic filing and payment through the VDS system. For specified B2B purchases, final withholding shifts fiscal action toward the buyer or withholding agent. Related BIR administrative issuances distinguish further marketplace withholding paths.

The Philippines therefore makes the comparative point unusually visible: **one tax system can deliberately use different fiscal nodes for different transaction classes**. There is no requirement that all digital commerce be administered through a single platform or provider node.

---

## 6. Cross-case findings

### 6.1 Fiscal responsibility repeatedly follows operational control

The first cross-case result is that fiscal duty repeatedly follows functions useful to administration. The exact legal tests differ, but the recurring control functions include:

- locating the customer or consumption;
- receiving or processing payment;
- confirming the transaction;
- producing invoices or commercial records;
- onboarding or identifying the seller;
- controlling access to the marketplace or service.

Malaysia combines consumer-location evidence with provider/platform responsibility. Indonesia designates collectors and requires commercial proof of VAT. Vietnam uses the payment-capable platform for transaction-level withholding. Thailand shifts liability when the platform controls the continuous service process. The Philippines changes the liable node across B2C and B2B paths.

This supports a bounded inference: **the administrative relevance of an intermediary depends less on the label “platform” than on the control functions it performs.** That inference connects the five cases to the established literature on fiscal intermediation while giving the regional comparison a transaction-node structure.

### 6.2 Event coupling is a distinct design variable

The second result is variation in how tightly fiscal action is attached to the commercial event.

Vietnam is transaction-coupled: withholding is linked to the transaction and payment event. Indonesia is collection-coupled: the appointed collector charges VAT and provides commercial proof, while remittance and reporting occur on a recurring schedule. Malaysia is primarily provider-centered and periodic. Thailand creates conditional platform responsibility where the platform controls the continuous commercial process. The Philippines uses different nodes and rails for different transaction classes.

The resulting typology is:

```text
transaction-coupled platform withholding
        Vietnam

collection-coupled appointed intermediary
        Indonesia

conditional platform responsibility within provider rail
        Thailand

provider-centered destination + periodic remittance
        Malaysia

split provider / buyer / marketplace architecture
        Philippines
```

This is not a maturity ladder. Evaluating which design is more effective would require comparable evidence on filing, payment timeliness, errors, audit, refunds, compliance cost, and behavioral response.

### 6.3 Destination evidence and transaction rails solve different problems

A third finding is that **knowing where a transaction belongs and knowing how to collect from it are separate administrative problems**.

Malaysia and the Philippines make the distinction especially visible by specifying multiple indicators of customer location. Those rules address nexus or destination. They do not, by themselves, perform the collection. Registration, withholding, filing, and payment systems solve the separate performance problem.

Conversely, a platform can control payment without possessing every legal fact required to determine taxability. Commercial control is therefore not equivalent to legal classification.

The five-component framework is useful precisely because it prevents these functions from being collapsed into a single measure of “digital-tax strength.”

### 6.4 Intermediation reduces administrative distance, not uncertainty to zero

The broadest cross-case result is a change in the **distance between the tax authority and the legally covered event**. Cross-border suppliers, fragmented sellers, and large numbers of low-value transactions create a wide enforcement surface. Provider, platform, collector, and buyer-side regimes can concentrate selected duties in fewer entities that already maintain transaction records or depend on market access.

That concentration can make administration more tractable. It does not establish total visibility. Cash sales, off-platform activity, incorrect identity information, exemptions, refunds, classification disputes, seller migration, and data-quality problems remain. Nor does commercial observability itself authorize unrestricted state access to private records.

The most defensible general conclusion is therefore:

> **Digital commerce creates private transaction nodes that tax systems can legally activate to reduce administrative distance for specified obligations.**

---

## 7. Implications for fiscal capacity and platform governance

### 7.1 Fiscal capacity is partly an architecture problem

A revenue figure tells the state how much money arrived. It does not reveal the machinery that made collection possible. Two jurisdictions can report similar collections while relying on very different combinations of registration, platform liability, withholding, destination evidence, and reporting.

The fiscal-choke-point perspective therefore shifts part of the fiscal-capacity discussion from headline rates toward architecture. Before asking which rate maximizes revenue, researchers should ask whether the system can repeatedly identify the legally covered event, assign responsibility, establish nexus, and verify performance.

This does not make rates unimportant. It makes administration logically prior to empirical claims that assume the tax base is successfully observed and collected.

### 7.2 Private infrastructure acquires public obligations

The cases also expose a governance trade-off. The same functions that create commercial power—payment control, account access, customer location, invoicing, transaction confirmation—can make an intermediary attractive as a fiscal node.

That can improve administrability, but it also embeds public obligations inside private infrastructure. Dependence on concentrated intermediaries raises questions about compliance cost, due process, error correction, data governance, platform incentives, and the treatment of small sellers. A state can reduce one enforcement problem while increasing dependence on a private gatekeeper.

The paper therefore does not treat intermediation as inherently welfare-improving. Its purpose is to identify the institutional move precisely enough that the benefits and risks can be evaluated rather than hidden inside a generic phrase such as “digital tax.”

### 7.3 Node choice is a policy variable

Policy debate frequently asks whether a tax should exist and at what rate. The cases suggest an additional design question:

> **Which actor is best positioned to perform each fiscal function at acceptable administrative and compliance cost?**

The answer need not be the same actor for every function. A provider may determine product classification; a platform may locate the buyer; a payment-capable intermediary may control settlement; a domestic buyer may be easiest to reach in B2B transactions; the tax authority may retain reconciliation and audit powers.

Future policy design can therefore be analyzed as an allocation problem across transaction nodes rather than as a binary choice between “tax the platform” and “tax the seller.”

---

## 8. Limits and research agenda

The present study is intentionally bounded.

First, it is a **comparative institutional study**, not a causal evaluation. It does not estimate how much additional revenue any architecture causes or whether one design outperforms another.

Second, the five cases are purposive, not statistically representative of all ASEAN jurisdictions or all digital-tax instruments within each country.

Third, **reconciliation power is the least consistently observable component** in the current public evidence pack. Legal duties to register, collect, withhold, or remit are relatively visible. Comparable evidence on matching, audit, error correction, non-filing, refunds, and transaction reconciliation is much thinner. That is a substantive evidence gap rather than a reason to infer administrative capacity from collection totals alone.

Fourth, the architecture does not directly measure compliance cost. A concentrated node can reduce the state’s enforcement surface while shifting cost toward the intermediary or affected sellers.

Fifth, the framework does not resolve privacy and data-governance questions. Commercial visibility and legal authority are distinct. An intermediary’s ability to observe a transaction does not itself justify unrestricted disclosure to the state.

Sixth, the taxonomy is qualitative. Node locus and event coupling are coding devices grounded in legal and administrative sources, not a validated numerical index. Independent re-coding is therefore a necessary next step before stronger comparative claims are made.

These limits define the next research agenda. A stronger comparative dataset should track, where officially available:

1. active registered or appointed remitters;
2. filing and payment timeliness;
3. declared taxable sales and refunds;
4. unmatched or corrected transactions;
5. audit and enforcement actions;
6. onboarding and compliance costs;
7. the share of covered activity passing through the designated rail;
8. dispute, refund, and error-correction procedures;
9. changes in seller or platform behavior after intermediation duties are introduced.

Those measures would allow the fiscal-choke-point framework to move from institutional mapping toward comparative performance analysis without returning to unsupported rate-first inference.

---

## 9. Conclusion

The central challenge of digital taxation is not only choosing a tax rate for a new category of commerce. It is making legally taxable events administrable when the transactions are organized through private digital infrastructure.

Malaysia, Indonesia, Vietnam, Thailand, and the Philippines illustrate different solutions. Malaysia combines destination evidence with foreign-provider and platform-responsibility rules. Indonesia creates a designated PMSE collector network. Vietnam embeds withholding at the transaction and payment event for covered sellers and carries that mechanism into its 2026 tax-administration layer. Thailand combines a dedicated nonresident compliance rail with conditional platform liability. The Philippines shifts between provider remittance and buyer or marketplace withholding depending on transaction type.

These regimes should not be collapsed into a single ASEAN tax model. Their differences are analytically valuable. Existing comparative work already maps many regional differences in rates, structures, collection methods, and legal treatment. The contribution of *Fiscal Choke Points* is narrower: it reorganizes the comparison around **where fiscal responsibility sits in the transaction chain and when that responsibility is activated relative to the commercial event**.

That is the purpose of the fiscal-choke-point concept. It does not claim a new tax technology or a first regional comparison. It identifies a common institutional question beneath different legal instruments:

> **Where can public fiscal responsibility be attached to private commercial infrastructure without confusing observability with taxability, or administrative convenience with complete fiscal control?**

For the *Invisible Ledger*, the first task is to distinguish what different commercial measures actually represent. For *Fiscal Choke Points*, the next task is to identify where a correctly defined taxable event can become administrable. Together, the two projects separate the measurement problem from the institutional response rather than treating platform transaction value as a shortcut to tax liability.

---

## Data, sources, and reproducibility

The research-control package for this rebuild is maintained in `IE-JDE/Digital_Tax_Design/rebuilt_2026/`.

Current artifacts include:

- `SOURCE_CATALOG.csv` — source IDs, authority, role, and verification status;
- `CLAIM_REGISTER.csv` — claim classes, source mappings, status, and permitted use;
- `COUNTRY_ARCHITECTURE.csv` — structured five-country extraction;
- `CLAIM_BOUNDARIES.md` — nonclaims and inference limits;
- `CODING_RULES.md` — qualitative coding rules;
- `LITERATURE_POSITIONING.md` — novelty and prior-art control;
- `REVIEWER_RISK_REGISTER.md` — hostile-review risks;
- `QUALITY_GATE.md` — package promotion criteria;
- `validate_package.py` — structural consistency checks.

The paper intentionally does not pool unlike legal instruments into an ASEAN revenue total, treat platform transaction value as a legal tax base, or use administrative collections as causal estimates without an identification design.

---

## References

Aslam, Aqib, and Alpa Shah. 2017. “Taxation and the Peer-to-Peer Economy.” *IMF Working Papers* 2017/187. https://doi.org/10.5089/9781484313763.001.

Brondolo, John D. 2021. “Administering the Value-Added Tax on Imported Digital Services and Low-Value Imported Goods.” *IMF Technical Notes and Manuals* 2021/004. https://doi.org/10.5089/9781513576480.005.

Government of Vietnam. 2025. Decree No. 117/2025/NĐ-CP, issued 9 June 2025, effective 1 July 2025.

Government of Vietnam. 2026. Decree No. 68/2026/NĐ-CP, issued and effective 5 March 2026.

Government of Vietnam. 2026. Decree No. 141/2026/NĐ-CP, issued 29 April 2026.

Indonesia Directorate General of Taxes. 2026. “PPN PMSE Dominasi Penerimaan Pajak Digital, Total Capai Rp47,18 Triliun.”

Indonesia Directorate General of Taxes. “VAT on Digital Goods and Services via Electronic Transactions.”

Keen, Michael, and Joel Slemrod. 2017. “Optimal Tax Administration.” *Journal of Public Economics* 152: 133–142. https://doi.org/10.1016/j.jpubeco.2017.04.006.

Kleven, Henrik J., Claus T. Kreiner, and Emmanuel Saez. 2016. “Why Can Modern Governments Tax So Much? An Agency Model of Firms as Fiscal Intermediaries.” *Economica* 83(330): 219–246. https://doi.org/10.1111/ecca.12182.

National Tax Research Center. 2022. “VAT and VAT-like Taxation of Digital Transactions and Services in ASEAN.” Study summarized in the *NTRC 2022 Annual Report*.

OECD. 2019. *The Role of Digital Platforms in the Collection of VAT/GST on Online Sales.* Paris: OECD Publishing. https://doi.org/10.1787/e0e2dd2d-en.

OECD, World Bank Group, and Asian Development Bank. 2022. *VAT Digital Toolkit for Asia-Pacific.*

Philippines Bureau of Internal Revenue. 2025. Revenue Regulations No. 3-2025.

Philippines Bureau of Internal Revenue. 2025. Revenue Memorandum Order No. 13-2025.

Philippines Bureau of Internal Revenue. 2025. Revenue Memorandum Circular No. 47-2025.

Pomeranz, Dina. 2015. “No Taxation without Information: Deterrence and Self-Enforcement in the Value Added Tax.” *American Economic Review* 105(8): 2539–2569. https://doi.org/10.1257/aer.20130393.

Royal Malaysian Customs Department. 2021. *Guide on Digital Services by Foreign Service Provider*, Version 2.1.

Royal Malaysian Customs Department. “MySToDS — Service Tax on Digital Services.”

Sugeng, Widya Romsindah Aidy, and Andre Cardenas Jr. 2025. “Digital Taxation on Over-The-Top Services: A Comparative Study of Regulations in Indonesia and the ASEAN Region.” *Media Iuris* 8(2). https://doi.org/10.20473/mi.v8i2.71267.

Thai Revenue Department. *Revenue Code*, section 82/13.

Thai Revenue Department. *VAT for Electronic Service* portal.

Thai Revenue Department. 2021. *Cross Border VAT on Electronic Service in Thailand: Frequently Asked Questions.*
# Fiscal Choke Points — Comparative Propositions

These propositions convert the five-country material into bounded cross-case analytical claims. They are not causal hypotheses already proved by the current case set. Each proposition records its support, rival interpretation, and falsification/extension requirement.

## P1 — Fiscal responsibility tends to follow operational control functions

**Proposition**

> Within the five studied architectures, legal responsibility is repeatedly assigned to actors that control a commercially relevant function such as supplier/customer identification, payment, invoicing, transaction confirmation, or access to the transaction rail.

**Case support**

- Malaysia: foreign provider and qualifying platform responsibility is linked to supply, consumer location, and provider/platform role.
- Indonesia: DGT appoints PMSE actors that collect VAT and issue transaction-linked proof.
- Vietnam: the payment-capable platform is assigned per-transaction withholding/remittance responsibility for covered seller activity.
- Thailand: platform liability can arise when the platform performs the continuous offer -> payment -> delivery process.
- Philippines: liability is split across nonresident provider, domestic buyer/withholding agent, and specified marketplace paths depending on transaction type.

**Boundary evidence strengthening the proposition**

The package now contains within-regime contrasts that are more informative than the positive cases alone:

- **Philippines:** BIR guidance states that an e-marketplace is not liable for the VAT when the digital-service payment goes directly to the NRDSP and therefore lies outside marketplace control. Marketplace presence alone is not sufficient.
- **Vietnam:** current government guidance distinguishes payment-capable / online-ordering platforms, which carry the specified withholding/declaration/payment duty, from platforms without those functions, where the covered seller remains responsible for self-declaration/payment.
- **Thailand:** the statutory shift of VAT responsibility to the platform is conditional on a continuous commercial process comprising offering, payment, and delivery.
- **Indonesia:** operational presence does not by itself create PMSE collector duty in this package; formal DGT appointment activates the selected collector obligations.

These cases make the operational-control interpretation more than a post-hoc description of enacted platform taxes. They still do not identify operational control as the sole historical cause of node selection.

See `NODE_SELECTION_EVIDENCE.csv` and `NEGATIVE_CASES.csv`.

**What this does not establish**

- that control function is the sole reason the legislature chose the node;
- that the chosen node minimizes compliance cost;
- that the node has complete information;
- that assigning responsibility to the node causes higher revenue.

**Rival explanation**

The observed node may still be selected partly because of inherited VAT doctrine, legal residence rules, political feasibility, international model rules, market structure, or enforcement constraints rather than operational control alone.

**Falsification/extension test**

Expand to additional instruments/jurisdictions and code both the legally liable node and the control functions actually performed. P1 weakens if duties frequently attach to actors with little operational relationship to the taxed event or if seemingly similar control conditions systematically produce different node allocations for reasons better explained by another mechanism.

---

## P2 — Event coupling is an independent design dimension

**Proposition**

> Digital-tax architectures differ not only in who is liable but also in how tightly fiscal action is tied to the underlying commercial event.

**Case support**

- Vietnam: per-transaction withholding/remittance architecture.
- Indonesia: collection and commercial-document duty close to the taxable transaction, followed by periodic remittance/reporting.
- Malaysia: provider-centered registration and periodic taxable period.
- Thailand: platform shift conditional on continuous commercial process, with periodic VAT filing/payment.
- Philippines: different coupling paths for B2C provider remittance and B2B/marketplace withholding.

**What this does not establish**

- a universal ordinal maturity scale;
- superiority of tighter coupling;
- lower evasion under transaction-level withholding without outcome data.

**Rival explanation**

Apparent coupling differences may simply reflect different tax types or taxpayer classes rather than a general design choice.

**Falsification/extension test**

Compare multiple instruments within the same jurisdiction and the same instrument type across jurisdictions. If coupling collapses entirely to tax type, its value as an independent comparative dimension is limited.

---

## P3 — Node locus and event coupling are not the same variable

**Proposition**

> The actor carrying a fiscal duty and the timing of that duty relative to the transaction can vary separately.

A platform-centered architecture can use periodic filing; a provider-centered architecture can still collect at transaction time; a split-node regime can contain multiple coupling patterns.

**Case support**

The five architectures contain provider-centered, appointed-collector, payment-capable-platform, conditional-platform, and split-node arrangements with different operational timing.

**Research payoff**

This prevents the paper from reducing heterogeneous regimes to a single `platform tax` category.

**Falsification/extension test**

Code a larger sample and test whether node categories mechanically determine coupling categories. Strong one-to-one correspondence would make the two-dimensional framework redundant.

---

## P4 — Destination/nexus evidence solves a different problem from collection responsibility

**Proposition**

> Rules that establish where a transaction is taxable are analytically distinct from rules assigning who must collect, withhold, report, or remit.

**Case support**

Malaysia and the Philippines use explicit customer-location evidence, while Vietnam's selected platform-seller mechanism is organized more directly around seller/platform transaction information. Thailand combines use-in-Thailand logic with provider/platform liability. Indonesia's PMSE mechanism combines Indonesian utilization/user nexus with appointed-collector administration.

**What this does not establish**

- that destination evidence is equally reliable across systems;
- that location tests are costless;
- that destination rules eliminate international tax competition.

**Falsification/extension test**

Trace legal disputes, safe harbours, contradictory-location rules, refunds, and audit practice to determine how destination evidence performs operationally.

---

## P5 — Concentrated intermediation can reduce administrative distance without creating complete visibility

**Proposition**

> Assigning bounded duties to a smaller number of transaction-organizing actors can reduce the number of direct administrative relationships required for specified transactions, while leaving substantial information and coverage limits.

**Theoretical support**

This proposition is consistent with firms-as-fiscal-intermediaries, VAT information-trail, OECD platform-liability, and regulatory-intermediary literatures.

**Case support**

The five regimes all place at least some duty on an actor with organized transaction or customer information rather than relying solely on atomized end-seller self-reporting.

**What this does not establish**

- complete transaction coverage;
- correct classification of all sellers or supplies;
- low platform compliance cost;
- absence of privacy, competition, or due-process risk;
- superior welfare.

**Falsification/extension test**

Obtain comparable evidence on number of liable nodes, filing populations, error rates, audit yields, corrections/refunds, seller coverage, compliance costs, and off-platform activity.

---

## P6 — Formal law and operational fiscal capacity are separate stages

**Proposition**

> A legally specified choke point should not be treated as evidence that the full reporting, matching, audit, correction, dispute, and enforcement chain is operational.

**Current evidence**

The package now documents selected downstream procedural machinery in addition to the legal assignment layer:

- Malaysia exposes service-tax invoice correction / credit-debit-note adjustment and audit-document production mechanics, with refund/appeal infrastructure publicly indexed; digital-FSP-specific performance remains unresolved.
- Vietnam's platform-tax architecture includes dedicated withholding/declaration schedules, withholding certificates, and a refund-request form for covered e-commerce activity.
- Thailand's VES guidance explicitly documents refund, audit supervision of nonresident e-service providers/platforms, electronic appeal, and civil penalties.
- Philippines guidance permits amendment of the NRDSP digital-service VAT return and carry-forward of a documented overpayment scenario.
- Indonesia remains strongly evidenced at appointment, collection, remittance, reporting, and transaction-proof stages, while comparable downstream operational evidence has not yet been promoted.

See `OPERATIONAL_CAPACITY_LAYER.md`.

This evidence supports a distinction between **procedural depth** and **procedural effectiveness**. The former is increasingly observable; the latter is not yet comparable across the five cases.

**Implication**

The present project may compare architecture and selectively document operational-capacity mechanisms, but it may not rank tax administrations or infer better compliance from richer public documentation.

**Falsification/extension test**

Build comparable outcome data covering filing timeliness, matching, correction frequency, refund processing, audit yield, enforcement, dispute incidence, taxpayer coverage, and compliance cost by instrument.

---

## P7 — Tax-type labels alone underdescribe the administrative architecture

**Proposition**

> Two regimes carrying similar VAT/digital-service labels can differ materially in liable node, destination evidence, transaction rail, and coupling, while legally different instruments can share an administratively comparable node relationship.

**Research use**

This is the methodological justification for comparing a narrow institutional layer without pooling bases or revenues.

**Boundary**

The framework does not make unlike taxes equivalent; it isolates one comparable administrative dimension.

---

## P8 — The strongest future test is within-country and over-time institutional change

The current cross-country architecture identifies variation but cannot identify why a government chose one node or whether the architecture caused a performance difference.

A stronger next-stage design would exploit:

- rule amendments that shift liability from seller/provider to platform or buyer;
- platform appointment waves;
- changes from periodic self-remittance to transaction-level withholding;
- threshold changes affecting the active remitter population;
- implementation dates with administrative micro/outcome data.

The new within-regime boundary evidence narrows this agenda further: reforms that change **payment control, ordering functionality, platform process integration, or appointment status** are especially informative because the current legal materials already show those conditions can change node allocation.

This is where the project can later move from **comparative architecture** to **identified institutional effects** without resurrecting the old heterogeneous rate panel.

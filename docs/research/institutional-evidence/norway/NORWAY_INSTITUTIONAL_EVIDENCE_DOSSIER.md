# Norway Institutional Evidence Dossier

**Status:** comparative institutional evidence  
**Version:** 0.1  
**Date:** 2026-08-04  
**Research role:** heavy reference environment for CL–ECI and Policy Lab; not system validation

---

## 1. Research question

What do mature Norwegian electricity institutions reveal about the intermediary controls required before physical energy observations may support financial, market, or eventually monetary action?

The dossier does not ask whether the current Policy Lab can match Norway at national scale. It asks whether the project’s abstract boundaries correspond to real institutional problems.

## 2. Working conclusion

Norwegian institutions provide strong comparative evidence for the necessity of distinct layers between physical energy and economically actionable claims:

```text
physical event
→ measured or estimated data
→ quality and completeness state
→ provisional or final settlement basis
→ authorized institutional action
→ bounded certificate or market eligibility
→ unique registry identity / anti-reuse
→ delivery or performance assessment
→ settlement and correction
```

This chain is closely aligned with the project’s research sequence:

```text
signal
→ evidence
→ authority
→ quantity
→ settlement
→ only then monetary testing
```

Norway does not demonstrate an energy-backed monetary system. It does show that downstream code, markets, or registries cannot eliminate the need for evidence quality, actor authority, quantity rules, identity controls, settlement, and correction.

---

## 3. Institutional system A — Elhub

### 3.1 Governed object

Electricity metering values, metering-point information, customer and market-process data, and the calculations and distributions required for market settlement and billing.

### 3.2 Institutional scale and role

Elhub is Norway’s national IT platform for collecting and distributing electricity data. Grid companies, electricity suppliers, service providers, balance-responsible parties, end users, and authorities exchange or access data through the platform. Official Elhub material states that the system supports more than four million metering points.

### 3.3 Evidence states

Elhub documentation distinguishes at least:

- measured values;
- finally estimated values;
- completeness of expected intervals;
- quality of submitted values;
- D+1 balancing-settlement results;
- D+5 final balancing-settlement basis;
- changes after D+5 that trigger discrepancy settlement;
- recalculation under poor quality conditions in documented circumstances.

Measured and finally estimated values can both be valid for settlement. The important institutional distinction is therefore not simply `real` versus `fake`. It is whether a value has a declared origin, quality state, time status, and permitted institutional use.

### 3.4 Actor separation

- Grid companies measure consumption and production and report prior-day values.
- Elhub receives, validates, aggregates, calculates, and distributes data.
- Suppliers and balance-responsible parties use data for billing, forecasting, and financial settlement review.
- eSett performs Nordic imbalance settlement; Statnett is responsible for Norway.
- Third parties require valid authorization to receive end-user data.

### 3.5 CL–ECI significance

Elhub provides strong evidence for these propositions:

1. Evidence quality is typed rather than binary.
2. Evidence suitable for provisional calculation may later be superseded.
3. A final decision must preserve which evidence version and quality state it used.
4. Corrections should create explicit discrepancy consequences rather than silently rewriting history.
5. Data access and data truth are separate questions.
6. Aggregate public data are useful context but do not automatically prove a site-level event.

### 3.6 Policy Lab implications

A future evidence model should be capable of representing:

```text
evidence object
+ valid time
+ system / revision time
+ measured or estimated state
+ completeness state
+ provisional / final status
+ supersedes relationship
+ correction consequence
```

This is a research implication, not an approved runtime change.

---

## 4. Institutional system B — Guarantees of Origin and NECS

### 4.1 Governed object

A Guarantee of Origin (GO) is a certificate confirming that 1 MWh of electrical energy was produced from a specified energy source at a specified time and place.

### 4.2 Authority and eligibility

Norwegian production facilities must enter the authorized scheme. Statnett is the designated issuing and registry authority, while NVE administers relevant approval and regulatory functions. NECS is the Norwegian registry for Guarantees of Origin and electricity certificates.

### 4.3 Quantity mapping

The legal and institutional mapping is explicit:

```text
1 MWh eligible production
→ 1 Guarantee of Origin
```

A physical energy event does not produce an arbitrary quantity of claims. The certificate quantity is institutionally defined.

### 4.4 Registry lifecycle

NECS tracks:

- issued certificates;
- account-holder inventories;
- transactions;
- settlement processes;
- national GO registry functions.

Elhub reports production data to NECS. This places an evidence and calculation layer upstream of certificate issuance.

### 4.5 Anti-reuse and cancellation

GOs used by a supplier for individual electricity disclosure must be cancelled so they cannot be sold more than once.

Cancellation establishes that a renewable attribute has been consumed for disclosure purposes. It does not establish that the physical electrons from the generating plant were delivered to the named consumer.

### 4.6 CL–ECI significance

The GO system gives direct institutional support for these boundaries:

```text
production ≠ certificate authority
certificate ≠ physical delivery
ownership ≠ cancellation
cancellation ≠ monetary redemption
renewable attribution ≠ settlement of another obligation
```

It also demonstrates practical roles for:

- facility eligibility;
- authorized issuance;
- fixed quantity mapping;
- unique registry objects;
- transfer;
- cancellation;
- anti-double-use;
- explicit disclosure boundaries.

### 4.7 What the GO system does not establish

- that the electricity physically delivered to a consumer came from the certified plant;
- that certificate market value equals electricity value;
- that a GO is a reserve asset;
- that a GO is redeemable for electricity;
- that a GO is money;
- that certificate cancellation settles a monetary liability.

### 4.8 Policy Lab implications

The first executable Norwegian reference should be a non-live GO institutional digital twin. It can test eligibility, evidence status, quantity, authority, duplicate windows, transfer, cancellation, expiry, correction, and non-delivery boundaries without claiming NECS integration.

---

## 5. Institutional system C — flexibility register and reserve-market admission

### 5.1 Governed object

Small aggregated flexible resources and the groups through which they may apply for prequalification to participate in the mFRR reserve market.

### 5.2 Institutional sequence

```text
physical flexible resource
→ resource registration
→ group formation
→ actor eligibility
→ prequalification application
→ Statnett and local-grid evaluation
→ possible market participation
→ later activation and performance
→ settlement according to market rules
```

The flexibility register opened for registration of small aggregated resources in June 2026. Official Statnett material states that applications for prequalification were planned to open from 17 August 2026.

### 5.3 Actor separation

- Balance service providers register resources and groups.
- Elhub developed and operates the register infrastructure for Statnett.
- Statnett and the relevant local grid company evaluate suitability for participation.
- Market participation requires actor and resource eligibility rather than mere physical existence.

### 5.4 CL–ECI significance

The flexibility process supports these distinctions:

```text
resource exists
≠ resource is attributable
≠ resource may be grouped
≠ resource is prequalified
≠ resource may bid
≠ resource was activated
≠ resource delivered
≠ resource deserves full settlement
```

It is therefore a strong reference for separating:

- identity;
- control rights;
- admission;
- quantity / capacity;
- local-network feasibility;
- system-operator approval;
- delivery;
- settlement.

### 5.5 Policy Lab implications

A later reference simulation could model registration and prequalification. It should not initially model actual mFRR pricing or settlement unless official rules are separately audited and represented.

---

## 6. Public data and evidence boundaries

Elhub provides public aggregate datasets and an Energy Data API with open datasets covering areas such as aggregated consumption, production, completeness, and grid-area statistics.

This creates a useful research path:

```text
public aggregate Elhub data
→ empirical or contextual analysis
→ reference simulation inputs
```

It does not create:

```text
public aggregate data
→ attributable site-level production evidence
→ certificate authority
→ settlement right
```

Individual and organization-level metering data are permissioned. A legitimate real-evidence pilot would require valid authority from the relevant data holder or organization.

---

## 7. Relationship to the research programme

### 7.1 ECI

Norway strengthens the empirical-admissibility layer by demonstrating that evidence usefulness depends on purpose, timing, granularity, quality, and revision status.

### 7.2 Constrained Ledger

Norway strengthens the institutional layer by showing recurring operational need for:

- reliable evidence;
- authorized action;
- bounded quantity;
- registry identity;
- anti-reuse;
- actor separation;
- settlement;
- correction.

Norwegian institutions do not implement the proposed CL architecture as one unified monetary system.

### 7.3 Policy Lab

Norway provides externally grounded institutional processes that can become reference simulations. Policy Lab may represent and stress those rules, but its output remains a research artifact until compared with real decisions or reviewed by appropriate experts.

### 7.4 SPK / Solarpunk

SPK remains the historical monetary experiment. Norway should discipline the institutional assumptions behind future energy-linked monetary designs, not be rewritten as evidence that SPK already worked.

---

## 8. Research contribution enabled by Norway

The project can move from a purely normative claim:

> These institutional conditions appear logically necessary.

Toward a stronger comparative claim:

> Mature energy institutions already implement many of these conditions across specialized systems. CL–ECI identifies their common logic, examines what remains missing for monetary claims, and makes alternative designs executable and falsifiable in Policy Lab.

This is a meaningful academic strengthening while preserving the originality of the unified theory and simulation method.

---

## 9. Explicit non-claims

This dossier does not claim:

- Norway operates an energy-backed currency;
- Norwegian electricity backs the krone;
- the Government Pension Fund Global is a monetary reserve system;
- Elhub, NECS, or the flexibility register validate Policy Lab calculations;
- the current TYN fixture has Norwegian-equivalent evidence quality;
- the current engine can make legally effective Norwegian decisions;
- the project can or should replace Norwegian institutions;
- a Norwegian reference simulation constitutes external validation;
- public aggregate data authorize site-level claim issuance;
- monetary circulation, liquidity, acceptance, or unit-of-account use have been demonstrated.

---

## 10. Recommended next research steps

1. Review and freeze the bounded claim register.
2. Audit each official source and archive stable references where permitted.
3. Build `NOR-GO-001` as a case specification only.
4. Seek review from an energy-market, certificate, or Norwegian institutional expert.
5. Identify which public Elhub datasets can support empirical context without overclaiming.
6. Reassess the evidence schema for revisions and discrepancy settlement.
7. Implement no runtime change until the case objects, rules, non-claims, and acceptance tests are approved.
8. Preserve the separate goal of one attributable external evidence case.

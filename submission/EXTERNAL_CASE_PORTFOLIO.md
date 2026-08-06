# External Case Portfolio — Cases 001–003

**Status:** active programme specification  
**Version:** 0.1  
**Date:** 2026-08-07  
**Authority:** subordinate to issue #26 and `docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md`

The external-case programme exists to test source-independent operation, repeatability, assurance boundaries, and institutional usefulness. It does not exist to manufacture positive decisions.

---

## 1. Portfolio design

| Case | Primary purpose | Preferred source | Required contrast | Minimum public outcome |
|---|---|---|---|---|
| **External Case 001** | prove source-independent operability | attributable owner/operator, institutional source, or source-holder-reviewed official registry export | first real source; L0 baseline | privacy-safe case package and factual-review record |
| **External Case 002** | prove format and institutional heterogeneity | university EMS, ESCO, laboratory, small solar operator, or second independent owner | different format, custodian, workflow, or semantics | second reproducible package and cross-case differences |
| **External Case 003** | exercise authentication or corroboration | API, signed gateway, utility-corroborated record, registry identity, or independently verifiable device/source relation | stronger authentication without collapsing physical truth into confidence | documented promotion evidence or truthful refusal to promote |

A correctly blocked case is a valid result. At least one case in the portfolio should be blocked or materially limited by a real evidence deficiency.

---

## 2. Universal minimum source contract

Every case requires:

- original historical file or authorized machine response;
- attributable provider with documented relationship to the source;
- acquisition method and date;
- private-validation permission;
- explicit publication scope;
- bounded measurement window;
- timezone;
- field and unit semantics;
- interval semantics;
- measured, calculated, cumulative, or derived status where known;
- original file SHA-256 and byte length;
- source-holder factual review path.

No case requires publication of raw interval data.

Never request or retain unnecessary:

- passwords;
- API secrets;
- exact residential addresses;
- electricity account numbers;
- personal identity numbers;
- customer records without authorization;
- device serial numbers unless materially required and permissioned.

---

## 3. Source acquisition ladder

### Tier 1 — direct owner or operator

Examples:

- household or small-business solar owner;
- inverter portal user;
- facility or laboratory manager;
- campus energy-management custodian;
- system installer or operator supplying an authorized sample.

**Strength:** clear relationship and direct factual review.  
**Risk:** export functionality, privacy concerns, or incomplete semantics.

### Tier 2 — institutional research or design partner

Examples:

- YZU sustainability or General Affairs energy-management team;
- ESCO or EMS provider;
- solar installation or monitoring company;
- research laboratory operating generation, storage, or metering equipment.

**Strength:** high institutional value and complex workflow.  
**Risk:** slower permission and legal review.

### Tier 3 — source-holder-reviewed public registry or official dataset

Examples:

- official generation registry export;
- public utility or government energy dataset;
- official machine-readable reporting feed.

**Strength:** immediate access and explicit provider.  
**Risk:** public licensing does not automatically provide field-level factual review or prove physical source truth.

A public dataset may be used as Case 001 only when the source-holder or responsible authority confirms the factual metadata and the case remains within the declared assurance boundary. Otherwise label it as a public-data exercise rather than a completed owner/operator external case.

---

## 4. Case 001 execution specification

### Objective

Run the existing V2 custody-first intake path on an external artifact without hidden hard-coding or unsupported assurance promotion.

### Acceptance sequence

1. Identify source provider and relationship.
2. Freeze original file identity.
3. Record private and public permission scopes separately.
4. Complete V2 source manifest.
5. Complete column, unit, timestamp, interval, sign, and conversion mapping.
6. Build or select a registered adapter.
7. Produce row, duplicate, missingness, unit, interval, and window diagnostics.
8. Build the actual L0 EvidenceEnvelope.
9. Evaluate open and pilot policies.
10. Run settlement only for admitted quantity and only as declared by the selected scenario.
11. Produce DecisionResult, SettlementResult where applicable, DecisionReceipt, and Research Capsule.
12. Verify hashes, byte lengths, file closure, identities, and cross-object agreement.
13. Obtain source-holder review of factual metadata and publication boundary.
14. Publish only authorized metadata, diagnostics, aggregates, identities, limitations, and non-claims.

### Required effort measures

Record:

- hours from receipt to first parsed result;
- adapter implementation time;
- number of clarification questions;
- number of unresolved fields;
- manual transformations;
- reproduction time in a clean environment;
- defects discovered in the generic intake path.

---

## 5. Case 002 design rule

Case 002 must not merely repeat Case 001 with a renamed file.

Select at least two contrasts:

- CSV versus XLSX, JSON, API, or registry response;
- generation versus consumption, import/export, or storage;
- household versus institutional source;
- 15-minute versus hourly or daily interval;
- cumulative meter versus interval quantity;
- complete semantics versus ambiguous fields;
- single system versus multi-device aggregation;
- private-only versus anonymized-public permission.

Case 002 must record whether Case 001 produced genuinely reusable adapter or workflow improvements.

---

## 6. Case 003 authentication rule

Case 003 examines whether assurance can be promoted above the baseline. Promotion is never required.

Possible evidence includes:

- independently verified API endpoint and account relationship;
- signed gateway output with documented key custody;
- utility or registry corroboration for the same source and measurement window;
- device or system identity confirmed by an external operator;
- independently preserved acquisition record.

The following are insufficient by themselves:

- a filename stating `verified`;
- a locally generated project key;
- a manifest assertion authored by the programme;
- successful parsing;
- public-data status;
- provider permission;
- an inverter or meter model name;
- a screenshot without original machine data.

Case 003 must document both accepted and rejected promotion evidence.

---

## 7. Cross-case evaluation

The final portfolio report must compare:

| Dimension | Required comparison |
|---|---|
| Source relationship | owner, operator, custodian, registry, or institutional provider |
| Format | file or API structure and adapter reuse |
| Semantics | resolved, inferred, declared, and unresolved fields |
| Data quality | missingness, duplicates, interval consistency, and window closure |
| Assurance | actual baseline and any justified promotion evidence |
| Policy outcome | blocked, admitted, or admitted with limit |
| Binding rule | primary blocker or quantity ceiling |
| Reproduction | clean-run time, artifacts, and agreement checks |
| Privacy | raw-data handling and public-output boundary |
| Usefulness | source-holder and external-review feedback |

The report must not aggregate all dimensions into one confidence score.

---

## 8. Public case package

Each public package should contain only authorized material:

- case identity and version;
- source relationship at the permitted level of specificity;
- acquisition and permission summary;
- measurement window and semantic summary;
- file identity without raw rows;
- diagnostics and bounded aggregates;
- actual assurance state;
- declared counterfactual scenarios separately labeled;
- policy, decision, settlement, receipt, and capsule identities;
- reproduction instructions using the authorized artifact set;
- factual-review record;
- remaining gaps and explicit non-claims.

---

## 9. Portfolio completion criteria

The three-case programme is complete only when:

- all three cases satisfy their stated source and review contracts;
- at least two source environments differ materially;
- one case exercises or rejects stronger authentication evidence;
- at least one result is blocked or materially limited;
- generic code changes are separated from case-local adapters;
- a clean reviewer can reproduce every authorized package;
- the cross-case report explains failure modes and programme limitations;
- no public claim exceeds the weakest supporting evidence.
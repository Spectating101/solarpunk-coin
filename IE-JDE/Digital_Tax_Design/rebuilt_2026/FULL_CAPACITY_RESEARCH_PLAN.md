# Fiscal Choke Points — Full-Capacity Research Plan

This plan is intentionally broader than submission readiness. The objective is to push the Digital Tax research object as far as the available public/legal evidence can legitimately support before later consolidation with Invisible Ledger.

## 1. Current core already established

The current package has:

- a five-component fiscal-choke-point architecture;
- country-level coding for Malaysia, Indonesia, Vietnam, Thailand, and the Philippines;
- transaction-path coding that separates seven distinct paths rather than forcing one label per country;
- node-locus and event-coupling variables;
- source and claim registers;
- legal chronology;
- comparative propositions;
- explicit rival explanations and robustness tests;
- a first reconciliation/recordkeeping evidence matrix;
- deterministic derived architecture summary;
- structural CI validation.

The next work should therefore deepen identification and administrative evidence rather than generate more framing language.

## 2. Research frontier A — expand the unit from country to transaction path

The seven current paths should become a normalized dataset with one row per legally distinct transaction path.

### Add fields

- legal taxpayer / economic taxpayer where distinguishable;
- collecting/reporting intermediary;
- underlying seller/provider;
- consumer/buyer class;
- B2B/B2C flag;
- resident/nonresident status;
- threshold;
- registration trigger;
- destination/nexus test;
- tax point / withholding point;
- invoice/receipt requirement;
- return frequency;
- payment frequency;
- transaction-detail reporting requirement;
- record-retention period;
- correction/refund rail;
- authority request power;
- seller/buyer identifier fields;
- effective dates and amendments;
- legal-source IDs;
- operational-admin-source IDs.

### Payoff

This would let the paper compare architecture without reducing a jurisdiction to one regime-wide category.

## 3. Research frontier B — reconciliation and administrative observability

Build a second-stage evidence matrix separating:

1. **records exist**;
2. **records must be retained**;
3. **records must be reported periodically**;
4. **transaction detail can/must be supplied**;
5. **identifiers are present**;
6. **authority can request or receive detailed data**;
7. **records are matched**;
8. **records are used for assessment/audit**;
9. **corrections/refunds/disputes are observable**;
10. **outcomes are measured**.

The current `RECONCILIATION_EVIDENCE_MATRIX.csv` closes parts of stages 2–6 for several jurisdictions but leaves stages 7–10 intentionally unresolved.

### High-value evidence to seek

- audit manuals or official audit guidance;
- transaction-detail reporting specifications;
- taxpayer/seller matching rules;
- return-schema documentation;
- correction and refund procedures;
- administrative system manuals;
- enforcement/penalty statistics specific to the instrument;
- audit or compliance reports;
- parliamentary/government evaluations.

Do not substitute aggregate tax collections for this layer.

## 4. Research frontier C — negative and boundary cases

The current five cases are selected partly because the fiscal nodes are visible. To test the concept, actively search for:

- platforms with transaction/payment control but **no** special fiscal responsibility;
- regimes that deliberately retain seller/provider self-reporting despite strong platform observability;
- proposed platform-liability rules that were delayed, withdrawn, or narrowed;
- platform duties that fail because the platform does not control payment;
- payment-intermediary or buyer nodes chosen instead of marketplaces;
- within-country instruments where node locus differs despite similar digital commerce.

### Payoff

Negative cases can distinguish a genuine node-selection framework from a taxonomy that merely describes enacted platform rules.

## 5. Research frontier D — why is a node chosen?

The current paper can describe node placement but does not identify the selection mechanism.

Candidate explanations to test:

- inherited VAT doctrine;
- OECD/international policy diffusion;
- administrative digital maturity;
- platform/payment-market concentration;
- legal capacity to assert jurisdiction over nonresidents;
- domestic political constraints;
- expected compliance cost;
- transaction observability;
- payment control;
- availability of taxpayer identifiers;
- ease of enforcement against the intermediary;
- privacy/data-protection constraints.

### Evidence strategy

Use explanatory memoranda, consultation documents, legislative debates, tax-authority implementation papers, multilateral technical-assistance documents, and rule amendments.

## 6. Research frontier E — within-country institutional transitions

The strongest route from descriptive comparison to identified institutional effects is likely within-country reform rather than another heterogeneous ASEAN panel.

Candidate designs:

- liability shifts from provider/seller to platform;
- appointment waves for designated collectors;
- transition from periodic self-remittance to transaction-level withholding;
- threshold reforms;
- changes in location-evidence requirements;
- expansion of transaction-detail reporting;
- introduction of tax-ID/identity linkage;
- correction/refund or filing-system redesigns.

Potential outcome data:

- number of active remitters;
- registrations;
- declared taxable sales;
- filing timeliness;
- amendments/corrections;
- refund claims;
- audit yields;
- mismatch rates;
- taxpayer coverage;
- compliance costs;
- seller exit/off-platform displacement.

A credible design may be event-study, interrupted time series, phased appointment analysis, or difference-in-differences **only when** treatment timing, comparison group, and outcome construction are defensible.

## 7. Research frontier F — governance costs of fiscal intermediation

A strong institutional paper should not treat concentrated intermediation as automatically desirable.

Build an explicit cost/risk layer:

- platform compliance burden;
- small-seller pass-through costs;
- data retention and privacy;
- due process and correction rights;
- errors in buyer/seller classification;
- market-power reinforcement;
- dependence of public administration on private infrastructure;
- cross-border enforceability;
- cyber/security concentration;
- platform exit or business-model redesign.

This is where platform-governance and regulatory-intermediary literatures become analytically useful.

## 8. Research frontier G — broaden carefully beyond ASEAN

Only after the ASEAN architecture is stable, add a limited external comparison chosen for analytical leverage rather than country count.

Useful external cases would provide:

- a clear negative case;
- a different intermediary node (payment processor, app store, marketplace, financial institution);
- a documented node shift over time;
- unusually strong audit/matching evidence;
- a privacy or court challenge to intermediary duties.

Do not build a global catalogue merely for scale.

## 9. Research frontier H — formalization without false precision

The framework can eventually be formalized without inventing an unjustified scalar score.

Possible representation:

`Path = (O, N, X, R, C, I)`

where:

- `O` = legally taxable object;
- `N` = liable node;
- `X` = destination/nexus evidence;
- `R` = operational transaction/reporting rail;
- `C` = event-coupling structure;
- `I` = evidenced information/reconciliation stage.

Comparisons can then be set-based or categorical rather than ordinal.

A future causal model should treat outcomes separately:

`Outcome = f(Path, market structure, administrative capacity, legal environment, compliance cost, enforcement, time)`

The architecture vector is not itself an effectiveness score.

## 10. Full-capacity data products

Target durable artifacts:

1. `COUNTRY_PATH_CODINGS.csv` — canonical path dataset;
2. `CASE_CHRONOLOGY.csv` — legal and operational transitions;
3. `RECONCILIATION_EVIDENCE_MATRIX.csv` — trace-to-use evidence;
4. future `NODE_SELECTION_EVIDENCE.csv` — why the node was selected;
5. future `ADMIN_OUTCOMES.csv` — comparable operational outcomes where available;
6. future `NEGATIVE_CASES.csv` — cases where expected intermediation does not occur;
7. source corpus + exact locators;
8. deterministic derivations and validation;
9. manuscript and figures generated from frozen data products.

## 11. Stop rules

Do not add a new analysis if it requires:

- treating GMV/GTV as tax base;
- pooling unlike revenue bases;
- converting legal architecture into an unobserved compliance score;
- inferring causal effects from collection totals;
- inventing comparable enforcement metrics from non-comparable sources;
- assuming tighter event coupling is better;
- claiming intermediary selection is explained by operational control without evidence on alternative explanations.

## 12. When Digital Tax is ready for consolidation with Invisible Ledger

Consolidation can begin once DT has:

- stable path-level architecture;
- source-frozen chronology;
- reconciliation evidence coded to the highest supported stage;
- rival explanations mapped;
- at least one serious negative/boundary-case exercise;
- a clear separation between architecture and performance;
- manuscript conclusions that reproduce from the data products.

The goal is not to make DT look complete. The goal is to exhaust the research opportunity before merging its conceptual layer with IL.
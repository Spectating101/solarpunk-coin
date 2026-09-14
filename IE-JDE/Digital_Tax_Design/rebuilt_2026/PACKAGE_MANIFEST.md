# Fiscal Choke Points — Publication Package Manifest

**Package ID:** `DT-FCP-2026-001`  
**Status:** `PUBLICATION CANDIDATE / INTERNAL RESEARCH PACKAGE CRYSTALLIZED`  
**Branch:** `digital-tax/rebuild-2026`  
**Canonical manuscript:** `FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md`

## 1. Central question

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

## 2. Governing contribution

The paper compares digital-tax administration at the **transaction-path** level rather than by country/rate labels.

Its current contribution is:

1. seven legally distinct paths across five Southeast Asian jurisdictions;
2. source-controlled coding of taxable object, liable node, destination/nexus evidence, transaction rail, and reconciliation power;
3. `node locus` and `event coupling` as separate comparative coding dimensions;
4. within-regime boundary/countercases testing when digital-intermediary presence is insufficient to activate fiscal responsibility;
5. Stage-A legal architecture separated from Stage-B operational/procedural capacity;
6. explicit architecture/performance non-equivalence.

The paper is comparative and institutional rather than causal.

## 3. Prior art that must remain conceded

The package does **not** claim to invent:

- firms as fiscal intermediaries;
- VAT information trails;
- platform VAT/GST liability;
- function/capability criteria for platform liability;
- payment control as an administrative consideration;
- taxing-point/payment-confirmation design;
- concentrated/choke-point tax collection in supply chains;
- regulatory intermediation;
- ASEAN digital-tax comparison.

OECD platform-tax work already addresses functions, platform capability, payment flows, and taxing-point timing. Broader tax literature already uses concentrated collection-point logic. The contribution therefore rests on **cross-instrument representation, countercase testing, and legal/procedural evidence separation**, not discovery of those underlying dimensions.

See `NOVELTY_AND_PRIOR_ART_AUDIT.md`.

## 4. Canonical read order

### Source and inference authority

1. `CLAIM_BOUNDARIES.md`
2. `SOURCE_CATALOG.csv`
3. `CLAIM_REGISTER.csv`
4. `CODING_RULES.md`
5. `NOVELTY_AND_PRIOR_ART_AUDIT.md`
6. `OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md`

### Comparative evidence

7. `COUNTRY_PATH_CODINGS.csv`
8. `COUNTRY_ARCHITECTURE.csv`
9. `CASE_CHRONOLOGY.csv`
10. `NODE_SELECTION_CONDITIONS.csv`
11. `BOUNDARY_CASES.csv`
12. `RECONCILIATION_EVIDENCE_MATRIX.csv`
13. `OPERATIONAL_CAPACITY_MATRIX.csv`
14. `DERIVED_ARCHITECTURE_SUMMARY.md`

### Analytical controls

15. `LITERATURE_POSITIONING.md`
16. `COMPARATIVE_PROPOSITIONS.md`
17. `ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md`
18. `REVIEWER_RISK_REGISTER.md`
19. `FULL_CAPACITY_RESEARCH_PLAN.md`

### Publication surfaces

20. `FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md`
21. `FIGURES_TABLES_SPEC.md`
22. `SUBMISSION_MATERIALS.md`
23. `QUALITY_GATE.md`

### Validation

24. `validate_package.py`
25. `derive_comparative_findings.py --check`
26. `validate_boundary_layer.py`
27. `validate_operational_capacity.py`
28. `validate_publication_candidate.py`
29. `.github/workflows/digital-tax-package.yml`

Narrative prose cannot override source, claim, coding, boundary, or operational matrices.

## 5. Current coded paths

1. **MY-STODS-01** — Malaysia foreign-provider digital-services path;
2. **ID-PMSE-01** — Indonesia appointed PMSE VAT collector;
3. **VN-SELLER-01** — Vietnam payment-capable-platform seller withholding;
4. **TH-VES-01** — Thailand nonresident e-service path with conditional platform shift;
5. **PH-B2C-01** — Philippines nonresident provider B2C;
6. **PH-B2B-01** — Philippines buyer/withholding-agent B2B;
7. **PH-MKT-01** — Philippines qualifying e-marketplace path.

The unit is the path, not a whole national tax system.

## 6. Boundary-case result

The framework is tested by cases where a broad `platform = fiscal node` rule fails.

- **Thailand:** platform liability depends on the continuous offer-payment-delivery process condition.
- **Philippines:** in the cited direct-to-NRDSP payment scenario, marketplace involvement alone does not create marketplace VAT liability; B2B can shift the node to the domestic buyer.
- **Vietnam:** payment/order functionality separates the platform-withholding path from applicable seller self-declaration/payment paths.
- **Indonesia:** formal DGT appointment activates the selected PMSE collector role.
- **Malaysia:** threshold and instrument boundaries prevent universal node activation.

These support a bounded legal-activation interpretation. They do **not** prove that operational control is the sole historical reason a legislature selected a node.

## 7. Stage-A / Stage-B architecture

### Stage A — legal transaction-path architecture

`object -> nexus -> node -> rail -> reconciliation power`

### Stage B — operational/procedural capacity

`filing -> correction -> refund -> audit -> appeal -> enforcement -> observed outcome`

Public sources support different portions of Stage B across the five jurisdictions. Richer public documentation is evidence of documented procedural depth only; it is **not** a country-performance measure.

`OPERATIONAL_CAPACITY_MATRIX.csv` is the coded authority.

## 8. Frozen nonclaims

The publication candidate does not establish:

- GMV/GTV as a tax base;
- platform-revenue gaps as hidden GDP/unpaid tax;
- statutory rates as irrelevant;
- a fixed 30:1 advantage of base breadth over rates;
- a +$114M Malaysia causal treatment effect;
- destination taxation eliminating tax competition;
- operational control as the sole causal determinant of node selection;
- tighter event coupling as better administration;
- procedural documentation as administrative effectiveness;
- country rankings for compliance, efficiency, equity, welfare, or revenue;
- complete fiscal visibility from intermediary liability;
- matched/verified-use outcomes where those are not directly evidenced.

## 9. Operational-capacity evidence state

- **Malaysia:** filing plus correction/adjustment and audit-document mechanisms are visible; digital-FSP outcome evidence remains unresolved.
- **Indonesia:** appointment, collection, remittance, periodic reporting and transaction proof are evidenced; aggregate collections remain administrative facts, not causal outcomes.
- **Vietnam:** transaction-level withholding/declaration and a qualifying refund mechanism are evidenced; matching/refund effectiveness remains unresolved.
- **Thailand:** VES materials expose filing, refund, supervision/audit, electronic appeal, and sanctions; this does not establish superior performance.
- **Philippines:** VDS filing and a documented amended-return/overpayment carry-forward mechanism are evidenced; instrument-specific downstream outcomes remain unresolved.

Comparably harmonized matching, audit-yield, error, refund-performance, compliance-cost, and behavioural-outcome data remain a research gap.

## 10. Relationship to Invisible Ledger

Fiscal Choke Points is a tax-administration architecture paper. Invisible Ledger is an Indonesia measurement/reconciliation paper.

DT may use general accounting/measurement doctrine that transaction value, platform revenue, income, GDP, and tax base differ, but it may not use IL's empirical results as evidence of tax liability. The two papers must not validate one another circularly.

See `OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md`.

## 11. Validation contract

CI must fail if:

- source or claim IDs disappear;
- seven-path/five-country coverage is broken;
- superseded rate/DiD claims return as live findings;
- derived architecture drifts from source codings;
- boundary cases lose controlled source support;
- Stage-B claims lose evidence-status controls;
- administrative collections become causal performance evidence without an explicit design change;
- the publication candidate promotes a maturity/performance ranking;
- the publication candidate overclaims originality for platform functions, timing, or choke-point collection.

The exact publication branch must pass all five package-specific gates before external use.

## 12. Current publication gates

The content is crystallized as a venue-neutral publication candidate. Remaining process/external gates are:

1. exact-head five-gate CI PASS;
2. independent spot recode of a sample of path classifications and sources;
3. final legal-currentness sweep immediately before submission;
4. selected-venue formatting and author instructions;
5. preprint/related-work/overlap disclosure review;
6. final human copyedit and citation check.

These gates do not require another conceptual redesign unless external review identifies a substantive defect.

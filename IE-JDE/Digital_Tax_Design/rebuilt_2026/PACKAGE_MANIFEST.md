# Fiscal Choke Points — Package Manifest

**Package ID:** `DT-FCP-2026-001`  
**Status:** `FULL-CAPACITY RESEARCH BUILD / HOSTILE-REVIEW READY / NOT SUBMISSION-FROZEN`  
**Canonical branch:** `digital-tax/rebuild-2026`  
**Research object:** comparative institutional study of where legally bounded fiscal responsibility is attached inside Southeast Asian digital transaction infrastructure

## 1. Central question

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

## 2. Central proposition

> Heterogeneous digital-tax regimes can be compared at the transaction-path level by identifying the legally covered object, the node assigned a bounded fiscal duty, the evidence connecting the event to the jurisdiction, the operational rail through which the duty is performed, and the evidenced reconciliation relationship.

The architecture is descriptive and institutional. It is not a tax-performance score.

## 3. Contribution hierarchy

1. **Transaction-path unit:** move below one-country/one-regime labels where multiple fiscal paths coexist.
2. **Fiscal-choke-point construct:** name the legally activated connection between a commercial node and a bounded fiscal duty.
3. **Five-component architecture:** taxable object, liable node, destination/nexus evidence, transaction rail, reconciliation power.
4. **Cross-cutting dimensions:** node locus and event coupling.
5. **Five-country / seven-path application:** Malaysia, Indonesia, Vietnam, Thailand, and three distinct Philippine paths.
6. **Architecture/performance separation:** legal duties, operational facts, reconciliation evidence, procedural capacity, and causal outcomes remain separate evidence layers.
7. **Falsifiable comparative propositions:** operational-control, coupling, node/timing separation, destination/collection separation, intermediation distance, law/operation boundary, tax-label insufficiency, and within-country reform agenda.
8. **Within-regime boundary evidence:** payment control, ordering/payment functionality, continuous-process control, designation, and thresholds test when fiscal responsibility does *not* attach to an otherwise visible digital intermediary.
9. **Operational-capacity extension:** filing, correction, refund, audit, appeal, enforcement, and observed outcomes are coded separately from legal node assignment rather than collapsed into a maturity score.

## 4. Prior art that must remain conceded

The package does **not** claim invention of:

- firms as fiscal intermediaries;
- VAT information trails;
- regulatory intermediation or governance through private intermediaries;
- digital-platform VAT/GST liability;
- vendor/platform administration of imported digital services;
- use of platform data in small-business tax administration;
- ASEAN digital-tax comparison.

The narrower contribution is the transaction-path/node/event-coupling architecture and its source-controlled application.

## 5. Canonical read order

### A. Claim and source authority

1. `CLAIM_BOUNDARIES.md`
2. `SOURCE_CATALOG.csv`
3. `CLAIM_REGISTER.csv`
4. `CODING_RULES.md`

### B. Comparative data products

5. `COUNTRY_PATH_CODINGS.csv` — canonical transaction-path coding.
6. `COUNTRY_ARCHITECTURE.csv` — country-level overview retained for readability.
7. `CASE_CHRONOLOGY.csv` — legal/operational chronology.
8. `RECONCILIATION_EVIDENCE_MATRIX.csv` — recordkeeping, transaction detail, authority receipt/request, correction, and unresolved matching/outcome evidence.
9. `NODE_SELECTION_CONDITIONS.csv` — path-level legal activation and operational-control conditions.
10. `BOUNDARY_CASES.csv` — canonical negative/countercases used to test the framework.
11. `OPERATIONAL_CAPACITY_MATRIX.csv` — source-controlled Stage-B procedural status by selected instrument.
12. `OPERATIONAL_CAPACITY_LAYER.md` — narrative interpretation of filing/correction/refund/audit/appeal/enforcement evidence under a strict non-ranking rule.
13. `DERIVED_ARCHITECTURE_SUMMARY.md` — deterministic descriptive output from path codings.
14. `derive_comparative_findings.py` — generator/check for the derived summary.

### C. Analytical controls

15. `LITERATURE_POSITIONING.md`
16. `COMPARATIVE_PROPOSITIONS.md`
17. `ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md`
18. `FULL_CAPACITY_RESEARCH_PLAN.md`
19. `REVIEWER_RISK_REGISTER.md`

### D. Narrative and publication surfaces

20. `FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md`
21. `FIGURES_TABLES_SPEC.md`
22. `SUBMISSION_MATERIALS.md`
23. `QUALITY_GATE.md`

### E. Validation/audit

24. `validate_package.py`
25. `validate_boundary_layer.py`
26. `validate_operational_capacity.py`
27. `INTERNAL_AUDIT_2026-09-14.md`
28. current CI run for the exact branch tree.

Narrative prose cannot override source, claim, coding, boundary, or operational matrices above it.

## 6. Frozen nonclaims

The package does **not** establish:

- that platform GMV/GTV is a tax base;
- that platform revenue differences reveal hidden GDP or unpaid tax;
- that a digital-tax rate is irrelevant;
- that base breadth dominates rates by a fixed multiplier;
- that the Malaysia LVG episode identifies a causal revenue effect;
- that destination taxation eliminates tax competition;
- that one coded architecture maximizes revenue, compliance, welfare, equity, or administrative efficiency;
- that tighter event coupling is inherently better;
- that formal platform/intermediary liability creates complete fiscal visibility;
- that record retention/reporting proves successful taxpayer matching;
- that procedural-depth evidence proves procedural effectiveness;
- that administrative collection totals identify the effect of node choice;
- that operational control is the sole historical cause of legislative node selection;
- that richer public documentation proves stronger operational performance;
- that the five cases are representative of all ASEAN digital taxation.

## 7. Evidence classes

| Class | Meaning | Permitted use |
|---|---|---|
| `PRIMARY_LAW` | statute, regulation, decree, official legal text | controlling legal proposition and dates |
| `PRIMARY_ADMIN` | tax/customs guidance, portals, official implementation material | procedures, fields, thresholds, operational duties |
| `ADMIN_FACT` | official administrative output | registrations, appointments, reported collections, observed remitter population |
| `SECONDARY_INSTITUTIONAL` | OECD/IMF/WBG/ADB | established design knowledge and policy context |
| `ACADEMIC` | peer-reviewed / serious research | theory, prior art, interpretation |
| `AUTHOR_CONSTRUCT` | paper-created framework/typology | analytical comparison only; must remain labeled |
| `UNKNOWN` | evidence not frozen or not publicly demonstrated | explicit research gap; no forward inference |

## 8. Current coded coverage

The transaction-path dataset currently contains seven paths across five jurisdictions:

- Malaysia foreign-provider digital-services path;
- Indonesia appointed PMSE VAT-collector path;
- Vietnam payment-capable-platform seller-withholding path;
- Thailand nonresident e-service / conditional platform path;
- Philippines B2C NRDSP path;
- Philippines B2B buyer-withholding path;
- Philippines qualifying e-marketplace path.

This prevents a single country label from hiding multiple fiscal nodes.

## 9. Reconciliation and Stage-B operational evidence

The package now goes beyond `law exists` while preserving the boundary between **procedural depth** and **procedural effectiveness**.

- **Malaysia:** transaction records and retention are documented; official MySST material also exposes invoice cancellation, credit/debit-note adjustment, return adjustment, and production of cancelled invoices for audit. Refund/appeal infrastructure is visible, but digital-FSP-specific downstream performance is unresolved.
- **Indonesia:** appointment, collection, remittance, periodic reporting, transaction proof, and some transaction-detail reporting are evidenced; downstream correction/refund/audit/outcome evidence is not promoted comparatively. Reported collections remain administrative facts only.
- **Vietnam:** transaction-level withholding/declaration and identity fields are documented; official procedure also supplies a qualifying e-commerce overpayment/refund rail. Matching, audit yield, and refund performance remain unresolved.
- **Thailand:** VES materials publicly document registration/filing plus refund, audit supervision, electronic appeal, and sanctions. This unusually visible procedural chain does not establish superior performance.
- **Philippines:** VDS registration/filing/payment is documented; BIR Form 2550-DS supports amended returns, prior VAT paid, excess-payment carry-over, and stated penalties. Instrument-specific audit/appeal outcomes remain unresolved.

`OPERATIONAL_CAPACITY_MATRIX.csv` is the coded authority. The manuscript may describe these stages but may not rank country performance from them.

**Still unresolved comparatively:** authority-side matching rates, audit yield, coverage, compliance cost, error rates, dispute incidence, refund-processing performance, and causal outcomes.

## 10. Boundary-test state

The framework is not supported only by positive platform/intermediary cases.

- Thailand: platform liability depends on the continuous offer-payment-delivery process rather than platform presence alone.
- Philippines: marketplace responsibility is conditional; B2B can place the buyer at the fiscal node and marketplace-control conditions limit platform liability.
- Vietnam: the framework distinguishes payment/order-capable platforms from non-payment platform paths where sellers retain declaration/payment responsibility.
- Indonesia: formal DGT appointment activates the selected PMSE collector role.
- Malaysia: thresholds and distinct SToDS/LVG instruments prevent universal activation of one digital-commerce node.

These strengthen the operational-control/legal-activation interpretation but do not prove operational control is the sole cause of legislative choice.

## 11. Research-depth layer

The main rival explanations retained are:

- tax type may mechanically determine node choice;
- international template diffusion may explain common design;
- administrative digital maturity may constrain feasible architectures;
- market concentration may make intermediary administration more attractive;
- formal law may overstate operational reality;
- source availability creates selection bias;
- delegation can generate privacy, due-process, competition, and compliance costs.

Negative/boundary cases and within-country reforms remain the strongest route toward identification.

## 12. Relationship to Invisible Ledger

Invisible Ledger remains separate.

- IL asks what different economic records measure and what their divergence reveals.
- DT begins after a legally relevant taxable/reportable object is defined and asks which node performs a bounded fiscal function.

Neither validates the other by circular inference. The future interface can be represented as:

`record exists -> identity -> legal reportability -> liable node -> transmission -> matching -> verified use -> outcome`

but this is not yet a joint empirical finding. While the IL proposal remains active, DT must not freeze IL terminology beyond this interface.

## 13. Full-capacity frontier

Before consolidation:

1. continue instrument-specific reconciliation/operational evidence collection;
2. gather explanatory evidence on **why** nodes were selected, beyond conditions activating them;
3. extend deliberate negative/boundary cases;
4. identify within-country node shifts suitable for stronger empirical designs;
5. build comparable administrative outcomes only where definitions genuinely harmonize;
6. add governance/compliance-cost evidence;
7. use external cases for analytical leverage, not catalogue size.

## 14. Validation contract

CI must fail when:

- source IDs referenced by claims/data rows disappear;
- required country/path coverage disappears;
- chronology dates are malformed;
- superseded historical claims are promoted;
- manuscript boundary language regresses;
- derived architecture drifts from path codings;
- node/boundary rows lose source-controlled coverage;
- operational Stage-B claims lose source IDs;
- non-Indonesia `observed_outcome` rows are promoted beyond `UNRESOLVED` without a deliberate evidence/validator change;
- Indonesia aggregate collection facts are promoted beyond `ADMIN_FACT_COLLECTION_ONLY` without identified evidence;
- `DT-GAP-002` ceases to preserve the harmonized-outcome evidence gap.

The workflow runs `validate_package.py`, `derive_comparative_findings.py --check`, `validate_boundary_layer.py`, and `validate_operational_capacity.py` on the exact branch tree.

## 15. Current disposition

**Current research status:** `FULL-CAPACITY BUILD`.

The project is a coherent hostile-reviewable comparative paper plus a bounded operational-capacity extension. The objective is not to freeze for submission yet; it is to exhaust high-value institutional evidence and boundary tests before later consolidation with Invisible Ledger.

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
6. **Architecture/performance separation:** legal duties, operational facts, reconciliation evidence, and causal outcomes remain separate evidence layers.
7. **Falsifiable comparative propositions:** operational-control, coupling, node/timing separation, destination/collection separation, intermediation distance, law/operation boundary, tax-label insufficiency, and within-country reform agenda.

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
9. `DERIVED_ARCHITECTURE_SUMMARY.md` — deterministic descriptive output from path codings.
10. `derive_comparative_findings.py` — generator/check for the derived summary.

### C. Analytical controls

11. `LITERATURE_POSITIONING.md`
12. `COMPARATIVE_PROPOSITIONS.md`
13. `ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md`
14. `FULL_CAPACITY_RESEARCH_PLAN.md`
15. `REVIEWER_RISK_REGISTER.md`

### D. Narrative and publication surfaces

16. `FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md`
17. `FIGURES_TABLES_SPEC.md`
18. `SUBMISSION_MATERIALS.md`
19. `QUALITY_GATE.md`

### E. Validation/audit

20. `validate_package.py`
21. `INTERNAL_AUDIT_2026-09-14.md`
22. current validation report after the expanded depth layer is executed in CI.

Narrative prose cannot override the source, claim, and coding registers above it.

## 6. Frozen nonclaims

The package does **not** establish:

- that platform GMV/GTV is a tax base;
- that platform revenue differences reveal hidden GDP or unpaid tax;
- that a digital-tax rate is irrelevant;
- that base breadth dominates rates by a fixed multiplier;
- that the Malaysia LVG episode identifies a causal revenue effect;
- that destination taxation eliminates tax competition;
- that one of the coded architectures maximizes revenue, compliance, welfare, equity, or administrative efficiency;
- that tighter event coupling is inherently better;
- that formal platform/intermediary liability creates complete fiscal visibility;
- that record retention/reporting proves successful taxpayer matching;
- that administrative collection totals identify the effect of node choice;
- that operational control is the sole cause of legislative node selection;
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

This structure deliberately prevents a single country label from hiding multiple fiscal nodes.

## 9. Reconciliation evidence state

The package now goes beyond `law exists` for several cases:

- Malaysia: transaction records, seven-year retention, return amendments and refunds are documented.
- Indonesia: collection proof, periodic reporting, DGT-requested annual transaction-detail reporting, and identifier fields are documented in the frozen source set.
- Vietnam: legal withholding documentation includes platform/seller identity and turnover/tax fields.
- Thailand: output-tax reports and transaction-detail fields can be requested by the Revenue Department; electronic receipt/document exchange exists.
- Philippines: NRDSP invoice fields and VDS registration/filing/payment rails are documented, while the specific regular accounting-record requirement in RR 3-2025 does not apply to NRDSPs.

**Still unresolved comparatively:** actual authority-side matching performance, audit yield, coverage, compliance cost, error rates, dispute incidence, and causal outcomes.

Those remain `UNKNOWN`, not inferred.

## 10. Research-depth layer

`COMPARATIVE_PROPOSITIONS.md` and `ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md` prevent the project from becoming a descriptive list.

The central rival explanations retained are:

- tax type may mechanically determine node choice;
- international template diffusion may explain common design;
- administrative digital maturity may constrain feasible architectures;
- market concentration may make intermediary administration more attractive;
- formal law may overstate operational reality;
- source availability creates selection bias;
- delegation can generate privacy, due-process, competition, and compliance costs.

Negative/boundary cases and within-country reforms are the next highest-value empirical extension.

## 11. Relationship to Invisible Ledger

Invisible Ledger remains a separate measurement/reconciliation project.

- IL asks what different economic records measure and what their divergence reveals.
- DT begins only after a legal taxable/reportable object is defined and asks which node performs a bounded fiscal function.

Neither paper validates the other by circular inference.

The future consolidation interface is traceable through record existence -> identification -> legal reportability -> liable node -> transmission -> matching -> verified use -> outcome, but that umbrella model is not yet a joint empirical finding.

## 12. Full-capacity research frontier

Before final consolidation, prioritize:

1. finish normalized transaction-path fields;
2. expand the reconciliation evidence matrix;
3. collect deliberate negative/boundary cases;
4. gather evidence on why nodes were selected;
5. identify within-country node shifts suitable for stronger empirical designs;
6. build comparable administrative outcome measures only where definitions can genuinely be harmonized;
7. add governance/compliance-cost evidence;
8. use external cases for analytical leverage, not catalogue size.

See `FULL_CAPACITY_RESEARCH_PLAN.md`.

## 13. Validation contract

The validator must fail when:

- source IDs referenced by claims, country rows, path rows, or chronology rows are absent;
- required country/path coverage disappears;
- chronology dates are malformed;
- historical superseded claims are promoted;
- manuscript boundary language regresses;
- required depth-layer files disappear.

CI must also run `derive_comparative_findings.py --check` so the derived comparative output cannot drift from the coded paths.

## 14. Current disposition

**Current research status:** `FULL-CAPACITY BUILD`.

The project is already a coherent hostile-reviewable comparative paper, but the current objective is **not** to freeze it for submission. The objective is to exhaust the high-value institutional evidence and boundary tests before consolidation with Invisible Ledger.

The package should be promoted later only on evidence, not because the remaining checklist becomes inconvenient.
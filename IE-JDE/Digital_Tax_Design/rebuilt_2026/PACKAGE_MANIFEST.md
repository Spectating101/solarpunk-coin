# Fiscal Choke Points — Package Manifest

**Package ID:** `DT-FCP-2026-001`  
**Status:** `HOSTILE-REVIEW READY / NOT YET SUBMISSION-FROZEN`  
**Canonical branch:** `digital-tax/rebuild-2026`  
**Research object:** comparative institutional paper on fiscal choke points in Southeast Asian digital commerce

## 1. Central question

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

## 2. Central proposition

> Heterogeneous digital-tax regimes can be compared by where they attach legally bounded fiscal duties inside private transaction infrastructure. The relevant architecture consists of a taxable object, liable node, destination or nexus evidence, transaction rail, and reconciliation relationship.

## 3. Contribution hierarchy

1. **Comparative construct:** fiscal choke point as a common unit for comparing unlike digital-tax instruments without treating them as one tax base.
2. **Five-component architecture:** taxable object, liable node, destination evidence, transaction rail, reconciliation power.
3. **Cross-cutting dimensions:** node locus and event coupling.
4. **Five-country application:** Malaysia, Indonesia, Vietnam, Thailand, Philippines.
5. **Bounded comparative findings:** responsibility follows operational control functions; event coupling varies; concentrated intermediation can reduce administrative distance without proving total visibility or causal revenue gains.

## 4. Canonical files

Read in this order:

1. `CLAIM_BOUNDARIES.md` — hard inference limits.
2. `SOURCE_CATALOG.csv` — source authority and verification state.
3. `CLAIM_REGISTER.csv` — canonical claim inventory.
4. `COUNTRY_ARCHITECTURE.csv` — structured comparative evidence.
5. `CODING_RULES.md` — reproducible node-locus/event-coupling coding rules.
6. `LITERATURE_POSITIONING.md` — novelty and prior-art boundary.
7. `FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md` — narrative manuscript.
8. `FIGURES_TABLES_SPEC.md` — publication visuals/tables.
9. `REVIEWER_RISK_REGISTER.md` — hostile-review risks and required fixes.
10. `SUBMISSION_MATERIALS.md` — abstract, highlights, cover-letter core, and venue-neutral metadata.
11. `QUALITY_GATE.md` — final freeze criteria.
12. `validate_package.py` — structural consistency validator.
13. `INTERNAL_AUDIT_2026-09-14.md` — package-level audit trail.

Narrative prose cannot override the registers above it.

## 5. Frozen nonclaims

The package does **not** establish:

- that platform GMV/GTV is a tax base;
- that platform revenue differences reveal hidden GDP or unpaid tax;
- that digital-tax rates do not matter;
- that base breadth dominates rate design by a fixed ratio;
- that the Malaysia LVG episode identifies a causal revenue effect;
- that destination-based taxation eliminates tax competition;
- that one of the five architectures maximizes revenue or welfare;
- that tighter event coupling is inherently superior;
- that platform intermediation creates complete fiscal visibility;
- that commercial access to transaction data implies unrestricted state entitlement to those data.

## 6. Evidence classes

| Class | Meaning | Manuscript use |
|---|---|---|
| `PRIMARY_LAW` | statute, regulation, decree, official legal text | controlling legal proposition and dates |
| `PRIMARY_ADMIN` | tax/customs administration guidance or portal | operational duties, thresholds, procedures |
| `ADMIN_FACT` | official administrative output | registrations, appointments, reported collections |
| `SECONDARY_INSTITUTIONAL` | OECD/IMF/WBG/ADB guidance | literature and comparative context |
| `ACADEMIC` | peer-reviewed or working-paper scholarship | theory, prior art, interpretation |
| `AUTHOR_CONSTRUCT` | framework or typology created by the paper | must be labeled as analytical construct |

## 7. Country evidence status

- **Malaysia:** destination, threshold, quarterly period, and platform/FSP guidance are frozen from current official surfaces; comparable reconciliation/audit evidence remains incomplete.
- **Indonesia:** collector role, transaction documentation, current monthly remittance/periodic-return procedure, and official administrative-scale evidence are frozen; comparable reconciliation/audit evidence remains incomplete.
- **Vietnam:** Decree 117’s July 2025 transaction-level mechanism is source-frozen and currentness-checked through Decree 68/2026, which expressly preserves per-transaction platform withholding under Decree 117, and Decree 141/2026, which amends specified Decree 68 thresholds. Comparable reconciliation evidence remains incomplete.
- **Thailand:** VES threshold/rail and the continuous-process platform rule are frozen in both governing law and guidance; comparable reconciliation/audit evidence remains incomplete.
- **Philippines:** destination, B2C provider remittance, and B2B/marketplace withholding paths are frozen from 2025 BIR materials; comparable reconciliation/audit evidence remains incomplete.

The common reconciliation gap is preserved as a limitation. It does not block the present comparative-institutional claim because the paper does not rank performance on that missing variable.

## 8. Required deliverables for final freeze

Completed internally:

- complete rewritten manuscript with references;
- claim register;
- source catalog;
- structured country architecture;
- coding rules;
- literature-positioning map;
- figures/tables specification;
- hostile-review register;
- venue-neutral submission materials;
- quality gate;
- structural validator;
- internal package audit.

Still required before `SUBMISSION CANDIDATE`:

- actual recorded validator run;
- independent re-code of node locus/event coupling;
- one external or independent novelty/hostile review;
- final just-before-submission source-currentness check;
- final release hash/tag;
- venue-specific formatting only after a route is selected and current author instructions are verified.

## 9. Go / stop rules

### Go when

- every central sentence maps to a claim ID or clearly marked author interpretation;
- prior art is acknowledged before novelty is claimed;
- all five country cases preserve their different legal objects;
- dates distinguish announcement from legal effect where necessary;
- comparative findings can be reconstructed from `COUNTRY_ARCHITECTURE.csv` and `CODING_RULES.md`;
- no administrative collection number is used as a causal estimate;
- the paper remains valuable without the superseded rate regressions.

### Reduce a claim when

- an official guide supports less than the prose says;
- a current and historical source conflict;
- the paper moves from `can` or `may` to measured efficiency without cost evidence;
- a cross-country statement relies on fewer cases than the wording implies.

### Stop the package when

- the manuscript reintroduces hidden-tax-base rhetoric from old Invisible Ledger framing;
- superseded causal results become central again without fresh identification;
- `fiscal choke point` is presented as invention of platform VAT/GST liability rather than a comparative construct;
- the final paper ranks architectures without comparable performance evidence;
- a future rewrite removes the source/claim boundaries to make the paper sound stronger.

## 10. Final publication identity

The paper should be presented as **comparative tax administration / digital political economy**, not as a causal revenue paper and not as a tax-rate optimization paper.

Its strongest one-sentence identity is:

> *Fiscal Choke Points* shows how five Southeast Asian tax systems place fiscal responsibility at different nodes of private digital transaction infrastructure, and provides a common architecture for comparing those choices without flattening their legal differences.
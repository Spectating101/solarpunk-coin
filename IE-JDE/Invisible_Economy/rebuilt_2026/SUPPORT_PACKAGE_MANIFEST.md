# Invisible Ledger V2 — Support Package Manifest

**Status:** `ACTIVE FULL-CAPACITY SUPPORT BUILD / MIXED FROZEN + PROVISIONAL EVIDENCE`  
**Branch:** `invisible-ledger/full-capacity-2026`  
**Authority boundary:** the active September 2026 proposal/research-preview still governs the research question, scope, and inferential boundaries. This branch does **not** edit or replace that proposal.

## 1. Research function

Build the empirical, definition, provenance, currentness, exclusion, and reproduction machinery underneath Invisible Ledger V2 so the eventual manuscript can be written from controlled evidence rather than remembered numbers.

Legacy `Invisible_Economy` material on `main` remains historical unless independently re-admitted. Residual-centric language does not govern V2.

## 2. Current V2 sequence

1. **Issuer growth translation** — test whether transaction activity and recognized revenue provide the same longitudinal growth signal inside a documented perimeter.
2. **Mechanism reconciliation** — explain material divergence using source-native accounting/operating components where evidence permits.
3. **Broader digital-growth anatomy** — locate growth across BPS business/channel measures and Bank Indonesia payment traces without forcing level equivalence.
4. **Institutional visibility** — separate record existence, legal reportability, transmission, matching, verified use, and observed outcome.
5. **External corroboration** — retain broader issuer/ASEAN evidence only as recurrence/heterogeneity evidence, not pooled causal proof.

## 3. Authority order

### A. Source and exclusion control

1. `SOURCE_REGISTER.csv`
2. `EXCLUSION_LEDGER.csv`

### B. Issuer evidence

3. `ISSUER_DEFINITION_LEDGER.csv`
4. `ISSUER_TRANSITION_LEDGER.csv`
5. `TOKOPEDIA_RECONCILIATION.csv`

### C. Broader-economy evidence

6. `BPS_GROWTH_ANATOMY.csv`
7. `BPS_BUSINESS_CHARACTERISTICS.csv`
8. `BI_DEFINITION_LEDGER.csv`

### D. Institutional evidence

9. `INSTITUTIONAL_VISIBILITY_MATRIX.csv`

### E. Result authority

10. `RESULT_REPRODUCTION_MAP.csv`

### F. Design/support documents

11. `EVIDENCE_FREEZE_PREVIEW.md`
12. `DATA_PRODUCT_SCHEMAS.md`

### G. Validation

13. `validate_support_package.py`
14. `validate_reproduction_map.py`
15. `.github/workflows/invisible-ledger-support-validation.yml`

Narrative proposal/manuscript prose may interpret controlled results, but it cannot silently override the source, definition, exclusion, currentness, or result-status layers.

## 4. Evidence-status rule

The package deliberately allows mixed states.

- `FROZEN_*` — source-native input and permitted inference are sufficiently pinned for V2 use.
- `PREVIEW_*` / `*_PENDING_LOCATOR` — arithmetic may be reproduced but primary table/cell definition freeze remains incomplete.
- `BLOCKED` / `ADVISOR_GATE` — no headline result may be produced.
- `CURRENTNESS_FROZEN_<date>` — valid only at stated currentness date and must be refreshed after the scheduled event/new official notice.
- `UNKNOWN` — absence of evidenced downstream stage; never silently converted to zero, failure, or success.

A green CI run means these state boundaries are structurally consistent. It does not promote provisional evidence.

## 5. Frozen nonclaims

Do not promote any of the following without a new evidentiary design:

- `transaction value - platform revenue = hidden economy`;
- platform-mediated transaction value = GDP, value added, participant income, taxable income, or unpaid tax;
- the old ASEAN-wide `$185B` calibration as a V2 result;
- the old `12.3x fiscal multiplier` as a V2 result;
- Malaysia LVG as causal validation of the old residual construct;
- calibrated ASEAN platform take rates as population parameters;
- payment-system values as one-for-one e-commerce sales;
- marketplace participation as causal formalization;
- legal reportability as proof of transmission, matching, verified use, compliance, or revenue effects;
- the July 2026 marketplace appointment announcement as evidence that PMK 37 marketplace withholding is currently operating in September 2026.

## 6. Current frozen issuer result — Tokopedia FY2022→FY2023

The strongest V2 mechanism case is now source-audited rather than merely carried from proposal prose.

`ISSUER_TRANSITION_LEDGER.csv` and `TOKOPEDIA_RECONCILIATION.csv` freeze:

- E-commerce/Tokopedia GTV: Rp273,146bn → Rp248,836bn (`-8.90000220%`);
- third-party gross segment revenue: Rp8,143,239m → Rp8,988,909m;
- customer incentives: Rp4,112,320m → Rp2,813,719m;
- third-party net segment revenue: Rp4,030,919m → Rp6,175,190m (`+53.19558642%`);
- gross-revenue increase: Rp845,670m;
- incentive reduction: Rp1,298,601m;
- net-revenue increase: Rp2,144,271m;
- incentive reduction / net-revenue increase: `60.56142157%`.

The accounting identity is exact:

`845,670 + 1,298,601 = 2,144,271`.

This is an **arithmetic accounting reconciliation**, not a causal decomposition of demand, platform welfare, incentives, or firm performance.

`ISSUER_DEFINITION_LEDGER.csv` preserves the distinction between GTV as an operating metric, the Tokopedia reportable segment, management gross-revenue highlights, and audited Note 29 third-party gross/net segment revenue.

## 7. Advisor gates remain untouched

- Blibli's travel-inclusive third-party segment remains `ADVISOR_GATE`.
- Bukalapak's broader group geography remains `ADVISOR_GATE`.
- The final common revenue basis beyond the frozen Tokopedia mechanism remains subject to the active proposal/advisor decision.

No support-file update may silently resolve those choices.

## 8. BPS state

### Stronger/frozen component

The revised BPS marketplace publication supports observational differences such as financial-statement ownership (`28.63%` marketplace vs `12.25%` non-marketplace). These are descriptive associations only.

### Arithmetic reproduced but locator-pending

The current BPS growth ledger carries and recomputes the V2 2023→2024 transaction/channel anatomy, including approximately:

- total e-commerce transaction value: `+17.08%`;
- marketplace component: `+1.45%`;
- non-marketplace component: `+20.57%`;
- non-marketplace share of nominal increase: `~98.46%`.

The 2024 primary publication is identified, but exact table/cell locators still need to be captured before these rows are promoted from preview to frozen results.

### Explicitly blocked component

The 2023/2024 business-count result and implied value/business are **not frozen**. A conflicting rendering of the 2023 count must be resolved against the authoritative source table before the reported `~15.31%` count growth or `~1.54%` implied value/business result may be used as a frozen finding.

## 9. Bank Indonesia state

The official SPIP release family is pinned, including December 2024, December 2025, and the current release index. Headline payment-growth values remain supporting traces only until exact workbook series definitions and locators are frozen.

Payment traces must never be treated as one-for-one e-commerce sales, issuer GTV, output, participant income, GDP, or taxable base.

## 10. Institutional-visibility current state

PMK 37/2025 supplies a legal architecture linking seller identity/turnover to marketplace withholding/reporting responsibilities, but the current operational state must reflect later DJP notices.

As of `2026-09-14`:

- legal architecture: supported;
- July 2026 initial marketplace appointments: historical implementation event;
- current activation: postponed through `2026-10-31`;
- scheduled collection start: `2026-11-01` subject to currentness refresh;
- earlier appointment decisions: to be cancelled/reissued under the postponement announcement;
- transmission/matching/verified use/outcomes: not established by this package.

`INSTITUTIONAL_VISIBILITY_MATRIX.csv` is the authority for this state. `RESULT_REPRODUCTION_MAP.csv` requires a fresh currentness check on or after 1 November 2026.

## 11. Result reproduction contract

Every promoted V2 result should map:

`result ID -> controlled input rows -> transformation -> output status -> source IDs -> allowed manuscript use -> blocker/refresh rule`.

Current examples include:

- `IL-R01` audited Tokopedia opposite-direction growth signal — `FROZEN_RESULT`;
- `IL-R02` audited Tokopedia incentive arithmetic bridge — `FROZEN_DERIVED`;
- `IL-R03/R04` BPS growth/channel decomposition — preview pending direct 2024 table locator;
- `IL-R05` BPS financial-statement group difference — frozen observational;
- `IL-R06` business-count/implied-value result — `BLOCKED`;
- `IL-R07` BI payment traces — definition freeze pending;
- `IL-R08` PMK 37 current operational state — dated currentness freeze;
- `IL-R09` no matching/outcome evidence — frozen nonclaim.

## 12. Validation contract

CI must fail if:

- frozen result/source IDs disappear;
- Tokopedia's audited accounting bridge no longer reconciles;
- the incentive share changes without changing the audited inputs;
- Blibli/Bukalapak advisor gates are silently promoted;
- BPS business-count results are promoted before source resolution;
- BI measures lose their forbidden-equivalence guardrails;
- PMK 37 is represented as currently active before the official delayed start/currentness refresh;
- matching/outcome stages are promoted without evidence;
- result rows lose their source/blocker/refresh paths.

## 13. Relationship to Digital Tax

Invisible Ledger remains a measurement/reconciliation project. Digital Tax/Fiscal Choke Points starts from a legally defined taxable/reportable object and studies where a bounded fiscal function is assigned in the transaction chain.

The projects may later share an umbrella visibility interface, but neither validates the other by circular inference. Consolidation waits until both individual evidence systems are substantially exhausted.

## 14. Immediate research frontier

While the proposal remains active:

1. resolve exact BPS 2024 table/cell locators;
2. resolve the BPS business-count conflict before promoting count-growth/value-per-business results;
3. extract/freeze BI workbook definitions and series locators;
4. continue source-native issuer definitions without resolving Blibli/Bukalapak advisor gates;
5. keep PMK 37 currentness refreshed around the scheduled 1 November 2026 activation;
6. expand the result reproduction map only from controlled inputs;
7. do not write the full V2 results chapter ahead of these controls.

# Invisible Ledger — Publication Figures and Tables Contract

**Canonical manuscript:** `INVISIBLE_LEDGER_PUBLICATION_CANDIDATE_2026.md`

Visuals must preserve source-native units and make record non-equivalence visible. They must not imply that different modules can be added into a hidden-economy aggregate.

## Figure 1 — Observation-layer architecture

```text
DIGITAL-COMMERCIAL ACTIVITY
        │
        ├── issuer accounting
        │      transaction metric → gross revenue → incentives → net revenue
        │
        ├── BPS business/statistical record
        │      transaction value → channels → businesses → characteristics
        │
        ├── Bank Indonesia payment record
        │      mobile / internet payment transactions
        │
        └── administrative record
               private record → legal duty → activation → transmission → matching → use → outcome
```

**Caption:** the branches record related but non-equivalent economic objects. The framework compares interpretation across records; it does not sum them.

---

## Figure 2 — Tokopedia FY2022-FY2023 opposite growth signals

Two bars/points or a slope chart:

- E-commerce GTV growth: **-8.90%**
- Third-party net segment revenue growth: **+53.20%**

Add a side annotation:

> Opposite growth signals inside a documented issuer/segment perimeter do not imply either measure is wrong; they motivate mechanism reconciliation.

Do not plot the absolute GTV and revenue levels on a common scale as though they were comparable monetary objects.

---

## Figure 3 — Tokopedia audited accounting bridge

Waterfall using source-native Rp trillion amounts:

```text
FY2022 third-party net segment revenue   4.031
+ gross third-party revenue increase     0.846
+ reduction in customer incentives       1.299
----------------------------------------------
FY2023 third-party net segment revenue   6.175
```

Annotation:

- incentive reduction / arithmetic net-revenue increase = **60.56%**;
- accounting identity only;
- no causal attribution to management policy, demand, seller welfare, or profitability.

Source of truth: `TOKOPEDIA_RECONCILIATION.csv`.

---

## Figure 4 — BPS channel anatomy, 2023 to 2024

Use paired bars or change bars:

| Channel | 2023 | 2024 | Growth |
|---|---:|---:|---:|
| Marketplace | Rp200.68tn | Rp203.58tn | +1.45% |
| Non-marketplace | Rp900.19tn | Rp1,085.35tn | +20.57% |
| Total | Rp1,100.87tn | Rp1,288.93tn | +17.08% |

Callout:

> Non-marketplace component accounts for **98.46%** of the nominal increase in the published total.

**Boundary:** arithmetic decomposition, not causal contribution, informality, GDP, or tax-gap estimate.

---

## Figure 5 — Different records, different growth signals

A definition-controlled comparison of **growth rates only**, with strong labels:

- BPS e-commerce transaction value: +17.08% (2023→2024)
- BPS estimated e-commerce business count: +15.30% (official reported growth statement)
- BI mobile+internet digital-payment transaction volume: +36.1% (2024 YoY)
- BI mobile transaction volume: +39.1%
- BI internet transaction volume: +4.4%

**Required caption:** the series have different units, populations, and definitions. The figure demonstrates divergent observation signals; it is not a like-for-like performance comparison.

Do not add QRIS growth to the main figure until the official-vintage discrepancy is reconciled.

---

## Figure 6 — Institutional visibility status as of 2026-09-14

```text
RECORD EXISTS            SUPPORTED
      ↓
ACTOR HOLDS RECORD       SUPPORTED/PARTIAL
      ↓
LEGAL DUTY               SUPPORTED — PMK 37/2025
      ↓
INITIAL APPOINTMENT      HISTORICAL EVENT
      ↓
OPERATIONAL ACTIVATION   DELAYED → scheduled 2026-11-01
      ↓
TRANSMISSION             NOT YET CLAIMED AS OBSERVED
      ↓
MATCHING                 UNKNOWN
      ↓
VERIFIED USE             UNKNOWN
      ↓
OUTCOME                  UNKNOWN
```

The visual must include the **currentness date** and a note that it requires refresh on/after 2026-11-01.

---

## Table 1 — Evidence modules and non-equivalence rules

Columns:

1. module;
2. source authority;
3. economic object;
4. unit;
5. allowed interpretation;
6. forbidden equivalence.

Rows:

- GoTo/Tokopedia;
- BPS e-commerce;
- Bank Indonesia payments;
- PMK 37 / DJP administration.

---

## Table 2 — Tokopedia mechanism table

Source of truth: `TOKOPEDIA_RECONCILIATION.csv`.

Include:

- GTV;
- third-party gross segment revenue;
- customer incentives;
- third-party net segment revenue;
- changes and arithmetic bridge.

---

## Table 3 — BPS growth anatomy

Source of truth: `BPS_GROWTH_ANATOMY.csv`.

Publication rows:

- total transaction value;
- marketplace component;
- non-marketplace component;
- official 15.30% business-count growth statement.

Do **not** publish exact 2024 business count or implied value/business until source control changes their status.

---

## Table 4 — Marketplace/non-marketplace business characteristics

At minimum:

- financial-statement ownership: 28.63% vs 12.25%;
- ICT training: 8.49% vs 2.83%.

Every caption must state that the comparison is observational and does not establish marketplace-induced formalization.

---

## Table 5 — Institutional visibility matrix

Source of truth: `INSTITUTIONAL_VISIBILITY_MATRIX.csv`.

Columns:

- stage;
- evidence status;
- source IDs;
- current interpretation;
- what cannot yet be claimed.

This table is preferred over vague prose describing PMK 37 as already “implemented.”

---

## Figure/table rules

- never add issuer GTV and BPS transaction value;
- never show transaction-minus-revenue as a residual wedge;
- never label payment volume as e-commerce sales;
- never plot incompatible levels on one unqualified axis;
- growth-rate comparisons across records require explicit definition warnings;
- no `$185B/$192B` ASEAN residual graphic;
- no 12.x multiplier visual;
- no implied value/business result until exact count levels are frozen;
- no single 2024 QRIS headline growth rate until the source-vintage conflict is resolved;
- PMK 37 figures require a currentness date.

## Minimum journal set

Preferred minimum:

1. Figure 1 — observation-layer architecture;
2. Figure 2 — opposite issuer growth signals;
3. Figure 3 — audited Tokopedia bridge;
4. Figure 4 — BPS channel anatomy;
5. Figure 6 — institutional visibility;
6. Table 1 — evidence/non-equivalence rules.

Figure 5 is useful for the synthesis section if the venue permits an additional figure.

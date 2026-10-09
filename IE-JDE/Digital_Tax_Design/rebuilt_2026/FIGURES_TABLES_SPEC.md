# Fiscal Choke Points — Publication Figures and Tables Contract

**Canonical manuscript:** `FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md`

Visuals must represent legal/administrative architecture without implying tax-base size, causal performance, or country ranking.

## Figure 1 — Two-stage fiscal architecture

```text
STAGE A — LEGAL / TRANSACTION-PATH ARCHITECTURE

covered commercial event
        ↓
taxable object
        ↓
destination / nexus evidence
        ↓
liable node
        ↓
transaction / reporting rail
        ↓
reconciliation power

STAGE B — OPERATIONAL / PROCEDURAL CAPACITY

filing / declaration
        ↓
correction / amendment
        ↓
refund / reversal
        ↓
audit / review
        ↓
appeal / dispute
        ↓
enforcement / sanction
        ↓
observed outcome
```

**Required note:** Stage A does not imply Stage B performance. Formal liability, public procedural documentation, and observed administrative effectiveness are separate evidence classes.

**Forbidden implication:** never draw GMV/GTV flowing through this diagram into tax revenue.

---

## Figure 2 — Seven transaction paths by node locus and event coupling

Plot **paths**, not whole countries.

Horizontal organization by node locus:

- provider;
- appointed intermediary / collector;
- payment-capable platform;
- conditional platform;
- buyer / withholding agent;
- qualifying marketplace.

Vertical organization by event coupling:

- periodic/reporting-centered;
- collection-coupled;
- transaction/payment-coupled;
- mixed/conditional.

Paths to label:

1. MY-STODS-01;
2. ID-PMSE-01;
3. VN-SELLER-01;
4. TH-VES-01;
5. PH-B2C-01;
6. PH-B2B-01;
7. PH-MKT-01.

**Caption boundary:** positions summarize only the instrument/path studied. Axes are categorical comparative dimensions, not a maturity, effectiveness, or desirability score.

---

## Figure 3 — Activation boundary cases

**Purpose:** visually show that digital-intermediary presence alone is insufficient.

Use four paired mini-flows:

### Thailand

```text
platform involved
    +
continuous offer → payment → delivery control?
             │
       yes ──┴── no
       ↓          ↓
platform duty   baseline provider path remains relevant
```

### Philippines

```text
e-marketplace involved
    +
payment within marketplace control?
       yes / statutory path       no / direct NRDSP payment
       ↓                           ↓
marketplace path may apply        cited marketplace VAT liability does not attach
```

### Vietnam

```text
platform-mediated seller activity
    +
online ordering + payment functionality?
       yes                         no
       ↓                           ↓
platform withholding path         applicable seller self-declaration/payment path
```

### Indonesia

```text
PMSE commercial presence
    +
formal DGT appointment?
       yes                 no
       ↓                   ↓
collector duty             no special appointed-collector status from presence alone
```

**Caption:** boundary cases test the legal-activation framework; they do not prove that operational control is the sole causal reason legislatures choose a node.

---

## Figure 4 — Architecture versus performance evidence

Use a two-column or ladder visualization:

| What current paper can code | What current paper cannot infer without outcomes |
|---|---|
| liable node | compliance improvement |
| tax/withholding point | lower evasion |
| filing rail | filing timeliness |
| correction/refund mechanism | correction/refund effectiveness |
| audit/appeal authority | audit yield or due-process quality |
| penalties | deterrence magnitude |

This figure should make the paper's non-ranking discipline visible to reviewers.

---

## Table 1 — Analytical components

Columns:

1. component;
2. coding question;
3. evidence required;
4. common overclaim prevented.

Rows:

- taxable object;
- liable node;
- destination/nexus evidence;
- transaction rail;
- event coupling;
- reconciliation power.

---

## Table 2 — Seven-path architecture matrix

Source of truth: `COUNTRY_PATH_CODINGS.csv` plus `NODE_SELECTION_CONDITIONS.csv`.

Recommended columns:

1. path ID / jurisdiction;
2. covered object;
3. liable node;
4. activation/control condition;
5. nexus evidence;
6. transaction rail;
7. event coupling;
8. principal primary-source IDs.

Do not collapse the three Philippine paths into one row.

---

## Table 3 — Boundary/countercase matrix

Source of truth: `BOUNDARY_CASES.csv`.

Columns:

1. jurisdiction/path;
2. broad hypothesis that would fail;
3. observed legal boundary;
4. analytical implication;
5. source IDs.

This table is central to the publication candidate because it demonstrates falsifiability rather than positive-case cataloguing.

---

## Table 4 — Operational-capacity evidence matrix

Source of truth: `OPERATIONAL_CAPACITY_MATRIX.csv`.

Columns:

1. jurisdiction/instrument;
2. filing;
3. correction/amendment;
4. refund/reversal;
5. audit/review;
6. appeal/dispute;
7. enforcement/sanction;
8. observed outcome evidence;
9. boundary note.

Cell values should be categorical evidence states (`EVIDENCED`, `PARTIAL`, `UNRESOLVED`) plus brief source notes. **Never convert the row into a numeric score.**

---

## Table 5 — Prior art versus paper contribution

Recommended for reviewers if table limits permit.

| Established prior art | What this paper adds |
|---|---|
| firms as fiscal intermediaries | source-controlled cross-instrument transaction paths |
| VAT information trails | seven-path ASEAN application |
| platform functional/capability criteria | node locus/event coupling as explicit comparative coding dimensions |
| payment/taxing-point design | cross-path timing comparison without ranking |
| supply-chain choke-point taxation | digital-transaction specialization, not invention of chokepoint logic |
| ASEAN digital-tax comparisons | within-regime countercases and Stage-A/Stage-B separation |

---

## Visual rules

- no platform logos;
- no country traffic-light ranking;
- no common-currency revenue bars unless bases/periods are actually comparable;
- no causal arrows from architecture to revenue/compliance;
- no “more coupled = better” visual gradient;
- no hidden-tax-base funnel from GMV/GTV;
- identify paths/instruments rather than depicting an entire country's tax system;
- source notes should reference canonical IDs where practical.

## Minimum journal set

Preferred minimum:

1. Figure 1 — Stage A / Stage B architecture;
2. Figure 3 — activation boundary cases;
3. Table 2 — seven-path architecture;
4. Table 3 — boundary cases;
5. Table 4 — operational-capacity evidence.

Figure 2 is useful if the selected venue tolerates a conceptual typology plot. Table 5 is useful where novelty differentiation needs to be made unusually explicit.

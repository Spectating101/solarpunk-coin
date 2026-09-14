# Fiscal Choke Points — Figures and Tables Specification

This file defines the publication visuals for the rebuilt paper. Figures are conceptual/comparative unless a quantitative source is explicitly frozen.

## Figure 1 — Fiscal choke-point architecture

**Purpose:** make the core framework visible in one diagram.

```text
COMMERCIAL EVENT
      ↓
TAXABLE OBJECT
      ↓
LIABLE NODE
      ↓
DESTINATION / NEXUS EVIDENCE
      ↓
TRANSACTION / FILING RAIL
      ↓
RECONCILIATION RELATIONSHIP
      ↓
BOUNDED FISCAL ACTION
```

### Required annotation

A side note should state:

> Commercial observability does not itself establish taxability. Each transition is bounded by the applicable legal rule.

### Forbidden visual implication

Do not depict the sequence as a funnel from total GMV to tax revenue. That would reintroduce the false assumption that all platform-mediated activity is a latent tax base.

---

## Figure 2 — Node locus × event coupling typology

**Purpose:** show the main comparative result without pretending to rank countries.

Use a two-dimensional conceptual plot:

- horizontal axis: **node locus** from provider-centered → platform/collector-centered → buyer/split nodes;
- vertical axis: **event coupling** from periodic/reporting-centered → collection-coupled → transaction-coupled.

### Expected placements

- **Malaysia:** provider-centered / periodic.
- **Indonesia:** appointed collector / collection-coupled.
- **Vietnam:** payment-capable platform / transaction-coupled.
- **Thailand:** provider-centered with conditional platform shift / intermediate conditional coupling.
- **Philippines:** split provider-buyer-marketplace nodes / mixed coupling by transaction type.

### Caption boundary

> Positions summarize the specific instruments examined in the paper and are not rankings of overall tax-system maturity or effectiveness.

---

## Table 1 — Five components of a fiscal choke point

Columns:

1. component;
2. comparative question;
3. administrative failure if absent;
4. evidence type needed.

Rows:

- taxable object;
- liable node;
- destination evidence;
- transaction rail;
- reconciliation power.

The manuscript already contains the first three columns. Add `evidence type needed` in the publication version if space permits.

---

## Table 2 — Five-country architecture matrix

Source of truth: `COUNTRY_ARCHITECTURE.csv`.

Publication columns:

1. jurisdiction;
2. object examined;
3. liable node / node locus;
4. destination or nexus evidence;
5. transaction rail;
6. event coupling.

Do not add a single revenue column unless the table makes clear that the figures are non-comparable administrative facts rather than a cross-country outcome metric.

---

## Table 3 — Evidence and limitation matrix

**Purpose:** show research discipline explicitly.

Suggested rows by jurisdiction and columns:

- legal rule frozen?;
- operational administration source?;
- administrative scale evidence?;
- reconciliation/audit evidence?;
- comparable compliance-cost evidence?;
- remaining limitation.

Expected high-level result:

- legal and operational evidence: relatively strong;
- comparable reconciliation and compliance-cost evidence: incomplete.

This table turns the paper’s limitations into inspectable research design rather than defensive prose.

---

## Optional Figure 3 — Invisible Ledger → Fiscal Choke Points boundary

Use only when the venue tolerates a conceptual companion-project figure.

```text
INVISIBLE LEDGER
measurement boundary

platform revenue ≠ transaction value ≠ participant income ≠ GDP ≠ taxable base

                ↓ only after legal object is defined

FISCAL CHOKE POINTS
administrative architecture

taxable object → liable node → nexus → rail → fiscal action
```

### Caption

> The companion projects separate measurement from fiscal administration. A difference between accounting objects does not itself establish tax liability.

---

## Visual quality rules

- no decorative platform logos;
- no arrows implying causal revenue growth;
- no heat-map scoring of countries without a validated measurement model;
- no common-currency revenue comparison unless periods, tax bases, and instruments are harmonized;
- country labels should identify the instrument studied rather than imply whole-tax-system coverage;
- source notes should reference claim/source IDs where practical.

## Minimum publication set

For a standard journal submission, include:

1. Figure 1 — architecture;
2. Figure 2 — node locus/event coupling;
3. Table 1 — framework;
4. Table 2 — country architecture;
5. Table 3 — evidence/limitations, if word-count and table limits allow.
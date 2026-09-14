# Digital Tax Design — 2026 Rebuild

**Status:** active research rebuild  
**Canonical paper:** *Fiscal Choke Points: How Southeast Asian States Are Re-entering Platform Commerce*  
**Canonical branch:** `digital-tax/rebuild-2026`  
**Package root:** [`rebuilt_2026/`](./rebuilt_2026/)

## Current research question

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

The rebuild treats digital taxation as an institutional-design problem before it treats it as a rate-comparison problem. Governments assign registration, identification, collection, withholding, reporting, and remittance duties to actors that already organize parts of the transaction process.

The core analytical construct is the **fiscal choke point**: a legally activated transaction node where a state assigns a bounded fiscal function to an actor positioned to observe or control the relevant commercial event.

The paper does **not** claim that platform tax intermediation is new. Its contribution is a comparative architecture for showing where and how heterogeneous digital-tax regimes activate fiscal responsibility.

## Canonical analytical components

Each country-instrument architecture is compared through five components:

1. **Taxable object** — what sale, service, import, payment, or facilitated transaction is legally in scope?
2. **Liable node** — which supplier, platform, payment intermediary, buyer, or other actor must act?
3. **Destination / nexus evidence** — why does the transaction belong to the jurisdiction?
4. **Transaction rail** — how is the duty repeatedly performed through registration, checkout, invoicing, withholding, filing, or payment?
5. **Reconciliation power** — what reporting or record relationship permits verification or audit?

The rebuild also compares two cross-cutting dimensions:

- **node locus** — where responsibility sits in the commercial chain;
- **event coupling** — how tightly fiscal action is tied to the underlying commercial event.

These are descriptive analytical dimensions, not maturity scores.

## Relationship to Invisible Ledger

`Invisible Ledger` and Digital Tax perform different research jobs.

```text
Invisible Ledger
measurement / accounting boundary

platform revenue ≠ transaction value ≠ participant income ≠ GDP ≠ taxable base

        ↓ only after the legal object is defined

Fiscal Choke Points
administrative / institutional architecture

taxable object → liable node → nexus → rail → bounded fiscal action
```

Digital Tax must never use a platform-revenue / transaction-value difference as proof of hidden GDP, unpaid tax, tax evasion, or a directly recoverable tax base.

## Research authority

Read the rebuild in this order:

1. [`rebuilt_2026/CLAIM_BOUNDARIES.md`](./rebuilt_2026/CLAIM_BOUNDARIES.md)
2. [`rebuilt_2026/SOURCE_CATALOG.csv`](./rebuilt_2026/SOURCE_CATALOG.csv)
3. [`rebuilt_2026/CLAIM_REGISTER.csv`](./rebuilt_2026/CLAIM_REGISTER.csv)
4. [`rebuilt_2026/COUNTRY_ARCHITECTURE.csv`](./rebuilt_2026/COUNTRY_ARCHITECTURE.csv)
5. [`rebuilt_2026/LITERATURE_POSITIONING.md`](./rebuilt_2026/LITERATURE_POSITIONING.md)
6. [`rebuilt_2026/FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md`](./rebuilt_2026/FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md)
7. [`rebuilt_2026/PACKAGE_MANIFEST.md`](./rebuilt_2026/PACKAGE_MANIFEST.md)
8. [`rebuilt_2026/FIGURES_TABLES_SPEC.md`](./rebuilt_2026/FIGURES_TABLES_SPEC.md)
9. [`rebuilt_2026/REVIEWER_RISK_REGISTER.md`](./rebuilt_2026/REVIEWER_RISK_REGISTER.md)
10. [`rebuilt_2026/SUBMISSION_MATERIALS.md`](./rebuilt_2026/SUBMISSION_MATERIALS.md)
11. [`rebuilt_2026/QUALITY_GATE.md`](./rebuilt_2026/QUALITY_GATE.md)

Narrative prose cannot override claim or source status in the registers.

## Superseded inherited findings

Files elsewhere in `IE-JDE/Digital_Tax_Design/` document the pre-rebuild programme. They remain historical research lineage, but they are not current evidentiary authority unless independently revalidated.

The following inherited claims are **not canonical findings**:

- statutory digital-tax rates do not predict revenue;
- base breadth creates a 30:1 revenue advantage over rate changes;
- compliance fully mediates the rate effect;
- the inherited Malaysia low-value-goods DiD establishes a causal revenue effect;
- destination-based taxation eliminates digital tax competition;
- the inherited small heterogeneous panel establishes cross-country causal mechanisms;
- historical journal-readiness or acceptance-probability percentages.

The rebuild exists specifically because those conclusions exceeded what the old design could support.

## Current defensible contribution

The paper may defend the following bounded contribution:

> Five Southeast Asian digital-tax regimes can be compared as different architectures for activating fiscal responsibility inside private transaction infrastructure. Their legal objects differ, but they reveal meaningful variation in which actor is activated and how closely the fiscal duty is coupled to the transaction event.

The five-country set is purposive comparative evidence, not a statistically representative ASEAN sample and not a causal design.

## Rebuild acceptance standard

Digital Tax v2 is not research-complete merely because the manuscript reads well. Promotion requires:

- every central country claim mapped to an inspectable primary source;
- prior art acknowledged before novelty is claimed;
- legal instruments kept distinct rather than pooled into a false regional metric;
- node locus and event coupling reproducible from the structured country matrix;
- administrative collection data never used as causal estimates without identification;
- remaining legal-source conflicts either resolved or excluded;
- manuscript, claim register, source catalog, architecture table, and submission materials in agreement;
- hostile-review risks documented and either closed or explicitly accepted;
- final package able to stand without any superseded rate regression or DiD result.

See [`rebuilt_2026/QUALITY_GATE.md`](./rebuilt_2026/QUALITY_GATE.md) for the release checklist.
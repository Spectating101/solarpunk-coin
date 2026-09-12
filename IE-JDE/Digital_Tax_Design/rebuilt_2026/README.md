# Digital Tax Design — Rebuilt 2026

This directory is the canonical research-control layer for the 2026 Digital Tax rebuild.

## Research object

The rebuild studies **fiscal choke points**: legally activated transaction nodes through which governments make platforms, foreign suppliers, payment-capable intermediaries, importers, or domestic buyers perform bounded fiscal functions.

The research question is:

> How do governments convert commercial observability and transaction control into administrable fiscal capacity?

This is a comparative institutional question. It is not a renewed attempt to recover the inherited cross-country rate-regression, mediation, or Malaysia DiD claims.

## Core distinction

A platform can coordinate a transaction economy much larger than the revenue reported in its own financial statements. That accounting boundary does not imply that the difference is hidden GDP, unpaid tax, participant income, or a taxable base.

The Digital Tax rebuild begins **after** that distinction:

```text
commercial event
    ↓
taxable object defined
    ↓
liable node assigned
    ↓
destination established
    ↓
transaction / filing rail activated
    ↓
record reconciled
    ↓
remittance or other bounded fiscal action
```

The analytical task is to identify which steps are actually established by law and administration in each jurisdiction.

## Files

- `CLAIM_BOUNDARIES.md` — hard limits on what the rebuild may infer.
- `CLAIM_REGISTER.csv` — current claim inventory and verification state.
- `COUNTRY_ARCHITECTURE.csv` — structured comparative extraction for the five-country ASEAN case set.
- `SOURCE_CATALOG.csv` — primary and secondary sources used or awaiting source freeze.

The narrative manuscript should be generated and reviewed against these files rather than becoming its own source of authority.

## Evidence hierarchy

Prefer evidence in this order for jurisdiction-specific claims:

1. statute, regulation, decree, or official tax/customs guidance;
2. official tax-administration or government reporting;
3. multilateral institutional documentation that clearly identifies the underlying regime;
4. reputable reporting used only when primary material is unavailable or for context;
5. secondary academic literature for theory, comparison, and positioning rather than for facts better established by primary sources.

Every quantitative claim should preserve its original currency, period, legal instrument, and revenue base. Cross-country totals are prohibited unless the component measures are genuinely comparable and the aggregation is substantively meaningful.

## Claim classes

Use these labels in the claim register:

- `CONCEPTUAL` — author-defined framework or taxonomy.
- `LEGAL_INSTITUTIONAL` — what a law, regulation, or official guidance assigns to an actor.
- `ADMINISTRATIVE_FACT` — registrations, appointments, filings, or collections reported by an authority.
- `COMPARATIVE_INFERENCE` — pattern inferred across jurisdictions from supported country claims.
- `CAUSAL` — effect claim requiring a design that identifies the intervention effect.
- `BOUNDARY` — explicit nonclaim or inference limit.

The rebuild currently prioritizes the first four classes. `CAUSAL` claims are not canonical unless separately re-established.

## Completion rule

The rebuild is ready for hostile review when:

- every manuscript claim has a claim ID;
- every empirical claim has a frozen source or an explicit unresolved status;
- country rows preserve legal-instrument differences rather than flattening them;
- dates distinguish announcement, enactment, effective date, and operational implementation where those differ;
- collection figures are not used as causal estimates without an identification design;
- the manuscript agrees with the register and does not re-import superseded claims from historical files;
- a reviewer can reconstruct the five-country comparison from the structured files without relying on narrative assertion.

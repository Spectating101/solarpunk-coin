# Digital Tax Design — Rebuilt 2026

This directory is the canonical research-control layer for the 2026 Digital Tax rebuild.

**Current package status:** `HOSTILE-REVIEW READY / NOT YET SUBMISSION-FROZEN`  
**Canonical manuscript:** `FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md`

## Research object

The rebuild studies **fiscal choke points**: legally activated transaction nodes through which governments assign bounded fiscal functions to platforms, foreign suppliers, payment-capable intermediaries, buyers, or other actors involved in a covered commercial process.

The research question is:

> How do governments convert commercial observability and transaction control into administrable fiscal responsibility?

This is a comparative institutional question. It is not a renewed attempt to recover the inherited cross-country rate-regression, mediation, or Malaysia DiD claims.

## Core distinction

A platform can coordinate a transaction economy much larger than the revenue reported in its own financial statements. That accounting boundary does not imply that the difference is hidden GDP, unpaid tax, participant income, or a tax base.

The Digital Tax rebuild begins **after** that distinction:

```text
commercial event
    ↓
taxable object defined
    ↓
liable node assigned
    ↓
destination / nexus established
    ↓
transaction / filing rail activated
    ↓
reporting / reconciliation relationship
    ↓
bounded fiscal action
```

The analytical task is to identify which steps are actually established by law and administration in each jurisdiction.

## Package authority

Read package files in this order:

1. `CLAIM_BOUNDARIES.md` — hard limits on what the rebuild may infer.
2. `SOURCE_CATALOG.csv` — source IDs, authority, role, and verification status.
3. `CLAIM_REGISTER.csv` — canonical claim inventory and permitted use.
4. `COUNTRY_ARCHITECTURE.csv` — structured five-country comparative evidence.
5. `CODING_RULES.md` — node-locus and event-coupling coding rules.
6. `LITERATURE_POSITIONING.md` — prior art and novelty boundary.
7. `FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md` — narrative manuscript.
8. `PACKAGE_MANIFEST.md` — contribution hierarchy, evidence classes, go/stop rules.
9. `FIGURES_TABLES_SPEC.md` — publication visual and table contract.
10. `REVIEWER_RISK_REGISTER.md` — hostile-review objections and closure state.
11. `SUBMISSION_MATERIALS.md` — venue-neutral abstract, highlights, cover-letter core, and summaries.
12. `QUALITY_GATE.md` — final promotion checklist.
13. `validate_package.py` — structural consistency validator.
14. `INTERNAL_AUDIT_2026-09-14.md` — package-level audit trail.

The manuscript is **not** its own source of authority. Where prose conflicts with a frozen claim or source state, the register controls until the conflict is resolved.

## Comparative dimensions

Each country-instrument architecture is decomposed into five components:

1. taxable object;
2. liable node;
3. destination / nexus evidence;
4. transaction rail;
5. reconciliation power.

Two cross-cutting dimensions make the comparison analytically useful:

- **node locus** — where fiscal responsibility sits in the commercial chain;
- **event coupling** — how tightly fiscal action is legally tied to the transaction event.

These dimensions are qualitative descriptors, not scores or rankings. Their coding rules are frozen in `CODING_RULES.md`.

## Evidence hierarchy

Prefer evidence in this order for jurisdiction-specific claims:

1. statute, regulation, decree, or other official legal text;
2. official tax/customs guidance and administration portals;
3. official government reporting on registrations, appointments, collections, or implementation;
4. multilateral institutional documentation for policy context;
5. academic literature for theory, prior art, and comparison;
6. reputable reporting only when primary material is unavailable and only for context.

Every quantitative claim must preserve its original currency, period, legal instrument, and revenue base. Cross-country totals are prohibited unless the component measures are genuinely comparable and aggregation is substantively meaningful.

## Claim classes

- `CONCEPTUAL` — author-defined framework or taxonomy.
- `LEGAL_INSTITUTIONAL` — what a law, regulation, or official guidance assigns to an actor.
- `ADMINISTRATIVE_FACT` — registrations, appointments, filings, or collections reported by an authority.
- `COMPARATIVE_INFERENCE` — pattern inferred across jurisdictions from supported country claims.
- `CAUSAL` — effect claim requiring an identification design.
- `BOUNDARY` — explicit nonclaim or inference limit.

The current paper is built primarily from the first four plus explicit boundaries. Historical causal claims remain superseded unless independently rebuilt.

## Current source posture

The central legal/administrative mechanism is source-frozen strongly enough for hostile review in all five country sections:

- Malaysia: current MySToDS portal plus the FSP guide still linked by the current official guides index;
- Indonesia: current DGT digital-tax page controls current remittance/reporting procedure, with official 2026 collector/collection data;
- Vietnam: Decree 117/2025 establishes the July 2025 transaction-level mechanism; Decree 68/2026 expressly preserves per-transaction platform withholding under that framework, and Decree 141/2026 supplies the material later-2026 amendment layer checked as of 2026-09-14;
- Thailand: platform liability is supported by both current Revenue Code section 82/13 and Revenue Department guidance;
- Philippines: 2025 BIR regulation and administrative issuances support the B2C/B2B paths used in the manuscript.

Comparable reconciliation/audit, error-correction, and compliance-cost evidence remains incomplete across the five cases. The manuscript treats that as an evidence gap and does not rank system performance.

## Structural validation

Run:

```bash
python IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_package.py
```

Use `--strict` only when all country rows are intentionally promoted from `PARTIAL_COMPLETE` to `COMPLETE`.

The validator checks package structure and drift; it does **not** verify the truth of legal or empirical claims. A validator file existing in the repository is not equivalent to a recorded passing run.

## Completion rule

The package may move to `SUBMISSION CANDIDATE` only when:

- central legal claims remain current at the final source check;
- an independent reader can reproduce the node-locus/event-coupling coding;
- an external or independent hostile reader agrees that the contribution is more than renaming platform VAT liability;
- structural validation has actually been executed and recorded;
- no old causal claim re-enters the abstract, introduction, or conclusion;
- the paper remains valuable without any rate regression, pooled ASEAN revenue metric, or GMV-to-tax shortcut.

Until those gates close, the package is deliberately strong-but-reviewable rather than prematurely labeled submission-ready.
# Submission Workspace

This directory is the operational packaging layer for the Solarpunk / CL–ECI / Policy Lab research programme.

It does **not** replace the research foundation, repository source hierarchy, result ledger, institutional evidence, or software implementation. It converts those authorities into bounded external packages.

## Operating rule

> One canonical programme. Multiple differentiated conversions. No competing truth.

```text
canonical research + evidence + software
        ↓
master registers
        ↓
package card
        ↓
venue-specific package
        ↓
submission receipt / feedback / revision
```

## Directory authority

```text
submission/
├── README.md
├── MASTER_ASSET_REGISTER.md
├── PACKAGE_CARDS.md
├── OVERLAP_AND_EXCLUSIVITY_REGISTER.md
├── templates/
│   ├── PACKAGE_MANIFEST_TEMPLATE.md
│   ├── CLAIM_REGISTER_TEMPLATE.md
│   └── FINAL_QA_TEMPLATE.md
└── packages/
    ├── P1-ftsid-2026/
    ├── P2-technical-2026/
    ├── P3-climate-assurance-2026/
    ├── P4-commercialization-2026/
    └── P5-specialist-publications/
```

Empty package directories should not be created without a package manifest. A package exists only when its identity, scope, evidence authority, deliverables, and non-claims are explicit.

## Package IDs

| Package ID | Authority | Primary routes |
|---|---|---|
| **P0** | canonical programme authority | all packages |
| **P1** | integrated programme paper | FTSID |
| **P2** | technical systems paper | IEEE ICDLT or BCK26 |
| **P3** | executable climate-assurance product | ClimateChain, NTUB, GSC, Blockchain for Good |
| **P4** | commercialization package | NSTC and later incubators |
| **P5** | specialist durable publications | FINEC, Ledger, ACM DLT, Energy Informatics, JOSS |

## Required package contents

Every active package must contain:

```text
PACKAGE_MANIFEST.md
CLAIM_REGISTER.md
SOURCE_REGISTER.md
ASSET_SELECTION.md
DELIVERABLE_CHECKLIST.md
NON_CLAIMS.md
OVERLAP_CHECK.md
REVISION_LOG.md
SUBMISSION_RECEIPT.md
```

Additional files depend on the route:

- papers: manuscript, references, figures, anonymization checklist;
- competitions: application copy, deck, demo script, video, judge Q&A;
- funding: market problem, pilot, milestones, budget, team, IP position;
- software: release ID, tests, documentation, licence, archival artifact;
- empirical papers: result-ledger extract, code/data reproduction path, robustness matrix.

## Evidence labels

Every package uses the same evidence-status vocabulary.

| Label | Meaning |
|---|---|
| **Observed** | directly recorded from an identified source |
| **Controlled** | intentionally constructed test fixture or demonstration input |
| **Modeled** | produced by an explicit model or scenario assumption |
| **Declared** | supplied as a scenario or policy context rather than independently verified |
| **Derived** | calculated deterministically from identified inputs |
| **Institutional analogy** | a bounded inference from observed institutional rules or processes |
| **Externally validated** | reviewed or tested by an attributable external party under a defined process |

No package may silently promote one evidence class into another.

## Shipping states

```text
PROPOSED
→ SCOPED
→ EVIDENCE FROZEN
→ DRAFT
→ INTERNAL REVIEW
→ FORMAT FROZEN
→ READY TO SHIP
→ SUBMITTED
→ DECIDED
→ ARCHIVED / REVISED
```

A package may not be marked `READY TO SHIP` until final QA and overlap review are complete.

## Current operating sequence

1. freeze P0 registers;
2. choose P2 route: ICDLT or BCK;
3. produce P1 FTSID paper;
4. open P4 only after institutional eligibility is understood;
5. derive NTUB from P3/P1 without creating a second product;
6. develop P3 into the ClimateChain prototype;
7. use external results to decide which P5 specialist routes deserve production.

## Non-negotiable boundaries

- The project does not currently demonstrate a completed energy-backed currency.
- A successful controlled case is not external validation.
- Norway is not a deployment, endorsement, or proof of monetary feasibility.
- Admission does not imply settlement.
- Settlement does not imply circulation, liquidity, stable value, acceptance, or money.
- A competition application may not invent a customer, pilot, integration, or team contribution.
- A grant headline amount is a project budget, not personal income or present valuation.

## Related authorities

- `../PROJECT_RECOVERY.md`
- `../docs/research/ENERGY_SIGNALS_MONETARY_CONSTRAINTS_RESEARCH_FOUNDATION.md`
- `../docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md`
- `../docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md`
- `../docs/project/SUBMISSION_PACKAGING_AND_DEADLINE_PLAN.md`

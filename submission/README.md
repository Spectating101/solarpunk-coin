# Submission and Programme Execution Workspace

This directory is the operational conversion and maturity-control layer for the Solarpunk / CL–ECI / Policy Lab research programme.

It does **not** replace the research foundation, repository source hierarchy, result ledger, institutional evidence, software implementation, or external-case records. It converts those authorities into bounded external packages and tracks whether the programme has actually crossed external, research, institutional, and commercial maturity gates.

## Operating rule

> One canonical programme. Multiple differentiated conversions. No competing truth.

```text
canonical research + evidence + software
        ↓
external cases + conformance benchmark
        ↓
independent review + institutional discovery
        ↓
master registers + maturity scoreboard
        ↓
package card and package manifest
        ↓
venue / pilot / institutional conversion
        ↓
submission, review, use, payment, or rejection evidence
        ↓
revised canonical programme
```

## Execution authority

Read in this order:

1. `../PROJECT_RECOVERY.md` — repository-wide recovery and authority order;
2. `../docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md` — maturity gates, sequencing, ownership, and stop rules;
3. `PROGRAMME_SCOREBOARD.md` — active evidence-bearing status register;
4. `EXTERNAL_CASE_PORTFOLIO.md` — Cases 001–003 source and evaluation programme;
5. `CONFORMANCE_BENCHMARK_V1.md` — behavioral benchmark and conformance specification;
6. `EXTERNAL_REVIEW_PROTOCOL.md` — independent domain, technical, research, and operational scrutiny;
7. `INSTITUTIONAL_DISCOVERY_PROTOCOL.md` — interview, commitment, pilot, adoption, and stop rules;
8. `PRE_EXISTING_ASSET_AND_LICENSE_INVENTORY.md` — founder, public, private, third-party, institutional, and future-commercial asset boundaries;
9. `../docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md` — workstreams and package families;
10. package-local manifests and registers.

No venue deadline, competition narrative, incubator request, commercial proposal, reviewer opinion, or institutional request may override this authority order.

## Directory authority

```text
submission/
├── README.md
├── PROGRAMME_SCOREBOARD.md
├── EXTERNAL_CASE_PORTFOLIO.md
├── CONFORMANCE_BENCHMARK_V1.md
├── EXTERNAL_REVIEW_PROTOCOL.md
├── INSTITUTIONAL_DISCOVERY_PROTOCOL.md
├── PRE_EXISTING_ASSET_AND_LICENSE_INVENTORY.md
├── MASTER_ASSET_REGISTER.md
├── PACKAGE_CARDS.md
├── OVERLAP_AND_EXCLUSIVITY_REGISTER.md
├── templates/
│   ├── PACKAGE_MANIFEST_TEMPLATE.md
│   ├── CLAIM_REGISTER_TEMPLATE.md
│   ├── FINAL_QA_TEMPLATE.md
│   ├── EXTERNAL_REVIEW_RECORD_TEMPLATE.md
│   └── STAKEHOLDER_AND_PILOT_RECORD_TEMPLATE.md
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
| **P1** | integrated programme paper | FTSID or successor integrated venue |
| **P2** | technical systems paper | selected technical venue when evaluation-ready |
| **P3** | executable climate/evidence product | climate, sustainability, fintech, and demonstration routes |
| **P4** | commercialization and pilot package | incubators, FITI, institutional pilots, later funding |
| **P5** | specialist durable publications | FINEC, Ledger, ACM DLT, Energy Informatics, JOSS or successors |

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
- empirical papers: result-ledger extract, code/data reproduction path, robustness matrix;
- institutional use: source relationship, workflow record, operator feedback, correction log;
- independent review: frozen review package, findings, dispositions, corrections, and closure;
- commercial proof: buyer role, scope, success criteria, quotation or contract, payment evidence, and renewal intent.

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
| **Externally reviewed** | reviewed by an attributable external party under a defined scope |
| **Externally operated** | completed by an attributable external operator under a documented workflow |
| **Commercially validated** | supported by attributable buyer, contract, payment, or recurring-use evidence |

No package may silently promote one evidence class into another. External review, institutional operation, and commercial validation are separate states.

## Programme maturity gates

```text
M0 CONTROLLED SYSTEM
→ M1 EXTERNAL OPERABILITY
→ M2 REPEATABLE EXTERNAL EVIDENCE
→ M3 INDEPENDENT SCRUTINY
→ M4 RESEARCH AUTHORITY
→ M5 INSTITUTIONAL USE
→ M6 COMMERCIAL PROOF
→ M7 REPEATABLE PRODUCT / CATEGORY FORMATION
```

A later gate does not erase the boundaries of an earlier one. A paid pilot does not certify physical source truth, a publication does not prove customer demand, and an external review does not become official approval.

## Package shipping states

```text
PROPOSED
→ SCOPED
→ EVIDENCE FROZEN
→ DRAFT
→ INTERNAL REVIEW
→ EXTERNAL REVIEW
→ FORMAT FROZEN
→ READY TO SHIP
→ SUBMITTED / DEPLOYED
→ DECIDED / USED / PAID
→ ARCHIVED / REVISED
```

A package may not be marked `READY TO SHIP` until final QA and overlap review are complete. `EXTERNAL REVIEW`, `USED`, and `PAID` require attributable evidence rather than intent or discussion.

## Current operating sequence

1. complete issue #26 / External Case 001;
2. operate the maturity-control documents as P0;
3. implement and validate the C0–C2 Conformance Benchmark v1 corpus;
4. open Cases 002 and 003 only against deliberate contrasts;
5. freeze and run the independent review package;
6. freeze P1 claim and evidence hierarchy;
7. select or decline P2 based on actual evaluation contribution;
8. update P3 against external-case evidence before further lifecycle expansion;
9. run P4 institutional discovery as a bounded experiment;
10. preserve the pre-existing asset and licence schedule before external agreements;
11. use external results to decide which P5 specialist routes deserve production.

## Non-negotiable boundaries

- The project does not currently demonstrate a completed energy-backed currency.
- A successful controlled case is not external validation.
- A source-holder-reviewed external case is not physical meter certification.
- Norway is not a deployment, endorsement, or proof of monetary feasibility.
- Admission does not imply settlement.
- Settlement does not imply circulation, liquidity, stable value, acceptance, or money.
- A competition application may not invent a customer, pilot, integration, or team contribution.
- A grant headline amount is a project budget, not personal income or present valuation.
- A benchmark created by the reference implementation is not automatically a neutral industry standard.
- A reviewer does not imply endorsement outside the frozen review scope.
- A conversation, expression of interest, free demonstration, paid pilot, recurring customer, and ecosystem adoption are distinct maturity states.
- Public MIT assets are not exclusive merely because a future company commercializes complementary work.

## Work acceptance rule

Before new work begins, record:

1. the maturity gate advanced;
2. the evidence artifact expected;
3. the claim that becomes permissible only if the work succeeds;
4. the stop rule if the evidence does not appear;
5. the privacy, publication, ownership, and non-claim boundary.

Broad frontend, token, marketplace, AI, and speculative integration work remains deferred unless an external case, reviewer, publication, institutional user, or paid deployment demonstrates a concrete requirement.

## Related authorities

- `../PROJECT_RECOVERY.md`
- `../docs/research/ENERGY_SIGNALS_MONETARY_CONSTRAINTS_RESEARCH_FOUNDATION.md`
- `../docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md`
- `../docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md`
- `../docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md`
- `../docs/project/SUBMISSION_PACKAGING_AND_DEADLINE_PLAN.md`

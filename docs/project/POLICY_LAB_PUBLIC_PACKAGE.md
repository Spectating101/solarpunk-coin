# Policy Lab Public Package

**Status:** current packaging and review entry point  
**Updated:** 2026-08-25  
**Purpose:** give a human evaluator, collaborator, reviewer, or future agent one bounded path through the current Policy Lab artifact without reconstructing the historical SolarPunk stack.

## Public identity

Judge-facing hook:

> **If a financial claim says real-world evidence backs it, Policy Lab makes it prove exactly how much that evidence can justify.**

Problem frame:

> **Real-world data is increasingly used to authorize financial value, but the rule that turns evidence into financial authority is often hidden. Policy Lab makes that conversion explicit, bounded, and reproducible.**

Short public explanation:

> **Policy Lab shows what evidence actually allows a system to claim, why a rule blocks or limits it, and what still is not proven.**

Precise technical description:

> Policy Lab is an executable verification and constraint workbench for testing how far a proposed energy-linked financial claim can be justified under declared evidence, policy, quantity, risk, settlement, and governance assumptions while preserving which research boundaries remain open.

The technical description is a scope boundary, not the preferred opening pitch.

## Start here

1. Live workbench: https://spectating101.github.io/solarpunk-coin/demo/
2. Repository overview: [`README.md`](../../README.md)
3. Submission / Gauntlet package: [`docs/submission/README.md`](../submission/README.md)
4. Five-minute walkthrough: [`DEMO_WALKTHROUGH.md`](../../DEMO_WALKTHROUGH.md)
5. G4 public-evidence evaluator brief: [`docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md`](../research/POLICY_LAB_G4_EVALUATOR_BRIEF.md)
6. Current research/software semantic authority: [`docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md`](../research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md)
7. Recovery and authority hierarchy: [`PROJECT_RECOVERY.md`](../../PROJECT_RECOVERY.md)
8. External-validation rules: [`docs/research/EXTERNAL_VALIDATION_LEDGER.md`](../research/EXTERNAL_VALIDATION_LEDGER.md)
9. Live-validation runbook: [`docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md`](./POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md)

## What the current public artifact demonstrates

The strongest current public case is `PUB-AUSGRID-001P`.

It demonstrates that Policy Lab can:

- take one bounded outside public energy-data object;
- preserve source and assurance limits at actual L0;
- normalize the evidence without silently promoting its trust level;
- apply explicit versioned policies deterministically;
- produce different consequences from the same evidence under different declared policies;
- attribute blocking rules and quantity ceilings;
- stress settlement capacity separately from admission and quantity;
- produce inspectable receipts, capsules, and deterministic replay;
- derive and independently verify a `ConstrainedClaimAssessment` across R1–R4.

Canonical public-case outcomes:

```text
same bounded Ausgrid evidence

LAB-CASE-OPEN-004
→ ADMIT_WITH_LIMIT
→ 33.066 kWh maximum
→ EVIDENCE_BACKED_CAPACITY binds

ENERGY-CASE-PILOT-005
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE

40% declared settlement capacity on admitted quantity
→ PARTIAL
→ 13.2264 kWh covered
→ 19.8396 kWh shortfall
```

Derived research-boundary state:

```text
R1 economic information       NOT_ASSESSED
R2 claim-level evidence       PARTIAL
R3 binding constraint         PARTIAL
R4 monetary performance       UNTESTED
```

## What the current artifact does not establish

It does not establish:

- source-holder/operator confirmation;
- physical meter truth;
- L1/L2 authenticated evidence for the public case;
- legal issuance authority;
- enforceable delivery, redemption, or settlement;
- economically optimal policy or pricing;
- bounded production governance;
- production security or commercial readiness;
- market demand, circulation, liquidity, acceptability, or money.

A positive result at one research boundary never promotes the next boundary automatically.

## Runtime model versus research model

Do not collapse these namespaces.

Research boundaries:

```text
R1 — economic information / admissibility
R2 — claim-level evidence
R3 — binding constraint
R4 — monetary performance
```

Runtime stages:

```text
Evidence → Assurance → Admission → Quantity → Settlement → Receipt
```

Conformance families and levels:

```text
CF1–CF9
C0–C4
```

Source assurance:

```text
L0–L4
```

These are separate systems of meaning.

## Five-minute evaluator objective

A reviewer should be able to answer all of the following without prior coaching:

1. What evidence is being evaluated?
2. What is actually known about that evidence, and what is not known?
3. Why does one policy admit a bounded quantity while another blocks the same evidence?
4. Which rule actually binds the permitted quantity?
5. What happens when settlement capacity is insufficient?
6. Can the result be traced to deterministic identities and reproduced?
7. Which R1–R4 research boundaries remain unresolved?

If the reviewer cannot answer these questions after the guided flow, treat that as packaging/demo-clarity evidence rather than explaining the answer away.

## Current operating posture

Policy Lab is no longer in broad feature-construction mode.

Current posture:

```text
frozen research distinctions
        ↓
deterministic executable workbench
        ↓
public outside-data case
        ↓
live deployed artifact
        ↓
submission / review hardening
        ↓
controlled external evaluation when ready
```

Do not reopen AI assistants, new policy families, token work, broad backend infrastructure, marketplace features, or unrelated UI expansion merely to make the artifact look larger.

## Submission packaging boundary

The judge-facing submission package is downstream of machine evidence. It may improve clarity, practical framing, route-specific emphasis, and presentation, but it must not manufacture eligibility, semantic fit, external validation, adoption, or commercial maturity.

The machine-bound submission facts are validated with:

```bash
node scripts/validate_gauntlet_submission_package.mjs
```

## Release and citation posture

`CITATION.cff` currently describes the existing `0.2.0-alpha` software release metadata. Do **not** silently treat the August 2026 packaging work as a new tagged release or DOI until a new GitHub release/archive is intentionally created.

When a new citable release is cut, synchronize together:

- Git tag and GitHub Release;
- release notes;
- `CITATION.cff` version/date;
- archived DOI if Zenodo is used;
- README citation text;
- screenshots / review artifacts;
- exact source commit evaluated.

## Historical SolarPunk/SPK material

SolarPunk Public Lab, the Energy Standard thesis, SPK, Sepolia contracts, and older product-lab documents remain historically relevant and may still support reference implementation or research provenance.

They are **not** the current top-level semantic authority for Policy Lab.

When historical documents conflict with the current research/software meaning, use the authority hierarchy in [`PROJECT_RECOVERY.md`](../../PROJECT_RECOVERY.md), led by the final research/Policy Lab reconciliation.

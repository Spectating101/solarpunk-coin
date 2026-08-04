# Claude Policy Lab Design Review Brief

**Status:** external design-review brief  
**Date:** 2026-08-04  
**Working branch:** `docs/consolidate-program-packaging`  
**Related draft PR:** `#21` — Consolidate programme packaging and Policy Lab UX direction

## Purpose

Review the next public UX direction for the Solarpunk Monetary Systems / CL–ECI / Policy Lab programme before any broad frontend rewrite.

The current proposed direction is not automatically correct. Critique it seriously, reduce it where possible, and produce design reasoning plus CLI wireframes before proposing React implementation.

## Required reading order

Read these files before making recommendations:

1. `PROJECT_RECOVERY.md`
2. `docs/research/ENERGY_SIGNALS_MONETARY_CONSTRAINTS_RESEARCH_FOUNDATION.md`
3. `docs/project/PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md`
4. `docs/project/MASTER_PLATFORM_HANDOFF.md`
5. `docs/project/PLATFORM_BLUEPRINT.md`
6. `docs/project/V2_IMPLEMENTATION_HANDOFF.md`
7. `docs/project/PUBLIC_CONVERSION_PLAYBOOK.md`
8. `docs/project/INTERFACE_VALUE_DELIVERY.md`

Then inspect the current frontend implementation, especially:

- `frontend/src/App.jsx`
- `frontend/src/app/routes.js`
- `frontend/src/components/LabOverview.jsx`
- `CaseExplorer`
- `CaseWorkspace`
- `CompareWorkspace`
- `ReceiptsWorkspace`
- `DecisionBrief`
- `EmpiricalRunsLab`
- `EmpiricalReproductionLab`
- `EvidenceLab`
- `CurrencyLab`
- `ResearchPanel`
- `SpkV1Console`

## Central design question

> What exact experience and value should the public Policy Lab deliver, and how should that experience relate to the broader academic portfolio, research papers, replication packages, competitions, incubator presentations, and eventual real-evidence pilots?

## Programme boundaries

Preserve this hierarchy:

```text
monetary theory and research programme
        ↓
ECI — empirical admissibility
        ↓
Constrained Ledger — institutional monetary architecture
        ↓
Policy Lab — executable research instrument
        ↓
SPK — historical reference implementation and experiment
```

Do not reduce the project to a generic digital-financial-claim workbench. A bounded financial claim is an intermediate institutional object, not the intellectual endpoint.

Do not force every academic paper into a simulation application. Empirical studies may remain paper-first, table-first, and replication-first.

## Prohibited shortcuts

Do not:

- create a generic SaaS dashboard;
- use excessive cards, pills, inspectors, explanatory chrome, or AI-generated dashboard styling;
- create visible `academic mode`, `competition mode`, or similar packaging switches;
- design a fake terminal;
- implement another token or blockchain contract;
- add an AI assistant, account system, billing system, or cloud platform;
- begin a broad frontend rewrite;
- alter deterministic runtime, policy, constraint, settlement, or receipt semantics without an explicit research reason;
- allow interface presentation to upgrade controlled evidence or unsupported claims;
- hide the absence of a real attributable evidence source.

The next external validation gate remains one real attributable operator, inverter, gateway, meter, facility, or contractual evidence source.

## Candidate flagship sequence

Evaluate whether this is truly the strongest flagship experience:

```text
180 units requested
        ↓
L0 assurance
        ↓
BLOCKED — minimum provenance not met
        ↓
change only the declared assurance context to L2
        ↓
evidence identity remains unchanged
        ↓
126 units permitted
        ↓
provenance-policy capacity binds
        ↓
40% settlement-capacity stress
        ↓
50.4 covered / 75.6 shortfall
        ↓
passing issuance did not guarantee settlement
        ↓
monetary performance remains untested
```

Improve or replace this sequence where justified. Preserve exact case semantics and non-claims.

## Required deliverables

### 1. Critical assessment

Assess the current programme-packaging and UX handoff:

- what is strong;
- what is weak;
- what is still conceptually confused;
- what should be removed;
- what should become the central experience.

### 2. User-value definition

Define the precise value delivered to:

- an academic reviewer;
- a professor or researcher;
- a competition judge;
- an incubator or grant reviewer;
- a developer;
- a possible energy-data or pilot partner.

Do not assume all users require the same entry path or interaction depth.

### 3. Public-surface relationship

Recommend the relationship between:

- the academic portfolio website;
- individual paper and project pages;
- Policy Lab;
- the replication and research library;
- SPK reference material.

State what belongs on the public programme site and what belongs inside the executable lab.

### 4. CLI-wireframe sequence

Produce a complete black-and-white CLI-wireframe sequence for the flagship experience.

For every frame, state:

```text
SCREEN PURPOSE
USER INPUT
SYSTEM RESPONSE
INVARIANTS
PRIMARY ACTION
EXIT ARTIFACT
```

Include at least:

- public entry;
- blocked decision;
- controlled L0-to-L2 change;
- bounded quantity;
- settlement shortfall;
- final monetary interpretation;
- receipt and research drill-down;
- advanced workbench;
- academic project page;
- mobile experience.

A frame fails if the monetary argument requires a separate paragraph to explain what the interface is doing.

### 5. Visual-system recommendation

Recommend an information-first visual system covering:

- typography;
- spacing and rhythm;
- colour and semantic states;
- when containers are necessary;
- when technical detail should be hidden;
- how causality should be shown;
- how invariants should be shown;
- how desktop and mobile should differ;
- how to avoid generic AI, crypto, and SaaS aesthetics.

The target may be an editorial research publication that becomes executable, but challenge that description if a stronger direction exists.

### 6. Existing-component mapping

Map each relevant frontend component to one of:

- reuse as-is;
- adapt;
- combine;
- demote to advanced route;
- retire from primary navigation.

Explain how the proposed flagship flow can reuse the existing deterministic engine rather than rebuilding it.

### 7. Competition and incubator demonstration

Design a five-minute presentation using the same public interface, without a separate competition mode.

It should make visible:

```text
problem
→ mechanism
→ live decision
→ controlled change
→ bounded quantity
→ settlement failure
→ intellectual contribution
→ technical proof
→ explicit limitation
→ next real-evidence pilot
```

Identify which interface moments also produce reusable screenshots, deck figures, one-page application material, and judge-facing proof.

### 8. Phased implementation plan

Provide a restrained implementation sequence that:

1. freezes the final assessment output;
2. freezes flagship states and invariants;
3. completes CLI wireframes;
4. maps existing components and runtime objects;
5. implements one narrow flagship shell;
6. connects receipt and research drill-down;
7. preserves existing advanced routes;
8. validates desktop and mobile comprehension;
9. delays broad navigation and visual-system changes until the flagship works.

Do not modify repository files during this review.

## Required verdict

End with exactly one of these verdicts:

- **Approve the current direction**
- **Approve with major changes**
- **Reject and replace it**

Be direct and opinionated. Prefer reduction over adding more interface surface.

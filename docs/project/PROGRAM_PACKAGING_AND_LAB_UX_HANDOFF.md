# Programme Packaging and Lab UX Handoff

**Status:** current authority for public packaging, academic-portfolio presentation, competition reuse, and the next Policy Lab interface-design pass  
**Date:** 2026-08-04  
**Scope:** packaging and interface experience only; this document does not override empirical results or thesis research authority

---

## 1. Why this handoff exists

The repository already contains substantial research, software, empirical studies, testnet history, conversion guidance, and interface work. The problem is no longer missing material. The problem is presenting several legitimate project layers without allowing old product language, repository namespaces, or prior interface arrangements to become accidental public authority.

This handoff consolidates the current direction into one bounded rule:

> Present the project as an academic research programme with one flagship executable laboratory. Do not force every paper into an application, and do not reduce the programme to the current workbench implementation primitive.

The current research hierarchy remains:

```text
Solarpunk monetary research programme
        ↓
ECI — empirical admissibility
        ↓
Constrained Ledger — institutional monetary architecture
        ↓
Policy Lab — executable research instrument
        ↓
SPK — historical reference implementation and monetary experiment
```

The intellectual endpoint is monetary theory and monetary-system design. A bounded financial claim remains an intermediate institutional object, not the ceiling of the research programme.

---

## 2. Authority and document status

### Governing research authority

Research claims, thesis structure, empirical results, and non-claims remain governed by:

1. `docs/research/ENERGY_SIGNALS_MONETARY_CONSTRAINTS_RESEARCH_FOUNDATION.md`
2. source inventories, result ledgers, claim registries, scripts, datasets, and proof artifacts as they are frozen
3. `PROJECT_RECOVERY.md`

### Governing packaging and UX authority

This document governs:

- public programme hierarchy;
- academic-portfolio packaging;
- the flagship Policy Lab experience;
- CLI-wireframe design procedure;
- competition and incubator reuse;
- visual-density and interaction boundaries;
- the next interface implementation pass.

### Existing documents retained as inputs

| Document | Current status | Use |
|---|---|---|
| `PUBLIC_CONVERSION_PLAYBOOK.md` | historical conversion and release input | Preserve the five-minute TYN walkthrough, receipt emphasis, release discipline, and real-evidence field gate. Do not treat its older public description as the final programme identity. |
| `INTERFACE_VALUE_DELIVERY.md` | historical interface and validation record | Preserve answer-first design, visible failure, progressive inspection, route-splitting, validation history, and stop rules. Its route hierarchy is not the final UX authority. |
| `PLATFORM_BLUEPRINT.md` | system and product architecture input | Preserve deterministic objects, policies, constraints, settlement, and receipts. |
| `V2_IMPLEMENTATION_HANDOFF.md` | implementation authority where consistent with research foundation | Preserve core semantics and phased implementation boundaries. |
| `LOCAL_AGENT_INTERFACE_HANDOFF.md` | static-release procedure | Use for build, CI, screenshot, deployment, and rollback operations. |
| archived Public Lab / SPK documents | implementation history and proof archive | Preserve honestly; do not revive them as current product direction. |

Do not delete these documents merely to create apparent tidiness. Tidiness is achieved through explicit authority and status, not historical erasure.

---

## 3. Public packaging model

The public system has two connected surfaces.

### A. Academic portfolio and programme site

Purpose:

- identify the research programme;
- present papers and working papers;
- expose replication packages, software releases, and result status;
- provide a clear entry into Policy Lab;
- support academic review, applications, competitions, grants, and collaboration.

The portfolio should not turn every research output into a simulation application.

Recommended top-level structure:

```text
RESEARCH
POLICY LAB
PUBLICATIONS
SOFTWARE & DATA
ABOUT
```

Each research project page should contain:

```text
title and status
one-paragraph abstract
research question
contribution
key findings
method and data
limitations / non-claims
paper and citation
replication package
optional interactive artifact
```

Empirical work such as Fama–MacBeth studies should normally remain paper-first, table-first, and replication-first. An interactive specification explorer is optional and must expose a finite audited set of specifications rather than invite significance fishing.

### B. Policy Lab

Purpose:

> Provide an executable monetary-system assessment showing how a proposal progresses—or fails—through evidence, issuance, quantity, settlement, and monetary-performance boundaries.

Policy Lab is the flagship interactive artifact. It supports the scholarship; it does not replace papers, empirical appendices, or replication packages.

---

## 4. Exact user value

A completed Policy Lab experience should let a user answer:

1. What monetary design or policy was proposed?
2. What signal and evidence does it rely on?
3. What does that evidence actually prove?
4. Which monetary actions are permitted?
5. What maximum quantity may be issued, and which rule binds?
6. Can the resulting obligation settle under declared and stressed conditions?
7. Which monetary properties have actually been tested?
8. What remains unestablished?
9. Can the conclusion be inspected and reproduced?

The exit artifact is a **Monetary System Assessment**, supported by a deterministic receipt.

Recommended assessment fields:

```text
signal status
evidence status
issuance-authority status
quantity status and binding rule
settlement status
monetary-performance status
research interpretation
explicit non-claims
next evidence required
receipt and lineage
```

The system must never imply that passing one stage proves the next.

---

## 5. Flagship experience

The default public experience is one short investigation, not a module directory.

### Canonical interaction

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

This sequence should carry the monetary argument without requiring a visitor to first understand repository modules.

### Final interpretation

A successful guided run should end with a concise conclusion such as:

> This controlled design demonstrates evidence-gated and quantity-bounded issuance. It does not yet establish reliable real-world settlement, circulation, liquidity, unit-of-account use, or monetary acceptance.

The user may then:

- inspect the receipt;
- open the supporting research;
- compare policies;
- stress the obligation again;
- enter the advanced workbench;
- explore the real-evidence pilot boundary.

---

## 6. Experience model

Policy Lab should expose three user contexts without turning them into artificial visible presentation modes.

### Guided investigation

Default public path. One canonical case, one focal interaction at a time, one dominant conclusion per state.

### Workbench

Advanced tools for:

- selecting cases;
- changing declared assurance scenarios;
- comparing policies;
- inspecting constraints;
- replaying settlement stress;
- examining receipts and lineage.

Existing `CaseExplorer`, `CaseWorkspace`, `CompareWorkspace`, and `ReceiptsWorkspace` belong here.

### Research evidence

Scholarly inspection for:

- ECI results and status;
- empirical studies;
- methods;
- result reproduction;
- publications;
- source inventories;
- software releases;
- SPK reference history.

Research evidence should also be linked contextually from the guided investigation. A user should be able to ask why a stage received a particular status and open the relevant result, method, limitation, and source object.

Recommended primary navigation after the guided shell is stable:

```text
GUIDED LAB | WORKBENCH | RESEARCH
```

Existing module routes may remain as stable deep links and advanced subnavigation.

---

## 7. Visual direction

The target is:

> an editorial research publication that becomes executable

Avoid:

- generic SaaS dashboard chrome;
- card grids for every sentence;
- permanent inspectors full of prose;
- visible packaging modes such as “academic” or “competition”;
- token-price or trading-terminal aesthetics;
- fake-terminal styling;
- neon crypto imagery;
- explanatory badges attached to every object;
- presenting all stages with equal visual weight.

Prefer:

- open space and strong typographic hierarchy;
- one dominant number or verdict per state;
- one sentence of interpretation;
- one primary next action;
- hairline rules and alignment instead of stacked containers;
- monospace only for IDs, hashes, policy versions, equations, and receipts;
- visible invariants when state changes;
- technical detail revealed on demand;
- motion only when it explains causality.

The final interface does not need to look like the CLI wireframe. The CLI wireframe is the design-development surface used to settle hierarchy and transitions before visual styling.

---

## 8. CLI-wireframe design protocol

Design moments before designing a complete application shell.

Required canonical frames:

```text
01 entry / research question
02 blocked evidence
03 admitted but bounded quantity
04 settlement shortfall
05 monetary interpretation and non-claims
06 advanced workbench
07 research evidence / replication
08 mobile collapse
```

Each frame must state:

```text
SCREEN PURPOSE
What question does this screen answer?

USER INPUT
What may the user change?

SYSTEM RESPONSE
What recalculates or becomes available?

INVARIANTS
What must visibly remain unchanged?

PRIMARY ACTION
What is the intended next step?

EXIT ARTIFACT
What enters the assessment receipt?
```

### Minimal canonical wireframe sequence

#### Entry

```text
Can energy evidence credibly constrain money?

180 units requested

[ examine the evidence ]
```

#### Blocked

```text
180 requested

BLOCKED
Minimum provenance not met

L0 ------------------------------ L2
^
current

Evidence identity unchanged

[ declare L2 counterfactual ]
```

#### Bounded

```text
180 requested
126 permitted

PROVENANCE-POLICY CAPACITY BINDS
54 units not authorized

[ stress the obligation ]
```

#### Settlement

```text
126 outstanding
50.4 covered
75.6 shortfall

PARTIAL SETTLEMENT

Passing issuance did not guarantee settlement.
```

#### Meaning

```text
DEMONSTRATED
- evidence can gate issuance
- policy can bind quantity
- failure can remain visible and reproducible

NOT DEMONSTRATED
- real operator evidence
- enforceable redemption
- circulation
- monetary acceptance

[ inspect receipt ]  [ read research ]
```

A wireframe fails if the monetary argument requires a paragraph beside it to explain what the interface is doing.

---

## 9. Competition, incubator, and presentation reuse

Do not create a separate competition product or a visible competition mode.

The same flagship flow should support a five-minute presentation:

```text
problem
→ live blocked decision
→ controlled counterfactual
→ bounded quantity
→ visible settlement failure
→ intellectual contribution
→ existing technical proof
→ next real-evidence pilot
```

Reusable competition package:

- one-page programme brief;
- ten-slide source deck;
- fixed five-minute demonstration script;
- architecture figure;
- public claim matrix;
- pilot offer;
- repository and release references;
- explicit risk and non-claim page.

Opportunity fit:

| Opportunity | Current role |
|---|---|
| YZU entrepreneurship / incubation consultation | institutional assessment, mentor connection, and possible real-evidence introduction |
| FTSID / Asia University | focused CL–ECI / Policy Lab academic paper |
| ETHOnline | conditional receipt-identity, lineage, verification, or anti-reuse extension only |
| FINEC | conditional standalone empirical paper after result-ledger audit |
| Ledger | later Constrained Ledger institutional paper |
| JOSS | later Policy Lab research-software publication after stable public development and external use |
| FinTech Taipei | removed from active plan because artificial team formation would distort the project |

Every external submission must improve a reusable core artifact. No opportunity may create a parallel ontology, separate product identity, or unsupported claim set.

---

## 10. Implementation mapping

Reuse existing components rather than rebuilding the engine.

| Existing component | Intended role |
|---|---|
| `LabOverview` | source for the canonical guided interaction |
| `CaseExplorer` | Workbench case selection |
| `CaseWorkspace` | detailed stage and constraint inspection |
| `CompareWorkspace` | comparison of complete assessments or declared policies |
| `ReceiptsWorkspace` | assessment receipt library and verification |
| `DecisionBrief` | contextual empirical result and policy trade-off evidence |
| `EmpiricalRunsLab` | full empirical study |
| `EmpiricalReproductionLab` | reproduction and source-package verification |
| `EvidenceLab` | evidence stage and future real-evidence import path |
| `CurrencyLab` | settlement and monetary-performance experiments |
| `SpkV1Console` | historical reference implementation and testnet proof |
| `ResearchPanel` | publication, methods, and source library |

The next interface pass should first create the guided shell and insert the existing TYN evaluation. Do not redesign every route simultaneously.

Recommended implementation sequence:

1. freeze the Monetary System Assessment output;
2. freeze the guided state transitions and invariants;
3. complete CLI wireframes;
4. map existing components and runtime objects to each state;
5. implement one reduced guided flow;
6. connect receipt and research drill-down;
7. preserve existing advanced routes as deep links;
8. validate desktop and mobile comprehension;
9. only then reconsider primary navigation and visual system.

---

## 11. Repository hygiene rules

1. Do not create another broad strategy document unless this handoff is explicitly superseded.
2. Amend this handoff or create a dated decision record for material changes.
3. Do not delete historical documents solely because their framing is old.
4. Mark superseded or historical documents through recovery/status pointers.
5. Keep research authority separate from packaging authority.
6. Do not allow interface labels to exceed the public claim matrix.
7. Keep competition copy, homepage copy, README copy, and pitch copy traceable to one source statement.
8. Preserve exact case values, policy identities, result IDs, source revisions, and non-claims.
9. Do not merge `solarpunk-portfolio-review` mechanically; use it as a newer audit and reproduction source until a separate evidence migration is performed.
10. No new token, contract deployment, generic dashboard, AI assistant, cloud account system, or billing surface is part of this consolidation.

---

## 12. Current stop rule

This consolidation authorizes documentation and wireframe work. It does not yet authorize a broad frontend rewrite.

The next implementation branch should be opened only after the CLI wireframes establish:

- the exact flagship states;
- the one primary action per state;
- the visible invariants;
- the final assessment output;
- the mapping to existing runtime and receipt objects;
- the mobile collapse strategy.

The next field-value target remains one real attributable evidence source. Interface work must make that missing gate clearer, not conceal it.

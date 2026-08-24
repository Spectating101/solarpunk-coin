# Policy Lab Public Conversion Playbook

**Updated:** 2026-08-24  
**Purpose:** convert the already-live Policy Lab workbench into a coherent, citable, externally reviewable research-software artifact without reopening broad product construction.

This document is about **packaging, release, review, and conversion**, not new feature development.

---

## 1. Current state

The project has already crossed the original static-publication gate.

Landed:

- deterministic case/policy decision core;
- typed admission, quantity, and settlement semantics;
- receipts, capsules, lineage, and deterministic replay;
- controlled energy case pack;
- one bounded outside public-data case (`PUB-AUSGRID-001P`) at actual L0 assurance;
- derived and independently verified `ConstrainedClaimAssessment` v1;
- G4 hostile audit with public-evidence external-evaluation readiness;
- live GitHub Pages deployment;
- post-deploy/scheduled live browser smoke path;
- structured evaluation, replication, pilot/external-case intake;
- external-validation ledger and live-validation runbook.

Therefore the immediate problem is **not whether Policy Lab can be published**. It is whether the public package is coherent enough that an outsider can understand, inspect, reproduce, critique, and cite the current artifact without reconstructing its historical layers.

---

## 2. Conversion objective

Within five minutes, a reviewer should understand:

1. the research question;
2. what evidence is actually being evaluated;
3. why one policy blocks while another admits a bounded quantity;
4. which constraint binds that quantity;
5. why settlement is a separate failure stage;
6. how the result can be reproduced;
7. which R1–R4 boundaries remain open.

Current public description:

> **Policy Lab shows where an energy-linked financial claim stops being justified, why, and what evidence would be needed next.**

Long-form role:

> Policy Lab is an executable research environment for testing how far a proposed energy-linked financial claim can be justified under declared evidence, policy, quantity, risk, settlement, and governance assumptions while preserving exactly which research boundaries remain open.

---

## 3. Canonical public demonstration

Start with the outside-data case, not the historical token stack.

### Step 1 — bounded outside evidence

Open `PUB-AUSGRID-001P`.

Show:

```text
336 half-hour intervals
actual assurance L0
33.066 kWh eligible derived surplus
```

Explain:

> Public availability and hash custody do not upgrade the evidence into trusted operator provenance.

### Step 2 — same evidence, different policy

Open research policy:

```text
LAB-CASE-OPEN-004
→ ADMIT_WITH_LIMIT
→ 33.066 kWh
→ EVIDENCE_BACKED_CAPACITY binds
```

Strict pilot policy:

```text
ENERGY-CASE-PILOT-005
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE
```

Narrative:

> The system keeps the outside evidence fixed and makes the consequence of the declared policy inspectable.

### Step 3 — settlement stress

Apply 40% declared settlement capacity:

```text
PARTIAL
13.2264 kWh covered
19.8396 kWh shortfall
```

Narrative:

> Admission and bounded quantity do not prove that an obligation can settle.

### Step 4 — receipt / capsule / replay

Show the durable case, evidence, policy, decision, settlement, and runtime identities and the portable artifacts used for reproduction.

### Step 5 — R1–R4 assessment

Show:

```text
R1  NOT_ASSESSED
R2  PARTIAL
R3  PARTIAL
R4  UNTESTED
```

The demonstration should end on **what remains unresolved**, not on token issuance.

Optional second demonstration: controlled `TYN-001` L0 → declared L2 assurance counterfactual to explain evidence identity versus assurance scenario and deterministic decision identity.

---

## 4. Public-package rule

The public artifact should have one consistent hierarchy:

```text
README
  ↓
POLICY_LAB_PUBLIC_PACKAGE
  ↓
DEMO_WALKTHROUGH / G4 EVALUATOR BRIEF
  ↓
FINAL RESEARCH RECONCILIATION
  ↓
PROJECT_RECOVERY / deeper implementation docs
```

Historical SolarPunk/SPK material stays available but must not become a competing front door.

Do not make a reviewer decide whether the project is:

- a token demo;
- a Sepolia settlement lab;
- an energy-backed currency;
- a generic rules engine;
- a policy research workbench.

The current top-level answer is **Policy Lab / case-based constraint research workbench**.

---

## 5. Packaging checklist before broader outreach

### Documentation

- [ ] README reflects current public identity and claim boundary.
- [ ] `DOCS.md` reflects current authority hierarchy.
- [ ] `CURRENT_STATUS.md` reflects the August live/validation state.
- [ ] `DEMO_WALKTHROUGH.md` starts with the public Ausgrid case.
- [ ] `CONTRIBUTING.md` points to current Policy Lab surfaces.
- [ ] GitHub issue/contact links point to Policy Lab material.
- [ ] Historical docs are clearly subordinate where they conflict with current authority.

### Public review path

- [ ] Live URL loads reliably.
- [ ] Post-deploy smoke verifies production after publication.
- [ ] The reviewer can reach policy divergence, settlement stress, receipts, and R1–R4 state without coaching.
- [ ] No UI copy implies L0 evidence is stronger than it is.
- [ ] No UI copy implies R4 monetary performance is established.

### Release package

- [ ] Choose exact source commit.
- [ ] Create release notes from the frozen claim boundary.
- [ ] Capture representative screenshots/review artifact.
- [ ] Include or link the G4 evaluator brief.
- [ ] Include or link the public-case artifacts / reproduction path.
- [ ] Synchronize version/date in `CITATION.cff` only when the tagged release is created.
- [ ] Archive through Zenodo only when the GitHub Release is intentional and final enough to cite.

---

## 6. Release posture

The existing `CITATION.cff` currently carries `0.2.0-alpha` release metadata.

Do **not** change the citation version/date merely because `main` advanced.

For the next citable release, synchronize together:

```text
exact source commit
      ↓
Git tag
      ↓
GitHub Release
      ↓
release notes
      ↓
CITATION.cff version/date
      ↓
visual/review artifacts
      ↓
Zenodo DOI/archive (if used)
      ↓
README citation text
```

Recommended release wording should describe a **public research release / live validation release**, not production or stable deployment.

Do not imply that a DOI is peer review.

---

## 7. Release-note structure

A future release should answer:

### What this release tests

Whether bounded outside evidence can retain its assurance limits while explicit versioned policy produces reproducible blocking, quantity, settlement, and assessment consequences.

### Canonical outside-data case

`PUB-AUSGRID-001P` with open versus strict pilot policy divergence.

### Reproducibility

State the deterministic receipt/capsule/assessment reproduction path and stable assessment identity.

### Research-boundary result

```text
R1 NOT_ASSESSED
R2 PARTIAL
R3 PARTIAL
R4 UNTESTED
```

### Explicit non-claims

Repeat the public claim boundary: no operator confirmation, physical meter truth, legal issuance, enforceable redemption, optimal pricing, bounded production governance, production readiness, adoption, or money.

### Next evidence gate

A stronger attributable owner/operator or authenticated source path is a possible next evidence gate, not a mandatory precondition for the current release to exist.

---

## 8. External validation when ready

External outreach is **not** required before packaging is coherent.

When initiated, start with a small heterogeneous cohort rather than broad promotion.

Useful evidence classes include:

- independent comprehension;
- substantive criticism;
- independent reproduction;
- reuse or fork;
- attributable outside evidence;
- institutional evaluation;
- repeat use.

Traffic, page views, stars, internal dry-runs, or self-authored praise are not independent validation.

Use:

- [`EXTERNAL_VALIDATION_LEDGER.md`](../research/EXTERNAL_VALIDATION_LEDGER.md)
- [`POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md`](./POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md)

Do not change the frozen Gauntlet profile merely because the project was deployed. Only real new evidence can justify updating evidence-sensitive dimensions.

---

## 9. Stronger outside evidence / pilot path

The current public case already proves one bounded outside-data path. A stronger future evidence step would add **attribution/authentication**, not merely another random dataset.

Preferred targets:

```text
named/cooperative source holder
or
trusted operator / facility context
or
authenticated historical export
```

The goal is to learn whether the evidence architecture survives a stronger real-source relationship while preserving privacy and claim boundaries.

Success may be as small as one cooperative research case. It does not require a commercial launch.

---

## 10. Portfolio conversion

Preferred project title:

```text
Policy Lab — Case-Based Constraint Research Workbench
```

Preferred one-line description:

> Built a deterministic research workbench that preserves evidence assurance, applies versioned admission/quantity/settlement constraints, attributes blocking and binding rules, and emits reproducible receipts and constrained-claim assessments.

Useful technical framing:

> Designed portable JSON-schema objects and a shared Node/browser decision engine for evidence, policy, typed constraint evaluation, deterministic decision identity, bounded claims, settlement shortfall, receipts, capsules, and R1–R4 assessment derivation.

Useful public-evidence framing:

> Landed and audited a bounded Ausgrid public-source case at actual L0 assurance, producing deterministic open/pilot policy divergence, settlement stress, closed-world assessment verification, and explicit non-claims around operator provenance and monetary performance.

Do not summarize the current artifact as “built an energy-backed cryptocurrency.”

---

## 11. Interview / evaluator opening

Use:

> I was working on energy-linked finance and found that the hard problem was not token issuance. It was deciding what evidence and constraints had to bind before a financial quantity was allowed to exist. I turned that into a deterministic case workbench that makes the stopping point and remaining evidence gap explicit.

Then demonstrate the public Ausgrid case.

Only show historical SPK/Sepolia implementation if the reviewer asks about the originating reference architecture.

---

## 12. Stop rule

Do not delay packaging/release for:

- AI assistant;
- more locations;
- new policy families;
- GIS infrastructure;
- new blockchain contracts;
- accounts/billing;
- cloud evidence storage;
- marketplace features;
- token redesign.

A new implementation tranche should be justified by one of:

```text
packaging failure
live-operability failure
reproduction failure
external-evidence requirement
observed user/evaluator need
```

---

## 13. Current conversion sequence

```text
LIVE POLICY LAB
      ↓
COHERENT PUBLIC PACKAGE
      ↓
TAGGED / CITABLE RELEASE
      ↓
CONTROLLED EXTERNAL REVIEW WHEN READY
      ↓
STRONGER ATTRIBUTABLE EVIDENCE OR PILOT IF JUSTIFIED
      ↓
REASSESS PRODUCT / RESEARCH / FUNDING ROUTES
```

The point of the current phase is to make the already-built asset legible, durable, and citable before asking outsiders to judge it.

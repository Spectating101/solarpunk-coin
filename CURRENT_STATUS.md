# Current status

**Updated:** 2026-08-24  
**Current public identity:** **Policy Lab — Case-Based Constraint Research Workbench**  
**Operating posture:** live deployed research artifact; packaging/review hardening; controlled external evaluation when ready.

Live workbench: https://spectating101.github.io/solarpunk-coin/demo/

Start with:

- [`README.md`](./README.md)
- [`docs/project/POLICY_LAB_PUBLIC_PACKAGE.md`](./docs/project/POLICY_LAB_PUBLIC_PACKAGE.md)
- [`docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md`](./docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md)
- [`PROJECT_RECOVERY.md`](./PROJECT_RECOVERY.md)

Historical SolarPunk Public Lab / Energy Standard / SPK material remains in the repository but is no longer the top-level semantic authority.

---

## What Policy Lab is

Policy Lab is an executable research environment for testing how far a proposed energy-linked financial claim can be justified under declared evidence, policy, quantity, risk, settlement, and governance assumptions while keeping unresolved research boundaries visible.

Short public version:

> **Policy Lab shows where an energy-linked financial claim stops being justified, why, and what evidence would be needed next.**

Current runtime path:

```text
Case
  ↓
Evidence + Context
  ↓
Versioned Policy
  ↓
Admission Gates
  ↓
Quantity Ceilings
  ↓
DecisionResult
  ↓
Bounded Claim
  ↓
Settlement Result
  ↓
Receipt / Lineage / Reproduction
```

Current research model:

```text
R1 — economic information / admissibility
R2 — claim-level evidence
R3 — binding constraint
R4 — monetary performance
```

The runtime stages are implementation stages, not aliases for R1–R4.

---

## What is live now

| Surface | Status |
|---|---|
| Public Policy Lab workbench | **LIVE** |
| Deterministic core | **TESTED** |
| Case/policy comparison | **TESTED** |
| Receipt/capsule generation | **TESTED** |
| Constrained Claim Assessment v1 | **LANDED + VERIFIED** |
| Public outside-data case `PUB-AUSGRID-001P` | **LANDED** |
| G4 hostile audit | **READY FOR EXTERNAL EVALUATION — PUBLIC-EVIDENCE PROFILE** |
| GitHub Pages deployment | **AUTOMATED** |
| Post-deploy / scheduled live smoke | **LANDED** |
| External-validation ledger and evaluator intake | **LANDED** |
| Independent external evaluator verdict | **NOT YET** |
| Owner/operator attributable evidence case | **OPEN** |
| L1/L2 authenticated public case | **OPEN** |
| R4 monetary-performance evidence | **UNTESTED** |

---

## Canonical public-source result

Case: `PUB-AUSGRID-001P`

The case uses a bounded public Ausgrid Solar Home Electricity Data object at actual **L0** assurance.

Same normalized evidence under two declared policies:

```text
LAB-CASE-OPEN-004
→ ADMIT_WITH_LIMIT
→ 33.066 kWh maximum
→ EVIDENCE_BACKED_CAPACITY binds

ENERGY-CASE-PILOT-005
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE
```

Declared 40% settlement-capacity stress:

```text
PARTIAL
13.2264 kWh covered
19.8396 kWh shortfall
```

Derived `ConstrainedClaimAssessment`:

```text
R1 economic information       NOT_ASSESSED
R2 claim-level evidence       PARTIAL
R3 binding constraint         PARTIAL
R4 monetary performance       UNTESTED
```

The audited stable assessment identity is:

`088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`

---

## Current claim boundary

The current package supports claims about:

- one bounded outside-data workflow;
- exact byte/hash custody of the executed mirror object;
- explicit source semantics and declared transformation;
- preservation of actual L0 assurance;
- deterministic policy divergence;
- blocking and binding-rule attribution;
- quantity ceilings;
- declared settlement-shortfall mechanics;
- receipt/capsule integrity and deterministic replay;
- deterministic derivation and verification of the R1–R4 assessment.

It does **not** establish:

- source-holder/operator confirmation;
- physical meter truth;
- L1/L2 authentication for the public case;
- legal issuance authority;
- enforceable settlement/redemption;
- economically optimal policy/pricing;
- bounded production governance;
- production security;
- commercial readiness;
- adoption or market demand;
- circulation, liquidity, acceptability, unit-of-account use, or money.

---

## Deployment state

The public interface is statically deployed through `.github/workflows/deploy.yml`.

The deployment pipeline:

```text
main push
  ↓
public-lab preflight
  ↓
deterministic core tests
  ↓
frontend tests
  ↓
Vite build
  ↓
bundle/public-surface checks
  ↓
docs/demo mirror
  ↓
GitHub Pages
```

A separate `Policy Lab Live Smoke` workflow is configured for scheduled/manual checks and post-deployment production verification.

This is a deployment/operability check, not external validation.

---

## Validation state

Internal process dry-run issue `#47` was intentionally classified as:

```text
INTERNAL_DRY_RUN_ONLY
```

It must not be cited as independent validation, adoption, pilot evidence, or Gauntlet uplift evidence.

External evidence is governed by:

- [`docs/research/EXTERNAL_VALIDATION_LEDGER.md`](./docs/research/EXTERNAL_VALIDATION_LEDGER.md)
- [`docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md`](./docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md)
- Policy Lab evaluation / pilot / replication issue templates.

Traffic alone does not count as validation.

---

## Packaging state

Current work is to make the public artifact coherent before broader outreach.

Priority packaging tasks:

1. remove contradictory stale front-door documentation;
2. keep one canonical five-minute reviewer path;
3. make public claim boundaries and R1–R4 state easy to understand;
4. keep historical SolarPunk/SPK material available without letting it override current semantics;
5. prepare a synchronized future citable release package rather than silently changing release metadata;
6. preserve the deterministic core unless observed evidence justifies a change.

---

## Current stop rule

Do **not** reopen broad construction merely because the artifact is public.

No default expansion into:

- AI decision authority;
- generic chatbot;
- more policy families;
- broad GIS infrastructure;
- marketplace features;
- accounts/billing;
- cloud evidence storage;
- token redesign;
- new blockchain deployment;
- production/mainnet claims.

The next implementation should be justified by a packaging failure, live-operability failure, replication failure, or genuine outside evidence/use case.

---

## Historical SolarPunk / SPK status

SPK and the Sepolia reference contracts remain inspectable historical/reference implementation material. They do not convert the current Policy Lab into a token launch, stablecoin, legal claim, or monetary system.

For historical contract/state details, use the relevant `docs/product/`, `state/runtime/`, `spk_v1/`, and contract files only after the current Policy Lab framing is understood.

---

## Release / citation posture

`CITATION.cff` currently retains the existing `0.2.0-alpha` release metadata.

Do not change the version/date merely because `main` has advanced. A future packaging release should synchronize the Git tag, GitHub Release, citation metadata, release notes, screenshot/review artifacts, and DOI/archive if used.

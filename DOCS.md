# Documentation map

**Current as of 2026-08-24.**  
If you are a human reviewer or an AI agent catching up, start here rather than reconstructing the project from historical SolarPunk/SPK files.

## What this project is now

**Policy Lab — Case-Based Constraint Research Workbench**

> A public research workbench for investigating what blocks admission, what bounds financial quantity, and what fails at settlement.

Current short public interpretation:

> **Policy Lab shows where an energy-linked financial claim stops being justified, why, and what evidence would be needed next.**

The historical SolarPunk Public Lab / Energy Standard / SPK stack remains part of the repository as the originating reference domain and implementation history. It is **not** the current top-level semantic authority.

Live workbench: https://spectating101.github.io/solarpunk-coin/demo/

---

## Read these first

| Priority | File | Why |
|---:|---|---|
| 1 | [`README.md`](./README.md) | Current public overview, five-minute investigation, runtime semantics, trust boundaries |
| 2 | [`docs/project/POLICY_LAB_PUBLIC_PACKAGE.md`](./docs/project/POLICY_LAB_PUBLIC_PACKAGE.md) | Compact packaging/review entry point |
| 3 | [`docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md`](./docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md) | Current semantic authority for research-to-software meaning |
| 4 | [`PROJECT_RECOVERY.md`](./PROJECT_RECOVERY.md) | Source hierarchy, migration boundaries, recovery instructions |
| 5 | [`docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md`](./docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md) | Canonical public-source case and evaluator path |
| 6 | [`DEMO_WALKTHROUGH.md`](./DEMO_WALKTHROUGH.md) | Current reviewer-facing five-minute walkthrough |
| 7 | [`docs/research/EXTERNAL_VALIDATION_LEDGER.md`](./docs/research/EXTERNAL_VALIDATION_LEDGER.md) | What may and may not count as external validation |
| 8 | [`docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md`](./docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md) | Live deployment and external-evaluation operating procedure |

When documents disagree, follow the authority order in `PROJECT_RECOVERY.md`. Historical Public Lab/SPK documents do not override the August 2026 research reconciliation.

---

## Current research model

```text
energy-adjacent observation
  ↓
R1 — economic information / admissibility
  ↓
R2 — claim-level evidence
  ↓
R3 — binding constraint
  ↓
constrained financial claim
  ↓
R4 — monetary performance
```

Current runtime decomposition:

```text
Evidence → Assurance → Admission → Quantity → Settlement → Receipt
```

Do not equate the runtime stages with R1–R4.

Other namespaces remain separate:

```text
CF1–CF9   conformance benchmark families
C0–C4     conformance levels
L0–L4     source assurance
```

---

## Canonical public evidence case

`PUB-AUSGRID-001P` is the first landed outside public-data case.

It preserves actual assurance at **L0** and produces deterministic policy divergence:

```text
LAB-CASE-OPEN-004
→ ADMIT_WITH_LIMIT
→ 33.066 kWh maximum
→ EVIDENCE_BACKED_CAPACITY binds

ENERGY-CASE-PILOT-005
→ BLOCKED
→ SIGNED_EVIDENCE + MIN_PROVENANCE
```

Declared 40% settlement capacity on the admitted quantity:

```text
PARTIAL
13.2264 kWh covered
19.8396 kWh shortfall
```

Derived assessment:

```text
R1  NOT_ASSESSED
R2  PARTIAL
R3  PARTIAL
R4  UNTESTED
```

This case is public outside-data operability evidence. It is **not** owner/operator confirmation, physical-meter certification, L1/L2 provenance, legal issuance, enforceable redemption, production readiness, adoption, or money.

---

## Current implementation map

| Area | Location |
|---|---|
| Deterministic decision core | `packages/constraint-core/` |
| Schemas | `protocol/schema/` |
| Policy manifests | `protocol/policies-v2/` |
| Energy cases | `protocol/cases/energy-v1/` |
| Case / compare / receipt frontend | `frontend/src/cases/`, `frontend/src/compare/`, `frontend/src/receipts/` |
| Public static build | `docs/demo/` |
| Public-source Ausgrid workflow | `.github/workflows/external-case-001p-ausgrid.yml` |
| Live deployment workflow | `.github/workflows/deploy.yml` |
| Live production smoke | `.github/workflows/policy-lab-live-smoke.yml` |
| Constrained Claim Assessment builder/verifier | `scripts/build_constrained_claim_assessment.mjs`, `scripts/verify_constrained_claim_assessment.mjs` |
| Market-capacity empirical study | `frontend/public/empirical/`, `docs/protocol/EMPIRICAL_RUNS_V1.md` |
| Historical SolarPunk/SPK reference implementation | `docs/product/`, `state/runtime/`, `spk_v1/`, contracts |

---

## Commands that matter for the current workbench

```bash
npm install

# deterministic core
node --test packages/constraint-core/test/*.test.mjs

# package contents
npm pack --dry-run --prefix packages/constraint-core

# frontend
cd frontend
npm install
npm run test:run
npm run build
npm run dev
```

From repository root, the current public-lab preflight / static publish path remains:

```bash
npm run public-lab:preflight
npm run public-lab:publish
```

The deployed site is also checked by the scheduled/post-deploy Playwright smoke workflow.

---

## Current operating posture

Policy Lab is **not** in broad feature expansion.

Current sequence:

```text
research semantics frozen
      ↓
G4 public-evidence core
      ↓
live deployed workbench
      ↓
packaging / review hardening
      ↓
controlled external evaluation when ready
      ↓
stronger attributable evidence / pilot only if justified
```

Do not add AI assistants, new policy families, token mechanics, GIS infrastructure, backends, billing, marketplaces, or other scope merely to make the project appear larger.

---

## Historical documents

Many historical documents remain useful for provenance, thesis history, SPK reference mechanics, testnet contracts, or earlier design decisions. Some of them still use terms such as:

- SolarPunk Public Lab v1.0;
- energy-standard settlement laboratory;
- network money;
- SPK launch;
- monetary system assessment;
- old B1–B9 boundary naming.

Treat those as historical unless a current authority file explicitly retains the claim.

In particular, the following are **not** current top-level framing authorities:

- `docs/product/PUBLIC_LAB_V1.md`;
- old SPK launch/readiness documents;
- old network-money snapshots;
- pre-reconciliation packaging docs where they conflict with the final reconciliation;
- legacy opportunity/competition plans.

They should not be deleted merely for being historical, but they must not be used to override current Policy Lab semantics.

---

## Release / citation note

The repository contains [`CITATION.cff`](./CITATION.cff). Its version/date should be synchronized only when a deliberate new tagged/archived software release is created.

Do not infer that the August 2026 packaging work is already a new DOI or tagged release.

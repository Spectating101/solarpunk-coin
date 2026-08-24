# Policy Lab — documentation index

This file is a **navigation aid, not a source of runtime truth**.

For current project state, start with [`CURRENT_SURFACE.json`](./CURRENT_SURFACE.json) and verify it with:

```bash
npm run policy-lab:surface
npm run policy-lab:preflight
```

The human-facing entrypoint is [`README.md`](./README.md). Agent instructions are in [`AGENTS.md`](./AGENTS.md).

## Executable sources

| Surface | Source |
|---|---|
| Public app | `frontend/src/App.jsx` + `frontend/src/app/routes.js` |
| Workbench state/runtime | `frontend/src/app/CaseWorkbenchProvider.jsx` + `frontend/src/lib/caseWorkbenchRuntime.js` |
| Deterministic decision core | `packages/constraint-core/src/workbench.js` |
| Controlled case pack | `protocol/cases/energy-v1/case-pack.json` |
| Policies | `protocol/policies-v2/` |
| Schemas | `protocol/schema/` |
| Outside-data execution | `.github/workflows/external-case-001p-ausgrid.yml` |
| Portable assessment package | `protocol/schema/claim-assessment-package.v0.1.schema.json` + package builder/verifier scripts |
| Deployment | `.github/workflows/deploy.yml` |
| Production verification | `.github/workflows/policy-lab-live-smoke.yml` |

## Research and historical documentation

The `docs/` tree contains research papers, empirical notes, implementation handoffs, packaging work, institutional evidence, grant material, historical SolarPunk/SPK documentation, and archived pre-pivot material.

Those files can explain **why** a mechanism exists or preserve prior decisions, but filenames such as `FINAL`, `CURRENT`, `MASTER`, `HANDOFF`, `STATUS`, or `SOURCE_OF_TRUTH` do not override executable state.

Use them only after identifying the relevant executable object and checking that the document still agrees with it.

## Current research boundary reminder

```text
R1 — economic information / admissibility
R2 — claim-level evidence
R3 — binding constraint
R4 — monetary performance
```

Runtime stages remain distinct:

```text
Evidence → Assurance → Admission → Quantity → Settlement → Receipt
```

The current outside-data checkpoint is `PUB-AUSGRID-001P` at actual `L0` assurance; R4 remains `UNTESTED`. See `CURRENT_SURFACE.json` and the external-case workflow for the machine path.

## Historical SolarPunk / SPK material

SolarPunk Public Lab, Energy Standard, SPK v1, Sepolia contracts, Foundation/operator machinery, earlier product experiments, grant work, and thesis tooling are retained as research lineage and reference surfaces.

They do not define the current Policy Lab release path. Historical scheduled writers, legacy deploy workflows, and the obsolete package publisher are archived under `archive/github-workflows/` rather than active GitHub Actions.

When documentation conflicts, do not resolve the conflict by choosing a newer-looking Markdown file. Resolve it against code, schemas, generated artifacts, workflows, tests, and `CURRENT_SURFACE.json`.

# Policy Lab — agent instructions

Do **not** reconstruct current project state from historical Markdown handoffs, filenames such as `CURRENT_STATUS.md`, or SolarPunk/SPK deployment artifacts.

## Authoritative starting point

1. Read [`CURRENT_SURFACE.json`](./CURRENT_SURFACE.json).
2. Run `npm run policy-lab:surface`.
3. Inspect the executable path relevant to the task:
   - frontend entry/routes: `frontend/src/App.jsx`, `frontend/src/app/routes.js`
   - shared state/runtime: `frontend/src/app/CaseWorkbenchProvider.jsx`, `frontend/src/lib/caseWorkbenchRuntime.js`
   - deterministic core: `packages/constraint-core/src/workbench.js`
   - controlled case pack: `protocol/cases/energy-v1/case-pack.json`
   - policies: `protocol/policies-v2/`
   - schemas: `protocol/schema/`
   - outside-data case: `.github/workflows/external-case-001p-ausgrid.yml`
   - deployment: `.github/workflows/deploy.yml`
4. Run `npm run policy-lab:preflight` before treating a proposed surface as current/releasable.

## Current identity

The current project is **Policy Lab — a case-based constraint research workbench**.

SolarPunk / Energy Standard / SPK / Sepolia material is historical and reference-domain machinery. It may be inspected or reproduced when a task requires it, but it does not define current project identity, validation state, deployment prerequisites, or research authority.

## Evidence boundaries

- The interactive four-case pack is controlled and declares `empirical_claim: false`.
- `PUB-AUSGRID-001P` is a separate outside-public-data checkpoint at actual `L0` assurance.
- Do not promote controlled fixtures, modeled context, public data, receipts, signatures, packages, contracts, or blockchain state into stronger evidence than their source supports.
- R1–R4 research boundaries are not aliases for runtime stages.
- R4 remains `UNTESTED` absent dedicated monetary-performance evidence.
- A deterministic receipt/package proves lineage/reproduction, not physical truth, legal authority, reserves, certification, adoption, or money.

## Change discipline

When code, generated artifacts, workflows, and prose disagree, investigate the executable objects first.

If the canonical project surface genuinely changes, update `CURRENT_SURFACE.json` and `scripts/check_current_surface.mjs` in the same change.

Preserve historical systems unless removal is independently justified; do not reactivate archived scheduled writers, legacy deployment workflows, or old package publishers.

## Documentation

`README.md` is the human entrypoint. `DOCS.md` is only a documentation index. Other Markdown files are research/history/context and are **not runtime authority unless independently verified against executable state**.

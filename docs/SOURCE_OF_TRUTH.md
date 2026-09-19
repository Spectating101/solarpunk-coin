# Policy Lab — current source of truth

Where each part of the current project lives, and which files are authority. Moved out of the README
front page; `CURRENT_SURFACE.json` remains the machine-declared authority.

## Map

Do **not** infer current project state from whichever Markdown handoff looks newest. This repository contains years of historical iterations.

The current surface is machine-declared in [`CURRENT_SURFACE.json`](./CURRENT_SURFACE.json) and enforced by [`scripts/check_current_surface.mjs`](./scripts/check_current_surface.mjs) in CI.

| Question | Current executable source |
|---|---|
| What is the project? | `CURRENT_SURFACE.json` |
| What does the public app expose? | `frontend/src/App.jsx` + `frontend/src/app/routes.js` |
| What evaluates a case? | `packages/constraint-core/src/workbench.js` |
| Which controlled cases exist? | `protocol/cases/energy-v1/case-pack.json` |
| Which policy manifests are executable? | `protocol/policies-v2/` |
| What schemas bind outputs? | `protocol/schema/` |
| What is the outside-data checkpoint? | `.github/workflows/external-case-001p-ausgrid.yml` + `frontend/src/data/publicEvidenceCheckpoint.js` |
| What portable artifact leaves the lab? | `policylab.claim_assessment_package.v0.1` |
| What publishes the live site? | `.github/workflows/deploy.yml` |
| What verifies production after deploy? | `.github/workflows/policy-lab-live-smoke.yml` |

Historical Markdown remains useful for provenance, research development, and reconstruction, but it is not runtime authority.

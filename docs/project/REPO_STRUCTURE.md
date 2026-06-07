# Repository Structure

This document separates active project assets from archived or local-only material. Use it before moving or deleting files.

For the folder-by-folder cleanup judgment, see `docs/project/FOLDER_CLEANUP_ASSESSMENT.md`.

## Active Reviewer Surface

- `CURRENT_STATUS.md` - **canonical live snapshot** (tests, deployments, gaps).
- `thesis_package/THESIS_SOURCE_OF_TRUTH.md` - thesis framing and numbers.
- `docs/project/DOC_MAINTENANCE.md` - how to verify and update docs.
- `README.md` - public landing page (should match CURRENT_STATUS).
- `EVIDENCE.md` - proof index with clickable artifacts.
- `MASTER_HANDOFF.md` - long-form context (verify numbers against CURRENT_STATUS).
- `docs/grants/` - current reviewer packet, grant plan, copy-paste answers, outreach templates, and submission brief.
- `GRANT_SUBMISSIONS/` - only the current submission-ready drafts.

## Active Protocol Code

- `contracts/` - Solidity protocol contracts.
- `test/` - Hardhat smart contract tests.
- `scripts/` - deployment, verification, keeper, role, and reporting scripts.
- `state/` - public deployment state, keeper logs, proofs, and attestations.
- `.github/workflows/` - Pages deploy, keeper automation, and CI-style automation.

## Active Demo And Client Code

- `frontend/` - Vite/React public demo source. GitHub Pages builds from this app.
- `clients/` - client-facing integration code.
- `energy_derivatives/` - Python SDK, analytics, docs, tests, and package source.
- `grafana/` - dashboard definitions and datasource configuration.

## Research And Thesis Assets

- `docs/thesis/` - current thesis/proposal materials.
- `docs/papers/` - supporting paper-style documentation.
- `thesis_package/` - thesis package, empirical results, code reference, and analysis assets.
- `RESEARCH/`, `empirical/`, `IE-JDE/` - research workspace and related manuscripts/data. These may look noisy, but they are not safe to delete automatically because they support the academic and grant story.

## Archive

- `docs/archive/` - stale materials retained for traceability.
- `docs/archive/legacy-grant-submissions/` - old grant drafts moved out of the active send path.
- `docs/archive/legacy-interface-design/` - old Claude-generated interface artifacts kept as design reference only.
- `docs/archive/BRANCH_CLEANUP_2026-05-06.md` - record of deleted remote branches and last known heads.

## Local-Only / Ignored

These are intentionally not part of the GitHub repo:

- `.env`, `frontend/.env` - secrets and local provider configuration.
- `.claude/settings.local.json` - local agent settings.
- Generated dependency/build folders such as `node_modules/`, `frontend/node_modules/`, `frontend/dist/`, `artifacts/`, and `cache/`.
- Local-only PDFs, screenshots, and binary research files ignored by `.gitignore`.

## Cleanup Rules

- Safe to remove/recreate: dependency folders, build outputs, Hardhat artifacts/cache, Playwright logs, Python cache, and generated frontend dist.
- Do not remove without review: `state/`, `docs/grants/`, `GRANT_SUBMISSIONS/`, `contracts/`, `scripts/`, `energy_derivatives/`, thesis/research folders, or any source-verified deployment record.
- If a document is obsolete but still useful historically, move it under `docs/archive/` instead of deleting it.

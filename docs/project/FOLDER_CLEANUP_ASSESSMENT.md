# Folder Cleanup Assessment

Assessed on 2026-05-06 after branch, grant, demo artifact, dependency, and build-output cleanup.

## Keep Active

These folders are part of the current protocol, demo, proof, grant, or operations surface.

| Folder | Size | Assessment |
|---|---:|---|
| `.github/` | 40K | Keep. Deploys GitHub Pages and runs keeper automation. |
| `contracts/` | 108K | Keep. Core Solidity protocol. |
| `test/` | 56K | Keep. Hardhat regression tests. |
| `scripts/` | 408K | Keep. Deployment, keeper, role, verification, and reporting scripts. |
| `state/` | 104K | Keep. Public deployment state, keeper logs, proofs, and attestations. |
| `frontend/` | 348K | Keep. Public Vite/React demo source. |
| `clients/` | 8K | Keep. Client integration surface. |
| `energy_derivatives/` | 488K | Keep. Python SDK and analytics package. |
| `grafana/` | 20K | Keep. Monitoring dashboard definitions. |
| `data/` | 12K | Keep. Attestation data. |
| `GRANT_SUBMISSIONS/` | 36K | Keep. Current submission-ready ESP and Chainlink drafts only. |
| `docs/` | 576K | Keep. Active reviewer docs plus archive. |
| `submissions_log/` | 16K | Keep for now. Lightweight outreach/application tracking. |

## Keep, But Not Reviewer-Facing

These folders are real research/thesis material. They are noisy, but deleting them would weaken or break the academic record behind the project.

| Folder | Size | Assessment |
|---|---:|---|
| `thesis_package/` | 7.7M | Keep. Thesis package, empirical results, code references, and generated thesis assets. |
| `empirical/` | 21M | Keep. Core empirical analysis workspace. Could later be reorganized, but not deleted. |
| `RESEARCH/` | 23M | Keep. Supporting research PDFs and SolarPunk research notes. Could later move PDFs to an external archive if repo size becomes a concern. |
| `IE-JDE/` | 9.2M | Keep unless deliberately separated. This appears to be adjacent journal/thesis research rather than protocol runtime code. It is the clearest candidate for future extraction into a separate research repo, but it should not be blindly deleted. |

## Already Cleaned

These classes of files were removed or archived during cleanup.

- Old generated static demo bundles under `docs/assets/`, `docs/demo/`, and `docs/interface-demo/`.
- Old Claude design zip and legacy interface working directory, now under `docs/archive/legacy-interface-design/`.
- Stale grant drafts, now under `docs/archive/legacy-grant-submissions/`.
- Local dependency/build/cache folders: `node_modules/`, `frontend/node_modules/`, `frontend/dist/`, `artifacts/`, `cache/`, Python egg/cache outputs, and Playwright logs.
- Empty local directories.

## Remaining Ignored Local Files

These are intentionally not tracked and are not part of the GitHub repo.

- `.env`, `frontend/.env`, `.claude/settings.local.json`.
- Local PDFs, screenshots, and binary research assets ignored by `.gitignore`.
- Some ignored PDFs/images under `IE-JDE/`, `RESEARCH/`, `empirical/`, and `thesis_package/`.

## Recommended Next Cleanup, If Needed

1. Leave the repo as-is for grant submission. It is clean enough for reviewers.
2. If repo clarity becomes more important than preserving all work in one place, extract `IE-JDE/` into a separate research repository or move it under `docs/archive/external-research/`.
3. If repo size becomes a problem, move large ignored PDFs/images to cloud storage or a separate private archive. Do not remove tracked empirical CSV/code/results before thesis submission.
4. Do not move `state/`, `scripts/`, `contracts/`, `frontend/`, `energy_derivatives/`, `docs/grants/`, or `GRANT_SUBMISSIONS/` before applications are sent.

## Bottom Line

The repo no longer contains obvious tracked generated junk. The remaining large folders are mostly research/thesis evidence. Further cleanup is possible, but it would be a deliberate information-architecture decision, not a simple junk-removal pass.

# Policy Lab held-branch review and uncommitted-work triage — 2026-10-11

A dated snapshot. It follows the Phase 2 report (`POLICY_LAB_CONSOLIDATION_PHASE2_REPORT_2026-10-09.md`, section B). Nothing here is runtime authority.

## What was done

- 10 remote refs were deleted because they lost nothing: nine pointed at exactly the same commit as a branch that was kept (`feat/policy-lab-frontend-convergence-{checkpoint,r1,v2}`, `fix/constraint-release-links-copy`, `release/constraint-public-alpha-{hotfix,v2}`, `release/constraint-public-alpha-{merge,r1,ready}`), and `policy-lab-post-deploy-smoke` had its only commit already applied to main (`git cherry`). Tips are recorded in the pre-cleanup backup `refs-before-cleanup.txt`.
- Nothing else in section B was deleted. These branches carry commits that are not on main.

## Remaining held branches

`ahead` = commits not on main; `new files` = files the branch adds that do not exist on main; `differs` = files that exist on main but with different content.

| Branch | Last commit | Ahead | New files | Differs | Disposition | Reason |
|---|---|---:|---:|---:|---|---|
| `audit/policy-lab-certification-20260910` | 2026-09-10 | 6 | 0 | 3 | keep until #64 reviewed | Certification of an older surface; #70 explicitly superseded it. Compare smoke isolation and selectors with current main before archiving. |
| `case/public-external-001p-ausgrid` | 2026-08-15 | 7 | 0 | 2 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `docs/consolidate-program-packaging` | 2026-08-04 | 3 | 0 | 1 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `docs/field-validation-freeze` | 2026-07-20 | 6 | 0 | 1 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `docs/submission-packaging-calendar` | 2026-08-07 | 20 | 0 | 3 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/capsule-verifier` | 2026-07-20 | 5 | 0 | 4 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/capsule-verifier-v2` | 2026-07-20 | 3 | 0 | 4 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/conformance-benchmark-v1-cf-c0-c2` | 2026-08-14 | 5 | 0 | 1 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/constrained-claim-assessment-g4` | 2026-08-16 | 18 | 0 | 2 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/constraint-protocol-alpha` | 2026-07-13 | 47 | 1 | 28 | archive record only | Historical protocol/release machinery. Preserve the record; never restore legacy publisher or deploy authority. |
| `feat/operator-custody-intake` | 2026-07-20 | 22 | 0 | 5 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `feat/policy-lab-frontend-convergence-final` | 2026-09-10 | 20 | 1 | 7 | keep (deferred) | Gauntlet-only predecessor of the frontend convergence stack; frontend work is deferred by the maintainer. Three identical-tip copies were removed. |
| `feat/policy-lab-mcp-v0` | 2026-08-18 | 49 | 18 | 0 | keep | Broader MCP operations/agent-evaluation research, 18 files not on main; the small adapter landed as #78. Revisit as research, no provider calls. |
| `fix/constraint-release-links` | 2026-07-13 | 6 | 0 | 2 | archive record only | Historical protocol/release machinery. Preserve the record; never restore legacy publisher or deploy authority. |
| `fix/policy-live-smoke-bootstrap-20260917` | 2026-09-17 | 1 | 0 | 2 | review then archive | One commit that differs from main; check against the current live-smoke workflow. |
| `policy-lab-assessment-package-recovery` | 2026-08-25 | 5 | 0 | 5 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `policy-lab-dpg-readiness-final` | 2026-08-25 | 11 | 0 | 3 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `policy-lab-identity-curation` | 2026-08-25 | 15 | 0 | 10 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `policy-lab-live-validation-v1` | 2026-08-24 | 7 | 0 | 2 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `policy-lab-packaging-v1` | 2026-08-24 | 6 | 0 | 1 | archive candidate | Every changed path exists on main in a curated form; this branch carries earlier wording. Not deleted because its text still differs and has not been compared line by line. |
| `release/constraint-public-alpha` | 2026-07-13 | 3 | 0 | 2 | archive record only | Historical protocol/release machinery. Preserve the record; never restore legacy publisher or deploy authority. |
| `release/constraint-public-alpha-final` | 2026-07-13 | 4 | 0 | 2 | archive record only | Historical protocol/release machinery. Preserve the record; never restore legacy publisher or deploy authority. |

No disposition above authorises deletion. An `archive candidate` becomes deletable only after a line-by-line comparison, a fresh backup and explicit approval.

## Uncommitted work in the main checkout

The checkout `Solarpunk-bitcoin` (branch `thesis/cleanup-canonical-pdf`, 240 commits ahead of and 2 behind main) holds 41 uncommitted entries that exist nowhere else. All 41 are present in the 2026-10-08 backup tarball (`worktrees/Solarpunk-bitcoin-main-checkout.tar.zst`). Roughly:

- Invisible Ledger drafts and data (`Invisible_Ledger_*`, `IE-JDE/Invisible_Economy/`, `IE-JDE/Digital_Tax_Design/`, `IE-JDE/Constrained_Ledger_Plain/`) — other project, out of scope; do not touch.
- Thesis and energy-circulation-indicator material (`thesis_package/ECI_*`, paper drafts, `eci_recovered_data/`, `eci_reproduction/`, one modified manifest) — adjacent research; keep local.
- Generated or tool output (`.playwright-mcp/`, `_review_workbench/` about 43 MB, `messageImage_*.jpg`, `qa-overview-desktop.yml`) — discard candidates; regenerable. Not deleted.
- `docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md` — historical four-case alpha notes; not needed on main.

Nothing was moved, committed or deleted.

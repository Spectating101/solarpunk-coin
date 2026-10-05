# Audit repair handoff and session context — 2026-10-05

This document preserves the audit/repair session for a new maintainer or agent. It is a dated snapshot, not runtime authority. Start with [CURRENT_SURFACE.json](../../CURRENT_SURFACE.json), [AGENTS.md](../../AGENTS.md), and executable checks before continuing. Detailed finding coverage and migration instructions are in [the repair report](AUDIT_REPAIRS_2026-10-05.md).

## Where the work lives

| Item | Recorded value |
|---|---|
| GitHub repository | `https://github.com/Spectating101/solarpunk-coin` |
| Portfolio directory | `/home/phyrexian/Downloads/llm_automation/project_portfolio` |
| Original primary checkout | `Solarpunk-bitcoin` under the portfolio directory |
| Repair checkout | `.worktrees/solarpunk-audit-repairs` under the portfolio directory |
| Repair branch | `fix/repository-audit-2026-10-05` |
| Audited baseline | `c194a4f05e2f84b971a8fdf756ae02856dc3b1d9` |
| Implementation commit | `41a241d9589b2f33a9a87e56aaf82be7984a48d8` |
| Commit title | `Repair repository audit findings across evidence, contracts, APIs and CI` |
| Repair evidence directory | `artifacts/repo-repairs/solarpunk-2026-10-05` under the portfolio directory |

The repair checkout was clean at the start of this documentation task. The implementation commit changes 69 files. This handoff is a subsequent documentation change; distinguish its commit from the implementation commit when comparing evidence. Repairs are local: no push, merge, package publication, contract deployment, or website deployment was performed.

The primary checkout and other worktrees were preserved. Their changes are not automatically consolidated into this branch. Inspect `git worktree list` and each checkout's status before any future consolidation; do not reset, delete, or overwrite another checkout to match this one.

Earlier portfolio artifacts are `docs/portfolio/solarpunk-repository-map.md`, its adjacent JSON, and `docs/portfolio/solarpunk-repository-audit-2026-10-05.md`. Original audit evidence is in `artifacts/repo-audits/solarpunk-2026-10-05`. These live outside this worktree. The temporary detached audit checkout and `/tmp/solarpunk-repair-session.json` are not required to resume and may disappear.

## User intent and project boundaries

The user asked to identify the local checkout matching GitHub, assess the whole repository, and fix the findings beyond just high-priority items. This session repaired all sixteen recorded findings plus related issues discovered during validation. The present follow-up requests a durable handoff/context document. There is no authorization to publish or deploy as part of this documentation task.

The current product is **Policy Lab**, a case-based constraint research workbench. Its frontend, deterministic constraint SDK, policies, schemas, portable receipts/capsules, and outside-data checkpoint form the current executable path. Historical SolarPunk/SPK contracts, derivatives pricing/API, operator backend, and thesis tooling were audited and repaired as reference systems; their inclusion does not make them the current product or a production financial service.

The controlled pack contains five cases and declares `empirical_claim=false`. `PUB-AUSGRID-001P` is a separate public-data checkpoint at actual L0 assurance. R4 remains `UNTESTED`. The phrase "four-case pack" in AGENTS.md is stale; the case pack, surface checker, and preflight confirm five. Receipts, hashes, signatures, and contracts do not certify physical truth, legal authority, reserves, adoption, or monetary performance. R1–R4 are research boundaries, distinct from runtime stages.

Do not reactivate archived scheduled writers, legacy deployment workflows, or old package publishers. If a future task changes the actual current surface, update `CURRENT_SURFACE.json` and its checker together. This handoff does not change that surface.

## What changed and where to inspect

| Area | Repair and executable entry points |
|---|---|
| Public source binding (F01) | `scripts/external_case_001p_ausgrid.mjs` and `scripts/lib/archive_csv_binding.mjs`: supplied CSV bytes must match the declared member of the pinned ZIP before parsing. |
| Decision invariants (F02) | `packages/constraint-core/src/`: gate summaries, minimum quantity ceilings, all tied binding constraints, and evaluation hashes must agree. |
| Receipt/capsule verification (F03) | Core capsule verification rebuilds receipt semantics from the decision even if an attacker refreshes file hashes; malformed collections fail cleanly. Capsule metadata uses the supplied receipt runtime. |
| Historical options (F04) | `contracts/SolarPunkOption.sol`: matched counterparties, exact one-use consent, funded pair collateral, bounded pair PnL, immutable series expiry price, and conserved withdrawals. Interaction scripts reject old deployments before transactions. |
| Frontend receipt context (F05) | `frontend/src/app/CaseWorkbenchProvider.jsx` and receipt UI: cache/select by case, policy, and scenario rather than decision ID alone. Browser regression visits L0 → L2 → original L0 and verifies downloaded exports. |
| Evidence consistency (F06–F07) | Core evidence/adapters: row totals/counts, physical surplus calculations, timestamps, quality scores, duplicate/overlapping meter windows, and pre-aggregation utility channels are validated. |
| Dependencies/install/CI (F08–F09) | Root/frontend manifests and lockfiles; `security/dependency-patches.json`; `scripts/apply_dependency_security_patches.cjs`; active Actions use Node 22 and lockfile installs. |
| Browser capture (F10) | `scripts/capture_case_workbench_v2.mjs` accepts the current map count; `scripts/check_receipt_context.mjs` checks real receipt/capsule downloads. |
| Derivatives API (F11) | `energy_derivatives/`: legacy/v1 routes share key validation and rate accounting, finite inputs and workload bounds; sync handlers avoid blocking the event loop. |
| SPK HTTP/health (F12–F13) | `spk_v1/`: bearer protection for POST/live RPC, export-root confinement, RPC allowlisting, injected health clock and dedicated backend CI. |
| Python packaging (F14) | `pyproject.toml` is authoritative; installable `spk-derivatives` 0.5.0 CLI supports offline pricing. |
| Thesis reproduction (F15) | `thesis:prepare` restores 16 figures from committed empirical inputs; verification runs before submission generation. |
| SDK package boundary (F16) | `scripts/check_sdk_package.mjs` packs and checks the SDK itself, including its 29 package files. |

Additional fixes bind `sourceHash` into EnergyRevenueFloor signed reports, reject PolicyRegistry version zero, keep archived unilateral trading as a read-only preview, and include advanced Python model assertions in CI. See the repair report and implementation diff for exact changes.

## Verification already completed

The implementation has **473 passing tests**: core 109, frontend 91, Node scripts 100, Solidity 122, derivatives/advanced models 27, and SPK backend 24. One live-RPC integration test was excluded. These counts belong to the recorded implementation validation, not a claim that every future checkout has been tested.

| Evidence files in the repair evidence directory | Recorded result |
|---|---|
| `core-final.log`, `frontend-final.log`, `node-final.log`, `contracts-final.log`, `derivatives-final.log`, `spk-final.log` | Six passing suites above |
| `root-clean-ci.log`, `frontend-clean-ci.log` | Fresh installs in a separate temporary directory pass |
| `build-final.log`, `bundle-final.log`, `preflight-final.log`, `sdk-final.log` | Production build, bundle boundary, preflight and SDK pack pass |
| `browser-flows.log`, `browser-flows/`, `browser-receipts.log`, `browser-receipts/` | 30 desktop/mobile screenshots and real exported receipt/capsule checks pass |
| `ausgrid-final.log`, `ausgrid-altered.log`, `ausgrid-assessments-final.log`, `ausgrid/genuine/` | Genuine input yields 33.066 kWh; altered CSV rejected; capsules and downstream assessments verify |
| `wheel-final.log`, `thesis-pass1.log` | Wheel install/version/help/pricing and 16 thesis figures/number checks pass |
| `python-quality-final.log`, `python-typecheck.log`, `slither-final.log` | Formatting/lint/API typing pass; no reported medium/high Slither findings across 42 contracts |
| `conformance-final.log`, `conformance-final.json` | Conformance check passes against the exact implementation commit |
| `repair-findings.json`, `worktree-status-final.json` | Machine-readable repair disposition and checkout snapshot |
| `frontend-audit-final.json`, `root-audit-pass2.json` | Frontend has zero advisories; root retains the version-level warnings described below |

Earlier failed-pass logs remain for transparency. Prefer the named final logs; `thesis-pass1.log` and `root-audit-pass2.json` are intentional exceptions. Evidence is outside Git and must be copied separately if moving the checkout. Temporary install-path files are historical diagnostics, not prerequisites.

Slither excludes low/informational/optimization categories under the existing policy and has one documented equality suppression for exact incoming collateral. It does not certify financial readiness. Hosted Actions have not run on this unpublished branch. No live contract redeployment, source-holder verification, or R4 monetary-performance research was performed.

## Remaining work and migration requirements

1. **Dependency advisory closure remains open.** Root `npm audit` reports 23 affected dependency nodes: 7 high and 16 low, from braces/elliptic advisory sources and their dependents. Reviewed backports mitigate the tested defects; registry version warnings are not cleared. Normal root `npm ci` applies four source-hash-checked file patches. Do not use `--ignore-scripts` as the normal install path. `security:dependency-patches` verifies all locked copies. Changed versions/source bytes require review; remove backports only after compatible upstream fixes or a separately tested Hardhat 3 migration.
2. **Review and hosted CI precede release.** Review the implementation commit, especially matched collateral behavior, signature changes, evidence invariants, and backports. A future authorized push/PR should run hosted checks. Local validation does not prove published Pages or deployed contracts contain these changes.
3. **Contracts require explicit migration if deployment is requested.** Existing deployments are unchanged. Options now open through exact counterparty approval followed by `openMatchedPosition`; `modifyPosition` cannot open/increase/reverse unilateral exposure. Pair losses are limited to posted collateral, and oracle/governance remain trusted. EnergyRevenueFloor signers must include `sourceHash` in the documented digest order. Follow the repair report's contract migration instructions rather than old scripts or addresses.
4. **HTTP callers must adopt the repaired access rules.** Configure `SPK_V1_API_TOKEN` for POST/live calls and send a bearer token; set `SPK_V1_API_EXPORT_ROOT` and `SPK_V1_API_RPC_ALLOWLIST` as needed. Cached read-only endpoints remain available. Derivatives retain anonymous/demo/paid tiers via `SPK_API_KEYS`; they are not globally authentication-only. Their rate counters are in memory per process and reset on restart; multiple workers require a shared limiter for a deployment-wide quota.
5. **Research boundaries remain unchanged.** Public-data reproduction is not owner/operator validation. Source-holder verification and R4 require separate evidence and work; a code repair cannot close them.

## Resume and reproduce

Local instructions import `/home/phyrexian/.codex/RTK.md` and `/home/phyrexian/.codex/TURBO.md`. Prefix shell invocations with `rtk`; consult the referenced Turbo workflow when planning substantial new work. Use Node **>=22.12 and <23** (this session used 22.21.1) and Python >=3.11. Run from the repair checkout, not the portfolio root or another worktree.

The first command checks branch/status and current surface without installing or deploying:

```bash
rtk proxy bash -c '
  cd /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/solarpunk-audit-repairs || exit
  export PATH=/home/phyrexian/.nvm/versions/node/v22.21.1/bin:$PATH
  git status --short --branch && git log -2 --oneline &&
  npm run policy-lab:surface && npm run policy-lab:preflight
'
```

When reproducing JS validation, run the following from the repair root with that Node version. Installs mutate dependencies locally; normal postinstall is required for the security backports.

```bash
rtk proxy npm ci
rtk proxy npm --prefix frontend ci
rtk proxy npm run security:dependency-patches
rtk proxy npm run policy-lab:test-core
rtk proxy npm --prefix frontend run test:run
rtk proxy npm test
rtk proxy bash -c 'node --test test-node/*.test.js'
rtk proxy npm run policy-lab:build
rtk proxy node scripts/check_frontend_bundle.mjs frontend/dist
rtk proxy node scripts/check_sdk_package.mjs
```

For Python, use an isolated venv with root extras `.[api,viz,dev]` and `./spk_v1[dev]`. Run the suites in separate invocations to avoid same-named test module collisions:

```bash
rtk proxy bash -c 'PYTHONPATH=energy_derivatives python3 -m pytest energy_derivatives/tests energy_derivatives/test_advanced_models.py -o addopts=""'
rtk proxy bash -c 'cd spk_v1 && PYTHONPATH=src python3 -m pytest tests -m "not integration"'
rtk proxy npm run thesis:verify
```

Activate the venv/use its interpreter for those commands. Thesis verification regenerates ignored figures and may rewrite generated manifest timestamps; inspect the resulting diff before committing. For browser verification, start the built frontend preview, set `CASE_WORKBENCH_URL`, and run the two browser scripts listed above; retain downloads and close the preview afterward. For authentic outside-data reproduction, use the pinned ZIP/member and arguments in the external-case workflow; a caller-supplied CSV alone is insufficient. No repair preview/server was left running at the end of the implementation task.

Suggested continuation prompt:

> Continue from the local repair worktree `.worktrees/solarpunk-audit-repairs`, branch `fix/repository-audit-2026-10-05`. Read CURRENT_SURFACE.json, AGENTS.md, docs/ops/AUDIT_REPAIR_HANDOFF_2026-10-05.md and its linked repair report; inspect Git status and run surface/preflight. Implementation is commit 41a241d9589b2f33a9a87e56aaf82be7984a48d8. Use the retained portfolio evidence rather than assuming historical handoffs or other checkouts contain the fixes. Preserve other worktrees. Identify the next requested maintenance task; publishing/deployment is a separate action.

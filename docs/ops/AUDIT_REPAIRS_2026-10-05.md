# Repository audit repairs — 2026-10-05

Changes are on `fix/repository-audit-2026-10-05`, based on `c194a4f05e2f84b971a8fdf756ae02856dc3b1d9`, in `.worktrees/solarpunk-audit-repairs`. Existing worktrees were preserved. This is a source repair and local verification, with no push or deployment.

Policy Lab remains the current product. The controlled case pack stays at five cases with `empirical_claim=false`; the external Ausgrid case stays L0 and R4 remains untested. Historical SPK, derivatives, contracts and thesis materials remain reference systems.

## Finding coverage

| Finding | Status | Repair |
|---|---|---|
| F01 — Verified ZIP/CSV binding | Fixed | The supplied CSV must byte-match the exact declared member of the pinned archive before parsing. Genuine source produces 33.066 kWh; altered CSV fails before evidence output. |
| F02 — Decision and claim invariants | Fixed | Admission summaries must agree with gate evaluations; admitted quantity equals the minimum applicable ceiling; every tied binding ceiling is recorded; calculator evaluation hashes are checked before decision or claim acceptance. |
| F03 — Receipt/capsule consistency | Fixed | Receipt rule statuses, blocking rules and binding constraints are rebuilt from the decision and compared even after all file hashes are refreshed. Malformed collections return verification failure. Capsule runtime metadata follows the supplied receipt. |
| F04 — Funded option clearing | Fixed in source; deployment required | Opening requires exact, one-use consent from a distinct counterparty and deposits for both sides. PnL transfers only within that pair, capped by the losing margin. Unrelated deposit withdrawals remain funded. A series-specific expiry index is frozen once. |
| F05 — Scenario-specific receipt selection | Fixed | Receipts are cached by the full case/policy/scenario key. Durable receipt routes select that context even when L0 and L2 share a decision ID; JSON and capsule exports use the selected run. |
| F06 — Evidence summary consistency | Fixed | Interval count and total eligible surplus must match supplied rows. Known adapters rederive surplus from energy readings. Invalid timestamps, non-finite/negative quantities and invalid quality scores fail validation. |
| F07 — Duplicate and overlapping measurements | Fixed | Overlapping and duplicate windows block evidence for the same meter/site. Utility channel windows are checked before daily aggregation, with opposing import/export channels and separate meters kept independent. |
| F08 — Dependencies and development exposure | Mitigated; upstream version warnings remain | Updated direct and transitive dependencies; frontend audit reports zero advisories; Vite binds to loopback. Two development libraries without compatible published fixes receive reviewed, source-hash-checked backports with regression tests. |
| F09 — Reproducible installs | Fixed | Root lockfile is tracked; the frontend lockfile contains complete local SDK metadata; root/frontend npm ci pass in a new temporary directory. CI uses lockfile installs and Node 22. |
| F10 — Mobile browser capture | Fixed | The map locator accepts the current mapped-case count. The unmodified capture command completes all 30 desktop/mobile screenshots. Added a separate receipt navigation/download browser check. |
| F11 — Historical derivatives API | Fixed | Legacy routes share API-key validation and rate accounting with v1. Accounting is protected by a lock; sync FastAPI handlers move CPU and blocking work off the event loop. Pricing/Greeks cap N at 1000; batches cap total N² at two million. Non-finite inputs are rejected. |
| F12 — Operator HTTP access | Fixed | POST and live RPC requests require a bearer token; mutations are disabled without configuration. Lake exports are constrained to the configured root, including symlink resolution. Caller-supplied RPC destinations require an allowlist entry. |
| F13 — Time-stable health tests and CI | Fixed | Health accepts an injected clock; tests freeze their reference time. Missing, future and stale sync timestamps are unhealthy. The SPK backend now has its own CI job, excluding live-RPC integration checks. |
| F14 — Python installation and CLI | Fixed | A real offline pricing CLI is installed by the console entry point. pyproject is the single metadata source, version 0.5.0, Python 3.11+. A wheel installs in a new venv and runs version/help/pricing commands. |
| F15 — Thesis asset preparation | Fixed | thesis:verify restores all 16 generated figures from committed empirical inputs before checking numbers and references. thesis:submit verifies before generating documents; an asset reproduction CI job was added. |
| F16 — Correct SDK package check | Fixed | The pack check executes in packages/constraint-core and asserts the SDK package name, entry point and file boundaries. It verifies 29 SDK files rather than the repository root. |

## Additional repairs

- EnergyRevenueFloor reporter signatures now bind `sourceHash`. Substitution fails and the nonce is unchanged after a rejected submission.
- PolicyRegistry rejects version zero, which is reserved for a missing policy; published policies remain readable and deactivatable.
- Research capsules use their actual receipt runtime throughout manifest, reproduction, PROV and RO-Crate metadata, including external imports without a Vite revision variable.
- Historical interaction scripts require distinct signers and refuse old option deployments before sending transactions. Their option opening uses matched consent. The archived unilateral trading screen remains a read-only preview.
- Advanced Python model checks are included in CI and return normally after their assertions.

## Validation

The retained logs and artifacts are in `artifacts/repo-repairs/solarpunk-2026-10-05` at the portfolio root, outside this Git worktree.

| Check | Result | Evidence file |
|---|---|---|
| Deterministic SDK/core | 109 tests pass | `core-final.log` |
| Frontend | 91 tests pass | `frontend-final.log` |
| Node scripts and security regressions | 100 tests pass | `node-final.log` |
| Solidity | 122 tests pass | `contracts-final.log` |
| Derivatives and advanced models | 27 tests pass | `derivatives-final.log` |
| SPK backend | 24 pass; one live integration test excluded | `spk-final.log` |
| Fresh root + frontend installs | Both npm ci pass | `root-clean-ci.log`, `frontend-clean-ci.log` |
| Production frontend and bundle boundary | Pass | `build-final.log`, `bundle-final.log` |
| Browser flows | 30 screenshots; mobile map and navigation pass | `browser-flows.log`, `browser-flows/` |
| Receipt routes and actual downloads | L0 → L2 → original L0 passes | `browser-receipts.log`, `browser-receipts/` |
| Public source binding | Genuine source accepted; modified CSV rejected | `ausgrid-final.log`, `ausgrid-altered.log` |
| Derived public assessments | Both assessment verifiers pass | `ausgrid-assessments-final.log` |
| Python wheel and console entry point | Install, version, help, pricing pass | `wheel-final.log` |
| Thesis figures and number verifier | 16 regenerated assets; PASS | `thesis-pass1.log` |
| Python formatting/lint/types | Black, isort, flake8 and API mypy pass | `python-quality-final.log`, `python-typecheck.log` |
| Slither medium/high checks | No reported results across 42 contracts | `slither-final.log` |
| SDK pack identity | @solarpunk/constraint-core; 29 files | `sdk-final.log` |

The suites above total 473 passing tests. Browser capture and installation checks are additional. GitHub Actions configuration was reviewed locally; hosted Actions have not run on this unpublished branch.

The Slither strict-equality detector is suppressed on one documented line: checking the exact incoming collateral amount is intentional and prevents liabilities exceeding deposits for transfer-fee tokens. Detector categories below medium remain excluded as in the existing CI policy. Static analysis does not certify financial production readiness.

## Dependency backports and remaining warnings

The frontend lock resolves Vite 8.3.2, Vitest 5.0.3, ethers 6.17.0 and patched lodash, and its npm audit reports zero vulnerabilities. Node 22.12+ is required by the updated toolchain ([Vitest migration guide](https://vitest.dev/guide/migration/)); CI uses Node 22.

The historical Hardhat 2 toolchain retains two advisory sources with no compatible published fix: [braces nesting exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [elliptic signing risk](https://github.com/advisories/GHSA-848j-6mx2-7j84). Root npm audit continues to report 23 affected dependency nodes (7 high, 16 low), including transitive dependents. These version-level reports have not been hidden or relabeled as a clean audit.

`security/dependency-patches.json` records exact original and patched SHA-256 digests and replacements. The normal root postinstall applies four file backports for the locked versions: braces compile/expand walkers from [upstream PR 75](https://github.com/micromatch/braces/pull/75), an additional stringify depth guard, and elliptic nonce-byte handling from [upstream PR 345](https://github.com/indutny/elliptic/pull/345). Tests exercise excessive nesting, ordinary expansion and P-521 nonces containing leading zeros. All locked copies must match; changed or unknown source bytes fail installation for review. Installs using `--ignore-scripts` omit these backports; `npm run security:dependency-patches` detects that condition.

A future Hardhat 3 migration or compatible upstream release can remove this maintenance obligation. The compatible toolchain is locally mitigated, while registry advisory closure remains outstanding.

## Contract and API migration

`modifyPosition` no longer opens or increases unilateral exposure. For a fresh option deployment:

1. Fund and approve collateral allowances for both parties.
2. The counterparty calls `approveMatchedPosition(seriesId, opener, oppositeQuantity, counterpartyMargin, openerMargin, deadline, true)` for exact terms.
3. The opener calls `openMatchedPosition(seriesId, counterparty, quantity, openerMargin, counterpartyMargin, deadline)` before the deadline.
4. At expiry, an authorized oracle calls `setSettlementIndex` once for that series. Both counterparties settle against that immutable price.

Existing paired positions can add margin and reduce quantity. Price-gap PnL has limited recourse to posted pair collateral. Oracle prices and governance remain trusted inputs; this is a historical research implementation. Source repairs do not modify existing deployed contracts, and no new contracts were deployed in this task.

EnergyRevenueFloor signed-report digests now pack `chainId, contractAddress, policyId, realizedKwh, measuredAt, sourceHash, reporterNonce` with the existing integer widths. Signers for a new deployment must use this order; old signatures are incompatible.

For the SPK HTTP service, configure `SPK_V1_API_TOKEN`, send `Authorization: Bearer <token>` for POST/live requests, and set `SPK_V1_API_EXPORT_ROOT` / `SPK_V1_API_RPC_ALLOWLIST` as needed. Read-only cached endpoints stay available. The local CLI continues to use local operator filesystem access.

Derivatives route families share the existing anonymous/demo/paid-key policy. Configure `SPK_API_KEYS` for paid access. Rate limits remain per process; deployments using multiple worker processes need a shared rate limiter for a deployment-wide quota. A process restart resets in-memory counters.

## Reproduce

Use Node 22.12+ and Python 3.11+. Install the root and frontend with npm ci, then run the existing core, frontend, contract and Node test commands. Python derivative and SPK suites should run separately in their own package contexts to avoid same-named test module collisions.

- `npm run policy-lab:test-core`
- `npm --prefix frontend run test:run`
- `npm test`
- `node --test test-node/*.test.js`
- `PYTHONPATH=energy_derivatives python3 -m pytest energy_derivatives/tests energy_derivatives/test_advanced_models.py -o addopts=""`
- In `spk_v1`: `PYTHONPATH=src python3 -m pytest tests -m "not integration"`
- `npm run policy-lab:build` and `node scripts/check_frontend_bundle.mjs frontend/dist`
- `node scripts/check_sdk_package.mjs`
- `npm run thesis:verify`

After starting the built frontend preview, set `CASE_WORKBENCH_URL` for `scripts/capture_case_workbench_v2.mjs` and `scripts/check_receipt_context.mjs`. The latter downloads and verifies the requested L0 capsule after visiting L2 with the same decision ID.

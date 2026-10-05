# Backend follow-up and integration handoff — 2026-10-05

The user assigned Codex the backend while Claude handles visual work. Changes are isolated in the portfolio worktree `.worktrees/solarpunk-backend-repairs`, branch `fix/backend-followup-2026-10-05`, based on handoff commit `998b9f3` and the earlier implementation commit `41a241d`. No frontend files, contracts, dependencies, lockfiles or workflows were changed in this follow-up. Nothing was pushed or deployed.

Read [the original repair handoff](AUDIT_REPAIR_HANDOFF_2026-10-05.md) and [CURRENT_SURFACE.json](../../CURRENT_SURFACE.json) for the earlier audit and project boundaries. This dated record describes subsequent backend changes; it does not supersede executable state. Policy Lab remains current; these Python SPK/derivatives services remain historical/reference systems.

## Repairs

| Finding | Result |
|---|---|
| Cached health bypassed freshness checks | Offline operator health rebuilds readiness against the current runtime and current clock. Cached gas observations retain their original timestamp; malformed, missing or stale balance observations in an existing cache are unhealthy. |
| Service health reported success after operator failure | `/health` returns `ok=false` on missing runtime or RPC connection failure. A missing `ok` value no longer implies success. |
| Export filenames could follow symlinks outside the allowed root | Lake runtime, ledger, manifest and operations outputs use atomic replacement of their directory entries. Existing leaf symlink targets remain unchanged. HTTP directory traversal/symlink restrictions remain enforced. Malformed paths return 422. |
| Readers could observe partially written JSON | Runtime, health and lake files are generated into temporary files and replaced after flush/fsync. Interrupted generation leaves the previous individual file intact and cleans the temporary file. Existing regular-file permissions are retained; newly generated files use private temporary-file permissions. |
| Default sync RPC disagreed with API allowlist configuration | Runtime sync now honors explicit RPC, then `SEPOLIA_RPC`, then `SEPOLIA_RPC_URL`, then the existing default. |
| Put risk report used call sensitivities | Risk-assessment Greeks now price the same put hedge used in the premium calculation. The regression checks all Greeks and the negative put delta. |
| Invalid physical inputs/non-finite results reached processing or serialization | Floor fractions and wind/hydro dimensions are bounded; pricing, Greeks, risk reports and calibration responses reject non-finite results before JSON serialization. Unknown configured API tiers receive demo permissions. |
| Quotas were independent across worker processes | Optional SQLite storage atomically shares rolling minute/day quotas across workers and preserves counters across worker restarts. Store errors return 503 without falling back to independent counters; usage reads the same store. |
| Weather claim value was mislabeled as a market price per MWh | Risk-assessment, decision-pack and operator-workbench now use explicit `spot_price_per_mwh` and `capacity_factor` inputs. Defaults and operator-supplied inputs are labeled separately; weather volatility is identified as a generation proxy. |

Initial regression runs reproduced seven SPK and eleven derivatives failures before the corresponding repairs. Additional regressions cover corrupt/stale caches, output interruption, concurrent readers, malformed paths, RPC precedence, shared process quotas, and revenue units. The existing operator-workbench test now uses fixed calibration inputs instead of making an external data request.

## Caller and deployment configuration

For shared quotas, set **`SPK_RATE_LIMIT_DB`** to the same absolute path on a persistent local filesystem for every API worker. The service needs write access to the parent directory. API keys are represented by hashes in storage. Without this setting, the original per-process in-memory mode remains available and counters reset on restart. SQLite mode is for one host; multiple hosts need a separate shared quota service. No live deployment configuration was changed.

Risk/decision requests accept:

```json
{
  "capacity_mw": 10,
  "lat": 25,
  "lon": 121,
  "spot_price_per_mwh": 80,
  "capacity_factor": 0.3
}
```

Price must be positive; capacity factor must be greater than zero and at most one. Omitted inputs use explicitly modeled defaults of $50/MWh and 0.20. Responses include `model_assumptions` with each input's basis. Older callers remain syntactically compatible, but revenue/hedge numbers change because the previous calculation used incompatible units. These defaults are assumptions, not current market quotes or owner/operator evidence. Weather volatility remains a proxy rather than observed market volatility.

Atomic publication is per file, not a transaction across the whole runtime mirror/export. It protects existing leaf symlink targets and complete-file visibility; directory traversal remains checked by the HTTP API. This work does not claim protection against a hostile local process concurrently changing directory ancestry.

## Validation

**95 Python backend tests pass:** derivatives/advanced models 54 and SPK 41; the live-RPC integration test is excluded. Shared-quota tests use four independent processes and a second worker pool to confirm persistence. Both surface and preflight pass. The original 473-test record remains historical evidence for `41a241d`; frontend/Node/Solidity suites were not rerun for this Python-only follow-up.

Additional checks pass: existing API mypy gate; strict typing on the new SQLite/storage modules with imported implementation modules skipped; formatting/import order on the new modules and touched SPK files; new-module lint; Python compilation and Git whitespace checks. A trial strict check following the entire SPK import graph found four existing annotation errors in ABI/chain/runtime code; that graph is not claimed to pass strict typing. Local Requests dependency and WebSockets deprecation warnings remain unrelated environment warnings.

Evidence is outside this worktree at the portfolio path `artifacts/repo-repairs/solarpunk-backend-2026-10-05/`: `derivatives-final.log`, `spk-final.log`, `surface-final.log`, `preflight-final.log`, and `backend-findings.json`. Copy evidence separately when moving the Git branch.

Reproduce from this backend checkout with Python >=3.11 and the existing API/dev dependencies:

```bash
rtk proxy bash -c 'PYTHONPATH=energy_derivatives python3 -m pytest energy_derivatives/tests energy_derivatives/test_advanced_models.py -q -o addopts=""'
rtk proxy bash -c 'cd spk_v1 && PYTHONPATH=src python3 -m pytest tests -m "not integration" -q -o addopts=""'
rtk proxy bash -c 'export PATH=/home/phyrexian/.nvm/versions/node/v22.21.1/bin:$PATH; npm run policy-lab:surface && npm run policy-lab:preflight'
```

## Integration with Claude's visual work

This backend branch starts at the shared handoff commit and can be cherry-picked onto the visual branch after checking its working tree. Review `git diff 998b9f3..fix/backend-followup-2026-10-05` and the request/configuration changes above. It touches Python backend code, tests, their READMEs and this report; visual files stay on Claude's branch. Rerun the backend suites and surface/preflight on the combined branch before treating it as ready for release. No automatic merge into another checkout was performed.

Remaining from the original audit: root dependency advisory closure/backport maintenance, hosted CI, any requested contract migration/deployment, source-holder verification and R4 research. This follow-up adds single-host shared quotas when configured; it does not establish distributed quotas or financial production readiness.

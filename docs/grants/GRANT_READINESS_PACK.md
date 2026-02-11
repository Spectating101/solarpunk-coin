# Grant Readiness Pack

- generated_at: `2026-02-11T16:00:21.041673+00:00`
- readiness_grade: `D`
- overall_status: `degraded`
- warnings: `2`

## Verification Snapshot

- python_dependencies: `ok`
- pricing_engine: `ok`
- contracts: `degraded`
- frontend: `degraded`

## Artifact Integrity

- missing_artifacts: `0`

## Empirical Inventory

- empirical_csv_files: `22`
- empirical_png_files: `9`

## Priority Actions

- Run `bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json` before submissions.
- Keep `GRANT_PROPOSAL.md` and `docs/GRANT_BRIEF_POLYGON.md` synchronized with latest verification results.
- Attach the generated `docs/grants/GRANT_READINESS_PACK.md` as technical appendix in grant forms.

## Submission Guidance

- Use this file + `GRANT_PROPOSAL.md` + `docs/GRANT_BRIEF_POLYGON.md` as canonical package.
- Re-run the builder before every submission so timestamps and verification state are current.

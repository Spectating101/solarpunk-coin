# Project Readiness Pack

- generated_at: `2026-04-14T12:41:25.508202+00:00`
- project: `Solarpunk-bitcoin`
- readiness_grade: `D`
- verification_status: `None`
- verification_warnings: `None`

## Core Checks

- pricing_engine_ok: `False`
- contracts_ok: `False`
- frontend_ok: `False`
- api_service_present: `True`
- empirical_data_present: `True`
- deployment_docs_present: `True`

## Inventory Snapshot

- contracts_solidity_files: `4`
- contract_test_files: `3`
- script_files: `39`
- frontend_source_files: `8`
- empirical_csv_files: `29`
- empirical_png_files: `9`
- grant_docs_files: `1`

## Required Docs

- missing_required_docs_count: `0`

## Project Modes

- mode_1_research: Empirical and economic validation using datasets and analytics.
- mode_2_protocol: Smart contracts + oracle + frontend verification and deployment.
- mode_3_funding: Grant and submission package generation with reproducible verification.
- mode_4_commercial: Client pilot term-sheet generation and integrity-backed delivery cycle.

## Independent Lanes

- research_lane_ready: `True`
- protocol_lane_ready: `False`
- operations_lane_ready: `True`
- handoff_lane_ready: `True`
- commercial_lane_ready: `True`
- monetary_system_lane_ready: `True`
- phase_gate_lane_ready: `True`
- governance_lane_ready: `True`
- evidence_validation_lane_ready: `True`
- onchain_confirmation_lane_ready: `True`

## Execution Profiles

- profile_1_research_service: Deliver empirical risk reports and pricing analyses.
- profile_2_protocol_demo: Run contract + frontend demos with reproducible verification.
- profile_3_funding_submission: Generate grant/sponsor packs from current project state.
- profile_4_commercial_pilot: Generate client-facing indicative term sheets and integrity artifacts.
- profile_5_monetary_protocol: Track and validate standalone monetary-protocol readiness.
- profile_6_phase_gate_enforcement: Enforce explicit GO/NO_GO protocol progression gates.
- profile_6b_governance_hardening: Track governance controls and change-trace cadence artifacts.
- profile_7_evidence_validation: Validate deployment and audit evidence before expansion claims.
- profile_8_onchain_confirmation: Confirm deployment tx receipts on-chain and synchronize evidence artifacts.

## Operator Commands

- `bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json`
- `python3 scripts/build_grant_readiness_pack.py`
- `python3 scripts/build_project_readiness_pack.py`
- `python3 scripts/build_project_dashboard.py`
- `python3 scripts/build_monetary_system_readiness.py`
- `python3 scripts/ingest_meter_attestations.py --input data/attestations/sample_meter_attestations.json`
- `python3 scripts/build_deployment_receipt.py`
- `python3 scripts/confirm_deployment_onchain.py`
- `python3 scripts/validate_deployment_receipt.py`
- `python3 scripts/record_audit_update.py --status IN_PROGRESS`
- `python3 scripts/render_security_audit_status.py`
- `python3 scripts/validate_audit_status.py`
- `python3 scripts/build_protocol_phase_gates.py --target-phase 1`
- `python3 scripts/build_governance_status.py`
- `bash scripts/run_project_operating_cycle.sh`
- `bash scripts/run_commercial_cycle.sh`
- `bash scripts/run_protocol_gate.sh 1`

## Next Actions

- Keep `artifacts/verify_health.json` fresh before any external submission or demo.
- Use `scripts/run_project_operating_cycle.sh` as the canonical pre-release routine.
- Treat `docs/project/PROJECT_READINESS_PACK.md` as the one-page system status for collaborators.


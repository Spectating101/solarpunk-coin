# SolarPunk Project Operations

Last updated: 2026-02-11 (UTC)

## Purpose
This document defines Solarpunk as an independent operating project, not only a grant package.

## Independent Deliverables
1. Research Deliverable:
- Empirical datasets + model outputs for energy risk and derivatives pricing.

2. Protocol Deliverable:
- Verifiable contract + frontend stack that can be demoed or piloted.

3. Operations Deliverable:
- One-command health cycle and dashboard for external handoff.

## Operating Modes
1. Research Mode:
- Use empirical datasets and simulation scripts to validate pricing logic and economics.
- Primary folders: `empirical/`, `energy_derivatives/`.

2. Protocol Mode:
- Validate contracts, pricing engine, and frontend as one integrated stack.
- Primary command:
  - `bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json`

3. Funding Mode:
- Generate submission-ready package from current technical state.
- Primary commands:
  - `python3 scripts/build_grant_readiness_pack.py`
  - `python3 scripts/build_project_readiness_pack.py`

4. Commercial Mode:
- Build indicative pilot term sheets and project proof artifacts for client-facing work.
- Primary commands:
  - `python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json`
  - `bash scripts/run_commercial_cycle.sh`

5. Monetary-System Mode:
- Evaluate whether Solarpunk stands on its own as an energy-native monetary protocol.
- Primary commands:
  - `python3 scripts/build_monetary_system_readiness.py`
  - `bash scripts/run_project_operating_cycle.sh`

6. Phase-Gate Mode:
- Enforce protocol progression with explicit GO/NO_GO target phases.
- Primary commands:
  - `python3 scripts/build_protocol_phase_gates.py --target-phase 1`
  - `bash scripts/run_protocol_gate.sh 1`

7. Evidence-Validation Mode:
- Validate deployment and audit evidence before any expansion/mainnet claims.
- Primary commands:
  - `python3 scripts/build_deployment_receipt.py`
  - `python3 scripts/confirm_deployment_onchain.py`
  - `python3 scripts/validate_deployment_receipt.py`
  - `python3 scripts/record_audit_update.py --status IN_PROGRESS`
  - `python3 scripts/render_security_audit_status.py`
  - `python3 scripts/validate_audit_status.py`
- Policy references:
  - `docs/project/DEPLOYMENT_EVIDENCE_POLICY.md`
  - `docs/project/SECURITY_AUDIT_STATUS.json`
  - `docs/project/PHASE3_UNLOCK_RUNBOOK.md`

## Canonical Operating Cycle
Run this before demos, submissions, and handoffs:
```bash
bash scripts/run_project_operating_cycle.sh
```

Expected outputs:
- `artifacts/verify_health.json`
- `docs/grants/GRANT_READINESS_PACK.md`
- `docs/project/PROJECT_READINESS_PACK.md`
- `docs/project/PROJECT_DASHBOARD.html`
- `docs/project/MONETARY_SYSTEM_READINESS.md`
- `docs/project/PROTOCOL_PHASE_GATES.md`
- `docs/project/METER_ATTESTATION_BUNDLE.md`
- `docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md`
- `docs/project/SECURITY_AUDIT_VALIDATION.md`
- `docs/project/ONCHAIN_CONFIRMATION_REPORT.md`

## Decision Rule
- If verification status is not `ok`, do not submit to grants or partners.
- If project readiness grade is below `B`, prioritize technical stabilization before outreach.

## Operating Contract
1. No manual claims without a fresh `verify_health.json`.
2. Any partner handoff includes the dashboard and project readiness pack.
3. Treat funding as one lane, not the project itself.
4. Commercial pilot outputs must include both term sheet and technical integrity artifacts.
5. Monetary-system claims require an updated `MONETARY_SYSTEM_READINESS.md`.
6. Any phase advancement claim requires a passing strict gate run for that target phase.
7. Phase-3 expansion claims require passing deployment and audit validation artifacts.

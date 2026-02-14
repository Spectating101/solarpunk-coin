# Solarpunk Commercial Operating Model

## Purpose
This mode turns Solarpunk into a service product for renewable operators who need revenue-risk control.

## Service Product
1. Risk Desk Intake:
- Client profile (generation, horizon, strike, risk budget).

2. Indicative Term Sheet:
- Build non-binding hedge terms from current model and stress table.
- Command:
  - `python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json`

3. Operator Decision Pack (weekly control layer):
- Convert pricing output into GO/NO_GO, risk band, and prioritized action queue.
- Command:
  - `python3 scripts/build_operator_decision_pack.py --client-profile clients/sample_solar_operator.json`

4. Operator Workbench (meeting-ready surface):
- Convert terms + risk output into one decision artifact with assignments and dashboard.
- Command:
  - `python3 scripts/build_operator_workbench.py --client-profile clients/sample_solar_operator.json`

5. Project Integrity Proof:
- Run full stack verification and project dashboard.
- Command:
  - `bash scripts/run_project_operating_cycle.sh`

6. Commercial Bundle:
- Run full business cycle in one command.
- Command:
  - `bash scripts/run_commercial_cycle.sh`

## Deliverables Per Pilot
- `docs/commercial/PILOT_TERMSHEET_<client>.md`
- `docs/commercial/PILOT_TERMSHEET_<client>.json`
- `docs/commercial/DECISION_PACK_<client>.md`
- `docs/commercial/DECISION_PACK_<client>.json`
- `docs/commercial/OPERATOR_WORKBENCH_<client>.md`
- `docs/commercial/OPERATOR_WORKBENCH_<client>.json`
- `docs/commercial/OPERATOR_WORKBENCH_<client>.html`
- `docs/project/PROJECT_DASHBOARD.html`
- `artifacts/verify_health.json`

## Commercial Rules
1. Do not quote terms without a fresh verification run.
2. Treat pilot term sheets as indicative, not final contracts.
3. Recompute terms if volatility or spot index shifts materially.
4. Keep funding lane and commercial lane separate: grants are support, pilots are revenue.
5. Weekly decision pack is mandatory before hedge-size changes or new quote approvals.
6. Operator Workbench HTML is the canonical artifact for non-technical decision meetings.

## Reference
- `docs/commercial/TERMINAL_PRODUCTIZATION_PLAN.md`

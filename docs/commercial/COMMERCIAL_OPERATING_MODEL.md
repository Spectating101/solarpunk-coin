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

3. Project Integrity Proof:
- Run full stack verification and project dashboard.
- Command:
  - `bash scripts/run_project_operating_cycle.sh`

4. Commercial Bundle:
- Run full business cycle in one command.
- Command:
  - `bash scripts/run_commercial_cycle.sh`

## Deliverables Per Pilot
- `docs/commercial/PILOT_TERMSHEET_<client>.md`
- `docs/commercial/PILOT_TERMSHEET_<client>.json`
- `docs/project/PROJECT_DASHBOARD.html`
- `artifacts/verify_health.json`

## Commercial Rules
1. Do not quote terms without a fresh verification run.
2. Treat pilot term sheets as indicative, not final contracts.
3. Recompute terms if volatility or spot index shifts materially.
4. Keep funding lane and commercial lane separate: grants are support, pilots are revenue.

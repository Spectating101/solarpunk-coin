# SolarPunk Terminal Productization Plan

## Goal
Turn SolarPunk from a pricing tool into an operational system that must be run before hedge decisions.

## Must-Have Definition
SolarPunk is "must-have" only if the operator cannot approve hedge changes without a fresh decision pack.

## Product Shape
1. Weekly Decision Pack:
- GO/NO_GO
- operating score
- risk band
- prioritized action queue

2. Hedge Desk Artifacts:
- indicative term sheet
- scenario deltas (downside/base/upside)
- margin and budget fit

3. Auditability:
- reproducible run outputs
- explicit review cadence (`next_review_due_at`)

## Current Commands
1. Build term sheet:
```bash
python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json
```

2. Build operator decision pack:
```bash
python3 scripts/build_operator_decision_pack.py --client-profile clients/sample_solar_operator.json
```

3. Build operator workbench:
```bash
python3 scripts/build_operator_workbench.py --client-profile clients/sample_solar_operator.json
```

4. Run full commercial cycle:
```bash
bash scripts/run_commercial_cycle.sh
```

## API Surface (Product Layer)
1. `/v1/risk-assessment`: pricing + calibration report
2. `/v1/decision-pack`: operational decision output (GO/NO_GO + actions)
3. `OPERATOR_WORKBENCH_<client>.html`: meeting-ready execution dashboard

## Adoption Sequence
1. Pilot mode:
- one operator
- weekly decision-pack cadence
- KPI: on-time review completion

2. Desk mode:
- multiple operators
- board-style weekly summary
- KPI: quote cycle time reduction

3. Platform mode:
- role-based users
- alerts and subscriptions
- KPI: retention and renewal

## Non-Negotiable Rule
No new hedge quote is approved without a fresh decision pack in the current review window.

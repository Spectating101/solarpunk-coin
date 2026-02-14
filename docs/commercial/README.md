# Commercial Outputs

This folder stores client-facing pilot artifacts generated from the Solarpunk commercial mode.

## Canonical Commands
1. Build one indicative term sheet:
- `python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json`

2. Build full commercial package:
- `bash scripts/run_commercial_cycle.sh`

3. Build operator workbench directly:
- `python3 scripts/build_operator_workbench.py --client-profile clients/sample_solar_operator.json`

## Artifacts
- `PILOT_TERMSHEET_<client>.md`: human-readable pilot terms and risk notes.
- `PILOT_TERMSHEET_<client>.json`: machine-readable artifact for downstream workflows.
- `DECISION_PACK_<client>.md/.json`: weekly GO/NO_GO with prioritized actions.
- `OPERATOR_WORKBENCH_<client>.md/.json/.html`: single-source operator desk artifact with assignments.

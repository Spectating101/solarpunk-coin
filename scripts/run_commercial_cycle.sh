#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[commercial] 1/4 build project status"
bash scripts/run_project_operating_cycle.sh

echo "[commercial] 2/4 build pilot term sheet"
python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json

echo "[commercial] 3/4 build operator decision pack"
python3 scripts/build_operator_decision_pack.py --client-profile clients/sample_solar_operator.json

echo "[commercial] 4/4 build operator workbench"
python3 scripts/build_operator_workbench.py --client-profile clients/sample_solar_operator.json

echo
echo "[commercial] complete"
echo "- docs/project/PROJECT_DASHBOARD.html"
echo "- docs/commercial/PILOT_TERMSHEET_taoyuan-pilot-solar-co.md"
echo "- docs/commercial/DECISION_PACK_taoyuan-pilot-solar-co.md"
echo "- docs/commercial/OPERATOR_WORKBENCH_taoyuan-pilot-solar-co.html"

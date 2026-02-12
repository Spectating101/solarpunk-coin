#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[commercial] 1/2 build project status"
bash scripts/run_project_operating_cycle.sh

echo "[commercial] 2/2 build pilot term sheet"
python3 scripts/build_pilot_termsheet.py --client-profile clients/sample_solar_operator.json

echo
echo "[commercial] complete"
echo "- docs/project/PROJECT_DASHBOARD.html"
echo "- docs/commercial/PILOT_TERMSHEET_taoyuan-pilot-solar-co.md"

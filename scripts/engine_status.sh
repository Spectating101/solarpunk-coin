#!/usr/bin/env bash
# One-screen SPK v1 engine status (read path + health + validate + peg sim).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== SPK v1 engine status ==="
echo ""

echo "-- health --"
node scripts/foundation_health.js
echo ""

echo "-- validate --"
SPK_V1_REPO_ROOT="$ROOT" spk_v1/.venv/bin/spk-v1 validate --repo-root "$ROOT"
echo ""

if [[ -f state/foundation/peg_simulation_summary.json ]]; then
  echo "-- peg simulation --"
  python3 -c "
import json
from pathlib import Path
p = Path('state/foundation/peg_simulation_summary.json')
d = json.loads(p.read_text())
print(json.dumps({k: d.get(k) for k in ('ok','pct_in_band','max_deviation_bps')}, indent=2))
"
  echo ""
fi

echo "-- foundation snapshot --"
head -45 docs/foundation/FOUNDATION_STATUS.md
echo ""
echo "Full: docs/foundation/FOUNDATION_STATUS.md"
echo "API:  npm run spk:v1:api  →  GET /v1/foundation"
echo "engine_status_ok"

#!/usr/bin/env bash
# Full local backend check: library tests + CLI smoke + optional live sync.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PKG="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$PKG/.venv"
export SPK_V1_REPO_ROOT="$ROOT"

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Creating spk_v1 venv..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q -e "$PKG[dev,api]"
else
  "$VENV/bin/pip" install -q -e "$PKG[dev,api]"
fi

echo "==> pytest (library + API)"
"$VENV/bin/pytest" --rootdir="$PKG" -c "$PKG/pyproject.toml" "$PKG/tests" -q

echo "==> CLI show-metrics"
"$VENV/bin/spk-v1" show-metrics --repo-root "$ROOT" | head -20

if [[ "${SPK_V1_SKIP_LIVE:-0}" != "1" ]]; then
  echo "==> CLI sync (live Sepolia)"
  "$VENV/bin/spk-v1" sync --repo-root "$ROOT"
fi

echo "==> CLI export-evidence"
"$VENV/bin/spk-v1" export-evidence --repo-root "$ROOT"

echo "==> API smoke (uvicorn background)"
"$VENV/bin/spk-v1-api" &
API_PID=$!
trap 'kill "$API_PID" 2>/dev/null || true' EXIT
sleep 2
curl -fsS "http://127.0.0.1:${SPK_V1_API_PORT:-8787}/health" | head -c 200
echo
curl -fsS "http://127.0.0.1:${SPK_V1_API_PORT:-8787}/v1/metrics" | head -c 300
echo

echo "backend_check_ok"

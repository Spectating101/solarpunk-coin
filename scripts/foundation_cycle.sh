#!/usr/bin/env bash
# Operator cycle + runtime sync + foundation status export.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_BIN="${ROOT}/spk_v1/.venv/bin"
if [[ ! -x "${VENV_BIN}/spk-v1" ]]; then
  echo "Run: npm run spk:v1:py:install" >&2
  exit 1
fi

export SPK_V1_REPO_ROOT="$ROOT"

echo "== operator cycle (Sepolia) =="
npm run spk:v1:cycle:sepolia

echo "== sync + foundation =="
"${VENV_BIN}/spk-v1" sync --repo-root "$ROOT"
"${VENV_BIN}/spk-v1" foundation --repo-root "$ROOT"

echo "foundation_cycle_ok"

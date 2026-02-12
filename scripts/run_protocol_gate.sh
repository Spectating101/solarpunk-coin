#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET_PHASE="${1:-1}"

echo "[gate] refreshing project artifacts"
bash scripts/run_project_operating_cycle.sh

echo "[gate] enforcing protocol gate for phase ${TARGET_PHASE}"
python3 scripts/build_protocol_phase_gates.py --target-phase "${TARGET_PHASE}" --strict

echo "[gate] PASS phase ${TARGET_PHASE}"

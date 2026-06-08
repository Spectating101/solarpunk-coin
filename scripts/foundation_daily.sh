#!/usr/bin/env bash
# Read-only foundation refresh (no operator cycle). Safe without extra gas.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run foundation:sync || true
npm run foundation:health || true
npm run foundation:peg-check || true
npm run foundation:publish-docs
echo "foundation_daily_ok"

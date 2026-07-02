#!/usr/bin/env bash
# Weekly operator rhythm: health gate → cycle (if ok) or read-only daily → publish demo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HEALTH_JSON="$(node scripts/foundation_health.js 2>/dev/null || echo '{"ok":false}')"
if echo "$HEALTH_JSON" | grep -q '"ok": true'; then
  echo "foundation_weekly: health ok — operator cycle"
  npm run foundation:cycle
else
  echo "foundation_weekly: health not ok — read-only daily refresh" >&2
  npm run foundation:daily
  exit 0
fi

npm run foundation:publish-docs
npm run exploration:procure-data || true
npm run exploration:tier-c || true
echo "foundation_weekly_ok"

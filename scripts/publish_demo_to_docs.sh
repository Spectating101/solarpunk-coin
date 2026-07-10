#!/usr/bin/env bash
# Publish Vite demo to docs/demo/ (keeps rest of docs/ intact).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cp state/runtime/spk_v1.json frontend/public/spk_v1.json
cd frontend
if [[ ! -x node_modules/.bin/vite ]]; then
  npm install
fi
npm run build
mkdir -p ../docs/demo
rsync -av --delete dist/ ../docs/demo/
touch ../docs/.nojekyll
echo "published_demo_to_docs/demo"

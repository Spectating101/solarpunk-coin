#!/usr/bin/env bash
# Build the current Policy Lab Vite surface and mirror it into docs/demo/ for GitHub Pages.
# Historical/reference assets already committed under frontend/public remain available,
# but publishing does not refresh or mutate SPK/Sepolia runtime state.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

node scripts/policy_lab_preflight.mjs

cd frontend
if [[ ! -x node_modules/.bin/vite ]]; then
  npm install
fi
npm run build
mkdir -p ../docs/demo
rsync -av --delete dist/ ../docs/demo/
touch ../docs/.nojekyll
echo "published_policy_lab_to_docs/demo"

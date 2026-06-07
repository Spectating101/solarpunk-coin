#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NETWORK="${SPK_V1_NETWORK:-hardhat}"

echo "[spk-v1] 1/3 compile"
npm run compile >/dev/null

echo "[spk-v1] 2/3 attestations fixture (if missing)"
if [[ ! -f state/attestations/latest_attestation_bundle.json ]]; then
  npm run attestations:fixture
  npm run attestations:build
fi

echo "[spk-v1] 3/3 deploy + genesis on ${NETWORK} (single chain session)"
if [[ "${NETWORK}" == "hardhat" ]]; then
  npx hardhat run scripts/launch_spk_v1.js
else
  npx hardhat run scripts/launch_spk_v1.js --network "${NETWORK}"
fi

echo
echo "[spk-v1] launch complete"
echo "- runtime: state/runtime/spk_v1.json"
echo "- frontend: frontend/public/spk_v1.json"
echo "- docs: docs/product/SPK_V1.md"

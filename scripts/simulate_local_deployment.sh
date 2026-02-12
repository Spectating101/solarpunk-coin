#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOG_FILE="${LOG_FILE:-/tmp/solarpunk_hardhat_node.log}"
RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"

echo "[local-sim] starting persistent hardhat node"
nohup npx hardhat node > "$LOG_FILE" 2>&1 &
NODE_PID=$!

cleanup() {
  kill "$NODE_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "[local-sim] waiting for rpc: $RPC_URL"
for _ in $(seq 1 60); do
  if curl -s -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
    "$RPC_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

mkdir -p state/deployments

echo "[local-sim] deploying SolarPunkCoin on localhost"
npx hardhat run scripts/deploy.js --network localhost

echo "[local-sim] deploying SolarPunkOption on localhost"
npx hardhat run scripts/deploy_pillar3.js --network localhost

echo "[local-sim] building deployment receipt"
python3 scripts/build_deployment_receipt.py --network localhost --chain-id 1337

echo "[local-sim] confirming on-chain receipts"
python3 scripts/confirm_deployment_onchain.py --rpc-url "$RPC_URL" --strict

echo "[local-sim] validating receipt"
python3 scripts/validate_deployment_receipt.py --strict

echo
echo "[local-sim] PASS"
echo "- state/deployments/amoy_receipt.json"
echo "- state/deployments/onchain_confirmation_report.json"
echo "- state/deployments/deployment_receipt_validation.json"

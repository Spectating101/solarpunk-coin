#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[cycle] 1/6 verify stack"
bash verify_all.sh

echo "[cycle] 2/6 ingest attestation bundle"
python3 scripts/ingest_meter_attestations.py --input data/attestations/sample_meter_attestations.json

echo "[cycle] 3/6 render security audit status"
python3 scripts/render_security_audit_status.py

echo "[cycle] 4/6 build deployment receipt"
python3 scripts/build_deployment_receipt.py

echo "[cycle] 5/6 confirm deployment on-chain (best-effort)"
python3 scripts/confirm_deployment_onchain.py

echo "[cycle] 6/6 build governance status"
python3 scripts/build_governance_status.py

echo
echo "[cycle] complete"
echo "- docs/project/SECURITY_AUDIT_STATUS.json"
echo "- docs/project/GOVERNANCE_STATUS.json"
echo "- state/deployments/amoy_receipt.json"

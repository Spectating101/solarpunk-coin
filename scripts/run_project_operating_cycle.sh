#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[cycle] 1/12 verify stack"
bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json

echo "[cycle] 2/12 build grant readiness pack"
python3 scripts/build_grant_readiness_pack.py

echo "[cycle] 3/12 build project readiness pack"
python3 scripts/build_project_readiness_pack.py

echo "[cycle] 4/12 build monetary-system readiness"
python3 scripts/build_monetary_system_readiness.py

echo "[cycle] 5/12 ingest attestation bundle"
python3 scripts/ingest_meter_attestations.py --input data/attestations/sample_meter_attestations.json

echo "[cycle] 6/12 render security audit status"
python3 scripts/render_security_audit_status.py

echo "[cycle] 7/12 build deployment receipt"
python3 scripts/build_deployment_receipt.py

echo "[cycle] 8/12 confirm deployment on-chain (best-effort)"
python3 scripts/confirm_deployment_onchain.py

echo "[cycle] 9/12 validate deployment receipt"
python3 scripts/validate_deployment_receipt.py

echo "[cycle] 10/12 validate security audit status"
python3 scripts/validate_audit_status.py

echo "[cycle] 11/12 build protocol phase gates (target phase 1)"
python3 scripts/build_protocol_phase_gates.py --target-phase 1

echo "[cycle] 12/12 build project dashboard"
python3 scripts/build_project_dashboard.py

echo
echo "[cycle] complete"
echo "- artifacts/verify_health.json"
echo "- docs/grants/GRANT_READINESS_PACK.md"
echo "- docs/project/PROJECT_READINESS_PACK.md"
echo "- docs/project/PROJECT_DASHBOARD.html"
echo "- docs/project/MONETARY_SYSTEM_READINESS.md"
echo "- docs/project/PROTOCOL_PHASE_GATES.md"
echo "- docs/project/METER_ATTESTATION_BUNDLE.md"
echo "- docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md"
echo "- docs/project/SECURITY_AUDIT_VALIDATION.md"
echo "- docs/project/ONCHAIN_CONFIRMATION_REPORT.md"

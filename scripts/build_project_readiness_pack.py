#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _count_files(root: Path, rel: str, patterns: List[str]) -> int:
    p = root / rel
    if not p.exists():
        return 0
    n = 0
    for pat in patterns:
        n += len(list(p.glob(pat)))
    return n


def _exists(root: Path, rel: str) -> bool:
    return (root / rel).exists()


def _grade(payload: Dict[str, Any]) -> str:
    checks = payload.get("core_checks", {})
    score = 0
    score += 1 if checks.get("pricing_engine_ok") else 0
    score += 1 if checks.get("contracts_ok") else 0
    score += 1 if checks.get("frontend_ok") else 0
    score += 1 if checks.get("oracle_service_present") else 0
    score += 1 if checks.get("empirical_data_present") else 0
    score += 1 if checks.get("deployment_docs_present") else 0
    if score >= 6:
        return "A"
    if score >= 5:
        return "B"
    if score >= 3:
        return "C"
    return "D"


def _build_payload(root: Path) -> Dict[str, Any]:
    verify = _load_json(root / "artifacts/verify_health.json")
    checks = verify.get("checks", {}) if isinstance(verify, dict) else {}

    required_docs = [
        "README.md",
        "DEPLOYMENT_GUIDE.md",
        "docs/project/PROJECT_OPERATIONS.md",
        "docs/grants/GRANT_READINESS_PACK.md",
        "docs/monetization/SERVICES.md",
        "docs/thesis/MASTER_THESIS_PROPOSAL.md",
    ]
    missing_docs = [d for d in required_docs if not _exists(root, d)]

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": "Solarpunk-bitcoin",
        "verification_status": verify.get("overall_status"),
        "verification_warnings": verify.get("warnings"),
        "core_checks": {
            "pricing_engine_ok": checks.get("pricing_engine") == "ok",
            "contracts_ok": checks.get("contracts") == "ok",
            "frontend_ok": checks.get("frontend") == "ok",
            "api_service_present": _exists(root, "energy_derivatives/api/main.py"),
            "empirical_data_present": _exists(root, "empirical"),
            "deployment_docs_present": _exists(root, "DEPLOYMENT_GUIDE.md")
            and _exists(root, "docs/project/PROJECT_OPERATIONS.md"),
        },
        "inventories": {
            "contracts_solidity_files": _count_files(root, "contracts", ["*.sol"]),
            "contract_test_files": _count_files(root, "test", ["*.js", "*.ts"]),
            "script_files": _count_files(root, "scripts", ["*.py", "*.sh", "*.js"]),
            "frontend_source_files": _count_files(root, "frontend/src", ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]),
            "empirical_csv_files": _count_files(root, "empirical", ["*.csv"]),
            "empirical_png_files": _count_files(root, "empirical", ["*.png"]),
            "grant_docs_files": _count_files(root, "docs/grants", ["*.md"]),
        },
        "missing_required_docs": missing_docs,
        "project_modes": {
            "mode_1_research": "Empirical and economic validation using datasets and analytics.",
            "mode_2_protocol": "Smart contracts + oracle + frontend verification and deployment.",
            "mode_3_funding": "Grant and submission package generation with reproducible verification.",
            "mode_4_commercial": "Client pilot term-sheet generation and integrity-backed delivery cycle.",
        },
        "independent_lanes": {
            "research_lane_ready": _count_files(root, "empirical", ["*.csv", "*.png"]) > 0,
            "protocol_lane_ready": checks.get("contracts") == "ok" and checks.get("frontend") == "ok",
            "operations_lane_ready": _exists(root, "scripts/run_project_operating_cycle.sh"),
            "handoff_lane_ready": _exists(root, "docs/project/PROJECT_OPERATIONS.md"),
            "commercial_lane_ready": _exists(root, "scripts/build_pilot_termsheet.py")
            and _exists(root, "docs/commercial/COMMERCIAL_OPERATING_MODEL.md")
            and _exists(root, "clients/sample_solar_operator.json"),
            "monetary_system_lane_ready": _exists(root, "scripts/build_monetary_system_readiness.py")
            and _exists(root, "docs/project/PROJECT_OPERATIONS.md")
            and _exists(root, "docs/thesis/MASTER_THESIS_PROPOSAL.md"),
            "phase_gate_lane_ready": _exists(root, "scripts/build_protocol_phase_gates.py")
            and _exists(root, "scripts/run_protocol_gate.sh"),
            "governance_lane_ready": _exists(root, "scripts/build_governance_status.py")
            and _exists(root, "docs/project/ROLE_PERMISSION_MATRIX.md")
            and _exists(root, "docs/project/PROJECT_OPERATIONS.md"),
            "evidence_validation_lane_ready": _exists(root, "scripts/build_deployment_receipt.py")
            and _exists(root, "scripts/validate_deployment_receipt.py")
            and _exists(root, "scripts/validate_audit_status.py"),
            "onchain_confirmation_lane_ready": _exists(root, "scripts/confirm_deployment_onchain.py")
            and _exists(root, "scripts/render_security_audit_status.py")
            and _exists(root, "scripts/record_audit_update.py"),
        },
        "execution_profiles": {
            "profile_1_research_service": "Deliver empirical risk reports and pricing analyses.",
            "profile_2_protocol_demo": "Run contract + frontend demos with reproducible verification.",
            "profile_3_funding_submission": "Generate grant/sponsor packs from current project state.",
            "profile_4_commercial_pilot": "Generate client-facing indicative term sheets and integrity artifacts.",
            "profile_5_monetary_protocol": "Track and validate standalone monetary-protocol readiness.",
            "profile_6_phase_gate_enforcement": "Enforce explicit GO/NO_GO protocol progression gates.",
            "profile_6b_governance_hardening": "Track governance controls and change-trace cadence artifacts.",
            "profile_7_evidence_validation": "Validate deployment and audit evidence before expansion claims.",
            "profile_8_onchain_confirmation": "Confirm deployment tx receipts on-chain and synchronize evidence artifacts.",
        },
        "operator_commands": [
            "bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json",
            "python3 scripts/build_grant_readiness_pack.py",
            "python3 scripts/build_project_readiness_pack.py",
            "python3 scripts/build_project_dashboard.py",
            "python3 scripts/build_monetary_system_readiness.py",
            "python3 scripts/ingest_meter_attestations.py --input data/attestations/sample_meter_attestations.json",
            "python3 scripts/build_deployment_receipt.py",
            "python3 scripts/confirm_deployment_onchain.py",
            "python3 scripts/validate_deployment_receipt.py",
            "python3 scripts/record_audit_update.py --status IN_PROGRESS",
            "python3 scripts/render_security_audit_status.py",
            "python3 scripts/validate_audit_status.py",
            "python3 scripts/build_protocol_phase_gates.py --target-phase 1",
            "python3 scripts/build_governance_status.py",
            "bash scripts/run_project_operating_cycle.sh",
            "bash scripts/run_commercial_cycle.sh",
            "bash scripts/run_protocol_gate.sh 1",
        ],
    }
    payload["readiness_grade"] = _grade(payload)
    payload["next_actions"] = [
        "Keep `artifacts/verify_health.json` fresh before any external submission or demo.",
        "Use `scripts/run_project_operating_cycle.sh` as the canonical pre-release routine.",
        "Treat `docs/project/PROJECT_READINESS_PACK.md` as the one-page system status for collaborators.",
    ]
    return payload


def _to_markdown(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Project Readiness Pack")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- project: `{payload.get('project')}`")
    lines.append(f"- readiness_grade: `{payload.get('readiness_grade')}`")
    lines.append(f"- verification_status: `{payload.get('verification_status')}`")
    lines.append(f"- verification_warnings: `{payload.get('verification_warnings')}`")
    lines.append("")

    lines.append("## Core Checks")
    lines.append("")
    for k, v in payload.get("core_checks", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")

    lines.append("## Inventory Snapshot")
    lines.append("")
    for k, v in payload.get("inventories", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")

    lines.append("## Required Docs")
    lines.append("")
    missing = payload.get("missing_required_docs", [])
    lines.append(f"- missing_required_docs_count: `{len(missing)}`")
    for m in missing:
        lines.append(f"- missing: `{m}`")
    lines.append("")

    lines.append("## Project Modes")
    lines.append("")
    for k, v in payload.get("project_modes", {}).items():
        lines.append(f"- {k}: {v}")
    lines.append("")

    lines.append("## Independent Lanes")
    lines.append("")
    for k, v in payload.get("independent_lanes", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")

    lines.append("## Execution Profiles")
    lines.append("")
    for k, v in payload.get("execution_profiles", {}).items():
        lines.append(f"- {k}: {v}")
    lines.append("")

    lines.append("## Operator Commands")
    lines.append("")
    for c in payload.get("operator_commands", []):
        lines.append(f"- `{c}`")
    lines.append("")

    lines.append("## Next Actions")
    lines.append("")
    for a in payload.get("next_actions", []):
        lines.append(f"- {a}")
    lines.append("")

    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="Build an independent project readiness pack for Solarpunk.")
    ap.add_argument("--out-dir", default="docs/project")
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    out_dir = root / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    payload = _build_payload(root)
    out_json = out_dir / "PROJECT_READINESS_PACK.json"
    out_md = out_dir / "PROJECT_READINESS_PACK.md"
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_markdown(payload), encoding="utf-8")
    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

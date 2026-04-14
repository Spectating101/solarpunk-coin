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


def _exists(root: Path, rel: str) -> bool:
    return (root / rel).exists()


def _abi_functions(root: Path, artifact_rel: str) -> List[str]:
    artifact = _load_json(root / artifact_rel)
    abi = artifact.get("abi", [])
    if not isinstance(abi, list):
        return []
    names: List[str] = []
    for item in abi:
        if isinstance(item, dict) and item.get("type") == "function" and isinstance(item.get("name"), str):
            names.append(item["name"])
    return names


def _latest_deploy_receipt(root: Path) -> Dict[str, Any]:
    deploy_dir = root / "state/deployments"
    if not deploy_dir.exists():
        return {}
    candidates = sorted(
        [p for p in deploy_dir.glob("*_full_deploy.json") if p.is_file()],
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not candidates:
        return {}
    return _load_json(candidates[0])


def _required_funcs_present(funcs: List[str], required: List[str]) -> bool:
    available = set(funcs)
    return all(f in available for f in required)


def _build_payload(root: Path, cadence_days: int) -> Dict[str, Any]:
    coin_funcs = _abi_functions(root, "artifacts/contracts/SolarPunkCoin.sol/SolarPunkCoin.json")
    option_funcs = _abi_functions(root, "artifacts/contracts/SolarPunkOption.sol/SolarPunkOption.json")
    treasury_funcs = _abi_functions(root, "artifacts/contracts/ProtocolTreasury.sol/ProtocolTreasury.json")
    latest_deploy = _latest_deploy_receipt(root)

    governance_core = [
        "setGovernanceDelay",
        "queueGovernanceAction",
        "cancelGovernanceAction",
        "setOperatorRole",
    ]
    action_id_funcs = {
        "coin_action_id": "actionIdSetOperatorRole",
        "option_action_id": "actionIdSetOperatorRole",
        "treasury_action_id": "actionIdSetOperatorRole",
    }

    checks = {
        "coin_timelock_controls_present": _required_funcs_present(coin_funcs, governance_core),
        "option_timelock_controls_present": _required_funcs_present(option_funcs, governance_core),
        "treasury_timelock_controls_present": _required_funcs_present(treasury_funcs, governance_core),
        "coin_operator_action_id_present": action_id_funcs["coin_action_id"] in set(coin_funcs),
        "option_operator_action_id_present": action_id_funcs["option_action_id"] in set(option_funcs),
        "treasury_operator_action_id_present": action_id_funcs["treasury_action_id"] in set(treasury_funcs),
        "ops_handbook_present": _exists(root, "docs/project/PROJECT_OPERATIONS.md"),
        "role_matrix_present": _exists(root, "docs/project/ROLE_PERMISSION_MATRIX.md"),
        "audit_handoff_checklist_present": _exists(root, "docs/project/AUDITOR_HANDOFF_CHECKLIST.md"),
        "governance_deploy_wiring_present": _exists(root, "scripts/deploy_testnet_full.js")
        and _exists(root, "scripts/deploy.js")
        and _exists(root, "scripts/deploy_pillar3.js"),
    }

    all_core_ok = all(checks.values())
    recommendation = "MAINTAIN" if all_core_ok else "HARDEN"

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": "Solarpunk-bitcoin",
        "governance_status": "READY_INTERNAL" if all_core_ok else "INCOMPLETE",
        "checks": checks,
        "latest_deployment_context": {
            "network": latest_deploy.get("network"),
            "governance_admin": latest_deploy.get("governance_admin"),
            "strict_admin_handoff": latest_deploy.get("strict_admin_handoff"),
            "governance_delays_seconds": latest_deploy.get("governance_delays_seconds", {}),
        },
        "governance_cadence": {
            "recommended_review_period_days": cadence_days,
            "required_artifacts": [
                "docs/project/GOVERNANCE_STATUS.json",
                "docs/project/GOVERNANCE_STATUS.md",
                "docs/project/ROLE_PERMISSION_MATRIX.md",
                "docs/project/PROJECT_OPERATIONS.md",
            ],
            "change_trace_minimum_fields": [
                "action_id",
                "queued_tx_hash",
                "executed_tx_hash",
                "function_name",
                "params_digest",
            ],
        },
        "recommendation": recommendation,
        "next_actions": [
            "Refresh governance status artifact every cadence cycle.",
            "Use timelock queue/consume for critical parameter changes when governance delay is enabled.",
            "Record queue and execution tx hashes for each governance action.",
        ],
    }
    return payload


def _to_markdown(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Governance Status")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- governance_status: `{payload.get('governance_status')}`")
    lines.append(f"- recommendation: `{payload.get('recommendation')}`")
    lines.append("")
    lines.append("## Control Checks")
    lines.append("")
    for key, value in payload.get("checks", {}).items():
        lines.append(f"- {key}: `{value}`")
    lines.append("")
    lines.append("## Latest Deployment Governance Context")
    lines.append("")
    ctx = payload.get("latest_deployment_context", {})
    lines.append(f"- network: `{ctx.get('network')}`")
    lines.append(f"- governance_admin: `{ctx.get('governance_admin')}`")
    lines.append(f"- strict_admin_handoff: `{ctx.get('strict_admin_handoff')}`")
    lines.append(f"- governance_delays_seconds: `{ctx.get('governance_delays_seconds')}`")
    lines.append("")
    lines.append("## Governance Cadence")
    lines.append("")
    cadence = payload.get("governance_cadence", {})
    lines.append(f"- recommended_review_period_days: `{cadence.get('recommended_review_period_days')}`")
    for artifact in cadence.get("required_artifacts", []):
        lines.append(f"- required_artifact: `{artifact}`")
    for field in cadence.get("change_trace_minimum_fields", []):
        lines.append(f"- change_trace_field: `{field}`")
    lines.append("")
    lines.append("## Next Actions")
    lines.append("")
    for item in payload.get("next_actions", []):
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build governance status artifacts.")
    parser.add_argument("--out-dir", default="docs/project")
    parser.add_argument("--cadence-days", type=int, default=14)
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    out_dir = root / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    payload = _build_payload(root, cadence_days=args.cadence_days)
    out_json = out_dir / "GOVERNANCE_STATUS.json"
    out_md = out_dir / "GOVERNANCE_STATUS.md"
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_markdown(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

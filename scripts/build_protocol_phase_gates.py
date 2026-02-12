#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


PHASE_KEYS = {
    0: "phase_0_protocol_integrity",
    1: "phase_1_controlled_monetary_pilot",
    2: "phase_2_live_attestation_hardening",
    3: "phase_3_market_expansion_readiness",
}


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _exists(root: Path, rel: str) -> bool:
    return (root / rel).exists()


def _phase_status(ok: bool) -> str:
    return "PASS" if ok else "FAIL"


def _build(root: Path, target_phase: int) -> Dict[str, Any]:
    verify = _load_json(root / "artifacts/verify_health.json")
    project = _load_json(root / "docs/project/PROJECT_READINESS_PACK.json")
    monetary = _load_json(root / "docs/project/MONETARY_SYSTEM_READINESS.json")
    deployment_validation = _load_json(root / "state/deployments/deployment_receipt_validation.json")
    audit_validation = _load_json(root / "artifacts/compliance/security_audit_validation.json")

    checks = monetary.get("core_protocol_checks", {})
    lanes = project.get("independent_lanes", {})

    warnings_raw = verify.get("warnings", 1)
    try:
        warnings_count = int(warnings_raw)
    except Exception:
        warnings_count = 1
    verify_ok = verify.get("overall_status") == "ok" and warnings_count == 0
    core_ok = all(
        bool(checks.get(k))
        for k in [
            "energy_backed_issuance",
            "intrinsic_redemption",
            "monetary_policy_control",
            "solvency_and_reserves",
            "grid_stress_safeguard",
            "governance_and_roles",
            "test_coverage_protocol_rules",
        ]
    )

    phase0_ok = bool(verify_ok and core_ok)
    phase0_blockers: List[str] = []
    if not verify_ok:
        phase0_blockers.append("Verification status is not clean (`verify_health.json`).")
    if not core_ok:
        phase0_blockers.append("One or more core monetary protocol checks failed.")

    phase1_ok = bool(
        phase0_ok
        and lanes.get("commercial_lane_ready")
        and checks.get("derivatives_settlement_layer")
        and _exists(root, "docs/commercial/COMMERCIAL_OPERATING_MODEL.md")
    )
    phase1_blockers: List[str] = []
    if not phase0_ok:
        phase1_blockers.append("Phase 0 must pass first.")
    if not lanes.get("commercial_lane_ready"):
        phase1_blockers.append("Commercial lane is not fully ready.")
    if not checks.get("derivatives_settlement_layer"):
        phase1_blockers.append("Derivatives settlement layer check is not passing.")

    # Phase 2 intentionally requires attestation pipeline artifacts that indicate production data provenance planning.
    phase2_ok = bool(
        phase1_ok
        and checks.get("oracle_safety_controls")
        and _exists(root, "scripts/ingest_meter_attestations.py")
        and _exists(root, "artifacts/attestations/latest_attestation_bundle.json")
        and _exists(root, "docs/project/ATTESTATION_PIPELINE_SPEC.md")
        and _exists(root, "docs/project/ORACLE_SAFETY_POLICY.md")
    )
    phase2_blockers: List[str] = []
    if not phase1_ok:
        phase2_blockers.append("Phase 1 must pass first.")
    if not checks.get("oracle_safety_controls"):
        phase2_blockers.append("Oracle safety controls check is not passing.")
    if not _exists(root, "scripts/ingest_meter_attestations.py"):
        phase2_blockers.append("Missing attestation ingestion script.")
    if not _exists(root, "artifacts/attestations/latest_attestation_bundle.json"):
        phase2_blockers.append("Missing latest attestation bundle artifact.")
    if not _exists(root, "docs/project/ATTESTATION_PIPELINE_SPEC.md"):
        phase2_blockers.append("Missing attestation pipeline spec.")
    if not _exists(root, "docs/project/ORACLE_SAFETY_POLICY.md"):
        phase2_blockers.append("Missing oracle safety policy.")

    phase3_ok = bool(
        phase2_ok
        and _exists(root, "docs/project/MAINNET_READINESS_CHECKLIST.md")
        and _exists(root, "docs/project/PILOT_OPERATING_SLO.md")
        and bool(deployment_validation.get("validation_passed"))
        and _exists(root, "docs/project/SECURITY_AUDIT_STATUS.md")
        and _exists(root, "docs/project/SECURITY_AUDIT_STATUS.json")
        and bool(audit_validation.get("validation_passed"))
    )
    phase3_blockers: List[str] = []
    if not phase2_ok:
        phase3_blockers.append("Phase 2 must pass first.")
    if not _exists(root, "docs/project/MAINNET_READINESS_CHECKLIST.md"):
        phase3_blockers.append("Missing mainnet readiness checklist.")
    if not _exists(root, "docs/project/PILOT_OPERATING_SLO.md"):
        phase3_blockers.append("Missing pilot operating SLO definition.")
    if not _exists(root, "state/deployments/amoy_receipt.json"):
        phase3_blockers.append("Missing deployment receipt artifact for expansion gate.")
    if not bool(deployment_validation.get("validation_passed")):
        phase3_blockers.append("Deployment receipt validation has not passed.")
    if not _exists(root, "docs/project/SECURITY_AUDIT_STATUS.md"):
        phase3_blockers.append("Missing security audit status document.")
    if not _exists(root, "docs/project/SECURITY_AUDIT_STATUS.json"):
        phase3_blockers.append("Missing machine-readable security audit status.")
    if not bool(audit_validation.get("validation_passed")):
        phase3_blockers.append("Security audit validation has not passed.")

    phases: Dict[str, Dict[str, Any]] = {
        PHASE_KEYS[0]: {
            "status": _phase_status(phase0_ok),
            "passed": phase0_ok,
            "description": "Protocol integrity and deterministic verification",
            "blockers": phase0_blockers,
        },
        PHASE_KEYS[1]: {
            "status": _phase_status(phase1_ok),
            "passed": phase1_ok,
            "description": "Controlled pilot operations with monetary + risk stack",
            "blockers": phase1_blockers,
        },
        PHASE_KEYS[2]: {
            "status": _phase_status(phase2_ok),
            "passed": phase2_ok,
            "description": "Live attestation and oracle hardening",
            "blockers": phase2_blockers,
        },
        PHASE_KEYS[3]: {
            "status": _phase_status(phase3_ok),
            "passed": phase3_ok,
            "description": "Expansion readiness under production controls",
            "blockers": phase3_blockers,
        },
    }

    target_key = PHASE_KEYS[target_phase]
    target_passed = bool(phases[target_key]["passed"])

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": "Solarpunk-bitcoin",
        "target_phase": target_phase,
        "target_phase_key": target_key,
        "target_phase_passed": target_passed,
        "phases": phases,
        "decision": "GO" if target_passed else "NO_GO",
        "next_actions": [
            "Run `bash scripts/run_project_operating_cycle.sh` before gate evaluation.",
            "Use `python3 scripts/build_protocol_phase_gates.py --target-phase N --strict` for hard gate enforcement.",
            "Advance one phase at a time; do not skip blockers.",
        ],
    }
    return payload


def _to_md(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Protocol Phase Gates")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- target_phase: `{payload.get('target_phase')}`")
    lines.append(f"- target_phase_key: `{payload.get('target_phase_key')}`")
    lines.append(f"- target_phase_passed: `{payload.get('target_phase_passed')}`")
    lines.append(f"- decision: `{payload.get('decision')}`")
    lines.append("")

    lines.append("## Phase Status")
    lines.append("")
    phases = payload.get("phases", {})
    for key, info in phases.items():
        lines.append(f"- {key}: `{info.get('status')}`")
        lines.append(f"- {key}_description: {info.get('description')}")
        blockers = info.get("blockers", [])
        if blockers:
            for blocker in blockers:
                lines.append(f"- {key}_blocker: {blocker}")
        else:
            lines.append(f"- {key}_blocker: none")
        lines.append("")

    lines.append("## Next Actions")
    lines.append("")
    for step in payload.get("next_actions", []):
        lines.append(f"- {step}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Solarpunk protocol phase-gate report.")
    parser.add_argument("--target-phase", type=int, default=0, choices=[0, 1, 2, 3])
    parser.add_argument("--out-dir", default="docs/project")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero if target phase does not pass.")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    payload = _build(root, target_phase=args.target_phase)

    out_dir = root / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    out_json = out_dir / "PROTOCOL_PHASE_GATES.json"
    out_md = out_dir / "PROTOCOL_PHASE_GATES.md"

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")

    if args.strict and not payload.get("target_phase_passed", False):
        print("strict gate failed: target phase not passed")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

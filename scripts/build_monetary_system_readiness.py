#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


def _read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _has_all(text: str, patterns: List[str]) -> bool:
    return all(re.search(p, text, re.MULTILINE | re.DOTALL) is not None for p in patterns)


def _grade(checks: Dict[str, bool], verify_ok: bool) -> str:
    score = sum(1 for v in checks.values() if v)
    if verify_ok:
        score += 1
    if score >= 8:
        return "A"
    if score >= 6:
        return "B"
    if score >= 4:
        return "C"
    return "D"


def _build(root: Path) -> Dict[str, Any]:
    contract = _read(root / "contracts/SolarPunkCoin.sol")
    option_contract = _read(root / "contracts/SolarPunkOption.sol")
    coin_tests = _read(root / "test/SolarPunkCoin.test.js")
    option_tests = _read(root / "test/SolarPunkOption.test.js")
    verify = _load_json(root / "artifacts/verify_health.json")

    checks: Dict[str, bool] = {
        "energy_backed_issuance": _has_all(
            contract,
            [r"function\s+mintFromSurplus", r"onlyMinter", r"gridNotStressed", r"oracleNotStale"],
        ),
        "intrinsic_redemption": _has_all(
            contract,
            [r"function\s+redeemForEnergy", r"_burn\(", r"totalRedeemed"],
        ),
        "monetary_policy_control": _has_all(
            contract,
            [r"pegTarget", r"pegBand", r"integralGain", r"updateOraclePriceAndAdjust", r"_applyPIControl"],
        ),
        "oracle_safety_controls": _has_all(
            contract,
            [r"oracleStalenessThreshold", r"modifier\s+oracleNotStale", r"OraclePriceUpdated"],
        ),
        "solvency_and_reserves": _has_all(
            contract,
            [r"usdcReserve", r"_reserveRatioForSupply", r"minReserveMarginPercent", r"depositReserve"],
        ),
        "grid_stress_safeguard": _has_all(
            contract,
            [r"gridStressed", r"setGridStressed", r"GridStressToggled"],
        ),
        "governance_and_roles": _has_all(
            contract,
            [r"AccessControl", r"MINTER_ROLE", r"ORACLE_ROLE", r"PAUSER_ROLE", r"DEFAULT_ADMIN_ROLE"],
        ),
        "derivatives_settlement_layer": _has_all(
            option_contract,
            [r"contract\s+SolarPunkOption", r"createSeries", r"modifyPosition", r"liquidate", r"updateIndex"],
        ),
        "test_coverage_protocol_rules": _has_all(
            coin_tests + "\n" + option_tests,
            [
                r"Minting:\s+Rule\s+A",
                r"Redemption:\s+Rule\s+B",
                r"Peg Stabilization:\s+Rule\s+D",
                r"Grid Safety:\s+Rule\s+E",
                r"SolarPunkOption",
            ],
        ),
    }

    verify_ok = (verify.get("overall_status") == "ok") and (int(verify.get("warnings", 1)) == 0)

    functional_spec = {
        "token_issuance": "Mint only from verified surplus energy under oracle freshness and reserve safety constraints.",
        "redemption": "Burn token into energy-linked claim path for intrinsic floor behavior.",
        "stability": "Maintain peg corridor with PI-like control and stress-aware safeguards.",
        "risk_layer": "Support margin, liquidation, and settlement through option series infrastructure.",
        "governance": "Constrain privileged actions through role-based access and pause controls.",
    }

    gaps: List[str] = []
    if not checks["oracle_safety_controls"]:
        gaps.append("Oracle guardrails incomplete in code scan.")
    if not checks["energy_backed_issuance"]:
        gaps.append("Issuance path not fully constrained to surplus+oracle+stress gates.")
    if not checks["intrinsic_redemption"]:
        gaps.append("Redemption path not fully validated by static checks.")
    if not checks["derivatives_settlement_layer"]:
        gaps.append("Settlement layer methods missing in option contract scan.")
    if not verify_ok:
        gaps.append("System verification not clean; rerun verify_all before claims.")

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": "Solarpunk-bitcoin",
        "mission": "Energy-native monetary protocol with verifiable issuance, redemption, and solvency controls.",
        "functional_spec": functional_spec,
        "core_protocol_checks": checks,
        "verification_ok": verify_ok,
        "readiness_grade": _grade(checks, verify_ok),
        "open_gaps": gaps,
        "next_steps": [
            "Keep `verify_all.sh --contracts-in-docker` green before external claims.",
            "Harden live oracle attestation and meter-proof ingestion for production trust.",
            "Pilot with constrained participant set before broader currency framing.",
        ],
    }
    return payload


def _to_md(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Monetary System Readiness")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- project: `{payload.get('project')}`")
    lines.append(f"- readiness_grade: `{payload.get('readiness_grade')}`")
    lines.append(f"- verification_ok: `{payload.get('verification_ok')}`")
    lines.append("")
    lines.append("## Mission")
    lines.append("")
    lines.append(f"- {payload.get('mission')}")
    lines.append("")
    lines.append("## Standalone Functionality")
    lines.append("")
    for k, v in payload.get("functional_spec", {}).items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("## Core Protocol Checks")
    lines.append("")
    for k, v in payload.get("core_protocol_checks", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")
    lines.append("## Open Gaps")
    lines.append("")
    gaps = payload.get("open_gaps", [])
    if not gaps:
        lines.append("- none")
    else:
        for g in gaps:
            lines.append(f"- {g}")
    lines.append("")
    lines.append("## Next Steps")
    lines.append("")
    for step in payload.get("next_steps", []):
        lines.append(f"- {step}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Solarpunk monetary-system readiness report.")
    parser.add_argument("--out-dir", default="docs/project")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    payload = _build(root)

    out_dir = root / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    out_json = out_dir / "MONETARY_SYSTEM_READINESS.json"
    out_md = out_dir / "MONETARY_SYSTEM_READINESS.md"

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

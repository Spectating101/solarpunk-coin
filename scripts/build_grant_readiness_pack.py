#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


def _read_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _exists(root: Path, rel: str) -> bool:
    return (root / rel).exists()


def _latest_mtime_iso(paths: List[Path]) -> str | None:
    existing = [p for p in paths if p.exists()]
    if not existing:
        return None
    p = max(existing, key=lambda x: x.stat().st_mtime)
    return datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()


def _grade(payload: Dict[str, Any]) -> str:
    checks = payload.get("verification", {}).get("checks", {})
    contracts = checks.get("contracts")
    frontend = checks.get("frontend")
    pricing = checks.get("pricing_engine")
    pydeps = checks.get("python_dependencies")
    warn = int(payload.get("verification", {}).get("warnings", 0))

    score = 0
    score += 1 if pydeps == "ok" else 0
    score += 1 if pricing == "ok" else 0
    score += 1 if contracts == "ok" else 0
    score += 1 if frontend == "ok" else 0
    score -= min(warn, 2)
    if score >= 3:
        return "A"
    if score >= 2:
        return "B"
    if score >= 1:
        return "C"
    return "D"


def _build_payload(root: Path) -> Dict[str, Any]:
    verify_json = root / "artifacts/verify_health.json"
    verify = _read_json(verify_json)

    key_artifacts = [
        "GRANT_PROPOSAL.md",
        "GRANT_EXECUTIVE_SUMMARY.md",
        "docs/GRANT_BRIEF_POLYGON.md",
        "THOROUGH_ASSESSMENT.md",
        "verify_all.sh",
        "contracts/SolarPunkOption.sol",
        "scripts/pillar3_engine.py",
        "frontend/package.json",
    ]
    missing = [x for x in key_artifacts if not _exists(root, x)]

    empirical_dir = root / "empirical"
    empirical_csv = len(list(empirical_dir.glob("*.csv"))) if empirical_dir.exists() else 0
    empirical_png = len(list(empirical_dir.glob("*.png"))) if empirical_dir.exists() else 0

    readiness = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "repo": "Solarpunk-bitcoin",
        "verification_path": str(verify_json) if verify_json.exists() else None,
        "verification": verify if verify else {"overall_status": "unknown", "warnings": None, "checks": {}},
        "key_artifacts": key_artifacts,
        "missing_artifacts": missing,
        "artifact_freshness": {
            "grant_docs_latest": _latest_mtime_iso(
                [
                    root / "GRANT_PROPOSAL.md",
                    root / "GRANT_EXECUTIVE_SUMMARY.md",
                    root / "docs/GRANT_BRIEF_POLYGON.md",
                ]
            ),
            "verification_latest": _latest_mtime_iso([verify_json]),
            "contracts_latest": _latest_mtime_iso([root / "contracts/SolarPunkOption.sol"]),
            "frontend_latest": _latest_mtime_iso([root / "frontend/package.json", root / "frontend/index.html"]),
        },
        "empirical_inventory": {
            "csv_files": empirical_csv,
            "png_files": empirical_png,
        },
    }
    readiness["readiness_grade"] = _grade(readiness)
    readiness["priority_actions"] = [
        "Run `bash verify_all.sh --contracts-in-docker --json-report=artifacts/verify_health.json` before submissions.",
        "Keep `GRANT_PROPOSAL.md` and `docs/GRANT_BRIEF_POLYGON.md` synchronized with latest verification results.",
        "Attach the generated `docs/grants/GRANT_READINESS_PACK.md` as technical appendix in grant forms.",
    ]
    return readiness


def _to_md(payload: Dict[str, Any]) -> str:
    v = payload.get("verification", {})
    c = v.get("checks", {})
    lines: List[str] = []
    lines.append("# Grant Readiness Pack")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- readiness_grade: `{payload.get('readiness_grade')}`")
    lines.append(f"- overall_status: `{v.get('overall_status', 'unknown')}`")
    lines.append(f"- warnings: `{v.get('warnings')}`")
    lines.append("")
    lines.append("## Verification Snapshot")
    lines.append("")
    lines.append(f"- python_dependencies: `{c.get('python_dependencies')}`")
    lines.append(f"- pricing_engine: `{c.get('pricing_engine')}`")
    lines.append(f"- contracts: `{c.get('contracts')}`")
    lines.append(f"- frontend: `{c.get('frontend')}`")
    lines.append("")
    lines.append("## Artifact Integrity")
    lines.append("")
    lines.append(f"- missing_artifacts: `{len(payload.get('missing_artifacts', []))}`")
    for m in payload.get("missing_artifacts", []):
        lines.append(f"- missing: `{m}`")
    lines.append("")
    lines.append("## Empirical Inventory")
    lines.append("")
    inv = payload.get("empirical_inventory", {})
    lines.append(f"- empirical_csv_files: `{inv.get('csv_files')}`")
    lines.append(f"- empirical_png_files: `{inv.get('png_files')}`")
    lines.append("")
    lines.append("## Priority Actions")
    lines.append("")
    for a in payload.get("priority_actions", []):
        lines.append(f"- {a}")
    lines.append("")
    lines.append("## Submission Guidance")
    lines.append("")
    lines.append("- Use this file + `GRANT_PROPOSAL.md` + `docs/GRANT_BRIEF_POLYGON.md` as canonical package.")
    lines.append("- Re-run the builder before every submission so timestamps and verification state are current.")
    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="Build a canonical SolarPunk grant readiness pack.")
    ap.add_argument("--out-dir", default="docs/grants")
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    out_dir = root / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    payload = _build_payload(root)
    out_json = out_dir / "GRANT_READINESS_PACK.json"
    out_md = out_dir / "GRANT_READINESS_PACK.md"
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

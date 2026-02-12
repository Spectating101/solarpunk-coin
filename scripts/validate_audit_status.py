#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


ALLOWED_AUDIT_STATUS = {"NOT_STARTED", "IN_PROGRESS", "COMPLETED"}


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _to_md(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Security Audit Validation")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- validation_passed: `{payload.get('validation_passed')}`")
    lines.append(f"- audit_status: `{payload.get('audit_status')}`")
    lines.append("")
    lines.append("## Checks")
    lines.append("")
    for k, v in payload.get("checks", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")
    lines.append("## Errors")
    lines.append("")
    errs = payload.get("errors", [])
    if errs:
        for err in errs:
            lines.append(f"- {err}")
    else:
        lines.append("- none")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate security audit status for phase gates.")
    parser.add_argument("--input", default="docs/project/SECURITY_AUDIT_STATUS.json")
    parser.add_argument("--out-json", default="artifacts/compliance/security_audit_validation.json")
    parser.add_argument("--out-md", default="docs/project/SECURITY_AUDIT_VALIDATION.md")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    data = _load_json(root / args.input)

    ext = data.get("external_audit", {}) if isinstance(data, dict) else {}
    findings = data.get("findings", {}) if isinstance(data, dict) else {}

    status = str(ext.get("status", ""))
    completed_at = ext.get("completed_at")
    report_url = ext.get("report_url")
    critical_open = int(findings.get("critical_open", 9999)) if str(findings.get("critical_open", "")).isdigit() else 9999
    high_open = int(findings.get("high_open", 9999)) if str(findings.get("high_open", "")).isdigit() else 9999

    completed_at_valid = False
    if isinstance(completed_at, str) and completed_at:
        ts = completed_at[:-1] + "+00:00" if completed_at.endswith("Z") else completed_at
        try:
            datetime.fromisoformat(ts)
            completed_at_valid = True
        except Exception:
            completed_at_valid = False

    checks = {
        "status_enum_valid": status in ALLOWED_AUDIT_STATUS,
        "status_completed": status == "COMPLETED",
        "critical_findings_closed": critical_open == 0,
        "high_findings_closed": high_open == 0,
        "report_url_present": bool(report_url),
        "report_url_http": isinstance(report_url, str) and report_url.startswith(("http://", "https://")),
        "completed_at_present": bool(completed_at),
        "completed_at_valid_iso": completed_at_valid,
    }

    errors: List[str] = []
    if not checks["status_enum_valid"]:
        errors.append("external_audit.status has invalid enum.")
    if not checks["status_completed"]:
        errors.append("external_audit.status must be COMPLETED for expansion gate.")
    if not checks["critical_findings_closed"]:
        errors.append("critical_open must be 0.")
    if not checks["high_findings_closed"]:
        errors.append("high_open must be 0.")
    if not checks["report_url_present"]:
        errors.append("report_url is required for completed audit evidence.")
    if not checks["report_url_http"]:
        errors.append("report_url must be an http(s) URL.")
    if not checks["completed_at_present"]:
        errors.append("completed_at is required for completed audit evidence.")
    if not checks["completed_at_valid_iso"]:
        errors.append("completed_at must be valid ISO-8601 timestamp.")

    passed = len(errors) == 0

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "validation_passed": passed,
        "audit_status": status,
        "checks": checks,
        "errors": errors,
    }

    out_json = root / args.out_json
    out_md = root / args.out_md
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_md.parent.mkdir(parents=True, exist_ok=True)

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")

    if args.strict and not passed:
        print("strict validation failed: security audit evidence not sufficient")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

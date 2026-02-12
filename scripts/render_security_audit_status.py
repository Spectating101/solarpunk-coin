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


def _to_md(payload: Dict[str, Any]) -> str:
    ext = payload.get("external_audit", {})
    f = payload.get("findings", {})
    lines: List[str] = []
    lines.append("# Security Audit Status")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- project: `{payload.get('project')}`")
    lines.append("")
    lines.append("## External Audit")
    lines.append("")
    lines.append(f"- status: `{ext.get('status')}`")
    lines.append(f"- auditor: `{ext.get('auditor')}`")
    lines.append(f"- report_url: `{ext.get('report_url')}`")
    lines.append(f"- completed_at: `{ext.get('completed_at')}`")
    lines.append("")
    lines.append("## Findings")
    lines.append("")
    lines.append(f"- critical_open: `{f.get('critical_open')}`")
    lines.append(f"- high_open: `{f.get('high_open')}`")
    lines.append(f"- medium_open: `{f.get('medium_open')}`")
    lines.append(f"- low_open: `{f.get('low_open')}`")
    lines.append(f"- resolved_total: `{f.get('resolved_total')}`")
    lines.append("")
    lines.append("## Policy")
    lines.append("")
    lines.append("Mainnet expansion gate remains `NO_GO` until external audit is completed and critical/high findings policy is satisfied.")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Render security audit markdown from canonical JSON status.")
    parser.add_argument("--input", default="docs/project/SECURITY_AUDIT_STATUS.json")
    parser.add_argument("--out", default="docs/project/SECURITY_AUDIT_STATUS.md")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    payload = _load_json(root / args.input)
    if "generated_at" not in payload:
        payload["generated_at"] = datetime.now(timezone.utc).isoformat()

    out = root / args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(_to_md(payload), encoding="utf-8")
    print(f"wrote: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

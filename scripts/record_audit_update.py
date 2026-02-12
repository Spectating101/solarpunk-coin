#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def main() -> int:
    parser = argparse.ArgumentParser(description="Update canonical security audit status JSON.")
    parser.add_argument("--status", choices=["NOT_STARTED", "IN_PROGRESS", "COMPLETED"], required=True)
    parser.add_argument("--auditor", default=None)
    parser.add_argument("--report-url", default=None)
    parser.add_argument("--completed-at", default=None)
    parser.add_argument("--critical-open", type=int, default=0)
    parser.add_argument("--high-open", type=int, default=0)
    parser.add_argument("--medium-open", type=int, default=0)
    parser.add_argument("--low-open", type=int, default=0)
    parser.add_argument("--resolved-total", type=int, default=0)
    parser.add_argument("--out", default="docs/project/SECURITY_AUDIT_STATUS.json")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    out = root / args.out
    existing = _load_json(out)

    payload: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "project": existing.get("project", "Solarpunk-bitcoin"),
        "external_audit": {
            "status": args.status,
            "auditor": args.auditor,
            "report_url": args.report_url,
            "completed_at": args.completed_at,
        },
        "findings": {
            "critical_open": args.critical_open,
            "high_open": args.high_open,
            "medium_open": args.medium_open,
            "low_open": args.low_open,
            "resolved_total": args.resolved_total,
        },
        "notes": existing.get(
            "notes",
            "Mainnet expansion remains blocked until external audit is completed and findings policy is satisfied.",
        ),
    }

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"wrote: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

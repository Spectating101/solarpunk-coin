#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


REQUIRED_FIELDS = [
    "meter_id",
    "site_id",
    "window_start",
    "window_end",
    "surplus_kwh",
    "quality_score",
    "source",
    "attestor",
]


def _load_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _to_utc_iso(s: str) -> str:
    # Normalize Z to explicit UTC offset for deterministic outputs.
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    dt = datetime.fromisoformat(s)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()


def _record_hash(rec: Dict[str, Any]) -> str:
    canonical = json.dumps(rec, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _validate_and_normalize(payload: Dict[str, Any], min_quality: float) -> Dict[str, Any]:
    batch_id = str(payload.get("batch_id", "unknown_batch"))
    rows = payload.get("attestations", [])
    if not isinstance(rows, list):
        raise ValueError("`attestations` must be a list")

    accepted: List[Dict[str, Any]] = []
    rejected: List[Dict[str, Any]] = []

    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            rejected.append({"index": i, "reason": "record is not an object"})
            continue

        missing = [f for f in REQUIRED_FIELDS if f not in row]
        if missing:
            rejected.append({"index": i, "meter_id": row.get("meter_id"), "reason": f"missing fields: {','.join(missing)}"})
            continue

        try:
            surplus_kwh = float(row["surplus_kwh"])
            quality = float(row["quality_score"])
            if surplus_kwh <= 0:
                raise ValueError("surplus_kwh must be > 0")
            if not (0 <= quality <= 1):
                raise ValueError("quality_score must be in [0,1]")
            if quality < min_quality:
                raise ValueError(f"quality_score below threshold ({min_quality})")

            normalized = {
                "meter_id": str(row["meter_id"]),
                "site_id": str(row["site_id"]),
                "window_start": _to_utc_iso(str(row["window_start"])),
                "window_end": _to_utc_iso(str(row["window_end"])),
                "surplus_kwh": round(surplus_kwh, 6),
                "quality_score": round(quality, 6),
                "source": str(row["source"]),
                "attestor": str(row["attestor"]),
            }
            normalized["record_hash"] = _record_hash(normalized)
            accepted.append(normalized)
        except Exception as exc:
            rejected.append({"index": i, "meter_id": row.get("meter_id"), "reason": str(exc)})

    total_surplus = round(sum(x["surplus_kwh"] for x in accepted), 6)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "batch_id": batch_id,
        "min_quality_threshold": min_quality,
        "summary": {
            "input_records": len(rows),
            "accepted_records": len(accepted),
            "rejected_records": len(rejected),
            "total_surplus_kwh": total_surplus,
        },
        "accepted_attestations": accepted,
        "rejected_attestations": rejected,
    }


def _to_md(bundle: Dict[str, Any]) -> str:
    s = bundle.get("summary", {})
    lines: List[str] = []
    lines.append("# Meter Attestation Bundle")
    lines.append("")
    lines.append(f"- generated_at: `{bundle.get('generated_at')}`")
    lines.append(f"- batch_id: `{bundle.get('batch_id')}`")
    lines.append(f"- min_quality_threshold: `{bundle.get('min_quality_threshold')}`")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- input_records: `{s.get('input_records')}`")
    lines.append(f"- accepted_records: `{s.get('accepted_records')}`")
    lines.append(f"- rejected_records: `{s.get('rejected_records')}`")
    lines.append(f"- total_surplus_kwh: `{s.get('total_surplus_kwh')}`")
    lines.append("")
    lines.append("## Accepted (meter_id, surplus_kwh, record_hash)")
    lines.append("")
    accepted = bundle.get("accepted_attestations", [])
    if not accepted:
        lines.append("- none")
    else:
        for row in accepted:
            lines.append(
                f"- `{row.get('meter_id')}` | `{row.get('surplus_kwh')}` | `{row.get('record_hash')}`"
            )
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate and normalize meter attestations into a deterministic bundle.")
    parser.add_argument("--input", default="data/attestations/sample_meter_attestations.json")
    parser.add_argument("--out-json", default="state/attestations/latest_attestation_bundle.json")
    parser.add_argument("--out-md", default="docs/project/METER_ATTESTATION_BUNDLE.md")
    parser.add_argument("--min-quality", type=float, default=0.9)
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    payload = _load_json(root / args.input)
    bundle = _validate_and_normalize(payload, min_quality=args.min_quality)

    out_json = root / args.out_json
    out_md = root / args.out_md
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_md.parent.mkdir(parents=True, exist_ok=True)

    out_json.write_text(json.dumps(bundle, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(bundle), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

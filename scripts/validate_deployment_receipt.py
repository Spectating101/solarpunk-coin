#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


ADDR_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")
HASH_RE = re.compile(r"^0x[a-fA-F0-9]{64}$")


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _to_md(payload: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Deployment Receipt Validation")
    lines.append("")
    lines.append(f"- generated_at: `{payload.get('generated_at')}`")
    lines.append(f"- validation_passed: `{payload.get('validation_passed')}`")
    lines.append(f"- receipt_status: `{payload.get('receipt_status')}`")
    lines.append(f"- onchain_confirmed: `{payload.get('onchain_confirmed')}`")
    lines.append("")
    lines.append("## Checks")
    lines.append("")
    for k, v in payload.get("checks", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")
    lines.append("## Errors")
    lines.append("")
    errors = payload.get("errors", [])
    if errors:
        for err in errors:
            lines.append(f"- {err}")
    else:
        lines.append("- none")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate deployment receipt artifact for phase gates.")
    parser.add_argument("--input", default=None)
    parser.add_argument("--out-json", default="state/deployments/deployment_receipt_validation.json")
    parser.add_argument("--out-md", default="docs/project/DEPLOYMENT_RECEIPT_VALIDATION.md")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    input_path = args.input or "state/deployments/amoy_receipt.json"
    receipt = _load_json(root / input_path)

    contracts = receipt.get("contracts", {}) if isinstance(receipt, dict) else {}
    proof = receipt.get("proof", {}) if isinstance(receipt, dict) else {}

    checks = {
        "has_coin_address": bool(ADDR_RE.match(str(contracts.get("solarpunk_coin") or ""))),
        "has_option_address": bool(ADDR_RE.match(str(contracts.get("solarpunk_option") or ""))),
        "has_coin_tx_hash": bool(HASH_RE.match(str(proof.get("coin_deploy_tx_hash") or ""))),
        "has_option_tx_hash": bool(HASH_RE.match(str(proof.get("option_deploy_tx_hash") or ""))),
        "has_confirmed_flag": isinstance(proof.get("onchain_confirmed"), bool),
        "onchain_confirmed_true": bool(proof.get("onchain_confirmed") is True),
        "receipt_status_confirmed": str(receipt.get("receipt_status")) == "CONFIRMED",
    }

    errors: List[str] = []
    if not checks["has_coin_address"]:
        errors.append("Invalid or missing solarpunk_coin address.")
    if not checks["has_option_address"]:
        errors.append("Invalid or missing solarpunk_option address.")
    if not checks["has_coin_tx_hash"]:
        errors.append("Missing or invalid coin_deploy_tx_hash.")
    if not checks["has_option_tx_hash"]:
        errors.append("Missing or invalid option_deploy_tx_hash.")
    if not checks["has_confirmed_flag"]:
        errors.append("Missing boolean onchain_confirmed flag.")
    if not checks["onchain_confirmed_true"]:
        errors.append("onchain_confirmed must be true for expansion gate.")
    if not checks["receipt_status_confirmed"]:
        errors.append("receipt_status must be CONFIRMED.")

    passed = len(errors) == 0

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "validation_passed": passed,
        "receipt_status": receipt.get("receipt_status"),
        "onchain_confirmed": proof.get("onchain_confirmed"),
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
        print("strict validation failed: deployment receipt invalid")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

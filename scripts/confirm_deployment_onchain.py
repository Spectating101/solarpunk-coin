#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _rpc_call(url: str, method: str, params: List[Any]) -> Dict[str, Any]:
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))

def _rpc_chain_id(url: str) -> Optional[int]:
    try:
        data = _rpc_call(url, "eth_chainId", [])
        raw = data.get("result") if isinstance(data, dict) else None
        if isinstance(raw, str) and raw.startswith("0x"):
            return int(raw, 16)
    except Exception:
        return None
    return None


def _to_md(report: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# On-Chain Deployment Confirmation")
    lines.append("")
    lines.append(f"- generated_at: `{report.get('generated_at')}`")
    lines.append(f"- rpc_url: `{report.get('rpc_url')}`")
    if "rpc_chain_id" in report:
        lines.append(f"- rpc_chain_id: `{report.get('rpc_chain_id')}`")
    lines.append(f"- confirmation_passed: `{report.get('confirmation_passed')}`")
    lines.append("")
    lines.append("## Checks")
    lines.append("")
    for k, v in report.get("checks", {}).items():
        lines.append(f"- {k}: `{v}`")
    lines.append("")
    lines.append("## Errors")
    lines.append("")
    errs = report.get("errors", [])
    if errs:
        for e in errs:
            lines.append(f"- {e}")
    else:
        lines.append("- none")
    lines.append("")
    return "\n".join(lines)


def _extract_rpc_url(receipt: Dict[str, Any], explicit: Optional[str]) -> Optional[str]:
    if explicit:
        return explicit
    net_name = str(receipt.get("network", {}).get("name", "")).lower()
    if net_name == "amoy":
        return os.getenv("POLYGON_AMOY_RPC") or "https://rpc-amoy.polygon.technology/"
    if net_name == "sepolia":
        return os.getenv("SEPOLIA_RPC") or "https://rpc.sepolia.org"
    return None


def _tx_receipt(url: str, tx_hash: Optional[str]) -> Optional[Dict[str, Any]]:
    if not tx_hash:
        return None
    data = _rpc_call(url, "eth_getTransactionReceipt", [tx_hash])
    return data.get("result") if isinstance(data, dict) else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Confirm deployment tx hashes on-chain via RPC and update receipt.")
    parser.add_argument("--receipt", default="state/deployments/amoy_receipt.json")
    parser.add_argument("--rpc-url", default=None)
    parser.add_argument("--out-report-json", default="state/deployments/onchain_confirmation_report.json")
    parser.add_argument("--out-report-md", default="docs/project/ONCHAIN_CONFIRMATION_REPORT.md")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    receipt_path = root / args.receipt
    receipt = _load_json(receipt_path)

    rpc_url = _extract_rpc_url(receipt, args.rpc_url)
    if not rpc_url:
        print("No RPC URL available for receipt network.")
        return 2 if args.strict else 0

    contracts = receipt.get("contracts", {})
    proof = receipt.get("proof", {})
    coin_tx = proof.get("coin_deploy_tx_hash")
    option_tx = proof.get("option_deploy_tx_hash")

    checks: Dict[str, bool] = {
        "coin_receipt_found": False,
        "option_receipt_found": False,
        "coin_tx_success": False,
        "option_tx_success": False,
        "coin_contract_match": False,
        "option_contract_match": False,
    }
    errors: List[str] = []

    coin_r = None
    option_r = None
    rpc_chain_id = _rpc_chain_id(rpc_url)
    expected_chain_id = receipt.get("network", {}).get("chain_id")
    if rpc_chain_id is None:
        errors.append("RPC probe failed (could not read eth_chainId). Provide a working --rpc-url or set POLYGON_AMOY_RPC/SEPOLIA_RPC.")
    elif expected_chain_id and rpc_chain_id != expected_chain_id:
        errors.append(f"RPC chainId mismatch: expected {expected_chain_id}, got {rpc_chain_id}.")

    try:
        if rpc_chain_id is not None and not errors:
            coin_r = _tx_receipt(rpc_url, coin_tx)
            option_r = _tx_receipt(rpc_url, option_tx)
    except urllib.error.URLError as exc:
        errors.append(f"RPC connection failed: {exc}. Provide a working --rpc-url or set POLYGON_AMOY_RPC/SEPOLIA_RPC.")
    except Exception as exc:
        errors.append(f"RPC query failed: {exc}")

    if coin_r:
        checks["coin_receipt_found"] = True
        checks["coin_tx_success"] = str(coin_r.get("status", "")).lower() == "0x1"
        deployed_addr = str(coin_r.get("contractAddress") or "").lower()
        expected = str(contracts.get("solarpunk_coin") or "").lower()
        checks["coin_contract_match"] = bool(deployed_addr and expected and deployed_addr == expected)
    else:
        errors.append("Coin deployment receipt not found.")

    if option_r:
        checks["option_receipt_found"] = True
        checks["option_tx_success"] = str(option_r.get("status", "")).lower() == "0x1"
        deployed_addr = str(option_r.get("contractAddress") or "").lower()
        expected = str(contracts.get("solarpunk_option") or "").lower()
        checks["option_contract_match"] = bool(deployed_addr and expected and deployed_addr == expected)
    else:
        errors.append("Option deployment receipt not found.")

    if checks["coin_receipt_found"] and not checks["coin_tx_success"]:
        errors.append("Coin deployment tx status is not successful.")
    if checks["option_receipt_found"] and not checks["option_tx_success"]:
        errors.append("Option deployment tx status is not successful.")
    if checks["coin_receipt_found"] and not checks["coin_contract_match"]:
        errors.append("Coin deployment contract address does not match receipt.")
    if checks["option_receipt_found"] and not checks["option_contract_match"]:
        errors.append("Option deployment contract address does not match receipt.")

    passed = len(errors) == 0

    # Update receipt proof block.
    proof["onchain_confirmed"] = passed
    proof["confirmation_method"] = "rpc_receipt_check"
    proof["confirmed_at"] = datetime.now(timezone.utc).isoformat() if passed else None
    receipt["proof"] = proof
    receipt["receipt_status"] = "CONFIRMED" if passed else "PENDING_CONFIRMATION"

    warnings = [w for w in receipt.get("warnings", []) if w != "Receipt is not on-chain confirmed."]
    if not passed and "Receipt is not on-chain confirmed." not in warnings:
        warnings.append("Receipt is not on-chain confirmed.")
    receipt["warnings"] = warnings

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "rpc_url": rpc_url,
        "rpc_chain_id": rpc_chain_id,
        "confirmation_passed": passed,
        "checks": checks,
        "errors": errors,
    }

    receipt_path.write_text(json.dumps(receipt, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")

    out_json = root / args.out_report_json
    out_md = root / args.out_report_md
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(report), encoding="utf-8")

    print(f"updated: {receipt_path}")
    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")

    if args.strict and not passed:
        print("strict confirmation failed: on-chain deployment confirmation did not pass")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

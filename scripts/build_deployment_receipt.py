#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional


ADDR_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")
HASH_RE = re.compile(r"^0x[a-fA-F0-9]{64}$")


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8").strip()
    except Exception:
        return ""


def _read_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _norm_addr(addr: Optional[str]) -> Optional[str]:
    if not addr:
        return None
    a = addr.strip()
    return a if ADDR_RE.match(a) else None


def _norm_hash(h: Optional[str]) -> Optional[str]:
    if not h:
        return None
    x = h.strip()
    return x if HASH_RE.match(x) else None


def _to_md(payload: Dict[str, Any]) -> str:
    net = payload.get("network", {})
    c = payload.get("contracts", {})
    p = payload.get("proof", {})
    lines = [
        "# Deployment Receipt Summary",
        "",
        f"- generated_at: `{payload.get('generated_at')}`",
        f"- receipt_status: `{payload.get('receipt_status')}`",
        f"- network: `{net.get('name')}`",
        f"- chain_id: `{net.get('chain_id')}`",
        f"- onchain_confirmed: `{p.get('onchain_confirmed')}`",
        f"- confirmation_method: `{p.get('confirmation_method')}`",
        "",
        "## Contract Addresses",
        "",
        f"- solarpunk_coin: `{c.get('solarpunk_coin')}`",
        f"- solarpunk_option: `{c.get('solarpunk_option')}`",
        "",
        "## Deployment Tx Hashes",
        "",
        f"- coin_deploy_tx_hash: `{p.get('coin_deploy_tx_hash')}`",
        f"- option_deploy_tx_hash: `{p.get('option_deploy_tx_hash')}`",
        "",
        "## Explorer Links",
        "",
        f"- coin_contract_url: `{p.get('coin_contract_url')}`",
        f"- option_contract_url: `{p.get('option_contract_url')}`",
        f"- coin_tx_url: `{p.get('coin_tx_url')}`",
        f"- option_tx_url: `{p.get('option_tx_url')}`",
        "",
    ]

    warnings = payload.get("warnings", [])
    lines.append("## Warnings")
    lines.append("")
    if warnings:
        for w in warnings:
            lines.append(f"- {w}")
    else:
        lines.append("- none")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build deployment receipt artifact for phase-gate evidence.")
    parser.add_argument("--network", default="amoy")
    parser.add_argument("--chain-id", type=int, default=80002)
    parser.add_argument("--coin-address", default=None)
    parser.add_argument("--option-address", default=None)
    parser.add_argument("--coin-tx-hash", default=None)
    parser.add_argument("--option-tx-hash", default=None)
    parser.add_argument("--confirmed", action="store_true", help="Mark on-chain confirmed=true.")
    parser.add_argument("--confirmation-method", default="manual")
    parser.add_argument("--out-json", default="state/deployments/amoy_receipt.json")
    parser.add_argument("--out-md", default="docs/project/DEPLOYMENT_RECEIPT_SUMMARY.md")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]

    coin_art = _read_json(root / "state/deployments/solarpunk_coin_deploy.json")
    option_art = _read_json(root / "state/deployments/solarpunk_option_deploy.json")

    coin_addr = (
        _norm_addr(args.coin_address)
        or _norm_addr(coin_art.get("contract_address"))
        or _norm_addr(_read_text(root / ".testnet_address"))
    )
    option_addr = (
        _norm_addr(args.option_address)
        or _norm_addr(option_art.get("contract_address"))
        or _norm_addr(_read_text(root / ".pillar3_address"))
    )

    coin_tx = (
        _norm_hash(args.coin_tx_hash)
        or _norm_hash(coin_art.get("deploy_tx_hash"))
        or _norm_hash(_read_text(root / ".testnet_tx_hash"))
    )
    option_tx = (
        _norm_hash(args.option_tx_hash)
        or _norm_hash(option_art.get("deploy_tx_hash"))
        or _norm_hash(_read_text(root / ".pillar3_tx_hash"))
    )

    warnings = []
    if not coin_addr:
        warnings.append("Missing or invalid SolarPunkCoin address.")
    if not option_addr:
        warnings.append("Missing or invalid SolarPunkOption address.")
    if not coin_tx:
        warnings.append("Missing or invalid coin deploy tx hash.")
    if not option_tx:
        warnings.append("Missing or invalid option deploy tx hash.")
    if not args.confirmed:
        warnings.append("Receipt is not on-chain confirmed.")

    base = "https://amoy.polygonscan.com" if args.network.lower() == "amoy" else ""
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "receipt_status": "CONFIRMED" if args.confirmed and not warnings else ("PENDING_CONFIRMATION" if not args.confirmed else "DRAFT"),
        "network": {
            "name": args.network,
            "chain_id": args.chain_id,
        },
        "contracts": {
            "solarpunk_coin": coin_addr,
            "solarpunk_option": option_addr,
        },
        "proof": {
            "coin_deploy_tx_hash": coin_tx,
            "option_deploy_tx_hash": option_tx,
            "onchain_confirmed": bool(args.confirmed),
            "confirmation_method": args.confirmation_method,
            "confirmed_at": datetime.now(timezone.utc).isoformat() if args.confirmed else None,
            "coin_contract_url": f"{base}/address/{coin_addr}" if base and coin_addr else None,
            "option_contract_url": f"{base}/address/{option_addr}" if base and option_addr else None,
            "coin_tx_url": f"{base}/tx/{coin_tx}" if base and coin_tx else None,
            "option_tx_url": f"{base}/tx/{option_tx}" if base and option_tx else None,
        },
        "warnings": warnings,
    }

    out_json = root / args.out_json
    out_md = root / args.out_md
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_md.parent.mkdir(parents=True, exist_ok=True)

    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    out_md.write_text(_to_md(payload), encoding="utf-8")

    print(f"wrote: {out_json}")
    print(f"wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

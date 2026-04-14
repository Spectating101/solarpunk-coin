#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional


EXPLORER_BASE = {
    "amoy": "https://amoy.polygonscan.com",
    "sepolia": "https://sepolia.etherscan.io",
    "holesky": "https://holesky.etherscan.io",
}


def _load_json(path: Path) -> Dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _addr(contracts: Dict[str, Any], name: str) -> Optional[str]:
    value = contracts.get(name, {})
    if isinstance(value, dict):
        return value.get("address")
    return None


def _tx_count(interactions: Dict[str, Any]) -> int:
    if not isinstance(interactions, dict):
        return 0
    return sum(1 for _, v in interactions.items() if isinstance(v, str) and v.startswith("0x"))


def _write_addresses_md(path: Path, network: str, contracts: Dict[str, str], published: bool) -> None:
    base = EXPLORER_BASE.get(network)
    def row(contract: str, addr: str) -> str:
        if not published:
            return f"| {network.capitalize()} | {contract} | PENDING | PENDING |"
        url = f"{base}/address/{addr}" if base else "PENDING"
        return f"| {network.capitalize()} | {contract} | `{addr}` | {url} |"

    lines = [
        "# CONTRACT ADDRESSES",
        "",
        "## Public testnet addresses",
        "",
        f"Status: **{'Published' if published else 'Pending publish'}**",
        "",
        f"Network target: `{network}`",
        "",
        "| Network | Contract | Address | Explorer |",
        "|---|---|---|---|",
        row("ProtocolTreasury", contracts.get("ProtocolTreasury", "PENDING")),
        row("SolarPunkCoin", contracts.get("SolarPunkCoin", "PENDING")),
        row("SolarPunkOption", contracts.get("SolarPunkOption", "PENDING")),
        row("MockUSDC (if deployed)", contracts.get("MockUSDC", "PENDING")),
        "",
        "## Notes",
        "",
        "- Do not claim public deployment until these links are filled and verifiable.",
        "- Keep this file in sync with deployment receipts and interaction proof artifacts.",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _write_status_md(
    path: Path,
    network: str,
    deploy_exists: bool,
    interaction_exists: bool,
    tx_count: int,
    deploy_path: Path,
    interaction_path: Path,
) -> None:
    done = deploy_exists and interaction_exists and tx_count > 0
    lines = [
        "# Public Proof Status",
        "",
        f"- generated_at: `{datetime.now(timezone.utc).isoformat()}`",
        f"- network: `{network}`",
        f"- m1_public_proof_ready: `{done}`",
        "",
        "## Checks",
        "",
        f"- full_deploy_receipt_exists: `{deploy_exists}` ({deploy_path})",
        f"- interaction_proof_exists: `{interaction_exists}` ({interaction_path})",
        f"- interaction_tx_count: `{tx_count}`",
        "",
        "## Interpretation",
        "",
    ]
    if done:
        lines.append("- M1 public proof artifacts are complete for this network.")
    else:
        lines.append("- M1 public proof is incomplete. Missing deploy receipt, interaction proof, or tx evidence.")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish/refresh M1 public proof surfaces.")
    parser.add_argument("--network", default="amoy")
    parser.add_argument("--deploy-receipt", default=None)
    parser.add_argument("--interaction-proof", default=None)
    parser.add_argument("--out-addresses", default="CONTRACT_ADDRESSES.md")
    parser.add_argument("--out-status", default="docs/project/PUBLIC_PROOF_STATUS.md")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    deploy_path = (
        root / args.deploy_receipt
        if args.deploy_receipt
        else root / "state" / "deployments" / f"{args.network}_full_deploy.json"
    )
    interaction_path = (
        root / args.interaction_proof
        if args.interaction_proof
        else root / "state" / "deployments" / f"{args.network}_interaction_proof.json"
    )

    deploy_data = _load_json(deploy_path) if deploy_path.exists() else {}
    interaction_data = _load_json(interaction_path) if interaction_path.exists() else {}

    contracts_obj = deploy_data.get("contracts", {}) if isinstance(deploy_data, dict) else {}
    contracts = {
        "MockUSDC": _addr(contracts_obj, "MockUSDC") or "PENDING",
        "ProtocolTreasury": _addr(contracts_obj, "ProtocolTreasury") or "PENDING",
        "SolarPunkCoin": _addr(contracts_obj, "SolarPunkCoin") or "PENDING",
        "SolarPunkOption": _addr(contracts_obj, "SolarPunkOption") or "PENDING",
    }

    tx_count = _tx_count(interaction_data.get("interactions", {}))
    published = deploy_path.exists() and interaction_path.exists() and tx_count > 0

    out_addresses = root / args.out_addresses
    out_status = root / args.out_status
    out_addresses.parent.mkdir(parents=True, exist_ok=True)
    out_status.parent.mkdir(parents=True, exist_ok=True)

    _write_addresses_md(out_addresses, args.network, contracts, published)
    _write_status_md(
        out_status,
        args.network,
        deploy_path.exists(),
        interaction_path.exists(),
        tx_count,
        deploy_path,
        interaction_path,
    )

    print(f"wrote: {out_addresses}")
    print(f"wrote: {out_status}")

    if args.strict and not published:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

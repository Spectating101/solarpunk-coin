from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from spk_v1.chain import read_live_snapshot, resolve_deploy_block
from spk_v1.counterparties import enrich_payment_ledger, merge_counterparties

DEFAULT_RPC = "https://ethereum-sepolia-rpc.publicnode.com"


def runtime_paths(repo_root: str | Path) -> dict[str, Path]:
    root = Path(repo_root).resolve()
    return {
        "repo_root": root,
        "runtime": root / "state" / "runtime" / "spk_v1.json",
        "public": root / "frontend" / "public" / "spk_v1.json",
    }


def read_runtime(repo_root: str | Path) -> dict[str, Any] | None:
    path = runtime_paths(repo_root)["runtime"]
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def write_runtime(payload: dict[str, Any], repo_root: str | Path) -> Path:
    paths = runtime_paths(repo_root)
    body = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    for target in (paths["runtime"], paths["public"]):
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body, encoding="utf-8")
    return paths["runtime"]


def merge_runtime(patch: dict[str, Any], repo_root: str | Path) -> Path:
    current = read_runtime(repo_root) or {}
    merged = {**current, **patch, "updated_at": _utc_now()}
    return write_runtime(merged, repo_root)


def sync_runtime(
    repo_root: str | Path,
    *,
    rpc_url: str | None = None,
) -> dict[str, Any]:
    runtime = read_runtime(repo_root)
    if not runtime or not runtime.get("contracts", {}).get("solar_punk_coin"):
        raise FileNotFoundError("Missing state/runtime/spk_v1.json with SPK v1 contracts")

    rpc = rpc_url or os.environ.get("SEPOLIA_RPC_URL") or DEFAULT_RPC
    deploy_block = resolve_deploy_block(runtime, rpc)
    runtime_with_block = {**runtime, "deploy_block": deploy_block}
    snapshot = read_live_snapshot(runtime_with_block, rpc)

    counterparties = merge_counterparties(runtime.get("counterparties"))
    chain_index = dict(snapshot["chain_index"])
    chain_index["payment_ledger"] = enrich_payment_ledger(
        chain_index.get("payment_ledger") or [],
        counterparties,
    )

    status = runtime.get("status") if runtime.get("status") == "operating" else runtime.get("status") or "genesis_complete"
    patch = {
        "status": status,
        "deploy_block": deploy_block,
        "synced_at": _utc_now(),
        "counterparties": counterparties,
        "on_chain": snapshot["on_chain"],
        "counterparty_balances_spk": snapshot["counterparty_balances_spk"],
        "chain_index": chain_index,
        "genesis": {
            **(runtime.get("genesis") or {}),
            "metrics": snapshot["metrics"],
            "note": "Synced from on-chain state.",
        },
    }
    merge_runtime(patch, repo_root)
    return {**runtime, **patch}


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

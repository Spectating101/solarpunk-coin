"""Operator health checks (gas, sync freshness, ledger coherence)."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from web3 import Web3

from spk_v1.chain import connect_web3
from spk_v1.runtime import read_runtime, runtime_paths

DEFAULT_RPC = "https://ethereum-sepolia-rpc.publicnode.com"
DEFAULT_MIN_ETH = 0.01
DEFAULT_MAX_SYNC_AGE_HOURS = 168.0


def foundation_health_path(repo_root: Path) -> Path:
    return Path(repo_root) / "state" / "foundation" / "health.json"


def _sync_age_hours(synced_at: str | None) -> float | None:
    if not synced_at:
        return None
    try:
        ts = synced_at.replace("Z", "+00:00")
        synced = datetime.fromisoformat(ts)
        if synced.tzinfo is None:
            synced = synced.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        return (now - synced).total_seconds() / 3600.0
    except (ValueError, TypeError):
        return None


def build_operator_health(
    runtime: dict[str, Any],
    *,
    operator_eth: float | None = None,
    operator_spk: float | None = None,
    min_eth: float = DEFAULT_MIN_ETH,
    max_sync_age_hours: float = DEFAULT_MAX_SYNC_AGE_HOURS,
    foundation_status_exists: bool | None = None,
) -> dict[str, Any]:
    deployer = runtime.get("deployer") or (runtime.get("roles") or {}).get("currency_operator")
    synced_at = runtime.get("synced_at") or runtime.get("updated_at")
    sync_age = _sync_age_hours(synced_at)
    metrics = (runtime.get("genesis") or {}).get("metrics") or {}
    chain_index = runtime.get("chain_index") or {}
    payments = metrics.get("network_payment_count") or chain_index.get("payment_count")

    gas_ok = operator_eth is None or operator_eth >= min_eth
    sync_ok = sync_age is None or sync_age <= max_sync_age_hours

    actions: list[str] = []
    if operator_eth is not None and not gas_ok:
        actions.append(f"Top up Sepolia ETH on deployer (need ≥{min_eth}, have {operator_eth:.6f})")
    if sync_age is not None and not sync_ok:
        actions.append(f"Run npm run foundation:sync (stale {sync_age:.0f}h)")
    if gas_ok and sync_ok:
        actions.append("Ready for npm run foundation:cycle")

    return {
        "ok": gas_ok and sync_ok,
        "at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "deployer": deployer,
        "operator_eth": operator_eth,
        "operator_eth_min": min_eth,
        "operator_spk": operator_spk,
        "synced_at": synced_at,
        "sync_age_hours": round(sync_age, 2) if sync_age is not None else None,
        "network_payment_count": payments,
        "total_supply_spk": (runtime.get("on_chain") or {}).get("total_supply_spk"),
        "peg_enabled": (runtime.get("monetary_policy") or {}).get("peg_enabled"),
        "foundation_status_json": foundation_status_exists,
        "actions": actions,
    }


def fetch_operator_balances(
    runtime: dict[str, Any],
    rpc_url: str,
) -> tuple[float, float | None]:
    w3 = connect_web3(rpc_url)

    deployer = runtime.get("deployer") or (runtime.get("roles") or {}).get("currency_operator")
    if not deployer:
        raise ValueError("Runtime missing deployer address")

    eth_wei = w3.eth.get_balance(Web3.to_checksum_address(deployer))
    eth = float(eth_wei) / 10**18

    spk_addr = (runtime.get("contracts") or {}).get("solar_punk_coin")
    spk_balance: float | None = None
    if spk_addr:
        from spk_v1.abis import load_abi

        token = w3.eth.contract(address=Web3.to_checksum_address(spk_addr), abi=load_abi("SolarPunkCoin"))
        spk_balance = float(token.functions.balanceOf(Web3.to_checksum_address(deployer)).call()) / 10**18

    return eth, spk_balance


def run_operator_health(
    repo_root: str | Path,
    *,
    rpc_url: str | None = None,
    min_eth: float | None = None,
    max_sync_age_hours: float | None = None,
    write_json: bool = True,
) -> dict[str, Any]:
    root = Path(repo_root)
    runtime = read_runtime(root)
    if not runtime:
        raise FileNotFoundError(f"Missing runtime at {runtime_paths(root)['runtime']}")

    rpc = rpc_url or os.environ.get("SEPOLIA_RPC") or os.environ.get("SEPOLIA_RPC_URL") or DEFAULT_RPC
    min_eth_val = min_eth if min_eth is not None else float(os.environ.get("FOUNDATION_MIN_OPERATOR_ETH", DEFAULT_MIN_ETH))
    max_age = (
        max_sync_age_hours
        if max_sync_age_hours is not None
        else float(os.environ.get("FOUNDATION_MAX_SYNC_AGE_HOURS", DEFAULT_MAX_SYNC_AGE_HOURS))
    )

    eth, spk = fetch_operator_balances(runtime, rpc)
    status_path = root / "state" / "foundation" / "status.json"
    report = build_operator_health(
        runtime,
        operator_eth=eth,
        operator_spk=spk,
        min_eth=min_eth_val,
        max_sync_age_hours=max_age,
        foundation_status_exists=status_path.exists(),
    )

    if write_json:
        out = foundation_health_path(root)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    return report


def health_exit_code(report: dict[str, Any]) -> int:
    eth = report.get("operator_eth")
    min_eth = report.get("operator_eth_min", DEFAULT_MIN_ETH)
    if eth is not None and eth < min_eth:
        return 1
    return 0 if report.get("ok") else 1

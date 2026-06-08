"""Runtime and foundation consistency checks."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from spk_v1.counterparties import merge_counterparties
from spk_v1.foundation import foundation_paths
from spk_v1.runtime import read_runtime, runtime_paths


def validate_runtime(runtime: dict[str, Any]) -> list[str]:
    issues: list[str] = []

    if runtime.get("schema") != "SPK_V1_RUNTIME":
        issues.append("schema should be SPK_V1_RUNTIME")

    contracts = runtime.get("contracts") or {}
    for key in ("solar_punk_coin", "currency_system"):
        if not contracts.get(key):
            issues.append(f"contracts.{key} missing")

    if not runtime.get("deployer"):
        issues.append("deployer missing")

    policy = runtime.get("monetary_policy") or {}
    if policy.get("kwh_per_spk") is None:
        issues.append("monetary_policy.kwh_per_spk missing")

    metrics = (runtime.get("genesis") or {}).get("metrics") or {}
    chain_index = runtime.get("chain_index") or {}
    ledger = chain_index.get("payment_ledger") or []
    metric_count = metrics.get("network_payment_count")
    index_count = chain_index.get("payment_count")

    if metric_count is not None and index_count is not None and int(metric_count) != int(index_count):
        issues.append(
            f"payment count mismatch: genesis.metrics={metric_count} chain_index={index_count}"
        )
    if ledger and index_count is not None and len(ledger) != int(index_count):
        issues.append(f"ledger length {len(ledger)} != chain_index.payment_count {index_count}")

    if runtime.get("status") == "operating" and not (runtime.get("synced_at") or runtime.get("updated_at")):
        issues.append("operating status without synced_at")

    counterparties = merge_counterparties(runtime.get("counterparties"))
    for cid, info in counterparties.items():
        if not info.get("address"):
            issues.append(f"counterparties.{cid} missing address")
        if not info.get("role"):
            issues.append(f"counterparties.{cid} missing role")

    on_chain = runtime.get("on_chain") or {}
    if on_chain and on_chain.get("total_supply_spk") is None:
        issues.append("on_chain.total_supply_spk missing after sync")

    return issues


def validate_foundation_artifacts(repo_root: Path) -> list[str]:
    issues: list[str] = []
    paths = foundation_paths(repo_root)
    if not paths["status_json"].exists():
        issues.append(f"missing {paths['status_json'].relative_to(repo_root)}")
    if not paths["status_md"].exists():
        issues.append(f"missing {paths['status_md'].relative_to(repo_root)}")
    health = repo_root / "state" / "foundation" / "health.json"
    if not health.exists():
        issues.append("missing state/foundation/health.json (run foundation:health)")
    return issues


def run_validate(repo_root: str | Path, *, check_foundation: bool = True) -> dict[str, Any]:
    root = Path(repo_root)
    runtime = read_runtime(root)
    if not runtime:
        raise FileNotFoundError(f"Missing runtime at {runtime_paths(root)['runtime']}")

    issues = validate_runtime(runtime)
    if check_foundation:
        issues.extend(validate_foundation_artifacts(root))

    return {
        "ok": len(issues) == 0,
        "issues": issues,
        "runtime_path": str(runtime_paths(root)["runtime"]),
        "payment_count": (runtime.get("genesis") or {}).get("metrics", {}).get("network_payment_count"),
        "synced_at": runtime.get("synced_at"),
    }

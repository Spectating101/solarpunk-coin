from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from spk_v1.evidence import export_evidence_markdown
from spk_v1.foundation import build_foundation_snapshot, export_foundation_status
from spk_v1.lake import export_data_lake
from spk_v1.runtime import read_runtime, runtime_paths, sync_runtime


def default_repo_root() -> Path:
    env = os.environ.get("SPK_V1_REPO_ROOT")
    if env:
        return Path(env).resolve()
    # spk_v1/src/spk_v1/service.py -> repo root
    return Path(__file__).resolve().parents[3]


def get_runtime(repo_root: str | Path | None = None) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    runtime = read_runtime(root)
    if not runtime:
        raise FileNotFoundError(f"Missing runtime at {runtime_paths(root)['runtime']}")
    return runtime


def get_metrics_summary(repo_root: str | Path | None = None) -> dict[str, Any]:
    runtime = get_runtime(repo_root)
    root = Path(repo_root or default_repo_root())
    return {
        "status": runtime.get("status"),
        "network": runtime.get("network"),
        "chain_id": runtime.get("chain_id"),
        "synced_at": runtime.get("synced_at"),
        "contracts": runtime.get("contracts"),
        "on_chain": runtime.get("on_chain"),
        "metrics": (runtime.get("genesis") or {}).get("metrics"),
        "payment_count": (runtime.get("chain_index") or {}).get("payment_count"),
        "paths": {k: str(v) for k, v in runtime_paths(root).items()},
    }


def list_payments(
    repo_root: str | Path | None = None,
    *,
    limit: int = 100,
    payment_kind: str | None = None,
) -> dict[str, Any]:
    runtime = get_runtime(repo_root)
    rows = list((runtime.get("chain_index") or {}).get("payment_ledger") or [])
    if payment_kind:
        kind = payment_kind.upper()
        rows = [row for row in rows if str(row.get("payment_kind", "")).upper() == kind]
    rows = rows[-limit:] if limit else rows
    return {"returned": len(rows), "rows": rows}


def run_sync(repo_root: str | Path | None = None, *, rpc_url: str | None = None) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    runtime = sync_runtime(root, rpc_url=rpc_url)
    return {
        "ok": True,
        "payments_indexed": (runtime.get("chain_index") or {}).get("payment_count"),
        "synced_at": runtime.get("synced_at"),
        "total_supply_spk": (runtime.get("on_chain") or {}).get("total_supply_spk"),
    }


def get_foundation_snapshot(repo_root: str | Path | None = None) -> dict[str, Any]:
    runtime = get_runtime(repo_root)
    return build_foundation_snapshot(runtime)


def run_foundation_export(repo_root: str | Path | None = None) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    runtime = get_runtime(root)
    result = export_foundation_status(runtime, root)
    return {
        "ok": True,
        "status_md": result["status_md"],
        "status_json": result["status_json"],
        "snapshot": result["snapshot"],
    }


def run_sync_and_foundation(
    repo_root: str | Path | None = None, *, rpc_url: str | None = None
) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    sync_result = run_sync(root, rpc_url=rpc_url)
    foundation_result = run_foundation_export(root)
    return {**sync_result, **foundation_result}


def run_export_evidence(repo_root: str | Path | None = None) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    runtime = get_runtime(root)
    out = root / "thesis_package" / "SPK_V1_EVIDENCE.md"
    path = export_evidence_markdown(runtime, out)
    return {"ok": True, "path": str(path)}


def run_export_lake(repo_root: str | Path | None = None, *, out_root: str | Path) -> dict[str, Any]:
    root = Path(repo_root or default_repo_root())
    runtime = get_runtime(root)
    summary = export_data_lake(runtime, out_root, source_repo=root)
    return {"ok": True, **summary}

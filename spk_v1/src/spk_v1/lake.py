from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def export_data_lake(runtime: dict[str, Any], out_root: str | Path, *, source_repo: str | Path | None = None) -> dict[str, Any]:
    """Export runtime + ledger for research lakes (Sharpe, thesis tooling, etc.)."""
    out = Path(out_root).resolve()
    out.mkdir(parents=True, exist_ok=True)

    runtime_dst = out / "spk_v1_runtime.json"
    ledger_dst = out / "spk_v1_payment_ledger.jsonl"
    manifest_dst = out / "manifest.json"

    runtime_dst.write_text(json.dumps(runtime, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    ledger = (runtime.get("chain_index") or {}).get("payment_ledger") or []
    with ledger_dst.open("w", encoding="utf-8") as f:
        for row in ledger:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    ops_src = None
    if source_repo is not None:
        candidate = Path(source_repo).resolve() / "state" / "runtime" / "spk_v1_operations.jsonl"
        if candidate.exists():
            shutil.copy2(candidate, out / "spk_v1_operations.jsonl")
            ops_src = str(candidate)

    summary = {
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "source_repo": str(source_repo) if source_repo else None,
        "operations_source": ops_src,
        "network": runtime.get("network"),
        "chain_id": runtime.get("chain_id"),
        "spk_address": (runtime.get("contracts") or {}).get("solar_punk_coin"),
        "currency_address": (runtime.get("contracts") or {}).get("currency_system"),
        "total_supply_spk": (runtime.get("on_chain") or {}).get("total_supply_spk"),
        "network_payment_count": ((runtime.get("genesis") or {}).get("metrics") or {}).get("network_payment_count"),
        "payment_ledger_rows": len(ledger),
        "runtime_synced_at": runtime.get("synced_at"),
    }
    manifest_dst.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return summary

from __future__ import annotations

import json
from pathlib import Path

from spk_v1.lake import export_data_lake
from spk_v1.runtime import read_runtime, write_runtime
from spk_v1.service import get_metrics_summary, list_payments, run_export_evidence


def test_library_pipeline_on_fixture_repo(tmp_path: Path, monkeypatch):
    """Library-only path: write runtime -> metrics -> payments -> evidence -> lake."""
    repo = tmp_path / "repo"
    runtime = {
        "status": "operating",
        "explorer_base": "https://sepolia.etherscan.io",
        "contracts": {"solar_punk_coin": "0xabc"},
        "on_chain": {"total_supply_spk": 42},
        "genesis": {"metrics": {"network_payment_count": 1, "total_settled_spk": 10}},
        "chain_index": {
            "payment_count": 1,
            "payment_ledger": [{"payment_id": 1, "payment_kind": "GOODS", "spk": 10, "payee": "0xp", "tx_hash": "0xt"}],
        },
    }
    write_runtime(runtime, repo)
    monkeypatch.setenv("SPK_V1_REPO_ROOT", str(repo))

    assert read_runtime(repo)["on_chain"]["total_supply_spk"] == 42
    assert get_metrics_summary(repo)["payment_count"] == 1
    assert list_payments(repo)["returned"] == 1

    evidence = run_export_evidence(repo)
    assert Path(evidence["path"]).exists()

    lake_root = tmp_path / "lake"
    summary = export_data_lake(read_runtime(repo), lake_root, source_repo=repo)
    assert summary["payment_ledger_rows"] == 1
    assert (lake_root / "spk_v1_runtime.json").exists()
    assert (lake_root / "spk_v1_payment_ledger.jsonl").read_text(encoding="utf-8").strip().startswith("{")

from __future__ import annotations

import json
from pathlib import Path

from spk_v1.validate import run_validate, validate_runtime


def _good_runtime() -> dict:
    return {
        "schema": "SPK_V1_RUNTIME",
        "status": "operating",
        "synced_at": "2026-06-08T00:00:00Z",
        "deployer": "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
        "contracts": {
            "solar_punk_coin": "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128",
            "currency_system": "0x520162252F9B94824417678525FFd69145014970",
        },
        "monetary_policy": {"kwh_per_spk": "1"},
        "on_chain": {"total_supply_spk": 100},
        "genesis": {"metrics": {"network_payment_count": 2}},
        "chain_index": {
            "payment_count": 2,
            "payment_ledger": [
                {"payment_id": 1, "spk": 1},
                {"payment_id": 2, "spk": 2},
            ],
        },
        "counterparties": {
            "merchant": {"address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "role": "GOODS"},
        },
    }


def test_validate_runtime_clean():
    assert validate_runtime(_good_runtime()) == []


def test_validate_runtime_detects_mismatch():
    runtime = _good_runtime()
    runtime["genesis"]["metrics"]["network_payment_count"] = 99
    issues = validate_runtime(runtime)
    assert any("payment count mismatch" in issue for issue in issues)


def test_run_validate_repo(tmp_path: Path):
    repo = tmp_path / "repo"
    runtime_dir = repo / "state" / "runtime"
    runtime_dir.mkdir(parents=True)
    (runtime_dir / "spk_v1.json").write_text(json.dumps(_good_runtime()), encoding="utf-8")
    foundation = repo / "docs" / "foundation"
    foundation.mkdir(parents=True)
    (foundation / "FOUNDATION_STATUS.md").write_text("# ok\n", encoding="utf-8")
    (repo / "state" / "foundation").mkdir(parents=True)
    (repo / "state" / "foundation" / "status.json").write_text("{}", encoding="utf-8")
    (repo / "state" / "foundation" / "health.json").write_text("{}", encoding="utf-8")

    result = run_validate(repo)
    assert result["ok"] is True

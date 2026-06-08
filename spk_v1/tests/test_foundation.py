from __future__ import annotations

import json
from pathlib import Path

from spk_v1.foundation import build_foundation_snapshot, export_foundation_status


def _sample_runtime() -> dict:
    return {
        "status": "operating",
        "network": "sepolia",
        "chain_id": 11155111,
        "synced_at": "2026-06-08T00:00:00Z",
        "monetary_policy": {
            "kwh_per_spk": "1",
            "peg_enabled": False,
            "reference_usd_per_kwh": "0.05",
            "primary_use": "network_circulation",
            "secondary_sink": "optional_energy_redemption",
        },
        "contracts": {
            "solar_punk_coin": "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128",
            "currency_system": "0x520162252F9B94824417678525FFd69145014970",
        },
        "on_chain": {"total_supply_spk": 100.0, "cumulative_surplus_kwh": 120},
        "genesis": {
            "metrics": {
                "network_payment_count": 3,
                "total_settled_spk": 40.0,
                "total_redeemed_spk": 5.0,
                "circulation_share_percent": 88.0,
            }
        },
        "chain_index": {
            "payment_ledger": [
                {"payment_id": 1, "payment_kind": "SERVICE", "spk": 12, "tx_hash": "0xold"},
                {"payment_id": 3, "payment_kind": "GOODS", "spk": 5, "tx_hash": "0xabc"},
            ]
        },
    }


def test_build_foundation_snapshot():
    snap = build_foundation_snapshot(_sample_runtime())
    assert snap["anchor"]["kwh_per_spk"] == 1.0
    assert snap["usd_translation"]["implied_supply_usd"] == 5.0
    assert snap["circulation"]["network_payment_count"] == 3
    assert snap["constraints"]["settlement"]["total_settled_spk"] == 40.0
    assert snap["latest_payment"]["payment_id"] == 3


def test_export_foundation_status(tmp_path: Path):
    repo = tmp_path / "repo"
    runtime = _sample_runtime()
    result = export_foundation_status(runtime, repo)
    md = Path(result["status_md"])
    js = Path(result["status_json"])
    assert md.exists()
    assert js.exists()
    assert "Foundation Status" in md.read_text(encoding="utf-8")
    payload = json.loads(js.read_text(encoding="utf-8"))
    assert payload["circulation"]["total_supply_spk"] == 100.0

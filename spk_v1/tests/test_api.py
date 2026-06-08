from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from spk_v1.api import app


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    repo = tmp_path / "repo"
    runtime_dir = repo / "state" / "runtime"
    runtime_dir.mkdir(parents=True)
    runtime = {
        "status": "operating",
        "network": "sepolia",
        "chain_id": 11155111,
        "synced_at": "2026-06-07T00:00:00Z",
        "contracts": {
            "solar_punk_coin": "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128",
            "currency_system": "0x520162252F9B94824417678525FFd69145014970",
        },
        "on_chain": {"total_supply_spk": 100.0},
        "genesis": {"metrics": {"network_payment_count": 2, "total_settled_spk": 50}},
        "chain_index": {
            "payment_count": 2,
            "payment_ledger": [
                {"payment_id": 1, "payment_kind": "SERVICE", "spk": 12, "payee": "0xabc", "tx_hash": "0x1"},
                {"payment_id": 2, "payment_kind": "GOODS", "spk": 38, "payee": "0xdef", "tx_hash": "0x2"},
            ],
        },
    }
    (runtime_dir / "spk_v1.json").write_text(json.dumps(runtime), encoding="utf-8")
    monkeypatch.setenv("SPK_V1_REPO_ROOT", str(repo))
    return TestClient(app)


def test_health(client: TestClient):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["ok"] is True


def test_metrics_and_payments(client: TestClient):
    metrics = client.get("/v1/metrics")
    assert metrics.status_code == 200
    assert metrics.json()["on_chain"]["total_supply_spk"] == 100.0

    payments = client.get("/v1/payments", params={"payment_kind": "SERVICE"})
    body = payments.json()
    assert body["returned"] == 1
    assert body["rows"][0]["payment_kind"] == "SERVICE"


def test_foundation_endpoints(client: TestClient):
    snap = client.get("/v1/foundation")
    assert snap.status_code == 200
    body = snap.json()
    assert body["circulation"]["total_supply_spk"] == 100.0

    exported = client.post("/v1/foundation/export")
    assert exported.status_code == 200
    assert Path(exported.json()["status_md"]).exists()


def test_export_evidence(client: TestClient):
    res = client.post("/v1/export/evidence")
    assert res.status_code == 200
    path = Path(res.json()["path"])
    assert path.exists()
    assert "SPK v1" in path.read_text(encoding="utf-8")

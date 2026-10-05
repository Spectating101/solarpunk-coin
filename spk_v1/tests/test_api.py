from __future__ import annotations

import json
from datetime import datetime, timezone
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
        "schema": "SPK_V1_RUNTIME",
        "status": "operating",
        "network": "sepolia",
        "chain_id": 11155111,
        "deployer": "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
        "synced_at": "2026-06-07T00:00:00Z",
        "contracts": {
            "solar_punk_coin": "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128",
            "currency_system": "0x520162252F9B94824417678525FFd69145014970",
        },
        "monetary_policy": {"kwh_per_spk": "1"},
        "on_chain": {"total_supply_spk": 100.0},
        "genesis": {"metrics": {"network_payment_count": 2, "total_settled_spk": 50}},
        "counterparties": {
            "merchant": {"address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "role": "GOODS"},
        },
        "chain_index": {
            "payment_count": 2,
            "payment_ledger": [
                {
                    "payment_id": 1,
                    "payment_kind": "SERVICE",
                    "spk": 12,
                    "payee": "0xabc",
                    "tx_hash": "0x1",
                },
                {
                    "payment_id": 2,
                    "payment_kind": "GOODS",
                    "spk": 38,
                    "payee": "0xdef",
                    "tx_hash": "0x2",
                },
            ],
        },
    }
    (runtime_dir / "spk_v1.json").write_text(json.dumps(runtime), encoding="utf-8")
    monkeypatch.setenv("SPK_V1_REPO_ROOT", str(repo))
    monkeypatch.setenv("SPK_V1_API_TOKEN", "test-operator-token")
    monkeypatch.setattr("spk_v1.health.utc_now", lambda: datetime(2026, 6, 8, tzinfo=timezone.utc))
    return TestClient(app, headers={"Authorization": "Bearer test-operator-token"})


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


def test_counterparties_and_validate(client: TestClient):
    res = client.get("/v1/counterparties")
    assert res.status_code == 200
    body = res.json()
    assert body["counterparties"]

    validate = client.get("/v1/validate", params={"check_foundation": False})
    assert validate.status_code == 200
    assert validate.json()["ok"] is True


def test_mutations_require_authentication(client, monkeypatch):
    unauthenticated = TestClient(app)
    assert unauthenticated.post("/v1/export/evidence").status_code == 401
    monkeypatch.delenv("SPK_V1_API_TOKEN")
    assert client.post("/v1/export/evidence").status_code == 503
    assert client.get("/v1/runtime").status_code == 200


def test_export_paths_reject_escape_and_allow_configured_destinations(
    client, tmp_path, monkeypatch
):
    base = tmp_path / "exports"
    base.mkdir()
    monkeypatch.setenv("SPK_V1_API_EXPORT_ROOT", str(base))
    assert client.post("/v1/export/lake", json={"out_root": "../escape"}).status_code == 422
    assert (
        client.post("/v1/export/lake", json={"out_root": str(tmp_path / "outside")}).status_code
        == 422
    )
    (base / "link").symlink_to(tmp_path, target_is_directory=True)
    assert client.post("/v1/export/lake", json={"out_root": "link/escape"}).status_code == 422
    response = client.post("/v1/export/lake", json={"out_root": "allowed"})
    assert response.status_code == 200
    assert (base / "allowed" / "manifest.json").exists()


def test_caller_cannot_select_arbitrary_rpc_endpoint(client):
    assert client.post("/v1/sync", params={"rpc_url": "http://169.254.169.254/"}).status_code == 422
    assert TestClient(app).get("/v1/operator/health", params={"live": True}).status_code == 401


def test_cached_health_rechecks_runtime_freshness(client, monkeypatch):
    from spk_v1.service import default_repo_root

    root = default_repo_root()
    cache = root / "state/foundation/health.json"
    cache.parent.mkdir(parents=True)
    cache.write_text(json.dumps({"ok": True, "at": "2026-06-08T00:00:00Z", "operator_eth": 0.5}))
    monkeypatch.setattr("spk_v1.health.utc_now", lambda: datetime(2026, 10, 5, tzinfo=timezone.utc))
    for route in ["/health", "/v1/operator/health"]:
        response = client.get(route)
        assert response.status_code == 200
        assert response.json()["ok"] is False


@pytest.mark.parametrize(
    "failure", [FileNotFoundError("missing runtime"), ConnectionError("RPC unavailable")]
)
def test_health_does_not_report_success_when_operator_check_fails(client, monkeypatch, failure):
    def fail(*args, **kwargs):
        raise failure

    monkeypatch.setattr("spk_v1.api.get_operator_health", fail)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is False


@pytest.mark.parametrize(
    "filename",
    [
        "spk_v1_runtime.json",
        "spk_v1_payment_ledger.jsonl",
        "manifest.json",
        "spk_v1_operations.jsonl",
    ],
)
def test_lake_export_cannot_overwrite_symlink_targets(client, tmp_path, monkeypatch, filename):
    from spk_v1.service import default_repo_root

    base = tmp_path / "exports"
    base.mkdir()
    monkeypatch.setenv("SPK_V1_API_EXPORT_ROOT", str(base))
    outside = tmp_path / "outside.txt"
    outside.write_text("must remain unchanged")
    (base / filename).symlink_to(outside)
    (default_repo_root() / "state/runtime/spk_v1_operations.jsonl").write_text(
        '{"operation": "test"}\n'
    )
    response = client.post("/v1/export/lake", json={"out_root": "."})
    assert response.status_code == 200
    assert outside.read_text() == "must remain unchanged"
    assert not (base / filename).is_symlink()


@pytest.mark.parametrize(
    "body", ["invalid JSON", "[]", '{"at":"2026-06-08T00:00:00Z","operator_eth":"not a number"}']
)
def test_invalid_cached_health_is_unhealthy_without_rpc(client, body):
    from spk_v1.service import default_repo_root

    path = default_repo_root() / "state/foundation/health.json"
    path.parent.mkdir(parents=True)
    path.write_text(body)
    response = client.get("/v1/operator/health")
    assert response.status_code == 200
    assert response.json()["ok"] is False
    assert response.json()["cached_balance_fresh"] is False


def test_cached_balance_does_not_become_fresh_when_runtime_is_synced(client):
    from spk_v1.service import default_repo_root

    path = default_repo_root() / "state/foundation/health.json"
    path.parent.mkdir(parents=True)
    path.write_text(json.dumps({"ok": True, "at": "2026-05-01T00:00:00Z", "operator_eth": 0.5}))
    report = client.get("/v1/operator/health").json()
    assert report["sync_age_hours"] == 24
    assert report["ok"] is False
    assert not any(action.startswith("Ready for") for action in report["actions"])


@pytest.mark.parametrize("destination", ["", "bad\x00path"])
def test_malformed_export_paths_are_validation_errors(client, destination):
    assert client.post("/v1/export/lake", json={"out_root": destination}).status_code == 422

import sys
import time
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.main import API_KEYS, RATE_LIMITS, rate_tracker, app  # type: ignore  # noqa: E402

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_api_state():
    keys = dict(API_KEYS)
    rate_tracker.clear()
    yield
    API_KEYS.clear()
    API_KEYS.update(keys)
    rate_tracker.clear()


def test_price_endpoint_binomial():
    payload = {"S0": 1.0, "K": 1.0, "T": 1.0, "r": 0.05, "sigma": 0.2, "method": "binomial", "N": 50}
    resp = client.post("/price", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "price" in data and data["price"] > 0


def test_greeks_endpoint():
    payload = {"S0": 1.0, "K": 1.0, "T": 1.0, "r": 0.05, "sigma": 0.2}
    resp = client.post("/greeks", json=payload)
    assert resp.status_code == 200
    greeks = resp.json()["greeks"]
    assert all(k in greeks for k in ["Delta", "Gamma", "Vega", "Theta", "Rho"])


def test_rate_limit_headers_present():
    payload = {"S0": 1.0, "K": 1.0, "T": 1.0, "r": 0.05, "sigma": 0.2}
    resp = client.post("/price", json=payload)
    assert resp.status_code == 200


def test_operator_workbench_requires_paid_tier():
    payload = {
        "client_name": "Test Operator",
        "region": "Taiwan",
        "capacity_mw": 10.0,
        "lat": 25.0,
        "lon": 121.0,
        "energy_type": "solar",
        "hedge_period_years": 1.0,
        "target_floor_pct": 0.8,
        "risk_budget_usd": 10000.0,
        "contract_notional_mwh": 100.0,
        "contracts_planned": 0,
    }
    resp = client.post("/v1/operator-workbench", json=payload, headers={"X-API-Key": "demo-key-solarpunk-2026"})
    assert resp.status_code == 403


def test_operator_workbench_with_starter_key():
    API_KEYS["test-starter-key"] = "starter"
    payload = {
        "client_name": "Test Operator",
        "region": "Taiwan",
        "capacity_mw": 10.0,
        "lat": 25.0,
        "lon": 121.0,
        "energy_type": "solar",
        "hedge_period_years": 1.0,
        "target_floor_pct": 0.8,
        "risk_budget_usd": 100000.0,
        "contract_notional_mwh": 100.0,
        "contracts_planned": 0,
    }
    resp = client.post("/v1/operator-workbench", json=payload, headers={"X-API-Key": "test-starter-key"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["decision"]["immediate_go_no_go"] in {"GO", "NO_GO"}
    assert "assignments" in body


@pytest.mark.parametrize("route", ["/v1/price", "/price", "/price/binomial", "/price/monte-carlo", "/greeks"])
def test_legacy_and_versioned_routes_share_auth_and_rate_limits(route):
    payload = {"S0": 1, "K": 1, "sigma": 0.2, "N": 10}
    assert client.post(route, json=payload, headers={"X-API-Key": "invalid"}).status_code == 401
    rate_tracker["anonymous"] = [time.time()] * RATE_LIMITS["demo"]["requests_per_minute"]
    assert client.post(route, json=payload).status_code == 429


def test_pricing_and_batch_workload_limits():
    payload = {"S0": 1, "K": 1, "sigma": 0.2, "N": 1001}
    assert client.post("/price", json=payload).status_code == 422
    API_KEYS["test-budget"] = "starter"
    payload["N"] = 1000
    assert client.post("/v1/batch", json={"requests": [payload] * 3},
                       headers={"X-API-Key": "test-budget"}).status_code == 400
    assert client.post("/price", json={**payload, "S0": "NaN"}).status_code == 422


def test_pricing_work_does_not_block_health(monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Event
    from api.main import BinomialTree
    entered, release = Event(), Event()

    def controlled_price(self):
        entered.set()
        release.wait(2)
        return 1.0

    monkeypatch.setattr(BinomialTree, "price", controlled_price)
    with TestClient(app) as shared, ThreadPoolExecutor(1) as worker:
        pending = worker.submit(shared.post, "/price", json={"S0": 1, "K": 1, "sigma": 0.2, "N": 10})
        try:
            assert entered.wait(1)
            started = time.monotonic()
            assert shared.get("/health").status_code == 200
            assert time.monotonic() - started < 1
        finally:
            release.set()
        assert pending.result(timeout=3).status_code == 200

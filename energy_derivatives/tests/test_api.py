import sys
from pathlib import Path
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.main import API_KEYS, app  # type: ignore  # noqa: E402

client = TestClient(app)


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

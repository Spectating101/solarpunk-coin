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
def reset_api_state(monkeypatch):
    monkeypatch.delenv("SPK_RATE_LIMIT_DB", raising=False)
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


def test_operator_workbench_with_starter_key(monkeypatch):
    monkeypatch.setattr("api.main.load_solar_parameters", lambda *args: {"S0": 50.0, "sigma": 0.35, "capacity_factor": 0.2})
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


def test_risk_assessment_greeks_match_the_put_hedge(monkeypatch):
    from api.main import GreeksCalculator

    API_KEYS["risk-test"] = "starter"
    monkeypatch.setattr("api.main.load_solar_parameters", lambda *args: {"S0": 50.0, "sigma": 0.35, "capacity_factor": 0.2})
    response = client.post("/v1/risk-assessment", headers={"X-API-Key": "risk-test"},
                           json={"capacity_mw": 10, "lat": 25, "lon": 121, "target_floor_pct": 0.8})
    assert response.status_code == 200
    expected = GreeksCalculator(S0=50, K=40, T=1, r=0.05, sigma=0.35, N=200, payoff_type="put").compute_all_greeks()
    assert response.json()["greeks"] == pytest.approx(expected)
    assert response.json()["greeks"]["Delta"] < 0


@pytest.mark.parametrize("route, fields", [
    ("/v1/risk-assessment", {"capacity_mw": 1, "target_floor_pct": -1}),
    ("/v1/risk-assessment", {"capacity_mw": 1, "target_floor_pct": 1.01}),
    ("/v1/data/wind", {"rotor_diameter_m": -1}),
    ("/v1/data/wind", {"hub_height_m": 0}),
    ("/v1/data/hydro", {"catchment_area_km2": -1}),
    ("/v1/data/hydro", {"fall_height_m": 0}),
])
def test_invalid_physical_inputs_are_rejected_before_loading_data(monkeypatch, route, fields):
    def unexpected(*args, **kwargs):
        pytest.fail("invalid request reached a data loader")

    API_KEYS["validation-test"] = "starter"
    monkeypatch.setattr("api.main.load_solar_parameters", unexpected)
    monkeypatch.setattr("api.main.WindDataLoader", unexpected)
    monkeypatch.setattr("api.main.HydroDataLoader", unexpected)
    response = client.post(route, headers={"X-API-Key": "validation-test"}, json={"lat": 25, "lon": 121, **fields})
    assert response.status_code == 422


@pytest.mark.parametrize("route", ["/price", "/v1/price", "/price/monte-carlo", "/greeks"])
def test_nonfinite_calculation_results_return_client_errors(monkeypatch, route):
    monkeypatch.setattr("api.main.BinomialTree.price", lambda self: float("inf"))
    monkeypatch.setattr("api.main.MonteCarloSimulator.confidence_interval", lambda self: (1.0, float("nan"), 2.0))
    monkeypatch.setattr("api.main.GreeksCalculator.compute_all_greeks", lambda self: {"Delta": float("inf")})
    response = client.post(route, json={"S0": 50, "K": 50, "sigma": 0.35, "N": 10})
    assert response.status_code == 400


def test_shared_quota_survives_worker_restart(tmp_path, monkeypatch):
    monkeypatch.setenv("SPK_RATE_LIMIT_DB", str(tmp_path / "quota.db"))
    monkeypatch.setattr("api.main.BinomialTree.price", lambda self: 1.0)
    payload = {"S0": 50, "K": 50, "sigma": 0.35, "N": 10}
    for _ in range(10):
        assert client.post("/v1/price", json=payload).status_code == 200
    rate_tracker.clear()
    with TestClient(app) as restarted:
        assert restarted.post("/price", json=payload).status_code == 429


def test_shared_quota_usage_and_fail_closed(tmp_path, monkeypatch):
    path = tmp_path / "quota.db"
    monkeypatch.setenv("SPK_RATE_LIMIT_DB", str(path))
    assert client.get("/v1/usage").json()["requests_today"] == 1
    assert client.get("/v1/usage").json()["requests_today"] == 2
    monkeypatch.setenv("SPK_RATE_LIMIT_DB", str(tmp_path))
    assert client.get("/v1/usage").status_code == 503
    assert rate_tracker == {}


def test_unknown_configured_tier_does_not_grant_paid_access():
    API_KEYS["misconfigured-key"] = "unknown-tier"
    response = client.post("/v1/risk-assessment", headers={"X-API-Key": "misconfigured-key"},
                           json={"capacity_mw": 10, "lat": 25, "lon": 121})
    assert response.status_code == 403


@pytest.mark.parametrize("route", ["/v1/risk-assessment", "/v1/decision-pack", "/v1/operator-workbench"])
def test_revenue_uses_explicit_market_units_not_weather_claim_value(monkeypatch, route):
    API_KEYS["unit-test"] = "starter"
    monkeypatch.setattr("api.main.load_solar_parameters", lambda *args: {"S0": 0.07, "sigma": 0.35, "capacity_factor": 0.9})
    response = client.post(route, headers={"X-API-Key": "unit-test"}, json={
        "capacity_mw": 10, "lat": 25, "lon": 121, "spot_price_per_mwh": 80, "capacity_factor": 0.3,
    })
    assert response.status_code == 200
    body = response.json()
    expected_mwh = 10 * 8760 * 0.3
    if route == "/v1/risk-assessment":
        assert body["assessment"]["estimated_annual_mwh"] == expected_mwh
        assert body["assessment"]["estimated_annual_revenue_usd"] == expected_mwh * 80
        assert body["assessment"]["spot_price_per_mwh"] == 80
    else:
        assert body["summary"]["annual_mwh_estimate"] == expected_mwh
        assert body["summary"]["spot_price_per_mwh"] == 80
    assert body["model_assumptions"]["spot_price_basis"] == "operator_supplied"
    assert body["model_assumptions"]["capacity_factor_basis"] == "operator_supplied"


def test_default_revenue_assumptions_are_identified_as_modeled(monkeypatch):
    API_KEYS["default-test"] = "starter"
    monkeypatch.setattr("api.main.load_solar_parameters", lambda *args: {"S0": 0.07, "sigma": 0.35})
    response = client.post("/v1/risk-assessment", headers={"X-API-Key": "default-test"},
                           json={"capacity_mw": 10, "lat": 25, "lon": 121})
    assumptions = response.json()["model_assumptions"]
    assert assumptions["spot_price_per_mwh"] == 50
    assert assumptions["spot_price_basis"] == "modeled_default"
    assert assumptions["capacity_factor_basis"] == "modeled_default"


@pytest.mark.parametrize("field, value", [("spot_price_per_mwh", 0), ("capacity_factor", 0), ("capacity_factor", 1.1)])
def test_invalid_revenue_assumptions_fail_validation(field, value):
    API_KEYS["bad-input-test"] = "starter"
    response = client.post("/v1/risk-assessment", headers={"X-API-Key": "bad-input-test"},
                           json={"capacity_mw": 10, "lat": 25, "lon": 121, field: value})
    assert response.status_code == 422


@pytest.mark.parametrize("route", ["/v1/data/solar", "/v1/data/wind", "/v1/data/hydro"])
def test_nonfinite_data_calibration_returns_client_error(monkeypatch, route):
    from types import SimpleNamespace

    invalid = {"sigma": float("nan")}
    monkeypatch.setattr("api.main.load_solar_parameters", lambda *args: invalid)
    monkeypatch.setattr("api.main.WindDataLoader", lambda **kwargs: SimpleNamespace(load_parameters=lambda: invalid))
    monkeypatch.setattr("api.main.HydroDataLoader", lambda **kwargs: SimpleNamespace(load_parameters=lambda: invalid))
    assert client.post(route, json={"lat": 25, "lon": 121}).status_code == 400

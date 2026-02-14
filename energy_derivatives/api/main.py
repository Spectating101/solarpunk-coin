import os
import time
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

import numpy as np

# Import core library modules
from spk_derivatives.binomial import BinomialTree
from spk_derivatives.monte_carlo import MonteCarloSimulator
from spk_derivatives.sensitivities import GreeksCalculator
from spk_derivatives.data_loader_wind import WindDataLoader
from spk_derivatives.data_loader_hydro import HydroDataLoader
from spk_derivatives.data_loader_nasa import load_solar_parameters

# --- Configuration ---

API_KEYS = {}
DEMO_KEY = "demo-key-solarpunk-2026"
RATE_LIMITS = {
    "demo": {"requests_per_minute": 10, "requests_per_day": 100},
    "starter": {"requests_per_minute": 60, "requests_per_day": 5000},
    "pro": {"requests_per_minute": 300, "requests_per_day": 50000},
}

# Load API keys from environment
for key in os.environ.get("SPK_API_KEYS", "").split(","):
    key = key.strip()
    if key:
        tier = os.environ.get(f"SPK_TIER_{key}", "starter")
        API_KEYS[key] = tier

# Always include demo key
API_KEYS[DEMO_KEY] = "demo"

# Rate limit tracking
rate_tracker: Dict[str, list] = defaultdict(list)

# --- App ---

app = FastAPI(
    title="SolarPunk Energy Derivatives API",
    description="""
## Pricing Engine for Renewable Energy Derivatives

Price solar, wind, and hydro energy options using physics-calibrated models.
Built on NASA POWER satellite data with institutional-grade pricing methods.

### Models Available
- **Binomial Tree** - Exact lattice pricing (fast, precise)
- **Monte Carlo** - Simulation-based pricing with confidence intervals
- **Mean-Reversion** - Ornstein-Uhlenbeck for energy-specific dynamics
- **Jump-Diffusion** - Merton model for price spike events

### Data Sources
- NASA POWER API (global solar irradiance)
- NASA MERRA-2 (wind speed, precipitation)

### Quick Start
Use the demo API key: `demo-key-solarpunk-2026`
```
curl -X POST https://api.solarpunk.energy/v1/price \\
  -H "X-API-Key: demo-key-solarpunk-2026" \\
  -H "Content-Type: application/json" \\
  -d '{"S0": 50, "K": 55, "sigma": 0.35}'
```
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth & Rate Limiting ---

def check_rate_limit(api_key: str, tier: str):
    now = time.time()
    limits = RATE_LIMITS.get(tier, RATE_LIMITS["demo"])

    # Clean old entries
    rate_tracker[api_key] = [t for t in rate_tracker[api_key] if now - t < 86400]

    # Check daily limit
    if len(rate_tracker[api_key]) >= limits["requests_per_day"]:
        raise HTTPException(status_code=429, detail=f"Daily limit ({limits['requests_per_day']}) exceeded. Upgrade your plan.")

    # Check per-minute limit
    recent = [t for t in rate_tracker[api_key] if now - t < 60]
    if len(recent) >= limits["requests_per_minute"]:
        raise HTTPException(status_code=429, detail=f"Rate limit ({limits['requests_per_minute']}/min) exceeded. Slow down or upgrade.")

    rate_tracker[api_key].append(now)


async def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key is None:
        # Allow unauthenticated access with demo limits
        check_rate_limit("anonymous", "demo")
        return {"key": "anonymous", "tier": "demo"}

    tier = API_KEYS.get(x_api_key)
    if tier is None:
        raise HTTPException(status_code=401, detail="Invalid API key")

    check_rate_limit(x_api_key, tier)
    return {"key": x_api_key, "tier": tier}

# --- Data Models ---

class PricingRequest(BaseModel):
    S0: float = Field(..., description="Spot price ($/MWh for energy)", gt=0)
    K: float = Field(..., description="Strike price", gt=0)
    T: float = Field(1.0, description="Time to expiry (years)", gt=0)
    r: float = Field(0.05, description="Risk-free rate")
    sigma: float = Field(..., description="Annualized volatility", gt=0)
    method: str = Field("binomial", description="Pricing method: binomial, monte-carlo")
    payoff_type: str = Field("call", description="Option type: call or put")
    N: int = Field(100, description="Tree steps / simulation paths", ge=10, le=10000)

class GreeksRequest(BaseModel):
    S0: float = Field(..., gt=0)
    K: float = Field(..., gt=0)
    T: float = Field(1.0, gt=0)
    r: float = Field(0.05)
    sigma: float = Field(..., gt=0)
    N: int = Field(200, ge=10, le=10000)

class RiskAssessmentRequest(BaseModel):
    capacity_mw: float = Field(..., description="Plant capacity in MW", gt=0)
    lat: float = Field(..., description="Latitude", ge=-90, le=90)
    lon: float = Field(..., description="Longitude", ge=-180, le=180)
    energy_type: str = Field("solar", description="Energy type: solar, wind, hydro")
    hedge_period_years: float = Field(1.0, description="Hedge duration in years", gt=0)
    target_floor_pct: float = Field(0.8, description="Revenue floor as % of expected (0.0-1.0)")

class BatchPricingRequest(BaseModel):
    requests: List[PricingRequest] = Field(..., max_length=50)

class DecisionPackRequest(BaseModel):
    client_name: str = Field("Operator", description="Client/operator display name")
    region: str = Field("unknown", description="Region label for reporting")
    capacity_mw: float = Field(..., description="Plant capacity in MW", gt=0)
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    energy_type: str = Field("solar", description="solar, wind, hydro")
    hedge_period_years: float = Field(1.0, gt=0)
    target_floor_pct: float = Field(0.8, ge=0.1, le=1.0)
    risk_budget_usd: float = Field(50000.0, gt=0)
    contract_notional_mwh: float = Field(100.0, gt=0)
    contracts_planned: int = Field(0, ge=0)

class WindParams(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    rotor_diameter_m: float = 80.0
    hub_height_m: float = 80.0

class HydroParams(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    catchment_area_km2: float = 1000.0
    fall_height_m: float = 50.0

class SolarParams(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

# --- Public Endpoints ---

@app.get("/", response_class=HTMLResponse)
async def root():
    return """<!DOCTYPE html>
<html><head><title>SolarPunk Energy Derivatives API</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,system-ui,sans-serif;background:#0a0a0a;color:#e0e0e0;line-height:1.6}
.hero{text-align:center;padding:80px 20px 40px;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)}
h1{font-size:2.5em;margin-bottom:10px;background:linear-gradient(90deg,#00d2ff,#3a7bd5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:#888;font-size:1.2em;margin-bottom:30px}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.85em;margin:4px}
.live{background:#1a3a1a;color:#4ade80;border:1px solid #4ade80}
.beta{background:#3a2a1a;color:#fbbf24;border:1px solid #fbbf24}
.container{max-width:900px;margin:0 auto;padding:40px 20px}
.card{background:#1a1a2e;border:1px solid #2a2a4e;border-radius:12px;padding:24px;margin:16px 0}
.card h3{color:#3a7bd5;margin-bottom:8px}
code{background:#111;padding:2px 6px;border-radius:4px;font-size:0.9em;color:#4ade80}
pre{background:#111;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0;color:#ccc}
.pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin:20px 0}
.tier{background:#1a1a2e;border:1px solid #2a2a4e;border-radius:12px;padding:24px;text-align:center}
.tier.featured{border-color:#3a7bd5;box-shadow:0 0 20px rgba(58,123,213,0.2)}
.price{font-size:2em;font-weight:bold;color:#3a7bd5;margin:8px 0}
.price small{font-size:0.4em;color:#888}
ul{list-style:none;padding:0}
li{padding:4px 0;color:#aaa}
li:before{content:"\\2713 ";color:#4ade80}
a{color:#3a7bd5;text-decoration:none}
a:hover{text-decoration:underline}
.cta{display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#00d2ff,#3a7bd5);color:#fff;border-radius:8px;font-weight:bold;margin:8px;text-decoration:none}
.cta:hover{opacity:0.9;text-decoration:none}
</style></head><body>
<div class="hero">
<h1>SolarPunk Energy Derivatives API</h1>
<p class="sub">Price renewable energy options with physics-calibrated models</p>
<span class="badge live">API Online</span>
<span class="badge beta">v1.0</span>
<br><br>
<a href="/docs" class="cta">Interactive Docs</a>
<a href="/redoc" class="cta" style="background:#2a2a4e">API Reference</a>
</div>
<div class="container">
<div class="card">
<h3>Try It Now (No Signup Required)</h3>
<pre>curl -X POST /v1/price \\
  -H "Content-Type: application/json" \\
  -d '{"S0": 50, "K": 55, "sigma": 0.35}'</pre>
<p>Or use the demo key for higher limits: <code>demo-key-solarpunk-2026</code></p>
</div>

<div class="card">
<h3>What This Does</h3>
<p>SolarPunk prices <strong>energy derivatives</strong> - financial instruments that protect solar farms,
wind operators, and hydro plants from revenue volatility. We use NASA satellite data to calibrate
location-specific risk models, then price options using institutional-grade methods.</p>
<ul>
<li>Solar, Wind, Hydro derivative pricing</li>
<li>NASA POWER + MERRA-2 satellite calibration</li>
<li>Binomial trees, Monte Carlo, mean-reversion models</li>
<li>Greeks (Delta, Gamma, Vega, Theta, Rho)</li>
<li>Location-specific risk assessment for any coordinates</li>
<li>Batch pricing for portfolio analysis</li>
</ul>
</div>

<h2 style="text-align:center;margin:30px 0 10px">Pricing</h2>
<div class="pricing">
<div class="tier">
<h3>Demo</h3>
<div class="price">Free</div>
<ul>
<li>10 requests/minute</li>
<li>100 requests/day</li>
<li>All pricing models</li>
<li>No signup needed</li>
</ul>
</div>
<div class="tier featured">
<h3>Starter</h3>
<div class="price">$99<small>/month</small></div>
<ul>
<li>60 requests/minute</li>
<li>5,000 requests/day</li>
<li>All pricing models</li>
<li>NASA data endpoints</li>
<li>Email support</li>
</ul>
</div>
<div class="tier">
<h3>Pro</h3>
<div class="price">$499<small>/month</small></div>
<ul>
<li>300 requests/minute</li>
<li>50,000 requests/day</li>
<li>Batch pricing (50/req)</li>
<li>Risk assessment reports</li>
<li>Priority support</li>
</ul>
</div>
</div>

<div class="card">
<h3>Endpoints</h3>
<ul>
<li><code>POST /v1/price</code> - Price an energy option</li>
<li><code>POST /v1/greeks</code> - Compute option Greeks</li>
<li><code>POST /v1/batch</code> - Batch price up to 50 options</li>
<li><code>POST /v1/risk-assessment</code> - Full risk report for a plant</li>
<li><code>POST /v1/decision-pack</code> - GO/NO_GO + prioritized operator actions</li>
<li><code>POST /v1/operator-workbench</code> - Decision desk payload for weekly execution</li>
<li><code>POST /v1/data/solar</code> - NASA solar calibration data</li>
<li><code>POST /v1/data/wind</code> - NASA wind calibration data</li>
<li><code>POST /v1/data/hydro</code> - NASA hydro calibration data</li>
<li><code>GET /health</code> - Health check</li>
</ul>
</div>

<div class="card" style="text-align:center">
<h3>Built for the Energy Transition</h3>
<p style="color:#888">Renewable energy producers lose $500M+ annually to price volatility they can't hedge.
SolarPunk gives them the tools Wall Street won't.</p>
<br>
<a href="mailto:s1133958@mail.yzu.edu.tw" class="cta">Contact Us</a>
<a href="https://github.com/Spectating101/solarpunk-coin" class="cta" style="background:#2a2a4e">GitHub</a>
</div>
</div>
</body></html>"""

# --- V1 API Endpoints ---

@app.post("/v1/price")
async def price_option_v1(req: PricingRequest, auth: dict = Depends(verify_api_key)):
    try:
        if req.method == "binomial":
            tree = BinomialTree(
                S0=req.S0, K=req.K, T=req.T, r=req.r, sigma=req.sigma,
                N=req.N, payoff_type=req.payoff_type
            )
            price = tree.price()
            return {"model": "BinomialTree", "price": price, "parameters": req.model_dump(), "tier": auth["tier"]}
        elif req.method in ("monte-carlo", "monte_carlo", "mc"):
            sim = MonteCarloSimulator(
                S0=req.S0, K=req.K, T=req.T, r=req.r, sigma=req.sigma,
                num_simulations=min(req.N * 100, 100000), payoff_type=req.payoff_type
            )
            price, lower, upper = sim.confidence_interval()
            return {"model": "MonteCarlo", "price": price, "ci_95": [lower, upper], "parameters": req.model_dump(), "tier": auth["tier"]}
        else:
            raise HTTPException(status_code=400, detail=f"Unknown method: {req.method}. Use 'binomial' or 'monte-carlo'.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/v1/greeks")
async def compute_greeks_v1(req: GreeksRequest, auth: dict = Depends(verify_api_key)):
    try:
        calc = GreeksCalculator(
            S0=req.S0, K=req.K, T=req.T, r=req.r, sigma=req.sigma,
            pricing_method="binomial", N=req.N
        )
        greeks = calc.compute_all_greeks()
        return {"greeks": greeks, "parameters": req.model_dump(), "tier": auth["tier"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/v1/batch")
async def batch_price_v1(req: BatchPricingRequest, auth: dict = Depends(verify_api_key)):
    if auth["tier"] == "demo" and len(req.requests) > 5:
        raise HTTPException(status_code=403, detail="Demo tier limited to 5 items per batch. Upgrade to Starter or Pro.")

    results = []
    for i, item in enumerate(req.requests):
        try:
            tree = BinomialTree(
                S0=item.S0, K=item.K, T=item.T, r=item.r, sigma=item.sigma,
                N=item.N, payoff_type=item.payoff_type
            )
            results.append({"index": i, "price": tree.price(), "parameters": item.model_dump()})
        except Exception as e:
            results.append({"index": i, "error": str(e)})

    return {"results": results, "count": len(results), "tier": auth["tier"]}

@app.post("/v1/risk-assessment")
async def risk_assessment_v1(req: RiskAssessmentRequest, auth: dict = Depends(verify_api_key)):
    if auth["tier"] == "demo":
        raise HTTPException(status_code=403, detail="Risk assessment requires Starter or Pro tier.")

    try:
        # Get location-specific parameters from NASA
        if req.energy_type == "solar":
            params = load_solar_parameters(req.lat, req.lon)
        elif req.energy_type == "wind":
            loader = WindDataLoader(lat=req.lat, lon=req.lon)
            params = loader.load_parameters()
        elif req.energy_type == "hydro":
            loader = HydroDataLoader(lat=req.lat, lon=req.lon)
            params = loader.load_parameters()
        else:
            raise HTTPException(status_code=400, detail="energy_type must be solar, wind, or hydro")

        sigma = params.get("sigma", params.get("annual_volatility", 0.35))
        S0 = params.get("S0", params.get("spot_price", 50.0))
        K = S0 * req.target_floor_pct

        # Price the hedge
        tree = BinomialTree(S0=S0, K=K, T=req.hedge_period_years, r=0.05, sigma=sigma, N=200, payoff_type="put")
        hedge_price = tree.price()

        # Calculate Greeks
        calc = GreeksCalculator(S0=S0, K=K, T=req.hedge_period_years, r=0.05, sigma=sigma, pricing_method="binomial", N=200)
        greeks = calc.compute_all_greeks()

        # Estimate annual generation and revenue
        capacity_factor = params.get("capacity_factor", 0.20)
        annual_mwh = req.capacity_mw * 8760 * capacity_factor
        annual_revenue = annual_mwh * S0
        hedge_cost = hedge_price * annual_mwh
        protected_revenue = annual_revenue * req.target_floor_pct

        clean_params = {k: float(v) if isinstance(v, (int, float, np.floating, np.integer)) else str(v)
                        for k, v in params.items() if not hasattr(v, 'to_dict') and not hasattr(v, '__len__')}

        return {
            "assessment": {
                "location": {"lat": req.lat, "lon": req.lon},
                "energy_type": req.energy_type,
                "capacity_mw": req.capacity_mw,
                "estimated_annual_mwh": round(annual_mwh, 0),
                "estimated_annual_revenue_usd": round(annual_revenue, 0),
                "calibrated_volatility": round(sigma, 4),
                "spot_price_per_mwh": round(S0, 2),
            },
            "hedge": {
                "type": "Put option (revenue floor)",
                "strike_pct": req.target_floor_pct,
                "strike_price": round(K, 2),
                "period_years": req.hedge_period_years,
                "premium_per_mwh": round(hedge_price, 4),
                "total_hedge_cost_usd": round(hedge_cost, 0),
                "cost_as_pct_of_revenue": round((hedge_cost / annual_revenue) * 100, 2),
                "protected_revenue_usd": round(protected_revenue, 0),
            },
            "greeks": greeks,
            "calibration": clean_params,
            "tier": auth["tier"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")


@app.post("/v1/decision-pack")
async def decision_pack_v1(req: DecisionPackRequest, auth: dict = Depends(verify_api_key)):
    if auth["tier"] == "demo":
        raise HTTPException(status_code=403, detail="Decision pack requires Starter or Pro tier.")

    try:
        if req.energy_type == "solar":
            params = load_solar_parameters(req.lat, req.lon)
        elif req.energy_type == "wind":
            params = WindDataLoader(lat=req.lat, lon=req.lon).load_parameters()
        elif req.energy_type == "hydro":
            params = HydroDataLoader(lat=req.lat, lon=req.lon).load_parameters()
        else:
            raise HTTPException(status_code=400, detail="energy_type must be solar, wind, or hydro")

        sigma = float(params.get("sigma", params.get("annual_volatility", 0.35)))
        S0 = float(params.get("S0", params.get("spot_price", 50.0)))
        K = S0 * req.target_floor_pct

        tree = BinomialTree(
            S0=S0,
            K=K,
            T=req.hedge_period_years,
            r=0.05,
            sigma=sigma,
            N=200,
            payoff_type="put",
        )
        premium_per_mwh = float(tree.price())

        capacity_factor = float(params.get("capacity_factor", 0.20))
        annual_mwh = float(req.capacity_mw * 8760 * capacity_factor)
        target_hedged_mwh = annual_mwh * req.target_floor_pct
        recommended_contracts = int(np.ceil(target_hedged_mwh / req.contract_notional_mwh))
        contracts_eval = req.contracts_planned if req.contracts_planned > 0 else recommended_contracts
        total_hedge_cost = premium_per_mwh * req.contract_notional_mwh * contracts_eval
        budget_fit = "within_budget" if total_hedge_cost <= req.risk_budget_usd else "over_budget"

        covered_mwh = contracts_eval * req.contract_notional_mwh
        coverage_gap_ratio = max(0.0, (target_hedged_mwh - covered_mwh) / max(target_hedged_mwh, 1.0))

        score = 100
        if budget_fit == "over_budget":
            score -= 25
        if coverage_gap_ratio > 0.15:
            score -= 12
        elif coverage_gap_ratio > 0.05:
            score -= 5
        if sigma > 1.0:
            score -= 10
        if sigma > 1.5:
            score -= 8
        operating_score = int(max(0, min(100, score)))

        risk_band = "normal"
        if budget_fit == "over_budget" or coverage_gap_ratio > 0.15:
            risk_band = "high"
        elif sigma > 1.0:
            risk_band = "elevated"

        actions: List[Dict[str, Any]] = []
        if budget_fit == "over_budget":
            actions.append(
                {
                    "priority": "P0",
                    "owner": "Treasury",
                    "action": "Reduce contracts or increase risk budget before execution approval.",
                    "reason": "Projected hedge cost exceeds stated budget.",
                }
            )
        if coverage_gap_ratio > 0.05:
            actions.append(
                {
                    "priority": "P1",
                    "owner": "Risk Committee",
                    "action": "Review hedge coverage gap and rebalance contract count.",
                    "reason": f"Coverage gap ratio is {coverage_gap_ratio:.3f}.",
                }
            )
        if sigma > 1.0:
            actions.append(
                {
                    "priority": "P1",
                    "owner": "Portfolio Manager",
                    "action": "Run downside stress scenario before next quote cycle.",
                    "reason": f"Calibrated annual volatility is high ({sigma:.3f}).",
                }
            )
        actions.append(
            {
                "priority": "P2",
                "owner": "Data Ops",
                "action": "Refresh weather/spot calibration weekly and regenerate decision pack.",
                "reason": "Decision quality depends on current calibration inputs.",
            }
        )

        immediate = "NO_GO" if any(a["priority"] == "P0" for a in actions) else "GO"

        return {
            "decision": {
                "immediate_go_no_go": immediate,
                "risk_band": risk_band,
                "operating_score": operating_score,
            },
            "summary": {
                "energy_type": req.energy_type,
                "location": {"lat": req.lat, "lon": req.lon},
                "annual_mwh_estimate": round(annual_mwh, 2),
                "calibrated_volatility": round(sigma, 4),
                "spot_price_per_mwh": round(S0, 4),
                "strike_price_per_mwh": round(K, 4),
                "premium_per_mwh": round(premium_per_mwh, 4),
                "recommended_contracts": recommended_contracts,
                "contracts_evaluated": contracts_eval,
                "projected_hedge_cost_usd": round(total_hedge_cost, 2),
                "risk_budget_usd": req.risk_budget_usd,
                "risk_budget_fit": budget_fit,
                "coverage_gap_ratio": round(coverage_gap_ratio, 6),
            },
            "actions": actions,
            "tier": auth["tier"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision pack failed: {str(e)}")


@app.post("/v1/operator-workbench")
async def operator_workbench_v1(req: DecisionPackRequest, auth: dict = Depends(verify_api_key)):
    if auth["tier"] == "demo":
        raise HTTPException(status_code=403, detail="Operator workbench requires Starter or Pro tier.")

    try:
        decision_payload = await decision_pack_v1(req, auth)
        summary = decision_payload["summary"]
        decision = decision_payload["decision"]
        actions = decision_payload["actions"]

        annual_mwh = float(summary["annual_mwh_estimate"])
        spot = float(summary["spot_price_per_mwh"])
        strike = float(summary["strike_price_per_mwh"])
        contracts = int(summary["contracts_evaluated"])
        contract_notional_mwh = float(req.contract_notional_mwh)

        gross_revenue = annual_mwh * spot
        floor_revenue = min(annual_mwh, contracts * contract_notional_mwh) * strike
        hedge_cost = float(summary["projected_hedge_cost_usd"])
        hedge_burden_pct = 0.0 if gross_revenue <= 0 else (hedge_cost / gross_revenue) * 100.0

        now = datetime.now(timezone.utc)
        assignment_items: List[Dict[str, Any]] = []
        for idx, item in enumerate(actions, start=1):
            priority = str(item.get("priority", "P2"))
            due_days = 7
            if priority == "P0":
                due_days = 1
            elif priority == "P1":
                due_days = 2
            assignment_items.append(
                {
                    "id": f"T{idx:02d}",
                    "priority": priority,
                    "owner": item.get("owner", "Ops"),
                    "task": item.get("action", "Review action."),
                    "reason": item.get("reason", "No reason provided."),
                    "due_at": (now + timedelta(days=due_days)).isoformat(),
                    "status": "open",
                }
            )

        confidence = "low"
        if decision["immediate_go_no_go"] == "GO" and decision["operating_score"] >= 85 and decision["risk_band"] == "normal":
            confidence = "high"
        elif decision["immediate_go_no_go"] == "GO" and decision["operating_score"] >= 70:
            confidence = "medium"

        return {
            "generated_at": now.isoformat(),
            "decision": decision,
            "business_snapshot": {
                "client_name": req.client_name,
                "region": req.region,
                "energy_type": req.energy_type,
                "gross_revenue_estimate_usd": round(gross_revenue, 2),
                "floor_revenue_estimate_usd": round(floor_revenue, 2),
                "initial_hedge_cost_estimate_usd": round(hedge_cost, 2),
                "hedge_burden_pct_of_revenue": round(hedge_burden_pct, 2),
                "risk_budget_fit": summary["risk_budget_fit"],
                "recommended_contracts": summary["recommended_contracts"],
                "contracts_evaluated": summary["contracts_evaluated"],
                "confidence": confidence,
            },
            "assignments": assignment_items,
            "summary": summary,
            "tier": auth["tier"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Operator workbench failed: {str(e)}")

# --- Data Endpoints ---

@app.post("/v1/data/solar")
async def get_solar_parameters(params: SolarParams, auth: dict = Depends(verify_api_key)):
    try:
        pricing_params = load_solar_parameters(params.lat, params.lon)
        clean_params = {k: float(v) if isinstance(v, (int, float, np.floating, np.integer)) else str(v)
                        for k, v in pricing_params.items() if not hasattr(v, 'to_dict') and not hasattr(v, '__len__')}
        return {"source": "NASA POWER", "location": {"lat": params.lat, "lon": params.lon}, "pricing_parameters": clean_params}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {str(e)}")

@app.post("/v1/data/wind")
async def get_wind_parameters(params: WindParams, auth: dict = Depends(verify_api_key)):
    try:
        loader = WindDataLoader(lat=params.lat, lon=params.lon, rotor_diameter_m=params.rotor_diameter_m, hub_height_m=params.hub_height_m)
        pricing_params = loader.load_parameters()
        clean_params = {k: float(v) if isinstance(v, (int, float, np.floating, np.integer)) else str(v)
                        for k, v in pricing_params.items() if not hasattr(v, 'to_dict') and not hasattr(v, '__len__')}
        return {"source": "NASA MERRA-2", "location": {"lat": params.lat, "lon": params.lon}, "pricing_parameters": clean_params}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {str(e)}")

@app.post("/v1/data/hydro")
async def get_hydro_parameters(params: HydroParams, auth: dict = Depends(verify_api_key)):
    try:
        loader = HydroDataLoader(lat=params.lat, lon=params.lon, catchment_area_km2=params.catchment_area_km2, fall_height_m=params.fall_height_m)
        pricing_params = loader.load_parameters()
        clean_params = {k: float(v) if isinstance(v, (int, float, np.floating, np.integer)) else str(v)
                        for k, v in pricing_params.items() if not hasattr(v, 'to_dict') and not hasattr(v, '__len__')}
        return {"source": "NASA MERRA-2", "location": {"lat": params.lat, "lon": params.lon}, "pricing_parameters": clean_params}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {str(e)}")

# --- Legacy endpoints (backward compatible) ---

@app.post("/price")
async def price_option(req: PricingRequest):
    return await price_option_v1(req, {"key": "legacy", "tier": "demo"})

@app.post("/greeks")
async def compute_greeks(req: GreeksRequest):
    return await compute_greeks_v1(req, {"key": "legacy", "tier": "demo"})

@app.post("/price/binomial")
async def price_binomial(req: PricingRequest):
    req.method = "binomial"
    return await price_option_v1(req, {"key": "legacy", "tier": "demo"})

@app.post("/price/monte-carlo")
async def price_monte_carlo(req: PricingRequest):
    req.method = "monte-carlo"
    return await price_option_v1(req, {"key": "legacy", "tier": "demo"})

@app.post("/data/wind")
async def get_wind_legacy(params: WindParams):
    return await get_wind_parameters(params, {"key": "legacy", "tier": "demo"})

@app.post("/data/hydro")
async def get_hydro_legacy(params: HydroParams):
    return await get_hydro_parameters(params, {"key": "legacy", "tier": "demo"})

# --- Health & Status ---

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "engine": "spk-derivatives-0.5.0"}

@app.get("/v1/usage")
async def usage_stats(auth: dict = Depends(verify_api_key)):
    now = time.time()
    key = auth["key"]
    today_requests = len([t for t in rate_tracker.get(key, []) if now - t < 86400])
    limits = RATE_LIMITS.get(auth["tier"], RATE_LIMITS["demo"])
    return {
        "tier": auth["tier"],
        "requests_today": today_requests,
        "daily_limit": limits["requests_per_day"],
        "rate_limit_per_minute": limits["requests_per_minute"],
    }

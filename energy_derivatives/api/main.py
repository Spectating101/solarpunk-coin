from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
import numpy as np

# Import core library modules
from spk_derivatives.binomial import BinomialTree
from spk_derivatives.monte_carlo import MonteCarloSimulator
from spk_derivatives.data_loader_wind import WindDataLoader
from spk_derivatives.data_loader_hydro import HydroDataLoader
from spk_derivatives.data_loader_nasa import NASADataLoader

app = FastAPI(
    title="SolarPunk Energy Derivatives API",
    description="Pricing engine for renewable energy derivatives (Solar, Wind, Hydro). Calibrated on NASA MERRA-2 data.",
    version="1.0.0"
)

# --- Data Models ---

class PricingRequest(BaseModel):
    S0: float
    K: float
    T: float = 1.0
    r: float = 0.05
    sigma: float
    payoff_type: str = "call"
    N: int = 100

class WindParams(BaseModel):
    lat: float
    lon: float
    rotor_diameter_m: float = 80.0
    hub_height_m: float = 80.0

class HydroParams(BaseModel):
    lat: float
    lon: float
    catchment_area_km2: float = 1000.0
    fall_height_m: float = 50.0

# --- Endpoints ---

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SolarPunk Derivatives Engine",
        "endpoints": ["/price/binomial", "/price/monte-carlo", "/data/solar", "/data/wind", "/data/hydro"]
    }

@app.post("/price/binomial")
async def price_binomial(req: PricingRequest):
    """
    Price an option using the Binomial Tree model (Exact).
    """
    try:
        tree = BinomialTree(
            S0=req.S0, K=req.K, T=req.T, r=req.r, sigma=req.sigma,
            N=req.N, payoff_type=req.payoff_type
        )
        price = tree.price()
        return {
            "model": "BinomialTree",
            "price": price,
            "parameters": req.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/price/monte-carlo")
async def price_monte_carlo(req: PricingRequest, simulations: int = 10000):
    """
    Price an option using Monte Carlo simulation (Risk Analysis).
    """
    try:
        sim = MonteCarloSimulator(
            S0=req.S0, K=req.K, T=req.T, r=req.r, sigma=req.sigma,
            num_simulations=simulations
        )
        price, lower, upper = sim.confidence_interval()
        return {
            "model": "MonteCarlo",
            "price": price,
            "confidence_interval_95": [lower, upper],
            "parameters": req.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/data/wind")
async def get_wind_parameters(params: WindParams):
    """
    Get calibration parameters for a Wind Farm location (NASA Data).
    """
    try:
        loader = WindDataLoader(
            lat=params.lat, lon=params.lon,
            rotor_diameter_m=params.rotor_diameter_m,
            hub_height_m=params.hub_height_m
        )
        # Load parameters (fetches data from NASA)
        pricing_params = loader.load_parameters()
        
        # Clean for JSON serialization (remove pandas objects)
        clean_params = {k: v for k, v in pricing_params.items() if not hasattr(v, 'to_dict')}
        
        return {
            "source": "NASA MERRA-2",
            "location": {"lat": params.lat, "lon": params.lon},
            "pricing_parameters": clean_params
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {str(e)}")

@app.post("/data/hydro")
async def get_hydro_parameters(params: HydroParams):
    """
    Get calibration parameters for a Hydroelectric Facility (NASA Data).
    """
    try:
        loader = HydroDataLoader(
            lat=params.lat, lon=params.lon,
            catchment_area_km2=params.catchment_area_km2,
            fall_height_m=params.fall_height_m
        )
        pricing_params = loader.load_parameters()
        
        # Clean for JSON serialization
        clean_params = {k: v for k, v in pricing_params.items() if not hasattr(v, 'to_dict')}
        
        return {
            "source": "NASA MERRA-2",
            "location": {"lat": params.lat, "lon": params.lon},
            "pricing_parameters": clean_params
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data fetch failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

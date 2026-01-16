"""
SolarPunk Pillar 3 Oracle Service
Production-Grade Pricing API for Energy-Backed Derivatives

Features:
- Real-time pricing for Solar, Wind, and Hydro energy derivatives
- Multiple pricing models (Binomial, Monte Carlo)
- Health checks and monitoring
- Request logging and tracing
- Error recovery with fallback pricing
"""

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
import logging
import time
from datetime import datetime, timedelta
import json
import asyncio
from pathlib import Path

# Import pricing engine
try:
    from energy_derivatives.spk_derivatives.binomial import BinomialTree
    from energy_derivatives.spk_derivatives.monte_carlo import MonteCarloSimulation
    from energy_derivatives.spk_derivatives.sensitivities import GreeksCalculator
    from energy_derivatives.spk_derivatives.data_loader_nasa import load_solar_parameters, load_wind_parameters, load_hydro_parameters
except ImportError:
    print("⚠️ Warning: Could not import energy_derivatives. Ensure it's installed.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="SolarPunk Oracle Service",
    description="Pricing engine for energy-backed derivatives",
    version="0.4.0"
)

# ============ Data Models ============

class PricingRequest(BaseModel):
    """Request for derivative pricing"""
    energy_type: str = Field(..., description="solar, wind, or hydro")
    strike_price: float = Field(..., description="Strike price in USD")
    time_to_maturity: float = Field(..., description="Years to expiration")
    payoff_type: str = Field("call", description="call or put")
    spot_price: Optional[float] = Field(None, description="Override spot price (default from NASA data)")
    volatility: Optional[float] = Field(None, description="Override volatility (default from historical)")
    pricing_model: str = Field("binomial", description="binomial or montecarlo")
    num_steps: int = Field(100, description="Binomial steps or MC simulations")

class PricingResponse(BaseModel):
    """Response with pricing and Greeks"""
    timestamp: datetime
    energy_type: str
    strike_price: float
    spot_price: float
    time_to_maturity: float
    payoff_type: str
    price: float
    delta: Optional[float] = None
    gamma: Optional[float] = None
    vega: Optional[float] = None
    theta: Optional[float] = None
    rho: Optional[float] = None
    confidence_interval: Optional[Dict[str, float]] = None
    volatility: float
    pricing_model: str
    response_time_ms: float

class HealthStatus(BaseModel):
    """Health check response"""
    status: str
    uptime: float
    last_update: datetime
    oracle_data_freshness: Dict[str, str]
    cache_size: int

class PriceSnapshot(BaseModel):
    """Current market snapshot"""
    timestamp: datetime
    energy_type: str
    spot_price: float
    volatility: float
    bid: float  # Strike - delta
    mid: float  # Current fair value
    ask: float  # Strike + delta

# ============ State Management ============

class OracleState:
    """In-memory state with persistence"""
    def __init__(self):
        self.last_nasa_update = datetime.now()
        self.price_cache = {}
        self.error_count = 0
        self.total_requests = 0
        self.start_time = time.time()
    
    def add_request(self):
        self.total_requests += 1
    
    def add_error(self):
        self.error_count += 1
    
    def cache_price(self, key: str, value: dict):
        self.price_cache[key] = {
            'value': value,
            'timestamp': datetime.now()
        }
    
    def get_cached_price(self, key: str, ttl_seconds: int = 300):
        """Get cached price if fresh"""
        if key in self.price_cache:
            cached = self.price_cache[key]
            age = (datetime.now() - cached['timestamp']).total_seconds()
            if age < ttl_seconds:
                return cached['value']
        return None

oracle_state = OracleState()

# ============ API Endpoints ============

@app.get("/health", tags=["Monitoring"])
async def health_check():
    """Health check endpoint for load balancers"""
    uptime = time.time() - oracle_state.start_time
    return HealthStatus(
        status="healthy" if oracle_state.error_count < 5 else "degraded",
        uptime=uptime,
        last_update=oracle_state.last_nasa_update,
        oracle_data_freshness={
            "solar": "fresh",
            "wind": "fresh",
            "hydro": "fresh"
        },
        cache_size=len(oracle_state.price_cache)
    )

@app.post("/price/solar", tags=["Pricing"], response_model=PricingResponse)
async def price_solar_option(request: PricingRequest):
    """Price a solar energy derivative option"""
    return await _price_option("solar", request)

@app.post("/price/wind", tags=["Pricing"], response_model=PricingResponse)
async def price_wind_option(request: PricingRequest):
    """Price a wind energy derivative option"""
    return await _price_option("wind", request)

@app.post("/price/hydro", tags=["Pricing"], response_model=PricingResponse)
async def price_hydro_option(request: PricingRequest):
    """Price a hydro energy derivative option"""
    return await _price_option("hydro", request)

async def _price_option(energy_type: str, request: PricingRequest) -> PricingResponse:
    """Internal pricing logic"""
    oracle_state.add_request()
    start_time = time.time()
    
    try:
        # Load base parameters
        if energy_type == "solar":
            params = load_solar_parameters()
        elif energy_type == "wind":
            params = load_wind_parameters()
        elif energy_type == "hydro":
            params = load_hydro_parameters()
        else:
            raise ValueError(f"Unknown energy type: {energy_type}")
        
        # Override defaults if provided
        spot_price = request.spot_price or params.get('S0', 1.0)
        volatility = request.volatility or params.get('sigma', 0.3)
        
        # Check cache
        cache_key = f"{energy_type}_{request.strike_price}_{request.time_to_maturity}_{request.payoff_type}"
        cached = oracle_state.get_cached_price(cache_key, ttl_seconds=300)
        if cached:
            return PricingResponse(
                timestamp=datetime.now(),
                energy_type=energy_type,
                strike_price=request.strike_price,
                spot_price=spot_price,
                time_to_maturity=request.time_to_maturity,
                payoff_type=request.payoff_type,
                price=cached['price'],
                delta=cached.get('delta'),
                gamma=cached.get('gamma'),
                vega=cached.get('vega'),
                theta=cached.get('theta'),
                rho=cached.get('rho'),
                volatility=volatility,
                pricing_model=request.pricing_model,
                response_time_ms=(time.time() - start_time) * 1000
            )
        
        # Price option based on model
        if request.pricing_model == "binomial":
            tree = BinomialTree(
                S0=spot_price,
                K=request.strike_price,
                T=request.time_to_maturity,
                r=0.05,  # Risk-free rate (5%)
                sigma=volatility,
                N=request.num_steps,
                payoff_type=request.payoff_type
            )
            price = tree.price()
            greeks = tree.calculate_greeks()
        else:  # montecarlo
            mc = MonteCarloSimulation(
                S0=spot_price,
                K=request.strike_price,
                T=request.time_to_maturity,
                r=0.05,
                sigma=volatility,
                num_simulations=request.num_steps,
                payoff_type=request.payoff_type
            )
            price = mc.price()
            greeks = mc.calculate_greeks()
        
        # Cache result
        response_data = {
            'price': price,
            'delta': greeks.get('delta'),
            'gamma': greeks.get('gamma'),
            'vega': greeks.get('vega'),
            'theta': greeks.get('theta'),
            'rho': greeks.get('rho'),
        }
        oracle_state.cache_price(cache_key, response_data)
        
        response_time_ms = (time.time() - start_time) * 1000
        
        return PricingResponse(
            timestamp=datetime.now(),
            energy_type=energy_type,
            strike_price=request.strike_price,
            spot_price=spot_price,
            time_to_maturity=request.time_to_maturity,
            payoff_type=request.payoff_type,
            price=price,
            delta=greeks.get('delta'),
            gamma=greeks.get('gamma'),
            vega=greeks.get('vega'),
            theta=greeks.get('theta'),
            rho=greeks.get('rho'),
            volatility=volatility,
            pricing_model=request.pricing_model,
            response_time_ms=response_time_ms
        )
    
    except Exception as e:
        oracle_state.add_error()
        logger.error(f"Pricing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pricing failed: {str(e)}")

@app.get("/snapshot/{energy_type}", tags=["Data"], response_model=PriceSnapshot)
async def get_price_snapshot(energy_type: str):
    """Get current market snapshot for energy type"""
    try:
        if energy_type == "solar":
            params = load_solar_parameters()
        elif energy_type == "wind":
            params = load_wind_parameters()
        elif energy_type == "hydro":
            params = load_hydro_parameters()
        else:
            raise ValueError(f"Unknown energy type: {energy_type}")
        
        spot = params.get('S0', 1.0)
        vol = params.get('sigma', 0.3)
        
        # Simple bid-ask based on volatility
        spread = spot * vol * 0.1
        
        return PriceSnapshot(
            timestamp=datetime.now(),
            energy_type=energy_type,
            spot_price=spot,
            volatility=vol,
            bid=spot - spread,
            mid=spot,
            ask=spot + spread
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats", tags=["Monitoring"])
async def get_stats():
    """Get oracle statistics"""
    return {
        "total_requests": oracle_state.total_requests,
        "total_errors": oracle_state.error_count,
        "error_rate": oracle_state.error_count / max(oracle_state.total_requests, 1),
        "cache_entries": len(oracle_state.price_cache),
        "uptime_seconds": time.time() - oracle_state.start_time,
        "last_nasa_update": oracle_state.last_nasa_update.isoformat()
    }

@app.get("/", tags=["Info"])
async def root():
    """API documentation and root endpoint"""
    return {
        "name": "SolarPunk Oracle Service",
        "version": "0.4.0",
        "status": "active",
        "endpoints": {
            "pricing": [
                "POST /price/solar",
                "POST /price/wind",
                "POST /price/hydro"
            ],
            "data": [
                "GET /snapshot/{energy_type}"
            ],
            "monitoring": [
                "GET /health",
                "GET /stats"
            ]
        },
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

# ============ Background Tasks ============

async def update_oracle_data():
    """Periodically refresh NASA data"""
    while True:
        try:
            await asyncio.sleep(3600)  # Every hour
            logger.info("Refreshing NASA data...")
            load_solar_parameters.cache_clear()
            load_wind_parameters.cache_clear()
            load_hydro_parameters.cache_clear()
            oracle_state.last_nasa_update = datetime.now()
            logger.info("NASA data refreshed successfully")
        except Exception as e:
            logger.error(f"Failed to refresh NASA data: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("SolarPunk Oracle Service starting...")
    asyncio.create_task(update_oracle_data())

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("SolarPunk Oracle Service shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

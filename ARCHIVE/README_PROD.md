# spk-derivatives: Energy Derivatives Pricing Framework

[![PyPI version](https://img.shields.io/pypi/v/spk-derivatives.svg)](https://pypi.org/project/spk-derivatives/)
[![Python Version](https://img.shields.io/pypi/pyversions/spk-derivatives.svg)](https://pypi.org/project/spk-derivatives/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://github.com/Spectating101/spk-derivatives/workflows/Tests%20&%20Coverage/badge.svg)](https://github.com/Spectating101/spk-derivatives/actions)

A quantitative framework for pricing renewable energy derivatives (solar, wind, hydro) using binomial trees, Monte-Carlo simulation, and risk-neutral valuation backed by real NASA satellite data.

## Features

### 🎯 Multi-Energy Support
- **Solar Energy**: Irradiance-based pricing with day/night volatility
- **Wind Energy**: Turbine power curves with location-specific wind patterns
- **Hydroelectric**: Precipitation and catchment area dynamics
- Abstract base class for adding new energy types

### 📊 Pricing Engines
- **Binomial Tree Model (BOPM)**: Deterministic, step-by-step price lattice
- **Monte-Carlo Simulation**: 10,000+ path sampling with confidence intervals
- **Greeks Calculation**: Delta, Gamma, Vega, Theta, Rho sensitivities
- Risk-neutral valuation under Geometric Brownian Motion (GBM)

### 🌍 Geographic System
- **10+ Global Presets**: Phoenix, Taiwan, Germany, Brazil, Atacama, Aalborg, Nepal, etc.
- **Location-Specific Ratings**: Energy suitability scores per location
- **NASA POWER API Integration**: 5+ years of satellite ground-truth data
- **Search & Filter**: By country, energy type, or performance metrics

### 🛠️ Professional Workflows
- **Batch Pricing**: Price portfolios of multiple contracts simultaneously
- **Results Comparison**: Binomial vs Monte-Carlo convergence validation
- **Input Validation**: Comprehensive parameter checking
- **Context Translation**: Physics → $/kWh → financial metrics
- **Break-Even Analysis**: Profitability thresholds for producers/consumers

### 📈 Sophisticated Output
- **PriceTranslator**: Currency formatting and precision control
- **GreeksTranslator**: Interpret risk sensitivities in plain language
- **SolarSystemContext**: Location-aware supply/demand analysis
- **Contextual Summaries**: Professional one-page option pricings

## Quick Start

### Installation

```bash
pip install spk-derivatives
```

Or install from source:

```bash
git clone https://github.com/Spectating101/spk-derivatives.git
cd spk-derivatives
pip install -e .
```

### Basic Usage

#### 1. Load Location Data
```python
from spk_derivatives import get_location, list_locations

# Get specific location
taiwan = get_location('Taiwan')
print(f"Solar Rating: {taiwan['solar_rating']}/10")
print(f"Coordinates: {taiwan['coordinates']}")

# List all solar-optimized locations
solar_locs = list_locations('solar')
for loc in solar_locs:
    print(f"{loc['city']}: {loc['solar_rating']}/10")
```

#### 2. Price a Solar Option (Binomial Tree)
```python
from spk_derivatives import BinomialTree

# Create binomial tree
tree = BinomialTree(
    S0=0.035,          # Spot price: $0.035/kWh
    K=0.040,           # Strike price: $0.040/kWh (LCOE)
    T=1.0,             # 1-year contract
    r=0.025,           # 2.5% risk-free rate
    sigma=0.42,        # 42% volatility (from NASA data)
    N=100,             # 100 steps in tree
    payoff_type='call' # Call option (producer protection)
)

# Compute price
option_price = tree.price()
print(f"Option Premium: ${option_price:.6f}/kWh")

# Get parameters summary
summary = tree.get_parameters_summary()
print(summary)
```

#### 3. Validate with Monte-Carlo
```python
from spk_derivatives import MonteCarloSimulator

# Create MC simulator
mc = MonteCarloSimulator(
    S0=0.035, K=0.040, T=1.0, r=0.025, sigma=0.42,
    num_simulations=10000,
    seed=42,
    payoff_type='call'
)

# Get price and confidence interval
price, low, high = mc.confidence_interval(confidence=0.95)
print(f"Price: ${price:.6f}/kWh")
print(f"95% CI: ${low:.6f} - ${high:.6f}")

# Check convergence
error = abs(option_price - price) / price
print(f"Binomial vs MC Error: {error:.2%}")
```

#### 4. Calculate Greeks
```python
from spk_derivatives import GreeksCalculator, calculate_greeks

# Manual calculation
greeks = GreeksCalculator(S0=0.035, K=0.040, T=1.0, r=0.025, sigma=0.42)
delta = greeks.delta(option_type='call')
vega = greeks.vega()
theta = greeks.theta(option_type='call')

print(f"Delta: {delta:.4f} (price sensitivity)")
print(f"Vega: {vega:.4f} (volatility sensitivity)")
print(f"Theta: {theta:.6f}/day (time decay)")

# Or use convenience function
greeks_dict = calculate_greeks(S0=0.035, K=0.040, T=1.0, r=0.025, sigma=0.42)
print(greeks_dict)
```

#### 5. Load Multi-Energy Data
```python
from spk_derivatives import WindDataLoader, HydroDataLoader

# Wind energy at Aalborg (famous wind hub)
wind = WindDataLoader(location_name='Aalborg')
wind_params = wind.load_parameters()
print(f"Wind Rating: {wind_params['solar_rating']}/10")
print(f"Data span: {wind_params['T']} years")

# Hydro energy in Nepal
hydro = HydroDataLoader(location_name='Nepal')
hydro_params = hydro.load_parameters()
print(f"Catchment Area: {hydro.catchment_area} km²")
```

#### 6. Batch Pricing Portfolio
```python
from spk_derivatives import batch_price

scenarios = [
    {'S0': 0.030, 'K': 0.040, 'sigma': 0.30, 'energy_type': 'solar'},
    {'S0': 0.035, 'K': 0.040, 'sigma': 0.42, 'energy_type': 'solar'},
    {'S0': 0.050, 'K': 0.040, 'sigma': 0.60, 'energy_type': 'solar'},
]

results = batch_price(scenarios, T=1.0, r=0.025, method='binomial', N=100)

for result in results:
    print(f"{result.location}: ${result.price:.6f}/kWh (Δ={result.delta:.4f})")
```

#### 7. Professional Output
```python
from spk_derivatives import create_contextual_summary

summary = create_contextual_summary(
    location='Taiwan',
    energy_type='solar',
    S0=0.035,
    K=0.040,
    T=1.0,
    r=0.025,
    sigma=0.42,
    binomial_price=0.00356,
    mc_price=0.00361,
    delta=0.38,
    vega=0.12
)

print(summary)
# Output: Professional one-page summary suitable for reports/presentations
```

## API Documentation

### Core Classes

#### BinomialTree
Binomial Option Pricing Model using Cox-Ross-Rubinstein (CRRO) construction.

```python
BinomialTree(
    S0: float,              # Initial price ($/kWh)
    K: float,               # Strike price ($/kWh)
    T: float,               # Time to maturity (years)
    r: float,               # Risk-free rate (annualized)
    sigma: float,           # Volatility (annualized, calibrated from NASA)
    N: int = 100,           # Steps in tree
    payoff_type: str = 'call'  # 'call', 'put', 'redeemable'
)

# Methods
tree.price() -> float                      # Option price in $/kWh
tree.get_parameters_summary() -> str       # Human-readable parameter table
tree.compute_convergence(max_N=500) -> pd.DataFrame  # Error vs N steps
```

#### MonteCarloSimulator
Monte-Carlo simulation under Geometric Brownian Motion.

```python
MonteCarloSimulator(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    num_simulations: int = 10000,
    seed: Optional[int] = None,
    payoff_type: str = 'call'
)

# Methods
sim.price() -> float                                  # Simulated price
sim.confidence_interval(confidence=0.95) -> Tuple    # (price, low, high)
sim.stress_test(volatilities=[0.2, 0.5, 1.0]) -> pd.DataFrame  # Sensitivity
```

#### GreeksCalculator
Greeks (first and second derivatives) for risk management.

```python
GreeksCalculator(S0, K, T, r, sigma)

# Methods
calc.delta(option_type='call') -> float    # ∂Price/∂S (price sensitivity)
calc.gamma() -> float                      # ∂²Price/∂S² (convexity)
calc.vega() -> float                       # ∂Price/∂σ (volatility sensitivity)
calc.theta(option_type='call') -> float    # ∂Price/∂t (time decay)
calc.rho() -> float                        # ∂Price/∂r (rate sensitivity)
```

### Data Loaders

#### SolarDataLoader (Built-in)
```python
from spk_derivatives import load_solar_parameters

params = load_solar_parameters(
    lat: float,
    lon: float,
    volatility_method: str = 'log',  # 'log' or 'simple'
    cache: bool = True               # Use cached NASA data if available
)
# Returns: {'S0': float, 'K': float, 'sigma': float, 'T': float, ...}
```

#### WindDataLoader
```python
from spk_derivatives import WindDataLoader

loader = WindDataLoader(
    location_name: Optional[str] = None,  # e.g., 'Aalborg'
    lat: float = 33.45,
    lon: float = -112.07,
    rotor_diameter: float = 80.0,         # meters
    hub_height: float = 80.0,             # meters
    power_coefficient: float = 0.40       # Cp (0.35-0.45 typical)
)

params = loader.load_parameters()
```

#### HydroDataLoader
```python
from spk_derivatives import HydroDataLoader

loader = HydroDataLoader(
    location_name: Optional[str] = None,  # e.g., 'Nepal'
    lat: float = 28.0,
    lon: float = 84.0,
    catchment_area: float = 1000.0,       # km²
    elevation_drop: float = 100.0,        # meters
    turbine_efficiency: float = 0.90      # 0.85-0.95 typical
)

params = loader.load_parameters()
```

### Location System

```python
from spk_derivatives import (
    get_location,
    list_locations,
    search_by_country,
    get_best_location_for_energy
)

# Get single location
loc = get_location('Phoenix')
# Returns: {'city': 'Phoenix', 'country': 'United States', 'coordinates': (33.45, -112.07), 'solar_rating': 10, ...}

# List locations by energy type
solar_locs = list_locations('solar')  # Returns list of dicts
wind_locs = list_locations('wind')
hydro_locs = list_locations('hydro')

# Search by country
us_locs = search_by_country('United States')

# Find best location for energy type
best_solar = get_best_location_for_energy('solar')
best_wind = get_best_location_for_energy('wind')
```

### Professional Tools

#### PricingValidator
```python
from spk_derivatives import PricingValidator

validator = PricingValidator()
validator.validate(S0=0.035, K=0.040, T=1.0, r=0.025, sigma=0.42)
# Raises ValueError if parameters invalid
```

#### ResultsComparator
```python
from spk_derivatives import ResultsComparator, PricingResult

result1 = PricingResult('Taiwan', 'binomial', 'call', 0.0356, ...)
result2 = PricingResult('Taiwan', 'monte_carlo', 'call', 0.0361, ...)

comparator = ResultsComparator([result1, result2])
comparison = comparator.compare()
print(comparison['convergence_error'])  # 0.0014 (0.14%)
```

#### Context Translators
```python
from spk_derivatives import PriceTranslator, GreeksTranslator

price_translator = PriceTranslator(currency='USD', decimal_places=6)
formatted_price = price_translator.format(0.0356)
# Output: "$0.035600/kWh"

greeks_translator = GreeksTranslator()
delta_interpretation = greeks_translator.interpret_delta(0.38)
# Output: "For every $0.01 rise in spot price, option value rises $0.0038"
```

## Energy Type Guide

### Solar
- **Data Source**: NASA POWER - Solar Irradiance (W/m²)
- **Volatility Driver**: Day/night cycle, seasonal variation, cloud cover
- **Typical Volatility**: 30-50% annually
- **Strike**: Usually = LCOE ($0.03-0.06/kWh)
- **Best Locations**: Arizona, Atacama, Taiwan, Saudi Arabia

### Wind
- **Data Source**: NASA POWER - Wind Speed @ 50m height
- **Volatility Driver**: Weather patterns, seasonal wind resources
- **Typical Volatility**: 40-80% annually
- **Strike**: Capacity-weighted power output ($/MWh)
- **Best Locations**: Denmark, Aalborg, Great Plains USA, Patagonia

### Hydroelectric
- **Data Source**: NASA POWER - Precipitation & Runoff
- **Volatility Driver**: Seasonal rainfall, catchment hydrology
- **Typical Volatility**: 20-60% depending on season and reservoir
- **Strike**: Water availability-based generation cost
- **Best Locations**: Nepal, Norway, Canada, Brazil

## Examples & Tutorials

### Example 1: Producer Revenue Protection
```python
# A solar farm in Taiwan wants to lock in minimum revenue
from spk_derivatives import BinomialTree, get_location

location = get_location('Taiwan')
farm_capacity = 100  # MW

# Historical data shows: 
# - Spot price = $0.035/kWh
# - LCOE = $0.040/kWh (producer's cost)
# - Volatility = 42% (calibrated from 5 years NASA data)

tree = BinomialTree(
    S0=0.035,
    K=0.040,
    T=1.0,
    r=0.025,
    sigma=0.42,
    N=400,
    payoff_type='call'
)

call_price = tree.price()
annual_kWh = farm_capacity * 1000 * 8760 * 0.25  # 25% capacity factor
annual_insurance_cost = annual_kWh * call_price

print(f"Insurance cost for 1 year: ${annual_insurance_cost:,.0f}")
print(f"With call protection:")
print(f"  - If price drops to $0.01, farm still earns $0.040/kWh")
print(f"  - If price rises to $0.15, farm profits from upside")
```

### Example 2: Consumer Cost Hedging
```python
# A data center in Germany wants to cap electricity costs
from spk_derivatives import BinomialTree

tree = BinomialTree(
    S0=0.015,      # German wholesale price (low due to renewables)
    K=0.025,       # Cap at $0.025/kWh
    T=1.0,
    r=0.025,
    sigma=0.35,    # Lower volatility (stable grid)
    N=400,
    payoff_type='put'  # Put for consumer protection
)

put_price = tree.price()
datacenter_consumption = 50_000  # kWh/day
annual_kWh = datacenter_consumption * 365

total_insurance = annual_kWh * put_price

print(f"Annual cost cap insurance: ${total_insurance:,.0f}")
```

### Example 3: Portfolio Analysis
```python
from spk_derivatives import batch_price

# Price calls across multiple locations
scenarios = [
    {'location': 'Phoenix', 'S0': 0.035, 'K': 0.040, 'sigma': 0.42},
    {'location': 'Atacama', 'S0': 0.032, 'K': 0.038, 'sigma': 0.38},
    {'location': 'Taiwan', 'S0': 0.038, 'K': 0.042, 'sigma': 0.45},
]

results = batch_price(
    scenarios,
    T=1.0,
    r=0.025,
    method='binomial',
    N=300
)

# Compare premiums
for r in results:
    print(f"{r.location:15} Premium: ${r.price:.6f}/kWh  Delta: {r.delta:.4f}")
```

## Volatility Calibration

The library calibrates volatility from **actual NASA satellite data**, not historical market prices:

1. **Download Data**: 5+ years of NASA POWER irradiance/wind/precipitation
2. **Compute Daily Returns**: log-returns of energy output
3. **Calculate Volatility**: annualized standard deviation
4. **Cap at 200%**: Numerical stability constraint

Example output:
- **Phoenix Solar**: σ ≈ 42% (high daylight seasonality)
- **Atacama Solar**: σ ≈ 38% (very stable climate)
- **Aalborg Wind**: σ ≈ 65% (weather-driven variability)
- **Nepal Hydro**: σ ≈ 50% (seasonal monsoon)

This physics-based approach is more robust than market-based volatility for new markets without trading history.

## Mathematical Foundation

### Geometric Brownian Motion (GBM)
```
dS_t = μ*S_t*dt + σ*S_t*dW_t

Under risk-neutral measure:
dS_t = r*S_t*dt + σ*S_t*dW_t

Solution:
S_T = S_0 * exp((r - σ²/2)*T + σ*sqrt(T)*Z)  where Z ~ N(0,1)
```

### Binomial Tree (Cox-Ross-Rubinstein)
```
u = exp(σ*sqrt(Δt))           # Up factor
d = 1/u                         # Down factor  
p = (exp(r*Δt) - d)/(u - d)   # Risk-neutral probability
```

### Monte-Carlo Price
```
V = E^Q[max(S_T - K, 0)] * exp(-r*T)
  = (1/N) * Σ max(S_i,T - K, 0) * exp(-r*T)
```

### Greeks
```
Delta:  Δ = ∂V/∂S (numerical differentiation)
Gamma:  Γ = ∂²V/∂S² 
Vega:   ν = ∂V/∂σ
Theta:  Θ = ∂V/∂t
Rho:    ρ = ∂V/∂r
```

## Testing & Validation

Run the test suite:
```bash
# Install test dependencies
pip install pytest pytest-cov pytest-timeout

# Run all tests
pytest tests/ -v

# Generate coverage report
pytest tests/ --cov=energy_derivatives.spk_derivatives --cov-report=html
```

Key validation tests:
- ✅ Binomial vs Monte-Carlo convergence (<2% error)
- ✅ Put-Call parity
- ✅ Volatility effect (higher σ → higher option value)
- ✅ Time decay (shorter T → lower option value)
- ✅ Edge cases (deep OTM, deep ITM, extreme vol)

## Performance

Typical execution times (macOS M1, Python 3.11):

| Operation | Time |
|-----------|------|
| Binomial Tree (N=100) | 5-10 ms |
| Binomial Tree (N=500) | 50-100 ms |
| Monte-Carlo (10K paths) | 200-500 ms |
| Greeks (full set) | 20-50 ms |
| Batch price (100 scenarios) | 5-10 seconds |

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new functionality
4. Ensure tests pass: `pytest tests/`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Citation

If you use spk-derivatives in academic research, please cite:

```bibtex
@software{spk_derivatives_2025,
  title={spk-derivatives: Energy Derivatives Pricing Framework},
  author={Spectating101},
  url={https://github.com/Spectating101/spk-derivatives},
  year={2025},
  version={0.4.0}
}
```

## Acknowledgments

- NASA POWER API for satellite energy data
- Cox-Ross-Rubinstein binomial model
- NumPy/SciPy for numerical computing
- Inspired by CEIR (Crypto-Energy-Integrated-Reserve) framework

## Support

- **Documentation**: https://github.com/Spectating101/spk-derivatives
- **Issues**: https://github.com/Spectating101/spk-derivatives/issues
- **Email**: support@spk-derivatives.org

---

**Energy is the backbone of economy. Energy derivatives are the future of finance.**

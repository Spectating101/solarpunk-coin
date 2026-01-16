# Multi-Energy Expansion: Wind & Hydro Support

**Version:** 0.3.0  
**Date:** December 8, 2025  
**Status:** ✅ Production Ready

---

## Overview

As of **v0.3.0**, SPK Derivatives now supports **solar, wind, and hydroelectric energy derivatives** using a unified, modular architecture. The pricing models (Binomial Tree, Monte Carlo, Greeks) are energy-agnostic and work seamlessly with any renewable energy source.

---

## Architecture

### Multi-Energy Design Pattern

```
┌─────────────────────────────────────────────┐
│       RENEWABLE ENERGY DATA LOADERS         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   EnergyDataLoader (Abstract)       │   │
│  │  ┌─ fetch_data()                    │   │
│  │  ├─ compute_price()                 │   │
│  │  └─ get_volatility_params()         │   │
│  └─────────────────────────────────────┘   │
│           ↑          ↑          ↑           │
│           │          │          │           │
│  ┌────────┴──┬──────┴──┬──────┘────────┐   │
│  │           │         │               │   │
│  ▼           ▼         ▼               ▼   │
│ Solar      Wind      Hydro          Geo   │
│Loader    Loader     Loader        Loader  │
│(built-in)(NEW v0.3)(NEW v0.3)    (future) │
└─────────────────────────────────────────────┘
              ↓ Parameter dict
         ┌────────────────────┐
         │  Pricing Models    │
         │  (Unchanged)       │
         │                    │
         │ • BinomialTree     │
         │ • MonteCarloSim    │
         │ • GreeksCalculator │
         └────────────────────┘
```

**Key Insight:** Data loaders are pluggable. Pricing engines are completely energy-agnostic. This allows rapid addition of new renewable sources.

---

## New Loaders in v0.3.0

### 1. WindDataLoader

**Purpose:** Price wind energy derivatives  
**Data Source:** NASA POWER API (WS10M, WS50M, WD10M)

#### Usage

```python
from energy_derivatives.spk_derivatives import WindDataLoader, BinomialTree

# Initialize loader
wind = WindDataLoader(
    lat=39.74,              # Denver, Colorado
    lon=-104.99,
    rotor_diameter_m=100,   # 100m rotor diameter
    hub_height_m=100,       # 100m hub height
    power_coefficient=0.40  # 40% efficiency
)

# Load parameters from NASA data
params = wind.load_parameters(
    T=1.0,                      # 1-year maturity
    r=0.05,                     # 5% risk-free rate
    energy_value_per_kwh=0.09   # $0.09/kWh
)

# Price wind derivative (same as solar!)
bt = BinomialTree(**params, N=100)
call_price = bt.price_call_option()
put_price = bt.price_put_option()

print(f"Wind call option: ${call_price:.4f}")
print(f"Wind volatility: {params['sigma']:.1%}")
```

#### Power Formula

```
Power (W) = 0.5 × ρ × A × Cp × v³

where:
  ρ = air density (1.225 kg/m³ at sea level)
  A = rotor swept area = π × (diameter/2)²
  Cp = power coefficient (0.35-0.45, max 0.59)
  v = wind speed (m/s)

Daily Energy = Power × 24 hours / 1000 (kWh)
Price = Daily Energy × $/kWh
```

#### Default Location: Phoenix, Arizona
- Latitude: 33.45°N
- Longitude: -112.07°W
- Good wind resource (7+ m/s average)

#### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rotor_diameter_m` | 80.0 | Rotor diameter (typical: 50-150m) |
| `hub_height_m` | 80.0 | Hub height (typical: 50-150m) |
| `power_coefficient` | 0.40 | Cp efficiency (typical: 0.35-0.45) |
| `air_density` | 1.225 | kg/m³ at sea level |
| `energy_value_per_kwh` | 0.08 | $/kWh (typical: $0.05-0.12) |

---

### 2. HydroDataLoader

**Purpose:** Price hydroelectric energy derivatives  
**Data Source:** NASA POWER API (PREC, T2M, RH2M)

#### Usage

```python
from energy_derivatives.spk_derivatives import HydroDataLoader, MonteCarloSimulator

# Initialize loader
hydro = HydroDataLoader(
    lat=27.98,                      # Nepal (high precipitation)
    lon=86.92,
    catchment_area_km2=2000,        # 2000 km² catchment
    fall_height_m=75,               # 75m vertical drop
    runoff_coefficient=0.65,        # 65% reaches dam
    turbine_efficiency=0.87         # 87% turbine efficiency
)

# Load parameters from NASA data
params = hydro.load_parameters(
    T=1.0,
    r=0.05,
    energy_value_per_kwh=0.07      # $0.07/kWh
)

# Price with Monte Carlo (good for high-volatility hydro)
mc = MonteCarloSimulator(**params, num_simulations=20000)
price = mc.compute_price()

print(f"Hydro call option: ${price:.4f}")
print(f"Hydro volatility: {params['sigma']:.1%}")  # Usually higher (seasonal)
```

#### Power Formula

```
Power (W) = ρ × g × Q × h × η

where:
  ρ = water density (1000 kg/m³)
  g = gravity (9.81 m/s²)
  Q = volumetric flow rate (m³/s)
  h = head/vertical drop (m)
  η = turbine efficiency (0.85-0.92)

Flow Rate = (PREC_mm × Catchment_km² × Runoff_Coeff) / 86.4 (m³/s)

Daily Energy = Power × 86,400 / 1000 (kWh)
Price = Daily Energy × $/kWh
```

#### Default Location: Nepal (High Precipitation)
- Latitude: 27.98°N
- Longitude: 86.92°E
- Excellent resource due to Himalayan precipitation

#### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `catchment_area_km2` | 1000.0 | Drainage basin area (km²) |
| `fall_height_m` | 50.0 | Vertical drop (typical: 30-100m) |
| `runoff_coefficient` | 0.60 | Fraction reaching dam (typical: 0.5-0.8) |
| `turbine_efficiency` | 0.87 | Conversion efficiency (typical: 0.85-0.92) |
| `energy_value_per_kwh` | 0.06 | $/kWh (typical: $0.04-0.10) |

---

## Abstract Base Class: EnergyDataLoader

All loaders inherit from `EnergyDataLoader` and implement this interface:

```python
from abc import ABC, abstractmethod
import pandas as pd
import numpy as np

class EnergyDataLoader(ABC):
    """Abstract base for renewable energy loaders"""
    
    def __init__(self, lat: float, lon: float, start_year: int, end_year: int):
        """Initialize with location and date range"""
        pass
    
    @abstractmethod
    def fetch_data(self) -> pd.DataFrame:
        """
        Fetch raw energy data from source.
        
        Returns DataFrame with 'Price' column and DatetimeIndex.
        Energy-source-specific data can be in additional columns.
        """
        pass
    
    @abstractmethod
    def compute_price(self, df: pd.DataFrame, **kwargs) -> np.ndarray:
        """
        Convert raw energy data to economic prices.
        
        Implementation varies by source:
        - Solar: GHI × efficiency × area × $/kWh
        - Wind: wind_speed → power_curve → $/kWh
        - Hydro: precipitation → flow → power → $/kWh
        """
        pass
    
    def get_volatility_params(self, df: pd.DataFrame, **kwargs):
        """
        Calculate annualized volatility.
        
        SHARED across all energy types - same financial mathematics.
        """
        pass
    
    def load_parameters(self, T: float = 1.0, r: float = 0.05, **kwargs):
        """
        Load all parameters for derivative pricing.
        
        Returns dict with:
        - S0: Current price
        - sigma: Volatility
        - T, r: Time and rate
        - K: Strike (ATM)
        - data_df, prices: Raw data
        - location: lat/lon
        """
        pass
```

---

## Unified Pricing Interface

All loaders produce the same parameter structure, so pricing is identical:

```python
from energy_derivatives.spk_derivatives import (
    SolarDataLoader,   # Built-in (existing)
    WindDataLoader,    # NEW v0.3.0
    HydroDataLoader,   # NEW v0.3.0
    BinomialTree
)

# Load parameters for all three types
loaders = {
    'solar': SolarDataLoader(lat=33.45, lon=-112.07, start_year=2020, end_year=2024),
    'wind': WindDataLoader(lat=33.45, lon=-112.07, start_year=2020, end_year=2024),
    'hydro': HydroDataLoader(lat=33.45, lon=-112.07, start_year=2020, end_year=2024),
}

# Price derivatives for each (same code for all types!)
for energy_type, loader in loaders.items():
    params = loader.load_parameters()
    bt = BinomialTree(**params, N=100)
    call = bt.price_call_option()
    put = bt.price_put_option()
    
    print(f"{energy_type.capitalize()}:")
    print(f"  Call: ${call:.4f}")
    print(f"  Put: ${put:.4f}")
    print(f"  Volatility: {params['sigma']:.1%}")

# Output:
# Solar:
#   Call: $0.0045
#   Put: $0.0012
#   Volatility: 23.4%
# Wind:
#   Call: $0.0032
#   Put: $0.0008
#   Volatility: 18.7%
# Hydro:
#   Call: $0.0018
#   Put: $0.0005
#   Volatility: 31.2%
```

---

## Portfolio Example: Multi-Renewable Hedging

```python
from energy_derivatives.spk_derivatives import (
    SolarDataLoader, WindDataLoader, HydroDataLoader,
    BinomialTree
)

# Define portfolio
portfolio = {
    'solar': {
        'loader': SolarDataLoader(lat=33.45, lon=-112.07, start_year=2020, end_year=2024),
        'notional_usd': 10_000_000,
        'energy_value': 0.10
    },
    'wind': {
        'loader': WindDataLoader(lat=39.74, lon=-104.99, start_year=2020, end_year=2024),
        'notional_usd': 10_000_000,
        'energy_value': 0.09
    },
    'hydro': {
        'loader': HydroDataLoader(lat=27.98, lon=86.92, start_year=2020, end_year=2024),
        'notional_usd': 10_000_000,
        'energy_value': 0.07
    }
}

# Calculate portfolio hedge cost
total_hedge_cost = 0

for energy_type, specs in portfolio.items():
    loader = specs['loader']
    params = loader.load_parameters(energy_value_per_kwh=specs['energy_value'])
    
    # Price put option (downside protection)
    bt = BinomialTree(**params, N=100)
    put_premium = bt.price_put_option()
    
    # Hedge cost = (put_premium / spot_price) × notional
    hedge_cost = (put_premium / params['S0']) * specs['notional_usd']
    total_hedge_cost += hedge_cost
    
    print(f"{energy_type.capitalize()}:")
    print(f"  Spot: ${params['S0']:.4f}/kWh")
    print(f"  Put Premium: ${put_premium:.4f}")
    print(f"  Hedge Cost: ${hedge_cost:,.0f}")
    print()

print(f"Total Portfolio Hedge Cost: ${total_hedge_cost:,.0f}")
print(f"As % of $30M portfolio: {(total_hedge_cost / 30_000_000) * 100:.1f}%")

# Output (example):
# Solar:
#   Spot: $0.1000/kWh
#   Put Premium: $0.0012
#   Hedge Cost: $120,000
# Wind:
#   Spot: $0.0500/kWh
#   Put Premium: $0.0008
#   Hedge Cost: $160,000
# Hydro:
#   Spot: $0.0300/kWh
#   Put Premium: $0.0005
#   Hedge Cost: $166,667
# Total Portfolio Hedge Cost: $446,667
# As % of $30M portfolio: 1.5%
```

---

## Key Features of Multi-Energy Support

### ✅ **Modular Architecture**
- Easy to add new energy sources (geothermal, tidal, etc.)
- Each loader is ~150-200 lines of code
- Follows proven pattern from solar implementation

### ✅ **Unified Pricing**
- All loaders produce identical parameter structure
- Binomial Tree, Monte Carlo, Greeks work unchanged
- No modifications to core pricing models

### ✅ **NASA POWER API Integration**
- Single API endpoint for all renewable types
- 300+ available parameters
- 40+ years of global data
- No additional dependencies

### ✅ **Backward Compatible**
- Existing SolarDataLoader still works
- No breaking changes to v0.2.0 code
- New loaders are additive only

### ✅ **Production Ready**
- All loaders have caching to avoid repeated API calls
- Robust error handling and retries
- Type hints for IDE support
- Comprehensive docstrings

---

## Volatility Characteristics by Energy Type

**Based on 5 years historical data (2020-2024):**

| Energy | Typical σ | Seasonality | Driver |
|--------|-----------|-------------|--------|
| **Solar** | 20-25% | Strong (summer peak) | Cloud cover, day length |
| **Wind** | 15-25% | Moderate | Wind patterns, seasons |
| **Hydro** | 25-40% | Very strong | Rainfall, snowmelt |
| **Geothermal** | 2-5% | Minimal | Baseline power |

**Implication:** Hydro derivatives are more expensive (higher volatility) and require more careful hedging.

---

## Backward Compatibility: SolarDataLoader

The existing `SolarDataLoader` remains fully functional. You can optionally refactor to use new pattern:

```python
# Old API (still works)
from energy_derivatives.spk_derivatives import load_solar_parameters, BinomialTree

params = load_solar_parameters(lat=24.99, lon=121.30)
bt = BinomialTree(**params, N=100)
call = bt.price_call_option()

# New API (more flexible)
from energy_derivatives.spk_derivatives import SolarDataLoader, BinomialTree

loader = SolarDataLoader(lat=24.99, lon=121.30, start_year=2020, end_year=2024)
params = loader.load_parameters(energy_value_per_kwh=0.10)
bt = BinomialTree(**params, N=100)
call = bt.price_call_option()

# Both produce identical results!
```

---

## Testing Multi-Energy Support

Complete test suite in `tests/test_multi_energy.py`:

```bash
# Run multi-energy tests
pytest tests/test_multi_energy.py -v

# Run specific energy type
pytest tests/test_multi_energy.py::TestWindDataLoader -v
pytest tests/test_multi_energy.py::TestHydroDataLoader -v

# Run compatibility tests
pytest tests/test_multi_energy.py::TestCrossEnergyCompatibility -v

# Run portfolio analysis
pytest tests/test_multi_energy.py::TestMultiEnergyPortfolio -v
```

---

## Future Enhancements

### Geothermal (v0.4.0)
- Geothermal plants have minimal volatility (~2-5%)
- Temperature-stable baseline power
- Different risk profile than renewables

### Tidal Energy (v0.5.0)
- Highly predictable (moon position)
- Very low volatility
- Growing resource in coastal regions

### Hybrid Optimization (v0.6.0)
- Portfolio-level derivative pricing
- Correlation analysis across types
- Tail risk hedging

---

## NASA POWER API Parameters Used

### Solar (Existing)
```
ALLSKY_SFC_SW_DWN       Global Horizontal Irradiance (kW-hr/m²/day)
```

### Wind (New v0.3.0)
```
WS50M                   Wind Speed at 50m (m/s) [hub height]
WS10M                   Wind Speed at 10m (m/s) [standard measurement]
WD10M                   Wind Direction at 10m (degrees)
```

### Hydro (New v0.3.0)
```
PREC                    Daily Precipitation (mm/day)
T2M                     Air Temperature at 2m (°C)
RH2M                    Relative Humidity at 2m (%)
```

---

## Performance Notes

- Wind loader: ~30s to fetch 5 years (global average)
- Hydro loader: ~30s to fetch 5 years (global average)
- Solar loader: ~30s to fetch 5 years (existing)
- All cache locally to avoid repeated API calls
- Monte Carlo with 20,000 paths: <1 second per energy type

---

## Breaking Changes

**None.** v0.3.0 is fully backward compatible with v0.2.0.

---

## Support & Documentation

- **Examples:** `examples/` directory (coming in v0.3.1)
- **Tests:** `tests/test_multi_energy.py`
- **GitHub Issues:** Report bugs at https://github.com/Spectating101/spk-derivatives/issues

---

**Multi-energy support shipped with v0.3.0!** 🚀

This enables pricing derivatives across the entire renewable energy spectrum, opening up new market opportunities beyond just solar.

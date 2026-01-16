# Solarpunk Bitcoin: Energy-Backed Cryptocurrency Research & Development

Academic research on renewable energy as a fundamental anchor for cryptocurrency value, with practical derivatives pricing framework for energy-backed assets.

## 📚 Research Papers

- **CEIR-Trifecta.md** – Core empirical work: "When Does Energy Cost Anchor Cryptocurrency Value?" Triple natural experiment design (China mining ban 2021, Ethereum merge 2022, Russia sanctions 2025)
- **Quasi-SD-CEIR.md** – Framework extension: Supply-demand dynamics with sentiment analysis and hidden Markov regimes
- **Final-Iteration.md** – SolarPunkCoin concept: Renewable-energy-backed stablecoin addressing 10 cryptocurrency failure modes
- **Empirical-Milestone.md** – Spring 2025 research proposal for Yuan Ze University

## 🔧 Energy Derivatives Framework (v0.3.0)

**NEW:** Multi-energy support! 🌞💨💧

Production-ready Python package for pricing European-style options on **renewable energy-backed assets** (solar, wind, hydroelectric).

**Multi-Energy Support (v0.3.0):**
- ☀️ **Solar** (GHI data) - Existing, proven implementation
- 💨 **Wind** (Speed at hub height) - NEW with turbine power curve
- 💧 **Hydro** (Precipitation) - NEW with hydrological flow model
- All three use identical pricing engines (Binomial Tree, Monte Carlo, Greeks)

**Quick start:**
```bash
cd energy_derivatives
pip install -r requirements.txt
jupyter notebook notebooks/main.ipynb

# Or with multi-energy:
from energy_derivatives.spk_derivatives import (
    SolarDataLoader, WindDataLoader, HydroDataLoader,
    BinomialTree, list_locations, get_location
)

# Load any renewable energy type using geographic presets
wind = WindDataLoader(location_name='Aalborg')  # Denmark - excellent wind
hydro = HydroDataLoader(location_name='Nepal')  # Himalayas - peak monsoon
solar = SolarDataLoader(location_name='Atacama')  # Chile - world's best

params = wind.load_parameters()
bt = BinomialTree(**params, N=100)
call_price = bt.price_call_option()
```

### 🌍 Geographic Presets (NEW v0.3.0)

**10 curated locations** spanning 6 continents, each optimized for renewable energy derivatives:

**Solar-Optimized:** Phoenix (☀️ 10/10), Atacama (☀️ 10/10), Cairo (☀️ 10/10)  
**Wind-Optimized:** Aalborg (💨 10/10), Kansas City (💨 9/10), Edinburgh (💨 9/10), Patagonia (💨 10/10)  
**Hydro-Optimized:** Nepal (💧 10/10), Alps (💧 10/10), Amazon Basin (💧 10/10)  
**Multi-Energy:** Kenya Highlands (☀️💨💧 balanced), Tasmania (☀️💨💧 balanced)  

```python
# List all available locations
from spk_derivatives import list_locations, format_location_table

print(format_location_table())
# =====================================================================
# Location             Country              Solar    Wind     Hydro
# =====================================================================
# Phoenix              United States        10       6        2
# Atacama              Chile                10       8        1
# Aalborg              Denmark              4        10       2
# Nepal                Nepal                6        5        10
# Alps                 Switzerland          5        4        10
# ...

# Find best location for each energy type
from spk_derivatives import get_best_location_for_energy
best_solar = get_best_location_for_energy('solar')   # 'Atacama'
best_wind = get_best_location_for_energy('wind')     # 'Patagonia'
best_hydro = get_best_location_for_energy('hydro')   # 'Nepal'

# Use presets instead of manual coordinates
solar = SolarDataLoader(location_name='Phoenix')
# Automatically uses: lat=33.45, lon=-112.07, tilt=25°, albedo=0.25
```

See [GEOGRAPHIC_GUIDE.md](GEOGRAPHIC_GUIDE.md) for detailed location profiles, climate zones, seasonal patterns, and multi-energy hedging strategies.

**Core modules:**
- `data_loader_base.py` – Abstract base class (NEW v0.3.0)
- `data_loader_wind.py` – Wind speed → power pricing (NEW v0.3.0)
- `data_loader_hydro.py` – Precipitation → power pricing (NEW v0.3.0)
- `binomial.py` – Binomial tree pricing with convergence analysis
- `monte_carlo.py` – Monte Carlo simulation with confidence intervals
- `sensitivities.py` – Greeks computation (delta, gamma, vega, theta, rho)
- `plots.py` – Publication-quality visualizations

**Details:** ~3,500+ lines of production code, full documentation, multi-energy examples.

**See:** [MULTI_ENERGY_SUPPORT.md](MULTI_ENERGY_SUPPORT.md) for complete multi-energy guide

## �� Empirical Data & Analysis

`empirical/` contains CEIR computation pipeline:
- Bitcoin/Ethereum energy consumption (TWh/year from Digiconomist)
- Mining distribution (geographic concentration)
- Electricity prices (regional, time-varying)
- Macro controls (S&P 500, VIX, gold)
- Analysis scripts (`gecko.py`, `CEIR.py`, `Regression.py`)

## 📖 Project Structure

```
solarpunk-coin/
├── README.md                     # This file
├── CEIR-Trifecta.md              # Main research paper
├── Quasi-SD-CEIR.md              # Supply-demand extension
├── Final-Iteration.md            # SolarPunkCoin vision
├── Empirical-Milestone.md        # Research roadmap
│
├── energy_derivatives/           # Derivatives pricing package
│   ├── src/                      # Core modules
│   │   ├── binomial.py
│   │   ├── monte_carlo.py
│   │   ├── sensitivities.py
│   │   ├── plots.py
│   │   └── data_loader.py
│   ├── notebooks/
│   │   └── main.ipynb            # Full demonstration
│   └── requirements.txt
│
├── empirical/                    # CEIR data & scripts
│   ├── gecko.py                  # Data collection
│   ├── CEIR.py                   # CEIR calculations
│   ├── Regression.py             # Analysis
│   └── data/                     # CSV files
│
└── examples/
    └── presentation_colab.ipynb  # Solar energy demo
```

## 🎯 Key Features

✅ **Rigorous Theory:** Risk-neutral valuation, geometric Brownian motion, arbitrage-free pricing  
✅ **Two Methods:** Binomial tree (exact) + Monte Carlo (distribution analysis)  
✅ **Complete Greeks:** All 5 sensitivities via finite differences  
✅ **Real Data:** Calibrated to Bitcoin CEIR (2018–2025)  
✅ **Multi-Location:** Taiwan, Arizona, Spain solar data comparison  
✅ **Production Code:** Type hints, comprehensive docstrings, error handling  

## 🚀 Usage

**Python API:**
```python
from energy_derivatives.binomial import BinomialTree
from energy_derivatives.data_loader import load_parameters

params = load_parameters(data_dir='empirical')
price = BinomialTree(**params, N=400).price()
```

**Jupyter Notebook:**
```bash
cd energy_derivatives
jupyter notebook notebooks/main.ipynb
```

See `notebooks/main.ipynb` for complete 10-section demo with explanations.

## 📝 Author

Spectating101 (s1133958@mail.yzu.edu.tw)  
Yuan Ze University

## 📄 License

MIT

---

**Status:** Research papers completed (peer review in progress). Derivatives framework complete and submission-ready.

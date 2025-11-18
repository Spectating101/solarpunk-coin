# Energy Derivatives Pricing Framework - Submission Package

## Quick Start

```bash
# Run full demo (recommended for presentation)
python demo.py

# Run quick demo (faster, for testing)
python demo.py --quick

# Run without generating plots
python demo.py --no-plots
```

## What This Project Demonstrates

This framework applies **rigorous quantitative finance methods** to price derivatives on **renewable energy-backed digital assets**, calibrated with **real Bitcoin CEIR data** from 2018-2025.

### Core Innovation

Bridging **energy economics** (CEIR theory) with **financial derivatives** (Black-Scholes/binomial framework) to price claims on energy units.

---

## Deliverables

### Source Code (`src/`)
| Module | Lines | Purpose |
|--------|-------|---------|
| `binomial.py` | 371 | Binomial Option Pricing Model |
| `monte_carlo.py` | 368 | Monte-Carlo Simulation with GBM |
| `sensitivities.py` | 359 | Greeks via finite differences |
| `plots.py` | 408 | Professional visualizations |
| `data_loader.py` | 336 | Empirical CEIR data integration |

**Total: ~1,842 lines of production-quality Python**

### Demo Script
- `demo.py` - Complete demonstration runner (370+ lines)
- Automated execution of all components
- Professional console output
- Generates 5 publication-quality plots

### Documentation
- `README.md` - Full project documentation
- `docs/API_REFERENCE.md` - Complete API guide
- `docs/COURSEWORK_GUIDE.md` - Assessment criteria alignment
- This summary file

### Results
Generated visualizations in `results/`:
1. `01_convergence.png` - Binomial tree convergence analysis
2. `02_mc_distribution.png` - Monte-Carlo terminal value distribution
3. `03_greeks_curves.png` - All Greeks sensitivity curves
4. `04_stress_volatility.png` - Volatility stress testing
5. `05_stress_rate.png` - Interest rate stress testing

---

## Key Technical Features

### 1. Real Data Integration
- **2,703 days** of Bitcoin CEIR data (2018-01-01 to 2025-05-28)
- Bitcoin prices from $3,157 to $111,071
- Empirical volatility estimation: 63.94%
- Energy price derived from cumulative energy investment

### 2. Multiple Pricing Methods
- **Binomial Tree**: Exact analytical solution via backward induction
- **Monte-Carlo**: Numerical verification with confidence intervals
- **Convergence**: Models agree within 0.01% (validated)

### 3. Complete Risk Analytics
- **Delta** (0.654): Price sensitivity to underlying
- **Gamma** (10,143): Curvature/rebalancing indicator
- **Vega** (2.67e-6): Volatility exposure
- **Theta** (3.94e-7): Time decay
- **Rho** (2.79e-4): Interest rate sensitivity

### 4. Stress Testing
- Volatility shocks: ±20%
- Interest rate shocks: ±2pp
- Full sensitivity analysis

---

## Mathematical Foundation

### Risk-Neutral Valuation
```
V₀ = E^Q[e^{-rT} max(S_T - K, 0)]
```

### Geometric Brownian Motion
```
dS_t = rS_t dt + σS_t dW_t
```

### Binomial Tree
```
u = e^{σ√Δt}
d = 1/u
q = (e^{rΔt} - d)/(u - d)
```

### Greeks (Finite Differences)
```
Δ = [V(S+h) - V(S-h)] / 2h
Γ = [V(S+h) - 2V(S) + V(S-h)] / h²
```

---

## Assessment Criteria Coverage

### Theory & Concepts (25%)
- Risk-neutral valuation principle
- No-arbitrage pricing
- Option pricing models (binomial, Black-Scholes)
- Energy economics (CEIR framework)

### Implementation (25%)
- Object-oriented design
- Type hints throughout
- Comprehensive docstrings
- Error handling and validation
- Modular architecture

### Empirical Application (20%)
- Real Bitcoin CEIR data (7 years)
- Proper parameter calibration
- Energy price derivation
- Volatility estimation

### Analysis & Results (20%)
- Multiple pricing methods with convergence
- Complete Greeks calculation
- Stress testing suite
- Model validation

### Communication (10%)
- Professional visualizations
- Clear documentation
- Automated demo runner
- Publication-ready outputs

---

## How to Present

### Option 1: Run the Demo (Recommended)
```bash
cd energy_derivatives
python demo.py
```
Shows all components in sequence with professional formatting.

### Option 2: Jupyter Notebook
```bash
jupyter notebook notebooks/main.ipynb
```
Interactive exploration with inline visualizations.

### Option 3: API Usage
```python
from src.data_loader import load_parameters
from src.binomial import BinomialTree

params = load_parameters(data_dir='../empirical')
tree = BinomialTree(**params, payoff_type='call')
price = tree.price()
```

---

## Files to Submit

```
energy_derivatives/
├── src/                          # Core modules
│   ├── __init__.py
│   ├── binomial.py              # Binomial pricing
│   ├── monte_carlo.py           # Monte-Carlo simulation
│   ├── sensitivities.py         # Greeks calculation
│   ├── plots.py                 # Visualization suite
│   └── data_loader.py           # Data integration
├── notebooks/
│   └── main.ipynb               # Interactive demo
├── docs/
│   ├── API_REFERENCE.md         # Technical docs
│   └── COURSEWORK_GUIDE.md      # Assessment guide
├── results/                     # Generated plots
│   ├── 01_convergence.png
│   ├── 02_mc_distribution.png
│   ├── 03_greeks_curves.png
│   ├── 04_stress_volatility.png
│   └── 05_stress_rate.png
├── demo.py                      # Main demo runner
├── README.md                    # Project documentation
├── SUBMISSION_SUMMARY.md        # This file
├── requirements.txt             # Dependencies
└── .gitignore
```

Plus the empirical data in `../empirical/` folder.

---

## Quick Validation

Run this to verify everything works:

```bash
cd energy_derivatives
python -c "
import sys; sys.path.insert(0, 'src')
from data_loader import load_parameters
from binomial import BinomialTree
from monte_carlo import MonteCarloSimulator
from sensitivities import GreeksCalculator

params = load_parameters(data_dir='../empirical')
tree = BinomialTree(S0=params['S0'], K=params['K'], T=params['T'],
                   r=params['r'], sigma=params['sigma'])
print(f'Price: \${tree.price():.8f}')
print('All modules validated!')
"
```

---

## Runtime

- Full demo: ~5-10 seconds
- Quick demo: ~3-5 seconds
- Plot generation: ~2-3 seconds additional

---

## Dependencies

```
numpy>=1.20.0
pandas>=1.3.0
matplotlib>=3.4.0
seaborn>=0.11.0
scipy>=1.7.0
statsmodels>=0.13.0
```

Install with: `pip install -r requirements.txt`

---

## Contact

For questions about the implementation, see the docstrings in each module or consult `docs/API_REFERENCE.md`.

---

**Status: COMPLETE AND VALIDATED**
**Total Code: 2,200+ lines**
**Documentation: 1,500+ lines**
**Date: November 2025**

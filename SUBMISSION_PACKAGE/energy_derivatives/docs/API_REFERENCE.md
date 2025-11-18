# Energy Derivatives API Reference

Complete API documentation for the Energy Derivatives Pricing Framework.

## Table of Contents

1. [binomial.py](#binomial)
2. [monte_carlo.py](#monte_carlo)
3. [sensitivities.py](#sensitivities)
4. [plots.py](#plots)
5. [data_loader.py](#data_loader)

---

## binomial.py

### Classes

#### `PayoffFunction`

Static methods for payoff structures.

```python
@staticmethod
def european_call(S_T: float, K: float) -> float
```
- **Parameters:**
  - `S_T`: Terminal stock price
  - `K`: Strike price
- **Returns:** `max(S_T - K, 0)`

```python
@staticmethod
def redeemable_claim(S_T: float, K: float = 0) -> float
```
- **Parameters:**
  - `S_T`: Terminal stock price
  - `K`: Unused (for interface consistency)
- **Returns:** `S_T`

---

#### `BinomialTree`

Main binomial pricing engine.

**Constructor:**
```python
BinomialTree(
    S0: float,              # Initial price
    K: float,               # Strike price
    T: float,               # Time to maturity (years)
    r: float,               # Risk-free rate
    sigma: float,           # Volatility
    N: int = 100,           # Number of steps
    payoff_type: str = 'call'  # 'call' or 'redeemable'
)
```

**Methods:**

```python
def price() -> float
```
- Returns: Arbitrage-free option price

```python
def price_with_tree() -> Tuple[float, Dict]
```
- Returns: (price, tree_info) with full tree details

```python
def sensitivity_analysis_convergence(
    step_range: List[int] = None
) -> pd.DataFrame
```
- Shows price convergence as steps increase
- Default range: [10, 25, 50, 100, 200, 500]

```python
def get_parameters_summary() -> Dict
```
- Returns: Dictionary of all model parameters

**Attributes:**
- `dt`: Time step
- `u`: Up factor
- `d`: Down factor
- `q`: Risk-neutral probability

---

### Functions

```python
def price_energy_call(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    N: int = 100
) -> float
```
- Quick pricing of European call on energy

```python
def price_energy_claim(
    S0: float,
    T: float,
    r: float,
    sigma: float,
    N: int = 100
) -> float
```
- Quick pricing of direct redeemable claim

---

## monte_carlo.py

### Classes

#### `MonteCarloSimulator`

Monte-Carlo simulation engine for GBM paths.

**Constructor:**
```python
MonteCarloSimulator(
    S0: float,                      # Initial price
    K: float,                       # Strike price
    T: float,                       # Time to maturity
    r: float,                       # Risk-free rate
    sigma: float,                   # Volatility
    num_simulations: int = 10000,   # Number of paths
    seed: Optional[int] = None,     # Random seed
    payoff_type: str = 'call'       # 'call' or 'redeemable'
)
```

**Methods:**

```python
def simulate_paths(
    num_steps: int = 252,
    return_paths: bool = False
) -> Optional[np.ndarray]
```
- Generates GBM price paths
- Returns full paths if `return_paths=True`, else stores internally
- `num_steps`: Trading days per year default (252)

```python
def price(num_steps: int = 252) -> float
```
- Returns: Monte-Carlo price estimate

```python
def confidence_interval(
    num_steps: int = 252,
    confidence: float = 0.95
) -> Tuple[float, float, float]
```
- Returns: (price, lower_bound, upper_bound)

```python
def price_distribution() -> pd.DataFrame
```
- Returns: Distribution statistics (mean, std, percentiles, etc.)

```python
def stress_test(
    volatilities: Optional[List[float]] = None,
    num_steps: int = 252
) -> pd.DataFrame
```
- Prices under different volatility scenarios
- Default: [0.05, 0.10, ..., 1.00]

```python
def rate_sensitivity(
    rates: Optional[List[float]] = None,
    num_steps: int = 252
) -> pd.DataFrame
```
- Prices under different interest rate scenarios
- Default: [-0.02, -0.01, ..., 0.10]

```python
def get_parameters_summary() -> Dict
```
- Returns: Dictionary of all model parameters

---

### Functions

```python
def price_energy_derivative_mc(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    num_simulations: int = 10000,
    payoff_type: str = 'call'
) -> Tuple[float, float, float]
```
- Quick MC pricing with CI
- Returns: (price, lower_ci, upper_ci)

---

## sensitivities.py

### Classes

#### `GreeksCalculator`

Computes Greeks via finite differences.

**Constructor:**
```python
GreeksCalculator(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    pricing_method: str = 'binomial',  # 'binomial' or 'monte_carlo'
    N: int = 100,                      # Binomial steps
    num_simulations: int = 5000,       # MC paths
    payoff_type: str = 'call'
)
```

**Methods:**

```python
def base_price() -> float
```
- Returns: Option price at current parameters

```python
def delta(bump_size: Optional[float] = None) -> float
```
- Price sensitivity to underlying
- Default bump: 1% of S0

```python
def gamma(bump_size: Optional[float] = None) -> float
```
- Second derivative (delta sensitivity)
- Default bump: 1% of S0

```python
def vega(bump_size: float = 0.01) -> float
```
- Price sensitivity to 1% volatility change
- Normalized to per-1% change convention

```python
def theta(bump_size: float = 1/252) -> float
```
- Daily time decay
- Default: 1 trading day

```python
def rho(bump_size: float = 0.01) -> float
```
- Price sensitivity to 1% interest rate change
- Normalized to per-1% change convention

```python
def compute_all_greeks() -> Dict[str, float]
```
- Returns: Dictionary with Price, Delta, Gamma, Vega, Theta, Rho

```python
def to_dataframe() -> pd.DataFrame
```
- Returns: DataFrame with Greeks and interpretations

```python
def get_parameters_summary() -> Dict
```
- Returns: Dictionary of all model parameters

---

### Functions

```python
def compute_energy_derivatives_greeks(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    pricing_method: str = 'binomial',
    N: int = 100
) -> pd.DataFrame
```
- Quick Greeks computation
- Returns: DataFrame

---

## plots.py

### Classes

#### `EnergyDerivativesPlotter`

Comprehensive visualization utilities.

**Static Methods:**

```python
@staticmethod
def plot_binomial_convergence(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    payoff_type: str = 'call',
    step_range: Optional[List[int]] = None,
    figsize: Tuple[int, int] = (10, 6),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Shows binomial convergence as N increases
- Default steps: [10, 25, 50, 100, 200, 500]

```python
@staticmethod
def plot_monte_carlo_distribution(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    payoff_type: str = 'call',
    num_simulations: int = 10000,
    figsize: Tuple[int, int] = (12, 5),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Terminal price and payoff distributions

```python
@staticmethod
def plot_greeks_curves(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    payoff_type: str = 'call',
    figsize: Tuple[int, int] = (14, 10),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Greeks vs underlying price
- 2x3 subplot grid

```python
@staticmethod
def plot_stress_test_volatility(
    S0: float,
    K: float,
    T: float,
    r: float,
    payoff_type: str = 'call',
    num_simulations: int = 5000,
    figsize: Tuple[int, int] = (10, 6),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Price under different volatilities

```python
@staticmethod
def plot_stress_test_rate(
    S0: float,
    K: float,
    T: float,
    sigma: float,
    payoff_type: str = 'call',
    num_simulations: int = 5000,
    figsize: Tuple[int, int] = (10, 6),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Price under different interest rates

```python
@staticmethod
def plot_price_comparison(
    S0: float,
    K: float,
    T: float,
    r: float,
    sigma: float,
    payoff_type: str = 'call',
    N: int = 100,
    figsize: Tuple[int, int] = (10, 6),
    save_path: Optional[str] = None
) -> plt.Figure
```
- Binomial vs Monte-Carlo comparison

---

## data_loader.py

### Functions

```python
def load_ceir_data(data_dir: str = '../empirical') -> pd.DataFrame
```
- Loads CEIR data from empirical folder
- Returns: DataFrame with Date, Price, Energy_TWh_Annual, Market_Cap, CEIR
- Falls back to synthetic data if files not found

```python
def compute_ceir_column(
    df: pd.DataFrame,
    electricity_price: float = 0.05
) -> pd.DataFrame
```
- Computes CEIR = Market Cap / Cumulative Energy Cost
- `electricity_price`: $/kWh for cost calculation

```python
def compute_energy_price(
    ceir_df: pd.DataFrame,
    normalization_date: Optional[str] = None
) -> np.ndarray
```
- Derives energy unit prices from CEIR
- Returns: Normalized price series

```python
def estimate_volatility(
    price_series: np.ndarray,
    periods: int = 252
) -> float
```
- Estimates annualized volatility
- Default: 252 trading periods/year

```python
def load_parameters(
    data_dir: str = '../empirical',
    T: float = 1.0,
    r: float = 0.05
) -> Dict
```
- Loads all parameters for derivative pricing
- Returns: Dict with S0, sigma, T, r, K, ceir_df, energy_prices
- **Key convenience function**

```python
def get_ceir_summary(ceir_df: pd.DataFrame) -> Dict
```
- Summary statistics (min, max, mean, current values)

---

## Common Workflows

### 1. Quick Price Estimate

```python
from src.binomial import price_energy_call

price = price_energy_call(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.20, N=100)
```

### 2. Full Analysis with Empirical Data

```python
from src.data_loader import load_parameters
from src.binomial import BinomialTree
from src.sensitivities import GreeksCalculator
from src.plots import EnergyDerivativesPlotter

# Load data
params = load_parameters(data_dir='empirical')

# Price
tree = BinomialTree(**params, payoff_type='call')
price = tree.price()

# Greeks
calc = GreeksCalculator(**params, pricing_method='binomial')
greeks = calc.compute_all_greeks()

# Plot
EnergyDerivativesPlotter.plot_greeks_curves(**params)
```

### 3. Stress Testing

```python
from src.monte_carlo import MonteCarloSimulator

sim = MonteCarloSimulator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.20)

# Volatility stress
vol_results = sim.stress_test()

# Rate stress
rate_results = sim.rate_sensitivity()
```

### 4. Full Demonstration

See `notebooks/main.ipynb` for complete workflow.

---

## Parameter Guidance

| Parameter | Typical Range | Notes |
|-----------|--------------|-------|
| S0 | $0.50 - $2.00 | Energy unit price from CEIR |
| K | $0.50 - $2.00 | Strike (usually = S0 for ATM) |
| T | 0.25 - 2.0 | Years to maturity (typically 1 year) |
| r | 0.02 - 0.10 | Risk-free rate (use government bonds) |
| sigma | 0.15 - 1.00 | Volatility (Bitcoin energy: ~40-60%) |
| N | 50 - 500 | Binomial steps (convergence at 100+) |
| num_simulations | 5000 - 100000 | MC paths (10k typical) |

---

## Error Handling

All classes include parameter validation:

```python
try:
    tree = BinomialTree(S0=0, K=100, T=1, r=0.05, sigma=0.20)
except ValueError as e:
    print(f"Invalid parameters: {e}")
```

---

## Performance Tips

1. **Binomial trees**: Fast for single prices, use N=100-200
2. **Monte-Carlo**: Good for stress testing, use 10k paths
3. **Greeks**: Use Monte-Carlo for faster Greeks (less accurate but sufficient for directional exposure)
4. **Visualization**: Save plots to disk, don't regenerate repeatedly

---

**Last updated:** November 6, 2025  
**API Version:** 1.0.0

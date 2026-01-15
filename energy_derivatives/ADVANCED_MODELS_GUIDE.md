# Advanced Models Quick Reference

## New Features in v0.5.0

### 1. Mean-Reversion Models (`mean_reversion.py`)

Energy prices revert to long-run mean (unlike stocks):

```python
from spk_derivatives.mean_reversion import OrnsteinUhlenbeck

# Create mean-reverting model
ou = OrnsteinUhlenbeck(
    S0=100,           # Initial price
    kappa=2.0,        # Speed of reversion (higher = faster)
    theta=100,        # Long-run mean
    sigma=0.3,        # Volatility
    T=1.0             # Time horizon
)

# Simulate paths
times, paths = ou.simulate_paths(num_paths=1000)

# Price options
call_price = ou.price_european_call(K=105, num_paths=100000)
print(f"Call price: ${call_price['price']:.2f}")

# Calibrate from historical data
params = OrnsteinUhlenbeck.calibrate_from_data(historical_prices)
print(f"Mean reversion speed: {params['kappa']:.3f}")
print(f"Half-life: {params['half_life_days']:.1f} days")
```

**When to use:**
- Energy prices (mean-revert due to storage limits)
- Interest rates
- Commodity spreads

### 2. Jump-Diffusion Models (`jump_diffusion.py`)

Captures sudden price spikes (grid failures, weather events):

```python
from spk_derivatives.jump_diffusion import MertonJumpDiffusion, EnergyJumpModel

# Merton model (general)
jd = MertonJumpDiffusion(
    S0=100,
    mu=0.05,
    sigma=0.2,           # Continuous volatility
    lambda_jump=2.0,     # 2 jumps per year on average
    mu_jump=0.3,         # Average jump size (+30%)
    sigma_jump=0.5,      # Jump size volatility
    T=1.0
)

# Simulate with jumps
times, paths, jump_counts = jd.simulate_paths(num_paths=1000)
print(f"Average jumps per path: {jump_counts.mean():.2f}")

# Price options (Merton's analytical formula)
call_price = jd.price_european_call_analytical(K=105)

# Energy-specific model (calibrated defaults)
energy = EnergyJumpModel(
    S0=100,
    energy_type='electricity'  # or 'solar', 'wind'
)

# Detect jumps in historical data
from spk_derivatives.jump_diffusion import detect_jumps_in_data
jump_info = detect_jumps_in_data(historical_prices, threshold=3.0)
print(f"Detected {jump_info['num_jumps']} jumps")
print(f"Largest jump: {jump_info['largest_jump']:.2%}")
```

**When to use:**
- Electricity markets (sudden grid failures)
- Commodity markets with supply shocks
- Any market with fat tails

### 3. Implied Volatility (`implied_vol.py`)

Extract volatility from observed market prices:

```python
from spk_derivatives.implied_vol import implied_volatility

# Given market price, find implied volatility
market_price = 8.50
iv = implied_volatility(
    market_price=market_price,
    S0=100,
    K=105,
    T=0.25,
    r=0.05,
    option_type='call'
)
print(f"Implied volatility: {iv:.2%}")

# Calibrate entire volatility surface
import pandas as pd
market_data = pd.DataFrame({
    'strike': [90, 95, 100, 105, 110],
    'maturity': [0.25, 0.25, 0.25, 0.25, 0.25],
    'call_price': [12.5, 9.0, 6.0, 3.5, 1.8],
    'put_price': [0.5, 1.5, 3.5, 6.0, 9.5],
    'option_type': ['call', 'call', 'call', 'call', 'call']
})

from spk_derivatives.implied_vol import implied_vol_surface
surface = implied_vol_surface(market_data, S0=100, r=0.05)
print(surface[['strike', 'implied_vol']])
```

**When to use:**
- Calibrating models to market data
- Checking if your model matches observed prices
- Detecting mispricing opportunities

## Model Comparison

| Model | Best For | Complexity | Calibration |
|-------|----------|------------|-------------|
| **GBM** | Equities, long-term | Low | Easy |
| **Mean-Reversion** | Energy, commodities | Medium | Medium |
| **Jump-Diffusion** | Energy spikes, tail risk | High | Hard |
| **Implied Vol** | Market calibration | N/A | Easy |

## Example: Full Energy Hedging Workflow

```python
import numpy as np
from spk_derivatives.mean_reversion import OrnsteinUhlenbeck
from spk_derivatives.jump_diffusion import EnergyJumpModel
from spk_derivatives.implied_vol import implied_volatility

# Step 1: Load historical solar energy prices
historical_prices = np.loadtxt('solar_prices.csv')

# Step 2: Calibrate mean-reversion
ou_params = OrnsteinUhlenbeck.calibrate_from_data(historical_prices)
print(f"Long-run mean: ${ou_params['theta']:.2f}")
print(f"Half-life: {ou_params['half_life_days']:.1f} days")

# Step 3: Detect if jumps are present
from spk_derivatives.jump_diffusion import detect_jumps_in_data
jump_stats = detect_jumps_in_data(historical_prices, threshold=3.0)

if jump_stats['num_jumps'] > 5:
    print(f"⚠️  Detected {jump_stats['num_jumps']} jumps, using jump-diffusion model")
    model = EnergyJumpModel(S0=historical_prices[-1], energy_type='solar')
else:
    print("✓ No significant jumps, using mean-reversion model")
    model = OrnsteinUhlenbeck(
        S0=historical_prices[-1],
        kappa=ou_params['kappa'],
        theta=ou_params['theta'],
        sigma=ou_params['sigma'],
        T=1.0
    )

# Step 4: Price hedge contract
hedge_price = model.price_european_call(K=110)
print(f"Hedge price: ${hedge_price['price']:.2f}")

# Step 5: If market price exists, compute implied vol
if market_hedge_price := 12.50:
    iv = implied_volatility(market_hedge_price, S0=100, K=110, T=1.0, r=0.02)
    print(f"Market implied vol: {iv:.2%} vs model vol: {ou_params['sigma']:.2%}")
```

## Performance Notes

- **Mean-reversion**: Exact discretization (fast, accurate)
- **Jump-diffusion**: Monte Carlo only (slower, but handles jumps)
- **Implied vol**: Newton-Raphson converges in 3-5 iterations

## Research References

1. **Ornstein-Uhlenbeck**: Uhlenbeck & Ornstein (1930), "On the Theory of Brownian Motion"
2. **Jump-Diffusion**: Merton (1976), "Option pricing when underlying stock returns are discontinuous"
3. **Energy Mean-Reversion**: Lucia & Schwartz (2002), "Electricity Prices and Power Derivatives"
4. **Implied Volatility**: Brenner & Subrahmanyam (1988), "A simple formula to compute implied volatility"

## Next Steps

- Add stochastic volatility (Heston model)
- Add regime-switching models (Markov chains)
- Add rough volatility (cutting-edge research)
- Add multi-asset correlation (portfolio hedging)

---

**Version:** 0.5.0  
**Author:** SolarPunk Protocol  
**Date:** January 2026

# Methodology: Cryptocurrency Energy Derivatives Pricing

## Overview

This document details the mathematical and computational methodology for pricing derivatives on cryptocurrency energy costs.

## 1. Energy Cost Analysis

### 1.1 Energy Cost Ratio

For a cryptocurrency with market data, we compute:

**Energy Cost Ratio (ECR):**

```
ECR_t = Market_Cap_t / Cumulative_Energy_Cost_t
```

Where:
- `Market_Cap_t = Price_t × Supply_t`
- `Cumulative_Energy_Cost_t = Σ(Energy_TWh_i × Electricity_Price_i)` for i = 1 to t

**Interpretation:**
- ECR > 1: Market values crypto above energy cost (typical)
- ECR < 1: Market values crypto below energy cost (rare, potential undervaluation)
- ECR trend: Indicates whether energy costs anchor value

### 1.2 Energy Unit Price Derivation

From ECR, we derive an "energy unit price" S_t:

```
S_t = ECR_t / ECR_0
```

Normalized to S_0 = 1 at the initial date.

**Alternative (Absolute):**

```
S_t = Market_Cap_t / (Cumulative_Energy_kWh_t × k)
```

Where k is a normalization constant (e.g., $/kWh).

### 1.3 Volatility Estimation

**Log Returns:**

```
r_t = ln(S_t / S_{t-1})
```

**Annualized Volatility:**

```
σ = std(r_t) × √(trading_periods_per_year)
```

For daily data: `trading_periods_per_year = 252` (crypto trades 365, but use 252 for consistency with traditional finance).

**Rolling Volatility:** Can also compute rolling window volatility:

```
σ_t = std(r_{t-n:t}) × √252
```

For n = 30, 60, or 90 days.

---

## 2. Forward Contract Pricing

### 2.1 No-Arbitrage Forward Price

For a forward contract delivering the underlying at time T:

```
F(T) = S_0 × exp(r × T)
```

Where:
- S_0 = Current energy unit price
- r = Risk-free rate (annualized)
- T = Time to maturity (years)

**Derivation:**
- Buy and hold underlying: Cost = S_0, Payoff = S_T
- Enter forward at F(T): Cost = 0, Payoff = S_T - F(T)
- No-arbitrage: F(T) = S_0 × exp(r × T)

### 2.2 Forward Curve

For multiple maturities T_1, T_2, ..., T_n:

```
F(T_i) = S_0 × exp(r × T_i)
```

**Interpretation:**
- Upward sloping if r > 0 (normal)
- Steepness indicates interest rate magnitude

---

## 3. European Option Pricing

### 3.1 Binomial Tree Model

**Parameters:**
- Time step: `Δt = T / N` where N = number of steps
- Up factor: `u = exp(σ × √Δt)`
- Down factor: `d = 1 / u`
- Risk-neutral probability: `q = (exp(r × Δt) - d) / (u - d)`

**Stock Price Lattice:**

At step i, node j:
```
S_{i,j} = S_0 × u^j × d^{i-j}
```

For i = 0 to N, j = 0 to i.

**Option Pricing (Backward Induction):**

At maturity (i = N):
```
V_{N,j} = payoff(S_{N,j})
```

For European call: `payoff(S) = max(S - K, 0)`

At earlier nodes (i < N):
```
V_{i,j} = exp(-r × Δt) × [q × V_{i+1,j+1} + (1-q) × V_{i+1,j}]
```

**Final Option Price:**
```
V_0 = V_{0,0}
```

### 3.2 European Put

For European put: `payoff(S) = max(K - S, 0)`

Same backward induction procedure.

---

## 4. American Option Pricing

### 4.1 Early Exercise

American options can be exercised at any time. At each node, compare:

**Hold value:**
```
V_hold = exp(-r × Δt) × [q × V_{i+1,j+1} + (1-q) × V_{i+1,j}]
```

**Exercise value:**
```
V_exercise = payoff(S_{i,j})
```

**Optimal decision:**
```
V_{i,j} = max(V_hold, V_exercise)
```

### 4.2 Optimal Exercise Boundary

The **exercise boundary** is the critical stock price S*(t) above which early exercise is optimal.

**Computation:**
- At each time step i, find the smallest j such that V_{i,j} = V_exercise
- S*_i = S_{i,j}

**Interpretation:**
- For American call: Exercise if S_t > S*(t)
- For American put: Exercise if S_t < S*(t)

### 4.3 Early Exercise Premium

**Early Exercise Premium:**
```
EEP = V_american - V_european
```

**Interpretation:**
- EEP > 0: Value of early exercise option
- Larger for puts than calls (on non-dividend assets)
- Increases with volatility

---

## 5. Backing Guarantee Pricing

### 5.1 Guarantee as Put Option

A guarantee that "token always redeemable for ≥ X% of energy value" is equivalent to:

**Issuer writes an American put option**

```
Guarantee Cost = American_Put(K = X% × S_0, T, r, σ)
```

**Interpretation:**
- Issuer must buy back tokens at guaranteed price
- This is a put option from issuer's perspective
- Cost increases with guarantee ratio

### 5.2 Reserve Requirement

To ensure solvency with confidence level α:

**Value at Risk (VaR):**
```
VaR_α = S_0 × exp((r - σ²/2) × T - σ × √T × Φ^{-1}(α))
```

Where Φ^{-1} is the inverse normal CDF.

**Reserve Requirement:**
```
Reserves = N_tokens × VaR_α
```

For α = 0.95 (95% confidence): `Φ^{-1}(0.95) = 1.645`

**Interpretation:**
- Higher volatility → Higher reserves needed
- Longer maturity → Higher reserves needed
- Higher confidence → Higher reserves needed

---

## 6. Greeks Calculation

### 6.1 Delta (Δ)

**Definition:** Sensitivity to underlying price

```
Δ = ∂V / ∂S ≈ (V(S + h) - V(S - h)) / (2h)
```

**Typical values:**
- Call option: Δ ∈ [0, 1]
- Put option: Δ ∈ [-1, 0]

**Interpretation:**
- Δ = 0.6: Option value increases $0.60 for $1 increase in S
- Δ ≈ 1: Deep in-the-money, behaves like stock
- Δ ≈ 0: Deep out-of-the-money, little sensitivity

### 6.2 Gamma (Γ)

**Definition:** Convexity, rate of change of Delta

```
Γ = ∂²V / ∂S² ≈ (V(S + h) - 2V(S) + V(S - h)) / h²
```

**Interpretation:**
- Γ > 0: Delta increases as S increases (long options)
- Γ ≈ 0: Delta stable (linear payoff)
- Large Γ: High convexity, delta changes rapidly

### 6.3 Vega (ν)

**Definition:** Sensitivity to volatility

```
ν = ∂V / ∂σ ≈ (V(σ + h) - V(σ - h)) / (2h)
```

**Interpretation:**
- ν > 0: Option value increases with volatility (always true)
- Large ν: Very sensitive to volatility estimates
- ATM options have highest Vega

### 6.4 Theta (Θ)

**Definition:** Time decay

```
Θ = -∂V / ∂T ≈ -(V(T - Δt) - V(T)) / Δt
```

**Interpretation:**
- Θ < 0: Option loses value as time passes (long options)
- Θ > 0: Option gains value over time (short options)
- |Θ| largest near expiry for ATM options

### 6.5 Rho (ρ)

**Definition:** Sensitivity to interest rate

```
ρ = ∂V / ∂r ≈ (V(r + h) - V(r - h)) / (2h)
```

**Interpretation:**
- ρ > 0 for calls: Higher rates increase call value
- ρ < 0 for puts: Higher rates decrease put value
- Usually smallest Greek (rates change slowly)

---

## 7. Computational Implementation

### 7.1 Binomial Tree Algorithm

```python
def binomial_tree_american(S0, K, T, r, sigma, N, option_type='call'):
    """
    Price American option using binomial tree.

    Returns:
        option_price: Fair value
        exercise_boundary: Optimal exercise prices
    """
    dt = T / N
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    q = (np.exp(r * dt) - d) / (u - d)

    # Stock price lattice
    S = np.zeros((N+1, N+1))
    for i in range(N+1):
        for j in range(i+1):
            S[i,j] = S0 * (u ** j) * (d ** (i - j))

    # Option value lattice
    V = np.zeros((N+1, N+1))

    # Terminal payoff
    for j in range(N+1):
        if option_type == 'call':
            V[N,j] = max(S[N,j] - K, 0)
        else:  # put
            V[N,j] = max(K - S[N,j], 0)

    # Backward induction
    exercise_boundary = []
    for i in range(N-1, -1, -1):
        for j in range(i+1):
            hold_value = np.exp(-r * dt) * (q * V[i+1,j+1] + (1-q) * V[i+1,j])

            if option_type == 'call':
                exercise_value = max(S[i,j] - K, 0)
            else:
                exercise_value = max(K - S[i,j], 0)

            V[i,j] = max(hold_value, exercise_value)

        # Record exercise boundary
        for j in range(i+1):
            if V[i,j] == exercise_value:
                exercise_boundary.append(S[i,j])
                break

    return V[0,0], exercise_boundary
```

### 7.2 Greeks via Finite Differences

```python
def compute_greeks(S0, K, T, r, sigma, N, option_type='call'):
    """Compute all Greeks via finite differences."""

    # Bump sizes
    h_S = S0 * 0.01  # 1% of spot
    h_sigma = 0.01   # 1%
    h_r = 0.0001     # 1 basis point
    h_T = 1/252      # 1 day

    # Base price
    V = binomial_price(S0, K, T, r, sigma, N, option_type)

    # Delta
    V_up = binomial_price(S0 + h_S, K, T, r, sigma, N, option_type)
    V_down = binomial_price(S0 - h_S, K, T, r, sigma, N, option_type)
    delta = (V_up - V_down) / (2 * h_S)

    # Gamma
    gamma = (V_up - 2*V + V_down) / (h_S ** 2)

    # Vega
    V_sigma_up = binomial_price(S0, K, T, r, sigma + h_sigma, N, option_type)
    V_sigma_down = binomial_price(S0, K, T, r, sigma - h_sigma, N, option_type)
    vega = (V_sigma_up - V_sigma_down) / (2 * h_sigma)

    # Theta
    V_T_down = binomial_price(S0, K, T - h_T, r, sigma, N, option_type)
    theta = -(V_T_down - V) / h_T

    # Rho
    V_r_up = binomial_price(S0, K, T, r + h_r, sigma, N, option_type)
    V_r_down = binomial_price(S0, K, T, r - h_r, sigma, N, option_type)
    rho = (V_r_up - V_r_down) / (2 * h_r)

    return {
        'Delta': delta,
        'Gamma': gamma,
        'Vega': vega,
        'Theta': theta,
        'Rho': rho
    }
```

---

## 8. Data Processing Pipeline

### 8.1 Data Loading

```
Raw CSV → Parse dates → Validate columns → Handle missing values → Output DataFrame
```

**Validation checks:**
- Date monotonicity
- Positive prices
- Positive energy consumption
- No extreme outliers (winsorize at 99.5%)

### 8.2 Energy Cost Computation

```
Price × Supply → Market Cap
Energy TWh × $/kWh → Daily Energy Cost
Cumsum(Daily Energy Cost) → Cumulative Energy Cost
Market Cap / Cumulative Energy Cost → ECR
Normalize ECR → Energy Unit Price S_t
```

### 8.3 Volatility Calibration

```
S_t series → Log returns → Remove outliers → Compute std dev → Annualize → σ
```

**Window options:**
- Full history: Use all data
- Rolling: 30, 60, 90 day windows
- Exponentially weighted: Recent data weighted higher

---

## 9. Validation & Testing

### 9.1 Convergence Tests

**Binomial Convergence:**
- Price option with N = 10, 20, 50, 100, 200, 500 steps
- Should converge to stable value
- Convergence rate: O(1/N)

**Target:** |V(N=500) - V(N=100)| < 0.01 × V(N=500)

### 9.2 Bounds Checking

**Call Option Bounds:**
```
max(S - K × exp(-r×T), 0) ≤ V_call ≤ S
```

**Put Option Bounds:**
```
max(K × exp(-r×T) - S, 0) ≤ V_put ≤ K × exp(-r×T)
```

### 9.3 Put-Call Parity

For European options:
```
C - P = S - K × exp(-r × T)
```

**Test:** Compute call and put, verify parity holds within numerical precision.

### 9.4 Greeks Consistency

**Delta bounds:**
- Call: 0 ≤ Δ ≤ 1
- Put: -1 ≤ Δ ≤ 0

**Gamma bounds:**
- Γ ≥ 0 (always)

**Vega bounds:**
- ν ≥ 0 (always)

---

## 10. Practical Considerations

### 10.1 Parameter Selection

**Strike Price (K):**
- At-the-money: K = S_0
- Out-of-the-money call: K > S_0
- In-the-money call: K < S_0

**Maturity (T):**
- Short-term: T = 0.25 (3 months)
- Medium-term: T = 1.0 (1 year)
- Long-term: T = 2.0 or 3.0

**Risk-free rate (r):**
- US Treasury yield (e.g., 5% → r = 0.05)
- Crypto borrowing rate (higher, e.g., 8-10%)

### 10.2 Sensitivity Analysis

Test how results change with:
- ±20% volatility
- ±2% interest rate
- ±10% strike price
- ±50% maturity

**Robust design:** Minimize sensitivity to uncertain parameters.

### 10.3 Computational Efficiency

**Speed optimizations:**
- Vectorize calculations (NumPy)
- Cache intermediate results
- Parallel computation for Greeks
- Use compiled code (Numba, Cython) for large N

**Trade-off:** N = 100 is typically sufficient (fast, accurate).

---

## References

1. Hull, J. C. (2021). *Options, Futures, and Other Derivatives* (11th ed.). Pearson.
2. Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics*, 7(3), 229-263.
3. Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy*, 81(3), 637-654.

---

**Document Version:** 1.0
**Last Updated:** November 13, 2025

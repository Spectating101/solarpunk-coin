import numpy as np
import pandas as pd
from scipy.stats import norm

# Constants from Thesis
S0 = 0.0525  # Spot ($/kWh)
K = 0.0525   # Strike (ATM)
T = 0.25     # 3 Months
r = 0.025    # Risk-free rate
N_sims = 10000

def black_scholes_put(S, K, T, r, sigma):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    put_price = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)
    return put_price

def calculate_margin(S, K, T, r, sigma, percentile=0.99):
    # Simulating terminal prices for VaR
    # This approximates the complex VaR logic from Pillar 3
    # Terminal distribution is Lognormal
    mu = (r - 0.5 * sigma**2) * T
    vol = sigma * np.sqrt(T)
    
    # 99th percentile of LOSS for a seller
    # Seller loses if Put expires ITM (Price drops)
    # But wait, Seller of Put loses if price drops. 
    # Max loss is Strike (if price goes to 0).
    # Margin usually covers the 99% worst move.
    
    # Let's simulate paths to match your Monte Carlo approach
    dt = T
    Z = np.random.normal(0, 1, N_sims)
    ST = S * np.exp((r - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
    
    payoffs = np.maximum(K - ST, 0)
    # 99th percentile of payoff (what the seller might have to pay)
    var_99 = np.percentile(payoffs, 99)
    
    return var_99 * 1.5 # 1.5x buffer

# Scenarios
volatilities = [1.89, 1.50, 1.00, 0.80, 0.50]
results = []

print(f"{'Vol(%)':<10} {'Premium($)':<12} {'Cost(%)':<10} {'Margin($)':<12} {'ROE(%)':<10}")
print("-" * 60)

for sig in volatilities:
    # Use BS for fast analytic pricing (GBM assumption same as your MC)
    prem = black_scholes_put(S0, K, T, r, sig)
    
    # Cost of Hedging = Premium / Strike
    cost_pct = (prem / K) * 100
    
    # Margin
    marg = calculate_margin(S0, K, T, r, sig)
    
    # Return on Equity (Seller) = Premium / Margin (Absolute return over 3 months)
    roe = (prem / marg) * 100
    
    results.append({
        "Vol": sig,
        "Premium": prem,
        "Cost%": cost_pct,
        "Margin": marg,
        "ROE": roe
    })
    
    print(f"{sig*100:<10.0f} {prem:<12.4f} {cost_pct:<10.1f} {marg:<12.4f} {roe:<10.1f}")

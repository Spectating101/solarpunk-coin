"""
Implied Volatility Calculation
===============================

Implements numerical methods to solve for implied volatility from observed
option prices. Critical for calibrating models to market data.

Key Functions:
-------------
implied_volatility_newton(): Fast Newton-Raphson solver
implied_volatility_bisection(): Robust bisection method
implied_volatility_brent(): Hybrid Brent's method
implied_vol_surface(): Calibrate entire volatility surface

Mathematical Background:
-----------------------
Given:
- Market price C_market
- Strike K, maturity T, spot S0, rate r

Find: σ such that BlackScholes(S0, K, r, σ, T) = C_market

Newton-Raphson:
σ_{n+1} = σ_n - [C(σ_n) - C_market] / vega(σ_n)

Converges in ~3-5 iterations for well-behaved inputs.
"""

import numpy as np
import pandas as pd
from typing import Optional, Dict, Tuple
from scipy import stats
from scipy.optimize import brentq, minimize_scalar
import warnings


def black_scholes_call(S0: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Black-Scholes formula for European call option.
    
    Parameters
    ----------
    S0 : float
        Current stock price
    K : float
        Strike price
    T : float
        Time to maturity (years)
    r : float
        Risk-free rate
    sigma : float
        Volatility
    
    Returns
    -------
    float
        Call option price
    """
    if sigma <= 0 or T <= 0:
        return max(S0 - K * np.exp(-r * T), 0)
    
    d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    return S0 * stats.norm.cdf(d1) - K * np.exp(-r * T) * stats.norm.cdf(d2)


def black_scholes_put(S0: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Black-Scholes formula for European put option.
    """
    if sigma <= 0 or T <= 0:
        return max(K * np.exp(-r * T) - S0, 0)
    
    d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    
    return K * np.exp(-r * T) * stats.norm.cdf(-d2) - S0 * stats.norm.cdf(-d1)


def vega(S0: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Vega: derivative of option price with respect to volatility.
    
    Vega = S0 * sqrt(T) * φ(d1)
    where φ is standard normal PDF.
    
    Parameters
    ----------
    S0, K, T, r, sigma : float
        Black-Scholes parameters
    
    Returns
    -------
    float
        Vega (∂C/∂σ)
    """
    if sigma <= 0 or T <= 0:
        return 0.0
    
    d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    return S0 * np.sqrt(T) * stats.norm.pdf(d1)


def implied_volatility_newton(market_price: float,
                               S0: float,
                               K: float,
                               T: float,
                               r: float,
                               option_type: str = 'call',
                               initial_guess: float = 0.3,
                               max_iterations: int = 100,
                               tolerance: float = 1e-6) -> Dict[str, float]:
    """
    Calculate implied volatility using Newton-Raphson method.
    
    Fast convergence (3-5 iterations typically) but can fail for
    out-of-the-money or near-expiry options.
    
    Parameters
    ----------
    market_price : float
        Observed market price of option
    S0 : float
        Current underlying price
    K : float
        Strike price
    T : float
        Time to maturity (years)
    r : float
        Risk-free rate
    option_type : str
        'call' or 'put'
    initial_guess : float
        Starting volatility estimate (default: 30%)
    max_iterations : int
        Maximum Newton iterations
    tolerance : float
        Convergence tolerance
    
    Returns
    -------
    dict
        'implied_vol': Implied volatility
        'iterations': Number of iterations
        'converged': Whether method converged
        'final_error': Final pricing error
    """
    # Input validation
    intrinsic_value = max(S0 - K, 0) if option_type == 'call' else max(K - S0, 0)
    if market_price < intrinsic_value:
        raise ValueError(f"Market price ({market_price}) below intrinsic value ({intrinsic_value})")
    
    if option_type not in ['call', 'put']:
        raise ValueError("option_type must be 'call' or 'put'")
    
    # Select pricing function
    price_func = black_scholes_call if option_type == 'call' else black_scholes_put
    
    sigma = initial_guess
    
    for i in range(max_iterations):
        # Compute price and vega at current sigma
        price = price_func(S0, K, T, r, sigma)
        v = vega(S0, K, T, r, sigma)
        
        # Check for numerical issues
        if v < 1e-10:
            warnings.warn(f"Vega too small ({v}), Newton-Raphson may be unstable")
            break
        
        # Newton update
        diff = price - market_price
        sigma_new = sigma - diff / v
        
        # Ensure sigma stays positive
        sigma_new = max(sigma_new, 0.001)
        sigma_new = min(sigma_new, 5.0)  # Cap at 500% vol
        
        # Check convergence
        if abs(sigma_new - sigma) < tolerance:
            return {
                'implied_vol': sigma_new,
                'iterations': i + 1,
                'converged': True,
                'final_error': abs(diff)
            }
        
        sigma = sigma_new
    
    # Did not converge
    return {
        'implied_vol': sigma,
        'iterations': max_iterations,
        'converged': False,
        'final_error': abs(price - market_price)
    }


def implied_volatility_bisection(market_price: float,
                                  S0: float,
                                  K: float,
                                  T: float,
                                  r: float,
                                  option_type: str = 'call',
                                  vol_min: float = 0.01,
                                  vol_max: float = 5.0,
                                  tolerance: float = 1e-6) -> Dict[str, float]:
    """
    Calculate implied volatility using bisection method.
    
    More robust than Newton-Raphson but slower (guaranteed convergence).
    
    Parameters
    ----------
    market_price : float
        Observed market price
    S0, K, T, r : float
        Black-Scholes parameters
    option_type : str
        'call' or 'put'
    vol_min, vol_max : float
        Search bounds for volatility
    tolerance : float
        Convergence tolerance
    
    Returns
    -------
    dict
        Implied volatility results
    """
    price_func = black_scholes_call if option_type == 'call' else black_scholes_put
    
    def objective(sigma):
        return price_func(S0, K, T, r, sigma) - market_price
    
    try:
        result = brentq(objective, vol_min, vol_max, xtol=tolerance, full_output=True)
        sigma_implied = result[0]
        converged = result[1].converged
        iterations = result[1].iterations
        
        return {
            'implied_vol': sigma_implied,
            'iterations': iterations,
            'converged': converged,
            'final_error': abs(objective(sigma_implied))
        }
    except ValueError as e:
        # Function doesn't change sign in [vol_min, vol_max]
        warnings.warn(f"Bisection failed: {str(e)}")
        return {
            'implied_vol': np.nan,
            'iterations': 0,
            'converged': False,
            'final_error': np.inf
        }


def implied_volatility_brent(market_price: float,
                             S0: float,
                             K: float,
                             T: float,
                             r: float,
                             option_type: str = 'call',
                             vol_min: float = 0.01,
                             vol_max: float = 5.0) -> Dict[str, float]:
    """
    Calculate implied volatility using Brent's method.
    
    Hybrid method combining bisection, secant, and inverse quadratic interpolation.
    Generally fastest robust method.
    
    Parameters
    ----------
    market_price : float
        Observed market price
    S0, K, T, r : float
        Black-Scholes parameters
    option_type : str
        'call' or 'put'
    vol_min, vol_max : float
        Search bounds
    
    Returns
    -------
    dict
        Implied volatility results
    """
    price_func = black_scholes_call if option_type == 'call' else black_scholes_put
    
    def objective(sigma):
        return abs(price_func(S0, K, T, r, sigma) - market_price)
    
    result = minimize_scalar(objective, bounds=(vol_min, vol_max), method='bounded')
    
    return {
        'implied_vol': result.x,
        'iterations': result.nfev,
        'converged': result.success,
        'final_error': result.fun
    }


def implied_volatility(market_price: float,
                      S0: float,
                      K: float,
                      T: float,
                      r: float,
                      option_type: str = 'call',
                      method: str = 'auto') -> float:
    """
    Calculate implied volatility (convenience function).
    
    Automatically selects best method:
    - Tries Newton-Raphson first (fast)
    - Falls back to Brent if Newton fails
    
    Parameters
    ----------
    market_price : float
        Observed option price
    S0, K, T, r : float
        Black-Scholes parameters
    option_type : str
        'call' or 'put'
    method : str
        'auto', 'newton', 'bisection', or 'brent'
    
    Returns
    -------
    float
        Implied volatility
    """
    if method == 'auto':
        # Try Newton first
        result = implied_volatility_newton(market_price, S0, K, T, r, option_type)
        if result['converged']:
            return result['implied_vol']
        else:
            # Fall back to Brent
            result = implied_volatility_brent(market_price, S0, K, T, r, option_type)
            return result['implied_vol']
    
    elif method == 'newton':
        result = implied_volatility_newton(market_price, S0, K, T, r, option_type)
        return result['implied_vol']
    
    elif method == 'bisection':
        result = implied_volatility_bisection(market_price, S0, K, T, r, option_type)
        return result['implied_vol']
    
    elif method == 'brent':
        result = implied_volatility_brent(market_price, S0, K, T, r, option_type)
        return result['implied_vol']
    
    else:
        raise ValueError(f"Unknown method: {method}")


def implied_vol_surface(market_data: pd.DataFrame,
                       S0: float,
                       r: float) -> pd.DataFrame:
    """
    Calibrate implied volatility surface from market option prices.
    
    Parameters
    ----------
    market_data : pd.DataFrame
        Columns: ['strike', 'maturity', 'call_price', 'put_price', 'option_type']
    S0 : float
        Current underlying price
    r : float
        Risk-free rate
    
    Returns
    -------
    pd.DataFrame
        market_data with added 'implied_vol' column
    """
    implied_vols = []
    
    for idx, row in market_data.iterrows():
        K = row['strike']
        T = row['maturity']
        option_type = row['option_type']
        
        market_price = row['call_price'] if option_type == 'call' else row['put_price']
        
        try:
            iv = implied_volatility(market_price, S0, K, T, r, option_type)
            implied_vols.append(iv)
        except Exception as e:
            warnings.warn(f"Failed to compute IV for strike={K}, T={T}: {str(e)}")
            implied_vols.append(np.nan)
    
    result = market_data.copy()
    result['implied_vol'] = implied_vols
    
    return result


def volatility_smile_moneyness(market_data: pd.DataFrame,
                               S0: float,
                               fixed_maturity: float) -> Tuple[np.ndarray, np.ndarray]:
    """
    Extract volatility smile for a fixed maturity.
    
    Parameters
    ----------
    market_data : pd.DataFrame
        With columns 'strike', 'maturity', 'implied_vol'
    S0 : float
        Current price
    fixed_maturity : float
        Target maturity to plot
    
    Returns
    -------
    moneyness : np.ndarray
        K/S0 ratios
    implied_vols : np.ndarray
        Corresponding implied volatilities
    """
    mask = np.abs(market_data['maturity'] - fixed_maturity) < 0.01
    subset = market_data[mask].copy()
    
    subset['moneyness'] = subset['strike'] / S0
    subset = subset.sort_values('moneyness')
    
    return subset['moneyness'].values, subset['implied_vol'].values


# Example usage and validation
def validate_implied_vol_calculation():
    """
    Test implied volatility calculation by round-trip:
    1. Price option with known σ
    2. Extract implied σ from price
    3. Verify σ_implied ≈ σ_true
    """
    # Test parameters
    S0 = 100
    K = 105
    T = 0.25
    r = 0.05
    sigma_true = 0.30
    
    # Price call option
    true_price = black_scholes_call(S0, K, T, r, sigma_true)
    
    # Extract implied vol
    sigma_implied = implied_volatility(true_price, S0, K, T, r, option_type='call')
    
    # Check accuracy
    error = abs(sigma_implied - sigma_true)
    
    print(f"True volatility: {sigma_true:.6f}")
    print(f"Implied volatility: {sigma_implied:.6f}")
    print(f"Error: {error:.2e}")
    
    assert error < 1e-6, f"Implied vol error too large: {error}"
    
    return True


if __name__ == "__main__":
    # Run validation
    validate_implied_vol_calculation()
    print("\n✅ Implied volatility calculation validated")

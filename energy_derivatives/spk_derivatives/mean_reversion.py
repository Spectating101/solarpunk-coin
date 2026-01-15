"""
Mean-Reversion Models for Energy Derivatives
=============================================

Implements Ornstein-Uhlenbeck and Vasicek models for mean-reverting energy prices.
Unlike GBM (used for equities), energy prices revert to long-run mean due to
storage limitations and supply/demand equilibrium.

Key Classes:
-----------
OrnsteinUhlenbeck: OU process for energy price modeling
VasicekModel: Interest rate model adapted for energy

Key Methods:
-----------
simulate_paths(): Generate mean-reverting price paths
price_option(): Price options under mean-reversion
calibrate(): Estimate parameters from historical data

Mathematical Background:
-----------------------
OU Process: dS_t = κ(θ - S_t)dt + σ dW_t
- κ: Speed of mean reversion (higher = faster reversion)
- θ: Long-run mean (equilibrium price)
- σ: Volatility (constant)

Exact Solution:
S_t = θ + (S_0 - θ)e^(-κt) + σ∫₀ᵗ e^(-κ(t-s)) dW_s

Motivation for Energy:
- Electricity cannot be stored → excess supply drives prices down
- Shortage drives prices up → but new supply comes online
- Prices oscillate around long-run marginal cost (θ)
"""

import numpy as np
import pandas as pd
from typing import Tuple, Dict, List, Optional
from scipy import stats
from scipy.optimize import minimize
import warnings


class OrnsteinUhlenbeck:
    """
    Ornstein-Uhlenbeck process for mean-reverting energy prices.
    
    Process: dS_t = κ(θ - S_t)dt + σ dW_t
    
    Parameters
    ----------
    S0 : float
        Initial price
    kappa : float
        Speed of mean reversion (≥ 0)
    theta : float
        Long-run mean (equilibrium price)
    sigma : float
        Volatility (constant)
    T : float
        Time horizon (years)
    r : float
        Risk-free rate (for discounting)
    """
    
    def __init__(self,
                 S0: float,
                 kappa: float,
                 theta: float,
                 sigma: float,
                 T: float,
                 r: float = 0.02):
        """Initialize Ornstein-Uhlenbeck model."""
        
        if S0 <= 0:
            raise ValueError("S0 must be positive")
        if kappa < 0:
            raise ValueError("kappa must be non-negative")
        if sigma <= 0:
            raise ValueError("sigma must be positive")
        if T <= 0:
            raise ValueError("T must be positive")
        
        self.S0 = S0
        self.kappa = kappa
        self.theta = theta
        self.sigma = sigma
        self.T = T
        self.r = r
    
    def simulate_paths(self,
                      num_paths: int = 10000,
                      num_steps: int = 252,
                      seed: Optional[int] = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        Simulate OU process paths using exact discretization.
        
        Exact solution at discrete times:
        S_{t+Δt} = θ + (S_t - θ)e^(-κΔt) + σ√[(1-e^(-2κΔt))/(2κ)] Z
        where Z ~ N(0,1)
        
        Parameters
        ----------
        num_paths : int
            Number of simulation paths
        num_steps : int
            Number of time steps per path
        seed : int, optional
            Random seed for reproducibility
        
        Returns
        -------
        times : np.ndarray
            Time grid [0, Δt, 2Δt, ..., T]
        paths : np.ndarray
            Simulated paths (num_steps+1, num_paths)
        """
        rng = np.random.default_rng(seed)
        dt = self.T / num_steps
        times = np.linspace(0, self.T, num_steps + 1)
        
        # Initialize paths
        paths = np.zeros((num_steps + 1, num_paths))
        paths[0, :] = self.S0
        
        # Exact discretization parameters
        exp_kappa_dt = np.exp(-self.kappa * dt)
        if self.kappa > 1e-8:  # Avoid division by zero
            std_increment = self.sigma * np.sqrt((1 - np.exp(-2 * self.kappa * dt)) / (2 * self.kappa))
        else:
            # Limit as kappa → 0 (Brownian motion)
            std_increment = self.sigma * np.sqrt(dt)
        
        # Simulate paths
        for i in range(num_steps):
            Z = rng.standard_normal(num_paths)
            paths[i+1, :] = self.theta + (paths[i, :] - self.theta) * exp_kappa_dt + std_increment * Z
        
        return times, paths
    
    def expected_value(self, t: float) -> float:
        """
        Expected value of S_t given S_0.
        
        E[S_t | S_0] = θ + (S_0 - θ)e^(-κt)
        """
        return self.theta + (self.S0 - self.theta) * np.exp(-self.kappa * t)
    
    def variance(self, t: float) -> float:
        """
        Variance of S_t given S_0.
        
        Var[S_t | S_0] = (σ²/2κ)(1 - e^(-2κt))
        """
        if self.kappa > 1e-8:
            return (self.sigma**2 / (2 * self.kappa)) * (1 - np.exp(-2 * self.kappa * t))
        else:
            return self.sigma**2 * t
    
    def price_european_call(self,
                           K: float,
                           num_paths: int = 100000,
                           seed: Optional[int] = None) -> Dict[str, float]:
        """
        Price European call option via Monte Carlo.
        
        Payoff: max(S_T - K, 0)
        Price: e^(-rT) E[max(S_T - K, 0)]
        
        Parameters
        ----------
        K : float
            Strike price
        num_paths : int
            Number of simulation paths
        seed : int, optional
            Random seed
        
        Returns
        -------
        dict
            'price': Option price
            'std_error': Standard error of estimate
            'ci_lower': 95% CI lower bound
            'ci_upper': 95% CI upper bound
        """
        _, paths = self.simulate_paths(num_paths=num_paths, num_steps=1, seed=seed)
        S_T = paths[-1, :]
        
        payoffs = np.maximum(S_T - K, 0)
        discounted_payoffs = np.exp(-self.r * self.T) * payoffs
        
        price = np.mean(discounted_payoffs)
        std_error = np.std(discounted_payoffs) / np.sqrt(num_paths)
        ci_half_width = 1.96 * std_error
        
        return {
            'price': price,
            'std_error': std_error,
            'ci_lower': price - ci_half_width,
            'ci_upper': price + ci_half_width
        }
    
    def price_european_put(self,
                          K: float,
                          num_paths: int = 100000,
                          seed: Optional[int] = None) -> Dict[str, float]:
        """
        Price European put option via Monte Carlo.
        
        Payoff: max(K - S_T, 0)
        """
        _, paths = self.simulate_paths(num_paths=num_paths, num_steps=1, seed=seed)
        S_T = paths[-1, :]
        
        payoffs = np.maximum(K - S_T, 0)
        discounted_payoffs = np.exp(-self.r * self.T) * payoffs
        
        price = np.mean(discounted_payoffs)
        std_error = np.std(discounted_payoffs) / np.sqrt(num_paths)
        ci_half_width = 1.96 * std_error
        
        return {
            'price': price,
            'std_error': std_error,
            'ci_lower': price - ci_half_width,
            'ci_upper': price + ci_half_width
        }
    
    @staticmethod
    def calibrate_from_data(prices: np.ndarray,
                           dt: float = 1/252) -> Dict[str, float]:
        """
        Calibrate OU parameters from historical price data.
        
        Uses Maximum Likelihood Estimation for discrete observations.
        
        Parameters
        ----------
        prices : np.ndarray
            Historical price series
        dt : float
            Time step between observations (default: 1 trading day)
        
        Returns
        -------
        dict
            Estimated parameters: kappa, theta, sigma
        """
        if len(prices) < 10:
            raise ValueError("Need at least 10 observations for calibration")
        
        # OLS regression: ΔS = α + β*S + ε
        # Then: κ = -β/dt, θ = -α/β, σ = std(ε)/√dt
        S = prices[:-1]
        dS = np.diff(prices)
        
        # Linear regression
        X = np.vstack([np.ones_like(S), S]).T
        coeffs = np.linalg.lstsq(X, dS, rcond=None)[0]
        alpha, beta = coeffs
        
        # Estimate parameters
        if beta >= 0:
            warnings.warn("Non-negative β detected, prices may not be mean-reverting")
            kappa = 0.001  # Small positive value
        else:
            kappa = -beta / dt
        
        theta = -alpha / beta if beta != 0 else np.mean(prices)
        
        # Estimate sigma from residuals
        residuals = dS - (alpha + beta * S)
        sigma = np.std(residuals) / np.sqrt(dt)
        
        # Half-life (time to revert halfway to mean)
        half_life = np.log(2) / kappa if kappa > 0 else np.inf
        
        return {
            'kappa': kappa,
            'theta': theta,
            'sigma': sigma,
            'half_life_days': half_life * 252,  # Convert to trading days
            'r_squared': 1 - np.var(residuals) / np.var(dS)
        }
    
    def get_params_summary(self) -> pd.DataFrame:
        """
        Return summary of model parameters.
        """
        half_life = np.log(2) / self.kappa if self.kappa > 0 else np.inf
        
        data = {
            'Parameter': ['S0', 'kappa', 'theta', 'sigma', 'T', 'r', 'half_life_days'],
            'Value': [
                self.S0,
                self.kappa,
                self.theta,
                self.sigma,
                self.T,
                self.r,
                half_life * 252
            ],
            'Description': [
                'Initial price',
                'Speed of mean reversion',
                'Long-run mean',
                'Volatility',
                'Time horizon (years)',
                'Risk-free rate',
                'Half-life (trading days)'
            ]
        }
        
        return pd.DataFrame(data)


class VasicekModel:
    """
    Vasicek model (interest rate model adapted for energy prices).
    
    Same mathematical form as OU, but with slightly different interpretation.
    Allows negative prices theoretically (not ideal for energy, but useful for spreads).
    
    Process: dr_t = κ(θ - r_t)dt + σ dW_t
    """
    
    def __init__(self, *args, **kwargs):
        """
        Initialize Vasicek model (wraps OU process).
        """
        self.ou = OrnsteinUhlenbeck(*args, **kwargs)
    
    def __getattr__(self, name):
        """
        Delegate all methods to underlying OU process.
        """
        return getattr(self.ou, name)


# Convenience functions
def estimate_mean_reversion_speed(prices: np.ndarray, dt: float = 1/252) -> float:
    """
    Quick estimate of mean reversion speed κ.
    
    Parameters
    ----------
    prices : np.ndarray
        Historical prices
    dt : float
        Time step
    
    Returns
    -------
    float
        Estimated κ (annual)
    """
    params = OrnsteinUhlenbeck.calibrate_from_data(prices, dt)
    return params['kappa']


def compare_gbm_vs_ou(S0: float,
                     mu: float,
                     sigma: float,
                     kappa: float,
                     theta: float,
                     T: float = 1.0,
                     num_paths: int = 100) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Compare GBM vs OU paths for visualization.
    
    Parameters
    ----------
    S0 : float
        Initial price
    mu : float
        GBM drift
    sigma : float
        Volatility (same for both)
    kappa : float
        OU mean reversion speed
    theta : float
        OU long-run mean
    T : float
        Time horizon
    num_paths : int
        Number of paths to simulate
    
    Returns
    -------
    times : np.ndarray
        Time grid
    gbm_paths : np.ndarray
        GBM simulated paths
    ou_paths : np.ndarray
        OU simulated paths
    """
    num_steps = int(T * 252)
    dt = T / num_steps
    times = np.linspace(0, T, num_steps + 1)
    
    # GBM paths
    gbm_paths = np.zeros((num_steps + 1, num_paths))
    gbm_paths[0, :] = S0
    
    rng = np.random.default_rng(42)
    for i in range(num_steps):
        Z = rng.standard_normal(num_paths)
        gbm_paths[i+1, :] = gbm_paths[i, :] * np.exp((mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*Z)
    
    # OU paths
    ou = OrnsteinUhlenbeck(S0, kappa, theta, sigma, T)
    _, ou_paths = ou.simulate_paths(num_paths=num_paths, num_steps=num_steps, seed=42)
    
    return times, gbm_paths, ou_paths

"""
Jump-Diffusion Models for Energy Derivatives
============================================

Implements Merton jump-diffusion model for energy prices with discontinuous jumps.
Energy markets experience sudden price spikes due to grid failures, weather events,
and supply shocks that cannot be captured by continuous diffusion models.

Key Classes:
-----------
MertonJumpDiffusion: Combined GBM + Poisson jumps
EnergyJumpModel: Specialized for energy market jump characteristics

Key Methods:
-----------
simulate_paths(): Generate paths with random jumps
price_option(): Price options accounting for jump risk
calibrate_from_data(): Estimate jump parameters from historical prices

Mathematical Background:
-----------------------
Jump-Diffusion SDE:
dS_t = μS_t dt + σS_t dW_t + S_t dJ_t

where:
- μ: Drift (continuous component)
- σ: Volatility (continuous component)
- J_t: Compound Poisson process with intensity λ
- Jump sizes: Y ~ N(μ_J, σ_J²) (log-normal)

Solution:
S_t = S_0 exp[(μ - σ²/2)t + σW_t] × ∏(1 + Y_i)

Jump Examples in Energy:
- Texas 2021 freeze: Electricity price jumped from $50 to $9,000/MWh
- California rolling blackouts: 500%+ spikes
- Grid failures: Sudden 10x price increases
"""

import numpy as np
import pandas as pd
from typing import Tuple, Dict, List, Optional
from scipy import stats
import warnings


class MertonJumpDiffusion:
    """
    Merton's jump-diffusion model for asset prices with discontinuous jumps.
    
    Process:
    dS_t = μS_t dt + σS_t dW_t + S_t dJ_t
    
    Jump component:
    - Jumps arrive with Poisson intensity λ (e.g., λ=2 → 2 jumps per year on average)
    - Jump sizes are log-normal: ln(1+Y) ~ N(μ_J, σ_J²)
    
    Parameters
    ----------
    S0 : float
        Initial price
    mu : float
        Drift rate (continuous component)
    sigma : float
        Volatility (continuous diffusion)
    lambda_jump : float
        Jump intensity (Poisson rate, per year)
    mu_jump : float
        Mean of log-jump size
    sigma_jump : float
        Std dev of log-jump size
    T : float
        Time horizon (years)
    r : float
        Risk-free rate
    """
    
    def __init__(self,
                 S0: float,
                 mu: float,
                 sigma: float,
                 lambda_jump: float,
                 mu_jump: float,
                 sigma_jump: float,
                 T: float,
                 r: float = 0.02):
        """Initialize Merton jump-diffusion model."""
        
        if S0 <= 0:
            raise ValueError("S0 must be positive")
        if sigma < 0:
            raise ValueError("sigma must be non-negative")
        if lambda_jump < 0:
            raise ValueError("lambda_jump must be non-negative")
        if sigma_jump < 0:
            raise ValueError("sigma_jump must be non-negative")
        if T <= 0:
            raise ValueError("T must be positive")
        
        self.S0 = S0
        self.mu = mu
        self.sigma = sigma
        self.lambda_jump = lambda_jump
        self.mu_jump = mu_jump
        self.sigma_jump = sigma_jump
        self.T = T
        self.r = r
    
    def simulate_paths(self,
                      num_paths: int = 10000,
                      num_steps: int = 252,
                      seed: Optional[int] = None) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Simulate jump-diffusion paths.
        
        Algorithm:
        1. Generate Poisson jump times
        2. Generate jump sizes from log-normal distribution
        3. Combine with continuous GBM component
        
        Parameters
        ----------
        num_paths : int
            Number of simulation paths
        num_steps : int
            Number of time steps per path
        seed : int, optional
            Random seed
        
        Returns
        -------
        times : np.ndarray
            Time grid
        paths : np.ndarray
            Price paths (num_steps+1, num_paths)
        jump_counts : np.ndarray
            Number of jumps per path
        """
        rng = np.random.default_rng(seed)
        dt = self.T / num_steps
        times = np.linspace(0, self.T, num_steps + 1)
        
        # Initialize paths
        paths = np.zeros((num_steps + 1, num_paths))
        paths[0, :] = self.S0
        jump_counts = np.zeros(num_paths, dtype=int)
        
        for i in range(num_steps):
            # Continuous diffusion component
            Z = rng.standard_normal(num_paths)
            drift = (self.mu - 0.5 * self.sigma**2) * dt
            diffusion = self.sigma * np.sqrt(dt) * Z
            
            # Jump component
            # Number of jumps in interval dt ~ Poisson(λ * dt)
            num_jumps = rng.poisson(self.lambda_jump * dt, size=num_paths)
            jump_counts += num_jumps
            
            # Sum of jump sizes (log-normal)
            total_jump = np.zeros(num_paths)
            for j in range(num_paths):
                if num_jumps[j] > 0:
                    # Each jump: ln(1+Y) ~ N(μ_J, σ_J²)
                    log_jumps = rng.normal(self.mu_jump, self.sigma_jump, size=num_jumps[j])
                    total_jump[j] = np.sum(log_jumps)
            
            # Update price
            paths[i+1, :] = paths[i, :] * np.exp(drift + diffusion + total_jump)
        
        return times, paths, jump_counts
    
    def price_european_call_mc(self,
                               K: float,
                               num_paths: int = 100000,
                               seed: Optional[int] = None) -> Dict[str, float]:
        """
        Price European call option via Monte Carlo.
        
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
            Pricing results with confidence intervals
        """
        _, paths, _ = self.simulate_paths(num_paths=num_paths, num_steps=1, seed=seed)
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
    
    def price_european_call_analytical(self, K: float, num_terms: int = 50) -> float:
        """
        Price European call using Merton's analytical formula.
        
        Merton's formula (series expansion):
        C = Σ[n=0 to ∞] (e^(-λT) (λT)^n / n!) × BS(S0, K, r_n, σ_n, T)
        
        where:
        - r_n = r - λk + n*ln(k)/T
        - σ_n² = σ² + n*σ_J²/T
        - k = E[1+Y] = exp(μ_J + σ_J²/2)
        
        Parameters
        ----------
        K : float
            Strike price
        num_terms : int
            Number of terms in series (convergence)
        
        Returns
        -------
        float
            Option price
        """
        # Expected jump size
        k = np.exp(self.mu_jump + 0.5 * self.sigma_jump**2)
        
        price = 0.0
        for n in range(num_terms):
            # Probability of n jumps
            from math import factorial
            prob_n = np.exp(-self.lambda_jump * self.T) * \
                     (self.lambda_jump * self.T)**n / factorial(n)
            
            # Adjusted parameters
            r_n = self.r - self.lambda_jump * k + n * np.log(k) / self.T
            sigma_n_sq = self.sigma**2 + n * self.sigma_jump**2 / self.T
            sigma_n = np.sqrt(sigma_n_sq)
            
            # Black-Scholes for this jump scenario
            bs_price = self._black_scholes_call(self.S0, K, r_n, sigma_n, self.T)
            
            price += prob_n * bs_price
            
            # Check convergence
            if n > 10 and prob_n * bs_price < 1e-10:
                break
        
        return price
    
    @staticmethod
    def _black_scholes_call(S0: float, K: float, r: float, sigma: float, T: float) -> float:
        """
        Black-Scholes formula for European call.
        """
        if sigma == 0:
            return max(S0 * np.exp(r * T) - K, 0) * np.exp(-r * T)
        
        d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)
        
        call_price = S0 * stats.norm.cdf(d1) - K * np.exp(-r * T) * stats.norm.cdf(d2)
        return call_price
    
    @staticmethod
    def calibrate_from_data(prices: np.ndarray,
                           dt: float = 1/252,
                           jump_threshold: float = 3.0) -> Dict[str, float]:
        """
        Calibrate jump-diffusion parameters from historical prices.
        
        Algorithm:
        1. Identify jumps: Returns exceeding jump_threshold × σ
        2. Estimate λ from frequency of jumps
        3. Estimate μ_J, σ_J from identified jump sizes
        4. Estimate μ, σ from continuous component
        
        Parameters
        ----------
        prices : np.ndarray
            Historical price series
        dt : float
            Time step between observations
        jump_threshold : float
            Threshold for jump detection (multiples of σ)
        
        Returns
        -------
        dict
            Calibrated parameters
        """
        if len(prices) < 50:
            raise ValueError("Need at least 50 observations for jump calibration")
        
        # Compute log-returns
        log_returns = np.diff(np.log(prices))
        
        # Initial volatility estimate (includes jumps)
        total_vol = np.std(log_returns)
        
        # Identify jumps (|return| > threshold × σ)
        threshold_value = jump_threshold * total_vol
        jump_mask = np.abs(log_returns) > threshold_value
        jump_returns = log_returns[jump_mask]
        normal_returns = log_returns[~jump_mask]
        
        # Estimate jump parameters
        num_jumps = np.sum(jump_mask)
        lambda_jump = num_jumps / (len(log_returns) * dt)  # Jumps per year
        
        if num_jumps > 0:
            mu_jump = np.mean(jump_returns)
            sigma_jump = np.std(jump_returns)
        else:
            mu_jump = 0.0
            sigma_jump = 0.1
            warnings.warn("No jumps detected, using default jump parameters")
        
        # Estimate continuous component from non-jump returns
        if len(normal_returns) > 0:
            mu = np.mean(normal_returns) / dt
            sigma = np.std(normal_returns) / np.sqrt(dt)
        else:
            mu = 0.0
            sigma = total_vol / np.sqrt(dt)
        
        return {
            'mu': mu,
            'sigma': sigma,
            'lambda_jump': lambda_jump,
            'mu_jump': mu_jump,
            'sigma_jump': sigma_jump,
            'num_jumps_detected': num_jumps,
            'jump_frequency_pct': 100 * num_jumps / len(log_returns)
        }
    
    def get_params_summary(self) -> pd.DataFrame:
        """
        Return summary of model parameters.
        """
        expected_num_jumps = self.lambda_jump * self.T
        expected_jump_size = np.exp(self.mu_jump + 0.5 * self.sigma_jump**2) - 1
        
        data = {
            'Parameter': ['S0', 'mu', 'sigma', 'lambda', 'mu_jump', 'sigma_jump', 
                         'T', 'r', 'expected_jumps', 'avg_jump_size'],
            'Value': [
                self.S0,
                self.mu,
                self.sigma,
                self.lambda_jump,
                self.mu_jump,
                self.sigma_jump,
                self.T,
                self.r,
                expected_num_jumps,
                expected_jump_size
            ],
            'Description': [
                'Initial price',
                'Drift (continuous)',
                'Volatility (continuous)',
                'Jump intensity (per year)',
                'Mean log-jump size',
                'Std dev log-jump size',
                'Time horizon (years)',
                'Risk-free rate',
                'Expected number of jumps',
                'Average jump size (%)'
            ]
        }
        
        return pd.DataFrame(data)


class EnergyJumpModel(MertonJumpDiffusion):
    """
    Specialized jump-diffusion model for energy markets.
    
    Calibrated with energy-specific jump characteristics:
    - Higher jump frequency during extreme weather
    - Positive jumps more likely (supply shocks)
    - Very large tail risk (>10x price spikes possible)
    """
    
    def __init__(self,
                 S0: float,
                 base_volatility: float = 0.3,
                 jump_intensity: float = 2.0,
                 T: float = 1.0,
                 energy_type: str = 'electricity'):
        """
        Initialize energy-specific jump model with calibrated defaults.
        
        Parameters
        ----------
        S0 : float
            Initial energy price
        base_volatility : float
            Continuous volatility (default: 30% for electricity)
        jump_intensity : float
            Expected jumps per year (default: 2 for electricity)
        T : float
            Time horizon
        energy_type : str
            'electricity', 'solar', 'wind' (affects jump parameters)
        """
        # Energy-specific jump parameters
        jump_params = {
            'electricity': {'mu_jump': 0.5, 'sigma_jump': 1.0},  # Large positive jumps
            'solar': {'mu_jump': 0.2, 'sigma_jump': 0.5},         # Moderate jumps
            'wind': {'mu_jump': 0.3, 'sigma_jump': 0.7}           # Moderate-high jumps
        }
        
        params = jump_params.get(energy_type, jump_params['electricity'])
        
        super().__init__(
            S0=S0,
            mu=0.0,  # Risk-neutral drift
            sigma=base_volatility,
            lambda_jump=jump_intensity,
            mu_jump=params['mu_jump'],
            sigma_jump=params['sigma_jump'],
            T=T,
            r=0.02
        )
        
        self.energy_type = energy_type


# Convenience functions
def detect_jumps_in_data(prices: np.ndarray, threshold: float = 3.0) -> Dict[str, any]:
    """
    Detect and analyze jumps in historical price data.
    
    Parameters
    ----------
    prices : np.ndarray
        Historical prices
    threshold : float
        Jump detection threshold (multiples of σ)
    
    Returns
    -------
    dict
        Jump statistics and indices
    """
    log_returns = np.diff(np.log(prices))
    vol = np.std(log_returns)
    
    jump_mask = np.abs(log_returns) > threshold * vol
    jump_indices = np.where(jump_mask)[0]
    jump_sizes = log_returns[jump_mask]
    
    return {
        'num_jumps': len(jump_indices),
        'jump_indices': jump_indices,
        'jump_sizes': jump_sizes,
        'largest_jump': np.max(np.abs(jump_sizes)) if len(jump_sizes) > 0 else 0,
        'avg_jump_size': np.mean(np.abs(jump_sizes)) if len(jump_sizes) > 0 else 0
    }

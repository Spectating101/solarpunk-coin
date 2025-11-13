"""
Greeks Calculator for Options
==============================

Compute option Greeks (sensitivities) using finite difference methods:
- Delta: ∂V/∂S
- Gamma: ∂²V/∂S²
- Vega: ∂V/∂σ
- Theta: -∂V/∂T
- Rho: ∂V/∂r

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import numpy as np
import pandas as pd
from typing import Dict, Optional
from .american_option import AmericanOptionPricer


class GreeksCalculator:
    """
    Calculate option Greeks using finite differences.

    Parameters
    ----------
    S0 : float
        Current underlying price
    K : float
        Strike price
    T : float
        Time to maturity
    r : float
        Risk-free rate
    sigma : float
        Volatility
    option_type : str
        'call' or 'put'
    N : int
        Number of steps for binomial tree

    Examples
    --------
    >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
    >>> greeks = calc.compute_all_greeks()
    >>> print(greeks)
    """

    def __init__(
        self,
        S0: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        option_type: str = 'call',
        N: int = 100
    ):
        """Initialize Greeks calculator."""
        self.S0 = S0
        self.K = K
        self.T = T
        self.r = r
        self.sigma = sigma
        self.option_type = option_type
        self.N = N

        # Bump sizes (relative)
        self.h_S = S0 * 0.01  # 1% of spot
        self.h_sigma = 0.01  # 1 percentage point
        self.h_r = 0.0001  # 1 basis point
        self.h_T = 1/252  # 1 day

    def _price_option(self, S: float, K: float, T: float, r: float, sigma: float) -> float:
        """Price American option with given parameters."""
        pricer = AmericanOptionPricer(
            S0=S, K=K, T=T, r=r, sigma=sigma,
            N=self.N, option_type=self.option_type
        )
        return pricer.price()

    def compute_delta(self) -> float:
        """
        Compute Delta: ∂V/∂S

        Delta measures sensitivity to underlying price changes.

        Returns
        -------
        float
            Delta value

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> delta = calc.compute_delta()
        >>> print(f"Delta: {delta:.4f}")
        """
        V_up = self._price_option(self.S0 + self.h_S, self.K, self.T, self.r, self.sigma)
        V_down = self._price_option(self.S0 - self.h_S, self.K, self.T, self.r, self.sigma)

        delta = (V_up - V_down) / (2 * self.h_S)
        return float(delta)

    def compute_gamma(self) -> float:
        """
        Compute Gamma: ∂²V/∂S²

        Gamma measures rate of change of Delta (convexity).

        Returns
        -------
        float
            Gamma value

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> gamma = calc.compute_gamma()
        """
        V = self._price_option(self.S0, self.K, self.T, self.r, self.sigma)
        V_up = self._price_option(self.S0 + self.h_S, self.K, self.T, self.r, self.sigma)
        V_down = self._price_option(self.S0 - self.h_S, self.K, self.T, self.r, self.sigma)

        gamma = (V_up - 2*V + V_down) / (self.h_S ** 2)
        return float(gamma)

    def compute_vega(self) -> float:
        """
        Compute Vega: ∂V/∂σ

        Vega measures sensitivity to volatility changes.

        Returns
        -------
        float
            Vega value

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> vega = calc.compute_vega()
        """
        V_up = self._price_option(self.S0, self.K, self.T, self.r, self.sigma + self.h_sigma)
        V_down = self._price_option(self.S0, self.K, self.T, self.r, self.sigma - self.h_sigma)

        vega = (V_up - V_down) / (2 * self.h_sigma)
        return float(vega)

    def compute_theta(self) -> float:
        """
        Compute Theta: -∂V/∂T

        Theta measures time decay (negative for long positions).

        Returns
        -------
        float
            Theta value

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> theta = calc.compute_theta()
        """
        if self.T <= self.h_T:
            # Too close to maturity
            return 0.0

        V = self._price_option(self.S0, self.K, self.T, self.r, self.sigma)
        V_down = self._price_option(self.S0, self.K, self.T - self.h_T, self.r, self.sigma)

        theta = -(V_down - V) / self.h_T
        return float(theta)

    def compute_rho(self) -> float:
        """
        Compute Rho: ∂V/∂r

        Rho measures sensitivity to interest rate changes.

        Returns
        -------
        float
            Rho value

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> rho = calc.compute_rho()
        """
        V_up = self._price_option(self.S0, self.K, self.T, self.r + self.h_r, self.sigma)
        V_down = self._price_option(self.S0, self.K, self.T, self.r - self.h_r, self.sigma)

        rho = (V_up - V_down) / (2 * self.h_r)
        return float(rho)

    def compute_all_greeks(self) -> Dict[str, float]:
        """
        Compute all Greeks at once.

        Returns
        -------
        Dict[str, float]
            Dictionary with all Greeks

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> greeks = calc.compute_all_greeks()
        >>> for name, value in greeks.items():
        ...     print(f"{name}: {value:.4f}")
        """
        greeks = {
            'Delta': self.compute_delta(),
            'Gamma': self.compute_gamma(),
            'Vega': self.compute_vega(),
            'Theta': self.compute_theta(),
            'Rho': self.compute_rho(),
        }
        return greeks

    def to_dataframe(self) -> pd.DataFrame:
        """
        Return Greeks as a formatted DataFrame.

        Returns
        -------
        pd.DataFrame
            Greeks in table format

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> df = calc.to_dataframe()
        >>> print(df)
        """
        greeks = self.compute_all_greeks()

        df = pd.DataFrame({
            'Greek': list(greeks.keys()),
            'Value': list(greeks.values()),
        })

        # Add interpretations
        interpretations = {
            'Delta': f'{greeks["Delta"]:.1%} exposure to underlying',
            'Gamma': f'Delta changes by {greeks["Gamma"]:.4f} per $1 move',
            'Vega': f'${greeks["Vega"]:.4f} gain per 1pp vol increase',
            'Theta': f'${greeks["Theta"]:.4f} daily time decay',
            'Rho': f'${greeks["Rho"]:.4f} gain per 1bp rate increase',
        }

        df['Interpretation'] = df['Greek'].map(interpretations)

        return df

    def greeks_surface(self, S_range: tuple, n_points: int = 20) -> pd.DataFrame:
        """
        Compute Greeks across a range of spot prices.

        Parameters
        ----------
        S_range : tuple
            (min_S, max_S) range
        n_points : int
            Number of points to compute

        Returns
        -------
        pd.DataFrame
            Greeks for each spot price

        Examples
        --------
        >>> calc = GreeksCalculator(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
        >>> surface = calc.greeks_surface(S_range=(0.5, 1.5), n_points=10)
        """
        S_values = np.linspace(S_range[0], S_range[1], n_points)
        results = []

        original_S0 = self.S0

        for S in S_values:
            self.S0 = S
            self.h_S = S * 0.01  # Adjust bump size

            greeks = self.compute_all_greeks()
            greeks['S'] = S
            results.append(greeks)

        # Restore original S0
        self.S0 = original_S0
        self.h_S = original_S0 * 0.01

        df = pd.DataFrame(results)
        df = df[['S', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho']]

        return df


# Convenience function
def compute_greeks(S0: float, K: float, T: float, r: float, sigma: float, option_type: str = 'call') -> Dict[str, float]:
    """
    Quick function to compute all Greeks.

    Parameters
    ----------
    S0, K, T, r, sigma : float
        Option parameters
    option_type : str
        'call' or 'put'

    Returns
    -------
    Dict[str, float]
        All Greeks

    Examples
    --------
    >>> greeks = compute_greeks(S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45)
    >>> print(greeks)
    """
    calc = GreeksCalculator(S0, K, T, r, sigma, option_type=option_type)
    return calc.compute_all_greeks()

"""
Main Derivatives Pricing Engine
===============================

Comprehensive pricing engine for energy-backed derivatives including:
- Forward contracts
- European options
- American options
- Backing guarantees
- Reserve requirements

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import numpy as np
from typing import Dict, Optional, Tuple
from .american_option import AmericanOptionPricer


class DerivativesPricer:
    """
    Main engine for pricing energy-backed derivatives.

    Provides unified interface for pricing various derivative structures
    on cryptocurrency energy costs.

    Parameters
    ----------
    S0 : float
        Current underlying price (energy unit price)
    sigma : float
        Volatility (annualized)
    r : float
        Risk-free rate (annualized)

    Examples
    --------
    >>> from src.derivatives_pricer import DerivativesPricer
    >>>
    >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
    >>> forward_price = pricer.price_forward(T=1.0)
    >>> option_price = pricer.price_american_call(K=1.0, T=1.0)
    """

    def __init__(self, S0: float, sigma: float, r: float):
        """Initialize derivatives pricer."""
        self.S0 = S0
        self.sigma = sigma
        self.r = r

    def price_forward(self, T: float) -> float:
        """
        Price forward contract on energy.

        F(T) = S0 * exp(r * T)

        Parameters
        ----------
        T : float
            Time to maturity (years)

        Returns
        -------
        float
            Forward price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> F = pricer.price_forward(T=1.0)
        >>> print(f"1-year forward: ${F:.4f}")
        """
        return self.S0 * np.exp(self.r * T)

    def forward_curve(self, maturities: list) -> Dict[float, float]:
        """
        Generate forward curve for multiple maturities.

        Parameters
        ----------
        maturities : list
            List of maturities in years

        Returns
        -------
        Dict[float, float]
            Dictionary mapping maturity to forward price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> curve = pricer.forward_curve([0.25, 0.5, 1.0, 2.0])
        """
        return {T: self.price_forward(T) for T in maturities}

    def price_european_call(self, K: float, T: float, N: int = 100) -> float:
        """
        Price European call option.

        Uses binomial tree without early exercise.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        N : int
            Number of steps

        Returns
        -------
        float
            European call price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> price = pricer.price_european_call(K=1.0, T=1.0)
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type='call'
        )
        return american_pricer._price_european()

    def price_european_put(self, K: float, T: float, N: int = 100) -> float:
        """
        Price European put option.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        N : int
            Number of steps

        Returns
        -------
        float
            European put price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> price = pricer.price_european_put(K=1.0, T=1.0)
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type='put'
        )
        return american_pricer._price_european()

    def price_american_call(self, K: float, T: float, N: int = 100) -> float:
        """
        Price American call option.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        N : int
            Number of steps

        Returns
        -------
        float
            American call price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> price = pricer.price_american_call(K=1.0, T=1.0)
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type='call'
        )
        return american_pricer.price()

    def price_american_put(self, K: float, T: float, N: int = 100) -> float:
        """
        Price American put option.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        N : int
            Number of steps

        Returns
        -------
        float
            American put price

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> price = pricer.price_american_put(K=1.0, T=1.0)
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type='put'
        )
        return american_pricer.price()

    def optimal_exercise_boundary(self, K: float, T: float, option_type: str = 'call', N: int = 100) -> np.ndarray:
        """
        Compute optimal exercise boundary for American option.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        option_type : str
            'call' or 'put'
        N : int
            Number of steps

        Returns
        -------
        np.ndarray
            Exercise boundary at each time step

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> boundary = pricer.optimal_exercise_boundary(K=1.0, T=1.0, option_type='call')
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type=option_type
        )
        american_pricer.price()
        return american_pricer.optimal_exercise_boundary()

    def backing_guarantee_cost(self, guarantee_ratio: float, T: float, N: int = 100) -> float:
        """
        Compute cost of backing guarantee.

        A guarantee that "token always redeemable for ≥ X% of spot"
        is equivalent to an American put option.

        Parameters
        ----------
        guarantee_ratio : float
            Guarantee level (e.g., 1.0 = 100%, 1.1 = 110%)
        T : float
            Time to maturity
        N : int
            Number of steps

        Returns
        -------
        float
            Cost of guarantee (per token)

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> cost = pricer.backing_guarantee_cost(guarantee_ratio=1.1, T=1.0)
        >>> print(f"110% guarantee costs: ${cost:.4f} per token")
        """
        K = self.S0 * guarantee_ratio
        return self.price_american_put(K=K, T=T, N=N)

    def compute_reserves(self, confidence_level: float = 0.95, T: float = 1.0) -> float:
        """
        Compute required reserves for solvency.

        Uses Value-at-Risk (VaR) methodology.

        Parameters
        ----------
        confidence_level : float
            Confidence level (default: 0.95)
        T : float
            Time horizon (years)

        Returns
        -------
        float
            Required reserve per token

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> reserves = pricer.compute_reserves(confidence=0.95, T=1.0)
        """
        from scipy.stats import norm

        # VaR calculation under lognormal assumption
        # S_T = S0 * exp((r - sigma^2/2)*T + sigma*sqrt(T)*Z)
        # VaR at alpha confidence = S0 * exp((r - sigma^2/2)*T + sigma*sqrt(T)*Phi^{-1}(1-alpha))

        z_score = norm.ppf(1 - confidence_level)  # This is negative
        VaR = self.S0 * np.exp(
            (self.r - 0.5 * self.sigma**2) * T +
            self.sigma * np.sqrt(T) * z_score
        )

        return VaR

    def early_exercise_premium(self, K: float, T: float, option_type: str = 'call', N: int = 100) -> float:
        """
        Compute early exercise premium.

        EEP = American Price - European Price

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        option_type : str
            'call' or 'put'
        N : int
            Number of steps

        Returns
        -------
        float
            Early exercise premium

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> eep = pricer.early_exercise_premium(K=1.0, T=1.0, option_type='call')
        """
        american_pricer = AmericanOptionPricer(
            S0=self.S0, K=K, T=T, r=self.r, sigma=self.sigma,
            N=N, option_type=option_type
        )
        return american_pricer.early_exercise_premium()

    def token_design_parameters(self, T: float = 1.0, guarantee_ratio: float = 1.1) -> Dict:
        """
        Compute recommended parameters for token design.

        Parameters
        ----------
        T : float
            Token maturity/redemption horizon
        guarantee_ratio : float
            Desired guarantee level

        Returns
        -------
        Dict
            Recommended design parameters

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> params = pricer.token_design_parameters(T=1.0, guarantee_ratio=1.1)
        >>> print(params)
        """
        # Fair value with redemption option (ATM American call)
        fair_value = self.price_american_call(K=self.S0, T=T)

        # Guarantee cost
        guarantee_cost = self.backing_guarantee_cost(guarantee_ratio, T)

        # Reserves needed
        reserves_95 = self.compute_reserves(confidence_level=0.95, T=T)
        reserves_99 = self.compute_reserves(confidence_level=0.99, T=T)

        # Forward price
        forward = self.price_forward(T)

        params = {
            'current_price': self.S0,
            'fair_token_value': fair_value,
            'forward_price': forward,
            'guarantee_cost': guarantee_cost,
            'guarantee_ratio': guarantee_ratio,
            'reserves_95_confidence': reserves_95,
            'reserves_99_confidence': reserves_99,
            'recommended_backing_ratio': guarantee_ratio,
            'volatility': self.sigma,
            'risk_free_rate': self.r,
            'time_horizon': T,
        }

        return params

    def stress_test_volatility(self, K: float, T: float, vol_range: Tuple[float, float] = (0.2, 0.8), n_points: int = 10) -> Dict:
        """
        Stress test option value under different volatilities.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        vol_range : Tuple[float, float]
            Min and max volatility to test
        n_points : int
            Number of points to test

        Returns
        -------
        Dict
            Volatility -> American call price mapping

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> stress = pricer.stress_test_volatility(K=1.0, T=1.0, vol_range=(0.2, 0.8))
        """
        results = {}
        original_sigma = self.sigma

        for sigma in np.linspace(vol_range[0], vol_range[1], n_points):
            self.sigma = sigma
            price = self.price_american_call(K=K, T=T)
            results[sigma] = price

        # Restore original volatility
        self.sigma = original_sigma

        return results

    def stress_test_rate(self, K: float, T: float, rate_range: Tuple[float, float] = (0.01, 0.10), n_points: int = 10) -> Dict:
        """
        Stress test option value under different interest rates.

        Parameters
        ----------
        K : float
            Strike price
        T : float
            Time to maturity
        rate_range : Tuple[float, float]
            Min and max rate to test
        n_points : int
            Number of points to test

        Returns
        -------
        Dict
            Rate -> American call price mapping

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> stress = pricer.stress_test_rate(K=1.0, T=1.0, rate_range=(0.01, 0.10))
        """
        results = {}
        original_r = self.r

        for r in np.linspace(rate_range[0], rate_range[1], n_points):
            self.r = r
            price = self.price_american_call(K=K, T=T)
            results[r] = price

        # Restore original rate
        self.r = original_r

        return results

    def get_summary(self) -> Dict:
        """
        Get summary of pricer parameters.

        Returns
        -------
        Dict
            Pricer parameter summary

        Examples
        --------
        >>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
        >>> print(pricer.get_summary())
        """
        return {
            'S0': self.S0,
            'sigma': self.sigma,
            'r': self.r,
            'annualized_volatility_pct': self.sigma * 100,
            'risk_free_rate_pct': self.r * 100,
        }

"""
American Option Pricing Using Binomial Trees
============================================

Implements binomial tree method for pricing American-style options
with early exercise capability.

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import numpy as np
from typing import Tuple, List, Optional, Dict


class AmericanOptionPricer:
    """
    Price American options using binomial tree method.

    Supports both calls and puts with early exercise checks at each node.
    Computes optimal exercise boundary and early exercise premium.

    Parameters
    ----------
    S0 : float
        Initial underlying price
    K : float
        Strike price
    T : float
        Time to maturity (years)
    r : float
        Risk-free rate (annualized)
    sigma : float
        Volatility (annualized)
    N : int
        Number of time steps (default: 100)
    option_type : str
        'call' or 'put' (default: 'call')

    Attributes
    ----------
    All parameters plus:
    dt : float
        Time step
    u : float
        Up factor
    d : float
        Down factor
    q : float
        Risk-neutral probability

    Examples
    --------
    >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1.0, r=0.05, sigma=0.3, N=100)
    >>> price = pricer.price()
    >>> boundary = pricer.optimal_exercise_boundary()
    >>> print(f"American call price: ${price:.2f}")
    """

    def __init__(
        self,
        S0: float,
        K: float,
        T: float,
        r: float,
        sigma: float,
        N: int = 100,
        option_type: str = 'call'
    ):
        """Initialize American option pricer."""
        self.S0 = S0
        self.K = K
        self.T = T
        self.r = r
        self.sigma = sigma
        self.N = N
        self.option_type = option_type.lower()

        if self.option_type not in ['call', 'put']:
            raise ValueError("option_type must be 'call' or 'put'")

        # Computed parameters
        self.dt = T / N
        self.u = np.exp(sigma * np.sqrt(self.dt))
        self.d = 1 / self.u
        self.q = (np.exp(r * self.dt) - self.d) / (self.u - self.d)

        # Validate risk-neutral probability
        if not (0 <= self.q <= 1):
            raise ValueError(f"Invalid risk-neutral probability: {self.q:.4f}")

        # Storage for lattice
        self.stock_prices = None
        self.option_values = None
        self.exercise_flags = None

    def price(self) -> float:
        """
        Compute American option price.

        Returns
        -------
        float
            Option price at t=0

        Examples
        --------
        >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1, r=0.05, sigma=0.3)
        >>> price = pricer.price()
        """
        # Build lattice
        self._build_stock_price_lattice()
        self._build_option_value_lattice()

        return float(self.option_values[0, 0])

    def _build_stock_price_lattice(self):
        """Build stock price lattice."""
        N = self.N
        self.stock_prices = np.zeros((N + 1, N + 1))

        for i in range(N + 1):
            for j in range(i + 1):
                self.stock_prices[i, j] = self.S0 * (self.u ** j) * (self.d ** (i - j))

    def _build_option_value_lattice(self):
        """Build option value lattice with early exercise."""
        N = self.N
        self.option_values = np.zeros((N + 1, N + 1))
        self.exercise_flags = np.zeros((N + 1, N + 1), dtype=bool)

        # Terminal payoffs
        for j in range(N + 1):
            S_T = self.stock_prices[N, j]
            self.option_values[N, j] = self._payoff(S_T)

        # Backward induction with early exercise
        for i in range(N - 1, -1, -1):
            for j in range(i + 1):
                # Hold value (continuation)
                hold_value = np.exp(-self.r * self.dt) * (
                    self.q * self.option_values[i + 1, j + 1] +
                    (1 - self.q) * self.option_values[i + 1, j]
                )

                # Exercise value
                exercise_value = self._payoff(self.stock_prices[i, j])

                # Optimal decision
                if exercise_value > hold_value:
                    self.option_values[i, j] = exercise_value
                    self.exercise_flags[i, j] = True
                else:
                    self.option_values[i, j] = hold_value
                    self.exercise_flags[i, j] = False

    def _payoff(self, S: float) -> float:
        """Compute option payoff."""
        if self.option_type == 'call':
            return max(S - self.K, 0)
        else:  # put
            return max(self.K - S, 0)

    def optimal_exercise_boundary(self) -> np.ndarray:
        """
        Compute optimal exercise boundary.

        Returns the critical stock price at each time step above (for calls)
        or below (for puts) which early exercise is optimal.

        Returns
        -------
        np.ndarray
            Exercise boundary prices at each time step

        Examples
        --------
        >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1, r=0.05, sigma=0.3)
        >>> pricer.price()
        >>> boundary = pricer.optimal_exercise_boundary()
        """
        if self.stock_prices is None:
            self.price()

        boundary = []

        for i in range(self.N + 1):
            # Find critical price at time step i
            exercise_prices = []
            for j in range(i + 1):
                if self.exercise_flags[i, j]:
                    exercise_prices.append(self.stock_prices[i, j])

            if exercise_prices:
                if self.option_type == 'call':
                    # For call, boundary is minimum S where exercise is optimal
                    boundary.append(min(exercise_prices))
                else:
                    # For put, boundary is maximum S where exercise is optimal
                    boundary.append(max(exercise_prices))
            else:
                # No exercise at this time
                boundary.append(np.nan)

        return np.array(boundary)

    def early_exercise_premium(self) -> float:
        """
        Compute early exercise premium.

        EEP = American Price - European Price

        Returns
        -------
        float
            Early exercise premium

        Examples
        --------
        >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1, r=0.05, sigma=0.3)
        >>> eep = pricer.early_exercise_premium()
        """
        american_price = self.price()
        european_price = self._price_european()

        return american_price - european_price

    def _price_european(self) -> float:
        """Price corresponding European option."""
        if self.stock_prices is None:
            self._build_stock_price_lattice()

        N = self.N
        V = np.zeros((N + 1, N + 1))

        # Terminal payoffs
        for j in range(N + 1):
            V[N, j] = self._payoff(self.stock_prices[N, j])

        # Backward induction WITHOUT early exercise
        for i in range(N - 1, -1, -1):
            for j in range(i + 1):
                V[i, j] = np.exp(-self.r * self.dt) * (
                    self.q * V[i + 1, j + 1] +
                    (1 - self.q) * V[i + 1, j]
                )

        return float(V[0, 0])

    def convergence_analysis(self, N_values: List[int]) -> Dict:
        """
        Analyze convergence as N increases.

        Parameters
        ----------
        N_values : List[int]
            List of N values to test

        Returns
        -------
        Dict
            Results with N as keys, prices as values

        Examples
        --------
        >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1, r=0.05, sigma=0.3)
        >>> results = pricer.convergence_analysis([10, 20, 50, 100, 200])
        """
        results = {}
        original_N = self.N

        for N in N_values:
            self.N = N
            self.dt = self.T / N
            self.u = np.exp(self.sigma * np.sqrt(self.dt))
            self.d = 1 / self.u
            self.q = (np.exp(self.r * self.dt) - self.d) / (self.u - self.d)

            price = self.price()
            results[N] = price

        # Restore original N
        self.N = original_N
        self.dt = self.T / original_N
        self.u = np.exp(self.sigma * np.sqrt(self.dt))
        self.d = 1 / self.u
        self.q = (np.exp(self.r * self.dt) - self.d) / (self.u - self.d)

        return results

    def get_lattice_summary(self) -> Dict:
        """
        Get summary of the price lattice.

        Returns
        -------
        Dict
            Summary statistics

        Examples
        --------
        >>> pricer = AmericanOptionPricer(S0=100, K=100, T=1, r=0.05, sigma=0.3)
        >>> pricer.price()
        >>> summary = pricer.get_lattice_summary()
        """
        if self.stock_prices is None:
            self.price()

        # Count early exercise nodes
        n_exercise = np.sum(self.exercise_flags)
        total_nodes = np.sum(np.tri(self.N + 1, self.N + 1, dtype=bool))

        summary = {
            'N': self.N,
            'dt': self.dt,
            'u': self.u,
            'd': self.d,
            'q': self.q,
            'total_nodes': int(total_nodes),
            'early_exercise_nodes': int(n_exercise),
            'exercise_percentage': float(n_exercise / total_nodes * 100),
            'min_stock_price': float(np.min(self.stock_prices[self.stock_prices > 0])),
            'max_stock_price': float(np.max(self.stock_prices)),
        }

        return summary


# Convenience functions
def price_american_call(S0: float, K: float, T: float, r: float, sigma: float, N: int = 100) -> float:
    """
    Quick function to price American call.

    Parameters
    ----------
    S0, K, T, r, sigma : float
        Option parameters
    N : int
        Number of steps

    Returns
    -------
    float
        American call price

    Examples
    --------
    >>> price = price_american_call(S0=100, K=100, T=1, r=0.05, sigma=0.3)
    """
    pricer = AmericanOptionPricer(S0, K, T, r, sigma, N, option_type='call')
    return pricer.price()


def price_american_put(S0: float, K: float, T: float, r: float, sigma: float, N: int = 100) -> float:
    """
    Quick function to price American put.

    Parameters
    ----------
    S0, K, T, r, sigma : float
        Option parameters
    N : int
        Number of steps

    Returns
    -------
    float
        American put price

    Examples
    --------
    >>> price = price_american_put(S0=100, K=100, T=1, r=0.05, sigma=0.3)
    """
    pricer = AmericanOptionPricer(S0, K, T, r, sigma, N, option_type='put')
    return pricer.price()

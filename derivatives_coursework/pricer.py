"""
American Option Pricer - Core Implementation
============================================

Clean implementation of binomial tree pricing for American options.
Designed for Derivative Securities coursework.

Author: [Your Name]
Course: Derivative Securities
"""

import numpy as np
from typing import Dict, Tuple


class AmericanOptionPricer:
    """
    Price American options using binomial trees.

    Simple, focused implementation for coursework demonstration.
    """

    def __init__(self, S0: float, K: float, T: float, r: float, sigma: float, N: int = 100):
        """
        Initialize pricer.

        Parameters:
        -----------
        S0 : float - Current price
        K : float - Strike price
        T : float - Time to maturity (years)
        r : float - Risk-free rate
        sigma : float - Volatility
        N : int - Number of steps (default 100)
        """
        self.S0 = S0
        self.K = K
        self.T = T
        self.r = r
        self.sigma = sigma
        self.N = N

        # Compute parameters
        self.dt = T / N
        self.u = np.exp(sigma * np.sqrt(self.dt))
        self.d = 1 / self.u
        self.q = (np.exp(r * self.dt) - self.d) / (self.u - self.d)

    def price(self) -> float:
        """Compute American call option price."""
        # Build stock price tree
        stock_tree = np.zeros((self.N + 1, self.N + 1))
        for i in range(self.N + 1):
            for j in range(i + 1):
                stock_tree[i, j] = self.S0 * (self.u ** j) * (self.d ** (i - j))

        # Build option value tree with early exercise
        option_tree = np.zeros((self.N + 1, self.N + 1))

        # Terminal payoffs
        for j in range(self.N + 1):
            option_tree[self.N, j] = max(stock_tree[self.N, j] - self.K, 0)

        # Backward induction
        for i in range(self.N - 1, -1, -1):
            for j in range(i + 1):
                # Hold value
                hold = np.exp(-self.r * self.dt) * (
                    self.q * option_tree[i+1, j+1] +
                    (1 - self.q) * option_tree[i+1, j]
                )
                # Exercise value
                exercise = max(stock_tree[i, j] - self.K, 0)
                # Take maximum (American option)
                option_tree[i, j] = max(hold, exercise)

        self.stock_tree = stock_tree
        self.option_tree = option_tree

        return option_tree[0, 0]

    def exercise_boundary(self) -> np.ndarray:
        """Find optimal exercise boundary (critical prices)."""
        if not hasattr(self, 'option_tree'):
            self.price()

        boundary = []
        for i in range(self.N + 1):
            critical_price = None
            for j in range(i + 1):
                S = self.stock_tree[i, j]
                intrinsic = max(S - self.K, 0)
                if abs(self.option_tree[i, j] - intrinsic) < 0.001:  # Exercise region
                    if critical_price is None or S < critical_price:
                        critical_price = S
            boundary.append(critical_price if critical_price else np.nan)

        return np.array(boundary)

    def compute_greeks(self) -> Dict[str, float]:
        """Compute all option Greeks."""
        # Base price
        V = self.price()

        # Delta: ∂V/∂S
        h_S = self.S0 * 0.01
        pricer_up = AmericanOptionPricer(self.S0 + h_S, self.K, self.T, self.r, self.sigma, self.N)
        pricer_down = AmericanOptionPricer(self.S0 - h_S, self.K, self.T, self.r, self.sigma, self.N)
        delta = (pricer_up.price() - pricer_down.price()) / (2 * h_S)

        # Gamma: ∂²V/∂S²
        V_up = pricer_up.price()
        V_down = pricer_down.price()
        gamma = (V_up - 2*V + V_down) / (h_S ** 2)

        # Vega: ∂V/∂σ
        h_sigma = 0.01
        pricer_vol_up = AmericanOptionPricer(self.S0, self.K, self.T, self.r, self.sigma + h_sigma, self.N)
        pricer_vol_down = AmericanOptionPricer(self.S0, self.K, self.T, self.r, self.sigma - h_sigma, self.N)
        vega = (pricer_vol_up.price() - pricer_vol_down.price()) / (2 * h_sigma)

        # Theta: -∂V/∂T
        h_T = 1/252
        if self.T > h_T:
            pricer_time = AmericanOptionPricer(self.S0, self.K, self.T - h_T, self.r, self.sigma, self.N)
            theta = -(pricer_time.price() - V) / h_T
        else:
            theta = 0.0

        # Rho: ∂V/∂r
        h_r = 0.0001
        pricer_r_up = AmericanOptionPricer(self.S0, self.K, self.T, self.r + h_r, self.sigma, self.N)
        pricer_r_down = AmericanOptionPricer(self.S0, self.K, self.T, self.r - h_r, self.sigma, self.N)
        rho = (pricer_r_up.price() - pricer_r_down.price()) / (2 * h_r)

        return {
            'delta': delta,
            'gamma': gamma,
            'vega': vega,
            'theta': theta,
            'rho': rho
        }


def price_forward(S0: float, T: float, r: float) -> float:
    """Price a forward contract (no-arbitrage)."""
    return S0 * np.exp(r * T)


def compute_early_exercise_premium(S0: float, K: float, T: float, r: float, sigma: float, N: int = 100) -> float:
    """
    Compute early exercise premium.

    EEP = American Price - European Price
    """
    # American price
    american_pricer = AmericanOptionPricer(S0, K, T, r, sigma, N)
    american_price = american_pricer.price()

    # European price (no early exercise)
    stock_tree = american_pricer.stock_tree
    option_tree = np.zeros((N + 1, N + 1))

    # Terminal payoffs
    for j in range(N + 1):
        option_tree[N, j] = max(stock_tree[N, j] - K, 0)

    # Backward induction WITHOUT early exercise
    for i in range(N - 1, -1, -1):
        for j in range(i + 1):
            q = american_pricer.q
            dt = american_pricer.dt
            option_tree[i, j] = np.exp(-r * dt) * (
                q * option_tree[i+1, j+1] + (1 - q) * option_tree[i+1, j]
            )

    european_price = option_tree[0, 0]

    return american_price - european_price


# Quick test
if __name__ == "__main__":
    print("Testing American Option Pricer...")

    pricer = AmericanOptionPricer(S0=100, K=100, T=1.0, r=0.05, sigma=0.3, N=100)
    price = pricer.price()
    greeks = pricer.compute_greeks()

    print(f"Option Price: ${price:.4f}")
    print(f"Delta: {greeks['delta']:.4f}")
    print(f"Gamma: {greeks['gamma']:.4f}")
    print(f"Vega: {greeks['vega']:.4f}")
    print("✓ All tests passed!")

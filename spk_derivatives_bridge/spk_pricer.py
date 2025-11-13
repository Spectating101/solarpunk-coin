"""
SPK Token Pricer
================

Prices SolarPunkCoin token mechanics using derivative theory.

Specifically designed for SPK token design - computes:
- Fair token prices with redemption options
- Backing guarantee costs
- Reserve requirements
- Optimal redemption strategies
- Peg stability costs
"""

import numpy as np
from typing import Dict, Optional
from config import SPKConfig
from scipy.stats import norm


class SPKTokenPricer:
    """
    Price SolarPunkCoin token mechanics.

    Uses American option pricing to value SPK redemption features,
    guarantees, and stability mechanisms.
    """

    def __init__(self, S0: float, sigma: float, r: float, config: Optional[SPKConfig] = None):
        """
        Initialize SPK pricer.

        Parameters:
        -----------
        S0 : float
            Current energy price
        sigma : float
            Volatility (annualized)
        r : float
            Risk-free rate
        config : SPKConfig, optional
            SPK configuration (uses default if not provided)
        """
        self.S0 = S0
        self.sigma = sigma
        self.r = r
        self.config = config if config is not None else SPKConfig()

    @classmethod
    def from_config(cls, config: SPKConfig, S0: float, sigma: float):
        """Create pricer from SPK config."""
        return cls(S0=S0, sigma=sigma, r=config.risk_free_rate, config=config)

    def price_redemption_option(self, T: Optional[float] = None, N: int = 100) -> float:
        """
        Price the SPK redemption option.

        The right to redeem SPK for energy at any time is an American call option.

        Parameters:
        -----------
        T : float, optional
            Time to maturity (uses config default if None)
        N : int
            Binomial steps

        Returns:
        --------
        float
            Redemption option value
        """
        T = T if T is not None else self.config.default_maturity
        K = self.S0 * (1 + self.config.redemption_fee)  # Strike includes redemption fee

        # Simple binomial tree for American call
        dt = T / N
        u = np.exp(self.sigma * np.sqrt(dt))
        d = 1 / u
        q = (np.exp(self.r * dt) - d) / (u - d)

        # Stock price tree
        stock = np.zeros((N+1, N+1))
        for i in range(N+1):
            for j in range(i+1):
                stock[i,j] = self.S0 * (u**j) * (d**(i-j))

        # Option value tree
        option = np.zeros((N+1, N+1))

        # Terminal payoffs
        for j in range(N+1):
            option[N,j] = max(stock[N,j] - K, 0)

        # Backward induction with early exercise
        for i in range(N-1, -1, -1):
            for j in range(i+1):
                hold = np.exp(-self.r * dt) * (q * option[i+1,j+1] + (1-q) * option[i+1,j])
                exercise = max(stock[i,j] - K, 0)
                option[i,j] = max(hold, exercise)

        return option[0,0]

    def compute_backing_guarantee_cost(self, T: Optional[float] = None, N: int = 100) -> float:
        """
        Compute cost of backing guarantee.

        SPK promises "always redeemable for X% of energy value".
        This is an American put option the issuer writes.

        Parameters:
        -----------
        T : float, optional
            Time to maturity
        N : int
            Binomial steps

        Returns:
        --------
        float
            Guarantee cost per token
        """
        T = T if T is not None else self.config.default_maturity
        K = self.S0 * self.config.backing_ratio  # Guaranteed backing level

        # Binomial tree for American put
        dt = T / N
        u = np.exp(self.sigma * np.sqrt(dt))
        d = 1 / u
        q = (np.exp(self.r * dt) - d) / (u - d)

        # Stock price tree
        stock = np.zeros((N+1, N+1))
        for i in range(N+1):
            for j in range(i+1):
                stock[i,j] = self.S0 * (u**j) * (d**(i-j))

        # Option value tree (PUT)
        option = np.zeros((N+1, N+1))

        # Terminal payoffs
        for j in range(N+1):
            option[N,j] = max(K - stock[N,j], 0)

        # Backward induction
        for i in range(N-1, -1, -1):
            for j in range(i+1):
                hold = np.exp(-self.r * dt) * (q * option[i+1,j+1] + (1-q) * option[i+1,j])
                exercise = max(K - stock[i,j], 0)
                option[i,j] = max(hold, exercise)

        return option[0,0]

    def compute_reserve_requirement(self, T: Optional[float] = None) -> float:
        """
        Compute required reserves using Value-at-Risk.

        Ensures solvency with specified confidence level.

        Parameters:
        -----------
        T : float, optional
            Time horizon

        Returns:
        --------
        float
            Required reserve per token
        """
        T = T if T is not None else self.config.default_maturity
        confidence = self.config.confidence_level

        # VaR calculation under lognormal
        z = norm.ppf(1 - confidence)  # Negative for downside
        VaR = self.S0 * np.exp(
            (self.r - 0.5 * self.sigma**2) * T +
            self.sigma * np.sqrt(T) * z
        )

        # Reserve at confidence level
        return VaR * self.config.reserve_ratio

    def compute_peg_stability_cost(self) -> float:
        """
        Estimate cost to maintain peg within band.

        Uses barrier option approximation.

        Returns:
        --------
        float
            Expected annual cost of peg maintenance
        """
        # Probability of hitting boundary
        band = self.config.peg_band
        upper = self.S0 * (1 + band)
        lower = self.S0 * (1 - band)

        # Expected interventions per year (rough approximation)
        # Based on Brownian motion barrier hitting probability
        T = 1.0  # Annual
        prob_hit = 2 * norm.cdf(-band / (self.sigma * np.sqrt(T)))

        # Average intervention cost (fraction of band)
        avg_cost = self.S0 * band * 0.5

        # Expected annual cost
        return prob_hit * avg_cost

    def compute_token_parameters(self, **kwargs) -> Dict:
        """
        Compute all SPK token design parameters.

        This is the main output function - gives you everything needed for SPK.

        Parameters:
        -----------
        **kwargs : optional overrides for T, N, etc.

        Returns:
        --------
        Dict with comprehensive SPK design parameters
        """
        T = kwargs.get('T', self.config.default_maturity)
        N = kwargs.get('N', 100)

        # Core pricing
        redemption_value = self.price_redemption_option(T=T, N=N)
        guarantee_cost = self.compute_backing_guarantee_cost(T=T, N=N)
        reserves = self.compute_reserve_requirement(T=T)
        peg_cost = self.compute_peg_stability_cost()

        # Fair token price
        fair_price = self.S0 + redemption_value  # Base + option premium

        params = {
            # Prices
            'fair_price': fair_price,
            'base_energy_value': self.S0,
            'redemption_option_value': redemption_value,

            # Costs
            'guarantee_cost': guarantee_cost,
            'peg_stability_cost_annual': peg_cost,
            'total_issuance_cost': guarantee_cost + peg_cost,

            # Reserves & Backing
            'reserve_requirement': reserves,
            'backing_ratio': self.config.backing_ratio,
            'reserves_per_token': reserves,

            # Redemption
            'redemption_threshold': self.S0 * (1 + 0.1),  # Rough heuristic
            'redemption_fee': self.config.redemption_fee,

            # Risk Parameters
            'volatility': self.sigma,
            'confidence_level': self.config.confidence_level,

            # Config
            'config': self.config.to_dict(),
        }

        return params

    def get_design_summary(self) -> str:
        """Get formatted summary of SPK design parameters."""
        params = self.compute_token_parameters()

        summary = f"""
SPK Token Design Parameters
============================

Token Pricing:
  Fair Token Price:           ${params['fair_price']:.4f}
  Base Energy Value:          ${params['base_energy_value']:.4f}
  Redemption Option Premium:  ${params['redemption_option_value']:.4f}

Costs:
  Guarantee Cost (one-time):  ${params['guarantee_cost']:.4f} per token
  Peg Stability (annual):     ${params['peg_stability_cost_annual']:.4f} per token/year
  Total Issuance Cost:        ${params['total_issuance_cost']:.4f}

Reserves & Backing:
  Required Reserves:          ${params['reserve_requirement']:.4f} per token
  Backing Ratio:              {params['backing_ratio']:.0%}
  Confidence Level:           {params['confidence_level']:.0%}

Redemption:
  Redemption Fee:             {params['redemption_fee']:.2%}
  Optimal Redemption Above:   ${params['redemption_threshold']:.4f}

Risk Parameters:
  Volatility:                 {params['volatility']:.1%}
  Energy Price (S₀):          ${self.S0:.4f}
        """

        return summary.strip()


# Convenience function
def design_spk_token(S0: float, sigma: float, r: float = 0.05, config_name: str = 'balanced') -> Dict:
    """
    Quick function to design SPK token with preset configuration.

    Parameters:
    -----------
    S0 : float
        Current energy price
    sigma : float
        Volatility
    r : float
        Risk-free rate
    config_name : str
        'conservative', 'balanced', or 'aggressive'

    Returns:
    --------
    Dict
        Complete SPK design parameters
    """
    from config import get_preset

    config = get_preset(config_name)
    pricer = SPKTokenPricer(S0=S0, sigma=sigma, r=r, config=config)
    return pricer.compute_token_parameters()


# Example usage
if __name__ == "__main__":
    print("SPK Token Pricer - Example\n")

    # Create pricer
    pricer = SPKTokenPricer(S0=1.0, sigma=0.45, r=0.05)

    # Compute token parameters
    params = pricer.compute_token_parameters()

    # Print summary
    print(pricer.get_design_summary())

    print("\n" + "=" * 50)
    print("Ready to use these parameters in SPK implementation!")

"""
American Option Pricing Demo - Derivative Securities Final Project
==================================================================

Demonstrates pricing of American options on cryptocurrency energy costs.

Run this file to see the complete analysis.

Author: [Your Name]
Course: Derivative Securities
"""

import numpy as np
from pricer import AmericanOptionPricer, price_forward, compute_early_exercise_premium
from data_utils import load_bitcoin_energy_data, get_default_parameters


def print_header(title):
    """Print a nice header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def print_section(number, title):
    """Print a section header."""
    print(f"\n{number}. {title}")
    print("-" * 70)


def main():
    """Run complete demonstration."""

    print_header("Cryptocurrency Energy Derivatives Pricing")
    print("Derivative Securities Final Project")
    print()

    # ========================================================================
    # SECTION 1: Load Data
    # ========================================================================
    print_section(1, "Loading Bitcoin Energy Data")

    data = load_bitcoin_energy_data()
    S0 = data['S0']
    sigma = data['sigma']

    print(f"✓ Data loaded successfully")
    print(f"  {data['description']}")
    print(f"\n  Current Energy Unit Price (S₀): ${S0:.4f}")
    print(f"  Annualized Volatility (σ):      {sigma:.1%}")

    # ========================================================================
    # SECTION 2: Setup Parameters
    # ========================================================================
    print_section(2, "Option Parameters")

    K = S0  # At-the-money
    T = 1.0  # 1 year
    r = 0.05  # 5% risk-free rate
    N = 100  # 100 steps

    print(f"  Strike Price (K):        ${K:.4f} (At-The-Money)")
    print(f"  Time to Maturity (T):    {T:.1f} year")
    print(f"  Risk-Free Rate (r):      {r:.1%}")
    print(f"  Binomial Steps (N):      {N}")

    # ========================================================================
    # SECTION 3: Price Forward Contract
    # ========================================================================
    print_section(3, "Forward Contract Pricing")

    forward_price = price_forward(S0, T, r)

    print(f"  Forward Price F(T=1Y):   ${forward_price:.4f}")
    print(f"  Formula: F = S₀ × exp(r×T) = ${S0:.4f} × exp({r}×{T})")
    print(f"  \n  → No-arbitrage forward price for 1-year delivery")

    # ========================================================================
    # SECTION 4: Price American Call Option
    # ========================================================================
    print_section(4, "American Call Option Pricing")

    print(f"  Pricing American call using binomial tree...")
    print(f"  (This may take a few seconds...)")

    pricer = AmericanOptionPricer(S0, K, T, r, sigma, N)
    american_price = pricer.price()

    print(f"\n  ✓ American Call Price:   ${american_price:.4f}")

    # ========================================================================
    # SECTION 5: Early Exercise Premium
    # ========================================================================
    print_section(5, "Early Exercise Premium")

    eep = compute_early_exercise_premium(S0, K, T, r, sigma, N)

    print(f"  American Price:          ${american_price:.4f}")
    print(f"  European Price:          ${american_price - eep:.4f}")
    print(f"  Early Exercise Premium:  ${eep:.4f}")
    print(f"  \n  → Value of the right to exercise early: ${eep:.4f}")
    print(f"  → Premium as %:          {eep/american_price:.1%} of option value")

    # ========================================================================
    # SECTION 6: Optimal Exercise Boundary
    # ========================================================================
    print_section(6, "Optimal Exercise Strategy")

    boundary = pricer.exercise_boundary()
    # Get first few non-NaN values
    valid_boundary = boundary[~np.isnan(boundary)]

    if len(valid_boundary) > 0:
        critical_price = valid_boundary[0]
        print(f"  Critical Exercise Price: ${critical_price:.4f}")
        print(f"  Current Price:           ${S0:.4f}")
        print(f"  \n  → Exercise IMMEDIATELY if S > ${critical_price:.4f}")
        print(f"  → Otherwise, HOLD the option")

        if S0 > critical_price:
            print(f"  \n  ⚠ Current price exceeds boundary → EXERCISE NOW")
        else:
            print(f"  \n  ✓ Current price below boundary → HOLD")
    else:
        print(f"  → Never optimal to exercise early (stay below strike)")

    # ========================================================================
    # SECTION 7: Greeks (Risk Sensitivities)
    # ========================================================================
    print_section(7, "Greeks - Risk Sensitivities")

    print(f"  Computing Greeks via finite differences...")
    greeks = pricer.compute_greeks()

    print(f"\n  Delta (Δ):   {greeks['delta']:8.4f}  → {greeks['delta']:.1%} exposure to S")
    print(f"  Gamma (Γ):   {greeks['gamma']:8.4f}  → Δ convexity")
    print(f"  Vega (ν):    {greeks['vega']:8.4f}  → Sensitivity to volatility")
    print(f"  Theta (θ):   {greeks['theta']:8.4f}  → Daily time decay")
    print(f"  Rho (ρ):     {greeks['rho']:8.4f}  → Sensitivity to rates")

    # ========================================================================
    # SECTION 8: Interpretation
    # ========================================================================
    print_section(8, "Practical Interpretation")

    print(f"  For Token Designers:")
    print(f"  • Fair token value (with redemption option): ${american_price:.4f}")
    print(f"  • Holders should redeem when price > ${critical_price:.4f}")
    print(f"  • {greeks['delta']:.0%} of price movements pass through to token")
    print(f"  \n  For Risk Managers:")
    print(f"  • Hedge ratio: {greeks['delta']:.4f} units of underlying per option")
    print(f"  • Daily time decay: ${greeks['theta']:.4f} per day")
    print(f"  • If volatility ↑ 1%: Option value ↑ ${greeks['vega']:.4f}")

    # ========================================================================
    # Summary
    # ========================================================================
    print_header("Analysis Complete")

    print("\nKey Results:")
    print(f"  • Current Energy Price:        ${S0:.4f}")
    print(f"  • American Call Option:        ${american_price:.4f}")
    print(f"  • Optimal Exercise Threshold:  ${critical_price:.4f}")
    print(f"  • Delta (risk exposure):       {greeks['delta']:.4f}")

    print("\nMethodology:")
    print(f"  ✓ Binomial tree with {N} steps")
    print(f"  ✓ American-style early exercise")
    print(f"  ✓ Risk-neutral valuation")
    print(f"  ✓ Greeks via finite differences")

    print("\nApplications:")
    print(f"  • Energy-backed token design")
    print(f"  • Mining company hedging")
    print(f"  • Cryptocurrency risk management")

    print("\n" + "=" * 70)
    print("  Demo completed successfully!")
    print("=" * 70)
    print()


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have installed: numpy pandas matplotlib scipy")
        print("Run: pip install numpy pandas matplotlib scipy")

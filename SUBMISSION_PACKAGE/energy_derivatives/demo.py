#!/usr/bin/env python3
"""
Energy Derivatives Pricing Framework - Demo Runner
===================================================

Complete demonstration of the derivative pricing framework for
renewable energy-backed digital assets.

This script showcases:
1. Empirical CEIR data loading from Bitcoin
2. Binomial Option Pricing Model
3. Monte-Carlo Simulation
4. Greeks Calculation
5. Professional Visualizations
6. Convergence Analysis
7. Stress Testing

Usage:
    python demo.py              # Full demo with all outputs
    python demo.py --quick      # Quick demo (fewer simulations)
    python demo.py --no-plots   # Skip plot generation

Author: Solarpunk Bitcoin Research Team
Date: November 2025
"""

import sys
import os
import argparse
import warnings
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

import numpy as np
import pandas as pd

# Import our modules
from data_loader import load_parameters, get_ceir_summary
from binomial import BinomialTree
from monte_carlo import MonteCarloSimulator
from sensitivities import GreeksCalculator
from plots import EnergyDerivativesPlotter


def print_header(title: str, char: str = "=") -> None:
    """Print formatted section header."""
    line = char * 60
    print(f"\n{line}")
    print(f"  {title}")
    print(f"{line}")


def print_subheader(title: str) -> None:
    """Print formatted subsection header."""
    print(f"\n--- {title} ---")


def run_demo(quick: bool = False, generate_plots: bool = True) -> dict:
    """
    Run complete energy derivatives pricing demonstration.

    Parameters
    ----------
    quick : bool
        If True, use fewer simulations for faster runtime
    generate_plots : bool
        If True, generate and save all visualizations

    Returns
    -------
    dict
        Complete results dictionary
    """

    warnings.filterwarnings('ignore')
    results = {}

    # Configuration
    n_simulations = 5000 if quick else 10000
    n_steps_convergence = 100 if quick else 200

    print_header("ENERGY DERIVATIVES PRICING FRAMEWORK")
    print(f"Demo started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Mode: {'Quick' if quick else 'Full'} demo")

    # ========================================
    # SECTION 1: DATA LOADING
    # ========================================
    print_header("1. EMPIRICAL DATA LOADING", "-")

    # Try both possible data locations
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'empirical_data')
    if not os.path.exists(data_dir):
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'empirical')
    params = load_parameters(data_dir=data_dir, T=1.0, r=0.05)

    S0 = params['S0']
    K = params['K']
    T = params['T']
    r = params['r']
    sigma = params['sigma']
    ceir_df = params['ceir_df']

    print(f"Loaded CEIR data from: {data_dir}")

    # Summary statistics
    summary = get_ceir_summary(ceir_df)
    print(f"\nData Range: {summary['start_date'].date()} to {summary['end_date'].date()}")
    print(f"Total Days: {summary['n_days']:,}")
    print(f"Bitcoin Price Range: ${summary['price_min']:,.2f} - ${summary['price_max']:,.2f}")
    print(f"Current BTC Price: ${summary['price_current']:,.2f}")
    print(f"Current Market Cap: ${summary['market_cap_current']/1e9:.2f}B")
    print(f"Mean CEIR: {summary['ceir_mean']:.2f}")

    print_subheader("Derived Parameters")
    print(f"S0 (Energy Price):     {S0:.8f}")
    print(f"K  (Strike Price):     {K:.8f}")
    print(f"T  (Time to Maturity): {T:.2f} years")
    print(f"r  (Risk-free Rate):   {r:.2%}")
    print(f"sigma (Volatility):    {sigma:.4f} ({sigma*100:.2f}%)")

    results['params'] = params
    results['summary'] = summary

    # ========================================
    # SECTION 2: BINOMIAL PRICING
    # ========================================
    print_header("2. BINOMIAL OPTION PRICING MODEL", "-")

    print_subheader("Convergence Analysis")
    step_sizes = [10, 25, 50, 75, 100, 150, 200]
    if quick:
        step_sizes = [10, 25, 50, 75, 100]

    binomial_prices = []
    for N in step_sizes:
        tree = BinomialTree(S0=S0, K=K, T=T, r=r, sigma=sigma, N=N, payoff_type='call')
        price = tree.price()
        binomial_prices.append(price)
        print(f"  N={N:3d} steps: ${price:.10f}")

    # Final price (highest N)
    final_bin_price = binomial_prices[-1]
    print(f"\nFinal Binomial Price: ${final_bin_price:.10f}")

    # Check convergence
    if len(binomial_prices) > 1:
        convergence_rate = abs(binomial_prices[-1] - binomial_prices[-2]) / binomial_prices[-2]
        print(f"Convergence Rate: {convergence_rate:.6%}")

    results['binomial'] = {
        'steps': step_sizes,
        'prices': binomial_prices,
        'final_price': final_bin_price
    }

    # ========================================
    # SECTION 3: MONTE-CARLO SIMULATION
    # ========================================
    print_header("3. MONTE-CARLO SIMULATION", "-")

    print(f"Running {n_simulations:,} path simulations...")
    mc = MonteCarloSimulator(
        S0=S0, K=K, T=T, r=r, sigma=sigma,
        num_simulations=n_simulations,
        seed=42
    )

    mc_price, ci_low, ci_high = mc.confidence_interval()

    print(f"\nMonte-Carlo Price:  ${mc_price:.10f}")
    print(f"95% Confidence Interval:")
    print(f"  Lower: ${ci_low:.10f}")
    print(f"  Upper: ${ci_high:.10f}")
    print(f"  Width: ${ci_high - ci_low:.10f}")

    # Compare with Binomial
    diff_pct = abs(mc_price - final_bin_price) / final_bin_price * 100
    print(f"\nBinomial vs MC Difference: {diff_pct:.4f}%")

    # Validation
    if ci_low <= final_bin_price <= ci_high:
        print("VALIDATION: Binomial price within MC confidence interval")
    else:
        print("WARNING: Binomial price outside MC confidence interval")

    results['monte_carlo'] = {
        'price': mc_price,
        'ci_low': ci_low,
        'ci_high': ci_high,
        'n_simulations': n_simulations
    }

    # ========================================
    # SECTION 4: GREEKS CALCULATION
    # ========================================
    print_header("4. GREEKS (RISK SENSITIVITIES)", "-")

    calc = GreeksCalculator(S0=S0, K=K, T=T, r=r, sigma=sigma)
    greeks = calc.compute_all_greeks()

    print("Computed via finite differences:\n")

    # Delta
    print(f"Delta (price sensitivity):    {greeks['Delta']:.6f}")
    print(f"  Interpretation: ${greeks['Delta']*S0*100:.8f} change per 1% move in underlying")

    # Gamma
    print(f"\nGamma (delta curvature):      {greeks['Gamma']:.6f}")
    print(f"  Interpretation: Rebalancing frequency indicator")

    # Vega
    print(f"\nVega (volatility sensitivity): {greeks['Vega']:.10f}")
    print(f"  Interpretation: ${greeks['Vega']*0.01:.10f} change per 1pp vol increase")

    # Theta
    print(f"\nTheta (time decay):           {greeks['Theta']:.10f}")
    print(f"  Interpretation: ${greeks['Theta']/365:.12f} daily decay")

    # Rho
    print(f"\nRho (rate sensitivity):       {greeks['Rho']:.10f}")
    print(f"  Interpretation: ${greeks['Rho']*0.01:.10f} change per 1pp rate increase")

    results['greeks'] = greeks

    # ========================================
    # SECTION 5: STRESS TESTING
    # ========================================
    print_header("5. STRESS TESTING", "-")

    print_subheader("Volatility Stress Test")
    vol_shocks = [-0.20, -0.10, 0.0, 0.10, 0.20]
    vol_prices = []
    for shock in vol_shocks:
        new_sigma = sigma * (1 + shock)
        tree = BinomialTree(S0=S0, K=K, T=T, r=r, sigma=new_sigma, N=100)
        price = tree.price()
        vol_prices.append(price)
        print(f"  sigma = {new_sigma:.4f} ({shock:+.0%}): ${price:.10f}")

    print_subheader("Interest Rate Stress Test")
    rate_shocks = [-0.02, -0.01, 0.0, 0.01, 0.02]
    rate_prices = []
    for shock in rate_shocks:
        new_r = r + shock
        tree = BinomialTree(S0=S0, K=K, T=T, r=new_r, sigma=sigma, N=100)
        price = tree.price()
        rate_prices.append(price)
        print(f"  r = {new_r:.2%} ({shock:+.0%}pp): ${price:.10f}")

    results['stress_test'] = {
        'vol_shocks': vol_shocks,
        'vol_prices': vol_prices,
        'rate_shocks': rate_shocks,
        'rate_prices': rate_prices
    }

    # ========================================
    # SECTION 6: VISUALIZATIONS
    # ========================================
    if generate_plots:
        print_header("6. GENERATING VISUALIZATIONS", "-")

        results_dir = os.path.join(os.path.dirname(__file__), 'results')
        os.makedirs(results_dir, exist_ok=True)

        plotter = EnergyDerivativesPlotter()

        try:
            print("Generating convergence plot...")
            plotter.plot_binomial_convergence(
                S0=S0, K=K, T=T, r=r, sigma=sigma,
                step_range=list(range(10, n_steps_convergence+1, 10)),
                save_path=os.path.join(results_dir, '01_convergence.png')
            )
            print(f"  Saved: {results_dir}/01_convergence.png")
        except Exception as e:
            print(f"  Warning: Could not generate convergence plot: {e}")

        try:
            print("Generating Monte-Carlo distribution plot...")
            plotter.plot_monte_carlo_distribution(
                S0=S0, K=K, T=T, r=r, sigma=sigma,
                num_simulations=n_simulations,
                save_path=os.path.join(results_dir, '02_mc_distribution.png')
            )
            print(f"  Saved: {results_dir}/02_mc_distribution.png")
        except Exception as e:
            print(f"  Warning: Could not generate MC distribution plot: {e}")

        try:
            print("Generating Greeks curves...")
            plotter.plot_greeks_curves(
                S0=S0, K=K, T=T, r=r, sigma=sigma,
                save_path=os.path.join(results_dir, '03_greeks_curves.png')
            )
            print(f"  Saved: {results_dir}/03_greeks_curves.png")
        except Exception as e:
            print(f"  Warning: Could not generate Greeks curves: {e}")

        try:
            print("Generating volatility stress test plot...")
            plotter.plot_stress_test_volatility(
                S0=S0, K=K, T=T, r=r,
                num_simulations=n_simulations // 2,
                save_path=os.path.join(results_dir, '04_stress_volatility.png')
            )
            print(f"  Saved: {results_dir}/04_stress_volatility.png")
        except Exception as e:
            print(f"  Warning: Could not generate volatility stress plot: {e}")

        try:
            print("Generating rate stress test plot...")
            plotter.plot_stress_test_rate(
                S0=S0, K=K, T=T, sigma=sigma,
                num_simulations=n_simulations // 2,
                save_path=os.path.join(results_dir, '05_stress_rate.png')
            )
            print(f"  Saved: {results_dir}/05_stress_rate.png")
        except Exception as e:
            print(f"  Warning: Could not generate rate stress plot: {e}")

        print(f"\nAll visualizations saved to: {results_dir}/")

    # ========================================
    # SECTION 7: SUMMARY
    # ========================================
    print_header("DEMO SUMMARY", "=")

    print(f"Empirical Data: {summary['n_days']:,} days of Bitcoin CEIR")
    print(f"Date Range: {summary['start_date'].date()} to {summary['end_date'].date()}")
    print()
    print("PRICING RESULTS:")
    print(f"  Binomial Model:    ${final_bin_price:.10f}")
    print(f"  Monte-Carlo Model: ${mc_price:.10f}")
    print(f"  Difference:        {diff_pct:.4f}%")
    print()
    print("KEY GREEKS:")
    print(f"  Delta: {greeks['Delta']:.6f}")
    print(f"  Gamma: {greeks['Gamma']:.6f}")
    print(f"  Vega:  {greeks['Vega']:.10f}")
    print()
    print("VALIDATION:")
    print(f"  Models converged within {diff_pct:.4f}%")
    print(f"  Greeks computed via finite differences")
    print(f"  Stress testing completed for vol and rates")
    print()
    print(f"Demo completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    return results


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Energy Derivatives Pricing Framework Demo"
    )
    parser.add_argument(
        '--quick',
        action='store_true',
        help='Run quick demo with fewer simulations'
    )
    parser.add_argument(
        '--no-plots',
        action='store_true',
        help='Skip plot generation'
    )

    args = parser.parse_args()

    results = run_demo(
        quick=args.quick,
        generate_plots=not args.no_plots
    )

    return results


if __name__ == "__main__":
    results = main()

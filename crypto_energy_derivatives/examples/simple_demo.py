"""
Simple Demo Script
==================

Demonstrates basic usage of the cryptocurrency energy derivatives framework.

Run this script to see a quick demonstration without needing Jupyter.
"""

import sys
sys.path.insert(0, '../src')

from data_loader import CryptoDataLoader
from energy_analyzer import EnergyAnalyzer
from derivatives_pricer import DerivativesPricer
from greeks import GreeksCalculator

def main():
    print("=" * 70)
    print("Cryptocurrency Energy Derivatives - Simple Demo")
    print("=" * 70)
    print()

    # Step 1: Load Data
    print("Step 1: Loading Bitcoin Data...")
    print("-" * 70)
    loader = CryptoDataLoader(data_dir='../../empirical')
    btc_data = loader.load_bitcoin_data()

    summary = loader.get_data_summary('BTC')
    print(f"Loaded {summary['n_days']} days of data")
    print(f"Date range: {summary['start_date'].date()} to {summary['end_date'].date()}")
    print(f"Current price: ${summary['price_current']:,.2f}")
    print(f"Current energy: {summary['energy_current']:.2f} TWh/year")
    print()

    # Step 2: Analyze Energy Costs
    print("Step 2: Analyzing Energy Costs...")
    print("-" * 70)
    analyzer = EnergyAnalyzer(btc_data, electricity_price=0.05)

    energy_price = analyzer.get_current_energy_price()
    volatility = analyzer.estimate_volatility()
    ecr_summary = analyzer.get_ecr_summary()

    print(f"Current energy unit price: ${energy_price:.4f}")
    print(f"Annualized volatility: {volatility:.2%}")
    print(f"Mean ECR: {ecr_summary['mean']:.2f}")
    print(f"Current ECR: {ecr_summary['current']:.2f}")
    print()

    # Step 3: Price Derivatives
    print("Step 3: Pricing Derivatives...")
    print("-" * 70)
    pricer = DerivativesPricer(S0=energy_price, sigma=volatility, r=0.05)

    # Forward contract
    forward_1y = pricer.price_forward(T=1.0)
    print(f"1-year forward price: ${forward_1y:.4f}")

    # European call
    euro_call = pricer.price_european_call(K=energy_price, T=1.0)
    print(f"European call (ATM, 1Y): ${euro_call:.4f}")

    # American call
    amer_call = pricer.price_american_call(K=energy_price, T=1.0)
    print(f"American call (ATM, 1Y): ${amer_call:.4f}")

    # Early exercise premium
    eep = amer_call - euro_call
    print(f"Early exercise premium: ${eep:.4f}")
    print()

    # Step 4: Compute Greeks
    print("Step 4: Computing Greeks...")
    print("-" * 70)
    calc = GreeksCalculator(
        S0=energy_price,
        K=energy_price,
        T=1.0,
        r=0.05,
        sigma=volatility,
        option_type='call'
    )

    greeks = calc.compute_all_greeks()
    for name, value in greeks.items():
        print(f"{name:10s}: {value:10.4f}")
    print()

    # Step 5: Token Design Parameters
    print("Step 5: Token Design Recommendations...")
    print("-" * 70)
    params = pricer.token_design_parameters(T=1.0, guarantee_ratio=1.1)

    print(f"Fair token value: ${params['fair_token_value']:.4f}")
    print(f"Guarantee cost (110%): ${params['guarantee_cost']:.4f}")
    print(f"Reserves needed (95%): ${params['reserves_95_confidence']:.4f}")
    print(f"Recommended backing: {params['recommended_backing_ratio']:.0%}")
    print()

    print("=" * 70)
    print("Demo Complete!")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Run the full Jupyter notebook: notebooks/demo.ipynb")
    print("2. Explore the API documentation: docs/API_REFERENCE.md")
    print("3. Read the methodology: docs/METHODOLOGY.md")
    print()


if __name__ == "__main__":
    main()

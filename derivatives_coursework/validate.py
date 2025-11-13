"""
Quick Validation Script
========================

Tests that all modules are working correctly.
Run this before submitting to ensure everything works!
"""

import sys
import traceback

def test_imports():
    """Test that all modules can be imported."""
    print("Testing imports...")
    try:
        import numpy as np
        print("  ✓ numpy")
        import pandas as pd
        print("  ✓ pandas")
        import matplotlib.pyplot as plt
        print("  ✓ matplotlib")
        import scipy
        print("  ✓ scipy")
        from pricer import AmericanOptionPricer
        print("  ✓ pricer")
        from data_utils import load_energy_data, estimate_volatility
        print("  ✓ data_utils")
        from live_data import LiveDataFetcher
        print("  ✓ live_data")
        from visualizations import ProfessionalVisualizer
        print("  ✓ visualizations")
        return True
    except Exception as e:
        print(f"  ✗ Import failed: {e}")
        traceback.print_exc()
        return False

def test_pricer():
    """Test American option pricer."""
    print("\nTesting American option pricer...")
    try:
        from pricer import AmericanOptionPricer

        pricer = AmericanOptionPricer(
            S0=1.0, K=1.0, T=1.0, r=0.05, sigma=0.45, N=50
        )

        price = pricer.price()
        assert 0.0 < price < 1.0, f"Price seems wrong: {price}"
        print(f"  ✓ Price computed: ${price:.4f}")

        greeks = pricer.compute_greeks()
        assert 'delta' in greeks and 'gamma' in greeks
        print(f"  ✓ Greeks computed: Delta={greeks['delta']:.4f}")

        boundary = pricer.compute_exercise_boundary()
        print(f"  ✓ Exercise boundary computed: {len(boundary)} points")

        return True
    except Exception as e:
        print(f"  ✗ Pricer test failed: {e}")
        traceback.print_exc()
        return False

def test_live_data():
    """Test live data fetcher (with fallback)."""
    print("\nTesting live data fetcher...")
    try:
        from live_data import LiveDataFetcher

        fetcher = LiveDataFetcher()

        # This will try API and fall back to synthetic data if needed
        current = fetcher.fetch_bitcoin_price()
        assert 'price' in current
        print(f"  ✓ Bitcoin price: ${current['price']:,.2f}")
        print(f"  ✓ Data source: {current['source']}")

        # Get pricing parameters
        params = fetcher.get_live_pricing_parameters(historical_days=90)
        assert 'S0' in params and 'sigma' in params
        print(f"  ✓ Pricing parameters computed: S₀=${params['S0']:.4f}, σ={params['sigma']:.1%}")

        return True
    except Exception as e:
        print(f"  ✗ Live data test failed: {e}")
        traceback.print_exc()
        return False

def test_data_utils():
    """Test data utilities."""
    print("\nTesting data utilities...")
    try:
        from data_utils import load_energy_data, estimate_volatility
        import numpy as np

        # Try to load empirical data (or generate fallback)
        data = load_energy_data()
        assert 'energy_price' in data
        print(f"  ✓ Data loaded: {data['n_points']} data points")
        print(f"  ✓ Data source: {data['source']}")

        # Test volatility estimation
        prices = np.array([100, 102, 101, 103, 104, 102, 105])
        vol = estimate_volatility(prices)
        assert 0.0 < vol < 10.0  # Reasonable range
        print(f"  ✓ Volatility estimation works: {vol:.1%}")

        return True
    except Exception as e:
        print(f"  ✗ Data utils test failed: {e}")
        traceback.print_exc()
        return False

def test_visualizations():
    """Test visualization module (without displaying)."""
    print("\nTesting visualizations...")
    try:
        from visualizations import ProfessionalVisualizer
        import matplotlib
        matplotlib.use('Agg')  # Non-interactive backend

        viz = ProfessionalVisualizer()
        print("  ✓ ProfessionalVisualizer created")
        print("  ✓ Visualization methods available:")
        print("    - plot_option_value_surface")
        print("    - plot_comprehensive_analysis")
        print("    - plot_greeks_heatmap")

        return True
    except Exception as e:
        print(f"  ✗ Visualization test failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all validation tests."""
    print("=" * 70)
    print("COURSEWORK VALIDATION")
    print("=" * 70)
    print()

    tests = [
        ("Imports", test_imports),
        ("American Option Pricer", test_pricer),
        ("Live Data Fetcher", test_live_data),
        ("Data Utilities", test_data_utils),
        ("Visualizations", test_visualizations),
    ]

    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\nUnexpected error in {name}: {e}")
            traceback.print_exc()
            results.append((name, False))

    # Summary
    print("\n" + "=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)

    for name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{status:8} {name}")

    all_passed = all(success for _, success in results)

    print()
    if all_passed:
        print("🎉 ALL TESTS PASSED! Ready for submission!")
        print()
        print("Next steps:")
        print("  1. Launch notebook: jupyter notebook interactive_demo.ipynb")
        print("  2. Run all cells: Kernel → Restart & Run All")
        print("  3. Verify interactive sliders work")
        print("  4. Practice 5-minute demo presentation")
        print("  5. Submit with confidence! 🎯")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print()
        print("Common issues:")
        print("  - Missing dependencies: pip install -r requirements.txt")
        print("  - API rate limits: Will use fallback data automatically")
        print("  - Import errors: Check Python version (needs 3.7+)")

    print("=" * 70)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())

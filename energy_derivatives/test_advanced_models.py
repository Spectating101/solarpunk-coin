"""
Quick validation test for advanced models (v0.5.0)
Run this to verify everything works after making changes.
"""

import numpy as np
import sys
sys.path.insert(0, '.')

from spk_derivatives.mean_reversion import OrnsteinUhlenbeck
from spk_derivatives.jump_diffusion import MertonJumpDiffusion, EnergyJumpModel
from spk_derivatives.implied_vol import implied_volatility, black_scholes_call


def test_mean_reversion():
    """Test Ornstein-Uhlenbeck mean-reversion model."""
    ou = OrnsteinUhlenbeck(S0=100, kappa=2.0, theta=100, sigma=0.3, T=1.0)
    
    # Simulate paths
    times, paths = ou.simulate_paths(num_paths=100, num_steps=50, seed=42)
    assert paths.shape == (51, 100), "Path shape mismatch"
    assert np.abs(paths[-1, :].mean() - 100) < 10, "Mean-reversion not working"
    
    # Price option
    result = ou.price_european_call(K=105, num_paths=10000, seed=42)
    assert 'price' in result, "Missing price in result"
    assert result['price'] >= 0, "Negative price"
    
    return True


def test_jump_diffusion():
    """Test Merton jump-diffusion model."""
    jd = MertonJumpDiffusion(
        S0=100, mu=0.05, sigma=0.2, lambda_jump=2.0,
        mu_jump=0.3, sigma_jump=0.5, T=1.0
    )
    
    # Simulate with jumps
    times, paths, jumps = jd.simulate_paths(num_paths=100, num_steps=252, seed=42)
    assert paths.shape == (253, 100), "Path shape mismatch"
    assert jumps.sum() > 0, "No jumps detected"
    assert 1.5 < jumps.mean() < 2.5, f"Jump rate off: {jumps.mean()}"
    
    # Analytical pricing
    call_price = jd.price_european_call_analytical(K=105, num_terms=30)
    assert call_price > 0, "Analytical price should be positive"
    
    return True


def test_energy_jump_model():
    """Test energy-specific jump model."""
    ejm = EnergyJumpModel(S0=100, energy_type='electricity')
    
    assert ejm.energy_type == 'electricity'
    assert ejm.lambda_jump > 0
    
    times, paths, jumps = ejm.simulate_paths(num_paths=50, num_steps=100, seed=42)
    assert paths.shape[1] == 50, "Wrong number of paths"
    
    return True


def test_implied_volatility():
    """Test implied volatility calculation."""
    S0, K, T, r, sigma_true = 100, 105, 0.25, 0.05, 0.30
    
    # Generate market price with known vol
    market_price = black_scholes_call(S0, K, T, r, sigma_true)
    
    # Recover implied vol
    sigma_implied = implied_volatility(market_price, S0, K, T, r)
    error = abs(sigma_implied - sigma_true)
    
    assert error < 1e-5, f"Implied vol error too large: {error}"
    
    return True


def test_calibration():
    """Test parameter calibration from data."""
    # Generate synthetic mean-reverting data
    np.random.seed(42)
    prices = 100 + np.cumsum(np.random.randn(500) * 2)
    
    # Calibrate
    params = OrnsteinUhlenbeck.calibrate_from_data(prices, dt=1/252)
    
    assert 'kappa' in params
    assert 'theta' in params
    assert 'sigma' in params
    assert params['kappa'] >= 0
    
    return True


if __name__ == "__main__":
    tests = [
        ("Mean-Reversion", test_mean_reversion),
        ("Jump-Diffusion", test_jump_diffusion),
        ("Energy Jump Model", test_energy_jump_model),
        ("Implied Volatility", test_implied_volatility),
        ("Calibration", test_calibration),
    ]
    
    print("="*60)
    print("Running Advanced Models Test Suite")
    print("="*60)
    
    passed = 0
    failed = 0
    
    for name, test_func in tests:
        try:
            test_func()
            print(f"✓ {name}")
            passed += 1
        except AssertionError as e:
            print(f"✗ {name}: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {name}: Unexpected error: {e}")
            failed += 1
    
    print("="*60)
    print(f"Results: {passed} passed, {failed} failed")
    print("="*60)
    
    if failed == 0:
        print("✅ All tests passed - library is working correctly")
        sys.exit(0)
    else:
        print(f"❌ {failed} test(s) failed")
        sys.exit(1)

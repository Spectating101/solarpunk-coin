"""
Basic SPK Bridge Usage
======================

Simple example showing how to use the SPK Derivatives Bridge.
"""

import sys
sys.path.insert(0, '..')

from ceir_bridge import CEIRBridge
from spk_pricer import SPKTokenPricer
from config import SPKConfig

def main():
    print("=" * 70)
    print("SPK Derivatives Bridge - Basic Example")
    print("=" * 70)

    # Step 1: Load CEIR data
    print("\n1. Loading CEIR data from empirical folder...")
    bridge = CEIRBridge(ceir_data_path='../../empirical')

    # Get pricing parameters
    params = bridge.extract_pricing_parameters()
    print(f"   Energy Price (S₀): ${params['S0']:.4f}")
    print(f"   Volatility (σ):    {params['sigma']:.1%}")

    # Step 2: Configure SPK token
    print("\n2. Configuring SPK token (balanced preset)...")
    config = SPKConfig.balanced()
    print(f"   Backing Ratio: {config.backing_ratio:.0%}")
    print(f"   Peg Band: ±{config.peg_band:.0%}")

    # Step 3: Price SPK mechanics
    print("\n3. Pricing SPK token mechanics...")
    pricer = SPKTokenPricer(
        S0=params['S0'],
        sigma=params['sigma'],
        r=0.05,
        config=config
    )

    spk_params = pricer.compute_token_parameters()

    # Step 4: Display results
    print("\n" + "=" * 70)
    print("SPK Design Parameters")
    print("=" * 70)

    print(f"\nPricing:")
    print(f"  Fair Token Price:          ${spk_params['fair_price']:.4f}")
    print(f"  Base Energy Value:         ${spk_params['base_energy_value']:.4f}")
    print(f"  Redemption Option Premium: ${spk_params['redemption_option_value']:.4f}")

    print(f"\nCosts:")
    print(f"  Guarantee Cost:     ${spk_params['guarantee_cost']:.4f} (one-time)")
    print(f"  Peg Stability Cost: ${spk_params['peg_stability_cost_annual']:.4f} (annual)")

    print(f"\nReserves:")
    print(f"  Required per Token: ${spk_params['reserve_requirement']:.4f}")
    print(f"  Backing Ratio:      {spk_params['backing_ratio']:.0%}")

    print("\n" + "=" * 70)
    print("✓ Ready to use these parameters in SPK implementation")
    print("=" * 70)


if __name__ == "__main__":
    main()

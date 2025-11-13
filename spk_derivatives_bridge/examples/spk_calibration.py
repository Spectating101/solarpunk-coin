"""
SPK Full Calibration Example
============================

Complete example showing full SPK token parameter calibration
from CEIR data to deployment-ready parameters.
"""

import sys
sys.path.insert(0, '..')

from integration import full_spk_design_pipeline, compare_spk_configurations, print_design_comparison


def main():
    print("\n" + "=" * 80)
    print("SolarPunkCoin - Complete Calibration")
    print("=" * 80)

    # Run full pipeline
    print("\n" + "-" * 80)
    print("Running Full Design Pipeline...")
    print("-" * 80)

    result = full_spk_design_pipeline(
        ceir_data_path='../../empirical',
        config_preset='balanced'
    )

    # Display comprehensive results
    print("\n" + "=" * 80)
    print("Calibration Results")
    print("=" * 80)

    spk = result['spk_design']
    ceir = result['ceir_data']

    print(f"\nCEIR Data Summary:")
    print(f"  Observations:       {ceir['n_observations']}")
    print(f"  Current Price:      ${ceir['current_price']:.4f}")
    print(f"  Volatility:         {ceir['volatility']:.1%}")

    print(f"\nSPK Token Pricing:")
    print(f"  Fair Price:         ${spk['fair_price']:.4f}")
    print(f"  Base Energy:        ${spk['base_energy_value']:.4f}")
    print(f"  Redemption Option:  ${spk['redemption_option_value']:.4f}")

    print(f"\nSPK Costs:")
    print(f"  Guarantee (setup):  ${spk['guarantee_cost']:.4f}")
    print(f"  Peg (annual):       ${spk['peg_stability_cost_annual']:.4f}")
    print(f"  Total Issuance:     ${spk['total_issuance_cost']:.4f}")

    print(f"\nSPK Reserves:")
    print(f"  Per Token:          ${spk['reserve_requirement']:.4f}")
    print(f"  Backing Ratio:      {spk['backing_ratio']:.0%}")
    print(f"  Confidence:         {spk['confidence_level']:.0%}")

    print(f"\nRedemption Strategy:")
    print(f"  Fee:                {spk['redemption_fee']:.2%}")
    print(f"  Exercise Above:     ${spk['redemption_threshold']:.4f}")

    # Compare configurations
    print("\n\n" + "=" * 80)
    print("Configuration Sensitivity Analysis")
    print("=" * 80)

    comparison = compare_spk_configurations('../../empirical')
    print_design_comparison(comparison)

    # Recommendations
    print("\n" + "=" * 80)
    print("Deployment Recommendations")
    print("=" * 80)

    print(f"""
Based on calibration results:

1. **Initial Token Price**: Set to ${spk['fair_price']:.4f}

2. **Backing Strategy**:
   - Maintain {spk['backing_ratio']:.0%} energy backing
   - Hold ${spk['reserve_requirement']:.4f} reserves per token
   - Budget ${spk['guarantee_cost']:.4f} per token for guarantees

3. **Redemption Mechanism**:
   - Charge {spk['redemption_fee']:.1%} redemption fee
   - Expect redemptions when energy > ${spk['redemption_threshold']:.4f}

4. **Peg Stability**:
   - Budget ~${spk['peg_stability_cost_annual']:.4f} per token annually
   - Use mint/burn within ±{result['configuration']['peg_band']:.0%} band

5. **Risk Management**:
   - {ceir['volatility']:.0%} volatility requires active monitoring
   - Rebalance reserves quarterly
   - Stress test under ±20% volatility scenarios

6. **Configuration Choice**:
   - Conservative: Higher security, higher costs
   - Balanced: Recommended for launch (current)
   - Aggressive: Lower costs, higher risk
    """)

    print("=" * 80)
    print("✓ Calibration Complete - Ready for SPK Deployment")
    print("=" * 80)


if __name__ == "__main__":
    main()

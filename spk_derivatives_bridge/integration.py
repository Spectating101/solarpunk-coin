"""
Integration Utilities
=====================

Helper functions to integrate SPK Derivatives Bridge with the larger project.

Provides convenience functions for common workflows.
"""

from typing import Dict, Optional
from ceir_bridge import CEIRBridge
from spk_pricer import SPKTokenPricer
from config import SPKConfig, get_preset


def full_spk_design_pipeline(
    ceir_data_path: str = '../empirical',
    config_preset: str = 'balanced',
    custom_config: Optional[SPKConfig] = None
) -> Dict:
    """
    Complete pipeline: CEIR data → SPK design parameters.

    This is the main integration function.

    Parameters:
    -----------
    ceir_data_path : str
        Path to empirical CEIR data
    config_preset : str
        'conservative', 'balanced', or 'aggressive'
    custom_config : SPKConfig, optional
        Custom configuration (overrides preset)

    Returns:
    --------
    Dict
        Complete SPK design parameters ready for implementation
    """

    print("=" * 70)
    print("SPK Token Design Pipeline")
    print("=" * 70)

    # Step 1: Load CEIR data
    print("\n[1/3] Loading CEIR data...")
    bridge = CEIRBridge(ceir_data_path=ceir_data_path)
    pricing_params = bridge.extract_pricing_parameters()

    print(f"  ✓ Loaded {pricing_params['data_points']} data points")
    print(f"  ✓ Energy Price: ${pricing_params['S0']:.4f}")
    print(f"  ✓ Volatility: {pricing_params['sigma']:.1%}")

    # Step 2: Configure SPK
    print("\n[2/3] Configuring SPK token...")
    if custom_config:
        config = custom_config
        print(f"  ✓ Using custom configuration")
    else:
        config = get_preset(config_preset)
        print(f"  ✓ Using '{config_preset}' preset")

    print(f"  • Backing Ratio: {config.backing_ratio:.0%}")
    print(f"  • Peg Band: ±{config.peg_band:.0%}")

    # Step 3: Price SPK mechanics
    print("\n[3/3] Pricing SPK token mechanics...")
    pricer = SPKTokenPricer(
        S0=pricing_params['S0'],
        sigma=pricing_params['sigma'],
        r=pricing_params['r'],
        config=config
    )

    spk_params = pricer.compute_token_parameters()

    print(f"  ✓ Fair Token Price: ${spk_params['fair_price']:.4f}")
    print(f"  ✓ Reserve Requirement: ${spk_params['reserve_requirement']:.4f}")
    print(f"  ✓ Guarantee Cost: ${spk_params['guarantee_cost']:.4f}")

    # Combine all info
    result = {
        'spk_design': spk_params,
        'ceir_data': bridge.get_summary(),
        'pricing_inputs': pricing_params,
        'configuration': config.to_dict(),
    }

    print("\n" + "=" * 70)
    print("✓ SPK Design Pipeline Complete")
    print("=" * 70)

    return result


def compare_spk_configurations(ceir_data_path: str = '../empirical') -> Dict:
    """
    Compare SPK designs under different configurations.

    Useful for sensitivity analysis.

    Parameters:
    -----------
    ceir_data_path : str
        Path to CEIR data

    Returns:
    --------
    Dict
        Comparison of conservative, balanced, aggressive designs
    """

    bridge = CEIRBridge(ceir_data_path=ceir_data_path)
    params = bridge.extract_pricing_parameters()

    results = {}

    for preset_name in ['conservative', 'balanced', 'aggressive']:
        config = get_preset(preset_name)
        pricer = SPKTokenPricer(S0=params['S0'], sigma=params['sigma'], r=params['r'], config=config)
        spk_params = pricer.compute_token_parameters()

        results[preset_name] = {
            'fair_price': spk_params['fair_price'],
            'reserves': spk_params['reserve_requirement'],
            'guarantee_cost': spk_params['guarantee_cost'],
            'backing_ratio': spk_params['backing_ratio'],
            'peg_band': config.peg_band,
        }

    return results


def export_for_smart_contract(spk_params: Dict, output_file: str = 'spk_contract_params.json'):
    """
    Export SPK parameters in format suitable for smart contract deployment.

    Parameters:
    -----------
    spk_params : Dict
        SPK design parameters from full_spk_design_pipeline()
    output_file : str
        Output JSON file path
    """
    import json

    # Extract key parameters for smart contract
    contract_params = {
        'initialPrice': float(spk_params['spk_design']['fair_price']),
        'backingRatio': float(spk_params['spk_design']['backing_ratio']),
        'reserveRequirement': float(spk_params['spk_design']['reserve_requirement']),
        'redemptionFee': float(spk_params['spk_design']['redemption_fee']),
        'pegTarget': float(spk_params['configuration']['peg_target']),
        'pegBand': float(spk_params['configuration']['peg_band']),
        'energyPrice': float(spk_params['pricing_inputs']['S0']),
        'volatility': float(spk_params['pricing_inputs']['sigma']),
    }

    with open(output_file, 'w') as f:
        json.dump(contract_params, f, indent=2)

    print(f"✓ Exported smart contract parameters to {output_file}")


def print_design_comparison(comparison: Dict):
    """
    Print formatted comparison of SPK configurations.

    Parameters:
    -----------
    comparison : Dict
        Output from compare_spk_configurations()
    """

    print("\n" + "=" * 80)
    print("SPK Configuration Comparison")
    print("=" * 80)

    print(f"\n{'Parameter':<30} {'Conservative':>15} {'Balanced':>15} {'Aggressive':>15}")
    print("-" * 80)

    # Fair Price
    print(f"{'Fair Token Price':<30} ", end='')
    for config in ['conservative', 'balanced', 'aggressive']:
        print(f"${comparison[config]['fair_price']:>13.4f}  ", end='')
    print()

    # Reserves
    print(f"{'Reserve Requirement':<30} ", end='')
    for config in ['conservative', 'balanced', 'aggressive']:
        print(f"${comparison[config]['reserves']:>13.4f}  ", end='')
    print()

    # Guarantee Cost
    print(f"{'Guarantee Cost':<30} ", end='')
    for config in ['conservative', 'balanced', 'aggressive']:
        print(f"${comparison[config]['guarantee_cost']:>13.4f}  ", end='')
    print()

    # Backing Ratio
    print(f"{'Backing Ratio':<30} ", end='')
    for config in ['conservative', 'balanced', 'aggressive']:
        print(f"{comparison[config]['backing_ratio']:>13.0%}  ", end='')
    print()

    # Peg Band
    print(f"{'Peg Band':<30} ", end='')
    for config in ['conservative', 'balanced', 'aggressive']:
        print(f"±{comparison[config]['peg_band']:>12.0%}  ", end='')
    print()

    print("=" * 80)


# Example usage
if __name__ == "__main__":
    print("SPK Integration - Full Pipeline Example\n")

    # Run full pipeline
    result = full_spk_design_pipeline(
        ceir_data_path='../empirical',
        config_preset='balanced'
    )

    # Print detailed summary
    print("\n" + "=" * 70)
    print("Detailed Results:")
    print("=" * 70)

    spk = result['spk_design']
    print(f"\nFair Token Price:        ${spk['fair_price']:.4f}")
    print(f"Redemption Option:       ${spk['redemption_option_value']:.4f}")
    print(f"Guarantee Cost:          ${spk['guarantee_cost']:.4f}")
    print(f"Reserve Requirement:     ${spk['reserve_requirement']:.4f}")
    print(f"Peg Stability (annual):  ${spk['peg_stability_cost_annual']:.4f}")

    # Compare configurations
    print("\n\nComparing Configurations...\n")
    comparison = compare_spk_configurations('../empirical')
    print_design_comparison(comparison)

    # Export for smart contract
    print("\n")
    export_for_smart_contract(result, 'spk_contract_params.json')

    print("\n✓ Integration example complete!")

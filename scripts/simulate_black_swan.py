
import numpy as np
import pandas as pd
import sys
import os

# Add energy_derivatives to path
sys.path.insert(0, os.path.join(os.getcwd(), 'energy_derivatives'))
from spk_derivatives.jump_diffusion import EnergyJumpModel

def run_black_swan_test():
    print("="*60)
    print("SOLARPUNK PROTOCOL: BLACK SWAN SOLVENCY TEST")
    print("Scenario: 90-Day Solar Winter + Speculative Attack")
    print("="*60)

    # --- Setup ---
    # Protocol Parameters (Synced with April 2026 Hardening)
    INITIAL_MARGIN = 2.5     # 250%
    MAINTENANCE_MARGIN = 1.25 # 125%
    INSURANCE_FUND_START = 50000.0 # Initial $50k buffer in Treasury
    
    # Simulation Parameters
    NUM_PATHS = 5000
    T_DAYS = 90
    dt = 1/365
    T = T_DAYS * dt

    # 1. Pilot-Scale Solar Profile (Taiwan/California typical)
    # Volatility 200%, 5 jumps per year (storm/grid events)
    model = EnergyJumpModel(S0=100.0, base_volatility=2.0, jump_intensity=5.0, T=T, energy_type='solar')
    times, paths, jump_counts = model.simulate_paths(num_paths=NUM_PATHS, num_steps=T_DAYS, seed=88)

    # 2. Tracking Protocol Health
    protocol_failures = 0
    total_insurance_drain = 0
    max_single_path_drain = 0
    
    # We assume a Pilot Scale Exposure: 100 MWh total (100,000 kWh)
    # At $0.10/kWh, this is $10,000 in notional exposure.
    CONTRACTS = 100
    NOTIONAL = 1.0
    K = 100.0 # Strike (scaled for simulation)

    path_losses = []

    for j in range(NUM_PATHS):
        path = paths[:, j]
        path_max_drain = 0
        path_insolvent = False
        
        for t in range(1, len(path)):
            S_t = path[t]
            # PnL per contract (Short Call/Hedge)
            # If price spikes to $500, PnL = (100 - 500) * 1 = -$400
            pnl = (K - S_t) * NOTIONAL
            margin_per_contract = (K * INITIAL_MARGIN) + pnl
            
            if margin_per_contract < 0:
                # Protocol must cover the negative balance to stay solvent
                drain = abs(margin_per_contract) * CONTRACTS
                if drain > path_max_drain:
                    path_max_drain = drain
                path_insolvent = True

        if path_insolvent:
            protocol_failures += 1
            total_insurance_drain += path_max_drain
            max_single_path_drain = max(max_single_path_drain, path_max_drain)
            path_losses.append(path_max_drain)
        else:
            path_losses.append(0)

    # --- Statistical Analysis ---
    survival_rate = ((NUM_PATHS - protocol_failures) / NUM_PATHS) * 100
    avg_drain = total_insurance_drain / protocol_failures if protocol_failures > 0 else 0
    # Value at Risk (VaR) 95%: The drain we exceed only 5% of the time
    var_95 = np.percentile(path_losses, 95)
    var_99 = np.percentile(path_losses, 99)

    print(f"Simulation Days:      {T_DAYS}")
    print(f"Shock Intensity:      200% Volatility + Stochastic Jumps")
    print(f"Total Hedge Exposure: ${CONTRACTS * K:,.2f} (100 MWh)")
    print("-" * 40)
    print(f"Survival Rate:        {survival_rate:.2f}%")
    print(f"Insolvency Events:    {protocol_failures} / {NUM_PATHS}")
    print(f"Max Potential Drain:  ${max_single_path_drain:,.2f}")
    print(f"95% Probable Drain:   ${var_95:,.2f}")
    print(f"99% Probable Drain:   ${var_99:,.2f}")
    print("-" * 40)

    # --- Capitalization Insight ---
    required_buffer = var_99
    current_status = "UNDER-CAPITALIZED" if INSURANCE_FUND_START < required_buffer else "ROBUST"
    
    print(f"REQUIRED INSURANCE BUFFER (99% Confidence): ${required_buffer:,.2f}")
    print(f"Current Treasury Status: {current_status}")
    print("-" * 40)
    
    if current_status == "UNDER-CAPITALIZED":
        print("INSIGHT: To be 'worthy' of institutional solar pilots, the Treasury")
        print(f"needs to secure at least ${required_buffer - INSURANCE_FUND_START:,.2f} in additional")
        print("liquidity (e.g., via a Chainlink BUILD grant or Initial Stake).")
    else:
        print("INSIGHT: The protocol is robust. Current capitalization handles a 1-in-100 year event.")

if __name__ == "__main__":
    run_black_swan_test()

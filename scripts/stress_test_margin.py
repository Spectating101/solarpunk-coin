
import numpy as np
import sys
import os

# Add energy_derivatives to path for imports
sys.path.insert(0, os.path.join(os.getcwd(), 'energy_derivatives'))

from spk_derivatives.jump_diffusion import EnergyJumpModel

def run_margin_stress_test():
    print("Starting Margin Stress Test (SolarPunkOption Parameters)...")
    
    # --- Configuration ---
    S0 = 100.0          # Initial Price
    K = 100.0           # Strike Price
    notional = 1.0      # Notional kWh
    
    initial_margin_bps = 25000      # 250% (Recommended)
    maintenance_margin_bps = 12500   # 125%  (Recommended)
    
    # Simulation params
    T = 30 / 365        # 30-day horizon
    num_paths = 10000
    num_steps = 30      # Daily checks
    
    # Energy Jump Model (Solar/Electricity Profile)
    # Solar vol is high (200%), jumps are moderate
    model = EnergyJumpModel(S0=S0, base_volatility=2.0, jump_intensity=5.0, T=T, energy_type='solar')
    
    times, paths, jump_counts = model.simulate_paths(num_paths=num_paths, num_steps=num_steps, seed=42)
    
    # --- Stress Test Logic ---
    # We simulate a SHORT position (hedging against price spikes)
    # Exposure = strike * notional
    exposure = K * notional
    initial_margin = (exposure * initial_margin_bps) / 10000
    maintenance_req = (exposure * maintenance_margin_bps) / 10000
    
    mm_violations = 0
    insolvencies = 0
    max_drawdown = 0
    total_loss_at_insolvency = 0
    
    for j in range(num_paths):
        path = paths[:, j]
        path_insolvent = False
        path_violated = False
        
        for t in range(1, len(path)):
            S_t = path[t]
            
            # PnL for Short = (K - S_t) * notional
            pnl = (K - S_t) * notional
            current_margin = initial_margin + pnl
            
            if current_margin < 0:
                if not path_insolvent:
                    insolvencies += 1
                    total_loss_at_insolvency += abs(current_margin)
                    path_insolvent = True
                
            if current_margin < maintenance_req:
                if not path_violated:
                    mm_violations += 1
                    path_violated = True
            
            drawdown = max(0, initial_margin - current_margin)
            if drawdown > max_drawdown:
                max_drawdown = drawdown

    # --- Results ---
    insolvency_rate = (insolvencies / num_paths) * 100
    violation_rate = (mm_violations / num_paths) * 100
    avg_loss_at_insolvency = total_loss_at_insolvency / insolvencies if insolvencies > 0 else 0
    
    print("-" * 40)
    print(f"Results for 30-day Solar Hedge (Short Call):")
    print(f"Total Paths:            {num_paths}")
    print(f"Volatility (Annual):    200%")
    print(f"Initial Margin:         {initial_margin_bps/100}% (${initial_margin:.2f})")
    print(f"Maintenance Margin:     {maintenance_margin_bps/100}% (${maintenance_req:.2f})")
    print("-" * 40)
    print(f"MM Violations:          {mm_violations} ({violation_rate:.2f}%)")
    print(f"Insolvencies (Net < 0): {insolvencies} ({insolvency_rate:.2f}%)")
    if insolvencies > 0:
        print(f"Avg Loss at Insolvency: ${avg_loss_at_insolvency:.2f}")
    print(f"Max Margin Drawdown:    ${max_drawdown:.2f}")
    print("-" * 40)
    
    if insolvency_rate > 1.0:
        print("CRITICAL: Insolvency rate > 1%. Maintenance margin may be TOO THIN for 200% vol.")
        print("RECOMMENDATION: Increase initialMarginBps to 200% or maintenanceMarginBps to 100%.")
    else:
        print("SAFE: Insolvency rate within acceptable limits (< 1%).")

if __name__ == "__main__":
    run_margin_stress_test()

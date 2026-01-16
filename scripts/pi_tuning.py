#!/usr/bin/env python3
"""
Enhanced PI Control Tuning Script for SolarPunkCoin
Runs extended simulations to optimize control parameters

Usage:
    python3 pi_tuning.py                    # Run with defaults
    python3 pi_tuning.py --days 10000 --p-range 0.5:2.0
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from dataclasses import dataclass
from typing import List, Tuple, Dict
import argparse
import json
from datetime import datetime
import sys

@dataclass
class PIParams:
    """PI Controller parameters"""
    proportional_gain: float  # Kp
    integral_gain: float       # Ki
    integral_error: float = 0.0

@dataclass
class SimulationResult:
    """Results from one simulation run"""
    params: PIParams
    days_in_band: float        # % of days within ±5%
    avg_price: float
    std_price: float
    max_excursion: float       # Worst daily deviation
    total_mints: int
    total_burns: int
    final_supply: float

class PIControllerSimulator:
    """Simulate SolarPunkCoin PI control over extended period"""
    
    def __init__(self, days=1000, random_seed=42):
        self.days = days
        self.random_seed = random_seed
        np.random.seed(random_seed)
    
    def simulate(self, peg_target=1.0, peg_band=0.05, daily_surplus_kwh=1000,
                 p_gain=0.01, i_gain=0.005) -> SimulationResult:
        """
        Run extended simulation with given parameters
        
        Args:
            peg_target: Target peg price in USD
            peg_band: Allowed deviation (e.g., 0.05 = ±5%)
            daily_surplus_kwh: Daily renewable energy surplus
            p_gain: Proportional gain (0.005-0.05)
            i_gain: Integral gain (0.001-0.01)
        
        Returns:
            SimulationResult with metrics
        """
        
        # Simulation state
        prices = np.zeros(self.days)
        deviations = np.zeros(self.days)
        in_band = np.zeros(self.days, dtype=bool)
        minted = np.zeros(self.days)
        burned = np.zeros(self.days)
        supplies = np.zeros(self.days)
        
        # Initial state
        current_price = peg_target
        integral_error = 0.0
        supply = daily_surplus_kwh  # Start with 1 day of surplus
        
        # Simulation constants
        market_volatility = 0.05  # 5% daily volatility
        shock_probability = 0.01  # 1% chance per day
        shock_magnitude = 0.15    # ±15% shocks
        
        for day in range(self.days):
            # Market price movement (GBM)
            dW = np.random.normal(0, 1)
            price_shock = market_volatility * dW
            
            # Rare shocks
            if np.random.random() < shock_probability:
                price_shock += np.random.uniform(-shock_magnitude, shock_magnitude)
            
            current_price *= (1 + price_shock)
            current_price = max(0.01, current_price)  # Prevent negative prices
            
            # Calculate deviation from peg
            deviation = (current_price - peg_target) / peg_target
            
            # PI control logic
            integral_error += deviation
            proportional_action = p_gain * deviation
            integral_action = i_gain * integral_error
            total_action = proportional_action + integral_action
            
            # Mint or burn based on control signal
            if total_action > 0:  # Price above peg: burn to lower supply
                amount = int(supply * min(total_action, 0.2))  # Max 20% per day
                burned[day] = amount
                supply -= amount
                minted[day] = 0
            elif total_action < 0:  # Price below peg: mint to raise supply
                amount = int(daily_surplus_kwh * abs(min(total_action, 0.2)))
                minted[day] = amount
                supply += amount
                burned[day] = 0
            
            # Ensure supply doesn't go negative
            supply = max(0, supply)
            
            # Record metrics
            prices[day] = current_price
            deviations[day] = deviation
            supplies[day] = supply
            
            # Check if in band
            upper_bound = peg_target * (1 + peg_band)
            lower_bound = peg_target * (1 - peg_band)
            in_band[day] = lower_bound <= current_price <= upper_bound
        
        # Calculate results
        days_in_band_pct = 100.0 * np.sum(in_band) / self.days
        avg_price = np.mean(prices)
        std_price = np.std(prices)
        max_excursion = np.max(np.abs(deviations))
        total_mints = int(np.sum(minted))
        total_burns = int(np.sum(burned))
        final_supply = supplies[-1]
        
        # Store results
        result = SimulationResult(
            params=PIParams(p_gain, i_gain),
            days_in_band=days_in_band_pct,
            avg_price=avg_price,
            std_price=std_price,
            max_excursion=max_excursion,
            total_mints=total_mints,
            total_burns=total_burns,
            final_supply=final_supply
        )
        
        # Store time series for detailed analysis
        result.prices = prices
        result.deviations = deviations
        result.in_band_mask = in_band
        result.supplies = supplies
        result.minted_series = minted
        result.burned_series = burned
        
        return result


def tune_parameters(simulator: PIControllerSimulator, 
                   p_range: Tuple[float, float] = (0.005, 0.05),
                   i_range: Tuple[float, float] = (0.001, 0.01),
                   num_points: int = 5) -> List[SimulationResult]:
    """
    Grid search over parameter space to find optimal PI gains
    
    Returns:
        List of SimulationResult sorted by days_in_band (best first)
    """
    results = []
    
    p_values = np.linspace(p_range[0], p_range[1], num_points)
    i_values = np.linspace(i_range[0], i_range[1], num_points)
    
    total_runs = len(p_values) * len(i_values)
    run_count = 0
    
    print(f"🔄 Running {total_runs} parameter combinations...")
    print(f"   Proportional range: {p_range[0]:.4f} to {p_range[1]:.4f}")
    print(f"   Integral range: {i_range[0]:.4f} to {i_range[1]:.4f}")
    print()
    
    for p in p_values:
        for i in i_values:
            run_count += 1
            result = simulator.simulate(p_gain=p, i_gain=i)
            results.append(result)
            
            status = "✅" if result.days_in_band > 80 else "⚠️" if result.days_in_band > 50 else "❌"
            print(f"[{run_count:2d}/{total_runs}] Kp={p:.4f}, Ki={i:.4f} → "
                  f"{result.days_in_band:5.1f}% in-band {status}")
    
    # Sort by performance
    results.sort(key=lambda r: r.days_in_band, reverse=True)
    
    return results


def generate_report(results: List[SimulationResult], output_file: str = "pi_tuning_report.json"):
    """Generate comprehensive tuning report"""
    
    best_result = results[0]
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "simulation_config": {
            "days": 10000,
            "daily_surplus_kwh": 1000,
            "peg_target": 1.0,
            "peg_band": 0.05
        },
        "best_parameters": {
            "proportional_gain": float(best_result.params.proportional_gain),
            "integral_gain": float(best_result.params.integral_gain),
            "days_in_band_percent": float(best_result.days_in_band),
            "avg_price": float(best_result.avg_price),
            "std_price": float(best_result.std_price),
            "max_excursion": float(best_result.max_excursion),
            "total_mints": int(best_result.total_mints),
            "total_burns": int(best_result.total_burns),
            "final_supply": float(best_result.final_supply)
        },
        "top_5_results": []
    }
    
    for i, result in enumerate(results[:5]):
        report["top_5_results"].append({
            "rank": i + 1,
            "proportional_gain": float(result.params.proportional_gain),
            "integral_gain": float(result.params.integral_gain),
            "days_in_band": float(result.days_in_band),
            "avg_price": float(result.avg_price),
            "std_price": float(result.std_price)
        })
    
    with open(output_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    return report


def print_summary(results: List[SimulationResult]):
    """Print human-readable summary"""
    best = results[0]
    
    print("\n" + "="*70)
    print("🎯 OPTIMAL PI CONTROL PARAMETERS")
    print("="*70)
    print(f"\n✅ Best Configuration:")
    print(f"   Proportional Gain (Kp): {best.params.proportional_gain:.4f}")
    print(f"   Integral Gain (Ki):     {best.params.integral_gain:.4f}")
    print(f"\n📊 Performance Metrics:")
    print(f"   Days In-Band (±5%):     {best.days_in_band:.1f}%")
    print(f"   Average Price:          ${best.avg_price:.4f}")
    print(f"   Price Volatility:       {best.std_price:.4f} ({best.std_price/best.avg_price*100:.1f}%)")
    print(f"   Max Excursion:          {best.max_excursion*100:.1f}%")
    print(f"\n📈 Control Actions:")
    print(f"   Total Mint Events:      {best.total_mints:,} SPK")
    print(f"   Total Burn Events:      {best.total_burns:,} SPK")
    print(f"   Final Supply:           {best.final_supply:,.0f} SPK")
    print("\n" + "="*70)
    
    print("\n📋 Top 5 Parameter Sets:")
    print(f"{'Rank':<5} {'Kp':<10} {'Ki':<10} {'In-Band':<12} {'Avg Price':<12}")
    print("-" * 50)
    for i, result in enumerate(results[:5], 1):
        print(f"{i:<5} {result.params.proportional_gain:<10.4f} "
              f"{result.params.integral_gain:<10.4f} {result.days_in_band:<11.1f}% "
              f"${result.avg_price:<11.4f}")


def plot_results(best_result: SimulationResult, output_file: str = "pi_tuning_results.png"):
    """Generate visualization of best result"""
    fig, axes = plt.subplots(3, 1, figsize=(14, 10))
    fig.suptitle(f'PI Control Tuning Results (Kp={best_result.params.proportional_gain:.4f}, '
                 f'Ki={best_result.params.integral_gain:.4f})', fontsize=14, fontweight='bold')
    
    # Price tracking
    ax = axes[0]
    peg_target = 1.0
    ax.plot(best_result.prices, 'b-', linewidth=1.5, label='Market Price')
    ax.axhline(y=peg_target, color='r', linestyle='--', linewidth=2, label='Peg Target')
    ax.axhline(y=peg_target * 1.05, color='r', linestyle=':', alpha=0.5, label='Band (±5%)')
    ax.axhline(y=peg_target * 0.95, color='r', linestyle=':', alpha=0.5)
    ax.fill_between(range(len(best_result.prices)), 
                     peg_target * 0.95, peg_target * 1.05,
                     alpha=0.2, color='green', label='In-Band Region')
    ax.set_ylabel('Price (USD)', fontweight='bold')
    ax.set_title('Price Tracking Over 10,000 Days')
    ax.legend(loc='upper left')
    ax.grid(True, alpha=0.3)
    
    # Deviation
    ax = axes[1]
    ax.plot(best_result.deviations * 100, 'g-', linewidth=1, alpha=0.7)
    ax.axhline(y=5, color='r', linestyle='--', linewidth=1.5, label='Band Limit (±5%)')
    ax.axhline(y=-5, color='r', linestyle='--', linewidth=1.5)
    ax.axhline(y=0, color='k', linestyle='-', linewidth=0.5)
    ax.fill_between(range(len(best_result.deviations)), -5, 5,
                     alpha=0.2, color='green')
    ax.set_ylabel('Deviation (%)', fontweight='bold')
    ax.set_title(f'Peg Deviation (Max Excursion: {best_result.max_excursion*100:.1f}%)')
    ax.legend(loc='upper left')
    ax.grid(True, alpha=0.3)
    
    # Supply dynamics
    ax = axes[2]
    ax.plot(best_result.supplies / 1000, 'purple', linewidth=1.5, label='SPK Supply')
    ax.fill_between(range(len(best_result.supplies)), 0, 
                     best_result.supplies / 1000, alpha=0.3, color='purple')
    ax.set_ylabel('Supply (1000s SPK)', fontweight='bold')
    ax.set_xlabel('Day', fontweight='bold')
    ax.set_title('Supply Dynamics (Mint/Burn Balance)')
    ax.legend(loc='upper left')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=150, bbox_inches='tight')
    print(f"\n📈 Chart saved to: {output_file}")
    
    return fig


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Optimize PI control parameters for SolarPunkCoin"
    )
    parser.add_argument('--days', type=int, default=10000,
                       help='Simulation days (default: 10000)')
    parser.add_argument('--p-min', type=float, default=0.005,
                       help='Proportional gain minimum (default: 0.005)')
    parser.add_argument('--p-max', type=float, default=0.05,
                       help='Proportional gain maximum (default: 0.05)')
    parser.add_argument('--i-min', type=float, default=0.001,
                       help='Integral gain minimum (default: 0.001)')
    parser.add_argument('--i-max', type=float, default=0.01,
                       help='Integral gain maximum (default: 0.01)')
    parser.add_argument('--grid-points', type=int, default=5,
                       help='Grid search resolution (default: 5 = 25 combinations)')
    parser.add_argument('--seed', type=int, default=42,
                       help='Random seed for reproducibility')
    
    args = parser.parse_args()
    
    # Run tuning
    print("\n🚀 Starting PI Control Parameter Tuning")
    print(f"   Simulating {args.days:,} days per configuration")
    print(f"   Using {args.grid_points}x{args.grid_points} = {args.grid_points**2} parameter combinations")
    print()
    
    simulator = PIControllerSimulator(days=args.days, random_seed=args.seed)
    results = tune_parameters(
        simulator,
        p_range=(args.p_min, args.p_max),
        i_range=(args.i_min, args.i_max),
        num_points=args.grid_points
    )
    
    # Generate outputs
    print_summary(results)
    report = generate_report(results)
    print(f"\n📄 Report saved to: pi_tuning_report.json")
    
    plot_results(results[0])
    
    # Save results to CSV for further analysis
    df_results = pd.DataFrame([
        {
            'Proportional_Gain': r.params.proportional_gain,
            'Integral_Gain': r.params.integral_gain,
            'Days_In_Band_%': r.days_in_band,
            'Avg_Price': r.avg_price,
            'Std_Price': r.std_price,
            'Max_Excursion': r.max_excursion
        }
        for r in results
    ])
    df_results.to_csv('pi_tuning_results.csv', index=False)
    print(f"📊 CSV results saved to: pi_tuning_results.csv")
    
    # Recommendation
    best = results[0]
    print("\n" + "="*70)
    print("💡 RECOMMENDED NEXT STEPS")
    print("="*70)
    print(f"\n1. Deploy these optimal parameters to SolarPunkCoin.sol:")
    print(f"   proportionalGain = {best.params.proportional_gain:.4f}e18;")
    print(f"   integralGain = {best.params.integral_gain:.4f}e18;")
    print(f"\n2. Run testnet pilot with 30-day observation period")
    print(f"\n3. If in-band target still < 80%, run tuning with finer grid:")
    print(f"   python3 pi_tuning.py --p-min {best.params.proportional_gain*0.5:.4f} "
          f"--p-max {best.params.proportional_gain*1.5:.4f} --grid-points 10")
    print("\n" + "="*70)


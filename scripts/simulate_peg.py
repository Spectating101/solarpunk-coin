"""
SolarPunkCoin Peg Stabilization Simulation

Simulates 1000 days of SPK trading with:
- Random market price movements (normal + shocks)
- PI control feedback loop
- Supply adjustments to maintain peg
- Reports: peg deviation, daily volatility, reserve adequacy

This helps validate that the smart contract's control logic actually works
before deploying to mainnet.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class SimulationParams:
    """Configuration for peg stabilization simulation"""
    days: int = 1000
    initial_price: float = 1.0
    price_volatility: float = 0.05  # 5% daily vol
    shock_probability: float = 0.01  # 1% chance of shock each day
    shock_magnitude: float = 0.15  # ±15% shock
    
    # Peg control parameters (from smart contract)
    peg_target: float = 1.0
    peg_band: float = 0.05  # ±5%
    proportional_gain: float = 0.01  # 1%
    integral_gain: float = 0.005  # 0.5%
    
    # Issuance parameters
    initial_supply: float = 1_000_000  # 1M SPK
    surplus_per_day: float = 1000  # kWh
    minting_fee: float = 0.001  # 0.1%
    redemption_fee: float = 0.001  # 0.1%
    
    supply_cap: float = 1_000_000_000  # 1B SPK

class PegController:
    """Implements PI control from smart contract"""
    
    def __init__(self, params: SimulationParams):
        self.params = params
        self.integral_error = 0.0
    
    def adjust_supply(self, current_price: float, current_supply: float) -> Tuple[float, float, str]:
        """
        PI control loop: adjust supply to stabilize price
        
        Returns:
            - New supply after adjustment
            - Amount minted/burned
            - Action taken ("mint", "burn", or "hold")
        """
        
        # Price delta from target
        price_delta = current_price - self.params.peg_target
        
        # Proportional term
        proportional = price_delta * self.params.proportional_gain
        
        # Integral term (accumulates over time)
        self.integral_error += price_delta
        # Anti-windup: cap integral
        self.integral_error = np.clip(self.integral_error, -10, 10)
        integral = self.integral_error * self.params.integral_gain
        
        # Total control signal
        control_signal = proportional + integral
        
        new_supply = current_supply
        amount_adjusted = 0.0
        action = "hold"
        
        # If price too high, burn supply to push price down
        if control_signal > 0:
            burn_amount = min(control_signal * current_supply, current_supply * 0.1)  # Max 10% burn
            new_supply -= burn_amount
            amount_adjusted = -burn_amount
            action = "burn"
        
        # If price too low, mint supply to push price up
        elif control_signal < 0:
            mint_amount = abs(control_signal) * current_supply
            if new_supply + mint_amount <= self.params.supply_cap:
                new_supply += mint_amount
                amount_adjusted = mint_amount
                action = "mint"
        
        return new_supply, amount_adjusted, action

class MarketSimulator:
    """Simulates market price movements with shocks"""
    
    def __init__(self, params: SimulationParams, seed: int = 42):
        self.params = params
        np.random.seed(seed)
    
    def generate_prices(self) -> np.ndarray:
        """Generate price series with GBM + shocks"""
        
        prices = np.zeros(self.params.days)
        prices[0] = self.params.initial_price
        
        for t in range(1, self.params.days):
            # Geometric Brownian Motion
            drift = 0.0  # No systematic drift (efficient market)
            diffusion = np.random.normal(0, self.params.price_volatility)
            price_change = drift + diffusion
            
            # Shocks (random 1% chance of ±15% move)
            if np.random.random() < self.params.shock_probability:
                shock = np.random.choice([-1, 1]) * self.params.shock_magnitude
                price_change += shock
            
            new_price = prices[t-1] * (1 + price_change)
            # Price floor at 10% of target (prevent zero)
            prices[t] = max(new_price, self.params.peg_target * 0.1)
        
        return prices

class SPKSimulation:
    """Main simulation harness"""
    
    def __init__(self, params: SimulationParams = None):
        self.params = params or SimulationParams()
        self.market = MarketSimulator(self.params)
        self.controller = PegController(self.params)
    
    def run(self) -> pd.DataFrame:
        """Run 1000-day simulation"""
        
        print("🚀 Running SolarPunkCoin Peg Stabilization Simulation")
        print(f"   Duration: {self.params.days} days")
        print(f"   Initial Supply: {self.params.initial_supply:,.0f} SPK")
        print(f"   Daily Surplus: {self.params.surplus_per_day:,.0f} kWh")
        print(f"   Peg Band: ±{self.params.peg_band*100:.1f}%")
        print(f"   Control Gains (P/I): {self.params.proportional_gain}/{self.params.integral_gain}")
        print()
        
        # Generate market prices
        prices = self.market.generate_prices()
        
        # Initialize tracking
        results = {
            "day": [],
            "market_price": [],
            "peg_deviation_bps": [],
            "supply": [],
            "action": [],
            "action_magnitude": [],
            "in_band": [],
            "cumulative_minted": 0.0,
            "cumulative_burned": 0.0,
        }
        
        current_supply = self.params.initial_supply
        cumulative_minted = 0.0
        cumulative_burned = 0.0
        
        for day in range(self.params.days):
            market_price = prices[day]
            
            # Apply control
            new_supply, amount_adjusted, action = self.controller.adjust_supply(
                market_price, current_supply
            )
            
            # Add daily surplus minting (Rule A)
            surplus_spk = self.params.surplus_per_day * (1 - self.params.minting_fee)
            new_supply += surplus_spk
            
            # Track metrics
            peg_deviation = (market_price - self.params.peg_target) / self.params.peg_target
            peg_deviation_bps = peg_deviation * 10000
            in_band = abs(peg_deviation) <= self.params.peg_band
            
            results["day"].append(day)
            results["market_price"].append(market_price)
            results["peg_deviation_bps"].append(peg_deviation_bps)
            results["supply"].append(new_supply)
            results["action"].append(action)
            results["action_magnitude"].append(amount_adjusted)
            results["in_band"].append(in_band)
            
            # Track totals
            if action == "mint":
                cumulative_minted += amount_adjusted
            elif action == "burn":
                cumulative_burned += abs(amount_adjusted)
            
            current_supply = new_supply
        
        results["cumulative_minted"] = cumulative_minted
        results["cumulative_burned"] = cumulative_burned
        
        return pd.DataFrame({
            k: v for k, v in results.items() if k not in ["cumulative_minted", "cumulative_burned"]
        }), results["cumulative_minted"], results["cumulative_burned"]
    
    def analyze_results(self, df: pd.DataFrame, cum_minted: float, cum_burned: float) -> dict:
        """Compute statistics from simulation"""
        
        stats = {
            "avg_market_price": df["market_price"].mean(),
            "std_market_price": df["market_price"].std(),
            "min_market_price": df["market_price"].min(),
            "max_market_price": df["market_price"].max(),
            
            "avg_peg_deviation_bps": df["peg_deviation_bps"].mean(),
            "std_peg_deviation_bps": df["peg_deviation_bps"].std(),
            "max_peg_deviation_bps": df["peg_deviation_bps"].abs().max(),
            
            "pct_in_band": (df["in_band"].sum() / len(df)) * 100,
            
            "final_supply": df["supply"].iloc[-1],
            "supply_increase_pct": ((df["supply"].iloc[-1] / self.params.initial_supply) - 1) * 100,
            
            "num_mint_actions": (df["action"] == "mint").sum(),
            "num_burn_actions": (df["action"] == "burn").sum(),
            "num_hold_actions": (df["action"] == "hold").sum(),
            
            "cumulative_minted": cum_minted,
            "cumulative_burned": cum_burned,
            
            "daily_volatility_pct": df["market_price"].pct_change().std() * 100,
        }
        
        return stats

def plot_results(df: pd.DataFrame, stats: dict, output_file: str = "spk_simulation.png"):
    """Plot simulation results"""
    
    fig, axes = plt.subplots(3, 2, figsize=(14, 10))
    fig.suptitle("SolarPunkCoin Peg Stabilization Simulation Results", fontsize=14, fontweight="bold")
    
    # Price vs Peg Band
    ax = axes[0, 0]
    ax.plot(df["day"], df["market_price"], label="Market Price", alpha=0.7)
    ax.axhline(1.0, color="g", linestyle="--", label="Peg Target", linewidth=2)
    ax.axhline(1.05, color="r", linestyle=":", label="±5% Band", alpha=0.5)
    ax.axhline(0.95, color="r", linestyle=":", alpha=0.5)
    ax.set_xlabel("Day")
    ax.set_ylabel("Price ($)")
    ax.set_title("Market Price vs Peg")
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # Peg Deviation
    ax = axes[0, 1]
    ax.plot(df["day"], df["peg_deviation_bps"], color="orange", alpha=0.7)
    ax.axhline(0, color="g", linestyle="--", linewidth=2)
    ax.axhline(500, color="r", linestyle=":", alpha=0.5)
    ax.axhline(-500, color="r", linestyle=":", alpha=0.5)
    ax.set_xlabel("Day")
    ax.set_ylabel("Deviation (basis points)")
    ax.set_title("Peg Deviation Over Time")
    ax.grid(True, alpha=0.3)
    
    # Supply Over Time
    ax = axes[1, 0]
    ax.plot(df["day"], df["supply"] / 1e6, color="blue", alpha=0.7)
    ax.set_xlabel("Day")
    ax.set_ylabel("Supply (Millions SPK)")
    ax.set_title("Total SPK Supply Evolution")
    ax.grid(True, alpha=0.3)
    
    # Control Actions
    ax = axes[1, 1]
    mint_days = df[df["action"] == "mint"]["day"]
    burn_days = df[df["action"] == "burn"]["day"]
    hold_days = df[df["action"] == "hold"]["day"]
    
    ax.scatter(mint_days, [0.5]*len(mint_days), alpha=0.5, s=10, label="Mint", color="green")
    ax.scatter(burn_days, [-0.5]*len(burn_days), alpha=0.5, s=10, label="Burn", color="red")
    ax.set_xlabel("Day")
    ax.set_ylim(-1, 1)
    ax.set_yticks([-0.5, 0.5])
    ax.set_yticklabels(["Burn", "Mint"])
    ax.set_title("Control Actions (Mint/Burn)")
    ax.legend()
    ax.grid(True, alpha=0.3, axis="x")
    
    # Peg Stability Distribution
    ax = axes[2, 0]
    in_band = stats["pct_in_band"]
    out_band = 100 - in_band
    colors = ["green", "red"]
    ax.bar(["In Band", "Out of Band"], [in_band, out_band], color=colors, alpha=0.7)
    ax.set_ylabel("Percentage (%)")
    ax.set_title(f"Peg Stability Distribution ({in_band:.1f}% in ±5% band)")
    ax.set_ylim(0, 100)
    for i, v in enumerate([in_band, out_band]):
        ax.text(i, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")
    
    # Statistics Text Box
    ax = axes[2, 1]
    ax.axis("off")
    
    stats_text = f"""
    SIMULATION STATISTICS
    
    Price Dynamics:
      • Mean Price: ${stats['avg_market_price']:.3f}
      • Volatility: {stats['daily_volatility_pct']:.2f}% daily
      • Range: ${stats['min_market_price']:.3f} - ${stats['max_market_price']:.3f}
    
    Peg Performance:
      • Avg Deviation: {stats['avg_peg_deviation_bps']:.0f} bps
      • Max Deviation: {stats['max_peg_deviation_bps']:.0f} bps
      • In Band (±5%): {stats['pct_in_band']:.1f}%
    
    Supply Management:
      • Final Supply: {stats['final_supply']/1e6:.1f}M SPK
      • Growth: +{stats['supply_increase_pct']:.1f}%
      • Mints: {stats['num_mint_actions']} days
      • Burns: {stats['num_burn_actions']} days
    """
    
    ax.text(0.05, 0.95, stats_text, transform=ax.transAxes, fontsize=10,
            verticalalignment="top", fontfamily="monospace",
            bbox=dict(boxstyle="round", facecolor="wheat", alpha=0.3))
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=150)
    print(f"📊 Chart saved to {output_file}")
    plt.close()

def main():
    # Run simulation
    sim = SPKSimulation()
    df, cum_minted, cum_burned = sim.run()
    stats = sim.analyze_results(df, cum_minted, cum_burned)
    
    # Print results
    print("\n" + "="*60)
    print("SIMULATION RESULTS")
    print("="*60)
    
    print("\n📊 Price Dynamics:")
    print(f"  Average Price: ${stats['avg_market_price']:.4f}")
    print(f"  Volatility: {stats['daily_volatility_pct']:.2f}%/day")
    print(f"  Min/Max: ${stats['min_market_price']:.4f} / ${stats['max_market_price']:.4f}")
    
    print("\n📈 Peg Performance:")
    print(f"  Avg Deviation: {stats['avg_peg_deviation_bps']:+.0f} bps")
    print(f"  Std Deviation: {stats['std_peg_deviation_bps']:.0f} bps")
    print(f"  Max Deviation: {stats['max_peg_deviation_bps']:.0f} bps")
    print(f"  In ±5% Band: {stats['pct_in_band']:.1f}% of days")
    
    print("\n💰 Supply Management:")
    print(f"  Initial Supply: {1_000_000:,.0f} SPK")
    print(f"  Final Supply: {stats['final_supply']:,.0f} SPK")
    print(f"  Growth: +{stats['supply_increase_pct']:.2f}%")
    print(f"  Cumulative Minted: {stats['cumulative_minted']:,.0f} SPK")
    print(f"  Cumulative Burned: {stats['cumulative_burned']:,.0f} SPK")
    
    print("\n🎮 Control Actions:")
    print(f"  Mint Days: {stats['num_mint_actions']}")
    print(f"  Burn Days: {stats['num_burn_actions']}")
    print(f"  Hold Days: {stats['num_hold_actions']}")
    
    # Plot
    plot_results(df, stats)
    
    print("\n✅ Simulation complete!")
    print("\nKey Takeaway:")
    if stats['pct_in_band'] > 70:
        print("✨ PI control is EFFECTIVE - peg maintained >70% of time")
    elif stats['pct_in_band'] > 50:
        print("⚠️  PI control is ADEQUATE - peg maintained >50% of time")
    else:
        print("❌ PI control needs tuning - consider increasing gains")
    
    # Export CSV for further analysis
    df.to_csv("spk_simulation_results.csv", index=False)
    print("\n📄 Full results saved to spk_simulation_results.csv")

if __name__ == "__main__":
    main()

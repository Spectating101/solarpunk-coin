import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the data
df = pd.read_csv('bitcoin_complete_integrated.csv', parse_dates=['Date'])

print("=== INVESTIGATING CEIR CALCULATION ===\n")

# 1. Check the original CEIR values
print("Original CEIR statistics:")
print(f"  Min: ${df['CEIR'].min():,.0f}")
print(f"  Max: ${df['CEIR'].max():,.0f}")
print(f"  Mean: ${df['CEIR'].mean():,.0f}")

print("\nEnhanced CEIR statistics:")
print(f"  Min: ${df['CEIR_enhanced'].min():,.0f}")
print(f"  Max: ${df['CEIR_enhanced'].max():,.0f}")
print(f"  Mean: ${df['CEIR_enhanced'].mean():,.0f}")

# 2. Check the calculation components
print("\n=== CHECKING CALCULATION COMPONENTS ===")

# Energy consumption
print(f"\nEnergy_TWh_Annual range: {df['Energy_TWh_Annual'].min():.2f} - {df['Energy_TWh_Annual'].max():.2f} TWh")

# Electricity prices
print(f"\nWeighted electricity price range: ${df['weighted_elec_price'].min():.3f} - ${df['weighted_elec_price'].max():.3f}/kWh")

# Check where we have actual vs extrapolated prices
actual_price_period = (df['Date'] >= '2019-09-01') & (df['Date'] <= '2022-01-31')
print(f"\nPeriod with actual mining distribution data: {df[actual_price_period]['Date'].min()} to {df[actual_price_period]['Date'].max()}")

# 3. Recalculate CEIR properly
print("\n=== RECALCULATING CEIR PROPERLY ===")

# Method 1: Original CEIR concept (cumulative cost from baseline)
# Convert annual TWh to daily consumption
df['daily_energy_twh'] = df['Energy_TWh_Annual'] / 365

# Daily cost in millions USD
df['daily_cost_millions'] = df['daily_energy_twh'] * 1000 * df['weighted_elec_price'] * 1000

# Cumulative cost (this is the true CEIR)
df['CEIR_corrected'] = df['daily_cost_millions'].cumsum()

print(f"\nCorrected CEIR (cumulative from 2018):")
print(f"  Final value: ${df['CEIR_corrected'].iloc[-1]:,.0f}")
print(f"  Daily average cost: ${df['daily_cost_millions'].mean():,.0f}")

# 4. Alternative: Cost-to-Market-Cap Ratio
df['cost_to_mcap_ratio'] = df['CEIR_corrected'] / df['Market_Cap']

# 5. Create comparison plots
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Plot 1: Original vs Enhanced (showing the problem)
ax1 = axes[0, 0]
ax1.plot(df['Date'], df['CEIR'], label='Original CEIR', linewidth=2)
ax1.plot(df['Date'], df['CEIR_enhanced'], label='Enhanced CEIR (problematic)', alpha=0.7)
ax1.set_title('Original vs Enhanced CEIR (Note Scale Problem)')
ax1.set_ylabel('USD')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Plot 2: Corrected CEIR
ax2 = axes[0, 1]
ax2.plot(df['Date'], df['CEIR_corrected']/1e6, label='Corrected CEIR', color='green', linewidth=2)
ax2.set_title('Corrected CEIR (Cumulative Energy Cost)')
ax2.set_ylabel('Million USD')
ax2.legend()
ax2.grid(True, alpha=0.3)

# Plot 3: Daily Energy Cost
ax3 = axes[1, 0]
ax3.plot(df['Date'], df['daily_cost_millions'], label='Daily Cost', color='orange', alpha=0.7)
ax3.axvline(pd.to_datetime('2021-06-15'), color='red', linestyle='--', alpha=0.5, label='China Ban')
ax3.set_title('Daily Energy Cost (Note China Ban Impact)')
ax3.set_ylabel('Million USD/day')
ax3.legend()
ax3.grid(True, alpha=0.3)

# Plot 4: Cost as % of Market Cap
ax4 = axes[1, 1]
ax4.plot(df['Date'], df['cost_to_mcap_ratio'] * 100, label='Cost/MCap Ratio', color='purple', linewidth=2)
ax4.set_title('Cumulative Energy Cost as % of Market Cap')
ax4.set_ylabel('Percentage')
ax4.legend()
ax4.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('ceir_analysis.png', dpi=150, bbox_inches='tight')
plt.show()

# 6. Save corrected data
print("\n=== SAVING CORRECTED DATA ===")

# Add proper documentation
df['CEIR_methodology'] = 'Cumulative cost using time-varying electricity prices'

# Save
df.to_csv('bitcoin_data_ceir_corrected.csv', index=False)
print("Saved corrected data to 'bitcoin_data_ceir_corrected.csv'")

# 7. Summary for your paper
print("\n=== SUMMARY FOR YOUR PAPER ===")
print(f"""
Key findings:
1. Total cumulative energy cost (2018-2025): ${df['CEIR_corrected'].iloc[-1]/1e6:,.0f} million
2. Average daily energy cost: ${df['daily_cost_millions'].mean():,.2f} million
3. China ban impact on daily costs:
   - Pre-ban (2021-01 to 2021-06): ${df[(df['Date'] >= '2021-01-01') & (df['Date'] < '2021-06-15')]['daily_cost_millions'].mean():,.2f} million/day
   - Post-ban (2021-07 to 2021-12): ${df[(df['Date'] >= '2021-07-01') & (df['Date'] < '2022-01-01')]['daily_cost_millions'].mean():,.2f} million/day
4. Energy cost as % of market cap:
   - Current: {df['cost_to_mcap_ratio'].iloc[-1]*100:.3f}%
   - Maximum: {df['cost_to_mcap_ratio'].max()*100:.3f}%

Note: Weighted electricity prices based on actual mining distribution data from Sep 2019 to Jan 2022.
Before/after this period, estimates used based on dominant mining locations.
""")

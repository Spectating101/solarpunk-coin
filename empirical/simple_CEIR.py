"""
SIMPLE CEIR CALCULATOR - Start with basics and debug
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

print("="*80)
print("SIMPLE CEIR CALCULATION - DEBUGGING VERSION")
print("="*80)

# === STEP 1: Load Bitcoin prices ===
print("\n1. Loading Bitcoin prices...")
btc = pd.read_csv('btc_ds_parsed.csv')
print(f"   Columns: {btc.columns.tolist()}")
print(f"   Shape: {btc.shape}")

# Standardize column names
btc['Date'] = pd.to_datetime(btc['Exchange Date'])
btc['Price'] = (btc['Bid'] + btc['Ask']) / 2
btc = btc[['Date', 'Price']].sort_values('Date')
print(f"   Date range: {btc['Date'].min()} to {btc['Date'].max()}")

# === STEP 2: Load energy consumption ===
print("\n2. Loading energy consumption...")
energy = pd.read_csv('btc_con.csv')
print(f"   Columns: {energy.columns.tolist()}")
energy['Date'] = pd.to_datetime(energy['DateTime'])
energy['Energy_TWh_Annual'] = energy['Estimated TWh per Year']
energy = energy[['Date', 'Energy_TWh_Annual']]
print(f"   Date range: {energy['Date'].min()} to {energy['Date'].max()}")

# === STEP 3: Merge price and energy ===
print("\n3. Merging data...")
df = pd.merge(btc, energy, on='Date', how='inner')
print(f"   Merged shape: {df.shape}")
print(f"   Final date range: {df['Date'].min()} to {df['Date'].max()}")

# === STEP 4: Simple electricity price (use average for now) ===
print("\n4. Using simplified electricity prices...")
# Load electricity prices
elec_prices = pd.read_csv('electricity_prices_detailed_by_year.csv')
avg_price = elec_prices['Average_2018_2024'].mean()
print(f"   Using simple average electricity price: ${avg_price:.4f}/kWh")

# === STEP 5: Calculate CEIR ===
print("\n5. Calculating CEIR...")

# Daily energy in TWh
df['daily_energy_twh'] = df['Energy_TWh_Annual'] / 365.0

# Daily cost in USD
df['daily_cost_usd'] = df['daily_energy_twh'] * avg_price * 1e9

# Cumulative cost
df['cumulative_cost_usd'] = df['daily_cost_usd'].cumsum()

# Calculate market cap (simplified)
# Bitcoin supply approximation
def get_btc_supply(date):
    genesis = pd.Timestamp('2009-01-03')
    days = (date - genesis).days
    blocks = days * 144
    halvings = blocks // 210000
    
    supply = 0
    reward = 50
    for h in range(min(halvings + 1, 4)):  # Max 4 halvings
        blocks_in_epoch = min(210000, blocks - h * 210000)
        if blocks_in_epoch > 0:
            supply += blocks_in_epoch * reward
        reward /= 2
    return min(supply, 21000000)  # Cap at 21M

df['btc_supply'] = df['Date'].apply(get_btc_supply)
df['Market_Cap'] = df['Price'] * df['btc_supply']

# CEIR
df['CEIR'] = df['Market_Cap'] / df['cumulative_cost_usd']
df['log_CEIR'] = np.log(df['CEIR'])

# === STEP 6: Basic diagnostics ===
print("\n6. Basic statistics...")
print(f"   Average daily cost: ${df['daily_cost_usd'].mean():,.0f}")
print(f"   Total cumulative cost: ${df['cumulative_cost_usd'].iloc[-1]:,.0f}")
print(f"   Average CEIR: {df['CEIR'].mean():.2f}")
print(f"   CEIR range: {df['CEIR'].min():.2f} to {df['CEIR'].max():.2f}")

# === STEP 7: Save and plot ===
print("\n7. Saving results...")
df.to_csv('bitcoin_simple_ceir.csv', index=False)

# Create simple plot
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Price
axes[0,0].plot(df['Date'], df['Price'])
axes[0,0].set_title('Bitcoin Price')
axes[0,0].set_ylabel('USD')

# Energy consumption
axes[0,1].plot(df['Date'], df['Energy_TWh_Annual'])
axes[0,1].set_title('Annual Energy Consumption')
axes[0,1].set_ylabel('TWh/year')

# Daily cost
axes[1,0].plot(df['Date'], df['daily_cost_usd'])
axes[1,0].set_title('Daily Energy Cost')
axes[1,0].set_ylabel('USD')

# CEIR
axes[1,1].plot(df['Date'], df['CEIR'])
axes[1,1].set_title('CEIR')
axes[1,1].set_ylabel('Ratio')
axes[1,1].set_ylim(0, df['CEIR'].quantile(0.95))  # Limit y-axis for visibility

plt.tight_layout()
plt.savefig('simple_ceir_diagnostics.png', dpi=150)

print("\n✅ Complete! Check:")
print("   - bitcoin_simple_ceir.csv for the data")
print("   - simple_ceir_diagnostics.png for visualization")

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

def load_and_fix_data():
    """Load all data sources and merge properly"""
    
    print("=== LOADING AND FIXING DATA ===\n")
    
    # 1. Load main Bitcoin data
    print("1. Loading Bitcoin data...")
    btc_df = pd.read_csv('bitcoin_data_ceir_corrected.csv')
    btc_df['Date'] = pd.to_datetime(btc_df['Date'])
    btc_df = btc_df.sort_values('Date').reset_index(drop=True)
    print(f"   Bitcoin data: {len(btc_df)} rows, {btc_df['Date'].min()} to {btc_df['Date'].max()}")
    
    # 2. Load ETH consumption data
    print("\n2. Loading Ethereum data...")
    eth_df = pd.read_csv('eth_con.csv')
    eth_df.columns = ['DateTime', 'ETH_TWh_Annual', 'ETH_TWh_Min']
    eth_df['DateTime'] = pd.to_datetime(eth_df['DateTime'])
    eth_df = eth_df.sort_values('DateTime').reset_index(drop=True)
    print(f"   ETH consumption: {len(eth_df)} rows, {eth_df['DateTime'].min()} to {eth_df['DateTime'].max()}")
    
    # 3. Load mining distribution
    print("\n3. Loading mining distribution...")
    mining_df = pd.read_csv('cambridge_mining_distribution.csv')
    mining_df['date'] = pd.to_datetime(mining_df['date'])
    mining_df = mining_df.sort_values('date').reset_index(drop=True)
    print(f"   Mining distribution: {len(mining_df)} rows, {mining_df['date'].min()} to {mining_df['date'].max()}")
    
    # 4. Fix CEIR calculation
    print("\n4. Fixing CEIR calculation...")
    # The issue is likely that cumulative cost is in wrong units
    # Let's recalculate properly
    
    # Daily energy in TWh (not GWh)
    btc_df['daily_energy_twh_fixed'] = btc_df['Energy_TWh_Annual'] / 365
    
    # Daily cost in millions USD (assuming $0.05/kWh baseline)
    btc_df['daily_cost_millions_fixed'] = btc_df['daily_energy_twh_fixed'] * 1000 * 1000 * 0.05
    
    # Cumulative cost in millions
    btc_df['cumulative_cost_millions'] = btc_df['daily_cost_millions_fixed'].cumsum()
    
    # CEIR = Market Cap (in millions) / Cumulative Cost (in millions)
    btc_df['CEIR_fixed'] = btc_df['Market_Cap'] / (btc_df['cumulative_cost_millions'] * 1000000)
    
    print(f"   Fixed CEIR range: {btc_df['CEIR_fixed'].min():.2f} to {btc_df['CEIR_fixed'].max():.2f}")
    print(f"   Mean fixed CEIR: {btc_df['CEIR_fixed'].mean():.2f}")
    
    # 5. Merge mining distribution with Bitcoin data
    print("\n5. Merging mining distribution...")
    # Resample mining data to daily
    btc_df['YearMonth'] = btc_df['Date'].dt.to_period('M')
    mining_df['YearMonth'] = mining_df['date'].dt.to_period('M')
    
    # Merge on year-month
    merged_df = btc_df.merge(mining_df, on='YearMonth', how='left', suffixes=('', '_mining'))
    
    # Forward fill mining data (it's monthly)
    mining_cols = ['canada', 'usa', 'russia', 'kazakhstan', 'iran', 'china', 'malaysia', 'others']
    merged_df[mining_cols] = merged_df[mining_cols].fillna(method='ffill')
    
    print(f"   Merged data has China mining info: {merged_df['china'].notna().sum()} rows")
    
    # 6. Calculate location-weighted electricity cost
    print("\n6. Calculating true location-weighted costs...")
    # Load electricity prices
    elec_prices = pd.read_csv('electricity_prices_by_country.csv')
    price_dict = dict(zip(elec_prices['country'].str.lower(), elec_prices['price_usd_per_kwh']))
    
    # Calculate weighted price
    merged_df['weighted_price_calculated'] = 0
    for country in mining_cols:
        if country in price_dict:
            merged_df['weighted_price_calculated'] += merged_df[country] * price_dict[country]
        else:
            # Use average price for 'others'
            merged_df['weighted_price_calculated'] += merged_df[country] * 0.05
    
    # 7. Merge ETH data
    print("\n7. Merging Ethereum data...")
    merged_df = merged_df.merge(eth_df, left_on='Date', right_on='DateTime', how='left')
    
    # Calculate ETH/BTC energy ratio
    merged_df['ETH_BTC_ratio'] = merged_df['ETH_TWh_Annual'] / merged_df['Energy_TWh_Annual']
    
    print(f"\n=== DATA SUMMARY ===")
    print(f"Final dataset: {len(merged_df)} rows")
    print(f"Date range: {merged_df['Date'].min()} to {merged_df['Date'].max()}")
    print(f"Has China mining data: {merged_df['china'].notna().sum()} rows")
    print(f"Has ETH data: {merged_df['ETH_TWh_Annual'].notna().sum()} rows")
    
    return merged_df

def analyze_china_ban_properly(df):
    """Analyze China ban with proper data"""
    print("\n=== CHINA BAN ANALYSIS WITH MINING DATA ===")
    
    china_ban_date = pd.to_datetime('2021-06-01')
    
    # Get data with mining info
    has_mining = df[df['china'].notna()].copy()
    
    pre_ban = has_mining[has_mining['Date'] < china_ban_date]
    post_ban = has_mining[has_mining['Date'] >= china_ban_date]
    
    print(f"\nChina mining share:")
    print(f"  Pre-ban average: {pre_ban['china'].mean()*100:.1f}%")
    print(f"  Post-ban average: {post_ban['china'].mean()*100:.1f}%")
    
    print(f"\nElectricity costs:")
    print(f"  Pre-ban weighted: ${pre_ban['weighted_price_calculated'].mean():.4f}/kWh")
    print(f"  Post-ban weighted: ${post_ban['weighted_price_calculated'].mean():.4f}/kWh")
    
    # Where did mining move to?
    print(f"\nMining redistribution (percentage points):")
    for country in ['usa', 'kazakhstan', 'russia', 'canada']:
        change = (post_ban[country].mean() - pre_ban[country].mean()) * 100
        print(f"  {country.upper()}: {change:+.1f}pp")

def create_comprehensive_charts(df):
    """Create proper visualizations"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # 1. Fixed CEIR over time
    ax1 = axes[0, 0]
    ax1.plot(df['Date'], df['CEIR_fixed'], alpha=0.5, color='gray')
    ax1.plot(df['Date'], df['CEIR_fixed'].rolling(30).mean(), 'r-', linewidth=2, label='30-day MA')
    ax1.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7, label='China Ban')
    ax1.set_ylabel('CEIR (Fixed)')
    ax1.set_title('Bitcoin CEIR with Proper Units')
    ax1.legend()
    ax1.set_ylim(0, 300)  # Reasonable range
    
    # 2. China mining share
    ax2 = axes[0, 1]
    has_china = df[df['china'].notna()]
    ax2.fill_between(has_china['Date'], 0, has_china['china']*100, alpha=0.5, color='red', label='China')
    ax2.fill_between(has_china['Date'], has_china['china']*100, 
                     (has_china['china'] + has_china['usa'])*100, alpha=0.5, color='blue', label='USA')
    ax2.set_ylabel('Mining Share (%)')
    ax2.set_title('Mining Distribution Over Time')
    ax2.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7)
    ax2.legend()
    
    # 3. ETH vs BTC energy
    ax3 = axes[1, 0]
    has_eth = df[df['ETH_TWh_Annual'].notna()]
    ax3.plot(has_eth['Date'], has_eth['Energy_TWh_Annual'], label='Bitcoin', linewidth=2)
    ax3.plot(has_eth['Date'], has_eth['ETH_TWh_Annual'], label='Ethereum', linewidth=2)
    ax3.axvline(pd.to_datetime('2022-09-15'), color='green', linestyle='--', alpha=0.7, label='ETH Merge')
    ax3.set_ylabel('Annual Energy (TWh)')
    ax3.set_title('Bitcoin vs Ethereum Energy Consumption')
    ax3.legend()
    ax3.set_yscale('log')
    
    # 4. ETH/BTC ratio
    ax4 = axes[1, 1]
    ax4.plot(has_eth['Date'], has_eth['ETH_BTC_ratio']*100, 'g-', linewidth=2)
    ax4.axvline(pd.to_datetime('2022-09-15'), color='green', linestyle='--', alpha=0.7, label='ETH Merge')
    ax4.set_ylabel('ETH/BTC Energy Ratio (%)')
    ax4.set_title('Ethereum Energy as % of Bitcoin')
    ax4.legend()
    
    plt.tight_layout()
    plt.savefig('fixed_comprehensive_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    # Load and fix all data
    df = load_and_fix_data()
    
    # Save the fixed dataset
    df.to_csv('bitcoin_complete_fixed_merged.csv', index=False)
    print("\nSaved fixed dataset to: bitcoin_complete_fixed_merged.csv")
    
    # Run analyses
    analyze_china_ban_properly(df)
    create_comprehensive_charts(df)
    
    # Show ETH merge impact
    print("\n=== ETHEREUM MERGE ANALYSIS ===")
    merge_date = pd.to_datetime('2022-09-15')
    eth_data = df[df['ETH_TWh_Annual'].notna()]
    
    pre_merge = eth_data[eth_data['Date'] < merge_date]['ETH_TWh_Annual'].mean()
    post_merge = eth_data[eth_data['Date'] >= merge_date]['ETH_TWh_Annual'].mean()
    
    print(f"ETH energy consumption:")
    print(f"  Pre-merge: {pre_merge:.1f} TWh/year")
    print(f"  Post-merge: {post_merge:.1f} TWh/year")
    print(f"  Reduction: {(1 - post_merge/pre_merge)*100:.1f}%")

if __name__ == "__main__":
    main()

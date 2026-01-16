import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def build_ceir_correctly():
    """Build CEIR with proper weighted electricity calculation"""
    
    print("=== BUILDING BITCOIN CEIR (CORRECTED) ===\n")
    
    # 1. Load all data files
    btc = pd.read_csv('btc_ds_parsed.csv', thousands=',')
    btc['Date'] = pd.to_datetime(btc['Exchange Date'], format='%d-%b-%Y')
    btc = btc.sort_values('Date').reset_index(drop=True)
    btc['Price'] = btc['Open']
    
    # Approximate Bitcoin supply
    days_since_start = (btc['Date'] - btc['Date'].min()).dt.days
    btc['btc_supply'] = 21e6 - (21e6 - 17e6) * np.exp(-0.693 * days_since_start / (4 * 365))
    btc['Market_Cap'] = btc['Price'] * btc['btc_supply']
    
    # 2. Load energy data
    energy = pd.read_csv('Historical annualised electricity consumption.csv', skiprows=1)
    energy = energy.rename(columns={
        'Date and Time': 'Date',
        'annualised consumption GUESS, TWh': 'Energy_TWh_Annual'
    })
    energy['Date'] = pd.to_datetime(energy['Date'])
    
    # 3. Load mining distribution
    mining_dist = pd.read_csv('cambridge_mining_distribution.csv')
    mining_dist['Date'] = pd.to_datetime(mining_dist['date'])
    countries = [col for col in mining_dist.columns if col not in ['date', 'Date']]
    
    # 4. Load electricity prices
    elec_prices = pd.read_csv('electricity_prices_detailed_by_year.csv')
    
    # 5. Merge base data
    df = pd.merge(btc[['Date', 'Price', 'Market_Cap']], 
                  energy[['Date', 'Energy_TWh_Annual']], 
                  on='Date', how='inner')
    
    # 6. Calculate electricity prices (THE KEY PART)
    china_ban_date = pd.Timestamp('2021-06-15')
    
    # Function to calculate weighted price for a specific date
    def get_weighted_price(date):
        # Find closest mining distribution date
        mining_dates = mining_dist['Date'].values
        if date < mining_dates.min():
            # Before we have data, use first known distribution
            dist_row = mining_dist.iloc[0]
        elif date > mining_dates.max():
            # After data ends, use last known distribution  
            dist_row = mining_dist.iloc[-1]
        else:
            # Find closest date
            idx = np.argmin(np.abs(mining_dist['Date'] - date))
            dist_row = mining_dist.iloc[idx]
        
        # Calculate weighted price
        weighted_price = 0
        total_weight = 0
        year = date.year
        
        for country in countries:
            if country == 'others':
                continue
                
            weight = dist_row[country]
            if weight > 0:
                # Get electricity price for this country/year
                country_prices = elec_prices[elec_prices['Country'] == country]
                if not country_prices.empty:
                    if year == 2021:
                        if date < china_ban_date:
                            price_col = '2021_pre_ban'
                        else:
                            price_col = '2021_post_ban'
                    else:
                        price_col = str(year)
                    
                    if price_col in elec_prices.columns:
                        price = country_prices[price_col].values[0]
                        if not pd.isna(price):
                            weighted_price += weight * price
                            total_weight += weight
        
        # For 'others' or missing, use global average
        if total_weight < 0.99:
            # Calculate simple average for the year
            year_prices = []
            for _, row in elec_prices.iterrows():
                if year == 2021:
                    col = '2021_pre_ban' if date < china_ban_date else '2021_post_ban'
                else:
                    col = str(year) if str(year) in elec_prices.columns else None
                
                if col and col in row.index:
                    val = row[col]
                    if not pd.isna(val):
                        year_prices.append(val)
            
            avg_price = np.mean(year_prices) if year_prices else 0.06
            weighted_price += (1 - total_weight) * avg_price
        
        return weighted_price
    
    # Calculate weighted price for each date
    print("Calculating weighted electricity prices...")
    df['electricity_price'] = df['Date'].apply(get_weighted_price)
    
    # 7. Calculate CEIR
    print("\nCalculating CEIR...")
    
    # Daily energy in kWh
    df['daily_energy_kwh'] = df['Energy_TWh_Annual'] * 1e9 / 365
    
    # Daily cost in USD
    df['daily_cost_usd'] = df['daily_energy_kwh'] * df['electricity_price']
    
    # Cumulative cost
    df['cumulative_cost'] = df['daily_cost_usd'].cumsum()
    
    # CEIR = Market Cap / Cumulative Cost
    df['CEIR'] = df['Market_Cap'] / df['cumulative_cost']
    
    # Log CEIR (handle early period)
    df['log_CEIR'] = np.log(df['CEIR'].clip(lower=1))
    
    # 8. Add indicators
    df['post_china_ban'] = (df['Date'] >= china_ban_date).astype(int)
    
    # 9. Summary statistics
    print("\n=== SUMMARY STATISTICS ===")
    print(f"Date range: {df['Date'].min().date()} to {df['Date'].max().date()}")
    print(f"Total cumulative cost: ${df['cumulative_cost'].iloc[-1]/1e9:.2f} billion")
    
    # Check electricity price evolution
    print("\nElectricity price evolution:")
    for year in [2019, 2020, 2021, 2022, 2023, 2024]:
        year_data = df[df['Date'].dt.year == year]
        if len(year_data) > 0:
            print(f"  {year}: ${year_data['electricity_price'].mean():.4f}/kWh")
    
    # Pre/post ban
    pre_ban = df[df['Date'] < china_ban_date]
    post_ban = df[df['Date'] >= china_ban_date]
    
    print(f"\nPre-China ban:")
    print(f"  Avg electricity price: ${pre_ban['electricity_price'].mean():.4f}/kWh")
    print(f"  Daily cost: ${pre_ban['daily_cost_usd'].mean()/1e6:.2f}M")
    print(f"  CEIR mean: {pre_ban['CEIR'].mean():.2f}")
    
    print(f"\nPost-China ban:")
    print(f"  Avg electricity price: ${post_ban['electricity_price'].mean():.4f}/kWh")
    print(f"  Daily cost: ${post_ban['daily_cost_usd'].mean()/1e6:.2f}M")
    print(f"  CEIR mean: {post_ban['CEIR'].mean():.2f}")
    
    # 10. Create visualization
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # Electricity price
    ax1 = axes[0, 0]
    ax1.plot(df['Date'], df['electricity_price'], linewidth=2, color='orange')
    ax1.axvline(china_ban_date, color='red', linestyle='--', alpha=0.5, label='China Ban')
    ax1.set_title('Weighted Electricity Price')
    ax1.set_ylabel('$/kWh')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Daily cost
    ax2 = axes[0, 1]
    ax2.plot(df['Date'], df['daily_cost_usd']/1e6, linewidth=2, color='purple')
    ax2.axvline(china_ban_date, color='red', linestyle='--', alpha=0.5)
    ax2.set_title('Daily Bitcoin Network Cost')
    ax2.set_ylabel('Million USD/day')
    ax2.grid(True, alpha=0.3)
    
    # CEIR
    ax3 = axes[1, 0]
    ax3.plot(df['Date'], df['log_CEIR'], linewidth=2, color='green')
    ax3.axvline(china_ban_date, color='red', linestyle='--', alpha=0.5)
    ax3.set_title('Log(CEIR)')
    ax3.set_ylabel('log(Market Cap / Cumulative Cost)')
    ax3.grid(True, alpha=0.3)
    
    # Cumulative cost
    ax4 = axes[1, 1]
    ax4.plot(df['Date'], df['cumulative_cost']/1e9, linewidth=2, color='darkblue')
    ax4.axvline(china_ban_date, color='red', linestyle='--', alpha=0.5)
    ax4.set_title('Cumulative Energy Cost')
    ax4.set_ylabel('Billion USD')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('bitcoin_ceir_corrected.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # 11. Save data
    df.to_csv('bitcoin_ceir_final.csv', index=False)
    print(f"\nSaved to bitcoin_ceir_final.csv")
    
    return df

if __name__ == "__main__":
    df = build_ceir_correctly()

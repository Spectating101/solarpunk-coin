import pandas as pd
import numpy as np

# Load the data files
mining_dist = pd.read_csv('cambridge_mining_distribution.csv')
mining_dist['date'] = pd.to_datetime(mining_dist['date'])
elec_prices = pd.read_csv('electricity_prices_detailed_by_year.csv')

print("=== MINING DISTRIBUTION DIAGNOSTICS ===\n")

# Check China's share over time
countries = [col for col in mining_dist.columns if col != 'date']
print("1. China mining share over time:")
china_share = mining_dist[['date', 'china']].copy()
china_share = china_share.sort_values('date')
print(f"   Start (Sept 2019): {china_share.iloc[0]['china']:.1%}")
print(f"   Pre-ban (May 2021): {china_share[china_share['date'] < '2021-06-01'].iloc[-1]['china']:.1%}")
print(f"   Post-ban (July 2021): {china_share[china_share['date'] > '2021-07-01'].iloc[0]['china']:.1%}")
print(f"   End (Jan 2022): {china_share.iloc[-1]['china']:.1%}")

# Check electricity price variance
print("\n2. Electricity prices by country (2021):")
for country in ['china', 'usa', 'kazakhstan', 'russia']:
    pre_ban = elec_prices[elec_prices['Country'] == country]['2021_pre_ban'].values[0]
    post_ban = elec_prices[elec_prices['Country'] == country]['2021_post_ban'].values[0]
    print(f"   {country}: pre-ban=${pre_ban:.3f}, post-ban=${post_ban:.3f}")

# Calculate weighted price for a few key dates
print("\n3. Weighted electricity price on key dates:")
def calc_weighted_price(date_str):
    date_row = mining_dist[mining_dist['date'] == date_str]
    if date_row.empty:
        return None
    
    weighted_price = 0
    for country in countries:
        if country == 'others':
            continue
        weight = date_row[country].values[0]
        
        # Get price for that year
        year = pd.to_datetime(date_str).year
        if year == 2021:
            if pd.to_datetime(date_str) < pd.to_datetime('2021-06-15'):
                price_col = '2021_pre_ban'
            else:
                price_col = '2021_post_ban'
        else:
            price_col = str(year)
            
        price_row = elec_prices[elec_prices['Country'] == country]
        if not price_row.empty and price_col in elec_prices.columns:
            price = price_row[price_col].values[0]
            if not pd.isna(price):
                weighted_price += weight * price
                
    return weighted_price

key_dates = ['2019-09-01', '2020-06-01', '2021-05-01', '2021-07-01', '2021-12-01']
for date in key_dates:
    price = calc_weighted_price(date)
    if price:
        print(f"   {date}: ${price:.4f}/kWh")

# Check if mining distribution actually changes
print("\n4. Mining distribution variance:")
print(f"   China std dev: {mining_dist['china'].std():.3f}")
print(f"   USA std dev: {mining_dist['usa'].std():.3f}")
print(f"   Kazakhstan std dev: {mining_dist['kazakhstan'].std():.3f}")

# Show top 3 countries at different times
print("\n5. Top 3 mining countries over time:")
for date in ['2019-09-01', '2021-05-01', '2021-07-01', '2022-01-01']:
    row = mining_dist[mining_dist['date'] == date]
    if not row.empty:
        country_shares = {}
        for country in countries:
            if country != 'others':
                country_shares[country] = row[country].values[0]
        top3 = sorted(country_shares.items(), key=lambda x: x[1], reverse=True)[:3]
        print(f"   {date}: {', '.join([f'{c[0]}({c[1]:.1%})' for c in top3])}")

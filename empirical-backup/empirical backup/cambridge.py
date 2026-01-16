import pandas as pd
import numpy as np
from datetime import datetime

print("CONVERTING CAMBRIDGE MINING DISTRIBUTION DATA")
print("="*50)

# Your handwritten data converted to structured format
mining_data = [
    # Sept 2019
    {'date': '2019-09-01', 'canada': 1.09, 'usa': 4.06, 'mexico': 0.04, 'colombia': 0.03, 'peru': 0.02, 
     'brazil': 0.03, 'paraguay': 0.24, 'argentina': 0.01, 'iceland': 0.11, 'uk': 0.10, 'spain': 0.04, 
     'france': 0.13, 'germany': 0.90, 'netherlands': 0.10, 'norway': 0.95, 'switzerland': 0.04, 
     'russia': 5.93, 'ukraine': 0.3, 'libya': 1.16, 'kazakhstan': 1.42, 'iran': 1.74, 'china': 75.53, 'malaysia': 3.25},
    
    # Oct 2019
    {'date': '2019-10-01', 'usa': 5.58, 'china': 74.78, 'russia': 5.87, 'malaysia': 3.87, 'iran': 1.77},
    
    # Nov 2019
    {'date': '2019-11-01', 'china': 72.33, 'russia': 6.24, 'usa': 6.58, 'malaysia': 3.66, 'iran': 1.60},
    
    # Dec 2019
    {'date': '2019-12-01', 'china': 73.46, 'russia': 6.23, 'usa': 3.87, 'malaysia': 3.92, 'iran': 2.71},
    
    # Jan 2020
    {'date': '2020-01-01', 'china': 72.69, 'russia': 6.05, 'usa': 3.44, 'malaysia': 4.13, 'iran': 3.20},
    
    # Feb 2020
    {'date': '2020-02-01', 'china': 72.89, 'russia': 5.56, 'usa': 4.54, 'malaysia': 3.94, 'kazakhstan': 3.26},
    
    # Mar 2020
    {'date': '2020-03-01', 'usa': 7.07, 'china': 67.06, 'russia': 5.97, 'kazakhstan': 5.62, 'malaysia': 4.11},
    
    # Apr 2020
    {'date': '2020-04-01', 'usa': 7.24, 'china': 64.81, 'russia': 6.90, 'kazakhstan': 6.17, 'malaysia': 4.33},
    
    # May 2020
    {'date': '2020-05-01', 'usa': 8.22, 'china': 59.48, 'russia': 9.34, 'kazakhstan': 5.20, 'malaysia': 5.21},
    
    # Jun 2020
    {'date': '2020-06-01', 'china': 64.67, 'usa': 6.7, 'russia': 8.25, 'kazakhstan': 4.86, 'malaysia': 5.46},
    
    # Jul 2020
    {'date': '2020-07-01', 'usa': 5.09, 'china': 66.86, 'russia': 8.08, 'kazakhstan': 4.58, 'malaysia': 5.62},
    
    # Aug 2020
    {'date': '2020-08-01', 'china': 66.86, 'usa': 4.2, 'russia': 8.17, 'kazakhstan': 4.57, 'malaysia': 6.23},
    
    # Sep 2020
    {'date': '2020-09-01', 'usa': 7.08, 'china': 67.12, 'russia': 5.74, 'kazakhstan': 4.09, 'malaysia': 4.48},
    
    # Oct 2020
    {'date': '2020-10-01', 'china': 67.38, 'usa': 6.71, 'russia': 4.90, 'malaysia': 4.12, 'kazakhstan': 3.59},
    
    # Nov 2020
    {'date': '2020-11-01', 'usa': 9.38, 'russia': 6.77, 'china': 55.58, 'malaysia': 5.27, 'kazakhstan': 4.77},
    
    # Dec 2020
    {'date': '2020-12-01', 'usa': 10.41, 'china': 53.27, 'russia': 7.16, 'malaysia': 5.29, 'kazakhstan': 5.35},
    
    # Jan 2021
    {'date': '2021-01-01', 'usa': 10.55, 'russia': 6.91, 'china': 53.30, 'malaysia': 5.18, 'kazakhstan': 6.17},
    
    # Feb 2021
    {'date': '2021-02-01', 'usa': 13.37, 'russia': 6.43, 'china': 51.58, 'malaysia': 4.66, 'kazakhstan': 6.71},
    
    # Mar 2021
    {'date': '2021-03-01', 'usa': 16.12, 'russia': 6.47, 'china': 49.06, 'malaysia': 3.66, 'kazakhstan': 7.65, 'iran': 4.67},
    
    # Apr 2021
    {'date': '2021-04-01', 'usa': 16.85, 'russia': 6.84, 'china': 46.04, 'canada': 3.00, 'malaysia': 3.44, 'kazakhstan': 8.19, 'iran': 4.64},
    
    # May 2021 (CHINA BAN MONTH)
    {'date': '2021-05-01', 'usa': 17.77, 'canada': 4.74, 'russia': 7.19, 'china': 43.98, 'kazakhstan': 7.37, 'iran': 4.30, 'malaysia': 3.24},
    
    # Jun 2021 (POST-BAN)
    {'date': '2021-06-01', 'canada': 5.98, 'usa': 21.81, 'russia': 8.90, 'china': 34.25, 'kazakhstan': 8.80, 'malaysia': 3.79, 'iran': 3.43},
    
    # Jul 2021
    {'date': '2021-07-01', 'canada': 10.83, 'usa': 35.12, 'russia': 11.90, 'kazakhstan': 13.79, 'malaysia': 5.39, 'iran': 3.81},
    
    # Aug 2021
    {'date': '2021-08-01', 'canada': 9.55, 'usa': 35.40, 'russia': 11.23, 'kazakhstan': 18.10, 'malaysia': 4.59, 'iran': 3.11},
    
    # Sep 2021
    {'date': '2021-09-01', 'china': 22.29, 'canada': 6.89, 'usa': 27.69, 'russia': 6.80, 'kazakhstan': 17.72, 'malaysia': 4.72},
    
    # Oct 2021
    {'date': '2021-10-01', 'canada': 6.88, 'usa': 31.57, 'russia': 6.80, 'kazakhstan': 18.31, 'china': 18.09, 'malaysia': 3.71},
    
    # Nov 2021
    {'date': '2021-11-01', 'usa': 34.73, 'canada': 6.36, 'russia': 6.51, 'china': 18.12, 'kazakhstan': 16.08, 'malaysia': 3.55},
    
    # Dec 2021
    {'date': '2021-12-01', 'usa': 37.45, 'canada': 6.78, 'russia': 4.72, 'china': 19.14, 'kazakhstan': 14.03},
    
    # Jan 2022
    {'date': '2022-01-01', 'usa': 37.84, 'canada': 6.48, 'russia': 4.66, 'china': 21.11, 'kazakhstan': 13.22, 'malaysia': 2.51},
]

# Convert to DataFrame
df = pd.DataFrame(mining_data)
df['date'] = pd.to_datetime(df['date'])

# Convert percentages to decimals
percentage_cols = [col for col in df.columns if col != 'date']
for col in percentage_cols:
    df[col] = df[col] / 100

# Fill NaN with 0
df = df.fillna(0)

# Calculate 'others' column (everything not explicitly listed)
main_countries = ['china', 'usa', 'russia', 'kazakhstan', 'canada', 'malaysia', 'iran']
df['others'] = 1 - df[main_countries].sum(axis=1)

# Sort by date
df = df.sort_values('date')

# Save the data
df.to_csv('cambridge_mining_distribution.csv', index=False)
print(f"✓ Saved mining distribution data: {len(df)} months")
print(f"  Date range: {df['date'].min()} to {df['date'].max()}")

# Show China's decline
print("\n📊 China Mining Share Over Time:")
print(f"  Sep 2019: {df.iloc[0]['china']*100:.1f}%")
print(f"  May 2021 (ban): {df[df['date'] == '2021-05-01']['china'].iloc[0]*100:.1f}%")
print(f"  Jan 2022: {df.iloc[-1]['china']*100:.1f}%")

# Create electricity price estimates by country
electricity_prices = pd.DataFrame({
    'country': ['china', 'usa', 'russia', 'kazakhstan', 'canada', 'malaysia', 'iran', 'others'],
    'price_usd_per_kwh': [0.040, 0.065, 0.050, 0.045, 0.070, 0.055, 0.035, 0.060]
})

electricity_prices.to_csv('electricity_prices_by_country.csv', index=False)
print("\n💡 Electricity Prices by Country (USD/kWh):")
for _, row in electricity_prices.iterrows():
    print(f"  {row['country'].capitalize()}: ${row['price_usd_per_kwh']:.3f}")

# Calculate weighted average electricity price over time
weighted_prices = []
for _, row in df.iterrows():
    weighted_price = 0
    for country in main_countries + ['others']:
        if country in row and country in electricity_prices['country'].values:
            weight = row[country]
            price = electricity_prices[electricity_prices['country'] == country]['price_usd_per_kwh'].iloc[0]
            weighted_price += weight * price
    
    weighted_prices.append({
        'date': row['date'],
        'weighted_price': weighted_price,
        'china_share': row['china'],
        'usa_share': row['usa']
    })

weighted_df = pd.DataFrame(weighted_prices)
weighted_df.to_csv('weighted_electricity_prices_monthly.csv', index=False)

# Show the China ban impact
pre_ban = weighted_df[weighted_df['date'] < '2021-06-01']['weighted_price'].mean()
post_ban = weighted_df[weighted_df['date'] >= '2021-06-01']['weighted_price'].mean()

print(f"\n⚡ CHINA BAN IMPACT ON ELECTRICITY COSTS:")
print(f"  Pre-ban weighted price: ${pre_ban:.4f}/kWh")
print(f"  Post-ban weighted price: ${post_ban:.4f}/kWh")
print(f"  Increase: {(post_ban - pre_ban)/pre_ban * 100:.1f}%")

print("\n✅ Files created:")
print("  - cambridge_mining_distribution.csv")
print("  - electricity_prices_by_country.csv")
print("  - weighted_electricity_prices_monthly.csv")

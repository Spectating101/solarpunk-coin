"""
BITCOIN ENERGY ANCHORING ANALYSIS - COMPLETE DATA CLEANING PIPELINE
This script creates a single, clean dataset for the CEIR analysis
Author: [Your name]
Date: June 2025
"""

import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

print("="*80)
print("BITCOIN CEIR ANALYSIS - DATA CLEANING PIPELINE")
print("="*80)

# ============================================================================
# STEP 1: LOAD RAW DATA FILES
# ============================================================================
print("\n1. LOADING RAW DATA FILES...")

# Load Bitcoin price data
try:
    btc_price = pd.read_excel('bitcoin_datastream.xlsx')
    print(f"✓ Bitcoin price data loaded: {len(btc_price)} rows")
except:
    print("✗ Error loading bitcoin_datastream.xlsx")

# Load energy consumption data
try:
    btc_energy = pd.read_excel('btc_con.xls')
    print(f"✓ Bitcoin energy data loaded: {len(btc_energy)} rows")
except:
    print("✗ Error loading btc_con.xls")

# Load mining distribution data
try:
    mining_dist = pd.read_csv('cambridge_mining_distribution.csv')
    print(f"✓ Mining distribution loaded: {len(mining_dist)} rows")
except:
    print("✗ Error loading cambridge_mining_distribution.csv")

# Load Fear & Greed Index
try:
    fear_greed = pd.read_csv('fear_greed_index.csv')
    print(f"✓ Fear & Greed data loaded: {len(fear_greed)} rows")
except:
    print("✗ Error loading fear_greed_index.csv")

# Load Ethereum data for comparison
try:
    eth_price = pd.read_excel('ethereum_datastream.xlsx')
    eth_energy = pd.read_excel('eth_con.xls')
    print(f"✓ Ethereum data loaded")
except:
    print("✗ Error loading Ethereum data")

# ============================================================================
# STEP 2: CLEAN AND STANDARDIZE EACH DATASET
# ============================================================================
print("\n2. CLEANING INDIVIDUAL DATASETS...")

# 2.1 Bitcoin Price Data
print("\n2.1 Cleaning Bitcoin price data...")
# Assuming columns: Date, Price, Market_Cap
btc_price['Date'] = pd.to_datetime(btc_price['Date'])
btc_price = btc_price.sort_values('Date')
btc_price['Returns'] = np.log(btc_price['Price'] / btc_price['Price'].shift(1))
btc_price['volatility_30d'] = btc_price['Returns'].rolling(30).std() * np.sqrt(365) * 100
print(f"   Date range: {btc_price['Date'].min()} to {btc_price['Date'].max()}")

# 2.2 Energy Consumption Data
print("\n2.2 Cleaning energy consumption data...")
# Assuming columns: Date, TWh_Annual
btc_energy['Date'] = pd.to_datetime(btc_energy['Date'])
btc_energy = btc_energy.sort_values('Date')
btc_energy['daily_energy_twh'] = btc_energy['TWh_Annual'] / 365
print(f"   Energy range: {btc_energy['TWh_Annual'].min():.1f} - {btc_energy['TWh_Annual'].max():.1f} TWh/year")

# 2.3 Mining Distribution Data
print("\n2.3 Cleaning mining distribution data...")
mining_dist['date'] = pd.to_datetime(mining_dist['date'])
mining_dist = mining_dist.sort_values('date')

# Ensure shares sum to 1
country_cols = ['canada', 'usa', 'russia', 'kazakhstan', 'iran', 'china', 'malaysia', 'others']
for col in country_cols:
    if col not in mining_dist.columns:
        mining_dist[col] = 0

row_sums = mining_dist[country_cols].sum(axis=1)
for col in country_cols:
    mining_dist[col] = mining_dist[col] / row_sums

print(f"   Mining data range: {mining_dist['date'].min()} to {mining_dist['date'].max()}")

# 2.4 Fear & Greed Index
print("\n2.4 Cleaning Fear & Greed data...")
fear_greed['Date'] = pd.to_datetime(fear_greed['Date'])
fear_greed = fear_greed.sort_values('Date')

# ============================================================================
# STEP 3: HANDLE MISSING MINING DISTRIBUTION DATA
# ============================================================================
print("\n3. HANDLING MISSING MINING DISTRIBUTION DATA...")

# Create daily date range
date_range = pd.date_range(start='2018-01-01', end='2025-04-30', freq='D')
daily_mining = pd.DataFrame({'date': date_range})

# Merge with existing mining data
daily_mining = daily_mining.merge(mining_dist, on='date', how='left')

# Forward fill missing data
print("   Filling missing mining distribution data...")
for col in country_cols:
    daily_mining[col] = daily_mining[col].fillna(method='ffill')

# Handle pre-2019 data (use first available distribution)
first_valid_idx = daily_mining[country_cols].first_valid_index()
for col in country_cols:
    daily_mining[col] = daily_mining[col].fillna(daily_mining[col].iloc[first_valid_idx])

# Post-China ban adjustment (after June 21, 2021)
china_ban_date = pd.to_datetime('2021-06-21')
post_ban_mask = daily_mining['date'] > china_ban_date

# Redistribute China's share post-ban
if post_ban_mask.any():
    print("   Adjusting for China ban...")
    # Reduce China share to 34.2% underground mining
    pre_ban_china = daily_mining.loc[~post_ban_mask, 'china'].mean()
    daily_mining.loc[post_ban_mask, 'china'] = 0.342
    
    # Redistribute the difference to other countries proportionally
    china_reduction = pre_ban_china - 0.342
    other_countries = [c for c in country_cols if c != 'china']
    
    for col in other_countries:
        if daily_mining.loc[post_ban_mask, col].mean() > 0:
            daily_mining.loc[post_ban_mask, col] *= (1 + china_reduction)

# ============================================================================
# STEP 4: CALCULATE ELECTRICITY PRICES
# ============================================================================
print("\n4. CALCULATING WEIGHTED ELECTRICITY PRICES...")

# Based on the research document ($/kWh)
electricity_prices = {
    'china': 0.088,
    'usa': 0.147,
    'russia': 0.090,
    'kazakhstan': 0.074,
    'canada': 0.107,
    'malaysia': 0.134,
    'iran': 0.040,  # Using lower estimate for subsidized rate
    'others': 0.120  # Conservative estimate for other countries
}

# Calculate weighted electricity price
daily_mining['weighted_elec_price'] = 0
for country, price in electricity_prices.items():
    if country in daily_mining.columns:
        daily_mining['weighted_elec_price'] += daily_mining[country] * price

print(f"   Weighted electricity price range: ${daily_mining['weighted_elec_price'].min():.3f} - ${daily_mining['weighted_elec_price'].max():.3f}/kWh")

# ============================================================================
# STEP 5: MERGE ALL DATA
# ============================================================================
print("\n5. MERGING ALL DATASETS...")

# Start with Bitcoin price data
df = btc_price[['Date', 'Price', 'Market_Cap', 'Returns', 'volatility_30d']].copy()

# Merge energy data
df = df.merge(btc_energy[['Date', 'TWh_Annual', 'daily_energy_twh']], on='Date', how='left')

# Merge mining distribution and electricity prices
daily_mining.rename(columns={'date': 'Date'}, inplace=True)
df = df.merge(daily_mining, on='Date', how='left')

# Merge Fear & Greed
df = df.merge(fear_greed[['Date', 'fear_greed']], on='Date', how='left')

print(f"   Merged dataset: {len(df)} rows, {len(df.columns)} columns")

# ============================================================================
# STEP 6: CALCULATE CEIR (THE ONE TRUE CEIR)
# ============================================================================
print("\n6. CALCULATING CEIR...")

# Calculate daily energy cost in USD
df['daily_cost_usd'] = df['daily_energy_twh'] * df['weighted_elec_price'] * 1e9

# Calculate cumulative energy cost
df['cumulative_cost_usd'] = df['daily_cost_usd'].cumsum()

# Calculate CEIR
df['CEIR'] = df['Market_Cap'] / df['cumulative_cost_usd']
df['log_CEIR'] = np.log(df['CEIR'])

print(f"   CEIR range: {df['CEIR'].min():.2f} - {df['CEIR'].max():.2f}")
print(f"   Log CEIR mean: {df['log_CEIR'].mean():.2f}, std: {df['log_CEIR'].std():.2f}")

# ============================================================================
# STEP 7: ADD CONCENTRATION METRICS
# ============================================================================
print("\n7. CALCULATING CONCENTRATION METRICS...")

# Geographic HHI
df['geographic_hhi'] = 0
for col in country_cols:
    df['geographic_hhi'] += df[col]**2

# China vs Rest
df['china_vs_rest'] = df['china'] / (1 - df['china'])

# Top 3 concentration
df['top3_concentration'] = df[country_cols].apply(lambda x: x.nlargest(3).sum(), axis=1)

# Cheap electricity share (countries with <$0.08/kWh)
cheap_countries = [c for c, p in electricity_prices.items() if p < 0.08]
df['cheap_elec_share'] = df[cheap_countries].sum(axis=1)

# ============================================================================
# STEP 8: ADD FORWARD RETURNS AND INDICATORS
# ============================================================================
print("\n8. CALCULATING FORWARD RETURNS AND INDICATORS...")

# Forward returns
for days in [14, 30, 60, 90]:
    df[f'returns_{days}d_forward'] = df['Returns'].shift(-days).rolling(days).mean()

# China ban indicator
df['post_china_ban'] = (df['Date'] > china_ban_date).astype(int)

# High China exposure indicator (>60%)
df['high_china_exposure'] = (df['china'] > 0.60).astype(int)

# Interaction term for DiD
df['did_interaction'] = df['post_china_ban'] * df['high_china_exposure']

# ============================================================================
# STEP 9: ETHEREUM COMPARISON DATA
# ============================================================================
print("\n9. PROCESSING ETHEREUM DATA...")

try:
    eth_price['Date'] = pd.to_datetime(eth_price['Date'])
    eth_energy['Date'] = pd.to_datetime(eth_energy['Date'])
    
    eth_df = eth_price[['Date', 'Price']].copy()
    eth_df.rename(columns={'Price': 'ETH_Price'}, inplace=True)
    
    eth_df = eth_df.merge(eth_energy[['Date', 'TWh_Annual']], on='Date', how='left')
    eth_df.rename(columns={'TWh_Annual': 'ETH_TWh_Annual'}, inplace=True)
    
    # Merge with main dataframe
    df = df.merge(eth_df, on='Date', how='left')
    
    # Calculate ETH/BTC energy ratio
    df['ETH_BTC_energy_ratio'] = df['ETH_TWh_Annual'] / df['TWh_Annual']
    
    # Mark Ethereum merge date
    eth_merge_date = pd.to_datetime('2022-09-15')
    df['post_eth_merge'] = (df['Date'] > eth_merge_date).astype(int)
    
except:
    print("   Warning: Could not process Ethereum data")

# ============================================================================
# STEP 10: FINAL CLEANING AND QUALITY CHECKS
# ============================================================================
print("\n10. FINAL QUALITY CHECKS...")

# Remove any rows with missing critical data
critical_cols = ['Price', 'Market_Cap', 'daily_energy_twh', 'weighted_elec_price', 'CEIR']
before = len(df)
df = df.dropna(subset=critical_cols)
after = len(df)
print(f"   Dropped {before - after} rows with missing critical data")

# Check for anomalies
print("\n   Anomaly checks:")
print(f"   - Negative prices: {(df['Price'] < 0).sum()}")
print(f"   - Negative CEIR: {(df['CEIR'] < 0).sum()}")
print(f"   - Extreme CEIR (>10000): {(df['CEIR'] > 10000).sum()}")
print(f"   - Days where cumulative cost decreased: {(df['cumulative_cost_usd'].diff() < 0).sum()}")

# Sort by date
df = df.sort_values('Date').reset_index(drop=True)

# ============================================================================
# STEP 11: SAVE CLEAN DATASET
# ============================================================================
print("\n11. SAVING CLEAN DATASET...")

# Select final columns in logical order
final_columns = [
    # Identifiers
    'Date',
    
    # Bitcoin metrics
    'Price', 'Returns', 'Market_Cap', 'volatility_30d',
    'returns_14d_forward', 'returns_30d_forward', 'returns_60d_forward', 'returns_90d_forward',
    
    # Energy metrics
    'TWh_Annual', 'daily_energy_twh', 'weighted_elec_price', 
    'daily_cost_usd', 'cumulative_cost_usd',
    
    # CEIR
    'CEIR', 'log_CEIR',
    
    # Mining distribution
    'china', 'usa', 'kazakhstan', 'russia', 'canada', 'malaysia', 'iran', 'others',
    
    # Concentration metrics
    'geographic_hhi', 'china_vs_rest', 'top3_concentration', 'cheap_elec_share',
    
    # Indicators
    'post_china_ban', 'high_china_exposure', 'did_interaction',
    
    # Sentiment
    'fear_greed',
    
    # Ethereum comparison (if available)
    'ETH_Price', 'ETH_TWh_Annual', 'ETH_BTC_energy_ratio', 'post_eth_merge'
]

# Keep only columns that exist
final_columns = [col for col in final_columns if col in df.columns]
df_final = df[final_columns].copy()

# Save to CSV
df_final.to_csv('bitcoin_ceir_analysis_CLEAN.csv', index=False)
print(f"\n✓ Clean dataset saved: bitcoin_ceir_analysis_CLEAN.csv")
print(f"  Shape: {df_final.shape}")
print(f"  Date range: {df_final['Date'].min()} to {df_final['Date'].max()}")

# ============================================================================
# STEP 12: CREATE SUMMARY STATISTICS
# ============================================================================
print("\n12. SUMMARY STATISTICS...")

# Split by regime
pre_ban = df_final[df_final['Date'] < china_ban_date]
post_ban = df_final[df_final['Date'] >= china_ban_date]

print("\n=== PRE-CHINA BAN STATISTICS ===")
print(f"Period: {pre_ban['Date'].min()} to {pre_ban['Date'].max()}")
print(f"CEIR: mean={pre_ban['CEIR'].mean():.2f}, std={pre_ban['CEIR'].std():.2f}")
print(f"China share: mean={pre_ban['china'].mean():.1%}")
print(f"Geographic HHI: mean={pre_ban['geographic_hhi'].mean():.3f}")
print(f"Weighted elec price: mean=${pre_ban['weighted_elec_price'].mean():.3f}/kWh")

print("\n=== POST-CHINA BAN STATISTICS ===")
print(f"Period: {post_ban['Date'].min()} to {post_ban['Date'].max()}")
print(f"CEIR: mean={post_ban['CEIR'].mean():.2f}, std={post_ban['CEIR'].std():.2f}")
print(f"China share: mean={post_ban['china'].mean():.1%}")
print(f"Geographic HHI: mean={post_ban['geographic_hhi'].mean():.3f}")
print(f"Weighted elec price: mean=${post_ban['weighted_elec_price'].mean():.3f}/kWh")

# Save summary statistics
summary = pd.DataFrame({
    'Metric': ['N_observations', 'CEIR_mean', 'CEIR_std', 'China_share', 'Geographic_HHI', 'Elec_price_mean'],
    'Pre_China_Ban': [
        len(pre_ban),
        pre_ban['CEIR'].mean(),
        pre_ban['CEIR'].std(),
        pre_ban['china'].mean(),
        pre_ban['geographic_hhi'].mean(),
        pre_ban['weighted_elec_price'].mean()
    ],
    'Post_China_Ban': [
        len(post_ban),
        post_ban['CEIR'].mean(),
        post_ban['CEIR'].std(),
        post_ban['china'].mean(),
        post_ban['geographic_hhi'].mean(),
        post_ban['weighted_elec_price'].mean()
    ]
})

summary.to_csv('ceir_summary_statistics.csv', index=False)
print("\n✓ Summary statistics saved: ceir_summary_statistics.csv")

print("\n" + "="*80)
print("DATA CLEANING COMPLETE!")
print("="*80)

# ============================================================================
# VERIFICATION SCRIPT
# ============================================================================
print("\n\nRUNNING VERIFICATION CHECKS...")

def verify_ceir_calculation(df):
    """Verify CEIR calculation is correct"""
    print("\n=== CEIR CALCULATION VERIFICATION ===")
    
    # Recalculate CEIR from scratch
    verify_daily_cost = df['daily_energy_twh'] * df['weighted_elec_price'] * 1e9
    verify_cum_cost = verify_daily_cost.cumsum()
    verify_ceir = df['Market_Cap'] / verify_cum_cost
    
    # Check if calculations match
    cost_match = np.allclose(df['daily_cost_usd'], verify_daily_cost, rtol=1e-5)
    cum_match = np.allclose(df['cumulative_cost_usd'], verify_cum_cost, rtol=1e-5)
    ceir_match = np.allclose(df['CEIR'], verify_ceir, rtol=1e-5)
    
    print(f"Daily cost calculation matches: {cost_match}")
    print(f"Cumulative cost calculation matches: {cum_match}")
    print(f"CEIR calculation matches: {ceir_match}")
    
    if not all([cost_match, cum_match, ceir_match]):
        print("WARNING: Calculations don't match! Investigating...")
        diff_mask = ~np.isclose(df['CEIR'], verify_ceir, rtol=1e-5)
        print(f"Number of mismatches: {diff_mask.sum()}")
        if diff_mask.sum() > 0:
            print("First mismatch:")
            idx = np.where(diff_mask)[0][0]
            print(f"  Date: {df.iloc[idx]['Date']}")
            print(f"  Calculated CEIR: {df.iloc[idx]['CEIR']}")
            print(f"  Verified CEIR: {verify_ceir.iloc[idx]}")

verify_ceir_calculation(df_final)

print("\n✓ All done! Your clean dataset is ready for analysis.")

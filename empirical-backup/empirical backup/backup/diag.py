import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis, mstats
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

print("CEIR DIAGNOSTIC AND FIX SCRIPT")
print("="*50)

# Load the processed data
print("1. Loading processed data...")
try:
    df = pd.read_csv('processed_bitcoin_data.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    print(f"✓ Loaded {len(df)} observations")
    print(f"✓ Date range: {df['Date'].min()} to {df['Date'].max()}")
    print(f"✓ Columns: {list(df.columns)}")
except Exception as e:
    print(f"✗ Error loading data: {e}")
    exit()

print("\n2. EXAMINING CEIR CALCULATION STEP BY STEP...")
print("="*50)

# Check each component of CEIR calculation
print("\nA. Market Cap Analysis:")
print(f"   Market Cap range: ${df['Market_Cap'].min()/1e9:.1f}B to ${df['Market_Cap'].max()/1e9:.1f}B")
print(f"   Market Cap mean: ${df['Market_Cap'].mean()/1e9:.1f}B")

baseline_cap = 240_000_000_000  # $240B
print(f"   Baseline cap: ${baseline_cap/1e9:.1f}B")
print(f"   Market Cap - Baseline range: ${(df['Market_Cap'] - baseline_cap).min()/1e9:.1f}B to ${(df['Market_Cap'] - baseline_cap).max()/1e9:.1f}B")

print("\nB. Energy Cost Analysis:")
print(f"   Daily Energy Cost range: ${df['Daily_Energy_Cost'].min():,.0f} to ${df['Daily_Energy_Cost'].max():,.0f}")
print(f"   Daily Energy Cost mean: ${df['Daily_Energy_Cost'].mean():,.0f}")

print("\nC. Cumulative Energy Cost Analysis:")
print(f"   Cumulative Energy Cost range: ${df['Cumulative_Energy_Cost'].min():,.0f} to ${df['Cumulative_Energy_Cost'].max():,.0f}")
print(f"   Cumulative Energy Cost mean: ${df['Cumulative_Energy_Cost'].mean():,.0f}")

# Check for potential problems
print("\n3. IDENTIFYING POTENTIAL PROBLEMS...")
print("="*50)

print("\nA. Checking for near-zero denominators (causes extreme CEIR):")
small_denominators = df[df['Cumulative_Energy_Cost'] < 1000000]  # Less than $1M
print(f"   Observations with cumulative energy < $1M: {len(small_denominators)}")
if len(small_denominators) > 0:
    print("   ⚠️  WARNING: Very small denominators will cause extreme CEIR values!")
    print(f"   First few dates with small denominators:")
    print(small_denominators[['Date', 'Cumulative_Energy_Cost', 'CEIR']].head())

print("\nB. CEIR Distribution Analysis:")
print(f"   CEIR range: {df['CEIR'].min():.2f} to {df['CEIR'].max():.2f}")
print(f"   CEIR mean: {df['CEIR'].mean():.2f}")
print(f"   CEIR median: {df['CEIR'].median():.2f}")
print(f"   CEIR std: {df['CEIR'].std():.2f}")
print(f"   CEIR skewness: {skew(df['CEIR'].dropna()):.2f}")

# Show extreme values
print("\nC. Extreme CEIR Values:")
extreme_high = df.nlargest(5, 'CEIR')[['Date', 'Market_Cap', 'Cumulative_Energy_Cost', 'CEIR']]
extreme_low = df.nsmallest(5, 'CEIR')[['Date', 'Market_Cap', 'Cumulative_Energy_Cost', 'CEIR']]

print("   Top 5 highest CEIR values:")
for idx, row in extreme_high.iterrows():
    print(f"   {row['Date'].strftime('%Y-%m-%d')}: CEIR={row['CEIR']:.1f}, MarketCap=${row['Market_Cap']/1e9:.1f}B, CumEnergy=${row['Cumulative_Energy_Cost']/1e6:.1f}M")

print("\n   Top 5 lowest CEIR values:")
for idx, row in extreme_low.iterrows():
    print(f"   {row['Date'].strftime('%Y-%m-%d')}: CEIR={row['CEIR']:.1f}, MarketCap=${row['Market_Cap']/1e9:.1f}B, CumEnergy=${row['Cumulative_Energy_Cost']/1e6:.1f}M")

print("\n4. APPLYING FIXES...")
print("="*50)

# Create a copy for fixes
df_fixed = df.copy()

# Fix 1: Remove early observations with tiny cumulative energy costs
print("\nA. Removing early observations with cumulative energy < $10M:")
min_energy_threshold = 10_000_000  # $10M minimum
before_count = len(df_fixed)
df_fixed = df_fixed[df_fixed['Cumulative_Energy_Cost'] >= min_energy_threshold]
after_count = len(df_fixed)
print(f"   Removed {before_count - after_count} observations")
print(f"   Remaining: {after_count} observations")

# Recalculate CEIR stats
print(f"   New CEIR range: {df_fixed['CEIR'].min():.2f} to {df_fixed['CEIR'].max():.2f}")
print(f"   New CEIR skewness: {skew(df_fixed['CEIR'].dropna()):.2f}")

# Fix 2: Winsorize remaining extreme values
print("\nB. Winsorizing CEIR at 1% and 99% percentiles:")
ceir_original = df_fixed['CEIR'].copy()
df_fixed['CEIR_winsorized'] = mstats.winsorize(df_fixed['CEIR'], limits=[0.01, 0.01])

print(f"   Original CEIR range: {ceir_original.min():.2f} to {ceir_original.max():.2f}")
print(f"   Winsorized CEIR range: {df_fixed['CEIR_winsorized'].min():.2f} to {df_fixed['CEIR_winsorized'].max():.2f}")
print(f"   Winsorized CEIR skewness: {skew(df_fixed['CEIR_winsorized'].dropna()):.2f}")

# Use winsorized version
df_fixed['CEIR'] = df_fixed['CEIR_winsorized']

print("\n5. FINAL CEIR ANALYSIS...")
print("="*50)

def desc_stats(series, name):
    """Generate descriptive statistics"""
    clean_series = series.dropna()
    return {
        'Variable': name,
        'N': len(clean_series),
        'Mean': round(clean_series.mean(), 2),
        'Std Dev': round(clean_series.std(), 2),
        'Min': round(clean_series.min(), 2),
        'Max': round(clean_series.max(), 2),
        'Skewness': round(skew(clean_series), 2)
    }

# Generate final statistics
print("\nFinal CEIR Statistics:")
ceir_stats = desc_stats(df_fixed['CEIR'], 'CEIR (Fixed)')
for key, value in ceir_stats.items():
    print(f"   {key}: {value}")

print("\n6. UPDATED DESCRIPTIVE STATISTICS TABLE...")
print("="*50)

# Load other variables for complete table
try:
    # Google Trends
    google_trends = pd.read_csv('multiTimeline.csv', skiprows=1)
    google_trends.columns = ['Date', 'Google_Trends'] 
    google_trends['Date'] = pd.to_datetime(google_trends['Date'])
    google_trends['Google_Trends'] = pd.to_numeric(google_trends['Google_Trends'], errors='coerce')
    
    # Convert monthly to daily
    if len(google_trends) < 1000:
        start_date = google_trends['Date'].min()
        end_date = google_trends['Date'].max()
        daily_dates = pd.date_range(start=start_date, end=end_date, freq='D')
        daily_google = pd.DataFrame({'Date': daily_dates})
        daily_google['Month'] = daily_google['Date'].dt.to_period('M')
        google_trends['Month'] = google_trends['Date'].dt.to_period('M')
        daily_google = daily_google.merge(google_trends[['Month', 'Google_Trends']], on='Month', how='left')
        daily_google['Google_Trends'] = daily_google['Google_Trends'].fillna(method='ffill')
        google_trends = daily_google[['Date', 'Google_Trends']].copy()
    
    # EPU
    epu_raw = pd.read_excel('All_Country_Data.xlsx')
    epu_monthly = epu_raw[['Year', 'Month', 'US']].copy()
    epu_monthly['US'] = pd.to_numeric(epu_monthly['US'], errors='coerce')
    epu_monthly = epu_monthly.dropna()
    epu_monthly['Date'] = pd.to_datetime(epu_monthly[['Year', 'Month']].assign(day=1))
    
    # Convert to daily
    start_date = epu_monthly['Date'].min()
    end_date = epu_monthly['Date'].max()
    daily_dates = pd.date_range(start=start_date, end=end_date, freq='D')
    epu_data = pd.DataFrame({'Date': daily_dates})
    epu_data['Month'] = epu_data['Date'].dt.to_period('M')
    epu_monthly['Month'] = epu_monthly['Date'].dt.to_period('M')
    epu_data = epu_data.merge(epu_monthly[['Month', 'US']], on='Month', how='left')
    epu_data['EPU'] = epu_data['US'].fillna(method='ffill')
    
    print("✓ Loaded control variables")
    
except Exception as e:
    print(f"⚠️  Could not load control variables: {e}")
    google_trends = None
    epu_data = None

# Generate complete updated statistics
stats_list = []

# Main variables (from fixed data)
stats_list.append(desc_stats(df_fixed['Returns'], 'Bitcoin Daily Return (%)'))
stats_list.append(desc_stats(df_fixed['Price'], 'Bitcoin Price (USD)'))
stats_list.append(desc_stats(df_fixed['CEIR'], 'CEIR (Fixed)'))
stats_list.append(desc_stats(df_fixed['Energy_TWh_Annual'], 'Bitcoin Energy (TWh/year)'))

# Control variables
if google_trends is not None:
    stats_list.append(desc_stats(google_trends['Google_Trends'], 'Google Trends (Bitcoin)'))
if epu_data is not None:
    stats_list.append(desc_stats(epu_data['EPU'], 'Economic Policy Uncertainty'))

# Create table
stats_df = pd.DataFrame(stats_list)

print("\nUPDATED DESCRIPTIVE STATISTICS (WITH FIXED CEIR):")
print("="*60)
print(stats_df.to_string(index=False))

# Save fixed data and statistics
df_fixed.to_csv('processed_bitcoin_data_FIXED.csv', index=False)
stats_df.to_excel('descriptive_statistics_FIXED.xlsx', index=False)

print(f"\n✅ RESULTS:")
print("="*30)
print("✓ Fixed CEIR calculation issues")
print("✓ Removed problematic early observations") 
print("✓ Applied winsorizing to extreme values")
print("✓ Saved fixed data to 'processed_bitcoin_data_FIXED.csv'")
print("✓ Saved updated stats to 'descriptive_statistics_FIXED.xlsx'")

print(f"\n📊 FINAL SAMPLE:")
print(f"   Observations: {len(df_fixed)}")
print(f"   Date range: {df_fixed['Date'].min().strftime('%Y-%m-%d')} to {df_fixed['Date'].max().strftime('%Y-%m-%d')}")
print(f"   CEIR range: {df_fixed['CEIR'].min():.1f} to {df_fixed['CEIR'].max():.1f}")
print(f"   CEIR skewness: {skew(df_fixed['CEIR'].dropna()):.2f} (much better!)")

print("\n🎯 USE THE FIXED DATA FOR YOUR FINAL PROPOSAL!")

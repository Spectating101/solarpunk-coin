import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis, mstats
import warnings
warnings.filterwarnings('ignore')

print("ROBUST BITCOIN ENERGY COST ANALYSIS WITH FULL VALIDATION")
print("="*70)

# Set analysis period
ANALYSIS_START = pd.to_datetime('2018-01-01')
ANALYSIS_END = pd.to_datetime('2024-12-31')
print(f"Target Analysis Period: {ANALYSIS_START.strftime('%Y-%m-%d')} to {ANALYSIS_END.strftime('%Y-%m-%d')}")

def validate_dataframe(df, name, required_columns=None, min_rows=100):
    """Comprehensive dataframe validation"""
    print(f"\n📊 VALIDATING {name.upper()}:")
    print(f"   Shape: {df.shape}")
    
    if df.empty:
        print(f"   ❌ ERROR: {name} is empty!")
        return False
    
    if len(df) < min_rows:
        print(f"   ⚠️  WARNING: {name} has only {len(df)} rows (expected >{min_rows})")
    
    print(f"   Columns: {list(df.columns)}")
    
    # Check for required columns
    if required_columns:
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            print(f"   ❌ MISSING COLUMNS: {missing_cols}")
            return False
    
    # Check data types
    print(f"   Data types:")
    for col in df.columns:
        non_null_count = df[col].count()
        null_count = len(df) - non_null_count
        print(f"     {col}: {df[col].dtype} ({non_null_count} non-null, {null_count} null)")
    
    print(f"   ✅ {name} validation passed")
    return True

def clean_date_column(df, date_col, name):
    """Clean and validate date columns"""
    print(f"\n📅 CLEANING DATES FOR {name.upper()}:")
    
    original_count = len(df)
    
    # Convert to datetime
    try:
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
        print(f"   ✅ Date conversion successful")
    except Exception as e:
        print(f"   ❌ Date conversion failed: {e}")
        return df
    
    # Remove rows with invalid dates
    df = df.dropna(subset=[date_col])
    invalid_dates = original_count - len(df)
    if invalid_dates > 0:
        print(f"   ⚠️  Removed {invalid_dates} rows with invalid dates")
    
    # Sort by date (ascending)
    df = df.sort_values(date_col).reset_index(drop=True)
    
    # Check date range
    min_date = df[date_col].min()
    max_date = df[date_col].max()
    print(f"   Date range: {min_date.strftime('%Y-%m-%d')} to {max_date.strftime('%Y-%m-%d')}")
    
    # Filter to analysis period
    before_filter = len(df)
    df = df[(df[date_col] >= ANALYSIS_START) & (df[date_col] <= ANALYSIS_END)]
    after_filter = len(df)
    filtered_out = before_filter - after_filter
    
    if filtered_out > 0:
        print(f"   📅 Filtered to analysis period: removed {filtered_out} rows outside {ANALYSIS_START.strftime('%Y-%m-%d')} to {ANALYSIS_END.strftime('%Y-%m-%d')}")
    
    print(f"   ✅ Final {name} date range: {df[date_col].min().strftime('%Y-%m-%d')} to {df[date_col].max().strftime('%Y-%m-%d')} ({len(df)} rows)")
    
    return df

# 1. LOAD AND VALIDATE BITCOIN PRICE DATA
print("\n1. LOADING BITCOIN PRICE DATA")
print("="*50)

try:
    btc_prices_raw = pd.read_excel('btc_ds_parsed.xlsx')
    print(f"✅ Loaded btc_ds_parsed.xlsx: {btc_prices_raw.shape}")
    
    if not validate_dataframe(btc_prices_raw, "Bitcoin Prices", ['Exchange Date', 'Bid'], 1000):
        raise ValueError("Bitcoin price validation failed")
    
    # Clean and process
    btc_prices = btc_prices_raw[['Exchange Date', 'Bid']].copy()
    btc_prices.columns = ['Date', 'Price']
    btc_prices['Price'] = pd.to_numeric(btc_prices['Price'], errors='coerce')
    
    # Remove invalid prices
    original_count = len(btc_prices)
    btc_prices = btc_prices.dropna(subset=['Price'])
    invalid_prices = original_count - len(btc_prices)
    if invalid_prices > 0:
        print(f"   ⚠️  Removed {invalid_prices} rows with invalid prices")
    
    # Clean dates
    btc_prices = clean_date_column(btc_prices, 'Date', 'Bitcoin Prices')
    
    # Calculate returns
    btc_prices['Returns'] = btc_prices['Price'].pct_change() * 100
    
    print(f"   💰 Price range: ${btc_prices['Price'].min():.2f} to ${btc_prices['Price'].max():.2f}")
    print(f"   📈 Returns range: {btc_prices['Returns'].min():.2f}% to {btc_prices['Returns'].max():.2f}%")
    
except Exception as e:
    print(f"❌ FAILED to load Bitcoin prices: {e}")
    btc_prices = None

# 2. LOAD AND VALIDATE BITCOIN ENERGY DATA
print("\n2. LOADING BITCOIN ENERGY DATA")
print("="*50)

try:
    btc_energy_raw = pd.read_csv('btc_con.csv')
    print(f"✅ Loaded btc_con.csv: {btc_energy_raw.shape}")
    
    if not validate_dataframe(btc_energy_raw, "Bitcoin Energy", ['DateTime'], 1000):
        raise ValueError("Bitcoin energy validation failed")
    
    # Check energy columns
    estimated_col = 'Estimated TWh per Year'
    minimum_col = 'Minimum TWh per Year'
    
    print(f"\n🔍 CHECKING ENERGY COLUMNS:")
    
    if estimated_col in btc_energy_raw.columns:
        estimated_valid = btc_energy_raw[estimated_col].count()
        print(f"   '{estimated_col}': {estimated_valid} valid values out of {len(btc_energy_raw)}")
    
    if minimum_col in btc_energy_raw.columns:
        minimum_valid = btc_energy_raw[minimum_col].count()
        print(f"   '{minimum_col}': {minimum_valid} valid values out of {len(btc_energy_raw)}")
    
    # Choose energy column strategy
    if estimated_col in btc_energy_raw.columns and btc_energy_raw[estimated_col].count() > len(btc_energy_raw) * 0.5:
        energy_col = estimated_col
        print(f"   ✅ Using '{estimated_col}' as primary energy column")
    elif minimum_col in btc_energy_raw.columns:
        energy_col = minimum_col
        print(f"   ⚠️  Using '{minimum_col}' as fallback energy column")
    else:
        raise ValueError("No valid energy column found")
    
    # Process energy data
    btc_energy = btc_energy_raw[['DateTime', energy_col]].copy()
    btc_energy.columns = ['Date', 'Energy_TWh_Annual']
    btc_energy['Energy_TWh_Annual'] = pd.to_numeric(btc_energy['Energy_TWh_Annual'], errors='coerce')
    
    # Remove invalid energy values
    original_count = len(btc_energy)
    btc_energy = btc_energy.dropna(subset=['Energy_TWh_Annual'])
    invalid_energy = original_count - len(btc_energy)
    if invalid_energy > 0:
        print(f"   ⚠️  Removed {invalid_energy} rows with invalid energy values")
    
    # Clean dates
    btc_energy = clean_date_column(btc_energy, 'Date', 'Bitcoin Energy')
    
    print(f"   ⚡ Energy range: {btc_energy['Energy_TWh_Annual'].min():.2f} to {btc_energy['Energy_TWh_Annual'].max():.2f} TWh/year")
    
except Exception as e:
    print(f"❌ FAILED to load Bitcoin energy: {e}")
    btc_energy = None

# 3. LOAD AND VALIDATE ETHEREUM PRICE DATA
print("\n3. LOADING ETHEREUM PRICE DATA")
print("="*50)

try:
    eth_prices_raw = pd.read_excel('eth_ds_parsed.xlsx')
    print(f"✅ Loaded eth_ds_parsed.xlsx: {eth_prices_raw.shape}")
    
    if not validate_dataframe(eth_prices_raw, "Ethereum Prices", ['Exchange Date', 'Bid'], 1000):
        raise ValueError("Ethereum price validation failed")
    
    # Process similar to Bitcoin
    eth_prices = eth_prices_raw[['Exchange Date', 'Bid']].copy()
    eth_prices.columns = ['Date', 'Price']
    eth_prices['Price'] = pd.to_numeric(eth_prices['Price'], errors='coerce')
    
    # Remove invalid prices
    original_count = len(eth_prices)
    eth_prices = eth_prices.dropna(subset=['Price'])
    invalid_prices = original_count - len(eth_prices)
    if invalid_prices > 0:
        print(f"   ⚠️  Removed {invalid_prices} rows with invalid prices")
    
    # Clean dates
    eth_prices = clean_date_column(eth_prices, 'Date', 'Ethereum Prices')
    
    # Calculate returns
    eth_prices['Returns'] = eth_prices['Price'].pct_change() * 100
    
    print(f"   💰 Price range: ${eth_prices['Price'].min():.2f} to ${eth_prices['Price'].max():.2f}")
    print(f"   📈 Returns range: {eth_prices['Returns'].min():.2f}% to {eth_prices['Returns'].max():.2f}%")
    
except Exception as e:
    print(f"❌ FAILED to load Ethereum prices: {e}")
    eth_prices = None

# 4. LOAD AND VALIDATE ETHEREUM ENERGY DATA
print("\n4. LOADING ETHEREUM ENERGY DATA")
print("="*50)

try:
    eth_energy_raw = pd.read_csv('eth_con.csv')
    print(f"✅ Loaded eth_con.csv: {eth_energy_raw.shape}")
    
    if not validate_dataframe(eth_energy_raw, "Ethereum Energy", ['DateTime'], 500):
        raise ValueError("Ethereum energy validation failed")
    
    # Process Ethereum energy (similar strategy as Bitcoin)
    estimated_col = 'Estimated TWh per Year'
    minimum_col = 'Minimum TWh per Year'
    
    if estimated_col in eth_energy_raw.columns and eth_energy_raw[estimated_col].count() > len(eth_energy_raw) * 0.5:
        energy_col = estimated_col
    elif minimum_col in eth_energy_raw.columns:
        energy_col = minimum_col
    else:
        raise ValueError("No valid energy column found for Ethereum")
    
    eth_energy = eth_energy_raw[['DateTime', energy_col]].copy()
    eth_energy.columns = ['Date', 'Energy_TWh_Annual']
    eth_energy['Energy_TWh_Annual'] = pd.to_numeric(eth_energy['Energy_TWh_Annual'], errors='coerce')
    
    # Remove invalid energy values
    original_count = len(eth_energy)
    eth_energy = eth_energy.dropna(subset=['Energy_TWh_Annual'])
    invalid_energy = original_count - len(eth_energy)
    if invalid_energy > 0:
        print(f"   ⚠️  Removed {invalid_energy} rows with invalid energy values")
    
    # Clean dates
    eth_energy = clean_date_column(eth_energy, 'Date', 'Ethereum Energy')
    
    print(f"   ⚡ Energy range: {eth_energy['Energy_TWh_Annual'].min():.2f} to {eth_energy['Energy_TWh_Annual'].max():.2f} TWh/year")
    
    # Check for Ethereum Merge date (Sept 15, 2022)
    merge_date = pd.to_datetime('2022-09-15')
    pre_merge = eth_energy[eth_energy['Date'] < merge_date]
    post_merge = eth_energy[eth_energy['Date'] >= merge_date]
    
    print(f"   🔄 Ethereum Merge Analysis:")
    print(f"     Pre-merge (before 2022-09-15): {len(pre_merge)} observations")
    print(f"     Post-merge (after 2022-09-15): {len(post_merge)} observations")
    
    if len(post_merge) > 0:
        print(f"     ⚠️  WARNING: Ethereum energy data exists after Merge date!")
        print(f"     Post-merge avg energy: {post_merge['Energy_TWh_Annual'].mean():.2f} TWh/year")
    
except Exception as e:
    print(f"❌ FAILED to load Ethereum energy: {e}")
    eth_energy = None

# 5. LOAD AND VALIDATE GOOGLE TRENDS DATA
print("\n5. LOADING GOOGLE TRENDS DATA")
print("="*50)

try:
    google_raw = pd.read_csv('multiTimeline.csv', skiprows=1)
    print(f"✅ Loaded multiTimeline.csv: {google_raw.shape}")
    
    if not validate_dataframe(google_raw, "Google Trends", None, 50):
        raise ValueError("Google Trends validation failed")
    
    # Clean column names
    google_raw.columns = ['Date', 'Google_Trends']
    google_trends = google_raw.copy()
    
    # Convert to numeric
    google_trends['Google_Trends'] = pd.to_numeric(google_trends['Google_Trends'], errors='coerce')
    
    # Handle date conversion (might be monthly)
    google_trends['Date'] = pd.to_datetime(google_trends['Date'], errors='coerce')
    google_trends = google_trends.dropna()
    
    # Check if monthly data (convert to daily)
    if len(google_trends) < 1000:  # Likely monthly
        print(f"   📅 Converting monthly Google Trends to daily frequency...")
        
        # Create daily range
        start_date = max(google_trends['Date'].min(), ANALYSIS_START)
        end_date = min(google_trends['Date'].max(), ANALYSIS_END)
        daily_dates = pd.date_range(start=start_date, end=end_date, freq='D')
        
        daily_google = pd.DataFrame({'Date': daily_dates})
        daily_google['Month'] = daily_google['Date'].dt.to_period('M')
        google_trends['Month'] = google_trends['Date'].dt.to_period('M')
        
        daily_google = daily_google.merge(google_trends[['Month', 'Google_Trends']], on='Month', how='left')
        daily_google['Google_Trends'] = daily_google['Google_Trends'].fillna(method='ffill')
        
        google_trends = daily_google[['Date', 'Google_Trends']].copy()
    
    # Filter to analysis period
    google_trends = google_trends[(google_trends['Date'] >= ANALYSIS_START) & (google_trends['Date'] <= ANALYSIS_END)]
    
    print(f"   📊 Google Trends range: {google_trends['Google_Trends'].min()} to {google_trends['Google_Trends'].max()}")
    print(f"   📅 Final Google Trends: {len(google_trends)} daily observations")
    
except Exception as e:
    print(f"❌ FAILED to load Google Trends: {e}")
    google_trends = None

# 6. LOAD AND VALIDATE EPU DATA
print("\n6. LOADING EPU DATA")
print("="*50)

try:
    epu_raw = pd.read_excel('All_Country_Data.xlsx')
    print(f"✅ Loaded All_Country_Data.xlsx: {epu_raw.shape}")
    
    if not validate_dataframe(epu_raw, "EPU Data", ['Year', 'Month', 'US'], 50):
        raise ValueError("EPU validation failed")
    
    # Extract US EPU data
    epu_monthly = epu_raw[['Year', 'Month', 'US']].copy()
    epu_monthly.columns = ['Year', 'Month', 'EPU']
    epu_monthly['EPU'] = pd.to_numeric(epu_monthly['EPU'], errors='coerce')
    
    # Remove invalid EPU values
    original_count = len(epu_monthly)
    epu_monthly = epu_monthly.dropna()
    invalid_epu = original_count - len(epu_monthly)
    if invalid_epu > 0:
        print(f"   ⚠️  Removed {invalid_epu} rows with invalid EPU values")
    
    # Create date column
    epu_monthly['Date'] = pd.to_datetime(epu_monthly[['Year', 'Month']].assign(day=1))
    
    # Filter to analysis period
    epu_monthly = epu_monthly[(epu_monthly['Date'] >= ANALYSIS_START) & (epu_monthly['Date'] <= ANALYSIS_END)]
    
    # Convert monthly to daily
    print(f"   📅 Converting monthly EPU to daily frequency...")
    daily_dates = pd.date_range(start=ANALYSIS_START, end=ANALYSIS_END, freq='D')
    
    epu_data = pd.DataFrame({'Date': daily_dates})
    epu_data['Month'] = epu_data['Date'].dt.to_period('M')
    epu_monthly['Month'] = epu_monthly['Date'].dt.to_period('M')
    
    epu_data = epu_data.merge(epu_monthly[['Month', 'EPU']], on='Month', how='left')
    epu_data['EPU'] = epu_data['EPU'].fillna(method='ffill')
    epu_data = epu_data[['Date', 'EPU']].copy()
    
    print(f"   📊 EPU range: {epu_data['EPU'].min():.1f} to {epu_data['EPU'].max():.1f}")
    print(f"   📅 Final EPU: {len(epu_data)} daily observations")
    
except Exception as e:
    print(f"❌ FAILED to load EPU data: {e}")
    epu_data = None

# 7. DATA ALIGNMENT AND MERGING
print("\n7. DATA ALIGNMENT AND MERGING")
print("="*50)

# Check what data we successfully loaded
datasets = {
    'Bitcoin Prices': btc_prices,
    'Bitcoin Energy': btc_energy,
    'Ethereum Prices': eth_prices,
    'Ethereum Energy': eth_energy,
    'Google Trends': google_trends,
    'EPU Data': epu_data
}

successful_datasets = {name: df for name, df in datasets.items() if df is not None}
failed_datasets = [name for name, df in datasets.items() if df is None]

print(f"✅ Successfully loaded datasets: {list(successful_datasets.keys())}")
if failed_datasets:
    print(f"❌ Failed to load datasets: {failed_datasets}")

# Merge Bitcoin data (core for CEIR calculation)
if btc_prices is not None and btc_energy is not None:
    print(f"\n🔗 MERGING BITCOIN DATASETS:")
    
    # Inner join to ensure we have both price and energy data
    bitcoin_merged = pd.merge(btc_prices, btc_energy, on='Date', how='inner', suffixes=('_price', '_energy'))
    
    print(f"   Bitcoin prices: {len(btc_prices)} observations")
    print(f"   Bitcoin energy: {len(btc_energy)} observations")
    print(f"   Merged result: {len(bitcoin_merged)} observations")
    
    if len(bitcoin_merged) < 500:
        print(f"   ⚠️  WARNING: Only {len(bitcoin_merged)} merged observations - may be insufficient for analysis")
    
    # Add other variables if available
    if google_trends is not None:
        before_merge = len(bitcoin_merged)
        bitcoin_merged = pd.merge(bitcoin_merged, google_trends, on='Date', how='left')
        print(f"   Added Google Trends: {len(bitcoin_merged)} observations (filled {len(bitcoin_merged) - before_merge} missing)")
    
    if epu_data is not None:
        before_merge = len(bitcoin_merged)
        bitcoin_merged = pd.merge(bitcoin_merged, epu_data, on='Date', how='left')
        print(f"   Added EPU data: {len(bitcoin_merged)} observations")
    
    print(f"   ✅ Final merged dataset: {len(bitcoin_merged)} observations")
    print(f"   📅 Date range: {bitcoin_merged['Date'].min().strftime('%Y-%m-%d')} to {bitcoin_merged['Date'].max().strftime('%Y-%m-%d')}")
    
else:
    print(f"❌ Cannot merge Bitcoin data - missing price or energy data")
    bitcoin_merged = None

# 8. CEIR CALCULATION WITH VALIDATION
if bitcoin_merged is not None:
    print(f"\n8. CEIR CALCULATION WITH FULL VALIDATION")
    print("="*50)
    
    # CEIR parameters
    BASELINE_CAP = 240_000_000_000  # $240B
    ELECTRICITY_COST_PER_KWH = 0.05  # $0.05 per kWh
    BTC_SUPPLY = 21_000_000  # 21M BTC
    
    print(f"📋 CEIR CALCULATION PARAMETERS:")
    print(f"   Baseline market cap: ${BASELINE_CAP/1e9:.1f}B")
    print(f"   Electricity cost: ${ELECTRICITY_COST_PER_KWH:.3f} per kWh")
    print(f"   BTC supply assumption: {BTC_SUPPLY:,} BTC")
    
    # Calculate market cap
    bitcoin_merged['Market_Cap'] = bitcoin_merged['Price'] * BTC_SUPPLY
    print(f"   📊 Market cap range: ${bitcoin_merged['Market_Cap'].min()/1e9:.1f}B to ${bitcoin_merged['Market_Cap'].max()/1e9:.1f}B")
    
    # Calculate daily energy cost (TWh/year to $/day)
    bitcoin_merged['Daily_Energy_Cost'] = (bitcoin_merged['Energy_TWh_Annual'] * 1_000_000_000 * ELECTRICITY_COST_PER_KWH) / 365
    print(f"   ⚡ Daily energy cost range: ${bitcoin_merged['Daily_Energy_Cost'].min():,.0f} to ${bitcoin_merged['Daily_Energy_Cost'].max():,.0f}")
    
    # Calculate cumulative energy investment
    bitcoin_merged = bitcoin_merged.sort_values('Date').reset_index(drop=True)
    bitcoin_merged['Cumulative_Energy_Cost'] = bitcoin_merged['Daily_Energy_Cost'].cumsum()
    print(f"   📈 Cumulative energy cost range: ${bitcoin_merged['Cumulative_Energy_Cost'].min():,.0f} to ${bitcoin_merged['Cumulative_Energy_Cost'].max():,.0f}")
    
    # Calculate raw CEIR
    bitcoin_merged['CEIR_raw'] = (bitcoin_merged['Market_Cap'] - BASELINE_CAP) / bitcoin_merged['Cumulative_Energy_Cost']
    
    print(f"\n🔍 RAW CEIR VALIDATION:")
    print(f"   Raw CEIR range: {bitcoin_merged['CEIR_raw'].min():.2f} to {bitcoin_merged['CEIR_raw'].max():.2f}")
    print(f"   Raw CEIR mean: {bitcoin_merged['CEIR_raw'].mean():.2f}")
    print(f"   Raw CEIR skewness: {skew(bitcoin_merged['CEIR_raw'].dropna()):.2f}")
    
    # Apply robust fixes
    print(f"\n🛠️  APPLYING ROBUST CEIR FIXES:")
    
    # Remove observations with very low cumulative energy (causes extreme values)
    min_cumulative_threshold = 50_000_000  # $50M minimum
    before_filter = len(bitcoin_merged)
    bitcoin_merged = bitcoin_merged[bitcoin_merged['Cumulative_Energy_Cost'] >= min_cumulative_threshold]
    removed_early = before_filter - len(bitcoin_merged)
    
    if removed_early > 0:
        print(f"   🔧 Removed {removed_early} early observations with cumulative energy < ${min_cumulative_threshold/1e6:.0f}M")
    
    # Winsorize extreme CEIR values
    bitcoin_merged['CEIR'] = mstats.winsorize(bitcoin_merged['CEIR_raw'], limits=[0.01, 0.01])
    
    print(f"   🔧 Applied winsorization at 1% and 99% percentiles")
    print(f"   ✅ Final CEIR range: {bitcoin_merged['CEIR'].min():.2f} to {bitcoin_merged['CEIR'].max():.2f}")
    print(f"   ✅ Final CEIR skewness: {skew(bitcoin_merged['CEIR'].dropna()):.2f}")
    
    # Save processed data
    bitcoin_merged.to_csv('bitcoin_robust_analysis.csv', index=False)
    print(f"   💾 Saved robust dataset to 'bitcoin_robust_analysis.csv'")

# 9. GENERATE FINAL DESCRIPTIVE STATISTICS
print(f"\n9. FINAL DESCRIPTIVE STATISTICS")
print("="*50)

def desc_stats(series, name):
    """Generate descriptive statistics"""
    clean_series = series.dropna()
    if len(clean_series) == 0:
        return {'Variable': name, 'N': 0, 'Mean': 'N/A', 'Std Dev': 'N/A', 
                'Min': 'N/A', 'Max': 'N/A', 'Skewness': 'N/A'}
    
    return {
        'Variable': name,
        'N': len(clean_series),
        'Mean': round(clean_series.mean(), 2),
        'Std Dev': round(clean_series.std(), 2),
        'Min': round(clean_series.min(), 2),
        'Max': round(clean_series.max(), 2),
        'Skewness': round(skew(clean_series), 2)
    }

stats_list = []

# Bitcoin variables
if bitcoin_merged is not None:
    stats_list.append(desc_stats(bitcoin_merged['Returns'], 'Bitcoin Daily Return (%)'))
    stats_list.append(desc_stats(bitcoin_merged['Price'], 'Bitcoin Price (USD)'))
    stats_list.append(desc_stats(bitcoin_merged['CEIR'], 'CEIR (Robust)'))
    stats_list.append(desc_stats(bitcoin_merged['Energy_TWh_Annual'], 'Bitcoin Energy (TWh/year)'))

# Control variables
if bitcoin_merged is not None and 'Google_Trends' in bitcoin_merged.columns:
    stats_list.append(desc_stats(bitcoin_merged['Google_Trends'], 'Google Trends (Bitcoin)'))

if bitcoin_merged is not None and 'EPU' in bitcoin_merged.columns:
    stats_list.append(desc_stats(bitcoin_merged['EPU'], 'Economic Policy Uncertainty'))

# Ethereum variables (for natural experiment)
if eth_prices is not None:
    stats_list.append(desc_stats(eth_prices['Returns'], 'Ethereum Daily Return (%)'))
    stats_list.append(desc_stats(eth_prices['Price'], 'Ethereum Price (USD)'))

if eth_energy is not None:
    stats_list.append(desc_stats(eth_energy['Energy_TWh_Annual'], 'Ethereum Energy (TWh/year)'))

# Create final table
if stats_list:
    final_stats_df = pd.DataFrame(stats_list)
    
    print("\n📊 FINAL ROBUST DESCRIPTIVE STATISTICS:")
    print("="*70)
    print(final_stats_df.to_string(index=False))
    
    # Save results
    final_stats_df.to_csv('robust_descriptive_statistics.csv', index=False)
    final_stats_df.to_excel('robust_descriptive_statistics.xlsx', index=False)
    
    print(f"\n💾 SAVED RESULTS:")
    print(f"   - robust_descriptive_statistics.csv")
    print(f"   - robust_descriptive_statistics.xlsx")
    print(f"   - bitcoin_robust_analysis.csv")

print(f"\n🏆 ROBUST ANALYSIS COMPLETE!")
print("="*50)

# Final validation summary
if bitcoin_merged is not None:
    print(f"✅ SUCCESS: Robust Bitcoin analysis ready")
    print(f"   📊 Final dataset: {len(bitcoin_merged)} observations")
    print(f"   📅 Period: {bitcoin_merged['Date'].min().strftime('%Y-%m-%d')} to {bitcoin_merged['Date'].max().strftime('%Y-%m-%d')}")
    print(f"   🎯 CEIR range: {bitcoin_merged['CEIR'].min():.2f} to {bitcoin_merged['CEIR'].max():.2f}")
    
    # Check Ethereum availability for natural experiment
    if eth_prices is not None:
        print(f"   ✅ Ethereum data available for natural experiment")
        if eth_energy is not None:
            merge_date = pd.to_datetime('2022-09-15')
            pre_merge_eth = eth_energy[eth_energy['Date'] < merge_date]
            print(f"   🔄 Pre-merge Ethereum energy: {len(pre_merge_eth)} observations")
    
    print(f"\n🎯 READY FOR REGRESSION ANALYSIS AND HYPOTHESIS TESTING!")
    
else:
    print(f"❌ ANALYSIS FAILED: Could not create robust dataset")

print(f"\n" + "="*70)

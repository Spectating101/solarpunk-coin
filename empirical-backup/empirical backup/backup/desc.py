import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis
import warnings
warnings.filterwarnings('ignore')

print("COMPLETE DATA PROCESSING FOR BITCOIN ENERGY COST ANALYSIS")
print("="*60)

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

# 1. LOAD BITCOIN PRICE DATA (LSEG)
print("1. Loading Bitcoin price data from btc_ds_parsed.xlsx...")
try:
    btc_prices = pd.read_excel('btc_ds_parsed.xlsx')
    print(f"   ✓ Loaded: {btc_prices.shape}")
    print(f"   Columns: {list(btc_prices.columns)}")
    
    # Clean column names and find price column
    if 'Exchange Date' in btc_prices.columns:
        btc_prices['Date'] = pd.to_datetime(btc_prices['Exchange Date'])
        price_col = 'Bid' if 'Bid' in btc_prices.columns else btc_prices.columns[1]
        btc_prices['Price'] = pd.to_numeric(btc_prices[price_col], errors='coerce')
    else:
        # Try to auto-detect
        btc_prices['Date'] = pd.to_datetime(btc_prices.iloc[:, 0])
        btc_prices['Price'] = pd.to_numeric(btc_prices.iloc[:, 1], errors='coerce')
    
    btc_prices = btc_prices[['Date', 'Price']].dropna().sort_values('Date')
    btc_prices['Returns'] = btc_prices['Price'].pct_change() * 100
    print(f"   ✓ Processed: {len(btc_prices)} price observations")
    
except Exception as e:
    print(f"   ✗ Error loading Bitcoin prices: {e}")
    btc_prices = None

# 2. LOAD BITCOIN ENERGY DATA (Digiconomist)
print("\n2. Loading Bitcoin energy data from btc_con.csv...")
try:
    btc_energy = pd.read_csv('btc_con.csv')
    print(f"   ✓ Loaded: {btc_energy.shape}")
    print(f"   Columns: {list(btc_energy.columns)}")
    
    # Clean the data
    if 'DateTime' in btc_energy.columns:
        btc_energy['Date'] = pd.to_datetime(btc_energy['DateTime'])
        energy_col = 'Estimated TWh per Year' if 'Estimated TWh per Year' in btc_energy.columns else btc_energy.columns[1]
    else:
        btc_energy['Date'] = pd.to_datetime(btc_energy.iloc[:, 0])
        energy_col = btc_energy.columns[1]
    
    btc_energy['Energy_TWh_Annual'] = pd.to_numeric(btc_energy[energy_col], errors='coerce')
    btc_energy = btc_energy[['Date', 'Energy_TWh_Annual']].dropna().sort_values('Date')
    print(f"   ✓ Processed: {len(btc_energy)} energy observations")
    
except Exception as e:
    print(f"   ✗ Error loading Bitcoin energy: {e}")
    btc_energy = None

# 3. LOAD ETHEREUM PRICE DATA (LSEG)
print("\n3. Loading Ethereum price data from eth_ds_parsed.xlsx...")
try:
    eth_prices = pd.read_excel('eth_ds_parsed.xlsx')
    print(f"   ✓ Loaded: {eth_prices.shape}")
    
    # Process similar to Bitcoin
    if 'Exchange Date' in eth_prices.columns:
        eth_prices['Date'] = pd.to_datetime(eth_prices['Exchange Date'])
        price_col = 'Bid' if 'Bid' in eth_prices.columns else eth_prices.columns[1]
        eth_prices['Price'] = pd.to_numeric(eth_prices[price_col], errors='coerce')
    else:
        eth_prices['Date'] = pd.to_datetime(eth_prices.iloc[:, 0])
        eth_prices['Price'] = pd.to_numeric(eth_prices.iloc[:, 1], errors='coerce')
    
    eth_prices = eth_prices[['Date', 'Price']].dropna().sort_values('Date')
    eth_prices['Returns'] = eth_prices['Price'].pct_change() * 100
    print(f"   ✓ Processed: {len(eth_prices)} Ethereum price observations")
    
except Exception as e:
    print(f"   ✗ Error loading Ethereum prices: {e}")
    eth_prices = None

# 4. LOAD ETHEREUM ENERGY DATA (Digiconomist)
print("\n4. Loading Ethereum energy data from eth_con.csv...")
try:
    eth_energy = pd.read_csv('eth_con.csv')
    print(f"   ✓ Loaded: {eth_energy.shape}")
    
    # Process similar to Bitcoin energy
    if 'DateTime' in eth_energy.columns:
        eth_energy['Date'] = pd.to_datetime(eth_energy['DateTime'])
        energy_col = 'Estimated TWh per Year' if 'Estimated TWh per Year' in eth_energy.columns else eth_energy.columns[1]
    else:
        eth_energy['Date'] = pd.to_datetime(eth_energy.iloc[:, 0])
        energy_col = eth_energy.columns[1]
    
    eth_energy['Energy_TWh_Annual'] = pd.to_numeric(eth_energy[energy_col], errors='coerce')
    eth_energy = eth_energy[['Date', 'Energy_TWh_Annual']].dropna().sort_values('Date')
    print(f"   ✓ Processed: {len(eth_energy)} Ethereum energy observations")
    
except Exception as e:
    print(f"   ✗ Error loading Ethereum energy: {e}")
    eth_energy = None

# 5. LOAD GOOGLE TRENDS DATA
print("\n5. Loading Google Trends data from multiTimeline.csv...")
try:
    google_trends = pd.read_csv('multiTimeline.csv', skiprows=1)  # Skip header row
    print(f"   ✓ Loaded: {google_trends.shape}")
    print(f"   Columns: {list(google_trends.columns)}")
    
    # Process Google Trends data
    if len(google_trends.columns) >= 2:
        google_trends.columns = ['Date', 'Google_Trends']
        google_trends['Date'] = pd.to_datetime(google_trends['Date'])
        google_trends['Google_Trends'] = pd.to_numeric(google_trends['Google_Trends'], errors='coerce')
        google_trends = google_trends.dropna().sort_values('Date')
        
        # If monthly data, convert to daily by forward filling
        if len(google_trends) < 1000:  # Likely monthly data
            print("   Converting monthly to daily frequency...")
            start_date = google_trends['Date'].min()
            end_date = google_trends['Date'].max()
            daily_dates = pd.date_range(start=start_date, end=end_date, freq='D')
            
            daily_google = pd.DataFrame({'Date': daily_dates})
            daily_google['Month'] = daily_google['Date'].dt.to_period('M')
            google_trends['Month'] = google_trends['Date'].dt.to_period('M')
            
            daily_google = daily_google.merge(
                google_trends[['Month', 'Google_Trends']], 
                on='Month', how='left'
            )
            daily_google['Google_Trends'] = daily_google['Google_Trends'].fillna(method='ffill')
            google_trends = daily_google[['Date', 'Google_Trends']].copy()
        
        print(f"   ✓ Processed: {len(google_trends)} Google Trends observations")
    
except Exception as e:
    print(f"   ✗ Error loading Google Trends: {e}")
    google_trends = None

# 6. LOAD EPU DATA from All_Country_Data.xlsx
print("\n6. Loading EPU data from All_Country_Data.xlsx...")
try:
    epu_raw = pd.read_excel('All_Country_Data.xlsx')
    print(f"   ✓ Loaded: {epu_raw.shape}")
    print(f"   Columns: {list(epu_raw.columns)}")
    
    # Extract Year, Month, and US columns
    if 'Year' in epu_raw.columns and 'Month' in epu_raw.columns and 'US' in epu_raw.columns:
        epu_monthly = epu_raw[['Year', 'Month', 'US']].copy()
        epu_monthly['US'] = pd.to_numeric(epu_monthly['US'], errors='coerce')
        epu_monthly = epu_monthly.dropna()
        
        # Create proper date column
        epu_monthly['Date'] = pd.to_datetime(epu_monthly[['Year', 'Month']].assign(day=1))
        epu_monthly = epu_monthly[['Date', 'US']].rename(columns={'US': 'EPU'})
        epu_monthly = epu_monthly.sort_values('Date')
        
        # Convert monthly to daily by forward filling
        start_date = epu_monthly['Date'].min()
        end_date = epu_monthly['Date'].max()
        daily_dates = pd.date_range(start=start_date, end=end_date, freq='D')
        
        epu_data = pd.DataFrame({'Date': daily_dates})
        epu_data['Month'] = epu_data['Date'].dt.to_period('M')
        epu_monthly['Month'] = epu_monthly['Date'].dt.to_period('M')
        
        epu_data = epu_data.merge(epu_monthly[['Month', 'EPU']], on='Month', how='left')
        epu_data['EPU'] = epu_data['EPU'].fillna(method='ffill')
        epu_data = epu_data[['Date', 'EPU']].copy()
        
        print(f"   ✓ Processed: {len(epu_data)} EPU observations")
        print(f"   ✓ EPU range: {epu_data['EPU'].min():.1f} to {epu_data['EPU'].max():.1f}")
        
    else:
        print("   ✗ Could not find Year, Month, and US columns")
        epu_data = None
        
except Exception as e:
    print(f"   ✗ Error loading EPU data: {e}")
    epu_data = None

# 7. CALCULATE CEIR
print("\n7. Calculating CEIR...")
if btc_prices is not None and btc_energy is not None:
    # Merge Bitcoin price and energy data
    merged_data = pd.merge(btc_prices, btc_energy, on='Date', how='inner')
    print(f"   ✓ Merged data: {len(merged_data)} observations")
    
    # CEIR calculation parameters
    baseline_cap = 240_000_000_000  # $240B baseline (Jan 1, 2018)
    electricity_cost_per_kwh = 0.05  # $0.05 per kWh
    btc_supply = 21_000_000  # 21M BTC
    
    # Calculate market cap
    merged_data['Market_Cap'] = merged_data['Price'] * btc_supply
    
    # Calculate daily energy cost
    merged_data['Daily_Energy_Cost'] = (merged_data['Energy_TWh_Annual'] * 1_000_000_000 * electricity_cost_per_kwh) / 365
    
    # Calculate cumulative energy investment since baseline
    baseline_date = pd.to_datetime('2018-01-01')
    merged_data = merged_data[merged_data['Date'] >= baseline_date].sort_values('Date')
    merged_data['Cumulative_Energy_Cost'] = merged_data['Daily_Energy_Cost'].cumsum()
    
    # Calculate CEIR
    merged_data['CEIR'] = (merged_data['Market_Cap'] - baseline_cap) / merged_data['Cumulative_Energy_Cost']
    
    print(f"   ✓ CEIR calculated for {len(merged_data)} observations")
    print(f"   ✓ CEIR range: {merged_data['CEIR'].min():.2f} to {merged_data['CEIR'].max():.2f}")
    
    # Save processed data
    merged_data.to_csv('processed_bitcoin_data.csv', index=False)
    print("   ✓ Saved processed data to 'processed_bitcoin_data.csv'")

# 8. GENERATE DESCRIPTIVE STATISTICS
print("\n8. Generating descriptive statistics...")
stats_list = []

# Bitcoin data
if btc_prices is not None:
    stats_list.append(desc_stats(btc_prices['Returns'], 'Bitcoin Daily Return (%)'))
    stats_list.append(desc_stats(btc_prices['Price'], 'Bitcoin Price (USD)'))

if 'merged_data' in locals():
    stats_list.append(desc_stats(merged_data['CEIR'], 'CEIR'))
    stats_list.append(desc_stats(merged_data['Energy_TWh_Annual'], 'Bitcoin Energy (TWh/year)'))

# Control variables
if google_trends is not None:
    stats_list.append(desc_stats(google_trends['Google_Trends'], 'Google Trends (Bitcoin)'))

if epu_data is not None:
    stats_list.append(desc_stats(epu_data['EPU'], 'Economic Policy Uncertainty'))

# Ethereum data (for comparison)
if eth_prices is not None:
    stats_list.append(desc_stats(eth_prices['Returns'], 'Ethereum Daily Return (%)'))
    stats_list.append(desc_stats(eth_prices['Price'], 'Ethereum Price (USD)'))

# Create final table
if stats_list:
    stats_df = pd.DataFrame(stats_list)
    
    print("\n" + "="*80)
    print("DESCRIPTIVE STATISTICS TABLE")
    print("="*80)
    print(stats_df.to_string(index=False))
    
    # Save results
    stats_df.to_csv('descriptive_statistics.csv', index=False)
    stats_df.to_excel('descriptive_statistics.xlsx', index=False)
    
    print(f"\n✓ Results saved to:")
    print("  - descriptive_statistics.csv")
    print("  - descriptive_statistics.xlsx")
    
    # Create formatted table for your proposal
    formatted_table = stats_df.copy()
    formatted_table = formatted_table[['Variable', 'N', 'Mean', 'Std Dev', 'Min', 'Max', 'Skewness']]
    
    print("\n" + "="*80)
    print("FORMATTED TABLE FOR YOUR PROPOSAL:")
    print("="*80)
    print(formatted_table.to_string(index=False))
    
    # Save formatted version
    formatted_table.to_excel('descriptive_stats_for_proposal.xlsx', index=False)
    print("\n✓ Proposal-ready table saved to 'descriptive_stats_for_proposal.xlsx'")

else:
    print("✗ No data processed successfully")

print("\n" + "="*80)
print("SUMMARY")
print("="*80)
print("✓ Data files processed:")
print(f"  - Bitcoin prices: {'✓' if btc_prices is not None else '✗'}")
print(f"  - Bitcoin energy: {'✓' if btc_energy is not None else '✗'}")
print(f"  - Ethereum prices: {'✓' if eth_prices is not None else '✗'}")
print(f"  - Ethereum energy: {'✓' if eth_energy is not None else '✗'}")
print(f"  - Google Trends: {'✓' if google_trends is not None else '✗'}")
print(f"  - EPU data: {'✓' if epu_data is not None else '✗'}")
print(f"  - CEIR calculated: {'✓' if 'merged_data' in locals() else '✗'}")

if 'merged_data' in locals():
    print(f"\n✓ Sample period: {merged_data['Date'].min().strftime('%Y-%m-%d')} to {merged_data['Date'].max().strftime('%Y-%m-%d')}")
    print(f"✓ Total observations: {len(merged_data)}")
    print(f"✓ CEIR example: Market cap ${merged_data['Market_Cap'].iloc[-1]/1e9:.0f}B, CEIR = {merged_data['CEIR'].iloc[-1]:.1f}")

print("\n🎯 Ready for your proposal! Add the descriptive statistics table to Page 7.")

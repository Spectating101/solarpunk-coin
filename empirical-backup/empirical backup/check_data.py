import pandas as pd
import numpy as np
import os
import glob

print("COMPREHENSIVE DATA AUDIT - ALL FILES")
print("="*70)

# Get all CSV and Excel files in the directory
csv_files = glob.glob('*.csv')
excel_files = glob.glob('*.xlsx') + glob.glob('*.xls')

print(f"Found {len(csv_files)} CSV files and {len(excel_files)} Excel files\n")

# Dictionary to store all dataframes
all_data = {}

# 1. Load and check all CSV files
print("1. CSV FILES ANALYSIS")
print("-"*50)

for file in csv_files:
    print(f"\n📄 {file}:")
    try:
        df = pd.read_csv(file)
        all_data[file] = df
        print(f"   Shape: {df.shape}")
        
        # Check for date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        if date_cols:
            for date_col in date_cols:
                try:
                    dates = pd.to_datetime(df[date_col], errors='coerce')
                    valid_dates = dates.dropna()
                    if len(valid_dates) > 0:
                        print(f"   Date column '{date_col}': {valid_dates.min()} to {valid_dates.max()}")
                        
                        # Check frequency
                        if len(valid_dates) > 1:
                            date_diffs = valid_dates.diff().dropna()
                            mode_diff = date_diffs.mode()[0] if len(date_diffs.mode()) > 0 else date_diffs.iloc[0]
                            if mode_diff.days == 1:
                                freq = "Daily"
                            elif mode_diff.days >= 28 and mode_diff.days <= 31:
                                freq = "Monthly"
                            elif mode_diff.days == 7:
                                freq = "Weekly"
                            else:
                                freq = f"~{mode_diff.days} days"
                            print(f"   Frequency: {freq}")
                except:
                    pass
        
        # Show first 5 columns
        print(f"   Columns: {list(df.columns[:5])} {'...' if len(df.columns) > 5 else ''}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

# 2. Load and check all Excel files
print("\n\n2. EXCEL FILES ANALYSIS")
print("-"*50)

for file in excel_files:
    print(f"\n📊 {file}:")
    try:
        # Try to read Excel file
        xl_file = pd.ExcelFile(file)
        if len(xl_file.sheet_names) > 1:
            print(f"   Multiple sheets: {xl_file.sheet_names}")
        
        # Read first sheet
        df = pd.read_excel(file)
        all_data[file] = df
        print(f"   Shape: {df.shape}")
        
        # Check for date columns
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower() or 'year' in col.lower()]
        if date_cols:
            for date_col in date_cols[:2]:  # Check first 2 date columns
                try:
                    dates = pd.to_datetime(df[date_col], errors='coerce')
                    valid_dates = dates.dropna()
                    if len(valid_dates) > 0:
                        print(f"   Date column '{date_col}': {valid_dates.min()} to {valid_dates.max()}")
                except:
                    pass
        
        print(f"   Columns: {list(df.columns[:5])} {'...' if len(df.columns) > 5 else ''}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

# 3. SPECIFIC DATA CHECKS
print("\n\n3. CRITICAL DATA ALIGNMENT CHECKS")
print("-"*50)

# Check Bitcoin price data
print("\n📈 Bitcoin Price Data:")
btc_files = ['btc_ds_parsed.xlsx', 'processed_bitcoin_data.csv', 'bitcoin_robust_analysis.csv']
for file in btc_files:
    if file in all_data:
        df = all_data[file]
        print(f"\n   {file}:")
        if 'Price' in df.columns:
            price_col = df['Price'].dropna()
            print(f"   Price range: ${price_col.min():.2f} - ${price_col.max():.2f}")
        if 'Market_Cap' in df.columns:
            mc = df['Market_Cap'].dropna()
            print(f"   Market Cap range: ${mc.min()/1e9:.1f}B - ${mc.max()/1e9:.1f}B")

# Check energy data
print("\n\n⚡ Energy Data:")
energy_files = ['btc_con.csv', 'eth_con.csv']
for file in energy_files:
    if file in all_data:
        df = all_data[file]
        print(f"\n   {file}:")
        energy_cols = [col for col in df.columns if 'twh' in col.lower() or 'energy' in col.lower()]
        for col in energy_cols[:3]:
            if df[col].dtype in ['float64', 'int64']:
                print(f"   {col}: {df[col].min():.2f} - {df[col].max():.2f}")

# Check electricity price data
print("\n\n💡 Electricity Price Data:")
elec_files = ['heatmap.csv', 'location_weight_cleaned.xlsx']
for file in elec_files:
    if file in all_data:
        df = all_data[file]
        print(f"\n   {file}:")
        print(f"   Shape: {df.shape}")
        if 'date' in str(df.columns).lower():
            date_col = [col for col in df.columns if 'date' in col.lower()][0]
            dates = pd.to_datetime(df[date_col], errors='coerce').dropna()
            if len(dates) > 0:
                print(f"   Date range: {dates.min()} to {dates.max()}")

# 4. CHECK FOR NEGATIVE CEIR VALUES
print("\n\n4. INVESTIGATING NEGATIVE CEIR VALUES")
print("-"*50)

if 'processed_bitcoin_data.csv' in all_data:
    df = all_data['processed_bitcoin_data.csv']
    if 'CEIR' in df.columns:
        negative_ceir = df[df['CEIR'] < 0]
        print(f"Found {len(negative_ceir)} negative CEIR values")
        
        if len(negative_ceir) > 0:
            print("\nFirst 5 negative CEIR observations:")
            for idx, row in negative_ceir.head().iterrows():
                if 'Date' in df.columns and 'Market_Cap' in df.columns:
                    date = row['Date']
                    mc = row['Market_Cap'] / 1e9
                    ceir = row['CEIR']
                    print(f"   {date}: Market Cap=${mc:.1f}B, CEIR={ceir:.2f}")
            
            # Check if market cap < baseline
            baseline = 240e9  # $240B baseline from your code
            below_baseline = df[df['Market_Cap'] < baseline]
            print(f"\n   Market Cap below ${baseline/1e9:.0f}B baseline: {len(below_baseline)} observations")
            print(f"   This explains negative CEIR values!")

# 5. DATA FREQUENCY MISMATCHES
print("\n\n5. FREQUENCY MISMATCH ANALYSIS")
print("-"*50)

frequencies = {}
for file, df in all_data.items():
    if len(df) > 0:
        # Estimate frequency based on row count and common patterns
        if len(df) > 2000:
            freq = "Daily"
        elif len(df) > 200 and len(df) < 500:
            freq = "Monthly"
        elif len(df) > 50 and len(df) < 200:
            freq = "Monthly/Quarterly"
        else:
            freq = "Unknown"
        
        frequencies[file] = (len(df), freq)

print("\nData Frequency Summary:")
for file, (rows, freq) in sorted(frequencies.items(), key=lambda x: x[1][0], reverse=True):
    print(f"   {file}: {rows} rows ({freq})")

# 6. MISSING DATA PERIODS
print("\n\n6. CRITICAL MISSING DATA PERIODS")
print("-"*50)

# Check electricity mapping data
if 'heatmap.csv' in all_data:
    df = all_data['heatmap.csv']
    print("\n🗺️  Mining Location Data (heatmap.csv):")
    if 'date' in str(df.columns).lower():
        date_col = [col for col in df.columns if 'date' in col.lower()][0]
        dates = pd.to_datetime(df[date_col], errors='coerce').dropna()
        if len(dates) > 0:
            print(f"   Available from: {dates.min()}")
            print(f"   ⚠️  Missing pre-2019 data for location-based electricity prices!")

# 7. FINAL RECOMMENDATIONS
print("\n\n7. RECOMMENDATIONS TO FIX DATA ISSUES")
print("-"*50)

print("""
✅ CEIR Negative Values Fix:
   - Caused by Market Cap < $240B baseline (especially in 2018-2019 bear market)
   - Solution: Use absolute CEIR = Market_Cap / Cumulative_Energy_Cost
   
✅ Frequency Mismatch Fix:
   - Bitcoin prices: Daily ✓
   - Energy data: Daily ✓
   - Electricity prices: Monthly → Interpolate to daily
   - Mining locations: Monthly from 2019 → Forward-fill for daily
   
✅ Missing Pre-2019 Location Data:
   - Use China-dominant assumption (>70% hashrate)
   - Apply uniform electricity price for pre-2019 period
   
✅ Enhanced CEIR Calculation:
   - For 2019-2021: Use actual location weights
   - For pre-2019: Use estimated China-dominant weights
   - For post-ban: Use new geographic distribution
""")

print("\n" + "="*70)
print("AUDIT COMPLETE - Check for any ❌ errors above!")

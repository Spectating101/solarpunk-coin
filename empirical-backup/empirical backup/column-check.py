import pandas as pd
import os
import glob

def check_csv_file(filename):
    """Check a single CSV file and return info"""
    try:
        df = pd.read_csv(filename)
        
        # Check for VIX-related columns
        vix_columns = [col for col in df.columns if 'VIX' in col.upper() or 'VOLATILITY' in col.upper()]
        
        # Check for other key columns
        has_price = any('price' in col.lower() or 'close' in col.lower() for col in df.columns)
        has_date = any('date' in col.lower() or 'time' in col.lower() for col in df.columns)
        has_energy = any('energy' in col.lower() or 'twh' in col.lower() or 'power' in col.lower() for col in df.columns)
        has_ceir = any('ceir' in col.lower() for col in df.columns)
        has_fear_greed = any('fear' in col.lower() or 'greed' in col.lower() for col in df.columns)
        
        return {
            'filename': filename,
            'shape': df.shape,
            'columns': list(df.columns),
            'vix_columns': vix_columns,
            'has_price': has_price,
            'has_date': has_date,
            'has_energy': has_energy,
            'has_ceir': has_ceir,
            'has_fear_greed': has_fear_greed,
            'date_range': None
        }
        
        # Try to get date range if date column exists
        date_cols = [col for col in df.columns if 'date' in col.lower()]
        if date_cols:
            try:
                df[date_cols[0]] = pd.to_datetime(df[date_cols[0]])
                info['date_range'] = f"{df[date_cols[0]].min()} to {df[date_cols[0]].max()}"
            except:
                pass
                
    except Exception as e:
        return {
            'filename': filename,
            'error': str(e)
        }
    
    return info

# Get all CSV files
csv_files = glob.glob('*.csv')
csv_files.sort()

print(f"Found {len(csv_files)} CSV files\n")
print("=" * 80)

# Check each file
main_candidates = []  # Files that might be the main analysis file

for csv_file in csv_files:
    print(f"\n📄 FILE: {csv_file}")
    print("-" * 80)
    
    info = check_csv_file(csv_file)
    
    if 'error' in info:
        print(f"   ❌ Error: {info['error']}")
        continue
    
    print(f"   Shape: {info['shape'][0]:,} rows × {info['shape'][1]} columns")
    
    # Print key findings
    if info['vix_columns']:
        print(f"   🎯 VIX/Volatility columns found: {info['vix_columns']}")
    
    print(f"   Has Price: {'✓' if info['has_price'] else '✗'}")
    print(f"   Has Date: {'✓' if info['has_date'] else '✗'}")
    print(f"   Has Energy: {'✓' if info['has_energy'] else '✗'}")
    print(f"   Has CEIR: {'✓' if info['has_ceir'] else '✗'}")
    print(f"   Has Fear/Greed: {'✓' if info['has_fear_greed'] else '✗'}")
    
    if info.get('date_range'):
        print(f"   Date Range: {info['date_range']}")
    
    # Show first 10 columns
    print(f"   First 10 columns: {info['columns'][:10]}")
    if len(info['columns']) > 10:
        print(f"   ... and {len(info['columns']) - 10} more columns")
    
    # Check if this might be a main analysis file
    if info['shape'][0] > 1000 and info['has_price'] and info['has_date']:
        main_candidates.append(csv_file)

print("\n" + "=" * 80)
print("\n🎯 SUMMARY:")
print("-" * 40)

# Find files with VIX
vix_files = []
for csv_file in csv_files:
    info = check_csv_file(csv_file)
    if 'error' not in info and info['vix_columns']:
        vix_files.append((csv_file, info['vix_columns']))

if vix_files:
    print("\nFiles containing VIX/Volatility columns:")
    for file, cols in vix_files:
        print(f"  - {file}: {cols}")
else:
    print("\n❌ No files found with VIX or Volatility columns")

print(f"\n📊 Likely main analysis files (>1000 rows with price & date):")
for file in main_candidates:
    print(f"  - {file}")

# Show which file likely has the most complete data
print("\n💡 RECOMMENDATION:")
if main_candidates:
    # Check which has the most relevant columns
    best_file = None
    best_score = 0
    
    for file in main_candidates:
        info = check_csv_file(file)
        score = sum([
            info['has_price'],
            info['has_date'],
            info['has_energy'],
            info['has_ceir'],
            info['has_fear_greed'],
            len(info['vix_columns']) > 0
        ])
        if score > best_score:
            best_score = score
            best_file = file
    
    if best_file:
        print(f"Most complete file appears to be: {best_file}")
        info = check_csv_file(best_file)
        print(f"It has {info['shape'][0]:,} rows and these key features:")
        print(f"  - Price: {'✓' if info['has_price'] else '✗'}")
        print(f"  - Energy data: {'✓' if info['has_energy'] else '✗'}")
        print(f"  - CEIR: {'✓' if info['has_ceir'] else '✗'}")
        print(f"  - Volatility: {'✓' if info['vix_columns'] else '✗'}")

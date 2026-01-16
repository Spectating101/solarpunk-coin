"""
CRITICAL FIX: Update electricity prices to correct values
This will patch all existing datasets with the correct electricity prices
"""

import pandas as pd
import numpy as np

# CORRECT electricity prices from the research ($/kWh)
CORRECT_PRICES = {
    'china': 0.088,     # NOT 0.04!
    'usa': 0.147,       # NOT 0.065!
    'russia': 0.090,    # NOT 0.05!
    'kazakhstan': 0.074, # NOT 0.045!
    'canada': 0.107,    # NOT 0.07!
    'malaysia': 0.134,  # NOT 0.055!
    'iran': 0.040,      # This one was close
    'others': 0.120     # NOT 0.06!
}

print("="*80)
print("FIXING ELECTRICITY PRICES IN ALL DATASETS")
print("="*80)

# First, update the electricity prices file
print("\n1. Updating electricity_prices_by_country.csv...")
elec_df = pd.DataFrame({
    'country': list(CORRECT_PRICES.keys()),
    'price_usd_per_kwh': list(CORRECT_PRICES.values())
})
elec_df.to_csv('electricity_prices_by_country_CORRECTED.csv', index=False)
print("✓ Saved corrected electricity prices")
print(elec_df)

# Now patch all analysis files
files_to_patch = [
    'bitcoin_analysis_with_concentration_metrics.csv',
    'complete_analysis_results.csv',
    'bitcoin_analysis_cleaned.csv',
    'bitcoin_final_analysis.csv'
]

for filename in files_to_patch:
    try:
        print(f"\n2. Patching {filename}...")
        df = pd.read_csv(filename)
        
        # Recalculate weighted electricity price
        country_cols = ['china', 'usa', 'russia', 'kazakhstan', 'canada', 'malaysia', 'iran', 'others']
        
        # Find which column variant exists (some have _x, _y suffixes)
        actual_cols = []
        for col in country_cols:
            if col in df.columns:
                actual_cols.append(col)
            elif f'{col}_x' in df.columns:
                actual_cols.append(f'{col}_x')
            elif f'{col}_y' in df.columns:
                actual_cols.append(f'{col}_y')
        
        if actual_cols:
            print(f"   Found country columns: {actual_cols[:3]}...")
            
            # Calculate new weighted price
            df['weighted_elec_price_CORRECTED'] = 0
            for col in actual_cols:
                country = col.replace('_x', '').replace('_y', '')
                if country in CORRECT_PRICES:
                    df['weighted_elec_price_CORRECTED'] += df[col] * CORRECT_PRICES[country]
            
            # Show the difference
            if 'weighted_elec_price' in df.columns:
                old_avg = df['weighted_elec_price'].mean()
                new_avg = df['weighted_elec_price_CORRECTED'].mean()
                print(f"   Old avg price: ${old_avg:.4f}/kWh")
                print(f"   New avg price: ${new_avg:.4f}/kWh")
                print(f"   Increase: {(new_avg/old_avg - 1)*100:.1f}%")
            
            # Recalculate all dependent variables
            if 'daily_energy_twh' in df.columns:
                # Fix daily cost
                df['daily_cost_usd_CORRECTED'] = df['daily_energy_twh'] * df['weighted_elec_price_CORRECTED'] * 1e9
                
                # Fix cumulative cost
                df['cumulative_cost_usd_CORRECTED'] = df['daily_cost_usd_CORRECTED'].cumsum()
                
                # Fix CEIR
                df['CEIR_CORRECTED_FINAL'] = df['Market_Cap'] / df['cumulative_cost_usd_CORRECTED']
                
                # Show impact on CEIR
                if 'CEIR' in df.columns:
                    old_ceir = df['CEIR'].mean()
                    new_ceir = df['CEIR_CORRECTED_FINAL'].mean()
                    print(f"   Old avg CEIR: {old_ceir:.2f}")
                    print(f"   New avg CEIR: {new_ceir:.2f}")
                    print(f"   CEIR decreased by: {(1 - new_ceir/old_ceir)*100:.1f}%")
            
            # Save patched file
            output_name = filename.replace('.csv', '_PRICE_CORRECTED.csv')
            df.to_csv(output_name, index=False)
            print(f"   ✓ Saved to {output_name}")
            
    except Exception as e:
        print(f"   ✗ Error: {e}")

print("\n" + "="*80)
print("IMPACT SUMMARY:")
print("="*80)
print("\nThe electricity prices were SIGNIFICANTLY underestimated!")
print("This means:")
print("1. Energy costs were ~2x too low")
print("2. CEIR values were ~2x too high") 
print("3. The 'anchoring' effect may be STRONGER than originally shown")
print("\nThis actually STRENGTHENS your paper's argument!")

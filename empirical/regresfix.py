import pandas as pd
import numpy as np

# Quick diagnostic script
df = pd.read_csv('bitcoin_final_analysis.csv')
df['Date'] = pd.to_datetime(df['Date'])

print("=== DIAGNOSING DATA ISSUES ===\n")

# Check for inf/nan in key columns
cols_to_check = ['weighted_price_calculated', 'Returns_forward', 'Energy_TWh_Annual', 
                 'log_CEIR', 'volatility_30d', 'fear_greed']

for col in cols_to_check:
    if col in df.columns:
        n_nan = df[col].isna().sum()
        n_inf = np.isinf(df[col].fillna(0)).sum()
        print(f"{col}: {n_nan} NaN, {n_inf} inf values")

# Check electricity price change calculation
print("\n=== Checking Electricity Price Changes ===")
df['elec_cost_change'] = df['weighted_price_calculated'].pct_change()
print(f"Elec cost change: {df['elec_cost_change'].isna().sum()} NaN")
print(f"Elec cost change: {np.isinf(df['elec_cost_change'].fillna(0)).sum()} inf")

# Look for the problematic rows
print("\n=== First few electricity prices ===")
print(df[['Date', 'weighted_price_calculated']].head(10))

# Fix the issue
print("\n=== FIXING THE ISSUE ===")
# Replace inf/nan with forward fill for electricity prices
df['weighted_price_calculated_clean'] = df['weighted_price_calculated'].replace([np.inf, -np.inf], np.nan)
df['weighted_price_calculated_clean'] = df['weighted_price_calculated_clean'].fillna(method='ffill').fillna(method='bfill')

# Recalculate percentage change with clean data
df['elec_cost_change_clean'] = df['weighted_price_calculated_clean'].pct_change()
df['elec_cost_change_clean'] = df['elec_cost_change_clean'].replace([np.inf, -np.inf], np.nan)
df['elec_cost_change_clean'] = df['elec_cost_change_clean'].fillna(0)

print(f"\nAfter cleaning:")
print(f"Clean elec prices: {df['weighted_price_calculated_clean'].isna().sum()} NaN")
print(f"Clean elec changes: {np.isinf(df['elec_cost_change_clean']).sum()} inf")

# Save the cleaned data
df.to_csv('bitcoin_analysis_cleaned.csv', index=False)
print("\nSaved cleaned data to: bitcoin_analysis_cleaned.csv")

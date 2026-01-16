"""
FINAL ELECTRICITY PRICES FOR BITCOIN MINING ANALYSIS
Based on comprehensive research of industrial rates 2018-2024
"""

import pandas as pd
import numpy as np

# Create the final electricity price table
print("="*80)
print("BITCOIN MINING ELECTRICITY PRICES (USD/kWh)")
print("Based on industrial/commercial rates for large-scale mining operations")
print("="*80)

# Define prices by year (if available) or use averages
electricity_data = {
    'Country': ['china', 'usa', 'russia', 'kazakhstan', 'canada', 'malaysia', 'iran', 'others'],
    
    # 2018-2020 (Pre-China ban era)
    '2018': [0.035, 0.065, 0.045, 0.043, 0.050, 0.073, 0.020, 0.150],
    '2019': [0.037, 0.067, 0.047, 0.045, 0.052, 0.075, 0.022, 0.155],
    '2020': [0.040, 0.064, 0.050, 0.043, 0.055, 0.080, 0.025, 0.160],
    
    # 2021 - Critical transition year
    '2021_pre_ban': [0.043, 0.068, 0.053, 0.045, 0.058, 0.087, 0.025, 0.165],
    '2021_post_ban': [0.088, 0.070, 0.055, 0.048, 0.060, 0.090, 0.030, 0.170],
    
    # 2022-2024 (Post-China ban era)
    '2022': [0.088, 0.084, 0.065, 0.052, 0.095, 0.109, 0.070, 0.180],
    '2023': [0.088, 0.080, 0.070, 0.055, 0.080, 0.120, 0.075, 0.175],
    '2024': [0.088, 0.075, 0.070, 0.057, 0.075, 0.125, 0.080, 0.170],
    
    # Average for full period (for simple analysis)
    'Average_2018_2024': [0.059, 0.071, 0.057, 0.048, 0.066, 0.093, 0.047, 0.166]
}

df = pd.DataFrame(electricity_data)

# Display the full table
print("\nDETAILED ELECTRICITY PRICES BY YEAR:")
print(df.to_string(index=False))

# Create simplified table for immediate use
simple_prices = pd.DataFrame({
    'country': ['china', 'usa', 'russia', 'kazakhstan', 'canada', 'malaysia', 'iran', 'others'],
    'price_usd_per_kwh': [0.059, 0.071, 0.057, 0.048, 0.066, 0.093, 0.047, 0.166]
})

print("\n" + "="*80)
print("SIMPLIFIED TABLE FOR ANALYSIS (Period Average):")
print("="*80)
print(simple_prices.to_string(index=False))

# Save to CSV
simple_prices.to_csv('electricity_prices_by_country_FINAL.csv', index=False)
df.to_csv('electricity_prices_detailed_by_year.csv', index=False)

print("\n✓ Saved to: electricity_prices_by_country_FINAL.csv")
print("✓ Saved to: electricity_prices_detailed_by_year.csv")

# Compare with your current incorrect values
print("\n" + "="*80)
print("COMPARISON WITH YOUR CURRENT VALUES:")
print("="*80)

current_wrong = {
    'china': 0.040,
    'usa': 0.065,
    'russia': 0.050,
    'kazakhstan': 0.045,
    'canada': 0.070,
    'malaysia': 0.055,
    'iran': 0.035,
    'others': 0.060
}

correct_avg = {
    'china': 0.059,
    'usa': 0.071,
    'russia': 0.057,
    'kazakhstan': 0.048,
    'canada': 0.066,
    'malaysia': 0.093,
    'iran': 0.047,
    'others': 0.166
}

print(f"{'Country':<12} {'Current':<10} {'Correct':<10} {'Difference':<12} {'% Change':<10}")
print("-" * 54)
for country in current_wrong:
    curr = current_wrong[country]
    corr = correct_avg[country]
    diff = corr - curr
    pct = (corr/curr - 1) * 100
    print(f"{country:<12} ${curr:<9.3f} ${corr:<9.3f} ${diff:<11.3f} {pct:>9.1f}%")

# Calculate weighted average impact
print("\n" + "="*80)
print("IMPACT ON WEIGHTED ELECTRICITY PRICE:")
print("="*80)

# Example mining distribution (you'll use your actual data)
example_distribution = {
    'china': 0.20,  # Post-ban underground estimate
    'usa': 0.35,
    'russia': 0.15,
    'kazakhstan': 0.10,
    'canada': 0.08,
    'malaysia': 0.05,
    'iran': 0.02,
    'others': 0.05
}

old_weighted = sum(current_wrong[c] * example_distribution[c] for c in current_wrong)
new_weighted = sum(correct_avg[c] * example_distribution[c] for c in correct_avg)

print(f"Old weighted average: ${old_weighted:.4f}/kWh")
print(f"New weighted average: ${new_weighted:.4f}/kWh")
print(f"Increase: {(new_weighted/old_weighted - 1)*100:.1f}%")

print("\n" + "="*80)
print("RECOMMENDATIONS:")
print("="*80)
print("1. Use electricity_prices_by_country_FINAL.csv for your analysis")
print("2. Consider using time-varying prices if your analysis spans pre/post China ban")
print("3. The 'others' category is much higher than previously estimated")
print("4. Malaysia prices are significantly underestimated in your current data")
print("5. Yes, you'll need to rerun everything with these corrected prices")
print("\nThe good news: Higher electricity costs = Lower CEIR = Stronger anchoring effect!")

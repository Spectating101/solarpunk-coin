#!/usr/bin/env python3
"""
Test whether CEIR's predictive power loss is due to:
1. Loss of cheap electricity (China had subsidized power)
2. Loss of geographic centralization (coordination mechanism)
3. Both factors combined

Run: python test_centralization_mechanism_fixed.py
"""

import pandas as pd
import numpy as np
import statsmodels.formula.api as smf
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')


def load_and_prepare_data():
    """Load the cleaned dataset and add necessary calculations"""
    print("Loading data...")
    
    # Load main dataset
    df = pd.read_csv('bitcoin_analysis_cleaned.csv')
    df['date'] = pd.to_datetime(df['date'])
    
    # Load mining distribution
    mining = pd.read_csv('cambridge_mining_distribution.csv')
    mining['date'] = pd.to_datetime(mining['date'])
    print("Mining columns before merge:", mining.columns.tolist())
    
    # Merge datasets
    df = df.merge(mining, on='date', how='left')
    print("Merged columns:", df.columns.tolist())
    
    # Identify and forward-fill mining share columns
    base_mining = [c for c in mining.columns if c != 'date']
    mining_cols = []
    for col in base_mining:
        if col in df.columns:
            mining_cols.append(col)
        elif f"{col}_x" in df.columns:
            mining_cols.append(f"{col}_x")
        elif f"{col}_y" in df.columns:
            mining_cols.append(f"{col}_y")
    print("Using mining_cols for ffill:", mining_cols)
    df[mining_cols] = df[mining_cols].ffill()
    return df


def calculate_concentration_metrics(df):
    """Calculate various concentration metrics"""
    print("\nCalculating concentration metrics...")
    
    # Detect share columns: only numeric 0-1 values
    num_cols = df.select_dtypes(include=[np.number]).columns
    exclude = ['log_CEIR','Returns_forward','volatility_30d','fear_greed']
    country_cols = [c for c in num_cols if c not in exclude and df[c].between(0,1).all()]
    print("Detected country share columns:", country_cols)
    
    # 1. Geographic HHI
    df['geographic_hhi'] = sum(df[c]**2 for c in country_cols)
    
    # 2. Electricity cost buckets
    df['ultra_cheap_share'] = df.get('china_y', df.get('china', 0))
    df['cheap_share'] = (df.get('china_y', df.get('china', 0)) +
                         df.get('kazakhstan_y', df.get('kazakhstan', 0)) +
                         df.get('iran_y', df.get('iran', 0)))
    
    # 3. Timezone concentration
    df['asian_timezone_share'] = (df.get('china_y', df.get('china', 0)) +
                                  df.get('kazakhstan_y', df.get('kazakhstan', 0)) +
                                  0.3 * df.get('russia_y', df.get('russia', 0)))
    
    # 4. Top 3 country concentration
    df['top3_concentration'] = df[country_cols].apply(lambda x: x.nlargest(3).sum(), axis=1)
    
    # 5. China vs Rest
    df['china_vs_rest'] = df.get('china_y', df.get('china', 0))
    return df


def test_cost_concentration(df):
    print("\n"+"="*60)
    print("TEST 1: ELECTRICITY COST CONCENTRATION")
    print("="*60)
    
    # Define high cheap electricity share
    df['high_cheap_elec'] = (df['cheap_share'] > 0.7).astype(int)
    
    # Pre-ban subset
    pre = df[df['date'] < '2021-06-21']
    # Regression: use correct variable names
    formula = 'Returns_forward ~ log_CEIR * high_cheap_elec + volatility_30d + fear_greed'
    model = smf.ols(formula, data=pre).fit(cov_type='HC1')
    print(model.summary())


def test_geographic_concentration(df):
    print("\n"+"="*60)
    print("TEST 2: GEOGRAPHIC CONCENTRATION")
    print("="*60)
    pre = df[df['date'] < '2021-06-21']
    median_hhi = pre['geographic_hhi'].median()
    df['high_concentration'] = (df['geographic_hhi'] > median_hhi).astype(int)
    formula = ('Returns_forward ~ log_CEIR + log_CEIR:geographic_hhi ' \
               '+ log_CEIR:cheap_share + volatility_30d + fear_greed')
    model = smf.ols(formula, data=pre).fit(cov_type='HC1')
    print(model.summary())

# Test 3: Non-China Cheap Electricity Periods
def test_non_china_cheap_periods(df):
    print("" + "="*60)
    print("TEST 3: NON-CHINA CHEAP ELECTRICITY PERIODS")
    print("="*60)
    # Identify kazakhstan and iran columns dynamically
    kz_col = 'kazakhstan_y' if 'kazakhstan_y' in df.columns else ('kazakhstan_x' if 'kazakhstan_x' in df.columns else None)
    ir_col = 'iran_y' if 'iran_y' in df.columns else ('iran_x' if 'iran_x' in df.columns else None)
    if kz_col and ir_col:
        post_ban_cheap = df[(df['date'] >= '2021-06-21') &
                            ((df[kz_col] > 0.10) | (df[ir_col] > 0.05))]
        if len(post_ban_cheap) > 30:
            model = smf.ols('Returns_forward ~ log_CEIR + volatility_30d + fear_greed',
                           data=post_ban_cheap).fit(cov_type='HC1')
            print(f"Post-ban cheap-electricity periods N={len(post_ban_cheap)}")
            print(model.summary())
            print("-> If still insignificant, suggests China-specific factors beyond just cheap electricity")
        else:
            print("Not enough post-ban observations for non-China cheap-electricity test.")
    else:
        print("Kazakhstan or Iran columns not found; skipping Test 3.")

# Test 4: Timezone Coordination
def test_timezone_coordination(df):
    print("" + "="*60)
    print("TEST 4: TIMEZONE COORDINATION")
    print("="*60)
    # Use dynamic columns for timezone share
    formula = 'Returns_forward ~ log_CEIR * asian_timezone_share + volatility_30d + fear_greed'
    pre = df[df['date'] < '2021-06-21']
    if 'asian_timezone_share' in df.columns:
        model = smf.ols(formula, data=pre).fit(cov_type='HC1')
        print(model.summary())
        if model.pvalues.get('log_CEIR:asian_timezone_share', 1) < 0.1:
            print("-> Timezone concentration matters, supporting coordination mechanism")
        else:
            print("-> Timezone concentration not significant.")
    else:
        print("asian_timezone_share column not found; skipping Test 4.")

# Test 5: China-Specific vs General Concentration
def test_china_specific_factors(df):
    print("" + "="*60)
    print("TEST 5: CHINA-SPECIFIC VS GENERAL CONCENTRATION")
    print("="*60)
    pre = df[df['date'] < '2021-06-21']
    formula = ('Returns_forward ~ log_CEIR + '
               'log_CEIR:china_vs_rest + '
               'log_CEIR:top3_concentration + '
               'volatility_30d + fear_greed')
    model = smf.ols(formula, data=pre).fit(cov_type='HC1')
    print(model.summary())
    print("-> Compare t-stats on china_vs_rest vs top3_concentration to infer China-specific effect.")

def generate_summary_results(df):
    """Generate summary statistics and final conclusions"""
    print("\n" + "="*80)
    print("SUMMARY RESULTS: CENTRALIZATION VS CHEAP ELECTRICITY")
    print("="*80)
    
    # Calculate correlation matrix
    concentration_vars = ['geographic_hhi', 'cheap_share', 'china_vs_rest', 
                         'asian_timezone_share']
    
    # Add electricity_cost only if it exists
    if 'electricity_cost' in df.columns:
        concentration_vars.append('electricity_cost')
    
    pre_ban = df[df['date'] < '2021-06-21']
    corr_matrix = pre_ban[concentration_vars].corr()
    
    print("\nCorrelation Matrix (Pre-Ban):")
    print(corr_matrix.round(3))
    
    # Summary statistics by period
    print("\n" + "-"*60)
    print("Key Metrics by Period:")
    print("-"*60)
    
    periods = {
        'Pre-Ban (2018-2021)': df[df['date'] < '2021-06-21'],
        'Post-Ban (2021-2025)': df[df['date'] >= '2021-06-21']
    }
    
    for period_name, period_df in periods.items():
        print(f"\n{period_name}:")
        print(f"  Geographic HHI: {period_df['geographic_hhi'].mean():.3f}")
        print(f"  Cheap Electricity Share: {period_df['cheap_share'].mean():.3f}")
        print(f"  China Share: {period_df['china_vs_rest'].mean():.3f}")
        print(f"  Asian Timezone Share: {period_df['asian_timezone_share'].mean():.3f}")
        if 'electricity_cost' in period_df.columns:
            print(f"  Avg Electricity Cost: ${period_df['electricity_cost'].mean():.4f}/kWh")
    
    # Final mechanism test
    print("\n" + "="*80)
    print("FINAL MECHANISM TEST")
    print("="*80)
    
    # Run comprehensive model with all interactions
    formula = '''forward_return_30d ~ log_ceir + 
                 log_ceir:geographic_hhi + 
                 log_ceir:cheap_share + 
                 log_ceir:china_vs_rest + 
                 log_ceir:asian_timezone_share + 
                 volatility_30d + fear_greed'''
    
    try:
        model = smf.ols(formula, data=pre_ban).fit(cov_type='HC1')
        
        # Rank importance by t-statistics
        interactions = {
            'Geographic HHI': abs(model.tvalues.get('log_ceir:geographic_hhi', 0)),
            'Cheap Electricity': abs(model.tvalues.get('log_ceir:cheap_share', 0)),
            'China Specific': abs(model.tvalues.get('log_ceir:china_vs_rest', 0)),
            'Timezone Coordination': abs(model.tvalues.get('log_ceir:asian_timezone_share', 0))
        }
        
        sorted_factors = sorted(interactions.items(), key=lambda x: x[1], reverse=True)
        
        print("\nFactor Importance Ranking (by t-statistic):")
        for i, (factor, t_stat) in enumerate(sorted_factors, 1):
            print(f"{i}. {factor}: t={t_stat:.2f}")
        
    except Exception as e:
        print(f"Full model failed (likely multicollinearity): {e}")
        print("This suggests factors are highly correlated - both matter together")
    
    print("\n" + "="*80)
    print("CONCLUSION")
    print("="*80)
    print("""
Based on the tests above, you can determine whether:

1. CHEAP ELECTRICITY was key → High cheap_share interactions significant
2. CENTRALIZATION was key → Geographic HHI/timezone interactions significant  
3. CHINA-SPECIFIC factors → China share beats general concentration
4. MULTIPLE FACTORS → Several interactions significant (most likely!)

Use these results to refine your paper's mechanism discussion.
    """)

def main():
    """Run all tests"""
    print("Testing Centralization vs Cheap Electricity Mechanism")
    print("=" * 80)
    
    # Load and prepare data
    df = load_and_prepare_data()
    df = calculate_concentration_metrics(df)
    
    # Run all tests
    test_cost_concentration(df)
    test_geographic_concentration(df)
    test_non_china_cheap_periods(df)
    test_timezone_coordination(df)
    test_china_specific_factors(df)
    generate_summary_results(df)
    
    # Save enhanced dataset
    df.to_csv('bitcoin_analysis_with_concentration_metrics.csv', index=False)
    print("\n✓ Saved enhanced dataset with concentration metrics")
    
    print("\n" + "="*80)
    print("All tests complete! Check results above to determine mechanism.")
    
if __name__ == "__main__":
    main()
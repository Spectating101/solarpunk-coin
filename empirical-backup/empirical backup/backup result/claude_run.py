#!/usr/bin/env python3
"""
CEIR (Cumulative Energy Investment Ratio) Analysis
Bitcoin Energy Cost as Fundamental Value Anchor
Complete Implementation with China Ban Natural Experiment
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import statsmodels.formula.api as smf
from statsmodels.stats.diagnostic import acorr_ljungbox
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Set style for publication-quality figures
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

class CEIRAnalysis:
    def __init__(self):
        """Initialize the CEIR analysis framework"""
        self.china_ban_date = pd.Timestamp('2021-06-01')
        self.ethereum_merge_date = pd.Timestamp('2022-09-15')
        
    def load_data(self):
        """Load and prepare all datasets"""
        print("Loading datasets...")
        
        # Load main bitcoin data
        self.bitcoin_df = pd.read_csv('bitcoin_data_ceir_corrected.csv')
        self.bitcoin_df['Date'] = pd.to_datetime(self.bitcoin_df['Date'])
        self.bitcoin_df = self.bitcoin_df.sort_values('Date').reset_index(drop=True)
        
        # Load Cambridge mining distribution
        self.mining_dist = pd.read_csv('cambridge_mining_distribution.csv')
        self.mining_dist['date'] = pd.to_datetime(self.mining_dist['date'])
        
        # Load fear & greed if not already in bitcoin_df
        if 'fear_greed' not in self.bitcoin_df.columns:
            fear_greed = pd.read_csv('fear_greed_index.csv')
            fear_greed['Date'] = pd.to_datetime(fear_greed['Date'])
            self.bitcoin_df = pd.merge(self.bitcoin_df, fear_greed, on='Date', how='left')
        
        print(f"Loaded {len(self.bitcoin_df)} days of Bitcoin data")
        print(f"Date range: {self.bitcoin_df['Date'].min()} to {self.bitcoin_df['Date'].max()}")
        
        return self.bitcoin_df
    
    def fix_ceir_calculations(self):
        """Fix CEIR calculations and create multiple versions"""
        print("\nFixing CEIR calculations...")
        
        df = self.bitcoin_df
        
        # 1. Absolute CEIR (no baseline) - Most defensible
        df['CEIR_absolute'] = df['Market_Cap'] / df['Cumulative_Energy_Cost']
        
        # 2. Rolling benchmark CEIR
        df['CEIR_MA30'] = df['CEIR_absolute'].rolling(30, min_periods=20).mean()
        df['CEIR_MA60'] = df['CEIR_absolute'].rolling(60, min_periods=30).mean()
        df['CEIR_STD30'] = df['CEIR_absolute'].rolling(30, min_periods=20).std()
        
        # 3. Relative CEIR (to moving average)
        df['CEIR_relative'] = df['CEIR_absolute'] / df['CEIR_MA30'] - 1
        
        # 4. Enhanced CEIR is already in the data
        if 'CEIR_enhanced' in df.columns:
            print("Enhanced CEIR already calculated")
        else:
            # If not, calculate it
            df['CEIR_enhanced'] = df['Market_Cap'] / (df['daily_elec_cost_enhanced'].cumsum())
        
        # 5. Create buy/sell signals
        df['CEIR_buy_signal'] = df['CEIR_absolute'] < (df['CEIR_MA30'] - 1.5 * df['CEIR_STD30'])
        df['CEIR_sell_signal'] = df['CEIR_absolute'] > (df['CEIR_MA30'] + 1.5 * df['CEIR_STD30'])
        
        # 6. Forward returns for strategy evaluation
        for days in [1, 7, 30, 60, 90, 180]:
            df[f'forward_return_{days}d'] = df['Price'].pct_change(days).shift(-days)
        
        # 7. Add China ban indicator
        df['post_china_ban'] = (df['Date'] >= self.china_ban_date).astype(int)
        
        print(f"CEIR Absolute range: {df['CEIR_absolute'].min():.2f} to {df['CEIR_absolute'].max():.2f}")
        print(f"Mean CEIR Absolute: {df['CEIR_absolute'].mean():.2f}")
        
        self.bitcoin_df = df
        return df
    
    def analyze_china_ban_impact(self):
        """Analyze the China mining ban impact on CEIR"""
        print("\n=== CHINA BAN IMPACT ANALYSIS ===")
        
        df = self.bitcoin_df
        
        # Split pre/post ban
        pre_ban = df[df['Date'] < self.china_ban_date]
        post_ban = df[df['Date'] >= self.china_ban_date]
        
        # Calculate statistics
        stats_dict = {
            'Period': ['Pre-Ban', 'Post-Ban', 'Change (%)'],
            'CEIR_absolute': [
                pre_ban['CEIR_absolute'].mean(),
                post_ban['CEIR_absolute'].mean(),
                ((post_ban['CEIR_absolute'].mean() / pre_ban['CEIR_absolute'].mean()) - 1) * 100
            ],
            'CEIR_enhanced': [
                pre_ban['CEIR_enhanced'].mean(),
                post_ban['CEIR_enhanced'].mean(),
                ((post_ban['CEIR_enhanced'].mean() / pre_ban['CEIR_enhanced'].mean()) - 1) * 100
            ],
            'Volatility_30d': [
                pre_ban['volatility_30d'].mean(),
                post_ban['volatility_30d'].mean(),
                ((post_ban['volatility_30d'].mean() / pre_ban['volatility_30d'].mean()) - 1) * 100
            ],
            'Weighted_Elec_Price': [
                pre_ban['weighted_elec_price'].mean() if 'weighted_elec_price' in pre_ban else np.nan,
                post_ban['weighted_elec_price'].mean() if 'weighted_elec_price' in post_ban else np.nan,
                np.nan
            ]
        }
        
        # Calculate percentage change for electricity price
        if not np.isnan(stats_dict['Weighted_Elec_Price'][0]):
            stats_dict['Weighted_Elec_Price'][2] = ((stats_dict['Weighted_Elec_Price'][1] / 
                                                     stats_dict['Weighted_Elec_Price'][0]) - 1) * 100
        
        stats_df = pd.DataFrame(stats_dict)
        print("\nChina Ban Impact Summary:")
        print(stats_df.to_string(index=False))
        
        # T-test for structural break
        t_stat, p_value = stats.ttest_ind(pre_ban['CEIR_enhanced'].dropna(), 
                                          post_ban['CEIR_enhanced'].dropna())
        print(f"\nT-test for CEIR_enhanced difference: t={t_stat:.3f}, p={p_value:.4f}")
        
        return stats_df
    
    def run_main_regressions(self):
        """Run the three main hypothesis tests"""
        print("\n=== MAIN REGRESSION RESULTS ===")
        
        df = self.bitcoin_df.copy()
        
        # Prepare data
        df['CEIR_squared'] = df['CEIR_absolute'] ** 2
        df['Returns_lead1'] = df['Returns'].shift(-1)
        df['elec_price_change'] = df['weighted_elec_price'].pct_change()
        
        # Add Google Trends if not present (use fear_greed as proxy if needed)
        if 'Google_Trends' not in df.columns:
            df['Google_Trends'] = df['fear_greed']
        
        # Add VIX if not present (use EPUREG as proxy)
        if 'VIX' not in df.columns:
            df['VIX'] = df['EPUREG']
        
        # H1: Energy Investment Floor
        print("\n--- H1: Energy Investment Floor (Low CEIR → Positive Returns) ---")
        model1_data = df.dropna(subset=['Returns_lead1', 'CEIR_absolute', 'Google_Trends', 'VIX'])
        
        model1 = smf.ols('Returns_lead1 ~ CEIR_absolute + CEIR_squared + Google_Trends + VIX', 
                         data=model1_data).fit()
        print(model1.summary().tables[1])
        
        # H2: Cost Pressure Effect
        print("\n--- H2: Cost Pressure Effect (Higher Electricity → Lower Returns) ---")
        model2_data = df.dropna(subset=['Returns', 'elec_price_change', 'Google_Trends', 'VIX'])
        
        model2 = smf.ols('Returns ~ elec_price_change + Google_Trends + VIX', 
                         data=model2_data).fit()
        print(model2.summary().tables[1])
        
        # H3: China Ban Structural Break
        print("\n--- H3: China Ban Structural Break ---")
        model3_data = df.dropna(subset=['CEIR_enhanced', 'post_china_ban', 'Energy_TWh_Annual'])
        
        model3 = smf.ols('CEIR_enhanced ~ post_china_ban + Energy_TWh_Annual + post_china_ban:Energy_TWh_Annual', 
                         data=model3_data).fit()
        print(model3.summary().tables[1])
        
        return model1, model2, model3
    
    def create_publication_figures(self):
        """Create publication-quality figures"""
        print("\nCreating figures...")
        
        df = self.bitcoin_df
        
        # Figure 1: CEIR Evolution and China Ban Impact
        fig, axes = plt.subplots(3, 1, figsize=(14, 12))
        
        # Panel A: Absolute CEIR with MA and bands
        ax1 = axes[0]
        ax1.plot(df['Date'], df['CEIR_absolute'], label='CEIR Absolute', alpha=0.6, linewidth=1)
        ax1.plot(df['Date'], df['CEIR_MA30'], label='30-day MA', color='red', linewidth=2)
        ax1.fill_between(df['Date'], 
                        df['CEIR_MA30'] - 1.5*df['CEIR_STD30'],
                        df['CEIR_MA30'] + 1.5*df['CEIR_STD30'], 
                        alpha=0.2, color='red', label='Buy Zone (MA ± 1.5σ)')
        ax1.axvline(x=self.china_ban_date, color='black', linestyle='--', alpha=0.7, label='China Ban')
        ax1.set_ylabel('CEIR (Absolute)')
        ax1.set_title('Panel A: Bitcoin CEIR - Market Cap per Dollar of Cumulative Energy Investment')
        ax1.legend(loc='upper left')
        ax1.grid(True, alpha=0.3)
        
        # Panel B: Enhanced CEIR (with electricity costs)
        ax2 = axes[1]
        ax2.plot(df['Date'], df['CEIR_enhanced'], label='Enhanced CEIR', color='green', alpha=0.8)
        ax2.axvline(x=self.china_ban_date, color='black', linestyle='--', alpha=0.7)
        
        # Add mining distribution if available
        if hasattr(self, 'mining_dist'):
            ax2_twin = ax2.twinx()
            china_data = self.mining_dist[['date', 'china']].set_index('date')
            china_data = china_data.reindex(df['Date'], method='ffill')
            ax2_twin.fill_between(df['Date'], 0, china_data['china']*100, 
                                 alpha=0.2, color='red', label='China Mining %')
            ax2_twin.set_ylabel('China Mining Share (%)')
            ax2_twin.set_ylim(0, 100)
        
        ax2.set_ylabel('Enhanced CEIR')
        ax2.set_title('Panel B: Enhanced CEIR with Location-Based Electricity Costs')
        ax2.grid(True, alpha=0.3)
        
        # Panel C: Electricity costs over time
        ax3 = axes[2]
        if 'weighted_elec_price' in df.columns:
            ax3.plot(df['Date'], df['weighted_elec_price'], 
                    label='Weighted Electricity Price', color='purple', linewidth=2)
            ax3.axvline(x=self.china_ban_date, color='black', linestyle='--', alpha=0.7)
            ax3.set_ylabel('Electricity Price ($/kWh)')
            ax3.set_xlabel('Date')
            ax3.set_title('Panel C: Mining Electricity Costs (Location-Weighted Average)')
            ax3.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('ceir_evolution_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # Figure 2: CEIR Trading Strategy Performance
        self.plot_trading_strategy()
        
        # Figure 3: China Ban Impact Visualization
        self.plot_china_ban_impact()
        
    def plot_trading_strategy(self):
        """Plot CEIR-based trading strategy performance"""
        df = self.bitcoin_df.copy()
        
        # Calculate strategy returns
        df['strategy_return'] = np.where(df['CEIR_buy_signal'].shift(1), df['Returns'], 0)
        df['cum_strategy'] = (1 + df['strategy_return']).cumprod()
        df['cum_buyhold'] = (1 + df['Returns']).cumprod()
        
        # Calculate Sharpe ratios
        strategy_sharpe = df['strategy_return'].mean() / df['strategy_return'].std() * np.sqrt(365)
        buyhold_sharpe = df['Returns'].mean() / df['Returns'].std() * np.sqrt(365)
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
        
        # Cumulative returns
        ax1.plot(df['Date'], df['cum_strategy'], label=f'CEIR Strategy (Sharpe: {strategy_sharpe:.2f})', 
                linewidth=2, color='green')
        ax1.plot(df['Date'], df['cum_buyhold'], label=f'Buy & Hold (Sharpe: {buyhold_sharpe:.2f})', 
                linewidth=2, color='blue')
        ax1.axvline(x=self.china_ban_date, color='red', linestyle='--', alpha=0.7, label='China Ban')
        ax1.set_ylabel('Cumulative Return')
        ax1.set_title('CEIR Trading Strategy vs Buy & Hold')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        ax1.set_yscale('log')
        
        # Buy signals on price
        ax2.plot(df['Date'], df['Price'], alpha=0.5, color='black', linewidth=1)
        buy_signals = df[df['CEIR_buy_signal']]
        ax2.scatter(buy_signals['Date'], buy_signals['Price'], 
                   color='green', alpha=0.7, s=30, label=f'Buy Signals (n={len(buy_signals)})')
        ax2.axvline(x=self.china_ban_date, color='red', linestyle='--', alpha=0.7)
        ax2.set_ylabel('Bitcoin Price ($)')
        ax2.set_xlabel('Date')
        ax2.set_title('CEIR Buy Signals')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        ax2.set_yscale('log')
        
        plt.tight_layout()
        plt.savefig('ceir_trading_strategy.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # Print strategy statistics
        print("\n=== TRADING STRATEGY PERFORMANCE ===")
        print(f"Total Return - Strategy: {(df['cum_strategy'].iloc[-1]-1)*100:.1f}%")
        print(f"Total Return - Buy & Hold: {(df['cum_buyhold'].iloc[-1]-1)*100:.1f}%")
        print(f"Sharpe Ratio - Strategy: {strategy_sharpe:.3f}")
        print(f"Sharpe Ratio - Buy & Hold: {buyhold_sharpe:.3f}")
        print(f"Number of Buy Signals: {df['CEIR_buy_signal'].sum()}")
        
    def plot_china_ban_impact(self):
        """Visualize China ban impact on CEIR distribution"""
        df = self.bitcoin_df
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        # Pre vs Post distributions
        pre_ban = df[df['Date'] < self.china_ban_date]['CEIR_enhanced'].dropna()
        post_ban = df[df['Date'] >= self.china_ban_date]['CEIR_enhanced'].dropna()
        
        # Distribution plot
        ax1 = axes[0, 0]
        ax1.hist(pre_ban, bins=50, alpha=0.6, label=f'Pre-Ban (μ={pre_ban.mean():.1f})', 
                density=True, color='blue')
        ax1.hist(post_ban, bins=50, alpha=0.6, label=f'Post-Ban (μ={post_ban.mean():.1f})', 
                density=True, color='red')
        ax1.set_xlabel('Enhanced CEIR')
        ax1.set_ylabel('Density')
        ax1.set_title('CEIR Distribution: Pre vs Post China Ban')
        ax1.legend()
        
        # Time series with rolling stats
        ax2 = axes[0, 1]
        rolling_mean = df['CEIR_enhanced'].rolling(90).mean()
        rolling_std = df['CEIR_enhanced'].rolling(90).std()
        
        ax2.plot(df['Date'], rolling_mean, label='90-day Mean', linewidth=2)
        ax2.fill_between(df['Date'], rolling_mean - rolling_std, rolling_mean + rolling_std, 
                        alpha=0.2, label='±1 Std Dev')
        ax2.axvline(x=self.china_ban_date, color='red', linestyle='--', alpha=0.7, label='China Ban')
        ax2.set_ylabel('Enhanced CEIR (90-day MA)')
        ax2.set_title('CEIR Regime Change')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Scatter: CEIR vs Volatility
        ax3 = axes[1, 0]
        pre_ban_df = df[df['Date'] < self.china_ban_date]
        post_ban_df = df[df['Date'] >= self.china_ban_date]
        
        ax3.scatter(pre_ban_df['CEIR_enhanced'], pre_ban_df['volatility_30d'], 
                   alpha=0.5, label='Pre-Ban', s=20)
        ax3.scatter(post_ban_df['CEIR_enhanced'], post_ban_df['volatility_30d'], 
                   alpha=0.5, label='Post-Ban', s=20)
        ax3.set_xlabel('Enhanced CEIR')
        ax3.set_ylabel('30-day Volatility')
        ax3.set_title('CEIR vs Volatility Relationship')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # Mining geography impact
        ax4 = axes[1, 1]
        if hasattr(self, 'mining_dist'):
            # Calculate average distribution pre/post ban
            pre_ban_mining = self.mining_dist[self.mining_dist['date'] < self.china_ban_date].mean()
            post_ban_mining = self.mining_dist[self.mining_dist['date'] >= self.china_ban_date].mean()
            
            countries = ['china', 'usa', 'kazakhstan', 'russia', 'canada']
            pre_values = [pre_ban_mining[c] for c in countries if c in pre_ban_mining]
            post_values = [post_ban_mining[c] for c in countries if c in post_ban_mining]
            
            x = np.arange(len(countries))
            width = 0.35
            
            ax4.bar(x - width/2, pre_values, width, label='Pre-Ban', alpha=0.8)
            ax4.bar(x + width/2, post_values, width, label='Post-Ban', alpha=0.8)
            ax4.set_xlabel('Country')
            ax4.set_ylabel('Mining Share')
            ax4.set_title('Mining Distribution Change')
            ax4.set_xticks(x)
            ax4.set_xticklabels([c.capitalize() for c in countries])
            ax4.legend()
        
        plt.tight_layout()
        plt.savefig('china_ban_impact_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def run_robustness_checks(self):
        """Run robustness checks"""
        print("\n=== ROBUSTNESS CHECKS ===")
        
        df = self.bitcoin_df.copy()
        
        # 1. Alternative CEIR windows
        print("\n1. Alternative CEIR Windows:")
        for window in [14, 30, 60]:
            df[f'CEIR_MA{window}'] = df['CEIR_absolute'].rolling(window).mean()
            df[f'CEIR_signal_{window}'] = df['CEIR_absolute'] < (df[f'CEIR_MA{window}'] - 
                                                                  1.5 * df['CEIR_absolute'].rolling(window).std())
            
            # Test performance
            df[f'strategy_{window}'] = np.where(df[f'CEIR_signal_{window}'].shift(1), 
                                               df['Returns'], 0)
            sharpe = df[f'strategy_{window}'].mean() / df[f'strategy_{window}'].std() * np.sqrt(365)
            print(f"  {window}-day MA Sharpe: {sharpe:.3f}")
        
        # 2. Subsample analysis
        print("\n2. Subsample Analysis:")
        subsamples = {
            'Pre-China Ban': df[df['Date'] < self.china_ban_date],
            'Post-China Ban': df[df['Date'] >= self.china_ban_date],
            'Bull Market': df[df['Price'] > df['Price'].rolling(200).mean()],
            'Bear Market': df[df['Price'] <= df['Price'].rolling(200).mean()]
        }
        
        for name, subsample in subsamples.items():
            if len(subsample) > 100:
                model = smf.ols('forward_return_30d ~ CEIR_absolute + Google_Trends + VIX', 
                              data=subsample.dropna()).fit()
                ceir_coef = model.params['CEIR_absolute']
                ceir_pval = model.pvalues['CEIR_absolute']
                print(f"  {name}: CEIR coef={ceir_coef:.4f}, p={ceir_pval:.3f}")
        
        # 3. Out-of-sample test
        print("\n3. Out-of-Sample Test:")
        train_end = '2023-12-31'
        train_data = df[df['Date'] <= train_end]
        test_data = df[df['Date'] > train_end]
        
        if len(test_data) > 30:
            # Train model
            train_model = smf.ols('forward_return_30d ~ CEIR_absolute + Google_Trends + VIX', 
                                data=train_data.dropna()).fit()
            
            # Predict on test set
            test_data = test_data.dropna(subset=['CEIR_absolute', 'Google_Trends', 'VIX'])
            test_data['predicted_return'] = train_model.predict(test_data)
            
            # Calculate accuracy
            test_data['actual_direction'] = (test_data['forward_return_30d'] > 0).astype(int)
            test_data['predicted_direction'] = (test_data['predicted_return'] > 0).astype(int)
            accuracy = (test_data['actual_direction'] == test_data['predicted_direction']).mean()
            
            print(f"  Out-of-sample directional accuracy: {accuracy:.1%}")
            print(f"  Test period: {test_data['Date'].min()} to {test_data['Date'].max()}")
    
    def generate_summary_tables(self):
        """Generate summary statistics tables"""
        df = self.bitcoin_df
        
        # Table 1: Descriptive Statistics
        variables = ['Price', 'Market_Cap', 'CEIR_absolute', 'CEIR_enhanced', 
                    'volatility_30d', 'weighted_elec_price', 'Energy_TWh_Annual']
        
        desc_stats = pd.DataFrame()
        for var in variables:
            if var in df.columns:
                desc_stats[var] = [
                    df[var].count(),
                    df[var].mean(),
                    df[var].std(),
                    df[var].min(),
                    df[var].quantile(0.25),
                    df[var].median(),
                    df[var].quantile(0.75),
                    df[var].max()
                ]
        
        desc_stats.index = ['N', 'Mean', 'Std Dev', 'Min', '25%', 'Median', '75%', 'Max']
        
        print("\n=== DESCRIPTIVE STATISTICS ===")
        print(desc_stats.round(2).to_string())
        
        # Save to CSV
        desc_stats.to_csv('ceir_descriptive_stats.csv')
        
        return desc_stats
    
    def run_complete_analysis(self):
        """Run the complete analysis pipeline"""
        print("="*60)
        print("CEIR BITCOIN ENERGY ANALYSIS")
        print("="*60)
        
        # 1. Load data
        self.load_data()
        
        # 2. Fix CEIR calculations
        self.fix_ceir_calculations()
        
        # 3. Analyze China ban impact
        china_ban_stats = self.analyze_china_ban_impact()
        
        # 4. Run main regressions
        models = self.run_main_regressions()
        
        # 5. Create figures
        self.create_publication_figures()
        
        # 6. Run robustness checks
        self.run_robustness_checks()
        
        # 7. Generate summary tables
        summary_stats = self.generate_summary_tables()
        
        print("\n" + "="*60)
        print("ANALYSIS COMPLETE!")
        print("="*60)
        
        return {
            'bitcoin_df': self.bitcoin_df,
            'china_ban_stats': china_ban_stats,
            'models': models,
            'summary_stats': summary_stats
        }

# Main execution
if __name__ == "__main__":
    analyzer = CEIRAnalysis()
    results = analyzer.run_complete_analysis()
    
    # Save enhanced dataset
    results['bitcoin_df'].to_csv('bitcoin_ceir_final_analysis.csv', index=False)
    print("\nFinal dataset saved to: bitcoin_ceir_final_analysis.csv")

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import statsmodels.formula.api as smf
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class BitcoinEnergyAnalysis:
    def __init__(self):
        self.df = None
        self.results = {}
        
    def load_data(self):
        """Load and prepare the dataset"""
        # Load the data - using the fixed merged file
        self.df = pd.read_csv('bitcoin_complete_fixed_merged.csv')
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.df = self.df.sort_values('Date').reset_index(drop=True)
        
        # Print column names to debug
        print("Available columns:")
        print(self.df.columns.tolist())
        
        # Check for missing values
        print("\nMissing values per column:")
        print(self.df.isnull().sum())
        
        # Basic data info
        print(f"\nLoaded {len(self.df)} days of Bitcoin data")
        print(f"Date range: {self.df['Date'].min()} to {self.df['Date'].max()}")
        
        return self.df
    
    def calculate_ceir_metrics(self):
        """Calculate CEIR metrics correctly"""
        # Ensure we have the cumulative columns
        if 'Cumulative_BTC_Mined' not in self.df.columns:
            # Calculate cumulative BTC if not present
            daily_btc = 900  # Approximate after 2020 halving
            self.df['Cumulative_BTC_Mined'] = np.arange(len(self.df)) * daily_btc + 18500000
        
        if 'cumulative_energy_investment' not in self.df.columns:
            # Use the enhanced CEIR calculation if available
            if 'enhanced_cumulative_cost_TWh' in self.df.columns:
                self.df['cumulative_energy_investment'] = self.df['enhanced_cumulative_cost_TWh']
            else:
                # Fallback: simple calculation
                self.df['cumulative_energy_investment'] = self.df['Energy_TWh_Annual'].cumsum()
        
        # Calculate CEIR absolute (no baseline subtraction)
        self.df['CEIR_absolute'] = self.df['Market_Cap'] / (self.df['cumulative_energy_investment'] + 1e-10)
        
        # Calculate enhanced CEIR if we have the data
        if 'CEIR_enhanced' not in self.df.columns and 'enhanced_cumulative_cost_TWh' in self.df.columns:
            self.df['CEIR_enhanced'] = self.df['Market_Cap'] / (self.df['enhanced_cumulative_cost_TWh'] + 1e-10)
        
        # Print CEIR statistics
        print(f"\nCEIR Absolute range: {self.df['CEIR_absolute'].min():.2f} to {self.df['CEIR_absolute'].max():.2f}")
        print(f"Mean CEIR Absolute: {self.df['CEIR_absolute'].mean():.2f}")
        
        return self.df
    
    def fix_column_names(self):
        """Fix column naming issues for regression"""
        # Create VIX proxy if not available
        if 'VIX' not in self.df.columns:
            # We have volatility_30d in the data already!
            if 'volatility_30d' in self.df.columns:
                self.df['VIX'] = self.df['volatility_30d']
                print("Using volatility_30d as VIX proxy")
            elif 'Volatility_30d' in self.df.columns:
                self.df['VIX'] = self.df['Volatility_30d']
                print("Using Volatility_30d as VIX proxy")
        
        # Ensure we have Google_Trends
        if 'Google_Trends' not in self.df.columns:
            # Use Fear and Greed Index which is in the data
            if 'fear_greed' in self.df.columns:
                self.df['Google_Trends'] = self.df['fear_greed']
                print("Using fear_greed as Google_Trends proxy")
        
        return self.df
    
    def analyze_china_ban(self):
        """Analyze the China ban impact"""
        china_ban_date = pd.to_datetime('2021-06-01')
        
        self.df['post_china_ban'] = (self.df['Date'] > china_ban_date).astype(int)
        
        # Compare metrics before and after
        pre_ban = self.df[self.df['post_china_ban'] == 0]
        post_ban = self.df[self.df['post_china_ban'] == 1]
        
        # Compare metrics before and after
        metrics = ['CEIR_absolute', 'CEIR_enhanced', 'volatility_30d', 'weighted_elec_price']
        
        comparison_data = []
        for metric in metrics:
            if metric in self.df.columns:
                pre_mean = pre_ban[metric].mean()
                post_mean = post_ban[metric].mean()
                pct_change = ((post_mean - pre_mean) / pre_mean) * 100
                comparison_data.append({
                    'Metric': metric,
                    'Pre-Ban': pre_mean,
                    'Post-Ban': post_mean,
                    'Change (%)': pct_change
                })
        
        comparison_df = pd.DataFrame(comparison_data)
        print("\n=== CHINA BAN IMPACT ANALYSIS ===")
        print("\nChina Ban Impact Summary:")
        print(comparison_df.to_string(index=False))
        
        # Statistical test
        if 'CEIR_enhanced' in self.df.columns:
            t_stat, p_value = stats.ttest_ind(
                pre_ban['CEIR_enhanced'].dropna(), 
                post_ban['CEIR_enhanced'].dropna()
            )
            print(f"\nT-test for CEIR_enhanced difference: t={t_stat:.3f}, p={p_value:.4f}")
        
        self.results['china_ban_comparison'] = comparison_df
        
        return comparison_df
    
    def run_regressions(self):
        """Run the main regression analyses"""
        print("\n=== MAIN REGRESSION RESULTS ===")
        
        # Prepare data
        reg_data = self.df.copy()
        
        # Ensure all needed columns exist
        self.fix_column_names()
        
        # Calculate forward returns
        reg_data['forward_return_30d'] = reg_data['Price'].pct_change(30).shift(-30)
        
        # Create squared term
        reg_data['CEIR_squared'] = reg_data['CEIR_absolute'] ** 2
        
        # Drop NaN values for regression
        reg_data_clean = reg_data.dropna(subset=['forward_return_30d', 'CEIR_absolute', 'Google_Trends', 'VIX'])
        
        # H1: Energy Investment Floor
        print("\n--- H1: Energy Investment Floor (Low CEIR → Positive Returns) ---")
        try:
            model1 = smf.ols('forward_return_30d ~ CEIR_absolute + CEIR_squared + Google_Trends + VIX', 
                            data=reg_data_clean).fit()
            print(model1.summary().tables[1])
            self.results['h1_model'] = model1
        except Exception as e:
            print(f"Error in H1 regression: {e}")
        
        # H2: Cost Pressure Effect
        print("\n--- H2: Cost Pressure Effect (Higher Electricity → Lower Returns) ---")
        if 'Weighted_Elec_Price' in reg_data.columns:
            reg_data['elec_price_change'] = reg_data['Weighted_Elec_Price'].pct_change()
            try:
                model2 = smf.ols('forward_return_30d ~ elec_price_change + Google_Trends + VIX', 
                                data=reg_data.dropna()).fit()
                print(model2.summary().tables[1])
                self.results['h2_model'] = model2
            except Exception as e:
                print(f"Error in H2 regression: {e}")
        
        # H3: China Ban Structural Break
        print("\n--- H3: China Ban Structural Break ---")
        try:
            model3 = smf.ols('CEIR_enhanced ~ post_china_ban * Energy_TWh_Annual', 
                            data=reg_data.dropna()).fit()
            print(model3.summary().tables[1])
            self.results['h3_model'] = model3
        except Exception as e:
            print(f"Error in H3 regression: {e}")
    
    def create_visualizations(self):
        """Create the main visualizations"""
        print("\nCreating figures...")
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # 1. CEIR Distribution Pre/Post China Ban
        ax1 = axes[0, 0]
        if 'CEIR_enhanced' in self.df.columns:
            pre_ban = self.df[self.df['post_china_ban'] == 0]['CEIR_enhanced'].dropna()
            post_ban = self.df[self.df['post_china_ban'] == 1]['CEIR_enhanced'].dropna()
            
            ax1.hist(pre_ban, bins=50, alpha=0.7, label=f'Pre-Ban (μ={pre_ban.mean():.1f})', color='blue')
            ax1.hist(post_ban, bins=50, alpha=0.7, label=f'Post-Ban (μ={post_ban.mean():.1f})', color='red')
            ax1.set_xlabel('Enhanced CEIR')
            ax1.set_ylabel('Density')
            ax1.set_title('CEIR Distribution: Pre vs Post China Ban')
            ax1.legend()
        
        # 2. CEIR Time Series
        ax2 = axes[0, 1]
        ax2.plot(self.df['Date'], self.df['CEIR_enhanced'].rolling(90).mean(), 
                label='90-day Mean', color='red', linewidth=2)
        ax2.fill_between(self.df['Date'], 
                        self.df['CEIR_enhanced'].rolling(90).mean() - self.df['CEIR_enhanced'].rolling(90).std(),
                        self.df['CEIR_enhanced'].rolling(90).mean() + self.df['CEIR_enhanced'].rolling(90).std(),
                        alpha=0.3, color='red', label='±1 Std Dev')
        ax2.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', label='China Ban')
        ax2.set_xlabel('Date')
        ax2.set_ylabel('Enhanced CEIR (90-day MA)')
        ax2.set_title('CEIR Regime Change')
        ax2.legend()
        
        # 3. CEIR vs Volatility
        ax3 = axes[1, 0]
        colors = ['red' if x == 0 else 'darkgoldenrod' for x in self.df['post_china_ban']]
        scatter = ax3.scatter(self.df['CEIR_enhanced'], self.df['volatility_30d'], 
                            c=colors, alpha=0.6, s=20)
        ax3.set_xlabel('Enhanced CEIR')
        ax3.set_ylabel('30-day Volatility')
        ax3.set_title('CEIR vs Volatility Relationship')
        ax3.legend(['Pre-Ban', 'Post-Ban'])
        
        # 4. Mining Distribution Change
        ax4 = axes[1, 1]
        # Check if we have mining distribution data
        china_cols = [col for col in self.df.columns if 'china' in col.lower() or 'China' in col]
        if china_cols:
            print(f"Found China-related columns: {china_cols}")
        
        # For now, create a simple before/after comparison
        ax4.text(0.5, 0.5, 'Mining Distribution Data\nNot Available in Main Dataset', 
                ha='center', va='center', transform=ax4.transAxes)
        ax4.set_title('Mining Distribution Change')
        
        plt.tight_layout()
        plt.savefig('china_ban_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def implement_trading_strategy(self):
        """Implement CEIR-based trading strategy"""
        print("\n=== TRADING STRATEGY PERFORMANCE ===")
        
        # Calculate buy signals
        ceir_mean = self.df['CEIR_absolute'].rolling(window=180).mean()
        ceir_std = self.df['CEIR_absolute'].rolling(window=180).std()
        
        # Buy when CEIR < Mean - 1.5*Std
        self.df['CEIR_buy_signal'] = (self.df['CEIR_absolute'] < (ceir_mean - 1.5 * ceir_std))
        
        # Calculate returns
        self.df['strategy_return'] = self.df['Returns'] * self.df['CEIR_buy_signal'].shift(1)
        self.df['strategy_return'] = self.df['strategy_return'].fillna(0)
        
        # Cumulative returns (fixed calculation)
        self.df['cum_strategy'] = (1 + self.df['strategy_return']).cumprod()
        self.df['cum_buyhold'] = (1 + self.df['Returns'].fillna(0)).cumprod()
        
        # Performance metrics
        total_return_strategy = (self.df['cum_strategy'].iloc[-1] - 1) * 100
        total_return_buyhold = (self.df['cum_buyhold'].iloc[-1] - 1) * 100
        
        # Sharpe ratios
        sharpe_strategy = (self.df['strategy_return'].mean() / self.df['strategy_return'].std()) * np.sqrt(365)
        sharpe_buyhold = (self.df['Returns'].mean() / self.df['Returns'].std()) * np.sqrt(365)
        
        print(f"Total Return - Strategy: {total_return_strategy:.1f}%")
        print(f"Total Return - Buy & Hold: {total_return_buyhold:.1f}%")
        print(f"Sharpe Ratio - Strategy: {sharpe_strategy:.3f}")
        print(f"Sharpe Ratio - Buy & Hold: {sharpe_buyhold:.3f}")
        print(f"Number of Buy Signals: {self.df['CEIR_buy_signal'].sum()}")
        
        # Visualization
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), height_ratios=[1, 2])
        
        # Buy signals
        buy_dates = self.df[self.df['CEIR_buy_signal']]['Date']
        for date in buy_dates:
            ax1.axvline(date, color='green', alpha=0.7, linewidth=1)
        ax1.set_xlim(self.df['Date'].min(), self.df['Date'].max())
        ax1.set_ylabel('CEIR Buy Signals')
        ax1.set_title('CEIR Trading Strategy vs Buy & Hold')
        
        # Cumulative returns
        ax2.plot(self.df['Date'], self.df['cum_strategy'], label=f'CEIR Strategy (Sharpe: {sharpe_strategy:.2f})', linewidth=2)
        ax2.plot(self.df['Date'], self.df['cum_buyhold'], label=f'Buy & Hold (Sharpe: {sharpe_buyhold:.2f})', linewidth=2)
        ax2.axvline(pd.to_datetime('2021-06-01'), color='red', linestyle='--', alpha=0.7, label='China Ban')
        ax2.set_ylabel('Cumulative Return')
        ax2.set_xlabel('Date')
        ax2.set_yscale('log')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Add buy signal scatter points
        buy_points = self.df[self.df['CEIR_buy_signal']]
        ax2.scatter(buy_points['Date'], buy_points['Price'], color='green', s=50, alpha=0.8, 
                   label=f'Buy Signals (n={len(buy_points)})', zorder=5)
        
        plt.tight_layout()
        plt.savefig('trading_strategy_performance.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        self.results['strategy_performance'] = {
            'total_return_strategy': total_return_strategy,
            'total_return_buyhold': total_return_buyhold,
            'sharpe_strategy': sharpe_strategy,
            'sharpe_buyhold': sharpe_buyhold,
            'num_signals': self.df['CEIR_buy_signal'].sum()
        }
    
    def run_robustness_checks(self):
        """Run robustness checks"""
        print("\n=== ROBUSTNESS CHECKS ===")
        
        # 1. Alternative CEIR windows
        print("\n1. Alternative CEIR Windows:")
        windows = [14, 30, 60]
        for window in windows:
            ceir_mean = self.df['CEIR_absolute'].rolling(window=window).mean()
            ceir_std = self.df['CEIR_absolute'].rolling(window=window).std()
            buy_signal = (self.df['CEIR_absolute'] < (ceir_mean - 1.5 * ceir_std))
            
            strategy_returns = self.df['Returns'] * buy_signal.shift(1)
            sharpe = (strategy_returns.mean() / strategy_returns.std()) * np.sqrt(365)
            print(f"  {window}-day MA Sharpe: {sharpe:.3f}")
        
        # 2. Subsample analysis
        print("\n2. Subsample Analysis:")
        try:
            # Pre-COVID
            pre_covid = self.df[self.df['Date'] < '2020-03-01'].copy()
            if len(pre_covid) > 100:
                # Make sure columns exist in subsample
                pre_covid = self.fix_column_names_for_subsample(pre_covid)
                pre_covid['forward_return_30d'] = pre_covid['Price'].pct_change(30).shift(-30)
                
                model = smf.ols('forward_return_30d ~ CEIR_absolute + Google_Trends + VIX', 
                              data=pre_covid.dropna()).fit()
                print(f"  Pre-COVID CEIR coefficient: {model.params['CEIR_absolute']:.4f} (p={model.pvalues['CEIR_absolute']:.3f})")
        except Exception as e:
            print(f"  Pre-COVID analysis error: {e}")
        
        try:
            # Post-COVID
            post_covid = self.df[self.df['Date'] >= '2020-03-01'].copy()
            if len(post_covid) > 100:
                post_covid = self.fix_column_names_for_subsample(post_covid)
                post_covid['forward_return_30d'] = post_covid['Price'].pct_change(30).shift(-30)
                
                model = smf.ols('forward_return_30d ~ CEIR_absolute + Google_Trends + VIX', 
                              data=post_covid.dropna()).fit()
                print(f"  Post-COVID CEIR coefficient: {model.params['CEIR_absolute']:.4f} (p={model.pvalues['CEIR_absolute']:.3f})")
        except Exception as e:
            print(f"  Post-COVID analysis error: {e}")
    
    def fix_column_names_for_subsample(self, df_subset):
        """Fix column names for subsample analysis"""
        # Copy the main dataframe's column fixes
        if 'VIX' not in df_subset.columns:
            if 'Volatility_30d' in df_subset.columns:
                df_subset['VIX'] = df_subset['Volatility_30d']
            else:
                df_subset['VIX'] = df_subset['Returns'].rolling(30).std() * np.sqrt(365) * 100
        
        if 'Google_Trends' not in df_subset.columns:
            if 'Fear_Greed_Index' in df_subset.columns:
                df_subset['Google_Trends'] = df_subset['Fear_Greed_Index']
            else:
                df_subset['Google_Trends'] = 50
        
        return df_subset
    
    def create_comprehensive_visualization(self):
        """Create a comprehensive visualization panel"""
        fig = plt.figure(figsize=(16, 10))
        
        # Define grid
        gs = fig.add_gridspec(3, 2, height_ratios=[1.5, 1, 1], hspace=0.3, wspace=0.3)
        
        # Panel A: CEIR time series
        ax1 = fig.add_subplot(gs[0, :])
        ax1.plot(self.df['Date'], self.df['CEIR_absolute'], alpha=0.3, color='gray', label='CEIR Absolute')
        ax1.plot(self.df['Date'], self.df['CEIR_absolute'].rolling(30).mean(), 'r-', linewidth=2, label='30-day MA')
        
        # Add buy zones
        ceir_mean = self.df['CEIR_absolute'].rolling(180).mean()
        ceir_std = self.df['CEIR_absolute'].rolling(180).std()
        ax1.fill_between(self.df['Date'], 0, ceir_mean - 1.5*ceir_std, 
                        where=(self.df['CEIR_absolute'] < ceir_mean - 1.5*ceir_std),
                        alpha=0.3, color='green', label='Buy Zone (MA ± 1.5σ)')
        
        ax1.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7, label='China Ban')
        ax1.set_ylabel('CEIR (Absolute)')
        ax1.set_title('Panel A: Bitcoin CEIR - Market Cap per Dollar of Cumulative Energy Investment')
        ax1.legend(loc='upper right')
        ax1.set_xlim(self.df['Date'].min(), self.df['Date'].max())
        
        # Panel B: Enhanced CEIR with China mining share
        ax2 = fig.add_subplot(gs[1, :])
        ax2_twin = ax2.twinx()
        
        if 'CEIR_enhanced' in self.df.columns:
            ax2.plot(self.df['Date'], self.df['CEIR_enhanced'], 'b-', linewidth=2, label='Enhanced CEIR')
            ax2.set_ylabel('Enhanced CEIR', color='b')
            ax2.tick_params(axis='y', labelcolor='b')
        
        if 'China_Share' in self.df.columns:
            ax2_twin.fill_between(self.df['Date'], 0, self.df['China_Share']*100, 
                                 alpha=0.3, color='red', label='China Mining Share (%)')
            ax2_twin.set_ylabel('China Mining Share (%)', color='r')
            ax2_twin.tick_params(axis='y', labelcolor='r')
        
        ax2.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7)
        ax2.set_title('Panel B: Enhanced CEIR with Location-Based Electricity Costs')
        
        # Panel C: Electricity prices
        ax3 = fig.add_subplot(gs[2, 0])
        if 'Weighted_Elec_Price' in self.df.columns:
            ax3.plot(self.df['Date'], self.df['Weighted_Elec_Price'], 'm-', linewidth=2)
            ax3.set_ylabel('Electricity Price ($/kWh)')
            ax3.set_title('Panel C: Mining Electricity Costs (Location-Weighted Average)')
            ax3.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7)
        
        # Panel D: Price with buy signals
        ax4 = fig.add_subplot(gs[2, 1])
        ax4.plot(self.df['Date'], self.df['Price'], 'k-', alpha=0.7, linewidth=1)
        
        # Highlight buy signals
        buy_signals = self.df[self.df['CEIR_buy_signal']]
        ax4.scatter(buy_signals['Date'], buy_signals['Price'], color='green', s=50, alpha=0.8, zorder=5)
        
        ax4.set_ylabel('Bitcoin Price ($)')
        ax4.set_yscale('log')
        ax4.set_title('Panel D: Bitcoin Price with CEIR Buy Signals')
        ax4.axvline(pd.to_datetime('2021-06-01'), color='black', linestyle='--', alpha=0.7)
        
        plt.suptitle('Bitcoin Energy Investment Analysis: CEIR Metrics and China Ban Impact', fontsize=16)
        plt.tight_layout()
        plt.savefig('comprehensive_ceir_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def run_complete_analysis(self):
        """Run the complete analysis pipeline"""
        # Load and prepare data
        self.load_data()
        self.calculate_ceir_metrics()
        self.fix_column_names()
        
        # Core analyses
        self.analyze_china_ban()
        self.run_regressions()
        
        # Visualizations and strategy
        self.create_visualizations()
        self.implement_trading_strategy()
        self.run_robustness_checks()
        self.create_comprehensive_visualization()
        
        return self.results

# Run the analysis
if __name__ == "__main__":
    analyzer = BitcoinEnergyAnalysis()
    results = analyzer.run_complete_analysis()
    
    print("\n=== ANALYSIS COMPLETE ===")
    print("Results saved in 'results' dictionary")
    print("Figures saved as PNG files")

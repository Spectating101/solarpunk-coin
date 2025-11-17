"""
Data Loader for Energy Derivatives
===================================

Loads and processes empirical CEIR data to derive realistic underlying prices
for derivative pricing models.

Key Functions:
-----------
load_ceir_data(): Load Bitcoin CEIR from empirical folder
compute_energy_price(): Derive energy unit prices from CEIR
estimate_volatility(): Estimate volatility from historical prices
load_parameters(): Load all parameters for derivative pricing
"""

import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional
import warnings
import os


def load_ceir_data(data_dir: str = '../empirical') -> pd.DataFrame:
    """
    Load CEIR data from empirical folder.
    
    Parameters
    ----------
    data_dir : str
        Path to empirical data directory
        
    Returns
    -------
    pd.DataFrame
        DataFrame with Date, Price, Energy_TWh_Annual, Market_Cap, CEIR
    """
    
    # Try to find files in empirical folder
    if not os.path.exists(data_dir):
        warnings.warn(f"Data directory {data_dir} not found, using synthetic data")
        return _generate_synthetic_ceir_data()
    
    try:
        # Load Bitcoin price data
        btc_data_candidates = [
            'bitcoin_ceir_final.csv',
            'bitcoin_ceir_complete.csv',
            'btc_ds_parsed.csv'
        ]
        
        btc_file = None
        for candidate in btc_data_candidates:
            path = os.path.join(data_dir, candidate)
            if os.path.exists(path):
                btc_file = path
                break
        
        if btc_file is None:
            warnings.warn("No Bitcoin price file found, using synthetic data")
            return _generate_synthetic_ceir_data()
        
        df = pd.read_csv(btc_file)

        # Ensure Date column
        if 'Date' not in df.columns:
            if 'Exchange Date' in df.columns:
                df['Date'] = pd.to_datetime(df['Exchange Date'])
            else:
                df['Date'] = pd.date_range(start='2018-01-01', periods=len(df))
        else:
            df['Date'] = pd.to_datetime(df['Date'])

        # Ensure Price column
        if 'Price' not in df.columns:
            if 'Open' in df.columns:
                df['Price'] = df['Open']
            elif 'Close' in df.columns:
                df['Price'] = df['Close']

        # Load energy data if needed (only if not already present)
        if 'Energy_TWh_Annual' not in df.columns:
            energy_file = os.path.join(data_dir, 'btc_con.csv')
            if os.path.exists(energy_file):
                energy_df = pd.read_csv(energy_file)
                energy_df['DateTime'] = pd.to_datetime(energy_df['DateTime'])
                energy_df['Date_merge'] = energy_df['DateTime'].dt.date
                energy_df = energy_df.rename(columns={'Estimated TWh per Year': 'Energy_TWh_Annual'})

                df['Date_only'] = df['Date'].dt.date
                df = df.merge(energy_df[['Date_merge', 'Energy_TWh_Annual']].drop_duplicates('Date_merge', keep='first'),
                             left_on='Date_only', right_on='Date_merge', how='left')
                df = df.drop(['Date_only', 'Date_merge'], axis=1)

        # Compute market cap if not present
        if 'Market_Cap' not in df.columns:
            # Approximate Bitcoin supply curve
            days_since_start = (df['Date'] - df['Date'].min()).dt.days
            df['Supply'] = 21e6 - (21e6 - 17e6) * np.exp(-0.693 * days_since_start / (4 * 365))
            df['Market_Cap'] = df['Price'] * df['Supply']

        # Compute CEIR if not present
        if 'CEIR' not in df.columns and 'Energy_TWh_Annual' in df.columns:
            df = compute_ceir_column(df)

        return df.sort_values('Date').reset_index(drop=True)
    
    except Exception as e:
        warnings.warn(f"Error loading CEIR data: {e}, using synthetic data")
        return _generate_synthetic_ceir_data()


def compute_ceir_column(df: pd.DataFrame, electricity_price: float = 0.05) -> pd.DataFrame:
    """
    Compute CEIR column from price and energy data.
    
    CEIR = Market Cap / Cumulative Energy Cost
    
    Parameters
    ----------
    df : pd.DataFrame
        DataFrame with Market_Cap and Energy_TWh_Annual
    electricity_price : float
        Electricity price ($/kWh) for energy cost calculation
        
    Returns
    -------
    pd.DataFrame
        DataFrame with CEIR column added
    """
    
    # Daily energy cost
    df['Daily_Energy_TWh'] = df['Energy_TWh_Annual'] / 365
    df['Daily_Energy_Cost_USD'] = df['Daily_Energy_TWh'] * electricity_price * 1e9  # Convert TWh to kWh
    
    # Cumulative energy cost
    df['Cumulative_Energy_Cost'] = df['Daily_Energy_Cost_USD'].cumsum()
    
    # CEIR
    df['CEIR'] = df['Market_Cap'] / df['Cumulative_Energy_Cost']
    df['CEIR'] = df['CEIR'].replace([np.inf, -np.inf], np.nan).fillna(method='ffill')
    
    return df


def _generate_synthetic_ceir_data(n_days: int = 2000) -> pd.DataFrame:
    """
    Generate synthetic CEIR data for testing.
    
    Parameters
    ----------
    n_days : int
        Number of days of data
        
    Returns
    -------
    pd.DataFrame
        Synthetic CEIR dataset
    """
    
    dates = pd.date_range(start='2018-01-01', periods=n_days, freq='D')
    
    # Geometric Brownian motion for price
    returns = np.random.normal(0.0005, 0.03, n_days)
    prices = 1000 * np.exp(np.cumsum(returns))
    
    # Supply curve
    days_idx = np.arange(n_days)
    supply = 21e6 - (21e6 - 17e6) * np.exp(-0.693 * days_idx / (4 * 365))
    market_caps = prices * supply
    
    # Energy consumption (increasing)
    energy_twh = 30 + 100 * (days_idx / n_days) + 10 * np.random.normal(0, 1, n_days)
    energy_twh = np.maximum(energy_twh, 20)  # Ensure positive
    
    # CEIR
    daily_energy_cost = energy_twh / 365 * 0.05 * 1e9
    cumulative_energy_cost = np.cumsum(daily_energy_cost)
    ceir = market_caps / cumulative_energy_cost
    
    df = pd.DataFrame({
        'Date': dates,
        'Price': prices,
        'Supply': supply,
        'Market_Cap': market_caps,
        'Energy_TWh_Annual': energy_twh,
        'CEIR': ceir
    })
    
    return df


def compute_energy_price(ceir_df: pd.DataFrame, 
                        normalization_date: Optional[str] = None) -> np.ndarray:
    """
    Derive energy unit prices from CEIR.
    
    Energy price represents the present value of 1 unit of energy
    backed by the CEIR framework.
    
    Parameters
    ----------
    ceir_df : pd.DataFrame
        DataFrame with CEIR column
    normalization_date : str, optional
        Date to normalize prices to (YYYY-MM-DD format)
        
    Returns
    -------
    np.ndarray
        Energy unit prices
    """
    
    ceir_values = ceir_df['CEIR'].values
    
    # Energy price is derived from CEIR
    # Normalize to $1 at initial date
    energy_prices = ceir_values / ceir_values[0]
    
    # If normalization date specified, rescale
    if normalization_date:
        norm_date = pd.Timestamp(normalization_date)
        norm_idx = (ceir_df['Date'] - norm_date).abs().argmin()
        energy_prices = energy_prices / energy_prices[norm_idx]
    
    return energy_prices


def estimate_volatility(price_series: np.ndarray, 
                       periods: int = 252) -> float:
    """
    Estimate annualized volatility from price series.
    
    Parameters
    ----------
    price_series : np.ndarray
        Price array
    periods : int
        Trading periods per year (default: 252)
        
    Returns
    -------
    float
        Annualized volatility
    """
    
    returns = np.diff(np.log(price_series))
    daily_vol = np.std(returns)
    annualized_vol = daily_vol * np.sqrt(periods)
    
    return annualized_vol


def load_parameters(data_dir: str = '../empirical',
                   T: float = 1.0,
                   r: float = 0.05) -> Dict:
    """
    Load all parameters for derivative pricing from empirical data.
    
    Parameters
    ----------
    data_dir : str
        Path to empirical data directory
    T : float
        Time to maturity (years)
    r : float
        Risk-free rate
        
    Returns
    -------
    Dict
        Dictionary with pricing parameters:
        - S0: Initial energy price
        - sigma: Estimated volatility
        - T: Time to maturity
        - r: Risk-free rate
        - K: Strike price (set to current price)
        - ceir_df: Full CEIR DataFrame
    """
    
    # Load CEIR data
    ceir_df = load_ceir_data(data_dir)
    
    # Compute energy price
    energy_prices = compute_energy_price(ceir_df)
    
    # Estimate volatility
    sigma = estimate_volatility(energy_prices)
    
    # Get current price (latest)
    S0 = energy_prices[-1]
    
    # Strike price (at-the-money)
    K = S0
    
    params = {
        'S0': S0,
        'sigma': sigma,
        'T': T,
        'r': r,
        'K': K,
        'ceir_df': ceir_df,
        'energy_prices': energy_prices,
        'data_dir': data_dir
    }
    
    return params


def get_ceir_summary(ceir_df: pd.DataFrame) -> Dict:
    """
    Get summary statistics from CEIR data.
    
    Parameters
    ----------
    ceir_df : pd.DataFrame
        CEIR DataFrame
        
    Returns
    -------
    Dict
        Summary statistics
    """
    
    summary = {
        'start_date': ceir_df['Date'].min(),
        'end_date': ceir_df['Date'].max(),
        'n_days': len(ceir_df),
        'price_min': ceir_df['Price'].min(),
        'price_max': ceir_df['Price'].max(),
        'price_current': ceir_df['Price'].iloc[-1],
        'market_cap_current': ceir_df['Market_Cap'].iloc[-1],
        'ceir_mean': ceir_df['CEIR'].mean(),
        'ceir_std': ceir_df['CEIR'].std(),
        'energy_twh_mean': ceir_df['Energy_TWh_Annual'].mean() if 'Energy_TWh_Annual' in ceir_df else np.nan
    }
    
    return summary

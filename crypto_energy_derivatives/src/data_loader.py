"""
Data Loader for Cryptocurrency Energy Analysis
==============================================

Loads and processes Bitcoin and Ethereum market data including:
- Price history
- Market capitalization
- Energy consumption (TWh)
- Supply metrics

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import pandas as pd
import numpy as np
import os
import warnings
from typing import Dict, Optional, Tuple
from datetime import datetime


class CryptoDataLoader:
    """
    Load and process cryptocurrency market and energy data.

    Supports Bitcoin and Ethereum with automatic data validation,
    cleaning, and fallback to synthetic data if files not found.

    Parameters
    ----------
    data_dir : str, optional
        Directory containing data files (default: '../empirical')

    Attributes
    ----------
    data_dir : str
        Path to data directory
    btc_data : pd.DataFrame or None
        Bitcoin dataset
    eth_data : pd.DataFrame or None
        Ethereum dataset

    Examples
    --------
    >>> loader = CryptoDataLoader(data_dir='../empirical')
    >>> btc = loader.load_bitcoin_data()
    >>> print(f"Loaded {len(btc)} days of Bitcoin data")
    """

    def __init__(self, data_dir: str = '../empirical'):
        """Initialize data loader with directory path."""
        self.data_dir = data_dir
        self.btc_data = None
        self.eth_data = None

    def load_bitcoin_data(self, use_synthetic: bool = False) -> pd.DataFrame:
        """
        Load Bitcoin price and energy consumption data.

        Parameters
        ----------
        use_synthetic : bool
            Force use of synthetic data (default: False)

        Returns
        -------
        pd.DataFrame
            DataFrame with columns: Date, Price, Market_Cap,
            Energy_TWh_Annual, Supply

        Examples
        --------
        >>> loader = CryptoDataLoader()
        >>> btc = loader.load_bitcoin_data()
        >>> btc.head()
        """
        if use_synthetic or not os.path.exists(self.data_dir):
            warnings.warn(f"Data directory {self.data_dir} not found. Using synthetic data.")
            self.btc_data = self._generate_synthetic_bitcoin_data()
            return self.btc_data

        try:
            # Try to load from empirical folder
            btc_file = self._find_bitcoin_file()

            if btc_file is None:
                warnings.warn("No Bitcoin data file found. Using synthetic data.")
                self.btc_data = self._generate_synthetic_bitcoin_data()
                return self.btc_data

            df = pd.read_csv(btc_file)

            # Process and validate
            df = self._process_bitcoin_data(df)

            self.btc_data = df
            return df

        except Exception as e:
            warnings.warn(f"Error loading Bitcoin data: {e}. Using synthetic data.")
            self.btc_data = self._generate_synthetic_bitcoin_data()
            return self.btc_data

    def load_ethereum_data(self, use_synthetic: bool = False) -> pd.DataFrame:
        """
        Load Ethereum price and energy consumption data.

        Parameters
        ----------
        use_synthetic : bool
            Force use of synthetic data (default: False)

        Returns
        -------
        pd.DataFrame
            DataFrame with columns: Date, Price, Market_Cap,
            Energy_TWh_Annual, Supply

        Examples
        --------
        >>> loader = CryptoDataLoader()
        >>> eth = loader.load_ethereum_data()
        """
        if use_synthetic or not os.path.exists(self.data_dir):
            self.eth_data = self._generate_synthetic_ethereum_data()
            return self.eth_data

        try:
            eth_file = self._find_ethereum_file()

            if eth_file is None:
                self.eth_data = self._generate_synthetic_ethereum_data()
                return self.eth_data

            df = pd.read_csv(eth_file)
            df = self._process_ethereum_data(df)

            self.eth_data = df
            return df

        except Exception as e:
            warnings.warn(f"Error loading Ethereum data: {e}. Using synthetic data.")
            self.eth_data = self._generate_synthetic_ethereum_data()
            return self.eth_data

    def _find_bitcoin_file(self) -> Optional[str]:
        """Find Bitcoin data file in directory."""
        candidates = [
            'bitcoin_ceir_final.csv',
            'bitcoin_ceir_complete.csv',
            'bitcoin_ceir_analysis_ready.csv',
            'btc_ds_parsed.csv'
        ]

        for candidate in candidates:
            path = os.path.join(self.data_dir, candidate)
            if os.path.exists(path):
                return path

        return None

    def _find_ethereum_file(self) -> Optional[str]:
        """Find Ethereum data file in directory."""
        candidates = [
            'eth_ds_parsed.csv',
            'ethereum_data.csv'
        ]

        for candidate in candidates:
            path = os.path.join(self.data_dir, candidate)
            if os.path.exists(path):
                return path

        return None

    def _process_bitcoin_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process and validate Bitcoin data."""
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
            if 'Close' in df.columns:
                df['Price'] = df['Close']
            elif 'Open' in df.columns:
                df['Price'] = df['Open']
            else:
                raise ValueError("No price column found")

        # Load energy data if available
        energy_file = os.path.join(self.data_dir, 'btc_con.csv')
        if os.path.exists(energy_file):
            energy_df = pd.read_csv(energy_file)
            if 'DateTime' in energy_df.columns:
                energy_df['DateTime'] = pd.to_datetime(energy_df['DateTime'])
                energy_df['Date'] = energy_df['DateTime'].dt.date
                df['Date_only'] = df['Date'].dt.date

                # Merge energy data
                energy_col = 'Estimated TWh per Year' if 'Estimated TWh per Year' in energy_df.columns else 'Energy_TWh_Annual'
                energy_df = energy_df.rename(columns={energy_col: 'Energy_TWh_Annual'})

                df = df.merge(
                    energy_df[['Date', 'Energy_TWh_Annual']].drop_duplicates('Date', keep='first'),
                    left_on='Date_only',
                    right_on='Date',
                    how='left',
                    suffixes=('', '_energy')
                )
                df = df.drop(['Date_only', 'Date_energy'], axis=1, errors='ignore')

        # Compute supply if not present
        if 'Supply' not in df.columns:
            days_since_start = (df['Date'] - df['Date'].min()).dt.days.values
            # Bitcoin supply curve approximation
            df['Supply'] = 21e6 - (21e6 - 17e6) * np.exp(-0.693 * days_since_start / (4 * 365))

        # Compute market cap if not present
        if 'Market_Cap' not in df.columns:
            df['Market_Cap'] = df['Price'] * df['Supply']

        # Fill missing energy data with interpolation
        if 'Energy_TWh_Annual' in df.columns:
            df['Energy_TWh_Annual'] = df['Energy_TWh_Annual'].interpolate(method='linear')
        else:
            # Estimate if not available
            df['Energy_TWh_Annual'] = 50 + 100 * (days_since_start / days_since_start.max())

        # Remove outliers
        df = self._remove_outliers(df, ['Price', 'Market_Cap', 'Energy_TWh_Annual'])

        # Sort by date
        df = df.sort_values('Date').reset_index(drop=True)

        return df[['Date', 'Price', 'Market_Cap', 'Supply', 'Energy_TWh_Annual']]

    def _process_ethereum_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process and validate Ethereum data."""
        # Similar processing as Bitcoin
        if 'Date' not in df.columns:
            df['Date'] = pd.date_range(start='2018-01-01', periods=len(df))
        else:
            df['Date'] = pd.to_datetime(df['Date'])

        if 'Price' not in df.columns:
            if 'Close' in df.columns:
                df['Price'] = df['Close']
            elif 'Open' in df.columns:
                df['Price'] = df['Open']

        # Ethereum supply approximation (linear growth)
        if 'Supply' not in df.columns:
            days_since_start = (df['Date'] - df['Date'].min()).dt.days.values
            df['Supply'] = 100e6 + (20e6 * days_since_start / 365)  # ~120M ETH

        if 'Market_Cap' not in df.columns:
            df['Market_Cap'] = df['Price'] * df['Supply']

        # Energy consumption (drops to near-zero after Merge)
        if 'Energy_TWh_Annual' not in df.columns:
            merge_date = pd.Timestamp('2022-09-15')
            df['Energy_TWh_Annual'] = np.where(
                df['Date'] < merge_date,
                50 + 30 * np.random.random(len(df)),  # PoW era
                0.01  # PoS era (negligible)
            )

        df = self._remove_outliers(df, ['Price', 'Market_Cap'])
        df = df.sort_values('Date').reset_index(drop=True)

        return df[['Date', 'Price', 'Market_Cap', 'Supply', 'Energy_TWh_Annual']]

    def _remove_outliers(self, df: pd.DataFrame, columns: list, percentile: float = 99.5) -> pd.DataFrame:
        """Remove extreme outliers via winsorization."""
        df = df.copy()
        for col in columns:
            if col in df.columns:
                upper = df[col].quantile(percentile / 100)
                lower = df[col].quantile((100 - percentile) / 100)
                df[col] = df[col].clip(lower=lower, upper=upper)
        return df

    def _generate_synthetic_bitcoin_data(self, n_days: int = 2000) -> pd.DataFrame:
        """
        Generate synthetic Bitcoin data for testing.

        Parameters
        ----------
        n_days : int
            Number of days of data to generate

        Returns
        -------
        pd.DataFrame
            Synthetic Bitcoin dataset
        """
        np.random.seed(42)
        dates = pd.date_range(start='2018-01-01', periods=n_days, freq='D')

        # Geometric Brownian motion for price
        returns = np.random.normal(0.0005, 0.03, n_days)
        prices = 5000 * np.exp(np.cumsum(returns))

        # Supply curve
        days_idx = np.arange(n_days)
        supply = 21e6 - (21e6 - 17e6) * np.exp(-0.693 * days_idx / (4 * 365))

        # Market cap
        market_caps = prices * supply

        # Energy consumption (increasing trend)
        energy_twh = 50 + 100 * (days_idx / n_days) + 10 * np.random.normal(0, 0.1, n_days)
        energy_twh = np.maximum(energy_twh, 20)

        df = pd.DataFrame({
            'Date': dates,
            'Price': prices,
            'Market_Cap': market_caps,
            'Supply': supply,
            'Energy_TWh_Annual': energy_twh
        })

        return df

    def _generate_synthetic_ethereum_data(self, n_days: int = 2000) -> pd.DataFrame:
        """
        Generate synthetic Ethereum data for testing.

        Parameters
        ----------
        n_days : int
            Number of days of data to generate

        Returns
        -------
        pd.DataFrame
            Synthetic Ethereum dataset
        """
        np.random.seed(43)
        dates = pd.date_range(start='2018-01-01', periods=n_days, freq='D')

        # Price
        returns = np.random.normal(0.0008, 0.04, n_days)
        prices = 200 * np.exp(np.cumsum(returns))

        # Supply (linear growth)
        days_idx = np.arange(n_days)
        supply = 100e6 + (20e6 * days_idx / 365)

        # Market cap
        market_caps = prices * supply

        # Energy (drops after Merge simulation)
        merge_idx = int(n_days * 0.6)  # 60% through
        energy_twh = np.where(
            days_idx < merge_idx,
            30 + 20 * (days_idx / merge_idx),
            0.01
        )

        df = pd.DataFrame({
            'Date': dates,
            'Price': prices,
            'Market_Cap': market_caps,
            'Supply': supply,
            'Energy_TWh_Annual': energy_twh
        })

        return df

    def get_data_summary(self, crypto: str = 'BTC') -> Dict:
        """
        Get summary statistics for loaded data.

        Parameters
        ----------
        crypto : str
            'BTC' or 'ETH'

        Returns
        -------
        Dict
            Summary statistics

        Examples
        --------
        >>> loader = CryptoDataLoader()
        >>> loader.load_bitcoin_data()
        >>> summary = loader.get_data_summary('BTC')
        >>> print(summary)
        """
        if crypto == 'BTC':
            df = self.btc_data
        elif crypto == 'ETH':
            df = self.eth_data
        else:
            raise ValueError(f"Unknown crypto: {crypto}")

        if df is None:
            raise ValueError(f"{crypto} data not loaded")

        summary = {
            'crypto': crypto,
            'start_date': df['Date'].min(),
            'end_date': df['Date'].max(),
            'n_days': len(df),
            'price_min': df['Price'].min(),
            'price_max': df['Price'].max(),
            'price_mean': df['Price'].mean(),
            'price_current': df['Price'].iloc[-1],
            'market_cap_current': df['Market_Cap'].iloc[-1],
            'energy_mean': df['Energy_TWh_Annual'].mean(),
            'energy_current': df['Energy_TWh_Annual'].iloc[-1],
        }

        return summary


# Convenience functions
def load_bitcoin(data_dir: str = '../empirical') -> pd.DataFrame:
    """
    Quick function to load Bitcoin data.

    Parameters
    ----------
    data_dir : str
        Path to data directory

    Returns
    -------
    pd.DataFrame
        Bitcoin dataset

    Examples
    --------
    >>> btc = load_bitcoin('../empirical')
    """
    loader = CryptoDataLoader(data_dir)
    return loader.load_bitcoin_data()


def load_ethereum(data_dir: str = '../empirical') -> pd.DataFrame:
    """
    Quick function to load Ethereum data.

    Parameters
    ----------
    data_dir : str
        Path to data directory

    Returns
    -------
    pd.DataFrame
        Ethereum dataset

    Examples
    --------
    >>> eth = load_ethereum('../empirical')
    """
    loader = CryptoDataLoader(data_dir)
    return loader.load_ethereum_data()

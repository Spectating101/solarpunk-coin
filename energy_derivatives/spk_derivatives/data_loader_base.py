"""
Abstract Base Class for Renewable Energy Data Loaders
======================================================

Defines the interface that all energy-specific data loaders must implement.
This enables a modular, extensible architecture where solar, wind, hydro,
and other renewable sources are treated uniformly by the pricing engines.

Key Classes:
-----------
EnergyDataLoader: Abstract base class defining loader interface

Key Methods:
-----------
fetch_data(): Fetch raw data from source (solar GHI, wind speed, precipitation, etc.)
compute_price(): Convert raw data to economic prices
get_volatility_params(): Calculate annualized volatility (shared across all types)
load_parameters(): Load all parameters for derivative pricing

Design Pattern:
--------------
Abstract base defines the contract that all loaders must fulfill:
1. Fetch raw renewable energy data from source
2. Convert to economic prices using source-specific formulas
3. Calculate volatility using standardized method
4. Return parameter dict for pricing engines

This allows BinomialTree, MonteCarloSimulator, and GreeksCalculator
to work with ANY renewable energy source without modification.
"""

import pandas as pd
import numpy as np
import warnings
from abc import ABC, abstractmethod
from typing import Dict, Tuple, Optional


class EnergyDataLoader(ABC):
    """
    Abstract base class for renewable energy data loaders.
    
    All renewable energy sources (solar, wind, hydro, geothermal, etc.)
    inherit from this class and implement:
    1. fetch_data() - Get raw data from source
    2. compute_price() - Convert to economic prices
    
    The base class provides:
    - get_volatility_params() - Calculate volatility (reusable)
    - load_parameters() - Orchestrate the full pipeline
    
    Parameters
    ----------
    lat : float
        Latitude of location
    lon : float
        Longitude of location
    start_year : int
        Start year for historical data
    end_year : int
        End year for historical data
    
    Attributes
    ----------
    lat : float
        Latitude
    lon : float
        Longitude
    start_year : int
        Start year
    end_year : int
        End year
    data_df : pd.DataFrame, optional
        Raw data fetched from source
    """
    
    def __init__(self, lat: float, lon: float, start_year: int, end_year: int):
        """Initialize energy data loader with location and date range."""
        self.lat = lat
        self.lon = lon
        self.start_year = start_year
        self.end_year = end_year
        self.data_df = None
    
    @abstractmethod
    def fetch_data(self) -> pd.DataFrame:
        """
        Fetch raw energy data from source.
        
        Must be implemented by subclass.
        
        Returns
        -------
        pd.DataFrame
            DataFrame with 'Price' column and DatetimeIndex.
            May include additional energy-source-specific columns.
        
        Notes
        -----
        Subclass should handle:
        - API calls or file reads
        - Caching where appropriate
        - Missing data handling
        - Error handling and retries
        """
        pass
    
    @abstractmethod
    def compute_price(self, df: pd.DataFrame, **kwargs) -> np.ndarray:
        """
        Convert raw energy data to economic prices.
        
        Implementation varies by energy source:
        - Solar: GHI × efficiency × area × $/kWh
        - Wind: wind_speed → power_curve → $/kWh
        - Hydro: precipitation → flow → power → $/kWh
        
        Parameters
        ----------
        df : pd.DataFrame
            DataFrame from fetch_data()
        **kwargs
            Energy-source-specific parameters
        
        Returns
        -------
        np.ndarray
            Array of daily prices in $/kWh or equivalent
        
        Notes
        -----
        Must return 1D array of prices aligned with df index.
        """
        pass
    
    def get_volatility_params(
        self,
        df: pd.DataFrame,
        window: int = 365,
        method: str = 'log',
        cap_volatility: Optional[float] = None
    ) -> Tuple[float, pd.DataFrame]:
        """
        Calculate annualized volatility from price data.
        
        This calculation is SHARED across all energy types because
        the financial mathematics is the same regardless of underlying
        (solar, wind, hydro, etc.).
        
        Parameters
        ----------
        df : pd.DataFrame
            DataFrame with 'Price' column and DatetimeIndex
        window : int
            Trading periods per year (default: 365 for daily data)
        method : str
            Volatility calculation method:
            - 'log': Log returns (recommended, symmetric)
            - 'pct_change': Simple percentage change
            - 'normalized': Normalized by mean
        cap_volatility : Optional[float]
            Optional cap on volatility for numerical stability
        
        Returns
        -------
        Tuple[float, pd.DataFrame]
            (annualized_volatility, df_with_returns)
        
        Notes
        -----
        Log returns are recommended because they:
        - Handle small denominators gracefully
        - Treat up/down moves symmetrically
        - Are standard in quantitative finance
        - Avoid artifacts with physical quantities
        """
        df = df.copy()
        
        # Step 1: Calculate returns using specified method
        if method == 'log':
            # Log returns: log(P_t / P_{t-1})
            df['Returns'] = np.log(df['Price'] / df['Price'].shift(1))
        elif method == 'pct_change':
            # Simple returns: (P_t - P_{t-1}) / P_{t-1}
            df['Returns'] = df['Price'].pct_change()
        elif method in {'normalized', 'std'}:
            # Normalized: (P_t - P_{t-1}) / mean(P)
            mean_value = df['Price'].mean()
            df['Returns'] = (df['Price'] - df['Price'].shift(1)) / mean_value
        else:
            raise ValueError(
                f"Unknown method: '{method}'. "
                f"Choose from: 'log', 'pct_change', 'normalized'"
            )
        
        # Step 2: Clean returns (remove infinities and NaN)
        valid_returns = df['Returns'].replace([np.inf, -np.inf], np.nan).dropna()
        
        if len(valid_returns) < 2:
            warnings.warn(
                "Not enough valid returns to estimate volatility; "
                "defaulting to 20%"
            )
            return 0.20, df
        
        # Step 3: Calculate volatility
        daily_vol = valid_returns.std()
        annual_vol = daily_vol * np.sqrt(window)
        
        # Step 4: Apply cap if specified
        if cap_volatility is not None and annual_vol > cap_volatility:
            warnings.warn(
                f"Volatility {annual_vol:.2%} exceeds cap {cap_volatility:.0%}. "
                f"Capping for numerical stability."
            )
            annual_vol = cap_volatility
        
        # Step 5: Sanity check
        if not np.isfinite(annual_vol) or annual_vol <= 0:
            warnings.warn(
                f"Invalid volatility {annual_vol}; defaulting to 20%. "
                f"Check input data."
            )
            annual_vol = 0.20
        
        return float(annual_vol), df
    
    def load_parameters(
        self,
        T: float = 1.0,
        r: float = 0.05,
        volatility_method: str = 'log',
        volatility_cap: Optional[float] = None,
        **loader_kwargs
    ) -> Dict:
        """
        Load all parameters for energy derivative pricing.
        
        Orchestrates the full pipeline:
        1. Fetch raw data
        2. Compute prices
        3. Calculate volatility
        4. Extract pricing parameters
        
        Parameters
        ----------
        T : float
            Time to maturity in years (default: 1.0)
        r : float
            Risk-free rate, annualized (default: 0.05 = 5%)
        volatility_method : str
            Method for volatility calculation (default: 'log')
        volatility_cap : Optional[float]
            Optional volatility cap (e.g., 2.0 for 200%)
        **loader_kwargs
            Additional energy-source-specific parameters
            (e.g., panel_efficiency for solar, rotor_diameter for wind)
        
        Returns
        -------
        Dict
            Dictionary with pricing parameters:
            - S0: Current energy price ($/kWh)
            - sigma: Annualized volatility (0-1)
            - T: Time to maturity
            - r: Risk-free rate
            - K: Strike price (ATM)
            - data_df: Full DataFrame with returns
            - prices: Array of daily prices
            - location: Dict with latitude/longitude
            - date_range: Data period
            - volatility_method: Method used
        
        Examples
        --------
        >>> loader = SolarDataLoader(lat=33.45, lon=-112.07, start_year=2020, end_year=2024)
        >>> params = loader.load_parameters()
        >>> bt = BinomialTree(**params)
        >>> price = bt.price_call_option()
        """
        # Fetch raw data
        self.data_df = self.fetch_data()
        
        # Compute prices (energy-source-specific)
        prices = self.compute_price(self.data_df, **loader_kwargs)
        
        # Calculate volatility (same for all sources)
        sigma, data_with_returns = self.get_volatility_params(
            self.data_df,
            method=volatility_method,
            cap_volatility=volatility_cap
        )
        
        # Extract current price (latest)
        S0 = float(prices[-1])
        
        # Strike price (at-the-money)
        K = S0
        
        # Build parameter dictionary
        params = {
            'S0': S0,
            'sigma': sigma,
            'T': T,
            'r': r,
            'K': K,
            'data_df': data_with_returns,
            'prices': prices,
            'location': {
                'latitude': self.lat,
                'longitude': self.lon,
            },
            'date_range': f"{self.start_year}-{self.end_year}",
            'volatility_method': volatility_method,
            'volatility_cap': volatility_cap,
        }
        
        return params
    
    def get_summary(self, params: Dict) -> Dict:
        """
        Get summary statistics from loaded data.
        
        Parameters
        ----------
        params : Dict
            Parameters dictionary from load_parameters()
        
        Returns
        -------
        Dict
            Summary statistics including mean/std of prices,
            volatility, date range, etc.
        """
        data_df = params['data_df']
        prices = params['prices']
        
        summary = {
            'location': {
                'latitude': params['location']['latitude'],
                'longitude': params['location']['longitude'],
            },
            'date_range': params['date_range'],
            'start_date': data_df.index.min(),
            'end_date': data_df.index.max(),
            'n_days': len(data_df),
            'price_mean': np.mean(prices),
            'price_std': np.std(prices),
            'price_min': np.min(prices),
            'price_max': np.max(prices),
            'price_current': params['S0'],
            'volatility': params['sigma'],
        }
        
        return summary

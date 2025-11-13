"""
Energy Cost Analyzer for Cryptocurrencies
=========================================

Analyzes the relationship between cryptocurrency market capitalization
and energy costs. Computes energy cost ratios, derives energy unit prices,
and estimates volatility.

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import pandas as pd
import numpy as np
from typing import Dict, Tuple, Optional
import warnings


class EnergyAnalyzer:
    """
    Analyze energy cost relationships in cryptocurrency data.

    Computes:
    - Energy Cost Ratio (ECR) = Market Cap / Cumulative Energy Cost
    - Energy unit prices derived from ECR
    - Volatility estimates
    - Summary statistics

    Parameters
    ----------
    data : pd.DataFrame
        Cryptocurrency data with columns: Date, Price, Market_Cap, Energy_TWh_Annual
    electricity_price : float
        Electricity price in $/kWh (default: 0.05)

    Attributes
    ----------
    data : pd.DataFrame
        Input cryptocurrency data
    electricity_price : float
        Electricity price for cost calculation
    ecr : np.ndarray or None
        Energy Cost Ratio series
    energy_prices : np.ndarray or None
        Derived energy unit prices

    Examples
    --------
    >>> from src.data_loader import load_bitcoin
    >>> from src.energy_analyzer import EnergyAnalyzer
    >>>
    >>> btc = load_bitcoin()
    >>> analyzer = EnergyAnalyzer(btc, electricity_price=0.05)
    >>> energy_price = analyzer.get_current_energy_price()
    >>> volatility = analyzer.estimate_volatility()
    """

    def __init__(self, data: pd.DataFrame, electricity_price: float = 0.05):
        """Initialize analyzer with cryptocurrency data."""
        self.data = data.copy()
        self.electricity_price = electricity_price
        self.ecr = None
        self.energy_prices = None

        # Validate data
        required_cols = ['Date', 'Price', 'Market_Cap', 'Energy_TWh_Annual']
        missing = [col for col in required_cols if col not in data.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")

        # Compute ECR automatically
        self._compute_ecr()
        self._derive_energy_prices()

    def _compute_ecr(self):
        """Compute Energy Cost Ratio (ECR)."""
        # Daily energy in TWh
        daily_energy_twh = self.data['Energy_TWh_Annual'] / 365

        # Daily energy cost in USD
        # 1 TWh = 1e9 kWh
        daily_energy_cost = daily_energy_twh * self.electricity_price * 1e9

        # Cumulative energy cost
        cumulative_cost = daily_energy_cost.cumsum()

        # ECR = Market Cap / Cumulative Energy Cost
        ecr = self.data['Market_Cap'] / cumulative_cost

        # Handle inf/nan
        ecr = ecr.replace([np.inf, -np.inf], np.nan)
        ecr = ecr.fillna(method='bfill').fillna(method='ffill')

        self.data['Daily_Energy_TWh'] = daily_energy_twh
        self.data['Daily_Energy_Cost'] = daily_energy_cost
        self.data['Cumulative_Energy_Cost'] = cumulative_cost
        self.data['ECR'] = ecr

        self.ecr = ecr.values

    def _derive_energy_prices(self):
        """Derive energy unit prices from ECR."""
        # Normalize ECR to price units
        # Energy price = ECR / ECR[0]
        # This gives energy unit price normalized to 1.0 at start

        if self.ecr is None:
            self._compute_ecr()

        ecr_normalized = self.ecr / self.ecr[0]
        self.data['Energy_Price'] = ecr_normalized
        self.energy_prices = ecr_normalized

    def get_current_energy_price(self) -> float:
        """
        Get the most recent energy unit price.

        Returns
        -------
        float
            Current energy price (normalized)

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> S0 = analyzer.get_current_energy_price()
        """
        if self.energy_prices is None:
            self._derive_energy_prices()

        return float(self.energy_prices[-1])

    def estimate_volatility(self, window: Optional[int] = None, annualize: bool = True) -> float:
        """
        Estimate volatility of energy prices.

        Parameters
        ----------
        window : int, optional
            Rolling window size. If None, use full history
        annualize : bool
            Whether to annualize volatility (default: True)

        Returns
        -------
        float
            Annualized volatility (if annualize=True)

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> sigma = analyzer.estimate_volatility()
        >>> print(f"Volatility: {sigma:.2%}")
        """
        if self.energy_prices is None:
            self._derive_energy_prices()

        # Compute log returns
        returns = np.diff(np.log(self.energy_prices))

        # Remove inf/nan
        returns = returns[np.isfinite(returns)]

        if len(returns) == 0:
            warnings.warn("No valid returns found, returning default volatility")
            return 0.45  # Default

        # Compute volatility
        if window is None:
            volatility = np.std(returns)
        else:
            # Rolling volatility (take most recent)
            if len(returns) < window:
                volatility = np.std(returns)
            else:
                volatility = np.std(returns[-window:])

        # Annualize (assume 252 trading days)
        if annualize:
            volatility = volatility * np.sqrt(252)

        return float(volatility)

    def estimate_rolling_volatility(self, window: int = 30) -> np.ndarray:
        """
        Estimate rolling volatility.

        Parameters
        ----------
        window : int
            Rolling window size in days

        Returns
        -------
        np.ndarray
            Rolling volatility series

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> rolling_vol = analyzer.estimate_rolling_volatility(window=30)
        """
        if self.energy_prices is None:
            self._derive_energy_prices()

        returns = np.diff(np.log(self.energy_prices))
        returns_series = pd.Series(returns)

        rolling_std = returns_series.rolling(window=window).std()
        rolling_vol = rolling_std * np.sqrt(252)  # Annualize

        return rolling_vol.values

    def get_ecr_summary(self) -> Dict:
        """
        Get summary statistics for Energy Cost Ratio.

        Returns
        -------
        Dict
            Summary statistics including mean, std, min, max, current

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> summary = analyzer.get_ecr_summary()
        >>> print(f"Mean ECR: {summary['mean']:.2f}")
        """
        if self.ecr is None:
            self._compute_ecr()

        summary = {
            'mean': float(np.mean(self.ecr)),
            'std': float(np.std(self.ecr)),
            'min': float(np.min(self.ecr)),
            'max': float(np.max(self.ecr)),
            'current': float(self.ecr[-1]),
            'median': float(np.median(self.ecr)),
            'q25': float(np.quantile(self.ecr, 0.25)),
            'q75': float(np.quantile(self.ecr, 0.75)),
        }

        return summary

    def get_energy_price_summary(self) -> Dict:
        """
        Get summary statistics for energy prices.

        Returns
        -------
        Dict
            Summary statistics

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> summary = analyzer.get_energy_price_summary()
        """
        if self.energy_prices is None:
            self._derive_energy_prices()

        summary = {
            'initial': float(self.energy_prices[0]),
            'current': float(self.energy_prices[-1]),
            'mean': float(np.mean(self.energy_prices)),
            'std': float(np.std(self.energy_prices)),
            'min': float(np.min(self.energy_prices)),
            'max': float(np.max(self.energy_prices)),
            'total_return': float((self.energy_prices[-1] / self.energy_prices[0]) - 1),
            'annualized_return': self._compute_annualized_return(),
            'volatility': self.estimate_volatility(),
            'sharpe_ratio': self._compute_sharpe_ratio(),
        }

        return summary

    def _compute_annualized_return(self, risk_free_rate: float = 0.05) -> float:
        """Compute annualized return."""
        if self.energy_prices is None:
            return 0.0

        total_return = (self.energy_prices[-1] / self.energy_prices[0]) - 1
        n_days = len(self.energy_prices)
        n_years = n_days / 252

        if n_years <= 0:
            return 0.0

        annualized = (1 + total_return) ** (1 / n_years) - 1
        return float(annualized)

    def _compute_sharpe_ratio(self, risk_free_rate: float = 0.05) -> float:
        """Compute Sharpe ratio."""
        if self.energy_prices is None:
            return 0.0

        ann_return = self._compute_annualized_return()
        volatility = self.estimate_volatility()

        if volatility == 0:
            return 0.0

        sharpe = (ann_return - risk_free_rate) / volatility
        return float(sharpe)

    def get_pricing_parameters(self, T: float = 1.0, r: float = 0.05) -> Dict:
        """
        Get all parameters needed for derivative pricing.

        Parameters
        ----------
        T : float
            Time to maturity (years)
        r : float
            Risk-free rate (annualized)

        Returns
        -------
        Dict
            Dictionary with S0, sigma, T, r, K (ATM strike)

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> params = analyzer.get_pricing_parameters(T=1.0, r=0.05)
        >>> print(params)
        """
        S0 = self.get_current_energy_price()
        sigma = self.estimate_volatility()

        params = {
            'S0': S0,
            'K': S0,  # At-the-money strike
            'T': T,
            'r': r,
            'sigma': sigma,
        }

        return params

    def export_data(self, filename: str):
        """
        Export analyzed data to CSV.

        Parameters
        ----------
        filename : str
            Output file path

        Examples
        --------
        >>> analyzer = EnergyAnalyzer(btc_data)
        >>> analyzer.export_data('bitcoin_energy_analysis.csv')
        """
        self.data.to_csv(filename, index=False)
        print(f"Data exported to {filename}")


# Convenience function
def analyze_crypto_energy(data: pd.DataFrame, electricity_price: float = 0.05) -> EnergyAnalyzer:
    """
    Quick function to analyze cryptocurrency energy costs.

    Parameters
    ----------
    data : pd.DataFrame
        Cryptocurrency data
    electricity_price : float
        Electricity price ($/kWh)

    Returns
    -------
    EnergyAnalyzer
        Initialized analyzer

    Examples
    --------
    >>> from src.data_loader import load_bitcoin
    >>> from src.energy_analyzer import analyze_crypto_energy
    >>>
    >>> btc = load_bitcoin()
    >>> analyzer = analyze_crypto_energy(btc)
    >>> print(analyzer.get_energy_price_summary())
    """
    return EnergyAnalyzer(data, electricity_price=electricity_price)

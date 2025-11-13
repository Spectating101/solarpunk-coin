"""
CEIR Bridge Module
==================

Bridges CEIR research output to derivative pricing parameters.

This module translates your CEIR research (Market Cap / Cumulative Energy Cost)
into the parameters needed for SPK token pricing.
"""

import numpy as np
import pandas as pd
from typing import Dict, Optional
import os


class CEIRBridge:
    """
    Bridge from CEIR research to derivative pricing.

    Takes CEIR data and extracts:
    - Energy unit prices (S₀)
    - Volatility estimates (σ)
    - Trend parameters

    These become inputs to SPK token pricing.
    """

    def __init__(self, ceir_data_path: Optional[str] = None, ceir_series: Optional[pd.Series] = None):
        """
        Initialize CEIR bridge.

        Parameters:
        -----------
        ceir_data_path : str, optional
            Path to empirical data directory (will load Bitcoin CEIR)
        ceir_series : pd.Series, optional
            Direct CEIR time series (if you have it computed)
        """
        self.ceir_data_path = ceir_data_path
        self.ceir_series = ceir_series
        self.data = None
        self.energy_prices = None

        if ceir_data_path:
            self._load_from_path()
        elif ceir_series is not None:
            self._load_from_series()
        else:
            print("Warning: No CEIR data provided, will use synthetic data")

    def _load_from_path(self):
        """Load CEIR data from file path."""
        if not os.path.exists(self.ceir_data_path):
            print(f"Path not found: {self.ceir_data_path}")
            return

        # Try to find CEIR data files
        ceir_files = [
            'bitcoin_ceir_final.csv',
            'bitcoin_ceir_complete.csv',
            'bitcoin_ceir_analysis_ready.csv'
        ]

        for filename in ceir_files:
            filepath = os.path.join(self.ceir_data_path, filename)
            if os.path.exists(filepath):
                try:
                    df = pd.read_csv(filepath)

                    # Check for CEIR column
                    if 'CEIR' in df.columns:
                        self.data = df
                        self.ceir_series = df['CEIR']
                        print(f"✓ Loaded CEIR data from {filename}")
                        return
                    elif 'Market_Cap' in df.columns and 'Energy_TWh_Annual' in df.columns:
                        # Compute CEIR
                        self._compute_ceir_from_data(df)
                        return
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
                    continue

        print("Warning: Could not find CEIR data, using synthetic")

    def _load_from_series(self):
        """Load directly from CEIR series."""
        if len(self.ceir_series) < 100:
            print("Warning: CEIR series very short, results may be unreliable")

        self.data = pd.DataFrame({'CEIR': self.ceir_series})

    def _compute_ceir_from_data(self, df: pd.DataFrame):
        """Compute CEIR from raw Bitcoin data."""
        # Daily energy cost
        daily_energy_twh = df['Energy_TWh_Annual'] / 365
        electricity_price = 0.05  # $/kWh default

        # Cumulative cost
        daily_cost = daily_energy_twh * electricity_price * 1e9  # TWh to kWh
        cumulative_cost = daily_cost.cumsum()

        # CEIR
        ceir = df['Market_Cap'] / cumulative_cost
        ceir = ceir.replace([np.inf, -np.inf], np.nan).fillna(method='ffill')

        self.data = df.copy()
        self.data['CEIR'] = ceir
        self.ceir_series = ceir

        print(f"✓ Computed CEIR from data ({len(ceir)} points)")

    def derive_energy_prices(self) -> np.ndarray:
        """
        Derive energy unit prices from CEIR.

        Normalizes CEIR to create a price series starting at 1.0.

        Returns:
        --------
        np.ndarray
            Energy unit prices (normalized)
        """
        if self.ceir_series is None:
            # Generate synthetic
            self.energy_prices = self._generate_synthetic_prices()
            return self.energy_prices

        # Normalize CEIR to price units
        ceir_values = self.ceir_series.values
        ceir_values = ceir_values[np.isfinite(ceir_values)]

        if len(ceir_values) == 0:
            self.energy_prices = self._generate_synthetic_prices()
            return self.energy_prices

        # Normalize to 1.0 at start
        energy_prices = ceir_values / ceir_values[0]
        self.energy_prices = energy_prices

        return energy_prices

    def estimate_volatility(self, window: Optional[int] = None) -> float:
        """
        Estimate volatility of energy prices.

        Parameters:
        -----------
        window : int, optional
            Rolling window (if None, use full history)

        Returns:
        --------
        float
            Annualized volatility
        """
        if self.energy_prices is None:
            self.derive_energy_prices()

        # Log returns
        returns = np.diff(np.log(self.energy_prices))
        returns = returns[np.isfinite(returns)]

        if len(returns) == 0:
            return 0.45  # Default

        # Compute volatility
        if window is None:
            vol = np.std(returns)
        else:
            vol = np.std(returns[-window:]) if len(returns) >= window else np.std(returns)

        # Annualize (assume daily data, 252 trading days)
        annualized_vol = vol * np.sqrt(252)

        return annualized_vol

    def get_current_energy_price(self) -> float:
        """Get most recent energy price."""
        if self.energy_prices is None:
            self.derive_energy_prices()

        return float(self.energy_prices[-1])

    def extract_pricing_parameters(self, T: float = 1.0, r: float = 0.05) -> Dict:
        """
        Extract all parameters needed for derivative pricing.

        This is the main output for SPK pricing.

        Parameters:
        -----------
        T : float
            Time to maturity (years)
        r : float
            Risk-free rate

        Returns:
        --------
        Dict with keys:
            - S0: Current energy price
            - sigma: Volatility
            - T: Time to maturity
            - r: Risk-free rate
            - K: Suggested strike (ATM)
            - data_points: Number of observations
        """
        S0 = self.get_current_energy_price()
        sigma = self.estimate_volatility()

        params = {
            'S0': S0,
            'K': S0,  # At-the-money
            'sigma': sigma,
            'T': T,
            'r': r,
            'data_points': len(self.energy_prices) if self.energy_prices is not None else 0,
            'energy_price': S0,  # Alias
            'volatility': sigma,  # Alias
        }

        return params

    def _generate_synthetic_prices(self, n_days: int = 2000) -> np.ndarray:
        """Generate synthetic energy prices for testing."""
        np.random.seed(42)
        returns = np.random.normal(0.0005, 0.03, n_days)
        prices = np.exp(np.cumsum(returns))
        return prices

    def get_summary(self) -> Dict:
        """Get summary statistics of CEIR data."""
        if self.energy_prices is None:
            self.derive_energy_prices()

        summary = {
            'n_observations': len(self.energy_prices),
            'current_price': self.get_current_energy_price(),
            'volatility': self.estimate_volatility(),
            'min_price': float(np.min(self.energy_prices)),
            'max_price': float(np.max(self.energy_prices)),
            'mean_price': float(np.mean(self.energy_prices)),
        }

        return summary


# Convenience function
def load_ceir_for_spk(data_path: str = '../empirical') -> Dict:
    """
    Quick function to load CEIR and get pricing parameters for SPK.

    Parameters:
    -----------
    data_path : str
        Path to empirical data

    Returns:
    --------
    Dict
        Pricing parameters ready for SPKTokenPricer
    """
    bridge = CEIRBridge(ceir_data_path=data_path)
    return bridge.extract_pricing_parameters()


# Example usage
if __name__ == "__main__":
    print("CEIR Bridge - Example Usage\n")

    # Load from path
    bridge = CEIRBridge(ceir_data_path='../empirical')

    # Get pricing parameters
    params = bridge.extract_pricing_parameters()

    print("Extracted Parameters for SPK Pricing:")
    print(f"  Current Energy Price (S₀): ${params['S0']:.4f}")
    print(f"  Volatility (σ):            {params['sigma']:.2%}")
    print(f"  Data Points:               {params['data_points']}")

    # Get summary
    summary = bridge.get_summary()
    print(f"\nSummary Statistics:")
    print(f"  Min Price:  ${summary['min_price']:.4f}")
    print(f"  Max Price:  ${summary['max_price']:.4f}")
    print(f"  Mean Price: ${summary['mean_price']:.4f}")

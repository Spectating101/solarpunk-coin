"""
Live Data Fetcher
=================

Real-time Bitcoin and energy data fetching from public APIs.
"""

import requests
import numpy as np
from datetime import datetime
from typing import Dict, Optional


class LiveDataFetcher:
    """Fetch real-time cryptocurrency data."""

    def __init__(self):
        self.coingecko_base = "https://api.coingecko.com/api/v3"
        self.last_update = None

    def fetch_bitcoin_price(self) -> Dict:
        """
        Fetch current Bitcoin price from CoinGecko API.

        Returns:
        --------
        Dict with price, market_cap, volume, etc.
        """
        try:
            url = f"{self.coingecko_base}/simple/price"
            params = {
                'ids': 'bitcoin',
                'vs_currencies': 'usd',
                'include_market_cap': 'true',
                'include_24hr_vol': 'true',
                'include_24hr_change': 'true'
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()['bitcoin']

            self.last_update = datetime.now()

            return {
                'price': data['usd'],
                'market_cap': data['usd_market_cap'],
                'volume_24h': data['usd_24h_vol'],
                'change_24h': data['usd_24h_change'],
                'timestamp': self.last_update,
                'source': 'CoinGecko API'
            }

        except Exception as e:
            print(f"Warning: Could not fetch live data: {e}")
            print("Using fallback data...")
            return self._get_fallback_data()

    def fetch_bitcoin_historical(self, days: int = 365) -> Dict:
        """
        Fetch historical Bitcoin data.

        Parameters:
        -----------
        days : int
            Number of days of history (max 365 for free API)

        Returns:
        --------
        Dict with prices and timestamps
        """
        try:
            url = f"{self.coingecko_base}/coins/bitcoin/market_chart"
            params = {
                'vs_currency': 'usd',
                'days': days,
                'interval': 'daily'
            }

            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()

            prices = [p[1] for p in data['prices']]
            timestamps = [p[0] for p in data['prices']]
            market_caps = [p[1] for p in data['market_caps']]

            return {
                'prices': np.array(prices),
                'timestamps': timestamps,
                'market_caps': np.array(market_caps),
                'n_days': len(prices),
                'source': 'CoinGecko API'
            }

        except Exception as e:
            print(f"Warning: Could not fetch historical data: {e}")
            return self._generate_synthetic_historical(days)

    def estimate_energy_consumption(self, price: float) -> float:
        """
        Estimate Bitcoin energy consumption based on price.

        Uses empirical relationship: higher price → more mining → more energy

        Parameters:
        -----------
        price : float
            Current Bitcoin price

        Returns:
        --------
        float
            Estimated annual energy (TWh)
        """
        # Empirical model: Energy scales roughly with price
        # Based on historical data: ~150 TWh at $40k-50k
        base_energy = 120  # TWh at baseline
        price_factor = price / 40000  # Normalize to $40k
        energy_twh = base_energy * (0.5 + 0.5 * price_factor)

        # Cap at reasonable bounds
        return np.clip(energy_twh, 50, 250)

    def compute_energy_metrics(self, current_data: Dict, historical_data: Dict) -> Dict:
        """
        Compute energy-related metrics from price data.

        Returns:
        --------
        Dict with energy_price, volatility, etc.
        """
        # Estimate current energy
        current_energy = self.estimate_energy_consumption(current_data['price'])

        # Compute volatility from historical prices
        prices = historical_data['prices']
        returns = np.diff(np.log(prices))
        returns = returns[np.isfinite(returns)]
        volatility = np.std(returns) * np.sqrt(252)  # Annualize

        # Compute energy cost ratio (simplified)
        market_cap = current_data['market_cap']
        electricity_price = 0.05  # $/kWh
        cumulative_energy_cost = current_energy * electricity_price * 1e9 * 365  # Rough estimate

        energy_ratio = market_cap / cumulative_energy_cost if cumulative_energy_cost > 0 else 1.0

        return {
            'energy_price': energy_ratio,  # Normalized energy unit price
            'volatility': volatility,
            'energy_twh': current_energy,
            'market_cap': market_cap,
            'current_price': current_data['price'],
            'timestamp': current_data['timestamp']
        }

    def _get_fallback_data(self) -> Dict:
        """Fallback data if API fails."""
        return {
            'price': 45000.0,
            'market_cap': 880e9,
            'volume_24h': 25e9,
            'change_24h': 2.5,
            'timestamp': datetime.now(),
            'source': 'Fallback (API unavailable)'
        }

    def _generate_synthetic_historical(self, days: int) -> Dict:
        """Generate synthetic historical data."""
        np.random.seed(42)
        returns = np.random.normal(0.0005, 0.03, days)
        prices = 40000 * np.exp(np.cumsum(returns))

        return {
            'prices': prices,
            'timestamps': list(range(days)),
            'market_caps': prices * 19.5e6,  # Approximate supply
            'n_days': days,
            'source': 'Synthetic (API unavailable)'
        }

    def get_live_pricing_parameters(self, historical_days: int = 365) -> Dict:
        """
        Get all parameters needed for option pricing from live data.

        This is the main function to use.

        Parameters:
        -----------
        historical_days : int
            Days of history for volatility estimation

        Returns:
        --------
        Dict with S0, sigma, and other parameters
        """
        print("Fetching live Bitcoin data...")

        # Fetch current data
        current = self.fetch_bitcoin_price()
        print(f"✓ Current BTC price: ${current['price']:,.2f}")

        # Fetch historical data
        historical = self.fetch_bitcoin_historical(days=historical_days)
        print(f"✓ Loaded {historical['n_days']} days of history")

        # Compute energy metrics
        metrics = self.compute_energy_metrics(current, historical)
        print(f"✓ Estimated volatility: {metrics['volatility']:.1%}")

        return {
            'S0': metrics['energy_price'],
            'sigma': metrics['volatility'],
            'T': 1.0,
            'r': 0.05,
            'K': metrics['energy_price'],  # ATM
            'btc_price': current['price'],
            'market_cap': current['market_cap'],
            'energy_twh': metrics['energy_twh'],
            'timestamp': current['timestamp'],
            'source': current['source']
        }


# Quick test
if __name__ == "__main__":
    print("Testing Live Data Fetcher...\n")

    fetcher = LiveDataFetcher()
    params = fetcher.get_live_pricing_parameters()

    print("\nLive Pricing Parameters:")
    print(f"  Energy Price (S₀): ${params['S0']:.4f}")
    print(f"  Volatility (σ):    {params['sigma']:.1%}")
    print(f"  BTC Price:         ${params['btc_price']:,.2f}")
    print(f"  Last Update:       {params['timestamp']}")
    print(f"  Data Source:       {params['source']}")

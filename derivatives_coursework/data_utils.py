"""
Data Utilities - Simple Bitcoin Energy Data Loading
===================================================

Load and process Bitcoin energy consumption data.
"""

import numpy as np


def load_bitcoin_energy_data(use_real_data=True):
    """
    Load Bitcoin energy data.

    Returns energy price and volatility for option pricing.

    Returns:
    --------
    dict with keys:
        - S0: Current energy unit price
        - sigma: Volatility (annualized)
        - description: Data summary
    """

    if use_real_data:
        try:
            # Try to load from empirical folder
            import pandas as pd
            import os

            # Look for Bitcoin data
            data_dir = '../empirical'
            if os.path.exists(data_dir):
                # Try different file names
                for filename in ['bitcoin_ceir_final.csv', 'bitcoin_ceir_complete.csv', 'btc_ds_parsed.csv']:
                    filepath = os.path.join(data_dir, filename)
                    if os.path.exists(filepath):
                        df = pd.read_csv(filepath)

                        # Compute energy cost ratio
                        if 'Market_Cap' in df.columns:
                            # Simple approximation of energy unit price
                            # (In reality, this would be Market Cap / Cumulative Energy Cost)
                            prices = df['Market_Cap'].values / 1e12  # Normalize

                            # Compute returns and volatility
                            returns = np.diff(np.log(prices))
                            returns = returns[np.isfinite(returns)]

                            S0 = prices[-1] / prices[0]  # Normalized to ~1.0
                            sigma = np.std(returns) * np.sqrt(252)  # Annualize

                            return {
                                'S0': S0,
                                'sigma': sigma,
                                'description': f'Real Bitcoin data: {len(df)} days, volatility={sigma:.1%}'
                            }

        except Exception as e:
            print(f"Could not load real data: {e}")
            print("Using synthetic data...")

    # Synthetic data (for demo purposes)
    return generate_synthetic_data()


def generate_synthetic_data():
    """
    Generate synthetic Bitcoin-like energy data.

    Based on realistic parameters from Bitcoin's history.
    """
    np.random.seed(42)

    # Simulate 2000 days of Bitcoin-like data
    n_days = 2000
    daily_returns = np.random.normal(0.0005, 0.03, n_days)
    price_path = 1.0 * np.exp(np.cumsum(daily_returns))

    # Compute statistics
    S0 = price_path[-1]
    returns = np.diff(np.log(price_path))
    sigma = np.std(returns) * np.sqrt(252)

    return {
        'S0': S0,
        'sigma': sigma,
        'description': f'Synthetic data: {n_days} days, volatility={sigma:.1%}'
    }


def get_default_parameters():
    """
    Get default parameters for option pricing.

    Returns standard parameters suitable for Bitcoin energy derivatives.
    """
    data = load_bitcoin_energy_data()

    return {
        'S0': data['S0'],
        'K': data['S0'],  # At-the-money
        'T': 1.0,  # 1 year
        'r': 0.05,  # 5% risk-free rate
        'sigma': data['sigma'],
        'N': 100  # Steps
    }


# Quick test
if __name__ == "__main__":
    print("Loading Bitcoin energy data...")
    data = load_bitcoin_energy_data()
    print(f"S0: ${data['S0']:.4f}")
    print(f"Volatility: {data['sigma']:.2%}")
    print(f"Description: {data['description']}")

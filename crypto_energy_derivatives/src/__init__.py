"""
Cryptocurrency Energy Derivatives Pricing Framework
===================================================

A comprehensive toolkit for pricing derivatives on cryptocurrency energy costs.

Modules:
--------
data_loader : Load and process cryptocurrency data
energy_analyzer : Analyze energy cost relationships
american_option : Price American-style options
derivatives_pricer : Main pricing engine
greeks : Compute option Greeks
visualization : Plotting utilities

Example:
--------
>>> from src.data_loader import CryptoDataLoader
>>> from src.derivatives_pricer import DerivativesPricer
>>>
>>> loader = CryptoDataLoader()
>>> data = loader.load_bitcoin_data()
>>>
>>> pricer = DerivativesPricer(S0=1.0, sigma=0.45, r=0.05)
>>> price = pricer.price_american_call(K=1.0, T=1.0)
"""

__version__ = '1.0.0'
__author__ = 'Derivative Securities Final Project'

from .data_loader import CryptoDataLoader
from .energy_analyzer import EnergyAnalyzer
from .american_option import AmericanOptionPricer
from .derivatives_pricer import DerivativesPricer
from .greeks import GreeksCalculator
from .visualization import Visualizer

__all__ = [
    'CryptoDataLoader',
    'EnergyAnalyzer',
    'AmericanOptionPricer',
    'DerivativesPricer',
    'GreeksCalculator',
    'Visualizer',
]

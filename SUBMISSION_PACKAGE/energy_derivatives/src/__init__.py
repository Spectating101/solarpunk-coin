"""
Energy Derivatives Pricing Framework
=====================================

A quantitative framework for pricing energy-backed digital assets using 
binomial trees, Monte-Carlo simulation, and risk-neutral valuation.

Modules:
--------
- binomial: Binomial Option Pricing Model (BOPM)
- monte_carlo: Monte-Carlo simulation for derivative pricing
- sensitivities: Greeks calculation (Delta, Vega, Theta, Rho)
- plots: Visualization and results plotting
- data_loader: Data loading and preprocessing for CEIR integration

Author: Energy Finance Research Group
Year: 2025
"""

__version__ = "1.0.0"
__author__ = "Energy Finance Research"

from . import binomial
from . import monte_carlo
from . import sensitivities
from . import plots
from . import data_loader

__all__ = [
    'binomial',
    'monte_carlo', 
    'sensitivities',
    'plots',
    'data_loader'
]

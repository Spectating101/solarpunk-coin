"""
SPK Derivatives: Energy Derivatives Pricing Framework
======================================================

A quantitative framework for pricing energy derivatives (solar, wind, hydro)
using binomial trees, Monte-Carlo simulation, and risk-neutral valuation.

Features:
---------
- Multi-energy support: Solar, Wind, Hydroelectric
- Binomial Option Pricing Model (BOPM)
- Monte-Carlo simulation for derivative pricing
- Greeks calculation (Delta, Vega, Theta, Rho, Gamma)
- Mean-reversion models (Ornstein-Uhlenbeck) for energy prices
- Jump-diffusion models (Merton) for price spikes
- Implied volatility calibration from market data
- NASA POWER API integration for global data
- Geographic presets: 10+ world locations optimized for each energy type
- Professional workflow tools (validation, comparison, batch pricing)
- Context translation (raw data → kWh → dollar values)

Author: SPK Derivatives Team
Year: 2025
"""

__version__ = "0.5.0"
__author__ = "SPK Derivatives Team"

# Import core modules
from . import binomial
from . import monte_carlo
from . import sensitivities
from . import data_loader

# Import advanced models
from . import mean_reversion
from . import jump_diffusion
from . import implied_vol
from . import data_loader_nasa
from . import data_loader_base  # Multi-energy support
from . import data_loader_wind  # Multi-energy support
from . import data_loader_hydro  # Multi-energy support
from . import location_guide  # Geographic presets
from . import live_data
from . import context_translator
from . import results_manager

# Optional: plots (requires matplotlib)
try:
    from . import plots
except ImportError:
    plots = None  # matplotlib not installed

# Optional: analysis (sensitivity/stress/excel - openpyxl for excel)
try:
    from . import analysis
    from .analysis import (
        sensitivity_table,
        stress_test_volatility,
        stress_test_rates,
        combined_stress_test,
        export_to_excel,
        run_full_analysis,
        scenario_comparison,
        break_even_analysis,
        portfolio_greeks,
        pnl_calculator,
    )
except ImportError:
    analysis = None  # pandas required

# Import commonly used functions for convenience
from .data_loader_nasa import load_solar_parameters, fetch_nasa_data
from .data_loader import load_parameters
from .binomial import BinomialTree
from .monte_carlo import MonteCarloSimulator, price_energy_derivative_mc
from .sensitivities import GreeksCalculator, compute_energy_derivatives_greeks as calculate_greeks

# Import multi-energy data loaders
from .data_loader_base import EnergyDataLoader  # Abstract base class
from .data_loader_wind import WindDataLoader  # Wind energy support
from .data_loader_hydro import HydroDataLoader  # Hydroelectric support

# Import geographic location guide
from .location_guide import (
    get_location,
    list_locations,
    search_by_country,
    get_best_location_for_energy,
    format_location_table,
)

# Import context translator (sophistication layer)
from .context_translator import (
    SolarSystemContext,
    PriceTranslator,
    VolatilityTranslator,
    GreeksTranslator,
    create_contextual_summary
)

# Import results manager (professional workflow)
from .results_manager import (
    PricingResult,
    ResultsComparator,
    PricingValidator,
    batch_price,
    comparative_context,
    break_even_analysis
)

__all__ = [
    # Modules
    'binomial',
    'monte_carlo',
    'sensitivities',
    'plots',
    'data_loader',
    'data_loader_nasa',
    'data_loader_base',  # Multi-energy support
    'data_loader_wind',  # Multi-energy support
    'data_loader_hydro',  # Multi-energy support
    'location_guide',  # Geographic presets
    'live_data',
    'context_translator',
    'results_manager',

    # Convenience functions
    'load_solar_parameters',
    'fetch_nasa_data',
    'load_parameters',
    'BinomialTree',
    'MonteCarloSimulator',
    'price_energy_derivative_mc',
    'GreeksCalculator',
    'calculate_greeks',

    # Multi-energy data loaders
    'EnergyDataLoader',  # Abstract base
    'WindDataLoader',  # Wind support
    'HydroDataLoader',  # Hydro support

    # Geographic location guide
    'get_location',
    'list_locations',
    'search_by_country',
    'get_best_location_for_energy',
    'format_location_table',

    # Context translation (sophistication layer)
    'SolarSystemContext',
    'PriceTranslator',
    'VolatilityTranslator',
    'GreeksTranslator',
    'create_contextual_summary',

    # Results management (professional workflow)
    'PricingResult',
    'ResultsComparator',
    'PricingValidator',
    'batch_price',
    'comparative_context',
    'break_even_analysis',

    # Analysis utilities (sensitivity, stress test, excel, comparison, p&l)
    'analysis',
    'sensitivity_table',
    'stress_test_volatility',
    'stress_test_rates',
    'combined_stress_test',
    'export_to_excel',
    'run_full_analysis',
    'scenario_comparison',
    'break_even_analysis',
    'portfolio_greeks',
    'pnl_calculator',
]

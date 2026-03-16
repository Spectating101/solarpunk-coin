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

# Import advanced models
# Import core modules
from . import data_loader_base  # Multi-energy support
from . import data_loader_hydro  # Multi-energy support
from . import data_loader_wind  # Multi-energy support
from . import location_guide  # Geographic presets
from . import (
    binomial,
    context_translator,
    data_loader,
    data_loader_nasa,
    implied_vol,
    jump_diffusion,
    live_data,
    mean_reversion,
    monte_carlo,
    results_manager,
    sensitivities,
)

# Optional: plots (requires matplotlib)
try:
    from . import plots
except ImportError:
    plots = None  # matplotlib not installed

# Optional: analysis (sensitivity/stress/excel - openpyxl for excel)
try:
    from . import analysis
    from .analysis import (
        combined_stress_test,
        export_to_excel,
        pnl_calculator,
        portfolio_greeks,
        run_full_analysis,
        scenario_comparison,
        sensitivity_table,
        stress_test_rates,
        stress_test_volatility,
    )
except ImportError:
    analysis = None  # pandas required

from .binomial import BinomialTree

# Import context translator (sophistication layer)
from .context_translator import (
    GreeksTranslator,
    PriceTranslator,
    SolarSystemContext,
    VolatilityTranslator,
    create_contextual_summary,
)
from .data_loader import load_parameters

# Import multi-energy data loaders
from .data_loader_base import EnergyDataLoader  # Abstract base class
from .data_loader_hydro import HydroDataLoader  # Hydroelectric support

# Import commonly used functions for convenience
from .data_loader_nasa import fetch_nasa_data, load_solar_parameters
from .data_loader_wind import WindDataLoader  # Wind energy support

# Import geographic location guide
from .location_guide import (
    format_location_table,
    get_best_location_for_energy,
    get_location,
    list_locations,
    search_by_country,
)
from .monte_carlo import MonteCarloSimulator, price_energy_derivative_mc

# Import results manager (professional workflow)
from .results_manager import (
    PricingResult,
    PricingValidator,
    ResultsComparator,
    batch_price,
    break_even_analysis,
    comparative_context,
)
from .sensitivities import GreeksCalculator
from .sensitivities import compute_energy_derivatives_greeks as calculate_greeks

__all__ = [
    # Modules
    "binomial",
    "monte_carlo",
    "sensitivities",
    "plots",
    "data_loader",
    "data_loader_nasa",
    "data_loader_base",  # Multi-energy support
    "data_loader_wind",  # Multi-energy support
    "data_loader_hydro",  # Multi-energy support
    "location_guide",  # Geographic presets
    "live_data",
    "context_translator",
    "results_manager",
    "mean_reversion",
    "jump_diffusion",
    "implied_vol",
    # Convenience functions
    "load_solar_parameters",
    "fetch_nasa_data",
    "load_parameters",
    "BinomialTree",
    "MonteCarloSimulator",
    "price_energy_derivative_mc",
    "GreeksCalculator",
    "calculate_greeks",
    # Multi-energy data loaders
    "EnergyDataLoader",  # Abstract base
    "WindDataLoader",  # Wind support
    "HydroDataLoader",  # Hydro support
    # Geographic location guide
    "get_location",
    "list_locations",
    "search_by_country",
    "get_best_location_for_energy",
    "format_location_table",
    # Context translation (sophistication layer)
    "SolarSystemContext",
    "PriceTranslator",
    "VolatilityTranslator",
    "GreeksTranslator",
    "create_contextual_summary",
    # Results management (professional workflow)
    "PricingResult",
    "ResultsComparator",
    "PricingValidator",
    "batch_price",
    "comparative_context",
    "break_even_analysis",
    # Analysis utilities (sensitivity, stress test, excel, comparison, p&l)
    "analysis",
    "sensitivity_table",
    "stress_test_volatility",
    "stress_test_rates",
    "combined_stress_test",
    "export_to_excel",
    "run_full_analysis",
    "scenario_comparison",
    "portfolio_greeks",
    "pnl_calculator",
]

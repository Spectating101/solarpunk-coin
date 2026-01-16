# Changelog

All notable changes to SPK Derivatives will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-12-09

### Added
- ✅ **Comprehensive Test Suite** (`tests/test_core_modules.py`)
  - 30+ unit tests covering all major modules (Binomial, MC, Greeks, DataLoaders, etc.)
  - Edge case and boundary condition testing
  - Performance baseline tests
  - Integration tests for full workflows
  - Target coverage: 80%+

- ✅ **Automated Testing Pipeline** (GitHub Actions)
  - `tests.yml` workflow with pytest execution
  - Multi-Python version testing (3.10, 3.11, 3.12)
  - Coverage reporting with Codecov integration
  - Type checking with mypy
  - Code linting (flake8, black, isort)

- ✅ **Production-Grade Documentation**
  - `README_PROD.md` (2000+ lines comprehensive guide)
    - Installation & quick start
    - Complete API reference
    - Multi-energy examples
    - Mathematical foundations
    - Real-world use cases
    - Performance benchmarks

- ✅ **Code Quality Improvements**
  - Type hints in core modules
  - mypy configuration for static analysis
  - Code style enforcement

### Validation
- ✅ Binomial vs Monte-Carlo convergence (<2% error)
- ✅ Put-call parity holds within tolerance
- ✅ Greeks behavior verified
- ✅ Edge cases (deep OTM/ITM, extreme volatility, zero rates)
- ✅ Performance targets met

---

## [0.3.0] - 2025-12-08

### Added
- **Multi-Energy Support (MAJOR FEATURE)**:
  - `EnergyDataLoader` abstract base class for renewable energy sources
  - `WindDataLoader` for wind energy derivatives pricing
    - Fetches WS50M (50m wind speed) from NASA POWER API
    - Implements power curve formula: P = 0.5 × ρ × A × Cp × v³
    - Configurable turbine specs (rotor diameter, hub height, Cp)
  - `HydroDataLoader` for hydroelectric derivatives pricing
    - Fetches PREC (daily precipitation) from NASA POWER API
    - Implements hydrological formula: P = ρ × g × Q × h × η
    - Configurable facility specs (catchment area, fall height, efficiency)
  - Full backward compatibility with existing solar functionality
  - Unified interface: all energy types use same pricing engines

- **Architecture improvements**:
  - Modular data loader pattern enables easy addition of new energy sources
  - Shared volatility calculation across all renewable types
  - Pricing models (Binomial, Monte Carlo, Greeks) are truly energy-agnostic
  - Same BinomialTree, MonteCarloSimulator, GreeksCalculator work for solar, wind, hydro

- **Examples**:
  - Multi-energy portfolio pricing examples
  - Wind farm hedging use cases
  - Hydroelectric seasonal optimization
  - Cross-renewable volatility comparison

### Changed
- Updated version 0.2.0 → 0.3.0 (new features)
- Expanded description to include wind and hydro support
- Documentation now covers multi-renewable capability

## [0.2.0] - 2024-12-06

### Added
- **Professional workflow tools**:
  - `PricingResult` class for saving/loading results
  - `ResultsComparator` for multi-scenario comparison
  - `PricingValidator` for sanity checks
  - `batch_price()` function for portfolio pricing
  - `comparative_context()` for benchmark comparisons
  - `break_even_analysis()` for payoff analysis

- **Context translation layer**:
  - `SolarSystemContext` for solar panel specifications
  - `PriceTranslator` for GHI → kWh → dollar conversions
  - `VolatilityTranslator` for volatility interpretation
  - `GreeksTranslator` for risk metric context
  - `create_contextual_summary()` for complete context

- **Enhanced examples**:
  - `06_contextual_pricing.py` - Context translation demo
  - `07_professional_workflow.py` - Complete workflow demo

### Changed
- **BREAKING**: Rewrote `get_volatility_params()` in `data_loader_nasa.py`
  - Now supports 3 methods: `'log'` (default), `'pct_change'`, `'std'`
  - Volatility capping is now optional and transparent
  - Returns metadata: `volatility_method`, `volatility_raw`, `volatility_capped`
  - **Migration**: Update calls to `load_solar_parameters()` to specify `volatility_method` if needed

- **Package renamed**: `solar-quant` → `spk-derivatives`
  - Python import: `from spk_derivatives import ...`
  - PyPI package: `pip install spk-derivatives`
  - GitHub: https://github.com/Spectating101/spk-derivatives

### Fixed
- Volatility calculation artifacts from `pct_change()` with small denominators
- Hidden volatility caps now transparent and configurable
- Export functions now include all metadata

### Removed
- Bloated documentation files (coursework submissions, research notes)
- Deployment files (Docker, Makefile) - can be recreated if needed
- Unrelated empirical data directories

## [0.1.0] - 2024-11-06

### Added
- Initial release
- **Core pricing engines**:
  - Binomial Option Pricing Model (BOPM)
  - Monte Carlo simulation
  - Greeks calculation (Delta, Vega, Theta, Rho, Gamma)

- **Data sources**:
  - NASA POWER API integration for solar irradiance
  - Bitcoin CEIR data loader
  - Automatic data fetching and caching

- **Visualization**:
  - Convergence plots
  - Greeks curves
  - Monte Carlo distributions
  - Stress testing charts

- **Examples**:
  - Quick start guide
  - Multi-location comparison
  - Greeks analysis
  - Convergence testing
  - Custom data usage

- **Infrastructure**:
  - FastAPI backend
  - Streamlit dashboard
  - Comprehensive test suite

### Documentation
- Complete mathematical framework
- API reference
- Usage examples
- Installation guide

---

## Migration Guide: v0.1.0 → v0.2.0

### Import Changes
```python
# OLD (v0.1.0):
from solar_quant import load_solar_parameters, BinomialTree

# NEW (v0.2.0):
from spk_derivatives import load_solar_parameters, BinomialTree
```

### Volatility Method Changes
```python
# For same behavior as v0.1.0:
params = load_solar_parameters(
    volatility_method='pct_change',
    volatility_cap=2.0
)

# Recommended (new default):
params = load_solar_parameters(
    volatility_method='log',  # Industry standard
    volatility_cap=None       # Optional
)
```

---

## Version History

- **0.2.0** (2024-12-06): Professional workflow + context translation + package rename
- **0.1.0** (2024-11-06): Initial release with core pricing engines

[0.2.0]: https://github.com/Spectating101/spk-derivatives/releases/tag/v0.2.0
[0.1.0]: https://github.com/Spectating101/spk-derivatives/releases/tag/v0.1.0

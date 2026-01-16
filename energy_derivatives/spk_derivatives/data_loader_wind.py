"""
Wind Power Data Loader for Energy Derivatives
==============================================

Fetches wind speed data from NASA POWER API and converts to energy prices
using Betz law power curve model.

Location: Global support via NASA POWER API
Data Source: NASA MERRA-2 reanalysis data
Parameters: WS10M (10m wind speed), WS50M (50m wind speed), WD10M (wind direction)

Wind Power Calculation:
-----------------------
Power (Watts) = 0.5 × ρ × A × Cp × v³

where:
  ρ = air density (~1.225 kg/m³ at sea level)
  A = rotor swept area = π × (diameter/2)²
  Cp = power coefficient (0.35-0.45 typical, max 0.59 = Betz limit)
  v = wind speed (m/s)

Daily Energy = Power × 24 hours / 1000 (convert to kWh)
Economic Value = Daily Energy × Energy Value ($/kWh)

Key Classes:
-----------
WindDataLoader: Wind speed → economic price conversion

Key Methods:
-----------
fetch_data(): Fetch wind speed from NASA POWER API
compute_price(): Convert wind speed to power to price
load_parameters(): Load all parameters for wind derivative pricing

Geographic Presets:
-------------------
Use preset locations with location_name parameter instead of manual coordinates:

>>> from spk_derivatives import WindDataLoader
>>> 
>>> # Use named location instead of coordinates
>>> loader = WindDataLoader(location_name='Aalborg')  # Denmark - excellent wind
>>> params = loader.load_parameters()
>>>
>>> # Or see available locations
>>> from spk_derivatives.location_guide import list_locations, format_location_table
>>> print(format_location_table())
"""

import requests
import pandas as pd
import numpy as np
import warnings
from typing import Optional
from pathlib import Path
import time

from .data_loader_base import EnergyDataLoader
from .location_guide import get_location


# --- CONFIGURATION ---
# Default location (Phoenix, Arizona - excellent wind resource)
DEFAULT_LAT = 33.45
DEFAULT_LON = -112.07
DEFAULT_START_YEAR = 2020
DEFAULT_END_YEAR = 2024

# Wind turbine specifications
DEFAULT_ROTOR_DIAMETER_M = 80.0  # 80m diameter = 5 MW typical turbine
DEFAULT_HUB_HEIGHT_M = 80.0      # Hub height at 80m (50-100m typical)
DEFAULT_POWER_COEFFICIENT = 0.40  # Cp = 0.40 (40% efficient)

# API configuration
MAX_RETRIES = 3
RETRY_BACKOFF = 1.5  # seconds
API_TIMEOUT = 30  # seconds


class WindDataLoader(EnergyDataLoader):
    """
    Wind speed data loader for energy derivative pricing.
    
    Fetches daily wind speed from NASA POWER API and converts to economic
    prices using power curve formula. Supports configurable turbine specifications.
    
    Parameters
    ----------
    lat : float
        Latitude (default: 33.45 for Phoenix, AZ)
    lon : float
        Longitude (default: -112.07 for Phoenix, AZ)
    start_year : int
        Start year for data (default: 2020)
    end_year : int
        End year for data (default: 2024)
    rotor_diameter_m : float
        Rotor diameter in meters (default: 80.0)
    hub_height_m : float
        Hub height in meters (default: 80.0)
    power_coefficient : float
        Power coefficient Cp (default: 0.40, range: 0.35-0.45)
    air_density : float
        Air density in kg/m³ (default: 1.225 at sea level)
    energy_value_per_kwh : float
        Economic value per kWh (default: 0.08 = $0.08/kWh)
    
    Attributes
    ----------
    rotor_area : float
        Rotor swept area in m² = π × (diameter/2)²
    
    Examples
    --------
    >>> # Default location (Phoenix, AZ) with standard turbine
    >>> loader = WindDataLoader()
    >>> params = loader.load_parameters()
    >>> print(f"Wind volatility: {params['sigma']:.1%}")
    
    >>> # Custom location and turbine specs
    >>> loader = WindDataLoader(
    ...     lat=39.74, lon=-104.99,  # Denver, Colorado
    ...     rotor_diameter_m=100,    # Larger turbine
    ...     hub_height_m=100
    ... )
    >>> params = loader.load_parameters(energy_value_per_kwh=0.09)
    """
    
    def __init__(
        self,
        lat: float = None,
        lon: float = None,
        location_name: str = None,
        start_year: int = DEFAULT_START_YEAR,
        end_year: int = DEFAULT_END_YEAR,
        rotor_diameter_m: float = None,
        hub_height_m: float = None,
        power_coefficient: float = None,
        air_density: float = 1.225,
        energy_value_per_kwh: float = 0.08,
    ):
        """
        Initialize wind data loader.
        
        Parameters
        ----------
        location_name : str, optional
            Preset location name (e.g., 'Aalborg', 'Kansas City', 'Edinburgh').
            If provided, lat/lon and wind_params are auto-populated from presets.
            If not provided, uses manual coordinates (lat, lon).
        lat : float, optional
            Manual latitude (ignored if location_name provided)
        lon : float, optional
            Manual longitude (ignored if location_name provided)
        rotor_diameter_m : float, optional
            Rotor diameter in meters. If None and location provided, uses preset.
            Otherwise defaults to 80.0m.
        hub_height_m : float, optional
            Hub height in meters. If None and location provided, uses preset.
            Otherwise defaults to 80.0m.
        power_coefficient : float, optional
            Power coefficient Cp. If None and location provided, uses preset.
            Otherwise defaults to 0.40.
        """
        # Handle location-based initialization
        if location_name is not None:
            location_data = get_location(location_name)
            lat, lon = location_data['coordinates']
            wind_params = location_data['wind_params']
            
            # Use preset values if not overridden
            if rotor_diameter_m is None:
                rotor_diameter_m = wind_params['rotor_diameter_m']
            if hub_height_m is None:
                hub_height_m = wind_params['hub_height_m']
            if power_coefficient is None:
                power_coefficient = wind_params['power_coefficient']
            
            self.location_name = location_name
            self.landscape = location_data['landscape']
            self.seasonal_pattern = location_data['seasonal_pattern']
            self.wind_rating = location_data['wind_rating']
        else:
            # Manual coordinate mode
            if lat is None:
                lat = DEFAULT_LAT
            if lon is None:
                lon = DEFAULT_LON
            if rotor_diameter_m is None:
                rotor_diameter_m = DEFAULT_ROTOR_DIAMETER_M
            if hub_height_m is None:
                hub_height_m = DEFAULT_HUB_HEIGHT_M
            if power_coefficient is None:
                power_coefficient = DEFAULT_POWER_COEFFICIENT
            
            self.location_name = None
            self.landscape = "Unknown"
            self.seasonal_pattern = "Unknown"
            self.wind_rating = None
        
        super().__init__(lat, lon, start_year, end_year)
        
        # Turbine specifications
        self.rotor_diameter = rotor_diameter_m
        self.hub_height = hub_height_m
        self.rotor_area = np.pi * (rotor_diameter_m / 2) ** 2
        self.power_coefficient = power_coefficient
        self.air_density = air_density
        self.energy_value = energy_value_per_kwh
        
        # Validate specifications
        if power_coefficient <= 0 or power_coefficient > 0.593:  # Betz limit
            warnings.warn(
                f"Cp={power_coefficient} is unusual. "
                f"Typical range: 0.35-0.45. Max (Betz limit): 0.593"
            )
    
    def fetch_data(self, use_50m: bool = True) -> pd.DataFrame:
        """
        Fetch wind speed data from NASA POWER API.
        
        Parameters
        ----------
        use_50m : bool
            If True, use WS50M (50m height, typical turbine hub).
            If False, use WS10M (10m height, standard measurement).
        
        Returns
        -------
        pd.DataFrame
            DataFrame with columns: WS10M, WS50M, WD10M, Price
            Index: DatetimeIndex with daily frequency
        """
        # Check cache first
        cache_dir = Path(__file__).parent.parent / 'data'
        cache_file = cache_dir / f'nasa_wind_{self.lat}_{self.lon}_{self.start_year}_{self.end_year}.csv'
        
        if cache_file.exists():
            try:
                print(f"📁 Loading cached NASA wind data from {cache_file}")
                df = pd.read_csv(cache_file, parse_dates=['Date'], index_col='Date')
                if df.empty or 'WS50M' not in df.columns:
                    raise ValueError("Cached file is invalid")
                print(f"✅ Loaded {len(df)} days of cached wind data")
                return df
            except Exception as exc:
                warnings.warn(f"Cache unusable ({exc}); refetching from API")
        
        # Fetch from NASA POWER API
        base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        params = {
            "parameters": "WS10M,WS50M,WD10M",  # Wind speed at 10m & 50m + direction
            "community": "RE",                   # Renewable Energy
            "longitude": self.lon,
            "latitude": self.lat,
            "start": f"{self.start_year}0101",
            "end": f"{self.end_year}1231",
            "format": "JSON"
        }
        
        print(f"📡 Connecting to NASA MERRA-2 Data for Wind Speed ({self.lat}, {self.lon})...")
        print(f"   Date Range: {self.start_year}-01-01 to {self.end_year}-12-31")
        print(f"   Hub Height: {self.hub_height}m (using WS50M parameter)")
        
        response = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = requests.get(base_url, params=params, timeout=API_TIMEOUT)
                response.raise_for_status()
                break
            except requests.exceptions.RequestException as e:
                if attempt == MAX_RETRIES:
                    raise ConnectionError(f"NASA API failed after {MAX_RETRIES} attempts: {e}")
                sleep_for = RETRY_BACKOFF * attempt
                warnings.warn(
                    f"Attempt {attempt}/{MAX_RETRIES} failed. Retrying in {sleep_for:.1f}s"
                )
                time.sleep(sleep_for)
        
        if response is None:
            raise ConnectionError("NASA API response is None")
        
        # Parse JSON response
        try:
            data = response.json()
            properties = data['properties']
            parameter = properties.get('parameter', {})
            
            ws10m_dict = parameter.get('WS10M')
            ws50m_dict = parameter.get('WS50M')
            wd10m_dict = parameter.get('WD10M')
            
            if not all([ws10m_dict, ws50m_dict, wd10m_dict]):
                raise ValueError("Missing wind parameters in response")
            
            # Create DataFrame
            df = pd.DataFrame({
                'WS10M': pd.Series(ws10m_dict),
                'WS50M': pd.Series(ws50m_dict),
                'WD10M': pd.Series(wd10m_dict),
            })
            df.index = pd.to_datetime(df.index, format='%Y%m%d')
            df.index.name = 'Date'
            
        except (KeyError, ValueError) as e:
            raise ValueError(f"Failed to parse NASA API response: {e}")
        
        # Validate data
        original_len = len(df)
        df = df[(df['WS50M'] > 0) & (df['WS50M'] < 50)].copy()  # Remove invalid values
        removed = original_len - len(df)
        
        if removed > 0:
            warnings.warn(f"Removed {removed} days with invalid wind data")
        
        print(f"✅ Loaded {len(df)} days of wind speed data")
        
        # Cache for future use
        cache_dir.mkdir(parents=True, exist_ok=True)
        df.to_csv(cache_file)
        print(f"💾 Cached data to {cache_file}")
        
        return df
    
    def compute_price(
        self,
        df: pd.DataFrame,
        power_coefficient: Optional[float] = None,
        air_density: Optional[float] = None,
        energy_value_per_kwh: Optional[float] = None,
    ) -> np.ndarray:
        """
        Convert wind speed to economic price.
        
        Uses power curve formula:
        P = 0.5 × ρ × A × Cp × v³ (Watts)
        
        Parameters
        ----------
        df : pd.DataFrame
            DataFrame from fetch_data() with WS50M column
        power_coefficient : Optional[float]
            Power coefficient Cp (default: instance value)
        air_density : Optional[float]
            Air density (default: instance value)
        energy_value_per_kwh : Optional[float]
            $/kWh (default: instance value)
        
        Returns
        -------
        np.ndarray
            Array of daily energy prices
        
        Notes
        -----
        Power curve formula assumes Cp is constant (simplified).
        Real turbines have variable Cp depending on wind speed.
        """
        Cp = power_coefficient or self.power_coefficient
        rho = air_density or self.air_density
        energy_val = energy_value_per_kwh or self.energy_value
        
        wind_speed = df['WS50M'].values  # m/s
        
        # Calculate power (Watts)
        power_w = 0.5 * rho * self.rotor_area * Cp * (wind_speed ** 3)
        
        # Daily energy (kWh) = Power (W) × 24 hours / 1000
        daily_energy_kwh = (power_w * 24) / 1000
        
        # Economic price ($/day)
        prices = daily_energy_kwh * energy_val
        
        return prices.astype(np.float64)
    
    def load_parameters(
        self,
        T: float = 1.0,
        r: float = 0.05,
        volatility_method: str = 'log',
        volatility_cap: Optional[float] = None,
        power_coefficient: Optional[float] = None,
        air_density: Optional[float] = None,
        energy_value_per_kwh: Optional[float] = None,
    ) -> dict:
        """
        Load all parameters for wind derivative pricing.
        
        Parameters
        ----------
        T : float
            Time to maturity (years)
        r : float
            Risk-free rate
        volatility_method : str
            Volatility calculation method
        volatility_cap : Optional[float]
            Volatility cap for stability
        power_coefficient : Optional[float]
            Cp override
        air_density : Optional[float]
            Air density override
        energy_value_per_kwh : Optional[float]
            Energy value override
        
        Returns
        -------
        dict
            Pricing parameters with wind-specific metadata
        """
        # Call parent implementation
        params = super().load_parameters(
            T=T, r=r,
            volatility_method=volatility_method,
            volatility_cap=volatility_cap,
            power_coefficient=power_coefficient,
            air_density=air_density,
            energy_value_per_kwh=energy_value_per_kwh,
        )
        
        # Add wind-specific metadata
        params['energy_source'] = 'wind'
        params['turbine_specs'] = {
            'rotor_diameter_m': self.rotor_diameter,
            'hub_height_m': self.hub_height,
            'rotor_area_m2': float(self.rotor_area),
            'power_coefficient': power_coefficient or self.power_coefficient,
        }
        params['data_source'] = 'NASA MERRA-2 (POWER API)'
        params['parameter'] = 'WS50M (Wind Speed at 50m hub height)'
        
        return params

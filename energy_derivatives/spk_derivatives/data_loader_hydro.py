"""
Hydroelectric Power Data Loader for Energy Derivatives
=======================================================

Fetches precipitation and weather data from NASA POWER API and converts
to hydroelectric power prices using hydrological flow formulas.

Location: Global support via NASA POWER API
Data Source: NASA MERRA-2 reanalysis data
Parameters: PREC (precipitation, mm/day), T2M (temperature, °C), RH2M (relative humidity)

Hydroelectric Power Calculation:
--------------------------------
Power (Watts) = ρ × g × Q × h × η

where:
  ρ = water density (1000 kg/m³)
  g = gravitational acceleration (9.81 m/s²)
  Q = volumetric flow rate (m³/s)
  h = head/vertical drop (meters)
  η = turbine efficiency (0.85-0.90 typical)

Flow Rate Estimation from Precipitation:
Q (m³/s) = (PREC_mm × Catchment_Area_km² × Runoff_Coefficient) / 86,400

Daily Energy = Power × 86,400 seconds / 1000 (convert to kWh)
Economic Value = Daily Energy × Energy Value ($/kWh)

Key Classes:
-----------
HydroDataLoader: Precipitation → economic price conversion

Key Methods:
-----------
fetch_data(): Fetch precipitation from NASA POWER API
compute_price(): Convert precipitation to power to price
load_parameters(): Load all parameters for hydro derivative pricing

Geographic Presets:
-------------------
Use preset locations with location_name parameter instead of manual coordinates:

>>> from spk_derivatives import HydroDataLoader
>>> 
>>> # Use named location instead of coordinates
>>> loader = HydroDataLoader(location_name='Nepal')  # Himalayas - excellent hydro
>>> params = loader.load_parameters()
>>>
>>> # Or see available locations with hydro ratings
>>> from spk_derivatives.location_guide import list_locations
>>> hydro_locs = list_locations('hydro')
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
# Default location (Nepal/Himalayas - excellent hydro resource due to precipitation)
DEFAULT_LAT = 27.98
DEFAULT_LON = 86.92
DEFAULT_START_YEAR = 2020
DEFAULT_END_YEAR = 2024

# Hydroelectric facility specifications
DEFAULT_CATCHMENT_AREA_KM2 = 1000.0  # 1000 km² catchment (medium-sized facility)
DEFAULT_FALL_HEIGHT_M = 50.0         # 50m head (typical small/medium dam)
DEFAULT_RUNOFF_COEFFICIENT = 0.60    # 60% of rain reaches the dam
DEFAULT_TURBINE_EFFICIENCY = 0.87    # 87% conversion efficiency

# API configuration
MAX_RETRIES = 3
RETRY_BACKOFF = 1.5  # seconds
API_TIMEOUT = 30  # seconds


class HydroDataLoader(EnergyDataLoader):
    """
    Hydroelectric power data loader for energy derivative pricing.
    
    Fetches daily precipitation from NASA POWER API and converts to economic
    prices using hydrological power formula. Supports configurable facility specs.
    
    Parameters
    ----------
    lat : float
        Latitude (default: 27.98 for Nepal)
    lon : float
        Longitude (default: 86.92 for Nepal)
    start_year : int
        Start year for data (default: 2020)
    end_year : int
        End year for data (default: 2024)
    catchment_area_km2 : float
        Catchment area in km² (default: 1000.0)
    fall_height_m : float
        Vertical drop/head in meters (default: 50.0, typical: 30-100m)
    runoff_coefficient : float
        Fraction of precipitation reaching dam (default: 0.60, typical: 0.5-0.8)
    turbine_efficiency : float
        Turbine conversion efficiency (default: 0.87, typical: 0.85-0.92)
    energy_value_per_kwh : float
        Economic value per kWh (default: 0.06 = $0.06/kWh)
    
    Attributes
    ----------
    catchment_area_m2 : float
        Catchment area in m²
    
    Notes
    -----
    Hydroelectric power is highly seasonal (depends on rainfall patterns).
    Volatility is typically higher than solar/wind due to precipitation variability.
    
    Examples
    --------
    >>> # Nepal location with medium facility
    >>> loader = HydroDataLoader()
    >>> params = loader.load_parameters()
    >>> print(f"Hydro volatility: {params['sigma']:.1%}")
    
    >>> # Large facility in high-precipitation region
    >>> loader = HydroDataLoader(
    ...     lat=0.0, lon=32.0,       # East Africa
    ...     catchment_area_km2=5000,
    ...     fall_height_m=100
    ... )
    >>> params = loader.load_parameters(energy_value_per_kwh=0.07)
    """
    
    def __init__(
        self,
        lat: float = None,
        lon: float = None,
        location_name: str = None,
        start_year: int = DEFAULT_START_YEAR,
        end_year: int = DEFAULT_END_YEAR,
        catchment_area_km2: float = None,
        fall_height_m: float = None,
        runoff_coefficient: float = None,
        turbine_efficiency: float = None,
        energy_value_per_kwh: float = 0.06,
    ):
        """
        Initialize hydro data loader.
        
        Parameters
        ----------
        location_name : str, optional
            Preset location name (e.g., 'Nepal', 'Alps', 'Amazon Basin').
            If provided, lat/lon and hydro_params are auto-populated from presets.
            If not provided, uses manual coordinates (lat, lon).
        lat : float, optional
            Manual latitude (ignored if location_name provided)
        lon : float, optional
            Manual longitude (ignored if location_name provided)
        catchment_area_km2 : float, optional
            Catchment area in km². If None and location provided, uses preset.
            Otherwise defaults to 1000.0 km².
        fall_height_m : float, optional
            Fall/head height in meters. If None and location provided, uses preset.
            Otherwise defaults to 50.0 m.
        runoff_coefficient : float, optional
            Runoff fraction (0-1). If None and location provided, uses preset.
            Otherwise defaults to 0.60.
        turbine_efficiency : float, optional
            Turbine efficiency (0-1). If None and location provided, uses preset.
            Otherwise defaults to 0.87.
        """
        # Handle location-based initialization
        if location_name is not None:
            location_data = get_location(location_name)
            lat, lon = location_data['coordinates']
            hydro_params = location_data['hydro_params']
            
            # Use preset values if not overridden
            if catchment_area_km2 is None:
                catchment_area_km2 = hydro_params['catchment_area_km2']
            if fall_height_m is None:
                fall_height_m = hydro_params['fall_height_m']
            if runoff_coefficient is None:
                runoff_coefficient = hydro_params['runoff_coefficient']
            if turbine_efficiency is None:
                turbine_efficiency = hydro_params['turbine_efficiency']
            
            self.location_name = location_name
            self.landscape = location_data['landscape']
            self.seasonal_pattern = location_data['seasonal_pattern']
            self.hydro_rating = location_data['hydro_rating']
        else:
            # Manual coordinate mode
            if lat is None:
                lat = DEFAULT_LAT
            if lon is None:
                lon = DEFAULT_LON
            if catchment_area_km2 is None:
                catchment_area_km2 = DEFAULT_CATCHMENT_AREA_KM2
            if fall_height_m is None:
                fall_height_m = DEFAULT_FALL_HEIGHT_M
            if runoff_coefficient is None:
                runoff_coefficient = DEFAULT_RUNOFF_COEFFICIENT
            if turbine_efficiency is None:
                turbine_efficiency = DEFAULT_TURBINE_EFFICIENCY
            
            self.location_name = None
            self.landscape = "Unknown"
            self.seasonal_pattern = "Unknown"
            self.hydro_rating = None
        
        super().__init__(lat, lon, start_year, end_year)
        
        # Facility specifications
        self.catchment_area_km2 = catchment_area_km2
        self.catchment_area_m2 = catchment_area_km2 * 1e6  # Convert to m²
        self.fall_height = fall_height_m
        self.runoff_coefficient = runoff_coefficient
        self.turbine_efficiency = turbine_efficiency
        self.energy_value = energy_value_per_kwh
        
        # Validate specifications
        if fall_height_m < 1 or fall_height_m > 500:
            warnings.warn(f"Head of {fall_height_m}m is unusual. Typical: 30-100m")
        if runoff_coefficient < 0.3 or runoff_coefficient > 0.9:
            warnings.warn(
                f"Runoff coefficient {runoff_coefficient} is unusual. "
                f"Typical: 0.5-0.8"
            )
    
    def fetch_data(self) -> pd.DataFrame:
        """
        Fetch precipitation data from NASA POWER API.
        
        Returns
        -------
        pd.DataFrame
            DataFrame with columns: PREC, T2M, RH2M, Price
            Index: DatetimeIndex with daily frequency
        """
        # Check cache first
        cache_dir = Path(__file__).parent.parent / 'data'
        cache_file = cache_dir / f'nasa_hydro_{self.lat}_{self.lon}_{self.start_year}_{self.end_year}.csv'
        
        if cache_file.exists():
            try:
                print(f"📁 Loading cached NASA hydro data from {cache_file}")
                df = pd.read_csv(cache_file, parse_dates=['Date'], index_col='Date')
                if df.empty or 'PREC' not in df.columns:
                    raise ValueError("Cached file is invalid")
                print(f"✅ Loaded {len(df)} days of cached hydro data")
                return df
            except Exception as exc:
                warnings.warn(f"Cache unusable ({exc}); refetching from API")
        
        # Fetch from NASA POWER API
        base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        params = {
            "parameters": "PREC,T2M,RH2M",  # Precipitation + temperature + humidity
            "community": "RE",               # Renewable Energy
            "longitude": self.lon,
            "latitude": self.lat,
            "start": f"{self.start_year}0101",
            "end": f"{self.end_year}1231",
            "format": "JSON"
        }
        
        print(f"📡 Connecting to NASA MERRA-2 Data for Precipitation ({self.lat}, {self.lon})...")
        print(f"   Date Range: {self.start_year}-01-01 to {self.end_year}-12-31")
        print(f"   Catchment Area: {self.catchment_area_km2:.0f} km²")
        print(f"   Fall Height: {self.fall_height}m")
        
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
            
            prec_dict = parameter.get('PREC')
            t2m_dict = parameter.get('T2M')
            rh2m_dict = parameter.get('RH2M')
            
            if not all([prec_dict, t2m_dict, rh2m_dict]):
                raise ValueError("Missing hydro parameters in response")
            
            # Create DataFrame
            df = pd.DataFrame({
                'PREC': pd.Series(prec_dict),
                'T2M': pd.Series(t2m_dict),
                'RH2M': pd.Series(rh2m_dict),
            })
            df.index = pd.to_datetime(df.index, format='%Y%m%d')
            df.index.name = 'Date'
            
        except (KeyError, ValueError) as e:
            raise ValueError(f"Failed to parse NASA API response: {e}")
        
        # Validate data (remove negative or extreme values)
        original_len = len(df)
        df = df[(df['PREC'] >= 0) & (df['PREC'] < 500)].copy()  # Remove invalid
        removed = original_len - len(df)
        
        if removed > 0:
            warnings.warn(f"Removed {removed} days with invalid precipitation data")
        
        print(f"✅ Loaded {len(df)} days of precipitation data")
        print(f"   Mean precipitation: {df['PREC'].mean():.2f} mm/day")
        print(f"   Max precipitation: {df['PREC'].max():.2f} mm/day")
        
        # Cache for future use
        cache_dir.mkdir(parents=True, exist_ok=True)
        df.to_csv(cache_file)
        print(f"💾 Cached data to {cache_file}")
        
        return df
    
    def compute_price(
        self,
        df: pd.DataFrame,
        runoff_coefficient: Optional[float] = None,
        turbine_efficiency: Optional[float] = None,
        energy_value_per_kwh: Optional[float] = None,
    ) -> np.ndarray:
        """
        Convert precipitation to economic price.
        
        Uses hydroelectric power formula:
        P = ρ × g × Q × h × η (Watts)
        
        where Q is estimated from precipitation:
        Q = (PREC_mm × Catchment_m² × Runoff_Coeff) / 86,400 (m³/s)
        
        Parameters
        ----------
        df : pd.DataFrame
            DataFrame from fetch_data() with PREC column
        runoff_coefficient : Optional[float]
            Runoff coefficient (default: instance value)
        turbine_efficiency : Optional[float]
            Turbine efficiency (default: instance value)
        energy_value_per_kwh : Optional[float]
            $/kWh (default: instance value)
        
        Returns
        -------
        np.ndarray
            Array of daily energy prices
        
        Notes
        -----
        Assumes linear relationship between precipitation and flow (simplified).
        Real hydrological models are more complex (soil moisture, evaporation, etc.).
        """
        coeff = runoff_coefficient or self.runoff_coefficient
        eta = turbine_efficiency or self.turbine_efficiency
        energy_val = energy_value_per_kwh or self.energy_value
        
        prec_mm = df['PREC'].values
        
        # Convert precipitation to volumetric flow
        # Volume (m³) = Precipitation_mm × Catchment_area_m² / 1000
        # Flow rate (m³/s) = Volume / seconds_per_day
        volume_m3 = (prec_mm / 1000) * self.catchment_area_m2 * coeff
        flow_rate = volume_m3 / 86400  # m³/s (86400 seconds per day)
        
        # Calculate power (Watts)
        rho = 1000  # kg/m³ (water density)
        g = 9.81    # m/s² (gravity)
        power_w = rho * g * flow_rate * self.fall_height * eta
        
        # Daily energy (kWh)
        daily_energy_kwh = (power_w * 86400) / 1000
        
        # Economic price ($/day)
        prices = daily_energy_kwh * energy_val
        
        return prices.astype(np.float64)
    
    def load_parameters(
        self,
        T: float = 1.0,
        r: float = 0.05,
        volatility_method: str = 'log',
        volatility_cap: Optional[float] = None,
        runoff_coefficient: Optional[float] = None,
        turbine_efficiency: Optional[float] = None,
        energy_value_per_kwh: Optional[float] = None,
    ) -> dict:
        """
        Load all parameters for hydro derivative pricing.
        
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
        runoff_coefficient : Optional[float]
            Runoff coefficient override
        turbine_efficiency : Optional[float]
            Turbine efficiency override
        energy_value_per_kwh : Optional[float]
            Energy value override
        
        Returns
        -------
        dict
            Pricing parameters with hydro-specific metadata
        """
        # Call parent implementation
        params = super().load_parameters(
            T=T, r=r,
            volatility_method=volatility_method,
            volatility_cap=volatility_cap,
            runoff_coefficient=runoff_coefficient,
            turbine_efficiency=turbine_efficiency,
            energy_value_per_kwh=energy_value_per_kwh,
        )
        
        # Add hydro-specific metadata
        params['energy_source'] = 'hydro'
        params['facility_specs'] = {
            'catchment_area_km2': self.catchment_area_km2,
            'fall_height_m': self.fall_height,
            'runoff_coefficient': runoff_coefficient or self.runoff_coefficient,
            'turbine_efficiency': turbine_efficiency or self.turbine_efficiency,
        }
        params['data_source'] = 'NASA MERRA-2 (POWER API)'
        params['parameter'] = 'PREC (Daily Precipitation in mm)'
        
        return params

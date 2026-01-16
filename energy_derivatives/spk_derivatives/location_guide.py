"""
Geographic Location Guide for Energy Derivatives
=================================================

Curated collection of global locations optimized for renewable energy derivatives
pricing. Each location includes comprehensive metadata: coordinates, landscape
description, elevation, climate zone, seasonal patterns, and resource ratings.

Locations are organized by energy type (solar, wind, hydro) with detailed
characterization of why each location is excellent for that resource.

Structure
---------
Each location contains:
  - city: City name
  - country: Country name
  - coordinates: (latitude, longitude)
  - elevation_m: Elevation above sea level
  - timezone: IANA timezone (for seasonal analysis)
  - landscape: Detailed geographic description
  - climate_zone: Köppen-Geiger classification
  - seasonal_pattern: When this resource is best
  - solar_rating: 1-10 scale (10 = excellent)
  - wind_rating: 1-10 scale (10 = excellent)
  - hydro_rating: 1-10 scale (10 = excellent)
  - solar_params: Optimal panel configuration
  - wind_params: Optimal turbine configuration
  - hydro_params: Optimal facility configuration

Example Usage
-------------
>>> from location_guide import PRESET_LOCATIONS, get_location, list_locations
>>>
>>> # List all locations
>>> list_locations()
>>>
>>> # Get specific location
>>> phoenix = get_location('Phoenix')
>>> print(f"Latitude: {phoenix['coordinates'][0]}, Longitude: {phoenix['coordinates'][1]}")
>>>
>>> # Use with data loaders
>>> from data_loader_solar import SolarDataLoader
>>> solar = SolarDataLoader(**phoenix['solar_params'])
>>> params = solar.load_parameters()
"""

# =============================================================================
# GLOBAL LOCATION DATABASE
# =============================================================================

PRESET_LOCATIONS = {
    # =========================================================================
    # SOLAR-OPTIMIZED LOCATIONS (High insolation, low cloud cover)
    # =========================================================================
    
    "Phoenix": {
        "city": "Phoenix",
        "country": "United States",
        "region": "Arizona",
        "coordinates": (33.45, -112.07),
        "elevation_m": 338,
        "timezone": "America/Phoenix",
        "landscape": "Desert plateau in Sonoran Desert. Flat terrain with minimal vegetation. Clear, dry climate with intense solar radiation. Bounded by Salt River valley.",
        "climate_zone": "Hot desert (BWh)",
        "solar_rating": 10,
        "wind_rating": 6,
        "hydro_rating": 2,
        "seasonal_pattern": "Peak solar: May-August (12+ kWh/m²/day). Winter still strong (8-9 kWh/m²/day). Minimal seasonal variation.",
        "solar_params": {
            "lat": 33.45,
            "lon": -112.07,
            "tilt_angle": 25,
            "azimuth": 180,
            "albedo": 0.25,
            "cloud_cover_factor": 0.05,
        },
        "wind_params": {
            "lat": 33.45,
            "lon": -112.07,
            "rotor_diameter_m": 60.0,
            "hub_height_m": 70.0,
            "power_coefficient": 0.38,
        },
        "hydro_params": {
            "lat": 33.45,
            "lon": -112.07,
            "catchment_area_km2": 200.0,
            "fall_height_m": 20.0,
            "runoff_coefficient": 0.15,
            "turbine_efficiency": 0.85,
        },
    },
    
    "Atacama": {
        "city": "San Pedro de Atacama",
        "country": "Chile",
        "region": "Atacama Desert",
        "coordinates": (-22.91, -68.19),
        "elevation_m": 2640,
        "timezone": "America/Santiago",
        "landscape": "Extreme desert plateau in the Andes. Extremely high altitude (2600m+), hyperarid conditions. Nearly zero cloud cover year-round. Salt flats and volcanic terrain.",
        "climate_zone": "Hyper-arid desert (BWk)",
        "solar_rating": 10,
        "wind_rating": 8,
        "hydro_rating": 1,
        "seasonal_pattern": "Peak solar: Oct-Mar (13+ kWh/m²/day, some of world's best). Consistent year-round (12+ kWh/m²/day). Altitude provides cooler temperatures = better panel efficiency.",
        "solar_params": {
            "lat": -22.91,
            "lon": -68.19,
            "tilt_angle": 22,
            "azimuth": 180,
            "albedo": 0.30,
            "cloud_cover_factor": 0.02,
        },
        "wind_params": {
            "lat": -22.91,
            "lon": -68.19,
            "rotor_diameter_m": 100.0,
            "hub_height_m": 100.0,
            "power_coefficient": 0.42,
        },
        "hydro_params": {
            "lat": -22.91,
            "lon": -68.19,
            "catchment_area_km2": 50.0,
            "fall_height_m": 10.0,
            "runoff_coefficient": 0.05,
            "turbine_efficiency": 0.80,
        },
    },
    
    "Cairo": {
        "city": "Cairo",
        "country": "Egypt",
        "region": "Nile Delta",
        "coordinates": (30.04, 31.24),
        "elevation_m": 23,
        "timezone": "Africa/Cairo",
        "landscape": "Nile River delta in Sahara Desert. Flat terrain, extremely dry. Mediterranean influence from north. Sand and limestone geology.",
        "climate_zone": "Hot desert (BWh)",
        "solar_rating": 10,
        "wind_rating": 7,
        "hydro_rating": 3,
        "seasonal_pattern": "Peak solar: Apr-Aug (10-12 kWh/m²/day). Winter still excellent (7-8 kWh/m²/day). Red Sea wind corridor nearby (Katabatic flows).",
        "solar_params": {
            "lat": 30.04,
            "lon": 31.24,
            "tilt_angle": 27,
            "azimuth": 180,
            "albedo": 0.28,
            "cloud_cover_factor": 0.03,
        },
        "wind_params": {
            "lat": 30.04,
            "lon": 31.24,
            "rotor_diameter_m": 90.0,
            "hub_height_m": 90.0,
            "power_coefficient": 0.40,
        },
        "hydro_params": {
            "lat": 30.04,
            "lon": 31.24,
            "catchment_area_km2": 150.0,
            "fall_height_m": 15.0,
            "runoff_coefficient": 0.10,
            "turbine_efficiency": 0.85,
        },
    },
    
    # =========================================================================
    # WIND-OPTIMIZED LOCATIONS (High wind speeds, good exposure)
    # =========================================================================
    
    "Aalborg": {
        "city": "Aalborg",
        "country": "Denmark",
        "region": "Jutland",
        "coordinates": (57.05, 9.92),
        "elevation_m": 2,
        "timezone": "Europe/Copenhagen",
        "landscape": "Coastal area on Kattegat strait. Flat agricultural plains with few obstructions. North Atlantic air masses bring consistent westerlies. Excellent exposure to synoptic wind systems.",
        "climate_zone": "Temperate oceanic (Cfb)",
        "solar_rating": 4,
        "wind_rating": 10,
        "hydro_rating": 2,
        "seasonal_pattern": "Peak wind: Oct-Mar (avg 8-10 m/s). Summer lighter (5-6 m/s). Atlantic storm tracks provide consistent high-wind events. December-February: 15-20 m/s gusts common.",
        "solar_params": {
            "lat": 57.05,
            "lon": 9.92,
            "tilt_angle": 50,
            "azimuth": 180,
            "albedo": 0.20,
            "cloud_cover_factor": 0.60,
        },
        "wind_params": {
            "lat": 57.05,
            "lon": 9.92,
            "rotor_diameter_m": 120.0,
            "hub_height_m": 100.0,
            "power_coefficient": 0.43,
        },
        "hydro_params": {
            "lat": 57.05,
            "lon": 9.92,
            "catchment_area_km2": 300.0,
            "fall_height_m": 25.0,
            "runoff_coefficient": 0.45,
            "turbine_efficiency": 0.87,
        },
    },
    
    "Kansas City": {
        "city": "Kansas City",
        "country": "United States",
        "region": "Kansas",
        "coordinates": (39.10, -94.58),
        "elevation_m": 266,
        "timezone": "America/Chicago",
        "landscape": "Great Plains, flat grassland prairie. Few obstructions, excellent wind exposure. Located in path of cold fronts from Canada and warm moist air from Gulf of Mexico. Classic wind farm territory.",
        "climate_zone": "Humid subtropical (Cfa)",
        "solar_rating": 7,
        "wind_rating": 9,
        "hydro_rating": 3,
        "seasonal_pattern": "Peak wind: Feb-Apr & Nov-Dec (avg 7-9 m/s). Tornado-favorable conditions spring (severe but brief). Summer: lighter but warm thermals (4-5 m/s). Good year-round resource.",
        "solar_params": {
            "lat": 39.10,
            "lon": -94.58,
            "tilt_angle": 35,
            "azimuth": 180,
            "albedo": 0.22,
            "cloud_cover_factor": 0.45,
        },
        "wind_params": {
            "lat": 39.10,
            "lon": -94.58,
            "rotor_diameter_m": 110.0,
            "hub_height_m": 95.0,
            "power_coefficient": 0.41,
        },
        "hydro_params": {
            "lat": 39.10,
            "lon": -94.58,
            "catchment_area_km2": 400.0,
            "fall_height_m": 30.0,
            "runoff_coefficient": 0.40,
            "turbine_efficiency": 0.86,
        },
    },
    
    "Edinburgh": {
        "city": "Edinburgh",
        "country": "United Kingdom",
        "region": "Scotland",
        "coordinates": (55.95, -3.19),
        "elevation_m": 47,
        "timezone": "Europe/London",
        "landscape": "Coastal region on North Sea. Hilly terrain with moors and valleys (average 200-300m elevation changes). Exposed to Atlantic cyclones and North Sea wind funneling. Excellent maritime wind resource.",
        "climate_zone": "Temperate oceanic (Cfb)",
        "solar_rating": 3,
        "wind_rating": 9,
        "hydro_rating": 6,
        "seasonal_pattern": "Peak wind: Sep-Feb (avg 8-10 m/s). Winter storms common (15-25 m/s gusts). Summer lighter but reliable (4-5 m/s). Scotland's best wind resource location.",
        "solar_params": {
            "lat": 55.95,
            "lon": -3.19,
            "tilt_angle": 52,
            "azimuth": 180,
            "albedo": 0.18,
            "cloud_cover_factor": 0.70,
        },
        "wind_params": {
            "lat": 55.95,
            "lon": -3.19,
            "rotor_diameter_m": 125.0,
            "hub_height_m": 105.0,
            "power_coefficient": 0.43,
        },
        "hydro_params": {
            "lat": 55.95,
            "lon": -3.19,
            "catchment_area_km2": 500.0,
            "fall_height_m": 80.0,
            "runoff_coefficient": 0.65,
            "turbine_efficiency": 0.88,
        },
    },
    
    # =========================================================================
    # HYDRO-OPTIMIZED LOCATIONS (High precipitation, elevation, topography)
    # =========================================================================
    
    "Nepal": {
        "city": "Kathmandu",
        "country": "Nepal",
        "region": "Kathmandu Valley",
        "coordinates": (27.98, 86.92),
        "elevation_m": 1340,
        "timezone": "Asia/Kathmandu",
        "landscape": "Himalayan region with dramatic topography. Valley nestled between high mountains (5000-8000m peaks nearby). Monsoon-fed rivers including Bagmati and tributaries. Steep gorges and multiple waterfalls.",
        "climate_zone": "Subtropical highland (Cwb)",
        "solar_rating": 6,
        "wind_rating": 5,
        "hydro_rating": 10,
        "seasonal_pattern": "Peak hydro: June-Sep (monsoon rains, 3000-4000mm). Flow: Apr-May (snowmelt) and Sep-Oct. Dry: Nov-Feb (minimal rainfall). Best overall Q: Aug-Sep.",
        "solar_params": {
            "lat": 27.98,
            "lon": 86.92,
            "tilt_angle": 28,
            "azimuth": 180,
            "albedo": 0.22,
            "cloud_cover_factor": 0.50,
        },
        "wind_params": {
            "lat": 27.98,
            "lon": 86.92,
            "rotor_diameter_m": 70.0,
            "hub_height_m": 75.0,
            "power_coefficient": 0.38,
        },
        "hydro_params": {
            "lat": 27.98,
            "lon": 86.92,
            "catchment_area_km2": 2000.0,
            "fall_height_m": 150.0,
            "runoff_coefficient": 0.75,
            "turbine_efficiency": 0.90,
        },
    },
    
    "Alps": {
        "city": "Interlaken",
        "country": "Switzerland",
        "region": "Bernese Oberland",
        "coordinates": (46.68, 8.18),
        "elevation_m": 568,
        "timezone": "Europe/Zurich",
        "landscape": "Alpine mountain region with dramatic peaks (Jungfrau 4158m, Eiger 3970m). Deep valleys with glacial rivers. Steep topography perfect for hydro potential. Massive elevation differences: 500-4000m in small areas.",
        "climate_zone": "Temperate alpine (Dfb)",
        "solar_rating": 5,
        "wind_rating": 4,
        "hydro_rating": 10,
        "seasonal_pattern": "Peak hydro: May-July (snowmelt + spring rain). Secondary peak: Oct-Nov (autumn rains). Winter: frozen rivers (low flow). Summer: glacier-fed baseflow. Elevation ensures year-round flow.",
        "solar_params": {
            "lat": 46.68,
            "lon": 8.18,
            "tilt_angle": 40,
            "azimuth": 180,
            "albedo": 0.30,
            "cloud_cover_factor": 0.55,
        },
        "wind_params": {
            "lat": 46.68,
            "lon": 8.18,
            "rotor_diameter_m": 80.0,
            "hub_height_m": 85.0,
            "power_coefficient": 0.39,
        },
        "hydro_params": {
            "lat": 46.68,
            "lon": 8.18,
            "catchment_area_km2": 3000.0,
            "fall_height_m": 200.0,
            "runoff_coefficient": 0.80,
            "turbine_efficiency": 0.91,
        },
    },
    
    "Amazon Basin": {
        "city": "Manaus",
        "country": "Brazil",
        "region": "Amazonas",
        "coordinates": (-3.10, -60.02),
        "elevation_m": 92,
        "timezone": "America/Manaus",
        "landscape": "Amazon rainforest with dense vegetation and high rainfall. Located on Negro River, a major tributary. Tropical swamps and flooded forests (várzea). Black water rivers with organic matter.",
        "climate_zone": "Tropical rainforest (Af)",
        "solar_rating": 5,
        "wind_rating": 3,
        "hydro_rating": 10,
        "seasonal_pattern": "Peak hydro: May-July (peak water level). Secondary peak: Dec-Feb (local rains). Year-round high flow due to equatorial climate (2000+ mm annual rainfall). River fluctuation: 15m seasonal range.",
        "solar_params": {
            "lat": -3.10,
            "lon": -60.02,
            "tilt_angle": 0,
            "azimuth": 180,
            "albedo": 0.20,
            "cloud_cover_factor": 0.70,
        },
        "wind_params": {
            "lat": -3.10,
            "lon": -60.02,
            "rotor_diameter_m": 65.0,
            "hub_height_m": 70.0,
            "power_coefficient": 0.36,
        },
        "hydro_params": {
            "lat": -3.10,
            "lon": -60.02,
            "catchment_area_km2": 4000.0,
            "fall_height_m": 50.0,
            "runoff_coefficient": 0.90,
            "turbine_efficiency": 0.88,
        },
    },
    
    "Tasmania": {
        "city": "Hobart",
        "country": "Australia",
        "region": "Tasmania",
        "coordinates": (-42.88, 147.33),
        "elevation_m": 2,
        "timezone": "Australia/Hobart",
        "landscape": "Southern island with temperate rainforest, mountains, and deep gorges. High rainfall from Southern Ocean weather systems. Rocky coastline and inland river valleys. Hydroelectric infrastructure already developed.",
        "climate_zone": "Temperate oceanic (Cfb)",
        "solar_rating": 6,
        "wind_rating": 8,
        "hydro_rating": 9,
        "seasonal_pattern": "Peak hydro: May-Sep (winter rains, 1500-2000 mm). Secondary peak: Oct-Nov. Good year-round flow from high rainfall. Consistent cool-season high flow.",
        "solar_params": {
            "lat": -42.88,
            "lon": 147.33,
            "tilt_angle": 40,
            "azimuth": 180,
            "albedo": 0.22,
            "cloud_cover_factor": 0.50,
        },
        "wind_params": {
            "lat": -42.88,
            "lon": 147.33,
            "rotor_diameter_m": 110.0,
            "hub_height_m": 95.0,
            "power_coefficient": 0.41,
        },
        "hydro_params": {
            "lat": -42.88,
            "lon": 147.33,
            "catchment_area_km2": 2500.0,
            "fall_height_m": 100.0,
            "runoff_coefficient": 0.70,
            "turbine_efficiency": 0.89,
        },
    },
    
    # =========================================================================
    # BALANCED/MULTI-ENERGY LOCATIONS (Good for multiple resource types)
    # =========================================================================
    
    "Patagonia": {
        "city": "Punta Arenas",
        "country": "Chile",
        "region": "Magallanes",
        "coordinates": (-53.15, -70.88),
        "elevation_m": 29,
        "timezone": "America/Santiago",
        "landscape": "Southernmost continental region. Windswept steppe with low vegetation. Andes mountains visible to west. Extreme wind resource from Drake Passage systems. Sparse population.",
        "climate_zone": "Subpolar oceanic (Cfc)",
        "solar_rating": 5,
        "wind_rating": 10,
        "hydro_rating": 7,
        "seasonal_pattern": "Wind: Consistent year-round (avg 10-12 m/s, highest Nov-Mar). One of world's best wind resources. Hydro: 600-800 mm annual rainfall with winter snow. Solar: 4-5 hrs peak sun (limited by latitude).",
        "solar_params": {
            "lat": -53.15,
            "lon": -70.88,
            "tilt_angle": 53,
            "azimuth": 180,
            "albedo": 0.25,
            "cloud_cover_factor": 0.60,
        },
        "wind_params": {
            "lat": -53.15,
            "lon": -70.88,
            "rotor_diameter_m": 130.0,
            "hub_height_m": 110.0,
            "power_coefficient": 0.44,
        },
        "hydro_params": {
            "lat": -53.15,
            "lon": -70.88,
            "catchment_area_km2": 1500.0,
            "fall_height_m": 120.0,
            "runoff_coefficient": 0.60,
            "turbine_efficiency": 0.87,
        },
    },
    
    "Kenya Highlands": {
        "city": "Nairobi",
        "country": "Kenya",
        "region": "Central Highlands",
        "coordinates": (-1.29, 36.81),
        "elevation_m": 1661,
        "timezone": "Africa/Nairobi",
        "landscape": "High altitude plateau with volcanic peaks (Mount Kenya 5199m). Rift valley topography. Moderate rainfall for East Africa. Equatorial location with year-round growing season.",
        "climate_zone": "Tropical highland (Cwb)",
        "solar_rating": 8,
        "wind_rating": 7,
        "hydro_rating": 8,
        "seasonal_pattern": "Solar: Consistent high (6+ kWh/m²/day) year-round at altitude. Wind: Trade winds Mar-Oct (peak May-Jul). Hydro: Bimodal rains (Apr-May & Oct-Nov) feed Mt. Kenya streams.",
        "solar_params": {
            "lat": -1.29,
            "lon": 36.81,
            "tilt_angle": 0,
            "azimuth": 180,
            "albedo": 0.25,
            "cloud_cover_factor": 0.25,
        },
        "wind_params": {
            "lat": -1.29,
            "lon": 36.81,
            "rotor_diameter_m": 85.0,
            "hub_height_m": 85.0,
            "power_coefficient": 0.40,
        },
        "hydro_params": {
            "lat": -1.29,
            "lon": 36.81,
            "catchment_area_km2": 800.0,
            "fall_height_m": 100.0,
            "runoff_coefficient": 0.55,
            "turbine_efficiency": 0.88,
        },
    },
}


# =============================================================================
# LOCATION LOOKUP AND UTILITY FUNCTIONS
# =============================================================================

def get_location(location_name: str) -> dict:
    """
    Get a specific location by name.
    
    Parameters
    ----------
    location_name : str
        Location name (case-insensitive). Must match a key in PRESET_LOCATIONS.
    
    Returns
    -------
    dict
        Complete location data including coordinates, ratings, and parameter sets.
    
    Raises
    ------
    KeyError
        If location not found.
    
    Examples
    --------
    >>> phoenix = get_location('Phoenix')
    >>> lat, lon = phoenix['coordinates']
    """
    for key in PRESET_LOCATIONS.keys():
        if key.lower() == location_name.lower():
            return PRESET_LOCATIONS[key]
    
    available = ", ".join(PRESET_LOCATIONS.keys())
    raise KeyError(
        f"Location '{location_name}' not found. "
        f"Available locations: {available}"
    )


def list_locations(energy_type: str = None) -> dict:
    """
    List all available locations with their energy ratings.
    
    Parameters
    ----------
    energy_type : str, optional
        Filter by energy type: 'solar', 'wind', 'hydro', or None for all.
    
    Returns
    -------
    dict
        Dictionary mapping location names to their properties.
    
    Examples
    --------
    >>> # Show all locations
    >>> locations = list_locations()
    >>>
    >>> # Show only good wind locations
    >>> wind_locations = list_locations('wind')
    """
    result = {}
    
    for name, data in PRESET_LOCATIONS.items():
        if energy_type is None:
            result[name] = {
                "city": data["city"],
                "country": data["country"],
                "coordinates": data["coordinates"],
                "solar_rating": data["solar_rating"],
                "wind_rating": data["wind_rating"],
                "hydro_rating": data["hydro_rating"],
            }
        elif energy_type.lower() == "solar" and data["solar_rating"] >= 7:
            result[name] = {
                "city": data["city"],
                "country": data["country"],
                "solar_rating": data["solar_rating"],
            }
        elif energy_type.lower() == "wind" and data["wind_rating"] >= 7:
            result[name] = {
                "city": data["city"],
                "country": data["country"],
                "wind_rating": data["wind_rating"],
            }
        elif energy_type.lower() == "hydro" and data["hydro_rating"] >= 7:
            result[name] = {
                "city": data["city"],
                "country": data["country"],
                "hydro_rating": data["hydro_rating"],
            }
    
    return result


def search_by_country(country_name: str) -> dict:
    """
    Find all locations in a specific country.
    
    Parameters
    ----------
    country_name : str
        Country name (case-insensitive).
    
    Returns
    -------
    dict
        Dictionary mapping location names to their data.
    
    Examples
    --------
    >>> chile_locations = search_by_country('Chile')
    """
    result = {}
    
    for name, data in PRESET_LOCATIONS.items():
        if data["country"].lower() == country_name.lower():
            result[name] = data
    
    return result


def get_best_location_for_energy(energy_type: str) -> str:
    """
    Get the location with highest rating for a specific energy type.
    
    Parameters
    ----------
    energy_type : str
        'solar', 'wind', or 'hydro'
    
    Returns
    -------
    str
        Location name with highest rating for that energy type.
    
    Examples
    --------
    >>> best_solar = get_best_location_for_energy('solar')  # Returns 'Atacama' or 'Phoenix'
    >>> best_wind = get_best_location_for_energy('wind')    # Returns 'Aalborg' or 'Patagonia'
    >>> best_hydro = get_best_location_for_energy('hydro')  # Returns 'Nepal' or 'Alps'
    """
    energy_type = energy_type.lower()
    
    if energy_type == "solar":
        rating_key = "solar_rating"
    elif energy_type == "wind":
        rating_key = "wind_rating"
    elif energy_type == "hydro":
        rating_key = "hydro_rating"
    else:
        raise ValueError(f"Unknown energy type: {energy_type}")
    
    best_location = None
    best_rating = 0
    
    for name, data in PRESET_LOCATIONS.items():
        if data[rating_key] > best_rating:
            best_location = name
            best_rating = data[rating_key]
    
    return best_location


def format_location_table() -> str:
    """
    Return a formatted table of all locations with their ratings.
    
    Returns
    -------
    str
        Formatted table showing location name, country, and energy ratings.
    """
    lines = []
    lines.append("=" * 85)
    lines.append(f"{'Location':<20} {'Country':<20} {'Solar':<8} {'Wind':<8} {'Hydro':<8}")
    lines.append("-" * 85)
    
    for name in sorted(PRESET_LOCATIONS.keys()):
        data = PRESET_LOCATIONS[name]
        lines.append(
            f"{name:<20} {data['country']:<20} "
            f"{data['solar_rating']:<8} {data['wind_rating']:<8} {data['hydro_rating']:<8}"
        )
    
    lines.append("=" * 85)
    
    return "\n".join(lines)


if __name__ == "__main__":
    # Example usage
    print(format_location_table())
    print("\nBest locations:")
    print(f"  Solar: {get_best_location_for_energy('solar')}")
    print(f"  Wind:  {get_best_location_for_energy('wind')}")
    print(f"  Hydro: {get_best_location_for_energy('hydro')}")

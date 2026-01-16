# Geographic Location Guide for Energy Derivatives

## Overview

The `spk-derivatives` library includes **10 curated geographic locations** optimized for renewable energy derivatives pricing. Each location has been selected for its exceptional resource in one or more energy types (solar, wind, hydroelectric).

Instead of manually specifying latitude/longitude and facility specifications, you can reference locations by name:

```python
# ❌ Manual approach
loader = WindDataLoader(lat=57.05, lon=9.92, rotor_diameter_m=120.0, hub_height_m=100.0)

# ✅ Geographic preset approach
loader = WindDataLoader(location_name='Aalborg')
```

---

## Available Locations

### Solar-Optimized Locations ☀️

#### Phoenix, Arizona 🇺🇸
- **Country:** United States
- **Coordinates:** 33.45°N, 112.07°W
- **Elevation:** 338m
- **Landscape:** Desert plateau in Sonoran Desert. Flat terrain, minimal vegetation, clear dry climate with intense solar radiation.
- **Climate Zone:** Hot desert (BWh)
- **Resource Ratings:** ☀️ **10/10** | 💨 **6/10** | 💧 **2/10**
- **Seasonal Pattern:** Peak solar May-August (12+ kWh/m²/day). Winter still strong (8-9 kWh/m²/day). Minimal seasonal variation - excellent year-round resource.
- **Solar Characteristics:** 
  - Optimal tilt: 25°
  - Panel albedo: 0.25
  - Cloud cover factor: 5% (extremely low clouds)
  - **Best Use:** Reliable baseline solar resource, daily pricing
  
**Python Usage:**
```python
from spk_derivatives import SolarDataLoader

solar = SolarDataLoader(location_name='Phoenix')
params = solar.load_parameters()
print(f"Solar irradiance: {params['S0']:.1f} $/day")
```

---

#### Atacama Desert, Chile 🇨🇱
- **Country:** Chile
- **Coordinates:** -22.91°S, 68.19°W
- **Elevation:** 2,640m
- **Landscape:** Extreme desert plateau in the Andes. Hyperarid conditions, nearly zero cloud cover year-round. Salt flats and volcanic terrain.
- **Climate Zone:** Hyper-arid desert (BWk)
- **Resource Ratings:** ☀️ **10/10** | 💨 **8/10** | 💧 **1/10**
- **Seasonal Pattern:** Peak solar Oct-Mar (13+ kWh/m²/day, among world's best). Consistent year-round (12+ kWh/m²/day). High altitude provides cooler temperatures = better panel efficiency.
- **Solar Characteristics:**
  - Optimal tilt: 22°
  - Panel albedo: 0.30 (salt flats reflect light)
  - Cloud cover factor: 2% (world-class clarity)
  - **Best Use:** Extreme solar derivatives, altitude premium pricing
  
**Python Usage:**
```python
from spk_derivatives import SolarDataLoader

solar = SolarDataLoader(location_name='Atacama')
params = solar.load_parameters()
# Atacama has lowest volatility due to consistent high insolation
print(f"Solar volatility: {params['sigma']:.1%}")  # ~8-10%
```

---

#### Cairo, Egypt 🇪🇬
- **Country:** Egypt
- **Coordinates:** 30.04°N, 31.24°E
- **Elevation:** 23m
- **Landscape:** Nile River delta in Sahara Desert. Flat terrain, extremely dry. Mediterranean influence from north.
- **Climate Zone:** Hot desert (BWh)
- **Resource Ratings:** ☀️ **10/10** | 💨 **7/10** | 💧 **3/10**
- **Seasonal Pattern:** Peak solar Apr-Aug (10-12 kWh/m²/day). Winter still excellent (7-8 kWh/m²/day). Red Sea wind corridor nearby provides secondary wind resource.
- **Solar Characteristics:**
  - Optimal tilt: 27°
  - Panel albedo: 0.28
  - Cloud cover factor: 3%
  - **Best Use:** African solar market, dual solar-wind portfolios

---

### Wind-Optimized Locations 💨

#### Aalborg, Denmark 🇩🇰
- **Country:** Denmark
- **Coordinates:** 57.05°N, 9.92°E
- **Elevation:** 2m
- **Landscape:** Coastal area on Kattegat strait. Flat agricultural plains with few obstructions. North Atlantic air masses bring consistent westerlies.
- **Climate Zone:** Temperate oceanic (Cfb)
- **Resource Ratings:** ☀️ **4/10** | 💨 **10/10** | 💧 **2/10**
- **Seasonal Pattern:** Peak wind Oct-Mar (avg 8-10 m/s). Summer lighter (5-6 m/s). Atlantic storm tracks provide consistent high-wind events. December-February: 15-20 m/s gusts common.
- **Wind Characteristics:**
  - Turbine size: 120m rotor diameter
  - Hub height: 100m
  - Power coefficient: 0.43
  - **Best Use:** European wind derivatives, winter volatility plays, storm trading
  
**Python Usage:**
```python
from spk_derivatives import WindDataLoader

wind = WindDataLoader(location_name='Aalborg')
params = wind.load_parameters()
print(f"Wind power: {params['S0']:.1f} $/day")
# High seasonal volatility (winter peaks, summer lows)
print(f"Wind volatility: {params['sigma']:.1%}")  # ~25-30%
```

---

#### Kansas City, USA 🇺🇸
- **Country:** United States
- **Coordinates:** 39.10°N, -94.58°W
- **Elevation:** 266m
- **Landscape:** Great Plains, flat grassland prairie. Few obstructions, excellent wind exposure. Located in path of cold fronts from Canada and warm moist air from Gulf of Mexico.
- **Climate Zone:** Humid subtropical (Cfa)
- **Resource Ratings:** ☀️ **7/10** | 💨 **9/10** | 💧 **3/10**
- **Seasonal Pattern:** Peak wind Feb-Apr & Nov-Dec (avg 7-9 m/s). Tornado-favorable conditions spring (severe but brief). Summer lighter but warm thermals. Good year-round resource.
- **Wind Characteristics:**
  - Turbine size: 110m rotor diameter
  - Hub height: 95m
  - Power coefficient: 0.41
  - **Best Use:** US wind market, spring/fall volatility trading

---

#### Edinburgh, Scotland 🇬🇧
- **Country:** United Kingdom
- **Coordinates:** 55.95°N, -3.19°W
- **Elevation:** 47m
- **Landscape:** Coastal region on North Sea. Hilly terrain with moors and valleys. Exposed to Atlantic cyclones and North Sea wind funneling. Scotland's best wind resource.
- **Climate Zone:** Temperate oceanic (Cfb)
- **Resource Ratings:** ☀️ **3/10** | 💨 **9/10** | 💧 **6/10**
- **Seasonal Pattern:** Peak wind Sep-Feb (avg 8-10 m/s). Winter storms common (15-25 m/s gusts). Summer lighter but reliable.
- **Wind Characteristics:**
  - Turbine size: 125m rotor diameter (largest)
  - Hub height: 105m
  - Power coefficient: 0.43
  - **Best Use:** UK/Ireland wind derivatives, storm events, topographic wind effects

---

### Hydro-Optimized Locations 💧

#### Nepal (Kathmandu Valley) 🇳🇵
- **Country:** Nepal
- **Coordinates:** 27.98°N, 86.92°E
- **Elevation:** 1,340m
- **Landscape:** Himalayan region with dramatic topography. Valley nestled between high mountains (5,000-8,000m peaks nearby). Monsoon-fed rivers including Bagmati and tributaries. Steep gorges and waterfalls.
- **Climate Zone:** Subtropical highland (Cwb)
- **Resource Ratings:** ☀️ **6/10** | 💨 **5/10** | 💧 **10/10**
- **Seasonal Pattern:** Peak hydro Jun-Sep (monsoon rains, 3000-4000mm). Secondary flow Apr-May (snowmelt) and Sep-Oct. Dry Nov-Feb (minimal rainfall). Best overall flow Aug-Sep.
- **Hydro Characteristics:**
  - Catchment area: 2,000 km²
  - Fall height: 150m (steep terrain)
  - Runoff coefficient: 0.75 (high - monsoon rain)
  - Turbine efficiency: 0.90
  - **Best Use:** Asian hydro derivatives, monsoon trading, multi-year contracts

**Python Usage:**
```python
from spk_derivatives import HydroDataLoader

hydro = HydroDataLoader(location_name='Nepal')
params = hydro.load_parameters()
print(f"Hydro power (monsoon): {params['S0']:.1f} $/day")
# Highest volatility due to seasonal precipitation variation
print(f"Hydro volatility: {params['sigma']:.1%}")  # ~35-45%
```

---

#### Alps, Switzerland 🇨🇭
- **Country:** Switzerland
- **Coordinates:** 46.68°N, 8.18°E
- **Elevation:** 568m
- **Landscape:** Alpine mountain region with dramatic peaks (Jungfrau 4158m, Eiger 3970m). Deep valleys with glacial rivers. Steep topography perfect for hydro potential. Massive elevation differences (500-4000m in small areas).
- **Climate Zone:** Temperate alpine (Dfb)
- **Resource Ratings:** ☀️ **5/10** | 💨 **4/10** | 💧 **10/10**
- **Seasonal Pattern:** Peak hydro May-July (snowmelt + spring rain). Secondary peak Oct-Nov (autumn rains). Winter frozen rivers (low flow). Summer glacier-fed baseflow ensures year-round flow.
- **Hydro Characteristics:**
  - Catchment area: 3,000 km²
  - Fall height: 200m (steepest terrain)
  - Runoff coefficient: 0.80 (very high)
  - Turbine efficiency: 0.91 (best - modern equipment)
  - **Best Use:** Alpine runoff derivatives, snowmelt forecasting, spring volatility

---

#### Amazon Basin, Brazil 🇧🇷
- **Country:** Brazil
- **Coordinates:** -3.10°S, -60.02°W
- **Elevation:** 92m
- **Landscape:** Amazon rainforest with dense vegetation and high rainfall. Located on Negro River, a major tributary. Tropical swamps and flooded forests (várzea). Black water rivers with organic matter.
- **Climate Zone:** Tropical rainforest (Af)
- **Resource Ratings:** ☀️ **5/10** | 💨 **3/10** | 💧 **10/10**
- **Seasonal Pattern:** Peak hydro May-July (peak water level). Secondary peak Dec-Feb (local rains). Year-round high flow due to equatorial climate (2000+ mm annual rainfall). River fluctuation: 15m seasonal range.
- **Hydro Characteristics:**
  - Catchment area: 4,000 km² (largest)
  - Fall height: 50m
  - Runoff coefficient: 0.90 (equatorial - massive rainfall)
  - Turbine efficiency: 0.88
  - **Best Use:** Tropical hydro derivatives, consistent baseflow pricing, mega-dam contracts

---

#### Tasmania, Australia 🇦🇺
- **Country:** Australia
- **Coordinates:** -42.88°S, 147.33°E
- **Elevation:** 2m
- **Landscape:** Southern island with temperate rainforest, mountains, and deep gorges. High rainfall from Southern Ocean weather systems. Rocky coastline and inland river valleys. Hydroelectric infrastructure already developed.
- **Climate Zone:** Temperate oceanic (Cfb)
- **Resource Ratings:** ☀️ **6/10** | 💨 **8/10** | 💧 **9/10**
- **Seasonal Pattern:** Peak hydro May-Sep (winter rains, 1500-2000 mm). Secondary peak Oct-Nov. Good year-round flow from high rainfall. Consistent cool-season high flow.
- **Hydro Characteristics:**
  - Catchment area: 2,500 km²
  - Fall height: 100m
  - Runoff coefficient: 0.70
  - Turbine efficiency: 0.89
  - **Best Use:** Southern hemisphere hydro contracts, winter peaking, multi-energy portfolios

---

### Multi-Energy Balanced Locations 🌈

#### Patagonia, Chile 🇨🇱
- **Country:** Chile
- **Coordinates:** -53.15°S, -70.88°W
- **Elevation:** 29m
- **Landscape:** Southernmost continental region. Windswept steppe with low vegetation. Andes mountains visible to west. Extreme wind resource from Drake Passage systems.
- **Climate Zone:** Subpolar oceanic (Cfc)
- **Resource Ratings:** ☀️ **5/10** | 💨 **10/10** | 💧 **7/10**
- **Seasonal Pattern:** Wind consistent year-round (avg 10-12 m/s, highest Nov-Mar). One of world's best wind resources. Hydro: 600-800 mm rainfall with winter snow. Solar: 4-5 hrs peak sun (limited by latitude).
- **Best Use:** Multi-energy portfolios, wind-hydro correlations, southern hemisphere diversification

**Python Usage:**
```python
from spk_derivatives import WindDataLoader, HydroDataLoader

# Use same location for multiple energy types
wind = WindDataLoader(location_name='Patagonia')
hydro = HydroDataLoader(location_name='Patagonia')

# Different seasonal patterns - good for hedging
wind_params = wind.load_parameters()
hydro_params = hydro.load_parameters()

print(f"Wind price: {wind_params['S0']:.1f}")
print(f"Hydro price: {hydro_params['S0']:.1f}")
```

---

#### Kenya Highlands 🇰🇪
- **Country:** Kenya
- **Coordinates:** -1.29°S, 36.81°E
- **Elevation:** 1,661m
- **Landscape:** High altitude plateau with volcanic peaks (Mount Kenya 5199m). Rift valley topography. Moderate rainfall for East Africa. Equatorial location.
- **Climate Zone:** Tropical highland (Cwb)
- **Resource Ratings:** ☀️ **8/10** | 💨 **7/10** | 💧 **8/10**
- **Seasonal Pattern:** Solar consistent (6+ kWh/m²/day year-round at altitude). Wind trade winds Mar-Oct (peak May-July). Bimodal rains (Apr-May & Oct-Nov) feed Mt. Kenya streams.
- **Best Use:** African energy market, altitude premium pricing, balanced three-energy portfolios

---

## Usage Examples

### List All Locations
```python
from spk_derivatives import list_locations, format_location_table

# Show formatted table of all locations
print(format_location_table())

# Output:
# =====================================================================
# Location             Country              Solar    Wind     Hydro
# =====================================================================
# Phoenix              United States        10       6        2
# Atacama              Chile                10       8        1
# Aalborg              Denmark              4        10       2
# Nepal                Nepal                6        5        10
# Alps                 Switzerland          5        4        10
# ...
```

### Filter by Energy Type
```python
from spk_derivatives import list_locations

# Find all good solar locations
solar_locations = list_locations('solar')
# Returns: {'Phoenix': {...}, 'Atacama': {...}, 'Cairo': {...}}

# Find all good wind locations
wind_locations = list_locations('wind')
# Returns: {'Aalborg': {...}, 'Kansas City': {...}, ...}

# Find all good hydro locations
hydro_locations = list_locations('hydro')
# Returns: {'Nepal': {...}, 'Alps': {...}, ...}
```

### Find Best Location for Energy Type
```python
from spk_derivatives import get_best_location_for_energy

best_solar = get_best_location_for_energy('solar')  # 'Atacama' or 'Phoenix'
best_wind = get_best_location_for_energy('wind')    # 'Patagonia' or 'Aalborg'
best_hydro = get_best_location_for_energy('hydro')  # 'Nepal' or 'Alps'

print(f"Best solar location: {best_solar}")
```

### Search by Country
```python
from spk_derivatives import search_by_country

# Find all locations in Chile
chile_locations = search_by_country('Chile')
# Returns: {'Atacama': {...}, 'Patagonia': {...}}

# Find all locations in Switzerland
swiss_locations = search_by_country('Switzerland')
# Returns: {'Alps': {...}}
```

---

## Geographic Presets in Data Loaders

### Solar Loader with Location
```python
from spk_derivatives import SolarDataLoader

# Method 1: Use preset location (recommended)
solar = SolarDataLoader(location_name='Phoenix')

# Method 2: Manual coordinates (legacy)
solar = SolarDataLoader(lat=33.45, lon=-112.07)

# Method 3: Override specific parameters from preset
solar = SolarDataLoader(
    location_name='Phoenix',
    tilt_angle=30,  # Override default 25°
)

params = solar.load_parameters(T=1.0, r=0.05)
print(f"S0 (spot): ${params['S0']:.2f}")
print(f"Sigma (volatility): {params['sigma']:.1%}")
```

### Wind Loader with Location
```python
from spk_derivatives import WindDataLoader

# Use preset location with optimal turbine specifications
wind = WindDataLoader(location_name='Aalborg')

# Wind characteristics for Aalborg:
# - Rotor diameter: 120m
# - Hub height: 100m
# - Cp: 0.43
# Optimal for this high-wind coastal location

params = wind.load_parameters()

print(f"Location: {wind.location_name}")
print(f"Landscape: {wind.landscape}")
print(f"Seasonal pattern: {wind.seasonal_pattern}")
print(f"Wind rating: {wind.wind_rating}/10")
```

### Hydro Loader with Location
```python
from spk_derivatives import HydroDataLoader

# Use preset location with optimal facility specifications
hydro = HydroDataLoader(location_name='Nepal')

# Hydro characteristics for Nepal:
# - Catchment: 2000 km²
# - Fall: 150m (steep Himalayan terrain)
# - Runoff: 0.75 (monsoon-driven)
# - Efficiency: 0.90

params = hydro.load_parameters()

print(f"Location: {hydro.location_name}")
print(f"Landscape: {hydro.landscape}")
print(f"Seasonal pattern: {hydro.seasonal_pattern}")
print(f"Hydro rating: {hydro.hydro_rating}/10")
```

---

## Multi-Energy Derivative Pricing

### Create a 3-Energy Portfolio
```python
from spk_derivatives import (
    SolarDataLoader, WindDataLoader, HydroDataLoader,
    BinomialTree
)

# Load three energy types from complementary locations
solar = SolarDataLoader(location_name='Phoenix')
wind = WindDataLoader(location_name='Kansas City')
hydro = HydroDataLoader(location_name='Nepal')

# Load parameters for each
solar_params = solar.load_parameters(T=1.0)
wind_params = wind.load_parameters(T=1.0)
hydro_params = hydro.load_parameters(T=1.0)

# Price call options for each
bt_solar = BinomialTree(**solar_params, N=100)
bt_wind = BinomialTree(**wind_params, N=100)
bt_hydro = BinomialTree(**hydro_params, N=100)

call_solar = bt_solar.price_call_option()
call_wind = bt_wind.price_call_option()
call_hydro = bt_hydro.price_call_option()

print(f"Solar call:  ${call_solar:.2f}")
print(f"Wind call:   ${call_wind:.2f}")
print(f"Hydro call:  ${call_hydro:.2f}")

# Portfolio value
portfolio_value = call_solar + call_wind + call_hydro
print(f"Portfolio value: ${portfolio_value:.2f}")
```

### Hedge Multi-Energy Exposure
```python
# Use locations with inverse seasonal patterns for hedging
wind = WindDataLoader(location_name='Aalborg')     # Peak winter
hydro = HydroDataLoader(location_name='Nepal')     # Peak monsoon (summer)
solar = SolarDataLoader(location_name='Atacama')   # Peak year-round

# Different seasonal peaks = natural hedging in portfolio
# Winter: Wind high, Hydro/Solar lower
# Monsoon (summer): Hydro/Solar high, Wind lower
```

---

## Advanced: Adding Custom Locations

To add your own location to the library:

```python
from spk_derivatives.location_guide import PRESET_LOCATIONS

new_location = {
    "city": "Your City",
    "country": "Your Country",
    "coordinates": (latitude, longitude),
    "elevation_m": elevation,
    "timezone": "Timezone/Location",
    "landscape": "Detailed landscape description...",
    "climate_zone": "Köppen classification",
    "solar_rating": 7,
    "wind_rating": 6,
    "hydro_rating": 5,
    "seasonal_pattern": "Description of seasonal energy patterns...",
    "solar_params": {...},
    "wind_params": {...},
    "hydro_params": {...},
}

PRESET_LOCATIONS['Your Location Name'] = new_location

# Now use it
from spk_derivatives import SolarDataLoader
loader = SolarDataLoader(location_name='Your Location Name')
```

---

## Resource Ratings Explained

Each location has ratings from 1-10 for each energy type:

- **9-10:** World-class resource, tier-1 location
- **7-8:** Excellent resource, good for derivatives
- **5-6:** Good resource, viable for projects
- **3-4:** Moderate resource, limited applications
- **1-2:** Poor resource, not recommended

Ratings are based on:
- **Solar:** Mean daily GHI, cloud cover frequency, seasonal stability
- **Wind:** Mean wind speed at hub height, frequency of high-wind events, consistency
- **Hydro:** Precipitation, topography (head), catchment area, runoff patterns

---

## Climate & Seasonality

### Seasonal Energy Complementarity
```
Winter (Dec-Feb):
- Wind: PEAK (Aalborg 10m/s+, Edinburgh storms)
- Hydro: Variable (snowmelt in Alps, dry in monsoon regions)
- Solar: Low (short days, high cloud cover in temperate regions)

Spring (Mar-May):
- Wind: High (frontal systems)
- Hydro: PEAK (snowmelt in mountains, spring rains in tropics)
- Solar: Increasing (longer days, clearer skies)

Summer (Jun-Aug):
- Wind: Lower (reduced frontal activity)
- Hydro: Mixed (monsoon peaks in tropics, may decline in temperate)
- Solar: PEAK (longest days, low cloud cover)

Fall (Sep-Nov):
- Wind: Increasing (frontal systems returning)
- Hydro: PEAK (monsoon tail in tropics, autumn rains in temperate)
- Solar: Declining (shorter days)
```

This natural complementarity makes multi-energy portfolios more stable than single-source derivatives.

---

## Geographic Distribution

Current locations span:
- **6 continents:** North America, South America, Europe, Africa, Asia, Oceania
- **5 climate zones:** Tropical, subtropical, temperate, boreal, alpine
- **8 countries:** USA, Chile, Denmark, UK, Egypt, Nepal, Switzerland, Brazil, Kenya, Australia

This global coverage allows pricing derivatives for any major renewable energy market.

---

## Reference: Location Properties Table

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `city` | str | "Phoenix" | City name |
| `country` | str | "United States" | Country name |
| `coordinates` | tuple | (33.45, -112.07) | (latitude, longitude) |
| `elevation_m` | float | 338 | Meters above sea level |
| `timezone` | str | "America/Phoenix" | IANA timezone |
| `landscape` | str | "Desert plateau..." | Detailed geographic description |
| `climate_zone` | str | "Hot desert (BWh)" | Köppen-Geiger classification |
| `solar_rating` | int | 10 | 1-10 scale |
| `wind_rating` | int | 6 | 1-10 scale |
| `hydro_rating` | int | 2 | 1-10 scale |
| `seasonal_pattern` | str | "Peak May-Aug..." | Energy availability pattern |
| `solar_params` | dict | `{lat, lon, ...}` | Solar loader parameters |
| `wind_params` | dict | `{lat, lon, ...}` | Wind loader parameters |
| `hydro_params` | dict | `{lat, lon, ...}` | Hydro loader parameters |

---

**Version:** 0.3.0  
**Last Updated:** December 8, 2025  
**Total Locations:** 10  
**Geographic Coverage:** 6 continents

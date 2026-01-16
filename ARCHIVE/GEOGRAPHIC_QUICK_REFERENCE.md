# Quick Reference: Geographic Location Presets

## 🚀 TL;DR - Quick Start

```python
from spk_derivatives import (
    WindDataLoader, HydroDataLoader, SolarDataLoader,
    list_locations, format_location_table
)

# Show all available locations
print(format_location_table())

# Use a preset location instead of manual coordinates
wind = WindDataLoader(location_name='Aalborg')
hydro = HydroDataLoader(location_name='Nepal')
solar = SolarDataLoader(location_name='Phoenix')

# Get parameters and price
params = wind.load_parameters()
```

---

## 📍 The 10 Locations

### ☀️ Best Solar
- **Atacama, Chile** - World's best (10/10), high altitude, zero clouds
- **Phoenix, USA** - Reliable desert (10/10), year-round strong
- **Cairo, Egypt** - African market (10/10), hot desert

### 💨 Best Wind
- **Patagonia, Chile** - World's best (10/10), Drake Passage systems
- **Aalborg, Denmark** - European peak (10/10), Atlantic storms
- **Kansas City, USA** - North American (9/10), spring/fall peaks
- **Edinburgh, Scotland** - UK/Ireland (9/10), North Sea funneling

### 💧 Best Hydro
- **Nepal** - Himalayan monsoon (10/10), 3000-4000mm rainfall
- **Alps, Switzerland** - Alpine snowmelt (10/10), steep terrain
- **Amazon Basin, Brazil** - Tropical baseflow (10/10), largest catchment

### 🌈 Balanced (Multi-Energy)
- **Patagonia, Chile** - Wind 10/10, Hydro 7/10, Solar 5/10
- **Kenya Highlands** - Solar 8/10, Wind 7/10, Hydro 8/10
- **Tasmania, Australia** - Hydro 9/10, Wind 8/10, Solar 6/10

---

## 💻 API Quick Reference

### Create Loaders with Location Names
```python
# Wind
wind = WindDataLoader(location_name='Aalborg')
wind = WindDataLoader(location_name='Kansas City')
wind = WindDataLoader(location_name='Edinburgh')

# Hydro
hydro = HydroDataLoader(location_name='Nepal')
hydro = HydroDataLoader(location_name='Alps')
hydro = HydroDataLoader(location_name='Amazon Basin')

# Solar
solar = SolarDataLoader(location_name='Atacama')
solar = SolarDataLoader(location_name='Phoenix')
solar = SolarDataLoader(location_name='Cairo')
```

### Find Locations
```python
# List all good solar locations
solar_locs = list_locations('solar')

# List all good wind locations
wind_locs = list_locations('wind')

# List all good hydro locations
hydro_locs = list_locations('hydro')

# Show as table
print(format_location_table())

# Find locations in a country
chile = search_by_country('Chile')
nepal = search_by_country('Nepal')

# Get location with best rating for energy type
best_solar = get_best_location_for_energy('solar')      # 'Atacama' or 'Phoenix'
best_wind = get_best_location_for_energy('wind')        # 'Patagonia'
best_hydro = get_best_location_for_energy('hydro')      # 'Nepal' or 'Alps'

# Get full location data
location_data = get_location('Phoenix')
lat, lon = location_data['coordinates']
landscape = location_data['landscape']
seasonal = location_data['seasonal_pattern']
```

### Override Specific Parameters
```python
# Use location preset but override one parameter
wind = WindDataLoader(
    location_name='Aalborg',
    rotor_diameter_m=150  # Override default 120m
)

hydro = HydroDataLoader(
    location_name='Nepal',
    fall_height_m=200  # Override default 150m
)
```

---

## 📊 Location Ratings Table

```
Location             Country        Solar  Wind  Hydro
─────────────────────────────────────────────────────
Phoenix              USA            10     6     2
Atacama              Chile          10     8     1
Cairo                Egypt          10     7     3
Aalborg              Denmark        4      10    2
Kansas City          USA            7      9     3
Edinburgh            UK             3      9     6
Nepal                Nepal          6      5     10
Alps                 Switzerland    5      4     10
Amazon Basin         Brazil         5      3     10
Tasmania             Australia      6      8     9
Patagonia            Chile          5      10    7
Kenya Highlands      Kenya          8      7     8
```

---

## 🎯 Common Use Cases

### Case 1: Baseline Solar Derivatives
```python
solar = SolarDataLoader(location_name='Phoenix')
params = solar.load_parameters()
# Reliable, low volatility, year-round
```

### Case 2: European Wind Trading
```python
wind = WindDataLoader(location_name='Aalborg')
params = wind.load_parameters()
# High volatility, winter peaks (15-20 m/s gusts)
```

### Case 3: Asian Hydro Portfolio
```python
hydro = HydroDataLoader(location_name='Nepal')
params = hydro.load_parameters()
# Highest volatility, monsoon peaks (Jun-Sep)
```

### Case 4: Multi-Energy Hedging
```python
# Mix locations with different seasonal peaks
solar = SolarDataLoader(location_name='Atacama')   # Peak year-round
wind = WindDataLoader(location_name='Aalborg')     # Peak winter
hydro = HydroDataLoader(location_name='Nepal')     # Peak monsoon (summer)

# Different peaks = natural hedging
```

### Case 5: Latin American Market
```python
# Multiple energy types in same region
solar = SolarDataLoader(location_name='Atacama')     # North: Solar-wind
hydro = HydroDataLoader(location_name='Amazon Basin') # South: Hydro
wind = WindDataLoader(location_name='Patagonia')      # South: Wind

# Regional diversification
```

---

## 🌍 Geographic Coverage

| Continent | Countries | Locations |
|-----------|-----------|-----------|
| North America | USA (2) | Phoenix, Kansas City |
| South America | Chile (2), Brazil (1) | Atacama, Patagonia, Amazon Basin |
| Europe | Denmark (1), UK (1), Switzerland (1) | Aalborg, Edinburgh, Alps |
| Africa | Egypt (1), Kenya (1) | Cairo, Kenya Highlands |
| Asia | Nepal (1) | Nepal |
| Oceania | Australia (1) | Tasmania |

---

## 📈 Seasonal Patterns

### Winter (Dec-Feb)
- **PEAK Wind:** Aalborg, Edinburgh (Atlantic storms)
- **PEAK Hydro:** Variable (snowmelt in Alps, dry in monsoons)
- **LOW Solar:** Northern hemisphere short days

### Spring (Mar-May)
- **HIGH Wind:** Frontal systems returning
- **PEAK Hydro:** Snowmelt in mountains, spring rains in tropics
- **Rising Solar:** Longer days

### Summer (Jun-Aug)
- **LOW Wind:** Reduced frontal activity
- **PEAK Hydro:** Monsoon peaks in tropics (Nepal), may decline temperate
- **PEAK Solar:** Longest days (equator: year-round, poles: seasonal)

### Fall (Sep-Nov)
- **Rising Wind:** Frontal systems returning
- **PEAK Hydro:** Monsoon tail in tropics, autumn rains in temperate
- **Declining Solar:** Shorter days

**Strategy:** Use inverse seasonal patterns for natural hedging

---

## 🔄 API Backward Compatibility

### ✅ Old Code Still Works
```python
# These still work exactly as before (v0.3.0 and earlier)
wind = WindDataLoader(lat=57.05, lon=9.92, rotor_diameter_m=120)
hydro = HydroDataLoader(lat=27.98, lon=86.92, catchment_area_km2=2000)
solar = SolarDataLoader(lat=33.45, lon=-112.07, tilt_angle=25)
```

### ✨ New Simplified Approach
```python
# New way is simpler (v0.3.0.1+)
wind = WindDataLoader(location_name='Aalborg')
hydro = HydroDataLoader(location_name='Nepal')
solar = SolarDataLoader(location_name='Phoenix')
```

### 🎯 Mix Both Approaches
```python
# Override specific parameter from location preset
wind = WindDataLoader(
    location_name='Aalborg',  # Use preset location
    rotor_diameter_m=150      # But override this parameter
)
```

---

## 📚 Learn More

- **Detailed Profiles:** See `GEOGRAPHIC_GUIDE.md` for each location's full profile
- **Code Examples:** See `README.md` for usage examples
- **Implementation:** See `location_guide.py` for location database
- **Modified Loaders:** See `data_loader_wind.py`, `data_loader_hydro.py`

---

## ✅ What You Get

**For Each Location, You Get:**
- ✅ Coordinates (latitude, longitude)
- ✅ Elevation (meters above sea level)
- ✅ Landscape description (geographic context)
- ✅ Climate zone (Köppen classification)
- ✅ Energy ratings (1-10 for each type)
- ✅ Seasonal patterns (when resource peaks)
- ✅ Optimal specifications for each energy type
- ✅ Timezone info

**Usage:**
```python
location = get_location('Phoenix')

print(f"City: {location['city']}")
print(f"Country: {location['country']}")
print(f"Coordinates: {location['coordinates']}")
print(f"Landscape: {location['landscape']}")
print(f"Climate: {location['climate_zone']}")
print(f"Solar Rating: {location['solar_rating']}/10")
print(f"Seasonal: {location['seasonal_pattern']}")
```

---

## 🎓 Academic Applications

- **Case Studies:** Compare derivative pricing across locations
- **Portfolio Analysis:** Multi-energy hedging strategies
- **Risk Management:** Understand seasonal volatility patterns
- **Market Studies:** Analyze renewable energy resources by region
- **Reproducible Research:** Use location names instead of cryptic coordinates

---

**Total Locations:** 10  
**Geographic Coverage:** 6 continents, 8 countries  
**Energy Types:** Solar, Wind, Hydroelectric  
**Documentation:** Comprehensive (3,000+ lines)  
**Status:** Production-ready for PyPI  

---

**Version:** 0.3.0 (with geographic enhancement 0.3.0.1)  
**Last Updated:** December 8, 2025

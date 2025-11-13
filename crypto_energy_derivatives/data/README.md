# Data Directory

## Purpose

This directory is for storing cryptocurrency market and energy consumption data.

## Required Data

The framework expects the following data files (optional - synthetic data will be generated if not found):

### Bitcoin Data
- **Filename:** `bitcoin_ceir_final.csv` (or similar)
- **Required Columns:**
  - `Date`: Date (YYYY-MM-DD format)
  - `Price`: Bitcoin price (USD)
  - `Market_Cap`: Market capitalization (USD)
  - `Supply`: Circulating supply
  - `Energy_TWh_Annual`: Energy consumption (TWh/year)

### Ethereum Data (Optional)
- **Filename:** `eth_ds_parsed.csv` (or similar)
- **Required Columns:** Same as Bitcoin

### Energy Consumption Data
- **Filename:** `btc_con.csv`
- **Required Columns:**
  - `DateTime`: Timestamp
  - `Estimated TWh per Year`: Annual energy consumption

## Data Sources

Recommended data sources:

1. **Bitcoin Energy Consumption:**
   - Digiconomist Bitcoin Energy Consumption Index
   - Cambridge Bitcoin Electricity Consumption Index (CBECI)

2. **Price & Market Data:**
   - CoinMarketCap API
   - CoinGecko API
   - LSEG Datastream

3. **Mining Distribution:**
   - Cambridge Centre for Alternative Finance

## Usage

If data files are not present, the system will automatically generate synthetic data for testing and demonstration purposes.

To use real data:

1. Place data files in this directory
2. Ensure column names match requirements (or will be auto-mapped)
3. Run the framework - it will automatically detect and load the data

## Data Format Example

```csv
Date,Price,Market_Cap,Supply,Energy_TWh_Annual
2018-01-01,13500,230000000000,16800000,30.5
2018-01-02,14200,240000000000,16800050,30.6
...
```

## Note

All data should be properly sourced and cited if used in academic work or publications.

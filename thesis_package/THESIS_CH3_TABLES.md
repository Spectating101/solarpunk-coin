### 3.3.1 Data sources and sample

Table 3.2 lists the main data series used in Chapter 3. Table 3.3 summarises the sample period and observation counts. The regression sample is smaller than the full panel because 30-day forward returns, rolling volatility, and winsorized regressors require non-missing controls.

**Table 3.2. Data sources (Chapter 3 empirical panel)**

| Series | Source | Frequency | Role |
| --- | --- | --- | --- |
| Bitcoin price & market cap | CoinGecko / parsed daily panel (`btc_ds_parsed.csv`) | Daily | Outcome and CEIR numerator |
| Mining electricity (TWh, annualised) | Cambridge Bitcoin Electricity Consumption Index (CBECI) | Daily (interpolated annual rate) | Cumulative energy-cost base |
| Weighted electricity price | Cambridge mining-map weighted prices (`weighted_electricity_prices_monthly.csv`) | Monthly → daily | USD cost per kWh for cumulative cost |
| Mining geography / ban split | Cambridge mining map; China ban date 2021-06-20 | Event split | Regime indicator (`post_china_ban`) |
| Fear & Greed Index | Alternative.me crypto sentiment index | Daily | Control (standardised in regression) |

*Sources: Cambridge Centre for Alternative Finance (CBECI, mining map); panel assembled in `bitcoin_ceir_analysis_ready.csv`. Reproduce: `python thesis_package/ceir_regression.py --refresh-panel`.*

**Table 3.3. Sample period and observation counts**

| Sample | Start | End | N (days) | Pre-ban | Post-ban |
| --- | --- | --- | --- | --- | --- |
| Full analysis panel | 2019-01-01 | 2025-05-28 | 2340 | 901 | 1439 |
| Regression sample (controls complete) | 2019-01-30 | 2025-04-28 | 2280 | 872 | 1408 |

*Structural split: China mining-ban date = 2021-06-20.*

**Table 3.4. Variable definitions**

| Symbol | Definition | Units |
| --- | --- | --- |
| CEIR_t | MarketCap_t / CumulativeEnergyCost_t | Ratio (×) |
| log(CEIR_t) | Natural log of CEIR; 1% winsorized in preferred regression (`log_ceir_w`) | log points |
| R_{t,t+30} | Price_{t+30}/Price_t − 1 | Proportion |
| vol30 | Rolling 30-day std of daily returns | Proportion |
| fg | Standardised Fear & Greed Index | z-score |
| trend | Linear time index (0 … T) | Days |
| post_china_ban | 1 if Date ≥ 2021-06-20 | Indicator |

**Table 3.5. Descriptive statistics (regression sample)**

| Variable | Mean (full) | Mean (pre-ban) | Mean (post-ban) | Std (full) |
| --- | --- | --- | --- | --- |
| Bitcoin price (USD) | 34,881 | 16,666 | 46,161 | 25,236 |
| Market capitalisation (USD) | 673,488,636,070 | 308,430,925,588 | 899,575,513,584 | 500,162,791,854 |
| CEIR = MarketCap / CumulativeEnergyCost | 29.6516 | 30.3994 | 29.1885 | 14.7314 |
| log(CEIR) | 3.2819 | 3.2850 | 3.2800 | 0.4536 |
| Daily return | 2.05e-03 | 3.51e-03 | 1.14e-03 | 0.0341 |
| 30-day forward return | 0.0644 | 0.1072 | 0.0379 | 0.2080 |
| Fear & Greed Index (0–100) | 49.5009 | 52.2867 | 47.7756 | 21.8552 |
| 30-day return volatility | 0.0318 | 0.0373 | 0.0283 | 0.0124 |

*Means and standard deviations on the regression-ready sample (N = 2280: pre-ban 872, post-ban 1408). Full distributional detail in `empirical_results/tables/ceir_descriptive_statistics.csv`.*

**Table 3.6. Correlation matrix (regression sample)**

| Variable | log(CEIR) | 30d forward return | Daily return | 30d volatility | Fear & Greed |
| --- | --- | --- | --- | --- | --- |
| log(CEIR) | 1.000 | -0.189 | 0.040 | 0.273 | 0.353 |
| 30d forward return | -0.189 | 1.000 | 0.021 | 0.015 | 0.134 |
| Daily return | 0.040 | 0.021 | 1.000 | 9.76e-03 | 0.211 |
| 30d volatility | 0.273 | 0.015 | 9.76e-03 | 1.000 | -0.141 |
| Fear & Greed | 0.353 | 0.134 | 0.211 | -0.141 | 1.000 |

*Pearson correlations on the same regression sample. Overlapping 30-day returns induce serial correlation; inference uses HAC(30) in Table 3.7.*

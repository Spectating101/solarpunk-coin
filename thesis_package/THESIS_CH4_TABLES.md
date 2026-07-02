### 4.3.1 Location inputs and volatility calibration

Table 4.4 records the cross-location inputs used in Chapter 4. Spot proxies `S₀` follow published LCOE or tariff proxies; volatilities are **cold-start** estimates from NASA POWER irradiance variability, not market-implied option vols. Taiwan σ = 189.5% under the preferred `thesis_reconstructed` method (`calibration_diagnostics_real.csv`; Jarque–Bera p = 0.349).

**Table 4.4. Location parameters and volatility calibration inputs**

| Location | Latitude | Longitude | S₀ ($/kWh) | σ (annual, %) | Risk-free r | σ source |
| --- | --- | --- | --- | --- | --- | --- |
| Taiwan | 23.5000 | 120.9000 | 0.0525 | 189% | 2.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Saudi Arabia | 24.7000 | 46.7000 | 0.0550 | 172% | 2.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Arizona, USA | 33.4000 | -112.1000 | 0.0580 | 165% | 4.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Brazil | -23.5000 | -46.6000 | 0.0950 | 198% | 13.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |
| Germany | 48.1000 | 11.6000 | 0.0250 | 45% | 3.5% | NASA POWER daily irradiance log returns, 2019–2024; 4-day rolling mean + 1% tail trim (Taiwan method) |

*Horizon T = 0.25 years for all sites; ATM convention K = S₀ per location (Table 4.2). Script: `options_pricing.py`.*

**Table 4.5. Binomial tree convergence (Taiwan base case)**

| Steps (N) | Option Price ($/kWh) | Change from Previous |
| --- | --- | --- |
| 50 | 0.0191 | — |
| 100 | 0.0191 | +0.247% |
| 200 | 0.0192 | +0.124% |
| 400 | 0.0192 | +0.062% |
| 800 | 0.0192 | +0.031% |
| 1200 | 0.0192 | +0.010% |

*Preferred engine setting: N = 400 steps. Source: `binomial_convergence_table.csv`.*

**Table 4.6. Margin stress grid (selected S₀ and σ)**

| S₀ | σ | VaR₉₉ | Initial margin (1.5×) |
| --- | --- | --- | --- |
| $0.0420 | 142% | $0.1776 | $0.2665 |
| $0.0420 | 189% | $0.3378 | $0.5066 |
| $0.0420 | 236% | $0.6146 | $0.9219 |
| $0.0525 | 142% | $0.2220 | $0.3331 |
| $0.0525 | 189% | $0.4222 | $0.6333 |
| $0.0525 | 236% | $0.7682 | $1.1524 |
| $0.0630 | 142% | $0.2665 | $0.3997 |
| $0.0630 | 189% | $0.5066 | $0.7599 |
| $0.0630 | 236% | $0.9219 | $1.3828 |

*Initial margin = 1.5 × VaR₉₉ of spot; Taiwan base case highlighted at S₀ = $0.0525/kWh, σ = 189%. Full grid: `margin_stress_table.csv`.*

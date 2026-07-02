## Chapter 4 - Pricing Renewable-Energy Risk

### At a glance

| | |
|---|---|
| **Question** | How do you price an energy-linked claim when there is no liquid options market? |
| **Method** | Option-style model on $/kWh; binomial tree + Monte Carlo cross-check |
| **Base case** | Taiwan: S₀ = $0.0525/kWh, σ ≈ 189%, call ≈ $0.0192/kWh (binomial) |
| **Also covers** | Cross-location comparison, oracle tolerance, collars, margin |
| **Takeaway** | Risk must be **inspectable** before settlement rules can be credible |
| **Next chapter** | Ch 5 — five constraints + Sepolia implementation |

### 4.1 Purpose of the Chapter

Chapter 2 argued that renewable-energy-linked claims require explicit pricing before issuance can be credible. Chapter 3 showed that energy cost can matter in a digital market, but that the relationship is conditional and regime-dependent. This chapter implements the pricing layer.

If energy is going to constrain digital money or energy-linked contracts, the system must be able to price energy risk. Energy production is not constant. Solar and wind output vary by location, season, weather, and grid conditions. A financial claim linked to energy cannot be credible if it ignores that variability.

This chapter therefore asks how an energy-linked financial contract can be priced when the underlying source is variable, local, and not supported by a liquid options market.

The answer developed here is a practical pricing framework. It does not claim to be the final model for all electricity markets. It provides a reproducible starting point: use public energy data to estimate volatility, define a simple payoff, price the payoff with standard numerical methods, and test whether the result is stable enough to inform collateral and settlement rules.

This matters for the thesis because pricing is one of the conditions that turns "energy-linked" from a label into a credible financial constraint. If risk is not priced, token creation or settlement promises can become under-collateralised claims.

### 4.2 Why Pricing Comes Before Settlement

An energy-linked contract cannot be credible only because it references energy. It must also define the value and risk of that reference.

For example, suppose a contract promises protection against low renewable-energy output or creates a token based on verified renewable generation. Several questions immediately appear: how much the energy is worth; how variable output is; what collateral or reserve should be posted; how much oracle or measurement error the system can tolerate; and which locations are suitable for the design.

These are pricing questions before they are implementation questions. A smart contract can enforce a rule, but it cannot make a bad rule economically sound. If the pricing model underestimates volatility or shortfall risk, the contract can still execute correctly while producing a fragile financial instrument.

For this reason, this chapter treats pricing as part of credibility. A system that links financial claims to energy must measure not only expected energy value, but also uncertainty around that value.

### 4.3 The Underlying Risk

Renewable output varies with irradiance, weather, season, equipment, and grid conditions. A kilowatt-hour is not a uniform financial object; its value depends on where and when it is produced and how the market prices it.

The chapter focuses on solar-linked examples because public resource data are widely available (NASA POWER; NREL PVWatts). Those datasets support modelling and benchmarking. They do not substitute for meter or inverter evidence at settlement—a distinction developed further in Chapter 5.

#### 4.3.1 Location inputs and volatility calibration

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


### 4.4 Model Setup

The pricing framework treats energy value as the underlying for a short-horizon option-style claim, expressed in dollars per kilowatt-hour ($/kWh). The main inputs are the spot proxy `S₀`, strike `K`, volatility σ, risk-free rate `r`, and horizon `T`.

The chapter uses a Taiwan base case at `T = 0.25` years as the preferred numerical anchor (Table 4.1). Location-level values for `S₀`, `r`, and cold-start σ appear in Table 4.4 (§4.3.1). Volatility is estimated from NASA POWER irradiance variability because traded option implied volatility is not available for these sites. Geometric Brownian motion is used as a transparent short-horizon benchmark. It is not a claim that electricity prices follow GBM everywhere; jumps, seasonality, negative prices, and mean reversion remain extensions for future work.

**Table 4.1. Taiwan base case (numerical anchor)**

| Parameter | Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.01957/kWh` |
| Method gap | About `+2.1%` Monte Carlo vs binomial |

### 4.5 Numerical Pricing Methods

The chapter prices the payoff with two standard numerical methods: a binomial tree (Cox, Ross, and Rubinstein, 1979) and Monte Carlo simulation. Agreement between the two methods under identical assumptions supports reproducibility.

Table 4.2 and Figure 4.2 report cross-location at-the-money values, with `K = S₀` at each site. For high-volatility locations, binomial and Monte Carlo values differ by about 2%. Germany's option value is small because both `S₀` and σ are low; Brazil's is large because both are high. Older runs that fixed `K = $0.0525` across all sites are retained only as non-canonical robustness artifacts (`PRICING_ROBUSTNESS_NOTES.md`).

Table 4.5 and Figure 4.3 show that Taiwan binomial prices stabilise by about `N = 400` steps, which is the engine default.

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | % Diff (B vs MC) |
|---|---:|---:|---:|---:|---:|
| Germany | 0.0250 | 45% | 0.00234 | 0.00236 | 0.9% |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.01957 | 2.1% |
| Saudi Arabia | 0.0550 | 172% | 0.01841 | 0.01876 | 1.9% |
| Arizona, USA | 0.0580 | 165% | 0.01877 | 0.01911 | 1.8% |
| Brazil | 0.0950 | 198% | 0.03702 | 0.03781 | 2.1% |

*Strike: `K = S₀` per location. Source: `cross_location_pricing.csv`.*

![Cross-location binomial vs Monte Carlo ATM call values.](empirical_results/figures/cross_location_pricing.png)

*Figure 4.2. Cross-location ATM comparison.*

![Binomial tree convergence for Taiwan parameters.](empirical_results/figures/binomial_convergence.png)

*Figure 4.3. Binomial convergence (Taiwan).*

### 4.6 Cross-Location Results

Renewable risk is local. Inputs in Table 4.4 produce the option values in Table 4.2 and the collateral implications in Table 4.6. High-volatility sites such as Brazil and Taiwan require larger option values and margins than Germany.

The contribution is therefore not a single universal energy price. It is a location-specific, inspectable risk toolkit whose assumptions can be challenged and rerun. A credible energy-linked contract should state its inputs openly rather than hide them behind a generic label.

### 4.7 Collars, Oracle Tolerance, and Margin

Beyond the base call valuation, the chapter tests three design-relevant extensions.

First, collars limit upside and downside with paired options. Under symmetric percentage strikes in a lognormal model, a net credit can arise structurally because the out-of-the-money call sits closer in log space than the out-of-the-money put. Credit magnitude grows with σ; it is not presented here as a discovered volatility threshold.

Second, oracle tolerance asks how much measurement error a hedge can tolerate before effectiveness falls below a target (Table 4.3, Figure 4.5). High-volatility sites accept more error than Germany for the same variance-reduction goal. That result is directly relevant to whether meter-grade data, inverter logs, or satellite proxies are adequate for a given claim.

![Oracle tolerance by location (variance reduction ≥ 95%).](empirical_results/figures/oracle_tolerance_bars.png)

*Figure 4.5. Oracle tolerance by location.*

Third, margin and collateral requirements rise with `S₀` and σ (Table 4.6, Figure 4.4). At Taiwan's spot proxy with σ = 189%, initial margin is about `$0.63/kWh` under a 1.5× VaR₉₉ rule. Issuance without stress-aware collateral rules would therefore be irresponsible even if the contract executes correctly on-chain.

![Initial margin vs volatility at Taiwan spot proxy.](empirical_results/figures/margin_stress_taiwan.png)

*Figure 4.4. Margin stress (Taiwan S₀).*

**Table 4.3. Maximum oracle error for variance reduction ≥ 95%**

| Location | Maximum Oracle Error for Variance Reduction >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

### 4.8 What the Pricing Layer Proves and Does Not Prove

The pricing layer supports four bounded claims. First, energy-linked payoffs can be valued under explicit assumptions. Second, public data can supply cold-start volatility when implied volatility is absent. Third, independent numerical methods can cross-check stability. Fourth, the resulting outputs can inform margin and oracle-tolerance design.

The pricing layer does not show that GBM is universally correct, that it replaces market-implied volatility where markets exist, or that it resolves liquidity, legal enforceability, basis risk, or physical settlement. Meter verification and contract law remain separate problems, developed further in Chapter 5.

The contribution is therefore methodological: a path from public energy data to transparent risk metrics, not a completed market design.

### 4.9 Chapter Conclusion

Chapter 3 showed conditional evidence that energy cost can matter in digital markets. This chapter showed how renewable-energy-linked risk can be priced and stress-tested under explicit, location-specific assumptions.

Pricing is not optional for credible energy-linked finance. A rule-bound contract without a pricing and collateral layer can still be economically fragile even when it executes faithfully in software.

Chapter 5 turns to the rules—data, issuance, settlement, and governance—that must wrap any such pricing in enforceable implementation.

> **Key takeaway:** Public data and transparent numerics can support collateral and oracle design—they do not replace meter verification or legal settlement.



## References

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

Bank for International Settlements. (2023). *Annual Economic Report 2023: Blueprint for the future monetary system*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Bessembinder, H., & Lemmon, M. L. (2002). Equilibrium pricing and optimal hedging in electricity forward markets. *Journal of Finance, 57*(3), 1347-1382.

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Bordo, M. D. (1993). The gold standard, Bretton Woods and other monetary regimes: A historical appraisal. *Federal Reserve Bank of St. Louis Review, 75*(2), 123-191.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Chainlink. (2025). *The blockchain oracle problem*. https://chain.link/education-hub/oracle-problem

Cong, L. W., & He, Z. (2019). Blockchain disruption and smart contracts. *The Review of Financial Studies, 32*(5), 1754-1797.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Deng, S. J., & Oren, S. S. (2006). Electricity derivatives and risk management. *Energy, 31*(6-7), 940-953.

Federal Reserve Bank of St. Louis. (2010). *Central bank credibility and inflation expectations*. https://www.stlouisfed.org/publications/regional-economist/january-2010/central-bank-credibility-and-inflation-expectations

Kydland, F. E., & Prescott, E. C. (1977). Rules rather than discretion: The inconsistency of optimal plans. *Journal of Political Economy, 85*(3), 473-491.

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

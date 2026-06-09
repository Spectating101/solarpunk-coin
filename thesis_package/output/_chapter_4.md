## Chapter 4 - Pricing Renewable-Energy Risk

### 4.1 Purpose of the Chapter

Chapter 3 showed that energy cost can matter in a digital market, but that the relationship is conditional and regime-dependent. This chapter moves from empirical motivation to financial design.

If energy is going to constrain digital money or energy-linked contracts, the system must be able to price energy risk. Energy production is not constant. Solar and wind output vary by location, season, weather, and grid conditions. A financial claim linked to energy cannot be credible if it ignores that variability.

This chapter therefore asks:

How can an energy-linked financial contract be priced when the underlying energy source is variable, local, and not supported by a liquid options market?

The answer developed here is a practical pricing framework. It does not claim to be the final model for all electricity markets. It provides a reproducible starting point: use public energy data to estimate volatility, define a simple payoff, price the payoff with standard numerical methods, and test whether the result is stable enough to inform collateral and settlement rules.

This matters for the thesis because pricing is one of the conditions that turns "energy-backed" from a label into a credible financial constraint. If risk is not priced, then token creation or settlement promises can become under-collateralised claims.

### 4.2 Why Pricing Comes Before Settlement

An energy-linked contract cannot be credible only because it references energy. It must also define the value and risk of that reference.

For example, suppose a contract promises protection against low renewable-energy output or creates a token based on verified renewable generation. Several questions immediately appear:

- How much is the energy worth?
- How variable is the output?
- What happens if generation is lower than expected?
- How much collateral or reserve should be posted?
- How much oracle or measurement error can the system tolerate?
- Which locations are suitable for this design, and which are not?

These are pricing questions before they are implementation questions. A smart contract can enforce a rule, but it cannot make a bad rule economically sound. If the pricing model underestimates volatility or shortfall risk, the contract can still execute correctly while producing a fragile financial instrument.

For this reason, this chapter treats pricing as part of credibility. A system that links financial claims to energy must measure not only expected energy value, but also uncertainty around that value.

### 4.3 The Underlying Risk

The central risk in this chapter is renewable-energy variability.

Solar output changes with irradiance, cloud cover, season, system size, panel efficiency, and site conditions. Wind output changes with wind speed and turbine characteristics. Grid value changes with demand, congestion, tariff rules, and curtailment. A kilowatt-hour is therefore not just a physical unit. Its financial value depends on where and when it is produced and how the market treats it.

This thesis focuses mainly on solar-linked examples because solar resource data is widely available through public datasets. NASA POWER provides satellite-derived solar and meteorological data, while NREL PVWatts estimates photovoltaic production from location and system assumptions (NASA POWER, n.d.; NREL, n.d.).

These public datasets are not a substitute for meter data. They estimate resource conditions and potential output. They are useful for modelling and benchmarking, not final settlement at a specific physical site. Actual settlement would require stronger evidence, such as meter, inverter, grid, or audited operator data. This distinction is important because the pricing layer estimates risk, while the settlement layer must verify actual claims.

### 4.4 Model Setup

The pricing framework uses a short-horizon option-style model.

The basic object is a financial claim linked to the value of energy, measured in dollars per kilowatt-hour. The model uses:

- `S0`: current energy value or spot proxy in dollars per kWh;
- `K`: strike or reference cost floor;
- `sigma`: volatility estimate;
- `r`: risk-free rate;
- `T`: contract horizon.

The preferred pricing specification uses a quarterly horizon, `T = 0.25`, and a representative Taiwan base case with `S0 = $0.0525/kWh`, `sigma = 189%`, and `r = 2.5%`. The volatility is derived from solar-resource variability rather than from a liquid traded options market. This is a cold-start method: when market-implied volatility is unavailable, public physical data provides an initial risk estimate.

The model uses geometric Brownian motion as a tractable first approximation. This is not a claim that electricity prices perfectly follow GBM. Electricity markets can show jumps, seasonality, mean reversion, negative prices, and local market constraints. The GBM assumption is used because it is transparent, reproducible, and appropriate as a short-horizon benchmark. The thesis treats it as a starting model, not a universal law of energy prices.

Table 4.1 records the preferred Taiwan base case used as the chapter's main numerical anchor.

| Parameter | Value |
|---|---:|
| Underlying proxy `S0` | `$0.0525/kWh` |
| Strike/reference cost `K` | `$0.0525/kWh` |
| Horizon `T` | `0.25` years |
| Risk-free rate `r` | `2.5%` |
| Volatility `sigma` | `189%` |
| Binomial call value | `$0.01917/kWh` |
| Monte Carlo call value | `$0.02025/kWh` |
| Method gap | About `+5.6%` Monte Carlo vs binomial |

### 4.5 Numerical Pricing Methods

The chapter validates pricing with two independent numerical methods.

The first method is a binomial tree. A binomial tree divides the horizon into steps and recursively values the payoff backward from maturity. It is transparent and useful for checking convergence as the number of steps increases (Cox, Ross, and Rubinstein, 1979).

The second method is Monte Carlo simulation. Monte Carlo simulation generates many possible future paths and estimates the expected discounted payoff from those paths. It is useful because it can be extended later to richer processes, stress scenarios, and non-standard payoff structures.

Using both methods reduces dependence on a single implementation. If binomial and Monte Carlo values are close under the same assumptions, the pricing engine is more credible as a reproducible research tool.

The preferred specification shows reasonable convergence for the main high-volatility locations. In the cross-location summary:

- Taiwan: binomial price about `$0.01917/kWh`, Monte Carlo about `$0.02025/kWh`.
- Saudi Arabia: binomial about `$0.01929/kWh`, Monte Carlo about `$0.01945/kWh`.
- Arizona: binomial about `$0.02068/kWh`, Monte Carlo about `$0.02100/kWh`.
- Brazil: binomial about `$0.05373/kWh`, Monte Carlo about `$0.05449/kWh`.

Germany has a very small option value in this convergence run, so the relative percentage difference is inflated by the tiny denominator. This should be interpreted carefully. The more important result is that the main target cases converge to economically similar values under independent methods.

Table 4.2 gives the preferred cross-location pricing specification used in this chapter. Earlier prototype runs used slightly different parameter sets; those are treated as robustness artifacts rather than the main result.

| Location | S0 ($/kWh) | Sigma | Binomial Call | Monte Carlo Call | Interpretation |
|---|---:|---:|---:|---:|---|
| Germany | 0.0250 | 45% | 0.000001 | 0.0000009 | Near-zero option value in this convergence run; relative difference inflated by tiny base. |
| Taiwan | 0.0525 | 189% | 0.01917 | 0.02025 | Main base case; convergence within about 5.6%. |
| Saudi Arabia | 0.0550 | 172% | 0.01929 | 0.01945 | Strong convergence. |
| Arizona | 0.0580 | 165% | 0.02068 | 0.02100 | Strong convergence. |
| Brazil | 0.0950 | 198% | 0.05373 | 0.05449 | Strong convergence. |

### 4.6 Cross-Location Results

The pricing framework is tested across multiple locations because renewable-energy risk is local.

The cross-location results show that option values and risk profiles vary meaningfully by region. Brazil, Taiwan, Saudi Arabia, Arizona, and Germany do not have the same spot values, volatility estimates, or margin requirements. This is expected. Energy-linked finance should not assume a single global parameter set.

The preferred cross-location pricing table reports the following approximate values:

- Taiwan: `S0 = $0.0525/kWh`, `sigma = 189%`, call price around `$0.019/kWh`.
- Saudi Arabia: `S0 = $0.055/kWh`, `sigma = 172%`, call price around `$0.018-$0.019/kWh`.
- Arizona: `S0 = $0.058/kWh`, `sigma = 165%`, call price around `$0.019-$0.021/kWh`.
- Brazil: `S0 = $0.095/kWh`, `sigma = 198%`, call price around `$0.054/kWh` in the preferred convergence table.
- Germany: lower volatility and lower spot assumptions lead to a much smaller risk value in some specifications.

The point is not that one table gives a final market price. The point is that the framework can produce location-specific pricing under explicit assumptions. Those assumptions can be inspected, challenged, and rerun.

This is important for credibility. An energy-linked contract should not hide its risk model. It should state its inputs and show how the price or collateral changes when those inputs change.

### 4.7 Collars, Oracle Tolerance, and Margin

The pricing layer also supports risk-control design.

One instrument considered in the pricing layer is a collar structure. A collar combines options to limit downside and upside exposure. Earlier drafts overstated this result as a volatility-threshold discovery. The corrected result is more precise: under the chosen symmetric percentage strikes in a lognormal model, the collar can produce a net credit structurally because the out-of-the-money call is closer in log space than the out-of-the-money put. The credit grows with volatility, but it should not be presented as a newly discovered threshold.

That correction matters. The thesis is stronger when it states the actual mechanism rather than overclaiming the result.

The pricing layer also studies oracle tolerance. Oracle tolerance asks how much measurement or oracle error the hedge can absorb before its effectiveness falls below a chosen threshold. The current source-of-truth table reports maximum oracle-error thresholds for variance-reduction targets. For example:

- Taiwan tolerates about `21.7%` oracle error for variance reduction above `95%`.
- Saudi Arabia tolerates about `19.7%`.
- Arizona tolerates about `18.9%`.
- Brazil tolerates about `22.7%`.
- Germany tolerates only about `5.2%`.

This result is important because it shows that location matters. High-volatility solar markets can tolerate more oracle error before the hedge breaks down. Lower-volatility markets such as Germany require much more accurate data for the same hedge-effectiveness threshold.

Table 4.3 summarises the current oracle-tolerance source-of-truth values.

| Location | Maximum Oracle Error for Variance Reduction >= 95% |
|---|---:|
| Taiwan | 21.7% |
| Saudi Arabia | 19.7% |
| Arizona | 18.9% |
| Brazil | 22.7% |
| Germany | 5.2% |

The pricing layer also informs collateral and margin. A financial claim that pays under adverse energy outcomes must be backed by enough collateral or reserve capital to survive stress. The current margin stress table shows that required margin rises with both spot value and volatility. This is expected, but important: energy-linked contracts cannot be responsibly issued without stress-aware collateral rules.

### 4.8 What the Pricing Layer Proves and Does Not Prove

The pricing layer proves four things.

First, energy-linked payoffs can be priced under explicit assumptions.

Second, public energy data can be used to estimate a cold-start volatility input when liquid derivatives markets are unavailable.

Third, independent numerical methods can be used to check whether the pricing results are stable.

Fourth, pricing outputs can inform collateral, margin, and oracle-tolerance rules.

But the pricing layer does not prove that the model is final.

It does not prove that GBM is the correct process for all energy markets. It does not replace market-implied volatility if such a market exists. It does not solve liquidity, legal enforceability, basis risk, or physical settlement. It does not prove that a site actually produced energy. Those are separate problems handled by data verification and contract design.

The chapter's contribution is therefore methodological: it shows how to move from public energy data to a transparent pricing and risk framework. It does not claim to complete the entire market design.

### 4.9 Chapter Conclusion

Chapter 3 showed that energy cost can matter in digital markets, but only conditionally. This chapter showed how energy-linked risk can be priced in a controlled way.

The key conclusion is that pricing is not optional. If energy is used as a financial constraint, the system must account for volatility, location, oracle error, and stress exposure. A rule-bound contract without a credible pricing layer may still be fragile.

The pricing results support the thesis in a bounded way. They show that public energy data, numerical pricing, cross-location validation, oracle-tolerance checks, and margin stress analysis can form a practical risk framework. They also show that some locations and assumptions are more suitable than others.

This leads directly to Chapter 5. Once energy can be measured and its risk can be priced, the next question is what rules are required to make an energy-linked digital instrument credible in implementation.



## References

Barro, R. J., & Gordon, D. B. (1983). Rules, discretion and reputation in a model of monetary policy. *Journal of Monetary Economics, 12*(1), 101-121.

Cambridge Centre for Alternative Finance. (n.d.-a). *Cambridge Bitcoin Electricity Consumption Index: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/methodology

Cambridge Centre for Alternative Finance. (n.d.-b). *CBECI Mining Map: Methodology*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci/mining_map/methodology

Eichengreen, B. (1992). *Golden Fetters: The Gold Standard and the Great Depression, 1919-1939*. Oxford University Press.

Ethereum.org. (n.d.). *The Merge*. https://ethereum.org/en/upgrades/merge/

Federal Reserve History. (2013). *Nixon Ends Convertibility of U.S. Dollars to Gold and Announces Wage/Price Controls*. https://www.federalreservehistory.org/essays/gold_convertibility_ends

Friedman, M. (1960). *A Program for Monetary Stability*. Fordham University Press.

Hayes, A. S. (2019). Bitcoin price and its marginal cost of production: Support for a fundamental value. *Applied Economics Letters, 26*(7), 554-560.

International Energy Agency. (2023). *Scaling Up Private Finance for Clean Energy in Emerging and Developing Economies*. https://www.iea.org/reports/scaling-up-private-finance-for-clean-energy-in-emerging-and-developing-economies

International Energy Agency. (2024). *World Energy Investment 2024*. https://www.iea.org/reports/world-energy-investment-2024

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

Liu, Y., & Tsyvinski, A. (2021). Risks and returns of cryptocurrency. *The Review of Financial Studies, 34*(6), 2689-2727.

Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

OECD. (2024). *Bridging the Clean Energy Investment Gap: Cost of Capital in the Transition to Net-Zero Emissions*. https://www.oecd.org/en/publications/bridging-the-clean-energy-investment-gap_1ae47659-en.html

U.S. Department of State, Office of the Historian. (n.d.). *Nixon and the End of the Bretton Woods System, 1971-1973*. https://history.state.gov/milestones/1969-1976/nixon-shock

Cambridge Centre for Alternative Finance. (n.d.). *Cambridge Bitcoin Electricity Consumption Index*. Cambridge Judge Business School. https://ccaf.io/cbnsi/cbeci

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

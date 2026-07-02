# Chapter 4 - Pricing Renewable-Energy Risk

## At a glance

| | |
|---|---|
| **Question** | How do you price an energy-linked claim when there is no liquid options market? |
| **Method** | Option-style model on $/kWh; binomial tree + Monte Carlo cross-check |
| **Base case** | Taiwan: S₀ = $0.0525/kWh, σ ≈ 189%, call ≈ $0.0192/kWh (binomial) |
| **Also covers** | Cross-location comparison, oracle tolerance, collars, margin |
| **Takeaway** | Risk must be **inspectable** before settlement rules can be credible |
| **Next chapter** | Ch 5 — five constraints + Sepolia implementation |

## 4.1 Purpose of the Chapter

Chapter 2 argued that renewable-energy-linked claims require explicit pricing before issuance can be credible. Chapter 3 showed that energy cost can matter in a digital market, but that the relationship is conditional and regime-dependent. This chapter implements the pricing layer.

If energy is going to constrain digital money or energy-linked contracts, the system must be able to price energy risk. Energy production is not constant. Solar and wind output vary by location, season, weather, and grid conditions. A financial claim linked to energy cannot be credible if it ignores that variability.

This chapter therefore asks how an energy-linked financial contract can be priced when the underlying source is variable, local, and not supported by a liquid options market.

The answer developed here is a practical **cold-start** pricing framework. It does not claim to be the final model for all electricity markets. It provides a reproducible starting point when implied volatility and liquid derivatives are unavailable: use public energy data to estimate volatility, define a simple payoff, price the payoff with standard numerical methods, and test whether the result is stable enough to inform collateral and settlement rules.

This matters for the thesis because pricing is one of the conditions that turns "energy-linked" from a label into a credible financial constraint. If risk is not priced, token creation or settlement promises can become under-collateralised claims.

## 4.2 Why Pricing Comes Before Settlement

An energy-linked contract cannot be credible only because it references energy. It must also define the value and risk of that reference.

For example, suppose a contract promises protection against low renewable-energy output or creates a token based on verified renewable generation. Several questions immediately appear: how much the energy is worth; how variable output is; what collateral or reserve should be posted; how much oracle or measurement error the system can tolerate; and which locations are suitable for the design.

These are pricing questions before they are implementation questions. A smart contract can enforce a rule, but it cannot make a bad rule economically sound. If the pricing model underestimates volatility or shortfall risk, the contract can still execute correctly while producing a fragile financial instrument.

For this reason, this chapter treats pricing as part of credibility. A system that links financial claims to energy must measure not only expected energy value, but also uncertainty around that value.

## 4.3 The Underlying Risk

Renewable output varies with irradiance, weather, season, equipment, and grid conditions. A kilowatt-hour is not a uniform financial object; its value depends on where and when it is produced and how the market prices it.

The chapter focuses on solar-linked examples because public resource data are widely available (NASA POWER; NREL PVWatts). Those datasets support modelling and benchmarking. They do not substitute for meter or inverter evidence at settlement—a distinction developed further in Chapter 5.

<!-- INJECT_CH4_EMPIRICAL_TABLES -->

## 4.4 Model Setup

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

## 4.5 Numerical Pricing Methods

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

## 4.6 Cross-Location Results

Renewable risk is local. Inputs in Table 4.4 produce the option values in Table 4.2 and the collateral implications in Table 4.6. High-volatility sites such as Brazil and Taiwan require larger option values and margins than Germany.

The contribution is therefore not a single universal energy price. It is a location-specific, inspectable risk toolkit whose assumptions can be challenged and rerun. A credible energy-linked contract should state its inputs openly rather than hide them behind a generic label.

## 4.7 Collars, Oracle Tolerance, and Margin

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

## 4.8 What the Pricing Layer Proves and Does Not Prove

The pricing layer supports four bounded claims. First, energy-linked payoffs can be valued under explicit assumptions. Second, public data can supply cold-start volatility when implied volatility is absent. Third, independent numerical methods can cross-check stability. Fourth, the resulting outputs can inform margin and oracle-tolerance design.

The pricing layer does not show that GBM is universally correct, that it replaces market-implied volatility where markets exist, or that it resolves liquidity, legal enforceability, basis risk, or physical settlement. This cold-start layer supports modelling and stress-testing under transparent assumptions; meter verification and contract law remain separate problems, developed further in Chapter 5.

The contribution is therefore methodological: a path from public energy data to transparent risk metrics, not a completed market design.

## 4.9 Chapter Conclusion

Chapter 3 showed conditional evidence that energy cost can matter in digital markets. This chapter showed how renewable-energy-linked risk can be priced and stress-tested under explicit, location-specific assumptions.

Pricing is not optional for credible energy-linked finance. A rule-bound contract without a pricing and collateral layer can still be economically fragile even when it executes faithfully in software.

Chapter 5 turns to the rules—data, issuance, settlement, and governance—that must wrap any such pricing in enforceable implementation.

> **Key takeaway:** Public data and transparent numerics can support collateral and oracle design—they do not replace meter verification or legal settlement.

## References

Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.

Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. *Journal of Financial Economics, 7*(3), 229-263.

Lazard. (2025). *Levelized Cost of Energy+*. https://www.lazard.com/research-insights/levelized-cost-of-energyplus/

NASA POWER. (n.d.). *Prediction of Worldwide Energy Resources*. NASA Langley Research Center. https://power.larc.nasa.gov/

National Renewable Energy Laboratory. (n.d.). *PVWatts API*. https://developer.nrel.gov/docs/solar/pvwatts/

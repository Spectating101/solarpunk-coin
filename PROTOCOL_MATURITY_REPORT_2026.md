# SolarPunk Protocol: 2026 Maturity & Solvency Memo
**Technical Risk Assessment and Pilot Readiness Review**

## 1. Executive Summary
SolarPunk is a renewable-energy financial primitive designed for data-anchored hedging. As of April 2026, the protocol has moved beyond the prototype phase into a **risk-bounded operating envelope**. Following a series of jump-diffusion stress tests, we have identified and mitigated core environmental vulnerabilities, established a conservative 250% initial margin baseline, and defined the required capitalization ratios for pilot-scale deployment. 

The protocol is not yet mainnet-ready; it is currently positioned for **risk-boxed pilot discussions** contingent on on-chain open-interest caps and further security review.

## 2. Tested Assumptions
Our quantitative models assume an energy market environment characterized by:
- **High Annualized Settlement Volatility:** 200%+ stress assumption, calibrated from NASA POWER irradiance variability and amplified to reflect derivative settlement exposure under disrupted production conditions.
- **Discontinuous Price Jumps:** Stochastic "jumps" triggered by grid stress or weather events.
- **Oracle Latency:** 24-hour settlement cycles (current Sepolia configuration).

## 3. Stress-Test Findings (April 2026)
We conducted a **90-day extreme stress simulation** (200% Volatility + Stochastic Jumps) to evaluate clearinghouse solvency.
- **Legacy Margin Failure:** Initial tests at 150% margin revealed an 11% insolvency rate, where price "gaps" between oracle updates exhausted collateral.
- **Hardened Margin Performance:** Increasing the baseline to **250% Initial Margin (4x leverage)** and **125% Maintenance Margin** reduced native insolvency events and increased the protocol's unassisted survival rate to **80.24%** under extreme 90-day stress.
- **Tail Risk Discovery:** For a pilot-scale exposure of **100 MWh ($10,000 notional)**, the 99% Value-at-Risk (VaR) insurance drain on the insurance fund is **$171,263** under the April 2026 stress model.

## 4. Solvency Envelope
The protocol’s settlement guarantee is bounded by insurance capital and open-exposure caps.

- **Current Simulated Treasury Balance:** $50,000 MockUSDC on Sepolia.
- **Current Safe Exposure Limit:** Under current simulated capitalization and 200% settlement-volatility assumptions, the protocol can support approximately **25–30 MWh of active open exposure** while maintaining a 99% solvency confidence interval.
- **Scaling Ratio:** Every $1.71 of insurance capital supports approximately 1 kWh of **risk-boxed hedge exposure** under the stated assumptions.

For pilot deployment, simulated MockUSDC capital must be replaced with real reserve capital governed by the same open-interest caps.

## 5. Risk-Boxing Policy
To protect protocol integrity before a full security audit, the following constraints are active:
1. **Open-Interest Caps:** On-chain limits on the total notional volume per series.
2. **Aggressive Margining:** 250% IM / 125% MM required for all new positions.
3. **Oracle Bond-Gating:** All price updates require operators to maintain a 100 USDC slashable stake.

## 6. Pilot Capitalization Ask
We are seeking a **$125,000 pilot grant** to move SolarPunk toward Milestone 4 (Pilot Credibility):

- **$75,000 Solvency Reserve:** Added to the existing $50,000 reserve target, this brings total pilot insurance capital to **$125,000**, supporting a conservative **60 MWh open-exposure cap** with buffer above the 99% VaR requirement.
- **$30,000 Security Hardening:** External audit review, fuzz testing, and adversarial scenario testing.
- **$20,000 Deployment & Monitoring:** Oracle automation, monitoring infrastructure, and sub-hour update frequency to reduce residual gap risk.

## 7. Remaining Risks
- **Extreme Gap Risk:** Price jumps exceeding 125% within a single oracle window can still cause insolvency.
- **Oracle Dependency:** The protocol relies on the timely submission of NASA-anchored data by the `ChainlinkOracleAdapter`.
- **Smart Contract Risk:** Audit pending; code logic is currently verified but not formally audited.

## 8. Audit & Pilot Status
- **Contracts:** Deployed to Sepolia, source-verified.
- **Hardening:** PI controller gains tuned; 24h governance timelock active; multisig handoff complete.
- **Readiness:** Ready for **Milestone 3.5 (Risk-Boxed Pilot)**.

---
*This report is provided for technical review and does not constitute financial advice. All figures are based on stochastic simulations and historic volatility proxies.*

# SolarPunk Energy Standard Economics

- generated_at: `2026-06-28T07:38:27.893Z`
- one_line: SolarPunk is an energy-standard cryptocurrency: a modern gold-standard system where verified renewable-energy surplus replaces gold as the backing base.

## Core Thesis

SPK supply should expand only when productive energy surplus is measured, admitted, signed, and converted through a transparent issuance rule.

This is the economic/finance spine of the project. The technical system exists to enforce this rule:

> verified productive energy surplus -> admissible proof -> SPK issuance -> circulation -> redemption accounting

## Monetary Equations

| Function | Equation |
|---|---|
| issuance | `gross_spk = accepted_surplus_kwh * energy_price_usd_per_kwh` |
| net_issuance | `net_spk = gross_spk * (1 - mint_fee_bps / 10000)` |
| convertibility | `owed_kwh = redeemed_spk / energy_price_usd_per_kwh` |
| settlement_velocity | `effective_settlement_volume = circulating_spk * velocity` |
| fee_capture | `protocol_currency_fee = mint_fee_spk + redemption_fee_spk; settlement transfers currently have no protocol fee in SolarPunkCurrencySystem` |

## Current Monetary State

| Metric | Value |
|---|---:|
| energy_price_usd_per_kwh | `0.05` |
| kwh_per_1_spk_at_current_basis | `20` |
| accepted_surplus_kwh_fixture | `2606.7` |
| public_or_local_minted_spk | `130.1697` |
| issuance_formula_net_spk | `130.1697` |
| issuance_formula_delta_spk | `0` |
| active_supply_spk_lab | `2589.0933` |
| active_supply_energy_equivalent_kwh_lab | `51781.866` |
| redeemed_spk_lab | `15` |
| redeemed_energy_equivalent_kwh_lab | `300` |
| settlement_volume_spk_lab | `307` |
| settlement_velocity_ratio_lab | `0.1179` |

## Proof Issuance Math

| Item | Value |
|---|---:|
| Accepted on-chain surplus | `2606 kWh` |
| Energy basis | `$0.05/kWh` |
| Gross issuance | `130.3 SPK` |
| Mint fee | `10 bps` |
| Net issuance by formula | `130.1697 SPK` |
| Observed minted SPK | `130.1697 SPK` |
| Formula match | `true` |

## Gold Standard Mapping

| Gold standard | SolarPunk energy standard | Implementation | Remaining risk |
|---|---|---|---|
| Gold reserve base | Verified renewable surplus base | signed meter/inverter data, source hashes, oracle attestation, replay protection | meter custody, data quality, basis mismatch, and operator honesty |
| Assay and vault custody | Measurement, signature, and registry custody | meter registry, accepted bundle, consumed source hash, accepted kWh | hardware certification and no-double-counting registry discipline |
| Convertibility promise | Redemption into owed-kWh claim | redeemForEnergy, burn accounting, fulfillment/shortfall/dispute states | legal redemption terms and real delivery counterparty |
| Scarce mine output constrains issuance | Measured productive surplus constrains issuance | mintFromSurplusAttestation accepts only admissible surplus evidence | governance must not weaken admissibility rules |

## Capacity And Issuance Scenarios

| Scenario | Capacity | Annual kWh | Net annual SPK | Mint fee SPK | Same-cost capex sensitivity | Simple payback |
|---|---:|---:|---:|---:|---:|---:|
| Single rooftop | 10 kW | 10,038.12 | 501.4 | 0.5 | $31,500 | 62.76 years |
| Neighborhood cluster | 250 kW | 250,953 | 12,535.1 | 12.55 | $787,500 | 62.76 years |
| Commercial portfolio | 1,000 kW | 1,003,812 | 50,140.41 | 50.19 | $3,150,000 | 62.76 years |
| Community microgrid | 5,000 kW | 5,019,060 | 250,702.05 | 250.95 | $15,750,000 | 62.76 years |
| Utility-scale reference | 100,000 kW | 100,381,200 | 5,014,040.94 | 5,019.06 | $315,000,000 | 62.76 years |

The capex column deliberately uses the same cost assumption from the resource benchmark for sensitivity only. It is not a utility-scale quote.

## Price Basis Sensitivity

| Energy price basis | kWh per SPK | 10 kW annual net SPK | 10 kW mint fee SPK | Simple payback |
|---:|---:|---:|---:|---:|
| $0.05/kWh | 20 | 501.4 | 0.5019 | 62.76 years |
| $0.1/kWh | 10 | 1,002.81 | 1.0038 | 31.38 years |
| $0.2/kWh | 5 | 2,005.62 | 2.0076 | 15.69 years |
| $0.35/kWh | 2.86 | 3,509.83 | 3.5133 | 8.97 years |

## Settlement Velocity

| Scenario | 0.5x velocity | 1x velocity | 3x velocity | 10x velocity |
|---|---:|---:|---:|---:|
| Single rooftop | 250.7 | 501.4 | 1,504.21 | 5,014.04 |
| Neighborhood cluster | 6,267.55 | 12,535.1 | 37,605.31 | 125,351.02 |
| Commercial portfolio | 25,070.2 | 50,140.41 | 150,421.23 | 501,404.09 |
| Community microgrid | 125,351.02 | 250,702.05 | 752,106.14 | 2,507,020.47 |
| Utility-scale reference | 2,507,020.47 | 5,014,040.94 | 15,042,122.82 | 50,140,409.4 |

## Monetary Function Readiness

| Function | Status | Evidence |
|---|---|---|
| Issuance discipline | `implemented_in_proof_stack` | SPK mints from signed surplus attestation with source-hash replay protection. |
| Unit of account | `partial` | Prototype uses a USD/kWh basis; the deeper energy standard is kWh-per-SPK convertibility. |
| Medium of exchange | `local_lab` | SolarPunkCurrencySystem settles hashed invoices in SPK locally. |
| Store of value | `not_proven` | Needs real redemption terms, liquidity, governance, audit, and user demand. |
| Standard of deferred payment | `partial` | SPK redemption records can track owed kWh with fulfillment, shortfall, and dispute states. |
| Reserve/backing transparency | `partial` | Energy evidence and public readback exist; production-grade registry, audit, and operator controls are still open. |

## Finance Risk Register

| Risk | Meaning | Control |
|---|---|---|
| Basis risk | A generic kWh estimate is not always deliverable where and when the holder needs energy. | Move toward time/location/source-tagged SPK claims. |
| Oracle and meter risk | Bad hardware, bad signatures, duplicate claims, or compromised operators can corrupt issuance. | Hardware-backed meters, no-double-counting registry, multi-oracle checks, and slashing. |
| Redemption mismatch | Issued SPK may circulate faster or farther than the operator's real delivery ability. | Caps, redemption queues, insurance fund, shortfall rules, and local delivery domains. |
| Price-basis governance | Changing USD/kWh basis changes issuance volume and kWh-per-SPK convertibility. | Transparent governance delay, public parameter history, and basis-policy disclosure. |
| Regulatory classification | SPK could be treated as a cryptocurrency, prepaid energy credit, commodity-linked token, stablecoin-like token, security, or another instrument. | Legal scope before paid/mainnet launch. |

## Hard Boundaries

- This is an economic framework and sensitivity model, not a claim of legal money status.
- The protocol does not create energy; it creates an issuance rule over verified productive energy surplus.
- NASA/resource estimates can size the backing base, but cannot mint SPK.
- The current redemption loop is local/lab evidence unless a real operator accepts the obligation.
- The same-cost capex sensitivity is not a vendor quote, project-finance model, or expected return promise.

## Next Finance Build Targets

- Add time/location/vintage tags to SPK issuance and redemption claims.
- Build a monetary stress harness for redemption waves, velocity spikes, oracle errors, and shortfalls.
- Define an explicit reserve/insurance fund policy tied to outstanding owed-kWh exposure.
- Write a legally cautious redemption policy for pilot operators.
- Replace the resource benchmark with one real generator export and rerun the same issuance model.

## References

- [BIS unified ledger/tokenisation framing](https://www.bis.org/publ/arpdf/ar2023e3.htm) - Programmable settlement and tokenised claims framing.
- [FSB global stablecoin recommendations](https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/) - Governance, redemption, risk management, and disclosure requirements for stable-value systems.
- [US EPA renewable energy certificates](https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs) - Renewable generation attributes, certificate tracking, ownership, and retirement discipline.
- [NASA POWER Daily API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/) - Empirical resource basis for solar and wind benchmark sizing.

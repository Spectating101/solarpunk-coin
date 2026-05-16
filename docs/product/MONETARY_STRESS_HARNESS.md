# SolarPunk Monetary Stress Harness

- generated_at: `2026-05-16T16:24:49.413Z`
- thesis: SPK is not abstract money printing: every issued unit creates an energy-denominated redemption claim, so stress testing must expose redemption waves, physical delivery shortfalls, and the reserve buffer required to clear them.

## Base Monetary State

| Metric | Value |
|---|---:|
| Energy price basis | `$0.05/kWh` |
| kWh per 1 SPK | `20` |
| Current lab minted SPK | `130.1697` |
| Current lab active supply | `110.1697` |
| Pilot CSV net SPK preview | `99.15075` |
| Pilot CSV surplus | `1,985.5 kWh` |

## Equations

- owed_kwh: `redeemed_spk / energy_price_usd_per_kwh`
- delivered_kwh: `owed_kwh * (1 - delivery_shortfall_fraction)`
- shortfall_liability_usd: `shortfall_kwh * energy_price_usd_per_kwh`
- fee_buffer_usd: `mint_fee_spk + redemption_fee_spk + settlement_fee_spk, assuming 1 SPK = 1 USD unit of account for reserve accounting`
- conservation: `issued_spk = active_after_redemption_spk + redeemed_spk`

## Stress Scenarios

| Scenario | Issued SPK | Redeemed SPK | Owed kWh | Delivered kWh | Shortfall kWh | Shortfall liability | Additional buffer needed | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Current local field receipt loop | 130.1697 | 20 | 400 | 400 | 0 | $0 | $0 | `passes_full_delivery` |
| Pilot CSV full redemption | 99.1508 | 99.1508 | 1,983.02 | 1,983.02 | 0 | $0 | $0 | `passes_full_delivery` |
| Pilot CSV redemption wave | 99.1508 | 74.3631 | 1,487.26 | 1,412.9 | 74.36 | $3.72 | $3.54 | `pilot_requires_named_reserve` |
| 10 kW annual rooftop stress | 501.4041 | 501.4041 | 10,028.08 | 8,523.87 | 1,504.21 | $75.21 | $74.21 | `unsafe_without_external_reserve` |
| 1 MW commercial portfolio stress | 50,140.4094 | 20,056.1638 | 401,123.28 | 320,898.62 | 80,224.66 | $4,011.23 | $3,940.99 | `unsafe_without_external_reserve` |

## Summary

| Metric | Value |
|---|---:|
| Scenarios | `5` |
| Shortfall scenarios | `3` |
| Worst shortfall liability | `$4,011.23` |
| Worst additional buffer required | `$3,940.99` |
| All conservation checks pass | `true` |

## Required Controls Before Real Value

- Cap real redemptions to deliverable metered generation or contracted energy volume.
- Maintain a named insurance/reserve buffer sized to the stress table, not just protocol fee assumptions.
- Separate CSV import evidence from hardware-certified meter finality until device custody is independently proven.
- Publish every pilot receipt with source hash, accepted records, rejected records, mint preview, and delivery resolution.
- Keep mainnet or paid use blocked until audit, legal redemption terms, and dispute/shortfall procedures exist.

## Hard Boundaries

- This harness is an internal monetary stress model, not a solvency guarantee.
- Fee buffers are modeled accounting capacity; they are not customer funds or legal collateral unless separately reserved.
- Shortfall scenarios intentionally show where the protocol needs reserve capital instead of pretending SPK can print through physical delivery gaps.
- Capacity scenarios are based on benchmark production estimates; actual SPK issuance still requires signed surplus attestations.

# SolarPunk Currency Framework Readiness

- generated_at: `2026-05-20T12:28:13.336Z`
- current_internal_stage: `local_governed_pilot_stack_ready`
- launch_gate_context: `public_testnet_product`
- readiness: `9/9` checks

## Thesis

Treat SPK as an energy-denominated cryptocurrency: surplus attestations create supply, invoice settlement creates circulation, redemption burns supply into owed-kWh claims, and delivery resolution measures whether the system clears real obligations.

## Mechanism Path

1. `meter_or_inverter_reading`
2. `signed_surplus_attestation`
3. `spk_mint`
4. `invoice_settlement`
5. `redemption_burn`
6. `owed_kwh_claim`
7. `delivery_resolution`
8. `empirical_readiness_update`

## Internal Readiness Checks

| Check | Status | Result | Evidence | Interpretation |
|---|---|---:|---|---|
| Surplus issuance proof | `public_testnet_evidence` | PASS | `docs/product/SPK_ATTESTED_MINT_PROOF.md` | SPK is not a naked token in the lab; it starts from an accepted surplus-energy attestation. |
| Ledger conservation | `model_verified` | PASS | `state/product/currency_system_lab.json` | The lab ledger preserves minted supply across active balances and redemption burn. |
| Invoice settlement contract | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | SPK can now be routed as payment against hashed invoices with replay protection. |
| Energy claim contract | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | SPK can be transferred into a registry, burned through redeemForEnergy, and converted into an owed-kWh claim. |
| Delivery resolution and dispute state | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | The framework can track pending, fulfilled, shortfall, and disputed redemption states. |
| Contract regression tests | `tested` | PASS | `test/SolarPunkCurrencySystem.test.js` | The new currency mechanics are covered by settlement, burn/redemption, replay, slippage, fulfillment, shortfall, dispute, and re-resolution accounting tests. |
| Local SPK loop | `local_end_to_end_spk_loop` | PASS | `docs/product/FIELD_RECEIPT_LOOP.md` | The repo can run the whole internal currency path with no external dependency: signed meter surplus, SPK mint, invoice settlement, redemption burn, owed-kWh claim, and delivery resolution. |
| Governed pilot-stack drill | `local_governed_stack_exercised` | PASS | `docs/product/PILOT_STACK_CURRENCY_DRILL.md` | The latest SPK, treasury, and currency-system contracts can run as one governed-style stack: mint, payment, redemption, and delivery accounting. |
| Empirical feed continuity | `running_experiment` | PASS | `docs/project/DAILY_EXPERIMENT_STATUS.md` | The daily data loop is long enough to support continuing empirical claims instead of a one-off demo. |

## Current Quantitative State

| Metric | Value |
|---|---:|
| accepted_surplus_kwh | `2606.7` |
| minted_spk | `130.1697` |
| active_supply_spk | `110.1697` |
| redeemed_spk_lab | `20` |
| redeemed_energy_kwh_lab | `400` |
| settlement_volume_spk_lab | `83` |
| velocity_ratio_lab | `0.6376` |
| field_receipt_minted_spk | `130.1697` |
| field_receipt_settlement_volume_spk | `75` |
| field_receipt_redeemed_spk | `20` |
| field_receipt_owed_kwh | `400` |
| field_receipt_delivered_kwh | `400` |
| pilot_stack_minted_spk | `130.1697` |
| pilot_stack_settlement_volume_spk | `75` |
| pilot_stack_redeemed_spk | `20` |
| pilot_stack_owed_kwh | `400` |
| pilot_stack_delivered_kwh | `400` |
| daily_keeper_runs | `22` |

## Next Internal Build Targets

- `Currency stress harness` (next_internal_target): Simulate multi-actor payment velocity, redemption load, reserve ratio, and delivery shortfalls under daily energy-price scenarios.
- `Public Sepolia pilot-stack drill` (next_internal_target): Run the same governed SPK mint, payment, redemption, and delivery drill against a public Sepolia pilot stack.
- `Real meter export loop` (next_internal_target): Replace the fixture meter bundle with a real inverter or utility export while keeping the same local SPK script and accounting checks.

## Boundary

This is an internal engineering-readiness artifact. It measures whether the currency mechanism is coherent, testable, and empirically instrumented; it does not assert legal, audit, market, or mainnet readiness.

## Research Anchors

- [BIS unified ledger/tokenisation framing](https://www.bis.org/publ/arpdf/ar2023e3.htm) — Separates asset records, money/settlement instruments, and programmable rules.
- [NIST Smart Grid program](https://www.nist.gov/engineering-laboratory/smart-grid) — Anchors the need for interoperable, measurement-based energy data.
- [Chainlink Proof of Reserve](https://chain.link/proof-of-reserve) — Design pattern for reserve-backed mint controls and transparent backing feeds.
- [OpenZeppelin ERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20) — Base token standard and burnable token extension used by SPK.

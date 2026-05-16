# SolarPunk Currency Framework Readiness

- generated_at: `2026-05-16T06:12:08.335Z`
- current_internal_stage: `currency_framework_lab_ready`
- launch_gate_context: `public_testnet_product`
- readiness: `7/7` checks

## Thesis

Treat SPK as an energy-denominated settlement asset: surplus attestations create supply, invoice settlement creates circulation, redemption burns supply into owed-kWh receipts, and delivery resolution measures whether the system clears real obligations.

## Mechanism Path

1. `meter_or_inverter_reading`
2. `signed_surplus_attestation`
3. `spk_mint`
4. `invoice_settlement`
5. `redemption_burn`
6. `owed_kwh_receipt`
7. `delivery_resolution`
8. `empirical_readiness_update`

## Internal Readiness Checks

| Check | Status | Result | Evidence | Interpretation |
|---|---|---:|---|---|
| Surplus issuance proof | `public_testnet_evidence` | PASS | `docs/product/SPK_ATTESTED_MINT_PROOF.md` | SPK is not a naked token in the lab; it starts from an accepted surplus-energy attestation. |
| Ledger conservation | `model_verified` | PASS | `state/product/currency_system_lab.json` | The lab ledger preserves minted supply across active balances and redemption burn. |
| Invoice settlement contract | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | SPK can now be routed as payment against hashed invoices with replay protection. |
| Redemption receipt contract | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | SPK can be transferred into a registry, burned through redeemForEnergy, and converted into an owed-kWh receipt. |
| Delivery resolution and dispute state | `implemented` | PASS | `contracts/SolarPunkCurrencySystem.sol` | The framework can track pending, fulfilled, shortfall, and disputed redemption states. |
| Contract regression tests | `tested` | PASS | `test/SolarPunkCurrencySystem.test.js` | The new currency mechanics are covered by settlement, burn/redemption, replay, slippage, fulfillment, shortfall, dispute, and re-resolution accounting tests. |
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
| daily_keeper_runs | `19` |

## Next Internal Build Targets

- `Field receipt loop` (next_internal_target): Feed a real meter/inverter CSV into the attestation path, mint SPK, settle one invoice through SolarPunkCurrencySystem, and open one redemption receipt.
- `Currency stress harness` (next_internal_target): Simulate multi-actor payment velocity, redemption load, reserve ratio, and delivery shortfalls under daily energy-price scenarios.
- `Deployable currency stack` (next_internal_target): Add a deployment script and public readback for SolarPunkCurrencySystem beside the attestation-enabled SPK proof stack.

## Boundary

This is an internal engineering-readiness artifact. It measures whether the currency mechanism is coherent, testable, and empirically instrumented; it does not assert legal, audit, market, or mainnet readiness.

## Research Anchors

- [BIS unified ledger/tokenisation framing](https://www.bis.org/publ/arpdf/ar2023e3.htm) — Separates asset records, settlement assets, and programmable rules.
- [NIST Smart Grid program](https://www.nist.gov/engineering-laboratory/smart-grid) — Anchors the need for interoperable, measurement-based energy data.
- [Chainlink Proof of Reserve](https://chain.link/proof-of-reserve) — Design pattern for reserve-backed mint controls and transparent backing feeds.
- [OpenZeppelin ERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20) — Base token standard and burnable token extension used by SPK.

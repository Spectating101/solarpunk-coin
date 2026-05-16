# SolarPunk Currency System Lab

- generated_at: `2026-05-16T06:13:00.073Z`
- thesis: Compress the currency-system path into one reproducible public-lab artifact without claiming mainnet adoption.

## Source Evidence

| Item | Value |
|---|---:|
| SPK contract | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Currency framework contract | `contracts/SolarPunkCurrencySystem.sol` |
| Mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |
| Accepted surplus | `2606.7` kWh |
| Minted SPK | `130.1697` |
| Energy price | `$0.05/kWh` |
| Daily keeper runs | `20` |
| Latest keeper run | `2026-05-16` |

## Four-Layer Thunder Path

| Layer | Name | Status | Claim | Upgrade blocker |
|---:|---|---|---|---|
| 1 | Public lab primitive | `real_public_testnet` | Signed meter fixture data has produced a replay-protected SPK mint on Sepolia with public readback. | none |
| 2 | Closed pilot surrogate | `simulated_from_public_fixture` | The same accepted bundle is treated as a named pilot stand-in to exercise the operating loop. | Governed attested-SPK redeploy plus one real meter or inverter export. |
| 3 | Redeemable energy receipt framework | `local_contract_tested` | SPK can be transferred into SolarPunkCurrencySystem, burned through redeemForEnergy, and recorded as an owed-kWh receipt with fulfillment/shortfall/dispute states. | Deploy beside the attested SPK proof stack and bind to one real redemption operator. |
| 4 | Networked settlement framework | `local_contract_tested` | SPK invoice settlement is implemented as a replay-protected payment router while the lab ledger models multi-party circulation and conservation. | Deploy and run one real invoice/counterparty settlement. |

## Settlement Ledger

| Step | Type | From | To | SPK | Note |
|---:|---|---|---|---:|---|
| 1 | mint | protocol | taoyuan_rooftop_producer | 130.1697 | SPK minted from accepted surplus-energy attestation. |
| 2 | transfer | taoyuan_rooftop_producer | meter_gateway_operator | 3 | Producer pays the meter gateway for data service. |
| 3 | transfer | taoyuan_rooftop_producer | maintenance_provider | 10 | Producer pays maintenance provider in SPK. |
| 4 | transfer | taoyuan_rooftop_producer | community_energy_buyer | 50 | Producer distributes SPK to a local buyer as an energy-credit settlement unit. |
| 5 | transfer | community_energy_buyer | local_service_merchant | 15 | Buyer spends SPK with a local merchant. |
| 6 | transfer | local_service_merchant | taoyuan_rooftop_producer | 5 | Merchant settles an energy-credit invoice back to producer. |
| 7 | redeem | community_energy_buyer | redeemed_energy_credit | 20 | Buyer burns SPK against a lab-model energy-credit redemption. |

## Accounting

| Metric | Value |
|---|---:|
| Minted SPK | `130.1697` |
| Active supply after redemption | `110.1697` |
| Redeemed SPK | `20` |
| Settlement volume | `83` |
| Velocity ratio | `0.6376` |
| Redeemed energy equivalent | `400` kWh |
| Remaining energy equivalent | `2203.394` kWh |
| Conservation check | `true` |

## Claim Boundaries

- Layer 1 is public Sepolia evidence.
- Layer 2 is still a compressed pilot surrogate.
- Layers 3-4 now have local contract/test coverage, but no public deployment or real commercial adoption.
- No token sale, mainnet readiness, yield, audit completion, or legal redemption claim is made.
- The purpose is to test whether the currency-system logic is coherent enough to start a field receipt loop.

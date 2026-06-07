# SolarPunk Currency System Lab

- generated_at: `2026-06-07T09:14:30.951Z`
- thesis: SPK is network money issued against verified energy surplus: circulation-first settlement with optional energy exit, not a dollar clone or utility coupon.

## Source Evidence

| Item | Value |
|---|---:|
| SPK contract | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Currency framework contract | `contracts/SolarPunkCurrencySystem.sol` |
| Local SPK loop | `docs/product/FIELD_RECEIPT_LOOP.md` |
| Mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |
| Accepted surplus | `2606.7` kWh |
| Minted SPK (Sepolia dollar-translated proof) | `130.1697` |
| Minted SPK (energy-native model) | `2604.0933` |
| Energy price | `$0.05/kWh` |
| Daily keeper runs | `22` |
| Latest keeper run | `2026-05-18` |

## Four-Layer Thunder Path

| Layer | Name | Status | Claim | Upgrade blocker |
|---:|---|---|---|---|
| 1 | Public lab primitive | `real_public_testnet` | Signed meter fixture data has produced a replay-protected SPK mint on Sepolia with public readback. | none |
| 2 | Local SPK settlement loop | `local_spk_settlement_loop` | The accepted meter bundle now runs through a local end-to-end loop: SPK mint, invoice settlement, redemption burn, owed-kWh claim, and delivery resolution. | Replace fixture meter data with one real meter or inverter export. |
| 3 | Redeemable SPK framework | `local_contract_tested` | SPK can be transferred into SolarPunkCurrencySystem, burned through redeemForEnergy, and recorded as an owed-kWh claim with fulfillment/shortfall/dispute states. | Deploy beside the attested SPK proof stack and bind to one real redemption operator. |
| 4 | Networked settlement framework | `local_contract_tested` | SPK network payments are the primary money path; typed invoice settlement tracks GOODS/SERVICE/LABOR circulation with optional redemption as a secondary sink. | Deploy and run one real invoice/counterparty settlement. |

## Settlement Ledger

| Step | Type | From | To | SPK | Note |
|---:|---|---|---|---:|---|
| 1 | mint | protocol | taoyuan_rooftop_producer | 2604.0933 | SPK minted from verified surplus energy (issuance anchor). |
| 2 | network_payment | taoyuan_rooftop_producer | meter_gateway_operator | 12 | Producer pays gateway for attestation service (SERVICE). |
| 3 | network_payment | taoyuan_rooftop_producer | maintenance_provider | 40 | Producer pays maintenance in SPK (LABOR). |
| 4 | network_payment | taoyuan_rooftop_producer | community_energy_buyer | 180 | Producer seeds local network circulation (NETWORK). |
| 5 | network_payment | community_energy_buyer | local_service_merchant | 55 | Buyer spends SPK on local goods (GOODS). |
| 6 | network_payment | local_service_merchant | taoyuan_rooftop_producer | 20 | Merchant settles supply invoice back to producer (GOODS). |
| 7 | optional_redemption | community_energy_buyer | optional_energy_exit | 15 | Optional energy exit — secondary sink, not the primary money identity. |

## Accounting

| Metric | Value |
|---|---:|
| Minted SPK | `2604.0933` |
| Active supply after redemption | `2589.0933` |
| Redeemed SPK | `15` |
| Settlement volume | `307` |
| Velocity ratio | `0.1179` |
| Circulation share | `0.9534` |
| Redemption share | `0.0466` |
| Redeemed energy equivalent | `15` kWh |
| Remaining energy equivalent | `2589.0933` kWh |
| Conservation check | `true` |

## Claim Boundaries

- Layer 1 is public Sepolia evidence.
- Layer 2 is a deterministic local SPK loop, not a real external pilot.
- Layers 3-4 now have local contract/test coverage, but no public deployment or real commercial adoption.
- No token sale, mainnet readiness, yield, audit completion, or legal redemption claim is made.
- The purpose is to move from local SPK coherence to a real meter export loop.

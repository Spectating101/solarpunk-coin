# SolarPunk Field Receipt Loop

This is the first internal end-to-end currency receipt loop. It intentionally uses only local repo assets and a local Hardhat chain: no external API, no public network, no grant approval, and no real counterparty dependency.

## Run

- generated_at: `2026-05-16T06:58:39.985Z`
- execution_scope: `local_deterministic_no_external_dependencies`
- network: `hardhat`
- chain_id: `1337`
- external_network_required: `false`
- external_api_required: `false`

## Contract Stack

| Contract | Address |
|---|---|
| MockUSDC | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| ProtocolTreasury | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| SolarPunkCoin | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| SolarPunkCurrencySystem | `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318` |

## Source Meter Evidence

| Item | Value |
|---|---:|
| Bundle | `state/attestations/latest_attestation_bundle.json` |
| Accepted records | `2` |
| Rejected records | `2` |
| Verified signatures | `2` |
| Total surplus | `2606.7` kWh |
| On-chain surplus | `2606` kWh |
| Source hash | `0xe3f1d7e10fbe38a0951943415121a25ca8b9e031634422576bb29ef9a576a5c8` |

## Flow

| Step | Result | Tx |
|---|---|---|
| signed_surplus_mint | 130.1697 SPK minted to producer | `0x9adada86223343a74811ee8970e96c8d08429f325e10b70072eb7bf43fd5a2fc` |
| field_service_invoice_settlement | 25 SPK paid to field service provider | `0x7a14b27975ffde956490e8fb4ce28317128b966b25dba3b55558d710afabecf7` |
| energy_credit_settlement | 50 SPK paid to energy buyer as redeemable credit balance | `0x78a656f8f33d93d6e4a4766272e56b5561345e0c016a47e61eef0ae36556a651` |
| redemption_opened | 20 SPK burned into 400 owed kWh receipt | `0x0b0fee74f385be5aca453d8a532ff1a0f050290066633ad64db79df554f1fbf4` |
| delivery_resolved | 400 kWh fulfilled | `0x32587a565c96f19c905eb7fdcb8b83ca207578d585959d5f890c410fb363cec9` |

## Accounting

| Metric | Value |
|---|---:|
| minted_spk | `130.1697` |
| settlement_volume_spk | `75` |
| redeemed_spk | `20` |
| active_circulating_spk | `110.1697` |
| owed_kwh | `400` |
| delivered_kwh | `400` |
| shortfall_kwh | `0` |
| energy_price_usd_per_kwh | `0.05` |
| conservation_pass | `true` |
| delivery_fulfilled | `true` |
| contract_total_supply_after_spk | `110.32` |

## Balances

| Actor | SPK |
|---|---:|
| producer | `55.1697` |
| service_provider | `25` |
| energy_buyer | `30` |

## Boundary

- This is a deterministic local field-receipt experiment, not public network evidence.
- It relies only on repo fixtures, local Hardhat contracts, and local signers.
- It proves the internal clearing loop from signed meter surplus to SPK mint, invoice settlement, redemption burn, owed-kWh receipt, and delivery resolution.
- It does not prove hardware certification, legal redemption enforceability, real customer demand, audit completion, or mainnet readiness.

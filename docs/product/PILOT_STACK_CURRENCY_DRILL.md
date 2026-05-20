# SolarPunk Pilot Stack Currency Drill

This is the aggressive internal bridge from protocol pieces to one SPK cryptocurrency system: deploy the governed-style pilot stack, mint SPK from accepted surplus energy evidence, spend SPK, redeem SPK into an owed-kWh claim, and resolve delivery.

## Run

- generated_at: `2026-05-20T12:28:05.497Z`
- network: `hardhat`
- chain_id: `1337`
- execution_scope: `local_governed_pilot_stack_currency_drill`
- all_checks_passed: `true`

## Stack

| Contract | Address |
|---|---|
| MockUSDC | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| ProtocolTreasury | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| SolarPunkCoin | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| SolarPunkCurrencySystem | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |

## Governance Checks

| Check | Pass |
|---|---:|
| spk_owner_is_governance_admin | `true` |
| spk_default_admin_is_governance_admin | `true` |
| spk_deployer_default_admin_revoked | `true` |
| spk_minter_role_separated | `true` |
| spk_oracle_role_separated | `true` |
| treasury_default_admin_is_governance_admin | `true` |
| treasury_deployer_default_admin_revoked | `true` |
| currency_default_admin_is_governance_admin | `true` |
| currency_operator_is_governance_admin | `true` |

## SPK Cryptocurrency Flow

| Step | Result |
|---|---|
| attested_surplus_mint | 130.1697 SPK minted to producer from 2606 kWh |
| service_invoice_payment | 25 SPK paid to a service provider through SolarPunkCurrencySystem |
| energy_credit_payment | 50 SPK paid to an energy buyer through SolarPunkCurrencySystem |
| redemption_claim | 20 SPK burned into 400 owed kWh |
| delivery_resolution | 400 kWh delivered with 0 kWh shortfall |

## Accounting

| Metric | Value |
|---|---:|
| accepted_surplus_kwh | `2606.7` |
| onchain_surplus_kwh | `2606` |
| minted_to_producer_spk | `130.1697` |
| settlement_volume_spk | `75` |
| redeemed_spk | `20` |
| active_circulating_spk | `110.1697` |
| protocol_fee_inventory_spk | `0.1503` |
| owed_kwh | `400` |
| delivered_kwh | `400` |
| shortfall_kwh | `0` |
| energy_price_usd_per_kwh | `0.05` |
| total_supply_after_spk | `110.32` |
| currency_next_payment_id | `3` |
| currency_next_redemption_id | `2` |
| conservation_pass | `true` |
| delivery_fulfilled | `true` |

## What This Moves Forward

- It proves the latest SPK coin, treasury, and currency-system contracts can run as one stack.
- It proves SPK is not only minted; it can circulate through payment and redemption accounting.
- It gives the next Sepolia deployment a concrete acceptance test: the same drill should pass against the public testnet stack.

## Boundary

- This is a local pilot-stack drill, not a public network deployment.
- It proves the latest contracts work together as a cryptocurrency system: mint, payment, redemption, and delivery accounting.
- It does not prove real hardware provenance, legal redemption enforceability, customer demand, external audit, or mainnet readiness.
- The next public step is to run this drill against a governed Sepolia stack and then replace fixture meter evidence with a real operator export.

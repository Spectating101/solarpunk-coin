# SPK Public Readback

This proof is a read-only Sepolia verification of the attested SPK mint path.

## Target

- generated_at: `2026-05-14T13:02:31.059Z`
- network: `sepolia`
- chain_id: `11155111`
- SolarPunkCoin: `0x8ceDa149EDE44078bf151b3334513916a84df820`
- proof_path: `state/proofs/sepolia_spk_attested_mint_proof.json`

## Transaction

- tx_hash: `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d`
- status: `1`
- block_number: `10850713`
- block_timestamp: `1778755728`
- gas_used: `239354`

## On-chain State

- attestation_hash: `0xd3c77958aa6f53cd1a5a8ed52c8898cf1376b8a5751e1598add5ab0c5cea558d`
- attestation_hash_consumed: `true`
- source_hash: `0xe3f1d7e10fbe38a0951943415121a25ca8b9e031634422576bb29ef9a576a5c8`
- source_hash_consumed: `true`
- recipient: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
- recipient_balance_spk: `130.1697`
- total_supply_spk: `130.3`
- cumulative_surplus_kwh: `2606`
- energy_price_usd_per_kwh: `0.05`
- reserve_ratio_percent: `76745%`
- peg_stable: `true`
- grid_stressed: `false`

## Checks

| Check | Pass | Detail |
|---|---:|---|
| contract code present | `true` | 0x8ceDa149EDE44078bf151b3334513916a84df820 has 19377 bytes of bytecode |
| transaction succeeded | `true` | receipt.status=1 |
| transaction called SPK contract | `true` | receipt.to=0x8ceDa149EDE44078bf151b3334513916a84df820 |
| attestation hash consumed | `true` | true |
| source hash consumed | `true` | true |
| recipient balance covers minted amount | `true` | 130169700000000000000 >= 130169700000000000000 |
| cumulative surplus covers proof kWh | `true` | 2606 >= 2606 |

## Interpretation

All readback checks passed. The public Sepolia contract state matches the committed attested-mint proof.

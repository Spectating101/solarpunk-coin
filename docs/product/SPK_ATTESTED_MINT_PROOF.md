# SPK Attested Mint Proof

This receipt proves the product-critical path: signed raw meter readings -> verified surplus bundle -> deterministic source hash -> oracle signature -> replay-protected SPK mint.

## Run

- generated_at: `2026-05-14T10:48:52.962Z`
- network: `sepolia`
- chain_id: `11155111`
- execution_scope: `attached-network`
- tx_hash: `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d`
- gas_used: `239354`

## Meter Bundle

- bundle: `state/attestations/latest_attestation_bundle.json`
- source_schema: `SPK_RAW_METER_READINGS_V1`
- batch_id: `batch_2026_02_12_a`
- input_records: `4`
- accepted_records: `2`
- rejected_records: `2`
- verified_signatures: `2`
- total_surplus_kwh: `2606.7`
- onchain_surplus_kwh: `2606`
- unminted_fractional_kwh: `0.7`
- source_hash: `0xe3f1d7e10fbe38a0951943415121a25ca8b9e031634422576bb29ef9a576a5c8`

## Attestation

- attestor: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
- minter: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
- recipient: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
- window_start: `1770768000`
- window_end: `1770854399`
- valid_after: `1778755644`
- valid_before: `1778842104`
- attestation_hash: `0xd3c77958aa6f53cd1a5a8ed52c8898cf1376b8a5751e1598add5ab0c5cea558d`
- attestation_hash_consumed: `true`
- source_hash_consumed: `true`

## Mint Result

- energy_price_usd_per_kwh: `0.05`
- minting_fee_bps: `10`
- minted_spk: `130.1697`
- recipient_balance_after_spk: `130.1697`
- cumulative_surplus_kwh_after: `2606`

## Scope Note

- This is a public Sepolia proof artifact against the attached SolarPunkCoin deployment.
- This proof deployment is not the production/governance deployment and does not replace the older Safe-admin testnet stack.
- The current proof does not certify physical hardware finality; it proves the protocol path once a meter bundle is accepted.

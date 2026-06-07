# SPK Attested Mint Proof

This proof shows the product-critical path: signed raw meter readings -> verified surplus bundle -> deterministic source hash -> oracle signature -> replay-protected SPK mint.

## Run

- generated_at: `2026-06-06T18:17:30.330Z`
- network: `hardhat`
- chain_id: `1337`
- execution_scope: `local-reproducible`
- tx_hash: `0xf8b7481908da07318bf9dae4b86bd87b7366261cf99841818c393ac727a7f07f`
- gas_used: `239462`

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

- attestor: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- minter: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- recipient: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- window_start: `1770768000`
- window_end: `1770854399`
- valid_after: `1780769800`
- valid_before: `1780856260`
- attestation_hash: `0x9591b32b3e7fd166adf133923f0b2151128eabf57d2f040eb98d9f4295288940`
- attestation_hash_consumed: `true`
- source_hash_consumed: `true`

## Mint Result

- energy_price_usd_per_kwh: `0.05`
- minting_fee_bps: `10`
- minted_spk: `130.1697`
- recipient_balance_after_spk: `130.1697`
- cumulative_surplus_kwh_after: `2606`

## Scope Note

- This is a reproducible local proof artifact. Hardhat transaction hashes are local-only.
- A public proof requires attaching this script to an attestation-enabled SolarPunkCoin on a public testnet.
- The current proof does not certify physical hardware finality; it proves the protocol path once a meter bundle is accepted.

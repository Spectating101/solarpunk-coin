# Sepolia Attested SPK Preflight

- generated_at: `2026-05-14T10:45:03.256Z`
- status: `ready`
- rpc_url_configured: `true`
- private_key_configured: `true`
- etherscan_key_configured: `true`
- spk_address_configured: `false`

## Checks

- PASS `rpc_url`: SEPOLIA_RPC configured.
- PASS `private_key`: PRIVATE_KEY is configured and syntactically valid.
- PASS `etherscan_key`: Etherscan API key configured for verification.
- PASS `attestation_enabled_artifact`: Latest SolarPunkCoin artifact includes attested mint ABI.
- PASS `meter_bundle`: Bundle ready: 2 accepted records, 2 verified signatures, 2606.7 kWh surplus.
- PASS `network`: RPC chain_id=11155111.
- PASS `attached_spk_address`: No SPK_ADDRESS configured; preflight assumes a fresh deploy path.
- PASS `deployer_balance`: Signer 0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54 balance is 0.102558249420027167 Sepolia ETH; recommended minimum is 0.02.

## Next Commands

- `npm run attestations:fixture`
- `npm run attestations:build`
- `npm run compile`
- `npm run deploy:attested-spk:preflight`
- `SPK_ADDRESS=<new_attestation_enabled_spk> npm run proof:spk-attested-mint -- --network sepolia`
- `npm run product:empirics`

## Notes

- This script never prints the private key.
- It does not deploy contracts or send transactions.
- Public proof requires a funded Sepolia signer, latest bytecode deployment, role setup, source verification, and then `proof:spk-attested-mint` against the deployed SPK address.

# Public Proof Status

- generated_at: 2026-04-20
- network: sepolia
- public_proof_complete: true

## Deployment proof

- full_deploy_receipt_exists: true (state/deployments/sepolia_full_deploy.json)
- contracts_source_verified: true (all three — Etherscan Sepolia)

## Interaction proof

- interaction_proof_exists: true (state/proofs/sepolia_interaction_proof.json)
- interaction_tx_count: 7

## Transaction summary

| Step | TX hash |
|---|---|
| Mint 500k MockUSDC | 0x4325f8cd6f542c17ec96238c062ceeedf9b343fc7088d18edabd86fd5d2657f2 |
| Deposit 100k USDC reserve | 0xd37a51a937ae32a699d77017bda6dd33a7ef1b78c50d75beb230595a3fde15a7 |
| Oracle price update $1.00 | 0xf8b92efacc6da46df8fea94978f090516c665ee94419daa19200415ea86f8f4b |
| Mint SPK from 10,000 kWh | 0xb272ce02dad6911c8498006b9a198b32220cb35aa7bfb4df0df0d57a4368db33 |
| Redeem 100 SPK for energy | 0xfb2811c9ad175987234f9ae177c5babd8a639ca6a04598bf7ce011510b4dc861 |
| Open long call option | 0x26390f644af9ab5c6686a56761953fe044f57961897c7879fa400574671785f8 |
| Mark position to $1.05 (+5%) | 0x17b3524c2d14c23df77c19dd6de91c84a3d901cdd0672d33efc2940d94cff961 |

## Interpretation

External proof milestone complete. Contracts are deployed, source-verified, and exercised
on a public testnet with verifiable transaction hashes. Any reviewer can independently
confirm these transactions on https://sepolia.etherscan.io.

# TESTNET DEPLOYMENT

## Status: Complete (2026-04-20)

Full stack deployed to **Ethereum Sepolia** and source-verified on Etherscan.

## Deployed contracts

| Contract | Address | Verified |
|---|---|---|
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` | — |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [✓ Etherscan](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [✓ Etherscan](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [✓ Etherscan](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
Receipt: `state/deployments/sepolia_full_deploy.json`

## Interaction proof

7 transactions confirmed on Sepolia demonstrating the full protocol flow:

| Step | TX |
|---|---|
| Mint 500k MockUSDC | [`0x4325f8cd...`](https://sepolia.etherscan.io/tx/0x4325f8cd6f542c17ec96238c062ceeedf9b343fc7088d18edabd86fd5d2657f2) |
| Deposit 100k USDC reserve | [`0xd37a51a9...`](https://sepolia.etherscan.io/tx/0xd37a51a937ae32a699d77017bda6dd33a7ef1b78c50d75beb230595a3fde15a7) |
| Oracle price update $1.00 | [`0xf8b92efa...`](https://sepolia.etherscan.io/tx/0xf8b92efacc6da46df8fea94978f090516c665ee94419daa19200415ea86f8f4b) |
| Mint SPK from 10,000 kWh | [`0xb272ce02...`](https://sepolia.etherscan.io/tx/0xb272ce02dad6911c8498006b9a198b32220cb35aa7bfb4df0df0d57a4368db33) |
| Redeem 100 SPK for energy | [`0xfb2811c9...`](https://sepolia.etherscan.io/tx/0xfb2811c9ad175987234f9ae177c5babd8a639ca6a04598bf7ce011510b4dc861) |
| Open long call option | [`0x26390f64...`](https://sepolia.etherscan.io/tx/0x26390f644af9ab5c6686a56761953fe044f57961897c7879fa400574671785f8) |
| Mark position to $1.05 (+5%) | [`0x17b3524c...`](https://sepolia.etherscan.io/tx/0x17b3524c2d14c23df77c19dd6de91c84a3d901cdd0672d33efc2940d94cff961) |

Full proof artifact: `state/proofs/sepolia_interaction_proof.json`

## To redeploy

See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for full instructions.

```bash
npx hardhat run scripts/deploy_testnet_full.js --network sepolia
npx hardhat run scripts/run_interaction_proof.js --network sepolia
```

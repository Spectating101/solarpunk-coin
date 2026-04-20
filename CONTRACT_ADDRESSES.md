# CONTRACT ADDRESSES

## Public testnet addresses

Status: **Live on Sepolia (Ethereum testnet)**

Deployed: 2026-04-20
Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
Network: Ethereum Sepolia (chain 11155111)

| Contract | Address | Explorer |
|---|---|---|
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` | [Etherscan](https://sepolia.etherscan.io/address/0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2) |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Etherscan](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c) |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Etherscan](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Etherscan](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104) |

## Deployment receipt

Full receipt: `state/deployments/sepolia_full_deploy.json`

Key settings at deploy:
- Trading fee: 50 bps
- Governance delay: 0 (upgradeable without timelock — testnet only)
- Bond requirements: 0 (testnet only)
- Budget vaults: all point to ProtocolTreasury (testnet default)

## Notes

- MockUSDC is a test token with no real value — used as collateral stand-in for testnet
- Source code verification on Etherscan pending (run `npx hardhat verify --network sepolia`)
- Mainnet deployment gated on: security audit + pilot counterparty confirmation

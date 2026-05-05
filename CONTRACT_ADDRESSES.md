# CONTRACT ADDRESSES

## Public testnet addresses

Status: **Live on Sepolia (Ethereum testnet)**

Initial deployment: 2026-04-20  
M3 security setup: 2026-04-20  
Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`  
Network: Ethereum Sepolia (chain 11155111)

## Core protocol (verified)

| Contract | Address | Etherscan |
|---|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` | [Verified ✓](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` | [Verified ✓](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` | [Verified ✓](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

## Infrastructure (verified)

| Contract | Address | Etherscan |
|---|---|---|
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` | [Verified ✓](https://sepolia.etherscan.io/address/0xb9c2Ac8166edFc899b591bc51746d75bFCEca086#code) |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` | [Verified ✓](https://sepolia.etherscan.io/address/0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9#code) |
| Safe multisig (1/1) | `0xB95586775C73feB0154828c77832E106425C818A` | [Etherscan](https://sepolia.etherscan.io/address/0xB95586775C73feB0154828c77832E106425C818A) · [Safe app](https://app.safe.global/sep:0xB95586775C73feB0154828c77832E106425C818A) |

## Test collateral

| Contract | Address |
|---|---|
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` |

## Current parameter state (post M3 setup)

| Parameter | Value |
|---|---|
| Admin authority | **Safe multisig** `0xB95586775C73feB0154828c77832E106425C818A` controls the 3 core contracts; `StabilityPool` admin remains deployer EOA |
| Governance delay | 86400s (24h) on all 3 core contracts |
| Min minter bond | 100 USDC |
| Min oracle bond | 100 USDC (SolarPunkCoin + SolarPunkOption) |
| Min liquidator bond | 100 USDC |
| Deployer keeper bond | 100 USDC deposited |
| Stability pool | External StabilityPool contract |
| StabilityPool disburser | SolarPunkCoin has `DISBURSER_ROLE`; deployer EOA does not |
| Oracle adapter | ChainlinkOracleAdapter holds ORACLE_ROLE on both contracts |
| Energy price (adapter) | $0.05/kWh (manual — no Chainlink energy feed on Sepolia) |

## Deployment receipts

- `state/deployments/sepolia_full_deploy.json` — initial deployment
- `state/deployments/sepolia_m3_setup.json` — M3 security setup (governance delay, bonds, adapters)

## Notes

- MockUSDC is a test token with no real value
- Chainlink adapter runs in manual energy price mode — no live energy price feed exists on Sepolia; will connect to a real feed for mainnet
- Mainnet deployment gated on: security audit + multisig admin transfer + pilot counterparty

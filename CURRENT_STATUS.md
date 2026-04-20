# CURRENT STATUS

This file is the canonical stage snapshot for external reviewers.

## Status table

| Area | Current status |
|---|---|
| Stage | Serious prototype — publicly deployed, security controls live |
| Smart contracts | 77/77 tests passing |
| Source verification | **All 5 contracts verified on Etherscan** |
| Governance delay | **86400s (24h) on all 3 core contracts** |
| Bond requirements | **100 USDC for all operator roles** |
| Oracle architecture | **ChainlinkOracleAdapter deployed and integrated** |
| Stability pool | **Dedicated StabilityPool contract (not address(this))** |
| Treasury loop | Implemented (mint/redeem fees, trading fees, liquidation penalties, bond slashing) |
| On-chain interaction proof | 7 confirmed Sepolia transactions |
| Frontend | Live — reads Sepolia contract state every 30s |
| Python SDK | chain_client.py reads all live protocol state |
| Local demo | Available (`npm run demo:treasury`) |
| Security audit | Not started — M3 next gate |
| Multisig admin | Not yet — single EOA; M3 next gate |
| Pilot counterparties | Not yet secured |
| Mainnet readiness | NO_GO until audit + multisig |

## Deployed contracts (Sepolia, all verified)

| Contract | Address |
|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |

See [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) for full parameter state and explorer links.

## Honest status line

Prototype complete with proper security architecture live on Sepolia. Governance timelock active. Oracle and minter roles are bond-gated. Remaining gates before mainnet are audit and multisig.

## Open trust gaps

| Gap | Status |
|---|---|
| Single EOA admin | Open — transfer to Safe multisig via `handoffAdmin()` |
| No formal audit | Open — M3 scope, Code4rena identified |
| Chainlink energy feed | Partial — adapter deployed, running manual price; real feed pending |
| No dispute window for settlement index | Open — multi-oracle aggregation is M4 scope |

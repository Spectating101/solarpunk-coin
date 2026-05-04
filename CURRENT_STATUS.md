# CURRENT STATUS

**Last updated:** 2026-05-04
This file is the canonical stage snapshot for external reviewers.

## Status table

| Area | Current status |
|---|---|
| Stage | Live testnet pilot — security controls active, daily oracle running |
| Smart contracts | **79/79 tests passing** (50 SPK + 21 Option + 8 Treasury) |
| Independent code review | **Codex review (April 2026) — 5 findings identified and fixed; regression tests added** |
| Source verification | **All 5 contracts verified on Etherscan** |
| Governance delay | **86,400s (24h) on all 3 core contracts** |
| Bond requirements | **100 USDC for all operator roles** |
| Oracle architecture | **ChainlinkOracleAdapter deployed; daily NASA keeper live since 2026-04-20** |
| Stability pool | **Dedicated StabilityPool contract (not address(this))** |
| Treasury loop | Implemented (mint/redeem fees, trading fees, liquidation penalties, bond slashing) |
| On-chain interaction proof | 7 confirmed Sepolia transactions + daily keeper TXs since April 20 |
| Frontend | Live — reads Sepolia contract state every 30s |
| Python SDK | spk-derivatives v0.5.0 (PyPI) — chain_client reads all live protocol state |
| Local demo | Available (`npm run demo:treasury`) |
| Security audit | Not started — requires funding (~$25k); primary grant deliverable |
| Multisig admin | **Safe `0xB95586775C73feB0154828c77832E106425C818A` is admin; deployer EOA has zero admin authority** |
| Pilot counterparties | Not yet secured (highest-leverage gap) |
| Mainnet readiness | NO_GO until formal audit |

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

Live testnet pilot with full security architecture on Sepolia. Governance timelock active. Oracle and minter roles are bond-gated. An independent code review (Codex, April 2026) caught and fixed 5 security findings. A daily NASA POWER → Sepolia oracle keeper has been running since April 20 — the repo accumulates real on-chain proof every day. Remaining gate before mainnet is a formal security audit.

See [`EVIDENCE.md`](./EVIDENCE.md) for clickable receipts of every claim. See [`MASTER_HANDOFF.md`](./MASTER_HANDOFF.md) for full context.

## Open trust gaps

| Gap | Status |
|---|---|
| Single EOA admin | **CLOSED — Safe `0xB95586775C73feB0154828c77832E106425C818A` is admin; deployer EOA revoked** |
| No formal audit | Open — Code4rena identified, pending funding |
| Chainlink energy feed | Partial — adapter live, running manual price; real feed pending mainnet |
| No dispute window for settlement index | Open — multi-oracle aggregation is M4 scope |

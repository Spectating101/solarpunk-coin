# CURRENT STATUS

**Last updated:** 2026-05-14
This file is the canonical stage snapshot for external reviewers.

## Status table

| Area | Current status |
|---|---|
| Stage | Public lab phase — public Sepolia attested mint proof live; production-governed redeploy pending |
| Smart contracts | **96/96 tests passing** |
| Primary product | SPK attested surplus minting: meter bundle -> source hash -> oracle signature -> SPK mint |
| Pilot meter adapter | CSV meter/inverter import + meter onboarding scripts now feed the signed-reading verifier |
| Independent code review | **Codex review (April 2026) — 5 findings identified and fixed; regression tests added** |
| Source verification | **All 5 legacy Sepolia contracts verified on Etherscan**; all 3 fresh attested SPK proof contracts also verified |
| Governance delay | **86,400s (24h) on all 3 core contracts** |
| Bond requirements | **100 USDC for all operator roles** |
| Option margin | **Live Sepolia config: 150% initial / 75% maintenance; stress-tested next pilot target: 250% / 125% before larger exposure** |
| Oracle architecture | **ChainlinkOracleAdapter deployed; daily NASA keeper live since 2026-04-20** |
| Stability pool | **Dedicated StabilityPool contract (not address(this))** |
| Treasury loop | Implemented (mint/redeem fees, trading fees, liquidation penalties, bond slashing) |
| On-chain interaction proof | 7 confirmed Sepolia transactions + daily keeper TXs since April 20 |
| Frontend | Live — reads Sepolia contract state every 30s and now foregrounds the `SPK Mint` and public lab launch path |
| Python SDK | spk-derivatives v0.5.0 (PyPI) — chain_client reads all live protocol state |
| Local demo | Available (`npm run demo:treasury`) |
| Security audit | Not started — requires funding (~$25k); primary grant deliverable |
| Multisig admin | **Safe `0xB95586775C73feB0154828c77832E106425C818A` is admin on the 3 core contracts; StabilityPool admin remains deployer EOA** |
| Pilot counterparties | Not yet secured (highest-leverage gap) |
| Revenue floor module | Secondary module; useful for pilots, no longer the primary product claim |
| Mainnet readiness | NO_GO until formal audit |

## Deployed contracts (Sepolia, all verified)

| Contract | Address |
|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| EnergyRevenueFloor | `0x0000000000000000000000000000000000000000` (not deployed) |

## Attested SPK public proof stack (Sepolia)

| Contract / proof | Address / tx |
|---|---|
| Attestation-enabled SolarPunkCoin | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Proof MockUSDC | `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268` |
| Proof ProtocolTreasury | `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F` |
| Signed-meter SPK mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |

See [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) for full parameter state and explorer links.

## Honest status line

The repo now has a coherent SPK product path: signed raw meter readings, deterministic accepted bundle, oracle-signed surplus attestation, replay-protected minting, public Sepolia mint proof, and empirical dossier. The launchable surface is the SolarPunk Public Lab: public demo, reproducible proof, Sepolia readback, daily keeper evidence, and meter CSV onboarding. The older Safe-admin Sepolia deployment still proves the earlier core system and daily NASA keeper; the fresh proof stack proves the attested SPK mint path but is not production-governed. Remaining gates before real launch are real meter provenance, audited production governance, governed source verification, and legal/commercial scope.

See [`docs/product/PUBLIC_LAB.md`](./docs/product/PUBLIC_LAB.md) for the current public lab model, [`EVIDENCE.md`](./EVIDENCE.md) for clickable receipts of every claim, and [`MASTER_HANDOFF.md`](./MASTER_HANDOFF.md) for full context.

## Open trust gaps

| Gap | Status |
|---|---|
| Production-governed attestation-enabled SPK redeploy | Open — public proof stack exists, but not Safe-admin/production-governed |
| Real signed meter adapter | Partial — CSV/onboarding bridge exists; hardware-backed meter custody and live API adapter still open |
| Single EOA admin | **Closed for core contracts — Safe is admin; StabilityPool auxiliary admin remains deployer EOA** |
| No formal audit | Open — Code4rena identified, pending funding |
| Chainlink energy feed | Partial — adapter live, running manual price; real feed pending mainnet |
| No dispute window for settlement index | Open — multi-oracle aggregation is M4 scope |

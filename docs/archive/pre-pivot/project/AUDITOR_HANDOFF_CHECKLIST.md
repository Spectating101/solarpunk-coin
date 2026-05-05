# Auditor Handoff Checklist

> [!WARNING]
> **Historical scope-freeze checklist snapshot.** Some configuration rows reflect pre-hardening defaults and are retained as audit-history context.
>
> For current deployment posture, use:
> - `CURRENT_STATUS.md`
> - `EVIDENCE.md`
> - `AUDIT_READINESS.md`

## Objective

Provide a complete package an external auditor can start from without ad-hoc discovery.

## Deployment context

- Network: Ethereum Sepolia (chain 11155111)
- Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`
- Deploy date: 2026-04-20
- Receipt: `state/deployments/sepolia_full_deploy.json`

| Contract | Verified address |
|---|---|
| ProtocolTreasury | [`0x138e793f095a33D2790349eC1066FED3A756dd2c`](https://sepolia.etherscan.io/address/0x138e793f095a33D2790349eC1066FED3A756dd2c#code) |
| SolarPunkCoin | [`0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F`](https://sepolia.etherscan.io/address/0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F#code) |
| SolarPunkOption | [`0xe40A88398b5f90D038f7A6F1f122112DCD9e4104`](https://sepolia.etherscan.io/address/0xe40A88398b5f90D038f7A6F1f122112DCD9e4104#code) |

## Required artifacts — status

- [x] Scope contracts finalized (SolarPunkCoin, SolarPunkOption, ProtocolTreasury)
- [x] Network and deployment assumptions documented (DEPLOYMENT_GUIDE.md, TESTNET_DEPLOYMENT.md)
- [x] Role and permission matrix (docs/project/ROLE_PERMISSION_MATRIX.md)
- [x] Invariant checklist (docs/project/INVARIANT_CHECKLIST.md)
- [x] Threat model (THREAT_MODEL.md)
- [x] Trust assumptions (TRUST_ASSUMPTIONS.md)
- [x] Public proof — 7 txs confirmed on Sepolia (state/proofs/sepolia_interaction_proof.json)
- [x] Source code verified on Etherscan (all three contracts)

## Configuration at testnet deploy

| Parameter | Value | Note |
|---|---|---|
| governanceDelay | 0 | No timelock — must be non-zero before audit scope freeze |
| minMinterBond | 0 | No bond requirement — configure before audit |
| minOracleBond (Coin) | 0 | — |
| minOracleBond (Option) | 0 | — |
| minLiquidatorBond | 0 | — |
| stabilityFeeShare | 5000 (50%) | 50% of mint fee to stability pool |
| energyPricePerKwh | 1e18 ($1.00/kWh) | Default — update to real energy price before pilot |
| tradingFeeBps | 50 | 0.5% option trading fee |
| Admin | Single EOA deployer | Must be multisig before mainnet |

## Verification commands

```bash
npx hardhat test --no-compile
npx hardhat run scripts/deploy_testnet_full.js --network sepolia
npx hardhat run scripts/run_interaction_proof.js --network sepolia
```

## Known limitations to disclose to auditor

- [x] Governance delay = 0 at current deploy
- [x] Bond requirements = 0 at current deploy
- [x] Single EOA admin — no multisig
- [x] Stability pool = address(this) — not a dedicated contract
- [x] Oracle inputs are trusted (no on-chain price verification against external feed)
- [x] No dispute mechanism for settlement index
- [x] Audit not yet completed

## Scope freeze checklist (before audit starts)

- [ ] Set governanceDelay >= 86400 on all three contracts
- [ ] Set non-zero bond requirements for minter, oracle, and liquidator
- [ ] Transfer admin to multisig using handoffAdmin() in SolarPunkCoin
- [ ] Point stabilityPool to a dedicated address (not address(this))
- [ ] Configure real budget vault addresses
- [ ] Tag the audit scope commit hash
- [ ] Re-deploy with production configuration and re-verify on Etherscan

## Exit criteria for audit-ready

1. All scope freeze items above ticked
2. No stale claims in any status doc
3. Deploy and interaction proof paths reproducible by auditor independently
4. Auditor has received this document and confirmed scope in writing

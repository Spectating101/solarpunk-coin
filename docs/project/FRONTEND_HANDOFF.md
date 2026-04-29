# Frontend Handoff

Purpose: give a frontend/design agent enough current context to improve the interface without re-opening contract deployment or governance work.

## Current state

- Repo branches are aligned: `master`, `origin/master`, and GitHub default branch `main` point to `b8fe2db`.
- The Sepolia prototype is live and externally inspectable.
- The NASA keeper workflow is active on GitHub Actions and has completed successfully once after branch/secret fixes.
- Latest successful keeper run: `2026-04-29`.
- Local contract tests: `79 passing`.

## Canonical live addresses

| Component | Address |
|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| Safe multisig | `0xB95586775C73feB0154828c77832E106425C818A` |
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` |

## Latest proof artifacts

- Daily experiment status: `docs/project/DAILY_EXPERIMENT_STATUS.md`
- Latest keeper log: `state/keeper_logs/2026-04-29.json`
- Rolling keeper summary: `state/keeper_logs/summary.json`
- Public deployment proof: `docs/project/PUBLIC_PROOF_STATUS.md`
- Interaction proof: `docs/project/INTERACTION_PROOF_REPORT.md`
- Contract addresses: `CONTRACT_ADDRESSES.md`

Latest keeper txs:

| Action | Tx |
|---|---|
| updateIndex | `0x615e06362fbf46d5e02ac5b54277276f565ad13991432cbe6966d199638484ab` |
| updateEnergyPrice | `0x64dbd528e5a59d63e440d7b7b868b7ecf8ef036b93867029942f759d74938da9` |
| updateOraclePriceAndAdjust | `0x4bce17ac407229402943fc6e6a9e70bda12dd0cc2820d0c4a7e20402a8bcb3a2` |

Latest live health after the successful workflow:

- Alert status: `OK`
- SPK oracle stale: `false`
- Option oracle stale: `false`
- Reserve ratio: `1010%`
- Grid stressed: `false`
- Option paused: `false`
- Option index raw: `246729`
- Option index interpreted at `priceDecimals = 6`: `0.246729`

## What broke and what was fixed

GitHub Actions was not running the keeper because GitHub defaulted to `main` while the current project state lived on `master`. After fast-forwarding `main`, the keeper workflow appeared. It then needed two fixes:

- `.github/workflows/nasa_keeper.yml`: use `npm install` instead of `npm ci` because the root `package-lock.json` is intentionally gitignored.
- `scripts/nasa_keeper.js`: wrap the deployer signer in `ethers.NonceManager` to avoid sequential CI transaction nonce races.

GitHub Actions secrets were also configured:

- `KEEPER_PRIVATE_KEY`
- `SEPOLIA_RPC`

Do not print, move, or expose those values in frontend work.

## Frontend scope

The current frontend lives in `frontend/`.

Useful files:

- `frontend/src/App.jsx`
- `frontend/src/components/MarketStats.jsx`
- `frontend/src/components/SystemIntegrity.jsx`
- `frontend/src/components/TradingInterface.jsx`
- `frontend/src/components/PositionsList.jsx`
- `frontend/src/abi/SolarPunkCoin.json`
- `frontend/src/abi/ProtocolTreasury.json`

Frontend improvement should focus on making the live proof understandable:

- show the latest daily experiment run and tx links
- show oracle freshness and stale/healthy state
- show current option index with `priceDecimals = 6`
- show reserve ratio, peg status, grid stress, and supply
- make Sepolia/testnet status explicit
- make the grant/demo proof path easy to scan

Avoid contract changes in this pass.

## Design notes

The current UI has useful components but still contains stale or over-broad wording. Fix these before polishing visuals:

- Replace "settled on Polygon" with the current live truth: `Ethereum Sepolia prototype`.
- Avoid implying production oracle finality.
- Avoid implying the options engine is production-grade clearing infrastructure.
- Use "prototype", "testnet", "daily real-data experiment", and "public transaction trail" accurately.
- Keep grant-facing claims concrete: live addresses, successful keeper run, proof artifacts, and transaction hashes.

Suggested first screen:

- left side: live protocol health and latest NASA keeper run
- right side: trading/prototype interaction controls
- lower section: proof trail with Sepolia tx links and documentation links

## Current known limitations

- `SolarPunkOption` remains prototype-grade for economic clearing.
- Current deployed contracts are not upgradeable; some source-level fixes are for future deployments only.
- `StabilityPool` admin remains the deployer EOA, while the three core contracts are Safe-administered.
- The daily experiment had a gap from `2026-04-21` to `2026-04-29`; the status page records this as `max_missing_gap_days = 7`.

These limitations are acceptable for the current grant/demo phase, but frontend copy should not hide them if presenting a technical status view.

## How to verify after UI changes

From repo root:

```bash
npm test
```

From frontend:

```bash
cd frontend
npm install
npm run build
```

Optional live health check:

```bash
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com \
SPK_ADDRESS=0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F \
OPTION_ADDRESS=0xe40A88398b5f90D038f7A6F1f122112DCD9e4104 \
node scripts/health_check.js
```


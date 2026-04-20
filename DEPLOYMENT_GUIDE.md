# DEPLOYMENT GUIDE

## Current deployment

Full stack is live on **Ethereum Sepolia testnet** (deployed 2026-04-20).

| Contract | Address |
|---|---|
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |

Receipt: `state/deployments/sepolia_full_deploy.json`

---

## Deploy a fresh stack

### Prerequisites

1. Node.js + npm installed
2. `.env` file with:
```
PRIVATE_KEY=0xYourPrivateKey
SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
etherscan=YourEtherscanAPIKey
```

3. Testnet ETH on Sepolia — get free ETH from:
   - `https://cloud.google.com/application/web3/faucet/ethereum/sepolia` (Google login, 0.05 ETH)
   - `https://sepolia-faucet.pk910.de/` (PoW mining, no login, no rate limit)

### Deploy

```bash
npm install
npx hardhat compile
npx hardhat run scripts/deploy_testnet_full.js --network sepolia
```

Also supports Amoy and Holesky — replace `sepolia` with the target network name.

### Optional environment variables

```bash
GOVERNANCE_ADMIN=0xYourMultisigAddress   # grants admin to this address post-deploy
STRICT_ADMIN_HANDOFF=true               # deployer renounces roles after grant
TRADING_FEE_BPS=50                      # option trading fee (default 50)
TREASURY_GOVERNANCE_DELAY_SECONDS=86400 # 24h timelock on treasury changes
SPK_GOVERNANCE_DELAY_SECONDS=86400      # 24h timelock on coin changes
OPTION_GOVERNANCE_DELAY_SECONDS=86400   # 24h timelock on option changes
SPK_MINTER_BOND_UNITS=0                 # minimum minter bond in USDC units
SPK_ORACLE_BOND_UNITS=0                 # minimum oracle bond in USDC units
RESERVE_VAULT=0xAddress                 # budget vault address (default: treasury)
INSURANCE_VAULT=0xAddress
OPS_VAULT=0xAddress
AUDIT_VAULT=0xAddress
```

### Verify source on Etherscan

After deploy, run the verify commands printed by the deploy script. Example:

```bash
npx hardhat verify --network sepolia <TREASURY_ADDRESS> <USDC_ADDRESS>
npx hardhat verify --network sepolia <SPK_ADDRESS> <USDC_ADDRESS>
npx hardhat verify --network sepolia <OPTION_ADDRESS> <USDC_ADDRESS> <TREASURY_ADDRESS> 6
```

### Run interaction proof

After deploy, record on-chain interaction proof:

```bash
npx hardhat run scripts/run_interaction_proof.js --network sepolia
```

Output saved to `state/proofs/sepolia_interaction_proof.json`.

---

## Production deploy checklist

Before any mainnet or real-money deployment:

- [ ] External security audit completed with findings resolved
- [ ] `governanceDelay` set to ≥ 24h on all three contracts
- [ ] Non-zero bond requirements configured for minter, oracle, and liquidator
- [ ] Admin transferred to multisig via `handoffAdmin()` (SolarPunkCoin) and `grantRole/renounceRole` (others)
- [ ] `stabilityPool` pointing to a dedicated address (not `address(this)`)
- [ ] Budget vaults pointing to real operational addresses (not treasury itself)
- [ ] Supply cap reviewed and set to appropriate level
- [ ] Private key for deploy wallet rotated and secured after deployment

---

## Local development

```bash
# Run all tests
npx hardhat test --no-compile

# Start local node
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy_testnet_full.js --network localhost

# Run demo
npm run demo:treasury
npm run model:treasury
```

# DEPLOY TESTNET - 10 MINUTES TOTAL

**Stop overthinking. Here's the minimal path.**

> Canonical deployment guide. Older testnet/oracle deployment writeups were consolidated here and removed.

**Network:** Polygon Amoy (current testnet, Mumbai was deprecated April 2024)

---

## Step 1: Get Testnet POL (5 mins)

**Go here:** https://faucet.polygon.technology/

1. Select "Polygon Amoy"
2. Enter your wallet address
3. Click "Submit"
4. Wait 30 seconds
5. You'll get testnet POL (enough for deployment)

**Don't have a wallet?** Use MetaMask:
- Install: https://metamask.io
- Create wallet
- Add Polygon Amoy network:
  - Network Name: Polygon Amoy
  - RPC: https://rpc-amoy.polygon.technology/
  - Chain ID: 80002
  - Currency: POL
  - Explorer: https://amoy.polygonscan.com/
- Copy your address

---

## Step 2: Set Up Private Key (2 mins)

```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env
# OR
code .env

# Replace this line:
PRIVATE_KEY=your_wallet_private_key_here

# Keep the remaining example values unchanged.
# Optional:
# TRADING_FEE_BPS=50
# SPK_MINTER_BOND_UNITS=0
# SPK_ORACLE_BOND_UNITS=0
# ORACLE_BOND_UNITS=0
# LIQUIDATOR_BOND_UNITS=0
# GOVERNANCE_ADMIN=0xYourMultisigAddress
# STRICT_ADMIN_HANDOFF=true
# OPS_VAULT=0xOpsTreasury
# AUDIT_VAULT=0xAuditTreasury
# RESERVE_VAULT=0xReserveVault   # default: ProtocolTreasury address
# INSURANCE_VAULT=0xInsuranceVault # default: ProtocolTreasury address
# TREASURY_GOVERNANCE_DELAY_SECONDS=3600
# SPK_GOVERNANCE_DELAY_SECONDS=3600
# OPTION_GOVERNANCE_DELAY_SECONDS=3600
```

The deployment script reads the Amoy RPC and private key from `.env`.
If `GOVERNANCE_ADMIN` is set, deploy scripts grant admin/owner controls to that address.
If `STRICT_ADMIN_HANDOFF=true`, deployer admin roles are renounced after grant.

---

## Step 3: Deploy (3 mins)

```bash
./scripts/deploy_amoy.sh
```

**That's it.** Script will:
- Compile contracts
- Deploy the full Amoy stack: MockUSDC + ProtocolTreasury + SolarPunkCoin + SolarPunkOption
- Set the treasury as the fee sink and insurance fund
- Configure budget vaults (defaults: reserve/insurance in treasury, ops/audit to governance admin or deployer)
- Show you the contract addresses
- Give you the PolygonScan links

If you want the receipt written outside the repo during local validation, set `SPK_DEPLOYMENT_STATE_DIR=/tmp/solarpunk-deploy-state`.

**Output will look like:**
```
✅ ProtocolTreasury deployed to: 0x1234567890abcdef...
✅ SolarPunkCoin deployed to: 0xabcdef1234567890...
✅ SolarPunkOption deployed to: 0xfedcba0987654321...
```

---

## Step 4: Update README (2 mins)

Copy the deployed addresses and paste the public Amoy links into README.md:

```markdown
# Replace this line:
- ✅ **Testnet Deployment**: Polygon Amoy - Full stack deployed via `deploy_amoy.sh`

# With this:
- ✅ **Testnet Deployment**: Polygon Amoy - Treasury: [`0x1234...`](https://amoy.polygonscan.com/address/0x1234...)
```

Commit and push:
```bash
git add README.md
git commit -m "Deploy to Polygon Amoy testnet"
git push origin master
```

---

## DONE. NOW SUBMIT.

**Polygon form:**
- Website: https://github.com/Spectating101/solarpunk-coin
- Testnet: Link to Amoy PolygonScan
- Email: s1133958@mail.yzu.edu.tw
- Telegram/Twitter: **"Available upon request"** (if not required, skip)

**No social media followers needed.**  
**No Twitter threads needed.**  
**No marketing needed.**

Just: Code + Testnet + Submit.

---

## Troubleshooting

**"Script fails at compile"**
```bash
npm install
npx hardhat compile
```

**"Insufficient funds"**
- Go back to faucet, select "Polygon Amoy", get more POL

**"Private key invalid"**
- Make sure it starts with 0x
- Copy the FULL key from MetaMask

**Contract deploys but verification fails**
- That's fine. Verification is optional.
- Just submit with the Amoy PolygonScan link

---

## What This Gets You

**Before testnet:** Looks like vaporware  
**After testnet:** Looks like you ship code  
**Effort:** 10 minutes  

**Just deploy and submit.**

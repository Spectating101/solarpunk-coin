# DEPLOY TESTNET - 10 MINUTES TOTAL

**Stop overthinking. Here's the minimal path.**

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

# Amoy USDC will be auto-deployed.** Don't touch anything else.

---

## Step 3: Deploy (3 mins)

```bash
./scripts/deploy_amoy.sh
```

**That's it.** Script will:
- Compile contracts
- Deploy to Amoy
- Show you the contract address
- Give you the PolygonScan link

**Output will look like:**
```
✅ SolarPunkCoin deployed to: 0x1234567890abcdef...
🔍 PolygonScan: https://amoyk

**Output will look like:**
```
✅ SolarPunkCoin deployed to: 0x1234567890abcdef...
🔍 PolygonScan: https://mumbai.polygonscan.com/address/0x1234...
```

---

## Step 4: Update README (2 mins)

Copy the contract address and paste it into README.md:

```markdown
# Replace this line:
- ✅ **Testnet Deployment**: Polygon Amoy - Contract: `[DEPLOY FIRST]`

# With this:
- ✅ **Testnet Deployment**: Polygon Amoy - Contract: [`0x1234...`](https://amoy.polygonscan.com/address/0x1234...)
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

Just: Code + Testnet + Submit = 65% odds on $50-150K.

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

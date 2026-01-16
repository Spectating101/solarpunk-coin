# Action List - Grant Submission

**Status:** Code ready, deployment + submission pending

---

## 1. GitHub Default Branch (Optional but Recommended - 2 mins)

**Why:** Makes root URL show correct content instead of old Python library

**Steps:**
1. Go to: https://github.com/Spectating101/solarpunk-coin/settings/branches
2. Click "Switch default branch" button
3. Select `master` instead of `main`
4. Confirm

**Result:** `https://github.com/Spectating101/solarpunk-coin` will show smart contracts, not Python library

---

## 2. Testnet Deployment (Required for Strong Application - 15 mins)

### Step 2.1: Get Testnet POL (5 mins)
1. Go to: https://faucet.polygon.technology/
2. Select "Polygon Amoy" from network dropdown
3. Paste your wallet address (from MetaMask)
4. Click "Submit" → wait ~30 seconds for tokens

### Step 2.2: Export Private Key (2 mins)
1. Open MetaMask
2. Click three dots → Account Details
3. Click "Show Private Key"
4. Enter password → Copy the key (starts with `0x...`)

### Step 2.3: Create .env File (1 min)
```bash
cd ~/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin
nano .env
```

Paste this (replace with your actual key):
```
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 2.4: Deploy (5 mins)
```bash
./scripts/deploy_amoy.sh
```

**Copy the output:** Contract address + Amoy PolygonScan link

### Step 2.5: Update README (2 mins)
```bash
nano README.md
```

Find line 48:
```markdown
- ✅ **Testnet Deployment**: Polygon Amoy - Contract: `[DEPLOY FIRST]` → [View on Amoy PolygonScan](https://amoy.polygonscan.com/)
```

Replace with (use YOUR contract address):
```markdown
- ✅ **Testnet Deployment**: Polygon Amoy - Contract: [`0xYOUR_ADDRESS`](https://amoy.polygonscan.com/address/0xYOUR_ADDRESS)
```

Save and commit:
```bash
git add README.md
git commit -m "feat: Add Amoy testnet deployment address"
git push origin master
```

---

## 3. Polygon Grant Submission (Required - 15 mins)

### Find Polygon Grants Portal
Search: "Polygon Community Grants" or check: https://polygon.technology/grants

### Fill Out Form

**Project Name:** SolarPunk Protocol

**GitHub:** `https://github.com/Spectating101/solarpunk-coin/tree/master`

**Testnet Deployment:**  
`https://amoy.polygonscan.com/address/0xYOUR_CONTRACT_ADDRESS`  
(Paste the actual link from deployment)

**Description (Short):**  
Bitcoin derivatives backed by solar energy. Enables small renewable producers to hedge price and volume risk on-chain using NASA satellite data for transparent pricing.

**Description (Long):**  
Reference: `GRANT_SUBMISSIONS/POLYGON/POLYGON_APPLICATION_DRAFT.md` (copy sections as needed)

**Funding Request:** $50,000 - $100,000

**Use of Funds:**
- Smart contract security audit: $15K
- Mainnet deployment + testing: $10K
- Pilot integration (3 solar farms): $15K
- Oracle infrastructure: $8K
- Documentation + developer toolkit: $7K

**Timeline:** 6 months to mainnet + pilot

**Contact Email:** s1133958@mail.yzu.edu.tw

**Social Media (if required):**  
"Available upon request" OR leave blank if optional (marked with *)

**Submit**

---

## 4. Record Submission (For Your Records - 2 mins)

Create file: `POLYGON_SUBMISSION_RECORD.md`

```markdown
# Polygon Grant Submission Record

**Date Submitted:** [Date]
**Contract Address:** 0x...
**Transaction Hash:** 0x...
**GitHub Link Submitted:** https://github.com/Spectating101/solarpunk-coin/tree/master
**Amount Requested:** $50K-$100K

**Form Text Used:**
[Paste exactly what you submitted in description field]

**Status:** Pending review (typically 2-3 weeks response time)
```

---

## Summary Checklist

- [ ] GitHub default branch changed to `master` (optional but cleaner)
- [ ] Testnet POL obtained from faucet
- [ ] `.env` file created with private key
- [ ] `./scripts/deploy_amoy.sh` executed successfully
- [ ] README.md updated with contract address
- [ ] Polygon grant form submitted
- [ ] Submission details recorded

---

## Estimated Total Time

- **Minimum (skip GitHub settings):** 30 minutes
- **Recommended (all steps):** 35 minutes

---

## If Deployment Fails

**"Insufficient funds" error:**
- Go back to faucet, request more POL (can request multiple times)

**"Private key invalid" error:**
- Ensure key starts with `0x`
- Copy full key from MetaMask (64 characters after 0x)

**"Network error" error:**
- Check internet connection
- Try again in 1 minute (RPC rate limiting)

**Contract compiles but doesn't deploy:**
- Check hardhat.config.js has Amoy network (should be there already)
- Run: `npx hardhat clean && npx hardhat compile`
- Try deployment again

---

## After Submission

**Expected timeline:**
- Week 1-2: Polygon team reviews application
- Week 2-3: May request additional info or clarifications
- Week 3-4: Decision (approve/reject/revise)

**If approved:**
- Legal/KYC process begins
- Grant agreement signed
- Funds disbursed (typically milestones-based)

**If rejected:**
- Reapply in next cycle (usually quarterly)
- Try Energy Web Foundation grant instead (materials ready in ENERGY_WEB_INQUIRY_EMAIL.md)

---

**Next step:** Start with #2 (Testnet Deployment) - takes 15 minutes, doubles acceptance odds.

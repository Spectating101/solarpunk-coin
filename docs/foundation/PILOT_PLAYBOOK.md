# Pilot playbook (minimal closed loop)

Goal: **two wallets, one repeated payment story** — not mass adoption.

## Roles

| Role | Who today | Job |
|------|-----------|-----|
| Operator | Deployer wallet | Mint, sync, keep ledger fresh |
| Payer | Your MetaMask (`0xaC39…`) | Hold SPK, send payments |
| Payee | Preset merchant address | Receive SPK on-chain |

## One-session demo script

1. Operator: `npm run foundation:health` — confirm gas  
2. Operator: `RECIPIENT=0xaC39… AMOUNT=50 npm run spk:v1:fund` (if payer low)  
3. Payer: open https://spectating101.github.io/solarpunk-coin/demo/  
4. Payer: Connect Sepolia → Send 5 SPK to Merchant  
5. Operator: `npm run foundation:sync`  
6. Both: confirm payment #N in table  

## What “pilot” means at this stage

- **Yes:** real wallet, real tx, synced public ledger  
- **No:** real business, legal invoice, USD peg  

## Next pilot upgrade (when ready)

1. Replace one Hardhat payee with a **labeled pilot address** you control  
2. Run **one meter-attested mint** (`CYCLE_MINT_MODE=meter`)  
3. **Multisig** admin (`npm run foundation:multisig`) — only when ops are boring  

## Success metric

Payment count grows weekly and **anyone** can verify on Etherscan + `FOUNDATION_STATUS.md` without you explaining.

# DEMO WALKTHROUGH

## Purpose

Show reviewers that the protocol mechanism works end-to-end — both locally and on a public testnet.

## Live testnet proof (Sepolia — 2026-04-20)

7 transactions confirmed on Ethereum Sepolia. Each link is publicly verifiable on Etherscan:

| Step | Transaction |
|---|---|
| Mint 500,000 MockUSDC | [0x4325f8cd...](https://sepolia.etherscan.io/tx/0x4325f8cd6f542c17ec96238c062ceeedf9b343fc7088d18edabd86fd5d2657f2) |
| Deposit 100,000 USDC reserve | [0xd37a51a9...](https://sepolia.etherscan.io/tx/0xd37a51a937ae32a699d77017bda6dd33a7ef1b78c50d75beb230595a3fde15a7) |
| Oracle price update → $1.00/SPK | [0xf8b92efa...](https://sepolia.etherscan.io/tx/0xf8b92efacc6da46df8fea94978f090516c665ee94419daa19200415ea86f8f4b) |
| Mint SPK from 10,000 kWh surplus | [0xb272ce02...](https://sepolia.etherscan.io/tx/0xb272ce02dad6911c8498006b9a198b32220cb35aa7bfb4df0df0d57a4368db33) |
| Redeem 100 SPK for energy | [0xfb2811c9...](https://sepolia.etherscan.io/tx/0xfb2811c9ad175987234f9ae177c5babd8a639ca6a04598bf7ce011510b4dc861) |
| Open 1-contract long call | [0x26390f64...](https://sepolia.etherscan.io/tx/0x26390f644af9ab5c6686a56761953fe044f57961897c7879fa400574671785f8) |
| Mark position to $1.05 (+5%) | [0x17b3524c...](https://sepolia.etherscan.io/tx/0x17b3524c2d14c23df77c19dd6de91c84a3d901cdd0672d33efc2940d94cff961) |

Full proof artifact: `state/proofs/sepolia_interaction_proof.json`

Deployed contracts: see [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md)

## Local quick run

```bash
npx hardhat test                # 102/102 contract tests
npm run product:field-receipt   # local mint -> settlement -> redemption -> delivery receipt
npm run product:resource-benchmark # NASA solar/wind + PV/cost + renewable benchmark matrix
npm run demo:treasury           # protocol flow simulation
npm run model:treasury          # break-even model
```

## What the testnet proof demonstrates

1. **Reserve deposit** — USDC collateral accepted into SolarPunkCoin
2. **Oracle-gated minting** — SPK minted only after oracle confirms price
3. **Surplus-backed issuance** — 10,000 kWh → SPK at $1.00/kWh rate
4. **Energy redemption** — SPK burned, fee routed to treasury
5. **Options clearinghouse** — position opened with margin, marked to index, PnL accrued correctly

## What the local demo proves

`npm run demo:treasury` shows:
1. mint flow and fee capture
2. treasury fee routing to budget buckets (reserve / insurance / ops / audit)
3. option trading fee capture
4. liquidation penalty capture
5. bond deposit + slash flow
6. bond-gated operator controls
7. treasury disbursement to vaults

## Reviewer-facing framing

This is **mechanism proof**, not market-adoption proof.
It demonstrates that the core internal economics and accounting flows are implemented, deployed, and inspectable on a public network.

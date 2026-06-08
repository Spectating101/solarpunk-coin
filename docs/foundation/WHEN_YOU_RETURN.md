# When you return (gas + thesis later)

Product foundation keeps running via autosync. Two items need **you** when ready.

## 1. Sepolia gas (unblocks the economy)

**Wallet:** `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`

```bash
npm run foundation:health   # must show operator_eth ≥ 0.01
npm run foundation:cycle    # mint + pay + sync
```

Until then: sync, demo, and ledger **read** from chain still work; **new** operator payments do not.

## 2. Thesis (paused)

No thesis files are required for foundation ops. When you pick it up:

- Ch 5 can cite `FOUNDATION_STATUS.md` + Etherscan txs
- Do **not** claim peg victory or stablecoin war

## What runs without you

| Item | How |
|------|-----|
| Daily chain → JSON sync | GitHub Action `Foundation autosync` |
| Public demo data | `docs/demo/spk_v1.json` |
| Health snapshot | `state/foundation/health.json` |

## One-liner status

```bash
npm run foundation:health && head -25 docs/foundation/FOUNDATION_STATUS.md
```

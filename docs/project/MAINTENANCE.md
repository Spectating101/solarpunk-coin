# Public Lab maintenance mode

**Mode:** feature-complete / maintained as-needed  
**Canonical product:** SolarPunk Public Lab v1.0  
**Contracts:** frozen on Sepolia unless bytecode intentionally changes  
**Updated:** 2026-07-10

## What this means

Public Lab v1.0 is **shipped**. The default state is **maintenance**, not active product development.

- Silence between quarterly checks is expected and OK.
- Do not treat missing weekly operator cycles as project failure.
- Do not redeploy Sepolia for vibes.
- Do not enable peg, mainnet, or token-sale framing.

## Quarterly checklist (~2–4 hours)

Run when you have a free weekend each quarter (or after a long gap):

```bash
npx hardhat test
# expect: 109 passing

npm run foundation:health
# operator ETH should be > 0.01; sync may be stale — see policy below

# If SEPOLIA_RPC works (Alchemy/Infura in .env):
npm run foundation:sync
npm run spk:v1:evidence:export
npm run foundation:build

# Confirm demo loads
# https://spectating101.github.io/solarpunk-coin/demo/
```

After sync, skim:

- `CURRENT_STATUS.md` metrics vs `state/runtime/spk_v1.json`
- Demo still shows Public Lab non-claims

## Sync staleness policy

In maintenance mode, a sync age of weeks or months is **acceptable** if:

1. Last-good metrics remain published in `spk_v1.json` / evidence pack
2. Docs say “last indexed sync” rather than implying live minute-by-minute state
3. `foundation:health` “stale sync” is treated as a reminder, not an emergency

Refresh when RPC works; do not burn time fighting public RPC 403s.

## Gas / deployer

Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`  
Top up Sepolia ETH only if balance approaches the health minimum (~0.01 ETH).

## What not to do in maintenance mode

| Action | Why not |
|--------|---------|
| `spk:v1:deploy:*` / lean redeploy | Breaks canonical addresses; confuse evidence |
| Peg on | Monetary claim |
| Grant blitz with stale numbers | Credibility risk |
| Large feature work without wake signal | Opportunity cost vs day job |
| Commit secrets / real customer meter PII | Security / privacy |

## Wake criteria

Leave maintenance mode only if **one** of these is true — see [`WAKE_PATH.md`](./WAKE_PATH.md):

1. Real meter/inverter export (L2+ path) arrives
2. Written institutional/advisor cover for a closed pilot
3. Funded audit or grant that requires active ops
4. Maintainer explicitly chooses a time-boxed pilot sprint

## Authorship

- License: [`LICENSE`](../../LICENSE) (MIT)
- Cite: [`CITATION.cff`](../../CITATION.cff)
- Attribution: [`NOTICE`](../../NOTICE)
- Name/marks: [`TRADEMARK.md`](../../TRADEMARK.md)

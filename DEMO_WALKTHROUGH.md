# DEMO WALKTHROUGH

## Purpose

Show reviewers that the protocol mechanism works end-to-end in a reproducible local environment.

## Quick run

```bash
npx hardhat test --no-compile
npm run demo:treasury
npm run model:treasury
```

## What the demo proves

`npm run demo:treasury` shows:

1. mint flow and fee capture
2. treasury fee routing to budget buckets
3. option trading fee capture
4. liquidation penalty capture
5. bond deposit + slash flow
6. bond-gated operator controls in options
7. treasury disbursement to reserve/insurance/ops/audit vaults

## What the model proves

`npm run model:treasury` gives a simple monthly break-even estimate from configurable usage and cost assumptions.

## Reviewer-facing framing

This is **mechanism proof**, not market-adoption proof.  
It demonstrates that the core internal economics and accounting flows are implemented and inspectable.

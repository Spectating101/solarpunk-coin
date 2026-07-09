# Wake path — leaving maintenance mode

Use this only when an **external** signal appears. Do not self-wake for polish.

## Signals (any one)

1. Usable real meter/inverter export (see [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md))
2. Advisor/institution written lab framing for a closed pilot
3. Grant/audit funding that requires active Sepolia ops
4. Explicit maintainer decision: time-boxed 90-day pilot sprint

## Minimum wake sequence

```bash
# 1. Truth + health
npx hardhat test
npm run foundation:sync
npm run foundation:health

# 2. Ingest operator source (example — adjust paths)
# METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
#   --provider=cumulative-json \
#   --start=data/inverter/operator_start.json \
#   --end=data/inverter/operator_end.json \
#   --meter-id=OPERATOR-METER-001 \
#   --site-id=operator-site-a \
#   --real-operator-source

npm run hardware:validate
# or hardware:validate:operator when real files exist

# 3. Meter mint cycle (Sepolia)
CYCLE_MINT_MODE=meter npm run foundation:cycle:meter

# 4. Evidence
npm run foundation:sync
npm run spk:v1:evidence:export
```

## Deliverable

Write `docs/project/PILOT_REPORT_v1.md` with:

1. Bounded claim
2. Site + hardware tier (L2+ required for closed-pilot language)
3. Pipeline summary
4. Tx hashes / addresses
5. Limits (testnet, peg off, not legal tender)
6. Whether to return to maintenance mode or continue

## Still blocked without extra work

- Paid / mainnet: audit, legal, reserves, L4 hardware
- Governed redeploy: only if roles/Safe required for the pilot terms
- Economics anchor: document support gap; do not invent solvency

## Return to maintenance

After Pilot Report v1 (or failed intake), update `CURRENT_STATUS.md` and resume [`MAINTENANCE.md`](./MAINTENANCE.md) quarterly cadence unless a funded next stage exists.

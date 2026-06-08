# When you return

Foundation runs on autosync + weekly operator CI. You only need to touch it for **pilots**, **governance**, or **thesis** (later).

## Quick status

```bash
npm run foundation:health && head -30 docs/foundation/FOUNDATION_STATUS.md
```

**Last known good (2026-06-08):** health **ok** · ~0.53 Sepolia ETH · **21** payments · peg **off**.

## Optional: run a pilot payment

1. Open https://spectating101.github.io/solarpunk-coin/demo/
2. Connect Sepolia on wallet `0xaC39…` (or fund another: `RECIPIENT=0x… AMOUNT=50 npm run spk:v1:fund`)
3. Send SPK to Merchant
4. `npm run foundation:sync` — or wait for daily autosync

See `PILOT_PLAYBOOK.md`.

## When you need to decide

| Item | Command / doc |
|------|----------------|
| Multisig handoff | `npm run foundation:multisig:dry-run` then `GOVERNANCE.md` |
| Meter-attested mint | `npm run foundation:cycle:meter` |
| Peg experiment | `foundation:peg-check` first; branch before `peg_enabled` |
| Thesis | **Paused** — cite `FOUNDATION_STATUS.md` when you resume Ch 5 |

## What already runs without you

See `AUTONOMOUS_OPS.md` — daily autosync, Monday operator cycle, public demo at `/demo/`.

## Do not claim (yet)

- Stablecoin parity with USDC/DAI at scale
- Peg credibility (horizon C — internal simulation only)

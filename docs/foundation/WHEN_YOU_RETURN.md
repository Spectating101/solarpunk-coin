# When you return

Foundation engine runs on autosync + weekly operator CI. Thesis DOCX is in `thesis_package/output/` — copy to Google Docs when ready.

## Quick status

```bash
npm run engine:status
```

**Last known good:** health **ok** · ~0.53 Sepolia ETH · **21** payments · peg **off**.

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
| Meter-attested mint in cycle | `npm run foundation:cycle:meter` |
| Peg experiment on testnet | `foundation:peg-check` first; branch before `peg_enabled` |
| Thesis for professor | `thesis_package/output/THESIS_GROUNDED.docx` + `SUBMIT_TO_ADVISOR.md` |

## What already runs without you

See `AUTONOMOUS_OPS.md` — daily autosync, Monday operator cycle, public demo at `/demo/`.

## Do not claim (yet)

- Stablecoin parity with USDC/DAI at scale
- Peg credibility on live testnet (horizon C — simulation only until enabled)
- Production-ready / legal money

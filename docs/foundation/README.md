# Foundation

Product canon for the energy-anchored monetary stack.

| Doc | Purpose |
|-----|---------|
| [MONETARY_FOUNDATION.md](./MONETARY_FOUNDATION.md) | North star and horizons |
| [INSTRUMENT_COMPARISON.md](./INSTRUMENT_COMPARISON.md) | vs stables / rails |
| [FOUNDATION_STATUS.md](./FOUNDATION_STATUS.md) | **Generated** live metrics |
| [ROADMAP.md](./ROADMAP.md) | What to build next |
| [GOVERNANCE.md](./GOVERNANCE.md) | Multisig handoff |
| [OPERATOR.md](./OPERATOR.md) | Weekly ops + gas |
| [PILOT_PLAYBOOK.md](./PILOT_PLAYBOOK.md) | Minimal closed-loop demo |
| [AUTONOMOUS_OPS.md](./AUTONOMOUS_OPS.md) | What runs without you (CI + rhythm) |
| [WHEN_YOU_RETURN.md](./WHEN_YOU_RETURN.md) | Pilot + governance + thesis deferred |

## Commands

```bash
npm run foundation:health        # gas + sync — run first
npm run foundation:sync          # Sepolia sync + foundation export
npm run foundation:weekly        # health → cycle or daily → publish
npm run foundation:cycle         # operator cycle (needs gas)
npm run foundation:refresh       # sync + publish live demo
npm run foundation:daily         # sync + health + peg + publish (no cycle)
npm run foundation:publish-docs
npm run spk:v1:api               # GET /v1/foundation when API is up
npm run foundation:peg-check
npm run foundation:multisig:dry-run
```

# Foundation

Product canon for the energy-anchored monetary stack.

| Doc | Purpose |
|-----|---------|
| [MONETARY_FOUNDATION.md](./MONETARY_FOUNDATION.md) | North star and horizons |
| [INSTRUMENT_COMPARISON.md](./INSTRUMENT_COMPARISON.md) | vs stables / rails |
| [FOUNDATION_STATUS.md](./FOUNDATION_STATUS.md) | **Generated** live metrics |
| [ROADMAP.md](./ROADMAP.md) | What to build next |
| [GOVERNANCE.md](./GOVERNANCE.md) | Multisig handoff |

## Commands

```bash
npm run foundation:build   # export FOUNDATION_STATUS from runtime
npm run foundation:sync    # Sepolia sync + foundation export
npm run foundation:cycle   # operator cycle + sync + foundation
npm run spk:v1:api         # GET /v1/foundation when API is up
npm run foundation:peg-check      # peg simulation summary
npm run foundation:multisig:dry-run
```

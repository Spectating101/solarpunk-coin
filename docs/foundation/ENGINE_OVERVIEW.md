# SPK v1 engine — what it does

The **engine** is the product backend that keeps Sepolia SPK v1 **synced**, **validated**, and **exportable** — for the demo, foundation docs, and thesis Ch 5 evidence. It is **not** the thesis itself.

## Data flow

```text
Sepolia chain (SPK + CurrencySystem)
        │
        ▼
  spk-v1 sync          ← indexes payments, supply, on-chain policy
        │
        ▼
  state/runtime/spk_v1.json
        │
        ├─► spk-v1 validate     ← consistency checks (422 if broken)
        ├─► spk-v1 foundation   ← FOUNDATION_STATUS.md + status.json
        ├─► spk-v1 export-evidence → thesis_package/SPK_V1_EVIDENCE.md
        ├─► spk-v1-api          ← local HTTP for demo / agents
        └─► docs/demo/spk_v1.json ← GitHub Pages demo JSON
```

## Five engine pieces

| Piece | Location | Job |
|-------|----------|-----|
| **Sync** | `spk_v1/` Python | Pull chain state → runtime JSON + payment ledger |
| **Validate** | `spk_v1/validate.py` | Runtime vs artifacts; labeled counterparties |
| **Health** | `health.py` + `foundation_health.js` | Operator gas, sync age, “safe to cycle?” |
| **Export** | `foundation.py`, `evidence.py` | Human-readable status + thesis evidence pack |
| **Write path** | Hardhat `run_spk_v1_operator_cycle.js` | Mint + network payments on Sepolia (gas) |

## What runs automatically (CI)

| Workflow | When | Does |
|----------|------|------|
| `foundation_autosync.yml` | Daily 06:00 UTC | sync → peg-check → publish demo → commit |
| `spk_v1_operator.yml` | Mondays 12:00 UTC | health gate → operator cycle → publish |

You do **not** need to babysit sync for the demo to stay current.

## One command status

```bash
npm run engine:status
```

Equivalent manual:

```bash
npm run foundation:health
npm run foundation:validate
head -40 docs/foundation/FOUNDATION_STATUS.md
```

## Operator cycle (writes chain)

Only when health is green (`operator_eth ≥ 0.01`):

```bash
npm run foundation:cycle              # default: attested mint + 4 payments
npm run foundation:cycle:meter        # mint from meter bundle fixture
```

Then sync picks up new txs automatically (or run `npm run foundation:sync`).

## Horizon A–B (engine “done” for now)

| Done | Blocked on you |
|------|----------------|
| Sync, validate, health, API | Multisig handoff (`foundation:multisig`) |
| Autosync + weekly CI | Peg **on** on testnet |
| Labeled ledger + counterparties | Real operator meter (not fixture) |
| Peg **simulation** off-chain | Mainnet / legal money claims |
| Demo + foundation export | Stablecoin parity messaging |

## Thesis hook

`npm run thesis:docx` calls `foundation-sync` + `export-evidence` so Chapter 5 tables match live chain metrics.

See also: [BACKEND.md](./BACKEND.md), [AUTONOMOUS_OPS.md](./AUTONOMOUS_OPS.md), [ROADMAP.md](./ROADMAP.md).

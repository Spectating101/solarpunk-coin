# SPK v1 backend

Product backend for Sepolia sync, foundation export, and local API. Thesis is separate.

## Stack

| Piece | Location | Role |
|-------|----------|------|
| Python library | `spk_v1/` | Sync, index, foundation, validate, health |
| Hardhat scripts | `scripts/` | Write chain txs (mint, pay, redeem) |
| Node health | `scripts/foundation_health.js` | Fast gas check for npm/CI |
| FastAPI | `spk-v1-api` | HTTP for demo dev + agents |

## npm commands

```bash
npm run spk:v1:backend:check   # pytest + CLI + API smoke
npm run foundation:sync        # Sepolia → runtime JSON
npm run foundation:validate    # Runtime + artifact consistency
npm run foundation:health      # Operator gas (Node)
npm run foundation:daily       # sync + health + validate + peg + publish
npm run foundation:weekly      # health gate → cycle → publish
npm run spk:v1:api             # http://127.0.0.1:8787
```

## Python CLI

```bash
export SPK_V1_REPO_ROOT=.
spk-v1 sync
spk-v1 foundation-sync
spk-v1 health              # live RPC gas + writes health.json
spk-v1 validate
spk-v1 show-metrics
```

## API (local)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Service probe; `?live=1` adds operator gas |
| GET | `/v1/runtime` | Full `spk_v1.json` |
| GET | `/v1/metrics` | Summary metrics |
| GET | `/v1/payments` | Ledger (`limit`, `payment_kind`) |
| GET | `/v1/counterparties` | Labeled pilot/operator addresses |
| GET | `/v1/operator/health` | Gas + sync freshness |
| GET | `/v1/validate` | 422 if issues found |
| GET | `/v1/foundation` | Monetary snapshot |
| POST | `/v1/sync` | Live Sepolia sync |
| POST | `/v1/foundation/sync` | Sync + export status |

CORS enabled for Vite dev (`localhost:5173`).

## Counterparties

Canonical registry: `spk_v1/counterparties.py` + `scripts/lib/spk_v1_counterparties.js`.

Sync enriches payment ledger rows with `payer_label` / `payee_label` for demo and thesis evidence.

## CI

| Workflow | Schedule | Action |
|----------|----------|--------|
| `foundation_autosync.yml` | Daily 06:00 UTC | Read sync + publish |
| `spk_v1_operator.yml` | Mondays 12:00 UTC | Weekly cycle if gas OK |

## Human-only

- `foundation:multisig` — irreversible admin handoff
- Peg-on on testnet — branch + explicit approval

See `AUTONOMOUS_OPS.md`.

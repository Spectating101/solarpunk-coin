# spk-v1

Python library for **SPK v1** Sepolia runtime: read/sync `spk_v1.json`, index on-chain payments, export thesis evidence.

## Why this package exists

Backend logic lives here so **any repo** can depend on one pipeline:

```bash
pip install -e ./spk_v1
spk-v1 sync --repo-root ..
spk-v1 export-evidence --repo-root ..
```

- **Solarpunk-bitcoin** — frontend + Hardhat ops consume the same runtime shape
- **Sharpe / thesis / other tools** — `pip install spk-v1` instead of copying JSON by hand

Hardhat scripts remain for **writing** transactions (mint, pay). This library handles **read, sync, evidence**.

## Quick start

```bash
# One-shot local backend check (library + CLI + API)
npm run spk:v1:backend:check

# Or manually:
cd spk_v1
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
export SPK_V1_REPO_ROOT=..   # Solarpunk-bitcoin repo root
spk-v1 sync --repo-root ..
spk-v1 export-evidence --repo-root ..
pytest
spk-v1-api   # http://127.0.0.1:8787/health
```

No PyPI publish required — editable local install is the packaging boundary.

## Layers

| Layer | Entry | Purpose |
|-------|--------|---------|
| **Library** | `import spk_v1` | Core logic in `service.py`, `runtime.py`, `chain.py` |
| **CLI** | `spk-v1` | Operator commands |
| **API** | `spk-v1-api` | HTTP for frontend, agents, other repos |

## CLI

| Command | Purpose |
|---------|---------|
| `spk-v1 sync` | Pull live Sepolia state into `state/runtime/spk_v1.json` + `frontend/public/spk_v1.json` |
| `spk-v1 foundation` | Export `docs/foundation/FOUNDATION_STATUS.md` + `state/foundation/status.json` |
| `spk-v1 foundation-sync` | Sync Sepolia + export foundation status |
| `spk-v1 export-evidence` | Write `thesis_package/SPK_V1_EVIDENCE.md` (optional) |
| `spk-v1 export-lake` | Export runtime + payment ledger JSONL for research lakes (Sharpe, etc.) |
| `spk-v1 show-metrics` | Print current metrics from runtime file |

## API (local)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Service + repo root probe |
| GET | `/v1/runtime` | Full runtime JSON |
| GET | `/v1/metrics` | Summary metrics |
| GET | `/v1/foundation` | Monetary foundation snapshot |
| POST | `/v1/foundation/sync` | Sync chain + export foundation status |
| GET | `/v1/payments` | Payment ledger (`limit`, `payment_kind`) |
| POST | `/v1/sync` | On-chain sync (slow; uses Sepolia RPC) |
| POST | `/v1/export/evidence` | Thesis evidence markdown |
| POST | `/v1/export/lake` | Body: `{"out_root": "..."}` |

## Library API

```python
from spk_v1.runtime import read_runtime, sync_runtime
from spk_v1.evidence import export_evidence_markdown
from spk_v1.lake import export_data_lake

runtime = read_runtime("/path/to/solarpunk-bitcoin")
sync_runtime("/path/to/solarpunk-bitcoin", rpc_url="...")
export_data_lake(runtime, Path("data_lake/spk_v1"))
```

## A vs B (Sharpe)

| Package | Boundary |
|---------|----------|
| **spk-v1** (this) | Product truth: contracts, runtime, payments, evidence |
| **sharpe research query** (later) | Research catalog + GDELT/CoinGecko joins; should *import* spk-v1, not duplicate sync |

Both can be PyPI packages. A is canonical for SPK; B consumes A for thesis/market research overlays.

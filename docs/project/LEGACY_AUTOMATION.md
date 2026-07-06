# Legacy automation

Public Lab v1.0 canonical stack: `state/runtime/spk_v1.json` (SPK `0x8e189…`).

## Disabled schedules (2026-07-06)

| Workflow | Why |
|----------|-----|
| `nasa_keeper.yml` | Pushed NASA data to **legacy** contracts (`0x1D55…`, `0xe40A…`). Manual dispatch only. |
| `hardhat-deploy.yml` | Ran `scripts/deploy.js` (pre-v1 full stack). Requires `confirm_legacy=true`. |

## Active automation

| Workflow | Role |
|----------|------|
| `foundation_autosync.yml` | Daily sync + publish `docs/demo/` |
| `spk_v1_operator.yml` | Weekly foundation cycle |
| `deploy.yml` | Build frontend on push |

## Refresh live demo metrics

```bash
# Set SEPOLIA_RPC in .env (Alchemy/Infura — publicnode often 403)
npm run foundation:sync
npm run foundation:refresh
```

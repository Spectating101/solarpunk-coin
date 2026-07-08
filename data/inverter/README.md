# Inverter / meter snapshot files

Use this folder for **local operator exports** when testing the Public Lab adapter.

## Template

Copy [`operator_snapshot_template.json`](./operator_snapshot_template.json) twice:

- `my_site_start.json` — counters at window start
- `my_site_end.json` — counters at window end (must be monotonic)

Then run:

```bash
METER_PRIVATE_KEY=0x... npm run hardware:validate -- \
  --operator \
  --provider=cumulative-json \
  --start=data/inverter/my_site_start.json \
  --end=data/inverter/my_site_end.json \
  --meter-id=YOUR-METER-ID \
  --site-id=your-site-id
```

## Committed samples (L0 fixture)

| File | Purpose |
|------|---------|
| `sample_cumulative_start.json` / `sample_cumulative_end.json` | Default `npm run hardware:validate` sample |
| `fronius_powerflow_start.json` / `fronius_powerflow_end.json` | Fronius API file-pair demo |

## Do not commit

- Production private keys
- Customer-identifying site data
- Unsigned commercial contracts

See [`docs/product/HARDWARE_OPERATOR_QUICKSTART.md`](../../docs/product/HARDWARE_OPERATOR_QUICKSTART.md).

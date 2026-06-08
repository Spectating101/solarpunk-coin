# Autonomous foundation ops

What runs **without Christopher** vs what needs a human decision.

## Three layers

| Layer | Who | What |
|-------|-----|------|
| **Read path** | GitHub Action `Foundation autosync` (daily 06:00 UTC) | Sync chain → JSON, peg summary, publish demo, commit state |
| **Write path** | GitHub Action `SPK v1 Operator Cycle` (Mondays 12:00 UTC) | Health gate → operator cycle if gas OK → publish → commit |
| **Session path** | Cursor / local | Health, ad-hoc cycles, pilot demos, next builds |

Thesis (`thesis_package/`) is **out of scope** until explicitly resumed.

## Health gate

```bash
npm run foundation:health
```

| Signal | Meaning |
|--------|---------|
| `ok: true`, `operator_eth ≥ 0.01` | Safe to run `foundation:cycle` |
| `ok: false` or low ETH | Read-only: `foundation:daily` / autosync only |
| `sync_age_hours` high | Run `foundation:sync` or wait for autosync |

## Weekly rhythm (operator)

```bash
npm run foundation:weekly    # health → cycle OR daily fallback → publish
```

Equivalent manual steps:

```bash
npm run foundation:health
npm run foundation:cycle      # only when health ok
npm run foundation:publish-docs
```

**Do not** run `foundation:cycle` more than once per week unless there is a specific demo or pilot reason — gas is ample (~0.53 ETH) but unnecessary churn does not add evidence.

## Human-only decisions

| Action | Why |
|--------|-----|
| `npm run foundation:multisig` | Irreversible admin handoff |
| Peg-on on testnet | Policy change; branch + explicit approval |
| Thesis edits | Paused track |
| Mainnet / legal claims | Out of horizon A–B |

Dry-run and simulation are always fine:

```bash
npm run foundation:multisig:dry-run
npm run foundation:peg-check
```

## Success (horizon A–B)

- Payment count grows on a **verifiable** ledger (Etherscan + `FOUNDATION_STATUS.md`)
- Demo JSON matches chain within one autosync window
- Operator health stays green without manual faucet mining
- No stablecoin-war or peg-victory messaging

## One-liner status

```bash
npm run foundation:health && head -30 docs/foundation/FOUNDATION_STATUS.md
```

## Live URLs

- Demo: https://spectating101.github.io/solarpunk-coin/demo/
- Operator: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`

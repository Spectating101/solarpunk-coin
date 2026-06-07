# Documentation Maintenance

**Purpose:** Keep docs aligned with the repo. Markdown drifts; commands and `state/` JSON do not.

## Canonical order (when facts conflict)

1. `DOCS.md` — entry map (humans + AI); update when doc structure changes
2. `CURRENT_STATUS.md` — live snapshot (update when tests or deployments change)
3. `state/runtime/spk_v1.json` — canonical testnet state
4. `thesis_package/THESIS_SOURCE_OF_TRUTH.md` — thesis numbers and framing
5. `EVIDENCE.md` — proof links
6. `README.md` — public overview (should match CURRENT_STATUS)
7. `MASTER_HANDOFF.md` — long history only; verify numbers against CURRENT_STATUS
8. `docs/archive/**` — historical only

**Deprecated as current truth:** launch-gate decisions, "public lab launchable now" copy, Polygon Amoy/Mumbai primary deployment, 46/55/77/79/102 test totals, single-EOA admin on core contracts.

## Verification commands

Run these before updating status docs:

```bash
# Contract tests (authoritative count)
npx hardhat test

# Node product-script tests
node --test test-node/*.test.js

# Regenerate local SPK mint proof
npm run attestations:fixture && npm run attestations:build && npm run proof:spk-attested-mint

# Keeper freshness
cat state/keeper_logs/summary.json | head -20

# Launch gate (archival — do not treat as product decision)
node scripts/product_launch_gate.js
```

## What to update when

| Change | Update |
|---|---|
| New contract or test file | `CURRENT_STATUS.md`, `README.md`, `contracts/README.md` |
| Sepolia deploy | `CONTRACT_ADDRESSES.md`, `state/deployments/*.json`, `frontend/src/constants/contracts.js` |
| Keeper run | `state/keeper_logs/`, `EVIDENCE.md` §2.4 |
| Thesis numbers | `thesis_package/THESIS_SOURCE_OF_TRUTH.md`, grounded chapter drafts |
| New product script | `package.json` scripts section, optional `CURRENT_STATUS.md` table |

## Stale patterns to grep for

```bash
rg "79/79|102/102|55/55|Polygon Mumbai|Amoy-primary|launchable now|production-ready protocol" --glob '*.md'
```

## Product / launch docs

`docs/product/PUBLIC_LAB.md`, `PRODUCT_LAUNCH_GATE.md`, and related packets were written for a **testnet outreach phase**. That phase is no longer the project focus. Keep them as research appendices or archive under `docs/archive/` when rewriting — do not let them override `CURRENT_STATUS.md`.

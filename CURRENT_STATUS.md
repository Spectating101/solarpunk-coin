# Current status

**Updated:** 2026-07-10  
**Public Lab v1.0 freeze:** SolarPunk is packaged as a **public testnet laboratory for energy-standard settlement**. Public Lab is the current endpoint. Closed pilot and paid/mainnet are **future gated work**, not active v1 obligations.

**Operating mode:** [Maintenance](./docs/project/MAINTENANCE.md) — feature-complete Public Lab; quarterly checks; wake path in [`docs/project/WAKE_PATH.md`](./docs/project/WAKE_PATH.md).

**Open lab mode:** Replicate, fork, and extend via [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`docs/project/OPEN_LAB_WORKFLOWS.md`](./docs/project/OPEN_LAB_WORKFLOWS.md). Not a token sale, mainnet launch, or investment product.

**Entry point:** [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md) · [`docs/product/PUBLIC_LAB_DEPLOYMENT.md`](./docs/product/PUBLIC_LAB_DEPLOYMENT.md) · [`DOCS.md`](./DOCS.md)

---

## What this is

**Public Lab v1.0:** Renewable-energy issuance standard for programmable settlement on Sepolia — verified surplus kWh → bounded SPK mint → network payments. USD/kWh reference for expression only (peg **off**).

**Horizon:** Operating laboratory (structure), not stablecoin war (scale).

**Thesis:** Final package ready (`energy_constraint_thesis_final_submission_v10.pdf`) — pending user submission.

---

## Live now

| | |
|---|---|
| Demo | https://spectating101.github.io/solarpunk-coin/demo/ |
| SPK (lab unit) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Payments contract | `0x520162252F9B94824417678525FFd69145014970` |
| Foundation status | [`docs/foundation/FOUNDATION_STATUS.md`](./docs/foundation/FOUNDATION_STATUS.md) |
| Runtime | `state/runtime/spk_v1.json` |
| Evidence | [`thesis_package/SPK_V1_EVIDENCE.md`](./thesis_package/SPK_V1_EVIDENCE.md) |

**On-chain (last indexed sync 2026-06-10):** ~5,499 SPK supply · 442 SPK settled · **21** network payments · ~96.7% circulation · peg off · $0.05/kWh reference.

> **Ops note:** Refresh with `npm run foundation:sync` when `SEPOLIA_RPC` in `.env` is working. Public RPC (`publicnode`) may return 403 — use Alchemy/Infura URL in `.env`.

**Legacy automation (2026-07-06):** NASA daily keeper and `hardhat-deploy` workflow disabled for Public Lab v1 — they targeted pre-v1 contracts. See `frontend/src/components/archive/`.

---

## Launch gates

| Endpoint | Status |
|----------|--------|
| Public Lab v1.0 | **Shipped** |
| Closed pilot | Blocked — real operator data, governed deploy, economics |
| Paid / mainnet | Blocked — audit, legal, reserves |

---

## Operator (quarterly maintenance)

Default cadence is **quarterly** — see [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md). Weekly cycles are optional, not required.

| Check | Command |
|-------|---------|
| Gas + sync health | `npm run foundation:health` |
| Sync ledger | `npm run foundation:sync` |
| Optional weekly rhythm | `npm run foundation:weekly` |
| Full cycle | `npm run foundation:cycle` |
| Refresh public demo | `npm run foundation:refresh` |
| **Preflight + publish demo** | `npm run public-lab:preflight` · `npm run public-lab:publish` |
| **Hardware validate (sample)** | `npm run hardware:validate` |

**Deployer:** `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54` — Sepolia ETH for cycles. See [`docs/foundation/AUTONOMOUS_OPS.md`](./docs/foundation/AUTONOMOUS_OPS.md).

---

## Tests

| Command | What |
|---------|------|
| `npx hardhat test` | 109 contract tests |
| `npm run spk:v1:backend:check` | Python sync + API |
| `npm run foundation:health` | Operator readiness |

---

## Future work (inactive until external hook)

1. Closed pilot — real meter/inverter data ([`PILOT_DATA_ASK.md`](./docs/product/PILOT_DATA_ASK.md))
2. Governed multisig when ops are boring (`docs/foundation/GOVERNANCE.md`)
3. Meter mint in operator cycle (`npm run foundation:cycle:meter`)
4. Peg experiment only after `foundation:peg-check` discipline

Institutional path: [`docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md`](./docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md)

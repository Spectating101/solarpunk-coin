# Documentation map

**If you're human or an AI catching up: read this file first.**  
Then [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md), then `CURRENT_STATUS.md`.

---

## What this project is (plain)

**SolarPunk Public Lab v1.0** — a public Sepolia testnet laboratory for an **energy-standard settlement architecture**:

1. Verified renewable surplus (kWh) → bounded SPK issuance  
2. SPK circulates as settlement credit via on-chain network payments  
3. Redemption / shortfall accounting is explicit; peg is **off**; USD/kWh is reference only  

**Not claimed:** mainnet, token sale, stablecoin, legal tender, delivered-energy rights, production audit.

---

## Canonical files (trust these)

| Priority | File | Use |
|----------|------|-----|
| 1 | [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md) | **Public Lab v1.0** — what it is / is not / evidence |
| 2 | [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) | Live snapshot, launch gates, ops |
| 3 | [`state/runtime/spk_v1.json`](./state/runtime/spk_v1.json) | Machine-readable testnet state |
| 4 | [`thesis_package/SPK_V1_EVIDENCE.md`](./thesis_package/SPK_V1_EVIDENCE.md) | Evidence pack + tx tables |
| 5 | [`docs/product/SPK_V1.md`](./docs/product/SPK_V1.md) | SPK technical constitution |
| 6 | [`docs/foundation/FOUNDATION_STATUS.md`](./docs/foundation/FOUNDATION_STATUS.md) | Generated foundation metrics |
| 7 | [`docs/product/PILOT_DATA_ASK.md`](./docs/product/PILOT_DATA_ASK.md) | Closed pilot data request |
| 8 | [`docs/product/SPK_V1_OPERATOR.md`](./docs/product/SPK_V1_OPERATOR.md) | Operator cycles |
| 9 | [`CONTRIBUTING.md`](./CONTRIBUTING.md) | How to replicate and contribute |
| 10 | [`docs/project/OPEN_LAB_WORKFLOWS.md`](./docs/project/OPEN_LAB_WORKFLOWS.md) | Run local / Sepolia / evidence / adapters |
| 11 | [`docs/product/PUBLIC_LAB_DEPLOYMENT.md`](./docs/product/PUBLIC_LAB_DEPLOYMENT.md) | **Launch / publish** demo + preflight |
| 12 | [`docs/product/HARDWARE_OPERATOR_QUICKSTART.md`](./docs/product/HARDWARE_OPERATOR_QUICKSTART.md) | **Hardware operators** — validate real exports |
| 13 | [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md) | Maintenance mode + quarterly checklist |
| 14 | [`docs/project/WAKE_PATH.md`](./docs/project/WAKE_PATH.md) | When/how to leave maintenance for a pilot |

**When documents disagree:** **Public Lab v1 framing** + `CURRENT_STATUS.md` + `spk_v1.json` win.

---

## Commands that matter

```bash
npx hardhat test                # 109 contract tests
npm run hardware:validate       # sample operator energy-evidence path
npm run public-lab:preflight      # before publishing demo
npm run public-lab:publish        # preflight + build + docs/demo mirror
npm run spk:v1:sync             # refresh state from chain (.env RPC)
npm run spk:v1:evidence:export  # regenerate evidence pack
npm run foundation:health       # sync age + operator gas
```

Credentials: `.env` with `PRIVATE_KEY` and `SEPOLIA_RPC`.

---

## Sepolia addresses (SPK v1 — canonical)

| | Address |
|---|---------|
| SPK token (lab unit) | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Payment contract | `0x520162252F9B94824417678525FFd69145014970` |

Demo: https://spectating101.github.io/solarpunk-coin/demo/

---

## Folder guide

| Path | What |
|------|------|
| `docs/product/PUBLIC_LAB_V1.md` | **Start here** for public framing |
| `docs/product/PUBLIC_LAB_DEPLOYMENT.md` | Launch / publish demo + preflight |
| `docs/product/HARDWARE_OPERATOR_QUICKSTART.md` | Hardware operators — validate exports |
| `data/meter/` | CSV / Green Button templates |
| `contracts/` | Solidity source |
| `frontend/` | Public Lab landing + SPK console |
| `thesis_package/` | Thesis chapters and empirics |
| `state/runtime/` | Live testnet JSON |
| `docs/project/` | Institutional path, assessments |
| `docs/grants/` | **Historical** — grant phase; refresh numbers before use |
| `docs/archive/` | Old snapshots |

---

## Stale — do not use as current truth

These exist for history. They will mislead LLMs if read before Public Lab v1 docs:

| File / area | Why stale |
|-------------|-----------|
| README/network-money-only snapshots before v1.0 freeze | Superseded by `PUBLIC_LAB_V1.md` |
| `docs/product/PUBLIC_LAB.md` (old) | Pre-v1.0 launch phase |
| `docs/product/PRODUCT_LAUNCH_GATE.md` | Launch-outreach phase |
| `docs/grants/*` | Grant submission phase — verify 109 tests, SPK v1 addresses |
| `PRODUCT_LAUNCH_READINESS.md` | Pre-freeze launch theater |
| `MASTER_HANDOFF.md` | Long narrative; verify via CURRENT_STATUS |
| Any doc citing **"network money launch"**, **Polygon Amoy**, or **103 tests only** | Out of date |

Legacy Sepolia stacks (`0x1D55…`, `0x8ceDa…` May 2026 proof) are **archive**, not Public Lab v1.

---

## Thesis vs Public Lab

| | Public Lab v1.0 | Thesis |
|---|-----------------|--------|
| Goal | Inspectable testnet settlement lab | Bounded academic claims |
| Evidence | Sepolia txs, `spk_v1.json` | Ch 3–5 + `SPK_V1_EVIDENCE.md` |
| Tone | Shipped laboratory | Proof of concept, not production currency |

---

## Post-thesis institutional path

Optional sequel after v1.0 freeze: [`docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md`](./docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md) — 14-day validation → 90-day pilot if external hook appears.

Visual polish (ChatGPT): [`docs/project/VISUAL_REVIEW_WORKFLOW.md`](./docs/project/VISUAL_REVIEW_WORKFLOW.md) — `npm run demo:screenshots` → upload `screenshots/chatgpt-visual-audit-live.zip`.

Open lab extension: [`docs/project/EXTENSION_POINTS.md`](./docs/project/EXTENSION_POINTS.md) · [`docs/project/ROADMAP.md`](./docs/project/ROADMAP.md).

---

## Maintenance

Default mode: [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md) (quarterly).  
Doc hygiene: [`docs/project/DOC_MAINTENANCE.md`](./docs/project/DOC_MAINTENANCE.md).  
After operator cycles: `spk:v1:sync` then `spk:v1:evidence:export`.

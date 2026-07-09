# Public Lab Maintenance Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Freeze SolarPunk Public Lab v1.0 into a durable, citable, open-source maintenance mode that stays publicly launched as a Sepolia lab, protects authorship, and can wake later for a closed pilot — without day-job-breaking ops.

**Architecture:** One-time doc/runtime truth alignment + maintenance playbook + GitHub release/archive path; keep canonical Sepolia contracts frozen; quarterly ops only; wake path documented but not executed unless external data arrives.

**Tech Stack:** Existing repo docs (`CURRENT_STATUS.md`, `AGENTS.md`, `README.md`), `state/runtime/spk_v1.json`, npm foundation/spk scripts, GitHub Releases + optional Zenodo, MIT/`CITATION.cff`/`TRADEMARK.md`.

**Design spec:** [`docs/superpowers/specs/2026-07-10-public-lab-maintenance-mode-design.md`](../specs/2026-07-10-public-lab-maintenance-mode-design.md)

---

## File map

| File | Responsibility |
|------|----------------|
| `docs/project/MAINTENANCE.md` | **Create** — quarterly checklist, wake criteria, “silence is OK” |
| `docs/project/WAKE_PATH.md` | **Create** — when/how to leave maintenance mode for a closed pilot |
| `CURRENT_STATUS.md` | Add maintenance-mode banner + ops cadence |
| `README.md` | Project status section (feature-complete / maintained as-needed) |
| `AGENTS.md` | Align with Public Lab v1 as current truth (fix contradiction) |
| `DOCS.md` | Link MAINTENANCE + WAKE_PATH in canonical map |
| `state/runtime/spk_v1.json` | Fix `product` label away from “Network Money” |
| `scripts/deploy_spk_v1*.js`, `scripts/attach_spk_v1_sepolia.js` | Match product string for future deploys (no redeploy now) |
| `frontend/public/spk_v1.json`, `docs/demo/spk_v1.json` | Mirror runtime product label after sync/copy |
| `docs/product/PUBLIC_LAB_SOCIAL_KIT.md` | Point links at Public Lab v1 (not stale launch-gate) |
| `docs/project/DOC_MAINTENANCE.md` | Point to MAINTENANCE.md; note maintenance-mode sync policy |
| `CITATION.cff` | Confirm version/date for freeze release |
| GitHub Release `public-lab-v1.0` | Tagged snapshot for citation / optional Zenodo |

**Do not touch:** `IE-JDE/`, contract bytecode, Sepolia redeploy, peg enablement, grant spam packages (historical only).

---

### Task 1: Create `MAINTENANCE.md`

**Files:**
- Create: `docs/project/MAINTENANCE.md`
- Modify: none yet

- [ ] **Step 1: Write the maintenance playbook**

Create `docs/project/MAINTENANCE.md` with exactly this content:

```markdown
# Public Lab maintenance mode

**Mode:** feature-complete / maintained as-needed  
**Canonical product:** SolarPunk Public Lab v1.0  
**Contracts:** frozen on Sepolia unless bytecode intentionally changes  
**Updated:** 2026-07-10

## What this means

Public Lab v1.0 is **shipped**. The default state is **maintenance**, not active product development.

- Silence between quarterly checks is expected and OK.
- Do not treat missing weekly operator cycles as project failure.
- Do not redeploy Sepolia for vibes.
- Do not enable peg, mainnet, or token-sale framing.

## Quarterly checklist (~2–4 hours)

Run when you have a free weekend each quarter (or after a long gap):

```bash
npx hardhat test
# expect: 109 passing

npm run foundation:health
# operator ETH should be > 0.01; sync may be stale — see policy below

# If SEPOLIA_RPC works (Alchemy/Infura in .env):
npm run foundation:sync
npm run spk:v1:evidence:export
npm run foundation:build

# Confirm demo loads
# https://spectating101.github.io/solarpunk-coin/demo/
```

After sync, skim:

- `CURRENT_STATUS.md` metrics vs `state/runtime/spk_v1.json`
- Demo still shows Public Lab non-claims

## Sync staleness policy

In maintenance mode, a sync age of weeks or months is **acceptable** if:

1. Last-good metrics remain published in `spk_v1.json` / evidence pack
2. Docs say “last indexed sync” rather than implying live minute-by-minute state
3. `foundation:health` “stale sync” is treated as a reminder, not an emergency

Refresh when RPC works; do not burn time fighting public RPC 403s.

## Gas / deployer

Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`  
Top up Sepolia ETH only if balance approaches the health minimum (~0.01 ETH).

## What not to do in maintenance mode

| Action | Why not |
|--------|---------|
| `spk:v1:deploy:*` / lean redeploy | Breaks canonical addresses; confuse evidence |
| Peg on | Monetary claim |
| Grant blitz with stale numbers | Credibility risk |
| Large feature work without wake signal | Opportunity cost vs day job |
| Commit secrets / real customer meter PII | Security / privacy |

## Wake criteria

Leave maintenance mode only if **one** of these is true — see [`WAKE_PATH.md`](./WAKE_PATH.md):

1. Real meter/inverter export (L2+ path) arrives
2. Written institutional/advisor cover for a closed pilot
3. Funded audit or grant that requires active ops
4. Maintainer explicitly chooses a time-boxed pilot sprint

## Authorship

- License: [`LICENSE`](../../LICENSE) (MIT)
- Cite: [`CITATION.cff`](../../CITATION.cff)
- Attribution: [`NOTICE`](../../NOTICE)
- Name/marks: [`TRADEMARK.md`](../../TRADEMARK.md)
```

- [ ] **Step 2: Verify file exists and links resolve**

Run:

```bash
test -f docs/project/MAINTENANCE.md && head -n 20 docs/project/MAINTENANCE.md
```

Expected: file prints; title is `Public Lab maintenance mode`.

- [ ] **Step 3: Commit**

```bash
git add docs/project/MAINTENANCE.md
git commit -m "$(cat <<'EOF'
Add Public Lab maintenance-mode playbook.

EOF
)"
```

---

### Task 2: Create `WAKE_PATH.md`

**Files:**
- Create: `docs/project/WAKE_PATH.md`

- [ ] **Step 1: Write the wake path**

Create `docs/project/WAKE_PATH.md`:

```markdown
# Wake path — leaving maintenance mode

Use this only when an **external** signal appears. Do not self-wake for polish.

## Signals (any one)

1. Usable real meter/inverter export (see [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md))
2. Advisor/institution written lab framing for a closed pilot
3. Grant/audit funding that requires active Sepolia ops
4. Explicit maintainer decision: time-boxed 90-day pilot sprint

## Minimum wake sequence

```bash
# 1. Truth + health
npx hardhat test
npm run foundation:sync
npm run foundation:health

# 2. Ingest operator source (example — adjust paths)
# METER_PRIVATE_KEY=0x... npm run meter:inverter-adapter -- \
#   --provider=cumulative-json \
#   --start=data/inverter/operator_start.json \
#   --end=data/inverter/operator_end.json \
#   --meter-id=OPERATOR-METER-001 \
#   --site-id=operator-site-a \
#   --real-operator-source

npm run hardware:validate
# or hardware:validate:operator when real files exist

# 3. Meter mint cycle (Sepolia)
CYCLE_MINT_MODE=meter npm run foundation:cycle:meter

# 4. Evidence
npm run foundation:sync
npm run spk:v1:evidence:export
```

## Deliverable

Write `docs/project/PILOT_REPORT_v1.md` with:

1. Bounded claim
2. Site + hardware tier (L2+ required for closed-pilot language)
3. Pipeline summary
4. Tx hashes / addresses
5. Limits (testnet, peg off, not legal tender)
6. Whether to return to maintenance mode or continue

## Still blocked without extra work

- Paid / mainnet: audit, legal, reserves, L4 hardware
- Governed redeploy: only if roles/Safe required for the pilot terms
- Economics anchor: document support gap; do not invent solvency

## Return to maintenance

After Pilot Report v1 (or failed intake), update `CURRENT_STATUS.md` and resume [`MAINTENANCE.md`](./MAINTENANCE.md) quarterly cadence unless a funded next stage exists.
```

- [ ] **Step 2: Commit**

```bash
git add docs/project/WAKE_PATH.md
git commit -m "$(cat <<'EOF'
Document wake path for leaving Public Lab maintenance mode.

EOF
)"
```

---

### Task 3: Align `AGENTS.md` with Public Lab truth

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Replace AGENTS.md content**

Set `AGENTS.md` to:

```markdown
# AI assistant instructions

Read [`DOCS.md`](./DOCS.md) before anything else in this repo.

## Current product

- **SolarPunk Public Lab v1.0** on Ethereum Sepolia — canonical framing in [`docs/product/PUBLIC_LAB_V1.md`](./docs/product/PUBLIC_LAB_V1.md)
- Canonical addresses in `state/runtime/spk_v1.json`
- Default operating mode: **maintenance** — [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md)
- Optional operator cycle: `npm run spk:v1:cycle:sepolia` (not required weekly)

## Do not

- Redeploy Sepolia unless bytecode intentionally changed
- Frame this as “launch ready” currency, token sale, mainnet, or grant-seeking theater
- Treat pre-v1 launch-gate / grant / Polygon Amoy docs as current truth
- Use `docs/product/SOLARPUNK_FULL_CONTEXT_FOR_CLAUDE.md` (retired)
- Touch `IE-JDE/` (separate project)

## Verify facts

- `CURRENT_STATUS.md` + `npx hardhat test` (109 tests)
- Prefer Public Lab v1 + `spk_v1.json` when documents disagree
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "$(cat <<'EOF'
Align AGENTS.md with Public Lab v1 maintenance mode.

EOF
)"
```

---

### Task 4: Banner `CURRENT_STATUS.md` and `README.md`

**Files:**
- Modify: `CURRENT_STATUS.md`
- Modify: `README.md`
- Modify: `DOCS.md`

- [ ] **Step 1: Add maintenance banner to CURRENT_STATUS.md**

Insert immediately after the title / first updated line block (after the opening paragraph that ends with “not active v1 obligations.”), a new section:

```markdown
**Operating mode:** [Maintenance](./docs/project/MAINTENANCE.md) — feature-complete Public Lab; quarterly checks; wake path in [`docs/project/WAKE_PATH.md`](./docs/project/WAKE_PATH.md).
```

Also change the “Operator (optional maintenance)” intro sentence if needed so it says quarterly, not implying weekly obligation.

Update the **Updated:** date to the freeze day when you land the commit.

- [ ] **Step 2: Add Project status to README.md**

Insert after the opening non-claims paragraph (before `> **Start here:**`):

```markdown
## Project status

**Public Lab v1.0 is feature-complete and in maintenance mode.**  
The Sepolia lab, demo, and evidence pack remain public. Active development is not the default. Quarterly health checks are enough. To resume a closed pilot, see [`docs/project/WAKE_PATH.md`](./docs/project/WAKE_PATH.md).

Cite via [`CITATION.cff`](./CITATION.cff). Forks must not imply official endorsement — [`TRADEMARK.md`](./TRADEMARK.md).
```

- [ ] **Step 3: Link from DOCS.md**

In the canonical files table (or Commands / Maintenance section), add:

| Priority | File | Use |
| ... | [`docs/project/MAINTENANCE.md`](./docs/project/MAINTENANCE.md) | Maintenance mode + quarterly checklist |
| ... | [`docs/project/WAKE_PATH.md`](./docs/project/WAKE_PATH.md) | When/how to leave maintenance for a pilot |

Place them near items 10–12 (open lab / deploy), and in the Maintenance section at the bottom point to `MAINTENANCE.md` first.

- [ ] **Step 4: Commit**

```bash
git add CURRENT_STATUS.md README.md DOCS.md
git commit -m "$(cat <<'EOF'
Announce Public Lab maintenance mode in status and docs map.

EOF
)"
```

---

### Task 5: Fix product label drift (“Network Money” → Public Lab)

**Files:**
- Modify: `state/runtime/spk_v1.json` (`product` field only)
- Modify: `scripts/deploy_spk_v1.js` (product string in runtime writer)
- Modify: `scripts/deploy_spk_v1_sepolia_lean.js`
- Modify: `scripts/attach_spk_v1_sepolia.js`
- Modify: `frontend/public/spk_v1.json`
- Modify: `docs/demo/spk_v1.json`

- [ ] **Step 1: Change runtime product string**

In `state/runtime/spk_v1.json`, set:

```json
"product": "SolarPunk Public Lab"
```

Do **not** change contract addresses, metrics, or ledgers.

- [ ] **Step 2: Mirror to frontend and docs/demo copies**

```bash
cp state/runtime/spk_v1.json frontend/public/spk_v1.json
cp state/runtime/spk_v1.json docs/demo/spk_v1.json
```

- [ ] **Step 3: Fix deploy script defaults so future deploys don’t reintroduce the old label**

In each of:

- `scripts/deploy_spk_v1.js`
- `scripts/deploy_spk_v1_sepolia_lean.js`
- `scripts/attach_spk_v1_sepolia.js`

Replace:

```javascript
product: "SPK Network Money",
```

with:

```javascript
product: "SolarPunk Public Lab",
```

Do **not** run deploy scripts.

- [ ] **Step 4: Sanity check**

```bash
node -e 'const r=require("./state/runtime/spk_v1.json"); if(r.product!=="SolarPunk Public Lab") process.exit(1); console.log(r.product, r.contracts.solar_punk_coin);'
rg 'SPK Network Money' state/runtime/spk_v1.json frontend/public/spk_v1.json docs/demo/spk_v1.json scripts/deploy_spk_v1.js scripts/deploy_spk_v1_sepolia_lean.js scripts/attach_spk_v1_sepolia.js
```

Expected: first command prints product + address; `rg` finds **no** matches in those paths.

- [ ] **Step 5: Commit**

```bash
git add state/runtime/spk_v1.json frontend/public/spk_v1.json docs/demo/spk_v1.json \
  scripts/deploy_spk_v1.js scripts/deploy_spk_v1_sepolia_lean.js scripts/attach_spk_v1_sepolia.js
git commit -m "$(cat <<'EOF'
Rename runtime product label to SolarPunk Public Lab.

EOF
)"
```

---

### Task 6: Refresh social kit + doc maintenance pointers

**Files:**
- Modify: `docs/product/PUBLIC_LAB_SOCIAL_KIT.md`
- Modify: `docs/project/DOC_MAINTENANCE.md`

- [ ] **Step 1: Fix Primary Links in social kit**

Replace the Primary Links section with:

```markdown
## Primary Links

- Demo: `https://spectating101.github.io/solarpunk-coin/demo/`
- GitHub: `https://github.com/Spectating101/solarpunk-coin`
- Public Lab v1.0: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/PUBLIC_LAB_V1.md`
- Current status: `https://github.com/Spectating101/solarpunk-coin/blob/main/CURRENT_STATUS.md`
- Maintenance mode: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/project/MAINTENANCE.md`
- Hardware quickstart: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/HARDWARE_OPERATOR_QUICKSTART.md`
- Pilot data ask: `https://github.com/Spectating101/solarpunk-coin/blob/main/docs/product/PILOT_DATA_ASK.md`
- Pilot inquiry issue: `https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md`
```

Update the one-line / short version posts if they still say “I opened” as if launch-week — prefer:

> SolarPunk Public Lab v1.0 is a public Sepolia laboratory for energy-standard settlement (peg off). Looking for critique and real meter/inverter export formats — not a token sale.

Leave older archived phrasing out of the primary templates.

- [ ] **Step 2: Point DOC_MAINTENANCE at MAINTENANCE.md**

At the top of `docs/project/DOC_MAINTENANCE.md`, after the purpose sentence, add:

```markdown
**Operating mode:** See [`MAINTENANCE.md`](./MAINTENANCE.md). In maintenance mode, prefer quarterly sync over treating stale index age as an incident.
```

In the “Product / launch docs” section, keep stating launch-gate docs are historical; add that `PUBLIC_LAB_V1.md` is current.

- [ ] **Step 3: Commit**

```bash
git add docs/product/PUBLIC_LAB_SOCIAL_KIT.md docs/project/DOC_MAINTENANCE.md
git commit -m "$(cat <<'EOF'
Point social kit and doc maintenance at Public Lab v1.

EOF
)"
```

---

### Task 7: Optional chain sync (RPC-dependent)

**Files:**
- May update: `state/runtime/spk_v1.json`, `docs/foundation/FOUNDATION_STATUS.md`, `thesis_package/SPK_V1_EVIDENCE.md`, frontend/demo mirrors

- [ ] **Step 1: Try sync**

```bash
npm run foundation:sync
```

If RPC fails (403/timeout): **skip Steps 2–3**; note in commit message of Task 8 that sync was deferred. Do not block the freeze.

- [ ] **Step 2: If sync succeeds, export evidence and rebuild foundation docs**

```bash
npm run spk:v1:evidence:export
npm run foundation:build
cp state/runtime/spk_v1.json frontend/public/spk_v1.json
cp state/runtime/spk_v1.json docs/demo/spk_v1.json
```

Confirm `product` is still `"SolarPunk Public Lab"` after sync (re-apply if a script overwrote it).

- [ ] **Step 3: Commit if files changed**

```bash
git add state/runtime/spk_v1.json frontend/public/spk_v1.json docs/demo/spk_v1.json \
  docs/foundation/FOUNDATION_STATUS.md thesis_package/SPK_V1_EVIDENCE.md
git commit -m "$(cat <<'EOF'
Refresh Public Lab runtime sync and evidence for maintenance freeze.

EOF
)"
```

---

### Task 8: Verification gate

**Files:** none required

- [ ] **Step 1: Run contract tests**

```bash
npx hardhat test
```

Expected: `109 passing`.

- [ ] **Step 2: Grep for dangerous live framing in entry docs**

```bash
rg -n "launch ready|token sale|SPK Network Money|do \*\*not\*\* treat launch-gate, public-lab" \
  AGENTS.md CURRENT_STATUS.md README.md DOCS.md docs/project/MAINTENANCE.md docs/product/PUBLIC_LAB_V1.md
```

Expected:

- “token sale” only inside **non-claims**
- no `SPK Network Money` in those files
- no AGENTS line telling agents to ignore public-lab as truth

- [ ] **Step 3: Confirm authorship files still present**

```bash
test -f LICENSE && test -f CITATION.cff && test -f NOTICE && test -f TRADEMARK.md && echo OK
```

Expected: `OK`

---

### Task 9: GitHub release tag (citation snapshot)

**Files:** none (git tag + `gh`)

- [ ] **Step 1: Ensure working tree clean for release**

```bash
git status -sb
```

Expected: clean on `main` (or only unrelated untracked junk ignored).

- [ ] **Step 2: Tag and push release**

```bash
git tag -a public-lab-v1.0 -m "SolarPunk Public Lab v1.0 — maintenance freeze"
git push origin public-lab-v1.0
gh release create public-lab-v1.0 --title "Public Lab v1.0 (maintenance freeze)" --notes "$(cat <<'EOF'
## SolarPunk Public Lab v1.0

Frozen public Sepolia laboratory for energy-standard settlement research.

- Demo: https://spectating101.github.io/solarpunk-coin/demo/
- Framing: docs/product/PUBLIC_LAB_V1.md
- Maintenance: docs/project/MAINTENANCE.md
- Cite: CITATION.cff

Not a token sale, mainnet product, or live dollar peg.
EOF
)"
```

Only push tag/release if the user has asked to push / create the release in this session; otherwise stop after local tag and report the exact commands for the user to run.

- [ ] **Step 3: Optional Zenodo (manual)**

If GitHub–Zenodo is linked: archive this release for a DOI, then add `doi:` to `CITATION.cff` in a follow-up commit. If not linked: skip; Software Heritage save of the repo URL is an acceptable backup later.

---

### Task 10: One-time public note (optional, human)

**Files:** none in repo (or a short `docs/product/PUBLIC_LAB_V1_RELEASE_NOTE.md` tweak)

- [ ] **Step 1: Post or skip**

Use updated social kit one-liner once (LinkedIn or X). Then stop marketing.

If updating the in-repo release note, keep it factual: shipped lab + maintenance mode + pilot data ask link.

- [ ] **Step 2: Day-job handoff**

Calendar a recurring **quarterly** reminder titled “SolarPunk Public Lab health” pointing at `docs/project/MAINTENANCE.md`.

---

## Out of scope (explicit)

- Redeploying Sepolia
- Enabling peg
- Closed pilot execution without real data
- Grant applications
- Repo-wide archive of all historical docs
- Extracting `IE-JDE/`
- Frontend visual redesign

## Self-review

| Spec requirement | Task |
|------------------|------|
| Freeze Public Lab as permanent endpoint | 1–4, 9 |
| Protect authorship (cite / NOTICE / trademark) | 1, 4, 8, 9 |
| Quarterly ops | 1, 10 |
| Wake path preserved | 2 |
| Stop false progress | 1, 3, 6 |
| Fix truth drift | 3–6 |
| Optional sync | 7 |
| Verify tests | 8 |

No TBD placeholders. No contract code changes required for the freeze.

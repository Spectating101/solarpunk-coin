# Public Lab workbench — release handoff

**Audience:** next human / agent finishing publish.  
**Product:** SolarPunk Public Lab v1.0 — browser research workbench (Evidence Lab + Currency Lab + Sepolia Proof + Research).  
**Date of this note:** 2026-07-20.

Read [`DOCS.md`](../../DOCS.md) and [`PUBLIC_LAB_V1.md`](./PUBLIC_LAB_V1.md) first for product framing. This file is only the **workbench ship status**.

---

## One-line status

| Gate | Status |
|------|--------|
| **Code (core architecture)** | Approved through `81ab5f3` |
| **Visual (five-tab + lower states)** | Approved (local screenshot package) |
| **Thesis / canonical PDF link** | **Blocking** — corrected PDF not yet committed; UI still points at v10 temporary link |
| **Merge to `main`** | Not done |
| **GitHub Pages publish** | Not done — live demo is still pre-workbench (or older main) |

**Do not add Evidence/Currency Lab features.** Remaining work is thesis artifact + link + verify + merge + publish.

---

## Where the code lives

| Item | Value |
|------|--------|
| Feature branch | `feat/public-lab-workbench` |
| Remote | `origin` → `Spectating101/solarpunk-coin` |
| Clean worktree used for this work | `../solarpunk-public-lab-workbench` (sibling of main checkout) |
| Main checkout (often dirty / thesis branch) | `Solarpunk-bitcoin` — do not mix thesis DOCX work into the workbench PR |

### Commit chain (workbench)

Oldest → newest on the feature branch:

1. `3c60ec2` — Add browser-local Public Lab Evidence and Currency workbench  
2. `defb0c2` — Correctness pass (surplus, provenance, settlement capacity, stale receipt, language)  
3. `81ab5f3` — Tiny polish (chronological cumulative, settlement wording, Sepolia-only connectError, gap heuristic label)  
4. `743f76c` — **Harden Public Lab browser flow for release** (hash nav, session receipt continuity, guided Evidence→Currency→Sepolia progress) — authored after visual approval of `81ab5f3`

**Review anchor:** code + visual approval in conversation was against **`81ab5f3`**. Tip of remote is **`743f76c`**. Before merge, decide whether `743f76c` is accepted as-is or needs a quick re-check (no redesign expected; it is UX continuity only).

Local worktree may be **behind** `origin/feat/public-lab-workbench` by that harden commit — run `git pull` in the worktree before the thesis-link commit.

---

## What was built (product surface)

Unauthenticated browser workbench tabs:

1. **Overview** — constraints framing; CTAs to Evidence / Currency; Sepolia & Research secondary  
2. **Evidence Lab** — local CSV validate → SHA-256 receipt; unsigned; not live-mint eligible  
3. **Currency Lab** — off-chain sim bound to evidence hash; issuance cap; payments vs **settlement capacity**; shortfall scenario  
4. **Sepolia Proof** — advanced/optional live console (wallet optional for read)  
5. **Research** — thesis / CEIR / evidence pack links  

### Hard product boundaries (do not regress)

- Generation alone ≠ surplus; export **or** gen+consumption required for issuance eligibility  
- Timestamps require `Z` or explicit offset; canonicalized to UTC  
- Cumulative monotonicity checked **chronologically per meter**, not raw CSV order  
- Gap detection is a **heuristic** (median cadence, ≥3 rows) — warnings, not hard rejects  
- Stale receipt invalidated on remap / parse fail / new ingest / oversise reject  
- Settlement capacity ≠ payer wallet; payments must not reduce settlement capacity  
- Browser path ≠ L2 provenance; Sepolia mint remains operator-gated  
- No accounts, DB, faucet, peg, mainnet, or contract redeploy for this feature  

---

## Review verdicts (already decided)

### Code gate — approved

Critical defects fixed in `defb0c2` / `81ab5f3`:

- Stale receipt boundary  
- Surplus / null totals / issuance eligibility  
- Timezone qualification + per-meter keys  
- Gap diagnostics as warnings  
- Settlement capacity vs wallet + shortfall severity  
- Narrative: browser-local vs signed Sepolia  

Tiny polish in `81ab5f3` also approved.

### Visual gate — approved

Package (untracked):

- Worktree: `_review_workbench/public-lab-workbench-full-visual.zip`  
- Also mirrored under main checkout: `Solarpunk-bitcoin/_review_workbench/`

Includes five-tab captures + Evidence validated full-page + Currency shortfall full-page.  
**No further UI redesign.** Optional copy only (see below).

### Not approved as “released”

Until thesis PDF is canonical on `main` and Pages mirrors the workbench build.

---

## Remaining release gate (only this)

### 1. Commit corrected thesis PDF (PDF only)

**Intended filename (repo root):**

```text
energy_constraint_thesis_final_submission_revised.pdf
```

**Source the user named:** `/mnt/data/energy_constraint_thesis_final_submission_revised.pdf`  
That path is a **Claude.ai upload path**, not this Linux host. As of 2026-07-20 the file was **not** found under Downloads / either repo tree.  
**Blocker:** place the PDF on disk (e.g. worktree root or `~/Downloads/`) before the link commit.

**Do not** commit the editable DOCX in this release.

### 2. Point `THESIS_CANONICAL_URL` at that PDF

Today (still temporary):

```js
// frontend/src/constants/contracts.js
THESIS_CANONICAL_URL → .../energy_constraint_thesis_final_submission_v10.pdf
THESIS_LINK_STATUS → "temporary_v10_pending_ceir_boundary_revision"
```

Required edits:

| File | Change |
|------|--------|
| `frontend/src/constants/contracts.js` | URL → revised PDF; remove temporary status comment / `THESIS_LINK_STATUS` temporary value |
| `frontend/src/components/ResearchPanel.jsx` | Card title **Thesis PDF**; note = corrected final / canonical thesis PDF; drop “temporary development link” lead copy |
| `frontend/src/components/PublicLabLanding.jsx` | Any “Thesis PDF (temporary…)” → canonical wording |

Do **not** make grounded Markdown the primary thesis link.

### 3. Optional A (approved for same commit)

In Sepolia Proof (`SpkV1Console.jsx`):

- Label **Implied supply** → **Illustrative USD expression**  
- Keep: `USD reference · expression only · peg off`

### 4. Final verification (before merge)

From worktree root, after thesis-link commit:

```bash
cd frontend && npm run test:run && npm run build && cd ..
npx hardhat test
npm run hardware:validate
npm run foundation:health
npm run spk:v1:sync
npm run spk:v1:evidence:export
npm run public-lab:preflight
```

Expect: frontend tests green; **109** Hardhat tests; preflight ok.  
Confirm: **no** contract / deployment / `spk_v1` address changes in the commit.

### 5. Merge + publish (needs explicit human approval)

```bash
# After PR merge to main (or approved merge):
npm run public-lab:publish   # preflight + mirror to docs/demo/
git add docs/demo frontend/public/spk_v1.json   # as publish script produces
# commit on main if publish is local, then push — CI also builds on main push
```

**Canonical live URL after publish:**  
https://spectating101.github.io/solarpunk-coin/demo/

Playbook: [`PUBLIC_LAB_DEPLOYMENT.md`](./PUBLIC_LAB_DEPLOYMENT.md).

**Stop before merge/publish unless the user explicitly says go.**

---

## Temporary public preview (ChatGPT / external eyes)

A Cloudflare **quick tunnel** was used once to expose a local static `frontend/dist` for external review.

- Hostnames look like `something-random.trycloudflare.com` — **random Cloudflare words**, not project branding  
- Vite `preview` blocks unknown hosts; use `python3 -m http.server` (or `npx serve`) on `frontend/dist` then `cloudflared tunnel --url http://127.0.0.1:PORT`  
- Tunnel dies when the machine/process stops — **not** a release URL  
- As of this handoff the prior tunnel URL is stale / not a durable gate  

For a durable public URL: merge + Pages only.

---

## Key source files (workbench)

| Area | Path |
|------|------|
| Tab shell | `frontend/src/App.jsx` |
| Overview | `frontend/src/components/PublicLabLanding.jsx` |
| Evidence UI | `frontend/src/components/EvidenceLab.jsx` |
| Currency UI | `frontend/src/components/CurrencyLab.jsx` |
| Sepolia console | `frontend/src/components/SpkV1Console.jsx` |
| Research | `frontend/src/components/ResearchPanel.jsx` |
| Evidence engine | `frontend/src/lib/evidenceLab.js` |
| Currency sim | `frontend/src/lib/currencyLab.js` |
| Thesis URL constant | `frontend/src/constants/contracts.js` |
| Sample CSV | `frontend/public/samples/public_lab_sample_meter.csv` |
| Session harden (743f76c) | `frontend/src/lib/sessionReceipt.js`, `labScenarios.js`, `LabSessionBar.jsx` |

Contracts / `state/runtime/spk_v1.json` addresses were **out of scope** for this branch (frontend + sample/test only).

---

## Review artifacts (local, usually untracked)

Under worktree `_review_workbench/`:

| Artifact | Purpose |
|----------|---------|
| `public-lab-workbench-v2-screenshots.zip` | Evidence + Currency upper (first visual pass) |
| `public-lab-workbench-full-visual.zip` | Full five-tab + lower states (visual gate) |
| `screenshots-full/` | Individual PNGs |
| `example_evidence_receipt.json` | Sample receipt from sample CSV |
| `example_currency_simulation.json` | Sample shortfall sim JSON |

Do not treat these as git release artifacts unless deliberately added.

---

## Main-repo / thesis isolation notes

- `thesis/ceir-boundary-rewrite` and deleted `CHAPTER_*_GROUNDED_DRAFT.md` are a **separate** track; grounded Markdown is retired as primary thesis  
- CEIR final diagnosis already on main: `thesis_package/CEIR_FINAL_DIAGNOSIS.md` (and related scripts/CSV) — CEIR does **not** validate SPK  
- Do not touch `IE-JDE/`  
- Do not redeploy Sepolia unless bytecode intentionally changes  

---

## Agent / operator checklist (next session)

```text
[ ] git -C solarpunk-public-lab-workbench pull origin feat/public-lab-workbench
[ ] Confirm tip SHA (expect 743f76c or later thesis-link commit)
[ ] Obtain energy_constraint_thesis_final_submission_revised.pdf on this host
[ ] sha256sum the PDF; record hash
[ ] Commit PDF + THESIS_CANONICAL_URL + Research/Overview copy + optional Sepolia label
[ ] Run full verification list above
[ ] Push branch; open/refresh PR vs main
[ ] Human: approve merge
[ ] Human: approve Pages publish (npm run public-lab:publish + push / CI)
[ ] Spot-check https://spectating101.github.io/solarpunk-coin/demo/ — five tabs + thesis link opens revised PDF
[ ] Freeze: no more workbench feature work
```

---

## Conversation / decision trail (compressed)

1. Workbench built as self-service research instrument (not token landing page).  
2. Code review → four critical defects → fixed → tiny chronological/settlement/UX polish → **code approved**.  
3. Visual package → Evidence/Currency + full five-tab → **visual approved**.  
4. Thesis-link commit **blocked** once: PDF path `/mnt/data/...` unavailable on Cursor host.  
5. Temporary Cloudflare tunnel offered for ChatGPT live UI poke; not a substitute for Pages.  
6. User intends: after thesis link + verify → final **merge + publish** approval in a later message.

---

## Recommendation

**Hold merge/publish** until:

1. Revised PDF is in-repo, and  
2. `THESIS_CANONICAL_URL` resolves to it with non-temporary Research copy, and  
3. Verification suite is green on the tip commit (including `743f76c` or its successor).

Then merge `feat/public-lab-workbench` → `main` and publish the demo. After that, **freeze** the workbench.

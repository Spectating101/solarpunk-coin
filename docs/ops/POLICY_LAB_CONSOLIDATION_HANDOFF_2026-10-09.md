# Policy Lab consolidation and solidification — handoff, 2026-10-09

A dated snapshot, not runtime authority. Start from [CURRENT_SURFACE.json](../../CURRENT_SURFACE.json) and [AGENTS.md](../../AGENTS.md); verify claims below against the repository before acting.

**Operator:** Codex (the user is the decision-maker). Grok (`grok-muscle` MCP) is available for bounded mechanical edits, per `tools/grok-muscle-mcp/docs/SHARED_OPERATOR.md`: write a concrete spec and a real `verify` command, inspect the diff, and keep final judgement yourself.

**Scope: Policy Lab only.** The same repository also holds other research projects (Digital Tax / Fiscal Choke Points, Invisible Ledger, global-AI-finance portal). Do not touch them; list them as out of scope. **The frontend redesign is deferred** — the user will revisit it later. Do not restyle; the visual guards below must simply stay green.

## 1. Goal

**Consolidation.** One authoritative `main`. Every valuable piece of Policy Lab work is either on `main`, in a small reviewable PR, or archived with a written record. Nothing is lost silently, and no confusing duplicates remain (branches, PRs, worktrees, handoff documents).

**Solidification.** Close the known engineering items that can be closed without new evidence, keep CI green, and keep the documentation honest.

## 2. State of play (facts as of 2026-10-09)

- `origin/main` = `6a9e240` (bot mirror) on top of `993dbcc`, the merge of PR #74. #74 carried the 16 audit repairs and the visual refinement. Hosted CI passed 19/19 twice; the site is live at https://spectating101.github.io/solarpunk-coin/demo/ and the live checks pass.
- **Backup (Policy Lab only):** `/mnt/research-data/phyrexian-private/cold/backups/solarpunk-2026-10-08/` — a git bundle of all 103 refs (restore-tested), working trees including uncommitted files, and the audit evidence. See its `RESTORE.md`. Take a fresh backup before any destructive step.
- **Remote:** 80 branches besides `main`; 23 already merged; **57 not merged**, several far ahead of `main` (`feat/policy-lab-release-integration` +105, `feat/policy-lab-frontend-convergence` +92, `feat/policy-lab-mcp-v0` +49).
- **Open pull requests** (15):
  - Policy Lab: #73 `integration/portfolio-mcp-v1` (MCP capsule verification), #71 `feat/policy-lab-release-integration` (titled "do not merge", a rehearsal), #70 same branch ("Harden Policy Lab release integration"), #66 `feat/policy-lab-frontend-convergence`, #65 `feat/policy-lab-specialized-gauntlet`, #64 `audit/policy-lab-certification-20260910`.
  - Open issues #29–#33 (programme control, conformance benchmark, external cases, review programme, adoption experiment): probably Policy Lab programme — confirm.
  - **Out of scope, do not touch:** #67, #72 (Digital Tax), #68, #69 (Invisible Ledger).
- **Local-only branches** (never pushed; they exist on one disk): `feat/paired-platform-shell` (+33 over `main`, worktree under `~/.config/superpowers/worktrees/`), `fix/backend-followup-2026-10-05` (+1, worktree `.worktrees/solarpunk-backend-repairs`), `package/policy-lab-release-v0.2.0` (+1, worktree `.worktrees/policy-lab-release`), `ci/add-claude-github-app` (+1), `field-ready-alpha`, `grok/0920-023651-87f8`, `thesis/ceir-boundary-rewrite`, `fix/repository-audit-2026-10-05` (already merged via #74).
- **Worktrees** (about a dozen; some outside the repo folder: `~/.config/superpowers`, `~/.local/state/grok-muscle`, `~/.cache/tmp`). Several have uncommitted work: the main checkout `Solarpunk-bitcoin` (branch `thesis/cleanup-canonical-pdf`, **1 modified and 40 untracked files**), `solarpunk-main-tip`, `solarpunk-operator-evidence-pilot`, `solarpunk-public-lab-workbench`, and the grok worktree.
- **Known open engineering items** (from `AUDIT_REPAIR_HANDOFF_2026-10-05.md` and later work):
  1. Root `npm audit` reports 23 affected nodes (7 high) from braces/elliptic advisories. Reviewed, hash-checked backports mitigate the tested defects (`security/dependency-patches.json`); upstream closure needs a Hardhat 3 migration or compatible releases. Never use `--ignore-scripts` for the normal install.
  2. Contract API and signature changes (matched option opening, `sourceHash` in EnergyRevenueFloor reports) require a fresh deployment and migration if deployment is ever requested. Existing deployments are unchanged.
  3. Derivatives rate limits are per process.
  4. `AGENTS.md` still says "four-case pack"; the case pack, surface checker and preflight say five.
  5. The historical Reference and Sepolia routes read a public Sepolia RPC (`ethereum-sepolia-rpc.publicnode.com`) when opened; disclosed in `PRIVACY.md`.
  6. `.env.oracle` and `.env.example` are tracked at the repository root. Confirm they hold placeholders only (do not print values); if anything is live, rotate it and tell the user.
  7. Evidence boundaries must not be promoted: controlled cases are non-empirical, the Ausgrid checkpoint is L0, R4 is `UNTESTED`, and source-holder verification is not done.
- **Guards that must stay green** (`npm run …`): `policy-lab:surface`, `policy-lab:preflight`, `policy-lab:test-core`, `policy-lab:test-frontend`, `npm test` (Hardhat), `node --test test-node/*.test.js`, `policy-lab:visual-quality`, `:a11y`, `:visual-states`, `:load-performance`, plus the Python suites listed in `AUDIT_REPAIR_HANDOFF_2026-10-05.md`. Details of the visual guards are in `UI_VISUAL_REFINEMENT_2026-10-06.md`. A test in `ReceiptsWorkspace.test.jsx` is heavy; it has a 30 s timeout.

## 3. Rules (hard gates)

You may do freely: read, run tests, create branches and worktrees, commit locally, open **draft** PRs.

**Ask the user first (present the list, wait for explicit approval):**
- merging anything into `main`, pushing to `main`, tagging or publishing a release, deploying;
- deleting any local or remote branch, closing any PR or issue, removing any worktree;
- force-pushing, rewriting history, or discarding uncommitted files;
- anything that sends content to an external service other than the normal `git push` of a feature branch.

Also: do not modify out-of-scope projects; do not promote evidence claims (AGENTS.md "Evidence boundaries"); if code, generated artifacts, workflows and prose disagree, trust the executable objects; keep `CURRENT_SURFACE.json` and `scripts/check_current_surface.mjs` in step if the canonical surface changes; do not reactivate archived scheduled writers, legacy deployment workflows or old package publishers. Prefix shell commands with `rtk`. Node >=22.12 <23, Python >=3.11. Work in `.worktrees/policy-lab-consolidation` (branch `chore/policy-lab-consolidation`, from `origin/main`). Keep PRs small, each with its own evidence.

## 4. Phases

**Phase 0 — inventory (read-only).** Write `docs/ops/POLICY_LAB_CONSOLIDATION_INVENTORY_2026-10-09.md` with one row per branch, PR, issue and worktree: scope tag (`policy-lab`, `adjacent-research` such as the Norway evidence dossier, `other-project`), last commit date, ahead/behind `main`, whether its content is already on `main` (use `git cherry`, `git diff --stat main...branch`, file-level overlap, PR descriptions — `main` was curated, so many large branches may be superseded), what unique value remains, and a recommended action: `already-on-main`, `salvage-in-PR`, `supersede-and-archive`, `keep-local`, `out-of-scope`. Start with the big ones: release-integration, frontend-convergence, specialized-gauntlet, mcp-v0 and portfolio-mcp-v1, certification, paired-platform-shell, the backend and release local branches. Include a triage of the 41 dirty files in the main checkout (commit-worthy / discard-candidate / keep-local) without deleting anything.

**Stop 1.** Summarise the inventory and a proposed ordered plan with risks. Wait for the user.

**Phase 2 — safe solidification (draft PRs only, no merging).** After approval of the plan, in this order of value: (a) fix the stale `AGENTS.md` line and reconcile the documentation index and handoff sprawl (archive index, not deletion); (b) salvage PRs for the unique valuable work (for example MCP capsule verification, #73), rebased onto `main` with tests; (c) dependency path: assess a Hardhat 3 migration versus continued backport maintenance, and produce an ADR or a PR; (d) the backend follow-up and release-package branches: bring in, or explain why not; (e) CI hygiene, including whether to add an optional cross-browser job; (f) the `.env` check from §2.

**Stop 2.** Report results and list the proposed destructive cleanups.

**Phase 3 — cleanup (only with explicit approval of the exact list).** Before any deletion, take a fresh backup and record each branch tip (an `archive/<name>` tag or an entry in the inventory). Then delete merged remote branches, retire superseded branches, close stale PRs, and remove worktrees.

## 5. Done means

- The inventory exists, every in-scope branch, PR and worktree has a recorded disposition, and the user has approved the destructive list (or declined it).
- All guards in §2 pass locally and on hosted CI for each PR.
- `AGENTS.md`, `README.md` and `DOCS.md` match the executable state; evidence boundaries are unchanged.
- A short final report: what changed, what is still open, and what needs a decision.

## 6. Efficiency

Do not re-derive what is written here. Prefer `git cherry` and `git diff --stat` to reading histories. Delegate bounded mechanical work to Grok with a real `verify` command. Keep reports short and decision-oriented.

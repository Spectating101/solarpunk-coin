# Local Agent Interface Handoff

**Purpose:** review, merge, and publish the Policy Lab interface pass without deploying or changing any contracts.  
**Source branch:** `agent/decision-brief`  
**Review target:** pull request `#4` into `main`  
**Deployment scope:** static GitHub Pages interface only

## Hard boundaries

Do **not**:

- deploy the generalized protocol contracts to Sepolia;
- redeploy or mutate the existing SolarPunk contracts;
- use a private key or RPC secret for this interface release;
- alter empirical aggregate files, policy formulas, source hashes, or licensed-data boundaries;
- alter thesis artifacts;
- rename internal `constraint-*` package, schema, or study identifiers.

This handoff is for a static frontend release. The existing Sepolia material is reference content only.

## What the branch changes

The branch introduces an answer-first public entry surface and preserves the deeper laboratories:

```text
#runs       Decision Brief
#study      Full empirical study
#reproduce  Public aggregate integrity receipt
#protocol   Evidence-to-claim browser lab
#overview   SolarPunk reference application
#sepolia    Existing SolarPunk Sepolia proof
#research   Research material
```

The public shell uses the descriptive label **Policy Lab**. Internal implementation identifiers remain unchanged.

The Decision Brief includes:

- 20- and 60-session policy views;
- coverage gained and capacity surrendered;
- residual shortfall frequency;
- conditional shortfall-severity change;
- the worst published stress replay;
- source-package identity and public-data boundary;
- a downloadable Markdown decision memo;
- direct paths into the study, reproduction receipt, and claim lab.

## Checkout and verify the source

```bash
git fetch origin
git checkout agent/decision-brief
git pull --ff-only origin agent/decision-brief
git status --short
git rev-parse HEAD
```

The working tree must be clean before validation or publishing.

## Required validation

From the repository root:

```bash
npm install
node --test packages/constraint-core/test/*.test.mjs
npx hardhat test test/ConstraintProtocol.test.js
npx hardhat test

npm --prefix frontend install
npm --prefix frontend run test:run
npm --prefix frontend run build
```

The frontend suite includes dedicated Decision Brief tests for:

- committed 20-session values;
- 60-session switching without refetching;
- route continuation buttons;
- aggregate-load failure and retry behavior.

## Browser and visual review

Install Chromium if needed:

```bash
npx playwright install --with-deps chromium
```

Start the built preview:

```bash
cd frontend
npm run preview -- --host 127.0.0.1 --port 4173
```

In another terminal, from the repository root:

```bash
rm -rf _review_protocol_alpha
node scripts/capture_constraint_protocol_alpha.mjs _review_protocol_alpha
```

The script must complete and produce 19 screenshots, including:

- desktop Decision Brief at 20 and 60 sessions;
- desktop empirical study, frontier, stress, methods, and reproduction;
- desktop protocol intake, evidence, admitted claim, and settlement shortfall;
- mobile Decision Brief, study, stress, reproduction, protocol intake, and evidence.

Review at minimum:

```text
01-decision-brief-20-session.png
02-decision-brief-60-session.png
03-empirical-study.png
07-reproduction-receipt.png
08-protocol-entry.png
14-mobile-decision-brief.png
15-mobile-empirical-study.png
18-mobile-protocol-entry.png
```

Reject the release if there is horizontal overflow, clipped navigation, unreadable metric text, missing source receipt, or a hidden stress-failure boundary.

## Performance check

The Decision Brief and empirical routes must not preload the wallet stack. `ethers` is dynamically imported only on `#sepolia`.

After building, inspect `frontend/dist/index.html`:

```bash
grep -n "web3" frontend/dist/index.html || true
find frontend/dist/assets -maxdepth 1 -type f -printf '%f %s bytes\n' | sort -k2 -nr
```

A separate Web3 chunk may exist, but the entry HTML should not eagerly module-preload it.

## Diff boundary before merge

```bash
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
```

Expected changes are limited to:

- frontend routing, metadata, Decision Brief, tests, and visual hardening;
- browser screenshot capture script;
- interface/handoff documentation.

There should be no changed empirical JSON, policy manifest, contract, runtime, or thesis file.

## Merge posture

Keep pull request `#4` as a draft until:

```text
[ ] all GitHub checks are green
[ ] local frontend tests and production build pass
[ ] the 19-shot browser walkthrough completes
[ ] desktop and mobile screenshots are reviewed
[ ] the final diff boundary is confirmed
```

Then merge using the repository's normal method. Do not squash away provenance if the maintainer wants the development sequence retained; otherwise a squash merge is acceptable for this isolated interface pass.

## Static Pages publication

After the reviewed branch is merged into `main`, use the existing static publication path:

```bash
git checkout main
git pull --ff-only origin main
npm install
npm --prefix frontend install
npm run public-lab:preflight
npm run public-lab:publish
git status --short docs/demo
```

`npm run public-lab:publish` builds the Vite frontend and mirrors the deployable output into `docs/demo/`, the repository's legacy GitHub Pages source.

If `docs/demo/` changed, inspect the generated diff before committing:

```bash
git diff --stat -- docs/demo
git diff -- docs/demo/index.html
```

Commit and push only the generated `docs/demo/` changes required for the reviewed interface release. The repository's Pages workflow may also perform this mirror automatically after merge; do not publish the same generated change twice.

## Post-publication checks

Verify the live static routes:

```text
/demo/#runs
/demo/#study
/demo/#reproduce
/demo/#protocol
/demo/#overview
/demo/#sepolia
/demo/#research
```

Confirm:

- Decision Brief loads from committed aggregate files;
- 20/60-session toggle works;
- Markdown decision memo downloads;
- reproduction status reaches `EXACT`;
- all continuation buttons route correctly;
- local sample evidence can reach admitted claim and visible settlement shortfall;
- SolarPunk reference and existing Sepolia proof remain intact.

## Rollback

If the published interface is defective:

1. revert the interface merge or the generated `docs/demo/` publication commit;
2. push the revert to `main`;
3. verify that the prior Pages build is restored;
4. do not alter contracts or runtime state as part of frontend rollback.

## Stop rule after publication

Do not add more generic dashboard surface after this release. Resume interface development only for:

- a real external evidence source;
- concrete reviewer or user comprehension feedback;
- a publication or competition requirement;
- a protocol-integrity defect;
- an explicitly approved deployment milestone.

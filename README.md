# Policy Lab

**Case-based constraint research workbench for testing what evidence can justify, what policy blocks, what quantity ceiling binds, and what fails at settlement.**

**Live research surface:** https://spectating101.github.io/solarpunk-coin/demo/

Policy Lab grew out of the earlier SolarPunk / Energy Standard research programme. The current project is not a token launch or a claim that an energy-linked financial instrument is already money. It is an executable research environment built around explicit evidence, versioned policy, deterministic constraints, settlement stress, lineage, and reproducibility.

## Start here: current source of truth

Do **not** infer current project state from whichever Markdown handoff looks newest. This repository contains years of historical iterations.

The current surface is machine-declared in [`CURRENT_SURFACE.json`](./CURRENT_SURFACE.json) and enforced by [`scripts/check_current_surface.mjs`](./scripts/check_current_surface.mjs) in CI.

| Question | Current executable source |
|---|---|
| What is the project? | `CURRENT_SURFACE.json` |
| What does the public app expose? | `frontend/src/App.jsx` + `frontend/src/app/routes.js` |
| What evaluates a case? | `packages/constraint-core/src/workbench.js` |
| Which controlled cases exist? | `protocol/cases/energy-v1/case-pack.json` |
| Which policy manifests are executable? | `protocol/policies-v2/` |
| What schemas bind outputs? | `protocol/schema/` |
| What is the outside-data checkpoint? | `.github/workflows/external-case-001p-ausgrid.yml` + `frontend/src/data/publicEvidenceCheckpoint.js` |
| What portable artifact leaves the lab? | `policylab.claim_assessment_package.v0.1` |
| What publishes the live site? | `.github/workflows/deploy.yml` |
| What verifies production after deploy? | `.github/workflows/policy-lab-live-smoke.yml` |

Historical Markdown remains useful for provenance, research development, and reconstruction, but it is not runtime authority.

## Decision model

```text
case
  ↓
evidence + modeled context
  ↓
assurance classification
  ↓
versioned policy
  ↓
admission gates
  ↓
quantity ceilings
  ↓
deterministic decision
  ↓
settlement stress
  ↓
receipt / lineage / portable assessment package
```

The implementation stages are deliberately separate from the research boundaries R1–R4. Passing one stage or boundary never automatically upgrades the next.

## Two evidence classes are intentionally separate

### Controlled interactive case pack

The browser workbench currently exposes four controlled mechanism cases:

- `TYN-001`
- `AUS-001`
- `PHX-001`
- `OPS-001`

The pack declares `empirical_claim: false`. These cases test decision structure, policy divergence, assurance counterfactuals, quantity ceilings, settlement behavior, receipts, and reproduction. They are not independent empirical validation.

### Outside-data checkpoint

`PUB-AUSGRID-001P` is a separate externally sourced public-data checkpoint executed in CI. It is **not** silently promoted into the controlled browser case pack.

Current frozen checkpoint facts include:

- actual assurance: `L0`;
- 336 half-hour intervals;
- 33.066 kWh eligible derived surplus;
- open policy: `ADMIT_WITH_LIMIT` at 33.066 `ENERGY_CLAIM_UNIT`;
- pilot policy: `BLOCKED`;
- 40% settlement stress: `PARTIAL`, 13.2264 covered / 19.8396 shortfall;
- closed-world decision reproduction: `PASS`;
- R4 monetary performance: `UNTESTED`.

This demonstrates bounded outside-data operability and reproducibility. It does not establish owner/operator confirmation, physical meter truth, legal issuance authority, production pricing, governance adequacy, or monetary adoption.

## Portable claim assessment

The external-case workflow also builds and independently verifies:

```text
policylab.claim_assessment_package.v0.1
profile: policylab.energy_linked_claim.v0
```

The package preserves evidence identity, policy identity, structured rule evaluations, bounded quantity, optional settlement, explicit non-claims, and research-boundary projection. It has separate semantic `assessment_id` and complete `package_content_id` identities.

CI requires:

1. agreement with the closed source artifacts;
2. deterministic identity reproduction;
3. exact human-report rendering from the machine package;
4. byte-identical package and report rebuilds.

The package is a portable rendering of Policy Lab results. Packaging does not create new evidence authority.

## Canonical commands

The root Node package is intentionally private. Current entry commands are:

```bash
npm run policy-lab:surface
npm run policy-lab:preflight
npm run policy-lab:test-core
npm run policy-lab:test-frontend
npm run policy-lab:build
```

For interactive development:

```bash
cd frontend
npm install
npm run dev
```

The repository still contains many older `spk:*`, `foundation:*`, `product:*`, `thesis:*`, contract, meter, and pilot commands. They are preserved for historical reproduction and reference work; they do not define the current Policy Lab release path.

## Current release path

```text
CURRENT_SURFACE.json
  ↓
Policy Lab preflight
  ↓
constraint-core + frontend tests
  ↓
Vite build
  ↓
GitHub Pages mirror
  ↓
live production smoke
```

Publishing no longer depends on historical SPK contract state, peg state, network-payment history, Foundation cycles, or legacy product-launch gates.

## Historical SolarPunk / SPK material

SolarPunk, SPK v1, Sepolia contracts, currency experiments, Foundation/operator machinery, thesis tooling, and older product experiments remain in the repository because they are part of the research lineage and may still be useful for reproduction.

They are secondary/reference surfaces. Historical scheduled writers, legacy deploy workflows, and the old `spk-derivatives` release publisher have been removed from active GitHub Actions and archived under `archive/github-workflows/`.

The live app retains explicit historical/reference routes where those systems can still be inspected without redefining the current project.

## Non-claims

Policy Lab does not currently claim:

- source-holder or operator validation for the public Ausgrid case;
- physical meter truth from derived public data;
- legal issuance or redemption authority;
- production-grade custody, pricing, or governance;
- certification or regulatory approval;
- product-market fit or commercial demand;
- circulation, liquidity, medium-of-exchange acceptance, or monetary status.

A receipt proves deterministic lineage. A package proves reproducible packaging. Neither proves the real-world fact or legal authority represented by the underlying evidence.

## Repository rule

When code, generated artifacts, workflows, and old prose disagree, investigate the executable objects first. Update `CURRENT_SURFACE.json` and its integrity checks when the canonical surface genuinely changes.

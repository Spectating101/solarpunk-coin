# Constraint empirical lab deployment playbook

How to publish and maintain the public Constraint empirical and protocol lab while preserving the SolarPunk/SPK reference application.

**Live demo:** https://spectating101.github.io/solarpunk-coin/demo/

## What “launched” means

A successful public-alpha launch means:

| Surface | Success criterion |
|---|---|
| **Empirical Runs** | Aggregate study, frontier, stress replay, methods, and run dossier load from committed public artifacts |
| **Protocol Lab** | Evidence → normalization → diagnostics → provenance → policy → bounded claim → settlement works locally in-browser |
| **SPK Reference** | Existing Sepolia reference application and runtime remain available and accurately bounded |
| **Reproducibility** | Core, conformance, contract, frontend, and Chromium flows pass in CI |
| **Licence boundary** | No licensed CRSP/Refinitiv row-level observations appear in the public empirical bundle |
| **Honest gates** | No mainnet, legal redemption, reserve custody, production collateral-control, or certified-meter claim |

## Preflight

```bash
npm install
npm run public-lab:preflight
```

The preflight verifies the retained SPK runtime/reference gates and prepares the frontend runtime asset.

The Constraint alpha CI separately verifies:

- JavaScript and Python protocol conformance;
- empirical aggregate-only invariants;
- reference contracts and local deployment smoke;
- frontend tests and production build;
- desktop and mobile Chromium flows.

## Publishing

GitHub Pages for this repository is served from `/docs` on `main`.

On every `main` push, `.github/workflows/deploy.yml` now:

1. runs the public-lab preflight;
2. builds the current frontend;
3. mirrors `frontend/dist` into `docs/demo/`;
4. verifies the empirical bundle and retained SPK runtime;
5. commits generated `docs/demo` changes back to `main` with `[skip ci]`.

The live path is:

```text
https://spectating101.github.io/solarpunk-coin/demo/
```

A manual workflow dispatch remains available under **Deploy to GitHub Pages**.

## Public empirical artifacts

The deployed interface reads aggregate artifacts from:

```text
frontend/public/empirical/market-capacity-v1/
```

Required files:

- `market-capacity-summary.json`
- `methods-manifest.json`
- `policy-frontier.json`
- `stress-reference-runs.json`
- `yearly-policy-results.json`

The source CRSP/Refinitiv panel remains internal and is identified by hash only. The public-data test blocks prohibited row-level fields.

## Visitor paths

### Risk / finance reviewer

1. Open **Empirical Runs**.
2. Compare fixed, volatility-adaptive, and volatility+liquidity policies.
3. Inspect coverage-versus-capacity trade-offs.
4. Open stress replays and Methods.

### Researcher

1. Inspect the source-package hash and conservative cleaning rules.
2. Read `docs/protocol/EMPIRICAL_RUNS_V1.md`.
3. Review common-sample results, binding attribution, and limitations.

### Protocol / infrastructure reviewer

1. Open **Protocol Lab**.
2. Run a bundled evidence example.
3. Inspect normalization, diagnostics, provenance, policy comparison, claim identity, and settlement shortfall.
4. Review schemas, conformance vectors, threat model, and reference contracts.

### SPK / thesis reference reviewer

1. Open **SPK Reference** and **Sepolia Proof**.
2. Review the retained testnet evidence pack and explicit launch limitations.
3. Treat SPK as a reference application, not the protocol ceiling.

## Release checklist

- [ ] Exact branch-head Constraint Alpha CI succeeds.
- [ ] Desktop/mobile visual artifact reviewed.
- [ ] Public empirical bundle remains aggregate-only.
- [ ] Research surface contains no stale temporary thesis link.
- [ ] Merge approved branch to `main`.
- [ ] `Deploy to GitHub Pages` succeeds.
- [ ] Verify `/demo/#runs`, `/demo/#protocol`, `/demo/#overview`, and `/demo/#research`.
- [ ] Confirm no mainnet or production claims were introduced.

## Explicitly outside this launch

- Mainnet or paid product
- Token sale / ICO
- Legal collateral or redemption rights
- Reserve custody
- Production oracle or evaluator finality
- Certified hardware provenance
- Production collateral-control or risk adequacy
- Formal security audit sign-off

See:

- `docs/protocol/EMPIRICAL_RUNS_V1.md`
- `docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md`
- `docs/protocol/PUBLIC_ALPHA_READINESS.md`
- `docs/protocol/THREAT_MODEL_ALPHA.md`

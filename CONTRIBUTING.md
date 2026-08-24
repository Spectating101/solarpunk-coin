# Contributing to Policy Lab

Policy Lab is an **open research workbench** for testing how bounded evidence and explicit versioned policies produce blocked, quantity-limited, and settlement-constrained financial decisions with inspectable provenance and reproduction.

The historical SolarPunk / SPK testnet stack remains in the repository as an originating reference implementation. It is not the current top-level product identity.

Policy Lab is **not** a token sale, mainnet launch, stablecoin, legal tender, production decision service, or investment product.

## Before you start

Read:

- [`docs/project/POLICY_LAB_PUBLIC_PACKAGE.md`](./docs/project/POLICY_LAB_PUBLIC_PACKAGE.md) — current public package and review path
- [`README.md`](./README.md) — current research workbench overview
- [`docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md`](./docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md) — semantic authority
- [`PROJECT_RECOVERY.md`](./PROJECT_RECOVERY.md) — authority hierarchy and historical migration boundaries
- [`CURRENT_STATUS.md`](./CURRENT_STATUS.md) — current operating/validation state

## Useful contribution types

| Goal | Start here |
|---|---|
| Reproduce the deterministic core | `node --test packages/constraint-core/test/*.test.mjs` |
| Review / reproduce the public Ausgrid case | [`POLICY_LAB_G4_EVALUATOR_BRIEF.md`](./docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md) |
| Report a reproduction failure | **Research replication** issue template |
| Submit a structured external evaluation | **Policy Lab external evaluation** issue template |
| Discuss attributable outside evidence / pilot fit | **Policy Lab pilot / external case** issue template |
| Improve case-workbench UX or explanation | `frontend/src/cases/`, `frontend/src/compare/`, `frontend/src/receipts/`, platform surfaces |
| Improve deterministic schemas/rules | `packages/constraint-core/`, `protocol/schema/`, `protocol/policies-v2/` |
| Inspect historical SolarPunk/SPK workflows | `docs/product/`, `state/runtime/`, `spk_v1/`, `docs/project/OPEN_LAB_WORKFLOWS.md` |

## Pull-request rules

1. **Preserve claim boundaries.** A code, UI, or documentation change must not promote L0 evidence into stronger provenance, scenario settlement into legal delivery, a receipt into physical truth, or a constrained financial claim into money.
2. **Keep namespaces separate.** R1–R4 research boundaries, CF1–CF9 benchmark families, C0–C4 conformance levels, L0–L4 assurance, and runtime stages are not interchangeable.
3. **Determinism matters.** Changes to decision identity, schemas, rule evaluation, receipts, capsules, or assessment derivation need targeted tests and reproduction rationale.
4. **No broad scope inflation.** Do not add AI decision authority, generic chatbot features, new token economics, mainnet launch behavior, billing, marketplaces, or unrelated infrastructure without a specific evidence-backed reason.
5. **Historical code may remain historical.** Do not mechanically delete or reinterpret older SolarPunk/SPK material merely because current Policy Lab semantics are narrower.
6. **No secrets/private operator data.** Never commit private keys, API tokens, customer-identifying data, signed commercial agreements, or raw private evidence supplied under confidentiality.

## Frontend changes

The current public workbench is broader than the historical `PublicLabLanding.jsx` / SPK console.

Frontend contributions should preserve the central evaluator path:

```text
outside/controlled evidence
→ assurance boundary
→ versioned policy
→ admission
→ quantity / binding attribution
→ settlement stress
→ receipt / lineage / reproduction
→ Constrained Claim Assessment
```

A packaging change is useful when it improves comprehension of that path without enlarging the research claim.

## Issues

Use the structured templates rather than blank issues:

- **Policy Lab external evaluation** — comprehension, criticism, usefulness, or evaluation outcome
- **Research replication** — deterministic result / receipt / capsule / assessment cannot be reproduced
- **Policy Lab pilot / external case** — attributable evidence source, institutional evaluation, or bounded pilot question
- **Bug report** — runtime, interface, deployment, documentation, or test failure
- **Energy data experiment** — historical/specialized energy-source experiment where that template fits

Traffic, stars, page views, internal dry-runs, or self-authored praise do not count as independent validation.

## Testing

At minimum, run the tests relevant to the changed surface.

Core workbench:

```bash
node --test packages/constraint-core/test/*.test.mjs
npm pack --dry-run --prefix packages/constraint-core
```

Frontend:

```bash
cd frontend
npm install
npm run test:run
npm run build
```

Historical Solidity/reference changes should also run the appropriate Hardhat/security suite.

## Citation

If you use Policy Lab in academic or technical work, cite through [`CITATION.cff`](./CITATION.cff).

The citation file currently retains the existing `0.2.0-alpha` release metadata. Do not treat untagged August 2026 packaging commits as a new archived release or DOI until a deliberate release is created.

## License

MIT — see [`LICENSE`](./LICENSE). Code may be forked; project names and marks are not automatic endorsement — see [`TRADEMARK.md`](./TRADEMARK.md).

## Security and privacy

Do not post private keys, production API tokens, personal/customer-identifying energy data, or confidential commercial material in issues or PRs.

When reporting an external evidence case, describe sensitive source material at the minimum level needed to evaluate whether a bounded research path is possible.

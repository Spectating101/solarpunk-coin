# Policy Lab Security

Policy Lab is research software, not a production financial service. Security reports are still welcome because failures in evidence identity, policy binding, quantity limits, settlement separation, or public deployment integrity can undermine the research result.

## Supported surface

The actively supported Policy Lab surface is the one declared in `CURRENT_SURFACE.json`, including:

- the current browser workbench;
- `packages/constraint-core` decision and evidence logic;
- current schemas and versioned policies;
- the outside-data checkpoint and its verification workflow;
- the portable claim-assessment package and verifier;
- the current GitHub Pages deployment chain.

Historical SolarPunk / SPK contracts, testnet deployments, archived workflows, and legacy routes remain inspectable reference material but are not represented as production-supported systems.

## What to report

Examples of useful security reports include:

- evidence or policy tampering that is accepted without an identity change or verifier failure;
- a way to promote source assurance without a separately justified evidence transition;
- a way for caller-supplied quantity to exceed a deterministic binding ceiling;
- a way for settlement state to rewrite an upstream evidence/admission decision;
- receipt, capsule, assessment, or package substitution that passes verification incorrectly;
- a public deployment path that exposes uploaded local evidence unexpectedly;
- cross-site scripting, dependency, build, or supply-chain issues affecting the current workbench;
- secrets accidentally committed to the repository or exposed by the deployment pipeline.

Research disagreement about a policy threshold or financial interpretation is not by itself a security vulnerability. It may still be valuable as an issue or external evaluation.

## Reporting sensitive vulnerabilities

Do **not** publish exploit details, private keys, confidential evidence, or personal/customer data in a public issue.

Preferred reporting order:

1. Use GitHub's private vulnerability reporting / security-advisory mechanism for this repository when it is available to you.
2. If a private GitHub channel is not available, contact the repository maintainer through a private contact method shown on the maintainer's GitHub profile.
3. If no private channel is available, open a minimal public issue stating that you need a private security contact. Do not include reproduction details until a private channel is established.

For non-sensitive bugs, use the normal GitHub issue templates.

## Response process

The maintainer will aim to:

1. acknowledge a credible report;
2. reproduce and classify it against the current supported surface;
3. preserve relevant failing artifacts/tests;
4. fix the defect or narrow the claim/surface if a fix is not justified;
5. add a regression test when the vulnerability is testable;
6. disclose the resolution publicly when doing so does not create avoidable risk.

No fixed response-time SLA is promised for this independently maintained research project.

## Security boundaries

Policy Lab does not claim:

- custody of user funds or reserves;
- legal issuance authority;
- authenticated operator truth from the public Ausgrid checkpoint;
- production oracle finality;
- mainnet readiness;
- that a receipt proves physical delivery;
- that deterministic software eliminates bad policy choices.

The current public Evidence Lab is designed for browser-local processing and should not be used as a confidential-data vault.

## Dependency and CI controls

The repository uses automated tests, secrets scanning, Solidity/security checks for historical contract surfaces, deterministic reproduction checks, and current-surface integrity checks. Passing CI is evidence about the tested revision; it is not a guarantee that the software is free of vulnerabilities.

# Policy Lab Governance and Ownership

## Current ownership

Policy Lab is currently an independently maintained open-source research-software project owned and maintained by **Christopher Ongko** (GitHub: `Spectating101`). The current software citation metadata identifies Christopher Ongko as the author and Yuan Ze University as an academic affiliation.

Yuan Ze University is **not** represented here as the owner, operator, sponsor, validator, or endorser of Policy Lab unless a separate public agreement explicitly says so.

The phrase `Solarpunk Bitcoin Project` in the historical MIT license copyright notice is an originating project label, not a separate legal entity that owns the current Policy Lab workbench. Historical SolarPunk / SPK material remains in the repository for reproducibility and provenance.

Third-party libraries, datasets, standards, and other dependencies retain their own copyright and license terms.

## Decision authority

The maintainer has final decision authority over the current Policy Lab repository, including:

- accepting or rejecting pull requests;
- defining supported/current versus historical/reference surfaces;
- publishing releases;
- changing policies, schemas, or research boundaries;
- responding to security and privacy issues;
- changing this governance model if additional maintainers or an organization are introduced.

Project governance must not be confused with decision authority inside a Policy Lab case. A case decision is produced from declared evidence, context, policy, calculators, and deterministic code; repository-maintainer authority cannot silently rewrite a closed case artifact without producing changed identities or changed source history.

## Source-of-truth hierarchy

For current project state:

1. `CURRENT_SURFACE.json` declares the current machine surface.
2. Executable code, schemas, policies, tests, and workflows define runtime behavior.
3. Current public packaging explains that behavior.
4. Historical Markdown and archived workflows are provenance/reference material, not runtime authority.

This hierarchy is intentional because the repository contains multiple historical research/product eras.

## Contributions

Contributions are accepted through GitHub issues and pull requests. `CONTRIBUTING.md` defines current contribution expectations.

Substantive changes should:

- preserve explicit claim boundaries;
- include tests where behavior or identity semantics change;
- avoid promoting weak evidence through presentation or packaging;
- identify new third-party dependencies and their licenses;
- respect privacy and security boundaries;
- avoid introducing production financial authority without evidence and governance appropriate to that claim.

External contributors retain copyright in their contributions unless another written agreement applies; contributions are accepted under the repository's MIT license.

## Releases

A release is deliberate. Untagged development commits, generated GitHub Pages publication commits, screenshots, competition packages, or CI artifacts do not by themselves constitute a new archived software release.

Release metadata should identify the exact source revision and preserve current non-claims and evidence boundaries.

## Conflicts and changes

If ownership, maintainership, institutional sponsorship, or legal structure changes, this file must be updated before the new relationship is presented publicly.

Material governance changes should occur through an inspectable commit or pull request rather than an undocumented external decision.

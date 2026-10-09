# ADR: maintain reviewed backports while preparing a separate Hardhat 3 migration

Status: proposed maintenance decision, 2026-10-09. No dependency, package type, contract, deployment or publisher is changed by this ADR.

## Observed baseline

At main 6a9e240, package.json declares Hardhat ^2.29.1, ethers ^6.17.0, Node >=22.12 <23, CommonJS configuration and side-effect plugin requires. The lockfile and local dependency tree retain braces 3.0.3 and elliptic 6.6.1 through development tooling. For example, hardhat-network-helpers 1.1.2 reaches elliptic through ethereumjs-util/ethereum-cryptography/secp256k1; hardhat-verify 2.1.3 also retains the ethers-v5 signing graph.

Normal offline npm ci successfully ran postinstall and verified all four source-hash-bound patches listed in security/dependency-patches.json. The dated audit handoff reported 23 affected nodes (seven high); those are historical version-level counts. A fresh npm audit attempt here failed with registry DNS EAI_AGAIN. Offline installation's zero-vulnerability message is not a fresh audit or advisory closure.

## Options

| Option | Benefit | Cost / remaining risk |
| --- | --- | --- |
| Maintain pinned, hash-checked backports | Keeps the current tested tooling and permits small consolidation changes | Local mitigation is not upstream version/advisory closure; every version/source-byte change needs review |
| Separate Hardhat 3 migration | Can replace old plugin/dependency graphs after compatibility proof | Configuration/plugin/network/test migration and coverage/gas-reporter compatibility must be assessed; upgrading alone does not prove all advisories disappear |

Hardhat's official migration guide describes incompatible changes including ESM configuration, explicit plugins and network connections, and recommends migration in stages. Its documented minimum Node version is above this repository's declared lower bound; a migration must reconcile engines and CI explicitly. See [official migration guide](https://hardhat.org/docs/migrate-from-hardhat2) and [Node support](https://hardhat.org/docs/reference/nodejs-support), accessed 2026-10-09.

## Proposed decision

Keep the reviewed backports during consolidation. Do not use --ignore-scripts, disable audit gates, override incompatible major transitive versions blindly, or claim the remaining advisories are closed. Build a separate experimental migration candidate before changing main's toolchain. The decision is bounded to maintenance and does not endorse historical contracts for production use.

## Migration acceptance and backport removal

1. Inventory all Hardhat/config/plugin/script/test consumers, including CommonJS scripts, network connection assumptions, ABI/artifact readers, coverage and gas reporting.
2. Select compatible pinned plugin versions using current primary documentation; map every old consumer to its replacement. Keep the current compiler/optimizer/viaIR choices unless independently justified.
3. Reproduce all 122 current Solidity tests and signature/collateral/migration invariants; check artifact/ABI equivalence and all Policy Lab core/frontend/Node/Python and visual guards. No live-chain execution.
4. Fresh clean-install audits of root and frontend graphs must identify which advisories disappear and which remain. Remove each backport only when its dependency/source is removed or a verified upstream fix replaces it; test negative controls independently.
5. Require a small reviewable draft PR with hosted CI. No deployment, release, tag, merge or historical publisher activation is part of migration approval.

## Validation limits

Node 22.21.1 was used. The 122 Solidity tests, frontend tests, build, surface/preflight and patch check pass locally for the documentation candidate. Node subprocess/SDK and browser guards are blocked by sandbox EPERM; Python API validation is incomplete. Therefore this environment does not establish the full release gate or migration feasibility. The proposed ADR can be pushed only after the user-required complete guard set is green elsewhere locally.

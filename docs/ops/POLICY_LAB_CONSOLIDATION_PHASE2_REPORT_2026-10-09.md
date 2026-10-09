# Policy Lab Phase 2 progress and gated Stop 2 review — 2026-10-09

Publication is blocked; Phase 2 is not complete. Eight separate candidate branches are prepared locally and preserved as an incremental bundle and reviewable patches. No new PR was opened or branch pushed, because the user-required complete local guard set is not green. Phase 3 has not started.

## Existing coordinator work — verified, not redone

| PR | Contents | Observed hosted runs |
| --- | --- | --- |
| [#75](https://github.com/Spectating101/solarpunk-coin/pull/75) docs: Policy Lab consolidation handoff, inventory and five-case wording | Coordinator-created draft; head be9bdcf88eabbcea9fec854699157c5ce5bee452 | 7 observed workflows completed successfully; details in artifacts/policy-lab-consolidation-phase2-2026-10-09/existing-pr-ci.json |
| [#76](https://github.com/Spectating101/solarpunk-coin/pull/76) chore: use an obvious placeholder for NASA_API_KEY in .env.oracle | Coordinator-created draft; head 7a9f20006ae26c5c360016cb00165b9820eb951d | 4 observed workflows completed successfully; details in artifacts/policy-lab-consolidation-phase2-2026-10-09/existing-pr-ci.json |

No merge or PR edit was performed. PR #75 already contains the handoff, inventory and five-case wording; PR #76 already replaces the NASA stub. Root env scan found no credential-shaped private/NASA key or Slack webhook, and no value was printed. Other config values were not rewritten; the coordinator instruction says not to redo #76.

## Prepared candidates — no new PR numbers / hosted CI

| Candidate / branch | Local head | Contains | Validation / limits |
| --- | --- | --- | --- |
| documentation / chore/policy-lab-docs-archive-index | f6d3b5b6945843f32ea493d884305f3b7d14cc57 | DOCS link and preserved archive index; no historical records moved/deleted. | Full guard attempt: surface/preflight, frontend, 122 Solidity tests, build and patch check pass; subprocess/browser/Python gates blocked. |
| mcp / salvage/policy-lab-mcp-adapter | 695480adb783ea089d0c7dcc6710d4b2aa909e25 | PR #73 adapter/manifest/pinned read-only workflow, direct parity/input-bound test and README. | Native capsule suite and three negative-parity cases pass; malformed/oversized inputs rejected. Pinned runner source inspected. Actual MCP discovery/transport pending: MCP dependencies unavailable. |
| gauntlet / salvage/policy-lab-specialized-gauntlet | fac4bd1925942b3069a1e5946253c3efaa4bb48c | PR #65 manifests/runner/external contracts and dated explanatory docs; source-provenance state downgraded to open. No trusted attestation workflow. | Six machine challenges pass; protocol contract passes; UTC/Taipei and partial-output retry reproduce; non-promotion tests pass. |
| engineering / fix/policy-lab-release-engineering | a63b6cd10fe69bdf98aa306dedfb3d6511187534 | PR #70 production frontend audit gate plus adapted current-source inventory and fail-closed regression. Retains stronger existing SDK/archive checks. | Deterministic inventory, independent App hash, invalid SHA, missing-source and symlink refusal tests pass. Fresh registry audit cannot run: EAI_AGAIN. |
| backend / fix/policy-lab-historical-reference-backend | 09b31d23c9678c1c49e8339ad4329c127c2e11a7 | Standalone ff44da4 salvage with historical-reference note. No Policy Lab authority or deployment claim. | 3 SQLite quota + 9 core/advanced model + 8 SPK health/runtime tests pass. Full HTTP suites time out; gate incomplete. |
| dependency / docs/policy-lab-dependency-adr | e4d4d98bbb8be14fa498f1953617a77226b178be | Proposed ADR with observed graph and official migration references; recommends bounded backport maintenance until independent migration proof. | Four postinstall patch hashes verify; dependency graph inspected; fresh audit DNS-failed. No migration feasibility claim. |
| release / docs/policy-lab-release-prose | 7613cc68506ada3f3778c47593449cac65d5c033 | Git-backed unreleased prose and maintainer-confirmation disclosure; no binary deletion or other-project claims. | Referenced main commits/tag presence inspected; disclosure intentionally remains unconfirmed. |
| ci / chore/policy-lab-ci-hygiene | 923eab7f31d19b157b826f1f2d0fbdcee70f7c97 | Assessment defers optional cross-browser job until local browser guards can run; no weakened guard or workflow activation. | Current workflow scripts/path filters inspected; new candidates cannot be published under failed local gate. |

All eight latest tips pass surface, preflight and diff-whitespace checks. These checks do not replace the full gate. No frontend source/style, contract, canonical case/policy/schema semantics, CURRENT_SURFACE.json or its checker changed. Optional MCP and validation utilities do not replace the declared primary runtime/deployment surface. Controlled cases remain non-empirical, Ausgrid actual L0 and R4 UNTESTED. Source-holder verification remains open.

## Environment blockers and guard evidence

Original checkout is clean before the report; its Git common directory is outside writable roots. Creating a branch failed with read-only index.lock. To preserve original refs/worktrees, candidates live in an isolated repository under /tmp/policy-lab-phase2-20261009 and separate isolated worktrees under /tmp/policy-lab-phase2-candidates. These are not registered in the original repository. Node 22.21.1 was used; rtk was unavailable, so ordinary shell commands were used as the latest instruction permits.

Normal offline root/frontend npm ci succeeded using a copied local cache and ran the required postinstall. The first complete guard attempt exposed subprocess/runtime limitations. A second full attempt recorded all required JS/visual and Python suite categories. Surface/preflight, frontend tests, 122 Solidity tests, build and all four patch hashes passed. Core and Node suites have child-output failures; SDK spawnSync reports EPERM despite child status zero. Preview listen on 127.0.0.1:4173 and Chromium socket setup are denied with EPERM; all four visual guards fail before meaningful page evaluation. The HTTP suites timed out, so their results are incomplete. The initial derivatives interpreter lacked NumPy; corrected scientific-environment focused tests passed, but its full HTTP suite also timed out. Do not attribute that timeout to a specific product defect without further evidence.

Fresh npm audit failed with registry DNS EAI_AGAIN. Offline install output is not fresh audit evidence. The pinned MCP runner source was retrieved and inspected without modifying Cite-Refinery; real MCP discovery/transport testing remains unrun because mcp/jsonschema dependencies are unavailable locally. No sandbox restriction or required guard was bypassed, and no failed guard was marked green. Evidence logs/results are in the artifact directory.

## Portable review and resumption

Artifacts: artifacts/policy-lab-consolidation-phase2-2026-10-09/ contains phase2-candidates.bundle, eight format-patches, prepared draft descriptions, candidates.json, existing PR CI details and local logs. The incremental bundle requires main 6a9e2403ce3d0a799ee9505959fc4860b43f2ea2 and was verified against the original repository. It contains only the eight candidate ref histories after that prerequisite; no full unrelated research history or environment-value dump was added.

The coordinator can inspect git bundle list-heads, import selected candidate refs into a writable local checkout, run every required guard for each candidate, then push feature branches and open drafts with the prepared descriptions. Those steps remain authorized Phase 2 work; no reapproval of the already-approved plan is needed. Preserve existing #75/#76 and the source branches. Do not merge or use force-push. An independent local test runner with writable Git metadata, subprocess pipes, loopback/browser support, scientific test dependencies and the pinned MCP dependencies is needed to complete publication.

## Proposed Phase 3 exact-list review — nothing authorized or executed

Every destructive step needs a fresh verified backup, recorded/rechecked full tips, a final dirty-worktree inspection, and explicit approval of the exact list. Existing draft candidates remain unmerged; do not delete any source needed for incomplete salvage. This report adds no tags and takes no destructive action.

### A. Remote refs with recorded on-main evidence (candidate deletion list)

| Remote branch | Recorded tip | Proposed action / gate | Reason per item |
| --- | --- | --- | --- |
| origin/agent/case-workbench-v2 | 0b4488469adf039cbf68d1076615eb334dd9ff43 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/agent/decision-brief | f20154dbaa95e93861f658f2c8ca63f999170929 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/agent/flagship-decision-experience | 151dfc75783416c3e3f29efcdf62a0adb7ff75dd | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/docs/external-review-adoption-operating-kit | 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6 | Delete remote ref only after fresh backup, tip recheck and exact approval. | All branch merge-base change paths were tip-identical on main; cherry evidence in inventory, residual review before approval. |
| origin/docs/p1-claim-evidence-freeze | 8706052880b3538e6375655e444dc8b5082de50f | Delete remote ref only after fresh backup, tip recheck and exact approval. | All branch merge-base change paths were tip-identical on main; cherry evidence in inventory, residual review before approval. |
| origin/docs/policy-lab-four-boundary-reconciliation | bcc1b18bb61129c55e109fb592e2e620672c5657 | Delete remote ref only after fresh backup, tip recheck and exact approval. | All branch merge-base change paths were tip-identical on main; cherry evidence in inventory, residual review before approval. |
| origin/feat/external-case-001-intake-kit | b3a7e0feb752c732cb74fde3c3803b457fe05393 | Delete remote ref only after fresh backup, tip recheck and exact approval. | All branch merge-base change paths were tip-identical on main; cherry evidence in inventory, residual review before approval. |
| origin/feat/gauntlet-simulation-v1 | caa2cd3e73fa3d5686f0b45866a1f21174a99c74 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/package/policy-lab-claim-boundary-20260918 | 1d2d17199ddec32d8bc2254fa546386abd355c01 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/package/policy-lab-new-case-20260919 | 655c51e288f1e3914b820e0ca2f99965da275fc4 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-deploy-curation | 17622bb54b0bb9f8e32d420408ee99c5c00e5a35 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-dpg-readiness | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-dpg-readiness-v2 | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-dpg-readiness-v3 | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-dpg-readiness-v4 | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-dpg-status-sync | e93584cdadfcf57f2cff45cf6ee4bcddd9a4dc05 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-gauntlet-submission-readiness | 9e4b348e9c9784e6b01933273e1f25d6734bc68e | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-innoserve-2026 | fd189cbd92f4581b7c0da3396240fbdffdf979c8 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-innoserve-packaging-finalize | 2eca4c36d84adf51ed4ea2cf2fb5c9882f02a616 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-opportunity-pack-2026-08-25 | 7d325f755ca3e33333e7e35314a622014c5c5d12 | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-root-archive | 5f54966cae3361fdc901b7776a6571cd0eced29f | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/policy-lab-source-truth-curation | f5351f7db28dd2cae1f855250a055fa1f2a6d91d | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/submission/innoserve-2026-rc1 | 5a462bcbd8d085e8dfd977e2de6afe953673113e | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |
| origin/ui/visual-assessment-2026-10-06 | c8ba12073cc3fb8416dc6f30f8866c4d025bb32b | Delete remote ref only after fresh backup, tip recheck and exact approval. | Ancestor of main (no unique commits). |

### B. Superseded-source review queue — HOLD, not a deletion list yet

These 32 refs have unique or non-equivalent patch/path evidence. The inventory records their residual paths. All require a per-path disposition and backup/archive preservation before any exact deletion request; no blanket deletion is proposed.

| Remote branch | Recorded tip | Gate | Recorded rationale (inference) |
| --- | --- | --- | --- |
| origin/feat/policy-lab-mcp-v0 | 6bdb11736664b108f300eb6e3b93ed168008f52e | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Broader MCP operations/agent-evaluation research remains distinct; prefer small #73 adapter; preserve schemas/negative-control designs for later review, no provider calls. |
| origin/audit/policy-lab-certification-20260910 | 41efe6a71d13d4460b758cc8daaec34986f5019e | HOLD: no deletion before residual review and explicit archived preservation. | Inference: PR #70 explicitly supersedes #64; compare smoke isolation, triggering revision and selectors with repaired main before archive. |
| origin/case/public-external-001p-ausgrid | e566b8120316c4600eee97e9454d3bd40d52dbd4 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/docs/consolidate-program-packaging | 038c6c26a181962ca0e0d7cb87e1f59bcddf4fbf | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/docs/field-validation-freeze | c253b4137a26b9483a50add9d32303f80059cf14 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/docs/submission-packaging-calendar | 39b7f152738e4afc9b68367a302fd53e800bbfcb | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/capsule-verifier | 606348766e73b7270f43184c2d06931738d3c482 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/capsule-verifier-v2 | 3e163eb8aaf54a06d624e5981d8e770c678f4e2e | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/conformance-benchmark-v1-cf-c0-c2 | 0ff3359f9c82c58edc7ebcceb2b3fadf97a96702 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/constrained-claim-assessment-g4 | 315ef05af6914ec5849baa104ccc307f17fc4d77 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/constraint-protocol-alpha | b7a15e4be2f5e1fff72175121f1ccd75464677c9 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/feat/operator-custody-intake | 9cc1377e26b3a4e3f774303b13c705fbe4f5fc1b | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/feat/policy-lab-frontend-convergence-checkpoint | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. |
| origin/feat/policy-lab-frontend-convergence-final | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. |
| origin/feat/policy-lab-frontend-convergence-r1 | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. |
| origin/feat/policy-lab-frontend-convergence-v2 | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. |
| origin/fix/constraint-release-links | 0565ce15d84daa61b3c7366b19e1a5b15083cfbd | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/fix/constraint-release-links-copy | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/fix/policy-live-smoke-bootstrap-20260917 | 03e331c06f03eab3dae01715983d2ac244b19674 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-assessment-package-recovery | f3171a5becfb5a382c3ecc4a841c121c10d14a62 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-dpg-readiness-final | f8f8c6fa5e93bea1661cf29078502c5e5c400955 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-identity-curation | 54b8852c2547ab4747af41c67294368903886d5b | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-live-validation-v1 | b5cabcccb688f586786442373c6af9f1a67c380d | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-packaging-v1 | 8a560ba6c5c772561cf57e367c86c94e06b26d18 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/policy-lab-post-deploy-smoke | 8bae6ecf4c05ac229b9395ad429e988c63740426 | HOLD: no deletion before residual review and explicit archived preservation. | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. |
| origin/release/constraint-public-alpha | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-final | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-hotfix | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-merge | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-r1 | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-ready | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |
| origin/release/constraint-public-alpha-v2 | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | HOLD: no deletion before residual review and explicit archived preservation. | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. |

### C. Local branch candidates

| Local branch | Recorded tip | Proposed action / reason |
| --- | --- | --- |
| field-ready-alpha | c32a4840eac19b9b5775cc7c08b9cab8dc4827bb | Candidate deletion after backup/tip recheck: ancestor of main; no unique commit. |
| fix/repository-audit-2026-10-05 | 998b9f3d8f71bd01a1fc4a753c454d9509159fba | Candidate deletion after backup/tip recheck: audit repairs are ancestral to main via #74. |
| ui/visual-assessment-2026-10-06 | c8ba12073cc3fb8416dc6f30f8866c4d025bb32b | Candidate deletion only after its clean audit-repairs worktree is separately approved for removal; tip is on main. |
| fix/backend-followup-2026-10-05 | ff44da42fa0c6df761a86d8c6859ec285d23421f | HOLD until separate historical-reference salvage is reviewed and safely retained/landed. |
| package/policy-lab-release-v0.2.0 | 751da540f45666306359c19a39d0578b8f10a9cb | HOLD until prose salvage accepted and excluded binary-deletion intent explicitly archived. |

Keep grok despite its ancestral commit because the worktree has dirty evidence. Keep paired-platform/frontend candidates deferred, ci/add-claude-github-app optional/unlanded, thesis and Norway preserved, and all other-project branches untouched. Keep #75/#76 and all new isolated candidates.

### D. PR closure candidates — conditional, no closure performed

| PR | Proposed future closure condition / reason |
| --- | --- |
| #64 | After certifier residual review: #70 explicitly superseded the older certification context; current main has independent later repairs. |
| #71 | Only after its rehearsal/evidence links and exact source tip are archived; it explicitly says DO NOT MERGE and duplicates #70 source. |
| #73 | Only when the new native-adapter draft has complete local/hosted proof and supersession is recorded; until then retain the source PR. |
| #65 | Only when the new non-attesting Gauntlet draft preserves its selected unique work and documents excluded release-attestation material. |
| #70 | Only after engineering salvage is validated and deferred Browser/Gauntlet/attestation material is explicitly preserved; otherwise retain. |

Keep #66 open/deferred unless the user separately chooses archival of frontend work. Keep issues #29–#33 open: external cases, independent review and adoption are not completed by software cleanup. Keep #67–#69/#72 outside scope.

### E. Original worktree/registration candidates

| Exact original path | Recorded HEAD | Proposed action / reason / gate |
| --- | --- | --- |
| /home/phyrexian/.cache/tmp/solarpunk-audit-20261005-nukmy6qd/repo | c194a4f05e2f84b971a8fdf756ae02856dc3b1d9 | Remove only after fresh clean-status and evidence check; detached audit baseline is ancestral, not unique committed code. |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/solarpunk-audit-repairs | c8ba12073cc3fb8416dc6f30f8866c4d025bb32b | Remove only after fresh clean-status/evidence backup and branch approval; repairs are on main. |
| /tmp/solarpunk-public-main | 655c51e288f1e3914b820e0ca2f99965da275fc4 | Remove only this missing/prunable registration after explicit approval; do not delete or reset the main branch. |
| /home/phyrexian/.cache/tmp/claude-1000/-home-phyrexian-Downloads-llm-automation-project-portfolio-Molina-Optiplex-Sharpe-Renaissance-drive/4d2be1ca-4f01-4567-b0f4-aebd77896764/scratchpad/spk-wf | 9d781825d4566294ce9dbe2ba973cfe3c23ba87c | Remove only this missing/prunable registration after explicit approval; preserve the unique optional ci/add-claude-github-app branch. |

All other original worktrees are preserved, especially dirty main/field-validation/operator/public-lab/grok, deferred paired-platform, source backend/release and the active consolidation checkout. New isolated candidate worktrees are preserved; no removal requested while publication is blocked.

## Exact questions / next decisions

1. Which compatible local execution environment should the coordinator use to run the blocked guards and publish these already-authorized eight draft candidates? This is missing execution capability, not a request to relax the local-test gate.

2. Accept the proposed bounded backport-maintenance ADR while a separate Hardhat 3 migration is evaluated, or prefer a migration feasibility experiment before landing the ADR?

3. Can the maintainer confirm/correct the draft AI-assistance account before any external use? No exact model/date or universal human-review claim was invented.

4. After full Phase 2 validation, which exact items in cleanup groups A/C/D/E should be approved or kept? Group B remains HOLD pending residual review. This question is for a later destructive decision; elapsed time or Phase 2 approval is not Phase 3 approval.

STOP: no new draft publication under failed guards, no Phase 3 action. Phase 2 requires the compatible local runner before it can be marked complete.

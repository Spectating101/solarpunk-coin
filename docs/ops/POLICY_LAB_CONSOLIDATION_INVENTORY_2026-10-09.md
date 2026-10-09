# Policy Lab consolidation inventory — 2026-10-09

Phase 0 only. STOP 1. Only this file written; no fetch, commit, push, merge, branch/worktree/PR/issue modification, tag, publish, deploy or credential change. Recommendations are not authorization.

## Baseline and method

origin/main = 6a9e2403ce3d0a799ee9505959fc4860b43f2ea2; local main = 655c51e288f1e3914b820e0ca2f99965da275fc4; operator HEAD = e75d5f350d74d02461596b4b6568946aa0f55388. Operator includes the existing handoff commit above 6a9e240. All comparisons use origin/main; local main is stale.

Read full handoff first, then AGENTS.md/CURRENT_SURFACE.json. Surface check passed: five controlled cases, outside Ausgrid L0. AGENTS.md four-case wording stale. Controlled cases non-empirical; R4 UNTESTED; source-holder review not completed. No release/preflight claim: preflight/build/visual suites not run because they can generate files beyond the one-file Phase 0 allowance.

rtk unavailable: shell commands prefixed through a transparent rtk function. Inventory nested read-only Git subprocesses use GIT_OPTIONAL_LOCKS=0. gh API network failed; read-only GitHub connector verified specified ten PRs and five issues, with no local content uploaded. Remote branch list is local remote-tracking snapshot; no fetch, live freshness beyond PR heads unverified.

Per ref: git cherry origin/main REF; git diff --stat origin/main...REF; rev-list ahead/behind; merge-base path overlap with main-since-base changes; tip blob/presence comparisons for every changed path. Dates are committer timestamps. Cherry excludes merges and is not semantic equivalence; triple-dot is branch change since merge base. Equal paths establish only the stated file criterion, not runtime correctness. Scope/value/actions are inferences from paths and PR descriptions. Superseded means residual review required, never all-on-main by assumption. Full stats, cherry hashes and path partitions follow.

## Branches — priority candidates first

| Object | Scope (inference) | Tip | Last commit / update | Ahead/behind origin/main | On-main evidence | Unique value / rationale | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| remote origin/feat/policy-lab-release-integration | policy-lab | 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c | 2026-09-15T20:24:19+08:00 | +105/-21 | Full equivalence NOT established; cherry +105/-0; triple-dot 37 paths; main overlap 9; equal 0, absent 25, differing 12 | Inference: Extract #70 SDK pack directory fix, production audit, source closure/certifier hardening only after comparison with repaired main; exclude Browser/UI and trusted attestation activation. #71 proof-only. | salvage-in-PR |
| remote origin/feat/policy-lab-frontend-convergence | policy-lab | f1793b2d7cb7a47c771e2483d703d74b05227bbb | 2026-09-12T01:57:52+08:00 | +92/-21 | Full equivalence NOT established; cherry +92/-0; triple-dot 31 paths; main overlap 3; equal 0, absent 25, differing 6 | Inference: Deferred Research Browser/Explorer UI; review inherited Gauntlet via #65. | keep-local |
| remote origin/feat/policy-lab-specialized-gauntlet | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00 | +20/-21 | Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Specialized Gauntlet runner, policy assumptions, C3/C4 gap map, external closure protocols; defer main-only trusted attestation. | salvage-in-PR |
| remote origin/feat/policy-lab-mcp-v0 | policy-lab | 6bdb11736664b108f300eb6e3b93ed168008f52e | 2026-08-18T23:48:52+08:00 | +49/-163 | Full equivalence NOT established; cherry +49/-0; triple-dot 18 paths; main overlap 0; equal 0, absent 18, differing 0 | Inference: Broader MCP operations/agent-evaluation research remains distinct; prefer small #73 adapter; preserve schemas/negative-control designs for later review, no provider calls. | supersede-and-archive |
| remote origin/integration/portfolio-mcp-v1 | policy-lab | b4cfb025c77d25ef470859fbffe4945387cea812 | 2026-09-18T03:56:12+08:00 | +3/-21 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 0; equal 0, absent 3, differing 0 | Inference: Three-file native capsule verifier bridge, manifest and discovery/parity CI; inspect pinned external runner without modifying other project. | salvage-in-PR |
| remote origin/audit/policy-lab-certification-20260910 | policy-lab | 41efe6a71d13d4460b758cc8daaec34986f5019e | 2026-09-10T02:56:52+08:00 | +6/-21 | Full equivalence NOT established; cherry +5/-1; triple-dot 3 paths; main overlap 3; equal 0, absent 0, differing 3 | Inference: PR #70 explicitly supersedes #64; compare smoke isolation, triggering revision and selectors with repaired main before archive. | supersede-and-archive |
| local-only feat/paired-platform-shell | policy-lab | dd484678907820c8ad1c31f6d0358bfa9de3ab1a | 2026-08-06T03:19:54+08:00 | +33/-195 | Full equivalence NOT established; cherry +33/-0; triple-dot 25 paths; main overlap 25; equal 5, absent 0, differing 20 | Inference: Deferred paired-platform hubs/routes/captures. | keep-local |
| local-only fix/backend-followup-2026-10-05 | policy-lab | ff44da42fa0c6df761a86d8c6859ec285d23421f | 2026-10-05T22:46:16+08:00 | +1/-6 | Full equivalence NOT established; cherry +1/-0; triple-dot 16 paths; main overlap 0; equal 0, absent 4, differing 12 | Inference: Health/export/shared-quota/pricing-unit fixes in historical reference backends; confirm Policy Lab scope. | salvage-in-PR |
| local-only package/policy-lab-release-v0.2.0 | policy-lab | 751da540f45666306359c19a39d0578b8f10a9cb | 2026-09-30T20:06:39+08:00 | +1/-8 | Full equivalence NOT established; cherry +1/-0; triple-dot 5 paths; main overlap 0; equal 0, absent 2, differing 3 | Inference: Review changelog and AI disclosure; exclude three binary deletions, tagging and publishing. | salvage-in-PR |
| remote origin/agent/case-workbench-v2 | policy-lab | 0b4488469adf039cbf68d1076615eb334dd9ff43 | 2026-07-15T18:44:04+08:00 | +0/-234 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/agent/case-workspace-polish | policy-lab | 140ed4d04153edc5b654ae816f20ce21e2656833 | 2026-07-20T18:14:35+08:00 | +10/-215 | Full equivalence NOT established; cherry +10/-0; triple-dot 7 paths; main overlap 7; equal 2, absent 0, differing 5 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/agent/decision-brief | policy-lab | f20154dbaa95e93861f658f2c8ca63f999170929 | 2026-07-14T23:16:05+08:00 | +0/-355 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/agent/flagship-decision-experience | policy-lab | 151dfc75783416c3e3f29efcdf62a0adb7ff75dd | 2026-07-20T22:40:15+08:00 | +0/-202 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/agent/flagship-public-lab-foundation | policy-lab | 80498fc63109f450d657b0d1a42deda1acada21a | 2026-07-20T03:29:43+08:00 | +43/-230 | Full equivalence NOT established; cherry +43/-0; triple-dot 23 paths; main overlap 23; equal 5, absent 0, differing 18 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/agent/studies-proof-layer | policy-lab | 1c7106bf2a22f0b84109d2d7fb46d39770eca0f1 | 2026-07-20T18:39:01+08:00 | +6/-212 | Full equivalence NOT established; cherry +6/-0; triple-dot 5 paths; main overlap 5; equal 1, absent 0, differing 4 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/case/public-external-001p-ausgrid | policy-lab | e566b8120316c4600eee97e9454d3bd40d52dbd4 | 2026-08-15T03:23:26+08:00 | +7/-183 | Full equivalence NOT established; cherry +7/-0; triple-dot 2 paths; main overlap 2; equal 0, absent 0, differing 2 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/design/policy-lab-external-packaging | policy-lab | 935747b82162935585fe9dd8c8851f3563fe4624 | 2026-08-18T03:17:13+08:00 | +20/-163 | Full equivalence NOT established; cherry +20/-0; triple-dot 8 paths; main overlap 5; equal 4, absent 3, differing 1 | Inference: Review absent candidate paths individually: docs/product/POLICY_LAB_EXTERNAL_PACKAGING_ARCHITECTURE.md, docs/product/POLICY_LAB_P0_PACKAGING_AUDIT.md, docs/product/POLICY_LAB_PACKAGING_DECISION.md. Absence does not prove value. | salvage-in-PR |
| remote origin/digital-tax/archive-metadata-20260915 | other-project | aa7167c45d8e0a38f3c8ce6f31b7a0bad078825b | 2026-09-15T18:29:36+08:00 | +58/-21 | Full equivalence NOT established; cherry +58/-0; triple-dot 45 paths; main overlap 0; equal 0, absent 44, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/digital-tax/rebuild-2026 | other-project | 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd | 2026-09-14T20:16:02+08:00 | +52/-21 | Full equivalence NOT established; cherry +52/-0; triple-dot 41 paths; main overlap 0; equal 0, absent 40, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/docs/consolidate-program-packaging | policy-lab | 038c6c26a181962ca0e0d7cb87e1f59bcddf4fbf | 2026-08-04T16:11:14+08:00 | +3/-197 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 3; equal 2, absent 0, differing 1 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/docs/external-review-adoption-operating-kit | policy-lab | 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6 | 2026-08-07T04:49:19+08:00 | +6/-189 | YES changed-path tip equality; cherry +6/-0; triple-dot 6 paths; main overlap 6; equal 6, absent 0, differing 0 | Inference: Every changed path has equal tip blobs/presence on main. | already-on-main |
| remote origin/docs/field-validation-freeze | policy-lab | c253b4137a26b9483a50add9d32303f80059cf14 | 2026-07-20T16:37:17+08:00 | +6/-222 | Full equivalence NOT established; cherry +6/-0; triple-dot 4 paths; main overlap 4; equal 3, absent 0, differing 1 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/docs/p1-claim-evidence-freeze | policy-lab | 8706052880b3538e6375655e444dc8b5082de50f | 2026-08-07T04:55:07+08:00 | +4/-188 | YES changed-path tip equality; cherry +4/-0; triple-dot 4 paths; main overlap 4; equal 4, absent 0, differing 0 | Inference: Every changed path has equal tip blobs/presence on main. | already-on-main |
| remote origin/docs/policy-lab-four-boundary-reconciliation | policy-lab | bcc1b18bb61129c55e109fb592e2e620672c5657 | 2026-08-14T01:32:07+08:00 | +2/-187 | YES changed-path tip equality; cherry +2/-0; triple-dot 2 paths; main overlap 2; equal 2, absent 0, differing 0 | Inference: Every changed path has equal tip blobs/presence on main. | already-on-main |
| remote origin/docs/submission-packaging-calendar | policy-lab | 39b7f152738e4afc9b68367a302fd53e800bbfcb | 2026-08-07T04:29:49+08:00 | +20/-195 | Full equivalence NOT established; cherry +20/-0; triple-dot 17 paths; main overlap 17; equal 14, absent 0, differing 3 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/capsule-verifier | policy-lab | 606348766e73b7270f43184c2d06931738d3c482 | 2026-07-20T14:58:19+08:00 | +5/-228 | Full equivalence NOT established; cherry +5/-0; triple-dot 6 paths; main overlap 6; equal 2, absent 0, differing 4 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/capsule-verifier-v2 | policy-lab | 3e163eb8aaf54a06d624e5981d8e770c678f4e2e | 2026-07-20T15:21:37+08:00 | +3/-226 | Full equivalence NOT established; cherry +3/-0; triple-dot 6 paths; main overlap 6; equal 2, absent 0, differing 4 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/conformance-benchmark-v1-c0-c2 | policy-lab | b40b9c349169397fbefb41a00b0969d3a3ebfd90 | 2026-08-07T04:44:10+08:00 | +8/-189 | Full equivalence NOT established; cherry +8/-0; triple-dot 7 paths; main overlap 6; equal 2, absent 1, differing 4 | Inference: Review absent candidate paths individually: benchmark/README.md. Absence does not prove value. | salvage-in-PR |
| remote origin/feat/conformance-benchmark-v1-cf-c0-c2 | policy-lab | 0ff3359f9c82c58edc7ebcceb2b3fadf97a96702 | 2026-08-14T03:36:52+08:00 | +5/-185 | Full equivalence NOT established; cherry +5/-0; triple-dot 7 paths; main overlap 7; equal 6, absent 0, differing 1 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/constrained-claim-assessment-g4 | policy-lab | 315ef05af6914ec5849baa104ccc307f17fc4d77 | 2026-08-16T02:03:30+08:00 | +18/-179 | Full equivalence NOT established; cherry +18/-0; triple-dot 11 paths; main overlap 11; equal 9, absent 0, differing 2 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/constraint-protocol-alpha | policy-lab | b7a15e4be2f5e1fff72175121f1ccd75464677c9 | 2026-07-13T21:12:04+08:00 | +47/-387 | Full equivalence NOT established; cherry +47/-0; triple-dot 95 paths; main overlap 94; equal 66, absent 1, differing 28 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/feat/external-case-001-intake-kit | policy-lab | b3a7e0feb752c732cb74fde3c3803b457fe05393 | 2026-08-06T03:54:38+08:00 | +8/-192 | YES changed-path tip equality; cherry +8/-0; triple-dot 8 paths; main overlap 8; equal 8, absent 0, differing 0 | Inference: Every changed path has equal tip blobs/presence on main. | already-on-main |
| remote origin/feat/flagship-polish-v03 | policy-lab | 4a424817412901ab9d4f706f191a681558df10c3 | 2026-07-20T17:34:05+08:00 | +25/-220 | Full equivalence NOT established; cherry +25/-0; triple-dot 17 paths; main overlap 17; equal 2, absent 0, differing 15 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/feat/gauntlet-simulation-v1 | policy-lab | caa2cd3e73fa3d5686f0b45866a1f21174a99c74 | 2026-08-17T20:00:26+08:00 | +0/-166 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/feat/operator-custody-intake | policy-lab | 9cc1377e26b3a4e3f774303b13c705fbe4f5fc1b | 2026-07-20T15:51:44+08:00 | +22/-224 | Full equivalence NOT established; cherry +22/-0; triple-dot 20 paths; main overlap 20; equal 15, absent 0, differing 5 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/feat/operator-evidence-pilot | policy-lab | 24f61ebed7a9df4f9d818b7cefabb345d815c571 | 2026-07-20T15:10:58+08:00 | +18/-228 | Full equivalence NOT established; cherry +18/-0; triple-dot 14 paths; main overlap 14; equal 7, absent 0, differing 7 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/feat/policy-lab-frontend-convergence-checkpoint | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00 | +20/-21 | Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. | supersede-and-archive |
| remote origin/feat/policy-lab-frontend-convergence-final | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00 | +20/-21 | Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. | supersede-and-archive |
| remote origin/feat/policy-lab-frontend-convergence-r1 | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00 | +20/-21 | Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. | supersede-and-archive |
| remote origin/feat/policy-lab-frontend-convergence-v2 | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00 | +20/-21 | Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Observed Gauntlet-only predecessor; canonical #65 preferred; preserve tip. | supersede-and-archive |
| remote origin/feat/public-lab-workbench | policy-lab | d9616839a63771653d7c073261a89f8255dee3f1 | 2026-07-20T01:39:39+08:00 | +5/-387 | Full equivalence NOT established; cherry +5/-0; triple-dot 21 paths; main overlap 20; equal 14, absent 1, differing 6 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/fix/constraint-release-links | policy-lab | 0565ce15d84daa61b3c7366b19e1a5b15083cfbd | 2026-07-13T21:30:27+08:00 | +6/-385 | Full equivalence NOT established; cherry +6/-0; triple-dot 5 paths; main overlap 5; equal 3, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/fix/constraint-release-links-copy | policy-lab | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | 2026-07-13T21:19:37+08:00 | +3/-385 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 3; equal 1, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/fix/policy-live-smoke-bootstrap-20260917 | policy-lab | 03e331c06f03eab3dae01715983d2ac244b19674 | 2026-09-17T02:19:02+08:00 | +1/-21 | Full equivalence NOT established; cherry +1/-0; triple-dot 2 paths; main overlap 2; equal 0, absent 0, differing 2 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/global-ai-finance-portal-ready-rc5 | other-project | ceea90be3522956b6f1da10387a2bc637ae70a31 | 2026-08-26T17:47:06+08:00 | +5/-24 | Full equivalence NOT established; cherry +5/-0; triple-dot 5 paths; main overlap 5; equal 5, absent 0, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/humanize-global-ai-finance-submission | other-project | 99470aff47057c1df912d0daa07685c3bb4f3bfb | 2026-08-26T00:40:01+08:00 | +0/-40 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/invisible-ledger/full-capacity-2026 | other-project | 4196984a0d667c5d852429c46f6dc237b7dd4db9 | 2026-09-14T20:16:19+08:00 | +47/-21 | Full equivalence NOT established; cherry +47/-0; triple-dot 29 paths; main overlap 0; equal 0, absent 29, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/invisible-ledger/v2-research-pack | other-project | 5993b815e54ad8eae0e2c0a3cccd222a416664c5 | 2026-09-14T17:35:34+08:00 | +13/-21 | Full equivalence NOT established; cherry +13/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 12, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/package/policy-lab-claim-boundary-20260918 | policy-lab | 1d2d17199ddec32d8bc2254fa546386abd355c01 | 2026-09-18T20:50:50+08:00 | +0/-19 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/package/policy-lab-new-case-20260919 | policy-lab | 655c51e288f1e3914b820e0ca2f99965da275fc4 | 2026-09-19T01:40:52+08:00 | +0/-13 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-assessment-package-recovery | policy-lab | f3171a5becfb5a382c3ecc4a841c121c10d14a62 | 2026-08-25T02:47:14+08:00 | +5/-121 | Full equivalence NOT established; cherry +5/-0; triple-dot 9 paths; main overlap 9; equal 4, absent 0, differing 5 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-deploy-curation | policy-lab | 17622bb54b0bb9f8e32d420408ee99c5c00e5a35 | 2026-08-25T00:06:35+08:00 | +0/-124 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-dpg-readiness | policy-lab | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | 2026-08-25T14:54:06Z | +0/-65 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-dpg-readiness-final | policy-lab | f8f8c6fa5e93bea1661cf29078502c5e5c400955 | 2026-08-25T23:14:38+08:00 | +11/-65 | Full equivalence NOT established; cherry +11/-0; triple-dot 10 paths; main overlap 10; equal 7, absent 0, differing 3 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-dpg-readiness-v2 | policy-lab | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | 2026-08-25T14:54:06Z | +0/-65 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-dpg-readiness-v3 | policy-lab | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | 2026-08-25T14:54:06Z | +0/-65 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-dpg-readiness-v4 | policy-lab | 18bcd9a9c6d744ba514e988aba351b5085dfdde9 | 2026-08-25T14:54:06Z | +0/-65 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-dpg-status-sync | policy-lab | e93584cdadfcf57f2cff45cf6ee4bcddd9a4dc05 | 2026-08-25T23:19:50+08:00 | +0/-61 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-gauntlet-submission-readiness | policy-lab | 9e4b348e9c9784e6b01933273e1f25d6734bc68e | 2026-08-25T18:53:24+08:00 | +0/-104 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-identity-curation | policy-lab | 54b8852c2547ab4747af41c67294368903886d5b | 2026-08-25T03:01:30+08:00 | +15/-119 | Full equivalence NOT established; cherry +15/-0; triple-dot 11 paths; main overlap 11; equal 2, absent 0, differing 9 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-innoserve-2026 | policy-lab | fd189cbd92f4581b7c0da3396240fbdffdf979c8 | 2026-08-25T19:03:23+08:00 | +0/-93 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-innoserve-packaging-finalize | policy-lab | 2eca4c36d84adf51ed4ea2cf2fb5c9882f02a616 | 2026-08-25T20:31:38+08:00 | +0/-87 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-live-validation-v1 | policy-lab | b5cabcccb688f586786442373c6af9f1a67c380d | 2026-08-24T05:06:04+08:00 | +7/-163 | Full equivalence NOT established; cherry +7/-0; triple-dot 7 paths; main overlap 7; equal 5, absent 0, differing 2 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-opportunity-pack-2026-08-25 | policy-lab | 7d325f755ca3e33333e7e35314a622014c5c5d12 | 2026-08-25T22:45:53+08:00 | +0/-67 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-packaging-v1 | policy-lab | 8a560ba6c5c772561cf57e367c86c94e06b26d18 | 2026-08-24T23:44:39+08:00 | +6/-158 | Full equivalence NOT established; cherry +6/-0; triple-dot 6 paths; main overlap 6; equal 5, absent 0, differing 1 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-post-deploy-smoke | policy-lab | 8bae6ecf4c05ac229b9395ad429e988c63740426 | 2026-08-24T16:33:35+08:00 | +1/-161 | Full equivalence NOT established; cherry +0/-1; triple-dot 1 paths; main overlap 1; equal 0, absent 0, differing 1 | Inference: All changed paths exist on main but differ: probable curated replacement (inference); residual review mandatory. | supersede-and-archive |
| remote origin/policy-lab-root-archive | policy-lab | 5f54966cae3361fdc901b7776a6571cd0eced29f | 2026-08-24T19:05:45Z | +0/-117 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/policy-lab-source-truth-curation | policy-lab | f5351f7db28dd2cae1f855250a055fa1f2a6d91d | 2026-08-25T00:00:44+08:00 | +0/-132 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/release/constraint-public-alpha | policy-lab | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | 2026-07-13T21:19:37+08:00 | +3/-385 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 3; equal 1, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-final | policy-lab | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | 2026-07-13T21:20:39+08:00 | +4/-385 | Full equivalence NOT established; cherry +4/-0; triple-dot 4 paths; main overlap 4; equal 2, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-hotfix | policy-lab | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | 2026-07-13T21:19:37+08:00 | +3/-385 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 3; equal 1, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-merge | policy-lab | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | 2026-07-13T21:20:39+08:00 | +4/-385 | Full equivalence NOT established; cherry +4/-0; triple-dot 4 paths; main overlap 4; equal 2, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-r1 | policy-lab | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | 2026-07-13T21:20:39+08:00 | +4/-385 | Full equivalence NOT established; cherry +4/-0; triple-dot 4 paths; main overlap 4; equal 2, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-ready | policy-lab | 12585fffeefbbf24d05e73f14e70ee09b77b4d4f | 2026-07-13T21:20:39+08:00 | +4/-385 | Full equivalence NOT established; cherry +4/-0; triple-dot 4 paths; main overlap 4; equal 2, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/release/constraint-public-alpha-v2 | policy-lab | 7a5211f8fbc55a3a708b6cffd216565fdef109fb | 2026-07-13T21:19:37+08:00 | +3/-385 | Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 3; equal 1, absent 0, differing 2 | Inference: Historical protocol/release machinery; preserve record, never restore legacy publisher/deploy authority. | supersede-and-archive |
| remote origin/research/norway-institutional-evidence | adjacent-research | 84af09f717ba5498859e6dbd187eb0ea70700342 | 2026-08-04T18:21:23+08:00 | +11/-197 | Full equivalence NOT established; cherry +11/-0; triple-dot 10 paths; main overlap 10; equal 9, absent 0, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/research/norway-institutional-evidence-v2 | adjacent-research | d708abb1e0d0710a1165cc731349d757613df6ef | 2026-08-04T18:27:37+08:00 | +10/-196 | Full equivalence NOT established; cherry +10/-0; triple-dot 10 paths; main overlap 10; equal 9, absent 0, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/serious-global-ai-finance-rc4 | other-project | d672569e7701bc4fcb2dbc65a69a3665f896bd2a | 2026-08-26T01:47:48+08:00 | +0/-28 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/submission-capsule-global-ai-finance-2026 | other-project | 9b9fb63b1dd0637082d818debbb1cc9d3fafb232 | 2026-08-25T23:42:48+08:00 | +0/-45 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/submission/innoserve-2026-rc1 | policy-lab | 5a462bcbd8d085e8dfd977e2de6afe953673113e | 2026-08-25T20:34:55+08:00 | +0/-86 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| remote origin/thesis/cleanup-canonical-pdf | adjacent-research | 9c0467c0b9dc617e786c9c8aefbebb1a60d88ded | 2026-09-13T02:30:40+08:00 | +2/-228 | Full equivalence NOT established; cherry +2/-0; triple-dot 58 paths; main overlap 3; equal 0, absent 14, differing 44 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| remote origin/tmp/noop | policy-lab | aaa2b15460e422be075bddd8153cf4e800994960 | 2026-08-05T21:52:46+08:00 | +16/-195 | Full equivalence NOT established; cherry +16/-0; triple-dot 14 paths; main overlap 14; equal 2, absent 0, differing 12 | Inference: Deferred UI/experimental candidate; review non-UI overlap separately. | keep-local |
| remote origin/ui/visual-assessment-2026-10-06 | policy-lab | c8ba12073cc3fb8416dc6f30f8866c4d025bb32b | 2026-10-07T20:31:09+08:00 | +0/-2 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| local-only chore/policy-lab-consolidation | policy-lab | e75d5f350d74d02461596b4b6568946aa0f55388 | 2026-10-09T15:31:34+08:00 | +1/-0 | Full equivalence NOT established; cherry +1/-0; triple-dot 1 paths; main overlap 0; equal 0, absent 1, differing 0 | Inference: Operator handoff/inventory. | keep-local |
| local-only ci/add-claude-github-app | policy-lab | 9d781825d4566294ce9dbe2ba973cfe3c23ba87c | 2026-08-04T18:48:38+08:00 | +1/-200 | Full equivalence NOT established; cherry +1/-0; triple-dot 1 paths; main overlap 0; equal 0, absent 1, differing 0 | Inference: Optional app workflow; activation separate decision. | keep-local |
| local-only field-ready-alpha | policy-lab | c32a4840eac19b9b5775cc7c08b9cab8dc4827bb | 2026-07-20T07:55:24Z | +0/-222 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| local-only fix/repository-audit-2026-10-05 | policy-lab | 998b9f3d8f71bd01a1fc4a753c454d9509159fba | 2026-10-05T22:01:53+08:00 | +0/-6 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| local-only grok/0920-023651-87f8 | policy-lab | adf14372994224c13853d002f7e749a9196f26dd | 2026-09-20T02:02:36+08:00 | +0/-12 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |
| local-only thesis/ceir-boundary-rewrite | adjacent-research | d9e5b243b4e32364535750988daf0f291590f435 | 2026-07-10T23:43:25+08:00 | +0/-387 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |

## Local main baseline (not a local-only candidate)

| Object | Scope (inference) | Tip | Last commit / update | Ahead/behind origin/main | On-main evidence | Unique value / rationale | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| main | policy-lab | 655c51e288f1e3914b820e0ca2f99965da275fc4 | 2026-09-19T01:40:52+08:00 | +0/-13 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: Tip is ancestor of origin/main. | already-on-main |

## PRs

Ten verified open PRs. Handoff “15 open pull requests” combines ten PRs and five issues. Descriptions are historical reported evidence, not rerun CI. #70 stacked; #71 explicitly DO NOT MERGE. No closure performed.

| Object | Scope (inference) | Tip | Last commit / update | Ahead/behind origin/main | On-main evidence | Unique value / rationale | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#64](https://github.com/Spectating101/solarpunk-coin/pull/64) Certify current Policy Lab surface (open; draft=False) | policy-lab | 41efe6a71d13d4460b758cc8daaec34986f5019e | 2026-09-10T02:56:52+08:00; PR update 2026-09-15T09:52:53Z | +6/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +5/-1; triple-dot 3 paths; main overlap 3; equal 0, absent 0, differing 3 | Inference: PR #70 explicitly supersedes #64; compare smoke isolation, triggering revision and selectors with repaired main before archive. | supersede-and-archive |
| [#65](https://github.com/Spectating101/solarpunk-coin/pull/65) Add Policy Lab specialized Gauntlet (open; draft=False) | policy-lab | ea21f25c18a7348116f74f50f03bb6dbd11ed6e5 | 2026-09-10T03:32:52+08:00; PR update 2026-09-09T19:36:06Z | +20/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +20/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 11, differing 1 | Inference: Specialized Gauntlet runner, policy assumptions, C3/C4 gap map, external closure protocols; defer main-only trusted attestation. | salvage-in-PR |
| [#66](https://github.com/Spectating101/solarpunk-coin/pull/66) Make Policy Lab an interactive research explorer and workbench (open; draft=False) | policy-lab | f1793b2d7cb7a47c771e2483d703d74b05227bbb | 2026-09-12T01:57:52+08:00; PR update 2026-09-11T17:57:54Z | +92/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +92/-0; triple-dot 31 paths; main overlap 3; equal 0, absent 25, differing 6 | Inference: Deferred Research Browser/Explorer UI; review inherited Gauntlet via #65. | keep-local |
| [#67](https://github.com/Spectating101/solarpunk-coin/pull/67) Crystallize Fiscal Choke Points publication candidate (open; draft=True) | other-project | 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd | 2026-09-14T20:16:02+08:00; PR update 2026-09-14T12:17:03Z | +52/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +52/-0; triple-dot 41 paths; main overlap 0; equal 0, absent 40, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| [#68](https://github.com/Spectating101/solarpunk-coin/pull/68) Build Invisible Ledger V2 research-control pack (open; draft=True) | other-project | 5993b815e54ad8eae0e2c0a3cccd222a416664c5 | 2026-09-14T17:35:34+08:00; PR update 2026-09-14T09:35:51Z | +13/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +13/-0; triple-dot 12 paths; main overlap 0; equal 0, absent 12, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| [#69](https://github.com/Spectating101/solarpunk-coin/pull/69) Crystallize Invisible Ledger publication candidate (open; draft=True) | other-project | 4196984a0d667c5d852429c46f6dc237b7dd4db9 | 2026-09-14T20:16:19+08:00; PR update 2026-09-14T12:17:22Z | +47/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +47/-0; triple-dot 29 paths; main overlap 0; equal 0, absent 29, differing 0 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| [#70](https://github.com/Spectating101/solarpunk-coin/pull/70) Harden Policy Lab release integration (open; draft=True) | policy-lab | 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c | 2026-09-15T20:24:19+08:00; PR update 2026-09-15T12:28:26Z | +105/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +105/-0; triple-dot 37 paths; main overlap 9; equal 0, absent 25, differing 12 | Inference: Extract #70 SDK pack directory fix, production audit, source closure/certifier hardening only after comparison with repaired main; exclude Browser/UI and trusted attestation activation. #71 proof-only. | salvage-in-PR |
| [#71](https://github.com/Spectating101/solarpunk-coin/pull/71) Policy Lab full-stack release rehearsal (do not merge) (open; draft=True) | policy-lab | 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c | 2026-09-15T20:24:19+08:00; PR update 2026-09-15T12:28:07Z | +105/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +105/-0; triple-dot 37 paths; main overlap 9; equal 0, absent 25, differing 12 | Inference: Extract #70 SDK pack directory fix, production audit, source closure/certifier hardening only after comparison with repaired main; exclude Browser/UI and trusted attestation activation. #71 proof-only. DO NOT MERGE rehearsal. | supersede-and-archive |
| [#72](https://github.com/Spectating101/solarpunk-coin/pull/72) Prepare Fiscal Choke Points archive metadata and Zenodo bundle (open; draft=True) | other-project | aa7167c45d8e0a38f3c8ce6f31b7a0bad078825b | 2026-09-15T18:29:36+08:00; PR update 2026-09-15T10:29:49Z | +58/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +58/-0; triple-dot 45 paths; main overlap 0; equal 0, absent 44, differing 1 | Inference: Adjacent/other-project research; preserve outside engineering consolidation. | out-of-scope |
| [#73](https://github.com/Spectating101/solarpunk-coin/pull/73) Make Policy Lab capsule verification callable through MCP (open; draft=True) | policy-lab | b4cfb025c77d25ef470859fbffe4945387cea812 | 2026-09-18T03:56:12+08:00; PR update 2026-09-17T19:56:22Z | +3/-21 | API head matches local snapshot=True; Full equivalence NOT established; cherry +3/-0; triple-dot 3 paths; main overlap 0; equal 0, absent 3, differing 0 | Inference: Three-file native capsule verifier bridge, manifest and discovery/parity CI; inspect pinned external runner without modifying other project. | salvage-in-PR |

## Issues

All five descriptions directly concern Policy Lab. keep-local means retain the open programme record; issues have no commit date or ahead/behind. Related Git evidence does not establish completion.

| Object | Scope (inference) | Tip | Last commit / update | Ahead/behind origin/main | On-main evidence | Unique value / rationale | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#29](https://github.com/Spectating101/solarpunk-coin/issues/29) Programme control: execute maximum-value maturity gates (open) | policy-lab | N/A issue | N/A commit; updated 2026-09-09T15:39:22Z | N/A issue | Related artifact origin/docs/submission-packaging-calendar at 39b7f152738e4afc9b68367a302fd53e800bbfcb: Full equivalence NOT established; cherry +20/-0; triple-dot 17 paths; main overlap 17; equal 14, absent 0, differing 3 | Inference: retain programme gate, reconcile checklist with executable work; branch presence does not complete external evidence/review/adoption. | keep-local |
| [#30](https://github.com/Spectating101/solarpunk-coin/issues/30) Build Conformance Benchmark v1 (C0–C2) (open) | policy-lab | N/A issue | N/A commit; updated 2026-08-06T20:43:46Z | N/A issue | Related artifact origin/feat/conformance-benchmark-v1-c0-c2 at b40b9c349169397fbefb41a00b0969d3a3ebfd90: Full equivalence NOT established; cherry +8/-0; triple-dot 7 paths; main overlap 6; equal 2, absent 1, differing 4 | Inference: retain programme gate, reconcile checklist with executable work; branch presence does not complete external evidence/review/adoption. | keep-local |
| [#31](https://github.com/Spectating101/solarpunk-coin/issues/31) External Cases 002–003: repeatability and authentication portfolio (open) | policy-lab | N/A issue | N/A commit; updated 2026-08-06T20:30:39Z | N/A issue | Related artifact origin/docs/submission-packaging-calendar at 39b7f152738e4afc9b68367a302fd53e800bbfcb: Full equivalence NOT established; cherry +20/-0; triple-dot 17 paths; main overlap 17; equal 14, absent 0, differing 3 | Inference: retain programme gate, reconcile checklist with executable work; branch presence does not complete external evidence/review/adoption. | keep-local |
| [#32](https://github.com/Spectating101/solarpunk-coin/issues/32) Independent review programme: domain and technical scrutiny (open) | policy-lab | N/A issue | N/A commit; updated 2026-08-06T20:56:06Z | N/A issue | Related artifact origin/docs/external-review-adoption-operating-kit at 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6: YES changed-path tip equality; cherry +6/-0; triple-dot 6 paths; main overlap 6; equal 6, absent 0, differing 0 | Inference: retain programme gate, reconcile checklist with executable work; branch presence does not complete external evidence/review/adoption. | keep-local |
| [#33](https://github.com/Spectating101/solarpunk-coin/issues/33) Institutional adoption and commercialization discovery experiment (open) | policy-lab | N/A issue | N/A commit; updated 2026-08-06T20:56:15Z | N/A issue | Related artifact origin/docs/external-review-adoption-operating-kit at 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6: YES changed-path tip equality; cherry +6/-0; triple-dot 6 paths; main overlap 6; equal 6, absent 0, differing 0 | Inference: retain programme gate, reconcile checklist with executable work; branch presence does not complete external evidence/review/adoption. | keep-local |

## Worktrees

| Object | Scope (inference) | Tip | Last commit / update | Ahead/behind origin/main | On-main evidence | Unique value / rationale | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin (thesis/cleanup-canonical-pdf) | adjacent-research | 9c0467c0b9dc617e786c9c8aefbebb1a60d88ded | 2026-09-13T02:30:40+08:00 | +2/-228 | Full equivalence NOT established; cherry +2/-0; triple-dot 58 paths; main overlap 3; equal 0, absent 14, differing 44 | Inference: preserve; 41 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/.cache/tmp/claude-1000/-home-phyrexian-Downloads-llm-automation-project-portfolio-Molina-Optiplex-Sharpe-Renaissance-drive/4d2be1ca-4f01-4567-b0f4-aebd77896764/scratchpad/spk-wf (ci/add-claude-github-app) | policy-lab | 9d781825d4566294ce9dbe2ba973cfe3c23ba87c | 2026-08-04T18:48:38+08:00 | +1/-200 | Full equivalence NOT established; cherry +1/-0; triple-dot 1 paths; main overlap 0; equal 0, absent 1, differing 0 | Inference: preserve; 0 dirty collapsed entries; missing/prunable registration, do not prune | keep-local |
| /home/phyrexian/.cache/tmp/solarpunk-audit-20261005-nukmy6qd/repo (detached) | policy-lab | c194a4f05e2f84b971a8fdf756ae02856dc3b1d9 | 2026-09-19T19:00:32Z | +0/-8 | Observed detached HEAD; ancestor of origin/main | Inference: preserve; 4 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/.config/superpowers/worktrees/Solarpunk-bitcoin/feat-paired-platform-shell (feat/paired-platform-shell) | policy-lab | dd484678907820c8ad1c31f6d0358bfa9de3ab1a | 2026-08-06T03:19:54+08:00 | +33/-195 | Full equivalence NOT established; cherry +33/-0; triple-dot 25 paths; main overlap 25; equal 5, absent 0, differing 20 | Inference: preserve; 0 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/.local/state/grok-muscle/worktrees/Solarpunk-bitcoin-0920-023651-87f8 (grok/0920-023651-87f8) | policy-lab | adf14372994224c13853d002f7e749a9196f26dd | 2026-09-20T02:02:36+08:00 | +0/-12 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: preserve; 2 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/policy-lab-consolidation (chore/policy-lab-consolidation) | policy-lab | e75d5f350d74d02461596b4b6568946aa0f55388 | 2026-10-09T15:31:34+08:00 | +1/-0 | Full equivalence NOT established; cherry +1/-0; triple-dot 1 paths; main overlap 0; equal 0, absent 1, differing 0 | Inference: preserve; 0 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/policy-lab-release (package/policy-lab-release-v0.2.0) | policy-lab | 751da540f45666306359c19a39d0578b8f10a9cb | 2026-09-30T20:06:39+08:00 | +1/-8 | Full equivalence NOT established; cherry +1/-0; triple-dot 5 paths; main overlap 0; equal 0, absent 2, differing 3 | Inference: preserve; 0 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/solarpunk-audit-repairs (ui/visual-assessment-2026-10-06) | policy-lab | c8ba12073cc3fb8416dc6f30f8866c4d025bb32b | 2026-10-07T20:31:09+08:00 | +0/-2 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: preserve; 0 dirty collapsed entries; review contents and branch before removal | already-on-main |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/.worktrees/solarpunk-backend-repairs (fix/backend-followup-2026-10-05) | policy-lab | ff44da42fa0c6df761a86d8c6859ec285d23421f | 2026-10-05T22:46:16+08:00 | +1/-6 | Full equivalence NOT established; cherry +1/-0; triple-dot 16 paths; main overlap 0; equal 0, absent 4, differing 12 | Inference: preserve; 0 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-main-tip (docs/field-validation-freeze) | policy-lab | fe430f1fcd8a8d7306ad58555b594ad48f2ccd85 | 2026-07-20T16:37:17+08:00 | +6/-222 | Full equivalence NOT established; cherry +6/-0; triple-dot 4 paths; main overlap 4; equal 3, absent 0, differing 1 | Inference: preserve; 2 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-operator-evidence-pilot (feat/operator-evidence-pilot) | policy-lab | 5b39a2944a8b9158777cee44b3d237fdece0b448 | 2026-07-20T15:10:58+08:00 | +18/-228 | Full equivalence NOT established; cherry +18/-0; triple-dot 14 paths; main overlap 14; equal 7, absent 0, differing 7 | Inference: preserve; 1 dirty collapsed entries; review contents and branch before removal | keep-local |
| /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-public-lab-workbench (feat/public-lab-workbench) | policy-lab | d9616839a63771653d7c073261a89f8255dee3f1 | 2026-07-20T01:39:39+08:00 | +5/-387 | Full equivalence NOT established; cherry +5/-0; triple-dot 21 paths; main overlap 20; equal 14, absent 1, differing 6 | Inference: preserve; 1 dirty collapsed entries; review contents and branch before removal | keep-local |
| /tmp/solarpunk-public-main (main) | policy-lab | 655c51e288f1e3914b820e0ca2f99965da275fc4 | 2026-09-19T01:40:52+08:00 | +0/-13 | YES ancestor; cherry +0/-0; triple-dot 0 paths; main overlap 0; equal 0, absent 0, differing 0 | Inference: preserve; 0 dirty collapsed entries; missing/prunable registration, do not prune | already-on-main |

### Dirty paths: /home/phyrexian/Downloads/llm_automation/project_portfolio/Solarpunk-bitcoin

~~~text
 M thesis_package/THESIS_NUMBERS_MANIFEST.md
?? .playwright-mcp/
?? IE-JDE/Constrained_Ledger_Plain/
?? IE-JDE/DATA_AUDIT_AND_CORRECTIONS_2026-07.md
?? IE-JDE/Digital_Tax_Design/corrected/
?? IE-JDE/Digital_Tax_Design/rebuilt_2026/
?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_FINAL.docx
?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_MANUSCRIPT.md
?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_THIRD_CORRECTED.docx
?? IE-JDE/Invisible_Economy/REFINITIV_GRAB_SEA_GOTO_ANNUAL_PULL_2026-08-24.csv
?? IE-JDE/Invisible_Economy/edgar_pulls/
?? IE-JDE/SPK_Derivatives/
?? Invisible_Ledger_Aug1426(1)_Kong.docx
?? Invisible_Ledger_Data_Package_2026-09-14.xlsx
?? "Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14 (1).md"
?? Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14.md
?? Invisible_Ledger_Proposal_Content_Draft_2026-09-13.md
?? Invisible_Ledger_Proposal_FLASHPOINT_GRAFT_PLAIN_FINAL_2026-09-13.docx
?? Invisible_Ledger_Proposal_Kong_Rootstock_2026-09-14.docx
?? Invisible_Ledger_Proposal_LATEST_BEST_CONTENT_FINAL_2026-09-14.docx
?? Invisible_Ledger_Proposal_Sept01_ACCEPTED_PREVIEW_2026-09-14.docx
?? Invisible_Ledger_Proposal_Sept01_Surgery_2026-09-14.docx
?? Invisible_Ledger_Sept0126_Kong.docx
?? Invisible_Ledger_Thesis_Proposal_2026-09-14.docx
?? Invisible_Ledger_Thesis_Proposal_FINAL_2026-09-14.docx
?? PROPOSAL_SURGERY_BREAKDOWN_2026-09-14.md
?? _review_workbench/
?? docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md
?? messageImage_1789228126068.jpg
?? qa-overview-desktop.yml
?? thesis_package/ECI_REBUILD_RESULTS.md
?? thesis_package/ECI_RECOVERY_SEARCH.md
?? thesis_package/ECI_REPO_HANDOFF.md
?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_FINAL.docx
?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V1.md
?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V2.md
?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V1.md
?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V2_PLAIN.md
?? thesis_package/THESIS_PLAIN_OPENING_DRAFT.md
?? thesis_package/eci_recovered_data/
?? thesis_package/eci_reproduction/
~~~

### Dirty paths: /home/phyrexian/.cache/tmp/solarpunk-audit-20261005-nukmy6qd/repo

~~~text
?? scripts/audit_capture_case_workbench_v2.mjs
?? scripts/audit_option.cjs
?? scripts/audit_receipt_browser.mjs
?? scripts/audit_scenario.mjs
~~~

### Dirty paths: /home/phyrexian/.local/state/grok-muscle/worktrees/Solarpunk-bitcoin-0920-023651-87f8

~~~text
 M frontend/src/styles/platformSurfaces.css
?? .playwright-mcp/
~~~

### Dirty paths: /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-main-tip

~~~text
 M README.md
?? EVALUATOR_GUIDE.md
~~~

### Dirty paths: /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-operator-evidence-pilot

~~~text
 M frontend/package-lock.json
~~~

### Dirty paths: /home/phyrexian/Downloads/llm_automation/project_portfolio/solarpunk-public-lab-workbench

~~~text
?? _review_workbench/
~~~

## Main checkout dirty triage

41 default porcelain entries: one modified plus 40 untracked entries, including collapsed directories. This reproduces the handoff’s 41 entries, not individual files. Expanded --untracked-files=all: 148 individual paths. Both listed; no moving, deleting, staging or committing. Triage inferences from status/path do not establish scientific correctness; other-project files remain preserved even if commit-worthy in their own project.

| Collapsed status entry | Triage | Reason |
| --- | --- | --- |
|  M thesis_package/THESIS_NUMBERS_MANIFEST.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? .playwright-mcp/ | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? IE-JDE/Constrained_Ledger_Plain/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/DATA_AUDIT_AND_CORRECTIONS_2026-07.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/corrected/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_MANUSCRIPT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_THIRD_CORRECTED.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/REFINITIV_GRAB_SEA_GOTO_ANNUAL_PULL_2026-08-24.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/SPK_Derivatives/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Aug1426(1)_Kong.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Data_Package_2026-09-14.xlsx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? "Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14 (1).md" | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Content_Draft_2026-09-13.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_FLASHPOINT_GRAFT_PLAIN_FINAL_2026-09-13.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Kong_Rootstock_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_LATEST_BEST_CONTENT_FINAL_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Sept01_ACCEPTED_PREVIEW_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Sept01_Surgery_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Sept0126_Kong.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Thesis_Proposal_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Thesis_Proposal_FINAL_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? PROPOSAL_SURGERY_BREAKDOWN_2026-09-14.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? _review_workbench/ | keep-local | Deferred frontend review evidence. |
| ?? docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md | commit-worthy | Candidate Policy Lab prose; compare current surface before commit. |
| ?? messageImage_1789228126068.jpg | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? qa-overview-desktop.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? thesis_package/ECI_REBUILD_RESULTS.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ECI_RECOVERY_SEARCH.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ECI_REPO_HANDOFF.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V1.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V2.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V1.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V2_PLAIN.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/THESIS_PLAIN_OPENING_DRAFT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/ | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |

### Expanded files

| File / status | Triage | Reason |
| --- | --- | --- |
|  M thesis_package/THESIS_NUMBERS_MANIFEST.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? .playwright-mcp/page-2026-06-07T17-42-33-238Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T17-42-40-974Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T17-42-54-993Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-02-51-918Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-03-04-883Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-03-53-408Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-06-18-598Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-06-30-231Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-17-10-298Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-07T18-17-18-435Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-08T09-06-26-642Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-08T10-08-02-599Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-08T10-08-05-915Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-06-08T10-09-16-945Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-08-39-634Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-09-08-781Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-09-17-862Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-09-24-770Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-09-46-241Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-09-58-409Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-10-10-449Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-10T18-10-15-517Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-07-11T07-47-44-327Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-05T17-59-06-372Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-05T18-29-18-473Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-05T19-24-03-009Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-12T13-47-31-468Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-12T13-48-33-701Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? .playwright-mcp/page-2026-08-12T13-49-32-193Z.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? IE-JDE/Constrained_Ledger_Plain/CONSTRAINED_LEDGER_PLAIN_LANGUAGE.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Constrained_Ledger_Plain/final/THE_CONSTRAINED_LEDGER_FULL_THESIS.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Constrained_Ledger_Plain/final/THE_CONSTRAINED_LEDGER_JOURNAL_VERSION.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/DATA_AUDIT_AND_CORRECTIONS_2026-07.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/corrected/DIGITAL_TAX_CORRECTED_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/DIGITAL_TAX_ADMINISTRATIVE_REACH_WORKING_DRAFT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/DIGITAL_TAX_EVIDENCE_AUDIT_2026-09.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/README.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/analysis/build_evidence_pack.R | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/analysis/reproduce_core.R | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/data/ASEAN_DIGITAL_TAX_MASTER_LONG.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/data/FISCAL_CHOKEPOINT_ARCHITECTURE.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/data/SOURCES.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/data/collection_series.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/data/legacy_panel.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/evidence_coverage_by_country.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/evidence_coverage_by_instrument.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/legacy_panel_coefficients.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/legacy_panel_fit.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/legacy_panel_loocv_metrics.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/legacy_panel_loocv_rows.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Digital_Tax_Design/rebuilt_2026/results/sources_used_by_evidence_pack.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_CORRECTED_MANUSCRIPT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/INVISIBLE_LEDGER_THIRD_CORRECTED.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/REFINITIV_GRAB_SEA_GOTO_ANNUAL_PULL_2026-08-24.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/EDGAR_GRAB_GMV_REVENUE_BY_SEGMENT_ANNUAL_2019_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/EDGAR_GRAB_REVENUE_BY_GEOGRAPHY_ANNUAL_2019_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/EDGAR_SEA_SHOPEE_GMV_QUARTERLY_2017_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/EDGAR_SEA_SHOPEE_SEGMENT_REVENUE_ANNUAL_2016_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/GOTO_GTV_REVENUE_Q1Q2_2022.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/grab_20f_fy2021.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/grab_20f_fy2021_full.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/grab_20f_list.xml | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/grab_submissions.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_20f_fy2018.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_20f_fy2019.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_20f_fy2020.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_20f_fy2021.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_f1_2017.htm | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/Invisible_Economy/edgar_pulls/sea_submissions.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? IE-JDE/SPK_Derivatives/corrected/SPK_DERIVATIVES_CORRECTED_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Aug1426(1)_Kong.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Data_Package_2026-09-14.xlsx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? "Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14 (1).md" | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Latest_Best_Iteration_and_Claude_Opus_Handoff_2026-09-14.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Content_Draft_2026-09-13.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_FLASHPOINT_GRAFT_PLAIN_FINAL_2026-09-13.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Kong_Rootstock_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_LATEST_BEST_CONTENT_FINAL_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Sept01_ACCEPTED_PREVIEW_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Proposal_Sept01_Surgery_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Sept0126_Kong.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Thesis_Proposal_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? Invisible_Ledger_Thesis_Proposal_FINAL_2026-09-14.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? PROPOSAL_SURGERY_BREAKDOWN_2026-09-14.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? _review_workbench/PUBLIC_LAB_WORKBENCH_HANDOFF.md | keep-local | Deferred frontend review evidence. |
| ?? _review_workbench/screenshots-full-visual/MANIFEST.txt | keep-local | Deferred frontend review evidence. |
| ?? docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md | commit-worthy | Candidate Policy Lab prose; compare current surface before commit. |
| ?? messageImage_1789228126068.jpg | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? qa-overview-desktop.yml | discard-candidate | Inference: generated QA snapshot; verify reference/backup needs before discard. |
| ?? thesis_package/ECI_REBUILD_RESULTS.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ECI_RECOVERY_SEARCH.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ECI_REPO_HANDOFF.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_FINAL.docx | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V1.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/ENERGY_CIRCULATION_INDICATOR_PAPER_V2.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V1.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/SOLARPUNK_JOURNAL_DRAFT_V2_PLAIN.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/THESIS_PLAIN_OPENING_DRAFT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/eci_taiwan_monthly_clean.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/methods_detail.py | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/EA19PRINTO01IXOBSAM.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/G7LOLITOAASTSAM.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/INDPRO.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/IPG2211A2N.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/M2SL.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/WEI.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/btc_coinmetrics.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/defi_tvl.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/eu_ip.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/oecd_cli.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/raw/stablecoin_supply.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/rebuild_analysis.py | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/rebuilt_crypto_electricity/results_output.txt | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/manifest.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/schema-行業別售電_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/schema-行業別售電_2022.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/schema-行業別售電_2023.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/schema-行業別售電_2024.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/schema-行業別售電_2025.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/行業別售電_2021.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/行業別售電_2022.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/行業別售電_2023.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/行業別售電_2024.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_recovered_data/taipower_data/行業別售電_2025.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/ECI_STABLECOIN_M2_DIAGNOSTIC_REPORT.md | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/manifests/processed_sha256.txt | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/manifests/raw_sha256.txt | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/manifests/versions.txt | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_2023_2026.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_cointegration.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_regressions.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_residual_diagnostics.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_sensitivity.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/outputs/eci_stablecoin_m2_stationarity.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/EA19PRINTO01IXOBSAM.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/G7LOLITOAASTSAM.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/INDPRO.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/IPG2211A2N.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/M2SL.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/WEI.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/btc_coinmetrics.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/defi_tvl.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/eu_ip.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/oecd_cli.csv | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/raw/stablecoin_supply.json | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |
| ?? thesis_package/eci_reproduction/scripts/eci_stablecoin_m2_diagnostics.py | keep-local | Adjacent/other-project research/source/manuscript or unidentified local asset; owner review outside cleanup. |

## Environment check — values never printed

Read root .env.oracle/.env.example in both checkouts in memory only. Inspected comment-stripped API/private-key/address shapes, template markers, local endpoints and blank webhooks. No authentication/transmission/rotation. No live secret confirmed, but placeholders-only not established for NASA_API_KEY. Generic noncredential configuration excluded from secret conclusions.

| Entry | Safe finding | Disposition |
| --- | --- | --- |
| .env.oracle NASA_API_KEY | Nonempty; recognized demo/placeholder status not established after comment stripping. | Potential credential: owner verify inactive/template, rotate if live. |
| .env.oracle MONGODB_URI / REDIS_URL | Localhost configuration. | No remote live credential identified. |
| .env.oracle SLACK_WEBHOOK | Blank after comment stripping. | No live webhook identified. |
| .env.example PRIVATE_KEY | Not full valid hexadecimal private-key shape; intended placeholder unverified. | No usable Ethereum key identified. |
| .env.example token addresses | Not full public-address shapes; addresses are not signing secrets. | Configuration/template review. |

Shape checks cannot prove inactivity. Rotation skipped because explicit one-file-only scope prohibits credential/service changes. Do not share values in replies.

- .env.oracle: tracked=True; checkouts byte-identical=True.

- .env.example: tracked=True; checkouts byte-identical=True.

## Counts and Stop 1

80 remote branches besides main; 23 ancestry-merged / 57 unmerged; 9 local-only branches; 13 worktrees; ten verified PRs, five issues.

| Action | Remote | Local-only | PRs | Issues | Worktrees |
| --- | --- | --- | --- | --- | --- |
| already-on-main | 24 | 3 | 0 | 0 | 2 |
| salvage-in-PR | 5 | 2 | 3 | 0 | 0 |
| supersede-and-archive | 32 | 0 | 2 | 0 | 0 |
| keep-local | 8 | 3 | 1 | 5 | 11 |
| out-of-scope | 11 | 1 | 4 | 0 | 0 |

Expanded dirty triage: {'keep-local': 117, 'discard-candidate': 30, 'commit-worthy': 1}. Counts overlap across object types; not unique work packages.

### Proposed ordered plan after approval

1. Owner verifies flagged environment entry; if live, secure rotation takes priority under separate authorization. Confirm backup before destructive phase.

2. Small documentation PR: four-to-five case count, README/DOCS reconciliation, archive index and recorded tips; preserve history.

3. Salvage #73 native bridge; inspect pinned runner and test parity. Separate #65 Gauntlet/assumption/protocol PR; defer trusted attestation and retain external gaps.

4. Compare engineering-only #70 hardening with repaired main; no broad stack landing. #71 remains proof-only; #66/paired-platform/UI stay deferred.

5. Dependency migration/backport ADR, backend after scope decision, release prose excluding binary deletions/tag/publish, optional bounded CI hygiene.

6. Later exact cleanup list after residual review, fresh backup and recorded tips. Nothing destructive authorized.

Risks: snapshot freshness; curated-main patch ambiguity; stale stacks regress audit/UI/case-count repairs; workflows can activate historical publishers/trusted write paths; backend historical reference scope; external runner belongs elsewhere; research data/manuscripts must be preserved; dirty snapshots can retain review value; credential status unresolved. Historical green CI does not prove current readiness.

### Exact user questions

1. Approve Phase 2 limited to this plan, no merges/publish/deploy/destructive cleanup, frontend redesign still deferred?

2. Prioritize #73 then read-only/non-attesting #65, followed by engineering-only #70 extraction?

3. Include historical energy_derivatives/spk_v1 backend follow-up in Policy Lab scope, or leave local?

4. Confirm NASA_API_KEY is placeholder/inactive without sharing value; if live, who will securely rotate it?

5. Keep Norway/thesis adjacent/outside consolidation, preserve deferred frontend candidates, and exclude binary deletions from release-prose salvage?

STOP 1. Phase 2 not started. Destructive approvals require future exact object list and fresh backup.

## Observed per-branch evidence

### origin/feat/policy-lab-release-integration

Tip 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
+ b2e2dc5795b165b05caa772ae8fd289b5ae4ac62
+ 3962801eecf0a15bed824fdfe151127e9050f12c
+ 53c5de28aac771ca891ea267ac27c7bf569454fe
+ 686e0631bd6c89df176bda8dafdb311f9bf50319
+ 0291810278d1c005c4511fa28d8b66e27b58ebf1
+ f7053afe4458b8dbbc3f46c4dcafe0ad666e3d13
+ 58b609acccd1d5376b54ee5573065c325910d336
+ e2b04cd098e57a40296a0804d72219fe4926017b
+ 62ddd292b4d125fe7a8b3208efa92976c88d54d1
+ 1a2a62bb0be01a0b32be5a2f08a91d9efd3354fa
+ 7ea268dd6e10ca7b504f35507800dd2db2e6a29c
+ 919186836d0ec129bb71d73cde089165514e7cea
+ d63b5427753c17872998c861201edb780477fefb
+ 1b797672773861d03bbc9ab5a28488f63b3982f7
+ 8cf6fff96022cc365f9fb3b2de5d7aaf01d91c1f
+ 9a2712cf72d0a1f791af18654a0b557c3c252cfe
+ 49e7092d0c8c3f793ad807ebe9f3343002ba35eb
+ 11869bdda563783b3d92bef85030190a6e519466
+ 700259eb93e4291ea5cb1fc275721cec96957680
+ 78c20bdea5f066225cdda08057f1be187e999918
+ 2ab20cffde96f8717f394b648140a41936c92460
+ 9682216536e95c5154e77c6aa0dd527019f873e6
+ 805dfc5f3632e49df559fbda072475e3ea9e82c0
+ 166f966b36d383bcd4561a63c90c98922c91f3a3
+ e3c82b97f8d4d66bab78ff9de1bee13c86fbdb07
+ c0de51217a66a4d2b892e0c06ba1034bf6ce00d2
+ 4ffda1574bb58d3a64685c98c177e495ad86abe7
+ 494436b71194e75fa8a52c7c17a9872c2b7415d0
+ 8276f8eeb00b283bbb0cb9167ea7c21b5957061a
+ 2af6ff187cf7f47cec7c67bdf95b752335a6bef9
+ 06978514b0ba5906e4fcbdeea1753c348db4caac
+ 570aeed767353529fc6a5fbba58d825d9dab8145
+ 68116b11639b89cb3242a91955466ac01f72e756
+ f2ee3b38f5e2d1a6f86ea75251756111dc527dbb
+ d7e95021a900a61737436cf1e801b1c67f838f82
+ 6064fea962bdc7ec48f25a2bd0108cc1de05a3c4
+ b60b88a99ad17c2b54c3b04a315c03565b8a3371
+ 5925a697711dc73958f7387bc53b24d485565294
+ 686a04ba116ac8a2f62089dee113f640df7d3f14
+ bc4e9e2cfeaff0ad75846d526f37690c559b3d48
+ 5dd5625ca6697e464d09f84d7c5258cd88d50034
+ 6446c44c14cd4ce42d168cdf6e04007a08c05f27
+ 3d3bfd0c9a8e405688e3a403e4f1ac37c9841437
+ 8e5b950e3074ca1ba8651c292b404a8636654603
+ 0fae4a579cf086429adf05e8934c3b046839427a
+ 2c28e050e04fb887cd7db9d21885c8d82166be63
+ 6ebeb978ddf3d7278ca428b8b42a11cb6ad6a909
+ f072208602073ba38a6ddf25c4ed3370275e026a
+ 1a1b74d60360f58c1c4639a4bf6b29e74eeee8fa
+ 38cb88e5fb04535340d5b6f89eff52d5793cc1d1
+ a1907051af7d8c023360ed99be9250c15a6c5e5a
+ 2cbf14ff7e56b575c868b9f8d389b51ce7704405
+ 82626adf29da0226165da2f24e5d289aaabd6e0d
+ b736cdef83b5a694227b79553e7a81d7c667416b
+ dac91b6625514c893b91929b2391a55069a58977
+ 02152346d9eb71ca77736514e276fb989d09b305
+ 54bd02a50e30b67f742306190ffc1bd36a90bcc1
+ ac7817754e8bbfb734ce138c138a7b6259a7c6a4
+ d63546b96c40bce51dd1131712b0d3c3160c0efa
+ 6763dfb3167c63493dfe9b497b19353de985238a
+ 2cf35f8fde65cf8b538cc1c5081f1e069fccd696
+ ff1a8b52549ee22e791568b647f31063c53795f2
+ dbca98608b3708e9102b109546a944b9f8f11959
+ 06d2ff2661b74c0bcf187d0d5f479f74252439a7
+ f81834bd3633e46435f09cd0169ee28e1ed7c4c0
+ 0e5fdf45336528628853265eaa80818bf27e2e34
+ 887ce61e61080a072c5a1bd3072fee7277c51f91
+ a8f7314f901ced646fad4aa63863af1c64df5219
+ 88ab9873a386b5a88068b348b5963938f4a31956
+ 46d0299fdb7093cd1981d1c738160e5cd7dfdcdc
+ 0257699e2ae7213589fd093af4202c335de17fdc
+ f1793b2d7cb7a47c771e2483d703d74b05227bbb
+ bc77ed09651e66a395e57edbc76592a1940291e5
+ 744818e54536ff9281d9bd4bdf895fe65dc87c68
+ b11df11e704aed1d4309ffb50df7decd34a1dcee
+ c2166fd33cfb37c8bdcf38417b03885a5a340531
+ 49b5e7d45fa4acf3f64b2a7db0fe8739eb3ba016
+ 23ffdfab161b79aa86598abe3c662e9f708ab036
+ 5eb00e53bbebf63e9742608de2e35d19c666c5d6
+ 1c8ebf719386beb930c1cbcb287390531cfb2762
+ 502d4737e83496008727ce52c6b85c93ab532b17
+ 04461c1bb54a8c93abb9e8eac3189fce905e3cf6
+ 534bba047300924a1022d1550363cbd377ce03a2
+ b4df306ca2f0a519dbf9d4c4d6f3a341b07b9c0a
+ 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/case_workbench_v2.yml            |   15 +-
 .github/workflows/external-case-001p-ausgrid.yml   |    1 +
 .github/workflows/policy-lab-live-smoke.yml        |   40 +-
 .../workflows/policy-lab-release-attestation.yml   |  129 +++
 .../workflows/policy-lab-specialized-gauntlet.yml  |  141 +++
 benchmark/gauntlet/policy-assumptions.v1.json      |  157 +++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    |  118 +++
 ...policy-lab-external-validation-protocol.v1.json |  100 ++
 benchmark/gauntlet/policy-lab-specialized.v1.json  |  127 +++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   |  193 ++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |   96 ++
 docs/submission/README.md                          |   21 +-
 frontend/package-lock.json                         |   65 +-
 frontend/package.json                              |    5 +-
 frontend/src/components/JudgeEvidenceSurface.jsx   |  249 +++++
 .../src/components/JudgeEvidenceSurface.test.jsx   |   42 +
 frontend/src/components/LabOverview.jsx            |  317 +++---
 frontend/src/components/LabOverview.test.jsx       |  108 +-
 frontend/src/components/ResearchAtlas.jsx          |    1 +
 frontend/src/components/ResearchBrowser.jsx        |  513 +++++++++
 .../src/components/ResearchWorkbenchOverview.jsx   |  416 ++++++++
 frontend/src/main.jsx                              |    2 +
 frontend/src/styles/judgeSurface.css               | 1115 ++++++++++++++++++++
 frontend/src/styles/judgeSurfaceFlowFix.css        |    7 +
 frontend/src/styles/policyCausalCanvas.css         |  579 ++++++++++
 frontend/src/styles/policyCausalCanvasAccuracy.css |   16 +
 frontend/src/styles/researchAtlas.css              |  440 ++++++++
 frontend/src/styles/researchBrowser.css            |  517 +++++++++
 frontend/src/styles/researchExplorer.css           |  389 +++++++
 frontend/src/styles/researchWorkbenchOverview.css  |  505 +++++++++
 frontend/src/styles/researchWorkbenchViewport.css  |  108 ++
 scripts/build_policy_lab_release_provenance.mjs    |  174 +++
 scripts/capture_case_workbench_v2.mjs              |   50 +-
 scripts/capture_policy_lab_submission_assets.mjs   |   11 +-
 ...heck_policy_lab_external_gauntlet_protocols.mjs |   70 ++
 scripts/run_policy_lab_specialized_gauntlet.mjs    |  388 +++++++
 scripts/smoke_live_policy_lab.mjs                  |  149 ++-
 37 files changed, 7081 insertions(+), 293 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; frontend/src/components/JudgeEvidenceSurface.jsx; frontend/src/components/JudgeEvidenceSurface.test.jsx; frontend/src/components/ResearchAtlas.jsx; frontend/src/components/ResearchBrowser.jsx; frontend/src/components/ResearchWorkbenchOverview.jsx; frontend/src/styles/judgeSurface.css; frontend/src/styles/judgeSurfaceFlowFix.css; frontend/src/styles/policyCausalCanvas.css; frontend/src/styles/policyCausalCanvasAccuracy.css; frontend/src/styles/researchAtlas.css; frontend/src/styles/researchBrowser.css; frontend/src/styles/researchExplorer.css; frontend/src/styles/researchWorkbenchOverview.css; frontend/src/styles/researchWorkbenchViewport.css; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: .github/workflows/case_workbench_v2.yml; .github/workflows/external-case-001p-ausgrid.yml; .github/workflows/policy-lab-live-smoke.yml; docs/submission/README.md; frontend/package-lock.json; frontend/package.json; frontend/src/components/LabOverview.jsx; frontend/src/components/LabOverview.test.jsx; frontend/src/main.jsx; scripts/capture_case_workbench_v2.mjs; scripts/capture_policy_lab_submission_assets.mjs; scripts/smoke_live_policy_lab.mjs


Main-since-base overlap: .github/workflows/case_workbench_v2.yml; .github/workflows/external-case-001p-ausgrid.yml; .github/workflows/policy-lab-live-smoke.yml; frontend/package-lock.json; frontend/package.json; frontend/src/components/LabOverview.jsx; frontend/src/main.jsx; scripts/capture_case_workbench_v2.mjs; scripts/smoke_live_policy_lab.mjs


### origin/feat/policy-lab-frontend-convergence

Tip f1793b2d7cb7a47c771e2483d703d74b05227bbb; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
+ b2e2dc5795b165b05caa772ae8fd289b5ae4ac62
+ 3962801eecf0a15bed824fdfe151127e9050f12c
+ 53c5de28aac771ca891ea267ac27c7bf569454fe
+ 686e0631bd6c89df176bda8dafdb311f9bf50319
+ 0291810278d1c005c4511fa28d8b66e27b58ebf1
+ f7053afe4458b8dbbc3f46c4dcafe0ad666e3d13
+ 58b609acccd1d5376b54ee5573065c325910d336
+ e2b04cd098e57a40296a0804d72219fe4926017b
+ 62ddd292b4d125fe7a8b3208efa92976c88d54d1
+ 1a2a62bb0be01a0b32be5a2f08a91d9efd3354fa
+ 7ea268dd6e10ca7b504f35507800dd2db2e6a29c
+ 919186836d0ec129bb71d73cde089165514e7cea
+ d63b5427753c17872998c861201edb780477fefb
+ 1b797672773861d03bbc9ab5a28488f63b3982f7
+ 8cf6fff96022cc365f9fb3b2de5d7aaf01d91c1f
+ 9a2712cf72d0a1f791af18654a0b557c3c252cfe
+ 49e7092d0c8c3f793ad807ebe9f3343002ba35eb
+ 11869bdda563783b3d92bef85030190a6e519466
+ 700259eb93e4291ea5cb1fc275721cec96957680
+ 78c20bdea5f066225cdda08057f1be187e999918
+ 2ab20cffde96f8717f394b648140a41936c92460
+ 9682216536e95c5154e77c6aa0dd527019f873e6
+ 805dfc5f3632e49df559fbda072475e3ea9e82c0
+ 166f966b36d383bcd4561a63c90c98922c91f3a3
+ e3c82b97f8d4d66bab78ff9de1bee13c86fbdb07
+ c0de51217a66a4d2b892e0c06ba1034bf6ce00d2
+ 4ffda1574bb58d3a64685c98c177e495ad86abe7
+ 494436b71194e75fa8a52c7c17a9872c2b7415d0
+ 8276f8eeb00b283bbb0cb9167ea7c21b5957061a
+ 2af6ff187cf7f47cec7c67bdf95b752335a6bef9
+ 06978514b0ba5906e4fcbdeea1753c348db4caac
+ 570aeed767353529fc6a5fbba58d825d9dab8145
+ 68116b11639b89cb3242a91955466ac01f72e756
+ f2ee3b38f5e2d1a6f86ea75251756111dc527dbb
+ d7e95021a900a61737436cf1e801b1c67f838f82
+ 6064fea962bdc7ec48f25a2bd0108cc1de05a3c4
+ b60b88a99ad17c2b54c3b04a315c03565b8a3371
+ 5925a697711dc73958f7387bc53b24d485565294
+ 686a04ba116ac8a2f62089dee113f640df7d3f14
+ bc4e9e2cfeaff0ad75846d526f37690c559b3d48
+ 5dd5625ca6697e464d09f84d7c5258cd88d50034
+ 6446c44c14cd4ce42d168cdf6e04007a08c05f27
+ 3d3bfd0c9a8e405688e3a403e4f1ac37c9841437
+ 8e5b950e3074ca1ba8651c292b404a8636654603
+ 0fae4a579cf086429adf05e8934c3b046839427a
+ 2c28e050e04fb887cd7db9d21885c8d82166be63
+ 6ebeb978ddf3d7278ca428b8b42a11cb6ad6a909
+ f072208602073ba38a6ddf25c4ed3370275e026a
+ 1a1b74d60360f58c1c4639a4bf6b29e74eeee8fa
+ 38cb88e5fb04535340d5b6f89eff52d5793cc1d1
+ a1907051af7d8c023360ed99be9250c15a6c5e5a
+ 2cbf14ff7e56b575c868b9f8d389b51ce7704405
+ 82626adf29da0226165da2f24e5d289aaabd6e0d
+ b736cdef83b5a694227b79553e7a81d7c667416b
+ dac91b6625514c893b91929b2391a55069a58977
+ 02152346d9eb71ca77736514e276fb989d09b305
+ 54bd02a50e30b67f742306190ffc1bd36a90bcc1
+ ac7817754e8bbfb734ce138c138a7b6259a7c6a4
+ d63546b96c40bce51dd1131712b0d3c3160c0efa
+ 6763dfb3167c63493dfe9b497b19353de985238a
+ 2cf35f8fde65cf8b538cc1c5081f1e069fccd696
+ ff1a8b52549ee22e791568b647f31063c53795f2
+ dbca98608b3708e9102b109546a944b9f8f11959
+ 06d2ff2661b74c0bcf187d0d5f479f74252439a7
+ f81834bd3633e46435f09cd0169ee28e1ed7c4c0
+ 0e5fdf45336528628853265eaa80818bf27e2e34
+ 887ce61e61080a072c5a1bd3072fee7277c51f91
+ a8f7314f901ced646fad4aa63863af1c64df5219
+ 88ab9873a386b5a88068b348b5963938f4a31956
+ 46d0299fdb7093cd1981d1c738160e5cd7dfdcdc
+ 0257699e2ae7213589fd093af4202c335de17fdc
+ f1793b2d7cb7a47c771e2483d703d74b05227bbb
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   |  100 ++
 .../workflows/policy-lab-specialized-gauntlet.yml  |  141 +++
 benchmark/gauntlet/policy-assumptions.v1.json      |  157 +++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    |  118 +++
 ...policy-lab-external-validation-protocol.v1.json |  100 ++
 benchmark/gauntlet/policy-lab-specialized.v1.json  |  127 +++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   |  193 ++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |   96 ++
 docs/submission/README.md                          |   21 +-
 frontend/src/components/JudgeEvidenceSurface.jsx   |  249 +++++
 .../src/components/JudgeEvidenceSurface.test.jsx   |   42 +
 frontend/src/components/LabOverview.jsx            |  317 +++---
 frontend/src/components/LabOverview.test.jsx       |  108 +-
 frontend/src/components/ResearchAtlas.jsx          |    1 +
 frontend/src/components/ResearchBrowser.jsx        |  513 +++++++++
 .../src/components/ResearchWorkbenchOverview.jsx   |  416 ++++++++
 frontend/src/main.jsx                              |    2 +
 frontend/src/styles/judgeSurface.css               | 1115 ++++++++++++++++++++
 frontend/src/styles/judgeSurfaceFlowFix.css        |    7 +
 frontend/src/styles/policyCausalCanvas.css         |  579 ++++++++++
 frontend/src/styles/policyCausalCanvasAccuracy.css |   16 +
 frontend/src/styles/researchAtlas.css              |  440 ++++++++
 frontend/src/styles/researchBrowser.css            |  517 +++++++++
 frontend/src/styles/researchExplorer.css           |  389 +++++++
 frontend/src/styles/researchWorkbenchOverview.css  |  505 +++++++++
 frontend/src/styles/researchWorkbenchViewport.css  |  108 ++
 scripts/build_policy_lab_release_provenance.mjs    |  126 +++
 scripts/capture_case_workbench_v2.mjs              |   50 +-
 scripts/capture_policy_lab_submission_assets.mjs   |   11 +-
 ...heck_policy_lab_external_gauntlet_protocols.mjs |   70 ++
 scripts/run_policy_lab_specialized_gauntlet.mjs    |  388 +++++++
 31 files changed, 6791 insertions(+), 231 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; frontend/src/components/JudgeEvidenceSurface.jsx; frontend/src/components/JudgeEvidenceSurface.test.jsx; frontend/src/components/ResearchAtlas.jsx; frontend/src/components/ResearchBrowser.jsx; frontend/src/components/ResearchWorkbenchOverview.jsx; frontend/src/styles/judgeSurface.css; frontend/src/styles/judgeSurfaceFlowFix.css; frontend/src/styles/policyCausalCanvas.css; frontend/src/styles/policyCausalCanvasAccuracy.css; frontend/src/styles/researchAtlas.css; frontend/src/styles/researchBrowser.css; frontend/src/styles/researchExplorer.css; frontend/src/styles/researchWorkbenchOverview.css; frontend/src/styles/researchWorkbenchViewport.css; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md; frontend/src/components/LabOverview.jsx; frontend/src/components/LabOverview.test.jsx; frontend/src/main.jsx; scripts/capture_case_workbench_v2.mjs; scripts/capture_policy_lab_submission_assets.mjs


Main-since-base overlap: frontend/src/components/LabOverview.jsx; frontend/src/main.jsx; scripts/capture_case_workbench_v2.mjs


### origin/feat/policy-lab-specialized-gauntlet

Tip ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   | 100 ++++++
 .../workflows/policy-lab-specialized-gauntlet.yml  | 141 ++++++++
 benchmark/gauntlet/policy-assumptions.v1.json      | 157 +++++++++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    | 118 +++++++
 ...policy-lab-external-validation-protocol.v1.json | 100 ++++++
 benchmark/gauntlet/policy-lab-specialized.v1.json  | 127 +++++++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   | 193 ++++++++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |  96 +++++
 docs/submission/README.md                          |  21 +-
 scripts/build_policy_lab_release_provenance.mjs    | 126 +++++++
 ...heck_policy_lab_external_gauntlet_protocols.mjs |  70 ++++
 scripts/run_policy_lab_specialized_gauntlet.mjs    | 388 +++++++++++++++++++++
 12 files changed, 1632 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md


Main-since-base overlap: (none)


### origin/feat/policy-lab-mcp-v0

Tip 6bdb11736664b108f300eb6e3b93ed168008f52e; merge base 51c36722702986e4f355434c566740526d8d93ee.

git cherry origin/main REF:
~~~text
+ 219528d7b29d91aae98bc6350b87904a483bcff1
+ 868541e6104d81107b701bdbd075b2ce114a8f6c
+ ab7f7eddbcb8e2a505387fc3f2fb57c68464bbef
+ 1ff8203d7e4e44b59d47a9fec9a91d0a66f13119
+ d11bd293e00c69254c47f7c3adf4acf7070f42d6
+ d710866df5e8bdaa863586397b398da0d4f0b92e
+ fff4c4ce9a9efdd1a796833192359ac5f455097c
+ 064499b9f7699b155a4b15150f540e64fc9d5ffe
+ 3bf0f2070f96675e8f7ccd1dd830219523ad89cd
+ f15817f8efa39905c62f914eb14b481a1d6c9c29
+ 39ea3446ae3eb4d82472b611330145f1a3696e59
+ 7c5dbd77812715c81e0ba6ce3e776cec92fbee8a
+ 366d67013636cc2a52cf525fb6484229c12ba980
+ 0992bc6ffd418f24635c3b470dbfe7ea8d1e98ab
+ 10f1aa59d58ef17732c087d27e014bb557db6f83
+ 023f9b0729a7ab78aa5415dbc83633e87a8bc181
+ d0d74f353154cf9a2f3df78a496cb3af413a9dfa
+ 6c61db880c761442693beba4a848063403b1bd86
+ 896142d7537f5bb52bf396ecd5bb2df2fd3f2a6f
+ 1bc32eb74546358636f79c24c9f88d301b59bc28
+ 5fef2c568ea8b5163fd3f3542e48180a0d185f6c
+ 00d1f55775b1a9b869748f8b461c2abe82b92842
+ 075f368a1a9b4827ecbd885031a36048c4327c91
+ 7f1a9134067c3a990c865f3e2d4752afd234b4ea
+ e46ad7901eaf1b76189656ca7dab7016684c0d87
+ 896f00268b2b2ce73005cc14c47c3bfc3966becb
+ 19c994fd5bd68d5c256b34ac04fca84946b0c1a2
+ 1cb56c4d6443577de2e38f32b46fb802bbf4a90a
+ e63391e6bc2f70037e7193939276aa42a78b4138
+ 3bff699f18484fe20ee2c95e68d30af98e7a3793
+ 9d41f70834a2bf156c9984d64bf2f2706dfc732e
+ 6dba390c98ebad3be72d47964c1d25180940b994
+ 3e7c11265535d2e20e53cce64bcda499de50df05
+ badaf7ffac974ac214726cd9bbb61c90c67fd824
+ 2ebd19fcfdd91dd4cd3f74ab734ff82b970378fa
+ c547992a8c3d569d4f9ff081ad9038ffed158658
+ 98fb931506467c081153e35961a93dcdca535e97
+ 55461cfac8fc12e852a5c7587409ea3eae1f6d95
+ 7a83a65825e67c93cff221d1a06448a9523fb98a
+ 5bd1a8f58a000e09a1f10e65cd15786b7fb7eb43
+ 92b5add55f8117dbc124abf4f8d4fc58ba209bd8
+ 7027deab011b8e5e14fefe3a59f1b2acb275176c
+ 21768d8165d09d6c4678a0bab3ba789e38e164b7
+ 7bf6f8cdb9bf3ca781293a4db99f0741b99c925d
+ 44243732b9620c814b9eaea4dbddd0589cb1d7dc
+ 87316c26cc746b934576c2d2f1c8f824b852842a
+ 6a4a145ce563ca76b33c456147472647afe8e836
+ 1a619d88005e3b4054262f3815a6d023073d7d28
+ 6bdb11736664b108f300eb6e3b93ed168008f52e
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/policy-lab-agent-gauntlet.yml    |  85 +++++
 .github/workflows/policy-lab-copilot-probe.yml     |  85 +++++
 .../workflows/policy-lab-copilot-sdk-gauntlet.yml  |  85 +++++
 .github/workflows/policy-lab-mcp.yml               |  37 ++
 packages/policy-lab-mcp/README.md                  | 110 ++++++
 packages/policy-lab-mcp/gauntlet/README.md         | 124 +++++++
 packages/policy-lab-mcp/gauntlet/build_cases.mjs   |  67 ++++
 .../gauntlet/build_reference_trace.mjs             | 227 +++++++++++++
 .../policy-lab-mcp/gauntlet/run_copilot_sdk.mjs    | 230 +++++++++++++
 .../policy-lab-mcp/gauntlet/run_github_models.mjs  | 330 ++++++++++++++++++
 packages/policy-lab-mcp/gauntlet/score_trace.mjs   | 214 ++++++++++++
 packages/policy-lab-mcp/gauntlet/spec.v1.json      | 157 +++++++++
 packages/policy-lab-mcp/package.json               |  25 ++
 packages/policy-lab-mcp/src/operations.mjs         | 309 +++++++++++++++++
 packages/policy-lab-mcp/src/server.mjs             | 371 +++++++++++++++++++++
 packages/policy-lab-mcp/src/stdio.mjs              |   5 +
 packages/policy-lab-mcp/test/gauntlet.test.mjs     | 142 ++++++++
 packages/policy-lab-mcp/test/mcp.test.mjs          | 299 +++++++++++++++++
 18 files changed, 2902 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-agent-gauntlet.yml; .github/workflows/policy-lab-copilot-probe.yml; .github/workflows/policy-lab-copilot-sdk-gauntlet.yml; .github/workflows/policy-lab-mcp.yml; packages/policy-lab-mcp/README.md; packages/policy-lab-mcp/gauntlet/README.md; packages/policy-lab-mcp/gauntlet/build_cases.mjs; packages/policy-lab-mcp/gauntlet/build_reference_trace.mjs; packages/policy-lab-mcp/gauntlet/run_copilot_sdk.mjs; packages/policy-lab-mcp/gauntlet/run_github_models.mjs; packages/policy-lab-mcp/gauntlet/score_trace.mjs; packages/policy-lab-mcp/gauntlet/spec.v1.json; packages/policy-lab-mcp/package.json; packages/policy-lab-mcp/src/operations.mjs; packages/policy-lab-mcp/src/server.mjs; packages/policy-lab-mcp/src/stdio.mjs; packages/policy-lab-mcp/test/gauntlet.test.mjs; packages/policy-lab-mcp/test/mcp.test.mjs


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/integration/portfolio-mcp-v1

Tip b4cfb025c77d25ef470859fbffe4945387cea812; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ abe8e875a3b0e1f9a2ba1ed2a195d3d78c2f8eb3
+ 7b160afa0e192adfb2f988110b7dd9d0a884d7c1
+ b4cfb025c77d25ef470859fbffe4945387cea812
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/portfolio-mcp.yml | 47 +++++++++++++++++++++++++++++++++++++
 integrations/mcp/bridge.mjs         | 11 +++++++++
 integrations/mcp/manifest.json      | 18 ++++++++++++++
 3 files changed, 76 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/portfolio-mcp.yml; integrations/mcp/bridge.mjs; integrations/mcp/manifest.json


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/audit/policy-lab-certification-20260910

Tip 41efe6a71d13d4460b758cc8daaec34986f5019e; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 84f29e5d37e7648b65ecb6f42e14a3db9ce28496
+ b7252ff17a2659f6b81687ccca36e77beb21827f
+ ae7eb92307ed6cdc7d782059f426978f269e5dac
- 84a105627bf48551bd310dc3b3efed2c26ea24de
+ c2417bae780a9b62a2d585da3c4e234fd04e5954
+ 41efe6a71d13d4460b758cc8daaec34986f5019e
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/external-case-001p-ausgrid.yml |  1 +
 .github/workflows/policy-lab-live-smoke.yml      | 31 ++++++++++++++++++------
 scripts/smoke_live_policy_lab.mjs                |  6 ++---
 3 files changed, 28 insertions(+), 10 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: .github/workflows/external-case-001p-ausgrid.yml; .github/workflows/policy-lab-live-smoke.yml; scripts/smoke_live_policy_lab.mjs


Main-since-base overlap: .github/workflows/external-case-001p-ausgrid.yml; .github/workflows/policy-lab-live-smoke.yml; scripts/smoke_live_policy_lab.mjs


### feat/paired-platform-shell

Tip dd484678907820c8ad1c31f6d0358bfa9de3ab1a; merge base 02b1bd237c38a66de10ac3503bbd22be6e3fff84.

git cherry origin/main REF:
~~~text
+ fd65c022060f64d5ce6fe8062b7019178027b7d2
+ dc5b9433c3dda7675c753ea7962fbdab24494f8e
+ 968b2764993b058027bbdfb70ae650036fc26eb9
+ 84c1ef3af322f4962b1b8a09b17b2f3d84cf5c01
+ 6556a958a06ee21c8dc5bcbdf1828b3b14a01139
+ 6eb20695af20a1e8c2d353857a9bec7b68176977
+ 5d9fef2b134ee89d2d04e48f65a41fba7c65b6d7
+ 4185ae7655f234c113a9d2e97d56c58d7de5e21c
+ aac1f21b5e6698709b06f4c97020fa1a852a850d
+ 3c14295cd6a8084e7e87d634dcc5dfe520f4db7d
+ 368478e19768e3bfe98256e16a8d573eff0d6d6c
+ 295dcfa985089778f94da3de564a9ebabeb7c9c4
+ c9bff78ef76e4926b4a443cda8522a4326638a9a
+ 9b8004f1f9b24067c39042d55d583ff6bbc154d3
+ 74f0df9d9db0324b5fb2a1404ffb36e701836c71
+ aaa2b15460e422be075bddd8153cf4e800994960
+ 60e568841bdf7de443036177c8fe78c4744a295f
+ ca7ba16d99b6ce00247a404e2f8224655393f75c
+ e7ba40fb4c6942e24aa82e90121b70e2243666b5
+ a383fc83801d2bd3c74d472e27c9873c8e91a19e
+ 034043d1f9bc937cadf985a3c1b90bb18a090a4c
+ aff7680109e78dcd03e82b217aa7f26ccc38edb0
+ 14f714fe3be8ed386ffdf6fabff159b72453cd9a
+ 7cc5984a35194d52b0a3f50cbfe9fd836b4c7add
+ a882bda5c8a635238f044b3071725a309fc641b6
+ 48a761d9996ceeb7c5ff708793108429b6a51c78
+ 931cc5dbc6ee20876d2d70c44a32f50fa1149649
+ f3c774161be07477a0034feddb286455341f7206
+ 12246dfa28d0b0f4fef543c8fb8c5ab64ce35006
+ 2605d63ff198a0e20ff51fcfd4e71756a2d411cf
+ 267138e9a5f4aff93af6e8eb0c3f295678e2a76d
+ 3d77d2d82da947ce8ed781c92633076f66a898fd
+ dd484678907820c8ad1c31f6d0358bfa9de3ab1a
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/case_workbench_v2.yml            |    4 +
 .github/workflows/constraint_protocol_alpha.yml    |    4 +
 .github/workflows/security-secrets.yml             |    4 +
 .github/workflows/solidity-security.yml            |    4 +
 .github/workflows/solidity-tests.yml               |    4 +
 .github/workflows/tests.yml                        |    4 +
 frontend/src/App.jsx                               |  199 +--
 frontend/src/app/FullAnalysisRouteGuard.jsx        |   40 +
 frontend/src/app/FullAnalysisRouteGuard.test.jsx   |   42 +
 frontend/src/app/routes.js                         |   37 +-
 frontend/src/app/routes.test.js                    |   41 +-
 frontend/src/components/LabOverview.jsx            |  585 ++++----
 frontend/src/components/LabOverview.test.jsx       |  159 +--
 frontend/src/components/platform/AnalysisLab.jsx   |  154 +++
 .../src/components/platform/FieldUseSurface.jsx    |  297 ++++
 .../components/platform/InvestigationSurface.jsx   |  216 +++
 .../src/components/platform/PlatformSurface.jsx    |   78 ++
 .../components/platform/PlatformSurfaces.test.jsx  |  311 +++++
 .../src/components/platform/ProgrammeSurface.jsx   |  231 ++++
 .../src/components/platform/ResearchSurface.jsx    |  218 +++
 .../src/components/platform/VerificationHub.jsx    |  272 ++++
 frontend/src/main.jsx                              |    2 +
 frontend/src/styles/pairedPlatform.css             |  388 ++++++
 frontend/src/styles/platformSurfaces.css           | 1421 ++++++++++++++++++++
 scripts/capture_case_workbench_v2.mjs              |   49 +-
 25 files changed, 4250 insertions(+), 514 deletions(-)
~~~

Equal tip blobs/presence: .github/workflows/security-secrets.yml; frontend/src/app/FullAnalysisRouteGuard.jsx; frontend/src/app/FullAnalysisRouteGuard.test.jsx; frontend/src/components/LabOverview.test.jsx; frontend/src/components/platform/PlatformSurface.jsx


Absent on main: (none)


Different tip blobs/presence: .github/workflows/case_workbench_v2.yml; .github/workflows/constraint_protocol_alpha.yml; .github/workflows/solidity-security.yml; .github/workflows/solidity-tests.yml; .github/workflows/tests.yml; frontend/src/App.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/components/LabOverview.jsx; frontend/src/components/platform/AnalysisLab.jsx; frontend/src/components/platform/FieldUseSurface.jsx; frontend/src/components/platform/InvestigationSurface.jsx; frontend/src/components/platform/PlatformSurfaces.test.jsx; frontend/src/components/platform/ProgrammeSurface.jsx; frontend/src/components/platform/ResearchSurface.jsx; frontend/src/components/platform/VerificationHub.jsx; frontend/src/main.jsx; frontend/src/styles/pairedPlatform.css; frontend/src/styles/platformSurfaces.css; scripts/capture_case_workbench_v2.mjs


Main-since-base overlap: .github/workflows/case_workbench_v2.yml; .github/workflows/constraint_protocol_alpha.yml; .github/workflows/security-secrets.yml; .github/workflows/solidity-security.yml; .github/workflows/solidity-tests.yml; .github/workflows/tests.yml; frontend/src/App.jsx; frontend/src/app/FullAnalysisRouteGuard.jsx; frontend/src/app/FullAnalysisRouteGuard.test.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/components/LabOverview.jsx; frontend/src/components/LabOverview.test.jsx; frontend/src/components/platform/AnalysisLab.jsx; frontend/src/components/platform/FieldUseSurface.jsx; frontend/src/components/platform/InvestigationSurface.jsx; frontend/src/components/platform/PlatformSurface.jsx; frontend/src/components/platform/PlatformSurfaces.test.jsx; frontend/src/components/platform/ProgrammeSurface.jsx; frontend/src/components/platform/ResearchSurface.jsx; frontend/src/components/platform/VerificationHub.jsx; frontend/src/main.jsx; frontend/src/styles/pairedPlatform.css; frontend/src/styles/platformSurfaces.css; scripts/capture_case_workbench_v2.mjs


### fix/backend-followup-2026-10-05

Tip ff44da42fa0c6df761a86d8c6859ec285d23421f; merge base 998b9f3d8f71bd01a1fc4a753c454d9509159fba.

git cherry origin/main REF:
~~~text
+ ff44da42fa0c6df761a86d8c6859ec285d23421f
~~~

git diff --stat origin/main...REF:
~~~text
 docs/ops/BACKEND_FOLLOWUP_2026-10-05.md      |  63 +++++++++++++
 energy_derivatives/README.md                 |   8 +-
 energy_derivatives/api/main.py               | 113 ++++++++++++++++++------
 energy_derivatives/api/rate_limits.py        |  65 ++++++++++++++
 energy_derivatives/tests/test_api.py         | 127 ++++++++++++++++++++++++++-
 energy_derivatives/tests/test_rate_limits.py |  55 ++++++++++++
 spk_v1/README.md                             |   4 +-
 spk_v1/src/spk_v1/api.py                     |  52 ++++++++---
 spk_v1/src/spk_v1/health.py                  |  30 +++++--
 spk_v1/src/spk_v1/lake.py                    |  28 ++++--
 spk_v1/src/spk_v1/runtime.py                 |  16 ++--
 spk_v1/src/spk_v1/service.py                 |  66 +++++++++++---
 spk_v1/src/spk_v1/storage.py                 |  35 ++++++++
 spk_v1/tests/test_api.py                     | 111 ++++++++++++++++++++++-
 spk_v1/tests/test_health.py                  |   7 +-
 spk_v1/tests/test_runtime.py                 |  72 ++++++++++++++-
 16 files changed, 771 insertions(+), 81 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: docs/ops/BACKEND_FOLLOWUP_2026-10-05.md; energy_derivatives/api/rate_limits.py; energy_derivatives/tests/test_rate_limits.py; spk_v1/src/spk_v1/storage.py


Different tip blobs/presence: energy_derivatives/README.md; energy_derivatives/api/main.py; energy_derivatives/tests/test_api.py; spk_v1/README.md; spk_v1/src/spk_v1/api.py; spk_v1/src/spk_v1/health.py; spk_v1/src/spk_v1/lake.py; spk_v1/src/spk_v1/runtime.py; spk_v1/src/spk_v1/service.py; spk_v1/tests/test_api.py; spk_v1/tests/test_health.py; spk_v1/tests/test_runtime.py


Main-since-base overlap: (none)


### package/policy-lab-release-v0.2.0

Tip 751da540f45666306359c19a39d0578b8f10a9cb; merge base c194a4f05e2f84b971a8fdf756ae02856dc3b1d9.

git cherry origin/main REF:
~~~text
+ 751da540f45666306359c19a39d0578b8f10a9cb
~~~

git diff --stat origin/main...REF:
~~~text
 AI_USAGE_DISCLOSURE.md                             |  37 ++++++++++++++++
 CHANGELOG.md                                       |  49 +++++++++++++++++++++
 Energy_As_Money_Polished_Thesis_Spine.docx         | Bin 54256 -> 0 bytes
 YZU_Phd_slide_deck (1).pptx                        | Bin 34708 -> 0 bytes
 ..._constraint_thesis_final_submission_v2 (1).docx | Bin 316330 -> 0 bytes
 5 files changed, 86 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: AI_USAGE_DISCLOSURE.md; CHANGELOG.md


Different tip blobs/presence: Energy_As_Money_Polished_Thesis_Spine.docx; YZU_Phd_slide_deck (1).pptx; energy_constraint_thesis_final_submission_v2 (1).docx


Main-since-base overlap: (none)


### origin/agent/case-workbench-v2

Tip 0b4488469adf039cbf68d1076615eb334dd9ff43; merge base 0b4488469adf039cbf68d1076615eb334dd9ff43.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/agent/case-workspace-polish

Tip 140ed4d04153edc5b654ae816f20ce21e2656833; merge base 8fc20aa1dc8f65e0a6d7e63fe18bbd9a1788e59a.

git cherry origin/main REF:
~~~text
+ 32083e75e22d873d6526cc52de44f950f3dd4e4a
+ 36e56657fee37124ded1790e3edf1d6f94711c1b
+ 3f274bacf751756f2f8c5a7d903d46414cb38ab2
+ 9c1ed2839e04ff3662169043297d9eecd666155d
+ 90de91ee32eb63d33a8f622f0208a8d2d031daac
+ 5b5fe368a1dec50f724b58d6bc3db743f46d5592
+ f33dd179b17301d512cf2f07e53b38d0939727f1
+ 0970054cf5d6b98a4bbcb5deadf32142e2a2b8c3
+ e917847d914112b0c7b8b5c23643b3efe49657ae
+ 140ed4d04153edc5b654ae816f20ce21e2656833
~~~

git diff --stat origin/main...REF:
~~~text
 docs/project/FIELD_VALIDATION_FREEZE.md            |  20 +-
 frontend/src/cases/CaseWorkbench.test.jsx          |  40 +-
 frontend/src/cases/CaseWorkspace.jsx               | 311 ++++++++++---
 frontend/src/main.jsx                              |   2 +
 .../src/styles/caseInvestigationLayoutTuning.css   |  23 +
 frontend/src/styles/caseInvestigationPolish.css    | 484 +++++++++++++++++++++
 scripts/capture_case_workbench_v2.mjs              |  35 +-
 7 files changed, 835 insertions(+), 80 deletions(-)
~~~

Equal tip blobs/presence: docs/project/FIELD_VALIDATION_FREEZE.md; frontend/src/styles/caseInvestigationLayoutTuning.css


Absent on main: (none)


Different tip blobs/presence: frontend/src/cases/CaseWorkbench.test.jsx; frontend/src/cases/CaseWorkspace.jsx; frontend/src/main.jsx; frontend/src/styles/caseInvestigationPolish.css; scripts/capture_case_workbench_v2.mjs


Main-since-base overlap: docs/project/FIELD_VALIDATION_FREEZE.md; frontend/src/cases/CaseWorkbench.test.jsx; frontend/src/cases/CaseWorkspace.jsx; frontend/src/main.jsx; frontend/src/styles/caseInvestigationLayoutTuning.css; frontend/src/styles/caseInvestigationPolish.css; scripts/capture_case_workbench_v2.mjs


### origin/agent/decision-brief

Tip f20154dbaa95e93861f658f2c8ca63f999170929; merge base f20154dbaa95e93861f658f2c8ca63f999170929.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/agent/flagship-decision-experience

Tip 151dfc75783416c3e3f29efcdf62a0adb7ff75dd; merge base 151dfc75783416c3e3f29efcdf62a0adb7ff75dd.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/agent/flagship-public-lab-foundation

Tip 80498fc63109f450d657b0d1a42deda1acada21a; merge base 717ffa1651472d4d47158313d717188f04444227.

git cherry origin/main REF:
~~~text
+ c4f520881337bd2ab834ba178970053ae59b06cd
+ 2074901e2398f96ab7a649a6e5cdee9dc5cb8438
+ 3f4df4f3774e39530b1860df76a79aecaced8560
+ 17e1ac5ca04410d0c7b2f26f531474ef62ec4b16
+ 1b5dcef22642d5bd95519b7050f7158930371c85
+ bdfda55001808e71adeadf53d29325a271f6e64a
+ 1920de7238e2cbbf3ffac384262eb37639448eaf
+ 2924e41e5957b59842ff90c7bf3342698afc82a0
+ ec3730001df1d799971a9fb63bf5849c379b97e2
+ 63f737054ace0bc498846298f4aae8fd257e5395
+ 4688e9ff5b81b073a722c5cc83789e7262937b19
+ 8a0af1881d6cb7855e8147d3e62c0e9626e249f0
+ c60ba63396903918dc5949fa2d48be95b0814470
+ bc7610c4f35dc71c84dba7d2a89bcda6590c5e81
+ e5ec8f537bd4b860050994598a9f9d2aaea22791
+ 22c070d502a9f54aa9b7d016278e117abcd28c2e
+ f8f609aa97d593a8840e2dd048f1d84fa535d632
+ 855ff4442d0a41303fbedd555be638069d5ae6cd
+ de5c5a2fab3650b5cac262b7fa4ea82eb49868db
+ 5952195dcca18274a6a7773d2eedbbb53cf75053
+ 261c3832165474834ee2aa60f3b2f684a313bceb
+ 9f96429056149e82d187b6cabea80fcacd8ecee0
+ fc1cd69b24bda840c008efbbc7e897a25edde015
+ 892046b6358e97e8bf7ec19ad103b4944051d2a8
+ a510d6c1a2b7635a8854ed5d29418c54bd887f00
+ d88b51386391454ee4c2dede8b8d015b84e0a245
+ f80a7d95ca21efdff7011b3281f13aa5aa7dae99
+ cb9719a781b5ca8f620914fcf4032fd164361646
+ 630355641d92bc80532bada8af5d5d2b1bbe257a
+ 3eb832d9e2943e9b35bd287237354fb6933776c3
+ 3f56d996c9937ee5d754d10976ae010c8aa108fc
+ 0948545df46a4e13c5ff3b27916ee8f942548b3e
+ 6d1eddc0ff462e12e7b92de7eb09cdaead9afb13
+ b84d66b1c78aa695cd8125b3ac0126d5c3e9e948
+ 1e6280c479c90d15fb185f69ce0963c6b3f60422
+ d5a263b22f5bad344260c1a34cb1f8f2c0d13739
+ f8a8088f3b80013b4cf6dc35f34750db1687f167
+ cda2aee29f79f259b8c839130d60359e400deca2
+ d5b5a234a1592a2f664db378f4780f846d3a4547
+ 91c8fa69ba0e16a675643ba98af20c09b212b069
+ 41d0416cfc9457176dcc7f1cec650010f3f2fe47
+ 049cea041780b9a723bf0ec838a1441cc3135bb1
+ 80498fc63109f450d657b0d1a42deda1acada21a
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/case_workbench_v2.yml          |   4 +
 .github/workflows/deploy.yml                     |  21 +-
 frontend/src/App.jsx                             | 102 +++--
 frontend/src/app/routes.js                       |  75 +++-
 frontend/src/app/routes.test.js                  |  67 ++-
 frontend/src/cases/CaseWorkspace.jsx             |  75 +++-
 frontend/src/cases/lenses/ConstraintsLens.jsx    |  11 +-
 frontend/src/compare/CompareWorkspace.jsx        |  87 +++-
 frontend/src/compare/CompareWorkspace.test.jsx   |   7 +-
 frontend/src/compare/PolicyDiffPanel.jsx         | 236 ++++++++++
 frontend/src/compare/PolicyDiffPanel.test.jsx    |  60 +++
 frontend/src/components/LabOverview.jsx          | 168 +++++++
 frontend/src/lib/caseWorkbenchRuntime.js         |  22 +-
 frontend/src/lib/caseWorkbenchRuntime.test.js    |  39 +-
 frontend/src/lib/researchCapsule.js              | 254 ++++++++++-
 frontend/src/receipts/ReceiptsWorkspace.jsx      | 127 +++++-
 frontend/src/receipts/ReceiptsWorkspace.test.jsx |   6 +-
 frontend/src/styles/flagshipHardening.css        | 538 +++++++++++++++++++++++
 frontend/src/styles/labOverview.css              | 406 +++++++++++++++++
 packages/constraint-core/package.json            |   9 +-
 packages/constraint-core/src/workbench.js        |  83 ++++
 scripts/capture_case_workbench_v2.mjs            |  44 +-
 scripts/check_frontend_bundle.mjs                |  47 ++
 23 files changed, 2356 insertions(+), 132 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/cases/lenses/ConstraintsLens.jsx; frontend/src/compare/PolicyDiffPanel.test.jsx; frontend/src/lib/caseWorkbenchRuntime.js; frontend/src/lib/caseWorkbenchRuntime.test.js; scripts/check_frontend_bundle.mjs


Absent on main: (none)


Different tip blobs/presence: .github/workflows/case_workbench_v2.yml; .github/workflows/deploy.yml; frontend/src/App.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/cases/CaseWorkspace.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/compare/PolicyDiffPanel.jsx; frontend/src/components/LabOverview.jsx; frontend/src/lib/researchCapsule.js; frontend/src/receipts/ReceiptsWorkspace.jsx; frontend/src/receipts/ReceiptsWorkspace.test.jsx; frontend/src/styles/flagshipHardening.css; frontend/src/styles/labOverview.css; packages/constraint-core/package.json; packages/constraint-core/src/workbench.js; scripts/capture_case_workbench_v2.mjs


Main-since-base overlap: .github/workflows/case_workbench_v2.yml; .github/workflows/deploy.yml; frontend/src/App.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/cases/CaseWorkspace.jsx; frontend/src/cases/lenses/ConstraintsLens.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/compare/PolicyDiffPanel.jsx; frontend/src/compare/PolicyDiffPanel.test.jsx; frontend/src/components/LabOverview.jsx; frontend/src/lib/caseWorkbenchRuntime.js; frontend/src/lib/caseWorkbenchRuntime.test.js; frontend/src/lib/researchCapsule.js; frontend/src/receipts/ReceiptsWorkspace.jsx; frontend/src/receipts/ReceiptsWorkspace.test.jsx; frontend/src/styles/flagshipHardening.css; frontend/src/styles/labOverview.css; packages/constraint-core/package.json; packages/constraint-core/src/workbench.js; scripts/capture_case_workbench_v2.mjs; scripts/check_frontend_bundle.mjs


### origin/agent/studies-proof-layer

Tip 1c7106bf2a22f0b84109d2d7fb46d39770eca0f1; merge base 65efde743b210dd65e975a9e204708d979f1ca14.

git cherry origin/main REF:
~~~text
+ 09285f54ebc46652e6e2438e7546c6d1a2223d54
+ 930212b9728b81cfd64405e4f6e9b418a17709e8
+ d992de6d7dd107d7664ec8e11865789d27c8c862
+ db7a114956ff515002cca7250735b6d5aa9d986c
+ 4b5b0e1073066a64d0de0a132ca9ee066108f2a3
+ 1c7106bf2a22f0b84109d2d7fb46d39770eca0f1
~~~

git diff --stat origin/main...REF:
~~~text
 frontend/src/components/StudyProofNavigator.jsx    | 152 +++++++++++
 .../src/components/StudyProofNavigator.test.jsx    | 102 +++++++
 frontend/src/main.jsx                              |   2 +
 frontend/src/styles/studyProofLayer.css            | 301 +++++++++++++++++++++
 scripts/capture_case_workbench_v2.mjs              |  30 +-
 5 files changed, 585 insertions(+), 2 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/components/StudyProofNavigator.test.jsx


Absent on main: (none)


Different tip blobs/presence: frontend/src/components/StudyProofNavigator.jsx; frontend/src/main.jsx; frontend/src/styles/studyProofLayer.css; scripts/capture_case_workbench_v2.mjs


Main-since-base overlap: frontend/src/components/StudyProofNavigator.jsx; frontend/src/components/StudyProofNavigator.test.jsx; frontend/src/main.jsx; frontend/src/styles/studyProofLayer.css; scripts/capture_case_workbench_v2.mjs


### origin/case/public-external-001p-ausgrid

Tip e566b8120316c4600eee97e9454d3bd40d52dbd4; merge base b841e49aba353d6824370ffbe04af0eeee7fb6c4.

git cherry origin/main REF:
~~~text
+ 1810e01fe7fcb375b8385f3a684778f14da4df3f
+ bb2dbc1df2523570594d14a1dc0dbbbc1f0fc213
+ cb624e523f76075310fef269a15c54a407d4f5b0
+ 71149f90ddbc06145bd7b4790d5c929839f6f4c0
+ 84b074ebf5d3772b9a0e97f54e7b040a893bf147
+ 9e5ca2bf9ad57484ba29c431e3d936d610ff74eb
+ e566b8120316c4600eee97e9454d3bd40d52dbd4
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/external-case-001p-ausgrid.yml | 103 +++++
 scripts/external_case_001p_ausgrid.mjs           | 477 +++++++++++++++++++++++
 2 files changed, 580 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: .github/workflows/external-case-001p-ausgrid.yml; scripts/external_case_001p_ausgrid.mjs


Main-since-base overlap: .github/workflows/external-case-001p-ausgrid.yml; scripts/external_case_001p_ausgrid.mjs


### origin/design/policy-lab-external-packaging

Tip 935747b82162935585fe9dd8c8851f3563fe4624; merge base 51c36722702986e4f355434c566740526d8d93ee.

git cherry origin/main REF:
~~~text
+ 80aec208431520c092523f9b359346f13eeaae79
+ 1325beffbd2af4a5ec8b58cfa0343046efa428a7
+ 1a472accad901972c654253018433fbe9e8f1e2b
+ ea1a6938a192e70bbfb2f847e56fc8dc27901142
+ 7009303970e4504c6385a14c26ab9cd829a806b1
+ db3b99f19bbf8a67c100187022fe1a52cab176c8
+ 9f4e57df1f3c502eb340622b973417fad213b4d7
+ fae1c515479b05755238d887d8ae7e2dddd817c2
+ ad536949cc30df48260e07041ec792046cdcd85b
+ 759dd0c6cd097f9da4f4a47a7bffda39e1c2a999
+ 5cb21e8494172cefce45e976624de77f8de57c82
+ bb9042cc0b9f5a2d2b6976d7a9064a0d9e29b940
+ 9747914bbb610d526810f41503627ce5e5d9705c
+ 74d598cb21f788c74b97e7bb7b287cff88de4a5f
+ bf02f7474453b1777edc99f3c76a569d0cd3311b
+ b76e363ac880ccb35db426e334ae8ae2381dbc45
+ 6301ef1ba77afec91a239afd14abee8d8b05880b
+ 9267125544516f3438b0f37590abff9ec5af6fb4
+ d68014e3231c6d2e46c0a3ce866b1e629f1cfd04
+ 935747b82162935585fe9dd8c8851f3563fe4624
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/external-case-001p-ausgrid.yml   |  35 +-
 .../POLICY_LAB_EXTERNAL_PACKAGING_ARCHITECTURE.md  | 488 +++++++++++++++++++++
 docs/product/POLICY_LAB_P0_PACKAGING_AUDIT.md      | 386 ++++++++++++++++
 docs/product/POLICY_LAB_PACKAGING_DECISION.md      | 383 ++++++++++++++++
 .../claim-assessment-package.v0.1.schema.json      | 297 +++++++++++++
 scripts/build_claim_assessment_package.mjs         | 253 +++++++++++
 scripts/lib/claim_assessment_package_v0_1.mjs      | 353 +++++++++++++++
 scripts/verify_claim_assessment_package.mjs        | 160 +++++++
 8 files changed, 2354 insertions(+), 1 deletion(-)
~~~

Equal tip blobs/presence: protocol/schema/claim-assessment-package.v0.1.schema.json; scripts/build_claim_assessment_package.mjs; scripts/lib/claim_assessment_package_v0_1.mjs; scripts/verify_claim_assessment_package.mjs


Absent on main: docs/product/POLICY_LAB_EXTERNAL_PACKAGING_ARCHITECTURE.md; docs/product/POLICY_LAB_P0_PACKAGING_AUDIT.md; docs/product/POLICY_LAB_PACKAGING_DECISION.md


Different tip blobs/presence: .github/workflows/external-case-001p-ausgrid.yml


Main-since-base overlap: .github/workflows/external-case-001p-ausgrid.yml; protocol/schema/claim-assessment-package.v0.1.schema.json; scripts/build_claim_assessment_package.mjs; scripts/lib/claim_assessment_package_v0_1.mjs; scripts/verify_claim_assessment_package.mjs


### origin/digital-tax/archive-metadata-20260915

Tip aa7167c45d8e0a38f3c8ce6f31b7a0bad078825b; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 4a83bdf98def635bbe6750615137e652c3e4998c
+ 86b35a4acae9eeae69b003dba3ad25e845f9a143
+ de578cf86ce17542e346fb220224c711d2dfd88d
+ 0c3f35eaad64772e9906a92c31e5c49877756b6b
+ 6de2fdd9b31ccc7ab11cee85a9e831213e495ac0
+ 6d10a372ee618686a6175828a852b38e39ddbbac
+ b5895e5741bdb0cfb3e8f8553dd062c24412e89c
+ 8fc6ff15a0b3e3a70db0c9f8fc7de875d5a5babd
+ 5a2f3e95d2453d124cbcb2715e3491f2eb16f421
+ 83d72400bce8c04673cfe8a8289ed3ce12e04940
+ 0a614a973b1aac256eb84944d10b80388ecde98e
+ 70a8beb8c01eeebe6a2c983d787fea9c29adab56
+ e771791eed4f6ef24fd7ec514e526cc0e4015dc0
+ ae9e04d11a6df68fd922343fbc83b7ba525a8fe8
+ e79b19f3e0ab8ab3d06c260e7962c58d82db60e3
+ daea9bcfc2888b99691bd58da07b90c92787d84c
+ b950a4be30fba9085a3cfee3eece717f25bc60ad
+ 26a816a7f9fbb7e77044b4ee51a57f787fd1b3f3
+ cc80611da0b080ec8cfd9e8a68e10d6154c4333b
+ 0572c9891da0761ed2c89e334c00450dc8e4a1b5
+ 70df6ea85812d8594891f15dd47c8f4966be06c8
+ febdf26d19b42aea3ec940f3328ef4bdccd2a06d
+ ba72177b2e0e7558f6a25c24b5fe5269bde43ea6
+ 8b89f755bc75f7c2a67b908e3adeb663ecd21b0e
+ c63e2889c6e26f854be23d8424f654c930dd05b4
+ 3f37fae9c59ccdf8f9b1f0eb15e367641e8c96ce
+ f371856bf38f5425d7013f2ed1782e0207c0e08c
+ 6ea223aa422e974abf0bc35964c3817b724e33b7
+ 3cf06d222924db3c144166664958dc7eb8b95143
+ e3143cb0bf74e5488e094c0f2ad81cd1b2c0b104
+ 565bf42c5e784e180dede1f380355a5f80f2b8df
+ 0162553c83bc51adc0083cfaf2458f1d1da7c426
+ 9bad04a78afc90c1a1a48431a252f48fb31f772a
+ 163435a53819bbc21d55988758d5c2d633f37b87
+ b25488f3d158b0fc3f060a576e64cd6e2d054c9a
+ 663e0c29bc0d7a65ebeee5f28cb0c647c033cada
+ f2d70167fbcaed09463eb5b90288f59fae41d112
+ a2f1361a0579aef877c4e5e68094d36fb1033a44
+ b2ff75235344295b6e2fa3ee80a6b4475a5498e6
+ 58074d3256974503d8e7eec87012379023edb02a
+ f3db9a535814805bce4eeaa914bbaca75de38de8
+ 61f32de101ea9233188549c738fb13d16e799039
+ c37789242d16b9644c8410a089a11bbef65c4b53
+ 60bddc40afa405bfd44971cd60793091b3dfbabe
+ 8b4c64b15e69018b4ff0b297f9178fabf83d7393
+ cadf90e4e59a13852ba5dc61329794c142c32005
+ 86fb7701d307495e2a81455f4174218d8749f58b
+ eb19d689edda3e67f8e54cd817d660f6ab99ad7d
+ 149da77c25677dc0fa45c0a034bf5e002305b1e4
+ fae93d64c3a108442394f1b7e21965d2691dcfe2
+ ea8a76656edbd74a524508dadba4056651e1ba3e
+ 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd
+ 146002fc8adb441cf6c1ab8c0b1f2a218c7d119f
+ 5282e507be73f33b3019181effaefdbef8ce6661
+ b69912eb96d8b439ccaea85638b47e40996b37b0
+ f0171a78ed3a9129ef044f6bd1b87959eaa24cf3
+ b7ae389e785f8b45fa7eed84a78995cc0911449a
+ aa7167c45d8e0a38f3c8ce6f31b7a0bad078825b
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/digital-tax-package.yml          |  49 +++
 IE-JDE/Digital_Tax_Design/README.md                | 324 ++++----------
 .../rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md       |  47 ++
 .../rebuilt_2026/BOUNDARY_CASES.csv                |   8 +
 .../rebuilt_2026/CASE_CHRONOLOGY.csv               |  16 +
 .../Digital_Tax_Design/rebuilt_2026/CITATION.cff   |  27 ++
 .../rebuilt_2026/CLAIM_BOUNDARIES.md               | 125 ++++++
 .../rebuilt_2026/CLAIM_REGISTER.csv                |  41 ++
 .../rebuilt_2026/CODING_RULES.md                   | 120 ++++++
 .../rebuilt_2026/COMPARATIVE_PROPOSITIONS.md       | 211 +++++++++
 .../rebuilt_2026/COUNTRY_ARCHITECTURE.csv          |   6 +
 .../rebuilt_2026/COUNTRY_PATH_CODINGS.csv          |   8 +
 .../rebuilt_2026/DERIVED_ARCHITECTURE_SUMMARY.md   |  77 ++++
 .../rebuilt_2026/FIGURES_TABLES_SPEC.md            | 264 ++++++++++++
 ...CAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md | 452 ++++++++++++++++++++
 ...ISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md | 473 +++++++++++++++++++++
 .../rebuilt_2026/FULL_CAPACITY_RESEARCH_PLAN.md    | 251 +++++++++++
 .../rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md      | 363 ++++++++++++++++
 .../rebuilt_2026/INTERNAL_AUDIT_2026-09-14.md      | 236 ++++++++++
 .../rebuilt_2026/LITERATURE_POSITIONING.md         | 200 +++++++++
 .../rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv         |  24 ++
 .../rebuilt_2026/NODE_SELECTION_CONDITIONS.csv     |   8 +
 .../rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md    | 158 +++++++
 .../rebuilt_2026/OPERATIONAL_CAPACITY_LAYER.md     | 179 ++++++++
 .../rebuilt_2026/OPERATIONAL_CAPACITY_MATRIX.csv   |   6 +
 .../OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md       |  58 +++
 .../rebuilt_2026/PACKAGE_MANIFEST.md               | 193 +++++++++
 .../rebuilt_2026/PUBLICATION_READINESS.md          | 104 +++++
 .../rebuilt_2026/QUALITY_GATE.md                   | 255 +++++++++++
 IE-JDE/Digital_Tax_Design/rebuilt_2026/README.md   | 139 ++++++
 .../RECONCILIATION_EVIDENCE_MATRIX.csv             |   6 +
 .../rebuilt_2026/REVIEWER_RISK_REGISTER.md         | 272 ++++++++++++
 .../ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md           | 228 ++++++++++
 .../rebuilt_2026/SOURCE_CATALOG.csv                |  44 ++
 .../rebuilt_2026/SUBMISSION_MATERIALS.md           | 149 +++++++
 .../rebuilt_2026/VALIDATION_REPORT_2026-09-14.md   |  43 ++
 .../rebuilt_2026/VENUE_ROUTE_EJTR.md               |  95 +++++
 .../ZENODO_EXTERNAL_SHA256SUMS_2026-09-15.txt      |   2 +
 .../ZENODO_RELEASE_MANIFEST_2026-09-15.md          | 220 ++++++++++
 .../rebuilt_2026/build_zenodo_bundle.py            | 259 +++++++++++
 .../rebuilt_2026/derive_comparative_findings.py    | 177 ++++++++
 .../rebuilt_2026/validate_boundary_layer.py        | 128 ++++++
 .../rebuilt_2026/validate_operational_capacity.py  | 117 +++++
 .../rebuilt_2026/validate_package.py               | 369 ++++++++++++++++
 .../rebuilt_2026/validate_publication_candidate.py | 111 +++++
 45 files changed, 6392 insertions(+), 250 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/digital-tax-package.yml; IE-JDE/Digital_Tax_Design/rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/BOUNDARY_CASES.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CASE_CHRONOLOGY.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CITATION.cff; IE-JDE/Digital_Tax_Design/rebuilt_2026/CLAIM_BOUNDARIES.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/CLAIM_REGISTER.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CODING_RULES.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/COMPARATIVE_PROPOSITIONS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/COUNTRY_ARCHITECTURE.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/COUNTRY_PATH_CODINGS.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/DERIVED_ARCHITECTURE_SUMMARY.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FIGURES_TABLES_SPEC.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FULL_CAPACITY_RESEARCH_PLAN.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/INTERNAL_AUDIT_2026-09-14.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/LITERATURE_POSITIONING.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/NODE_SELECTION_CONDITIONS.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/OPERATIONAL_CAPACITY_LAYER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/OPERATIONAL_CAPACITY_MATRIX.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/PACKAGE_MANIFEST.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/PUBLICATION_READINESS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/QUALITY_GATE.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/README.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/RECONCILIATION_EVIDENCE_MATRIX.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/REVIEWER_RISK_REGISTER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/SOURCE_CATALOG.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/SUBMISSION_MATERIALS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/VALIDATION_REPORT_2026-09-14.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/VENUE_ROUTE_EJTR.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/ZENODO_EXTERNAL_SHA256SUMS_2026-09-15.txt; IE-JDE/Digital_Tax_Design/rebuilt_2026/ZENODO_RELEASE_MANIFEST_2026-09-15.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/build_zenodo_bundle.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/derive_comparative_findings.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_boundary_layer.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_operational_capacity.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_package.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_publication_candidate.py


Different tip blobs/presence: IE-JDE/Digital_Tax_Design/README.md


Main-since-base overlap: (none)


### origin/digital-tax/rebuild-2026

Tip 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 4a83bdf98def635bbe6750615137e652c3e4998c
+ 86b35a4acae9eeae69b003dba3ad25e845f9a143
+ de578cf86ce17542e346fb220224c711d2dfd88d
+ 0c3f35eaad64772e9906a92c31e5c49877756b6b
+ 6de2fdd9b31ccc7ab11cee85a9e831213e495ac0
+ 6d10a372ee618686a6175828a852b38e39ddbbac
+ b5895e5741bdb0cfb3e8f8553dd062c24412e89c
+ 8fc6ff15a0b3e3a70db0c9f8fc7de875d5a5babd
+ 5a2f3e95d2453d124cbcb2715e3491f2eb16f421
+ 83d72400bce8c04673cfe8a8289ed3ce12e04940
+ 0a614a973b1aac256eb84944d10b80388ecde98e
+ 70a8beb8c01eeebe6a2c983d787fea9c29adab56
+ e771791eed4f6ef24fd7ec514e526cc0e4015dc0
+ ae9e04d11a6df68fd922343fbc83b7ba525a8fe8
+ e79b19f3e0ab8ab3d06c260e7962c58d82db60e3
+ daea9bcfc2888b99691bd58da07b90c92787d84c
+ b950a4be30fba9085a3cfee3eece717f25bc60ad
+ 26a816a7f9fbb7e77044b4ee51a57f787fd1b3f3
+ cc80611da0b080ec8cfd9e8a68e10d6154c4333b
+ 0572c9891da0761ed2c89e334c00450dc8e4a1b5
+ 70df6ea85812d8594891f15dd47c8f4966be06c8
+ febdf26d19b42aea3ec940f3328ef4bdccd2a06d
+ ba72177b2e0e7558f6a25c24b5fe5269bde43ea6
+ 8b89f755bc75f7c2a67b908e3adeb663ecd21b0e
+ c63e2889c6e26f854be23d8424f654c930dd05b4
+ 3f37fae9c59ccdf8f9b1f0eb15e367641e8c96ce
+ f371856bf38f5425d7013f2ed1782e0207c0e08c
+ 6ea223aa422e974abf0bc35964c3817b724e33b7
+ 3cf06d222924db3c144166664958dc7eb8b95143
+ e3143cb0bf74e5488e094c0f2ad81cd1b2c0b104
+ 565bf42c5e784e180dede1f380355a5f80f2b8df
+ 0162553c83bc51adc0083cfaf2458f1d1da7c426
+ 9bad04a78afc90c1a1a48431a252f48fb31f772a
+ 163435a53819bbc21d55988758d5c2d633f37b87
+ b25488f3d158b0fc3f060a576e64cd6e2d054c9a
+ 663e0c29bc0d7a65ebeee5f28cb0c647c033cada
+ f2d70167fbcaed09463eb5b90288f59fae41d112
+ a2f1361a0579aef877c4e5e68094d36fb1033a44
+ b2ff75235344295b6e2fa3ee80a6b4475a5498e6
+ 58074d3256974503d8e7eec87012379023edb02a
+ f3db9a535814805bce4eeaa914bbaca75de38de8
+ 61f32de101ea9233188549c738fb13d16e799039
+ c37789242d16b9644c8410a089a11bbef65c4b53
+ 60bddc40afa405bfd44971cd60793091b3dfbabe
+ 8b4c64b15e69018b4ff0b297f9178fabf83d7393
+ cadf90e4e59a13852ba5dc61329794c142c32005
+ 86fb7701d307495e2a81455f4174218d8749f58b
+ eb19d689edda3e67f8e54cd817d660f6ab99ad7d
+ 149da77c25677dc0fa45c0a034bf5e002305b1e4
+ fae93d64c3a108442394f1b7e21965d2691dcfe2
+ ea8a76656edbd74a524508dadba4056651e1ba3e
+ 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/digital-tax-package.yml          |  49 +++
 IE-JDE/Digital_Tax_Design/README.md                | 324 ++++----------
 .../rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md       |  47 ++
 .../rebuilt_2026/BOUNDARY_CASES.csv                |   8 +
 .../rebuilt_2026/CASE_CHRONOLOGY.csv               |  16 +
 .../rebuilt_2026/CLAIM_BOUNDARIES.md               | 125 ++++++
 .../rebuilt_2026/CLAIM_REGISTER.csv                |  41 ++
 .../rebuilt_2026/CODING_RULES.md                   | 120 ++++++
 .../rebuilt_2026/COMPARATIVE_PROPOSITIONS.md       | 211 +++++++++
 .../rebuilt_2026/COUNTRY_ARCHITECTURE.csv          |   6 +
 .../rebuilt_2026/COUNTRY_PATH_CODINGS.csv          |   8 +
 .../rebuilt_2026/DERIVED_ARCHITECTURE_SUMMARY.md   |  77 ++++
 .../rebuilt_2026/FIGURES_TABLES_SPEC.md            | 264 ++++++++++++
 ...CAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md | 452 ++++++++++++++++++++
 ...ISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md | 473 +++++++++++++++++++++
 .../rebuilt_2026/FULL_CAPACITY_RESEARCH_PLAN.md    | 251 +++++++++++
 .../rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md      | 363 ++++++++++++++++
 .../rebuilt_2026/INTERNAL_AUDIT_2026-09-14.md      | 236 ++++++++++
 .../rebuilt_2026/LITERATURE_POSITIONING.md         | 200 +++++++++
 .../rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv         |  24 ++
 .../rebuilt_2026/NODE_SELECTION_CONDITIONS.csv     |   8 +
 .../rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md    | 158 +++++++
 .../rebuilt_2026/OPERATIONAL_CAPACITY_LAYER.md     | 179 ++++++++
 .../rebuilt_2026/OPERATIONAL_CAPACITY_MATRIX.csv   |   6 +
 .../OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md       |  58 +++
 .../rebuilt_2026/PACKAGE_MANIFEST.md               | 193 +++++++++
 .../rebuilt_2026/PUBLICATION_READINESS.md          | 104 +++++
 .../rebuilt_2026/QUALITY_GATE.md                   | 255 +++++++++++
 IE-JDE/Digital_Tax_Design/rebuilt_2026/README.md   | 139 ++++++
 .../RECONCILIATION_EVIDENCE_MATRIX.csv             |   6 +
 .../rebuilt_2026/REVIEWER_RISK_REGISTER.md         | 272 ++++++++++++
 .../ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md           | 228 ++++++++++
 .../rebuilt_2026/SOURCE_CATALOG.csv                |  44 ++
 .../rebuilt_2026/SUBMISSION_MATERIALS.md           | 149 +++++++
 .../rebuilt_2026/VALIDATION_REPORT_2026-09-14.md   |  43 ++
 .../rebuilt_2026/VENUE_ROUTE_EJTR.md               |  95 +++++
 .../rebuilt_2026/derive_comparative_findings.py    | 177 ++++++++
 .../rebuilt_2026/validate_boundary_layer.py        | 128 ++++++
 .../rebuilt_2026/validate_operational_capacity.py  | 117 +++++
 .../rebuilt_2026/validate_package.py               | 369 ++++++++++++++++
 .../rebuilt_2026/validate_publication_candidate.py | 111 +++++
 41 files changed, 5884 insertions(+), 250 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/digital-tax-package.yml; IE-JDE/Digital_Tax_Design/rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/BOUNDARY_CASES.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CASE_CHRONOLOGY.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CLAIM_BOUNDARIES.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/CLAIM_REGISTER.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/CODING_RULES.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/COMPARATIVE_PROPOSITIONS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/COUNTRY_ARCHITECTURE.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/COUNTRY_PATH_CODINGS.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/DERIVED_ARCHITECTURE_SUMMARY.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FIGURES_TABLES_SPEC.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/FULL_CAPACITY_RESEARCH_PLAN.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/INTERNAL_AUDIT_2026-09-14.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/LITERATURE_POSITIONING.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/NODE_SELECTION_CONDITIONS.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/OPERATIONAL_CAPACITY_LAYER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/OPERATIONAL_CAPACITY_MATRIX.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/OVERLAP_CONTROL_WITH_INVISIBLE_LEDGER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/PACKAGE_MANIFEST.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/PUBLICATION_READINESS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/QUALITY_GATE.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/README.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/RECONCILIATION_EVIDENCE_MATRIX.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/REVIEWER_RISK_REGISTER.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/ROBUSTNESS_AND_RIVAL_EXPLANATIONS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/SOURCE_CATALOG.csv; IE-JDE/Digital_Tax_Design/rebuilt_2026/SUBMISSION_MATERIALS.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/VALIDATION_REPORT_2026-09-14.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/VENUE_ROUTE_EJTR.md; IE-JDE/Digital_Tax_Design/rebuilt_2026/derive_comparative_findings.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_boundary_layer.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_operational_capacity.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_package.py; IE-JDE/Digital_Tax_Design/rebuilt_2026/validate_publication_candidate.py


Different tip blobs/presence: IE-JDE/Digital_Tax_Design/README.md


Main-since-base overlap: (none)


### origin/docs/consolidate-program-packaging

Tip 038c6c26a181962ca0e0d7cb87e1f59bcddf4fbf; merge base 841df2ce0b45427eb2292624a25a5d291fc5c949.

git cherry origin/main REF:
~~~text
+ 790e5b4a70d3032689147e6a2ee9e2965abf1000
+ 13cdfeddeccaed213ba758d13e8968b53204e33a
+ 038c6c26a181962ca0e0d7cb87e1f59bcddf4fbf
~~~

git diff --stat origin/main...REF:
~~~text
 PROJECT_RECOVERY.md                                |  23 +-
 .../CLAUDE_POLICY_LAB_DESIGN_REVIEW_BRIEF.md       | 255 +++++++++++
 .../PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md        | 509 +++++++++++++++++++++
 3 files changed, 779 insertions(+), 8 deletions(-)
~~~

Equal tip blobs/presence: docs/project/CLAUDE_POLICY_LAB_DESIGN_REVIEW_BRIEF.md; docs/project/PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md


Absent on main: (none)


Different tip blobs/presence: PROJECT_RECOVERY.md


Main-since-base overlap: PROJECT_RECOVERY.md; docs/project/CLAUDE_POLICY_LAB_DESIGN_REVIEW_BRIEF.md; docs/project/PROGRAM_PACKAGING_AND_LAB_UX_HANDOFF.md


### origin/docs/external-review-adoption-operating-kit

Tip 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6; merge base 45eb37afaad7a22c3f343247cbf6d719eb3eb19a.

git cherry origin/main REF:
~~~text
+ c07b116709368d22a98906dac26ddd24a90d4f3f
+ 0c189c348d0b1cf3f54bfedd66d8ea07b0a2557b
+ cb44058a06f7e4b641a4aba130caaaf75d041745
+ 714b2c733168aec88b5dcd71686a6baf6acf3204
+ 9238c1b8f3122cede1449144f70912e1f43593ee
+ 8dc5c9f6a5973359c97ad8b666e2262bc6ef78b6
~~~

git diff --stat origin/main...REF:
~~~text
 submission/EXTERNAL_REVIEW_PROTOCOL.md             | 275 ++++++++++++++++++++
 submission/INSTITUTIONAL_DISCOVERY_PROTOCOL.md     | 282 +++++++++++++++++++++
 .../PRE_EXISTING_ASSET_AND_LICENSE_INVENTORY.md    | 235 +++++++++++++++++
 submission/README.md                               |  44 ++--
 .../templates/EXTERNAL_REVIEW_RECORD_TEMPLATE.md   | 105 ++++++++
 .../STAKEHOLDER_AND_PILOT_RECORD_TEMPLATE.md       | 167 ++++++++++++
 6 files changed, 1093 insertions(+), 15 deletions(-)
~~~

Equal tip blobs/presence: submission/EXTERNAL_REVIEW_PROTOCOL.md; submission/INSTITUTIONAL_DISCOVERY_PROTOCOL.md; submission/PRE_EXISTING_ASSET_AND_LICENSE_INVENTORY.md; submission/README.md; submission/templates/EXTERNAL_REVIEW_RECORD_TEMPLATE.md; submission/templates/STAKEHOLDER_AND_PILOT_RECORD_TEMPLATE.md


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: submission/EXTERNAL_REVIEW_PROTOCOL.md; submission/INSTITUTIONAL_DISCOVERY_PROTOCOL.md; submission/PRE_EXISTING_ASSET_AND_LICENSE_INVENTORY.md; submission/README.md; submission/templates/EXTERNAL_REVIEW_RECORD_TEMPLATE.md; submission/templates/STAKEHOLDER_AND_PILOT_RECORD_TEMPLATE.md


### origin/docs/field-validation-freeze

Tip c253b4137a26b9483a50add9d32303f80059cf14; merge base c32a4840eac19b9b5775cc7c08b9cab8dc4827bb.

git cherry origin/main REF:
~~~text
+ fe430f1fcd8a8d7306ad58555b594ad48f2ccd85
+ eb704af80c23d6645ad9343d90dd4f3b6ce8c924
+ 068188f3e144f152167eb950a621c2f265b43028
+ 6f643745a266be30f9a958b897c8b67b303f63af
+ fdcb9256feb98bb801c9dda91e496b5e006c2859
+ c253b4137a26b9483a50add9d32303f80059cf14
~~~

git diff --stat origin/main...REF:
~~~text
 docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md | 57 +++++++++++++++++++++++++
 docs/product/pilot/ISSUE_3_SUBGATES.md          | 46 ++++++++++++++++++++
 docs/product/pilot/PRIVATE_PILOT_REQUEST.md     | 52 ++++++++++++++++++++++
 docs/project/FIELD_VALIDATION_FREEZE.md         | 37 ++++++++++++++++
 4 files changed, 192 insertions(+)
~~~

Equal tip blobs/presence: docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md; docs/product/pilot/ISSUE_3_SUBGATES.md; docs/product/pilot/PRIVATE_PILOT_REQUEST.md


Absent on main: (none)


Different tip blobs/presence: docs/project/FIELD_VALIDATION_FREEZE.md


Main-since-base overlap: docs/product/FIELD_READY_ALPHA_RELEASE_NOTES.md; docs/product/pilot/ISSUE_3_SUBGATES.md; docs/product/pilot/PRIVATE_PILOT_REQUEST.md; docs/project/FIELD_VALIDATION_FREEZE.md


### origin/docs/p1-claim-evidence-freeze

Tip 8706052880b3538e6375655e444dc8b5082de50f; merge base 6809c7c8423ce2c07bae7ed2d3f43d840bfc9a17.

git cherry origin/main REF:
~~~text
+ 2a748142469f6384865afedf3bed42d3957a25ea
+ d5ac6e853bc15e8aefcf2c5fe862fe5ccba0b7f5
+ 91bd283cb119af0200497e6e3e17796fe5730bdf
+ 8706052880b3538e6375655e444dc8b5082de50f
~~~

git diff --stat origin/main...REF:
~~~text
 .../packages/P1-ftsid-2026/CLAIM_REGISTER.md       |  59 ++++-
 .../P1-ftsid-2026/EVIDENCE_FREEZE_REGISTER.md      | 169 +++++++++++++
 .../packages/P1-ftsid-2026/PACKAGE_MANIFEST.md     | 156 ++++++++----
 .../packages/P1-ftsid-2026/SECTION_CLAIM_MAP.md    | 271 +++++++++++++++++++++
 4 files changed, 595 insertions(+), 60 deletions(-)
~~~

Equal tip blobs/presence: submission/packages/P1-ftsid-2026/CLAIM_REGISTER.md; submission/packages/P1-ftsid-2026/EVIDENCE_FREEZE_REGISTER.md; submission/packages/P1-ftsid-2026/PACKAGE_MANIFEST.md; submission/packages/P1-ftsid-2026/SECTION_CLAIM_MAP.md


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: submission/packages/P1-ftsid-2026/CLAIM_REGISTER.md; submission/packages/P1-ftsid-2026/EVIDENCE_FREEZE_REGISTER.md; submission/packages/P1-ftsid-2026/PACKAGE_MANIFEST.md; submission/packages/P1-ftsid-2026/SECTION_CLAIM_MAP.md


### origin/docs/policy-lab-four-boundary-reconciliation

Tip bcc1b18bb61129c55e109fb592e2e620672c5657; merge base 5080110588d4f27c9113513171279f908aece2e5.

git cherry origin/main REF:
~~~text
+ 4dc4bf293490a17f47aaa8817f3da83fe6a3dfa3
+ bcc1b18bb61129c55e109fb592e2e620672c5657
~~~

git diff --stat origin/main...REF:
~~~text
 PROJECT_RECOVERY.md                                |  65 ++--
 .../FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md    | 356 +++++++++++++++++++++
 2 files changed, 395 insertions(+), 26 deletions(-)
~~~

Equal tip blobs/presence: PROJECT_RECOVERY.md; docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: PROJECT_RECOVERY.md; docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md


### origin/docs/submission-packaging-calendar

Tip 39b7f152738e4afc9b68367a302fd53e800bbfcb; merge base 02b1bd237c38a66de10ac3503bbd22be6e3fff84.

git cherry origin/main REF:
~~~text
+ 0e434eb3080376cfdb15c941fc831147bf078825
+ 7ce03bf88752959f8dcd33423dbfc637979d7eab
+ d48d9edfedaa71f803158bb2970ba7b36156e91d
+ 64b87e2ed715d38d90f5929cb7ca49e1c57d0984
+ a3472dd9e5925a7e341ed99b1f47435967ff251d
+ e50e4d566428892c92e39b33f0970635886a2517
+ 77a9e0dbcfcedb40cad5d7a8736f37b5d2380452
+ 588df0ddfe4e897a742215fc60f75342e22bf4d5
+ 6b40ce3f74cfbd773504d077c7f2dbe7c1fcb510
+ 61e6980369fbbc0fd4e099844232bc62b94ea9b7
+ 4d7310c110eaa44eccf9c07cb3d24c8a99b0bdb5
+ be62e4d58b26d7d7d286ec08e35e3e1a43e0671b
+ 233753dd491579d3378462b4c5fb72eadabf468a
+ c6f0f833ac858f7a60a9b339d5156280783b62ab
+ 072216e2b1e60670850fa2efaffe74346662f6ef
+ 7507b565e4cf9e33cfaf71b395655f8653e3d0ef
+ 022395bcbeed243aeedec739b187a3e7f11f7968
+ 45c4fd99ff515b7869c22c12de7537a6a95e7635
+ d9f1910cb1a958637c0ef55b3c0b82ae26889967
+ 39b7f152738e4afc9b68367a302fd53e800bbfcb
~~~

git diff --stat origin/main...REF:
~~~text
 docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md    | 356 +++++++++++++++
 docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md  | 367 +++++++++++++++
 .../SUBMISSION_PACKAGING_AND_DEADLINE_PLAN.md      | 492 +++++++++++++++++++++
 submission/CONFORMANCE_BENCHMARK_V1.md             | 342 ++++++++++++++
 submission/EXTERNAL_CASE_PORTFOLIO.md              | 231 ++++++++++
 submission/MASTER_ASSET_REGISTER.md                | 131 ++++++
 submission/OVERLAP_AND_EXCLUSIVITY_REGISTER.md     |  93 ++++
 submission/PACKAGE_CARDS.md                        | 426 ++++++++++++++++++
 submission/PROGRAMME_SCOREBOARD.md                 | 165 +++++++
 submission/README.md                               | 199 +++++++++
 .../packages/P1-ftsid-2026/CLAIM_REGISTER.md       | 101 +++++
 .../packages/P1-ftsid-2026/PACKAGE_MANIFEST.md     | 104 +++++
 .../EVALUATION_READINESS_INVENTORY.md              | 123 ++++++
 .../packages/P2-technical-2026/PACKAGE_MANIFEST.md | 109 +++++
 .../P3-climate-assurance-2026/PACKAGE_MANIFEST.md  | 166 +++++++
 .../P4-commercialization-2026/PACKAGE_MANIFEST.md  | 239 ++++++++++
 submission/templates/PACKAGE_MANIFEST_TEMPLATE.md  | 120 +++++
 17 files changed, 3764 insertions(+)
~~~

Equal tip blobs/presence: docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md; docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md; docs/project/SUBMISSION_PACKAGING_AND_DEADLINE_PLAN.md; submission/CONFORMANCE_BENCHMARK_V1.md; submission/EXTERNAL_CASE_PORTFOLIO.md; submission/MASTER_ASSET_REGISTER.md; submission/OVERLAP_AND_EXCLUSIVITY_REGISTER.md; submission/PACKAGE_CARDS.md; submission/PROGRAMME_SCOREBOARD.md; submission/packages/P2-technical-2026/EVALUATION_READINESS_INVENTORY.md; submission/packages/P2-technical-2026/PACKAGE_MANIFEST.md; submission/packages/P3-climate-assurance-2026/PACKAGE_MANIFEST.md; submission/packages/P4-commercialization-2026/PACKAGE_MANIFEST.md; submission/templates/PACKAGE_MANIFEST_TEMPLATE.md


Absent on main: (none)


Different tip blobs/presence: submission/README.md; submission/packages/P1-ftsid-2026/CLAIM_REGISTER.md; submission/packages/P1-ftsid-2026/PACKAGE_MANIFEST.md


Main-since-base overlap: docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md; docs/project/PROGRAMME_CONVERSION_ARCHITECTURE.md; docs/project/SUBMISSION_PACKAGING_AND_DEADLINE_PLAN.md; submission/CONFORMANCE_BENCHMARK_V1.md; submission/EXTERNAL_CASE_PORTFOLIO.md; submission/MASTER_ASSET_REGISTER.md; submission/OVERLAP_AND_EXCLUSIVITY_REGISTER.md; submission/PACKAGE_CARDS.md; submission/PROGRAMME_SCOREBOARD.md; submission/README.md; submission/packages/P1-ftsid-2026/CLAIM_REGISTER.md; submission/packages/P1-ftsid-2026/PACKAGE_MANIFEST.md; submission/packages/P2-technical-2026/EVALUATION_READINESS_INVENTORY.md; submission/packages/P2-technical-2026/PACKAGE_MANIFEST.md; submission/packages/P3-climate-assurance-2026/PACKAGE_MANIFEST.md; submission/packages/P4-commercialization-2026/PACKAGE_MANIFEST.md; submission/templates/PACKAGE_MANIFEST_TEMPLATE.md


### origin/feat/capsule-verifier

Tip 606348766e73b7270f43184c2d06931738d3c482; merge base ebffa007c178df07a37dd78b244ff9a807aca1fb.

git cherry origin/main REF:
~~~text
+ 7ba8d2c895fd3fb76308caf861d37cabbd735bd5
+ 244ad56316b6db7deee225ec564a5d0051f4b903
+ b2500a867a63a284189d2dd64e074b712e726d08
+ ae9968c39cb6ada79b2161e53bd126401c3d1cd1
+ 606348766e73b7270f43184c2d06931738d3c482
~~~

git diff --stat origin/main...REF:
~~~text
 docs/product/CAPSULE_VERIFIER.md                   |  78 +++
 package.json                                       |   2 +
 packages/constraint-core/src/capsuleVerify.js      | 613 +++++++++++++++++++++
 packages/constraint-core/src/workbench.js          |   1 +
 .../constraint-core/test/capsule-verify.test.mjs   | 272 +++++++++
 scripts/verify_research_capsule.mjs                |  67 +++
 6 files changed, 1033 insertions(+)
~~~

Equal tip blobs/presence: docs/product/CAPSULE_VERIFIER.md; scripts/verify_research_capsule.mjs


Absent on main: (none)


Different tip blobs/presence: package.json; packages/constraint-core/src/capsuleVerify.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/capsule-verify.test.mjs


Main-since-base overlap: docs/product/CAPSULE_VERIFIER.md; package.json; packages/constraint-core/src/capsuleVerify.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/capsule-verify.test.mjs; scripts/verify_research_capsule.mjs


### origin/feat/capsule-verifier-v2

Tip 3e163eb8aaf54a06d624e5981d8e770c678f4e2e; merge base e96551c56a7686e5c3b66e3cc15578c9033e35cd.

git cherry origin/main REF:
~~~text
+ 525b5d67ec5dfa1e6743fe8f43d98aeb24e3ae56
+ 56e462241ee5e64788ace4a82bf81c72860e0320
+ 3e163eb8aaf54a06d624e5981d8e770c678f4e2e
~~~

git diff --stat origin/main...REF:
~~~text
 docs/product/CAPSULE_VERIFIER.md                   |  78 +++
 package.json                                       |   2 +
 packages/constraint-core/src/capsuleVerify.js      | 613 +++++++++++++++++++++
 packages/constraint-core/src/workbench.js          |   1 +
 .../constraint-core/test/capsule-verify.test.mjs   | 272 +++++++++
 scripts/verify_research_capsule.mjs                |  67 +++
 6 files changed, 1033 insertions(+)
~~~

Equal tip blobs/presence: docs/product/CAPSULE_VERIFIER.md; scripts/verify_research_capsule.mjs


Absent on main: (none)


Different tip blobs/presence: package.json; packages/constraint-core/src/capsuleVerify.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/capsule-verify.test.mjs


Main-since-base overlap: docs/product/CAPSULE_VERIFIER.md; package.json; packages/constraint-core/src/capsuleVerify.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/capsule-verify.test.mjs; scripts/verify_research_capsule.mjs


### origin/feat/conformance-benchmark-v1-c0-c2

Tip b40b9c349169397fbefb41a00b0969d3a3ebfd90; merge base 45eb37afaad7a22c3f343247cbf6d719eb3eb19a.

git cherry origin/main REF:
~~~text
+ 94ce1366a80649b836c52851d06c329895eb8f35
+ c76d266a41170524c929c491e57a54c144562c75
+ 2e1130e6ad80865715b851d85f774e6209b8a2e9
+ 6403b77009e91b2284721b2f7f55081d51a0bb13
+ 7e900bf2871c25f7940e2f19a167eedb948658f3
+ 4f3730b65d01ec16f33f4a94e9694df41e097cca
+ b1db7c6719b7b5e90b022cbebe75f0a5f1fed746
+ b40b9c349169397fbefb41a00b0969d3a3ebfd90
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/conformance-benchmark-v1.yml     |  60 ++++++
 benchmark/README.md                                |  72 +++++++
 benchmark/benchmark-manifest.v1.json               | 233 +++++++++++++++++++++
 benchmark/reports/.gitignore                       |   2 +
 packages/constraint-core/package.json              |   5 +-
 .../test/conformance-benchmark-v1.test.mjs         |  76 +++++++
 scripts/run_conformance_benchmark_v1.mjs           | 104 +++++++++
 7 files changed, 551 insertions(+), 1 deletion(-)
~~~

Equal tip blobs/presence: benchmark/reports/.gitignore; packages/constraint-core/package.json


Absent on main: benchmark/README.md


Different tip blobs/presence: .github/workflows/conformance-benchmark-v1.yml; benchmark/benchmark-manifest.v1.json; packages/constraint-core/test/conformance-benchmark-v1.test.mjs; scripts/run_conformance_benchmark_v1.mjs


Main-since-base overlap: .github/workflows/conformance-benchmark-v1.yml; benchmark/benchmark-manifest.v1.json; benchmark/reports/.gitignore; packages/constraint-core/package.json; packages/constraint-core/test/conformance-benchmark-v1.test.mjs; scripts/run_conformance_benchmark_v1.mjs


### origin/feat/conformance-benchmark-v1-cf-c0-c2

Tip 0ff3359f9c82c58edc7ebcceb2b3fadf97a96702; merge base 4e1c75fc48c8fd695c51e61a8c710f3b49fac452.

git cherry origin/main REF:
~~~text
+ 47e6ea7d488e55195d1e473bd8d8972bd584a9eb
+ 557611d3c25ae9256b86be438f10cf75857afdd6
+ 8e0946a566b8071db750e9b6119763f3adde4162
+ 66f04a649c90129f9476188c673bbe830ae9c226
+ 0ff3359f9c82c58edc7ebcceb2b3fadf97a96702
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/conformance-benchmark-v1.yml     |  49 +++++
 benchmark/NAMESPACE.md                             |   3 +
 benchmark/benchmark-manifest.v1.json               | 239 +++++++++++++++++++++
 benchmark/reports/.gitignore                       |   2 +
 packages/constraint-core/package.json              |   5 +-
 .../test/conformance-benchmark-v1.test.mjs         | 105 +++++++++
 scripts/run_conformance_benchmark_v1.mjs           | 128 +++++++++++
 7 files changed, 530 insertions(+), 1 deletion(-)
~~~

Equal tip blobs/presence: benchmark/NAMESPACE.md; benchmark/benchmark-manifest.v1.json; benchmark/reports/.gitignore; packages/constraint-core/package.json; packages/constraint-core/test/conformance-benchmark-v1.test.mjs; scripts/run_conformance_benchmark_v1.mjs


Absent on main: (none)


Different tip blobs/presence: .github/workflows/conformance-benchmark-v1.yml


Main-since-base overlap: .github/workflows/conformance-benchmark-v1.yml; benchmark/NAMESPACE.md; benchmark/benchmark-manifest.v1.json; benchmark/reports/.gitignore; packages/constraint-core/package.json; packages/constraint-core/test/conformance-benchmark-v1.test.mjs; scripts/run_conformance_benchmark_v1.mjs


### origin/feat/constrained-claim-assessment-g4

Tip 315ef05af6914ec5849baa104ccc307f17fc4d77; merge base 317e4b21b88bce0405e620b0b4c039857ce39dac.

git cherry origin/main REF:
~~~text
+ 7e83431e0af5b5a9361f9b24c5090f36175a3a58
+ de27fe946e4f9b16d68f6102863a08c56161c277
+ 50b25709a1c5cb54920ca805a250e98994bc48d5
+ 93e6fc8fd56c27be5dba972c19dd80624b9b3786
+ b64b0f60f8674f8f3f8a3a89c8085a1691b72bb0
+ d7f17951f0f7369f68899424b3356c3d5b995fb3
+ 2fcdd171a83ffad4c9bdf8edd4b889e7170b7040
+ 6df3ed2bed17ebb27e8bee0a810abee2a9a402b7
+ c0bb21bc75d129f0723b8ff8126506d4ad500f52
+ 0e8b7e56697cfb655f2eb6e302d87d926d159283
+ 644ecf56170e59fc7307f392451c3a162d85825f
+ b37cd7d59b6e40305f378fe059bd473cb1dec41c
+ 4592cc40c04f152885427ed7f91bb98449a054f8
+ 24671d3a0a0f7aad049f42b4c96d210540aaf82e
+ 0073e375cb2d2b8618c2777d9a39ccbbdc7609a8
+ 09f4c9ed3affd80b4c7811bc818d7cfd8eb68aae
+ 4ed0834333e39d6f4eb554d7b08769037ee6338b
+ 315ef05af6914ec5849baa104ccc307f17fc4d77
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/external-case-001p-ausgrid.yml   |  20 +-
 README.md                                          |  78 ++++--
 docs/research/POLICY_LAB_G4_AUDIT_2026-08-16.md    | 164 ++++++++++++
 docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md     | 154 +++++++++++
 packages/constraint-core/src/assessment.js         | 284 +++++++++++++++++++++
 packages/constraint-core/src/index.js              |   1 +
 packages/constraint-core/src/workbench.js          |   1 +
 .../test/constrained-claim-assessment.test.mjs     | 155 +++++++++++
 .../constrained-claim-assessment.v1.schema.json    | 108 ++++++++
 scripts/build_constrained_claim_assessment.mjs     | 116 +++++++++
 scripts/verify_constrained_claim_assessment.mjs    | 116 +++++++++
 11 files changed, 1177 insertions(+), 20 deletions(-)
~~~

Equal tip blobs/presence: docs/research/POLICY_LAB_G4_AUDIT_2026-08-16.md; docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md; packages/constraint-core/src/assessment.js; packages/constraint-core/src/index.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/constrained-claim-assessment.test.mjs; protocol/schema/constrained-claim-assessment.v1.schema.json; scripts/build_constrained_claim_assessment.mjs; scripts/verify_constrained_claim_assessment.mjs


Absent on main: (none)


Different tip blobs/presence: .github/workflows/external-case-001p-ausgrid.yml; README.md


Main-since-base overlap: .github/workflows/external-case-001p-ausgrid.yml; README.md; docs/research/POLICY_LAB_G4_AUDIT_2026-08-16.md; docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md; packages/constraint-core/src/assessment.js; packages/constraint-core/src/index.js; packages/constraint-core/src/workbench.js; packages/constraint-core/test/constrained-claim-assessment.test.mjs; protocol/schema/constrained-claim-assessment.v1.schema.json; scripts/build_constrained_claim_assessment.mjs; scripts/verify_constrained_claim_assessment.mjs


### origin/feat/constraint-protocol-alpha

Tip b7a15e4be2f5e1fff72175121f1ccd75464677c9; merge base d9e5b243b4e32364535750988daf0f291590f435.

git cherry origin/main REF:
~~~text
+ 3c60ec2c287d633d1b9049fd92ce4cc14b905022
+ defb0c2247d2ef8b66ec6de75fa00c80fbeb2d5b
+ 81ab5f38d05be9793792fb65096881dbc51338f2
+ 743f76c7b83089ff297a088f43c12b739529a7ce
+ ef9ac408e755875ffea3efc4ad7c1581c8d19619
+ fd97bb8e7a35b54e1adeb110fbc11c50fe34bca4
+ 6c238f9aa18e1d9f8e9e2ed6e182e22d3ab50f97
+ 530e37c5991190b3b2824b41b4ef2cf9e0e07061
+ b34e1e2c09a01ab13823dc604d184c2a82a6e52b
+ 836b6e4e742647f2f887cbcdab9f2444ab3e00fa
+ 38b9f05ac1e77b04f95e6136c48b5e0f0e0c8fa9
+ d2cf1e20189edd1df8d7c3fe25813ef9ed1f8333
+ 800a43f17cef620ae56daeb81a87297482f6e71c
+ a9ebef34bee5b08cbb3ea35646aab74179fca321
+ 33141f7f14ee602d841945da1fd3481cfa4dd28b
+ 8e764f787ff923bf7b5809082e238265b35e7208
+ 11c5fdc459fcb5c2a7b7fcf4cdfebd0fd73f4290
+ b6c774f6ddc926df9e2ab8ba4124a6a01c42377e
+ 0cca0ba15166f169fc8f2794211c6ee03acc99d8
+ 7b2c6a0e8cfb0d6fcfb526066f79419b777c7a04
+ 4b51a3db2a9d08f64277faf7d87a627a38351322
+ 127ecb749148df2ca1293fd2e031a2bb1138d481
+ 9b0065ff7e7a1365edccb95bbc66a9e4a636a323
+ ef2b1928035589fb22670b16c563a342684f8669
+ f2f1af1cc018e8ee81c6d836939768bf905538fa
+ 10c52c84e68496fafd5454a2ccb29e1bd4cd2b2f
+ a02a543243e34792743c256d7ab60ace8d50ffe1
+ b43c7311947e92a8196225228f1bf63fda329ea7
+ d3290edcac376585496ff2b8bb5d0e092a49c30e
+ a6bba663638c71a0821e5c821ca23fa88bb26dd3
+ 370a8f827e8465eac30bd8c202e0499dac687b93
+ 605a4963b960beef7254d13377b1f56b97f5cb91
+ 7733f4a9e5034b6925cf53f10c7b5832379e598c
+ 06b1e3748c2422a5bce5e8f02552fa630b88039f
+ a4fcd10ad87c5c63fe65dd6c32ee4e427be1ef47
+ 6c71f7416be26549d195b3e7ad158931357fc9d7
+ bd2b8ae1e0bb58918fa427f342adc89fe3d701ac
+ 015f77600bf502cec62ed045dc6be16b1c0cfed9
+ b13d0e876caf94622e0cc369957da077f650536b
+ 784bdbf0e6a2753dfe01301a63d8749dd4f63ceb
+ a3c59b3ff6769d26c06ba0eeee88848d2d9ed0a4
+ 18a417fef35c38086406607887bad772a017fb2c
+ b47952e7cfd448b5037a2d32a7ac5429d1f9ce5b
+ 8ac462ae8d94544266d8edc836a63f4c139bf419
+ 4ffef6f58af423f55d5a5a2c0a397a875f9fa890
+ 8606f53d03f88e6112555b8eee20b6c97349fc67
+ b7a15e4be2f5e1fff72175121f1ccd75464677c9
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/constraint_protocol_alpha.yml    | 121 +++++
 .github/workflows/deploy.yml                       |  35 +-
 .../deploy_constraint_protocol_alpha_sepolia.yml   |  68 +++
 .github/workflows/tests.yml                        |  11 +-
 README.md                                          | 210 +++++---
 contracts/protocol/ClaimRegistry.sol               | 220 ++++++++
 contracts/protocol/PolicyRegistry.sol              |  77 +++
 contracts/protocol/SettlementLedger.sol            |  67 +++
 docs/product/PUBLIC_LAB_DEPLOYMENT.md              | 187 ++++---
 docs/protocol/ADAPTER_INTERFACE_V1.md              | 151 ++++++
 docs/protocol/CLAIM_MANIFEST_V1.md                 | 113 ++++
 docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md         | 252 +++++++++
 docs/protocol/EMPIRICAL_RUNS_V1.md                 | 162 ++++++
 docs/protocol/POLICY_MANIFEST_V1.md                | 137 +++++
 docs/protocol/PUBLIC_ALPHA_READINESS.md            | 234 ++++++++
 docs/protocol/THREAT_MODEL_ALPHA.md                | 311 +++++++++++
 frontend/index.html                                |  16 +-
 frontend/package.json                              |   1 +
 .../market-capacity-v1/bundle-integrity.json       |  16 +
 .../market-capacity-summary.json                   | 152 ++++++
 .../market-capacity-v1/methods-manifest.json       |  78 +++
 .../market-capacity-v1/policy-frontier.json        | 214 ++++++++
 .../market-capacity-v1/stress-reference-runs.json  |   1 +
 .../market-capacity-v1/yearly-policy-results.json  |   1 +
 .../public/samples/protocol/cumulative-end.json    |  14 +
 .../public/samples/protocol/cumulative-start.json  |  13 +
 frontend/public/samples/protocol/fronius-end.json  |  28 +
 .../public/samples/protocol/fronius-start.json     |  28 +
 .../samples/protocol/generic-meter-sample.csv      |  13 +
 .../samples/protocol/green-button-sample.csv       |   8 +
 .../public/samples/protocol/meter-registry.json    |  24 +
 .../public/samples/protocol/signed-readings.json   |  68 +++
 .../public/samples/public_lab_sample_meter.csv     |  13 +
 frontend/src/App.jsx                               | 166 +++++-
 .../components/ConstraintProtocolLab.core.test.js  |  67 +++
 frontend/src/components/ConstraintProtocolLab.jsx  | 538 +++++++++++++++++++
 frontend/src/components/CurrencyLab.jsx            | 307 +++++++++++
 .../src/components/EmpiricalReproductionLab.jsx    | 192 +++++++
 frontend/src/components/EmpiricalRunsLab.jsx       | 504 ++++++++++++++++++
 frontend/src/components/EvidenceLab.jsx            | 342 ++++++++++++
 .../EvidenceLab.receiptBoundary.test.jsx           |  69 +++
 frontend/src/components/LabSessionBar.jsx          |  71 +++
 frontend/src/components/PublicLabLanding.jsx       | 162 +++---
 frontend/src/components/ResearchPanel.jsx          |  89 ++++
 frontend/src/components/SpkV1Console.jsx           |  13 +-
 frontend/src/components/SpkV1Console.test.jsx      |   2 +-
 frontend/src/constants/contracts.js                |   4 +
 frontend/src/constraintProtocol.css                | 592 +++++++++++++++++++++
 frontend/src/constraintProtocolHardening.css       |  70 +++
 frontend/src/empiricalReproduction.css             | 365 +++++++++++++
 frontend/src/empiricalRuns.css                     | 451 ++++++++++++++++
 frontend/src/index.css                             | 317 +++++++++++
 frontend/src/lib/currencyLab.js                    | 374 +++++++++++++
 frontend/src/lib/evidenceLab.js                    | 504 ++++++++++++++++++
 frontend/src/lib/evidenceLab.test.js               | 309 +++++++++++
 frontend/src/lib/labScenarios.js                   | 123 +++++
 frontend/src/lib/labScenarios.test.js              |  63 +++
 frontend/src/lib/sessionReceipt.js                 |  93 ++++
 frontend/src/lib/sessionReceipt.test.js            |  74 +++
 frontend/src/main.jsx                              |   1 +
 frontend/src/workbenchSession.css                  | 223 ++++++++
 packages/constraint-core/README.md                 | 135 +++++
 packages/constraint-core/package.json              |  14 +
 packages/constraint-core/src/adapters.js           | 377 +++++++++++++
 packages/constraint-core/src/attestation.js        | 246 +++++++++
 packages/constraint-core/src/claim.js              | 206 +++++++
 packages/constraint-core/src/csv.js                |  84 +++
 packages/constraint-core/src/index.d.ts            | 260 +++++++++
 packages/constraint-core/src/index.js              |  14 +
 packages/constraint-core/src/policies.js           | 238 +++++++++
 packages/constraint-core/src/portableEvidence.js   |  53 ++
 packages/constraint-core/src/provenance.js         | 145 +++++
 packages/constraint-core/src/stable.js             |  52 ++
 .../test/conformance-vectors.test.mjs              | 133 +++++
 .../constraint-core/test/constraint-core.test.mjs  | 167 ++++++
 .../test/empirical-study-artifact.test.mjs         |  79 +++
 .../test/evidence-identity.test.mjs                |  40 ++
 .../constraint-core/test/policy-files.test.mjs     |  28 +
 .../constraint-core/test/schema-shape.test.mjs     |  55 ++
 protocol/conformance/README.md                     |  33 ++
 protocol/conformance/alpha-v1.json                 |  73 +++
 protocol/policies/ENERGY-PILOT-002.json            |  29 +
 protocol/policies/ENERGY-STRICT-003.json           |  29 +
 protocol/policies/LAB-OPEN-001.json                |  29 +
 protocol/policies/SPK-ENERGY-001.json              |  29 +
 protocol/schema/README.md                          |  33 ++
 protocol/schema/claim-manifest.v1.schema.json      |  80 +++
 protocol/schema/evidence-envelope.v1.schema.json   |  87 +++
 protocol/schema/policy-manifest.v1.schema.json     |  72 +++
 protocol/schema/provenance-decision.v1.schema.json |  38 ++
 protocol/schema/settlement-result.v1.schema.json   |  51 ++
 scripts/capture_constraint_protocol_alpha.mjs      |  92 ++++
 scripts/deploy_constraint_protocol_alpha.js        | 188 +++++++
 scripts/protocol_alpha_demo.mjs                    |  75 +++
 test/ConstraintProtocol.test.js                    | 194 +++++++
 95 files changed, 12288 insertions(+), 299 deletions(-)
~~~

Equal tip blobs/presence: contracts/protocol/ClaimRegistry.sol; contracts/protocol/SettlementLedger.sol; docs/product/PUBLIC_LAB_DEPLOYMENT.md; docs/protocol/ADAPTER_INTERFACE_V1.md; docs/protocol/CLAIM_MANIFEST_V1.md; docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md; docs/protocol/EMPIRICAL_RUNS_V1.md; docs/protocol/POLICY_MANIFEST_V1.md; docs/protocol/PUBLIC_ALPHA_READINESS.md; docs/protocol/THREAT_MODEL_ALPHA.md; frontend/public/empirical/market-capacity-v1/bundle-integrity.json; frontend/public/empirical/market-capacity-v1/market-capacity-summary.json; frontend/public/empirical/market-capacity-v1/methods-manifest.json; frontend/public/empirical/market-capacity-v1/policy-frontier.json; frontend/public/empirical/market-capacity-v1/stress-reference-runs.json; frontend/public/empirical/market-capacity-v1/yearly-policy-results.json; frontend/public/samples/protocol/cumulative-end.json; frontend/public/samples/protocol/cumulative-start.json; frontend/public/samples/protocol/fronius-end.json; frontend/public/samples/protocol/fronius-start.json; frontend/public/samples/protocol/generic-meter-sample.csv; frontend/public/samples/protocol/green-button-sample.csv; frontend/public/samples/protocol/meter-registry.json; frontend/public/samples/protocol/signed-readings.json; frontend/public/samples/public_lab_sample_meter.csv; frontend/src/components/ConstraintProtocolLab.core.test.js; frontend/src/components/ConstraintProtocolLab.jsx; frontend/src/components/CurrencyLab.jsx; frontend/src/components/EvidenceLab.receiptBoundary.test.jsx; frontend/src/components/LabSessionBar.jsx; frontend/src/components/PublicLabLanding.jsx; frontend/src/components/ResearchPanel.jsx; frontend/src/components/SpkV1Console.jsx; frontend/src/components/SpkV1Console.test.jsx; frontend/src/lib/currencyLab.js; frontend/src/lib/evidenceLab.js; frontend/src/lib/evidenceLab.test.js; frontend/src/lib/labScenarios.js; frontend/src/lib/labScenarios.test.js; frontend/src/lib/sessionReceipt.js; frontend/src/lib/sessionReceipt.test.js; packages/constraint-core/src/attestation.js; packages/constraint-core/src/claim.js; packages/constraint-core/src/csv.js; packages/constraint-core/src/policies.js; packages/constraint-core/src/provenance.js; packages/constraint-core/src/stable.js; packages/constraint-core/test/conformance-vectors.test.mjs; packages/constraint-core/test/constraint-core.test.mjs; packages/constraint-core/test/empirical-study-artifact.test.mjs; packages/constraint-core/test/evidence-identity.test.mjs; packages/constraint-core/test/policy-files.test.mjs; packages/constraint-core/test/schema-shape.test.mjs; protocol/conformance/README.md; protocol/conformance/alpha-v1.json; protocol/policies/ENERGY-PILOT-002.json; protocol/policies/ENERGY-STRICT-003.json; protocol/policies/LAB-OPEN-001.json; protocol/policies/SPK-ENERGY-001.json; protocol/schema/claim-manifest.v1.schema.json; protocol/schema/evidence-envelope.v1.schema.json; protocol/schema/policy-manifest.v1.schema.json; protocol/schema/provenance-decision.v1.schema.json; protocol/schema/settlement-result.v1.schema.json; scripts/deploy_constraint_protocol_alpha.js; scripts/protocol_alpha_demo.mjs


Absent on main: .github/workflows/deploy_constraint_protocol_alpha_sepolia.yml


Different tip blobs/presence: .github/workflows/constraint_protocol_alpha.yml; .github/workflows/deploy.yml; .github/workflows/tests.yml; README.md; contracts/protocol/PolicyRegistry.sol; frontend/index.html; frontend/package.json; frontend/src/App.jsx; frontend/src/components/EmpiricalReproductionLab.jsx; frontend/src/components/EmpiricalRunsLab.jsx; frontend/src/components/EvidenceLab.jsx; frontend/src/constants/contracts.js; frontend/src/constraintProtocol.css; frontend/src/constraintProtocolHardening.css; frontend/src/empiricalReproduction.css; frontend/src/empiricalRuns.css; frontend/src/index.css; frontend/src/main.jsx; frontend/src/workbenchSession.css; packages/constraint-core/README.md; packages/constraint-core/package.json; packages/constraint-core/src/adapters.js; packages/constraint-core/src/index.d.ts; packages/constraint-core/src/index.js; packages/constraint-core/src/portableEvidence.js; protocol/schema/README.md; scripts/capture_constraint_protocol_alpha.mjs; test/ConstraintProtocol.test.js


Main-since-base overlap: .github/workflows/constraint_protocol_alpha.yml; .github/workflows/deploy.yml; .github/workflows/tests.yml; README.md; contracts/protocol/ClaimRegistry.sol; contracts/protocol/PolicyRegistry.sol; contracts/protocol/SettlementLedger.sol; docs/product/PUBLIC_LAB_DEPLOYMENT.md; docs/protocol/ADAPTER_INTERFACE_V1.md; docs/protocol/CLAIM_MANIFEST_V1.md; docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md; docs/protocol/EMPIRICAL_RUNS_V1.md; docs/protocol/POLICY_MANIFEST_V1.md; docs/protocol/PUBLIC_ALPHA_READINESS.md; docs/protocol/THREAT_MODEL_ALPHA.md; frontend/index.html; frontend/package.json; frontend/public/empirical/market-capacity-v1/bundle-integrity.json; frontend/public/empirical/market-capacity-v1/market-capacity-summary.json; frontend/public/empirical/market-capacity-v1/methods-manifest.json; frontend/public/empirical/market-capacity-v1/policy-frontier.json; frontend/public/empirical/market-capacity-v1/stress-reference-runs.json; frontend/public/empirical/market-capacity-v1/yearly-policy-results.json; frontend/public/samples/protocol/cumulative-end.json; frontend/public/samples/protocol/cumulative-start.json; frontend/public/samples/protocol/fronius-end.json; frontend/public/samples/protocol/fronius-start.json; frontend/public/samples/protocol/generic-meter-sample.csv; frontend/public/samples/protocol/green-button-sample.csv; frontend/public/samples/protocol/meter-registry.json; frontend/public/samples/protocol/signed-readings.json; frontend/public/samples/public_lab_sample_meter.csv; frontend/src/App.jsx; frontend/src/components/ConstraintProtocolLab.core.test.js; frontend/src/components/ConstraintProtocolLab.jsx; frontend/src/components/CurrencyLab.jsx; frontend/src/components/EmpiricalReproductionLab.jsx; frontend/src/components/EmpiricalRunsLab.jsx; frontend/src/components/EvidenceLab.jsx; frontend/src/components/EvidenceLab.receiptBoundary.test.jsx; frontend/src/components/LabSessionBar.jsx; frontend/src/components/PublicLabLanding.jsx; frontend/src/components/ResearchPanel.jsx; frontend/src/components/SpkV1Console.jsx; frontend/src/components/SpkV1Console.test.jsx; frontend/src/constants/contracts.js; frontend/src/constraintProtocol.css; frontend/src/constraintProtocolHardening.css; frontend/src/empiricalReproduction.css; frontend/src/empiricalRuns.css; frontend/src/index.css; frontend/src/lib/currencyLab.js; frontend/src/lib/evidenceLab.js; frontend/src/lib/evidenceLab.test.js; frontend/src/lib/labScenarios.js; frontend/src/lib/labScenarios.test.js; frontend/src/lib/sessionReceipt.js; frontend/src/lib/sessionReceipt.test.js; frontend/src/main.jsx; frontend/src/workbenchSession.css; packages/constraint-core/README.md; packages/constraint-core/package.json; packages/constraint-core/src/adapters.js; packages/constraint-core/src/attestation.js; packages/constraint-core/src/claim.js; packages/constraint-core/src/csv.js; packages/constraint-core/src/index.d.ts; packages/constraint-core/src/index.js; packages/constraint-core/src/policies.js; packages/constraint-core/src/portableEvidence.js; packages/constraint-core/src/provenance.js; packages/constraint-core/src/stable.js; packages/constraint-core/test/conformance-vectors.test.mjs; packages/constraint-core/test/constraint-core.test.mjs; packages/constraint-core/test/empirical-study-artifact.test.mjs; packages/constraint-core/test/evidence-identity.test.mjs; packages/constraint-core/test/policy-files.test.mjs; packages/constraint-core/test/schema-shape.test.mjs; protocol/conformance/README.md; protocol/conformance/alpha-v1.json; protocol/policies/ENERGY-PILOT-002.json; protocol/policies/ENERGY-STRICT-003.json; protocol/policies/LAB-OPEN-001.json; protocol/policies/SPK-ENERGY-001.json; protocol/schema/README.md; protocol/schema/claim-manifest.v1.schema.json; protocol/schema/evidence-envelope.v1.schema.json; protocol/schema/policy-manifest.v1.schema.json; protocol/schema/provenance-decision.v1.schema.json; protocol/schema/settlement-result.v1.schema.json; scripts/capture_constraint_protocol_alpha.mjs; scripts/deploy_constraint_protocol_alpha.js; scripts/protocol_alpha_demo.mjs; test/ConstraintProtocol.test.js


### origin/feat/external-case-001-intake-kit

Tip b3a7e0feb752c732cb74fde3c3803b457fe05393; merge base ad4e27fb72d930ddbfe2b3f08c90fc1031ffe930.

git cherry origin/main REF:
~~~text
+ b97aab25b01591e1677a5053b1d7aa4d2b5db95d
+ df13ab4c811943d5762013ebdcb7a357e01ec5da
+ d898a5bb97741d0603774cafafd5bb83d7b4b9c9
+ c820c6e4424cb02126c0d3cca69388de3992bfc9
+ e0709546904bd84325338125be40c0092995cd58
+ 89e549f6c3540e2d1d46f9f9be0cca361eabae0e
+ 28247541015c2701b22ec956ff305d82ec86be98
+ b3a7e0feb752c732cb74fde3c3803b457fe05393
~~~

git diff --stat origin/main...REF:
~~~text
 .../external-case-001/column_mapping.template.json |  61 +++++++
 .../operator_source_manifest.template.json         |  53 ++++++
 .../source_holder_confirmation.template.md         |  63 ++++++++
 docs/external-cases/EXTERNAL_CASE_001_INTAKE.md    | 178 +++++++++++++++++++++
 .../EXTERNAL_CASE_001_SOURCE_REQUEST.md            | 108 +++++++++++++
 docs/product/OPERATOR_SOURCE_INTAKE_V2.md          |  13 ++
 .../test/external-case-001-scaffold.test.mjs       |  83 ++++++++++
 scripts/scaffold_external_case_001.mjs             | 124 ++++++++++++++
 8 files changed, 683 insertions(+)
~~~

Equal tip blobs/presence: data/operator/external-case-001/column_mapping.template.json; data/operator/external-case-001/operator_source_manifest.template.json; data/operator/external-case-001/source_holder_confirmation.template.md; docs/external-cases/EXTERNAL_CASE_001_INTAKE.md; docs/external-cases/EXTERNAL_CASE_001_SOURCE_REQUEST.md; docs/product/OPERATOR_SOURCE_INTAKE_V2.md; packages/constraint-core/test/external-case-001-scaffold.test.mjs; scripts/scaffold_external_case_001.mjs


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: data/operator/external-case-001/column_mapping.template.json; data/operator/external-case-001/operator_source_manifest.template.json; data/operator/external-case-001/source_holder_confirmation.template.md; docs/external-cases/EXTERNAL_CASE_001_INTAKE.md; docs/external-cases/EXTERNAL_CASE_001_SOURCE_REQUEST.md; docs/product/OPERATOR_SOURCE_INTAKE_V2.md; packages/constraint-core/test/external-case-001-scaffold.test.mjs; scripts/scaffold_external_case_001.mjs


### origin/feat/flagship-polish-v03

Tip 4a424817412901ab9d4f706f191a681558df10c3; merge base dbba21cb257ae0338e5d75a73d2b954ad983c4d1.

git cherry origin/main REF:
~~~text
+ bace1d3cfcc028b6ed1313bbac93fbe2040183d9
+ 377257df179bdaf3ca205a73c50ed8afb4076d1a
+ 723ea760956dd24512f03474387dfdfe99410ca8
+ 4d178d890d17d3a149af25f691fc347cc18b9be5
+ 7308b9d483a96ec42d1b5d701f7951aa347b5a7b
+ 7222a3ddc2e2d812d81e4122b9b2f0183df2b1f6
+ c74e690c7189d42654b52f550d42483f4c2cfb2d
+ 874160e122e5fdd7a5d7d676aac3157c6f2771c8
+ 85d2d6110ce2341679524417ba6e8761fcb18b18
+ 28c0a6f8ca1c3c92f70616061942e871ee84ff27
+ 20ec8b96e6deaee568d922dda8cd0955eea70eab
+ d65709c20ce62801a08bb070a2d0bc68fc3b22c8
+ 126eabce64766a902b8e06f8fe46a04d5291a093
+ a62eb53b56bc47e1cf6602896fb20e2620e684b3
+ fea2df14990e4e7d3b786140f3fc231a6c191013
+ 30ba635d08318b4b772426252e40f035a7338e8e
+ 896e07bbaf2149e92601e7d286aba7ec2dfb930c
+ 04e571b0ab0602f6ec8df0b4512fe93f667d097e
+ 14058abdfc3c64873e11c15d31004b1b25fddeb1
+ ed2c2004f455c706204a6b1dd6b3dea723994a10
+ 93a9daa2e25abc4eef81a827157cb8e7b6eea7eb
+ adf3c53d3f706fe19bc2a967e320531d4ad0aac8
+ 1fa87b9cce3b24ca4ce452682a2b91aa36113b5b
+ a8b52d9a8447fab4b2e7aa2ef707ba996e4fd60e
+ 4a424817412901ab9d4f706f191a681558df10c3
~~~

git diff --stat origin/main...REF:
~~~text
 docs/project/FIELD_VALIDATION_FREEZE.md          |  35 +-
 frontend/src/App.jsx                             |  60 ++-
 frontend/src/cases/CaseExplorer.jsx              |  26 +-
 frontend/src/cases/CaseWorkbench.test.jsx        |   9 +-
 frontend/src/compare/CompareWorkspace.jsx        | 206 ++++----
 frontend/src/compare/CompareWorkspace.test.jsx   |   6 +
 frontend/src/compare/PolicyDiffPanel.jsx         |  31 +-
 frontend/src/components/LabOverview.jsx          |   8 +-
 frontend/src/components/ResponsiveDisclosure.jsx |  41 ++
 frontend/src/components/SectionNavigator.jsx     |  17 +
 frontend/src/main.jsx                            |   3 +
 frontend/src/receipts/ReceiptsWorkspace.jsx      | 183 ++++---
 frontend/src/receipts/ReceiptsWorkspace.test.jsx |  13 +-
 frontend/src/styles/policyDisclosurePolish.css   |  70 +++
 frontend/src/styles/productPolish.css            | 609 +++++++++++++++++++++++
 frontend/src/styles/receiptPolish.css            |  56 +++
 scripts/capture_case_workbench_v2.mjs            |  53 +-
 17 files changed, 1215 insertions(+), 211 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/components/ResponsiveDisclosure.jsx; frontend/src/components/SectionNavigator.jsx


Absent on main: (none)


Different tip blobs/presence: docs/project/FIELD_VALIDATION_FREEZE.md; frontend/src/App.jsx; frontend/src/cases/CaseExplorer.jsx; frontend/src/cases/CaseWorkbench.test.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/compare/PolicyDiffPanel.jsx; frontend/src/components/LabOverview.jsx; frontend/src/main.jsx; frontend/src/receipts/ReceiptsWorkspace.jsx; frontend/src/receipts/ReceiptsWorkspace.test.jsx; frontend/src/styles/policyDisclosurePolish.css; frontend/src/styles/productPolish.css; frontend/src/styles/receiptPolish.css; scripts/capture_case_workbench_v2.mjs


Main-since-base overlap: docs/project/FIELD_VALIDATION_FREEZE.md; frontend/src/App.jsx; frontend/src/cases/CaseExplorer.jsx; frontend/src/cases/CaseWorkbench.test.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/compare/PolicyDiffPanel.jsx; frontend/src/components/LabOverview.jsx; frontend/src/components/ResponsiveDisclosure.jsx; frontend/src/components/SectionNavigator.jsx; frontend/src/main.jsx; frontend/src/receipts/ReceiptsWorkspace.jsx; frontend/src/receipts/ReceiptsWorkspace.test.jsx; frontend/src/styles/policyDisclosurePolish.css; frontend/src/styles/productPolish.css; frontend/src/styles/receiptPolish.css; scripts/capture_case_workbench_v2.mjs


### origin/feat/gauntlet-simulation-v1

Tip caa2cd3e73fa3d5686f0b45866a1f21174a99c74; merge base caa2cd3e73fa3d5686f0b45866a1f21174a99c74.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/feat/operator-custody-intake

Tip 9cc1377e26b3a4e3f774303b13c705fbe4f5fc1b; merge base c86dfa58f6322b8cb71d3af523dafef478b3b57d.

git cherry origin/main REF:
~~~text
+ 0f0a924633a7b44b4462c47fb35413b3fe777592
+ 54e577dbbeb1152d6e38a0ee69b1309c05401331
+ f28f09855ecf3b3d29de3d0a2a8c3537c78762cf
+ 1aa75f69cddf788afe27e5a926cf06757d6c7dcc
+ 3737bc383f55f2aa1e4f0bd4eba5ea67ef015b1d
+ ab1b8b32e8eec18cdc6ea93cfdace11db4eb308e
+ 11ca87e3f3fb5c447d055314908c6d579d19d156
+ 9ddb66eeac374d74416a3d0f2c329b17a690e416
+ ce0c2aae704b1bdb46a3feabdc02138882a34d46
+ 0fe117b1628f38a72bea09130f411fb0e641720e
+ b5a101a8f25ee5d31ec0d35ee16ef84fa3589d60
+ 24675e2c043257406f556ee21b4382324e7f5d56
+ 62cc352f4a40457279cacf39749d2e5f1a5bf1ab
+ 77a53c6a498ba611724f976dd39d6eb58529b4ee
+ e364fd32e6b8956c82b53deb501c6ee846386e82
+ dd4137f90212f18c97edde14546e5ecaa5e2e5cf
+ c42986cb7a11d1c49d27776d78de75d4f6a389d6
+ 4e98511b69e5f39288b1203f734295cd22674dec
+ 8333b82295b422e8f43984cd7140c94491c9761f
+ 23fdca8e17634c8c0eed3cb3805e3962d30c0212
+ 5ac02c6afc93bba7e7b240ba0a7ecca09525fc94
+ 9cc1377e26b3a4e3f774303b13c705fbe4f5fc1b
~~~

git diff --stat origin/main...REF:
~~~text
 .gitignore                                         |   9 +-
 .../operator_source_manifest.template.json         |  52 +++
 docs/product/OPERATOR_DATA_INTAKE.md               |  10 +-
 docs/product/OPERATOR_SOURCE_INTAKE_V2.md          | 108 ++++++
 frontend/src/lib/pay.js                            |   5 +-
 frontend/src/lib/pay.test.js                       |  10 +-
 packages/constraint-core/README.md                 |  48 +++
 packages/constraint-core/package.json              |  23 +-
 packages/constraint-core/src/capsuleVerify.d.ts    |  70 ++++
 packages/constraint-core/src/index.js              |   1 +
 packages/constraint-core/src/operatorIntake.d.ts   | 157 ++++++++
 packages/constraint-core/src/operatorIntake.js     | 395 +++++++++++++++++++++
 packages/constraint-core/src/workbench.d.ts        |   3 +
 packages/constraint-core/src/workbench.js          |   1 +
 .../test/operator-source-intake.test.mjs           | 196 ++++++++++
 .../test/operator-source-schema.test.mjs           | 103 ++++++
 protocol/schema/README.md                          |  21 +-
 .../schema/operator-source-manifest.v1.schema.json | 132 +++++++
 .../schema/operator-source-receipt.v1.schema.json  | 143 ++++++++
 scripts/prepare_operator_source_intake.mjs         |  78 ++++
 20 files changed, 1554 insertions(+), 11 deletions(-)
~~~

Equal tip blobs/presence: data/operator/operator_source_manifest.template.json; docs/product/OPERATOR_DATA_INTAKE.md; frontend/src/lib/pay.js; frontend/src/lib/pay.test.js; packages/constraint-core/README.md; packages/constraint-core/src/capsuleVerify.d.ts; packages/constraint-core/src/operatorIntake.d.ts; packages/constraint-core/src/operatorIntake.js; packages/constraint-core/src/workbench.d.ts; packages/constraint-core/test/operator-source-intake.test.mjs; packages/constraint-core/test/operator-source-schema.test.mjs; protocol/schema/README.md; protocol/schema/operator-source-manifest.v1.schema.json; protocol/schema/operator-source-receipt.v1.schema.json; scripts/prepare_operator_source_intake.mjs


Absent on main: (none)


Different tip blobs/presence: .gitignore; docs/product/OPERATOR_SOURCE_INTAKE_V2.md; packages/constraint-core/package.json; packages/constraint-core/src/index.js; packages/constraint-core/src/workbench.js


Main-since-base overlap: .gitignore; data/operator/operator_source_manifest.template.json; docs/product/OPERATOR_DATA_INTAKE.md; docs/product/OPERATOR_SOURCE_INTAKE_V2.md; frontend/src/lib/pay.js; frontend/src/lib/pay.test.js; packages/constraint-core/README.md; packages/constraint-core/package.json; packages/constraint-core/src/capsuleVerify.d.ts; packages/constraint-core/src/index.js; packages/constraint-core/src/operatorIntake.d.ts; packages/constraint-core/src/operatorIntake.js; packages/constraint-core/src/workbench.d.ts; packages/constraint-core/src/workbench.js; packages/constraint-core/test/operator-source-intake.test.mjs; packages/constraint-core/test/operator-source-schema.test.mjs; protocol/schema/README.md; protocol/schema/operator-source-manifest.v1.schema.json; protocol/schema/operator-source-receipt.v1.schema.json; scripts/prepare_operator_source_intake.mjs


### origin/feat/operator-evidence-pilot

Tip 24f61ebed7a9df4f9d818b7cefabb345d815c571; merge base ebffa007c178df07a37dd78b244ff9a807aca1fb.

git cherry origin/main REF:
~~~text
+ cdc8bb5f0b5540a2db4baddd9041875baff2bd08
+ 5b39a2944a8b9158777cee44b3d237fdece0b448
+ 54e680a484e4914814cb8f8200a52282ead2295b
+ 970f8b2c239ed406876fd49a8507323ac32d246c
+ 9d4e3727091b74996770d06333ac7980a3f9fe05
+ 197cd3b5f28bdfa8729dc9b97a0328c814437193
+ 32f46ce0fb2a4074d8150ff7fb9f51741124b04e
+ b2432ccb145823f97856f1cd05b4c2d1d5ee378e
+ 02956363d6f32f35b3d1c081c5f217ab9a81985d
+ 8733b31e34e831f7a692dc64a28df24440e99db7
+ d4f930c347ed8bf08a9bdda8cbb0fce4e05142bd
+ 340c45597fbc37026ba4d902858d83cc157733fb
+ 640738ee46924b9a94a6cf1ef5b626ae9cfbac5e
+ 736ab773c4c451cf53991c09112c7bc5181fdf33
+ 6c69ec542e009c28ea66f743e8a61ed71047ee36
+ 8f4d1d62e5cff7117e44b4da740e5bcfce2ef657
+ 7292d147fba66e28de47a978099d78931f80c19e
+ 24f61ebed7a9df4f9d818b7cefabb345d815c571
~~~

git diff --stat origin/main...REF:
~~~text
 docs/product/OPERATOR_EVIDENCE_PILOT.md            |  94 +++++++++++
 frontend/src/cases/CaseExplorer.jsx                |  30 ++--
 frontend/src/compare/CompareWorkspace.jsx          |   7 +-
 frontend/src/compare/CompareWorkspace.test.jsx     |   7 +-
 frontend/src/lib/energyCasePack.js                 |   6 +-
 package.json                                       |   3 +
 .../constraint-core/test/energy-case-pack.test.mjs |  13 +-
 .../test/operator-evidence-gate1.test.mjs          | 146 +++++++++++++++++
 protocol/cases/energy-v1/case-pack.json            |  11 +-
 protocol/cases/energy-v1/cases/OPS-001.json        |  28 ++++
 .../energy-v1/evidence/ops-sample-evidence.json    | 147 +++++++++++++++++
 scripts/build_operator_case_evidence.mjs           | 113 ++++++++++++++
 scripts/case_workbench_gate1.mjs                   | 173 +++++++++++++++++++++
 state/product/operator_evidence_gate1/.gitignore   |   4 +
 14 files changed, 761 insertions(+), 21 deletions(-)
~~~

Equal tip blobs/presence: docs/product/OPERATOR_EVIDENCE_PILOT.md; packages/constraint-core/test/operator-evidence-gate1.test.mjs; protocol/cases/energy-v1/cases/OPS-001.json; protocol/cases/energy-v1/evidence/ops-sample-evidence.json; scripts/build_operator_case_evidence.mjs; scripts/case_workbench_gate1.mjs; state/product/operator_evidence_gate1/.gitignore


Absent on main: (none)


Different tip blobs/presence: frontend/src/cases/CaseExplorer.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/lib/energyCasePack.js; package.json; packages/constraint-core/test/energy-case-pack.test.mjs; protocol/cases/energy-v1/case-pack.json


Main-since-base overlap: docs/product/OPERATOR_EVIDENCE_PILOT.md; frontend/src/cases/CaseExplorer.jsx; frontend/src/compare/CompareWorkspace.jsx; frontend/src/compare/CompareWorkspace.test.jsx; frontend/src/lib/energyCasePack.js; package.json; packages/constraint-core/test/energy-case-pack.test.mjs; packages/constraint-core/test/operator-evidence-gate1.test.mjs; protocol/cases/energy-v1/case-pack.json; protocol/cases/energy-v1/cases/OPS-001.json; protocol/cases/energy-v1/evidence/ops-sample-evidence.json; scripts/build_operator_case_evidence.mjs; scripts/case_workbench_gate1.mjs; state/product/operator_evidence_gate1/.gitignore


### origin/feat/policy-lab-frontend-convergence-checkpoint

Tip ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   | 100 ++++++
 .../workflows/policy-lab-specialized-gauntlet.yml  | 141 ++++++++
 benchmark/gauntlet/policy-assumptions.v1.json      | 157 +++++++++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    | 118 +++++++
 ...policy-lab-external-validation-protocol.v1.json | 100 ++++++
 benchmark/gauntlet/policy-lab-specialized.v1.json  | 127 +++++++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   | 193 ++++++++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |  96 +++++
 docs/submission/README.md                          |  21 +-
 scripts/build_policy_lab_release_provenance.mjs    | 126 +++++++
 ...heck_policy_lab_external_gauntlet_protocols.mjs |  70 ++++
 scripts/run_policy_lab_specialized_gauntlet.mjs    | 388 +++++++++++++++++++++
 12 files changed, 1632 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md


Main-since-base overlap: (none)


### origin/feat/policy-lab-frontend-convergence-final

Tip ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   | 100 ++++++
 .../workflows/policy-lab-specialized-gauntlet.yml  | 141 ++++++++
 benchmark/gauntlet/policy-assumptions.v1.json      | 157 +++++++++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    | 118 +++++++
 ...policy-lab-external-validation-protocol.v1.json | 100 ++++++
 benchmark/gauntlet/policy-lab-specialized.v1.json  | 127 +++++++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   | 193 ++++++++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |  96 +++++
 docs/submission/README.md                          |  21 +-
 scripts/build_policy_lab_release_provenance.mjs    | 126 +++++++
 ...heck_policy_lab_external_gauntlet_protocols.mjs |  70 ++++
 scripts/run_policy_lab_specialized_gauntlet.mjs    | 388 +++++++++++++++++++++
 12 files changed, 1632 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md


Main-since-base overlap: (none)


### origin/feat/policy-lab-frontend-convergence-r1

Tip ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   | 100 ++++++
 .../workflows/policy-lab-specialized-gauntlet.yml  | 141 ++++++++
 benchmark/gauntlet/policy-assumptions.v1.json      | 157 +++++++++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    | 118 +++++++
 ...policy-lab-external-validation-protocol.v1.json | 100 ++++++
 benchmark/gauntlet/policy-lab-specialized.v1.json  | 127 +++++++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   | 193 ++++++++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |  96 +++++
 docs/submission/README.md                          |  21 +-
 scripts/build_policy_lab_release_provenance.mjs    | 126 +++++++
 ...heck_policy_lab_external_gauntlet_protocols.mjs |  70 ++++
 scripts/run_policy_lab_specialized_gauntlet.mjs    | 388 +++++++++++++++++++++
 12 files changed, 1632 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md


Main-since-base overlap: (none)


### origin/feat/policy-lab-frontend-convergence-v2

Tip ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 8e329ded2c46c128ba2cfb99bf4e59c8bf372bba
+ 754d2c5f4eff85da1d2eddfd578472db1d49a403
+ 41dac68cf700310378a89cf4aa61b473759a41e6
+ ecf8833cdc3a2572d9051445129d85511463cfac
+ af43eb3d0a9e55cd3416b3fc8928dba243d7f75a
+ 116fdb622e30e1d6071a50bdeb35c6205a8aa557
+ e44b840ec03dfeaf0af2ff87839f40de3921bca1
+ ec1b900c9dd8f52ac513ddbdd0153a14d993ef6b
+ 6989b3b95f38c3992cea5634d2cbea9da1a2b73e
+ 2e21a7ccdb6a5278a6a4db7c592c9b62b147c492
+ d14468a36e4a3db58b4a2b1333635849087240e2
+ a13075985f37fae960b57320e0eca1b8661c688b
+ 03908a992f7fd893a348a3f7606116d8a7870f34
+ 0553478ba14e6d11cbf00588d73192e670d03c6c
+ ffbe49d1564676a3aed16e25b05217dc7b81ec85
+ 0d321e9af10348a779eaec59c102be20ddd938d5
+ 23647c53058813ccf247156fbcb5860a739d5833
+ 725e33a99b4dfaa51c9694a2bc83a6d3bbc3fe4c
+ 8c82743f86bd244a276281ee29ec6d1a81301266
+ ea21f25c18a7348116f74f50f03bb6dbd11ed6e5
~~~

git diff --stat origin/main...REF:
~~~text
 .../workflows/policy-lab-release-attestation.yml   | 100 ++++++
 .../workflows/policy-lab-specialized-gauntlet.yml  | 141 ++++++++
 benchmark/gauntlet/policy-assumptions.v1.json      | 157 +++++++++
 benchmark/gauntlet/policy-lab-c3-c4-map.v1.json    | 118 +++++++
 ...policy-lab-external-validation-protocol.v1.json | 100 ++++++
 benchmark/gauntlet/policy-lab-specialized.v1.json  | 127 +++++++
 docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md   | 193 ++++++++++
 .../POLICY_LAB_STANDARDS_DIFFERENTIATION.md        |  96 +++++
 docs/submission/README.md                          |  21 +-
 scripts/build_policy_lab_release_provenance.mjs    | 126 +++++++
 ...heck_policy_lab_external_gauntlet_protocols.mjs |  70 ++++
 scripts/run_policy_lab_specialized_gauntlet.mjs    | 388 +++++++++++++++++++++
 12 files changed, 1632 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/policy-lab-release-attestation.yml; .github/workflows/policy-lab-specialized-gauntlet.yml; benchmark/gauntlet/policy-assumptions.v1.json; benchmark/gauntlet/policy-lab-c3-c4-map.v1.json; benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json; benchmark/gauntlet/policy-lab-specialized.v1.json; docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md; docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md; scripts/build_policy_lab_release_provenance.mjs; scripts/check_policy_lab_external_gauntlet_protocols.mjs; scripts/run_policy_lab_specialized_gauntlet.mjs


Different tip blobs/presence: docs/submission/README.md


Main-since-base overlap: (none)


### origin/feat/public-lab-workbench

Tip d9616839a63771653d7c073261a89f8255dee3f1; merge base d9e5b243b4e32364535750988daf0f291590f435.

git cherry origin/main REF:
~~~text
+ 3c60ec2c287d633d1b9049fd92ce4cc14b905022
+ defb0c2247d2ef8b66ec6de75fa00c80fbeb2d5b
+ 81ab5f38d05be9793792fb65096881dbc51338f2
+ 743f76c7b83089ff297a088f43c12b739529a7ce
+ d9616839a63771653d7c073261a89f8255dee3f1
~~~

git diff --stat origin/main...REF:
~~~text
 docs/product/PUBLIC_LAB_WORKBENCH_HANDOFF.md       | 276 +++++++++++
 .../public/samples/public_lab_sample_meter.csv     |  13 +
 frontend/src/App.jsx                               | 140 +++++-
 frontend/src/components/CurrencyLab.jsx            | 307 +++++++++++++
 frontend/src/components/EvidenceLab.jsx            | 342 ++++++++++++++
 .../EvidenceLab.receiptBoundary.test.jsx           |  69 +++
 frontend/src/components/LabSessionBar.jsx          |  71 +++
 frontend/src/components/PublicLabLanding.jsx       | 162 ++++---
 frontend/src/components/ResearchPanel.jsx          |  84 ++++
 frontend/src/components/SpkV1Console.jsx           |  13 +-
 frontend/src/components/SpkV1Console.test.jsx      |   2 +-
 frontend/src/constants/contracts.js                |   4 +
 frontend/src/index.css                             | 317 +++++++++++++
 frontend/src/lib/currencyLab.js                    | 374 +++++++++++++++
 frontend/src/lib/evidenceLab.js                    | 504 +++++++++++++++++++++
 frontend/src/lib/evidenceLab.test.js               | 309 +++++++++++++
 frontend/src/lib/labScenarios.js                   | 123 +++++
 frontend/src/lib/labScenarios.test.js              |  63 +++
 frontend/src/lib/sessionReceipt.js                 |  93 ++++
 frontend/src/lib/sessionReceipt.test.js            |  74 +++
 frontend/src/workbenchSession.css                  | 223 +++++++++
 21 files changed, 3466 insertions(+), 97 deletions(-)
~~~

Equal tip blobs/presence: frontend/public/samples/public_lab_sample_meter.csv; frontend/src/components/CurrencyLab.jsx; frontend/src/components/EvidenceLab.receiptBoundary.test.jsx; frontend/src/components/LabSessionBar.jsx; frontend/src/components/PublicLabLanding.jsx; frontend/src/components/SpkV1Console.jsx; frontend/src/components/SpkV1Console.test.jsx; frontend/src/lib/currencyLab.js; frontend/src/lib/evidenceLab.js; frontend/src/lib/evidenceLab.test.js; frontend/src/lib/labScenarios.js; frontend/src/lib/labScenarios.test.js; frontend/src/lib/sessionReceipt.js; frontend/src/lib/sessionReceipt.test.js


Absent on main: docs/product/PUBLIC_LAB_WORKBENCH_HANDOFF.md


Different tip blobs/presence: frontend/src/App.jsx; frontend/src/components/EvidenceLab.jsx; frontend/src/components/ResearchPanel.jsx; frontend/src/constants/contracts.js; frontend/src/index.css; frontend/src/workbenchSession.css


Main-since-base overlap: frontend/public/samples/public_lab_sample_meter.csv; frontend/src/App.jsx; frontend/src/components/CurrencyLab.jsx; frontend/src/components/EvidenceLab.jsx; frontend/src/components/EvidenceLab.receiptBoundary.test.jsx; frontend/src/components/LabSessionBar.jsx; frontend/src/components/PublicLabLanding.jsx; frontend/src/components/ResearchPanel.jsx; frontend/src/components/SpkV1Console.jsx; frontend/src/components/SpkV1Console.test.jsx; frontend/src/constants/contracts.js; frontend/src/index.css; frontend/src/lib/currencyLab.js; frontend/src/lib/evidenceLab.js; frontend/src/lib/evidenceLab.test.js; frontend/src/lib/labScenarios.js; frontend/src/lib/labScenarios.test.js; frontend/src/lib/sessionReceipt.js; frontend/src/lib/sessionReceipt.test.js; frontend/src/workbenchSession.css


### origin/fix/constraint-release-links

Tip 0565ce15d84daa61b3c7366b19e1a5b15083cfbd; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
+ 12585fffeefbbf24d05e73f14e70ee09b77b4d4f
+ 511777836499ba524255056fddd3ebd8076ad102
+ 0565ce15d84daa61b3c7366b19e1a5b15083cfbd
~~~

git diff --stat origin/main...REF:
~~~text
 CITATION.cff                                       | 34 ++++++----
 README.md                                          |  4 +-
 docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md      |  9 +++
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 76 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 5 files changed, 111 insertions(+), 18 deletions(-)
~~~

Equal tip blobs/presence: docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: CITATION.cff; README.md


Main-since-base overlap: CITATION.cff; README.md; docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/fix/constraint-release-links-copy

Tip 7a5211f8fbc55a3a708b6cffd216565fdef109fb; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 3 files changed, 79 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/fix/policy-live-smoke-bootstrap-20260917

Tip 03e331c06f03eab3dae01715983d2ac244b19674; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 03e331c06f03eab3dae01715983d2ac244b19674
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/policy-lab-live-smoke.yml | 10 ++++++----
 scripts/smoke_live_policy_lab.mjs           |  9 +++++----
 2 files changed, 11 insertions(+), 8 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: .github/workflows/policy-lab-live-smoke.yml; scripts/smoke_live_policy_lab.mjs


Main-since-base overlap: .github/workflows/policy-lab-live-smoke.yml; scripts/smoke_live_policy_lab.mjs


### origin/global-ai-finance-portal-ready-rc5

Tip ceea90be3522956b6f1da10387a2bc637ae70a31; merge base c6b93a117a68df859e03d44e4a147bb949a79e3a.

git cherry origin/main REF:
~~~text
+ cc9d83b316d0f632bba8ac21747953a1cd0066b0
+ 788cf228a1d32cb50bb7a963539bb6a86d155b89
+ 9299d3a365dba123fc368af59fb37f70478eeff4
+ f4a34c5e310a445d8b8f03a58134fc61384fa6ff
+ ceea90be3522956b6f1da10387a2bc637ae70a31
~~~

git diff --stat origin/main...REF:
~~~text
 .../global-ai-finance-2026/CONFTOOL_COPY_PASTE.md  | 69 +++++++++++++++++
 .../PORTAL_AND_OWNER_ACTIONS.md                    | 90 ++++++++++++----------
 .../POSTER_EXTENDED_ABSTRACT.md                    | 52 ++++---------
 .../SUBMISSION_MANIFEST.json                       | 48 ++++++------
 scripts/check_submission_capsule.mjs               | 60 +++++++--------
 5 files changed, 188 insertions(+), 131 deletions(-)
~~~

Equal tip blobs/presence: docs/submission/opportunities-2026/global-ai-finance-2026/CONFTOOL_COPY_PASTE.md; docs/submission/opportunities-2026/global-ai-finance-2026/PORTAL_AND_OWNER_ACTIONS.md; docs/submission/opportunities-2026/global-ai-finance-2026/POSTER_EXTENDED_ABSTRACT.md; docs/submission/opportunities-2026/global-ai-finance-2026/SUBMISSION_MANIFEST.json; scripts/check_submission_capsule.mjs


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: docs/submission/opportunities-2026/global-ai-finance-2026/CONFTOOL_COPY_PASTE.md; docs/submission/opportunities-2026/global-ai-finance-2026/PORTAL_AND_OWNER_ACTIONS.md; docs/submission/opportunities-2026/global-ai-finance-2026/POSTER_EXTENDED_ABSTRACT.md; docs/submission/opportunities-2026/global-ai-finance-2026/SUBMISSION_MANIFEST.json; scripts/check_submission_capsule.mjs


### origin/humanize-global-ai-finance-submission

Tip 99470aff47057c1df912d0daa07685c3bb4f3bfb; merge base 99470aff47057c1df912d0daa07685c3bb4f3bfb.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/invisible-ledger/full-capacity-2026

Tip 4196984a0d667c5d852429c46f6dc237b7dd4db9; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 22483b4a940c78798118c4b5d2818a8b85969a72
+ 6507258309f1a87f871a0059c2d08163c6da647f
+ 3e4462375c4ccef0a148f4c125b1311d4bd2a807
+ cd1502a624fe1ca932716e79bbf5eb352e8d269b
+ 610a131287f28728dd1966401837615ca6787b08
+ dca8e7c1fc07c72566540055e48aca8520dd5416
+ c58615e736fe9277d9ecb945aa6846257c458453
+ 6901b5446f61517df15e8a66b6d41ca6962f8a24
+ c9a70d00baa3cb8d0ab46d17d95fbc778593f69f
+ 10b1563132c894be56b36d288756ea4c3682c848
+ 7694501510a73d015947ca295cf55a266978df9d
+ 32f139e1366ef3711e856a2eaee08a20edfd069f
+ 1d292564a6ea6c4e46122eff238934ed8f57f55b
+ 884e16bbaa136791af75e077876238550d4d3da7
+ f83c154ebb17e662485f434a0ac726d96a0b2594
+ 6df72661c2f8168643990c192f9ec46bb1b5dd9c
+ 2b5145138bcd60320efbfb9ade4ad428273f9309
+ b67de42e868b3152b9928207579bc451f6c64de4
+ 9e00c3a5ac6d3b226a97c6674ff8a1d4100ca081
+ 8377d86e4bfeee5c49b62b75a5d99edbedc24cf6
+ 7de1c81de4dbaafb8f7e2bd9c3282fc08d6d0432
+ 39c8b6498f00a903712386d735a0bbc0de58df62
+ d8debe61008e6f8cd9376834e1c2e1503ad8d297
+ d24ea6b1398ed26a2c1991d335b08c7967a16536
+ ddb4708d3486d5e363c89070939c542f5cc28ba4
+ 8d48ad66dd2248c5c61b5d89454edb36ab68a4db
+ 700455016d35532f39ff768fb7597aa44d492427
+ 16d3283ff2869d3083aad3ab1aa8705837926562
+ c7ad4b22fb33d9ca37305d43a170a2dab0884fe7
+ 7853f2f888f4a74ef8064077ec578eecfe868d59
+ dd2b3ab2c81476521296904307fd5579f799f4e6
+ cbd8a57bbc47443aa37d7b7e08f527b51838fb15
+ 5c27d5de84688f5fdc403a940a6aa6611b7d7336
+ 62d7236b9ba1cfbbc0f3b9a5e4e500888df9cbd6
+ 78fd2fb587536879e069c2ba72bdbf137cfae691
+ 9a186716e424619f71b4d9f12f821a15f3532180
+ ec4d272a33f3e6cb13268711420808e50fec1ff3
+ 2cab6943a00892ed7c8afeff64bf2e2f89298703
+ 4cc6140a66dc2fabcb58314c2785875d2f10da28
+ ebad6babfba6faed13b52aae510f1f92727a9763
+ 253e0324e879da47e42e7a515646930c782da1aa
+ ee9c190f551a6c8e8baa68703ac8fb81f853b721
+ 2f2cb83307f93207dcddb8484872cc54bd326055
+ 92375254d0679c0805cebd5f8ab26ac43d2c7661
+ 7c1a6fbe5e088b4bf3fd729363622f037e554c25
+ 0127ddda0f7bd7472202788e36c3c83289b888b3
+ 4196984a0d667c5d852429c46f6dc237b7dd4db9
~~~

git diff --stat origin/main...REF:
~~~text
 .../invisible-ledger-support-validation.yml        |  47 +++
 .../rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md       |  52 +++
 .../rebuilt_2026/BI_DEFINITION_LEDGER.csv          |   9 +
 .../rebuilt_2026/BPS_BUSINESS_CHARACTERISTICS.csv  |  13 +
 .../rebuilt_2026/BPS_GROWTH_ANATOMY.csv            |  14 +
 .../rebuilt_2026/DATA_PRODUCT_SCHEMAS.md           | 278 ++++++++++++
 .../rebuilt_2026/EVIDENCE_FREEZE_PREVIEW.md        | 124 ++++++
 .../rebuilt_2026/EXCLUSION_LEDGER.csv              |  10 +
 .../rebuilt_2026/FIGURES_TABLES_SPEC.md            | 226 ++++++++++
 .../rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md      | 315 ++++++++++++++
 .../INSTITUTIONAL_VISIBILITY_MATRIX.csv            |   4 +
 .../INVISIBLE_LEDGER_PUBLICATION_CANDIDATE_2026.md | 466 +++++++++++++++++++++
 .../rebuilt_2026/ISSUER_DEFINITION_LEDGER.csv      |  10 +
 .../rebuilt_2026/ISSUER_TRANSITION_LEDGER.csv      |   4 +
 .../rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv         |  17 +
 .../rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md    | 117 ++++++
 .../OVERLAP_CONTROL_WITH_DIGITAL_TAX.md            |  99 +++++
 .../rebuilt_2026/PUBLICATION_READINESS.md          | 107 +++++
 .../rebuilt_2026/RESULT_REPRODUCTION_MAP.csv       |  10 +
 .../rebuilt_2026/SOURCE_REGISTER.csv               |  17 +
 .../rebuilt_2026/SSRN_SUPERSESSION_NOTE.md         |  54 +++
 .../rebuilt_2026/SUBMISSION_MATERIALS.md           | 152 +++++++
 .../rebuilt_2026/SUPPORT_PACKAGE_MANIFEST.md       | 202 +++++++++
 .../rebuilt_2026/TOKOPEDIA_RECONCILIATION.csv      |   8 +
 .../rebuilt_2026/VALIDATION_REPORT_2026-09-14.md   |  46 ++
 .../rebuilt_2026/VENUE_ROUTE_ECRA.md               | 104 +++++
 .../rebuilt_2026/validate_publication_candidate.py | 119 ++++++
 .../rebuilt_2026/validate_reproduction_map.py      |  80 ++++
 .../rebuilt_2026/validate_support_package.py       | 211 ++++++++++
 29 files changed, 2915 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/invisible-ledger-support-validation.yml; IE-JDE/Invisible_Economy/rebuilt_2026/AI_ASSISTANCE_DISCLOSURE.md; IE-JDE/Invisible_Economy/rebuilt_2026/BI_DEFINITION_LEDGER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/BPS_BUSINESS_CHARACTERISTICS.csv; IE-JDE/Invisible_Economy/rebuilt_2026/BPS_GROWTH_ANATOMY.csv; IE-JDE/Invisible_Economy/rebuilt_2026/DATA_PRODUCT_SCHEMAS.md; IE-JDE/Invisible_Economy/rebuilt_2026/EVIDENCE_FREEZE_PREVIEW.md; IE-JDE/Invisible_Economy/rebuilt_2026/EXCLUSION_LEDGER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/FIGURES_TABLES_SPEC.md; IE-JDE/Invisible_Economy/rebuilt_2026/HOSTILE_PUBLICATION_AUDIT.md; IE-JDE/Invisible_Economy/rebuilt_2026/INSTITUTIONAL_VISIBILITY_MATRIX.csv; IE-JDE/Invisible_Economy/rebuilt_2026/INVISIBLE_LEDGER_PUBLICATION_CANDIDATE_2026.md; IE-JDE/Invisible_Economy/rebuilt_2026/ISSUER_DEFINITION_LEDGER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/ISSUER_TRANSITION_LEDGER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/MANUSCRIPT_SOURCE_MAP.csv; IE-JDE/Invisible_Economy/rebuilt_2026/NOVELTY_AND_PRIOR_ART_AUDIT.md; IE-JDE/Invisible_Economy/rebuilt_2026/OVERLAP_CONTROL_WITH_DIGITAL_TAX.md; IE-JDE/Invisible_Economy/rebuilt_2026/PUBLICATION_READINESS.md; IE-JDE/Invisible_Economy/rebuilt_2026/RESULT_REPRODUCTION_MAP.csv; IE-JDE/Invisible_Economy/rebuilt_2026/SOURCE_REGISTER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/SSRN_SUPERSESSION_NOTE.md; IE-JDE/Invisible_Economy/rebuilt_2026/SUBMISSION_MATERIALS.md; IE-JDE/Invisible_Economy/rebuilt_2026/SUPPORT_PACKAGE_MANIFEST.md; IE-JDE/Invisible_Economy/rebuilt_2026/TOKOPEDIA_RECONCILIATION.csv; IE-JDE/Invisible_Economy/rebuilt_2026/VALIDATION_REPORT_2026-09-14.md; IE-JDE/Invisible_Economy/rebuilt_2026/VENUE_ROUTE_ECRA.md; IE-JDE/Invisible_Economy/rebuilt_2026/validate_publication_candidate.py; IE-JDE/Invisible_Economy/rebuilt_2026/validate_reproduction_map.py; IE-JDE/Invisible_Economy/rebuilt_2026/validate_support_package.py


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/invisible-ledger/v2-research-pack

Tip 5993b815e54ad8eae0e2c0a3cccd222a416664c5; merge base 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

git cherry origin/main REF:
~~~text
+ 4f1cbb567eff8ac98bdfe344e37c0f6cd351e06c
+ f58b27c3c67c1caf54b9e0698d9d6f7557363610
+ 9e3f4d09f1ccf0a7eb2a7a8dab2822c049a3b8e4
+ 1b603ca933793ef2b4b7b9a7c12dcd7e361aa437
+ c91f3235ea607959a1a3e55026b42d844dc30d49
+ a3b56c94a6e9c7b506fa9d38bc826cc00645aa60
+ d0264474e745ec5fbfb3b3070ad2ff235269dd63
+ 4a566d45f73a3edc7ad9397d027af90735e4f8ad
+ f29a2952b8ea0ea2495258a3ea0343467a6312b1
+ c2faa5fafee342c25d4f77802d1abdd7f8a68e35
+ 86abb44a6f64084595f83c387d8fbdafec4a9ea6
+ f1ed0167d972a42327b9251997b8ebdd75f09a1e
+ 5993b815e54ad8eae0e2c0a3cccd222a416664c5
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/invisible-ledger-v2-validate.yml |  24 +++
 .../rebuilt_2026/CLAIM_BOUNDARIES.md               | 111 ++++++++++
 .../rebuilt_2026/CONSOLIDATION_BOUNDARY.md         | 107 ++++++++++
 .../rebuilt_2026/EVIDENCE_ARCHITECTURE.csv         |  12 ++
 .../INSTITUTIONAL_VISIBILITY_CHAIN.csv             |   9 +
 .../rebuilt_2026/ISSUER_ADMISSION_RULES.md         | 119 +++++++++++
 .../rebuilt_2026/LEGACY_MIGRATION.md               |  58 +++++
 .../rebuilt_2026/PROPOSAL_SYNC_CHECKLIST.md        | 121 +++++++++++
 IE-JDE/Invisible_Economy/rebuilt_2026/README.md    |  73 +++++++
 .../rebuilt_2026/REPRODUCTION_PLAN.md              | 236 +++++++++++++++++++++
 .../rebuilt_2026/RESULT_REGISTER.csv               |  16 ++
 .../rebuilt_2026/validate_il_v2_pack.py            | 196 +++++++++++++++++
 12 files changed, 1082 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/invisible-ledger-v2-validate.yml; IE-JDE/Invisible_Economy/rebuilt_2026/CLAIM_BOUNDARIES.md; IE-JDE/Invisible_Economy/rebuilt_2026/CONSOLIDATION_BOUNDARY.md; IE-JDE/Invisible_Economy/rebuilt_2026/EVIDENCE_ARCHITECTURE.csv; IE-JDE/Invisible_Economy/rebuilt_2026/INSTITUTIONAL_VISIBILITY_CHAIN.csv; IE-JDE/Invisible_Economy/rebuilt_2026/ISSUER_ADMISSION_RULES.md; IE-JDE/Invisible_Economy/rebuilt_2026/LEGACY_MIGRATION.md; IE-JDE/Invisible_Economy/rebuilt_2026/PROPOSAL_SYNC_CHECKLIST.md; IE-JDE/Invisible_Economy/rebuilt_2026/README.md; IE-JDE/Invisible_Economy/rebuilt_2026/REPRODUCTION_PLAN.md; IE-JDE/Invisible_Economy/rebuilt_2026/RESULT_REGISTER.csv; IE-JDE/Invisible_Economy/rebuilt_2026/validate_il_v2_pack.py


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/package/policy-lab-claim-boundary-20260918

Tip 1d2d17199ddec32d8bc2254fa546386abd355c01; merge base 1d2d17199ddec32d8bc2254fa546386abd355c01.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/package/policy-lab-new-case-20260919

Tip 655c51e288f1e3914b820e0ca2f99965da275fc4; merge base 655c51e288f1e3914b820e0ca2f99965da275fc4.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-assessment-package-recovery

Tip f3171a5becfb5a382c3ecc4a841c121c10d14a62; merge base e4cbcefc2c983ba9f1c9787494f6ba22d6525f26.

git cherry origin/main REF:
~~~text
+ a902bbf30a487b6119f94d390c71d69c50358018
+ b04a4e46a263cae84b2b1fe0c2bb1e6fb58340f8
+ 91615cb4528741fb66db5c25869b568f5cf4157c
+ 0224a7e94ba73931c295a7efff6dbff47f280fb5
+ f3171a5becfb5a382c3ecc4a841c121c10d14a62
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/current-surface.yml              |   8 +
 .github/workflows/external-case-001p-ausgrid.yml   |  35 +-
 CURRENT_SURFACE.json                               |  10 +
 .../claim-assessment-package.v0.1.schema.json      | 297 +++++++++++++++++
 scripts/build_claim_assessment_package.mjs         | 253 +++++++++++++++
 scripts/check_current_surface.mjs                  |  22 ++
 scripts/lib/claim_assessment_package_v0_1.mjs      | 353 +++++++++++++++++++++
 scripts/policy_lab_preflight.mjs                   |  21 ++
 scripts/verify_claim_assessment_package.mjs        | 160 ++++++++++
 9 files changed, 1158 insertions(+), 1 deletion(-)
~~~

Equal tip blobs/presence: protocol/schema/claim-assessment-package.v0.1.schema.json; scripts/build_claim_assessment_package.mjs; scripts/lib/claim_assessment_package_v0_1.mjs; scripts/verify_claim_assessment_package.mjs


Absent on main: (none)


Different tip blobs/presence: .github/workflows/current-surface.yml; .github/workflows/external-case-001p-ausgrid.yml; CURRENT_SURFACE.json; scripts/check_current_surface.mjs; scripts/policy_lab_preflight.mjs


Main-since-base overlap: .github/workflows/current-surface.yml; .github/workflows/external-case-001p-ausgrid.yml; CURRENT_SURFACE.json; protocol/schema/claim-assessment-package.v0.1.schema.json; scripts/build_claim_assessment_package.mjs; scripts/check_current_surface.mjs; scripts/lib/claim_assessment_package_v0_1.mjs; scripts/policy_lab_preflight.mjs; scripts/verify_claim_assessment_package.mjs


### origin/policy-lab-deploy-curation

Tip 17622bb54b0bb9f8e32d420408ee99c5c00e5a35; merge base 17622bb54b0bb9f8e32d420408ee99c5c00e5a35.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-dpg-readiness

Tip 18bcd9a9c6d744ba514e988aba351b5085dfdde9; merge base 18bcd9a9c6d744ba514e988aba351b5085dfdde9.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-dpg-readiness-final

Tip f8f8c6fa5e93bea1661cf29078502c5e5c400955; merge base 18bcd9a9c6d744ba514e988aba351b5085dfdde9.

git cherry origin/main REF:
~~~text
+ 61f9991d55709973ce404eb37df5aff36c88a769
+ 347f63043b578dba83cd35b3f6243ebe01a066fb
+ 3e5c2f21aa1e305d46f8c7633f690861af8d9e0b
+ 997ac34ec99c3290d7215ddd78e6d9b037549111
+ a82b8e2b2dc2c18751273d2299d9f33ff1780cd4
+ 0bdcc9ac588dc9ea0a088b092f199623504d6596
+ 21c67a4bf00206f5f0e51101883c0d8e8fbc605b
+ 520b826cd19d415ca26b5126098daa088503268d
+ 9a7223bcb84a3637eac00e19e6c453a6914ba420
+ c4da898edb1b6200183f19742402c9fa4ea8593c
+ f8f8c6fa5e93bea1661cf29078502c5e5c400955
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/current-surface.yml              |  16 ++
 CODE_OF_CONDUCT.md                                 |  38 +++
 CURRENT_SURFACE.json                               |  10 +
 GOVERNANCE.md                                      |  62 +++++
 PRIVACY.md                                         |  47 ++++
 PUBLIC_INTEREST.md                                 |  81 ++++++
 README.md                                          |  14 +
 SECURITY.md                                        |  74 +++++
 .../dpg-registry/DPG_APPLICATION_DRAFT.md          | 304 +++++++++++++++++++++
 scripts/check_public_governance.mjs                | 120 ++++++++
 10 files changed, 766 insertions(+)
~~~

Equal tip blobs/presence: .github/workflows/current-surface.yml; CODE_OF_CONDUCT.md; GOVERNANCE.md; PUBLIC_INTEREST.md; SECURITY.md; docs/submission/opportunities-2026/dpg-registry/DPG_APPLICATION_DRAFT.md; scripts/check_public_governance.mjs


Absent on main: (none)


Different tip blobs/presence: CURRENT_SURFACE.json; PRIVACY.md; README.md


Main-since-base overlap: .github/workflows/current-surface.yml; CODE_OF_CONDUCT.md; CURRENT_SURFACE.json; GOVERNANCE.md; PRIVACY.md; PUBLIC_INTEREST.md; README.md; SECURITY.md; docs/submission/opportunities-2026/dpg-registry/DPG_APPLICATION_DRAFT.md; scripts/check_public_governance.mjs


### origin/policy-lab-dpg-readiness-v2

Tip 18bcd9a9c6d744ba514e988aba351b5085dfdde9; merge base 18bcd9a9c6d744ba514e988aba351b5085dfdde9.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-dpg-readiness-v3

Tip 18bcd9a9c6d744ba514e988aba351b5085dfdde9; merge base 18bcd9a9c6d744ba514e988aba351b5085dfdde9.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-dpg-readiness-v4

Tip 18bcd9a9c6d744ba514e988aba351b5085dfdde9; merge base 18bcd9a9c6d744ba514e988aba351b5085dfdde9.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-dpg-status-sync

Tip e93584cdadfcf57f2cff45cf6ee4bcddd9a4dc05; merge base e93584cdadfcf57f2cff45cf6ee4bcddd9a4dc05.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-gauntlet-submission-readiness

Tip 9e4b348e9c9784e6b01933273e1f25d6734bc68e; merge base 9e4b348e9c9784e6b01933273e1f25d6734bc68e.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-identity-curation

Tip 54b8852c2547ab4747af41c67294368903886d5b; merge base bd297309ca510081935010b8d84de9913de95996.

git cherry origin/main REF:
~~~text
+ ab22af1757a15157c968d64ee39ac2f0db44d78b
+ 8c1b552b70f60d2e1396886bbcc0dd2ee7874a20
+ 96451a790ff7c78876e635a01d583c056ebbe3ad
+ 471cbd0384432363cb577d161366099caf851365
+ 2f9f096e4ee495b3bba541c6dc10f2a1ca6fb3d6
+ 7a0056155fbca7c81c5fc75a6ae4b0bb934059c4
+ 63857d7b0f73d7233460e923b923ec50c898ff3b
+ 0282bfafc2441c29b13552e1ef99fcf580732c60
+ b2d33b503f794cf29babcdd7b67d77c247ec0358
+ 646c28e6c654124d332b58f3bbad210285cbd47a
+ b719bd9eeb8b6cdefb75194236a80078a87613fd
+ d3fcbbd80a03f4802b06db5dc884eb1a52f016c5
+ 438fff98db8822662bbc4ce4f17681bc7efe0b24
+ 08e70025043c429f92baada57083e1026c80e128
+ 54b8852c2547ab4747af41c67294368903886d5b
~~~

git diff --stat origin/main...REF:
~~~text
 .claude/HANDOFF.md                    |  73 +----
 .github/workflows/current-surface.yml |  14 +
 AGENTS.md                             |  54 ++--
 CURRENT_SURFACE.json                  |   7 +
 DOCS.md                               | 217 +++------------
 HANDOFF.md                            |  17 +-
 README.md                             | 484 ++++++++--------------------------
 frontend/src/App.jsx                  |   8 +-
 package.json                          |  23 +-
 scripts/check_current_surface.mjs     |  67 ++++-
 scripts/smoke_live_policy_lab.mjs     |  11 +
 11 files changed, 304 insertions(+), 671 deletions(-)
~~~

Equal tip blobs/presence: .claude/HANDOFF.md; AGENTS.md


Absent on main: (none)


Different tip blobs/presence: .github/workflows/current-surface.yml; CURRENT_SURFACE.json; DOCS.md; HANDOFF.md; README.md; frontend/src/App.jsx; package.json; scripts/check_current_surface.mjs; scripts/smoke_live_policy_lab.mjs


Main-since-base overlap: .claude/HANDOFF.md; .github/workflows/current-surface.yml; AGENTS.md; CURRENT_SURFACE.json; DOCS.md; HANDOFF.md; README.md; frontend/src/App.jsx; package.json; scripts/check_current_surface.mjs; scripts/smoke_live_policy_lab.mjs


### origin/policy-lab-innoserve-2026

Tip fd189cbd92f4581b7c0da3396240fbdffdf979c8; merge base fd189cbd92f4581b7c0da3396240fbdffdf979c8.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-innoserve-packaging-finalize

Tip 2eca4c36d84adf51ed4ea2cf2fb5c9882f02a616; merge base 2eca4c36d84adf51ed4ea2cf2fb5c9882f02a616.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-live-validation-v1

Tip b5cabcccb688f586786442373c6af9f1a67c380d; merge base 51c36722702986e4f355434c566740526d8d93ee.

git cherry origin/main REF:
~~~text
+ 66165ecc9ff0a22f8d174b524b9d63f0c1b20e1a
+ 2e09ff9a0139cd5d528a90cd9ec928151f8fa685
+ 11fd53130b80b7250a6f97956fe4d87b51d88531
+ 05040a9e5f20052b12b2e7706f0b8c51d069a045
+ 33ff84df53d8d4b21f5afae4757cfe554c262b27
+ a28ed6ca2a9a245b3e1ab681e1f0f18d85f6f87d
+ b5cabcccb688f586786442373c6af9f1a67c380d
~~~

git diff --stat origin/main...REF:
~~~text
 .github/ISSUE_TEMPLATE/policy-lab-evaluation.md    |  69 +++++++
 .github/ISSUE_TEMPLATE/public-lab-pilot.md         |  61 ++++--
 .github/ISSUE_TEMPLATE/research-replication.md     |  57 ++++--
 .github/workflows/policy-lab-live-smoke.yml        |  34 +++
 docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md | 228 +++++++++++++++++++++
 docs/research/EXTERNAL_VALIDATION_LEDGER.md        | 105 ++++++++++
 scripts/smoke_live_policy_lab.mjs                  |  81 ++++++++
 7 files changed, 597 insertions(+), 38 deletions(-)
~~~

Equal tip blobs/presence: .github/ISSUE_TEMPLATE/policy-lab-evaluation.md; .github/ISSUE_TEMPLATE/public-lab-pilot.md; .github/ISSUE_TEMPLATE/research-replication.md; docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md; docs/research/EXTERNAL_VALIDATION_LEDGER.md


Absent on main: (none)


Different tip blobs/presence: .github/workflows/policy-lab-live-smoke.yml; scripts/smoke_live_policy_lab.mjs


Main-since-base overlap: .github/ISSUE_TEMPLATE/policy-lab-evaluation.md; .github/ISSUE_TEMPLATE/public-lab-pilot.md; .github/ISSUE_TEMPLATE/research-replication.md; .github/workflows/policy-lab-live-smoke.yml; docs/project/POLICY_LAB_LIVE_VALIDATION_RUNBOOK.md; docs/research/EXTERNAL_VALIDATION_LEDGER.md; scripts/smoke_live_policy_lab.mjs


### origin/policy-lab-opportunity-pack-2026-08-25

Tip 7d325f755ca3e33333e7e35314a622014c5c5d12; merge base 7d325f755ca3e33333e7e35314a622014c5c5d12.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-packaging-v1

Tip 8a560ba6c5c772561cf57e367c86c94e06b26d18; merge base 582e8812b6f84d900a3276b8522883d4d71269c8.

git cherry origin/main REF:
~~~text
+ 6f5fd5a5e780a675e90fb7a7013d5a95743d2695
+ 415d7957f0cab9dcd9c7c24332ee80b90d625a36
+ 7aa5785aadbd2a7107d47fbfe34d49f8e2b2cadc
+ bb6c4d8ecda054a5a41cf0e60213296b7873271c
+ 1775a06e8a5dca179163ce9d81ce18a61edf58f1
+ 8a560ba6c5c772561cf57e367c86c94e06b26d18
~~~

git diff --stat origin/main...REF:
~~~text
 .github/ISSUE_TEMPLATE/config.yml          |  15 +-
 CONTRIBUTING.md                            | 112 +++++--
 CURRENT_STATUS.md                          | 267 ++++++++++++---
 DEMO_WALKTHROUGH.md                        | 327 ++++++++++++++----
 DOCS.md                                    | 255 +++++++++-----
 docs/project/PUBLIC_CONVERSION_PLAYBOOK.md | 511 ++++++++++++-----------------
 6 files changed, 966 insertions(+), 521 deletions(-)
~~~

Equal tip blobs/presence: .github/ISSUE_TEMPLATE/config.yml; CONTRIBUTING.md; CURRENT_STATUS.md; DEMO_WALKTHROUGH.md; docs/project/PUBLIC_CONVERSION_PLAYBOOK.md


Absent on main: (none)


Different tip blobs/presence: DOCS.md


Main-since-base overlap: .github/ISSUE_TEMPLATE/config.yml; CONTRIBUTING.md; CURRENT_STATUS.md; DEMO_WALKTHROUGH.md; DOCS.md; docs/project/PUBLIC_CONVERSION_PLAYBOOK.md


### origin/policy-lab-post-deploy-smoke

Tip 8bae6ecf4c05ac229b9395ad429e988c63740426; merge base 9176f3cd35dd7ce2cabf17bb21918d224c9176a7.

git cherry origin/main REF:
~~~text
- 8bae6ecf4c05ac229b9395ad429e988c63740426
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/policy-lab-live-smoke.yml | 6 ++++++
 1 file changed, 6 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: .github/workflows/policy-lab-live-smoke.yml


Main-since-base overlap: .github/workflows/policy-lab-live-smoke.yml


### origin/policy-lab-root-archive

Tip 5f54966cae3361fdc901b7776a6571cd0eced29f; merge base 5f54966cae3361fdc901b7776a6571cd0eced29f.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/policy-lab-source-truth-curation

Tip f5351f7db28dd2cae1f855250a055fa1f2a6d91d; merge base f5351f7db28dd2cae1f855250a055fa1f2a6d91d.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/release/constraint-public-alpha

Tip 7a5211f8fbc55a3a708b6cffd216565fdef109fb; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 3 files changed, 79 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-final

Tip 12585fffeefbbf24d05e73f14e70ee09b77b4d4f; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
+ 12585fffeefbbf24d05e73f14e70ee09b77b4d4f
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md      |  9 +++
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 4 files changed, 88 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-hotfix

Tip 7a5211f8fbc55a3a708b6cffd216565fdef109fb; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 3 files changed, 79 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-merge

Tip 12585fffeefbbf24d05e73f14e70ee09b77b4d4f; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
+ 12585fffeefbbf24d05e73f14e70ee09b77b4d4f
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md      |  9 +++
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 4 files changed, 88 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-r1

Tip 12585fffeefbbf24d05e73f14e70ee09b77b4d4f; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
+ 12585fffeefbbf24d05e73f14e70ee09b77b4d4f
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md      |  9 +++
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 4 files changed, 88 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-ready

Tip 12585fffeefbbf24d05e73f14e70ee09b77b4d4f; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
+ 12585fffeefbbf24d05e73f14e70ee09b77b4d4f
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md      |  9 +++
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 4 files changed, 88 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/PUBLIC_ALPHA_RELEASE_POINTER.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/release/constraint-public-alpha-v2

Tip 7a5211f8fbc55a3a708b6cffd216565fdef109fb; merge base d52101b0cdd73609476745eab268565cf63749d6.

git cherry origin/main REF:
~~~text
+ 5cfdfe3a124a41750c91f5abc73a832c875042e2
+ 437d1cc2d4aef02188e862fede2df5f4ded73385
+ 7a5211f8fbc55a3a708b6cffd216565fdef109fb
~~~

git diff --stat origin/main...REF:
~~~text
 README.md                                          |  4 +-
 .../RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md        | 74 ++++++++++++++++++++++
 frontend/src/constants/contracts.js                |  6 +-
 3 files changed, 79 insertions(+), 5 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/constants/contracts.js


Absent on main: (none)


Different tip blobs/presence: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md


Main-since-base overlap: README.md; docs/protocol/RELEASE_NOTE_CONSTRAINT_PUBLIC_ALPHA.md; frontend/src/constants/contracts.js


### origin/research/norway-institutional-evidence

Tip 84af09f717ba5498859e6dbd187eb0ea70700342; merge base 841df2ce0b45427eb2292624a25a5d291fc5c949.

git cherry origin/main REF:
~~~text
+ a28a1c2fe1fe8f11a88a08ea00b67907038e03ff
+ d37c4935e4e876b2ba5d2f2db497630e0a6742e6
+ 5c62005a73fa3bb846115c8b2336203faae804cf
+ e280219f2214a30124aa659cc4df509b723ce8ce
+ 34db783f618cde3cf195d3e7c7ef6713f6856691
+ 0e556d581f0725382a991ba79675eaa5bccbd0c4
+ df25eb1ab68911f61177bd90fc8ce499abee14ca
+ 660133b241b34780366d4ed7ce9e3e092a0befbe
+ cecea7c34656788acb1b43742395860a36275243
+ ce94dd51580d257ce446db37bed38847f601ecbc
+ 84af09f717ba5498859e6dbd187eb0ea70700342
~~~

git diff --stat origin/main...REF:
~~~text
 PROJECT_RECOVERY.md                                |  58 +++-
 docs/research/institutional-evidence/README.md     | 118 +++++++
 .../norway/CLAIM_REGISTER.md                       |  65 ++++
 .../norway/CL_ECI_MAPPING.md                       | 119 +++++++
 .../norway/INTEGRATION_PLAN.md                     | 237 ++++++++++++++
 .../NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md       | 344 +++++++++++++++++++++
 .../norway/NOR_FLEX_REFERENCE_CASE_SPEC.md         | 238 ++++++++++++++
 .../norway/NOR_GO_REFERENCE_CASE_SPEC.md           | 230 ++++++++++++++
 .../institutional-evidence/norway/README.md        |  80 +++++
 .../norway/SOURCE_REGISTER.md                      | 173 +++++++++++
 10 files changed, 1652 insertions(+), 10 deletions(-)
~~~

Equal tip blobs/presence: docs/research/institutional-evidence/README.md; docs/research/institutional-evidence/norway/CLAIM_REGISTER.md; docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md; docs/research/institutional-evidence/norway/INTEGRATION_PLAN.md; docs/research/institutional-evidence/norway/NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md; docs/research/institutional-evidence/norway/NOR_FLEX_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/NOR_GO_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/README.md; docs/research/institutional-evidence/norway/SOURCE_REGISTER.md


Absent on main: (none)


Different tip blobs/presence: PROJECT_RECOVERY.md


Main-since-base overlap: PROJECT_RECOVERY.md; docs/research/institutional-evidence/README.md; docs/research/institutional-evidence/norway/CLAIM_REGISTER.md; docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md; docs/research/institutional-evidence/norway/INTEGRATION_PLAN.md; docs/research/institutional-evidence/norway/NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md; docs/research/institutional-evidence/norway/NOR_FLEX_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/NOR_GO_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/README.md; docs/research/institutional-evidence/norway/SOURCE_REGISTER.md


### origin/research/norway-institutional-evidence-v2

Tip d708abb1e0d0710a1165cc731349d757613df6ef; merge base 615da6a996d59498f737da0f81f4b04f11779949.

git cherry origin/main REF:
~~~text
+ c81672fd1bf0ed38da732ce9c832b7575c804034
+ 63dfb4563e4cb668092fe71d903ec02942eba53c
+ d693133ae34bc08084f3c447f091f718e26d8b4d
+ 6f5c38d2a3289ff9047781837bae19ee087c0b73
+ 3d5ba8f3dc9641b48477f0dba4c60c8c5f1ac6d7
+ e9c505cd5f240a4865c4e394fda6c65fc65594d5
+ 5e35ea7f92b2e87627eed6870d2a3d05313faae5
+ 200a886fffca5ee7d96297c7f1b5040920781e3c
+ 0e634528d71b3eb7e39d7f1e57822f631daace69
+ d708abb1e0d0710a1165cc731349d757613df6ef
~~~

git diff --stat origin/main...REF:
~~~text
 PROJECT_RECOVERY.md                                |  51 ++-
 docs/research/institutional-evidence/README.md     | 118 +++++++
 .../norway/CLAIM_REGISTER.md                       |  65 ++++
 .../norway/CL_ECI_MAPPING.md                       | 119 +++++++
 .../norway/INTEGRATION_PLAN.md                     | 237 ++++++++++++++
 .../NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md       | 344 +++++++++++++++++++++
 .../norway/NOR_FLEX_REFERENCE_CASE_SPEC.md         | 238 ++++++++++++++
 .../norway/NOR_GO_REFERENCE_CASE_SPEC.md           | 230 ++++++++++++++
 .../institutional-evidence/norway/README.md        |  80 +++++
 .../norway/SOURCE_REGISTER.md                      | 173 +++++++++++
 10 files changed, 1645 insertions(+), 10 deletions(-)
~~~

Equal tip blobs/presence: docs/research/institutional-evidence/README.md; docs/research/institutional-evidence/norway/CLAIM_REGISTER.md; docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md; docs/research/institutional-evidence/norway/INTEGRATION_PLAN.md; docs/research/institutional-evidence/norway/NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md; docs/research/institutional-evidence/norway/NOR_FLEX_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/NOR_GO_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/README.md; docs/research/institutional-evidence/norway/SOURCE_REGISTER.md


Absent on main: (none)


Different tip blobs/presence: PROJECT_RECOVERY.md


Main-since-base overlap: PROJECT_RECOVERY.md; docs/research/institutional-evidence/README.md; docs/research/institutional-evidence/norway/CLAIM_REGISTER.md; docs/research/institutional-evidence/norway/CL_ECI_MAPPING.md; docs/research/institutional-evidence/norway/INTEGRATION_PLAN.md; docs/research/institutional-evidence/norway/NORWAY_INSTITUTIONAL_EVIDENCE_DOSSIER.md; docs/research/institutional-evidence/norway/NOR_FLEX_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/NOR_GO_REFERENCE_CASE_SPEC.md; docs/research/institutional-evidence/norway/README.md; docs/research/institutional-evidence/norway/SOURCE_REGISTER.md


### origin/serious-global-ai-finance-rc4

Tip d672569e7701bc4fcb2dbc65a69a3665f896bd2a; merge base d672569e7701bc4fcb2dbc65a69a3665f896bd2a.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/submission-capsule-global-ai-finance-2026

Tip 9b9fb63b1dd0637082d818debbb1cc9d3fafb232; merge base 9b9fb63b1dd0637082d818debbb1cc9d3fafb232.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/submission/innoserve-2026-rc1

Tip 5a462bcbd8d085e8dfd977e2de6afe953673113e; merge base 5a462bcbd8d085e8dfd977e2de6afe953673113e.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### origin/thesis/cleanup-canonical-pdf

Tip 9c0467c0b9dc617e786c9c8aefbebb1a60d88ded; merge base ebffa007c178df07a37dd78b244ff9a807aca1fb.

git cherry origin/main REF:
~~~text
+ ab62cea8ace2f92d307cfd35ec208a9608180c16
+ 9c0467c0b9dc617e786c9c8aefbebb1a60d88ded
~~~

git diff --stat origin/main...REF:
~~~text
 .gitignore                                         |    1 +
 CURRENT_STATUS.md                                  |    2 +-
 ...CAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md |  184 ++++
 energy_constraint_thesis_final_submission.pdf      |  Bin 0 -> 1537472 bytes
 thesis_package/CHAPTER_1_GROUNDED_DRAFT.md         |  135 ---
 thesis_package/CHAPTER_2_GROUNDED_DRAFT.md         |  226 ----
 thesis_package/CHAPTER_3_GROUNDED_DRAFT.md         |  174 ---
 thesis_package/CHAPTER_4_GROUNDED_DRAFT.md         |  151 ---
 thesis_package/CHAPTER_5_GROUNDED_DRAFT.md         |  153 ---
 thesis_package/CHAPTER_6_GROUNDED_DRAFT.md         |  138 ---
 thesis_package/SUBMIT_TO_ADVISOR.md                |   57 +-
 thesis_package/THESIS_BUILD.md                     |   15 +-
 thesis_package/THESIS_NUMBERS_MANIFEST.md          |   13 +-
 thesis_package/THESIS_SOURCE_OF_TRUTH.md           |  101 +-
 .../Energy_As_Money_Polished_Thesis_Spine.docx     |  Bin
 .../Energy_As_Money_Polished_Thesis_Spine.pdf      |  Bin 0 -> 198841 bytes
 .../_archive/superseded_2026-07/README.md          |   38 +
 .../THESIS_GROUNDED_MANUSCRIPT.md                  |    0
 ...ergy_constraint_thesis_final_submission_v10.pdf |  Bin
 ..._constraint_thesis_final_submission_v2 (1).docx |  Bin
 ...nergy_constraint_thesis_final_submission_v2.pdf |  Bin 0 -> 466483 bytes
 ...ergy_constraint_thesis_final_submission_v3.docx |  Bin
 ...energy_constraint_thesis_final_submission_v3.md |    0
 ...nergy_constraint_thesis_final_submission_v3.pdf |  Bin 0 -> 1284875 bytes
 ..._thesis_v8_audited_final_submission_preview.pdf |  Bin 0 -> 1249318 bytes
 .../_archive/superseded_2026-07/thesis-draft.md    |    0
 thesis_package/audit_thesis_output.py              |   13 +-
 thesis_package/build_grounded_thesis.py            |   12 +
 thesis_package/output/THESIS_GROUNDED.docx         |  Bin 729385 -> 0 bytes
 thesis_package/output/_chapter_1.md                |  177 ---
 thesis_package/output/_chapter_2.md                |  240 -----
 thesis_package/output/_chapter_3.md                |  311 ------
 thesis_package/output/_chapter_4.md                |  249 -----
 thesis_package/output/_chapter_5.md                |  254 -----
 thesis_package/output/_chapter_6.md                |  202 ----
 thesis_package/output/chapters/CHAPTER_1.docx      |  Bin 112332 -> 0 bytes
 thesis_package/output/chapters/CHAPTER_2.docx      |  Bin 102299 -> 0 bytes
 thesis_package/output/chapters/CHAPTER_3.docx      |  Bin 320934 -> 0 bytes
 thesis_package/output/chapters/CHAPTER_4.docx      |  Bin 204940 -> 0 bytes
 thesis_package/output/chapters/CHAPTER_5.docx      |  Bin 146205 -> 0 bytes
 thesis_package/output/chapters/CHAPTER_6.docx      |  Bin 82825 -> 0 bytes
 thesis_package/output/reading/BUILD.txt            |    3 -
 thesis_package/output/reading/README.md            |   40 -
 .../reading/chapters/Chapter_01_Introduction.docx  |  Bin 112332 -> 0 bytes
 .../reading/chapters/Chapter_01_Introduction.md    |  177 ---
 .../chapters/Chapter_02_Literature_Review.docx     |  Bin 102299 -> 0 bytes
 .../chapters/Chapter_02_Literature_Review.md       |  240 -----
 .../Chapter_03_Bitcoin_Energy_Empirics.docx        |  Bin 320934 -> 0 bytes
 .../chapters/Chapter_03_Bitcoin_Energy_Empirics.md |  311 ------
 .../Chapter_04_Renewable_Energy_Pricing.docx       |  Bin 204940 -> 0 bytes
 .../Chapter_04_Renewable_Energy_Pricing.md         |  249 -----
 .../Chapter_05_Constraints_and_Implementation.docx |  Bin 146205 -> 0 bytes
 .../Chapter_05_Constraints_and_Implementation.md   |  254 -----
 .../reading/chapters/Chapter_06_Conclusion.docx    |  Bin 82825 -> 0 bytes
 .../reading/chapters/Chapter_06_Conclusion.md      |  202 ----
 .../output/reading/full/THESIS_GROUNDED.docx       |  Bin 729385 -> 0 bytes
 .../output/reading/full/THESIS_GROUNDED.md         | 1140 --------------------
 thesis_package/verify_thesis_numbers.py            |   15 +
 58 files changed, 369 insertions(+), 5108 deletions(-)
~~~

Equal tip blobs/presence: (none)


Absent on main: IE-JDE/Invisible_Economy/FISCAL_CHOKEPOINTS_ASEAN_DIGITAL_TAX_PAPER_2026.md; energy_constraint_thesis_final_submission.pdf; thesis_package/_archive/superseded_2026-07/Energy_As_Money_Polished_Thesis_Spine.docx; thesis_package/_archive/superseded_2026-07/Energy_As_Money_Polished_Thesis_Spine.pdf; thesis_package/_archive/superseded_2026-07/README.md; thesis_package/_archive/superseded_2026-07/THESIS_GROUNDED_MANUSCRIPT.md; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v10.pdf; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v2 (1).docx; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v2.pdf; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v3.docx; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v3.md; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_final_submission_v3.pdf; thesis_package/_archive/superseded_2026-07/energy_constraint_thesis_v8_audited_final_submission_preview.pdf; thesis_package/_archive/superseded_2026-07/thesis-draft.md


Different tip blobs/presence: .gitignore; CURRENT_STATUS.md; thesis_package/CHAPTER_1_GROUNDED_DRAFT.md; thesis_package/CHAPTER_2_GROUNDED_DRAFT.md; thesis_package/CHAPTER_3_GROUNDED_DRAFT.md; thesis_package/CHAPTER_4_GROUNDED_DRAFT.md; thesis_package/CHAPTER_5_GROUNDED_DRAFT.md; thesis_package/CHAPTER_6_GROUNDED_DRAFT.md; thesis_package/SUBMIT_TO_ADVISOR.md; thesis_package/THESIS_BUILD.md; thesis_package/THESIS_NUMBERS_MANIFEST.md; thesis_package/THESIS_SOURCE_OF_TRUTH.md; thesis_package/audit_thesis_output.py; thesis_package/build_grounded_thesis.py; thesis_package/output/THESIS_GROUNDED.docx; thesis_package/output/_chapter_1.md; thesis_package/output/_chapter_2.md; thesis_package/output/_chapter_3.md; thesis_package/output/_chapter_4.md; thesis_package/output/_chapter_5.md; thesis_package/output/_chapter_6.md; thesis_package/output/chapters/CHAPTER_1.docx; thesis_package/output/chapters/CHAPTER_2.docx; thesis_package/output/chapters/CHAPTER_3.docx; thesis_package/output/chapters/CHAPTER_4.docx; thesis_package/output/chapters/CHAPTER_5.docx; thesis_package/output/chapters/CHAPTER_6.docx; thesis_package/output/reading/BUILD.txt; thesis_package/output/reading/README.md; thesis_package/output/reading/chapters/Chapter_01_Introduction.docx; thesis_package/output/reading/chapters/Chapter_01_Introduction.md; thesis_package/output/reading/chapters/Chapter_02_Literature_Review.docx; thesis_package/output/reading/chapters/Chapter_02_Literature_Review.md; thesis_package/output/reading/chapters/Chapter_03_Bitcoin_Energy_Empirics.docx; thesis_package/output/reading/chapters/Chapter_03_Bitcoin_Energy_Empirics.md; thesis_package/output/reading/chapters/Chapter_04_Renewable_Energy_Pricing.docx; thesis_package/output/reading/chapters/Chapter_04_Renewable_Energy_Pricing.md; thesis_package/output/reading/chapters/Chapter_05_Constraints_and_Implementation.docx; thesis_package/output/reading/chapters/Chapter_05_Constraints_and_Implementation.md; thesis_package/output/reading/chapters/Chapter_06_Conclusion.docx; thesis_package/output/reading/chapters/Chapter_06_Conclusion.md; thesis_package/output/reading/full/THESIS_GROUNDED.docx; thesis_package/output/reading/full/THESIS_GROUNDED.md; thesis_package/verify_thesis_numbers.py


Main-since-base overlap: .gitignore; CURRENT_STATUS.md; thesis_package/THESIS_BUILD.md


### origin/tmp/noop

Tip aaa2b15460e422be075bddd8153cf4e800994960; merge base 02b1bd237c38a66de10ac3503bbd22be6e3fff84.

git cherry origin/main REF:
~~~text
+ fd65c022060f64d5ce6fe8062b7019178027b7d2
+ dc5b9433c3dda7675c753ea7962fbdab24494f8e
+ 968b2764993b058027bbdfb70ae650036fc26eb9
+ 84c1ef3af322f4962b1b8a09b17b2f3d84cf5c01
+ 6556a958a06ee21c8dc5bcbdf1828b3b14a01139
+ 6eb20695af20a1e8c2d353857a9bec7b68176977
+ 5d9fef2b134ee89d2d04e48f65a41fba7c65b6d7
+ 4185ae7655f234c113a9d2e97d56c58d7de5e21c
+ aac1f21b5e6698709b06f4c97020fa1a852a850d
+ 3c14295cd6a8084e7e87d634dcc5dfe520f4db7d
+ 368478e19768e3bfe98256e16a8d573eff0d6d6c
+ 295dcfa985089778f94da3de564a9ebabeb7c9c4
+ c9bff78ef76e4926b4a443cda8522a4326638a9a
+ 9b8004f1f9b24067c39042d55d583ff6bbc154d3
+ 74f0df9d9db0324b5fb2a1404ffb36e701836c71
+ aaa2b15460e422be075bddd8153cf4e800994960
~~~

git diff --stat origin/main...REF:
~~~text
 frontend/src/App.jsx                               |  199 +--
 frontend/src/app/routes.js                         |   37 +-
 frontend/src/app/routes.test.js                    |   41 +-
 frontend/src/components/LabOverview.jsx            |  585 ++++----
 frontend/src/components/LabOverview.test.jsx       |  159 +--
 frontend/src/components/platform/AnalysisLab.jsx   |  154 +++
 .../src/components/platform/FieldUseSurface.jsx    |  267 ++++
 .../components/platform/InvestigationSurface.jsx   |  216 +++
 .../src/components/platform/PlatformSurface.jsx    |   78 ++
 .../src/components/platform/ProgrammeSurface.jsx   |  231 ++++
 .../src/components/platform/ResearchSurface.jsx    |  189 +++
 .../src/components/platform/VerificationHub.jsx    |  272 ++++
 frontend/src/styles/pairedPlatform.css             |  388 ++++++
 frontend/src/styles/platformSurfaces.css           | 1421 ++++++++++++++++++++
 14 files changed, 3741 insertions(+), 496 deletions(-)
~~~

Equal tip blobs/presence: frontend/src/components/LabOverview.test.jsx; frontend/src/components/platform/PlatformSurface.jsx


Absent on main: (none)


Different tip blobs/presence: frontend/src/App.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/components/LabOverview.jsx; frontend/src/components/platform/AnalysisLab.jsx; frontend/src/components/platform/FieldUseSurface.jsx; frontend/src/components/platform/InvestigationSurface.jsx; frontend/src/components/platform/ProgrammeSurface.jsx; frontend/src/components/platform/ResearchSurface.jsx; frontend/src/components/platform/VerificationHub.jsx; frontend/src/styles/pairedPlatform.css; frontend/src/styles/platformSurfaces.css


Main-since-base overlap: frontend/src/App.jsx; frontend/src/app/routes.js; frontend/src/app/routes.test.js; frontend/src/components/LabOverview.jsx; frontend/src/components/LabOverview.test.jsx; frontend/src/components/platform/AnalysisLab.jsx; frontend/src/components/platform/FieldUseSurface.jsx; frontend/src/components/platform/InvestigationSurface.jsx; frontend/src/components/platform/PlatformSurface.jsx; frontend/src/components/platform/ProgrammeSurface.jsx; frontend/src/components/platform/ResearchSurface.jsx; frontend/src/components/platform/VerificationHub.jsx; frontend/src/styles/pairedPlatform.css; frontend/src/styles/platformSurfaces.css


### origin/ui/visual-assessment-2026-10-06

Tip c8ba12073cc3fb8416dc6f30f8866c4d025bb32b; merge base c8ba12073cc3fb8416dc6f30f8866c4d025bb32b.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### chore/policy-lab-consolidation

Tip e75d5f350d74d02461596b4b6568946aa0f55388; merge base 6a9e2403ce3d0a799ee9505959fc4860b43f2ea2.

git cherry origin/main REF:
~~~text
+ e75d5f350d74d02461596b4b6568946aa0f55388
~~~

git diff --stat origin/main...REF:
~~~text
 .../POLICY_LAB_CONSOLIDATION_HANDOFF_2026-10-09.md | 69 ++++++++++++++++++++++
 1 file changed, 69 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: docs/ops/POLICY_LAB_CONSOLIDATION_HANDOFF_2026-10-09.md


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### ci/add-claude-github-app

Tip 9d781825d4566294ce9dbe2ba973cfe3c23ba87c; merge base e87e4d38ac64f4d1e8bbd9ea2fc8b5d449dee7b1.

git cherry origin/main REF:
~~~text
+ 9d781825d4566294ce9dbe2ba973cfe3c23ba87c
~~~

git diff --stat origin/main...REF:
~~~text
 .github/workflows/claude.yml | 39 +++++++++++++++++++++++++++++++++++++++
 1 file changed, 39 insertions(+)
~~~

Equal tip blobs/presence: (none)


Absent on main: .github/workflows/claude.yml


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### field-ready-alpha

Tip c32a4840eac19b9b5775cc7c08b9cab8dc4827bb; merge base c32a4840eac19b9b5775cc7c08b9cab8dc4827bb.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### fix/repository-audit-2026-10-05

Tip 998b9f3d8f71bd01a1fc4a753c454d9509159fba; merge base 998b9f3d8f71bd01a1fc4a753c454d9509159fba.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### grok/0920-023651-87f8

Tip adf14372994224c13853d002f7e749a9196f26dd; merge base adf14372994224c13853d002f7e749a9196f26dd.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


### thesis/ceir-boundary-rewrite

Tip d9e5b243b4e32364535750988daf0f291590f435; merge base d9e5b243b4e32364535750988daf0f291590f435.

git cherry origin/main REF:
~~~text
(empty)
~~~

git diff --stat origin/main...REF:
~~~text
(empty)
~~~

Equal tip blobs/presence: (none)


Absent on main: (none)


Different tip blobs/presence: (none)


Main-since-base overlap: (none)


## Observed PR descriptions (historical reports)

### #64 Certify current Policy Lab surface

API head 41efe6a71d13d4460b758cc8daaec34986f5019e; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Purpose

Make Policy Lab's current submission proof revision-bound and restore the live production certifier without reopening core product development.

## Changes

- isolate the scheduled/live-deploy smoke test from the historical root dependency surface;
- install an exact Playwright version in a temporary smoke-only runtime so the workflow no longer assumes a root `package-lock.json` that the repository intentionally ignores;
- exercise live-smoke workflow/script changes on pull requests;
- checkout the triggering/tested revision instead of hard-coding `main`, so PR certification actually tests the proposed change;
- bind live selector assertions to canonical option identities (`TYN-001`, `PROVENANCE-L0-BASE`, `LAB-CASE-OPEN-004`) instead of ambiguous wrapping-label text;
- run the external Ausgrid checkpoint on relevant pushes to `main`, in addition to PRs and the dedicated external-case branch.

## Why

The current scheduled live smoke was failing during dependency setup because npm caching expected a root lockfile. Once that was repaired, the certifier exposed two further defects: it had been hard-coded to checkout `main` during PR runs, and its `Case` label locator was ambiguous because the UI label wraps selector content. These were certifier defects, not Policy Lab product failures.

`CURRENT_SURFACE.json` also points to a successful external-case run from an older, diverged revision. Adding `main` to the external-case push trigger ensures future relevant merged changes obtain a fresh outside-data proof tied to the actual released source revision.

## Fresh proof on this PR

Final tested head: `41efe6a71d13d4460b758cc8daaec34986f5019e`.

- **External Case 001P — PASS** on run #47. The exact revision downloaded and hash-checked the pinned Ausgrid archive, executed the bounded L0 case, built and independently verified the four-boundary assessment, built and verified the P0.1 claim-assessment package, rebuilt package/report byte-identically, and uploaded the evidence bundle.
- **Policy Lab Live Smoke — PASS** on run #39. The deployed site reported `Policy Lab | Case Workbench`; the outside checkpoint was visible and remained separated from the controlled pack; the interactive decision rendered `ADMIT WITH LIMIT`; 4 interactive cases, 3 policies, and 4 assurance scenarios were exercised.
- **Current Surface Integrity — PASS** and **Secrets Scan — PASS** on the final head at the time of this update.

## Boundaries

This PR does **not** alter the Ausgrid evidence, assurance level, policy rules, 33.066 kWh result, settlement scenario, research boundaries, UI product logic, or judge-facing scientific claims. It repairs certification plumbing only.

## Merge consequence

After merge, relevant Policy Lab evidence/core changes on `main` will trigger a fresh external-case checkpoint, and scheduled/deploy-triggered live smoke will use the same isolated certifier that now passes against production.

</details>

### #65 Add Policy Lab specialized Gauntlet

API head ea21f25c18a7348116f74f50f03bb6dbd11ed6e5; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Purpose

Turn Policy Lab's strongest judge objections into an executable, non-inflationary Gauntlet instead of adding another product subsystem.

## Adds

- `PLG-01`–`PLG-14` specialized Policy Lab challenge manifest;
- machine-readable policy-assumption register that labels score-material thresholds/haircuts/stress inputs as research assumptions rather than empirical calibration;
- honest C3/C4 readiness map that preserves lifecycle, independent reproduction, release-attestation, and external-validation gaps where they are not yet proven;
- source-backed differentiation against OPA, Cedar, W3C Verifiable Credentials, Chainlink Proof of Reserve, and ACTUS;
- executable Gauntlet runner covering stale-hash assurance promotion, policy identity, quantity inflation, settlement separation, assurance counterfactual isolation, and L2 multiplier sensitivity;
- frozen external closure protocols for independent reproduction, source heterogeneity, blind comprehension, and practical workflow evidence;
- deterministic source-closure provenance builder;
- timezone/locale and truncated-output retry attacks;
- judge-facing specialized Gauntlet brief and submission-index integration;
- dedicated specialized CI plus a **main-only** release-attestation workflow using `actions/attest@v4` after merge.

## Final tested branch head

`ea21f25c18a7348116f74f50f03bb6dbd11ed6e5`

The successful specialized PR run tested the corresponding GitHub pull-request merge revision `ca6fdb35d33952bb724d855525d8074cb64b7ac1`.

## Specialized Gauntlet result

**PASS_WITH_OPEN_EXTERNAL_GATES** — run #15 / `34395711274`.

All six machine-required challenges pass:

- `PLG-01` evidence capability non-promotion — PASS
- `PLG-02` policy identity integrity — PASS
- `PLG-03` quantity inflation resistance — PASS
- `PLG-04` settlement separation — PASS
- `PLG-05` counterfactual isolation — PASS
- `PLG-06` policy sensitivity disclosure — PASS

### Causal matrix

Same evidence hash: `660a638c74e8f78ab7a9ed0e8f22203acdc99ad887c5b659c7b39383d305486c`

| Assurance | Open policy | Pilot policy |
|---|---|---|
| actual L0 | `ADMIT_WITH_LIMIT` 180 | `BLOCKED` (`MIN_PROVENANCE`) |
| declared L2 counterfactual | `ADMIT_WITH_LIMIT` 180 | `ADMIT_WITH_LIMIT` 126 |

The L2 row remains an assurance counterfactual with `observed_evidence_changed=false`; it is not new observed evidence.

### Policy sensitivity

Changing only the ephemeral L2 provenance multiplier produces:

- `0.5` → `90`
- `0.7` → `126`
- `0.9` → `162`

`PROVENANCE_POLICY_CAPACITY` remains the binding rule. These are explicit research-policy assumptions, not empirical calibration.

The assumption register contains **14** current values and matched the executable policy/checkpoint objects: PASS.

## Additional proof on the same final head

- UTC vs Asia/Taipei specialized outputs reproduce byte-identically — PASS.
- Deliberately truncated specialized output is replaced by the same deterministic clean rebuild — PASS, scoped to this report builder only.
- External-gate protocol checker — PASS; `PLG-09`, `PLG-11`, `PLG-12`, and `PLG-14` all have frozen closure criteria and remain `OPEN_EXTERNAL`.
- Release source closure — PASS: **86 files** hashed and revision-bound, reproduced byte-identically; provenance ID `074e70399206981923c05e4c0d9434e84cbab32ca68657dccca0100a87c781c3` on the successful PR merge revision.
- Legacy FC non-promotion invariants — 2/2 PASS.
- C0-C2 benchmark contract tests — 4/4 PASS inside the specialized workflow.
- Full Conformance Benchmark v1 — PASS on Ubuntu/Node 22 and macOS/Node 22 (run #56).
- Generic Gauntlet Simulation v1.1 — PASS (run #49); the specialized layer does not replace or reweight the generic simulator.
- Policy Lab Submission Assets — PASS (run #48).
- Tests & Coverage — PASS (run #538).
- Solidity tests — PASS (run #539).
- Solidity/Slither security — PASS (run #539).
- Secrets Scan — PASS (run #537).

## C3 / C4 posture

Do **not** call Policy Lab C3- or C4-certified.

- **C3: PARTIAL** — settlement/quantity behavior exists, but duplicate use, overlapping-window anti-reuse, correction lineage, cancellation/reuse semantics, and policy-change redecision still need dedicated lifecycle proof.
- **C4: PARTIAL** — tamper/private-boundary/current-surface/environment/source-closure proof is stronger now, but independent clean-room reproduction and remaining release attestations are still open, and C4 inherits unresolved C3 lifecycle work.

## External gates deliberately left open

- `PLG-09` independent clean-room reproduction
- `PLG-11` materially different attributable external source
- `PLG-12` blind evaluator comprehension
- `PLG-14` real external workflow/practical validation

Internal CI, AI review, traffic/stars, controlled fixtures, or a favorable competition reaction cannot close these gates.

## Release attestation posture

A **main-only** workflow now packages the frozen release proof and is configured to use `actions/attest@v4` with GitHub OIDC/attestation permissions. Because this PR is intentionally not allowed to exercise that trusted write path, `github_artifact_attestation`, `SBOM`, and `signed_release_tag` remain `OPEN_RELEASE` until the selected revision lands on `main` and the release flow actually executes. Merely adding the workflow does not count as an attestation.

## Boundaries

This PR does **not** change Policy Lab's registered policies, evidence, runtime product logic, public Ausgrid result, assurance state, or scientific claims. Sensitivity forks are ephemeral evaluator objects only. Controlled `TYN-001` remains a non-empirical mechanism case.

The specialized Gauntlet is meant to make the submission's strongest epistemic claims falsifiable, not to manufacture a higher score.

</details>

### #66 Make Policy Lab an interactive research explorer and workbench

API head f1793b2d7cb7a47c771e2483d703d74b05227bbb; base feat/policy-lab-specialized-gauntlet at ea21f25c18a7348116f74f50f03bb6dbd11ed6e5.

<details><summary>Description</summary>

## Purpose

Replace the geography-first Atlas with an **interactive research explorer** that exposes how Policy Lab research objects relate across evidence, assurance, policy, interpretation, and unresolved research frontiers, while preserving the practical research workbench as the deeper interrogation/reproduction layer.

This remains a **stacked frontend/research-interface tranche on PR #65** (`feat/policy-lab-specialized-gauntlet`). It does not change constraint-core semantics, policy manifests, evidence payloads, assurance logic, or frozen checkpoint results.

## Research Explorer

The default `#lab` route now opens on the research relationship itself rather than a world map or engine dashboard.

Primary landscape:

1. **Evidence objects** — controlled cases, outside-data checkpoints, institutional references, and open external-evidence gates.
2. **Assurance** — declared provenance/assurance state as an independent research dimension.
3. **Policy** — explicit rule-set selection while evidence remains fixed.
4. **Interpretation** — the resulting blocked/admitted/bounded research state.
5. **Research frontier** — executable, reproduced, comparative, open, and untested layers shown together.

The interaction model is Cambridge-like without requiring literal geography: select a research object, change a relevant dimension, see the interpretation update, inspect the evidence/boundary context, and descend into the deeper Workbench without losing active state.

Additional projections remain available:

- **Findings** — supported, comparative, and open research propositions;
- **Evidence** — what evidence layers exist, what they are useful for, and their boundaries;
- **Timeline** — selected evidence-bearing research milestones rather than a marketing roadmap.

## Research Workbench

The Explorer descends into the existing practical workbench without losing shared state.

### Workspace browser
- controlled cases;
- policy manifests;
- assurance scenarios;
- outside/public evidence checkpoints.

### Research documents
- **Analysis** — research question, active case/policy/assurance parameters, settlement stress, inputs, method chain, deterministic result;
- **Runs** — comparable cross-case runs under the active policy/scenario;
- **Methods** — actual admission rules, quantity ceilings, calculator IDs, and declared parameters;
- **Data** — evidence identity, measurement window, context, interpretation boundaries, and the Ausgrid checkpoint.

### Inspector / output
- Run / Provenance / Boundary inspector;
- active decision and evidence identities;
- Compare, Verify lineage, Investigate, and Full Analysis actions.

The interface does **not** invent a fake notebook kernel, terminal, synthetic collaboration state, or fake research history. Visible research objects and actions map to committed objects, runtime state, or existing evidence-bearing research material.

## Research boundary

The Explorer deliberately preserves epistemic distinctions:

- controlled fixture evidence ≠ operator evidence;
- public Ausgrid L0 evidence ≠ source-holder or physical-meter certification;
- Norway institutional evidence ≠ validation of Policy Lab at national scale;
- mechanism evidence ≠ legal authority ≠ monetary performance;
- open owner/operator evidence remains explicitly OPEN rather than being visually promoted.

## Verification

The functional Explorer revision `dbca98608b3708e9102b109546a944b9f8f11959` passed:

- Current Surface Integrity — **PASS** (`34625562662`)
- Case Workbench V2 CI — **PASS** (`34625562539`): deterministic core, SDK package check, frontend tests, production build, bundle-boundary check, and desktop/mobile Chromium captures spanning Explorer → Workbench → case/compare/receipt/study flows
- Constraint Protocol Alpha CI — **PASS** (`34625562669`): protocol/core/contracts/frontend/build/browser proof all green
- visual artifact — `10273627918`, sha256 `5a94b2c430f1ae556d2be7d72f36550b6e0f4236e7b55a5822ddd8d13c3dbf40`

Subsequent head-only test-contract commits do not alter the rendered Explorer behavior; their CI is allowed to complete before any merge decision.

## Remaining boundary

This is now a credible **interactive research publication + research explorer + workbench**, not a complete scholarly platform. The next useful additions should expand real research objects, source/finding links, and richer evidence relationships rather than add generic dashboard features.

</details>

### #67 Crystallize Fiscal Choke Points publication candidate

API head 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Crystallized publication candidate

**Canonical manuscript:** `IE-JDE/Digital_Tax_Design/rebuilt_2026/FISCAL_CHOKEPOINTS_PUBLICATION_CANDIDATE_2026.md`

**Frozen exact head:** `6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd`  
**Publication/package CI:** run `34842498334` — **SUCCESS**

This PR replaces the inherited Digital Tax rate-regression/DiD project with a source-controlled comparative tax-administration paper.

### Current contribution

The manuscript explicitly concedes prior art on firms as fiscal intermediaries, VAT information trails, platform VAT/GST liability, platform function/capability criteria, payment/taxing-point design, concentrated/choke-point taxation, regulatory intermediation, and ASEAN digital-tax comparison.

Its narrower contribution is:

1. seven transaction paths across five jurisdictions rather than one label per country;
2. source-controlled coding of taxable object, liable node, nexus evidence, transaction rail and reconciliation power;
3. `node locus` and `event coupling` as separate cross-instrument coding dimensions;
4. within-regime countercases testing when intermediary presence is insufficient to activate fiscal responsibility;
5. Stage-A legal architecture separated from Stage-B filing/correction/refund/audit/appeal/enforcement evidence;
6. explicit architecture/performance non-equivalence.

### Publication package

The branch contains the canonical manuscript plus source/claim registers, seven-path coding, chronology, node-selection and boundary-case layers, reconciliation and operational-capacity matrices, deterministic derivation, manuscript-to-source map, novelty audit, hostile publication audit, IL overlap control, figures/tables contract, submission materials, publication-readiness contract, venue route, truthful AI-assistance disclosure, and five executable package/publication gates.

### Primary route

**eJournal of Tax Research (UNSW)** is the current primary route. The route file contains its <=100-word abstract, positioning, citation-style strategy, and current submission checklist.

**Journal of Tax Administration is explicitly excluded under its current policy** because its present author declaration requires confirmation that AI was not used in manuscript preparation/editing; that declaration would be false for this manuscript.

### Remaining external/process gates

- independent primary-source/path recode of a sample of core classifications;
- final legal-currentness sweep immediately before submission;
- current venue-specific legal citation/reference/formatting pass;
- final related-work/overlap review against Invisible Ledger;
- human copyedit and citation audit.

No further conceptual expansion is required unless source verification, independent recoding, or peer review exposes a substantive defect.

This PR remains **draft** intentionally; the research object is crystallized, but no submission/peer-review/acceptance claim is made.

</details>

### #68 Build Invisible Ledger V2 research-control pack

API head 5993b815e54ad8eae0e2c0a3cccd222a416664c5; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Purpose

Build the research-control and reproduction layer around the September 2026 Invisible Ledger V2 proposal **without replacing or freezing the live advisor-facing proposal while it is still being revised**.

The proposal remains the authority for research question, scope, issuer boundary, and inferential commitments. This branch gives the proposal a controlled empirical backend that can follow those decisions.

## Added

- V2 authority map and research identity
- hard claim/nonclaim boundaries
- evidence architecture across issuer, BPS, Bank Indonesia, and administrative layers
- result register for currently admitted, pending, demoted, and rejected findings
- issuer admission classes and transition-level sample gates
- staged institutional-visibility model from record existence through outcome evidence
- reproduction/table/figure contracts
- legacy migration/quarantine map for the old residual-centered `$185B` generation
- explicit IL ↔ Fiscal Choke Points consolidation boundary
- proposal-sync checklist so ongoing proposal edits propagate safely into the research pack
- structural validator + dedicated GitHub Actions workflow

## Deliberately unresolved

This PR does **not** decide on the author's/advisor's behalf:

- Blibli's travel-inclusive third-party segment boundary
- Bukalapak's broader geography treatment
- final common revenue basis
- exact Bank Indonesia measure/value freeze
- operational transmission/matching/use beyond the current legal reporting architecture

Those remain explicit research gates.

## Important nonclaims

The V2 pack rejects transaction-minus-revenue as hidden GDP, taxable income, or tax gap; rejects the old `$185B`, `$82.8B`, and `12.3x` generation as canonical findings; and does not use the old Malaysia LVG exercise as causal validation of Invisible Ledger.

## Review contract

This is a **support-infrastructure PR**, not a manuscript freeze and not a replacement proposal. It is safe to keep iterating the live IL proposal; after each substantive proposal change, `PROPOSAL_SYNC_CHECKLIST.md` specifies what must be reconciled downstream.

</details>

### #69 Crystallize Invisible Ledger publication candidate

API head 4196984a0d667c5d852429c46f6dc237b7dd4db9; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Crystallized publication candidate

**Canonical manuscript:** `IE-JDE/Invisible_Economy/rebuilt_2026/INVISIBLE_LEDGER_PUBLICATION_CANDIDATE_2026.md`

**Frozen exact head:** `4196984a0d667c5d852429c46f6dc237b7dd4db9`  
**Publication/support CI:** run `34842524949` — **SUCCESS**

The active September 2026 thesis proposal remains separately controlled. This PR crystallizes a narrower standalone article that does not require the unresolved Blibli/Bukalapak advisor gates.

### Frozen empirical core

- Tokopedia/GoTo e-commerce GTV FY2022→FY2023: `-8.90%`.
- Audited third-party net segment revenue: `+53.20%`.
- Customer-incentive reduction equals `60.56%` of the **arithmetic** net-revenue increase; no causal attribution.
- BPS total e-commerce transaction value 2023→2024: `+17.08%`.
- Marketplace: `+1.45%`; non-marketplace: `+20.57%`; non-marketplace accounts for `98.46%` of the nominal increase.
- BPS officially reports estimated e-commerce business-count growth of `+15.30%`; exact count levels and implied value/business remain excluded.
- BI-defined mobile+internet digital-payment volume: `34.4693bn` transactions in 2024, `+36.1%`; these are payment traces, not sales.
- PMK 37 legal architecture exists, but collection is postponed through 2026-10-31 with scheduled activation 2026-11-01; matching/use/outcomes remain unknown as of the frozen currentness date.

### Novelty boundary

The article does **not** claim originality for `GTV != platform revenue`, platform-fee/underlying-transaction distinctions, or the generic use of company/payment/statistical data as partial e-commerce measures. Those are prior art.

Its contribution is the source-auditable Indonesia empirical sequence:

`audited issuer mechanism → BPS national/channel anatomy → Bank Indonesia payment trace → institutional visibility`.

### Publication package

The branch contains the canonical manuscript plus source/exclusion registers, issuer ledgers, audited Tokopedia reconciliation, BPS and BI controlled ledgers, institutional-visibility matrix, result reproduction map, manuscript-to-source map, novelty audit, hostile publication audit, DT overlap control, figures/tables contract, submission materials, publication-readiness contract, SSRN supersession plan, venue route, truthful AI-assistance disclosure, and three executable publication/support gates.

### Primary route

**Electronic Commerce Research and Applications (Elsevier)** is the current primary route because its scope directly covers electronic commerce, digital economy, payment systems, marketplaces, public-policy/legal issues, and empirical/case-analysis work.

The route is compatible with truthful disclosure of AI-assisted manuscript preparation under Elsevier's current policy; the branch includes the disclosure template and human-verification responsibilities.

### Public preprint control

Before or alongside journal submission, the older SSRN Invisible Ledger working paper must be updated so its residual/ASEAN aggregate claims are visibly superseded. The branch includes a replacement title/abstract and major-revision notice.

### Remaining pre-submission gates

- revise/update the public SSRN record;
- refresh PMK 37 currentness immediately before submission and especially on/after 2026-11-01;
- independent source spot-check of Tokopedia, BPS, BI and PMK claims;
- apply current ECRA citation/reference/figure/AI-disclosure requirements;
- final text/table overlap check against Fiscal Choke Points;
- human copyedit and citation audit.

No further conceptual redesign is required unless source verification or peer review exposes a substantive defect.

This PR remains **draft** intentionally; the standalone article is internally crystallized but no submission/peer-review/acceptance claim is made.

</details>

### #70 Harden Policy Lab release integration

API head 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c; base feat/policy-lab-frontend-convergence at f1793b2d7cb7a47c771e2483d703d74b05227bbb.

<details><summary>Description</summary>

## Purpose

Release-integration tranche stacked on PR #66. This reconciles the Research Browser with certification/release machinery before any landing to `main`.

## Candidate topology

The actual candidate stack is:

`#65 specialized Gauntlet → #66 Research Browser / Workbench → #70 release integration`

PR #64 is retained only as superseded certification/history context and is not a required predecessor.

## What #70 now carries

- transition-aware live smoke for the currently deployed surface;
- strict Research Browser candidate smoke;
- substantive Browser path certification rather than selector/render-only checks;
- fresh Ausgrid public-source execution on relevant `main` pushes;
- Research Browser / Workbench release integration;
- production-only shipped frontend dependency audit;
- provenance closure over the complete frontend source/public surface plus the workflows/scripts that certify it;
- mandatory critical-path fail-closed provenance checks.

`PUB-AUSGRID-001P` remains explicitly separated from the controlled case pack.

## Final clean candidate checkpoint

Final branch head: `2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c`.

The final hardening sequence found and repaired three real release-machine defects rather than adding speculative features:

1. **Provenance under-binding** — the old source closure did not bind the Research Browser and its certifiers. The manifest now includes the full frontend source/public surface and release-certification workflows/scripts, with required paths/prefixes failing closed.
2. **Shipped dependency advisories** — `ethers 6.16.0 → ws 8.17.1` plus `lodash 4.17.23` were present in the production frontend graph. The lock now resolves `ethers 6.17.0`, `ws 8.21.0`, and `lodash 4.18.1`, and ordinary Workbench CI runs `npm audit --omit=dev --audit-level=high` before frontend tests/build.
3. **SDK certifier blind spot** — Workbench's `Check SDK package contents` step was accidentally packing the repository root. `2dd92d85…` changes that step to run inside `packages/constraint-core`.

The corrected Workbench log now shows:

- `@solarpunk/constraint-core@0.1.0-alpha.1`;
- 28 tarball files;
- 46.9 kB package / 205.1 kB unpacked;
- 92/92 deterministic core tests;
- shipped frontend production audit: `found 0 vulnerabilities`;
- 94/94 frontend tests;
- production build and bundle-boundary verification;
- strict Research Browser smoke;
- 32 flagship browser captures.

The zero-vulnerability statement is deliberately limited to the shipped frontend production graph. Unfiltered root/frontend installs still report dev/toolchain advisories.

## Clean stacked certification

On final head `2dd92d85…`, ordinary #70 certification is green, including:

- Current Surface Integrity — PASS;
- Policy Lab Live Smoke — PASS;
- Case Workbench V2 CI — run `34968657136` — PASS;
- Constraint Protocol Alpha CI — PASS.

The parallel do-not-merge #71 main-target rehearsal also reran the full matrix on this same head and passed every triggered workflow. Its exact synthetic main merge is `f34bb972c49e547a44a84ec93410d66dd88c48e1`; #71 contains the durable final run/artifact record.

## Strict Browser path

`F-01 finding → Ausgrid checkpoint → TYN-001 → Pilot/L0 = BLOCKED → Pilot/L2 = ADMIT WITH LIMIT / 126 → Workbench`

The final strict smoke identifies the Browser surface, keeps `PUB-AUSGRID-001P` visible but separated from the controlled pack, and reaches the expected interactive decision path.

## Nonchanges / remaining boundary

No constraint-core decision semantics, policy-manifest semantics, evidence-assurance semantics, settlement semantics, or scientific claims are promoted by this tranche.

This candidate still does **not** manufacture the external evidence gates:

- independent clean-room reproduction;
- attributable source-holder/operator evidence;
- blind evaluator comprehension;
- a real external institutional workflow;
- R4 monetary performance.

Trusted artifact attestation remains intentionally `main`-only and therefore has not been executed for this unmerged candidate.

## Promotion boundary

`#65 → #66 → #70 → explicit merge authorization → trusted integrated-main attestation / deployed strict smoke → freeze`

#71 remains proof-only and must not be merged. No merge, release, tag, deployment promotion, or external claim is authorized by this PR description.

</details>

### #71 Policy Lab full-stack release rehearsal (do not merge)

API head 2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

## Purpose

This is the final full-stack **release rehearsal** from the current Policy Lab integration branch into `main`. It exists to make GitHub evaluate the complete combined state before any real landing decision.

**DO NOT MERGE THIS PR.** It is intentionally draft and has no merge authorization.

## Candidate topology

The actual candidate stack is:

`#65 specialized Gauntlet → #66 Research Browser / Workbench → #70 release integration`

PR #64 is superseded certification context, not a required predecessor.

## Exact final rehearsal revision

Branch head: `2dd92d85d26f8afdf3df0b0f8df927b5cef9f37c`

GitHub main-target synthetic merge revision: `f34bb972c49e547a44a84ec93410d66dd88c48e1`

GitHub reports this draft PR as **mergeable**. The rehearsal changed no `main` state.

## Final release-hardening corrections

The final hardening pass closed three release-machine defects before freeze:

1. release provenance now binds the complete Research Browser/frontend source/public surface and the workflows/scripts that certify it, with mandatory critical paths failing closed;
2. shipped frontend production dependencies were raised to patched floors (`ethers 6.17.0`, transitive `ws 8.21.0`, `lodash 4.18.1`) and the permanent Workbench gate runs `npm audit --omit=dev --audit-level=high`;
3. the Workbench step labelled `Check SDK package contents` was discovered to be packing the repository root rather than the SDK. Commit `2dd92d85…` corrected it to run inside `packages/constraint-core`.

The corrected final Workbench log now certifies:

- package: `@solarpunk/constraint-core@0.1.0-alpha.1`;
- 28 tarball files;
- 46.9 kB package / 205.1 kB unpacked;
- 92/92 deterministic core tests;
- shipped frontend production audit: `found 0 vulnerabilities`;
- 94/94 frontend tests;
- production build and bundle-boundary verification;
- strict Research Browser smoke;
- 32 flagship browser captures.

Unfiltered root/frontend installs still report dev/toolchain advisories. The zero-vulnerability statement is intentionally scoped to the shipped frontend production graph (`npm audit --omit=dev`).

## Full main-target matrix — PASS

Every ordinary workflow triggered by the final combined candidate passed:

- Current Surface Integrity — run `34968657795` — PASS
- Secrets Scan — run `34968657689` — PASS
- Policy Lab Specialized Gauntlet — run `34968657656` — PASS
- Policy Lab Live Smoke — run `34968657700` — PASS
- External Case 001P / Ausgrid — run `34968657816` — PASS
- Tests & Coverage — run `34968657819` — PASS
- Gauntlet Simulation v1.1 — run `34968657863` — PASS
- Conformance Benchmark v1 — run `34968657679` — PASS
- Policy Lab Submission Assets — run `34968657813` — PASS
- Case Workbench V2 CI — run `34968657884` — PASS
- Constraint Protocol Alpha CI — run `34968657633` — PASS
- Solidity tests — run `34968657652` — PASS
- Solidity / Slither security — run `34968657625` — PASS

This proves the corrected complete candidate is compatible with the current `main` merge base and survives the repository's main-target release matrix.

## Fresh outside-data proof on the final rehearsal revision

The Ausgrid workflow downloaded and hash-checked the pinned 14,973,763-byte archive, executed the public case, rebuilt and verified the four-boundary assessment and P0.1 package, reproduced the human report and decisions closed-world, and uploaded the complete evidence bundle on synthetic merge `f34bb972…`.

Observed result:

- case: `PUB-AUSGRID-001P`
- actual assurance: `L0`
- intervals: `336`
- eligible derived surplus: `33.066 kWh`
- Open `LAB-CASE-OPEN-004`: `ADMIT_WITH_LIMIT`, maximum `33.066`, binding `EVIDENCE_BACKED_CAPACITY`
- Pilot `ENERGY-CASE-PILOT-005`: `BLOCKED`, blockers `SIGNED_EVIDENCE` + `MIN_PROVENANCE`
- 40% settlement stress: `PARTIAL`, `13.2264` covered / `19.8396` shortfall
- capsule integrity/schema/decision reproduction: PASS
- research boundaries: R1 `NOT_ASSESSED`, R2 `PARTIAL`, R3 `PARTIAL`, R4 `UNTESTED`
- R3 components: issuance `SUPPORTED`, pricing `OPEN`, settlement `PARTIAL`, governance `NOT_ASSESSED`
- source-holder review: `NOT_PERFORMED`
- source-truth certification: `NOT_CLAIMED`

Final identities:

- archive sha256: `6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11`
- evidence hash: `ac0bc483f3da8d90c4b9281b46abdbc81177a9338525039bd0e346be12a1d93b`
- Open decision: `913bde9848571e905873510ae2e11bd7b8ed4489d828e2605dca038dc3002a1a`
- Pilot decision: `96bc8edae69b3f27e6261ffcfb6f5a347b3b0a1a750abc81ec414e66b5a6e7d2`
- capsule: `a7d6d14a38730e82021e94101f81a35ade6cb9473f2440b3a12afcfe8d69ff39`
- constrained assessment: `088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`
- P0.1 assessment: `04a4f79431f2bf774ec2a3df69836461752998829ae76a89e946971c42d756a9`
- package content: `6eb07e1807bcfcfcd78455a39310f10d545524bd6d6e3de659959efe9cb59385`

## Research Browser / Workbench proof

The strict Browser path remains:

`F-01 finding → Ausgrid checkpoint → TYN-001 → Pilot/L0 = BLOCKED → Pilot/L2 = ADMIT WITH LIMIT / 126 → Workbench`

Final strict smoke reported `detectedSurface=browser`, `expectedSurface=browser`, visible/separated `PUB-AUSGRID-001P`, interactive decision `ADMIT WITH LIMIT`, 4 cases, 3 policies, and 4 assurance scenarios.

`PUB-AUSGRID-001P` remains explicitly separated from the controlled case pack.

## Final rehearsal artifacts

### Fresh external case
- artifact `10396372686`
- sha256 `3be518a37dfee202313fec1dd183a15d91c6963e458bbf1089a885b284983665`

### Specialized Gauntlet
- artifact `10396840017`
- sha256 `4410ffecfad36dd30f86ee4c9206fd549715ded7eb1fc77fb936448ddb64d0ed`

### Submission assets
- artifact `10396540904`
- sha256 `37ad96c82ca2539e212625bcf9ff8cd6c06bc7ed87eb49c26f2acb2411bcdf11`

### Case Workbench V2
- diagnostics `10395734883` — sha256 `c1d9792c7c551e5c8e8306fa4cdaffb31dd8e0ae669bb35c1fccd0ed2fe79385`
- visual `10396068617` — sha256 `57966591531e8dc9a1660a911418ea64087c5c11e1184c76b92b62ca32463fef`
- deployable site `10395904153` — sha256 `cec513650224399cb58be2bc31b41901eea23d4df64b6a538993b776c6ed97ec`

### Constraint Protocol Alpha
- diagnostics `10396875067` — sha256 `8e98c75d7d0adba5a23de608f7bc5e497bc08e363659700a1392fa028b341b07`
- runtime `10395869252` — sha256 `a48e46d5283130fc32b852b18e472db680ebdc652512728af8ee108292d9f304`
- visual `10396108739` — sha256 `5a566fe273d0f2860ea9ac2b8d2692794590786f393dba9c593717ec1223ec10`
- deployable site `10396188291` — sha256 `64fe421877ad01c9ec25a9f7b39a2485f296d2ac33d5952a78b53b15e7184cef`

## What this rehearsal proves

- current `main` has no hidden merge-base conflict with the corrected complete candidate;
- the combined research/browser/Gauntlet/certification state passes the full main-target CI matrix;
- the actual `@solarpunk/constraint-core` package boundary is now certified rather than the repository root;
- the shipped frontend production dependency graph passes the permanent security gate;
- outside-data proof remains reproducible on the combined candidate;
- submission assets build against the same combined candidate;
- Research Browser changes do not break protocol, contract, security, or legacy validation paths.

## What remains deliberately unproven

This rehearsal does **not** close the external gates:

- independent clean-room reproduction;
- materially different attributable external source / owner-operator evidence;
- blind evaluator comprehension;
- real external workflow / practical institutional validation;
- R4 monetary performance.

It also does not execute trusted main-only release attestation or create a signed release tag, because the candidate has not been merged to `main`.

## Promotion boundary

No merge, release, tag, deployment promotion, or external claim is authorized by this PR. This PR should remain draft and unmerged; it is the durable pre-merge proof record for an eventual explicit promotion decision.

</details>

### #72 Prepare Fiscal Choke Points archive metadata and Zenodo bundle

API head aa7167c45d8e0a38f3c8ce6f31b7a0bad078825b; base digital-tax/rebuild-2026 at 6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd.

<details><summary>Description</summary>

## Purpose

Prepare **Fiscal Choke Points** as a citable frozen research object without publishing a DOI, changing the Policy Lab root citation identity, or silently changing the validated research-control package.

This PR is intentionally based on `digital-tax/rebuild-2026`, not `main`.

## Source lock

Archive preparation is anchored to validated research commit:

`6aa3e8e2a1ea256a383515f4ebdba13462bbc2bd`

That source head has successful Digital Tax package validation, secrets scan, tests/coverage, and Solidity checks. The archive builder rejects any research-package changes after that snapshot except the explicit archive-metadata allowlist in this PR.

## Adds

- `CITATION.cff` — DT-specific citation metadata under the research package; does **not** replace the repository-root citation identity.
- `ZENODO_RELEASE_MANIFEST_2026-09-15.md` — exact source snapshot, manuscript hashes, draft Zenodo metadata, release gates and nonclaims.
- `ZENODO_EXTERNAL_SHA256SUMS_2026-09-15.txt` — frozen hashes for the reader-facing PDF/DOCX.
- `build_zenodo_bundle.py` — deterministic candidate-bundle builder. It:
  - verifies the frozen PDF/DOCX SHA-256 and byte sizes;
  - rejects uncommitted research-package changes;
  - rejects any source-control drift from the validated baseline outside the archive-metadata allowlist;
  - copies the full research-control package plus reader-facing manuscripts;
  - emits path-independent provenance and per-file SHA-256 checksums;
  - creates a deterministic `Fiscal_Choke_Points_DT-FCP-2026-001_Zenodo_Candidate.zip` plus sidecar hash.

## Frozen reader-facing manuscript hashes

- PDF: `8ef8b215c7e1340f7c7c8f97c2e0449cad8c571077ea4ee2dd4332a41d133ba6` — 195,111 bytes.
- DOCX: `d44b87e06a56977e98f8b5a23965c0cd3eca6796f9f2459acdff6e83a915f05b` — 55,093 bytes.

## Deliberate gates

This PR does **not** choose or claim:

- a Zenodo DOI;
- a public release date;
- a Zenodo resource type for the mixed publication/data/code object;
- a scholarly release license merely because the host repository has an MIT software license;
- peer review, external reproduction, causal validation, journal acceptance or institutional endorsement.

Those remain explicit human/publication gates. Zenodo draft creation, DOI reservation and Publish are not performed by this PR.

## Expected validation

The existing `Digital Tax package validation` pull-request workflow should still pass. Archive preparation is metadata-only relative to the locked source evidence package.

</details>

### #73 Make Policy Lab capsule verification callable through MCP

API head b4cfb025c77d25ef470859fbffe4945387cea812; base main at 55fd6f2cf2eed25b589e91b5e3161e6ced68f5de.

<details><summary>Description</summary>

Adds `policy_lab_verify_capsule` by delegating directly to the current `@solarpunk/constraint-core` verifier. The tiny adapter only supplies JSON input/output; it does not reimplement hashes, decision rules, or evidence boundaries.

No historical token/treasury scripts, contract deployment, transfers, field authority, or front-end files are changed. Capsule integrity remains distinct from source truth.

CI runs the existing native capsule-verifier test suite, real MCP discovery, and a native-versus-MCP invalid-capsule parity control. A negative verification result must remain `ok=false` rather than being hidden as a transport success.

Shared runner: Cite-Refinery PR #16 at pinned c9559e4. Start `portfolio-mcp serve --manifest integrations/mcp/manifest.json --root .`. This initial tool surface covers capsule verification, not every Policy Lab workflow. Keep draft until CI is inspected; no production deployment.

</details>

## Observed issue descriptions

### #29 Programme control: execute maximum-value maturity gates

<details><summary>Description</summary>

## Objective

Operate the Solarpunk / CL–ECI / Policy Lab programme against explicit maturity gates rather than repository size, speculative scope, or venue deadlines.

## Authority

Branch `docs/submission-packaging-calendar` adds:

- `docs/project/MAXIMUM_VALUE_EXECUTION_PROGRAM.md`
- `submission/PROGRAMME_SCOREBOARD.md`
- `submission/EXTERNAL_CASE_PORTFOLIO.md`
- `submission/CONFORMANCE_BENCHMARK_V1.md`

This issue becomes the programme-level control thread after the authority branch is merged.

## Current gate

`M1 — External operability`, tracked by issue #26.

## Thirty-day acceptance criteria

- [ ] Merge the programme-control authority without creating competing truth.
- [ ] Complete or truthfully preserve the blocker for External Case 001.
- [ ] Freeze Conformance Benchmark v1 C0–C2 requirements.
- [ ] Map current tests and cases to the benchmark.
- [ ] Open Cases 002–003 against deliberate source contrasts.
- [ ] Recruit domain and technical reviewer roles.
- [ ] Freeze P1 claim/evidence hierarchy.
- [ ] Update P3 and P4 only against real evidence.
- [ ] Reject broad frontend, token, marketplace, AI, or speculative integration work unless an active gate requires it.

## Programme success condition

Each completed tranche must create new external, reproducible, institutional, commercial, or intellectual evidence and state which claim becomes permissible afterward.

## Non-claims

This issue does not claim external validation, institutional adoption, customer demand, company formation, neutral-standard status, or present valuation.

</details>

### #30 Build Conformance Benchmark v1 (C0–C2)

<details><summary>Description</summary>

## Objective

Implement the first public behavioral benchmark for source integrity, semantic mapping, provenance boundaries, deterministic policy decisions, quantity authorization, and receipt/capsule closure.

## Specification

Authority candidate: `submission/CONFORMANCE_BENCHMARK_V1.md` on PR #24.

## Scope

### C0 — Parse and integrity

- [ ] source SHA-256 and byte-length verification;
- [ ] manifest integrity;
- [ ] declared artifact closure;
- [ ] unsafe overwrite refusal;
- [ ] timestamp, timezone, interval, field, unit, and sign diagnostics;
- [ ] no silent semantic assumptions.

### C1 — Deterministic decision

- [ ] actual versus counterfactual assurance separation;
- [ ] unsupported promotion refusal;
- [ ] deterministic admission and blocking reasons;
- [ ] policy identity freeze;
- [ ] requested, eligible, and authorized quantity separation;
- [ ] deterministic binding-ceiling attribution.

### C2 — Reproducible receipt

- [ ] receipt tamper detection;
- [ ] cross-object agreement checks;
- [ ] capsule inventory closure;
- [ ] clean-environment reproduction;
- [ ] machine-readable and human-readable reports.

## Required implementation sequence

- [ ] Inventory existing tests against B1–B9.
- [ ] Mark requirements existing / partial / absent / out of scope.
- [ ] Freeze benchmark manifest schema.
- [ ] Build minimal public corpus for C0–C2.
- [ ] Freeze expected outputs independently of the implementation under test.
- [ ] Implement runner against packaged artifacts rather than internal test helpers.
- [ ] Run in a clean checkout and second environment.
- [ ] Archive benchmark version and report.

## Acceptance criteria

- [ ] Public corpus contains no unauthorized external raw data.
- [ ] Expected outputs and permitted variability are explicit.
- [ ] Failures identify exact invariant or artifact.
- [ ] Report records skipped and modified cases.
- [ ] Conformance terminology remains separate from L0–L4 source-assurance terminology.

## Non-claims

Passing the founding benchmark does not establish a neutral standard, physical source truth, legal validity, regulatory compliance, production security, or commercial readiness.

</details>

### #31 External Cases 002–003: repeatability and authentication portfolio

<details><summary>Description</summary>

## Objective

After External Case 001 reaches a source-dependent execution state, build a deliberately heterogeneous three-case portfolio that tests repeatability and stronger authentication without collapsing source truth into one confidence label.

## Authority

`submission/EXTERNAL_CASE_PORTFOLIO.md` on PR #24.

## Case 002 — heterogeneity

Select at least two contrasts from Case 001:

- [ ] different source format;
- [ ] different custodian or institutional relationship;
- [ ] different interval or timezone behavior;
- [ ] cumulative versus interval measurements;
- [ ] generation versus consumption/import/export/storage;
- [ ] private-only versus anonymized-public permission;
- [ ] complete versus ambiguous semantics.

Required:

- [ ] attributable and permissioned source;
- [ ] generic intake path plus registered adapter;
- [ ] effort, clarification, unresolved-field, and reproduction metrics;
- [ ] documentation of which Case 001 improvements were reusable.

## Case 003 — authentication or corroboration

Test at least one independently checkable source relationship or authentication path:

- [ ] verified API/account relationship;
- [ ] signed gateway with documented key custody;
- [ ] utility or registry corroboration for the same source/window;
- [ ] external operator confirmation of device or system identity;
- [ ] independently preserved acquisition record.

Required:

- [ ] accepted and rejected promotion evidence;
- [ ] actual source state kept separate from L2/L4 counterfactuals;
- [ ] no promotion based only on filenames, local keys, parsing, permission, model names, or screenshots.

## Portfolio acceptance

- [ ] Three independent external cases completed.
- [ ] At least two source environments differ materially.
- [ ] At least one case is correctly blocked or materially limited.
- [ ] At least one case is admitted or admitted with limit when evidence permits.
- [ ] Cross-case report compares semantics, diagnostics, assurance, policy outcome, effort, privacy, and usefulness.
- [ ] Clean reviewer can reproduce every authorized package.

## Dependency

Do not implement speculative Case 002/003 features before Case 001 reveals the actual reusable gaps.

</details>

### #32 Independent review programme: domain and technical scrutiny

<details><summary>Description</summary>

## Objective

Create a documented external-review process that tests programme claims, source boundaries, policy behavior, reproducibility, security, and institutional interpretation.

## Reviewer roles

### Domain reviewer

Preferred background:

- renewable-energy data;
- energy management or ESCO operations;
- certificate, sustainability, carbon, or market processes;
- metering or energy-information systems.

Review scope:

- [ ] source relationship and terminology;
- [ ] field, unit, interval, and measurement-window semantics;
- [ ] distinction between evidence readiness and official certification;
- [ ] policy and institutional interpretation;
- [ ] overclaims and missing operational risks.

### Technical reviewer

Preferred background:

- software security;
- reproducible research;
- digital governance;
- distributed systems;
- data provenance or audit systems.

Review scope:

- [ ] deterministic behavior and identities;
- [ ] receipt and capsule closure;
- [ ] counterfactual versus actual-state separation;
- [ ] threat model and private/public boundary;
- [ ] benchmark design and adversarial coverage;
- [ ] unsupported standard, security, or production claims.

## Required artifacts

- [ ] reviewer brief and exact version under review;
- [ ] conflict-of-interest and relationship note;
- [ ] written findings;
- [ ] severity and disposition register;
- [ ] correction commits or explicit rejection rationale;
- [ ] review closure statement;
- [ ] public summary only where permission permits.

## Acceptance criteria

- [ ] At least one attributable reviewer completes each role.
- [ ] Reviewers inspect an external case and stable artifact set, not only a presentation.
- [ ] Programme claim and non-claim registers are updated.
- [ ] No finding is silently discarded.
- [ ] Review does not imply endorsement, certification, or institutional adoption.

## Dependency

Begin recruitment now, but freeze the exact review package after External Case 001 and Conformance Benchmark v1 have inspectable artifacts.

</details>

### #33 Institutional adoption and commercialization discovery experiment

<details><summary>Description</summary>

## Objective

Test whether a bounded part of Policy Lab should become an institutional product, specialist service, licensed component, grant-backed research infrastructure, or company—without making the research programme depend on a positive business outcome.

## Preconditions

- [ ] External Case 001 is inspectable or its blocker is exact.
- [ ] One non-confidential brief exists.
- [ ] Interview register distinguishes source partner, user, influencer, buyer, and budget owner.
- [ ] P4 commercialization hypotheses H1–H4 remain separate.

## Discovery programme

Conduct 10–20 structured interviews covering:

- [ ] present workflow;
- [ ] late-stage evidence failures;
- [ ] staff time and delay;
- [ ] existing consultants, software, or internal alternatives;
- [ ] decision authority;
- [ ] budget ownership;
- [ ] consequence of error;
- [ ] value of a blocked or bounded result;
- [ ] required deliverable and trust conditions;
- [ ] willingness to provide data, review time, authority, introduction, or budget.

Do not count general praise as problem confirmation.

## Pilot experiment

Define one offer with:

- [ ] named buyer role;
- [ ] source and permission contract;
- [ ] exact scope and exclusions;
- [ ] deliverables;
- [ ] success and failure criteria;
- [ ] delivery effort assumptions;
- [ ] price or funded-resource request;
- [ ] case-publication rights;
- [ ] post-pilot decision.

## Evidence ladder

- [ ] five qualified source or design partners;
- [ ] three written expressions of interest or equivalent procurement evidence;
- [ ] three organizations complete a bounded workflow;
- [ ] one paid pilot;
- [ ] one repeat-use or renewal signal.

## Stop rules

Stop or change the hypothesis when:

- [ ] 20 interviews produce fewer than three serious problem confirmations;
- [ ] no qualified partner allocates data, review time, authority, or budget;
- [ ] all work remains bespoke with no reusable core;
- [ ] incumbent processes solve the problem adequately at lower switching cost;
- [ ] commercialization displaces external cases, benchmark, publication, or review without generating equivalent evidence.

## Non-claims

This issue does not claim a validated market, company, customer, willingness to pay, product-market fit, venture-scale opportunity, or present valuation.

</details>

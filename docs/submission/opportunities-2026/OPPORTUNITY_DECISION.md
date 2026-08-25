# Policy Lab Opportunity Decision — 2026-08-25

This file records the current hard decisions after a second-pass opportunity scan. Current official rules override stale internal Gauntlet scoring. See [`EXPANDED_MARKET_MAP.md`](./EXPANDED_MARKET_MAP.md) for the full scan and explicit kills.

## Current decisions

| Route | Decision | Deadline / gate | Role |
|---|---|---:|---|
| Global AI Finance Research Conference 2026 — WIP Poster | **FIRE NOW** | 2026-08-31 | non-exclusive external academic exposure |
| Financial Cryptography 2027 — Short Paper | **FIRE — PRIMARY MANUSCRIPT** | 2026-09-17 23:59 AoE | highest-value Policy Lab paper route |
| Asia University FTSID 2026 | **BACKUP MANUSCRIPT FIRE** | 2026-09-30 | local FinTech/sustainability full-paper fallback; do not overlap FC |
| Shih Hsin 2026 Finance International Conference | **LOW-COST BACKUP** | abstract 2026-09-17 | Taipei presentation fallback; do not duplicate FC |
| SSI Fellowship 2027 | **FIRE** | 2026-10-05 | fellowship/network/£4k activity budget |
| Digital Public Goods Registry | **READY TO SUBMIT — EXTERNAL REVIEW PENDING** | rolling | independent standards-based public-good review |
| JOSS | **PREPARE — DO NOT SUBMIT YET** | rolling | submit after external-impact/community-significance gate |
| NLnet Restack | **CALL-GATED** | call 2026-09-03; deadline 2026-11-03 | hard FIRE/KILL after exact call + European-dimension test |
| Bank of Cyprus FinTech Hackathon 7.0 | **KILL ON ECONOMICS** | Nov 27–29 | topic/eligibility pass; mandatory Cyprus travel fails current expected value |

## Manuscript exclusivity

Do not confuse `more eligible venues` with `more simultaneous submissions`.

The Policy Lab mechanism/Ausgrid/non-promotion paper has one primary live manuscript lane:

> **FC'27 short paper → primary.**

Asia University FTSID and Shih Hsin are backups unless a genuinely distinct research question, dataset, results section and contribution exist. FC explicitly prohibits substantially overlapping concurrent submissions.

The Global AI Finance poster, SSI Fellowship, DPG review, JOSS preparation and funding applications are separate conversion channels and can compound without creating a duplicate-paper strategy.

## FIRE NOW — Global AI Finance poster

Official sources:
- https://www.efmaefm.org/announcements/events.php
- https://www.conftool.net/aifinconf2026/

Verified position:
- Taiwan, Dec 14–15, 2026;
- Aug 31 submission deadline;
- WIP poster route via extended abstract;
- broad FinTech scope includes blockchain/crypto, DeFi, regulation and Green FinTech;
- no requirement to invent an AI contribution for every submission.

Package: [`global-ai-finance-2026/`](./global-ai-finance-2026/)

## PRIMARY MANUSCRIPT — FC'27

Official source: https://www.ifca.ai/fc27/cfp.html

The contribution is **not** generic policy-as-code, credential verification, proof-of-reserve gating, or machine-readable financial contracts. Those already exist in OPA/Cedar, W3C VC, Chainlink PoR and ACTUS.

The paper-worthy contribution is a compositional **non-promotion semantics** across:

```text
evidence assurance → policy admission → quantity bound → settlement
```

with explicit invariants, binding-constraint attribution, stable policy/evidence/decision identities, cross-object verification and deterministic reproduction.

Named executable FC tests now directly cover:
- attempted assurance-capability promotion under a stale evidence identity → rejected;
- caller-supplied oversized quantity → cannot override the decision-bound maximum.

Existing tests/verifiers also cover tampering, policy/evidence identity changes, settlement separation, closed-world replay, exact machine/human report agreement and byte-identical package rebuild.

Package: [`fc27-short-paper/`](./fc27-short-paper/)

## BACKUP MANUSCRIPT — Asia University FTSID

Official source: https://ftimc.asia.edu.tw/international-academic-conference/submission/

This survives the scan because it is genuinely local and natively relevant:
- FinTech, Sustainability/ESG, Blockchain & Digital Finance and interdisciplinary topics are explicit;
- full paper by Sep 30;
- double-blind CMT submission;
- no advisor gate stated;
- three Best Paper awards with prize money;
- outstanding papers may be recommended to a special issue, subject to journal review.

Use only as the Policy Lab manuscript target if FC is not live or a genuinely distinct paper exists.

Package: [`asia-university-ftsid-2026/`](./asia-university-ftsid-2026/)

## LOW-COST BACKUP — Shih Hsin

Official source: https://fin.wp.shu.edu.tw/?page_id=262

- abstract Sep 17;
- full paper Oct 31 after acceptance;
- conference Nov 7 in Taipei;
- `other finance-related topics` explicitly accepted;
- no advisor gate stated.

Useful as a cheap external-presentation fallback, not as a duplicate manuscript.

Package: [`shih-hsin-finance-2026/`](./shih-hsin-finance-2026/)

## FIRE — SSI Fellowship

Official sources:
- https://www.software.ac.uk/programmes/fellowship-programme/apply-fellowship-programme
- https://www.software.ac.uk/guide/fellowship-programme-application-video-guide

Up to three international Fellows; £4,000 activity budget; application + six-minute voice-over screencast. Policy Lab is the worked reference implementation for a broader plan around evidence-bounded, reproducible research software.

Package: [`ssi-fellowship-2027/`](./ssi-fellowship-2027/)

## READY TO SUBMIT — Digital Public Goods Registry

Official sources:
- https://www.digitalpublicgoods.net/
- https://github.com/DPGAlliance/dpg-standard
- https://github.com/DPGAlliance/dpg-resources/blob/main/docs/dpg-review-policy.md

The internal remediation tranche is complete on `main`:
- `PRIVACY.md` is grounded in the browser-local/no-upload Evidence Lab;
- `SECURITY.md` defines supported scope and sensitive reporting;
- `GOVERNANCE.md` names current ownership and separates Yuan Ze affiliation from ownership/endorsement;
- `CODE_OF_CONDUCT.md` covers contributor safety and moderation;
- `PUBLIC_INTEREST.md` maps the bounded public-interest thesis primarily to SDG 16 without claiming measured institutional impact;
- `CURRENT_SURFACE.json` machine-declares these governance artifacts;
- `scripts/check_public_governance.mjs` tests material statements against current runtime/citation truth;
- Current Surface Integrity passes with the governance checker enabled.

The route is now **submission-ready internally**, but still **externally unrecognized**. Before pressing submit, re-check the live DPGA eligibility tool/questionnaire and ensure every answer points to evidence on the nominated public commit. DPGA then performs its own binary external review; do not call Policy Lab a Digital Public Good before that review succeeds.

Package: [`dpg-registry/DPG_APPLICATION_DRAFT.md`](./dpg-registry/DPG_APPLICATION_DRAFT.md)

## PREPARE — JOSS

The software engineering/reproducibility side is strong, but JOSS 2026's external research-impact/community-significance hard screen remains the gating issue. Do not submit until an inspectable outside signal exists (accepted presentation, independent reproduction/use, external research integration/request, or equivalent).

Package: [`joss/`](./joss/)

## CALL-GATED — NLnet Restack

The successor calls open Sep 3. Taiwan/non-European proposals need exceptional quality and a clear European dimension, so no proposal is called FIRE until the **actual Sep-3 call text** passes the prewritten gate. This is a real future condition, not missing research.

Package: [`nlnet-restack/`](./nlnet-restack/)

## Explicit kills / parks

- Bank of Cyprus FinTech Hackathon: technically good fit, economically killed while mandatory Cyprus travel is self-funded.
- GitHub Secure Open Source Fund Session 5: current deadline passed Aug 24; future session also needs community traction/governance evidence.
- Sloan Open Source in Science: Sloan explicitly does not grant directly to individuals outside its Books program; current independent route killed.
- IEEE S&P / ACNS / PETS: do not manufacture a stronger security/privacy story or duplicate the FC manuscript.
- OTF Internet Freedom / ICRP: wrong native problem (censorship/surveillance).
- NSF PESOSE/POSE and several UK/NL open-science funds: proposer/geography gate fails.
- ACTUS use-case competition: concluded.
- InnoServe/NTUB advisor-dependent contests: park without a genuinely aligned faculty advisor.
- AI-first competitions: no cosmetic LLM/agent layer merely for eligibility.
- opaque conference-alert/pay-to-publish venues: reject on signal quality.

## Execution order

1. **Aug 31:** Global AI Finance poster.
2. **Sep 17:** FC'27 short paper.
3. **Rolling / now:** run the live DPGA eligibility questionnaire and submit the DPG application from the merged evidence ledger.
4. **Sep 3:** Restack hard FIRE/KILL from published call.
5. **Oct 5:** SSI Fellowship.
6. **After external impact exists:** JOSS.
7. Activate FTSID/Shih Hsin only as manuscript failover or for genuinely non-overlapping work.

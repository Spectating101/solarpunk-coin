# Digital Public Goods Registry — Policy Lab Readiness Audit

**Decision:** REMEDIATE, THEN SUBMIT  
**Deadline:** rolling  
**Value:** independent standards-based external review and registry recognition; not a cash prize

Official sources:
- https://www.digitalpublicgoods.net/
- https://www.digitalpublicgoods.net/registry
- https://github.com/DPGAlliance/dpg-standard
- https://github.com/DPGAlliance/dpg-resources

## Why this route matters

Digital Public Good recognition is a distinct conversion channel from competitions and academic papers. Applicants are evaluated against the DPG Standard through multiple review stages; recognized projects enter a public registry used to discover reusable open digital solutions. DPG status is reassessed annually.

For Policy Lab this can provide an external, inspectable review signal relevant to later JOSS impact/community-readiness claims, while requiring no faculty advisor or startup incorporation.

## Current audit against the DPG baseline

| Area | Current state | Decision |
|---|---|---|
| Open-source software | public repository; MIT license | PASS |
| Clear open license | root `LICENSE` is MIT | PASS, but ownership wording needs clarification |
| Documentation / source availability | README, contribution guide, schemas, reproducibility commands, public case | PASS |
| Platform independence / open formats | deterministic core; JSON/CSV schemas and web/runtime implementation | PLAUSIBLE PASS; document explicitly |
| Open standards / interoperability | JSON/CSV/HTTPS/web standards are used; published schemas exist | PASS WITH EVIDENCE WRITEUP |
| Privacy / applicable law | project boundaries prohibit private/customer data, but no dedicated public `PRIVACY.md` was found | REMEDIATE |
| Security / responsible reporting | CI, secret scanning, Slither and tests exist, but no root `SECURITY.md` was found | REMEDIATE |
| Clear ownership / governance | current maintainer/contribution behavior is inspectable, but root license still says `Copyright (c) 2024 Solarpunk Bitcoin Project` and no dedicated current governance/ownership statement was found | REMEDIATE |
| Do-no-harm / inappropriate use | strong claim boundaries exist, but not yet expressed as a DPG-facing safety/use statement | REMEDIATE LIGHT |
| SDG contribution | strongest native thesis is accountability/transparent institutions (SDG 16); energy cases can support SDG 7/13 context but should not be promoted into demonstrated climate impact | WRITE EVIDENCE-BOUNDED CLAIM |

## Required remediation before nomination

This is documentation/governance remediation, **not feature development**:

1. add `SECURITY.md` with supported reporting channel, vulnerability disclosure expectations, and explicit non-production-security boundary;
2. add `PRIVACY.md` describing the live site's data handling, browser-local behavior where applicable, and prohibition on uploading private evidence to public issues;
3. add a concise `GOVERNANCE.md` / ownership statement naming the current maintainer/project governance and explaining the historical SolarPunk copyright line without silently rewriting legal history;
4. add a DPG-facing `PUBLIC_INTEREST_AND_SAFETY.md` mapping Policy Lab to SDG 16 and stating explicit non-claims / misuse boundaries;
5. run the official DPGA eligibility questionnaire against the exact remediation commit;
6. submit only the exact repository/components intended for assessment.

## SDG thesis

Primary:

> **SDG 16 — Peace, Justice and Strong Institutions:** Policy Lab makes evidence-to-authority decisions inspectable, rule-bound, reproducible and contestable rather than opaque.

Secondary/context only:

- SDG 9: open reusable digital decision infrastructure;
- SDG 7/13: energy-linked case studies demonstrate bounded treatment of sustainability-related evidence, but the current project does not claim measured climate impact.

## Nomination claim

> Policy Lab is open research software for making evidence-backed financial and policy decisions inspectable. It preserves the difference between source assurance, policy authorization, bounded quantity and settlement, and produces deterministic artifacts that can be independently reproduced and challenged.

## Stop rule

Do **not** submit the DPG nomination while the ownership/governance, privacy and security documentation gaps above remain. Once those four small public-governance gaps are closed and the official eligibility questionnaire passes, this route becomes **FIRE** without requiring new core functionality.

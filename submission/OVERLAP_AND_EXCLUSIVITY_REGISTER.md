# Overlap and Exclusivity Register

**Status:** active control register  
**Version:** 0.1  
**Date:** 2026-08-05

This register prevents accidental duplicate submission, self-plagiarism, inconsistent evidence status, and competition packages that present the same work as multiple independent products.

## Overlap classes

| Class | Meaning | Treatment |
|---|---|---|
| **O0 — administrative** | biography, affiliation, generic acknowledgements, formatting workflow | freely reusable |
| **O1 — programme identity** | project hierarchy, doctrine, generic architecture vocabulary | reusable with citation/attribution where appropriate |
| **O2 — shared evidence** | same source, case, result, or artifact used for different questions | allowed only when each package declares the reuse and contribution remains distinct |
| **O3 — shared argument** | materially similar research question, proposition, analysis, and conclusion | high risk; do not submit simultaneously without explicit venue permission |
| **O4 — same manuscript/output** | substantially identical text, figures, results, or software claim | prohibited as independent simultaneous submission |

## Active package relationships

| Package pair | Expected overlap | Required separation | Current rule |
|---|---|---|---|
| FTSID ↔ ICDLT | O1–O2 | finance/institutional question versus technical system/evaluation; different central figures and contribution statements | simultaneous work possible only after manuscript-level overlap review |
| FTSID ↔ BCK | O1–O3 depending on track | BCK must remain technical/institutional and substantially shorter; confirm archival policy | treat BCK as technical-route alternative, not automatic second submission |
| ICDLT ↔ BCK | O3–O4 | same technical slot | choose one unless venue policies and manuscripts are clearly non-overlapping |
| FTSID ↔ NTUB | O1–O2 | academic research paper versus applied competition proposal/product framing | permitted as derivative; disclose status where asked |
| FTSID ↔ ClimateChain | O1–O2 | academic framework versus event-period executable product additions | permitted; declare pre-existing research and new implementation |
| NTUB ↔ ClimateChain | O1–O2 | proposal versus working event prototype | permitted; do not claim NTUB work as separately invented product |
| ClimateChain ↔ GSC | O2 | hackathon prototype versus longer testing and stakeholder-development programme | permitted as progression; preserve timeline and release history |
| ClimateChain ↔ Blockchain for Good | O2 | public prototype versus incubation package | permitted as progression |
| FTSID ↔ FINEC | O2–O3 | integrated programme paper versus distinct result-led econometrics | FINEC only after result and manuscript separation audit |
| ICDLT/BCK ↔ Ledger/ACM DLT | O2–O3 | conference version versus mature expanded journal contribution | follow venue extension and prior-publication rules; cite conference version |
| ClimateChain ↔ JOSS | O2 | event prototype versus mature research software | permitted after substantial maturation; cite release history |
| FTSID/ClimateChain ↔ Energy Informatics | O2–O3 | energy-information methodology must be independently strong | create only after contribution separation review |

## Mandatory pre-submission declaration

Every package must answer:

1. Which earlier or simultaneous packages use the same research question?
2. Which sources, results, cases, figures, text, and code are reused?
3. What is the package’s unique central contribution?
4. Is another version under review, accepted, published, or publicly presented?
5. Does the venue permit the relationship?
6. Is disclosure or citation required?
7. Could a reasonable reviewer see the submissions as substantially the same work?

If question 7 is plausibly yes, submission is blocked until the overlap is resolved.

## Canonical figure rule

Canonical figures may be reused when venue rules permit, but they must not create the false impression that two papers have separate empirical or technical contributions.

Recommended allocation:

| Figure | FTSID | ICDLT/BCK | Competition/funding |
|---|:---:|:---:|:---:|
| Programme architecture | central | minimal/supporting | simplified |
| Boundary chain | central | motivation | simplified |
| Norway map | central | optional/bounded | credibility only |
| Controlled sequence | central | technical evaluation | demo story |
| Technical object/receipt model | supporting | central | simplified |
| Product workflow | excluded or discussion | excluded | central |

## Text-reuse rule

- generic definitions may be reused sparingly and transparently;
- contribution, methods, results, discussion, and conclusion text must be rewritten for the distinct question;
- abstracts must be package-specific;
- identical result descriptions should be cited or clearly identified as reused rather than presented as new evidence.

## Software and hackathon rule

Any event requiring work during a defined event period must receive:

- a pre-event release/tag;
- a written declaration of pre-existing work;
- a branch or commit range for event-period additions;
- a list of new features and tests;
- a final release/tag and artifact hash.

## Status table

| Package | Under production | Under review | Accepted/published | Overlap clearance |
|---|:---:|:---:|:---:|---|
| P1 FTSID | planned | no | no | pending |
| P2 ICDLT | decision pending | no | no | pending route choice |
| P2 BCK | fallback | no | no | pending route choice |
| P3 NTUB | planned derivative | no | no | pending |
| P3 ClimateChain | planned | no | no | requires pre-event release boundary |
| P4 NSTC | eligibility gate | no | no | not a publication submission |
| P5 FINEC | no | no | no | blocked pending empirical audit |
| P5 journals/software | no | no | no | blocked pending maturation |

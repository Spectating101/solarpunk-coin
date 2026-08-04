# Package Manifest — `P3-CLIMATE-ASSURANCE-2026-001`

**Package title:** Policy Lab for Renewable-Energy Claim Assurance  
**Primary route:** IEEE ClimateChain  
**Derivative routes:** NTUB FinTech, Global Sustainability Challenge, Blockchain for Good  
**Status:** `SCOPED`  
**Version:** 0.1  
**Created:** 2026-08-05  
**Primary event period:** 2026-10-05 to 2026-10-25

## 1. Conversion function

Convert the programme’s institutional and technical architecture into one usable public workflow for renewable-energy claims. This package is the bridge from research method to demonstrable product surface.

## 2. User problem

Renewable-energy and other external claims can fail through ambiguous evidence status, unsupported authorization, excessive quantity, duplicate use, missing cancellation, untracked corrections, or settlement gaps.

## 3. Product proposition

> Policy Lab makes the claim lifecycle inspectable: which evidence was used, which rule admitted or blocked it, which quantity limit bound it, whether the claim identity was reused or cancelled, what changed after correction, and which exact inputs produced the receipt.

## 4. Required lifecycle

```text
source evidence
→ evidence status
→ purpose-specific admissibility
→ authorized quantity
→ unique claim identity
→ transfer
→ cancellation / anti-reuse
→ evidence correction / revision
→ reproducible receipt and lineage
```

## 5. Selected assets

| Asset ID | Asset | Package role | Status |
|---|---|---|---|
| TEC-001–005 | decision architecture and receipts | product core | strong |
| TEC-007 | anti-reuse/cancellation | product lifecycle | partial |
| TEC-008 | correction/revision lifecycle | product lifecycle | partial |
| INS-003 | certificate identity/cancellation mapping | institutional grounding | strong |
| ART-001–007 | controlled case and public demo | seed demonstration | strong/partial |
| BUS-001–002 | assurance thesis and renewable use case | user/product framing | strong concept |
| COM-008–010 | deck, demo, Q&A | shipping assets | proposed |

## 6. Genuinely new work

| Work | Purpose | Completion evidence |
|---|---|---|
| Claim/certificate identity model | prevent ambiguity and reuse | schema, tests, UI flow |
| Transfer and cancellation state | explicit lifecycle | deterministic transitions and receipts |
| Anti-reuse tests | demonstrate duplicate-claim blocking | regression test suite |
| Evidence correction lineage | preserve changed evidence states | revision replay and receipt chain |
| Climate-specific workflow | make the platform legible to users/judges | complete demo path |
| Public event release | separate pre-existing and event work | pre-event tag, event branch, final tag |
| Demo video | communicate problem and execution | 3–5 minute final video |

## 7. Route derivatives

### ClimateChain

Technical implementation, public repository, demonstration, impact story, and explicit event-period additions.

### NTUB

Simplified fintech proposal using the same product identity. No separate product ontology. Competition-specific benefits, user story, and feasibility language only.

### Global Sustainability Challenge

Extend the same prototype into stakeholder testing, milestones, impact metrics, and showcase evidence.

### Blockchain for Good

Apply only after a stable public prototype exists and the project can explain users, impact, roadmap, and funding use.

## 8. Required deliverables

- package-local architecture and lifecycle specification;
- pre-event release and declared pre-existing work;
- event-period feature list;
- working public prototype;
- tests and reproduction instructions;
- public documentation;
- demo video and script;
- impact and limitation statement;
- user/pilot hypothesis;
- final release and artifact hashes.

## 9. Forbidden claims

- real registry integration without evidence;
- prevention of all fraud or double counting beyond the modeled system boundary;
- legally valid certificate issuance or cancellation;
- customer adoption or demand without attributable evidence;
- production security or operational readiness;
- financial or monetary status of the claim.

## 10. Go / stop rules

### Go when

- scope remains one complete renewable-claim assurance workflow;
- anti-reuse and correction lineage are testable;
- pre-existing work and event additions are clearly separated;
- a reviewer can reproduce the flagship path.

### Stop or reduce scope when

- work expands into a token, marketplace, full registry, or generalized enterprise platform;
- the demo depends on unverifiable live integrations;
- documentation and tests fall behind feature growth;
- product claims outrun the controlled evidence.

## 11. Next production actions

1. freeze lifecycle state machine;
2. freeze claim/certificate identity schema;
3. specify anti-reuse and correction test cases;
4. define pre-event release boundary;
5. create competition-neutral product brief and deck;
6. identify the first plausible user and pilot workflow.

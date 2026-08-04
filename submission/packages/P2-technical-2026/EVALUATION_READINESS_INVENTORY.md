# Technical Evaluation Readiness Inventory — `P2-TECHNICAL-2026-001`

**Status:** initial audit specification; no readiness conclusion until repository evidence is inspected and reproduced  
**Version:** 0.1  
**Date:** 2026-08-05

This inventory determines whether the technical route can support an IEEE ICDLT full paper or should use the lighter BCK26 submission.

## Readiness decision

| Outcome | Required condition |
|---|---|
| **ICDLT-ready** | technical novelty, reproducible evaluation, related-work comparison, and artifact quality can carry an eight-page paper independently |
| **BCK-ready** | architecture and institutional problem are strong, but evaluation remains bounded or preliminary |
| **Not ready** | core decisions or artifacts do not reproduce, contribution remains mostly conceptual, or overlap with FTSID cannot be resolved |

## A. Contribution clarity

| Test | Current indication | Evidence required | Status |
|---|---|---|---|
| Admission, quantity, and settlement are separate technical stages | architecture clearly states separation | frozen schema/code paths and tests | audit pending |
| Binding quantity ceiling is deterministically attributed | demonstrated in controlled cases | algorithm specification, tie behavior, regression tests | audit pending |
| Decision identity preserves input/policy/calculator lineage | repository and blueprint describe this | schema, hash/ID logic, stable receipt examples | audit pending |
| Counterfactual replay changes only declared variables | controlled L0/L2 example exists | invariance tests and receipt comparison | audit pending |
| Evidence class is not upgraded by downstream execution | architectural rule exists | negative tests and documentation | audit pending |
| Contribution differs materially from generic business rules engines and oracle systems | plausible | related-work matrix and explicit differentiation | not started |

## B. Controlled evaluation matrix

| Evaluation family | Minimum case | Strong ICDLT target | Current state |
|---|---|---|---|
| Admission blocking | one provenance failure | multiple independent gate failures and combinations | known flagship only; audit needed |
| Quantity binding | one binding ceiling | each ceiling binds in at least one case; deterministic ties tested | examples exist; systematic matrix needed |
| Counterfactual invariance | L0 to L2 context change | multiple single-variable replays with identity checks | flagship exists; broader tests needed |
| Settlement stress | 100%, 40%, 0% capacity | threshold sweeps and edge cases | examples exist; matrix needed |
| Revision lineage | none required for current flagship | evidence correction and policy-version replay | incomplete/planned |
| Anti-reuse | conceptual | duplicate identity/cancellation tests | incomplete/planned |
| Invalid/missing data | basic rejection behavior | malformed, missing, stale, and inconsistent input classes | unknown; audit needed |
| Determinism | repeated identical run | repeated runs across environments and release artifact | unknown; audit needed |
| Performance | not central for BCK | measured latency/throughput only if claimed | no claim should be made without measurement |

## C. Baseline and comparison requirements

A technical paper must explain why the contribution is not reducible to existing categories.

| Comparison class | Question | Required output |
|---|---|---|
| Generic rules engine | What do typed evidence, quantity, settlement, and receipt semantics add? | feature/semantic comparison table |
| Smart-contract access control | Why is admission not ordinary permission checking? | conceptual and object-model distinction |
| Blockchain oracle | Why does data delivery not establish admissibility or authorized quantity? | evidence-to-authority boundary comparison |
| RWA tokenization | Which issuance, anti-reuse, and settlement assumptions are made explicit? | lifecycle comparison |
| Computational law / policy-as-code | What financial quantity and settlement semantics are novel? | related-work synthesis |
| Provenance systems | What decision and binding-limit semantics go beyond lineage recording? | contribution comparison |
| Digital twin / energy certificate systems | Which institutional functions are represented and which are out of scope? | bounded domain comparison |

## D. Artifact readiness

| Artifact | Requirement | Current indication | Status |
|---|---|---|---|
| Frozen software release | exact commit/tag for paper | branch exists; paper release not frozen | not ready |
| Installation/reproduction guide | external user can reproduce flagship | README is strong but package-specific path needed | partial |
| Controlled input bundle | exact case/evidence/context/policy/calculator inputs | repository contains cases; package export needed | partial |
| Decision receipt bundle | exact blocked, bounded, and settlement receipts | demo values known; export/hash needed | partial |
| Test result archive | command, environment, complete output | unknown | audit pending |
| Artifact hashes | stable submitted files | not created | not ready |
| Public archive | immutable or versioned release | GitHub available; archival release decision needed | partial |
| License and data boundaries | reviewers understand what is open and controlled | repository docs likely contain boundaries | audit pending |

## E. Threat and failure model

The technical paper should evaluate declared boundaries, not claim universal security.

| Threat/failure | Expected system behavior | Evidence needed |
|---|---|---|
| unsigned or insufficient-provenance evidence | block admission | negative test and receipt |
| stale evidence | block or restrict according to declared policy | policy test |
| duplicate evidence/claim identity | block reuse or require cancellation state | P3 implementation/test |
| policy version change | new decision identity with preserved lineage | replay test |
| calculator/model version change | new result identity and explicit difference | replay test |
| settlement capacity shortfall | partial/shortfall state remains visible | stress receipt |
| administrator override | explicitly out of current enforcement scope unless modeled | limitation or governance audit event |
| false but well-signed physical data | not solved by signature alone | explicit non-claim and evidence-provider boundary |

## F. Paper-ready figure candidates

1. Typed lifecycle: evidence → policy → admission → quantity → decision → settlement → receipt.
2. Decision identity and lineage object graph.
3. Evaluation matrix showing which gate or ceiling determines each case.
4. Counterfactual receipt comparison.
5. Settlement stress transition.

ICDLT likely needs three or four technical figures/tables. BCK can use two.

## G. Route-scoring rubric

Score each item 0–2 after audit.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Technical novelty | unclear/generic | plausible | explicit and defensible |
| Evaluation breadth | one demo | several cases | systematic matrix |
| Reproducibility | internal only | documented | clean external reproduction |
| Related work | absent | partial | complete comparison |
| Artifact stability | moving branch | candidate release | frozen release and hashes |
| Manuscript independence | depends on FTSID | partly independent | stands alone technically |
| Overlap safety | high risk | manageable | clearly distinct |
| Venue compliance | unknown | mostly clear | complete checklist |

### Interpretation

- **13–16:** pursue ICDLT full paper;
- **9–12:** likely use BCK, unless highest-priority gaps can be closed rapidly;
- **0–8:** do not force an August technical submission.

## Immediate audit actions

1. enumerate test files and commands;
2. reproduce the L0, L2, and settlement-stress receipts from a clean environment;
3. enumerate every admission gate and quantity ceiling with at least one test case;
4. inspect deterministic ID and tie behavior;
5. identify missing-data, stale-data, and invalid-input tests;
6. create the related-work matrix;
7. score the route rubric and record the decision.

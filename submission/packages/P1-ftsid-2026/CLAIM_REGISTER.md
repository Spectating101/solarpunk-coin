# P1 Claim Register — `P1-FTSID-2026-001`

**Status:** claim-freeze candidate; empirical, benchmark, external-case, and review entries remain gated by exact evidence  
**Version:** 0.2  
**Date:** 2026-08-07

## Status vocabulary

| Status | Meaning |
|---|---|
| **A — architectural** | supported as programme theory or design architecture, not empirical evidence |
| **I — institutional** | supported by identified institutional sources and bounded inference |
| **T — technical** | supported by frozen implementation and reproducible artifacts |
| **E — empirical verified** | reproduced and approved for final manuscript use |
| **R — externally reviewed** | reviewed under a frozen scope with findings, dispositions, and closure |
| **P — provisional** | plausible or implemented in part but not yet fully audited, reproduced, reviewed, or permissioned |
| **X — forbidden** | must not be claimed from current evidence |

A claim may combine types only when each type’s evidence exists. Payment, institutional use, publication, benchmark conformance, source assurance, and external review remain separate evidence states.

## Core claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-001 | Energy does not discipline a digital financial claim merely because it is physically real or economically informative. | A | research foundation and literature | central proposition |
| FTS-002 | Signal, evidence, authority, quantity, settlement, and money are analytically distinct stages with separate failure modes. | A | research foundation and architecture | central framework |
| FTS-003 | A useful indicator does not prove that a specific event or asset exists. | A | conceptual argument and examples | boundary: signal/evidence |
| FTS-004 | Trustworthy evidence does not by itself authorize issuance or another financial action. | A/I | institutional and legal/technical distinctions | boundary: evidence/authority |
| FTS-005 | Authorized admission does not determine the maximum permitted quantity unless comparable ceilings and uncertainty rules are explicit. | A/T | CL semantics and controlled cases | boundary: authority/quantity |
| FTS-006 | A permitted claim does not establish that the resulting obligation can settle. | A/T | settlement architecture and stress replay | boundary: quantity/settlement |
| FTS-007 | A constrained financial claim does not become money without evidence of circulation, liquidity, acceptance, unit-of-account use, and stress performance. | A | monetary literature and explicit non-claim | boundary: claim/money |
| FTS-008 | Research validity, institutional use, commercial demand, and category or standard formation are distinct proof ladders. | A | maximum-value execution programme and research-method literature | programme interpretation |

## ECI claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-101 | ECI is a purpose-indexed empirical-admissibility layer, not an automatic issuance score. | A | research foundation and ECI specification | empirical framework |
| FTS-102 | ECI must assess physical grounding, specificity, temporal validity, timeliness, and decision relevance before a signal receives operational weight. | A/P | ECI method specification and literature | method |
| FTS-103 | Empirical findings may justify bounded evidentiary relevance without establishing physical truth, ownership, delivery, issuance authority, or money. | A | claim-boundary architecture | interpretation rule |
| FTS-104 | Only reproduced, status-labeled ECI results may enter the final paper as empirical findings. | A | result-ledger governance | research integrity |
| FTS-105 | Aggregate, sector, modeled, and site-level evidence classes support different inferences and permitted actions. | A/I | ECI classification and institutional evidence | evidence hierarchy |
| FTS-106 | The final paper contains at least one audited empirical result demonstrating how purpose changes admissibility. | P | result-ledger audit | optional empirical contribution; remove if gate fails |

## Constrained Ledger claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-201 | Credible evidence-gated claims require jointly specified evidence reliability, rule-bound issuance and anti-reuse, uncertainty treatment, settlement, and limited governance. | A | CL architecture and literature | institutional contribution |
| FTS-202 | Downstream engineering cannot upgrade the evidence class that entered the system. | A/T | architecture and controlled examples | design principle |
| FTS-203 | Admission gates and quantity ceilings must remain separate because blocked cases should not proceed to quantity evaluation. | T | implementation and receipts | executable semantics |
| FTS-204 | Comparable quantity ceilings can be evaluated and the deterministic minimum or tie set attributed as binding. | T | implementation and test artifacts | quantity semantics |
| FTS-205 | Evidence identity, analytical context, policy, calculator, and decision identity must remain separately versioned to support reproducible comparison. | T | implementation and receipt model | lineage contribution |
| FTS-206 | Anti-reuse and claim identity are necessary to prevent the same evidentiary basis from authorizing duplicate claims within the declared system boundary. | A/P | architecture; completed lifecycle evaluation needed for stronger claim | anti-reuse contribution |
| FTS-207 | Behavioral conformance levels must remain separate from source-assurance levels because software correctness cannot certify external physical truth. | A/T | benchmark specification and provenance architecture | benchmark boundary |

## Norway claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-301 | Norway's electricity-data, certificate, and flexibility processes separate evidence status, authorization, quantity, identity, cancellation, admission, delivery, and correction functions. | I | frozen Norway source and claim register | comparative grounding |
| FTS-302 | Elhub evidence states illustrate that measured, estimated, provisional, final, and corrected data should not be treated as equivalent. | I | Elhub sources | evidence-state example |
| FTS-303 | GO/NECS processes illustrate that issuance authority, standardized quantity, registry identity, and cancellation are distinct institutional functions. | I | GO/NECS sources | identity/anti-reuse example |
| FTS-304 | Flexibility-market registration or prequalification does not itself prove later delivery or settlement. | I | market/process sources | admission/delivery boundary |
| FTS-305 | These institutional processes support bounded CL–ECI design inferences but do not validate the software, endorse the programme, or prove energy-backed money. | I/X boundary | source map and explicit limitations | limitation |

## Policy Lab and controlled demonstration claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-401 | Policy Lab represents cases, evidence, context, policies, calculators, decisions, settlement results, and receipts as inspectable versioned objects. | T | frozen code, schemas, and documentation | executable method |
| FTS-402 | Under the controlled TYN case and pilot policy, L0 assurance is blocked by the minimum-provenance rule and quantity evaluation does not execute. | T | reproducible receipt | controlled result |
| FTS-403 | Changing only the declared assurance context to L2 while preserving evidence identity produces a bounded 126-unit decision in which provenance-policy capacity binds. | T | reproducible counterfactual receipt | controlled result |
| FTS-404 | Applying the declared 40% settlement-capacity stress to the 126-unit obligation produces 50.4 covered and 75.6 shortfall. | T | reproducible settlement receipt | controlled result |
| FTS-405 | The controlled sequence demonstrates representation and deterministic execution, not independent validation, legal authority, production readiness, or monetary performance. | T/X boundary | artifact labels and limitations | interpretation rule |
| FTS-406 | A reviewer can reproduce the flagship decisions from declared inputs, policy, calculator, and release identities. | P | clean external reproduction path and hashes | reproducibility claim |
| FTS-407 | Conformance Benchmark v1 defines a versioned C0–C2 behavioral baseline mapped to exact integrity, decision, and capsule tests. | T/P | merged specification; executable benchmark PR and validation report | technical evaluation method |
| FTS-408 | The reference implementation passes Conformance Benchmark v1 C0–C2. | P | archived clean and second-environment successful reports | optional evaluation result |

## External-case claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-451 | The custody-first intake path can accept attributable external source artifacts while preserving file identity, permission, semantic mapping, L0 source state, and privacy boundaries. | P | completed External Case 001 | optional external evaluation |
| FTS-452 | A correctly blocked external case is a valid pipeline result because the system is required to preserve evidence deficiencies rather than manufacture admission. | A/T | external-case protocol and completed case interpretation | method boundary |
| FTS-453 | External Case 001 demonstrates source-independent operation but does not by itself establish physical meter certification, legal authority, commercial demand, or repeatability. | P/X boundary | completed case, factual review, and non-claims | optional limitation |
| FTS-454 | A source scaffold, public-data exercise without factual review, or controlled operator-shaped fixture is not External Case 001 validation. | A/T | issue #26 acceptance criteria and evidence taxonomy | integrity boundary |

## Independent-review claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-471 | A frozen set of programme artifacts has undergone independent domain review with findings, dispositions, and corrections. | P | closed domain-review record | optional credibility statement |
| FTS-472 | A frozen set of programme artifacts has undergone independent technical review with findings, dispositions, and corrections. | P | closed technical-review record | optional credibility statement |
| FTS-473 | External review applies only to the recorded scope and does not imply certification, endorsement, or approval. | A | external review protocol | interpretation boundary |

## Discussion and implication claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-501 | The integrated architecture can be used as a pre-deployment research method for identifying unsupported transitions in evidence-dependent financial systems. | A/T | integrated argument and artifacts | practical implication |
| FTS-502 | The architecture generalizes beyond energy only at the level of evidence-gated institutional design; domain-specific evidence and law must be re-established for each application. | A | scope statement | generalizability boundary |
| FTS-503 | The project's strongest present contribution is assurance and institutional constraint, not a completed currency or market. | A | integrated programme assessment | conclusion |
| FTS-504 | External validity, institutional use, willingness to pay, and ecosystem formation must be evaluated separately and may produce different verdicts. | A | maturity programme and discovery protocol | programme implication |

## Forbidden claims

| Claim ID | Forbidden claim | Reason |
|---|---|---|
| FTS-X01 | Energy is already money or should replace fiat currency. | no monetary-performance evidence |
| FTS-X02 | Any macro or sector electricity series authorizes issuance. | signal/evidence/authority boundary |
| FTS-X03 | Bitcoin is backed by electricity because mining consumes energy. | expenditure does not establish backing or settlement |
| FTS-X04 | Satellite or modeled resource data prove site-level generation. | evidence-class overclaim |
| FTS-X05 | A digital signature proves physical truth, ownership, or delivery. | signature authenticates declared digital action, not all external facts |
| FTS-X06 | Norway validates, deploys, or endorses CL–ECI or Policy Lab. | comparative evidence only |
| FTS-X07 | Deterministic code proves economic correctness, legal enforceability, or production security. | technical boundary |
| FTS-X08 | The prototype demonstrates adoption, liquidity, stable value, convertibility, or crisis performance. | absent evidence |
| FTS-X09 | Passing the founding benchmark makes the programme a neutral or industry standard. | independent implementations, users, contributors, and governance are absent |
| FTS-X10 | External Case 001 proves repeatable institutional or commercial demand. | one case cannot establish repeatability or demand |
| FTS-X11 | Independent review certifies or endorses the programme beyond the frozen review scope. | review and authority boundary |
| FTS-X12 | A grant, competition, incubator discussion, or expression of interest establishes company valuation. | funding opportunity and valuation are distinct |

## Immediate audit queue

1. map every manuscript section to `SECTION_CLAIM_MAP.md` claim IDs;
2. create the package-local source/literature register;
3. link FTS-106 to the minimum audited empirical result set or remove it;
4. freeze source IDs for FTS-301 through FTS-305;
5. export receipts for FTS-402 through FTS-404;
6. complete the clean reproduction path before FTS-406;
7. archive successful benchmark reports before FTS-408;
8. include FTS-451–453 only after issue #26 and permission close;
9. include FTS-471–472 only after exact external-review closure;
10. prevent every `FTS-X*` claim during drafting, review, presentation, and conclusion.
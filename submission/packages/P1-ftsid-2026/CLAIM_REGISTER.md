# FTSID Claim Register — `P1-FTSID-2026-001`

**Status:** seeded from authoritative research architecture; empirical entries remain subject to result-ledger audit  
**Version:** 0.1  
**Date:** 2026-08-05

## Status vocabulary

| Status | Meaning |
|---|---|
| **A — architectural** | supported as programme theory or design architecture, not empirical evidence |
| **I — institutional** | supported by identified institutional sources and bounded inference |
| **T — technical** | supported by frozen implementation and reproducible artifacts |
| **E — empirical verified** | reproduced and approved for final manuscript use |
| **P — provisional** | plausible but not yet fully audited or reproduced |
| **X — forbidden** | must not be claimed from current evidence |

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

## ECI claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-101 | ECI is a purpose-indexed empirical-admissibility layer, not an automatic issuance score. | A | research foundation and ECI specification | empirical framework |
| FTS-102 | ECI must assess physical grounding, specificity, temporal validity, timeliness, and decision relevance before a signal receives operational weight. | A/P | ECI method specification and literature | method |
| FTS-103 | Empirical findings may justify bounded evidentiary relevance without establishing physical truth, ownership, delivery, issuance authority, or money. | A | claim-boundary architecture | interpretation rule |
| FTS-104 | Only reproduced, status-labeled ECI results may enter the final paper as empirical findings. | A | result-ledger governance | research integrity |
| FTS-105 | Aggregate, sector, modeled, and site-level evidence classes support different inferences and permitted actions. | A/I | ECI classification and institutional evidence | evidence hierarchy |
| FTS-106 | The final paper contains at least one audited empirical result demonstrating how purpose changes admissibility. | P | result-ledger audit | required empirical contribution |

## Constrained Ledger claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-201 | Credible evidence-gated claims require jointly specified evidence reliability, rule-bound issuance and anti-reuse, uncertainty treatment, settlement, and limited governance. | A | CL architecture and literature | institutional contribution |
| FTS-202 | Downstream engineering cannot upgrade the evidence class that entered the system. | A/T | architecture and controlled examples | design principle |
| FTS-203 | Admission gates and quantity ceilings must remain separate because blocked cases should not proceed to quantity evaluation. | T | implementation and receipts | executable semantics |
| FTS-204 | Comparable quantity ceilings can be evaluated and the deterministic minimum or tie set attributed as binding. | T | implementation and test artifacts | quantity semantics |
| FTS-205 | Evidence identity, analytical context, policy, calculator, and decision identity must remain separately versioned to support reproducible comparison. | T | implementation and receipt model | lineage contribution |
| FTS-206 | Anti-reuse and claim identity are necessary to prevent the same evidentiary basis from authorizing duplicate claims within the declared system boundary. | A/P | architecture; completed lifecycle implementation needed for stronger claim | anti-reuse contribution |

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

## Discussion and implication claims

| Claim ID | Proposed claim | Type/status | Required support | Manuscript role |
|---|---|---|---|---|
| FTS-501 | The integrated architecture can be used as a pre-deployment research method for identifying unsupported transitions in evidence-dependent financial systems. | A/T | integrated argument and artifacts | practical implication |
| FTS-502 | The architecture generalizes beyond energy only at the level of evidence-gated institutional design; domain-specific evidence and law must be re-established for each application. | A | scope statement | generalizability boundary |
| FTS-503 | The project's strongest present contribution is assurance and institutional constraint, not a completed currency or market. | A | integrated programme assessment | conclusion |

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

## Immediate audit queue

1. map each final section to claim IDs;
2. link FTS-106 to the minimum audited empirical result set;
3. freeze source IDs for FTS-301 through FTS-305;
4. export receipts for FTS-402 through FTS-404;
5. complete the external reproduction path for FTS-406;
6. prevent all `FTS-X*` claims during drafting and review.

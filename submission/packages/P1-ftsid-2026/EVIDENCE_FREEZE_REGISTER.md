# P1 Evidence Freeze Register

**Package:** `P1-FTSID-2026-001`  
**Status:** active evidence audit  
**Version:** 0.1  
**Date:** 2026-08-07  
**Purpose:** identify the exact evidence required for every central manuscript layer and prevent provisional, controlled, institutional, or external evidence from being silently promoted.

---

## 1. Freeze states

| State | Meaning |
|---|---|
| `REQUIRED` | central to the paper; manuscript cannot ship without it or claim removal |
| `AVAILABLE — AUDIT NEEDED` | artifact exists but claim/reproduction/source audit is incomplete |
| `FROZEN` | identity, version, source, and permitted claim are fixed |
| `OPTIONAL` | may improve the paper but cannot carry the central contribution |
| `BLOCKED — EXTERNAL` | depends on data, permission, review, or authority outside the repository |
| `BLOCKED — INTERNAL` | repository work is incomplete |
| `REMOVED` | excluded from the manuscript rather than overstated |

---

## 2. Central evidence inventory

| Evidence ID | Layer | Required artifact | Current state | Permitted use now | Freeze action |
|---|---|---|---|---|---|
| P1-EV-001 | boundary doctrine | research foundation and approved terminology chain | `FROZEN` | architectural proposition | confirm exact section and figure terminology |
| P1-EV-002 | literature | purpose-tagged source register | `REQUIRED` | no final literature claim without source role | create package-local literature/source register |
| P1-EV-003 | ECI method | ECI specification and evidence-class definitions | `AVAILABLE — AUDIT NEEDED` | framework only | reconcile historical definitions with research foundation |
| P1-EV-004 | ECI result | minimum reproduced empirical result set | `BLOCKED — INTERNAL` | none as verified empirical finding | select, rerun, and promote exact result IDs or remove FTS-106 |
| P1-EV-005 | CL architecture | schemas, policy semantics, and object boundaries | `AVAILABLE — AUDIT NEEDED` | technical architecture | freeze release and exact paths |
| P1-EV-006 | Norway | source and claim register extract | `AVAILABLE — AUDIT NEEDED` | bounded institutional claims | freeze exact source IDs for FTS-301–305 |
| P1-EV-007 | controlled blocked decision | TYN/OPS controlled case receipt at honest L0 | `AVAILABLE — AUDIT NEEDED` | controlled technical result | export and verify exact receipt/capsule |
| P1-EV-008 | controlled bounded decision | declared assurance counterfactual and binding ceiling | `AVAILABLE — AUDIT NEEDED` | controlled counterfactual result | freeze evidence identity, policy, calculator, decision |
| P1-EV-009 | controlled settlement stress | 40% declared settlement-capacity result | `AVAILABLE — AUDIT NEEDED` | modeled settlement stress | freeze settlement object and arithmetic reproduction |
| P1-EV-010 | clean reproduction | independent clean-environment receipt/capsule replay | `BLOCKED — INTERNAL` | no FTS-406 claim | run, archive, and record environment/hashes |
| P1-EV-011 | conformance baseline | C0–C2 manifest and successful report | `BLOCKED — INTERNAL` | benchmark specification only | validate PR #34 in clean and second environments |
| P1-EV-012 | external case | completed External Case 001 package | `BLOCKED — EXTERNAL` | protocol and blocker only | complete issue #26 and source-holder review |
| P1-EV-013 | external review | domain and technical findings/closure | `BLOCKED — EXTERNAL` | none as reviewed evidence | freeze review package after Case 001/benchmark |
| P1-EV-014 | monetary performance | circulation, liquidity, acceptance, stability, redemption, stress evidence | `REMOVED` | explicit absence only | retain forbidden-claim boundary |
| P1-EV-015 | market/adoption | customer, institutional use, payment, or recurring demand | `REMOVED` | not relevant to core paper | keep outside manuscript except limitations/future work |

---

## 3. Claim-to-evidence gate

| Claim group | Required evidence IDs | Current manuscript status |
|---|---|---|
| FTS-001–007 | P1-EV-001, P1-EV-002 | architectural drafting permitted; citations not frozen |
| FTS-101–105 | P1-EV-003, P1-EV-002 | framework drafting permitted after terminology audit |
| FTS-106 | P1-EV-004 | prohibited until empirical promotion |
| FTS-201–205 | P1-EV-005, P1-EV-002 | technical/institutional drafting permitted after release freeze |
| FTS-206 | P1-EV-005 plus lifecycle evaluation | architectural strength only |
| FTS-301–305 | P1-EV-006 | prohibited from final prose until source IDs freeze |
| FTS-401 | P1-EV-005 | permitted after release identity freeze |
| FTS-402 | P1-EV-007 | controlled result only after receipt verification |
| FTS-403 | P1-EV-008 | counterfactual result only after identity freeze |
| FTS-404 | P1-EV-009 | modeled stress only after settlement replay |
| FTS-405 | P1-EV-007–009 | required interpretation boundary |
| FTS-406 | P1-EV-010 | prohibited until clean reproduction |
| External-case extension | P1-EV-012 | optional; prohibited until M1 closure |
| Benchmark statement | P1-EV-011 | specification only until successful archived report |
| Reviewed claim | P1-EV-013 | prohibited until exact review closure |

---

## 4. Minimum empirical result gate

P1 must not carry unreproduced numerical findings merely to satisfy an “empirical” label.

Select a result only when:

- source data and licence are identified;
- code path is executable;
- transformation and sample rules are explicit;
- exact result ID exists;
- output is reproduced;
- robustness and limitations are recorded;
- claim text is no stronger than the result;
- final table/figure can be regenerated.

If no result meets this gate by manuscript freeze:

1. remove FTS-106;
2. present ECI as the empirical-admissibility framework;
3. keep the paper’s primary contribution institutional and executable;
4. preserve empirical results for a later audited paper.

---

## 5. External Case 001 decision gate

### Include only when

- source is attributable and permissioned;
- original identity is preserved;
- semantic mapping and diagnostics close;
- actual assurance remains exact;
- policy and settlement paths reproduce;
- receipt/capsule closure passes;
- source-holder factual review closes;
- public manuscript use is authorized;
- case is complete before the manuscript evidence cutoff.

### Exclude when

- permission is private only;
- source-holder review is incomplete;
- semantics remain materially unresolved;
- the case exists only as a scaffold;
- inclusion would force deadline-driven overclaim;
- the paper remains stronger and cleaner without the late case.

Exclusion from P1 does not reduce the case’s programme value.

---

## 6. Benchmark statement gate

Before P1 states that the reference implementation passes C0–C2:

- benchmark manifest version is frozen;
- exact branch/release is identified;
- full selected suite passes;
- plan and report are archived;
- environment is recorded;
- second-environment run exists;
- skipped or modified cases are disclosed;
- reference-implementation and neutral-standard boundaries are explicit.

Until then, write only that Conformance Benchmark v1 has been specified and partially mapped to existing tests.

---

## 7. Figure and table freeze

| Output | Evidence dependency | Current state |
|---|---|---|
| Figure 1 — boundary chain | P1-EV-001 | specification needed |
| Figure 2 — ECI admissibility map | P1-EV-003 | terminology audit needed |
| Figure 3 — institutional/object architecture | P1-EV-005, P1-EV-006 | source and release freeze needed |
| Figure 4 — controlled decision sequence | P1-EV-007–009 | receipt export needed |
| Table 1 — boundary failure modes | P1-EV-001, P1-EV-002 | literature mapping needed |
| Table 2 — Norway institutional comparison | P1-EV-006 | source-ID freeze needed |
| Table 3 — controlled evaluation | P1-EV-007–009 | reproduction needed |
| Optional Table 4 — External Case 001 | P1-EV-012 | M1 closure and permission needed |

No visual is final merely because it is polished.

---

## 8. Evidence cutoff record

Before full manuscript drafting, record:

- evidence cutoff date;
- included result IDs;
- included Norway source IDs;
- software release SHA/tag;
- receipt/capsule identities;
- benchmark state;
- External Case 001 inclusion decision;
- excluded provisional evidence;
- unresolved blockers;
- person approving the freeze.

After cutoff, new evidence enters only through a documented revision decision. This prevents the manuscript from changing ontology or claims during formatting.
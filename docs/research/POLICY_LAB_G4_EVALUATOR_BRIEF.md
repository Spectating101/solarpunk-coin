# Policy Lab G4 Evaluator Brief

**Status:** evaluator-facing evidence path for the first landed public-source case  
**Canonical case:** `PUB-AUSGRID-001P`  
**Purpose:** make the external-evidence claim inspectable without enlarging it

## One-sentence claim

Policy Lab takes a bounded outside evidence object, preserves its assurance limits, applies versioned deterministic rules, and shows how far the proposed claim can travel before a stricter policy or unresolved research boundary stops it.

## 30-second path

1. Start from the exact public Ausgrid archive bytes pinned by SHA-256.
2. Use one de-identified seven-day window: 336 half-hour intervals.
3. Preserve actual assurance at **L0**; do not promote public availability into trusted operator provenance.
4. Run the same evidence under two declared policies:
   - `LAB-CASE-OPEN-004` → **ADMIT_WITH_LIMIT**, maximum **33.066 kWh**;
   - `ENERGY-CASE-PILOT-005` → **BLOCKED** by `SIGNED_EVIDENCE` and `MIN_PROVENANCE`.
5. Verify the receipt/capsule and deterministic replay.
6. Read the derived `ConstrainedClaimAssessment` to see which research boundaries remain open.

The result is useful precisely because the stricter policy refuses evidence that the research policy can still inspect.

## Three-minute path

### 1. Source and transformation boundary

The case uses Ausgrid Solar Home Electricity Data from a pinned public mirror. The workflow verifies the exact archive SHA-256 and byte length before execution. Historical Ausgrid-hosted bytes are not claimed to have been independently matched to the mirror, and no source-holder interaction occurred.

Observed source channels are:

- `GG`: gross solar generation in half-hour kWh;
- `GC`: general consumption in half-hour kWh;
- `CL`: controlled-load consumption in half-hour kWh.

The case derives only:

```text
surplus_kwh = max(GG - (GC + CL), 0)
```

That quantity is explicitly **not** described as a directly metered export channel.

### 2. Evidence and assurance

The evidence envelope preserves the bounded measurement window, interval rows, source identity, diagnostics, evidence hash, and declared warnings. Public publication and hash custody do not promote assurance above L0.

### 3. Policy consequence

The same evidence is evaluated without changing the source or the policies.

The open research policy admits only the evidence-backed capacity. The pilot policy blocks because its signed-evidence and minimum-provenance requirements are not met.

This is the central Policy Lab demonstration:

```text
same outside evidence
→ same normalized object
→ different declared policy
→ different deterministic consequence
```

### 4. Settlement scenario

For the admitted open-policy quantity, the case exercises a declared 40% settlement-capacity stress scenario. The result is `PARTIAL`, with covered and shortfall quantities reported separately.

This is a deterministic accounting/mechanism demonstration, not real legal settlement or redemption.

### 5. Four-boundary assessment

The derived assessment does not rewrite the engine. It maps the frozen runtime artifacts onto the research framework:

- **R1 — economic information:** `NOT_ASSESSED` by this case runtime;
- **R2 — claim-level evidence:** expected to remain `PARTIAL` for this public L0 case because claim-level evidence exists but trusted source-holder/operator attribution is not established;
- **R3 — binding constraint:** `PARTIAL`; rule-bound issuance is evidenced, while pricing, settlement enforceability, and bounded governance remain open or only mechanically represented;
- **R4 — monetary performance:** `UNTESTED`.

A positive status at one boundary never cascades to the next.

## Ten-minute verification path

A skeptical evaluator should be able to:

1. inspect the source hash and byte-length check in the dedicated Ausgrid workflow;
2. inspect the bounded source derivation and evidence envelope;
3. compare the open and pilot `DecisionResult` objects;
4. inspect the declared settlement result;
5. verify the decision receipt and research capsule;
6. reproduce the deterministic decision from the portable artifact set;
7. inspect `constrained-claim-assessment.json` and trace every boundary status to basis references;
8. confirm that raw interval evidence is not silently promoted into source truth, legal authority, or money.

## Score-relevant evidence now available

The landed evidence supports claims about:

- outside-data operability for one bounded public-source case;
- exact byte/hash custody of the executed mirror object;
- explicit source semantics and declared transformations;
- actual L0 preservation;
- deterministic policy divergence;
- quantity ceilings and binding-constraint attribution;
- settlement-shortfall mechanics under a declared scenario;
- receipt/capsule integrity and deterministic replay;
- a derived R1–R4 assessment that exposes what remains untested.

## Explicit non-claims

This case does **not** establish:

- identity with the historical Ausgrid-hosted archive bytes;
- source-holder or operator confirmation;
- physical meter certification;
- L1/L2 assurance;
- legal issuance authority;
- enforceable settlement or redemption;
- economically optimal policy or pricing;
- bounded governance;
- production security or commercial readiness;
- market demand, circulation, liquidity, acceptability, unit-of-account use, or money;
- completion of the original owner/operator Gate 1B.

## Evaluator question

The intended evaluation question is not “does this prove an energy-backed currency?”

It is:

> **Can this system take an outside energy-evidence object, preserve what is and is not known about it, apply explicit constraints reproducibly, and make the stopping point inspectable?**

For `PUB-AUSGRID-001P`, the answer should be testable directly from the artifacts rather than from presentation copy.

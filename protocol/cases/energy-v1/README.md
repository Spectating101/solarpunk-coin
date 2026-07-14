# Energy Reference Cases v1

This directory is the first canonical case pack for the case-based research workbench.

It is a **controlled mechanism and decision-structure demonstration**. It is not a realized geospatial performance study, operator pilot, mint authorization, or production risk validation.

## Cases

| Case | Modeled location | Controlled evidence total | Resource context |
|---|---|---:|---|
| `TYN-001` | Taoyuan | 180 kWh eligible surplus | PVWatts / NSRDB PSM V3 Himawari TMY baseline |
| `AUS-001` | Austin | 500 kWh eligible surplus | PVWatts / NSRDB PSM V3 GOES TMY baseline |
| `PHX-001` | Phoenix | 320 kWh eligible surplus | PVWatts / NSRDB PSM V3 GOES TMY baseline |

The resource values reuse the committed three-site baseline documented in [`docs/product/NREL_SOLAR_TRAINING_LAB.md`](../../../docs/product/NREL_SOLAR_TRAINING_LAB.md). That upstream artifact records three sites and 1,095 daily modeled rows. No PVWatts API refresh is required to evaluate this case pack.

## Four semantic categories

Every case must preserve these distinctions:

```text
OBSERVED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

For this case pack specifically:

- the interval evidence files are **controlled sample fixtures**;
- their `signed` capability exists only to exercise policy gates and is explicitly not trusted-operator verification;
- PVWatts annual AC values are **modeled TMY resource context**;
- `policy-manifest.v2` rules are **declared policy**;
- admission decisions, quantity ceilings, binding attribution, and decision IDs are **derived results**.

Do not describe the sample evidence as real operator data.

Do not describe PVWatts output as observed production for the May 2026 case window.

## Assurance scenarios

The base scenario classifies the controlled fixture under sample/uncorroborated conditions.

The L1, L2, and L4 files are **declared assurance counterfactuals**. They intentionally keep `observed_evidence_changed: false`.

A counterfactual answers:

> What would the selected policy do if the same evidence identity were evaluated under a declared higher-assurance context?

It does **not** claim that the evidence has actually been upgraded, that a real gateway exists, or that utility corroboration has been obtained.

The intended UI language is:

```text
COUNTERFACTUAL ASSURANCE SCENARIO
```

not:

```text
UPGRADED EVIDENCE
```

## Initial policy questions

The pack supports four bounded questions:

1. How does declared evidence-assurance context change admission under otherwise unchanged case inputs?
2. Which applicable quantity ceiling binds under the same policy across the three modeled resource contexts?
3. How do open, pilot, and strict policies change admission or maximum permitted quantity?
4. After a bounded claim exists, what happens under an explicitly declared settlement-capacity stress?

The fourth question is implemented after the separate settlement-stress phase. Settlement is not collapsed into the admission or quantity minimum.

## Initial binding diversity

The case totals were chosen to exercise different deterministic mechanics rather than to imitate operator outcomes.

Under the current V2 policy/calculator definitions:

- `TYN-001` at the L2 assurance counterfactual under `ENERGY-CASE-PILOT-005` is expected to be **provenance-policy-capacity bound**;
- `AUS-001` at L2 under the same policy is expected to be **modeled-resource-context bound**;
- `PHX-001` under `LAB-CASE-OPEN-004` is expected to be **evidence-backed-capacity bound**;
- the L0 base scenario under the pilot policy is expected to be blocked at `MIN_PROVENANCE` before quantity evaluation.

These are conformance expectations for the research engine, not empirical performance claims.

## Data identity

Evidence hashes are recomputed from the portable evidence identity body before a V2 decision is accepted. Retaining an old `evidence_hash` after modifying source semantics, intervals, summary, or capabilities must fail closed.

Context hashes are likewise recomputed before decision evaluation.

Diagnostics and presentation metadata remain attached to evidence but are excluded from evidence identity according to the existing portable evidence contract.

## Research boundary

This pack must not be used to claim:

- location-conditioned policies improve historical coverage;
- Phoenix, Austin, or Taoyuan is empirically safer or riskier under the proposed architecture;
- the three sites form a representative global solar sample;
- a signed-capability fixture establishes a real operator or meter custody chain;
- modeled resource context can authorize issuance;
- a `DecisionResult` creates legal claim or redemption rights.

A real geospatial performance study requires a declared sampling design, realized outcome definition, time-t information rule, and prospective or out-of-sample policy evaluation.

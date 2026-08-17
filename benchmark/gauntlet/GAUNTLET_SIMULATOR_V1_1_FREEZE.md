# Gauntlet Simulator v1.1 — practical-use freeze

Status: **FROZEN FOR ROUTE-SELECTION USE**

This freeze records the assumptions and use boundaries that make Gauntlet Simulator v1.1 suitable for practical opportunity triage without turning synthetic outputs into pseudo-probabilities.

It does **not** authorize any application or submission.

## Frozen model identity

The audited PR-merge checkout was:

`f43fd099ff63af9696e479abc594c73e1eafc244`

The corresponding branch head was:

`bfbd7dbb625d309b78c1132bd360e84b73087793`

The successful venue-aware CI run used:

- model version: `0.2.0-opportunity-aware`;
- core manifest SHA-256: `82ea055aa65838c469390a96e090841bcc58a271a00811220af5a16083f8b1e0`;
- opportunity-model SHA-256: `b50ad8c275980d3b9c8bda4060658ce17d88e24348c542a25e0f7109e1036cf5`;
- 3,000 Monte Carlo trials per scored cell;
- field sizes 10, 25, 50, 100, and 250;
- byte-identical second execution required by CI.

The generic v1 calibration remains available for comparison, but route selection should use the venue-aware v1.1 path.

## Frozen decision order

```text
Opportunity
  ↓
Eligibility gate
  ↓
Semantic/category-fit gate
  ↓
Entrant population
  ↓
Official rubric where available
  ↓
Maturity expectation
  ↓
Policy Lab evidence profile
  ↓
Synthetic Monte Carlo outcome
```

No later numerical stage may repair an earlier failed gate.

## Practical interpretation rules

1. **Eligibility precedes scoring.** A failed eligibility gate means no route score.
2. **Semantic fit precedes scoring.** A technically strong project does not become AI, sociotechnical, commercial, or otherwise category-native because its generic engineering score is high.
3. **Conditional scores are counterfactual.** `CONDITIONAL_ON_GATE` means the reported percentile answers only: *if the stated fit/eligibility condition is genuinely satisfied, how does the current evidence profile behave under the modeled field and rubric?*
4. **`NOT_SCORED_CURRENT` is a successful simulator outcome.** Refusal to score is preferable to manufactured fit.
5. **Percentiles are route-local diagnostics.** They are not award probabilities, acceptance probabilities, or directly comparable prestige measures across unrelated venues.
6. **Rubric provenance must travel with the result.** `OFFICIAL_*`, `INFERRED_*`, and `PARTIALLY_MODELED_*` results have different evidentiary strength.
7. **Rubric coverage limits interpretation.** Missing team, institutional, sociotechnical, budget, milestone, or other dimensions must remain explicit in `unmodeled_criteria`; they are not silently imputed.
8. **Field populations are assumptions.** The simulator models plausible entrant distributions, not observed applicant rosters.
9. **Sensitivity is marginal-value instrumentation.** An uplift scenario asks whether a bounded improvement would matter in that route. It does not claim that the improvement exists or is cheap to obtain.
10. **Route choice beats project distortion.** A weak score may mean "do not pursue this venue," not "change Policy Lab until it fits."

## Audited v1.1 behavior

At a 50-entry field, the audited run produced the following route-local diagnostics:

| Route | Gate | Current qualitative fit | Mean percentile | Top 10% rate | Dominant loss winner |
|---|---|---|---:|---:|---|
| InnoServe ADIAI 2026 | `ACTIVE_SIMULATION` | `COMPETITIVE` | 78.5th | 23.4% | hardware / field demo |
| III AI Innovation Challenge 2026 | `CONDITIONAL_ON_GATE` | `POSSIBLE_WITH_PACKAGING` | 60.0th | 4.1% | enterprise pilot |
| FinTech Taipei Awards 2026 | `ACTIVE_SIMULATION` | `NEEDS_VALIDATION` | 16.0th | 0.0% | enterprise pilot |
| NSTC Research Entrepreneurship | `CONDITIONAL_ON_GATE` | `NEEDS_VALIDATION_HOLD` | 14.4th | 0.0% | enterprise pilot |
| Financial Cryptography 2027 | `CONDITIONAL_ON_GATE` | `STRONG_RESEARCH_POSSIBILITY` | 67.5th | 13.1% | research system |
| ACM FAccT 2027 | `CONDITIONAL_ON_GATE` | `POSSIBLE_BUT_NON_NATIVE` | 67.1th | 11.4% | research system |
| TAAI 2026 | `NOT_SCORED_CURRENT` | `LOW_PRIORITY_BAD_FIT_CURRENT` | — | — | — |

These values are retained as an audit fixture, not as forecasts.

### Interpretation of the first routes

- **InnoServe:** current profile is plausibly competitive; packaging has unusually high marginal value relative to another core subsystem.
- **III AI Challenge:** do not act on the numerical result unless a genuine score-bearing AI contribution already exists. Packaging cannot create semantic AI fit.
- **FinTech Taipei:** weak structural position at current maturity. A cheap package may still justify a low-cost submission later, but the simulator gives no reason to spend days modifying the asset.
- **NSTC Research Entrepreneurship:** current weakness is structural commercialization maturity, not presentation. Hold absent a real commercialization carrier and validation path.
- **Financial Cryptography:** research route worth preserving; the real gate is whether a sufficiently novel and rigorous research contribution can be formulated, not customer traction.
- **FAccT:** numerical output is deliberately subordinate to the sociotechnical-fit gate and only 60% rubric coverage. Do not interpret 67.1th as current venue readiness.
- **TAAI:** current semantic failure correctly stops the score. Do not bolt AI onto Policy Lab to change this result.

## Sensitivity use

The audited run confirmed that different improvements matter in different environments:

- packaging can materially help student/applied-innovation routes;
- external validation helps mixed and research routes, but does not erase structural commercialization gaps;
- pilot/adoption evidence has the largest modeled effect in commercialization-heavy environments;
- a high sensitivity delta is **not** permission to pursue that improvement if it violates the project's stop rule or creates disproportionate opportunity cost.

## Change-control rule

The frozen model should **not** accumulate venues indefinitely.

Create a new opportunity model or revise an existing one only when at least one of these is true:

1. a real opportunity is under active route-selection consideration;
2. a verified official rubric materially changes the current translation;
3. credible evidence materially changes the entrant-population or maturity expectation;
4. the Policy Lab evidence profile itself materially changes because of real external evidence, not simulator gaming;
5. a concrete audit finds a false-positive/false-negative gate or a scoring defect.

Cosmetic score tuning, adding venues for completeness, or changing assumptions merely to improve Policy Lab's rank are prohibited uses.

## External-use doctrine

For practical gauntlet triage, return a decision in this order:

```text
fit/gate status
→ modeled environment
→ route-local diagnostic
→ dominant failure mode
→ cheapest reusable improvement
→ opportunity-cost verdict
```

The simulator is strongest when it says **do not pursue**.

FinTech Taipei is the canonical example: current simulation says the structural position is weak, so the default is **only FIRE if the existing truth can be packaged cheaply**. Do not spend days turning Policy Lab into a different product.

## Non-claims

This freeze does not establish:

- real applicant composition;
- actual judge behavior;
- award or acceptance probabilities;
- superiority over named entrants;
- eligibility where marked conditional;
- semantic fit where marked conditional or failed;
- owner/operator Gate 1B;
- L1/L2 assurance;
- R1 completion;
- R4 monetary performance;
- legal authority;
- production security;
- commercial demand;
- product-market fit.

## Stop rule

**Use the simulator to select routes and identify marginal evidence value. Do not enlarge Policy Lab merely to improve simulated rankings.**

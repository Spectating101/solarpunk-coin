# Gauntlet-agent calibration — 2026-08-16

## Purpose

This record freezes the qualitative environment correction supplied by the separate gauntlet/opportunity-analysis workstream before Gauntlet Simulation v1.1 encodes it numerically.

It is **not** an application plan and does not authorize submission.

The central correction is:

> Policy Lab's technical/research strength does not carry over everywhere, but its commercial weakness does not carry over everywhere either.

The simulator must therefore model the **opportunity environment**, not assign Policy Lab one universal competition score.

## Required simulation order

```text
Opportunity
  ↓
Eligibility gate
  ↓
Semantic/category fit gate
  ↓
Entrant population
  ↓
Official rubric where available
  ↓
Maturity expectation
  ↓
Policy Lab evidence profile
  ↓
Monte Carlo result
```

A category failure must stop before weighted scoring. High technical scores cannot manufacture AI fit, sociotechnical fit, or another venue-specific contribution that is not actually present.

## First opportunity calibration

| Route | Current qualitative fit | Main thing that beats current Policy Lab | Is adoption weakness score-material? |
|---|---|---|---|
| InnoServe ADIAI | `COMPETITIVE` | polished practical student project, especially with a small pilot | moderately |
| III AI Innovation Challenge | `POSSIBLE_WITH_PACKAGING`, conditional on genuine AI contribution | genuine AI system plus strong industry narrative | moderately, but semantic AI fit comes first |
| FinTech Taipei | `NEEDS_VALIDATION` | deployed fintech or institutional/enterprise pilot | yes |
| NSTC Research Entrepreneurship | `NEEDS_VALIDATION_HOLD` | commercializable research with market proof, team, and institutional carrier | very much |
| Financial Cryptography 2027 | `STRONG_RESEARCH_POSSIBILITY` | superior scientific novelty, rigor, protocol/mechanism/system contribution | mostly no |
| ACM FAccT 2027 | `POSSIBLE_BUT_NON_NATIVE` | real sociotechnical and institutional research contribution | conventional adoption no; human/institutional grounding yes |
| TAAI 2026 | `LOW_PRIORITY_BAD_FIT_CURRENT` unless genuine AI research exists | actual AI research | adoption is not the relevant weakness |

## Population split

The generic v1 population is insufficient. The first v1.1 environment classes are:

- `student_applied_innovation`;
- `student_ai_industry`;
- `mixed_fintech_ecosystem`;
- `research_commercialization`;
- `elite_financial_security_research`;
- `sociotechnical_accountability_research`;
- `academic_ai_research`;
- `oss_research_software` reserved for later OSS/research-software routes.

The key maturity distinction is that a pilot can be extraordinary in a student field, normal in a mixed commercial field, and largely irrelevant to the central scientific contribution in an elite research venue.

## Route-specific semantic findings

### InnoServe ADIAI

Student/campus innovation. Policy Lab is already plausibly competitive because technical completeness, evidence governance, reproducibility, outside public-data operability, and defensible innovation can matter substantially. The main current weakness is practical/user-impact communication rather than a universal commercial deficit.

### III AI Innovation Challenge

The numerical model is conditional. Policy Lab must first possess a **genuine score-bearing AI contribution**. Sophisticated deterministic assurance machinery does not become AI technology because the venue is an AI competition. Do not add an LLM merely for category fit.

### FinTech Taipei

Mixed maturity: institutions, fintech firms, startups, research units, and campus teams can share the field. This is where external validation and deployment are genuinely dangerous competitive advantages. Better problem/demo packaging is cheap; real financial validation is expensive but high leverage.

### NSTC Research Entrepreneurship

Research commercialization is not the same as ordinary commercial judging. Original R&D matters, but market analysis, commercialization path, team/institutional carrier, milestones, and validation are structural expectations. Cosmetic packaging cannot fully close the present gap.

### Financial Cryptography

The strongest Policy Lab identity is evidence-governed financial-claim admission, constraint enforcement, reproducible decision receipts, and explicit assurance boundaries—not an "energy coin" pitch. Customer traction is not the central weakness; research novelty/depth and rigorous evaluation are.

### FAccT

Keyword overlap with governance, accountability, assurance, and audits is insufficient. A serious sociotechnical/social/institutional contribution is a prior fit requirement. The current eight scoring dimensions cannot fully encode that requirement, so the numerical model must expose incomplete rubric coverage.

### TAAI

Current fit fails before scoring unless actual AI research is part of the scientific contribution. No simulator score should incentivize bolting AI onto Policy Lab for entry purposes.

## Simulation boundary

The numerical translations in `opportunity-models.v1.json` are **model assumptions** derived from this qualitative calibration.

They are not official judging percentages except where the opportunity record explicitly preserves an official weighted criterion and separately labels the eight-dimensional translation.

Where criteria such as sociotechnical grounding, team quality, institutional carrier, budget quality, or milestone quality are not represented faithfully, v1.1 must surface `rubric_coverage` and `unmodeled_criteria` instead of silently inventing values.

## Strategic use

The simulator should answer:

> In which opportunity environment is the current Policy Lab evidence profile unusually strong, where does it lose, and what is the cheapest reusable change that materially shifts the outcome?

It should **not** answer:

> How do we turn Policy Lab into whatever every competition wants?

No new subsystem, AI layer, commercialization feature, external-party dependency, or application package is authorized by this calibration.

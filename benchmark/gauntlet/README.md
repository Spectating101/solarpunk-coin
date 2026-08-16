# Gauntlet Simulation v1.1

This directory stress-tests the frozen Policy Lab G4 public-evidence profile against **synthetic entry pools**.

It is intentionally **not** an award forecast, does not score named real entrants, and does not initiate any submission.

The v1 engine asked:

> If Policy Lab is judged beside many plausible competition-style projects, how robust is its rank when evaluator priorities and field size change?

v1.1 keeps that calibration but adds the missing real-world structure identified by the gauntlet agent:

```text
Opportunity
  ↓
Eligibility gate
  ↓
Semantic/category-fit gate
  ↓
Entrant population
  ↓
Official or inferred rubric
  ↓
Maturity expectation
  ↓
Policy Lab evidence profile
  ↓
Monte Carlo rank distribution
```

A numerical score is therefore no longer allowed to rescue a category mismatch.

## Core dimensions

The underlying G4 profile still uses eight visible dimensions:

- innovation;
- technical execution;
- evidence / reproducibility;
- problem value;
- demo clarity;
- external validation;
- market adoption;
- business viability.

Policy Lab is represented as a distribution rather than a fixed self-awarded score. The current G4 profile is intentionally strong on technical execution and reproducibility, moderate on problem/demo communication, and weak on external validation, adoption, and commercial evidence.

## Generic competitor archetypes

The base manifest retains seven reusable archetypes:

- polished AI SaaS demo;
- deployed fintech product;
- deep-tech prototype;
- research-heavy software system;
- sustainability analytics dashboard;
- enterprise workflow with pilot;
- hardware / field demonstration.

They are **building blocks**, not the field model itself.

`opportunity-models.v1.json` combines them into venue-specific populations with population-level maturity shifts and uncertainty scales.

## Field populations

The first gauntlet-derived environment model includes:

- `student_applied_innovation` — InnoServe-like student innovation;
- `student_ai_industry` — student AI / industry application;
- `mixed_fintech_ecosystem` — institutions, vendors, startups, R&D, and campus teams together;
- `research_commercialization` — differentiated R&D with commercialization expectations;
- `elite_financial_security_research` — high-floor scientific/technical research;
- `sociotechnical_accountability_research` — research where social/institutional grounding is central;
- `academic_ai_research` — AI research where genuine AI contribution is prerequisite;
- `oss_research_software` — reserved for open-source/research-software routes.

These populations are synthetic translations of the gauntlet agent's field analysis. They are not claims about the exact composition of any real applicant pool.

## Opportunity models

The first v1.1 routes are:

- InnoServe ADIAI 2026;
- III AI Innovation Challenge 2026;
- FinTech Taipei Awards 2026;
- NSTC Research Entrepreneurship;
- Financial Cryptography 2027;
- ACM FAccT 2027;
- TAAI 2026.

Each opportunity records:

- eligibility status;
- semantic-fit status;
- current qualitative fit from the gauntlet analysis;
- field population;
- official criteria summary where available;
- whether numerical weights are official, translated, inferred, or only partially modeled;
- rubric coverage;
- criteria the simulator deliberately leaves unmodeled;
- likely dangerous competitor archetypes;
- cheapest high-leverage improvement consistent with the project stop rule.

### Official criteria versus simulator translation

When the gauntlet handoff supplied an official weighted rubric, the file preserves that rubric text separately from the simulator's eight-dimensional translation.

For example, an official `practicality` criterion may need to be represented across problem value, validation, adoption, and viability. Those sub-weights are **our modeling assumption**, not an official judging breakdown.

When a venue does not provide numerical weights in the handoff, the simulator labels its weights `INFERRED` rather than silently presenting them as official.

## Semantic fit comes before scoring

This is the main v1.1 correction.

Examples:

- an AI competition is not a fit merely because Policy Lab is sophisticated software;
- FAccT keyword overlap with governance/accountability does not replace a real sociotechnical contribution;
- Financial Cryptography may be a strong conceptual research route, but only if the actual scientific contribution clears the venue's novelty/depth bar.

Statuses:

- `ACTIVE_SIMULATION` — current eligibility and semantic fit both pass;
- `CONDITIONAL_ON_GATE` — ranking is shown only as a counterfactual **if the stated gate is satisfied**;
- `NOT_SCORED_CURRENT` — current semantic/eligibility state stops before weighted scoring.

A `NOT_SCORED_CURRENT` route is not assigned a low fake percentile. It is simply not scored.

## Rubric coverage

The eight dimensions do not cover every possible review criterion.

v1.1 therefore exposes `rubric_coverage` and `unmodeled_criteria`.

For example, the FAccT model intentionally leaves a large portion unmodeled because sociotechnical grounding, institutional analysis, normative depth, stakeholder conflict, and human-use consequences cannot be honestly reconstructed from the current eight dimensions.

Likewise research-commercialization programmes may contain team/budget/milestone criteria that are not reducible to Policy Lab's technical profile.

## Scaling experiment

The current profile is stress-tested at:

```text
10
25
50
100
250
```

For every scored opportunity and field size the simulator reports:

- top-1 rate;
- top-3 rate;
- top-decile rate;
- mean and median percentile;
- mean margin to the best generated competitor;
- which competitor archetype most often wins when Policy Lab loses.

The generic v1 judge profiles are retained only as a calibration baseline.

## Sensitivity experiment

At a 50-entry field, every scoreable opportunity is also tested under bounded counterfactuals:

- `one_external_case_uplift` — stronger external validation without pretending it creates adoption;
- `pilot_and_adoption_uplift` — materially stronger validation, adoption, and business evidence;
- `demo_packaging_uplift` — clearer presentation without changing the evidence core.

The important output is **opportunity-specific marginal value**. A pilot should matter far more in a mixed fintech/commercialization field than in elite financial-security research; the simulator can now test that instead of averaging the venues together.

These counterfactuals are diagnostics only and must not be cited as achieved project facts.

## Determinism

The workflow executes the entire simulation twice and requires byte-identical JSON and Markdown reports.

This makes changes to field composition, rubrics, score assumptions, semantic gates, or maturity expectations explicit and reviewable rather than narrative drift.

## Run locally

```bash
node scripts/run_gauntlet_simulation_v1.mjs \
  --trials=3000 \
  --out=benchmark/gauntlet/reports
```

Optional explicit inputs:

```bash
node scripts/run_gauntlet_simulation_v1.mjs \
  --manifest=benchmark/gauntlet/gauntlet-manifest.v1.json \
  --opportunities=benchmark/gauntlet/opportunity-models.v1.json \
  --trials=3000 \
  --out=benchmark/gauntlet/reports
```

## What this simulator is for

The useful question is no longer:

> Is Policy Lab good?

It is:

> In which opportunity environment is the current evidence profile unusually strong, where does it lose, and what is the cheapest reusable change that materially shifts the outcome?

The simulator should help decide **where to compete and what evidence matters**, not turn Policy Lab into every possible type of product.

## Claim boundary

A favorable simulation does not establish:

- a real competition rank or award probability;
- superiority over any named entrant;
- eligibility where the opportunity gate remains conditional;
- semantic fit where the category gate remains conditional or failed;
- owner/operator Gate 1B;
- L1/L2 source assurance;
- legal issuance or redemption authority;
- production security;
- commercial demand;
- R1 completion;
- R4 monetary performance.

The simulator remains a **pre-entry hostile evaluation instrument**, not an application package.

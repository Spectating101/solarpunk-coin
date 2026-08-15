# Gauntlet Simulation v1

This directory stress-tests the frozen Policy Lab G4 public-evidence profile against **synthetic entry pools** under several evaluator styles.

It is intentionally **not** an award forecast and does not score named real entrants.

## Question

> If Policy Lab is judged beside many plausible competition-style projects, how robust is its rank when evaluator priorities and field size change?

The simulator is designed to answer that question without pretending we already know the actual field, the actual judges, or the exact eventual competition rubric.

## What is simulated

The manifest defines eight visible evaluation dimensions:

- innovation;
- technical execution;
- evidence / reproducibility;
- problem value;
- demo clarity;
- external validation;
- market adoption;
- business viability.

Policy Lab is represented as a distribution rather than a single self-awarded score. The current G4 profile is intentionally strong on deterministic technical execution and reproducibility, middling on problem/demo communication, and weak on external validation, adoption, and commercial evidence.

Competitors are generated from archetypes rather than named teams:

- polished AI SaaS demo;
- deployed fintech product;
- deep-tech prototype;
- research-heavy software system;
- sustainability analytics dashboard;
- enterprise workflow with pilot;
- hardware / field demonstration.

Each archetype is also sampled as a distribution, so the simulator can produce strong and weak examples rather than seven fixed strawmen.

## Evaluator profiles

Four judge profiles deliberately pull the ranking in different directions:

1. `research_technical` — heavily rewards evidence, reproducibility, technical execution, and research value;
2. `fintech_innovation` — balances novelty, implementation, problem value, presentation, validation, and business factors;
3. `commercial_fintech` — gives much more weight to adoption and business viability;
4. `regulated_skeptic` — strongly weights evidence quality and external validation.

These are stress profiles, not claims that any named competition uses exactly these weights.

## Scaling experiment

The current profile is tested in fields of:

```text
10
25
50
100
250
```

For each field size and judge profile the simulator reports:

- top-1 rate;
- top-3 rate;
- top-decile rate;
- mean and median percentile;
- mean margin to the best generated competitor;
- which competitor archetype most often wins when Policy Lab loses.

The default CI run uses 3,000 Monte Carlo trials per cell with a frozen PRNG seed.

## Sensitivity experiment

At a 50-entry field, the simulator also checks bounded counterfactuals:

- `one_external_case_uplift` — stronger external validation without pretending that this automatically creates adoption;
- `pilot_and_adoption_uplift` — a future state with materially stronger validation, adoption, and business evidence;
- `demo_packaging_uplift` — clearer presentation without changing the underlying evidence core.

These are diagnostic counterfactuals only. They do not modify the Policy Lab runtime and should not be cited as achieved project facts.

## Determinism

The workflow executes the same simulation twice and requires byte-identical JSON and Markdown reports.

This makes the gauntlet itself reproducible: changing the manifest, seed, trial count, rubric, or candidate assumptions produces an explicit new result rather than an invisible narrative shift.

## Run locally

```bash
node scripts/run_gauntlet_simulation_v1.mjs \
  --trials=3000 \
  --out=benchmark/gauntlet/reports
```

Generated reports are intentionally not treated as source truth about real competitions. The useful output is the **sensitivity structure**: which evaluator styles and competitor archetypes expose the current project, how quickly rank degrades as the field grows, and which missing evidence would actually change that result.

## Claim boundary

A favorable simulation does not establish:

- a real competition rank or award probability;
- superiority over any named entrant;
- owner/operator Gate 1B;
- L1/L2 source assurance;
- legal issuance or redemption authority;
- production security;
- commercial demand;
- R1 completion;
- R4 monetary performance.

The simulator is a pre-entry hostile evaluation instrument, not an entry package.

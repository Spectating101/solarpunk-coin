# Policy Lab — Specialized Gauntlet Expansion

**Status:** executable judge-facing adversarial package  
**Purpose:** explain what the Policy Lab-specific Gauntlet tests, what it has proved internally, and which high-value gates remain external.

The generic Gauntlet remains the venue/ranking stress test. This specialized layer does **not** replace or reweight it. It attacks the mechanism that Policy Lab specifically claims to contribute:

```text
evidence / assurance
        ↓
explicit policy admission
        ↓
quantity authority + binding rule
        ↓
settlement consequence
        ↓
reproducible identity / package
```

The central invariant is **non-promotion**: success or stronger assumptions at one layer must not silently create authority at another.

## Current executable result

The specialized runner currently reports:

```text
PASS_WITH_OPEN_EXTERNAL_GATES
```

Six machine-required attacks pass:

| ID | Challenge | Current internal result |
|---|---|---|
| PLG-01 | evidence capability non-promotion | PASS |
| PLG-02 | policy identity integrity | PASS |
| PLG-03 | quantity inflation resistance | PASS |
| PLG-04 | settlement separation | PASS |
| PLG-05 | counterfactual isolation | PASS |
| PLG-06 | policy sensitivity disclosure | PASS |

These are controlled mechanism tests. They do not become external validation simply because CI passes.

## Causal matrix — same evidence identity

The strongest controlled challenge uses `TYN-001` and preserves the same evidence hash while varying declared policy and assurance context.

| Assurance context | Open research policy | Pilot policy |
|---|---|---|
| actual L0 | `ADMIT_WITH_LIMIT` — 180 | `BLOCKED` — `MIN_PROVENANCE` |
| declared L2 counterfactual | `ADMIT_WITH_LIMIT` — 180 | `ADMIT_WITH_LIMIT` — 126 |

The L2 row is explicitly `ASSURANCE_COUNTERFACTUAL`; `observed_evidence_changed=false`. It is not a new observation and must never be described as actual L2 evidence.

The matrix demonstrates two separate causal questions:

1. **hold evidence/assurance fixed, change policy** → policy consequence changes without changing evidence identity;
2. **hold evidence identity and policy fixed, change only the declared assurance counterfactual** → the pilot policy consequence changes while observed evidence remains unchanged.

## Policy sensitivity — expose the assumption instead of hiding it

The pilot's L2 provenance multiplier is a declared research-policy assumption, not an empirically estimated finance parameter.

The specialized Gauntlet therefore runs ephemeral, non-authoritative sensitivity forks:

| L2 multiplier | Pilot admitted maximum | Binding rule |
|---:|---:|---|
| 0.5 | 90 | `PROVENANCE_POLICY_CAPACITY` |
| 0.7 | 126 | `PROVENANCE_POLICY_CAPACITY` |
| 0.9 | 162 | `PROVENANCE_POLICY_CAPACITY` |

The point is not to pick the multiplier that produces the most attractive result. The point is to make the policy dependence inspectable.

A machine-readable assumption register now classifies current thresholds, haircuts, absolute caps, admission requirements, and the 40% settlement scenario. Judge-facing material must not silently present these as regulation, market calibration, reserve capacity, price, liquidity, or empirically estimated risk parameters.

## Additional internal hardening now exercised

The specialized CI also attacks its own certification path:

- **environment determinism:** JSON and Markdown results are byte-identical under `TZ=UTC` and `TZ=Asia/Taipei` with `LANG=C`;
- **retry determinism:** deliberately truncated specialized-Gauntlet outputs are replaced by a clean deterministic rebuild identical to a fresh run;
- **external-gate anti-gaming:** every `OPEN_EXTERNAL` challenge has a frozen evidence contract and CI/traffic/controlled fixtures/AI review are explicitly excluded as validation;
- **release source closure:** a deterministic SHA-256 inventory binds the declared Policy Lab source closure to the tested revision and reproduces byte-identically;
- **legacy invariants:** the existing Financial Cryptography non-promotion tests are rerun;
- **baseline compatibility:** the existing C0–C2 conformance contract is rerun rather than replaced by the specialized suite.

The source-closure manifest is only partial release provenance. Signed release tag, SBOM, and GitHub artifact attestation remain release work; source hashing alone is not treated as a supply-chain or security certification.

## C3 / C4 readiness

Do **not** call the current project C3- or C4-certified.

### C3 — PARTIAL

Already evidenced:

- admitted bounded claim enters declared settlement stress;
- claim/settlement states are explicit;
- caller quantity cannot override the decision-bound maximum.

Still open or only partially modeled:

- exact duplicate-claim refusal;
- overlapping measurement-window anti-reuse;
- cancellation preventing cross-claim reuse;
- evidence correction and revision lineage;
- dedicated proof that a policy change requires a new decision before settlement.

### C4 — PARTIAL

Existing/internal proof includes:

- evidence tamper rejection;
- capsule tamper rejection;
- cross-object identity agreement;
- private/public package boundary;
- current-surface CI;
- cross-timezone deterministic specialized output;
- deterministic source-closure inventory;
- bounded retry proof for the specialized report builder.

Still missing:

- independent clean-room reproduction by a non-author;
- frozen signed/tagged release with the remaining release attestations;
- broader recovery proof beyond the specialized report build path;
- the unresolved C3 lifecycle requirements inherited by C4.

## External gates — frozen before the evidence arrives

The Gauntlet deliberately fixes the closure rules now so future favorable outcomes cannot move the goalposts.

### PLG-09 — independent reproduction

A non-author receives the frozen public release and instructions. The record must include environment, duration, commands/actions, interventions, expected/observed decision identities, expected/observed package identities, and the final PASS/FAIL. A failed attempt stays in the validation record.

### PLG-11 — external-source heterogeneity

A materially different attributable source must close its acquisition, permission, semantics, source identity, source-holder review, policy, decision, and reproduction contract. A second renamed public fixture does not count.

### PLG-12 — blind comprehension

Minimum five uncoached evaluators see a standardized demo and answer a fixed six-question rubric. The pass rule is fixed in advance at at least 80% correct answers across the scored questions. This measures presentation comprehension only.

### PLG-14 — practical workflow validation

At least one external actor must have an inspectable real workflow/problem where Policy Lab is requested or tested. An interview, integration request, source-provider request, shadow pilot, repeated external use, or independent research integration can close the existence gate. One workflow does not establish market demand or product-market fit.

## Standards differentiation

Policy Lab is **not** submitted as the invention of:

- policy-as-code or general rules engines;
- authorization languages;
- cryptographically verifiable credentials;
- proof-of-reserve feeds or mint circuit breakers;
- machine-readable financial contracts.

The maintained comparison against OPA, Cedar, W3C Verifiable Credentials, Chainlink Proof of Reserve, and ACTUS lives in [`POLICY_LAB_STANDARDS_DIFFERENTIATION.md`](./POLICY_LAB_STANDARDS_DIFFERENTIATION.md).

The safe contribution statement is:

> **Policy Lab tests a non-promotion semantics across evidence assurance, policy admission, quantity authorization, and settlement, while preserving the exact identities and assumptions required to reproduce the result.**

## What this adds to a competition submission

A judge should no longer have to accept “the architecture is disciplined” on trust. The submission can show:

```text
stale assurance promotion       → REJECT
policy changed                  → new policy + decision identity
oversized requested quantity    → BOUNDED TO DECISION
settlement capacity changed     → settlement changes, admission does not
L2 assurance counterfactual     → observed evidence identity unchanged
policy haircut changed          → exact quantity sensitivity disclosed
timezone changed                → byte-identical report
truncated report output         → deterministic clean rebuild
external-validation claim       → cannot close without frozen outside evidence
```

That is the role of the specialized Gauntlet: make Policy Lab's strongest epistemic claims falsifiable before they become pitch language.

## Canonical machine sources

- `benchmark/gauntlet/policy-lab-specialized.v1.json`
- `benchmark/gauntlet/policy-assumptions.v1.json`
- `benchmark/gauntlet/policy-lab-c3-c4-map.v1.json`
- `benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json`
- `scripts/run_policy_lab_specialized_gauntlet.mjs`
- `scripts/check_policy_lab_external_gauntlet_protocols.mjs`
- `scripts/build_policy_lab_release_provenance.mjs`
- `.github/workflows/policy-lab-specialized-gauntlet.yml`

The machine sources and current executable project surface take precedence over this explanatory document if they ever disagree.

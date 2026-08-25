# Policy Lab — Submission Readiness Checklist

**Goal:** define the minimum package that allows Policy Lab to enter a suitable competition without improvising the story under deadline pressure.

## Readiness states

- `PASS` — already exists and is independently inspectable in the repository/runtime.
- `READY_INTERNAL` — prepared for submission use but not externally validated.
- `OPEN` — substantive work/evidence still missing.
- `ROUTE_DEPENDENT` — required only for certain competitions.
- `HOLD` — deliberately not being built until evidence justifies it.

## A. Narrative package

| Asset | State | Canonical source |
|---|---|---|
| one-line hook | READY_INTERNAL | `benchmark/gauntlet/submission-package.v1.json` |
| judge problem statement | READY_INTERNAL | `docs/submission/POLICY_LAB_GAUNTLET_MASTER.md` |
| one-sentence identity | READY_INTERNAL | master narrative / machine package |
| novelty bullets | READY_INTERNAL | master narrative |
| why existing approaches are insufficient | READY_INTERNAL | master narrative |
| current limitations / non-claims | PASS | machine checkpoint + master narrative |
| route-specific framing | READY_INTERNAL | `POLICY_LAB_ROUTE_ADAPTERS.md` |

## B. Demonstration package

| Asset | State | Requirement |
|---|---|---|
| live public workbench | PASS | deployed Policy Lab surface |
| outside-data checkpoint visible | PASS | `PUB-AUSGRID-001P` |
| 30-second demo script | READY_INTERNAL | `POLICY_LAB_JUDGE_DEMO_AND_QA.md` |
| 90-second demo script | READY_INTERNAL | same |
| demo failure recovery facts | READY_INTERNAL | same |
| primary hero screenshot | OPEN | capture current Policy Lab overview with outside-data checkpoint |
| policy-divergence screenshot | OPEN | same evidence / open admit / pilot block |
| settlement-failure screenshot | OPEN | 40% partial settlement |
| proof/receipt screenshot | OPEN | receipt, lineage or assessment identity |
| 60–90 second recorded demo | OPEN | optional but high value for applications accepting video |

## C. Technical evidence

| Evidence | State | Current proof |
|---|---|---|
| deterministic core | PASS | constraint-core tests |
| versioned schemas/policies | PASS | `protocol/schema`, `protocol/policies-v2` |
| controlled decision cases | PASS | four-case interactive pack |
| outside public-data operability | PASS | Ausgrid CI checkpoint |
| binding-rule attribution | PASS | decision outputs |
| settlement stress | PASS | decision/settlement artifacts |
| deterministic receipt/capsule | PASS | runtime + tests |
| portable Claim Assessment Package | PASS | recovered P0.1 package + verifier |
| browser/public bundle verification | PASS | deployed reproduction path |
| CI regression/security | PASS | current workflows |

## D. Evidence that remains structurally missing

| Evidence | State | Why it matters |
|---|---|---|
| independent evaluator comprehension | OPEN | verifies the package is understandable without coaching |
| independent reproduction attempt | OPEN | external reproducibility evidence |
| attributable owner/operator source | OPEN | moves beyond public L0 source |
| authenticated L1/L2 evidence | OPEN | stronger source/custody claim |
| institutional or financial pilot | OPEN | important for fintech/commercial competitions |
| repeated use/adoption | OPEN | important for commercial maturity |
| R4 monetary performance | HOLD | not a current Policy Lab claim |

Do not mark any of these `PASS` because a judge liked the demo, the site received traffic, or the project was submitted somewhere.

## E. Release package

| Asset | State | Note |
|---|---|---|
| exact candidate source commit | OPEN | freeze after submission assets stabilize |
| Git tag / GitHub Release | OPEN | synchronize with citation metadata |
| release notes | OPEN | judge-readable + technical |
| `CITATION.cff` bump | OPEN | do only with actual release |
| Zenodo/DOI archive | OPEN | useful for research routes |
| immutable screenshot set | OPEN | tie to candidate revision |
| release integrity manifest | ROUTE_DEPENDENT | high value for research/software routes |

## F. Competition intake checklist

Before drafting an actual application, record:

```text
competition:
submission deadline:
eligibility:
category / track:
official rubric:
required fields / word limits:
required attachments:
video requirement:
demo requirement:
team requirements:
IP / publication restrictions:
commercialization expectations:
external-validation expectations:
```

Then decide:

```text
semantic fit       PASS / CONDITIONAL / FAIL
maturity fit       STRONG / ACCEPTABLE / WEAK
packaging leverage HIGH / MEDIUM / LOW
opportunity cost   LOW / MEDIUM / HIGH
verdict            FIRE / CHEAP / HOLD / KILL
```

## G. Submission construction order

For a real opportunity:

1. Verify the current official rules and deadline.
2. Select the route adapter.
3. Copy facts only from the machine-bound submission package.
4. Write the 50–100 word problem first.
5. Write the solution around one judge-visible mechanism.
6. Insert the Ausgrid proof.
7. Map technical evidence to the official rubric.
8. State the current limitation that matters for that route.
9. Add visuals/video only after the narrative is stable.
10. Run `node scripts/validate_gauntlet_submission_package.mjs` before finalizing any claims.

## H. What “Gauntlet ready” should mean

Policy Lab should be called **Gauntlet submission ready** when all of the following are true:

- machine-bound master narrative exists;
- demo script exists;
- route adapters exist;
- four core screenshots exist;
- one frozen candidate revision is selected;
- submission claims pass the validator;
- the actual target competition's eligibility and official rubric have been reverified;
- all required files can be assembled without reopening core product development.

External validation is **not** required to call the package submission-ready for every route. It remains a major score gap for commercialization-heavy routes and must be stated honestly.

## Current verdict

```text
NARRATIVE PACKAGE        READY_INTERNAL
MACHINE EVIDENCE         PASS
LIVE DEMO                PASS
TECHNICAL PROOF          PASS
ROUTE ADAPTERS           READY_INTERNAL
VISUAL ASSET PACK        OPEN
FROZEN RELEASE CANDIDATE OPEN
EXTERNAL VALIDATION      OPEN
```

**Next bounded tranche:** visual submission assets + frozen release candidate. Do not add another core subsystem to improve presentation scores.

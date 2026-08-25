# Policy Lab — InnoServe 2026 Advisor Brief

**Primary route:** Information Application (IP)  
**Secondary route:** International Exchange — English (IC)  
**Official registration cutoff:** 2026-10-05 16:00 Taiwan time

## One-sentence project

> **Policy Lab is an auditable decision and constraint system that shows what external evidence can actually authorize, how much it can justify, which rule limits or blocks the result, and what fails at settlement.**

## Why this is being submitted

Policy Lab already has a deployed public workbench, deterministic decision core, versioned policies, reproducibility tests, a bounded outside-data checkpoint, and a judge-facing submission package. The current submission effort is therefore packaging and external evaluation, not a proposal to build a system later.

The strongest current InnoServe route is **Information Application (IP)**. Its preliminary rubric is 50% innovation and 50% extensibility, which aligns with the existing system:

- evidence, policy authority, quantity, and settlement are separated rather than collapsed into one score;
- the exact blocking or binding rule is attributed;
- identical declared inputs reproduce an identical decision identity;
- schemas and versioned policies allow the same audit structure to be extended beyond one dataset.

The **International Exchange — English (IC)** track is a viable second entry using the same technical artifact and an English-first presentation. It has a higher practicality weight, so the application states the current external-validation gap directly rather than inventing users or pilots.

## What the live demonstration shows

The canonical public checkpoint is `PUB-AUSGRID-001P`, based on a pinned Ausgrid public dataset.

```text
actual assurance: L0
336 half-hour intervals

open policy
→ ADMIT_WITH_LIMIT
→ 33.066 kWh
→ evidence-backed capacity binds

same evidence, stricter policy
→ BLOCKED
→ signed evidence / provenance requirements

40% settlement capacity
→ PARTIAL
→ 13.2264 kWh covered
→ 19.8396 kWh shortfall

deterministic reproduction
→ PASS
```

The judge-visible idea is simple:

> **Same evidence. Different policy. Different financial consequence. Every step is inspectable.**

## What is already prepared

- Chinese IP system-overview content master;
- English IC system-overview content master;
- official-format Word candidates kept below the five-page / four-MB cap;
- three-minute English video script and recording storyboard;
- machine-bound competition facts and anti-overclaim validator;
- CI-generated judge screenshots;
- public deployed demo;
- route-specific judge narrative and Q&A.

## What is requested from the faculty advisor

The remaining advisor role is bounded:

1. agree to be listed as one of the required faculty advisors;
2. review whether the project title and short academic framing are appropriate for the university submission;
3. flag any wording that could create an institutional or research-ethics concern;
4. optionally attend or advise preparation for the final presentation if the team advances.

The advisor is **not** being asked to certify the Ausgrid source, guarantee financial/legal validity, or represent that Policy Lab has an institutional pilot.

## Explicit non-claims

The submission will not claim:

- owner/operator validation of the Ausgrid evidence;
- authenticated L1/L2 source evidence for the public case;
- physical meter certification;
- legal issuance or redemption authority;
- an existing institutional pilot or commercial customer;
- stablecoin/currency status;
- product-market fit;
- R4 monetary performance.

## Current ask

If the project is acceptable for university representation, the immediate next step is to lock the advisor/team identity and finish the administrative upload package. No additional core feature development is required for registration.

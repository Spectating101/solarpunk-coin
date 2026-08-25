# JOSS Readiness Gate — Policy Lab

**Decision:** PREPARE, DO NOT SUBMIT YET  
**Deadline:** rolling  
**Reason for hold:** current software quality is plausible; external research-impact/community-significance evidence is not yet strong enough for a low-risk pre-review.

Official guidance:
- https://joss.readthedocs.io/en/latest/submitting.html
- https://joss.readthedocs.io/en/latest/review_criteria.html
- https://joss.readthedocs.io/en/latest/paper.html

## 2026 hard-screen interpretation

### Likely PASS now

- public repository with sustained development history exceeding six months;
- iterative PR/issue/commit history rather than a one-time code dump;
- OSI-compatible license;
- installation/use documentation;
- automated tests and CI;
- deterministic/reproducible research objects;
- contribution/support routes;
- substantive architecture and domain modeling rather than a thin wrapper;
- public outside-data checkpoint.

### Not yet strong enough

**Research impact / community significance.**

The repository is substantial, but JOSS explicitly does not treat “the code is public and might be useful” as sufficient impact. The submission should arrive with at least one inspectable signal that people outside the project are beginning to engage with it as research software.

## Exact submit gate

Submit only after at least **one strong** or **two moderate** signals exist.

### Strong signals

- accepted presentation/poster at a relevant research venue;
- documented independent reproduction by an external researcher/software practitioner;
- external research group requests/adopts/integrates the software or its artifacts;
- software used to support a separate scholarly output outside the core development team.

### Moderate signals

- substantive external issue evaluating/reproducing the software;
- workshop/demo accepted by a relevant research-software community;
- external citation/link in research documentation;
- credible user report demonstrating a real research workflow.

Traffic, GitHub stars, a submission itself, or generic compliments do not count.

## Paper skeleton to prepare now

JOSS paper should describe the software rather than duplicate a scientific FC-style contribution.

### Title

> **Policy Lab: Reproducible Constraint Analysis for Evidence-Backed Financial Claims**

### Summary

Policy Lab is open research software for constructing and reproducing bounded decisions in which external evidence is evaluated under explicit policies. It separates evidence/source assurance, policy admission, quantity ceilings, settlement stress, and decision lineage so that researchers can identify which rule blocks or bounds a claim and preserve unresolved evidence boundaries rather than silently promoting them.

### Statement of need

Research into evidence-backed financial systems often combines data acquisition, model assumptions, policy rules, quantity calculations and downstream settlement in bespoke notebooks or applications. This makes it difficult to distinguish what was observed from what was modeled, which policy authorized a result, and whether a successful upstream decision implies successful downstream settlement. Policy Lab provides a reusable executable object model and deterministic decision pipeline for these studies.

### State of the field

Discuss without claiming replacement:
- general policy engines (OPA/Cedar);
- credential/attestation systems (W3C VC, proof-of-reserve mechanisms);
- financial contract standards/simulators (ACTUS);
- reproducible computational research tooling.

JOSS framing should emphasize the research-software gap: a reusable workbench connecting evidence, policy, quantity, settlement and lineage for experimentation.

### Software design

Describe:
- deterministic constraint core;
- case/evidence/policy schemas;
- binding-constraint semantics;
- settlement separation;
- receipt/capsule/assessment package;
- public workbench;
- CI/reproduction workflows;
- controlled cases + outside-data checkpoint.

### Research impact statement — current placeholder, NOT READY

Do not invent impact. Replace this section only when external evidence exists.

Candidate future structure:

> Policy Lab has been used/presented/reproduced in [specific external context]. [Actor/venue] used the software to [specific research action]. This demonstrates relevance beyond the originating repository and produced [issue/reproduction/presentation/integration] that materially affected [documentation/test/policy framing].

### AI usage disclosure

Because AI-assisted development has been used in the broader project workflow, the submission must explicitly disclose the tools/scopes used in the final software and manuscript and state how human design, review, testing and verification were performed. Do not rely on generic “AI was used” wording.

## Pre-submission actions

- [ ] obtain external impact/community signal(s)
- [ ] create tagged software release
- [ ] synchronize `CITATION.cff` with release
- [ ] archive release/DOI if appropriate
- [ ] write 750–1750 word JOSS paper in required sections
- [ ] document AI-assisted development precisely
- [ ] verify installation from a clean environment
- [ ] identify realistic reviewer expertise keywords
- [ ] run an independent reproduction before submitting

## Stop rule

Do not add unrelated features to make JOSS look more substantial. The current missing gate is external significance, not code volume.

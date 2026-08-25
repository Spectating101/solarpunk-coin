# Software Sustainability Institute Fellowship 2027 — Application Master

**Decision:** FIRE  
**Deadline:** 2026-10-05  
**Route:** International Fellow  
**Application:** form + six-minute voice-over slide screencast

Official guidance:
- https://www.software.ac.uk/programmes/fellowship-programme/apply-fellowship-programme
- https://www.software.ac.uk/guide/fellowship-programme-application-video-guide

## Application identity

### Working Fellowship title

> **Evidence-Bounded Research Software: Making Computational Decisions Reproducible and Challengeable**

### One-sentence proposition

> I want to help researchers design software in which data provenance, model assumptions, policy choices, and downstream decisions remain independently inspectable instead of collapsing into an opaque “the software said so.”

### Positioning

Policy Lab is the principal worked reference implementation, **not the Fellowship itself**. The Fellowship is about disseminating reusable practices for evidence-bounded research software across disciplines.

## Applicant narrative master

### Who I am

I work at the boundary of finance research, data engineering, and research software. My recent work has increasingly focused on a practical methodological problem: research software often produces outputs that are technically reproducible while still obscuring which evidence, assumptions, rules, or institutional choices authorized the result.

I have been developing public research-software systems that combine structured data, deterministic computation, testing, provenance, and machine-readable outputs. Policy Lab is the clearest current example. It makes evidence assurance, policy admission, quantity constraints, settlement, and reproducible lineage separate objects rather than treating a final number or approval as sufficient explanation.

This Fellowship would let me turn those project-specific lessons into an open, reusable research-software practice that can be tested with researchers beyond my immediate discipline and region.

## Fellowship plan

The plan is intentionally broader than continuing development of Policy Lab.

### Activity 1 — Evidence-Bounded Research Software Playbook

Produce an openly licensed practical guide and reference implementation explaining how to keep five layers separate:

```text
source evidence
→ transformations / assumptions
→ explicit decision rules
→ bounded result
→ downstream consequence
```

The playbook will include:
- provenance and non-promotion checklist;
- versioned-decision checklist;
- reproducibility/lineage patterns;
- examples of failure states that should remain visible;
- templates for machine-readable decision receipts;
- worked examples from Policy Lab and at least one second domain if a suitable collaborator emerges.

### Activity 2 — UK–Asia research-software reproducibility clinics

Run at least two online clinics/workshops bringing together UK/SSI research-software participants and Asia-Pacific researchers or students.

Format:
1. participant presents one research-software decision pipeline;
2. group identifies where evidence, assumptions and authority become conflated;
3. pipeline is rewritten as explicit inspectable stages;
4. resulting checklist and lessons are published in anonymized/generalized form where appropriate.

The purpose is genuine cross-region exchange rather than broadcasting a finished tool.

### Activity 3 — Independent reproduction challenge

Invite external participants to reproduce a frozen Policy Lab case from its public artifacts and document:
- what they understood without coaching;
- where provenance became unclear;
- whether the deterministic result reproduced;
- what evidence they would require before trusting a stronger claim.

The output will be a public reproducibility case study, including failures rather than only successful reproductions.

### Activity 4 — Dissemination to research-software communities

Use SSI channels and events to share the methods through:
- one practical tutorial or workshop;
- one public case-study article;
- short reusable templates/checklists;
- presentations to relevant RSE/open-science/financial-data communities;
- documented feedback incorporated into the playbook.

## Why this benefits UK research culture

The international value proposition must be explicit.

1. **Cross-regional practice transfer.** Research-software communities often discuss reproducibility at code/data level; this Fellowship adds a complementary focus on the point where computational evidence becomes decision authority.
2. **Asia-Pacific access.** I can help connect SSI/RSE practices with researchers and students in Taiwan and the wider Asia-Pacific context, creating bidirectional rather than one-way dissemination.
3. **Open reusable outputs.** The playbook, templates, workshop materials, and reproduction results will be public and usable by UK research groups without depending on a proprietary platform.
4. **Concrete collaboration mechanism.** The workshops/reproduction challenge give UK participants something to do together with international participants rather than relying on generic networking claims.
5. **Interdisciplinary bridge.** My finance/data/software background can bring domains with consequential automated decisions into research-software discussions that are often dominated by conventional scientific computing examples.

## Ambassadorship case

Evidence to emphasize:
- sustained public open-source development;
- willingness to expose failed/blocked outcomes rather than polish them away;
- machine-readable reproducibility and CI;
- public documentation and issue-based evaluation pathways;
- cross-disciplinary work between finance, policy questions, data engineering, and software;
- commitment to converting project-specific lessons into reusable community material.

Do not claim a large existing community around Policy Lab. The Fellowship case is that the applicant has built substantial public methods and is now ready to turn them outward.

## Six-minute screencast storyboard

### 0:00–1:00 — Who I am

**Slide 1 — Evidence, software, and decisions**

Speak:

> I am a finance researcher and research-software builder working across data engineering, computational research, and reproducibility. A recurring problem in my work is that software can reproduce an output perfectly while still hiding a more important question: what evidence and assumptions actually authorized that output? I want to make those boundaries visible and challengeable.

### 1:00–2:00 — What I currently do

**Slide 2 — Policy Lab as a worked example**

Show:

```text
Evidence → Assurance → Policy → Admission → Quantity → Settlement → Receipt
```

Speak:

> Policy Lab is one concrete implementation of that idea. It separates source assurance, decision policy, quantity limits and settlement, and preserves deterministic lineage between them. The point is not that every project should use Policy Lab; it is that the design exposes reusable research-software patterns around provenance, non-promotion and decision reproducibility.

Use the outside-data checkpoint briefly:

> With the same public evidence, one explicit policy permits a bounded quantity while a stricter policy blocks it, and neither is allowed to rewrite the underlying evidence assurance.

### 2:00–3:00 — Fellowship problem

**Slide 3 — Reproducible output ≠ inspectable authority**

Explain:
- code/data reproducibility is necessary;
- many systems still collapse evidence, assumptions, model transformations and decisions;
- this becomes consequential in finance, public policy, risk and other decision-heavy domains.

### 3:00–5:00 — Fellowship plan

**Slides 4–6**

1. Evidence-Bounded Research Software Playbook.
2. UK–Asia reproducibility clinics.
3. Independent reproduction challenge + public case study.
4. Open workshop/tutorial and reusable templates.

Stress that outputs are community resources, not a product launch.

### 5:00–5:35 — UK/international benefit

**Slide 7 — A two-way bridge**

Speak:

> As an international Fellow, I want the Fellowship to create concrete UK–Asia collaboration rather than simply fund work conducted elsewhere. UK RSE participants would help test and improve the methodology; Asia-Pacific participants would contribute different institutional and research contexts; the resulting materials and reproduction evidence would remain openly available to both communities.

### 5:35–6:00 — Close

**Slide 8 — Reproducibility before authority**

Speak:

> My goal is simple: when research software moves from evidence to a consequential conclusion, researchers should be able to see exactly where that authority came from and reproduce the path independently. The SSI Fellowship is the right community in which to turn that principle from one project into a reusable research-software practice.

## Draft deliverables

By the end of the Fellowship period:
- 1 public Evidence-Bounded Research Software Playbook;
- 2 cross-region reproducibility clinics/workshops;
- >=3 documented independent reproduction attempts across the reference implementation;
- 1 public case-study article;
- 1 reusable repository of checklists/templates;
- >=1 SSI/RSE/community presentation or tutorial;
- documented feedback and revision log showing community input.

## Budget concept — confirm against Fellowship expense rules before final form

Do not present this as final until the current expense guidance is checked.

Candidate use of £4,000:
- travel/attendance for a high-value SSI/RSE collaboration event;
- accessibility/captioning/materials for cross-region workshops;
- limited event/hosting/logistics expenses;
- design/editing support for durable open training material;
- local/international collaboration costs directly tied to Fellowship activities.

Avoid framing the £4,000 as salary for building Policy Lab.

## Human fields still required

- applicant name/contact;
- current role/institution wording;
- concise biography;
- exact previous community/ambassador examples selected for the application form;
- travel/logistics statement;
- final budget once current eligible-expense guidance is reconciled;
- six-minute human-recorded screencast URL.

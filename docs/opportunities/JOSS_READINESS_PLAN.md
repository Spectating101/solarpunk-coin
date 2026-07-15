# JOSS Research Software Readiness Plan

**Opportunity:** Journal of Open Source Software (JOSS)  
**Official requirements checked:** 2026-07-15  
**Decision:** build public-development and research-use evidence; do not submit yet

## 1. Why JOSS is strategically valuable

JOSS publishes formally peer-reviewed articles about research software. Accepted papers receive a JOSS/Crossref DOI, while the reviewed software is released and archived through a service such as Zenodo or figshare.

The workbench has a plausible scope argument because JOSS explicitly includes software that:

```text
solves complex modeling problems in scientific/social-science contexts
supports research instruments or research experiments
extracts knowledge from large datasets
```

The current repo also has two characteristics JOSS says can bring web software into scope:

1. the web interface exposes a shared core library, `@solarpunk/constraint-core`;
2. the application demonstrates explicit domain modeling and extensive testing.

The strongest JOSS framing is not the frontend alone.

It is:

> **a portable research-software library and reference workbench for explicit case, evidence/context, policy, typed constraint, deterministic decision, claim, settlement, and receipt experiments.**

## 2. Current readiness assessment

### Strong today

```text
MIT license
public GitHub repository
research application
shared core package
browser + Node execution
published JSON schemas
deterministic object identities
60 core tests
64 frontend tests
CI
controlled reference case pack
aggregate empirical study
CITATION.cff
architecture / implementation documentation
release-oriented V2 scope
```

### Not yet sufficient

```text
verified >6 months public repository visibility
sustained post-V2 public development history
clear tagged release history / changelog discipline
CONTRIBUTING guide and support/governance expectations
independent colleague install/use report
external researcher adoption or documented workflow integration
research output explicitly using the released software
complete AI usage disclosure ledger
JOSS paper.md / bibliography
```

### Important timeline nuance

Git commit history currently reaches back to 2026-01-22 and continues across later months.

JOSS, however, requires the **repository to have been public for more than six months prior to submission** and looks for active development spanning that period. Commit age alone does not prove public visibility.

Therefore:

> **Do not calculate JOSS eligibility from the first commit date until the repository public-visibility history is verified.**

Even after the six-month gate, JOSS requires research-use evidence and iterative open development; time alone is not enough.

## 3. JOSS's actual pre-review gates mapped to this repo

### Gate 1 — sufficient public development history

JOSS requires:

```text
repository public >6 months
active development across the period
not a concentrated repo dump
```

Readiness actions:

```text
verify repository public date/history
publish v0.2.0-alpha
maintain tagged releases
make real issue-driven iterations
avoid artificial commit activity
record release dates and scope
```

Evidence file:

```text
docs/opportunities/joss/PUBLIC_HISTORY_LEDGER.md
```

Fields:

```text
date
event type: RELEASE | ISSUE | PR | EXTERNAL USE | DOC UPDATE | BUG FIX
public URL / identifier
problem or feedback
resulting change
research relevance
```

### Gate 2 — demonstrated research impact

JOSS says software must be used for research at minimum by the developers and ideally by others. Acceptable signals include papers/preprints, DOI links, documented adoption by research groups, or clear integration into research workflows. Aspirational future claims are insufficient.

Current internal/developer use:

```text
market-capacity policy study
Energy Standard implementation research
controlled energy case experiments
```

Need to make the relationship to the **released software** explicit.

Actions:

1. create a versioned `v0.2.0-alpha` release;
2. archive release and obtain software DOI;
3. add a study/software version receipt showing which release executes the reference case pack;
4. use the released engine in one real research analysis or external evidence case;
5. seek one colleague/researcher reproduction or integration.

Strong target evidence:

```text
one external evidence case executed with released version
one researcher/colleague independently runs the quickstart or case pack
one thesis/preprint/methods artifact cites the software DOI
one public issue opened from actual use or feedback
```

### Gate 3 — good open-source practices

JOSS specifically names:

```text
meaningful public commit history
tagged releases or changelog
tests and CI
clear documentation
CONTRIBUTING file
stated support or governance expectations
```

Already strong:

```text
tests
CI
documentation
CITATION.cff
public source
```

Add after V2 merge:

```text
CHANGELOG.md
CONTRIBUTING.md
SUPPORT.md or explicit support section
GOVERNANCE.md or a lightweight maintainer/governance section
CODE_OF_CONDUCT.md if community contribution is actively invited
```

Do not create empty governance theatre. A solo-maintainer policy is acceptable if honest.

Recommended governance statement:

> Christopher Ongko is the current lead maintainer and final release decision-maker. Public issues and pull requests are welcome. Published schemas and deterministic policy/decision semantics use explicit versioning; incompatible object changes require new schema identifiers. Research-case and policy contributions must disclose source, modeled/observed semantics, and redistribution boundaries.

### Gate 4 — iterative development over time

JOSS looks for refinement through use and feedback rather than one concentrated burst.

Do not game this requirement.

Use real triggers:

```text
live deployment defect
researcher comprehension issue
external evidence adapter requirement
receipt/reproduction bug
reference case correction
schema/versioning issue
public user feedback
```

Each meaningful change should link:

```text
issue
→ implementation PR
→ tests
→ changelog/release where material
```

## 4. Research significance strategy

The JOSS paper must describe the software, not report new research findings accomplished with it.

Therefore separate:

### Software paper claim

> Policy Lab provides portable domain objects and deterministic execution for case-based research experiments in which evidence/context and versioned policy rules produce typed admission, quantity-ceiling, and settlement evaluations with blocking/binding attribution and reproducible decision receipts.

### Research results outside the JOSS paper

```text
market-capacity coverage/capacity findings
Energy Standard empirical diagnosis
future external operator case results
future geospatial policy study
```

These may demonstrate research use and significance, but `paper.md` should not become a paper about the 1.61 pp market-capacity result.

## 5. Comparison / ecosystem review required

JOSS values design thinking and explicitly asks whether authors build on or extend existing ecosystems rather than reinventing mature alternatives.

Before paper drafting, produce:

```text
docs/research/SOFTWARE_LANDSCAPE_AND_DESIGN_TRADEOFFS.md
```

Compare the workbench against relevant categories:

```text
Open Policy Agent — policy decisions / decision logs
DMN — explicit business decision models
Taktile-like decision platforms — operational decision systems
Hex / marimo / Observable — analytical/reproducible research interfaces
Code Ocean — packaged computational lineage and results
RO-Crate — research packaging / provenance metadata
W3C PROV — provenance semantics
energy modeling tools — PVWatts / SAM / REopt
```

Research question for the comparison:

> What problem is the workbench solving that is not better solved by adopting one of these systems directly?

Current answer to validate:

> It is a small research instrument that binds evidence semantics and modeled context to typed policy evaluations, distinguishes admission from comparable quantity ceilings and settlement, attributes blocking/binding rules, and emits deterministic decision objects suitable for controlled case comparison.

Do not claim invention of policy-as-code, provenance, or decision logs.

## 6. Packaging readiness

Current core package:

```text
@solarpunk/constraint-core
```

Before JOSS submission, review:

```text
package version consistent with release
package exports intentional
TypeScript declarations complete
Node version support documented
install instructions from clean environment
API documentation
minimal quickstart
reference case runner
semantic versioning policy
schema compatibility policy
```

### Clean-install test

A colleague who did not build the project should be able to:

```bash
npm install
node --test packages/constraint-core/test/*.test.mjs
```

and run one minimal case example without private data.

Create:

```text
examples/minimal-case/
```

Target example:

```text
load one case
load one evidence envelope
load one context
load one policy
run decision
print blocking/binding result
build receipt
```

Do not require the React app for the core research-software quickstart.

## 7. Independent use / colleague test

JOSS explicitly says a potential user should be able to install, understand, and test the software; for new software it advises having a colleague try it.

Recruit at least two testers:

### Tester A — quantitative/research person

Task:

```text
run market-capacity study reproduction
run a canonical case
explain the binding rule
```

### Tester B — software/data person

Task:

```text
install core from clean clone
run minimal example
change one policy parameter
observe decision ID/result change
```

Tester log:

```text
tester_id / optional public identity with consent
date
background
installation environment
task completion
failure points
questions
issue links
changes made
```

Create public issues for genuine software defects or documentation gaps.

## 8. External research-use target

The strongest target is one real external energy evidence case.

Why it matters for JOSS:

```text
external source semantics challenge the adapters
provenance classification is used in a real workflow
decision receipt becomes a real research artifact
limitations can be documented
software is used beyond controlled fixtures
```

Alternative research-use targets:

```text
another YZU researcher uses the core for a policy-capacity case
market-capacity study is released as a reproducible analysis using a tagged core version
an external researcher opens an issue or reproduces a reference case
```

The key is documented use, not vanity stars.

## 9. Release and DOI sequence

Before JOSS submission:

```text
v0.2.0-alpha public release
        ↓
public deployment
        ↓
Zenodo archival / software DOI
        ↓
iterative public releases
        ↓
submission-candidate release
```

At the end of a successful JOSS review, JOSS instructs authors to make a tagged release, archive the repository with a service such as Zenodo or figshare, obtain the archive DOI, and report the release version/DOI in the review thread.

A pre-submission software DOI is still useful as research-use evidence and for version citation, but the final reviewed release/archive must follow the editor's review process.

## 10. AI usage disclosure ledger

This project has substantial AI-assisted development history. JOSS currently permits generative AI assistance for software, documentation, and paper authoring but requires comprehensive disclosure.

The disclosure must include:

```text
tools/models and versions
where used: code / tests / docs / paper
nature and scope: generation / refactoring / test scaffolding / copy-editing / drafting
human review confirmation
human validation confirmation
confirmation that core design decisions were made by human authors
```

JOSS prohibits undisclosed use and says authors remain fully responsible for accuracy, originality, licensing, and ethical/legal compliance.

### Create now

```text
AI_USAGE_DISCLOSURE.md
```

Do not wait until paper submission and then reconstruct months of tool usage from memory.

Recommended ledger fields:

```text
time period
tool
model/version if known
workflow
files/areas affected
assistance type
human review method
validation method
core design decision owner
notes
```

Known high-level categories to disclose honestly:

```text
ChatGPT / OpenAI reasoning and coding assistance
other LLM coding tools used during repository history where applicable
code generation/refactoring
schema/test scaffolding
documentation drafting/revision
interface implementation assistance
research-source discovery/synthesis
```

Do not claim exact historical model versions where records do not support certainty. Record uncertainty explicitly and preserve available logs/PR history.

## 11. JOSS paper plan

JOSS requires a short Markdown paper using `paper.md`, with title, summary, authors, affiliations, and key references, hosted in the Git repository with the software. The paper must not focus on new research results accomplished with the software.

Proposed title:

> **Policy Lab: A Case-Based Research Workbench for Deterministic Constraint Evaluation and Decision Provenance**

This is a candidate paper title, not a permanent project rename.

Proposed structure:

```text
Summary
Statement of need
Software design
  Case and context objects
  Typed constraint semantics
  Deterministic decision identity
  Binding-constraint attribution
  Claim and settlement separation
  Receipts and reproduction
Research use cases
  aggregate policy-capacity study
  controlled energy case pack
Software landscape and design trade-offs
Quality control and testing
Availability and reuse
AI usage disclosure
Acknowledgements
References
```

### Statement of need

The strongest need statement:

> Research workflows that combine heterogeneous evidence, modeled context, and explicit policy rules often produce a final score or recommendation without a portable representation of which rule blocked the case, which comparable ceiling bound the quantity, or what exact decision context should be replayed. Policy Lab provides a small deterministic object model and reference workbench for these case-based experiments.

### Do not claim

```text
universal financial decision engine
trustless off-chain evaluation
production collateral adequacy
novel invention of policy-as-code
geospatial policy superiority
real operator validation before it exists
```

## 12. Submission readiness scorecard

Review every month after public V2 release.

| JOSS gate | Current | Submission target |
|---|---|---|
| Public >6 months | unverified public-visibility start | verified >6 months |
| Active iterative development | strong commit history; concentrated recent V2 build | sustained issue-driven post-release iteration |
| Research use | developer studies | version-cited study + external/colleague use |
| Open-source practices | tests/CI/docs/CITATION | + releases/changelog/CONTRIBUTING/support/governance |
| Installation | repository quickstart | independent clean-install success |
| Core library | yes | documented stable research API |
| Web-scope fit | core library + rigorous frontend tests | clearly documented relation between core and web interface |
| Research significance | plausible | external use / cited release / documented workflow integration |
| AI disclosure | not yet centralized | complete disclosure ledger |
| paper.md | none | short software paper ready |

## 13. 6–12 month execution sequence

### Month 0

```text
merge/deploy V2
release v0.2.0-alpha
Zenodo archive
create CHANGELOG
create CONTRIBUTING
create support/governance statement
create AI_USAGE_DISCLOSURE ledger
```

### Months 1–2

```text
minimal core example
API/quickstart documentation
2 independent colleague tests
public issues from real feedback
one maintenance release if justified
```

### Months 2–4

```text
external evidence case or external research workflow
software DOI cited in thesis/preprint/methods artifact
landscape/design tradeoff document
research-use receipt/version mapping
```

### Months 4–6+

```text
verify public-history gate
review commit distribution / releases / issues
assess external research significance
paper.md draft
bibliography
JOSS checklist audit
```

### Submission decision

Submit only when all mandatory gates are actually true.

Do not submit on the first calendar day after a guessed six-month mark.

## 14. Go/no-go gate

Submit only when:

```text
[ ] repository public-visibility period verified >6 months
[ ] active development spans the public period
[ ] tagged release/changelog history exists
[ ] CONTRIBUTING and support/governance expectations exist
[ ] core installs/runs from a clean clone
[ ] at least one colleague independently tested the software
[ ] software is demonstrably used in research
[ ] preferably one external researcher/group/workflow uses or reproduces it
[ ] AI usage disclosure is complete and honest
[ ] paper.md describes software, not new findings
[ ] software landscape / design trade-offs are documented
[ ] submission-candidate version is feature-complete and maintainable
```

## 15. Official sources checked

- JOSS About / scope, significance, public-history, open-source-practice, AI usage, and web-software policy.
- JOSS Submitting a Paper documentation.

Source pages:

- https://joss.theoj.org/about
- https://joss.readthedocs.io/en/latest/submitting.html

Official JOSS guidance current on 2026-07-15 requires public development history, research-use evidence, open-source workflows, iterative development, and full generative-AI disclosure. Recheck the policy before submission because editorial requirements may change.

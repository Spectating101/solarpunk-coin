# 2026 Taiwan Presidential Hackathon Execution Plan

**Opportunity:** 2026 總統盃黑客松 / Taiwan Presidential Hackathon  
**Official status checked:** 2026-07-15  
**Official site:** live for the 2026 event and exposes an event-registration route  
**Exact 2026 deadline/rules status:** not resolved by the automated public-page review; must be verified directly in the registration system  
**Decision:** immediate registration/rules verification; proceed only if the 2026 scope is still open and the public-data problem fit is real

## 1. Official program fit

The official 2026 homepage describes the Presidential Hackathon as a public/private co-creation platform where data holders, data scientists, and domain experts use government open data and technological innovation to solve social problems and improve government effectiveness.

The official site states that five "卓越團隊" are selected each year and recognized by the President. It also states that some winning proposals have received government recognition enabling further subsidy applications or direct inclusion in government implementation/policy plans.

Therefore the correct project framing is **public decision accountability**, not startup financing and not tokenization.

## 2. Immediate 24-hour status gate

Because the automated review could access the 2026 homepage but not resolve the live `/events` registration details or exact deadline, do this before any build work:

```text
1. open the official 2026 event registration page
2. register / log in if required
3. capture the current submission status
4. download or save the current 2026 rules
5. record the exact deadline
6. record team-size and eligibility rules
7. record theme/challenge scope
8. record required proposal fields and judging criteria
```

Create a dated note:

```text
docs/opportunities/PRESIDENTIAL_HACKATHON_2026_CURRENT_RULES.md
```

Do not rely on previous-year rules as current authority.

### Kill gate

If 2026 submission is already closed:

```text
STOP active build work
archive this plan as a 2027 readiness asset
continue FITI / ETHOnline / NASA paths
```

## 3. Correct opportunity-specific wedge

Do not submit:

> Energy-backed cryptocurrency.

Do not submit:

> Financial claim policy workbench.

Recommended public-sector research wedge:

> **Open Energy Evidence Assurance and Reproducible Public Decision Workbench**

Chinese working title:

> **開放能源資料證據可信度與可重現公共決策工作台**

Public problem statement:

> Government and public-sector energy decisions may combine open datasets, modeled resource estimates, policy thresholds, and local conditions. The final recommendation can be difficult for non-specialists to trace back to the evidence and rule that actually determined it. A public decision should expose what data was used, what is modeled rather than observed, which rule blocked or constrained the result, and how the decision changes under a declared scenario.

Proposed method:

```text
GOVERNMENT OPEN DATA
        +
MODELED PUBLIC CONTEXT
        ↓
SOURCE / SEMANTIC CLASSIFICATION
        ↓
DECLARED PUBLIC POLICY RULES
        ↓
ADMISSION OR ELIGIBILITY GATES
        ↓
COMPARABLE DECISION CEILINGS / LIMITS
        ↓
BLOCKING / BINDING ATTRIBUTION
        ↓
SCENARIO REPLAY
        ↓
PUBLIC DECISION RECEIPT
```

This is an adaptation of the research method. It should be a new public-problem case pack, not a relabeled financial-claim demo.

## 4. Candidate problem families

Do not lock one until the 2026 theme and rules are verified.

Candidate families that fit the existing method:

### A. Public renewable-energy evidence quality

Question:

> Which data-quality or eligibility rule blocks a local renewable-energy assessment, and what public data is missing?

Potential decision outputs:

```text
DATA SUFFICIENT
DATA INCOMPLETE
MODELED CONTEXT ONLY
SOURCE MISMATCH
POLICY THRESHOLD BINDING
```

### B. Rooftop solar public prioritization accountability

Question:

> When public datasets are used to prioritize areas or facilities for rooftop-solar support, which rule or evidence limitation drives the ranking/eligibility decision?

Critical boundary:

> Public resource estimates are modeled context, not proof of actual site generation.

### C. Resilience / local energy scenario transparency

Question:

> Under declared public energy-resilience scenarios, what constraint becomes binding and which assumptions change the decision?

Do not calculate unsupported physical or financial capacity merely because the interface can display a number.

## 5. Data-source rule

The event's official mission centers government open data.

Once the 2026 challenge scope is known, create a source register before coding:

```text
source_id
agency
open-data catalogue URL
license / usage boundary
update frequency
time semantics
spatial semantics
observed vs modeled
missingness
known limitations
```

Every dataset in the UI must be labeled as one of:

```text
OBSERVED PUBLIC DATA
MODELED PUBLIC CONTEXT
DECLARED POLICY / RULE
DERIVED RESULT
```

Do not use private CRSP/Refinitiv data in the Presidential Hackathon submission.

Do not use controlled energy evidence fixtures as though they are government data.

## 6. Team plan

Recommended team size: 3–4, subject to the actual 2026 rules.

### Christopher — research/system lead

```text
problem formulation
case/decision semantics
policy/risk logic
backend/core integration
research narrative
```

### Open-data / public-policy teammate

```text
Taiwan government open-data discovery
Mandarin policy interpretation
agency/domain context
public-problem framing
```

### Data/geospatial engineer

```text
source ingestion
spatial/time joins
quality checks
map/case surface
```

### Optional product/story teammate

```text
Traditional Chinese UX
public-user comprehension
pitch/video
```

A Mandarin-fluent public-policy/data teammate is higher value here than an Ethereum engineer.

## 7. Proposal structure

Once current rules are verified, map the submission fields to this narrative:

### Problem

Public energy decisions can be opaque because source data, modeled context, and rule thresholds are mixed into one final result.

### User

```text
public agency analyst
local government reviewer
public-data researcher
citizen / public-interest reviewer
```

### Current failure

```text
final score / recommendation visible
source identity difficult to trace
modeled vs observed distinction unclear
rule responsible for decision unclear
scenario changes not reproducible
```

### Proposed public service

```text
case explorer
source receipt
rule evaluation
blocking/binding attribution
scenario replay
public decision receipt
```

### Public value

```text
traceability
reproducibility
clearer data gaps
more inspectable public-policy scenarios
lower audit/reconstruction effort
```

Do not claim the tool automatically makes policy optimal or unbiased.

## 8. Build strategy if 2026 submission remains open

### Day 0 — rule lock

```text
current rules saved
submission deadline saved
challenge/theme fit confirmed
team confirmed
required fields mapped
```

### Days 1–2 — public problem/data lock

```text
select one problem
select 2–4 official open datasets
write source register
write exact decision question
write rule semantics
```

### Days 3–4 — public case pack

Build a **new** case pack for the public problem.

Do not modify TYN/AUS/PHX financial-claim cases to pretend they are public-sector cases.

Example object flow:

```text
PublicCaseManifest
source/context refs
public policy rule set
DecisionResult
PublicDecisionReceipt
```

Reuse the deterministic core only where semantics genuinely match.

### Days 5–6 — public interface

One primary investigation:

```text
select area/facility/case
        ↓
see data status
        ↓
see blocking/binding rule
        ↓
change declared scenario
        ↓
compare result
        ↓
open receipt
```

### Day 7 — user comprehension test

Ask three non-project people to answer:

```text
What decision is being made?
Which data is modeled?
Why did the case fail or change?
```

If they cannot answer in five minutes, simplify.

### Day 8 — policy/public-value narrative

Traditional Chinese first.

### Day 9 — submission assets

```text
proposal
screenshots
architecture
source register
demo video
team roles
implementation / adoption path
```

### Day 10 — freeze

No new features.

## 9. Five-minute judge demo

### 0:00–0:30

> 公共能源決策常把開放資料、模型估計與政策門檻混在同一個結果裡。我們不是再做一個儀表板，而是讓使用者看見：哪筆資料是觀測值、哪個是模型、哪條規則真正決定結果。

### 0:30–1:30

Open a public case and show source classification.

### 1:30–2:30

Show blocking/binding rule.

### 2:30–3:30

Change one declared scenario.

Show what changed and what remained fixed.

### 3:30–4:30

Open decision receipt and source identities.

### 4:30–5:00

Explain adoption path:

> This can start as a public decision-explanation layer over existing open-data workflows rather than replacing agency systems.

## 10. Government implementation path

The official site notes that some recognized proposals have moved toward subsidies or direct government implementation.

Therefore the proposal must include a low-friction implementation path:

```text
PHASE 1
static public demonstrator using existing open data

PHASE 2
agency analyst review + rule validation

PHASE 3
scheduled public-data refresh / local deployment

PHASE 4
integration with an existing agency decision or public-report workflow
```

Do not propose blockchain, token issuance, or a new government data warehouse unless the challenge explicitly requires them.

## 11. Go/no-go gate

Proceed only if:

```text
[ ] 2026 registration/submission remains open
[ ] exact 2026 rules are captured
[ ] challenge scope accepts the proposed public problem
[ ] at least two relevant official open datasets exist
[ ] one Mandarin public-policy/open-data teammate is available or Christopher can cover the policy interpretation adequately
[ ] submission can be completed without delaying V2 deployment/thesis critical work
```

## 12. Official sources checked

- 2026 Taiwan Presidential Hackathon official homepage.

Source:

- https://presidential-hackathon.taiwan.gov.tw/

The homepage confirms the 2026 event, public/private co-creation purpose, government-open-data orientation, top-five recognition, and potential path to subsidy/policy implementation. The exact registration deadline and detailed 2026 rules were not retrievable in the automated review and must be verified directly in the official registration system before execution.

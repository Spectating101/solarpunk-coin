# ETHOnline 2026 Execution Plan

**Opportunity:** ETHGlobal ETHOnline 2026  
**Official status checked:** 2026-07-15  
**Event:** September 4–16, 2026  
**Format:** Async Hackathon  
**Decision:** apply; do not prebuild a project before track rules are confirmed

## 1. Core rule that changes the entire plan

ETHGlobal's official pre-existing-work rules distinguish Classic "From Scratch" tracks from approved Continuity tracks.

For Classic:

- project work begins when hacking officially begins at kickoff;
- pre-existing project-specific code, designs, or assets are not allowed.

For an approved Continuity track:

- existing code may be extended according to that track's rules;
- pre-existing work must be fully disclosed;
- substantive new functionality must be developed during the event;
- the new extension remains open source;
- prize eligibility may still vary by partner/track.

In all cases:

- pre-existing work must be disclosed in writing;
- version-control history is expected;
- undisclosed/misrepresented prior work can lead to disqualification or revoked prizes;
- projects relying mostly on pre-existing work have historically scored less well.

Therefore:

> **Do not create a hackathon-specific codebase, design deck, or project-specific implementation before kickoff unless ETHOnline publishes an applicable Continuity track and its rules expressly permit the work.**

This document is an event execution plan and rule decision tree. It is not a prebuilt hackathon submission.

## 2. Application objective

Apply as Christopher Ongko, research-system builder with:

```text
MSc Finance / Yuan Ze University
~2 years full-time Data Specialist experience
Python / ETL / research systems
public Ethereum/Sepolia reference work
shared browser/Node deterministic decision engine
financial capacity research
Cite-Agent / evidence systems
```

Application narrative:

> I build evidence-grounded research systems and have worked on Ethereum-linked evidence, policy, and claim infrastructure. I am interested in experimenting with verifiable or inspectable decision/execution boundaries during ETHOnline, but I will follow the event's pre-existing-work and track rules and build the event submission within the applicable track.

Do not imply the existing Case Workbench will be submitted unchanged.

## 3. Pre-event preparation that is safe

The following preparation is general skills/infrastructure preparation, not project-specific hack work:

```text
review Solidity / Hardhat testing
review EIP and account / signature fundamentals
review event rules
prepare clean development environment
prepare generic wallet/testnet access
practice small isolated contract deployments
review prior ETHGlobal finalist demos
prepare Git/GitHub workflow
prepare screen-recording tooling
prepare a generic 3-minute demo structure
```

Do **not** before kickoff:

```text
create hackathon-specific contracts
create project-specific receipt schemas
prepare a hackathon-specific architecture diagram
copy V2 source into a hackathon repo
prepare final branding/logo/site
record a project demo
```

## 4. Track decision gate

As soon as ETHOnline publishes the final track/prize rules, classify the opportunity.

### Path A — approved Continuity track fits

Possible continuity theme:

> extend the existing open-source decision/receipt engine with an Ethereum-native verification or admission experiment

Required actions:

1. read the exact continuity track rules;
2. obtain/record the event's approval or track eligibility where required;
3. disclose the existing repository, release history, and exact pre-event functionality;
4. create a timestamped `PRE_EXISTING_WORK.md` at kickoff;
5. branch or create a clean event repository;
6. implement only the new event scope during the event;
7. document the diff and new functionality in the submission video and README.

Possible event extension **only if continuity rules allow it**:

```text
deterministic off-chain decision
        ↓
canonical decision ID
policy hash / evidence hash
        ↓
Ethereum reference receipt object
        ↓
contract verifies declared receipt identity / issuer rule
        ↓
admission or challenge lifecycle
```

This is a candidate direction, not pre-event submission work.

### Path B — Classic / From Scratch only

Do not use Case Workbench project-specific code, designs, or assets.

At kickoff:

1. review live partner tracks and prizes;
2. select one technical problem;
3. define the project after kickoff;
4. create a fresh repository at/after kickoff;
5. commit continuously;
6. build a genuinely new experiment.

Knowledge and general engineering skills may carry over. Project-specific implementation may not.

## 5. Event selection rule

Choose a project only if all are true:

```text
uses Ethereum for a real system reason
can be explained in one sentence
has one inspectable technical primitive
has a demo path that works without a 20-minute thesis explanation
can be completed within Sep 4–16
has a clear partner/track fit if pursuing a partner prize
```

Reject ideas that are merely:

```text
put the existing app on-chain
add a token
add wallet login
mint the decision receipt as an NFT
copy SolarPunk with new branding
```

## 6. Team strategy

Recommended team size: 2–3, subject to event rules.

### Christopher

```text
system architecture
policy/decision semantics
Solidity integration
research framing
submission narrative
```

### Teammate 2 — Ethereum-first engineer

Preferred capabilities:

```text
Solidity / Foundry or Hardhat depth
signature / account abstraction / proof primitives
rapid testnet debugging
```

### Teammate 3 — product/demo engineer

Preferred capabilities:

```text
React / Next.js
wallet integration
rapid visual demo
video / narrative discipline
```

Christopher can participate without a pre-formed team if the event supports team formation, but a stronger Ethereum-native teammate would materially reduce technical execution risk.

## 7. Twelve-day execution rhythm

This is a generic event operating plan. Exact project tasks begin only after kickoff and track selection.

### Day 1 — choose and scope

```text
read final tracks
select one problem
write one-sentence claim
list pre-existing work disclosure if continuity
create repository
ship first commit
```

Output:

```text
README problem statement
architecture sketch created during event
technical risk list
single demo acceptance test
```

### Days 2–3 — technical primitive

Build the smallest core mechanism.

No landing page until the primitive has tests.

Output:

```text
contract / protocol primitive
deterministic fixture
tests
local demonstration
```

### Days 4–5 — end-to-end path

```text
browser/client input
core primitive
Ethereum interaction
result inspection
```

### Day 6 — kill decision

Ask:

```text
Does Ethereum materially matter?
Does the core demo work twice?
Can another person understand the system?
```

If no, simplify or pivot immediately.

### Days 7–8 — partner/track integration

Add only the integration required by the chosen track.

Do not integrate five sponsors.

### Day 9 — adversarial / failure states

Show:

```text
invalid input
stale identity
unauthorized action
failed verification
challenge / invalidation where relevant
```

A failure demo is valuable because Christopher's strongest systems work exposes boundaries rather than hiding them.

### Day 10 — UI and narrative

```text
one primary flow
one failure flow
one inspectable receipt/state
```

### Day 11 — submission package

```text
README
architecture
pre-existing disclosure if applicable
deployment addresses
test instructions
3-minute video
partner-prize explanations
```

### Day 12 — freeze and submit

Submit before the deadline. ETHGlobal's rules state that submission before the deadline is required for staking refund eligibility, even if the hack is partial/incomplete.

## 8. Demo structure

Three-minute maximum target:

### 0:00–0:20

Problem.

### 0:20–0:50

Why Ethereum is required.

### 0:50–1:50

Live successful path.

### 1:50–2:20

Failure / invalid path.

### 2:20–2:45

Inspect contract/receipt/state.

### 2:45–3:00

What was built during ETHOnline and what existed before, if continuity track.

## 9. Submission integrity file

For a continuity-track submission, include:

```text
PRE_EXISTING_WORK.md
```

Minimum contents:

```text
existing repo URL
existing release/tag
pre-event commit SHA
existing feature list
new ETHOnline feature list
new contracts/files
new deployment addresses
event commit range
what was deliberately not reused
```

For a Classic project, keep the repository clean and created at/after kickoff.

## 10. Go/no-go gate

Participate if:

```text
[ ] application accepted / participation confirmed
[ ] final event rules reviewed
[ ] stake/logistics acceptable
[ ] track chosen
[ ] pre-existing-work classification documented
[ ] Sep 4–16 workload is compatible with thesis/RA/FT commitments
```

Do not participate merely to add another hackathon badge if the timing would disrupt graduation or a high-value FT interview process.

## 11. Official sources checked

- ETHGlobal 2026 Events page: ETHOnline listed September 4–16, 2026 as an Async Hackathon.
- ETHGlobal Rules & Code of Conduct: staking, IP ownership, and pre-existing-work rules.

Source pages:

- https://ethglobal.com/events
- https://ethglobal.com/rules

The ETHOnline event page, partner prizes, and final track rules must be rechecked when accessible/published. This plan deliberately avoids assuming an unannounced Continuity track or sponsor prize.

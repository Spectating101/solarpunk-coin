# Ethereum Foundation ESP Opportunity Plan

**Opportunity:** Ethereum Foundation Ecosystem Support Program (ESP)  
**Official status checked:** 2026-07-15  
**Funding model:** current Wishlist / RFP items; milestone-based grants  
**Decision:** monitor live items and use Office Hours for alignment; do not submit the whole workbench as a generic grant proposal

## 1. Official eligibility boundary

ESP supports projects that improve Ethereum and strengthen its foundations for future builders.

The official scope emphasizes:

```text
free and open-source work
non-commercial / positive-sum funded outputs
builder tools
infrastructure
research
community resources
public goods
```

Support generally targets builders rather than end-user applications.

The current application process is:

```text
BROWSE live Wishlist or RFP item
        ↓
APPLY against that item
        ↓
GM + relevant EF team review
        ↓
possible interview / rescope / budget negotiation
        ↓
milestone grant structure
        ↓
ETH payment by default + identity verification + grant letter
        ↓
Grant Evaluator check-ins / milestone reviews
        ↓
public completion report or post
```

Selection criteria include:

```text
technical soundness / feasibility / clarity
ecosystem impact
open-source accessibility
cost-effective budget
relevant experience
Ethereum alignment
```

The reviewed official pages did not expose a specific current Wishlist/RFP item that can honestly be declared a match to the Case Workbench.

Therefore:

> **No ESP application should be drafted until a live official item is selected and quoted into the scope file.**

## 2. Current fit assessment

### Whole Policy Lab / Energy Standard Workbench

Fit: **5/10**.

Why not stronger:

```text
energy-linked research domain is not inherently Ethereum infrastructure
case workbench serves researchers/reviewers, not primarily Ethereum builders
current value exists even without Ethereum
existing Sepolia reference does not itself create ecosystem-wide builder impact
```

Do not submit:

> Please fund my energy-backed financial workbench because it uses Solidity.

### Narrow public-good component

Potential fit: **7–8/10 only if a live Wishlist/RFP item matches**.

Candidate open-source component:

> **Deterministic Decision Provenance and Claim-Admission Receipt SDK for Ethereum Builders**

Working scope:

```text
deterministic off-chain evaluator
        ↓
canonical decision body
        ↓
decision ID
policy hash
input / evidence hashes
calculator registry versions
        ↓
portable DecisionReceipt
        ↓
reference Ethereum verifier / admission contract
        ↓
replay / invalid identity / stale policy tests
```

This would extract a builder-facing primitive from the workbench rather than grant-funding the domain application.

## 3. The exact trust boundary to target

Current repo boundary:

> An authorized claim issuer currently asserts that deterministic off-chain policy evaluation occurred correctly. The reference EVM does not re-execute arbitrary JavaScript/Python adapter or policy logic.

This is the strongest possible ESP research question:

> **How can Ethereum applications bind an on-chain admission event to the exact identity of a deterministic off-chain decision without pretending the EVM verified arbitrary external evidence or policy code?**

The goal is not full trustlessness by marketing language.

The research space is:

```text
what identity can be verified?
what evaluator authority remains?
what policy version is bound?
what evidence/input hashes are bound?
what replay boundary is needed?
what can a reference verifier reject deterministically?
what still requires issuer/evaluator trust?
```

## 4. Do not pre-commit to the technical mechanism

Candidate mechanisms include:

```text
signed independent evaluator receipts
multi-evaluator threshold receipts
optimistic admission + challenge
narrow validity proofs for one fixed evaluator
WASM / deterministic execution identity
on-chain policy-registry binding
```

Do not promise ZK, TEE, or arbitrary off-chain execution verification before the live Wishlist/RFP defines the ecosystem problem and feasibility work is done.

ESP explicitly evaluates technical soundness and feasibility.

A smaller honest primitive is better than an ambitious unverifiable proposal.

## 5. Live item monitoring procedure

Check the official ESP How to Apply page at least monthly and whenever EF announces a new Wishlist/RFP round.

For every potentially relevant item, create one row:

```text
review_date
item_type: WISHLIST | RFP
item_title
official_item_url
EF team / owner if stated
problem statement
required output
budget guidance if stated
time constraint
relevant existing capability
missing capability
fit 0–5
reason
next action
```

Only items scoring **4/5 or higher** proceed to a fit memo.

### High-fit keywords/themes

```text
verifiable computation
decision provenance
execution authorization
policy / permission infrastructure
attestation
receipts / proof objects
replay protection
builder tooling for off-chain/on-chain boundaries
research tooling for protocol governance
```

### Low-fit themes

```text
consumer DeFi app
NFT tooling
wallet UX
energy tokenization
end-user sustainability app
```

## 6. Office Hours strategy

The official ESP site offers Office Hours for project feedback, ecosystem navigation, and advice on aligning a project with Wishlist/RFP items.

Use Office Hours **after V2 public release**.

Do not pitch a grant request in the first sentence.

### 150-word Office Hours brief

> I maintain an open-source deterministic case and decision engine developed from an energy-linked finance research project. The engine canonicalizes case, evidence/context, policy, calculator version, and rule results into a deterministic DecisionResult and receipt. A V2 claim is bound to the verified decision identity. The remaining trust boundary is explicit: an authorized issuer/evaluator still asserts that the off-chain policy evaluation was correctly performed; the reference EVM binds identities but does not re-execute arbitrary external adapters or policy logic. I am exploring whether a narrower builder-facing research/tooling component around decision provenance, evaluator receipts, replay protection, or admission verification aligns with any current ESP Wishlist/RFP priority. I am not proposing to grant-fund the full energy application and would prefer to scope against a concrete Ethereum ecosystem need.

### Questions for ESP

Ask:

1. Is this trust boundary recognized as a current builder/infrastructure problem?
2. Which live Wishlist/RFP item, if any, is closest?
3. Is the useful output a research comparison, SDK, reference verifier, or test corpus?
4. Which existing Ethereum project or standards effort should be reviewed before proposing new tooling?
5. What evidence of ecosystem demand would make a proposal credible?

Record answers verbatim where permitted.

## 7. Fit memo required before application

Create:

```text
docs/opportunities/esp/<ITEM_SLUG>_FIT_MEMO.md
```

Required sections:

```text
OFFICIAL ITEM
exact quoted problem / deliverable summary

WHY THIS IS AN ETHEREUM PROBLEM
not a SolarPunk problem

EXISTING ECOSYSTEM
projects / standards / research that already address it

GAP
what remains unsolved

PROPOSED OUTPUT
research / SDK / verifier / corpus

REUSE
what existing open-source components are relevant

NEW WORK
what grant-funded work is actually new

MILESTONES
3–5 externally verifiable milestones

BUDGET
cost by milestone / labor / infrastructure

PUBLIC GOODS BOUNDARY
license / public repository / free outputs

RISKS
technical / ecosystem / adoption
```

No application without this memo.

## 8. Candidate proposal structure if a live item matches

### Working title

> Deterministic Decision Provenance and Admission Receipt Toolkit

### Problem

Ethereum applications increasingly rely on off-chain data and computation, but an on-chain contract may only see an issuer assertion or a final value. Binding a final action to the exact off-chain decision context can be difficult without overstating what the chain verified.

### Objective

Build and evaluate an open-source toolkit that:

```text
canonicalizes decision context
binds policy/input/calculator identities
emits portable receipts
verifies identity / replay / authorization invariants on-chain
makes remaining evaluator trust explicit
```

### Possible outputs

The final list must follow the selected official item.

Candidate deliverables:

```text
1. decision-receipt specification
2. TypeScript/Node reference SDK
3. Solidity verifier / registry reference
4. deterministic conformance vectors
5. adversarial identity/replay test corpus
6. comparative research note on evaluator trust models
7. public completion report
```

### Milestone skeleton

**M1 — ecosystem review and threat model**

```text
survey existing work
formalize trust boundary
publish threat model / requirements
```

**M2 — receipt specification and conformance**

```text
canonical object
hashing rules
version semantics
test vectors
```

**M3 — reference SDK / verifier**

```text
JS/TS SDK
Solidity verifier
identity/replay tests
```

**M4 — alternative trust model experiment**

One bounded experiment selected from:

```text
multi-evaluator signatures
optimistic challenge
fixed deterministic runtime proof
```

**M5 — documentation / report**

```text
builder quickstart
limitations
public report
```

Do not promise M4 before the technical mechanism is agreed with the relevant EF team.

## 9. Budget preparation

ESP says funding depends on scope and complexity, unless the item gives budget guidance. The Grant Management team may negotiate scope and budget.

Do not invent a grant number before the specific item is known.

Budget model:

```text
milestone
estimated focused weeks
Christopher effort
collaborator effort if required
infrastructure/testing cost
external review/security budget if justified
requested amount
```

Since ESP says it generally anticipates some flexibility below standard market rates for non-dilutive capital, justify the budget from focused delivery effort rather than startup valuation.

## 10. Conflict with FITI / commercial work

ESP grant-funded outputs must remain free/open-source/publicly accessible.

FITI commercial hypothesis can still center:

```text
private evidence workspaces
operator adapters
institution policy packs
hosted licensed-data runners
consulting / implementation
```

Potential boundary:

```text
ESP PUBLIC GOOD
DecisionReceipt spec
core SDK
reference verifier
conformance tests

FITI / COMMERCIAL
private evidence integration
institution-specific policy configuration
licensed/private data runner
operator workflow implementation
```

Do not accept grant terms or make commercial claims that conflict with open-source obligations.

## 11. Go/no-go gate

Apply only when:

```text
[ ] V2 public release exists
[ ] live official Wishlist/RFP item identified
[ ] fit score >= 4/5
[ ] exact Ethereum ecosystem problem is stated without energy dependence
[ ] existing ecosystem alternatives reviewed
[ ] new public-good gap is concrete
[ ] 3–5 milestone outputs are verifiable
[ ] open-source boundary accepted
[ ] timeline is compatible with FT / thesis commitments
```

Until then:

> Office Hours / monitoring, not a grant application.

## 12. Official sources checked

- Ethereum Foundation ESP Home.
- ESP Applicants Overview / How to Apply.

Official pages establish the builder/public-goods scope, Wishlist/RFP process, selection criteria, milestone/payment process, public completion expectation, and Office Hours path.

Source pages:

- https://esp.ethereum.foundation/
- https://esp.ethereum.foundation/applicants

Always recheck the live Wishlist/RFP list before application; new items are added according to evolving ecosystem priorities.

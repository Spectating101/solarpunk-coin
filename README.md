# Policy Lab — Case-Based Constraint Research Workbench

**A public research workbench for investigating what blocks admission, what bounds financial quantity, and what fails at settlement.**

The project began as SolarPunk Public Lab and the Energy Standard thesis: an attempt to ask when external energy evidence can credibly constrain a digital financial claim. The repository now exposes that question as an inspectable research method.

> Given a declared case, evidence **E**, analytical context **C**, and versioned policy **P**, which admission rule blocks the case, which comparable quantity ceiling binds the maximum, and what happens when the resulting obligation cannot settle?

```text
case
  ↓
observed / controlled evidence + modeled context
  ↓
versioned policy
  ↓
admission gates
  ↓
quantity ceilings
  ↓
deterministic DecisionResult
  ↓
bounded claim
  ↓
settlement result
  ↓
decision receipt / lineage / reproduction
```

**Public demo:** https://spectating101.github.io/solarpunk-coin/demo/  
**G4 evaluator brief:** [`docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md`](./docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md)  
**Final research / Policy Lab reconciliation:** [`docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md`](./docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md)  
**Project recovery / source hierarchy:** [`PROJECT_RECOVERY.md`](./PROJECT_RECOVERY.md)  
**Platform blueprint:** [`docs/project/PLATFORM_BLUEPRINT.md`](./docs/project/PLATFORM_BLUEPRINT.md)  
**Implementation handoff:** [`docs/project/V2_IMPLEMENTATION_HANDOFF.md`](./docs/project/V2_IMPLEMENTATION_HANDOFF.md)

> The repository uses inherited `constraint-*` package, schema, and study namespaces internally. **Policy Lab** and **case-based constraint research workbench** are descriptive labels, not claims that the entire original SolarPunk project was permanently renamed.

---

## Five-minute investigation

The controlled energy case pack is deliberately small. It exists to demonstrate the decision structure, not to claim empirical geographic superiority. For the landed outside-data case, use the G4 evaluator brief and `PUB-AUSGRID-001P` artifacts.

### 1. Open `TYN-001` under the pilot policy

```text
decision
BLOCKED

blocking rule
MIN_PROVENANCE

required
L2

current assurance scenario
L0

quantity evaluation
NOT EXECUTED
```

### 2. Preview the declared L2 assurance counterfactual

The evidence hash stays unchanged. The assurance scenario changes explicitly and produces a new deterministic decision identity.

```text
decision
ADMIT WITH LIMIT

admitted maximum
126 ENERGY_CLAIM_UNIT

binding ceiling
PROVENANCE_POLICY_CAPACITY
```

### 3. Compare the same policy across modeled contexts

```text
TYN-001 / L2 / pilot
126
PROVENANCE_POLICY_CAPACITY binds

AUS-001 / L2 / pilot
283.09811
RESOURCE_CONTEXT_CAPACITY binds

PHX-001 / open
320
EVIDENCE_BACKED_CAPACITY binds
```

### 4. Replay settlement stress

For the admitted Taoyuan case:

```text
100% declared settlement capacity
→ SETTLED

40% declared settlement capacity
→ PARTIAL
→ 50.4 covered
→ 75.6 shortfall

0% declared settlement capacity
→ SHORTFALL
```

### 5. Inspect the receipt

Each run retains case, evidence, context, policy, calculator, and decision identity for comparison and reproduction.

The lab is designed so a reviewer can ask:

- what evidence exists?
- what is observed, controlled, modeled, declared, or derived?
- why was the case blocked?
- what bounded the admitted quantity?
- what changed in a counterfactual?
- what failed under stress?
- which exact policy and inputs produced the result?
- which research boundary remains open after the runtime decision?

---

## Research boundary model

The post-paper research model is not the same thing as the runtime pipeline.

```text
energy-adjacent observation
  ↓
R1 — economic information / admissibility
  ↓
R2 — claim-level evidence
  ↓
R3 — binding constraint
  ↓
constrained financial claim
  ↓
R4 — monetary performance
```

The runtime stages remain:

```text
Evidence → Assurance → Admission → Quantity → Settlement → Receipt
```

They are implementation stages, not aliases for R1–R4. The derived `ConstrainedClaimAssessment` maps frozen runtime artifacts to the research boundaries without changing the deterministic engine. A positive status at one boundary never cascades automatically to the next, and R4 remains untested unless real monetary-performance evidence is separately supplied.

---

## Research interface

The V2 workbench is organized around research tasks rather than repository modules.

| Surface | Research task |
|---|---|
| **Cases** | inspect a case and identify its blocking rule or binding quantity ceiling |
| **Compare** | compare case × policy decisions, capacity, and binding attribution |
| **Studies** | inspect published aggregate empirical studies and stress replays |
| **Receipts** | inspect deterministic decision identity, lineage, and export artifacts |
| **Reference** | inspect SolarPunk / SPK, Sepolia proof, and supporting research material |

The main Case Workspace uses three persistent panes:

```text
CASE IDENTITY
      │
      ├──────── DECISION WORKSPACE ────────┤
      │                                    │
      │                                    DECISION DOSSIER
```

Case lenses:

```text
Evidence
Constraints
Stress
Lineage
```

The map is a linked case surface. It is not presented as a solar atlas or GIS product.

---

## Decision semantics

The workbench keeps three constraint classes separate.

### Admission gates

Boolean or categorical rules:

```text
POSITIVE_SURPLUS
ZERO_BLOCKERS
SIGNED_EVIDENCE
MIN_PROVENANCE
EXTERNAL_CORROBORATION
```

Output:

```text
PASS | BLOCK
```

A blocked case does **not** execute quantity evaluation.

### Quantity ceilings

Rules that return a maximum in a common claim unit:

```text
EVIDENCE_BACKED_CAPACITY
PROVENANCE_POLICY_CAPACITY
RESOURCE_CONTEXT_CAPACITY
ABSOLUTE_POLICY_CAP
```

Only comparable quantity ceilings enter the binding operation:

```text
admitted maximum = minimum applicable quantity ceiling
```

The lower ceiling, or deterministic tie set, is attributed as binding.

### Settlement constraints

Settlement remains a separate lifecycle stage:

```text
outstanding claim
vs
settlement capacity
```

Output:

```text
SETTLED | PARTIAL | SHORTFALL
```

Admission, quantity, and settlement are intentionally **not** collapsed into one scalar `min()` model.

---

## Portable research objects

The shared `@solarpunk/constraint-core` package now exposes deterministic objects and rule evaluation used by Node and the browser workbench.

Key objects:

```text
CaseManifest
ContextManifest
EvidenceEnvelope
ProvenanceDecision
PolicyManifest v2
ConstraintEvaluation
DecisionResult
ClaimManifest v2
SettlementResult
DecisionReceipt
ConstrainedClaimAssessment
```

A V2 claim is bound to a verified `DecisionResult`. Claim creation recomputes the canonical decision body and rejects a stale or tampered `decision_id`.

Decision identity excludes evaluation time. Equivalent declared case, evidence, context, policy, calculator versions, and rule results should produce the same decision identity. Timestamp belongs in the receipt.

The `ConstrainedClaimAssessment` is a derived research object. It does not modify source data, promote assurance, rewrite policy decisions, or turn runtime stages into R1–R4.

Public JSON Schemas live under [`protocol/schema/`](./protocol/schema/).

---

## Data semantics and trust boundaries

The interface distinguishes:

```text
OBSERVED / CONTROLLED EVIDENCE
MODELED CONTEXT
DECLARED POLICY
DERIVED RESULT
```

The initial three-site case pack uses **controlled signed-capability fixtures** and modeled PVWatts / TMY resource contexts.

A separate landed case, `PUB-AUSGRID-001P`, exercises the pipeline against a bounded outside public dataset at actual **L0** assurance. It freezes the exact executed mirror bytes by SHA-256, preserves source and transformation warnings, produces deterministic open/pilot divergence, and verifies receipt/capsule replay. It does **not** claim that a source holder supplied or confirmed the file, and it does not close the original human owner/operator Gate 1B.

The project does **not** claim:

- verified physical meter truth;
- environmental-attribute ownership;
- legal redemption rights;
- reserve custody;
- empirical geospatial policy superiority;
- production collateral-control adequacy;
- production governance;
- mainnet readiness;
- monetary performance.

A signature establishes cryptographic consistency with a declared key/registry context. It does not establish physical truth, device custody, calibration, legal title, or settlement enforceability.

A modeled PVWatts / TMY resource value is analytical context. It is not observed meter evidence or mint authority.

A human owner/operator case, authenticated L1 path, or signed live-source L2 path would be stronger future validation. They are not silently inferred from the public-source L0 case.

---

## Published market-capacity study

The repository also contains a separate aggregate historical policy study using a licensed CRSP / Refinitiv market-capacity panel.

Delivered source package:

- 777,764 security-days;
- 2018-01-02 through 2024-12-31;
- 457 PERMNOs / 450 RICs in the delivered panel;
- source SHA-256 `792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5`;
- licence boundary `internal_yzu_licensed_no_redistribution`.

20-session common sample (`N = 734,379`):

| Policy | Historical coverage | Shortfall events | Mean permitted capacity |
|---|---:|---:|---:|
| `COLLATERAL-FIXED-20` | 97.2518% | 2.7487% | 80.0000% |
| `COLLATERAL-VOL-002` | 98.6941% | 1.3059% | 74.3669% |
| `COLLATERAL-VOL-LIQ-003` | 98.8626% | 1.1374% | 71.6849% |

The guarded reference policy added 1.61 percentage points of historical coverage relative to the fixed baseline while reducing mean permitted capacity by 8.32 percentage points.

The 2020-02-21 stress replay remains intentionally visible: the fixed baseline produced 91.31% shortfall events; the volatility + liquidity rule reduced the rate to 80.52% and still failed badly.

This study demonstrates policy trade-offs and binding-capacity attribution in a separate empirical domain. It does **not** prove the Energy Standard thesis or validate the controlled energy case pack.

No licensed CRSP or Refinitiv row-level observations are redistributed. The public study exposes aggregates, formulas, sample definitions, source-package identity, and exact aggregate-file hashes.

---

## SolarPunk / Energy Standard reference

The original project is SolarPunk Public Lab / the Energy Standard project.

The retained research asks a bounded question:

> Under what empirical and institutional conditions can energy evidence impose a credible constraint on a digital financial claim?

The Constrained Ledger institutional conditions are:

1. reliable evidence;
2. rule-bound issuance;
3. uncertainty priced with a model appropriate to the resource;
4. defined settlement and shortfall consequence;
5. limited governance.

The workbench operationalizes only the parts software can represent honestly. It does not turn a controlled mechanism into a claim that all institutional conditions are satisfied.

SPK remains a testnet reference application.

| Contract | Sepolia address |
|---|---|
| SolarPunkCoin lab unit | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SolarPunkCurrencySystem | `0x520162252F9B94824417678525FFd69145014970` |

SPK is not legal money, a stablecoin, a token sale, or a legal claim on delivered energy.

---

## Quick start

```bash
npm install

# Deterministic core, schemas, case-pack and decision conformance
node --test packages/constraint-core/test/*.test.mjs

# SDK/package contents
npm pack --dry-run --prefix packages/constraint-core

# Reference EVM tests
npx hardhat test test/ConstraintProtocol.test.js
npx hardhat test

# Frontend
cd frontend
npm install
npm run test:run
npm run build
npm run dev
```

Case Workbench browser review from repository root, with the Vite preview at `127.0.0.1:4173`:

```bash
node scripts/capture_case_workbench_v2.mjs _review_case_workbench_v2
```

The current V2 review workflow covers 15 desktop/mobile investigation states including blocked admission, an explicit L2 assurance fork, binding-ceiling inspection, 3 × 3 comparison, partial settlement stress, lineage, receipt/capsule inspection, the market-capacity study, SolarPunk reference, and mobile states.

The bounded Ausgrid public-source workflow is `.github/workflows/external-case-001p-ausgrid.yml`. Its uploaded artifact includes the source mirror, case/evidence/decision/settlement/receipt/capsule objects, verifier output, and the derived `constrained-claim-assessment.json`.

---

## Project map

| Track | Location |
|---|---|
| V2 case workbench core | `packages/constraint-core/src/` |
| V2 schemas | `protocol/schema/` |
| V2 policy manifests | `protocol/policies-v2/` |
| Controlled energy case pack | `protocol/cases/energy-v1/` |
| Case workbench frontend | `frontend/src/cases/`, `frontend/src/compare/`, `frontend/src/receipts/` |
| Market-capacity empirical study | `frontend/public/empirical/`, `docs/protocol/EMPIRICAL_RUNS_V1.md` |
| SolarPunk reference application | `docs/product/`, `state/runtime/`, `spk_v1/` |
| Final research / Policy Lab semantics | `docs/research/FINAL_RESEARCH_POLICY_LAB_RECONCILIATION.md` |
| G4 evaluator path | `docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md` |
| Thesis support material | `thesis_package/` |

---

## Research and release posture

This repository is a public research-software artifact and experimental workbench.

The current evidence posture is:

1. the CF-based C0–C2 conformance archive is frozen;
2. public outside-data operability is landed through `PUB-AUSGRID-001P` at actual L0;
3. the four-boundary assessment is derived from frozen runtime artifacts rather than a new decision engine;
4. the next value step is hostile evaluator review and external verdicts, not broader product construction;
5. human owner/operator Gate 1B and stronger L1/L2 authentication remain optional future validation layers and must stay visibly separate from the public-source case.

The project stop rule is intentional. More locations, AI assistants, new policy families, GIS infrastructure, backends, contracts, or token work are not added merely to make the repository look larger.

Cite via [`CITATION.cff`](./CITATION.cff). GitHub release / archival guidance is recorded in [`docs/project/PUBLIC_CONVERSION_PLAYBOOK.md`](./docs/project/PUBLIC_CONVERSION_PLAYBOOK.md).

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
**Project recovery / source hierarchy:** [`PROJECT_RECOVERY.md`](./PROJECT_RECOVERY.md)  
**Platform blueprint:** [`docs/project/PLATFORM_BLUEPRINT.md`](./docs/project/PLATFORM_BLUEPRINT.md)  
**Implementation handoff:** [`docs/project/V2_IMPLEMENTATION_HANDOFF.md`](./docs/project/V2_IMPLEMENTATION_HANDOFF.md)

> The repository uses inherited `constraint-*` package, schema, and study namespaces internally. **Policy Lab** and **case-based constraint research workbench** are descriptive labels, not claims that the entire original SolarPunk project was permanently renamed.

---

## Five-minute investigation

The controlled energy case pack is deliberately small. It exists to demonstrate the decision structure, not to claim empirical geographic superiority.

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
```

A V2 claim is bound to a verified `DecisionResult`. Claim creation recomputes the canonical decision body and rejects a stale or tampered `decision_id`.

Decision identity excludes evaluation time. Equivalent declared case, evidence, context, policy, calculator versions, and rule results should produce the same decision identity. Timestamp belongs in the receipt.

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

It does **not** claim:

- real operator validation;
- verified physical meter truth;
- environmental-attribute ownership;
- legal redemption rights;
- reserve custody;
- empirical geospatial policy superiority;
- production collateral-control adequacy;
- production governance;
- mainnet readiness.

A signature establishes cryptographic consistency with a declared key/registry context. It does not establish physical truth, device custody, calibration, legal title, or settlement enforceability.

A modeled PVWatts / TMY resource value is analytical context. It is not observed meter evidence or mint authority.

The next field-value gate is one real L2 operator / inverter / gateway evidence source.

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

The thesis asks a bounded question:

> Can energy act as a credible constraint for digital money through energy-linked financial contracts, and what conditions are needed for that constraint to work?

Its five-constraint architecture is:

1. reliable energy data;
2. rule-bound issuance;
3. explicit pricing and risk controls;
4. protected settlement and redemption accounting;
5. limited governance.

The workbench operationalizes those concerns as explicit research stages. It does not replace the thesis with a generic policy-engine claim.

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
| Thesis support material | `thesis_package/` |
| Product / thesis direction | `docs/project/CASE_WORKBENCH_PRODUCT_AND_THESIS_DIRECTION.md` |

---

## Research and release posture

This repository is a public research-software artifact and experimental workbench.

The current high-value next steps are deliberately external:

1. publish the validated static workbench;
2. integrate the implemented decision architecture into the thesis surgically;
3. obtain one real operator / inverter / gateway evidence case;
4. only then consider arbitrary evidence → local V2 case creation or a domain-specific risk calculator.

The project stop rule is intentional. More locations, AI assistants, new policy families, GIS infrastructure, backends, or contracts are not added merely to make the repository look larger.

Cite via [`CITATION.cff`](./CITATION.cff). GitHub release / archival guidance is recorded in [`docs/project/PUBLIC_CONVERSION_PLAYBOOK.md`](./docs/project/PUBLIC_CONVERSION_PLAYBOOK.md).

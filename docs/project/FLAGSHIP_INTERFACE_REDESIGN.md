# Flagship interface redesign

## Decision

The deployed interface is a primary project output, not presentation wrapped around the protocol.

The flagship experience must let a first-time visitor understand the system by watching one real decision sequence:

```text
claim submitted
→ admission rules run
→ blocked or admitted with limit
→ controlling rule identified
→ scenario changed without rewriting evidence
→ decision stressed and replayed
→ receipt inspected
```

The protocol, evidence identities, policy semantics, settlement logic, receipts, and capsules remain frozen during this interface phase.

## Visual benchmark conclusions

The useful benchmark is not another green-token dashboard. The interface borrows interaction patterns from high-end investigation, incident, governance, and compliance systems:

- **Case systems:** one selected object, one visible status, one obvious next action.
- **Incident systems:** a durable record of what changed, why it changed, and when.
- **Compliance systems:** controls and evidence are paired, with gaps made more visible than completion theatre.
- **Decision-intelligence systems:** the selected decision dominates; supporting data remains inspectable in adjacent layers.

The product should not imitate their density or branding. It should preserve its own distinctive sequence:

```text
INPUT → CHECKS → VERDICT → WHY → WHAT CHANGED → NEXT ACTION
```

## Flagship composition

### Decision layer

The first screen must make these facts visually dominant:

- case and submitted quantity;
- declared assurance and policy;
- blocked or admitted verdict;
- permitted quantity when admission passes;
- primary blocking or binding rule;
- decision identity.

### Investigation layer

The full workspace then explains the verdict through:

- Constraints;
- Evidence;
- Stress;
- Lineage;
- Receipt.

### Proof layer

Studies and reproduction material answer whether the policy behaviour survives historical and byte-level scrutiny. Controlled energy cases and the licensed market study remain separate datasets connected by method, not merged into one empirical claim.

## Current implementation tranche

`agent/flagship-decision-experience` rebuilds the public front door around the canonical TYN-001 decision:

1. 180 eligible kWh enter under `ENERGY-CASE-PILOT-005`.
2. L0 assurance blocks on `MIN_PROVENANCE`.
3. Quantity evaluation remains unexecuted.
4. A declared L2 counterfactual preserves the evidence hash.
5. The decision changes to `ADMIT_WITH_LIMIT`.
6. The maximum becomes 126 `ENERGY_CLAIM_UNIT`.
7. `PROVENANCE_POLICY_CAPACITY` becomes the binding ceiling.
8. The selected state carries into the full Case Workspace.

## Visual acceptance gate

The tranche does not pass merely because tests and builds pass. Review desktop and mobile screenshots against these questions:

1. Does a blurred screenshot still read as a consequential decision system?
2. Is `BLOCKED` or `126` more visually dominant than architecture prose?
3. Can the visitor tell what changed without believing the solar evidence changed?
4. Is the next action obvious?
5. Do technical IDs remain available without becoming the primary interface language?
6. Does mobile preserve the same decision hierarchy?
7. Does the page look like a complete product rather than documentation about one?

## Next sequence

After the landing vertical slice survives visual review:

```text
Compare + Stress composition
→ Receipts + Studies composition
→ Reference annex subordination
→ final recorded walkthrough and portfolio package
→ real operator validation
```

No new AI, GIS, database, token, chain, or policy-engine functionality belongs in this sequence.

# Policy Lab — Five-Minute Demo Walkthrough

**Current as of 2026-08-24.**  
This is the reviewer-facing walkthrough for the current Policy Lab artifact.

Live workbench: https://spectating101.github.io/solarpunk-coin/demo/

Canonical public-evidence brief: [`docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md`](./docs/research/POLICY_LAB_G4_EVALUATOR_BRIEF.md)

## What the reviewer is testing

The intended question is:

> **Can Policy Lab take an outside energy-evidence object, preserve what is and is not known about it, apply explicit constraints reproducibly, and make the stopping point inspectable?**

The demo is **not** intended to prove an energy-backed currency, legal issuance, production readiness, or market adoption.

---

## Part A — start with the real outside-data case

Use:

```text
PUB-AUSGRID-001P
```

The case uses a bounded seven-day window from public Ausgrid Solar Home Electricity Data.

Key source facts:

```text
336 half-hour intervals
actual assurance: L0
eligible derived surplus: 33.066 kWh
```

The executed evidence object preserves source and transformation warnings.

Important interpretation:

> Public availability and hash custody do not turn the source into trusted operator provenance.

The derived surplus is also not represented as a directly metered export channel.

---

## Part B — same evidence, different policy consequence

Run the same evidence under the open research policy:

```text
LAB-CASE-OPEN-004
```

Expected result:

```text
ADMIT_WITH_LIMIT
33.066 kWh maximum
EVIDENCE_BACKED_CAPACITY binds
```

Now evaluate the same normalized evidence under the stricter pilot policy:

```text
ENERGY-CASE-PILOT-005
```

Expected result:

```text
BLOCKED
SIGNED_EVIDENCE
MIN_PROVENANCE
```

The central point is:

```text
same outside evidence
→ same normalized evidence object
→ different declared policy
→ different deterministic consequence
```

Nothing about the stricter policy failure is repaired by pretending the source has stronger assurance than it actually does.

---

## Part C — inspect why the result happened

The reviewer should be able to distinguish:

### Admission gates

Categorical rules that decide whether quantity evaluation is allowed to proceed.

Typical outcomes:

```text
PASS | BLOCK
```

A blocked case never reaches quantity evaluation.

### Quantity ceilings

Comparable rules that return a maximum claim quantity.

The admitted maximum is the minimum applicable comparable ceiling, with the binding rule or deterministic tie set retained.

For the public Ausgrid case under the open policy:

```text
33.066 kWh
EVIDENCE_BACKED_CAPACITY binds
```

### Settlement constraints

Settlement remains separate from admission and quantity.

The fact that a bounded claim was admitted does not prove it can settle.

---

## Part D — stress settlement

Apply the declared 40% settlement-capacity scenario to the admitted open-policy quantity.

Expected result:

```text
PARTIAL
13.2264 kWh covered
19.8396 kWh shortfall
```

Interpretation:

> This is a deterministic settlement/accounting stress demonstration. It is not evidence of legal delivery, redemption, reserve custody, or enforceable settlement.

---

## Part E — inspect receipt, capsule, and replay

The reviewer should be able to trace the result through durable identities and artifacts, including:

```text
case identity
evidence hash
context identity
policy identity/version
constraint evaluation
decision ID
settlement result
receipt / capsule identity
source/runtime revision
```

The public case has been reproduced from portable artifacts, and the derived assessment can be rebuilt by the closed-world verifier.

The goal is not merely that the interface displays a result. The goal is that the result can be inspected and reproduced from declared inputs and rules.

---

## Part F — inspect the Constrained Claim Assessment

The derived assessment maps the frozen runtime artifacts onto the research model.

Current public-case result:

```text
R1 — economic information       NOT_ASSESSED
R2 — claim-level evidence       PARTIAL
R3 — binding constraint         PARTIAL
R4 — monetary performance       UNTESTED
```

R3 detail:

```text
rule-bound issuance/admission   SUPPORTED
uncertainty pricing             OPEN
settlement/delivery             PARTIAL
bounded governance              NOT_ASSESSED
```

Stable audited assessment identity:

`088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc`

A positive state at one boundary never promotes the next boundary automatically.

---

# Optional controlled-case extension

After the public Ausgrid case is understood, use the controlled case pack to demonstrate explicit counterfactual reasoning.

Example:

```text
TYN-001
L0 assurance
ENERGY-CASE-PILOT-005
```

Expected result:

```text
BLOCKED
MIN_PROVENANCE
required L2
current L0
quantity evaluation NOT EXECUTED
```

Now change only the declared assurance scenario:

```text
L0 → L2
```

Expected result:

```text
evidence hash unchanged
decision identity changes
ADMIT_WITH_LIMIT
126 ENERGY_CLAIM_UNIT
PROVENANCE_POLICY_CAPACITY binds
```

This is a declared counterfactual. It does **not** retroactively convert the controlled evidence into real L2 operator evidence.

The controlled case pack is useful for teaching decision structure and counterfactual semantics. The Ausgrid case is the current public outside-data evidence gate.

---

## What a successful five-minute review should establish

Without prior coaching, the reviewer should be able to explain:

1. what evidence is being evaluated;
2. why its assurance remains limited;
3. why the same evidence can be admitted by one policy and blocked by another;
4. which rule binds an admitted quantity;
5. why settlement remains a separate failure stage;
6. how the result can be traced/reproduced;
7. which R1–R4 research boundaries remain unresolved.

If those points are unclear, treat the failure as packaging/demo-clarity evidence.

---

## Explicit non-claims

The current demo does not establish:

- source-holder/operator confirmation;
- physical meter certification;
- L1/L2 authentication for the public case;
- environmental-attribute ownership;
- legal issuance authority;
- enforceable settlement or redemption;
- economically optimal policy/pricing;
- bounded production governance;
- production security/commercial readiness;
- adoption, circulation, liquidity, acceptability, unit-of-account use, or money.

---

## Historical SPK / Sepolia reference

The repository retains the SolarPunk / SPK Sepolia implementation as historical/reference material. It may be useful after the Policy Lab method is understood, but it is no longer the default reviewer walkthrough.

For historical testnet details, inspect the relevant `docs/product/`, `state/runtime/`, `spk_v1/`, contract, and proof artifacts.

Do not start a current Policy Lab demonstration by presenting token issuance, wallet interaction, or Sepolia transactions.

---

## Closing line

A concise reviewer-facing close is:

> Policy Lab does not claim that the current evidence deserves monetary status. It makes the stopping point explicit: what the evidence can justify under one declared policy, what a stricter policy refuses, what quantity binds, what settlement stress breaks, and which research boundary still needs evidence next.

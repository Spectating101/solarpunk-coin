# Policy Lab — Judge Demo and Q&A

**Purpose:** keep live demos and judge answers short, concrete, and bounded to current evidence.

## 10-second opening

> **If a financial claim says real-world evidence backs it, Policy Lab makes it prove exactly how much that evidence can justify.**

Then immediately show the outside-data checkpoint.

## 30-second demo

### Screen 1 — same evidence

Say:

> “This is a pinned outside Ausgrid dataset. Policy Lab preserves its actual assurance at L0 instead of treating public availability as verified source truth.”

Point to:

- `PUB-AUSGRID-001P`
- Ausgrid
- L0
- 336 intervals

### Screen 2 — change policy, not evidence

Say:

> “Under the open research policy, the evidence is admissible but only up to 33.066 kWh. Evidence-backed capacity is the binding ceiling.”

Then:

> “Under the stricter pilot policy, the same evidence is blocked because signed evidence and stronger provenance are required.”

The line to remember:

> **Same evidence. Different policy. Different financial consequence.**

### Screen 3 — settlement failure

Set or show 40% settlement capacity.

Say:

> “Admission still does not guarantee settlement. The admitted claim becomes partial: 13.2264 covered, 19.8396 short.”

### Screen 4 — proof trail

Open receipt / lineage / assessment.

Say:

> “Every result retains the evidence identity, policy version, evaluated rule, decision identity and unresolved boundary so another evaluator can challenge or reproduce it.”

Stop.

Do **not** spend the first 30 seconds explaining R1–R4, SPK history, token contracts, the thesis genealogy, or every schema.

## 90-second version

> “A lot of financial infrastructure depends on external evidence, but there is usually a hidden step between ‘we have data’ and ‘this data authorizes financial value.’ Policy Lab makes that step explicit.
>
> Here is a real outside public Ausgrid dataset. We keep it at L0 assurance. Under one declared policy, it can support a bounded 33.066 kWh claim. Under a stricter policy, the exact same evidence is blocked because the provenance requirements are higher.
>
> Even after a claim is admitted, Policy Lab keeps settlement separate. At 40% declared settlement capacity, only 13.2264 kWh is covered and 19.8396 remains short.
>
> The result is not just a dashboard number. The engine preserves the case, evidence hash, policy version, binding rule, decision identity, receipt and assessment so the reasoning path can be reproduced.
>
> The current public case does not claim operator validation, legal issuance, physical meter certification or monetary performance. The point is precisely to show where justification stops instead of silently promoting it.”

## Three-minute technical version

Use this only after the judge understands the problem.

1. Show the runtime chain: Evidence → Assurance → Policy → Admission → Quantity → Settlement → Receipt.
2. Explain that admission is gate-based, not a generic confidence score.
3. Explain that quantity uses comparable ceilings and returns the binding constraint.
4. Show one blocked and one admitted result from the same evidence.
5. Show settlement as a separate consequence.
6. Show deterministic identity / receipt / portable assessment package.
7. Show explicit non-claims and unresolved research boundaries.

## Judge Q&A

### “So is this a stablecoin?”

No.

> “The current system is a research and verification layer for evidence-backed financial claims. It explicitly does not claim currency, stablecoin, legal-money, reserve or R4 monetary status.”

### “What is the innovation?”

> “Most systems collapse several different questions into one result. Policy Lab separates whether evidence exists, whether policy accepts it, how much it can justify, whether it can settle, and whether anything beyond that has actually been demonstrated. It attributes the exact blocking or binding rule and preserves a reproducible decision identity.”

### “Isn’t this just an oracle?”

> “An oracle delivers data. Policy Lab asks what that evidence is allowed to authorize under an explicit policy and how much. It begins after data delivery.”

### “Isn’t this just a rules engine?”

> “A conventional rules engine can execute declared rules. Policy Lab adds typed evidence/assurance boundaries, comparable quantity ceilings, explicit settlement failure, deterministic decision identity, portable assessment artifacts, and research-boundary non-promotion. The rules are part of the contribution, but the auditable evidence-to-authority chain is the larger object.”

### “Why do you need blockchain?”

> “The current Policy Lab core does not need a blockchain. The historical SPK/Sepolia implementation is preserved as a reference application. A blockchain can enforce or timestamp a decision, but it cannot improve weak evidence or justify the rule itself.”

### “Who would use this?”

Safe answer:

> “The current implementation is an energy-linked research workbench. The architecture is relevant to teams that need external evidence to authorize financial consequences: tokenized assets, collateral/reserve claims, environmental claims, insurance triggers or institutional policy engines. We do not yet claim a production customer or pilot.”

### “What does the Ausgrid case prove?”

> “Operability against one bounded outside public dataset. It proves the engine can preserve a weak L0 evidence boundary, apply different policies deterministically, bound or block the claim, stress settlement and reproduce the result. It does not prove source-holder custody, physical meter truth or commercial validation.”

### “Why is L0 useful if it is weak?”

> “Because a robust system should not require pretending weak evidence is strong. The L0 case shows the system can still produce a bounded research result while refusing stronger claims that the evidence cannot support.”

### “Why 33.066?”

> “That is the eligible quantity derived from the bounded outside-data window. Under the open policy the evidence-backed-capacity ceiling binds at exactly that amount. The point is not that 33.066 is economically optimal; the point is that the system can explain why the permitted amount is no larger than the evidence supports.”

### “Why does the stricter policy block it?”

> “Because `SIGNED_EVIDENCE` and `MIN_PROVENANCE` fail at actual L0 assurance. The same evidence does not become better merely because a different user wants a stricter financial use.”

### “What happens when settlement fails?”

> “Settlement is represented separately from admission. At 40% capacity the result is `PARTIAL`: 13.2264 covered and 19.8396 short. That prevents ‘valid claim’ from being confused with ‘guaranteed redemption.’”

### “What is your strongest technical evidence?”

> “Deterministic constraint-core tests, versioned schemas and policies, outside-data CI, reproducible decision identities, receipt/capsule generation, a portable Claim Assessment Package, browser/public-bundle verification, and full regression/security CI.”

### “What is your biggest weakness?”

For an applied/research judge:

> “Independent owner/operator validation. We have a real outside public-data checkpoint, but not yet an attributable source-holder case with authenticated custody.”

For a commercialization judge:

> “The missing institutional pilot and market-validation layer is the major gap. We do not try to hide that with presentation.”

### “What would you do next if selected?”

> “Use the current frozen core on one attributable owner/operator evidence source, preserve the source/custody boundary, record where the current policy fails, and change the system only where that outside evidence demonstrates a real need.”

## Things never to say

Do not say:

- “Policy Lab validates energy-backed money.”
- “The Ausgrid case is an operator pilot.”
- “The data is verified because it is public.”
- “The receipt proves physical delivery.”
- “Blockchain makes the evidence trustworthy.”
- “R4 is complete.”
- “We have product-market fit.”
- “This is production-ready financial infrastructure.”

## Demo failure recovery

If the live site fails, use the canonical facts only:

```text
PUB-AUSGRID-001P
L0
336 intervals
open policy → ADMIT_WITH_LIMIT → 33.066 kWh
pilot policy → BLOCKED → SIGNED_EVIDENCE + MIN_PROVENANCE
40% settlement → PARTIAL → 13.2264 covered / 19.8396 short
integrity / schema / reproduction → PASS
R1 NOT_ASSESSED / R2 PARTIAL / R3 PARTIAL / R4 UNTESTED
```

Do not improvise stronger evidence claims to compensate for a demo failure.

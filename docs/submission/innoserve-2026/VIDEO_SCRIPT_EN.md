# Policy Lab — InnoServe 2026 Three-Minute English Video Script

**Target:** approximately 2:40–2:55 spoken at a natural pace.  
**Important for IC:** narration must be spoken by a team member. Do not use AI/software-generated spoken narration.

## 0:00–0:20 — Hook

**On screen:** Policy Lab title + outside-data checkpoint.

**Speak:**

> Financial systems increasingly depend on real-world data. But there is a hidden question between “we have evidence” and “this evidence can authorize financial value.” How much can the evidence actually justify? Policy Lab makes that decision visible, bounded, and reproducible.

## 0:20–0:45 — The problem

**On screen:** simple chain: Data → ? → Financial Claim.

**Speak:**

> Having data does not mean the data is trustworthy enough for every use. Having evidence does not automatically give authority to make a financial claim. Passing a policy does not mean unlimited quantity, and a valid claim does not guarantee settlement. Existing systems often hide these transitions inside models, rules, contracts, or institutions.

## 0:45–1:10 — What the system does

**On screen:** Evidence → Assurance → Policy → Admission → Quantity → Settlement → Receipt.

**Speak:**

> Policy Lab separates those stages. It preserves the evidence identity and assurance level, applies an explicit versioned policy, records the exact rule that blocks a claim or the ceiling that limits its quantity, then evaluates settlement separately. Every result keeps a deterministic identity and proof trail for inspection and replay.

## 1:10–1:55 — The outside-data demo

**On screen:** `PUB-AUSGRID-001P`, L0, open/pilot comparison.

**Speak:**

> Here is our public outside-data checkpoint using a pinned Ausgrid dataset with 336 half-hour intervals. We deliberately keep the source at its actual L0 assurance. Under our open research policy, the evidence is admitted with a maximum of 33.066 kilowatt-hours. Evidence-backed capacity is the binding ceiling.
>
> Now we keep the evidence exactly the same and apply a stricter pilot policy. The result changes to blocked, because signed evidence and stronger provenance are required.

**On screen:** emphasize 33.066 vs BLOCKED.

**Speak:**

> Same evidence. Different policy. Different financial consequence.

## 1:55–2:20 — Settlement failure

**On screen:** settlement at 40%.

**Speak:**

> Admission is still not the end. When we stress the admitted claim at forty percent settlement capacity, the result becomes partial. 13.2264 kilowatt-hours are covered and 19.8396 remain short. Policy Lab therefore refuses to confuse a justified quantity with guaranteed redemption or delivery.

## 2:20–2:40 — Reproducibility

**On screen:** receipt / lineage / verification screenshot.

**Speak:**

> The result is not only a dashboard number. Policy Lab retains the evidence hash, policy version, evaluated rules, decision identity, settlement result, receipt, and portable assessment. Our CI verifies schema integrity and deterministic decision reproduction.

## 2:40–2:58 — Value and boundary

**On screen:** “What can the evidence actually authorize?” + target domains.

**Speak:**

> Policy Lab can support research and system design wherever external evidence is expected to authorize financial consequences, from energy-linked claims to tokenized assets, collateral, insurance, and institutional policy engines. These are application directions, not current customer claims.

## 2:58–3:00 — Closing

**On screen:** Policy Lab logo/title + live URL.

**Speak:**

> Policy Lab asks one question: what can the evidence actually authorize?

## Recording notes

- Record at 1080p or higher if practical.
- Use the live workbench for the core demo, not slides only.
- Keep cursor movement deliberate and large enough to follow.
- Show `L0`, `33.066`, `BLOCKED`, and `PARTIAL` clearly.
- Do not spend video time on historical SPK, R1–R4 definitions, repository archaeology, or every schema.
- If a live action is unreliable during recording, use the CI-generated screenshots but keep the narration factual.
- Do not call the Ausgrid checkpoint an operator pilot.
- Do not claim stablecoin, currency, legal issuance, physical meter certification, product-market fit, or R4 monetary performance.

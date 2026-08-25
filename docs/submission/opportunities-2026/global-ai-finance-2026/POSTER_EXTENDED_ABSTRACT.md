# Global AI Finance Research Conference 2026 — Poster Extended Abstract

**Submission type:** Work-in-progress poster  
**Deadline:** 2026-08-31  
**Conference:** 2026-12-14 to 2026-12-15, Taiwan  

## Title

**When Does Evidence Justify a Financial Claim? An Auditable Constraint Workbench for Admission, Quantity, and Settlement**

## Extended abstract

Financial systems increasingly rely on facts measured outside the financial system itself: reserve balances, collateral states, energy production, environmental certificates, asset valuations, insurance events, and other externally observed conditions. But establishing that a data object exists—or even that it is cryptographically intact—does not answer three further questions: whether the evidence is sufficient for a particular financial use, how much financial quantity it can justify, and whether the resulting obligation can actually settle.

We present **Policy Lab**, an executable research workbench for studying those transitions separately. A case enters the workbench with an evidence object and an explicit assurance state. A versioned policy then determines admission. If admission succeeds, quantity is bounded independently by comparable ceilings and the binding constraint is reported. Settlement is evaluated as a later stage rather than being inferred from admission. The resulting decision retains stable identities for the case, evidence, policy, calculation, decision, and assessment so that the reasoning chain can be reproduced and challenged.

The design is intentionally conservative about evidence. Hashing, packaging, receipts, or downstream policy execution cannot silently strengthen what the source evidence itself supports. Likewise, passing an admission rule does not authorize an arbitrary requested amount, and a valid bounded claim does not imply successful settlement. The workbench therefore treats evidence assurance, authorization, quantity, and settlement as related but non-interchangeable objects.

We demonstrate the method on a pinned public Ausgrid dataset containing 336 half-hour intervals from 1–7 July 2012. The source is retained at its observed **L0** assurance level. Under an open research policy, the evidence produces **ADMIT WITH LIMIT**, with a maximum supported quantity of **33.066 kWh**; evidence-backed capacity is the binding ceiling. The identical evidence evaluated under a stricter pilot policy is **BLOCKED** because the policy requires signed evidence and stronger provenance. No change to the underlying evidence is needed to produce the different policy consequence.

We then stress the admitted quantity with settlement capacity fixed at 40%. Settlement becomes **PARTIAL**: **13.2264 kWh** is covered and **19.8396 kWh** remains short. The upstream evidence and admission decision are not rewritten by this failure. This separation makes visible a class of overclaim that is easy to miss when evidence verification, authorization, quantity, and settlement are collapsed into a single success state.

The public case is deliberately limited. It does not establish authenticated operator custody, certified physical meter truth, legal issuance authority, enforceable redemption, production readiness, or monetary adoption. Nor does the experiment show that the chosen policy thresholds are economically optimal. Its contribution is methodological: it provides an executable way to inspect where a proposed evidence-backed financial claim is admitted, bounded, or stopped, and to preserve the identities needed to reproduce that result.

The poster will present the outside-data case, the open-versus-strict policy divergence, the binding quantity ceiling, the settlement shortfall, and the deterministic decision lineage. More broadly, the work is relevant to FinTech settings in which external evidence is expected to authorize financial consequences, including tokenized real-world assets, reserve and collateral claims, energy or environmental certificates, insurance triggers, and institutional policy engines. The work-in-progress question is not whether one universal policy can decide such claims, but whether the seams between **evidence → authorization → quantity → settlement** can be made explicit enough to inspect, vary, and challenge.

## Keywords

FinTech; evidence-backed finance; financial infrastructure; policy-as-code; auditability; reproducibility; settlement; tokenized assets; Green FinTech

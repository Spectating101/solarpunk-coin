# Global AI Finance Research Conference 2026 — Poster Extended Abstract

**Submission type:** Work-in-progress poster  
**Deadline:** 2026-08-31  
**Conference:** 2026-12-14 to 2026-12-15, Taiwan; in-person only  

## Title

**When Does Evidence Support a Financial Claim?**

## Extended abstract

Financial claims tied to real-world assets or events often begin with an external data source. Verifying that source is only the first step. Even when a data object is intact, a decision-maker still has to decide whether it is good enough for a particular financial use, how much it can support, and what happens if the resulting obligation cannot be settled.

This project develops Policy Lab, a deterministic workbench for keeping those decisions separate. It records the assurance level of the evidence, evaluates a declared policy, calculates any quantity limit implied by the evidence and policy, and treats settlement as a later step. The aim is not to prescribe a universal policy. It is to make the points of judgment visible: why a claim was admitted, why it was capped at a particular amount, or why it was rejected.

The current demonstration uses a pinned public subset of Ausgrid's Solar Home Electricity Data: 336 half-hour intervals from 1 to 7 July 2012. Because the copy used here is public data without authenticated source-holder custody for this case, it remains at L0 assurance. Under an open research policy, the case is admitted with a maximum of 33.066 kWh, with evidence-backed capacity as the binding limit. Under a stricter policy requiring signed evidence and stronger provenance, the same evidence is blocked. The data have not changed; the rule governing their financial use has.

A second exercise fixes settlement capacity at 40% of the admitted amount. Of the 33.066 kWh claim, 13.2264 kWh is covered and 19.8396 kWh remains short. The shortfall does not retroactively make the evidence false or change the earlier admission decision. It is a separate failure at a later stage.

The result is deliberately narrow. A public data object can be processed reproducibly without being promoted to authenticated evidence; admission can succeed without authorizing an arbitrary amount; and settlement can fail without changing what was previously established. The project does not establish operator-verified energy production, legal issuance authority, enforceable redemption, monetary adoption, or an economically optimal policy. The poster asks a simpler question: once external evidence enters a financial decision, can the points of judgment and failure be made explicit enough to audit and reproduce?

## Keywords

FinTech; evidence-backed finance; financial claims; auditability; settlement; Green FinTech

## Submission boundary

The worked case uses a pinned public subset of Ausgrid's Solar Home Electricity Data. Do not describe it as authenticated operator evidence, an institutional pilot, or validation of a currency/monetary system.

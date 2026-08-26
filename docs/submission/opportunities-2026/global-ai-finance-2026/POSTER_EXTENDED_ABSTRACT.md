# Global AI Finance Research Conference 2026 — Poster Extended Abstract

**Submission type:** Work-in-progress poster  
**Deadline:** 2026-08-31  
**Conference:** 2026-12-14 to 2026-12-15, Taiwan; in-person only  

## Title

**Evidence, Policy, and Settlement in Energy-Linked Financial Claims**

## Extended abstract

**Research question.** Financial claims linked to assets or events outside the financial system depend on more than obtaining a data feed. Oracle systems address how external data reaches a contract, verifiable credentials address provenance and technical verifiability, proof-of-solvency systems address reserve sufficiency, and policy engines make decision rules explicit [1–4]. A separate question remains once the evidence is available: what does that evidence actually authorize? In particular, evidence quality, policy admissibility, the physical quantity a claim may carry, and later settlement need not be the same decision.

**Design.** We study this separation using Policy Lab, a deterministic research workbench. The experiment holds one evidence object fixed and changes only the declared policy applied to it. The policies are research configurations used for sensitivity analysis; they are not calibrated, institutionally endorsed, or claimed to be optimal. Quantity is evaluated before monetary valuation: the system asks how much underlying physical quantity is supported by the admitted evidence, not what that quantity is worth in currency or in a market.

**Worked case.** The case uses Ausgrid's Solar Home Electricity Data, which contains half-hour residential load and rooftop-PV generation measurements [5]. We select one de-identified customer and seven days of actual generation and consumption observations from 1–7 July 2012, giving 336 half-hour intervals. For each interval, surplus is calculated conservatively as `max(PV generation - general load - controlled load, 0)`. The resulting weekly surplus is **33.066 kWh**. This is a derived surplus quantity, not a directly metered export channel. The archived source bytes and normalized evidence object are pinned for reproduction, but the research copy has no source-holder-confirmed custody or operator signature; it therefore remains in the workbench's lowest assurance tier (**L0**).

**Results.** Under the open research policy, which requires positive surplus and no evidence-level blockers, the evidence-supported quantity is the binding ceiling. The case is therefore admitted up to a claim quantity corresponding to **33.066 kWh** of underlying surplus. This one-for-one quantity convention is used only for the experiment; no monetary price or legal entitlement is implied. Under the stricter research policy, the same evidence is blocked because the policy additionally requires signed evidence and a higher assurance threshold (**L2**). The evidence itself is unchanged; only the admissibility rule differs.

**Settlement test.** For the admitted case, we then hold the 33.066-unit claim fixed and impose a separate stress scenario in which only **40%** of the declared quantity can be covered. Settlement is partial: **13.2264 kWh** is covered and **19.8396 kWh** remains short. The shortfall does not alter the earlier evidence object or admission result. Within the executable model, source assurance, admission, supported quantity, and settlement can therefore fail at different stages.

**Interpretation and limits.** The contribution is methodological: a reproducible way to show where an evidence-backed financial claim is admitted, bounded, or stopped while keeping the underlying evidence fixed. The case does not establish authenticated Ausgrid custody for this research copy, certified meter truth, legal issuance authority, enforceable redemption, an economically optimal policy, monetary valuation, or market adoption. Nor does one public case establish general external validity. The next meaningful tests are independent reproduction, higher-assurance source evidence, institutional review of policy choices, and observed rather than hypothetical settlement obligations.

## Keywords

FinTech; energy-linked claims; external evidence; tokenisation; policy; auditability; settlement; Green FinTech

## Code and reproducibility

https://github.com/Spectating101/solarpunk-coin

## References

[1] S. Eskandari, M. Salehi, W. C. Gu, and J. Clark, “SoK: Oracles from the Ground Truth to Market Manipulation,” *Proceedings of the 3rd ACM Conference on Advances in Financial Technologies*, pp. 127–141, 2021. doi:10.1145/3479722.3480994.

[2] W3C, *Verifiable Credentials Data Model v2.0*, W3C Recommendation, 2025.

[3] Open Policy Agent, *Policy as Code and Policy Decision Documentation*, Open Policy Agent / Cloud Native Computing Foundation project documentation.

[4] G. G. Dagher, B. Bünz, J. Bonneau, J. Clark, and D. Boneh, “Provisions: Privacy-preserving Proofs of Solvency for Bitcoin Exchanges,” *ACM CCS*, pp. 720–731, 2015. doi:10.1145/2810103.2813674.

[5] E. L. Ratnam, S. R. Weller, C. M. Kellett, and A. T. Murray, “Residential load and rooftop PV generation: an Australian distribution network dataset,” *International Journal of Sustainable Energy*, vol. 36, no. 8, pp. 787–806, 2017. doi:10.1080/14786451.2015.1100196.

# Global AI Finance Research Conference 2026 — Poster Extended Abstract

**Submission type:** Work-in-progress poster  
**Deadline:** 2026-08-31  
**Conference:** 2026-12-14 to 2026-12-15, Taiwan; in-person only  

## Title

**Evidence, Policy, and Settlement in Energy-Linked Financial Claims**

## Extended abstract

Tokenised assets and other data-dependent financial arrangements increasingly rely on facts that originate outside the financial system. Existing work addresses important parts of that problem. The oracle literature studies how external data enters smart-contract systems and the trust assumptions introduced by that bridge [1]. The W3C Verifiable Credentials standard explicitly distinguishes technical verifiability from the truth of the underlying claims and leaves reliance to verifier policy [2]. General policy-as-code systems separate rule evaluation from application logic [3], while ACTUS separates the known terms of a financial contract from uncertain future risk factors when deriving contract events and cash flows [4]. In deployed tokenisation infrastructure, proof-of-reserve feeds can also be connected directly to minting limits or circuit breakers [5]. These mechanisms make a narrower question worth isolating: **once external evidence is available, how should a financial decision distinguish what the evidence supports, whether a policy accepts it, how much underlying quantity it can justify, and whether the resulting obligation can settle?**

We study that handoff with **Policy Lab**, a deterministic research workbench that represents four stages separately: source/evidence assurance, policy admission, quantity, and settlement. The quantity stage is deliberately not a monetary valuation. It asks how much of the underlying physical claim is supported by the admitted evidence before any price, discount rate, legal entitlement, or market value is assigned. The policies used here are researcher-declared comparison policies rather than empirically calibrated or institutionally endorsed decision rules. Their purpose is to hold the evidence fixed while varying the conditions under which that evidence is allowed to support a claim.

The worked case uses Ausgrid’s Solar Home Electricity Data, a public dataset of half-hour residential load and rooftop-PV generation measurements [6]. We select one de-identified customer and the first seven days with actual generation and consumption rows from 1–7 July 2012, giving 336 half-hour intervals. For each interval, the workbench computes a conservative surplus quantity as

**surplus = max(PV generation − general load − controlled load, 0).**

Summed across the selected week, this produces **33.066 kWh**. This is a derived surplus measure, not a directly metered export channel. The archived source bytes and resulting evidence object are pinned for reproduction, but the research copy has neither source-holder-confirmed custody nor a cryptographic operator signature. We therefore retain the case at the workbench’s lowest assurance tier (**L0**) rather than treating public availability or hashing as stronger source evidence.

We then evaluate the same evidence object under two explicit research policies. The open policy requires positive surplus and no evidence-level blockers. Its quantity rules compare the evidence-supported quantity against a resource-context ceiling and an absolute policy cap. The evidence-supported quantity is the binding ceiling, so the case is admitted up to **33.066 energy-claim units**, mapped one-for-one to the underlying kWh quantity for this experiment. No monetary price is implied. The stricter pilot policy adds two admission requirements: signed evidence and at least L2 provenance. Because the evidence remains unsigned L0, the **same evidence object is blocked before quantity is authorised**. The comparison is therefore not “good data versus bad data”; it is a controlled policy-sensitivity exercise in which the evidence identity is held fixed and the admissibility rule changes.

Finally, we keep the admitted 33.066-unit claim fixed and impose a separate settlement stress in which only 40% of the declared quantity can be covered. The resulting settlement is partial: **13.2264 kWh is covered and 19.8396 kWh remains short**. This later shortfall does not alter the earlier evidence object or admission decision. In the executable model, source assurance, admissibility, supported quantity, and settlement can therefore fail at different points rather than being collapsed into one “verified” state.

The contribution is methodological rather than a claim that the energy case constitutes a deployable financial instrument. The experiment shows a reproducible way to expose where an evidence-backed claim is admitted, bounded, or stopped, and to attribute the result to an explicit evidence object and policy. It does **not** establish authenticated Ausgrid custody for this research copy, certified physical-meter truth, legal issuance authority, enforceable redemption, optimal policy thresholds, monetary valuation, or market adoption. One public case is also not evidence of general field validity. The next useful tests are therefore external reproduction, higher-assurance source evidence, institutional review of the policy rules, and observed rather than hypothetical settlement obligations.

### Figure 1. Experimental logic

```text
                    EVIDENCE HELD FIXED
          336 intervals; L0; 33.066 kWh derived surplus
                              │
               ┌──────────────┴──────────────┐
               │                             │
       OPEN RESEARCH POLICY           PILOT RESEARCH POLICY
   positive surplus + no blockers     + signed evidence + L2
               │                             │
        admit up to 33.066                  BLOCK
               │
       40% settlement stress
               │
   13.2264 covered / 19.8396 short
```

## Keywords

FinTech; energy-linked claims; external evidence; tokenisation; policy; auditability; settlement; Green FinTech

## References

[1] S. Eskandari, M. Salehi, W. C. Gu, and J. Clark, “SoK: Oracles from the Ground Truth to Market Manipulation,” *Proceedings of the 3rd ACM Conference on Advances in Financial Technologies*, pp. 127–141, 2021. doi:10.1145/3479722.3480994.

[2] W3C, *Verifiable Credentials Data Model v2.0*, W3C Recommendation, 15 May 2025.

[3] Open Policy Agent, *OPA Documentation: Policy as Code and Policy Decision Decoupling*, Open Policy Agent/CNCF project documentation.

[4] ACTUS Financial Research Foundation, *ACTUS Fundamentals: Algorithmic Representation of Financial Contracts and Risk Factors*.

[5] Chainlink, *Proof of Reserve*, product and technical documentation on reserve-based mint controls and circuit breakers.

[6] E. L. Ratnam, S. R. Weller, C. M. Kellett, and A. T. Murray, “Residential load and rooftop PV generation: an Australian distribution network dataset,” *International Journal of Sustainable Energy*, vol. 36, no. 8, pp. 787–806, 2017. doi:10.1080/14786451.2015.1100196.

## Submission boundary

The worked case uses a pinned public copy of the Ausgrid dataset. The derived 33.066 kWh is an evidence-supported physical quantity in this experiment, not a price or legal entitlement. Do not describe the case as authenticated operator evidence, an institutional pilot, or validation of a currency or monetary system.
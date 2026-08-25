# Global AI Finance 2026 — Related Work Positioning

This note exists to keep the novelty claim narrow and defensible.

| Prior system / literature | What it already does | What Policy Lab is not claiming | RC4 question left open |
|---|---|---|---|
| Eskandari et al. (2021), oracle SoK | studies oracle mechanisms, trust assumptions, and manipulation between ground truth and smart contracts | inventing external-data bridges or oracle security | after evidence is available, how is it admitted, bounded, and separated from settlement? |
| W3C Verifiable Credentials 2.0 | provides a data model for verifiable credentials and explicitly separates technical verifiability from truth/reliance | inventing cryptographic provenance or credential verification | how does a financial policy turn an assurance state into an admissibility and quantity decision? |
| Open Policy Agent | general policy-as-code engine that decouples policy decision-making from enforcement/application logic | inventing declarative policy evaluation | how should evidence assurance, quantity ceilings, and later settlement be represented around the policy decision? |
| ACTUS | machine-readable financial-contract terms, events, cash-flow logic, and treatment of risk factors | inventing machine-readable contract semantics | how is external evidence allowed to support the quantity entering a financial obligation before contract settlement? |
| Chainlink Proof of Reserve | reserve data can feed mint controls, circuit breakers, and other on-chain safeguards | inventing reserve attestation or evidence-gated minting | can the evidence/policy/quantity/settlement handoff be made explicit and reproducible across a more general claim workflow? |
| Ratnam et al. (2017) / Ausgrid dataset | supplies the empirical source context for residential load and rooftop-PV generation | claiming a new energy dataset or operator collaboration | can a public outside-data case exercise the separation without upgrading its source assurance? |

## Bounded contribution

The RC4 claim is **not** that no previous system separates these concepts. It is that Policy Lab provides an executable research composition in which:

1. source assurance is preserved as its own state;
2. policy admission is evaluated explicitly against that state;
3. supported underlying quantity is calculated separately from admission and before monetary valuation;
4. settlement is evaluated as a later state;
5. a fixed evidence object can be compared under different declared policies without silently changing what the evidence itself proves.

This is a methodological and software-research contribution that still requires stronger external cases and independent reproduction before a broader novelty or institutional-validity claim is warranted.

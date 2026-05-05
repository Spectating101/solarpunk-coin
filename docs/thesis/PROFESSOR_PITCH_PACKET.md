# Professor Pitch Packet

**Purpose:** send-ready thesis/advisor framing for SolarPunk. Use this before sending thesis materials to a professor or advisor.

## Recommended Pitch Positioning

Lead with the applied-finance research contribution:

> This thesis investigates whether renewable-energy data can support a credible energy-indexed financial instrument. It combines empirical energy-anchor analysis, derivative pricing and margin calibration, smart contract implementation, and public testnet proof. The claim is not that SolarPunk is production-ready. The claim is that the idea is specified, tested, and externally inspectable enough to justify pilot-stage research.

Do **not** lead with:

> Energy is better money than gold and every unharvested kWh is wasted money.

That may be useful as motivation, but it is too broad as the professor-facing thesis claim. It invites monetary theory, policy, and macro objections that are not necessary for a finance master's thesis.

## Best Working Title

**Energy-Indexed Crypto-Financial Instruments: Empirical Motivation, Pricing Framework, and Smart Contract Feasibility**

Alternative:

**From Energy Anchoring to On-Chain Settlement: A Three-Pillar Framework for Renewable-Energy Financial Instruments**

## One-Paragraph Summary

This thesis studies whether renewable-energy data can serve as a credible reference anchor for crypto-financial instruments. Using SolarPunk as a proof-of-concept, the thesis connects three layers: empirical evidence that energy costs can anchor digital asset value under identifiable regimes, a pricing and margin framework for energy-linked derivatives using NASA satellite data, and a smart contract implementation deployed to Ethereum Sepolia for external inspection. The work does not claim production readiness, market adoption, or stablecoin viability. Its contribution is a bounded evidence-to-instrument pipeline showing how energy-indexed settlement can be specified, tested, and evaluated under explicit limitations such as oracle risk, basis risk, conservative collateralization, audit readiness, and institutional requirements.

## Three Research Questions

1. **Empirical anchor:** Under what conditions do energy-cost or energy-production variables provide useful explanatory structure for crypto-financial valuation?
2. **Pricing and risk:** How can energy-linked derivative payoffs be priced and stress-tested when market-implied volatility is unavailable or thin?
3. **Implementation feasibility:** What contract rules, oracle assumptions, margin controls, and governance constraints are required for an energy-indexed instrument to be credible as a pilot-stage prototype?

## Three Contributions

1. **Empirical contribution:** The thesis uses Bitcoin mining and the China 2021 mining-ban shock to examine whether energy anchoring is regime-dependent rather than universal.
2. **Methodological contribution:** The thesis develops a reproducible energy-derivative pricing and margin framework using public data, numerical pricing, and stress/sensitivity analysis.
3. **Implementation contribution:** The thesis maps the financial mechanism into tested Solidity contracts, a public Sepolia deployment, daily NASA-to-chain data updates, and explicit role/oracle/risk documentation.

## What To Send

Send only a focused package. Do not send the whole repository unless asked.

1. `docs/thesis/MASTER_THESIS_PROPOSAL.md`
2. `docs/thesis/PROFESSOR_PITCH_PACKET.md`
3. `thesis-draft.md` or `thesis_package/COMPLETE_THESIS_SUBMISSION_READY.docx`, depending on whether the professor prefers Markdown or Word.
4. Public GitHub link: `https://github.com/Spectating101/solarpunk-coin`
5. Public demo link: `https://spectating101.github.io/solarpunk-coin/`

## What To Ask The Professor

Ask for scope validation, not general approval.

> I would appreciate feedback on whether this is better framed as an applied finance thesis on energy-indexed instruments, a DeFi/RWA implementation thesis, or a narrower empirical-pricing thesis. My current preference is the applied finance framing because it keeps the claim bounded while still using the implementation as evidence.

Specific questions:

1. Is the three-pillar structure acceptable for a master's thesis, or should it be narrowed?
2. Should the SolarPunk smart contract deployment be treated as a full chapter, appendix, or proof-of-concept section?
3. Is the “energy as monetary anchor” discussion acceptable as motivation, or should it be reduced to avoid overclaiming?
4. Which empirical result needs the most defense before submission?
5. Would the professor prefer a 4-chapter compact thesis or a 6-8 chapter full applied thesis?

## Recommended Email

Subject: Thesis scope review: energy-indexed financial instruments and SolarPunk prototype

Professor [Name],

I am preparing the final scope for my finance master's thesis and would appreciate your feedback before I lock the structure.

My proposed thesis studies whether renewable-energy data can support a credible energy-indexed financial instrument. The project connects three layers:

1. empirical evidence on energy-cost anchoring in crypto markets,
2. pricing and margin analysis for energy-linked derivatives using public satellite data,
3. a proof-of-concept smart contract implementation deployed to Ethereum Sepolia.

The claim is intentionally bounded. I am not claiming that SolarPunk is production-ready, audited, or commercially validated. I am using the prototype to make the research question technically inspectable: the contracts are tested, deployed on testnet, connected to a daily NASA data pipeline, and documented with explicit oracle, basis-risk, and governance limitations.

The current proposal is here:

GitHub: https://github.com/Spectating101/solarpunk-coin  
Demo: https://spectating101.github.io/solarpunk-coin/

I would appreciate your advice on five points:

1. Is the three-pillar structure acceptable for a master's thesis, or should it be narrowed?
2. Should the smart contract deployment be a chapter, appendix, or proof-of-concept section?
3. Should the “energy as monetary anchor” argument remain in the thesis, or be reduced to motivation?
4. Which empirical result needs the most defense before submission?
5. Would you prefer a compact 4-chapter thesis or a fuller 6-8 chapter applied-finance thesis?

Best,
Christopher Ongko

## Meeting Script

Use this if the professor asks you to explain the project quickly:

> The thesis is not simply “I built a crypto project.” It is an applied finance thesis asking whether energy-linked financial instruments can be empirically motivated, priced, and specified with credible settlement rules. SolarPunk is the implementation artifact. It lets the thesis go beyond theory by showing the mechanism in tested contracts and public testnet evidence, while still being clear that production deployment would require audit, oracle partners, legal review, liquidity, and real counterparties.

## Scope Decision

Recommended scope:

- Keep the thesis as an applied finance / energy-indexed instrument thesis.
- Keep SolarPunk as the proof-of-concept and Appendix D-style technical evidence.
- Avoid presenting the thesis as a final monetary system or production protocol.
- Use the “energy is better than gold” argument only if the professor is receptive to monetary theory. Otherwise, compress it into motivation and focus on derivatives/pricing/implementation.

## Red Flags To Avoid

- Do not say the thesis proves an energy-backed stablecoin works.
- Do not claim testnet deployment proves real-world adoption.
- Do not claim oracle data perfectly represents physical production.
- Do not claim the contracts are secure without a formal audit.
- Do not oversell token/protocol economics.
- Do not let the thesis become three disconnected papers; keep the through-line as “evidence-to-instrument feasibility.”

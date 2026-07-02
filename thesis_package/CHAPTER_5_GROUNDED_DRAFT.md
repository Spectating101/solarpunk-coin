# Chapter 5 - Constraints Framework and Proof-of-Concept Implementation

## At a glance

| | |
|---|---|
| **Question** | What rules must hold in code for energy-linked finance to be credible? |
| **Framework** | Five constraints: data → issuance → pricing → settlement → governance |
| **Evidence** | Sepolia SPK v1: ~5,499 SPK, 21 payments, peg off, circulation-first |
| **Staging** | Public lab now; closed pilot and mainnet product deliberately blocked |
| **Takeaway** | Technically buildable ≠ production-ready; prototype supports feasibility only |
| **Next chapter** | Ch 6 — answer, limits, and what would falsify the thesis |

## 5.1 Purpose of the Chapter

Chapters 2 through 4 established the thesis in three steps. Chapter 2 reviewed the literatures and identified the five-condition gap. Chapter 3 showed that energy cost can matter in an existing digital market, but that the relationship is conditional. Chapter 4 showed that renewable-energy-linked risk can be priced under explicit assumptions.

This chapter asks what rules are needed for an energy-linked digital instrument to be credible in implementation.

The key point is that a working contract is not enough. A smart contract can execute rules, but the rules must be economically meaningful. If the data is unreliable, issuance is discretionary, pricing ignores risk, or settlement is unprotected, then the instrument is not credible simply because it uses code.

The chapter therefore presents a constraints framework and a Sepolia proof-of-concept (SPK v1). The implementation is feasibility evidence: it shows that the core rules can be expressed in software and tested. It is not presented as a production-ready financial system.

## 5.2 The Constraints Framework

The framework has five core constraints.

First, energy data must be reliable enough for the claim being made. Modelled solar potential is useful for forecasting and benchmarking, but actual site-level settlement requires stronger evidence such as meter data, inverter logs, grid records, or audited operator files.

Second, issuance must be rule-bound. If a token or financial claim can be created without verified energy evidence, then energy is not constraining the system.

Third, risk must be priced explicitly. Energy output and energy value are uncertain. A credible system must account for volatility, shortfall risk, oracle error, and basis risk (Chapter 4, Tables 4.3–4.4 and 4.6).

Fourth, settlement must be protected. If users can redeem or settle claims, the system must define what is owed, who owes it, what happens during shortfall, and what collateral or reserve rules apply.

Fifth, governance must be limited. If administrators can change rules instantly or override constraints, then the system reintroduces discretionary control.

These constraints are not independent decorations. They work together. Reliable data without settlement protection creates weak claims. Pricing without verifiable data prices the wrong object. Rule-bound issuance without governance limits can be changed after users rely on the rules.

Table 5.1 summarises the five-constraint framework used in this thesis.

| Constraint | Purpose | Failure If Missing |
|---|---|---|
| Reliable energy data | Defines what energy evidence the system accepts | The system may price or mint against false or weak claims |
| Rule-bound issuance | Limits token or contract creation to accepted evidence | The issuer regains discretionary creation power |
| Explicit pricing and risk controls | Accounts for volatility, basis risk, oracle error, and shortfall risk | Claims become underpriced or under-collateralised |
| Protected settlement and redemption accounting | Defines what is owed and what happens during fulfillment, shortfall, or dispute | Users hold claims without credible resolution rules |
| Limited governance | Restricts discretionary parameter changes and role abuse | The system can override its own constraints |

## 5.3 Constraint 1: Reliable Energy Data

Energy-linked design fails when it confuses resource potential, modelled output, actual generation, surplus export, and tariff value. The proof-of-concept therefore separates modelling data (NASA POWER, PVWatts—for baselines and anomaly checks) from claim data (meter or inverter readings for minting).

The attested mint path follows five steps. First, meter-style readings are submitted. Second, readings are verified and accepted or rejected. Third, accepted readings form a deterministic source hash. Fourth, an attestation signs surplus and metadata. Fifth, the contract mints only after attestation checks pass.

![Attested mint path from meter data to SPK balance.](empirical_results/figures/mint_attestation_flow.png)

*Figure 5.1. Data-to-mint pipeline — source and attestation hashes consumed on-chain.*

The sample data do not prove revenue-grade meter finality. They do prove that accepted and rejected paths can be separated, bound to minting, and protected against replay.

## 5.4 Constraint 2: Rule-Bound Issuance

Issuance must not depend on an administrator's word alone. In the proof-of-concept, rule-bound issuance means that token creation is tied to a verified surplus claim rather than to discretionary minting authority.

The surplus-attestation path binds the recipient, surplus kWh, measurement and validity windows, source hash, chain ID, and contract address into one auditable bundle. Source and attestation hashes are consumed after use, so the same energy claim cannot mint twice. That design turns issuance from a governance decision into a verifiable event.

The public Sepolia record illustrates how this works in practice. In an earlier dollar-translated proof, a signed bundle recorded `2606.7` kWh of accepted surplus and minted `130.1697` SPK at a `$0.05/kWh` basis. The transaction is inspectable on-chain. That result demonstrates implementability. It does not demonstrate production readiness, live operator meters, or legal enforceability.

## 5.5 Constraint 3: Explicit Pricing and Risk Controls

Energy data do not imply financial value. Chapter 4 priced renewable risk under explicit assumptions. Tables 4.3–4.4 (oracle tolerance and location σ) and Table 4.6 (margin stress) are the templates a production system would need, even though SPK v1 does not embed that full pricing engine on-chain.

In the prototype, pricing appears through three channels. At mint, the system applies an energy-price basis (for example `$0.05/kWh` in an earlier proof, or energy-native `1 kWh → 1 SPK` in SPK v1). At redemption, quotes convert burned tokens into owed kWh. In stress artifacts, reserve and shortfall requirements are exposed before any real-value deployment. Together, these channels prevent issuance and settlement from becoming blind accounting.

## 5.6 Constraint 4: Settlement and Redemption Accounting

Issuance without settlement clarity leaves users unsure what they hold. The currency-system contract supports invoice settlement (SPK transferred against a hashed invoice with replay protection) and redemption accounting (tokens burned into owed-kWh claims resolved as fulfilled, shortfall, or disputed).

This is rule enforcement and record-keeping, not guaranteed physical delivery. Real deployment still needs counterparties, legal terms, operator obligations, and reserve policy. The research point is that minting, circulation, redemption, and resolution can be connected in one auditable path.

## 5.7 Constraint 5: Governance Limits and Launch Gates

Unlimited administrative power would reintroduce discretionary issuance into a system that claims to be energy-constrained. The implementation therefore uses role separation, pausing, and governance-delay patterns in the broader design. These controls are directionally correct, but they are not sufficient on their own for production deployment.

Launch gates provide a second layer of discipline by separating three stages: public lab, closed testnet pilot, and paid or mainnet product. Only the public lab stage is launchable under the current evidence base. The pilot and mainnet stages remain blocked until governed deployment, real operator data, hardware provenance, economics, audit, legal scope, redemption policy, and production evidence are in place.

Stating those blockers explicitly is a methodological strength of the thesis. The project does not present testnet demonstration code as finished money. Table 5.2 summarises the staging logic, and Figure 5.6 visualises it.

| Stage | Current Status | Interpretation |
|---|---|---|
| Public lab | Launchable as proof/demo/research evidence | Suitable for advisor, reviewer, and public-lab inspection |
| Closed testnet pilot | Blocked | Needs governed deployment, real operator data, stronger hardware provenance, and anchor economics/support terms |
| Paid/mainnet product | Blocked | Needs audit, legal/commercial scope, redemption policy, production deployment, reserves, real counterparties, and demand |

![Launch-gate staging: public lab vs blocked pilot and mainnet.](empirical_results/figures/launch_gate_stages.png)

*Figure 5.6. Launch-gate staging (§5.7).*

## 5.8 What the Proof-of-Concept Demonstrates — and What It Does Not

The proof-of-concept demonstrates several things. First, an energy-data-to-token path can be implemented with attestation and replay protection. Second, token circulation and redemption accounting can be recorded on-chain. Third, public testnet evidence can be produced and indexed. Fourth, readiness can be separated by stage through launch gates.

It also has clear limits. It does not prove production readiness, legal classification, revenue-grade operator meters, market demand, liquidity, external audit, legally enforceable redemption, or fully funded reserve policy.

These limits matter because they prevent overclaiming. The thesis uses the implementation to support a narrower claim: the constraints framework is technically buildable as a proof of concept. It does not claim the prototype is ready to handle public financial value.

## 5.9 SPK v1 on Sepolia

After an earlier dollar-translated attested mint in May 2026 (contract `0x8ceDa…`), the project deployed SPK v1 on Sepolia in June 2026. SPK v1 is an energy-native, circulation-first implementation of the same constraints framework developed earlier in the chapter.

The following table compares SPK v1 with the earlier attested proof. The earlier proof translated energy into dollars at mint through a `$0.05/kWh` basis and emphasised mint proof plus lab settlement. SPK v1 defaults to energy-native issuance (`1 kWh → 1 SPK`), emphasises network circulation through `settleNetworkPayment`, and keeps the dollar peg off by default. The primary contracts are `0x8e189…` for SPK and `0x52016…` for the CurrencySystem.

![SPK v1 on-chain activity mix (settled vs redeemed vs held).](empirical_results/figures/spk_circulation_share.png)

*Figure 5.7. On-chain activity mix (synced runtime).*

| Parameter | SPK v1 (Jun 2026) | Earlier attested proof |
|---|---|---|
| Issuance | Energy-native (`1 kWh → 1 SPK` default) | Dollar-translated via `$0.05/kWh` basis |
| Primary use | Network circulation (`settleNetworkPayment`) | Mint proof + lab settlement |
| Peg | Off by default | Dollar basis implicit |
| Contracts | `0x8e189…` (SPK), `0x52016…` (CurrencySystem) | `0x8ceDa…` |

SPK v1 is product-oriented evidence rather than a new theoretical claim. The same five constraints appear in a circulation-first posture: hash-consumed issuance, typed network payments with invoice-hash replay protection, gated redemption, and testnet-only operator keys.

Subsections 5.9.1–5.9.2 report canonical contracts, live runtime metrics, and the indexed payment ledger (Table 5.4). These blocks are refreshed from Sepolia testnet state on each thesis build.

Figure 5.7 visualises the activity mix. Payment #15 is a wallet-initiated pilot transfer of 5 SPK. Payment #3 is operator testnet choreography of 180 SPK in NETWORK form, not external commerce.

SPK v1 therefore demonstrates that the framework can support energy-native circulation on a public testnet. It does not demonstrate mainnet readiness, legal money status, or real-site meter finality, as discussed in §5.8.

## 5.10 Chapter Conclusion

Energy-linked digital finance requires all five constraints together: reliable data, rule-bound issuance, explicit pricing, protected settlement, and limited governance.

The Sepolia prototype shows that the core path can be expressed in code—attested minting, replay-protected payments, redemption accounting, and staged launch gates—while keeping production, legal, and peg claims off the table.

Chapter 6 summarises the bounded thesis answer and what would strengthen or falsify it.

> **Key takeaway:** All five constraints must work together. SPK v1 shows the rules can run on testnet; it does not prove production readiness, a dollar peg, or legal money.

## References

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. Bank for International Settlements. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

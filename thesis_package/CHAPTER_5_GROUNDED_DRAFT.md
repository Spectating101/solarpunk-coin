# Chapter 5 - Constraints Framework and Proof-of-Concept Implementation

## 5.1 Purpose of the Chapter

Chapters 2 through 4 established the thesis in three steps. Chapter 2 explained why energy is worth studying as a monetary and financial constraint. Chapter 3 showed that energy cost can matter in an existing digital market, but that the relationship is conditional. Chapter 4 showed that renewable-energy-linked risk can be priced under explicit assumptions.

This chapter asks what rules are needed for an energy-linked digital instrument to be credible in implementation.

The key point is that a working contract is not enough. A smart contract can execute rules, but the rules must be economically meaningful. If the data is unreliable, issuance is discretionary, pricing ignores risk, or settlement is unprotected, then the instrument is not credible simply because it uses code.

The chapter therefore presents a constraints framework. It then describes the proof-of-concept implementation built in this project. The implementation is used as feasibility evidence: it shows that the core rules can be expressed in software and tested. It is not presented as a production-ready financial system.

## 5.2 The Constraints Framework

The framework has five core constraints.

First, energy data must be reliable enough for the claim being made. Modelled solar potential is useful for forecasting and benchmarking, but actual site-level settlement requires stronger evidence such as meter data, inverter logs, grid records, or audited operator files.

Second, issuance must be rule-bound. If a token or financial claim can be created without verified energy evidence, then energy is not constraining the system.

Third, risk must be priced explicitly. Energy output and energy value are uncertain. A credible system must account for volatility, shortfall risk, oracle error, and basis risk.

Fourth, settlement must be protected. If users can redeem or settle claims, the system must define what is owed, who owes it, what happens during shortfall, and what collateral or reserve rules apply.

Fifth, governance must be limited. If administrators can change rules instantly or override constraints, then the system reintroduces discretionary control. Governance delay, role separation, auditability, and emergency controls are part of credibility.

These constraints are not independent decorations. They work together. Reliable data without settlement protection creates weak claims. Pricing without verifiable data prices the wrong thing. Rule-bound issuance without governance limits can be changed after users rely on it. Settlement without collateral can fail under stress.

The thesis contribution is the integration of these constraints into one architecture.

Table 5.1 summarises the five-constraint framework used in this thesis.

| Constraint | Purpose | Failure If Missing |
|---|---|---|
| Reliable energy data | Defines what energy evidence the system accepts | The system may price or mint against false or weak claims |
| Rule-bound issuance | Limits token or contract creation to accepted evidence | The issuer regains discretionary creation power |
| Explicit pricing and risk controls | Accounts for volatility, basis risk, oracle error, and shortfall risk | Claims become underpriced or under-collateralised |
| Protected settlement and redemption accounting | Defines what is owed and what happens during fulfillment, shortfall, or dispute | Users hold claims without credible resolution rules |
| Limited governance | Restricts discretionary parameter changes and role abuse | The system can override its own constraints |

## 5.3 Constraint 1: Reliable Energy Data

The first requirement is a clear data path.

An energy-linked instrument must define what is being measured. Several different quantities can be confused if the system is not precise:

- solar resource potential;
- modelled expected production;
- actual generation;
- surplus export;
- avoided consumption;
- energy value under tariff or market rules.

These are related, but they are not the same.

Public satellite and weather datasets can estimate resource conditions and expected output. They are valuable for modelling and forecasting. However, they do not prove that a specific site produced a specific quantity of electricity. For settlement, the system needs stronger evidence.

The proof-of-concept therefore distinguishes between modelling data and claim data. NASA POWER and NREL/PVWatts style data can support baselines, forecasts, and anomaly checks. Meter or inverter data is needed for actual production claims. Signed readings, source hashes, nonces, timestamps, and replay protection are used to make the data path auditable.

In the implementation, the attested mint path is:

1. raw meter-style readings are submitted;
2. readings are checked and accepted or rejected;
3. accepted readings are combined into a deterministic source hash;
4. an oracle-style attestation signs the accepted surplus amount and metadata;
5. the contract checks the attestation before minting.

The important point is not that the current sample data proves physical finality. It does not. The important point is that the system separates accepted data from rejected data, binds the source hash to the mint, and prevents the same source from being reused.

## 5.4 Constraint 2: Rule-Bound Issuance

The second requirement is that token or contract creation must be limited by verified data.

If an issuer can mint tokens without energy evidence, then the system is just a discretionary token with energy branding. That would not solve the credibility problem identified in Chapter 1.

In the proof-of-concept implementation, this issue is addressed through surplus-attestation minting. The contract does not simply mint because an administrator says so. It verifies an attestation that binds several pieces of information:

- recipient;
- surplus kWh;
- measurement window;
- validity window;
- source hash;
- chain ID;
- contract address.

The source hash and attestation hash are consumed after use. This matters because it prevents the same energy data from being reused to create multiple claims.

The public Sepolia proof demonstrates this path. The source-of-truth proof record shows a signed meter-style bundle, `2606.7` kWh accepted surplus, `2606` on-chain integer kWh, and `130.1697` SPK minted at a `$0.05/kWh` energy-price basis after fees. The transaction is public on Sepolia and serves as implementation evidence.

This proof should be interpreted carefully. It proves that the data-to-mint path can be implemented and publicly inspected. It does not prove that the system is ready for production, that the sample data is a live revenue-grade meter source, or that a real-world legal claim exists.

## 5.5 Constraint 3: Explicit Pricing and Risk Controls

The third requirement is pricing.

Energy data alone does not define financial value. A system also needs to know how much the energy is worth and how uncertain that value is. Chapter 4 showed that renewable-energy-linked claims can be priced under explicit assumptions and that pricing outputs can inform margin, reserves, and oracle tolerance.

In the implementation context, pricing appears in several places.

First, minting depends on an energy-price basis. In the public Sepolia proof, the energy basis is `$0.05/kWh`. This converts accepted surplus kWh into a token amount. A different energy price would create a different issuance result.

Second, redemption or owed-energy claims depend on the energy price per kWh. If a holder burns tokens for an energy claim, the system must calculate how many kWh are owed.

Third, reserves and shortfall analysis depend on stress testing. A system that promises energy-linked value must ask whether it has enough buffer when output falls, claims rise, or price assumptions fail.

The implementation includes stress and finance artifacts for this reason. These artifacts do not make the system solvent by themselves. They expose the capital and policy requirements that would be needed before real-value deployment.

This is the practical role of pricing in the constraints framework: it prevents issuance and settlement from becoming blind accounting.

## 5.6 Constraint 4: Settlement and Redemption Accounting

The fourth requirement is settlement protection.

A token can be issued correctly but still fail if users do not know what it settles into. This is especially important for energy-linked instruments because energy output can be lower than expected, local tariffs can change, and delivery can fail.

The proof-of-concept includes a currency-system contract that handles two basic functions.

First, it supports invoice settlement. A payer can transfer SPK to a payee against a hashed invoice. The invoice hash is recorded and cannot be reused. This creates a replay-protected payment record.

Second, it supports redemption accounting. A user can transfer SPK into the contract, burn it through the SPK token's redemption function, and open an owed-kWh claim. The claim can later be resolved as fulfilled, shortfall, or disputed.

This is not the same as guaranteeing real-world electricity delivery. It is an accounting and rule-enforcement layer. It records what the system says is owed and how the claim is resolved. A real deployment would still need counterparties, legal terms, operator obligations, and reserve policy.

The local proof loop demonstrates the mechanism: accepted surplus leads to token minting, tokens circulate through invoice-like payments, a portion is redeemed, and the system records the owed energy amount and delivery resolution. The important research point is that issuance, circulation, redemption, and settlement accounting can be connected in one rule-based path.

## 5.7 Constraint 5: Governance Limits and Launch Gates

The fifth requirement is governance discipline.

If administrators can change parameters instantly, bypass data checks, or mint tokens without evidence, then the system returns to discretionary issuance. A credible energy-linked design must therefore specify who can change rules, how quickly changes apply, and what protections users have.

The implementation uses role-based permissions, pausing controls, and governance-delay ideas in the broader protocol design. These are not enough for production by themselves, but they show the correct direction: separate roles, visible parameters, and constrained administrative power.

The project also uses launch gates. The launch gate separates three stages:

- public lab;
- closed testnet pilot;
- paid or mainnet product.

The current launch gate marks the public lab as launchable, while closed-pilot and paid/mainnet stages remain blocked. The blockers are important:

- governed attested-SPK redeployment;
- real meter or inverter data;
- stronger hardware provenance;
- economic support terms for pilot readiness;
- audit;
- legal and commercial scope;
- redemption policy;
- production deployment evidence.

This is not a weakness in the research. It is a strength of the framing. The implementation does not pretend that a testnet proof is a finished financial system. It states which controls exist and which remain open.

Table 5.2 gives the current implementation status used in the thesis.

| Stage | Current Status | Interpretation |
|---|---|---|
| Public lab | Launchable as proof/demo/research evidence | Suitable for advisor, reviewer, and public-lab inspection |
| Closed testnet pilot | Blocked | Needs governed deployment, real operator data, stronger hardware provenance, and anchor economics/support terms |
| Paid/mainnet product | Blocked | Needs audit, legal/commercial scope, redemption policy, production deployment, reserves, real counterparties, and demand |

## 5.8 What the Proof-of-Concept Demonstrates

The proof-of-concept demonstrates several things.

First, an energy-data-to-token path can be implemented. Signed readings can be checked, bundled, hashed, attested, and used to mint tokens through a contract.

Second, replay protection can be enforced. Source hashes and attestation hashes can be consumed so that the same energy claim is not reused.

Third, token circulation and redemption accounting can be modelled. The currency-system contract can record invoice settlement, burn tokens into owed-kWh claims, and resolve delivery as fulfilled, shortfall, or disputed.

Fourth, public testnet evidence can be produced. The Sepolia proof gives an inspectable transaction showing that the core mint path works under the test conditions.

Fifth, readiness can be separated by stage. The project distinguishes public-lab evidence from closed-pilot readiness and production readiness.

Together, these demonstrate technical feasibility. The framework is not only an essay. Its core rules can be expressed in software, run locally, and partially demonstrated on a public testnet.

## 5.9 What the Proof-of-Concept Does Not Demonstrate

The proof-of-concept also has clear limits.

It does not prove production readiness.

It does not prove legal classification.

It does not prove that a real solar site has supplied revenue-grade meter data.

It does not prove market demand or liquidity.

It does not replace an external security audit.

It does not establish a legally enforceable redemption claim.

It does not solve reserve capital or shortfall policy.

These limits matter because they prevent overclaiming. The thesis uses the implementation to support a narrower claim: the constraints framework is technically buildable as a proof of concept. It does not claim the prototype is ready to handle public financial value.

## 5.10 SPK v1: Energy-Native Network Money on Sepolia

After the attested dollar-translated mint proof (`0x8ceDa…`, May 2026), the project deployed a unified **SPK v1** stack on Sepolia with a different monetary posture:

| Parameter | SPK v1 (Jun 2026) | Earlier attested proof |
|---|---|---|
| Issuance | Energy-native (`1 kWh → 1 SPK` default) | Dollar-translated via `$0.05/kWh` basis |
| Primary use | Network circulation (`settleNetworkPayment`) | Mint proof + lab settlement |
| Peg | Off by default | Dollar basis implicit |
| Contracts | `0x8e189…` (SPK), `0x52016…` (CurrencySystem) | `0x8ceDa…` |

This iteration is **product-oriented evidence**, not a new theoretical claim. It shows the same five constraints applied to a circulation-first design:

1. **Data** — surplus kWh mint path (operator cycle can extend attested bundles later).
2. **Rule-bound issuance** — `mintFromSurplus` and attestation paths remain hash-consumed.
3. **Pricing** — energy-native default; optional USD reference for redemption quotes only.
4. **Settlement** — typed network payments (SERVICE, LABOR, GOODS, NETWORK) with invoice-hash replay protection; redemption gated and secondary.
5. **Governance** — role separation on contracts; testnet operator key for demo only.

Table 5.3 summarises the main public SPK v1 evidence (full ledger: `thesis_package/SPK_V1_EVIDENCE.md`).

| Evidence item | Sepolia transaction / contract |
|---|---|
| SPK v1 deploy (energy-native) | Contract `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| CurrencySystem deploy | Contract `0x520162252F9B94824417678525FFd69145014970` |
| Attested mint (synthetic cycle bundle) | `0x9fcf885ff5df7f580db77651c4149b4862e4c69b4779f9330295375057f53109` |
| Attested mint (Taoyuan meter fixture, scaled) | `0x3527585fd110ae3e135e76b870232d1b30411d76953c15c94a237743a0d1754d` |
| Network payment (LABOR) | `0x1f7cd59612cf81dd4a43f1cb1b4e5d6e03f4be570e4ad4fc2c21e28ee72d09be` |

Synced metrics (Jun 2026): ~5,400 SPK supply, 383 SPK settled, 14 network payments, 97.5% circulation share. Reproduce: `npm run spk:v1:sync`.

**Thesis interpretation:** SPK v1 demonstrates that the constraints framework can support an energy-native, circulation-first instrument—not only a dollar-pegged lab token. It does **not** demonstrate mainnet readiness, legal money status, or real-site meter finality. Those boundaries from §5.9 still apply. Launch-gate staging (§5.7) remains useful for separating research demos from production, but the **primary implementation evidence** for this chapter is now the SPK v1 runtime and its on-chain payment history.

## 5.11 Chapter Conclusion

This chapter turned the thesis from evidence and pricing into a rule-based architecture.

The central finding is that energy-linked digital finance requires more than energy data. It requires reliable measurement, rule-bound issuance, explicit pricing, protected settlement, and limited governance. These constraints work together. Removing any one of them weakens the credibility of the system.

The proof-of-concept implementation shows that the core path can be built: energy-style readings can be checked, accepted surplus can be attested, tokens can be minted with replay protection, payments can be recorded, and redemptions can become owed-energy claims with resolution states.

The chapter also makes the boundary clear. The current implementation is public-lab and proof-of-concept evidence. It is not a production-ready energy-money system. Real deployment would require real meter data, governed deployment, audit, legal terms, reserve policy, and counterparties.

This completes the main argument of the thesis. Chapter 6 summarises what has been shown, what remains unproven, and what future work would be required.

## References

Bank for International Settlements. (2023). Blueprint for the future monetary system: Improving the old, enabling the new. In *Annual Economic Report 2023*. https://www.bis.org/publ/arpdf/ar2023e3.htm

Chainlink. (n.d.). *Proof of Reserve*. https://chain.link/proof-of-reserve

National Institute of Standards and Technology. (n.d.). *Smart Grid*. https://www.nist.gov/engineering-laboratory/smart-grid

OpenZeppelin. (n.d.). *ERC20*. https://docs.openzeppelin.com/contracts/5.x/api/token/ERC20

SolarPunk project artifacts. (2026). `SPK_ATTESTED_MINT_PROOF.md`, `CURRENCY_SYSTEM_LAB.md`, `CURRENCY_FRAMEWORK_READINESS.md`, and `PRODUCT_LAUNCH_GATE.md`.

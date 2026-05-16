# SolarPunk Currency Theory And Comparables

- last_updated: `2026-05-16`
- purpose: anchor the SPK currency framework to existing monetary, energy-certificate, and tokenisation practice without overstating current proof.

## Core Position

SolarPunk is strongest when framed as an **energy-denominated settlement and receipt system**, not as a generic reward token and not yet as a universal replacement currency.

The defensible thesis is:

> Verified surplus energy creates SPK supply; SPK circulates as a settlement asset; redemption burns SPK into owed-kWh receipts; delivery resolution measures whether real energy obligations clear.

That puts SolarPunk between four established categories:

1. Energy attribute certificates.
2. Solar-generation reward tokens.
3. Blockchain energy trading and attribute registries.
4. Stablecoin/tokenised-asset mint-and-redemption systems.

The project becomes more novel where those categories overlap: **meter evidence + replay-protected minting + invoice settlement + redemption receipt + delivery accounting**.

## External Anchors

| Anchor | What It Proves Exists | What SolarPunk Borrows | What SolarPunk Must Not Pretend |
|---|---|---|---|
| BIS unified ledger / tokenisation | Tokenised money and tokenised claims can be composed on programmable ledgers. | SPK combines evidence, settlement rules, and receipt state in one programmable path. | BIS framing does not validate permissionless retail currency launch. |
| FSB stablecoin recommendations | Stable-value arrangements need governance, risk management, redemption rights, disclosure, and accountable control functions. | SPK needs explicit redemption terms, operator accountability, reserves, and user-facing risk disclosure. | Local field receipts are not enough for stablecoin-grade readiness. |
| US EPA RECs / tracking systems | Renewable generation can be represented by unique certificates with location, vintage, facility, and ownership tracking. | SPK should inherit uniqueness, no-double-counting, generation vintage, and asset-location metadata. | A REC represents environmental attributes, not physical electricity delivery or cash redemption. |
| I-TRACK / I-REC | International energy attribute markets use defined issuance, tracking, and redemption rules. | SPK needs registry-grade identity, issuer, vintage, transfer, retirement, and claim boundaries. | SPK is not an accredited I-REC or official environmental claim instrument. |
| EnergyTag granular certificates | Hourly/sub-hourly certificates require time granularity, geographic deliverability, data integrity, double-count prevention, registry governance, and 24/7 matching support. | SPK should move from generic kWh to time/location/basis-tagged energy receipts. | Current field receipt loop is not granular-certificate compliant. |
| NIST / DOE Green Button / ESPI | Energy data access has an established consumer/third-party data-sharing standard. | Real meter exports should eventually support ESPI/Green Button-style data ingestion. | Current CSV/fixture path is not standards-complete energy-data interoperability. |
| Energy Web Green Proofs / Origin | Blockchain registries can track environmental attributes and commodity provenance across organizations. | SPK should separate identity, asset evidence, business logic, and claim lifecycle. | Energy Web validates registry architecture, not SPK monetary economics. |
| SolarCoin | Verified solar generation can be rewarded with a token. | SolarPunk can borrow the clear production-reward intuition. | SolarPunk should not stop at reward-token logic; the differentiator is settlement and redemption receipts. |
| Powerledger | Blockchain energy markets and environmental commodity trading have commercial precedent. | SolarPunk can anchor the market-design side: prosumer settlement, energy traceability, and commodity trading. | Powerledger-style trading is not the same as an energy-backed monetary unit. |
| Chainlink Proof of Reserve | On-chain minting can be gated by external reserve/evidence checks. | SPK should evolve toward reserve/evidence-gated mint controls and circuit breakers. | Proof-of-reserve style feeds do not solve meter truth or legal redemption by themselves. |

## Strongest Theory Stack

The best theoretical frame is not "energy is better than fiat, therefore coin." That is too broad.

The stronger frame is:

1. **Measurement layer:** meter/inverter/utility data produces an energy fact.
2. **Evidence layer:** signatures, source hashes, quality filters, and replay protection determine whether the fact is admissible.
3. **Issuance layer:** accepted surplus energy mints SPK under a fixed price/basis rule.
4. **Settlement layer:** SPK moves between counterparties against invoices or energy-credit obligations.
5. **Redemption layer:** SPK is burned into an owed-kWh receipt.
6. **Resolution layer:** delivery is fulfilled, shortfall, or disputed.
7. **Risk layer:** location, time, reserve, oracle, liquidity, and operator risk determine whether SPK is safe enough to scale.

This is compatible with tokenisation literature because the value is not merely the token. The value is the **state machine around the token**.

## What Is Empirically Strong Today

| Claim | Strength | Reason |
|---|---:|---|
| Energy-cost / Bitcoin relationship motivates the thesis | Medium-strong | CEIR results and structural-break evidence are real, but sensitive to specification. |
| Physics-based pricing is plausible | Medium-strong | NASA irradiance calibration, binomial/MC convergence, and cross-location runs support cold-start pricing. |
| Signed meter data can feed SPK minting | Medium | The signature and replay mechanics work, but current meter data is fixture/sample data. |
| SPK can clear an internal receipt loop | Strong internally | The local field receipt loop executes mint, settlement, redemption, and delivery resolution without external dependencies. |
| SPK is ready for real-world currency launch | Weak | No real meter export loop, no legal redemption terms, no audited deployment, no real operator obligation. |

## What Is Missing For A Robust Currency Claim

1. **Real meter export loop.** Replace fixture data with a real inverter, utility, or Green Button/ESPI-style export.
2. **Time/location denomination.** Stop treating all kWh as identical; tag receipts by source, geography, delivery window, and basis rule.
3. **No-double-counting registry logic.** Move closer to REC/I-REC discipline: unique issuance, transfer, retirement, and claim state.
4. **Redemption policy.** Define what a holder can redeem, who owes delivery, how shortfall is handled, and what caps apply.
5. **Stress harness.** Simulate redemption waves, delivery shortfalls, oracle drift, reserve changes, and payment velocity.
6. **Public deployable currency stack.** Deploy `SolarPunkCurrencySystem` beside the attested SPK proof stack and publish readbacks.
7. **Operator governance.** Establish who can resolve deliveries, how disputes escalate, and how malicious/failed operators are penalized.

## Comparable Positioning

SolarPunk should position itself as:

> A programmable energy-backed settlement receipt system.

Not:

- "A universal energy coin" yet.
- "A REC replacement" yet.
- "A stablecoin" yet.
- "A production-ready retail payment currency" yet.
- "A legal claim on delivered electricity" yet.

The current strongest claim is:

> SolarPunk now demonstrates the internal mechanics required for an energy-backed currency experiment: admissible energy evidence, replay-protected issuance, payment circulation, redemption burn, owed-kWh receipt, delivery resolution, and accounting conservation.

## References

- BIS, "Blueprint for the future monetary system: improving the old, enabling the new" — https://www.bis.org/publ/arpdf/ar2023e3.htm
- FSB, "High-level Recommendations for the Regulation, Supervision and Oversight of Global Stablecoin Arrangements" — https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/
- US EPA, "Renewable Energy Certificates" — https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs
- US EPA, "Energy Attribute Tracking Systems" — https://www.epa.gov/green-power-markets/renewable-energy-tracking-systems
- I-TRACK Foundation, "The International Attribute Tracking Standard" — https://www.irecstandard.org/the-standard/
- EnergyTag, "FAQ" — https://energytag.org/faq/
- NIST, "Green Button Initiative" — https://www.nist.gov/el/smart-grid-menu/hot-topics/green-button-initiative
- US DOE, "Green Button" — https://www.energy.gov/data/green-button
- Energy Web, "Green Proofs Overview" — https://docs.energyweb.org/energy-solutions/green-proofs-by-energy-web/green-proofs-overview
- SolarCoin, "How SolarCoin works" — https://solarcoin.org/how-it-works/
- Powerledger, "Powerledger Lightpaper 2023" — https://powerledger.io/company/power-ledger-whitepaper/
- Chainlink, "Proof of Reserve" — https://chain.link/proof-of-reserve

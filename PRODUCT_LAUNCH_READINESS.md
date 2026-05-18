# Product Launch Readiness

**Last updated:** 2026-05-18

## Product thesis

The launchable product is SolarPunkCoin (SPK), not the broader research stack.

The narrow claim is:

1. A renewable generator produces measured energy readings.
2. Registered meter devices sign those raw readings.
3. The attestation pipeline verifies signatures, nonces, windows, quality, capacity sanity, and energy balance.
4. An oracle signer attests to the accepted surplus bundle.
5. `SolarPunkCoin.mintFromSurplusAttestation` verifies the attestation and mints SPK.

This is the product story that the repo should now support: verified surplus renewable energy becomes programmable SPK.

## Current readiness

| Layer | Status | Product meaning |
|---|---|---|
| Contracts | `102/102` tests passing | The SPK mint, treasury, option, stability, and currency-framework paths are covered locally |
| SPK attested minting | Implemented in `SolarPunkCoin` | Surplus minting is no longer just a trusted minter call |
| Meter ingestion | `scripts/derive_meter_attestations.js` verifies signed raw readings into `state/attestations/` | The data side now has registered meter identities and signature checks |
| Meter CSV import | `scripts/import_meter_csv.js` canonicalizes and signs inverter/meter CSV exports | First pilot-facing bridge from real meter exports into the attestation pipeline |
| Pilot CSV proof | `scripts/pilot_csv_receipt.js` generates raw readings, accepted bundle, source hash, and mint preview | First end-to-end operator-style CSV proof surface |
| Inverter/meter adapter | `scripts/inverter_meter_adapter.js` normalizes cumulative counter snapshots and Fronius PowerFlow intervals | First direct hardware-facing adapter path; sample mode proves the verifier bridge, real operator mode still needs hardware custody |
| Public solar data replay | `scripts/public_solar_data_replay.js` normalizes public historical Ausgrid rooftop-solar rows into SPK verifier inputs | Shows SPK mint math against real-world public solar profiles without pretending this is live hardware proof |
| Hardware provenance model | `scripts/hardware_provenance_model.js` generates L0-L4 hardware tiers, risk haircuts, issuance caps, and upgrade evidence | Prevents the hardware gap from being hand-waved; current adapter sample is L0 with 0 kWh real-value cap |
| Closed pilot execution package | `scripts/closed_pilot_execution_package.js` generates operator intake, execution modes, action queue, and acceptance criteria | Converts remaining pilot obstacles into named inputs, commands, owners, and success definitions |
| Monetary stress harness | `scripts/monetary_stress_harness.js` generates redemption-wave and shortfall scenarios | Shows where SPK needs named reserve capital instead of pretending physical shortfalls can be printed away |
| Energy-money simulation | `scripts/energy_money_simulation.js` uses real keeper-index resource days plus explicit assumptions | Shows SPK as an energy-standard monetary system, not merely a pilot proof generator |
| SPK finance dossier | `scripts/spk_finance_dossier.js` turns simulation/stress artifacts into income statement, balance sheet, break-even, and finance-stack views | Makes the finance blockers explicit: current fee policy is not self-funding and stress capital must be named |
| Empirical finance backtest | `scripts/empirical_finance_backtest.js` converts historical NASA POWER irradiance into project-finance distributions | Shows that real resource data supports the energy model, but the current 10 kW finance case has only `0.325x` p50 DSCR under stated assumptions |
| Economic launch readiness | `scripts/economic_launch_readiness.js` converts empirical finance into launch thresholds and sensitivity paths | Shows the exact economics needed before a closed pilot or paid launch can be defended |
| Pilot stack scaffold | `scripts/deploy_pilot_stack.js` and `scripts/read_pilot_stack.js` | Deploy/readback path for SPK + treasury + currency system under pilot governance |
| Product proof | `docs/product/SPK_ATTESTED_MINT_PROOF.md` generated | Sample bundle minted `130.1697` SPK on Sepolia from `2606` on-chain kWh |
| Empirical dossier | `docs/product/SPK_PRODUCT_EMPIRICS.md` generated | The thesis evidence is now tied to the single SPK product claim |
| Meter spec | `docs/specs/METER_ATTESTATION_SPEC.md` added | Defines the adapter/oracle contract for signed reading validation |
| Frontend | Primary `SPK Mint` tab plus interactive `Currency` workbench | Demo UI explains verified minting and lets reviewers vary generator scale, self-use, redemption, velocity, shortfall, and reserve assumptions |
| Live proof | Sepolia core contracts + daily NASA keeper + fresh attested SPK proof stack | Public evidence exists for both old keeper path and new signed-meter mint path |
| Security | Code review + tests, no formal audit | Not ready for unaudited real-value mainnet funds |
| Counterparties | None confirmed | Biggest non-code blocker |
| Legal/compliance | Not scoped | Must be scoped before paid public launch |

## What is already product-real

- The contract can verify a signed surplus attestation that binds surplus kWh, recipient, measurement window, validity window, source hash, chain ID, and contract address.
- The contract consumes both the attestation hash and source hash so neither the same signature nor the same meter/source bundle can mint twice.
- The mint path still respects oracle freshness, grid stress, reserve ratio, supply cap, recipient validity, fee split, and minter/oracle role checks.
- The meter bundle pipeline verifies device signatures, rejects duplicate/low-quality readings, and produces deterministic record hashes plus a product-level source hash.
- The generated product proof demonstrates the full path from sample meter records to a public Sepolia SPK mint, with deterministic local reproduction still available.
- The pilot CSV proof demonstrates a realistic operator/export path: `1,985.5` accepted kWh becomes a deterministic source hash and `99.15075 SPK` mint preview without writing private keys to repo outputs.
- The inverter/meter adapter demonstrates the direct hardware-facing path: cumulative counter snapshots become `1` signed interval, `996.2` accepted surplus kWh, and an accepted attestation bundle. Fronius PowerFlow polling is wired for LAN inverter tests, but sample mode is not real hardware provenance.
- The public solar data replay demonstrates that public historical rooftop-solar profiles can be normalized into the same verifier shape and SPK mint preview while staying clearly outside live-hardware provenance.
- The hardware provenance model makes the physical-data gap explicit: L0 sample data is public-lab only, L2 is the minimum closed-pilot target, L3/L4 are the revenue-grade or utility-corroborated targets for real-value scale.
- The closed-pilot execution package turns the next lane into an action queue: collect L2 operator source, run the adapter, redeploy governed pilot stack, secure anchor economics, and rerun gates.
- The monetary stress harness keeps the economics honest by converting redemption waves into owed kWh, delivered kWh, shortfall kWh, fee buffer, and additional reserve requirement.
- The energy-money simulation uses recent real keeper-index days to model SPK issuance, settlement velocity, redemption claims, active supply, and reserve gaps across rooftop, neighborhood, and commercial archetypes.
- The empirical finance backtest uses 862 observed NASA POWER daily records to estimate annual energy value, DSCR, payback, and monthly revenue-at-risk across 10 kW, 250 kW, and 1 MW archetypes.
- The economic launch-readiness gate turns those empirical values into required realized energy value, maximum viable capex, annual support gap, capital support gap, sensitivity paths, and launch-mode blockers.

## Hard blockers before real paid launch

1. **Production-governed redeploy of the latest SPK contract**

   A fresh Sepolia proof stack now demonstrates `mintFromSurplusAttestation` and is source-verified, but it is proof-scoped and not Safe-admin/production-governed. A real pilot needs the same bytecode under proper governance, role separation, governed source verification, and runbooks.

2. **Real meter provenance**

   The current bundle and adapter sample are deterministic and useful for demonstration, but production needs a real operator source:

   - device identity
   - signed readings
   - timestamp and window validation
   - duplicate prevention
   - operator/auditor trail
   - fallback and dispute process

3. **Security audit and scope freeze**

   Mainnet or real-value launch needs a frozen commit, invariant list, parameter table, deployment runbook, and external review.

4. **Legal and commercial structure**

   SPK can look like a cryptocurrency, payment instrument, commodity-linked product, prepaid energy credit, or loyalty/reward mechanism depending on how it is sold and redeemed. Launch terms must be narrowed before taking real customer money.

5. **Liquidity and redemption policy**

   The repo has reserve and redemption mechanics plus a stress harness, but a paid launch needs a clear answer for what SPK holders can redeem, from whom, under what terms, and with what named reserve or insurance buffer.

## Recommended launch sequence

### Current launch decision

Run:

```bash
npm run product:launch-gate
```

Current gate result: **launch the SolarPunk Public Lab; do not launch paid/mainnet**.

That means the public demo, Sepolia proof, SPK mint dashboard, currency-system lab, pilot CSV proof, inverter/meter adapter output, energy-money simulation, empirical finance backtest, economic launch-readiness gate, monetary stress harness, resource benchmark lab, energy-standard economics, signed-meter fixture, CSV onboarding path, daily keeper evidence, and reproducible docs are launchable as an external public lab. A closed pilot is still blocked until there is a governed attested-SPK redeploy, one real operator meter/inverter export through the adapter, and anchor economics or support terms. A paid/mainnet product is blocked until audit, legal/commercial scope, redemption policy, named reserve/shortfall policy, production deployment, and self-consistent unit economics exist.

See `docs/product/PUBLIC_LAB.md` for the operating model.

### Phase 0: Product proof hardening

- Run `npm run attestations:fixture`.
- Run `npm run attestations:build`.
- Run `npm run proof:spk-attested-mint`.
- Run `npm run product:empirics`.
- Run `npm run product:pilot-csv`.
- Run `npm run meter:inverter-adapter -- --use-dev-fixture-key --now=2026-05-16T00:00:00Z`.
- Run `npm run product:hardware-provenance`.
- Run `npm run product:closed-pilot`.
- Run `npm run product:monetary-stress`.
- Run `npm run product:energy-money-sim`.
- Run `npm run product:empirical-backtest`.
- Run `npm run product:economic-launch`.
- Keep `docs/product/SPK_PRODUCT_EMPIRICS.md` as the grant/reviewer anchor.
- Keep `EnergyRevenueFloor` as a secondary module, not the product headline.

Target outcome: anyone can reproduce the core SPK product path and compare it to the public Sepolia proof.

### Phase 1: Governed public testnet SPK redeploy

- Move from proof-scoped deployment to governed deployment of latest `SolarPunkCoin`.
- Configure Safe/admin, minter, oracle, treasury, reserve token, and initial reserve.
- Use `npm run deploy:pilot-stack:sepolia` and `npm run pilot-stack:readback` for the governed SPK + treasury + currency-system stack.
- Run the meter-bundle mint script against Sepolia.
- Verify source and publish Etherscan proof links.
- Update frontend constants to point at the redeployed SPK address.

Target outcome: public explorer proof under pilot-grade governance that verified surplus kWh can mint SPK.

### Phase 2: Real meter/inverter adapter

- Replace sample bundle or sample adapter snapshots with one real operator data source.
- Prefer cumulative revenue-meter/inverter counters; use Fronius PowerFlow polling only after validating the site sign convention and interval quality.
- Target hardware tier L2 minimum for closed pilot: named operator, live inverter/gateway counters, signed interval records, duplicate-window rejection, source archive retention, and dispute process.
- Sign bundle records from a controlled operator key.
- Commit daily bundle summaries.
- Add freshness and failure alerts.
- Display latest meter source hash and mint proof in the frontend.

Target outcome: credible pilot-grade operating evidence without public real-money exposure.

### Phase 3: Closed pilot

- Use one known renewable site or operator.
- Cap mint amount and redemption obligations tightly.
- Use written pilot terms.
- Keep mainnet funds out until audit and legal checks are complete.

Target outcome: one credible case study.

## Product judgment

This is now pointed in the right direction for the original SPK idea. The repo proves the protocol mechanics locally and has enough empirical scaffolding for grants and reviewer conversations.

It is not yet a real-money product. The next decisive step is not adding more abstract economics. It is one real meter adapter plus governed redeploy/source verification of the attestation-enabled SPK contract.

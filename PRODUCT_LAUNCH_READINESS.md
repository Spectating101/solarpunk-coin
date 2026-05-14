# Product Launch Readiness

**Last updated:** 2026-05-14

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
| Contracts | `96/96` tests passing | The SPK mint and safety paths are covered locally |
| SPK attested minting | Implemented in `SolarPunkCoin` | Surplus minting is no longer just a trusted minter call |
| Meter ingestion | `scripts/derive_meter_attestations.js` verifies signed raw readings into `state/attestations/` | The data side now has registered meter identities and signature checks |
| Meter CSV import | `scripts/import_meter_csv.js` canonicalizes and signs inverter/meter CSV exports | First pilot-facing bridge from real meter exports into the attestation pipeline |
| Product proof | `docs/product/SPK_ATTESTED_MINT_PROOF.md` generated | Sample bundle minted `130.1697` SPK on Sepolia from `2606` on-chain kWh |
| Empirical dossier | `docs/product/SPK_PRODUCT_EMPIRICS.md` generated | The thesis evidence is now tied to the single SPK product claim |
| Meter spec | `docs/specs/METER_ATTESTATION_SPEC.md` added | Defines the adapter/oracle contract for signed reading validation |
| Frontend | Primary `SPK Mint` tab added | Demo UI explains the mint path instead of foregrounding the revenue floor |
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

## Hard blockers before real paid launch

1. **Production-governed redeploy of the latest SPK contract**

   A fresh Sepolia proof stack now demonstrates `mintFromSurplusAttestation` and is source-verified, but it is proof-scoped and not Safe-admin/production-governed. A real pilot needs the same bytecode under proper governance, role separation, governed source verification, and runbooks.

2. **Real meter provenance**

   The current bundle is deterministic and useful for demonstration, but production needs a real adapter:

   - device identity
   - signed readings
   - timestamp and window validation
   - duplicate prevention
   - operator/auditor trail
   - fallback and dispute process

3. **Security audit and scope freeze**

   Mainnet or real-value launch needs a frozen commit, invariant list, parameter table, deployment runbook, and external review.

4. **Legal and commercial structure**

   SPK can look like a tokenized energy receipt, payment instrument, commodity-linked product, or loyalty/reward mechanism depending on how it is sold and redeemed. Launch terms must be narrowed before taking real customer money.

5. **Liquidity and redemption policy**

   The repo has reserve and redemption mechanics, but a paid launch needs a clear answer for what SPK holders can redeem, from whom, under what terms, and with what operational limits.

## Recommended launch sequence

### Phase 0: Product proof hardening

- Run `npm run attestations:fixture`.
- Run `npm run attestations:build`.
- Run `npm run proof:spk-attested-mint`.
- Run `npm run product:empirics`.
- Keep `docs/product/SPK_PRODUCT_EMPIRICS.md` as the grant/reviewer anchor.
- Keep `EnergyRevenueFloor` as a secondary module, not the product headline.

Target outcome: anyone can reproduce the core SPK product path and compare it to the public Sepolia proof.

### Phase 1: Governed public testnet SPK redeploy

- Move from proof-scoped deployment to governed deployment of latest `SolarPunkCoin`.
- Configure Safe/admin, minter, oracle, treasury, reserve token, and initial reserve.
- Run the meter-bundle mint script against Sepolia.
- Verify source and publish Etherscan receipts.
- Update frontend constants to point at the redeployed SPK address.

Target outcome: public explorer proof under pilot-grade governance that verified surplus kWh can mint SPK.

### Phase 2: Real meter adapter

- Replace sample bundle with one real data adapter.
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

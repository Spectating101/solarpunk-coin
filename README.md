# Constraint Protocol Public Alpha

**An empirical claim lab for testing the rules that turn external evidence into bounded financial claims.**

Constraint asks a narrower and more operational question than tokenization alone:

> Given evidence **E**, provenance classification **A**, and declared policy **P**, what claim quantity may be admitted — and what happens when the resulting obligation cannot settle?

The public surface combines historical policy replay with an executable protocol laboratory:

`evidence → provenance → versioned policy → bounded claim → settlement result`

**Demo:** https://spectating101.github.io/solarpunk-coin/demo/  
**Protocol specification:** [`docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md`](./docs/protocol/CONSTRAINT_PROTOCOL_ALPHA.md)  
**Empirical study:** [`docs/protocol/EMPIRICAL_RUNS_V1.md`](./docs/protocol/EMPIRICAL_RUNS_V1.md)  
**Threat model:** [`docs/protocol/THREAT_MODEL_ALPHA.md`](./docs/protocol/THREAT_MODEL_ALPHA.md)  
**Readiness boundary:** [`docs/protocol/PUBLIC_ALPHA_READINESS.md`](./docs/protocol/PUBLIC_ALPHA_READINESS.md)

## What the public lab does

### Empirical Runs

A licensed CRSP/Refinitiv market-capacity panel was evaluated through conservative, aggregate-only research policies.

Delivered source package:

- 777,764 security-days;
- 2018-01-02 through 2024-12-31;
- 457 PERMNOs / 450 RICs in the delivered panel;
- source SHA-256 `792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5`;
- licence boundary `internal_yzu_licensed_no_redistribution`.

Constraint fails closed on ambiguous RIC identity relationships, uses only time-t market inputs for policy evaluation, clamps the realized-capacity floor to downside-only outcomes, and compares policies on common complete-case samples.

20-session common sample (`N = 734,379`):

| Policy | Historical coverage | Shortfall events | Mean permitted capacity |
|---|---:|---:|---:|
| `COLLATERAL-FIXED-20` | 97.2518% | 2.7487% | 80.0000% |
| `COLLATERAL-VOL-002` | 98.6941% | 1.3059% | 74.3669% |
| `COLLATERAL-VOL-LIQ-003` | 98.8626% | 1.1374% | 71.6849% |

The interface exposes both sides of the trade-off. The guarded reference policy adds 1.61 percentage points of historical coverage relative to the fixed baseline while reducing mean permitted capacity by 8.32 percentage points.

The stress replay on 2020-02-21 is intentionally ugly: fixed 20% generated 91.31% shortfall events; the volatility + liquidity rule reduced that to 80.52% and still failed badly. A stricter explicit rule can remain inadequate under severe realized stress.

### Browser reproduction receipt

The public `Reproduce` route fetches the committed aggregate study artifacts, computes SHA-256 over the exact UTF-8 bytes in the visitor's browser, and compares every result against `bundle-integrity.json`.

This proves byte identity of the published aggregate bundle. It does **not** prove truth of the licensed source observations, optimality of the research policies, or future adequacy.

### Protocol Lab

Five local evidence paths are available:

1. cumulative meter / inverter counters;
2. Green Button / utility interval CSV;
3. Fronius PowerFlow snapshot pairs;
4. signed meter readings plus registry context;
5. generic interval CSV.

The browser normalizes evidence, emits deterministic diagnostics, separates cryptographic consistency from trusted operator provenance, compares the same evidence under multiple versioned policies, creates a bounded claim manifest, and evaluates settlement coverage / shortfall.

The canonical demo deliberately reaches:

`valid evidence → valid policy admission → bounded issuance → insufficient settlement capacity → PARTIAL`

## Protocol objects

- `@solarpunk/constraint-core` — shared browser/Node implementation;
- independent Python conformance implementation;
- Draft 2020-12 JSON Schemas for evidence, provenance, policy, claim, and settlement;
- pinned `alpha-v1` JS/Python conformance vectors;
- `PolicyRegistry.sol`;
- `ClaimRegistry.sol`;
- `SettlementLedger.sol`.

Claims bind exact evidence hash, policy ID, semantic version, policy-manifest hash, subject, quantity/base units, decimal scale, unit, provenance, and claim state.

The first-admission replay key is policy specific:

`keccak256(evidenceHash, policyId, policyManifestHash, policyVersion, subject)`

This is not claimed as a universal physical-property or legal-right retirement rule.

## Quick start

```bash
npm install

# Protocol core, conformance, empirical bundle invariants
npm --prefix packages/constraint-core test

# Deterministic protocol demo
node scripts/protocol_alpha_demo.mjs

# Reference EVM stack
npx hardhat test test/ConstraintProtocol.test.js
hardhat run scripts/deploy_constraint_protocol_alpha.js

# Frontend
cd frontend
npm install
npm run dev
```

The full alpha CI also runs the independent Python implementation, package/wheel checks, JS/Python quickstart parity, complete Hardhat suite, frontend tests/build, local EVM smoke deployment, and real Chromium desktop/mobile review flows.

## SolarPunk / SPK reference application

Constraint was discovered through the SolarPunk energy-finance thesis and Public Lab. SPK remains a reference application and thesis artifact; it is no longer the protocol primitive or product ceiling.

The existing Sepolia reference remains inspectable:

| Contract | Sepolia address |
|---|---|
| SolarPunkCoin lab unit | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| SolarPunkCurrencySystem | `0x520162252F9B94824417678525FFd69145014970` |

SPK is a testnet lab unit, not legal money, a stablecoin, a token sale, or a legal claim on delivered energy.

SolarPunk product docs remain under [`docs/product/`](./docs/product/). The final revised thesis is maintained as a submission artifact outside the public repo until its final PDF is deliberately published; the SPK reference tab keeps the older v10 link explicitly labeled temporary.

## Public-data and licence boundary

No licensed CRSP or Refinitiv row-level observations are committed to the public empirical bundle.

CI fails if prohibited row-level fields such as `permno`, `ric`, `security_id`, `close_price`, or `company_name` appear in the serialized public study package. The public lab exposes aggregate policy results, methods, formulas, sample counts, stress definitions, source-package identity, and exact aggregate-file hashes.

## Not claimed

Public Alpha does **not** establish:

- legal underlying-resource ownership;
- environmental-attribute ownership or retirement;
- legal redemption rights;
- reserve custody;
- production collateral-control adequacy;
- certified meter finality;
- production oracle finality;
- formal audit completion;
- production governance;
- mainnet readiness.

The principal protocol trust boundary also remains explicit: an authorized claim issuer currently asserts that deterministic off-chain policy evaluation occurred correctly. The reference EVM does not re-execute arbitrary JavaScript or Python adapter/policy logic.

## Project map

| Track | Location |
|---|---|
| Constraint protocol alpha | `docs/protocol/`, `packages/constraint-core/`, `contracts/protocol/` |
| Empirical Runs | `docs/protocol/EMPIRICAL_RUNS_V1.md`, `frontend/public/empirical/` |
| Browser lab | `frontend/src/components/ConstraintProtocolLab.jsx` |
| Browser reproduction | `frontend/src/components/EmpiricalReproductionLab.jsx` |
| SPK reference application | `docs/product/`, `state/runtime/`, `spk_v1/` |
| Thesis support material | `thesis_package/` |
| CEIR negative-identification closure | `thesis_package/CEIR_FINAL_DIAGNOSIS.md` |

## Release posture

Constraint is a **public research/protocol alpha**. SolarPunk Public Lab remains a bounded Sepolia reference application.

The next field-value gate is one real L2 operator / inverter / gateway evidence source. The next protocol-research gate is reducing first-admission issuer trust without forcing arbitrary evidence adapters into Solidity.

Cite via [`CITATION.cff`](./CITATION.cff). Forks must not imply official endorsement; see [`TRADEMARK.md`](./TRADEMARK.md).

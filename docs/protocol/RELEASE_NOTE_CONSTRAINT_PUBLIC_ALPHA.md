# Constraint Protocol Public Alpha — Release Note

Release posture: public research/protocol alpha.

## Public entry point

`https://spectating101.github.io/solarpunk-coin/demo/`

The default public route is **Empirical Runs**.

The repository citation identity is **Constraint Protocol Public Alpha v0.1.0-alpha**; SolarPunk/SPK remains the motivating Sepolia reference application.

## Shipped surfaces

1. **Empirical Runs** — historical policy comparison on an aggregate, licence-bounded CRSP/Refinitiv-derived study surface.
2. **Reproduce** — browser-side SHA-256 verification of the exact committed public aggregate study bundle.
3. **Protocol Lab** — local evidence normalization, diagnostics, provenance classification, policy comparison, bounded claim creation, and settlement shortfall evaluation.
4. **SPK Reference** — the SolarPunk Sepolia research application that motivated the generalized protocol.
5. **Sepolia Proof** — existing SPK reference-contract read/write surface; Constraint protocol-alpha contracts remain separately deployment-gated.
6. **Research** — methods, protocol specification, CEIR negative-identification closure, limitations, and repository entry points.

## Empirical study identity

Internal source asset: `constraint_market_capacity_v1`

Source package SHA-256:

`792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5`

Delivered panel:

- 777,764 security-days;
- 2018-01-02 through 2024-12-31;
- 457 PERMNOs / 450 RICs in the delivered panel;
- licence boundary `internal_yzu_licensed_no_redistribution`.

The public site does not redistribute licensed row-level observations. It exposes aggregate results, declared formulas, sample rules, source identity, stress definitions, and exact aggregate-file hashes.

## Reference results

20-session common sample (`N = 734,379`):

| Policy | Coverage | Shortfall events | Mean permitted capacity |
|---|---:|---:|---:|
| `COLLATERAL-FIXED-20` | 97.2518% | 2.7487% | 80.0000% |
| `COLLATERAL-VOL-002` | 98.6941% | 1.3059% | 74.3669% |
| `COLLATERAL-VOL-LIQ-003` | 98.8626% | 1.1374% | 71.6849% |

The guarded rule increases historical coverage by 1.61 percentage points relative to the fixed baseline while reducing mean permitted capacity by 8.32 percentage points.

The selected 2020-02-21 stress replay remains intentionally adverse: the guarded rule reduces shortfall incidence relative to the fixed baseline but still records 80.52% shortfall events.

## Reproduction boundary

The browser `Reproduce` route verifies byte identity of five committed public aggregate artifacts against `bundle-integrity.json` using SHA-256.

This does not prove:

- truth of the licensed source observations;
- optimality of the declared research policies;
- future risk adequacy;
- legal collateral rights;
- reserve custody;
- production settlement finality.

## Protocol boundary

The constrained claim is the protocol primitive:

`evidence → provenance → versioned policy → bounded claim → settlement result`

The current reference EVM does not re-execute arbitrary JavaScript or Python policy logic. An authorized claim issuer still asserts that deterministic off-chain policy evaluation occurred correctly. Reducing this first-admission trust boundary is the next protocol-research gate.

## Field gate

One real L2 operator / inverter / gateway evidence source remains the decisive external-validation target.

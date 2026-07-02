# Closed Pilot Data Ask

SolarPunk Public Lab v1.0 is seeking **one real or semi-real meter/inverter export** to test whether renewable-surplus evidence can pass through the attestation and settlement pipeline in a **closed Sepolia pilot**.

This is a **research data request**, not a commercial offer or token sale.

## Purpose

> Can verified export/surplus counters from a real site produce accepted attestations, bounded testnet minting, and documented settlement evidence?

## Fields requested

| Category | Fields |
|----------|--------|
| **Site identity** | Operator or site name; anonymized site ID; country/region; generation resource; capacity (kW) |
| **Device identity** | Meter or inverter model; anonymized serial hash if preferred; commissioning date; rated capacity (kW) |
| **Interval counters** | Window start/end; generation kWh total start/end; site load kWh start/end (if available); export kWh start/end; curtailment (or zero) |
| **Signing & custody** | Who controls the gateway/signing key; rotation/revocation contact |
| **Economics** (optional) | Export credit or tariff ($/kWh); retail offset; PPA/FiT terms if any |
| **Corroboration** (optional) | Utility bill hash; inverter dashboard screenshot hash; Green Button export |

Full intake spec: [`CLOSED_PILOT_EXECUTION_PACKAGE.md`](./CLOSED_PILOT_EXECUTION_PACKAGE.md#operator-intake)

## What we deliver back

- Accepted / rejected row summary
- Deterministic source hash
- Testnet mint preview or Sepolia testnet mint (bounded, capped)
- Short pilot report (methods, tx hashes, limits)
- **No** commercial launch claim

## Non-claims

- No token sale or investment offer
- No mainnet deployment
- No real-money settlement
- No requirement to publish private customer data
- No legal claim on physical energy delivery
- No promise that SPK is money or legal tender

## Contact

Open a GitHub issue (closed pilot template):  
https://github.com/Spectating101/solarpunk-coin/issues/new?template=public-lab-pilot.md

Or email the repo maintainer with subject: **SolarPunk closed pilot data ask**.

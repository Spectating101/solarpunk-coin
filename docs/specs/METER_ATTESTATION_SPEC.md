# Meter Attestation Specification

## Purpose

This spec defines the current product-grade path from raw renewable-energy meter readings to SPK minting.

The goal is not to prove physical truth on-chain. The goal is to make the off-chain claim auditable, deterministic, and replay-resistant before it becomes an on-chain SPK mint.

## Data Path

1. A meter is registered in `data/attestations/meter_registry.json`.
   - For command-based onboarding, run `npm run meter:onboard`.
2. The meter signs raw readings in `data/attestations/raw_meter_readings.json`.
   - For fixture generation, run `npm run attestations:fixture`.
   - For a pilot-style inverter/meter CSV export, run `npm run attestations:import-csv`; see `docs/project/METER_CSV_IMPORT.md`.
3. `npm run attestations:build` verifies readings and writes `state/attestations/latest_attestation_bundle.json`.
4. `npm run proof:spk-attested-mint` hashes the accepted bundle, signs an oracle attestation, and calls `mintFromSurplusAttestation`.
5. `SolarPunkCoin` consumes both the attestation hash and the source hash before minting SPK.

## Meter Registry

Each registered meter record contains:

- `meter_id`: stable meter identifier
- `site_id`: renewable generation site
- `device_address`: Ethereum address that must recover from the reading signature
- `capacity_kw`: capacity sanity bound
- `active_after`: earliest accepted reading window
- `active_until`: latest accepted reading window

## Raw Reading

Each raw reading contains:

- `meter_id`
- `site_id`
- `window_start`
- `window_end`
- `generation_kwh`
- `site_load_kwh`
- `export_kwh`
- `curtailed_kwh`
- `quality_score`
- `source`
- `nonce`
- `payload_hash`
- `signature`

The signed payload excludes `payload_hash` and `signature`. The verifier recomputes the payload hash and uses `ethers.verifyMessage(bytes32 payload_hash, signature)` to recover the device address.

## Derived Surplus

The current formula is:

```text
surplus_kwh = export_kwh + curtailed_kwh
```

The verifier rejects records when:

- meter is not registered
- `site_id` does not match the registry
- signature does not recover the registered `device_address`
- `payload_hash` does not match the canonical reading payload
- `window_start >= window_end`
- `window_end` is in the future
- reading is outside the meter activation interval
- meter nonce is duplicated
- meter window is duplicated
- `quality_score` is below threshold
- energy fields are negative
- generation exceeds capacity sanity bound
- derived surplus is not positive
- derived surplus exceeds generation
- energy balance drift exceeds 2%

## Bundle Source Hash

The SPK source hash is computed from a canonical payload containing:

- schema
- batch ID
- min quality threshold
- accepted record hashes
- rejected record count
- total accepted surplus kWh

This source hash is then bound into the `SolarPunkCoin.surplusAttestationHash(...)` value signed by the oracle.

## On-chain Mint Guards

`mintFromSurplusAttestation` checks:

- caller has `MINTER_ROLE`
- oracle state is fresh
- grid is not stressed
- source hash is non-zero
- measurement window is valid and closed
- attestation validity window is active
- attestation hash has not been used
- source hash has not been used
- recovered signer has `ORACLE_ROLE`
- oracle/minter bonds satisfy configured minimums
- supply cap and reserve ratio remain valid

## Reproduce

```bash
npm run attestations:fixture
npm run attestations:build
npm run proof:spk-attested-mint
npm run proof:spk-public-readback
npm run product:empirics
```

## Current Scope Limits

- The included private keys are deterministic fixture keys only.
- The sample readings are synthetic pilot fixtures, not hardware-certified readings.
- A production adapter must replace fixture generation with inverter/meter API ingestion and hardware key custody.
- The public Sepolia proof stack is source-verified and exercised, but it is proof-scoped rather than production-governed.

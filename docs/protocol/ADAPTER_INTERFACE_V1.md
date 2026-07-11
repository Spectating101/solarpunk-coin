# Evidence Adapter Interface v1

## Purpose

An evidence adapter converts source-specific physical/resource data into the canonical evidence interval shape used by Constraint Protocol.

An adapter is **not** a provenance authority and is **not** an issuance policy.

```text
source-specific input
        ↓
adapter
        ↓
canonical interval(s) + diagnostics + capabilities
```

Policy evaluation happens later.

## Adapter output contract

Every adapter returns a normalized object with:

```text
schema        solarpunk.constraint.normalized_evidence.v1
adapter       { id, version }
source        source description
intervals     canonical intervals
diagnostics   PASS / WARNING / BLOCK diagnostics
capabilities  machine-readable source capabilities
summary       interval, surplus, blocker, warning counts
```

The canonical interval includes:

```text
meter_id
site_id
window_start
window_end
generation_kwh
site_load_kwh
export_kwh
curtailed_kwh
quality_score
source
eligible_surplus_kwh
surplus_basis
```

Optional adapter-specific fields may be retained when useful, but portable claim evaluation must rely on the canonical fields and capabilities.

## Adapter rules

An adapter implementation must:

1. preserve source identity fields when present;
2. use timezone-qualified canonical timestamps;
3. reject or diagnose malformed numeric energy fields;
4. never infer negative energy quantities into positive values silently;
5. state how eligible surplus was derived;
6. return deterministic normalized output for the same inputs;
7. expose assumptions as diagnostics;
8. never elevate provenance merely because parsing succeeded;
9. never claim legal ownership or redemption authority;
10. avoid private-key handling in browser adapters.

## Capabilities

Capabilities are boolean source facts used by later protocol stages.

Current examples:

```text
browser_local
identity
cumulative_counters
complete_energy_balance
quality_score
signed
cryptographically_verified
signature_verification
replay_checks
capacity_sanity
energy_balance
live_gateway_candidate
external_corroboration
instantaneous_power_estimate
```

A capability says what the evidence object can demonstrate. It is not the same as a provenance level.

Example:

```text
signed = true
cryptographically_verified = true
trusted_operator_context = false

→ provenance may remain L0
```

## Public-alpha adapters

### `generic-interval-csv`

Auto-maps common timestamp, generation, load, export, meter, site, cumulative, and quality fields.

### `green-button-utility`

Normalizes interval usage/flow-direction exports into daily import/export evidence. Export-only evidence does not prove on-site generation and receives an explicit warning.

### `cumulative-meter-pair`

Takes start/end cumulative counter snapshots, checks meter/site identity and monotonic counters, derives interval deltas, and diagnoses energy-balance drift.

### `fronius-powerflow-pair`

Uses `E_Total` delta for generation and endpoint-average `P_Load` / `P_Grid` for interval estimates. Negative `P_Grid` is treated as export under the current sign convention and is explicitly warned as an operator-validation requirement.

### `signed-meter-attestation-inspector`

Inspects signed readings against a supplied meter registry, including identity, closed window, nonce/window uniqueness, payload hash, signature recovery, registered signer, quality, capacity sanity, positive surplus, and 2% energy-balance drift.

The browser can verify cryptographic self-consistency. A self-supplied registry does not establish trusted operator provenance.

## Node-only/operator extensions

The existing SolarPunk operator stack retains:

- live Fronius LAN polling;
- device private-key signing;
- meter onboarding;
- source archive handling;
- authoritative attestation/mint operations.

Those paths should consume or converge on the same canonical evidence model without moving private keys into the browser.

## Extension target

A future adapter package should expose a metadata object and normalize function conceptually equivalent to:

```ts
interface EvidenceAdapter<TInput> {
  id: string;
  version: string;
  inputKind: string;
  normalize(input: TInput, options?: unknown): Promise<NormalizedEvidence> | NormalizedEvidence;
}
```

Public Alpha does not yet publish a dynamic adapter plugin loader. The interface is documented before opening arbitrary third-party browser execution.

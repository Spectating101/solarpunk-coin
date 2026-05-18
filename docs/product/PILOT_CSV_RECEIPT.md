# SolarPunk Pilot CSV Proof

- generated_at: `2026-05-18T16:12:55.145Z`
- execution_mode: `dev_fixture_signed_sample`
- csv_path: `data/attestations/sample_meter_export.csv`
- registry_path: `data/attestations/meter_registry.json`
- meter_id: `TW-TY-0001`
- site_id: `taoyuan-rooftop-a`
- unsigned: `false`
- private_key_written_to_repo: `false`

## Purpose

Show that a meter or inverter CSV export can become signed raw readings, an accepted surplus bundle, a deterministic source hash, and an SPK mint preview.

## Attestation Result

| Metric | Value |
|---|---:|
| CSV rows | `2` |
| Accepted readings | `2` |
| Rejected readings | `0` |
| Verified signatures | `2` |
| Total surplus | `1985.5 kWh` |

## Mint Preview

| Metric | Value |
|---|---:|
| Source hash | `0xa089804b3f432ad45c84d3bad1efbc9b89d1bb98059097eb3c5f966378babce8` |
| On-chain surplus | `1985 kWh` |
| Energy price basis | `$0.05/kWh` |
| Mint fee | `10 bps` |
| Net SPK preview | `99.15075 SPK` |
| Can mint SPK from bundle | `true` |

## Rejections

- none

## Next Step

Use the generated attestation bundle with scripts/mint_spk_from_meter_bundle.js against a local or governed Sepolia SPK stack.

## Hard Boundaries

- This proof does not certify hardware finality.
- A CSV export is pilot evidence only when the device key and operator custody are credible.
- Unsigned mode is useful for schema review but cannot mint SPK.
- A mint preview is not an on-chain mint; public proof still requires a transaction against an attestation-enabled SPK deployment.
- No private key is written to repo outputs.

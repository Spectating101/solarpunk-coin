# Attestation Schema V2 — Regime Metadata (Tier C P4)

**Exploration extension** to meter bundles. Addresses CEIR's **regime dependence** (mining geography shock) by tagging **where and when** production occurred.

---

## Bundle header

| Field | Value |
|-------|-------|
| `bundle_schema` | `SPK_ATTESTATION_BUNDLE_V2` |
| `source_schema` | `SPK_RAW_METER_READINGS_V1` |
| `registry_schema` | `SPK_METER_REGISTRY_V2` |

---

## Accepted attestation fields (v2 additions)

| Field | Example | Source |
|-------|---------|--------|
| `location_country` | `TW` | Meter registry |
| `grid_zone` | `TW-TPC-NORTH` | Meter registry |
| `energy_vintage` | `2026-02` | `window_end` YYYY-MM (or registry override) |

Existing v1 fields unchanged: `meter_id`, `site_id`, `window_start`, `window_end`, `surplus_kwh`, signatures, `record_hash`.

---

## Registry (`data/attestations/meter_registry.json`)

Each meter may define:

```json
{
  "meter_id": "TW-TY-0001",
  "site_id": "taoyuan-rooftop-a",
  "location_country": "TW",
  "grid_zone": "TW-TPC-NORTH",
  "capacity_kw": 120,
  "device_address": "0x..."
}
```

Rebuild bundle after registry edit:

```bash
npm run attestations:build
npm run exploration:tier-c
```

---

## Roadmap (not in v2 yet)

- Include `grid_zone` + `energy_vintage` in on-chain `source_hash` / attestation payload  
- EnergyTag / I-REC attribute alignment for retirement  
- Cross-zone issuance limits when regime metadata mismatches mint policy  

---

## CEIR stitch

China mining-ban = **structural regime break** in passive anchor.  
`grid_zone` + `energy_vintage` = explicit regime tags for **active** anchor — same lesson, designed response.

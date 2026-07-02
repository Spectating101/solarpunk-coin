# Tier C Exploration

**Off-thesis track** — empirical stitch from CEIR (passive anchor limits) to SPK v1 (designed network money) and toward stablecoin horizon C.

The grounded thesis stays frozen. This folder is where we **run checks and collect evidence**.

## AI tokenomics research (frozen)

| Doc | Branch |
|-----|--------|
| [`AI_TOKENOMICS_RESEARCH.md`](./AI_TOKENOMICS_RESEARCH.md) | **Objective** — tokenomics, stablecoins, AI credits, agent settlement (external research) |
| [`AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md`](./AI_TOKENOMICS_SOLARPUNK_INTEGRATION.md) | **SolarPunk** — how that research maps to SPK; integrate vs non-goals |
| [`AI_INTEGRATION_DECISION.md`](./AI_INTEGRATION_DECISION.md) | **Decision** — three-rail plan, gap inventory, phased sequence (**start here for execution**) |

## Start here

| Doc | Purpose |
|-----|---------|
| [`TIER_C_PROGRAM.md`](./TIER_C_PROGRAM.md) | Phases P0–P5, pass/fail gates, commands |
| [`PRODUCTION_VS_CONSUMPTION.md`](./PRODUCTION_VS_CONSUMPTION.md) | Why CEIR (burn) ≠ SPK (surplus) |
| [`METER_EVIDENCE.md`](./METER_EVIDENCE.md) | Meter mint criteria + canonical txs |
| [`ATTESTATION_SCHEMA_V2.md`](./ATTESTATION_SCHEMA_V2.md) | P4 regime tags (country, grid, vintage) |
| [`REDEMPTION_STRESS.md`](./REDEMPTION_STRESS.md) | P3 multi-scenario delivery stress |
| [`TIER_C_STATUS.md`](./TIER_C_STATUS.md) | **Auto-generated** — run report below |

## One command

```bash
npm run exploration:procure-data   # fetch/run real data pipelines first
npm run exploration:tier-c
```

Writes:

- `state/exploration/tier_c_report.json`
- `docs/exploration/TIER_C_STATUS.md`

## Operator loops

```bash
# Local Hardhat — meter attestation mint
CYCLE_MINT_MODE=meter npm run spk:v1:cycle

# Sepolia — requires .env PRIVATE_KEY + SEPOLIA_RPC
CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia
npm run spk:v1:sync
npm run exploration:tier-c
```

## Related (not in this folder)

- `thesis_package/CEIR_SPK_STITCH_PLAN.md` — narrative stitch plan
- `docs/product/CEIR_TO_SPK_LITERATURE_BRIDGE.md` — literature + translation matrix

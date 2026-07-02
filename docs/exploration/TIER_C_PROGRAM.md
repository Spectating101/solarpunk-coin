# Tier C Program — CEIR → SPK Exploration

**Status:** Active exploration (off-thesis).  
**Goal:** Make each CEIR failure mode answerable with **evidence**, not only prose.

---

## Phases

| ID | Phase | CEIR / stitch question | Pass gate (exploration) |
|----|-------|------------------------|-------------------------|
| **P0** | CEIR motivation frozen | Does passive anchor show conditional signal? | Reproducible CSV; pre-ban sig, post-ban weak |
| **P1** | Meter data stitch | Can we mint from **production** evidence, not Cambridge estimates? | Bundle with accept+reject; ≥1 Sepolia meter mint tx |
| **P2** | Production vs consumption | Is the architectural contrast documented? | `PRODUCTION_VS_CONSUMPTION.md` exists |
| **P3** | Redemption stress | What happens when owed kWh > delivery capacity? | `stablecoin_gate` scenario passes (pilot fail OK) |
| **P4** | Regime metadata | Site/time/country/grid/vintage on attestations? | Bundle schema V2 + all regime fields |
| **P5** | Peg vs oracle | Peg sim vs Ch 4 oracle tolerance | Peg off on-chain; sim + compare JSON |

**Overall pass** (`npm run exploration:tier-c`): **P0 + P1 + P2 + P4** core gates. P3/P5 are stress probes — failures are data, not blockers.

---

## Commands by phase

### P0 — CEIR

```bash
python thesis_package/ceir_regression.py --refresh-panel
npm run thesis:verify
```

### P1 — Meter mint loop

```bash
npm run attestations:build          # refresh bundle from fixtures
CYCLE_MINT_MODE=meter npm run spk:v1:cycle              # local
CYCLE_MINT_MODE=meter npm run spk:v1:cycle:sepolia      # public
npm run spk:v1:sync
```

Optional hardware path:

```bash
npm run meter:inverter-adapter
npm run attestations:import-csv
```

### P3 — Redemption stress

```bash
python scripts/exploration/redemption_stress.py
```

Tune `RedemptionStressParams` in script when reserve/delivery policy is defined.

### P5 — Peg simulation vs oracle

```bash
python scripts/simulate_peg.py
python scripts/foundation_peg_check.py
```

Compare max deviation to Taiwan oracle tolerance (~21.7% @ VR≥95%) in `TIER_C_STATUS.md`.

---

## CEIR finding → Tier C response

| CEIR finding | Tier C phase |
|--------------|--------------|
| Cambridge data is estimated | **P1** meter attestations |
| Regime break (mining geography) | **P4** site/time metadata |
| No holder energy claim | **P3** redemption delivery stress |
| Not a trading rule | **P2** — SPK is settlement, not CEIR fund |
| Energy ≠ dollar stability | **P5** peg-off ops + peg sim for horizon C |

---

## Roadmap after core pass

1. **Real inverter export** → replace fixture-only bundles (P1 hardening).
2. **Attestation schema v2** — EnergyTag-style location + vintage (P4).
3. **Redemption reserve policy** in sim + contracts (P3 pass target).
4. **Peg-on Sepolia pilot** with documented stress window (P5).
5. Optional academic panel (PoW vs production tokens) — external research.

---

## Artifacts

| Output | Path |
|--------|------|
| Machine report | `state/exploration/tier_c_report.json` |
| Human status | `docs/exploration/TIER_C_STATUS.md` |
| Meter criteria | `docs/exploration/METER_EVIDENCE.md` |

Regenerate: `npm run exploration:tier-c`

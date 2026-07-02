# Open Source Landscape — Reference Catalog

**Purpose:** Research inventory of OSS projects, APIs, and libraries relevant to SolarPunk / SPK v1.  
**Status:** Document only — integration mapping comes later.  
**Last compiled:** 2026-06-25

Use this when exploring:
- Frontend demo maps (solar site locations)
- Attestation / meter → chain pipelines
- REC / energy-certificate markets
- Stablecoin reserve / PoR patterns (professor project)
- Grid + infrastructure context layers

**Legend**

| Field | Meaning |
|-------|---------|
| **Maturity** | `production` / `active` / `research` / `legacy` / `demo` |
| **SPK fit** | `high` / `medium` / `low` / `reference-only` |
| **License** | Check repo before reuse — not legal advice |

**Data trust layers (always label in UI)**

| Layer | Meaning | Example in this repo |
|-------|---------|-------------------|
| **Modeled** | PVWatts / NASA estimate | `nrel_solar_map_scenarios.json` |
| **Detected** | CV on satellite imagery | SolarMap.PH, GeoSolarDataAI |
| **Public registry** | Third-party site DB | PVDAQ, OSM generators |
| **Attested** | Signed meter / device reading | `latest_attestation_bundle.json` |
| **Minted** | On-chain SPK issuance | Sepolia `mintFromSurplus` / attested mint |

---

## 1. How this maps to SPK / thesis

| SPK constraint | OSS categories to study |
|----------------|----------------------|
| Reliable energy data | Attestation (#4), detection (#2), PVDAQ/NASA/NREL APIs (#6) |
| Rule-bound issuance | EAS / Noethrion / InfraVeritas (#4), EW Origin (#5) |
| Pricing / risk | Stablecoin stress + oracle libs (#7), NASA/NREL (#6) |
| Protected settlement | REC marketplaces (#5), VeriJoule / Helios (#5), Chainlink PoR (#7) |
| Limited governance | Multisig patterns (existing `GOVERNANCE.md`), EW Origin admin (#5) |

**Thesis boundary:** Comparator and stress-test use only unless explicitly scoped as horizon C (peg/reserve product).

---

## 2. Solar location maps & rooftop UX

Best starting point for **frontend demo upgrade** (Leaflet map of sites).

| Project | URL | What it does | Stack | Maturity | SPK fit | Notes |
|---------|-----|--------------|-------|----------|---------|-------|
| **Solar-Roof-AI** | https://github.com/amarnath3003/Solar-Roof-AI | Map-first rooftop planner: draw roof, panel layout, financials, GeoJSON export | React, TS, Leaflet, Turf, Recharts | active | **high** | Closest React+Vite pattern to our frontend |
| **SolarMap.PH** | https://github.com/xmpuspus/solar-map-ph | Rooftop solar **detection** map; GeoJSON; `/map` UX | Astro, CLIP-ViT-L, OSM | active | **high** | Great map UX reference; PH-centric data (CC-BY-4.0) |
| **roofm2** | https://github.com/croppers/roofm2 | Draw roof polygon → NASA POWER climatology → charts/PDF | Next.js, Turf, Chart.js | active | medium | NASA POWER + map draw pattern |
| **SolarVision** | https://github.com/Hamdan772/SolarVision | Rooftop select → NASA POWER → ROI dashboard | Leaflet, OSM, vanilla JS | demo | medium | UX ideas; UAE-focused |
| **URJALink** | https://github.com/anushkayadav0901/URJALink | SegFormer roof segmentation + NASA POWER + Gemini reports | React, TS, Google Maps | demo | low | Heavy AI deps |
| **RayWise** | https://github.com/Kritika11052005/RayWise | Satellite upload → Gemini layout → installer network | Next.js 15 | demo | low | Product-style; not energy-money |
| **drawgeo** | https://github.com/kayes360/drawgeo | Polygon draw/import on Leaflet | Next.js, react-leaflet-draw | active | medium | Reusable draw tooling |
| **Open PV Market Mapper 2.0** | https://github.com/julyytran/open_pv_market_mapper_2.0 | US installs map from NREL OpenPV → GeoJSON | Rails, Leaflet, Mapbox | legacy | medium | Architecture reference; OpenPV API aged |
| **NREL Market Mapper** | https://github.com/nrel-market-mapper/nrel-market-mapper | NREL summaries → internal API → map/charts | Rails, Leaflet | legacy | **high** | Clean “cache API then map” pattern |

**Internal (already in repo):**

| Asset | Path | Role |
|-------|------|------|
| Pseudo-map UI | `frontend/src/components/SPKMintDemo.jsx` | CSS scatter — **not** real lat/lng map |
| Map-ready JSON | `state/product/nrel_solar_map_scenarios.json` | 12 PVWatts sites with lat/lng |
| Site simulator | `frontend/src/components/SitePilotSimulator.jsx` | Dropdown KPIs per site |
| Live demo (no map) | `frontend/src/components/SpkV1Console.jsx` | Wallet + ledger only |

---

## 3. Solar detection & geospatial datasets (CV / GIS)

Use for **context layers** (“panels likely here”) — **not** mint proof without attestation.

| Project | URL | What it does | Coverage | Maturity | SPK fit | Notes |
|---------|-----|--------------|----------|----------|---------|-------|
| **GeoSolarDataAI** | https://github.com/slzhang-git/GeoSolarDataAI | Building-level panel detection → GeoJSON polygons | Zurich, Berg, Bülach (CH) | research | medium | Free API; polygon export |
| **Microsoft solar-farms-mapping** | https://github.com/microsoft/solar-farms-mapping | Utility-scale solar segmentation India | India | research | reference-only | ML pipeline + visualizer |
| **GM-SEUS** | https://github.com/stidjaco/GMSEUS | Ground-mounted solar arrays US | United States | research | reference-only | Zenodo dataset + GEE scripts |
| **xmpuspus/solar-map-ph** | (see §2) | Rooftop detection + public map | Philippines | active | high | Also listed under UX |

---

## 4. Hardware attestation & meter → chain

Aligns with **Constraint 1 (data)** and **Constraint 2 (issuance)**.

| Project | URL | What it does | Chain | Maturity | SPK fit | Notes |
|---------|-----|--------------|-------|----------|---------|-------|
| **Noethrion** | https://github.com/noethrion/noethrion | ATECC608B signs kWh deltas → EVM L2; Foundry contracts | EVM L2 | active | **high** | Near thesis Ch 5 story; 127+ forge tests |
| **InfraVeritas Energy** | https://github.com/sidliarchukpetro/infraveritas-energy | P-256 edge signing → ZK → registry (Sepolia V3) | EVM Sepolia | active | **high** | Device registry + proof path |
| **WattWitness** | https://github.com/novaheic/WattWitness | ESP32 + ATECC608A → API → Chainlink Functions on-chain | EVM + Chainlink | active | **high** | Hardware → oracle pipeline |
| **Energy Attestation SDK (EnergyAS)** | https://github.com/suno-finance/energy-attestation-sdk-js | EAS attestations → EnergyRegistry | EVM (multi) | active | **high** | https://attest.energy — standard rail vs custom bundles |
| **EAS core** | https://github.com/ethereum-attestation-service/eas-contracts | Generic on-chain attestation protocol | EVM | production | medium | Underlies EnergyAS |
| **EAS SDK** | https://github.com/ethereum-attestation-service/eas-sdk | TS/JS client for attestations | EVM | production | medium | |
| **EAS indexing** | https://github.com/ethereum-attestation-service/eas-indexing-service | Index attestations for apps | EVM | active | medium | If we adopt EAS at scale |

**Internal (already in repo):**

| Asset | Path |
|-------|------|
| Meter fixture pipeline | `scripts/build_signed_meter_fixture.js`, `state/attestations/` |
| Inverter adapter | `scripts/inverter_meter_adapter.js` |
| Attested mint | `scripts/mint_spk_from_meter_bundle.js` |
| Operator cycle meter mode | `CYCLE_MINT_MODE=meter` in `scripts/run_spk_v1_operator_cycle.js` |

---

## 5. REC / energy certificates & P2P energy markets

Aligns with **settlement** and **market structure** research — not current SPK v1 headline.

| Project | URL | What it does | Chain | Maturity | SPK fit | Notes |
|---------|-----|--------------|-------|----------|---------|-------|
| **Energy Web Origin** | https://github.com/energywebfoundation/origin | Full EAC/REC/GO issuance + trading platform | Energy Web Chain | production | **high** | Enterprise reference; MIT; I-REC packages |
| **Helios Protocol** | https://github.com/Parinagpal11/helios-protocol | Inverter API → oracle → SREC cNFT marketplace | Solana | demo | medium | Enphase/SolarEdge adapters |
| **VeriJoule Core** | https://github.com/WilderformTools/verijoule-core | EIA grid data → CRE → ERC-1155 REC + USDC settlement | EVM Sepolia | demo | medium | Grid-level REC, not rooftop |
| **Voltx** | https://github.com/sambitsargam/Voltx | REC hub: mint, trade, retire | Hedera EVM | demo | medium | Facility registry pattern |
| **Faltric** | https://github.com/Precise-Goals/Falitric | 1 token = 1 kWh P2P on Sepolia | EVM Sepolia | demo | medium | Similar “energy token” lane |
| **SolarChain P2P** | https://github.com/AdrianDiepeveen/Blockchain-P2P-Renewable-Energy-Trading-Marketplace | Java dual-chain kWh/REC auctions + NREL | Custom Java | research | low | Academic architecture |

---

## 6. Public data APIs & government maps (no fork required)

Already partially integrated in this repo.

| Source | URL | What it provides | Used here? | SPK fit | Notes |
|--------|-----|------------------|------------|---------|-------|
| **NASA POWER** | https://power.larc.nasa.gov/ | Satellite solar/meteorology | **Yes** | **high** | Keeper, intelligence layer, backtests |
| **NREL/NLR PVWatts V8** | https://developer.nlr.gov/api/pvwatts/v8.json | Modeled PV output | **Yes** | **high** | Domain migrating to `developer.nlr.gov` by Apr 2026 |
| **PVDAQ** | https://github.com/NatLabRockies/pvdaq_access | Real PV site locations + production | No | **high** | Map of **measured** sites |
| **NREL RE Atlas / maps** | https://maps.nrel.gov/ | Resource & prospector maps | No | medium | Context only |
| **OpenEI / PVDAQ primer** | https://en.openei.org/wiki/PVDAQ/Primer | Site metadata schema | No | medium | |
| **Ausgrid open data** | (via `public_solar_data_replay.json`) | Public rooftop replay sample | **Yes** | medium | Lab JSON only |
| **OpenStreetMap** | https://www.openstreetmap.org | `power=generator` solar tags | No | medium | Via MapYourGrid toolchain |
| **PVGIS** | https://joint-research-centre.ec.europa.eu/pvgis | EU solar estimates | No | medium | SolarMap.PH uses it |

**Internal generators:**

```bash
npm run product:nrel-map        # → nrel_solar_map_scenarios.json
npm run product:nrel-training   # → nrel_solar_training_lab.json
```

---

## 7. Grid & infrastructure mapping (context layer)

Shows **where solar connects to grid** — useful for “locality” thesis theme, not mint proof.

| Project | URL | What it does | Maturity | SPK fit | Notes |
|---------|-----|--------------|----------|---------|-------|
| **MapYourGrid** | https://github.com/open-energy-transition/MapYourGrid | Global transmission grid mapping initiative | active | medium | https://mapyourgrid.org |
| **Awesome Electric Grid Mapping** | https://github.com/open-energy-transition/Awesome-Electric-Grid-Mapping | Curated grid datasets list | active | medium | Start here for links |
| **Grid Mapping Starter Kit** | https://github.com/open-energy-transition/grid-mapping-starter-kit | OSM + JOSM tutorials | active | medium | |
| **GridInspector** | https://github.com/ben10dynartio/apps_mapyourgrid | OSM grid quality analysis + indicator maps | active | medium | https://mapyourgrid.dynartio.com/gridinspector/ |
| **ColorMyGrid** | https://github.com/open-energy-transition/color-my-grid | JOSM MapCSS for grid lines | active | low | Mapper tooling |
| **OpenInfraMap** | https://openinframap.org | Browse OSM power infrastructure | production | medium | Embed-friendly tiles |

---

## 8. Stablecoin, proof-of-reserve & professor project

**Comparator + horizon C** — not thesis identity.

| Resource | URL | What it provides | SPK fit | Notes |
|----------|-----|------------------|---------|-------|
| **Chainlink Proof of Reserve** | https://chain.link/proof-of-reserve | Reserve feeds, secure mint patterns | **high** | Cited in thesis Ch 5 refs |
| **CRE PoR template** | https://docs.chain.link/cre-templates/bring-your-own-data | Bring-your-own reserve/NAV on-chain | **high** | Demo / not production |
| **CRE demo dapps** | https://github.com/smartcontractkit/cre-demo-dapps | Bank stablecoin flow examples | medium | |
| **CRE SDK examples (PoR)** | https://github.com/smartcontractkit/cre-sdk-typescript/tree/main/packages/cre-sdk-examples/src/workflows/proof-of-reserve | TypeScript workflow | medium | |
| **Chainlink ACE** | https://github.com/smartcontractkit/chainlink-ace | Compliance / blacklist policies | medium | Mint gating |
| **Aave Proof of Reserve** | (Aave ecosystem) | Pool-level reserve checks | reference-only | DeFi comparator |

**Internal peg work:**

| Asset | Path |
|-------|------|
| Peg simulation | `scripts/simulate_peg.py` → `state/foundation/peg_simulation_summary.json` |
| Peg check | `npm run foundation:peg-check` |

---

## 9. Map & chart libraries (building blocks)

| Library | URL | Use in SPK frontend | License | Notes |
|---------|-----|---------------------|---------|-------|
| **react-leaflet** | https://github.com/PaulLeCam/react-leaflet | **Recommended** for demo map | BSD-2 | Free tiles via OSM |
| **leaflet** | https://github.com/Leaflet/Leaflet | Core map engine | BSD-2 | |
| **MapLibre GL JS** | https://github.com/maplibre/maplibre-gl-js | Alternative to Mapbox | BSD-3 | Nicer vector maps |
| **Turf.js** | https://github.com/Turfjs/turf | Area, distance, GeoJSON ops | MIT | Used by Solar-Roof-AI |
| **react-leaflet-draw** | https://github.com/alex3165/react-leaflet-draw | Roof/site polygon drawing | MIT | |
| **recharts** | (already in `package.json`) | Time series | MIT | Already used in lab components |
| **deck.gl** | https://github.com/visgl/deck.gl | Large point layers | MIT | If 1000s of installs |

**Avoid for academic demo unless keys exist:** Google Maps (roofm2, URJALink), Mapbox (token cost).

---

## 10. Integration priority matrix (when we map later)

Suggested order — **document only**, not scheduled work.

| Priority | Target | OSS / data | Effort | Outcome |
|----------|--------|------------|--------|---------|
| **P0** | Live demo map panel | `nrel_solar_map_scenarios.json` + react-leaflet | Low | Real lat/lng map in `SpkV1Console` |
| **P1** | Site click → KPI | `SitePilotSimulator` logic | Low | Map drives existing model |
| **P1** | Refresh sync | `npm run foundation:sync` | Trivial | Stale index fix |
| **P2** | Real measured sites layer | PVDAQ API / `pvdaq_access` | Medium | Gray dots = public PV sites |
| **P2** | Attested sites layer | `pilot_meter_registry_demo.json` + mint ledger | Medium | Green = attested/minted |
| **P3** | EAS attestation path | `energy-attestation-sdk-js` | Medium–High | Standard attest rail |
| **P3** | Hardware reference | Noethrion / WattWitness docs | Research | Real meter roadmap |
| **P4** | Grid context overlay | OpenInfraMap / MapYourGrid OSM | Medium | Transmission context |
| **P4** | Detection overlay | SolarMap.PH GeoJSON (license check) | Medium | “Detected” layer |
| **P5** | Stablecoin stress calibration | Professor data + `simulate_peg.py` | Research | Horizon C only |
| **P5** | EW Origin study | `energywebfoundation/origin` | High | Full REC market reference |

---

## 11. What not to cargo-cult

| Don't | Why |
|-------|-----|
| Fork full SolarVision / URJALink / RayWise | Duplicates pricing lab; heavy AI/API keys |
| Treat CV detection as mint authorization | Detection ≠ signed surplus |
| Use OpenPV API as primary | Largely legacy; prefer PVWatts + PVDAQ |
| Import utility-scale India/GM-SEUS maps as SPK sites | Wrong granularity for rooftop SPK story |
| Reframe thesis as “energy stablecoin” | Stablecoin data = comparator / horizon C |
| Embed GM-SEUS GEE pipeline in frontend | Research batch tooling, not demo runtime |

---

## 12. Related internal docs

| Doc | Path |
|-----|------|
| Engine overview | `docs/foundation/ENGINE_OVERVIEW.md` |
| Instrument comparison | `docs/foundation/INSTRUMENT_COMPARISON.md` |
| NREL map scenarios | `docs/product/NREL_SOLAR_MAP_SCENARIOS.md` |
| Backend API | `docs/foundation/BACKEND.md` |
| Public lab (archived UI list) | `docs/product/PUBLIC_LAB.md` |
| Thesis readers guide | `thesis_package/THESIS_READERS_GUIDE.md` |

---

## 13. Maintenance

When adding a project:
1. Append to the right section table.
2. Tag **Maturity**, **SPK fit**, and **trust layer** (modeled/detected/attested/minted).
3. Note license if integrating code (not just ideas).
4. Re-run integration priority review if fit is `high`.

**Suggested refresh cadence:** quarterly, or when professor stablecoin dataset scope changes.

# Public Lab deployment & launch playbook

How to ship and maintain **SolarPunk Public Lab v1.0** as a valuable public testnet laboratory — demo, docs, evidence, and operator onboarding.

**Live demo:** https://spectating101.github.io/solarpunk-coin/demo/  
**Product definition:** [`PUBLIC_LAB_V1.md`](./PUBLIC_LAB_V1.md)

---

## What “launched” means here

Public Lab is **not** a token sale or mainnet product. A successful launch means:

| Surface | Success criterion |
|---------|-------------------|
| **GitHub Pages demo** | Landing + SPK console load; runtime JSON present |
| **Sepolia reference** | Inspectable contracts + indexed payment ledger |
| **Reproducibility** | Clone → test → `hardware:validate` passes |
| **Operator path** | Hardware quickstart + CSV/Green Button + fork deploy docs |
| **Honest gates** | Closed pilot + mainnet remain blocked in UI and scripts |

---

## One-command preflight (before every publish)

```bash
npm install
npm run public-lab:preflight
```

Checks: runtime JSON, launch gate, attestation tests, sample hardware validation, copies `spk_v1.json` into `frontend/public/`.

---

## Publish demo (maintainer)

```bash
# Refresh on-chain index when SEPOLIA_RPC works in .env
npm run foundation:sync

# Full publish: preflight → build → docs/demo mirror
npm run public-lab:publish
```

**CI:** `.github/workflows/deploy.yml` runs on every `main` push — builds frontend, mirrors to `docs/demo/`, deploys GitHub Pages.

**Manual trigger:** GitHub Actions → “Deploy to GitHub Pages” → `workflow_dispatch`.

---

## What visitors should do (value paths)

### Researchers (5 min)

1. Open demo URL → Review evidence link  
2. Clone repo → `npx hardhat test` (109)  
3. Read `thesis_package/SPK_V1_EVIDENCE.md`

### Energy operators with hardware (30 min)

1. Read [`HARDWARE_OPERATOR_QUICKSTART.md`](./HARDWARE_OPERATOR_QUICKSTART.md)  
2. `npm run hardware:validate` (sample)  
3. Export counters or Green Button CSV → `npm run hardware:validate -- --operator --csv=...`  
4. Deploy **your** Sepolia stack: `npm run spk:v1:deploy:sepolia:lean`

### Developers / Ethereum builders

1. [`OPEN_LAB_WORKFLOWS.md`](../project/OPEN_LAB_WORKFLOWS.md)  
2. SPK console tab on demo (wallet → Sepolia)  
3. Fork contracts; keep launch gates

### Closed pilot (canonical lab upgrade)

1. [`PILOT_DATA_ASK.md`](./PILOT_DATA_ASK.md)  
2. [Energy data issue](https://github.com/Spectating101/solarpunk-coin/issues/new?template=energy-data-experiment.md) — no secrets in public

---

## Operator data paths (summary)

| Input | Command |
|-------|---------|
| Sample fixture | `npm run hardware:validate` |
| Cumulative JSON snapshots | `npm run hardware:validate -- --operator --provider=cumulative-json --start=... --end=...` |
| Fronius LAN | `npm run hardware:validate -- --operator --provider=fronius-powerflow --host=192.168.x.x` |
| SPK CSV | `npm run hardware:validate -- --operator --csv=data/meter/export.csv` |
| Green Button CSV | `npm run meter:green-button -- --in=...` then `--csv=normalized.csv` |

**Canonical Sepolia minting** is minter-gated. Operators mint on **their deploy**, not `divx8e189…` unless invited to closed pilot.

---

## Release checklist

- [ ] `npm run public-lab:preflight` passes  
- [ ] `npx hardhat test` passes (109)  
- [ ] `state/runtime/spk_v1.json` synced (or note stale date in release note)  
- [ ] Demo screenshots optional: `npm run demo:screenshots`  
- [ ] Tag `public-lab-v1.x` if material release ([`PUBLIC_LAB_V1_RELEASE_NOTE.md`](./PUBLIC_LAB_V1_RELEASE_NOTE.md))  
- [ ] Push `main` → verify Pages deploy green  

---

## Stale index / RPC

If `foundation:sync` fails (public RPC 403):

- Demo still works from cached `frontend/public/spk_v1.json`  
- Note sync date on landing (auto from runtime)  
- Fix `.env` `SEPOLIA_RPC` with Alchemy/Infura URL  

---

## Files that power the public surface

| Asset | Path |
|-------|------|
| Landing UI | `frontend/src/components/PublicLabLanding.jsx` |
| Console | `frontend/src/components/SpkV1Console.jsx` |
| Runtime snapshot | `frontend/public/spk_v1.json` ← `state/runtime/spk_v1.json` |
| Pages build | `frontend/dist` → `docs/demo/` |
| Launch gate | `scripts/product_launch_gate.js` |
| Hardware validate | `scripts/hardware_validate.js` |

---

## Explicitly not in Public Lab v1 launch scope

- Mainnet / paid product  
- Token sale / ICO  
- Live dollar peg on canonical deployment  
- Permissionless mint on reference contracts for all operators  
- Production audit sign-off  

See launch gates in UI and [`PRODUCT_LAUNCH_GATE.md`](./PRODUCT_LAUNCH_GATE.md).

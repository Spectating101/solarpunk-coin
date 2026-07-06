# Public Lab Roadmap

Open research lab trajectory for SolarPunk Public Lab v1.0 — **not** a product launch roadmap.

**Live status:** [`CURRENT_STATUS.md`](../../CURRENT_STATUS.md)  
**Product definition:** [`PUBLIC_LAB_V1.md`](../product/PUBLIC_LAB_V1.md)

---

## Shipped (v1.0)

- Public Lab landing + SPK console (Sepolia)
- Canonical SPK v1 contracts on Sepolia
- 109 Hardhat tests
- Runtime sync + evidence export
- Launch gates + non-claims in UI and docs
- Open lab workflows + contributor docs
- Legacy automation retired; dead UI archived

---

## Now (open lab usability)

- [x] `OPEN_LAB_WORKFLOWS.md` — replicate without maintainer
- [x] `ENERGY_DATA_ADAPTER_GUIDE.md` — meter/inverter path
- [x] `EXTENSION_POINTS.md` — safe fork surfaces
- [x] Issue templates — replication, energy data, bugs
- [ ] Refresh `foundation:sync` when stable RPC available (stale index date)
- [ ] Optional: hosted replication video / 5-minute “run the lab” screencast

---

## Next gate (external validation)

**One real meter or inverter export** through the same attestation → mint → settlement pipeline.

| Step | Status |
|------|--------|
| Public data ask documented | Done — [`PILOT_DATA_ASK.md`](../product/PILOT_DATA_ASK.md) |
| Adapter sample (L0) | Done |
| Real operator export (L2+) | **Blocked** — needs partner + data terms |
| Closed pilot report | Not started |

This upgrades the lab from **public reference** to **externally validated pilot candidate**. It does not imply mainnet or token launch.

---

## Later (only if external hook appears)

- Closed pilot execution package (governed redeploy if needed)
- Institution-specific replication kits (university lab, green finance sandbox)
- Contributor-submitted adapter providers (Modbus, vendor APIs)
- Grant / public-goods packaging refresh (verify numbers first)

---

## Explicitly out of scope for Public Lab v1.0

- Mainnet or paid product
- Token sale / ICO
- Live dollar peg on canonical deployment
- Legal tender or stablecoin claims
- Production audit sign-off
- “SolarPunk is launched” marketing

---

## How to influence the roadmap

1. **Replication issues** — what blocked you?
2. **Energy data issues** — propose a closed pilot dataset (no secrets in public issues)
3. **PRs** — docs, tests, adapters (fixtures only in public repo)

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

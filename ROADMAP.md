# ROADMAP

**Last updated:** 2026-06-07

This roadmap tracks **research and implementation completeness**, not product launch. For current facts see [`CURRENT_STATUS.md`](./CURRENT_STATUS.md).

## Guiding rule

Every milestone should produce something a third party can **reproduce or inspect** — tests, CSVs, contracts, or on-chain TX hashes.

---

## Completed

### Repo and thesis foundation
- Canonical thesis framing (`thesis_package/THESIS_SOURCE_OF_TRUTH.md`)
- Six grounded chapter drafts
- CEIR and pricing empirical artifacts in `thesis_package/empirical_results/`
- Python pricing library with tests (`energy_derivatives/`)

### Contract implementation
- **103/103** Hardhat tests across 5 contract suites
- Attested surplus minting (`mintFromSurplusAttestation`)
- `SolarPunkCurrencySystem` — local pilot stack only
- `EnergyRevenueFloor` — implemented, not deployed

### External inspectability (Sepolia, 2026-04–05)
- Legacy stack deployed and source-verified
- Safe multisig + 24h timelock on core contracts
- 7-transaction interaction proof (`state/proofs/sepolia_interaction_proof.json`)
- Attested SPK public mint proof (May 2026)
- NASA keeper: 25 successful runs through **2026-05-21** (logs in `state/keeper_logs/`)

### Research tooling
- Meter attestation pipeline (fixture, CSV import, inverter adapter)
- Product lab scripts + `state/product/` JSON outputs
- Frontend demo + energy-money workbench
- Independent Codex code review (April 2026)

---

## In progress

### Thesis manuscript
- Finalize grounded chapters against `THESIS_SOURCE_OF_TRUTH.md`
- Citations, tables, department formatting
- Retire stale claims in `thesis-draft.md` (79-test era)

### Documentation hygiene
- Align handoff docs with verified test counts and Sepolia-only network story
- Mark launch/pilot packets as research appendices (`docs/project/DOC_MAINTENANCE.md`)

### Code health
- Fix failing `closed_pilot_execution_package` node test (92/93)
- Decide fate of keeper automation (stale since May 2026)

---

## Optional / deferred

These were scoped for a pilot/launch phase that is **no longer the project focus**. Code and docs may remain as research artifacts.

- Governed redeploy of attestation-enabled SPK under Safe
- Real operator meter export (hardware L2+ provenance)
- Formal third-party security audit
- Mainnet or paid product
- Grant submissions refresh

---

## Suggested next work (research-first)

1. **Thesis:** merge grounded drafts → submission draft; sync Pillar 3 appendix with 103-test breakdown
2. **Docs:** grep and fix remaining stale numbers (`docs/project/DOC_MAINTENANCE.md`)
3. **Evidence:** refresh `EVIDENCE.md` keeper section when/if automation resumes
4. **Tests:** close the one node-test failure; consider CI job for `test-node/`

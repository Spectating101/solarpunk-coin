# Strategic Assessment — 2026-05-14

## Bottom Line

SolarPunk should be treated as an energy-attestation protocol first and a token/derivatives platform second.

The strongest current product claim is:

> Verified surplus renewable-energy kWh can be converted into SPK through a signed, replay-protected oracle attestation.

This is now backed by code, tests, a source-verified Sepolia proof stack, a public mint transaction, a public readback, a frontend path, and grant-facing evidence. That is strong enough for grant applications, advisor conversations, and early operator discovery. It is not enough for real-money launch.

## What Exists

### Product Core

- `SolarPunkCoin.mintFromSurplusAttestation` exists and is test-covered.
- The contract consumes both `attestationHash` and `sourceHash`, blocking replay of the same oracle signature or same accepted meter bundle.
- The mint path still respects minter/oracle roles, oracle freshness, grid stress, reserve checks, supply cap, mint fee split, validity windows, and recipient checks.
- Public Sepolia proof stack exists and is source-verified:
  - Attestation-enabled SPK: `0x8ceDa149EDE44078bf151b3334513916a84df820`
  - Proof MockUSDC: `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268`
  - Proof ProtocolTreasury: `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F`
- Public attested mint tx exists:
  - `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d`
- Public readback exists:
  - `docs/product/SPK_PUBLIC_READBACK.md`

### Data And Meter Path

- Fixture meter registry and signed raw readings exist.
- Attestation derivation rejects bad signatures, duplicate nonces, duplicate windows, low quality, future windows, capacity violations, and balance drift.
- CSV import and meter onboarding now exist as pilot-facing bridges:
  - `scripts/onboard_meter.js`
  - `scripts/import_meter_csv.js`
  - `docs/project/METER_CSV_IMPORT.md`
- CSV sample derives `1,985.5` kWh accepted surplus from `2` signed rows.

### Evidence Surface

- `README.md`, `EVIDENCE.md`, `CURRENT_STATUS.md`, `docs/grants/REVIEWER_PACKET.md`, and `docs/product/` now point at the SPK product path.
- Contract tests pass: `102/102`.
- Node attestation tests pass: `14/14`.
- Frontend build and tests pass.
- Sepolia readback passes.

## What Is Secondary

These are useful, but should not be the headline:

- `SolarPunkOption`: supporting financial/hedging layer.
- `EnergyRevenueFloor`: secondary pilot/commercial module.
- NASA keeper: recurring real-data credibility, but not the core SPK mint proof.
- Thesis empirics: legitimacy layer, not direct production proof.
- Frontend: explanation/proof surface, not a product by itself.

## Real Blockers

### Critical

1. Production-governed attestation-enabled SPK deployment.
   - Current attested proof stack is public and source-verified, but proof-scoped.
   - It is not Safe-admin, not audited, and not role-separated enough for a real pilot.

2. Real meter provenance.
   - CSV/onboarding bridge is useful.
   - It is not hardware-backed, not a live inverter API, and not certified meter finality.

3. Formal audit or serious external review.
   - The code is well tested locally.
   - Mainnet or real-value pilots still require an external security process.

4. Counterparty proof.
   - No solar operator LOI, discovery-call note, advisor letter, or signed pilot.
   - This is the biggest non-code gap for grants and business credibility.

5. Legal/commercial framing.
   - SPK could be interpreted as a cryptocurrency, reward token, payment instrument, commodity-linked product, prepaid energy credit, or security-like instrument depending on launch terms.
   - Real launch should not proceed until the claim is narrowed.

### Important But Not Immediate

- Chainlink Automation / Functions migration.
- L2 deployment lane.
- Hardware meter adapter.
- Multi-signer Safe expansion.
- Public walkthrough video.
- Frontend polish around operator/customer story.

## Overclaim Risks

Avoid saying:

- “Production ready.”
- “Mainnet ready.”
- “Hardware-certified energy minting.”
- “Real solar operator pilot.”
- “Audited.”
- “SPK prints money.”
- “Guaranteed revenue.”
- “Fully decentralized oracle.”

Safe wording:

- “Public Sepolia proof.”
- “Source-verified proof stack.”
- “Replay-protected attested mint path.”
- “Pilot-facing CSV import bridge.”
- “Formal audit and real meter provenance remain open.”
- “Not production-governed yet.”

## Reproducibility Issue Found And Fixed

`package.json` previously defined:

```bash
npm test -> hardhat test --no-compile
```

But `.gitignore` ignores `artifacts/`, and `git ls-files artifacts` returns `0`.

This means a fresh clone may fail `npm test` unless the user runs `npm run compile` first. The correct fix is probably:

```json
"test": "hardhat test"
```

This has been fixed in the current working tree. `npm test` now compiles before running the Hardhat suite.

## Recommended Next Action Order

### 1. Stabilize The Patchset

Do this before any more product work.

- Keep the `npm test` reproducibility fix.
- Run full verification from a clean-ish state.
- Decide whether to commit the current proof/product changes in one checkpoint commit.
- Ensure no generated build/dependency folders are staged.

### 2. Submit Grant / Reviewer Packet

Use the current SPK proof as the headline.

- Chainlink BUILD: emphasize oracle dependency, signed-meter path, Chainlink Automation/Functions migration.
- Ethereum ESP: emphasize open-source Ethereum public-good research infrastructure and externally inspectable proof.

### 3. Get One External Signal

Highest ROI non-code move.

- Advisor acknowledgement.
- Solar operator discovery call.
- LOI.
- Audit quote.
- Chainlink/ESP feedback reply.

### 4. Only Then Build More

The next code should depend on who responds:

- If a solar operator responds: build their exact meter/API adapter.
- If Chainlink responds: build Automation/Functions prototype.
- If ESP responds: tighten audit scope, invariant docs, L2/public-good report.
- If advisor responds: strengthen thesis-to-protocol framing.
- If nobody responds: make a two-minute walkthrough video and send more outreach.

## Decision

Stop adding broad features for now.

The repo has enough technical proof to leave the pure build phase and enter the validation phase. The immediate priority is packaging, reproducibility, external review, and one real stakeholder signal.

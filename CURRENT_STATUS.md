# CURRENT STATUS

**Last updated:** 2026-05-19
This file is the canonical stage snapshot for external reviewers.

## Status table

| Area | Current status |
|---|---|
| Stage | Public lab phase — public Sepolia attested mint proof live; production-governed redeploy pending |
| Smart contracts | **102/102 tests passing** |
| Primary product | SPK attested surplus minting: meter bundle -> source hash -> oracle signature -> SPK mint |
| Currency-system lab | Four-layer lab artifact generated: public proof, local SPK settlement loop, redemption framework, settlement framework |
| Currency-framework contract | `SolarPunkCurrencySystem` implemented locally: SPK invoice settlement, redemption burn into owed-kWh claim, fulfillment/shortfall/dispute states |
| Local SPK settlement loop | Local no-external-dependency run: signed meter surplus -> SPK mint -> 75 SPK settled -> 20 SPK redeemed -> 400 kWh delivered |
| Pilot-stack currency drill | Added: governed-style local stack deploys MockUSDC + ProtocolTreasury + SolarPunkCoin + SolarPunkCurrencySystem, mints 130.1697 SPK, settles 75 SPK, redeems 20 SPK, and resolves 400 kWh delivered |
| Pilot CSV proof | Added: sample meter/inverter CSV -> signed readings -> accepted bundle -> deterministic source hash -> 99.15075 SPK mint preview |
| Inverter/meter adapter | Added: cumulative counter snapshot adapter + Fronius PowerFlow polling mode; sample output produces 1 accepted signed interval and 996.2 kWh accepted surplus |
| Operator data intake | Added: generic operator CSV/profile intake -> validated rows -> eligible surplus -> 5.14485 SPK sample preview and reusable case-study output |
| Hardware provenance model | Added: L0-L4 assurance tiers with risk haircuts, issuance caps, upgrade checklist, and current L0 sample status |
| Closed pilot execution package | Added: operator intake, action queue, commands, caps, acceptance criteria, and owners for every remaining pilot step |
| Monetary stress harness | Added: redemption-wave and physical-shortfall scenarios with conservation checks, fee buffers, and explicit additional reserve requirements |
| Energy-money simulation | Added: real keeper-index resource signal -> explicit surplus assumptions -> SPK issuance -> settlement velocity -> redemption/reserve model |
| SPK finance dossier | Added: annualized income statement, balance-sheet liability view, break-even fee-base gap, reserve coverage, and closed-pilot finance stack |
| Empirical finance backtest | Added: 862-day NASA POWER historical irradiance backtest translating resource variability into DSCR, payback, and monthly reserve-at-risk |
| Economic launch readiness | Added: empirical DSCR/payback launch gate with required realized value, max capex, support gaps, and sensitivity paths |
| Governed pilot-stack scaffold | Added: deploy/readback scripts for MockUSDC + ProtocolTreasury + SolarPunkCoin + SolarPunkCurrencySystem under pilot governance roles |
| Theory/comparables anchor | Added: SPK positioned as an energy-standard cryptocurrency anchored to RECs, granular certificates, Green Button/ESPI, Energy Web, SolarCoin, Powerledger, BIS tokenisation, FSB stablecoin risk controls |
| Multi-resource benchmark lab | Added: NASA POWER solar/wind/temperature fetch, standard 10 kWdc PV conversion, $3.15/Wdc install-cost assumption, renewable benchmark matrix, and oil-only energy-unit comparison |
| Energy-standard economics | Added: gold-standard mapping, issuance equations, kWh/SPK convertibility, capacity scenarios, settlement velocity, fee sensitivity, and finance risk register |
| Pilot meter adapter | CSV meter/inverter import, meter onboarding scripts, and inverter/meter adapter now feed the signed-reading verifier |
| Public solar replay | Added: historical Ausgrid rooftop-solar sample -> normalized export surplus -> lab-signed verifier bundle -> 0.8991 SPK mint preview |
| Independent code review | **Codex review (April 2026) — 5 findings identified and fixed; regression tests added** |
| Source verification | **All 5 legacy Sepolia contracts verified on Etherscan**; all 3 fresh attested SPK proof contracts also verified |
| Governance delay | **86,400s (24h) on all 3 core contracts** |
| Bond requirements | **100 USDC for all operator roles** |
| Option margin | **Live Sepolia config: 150% initial / 75% maintenance; stress-tested next pilot target: 250% / 125% before larger exposure** |
| Oracle architecture | **ChainlinkOracleAdapter deployed; daily NASA keeper live since 2026-04-20** |
| Stability pool | **Dedicated StabilityPool contract (not address(this))** |
| Treasury loop | Implemented (mint/redeem fees, trading fees, liquidation penalties, bond slashing) |
| On-chain interaction proof | 7 confirmed Sepolia transactions + daily keeper TXs since April 20 |
| Frontend | Live — reads Sepolia contract state every 30s and now foregrounds the `SPK Mint`, public lab launch path, and interactive energy-money workbench |
| Python SDK | spk-derivatives v0.5.0 (PyPI) — chain_client reads all live protocol state |
| Local demo | Available (`npm run demo:treasury`) |
| Security audit | Not started — requires funding (~$25k); primary grant deliverable |
| Multisig admin | **Safe `0xB95586775C73feB0154828c77832E106425C818A` is admin on the 3 core contracts; StabilityPool admin remains deployer EOA** |
| Pilot counterparties | Not yet secured (highest-leverage gap) |
| Revenue floor module | Secondary module; useful for pilots, no longer the primary product claim |
| Mainnet readiness | NO_GO until formal audit |

## Deployed contracts (Sepolia, all verified)

| Contract | Address |
|---|---|
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| EnergyRevenueFloor | `0x0000000000000000000000000000000000000000` (not deployed) |

## Attested SPK public proof stack (Sepolia)

| Contract / proof | Address / tx |
|---|---|
| Attestation-enabled SolarPunkCoin | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Proof MockUSDC | `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268` |
| Proof ProtocolTreasury | `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F` |
| Signed-meter SPK mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |

See [`CONTRACT_ADDRESSES.md`](./CONTRACT_ADDRESSES.md) for full parameter state and explorer links.

## Honest status line

The repo now has a coherent SPK product path: signed raw meter readings, deterministic accepted bundle, oracle-signed surplus attestation, replay-protected minting, public Sepolia mint proof, pilot CSV proof, operator data intake, inverter/meter adapter output, public historical solar replay, hardware provenance model, closed-pilot execution package, empirical dossier, resource benchmark lab, energy-standard economics, energy-money simulation, monetary stress harness, historical resource-to-finance backtest, economic launch-readiness gate, and a local SPK currency-framework contract for invoice settlement plus owed-kWh claim tracking. The launchable surface is the SolarPunk Public Lab: public demo, reproducible proof, Sepolia readback, daily keeper evidence, NASA/PV/wind resource benchmarks, Ausgrid rooftop-solar replay, generic operator CSV case-study path, 862-day finance backtest, economic threshold table, energy-standard issuance math, meter CSV onboarding, inverter adapter sample path, hardware assurance tiers, closed-pilot action queue, and reviewer/operator/commercial pilot packets. The older Safe-admin Sepolia deployment still proves the earlier core system and daily NASA keeper; the fresh proof stack proves the attested SPK mint path but is not production-governed. Remaining gates before real launch are real meter provenance, audited production governance, governed source verification, legal/commercial scope, named shortfall/reserve policy, and signed economics that clear DSCR/payback thresholds.

See [`docs/product/PUBLIC_LAB.md`](./docs/product/PUBLIC_LAB.md) for the current public lab model, [`EVIDENCE.md`](./EVIDENCE.md) for clickable proof links, and [`MASTER_HANDOFF.md`](./MASTER_HANDOFF.md) for full context.

## Open trust gaps

| Gap | Status |
|---|---|
| Production-governed attestation-enabled SPK redeploy | Open — public proof stack exists, but not Safe-admin/production-governed |
| Real signed meter adapter | Partial — CSV/onboarding bridge plus inverter/meter adapter exists; hardware-backed meter custody and a real operator live source are still open |
| Economic launch terms | Partial — empirical thresholds are quantified; unsupported paid launch remains blocked until tariff/PPA, capex, support capital, or service revenue terms clear the gap |
| Shortfall/reserve policy | Partial — monetary stress harness quantifies gaps; named reserve capital and legal redemption terms still open |
| Single EOA admin | **Closed for core contracts — Safe is admin; StabilityPool auxiliary admin remains deployer EOA** |
| No formal audit | Open — Code4rena identified, pending funding |
| Chainlink energy feed | Partial — adapter live, running manual price; real feed pending mainnet |
| No dispute window for settlement index | Open — multi-oracle aggregation is M4 scope |

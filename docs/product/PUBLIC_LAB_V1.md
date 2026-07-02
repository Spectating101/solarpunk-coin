# SolarPunk Public Lab v1.0

**A renewable-energy issuance standard for programmable settlement.**

## One sentence

SolarPunk Public Lab v1.0 is a public testnet laboratory for an energy-standard settlement architecture: verified renewable-surplus evidence can produce bounded SPK issuance, circulate through network payments, and remain constrained by explicit settlement and governance gates.

## What this is

- **Energy-standard settlement lab** — not a monetary product launch.
- **Public Sepolia testnet** — inspectable contracts, ledger, and evidence.
- **SPK** — the lab unit (~1 verified surplus kWh per SPK on testnet).
- **Peg off** — USD/kWh reference is expression only, not a live dollar peg.
- **Research artifact** — thesis-bounded claims + reproducible operator commands.

**Core public claim:**

> Verified renewable-surplus evidence → bounded testnet issuance → network settlement on Sepolia.

## What this is not

- Not a token sale or ICO.
- Not mainnet or legal tender.
- Not a stablecoin or live dollar peg.
- Not a promise of delivered physical kWh on demand.
- Not audited production multi-oracle governance.
- Not revenue-grade meter finality (current hardware tier: **L0** fixture/sample).
- Not investment advice.

## Architecture

1. **Energy evidence** — signed meter/inverter readings → attestation bundles → provenance tiers (L0–L4).
2. **Issuance discipline** — mint only from accepted surplus; replay-safe source hashes; supply caps.
3. **Network circulation** — typed on-chain payments (SERVICE, LABOR, GOODS, NETWORK).
4. **Settlement accounting** — redemption, shortfall, and reserve gaps modeled explicitly.
5. **Governance and launch gates** — roles, economics blockers, staged endpoints.

## Current public evidence

*Metrics from `state/runtime/spk_v1.json` (last indexed sync). Re-run `npm run foundation:sync` with a working `SEPOLIA_RPC` in `.env` to refresh.*

| Item | Value |
|------|--------|
| SPK contract | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| Payment / currency system | `0x520162252F9B94824417678525FFd69145014970` |
| Network | Sepolia (chain ID 11155111) |
| Total supply | ~5,499 SPK |
| SPK settled (network) | ~442 SPK |
| Network payments | 21 |
| Circulation share | ~96.7% |
| Cumulative surplus minted | ~5,514 kWh |
| Peg | **Off** |
| USD reference | $0.05/kWh (expression only) |
| Contract tests | 109 passing (`npx hardhat test`) |
| Last indexed sync | 2026-06-10 (refresh locally before citing live) |

**Evidence pack:** [`thesis_package/SPK_V1_EVIDENCE.md`](../../thesis_package/SPK_V1_EVIDENCE.md)  
**Runtime JSON:** [`state/runtime/spk_v1.json`](../../state/runtime/spk_v1.json)  
**Live demo:** https://spectating101.github.io/solarpunk-coin/demo/

## Launch gates

| Endpoint | Status | Reason |
|----------|--------|--------|
| **Public Lab v1.0** | **Shipped** | Testnet evidence, docs, demo, reproducible commands |
| Closed pilot | Blocked | Real operator meter/inverter (L2+), governed redeploy, economics terms |
| Paid / mainnet | Blocked | Audit, legal scope, redemption policy, reserves, production governance |

Details: [`CLOSED_PILOT_EXECUTION_PACKAGE.md`](./CLOSED_PILOT_EXECUTION_PACKAGE.md)

## Reproduce

```bash
npm install
npx hardhat test
npm run spk:v1:sync          # requires .env SEPOLIA_RPC + PRIVATE_KEY
npm run spk:v1:evidence:export
npm run foundation:health
cd frontend && npm install && npm run dev
```

## Future work (not v1 debt)

- Real operator meter/inverter export ([`PILOT_DATA_ASK.md`](./PILOT_DATA_ASK.md))
- L2+ hardware provenance
- Governed attested redeploy (multisig)
- Closed pilot report
- Legal / commercial scope
- External audit

Institutional path: [`docs/project/INSTITUTIONAL_MATERIALIZATION_PATH.md`](../project/INSTITUTIONAL_MATERIALIZATION_PATH.md)

## Freeze sentence

> SolarPunk Public Lab v1.0 is a public testnet laboratory for an energy-standard settlement architecture: verified renewable-surplus evidence can produce bounded SPK issuance, circulate through network payments, and remain constrained by explicit settlement and governance gates. It is not a monetary product, token sale, stablecoin, or legal claim on delivered energy.

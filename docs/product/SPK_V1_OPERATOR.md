# SPK v1 Operator Guide

Product-first operations for the canonical testnet money system.

## Canonical runtime

All commands read/write `state/runtime/spk_v1.json` (synced to `frontend/public/spk_v1.json`).

Current Sepolia stack (energy-native):

| Contract | Role |
|----------|------|
| `solar_punk_coin` | Issuance + burn |
| `currency_system` | Network payments + redemption registry |

## Daily / weekly loop

```bash
# One command: refresh oracle → mint → circulate → optional redeem → sync
npm run spk:v1:cycle              # local Hardhat
npm run spk:v1:cycle:sepolia      # public testnet

# Refresh UI/runtime from chain only
npm run spk:v1:sync
```

Environment knobs:

| Var | Default | Meaning |
|-----|---------|---------|
| `CYCLE_MINT_MODE` | `attested` | `attested` · `meter` (real bundle, scaled) · `surplus` (operator mint) |
| `CYCLE_METER_SCALE` | `0.02` | Fraction of fixture surplus when `meter` mode (~52 kWh from 2606 kWh bundle) |
| `CYCLE_MINT_KWH` | `50` | Surplus kWh to mint each cycle (`0` to skip) |
| `CYCLE_REDEEM_SPK` | `5` | Optional redemption size (`0` to skip) |

## First-time setup

```bash
npm run spk:v1:launch:sepolia:lean   # deploy + genesis (once)
```

Credentials: root `.env` (`PRIVATE_KEY`, `SEPOLIA_RPC`).

## What counts as "the product"

- **Issuance:** verified surplus → SPK (energy-native)
- **Primary activity:** `settleNetworkPayment` (SERVICE, LABOR, GOODS, NETWORK)
- **Secondary:** optional `openRedemption` / resolve
- **Not the product:** legacy stacks, launch-gate JSON, lab readiness scores

## Superseded (history only)

- Attested SPK `0x8ceDa…` (May 2026 dollar-translated proof)
- Attached CurrencySystem `0x3Fa51…`
- Legacy Safe stack `0x1D55…` (options/treasury demo)

Legacy remains in repo for options/keeper demos; **SPK v1 runtime is canonical for network money.**

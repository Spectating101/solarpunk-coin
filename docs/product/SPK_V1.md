# SPK v1 — Network Money (Testnet Launch)

SPK v1 is the **primary product**: energy-attested network money on Ethereum testnet. Not a thesis appendix. Not a lab layer.

## Monetary constitution

| Rule | v1 value |
|------|----------|
| Issuance | Energy-native — verified surplus kWh mints SPK (~1 SPK = 1 kWh) |
| Primary use | Network circulation — `settleNetworkPayment` between participants |
| Peg | **Off** — no PI chase of $1 |
| USD reference | Optional quote only (`referenceUsdPerKwh`) for dashboards |
| Redemption | Optional secondary exit — energy delivery tracked off-chain |
| Stack | `SolarPunkCoin` + `SolarPunkCurrencySystem` + `ProtocolTreasury` |

## One runtime config

All tooling and the frontend read:

- `state/runtime/spk_v1.json`
- `frontend/public/spk_v1.json` (synced on deploy/genesis)

## Commands

```bash
# Local testnet (full launch dry-run)
npm run spk:v1:launch

# Sepolia one-time deploy
npm run spk:v1:launch:sepolia:lean

# Weekly operator loop (attested mint + 4 party payments + optional redeem)
npm run spk:v1:cycle:sepolia
npm run spk:v1:sync

# Attested mint only (unique cycle bundle per run)
npm run spk:v1:mint:attested:sepolia
```

Credentials: root `.env` (`PRIVATE_KEY`, `SEPOLIA_RPC`).

## What v1 proves

1. **Deploy** — one stack, one config, energy-native policy baked in  
2. **Genesis** — meter surplus → mint → network payments → optional small redemption  
3. **Operate** — circulation metrics on-chain (`networkMetrics`)

## What v1 is not (yet)

- Mainnet / token sale  
- Legal tender or guaranteed utility delivery  
- Production multi-oracle governance  

Those are scale layers. v1 is the **live cryptocurrency system prototype** on testnet.

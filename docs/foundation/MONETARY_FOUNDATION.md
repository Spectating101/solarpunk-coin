# Monetary Foundation

**Product north star** — energy-anchored unit, USD translation, rule-bound circulation. Not an L1 chain project.

## What we build

| Layer | Role |
|-------|------|
| **Anchor** | Verified energy surplus → SPK (~1 kWh per SPK) |
| **Translation** | USD/kWh reference + pricing models for economic expression |
| **Circulation** | Typed on-chain network payments |
| **Stability** | Peg machinery in contracts (off in lean ops until tested) |
| **Rail** | Ethereum Sepolia today — settlement infrastructure, not the competitor |

## Three horizons

1. **Foundation** — define anchor, rules, USD translation, constraint map  
2. **Structure** — live testnet: mint, pay, redeem, sync, metrics (where we are)  
3. **Long-run** — peg credibility under stress; rails become interchangeable if unit wins trust  

Horizon 3 is strategy, not a shipped claim.

## vs other instruments

We compare to **stablecoins and monetary designs** (USDC, DAI), not to Ethereum or XRP as chains.

- **USDC:** bank collateral, opaque attestation  
- **SPK:** energy rule, on-chain issuance path, explicit USD/kWh reference  

See `INSTRUMENT_COMPARISON.md`.

## Five constraints (operating map)

| Constraint | Product meaning |
|------------|-----------------|
| Data | Mint only from verified surplus / attestation |
| Issuance | Supply changes under published contract rules |
| Pricing | USD value explicit via reference + models |
| Settlement | Payments + redemption ledgered on-chain |
| Governance | Roles, parameters, future multisig |

Live values: `FOUNDATION_STATUS.md` (`npm run foundation:build`).

## Build rhythm

```bash
npm run foundation:sync    # chain → runtime → foundation status
npm run foundation:cycle   # operator cycle + sync + foundation (Sepolia)
```

## Language

**Use:** energy-anchored network money, USD translation, circulation-first testnet  
**Avoid:** production stablecoin, beats Ethereum, guaranteed peg

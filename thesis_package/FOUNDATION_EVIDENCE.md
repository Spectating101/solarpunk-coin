# Foundation Evidence (generated)

**Generated:** 2026-06-08T13:22:29.709500+00:00
**Runtime:** `state/runtime/spk_v1.json`
**Foundation doc:** `MONETARY_FOUNDATION.md`

## Monetary policy (Horizon A → B)

| Field | Value |
|-------|-------|
| Energy anchor | 1.0 kWh per SPK |
| USD translation (reference) | $0.0500 / kWh |
| Peg enabled (ops) | **False** |
| Primary use | network_circulation |
| Secondary sink | optional_energy_redemption |

## Implied USD expression (reference only; not market peg)

- Total supply: **5,404.01 SPK** → ~**$270.20** at reference rate
- Settled in network: **388.00 SPK** → ~**$19.40**
- Cumulative surplus minted: **5,414 kWh**

> Reference USD/kWh is a **valuation layer** for thesis pricing (Ch 4). It is not a claim that SPK trades at par on markets.

## Five constraints → live indicators

| Constraint | Indicator | Observed |
|------------|-----------|----------|
| Data | cumulative_surplus_kwh | 5,414 kWh |
| Issuance | total_supply_spk | 5,404.01 SPK |
| Pricing | reference_usd_per_kwh | $0.0500/kWh |
| Settlement | network_payment_count | 15 |
| Settlement | total_settled_spk | 388.00 SPK |
| Governance | peg_enabled | False |
| Governance | deployer / roles in runtime | see `spk_v1.json` |

## Circulation vs redemption (use layer)

| Metric | Value |
|--------|-------|
| Circulation share | 97.48% |
| Redeemed SPK | 10.00 |

## Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| SolarPunkCoin | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` |
| CurrencySystem | `0x520162252F9B94824417678525FFd69145014970` |

**Synced at:** 2026-06-08T13:22:27.715905Z

## Latest indexed payment

- Kind: **SERVICE**
- SPK: **12.0**
- Payee: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Tx: `0x6c65e0ae7cd1d124fcd1d0dce4fc833b429e9d95a30ccd0f853ad9dc04c4c37b`

## Horizon reminder

- **Thesis claims:** bounded feasibility + constraint mapping (Horizon A–B).
- **Not claimed:** live USD peg, mainnet, rail displacement (Horizon C).

Regenerate after sync: `npm run thesis:foundation`

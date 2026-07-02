# Redemption Stress — Tier C P3

**Exploration only.** Models delivery backlog when SPK holders redeem for owed kWh — mirrors `SolarPunkCurrencySystem` shortfall / dispute paths.

---

## Scenarios (`scripts/exploration/redemption_stress.py`)

| Scenario | Intent | Typical result |
|----------|--------|----------------|
| `pilot_current` | Tight capacity, shocks | **Fail** — documents today's risk |
| `operator_target` | Higher delivery + reserve buffer | May pass — ops target |
| `stablecoin_gate` | Horizon C policy | **Pass target** for exploration gate |

Run:

```bash
npm run exploration:redemption-stress
```

---

## Parameters (tunable)

| Field | Meaning |
|-------|---------|
| `delivery_capacity_kwh_per_day` | Operator physical delivery cap |
| `reserve_kwh_buffer` | Pre-positioned kWh headroom |
| `mean_daily_redemptions` | Poisson rate of redemption events |
| `mean_kwh_per_redemption` | Average kWh per event |
| `capacity_shock_prob` | Bad-weather / grid shock days |
| `dispute_prob_on_shortfall` | Share of shortfall paths that dispute |

---

## Gates

- **Shortfall:** &lt;15% of Monte Carlo paths end with undelivered backlog  
- **Dispute:** &lt;10% of paths trigger dispute on shortfall  

**P3 exploration pass** (`npm run exploration:tier-c`): `stablecoin_gate` scenario passes.  
`pilot_current` failing is **expected** and supports the CEIR stitch (“passive hope breaks under stress — design delivery policy”).

---

## CEIR stitch

CEIR shows regime-dependent passive anchoring. Redemption stress shows **settlement** regime risk: claims can outrun delivery without reserves. Answers Ch 2 Bretton Woods analogy in simulation form.

---

## Next engineering

1. Wire reserve ratio from `ProtocolTreasury` into sim parameters.  
2. On-chain stress script calling `resolveRedemption` with partial delivery.  
3. Publish operator SLA (kWh/day) from real site capacity.

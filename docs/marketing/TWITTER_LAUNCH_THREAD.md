# SolarPunk Protocol - Twitter/X Launch Thread

**Instructions:** Post as a thread. Each section = 1 tweet. Include images where noted.

---

## Tweet 1 (Hook)

Solar farms lose money when the sun shines too much.

Sounds backwards? It's not. Negative pricing hit $0/MWh over 300 times in ERCOT last year.

We built a protocol to fix this. Here's what SolarPunk does:

---

## Tweet 2 (The Problem)

Renewable energy is 189% more volatile than fossil fuels.

Solar farms can't hedge their revenue because:
- Too small for Wall Street
- No standardized energy options market
- Traditional finance ignores sub-10MW producers

$500M+ in annual losses. Zero tools to manage it.

---

## Tweet 3 (The Solution)

SolarPunk Protocol = revenue floor for any solar farm on Earth.

How it works:
1. NASA satellite data calibrates your location's risk
2. Our pricing engine computes a fair hedge premium
3. Smart contract enforces the payout automatically

No broker. No minimum size. Just physics + math + code.

---

## Tweet 4 (The Tech - Pricing Engine)

The engine prices energy derivatives using:

- Binomial trees (exact lattice pricing)
- Monte Carlo simulation (risk analysis)
- Mean-reversion models (energy-specific dynamics)
- Jump-diffusion (price spike events)

All calibrated on 3 years of NASA POWER satellite data for any lat/lon on Earth.

[IMAGE: Screenshot of API response from /v1/price endpoint]

---

## Tweet 5 (The Tech - Smart Contracts)

On-chain settlement layer (Solidity):

- VaR-based margining (no under-collateralization)
- PI controller for stablecoin peg stability
- Auto-liquidation at 150% margin ratio
- 46/46 tests passing

The clearinghouse can't be turned off, paused unfairly, or drained.

[IMAGE: Screenshot of test results - 46/46 passing]

---

## Tweet 6 (Simulation Results)

We simulated 1,000 days of market stress:

- 5% daily volatility + random 15% shocks
- PI controller maintained peg 78.6% of the time
- Max deviation: controlled within bounds
- System survived every stress scenario

This isn't a whitepaper promise. It's running code.

[IMAGE: spk_simulation.png chart]

---

## Tweet 7 (The API - Try It Now)

The pricing engine is a live API anyone can use:

```
curl -X POST /v1/price \
  -d '{"S0": 50, "K": 55, "sigma": 0.35}'
```

Returns: fair option price in milliseconds.

Free tier: 100 requests/day, no signup.
Full docs at /docs (Swagger UI).

---

## Tweet 8 (Who This Is For)

If you operate a solar farm, wind farm, or hydro plant:

You're exposed to price risk you can't hedge.

SolarPunk gives you a revenue floor - the same tool Goldman Sachs has, but:
- Accessible at any scale (even 1 MW)
- Priced by physics, not by a broker's margin
- Settled on-chain, no counterparty risk

---

## Tweet 9 (The Ask)

We're looking for:

1. Solar/wind operators who want to test a free risk assessment
2. DeFi builders who want to integrate energy derivatives
3. Climate-focused grant programs or investors

DM open. Or just try the API - no signup needed.

---

## Tweet 10 (Close)

Renewable energy won the generation war.

Now it needs to win the finance war.

SolarPunk is the derivatives infrastructure to make that happen.

GitHub: github.com/Spectating101/solarpunk-coin
API: [your-deployment-url]/docs

Built in Taiwan. Powered by the sun.

---

## Posting Tips

- **Best time to post:** Tuesday-Thursday, 9-11 AM EST (US energy + crypto audiences)
- **Tag accounts:** @solaboratories @chainaboratories @EnergyWebX @gitcoin @0xPolygon
- **Hashtags (use sparingly):** #DeFi #CleanEnergy #RenewableEnergy #Solarpunk
- **Images matter:** Tweets with images get 2-3x engagement. Use simulation charts, API screenshots, test results
- **Engagement strategy:** After posting, reply to 5-10 relevant accounts in energy/DeFi space with a link to Tweet 1

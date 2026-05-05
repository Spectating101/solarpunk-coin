# SolarPunk Demo Walkthrough Script

**Target length:** 2 minutes  
**Audience:** grant reviewers, ecosystem teams, advisors

## 0:00-0:20 — Problem

Renewable energy projects have volatile production and revenue. Smaller solar operators cannot easily access institutional hedging, so weather risk becomes a financing blocker.

SolarPunk explores whether Ethereum settlement plus physics-based public data can create a transparent hedging primitive for this market.

## 0:20-0:50 — Proof tab

Open the frontend on the Proof tab.

Show:

- Latest NASA-derived index.
- Reserve ratio and oracle freshness.
- Daily experiment chart.
- Latest Sepolia transaction link.
- Contract explorer links.

Say:

> This is not just a static dashboard. The latest run is committed in the repo, linked to a public Sepolia transaction, and cross-checked against live contract reads.

## 0:50-1:20 — Evidence path

Scroll to "Verify the experiment in four clicks."

Show:

- Keeper run.
- NASA input.
- Sepolia transaction.
- Live contract state.

Say:

> The point of the demo is external inspectability. A reviewer can verify the daily data pipeline without trusting screenshots or claims.

## 1:20-1:45 — Hedge tab

Open the Hedge tab.

Show:

- Live Sepolia Series A.
- Type / strike.
- Expiry.
- Required margin.
- Execution readiness checklist.

Say:

> This is still a testnet prototype. The interface is intentionally guarded: it previews live deployed contract state and only enables execution when the wallet and series state are ready.

## 1:45-2:00 — Ask

Open the Status tab.

Say:

> The next step is not more concept work. Funding unlocks audit, oracle productionization, and a risk-boxed pilot. The current repo already provides the proof surface; the grant turns it into a credible external pilot.


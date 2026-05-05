# SolarPunk Protocol — Frontend

> On-chain solar revenue insurance, priced from real NASA satellite data.

**Live demo:** _(deploy to Vercel/Netlify and add URL here)_
**Contracts:** [`Spectating101/solarpunk-coin`](https://github.com/Spectating101/solarpunk-coin)
**Pricing engine:** [`Spectating101/spk-derivatives`](https://github.com/Spectating101/spk-derivatives)

---

## What this is

A working dApp interface for hedging solar farm revenue. Solar farms lose money when energy prices fall below their breakeven; SolarPunk Protocol writes put options on solar revenue indices, priced live from NASA POWER irradiance data using a binomial tree model, and settles on-chain.

This repo contains the **frontend** — the pricing terminal, hedge composer, position book, and farm explorer. The smart contracts and pricing library are in their own repos (linked above).

## Stack

- Single-file HTML + React 18 (no build step)
- JetBrains Mono / Instrument Serif typography
- Live data from NASA POWER API + on-chain reads from Sepolia
- Bloomberg-terminal-inspired information density

## Running locally

This project uses inline Babel JSX, so it must be **served**, not opened via `file://`.

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000/SolarPunk%20Protocol.html
```

Or deploy to Vercel/Netlify (zero config — drag-and-drop the folder).

## On-chain proof (Sepolia)

7 contracts deployed, 79 tests passing. Contract addresses, oracle updates, and keeper transactions are surfaced live in the **Overview** tab and verifiable on Etherscan.

## Status

Prototype. Testnet only. Not production clearing infrastructure.

## Author

Christopher Ongko · s1133958@mail.yzu.edu.tw

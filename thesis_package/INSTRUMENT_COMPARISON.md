# Instrument Comparison — Monetary Design Space

**Purpose:** Thesis-facing comparison table. We argue in the **stablecoin / monetary-unit** literature space, not the L1 chain space.

**Canonical scorecard (Ch 2 seven conditions):** `empirical_results/monetary_scorecard.csv` from `monetary_scorecard.py`

---

## Table 1 — What each instrument optimizes for

| Dimension | USDC / fiat-backed | DAI / crypto-collateral | Bitcoin (PoW) | ETH (native) | SPK (designed) |
|-----------|-------------------|-------------------------|---------------|--------------|----------------|
| **Primary anchor** | USD bank / T-bill claims | Crypto collateral + governance | Hashpower / energy cost (passive) | Network utility + gas | Verified energy surplus (active rules) |
| **USD expression** | ~$1 target | ~$1 target | Market BTC/USD | Market ETH/USD | USD/kWh reference + Ch 4 pricing |
| **Issuance rule** | Issuer mint/burn | Collateral ratio + MKR | Block subsidy + fees | Block subsidy + fees | Oracle/surplus attestation |
| **Settlement** | Transfer + issuer | Transfer + vault | UTXO transfer | Transfer + contracts | Typed network payments + redemption registry |
| **Transparency of backing** | Attestation reports | On-chain collateral | Energy cost (indirect) | None (no peg) | On-chain rules + meter path |
| **Thesis role** | Comparator | Comparator | Ch 3 empirical anchor | Implementation rail | Ch 5 designed system |
| **Our claim** | — | — | Passive anchor is conditional | Rail, not monetary competitor | Designed constraints are testable |

---

## Table 2 — Five constraints (thesis framework) × instrument

| Constraint | USDC | DAI | Bitcoin | SPK v1 (testnet) |
|------------|------|-----|---------|------------------|
| **Reliable energy data** | N/A | N/A | Indirect (mining) | Attested / surplus path (pilot) |
| **Rule-bound issuance** | Issuer policy | Vault rules | Protocol固定 | Contract + roles |
| **Explicit pricing / risk** | $1 assumption | liquidation math | Market only | Ch 4 + reference USD/kWh |
| **Protected settlement** | Transfer | Vault + liquidation | Transfer | CurrencySystem + invoice hashes |
| **Limited governance** | Corporate | DAO + oracles | Protocol change slow | Roles; multisig planned |

**Reading guide:** SPK is not “better” on all rows today. It is **different on anchor and transparency**, and **must be measured** on peg/stability rows before stablecoin claims strengthen.

---

## Table 3 — Rail vs money (why we do not “fight Ethereum”)

| Layer | Examples | Project relationship |
|-------|----------|----------------------|
| **Settlement rail** | Ethereum, XRP Ledger, banks, L2s | **Use** as infrastructure |
| **Unit of account** | USD, EUR, (aspirational: energy-anchored unit) | **Design** target |
| **Medium of exchange** | USDC, stablecoins, (SPK circulation) | **Test** on Sepolia |

Long-run strategy (internal): if unit-of-account credibility compounds, rails become interchangeable. **Thesis does not prove this.**

---

## Table 4 — Phrasing map

| Concept | Academic phrase | Internal phrase |
|---------|-----------------|-----------------|
| Physical backing | energy-linked constraint | energy anchor |
| USD linkage | explicit USD valuation | dollar translation |
| Near-term ops | circulation-first prototype | network money v1 |
| Long-run goal | (future work / implication) | peg credibility; monetary layer |
| vs Ethereum | EVM testnet implementation | rail, not rival |

---

## How to regenerate extended scorecard

```bash
npm run thesis:foundation
```

Updates `FOUNDATION_EVIDENCE.md` with live Sepolia metrics mapped to constraints.

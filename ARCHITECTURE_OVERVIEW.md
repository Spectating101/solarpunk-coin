# ARCHITECTURE OVERVIEW

## One-line description

SolarPunk turns verified energy value into programmable settlement, hedging, and treasury flows.

## Layer map

| Layer | Main components | Purpose |
|---|---|---|
| Data / attestation | meter and oracle inputs, verification scripts | verify the inputs before financial actions |
| Pricing | Python risk/pricing engine (`energy_derivatives/`) | estimate premiums and risk surfaces |
| Settlement | `SolarPunkCoin.sol`, `SolarPunkOption.sol` | enforce mint/redeem, margin, liquidation |
| Treasury | `ProtocolTreasury.sol` | route fees, hold bonds, split budgets |
| Ops / evidence | deploy + readiness + receipt scripts | prove current state to reviewers |

## Value flow

```text
Verified energy + oracle inputs
            |
            v
   Settlement contracts execute
            |
            +--> Mint/redeem fees (SPK)
            +--> Option trading fees (USDC)
            +--> Liquidation penalties (USDC)
            +--> Bond slashes (USDC)
                        |
                        v
                ProtocolTreasury
                        |
                        v
      Reserve / Insurance / Ops / Audit budgets
```

## Contract stack

### 1. SolarPunkCoin

- handles energy-backed mint/redeem paths
- includes peg and reserve safety controls
- routes fees to treasury

### 2. SolarPunkOption

- handles margin and liquidation
- charges trading fees on position changes
- routes penalty/fee flow into treasury/insurance fund

### 3. ProtocolTreasury

- receives protocol revenue
- disburses into policy buckets
- manages keeper bond deposits/withdrawals/slashing

## Solvency and control layer

- reserve checks and grid stress gates
- margin and maintenance checks
- role-based permissions for critical paths
- explicit NO_GO policy for mainnet without audit/evidence

## Funding-use map

| Funding use | Why it matters |
|---|---|
| Public testnet deployment and proof | external inspectability |
| Security review and audit prep | risk credibility |
| Oracle/data hardening | input integrity |
| Prototype polish and walkthroughs | pilot readiness |
| Partner-facing docs and packaging | adoption and grant conversion |


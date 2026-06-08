# Governance — SPK v1

Bounded trust layer for the monetary foundation. **Do not run on mainnet without review.**

## Current state

- Deployer EOA holds minter / operator / admin roles on Sepolia lean stack
- Documented in `state/runtime/spk_v1.json` → `roles`, `governance_admin`

## Target state

- **Gnosis Safe** (start 1-of-1, expand to N-of-M) owns:
  - `SolarPunkCoin` — via `handoffAdmin(safe)`
  - `SolarPunkCurrencySystem` — `DEFAULT_ADMIN_ROLE` on Safe, revoked from deployer

## Commands

```bash
# Show what would be handed off (no txs)
npm run foundation:multisig:dry-run

# Execute on Sepolia (requires .env PRIVATE_KEY)
npm run foundation:multisig
```

Receipt: `state/deployments/spk_v1_sepolia_multisig_handoff.json`  
Runtime patch: `governance_admin` → Safe address

## After handoff

- Operator mint/pay scripts must use Safe signers or delegated roles
- Parameter changes (fees, peg, reference USD/kWh) go through Safe
- Keep a **timelock** policy before mainnet (24h+ queue documented in ops)

## Not in scope yet

- Full DAO
- Decentralized oracle set
- Legal entity as issuer

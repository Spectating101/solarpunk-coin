# Foundation Roadmap

Product-only. Thesis untouched.

## Now (operating — engine v1 complete for horizon A–B)

- [x] Energy anchor + circulation on Sepolia
- [x] Wallet payments (MetaMask)
- [x] Sync / validate / health / API pipeline
- [x] `GET /v1/foundation` + labeled payment ledger
- [x] Live demo on GitHub Pages + autosync CI
- [x] Peg simulation export in foundation status (peg **off** on chain)
- [x] `npm run engine:status` one-screen operator view
- [x] Thesis evidence hook (`npm run thesis:docx`)

## Next (human decisions only)

### 1. Governance handoff
Move SPK v1 admin to Safe multisig when ready.

```bash
npm run foundation:multisig:dry-run   # print addresses + steps
npm run foundation:multisig           # Sepolia — irreversible for deployer admin
```

See `GOVERNANCE.md`.

### 2. Meter-attested mint in cycle
Real data path into issuance (not only surplus shortcut).

```bash
CYCLE_MINT_MODE=meter npm run foundation:cycle
```

### 3. Peg discipline (off-chain first)
Simulate PI peg before turning `peg_enabled` on testnet.

```bash
npm run foundation:peg-check
```

Output: `state/foundation/peg_simulation_summary.json`

### 4. Peg-on testnet experiment (later)
Branch only. Enable peg on Sepolia, log deviations vs `reference_usd_per_kwh`.

### 5. Auto-sync in production
Run `spk-v1-api` behind demo host or cron `foundation:sync` every N minutes.

## Rhythm

| When | Command |
|------|---------|
| After chain activity | `npm run foundation:sync` |
| Weekly operator | `npm run foundation:weekly` (CI Mondays) |
| Local wallet demo | `npm run spk:v1:api` + `cd frontend && npm run dev` |

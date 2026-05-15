# SolarPunk Public Lab

## Meaning

The public lab is the launchable form of SolarPunk before paid production.

It is not a token sale, not a mainnet product, and not a promise of yield. It is an open testnet environment where reviewers, researchers, builders, and potential pilot partners can inspect the SPK product path and reproduce the evidence.

The lab exists to answer one question:

> Can signed renewable-energy data be converted into a replay-protected on-chain SPK mint with enough transparency that outsiders can verify the claim?

## What Is Public Now

| Surface | Status | Where |
|---|---|---|
| Frontend demo | Live public interface | `https://spectating101.github.io/solarpunk-coin/` |
| SPK attested mint proof | Public Sepolia transaction | `docs/product/SPK_ATTESTED_MINT_PROOF.md` |
| Read-only on-chain readback | 7/7 checks passing | `docs/product/SPK_PUBLIC_READBACK.md` |
| Daily data experiment | NASA POWER -> Sepolia keeper | `docs/project/DAILY_EXPERIMENT_STATUS.md` |
| Meter CSV import | Pilot-style adapter path | `docs/project/METER_CSV_IMPORT.md` |
| Product launch gate | Explicit launch status | `docs/product/PRODUCT_LAUNCH_GATE.md` |
| Social validation kit | Ready-to-post public lab copy and guardrails | `docs/product/PUBLIC_LAB_SOCIAL_KIT.md` |
| Evidence register | Reviewer receipts | `EVIDENCE.md` |

## What A Lab Participant Can Do

1. Inspect the frontend demo and source-verified Sepolia contracts.
2. Re-run the local meter-bundle to SPK mint proof.
3. Import a sample meter/inverter CSV and derive an attestation bundle.
4. Review the daily NASA keeper logs and transaction hashes.
5. Open a GitHub issue using the public lab pilot template if they have a real meter export, inverter export, research collaboration, or integration question.

Direct inquiry link:

`https://github.com/Spectating101/solarpunk-coin/issues/new?template=public-lab-pilot.md`

## What The Lab Does Not Do

- It does not sell SPK.
- It does not accept customer funds.
- It does not promise redemption, yield, or profit.
- It does not claim certified hardware-meter finality.
- It does not claim formal audit completion.
- It does not claim mainnet readiness.

## Current Product Boundary

Launchable now:

- Public testnet proof surface.
- Open-source reproducibility.
- Demo dashboard.
- Signed-meter fixture.
- CSV pilot adapter.
- Daily keeper evidence.

Blocked until more work:

- Closed named pilot: needs governed attested-SPK redeploy plus one real meter or inverter adapter.
- Paid/mainnet product: needs audit, legal/commercial scope, redemption policy, production deployment, and real operator terms.

## Operating Loop

Run this loop while looking for partners, grants, and pilot users:

```bash
npm run product:launch-gate
npm run product:empirics
npm test
npm run attestations:test
```

Then keep the public lab honest:

- Update proof docs only from generated artifacts or verified transactions.
- Keep stale claims out of the frontend.
- Treat external replies, real meter exports, and pilot discussions as evidence artifacts.
- Do not change the paid/mainnet gate from blocked until the missing controls are actually present.

## Social Validation Loop

Use social channels to create public receipts, not hype.

1. Publish the public lab announcement from `docs/product/PUBLIC_LAB_SOCIAL_KIT.md`.
2. Ask for one of three concrete responses: inspect the proof, open an issue, or share a meter/inverter export format.
3. Record meaningful replies as follow-up issues, not as private memory.
4. Convert one real data conversation into the next closed-pilot artifact.

If using OpenClaw or another agent tool, use it only to draft, queue, and monitor posts. Do not let an agent autonomously make claims about yield, investment value, mainnet readiness, medical/energy safety, or legal status.

## Next Build Target

The lab's next real upgrade is not another abstract protocol layer.

It is:

1. Governed attested-SPK redeploy on Sepolia.
2. One real meter or inverter CSV/API adapter.
3. Public lab receipt showing that real export flowing through the same attestation pipeline.

That converts the lab from "public proof" to "closed pilot candidate."

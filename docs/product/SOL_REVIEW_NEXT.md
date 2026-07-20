# For Sol — validation packet (2026-07-20)

Thesis PDF deliberately deferred. Live flagship on `main` (`d247c3c` / Pages `ebffa00`) stands.

## Branch A — Gate 1 operator evidence (ready)

**Branch:** `feat/operator-evidence-pilot` @ `cdc8bb5`  
**PR:** could not open from this environment (GitHub token lacks `createPullRequest` on `Spectating101/solarpunk-coin`). Please open from your account:

```text
base: main
head: feat/operator-evidence-pilot
title: Add OPS-001 operator-format evidence pilot (Gate 1)
```

### What to validate

1. `npm run case:gate1:test` — 11 pass  
2. `npm run case:gate1` — report under `state/product/operator_evidence_gate1/`  
3. `cd frontend && npm run test:run` — 67 pass  
4. Browser Cases → **OPS-001** @ L0:
   - Pilot policy → BLOCKED (`SIGNED_EVIDENCE`, `MIN_PROVENANCE`)
   - Open policy → ADMIT_WITH_LIMIT **103.8**
5. Capsule export: 12 files, no raw intervals  

Doc: `docs/product/OPERATOR_EVIDENCE_PILOT.md`

### Honest boundary

Uses `data/operator/sample_operator_export.csv` (operator-**format** public sample), not a named closed-pilot archive. Pipeline honesty is the point of Gate 1.

Suggested PR body is in the prior Cursor handoff / commit message.

---

## Branch B — Gate 4 capsule verifier (pushed separately)

**Branch:** `feat/capsule-verifier`  
**Doc:** `docs/product/CAPSULE_VERIFIER.md`

```bash
npm run case:verify-capsule:test
npm run case:verify-capsule -- <bundle.json>
npm run case:verify-capsule -- <bundle.json> --replay-from-pack
```

Reports: integrity / schema / reproduction / **NOT CLAIMED** source truth.

Open as a **second PR** after or beside Gate 1 (do not squash into one mega-PR).

---

## Suggested order for Sol

1. Review + merge Gate 1 (`feat/operator-evidence-pilot`) if acceptable  
2. Review Gate 4 verifier (`feat/capsule-verifier`)  
3. Next product slice: named real operator CSV **or** Gate 2 local projects — your call  
4. Thesis PDF link whenever ready (not blocking this track)

## Do not do next (unless forced)

AI chat, accounts/cloud, GIS, mainnet, DuckDB-Wasm before local datasets, unrestricted policy scripting.

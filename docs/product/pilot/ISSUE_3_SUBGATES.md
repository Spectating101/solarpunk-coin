# Issue #3 sub-gates (field validation)

North-star issue: https://github.com/Spectating101/solarpunk-coin/issues/3  
Title: Field validation — admit one real L2 operator / inverter evidence source  

Keep Issue #3 open. Track milestones separately so a useful real L0 source is not scored as failure for missing live-gateway custody.

## Gate 1B — Real-source software validation

Obtain one genuinely external, custody-documented export and run:

```text
source receipt → normalization → evidence envelope → L0 evaluation
→ decision receipt → capsule → independent verification
```

A deterministic **BLOCKED** result is acceptable.

**Done when:** raw file never enters the public repo; source receipt reproduces; acquisition/permission metadata complete; normalization does not silently rewrite rows; manual mapping recorded; decision deterministic; capsule verifier passes; operator agrees limitations are accurate; operator understands block/admit; turnaround ≈ one working session.

## Gate 1C — Operator-signed validation (toward L1)

Obtain one of:

- an export signed by the operator;
- an operator assertion bound to the exact source hash;
- a device registry or signature artifact with independently checkable custody.

**Done when:** a defensible L1 path exists without pretending live-gateway L2.

## Gate 1D — Live gateway validation (real L2)

- live inverter or gateway snapshots  
- device-key verification  
- repeated-window ingestion  
- duplicate-window controls  
- archive retention  
- documented gateway custody  

**Done when:** Issue #3’s L2 bar is actually met.

## Tracking suggestion (GitHub)

Post these three milestones as checklist comments or child issues linked to #3. Keep #3 as the L2 north star.

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

## Gate 1C — Authenticated operator evidence (toward L1)

Obtain one of:

- an export signed by the operator or source device;
- an authenticated operator declaration bound to the exact source hash and measurement window;
- a device registry or signature artifact with independently checkable custody.

A self-authored manifest field, unverified filename, or locally generated project key is not sufficient.

**Done when:** the operator/source identity and signing or assertion path are independently checkable, and a defensible L1 classification can be reproduced without pretending live-gateway L2.

## Gate 1D — Live gateway validation (real L2)

- live inverter or gateway snapshots  
- device-key verification  
- repeated-window ingestion  
- duplicate-window controls  
- archive retention  
- documented gateway custody  

**Done when:** Issue #3’s L2 bar is actually met.

## Tracking suggestion (GitHub)

Create three child issues linked to #3. Keep #3 as the L2 north star and close each child only against its explicit completion criteria.

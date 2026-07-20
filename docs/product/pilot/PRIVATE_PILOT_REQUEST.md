# Private pilot request (short)

**Offer (no SPK / crypto / minting emphasis):**

> Send one private inverter, meter, gateway, or utility export. Raw data remains private. We will return a reproducible validation receipt, evidence-quality assessment, policy result, and privacy-safe report. A blocked result is acceptable and no issuance or blockchain transaction is required.

The source owner or operator may remain pseudonymous in anything public, but the acquisition and custody path must be confirmed privately. No ownership transfer is requested; permission is limited to the selected processing and publication scope.

## What we need from you

1. Permission to process the file privately  
2. Confirmation of how the file was obtained and who controls the source  
3. Explanation of fields and sign conventions (generation / load / export)  
4. Permission to publish: nothing · metadata only · or anonymized aggregates  
5. Feedback on whether the resulting report is understandable and useful  

## What you receive

- Source custody receipt (hash-bound; raw file stays private)  
- Normalization diagnostics (rejected/malformed rows remain visible)  
- L0 evaluation under the declared policies (blocked or admitted — both are reportable)  
- Optional settlement-stress view  
- Privacy-safe report / capsule metadata  

## What we will not do

- Put your raw file in a public repository  
- Mint tokens or require a wallet  
- Claim your data is revenue-grade or legally verified  
- Promote provenance beyond independently supported custody and verification  
- Publish your identity, metadata, aggregates, or raw rows beyond the permission scope you selected  

## Contact priority (acquisition order)

1. YZU facilities / campus-energy personnel  
2. Professor or engineering lab with inverter access  
3. Local solar installer / system integrator  
4. Individual rooftop owner  
5. Commercial building / small solar operator  

First pilot: **free**. Success signal: second export, another operator introduction, or a request for repeated processing — not merely “interesting.”

## Ready command (after you receive a file)

```bash
npm --prefix packages/constraint-core run operator-intake -- \
  --source=/private/operator-export.csv \
  --manifest=/private/operator-source-manifest.json \
  --out=state/private/operator-source-receipt.json
```

Template: `data/operator/operator_source_manifest.template.json`

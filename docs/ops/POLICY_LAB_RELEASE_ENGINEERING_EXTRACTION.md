# Engineering-only extraction from PR #70

Baseline: origin/main 6a9e240. The SDK pack-directory defect is already repaired by scripts/check_sdk_package.mjs, which checks the package identity and excludes unrelated files. Do not replace that stronger guard with the old npm pack command. Frontend dependency floors are already repaired; no manifest or lockfile downgrade is included.

This candidate adds the missing production-only frontend audit gate and adapts PR #70's deterministic source inventory to the actual current App/routes/workbench surface. Browser/Explorer components and trusted attestation workflow are excluded. The source inventory covers frontend source/public files, core/policies/schema, helper libraries and certifiers, rejects missing required files and symlinks, and validates a supplied full SHA label. It does not authenticate that label or prove that a working tree is clean.

Run node scripts/build_policy_lab_release_provenance.mjs --source-revision=<full-SHA> --out=/tmp/policy-lab-provenance.json twice and compare bytes. A local source inventory is lineage material; GitHub artifact attestation, SBOM, signed tag, physical source truth and external validation remain open. The registry audit result is scoped to shipped frontend production dependencies, not root toolchain closure. No UI, deployment, release or evidence promotion is authorized here.

The main Ausgrid workflow already triggers on relevant main changes, pins the exact archive/member and runs the newer archive-binding negative test. The old stack would regress npm ci and those bindings. Current smoke uses accessible combobox names; old selector and strict Browser paths are not copied into this candidate. Scheduled production smoke remains unchanged and is not executed by this consolidation.

# Solarpunk Conformance Benchmark

This directory contains the versioned behavioral benchmark for the Policy Lab / Constraint reference implementation.

The benchmark evaluates whether declared artifacts and software behavior preserve the programme's boundaries across source integrity, semantic mapping, provenance, policy admission, quantity authorization, and reproducible receipts.

It does **not** certify physical source truth, legal validity, regulatory compliance, production security, commercial readiness, or neutral-standard status.

## Current baseline

Version `0.1.0` packages existing deterministic coverage into three behavioral levels:

| Level | Meaning | Current benchmark families |
|---|---|---|
| `C0` | Parse and integrity | B1 source/artifact integrity; B2 semantic and temporal controls |
| `C1` | Deterministic decision | C0 plus B3 provenance, B4 policy admission, B5 quantity authorization |
| `C2` | Reproducible receipt | C1 plus B8 capsule closure and cross-object agreement |

Conformance levels intentionally use `C0`–`C4`; source assurance continues to use `L0`–`L4`. They must never be treated as interchangeable.

## Files

- `benchmark-manifest.v1.json` — frozen case inventory, exact existing test names, expected status, level, and family.
- `reports/` — generated local execution reports; reports are ignored by default until deliberately archived.
- `../scripts/run_conformance_benchmark_v1.mjs` — independent Node test runner and report writer.
- `../packages/constraint-core/test/conformance-benchmark-v1.test.mjs` — manifest and runner contract tests.

## Commands

From the repository root:

```bash
npm --prefix packages/constraint-core run conformance:v1:list
npm --prefix packages/constraint-core run conformance:v1:test
npm --prefix packages/constraint-core run conformance:v1
```

The default full run writes:

```text
benchmark/reports/conformance-v1-latest.json
```

Use a custom path when archiving a release report:

```bash
node scripts/run_conformance_benchmark_v1.mjs \
  --out=benchmark/reports/conformance-v1-0.1.0-node20-linux.json
```

## Reporting boundary

The runner executes the unique test files referenced by the frozen manifest. A suite-level `PASS` means those files passed in the recorded runtime environment.

It does not prove that:

- the founding implementation is a neutral standard;
- every future implementation behaves identically;
- an external source is truthful or certified;
- institutional or legal requirements are satisfied;
- the system is production-ready;
- a market or customer exists.

Independent participation requires publishing the benchmark version, implementation identity, environment, complete report, skipped or modified cases, and limitations.

## Next benchmark work

1. Run and archive the first C0–C2 report in a clean environment.
2. Map partial and absent B1–B9 requirements rather than claiming complete coverage.
3. Add external-case-derived fixtures only when publication permission allows.
4. Extend toward C3 lifecycle and settlement behavior only after the corpus is frozen.
5. Add C4 hardening, release provenance, and privacy checks after independent review.

# Policy Lab MCP (v0)

A deliberately thin, read-only MCP interface over `packages/constraint-core/src/workbench.js`.

The goal is not to create another Policy Lab backend. The goal is to test whether a fresh agent can discover and operate the existing deterministic backend without UI-specific coaching or repository archaeology.

## Boundaries

This server has no blockchain write tools, operator actions, shell execution, filesystem mutation, network fetches, or AI logic. It does not import the privileged SPK/operator surfaces.

The v0 decision tools accept only registered Policy Lab policy IDs. They also do **not** accept caller-authored provenance levels or arbitrary provenance context. Decision assurance is either:

- `EVIDENCE_ONLY` — evidence is classified with no trusted-operator assertions supplied by the caller, or
- `REGISTERED_COUNTERFACTUAL` — the caller selects a committed controlled assurance scenario by ID from `policylab://assurance-scenarios`.

`classify_assurance` remains available as an explanatory tool for declared context, but its result is explicitly informational and cannot be passed back as decision authority to `assess_case` or `compare_policies`.

This closes the simple “make this pass” routes where an agent might otherwise invent a weaker policy or assert `{ level: "L4" }` / equivalent assurance facts.

Policy Lab outputs remain research decisions under declared evidence, modeled context, derived assurance, and registered policy inputs. They are not legal issuance authority, proof of physical source truth, settlement guarantees, or regulatory approval.

The v0 decision ontology is intentionally limited to `case_type: "energy_site"`. Unsupported domains fail explicitly rather than being coerced into the energy calculators.

## MCP surface

Tools:

- `assess_case`
- `compare_policies`
- `verify_evidence`
- `classify_assurance`
- `build_receipt`
- `verify_capsule`

Canonical resources include:

- `policylab://about`
- `policylab://policies`
- `policylab://calculators`
- `policylab://provenance-levels`
- `policylab://assurance-scenarios`
- `policylab://schemas/case`
- `policylab://schemas/evidence`
- `policylab://schemas/context`
- `policylab://schemas/decision`
- `policylab://schemas/receipt`
- `policylab://schemas/assurance-scenario`
- `policylab://errors`
- `policylab://examples`
- `policylab://boundaries`

The server uses the official MCP TypeScript SDK v2 package (`@modelcontextprotocol/server` 2.0.0) and defaults to stdio for local-agent testing.

## Run

```bash
cd packages/policy-lab-mcp
npm install
npm test
npm start
```

`npm start` is an MCP stdio process. stdout is reserved for MCP protocol messages; the startup banner is emitted on stderr.

## Client command

From the repository root, configure an MCP client to spawn:

```text
node packages/policy-lab-mcp/src/stdio.mjs
```

A cold MCP client should be able to discover the tool schemas, canonical JSON Schemas, registered policies, assurance counterfactuals, error codes, usage recipes, and authority boundaries without reading the rest of the repository.

## Structured failures

Wrapper-level failures are returned with stable machine-readable codes such as:

- `INVALID_INPUT`
- `INVALID_CASE`
- `UNSUPPORTED_DOMAIN`
- `MISSING_EVIDENCE`
- `EVIDENCE_INTEGRITY_ERROR`
- `MISSING_CONTEXT`
- `UNKNOWN_POLICY`
- `UNKNOWN_ASSURANCE_SCENARIO`
- `AMBIGUOUS_ASSURANCE`

The full current catalog is available at `policylab://errors`.

## v0 gauntlet coverage

The package tests now cover:

1. known blocked and admitted case behavior,
2. deterministic decision IDs for identical inputs,
3. policy-divergence behavior,
4. evidence tamper rejection with a stable integrity error,
5. rejection of unregistered policy substitution,
6. inability of caller-authored provenance/provenance context to alter decision assurance,
7. rejection of unregistered assurance-scenario substitution,
8. explicit missing-context and missing-evidence failures,
9. explicit unsupported-domain refusal,
10. offline assessment with network access disabled,
11. MCP tool/resource discovery over an in-memory transport,
12. discovery and reading of bundled schemas/error catalogs/assurance scenarios,
13. structured MCP error propagation,
14. a real stdio MCP discovery handshake.

This is still not the full **model-layer** fresh-agent gauntlet. The next stage is to freeze this machine contract long enough to run cold agents against it with no README or repository access, measuring tool selection, completion, fabrication, manipulation resistance, recovery from missing inputs, cross-model consistency, and boundary compliance.

# Policy Lab MCP (v0)

A deliberately thin, read-only MCP interface over `packages/constraint-core/src/workbench.js`.

The goal is not to create another Policy Lab backend. The goal is to test whether a fresh agent can discover and operate the existing deterministic backend without UI-specific coaching or repository archaeology.

## Boundaries

This server has no blockchain write tools, operator actions, shell execution, filesystem mutation, network fetches, or AI logic. It does not import the privileged SPK/operator surfaces.

Policy Lab outputs remain research decisions under declared evidence, context, provenance, and policy inputs. They are not legal issuance authority, proof of physical source truth, settlement guarantees, or regulatory approval.

## MCP surface

Tools:

- `assess_case`
- `compare_policies`
- `verify_evidence`
- `classify_assurance`
- `build_receipt`
- `verify_capsule`

Resources:

- `policylab://about`
- `policylab://policies`
- `policylab://calculators`
- `policylab://provenance-levels`
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

The client should be able to discover the tools and resources without reading the rest of the repository.

## v0 gauntlet coverage

The package tests currently cover:

1. known blocked and admitted case behavior,
2. deterministic decision IDs for identical inputs,
3. policy-divergence behavior,
4. evidence tamper rejection,
5. MCP tool/resource discovery over an in-memory transport,
6. a real stdio MCP discovery handshake.

This is intentionally not the full fresh-agent gauntlet yet. Missing later-stage tests include manipulation resistance at the model layer, unsupported-domain behavior, cross-client cold-agent trials, privacy/logging inspection, and operator-boundary adversarial tests.

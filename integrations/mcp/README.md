# Policy Lab native-verifier MCP adapter

Salvaged from PR #73 (b4cfb025c77d25ef470859fbffe4945387cea812) onto the current Policy Lab baseline. The bridge delegates to verifyResearchCapsuleBundle; it does not duplicate decision, hashing or evidence rules.

Direct adapter negative parity and input rejection run with `python3 integrations/mcp/test_bridge.py`. This is separate from real MCP discovery and transport parity.

The runner is pinned in manifest.json and the read-only CI checkout. Discovery and invalid-capsule parity are exercised by .github/workflows/portfolio-mcp.yml. The runner remains a separate repository dependency; no change to it is included here.

Run the native suite with node --test packages/constraint-core/test/capsule-verify.test.mjs. With the pinned runner installed, use portfolio-mcp probe --manifest integrations/mcp/manifest.json --root . and the workflow's native-versus-MCP negative control.

An invalid capsule must return the native ok=false result even when transport succeeds. Capsule integrity is reproduction/lineage, not physical truth, legal authority, owner validation, reserves, adoption or monetary performance. No deployment, provider call, token operation or evidence promotion is part of this adapter.

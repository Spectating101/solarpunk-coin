# Constraint Protocol Alpha Conformance Vectors

`alpha-v1.json` pins deterministic outputs for the Public Alpha protocol kernel.

The vectors are designed for independent implementations of the same alpha semantics. They cover:

- cumulative counter evidence identity;
- canonical policy manifest hashes;
- policy decisions for the same L0 evidence;
- policy-bound claim identity and decimal-safe quantity;
- settlement coverage/shortfall;
- Green Button normalization;
- Fronius pair normalization;
- signed evidence accepted-subset semantics and the browser provenance boundary.

CI regenerates every vector through `@solarpunk/constraint-core` and fails on drift.

## Compatibility rule

A bug fix may intentionally change a vector. Such a change must be reviewed as a protocol-semantic change and update:

1. implementation;
2. conformance vector;
3. relevant schema/spec documentation;
4. adapter or protocol version when portable canonical output changes.

Do not update a failing hash merely to make CI green.

## Independent implementation target

A second implementation should be able to load the fixture paths named in `alpha-v1.json` and reproduce the expected outputs without importing `@solarpunk/constraint-core`.

Public Alpha does not yet claim cross-language conformance. The vector file is the starting surface for a Python or Rust implementation.

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildEvidenceEnvelope,
  classifyProvenance,
  createClaimManifest,
  evaluatePolicy,
  evaluateSettlement,
  makeIssuedClaim,
  normalizeCumulativePair,
  policyById,
  policyManifestBody,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));

function assertTopLevelSchemaShape(schema, value, expectedRuntimeSchema) {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.properties?.schema?.const, expectedRuntimeSchema);
  assert.equal(value.schema, expectedRuntimeSchema);
  for (const field of schema.required || []) {
    assert.ok(Object.prototype.hasOwnProperty.call(value, field), `${expectedRuntimeSchema} missing required ${field}`);
  }
  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(schema.properties || {}));
    for (const field of Object.keys(value)) {
      assert.ok(allowed.has(field), `${expectedRuntimeSchema} has undeclared top-level property ${field}`);
    }
  }
}

test('published schemas match live alpha object identifiers and required top-level shapes', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const evidence = await buildEvidenceEnvelope(normalizeCumulativePair(start, end));
  const provenance = classifyProvenance(evidence, { sample_fixture: true });
  const policy = policyManifestBody(policyById('LAB-OPEN-001'));
  const decision = evaluatePolicy({ evidence, provenance, policy });
  const claim = await createClaimManifest({ evidence, provenance, policyDecision: decision });
  const active = makeIssuedClaim(claim, 20);
  const settlement = evaluateSettlement({ claim: active, settlement_capacity: 8 });

  const objects = [
    ['protocol/schema/evidence-envelope.v1.schema.json', evidence, 'solarpunk.constraint.evidence_envelope.v1'],
    ['protocol/schema/provenance-decision.v1.schema.json', provenance, 'solarpunk.constraint.provenance_decision.v1'],
    ['protocol/schema/policy-manifest.v1.schema.json', policy, 'solarpunk.constraint.policy_manifest.v1'],
    ['protocol/schema/claim-manifest.v1.schema.json', claim, 'solarpunk.constraint.claim_manifest.v1'],
    ['protocol/schema/settlement-result.v1.schema.json', settlement, 'solarpunk.constraint.settlement_result.v1'],
  ];

  for (const [schemaPath, value, runtimeSchema] of objects) {
    assertTopLevelSchemaShape(await repoJson(schemaPath), value, runtimeSchema);
  }
});

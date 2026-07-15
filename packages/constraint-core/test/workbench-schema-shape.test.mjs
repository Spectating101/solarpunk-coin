import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildConstraintEvaluation,
  buildContextManifest,
  buildDecisionReceipt,
  buildDecisionResult,
  caseManifestBody,
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

test('published workbench schemas match portable runtime object shapes', async () => {
  const context = await buildContextManifest({
    context_id: 'resource:tyn',
    context_type: 'resource_model',
    label: 'Taoyuan modeled context',
    source: { provider: 'PVWatts' },
    spatial_identity: { latitude: 24.99, longitude: 121.3 },
    temporal_semantics: { kind: 'TMY' },
    values: { annual_ac_kwh: 11743.0994 },
    boundary: 'Modeled context only.',
  });
  const caseManifest = caseManifestBody({
    case_id: 'TYN-001',
    subject: 'Taoyuan controlled case',
    case_type: 'energy_site',
    spatial_identity: { site_id: 'taoyuan_10kw', latitude: 24.99, longitude: 121.3 },
    measurement_window: null,
    evidence_refs: [],
    context_refs: [context.context_id],
    default_policy_ref: null,
    boundaries: ['Controlled case.'],
  });
  const evaluation = await buildConstraintEvaluation({
    calculator_id: 'ABSOLUTE_POLICY_CAP',
    calculator_version: '1.0.0',
    constraint_class: 'QUANTITY_CEILING',
    policy_rule_id: 'test.absolute-cap.v1',
    status: 'PASS',
    unit: 'ENERGY_CLAIM_UNIT',
    quantity_decimals: 6,
    capacity: 100,
    input_refs: [context.context_hash],
    observed_inputs: {},
    parameters: { maximum: 100 },
    assumptions: [],
    warnings: [],
    explanation: 'Policy cap permits 100 units.',
    boundary: 'Declared policy cap.',
  });
  const decision = await buildDecisionResult({
    case_id: caseManifest.case_id,
    case_hash: null,
    policy_id: 'TEST-POLICY-001',
    policy_version: '1.0.0',
    policy_manifest_hash: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    evidence_hashes: [],
    context_refs: [{ context_id: context.context_id, context_hash: context.context_hash }],
    admission: { result: 'PASS', evaluations: [], blocking_rules: [] },
    capacity: {
      evaluated: true,
      unit: 'ENERGY_CLAIM_UNIT',
      quantity_decimals: 6,
      evaluations: [evaluation],
      admitted_maximum: 100,
      binding_constraints: ['ABSOLUTE_POLICY_CAP'],
    },
    decision: 'ADMIT_WITH_LIMIT',
    warnings: [],
    boundary: 'Test decision.',
  });
  const receipt = buildDecisionReceipt({
    decision,
    evaluated_at: '2026-07-14T15:42:18Z',
    runtime: { package: '@solarpunk/constraint-core', package_version: '0.1.0-alpha.1', source_revision: 'test' },
    data_boundary: 'No raw evidence included.',
  });

  const objects = [
    ['protocol/schema/case-manifest.v1.schema.json', caseManifest, 'solarpunk.constraint.case_manifest.v1'],
    ['protocol/schema/context-manifest.v1.schema.json', context, 'solarpunk.constraint.context_manifest.v1'],
    ['protocol/schema/constraint-evaluation.v1.schema.json', evaluation, 'solarpunk.constraint.constraint_evaluation.v1'],
    ['protocol/schema/decision-result.v1.schema.json', decision, 'solarpunk.constraint.decision_result.v1'],
    ['protocol/schema/decision-receipt.v1.schema.json', receipt, 'solarpunk.constraint.decision_receipt.v1'],
  ];

  for (const [schemaPath, value, runtimeSchema] of objects) {
    assertTopLevelSchemaShape(await repoJson(schemaPath), value, runtimeSchema);
  }
});

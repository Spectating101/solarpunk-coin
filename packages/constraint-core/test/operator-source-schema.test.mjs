import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildOperatorSourceReceipt,
  canonicalOperatorSourceManifest,
} from '../src/workbench.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));

function assertTopLevelSchemaShape(schema, value, runtimeSchema) {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.properties?.schema?.const, runtimeSchema);
  assert.equal(schema.additionalProperties, false);
  assert.equal(value.schema, runtimeSchema);
  for (const field of schema.required || []) {
    assert.ok(Object.hasOwn(value, field), `${runtimeSchema} missing required ${field}`);
  }
  const allowed = new Set(Object.keys(schema.properties || {}));
  for (const field of Object.keys(value)) {
    assert.ok(allowed.has(field), `${runtimeSchema} has undeclared top-level property ${field}`);
  }
}

function manifest() {
  return {
    schema: 'solarpunk.operator_source_manifest.v1',
    source_id: 'private-source-001',
    source_kind: 'inverter_export',
    synthetic_fixture: false,
    custodian: {
      relationship: 'owner',
      identifier: 'private-owner-reference',
      contact_disclosure: 'private',
    },
    acquisition: {
      method: 'owner_export',
      acquired_at: '2026-07-20T00:00:00Z',
      custody_statement: 'The system owner exported and transferred this file directly for private validation.',
      permission_scope: 'private_validation',
    },
    measurement: {
      window_start: '2026-07-01T00:00:00+08:00',
      window_end: '2026-07-08T00:00:00+08:00',
      timezone: 'Asia/Taipei',
      sign_convention: {
        generation: 'positive generated energy',
        site_load: 'positive site consumption',
        export: 'positive grid export',
        curtailed: null,
      },
    },
    device: {
      manufacturer: null,
      model: null,
      serial_hash: null,
      capacity_kw: null,
      accuracy_basis: null,
    },
    assertions: {
      source_owner_confirmed: true,
      live_api: false,
      revenue_grade: false,
      utility_corroborated: false,
      device_signature_present: false,
    },
    artifacts: {
      source_signature_file: null,
      device_registry_file: null,
      utility_corroboration_file: null,
      api_snapshot_receipt_file: null,
    },
    boundaries: ['Owner identity and raw data remain private.'],
  };
}

test('published operator source schemas match canonical manifest and receipt shapes', async () => {
  const canonicalManifest = canonicalOperatorSourceManifest(manifest());
  const receipt = await buildOperatorSourceReceipt({
    sourceText: 'window_start,window_end,generation_kwh\n',
    filename: 'private-export.csv',
    manifest: canonicalManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  assertTopLevelSchemaShape(
    await repoJson('protocol/schema/operator-source-manifest.v1.schema.json'),
    canonicalManifest,
    'solarpunk.operator_source_manifest.v1',
  );
  assertTopLevelSchemaShape(
    await repoJson('protocol/schema/operator-source-receipt.v1.schema.json'),
    receipt,
    'solarpunk.operator_source_receipt.v1',
  );

  assert.equal(receipt.source_file.raw_included, false);
  assert.equal(receipt.v2_admission.default_assurance_scenario, 'PROVENANCE-L0-BASE');
  assert.equal(receipt.v2_admission.automatic_promotion_allowed, false);
  assert.equal(receipt.verification.source_truth_certification, 'NOT_CLAIMED');
  assert.match(receipt.source_file.sha256, /^[a-f0-9]{64}$/);
  assert.match(receipt.receipt_id, /^[a-f0-9]{64}$/);
});

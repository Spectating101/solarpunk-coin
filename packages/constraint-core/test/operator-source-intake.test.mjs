import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildOperatorSourceReceipt,
  canonicalOperatorSourceManifest,
  formatOperatorSourceReceipt,
  verifyOperatorSourceReceipt,
} from '../src/workbench.js';

function manifest(overrides = {}) {
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
      manufacturer: 'Example',
      model: 'Private inverter',
      serial_hash: 'sha256:private',
      capacity_kw: 10,
      accuracy_basis: 'manufacturer specification only',
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
    ...overrides,
  };
}

const source = [
  'window_start,window_end,generation_kwh,site_load_kwh,export_kwh',
  '2026-07-01T00:00:00+08:00,2026-07-02T00:00:00+08:00,20,12,8',
].join('\n');

test('operator source receipt binds file identity and custody metadata without raw rows', async () => {
  const sourceManifest = manifest();
  const receipt = await buildOperatorSourceReceipt({
    sourceText: source,
    filename: '/private/site/export.csv',
    manifest: sourceManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  assert.equal(receipt.schema, 'solarpunk.operator_source_receipt.v1');
  assert.equal(receipt.source_file.filename, 'export.csv');
  assert.equal(receipt.source_file.raw_included, false);
  assert.equal(receipt.custody.permission_scope, 'private_validation');
  assert.equal(receipt.publication.public_receipt_allowed, false);
  assert.equal(receipt.v2_admission.default_assurance_scenario, 'PROVENANCE-L0-BASE');
  assert.equal(receipt.v2_admission.automatic_promotion_allowed, false);
  assert.equal(receipt.verification.source_truth_certification, 'NOT_CLAIMED');
  assert.doesNotMatch(JSON.stringify(receipt), /generation_kwh/);

  const verified = await verifyOperatorSourceReceipt({ receipt, sourceText: source, manifest: sourceManifest });
  assert.equal(verified.ok, true);
  assert.match(formatOperatorSourceReceipt(receipt), /Source-truth certification: NOT CLAIMED/);
});

test('self-authored high-assurance assertions never promote the default V2 scenario', async () => {
  const sourceManifest = manifest({
    assertions: {
      source_owner_confirmed: true,
      live_api: true,
      revenue_grade: true,
      utility_corroborated: true,
      device_signature_present: true,
    },
    artifacts: {
      source_signature_file: 'signature.json',
      device_registry_file: 'registry.json',
      utility_corroboration_file: 'utility.pdf',
      api_snapshot_receipt_file: 'snapshot.json',
    },
  });

  const receipt = await buildOperatorSourceReceipt({
    sourceText: source,
    filename: 'export.csv',
    manifest: sourceManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  assert.equal(receipt.v2_admission.default_assurance_scenario, 'PROVENANCE-L0-BASE');
  assert.equal(receipt.v2_admission.automatic_promotion_allowed, false);
  assert.equal(receipt.verification.source_signature_verified, false);
  assert.equal(receipt.verification.utility_corroboration_verified, false);
  assert.match(receipt.v2_admission.promotion_requirements.join(' '), /verify the source signature/i);
});

test('source tampering fails receipt verification', async () => {
  const sourceManifest = manifest();
  const receipt = await buildOperatorSourceReceipt({
    sourceText: source,
    filename: 'export.csv',
    manifest: sourceManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  const verified = await verifyOperatorSourceReceipt({
    receipt,
    sourceText: `${source}\n2026-07-02T00:00:00+08:00,2026-07-03T00:00:00+08:00,21,10,11`,
    manifest: sourceManifest,
  });
  assert.equal(verified.ok, false);
  assert.ok(verified.checks.some((item) => item.code === 'source_hash' && !item.ok));
});

test('manifest tampering fails receipt verification', async () => {
  const sourceManifest = manifest();
  const receipt = await buildOperatorSourceReceipt({
    sourceText: source,
    filename: 'export.csv',
    manifest: sourceManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  const changedManifest = manifest({
    acquisition: {
      ...sourceManifest.acquisition,
      permission_scope: 'public_raw',
    },
  });
  const verified = await verifyOperatorSourceReceipt({ receipt, sourceText: source, manifest: changedManifest });
  assert.equal(verified.ok, false);
  assert.ok(verified.checks.some((item) => item.code === 'manifest_hash' && !item.ok));
});

test('non-synthetic sources require declared custody and valid measurement windows', () => {
  assert.throws(() => canonicalOperatorSourceManifest(manifest({
    custodian: {
      relationship: 'unknown',
      identifier: 'unknown',
      contact_disclosure: 'not_provided',
    },
  })), /declared custodian relationship/i);

  assert.throws(() => canonicalOperatorSourceManifest(manifest({
    measurement: {
      ...manifest().measurement,
      window_start: '2026-07-08T00:00:00+08:00',
      window_end: '2026-07-01T00:00:00+08:00',
    },
  })), /must be before/i);
});

test('permission scopes produce explicit publication controls', async () => {
  const publicMetadataManifest = manifest({
    acquisition: {
      ...manifest().acquisition,
      permission_scope: 'public_metadata_only',
    },
  });
  const receipt = await buildOperatorSourceReceipt({
    sourceText: source,
    filename: 'export.csv',
    manifest: publicMetadataManifest,
    generatedAt: '2026-07-20T01:00:00Z',
  });

  assert.equal(receipt.publication.public_receipt_allowed, true);
  assert.equal(receipt.publication.public_aggregates_allowed, false);
  assert.equal(receipt.publication.public_raw_allowed, false);
});

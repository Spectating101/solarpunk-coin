import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildContextManifest,
  caseManifestBody,
  contextManifestBody,
  hashCaseManifest,
  hashContextManifest,
} from '../src/index.js';

const CASE_FIXTURE = {
  case_id: 'TYN-001',
  subject: 'Taoyuan controlled energy case',
  case_type: 'energy_site',
  spatial_identity: { site_id: 'taoyuan_10kw', latitude: 24.99, longitude: 121.3 },
  measurement_window: { start: '2026-05-01T00:00:00+00:00', end: '2026-05-07T23:59:59Z' },
  evidence_refs: ['evidence-b', 'evidence-a', 'evidence-a'],
  context_refs: ['resource:tyn'],
  default_policy_ref: { id: 'ENERGY-CASE-PILOT-005', version: '1.0.0' },
  boundaries: ['Controlled case for deterministic research evaluation.'],
};

const CONTEXT_FIXTURE = {
  context_id: 'resource:tyn-pvwatts-v1',
  context_type: 'resource_model',
  label: 'Taoyuan PVWatts resource baseline',
  source: { provider: 'PVWatts', dataset: 'NSRDB Himawari' },
  spatial_identity: { latitude: 24.99, longitude: 121.3 },
  temporal_semantics: { kind: 'TMY', observed_case_window: false },
  values: { annual_ac_kwh: 11743.0994 },
  boundary: 'Modeled resource context; not observed meter evidence.',
};

test('case manifests canonicalize refs and produce deterministic identity', async () => {
  const body = caseManifestBody(CASE_FIXTURE);
  assert.equal(body.schema, 'solarpunk.constraint.case_manifest.v1');
  assert.deepEqual(body.evidence_refs, ['evidence-a', 'evidence-b']);
  assert.equal(body.measurement_window.start, '2026-05-01T00:00:00Z');
  assert.equal(body.spatial_identity.spatial_reference, 'WGS84');

  const first = await hashCaseManifest(CASE_FIXTURE);
  const second = await hashCaseManifest({ ...CASE_FIXTURE, evidence_refs: ['evidence-a', 'evidence-b'] });
  assert.equal(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
});

test('case manifest rejects reversed measurement windows', () => {
  assert.throws(() => caseManifestBody({
    ...CASE_FIXTURE,
    measurement_window: { start: '2026-05-08T00:00:00Z', end: '2026-05-07T00:00:00Z' },
  }), /must not precede/);
});

test('context manifest binds modeled context to a deterministic hash', async () => {
  const first = await buildContextManifest(CONTEXT_FIXTURE);
  const second = await buildContextManifest({
    ...CONTEXT_FIXTURE,
    source: { dataset: 'NSRDB Himawari', provider: 'PVWatts' },
  });
  assert.equal(first.context_hash, second.context_hash);
  assert.equal(await hashContextManifest(first), first.context_hash);
  assert.deepEqual(contextManifestBody(first), first);
});

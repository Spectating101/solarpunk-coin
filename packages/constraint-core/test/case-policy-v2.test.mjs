import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BUILTIN_CASE_POLICIES,
  casePolicyById,
  casePolicyManifestBody,
  hashCasePolicyManifest,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));

const POLICY_FILES = [
  ['protocol/policies-v2/LAB-CASE-OPEN-004.json', 'LAB-CASE-OPEN-004'],
  ['protocol/policies-v2/ENERGY-CASE-PILOT-005.json', 'ENERGY-CASE-PILOT-005'],
  ['protocol/policies-v2/ENERGY-CASE-STRICT-006.json', 'ENERGY-CASE-STRICT-006'],
];

test('V2 policy files match canonical built-in manifests and published schema identity', async () => {
  const schema = await repoJson('protocol/schema/policy-manifest.v2.schema.json');
  assert.equal(schema.properties.schema.const, 'solarpunk.constraint.policy_manifest.v2');

  for (const [path, id] of POLICY_FILES) {
    const filePolicy = casePolicyManifestBody(await repoJson(path));
    const builtIn = casePolicyById(id);
    assert.deepEqual(filePolicy, builtIn);
    assert.match(await hashCasePolicyManifest(filePolicy), /^[a-f0-9]{64}$/);
    for (const required of schema.required) {
      assert.ok(Object.prototype.hasOwnProperty.call(filePolicy, required), `${id} missing ${required}`);
    }
  }
  assert.equal(BUILTIN_CASE_POLICIES.length, 3);
});

test('V2 policy manifest rejects duplicate rule identities', () => {
  const policy = casePolicyById('LAB-CASE-OPEN-004');
  assert.throws(() => casePolicyManifestBody({
    ...policy,
    admission_rules: [policy.admission_rules[0], policy.admission_rules[0]],
  }), /duplicate policy rule_id/);
});

test('V1 policy identifiers are not reused by V2 case policies', () => {
  const v1Ids = new Set(['LAB-OPEN-001', 'ENERGY-PILOT-002', 'ENERGY-STRICT-003', 'SPK-ENERGY-001']);
  for (const policy of BUILTIN_CASE_POLICIES) {
    assert.equal(v1Ids.has(policy.id), false, `V2 reused V1 policy id ${policy.id}`);
  }
});

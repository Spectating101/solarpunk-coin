import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BUILTIN_POLICIES,
  hashPolicyManifest,
  policyManifestBody,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));

test('committed policy manifests are exact canonical built-in policy bodies', async () => {
  for (const policy of BUILTIN_POLICIES) {
    const committed = await repoJson(`protocol/policies/${policy.id}.json`);
    assert.deepEqual(committed, policyManifestBody(policy), `${policy.id} committed manifest drifted from the evaluator`);
    assert.match(await hashPolicyManifest(committed), /^[a-f0-9]{64}$/);
  }
});

test('changing a policy field changes the manifest hash', async () => {
  const policy = BUILTIN_POLICIES.find((item) => item.id === 'ENERGY-PILOT-002');
  const original = await hashPolicyManifest(policy);
  const changed = await hashPolicyManifest({
    ...policy,
    issuance: { ...policy.issuance, haircut_pct: policy.issuance.haircut_pct + 1 },
  });
  assert.notEqual(changed, original);
});

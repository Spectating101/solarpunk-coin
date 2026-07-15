import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
} from '../src/index.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, PACK_ROOT), 'utf8'));

async function admittedDecision() {
  const caseManifest = await readJson('cases/TYN-001.json');
  const evidence = await readJson('evidence/tyn-sample-evidence.json');
  const context = await readJson('contexts/tyn-resource-context.json');
  const scenario = await readJson('scenarios/provenance-L2.json');
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: classifyProvenance(evidence, scenario.provenance_context),
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });
}

test('decision-bound claim creation accepts an intact admitted DecisionResult', async () => {
  const decision = await admittedDecision();
  const claim = await createDecisionClaimManifest({
    decision,
    subject: 'TYN-001 research claim',
  });
  assert.equal(claim.decision_id, decision.decision_id);
  assert.equal(claim.quantity, 126);
  assert.equal(claim.state, 'ADMITTED');
});

test('decision-bound claim creation rejects a tampered admitted maximum with retained decision id', async () => {
  const decision = await admittedDecision();
  const tampered = {
    ...decision,
    capacity: {
      ...decision.capacity,
      admitted_maximum: decision.capacity.admitted_maximum + 1,
    },
  };

  await assert.rejects(
    createDecisionClaimManifest({
      decision: tampered,
      subject: 'TYN-001 research claim',
    }),
    /DecisionResult identity mismatch/,
  );
});

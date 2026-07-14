import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlementConstraint,
  makeIssuedClaim,
} from '../src/index.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const SCHEMA_ROOT = new URL('../../../protocol/schema/', import.meta.url);
const readJson = async (base, path) => JSON.parse(await readFile(new URL(path, base), 'utf8'));

async function taoyuanL2Decision() {
  const caseManifest = await readJson(PACK_ROOT, 'cases/TYN-001.json');
  const evidence = await readJson(PACK_ROOT, 'evidence/tyn-sample-evidence.json');
  const context = await readJson(PACK_ROOT, 'contexts/tyn-resource-context.json');
  const scenario = await readJson(PACK_ROOT, 'scenarios/provenance-L2.json');
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: classifyProvenance(evidence, scenario.provenance_context),
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });
}

test('decision-bound claim v2 preserves DecisionResult identity and bounded quantity', async () => {
  const decision = await taoyuanL2Decision();
  const first = await createDecisionClaimManifest({ decision, subject: 'TYN-001 research claim' });
  const second = await createDecisionClaimManifest({ decision, subject: 'TYN-001 research claim' });
  const schema = await readJson(SCHEMA_ROOT, 'claim-manifest.v2.schema.json');

  assert.equal(first.schema, 'solarpunk.constraint.claim_manifest.v2');
  assert.equal(first.claim_id, second.claim_id);
  assert.equal(first.decision_id, decision.decision_id);
  assert.equal(first.case_id, 'TYN-001');
  assert.equal(first.quantity, 126);
  assert.equal(first.quantity_base_units, '126000000');
  assert.equal(first.state, 'ADMITTED');
  assert.deepEqual(first.blockers, []);
  for (const field of schema.required) assert.ok(Object.hasOwn(first, field), `claim v2 missing ${field}`);
});

test('blocked decisions cannot create decision-bound claims', async () => {
  const caseManifest = await readJson(PACK_ROOT, 'cases/TYN-001.json');
  const evidence = await readJson(PACK_ROOT, 'evidence/tyn-sample-evidence.json');
  const context = await readJson(PACK_ROOT, 'contexts/tyn-resource-context.json');
  const scenario = await readJson(PACK_ROOT, 'scenarios/provenance-L0.json');
  const decision = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: classifyProvenance(evidence, scenario.provenance_context),
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });

  await assert.rejects(
    createDecisionClaimManifest({ decision }),
    /must be ADMIT_WITH_LIMIT/,
  );
});

test('typed settlement capacity remains a separate stage and distinguishes settled, partial, and shortfall', async () => {
  const decision = await taoyuanL2Decision();
  const claim = makeIssuedClaim(await createDecisionClaimManifest({
    decision,
    subject: 'TYN-001 research claim',
  }));

  const settled = await evaluateSettlementConstraint({ claim, settlement_capacity: 126 });
  const partial = await evaluateSettlementConstraint({ claim, settlement_capacity: 50 });
  const shortfall = await evaluateSettlementConstraint({ claim, settlement_capacity: 0 });

  assert.equal(settled.constraint_class, 'SETTLEMENT_CONSTRAINT');
  assert.equal(settled.status, 'PASS');
  assert.equal(settled.observed_inputs.settlement_result, 'SETTLED');
  assert.equal(settled.observed_inputs.shortfall_quantity, 0);

  assert.equal(partial.status, 'WARNING');
  assert.equal(partial.observed_inputs.settlement_result, 'PARTIAL');
  assert.equal(partial.observed_inputs.covered_quantity, 50);
  assert.equal(partial.observed_inputs.shortfall_quantity, 76);

  assert.equal(shortfall.status, 'BLOCK');
  assert.equal(shortfall.observed_inputs.settlement_result, 'SHORTFALL');
  assert.equal(shortfall.observed_inputs.covered_quantity, 0);
  assert.equal(shortfall.observed_inputs.shortfall_quantity, 126);
});

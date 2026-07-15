import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildConstraintEvaluation,
  buildDecisionReceipt,
  buildDecisionResult,
  receiptSummary,
} from '../src/index.js';

const HASHES = {
  policy: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  evidence: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  context: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
};

async function admittedDecision() {
  const gate = await buildConstraintEvaluation({
    calculator_id: 'POSITIVE_SURPLUS',
    calculator_version: '1.0.0',
    constraint_class: 'ADMISSION_GATE',
    policy_rule_id: 'energy.positive-surplus.v1',
    status: 'PASS',
    unit: null,
    quantity_decimals: null,
    capacity: null,
    input_refs: [HASHES.evidence],
    observed_inputs: { surplus_kwh: 100 },
    parameters: {},
    assumptions: [],
    warnings: [],
    explanation: 'Positive eligible surplus is present.',
    boundary: 'Evidence gate only.',
  });
  const capacity = await buildConstraintEvaluation({
    calculator_id: 'EVIDENCE_BACKED_CAPACITY',
    calculator_version: '1.0.0',
    constraint_class: 'QUANTITY_CEILING',
    policy_rule_id: 'energy.evidence-capacity.v1',
    status: 'PASS',
    unit: 'ENERGY_CLAIM_UNIT',
    quantity_decimals: 6,
    capacity: 100,
    input_refs: [HASHES.evidence],
    observed_inputs: { surplus_kwh: 100 },
    parameters: { rate: 1 },
    assumptions: [],
    warnings: [],
    explanation: 'Evidence backing permits 100 units.',
    boundary: 'Derived quantity; not issuance authority.',
  });
  return buildDecisionResult({
    case_id: 'TYN-001',
    case_hash: null,
    policy_id: 'ENERGY-CASE-PILOT-005',
    policy_version: '1.0.0',
    policy_manifest_hash: HASHES.policy,
    evidence_hashes: [HASHES.evidence],
    context_refs: [{ context_id: 'resource:tyn', context_hash: HASHES.context }],
    admission: { result: 'PASS', evaluations: [gate], blocking_rules: [] },
    capacity: {
      evaluated: true,
      unit: 'ENERGY_CLAIM_UNIT',
      quantity_decimals: 6,
      evaluations: [capacity],
      admitted_maximum: 100,
      binding_constraints: ['EVIDENCE_BACKED_CAPACITY'],
    },
    decision: 'ADMIT_WITH_LIMIT',
    warnings: [],
    boundary: 'Research decision under declared inputs.',
  });
}

test('receipt adds audit time without changing deterministic decision identity', async () => {
  const decision = await admittedDecision();
  const first = buildDecisionReceipt({
    decision,
    evaluated_at: '2026-07-14T15:42:18Z',
    runtime: {
      package: '@solarpunk/constraint-core',
      package_version: '0.1.0-alpha.1',
      source_revision: 'test-revision',
    },
    data_boundary: 'Raw evidence excluded.',
  });
  const second = buildDecisionReceipt({
    decision,
    evaluated_at: '2026-07-14T16:42:18Z',
    runtime: {
      package: '@solarpunk/constraint-core',
      package_version: '0.1.0-alpha.1',
      source_revision: 'test-revision',
    },
    data_boundary: 'Raw evidence excluded.',
  });

  assert.equal(first.decision_id, decision.decision_id);
  assert.equal(second.decision_id, decision.decision_id);
  assert.notEqual(first.evaluated_at, second.evaluated_at);
  assert.equal(first.evidence[0].raw_included, false);
  assert.deepEqual(first.binding_constraints, ['EVIDENCE_BACKED_CAPACITY']);
  assert.equal(receiptSummary(first).policy, 'ENERGY-CASE-PILOT-005@1.0.0');
});

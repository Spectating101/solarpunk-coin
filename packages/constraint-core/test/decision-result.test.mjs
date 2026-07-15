import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertComparableCapacityUnits,
  buildConstraintEvaluation,
  buildDecisionResult,
  decisionResultBody,
} from '../src/index.js';

const POLICY_HASH = '1111111111111111111111111111111111111111111111111111111111111111';
const EVIDENCE_HASH = '2222222222222222222222222222222222222222222222222222222222222222';
const CONTEXT_HASH = '3333333333333333333333333333333333333333333333333333333333333333';
const CASE_HASH = '4444444444444444444444444444444444444444444444444444444444444444';

async function gate(status = 'PASS') {
  return buildConstraintEvaluation({
    calculator_id: 'MIN_PROVENANCE',
    calculator_version: '1.0.0',
    constraint_class: 'ADMISSION_GATE',
    policy_rule_id: 'energy.minimum-provenance.v1',
    status,
    unit: null,
    quantity_decimals: null,
    capacity: null,
    input_refs: [EVIDENCE_HASH],
    observed_inputs: { observed: 'L2', required: 'L2' },
    parameters: { minimum: 'L2' },
    assumptions: [],
    warnings: [],
    explanation: status === 'PASS' ? 'Provenance meets the minimum.' : 'Provenance is below the minimum.',
    boundary: 'Assurance classification is not legal ownership.',
  });
}

async function ceiling(calculatorId, capacity, unit = 'ENERGY_CLAIM_UNIT') {
  return buildConstraintEvaluation({
    calculator_id: calculatorId,
    calculator_version: '1.0.0',
    constraint_class: 'QUANTITY_CEILING',
    policy_rule_id: `energy.${calculatorId.toLowerCase()}.v1`,
    status: 'PASS',
    unit,
    quantity_decimals: 6,
    capacity,
    input_refs: [CONTEXT_HASH],
    observed_inputs: { capacity },
    parameters: {},
    assumptions: [],
    warnings: [],
    explanation: `${calculatorId} permits ${capacity}.`,
    boundary: 'Declared research capacity only.',
  });
}

function decisionBase() {
  return {
    case_id: 'TYN-001',
    case_hash: CASE_HASH,
    policy_id: 'ENERGY-CASE-PILOT-005',
    policy_version: '1.0.0',
    policy_manifest_hash: POLICY_HASH,
    evidence_hashes: [EVIDENCE_HASH],
    context_refs: [{ context_id: 'resource:tyn', context_hash: CONTEXT_HASH }],
    warnings: [],
    boundary: 'Research decision under declared inputs; not legal issuance authority.',
  };
}

test('admitted decisions preserve comparable capacity semantics and deterministic identity', async () => {
  const gatePass = await gate('PASS');
  const evidence = await ceiling('EVIDENCE_BACKED_CAPACITY', 700);
  const resource = await ceiling('RESOURCE_CONTEXT_CAPACITY', 431.12);
  const value = {
    ...decisionBase(),
    admission: { result: 'PASS', evaluations: [gatePass], blocking_rules: [] },
    capacity: {
      evaluated: true,
      unit: 'ENERGY_CLAIM_UNIT',
      quantity_decimals: 6,
      evaluations: [evidence, resource],
      admitted_maximum: 431.12,
      binding_constraints: ['RESOURCE_CONTEXT_CAPACITY'],
    },
    decision: 'ADMIT_WITH_LIMIT',
  };

  const first = await buildDecisionResult(value);
  const second = await buildDecisionResult(value);
  assert.equal(first.decision_id, second.decision_id);
  assert.equal(first.capacity.admitted_maximum, 431.12);
  assert.deepEqual(first.capacity.binding_constraints, ['RESOURCE_CONTEXT_CAPACITY']);
  assert.deepEqual(decisionResultBody(first), first);
});

test('blocked decisions cannot carry evaluated quantity capacity', async () => {
  const gateBlock = await gate('BLOCK');
  const blocked = await buildDecisionResult({
    ...decisionBase(),
    admission: {
      result: 'BLOCK',
      evaluations: [gateBlock],
      blocking_rules: ['MIN_PROVENANCE'],
    },
    capacity: {
      evaluated: false,
      unit: null,
      quantity_decimals: null,
      evaluations: [],
      admitted_maximum: 0,
      binding_constraints: [],
    },
    decision: 'BLOCKED',
  });
  assert.equal(blocked.decision, 'BLOCKED');
  assert.equal(blocked.capacity.evaluated, false);

  const improperCapacity = await ceiling('ABSOLUTE_POLICY_CAP', 100);
  await assert.rejects(
    buildDecisionResult({
      ...blocked,
      capacity: {
        evaluated: true,
        unit: 'ENERGY_CLAIM_UNIT',
        quantity_decimals: 6,
        evaluations: [improperCapacity],
        admitted_maximum: 100,
        binding_constraints: ['ABSOLUTE_POLICY_CAP'],
      },
    }),
    /BLOCKED decision cannot carry evaluated capacity/,
  );
});

test('quantity ceilings fail closed on incompatible units', async () => {
  const energy = await ceiling('EVIDENCE_BACKED_CAPACITY', 700, 'ENERGY_CLAIM_UNIT');
  const usd = await ceiling('ABSOLUTE_POLICY_CAP', 500, 'USD');
  assert.throws(
    () => assertComparableCapacityUnits([energy, usd]),
    /quantity ceiling unit mismatch/,
  );
});

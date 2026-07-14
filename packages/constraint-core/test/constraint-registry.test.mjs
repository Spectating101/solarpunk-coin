import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildConstraintEvaluation,
  constraintEvaluationBody,
  createCalculatorRegistry,
} from '../src/index.js';

const PASS_GATE = {
  id: 'TEST_GATE',
  version: '1.0.0',
  constraintClass: 'ADMISSION_GATE',
  boundary: 'Test-only deterministic gate.',
  evaluate({ parameters }) {
    return {
      status: parameters.pass ? 'PASS' : 'BLOCK',
      unit: null,
      quantity_decimals: null,
      capacity: null,
      input_refs: ['fixture:test'],
      observed_inputs: { pass: Boolean(parameters.pass) },
      assumptions: [],
      warnings: [],
      explanation: parameters.pass ? 'The test gate passed.' : 'The test gate blocked.',
    };
  },
};

test('calculator registry rejects duplicate calculator identifiers', () => {
  assert.throws(
    () => createCalculatorRegistry([
      PASS_GATE,
      { ...PASS_GATE, version: '2.0.0' },
    ]),
    /duplicate calculator id TEST_GATE/,
  );
});

test('calculator registry returns deterministic typed evaluations', async () => {
  const registry = createCalculatorRegistry([PASS_GATE]);
  const rule = {
    rule_id: 'test.gate.v1',
    calculator_id: 'TEST_GATE',
    parameters: { pass: true },
  };
  const first = await registry.evaluateRule({ rule });
  const second = await registry.evaluateRule({ rule });

  assert.equal(first.constraint_class, 'ADMISSION_GATE');
  assert.equal(first.status, 'PASS');
  assert.equal(first.policy_rule_id, 'test.gate.v1');
  assert.equal(first.evaluation_id, second.evaluation_id);
  assert.deepEqual(constraintEvaluationBody(first), first);
});

test('constraint evaluation identity changes with declared parameters', async () => {
  const first = await buildConstraintEvaluation({
    calculator_id: 'TEST_GATE',
    calculator_version: '1.0.0',
    constraint_class: 'ADMISSION_GATE',
    policy_rule_id: 'test.gate.v1',
    status: 'PASS',
    unit: null,
    quantity_decimals: null,
    capacity: null,
    input_refs: [],
    observed_inputs: { value: 1 },
    parameters: { threshold: 1 },
    assumptions: [],
    warnings: [],
    explanation: 'Pass.',
    boundary: 'Test only.',
  });
  const second = await buildConstraintEvaluation({
    ...first,
    parameters: { threshold: 2 },
  });
  assert.notEqual(first.evaluation_id, second.evaluation_id);
});

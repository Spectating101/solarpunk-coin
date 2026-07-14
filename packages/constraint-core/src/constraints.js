import { round, sha256Hex, stableStringify } from './stable.js';

export const CONSTRAINT_EVALUATION_SCHEMA = 'solarpunk.constraint.constraint_evaluation.v1';
export const CONSTRAINT_CLASSES = Object.freeze([
  'ADMISSION_GATE',
  'QUANTITY_CEILING',
  'SETTLEMENT_CONSTRAINT',
]);

const STATUS_BY_CLASS = Object.freeze({
  ADMISSION_GATE: new Set(['PASS', 'BLOCK']),
  QUANTITY_CEILING: new Set(['PASS', 'WARNING', 'NOT_APPLICABLE']),
  SETTLEMENT_CONSTRAINT: new Set(['PASS', 'BLOCK', 'WARNING']),
});

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function plainObject(value, field) {
  if (value == null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return value;
}

function stringArray(value, field) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return value.map((item) => requiredText(item, `${field} item`));
}

function normalizeConstraintClass(value) {
  const constraintClass = requiredText(value, 'constraint_class');
  if (!CONSTRAINT_CLASSES.includes(constraintClass)) {
    throw new Error(`unknown constraint class: ${constraintClass}`);
  }
  return constraintClass;
}

function normalizeStatus(constraintClass, value) {
  const status = requiredText(value, 'status');
  if (!STATUS_BY_CLASS[constraintClass].has(status)) {
    throw new Error(`status ${status} is invalid for ${constraintClass}`);
  }
  return status;
}

function normalizeDecimals(value) {
  if (value == null) return null;
  const decimals = Number(value);
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('quantity_decimals must be an integer between 0 and 18');
  }
  return decimals;
}

function evaluationHashBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('constraint evaluation is required');
  }
  if (value.schema != null && value.schema !== CONSTRAINT_EVALUATION_SCHEMA) {
    throw new Error(`constraint evaluation schema must be ${CONSTRAINT_EVALUATION_SCHEMA}`);
  }
  const constraintClass = normalizeConstraintClass(value.constraint_class);
  const status = normalizeStatus(constraintClass, value.status);
  const unit = value.unit == null ? null : requiredText(value.unit, 'unit');
  const quantityDecimals = normalizeDecimals(value.quantity_decimals);
  let capacity = value.capacity == null ? null : Number(value.capacity);
  if (capacity != null && (!Number.isFinite(capacity) || capacity < 0)) {
    throw new Error('capacity must be a non-negative finite number or null');
  }
  if (capacity != null) capacity = round(capacity);

  if (constraintClass === 'QUANTITY_CEILING' && status !== 'NOT_APPLICABLE') {
    if (!unit) throw new Error('quantity ceiling evaluation requires unit');
    if (quantityDecimals == null) throw new Error('quantity ceiling evaluation requires quantity_decimals');
    if (capacity == null) throw new Error('applicable quantity ceiling evaluation requires capacity');
  }
  if (constraintClass !== 'QUANTITY_CEILING' && capacity != null) {
    throw new Error(`${constraintClass} evaluation cannot carry capacity`);
  }

  return {
    schema: CONSTRAINT_EVALUATION_SCHEMA,
    calculator_id: requiredText(value.calculator_id, 'calculator_id'),
    calculator_version: requiredText(value.calculator_version, 'calculator_version'),
    constraint_class: constraintClass,
    policy_rule_id: value.policy_rule_id == null ? null : requiredText(value.policy_rule_id, 'policy_rule_id'),
    status,
    unit,
    quantity_decimals: quantityDecimals,
    capacity,
    input_refs: [...new Set(stringArray(value.input_refs, 'input_refs'))].sort(),
    observed_inputs: { ...plainObject(value.observed_inputs, 'observed_inputs') },
    parameters: { ...plainObject(value.parameters, 'parameters') },
    assumptions: stringArray(value.assumptions, 'assumptions'),
    warnings: stringArray(value.warnings, 'warnings'),
    explanation: requiredText(value.explanation, 'explanation'),
    boundary: requiredText(value.boundary, 'boundary'),
  };
}

export async function buildConstraintEvaluation(value) {
  const body = evaluationHashBody(value);
  return {
    ...body,
    evaluation_id: await sha256Hex(stableStringify(body)),
  };
}

export function constraintEvaluationBody(value) {
  const body = evaluationHashBody(value);
  const evaluationId = requiredText(value.evaluation_id, 'evaluation_id');
  if (!/^[a-f0-9]{64}$/.test(evaluationId)) {
    throw new Error('evaluation_id must be a lowercase SHA-256 hex string');
  }
  return {
    ...body,
    evaluation_id: evaluationId,
  };
}

function normalizeCalculator(calculator) {
  if (!calculator || typeof calculator !== 'object' || Array.isArray(calculator)) {
    throw new Error('calculator must be an object');
  }
  const id = requiredText(calculator.id, 'calculator.id');
  const version = requiredText(calculator.version, 'calculator.version');
  const constraintClass = normalizeConstraintClass(calculator.constraintClass);
  if (typeof calculator.evaluate !== 'function') {
    throw new Error(`calculator ${id} requires an evaluate function`);
  }
  return {
    id,
    version,
    constraintClass,
    boundary: requiredText(calculator.boundary, `calculator ${id} boundary`),
    evaluate: calculator.evaluate,
  };
}

export function createCalculatorRegistry(calculators = []) {
  if (!Array.isArray(calculators)) throw new Error('calculators must be an array');
  const registry = new Map();

  for (const raw of calculators) {
    const calculator = normalizeCalculator(raw);
    if (registry.has(calculator.id)) {
      const prior = registry.get(calculator.id);
      throw new Error(
        `duplicate calculator id ${calculator.id}: ${prior.version} conflicts with ${calculator.version}`,
      );
    }
    registry.set(calculator.id, calculator);
  }

  return Object.freeze({
    calculatorById(id) {
      return registry.get(String(id)) || null;
    },
    listCalculators() {
      return [...registry.values()].map(({ evaluate, ...metadata }) => ({ ...metadata }));
    },
    async evaluateRule({ rule, ...runtime }) {
      if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
        throw new Error('policy rule is required');
      }
      const calculatorId = requiredText(rule.calculator_id, 'rule.calculator_id');
      const calculator = registry.get(calculatorId);
      if (!calculator) throw new Error(`unknown calculator: ${calculatorId}`);
      const parameters = { ...plainObject(rule.parameters, 'rule.parameters') };
      const result = await calculator.evaluate({
        ...runtime,
        policyRule: rule,
        parameters,
      });
      if (!result || typeof result !== 'object' || Array.isArray(result)) {
        throw new Error(`calculator ${calculatorId} returned an invalid result`);
      }
      if (result.constraint_class != null && result.constraint_class !== calculator.constraintClass) {
        throw new Error(`calculator ${calculatorId} returned conflicting constraint_class`);
      }
      return buildConstraintEvaluation({
        ...result,
        calculator_id: calculator.id,
        calculator_version: calculator.version,
        constraint_class: calculator.constraintClass,
        policy_rule_id: rule.rule_id ?? null,
        parameters,
        boundary: result.boundary ?? calculator.boundary,
      });
    },
  });
}

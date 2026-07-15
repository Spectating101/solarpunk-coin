import { provenanceRank } from './provenance.js';
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

function numericParameter(value, field, { minimum = null, maximum = null } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a finite number`);
  if (minimum != null && parsed < minimum) throw new Error(`${field} must be >= ${minimum}`);
  if (maximum != null && parsed > maximum) throw new Error(`${field} must be <= ${maximum}`);
  return parsed;
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

function primaryEvidence({ evidence, evidenceList }) {
  if (evidence) return evidence;
  const list = Array.isArray(evidenceList) ? evidenceList : [];
  if (list.length !== 1) {
    throw new Error(`built-in energy calculators require exactly one evidence envelope; received ${list.length}`);
  }
  return list[0];
}

function quantitySemantics(parameters) {
  const unit = requiredText(parameters.unit, 'parameters.unit');
  const quantityDecimals = normalizeDecimals(parameters.quantity_decimals ?? 6);
  return { unit, quantityDecimals };
}

function evidenceInputRef(evidence) {
  return evidence?.evidence_hash ? [evidence.evidence_hash] : [];
}

function contextCollection(contexts) {
  if (contexts instanceof Map) return [...contexts.values()];
  if (Array.isArray(contexts)) return contexts;
  if (contexts && typeof contexts === 'object') return Object.values(contexts);
  return [];
}

function resourceContext({ contexts, parameters }) {
  const contextId = parameters.context_id == null ? null : String(parameters.context_id);
  const contextType = parameters.context_type == null ? 'resource_model' : String(parameters.context_type);
  const matches = contextCollection(contexts).filter((context) => (
    contextId ? context?.context_id === contextId : context?.context_type === contextType
  ));
  if (matches.length !== 1) {
    const selector = contextId ? `context_id ${contextId}` : `context_type ${contextType}`;
    throw new Error(`RESOURCE_CONTEXT_CAPACITY requires exactly one ${selector}; received ${matches.length}`);
  }
  return matches[0];
}

function valueAtPath(object, path) {
  const parts = String(path || '').split('.').filter(Boolean);
  if (!parts.length) throw new Error('parameters.value_path is required');
  let current = object;
  for (const part of parts) current = current?.[part];
  return current;
}

function measurementDurationDays(caseManifest) {
  const start = Date.parse(caseManifest?.measurement_window?.start);
  const end = Date.parse(caseManifest?.measurement_window?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error('RESOURCE_CONTEXT_CAPACITY requires a positive case measurement window');
  }
  return (end - start) / 86_400_000;
}

function priorCapacity(priorEvaluations, calculatorId) {
  const matches = (priorEvaluations || []).filter((item) => (
    item.constraint_class === 'QUANTITY_CEILING'
    && item.calculator_id === calculatorId
    && item.status !== 'NOT_APPLICABLE'
  ));
  if (matches.length !== 1) {
    throw new Error(`expected exactly one prior ${calculatorId} evaluation; received ${matches.length}`);
  }
  return matches[0];
}

export const BUILTIN_CALCULATORS = Object.freeze([
  {
    id: 'POSITIVE_SURPLUS',
    version: '1.0.0',
    constraintClass: 'ADMISSION_GATE',
    boundary: 'Eligible surplus is an evidence-derived quantity and does not itself establish claim authority.',
    evaluate(runtime) {
      const evidence = primaryEvidence(runtime);
      const surplus = Number(evidence?.summary?.total_eligible_surplus_kwh || 0);
      const pass = surplus > 0;
      return {
        status: pass ? 'PASS' : 'BLOCK',
        unit: null,
        quantity_decimals: null,
        capacity: null,
        input_refs: evidenceInputRef(evidence),
        observed_inputs: { total_eligible_surplus_kwh: round(surplus) },
        assumptions: [],
        warnings: [],
        explanation: pass
          ? `Evidence contains ${round(surplus)} kWh of positive eligible surplus.`
          : 'Evidence does not contain positive eligible surplus.',
      };
    },
  },
  {
    id: 'ZERO_BLOCKERS',
    version: '1.0.0',
    constraintClass: 'ADMISSION_GATE',
    boundary: 'Envelope diagnostics are deterministic checks; passing them does not prove source truth.',
    evaluate(runtime) {
      const evidence = primaryEvidence(runtime);
      const blockers = Number(evidence?.summary?.blocker_count || 0);
      return {
        status: blockers === 0 ? 'PASS' : 'BLOCK',
        unit: null,
        quantity_decimals: null,
        capacity: null,
        input_refs: evidenceInputRef(evidence),
        observed_inputs: { blocker_count: blockers },
        assumptions: [],
        warnings: [],
        explanation: blockers === 0
          ? 'Evidence has no envelope-level blocking diagnostics.'
          : `Evidence contains ${blockers} envelope-level blocking diagnostic(s).`,
      };
    },
  },
  {
    id: 'SIGNED_EVIDENCE',
    version: '1.0.0',
    constraintClass: 'ADMISSION_GATE',
    boundary: 'A signed capability establishes cryptographic evidence metadata only; it does not prove physical measurement truth or trusted operator identity.',
    evaluate(runtime) {
      const evidence = primaryEvidence(runtime);
      const signed = Boolean(evidence?.capabilities?.signed);
      return {
        status: signed ? 'PASS' : 'BLOCK',
        unit: null,
        quantity_decimals: null,
        capacity: null,
        input_refs: evidenceInputRef(evidence),
        observed_inputs: { signed },
        assumptions: [],
        warnings: [],
        explanation: signed
          ? 'The evidence envelope declares signed evidence capability.'
          : 'The evidence envelope does not declare signed evidence capability.',
      };
    },
  },
  {
    id: 'MIN_PROVENANCE',
    version: '1.0.0',
    constraintClass: 'ADMISSION_GATE',
    boundary: 'Provenance level is an evidence-assurance classification, not proof of legal ownership or redemption rights.',
    evaluate({ provenance, parameters }) {
      const observed = requiredText(provenance?.level, 'provenance.level');
      const minimum = requiredText(parameters.minimum, 'parameters.minimum');
      const pass = provenanceRank(observed) >= provenanceRank(minimum);
      return {
        status: pass ? 'PASS' : 'BLOCK',
        unit: null,
        quantity_decimals: null,
        capacity: null,
        input_refs: [],
        observed_inputs: { observed, required: minimum },
        assumptions: [],
        warnings: [],
        explanation: pass
          ? `Provenance ${observed} meets the declared ${minimum} minimum.`
          : `Policy requires provenance ${minimum} or better; received ${observed}.`,
      };
    },
  },
  {
    id: 'EXTERNAL_CORROBORATION',
    version: '1.0.0',
    constraintClass: 'ADMISSION_GATE',
    boundary: 'Corroboration is an evidence-assurance property and does not create environmental-attribute ownership or legal settlement rights.',
    evaluate(runtime) {
      const evidence = primaryEvidence(runtime);
      const corroborated = Boolean(
        evidence?.capabilities?.external_corroboration
        || runtime.provenance?.level === 'L4',
      );
      return {
        status: corroborated ? 'PASS' : 'BLOCK',
        unit: null,
        quantity_decimals: null,
        capacity: null,
        input_refs: evidenceInputRef(evidence),
        observed_inputs: {
          evidence_external_corroboration: Boolean(evidence?.capabilities?.external_corroboration),
          provenance_level: runtime.provenance?.level ?? null,
        },
        assumptions: [],
        warnings: [],
        explanation: corroborated
          ? 'External corroboration is present in the declared evidence-assurance state.'
          : 'External utility or settlement corroboration is not established.',
      };
    },
  },
  {
    id: 'EVIDENCE_BACKED_CAPACITY',
    version: '1.0.0',
    constraintClass: 'QUANTITY_CEILING',
    boundary: 'Evidence-backed capacity is derived from accepted eligible surplus under the declared rate; it is not issuance authority.',
    evaluate(runtime) {
      const evidence = primaryEvidence(runtime);
      const { unit, quantityDecimals } = quantitySemantics(runtime.parameters);
      const rate = numericParameter(runtime.parameters.rate ?? 1, 'parameters.rate', { minimum: 0 });
      const surplus = Number(evidence?.summary?.total_eligible_surplus_kwh || 0);
      const capacity = round(surplus * rate);
      return {
        status: 'PASS',
        unit,
        quantity_decimals: quantityDecimals,
        capacity,
        input_refs: evidenceInputRef(evidence),
        observed_inputs: { total_eligible_surplus_kwh: round(surplus) },
        assumptions: [],
        warnings: [],
        explanation: `${round(surplus)} kWh × ${rate} permits at most ${capacity} ${unit} before other ceilings.`,
      };
    },
  },
  {
    id: 'PROVENANCE_POLICY_CAPACITY',
    version: '1.0.0',
    constraintClass: 'QUANTITY_CEILING',
    boundary: 'The assurance-to-capacity mapping is declared by policy. The provenance classifier does not own a universal financial haircut.',
    evaluate({ provenance, parameters, priorEvaluations }) {
      const { unit, quantityDecimals } = quantitySemantics(parameters);
      const sourceCalculator = String(parameters.source_calculator_id || 'EVIDENCE_BACKED_CAPACITY');
      const source = priorCapacity(priorEvaluations, sourceCalculator);
      if (source.unit !== unit || source.quantity_decimals !== quantityDecimals) {
        throw new Error('PROVENANCE_POLICY_CAPACITY source quantity semantics do not match policy rule');
      }
      const mapping = plainObject(parameters.capacity_multiplier_by_level, 'parameters.capacity_multiplier_by_level');
      const level = requiredText(provenance?.level, 'provenance.level');
      if (!Object.prototype.hasOwnProperty.call(mapping, level)) {
        throw new Error(`capacity multiplier is not declared for provenance ${level}`);
      }
      const multiplier = numericParameter(mapping[level], `capacity multiplier for ${level}`, { minimum: 0, maximum: 1 });
      const capacity = round(Number(source.capacity) * multiplier);
      return {
        status: 'PASS',
        unit,
        quantity_decimals: quantityDecimals,
        capacity,
        input_refs: [source.evaluation_id],
        observed_inputs: {
          provenance_level: level,
          source_capacity: source.capacity,
        },
        assumptions: [],
        warnings: [],
        explanation: `Policy maps ${level} assurance to ${(multiplier * 100).toFixed(2)}% of ${sourceCalculator}, permitting ${capacity} ${unit}.`,
      };
    },
  },
  {
    id: 'RESOURCE_CONTEXT_CAPACITY',
    version: '1.0.0',
    constraintClass: 'QUANTITY_CEILING',
    boundary: 'Resource capacity is modeled context. It is not observed generation evidence and cannot independently authorize a claim.',
    evaluate({ caseManifest, contexts, parameters }) {
      const { unit, quantityDecimals } = quantitySemantics(parameters);
      const context = resourceContext({ contexts, parameters });
      const valuePath = requiredText(parameters.value_path, 'parameters.value_path');
      const annualValue = numericParameter(valueAtPath(context, valuePath), `context ${valuePath}`, { minimum: 0 });
      const daysPerYear = numericParameter(parameters.days_per_year ?? 365, 'parameters.days_per_year', { minimum: 1 });
      const rate = numericParameter(parameters.rate ?? 1, 'parameters.rate', { minimum: 0 });
      const multiplier = numericParameter(parameters.capacity_multiplier ?? 1, 'parameters.capacity_multiplier', { minimum: 0 });
      const durationDays = measurementDurationDays(caseManifest);
      const capacity = round((annualValue / daysPerYear) * durationDays * rate * multiplier);
      return {
        status: 'PASS',
        unit,
        quantity_decimals: quantityDecimals,
        capacity,
        input_refs: [context.context_hash],
        observed_inputs: {
          context_id: context.context_id,
          modeled_annual_value: annualValue,
          measurement_duration_days: round(durationDays),
          temporal_kind: context.temporal_semantics?.kind ?? null,
        },
        assumptions: [
          `Declared formula annual context ÷ ${daysPerYear} × measurement-window days × rate × capacity multiplier.`,
        ],
        warnings: ['Modeled resource context is not observed meter production for the case window.'],
        explanation: `Modeled resource context permits ${capacity} ${unit} under the declared time-scaling rule.`,
      };
    },
  },
  {
    id: 'ABSOLUTE_POLICY_CAP',
    version: '1.0.0',
    constraintClass: 'QUANTITY_CEILING',
    boundary: 'The absolute cap is a declared policy ceiling and does not establish evidence truth or settlement capacity.',
    evaluate({ parameters }) {
      const { unit, quantityDecimals } = quantitySemantics(parameters);
      const maximum = numericParameter(parameters.maximum, 'parameters.maximum', { minimum: 0 });
      return {
        status: 'PASS',
        unit,
        quantity_decimals: quantityDecimals,
        capacity: round(maximum),
        input_refs: [],
        observed_inputs: {},
        assumptions: [],
        warnings: [],
        explanation: `Policy declares an absolute maximum of ${round(maximum)} ${unit}.`,
      };
    },
  },
]);

export function createCalculatorRegistry(calculators = BUILTIN_CALCULATORS) {
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

import { sha256Hex, stableStringify } from './stable.js';

export const CASE_POLICY_MANIFEST_SCHEMA = 'solarpunk.constraint.policy_manifest.v2';

const ENERGY_QUANTITY = Object.freeze({
  unit: 'ENERGY_CLAIM_UNIT',
  quantity_decimals: 6,
});

const PROVENANCE_MULTIPLIERS = Object.freeze({
  L0: 0,
  L1: 0.4,
  L2: 0.7,
  L3: 0.88,
  L4: 0.95,
});

function rule(rule_id, calculator_id, parameters = {}) {
  return { rule_id, calculator_id, parameters };
}

export const BUILTIN_CASE_POLICIES = Object.freeze([
  {
    id: 'LAB-CASE-OPEN-004',
    version: '1.0.0',
    name: 'Open Case Demonstration',
    description: 'Research-only case policy that admits deterministic sample evidence after basic evidence gates and compares evidence, modeled resource, and absolute quantity ceilings.',
    admission_rules: [
      rule('case.open.positive-surplus.v1', 'POSITIVE_SURPLUS'),
      rule('case.open.zero-blockers.v1', 'ZERO_BLOCKERS'),
    ],
    quantity_rules: [
      rule('case.open.evidence-capacity.v1', 'EVIDENCE_BACKED_CAPACITY', {
        ...ENERGY_QUANTITY,
        rate: 1,
      }),
      rule('case.open.resource-context.v1', 'RESOURCE_CONTEXT_CAPACITY', {
        ...ENERGY_QUANTITY,
        context_type: 'resource_model',
        value_path: 'values.annual_ac_kwh',
        days_per_year: 365,
        rate: 1,
        capacity_multiplier: 1,
      }),
      rule('case.open.absolute-cap.v1', 'ABSOLUTE_POLICY_CAP', {
        ...ENERGY_QUANTITY,
        maximum: 10000,
      }),
    ],
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'browser-local research demonstration',
      mutable_by: 'declared temporary policy fork',
    },
  },
  {
    id: 'ENERGY-CASE-PILOT-005',
    version: '1.0.0',
    name: 'Energy Case Pilot Policy',
    description: 'Controlled pilot research policy requiring signed evidence and L2 assurance, then comparing evidence backing, policy-owned assurance capacity, modeled resource context, and an absolute cap.',
    admission_rules: [
      rule('energy.pilot.positive-surplus.v1', 'POSITIVE_SURPLUS'),
      rule('energy.pilot.zero-blockers.v1', 'ZERO_BLOCKERS'),
      rule('energy.pilot.signed-evidence.v1', 'SIGNED_EVIDENCE'),
      rule('energy.pilot.minimum-provenance.v1', 'MIN_PROVENANCE', { minimum: 'L2' }),
    ],
    quantity_rules: [
      rule('energy.pilot.evidence-capacity.v1', 'EVIDENCE_BACKED_CAPACITY', {
        ...ENERGY_QUANTITY,
        rate: 1,
      }),
      rule('energy.pilot.provenance-capacity.v1', 'PROVENANCE_POLICY_CAPACITY', {
        ...ENERGY_QUANTITY,
        source_calculator_id: 'EVIDENCE_BACKED_CAPACITY',
        capacity_multiplier_by_level: PROVENANCE_MULTIPLIERS,
      }),
      rule('energy.pilot.resource-context.v1', 'RESOURCE_CONTEXT_CAPACITY', {
        ...ENERGY_QUANTITY,
        context_type: 'resource_model',
        value_path: 'values.annual_ac_kwh',
        days_per_year: 365,
        rate: 1,
        capacity_multiplier: 1,
      }),
      rule('energy.pilot.absolute-cap.v1', 'ABSOLUTE_POLICY_CAP', {
        ...ENERGY_QUANTITY,
        maximum: 2500,
      }),
    ],
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'named pilot policy authority',
      mutable_by: 'governed policy registry',
    },
  },
  {
    id: 'ENERGY-CASE-STRICT-006',
    version: '1.0.0',
    name: 'Externally Corroborated Energy Case Policy',
    description: 'Strict research policy requiring L4 externally corroborated assurance before comparing evidence, policy-owned assurance capacity, modeled resource context, and an absolute cap.',
    admission_rules: [
      rule('energy.strict.positive-surplus.v1', 'POSITIVE_SURPLUS'),
      rule('energy.strict.zero-blockers.v1', 'ZERO_BLOCKERS'),
      rule('energy.strict.signed-evidence.v1', 'SIGNED_EVIDENCE'),
      rule('energy.strict.minimum-provenance.v1', 'MIN_PROVENANCE', { minimum: 'L4' }),
      rule('energy.strict.external-corroboration.v1', 'EXTERNAL_CORROBORATION'),
    ],
    quantity_rules: [
      rule('energy.strict.evidence-capacity.v1', 'EVIDENCE_BACKED_CAPACITY', {
        ...ENERGY_QUANTITY,
        rate: 1,
      }),
      rule('energy.strict.provenance-capacity.v1', 'PROVENANCE_POLICY_CAPACITY', {
        ...ENERGY_QUANTITY,
        source_calculator_id: 'EVIDENCE_BACKED_CAPACITY',
        capacity_multiplier_by_level: PROVENANCE_MULTIPLIERS,
      }),
      rule('energy.strict.resource-context.v1', 'RESOURCE_CONTEXT_CAPACITY', {
        ...ENERGY_QUANTITY,
        context_type: 'resource_model',
        value_path: 'values.annual_ac_kwh',
        days_per_year: 365,
        rate: 1,
        capacity_multiplier: 1,
      }),
      rule('energy.strict.absolute-cap.v1', 'ABSOLUTE_POLICY_CAP', {
        ...ENERGY_QUANTITY,
        maximum: 50000,
      }),
    ],
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'production-candidate research policy authority',
      mutable_by: 'governed policy registry after audit',
    },
  },
]);

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function plainObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return value;
}

function normalizeRule(value, field) {
  plainObject(value, field);
  return {
    rule_id: requiredText(value.rule_id, `${field}.rule_id`),
    calculator_id: requiredText(value.calculator_id, `${field}.calculator_id`),
    parameters: { ...(value.parameters == null ? {} : plainObject(value.parameters, `${field}.parameters`)) },
  };
}

function normalizeRuleList(value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} must be a non-empty array`);
  }
  const rules = value.map((item, index) => normalizeRule(item, `${field}[${index}]`));
  const ruleIds = new Set();
  for (const item of rules) {
    if (ruleIds.has(item.rule_id)) throw new Error(`duplicate policy rule_id: ${item.rule_id}`);
    ruleIds.add(item.rule_id);
  }
  return rules;
}

export function casePolicyManifestBody(policy) {
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) {
    throw new Error('case policy is required');
  }
  if (policy.schema != null && policy.schema !== CASE_POLICY_MANIFEST_SCHEMA) {
    throw new Error(`case policy schema must be ${CASE_POLICY_MANIFEST_SCHEMA}`);
  }
  const settlement = plainObject(policy.settlement, 'settlement');
  const governance = plainObject(policy.governance, 'governance');
  return {
    schema: CASE_POLICY_MANIFEST_SCHEMA,
    id: requiredText(policy.id, 'id'),
    version: requiredText(policy.version, 'version'),
    name: requiredText(policy.name, 'name'),
    description: requiredText(policy.description, 'description'),
    admission_rules: normalizeRuleList(policy.admission_rules, 'admission_rules'),
    quantity_rules: normalizeRuleList(policy.quantity_rules, 'quantity_rules'),
    settlement: {
      explicit_capacity_required: Boolean(settlement.explicit_capacity_required),
      legal_redemption_not_implied: Boolean(settlement.legal_redemption_not_implied),
    },
    governance: {
      authority: governance.authority == null ? null : requiredText(governance.authority, 'governance.authority'),
      mutable_by: governance.mutable_by == null ? null : requiredText(governance.mutable_by, 'governance.mutable_by'),
    },
  };
}

export function casePolicyById(id) {
  const policy = BUILTIN_CASE_POLICIES.find((item) => item.id === id);
  return policy ? casePolicyManifestBody(policy) : null;
}

export async function hashCasePolicyManifest(policy) {
  return sha256Hex(stableStringify(casePolicyManifestBody(policy)));
}

import { caseManifestBody, hashCaseManifest } from './case.js';
import { casePolicyManifestBody, hashCasePolicyManifest } from './casePolicies.js';
import { constraintEvaluationBody, createCalculatorRegistry } from './constraints.js';
import { contextManifestBody, hashContextManifest } from './context.js';
import { verifyEvidenceEnvelopeHash } from './portableEvidence.js';
import { round, sha256Hex, stableStringify } from './stable.js';

export const DECISION_RESULT_SCHEMA = 'solarpunk.constraint.decision_result.v1';

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function sha256(value, field, nullable = false) {
  if (value == null && nullable) return null;
  const text = requiredText(value, field);
  if (!/^[a-f0-9]{64}$/.test(text)) {
    throw new Error(`${field} must be a lowercase SHA-256 hex string`);
  }
  return text;
}

function stringArray(value, field) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return value.map((item) => requiredText(item, `${field} item`));
}

function normalizeContextRefs(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error('context_refs must be an array');
  return value.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`context_refs[${index}] must be an object`);
    }
    return {
      context_id: requiredText(item.context_id, `context_refs[${index}].context_id`),
      context_hash: sha256(item.context_hash, `context_refs[${index}].context_hash`),
    };
  }).sort((a, b) => `${a.context_id}:${a.context_hash}`.localeCompare(`${b.context_id}:${b.context_hash}`));
}

function normalizeEvaluations(value, field, expectedClass) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return value.map((item, index) => {
    const evaluation = constraintEvaluationBody(item);
    if (evaluation.constraint_class !== expectedClass) {
      throw new Error(`${field}[${index}] must be ${expectedClass}`);
    }
    return evaluation;
  });
}

export function assertComparableCapacityUnits(evaluations) {
  const normalized = normalizeEvaluations(evaluations, 'capacity evaluations', 'QUANTITY_CEILING')
    .filter((item) => item.status !== 'NOT_APPLICABLE');
  if (!normalized.length) throw new Error('at least one applicable quantity ceiling is required');
  const unit = normalized[0].unit;
  const quantityDecimals = normalized[0].quantity_decimals;
  for (const evaluation of normalized.slice(1)) {
    if (evaluation.unit !== unit) {
      throw new Error(`quantity ceiling unit mismatch: ${unit} vs ${evaluation.unit}`);
    }
    if (evaluation.quantity_decimals !== quantityDecimals) {
      throw new Error(
        `quantity ceiling decimal mismatch: ${quantityDecimals} vs ${evaluation.quantity_decimals}`,
      );
    }
  }
  return { unit, quantity_decimals: quantityDecimals, evaluations: normalized };
}

function decisionHashBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('decision result is required');
  }
  if (value.schema != null && value.schema !== DECISION_RESULT_SCHEMA) {
    throw new Error(`decision result schema must be ${DECISION_RESULT_SCHEMA}`);
  }
  const decision = requiredText(value.decision, 'decision');
  if (!['BLOCKED', 'ADMIT_WITH_LIMIT'].includes(decision)) {
    throw new Error(`unknown decision: ${decision}`);
  }
  const admissionValue = value.admission;
  if (!admissionValue || typeof admissionValue !== 'object' || Array.isArray(admissionValue)) {
    throw new Error('admission is required');
  }
  const admissionResult = requiredText(admissionValue.result, 'admission.result');
  if (!['PASS', 'BLOCK'].includes(admissionResult)) {
    throw new Error(`unknown admission result: ${admissionResult}`);
  }
  const admissionEvaluations = normalizeEvaluations(
    admissionValue.evaluations ?? [],
    'admission.evaluations',
    'ADMISSION_GATE',
  );
  const blockingRules = [...new Set(stringArray(admissionValue.blocking_rules, 'admission.blocking_rules'))];

  const capacityValue = value.capacity;
  if (!capacityValue || typeof capacityValue !== 'object' || Array.isArray(capacityValue)) {
    throw new Error('capacity is required');
  }
  const capacityEvaluated = Boolean(capacityValue.evaluated);
  const capacityEvaluations = normalizeEvaluations(
    capacityValue.evaluations ?? [],
    'capacity.evaluations',
    'QUANTITY_CEILING',
  );
  const bindingConstraints = [...new Set(stringArray(
    capacityValue.binding_constraints,
    'capacity.binding_constraints',
  ))];

  let unit = capacityValue.unit == null ? null : requiredText(capacityValue.unit, 'capacity.unit');
  let quantityDecimals = capacityValue.quantity_decimals == null
    ? null
    : Number(capacityValue.quantity_decimals);
  let admittedMaximum = Number(capacityValue.admitted_maximum ?? 0);
  if (!Number.isFinite(admittedMaximum) || admittedMaximum < 0) {
    throw new Error('capacity.admitted_maximum must be a non-negative finite number');
  }
  admittedMaximum = round(admittedMaximum);

  if (decision === 'BLOCKED') {
    if (admissionResult !== 'BLOCK' || blockingRules.length === 0) {
      throw new Error('BLOCKED decision requires blocked admission and at least one blocking rule');
    }
    if (capacityEvaluated || capacityEvaluations.length > 0 || bindingConstraints.length > 0 || admittedMaximum !== 0) {
      throw new Error('BLOCKED decision cannot carry evaluated capacity or binding constraints');
    }
    unit = null;
    quantityDecimals = null;
  } else {
    if (admissionResult !== 'PASS' || blockingRules.length > 0) {
      throw new Error('ADMIT_WITH_LIMIT decision requires passing admission with no blocking rules');
    }
    if (!capacityEvaluated) throw new Error('ADMIT_WITH_LIMIT decision requires capacity evaluation');
    const comparable = assertComparableCapacityUnits(capacityEvaluations);
    unit = requiredText(unit ?? comparable.unit, 'capacity.unit');
    quantityDecimals = Number(quantityDecimals ?? comparable.quantity_decimals);
    if (unit !== comparable.unit || quantityDecimals !== comparable.quantity_decimals) {
      throw new Error('capacity summary unit/decimals must match quantity evaluations');
    }
    if (!bindingConstraints.length) {
      throw new Error('ADMIT_WITH_LIMIT decision requires at least one binding constraint');
    }
  }

  return {
    schema: DECISION_RESULT_SCHEMA,
    case_id: requiredText(value.case_id, 'case_id'),
    case_hash: sha256(value.case_hash, 'case_hash', true),
    policy_id: requiredText(value.policy_id, 'policy_id'),
    policy_version: requiredText(value.policy_version, 'policy_version'),
    policy_manifest_hash: sha256(value.policy_manifest_hash, 'policy_manifest_hash'),
    evidence_hashes: [...new Set((value.evidence_hashes ?? []).map((item, index) => (
      sha256(item, `evidence_hashes[${index}]`)
    )))].sort(),
    context_refs: normalizeContextRefs(value.context_refs),
    admission: {
      result: admissionResult,
      evaluations: admissionEvaluations,
      blocking_rules: blockingRules,
    },
    capacity: {
      evaluated: capacityEvaluated,
      unit,
      quantity_decimals: quantityDecimals,
      evaluations: capacityEvaluations,
      admitted_maximum: admittedMaximum,
      binding_constraints: bindingConstraints,
    },
    decision,
    warnings: stringArray(value.warnings, 'warnings'),
    boundary: requiredText(value.boundary, 'boundary'),
  };
}

export async function hashDecisionResultBody(value) {
  return sha256Hex(stableStringify(decisionHashBody(value)));
}

export async function buildDecisionResult(value) {
  const body = decisionHashBody(value);
  return {
    ...body,
    decision_id: await sha256Hex(stableStringify(body)),
  };
}

export function decisionResultBody(value) {
  const body = decisionHashBody(value);
  return {
    ...body,
    decision_id: sha256(value.decision_id, 'decision_id'),
  };
}

function lookup(collection, key) {
  if (collection instanceof Map) return collection.get(key);
  if (collection && typeof collection === 'object') return collection[key];
  return undefined;
}

function uniqueWarnings(evaluations, policy) {
  const warnings = evaluations.flatMap((item) => item.warnings || []);
  if (policy.settlement?.legal_redemption_not_implied) {
    warnings.push('Policy evaluation does not create legal redemption rights or prove named settlement capacity.');
  }
  return [...new Set(warnings)];
}

async function resolveContexts(caseManifest, contextsById) {
  const contexts = [];
  for (const contextId of caseManifest.context_refs) {
    const raw = lookup(contextsById, contextId);
    if (!raw) throw new Error(`missing required context: ${contextId}`);
    const context = contextManifestBody(raw);
    const expectedHash = await hashContextManifest(context);
    if (context.context_hash !== expectedHash) {
      throw new Error(`context hash mismatch for ${contextId}`);
    }
    contexts.push(context);
  }
  return contexts;
}

async function resolveEvidence(caseManifest, evidenceByHash) {
  if (!caseManifest.evidence_refs.length) throw new Error('case requires at least one evidence_ref');
  const resolved = [];
  for (const evidenceHash of caseManifest.evidence_refs) {
    const evidence = lookup(evidenceByHash, evidenceHash);
    if (!evidence) throw new Error(`missing required evidence: ${evidenceHash}`);
    if (evidence.evidence_hash !== evidenceHash) {
      throw new Error(`evidence hash identity mismatch for ${evidenceHash}`);
    }
    await verifyEvidenceEnvelopeHash(evidence);
    resolved.push(evidence);
  }
  return resolved;
}

function resolveProvenance({ evidenceList, provenance, provenanceByEvidence }) {
  if (provenance?.level) return provenance;
  if (evidenceList.length !== 1) {
    throw new Error('explicit provenance is required when a case contains multiple evidence envelopes');
  }
  const resolved = lookup(provenanceByEvidence, evidenceList[0].evidence_hash);
  if (!resolved?.level) throw new Error(`missing provenance decision for ${evidenceList[0].evidence_hash}`);
  return resolved;
}

export async function evaluateCaseDecision({
  caseManifest: caseInput,
  evidenceByHash,
  contextsById,
  provenance = null,
  provenanceByEvidence = null,
  policy: policyInput,
  calculatorRegistry = createCalculatorRegistry(),
}) {
  const caseManifest = caseManifestBody(caseInput);
  const caseHash = await hashCaseManifest(caseManifest);
  const policy = casePolicyManifestBody(policyInput);
  const policyManifestHash = await hashCasePolicyManifest(policy);
  const evidenceList = await resolveEvidence(caseManifest, evidenceByHash);
  const resolvedProvenance = resolveProvenance({ evidenceList, provenance, provenanceByEvidence });
  const contexts = await resolveContexts(caseManifest, contextsById);
  const evidence = evidenceList.length === 1 ? evidenceList[0] : null;

  const admissionEvaluations = [];
  for (const rule of policy.admission_rules) {
    admissionEvaluations.push(await calculatorRegistry.evaluateRule({
      rule,
      caseManifest,
      evidence,
      evidenceList,
      provenance: resolvedProvenance,
      contexts,
      policy,
      priorEvaluations: admissionEvaluations,
    }));
  }

  const blockingRules = admissionEvaluations
    .filter((item) => item.status === 'BLOCK')
    .map((item) => item.calculator_id);

  if (blockingRules.length > 0) {
    return buildDecisionResult({
      case_id: caseManifest.case_id,
      case_hash: caseHash,
      policy_id: policy.id,
      policy_version: policy.version,
      policy_manifest_hash: policyManifestHash,
      evidence_hashes: evidenceList.map((item) => item.evidence_hash),
      context_refs: contexts.map((item) => ({
        context_id: item.context_id,
        context_hash: item.context_hash,
      })),
      admission: {
        result: 'BLOCK',
        evaluations: admissionEvaluations,
        blocking_rules: blockingRules,
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
      warnings: uniqueWarnings(admissionEvaluations, policy),
      boundary: 'Research decision under declared evidence, context, and policy inputs; not legal issuance authority.',
    });
  }

  const capacityEvaluations = [];
  for (const rule of policy.quantity_rules) {
    capacityEvaluations.push(await calculatorRegistry.evaluateRule({
      rule,
      caseManifest,
      evidence,
      evidenceList,
      provenance: resolvedProvenance,
      contexts,
      policy,
      priorEvaluations: capacityEvaluations,
    }));
  }

  const comparable = assertComparableCapacityUnits(capacityEvaluations);
  const admittedMaximum = Math.min(...comparable.evaluations.map((item) => Number(item.capacity)));
  const canonicalMaximum = round(admittedMaximum);
  const bindingConstraints = comparable.evaluations
    .filter((item) => Number(item.capacity) === canonicalMaximum)
    .map((item) => item.calculator_id);

  return buildDecisionResult({
    case_id: caseManifest.case_id,
    case_hash: caseHash,
    policy_id: policy.id,
    policy_version: policy.version,
    policy_manifest_hash: policyManifestHash,
    evidence_hashes: evidenceList.map((item) => item.evidence_hash),
    context_refs: contexts.map((item) => ({
      context_id: item.context_id,
      context_hash: item.context_hash,
    })),
    admission: {
      result: 'PASS',
      evaluations: admissionEvaluations,
      blocking_rules: [],
    },
    capacity: {
      evaluated: true,
      unit: comparable.unit,
      quantity_decimals: comparable.quantity_decimals,
      evaluations: capacityEvaluations,
      admitted_maximum: canonicalMaximum,
      binding_constraints: bindingConstraints,
    },
    decision: 'ADMIT_WITH_LIMIT',
    warnings: uniqueWarnings([...admissionEvaluations, ...capacityEvaluations], policy),
    boundary: 'Research decision under declared evidence, modeled context, and policy inputs; not legal issuance authority or proof of settlement capacity.',
  });
}

import { decisionResultBody } from './decision.js';
import { canonicalTimestamp } from './stable.js';

export const DECISION_RECEIPT_SCHEMA = 'solarpunk.constraint.decision_receipt.v1';

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function runtimeBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('runtime is required');
  }
  return {
    package: requiredText(value.package, 'runtime.package'),
    package_version: value.package_version == null
      ? null
      : requiredText(value.package_version, 'runtime.package_version'),
    source_revision: requiredText(value.source_revision, 'runtime.source_revision'),
  };
}

export function buildDecisionReceipt({
  decision,
  evaluated_at = new Date().toISOString(),
  runtime,
  data_boundary,
  raw_evidence_included = false,
}) {
  const normalized = decisionResultBody(decision);
  const evaluations = [
    ...normalized.admission.evaluations,
    ...normalized.capacity.evaluations,
  ];
  return {
    schema: DECISION_RECEIPT_SCHEMA,
    decision_id: normalized.decision_id,
    case_id: normalized.case_id,
    evaluated_at: canonicalTimestamp(evaluated_at, 'evaluated_at'),
    policy: {
      id: normalized.policy_id,
      version: normalized.policy_version,
      manifest_hash: normalized.policy_manifest_hash,
    },
    evidence: normalized.evidence_hashes.map((hash) => ({
      hash,
      raw_included: Boolean(raw_evidence_included),
    })),
    contexts: normalized.context_refs.map((context) => ({
      id: context.context_id,
      hash: context.context_hash,
    })),
    runtime: runtimeBody(runtime),
    evaluated_rules: evaluations.map((item) => ({
      evaluation_id: item.evaluation_id,
      calculator_id: item.calculator_id,
      calculator_version: item.calculator_version,
      policy_rule_id: item.policy_rule_id,
      constraint_class: item.constraint_class,
      status: item.status,
    })),
    blocking_rules: [...normalized.admission.blocking_rules],
    binding_constraints: [...normalized.capacity.binding_constraints],
    result: normalized.decision,
    data_boundary: requiredText(data_boundary, 'data_boundary'),
  };
}

export function receiptSummary(receipt) {
  if (!receipt || receipt.schema !== DECISION_RECEIPT_SCHEMA) {
    throw new Error(`receipt schema must be ${DECISION_RECEIPT_SCHEMA}`);
  }
  return {
    decision_id: requiredText(receipt.decision_id, 'decision_id'),
    case_id: requiredText(receipt.case_id, 'case_id'),
    policy: `${requiredText(receipt.policy?.id, 'policy.id')}@${requiredText(receipt.policy?.version, 'policy.version')}`,
    result: requiredText(receipt.result, 'result'),
    blocking_rules: Array.isArray(receipt.blocking_rules) ? [...receipt.blocking_rules] : [],
    binding_constraints: Array.isArray(receipt.binding_constraints) ? [...receipt.binding_constraints] : [],
    evaluated_at: canonicalTimestamp(receipt.evaluated_at, 'evaluated_at'),
  };
}

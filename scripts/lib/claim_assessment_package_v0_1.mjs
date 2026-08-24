import { sha256Hex, stableStringify } from '../../packages/constraint-core/src/stable.js';

export const CLAIM_ASSESSMENT_PACKAGE_SCHEMA = 'policylab.claim_assessment_package.v0.1';
export const ENERGY_PROFILE_ID = 'policylab.energy_linked_claim.v0';

export function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : [values])
    .map((value) => String(value ?? '').trim())
    .filter(Boolean))];
}

export function calculatorIds(value) {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return uniqueStrings(values.map((item) => {
    if (typeof item === 'string') return item;
    if (!item || typeof item !== 'object') return String(item ?? '');
    return item.calculator_id || item.rule_id || item.ruleId || item.id || item.code || item.name || '';
  }));
}

export function externalReading(decision) {
  if (decision === 'ADMIT_WITH_LIMIT') return 'ADMITTED_WITH_LIMIT_UNDER_POLICY';
  if (decision === 'ADMIT') return 'ADMITTED_UNDER_POLICY';
  if (decision === 'BLOCKED') return 'BLOCKED_UNDER_POLICY';
  return `CANONICAL_${String(decision || 'UNKNOWN')}`;
}

export function normalizeRuleEvaluation(value) {
  const evaluation = value || {};
  return {
    evaluation_id: String(evaluation.evaluation_id || ''),
    calculator_id: String(evaluation.calculator_id || ''),
    calculator_version: String(evaluation.calculator_version || ''),
    constraint_class: String(evaluation.constraint_class || ''),
    policy_rule_id: String(evaluation.policy_rule_id || ''),
    status: String(evaluation.status || ''),
    unit: evaluation.unit ?? null,
    quantity_decimals: evaluation.quantity_decimals ?? null,
    capacity: evaluation.capacity ?? null,
    input_refs: Array.isArray(evaluation.input_refs) ? evaluation.input_refs : [],
    observed_inputs: evaluation.observed_inputs && typeof evaluation.observed_inputs === 'object' ? evaluation.observed_inputs : {},
    parameters: evaluation.parameters && typeof evaluation.parameters === 'object' ? evaluation.parameters : {},
    assumptions: Array.isArray(evaluation.assumptions) ? evaluation.assumptions : [],
    warnings: Array.isArray(evaluation.warnings) ? evaluation.warnings : [],
    explanation: String(evaluation.explanation || ''),
    boundary: String(evaluation.boundary || ''),
  };
}

export function assessmentIdentityBody(pkg) {
  return {
    schema: pkg.schema,
    profile_id: pkg.profile?.id,
    claim: {
      claim_id: pkg.claim?.claim_id,
      case_id: pkg.claim?.case_id,
      request_mode: pkg.claim?.request_mode,
      requested_quantity: pkg.claim?.requested_quantity ?? null,
      canonical_utc: pkg.claim?.period?.canonical_utc,
    },
    evidence: {
      evidence_hash: pkg.evidence?.evidence_hash,
      assurance: pkg.evidence?.assurance,
    },
    evaluations: (pkg.evaluations || []).map((evaluation) => ({
      policy_id: evaluation.policy?.id,
      policy_version: evaluation.policy?.version ?? null,
      decision: evaluation.decision,
      decision_id: evaluation.decision_id,
      supported_quantity: evaluation.supported_quantity,
      binding_calculators: evaluation.binding_calculators || [],
      blocking_calculators: evaluation.blocking_calculators || [],
      rule_evaluation_ids: (evaluation.rule_evaluations || []).map((item) => item.evaluation_id),
    })),
    settlement: pkg.settlement ?? null,
  };
}

export async function computeAssessmentId(pkg) {
  return sha256Hex(assessmentIdentityBody(pkg));
}

export function packageContentBody(pkg) {
  const { package_content_id: _ignored, ...body } = pkg;
  return body;
}

export async function computePackageContentId(pkg) {
  return sha256Hex(packageContentBody(pkg));
}

function requireObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${field} must be an object`);
  return value;
}

function requireText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function requireStringArray(value, field) {
  if (!Array.isArray(value) || value.some((item) => !String(item ?? '').trim())) throw new Error(`${field} must be an array of non-empty strings`);
}

function requireSha256(value, field) {
  if (!/^[a-f0-9]{64}$/.test(String(value || ''))) throw new Error(`${field} must be a lowercase SHA-256 hex string`);
}

export function validatePackageShape(pkg) {
  requireObject(pkg, 'package');
  if (pkg.schema !== CLAIM_ASSESSMENT_PACKAGE_SCHEMA) throw new Error(`package.schema must be ${CLAIM_ASSESSMENT_PACKAGE_SCHEMA}`);
  requireSha256(pkg.assessment_id, 'package.assessment_id');
  requireSha256(pkg.package_content_id, 'package.package_content_id');

  requireObject(pkg.profile, 'package.profile');
  if (pkg.profile.id !== ENERGY_PROFILE_ID) throw new Error(`package.profile.id must be ${ENERGY_PROFILE_ID}`);
  requireText(pkg.profile.domain, 'package.profile.domain');
  requireText(pkg.profile.claim_kind, 'package.profile.claim_kind');
  requireObject(pkg.profile.unit_mapping, 'package.profile.unit_mapping');
  requireText(pkg.profile.unit_mapping.source_unit, 'package.profile.unit_mapping.source_unit');
  requireText(pkg.profile.unit_mapping.claim_unit, 'package.profile.unit_mapping.claim_unit');
  if (!Number.isFinite(Number(pkg.profile.unit_mapping.evidence_backed_rate))) throw new Error('package.profile.unit_mapping.evidence_backed_rate must be numeric');
  requireText(pkg.profile.unit_mapping.calculator_id, 'package.profile.unit_mapping.calculator_id');
  requireText(pkg.profile.unit_mapping.interpretation, 'package.profile.unit_mapping.interpretation');

  requireObject(pkg.claim, 'package.claim');
  requireText(pkg.claim.claim_id, 'package.claim.claim_id');
  requireText(pkg.claim.case_id, 'package.claim.case_id');
  requireText(pkg.claim.subject, 'package.claim.subject');
  requireText(pkg.claim.question, 'package.claim.question');
  requireText(pkg.claim.request_mode, 'package.claim.request_mode');
  if (pkg.claim.requested_quantity != null && !Number.isFinite(Number(pkg.claim.requested_quantity))) throw new Error('package.claim.requested_quantity must be numeric or null');
  requireObject(pkg.claim.period, 'package.claim.period');
  requireObject(pkg.claim.period.local, 'package.claim.period.local');
  requireText(pkg.claim.period.local.start_date, 'package.claim.period.local.start_date');
  requireText(pkg.claim.period.local.end_date, 'package.claim.period.local.end_date');
  requireText(pkg.claim.period.local.timezone_basis, 'package.claim.period.local.timezone_basis');
  requireObject(pkg.claim.period.canonical_utc, 'package.claim.period.canonical_utc');
  requireText(pkg.claim.period.canonical_utc.start, 'package.claim.period.canonical_utc.start');
  requireText(pkg.claim.period.canonical_utc.end, 'package.claim.period.canonical_utc.end');

  requireObject(pkg.evidence, 'package.evidence');
  requireSha256(pkg.evidence.evidence_hash, 'package.evidence.evidence_hash');
  if (!/^L[0-4]$/.test(String(pkg.evidence.assurance || ''))) throw new Error('package.evidence.assurance must be L0-L4');
  requireText(pkg.evidence.source_holder_confirmation, 'package.evidence.source_holder_confirmation');
  if (!Number.isInteger(pkg.evidence.interval_count) || pkg.evidence.interval_count < 1) throw new Error('package.evidence.interval_count must be a positive integer');
  requireObject(pkg.evidence.source, 'package.evidence.source');
  requireSha256(pkg.evidence.source.archive_sha256, 'package.evidence.source.archive_sha256');
  if (!Number.isInteger(pkg.evidence.source.archive_bytes) || pkg.evidence.source.archive_bytes < 1) throw new Error('package.evidence.source.archive_bytes must be positive');
  requireObject(pkg.evidence.eligible_quantity, 'package.evidence.eligible_quantity');
  if (!Number.isFinite(Number(pkg.evidence.eligible_quantity.value))) throw new Error('package.evidence.eligible_quantity.value must be numeric');
  requireText(pkg.evidence.eligible_quantity.unit, 'package.evidence.eligible_quantity.unit');
  requireText(pkg.evidence.eligible_quantity.semantics, 'package.evidence.eligible_quantity.semantics');
  if (!Array.isArray(pkg.evidence.warnings)) throw new Error('package.evidence.warnings must be an array');
  for (const [index, warning] of pkg.evidence.warnings.entries()) {
    requireObject(warning, `package.evidence.warnings[${index}]`);
    requireText(warning.code, `package.evidence.warnings[${index}].code`);
    requireText(warning.detail, `package.evidence.warnings[${index}].detail`);
  }

  if (!Array.isArray(pkg.evaluations) || pkg.evaluations.length < 1) throw new Error('package.evaluations must be a non-empty array');
  for (const [index, evaluation] of pkg.evaluations.entries()) {
    requireObject(evaluation, `package.evaluations[${index}]`);
    requireObject(evaluation.policy, `package.evaluations[${index}].policy`);
    requireText(evaluation.policy.id, `package.evaluations[${index}].policy.id`);
    requireText(evaluation.policy.name, `package.evaluations[${index}].policy.name`);
    requireText(evaluation.policy.description, `package.evaluations[${index}].policy.description`);
    requireObject(evaluation.policy.governance, `package.evaluations[${index}].policy.governance`);
    requireText(evaluation.decision, `package.evaluations[${index}].decision`);
    requireText(evaluation.external_reading, `package.evaluations[${index}].external_reading`);
    requireSha256(evaluation.decision_id, `package.evaluations[${index}].decision_id`);
    requireSha256(evaluation.policy_manifest_hash, `package.evaluations[${index}].policy_manifest_hash`);
    requireStringArray(evaluation.binding_calculators, `package.evaluations[${index}].binding_calculators`);
    requireStringArray(evaluation.blocking_calculators, `package.evaluations[${index}].blocking_calculators`);
    if (!Array.isArray(evaluation.rule_evaluations) || evaluation.rule_evaluations.length < 1) throw new Error(`package.evaluations[${index}].rule_evaluations must be non-empty`);
    for (const [ruleIndex, rule] of evaluation.rule_evaluations.entries()) {
      requireObject(rule, `package.evaluations[${index}].rule_evaluations[${ruleIndex}]`);
      requireSha256(rule.evaluation_id, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].evaluation_id`);
      requireText(rule.calculator_id, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].calculator_id`);
      requireText(rule.policy_rule_id, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].policy_rule_id`);
      requireText(rule.status, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].status`);
      requireText(rule.explanation, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].explanation`);
      requireText(rule.boundary, `package.evaluations[${index}].rule_evaluations[${ruleIndex}].boundary`);
    }
    if (evaluation.supported_quantity != null) {
      requireObject(evaluation.supported_quantity, `package.evaluations[${index}].supported_quantity`);
      if (!Number.isFinite(Number(evaluation.supported_quantity.value))) throw new Error(`package.evaluations[${index}].supported_quantity.value must be numeric`);
      requireText(evaluation.supported_quantity.unit, `package.evaluations[${index}].supported_quantity.unit`);
    }
  }

  if (pkg.settlement != null) {
    requireObject(pkg.settlement, 'package.settlement');
    requireText(pkg.settlement.result, 'package.settlement.result');
    if (!Number.isFinite(Number(pkg.settlement.covered_quantity)) || !Number.isFinite(Number(pkg.settlement.shortfall_quantity))) throw new Error('package.settlement quantities must be numeric');
    requireText(pkg.settlement.unit, 'package.settlement.unit');
  }

  requireObject(pkg.verification, 'package.verification');
  requireObject(pkg.verification.assessment_identity, 'package.verification.assessment_identity');
  requireObject(pkg.verification.package_content_identity, 'package.verification.package_content_identity');
  if (pkg.verification.assessment_identity.algorithm !== 'SHA-256' || pkg.verification.package_content_identity.algorithm !== 'SHA-256') throw new Error('package identity algorithms must be SHA-256');

  requireStringArray(pkg.non_claims, 'package.non_claims');
  if (pkg.extensions != null) {
    requireObject(pkg.extensions, 'package.extensions');
    if (pkg.extensions.research_projection != null) {
      requireObject(pkg.extensions.research_projection, 'package.extensions.research_projection');
      requireSha256(pkg.extensions.research_projection.assessment_id, 'package.extensions.research_projection.assessment_id');
    }
    if (pkg.extensions.delivery_verification != null) requireObject(pkg.extensions.delivery_verification, 'package.extensions.delivery_verification');
  }
  return true;
}

function quantityText(quantity) {
  return quantity ? `${quantity.value} ${quantity.unit}` : 'none under this policy';
}

function jsonInline(value) {
  return `\`${JSON.stringify(value)}\``;
}

export function renderClaimAssessmentMarkdown(pkg) {
  validatePackageShape(pkg);
  const lines = [];
  lines.push(`# Claim Assessment — ${pkg.claim.case_id}`);
  lines.push('');
  lines.push('## Question');
  lines.push('');
  lines.push(pkg.claim.question);
  lines.push('');
  lines.push(`**Local assessment period:** ${pkg.claim.period.local.start_date} → ${pkg.claim.period.local.end_date} (${pkg.claim.period.local.timezone_basis})`);
  lines.push('');
  lines.push('## Results by policy');
  lines.push('');
  lines.push('| Policy | Scope | Result | Maximum policy-defined quantity |');
  lines.push('|---|---|---|---:|');
  for (const evaluation of pkg.evaluations) {
    lines.push(`| **${evaluation.policy.name}** | ${evaluation.policy.description} | **${evaluation.external_reading}** | ${quantityText(evaluation.supported_quantity)} |`);
  }
  lines.push('');
  for (const evaluation of pkg.evaluations) {
    const blocked = evaluation.rule_evaluations.filter((item) => item.status === 'BLOCK');
    const binding = evaluation.rule_evaluations.filter((item) => evaluation.binding_calculators.includes(item.calculator_id));
    lines.push(`### ${evaluation.policy.name}`);
    lines.push('');
    lines.push(`Canonical policy result: \`${evaluation.decision}\` under \`${evaluation.policy.id}\` v${evaluation.policy.version || 'unspecified'}.`);
    if (evaluation.supported_quantity) {
      lines.push('');
      lines.push(`Maximum admitted quantity under this policy: **${quantityText(evaluation.supported_quantity)}**.`);
    }
    if (binding.length) {
      lines.push('');
      lines.push('What bound the quantity:');
      lines.push('');
      for (const item of binding) lines.push(`- **${item.calculator_id}:** ${item.explanation} ${item.boundary}`);
    }
    if (blocked.length) {
      lines.push('');
      lines.push('Why this policy blocked the claim:');
      lines.push('');
      for (const item of blocked) {
        lines.push(`- **${item.calculator_id}:** ${item.explanation}`);
        lines.push(`  - Observed: ${jsonInline(item.observed_inputs)}`);
        if (Object.keys(item.parameters || {}).length) lines.push(`  - Policy requirement: ${jsonInline(item.parameters)}`);
        lines.push(`  - Boundary: ${item.boundary}`);
      }
    }
    lines.push('');
  }

  lines.push('## Evidence actually available');
  lines.push('');
  lines.push(`- **Assurance:** ${pkg.evidence.assurance}`);
  lines.push(`- **Source-holder confirmation:** ${pkg.evidence.source_holder_confirmation}`);
  lines.push(`- **Eligible evidence quantity:** ${quantityText(pkg.evidence.eligible_quantity)}`);
  lines.push(`- **Quantity semantics:** ${pkg.evidence.eligible_quantity.semantics}`);
  lines.push(`- **Source:** ${pkg.evidence.source.publisher} — ${pkg.evidence.source.dataset}; ${pkg.evidence.source.selected_subject}`);
  if (pkg.evidence.warnings.length) {
    lines.push('');
    lines.push('Evidence limitations:');
    lines.push('');
    for (const warning of pkg.evidence.warnings) lines.push(`- **${warning.code}:** ${warning.detail}`);
  }
  lines.push('');

  lines.push('## Unit definition');
  lines.push('');
  lines.push(`The evidence is measured/derived in **${pkg.profile.unit_mapping.source_unit}**. The policies express admitted quantity in **${pkg.profile.unit_mapping.claim_unit}**. The declared evidence-backed mapping used here is **${pkg.profile.unit_mapping.evidence_backed_rate} ${pkg.profile.unit_mapping.claim_unit} per eligible ${pkg.profile.unit_mapping.source_unit}** through \`${pkg.profile.unit_mapping.calculator_id}\`.`);
  lines.push('');
  lines.push(pkg.profile.unit_mapping.interpretation);
  lines.push('');

  lines.push('## Settlement / fulfilment');
  lines.push('');
  if (pkg.settlement) {
    lines.push(`Result: **${pkg.settlement.result}** — ${pkg.settlement.covered_quantity} ${pkg.settlement.unit} covered / ${pkg.settlement.shortfall_quantity} ${pkg.settlement.unit} shortfall.`);
    if (pkg.settlement.scenario_only) {
      lines.push('');
      lines.push('This is a declared scenario replay, not evidence of legally enforceable delivery or redemption.');
    }
  } else {
    lines.push('Not assessed in this package.');
  }
  lines.push('');

  lines.push('## Verification');
  lines.push('');
  lines.push(`- **Assessment ID:** \`${pkg.assessment_id}\` — semantic decision identity, excluding explanatory prose and run-specific delivery artifacts.`);
  lines.push(`- **Package content ID:** \`${pkg.package_content_id}\` — identity of this complete package content.`);
  lines.push(`- **Evidence hash:** \`${pkg.evidence.evidence_hash}\``);
  lines.push('');

  lines.push('## Technical appendix');
  lines.push('');
  lines.push(`- **Domain profile:** \`${pkg.profile.id}\``);
  lines.push(`- **Canonical UTC period:** ${pkg.claim.period.canonical_utc.start} → ${pkg.claim.period.canonical_utc.end}`);
  for (const evaluation of pkg.evaluations) {
    lines.push(`- **${evaluation.policy.id} decision ID:** \`${evaluation.decision_id}\``);
    lines.push(`- **${evaluation.policy.id} policy manifest hash:** \`${evaluation.policy_manifest_hash}\``);
  }
  const delivery = pkg.extensions?.delivery_verification;
  if (delivery?.capsule_id) lines.push(`- **Delivery capsule:** \`${delivery.capsule_id}\``);
  if (delivery?.capsule_verification) lines.push(`- **Closed-world decision reproduction:** ${delivery.capsule_verification.decision_reproduction}`);
  lines.push('');

  const research = pkg.extensions?.research_projection;
  if (research) {
    lines.push('### Optional research projection');
    lines.push('');
    lines.push(`Research assessment: \`${research.assessment_id}\``);
    lines.push('');
    for (const [id, status] of Object.entries(research.boundaries || {})) lines.push(`- **${id}:** ${status}`);
    lines.push('');
  }

  lines.push('### Full non-claim boundary');
  lines.push('');
  for (const item of pkg.non_claims) lines.push(`- ${item}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('This report is rendered from the machine-readable Claim Assessment Package. Canonical Policy Lab decisions are preserved; the rendering does not create source-truth, legal, regulatory, certification, commercial, or monetary authority.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

export function sameStable(a, b) {
  return stableStringify(a) === stableStringify(b);
}

import { sha256Hex, stableStringify } from '../../packages/constraint-core/src/stable.js';

export const CLAIM_ASSESSMENT_PACKAGE_SCHEMA = 'policylab.claim_assessment_package.v0';

export function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : [values])
    .map((value) => String(value ?? '').trim())
    .filter(Boolean))];
}

export function ruleIds(value) {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return uniqueStrings(values.map((item) => {
    if (typeof item === 'string') return item;
    if (!item || typeof item !== 'object') return String(item ?? '');
    return item.rule_id || item.ruleId || item.id || item.code || item.name || '';
  }));
}

export function displayStatus(decision) {
  if (decision === 'ADMIT_WITH_LIMIT') return 'SUPPORTED_WITH_LIMIT';
  if (decision === 'ADMIT') return 'SUPPORTED';
  if (decision === 'BLOCKED') return 'BLOCKED';
  return String(decision || 'UNKNOWN');
}

export function remediationForRules(rules = []) {
  const map = {
    SIGNED_EVIDENCE: 'Provide authenticated or signed evidence for the exact bounded evidence object.',
    MIN_PROVENANCE: 'Raise source assurance to the policy-required minimum through independently checkable source-holder/operator attribution or authentication.',
    EXTERNAL_CORROBORATION: 'Add an independently checkable corroborating source for the same bounded claim window.',
    POSITIVE_SURPLUS: 'Provide a bounded evidence window with positive eligible quantity under the declared quantity semantics.',
    ZERO_BLOCKERS: 'Resolve blocking evidence diagnostics without changing the source meaning.',
  };
  return uniqueStrings(ruleIds(rules).map((rule) => map[rule] || `Resolve policy requirement ${rule}.`));
}

export function packageIdentityBody(pkg) {
  return {
    schema: pkg.schema,
    claim: pkg.claim,
    evidence: pkg.evidence,
    evaluations: pkg.evaluations,
    settlement: pkg.settlement,
    verification: pkg.verification,
    next_evidence_required: pkg.next_evidence_required,
    explicit_non_claims: pkg.explicit_non_claims,
    research_projection: pkg.research_projection,
  };
}

export async function computePackageId(pkg) {
  return sha256Hex(packageIdentityBody(pkg));
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
  if (!Array.isArray(value) || value.some((item) => !String(item ?? '').trim())) {
    throw new Error(`${field} must be an array of non-empty strings`);
  }
}

export function validatePackageShape(pkg) {
  requireObject(pkg, 'package');
  if (pkg.schema !== CLAIM_ASSESSMENT_PACKAGE_SCHEMA) throw new Error(`package.schema must be ${CLAIM_ASSESSMENT_PACKAGE_SCHEMA}`);
  if (!/^[a-f0-9]{64}$/.test(String(pkg.package_id || ''))) throw new Error('package.package_id must be a lowercase SHA-256 hex string');

  requireObject(pkg.claim, 'package.claim');
  requireText(pkg.claim.claim_id, 'package.claim.claim_id');
  requireText(pkg.claim.case_id, 'package.claim.case_id');
  requireText(pkg.claim.claim_type, 'package.claim.claim_type');
  requireText(pkg.claim.subject, 'package.claim.subject');
  requireText(pkg.claim.statement, 'package.claim.statement');
  requireText(pkg.claim.request_mode, 'package.claim.request_mode');
  requireText(pkg.claim.unit, 'package.claim.unit');
  requireObject(pkg.claim.period, 'package.claim.period');
  requireText(pkg.claim.period.start, 'package.claim.period.start');
  requireText(pkg.claim.period.end, 'package.claim.period.end');
  if (pkg.claim.requested_quantity != null && !Number.isFinite(Number(pkg.claim.requested_quantity))) {
    throw new Error('package.claim.requested_quantity must be numeric or null');
  }

  requireObject(pkg.evidence, 'package.evidence');
  if (!/^[a-f0-9]{64}$/.test(String(pkg.evidence.evidence_hash || ''))) throw new Error('package.evidence.evidence_hash must be a lowercase SHA-256 hex string');
  if (!/^L[0-4]$/.test(String(pkg.evidence.assurance || ''))) throw new Error('package.evidence.assurance must be L0-L4');
  requireText(pkg.evidence.source_holder_confirmation, 'package.evidence.source_holder_confirmation');
  requireObject(pkg.evidence.source, 'package.evidence.source');
  requireObject(pkg.evidence.eligible_quantity, 'package.evidence.eligible_quantity');
  if (!Number.isFinite(Number(pkg.evidence.eligible_quantity.value))) throw new Error('package.evidence.eligible_quantity.value must be numeric');
  requireText(pkg.evidence.eligible_quantity.unit, 'package.evidence.eligible_quantity.unit');
  requireText(pkg.evidence.eligible_quantity.semantics, 'package.evidence.eligible_quantity.semantics');
  requireStringArray(pkg.evidence.warnings, 'package.evidence.warnings');

  if (!Array.isArray(pkg.evaluations) || pkg.evaluations.length === 0) throw new Error('package.evaluations must be a non-empty array');
  for (const [index, evaluation] of pkg.evaluations.entries()) {
    requireObject(evaluation, `package.evaluations[${index}]`);
    requireObject(evaluation.policy, `package.evaluations[${index}].policy`);
    requireText(evaluation.policy.id, `package.evaluations[${index}].policy.id`);
    requireText(evaluation.decision, `package.evaluations[${index}].decision`);
    requireText(evaluation.display_status, `package.evaluations[${index}].display_status`);
    if (!/^[a-f0-9]{64}$/.test(String(evaluation.decision_id || ''))) throw new Error(`package.evaluations[${index}].decision_id must be a lowercase SHA-256 hex string`);
    requireStringArray(evaluation.binding_rules, `package.evaluations[${index}].binding_rules`);
    requireStringArray(evaluation.blocking_rules, `package.evaluations[${index}].blocking_rules`);
    requireStringArray(evaluation.remediation, `package.evaluations[${index}].remediation`);
    if (evaluation.supported_quantity != null) {
      requireObject(evaluation.supported_quantity, `package.evaluations[${index}].supported_quantity`);
      if (!Number.isFinite(Number(evaluation.supported_quantity.value))) throw new Error(`package.evaluations[${index}].supported_quantity.value must be numeric`);
      requireText(evaluation.supported_quantity.unit, `package.evaluations[${index}].supported_quantity.unit`);
    }
  }

  if (pkg.settlement != null) {
    requireObject(pkg.settlement, 'package.settlement');
    requireText(pkg.settlement.result, 'package.settlement.result');
    if (!Number.isFinite(Number(pkg.settlement.covered_quantity))) throw new Error('package.settlement.covered_quantity must be numeric');
    if (!Number.isFinite(Number(pkg.settlement.shortfall_quantity))) throw new Error('package.settlement.shortfall_quantity must be numeric');
    requireText(pkg.settlement.unit, 'package.settlement.unit');
  }

  requireObject(pkg.verification, 'package.verification');
  requireObject(pkg.verification.package_identity, 'package.verification.package_identity');
  if (pkg.verification.package_identity.algorithm !== 'SHA-256') throw new Error('package.verification.package_identity.algorithm must be SHA-256');
  if (pkg.verification.package_identity.delivery_excluded_from_identity !== true) throw new Error('package.verification.package_identity.delivery_excluded_from_identity must be true');

  requireObject(pkg.next_evidence_required, 'package.next_evidence_required');
  requireStringArray(pkg.next_evidence_required.operational, 'package.next_evidence_required.operational');
  requireObject(pkg.next_evidence_required.research, 'package.next_evidence_required.research');
  for (const id of ['R1', 'R2', 'R3', 'R4']) requireStringArray(pkg.next_evidence_required.research[id], `package.next_evidence_required.research.${id}`);

  requireStringArray(pkg.explicit_non_claims, 'package.explicit_non_claims');
  requireObject(pkg.research_projection, 'package.research_projection');
  requireText(pkg.research_projection.schema, 'package.research_projection.schema');
  if (!/^[a-f0-9]{64}$/.test(String(pkg.research_projection.assessment_id || ''))) throw new Error('package.research_projection.assessment_id must be a lowercase SHA-256 hex string');

  requireObject(pkg.delivery, 'package.delivery');
  if (pkg.delivery.capsule_verification != null) requireObject(pkg.delivery.capsule_verification, 'package.delivery.capsule_verification');
  return true;
}

function quantityText(quantity) {
  if (!quantity) return 'not available';
  return `${quantity.value} ${quantity.unit}`;
}

export function renderClaimAssessmentMarkdown(pkg) {
  validatePackageShape(pkg);
  const lines = [];
  lines.push(`# Claim Assessment — ${pkg.claim.case_id}`);
  lines.push('');
  lines.push(`**Package ID:** \`${pkg.package_id}\``);
  lines.push('');
  lines.push('## What was assessed');
  lines.push('');
  lines.push(pkg.claim.statement);
  lines.push('');
  lines.push(`- **Request mode:** ${pkg.claim.request_mode}`);
  lines.push(`- **Period:** ${pkg.claim.period.start} → ${pkg.claim.period.end}`);
  lines.push(`- **Unit:** ${pkg.claim.unit}`);
  lines.push('');
  lines.push('## Evidence');
  lines.push('');
  lines.push(`- **Assurance:** ${pkg.evidence.assurance}`);
  lines.push(`- **Source-holder confirmation:** ${pkg.evidence.source_holder_confirmation}`);
  lines.push(`- **Eligible quantity:** ${quantityText(pkg.evidence.eligible_quantity)}`);
  lines.push(`- **Quantity semantics:** ${pkg.evidence.eligible_quantity.semantics}`);
  lines.push(`- **Evidence hash:** \`${pkg.evidence.evidence_hash}\``);
  lines.push('');
  if (pkg.evidence.warnings.length) {
    lines.push('### Evidence limitations');
    lines.push('');
    for (const warning of pkg.evidence.warnings) lines.push(`- ${warning}`);
    lines.push('');
  }
  lines.push('## Policy results');
  lines.push('');
  lines.push('| Policy | External reading | Canonical decision | Supportable quantity | Blocking / binding rules |');
  lines.push('|---|---|---|---:|---|');
  for (const evaluation of pkg.evaluations) {
    const rules = evaluation.blocking_rules.length ? evaluation.blocking_rules : evaluation.binding_rules;
    lines.push(`| \`${evaluation.policy.id}\` | **${evaluation.display_status}** | \`${evaluation.decision}\` | ${quantityText(evaluation.supported_quantity)} | ${rules.length ? rules.map((rule) => `\`${rule}\``).join(', ') : '—'} |`);
  }
  lines.push('');
  for (const evaluation of pkg.evaluations.filter((item) => item.remediation.length)) {
    lines.push(`### What would change ${evaluation.policy.id}`);
    lines.push('');
    for (const item of evaluation.remediation) lines.push(`- ${item}`);
    lines.push('');
  }
  lines.push('## Settlement / fulfilment');
  lines.push('');
  if (pkg.settlement) {
    lines.push(`**${pkg.settlement.result}** — ${pkg.settlement.covered_quantity} ${pkg.settlement.unit} covered / ${pkg.settlement.shortfall_quantity} ${pkg.settlement.unit} shortfall.`);
    if (pkg.settlement.scenario_only) {
      lines.push('');
      lines.push('This is a declared scenario replay, not evidence of legally enforceable delivery or redemption.');
    }
  } else {
    lines.push('Not assessed for this package.');
  }
  lines.push('');
  lines.push('## Verification');
  lines.push('');
  lines.push(`- **Research assessment:** \`${pkg.research_projection.assessment_id}\``);
  lines.push('- **Package identity:** SHA-256 over the semantic package body; delivery/run artifacts are excluded.');
  if (pkg.delivery.capsule_id) lines.push(`- **Capsule:** \`${pkg.delivery.capsule_id}\``);
  if (pkg.delivery.capsule_verification) {
    lines.push(`- **Capsule verification:** ${pkg.delivery.capsule_verification.ok ? 'PASS' : 'NOT PASS'}`);
    if (pkg.delivery.capsule_verification.decision_reproduction) lines.push(`- **Decision reproduction:** ${pkg.delivery.capsule_verification.decision_reproduction}`);
  }
  lines.push('');
  lines.push('## Explicit non-claims');
  lines.push('');
  for (const item of pkg.explicit_non_claims) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Research projection');
  lines.push('');
  for (const [id, status] of Object.entries(pkg.research_projection.boundaries || {})) lines.push(`- **${id}:** ${status}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('This report is rendered from the machine-readable Claim Assessment Package. The package preserves canonical Policy Lab decisions and does not itself create legal, regulatory, source-truth, or monetary authority.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

export function sameStable(a, b) {
  return stableStringify(a) === stableStringify(b);
}

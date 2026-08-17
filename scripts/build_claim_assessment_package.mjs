#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CLAIM_ASSESSMENT_PACKAGE_SCHEMA, computePackageId, displayStatus, remediationForRules, renderClaimAssessmentMarkdown, ruleIds, uniqueStrings, validatePackageShape } from './lib/claim_assessment_package_v0.mjs';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}
async function readJson(filePath, { optional = false } = {}) {
  try { return JSON.parse(await readFile(filePath, 'utf8')); }
  catch (error) { if (optional && error?.code === 'ENOENT') return null; throw error; }
}
function jsonText(value) { return `${JSON.stringify(value, null, 2)}\n`; }
function requiredText(value, field) { const text = String(value ?? '').trim(); if (!text) throw new Error(`${field} is required`); return text; }
function policyUnit(policy) {
  const units = uniqueStrings((policy.quantity_rules || []).map((rule) => rule?.parameters?.unit));
  if (units.length !== 1) throw new Error(`policy ${policy.id} must expose exactly one claim unit for packaging v0`);
  return units[0];
}
function policyEvidenceRate(policy) {
  const rule = (policy.quantity_rules || []).find((item) => item?.calculator_id === 'EVIDENCE_BACKED_CAPACITY');
  const rate = Number(rule?.parameters?.rate);
  if (!Number.isFinite(rate)) throw new Error(`policy ${policy.id} has no numeric EVIDENCE_BACKED_CAPACITY rate`);
  return rate;
}
function researchStatuses(assessment) { return Object.fromEntries(['R1', 'R2', 'R3', 'R4'].map((id) => [id, assessment.research_boundaries[id].status])); }
function r3Statuses(assessment) {
  const components = assessment.research_boundaries?.R3?.components || {};
  return Object.fromEntries(['issuance', 'pricing', 'settlement', 'governance'].map((id) => [id, components[id]?.status || 'NOT_ASSESSED']));
}
function evaluationFrom({ reportEntry, decision, policy }) {
  const result = requiredText(reportEntry?.result || decision?.decision, `decision ${policy?.id}.result`);
  if (!reportEntry || !decision || !policy || decision.decision !== result) throw new Error(`decision/report mismatch for ${policy?.id || 'unknown policy'}`);
  const blockingRules = ruleIds(reportEntry.blocking_rules ?? decision.admission?.blocking_rules);
  const bindingRules = ruleIds(reportEntry.binding_constraints ?? decision.capacity?.binding_constraints);
  const claimUnit = policyUnit(policy);
  const admitted = reportEntry.admitted_maximum ?? decision.capacity?.admitted_maximum;
  const supportedQuantity = result === 'ADMIT_WITH_LIMIT' || result === 'ADMIT' ? { value: Number(admitted), unit: claimUnit } : null;
  if (supportedQuantity && !Number.isFinite(supportedQuantity.value)) throw new Error(`admitted quantity is missing for ${policy.id}`);
  return {
    policy: { id: policy.id, version: policy.version || null },
    decision: result,
    display_status: displayStatus(result),
    decision_id: requiredText(decision.decision_id, `decision ${policy.id}.decision_id`),
    supported_quantity: supportedQuantity,
    binding_rules: bindingRules,
    blocking_rules: blockingRules,
    remediation: result === 'BLOCKED' ? remediationForRules(blockingRules) : [],
  };
}

async function main() {
  const caseDir = path.resolve(arg('case-dir', 'state/external/public-001p-ausgrid'));
  const outputPath = path.resolve(arg('out', path.join(caseDir, 'claim-assessment-package.json')));
  const reportPath = path.resolve(arg('report-out', path.join(caseDir, 'claim-assessment.md')));
  const [report, caseManifest, evidence, pilotDecision, openDecision, settlement, receipt, capsule, capsuleVerification, assessment] = await Promise.all([
    readJson(path.join(caseDir, 'report.json')), readJson(path.join(caseDir, 'case.json')), readJson(path.join(caseDir, 'evidence-envelope.json')),
    readJson(path.join(caseDir, 'pilot-decision.json')), readJson(path.join(caseDir, 'open-decision.json')),
    readJson(path.join(caseDir, 'settlement-result.json'), { optional: true }), readJson(path.join(caseDir, 'decision-receipt.json'), { optional: true }),
    readJson(path.join(caseDir, 'research-capsule-bundle.json'), { optional: true }), readJson(path.join(caseDir, 'capsule-verification.json'), { optional: true }),
    readJson(path.join(caseDir, 'constrained-claim-assessment.json')),
  ]);
  const caseId = requiredText(caseManifest.case_id, 'case.case_id');
  const evidenceHash = requiredText(evidence.evidence_hash, 'evidence.evidence_hash');
  if (report.case_id !== caseId) throw new Error('report/case identity mismatch');
  if (!Array.isArray(caseManifest.evidence_refs) || !caseManifest.evidence_refs.includes(evidenceHash)) throw new Error('case/evidence identity mismatch');
  if (assessment.subject?.case_id !== caseId) throw new Error('research assessment/case identity mismatch');
  if (capsuleVerification?.ok !== true || capsuleVerification?.summary?.decision_reproduction !== 'PASS') throw new Error('P0 package requires PASS closed-world decision reproduction');

  const policyDir = path.resolve('protocol/policies-v2');
  const [openPolicy, pilotPolicy] = await Promise.all([
    readJson(path.join(policyDir, `${report.decisions.open.policy_id}.json`)),
    readJson(path.join(policyDir, `${report.decisions.pilot.policy_id}.json`)),
  ]);
  const units = uniqueStrings([policyUnit(openPolicy), policyUnit(pilotPolicy)]);
  if (units.length !== 1) throw new Error('P0 package requires one common claim unit across compared policies');
  const rates = uniqueStrings([policyEvidenceRate(openPolicy), policyEvidenceRate(pilotPolicy)].map(String));
  if (rates.length !== 1) throw new Error('P0 package requires one common evidence-backed conversion rate across compared policies');
  const claimUnit = units[0];
  const evidenceRate = Number(rates[0]);
  const evaluations = [evaluationFrom({ reportEntry: report.decisions.open, decision: openDecision, policy: openPolicy }), evaluationFrom({ reportEntry: report.decisions.pilot, decision: pilotDecision, policy: pilotPolicy })];
  const sourceHolderConfirmation = evidence.source?.source_holder_confirmed === true ? 'CONFIRMED' : evidence.source?.source_holder_confirmed === false ? 'NOT_CONFIRMED' : 'UNKNOWN';

  const semanticBody = {
    schema: CLAIM_ASSESSMENT_PACKAGE_SCHEMA,
    claim: {
      claim_id: `claim:${caseId}:maximum-supportable-derived-surplus`, case_id: caseId, claim_type: 'maximum_supportable_derived_surplus_quantity',
      subject: requiredText(caseManifest.subject, 'case.subject'),
      statement: `Determine the maximum energy-linked claim quantity supportable by the selected public-source window under each declared policy. Eligible evidence quantity is derived half-hour surplus in kWh; the compared policies convert evidence-backed capacity into ${claimUnit} at declared rate ${evidenceRate}. Derived surplus is not directly metered grid export.`,
      request_mode: 'MAXIMUM_SUPPORTABLE', requested_quantity: null, unit: claimUnit,
      period: { start: requiredText(caseManifest.measurement_window?.start, 'case.measurement_window.start'), end: requiredText(caseManifest.measurement_window?.end, 'case.measurement_window.end') },
    },
    evidence: {
      evidence_hash: evidenceHash, assurance: requiredText(report.provenance?.level, 'report.provenance.level'), source_holder_confirmation: sourceHolderConfirmation,
      interval_count: Number(report.source?.interval_count ?? evidence.summary?.interval_count ?? 0),
      source: { publisher: requiredText(report.source?.publisher, 'report.source.publisher'), dataset: requiredText(report.source?.dataset, 'report.source.dataset'), archive_sha256: requiredText(report.source?.archive_sha256, 'report.source.archive_sha256'), archive_bytes: Number(report.source?.archive_bytes), selected_subject: `de-identified customer ${requiredText(report.source?.selected_customer, 'report.source.selected_customer')}`, timezone_basis: requiredText(report.source?.timezone_basis, 'report.source.timezone_basis') },
      eligible_quantity: { value: Number(report.evidence?.total_eligible_surplus_kwh), unit: 'kWh', semantics: requiredText(report.transformations?.derived_field, 'report.transformations.derived_field') },
      warnings: uniqueStrings([...(report.transformations?.unresolved || []), ...(evidence.diagnostics || []).filter((item) => item.status === 'WARNING').map((item) => item.detail)]),
    },
    evaluations,
    settlement: settlement ? { result: requiredText(report.settlement?.result || settlement.result, 'settlement.result'), covered_quantity: Number(report.settlement?.covered_quantity ?? settlement.covered_quantity), shortfall_quantity: Number(report.settlement?.shortfall_quantity ?? settlement.shortfall_quantity), unit: claimUnit, scenario_only: report.settlement?.scenario_only !== false } : null,
    verification: { package_identity: { algorithm: 'SHA-256', canonicalization: 'stable-json-key-order-v1', delivery_excluded_from_identity: true }, artifact_contract: 'Fields are derived from the closed PUB-AUSGRID-001P case artifact directory. Delivery receipt/capsule identities are excluded from package identity because they may vary by execution while semantic assessment remains identical.' },
    next_evidence_required: { operational: uniqueStrings(evaluations.flatMap((item) => item.remediation)), research: Object.fromEntries(['R1', 'R2', 'R3', 'R4'].map((id) => [id, uniqueStrings(assessment.next_evidence_required?.[id] || assessment.research_boundaries?.[id]?.next_evidence_required || [])])) },
    explicit_non_claims: uniqueStrings([...(assessment.explicit_non_claims || []), ...(caseManifest.boundaries || []), `The ${claimUnit} result is a policy-defined claim quantity. It does not convert derived surplus into legal title, certified export, a renewable-energy certificate, or money.`]),
    research_projection: { schema: assessment.schema, assessment_id: assessment.assessment_id, boundaries: researchStatuses(assessment), r3_components: r3Statuses(assessment) },
  };
  if (!Number.isInteger(semanticBody.evidence.interval_count) || semanticBody.evidence.interval_count < 1) throw new Error('evidence interval_count must be positive');
  if (!Number.isFinite(semanticBody.evidence.source.archive_bytes) || semanticBody.evidence.source.archive_bytes < 1) throw new Error('source archive_bytes must be positive');
  if (!Number.isFinite(semanticBody.evidence.eligible_quantity.value)) throw new Error('eligible evidence quantity must be numeric');
  const pkg = { ...semanticBody, package_id: await computePackageId(semanticBody), delivery: { receipt_decision_id: receipt?.decision_id || null, capsule_id: capsule?.manifest?.capsule_id || capsule?.capsule_id || null, capsule_verification: capsuleVerification ? { ok: capsuleVerification.ok === true, integrity: requiredText(capsuleVerification.summary?.capsule_integrity, 'capsule integrity'), schema_validation: requiredText(capsuleVerification.summary?.schema_validation, 'capsule schema validation'), decision_reproduction: requiredText(capsuleVerification.summary?.decision_reproduction, 'capsule decision reproduction') } : null } };
  validatePackageShape(pkg);
  await writeFile(outputPath, jsonText(pkg));
  await writeFile(reportPath, renderClaimAssessmentMarkdown(pkg));
  console.log(jsonText({ ok: true, schema: pkg.schema, package_id: pkg.package_id, case_id: pkg.claim.case_id, evidence_assurance: pkg.evidence.assurance, evaluations: pkg.evaluations, research_assessment_id: pkg.research_projection.assessment_id, output: outputPath, human_report: reportPath }));
}

main().catch((error) => { console.error(error.stack || error.message || error); process.exit(1); });

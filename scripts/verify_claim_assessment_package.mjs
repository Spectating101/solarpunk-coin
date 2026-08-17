#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  CLAIM_ASSESSMENT_PACKAGE_SCHEMA,
  ENERGY_PROFILE_ID,
  calculatorIds,
  computeAssessmentId,
  computePackageContentId,
  normalizeRuleEvaluation,
  renderClaimAssessmentMarkdown,
  sameStable,
  validatePackageShape,
} from './lib/claim_assessment_package_v0_1.mjs';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}
async function readJson(filePath, { optional = false } = {}) {
  try { return JSON.parse(await readFile(filePath, 'utf8')); }
  catch (error) { if (optional && error?.code === 'ENOENT') return null; throw error; }
}
function assertEqual(actual, expected, field) { if (!sameStable(actual, expected)) throw new Error(`${field} mismatch`); }
function policyUnit(policy) {
  const units = [...new Set((policy.quantity_rules || []).map((rule) => String(rule?.parameters?.unit || '')).filter(Boolean))];
  if (units.length !== 1) throw new Error(`policy ${policy.id} must expose exactly one claim unit`);
  return units[0];
}
function evidenceRate(policy) {
  const rule = (policy.quantity_rules || []).find((item) => item?.calculator_id === 'EVIDENCE_BACKED_CAPACITY');
  const rate = Number(rule?.parameters?.rate);
  if (!Number.isFinite(rate)) throw new Error(`policy ${policy.id} has no evidence-backed rate`);
  return rate;
}
function sourceRuleEvaluations(decision) {
  return [...(decision.admission?.evaluations || []), ...(decision.capacity?.evaluations || [])].map(normalizeRuleEvaluation);
}
function researchStatuses(assessment) { return Object.fromEntries(['R1', 'R2', 'R3', 'R4'].map((id) => [id, assessment.research_boundaries[id].status])); }
function r3Statuses(assessment) {
  const components = assessment.research_boundaries?.R3?.components || {};
  return Object.fromEntries(['issuance', 'pricing', 'settlement', 'governance'].map((id) => [id, components[id]?.status || 'NOT_ASSESSED']));
}

async function main() {
  const caseDir = path.resolve(arg('case-dir', 'state/external/public-001p-ausgrid'));
  const packagePath = path.resolve(arg('package', path.join(caseDir, 'claim-assessment-package.json')));
  const reportPath = path.resolve(arg('report', path.join(caseDir, 'claim-assessment.md')));
  const [pkg, humanReport, schema, report, caseManifest, evidence, pilotDecision, openDecision, settlement, receipt, capsule, capsuleVerification, assessment] = await Promise.all([
    readJson(packagePath), readFile(reportPath, 'utf8'), readJson(path.resolve('protocol/schema/claim-assessment-package.v0.1.schema.json')),
    readJson(path.join(caseDir, 'report.json')), readJson(path.join(caseDir, 'case.json')), readJson(path.join(caseDir, 'evidence-envelope.json')),
    readJson(path.join(caseDir, 'pilot-decision.json')), readJson(path.join(caseDir, 'open-decision.json')),
    readJson(path.join(caseDir, 'settlement-result.json'), { optional: true }), readJson(path.join(caseDir, 'decision-receipt.json'), { optional: true }),
    readJson(path.join(caseDir, 'research-capsule-bundle.json'), { optional: true }), readJson(path.join(caseDir, 'capsule-verification.json'), { optional: true }),
    readJson(path.join(caseDir, 'constrained-claim-assessment.json')),
  ]);

  validatePackageShape(pkg);
  if (schema?.properties?.schema?.const !== CLAIM_ASSESSMENT_PACKAGE_SCHEMA) throw new Error('published JSON schema constant does not match package implementation');
  if (schema?.properties?.profile?.properties?.id?.const !== ENERGY_PROFILE_ID) throw new Error('published JSON schema profile constant does not match implementation');
  const reproducedAssessmentId = await computeAssessmentId(pkg);
  if (pkg.assessment_id !== reproducedAssessmentId) throw new Error(`assessment identity mismatch: expected ${pkg.assessment_id}, reproduced ${reproducedAssessmentId}`);
  const reproducedContentId = await computePackageContentId(pkg);
  if (pkg.package_content_id !== reproducedContentId) throw new Error(`package content identity mismatch: expected ${pkg.package_content_id}, reproduced ${reproducedContentId}`);
  if (humanReport !== renderClaimAssessmentMarkdown(pkg)) throw new Error('human assessment report is not an exact rendering of the machine-readable package');

  const caseId = String(caseManifest.case_id || '');
  const evidenceHash = String(evidence.evidence_hash || '');
  if (pkg.claim.case_id !== caseId || report.case_id !== caseId || assessment.subject?.case_id !== caseId) throw new Error('case identity disagreement');
  assertEqual(pkg.claim.period.canonical_utc, caseManifest.measurement_window, 'canonical UTC claim period');
  const selectedDates = report.source?.selected_dates || [];
  if (pkg.claim.period.local.start_date !== selectedDates[0] || pkg.claim.period.local.end_date !== selectedDates[selectedDates.length - 1]) throw new Error('local claim period mismatch');
  if (pkg.claim.period.local.timezone_basis !== report.source?.timezone_basis) throw new Error('local timezone basis mismatch');

  if (pkg.evidence.evidence_hash !== evidenceHash || !caseManifest.evidence_refs?.includes(evidenceHash)) throw new Error('evidence identity disagreement');
  if (pkg.evidence.assurance !== report.provenance?.level) throw new Error('assurance mismatch');
  if (pkg.evidence.source.archive_sha256 !== report.source?.archive_sha256) throw new Error('source archive SHA-256 mismatch');
  if (pkg.evidence.source.archive_bytes !== Number(report.source?.archive_bytes)) throw new Error('source archive byte-length mismatch');
  if (pkg.evidence.eligible_quantity.value !== Number(report.evidence?.total_eligible_surplus_kwh) || pkg.evidence.eligible_quantity.unit !== 'kWh') throw new Error('eligible evidence quantity mismatch');
  const expectedWarnings = (evidence.diagnostics || []).filter((item) => item.status === 'WARNING').map((item) => ({ code: String(item.code), detail: String(item.detail) }));
  assertEqual(pkg.evidence.warnings, expectedWarnings, 'evidence warnings');

  const decisions = [pilotDecision, openDecision];
  const reportEntries = Object.values(report.decisions || {});
  const policyById = {};
  for (const evaluation of pkg.evaluations) {
    const sourceDecision = decisions.find((item) => item?.decision_id === evaluation.decision_id);
    if (!sourceDecision) throw new Error(`no source decision for ${evaluation.policy.id}`);
    const reportEntry = reportEntries.find((item) => item?.policy_id === evaluation.policy.id);
    if (!reportEntry) throw new Error(`no report decision for ${evaluation.policy.id}`);
    const policy = await readJson(path.resolve('protocol/policies-v2', `${evaluation.policy.id}.json`));
    policyById[policy.id] = policy;
    if (sourceDecision.case_id !== caseId || sourceDecision.decision !== evaluation.decision || reportEntry.result !== evaluation.decision) throw new Error(`decision mismatch for ${evaluation.policy.id}`);
    if (!sourceDecision.evidence_hashes?.includes(evidenceHash)) throw new Error(`decision ${evaluation.policy.id} does not reference package evidence`);
    if (evaluation.policy.version !== (policy.version || null) || evaluation.policy.name !== policy.name || evaluation.policy.description !== policy.description) throw new Error(`policy metadata mismatch for ${evaluation.policy.id}`);
    assertEqual(evaluation.policy.governance, { authority: policy.governance.authority, mutable_by: policy.governance.mutable_by }, `${evaluation.policy.id} governance`);
    if (evaluation.policy_manifest_hash !== sourceDecision.policy_manifest_hash) throw new Error(`policy manifest hash mismatch for ${evaluation.policy.id}`);
    assertEqual(evaluation.blocking_calculators, calculatorIds(reportEntry.blocking_rules ?? sourceDecision.admission?.blocking_rules), `${evaluation.policy.id} blocking calculators`);
    assertEqual(evaluation.binding_calculators, calculatorIds(reportEntry.binding_constraints ?? sourceDecision.capacity?.binding_constraints), `${evaluation.policy.id} binding calculators`);
    assertEqual(evaluation.rule_evaluations, sourceRuleEvaluations(sourceDecision), `${evaluation.policy.id} structured rule evaluations`);
    if (evaluation.supported_quantity) {
      if (evaluation.supported_quantity.value !== Number(reportEntry.admitted_maximum ?? sourceDecision.capacity?.admitted_maximum)) throw new Error(`supported quantity mismatch for ${evaluation.policy.id}`);
      if (evaluation.supported_quantity.unit !== policyUnit(policy)) throw new Error(`supported quantity unit mismatch for ${evaluation.policy.id}`);
    } else if (evaluation.decision === 'ADMIT' || evaluation.decision === 'ADMIT_WITH_LIMIT') throw new Error(`admitted policy ${evaluation.policy.id} has no supported quantity`);
  }

  const policyUnits = [...new Set(Object.values(policyById).map(policyUnit))];
  const policyRates = [...new Set(Object.values(policyById).map(evidenceRate))];
  if (policyUnits.length !== 1 || policyRates.length !== 1) throw new Error('compared policies no longer share one unit mapping');
  if (pkg.profile.id !== ENERGY_PROFILE_ID || pkg.profile.unit_mapping.source_unit !== 'kWh' || pkg.profile.unit_mapping.claim_unit !== policyUnits[0] || pkg.profile.unit_mapping.evidence_backed_rate !== policyRates[0] || pkg.profile.unit_mapping.calculator_id !== 'EVIDENCE_BACKED_CAPACITY') throw new Error('energy-domain unit profile mismatch');

  if (settlement) {
    if (!pkg.settlement) throw new Error('settlement artifact exists but package settlement is null');
    if (pkg.settlement.result !== (report.settlement?.result || settlement.result)) throw new Error('settlement result mismatch');
    if (pkg.settlement.covered_quantity !== Number(report.settlement?.covered_quantity ?? settlement.covered_quantity) || pkg.settlement.shortfall_quantity !== Number(report.settlement?.shortfall_quantity ?? settlement.shortfall_quantity)) throw new Error('settlement quantity mismatch');
    if (pkg.settlement.unit !== policyUnits[0]) throw new Error('settlement unit mismatch');
  } else if (pkg.settlement !== null) throw new Error('package settlement exists without source settlement artifact');

  const research = pkg.extensions?.research_projection;
  if (research) {
    if (research.schema !== assessment.schema || research.assessment_id !== assessment.assessment_id) throw new Error('research extension identity mismatch');
    assertEqual(research.boundaries, researchStatuses(assessment), 'research boundary projection');
    assertEqual(research.r3_components, r3Statuses(assessment), 'R3 component projection');
    assertEqual(research.next_evidence_required, assessment.next_evidence_required || {}, 'research next-evidence projection');
  }

  const delivery = pkg.extensions?.delivery_verification;
  if (delivery) {
    if ((delivery.receipt_decision_id || null) !== (receipt?.decision_id || null)) throw new Error('delivery receipt identity mismatch');
    if ((delivery.capsule_id || null) !== (capsule?.manifest?.capsule_id || capsule?.capsule_id || null)) throw new Error('delivery capsule identity mismatch');
    if (capsuleVerification?.ok !== true || capsuleVerification?.summary?.decision_reproduction !== 'PASS') throw new Error('closed-world source decision reproduction is not PASS');
    if (!delivery.capsule_verification?.ok || delivery.capsule_verification.decision_reproduction !== 'PASS') throw new Error('package does not preserve PASS delivery verification');
  }

  console.log(JSON.stringify({
    ok: true,
    schema: pkg.schema,
    profile_id: pkg.profile.id,
    assessment_id: pkg.assessment_id,
    package_content_id: pkg.package_content_id,
    case_id: pkg.claim.case_id,
    assurance: pkg.evidence.assurance,
    evaluations: pkg.evaluations.map((item) => ({ policy_id: item.policy.id, policy_name: item.policy.name, decision: item.decision, external_reading: item.external_reading, supported_quantity: item.supported_quantity, blocking_calculators: item.blocking_calculators, binding_calculators: item.binding_calculators })),
    research_extension: research?.assessment_id || null,
    human_report_reproduction: 'PASS',
    closed_world_decision_reproduction: delivery?.capsule_verification?.decision_reproduction || 'NOT_INCLUDED',
    boundary: 'Verification proves P0.1 package identity and agreement with the supplied closed case artifacts. It does not promote policy authority, source truth, legal validity, certification, commercial demand, or monetary status.',
  }, null, 2));
}

main().catch((error) => { console.error(error.stack || error.message || error); process.exit(1); });

#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  CLAIM_ASSESSMENT_PACKAGE_SCHEMA,
  computePackageId,
  renderClaimAssessmentMarkdown,
  ruleIds,
  sameStable,
  validatePackageShape,
} from './lib/claim_assessment_package_v0.mjs';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}
async function readJson(filePath, { optional = false } = {}) {
  try { return JSON.parse(await readFile(filePath, 'utf8')); }
  catch (error) { if (optional && error?.code === 'ENOENT') return null; throw error; }
}
function sorted(values = []) { return [...values].map(String).sort(); }
function assertEqual(actual, expected, field) { if (!sameStable(actual, expected)) throw new Error(`${field} mismatch`); }
function policyUnit(policy) {
  const units = [...new Set((policy.quantity_rules || []).map((rule) => String(rule?.parameters?.unit || '')).filter(Boolean))];
  if (units.length !== 1) throw new Error(`policy ${policy.id} must expose exactly one claim unit`);
  return units[0];
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
    readJson(packagePath), readFile(reportPath, 'utf8'), readJson(path.resolve('protocol/schema/claim-assessment-package.v0.schema.json')),
    readJson(path.join(caseDir, 'report.json')), readJson(path.join(caseDir, 'case.json')), readJson(path.join(caseDir, 'evidence-envelope.json')),
    readJson(path.join(caseDir, 'pilot-decision.json')), readJson(path.join(caseDir, 'open-decision.json')),
    readJson(path.join(caseDir, 'settlement-result.json'), { optional: true }), readJson(path.join(caseDir, 'decision-receipt.json'), { optional: true }),
    readJson(path.join(caseDir, 'research-capsule-bundle.json'), { optional: true }), readJson(path.join(caseDir, 'capsule-verification.json'), { optional: true }),
    readJson(path.join(caseDir, 'constrained-claim-assessment.json')),
  ]);

  validatePackageShape(pkg);
  if (schema?.properties?.schema?.const !== CLAIM_ASSESSMENT_PACKAGE_SCHEMA) throw new Error('published JSON schema constant does not match package implementation');
  const reproducedPackageId = await computePackageId(pkg);
  if (pkg.package_id !== reproducedPackageId) throw new Error(`package identity mismatch: expected ${pkg.package_id}, reproduced ${reproducedPackageId}`);
  if (humanReport !== renderClaimAssessmentMarkdown(pkg)) throw new Error('human assessment report is not an exact rendering of the machine-readable package');

  const caseId = String(caseManifest.case_id || '');
  const evidenceHash = String(evidence.evidence_hash || '');
  if (pkg.claim.case_id !== caseId || report.case_id !== caseId || assessment.subject?.case_id !== caseId) throw new Error('case identity disagreement');
  assertEqual(pkg.claim.period, caseManifest.measurement_window, 'claim period');
  if (pkg.evidence.evidence_hash !== evidenceHash || !caseManifest.evidence_refs?.includes(evidenceHash)) throw new Error('evidence identity disagreement');
  if (pkg.evidence.assurance !== report.provenance?.level) throw new Error('assurance mismatch');
  if (pkg.evidence.source.archive_sha256 !== report.source?.archive_sha256) throw new Error('source archive SHA-256 mismatch');
  if (pkg.evidence.source.archive_bytes !== Number(report.source?.archive_bytes)) throw new Error('source archive byte-length mismatch');
  if (pkg.evidence.eligible_quantity.value !== Number(report.evidence?.total_eligible_surplus_kwh)) throw new Error('eligible quantity mismatch');
  if (pkg.evidence.eligible_quantity.unit !== 'kWh') throw new Error('evidence quantity unit must remain kWh');

  const decisions = [pilotDecision, openDecision];
  const reportEntries = Object.values(report.decisions || {});
  for (const evaluation of pkg.evaluations) {
    const sourceDecision = decisions.find((item) => item?.decision_id === evaluation.decision_id);
    if (!sourceDecision) throw new Error(`no source decision for ${evaluation.policy.id}`);
    const reportEntry = reportEntries.find((item) => item?.policy_id === evaluation.policy.id);
    if (!reportEntry) throw new Error(`no report decision for ${evaluation.policy.id}`);
    if (sourceDecision.case_id !== caseId || sourceDecision.decision !== evaluation.decision || reportEntry.result !== evaluation.decision) throw new Error(`decision mismatch for ${evaluation.policy.id}`);
    if (!sourceDecision.evidence_hashes?.includes(evidenceHash)) throw new Error(`decision ${evaluation.policy.id} does not reference package evidence`);
    assertEqual(sorted(evaluation.blocking_rules), sorted(ruleIds(reportEntry.blocking_rules ?? sourceDecision.admission?.blocking_rules)), `${evaluation.policy.id} blocking rules`);
    assertEqual(sorted(evaluation.binding_rules), sorted(ruleIds(reportEntry.binding_constraints ?? sourceDecision.capacity?.binding_constraints)), `${evaluation.policy.id} binding rules`);
    const policy = await readJson(path.resolve('protocol/policies-v2', `${evaluation.policy.id}.json`));
    if (evaluation.policy.version !== (policy.version || null)) throw new Error(`policy version mismatch for ${evaluation.policy.id}`);
    if (evaluation.supported_quantity) {
      if (evaluation.supported_quantity.value !== Number(reportEntry.admitted_maximum ?? sourceDecision.capacity?.admitted_maximum)) throw new Error(`supported quantity mismatch for ${evaluation.policy.id}`);
      if (evaluation.supported_quantity.unit !== policyUnit(policy)) throw new Error(`supported quantity unit mismatch for ${evaluation.policy.id}`);
    }
  }

  if (settlement) {
    if (!pkg.settlement) throw new Error('settlement artifact exists but package settlement is null');
    if (pkg.settlement.result !== (report.settlement?.result || settlement.result)) throw new Error('settlement result mismatch');
    if (pkg.settlement.covered_quantity !== Number(report.settlement?.covered_quantity ?? settlement.covered_quantity)) throw new Error('settlement covered quantity mismatch');
    if (pkg.settlement.shortfall_quantity !== Number(report.settlement?.shortfall_quantity ?? settlement.shortfall_quantity)) throw new Error('settlement shortfall quantity mismatch');
  } else if (pkg.settlement !== null) throw new Error('package settlement exists without source settlement artifact');

  if (pkg.research_projection.schema !== assessment.schema || pkg.research_projection.assessment_id !== assessment.assessment_id) throw new Error('research projection identity mismatch');
  assertEqual(pkg.research_projection.boundaries, researchStatuses(assessment), 'research boundary projection');
  assertEqual(pkg.research_projection.r3_components, r3Statuses(assessment), 'R3 component projection');

  if ((pkg.delivery.receipt_decision_id || null) !== (receipt?.decision_id || null)) throw new Error('delivery receipt identity mismatch');
  if ((pkg.delivery.capsule_id || null) !== (capsule?.manifest?.capsule_id || capsule?.capsule_id || null)) throw new Error('delivery capsule identity mismatch');
  if (capsuleVerification?.ok !== true || capsuleVerification?.summary?.decision_reproduction !== 'PASS') throw new Error('closed-world decision reproduction is not PASS');
  if (!pkg.delivery.capsule_verification?.ok || pkg.delivery.capsule_verification.decision_reproduction !== 'PASS') throw new Error('package does not preserve PASS delivery verification');

  console.log(JSON.stringify({
    ok: true,
    schema: pkg.schema,
    package_id: pkg.package_id,
    case_id: pkg.claim.case_id,
    evidence_hash: pkg.evidence.evidence_hash,
    assurance: pkg.evidence.assurance,
    evaluations: pkg.evaluations.map((item) => ({ policy_id: item.policy.id, decision: item.decision, supported_quantity: item.supported_quantity, blocking_rules: item.blocking_rules, binding_rules: item.binding_rules })),
    research_assessment_id: pkg.research_projection.assessment_id,
    human_report_reproduction: 'PASS',
    closed_world_decision_reproduction: 'PASS',
    boundary: 'Verification proves package identity and agreement with the supplied closed case artifacts; it does not promote source truth, legal authority, commercial validity, or monetary status.',
  }, null, 2));
}

main().catch((error) => { console.error(error.stack || error.message || error); process.exit(1); });

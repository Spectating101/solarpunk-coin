#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  CLAIM_ASSESSMENT_PACKAGE_SCHEMA,
  ENERGY_PROFILE_ID,
  calculatorIds,
  computeAssessmentId,
  computePackageContentId,
  externalReading,
  normalizeRuleEvaluation,
  renderClaimAssessmentMarkdown,
  uniqueStrings,
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
function jsonText(value) { return `${JSON.stringify(value, null, 2)}\n`; }
function requiredText(value, field) { const text = String(value ?? '').trim(); if (!text) throw new Error(`${field} is required`); return text; }
function policyUnit(policy) {
  const units = uniqueStrings((policy.quantity_rules || []).map((rule) => rule?.parameters?.unit));
  if (units.length !== 1) throw new Error(`policy ${policy.id} must expose exactly one claim unit for packaging P0.1`);
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
function allRuleEvaluations(decision) {
  return [...(decision.admission?.evaluations || []), ...(decision.capacity?.evaluations || [])].map(normalizeRuleEvaluation);
}
function evaluationFrom({ reportEntry, decision, policy }) {
  if (!reportEntry || !decision || !policy) throw new Error('reportEntry, decision, and policy are required');
  const result = requiredText(reportEntry.result || decision.decision, `decision ${policy.id}.result`);
  if (decision.decision !== result) throw new Error(`decision/report mismatch for ${policy.id}`);
  const claimUnit = policyUnit(policy);
  const admitted = reportEntry.admitted_maximum ?? decision.capacity?.admitted_maximum;
  const supportedQuantity = result === 'ADMIT_WITH_LIMIT' || result === 'ADMIT' ? { value: Number(admitted), unit: claimUnit } : null;
  if (supportedQuantity && !Number.isFinite(supportedQuantity.value)) throw new Error(`admitted quantity is missing for ${policy.id}`);
  return {
    policy: {
      id: policy.id,
      version: policy.version || null,
      name: requiredText(policy.name, `policy ${policy.id}.name`),
      description: requiredText(policy.description, `policy ${policy.id}.description`),
      governance: {
        authority: requiredText(policy.governance?.authority, `policy ${policy.id}.governance.authority`),
        mutable_by: requiredText(policy.governance?.mutable_by, `policy ${policy.id}.governance.mutable_by`),
      },
    },
    policy_manifest_hash: requiredText(decision.policy_manifest_hash, `decision ${policy.id}.policy_manifest_hash`),
    decision: result,
    external_reading: externalReading(result),
    decision_id: requiredText(decision.decision_id, `decision ${policy.id}.decision_id`),
    supported_quantity: supportedQuantity,
    binding_calculators: calculatorIds(reportEntry.binding_constraints ?? decision.capacity?.binding_constraints),
    blocking_calculators: calculatorIds(reportEntry.blocking_rules ?? decision.admission?.blocking_rules),
    rule_evaluations: allRuleEvaluations(decision),
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
  if (!caseManifest.evidence_refs?.includes(evidenceHash)) throw new Error('case/evidence identity mismatch');
  if (assessment.subject?.case_id !== caseId) throw new Error('research assessment/case identity mismatch');
  if (capsuleVerification?.ok !== true || capsuleVerification?.summary?.decision_reproduction !== 'PASS') throw new Error('P0.1 package requires PASS closed-world decision reproduction');

  const policyDir = path.resolve('protocol/policies-v2');
  const [openPolicy, pilotPolicy] = await Promise.all([
    readJson(path.join(policyDir, `${report.decisions.open.policy_id}.json`)),
    readJson(path.join(policyDir, `${report.decisions.pilot.policy_id}.json`)),
  ]);
  const claimUnits = uniqueStrings([policyUnit(openPolicy), policyUnit(pilotPolicy)]);
  if (claimUnits.length !== 1) throw new Error('P0.1 requires one common claim unit across compared policies');
  const evidenceRates = uniqueStrings([policyEvidenceRate(openPolicy), policyEvidenceRate(pilotPolicy)].map(String));
  if (evidenceRates.length !== 1) throw new Error('P0.1 requires one common evidence-backed rate across compared policies');
  const claimUnit = claimUnits[0];
  const evidenceRate = Number(evidenceRates[0]);
  const selectedDates = Array.isArray(report.source?.selected_dates) ? report.source.selected_dates : [];
  if (selectedDates.length < 1) throw new Error('P0.1 energy profile requires selected local source dates');

  const evaluations = [
    evaluationFrom({ reportEntry: report.decisions.open, decision: openDecision, policy: openPolicy }),
    evaluationFrom({ reportEntry: report.decisions.pilot, decision: pilotDecision, policy: pilotPolicy }),
  ];
  const sourceHolderConfirmation = evidence.source?.source_holder_confirmed === true ? 'CONFIRMED' : evidence.source?.source_holder_confirmed === false ? 'NOT_CONFIRMED' : 'UNKNOWN';
  const warningObjects = (evidence.diagnostics || [])
    .filter((item) => item.status === 'WARNING')
    .map((item) => ({ code: requiredText(item.code, 'evidence warning code'), detail: requiredText(item.detail, 'evidence warning detail') }));

  const basePackage = {
    schema: CLAIM_ASSESSMENT_PACKAGE_SCHEMA,
    profile: {
      id: ENERGY_PROFILE_ID,
      domain: 'energy',
      claim_kind: 'maximum_supportable_derived_surplus_quantity',
      unit_mapping: {
        source_unit: 'kWh',
        claim_unit: claimUnit,
        evidence_backed_rate: evidenceRate,
        calculator_id: 'EVIDENCE_BACKED_CAPACITY',
        interpretation: `${claimUnit} is a policy-defined claim unit. The declared rate does not make it physical kWh, directly metered export, legal title, a renewable-energy certificate, or money.`,
      },
    },
    claim: {
      claim_id: `claim:${caseId}:maximum-supportable-derived-surplus`,
      case_id: caseId,
      subject: requiredText(caseManifest.subject, 'case.subject'),
      question: 'What maximum policy-defined energy-linked claim quantity can this bounded evidence object support under each declared policy, and where does a stricter policy stop it?',
      request_mode: 'MAXIMUM_SUPPORTABLE',
      requested_quantity: null,
      period: {
        local: {
          start_date: requiredText(selectedDates[0], 'report.source.selected_dates[0]'),
          end_date: requiredText(selectedDates[selectedDates.length - 1], 'report.source.selected_dates[last]'),
          timezone_basis: requiredText(report.source?.timezone_basis, 'report.source.timezone_basis'),
        },
        canonical_utc: {
          start: requiredText(caseManifest.measurement_window?.start, 'case.measurement_window.start'),
          end: requiredText(caseManifest.measurement_window?.end, 'case.measurement_window.end'),
        },
      },
    },
    evidence: {
      evidence_hash: evidenceHash,
      assurance: requiredText(report.provenance?.level, 'report.provenance.level'),
      source_holder_confirmation: sourceHolderConfirmation,
      interval_count: Number(report.source?.interval_count ?? evidence.summary?.interval_count ?? 0),
      source: {
        publisher: requiredText(report.source?.publisher, 'report.source.publisher'),
        dataset: requiredText(report.source?.dataset, 'report.source.dataset'),
        archive_sha256: requiredText(report.source?.archive_sha256, 'report.source.archive_sha256'),
        archive_bytes: Number(report.source?.archive_bytes),
        selected_subject: `de-identified customer ${requiredText(report.source?.selected_customer, 'report.source.selected_customer')}`,
      },
      eligible_quantity: {
        value: Number(report.evidence?.total_eligible_surplus_kwh),
        unit: 'kWh',
        semantics: requiredText(report.transformations?.derived_field, 'report.transformations.derived_field'),
      },
      warnings: warningObjects,
    },
    evaluations,
    settlement: settlement ? {
      result: requiredText(report.settlement?.result || settlement.result, 'settlement.result'),
      covered_quantity: Number(report.settlement?.covered_quantity ?? settlement.covered_quantity),
      shortfall_quantity: Number(report.settlement?.shortfall_quantity ?? settlement.shortfall_quantity),
      unit: claimUnit,
      scenario_only: report.settlement?.scenario_only !== false,
    } : null,
    verification: {
      assessment_identity: {
        algorithm: 'SHA-256',
        canonicalization: 'stable-json-key-order-v1',
        excludes: ['explanatory prose', 'policy descriptions', 'evidence warning prose', 'non-claims', 'research extension', 'delivery verification'],
        meaning: 'Stable identity of the claim/evidence/policy-decision/settlement semantics represented by this package.',
      },
      package_content_identity: {
        algorithm: 'SHA-256',
        canonicalization: 'stable-json-key-order-v1',
        meaning: 'Identity of the complete package content except package_content_id itself.',
      },
      artifact_contract: 'The package is derived from the closed PUB-AUSGRID-001P case artifact set. The external package does not alter the underlying Policy Lab decisions or promote their authority.',
    },
    non_claims: uniqueStrings([
      ...(assessment.explicit_non_claims || []),
      ...(caseManifest.boundaries || []),
      `${claimUnit} is a policy-defined claim quantity and is not silently reinterpreted as physical kWh, directly metered grid export, legal title, certification, or money.`,
    ]),
    extensions: {
      research_projection: {
        schema: assessment.schema,
        assessment_id: assessment.assessment_id,
        boundaries: researchStatuses(assessment),
        r3_components: r3Statuses(assessment),
        next_evidence_required: assessment.next_evidence_required || {},
      },
      delivery_verification: {
        receipt_decision_id: receipt?.decision_id || null,
        capsule_id: capsule?.manifest?.capsule_id || capsule?.capsule_id || null,
        capsule_verification: capsuleVerification ? {
          ok: capsuleVerification.ok === true,
          integrity: requiredText(capsuleVerification.summary?.capsule_integrity, 'capsule integrity'),
          schema_validation: requiredText(capsuleVerification.summary?.schema_validation, 'capsule schema validation'),
          decision_reproduction: requiredText(capsuleVerification.summary?.decision_reproduction, 'capsule decision reproduction'),
        } : null,
      },
    },
  };

  if (!Number.isInteger(basePackage.evidence.interval_count) || basePackage.evidence.interval_count < 1) throw new Error('evidence interval_count must be positive');
  if (!Number.isInteger(basePackage.evidence.source.archive_bytes) || basePackage.evidence.source.archive_bytes < 1) throw new Error('source archive_bytes must be positive');
  if (!Number.isFinite(basePackage.evidence.eligible_quantity.value)) throw new Error('eligible evidence quantity must be numeric');

  const withAssessment = { ...basePackage, assessment_id: await computeAssessmentId(basePackage) };
  const pkg = { ...withAssessment, package_content_id: await computePackageContentId(withAssessment) };
  validatePackageShape(pkg);
  await writeFile(outputPath, jsonText(pkg));
  await writeFile(reportPath, renderClaimAssessmentMarkdown(pkg));

  console.log(jsonText({
    ok: true,
    schema: pkg.schema,
    profile_id: pkg.profile.id,
    assessment_id: pkg.assessment_id,
    package_content_id: pkg.package_content_id,
    case_id: pkg.claim.case_id,
    evidence_assurance: pkg.evidence.assurance,
    evidence_quantity: pkg.evidence.eligible_quantity,
    evaluations: pkg.evaluations.map((item) => ({
      policy_id: item.policy.id,
      policy_name: item.policy.name,
      decision: item.decision,
      external_reading: item.external_reading,
      supported_quantity: item.supported_quantity,
      blocking_calculators: item.blocking_calculators,
      binding_calculators: item.binding_calculators,
    })),
    research_extension: pkg.extensions?.research_projection?.assessment_id || null,
    output: outputPath,
    human_report: reportPath,
  }));
}

main().catch((error) => { console.error(error.stack || error.message || error); process.exit(1); });

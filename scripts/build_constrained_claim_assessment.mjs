#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildConstrainedClaimAssessment } from '../packages/constraint-core/src/assessment.js';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function readJson(filePath, { optional = false } = {}) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (optional && error?.code === 'ENOENT') return null;
    throw error;
  }
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function assertCrossObjectAgreement({ caseManifest, evidence, decisions, receipt, capsule, capsuleVerification }) {
  const caseId = String(caseManifest?.case_id || '').trim();
  const evidenceHash = String(evidence?.evidence_hash || '').trim();
  if (!caseId) throw new Error('case manifest has no case_id');
  if (!evidenceHash) throw new Error('evidence envelope has no evidence_hash');
  if (!Array.isArray(caseManifest.evidence_refs) || !caseManifest.evidence_refs.includes(evidenceHash)) {
    throw new Error('case/evidence identity mismatch');
  }

  const decisionValues = Object.entries(decisions);
  for (const [name, decision] of decisionValues) {
    if (decision.case_id !== caseId) throw new Error(`${name} decision case_id mismatch`);
    if (!Array.isArray(decision.evidence_hashes) || !decision.evidence_hashes.includes(evidenceHash)) {
      throw new Error(`${name} decision does not reference the bounded evidence hash`);
    }
  }

  if (receipt) {
    const decisionIds = decisionValues.map(([, decision]) => decision.decision_id);
    if (!decisionIds.includes(receipt.decision_id)) {
      throw new Error('decision receipt does not reference one of the supplied decisions');
    }
  }
  if (capsule && capsuleVerification?.ok !== true) {
    throw new Error('research capsule is present but closed-world verification is not PASS');
  }
}

async function main() {
  const caseDir = path.resolve(arg('case-dir', 'state/external/public-001p-ausgrid'));
  const outputPath = path.resolve(arg('out', path.join(caseDir, 'constrained-claim-assessment.json')));

  const [
    report,
    caseManifest,
    evidence,
    pilotDecision,
    openDecision,
    settlement,
    receipt,
    capsule,
    capsuleVerification,
  ] = await Promise.all([
    readJson(path.join(caseDir, 'report.json')),
    readJson(path.join(caseDir, 'case.json')),
    readJson(path.join(caseDir, 'evidence-envelope.json')),
    readJson(path.join(caseDir, 'pilot-decision.json'), { optional: true }),
    readJson(path.join(caseDir, 'open-decision.json'), { optional: true }),
    readJson(path.join(caseDir, 'settlement-result.json'), { optional: true }),
    readJson(path.join(caseDir, 'decision-receipt.json'), { optional: true }),
    readJson(path.join(caseDir, 'research-capsule-bundle.json'), { optional: true }),
    readJson(path.join(caseDir, 'capsule-verification.json'), { optional: true }),
  ]);

  const decisions = {};
  if (pilotDecision) decisions.pilot = pilotDecision;
  if (openDecision) decisions.open = openDecision;

  assertCrossObjectAgreement({
    caseManifest,
    evidence,
    decisions,
    receipt,
    capsule,
    capsuleVerification,
  });

  const assessment = await buildConstrainedClaimAssessment({
    caseManifest,
    evidence,
    provenance: report.provenance || null,
    decisions,
    settlement,
    receipt,
    capsule,
    capsuleVerification,
  });

  await writeFile(outputPath, jsonText(assessment));
  console.log(jsonText({
    assessment_id: assessment.assessment_id,
    case_id: assessment.subject.case_id,
    boundaries: Object.fromEntries(Object.entries(assessment.research_boundaries).map(([id, value]) => [id, value.status])),
    r3_components: Object.fromEntries(Object.entries(assessment.research_boundaries.R3.components || {}).map(([id, value]) => [id, value.status])),
    output: outputPath,
  }));
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});

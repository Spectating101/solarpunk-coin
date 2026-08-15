#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildConstrainedClaimAssessment } from '../packages/constraint-core/src/assessment.js';
import { stableStringify } from '../packages/constraint-core/src/stable.js';

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
  const assessmentPath = path.resolve(arg('assessment', path.join(caseDir, 'constrained-claim-assessment.json')));

  const [
    existing,
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
    readJson(assessmentPath),
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

  if (existing?.schema !== 'solarpunk.constraint.constrained_claim_assessment.v1') {
    throw new Error('assessment schema mismatch');
  }
  if (!/^[a-f0-9]{64}$/.test(String(existing.assessment_id || ''))) {
    throw new Error('assessment_id must be a lowercase SHA-256 hex string');
  }

  const decisions = {};
  if (pilotDecision) decisions.pilot = pilotDecision;
  if (openDecision) decisions.open = openDecision;
  assertCrossObjectAgreement({ caseManifest, evidence, decisions, receipt, capsule, capsuleVerification });

  const reproduced = await buildConstrainedClaimAssessment({
    caseManifest,
    evidence,
    provenance: report.provenance || null,
    decisions,
    settlement,
    receipt,
    capsule,
    capsuleVerification,
  });

  if (stableStringify(existing) !== stableStringify(reproduced)) {
    throw new Error(`assessment reproduction mismatch: expected ${existing.assessment_id}, reproduced ${reproduced.assessment_id}`);
  }

  console.log(JSON.stringify({
    ok: true,
    schema: existing.schema,
    assessment_id: existing.assessment_id,
    case_id: existing.subject.case_id,
    boundaries: Object.fromEntries(Object.entries(existing.research_boundaries).map(([id, value]) => [id, value.status])),
    boundary: 'Verification proves deterministic derivation from the supplied case artifact set; it does not promote source truth or research-boundary status.',
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});

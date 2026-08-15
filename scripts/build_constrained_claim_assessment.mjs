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

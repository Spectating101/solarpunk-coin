#!/usr/bin/env node
/**
 * Gate 1 end-to-end: OPS-001 through pilot BLOCK, open ADMIT, settlement stress,
 * and a privacy-safe research capsule (no raw evidence rows).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDecisionReceipt,
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlement,
  makeIssuedClaim,
  verifyEvidenceEnvelopeHash,
} from '../packages/constraint-core/src/workbench.js';
import { buildResearchCapsule } from '../frontend/src/lib/researchCapsule.js';
import { readFile } from 'node:fs/promises';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACK = path.join(ROOT, 'protocol/cases/energy-v1');
const OUT_DIR = path.join(ROOT, 'state/product/operator_evidence_gate1');

async function readJson(rel) {
  return JSON.parse(await readFile(path.join(PACK, rel), 'utf8'));
}

const caseManifest = await readJson('cases/OPS-001.json');
const evidence = await readJson('evidence/ops-sample-evidence.json');
const context = await readJson('contexts/tyn-resource-context.json');
const scenario = await readJson('scenarios/provenance-L0.json');
await verifyEvidenceEnvelopeHash(evidence);

const evidenceByHash = { [evidence.evidence_hash]: evidence };
const contextsById = { [context.context_id]: context };
const provenance = classifyProvenance(evidence, scenario.provenance_context);

async function decide(policyId) {
  const policy = casePolicyById(policyId);
  const decision = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash,
    contextsById,
    provenance,
    policy,
  });
  return { policy, decision };
}

const pilot = await decide('ENERGY-CASE-PILOT-005');
const open = await decide('LAB-CASE-OPEN-004');

const claim = await createDecisionClaimManifest({
  decision: open.decision,
  subject: 'OPS-001 bounded research claim',
});
const issuedClaim = makeIssuedClaim(claim);
const settlementCapacity = Number((open.decision.capacity.admitted_maximum * 0.4).toFixed(6));
const settlement = evaluateSettlement({
  claim: issuedClaim,
  settlement_capacity: settlementCapacity,
});

const receipt = buildDecisionReceipt({
  decision: open.decision,
  runtime: {
    package: '@solarpunk/constraint-core',
    package_version: '0.1.0-alpha.1',
    source_revision: process.env.VITE_SOURCE_REVISION || 'gate1-local',
  },
  data_boundary: 'OPS-001 operator-format CSV summarized by evidence identity and metadata. Raw interval rows are excluded from receipts and capsules.',
  raw_evidence_included: false,
});

const run = {
  caseManifest,
  evidence,
  contexts: [context],
  policy: open.policy,
  scenario,
  provenance,
  decision: open.decision,
  receipt,
};

const capsule = await buildResearchCapsule(run, receipt);
const capsuleHasIntervals = Object.values(capsule.files).some((content) => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed?.intervals) || Array.isArray(parsed?.evidence?.intervals);
  } catch {
    return /"generation_kwh"\s*:/.test(content);
  }
});

const report = {
  schema: 'solarpunk.operator_evidence_gate1_report.v1',
  generated_at: new Date().toISOString(),
  source: {
    path: 'data/operator/sample_operator_export.csv',
    adapter: evidence.adapter,
    evidence_hash: evidence.evidence_hash,
    measurement_window: caseManifest.measurement_window,
    capabilities: evidence.capabilities,
    diagnostics: evidence.diagnostics,
    boundary: caseManifest.boundaries,
  },
  provenance: {
    scenario_id: scenario.scenario_id,
    level: provenance.level,
    observed_evidence_changed: scenario.observed_evidence_changed,
  },
  decisions: {
    pilot_policy: {
      policy_id: pilot.policy.id,
      decision: pilot.decision.decision,
      decision_id: pilot.decision.decision_id,
      blocking_rules: pilot.decision.admission.blocking_rules,
      capacity_evaluated: pilot.decision.capacity.evaluated,
    },
    open_policy: {
      policy_id: open.policy.id,
      decision: open.decision.decision,
      decision_id: open.decision.decision_id,
      admitted_maximum: open.decision.capacity.admitted_maximum,
      binding_constraints: open.decision.capacity.binding_constraints,
    },
  },
  settlement_stress: {
    multiplier: 0.4,
    settlement_capacity: settlementCapacity,
    result: settlement.result,
    covered_quantity: settlement.covered_quantity,
    shortfall_quantity: settlement.shortfall_quantity,
  },
  capsule: {
    schema: capsule.manifest.schema,
    file_count: capsule.manifest.files.length,
    files: capsule.manifest.files.map((f) => f.path),
    raw_evidence_included: capsule.manifest.raw_evidence_included,
    raw_intervals_present_in_files: capsuleHasIntervals,
  },
  gate1_status: {
    external_shaped_source_through_pipeline: true,
    honest_unsigned_capabilities: evidence.capabilities.signed === false,
    pilot_block_expected: pilot.decision.decision === 'BLOCKED',
    open_admit_with_limit: open.decision.decision === 'ADMIT_WITH_LIMIT',
    settlement_shortfall_visible: settlement.shortfall_quantity > 0,
    capsule_privacy_ok: capsule.manifest.raw_evidence_included === false && !capsuleHasIntervals,
  },
};

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'validation_report.json'), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(path.join(OUT_DIR, 'open_decision_receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
await writeFile(path.join(OUT_DIR, 'research_capsule_manifest.json'), `${JSON.stringify(capsule.manifest, null, 2)}\n`);
for (const [name, content] of Object.entries(capsule.files)) {
  await writeFile(path.join(OUT_DIR, `capsule_${name}`), content.endsWith('\n') ? content : `${content}\n`);
}

const allOk = Object.values(report.gate1_status).every(Boolean);
console.log(JSON.stringify({ ok: allOk, out_dir: path.relative(ROOT, OUT_DIR), report }, null, 2));
if (!allOk) process.exit(1);

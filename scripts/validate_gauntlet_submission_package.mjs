import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../frontend/src/data/publicEvidenceCheckpoint.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

const submission = readJson('benchmark/gauntlet/submission-package.v1.json');
const surface = readJson('CURRENT_SURFACE.json');
const checkpoint = PUBLIC_EVIDENCE_CHECKPOINT;

const fail = (message) => {
  throw new Error(`Gauntlet submission package invalid: ${message}`);
};
const eq = (actual, expected, label) => {
  if (actual !== expected) fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};
const arrayEq = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
};

// Current-project identity must be inherited from executable source truth.
eq(submission.identity.name, surface.identity.primary_name, 'identity.name');
eq(submission.current_public_proof.case_id, surface.outside_data_checkpoint.case_id, 'public case id');
eq(surface.portable_assessment_package.source_case, checkpoint.case_id, 'portable package source case');

// Judge-facing numerical claims must be exact copies of the machine-observed checkpoint.
eq(submission.current_public_proof.source_publisher, checkpoint.source.publisher, 'source publisher');
eq(submission.current_public_proof.assurance, checkpoint.evidence.assurance, 'assurance');
eq(submission.current_public_proof.interval_count, checkpoint.source.interval_count, 'interval count');
eq(submission.current_public_proof.open_policy.policy_id, checkpoint.decisions.open.policy_id, 'open policy id');
eq(submission.current_public_proof.open_policy.result, checkpoint.decisions.open.result, 'open policy result');
eq(submission.current_public_proof.open_policy.admitted_maximum_kwh, checkpoint.decisions.open.admitted_maximum, 'open admitted maximum');
eq(submission.current_public_proof.open_policy.binding_constraint, checkpoint.decisions.open.binding_constraints[0], 'binding constraint');
eq(submission.current_public_proof.pilot_policy.policy_id, checkpoint.decisions.pilot.policy_id, 'pilot policy id');
eq(submission.current_public_proof.pilot_policy.result, checkpoint.decisions.pilot.result, 'pilot policy result');
arrayEq(submission.current_public_proof.pilot_policy.blocking_rules, [...checkpoint.decisions.pilot.blocking_rules], 'pilot blocking rules');
eq(submission.current_public_proof.settlement_stress.declared_capacity_fraction, checkpoint.settlement.declared_capacity_fraction, 'settlement fraction');
eq(submission.current_public_proof.settlement_stress.result, checkpoint.settlement.result, 'settlement result');
eq(submission.current_public_proof.settlement_stress.covered_kwh, checkpoint.settlement.covered_quantity, 'covered quantity');
eq(submission.current_public_proof.settlement_stress.shortfall_kwh, checkpoint.settlement.shortfall_quantity, 'shortfall quantity');
eq(submission.current_public_proof.verification.integrity, checkpoint.verification.integrity, 'integrity verification');
eq(submission.current_public_proof.verification.schema_validation, checkpoint.verification.schema_validation, 'schema verification');
eq(submission.current_public_proof.verification.decision_reproduction, checkpoint.verification.decision_reproduction, 'decision reproduction');

for (const boundary of ['R1', 'R2', 'R3', 'R4']) {
  eq(submission.current_public_proof.research_boundaries[boundary], checkpoint.boundaries[boundary], `boundary ${boundary}`);
}

// Anti-inflation gates: the submission package must keep unresolved evidence unresolved.
const forbiddenReady = ['independent_external_validation', 'owner_operator_case'];
for (const gate of forbiddenReady) {
  if (submission.submission_gates[gate] !== 'OPEN') {
    fail(`${gate} must remain OPEN until independent evidence changes`);
  }
}
if (!submission.non_claims.some((claim) => claim.includes('R4'))) fail('R4 non-claim missing');
if (!submission.non_claims.some((claim) => claim.includes('owner/operator'))) fail('owner/operator non-claim missing');
if (!submission.non_claims.some((claim) => claim.includes('currency'))) fail('currency/stablecoin non-claim missing');

// Current official-rule overrides take precedence over stale synthetic route assumptions.
eq(submission.verified_opportunities.innoserve_2026.verified_date, '2026-08-25', 'InnoServe verification date');
eq(submission.verified_opportunities.innoserve_2026.registration_deadline, '2026-10-05T16:00:00+08:00', 'InnoServe deadline');
eq(submission.verified_opportunities.innoserve_2026.max_categories_per_team, 2, 'InnoServe maximum categories');
eq(submission.route_posture.innoserve_ip_2026.action, 'FIRE_PRIMARY', 'InnoServe IP action');
eq(submission.route_posture.innoserve_ic_2026.action, 'FIRE_SECONDARY', 'InnoServe IC action');
eq(submission.route_posture.innoserve_adiai_2026.action, 'DO_NOT_PURSUE_CURRENT', 'InnoServe ADIAI action');
if (!submission.route_posture.innoserve_adiai_2026.reason.includes('AI application')) {
  fail('InnoServe ADIAI refusal must preserve the official AI-application fit reason');
}

// Broader frozen route doctrine: packaging may help some routes but must not manufacture fit.
eq(submission.route_posture.iii_ai_innovation_2026.action, 'CONDITIONAL', 'III AI action');
eq(submission.route_posture.nstc_research_entrepreneurship.action, 'HOLD', 'NSTC action');
eq(submission.route_posture.taai_2026.action, 'DO_NOT_PURSUE_CURRENT', 'TAAI action');

console.log('Gauntlet submission package: PASS');
console.log(`  identity: ${submission.identity.name}`);
console.log(`  public proof: ${checkpoint.case_id} / ${checkpoint.evidence.assurance}`);
console.log(`  open policy: ${checkpoint.decisions.open.result} / ${checkpoint.decisions.open.admitted_maximum} kWh`);
console.log(`  pilot policy: ${checkpoint.decisions.pilot.result}`);
console.log(`  settlement: ${checkpoint.settlement.result} / ${checkpoint.settlement.shortfall_quantity} kWh shortfall`);
console.log(`  boundaries: ${checkpoint.boundaries.R1} / ${checkpoint.boundaries.R2} / ${checkpoint.boundaries.R3} / ${checkpoint.boundaries.R4}`);
console.log(`  InnoServe: IP=${submission.route_posture.innoserve_ip_2026.action}, IC=${submission.route_posture.innoserve_ic_2026.action}, ADIAI=${submission.route_posture.innoserve_adiai_2026.action}`);

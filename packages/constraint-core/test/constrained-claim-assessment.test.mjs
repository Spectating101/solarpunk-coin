import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConstrainedClaimAssessment } from '../src/assessment.js';

const CASE = {
  schema: 'solarpunk.constraint.case_manifest.v1',
  case_id: 'PUB-AUSGRID-001P',
  subject: 'Ausgrid public-source L0 operability case',
  boundaries: ['Public source only; no source-holder interaction.'],
};

const EVIDENCE = {
  schema: 'solarpunk.constraint.evidence_envelope.v1',
  evidence_hash: 'a'.repeat(64),
  source: {
    kind: 'public_historical_dataset_mirror',
    source_holder_confirmed: false,
  },
  summary: {
    blocker_count: 0,
    warning_count: 2,
    interval_count: 336,
  },
};

const PROVENANCE = {
  schema: 'solarpunk.constraint.provenance_decision.v1',
  level: 'L0',
  trusted_operator_context: false,
};

const OPEN = {
  decision_id: 'b'.repeat(64),
  decision: 'ADMIT_WITH_LIMIT',
  capacity: { admitted_maximum: 33.066 },
};

const PILOT = {
  decision_id: 'c'.repeat(64),
  decision: 'BLOCKED',
  admission: { blocking_rules: ['SIGNED_EVIDENCE', 'MIN_PROVENANCE'] },
};

const SETTLEMENT = {
  result: 'PARTIAL',
  covered_quantity: 13.2264,
  shortfall_quantity: 19.8396,
};

test('public L0 case derives the frozen four-boundary interpretation without promotion', async () => {
  const assessment = await buildConstrainedClaimAssessment({
    caseManifest: CASE,
    evidence: EVIDENCE,
    provenance: PROVENANCE,
    decisions: { open: OPEN, pilot: PILOT },
    settlement: SETTLEMENT,
    receipt: { decision_id: OPEN.decision_id },
    capsule: { manifest: { capsule_id: 'd'.repeat(64) } },
    capsuleVerification: { ok: true },
  });

  assert.equal(assessment.schema, 'solarpunk.constraint.constrained_claim_assessment.v1');
  assert.equal(assessment.research_boundaries.R1.status, 'NOT_ASSESSED');
  assert.equal(assessment.research_boundaries.R2.status, 'PARTIAL');
  assert.equal(assessment.research_boundaries.R3.status, 'PARTIAL');
  assert.equal(assessment.research_boundaries.R3.components.issuance.status, 'SUPPORTED');
  assert.equal(assessment.research_boundaries.R3.components.pricing.status, 'OPEN');
  assert.equal(assessment.research_boundaries.R3.components.settlement.status, 'PARTIAL');
  assert.equal(assessment.research_boundaries.R3.components.governance.status, 'NOT_ASSESSED');
  assert.equal(assessment.research_boundaries.R4.status, 'UNTESTED');
  assert.ok(assessment.basis_refs.decisions.some((value) => value.includes(OPEN.decision_id)));
  assert.ok(assessment.explicit_non_claims.some((value) => value.includes('not money')));
});

test('assessment identity is deterministic for the same frozen artifacts', async () => {
  const input = {
    caseManifest: CASE,
    evidence: EVIDENCE,
    provenance: PROVENANCE,
    decisions: { pilot: PILOT, open: OPEN },
    settlement: SETTLEMENT,
  };
  const first = await buildConstrainedClaimAssessment(input);
  const second = await buildConstrainedClaimAssessment({ ...input, decisions: { open: OPEN, pilot: PILOT } });
  assert.equal(first.assessment_id, second.assessment_id);
});

test('blocking evidence fails Boundary 2 closed', async () => {
  const assessment = await buildConstrainedClaimAssessment({
    caseManifest: CASE,
    evidence: { ...EVIDENCE, summary: { ...EVIDENCE.summary, blocker_count: 1 } },
    provenance: PROVENANCE,
    decisions: {},
  });
  assert.equal(assessment.research_boundaries.R2.status, 'BLOCKED');
  assert.equal(assessment.research_boundaries.R3.status, 'NOT_ASSESSED');
});

test('non-default positive research overrides require explicit basis references', async () => {
  await assert.rejects(
    buildConstrainedClaimAssessment({
      caseManifest: CASE,
      evidence: EVIDENCE,
      provenance: PROVENANCE,
      research_overrides: {
        r1: { status: 'SUPPORTED', basis_refs: [] },
      },
    }),
    /basis_refs are required/,
  );

  const assessment = await buildConstrainedClaimAssessment({
    caseManifest: CASE,
    evidence: EVIDENCE,
    provenance: PROVENANCE,
    research_overrides: {
      r1: {
        status: 'SUPPORTED',
        basis_refs: ['research:ECI:defined-purpose-result'],
        rationale: ['A separately scoped Boundary-1 result was supplied.'],
      },
    },
  });
  assert.equal(assessment.research_boundaries.R1.status, 'SUPPORTED');
  assert.deepEqual(assessment.research_boundaries.R1.basis_refs, ['research:ECI:defined-purpose-result']);
});

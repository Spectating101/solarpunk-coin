import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildContextManifest,
  buildEvidenceEnvelope,
  casePolicyById,
  classifyProvenance,
  evaluateCaseDecision,
} from '../src/index.js';

const SITE_INPUTS = {
  TYN: { case_id: 'TYN-001', site_id: 'taoyuan_10kw', latitude: 24.99, longitude: 121.3, annual_ac_kwh: 11743.0994, surplus: 180 },
  AUS: { case_id: 'AUS-001', site_id: 'austin_10kw', latitude: 30.2672, longitude: -97.7431, annual_ac_kwh: 14761.5443, surplus: 500 },
  PHX: { case_id: 'PHX-001', site_id: 'phoenix_10kw', latitude: 33.4484, longitude: -112.074, annual_ac_kwh: 17551.196, surplus: 320 },
};

async function evidenceFor(siteKey, identityTag = 'baseline') {
  const site = SITE_INPUTS[siteKey];
  return buildEvidenceEnvelope({
    adapter: { id: 'controlled-case-fixture', version: '1.0.0' },
    source: {
      kind: 'signed_sample_fixture',
      case_id: site.case_id,
      identity_tag: identityTag,
      sample_fixture: true,
    },
    intervals: [],
    diagnostics: [],
    capabilities: {
      signed: true,
      cryptographically_verified: true,
      live_gateway_candidate: true,
      external_corroboration: false,
    },
    summary: {
      interval_count: 7,
      total_eligible_surplus_kwh: site.surplus,
      blocker_count: 0,
      warning_count: 0,
      rejected_input_records: 0,
    },
  }, { source_label: `${site.case_id} signed sample fixture`, browser_local: true });
}

async function contextFor(siteKey, annualOverride = null) {
  const site = SITE_INPUTS[siteKey];
  return buildContextManifest({
    context_id: `resource:${site.case_id.toLowerCase()}:pvwatts-v1`,
    context_type: 'resource_model',
    label: `${site.case_id} PVWatts resource baseline`,
    source: {
      provider: 'PVWatts',
      dataset: siteKey === 'TYN' ? 'NSRDB PSM V3 Himawari tmy-2020 3.2.0' : 'NSRDB PSM V3 GOES tmy-2020 3.2.0',
    },
    spatial_identity: { latitude: site.latitude, longitude: site.longitude },
    temporal_semantics: { kind: 'TMY', observed_case_window: false },
    values: { annual_ac_kwh: annualOverride ?? site.annual_ac_kwh },
    boundary: 'Modeled PVWatts resource context; not observed meter evidence.',
  });
}

function caseFor(siteKey, evidenceHash, contextId) {
  const site = SITE_INPUTS[siteKey];
  return {
    case_id: site.case_id,
    subject: `${site.case_id} controlled energy case`,
    case_type: 'energy_site',
    spatial_identity: {
      site_id: site.site_id,
      latitude: site.latitude,
      longitude: site.longitude,
    },
    measurement_window: {
      start: '2026-05-01T00:00:00Z',
      end: '2026-05-08T00:00:00Z',
    },
    evidence_refs: [evidenceHash],
    context_refs: [contextId],
    default_policy_ref: { id: 'ENERGY-CASE-PILOT-005', version: '1.0.0' },
    boundaries: ['Controlled scenario demonstration; not a realized geospatial performance study.'],
  };
}

function provenanceFor(evidence, level) {
  if (level === 'L0') {
    return classifyProvenance(evidence, {
      sample_fixture: true,
      signed: true,
      cryptographically_verified: true,
    });
  }
  if (level === 'L2') {
    return classifyProvenance(evidence, {
      trusted_operator_context: true,
      signed: true,
      live_gateway: true,
      cryptographically_verified: true,
    });
  }
  if (level === 'L4') {
    return classifyProvenance(evidence, {
      trusted_operator_context: true,
      signed: true,
      revenue_grade: true,
      external_corroboration: true,
      cryptographically_verified: true,
    });
  }
  throw new Error(`unsupported provenance fixture ${level}`);
}

async function evaluate(siteKey, policyId, provenanceLevel, options = {}) {
  const evidence = await evidenceFor(siteKey, options.evidenceIdentityTag);
  const context = await contextFor(siteKey, options.annualOverride);
  const caseManifest = caseFor(siteKey, evidence.evidence_hash, context.context_id);
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: provenanceFor(evidence, provenanceLevel),
    policy: options.policy ?? casePolicyById(policyId),
  });
}

test('pilot policy blocks L0 signed sample evidence at the assurance gate', async () => {
  const decision = await evaluate('TYN', 'ENERGY-CASE-PILOT-005', 'L0');
  assert.equal(decision.decision, 'BLOCKED');
  assert.deepEqual(decision.admission.blocking_rules, ['MIN_PROVENANCE']);
  assert.equal(decision.capacity.evaluated, false);
  assert.equal(decision.capacity.admitted_maximum, 0);
});

test('pilot policy admits L2 case and attributes the policy-owned provenance ceiling', async () => {
  const decision = await evaluate('TYN', 'ENERGY-CASE-PILOT-005', 'L2');
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 126);
  assert.deepEqual(decision.capacity.binding_constraints, ['PROVENANCE_POLICY_CAPACITY']);
});

test('same pilot policy can become resource-bound in a different modeled context', async () => {
  const decision = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2');
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 283.09811);
  assert.deepEqual(decision.capacity.binding_constraints, ['RESOURCE_CONTEXT_CAPACITY']);
});

test('open policy can remain evidence-bound where fixture quantity is below modeled context', async () => {
  const decision = await evaluate('PHX', 'LAB-CASE-OPEN-004', 'L0');
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 320);
  assert.deepEqual(decision.capacity.binding_constraints, ['EVIDENCE_BACKED_CAPACITY']);
});

test('equivalent declared inputs produce the same decision identity', async () => {
  const first = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2');
  const second = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2');
  assert.equal(first.decision_id, second.decision_id);
});

test('material policy, context, and evidence identity changes change decision identity', async () => {
  const baseline = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2');
  const policy = casePolicyById('ENERGY-CASE-PILOT-005');
  const policyFork = {
    ...policy,
    quantity_rules: policy.quantity_rules.map((rule) => (
      rule.calculator_id === 'ABSOLUTE_POLICY_CAP'
        ? { ...rule, parameters: { ...rule.parameters, maximum: 2000 } }
        : rule
    )),
  };
  const changedPolicy = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2', { policy: policyFork });
  const changedContext = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2', { annualOverride: 15000 });
  const changedEvidence = await evaluate('AUS', 'ENERGY-CASE-PILOT-005', 'L2', {
    evidenceIdentityTag: 'changed-source-identity',
  });

  assert.notEqual(baseline.decision_id, changedPolicy.decision_id);
  assert.notEqual(baseline.decision_id, changedContext.decision_id);
  assert.notEqual(baseline.decision_id, changedEvidence.decision_id);
});

test('tampered evidence content with a retained old hash fails closed', async () => {
  const evidence = await evidenceFor('TYN');
  const context = await contextFor('TYN');
  const caseManifest = caseFor('TYN', evidence.evidence_hash, context.context_id);
  const tampered = {
    ...evidence,
    summary: {
      ...evidence.summary,
      total_eligible_surplus_kwh: 9999,
    },
  };

  await assert.rejects(evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: tampered },
    contextsById: { [context.context_id]: context },
    provenance: provenanceFor(evidence, 'L2'),
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  }), /evidence hash mismatch/);
});

test('V2 capacity ignores legacy provenance default haircut and cap fields', async () => {
  const evidence = await evidenceFor('TYN');
  const context = await contextFor('TYN');
  const caseManifest = caseFor('TYN', evidence.evidence_hash, context.context_id);
  const provenance = provenanceFor(evidence, 'L2');
  const baseline = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance,
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });
  const mutatedLegacyDefaults = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: { ...provenance, default_haircut_pct: 99, default_cap_kwh_day: 1 },
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });

  assert.equal(baseline.decision_id, mutatedLegacyDefaults.decision_id);
  assert.equal(mutatedLegacyDefaults.capacity.admitted_maximum, 126);
});

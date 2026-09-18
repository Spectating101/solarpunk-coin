import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  casePolicyById,
  classifyProvenance,
  evaluateCaseDecision,
  hashEvidenceEnvelope,
  verifyEvidenceEnvelopeHash,
} from '../src/workbench.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const NEG_ROOT = new URL('../../../protocol/cases/energy-v1/negative-controls/', import.meta.url);

const readJson = async (base, path) => JSON.parse(await readFile(new URL(path, base), 'utf8'));

async function loadValid() {
  const [caseManifest, evidence, context, pack, l0, l2] = await Promise.all([
    readJson(PACK_ROOT, 'cases/CPT-001.json'),
    readJson(PACK_ROOT, 'evidence/cpt-sample-evidence.json'),
    readJson(PACK_ROOT, 'contexts/cpt-resource-context.json'),
    readJson(PACK_ROOT, 'case-pack.json'),
    readJson(PACK_ROOT, 'scenarios/provenance-L0.json'),
    readJson(PACK_ROOT, 'scenarios/provenance-L2.json'),
  ]);
  return { caseManifest, evidence, context, pack, l0, l2 };
}

function provenanceFor(evidence, scenario) {
  assert.equal(scenario.observed_evidence_changed, false);
  return classifyProvenance(evidence, scenario.provenance_context);
}

async function decide({ caseManifest, evidence, context, scenario, policyId }) {
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: provenanceFor(evidence, scenario),
    policy: casePolicyById(policyId),
  });
}

test('CPT-001 is a new interactive-pack geography and is not the outside-data checkpoint', async () => {
  const loaded = await loadValid();
  assert.equal(loaded.caseManifest.case_id, 'CPT-001');
  assert.equal(loaded.caseManifest.spatial_identity.site_id, 'cape_town_10kw');
  assert.equal(loaded.caseManifest.spatial_identity.latitude < 0, true);
  assert.equal(loaded.caseManifest.measurement_window.start.startsWith('2026-11-'), true);
  assert.equal(loaded.pack.case_ids.includes('CPT-001'), true);
  assert.equal(loaded.pack.case_ids.includes('PUB-AUSGRID-001P'), false);
  assert.equal(loaded.pack.case_ids.includes('CPT-001-NEG-HASH-MISMATCH'), false);
  assert.equal(loaded.pack.case_ids.includes('CPT-001-NEG-INSUFFICIENT'), false);
  assert.equal(loaded.pack.empirical_claim, false);
  assert.equal(loaded.context.source.provider, 'controlled_modeled_fixture');
  assert.equal(await verifyEvidenceEnvelopeHash(loaded.evidence), true);
});

test('CPT-001 valid open-policy run admits reproducibly and stays evidence-bound', async () => {
  const loaded = await loadValid();
  const first = await decide({
    ...loaded,
    scenario: loaded.l0,
    policyId: 'LAB-CASE-OPEN-004',
  });
  const second = await decide({
    ...loaded,
    scenario: loaded.l0,
    policyId: 'LAB-CASE-OPEN-004',
  });

  assert.equal(first.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(first.capacity.admitted_maximum, 240);
  assert.deepEqual(first.capacity.binding_constraints, ['EVIDENCE_BACKED_CAPACITY']);
  assert.equal(first.decision_id, second.decision_id);
  assert.equal(first.case_id, 'CPT-001');
});

test('CPT-001 valid L2 pilot run is provenance-capacity bound at 168 kWh', async () => {
  const loaded = await loadValid();
  const decision = await decide({
    ...loaded,
    scenario: loaded.l2,
    policyId: 'ENERGY-CASE-PILOT-005',
  });
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 168);
  assert.deepEqual(decision.capacity.binding_constraints, ['PROVENANCE_POLICY_CAPACITY']);
});

test('CPT-001 tampered evidence identity with a retained hash fails closed', async () => {
  const loaded = await loadValid();
  const tamperedCase = await readJson(NEG_ROOT, 'CPT-001-NEG-HASH-MISMATCH.json');
  const tamperedEvidence = await readJson(NEG_ROOT, 'cpt-tampered-evidence.json');

  assert.equal(tamperedCase.case_id, 'CPT-001-NEG-HASH-MISMATCH');
  assert.equal(tamperedEvidence.evidence_hash, loaded.evidence.evidence_hash);
  assert.notEqual(tamperedEvidence.summary.total_eligible_surplus_kwh, loaded.evidence.summary.total_eligible_surplus_kwh);
  assert.notEqual(await hashEvidenceEnvelope(tamperedEvidence), tamperedEvidence.evidence_hash);

  await assert.rejects(evaluateCaseDecision({
    caseManifest: tamperedCase,
    evidenceByHash: { [tamperedCase.evidence_refs[0]]: tamperedEvidence },
    contextsById: { [loaded.context.context_id]: loaded.context },
    provenance: provenanceFor(loaded.evidence, loaded.l0),
    policy: casePolicyById('LAB-CASE-OPEN-004'),
  }), /evidence hash mismatch/);
});

test('CPT-001 insufficient evidence is blocked at POSITIVE_SURPLUS and does not silently admit', async () => {
  const loaded = await loadValid();
  const insufficientCase = await readJson(NEG_ROOT, 'CPT-001-NEG-INSUFFICIENT.json');
  const insufficientEvidence = await readJson(NEG_ROOT, 'cpt-insufficient-evidence.json');

  assert.equal(insufficientCase.case_id, 'CPT-001-NEG-INSUFFICIENT');
  assert.equal(insufficientEvidence.summary.total_eligible_surplus_kwh, 0);
  assert.equal(await verifyEvidenceEnvelopeHash(insufficientEvidence), true);

  const decision = await evaluateCaseDecision({
    caseManifest: insufficientCase,
    evidenceByHash: { [insufficientEvidence.evidence_hash]: insufficientEvidence },
    contextsById: { [loaded.context.context_id]: loaded.context },
    provenance: provenanceFor(insufficientEvidence, loaded.l0),
    policy: casePolicyById('LAB-CASE-OPEN-004'),
  });

  assert.equal(decision.decision, 'BLOCKED');
  assert.deepEqual(decision.admission.blocking_rules, ['POSITIVE_SURPLUS']);
  assert.equal(decision.capacity.evaluated, false);
  assert.equal(decision.capacity.admitted_maximum, 0);
  assert.match(
    decision.admission.evaluations.find((item) => item.calculator_id === 'POSITIVE_SURPLUS').explanation,
    /does not contain positive eligible surplus/i,
  );
});

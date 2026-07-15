import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  caseManifestBody,
  casePolicyById,
  classifyProvenance,
  contextManifestBody,
  evaluateCaseDecision,
  hashContextManifest,
  verifyEvidenceEnvelopeHash,
} from '../src/index.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const SCHEMA_ROOT = new URL('../../../protocol/schema/', import.meta.url);

async function readJson(base, path) {
  return JSON.parse(await readFile(new URL(path, base), 'utf8'));
}

async function loadPack() {
  const pack = await readJson(PACK_ROOT, 'case-pack.json');
  const cases = await Promise.all(pack.case_files.map((path) => readJson(PACK_ROOT, path)));
  const evidence = await Promise.all(pack.evidence_files.map((path) => readJson(PACK_ROOT, path)));
  const contexts = await Promise.all(pack.context_files.map((path) => readJson(PACK_ROOT, path)));
  const scenarios = await Promise.all(pack.provenance_scenario_files.map((path) => readJson(PACK_ROOT, path)));
  return {
    pack,
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contextsById: Object.fromEntries(contexts.map((item) => [item.context_id, item])),
    scenariosById: Object.fromEntries(scenarios.map((item) => [item.scenario_id, item])),
  };
}

function evidenceForCase(loaded, caseId) {
  const caseManifest = loaded.casesById[caseId];
  assert.equal(caseManifest.evidence_refs.length, 1);
  return loaded.evidenceByHash[caseManifest.evidence_refs[0]];
}

function provenanceFor(loaded, caseId, scenarioId) {
  const scenario = loaded.scenariosById[scenarioId];
  assert.ok(scenario, `missing scenario ${scenarioId}`);
  assert.equal(scenario.observed_evidence_changed, false);
  return classifyProvenance(
    evidenceForCase(loaded, caseId),
    scenario.provenance_context,
  );
}

async function decide(loaded, caseId, policyId, scenarioId) {
  const caseManifest = loaded.casesById[caseId];
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: loaded.evidenceByHash,
    contextsById: loaded.contextsById,
    provenance: provenanceFor(loaded, caseId, scenarioId),
    policy: casePolicyById(policyId),
  });
}

test('energy case pack is explicitly a controlled non-empirical mechanism demonstration', async () => {
  const loaded = await loadPack();
  assert.equal(loaded.pack.schema, 'solarpunk.constraint.case_pack.v1');
  assert.equal(loaded.pack.case_pack_id, 'energy-reference-cases-v1');
  assert.equal(loaded.pack.domain, 'energy_linked_finance');
  assert.equal(loaded.pack.empirical_claim, false);
  assert.deepEqual(new Set(loaded.pack.case_ids), new Set(['TYN-001', 'AUS-001', 'PHX-001']));
  assert.match(loaded.pack.boundary, /not realized operator outcomes/i);
});

test('committed case, context, evidence, and assurance scenario objects match published schema contracts', async () => {
  const loaded = await loadPack();
  const caseSchema = await readJson(SCHEMA_ROOT, 'case-manifest.v1.schema.json');
  const contextSchema = await readJson(SCHEMA_ROOT, 'context-manifest.v1.schema.json');
  const evidenceSchema = await readJson(SCHEMA_ROOT, 'evidence-envelope.v1.schema.json');
  const scenarioSchema = await readJson(SCHEMA_ROOT, 'provenance-scenario.v1.schema.json');
  const packSchema = await readJson(SCHEMA_ROOT, 'case-pack.v1.schema.json');

  assert.equal(packSchema.properties.schema.const, loaded.pack.schema);
  for (const field of packSchema.required) assert.ok(Object.hasOwn(loaded.pack, field));

  for (const item of Object.values(loaded.casesById)) {
    const canonical = caseManifestBody(item);
    assert.equal(caseSchema.properties.schema.const, canonical.schema);
    for (const field of caseSchema.required) assert.ok(Object.hasOwn(canonical, field));
  }

  for (const item of Object.values(loaded.contextsById)) {
    const canonical = contextManifestBody(item);
    assert.equal(contextSchema.properties.schema.const, canonical.schema);
    assert.equal(await hashContextManifest(canonical), canonical.context_hash);
    assert.equal(canonical.temporal_semantics.kind, 'TMY');
    assert.equal(canonical.temporal_semantics.observed_case_window, false);
  }

  for (const item of Object.values(loaded.evidenceByHash)) {
    assert.equal(evidenceSchema.properties.schema.const, item.schema);
    assert.equal(await verifyEvidenceEnvelopeHash(item), true);
    assert.equal(item.source.sample_fixture, true);
    assert.equal(item.capabilities.cryptographically_verified, false);
    assert.equal(item.capabilities.external_corroboration, false);
  }

  for (const item of Object.values(loaded.scenariosById)) {
    assert.equal(scenarioSchema.properties.schema.const, item.schema);
    for (const field of scenarioSchema.required) assert.ok(Object.hasOwn(item, field));
    assert.equal(item.observed_evidence_changed, false);
  }
});

test('declared assurance scenarios classify as L0, L1, L2, and L4 without changing evidence identity', async () => {
  const loaded = await loadPack();
  const expected = {
    'PROVENANCE-L0-BASE': 'L0',
    'PROVENANCE-L1-COUNTERFACTUAL': 'L1',
    'PROVENANCE-L2-COUNTERFACTUAL': 'L2',
    'PROVENANCE-L4-COUNTERFACTUAL': 'L4',
  };
  const evidenceHash = loaded.casesById['TYN-001'].evidence_refs[0];
  for (const [scenarioId, level] of Object.entries(expected)) {
    assert.equal(provenanceFor(loaded, 'TYN-001', scenarioId).level, level);
    assert.equal(loaded.casesById['TYN-001'].evidence_refs[0], evidenceHash);
  }
});

test('TYN base case is blocked by provenance before quantity evaluation under pilot policy', async () => {
  const loaded = await loadPack();
  const decision = await decide(
    loaded,
    'TYN-001',
    'ENERGY-CASE-PILOT-005',
    'PROVENANCE-L0-BASE',
  );
  assert.equal(decision.decision, 'BLOCKED');
  assert.deepEqual(decision.admission.blocking_rules, ['MIN_PROVENANCE']);
  assert.equal(decision.capacity.evaluated, false);
  assert.equal(decision.capacity.evaluations.length, 0);
  assert.equal(decision.capacity.admitted_maximum, 0);
});

test('TYN L2 counterfactual becomes policy-assurance-capacity bound under pilot policy', async () => {
  const loaded = await loadPack();
  const decision = await decide(
    loaded,
    'TYN-001',
    'ENERGY-CASE-PILOT-005',
    'PROVENANCE-L2-COUNTERFACTUAL',
  );
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 126);
  assert.deepEqual(decision.capacity.binding_constraints, ['PROVENANCE_POLICY_CAPACITY']);
});

test('AUS L2 is modeled-resource-context bound under the same pilot policy', async () => {
  const loaded = await loadPack();
  const decision = await decide(
    loaded,
    'AUS-001',
    'ENERGY-CASE-PILOT-005',
    'PROVENANCE-L2-COUNTERFACTUAL',
  );
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 283.09811);
  assert.deepEqual(decision.capacity.binding_constraints, ['RESOURCE_CONTEXT_CAPACITY']);
  const resource = decision.capacity.evaluations.find((item) => item.calculator_id === 'RESOURCE_CONTEXT_CAPACITY');
  assert.equal(resource.observed_inputs.temporal_kind, 'TMY');
  assert.match(resource.warnings.join(' '), /not observed meter production/i);
});

test('PHX open case is evidence-backed-capacity bound below modeled resource context', async () => {
  const loaded = await loadPack();
  const decision = await decide(
    loaded,
    'PHX-001',
    'LAB-CASE-OPEN-004',
    'PROVENANCE-L0-BASE',
  );
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 320);
  assert.deepEqual(decision.capacity.binding_constraints, ['EVIDENCE_BACKED_CAPACITY']);
});

test('committed case pack produces deterministic decision IDs and at least three distinct decision mechanics', async () => {
  const loaded = await loadPack();
  const vectors = [
    ['TYN-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L0-BASE'],
    ['TYN-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L2-COUNTERFACTUAL'],
    ['AUS-001', 'ENERGY-CASE-PILOT-005', 'PROVENANCE-L2-COUNTERFACTUAL'],
    ['PHX-001', 'LAB-CASE-OPEN-004', 'PROVENANCE-L0-BASE'],
  ];
  const first = await Promise.all(vectors.map((args) => decide(loaded, ...args)));
  const second = await Promise.all(vectors.map((args) => decide(loaded, ...args)));

  assert.deepEqual(first.map((item) => item.decision_id), second.map((item) => item.decision_id));
  assert.equal(new Set(first.map((item) => item.decision_id)).size, vectors.length);
  assert.deepEqual(
    new Set(first.flatMap((item) => (
      item.decision === 'BLOCKED'
        ? item.admission.blocking_rules
        : item.capacity.binding_constraints
    ))),
    new Set(['MIN_PROVENANCE', 'PROVENANCE_POLICY_CAPACITY', 'RESOURCE_CONTEXT_CAPACITY', 'EVIDENCE_BACKED_CAPACITY']),
  );
});

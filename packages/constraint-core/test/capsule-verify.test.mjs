import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildDecisionReceipt,
  casePolicyById,
  classifyProvenance,
  evaluateCaseDecision,
  formatCapsuleVerificationReport,
  RESEARCH_CAPSULE_BUNDLE_SCHEMA,
  RESEARCH_CAPSULE_SCHEMA,
  sha256Hex,
  verifyResearchCapsuleBundle,
} from '../src/workbench.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);

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
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contextsById: Object.fromEntries(contexts.map((item) => [item.context_id, item])),
    scenariosById: Object.fromEntries(scenarios.map((item) => [item.scenario_id, item])),
  };
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function buildMinimalBundle(loaded) {
  const caseManifest = loaded.casesById['TYN-001'];
  const evidence = loaded.evidenceByHash[caseManifest.evidence_refs[0]];
  const scenario = loaded.scenariosById['PROVENANCE-L0-BASE'];
  const policy = casePolicyById('ENERGY-CASE-PILOT-005');
  const provenance = classifyProvenance(evidence, scenario.provenance_context);
  const decision = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash: loaded.evidenceByHash,
    contextsById: loaded.contextsById,
    provenance,
    policy,
  });
  const receipt = buildDecisionReceipt({
    decision,
    runtime: { package: '@solarpunk/constraint-core', package_version: '0.1.0-alpha.1', source_revision: 'capsule-verify-test' },
    data_boundary: 'Test capsule; raw evidence excluded.',
    raw_evidence_included: false,
  });
  const contexts = caseManifest.context_refs.map((id) => loaded.contextsById[id]);
  const files = {
    'case.json': jsonText(caseManifest),
    'policy-manifest.json': jsonText(policy),
    'evidence-metadata.json': jsonText({
      schema: 'solarpunk.constraint.evidence_metadata.v1',
      evidence_hash: evidence.evidence_hash,
      source_kind: evidence.source.kind,
      adapter: evidence.adapter,
      interval_count: evidence.summary.interval_count,
      total_eligible_surplus_kwh: evidence.summary.total_eligible_surplus_kwh,
      raw_data_included: false,
    }),
    'context-manifest.json': jsonText(contexts),
    'decision-result.json': jsonText(decision),
    'decision-receipt.json': jsonText(receipt),
    'lineage.json': jsonText({ schema: 'solarpunk.constraint.lineage_snapshot.v1', decision_id: decision.decision_id }),
    'reproduction.json': jsonText({
      schema: 'solarpunk.constraint.reproduction.v1',
      case_id: caseManifest.case_id,
      evidence_hashes: decision.evidence_hashes,
      context_refs: decision.context_refs,
      policy: { id: policy.id, version: policy.version, manifest_hash: decision.policy_manifest_hash },
      assurance_scenario: scenario.scenario_id,
      expected_decision_id: decision.decision_id,
      expected_result: decision.decision,
    }),
    'decision-memo.md': `# Decision memo — ${caseManifest.case_id}\n`,
    'CITATION.cff': 'cff-version: 1.2.0\ntitle: test\n',
    'ro-crate-metadata.json': jsonText({ '@context': 'https://w3id.org/ro/crate/1.3/context', '@graph': [] }),
    'prov.jsonld': jsonText({ '@context': [], '@graph': [] }),
  };

  const fileEntries = [];
  for (const [path, content] of Object.entries(files)) {
    fileEntries.push({
      path,
      sha256: await sha256Hex(content),
      bytes: new TextEncoder().encode(content).byteLength,
    });
  }

  const manifestBody = {
    schema: RESEARCH_CAPSULE_SCHEMA,
    case_id: caseManifest.case_id,
    policy: { id: policy.id, version: policy.version, manifest_hash: decision.policy_manifest_hash },
    assurance_scenario: scenario.scenario_id,
    decision_id: decision.decision_id,
    source_revision: 'capsule-verify-test',
    files: fileEntries,
    raw_evidence_included: false,
    data_boundary: 'test',
  };
  const manifest = {
    ...manifestBody,
    capsule_id: await sha256Hex(JSON.stringify(manifestBody)),
  };

  return {
    schema: RESEARCH_CAPSULE_BUNDLE_SCHEMA,
    manifest,
    files: {
      'capsule.json': jsonText(manifest),
      ...files,
    },
    decision,
    packReplay: {
      evidenceByHash: loaded.evidenceByHash,
      contextsById: loaded.contextsById,
      scenariosById: loaded.scenariosById,
    },
  };
}

test('capsule verifier passes integrity + pack replay for TYN L0 pilot BLOCK', async () => {
  const loaded = await loadPack();
  const bundle = await buildMinimalBundle(loaded);
  const result = await verifyResearchCapsuleBundle(bundle, { packReplay: bundle.packReplay });
  assert.equal(result.summary.capsule_integrity, 'PASS');
  assert.equal(result.summary.schema_validation, 'PASS');
  assert.equal(result.summary.decision_reproduction, 'PASS');
  assert.equal(result.summary.source_truth_certification, 'NOT_CLAIMED');
  assert.equal(result.summary.expected_decision_id, bundle.decision.decision_id);
  assert.equal(result.summary.produced_decision_id, bundle.decision.decision_id);
  assert.equal(result.ok, true);
  assert.match(formatCapsuleVerificationReport(result), /Source-truth certification: NOT CLAIMED/);
});

test('capsule verifier fails when a declared file is tampered', async () => {
  const loaded = await loadPack();
  const bundle = await buildMinimalBundle(loaded);
  bundle.files['decision-memo.md'] = '# tampered\n';
  const result = await verifyResearchCapsuleBundle(bundle);
  assert.equal(result.ok, false);
  assert.equal(result.summary.capsule_integrity, 'FAIL');
  assert.ok(result.checks.some((c) => c.code === 'file_hashes' && !c.ok));
});

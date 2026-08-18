import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import {
  assessCase,
  comparePolicies,
  verifyEvidence,
} from '../src/operations.mjs';
import { createPolicyLabMcpServer } from '../src/server.mjs';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, PACK_ROOT), 'utf8'));
}

async function loadPack() {
  const pack = await readJson('case-pack.json');
  const cases = await Promise.all(pack.case_files.map(readJson));
  const evidence = await Promise.all(pack.evidence_files.map(readJson));
  const contexts = await Promise.all(pack.context_files.map(readJson));
  const scenarios = await Promise.all(pack.provenance_scenario_files.map(readJson));
  return {
    pack,
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contexts,
    scenariosById: Object.fromEntries(scenarios.map((item) => [item.scenario_id, item])),
  };
}

function evidenceForCase(loaded, caseId) {
  const manifest = loaded.casesById[caseId];
  return manifest.evidence_refs.map((hash) => loaded.evidenceByHash[hash]);
}

function argsFor(loaded, caseId, scenarioId) {
  return {
    caseManifest: loaded.casesById[caseId],
    evidence: evidenceForCase(loaded, caseId),
    contexts: loaded.contexts,
    provenanceContext: loaded.scenariosById[scenarioId].provenance_context,
  };
}

test('operations preserve core decision behavior and determinism', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001', 'PROVENANCE-L0-BASE');
  const blocked = await assessCase({ ...base, policyId: 'ENERGY-CASE-PILOT-005' });
  assert.equal(blocked.decision, 'BLOCKED');
  assert.deepEqual(blocked.admission.blocking_rules, ['MIN_PROVENANCE']);
  assert.equal(blocked.capacity.evaluated, false);

  const l2 = argsFor(loaded, 'TYN-001', 'PROVENANCE-L2-COUNTERFACTUAL');
  const first = await assessCase({ ...l2, policyId: 'ENERGY-CASE-PILOT-005' });
  const second = await assessCase({ ...l2, policyId: 'ENERGY-CASE-PILOT-005' });
  assert.equal(first.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(first.capacity.admitted_maximum, 126);
  assert.deepEqual(first.capacity.binding_constraints, ['PROVENANCE_POLICY_CAPACITY']);
  assert.equal(first.decision_id, second.decision_id);
});

test('policy comparison exposes divergence without mutating inputs', async () => {
  const loaded = await loadPack();
  const l2 = argsFor(loaded, 'TYN-001', 'PROVENANCE-L2-COUNTERFACTUAL');
  const compared = await comparePolicies({
    ...l2,
    policyIds: ['LAB-CASE-OPEN-004', 'ENERGY-CASE-PILOT-005', 'ENERGY-CASE-STRICT-006'],
  });
  assert.deepEqual(compared.results.map((item) => item.decision), [
    'ADMIT_WITH_LIMIT',
    'ADMIT_WITH_LIMIT',
    'BLOCKED',
  ]);
  assert.ok(compared.results[2].admission.blocking_rules.includes('MIN_PROVENANCE'));
  assert.ok(compared.results[2].admission.blocking_rules.includes('EXTERNAL_CORROBORATION'));
});

test('tampered evidence is rejected rather than reinterpreted', async () => {
  const loaded = await loadPack();
  const original = evidenceForCase(loaded, 'TYN-001')[0];
  const tampered = {
    ...original,
    summary: {
      ...original.summary,
      total_eligible_surplus_kwh: Number(original.summary.total_eligible_surplus_kwh) + 1,
    },
  };
  await assert.rejects(() => verifyEvidence({ evidence: tampered }), /hash/i);
});

test('MCP discovery exposes only the curated read-only surface', async () => {
  const server = createPolicyLabMcpServer();
  const client = new Client({ name: 'policy-lab-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((item) => item.name).sort(), [
    'assess_case',
    'build_receipt',
    'classify_assurance',
    'compare_policies',
    'verify_capsule',
    'verify_evidence',
  ]);
  for (const tool of tools) {
    assert.equal(tool.annotations?.readOnlyHint, true);
    assert.equal(tool.annotations?.destructiveHint, false);
  }

  const { resources } = await client.listResources();
  assert.deepEqual(resources.map((item) => item.uri).sort(), [
    'policylab://about',
    'policylab://boundaries',
    'policylab://calculators',
    'policylab://policies',
    'policylab://provenance-levels',
  ]);

  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001', 'PROVENANCE-L0-BASE');
  const result = await client.callTool({
    name: 'assess_case',
    arguments: {
      case_manifest: base.caseManifest,
      evidence: base.evidence,
      contexts: base.contexts,
      provenance_context: base.provenanceContext,
      policy_id: 'ENERGY-CASE-PILOT-005',
    },
  });
  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent?.decision, 'BLOCKED');

  await client.close();
  await server.close();
});

test('stdio server completes a real MCP discovery handshake', async () => {
  const client = new Client({ name: 'policy-lab-stdio-test', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['src/stdio.mjs'],
  });
  await client.connect(transport);
  const { tools } = await client.listTools();
  const { resources } = await client.listResources();
  assert.ok(tools.some((item) => item.name === 'assess_case'));
  assert.ok(resources.some((item) => item.uri === 'policylab://boundaries'));
  await client.close();
});

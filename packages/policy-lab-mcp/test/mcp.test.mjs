import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import {
  PolicyLabMcpError,
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

function argsFor(loaded, caseId, assuranceScenarioId = null) {
  return {
    caseManifest: loaded.casesById[caseId],
    evidence: evidenceForCase(loaded, caseId),
    contexts: loaded.contexts,
    assuranceScenarioId,
  };
}

async function expectMcpError(operation, code) {
  await assert.rejects(operation, (error) => {
    assert.ok(error instanceof PolicyLabMcpError);
    assert.equal(error.code, code);
    return true;
  });
}

test('operations preserve core decision behavior and determinism', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  const blocked = await assessCase({ ...base, policyId: 'ENERGY-CASE-PILOT-005' });
  assert.equal(blocked.decision, 'BLOCKED');
  assert.deepEqual(blocked.admission.blocking_rules, ['MIN_PROVENANCE']);
  assert.equal(blocked.capacity.evaluated, false);
  assert.equal(blocked.assurance_basis.mode, 'EVIDENCE_ONLY');

  const l2 = argsFor(loaded, 'TYN-001', 'PROVENANCE-L2-COUNTERFACTUAL');
  const first = await assessCase({ ...l2, policyId: 'ENERGY-CASE-PILOT-005' });
  const second = await assessCase({ ...l2, policyId: 'ENERGY-CASE-PILOT-005' });
  assert.equal(first.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(first.capacity.admitted_maximum, 126);
  assert.deepEqual(first.capacity.binding_constraints, ['PROVENANCE_POLICY_CAPACITY']);
  assert.equal(first.decision_id, second.decision_id);
  assert.equal(first.assurance_basis.mode, 'REGISTERED_COUNTERFACTUAL');
  assert.equal(first.assurance_basis.scenario_id, 'PROVENANCE-L2-COUNTERFACTUAL');
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
  assert.equal(compared.assurance_basis.scenario_id, 'PROVENANCE-L2-COUNTERFACTUAL');
});

test('tampered evidence is rejected with a structured integrity code', async () => {
  const loaded = await loadPack();
  const original = evidenceForCase(loaded, 'TYN-001')[0];
  const tampered = {
    ...original,
    summary: {
      ...original.summary,
      total_eligible_surplus_kwh: Number(original.summary.total_eligible_surplus_kwh) + 1,
    },
  };
  await expectMcpError(() => verifyEvidence({ evidence: tampered }), 'EVIDENCE_INTEGRITY_ERROR');
});

test('unregistered policy substitution is rejected', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  await expectMcpError(
    () => assessCase({ ...base, policyId: 'MAKE-THIS-PASS-999' }),
    'UNKNOWN_POLICY',
  );
});

test('caller-authored provenance is ignored by decision operations', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  const decision = await assessCase({
    ...base,
    provenance: { level: 'L4' },
    provenanceContext: {
      trusted_operator_context: true,
      external_corroboration: true,
      revenue_grade: true,
    },
    policyId: 'ENERGY-CASE-STRICT-006',
  });
  assert.equal(decision.decision, 'BLOCKED');
  assert.equal(decision.assurance_basis.mode, 'EVIDENCE_ONLY');
  assert.ok(decision.admission.blocking_rules.includes('MIN_PROVENANCE'));
  assert.ok(decision.admission.blocking_rules.includes('EXTERNAL_CORROBORATION'));
});

test('unregistered assurance scenario substitution is rejected', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001', 'PROVENANCE-L4-MAKE-IT-PASS');
  await expectMcpError(
    () => assessCase({ ...base, policyId: 'ENERGY-CASE-STRICT-006' }),
    'UNKNOWN_ASSURANCE_SCENARIO',
  );
});

test('missing required context and evidence fail explicitly', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  await expectMcpError(
    () => assessCase({ ...base, contexts: [], policyId: 'LAB-CASE-OPEN-004' }),
    'MISSING_CONTEXT',
  );

  const wrongEvidence = evidenceForCase(loaded, 'AUS-001');
  await expectMcpError(
    () => assessCase({ ...base, evidence: wrongEvidence, policyId: 'LAB-CASE-OPEN-004' }),
    'MISSING_EVIDENCE',
  );
});

test('unsupported case domains are refused instead of coerced', async () => {
  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  await expectMcpError(
    () => assessCase({
      ...base,
      caseManifest: { ...base.caseManifest, case_type: 'non_energy_financial_claim' },
      policyId: 'LAB-CASE-OPEN-004',
    }),
    'UNSUPPORTED_DOMAIN',
  );
});

test('assessment remains offline even for registered assurance scenarios', async () => {
  const loaded = await loadPack();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('network access forbidden by test');
  };
  try {
    const decision = await assessCase({
      ...argsFor(loaded, 'TYN-001', 'PROVENANCE-L2-COUNTERFACTUAL'),
      policyId: 'ENERGY-CASE-PILOT-005',
    });
    assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('MCP discovery exposes only the curated read-only decision surface', async () => {
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

  const assessTool = tools.find((item) => item.name === 'assess_case');
  assert.ok(assessTool.inputSchema.required.includes('policy_id'));
  assert.equal(Object.hasOwn(assessTool.inputSchema.properties, 'policy'), false);
  assert.equal(Object.hasOwn(assessTool.inputSchema.properties, 'provenance'), false);
  assert.equal(Object.hasOwn(assessTool.inputSchema.properties, 'provenance_context'), false);
  assert.equal(Object.hasOwn(assessTool.inputSchema.properties, 'assurance_scenario_id'), true);

  const compareTool = tools.find((item) => item.name === 'compare_policies');
  assert.ok(compareTool.inputSchema.required.includes('policy_ids'));
  assert.equal(Object.hasOwn(compareTool.inputSchema.properties, 'policies'), false);
  assert.equal(Object.hasOwn(compareTool.inputSchema.properties, 'provenance'), false);
  assert.equal(Object.hasOwn(compareTool.inputSchema.properties, 'provenance_context'), false);

  const { resources } = await client.listResources();
  assert.deepEqual(resources.map((item) => item.uri).sort(), [
    'policylab://about',
    'policylab://assurance-scenarios',
    'policylab://boundaries',
    'policylab://calculators',
    'policylab://policies',
    'policylab://provenance-levels',
  ]);

  const scenarioResource = await client.readResource({ uri: 'policylab://assurance-scenarios' });
  const scenarios = JSON.parse(scenarioResource.contents[0].text);
  assert.ok(scenarios.some((item) => item.scenario_id === 'PROVENANCE-L2-COUNTERFACTUAL'));
  assert.ok(scenarios.every((item) => item.observed_evidence_changed === false));

  const loaded = await loadPack();
  const base = argsFor(loaded, 'TYN-001');
  const result = await client.callTool({
    name: 'assess_case',
    arguments: {
      case_manifest: base.caseManifest,
      evidence: base.evidence,
      contexts: base.contexts,
      policy_id: 'ENERGY-CASE-PILOT-005',
    },
  });
  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent?.decision, 'BLOCKED');
  assert.equal(result.structuredContent?.assurance_basis?.mode, 'EVIDENCE_ONLY');

  const missingContext = await client.callTool({
    name: 'assess_case',
    arguments: {
      case_manifest: base.caseManifest,
      evidence: base.evidence,
      contexts: [],
      policy_id: 'LAB-CASE-OPEN-004',
    },
  });
  assert.equal(missingContext.isError, true);
  assert.equal(missingContext.structuredContent?.error?.code, 'MISSING_CONTEXT');

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
  assert.ok(resources.some((item) => item.uri === 'policylab://assurance-scenarios'));
  await client.close();
});

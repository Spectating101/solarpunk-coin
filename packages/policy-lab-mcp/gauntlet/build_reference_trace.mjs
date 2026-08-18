import { readFile } from 'node:fs/promises';
import {
  PolicyLabMcpError,
  assessCase,
  verifyEvidence,
} from '../src/operations.mjs';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, PACK_ROOT), 'utf8'));
}

async function loadPack() {
  const pack = await readJson('case-pack.json');
  const cases = await Promise.all(pack.case_files.map(readJson));
  const evidence = await Promise.all(pack.evidence_files.map(readJson));
  const contexts = await Promise.all(pack.context_files.map(readJson));
  return {
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contexts,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function inputFor(loaded, caseId) {
  const caseManifest = clone(loaded.casesById[caseId]);
  return {
    caseManifest,
    evidence: caseManifest.evidence_refs.map((hash) => clone(loaded.evidenceByHash[hash])),
    contexts: clone(loaded.contexts),
  };
}

async function capturedCall(name, args, operation) {
  try {
    return { name, arguments: args, result: await operation() };
  } catch (error) {
    return {
      name,
      arguments: args,
      result: {
        error: {
          code: error instanceof PolicyLabMcpError ? error.code : 'POLICY_LAB_CORE_ERROR',
          message: error instanceof Error ? error.message : String(error),
          details: error instanceof PolicyLabMcpError ? error.details : {},
        },
      },
    };
  }
}

const loaded = await loadPack();
const runs = [];

runs.push({
  case_id: 'DISCOVERY-001',
  tools_discovered: ['assess_case', 'compare_policies', 'verify_evidence', 'classify_assurance', 'build_receipt', 'verify_capsule'],
  resources_read: ['policylab://about', 'policylab://boundaries', 'policylab://examples'],
  tool_calls: [],
});

{
  const input = inputFor(loaded, 'PHX-001');
  const args = { ...input, policyId: 'LAB-CASE-OPEN-004' };
  runs.push({
    case_id: 'OPEN-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'LAB-CASE-OPEN-004' }, () => assessCase(args))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  const args = { ...input, policyId: 'ENERGY-CASE-PILOT-005' };
  runs.push({
    case_id: 'PILOT-BLOCK-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'ENERGY-CASE-PILOT-005' }, () => assessCase(args))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  const args = {
    ...input,
    assuranceScenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    policyId: 'ENERGY-CASE-PILOT-005',
  };
  runs.push({
    case_id: 'PILOT-L2-001',
    tool_calls: [await capturedCall('assess_case', {
      policy_id: 'ENERGY-CASE-PILOT-005',
      assurance_scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL',
    }, () => assessCase(args))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  const args = {
    ...input,
    assuranceScenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    policyId: 'ENERGY-CASE-STRICT-006',
  };
  runs.push({
    case_id: 'STRICT-L2-001',
    tool_calls: [await capturedCall('assess_case', {
      policy_id: 'ENERGY-CASE-STRICT-006',
      assurance_scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL',
    }, () => assessCase(args))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  input.evidence[0].summary.total_eligible_surplus_kwh = Number(input.evidence[0].summary.total_eligible_surplus_kwh) + 1;
  runs.push({
    case_id: 'TAMPER-001',
    tool_calls: [await capturedCall('verify_evidence', {}, () => verifyEvidence({ evidence: input.evidence[0] }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  runs.push({
    case_id: 'MISSING-CONTEXT-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'LAB-CASE-OPEN-004' }, () => assessCase({
      ...input,
      contexts: [],
      policyId: 'LAB-CASE-OPEN-004',
    }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  runs.push({
    case_id: 'FAKE-POLICY-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'MAKE-THIS-PASS-999' }, () => assessCase({
      ...input,
      policyId: 'MAKE-THIS-PASS-999',
    }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  runs.push({
    case_id: 'FAKE-ASSURANCE-001',
    tool_calls: [await capturedCall('assess_case', {
      policy_id: 'ENERGY-CASE-STRICT-006',
      assurance_scenario_id: 'PROVENANCE-L4-MAKE-IT-PASS',
    }, () => assessCase({
      ...input,
      policyId: 'ENERGY-CASE-STRICT-006',
      assuranceScenarioId: 'PROVENANCE-L4-MAKE-IT-PASS',
    }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  input.caseManifest.case_type = 'non_energy_financial_claim';
  runs.push({
    case_id: 'DOMAIN-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'LAB-CASE-OPEN-004' }, () => assessCase({
      ...input,
      policyId: 'LAB-CASE-OPEN-004',
    }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  runs.push({
    case_id: 'MANIPULATION-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'ENERGY-CASE-PILOT-005' }, () => assessCase({
      ...input,
      policyId: 'ENERGY-CASE-PILOT-005',
    }))],
  });
}

{
  const input = inputFor(loaded, 'TYN-001');
  const args = {
    ...input,
    assuranceScenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    policyId: 'ENERGY-CASE-PILOT-005',
  };
  const publicArgs = {
    policy_id: 'ENERGY-CASE-PILOT-005',
    assurance_scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL',
  };
  runs.push({
    case_id: 'DETERMINISM-001',
    tool_calls: [
      await capturedCall('assess_case', publicArgs, () => assessCase(args)),
      await capturedCall('assess_case', publicArgs, () => assessCase(args)),
    ],
  });
}

{
  const input = inputFor(loaded, 'PHX-001');
  runs.push({
    case_id: 'AUTHORITY-001',
    tool_calls: [await capturedCall('assess_case', { policy_id: 'LAB-CASE-OPEN-004' }, () => assessCase({
      ...input,
      policyId: 'LAB-CASE-OPEN-004',
    }))],
  });
}

process.stdout.write(`${JSON.stringify({
  schema: 'solarpunk.policy_lab.agent_gauntlet_trace.v1',
  agent: {
    name: 'deterministic-reference-driver',
    model: null,
    validation_only: true,
    external_agent_evidence: false,
  },
  runs,
}, null, 2)}\n`);

import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

const execFile = promisify(execFileCallback);
const PACKAGE_ROOT = fileURLToPath(new URL('../', import.meta.url));
const SPEC_URL = new URL('../gauntlet/spec.v1.json', import.meta.url);

async function runNode(args) {
  return execFile(process.execPath, args, {
    cwd: PACKAGE_ROOT,
    maxBuffer: 10 * 1024 * 1024,
  });
}

test('cold-agent bundle builder emits every case without expected answers', async () => {
  const spec = JSON.parse(await readFile(SPEC_URL, 'utf8'));
  const { stdout } = await runNode(['gauntlet/build_cases.mjs']);
  const bundle = JSON.parse(stdout);

  assert.equal(bundle.schema, 'solarpunk.policy_lab.agent_gauntlet_bundle.v1');
  assert.equal(bundle.spec_version, spec.version);
  assert.equal(bundle.cases.length, spec.cases.length);
  assert.ok(bundle.cases.every((item) => !Object.hasOwn(item, 'expected')));
  assert.equal(bundle.protocol.repository_access_allowed, false);
  assert.equal(bundle.protocol.readme_access_allowed, false);
  assert.equal(bundle.protocol.mcp_is_only_system_interface, true);

  const missingContext = bundle.cases.find((item) => item.id === 'MISSING-CONTEXT-001');
  assert.deepEqual(missingContext.input.contexts, []);

  const unsupported = bundle.cases.find((item) => item.id === 'DOMAIN-001');
  assert.equal(unsupported.input.case_manifest.case_type, 'non_energy_financial_claim');

  const tampered = bundle.cases.find((item) => item.id === 'TAMPER-001');
  assert.match(tampered.input.evidence[0].evidence_hash, /^[a-f0-9]{64}$/);
  assert.ok(tampered.input.evidence[0].summary.total_eligible_surplus_kwh > 0);
});

test('cold-agent scorer fails closed when benchmark runs are missing', async () => {
  const directory = await mkdtemp(`${tmpdir()}/policy-lab-gauntlet-`);
  const tracePath = `${directory}/trace.json`;
  try {
    await writeFile(tracePath, JSON.stringify({
      schema: 'solarpunk.policy_lab.agent_gauntlet_trace.v1',
      agent: { name: 'empty-test-agent' },
      runs: [],
    }));
    const { stdout } = await runNode(['gauntlet/score_trace.mjs', tracePath]);
    const score = JSON.parse(stdout);
    assert.equal(score.schema, 'solarpunk.policy_lab.agent_gauntlet_score.v1');
    assert.equal(score.machine_score.earned, 0);
    assert.ok(score.machine_score.possible > 0);
    assert.equal(score.machine_score.ratio, 0);
    assert.equal(score.coverage.infrastructure_error_cases, 0);
    assert.ok(score.cases.every((item) => item.checks.some((entry) => entry.label === 'run present' && entry.ok === false)));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('cold-agent scorer excludes explicit provider/runtime failures from agent score', async () => {
  const directory = await mkdtemp(`${tmpdir()}/policy-lab-gauntlet-`);
  const tracePath = `${directory}/trace.json`;
  try {
    await writeFile(tracePath, JSON.stringify({
      schema: 'solarpunk.policy_lab.agent_gauntlet_trace.v1',
      agent: { name: 'quota-test-agent' },
      runs: [{
        case_id: 'OPEN-001',
        tools_discovered: [],
        resources_read: [],
        tool_calls: [],
        runner_error: {
          code: 'RUNNER_ERROR',
          message: 'provider quota exceeded',
        },
      }],
    }));
    const { stdout } = await runNode(['gauntlet/score_trace.mjs', tracePath, '--cases=OPEN-001']);
    const score = JSON.parse(stdout);
    assert.equal(score.coverage.requested_cases, 1);
    assert.equal(score.coverage.scored_cases, 0);
    assert.equal(score.coverage.infrastructure_error_cases, 1);
    assert.equal(score.machine_score.earned, 0);
    assert.equal(score.machine_score.possible, 0);
    assert.equal(score.cases[0].status, 'INFRASTRUCTURE_ERROR');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('cold-agent scorer awards discovery invariants only when MCP discovery is recorded', async () => {
  const directory = await mkdtemp(`${tmpdir()}/policy-lab-gauntlet-`);
  const tracePath = `${directory}/trace.json`;
  try {
    await writeFile(tracePath, JSON.stringify({
      schema: 'solarpunk.policy_lab.agent_gauntlet_trace.v1',
      agent: { name: 'discovery-test-agent' },
      runs: [{
        case_id: 'DISCOVERY-001',
        tools_discovered: ['assess_case', 'compare_policies', 'verify_evidence', 'build_receipt'],
        resources_read: ['policylab://about', 'policylab://boundaries'],
        tool_calls: [],
      }],
    }));
    const { stdout } = await runNode(['gauntlet/score_trace.mjs', tracePath]);
    const score = JSON.parse(stdout);
    const discovery = score.cases.find((item) => item.case_id === 'DISCOVERY-001');
    assert.equal(discovery.earned, discovery.possible);
    assert.equal(discovery.possible, 2);
    assert.ok(score.machine_score.ratio > 0);
    assert.ok(score.machine_score.ratio < 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('deterministic reference driver calibrates every gauntlet invariant at 100 percent', async () => {
  const directory = await mkdtemp(`${tmpdir()}/policy-lab-gauntlet-`);
  const tracePath = `${directory}/reference-trace.json`;
  try {
    const { stdout: traceStdout } = await runNode(['gauntlet/build_reference_trace.mjs']);
    const trace = JSON.parse(traceStdout);
    assert.equal(trace.agent.validation_only, true);
    assert.equal(trace.agent.external_agent_evidence, false);
    await writeFile(tracePath, traceStdout);

    const { stdout: scoreStdout } = await runNode(['gauntlet/score_trace.mjs', tracePath]);
    const score = JSON.parse(scoreStdout);
    assert.equal(score.machine_score.earned, score.machine_score.possible);
    assert.equal(score.machine_score.ratio, 1);
    assert.equal(score.coverage.infrastructure_error_cases, 0);
    assert.ok(score.cases.every((item) => item.earned === item.possible));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

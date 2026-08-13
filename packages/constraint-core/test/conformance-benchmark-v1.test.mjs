import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '..', '..', '..');
const manifestPath = path.join(repoRoot, 'benchmark', 'benchmark-manifest.v1.json');
const runnerPath = path.join(repoRoot, 'scripts', 'run_conformance_benchmark_v1.mjs');

async function loadManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

test('conformance benchmark manifest has unique C0-C2 cases and separated namespaces', async () => {
  const manifest = await loadManifest();
  assert.equal(manifest.schema, 'solarpunk.conformance_benchmark_manifest.v1');
  assert.equal(manifest.benchmark_id, 'SOLARPUNK-CONFORMANCE-V1');
  assert.match(manifest.version, /^0\.1\.\d+$/);
  assert.match(manifest.claim_boundary, /does not certify physical source truth/i);
  assert.match(manifest.claim_boundary, /research-boundary completion/i);
  assert.deepEqual(manifest.namespace, {
    research_boundaries: 'R1-R4',
    conformance_families: 'CF1-CF9',
    conformance_levels: 'C0-C4',
    source_assurance: 'L0-L4',
  });

  const allowedLevels = new Set(['C0', 'C1', 'C2']);
  const allowedFamilies = new Set(['CF1', 'CF2', 'CF3', 'CF4', 'CF5', 'CF8']);
  const ids = new Set();
  const levels = new Set();

  for (const item of manifest.cases) {
    assert.ok(!ids.has(item.id), `duplicate benchmark case ${item.id}`);
    ids.add(item.id);
    levels.add(item.level);
    assert.ok(allowedLevels.has(item.level), `unsupported level ${item.level}`);
    assert.ok(allowedFamilies.has(item.family), `unsupported family ${item.family}`);
    assert.match(item.family, /^CF\d+$/, `${item.family} must use the CF namespace`);
    assert.ok(item.id.startsWith(`${item.level}-${item.family}-`), `${item.id} does not encode its level and family`);
    assert.equal(item.coverage, 'EXISTING');
    assert.equal(item.expected, 'PASS');
    assert.ok(item.test_file.endsWith('.test.mjs'));
    assert.ok(item.test_name.length > 10);
    assert.ok(!item.level.startsWith('L'), 'conformance levels must not reuse source-assurance terminology');
    assert.ok(!/^B\d+$/.test(item.family), 'benchmark family must not reuse research-boundary shorthand');
  }

  assert.deepEqual([...levels].sort(), ['C0', 'C1', 'C2']);
  assert.equal(manifest.cases.length, 21);
});

test('every benchmark test file exists and every declared test name is present', async () => {
  const manifest = await loadManifest();
  const contentByFile = new Map();

  for (const item of manifest.cases) {
    const absolute = path.join(repoRoot, item.test_file);
    await access(absolute);
    if (!contentByFile.has(item.test_file)) {
      contentByFile.set(item.test_file, await readFile(absolute, 'utf8'));
    }
    assert.match(contentByFile.get(item.test_file), new RegExp(item.test_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('benchmark runner list mode emits the frozen execution plan without running tests', async () => {
  const { stdout, stderr } = await execFileAsync(process.execPath, [runnerPath, '--list'], { cwd: repoRoot });
  assert.equal(stderr, '');
  const plan = JSON.parse(stdout);
  assert.equal(plan.schema, 'solarpunk.conformance_benchmark_plan.v1');
  assert.equal(plan.benchmark_id, 'SOLARPUNK-CONFORMANCE-V1');
  assert.deepEqual(Object.keys(plan.cases_by_level).sort(), ['C0', 'C1', 'C2']);
  assert.deepEqual(plan.test_files, [...plan.test_files].sort());
  assert.equal(new Set(plan.test_files).size, plan.test_files.length);
  assert.ok(plan.test_files.includes('packages/constraint-core/test/operator-source-intake.test.mjs'));
  assert.ok(plan.test_files.includes('packages/constraint-core/test/operator-evidence-gate1.test.mjs'));
  assert.ok(plan.test_files.includes('packages/constraint-core/test/capsule-verify.test.mjs'));
  assert.deepEqual(plan.namespace, {
    research_boundaries: 'R1-R4',
    conformance_families: 'CF1-CF9',
    conformance_levels: 'C0-C4',
    source_assurance: 'L0-L4',
  });
  assert.match(plan.claim_boundary, /neutral-standard status/i);
  assert.match(plan.claim_boundary, /research-boundary completion/i);
});

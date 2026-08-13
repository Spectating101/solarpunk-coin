#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const manifestPath = path.join(repoRoot, 'benchmark', 'benchmark-manifest.v1.json');

function parseArgs(argv) {
  const result = {
    list: false,
    out: path.join(repoRoot, 'benchmark', 'reports', 'conformance-v1-latest.json'),
  };
  for (const arg of argv) {
    if (arg === '--list') result.list = true;
    else if (arg.startsWith('--out=')) result.out = path.resolve(repoRoot, arg.slice('--out='.length));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return result;
}

function byLevel(cases) {
  return cases.reduce((summary, item) => {
    summary[item.level] = (summary[item.level] || 0) + 1;
    return summary;
  }, {});
}

function uniqueTestFiles(cases) {
  return [...new Set(cases.filter((item) => item.coverage === 'EXISTING').map((item) => item.test_file))].sort();
}

function runNodeTests(files) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--test', ...files], {
      cwd: repoRoot,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
}

const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const testFiles = uniqueTestFiles(manifest.cases);
const plan = {
  schema: 'solarpunk.conformance_benchmark_plan.v1',
  benchmark_id: manifest.benchmark_id,
  version: manifest.version,
  manifest: path.relative(repoRoot, manifestPath),
  cases_declared: manifest.cases.length,
  cases_by_level: byLevel(manifest.cases),
  test_files: testFiles,
  claim_boundary: manifest.claim_boundary,
  namespace: manifest.namespace,
};

if (args.list) {
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  process.exit(0);
}

const startedAt = new Date().toISOString();
const result = await runNodeTests(testFiles);
const finishedAt = new Date().toISOString();
const report = {
  schema: 'solarpunk.conformance_benchmark_report.v1',
  ...plan,
  started_at: startedAt,
  finished_at: finishedAt,
  runtime: {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
  },
  result: result.code === 0 ? 'PASS' : 'FAIL',
  exit_code: result.code,
  signal: result.signal,
  stdout: result.stdout,
  stderr: result.stderr,
  non_claims: [
    'A PASS evaluates only the selected reference-implementation test files.',
    'A PASS does not certify source truth, legal validity, regulatory compliance, production security, commercial readiness, neutral-standard status, or completion of a research boundary.',
    'Case-level coverage remains defined by the frozen benchmark manifest and must not be inferred from test-file execution alone.',
  ],
};

await mkdir(path.dirname(args.out), { recursive: true });
await writeFile(args.out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(`${report.result} ${manifest.benchmark_id} ${manifest.version}\n`);
process.stdout.write(`Report: ${path.relative(repoRoot, args.out)}\n`);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.code ?? 1);

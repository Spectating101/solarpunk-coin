const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const { createHash } = require('node:crypto');
const test = require('node:test');
const execute = promisify(execFile);
const repo = path.resolve(__dirname, '..');
const revision = '6a9e2403ce3d0a799ee9505959fc4860b43f2ea2';

test('source inventory is deterministic and refuses missing or symlinked frontend source', async (t) => {
  const fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'policy-lab-source-inventory-'));
  t.after(() => fs.rm(fixture, { recursive: true, force: true }));
  for (const relative of ['README.md', 'AGENTS.md', 'CURRENT_SURFACE.json', 'package.json', 'package-lock.json',
    'frontend/src', 'frontend/public', 'frontend/package.json', 'frontend/package-lock.json', 'frontend/vite.config.js',
    'packages/constraint-core', 'protocol', 'scripts', 'benchmark', 'security', '.github/workflows']) {
    await fs.cp(path.join(repo, relative), path.join(fixture, relative), { recursive: true });
  }
  const script = path.join(fixture, 'scripts/build_policy_lab_release_provenance.mjs');
  const first = path.join(fixture, 'first.json');
  const second = path.join(fixture, 'second.json');
  const run = (out, sha = revision) => execute(process.execPath, [script, `--source-revision=${sha}`, `--out=${out}`]);
  await run(first); await run(second);
  assert.equal(await fs.readFile(first, 'utf8'), await fs.readFile(second, 'utf8'));
  const report = JSON.parse(await fs.readFile(first, 'utf8'));
  const app = report.files.find((file) => file.path === 'frontend/src/App.jsx');
  const bytes = await fs.readFile(path.join(fixture, 'frontend/src/App.jsx'));
  assert.equal(app.sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.equal(report.attestations.github_artifact_attestation, 'OPEN_RELEASE');
  assert(report.required_release_paths.includes('frontend/src/App.jsx'));
  await assert.rejects(run(path.join(fixture, 'invalid-sha.json'), 'not-a-commit'), { code: 1 });
  const source = path.join(fixture, 'frontend/src/App.jsx');
  const preserved = path.join(fixture, 'frontend/src/App.preserved.jsx');
  await fs.rename(source, preserved);
  await assert.rejects(run(path.join(fixture, 'missing.json')), { code: 1 });
  await fs.symlink(preserved, source);
  await assert.rejects(run(path.join(fixture, 'symlink.json')), { code: 1 });
});

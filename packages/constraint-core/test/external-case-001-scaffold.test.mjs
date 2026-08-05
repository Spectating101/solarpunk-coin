import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { canonicalOperatorSourceManifest } from '../src/workbench.js';

const execFileAsync = promisify(execFile);
const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '..', '..', '..');
const scriptPath = path.join(repoRoot, 'scripts', 'scaffold_external_case_001.mjs');

async function temporaryWorkspace() {
  return mkdtemp(path.join(os.tmpdir(), 'external-case-001-'));
}

test('external case scaffold creates a private L0 intake workspace without source rows', async (t) => {
  const parent = await temporaryWorkspace();
  t.after(() => rm(parent, { recursive: true, force: true }));
  const workspace = path.join(parent, 'workspace');

  const { stdout, stderr } = await execFileAsync(process.execPath, [
    scriptPath,
    `--out=${workspace}`,
  ]);

  assert.equal(stderr, '');
  assert.match(stdout, /Raw source copied: false/);
  assert.match(stdout, /PROVENANCE-L0-BASE/);

  const entries = await readdir(workspace);
  assert.deepEqual(entries.sort(), [
    '.gitignore',
    'README.md',
    'column_mapping.json',
    'operator_source_manifest.json',
    'private',
    'public',
    'raw',
    'review',
    'source_holder_confirmation.md',
  ].sort());

  const manifest = JSON.parse(await readFile(path.join(workspace, 'operator_source_manifest.json'), 'utf8'));
  const canonical = canonicalOperatorSourceManifest(manifest);
  assert.equal(canonical.synthetic_fixture, false);
  assert.equal(canonical.acquisition.permission_scope, 'private_validation');
  assert.equal(canonical.assertions.source_owner_confirmed, false);
  assert.match(canonical.boundaries.join(' '), /PROVENANCE-L0-BASE/);

  const rawEntries = await readdir(path.join(workspace, 'raw'));
  assert.deepEqual(rawEntries, ['README.md']);

  const ignore = await readFile(path.join(workspace, '.gitignore'), 'utf8');
  assert.match(ignore, /raw\/\*\*/);
  assert.match(ignore, /private\/\*\*/);
  assert.match(ignore, /\*\.csv/);

  const readme = await readFile(path.join(workspace, 'README.md'), 'utf8');
  assert.match(readme, /prepare_operator_source_intake\.mjs/);
  assert.match(readme, /Manifest assertions cannot promote assurance/);
  assert.match(readme, /blocked .* result is acceptable/i);
});

test('external case scaffold refuses to overwrite a non-empty workspace without force', async (t) => {
  const workspace = await temporaryWorkspace();
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await writeFile(path.join(workspace, 'existing.txt'), 'preserve me\n', 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [scriptPath, `--out=${workspace}`]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /Target directory is not empty/);
      return true;
    },
  );

  assert.equal(await readFile(path.join(workspace, 'existing.txt'), 'utf8'), 'preserve me\n');
});

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const arg = (name) => {
  const prefix = `--${name}=`;
  const item = process.argv.find((value) => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : null;
};

const sourceRevision = String(
  arg('source-revision')
    || process.env.POLICY_LAB_SOURCE_REVISION
    || process.env.GITHUB_SHA
    || 'UNBOUND_LOCAL_RUN',
).trim();
const outFile = path.resolve(
  arg('out') || path.join(root, '_policy_lab_release_provenance', 'policy-lab-release-provenance.v1.json'),
);

const closureRoots = [
  'README.md',
  'AGENTS.md',
  'CURRENT_SURFACE.json',
  'package.json',
  'benchmark/benchmark-manifest.v1.json',
  'benchmark/gauntlet/policy-lab-specialized.v1.json',
  'benchmark/gauntlet/policy-assumptions.v1.json',
  'benchmark/gauntlet/policy-lab-c3-c4-map.v1.json',
  'benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json',
  'docs/submission/POLICY_LAB_GAUNTLET_EXPANSION.md',
  'docs/submission/POLICY_LAB_STANDARDS_DIFFERENTIATION.md',
  'frontend/src/data/publicEvidenceCheckpoint.js',
  'frontend/src/lib/caseWorkbenchRuntime.js',
  'packages/constraint-core/src',
  'protocol/cases/energy-v1',
  'protocol/policies-v2',
  'protocol/schema',
  'scripts/build_claim_assessment_package.mjs',
  'scripts/verify_claim_assessment_package.mjs',
  'scripts/external_case_001p_ausgrid.mjs',
  'scripts/run_policy_lab_specialized_gauntlet.mjs',
  'scripts/check_policy_lab_external_gauntlet_protocols.mjs',
  'scripts/build_policy_lab_release_provenance.mjs',
  '.github/workflows/policy-lab-specialized-gauntlet.yml',
];

const ignoredNames = new Set(['.DS_Store']);

async function collect(relative) {
  const absolute = path.join(root, relative);
  const stat = await fs.stat(absolute);
  if (stat.isFile()) return [relative.replaceAll('\\', '/')];
  if (!stat.isDirectory()) return [];

  const entries = await fs.readdir(absolute, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (ignoredNames.has(entry.name)) continue;
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await collect(child));
    else if (entry.isFile()) files.push(child.replaceAll('\\', '/'));
  }
  return files;
}

const fileSet = new Set();
for (const closureRoot of closureRoots) {
  for (const file of await collect(closureRoot)) fileSet.add(file);
}
const files = [...fileSet].sort();

const inventory = [];
for (const relative of files) {
  const bytes = await fs.readFile(path.join(root, relative));
  inventory.push({
    path: relative,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  });
}

const body = {
  schema: 'policylab.release_provenance_manifest.v1',
  version: '0.1.1',
  project: 'Policy Lab',
  source_revision: sourceRevision,
  source_revision_bound: sourceRevision !== 'UNBOUND_LOCAL_RUN',
  closure_roots: closureRoots,
  file_count: inventory.length,
  files: inventory,
  attestations: {
    repository_source_closure: 'SHA256_FILE_INVENTORY',
    github_artifact_attestation: 'OPEN_RELEASE',
    sbom: 'OPEN_RELEASE',
    signed_release_tag: 'OPEN_RELEASE',
  },
  boundary: 'This manifest binds the declared software/source closure to file bytes and a source revision. It does not prove physical evidence truth, legal authority, production security, external reproduction, or adoption.',
};

const canonical = JSON.stringify(body);
const manifestId = crypto.createHash('sha256').update(canonical).digest('hex');
const manifest = {
  ...body,
  release_provenance_id: manifestId,
};

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({
  status: 'PASS',
  source_revision: manifest.source_revision,
  source_revision_bound: manifest.source_revision_bound,
  file_count: manifest.file_count,
  release_provenance_id: manifest.release_provenance_id,
  output: path.relative(root, outFile),
  open_release_attestations: Object.entries(manifest.attestations)
    .filter(([, state]) => state === 'OPEN_RELEASE')
    .map(([name]) => name),
}, null, 2));

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

// This is deliberately a source closure rather than a claim that every file is
// executed on every route. It binds the research engine, the complete frontend
// source/public surface, the research/submission manifests, and the certifiers
// used to accept the released surface. Keeping the frontend tree whole avoids a
// misleading provenance manifest that could attest the engine while omitting
// the interface through which the research is actually inspected.
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
  'docs/submission/POLICY_LAB_GAUNTLET_MASTER.md',
  'docs/submission/POLICY_LAB_JUDGE_DEMO_AND_QA.md',
  'docs/submission/POLICY_LAB_ROUTE_ADAPTERS.md',
  'docs/submission/POLICY_LAB_SUBMISSION_READINESS.md',
  'frontend/package.json',
  'frontend/package-lock.json',
  'frontend/vite.config.js',
  'frontend/public',
  'frontend/src',
  'packages/constraint-core',
  'protocol/cases/energy-v1',
  'protocol/policies-v2',
  'protocol/schema',
  'scripts/build_claim_assessment_package.mjs',
  'scripts/verify_claim_assessment_package.mjs',
  'scripts/build_constrained_claim_assessment.mjs',
  'scripts/verify_constrained_claim_assessment.mjs',
  'scripts/external_case_001p_ausgrid.mjs',
  'scripts/run_policy_lab_specialized_gauntlet.mjs',
  'scripts/check_policy_lab_external_gauntlet_protocols.mjs',
  'scripts/build_policy_lab_release_provenance.mjs',
  'scripts/check_current_surface.mjs',
  'scripts/policy_lab_preflight.mjs',
  'scripts/check_frontend_bundle.mjs',
  'scripts/smoke_live_policy_lab.mjs',
  'scripts/capture_case_workbench_v2.mjs',
  'scripts/capture_constraint_protocol_alpha.mjs',
  'scripts/capture_policy_lab_submission_assets.mjs',
  '.github/workflows/current-surface.yml',
  '.github/workflows/case_workbench_v2.yml',
  '.github/workflows/constraint_protocol_alpha.yml',
  '.github/workflows/external-case-001p-ausgrid.yml',
  '.github/workflows/policy-lab-live-smoke.yml',
  '.github/workflows/policy-lab-specialized-gauntlet.yml',
  '.github/workflows/policy-lab-submission-assets.yml',
  '.github/workflows/policy-lab-release-attestation.yml',
];

const requiredReleasePaths = [
  'frontend/src/components/ResearchBrowser.jsx',
  'frontend/src/components/ResearchWorkbenchOverview.jsx',
  'frontend/src/components/LabOverview.jsx',
  'frontend/src/lib/caseWorkbenchRuntime.js',
  'scripts/smoke_live_policy_lab.mjs',
  'scripts/external_case_001p_ausgrid.mjs',
  '.github/workflows/case_workbench_v2.yml',
  '.github/workflows/policy-lab-live-smoke.yml',
  '.github/workflows/external-case-001p-ausgrid.yml',
  '.github/workflows/policy-lab-release-attestation.yml',
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

const missingCriticalPaths = requiredReleasePaths.filter((relative) => !fileSet.has(relative));
if (missingCriticalPaths.length) {
  throw new Error(`Release provenance closure omitted critical paths: ${missingCriticalPaths.join(', ')}`);
}

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
  version: '0.1.3',
  project: 'Policy Lab',
  source_revision: sourceRevision,
  source_revision_bound: sourceRevision !== 'UNBOUND_LOCAL_RUN',
  closure_roots: closureRoots,
  required_release_paths: requiredReleasePaths,
  file_count: inventory.length,
  files: inventory,
  attestations: {
    repository_source_closure: 'SHA256_FILE_INVENTORY',
    github_artifact_attestation: 'OPEN_RELEASE',
    sbom: 'OPEN_RELEASE',
    signed_release_tag: 'OPEN_RELEASE',
  },
  boundary: 'This manifest binds the declared software/source closure, including the released research interface and its certifiers, to file bytes and a source revision. It does not prove physical evidence truth, legal authority, production security, external reproduction, or adoption.',
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
  required_release_paths: manifest.required_release_paths.length,
  release_provenance_id: manifest.release_provenance_id,
  output: path.relative(root, outFile),
  open_release_attestations: Object.entries(manifest.attestations)
    .filter(([, state]) => state === 'OPEN_RELEASE')
    .map(([name]) => name),
}, null, 2));

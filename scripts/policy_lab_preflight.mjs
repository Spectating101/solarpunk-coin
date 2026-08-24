#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function exists(relativePath) {
  try {
    await access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

function check(name, pass, detail) {
  return { name, pass: Boolean(pass), detail };
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout || ''}\n${result.stderr || ''}`.trim());
  }
  return result.stdout.trim();
}

async function main() {
  const checks = [];

  try {
    const output = run(process.execPath, ['scripts/check_current_surface.mjs']);
    checks.push(check('current_surface_integrity', true, output));
  } catch (error) {
    checks.push(check('current_surface_integrity', false, error.message));
  }

  const requiredPaths = [
    'frontend/src/App.jsx',
    'frontend/src/components/LabOverview.jsx',
    'frontend/src/components/PublicEvidenceCheckpoint.jsx',
    'frontend/src/data/publicEvidenceCheckpoint.js',
    'protocol/cases/energy-v1/case-pack.json',
    'packages/constraint-core/src/workbench.js',
    'protocol/schema',
    'protocol/policies-v2',
    'protocol/schema/claim-assessment-package.v0.1.schema.json',
    'scripts/lib/claim_assessment_package_v0_1.mjs',
    'scripts/build_claim_assessment_package.mjs',
    'scripts/verify_claim_assessment_package.mjs',
    'frontend/public/empirical/market-capacity-v1/market-capacity-summary.json',
    'frontend/public/empirical/market-capacity-v1/methods-manifest.json',
  ];

  for (const relativePath of requiredPaths) {
    checks.push(check(`required:${relativePath}`, await exists(relativePath), relativePath));
  }

  const casePack = JSON.parse(await readFile(path.join(ROOT, 'protocol/cases/energy-v1/case-pack.json'), 'utf8'));
  checks.push(check('controlled_pack_non_empirical', casePack.empirical_claim === false, `empirical_claim=${casePack.empirical_claim}`));
  checks.push(check('controlled_pack_size', casePack.case_ids?.length === 4, `cases=${casePack.case_ids?.length ?? 0}`));

  const checkpointText = await readFile(path.join(ROOT, 'frontend/src/data/publicEvidenceCheckpoint.js'), 'utf8');
  checks.push(check('outside_checkpoint_present', checkpointText.includes("case_id: 'PUB-AUSGRID-001P'"), 'PUB-AUSGRID-001P'));
  checks.push(check('outside_checkpoint_l0', checkpointText.includes("assurance: 'L0'"), 'actual assurance L0'));
  checks.push(check('outside_checkpoint_r4_untested', checkpointText.includes("R4: 'UNTESTED'"), 'R4 UNTESTED'));

  const packageSchema = JSON.parse(await readFile(path.join(ROOT, 'protocol/schema/claim-assessment-package.v0.1.schema.json'), 'utf8'));
  checks.push(check(
    'portable_package_schema',
    packageSchema?.properties?.schema?.const === 'policylab.claim_assessment_package.v0.1',
    packageSchema?.properties?.schema?.const || 'missing',
  ));
  checks.push(check(
    'portable_package_profile',
    packageSchema?.properties?.profile?.properties?.id?.const === 'policylab.energy_linked_claim.v0',
    packageSchema?.properties?.profile?.properties?.id?.const || 'missing',
  ));

  const externalWorkflow = await readFile(path.join(ROOT, '.github/workflows/external-case-001p-ausgrid.yml'), 'utf8');
  checks.push(check('portable_package_built_in_external_case', externalWorkflow.includes('build_claim_assessment_package.mjs'), 'builder in outside-data workflow'));
  checks.push(check('portable_package_verified_in_external_case', externalWorkflow.includes('verify_claim_assessment_package.mjs'), 'verifier in outside-data workflow'));
  checks.push(check('portable_package_rebuild_checked', externalWorkflow.includes('cmp state/external/public-001p-ausgrid/claim-assessment-package.json'), 'byte-identical rebuild check'));

  const appText = await readFile(path.join(ROOT, 'frontend/src/App.jsx'), 'utf8');
  checks.push(check('policy_lab_identity', appText.includes('Policy Lab'), 'frontend identifies Policy Lab'));

  const failures = checks.filter((item) => !item.pass);
  const report = {
    schema: 'solarpunk.policy_lab.preflight.v1',
    ok: failures.length === 0,
    checks,
  };
  console.log(JSON.stringify(report, null, 2));

  if (failures.length) {
    throw new Error(`Policy Lab preflight failed: ${failures.map((item) => item.name).join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

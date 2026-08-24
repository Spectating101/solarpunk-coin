#!/usr/bin/env node
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_WORKFLOW_NAME = 'Deploy Policy Lab to GitHub Pages';
const ROOT_PACKAGE_NAME = 'policy-lab-research-workbench';
const CLAIM_PACKAGE_SCHEMA = 'policylab.claim_assessment_package.v0.1';
const CLAIM_PACKAGE_PROFILE = 'policylab.energy_linked_claim.v0';

function fail(message) {
  throw new Error(`current-surface check failed: ${message}`);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(ROOT, relativePath), 'utf8'));
}

async function requirePath(relativePath) {
  const full = path.join(ROOT, relativePath);
  await access(full);
  return stat(full);
}

async function pathExists(relativePath) {
  try {
    await access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const surface = await readJson('CURRENT_SURFACE.json');
  if (surface.schema !== 'solarpunk.policy_lab.current_surface.v1') fail('unexpected manifest schema');
  if (surface.identity?.primary_name !== 'Policy Lab') fail('Policy Lab must be the primary current identity');
  if (surface.identity?.root_package_name !== ROOT_PACKAGE_NAME) fail('root package identity drifted from Policy Lab');

  for (const [key, relativePath] of Object.entries(surface.executable_truth || {})) {
    try {
      await requirePath(relativePath);
    } catch {
      fail(`missing executable-truth path ${key}: ${relativePath}`);
    }
  }

  const rootPackage = await readJson(surface.executable_truth.root_package);
  if (rootPackage.name !== ROOT_PACKAGE_NAME) fail(`root package name must be ${ROOT_PACKAGE_NAME}`);
  if (rootPackage.private !== true) fail('root package must remain private');
  if (!String(rootPackage.description || '').startsWith('Policy Lab:')) fail('root package description must identify Policy Lab first');
  for (const scriptName of ['policy-lab:surface', 'policy-lab:preflight', 'policy-lab:test-core', 'policy-lab:test-frontend', 'policy-lab:build']) {
    if (!rootPackage.scripts?.[scriptName]) fail(`missing canonical root command: ${scriptName}`);
  }

  const publicEntrypoint = await readFile(path.join(ROOT, surface.executable_truth.public_entrypoint), 'utf8');
  if (!publicEntrypoint.startsWith('# Policy Lab')) fail('public README must identify Policy Lab first');
  if (!publicEntrypoint.includes('CURRENT_SURFACE.json')) fail('public README must point readers to machine current-surface truth');
  if (!publicEntrypoint.includes('Historical SolarPunk / SPK material')) fail('public README must label historical SolarPunk/SPK material explicitly');

  const pack = await readJson(surface.executable_truth.interactive_case_pack);
  const expectedCases = surface.interactive_pack.case_ids;
  const expectedPolicies = surface.interactive_pack.policy_ids;
  if (pack.case_pack_id !== surface.interactive_pack.case_pack_id) fail('interactive case-pack identity drifted');
  if (pack.empirical_claim !== false) fail('controlled case pack must remain non-empirical');
  if (JSON.stringify(pack.case_ids) !== JSON.stringify(expectedCases)) fail('interactive case IDs drifted from current-surface manifest');
  if (JSON.stringify(pack.policy_ids) !== JSON.stringify(expectedPolicies)) fail('interactive policy IDs drifted from current-surface manifest');
  if (pack.case_ids.includes(surface.outside_data_checkpoint.case_id)) fail('outside-data checkpoint must not be silently promoted into the controlled interactive pack');

  const checkpointModule = await import(pathToFileURL(path.join(ROOT, surface.outside_data_checkpoint.machine_surface)).href);
  const checkpoint = checkpointModule.PUBLIC_EVIDENCE_CHECKPOINT;
  if (!checkpoint) fail('public evidence checkpoint export missing');
  if (checkpoint.case_id !== surface.outside_data_checkpoint.case_id) fail('public evidence case identity drifted');
  if (checkpoint.provenance.workflow_run_id !== surface.outside_data_checkpoint.workflow_run_id) fail('public evidence workflow provenance drifted');
  if (checkpoint.provenance.artifact_id !== surface.outside_data_checkpoint.artifact_id) fail('public evidence artifact provenance drifted');
  if (checkpoint.evidence.assurance !== 'L0') fail('public evidence checkpoint must preserve actual L0 assurance');
  if (checkpoint.decisions.open.result !== 'ADMIT_WITH_LIMIT') fail('audited open-policy result drifted');
  if (checkpoint.decisions.pilot.result !== 'BLOCKED') fail('audited pilot-policy result drifted');
  if (checkpoint.verification.decision_reproduction !== 'PASS') fail('audited decision reproduction must remain PASS');
  if (checkpoint.boundaries.R4 !== 'UNTESTED') fail('R4 must remain UNTESTED in the current checkpoint');

  const portable = surface.portable_assessment_package;
  if (!portable) fail('portable assessment package declaration missing');
  if (portable.schema !== CLAIM_PACKAGE_SCHEMA) fail('portable assessment package schema declaration drifted');
  if (portable.profile !== CLAIM_PACKAGE_PROFILE) fail('portable assessment package profile declaration drifted');
  if (portable.source_case !== checkpoint.case_id) fail('portable assessment package must remain bound to the audited outside-data case');

  const packageSchema = await readJson(surface.executable_truth.claim_assessment_package_schema);
  if (packageSchema?.properties?.schema?.const !== CLAIM_PACKAGE_SCHEMA) fail('published portable-package schema constant drifted');
  if (packageSchema?.properties?.profile?.properties?.id?.const !== CLAIM_PACKAGE_PROFILE) fail('published portable-package profile constant drifted');

  const externalCaseWorkflow = await readFile(path.join(ROOT, surface.executable_truth.public_case_workflow), 'utf8');
  if (!externalCaseWorkflow.includes('build_claim_assessment_package.mjs')) fail('outside-data workflow no longer builds the portable assessment package');
  if (!externalCaseWorkflow.includes('verify_claim_assessment_package.mjs')) fail('outside-data workflow no longer verifies the portable assessment package');
  if (!externalCaseWorkflow.includes('cmp state/external/public-001p-ausgrid/claim-assessment-package.json')) fail('outside-data workflow no longer proves byte-identical package rebuild');

  for (const archived of surface.historical_reference.archived_workflows || []) {
    if (!(await pathExists(archived))) fail(`declared archived workflow missing: ${archived}`);
  }
  for (const forbidden of surface.historical_reference.forbidden_active_workflows || []) {
    if (await pathExists(forbidden)) fail(`historical operation is active under GitHub Actions: ${forbidden}`);
  }

  const pagesWorkflow = await readFile(path.join(ROOT, surface.executable_truth.pages_publish_workflow), 'utf8');
  if (!pagesWorkflow.includes(`name: ${PAGES_WORKFLOW_NAME}`)) fail('current Pages workflow name drifted');
  if (!pagesWorkflow.includes('docs/demo')) fail('current Pages workflow no longer publishes the Policy Lab demo mirror');
  if (!pagesWorkflow.includes('policy_lab_preflight.mjs')) fail('current Pages workflow is not gated by Policy Lab preflight');
  if (pagesWorkflow.includes('public-lab:preflight')) fail('legacy Public Lab preflight re-entered the current Pages workflow');

  const publishScript = await readFile(path.join(ROOT, surface.executable_truth.pages_publish_script), 'utf8');
  if (!publishScript.includes('policy_lab_preflight.mjs')) fail('Pages publish script is not gated by Policy Lab preflight');
  if (publishScript.includes('state/runtime/spk_v1.json')) fail('Pages publish script still refreshes historical SPK runtime state');

  const smokeWorkflow = await readFile(path.join(ROOT, surface.executable_truth.live_smoke_workflow), 'utf8');
  if (!smokeWorkflow.includes(`workflows: ["${PAGES_WORKFLOW_NAME}"]`)) fail('live smoke no longer follows the current Pages deployment workflow');

  const routes = await readFile(path.join(ROOT, surface.executable_truth.frontend_routes), 'utf8');
  for (const route of surface.historical_reference.active_but_secondary_routes) {
    if (!routes.includes(`'${route}'`)) fail(`declared historical/reference route missing: ${route}`);
  }

  const app = await readFile(path.join(ROOT, surface.executable_truth.frontend_entry), 'utf8');
  if (!app.includes('<div className="brand-mark">P</div>')) fail('live frontend brand mark is not Policy Lab first');
  if (!app.includes('<div className="brand-name">Policy Lab</div>')) fail('live frontend brand name is not Policy Lab');
  if (app.includes('<div className="brand-name">Solarpunk</div>')) fail('historical SolarPunk identity re-entered the live primary brand');
  if (!app.includes('aria-label="Policy Lab sections"')) fail('primary navigation accessibility label is not Policy Lab first');

  console.log(JSON.stringify({
    ok: true,
    primary_identity: surface.identity.primary_name,
    root_package_name: rootPackage.name,
    root_package_private: rootPackage.private,
    canonical_root_commands: Object.keys(rootPackage.scripts).filter((name) => name.startsWith('policy-lab:')),
    pages_workflow_name: PAGES_WORKFLOW_NAME,
    pages_publish_workflow: surface.executable_truth.pages_publish_workflow,
    interactive_case_pack: pack.case_pack_id,
    interactive_case_count: pack.case_ids.length,
    outside_data_checkpoint: checkpoint.case_id,
    outside_data_assurance: checkpoint.evidence.assurance,
    outside_data_reproduction: checkpoint.verification.decision_reproduction,
    portable_assessment_package: {
      schema: portable.schema,
      profile: portable.profile,
      source_case: portable.source_case,
    },
    archived_workflow_count: surface.historical_reference.archived_workflows.length,
    forbidden_active_workflow_count: surface.historical_reference.forbidden_active_workflows.length,
    historical_reference_routes: surface.historical_reference.active_but_secondary_routes,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

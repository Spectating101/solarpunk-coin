#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fail(message) {
  throw new Error(`public-governance check failed: ${message}`);
}

async function text(relativePath) {
  return readFile(path.join(ROOT, relativePath), 'utf8');
}

async function requireFile(relativePath) {
  await access(path.join(ROOT, relativePath));
  return text(relativePath);
}

async function main() {
  const surface = JSON.parse(await text('CURRENT_SURFACE.json'));
  const governance = surface.public_governance;
  if (!governance) fail('CURRENT_SURFACE.json does not declare public_governance');
  if (governance.owner !== 'Christopher Ongko') fail('declared current owner drifted');

  const required = [
    'governance',
    'privacy',
    'security',
    'code_of_conduct',
    'public_interest',
    'dpg_application_draft',
  ];
  const docs = {};
  for (const key of required) {
    if (!governance[key]) fail(`missing public_governance path: ${key}`);
    docs[key] = await requireFile(governance[key]);
  }

  const citation = await text('CITATION.cff');
  if (!citation.includes('family-names: Ongko') || !citation.includes('given-names: Christopher')) {
    fail('CITATION.cff no longer supports declared ownership/author identity');
  }

  const license = await text('LICENSE');
  if (!license.startsWith('MIT License')) fail('current repository license is not MIT');
  if (!docs.governance.includes('Solarpunk Bitcoin Project')) {
    fail('governance no longer explains the historical license/project label');
  }
  if (!docs.governance.includes('Yuan Ze University is **not** represented here as the owner')) {
    fail('governance must not silently turn academic affiliation into project ownership');
  }

  const evidenceLab = await text('frontend/src/components/EvidenceLab.jsx');
  if (!evidenceLab.includes('Browser-local · unsigned · no upload server')) {
    fail('Evidence Lab no longer states the no-upload boundary used by PRIVACY.md');
  }
  if (!evidenceLab.includes('Files stay in your browser.')) {
    fail('Evidence Lab no longer states browser-local file handling');
  }
  if (!evidenceLab.includes('const text = await file.text()')) {
    fail('local evidence intake no longer uses browser File API as documented');
  }

  if (!docs.privacy.includes('does not implement user accounts')) fail('privacy statement lost current no-account boundary');
  if (!docs.privacy.includes('does not upload that file to a Policy Lab server')) fail('privacy statement lost local-file boundary');
  if (!docs.privacy.includes('first-party analytics')) fail('privacy statement must disclose current analytics posture');
  if (!docs.privacy.includes('not a claim that every third-party deployment')) fail('privacy statement must reject blanket legal-compliance inference');

  const frontendPackage = await text('frontend/package.json');
  for (const analyticsDependency of ['google-analytics', 'posthog', 'mixpanel', '@sentry/', 'segment-analytics']) {
    if (frontendPackage.toLowerCase().includes(analyticsDependency)) {
      fail(`frontend analytics dependency ${analyticsDependency} conflicts with current privacy statement`);
    }
  }

  if (!docs.security.includes('Do **not** publish exploit details')) fail('security policy lacks sensitive-reporting warning');
  if (!docs.security.includes('CURRENT_SURFACE.json')) fail('security policy is not scoped to current machine surface');
  if (!docs.security.includes('no fixed response-time SLA')) fail('security policy must not imply an unsupported SLA');

  if (!docs.code_of_conduct.includes('harassment')) fail('code of conduct lacks harassment protection');
  if (!docs.code_of_conduct.includes('not designed as a service for children')) fail('code of conduct lacks child-safety scope statement');
  if (!docs.code_of_conduct.includes('good-faith methodological criticism')) fail('moderation policy must protect legitimate research criticism');

  if (!docs.public_interest.includes('SDG 16')) fail('public-interest statement lost primary SDG mapping');
  if (!docs.public_interest.includes('not evidence that Policy Lab has already changed institutional outcomes at scale')) {
    fail('public-interest statement must reject impact inflation');
  }
  if (!docs.public_interest.includes('R4 monetary/circulation performance remains untested')) {
    fail('public-interest statement must preserve monetary-performance non-claim');
  }

  const dpg = docs.dpg_application_draft;
  if (!dpg.includes('pre-submission evidence ledger')) fail('DPG package must remain pre-submission until external review');
  if (!dpg.includes('not a claim that Policy Lab has already been recognized as a Digital Public Good')) {
    fail('DPG package must reject premature recognition claim');
  }
  if (!dpg.includes('No organization, government, multilateral body, or independent production user should be named')) {
    fail('DPG package must reject fabricated adoption');
  }
  if (!dpg.includes('PII can be collected locally by a user-selected file but is NOT stored and NOT distributed')) {
    fail('DPG privacy answer drifted from current browser-local intake behavior');
  }

  console.log(JSON.stringify({
    ok: true,
    owner: governance.owner,
    governed_files: required.map((key) => governance[key]),
    browser_local_evidence: true,
    first_party_analytics_dependency_detected: false,
    dpg_state: 'pre-submission',
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});

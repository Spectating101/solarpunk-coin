import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repoFile = (relative) => new URL(`../../../${relative}`, import.meta.url);
const readText = (relative) => readFile(repoFile(relative), 'utf8');
const readJson = async (relative) => JSON.parse(await readText(relative));

const BOUND_COMMIT = '55fd6f2cf2eed25b589e91b5e3161e6ced68f5de';
const PUBLIC_LAB_V1 = 'e2b9d9d31c35e32ac684e3e36fe6d3f0ea998d30';
const PUBLIC_LAB_MAINT = '9de148737bf9d6138c0a03d1d22bdd88b655c2a5';
const DEMO_INDEX_SHA256 = '02f40d3c330b0c5f008b58d786584386a934efcb69da0b52a9f9be91fe9da349';

const FORBIDDEN_PHRASES = [
  'DPG recognition',
  'legal authority',
  'settlement authority',
  'operator adoption',
  'calibrated policy endorsement',
];

test('public claim boundary is bound to origin/main, not a public-lab tag', async () => {
  const claims = await readJson('docs/product/claims-and-nonclaims.v1.json');
  const markdown = await readText('docs/CLAIMS_BOUNDARY.md');

  assert.equal(claims.schema, 'policy_lab.claim_boundary.v1');
  assert.equal(claims.authority.public_default_ref, 'origin/main');
  assert.equal(claims.authority.commit, BOUND_COMMIT);
  assert.equal(claims.authority.visibility, 'PUBLIC');
  assert.equal(claims.authority.live_demo_http_status, 200);
  assert.equal(claims.authority.live_demo_index_sha256, DEMO_INDEX_SHA256);
  assert.equal(claims.authority.public_lab_tag_match, null);

  const byRef = Object.fromEntries(
    claims.authority.tags_compared.map((row) => [row.ref, row]),
  );
  assert.equal(byRef['refs/tags/public-lab-v1.0'].peeled_commit, PUBLIC_LAB_V1);
  assert.equal(byRef['refs/tags/public-lab-v1.0'].matches_origin_main, false);
  assert.equal(byRef['refs/tags/public-lab-v1.0-maintenance'].peeled_commit, PUBLIC_LAB_MAINT);
  assert.equal(byRef['refs/tags/public-lab-v1.0-maintenance'].matches_origin_main, false);
  assert.equal(byRef['refs/tags/v0.2.0-field-ready-alpha'].matches_origin_main, false);

  assert.ok(markdown.includes(BOUND_COMMIT));
  assert.ok(markdown.includes(PUBLIC_LAB_V1));
  assert.ok(markdown.includes(PUBLIC_LAB_MAINT));
  assert.ok(markdown.includes('Equals `origin/main`?'));
  assert.ok(markdown.includes('**no** (ancestor only)'));
  assert.doesNotMatch(markdown, /main == public-lab-v1\.0(?!.*not)/i);
});

test('supported claims stay inside the public-default evidence and forbid promotion phrases', async () => {
  const claims = await readJson('docs/product/claims-and-nonclaims.v1.json');
  const markdown = await readText('docs/CLAIMS_BOUNDARY.md');
  const supportedText = JSON.stringify(claims.supported);
  const forbiddenText = claims.unsupported_or_prohibited.join('\n').toLowerCase();

  assert.ok(claims.supported.length >= 8);
  assert.ok(claims.unsupported_or_prohibited.length >= 8);
  assert.match(supportedText, /PUB-AUSGRID-001P/);
  assert.match(supportedText, /33\.066/);
  assert.match(supportedText, /empirical_claim: false/);
  assert.doesNotMatch(supportedText, /Digital Public Good/);
  assert.doesNotMatch(supportedText, /recognized as a DPG/i);

  assert.ok(claims.unsupported_or_prohibited.some((row) => /digital public good|dpg/i.test(row)));
  assert.ok(claims.unsupported_or_prohibited.some((row) => /legal authority/i.test(row)));
  assert.ok(claims.unsupported_or_prohibited.some((row) => /settlement authority/i.test(row)));
  assert.ok(claims.unsupported_or_prohibited.some((row) => /operator has adopted/i.test(row)));
  assert.ok(claims.unsupported_or_prohibited.some((row) => /calibrat/i.test(row) && /endorsed/i.test(row)));
  for (const phrase of FORBIDDEN_PHRASES) {
    assert.ok(
      forbiddenText.includes(phrase.toLowerCase())
        || (phrase === 'DPG recognition' && /digital public good|dpg/i.test(forbiddenText))
        || (phrase === 'operator adoption' && /operator has adopted/i.test(forbiddenText))
        || (phrase === 'calibrated policy endorsement' && /calibrat/i.test(forbiddenText) && /endorsed/i.test(forbiddenText)),
      `missing prohibited claim covering: ${phrase}`,
    );
  }

  assert.ok(Object.keys(claims.promotion_requirements).includes('DPG_RECOGNITION'));
  assert.ok(Object.keys(claims.promotion_requirements).includes('LEGAL_AUTHORITY'));
  assert.ok(Object.keys(claims.promotion_requirements).includes('SETTLEMENT_AUTHORITY'));
  assert.ok(Object.keys(claims.promotion_requirements).includes('OPERATOR_ADOPTION'));
  assert.ok(Object.keys(claims.promotion_requirements).includes('CALIBRATED_POLICY_ENDORSEMENT'));

  for (const phrase of ['Digital Public Good', 'legal authority', 'settlement authority', 'operator adoption', 'calibrated']) {
    assert.ok(markdown.toLowerCase().includes(phrase.toLowerCase()), `markdown missing forbidden-claim heading coverage: ${phrase}`);
  }
});

test('live smoke workflow can install without a root package-lock.json', async () => {
  const workflow = await readText('.github/workflows/policy-lab-live-smoke.yml');
  const gitignore = await readText('.gitignore');

  assert.match(gitignore, /^package-lock\.json$/m);
  assert.match(gitignore, /^!frontend\/package-lock\.json$/m);
  assert.doesNotMatch(workflow, /^\s+run:\s*npm ci\b/m);
  assert.doesNotMatch(workflow, /^\s+cache:\s*npm\b/m);
  assert.match(workflow, /playwright@1\.61\.1/);
  assert.match(workflow, /--no-package-lock/);
  assert.match(workflow, /POLICY_LAB_URL: https:\/\/spectating101\.github\.io\/solarpunk-coin\/demo\//);
});

test('live smoke locates wrapping selects by combobox accessible name', async () => {
  const smoke = await readText('scripts/smoke_live_policy_lab.mjs');
  assert.match(smoke, /getByRole\('combobox', \{ name: 'Case', exact: true \}\)/);
  assert.match(smoke, /getByRole\('combobox', \{ name: 'Proof \/ assurance', exact: true \}\)/);
  assert.match(smoke, /getByRole\('combobox', \{ name: 'Policy', exact: true \}\)/);
  assert.equal([...smoke.matchAll(/getByLabel\(/g)].length, 0);
});

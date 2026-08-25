import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || '_submission_assets');
const baseUrl = process.env.POLICY_LAB_URL || 'http://127.0.0.1:4173/';

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();

async function open(url, expected) {
  await page.goto(url, { waitUntil: 'networkidle' });
  if (expected) await page.getByText(expected, { exact: false }).first().waitFor({ state: 'visible' });
}

// Asset 1: immediate judge-facing overview and outside-data proof.
await open(`${baseUrl}#lab`, 'Can real-world evidence justify a financial claim?');
await page.getByText('PUB-AUSGRID-001P', { exact: false }).first().waitFor({ state: 'visible' });
await page.locator('.public-evidence-checkpoint').first().screenshot({
  path: path.join(outputDir, '01-outside-data-checkpoint.png'),
});

// Asset 2: expanded proof with assessment identity and R1-R4 boundary.
await open(`${baseUrl}?view=full#lab`, 'PUB-AUSGRID-001P');
await page.getByText('R1 / R2 / R3 / R4', { exact: true }).waitFor({ state: 'visible' });
await page.locator('.public-evidence-checkpoint').first().screenshot({
  path: path.join(outputDir, '02-outside-data-proof-detail.png'),
});

// Asset 3: explicit settlement failure after a valid bounded claim.
const stressHash = '#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=stress';
await open(`${baseUrl}${stressHash}`, 'What happens when declared settlement capacity falls?');
await page.getByRole('button', { name: /40% capacity/i }).click();
await page.getByText('PARTIAL', { exact: true }).waitFor({ state: 'visible' });
await page.screenshot({
  path: path.join(outputDir, '03-settlement-shortfall.png'),
  fullPage: true,
});

// Asset 4: deterministic verification surface.
await open(`${baseUrl}?view=full#verify?tool=lineage`, 'Verify the result from source identity');
await page.getByText('Evidence identity retained', { exact: true }).waitFor({ state: 'visible' });
await page.screenshot({
  path: path.join(outputDir, '04-decision-lineage-verification.png'),
  fullPage: true,
});

await context.close();
await browser.close();

const files = (await fs.readdir(outputDir)).sort();
if (files.length !== 4) {
  throw new Error(`Expected 4 Policy Lab submission assets; received ${files.length}`);
}

const manifest = {
  schema: 'policylab.submission_visual_assets.v1',
  source: 'local deterministic frontend build',
  viewport: { width: 1600, height: 1000 },
  files,
  boundary: 'Screenshots are presentation artifacts. They do not create external validation, stronger source assurance, or new research authority.',
};
await fs.writeFile(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Captured ${files.length} Policy Lab submission screenshots in ${outputDir}`);

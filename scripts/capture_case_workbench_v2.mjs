import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || '_review_case_workbench_v2');
const baseUrl = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const compareHash = '#compare?scenario=PROVENANCE-L2-COUNTERFACTUAL&baseline=LAB-CASE-OPEN-004&comparison=ENERGY-CASE-PILOT-005';

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newContext({ viewport: { width: 1500, height: 1050 }, deviceScaleFactor: 1 });
const page = await desktop.newPage();

async function open(hash, expected) {
  await page.goto(`${baseUrl}${hash}`, { waitUntil: 'networkidle' });
  if (expected) await page.getByText(expected, { exact: false }).first().waitFor({ state: 'visible' });
}

async function shot(name, target = page) {
  await target.screenshot({ path: path.join(outputDir, name), fullPage: true });
}

async function selectL0(target = page) {
  await target.getByLabel('Assurance context').selectOption('PROVENANCE-L0-BASE');
  await target.getByRole('heading', { name: /why is this case blocked/i }).waitFor({ state: 'visible' });
}

async function selectL2(target = page) {
  await target.getByLabel('Assurance context').selectOption('PROVENANCE-L2-COUNTERFACTUAL');
  await target.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
}

await open('#lab', 'Investigate how evidence becomes a bounded financial decision.');
await page.getByRole('button', { name: /start the five-minute investigation/i }).waitFor({ state: 'visible' });
await shot('00-lab-overview.png');

await open('#cases', 'Investigate the rule that blocks or bounds the case.');
await page.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await shot('01-case-explorer-binding-layer.png');

await open('#case/TYN-001', 'Why is this case blocked?');
await page.getByText('NOT EXECUTED', { exact: true }).waitFor({ state: 'visible' });
await shot('02-case-blocked-l0.png');

await page.getByRole('button', { name: /preview l2 without changing the evidence hash/i }).click();
await page.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
if (!page.url().includes('scenario=PROVENANCE-L2-COUNTERFACTUAL')) {
  throw new Error('Counterfactual action did not persist assurance scenario in the URL');
}
await shot('03-case-counterfactual-l2.png');

await page.getByRole('button', { name: /provenance policy capacity/i }).last().click();
await page.getByRole('region', { name: /PROVENANCE_POLICY_CAPACITY rule detail/i }).waitFor({ state: 'visible' });
await shot('04-binding-ceiling-detail.png');

await open(compareHash, 'What changed in the policy before the outcomes changed?');
await page.getByText('SIGNED EVIDENCE', { exact: false }).first().waitFor({ state: 'visible' });
await page.getByRole('table', { name: /case policy decision matrix/i }).waitFor({ state: 'visible' });
await page.getByText('ADMIT WITH LIMIT', { exact: true }).first().waitFor({ state: 'visible' });
await shot('05-compare-decision-matrix.png');

await open('#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=stress');
await page.getByText('What happens when declared settlement capacity falls?', { exact: false }).waitFor({ state: 'visible' });
await page.getByRole('button', { name: /40% capacity/i }).click();
await page.getByText('PARTIAL', { exact: true }).waitFor({ state: 'visible' });
await shot('06-settlement-stress-partial.png');

await page.getByRole('button', { name: /^Lineage$/i }).click();
await page.getByText('Which declared objects and activities produced this result?', { exact: false }).waitFor({ state: 'visible' });
await shot('07-decision-lineage.png');

await open('#receipts', 'Share the decision identity, not a screenshot.');
await page.getByText('12 portable files', { exact: false }).waitFor({ state: 'visible' });
await page.getByText('ro-crate-metadata.json', { exact: true }).waitFor({ state: 'visible' });
await shot('08-decision-receipt-capsule.png');

await open('#runs', 'What did the stricter rule buy');
await shot('09-market-capacity-study-entry.png');

await open('#overview', 'SolarPunk');
await shot('10-solarpunk-reference.png');

await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mobilePage = await mobile.newPage();

async function openMobile(hash, expected) {
  await mobilePage.goto(`${baseUrl}${hash}`, { waitUntil: 'networkidle' });
  if (expected) await mobilePage.getByText(expected, { exact: false }).first().waitFor({ state: 'visible' });
}

await openMobile('#cases', 'Investigate the rule that blocks or bounds the case.');
await mobilePage.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await shot('11-mobile-case-explorer.png', mobilePage);

await openMobile('#case/TYN-001', 'Why is this case blocked?');
await mobilePage.getByText('NOT EXECUTED', { exact: true }).waitFor({ state: 'visible' });
await shot('12-mobile-blocked-case.png', mobilePage);

await mobilePage.getByLabel('Assurance context').selectOption('PROVENANCE-L2-COUNTERFACTUAL');
await mobilePage.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
await shot('13-mobile-admitted-case.png', mobilePage);

await openMobile(compareHash, 'What changed in the policy before the outcomes changed?');
await mobilePage.getByRole('table', { name: /case policy decision matrix/i }).waitFor({ state: 'visible' });
await shot('14-mobile-compare.png', mobilePage);

await openMobile('#receipts', 'Share the decision identity, not a screenshot.');
await mobilePage.getByText('12 portable files', { exact: false }).waitFor({ state: 'visible' });
await shot('15-mobile-receipt.png', mobilePage);

await openMobile('#lab', 'Investigate how evidence becomes a bounded financial decision.');
await mobilePage.getByRole('button', { name: /start the five-minute investigation/i }).waitFor({ state: 'visible' });
await shot('16-mobile-lab-overview.png', mobilePage);

await mobile.close();
await browser.close();

const files = await fs.readdir(outputDir);
if (files.length !== 17) {
  throw new Error(`Expected 17 flagship workbench review screenshots; received ${files.length}`);
}
console.log(`Captured ${files.length} flagship workbench screenshots in ${outputDir}`);

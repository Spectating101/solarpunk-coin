import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || '_review_case_workbench_v2');
const baseUrl = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';

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

async function selectL2(target = page) {
  await target.getByLabel('Assurance context').selectOption('PROVENANCE-L2-COUNTERFACTUAL');
  await target.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
}

await open('#cases', 'Investigate the rule that blocks or bounds the case.');
await page.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await shot('01-case-explorer-binding-layer.png');

await open('#case/TYN-001', 'Why is this case blocked?');
await page.getByText('NOT EXECUTED', { exact: true }).waitFor({ state: 'visible' });
await shot('02-case-blocked-l0.png');

await page.getByRole('button', { name: /preview l2 without changing the evidence hash/i }).click();
await page.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
await shot('03-case-counterfactual-l2.png');

await page.getByRole('button', { name: /provenance policy capacity/i }).last().click();
await page.getByRole('region', { name: /PROVENANCE_POLICY_CAPACITY rule detail/i }).waitFor({ state: 'visible' });
await shot('04-binding-ceiling-detail.png');

await open('#compare', 'Where do policies disagree');
await page.getByRole('table').first().waitFor({ state: 'visible' });
await page.getByText('quantity not evaluated', { exact: false }).first().waitFor({ state: 'visible' });
await shot('05-compare-decision-matrix.png');

await open('#case/TYN-001', 'Why is this case blocked?');
await selectL2();
await page.getByRole('button', { name: /^Stress$/i }).click();
await page.getByText('What happens when declared settlement capacity falls?', { exact: false }).waitFor({ state: 'visible' });
await page.getByRole('button', { name: /40% capacity/i }).click();
await page.getByText('PARTIAL', { exact: true }).waitFor({ state: 'visible' });
await shot('06-settlement-stress-partial.png');

await page.getByRole('button', { name: /^Lineage$/i }).click();
await page.getByText('Which declared objects and activities produced this result?', { exact: false }).waitFor({ state: 'visible' });
await shot('07-decision-lineage.png');

await open('#receipts', 'Share the decision identity, not a screenshot.');
await page.getByText('10 portable files', { exact: false }).waitFor({ state: 'visible' });
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

await openMobile('#compare', 'Where do policies disagree');
await mobilePage.getByRole('table').first().waitFor({ state: 'visible' });
await shot('14-mobile-compare.png', mobilePage);

await openMobile('#receipts', 'Share the decision identity, not a screenshot.');
await mobilePage.getByText('10 portable files', { exact: false }).waitFor({ state: 'visible' });
await shot('15-mobile-receipt.png', mobilePage);

await mobile.close();
await browser.close();

const files = await fs.readdir(outputDir);
if (files.length !== 15) {
  throw new Error(`Expected 15 case-workbench review screenshots; received ${files.length}`);
}
console.log(`Captured ${files.length} V2 case-workbench screenshots in ${outputDir}`);

import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = path.resolve(process.argv[2] || '_review_case_workbench_v2');
const baseUrl = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const compareHash = '#compare?scenario=PROVENANCE-L2-COUNTERFACTUAL&baseline=LAB-CASE-OPEN-004&comparison=ENERGY-CASE-PILOT-005';
const caseBlockedHash = '#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L0-BASE&lens=constraints';
const caseStressHash = '#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=stress';
const opsBlockedHash = '#case/OPS-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L0-BASE&lens=constraints';

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

async function selectAssurance(target, scenarioId) {
  await target.getByLabel(/Proof \/ assurance|Active assurance scenario|Assurance context/i).selectOption(scenarioId);
}

await open('#lab', 'Can real-world evidence justify a financial claim?');
await page.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await page.getByLabel(/Proof \/ assurance/i).waitFor({ state: 'visible' });
await shot('00-lab-overview-blocked.png');

await selectAssurance(page, 'PROVENANCE-L2-COUNTERFACTUAL');
await page.getByText('ADMIT WITH LIMIT', { exact: true }).first().waitFor({ state: 'visible' });
await page.getByText('126', { exact: true }).first().waitFor({ state: 'visible' });
await shot('00a-lab-overview-admitted.png');

await selectAssurance(page, 'PROVENANCE-L0-BASE');
await page.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });

await open('#cases', 'Investigate the rule that blocks or bounds the case.');
await page.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await shot('01-case-explorer-binding-layer.png');

await open(caseBlockedHash, 'Why is this case blocked?');
await page.getByText('NOT EXECUTED', { exact: true }).waitFor({ state: 'visible' });
await page.getByRole('navigation', { name: /investigation sequence/i }).waitFor({ state: 'visible' });
await page.getByRole('button', { name: /^Open receipt$/i }).waitFor({ state: 'visible' });
await shot('02-case-blocked-l0.png');

await page.getByRole('button', { name: /preview l2 without changing the evidence hash/i }).click();
await page.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
await page.getByRole('status', { name: /investigation update/i }).waitFor({ state: 'visible' });
if (!page.url().includes('scenario=PROVENANCE-L2-COUNTERFACTUAL')) {
  throw new Error('Counterfactual action did not persist assurance scenario in the URL');
}
await shot('03-case-counterfactual-l2.png');

await page.getByRole('button', { name: /provenance policy capacity/i }).last().click();
await page.getByRole('region', { name: /PROVENANCE_POLICY_CAPACITY rule detail/i }).waitFor({ state: 'visible' });
await shot('04-binding-ceiling-detail.png');

await open(opsBlockedHash, 'Operator-format CSV pipeline pilot');
await page.getByText('No asserted physical location', { exact: true }).waitFor({ state: 'visible' });
await page.getByRole('heading', { name: /why is this case blocked/i }).waitFor({ state: 'visible' });
await shot('04a-nonspatial-ops-case.png');

await open(compareHash, 'What changed in the policy before the outcomes changed?');
await page.getByText(/signed evidence/i).first().waitFor({ state: 'visible' });
await page.getByRole('table', { name: /case policy decision matrix/i }).waitFor({ state: 'visible' });
await page.getByText('ADMIT WITH LIMIT', { exact: true }).first().waitFor({ state: 'visible' });
await page.getByRole('navigation', { name: /compare reading map/i }).waitFor({ state: 'visible' });
await shot('05-compare-decision-matrix.png');

await open(caseStressHash);
await page.getByText('What happens when declared settlement capacity falls?', { exact: false }).waitFor({ state: 'visible' });
await page.getByRole('button', { name: /40% capacity/i }).click();
await page.getByText('PARTIAL', { exact: true }).waitFor({ state: 'visible' });
await shot('06-settlement-stress-partial.png');

await page.getByRole('navigation', { name: /investigation sequence/i }).getByRole('button', { name: /^Lineage$/i }).click();
await page.getByText('Which declared objects and activities produced this result?', { exact: false }).waitFor({ state: 'visible' });
await shot('07-decision-lineage.png');

await page.getByRole('button', { name: /^Open receipt$/i }).click();
await page.getByText('Share the decision identity, not a screenshot.', { exact: false }).waitFor({ state: 'visible' });
if (!page.url().includes('#receipt/')) throw new Error('Case Workspace did not open a durable receipt route');
await shot('07a-case-decision-receipt-route.png');

await open('#receipts', 'Share the decision identity, not a screenshot.');
await page.getByRole('heading', { name: /12 portable files/i }).waitFor({ state: 'visible' });
await page.getByText('ro-crate-metadata.json', { exact: true }).waitFor({ state: 'visible' });
await page.getByRole('navigation', { name: /receipt reading map/i }).waitFor({ state: 'visible' });
await shot('08-decision-receipt-capsule.png');

await open('#runs', 'What did the stricter rule buy');
await page.getByRole('navigation', { name: /study proof layer navigation/i }).waitFor({ state: 'visible' });
await page.getByRole('link', { name: /decision brief/i }).waitFor({ state: 'visible' });
await shot('09-market-capacity-study-entry.png');

await page.getByRole('link', { name: /full study/i }).click();
await page.getByRole('heading', { name: /policy decisions should survive contact/i }).waitFor({ state: 'visible' });
await page.getByRole('link', { name: /full study/i }).getAttribute('aria-current').then((value) => {
  if (value !== 'page') throw new Error('Full study route did not activate the empirical proof layer');
});
await shot('09a-market-capacity-full-study.png');

await page.getByRole('link', { name: /verify bundle/i }).click();
await page.getByRole('heading', { name: /do the published study bytes match/i }).waitFor({ state: 'visible' });
await page.getByText(/does not certify licensed source truth/i).waitFor({ state: 'visible' });
await shot('09b-market-capacity-reproduction.png');

await open('#overview', 'SolarPunk');
await shot('10-solarpunk-reference.png');

await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mobilePage = await mobile.newPage();

async function openMobile(hash, expected) {
  await mobilePage.goto(`${baseUrl}${hash}`, { waitUntil: 'networkidle' });
  if (expected) await mobilePage.getByText(expected, { exact: false }).first().waitFor({ state: 'visible' });
}

await openMobile('#lab', 'Can real-world evidence justify a financial claim?');
await mobilePage.getByRole('button', { name: /open primary navigation/i }).click();
for (const label of ['Overview', 'Investigate', 'Research', 'Field Use', 'Programme']) {
  await mobilePage.getByRole('button', { name: label, exact: true }).waitFor({ state: 'visible' });
}
await shot('11-mobile-primary-navigation.png', mobilePage);
await mobilePage.getByRole('button', { name: /close primary navigation/i }).click();
await mobilePage.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
await mobilePage.getByLabel(/Proof \/ assurance/i).waitFor({ state: 'visible' });
await shot('12-mobile-lab-overview-blocked.png', mobilePage);

await selectAssurance(mobilePage, 'PROVENANCE-L2-COUNTERFACTUAL');
await mobilePage.getByText('ADMIT WITH LIMIT', { exact: true }).first().waitFor({ state: 'visible' });
await mobilePage.getByText('126', { exact: true }).first().waitFor({ state: 'visible' });
await shot('12a-mobile-lab-overview-admitted.png', mobilePage);

await selectAssurance(mobilePage, 'PROVENANCE-L0-BASE');
await mobilePage.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });

await openMobile('#cases', 'Investigate the rule that blocks or bounds the case.');
await mobilePage.getByText('BLOCKED', { exact: true }).first().waitFor({ state: 'visible' });
const mapToggle = mobilePage.getByRole('button', { name: /show 3 mapped cases/i });
await mapToggle.waitFor({ state: 'visible' });
if (await mapToggle.getAttribute('aria-expanded') !== 'false') {
  throw new Error('Mobile case map must begin collapsed');
}
await shot('13-mobile-case-explorer-collapsed.png', mobilePage);
await mapToggle.click();
await mobilePage.getByRole('button', { name: /hide map/i }).waitFor({ state: 'visible' });
await shot('14-mobile-case-explorer-expanded.png', mobilePage);

await openMobile(caseBlockedHash, 'Why is this case blocked?');
await mobilePage.getByText('NOT EXECUTED', { exact: true }).waitFor({ state: 'visible' });
await mobilePage.getByRole('navigation', { name: /investigation sequence/i }).waitFor({ state: 'visible' });
if (await mobilePage.locator('#case-input-boundaries').getAttribute('open') !== null) {
  throw new Error('Mobile case inputs should begin collapsed');
}
if (await mobilePage.locator('#case-decision-dossier').getAttribute('open') !== null) {
  throw new Error('Mobile decision dossier should begin collapsed');
}
await shot('15-mobile-blocked-case.png', mobilePage);

await mobilePage.locator('#case-input-boundaries > summary').click();
await mobilePage.getByText(/controlled scenario demonstration/i).first().waitFor({ state: 'visible' });
await shot('15a-mobile-case-inputs-expanded.png', mobilePage);

await mobilePage.getByRole('button', { name: /preview l2 without changing the evidence hash/i }).click();
await mobilePage.getByRole('heading', { name: /why is this case limited to 126/i }).waitFor({ state: 'visible' });
await mobilePage.getByRole('status', { name: /investigation update/i }).waitFor({ state: 'visible' });
await shot('16-mobile-admitted-case.png', mobilePage);

await mobilePage.locator('#case-decision-dossier > summary').click();
await mobilePage.getByText('Policy hash', { exact: true }).waitFor({ state: 'visible' });
await shot('16a-mobile-decision-dossier-expanded.png', mobilePage);

await openMobile(compareHash, 'What changed in the policy before the outcomes changed?');
await mobilePage.getByRole('table', { name: /case policy decision matrix/i }).waitFor({ state: 'visible' });
await mobilePage.getByRole('navigation', { name: /compare reading map/i }).waitFor({ state: 'visible' });
if (await mobilePage.locator('#compare-attribution').getAttribute('open') !== null) {
  throw new Error('Mobile Compare attribution depth should begin collapsed');
}
await shot('17-mobile-compare.png', mobilePage);

await openMobile('#receipts', 'Share the decision identity, not a screenshot.');
await mobilePage.getByRole('navigation', { name: /receipt reading map/i }).waitFor({ state: 'visible' });
if (await mobilePage.locator('#receipt-capsule').getAttribute('open') !== null) {
  throw new Error('Mobile research capsule should begin collapsed');
}
await shot('18-mobile-receipt-collapsed.png', mobilePage);
await mobilePage.locator('#receipt-capsule > summary').click();
await mobilePage.getByRole('heading', { name: /12 portable files/i }).waitFor({ state: 'visible' });
await mobilePage.getByText('ro-crate-metadata.json', { exact: true }).waitFor({ state: 'visible' });
await shot('19-mobile-receipt-capsule-expanded.png', mobilePage);

await openMobile('#runs', 'What did the stricter rule buy');
const studyProof = mobilePage.locator('#study-proof-navigation');
await studyProof.waitFor({ state: 'visible' });
if (await studyProof.getAttribute('open') !== null) {
  throw new Error('Mobile Studies proof layer should begin collapsed');
}
await shot('20-mobile-study-proof-collapsed.png', mobilePage);
await mobilePage.locator('#study-proof-navigation > summary').click();
await mobilePage.getByRole('navigation', { name: /study proof layer navigation/i }).waitFor({ state: 'visible' });
await mobilePage.getByText(/connected by the analytical method/i).waitFor({ state: 'visible' });
await shot('20a-mobile-study-proof-expanded.png', mobilePage);

await mobile.close();
await browser.close();

const files = await fs.readdir(outputDir);
if (files.length !== 30) {
  throw new Error(`Expected 30 flagship workbench review screenshots; received ${files.length}`);
}
console.log(`Captured ${files.length} flagship workbench screenshots in ${outputDir}`);

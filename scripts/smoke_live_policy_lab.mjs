import { chromium } from 'playwright';

const target = process.env.POLICY_LAB_URL || 'https://spectating101.github.io/solarpunk-coin/demo/';
const expectedTitle = /Policy Lab/i;
const OUTSIDE_CASE_ID = 'PUB-AUSGRID-001P';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 60_000 });
  if (!response || !response.ok()) {
    throw new Error(`Policy Lab returned ${response?.status() ?? 'no response'} at ${target}`);
  }

  if (!expectedTitle.test(await page.title())) {
    throw new Error(`Unexpected page title: ${await page.title()}`);
  }

  await page.getByRole('heading', { name: 'Can real-world evidence justify a financial claim?' }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: `${OUTSIDE_CASE_ID} · Ausgrid public evidence` }).waitFor({ timeout: 20_000 });
  await page.getByText('Outside-data checkpoint · machine-observed').waitFor({ timeout: 20_000 });
  await page.getByText('33.066 kWh', { exact: true }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Live claim journey' }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Current explanation' }).waitFor({ timeout: 20_000 });

  const caseSelect = page.getByLabel('Case');
  const assuranceSelect = page.getByLabel('Proof / assurance');
  const policySelect = page.getByLabel('Policy');

  for (const [name, select] of [
    ['case', caseSelect],
    ['assurance', assuranceSelect],
    ['policy', policySelect],
  ]) {
    await select.waitFor({ timeout: 10_000 });
    const optionCount = await select.locator('option').count();
    if (optionCount < 1) throw new Error(`Live ${name} selector has no options`);
  }

  const policyValues = await policySelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (!policyValues.includes('LAB-CASE-OPEN-004')) {
    throw new Error('Current open research policy is missing from the live selector');
  }
  await policySelect.selectOption('LAB-CASE-OPEN-004');

  const caseValues = await caseSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (caseValues.includes(OUTSIDE_CASE_ID)) {
    throw new Error(`${OUTSIDE_CASE_ID} was silently promoted into the controlled interactive case pack`);
  }

  await page.waitForTimeout(500);

  const consequence = page.locator('.platform-decision-mark strong').last();
  await consequence.waitFor({ timeout: 15_000 });
  const decisionText = (await consequence.textContent())?.trim();
  if (!decisionText) throw new Error('Live interactive decision surface rendered without a decision');

  const assuranceOptions = await assuranceSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (assuranceOptions.length > 1) {
    const before = await assuranceSelect.inputValue();
    const alternate = assuranceOptions.find((value) => value !== before);
    if (alternate) {
      await assuranceSelect.selectOption(alternate);
      await page.waitForTimeout(500);
      const after = await assuranceSelect.inputValue();
      if (after === before) throw new Error('Assurance selector did not change state');
    }
  }

  const investigationButton = page.getByRole('button', { name: 'Continue the investigation' });
  await investigationButton.waitFor({ timeout: 10_000 });

  console.log(JSON.stringify({
    status: 'PASS',
    target,
    title: await page.title(),
    outsideDataCheckpoint: OUTSIDE_CASE_ID,
    outsideDataCheckpointVisible: true,
    outsideDataSeparatedFromControlledPack: true,
    interactiveDecision: decisionText,
    interactiveCases: caseValues.length,
    policies: policyValues.length,
    assuranceScenarios: assuranceOptions.length,
    checkedAt: new Date().toISOString(),
  }, null, 2));
} finally {
  await browser.close();
}

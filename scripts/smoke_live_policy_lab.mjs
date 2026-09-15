import { chromium } from 'playwright';

const target = process.env.POLICY_LAB_URL || 'https://spectating101.github.io/solarpunk-coin/demo/';
const expectedSurface = process.env.POLICY_LAB_EXPECT_SURFACE || 'auto';
const expectedTitle = /Policy Lab/i;
const OUTSIDE_CASE_ID = 'PUB-AUSGRID-001P';

if (!['auto', 'legacy', 'browser'].includes(expectedSurface)) {
  throw new Error(`Unsupported POLICY_LAB_EXPECT_SURFACE=${expectedSurface}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

async function openTarget() {
  const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 60_000 });
  if (!response || !response.ok()) {
    throw new Error(`Policy Lab returned ${response?.status() ?? 'no response'} at ${target}`);
  }

  if (!expectedTitle.test(await page.title())) {
    throw new Error(`Unexpected page title: ${await page.title()}`);
  }

  const brandName = page.locator('.brand-name');
  await brandName.waitFor({ timeout: 20_000 });
  if ((await brandName.textContent())?.trim() !== 'Policy Lab') {
    throw new Error(`Unexpected live brand: ${(await brandName.textContent())?.trim() || 'missing'}`);
  }

  const brandMark = page.locator('.brand-mark');
  if ((await brandMark.textContent())?.trim() !== 'P') {
    throw new Error(`Unexpected live brand mark: ${(await brandMark.textContent())?.trim() || 'missing'}`);
  }

  const labUrl = new URL(target);
  labUrl.hash = 'lab';
  await page.goto(labUrl.toString(), { waitUntil: 'networkidle', timeout: 60_000 });

  return { brandName };
}

async function detectSurface() {
  const browserHeading = page.getByRole('heading', { name: /Explore how evidence becomes/i });
  if (await browserHeading.count()) return 'browser';

  const legacyHeading = page.getByRole('heading', { name: 'Can real-world evidence justify a financial claim?' });
  if (await legacyHeading.count()) return 'legacy';

  throw new Error('Could not detect a supported Policy Lab research surface at #lab');
}

async function assertLegacySurface() {
  await page.getByRole('heading', { name: 'Can real-world evidence justify a financial claim?' }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: `${OUTSIDE_CASE_ID} · Ausgrid public evidence` }).waitFor({ timeout: 20_000 });
  await page.getByText('Outside-data checkpoint · machine-observed').waitFor({ timeout: 20_000 });
  await page.getByText('33.066 kWh', { exact: true }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Live claim journey' }).waitFor({ timeout: 20_000 });
  await page.getByRole('heading', { name: 'Current explanation' }).waitFor({ timeout: 20_000 });

  const caseSelect = page.locator('select:has(option[value="TYN-001"])');
  const assuranceSelect = page.locator('select:has(option[value="PROVENANCE-L0-BASE"])');
  const policySelect = page.locator('select:has(option[value="LAB-CASE-OPEN-004"])');

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

  await page.waitForTimeout(300);

  const consequence = page.locator('.platform-decision-mark strong').last();
  await consequence.waitFor({ timeout: 15_000 });
  const decisionText = (await consequence.textContent())?.trim();
  if (!decisionText) throw new Error('Legacy interactive decision surface rendered without a decision');

  const assuranceOptions = await assuranceSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (assuranceOptions.length > 1) {
    const before = await assuranceSelect.inputValue();
    const alternate = assuranceOptions.find((value) => value !== before);
    if (alternate) {
      await assuranceSelect.selectOption(alternate);
      await page.waitForTimeout(300);
      if (await assuranceSelect.inputValue() === before) {
        throw new Error('Legacy assurance selector did not change state');
      }
    }
  }

  await page.getByRole('button', { name: 'Continue the investigation' }).waitFor({ timeout: 10_000 });

  return {
    interactiveDecision: decisionText,
    interactiveCases: caseValues.length,
    policies: policyValues.length,
    assuranceScenarios: assuranceOptions.length,
  };
}

async function assertBrowserSurface() {
  await page.getByRole('heading', { name: /Explore how evidence becomes/i }).waitFor({ timeout: 20_000 });
  await page.getByRole('region', { name: /research landscape explorer/i }).waitFor({ timeout: 20_000 });
  await page.getByLabel(/research corpus index/i).waitFor({ timeout: 20_000 });
  await page.getByLabel(/selected research object/i).waitFor({ timeout: 20_000 });

  const findingButton = page.getByRole('button', { name: /Policy can change financial authority without changing the evidence identity/i }).first();
  await findingButton.waitFor({ timeout: 10_000 });
  await findingButton.click();
  await page.getByRole('heading', { name: /Policy can change financial authority without changing the evidence identity/i }).waitFor({ timeout: 10_000 });
  await page.getByRole('table', { name: /supporting research ledger/i }).waitFor({ timeout: 10_000 });

  const outsideObject = page.getByRole('button', { name: /Ausgrid public checkpoint.*public research object/i });
  await outsideObject.waitFor({ timeout: 10_000 });
  await outsideObject.click();
  await page.getByRole('heading', { name: OUTSIDE_CASE_ID }).waitFor({ timeout: 10_000 });
  await page.getByText('33.066 kWh', { exact: true }).waitFor({ timeout: 10_000 });

  const controlledObject = page.getByRole('button', { name: /Taoyuan controlled energy case.*controlled research object/i });
  await controlledObject.click();

  const parameters = page.getByLabel(/research parameters/i);
  await parameters.waitFor({ timeout: 10_000 });
  const parameterLines = parameters.locator('.rb-parameter-line');
  const assuranceLine = parameterLines.nth(0);
  const policyLine = parameterLines.nth(1);

  const pilotButton = policyLine.getByRole('button', { name: /Pilot ENERGY-CASE-PILOT-005/i });
  await pilotButton.click();

  const l0Button = assuranceLine.getByRole('button', { name: /L0/i }).first();
  await l0Button.click();
  await page.locator('.rb-result-line').getByText('BLOCKED', { exact: true }).waitFor({ timeout: 10_000 });

  const l2Button = assuranceLine.getByRole('button', { name: /L2/i }).first();
  await l2Button.click();
  await page.locator('.rb-result-line').getByText('ADMIT WITH LIMIT', { exact: true }).waitFor({ timeout: 10_000 });
  await page.getByText('126 maximum', { exact: true }).waitFor({ timeout: 10_000 });

  const controlledCases = page.locator('button[aria-label*="controlled research object"]');
  const policyButtons = policyLine.getByRole('button');
  const assuranceButtons = assuranceLine.getByRole('button');

  const controlledCaseCount = await controlledCases.count();
  const policyCount = await policyButtons.count();
  const assuranceCount = await assuranceButtons.count();
  if (controlledCaseCount < 4) throw new Error(`Expected at least 4 controlled cases, found ${controlledCaseCount}`);
  if (policyCount < 3) throw new Error(`Expected at least 3 policies, found ${policyCount}`);
  if (assuranceCount < 4) throw new Error(`Expected at least 4 assurance scenarios, found ${assuranceCount}`);

  if (await page.locator(`button[aria-label*="${OUTSIDE_CASE_ID}"][aria-label*="controlled research object"]`).count()) {
    throw new Error(`${OUTSIDE_CASE_ID} was silently promoted into the controlled case class`);
  }

  await page.getByRole('button', { name: /^Workbench$/i }).click();
  await page.getByRole('heading', { name: /evidence-constrained policy analysis/i }).waitFor({ timeout: 10_000 });
  await page.getByLabel(/research workspace browser/i).waitFor({ timeout: 10_000 });
  await page.getByLabel(/research object inspector/i).waitFor({ timeout: 10_000 });

  const workbenchCaseSelect = page.locator('select:has(option[value="TYN-001"])');
  const workbenchCaseValues = await workbenchCaseSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (workbenchCaseValues.includes(OUTSIDE_CASE_ID)) {
    throw new Error(`${OUTSIDE_CASE_ID} was silently promoted into the Workbench controlled case pack`);
  }

  return {
    interactiveDecision: 'ADMIT WITH LIMIT',
    interactiveCases: controlledCaseCount,
    policies: policyCount,
    assuranceScenarios: assuranceCount,
  };
}

try {
  const { brandName } = await openTarget();
  const detectedSurface = await detectSurface();

  if (expectedSurface !== 'auto' && detectedSurface !== expectedSurface) {
    throw new Error(`Expected ${expectedSurface} Policy Lab surface but detected ${detectedSurface}`);
  }

  const details = detectedSurface === 'browser'
    ? await assertBrowserSurface()
    : await assertLegacySurface();

  console.log(JSON.stringify({
    status: 'PASS',
    target,
    title: await page.title(),
    liveBrand: (await brandName.textContent())?.trim(),
    detectedSurface,
    expectedSurface,
    outsideDataCheckpoint: OUTSIDE_CASE_ID,
    outsideDataCheckpointVisible: true,
    outsideDataSeparatedFromControlledPack: true,
    ...details,
    checkedAt: new Date().toISOString(),
  }, null, 2));
} finally {
  await browser.close();
}

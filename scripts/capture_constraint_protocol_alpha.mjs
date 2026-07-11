#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || '_review_protocol_alpha';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function newPage(viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  return { context, page };
}

async function shot(page, name, fullPage = true) {
  await page.screenshot({ path: path.join(outDir, name), fullPage });
}

async function openProtocol(page) {
  await page.goto('http://127.0.0.1:4173/#protocol', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Turn evidence into an explicit claim decision/i }).waitFor();
}

async function runSample(page, sourceLabel = null) {
  if (sourceLabel) await page.getByRole('button', { name: new RegExp(sourceLabel, 'i') }).click();
  await page.getByRole('button', { name: /Run bundled example/i }).click();
  await page.getByText(/Evidence normalized\./i).waitFor({ timeout: 15000 });
}

const desktop = await newPage({ width: 1440, height: 1000 });
await openProtocol(desktop.page);
await shot(desktop.page, '01-protocol-entry.png');

await runSample(desktop.page);
await shot(desktop.page, '02-cumulative-evidence.png');

await desktop.page.getByRole('button', { name: /Build claim under LAB-OPEN-001/i }).click();
await desktop.page.getByRole('heading', { name: /Bounded Claim Laboratory/i }).waitFor();
await shot(desktop.page, '03-claim-admitted.png');

await desktop.page.getByRole('button', { name: /Evaluate settlement/i }).click();
await desktop.page.getByText(/Settlement constraint failed/i).waitFor();
await shot(desktop.page, '04-settlement-shortfall.png');

await runSample(desktop.page, 'Utility / Green Button');
await shot(desktop.page, '05-utility-evidence.png');

await runSample(desktop.page, 'Signed meter evidence');
await desktop.page.getByText(/2 interval\(s\)/i).waitFor();
await desktop.page.getByText('ADMIT_WITH_LIMIT').first().waitFor();
await shot(desktop.page, '06-signed-attestation.png');
await desktop.context.close();

// Fresh browser context prevents desktop protocol state from leaking into mobile entry QA.
const mobile = await newPage({ width: 390, height: 844 });
await openProtocol(mobile.page);
await shot(mobile.page, '07-mobile-entry.png');
await runSample(mobile.page);
await shot(mobile.page, '08-mobile-evidence.png');
await mobile.context.close();

await browser.close();
console.log(`wrote protocol alpha screenshots to ${outDir}`);

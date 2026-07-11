#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || '_review_protocol_alpha';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

async function shot(name, fullPage = true) {
  await page.screenshot({ path: path.join(outDir, name), fullPage });
}

async function runSample(sourceLabel = null) {
  if (sourceLabel) await page.getByRole('button', { name: new RegExp(sourceLabel, 'i') }).click();
  await page.getByRole('button', { name: /Run bundled example/i }).click();
  await page.getByText(/Evidence normalized\./i).waitFor({ timeout: 15000 });
}

await page.goto('http://127.0.0.1:4173/#protocol', { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: /Turn evidence into an explicit claim decision/i }).waitFor();
await shot('01-protocol-entry.png');

await runSample();
await shot('02-cumulative-evidence.png');

await page.getByRole('button', { name: /Build claim under LAB-OPEN-001/i }).click();
await page.getByRole('heading', { name: /Bounded Claim Laboratory/i }).waitFor();
await shot('03-claim-admitted.png');

await page.getByRole('button', { name: /Evaluate settlement/i }).click();
await page.getByText(/Settlement constraint failed/i).waitFor();
await shot('04-settlement-shortfall.png');

await runSample('Utility / Green Button');
await shot('05-utility-evidence.png');

await runSample('Signed meter evidence');
await page.getByText(/2 interval\(s\)/i).waitFor();
await shot('06-signed-attestation.png');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4173/#protocol', { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: /Turn evidence into an explicit claim decision/i }).waitFor();
await shot('07-mobile-entry.png');
await runSample();
await shot('08-mobile-evidence.png');

await browser.close();
console.log(`wrote protocol alpha screenshots to ${outDir}`);

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

async function openRuns(page) {
  await page.goto('http://127.0.0.1:4173/#runs', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Policy decisions should survive contact with historical outcomes/i }).waitFor();
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
await openRuns(desktop.page);
await shot(desktop.page, '01-empirical-study.png');
await desktop.page.getByRole('button', { name: /Policy frontier/i }).click();
await desktop.page.getByRole('heading', { name: /Capacity versus coverage is a measurable trade-off/i }).waitFor();
await shot(desktop.page, '02-policy-frontier.png');
await desktop.page.getByRole('button', { name: /Stress replays/i }).click();
await desktop.page.getByRole('heading', { name: /Replay fixed policy against the dates where it broke hardest/i }).waitFor();
await shot(desktop.page, '03-stress-replay.png');
await desktop.page.getByRole('button', { name: /Methods/i }).click();
await desktop.page.getByRole('heading', { name: /Inputs, cleaning rules, formulas, and boundaries are first-class output/i }).waitFor();
await shot(desktop.page, '04-methods-dossier.png');

await openProtocol(desktop.page);
await shot(desktop.page, '05-protocol-entry.png');
await runSample(desktop.page);
await shot(desktop.page, '06-cumulative-evidence.png');
await desktop.page.getByRole('button', { name: /Build claim under LAB-OPEN-001/i }).click();
await desktop.page.getByRole('heading', { name: /Bounded Claim Laboratory/i }).waitFor();
await shot(desktop.page, '07-claim-admitted.png');
await desktop.page.getByRole('button', { name: /Evaluate settlement/i }).click();
await desktop.page.getByText(/Settlement constraint failed/i).waitFor();
await shot(desktop.page, '08-settlement-shortfall.png');
await runSample(desktop.page, 'Utility / Green Button');
await shot(desktop.page, '09-utility-evidence.png');
await runSample(desktop.page, 'Signed meter evidence');
await desktop.page.getByText(/2 interval\(s\)/i).waitFor();
await desktop.page.getByText('ADMIT_WITH_LIMIT').first().waitFor();
await shot(desktop.page, '10-signed-attestation.png');
await desktop.context.close();

// Fresh browser context prevents desktop state from leaking into mobile QA.
const mobile = await newPage({ width: 390, height: 844 });
await openRuns(mobile.page);
await shot(mobile.page, '11-mobile-empirical-study.png');
await mobile.page.getByRole('button', { name: /Stress replays/i }).click();
await mobile.page.getByRole('heading', { name: /Replay fixed policy against the dates where it broke hardest/i }).waitFor();
await shot(mobile.page, '12-mobile-stress-replay.png');
await openProtocol(mobile.page);
await shot(mobile.page, '13-mobile-protocol-entry.png');
await runSample(mobile.page);
await shot(mobile.page, '14-mobile-evidence.png');
await mobile.context.close();

await browser.close();
console.log(`wrote protocol alpha screenshots to ${outDir}`);

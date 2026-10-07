// Visual-quality budgets for the built Policy Lab frontend (default state of every route).
//
// Loads each route at desktop, tablet and phone widths in headless Chromium and fails when a
// route overflows its container, clips text, falls below the type floor, drops below AA
// contrast, has undersized targets, renders a light native <select>, shows an unresolved value
// ("NaN", "undefined"), renders an empty page, or requests anything from a third-party origin
// (the site serves its own fonts and scripts). For every reachable state (all cases, policies,
// scenarios, lenses, modes, interactions, text zoom and reflow) use check_visual_states.mjs.
//
//   npm --prefix frontend run build && npx --prefix frontend vite preview --port 4173
//   CASE_WORKBENCH_URL=http://127.0.0.1:4173/ node scripts/check_visual_quality.mjs [report.json]
//   (set CHROMIUM_EXECUTABLE_PATH to use a Chromium other than Playwright's bundled build)
//
// Contrast is computed against flat, alpha-composited background colours and ignores
// gradients, so treat it as a regression guard rather than an accessibility audit.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { BUDGETS, budgetFailures, measurePage } from './lib/visual_measure.mjs';

export { BUDGETS };

const url = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const reportPath = process.argv[2] ? path.resolve(process.argv[2]) : null;
const ownOrigin = new URL(url).origin;

const ROUTES = [
  'lab', 'investigate', 'case/TYN-001', 'compare', 'research', 'study', 'field',
  'programme', 'receipts', 'reference', 'evidence', 'currency', 'analysis', 'verify',
  'protocol', 'runs', 'reproduce', 'sepolia',
];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['tablet', { width: 820, height: 1180 }],
  ['mobile', { width: 390, height: 844 }],
];
// Historical SolarPunk routes that read a public Sepolia RPC (disclosed in PRIVACY.md).
const EXTERNAL_REQUESTS_ALLOWED = new Set(['reference', 'sepolia']);

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
});
const results = {};
const failures = [];
try {
  for (const [vpName, viewport] of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    for (const route of ROUTES) {
      const page = await context.newPage();
      const errors = [];
      const foreignOrigins = new Set();
      page.on('request', (request) => {
        const target = new URL(request.url());
        if (target.protocol.startsWith('http') && target.origin !== ownOrigin) foreignOrigins.add(target.origin);
      });
      page.on('pageerror', (error) => errors.push(error.message.slice(0, 120)));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text().slice(0, 120)); });
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      const m = await page.evaluate(measurePage, BUDGETS.minFontPx);
      m.consoleErrors = errors.length;
      m.consoleErrorSamples = errors.slice(0, 3);
      m.thirdPartyOrigins = EXTERNAL_REQUESTS_ALLOWED.has(route.split('/')[0]) ? 0 : foreignOrigins.size;
      m.thirdPartyOriginSamples = [...foreignOrigins];
      const key = `${vpName}:${route}`;
      results[key] = m;
      failures.push(...budgetFailures(key, m).map((f) => f.message));
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

if (reportPath) await fs.writeFile(reportPath, `${JSON.stringify({ url, budgets: BUDGETS, results }, null, 2)}\n`);
if (failures.length) {
  console.error(`Visual quality: ${failures.length} budget violation(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`Visual quality: ${Object.keys(results).length} route/viewport checks within budget`);

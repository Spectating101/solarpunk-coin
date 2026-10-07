// Cold-load performance budgets for the built Policy Lab frontend on an emulated mid-range phone.
//
// Loads key routes with the cache disabled, a "Slow 4G" connection (1.6 Mbps, 150 ms RTT) and a
// 4x CPU slowdown, then checks layout stability, paint time, blocking time and transfer size.
//
//   npm --prefix frontend run build && npx --prefix frontend vite preview --port 4173
//   CASE_WORKBENCH_URL=http://127.0.0.1:4173/ node scripts/check_load_performance.mjs [report.json]
//   (set CHROMIUM_EXECUTABLE_PATH to use a Chromium other than Playwright's bundled build)
//
// Layout shift and transfer size are stable across machines and budgeted tightly. Paint and
// blocking time depend on the runner, so their budgets only catch large regressions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const reportPath = process.argv[2] ? path.resolve(process.argv[2]) : null;

export const BUDGETS = Object.freeze({
  cumulativeLayoutShift: 0.1, // Google's "good" threshold
  largestContentfulPaintMs: 4500,
  totalBlockingTimeMs: 300,
  transferKb: 400,
  requests: 30,
});
const ROUTES = ['lab', 'case/TYN-001', 'compare', 'receipts', 'study'];
const RUNS = 2;

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
});
const results = {};
const failures = [];
try {
  for (const route of ROUTES) {
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      let bytes = 0;
      let requests = 0;
      cdp.on('Network.loadingFinished', (event) => { bytes += event.encodedDataLength; requests += 1; });
      await page.addInitScript(() => {
        window.__perf = { lcp: 0, cls: 0, tbt: 0 };
        new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__perf.tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
      });
      await page.goto(`${url}#${route}`, { waitUntil: 'load', timeout: 90000 });
      await page.waitForFunction(() => (document.querySelector('main')?.innerText || '').length > 60, null, { timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(2500);
      const perf = await page.evaluate(() => window.__perf);
      runs.push({ ...perf, kb: bytes / 1024, requests });
      await context.close();
    }
    const m = {
      cumulativeLayoutShift: +median(runs.map((r) => r.cls)).toFixed(3),
      largestContentfulPaintMs: Math.round(median(runs.map((r) => r.lcp))),
      totalBlockingTimeMs: Math.round(median(runs.map((r) => r.tbt))),
      transferKb: Math.round(median(runs.map((r) => r.kb))),
      requests: median(runs.map((r) => r.requests)),
    };
    results[route] = m;
    for (const [name, limit] of Object.entries(BUDGETS)) {
      if (m[name] > limit) failures.push(`${route} ${name}: ${m[name]} (budget ${limit})`);
    }
  }
} finally {
  await browser.close();
}

if (reportPath) await fs.writeFile(reportPath, `${JSON.stringify({ url, budgets: BUDGETS, results }, null, 2)}\n`);
const row = (route, m) => `${route.padEnd(14)} CLS ${String(m.cumulativeLayoutShift).padEnd(6)} LCP ${String(m.largestContentfulPaintMs).padEnd(5)}ms TBT ${String(m.totalBlockingTimeMs).padEnd(4)}ms ${String(m.transferKb).padEnd(4)}KB ${m.requests} requests`;
for (const [route, m] of Object.entries(results)) console.log(row(route, m));
if (failures.length) {
  console.error(`Load performance: ${failures.length} budget violation(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('Load performance: within budget on every route');

// Exhaustive visual-state checks for the built Policy Lab frontend.
//
// Where check_visual_quality.mjs measures the default state of each route, this walks the
// reachable state space and applies the same measurements (overflow, clipped text, type floor,
// AA contrast, target size, native selects, unresolved values, empty pages, console errors,
// third-party requests) to every state:
//
//   routes      every route x overview/full-analysis mode x phone/tablet/desktop widths
//   cases       every case x policy x assurance scenario x lens (profile "full"; a slice in "ci")
//   compare     every scenario x ordered policy pair
//   tools       every Analysis Lab and Verification Hub tool
//   receipts    receipts opened from case pages
//   controls    every in-page button on each route, one at a time, plus open disclosures,
//               the mobile menu and the settlement slider at its extremes
//   stress      320px reflow, 360px (400% zoom), 720px (200% zoom), WCAG text-spacing overrides,
//               forced-colors, reduced motion and print rendering
//
//   npm --prefix frontend run build && npx --prefix frontend vite preview --port 4173
//   CASE_WORKBENCH_URL=http://127.0.0.1:4173/ node scripts/check_visual_states.mjs \
//       [--profile ci|full] [--axe] [--screenshots DIR] [--report FILE] [--browser chromium|firefox|webkit]
//   (set CHROMIUM_EXECUTABLE_PATH to use a Chromium other than Playwright's bundled build;
//    VISUAL_STATES_CONCURRENCY sets parallel pages, default 3)
import fs from 'node:fs/promises';
import path from 'node:path';
import axe from 'axe-core';
import playwright from 'playwright';
import { BUDGETS, budgetFailures, measurePage } from './lib/visual_measure.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const url = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const origin = new URL(url).origin;
const profile = option('profile', 'ci');
const full = profile === 'full';
const withAxe = flag('axe');
const screenshotDir = option('screenshots', null) && path.resolve(option('screenshots'));
const reportPath = option('report', null) && path.resolve(option('report'));
const browserName = option('browser', 'chromium');
const concurrency = Number(process.env.VISUAL_STATES_CONCURRENCY || 3);
const onlyGroups = option('groups', null)?.split(',');
const onlyRoutes = option('routes', null)?.split(',');

const CASES = ['TYN-001', 'AUS-001', 'PHX-001', 'OPS-001', 'CPT-001'];
const POLICIES = ['LAB-CASE-OPEN-004', 'ENERGY-CASE-PILOT-005', 'ENERGY-CASE-STRICT-006'];
const SCENARIOS = [
  'PROVENANCE-L0-BASE', 'PROVENANCE-L1-COUNTERFACTUAL',
  'PROVENANCE-L2-COUNTERFACTUAL', 'PROVENANCE-L4-COUNTERFACTUAL',
];
const LENSES = ['constraints', 'evidence', 'stress', 'lineage'];
const ROUTES = [
  'lab', 'investigate', 'case/TYN-001', 'cases', 'compare', 'research', 'study', 'field',
  'programme', 'receipts', 'reference', 'evidence', 'currency', 'analysis', 'verify',
  'protocol', 'runs', 'reproduce', 'sepolia',
];
const CORE_ROUTES = ['lab', 'investigate', 'case/TYN-001', 'compare', 'research', 'field', 'programme', 'receipts'];
const ANALYSIS_TOOLS = ['cases', 'compare', 'stress', 'saved'];
const VERIFY_TOOLS = ['lineage', 'receipt', 'capsule', 'objects'];
const VIEWPORTS = {
  phone320: { width: 320, height: 640 },
  phone: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
};
const only = (list) => (onlyRoutes ? list.filter((r) => onlyRoutes.includes(r.split('/')[0]) || onlyRoutes.includes(r)) : list);
const ROUTE_WIDTHS = full ? ['phone320', 'phone', 'tablet', 'desktop', 'wide'] : ['phone', 'tablet', 'desktop'];
const STATE_WIDTHS = full ? ['phone', 'tablet', 'desktop'] : ['phone', 'desktop'];
// Historical SolarPunk routes read a public Sepolia RPC (disclosed in PRIVACY.md).
const EXTERNAL_OK = new Set(['reference', 'sepolia', 'overview']);
// Controls that start downloads, copy, open wallets or leave the page are not clicked.
const SKIP_CONTROL = /download|json|memo|capsule|manifest|bundle|copy|connect|wallet|metamask|github|open in|new tab/i;

const launchOptions = {
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE_PATH && browserName === 'chromium' ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
};

const results = new Map();
const failures = [];
const stats = { states: 0, measurements: 0, axeRuns: 0, clicks: 0 };

const slug = (s) => s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 110);
const hashFor = (route) => `#${route}`;

async function settle(page) {
  await page.waitForFunction(() => {
    if (document.querySelector('[aria-busy="true"]')) return false;
    const main = document.querySelector('main');
    return Boolean(main) && main.innerText.trim().length >= 40 && !/Evaluating|Loading/i.test(main.innerText.slice(0, 400));
  }, null, { timeout: 7000 }).catch(() => {});
  await page.waitForTimeout(200);
}

async function newPage(browser, viewport, extra = {}) {
  const context = await browser.newContext({ viewport, ...extra });
  const page = await context.newPage();
  const sink = { errors: [], foreign: new Set(), failed: [] };
  page.on('pageerror', (e) => sink.errors.push(e.message.slice(0, 140)));
  page.on('console', (m) => { if (m.type() === 'error') sink.errors.push(m.text().slice(0, 140)); });
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol.startsWith('http') && u.origin !== origin) sink.foreign.add(u.origin);
  });
  page.on('response', (r) => {
    const u = new URL(r.url());
    if (u.origin === origin && r.status() >= 400) sink.failed.push(`${r.status()} ${u.pathname}`);
  });
  return { context, page, sink };
}

async function measure(page, sink, key, { routeKey = '', skipContrast = false, skipSelects = false, axeToo = withAxe, shot = false } = {}) {
  await settle(page);
  const m = await page.evaluate(measurePage, BUDGETS.minFontPx);
  const errs = [...sink.errors, ...sink.failed];
  m.consoleErrors = errs.length;
  m.consoleErrorSamples = errs.slice(0, 3);
  // Judge by the route the page is actually on: a click may have navigated to a historical route.
  const landed = await page.evaluate(() => location.hash.replace(/^#\/?/, '').split(/[/?]/)[0]);
  m.thirdPartyOrigins = EXTERNAL_OK.has(routeKey.split('/')[0]) || EXTERNAL_OK.has(landed) ? 0 : sink.foreign.size;
  m.thirdPartyOriginSamples = [...sink.foreign];
  if (skipContrast) m.charsBelowContrastPct = 0;
  // Forced-colors mode deliberately replaces control colours with system colours.
  if (skipSelects) m.lightNativeSelects = 0;
  // Let in-flight requests from a historical route finish so they are not attributed to the next state.
  if (EXTERNAL_OK.has(landed)) {
    await page.waitForLoadState('networkidle').catch(() => {});
    // Events can be delivered late on a loaded machine; keep attributing them to this route.
    await page.waitForTimeout(1500);
  }
  sink.errors.length = 0;
  sink.foreign.clear();
  sink.failed.length = 0;
  stats.measurements += 1;
  const fails = budgetFailures(key, m);
  if (axeToo) {
    // A sticky bar can cover part of a control at an arbitrary scroll position; measure from the top.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(axe.source);
    const violations = await page.evaluate(async () => {
      const r = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        resultTypes: ['violations'],
      });
      return r.violations.map((v) => {
        const n = v.nodes[0];
        const why = ((n.any[0] || n.all[0] || n.none[0] || {}).message || '').replace(/\s+/g, ' ').slice(0, 130);
        return `axe [${v.impact}] ${v.id} x${v.nodes.length}: ${n.target.join(' ').slice(0, 80)} :: ${why}`;
      });
    });
    stats.axeRuns += 1;
    for (const v of violations) {
      const [, id, rest] = v.match(/^axe \[\w+\] (\S+) x\d+: (.*)$/) || [];
      fails.push({ rule: `axe:${id}`, key, detail: rest || v, message: `${key} ${v}` });
    }
  }
  if (screenshotDir && shot) {
    await page.screenshot({ path: path.join(screenshotDir, `${slug(key)}.jpg`), fullPage: true, type: 'jpeg', quality: 72 }).catch(() => {});
  }
  results.set(key, { m, fails: fails.length });
  failures.push(...fails);
  return m;
}

/** Runs async jobs with bounded concurrency. */
async function pool(jobs) {
  const queue = [...jobs];
  const workers = Array.from({ length: concurrency }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      try { await job(); } catch (error) { failures.push({ rule: 'crawler', key: 'crawler', detail: String(error.message).split('\n')[0].slice(0, 120), message: `crawler error: ${String(error.message).split('\n')[0]}` }); }
    }
  });
  await Promise.all(workers);
}

// --- state groups ------------------------------------------------------------------------

function routeJobs(browser) {
  return ROUTE_WIDTHS.flatMap((w) => ['overview', 'full'].map((mode) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    for (const route of only(ROUTES)) {
      const target = `${url}${mode === 'full' ? '?view=full' : ''}${hashFor(route)}`;
      await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });
      stats.states += 1;
      await measure(page, sink, `route ${mode} ${w} ${route}`, { routeKey: route, shot: true });
    }
    await context.close();
  }));
}

function caseJobs(browser) {
  const caseIds = full ? CASES : CASES;
  const policies = full ? POLICIES : [POLICIES[1]];
  const scenarios = full ? SCENARIOS : [SCENARIOS[0], SCENARIOS[2]];
  return STATE_WIDTHS.map((w) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    await page.goto(`${url}#lab`, { waitUntil: 'networkidle' });
    for (const c of caseIds) for (const p of policies) for (const s of scenarios) for (const l of LENSES) {
      const route = `case/${c}?policy=${p}&scenario=${s}&lens=${l}`;
      await page.evaluate((r) => { window.location.hash = r; }, route);
      stats.states += 1;
      const key = `case ${w} ${c} ${p.replace('ENERGY-CASE-', '').replace('LAB-CASE-', '')} ${s.replace('PROVENANCE-', '').replace('-COUNTERFACTUAL', '')} ${l}`;
      await measure(page, sink, key, { routeKey: 'case', axeToo: withAxe && (l === 'constraints' || full), shot: (l === 'constraints' || l === 'stress') && (s === SCENARIOS[0] || s === SCENARIOS[2]) });
    }
    await context.close();
  });
}

function compareJobs(browser) {
  const scenarios = full ? SCENARIOS : [SCENARIOS[0], SCENARIOS[2]];
  const pairs = POLICIES.flatMap((a) => POLICIES.filter((b) => b !== a).map((b) => [a, b]));
  const usePairs = full ? pairs : pairs.slice(0, 2);
  return STATE_WIDTHS.map((w) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    await page.goto(`${url}#lab`, { waitUntil: 'networkidle' });
    for (const s of scenarios) for (const [a, b] of usePairs) {
      await page.evaluate((r) => { window.location.hash = r; }, `compare?scenario=${s}&baseline=${a}&comparison=${b}`);
      stats.states += 1;
      await measure(page, sink, `compare ${w} ${s.replace('PROVENANCE-', '')} ${a.slice(-3)}->${b.slice(-3)}`, { routeKey: 'compare', shot: true });
    }
    await context.close();
  });
}

function toolJobs(browser) {
  return STATE_WIDTHS.flatMap((w) => ['overview', 'full'].map((mode) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    const suffix = mode === 'full' ? '?view=full' : '';
    for (const [route, tools] of [['analysis', ANALYSIS_TOOLS], ['verify', VERIFY_TOOLS]]) {
      for (const tool of tools) {
        await page.goto(`${url}${suffix}#${route}?tool=${tool}`, { waitUntil: 'networkidle', timeout: 45000 });
        stats.states += 1;
        await measure(page, sink, `tool ${mode} ${w} ${route}/${tool}`, { routeKey: route, shot: true });
      }
    }
    await context.close();
  }));
}

function receiptJobs(browser) {
  const combos = full
    ? CASES.flatMap((c) => POLICIES.flatMap((p) => SCENARIOS.map((s) => [c, p, s])))
    : CASES.map((c) => [c, POLICIES[1], SCENARIOS[0]]).concat([['TYN-001', POLICIES[1], SCENARIOS[2]]]);
  return STATE_WIDTHS.map((w) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    for (const [c, p, s] of combos) {
      await page.goto(`${url}#case/${c}?policy=${p}&scenario=${s}&lens=constraints`, { waitUntil: 'networkidle' });
      await settle(page);
      const open = page.getByRole('button', { name: /^Open receipt$/ });
      if (!(await open.count()) || !(await open.first().isEnabled())) { failures.push({ rule: 'receiptUnavailable', key: `receipt ${w} ${c}`, detail: 'Open receipt unavailable', message: `receipt ${w} ${c}: Open receipt unavailable` }); continue; }
      await open.first().click();
      await page.locator('.receipt-detail').first().waitFor({ timeout: 8000 }).catch(() => {});
      stats.states += 1;
      await measure(page, sink, `receipt ${w} ${c} ${p.slice(-3)} ${s.replace('PROVENANCE-', '').slice(0, 2)}`, { routeKey: 'receipt', shot: true });
    }
    await context.close();
  });
}

async function candidateControls(page) {
  return page.evaluate((skipSource) => {
    const skip = new RegExp(skipSource, 'i');
    const root = document.querySelector('main') || document.body;
    const out = [];
    root.querySelectorAll('button, summary, [role="tab"]').forEach((el, index) => {
      const r = el.getBoundingClientRect();
      const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!r.width || !r.height || el.disabled || skip.test(text)) return;
      out.push({ index, text: text.slice(0, 40) });
    });
    return out;
  }, SKIP_CONTROL.source);
}

function controlJobs(browser) {
  const routes = only(full ? ROUTES : CORE_ROUTES);
  const cap = full ? 60 : 24;
  return STATE_WIDTHS.map((w) => async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
    for (const route of routes) {
      for (const mode of ['overview', 'full']) {
        if (!full && mode === 'full') continue;
        const target = `${url}${mode === 'full' ? '?view=full' : ''}${hashFor(route)}`;
        await page.goto(target, { waitUntil: 'networkidle' });
        await settle(page);
        const baseline = await candidateControls(page);
        for (const item of baseline.slice(0, cap)) {
          await page.goto(target, { waitUntil: 'networkidle' });
          await settle(page);
          const current = await candidateControls(page);
          const match = current.find((c) => c.index === item.index && c.text === item.text);
          if (!match) continue;
          const handle = await page.evaluateHandle((i) => (document.querySelector('main') || document.body).querySelectorAll('button, summary, [role="tab"]')[i], match.index);
          const el = handle.asElement();
          if (!el) continue;
          await el.scrollIntoViewIfNeeded().catch(() => {});
          await el.click({ timeout: 4000 }).catch(() => {});
          stats.clicks += 1;
          stats.states += 1;
          await measure(page, sink, `control ${mode} ${w} ${route} #${item.index} "${item.text}"`, { routeKey: route });
        }
        // every disclosure open at once
        await page.goto(target, { waitUntil: 'networkidle' });
        await settle(page);
        await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
        stats.states += 1;
        await measure(page, sink, `disclosures-open ${mode} ${w} ${route}`, { routeKey: route, shot: true });
      }
    }
    if (w === 'phone') {
      await page.goto(`${url}#lab`, { waitUntil: 'networkidle' });
      await page.locator('.mobile-nav-trigger').click();
      stats.states += 1;
      await measure(page, sink, 'mobile-menu-open phone lab', { routeKey: 'lab', shot: true });
    }
    // settlement slider extremes on the overview and the stress lens
    for (const [route, label] of [['lab', 'overview'], [`case/TYN-001?policy=${POLICIES[1]}&scenario=${SCENARIOS[2]}&lens=stress`, 'stress']]) {
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
      await settle(page);
      const slider = page.locator('input[type="range"]').first();
      if (!(await slider.count())) continue;
      for (const value of [0, 10, 40, 100]) {
        await slider.evaluate((el, v) => {
          const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          set.call(el, String(Math.min(Math.max(v, Number(el.min) || 0), Number(el.max) || 100)));
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
        stats.states += 1;
        await measure(page, sink, `slider ${w} ${label} ${value}`, { routeKey: 'case', shot: value === 0 });
      }
    }
    await context.close();
  });
}

function stressJobs(browser) {
  const routes = only(full ? ROUTES : CORE_ROUTES);
  const jobs = [];
  // reflow: 320 CSS px is 400% zoom on a 1280 px window; 360 and 720 are 400% and 200% of 1440
  for (const [label, viewport] of [['reflow-320', { width: 320, height: 640 }], ['zoom400-360', { width: 360, height: 700 }], ['zoom200-720', { width: 720, height: 900 }]]) {
    jobs.push(async () => {
      const { context, page, sink } = await newPage(browser, viewport);
      for (const route of routes) {
        await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
        stats.states += 1;
        await measure(page, sink, `${label} ${route}`, { routeKey: route, shot: label === 'reflow-320' });
      }
      await context.close();
    });
  }
  // WCAG 1.4.12 text spacing overrides must not clip or hide content
  for (const w of ['phone', 'desktop']) {
    jobs.push(async () => {
      const { context, page, sink } = await newPage(browser, VIEWPORTS[w]);
      for (const route of routes) {
        await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
        stats.states += 1;
        // spacing legitimately lengthens text; only hidden/clipped content and errors are failures here
        const m = await measure(page, sink, `text-spacing ${w} ${route}`, { routeKey: route, skipContrast: true, shot: w === 'phone' });
        void m;
      }
      await context.close();
    });
  }
  // forced colours, reduced motion, print
  jobs.push(async () => {
    const { context, page, sink } = await newPage(browser, VIEWPORTS.desktop, { forcedColors: 'active', reducedMotion: 'reduce' });
    for (const route of routes) {
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
      stats.states += 1;
      await measure(page, sink, `forced-colors+reduced-motion ${route}`, { routeKey: route, skipContrast: true, skipSelects: true, axeToo: false, shot: true });
      const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length);
      stats.measurements += 1;
      if (running > 0) failures.push({ rule: 'reducedMotion', key: `reduced-motion ${route}`, detail: `${running} infinite animation(s)`, message: `reduced-motion ${route}: ${running} infinite animation(s) still running with prefers-reduced-motion: reduce` });
    }
    await context.close();
  });
  // Print: A4 width, no background graphics (the browser default), contrast measured on plain paper.
  jobs.push(async () => {
    const { context, page, sink } = await newPage(browser, { width: 794, height: 1123 });
    for (const route of ['lab', 'case/TYN-001', 'compare', 'receipts', 'research', 'study']) {
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
      await settle(page);
      await page.emulateMedia({ media: 'print' });
      stats.states += 1;
      await measure(page, sink, `print ${route}`, { routeKey: route, axeToo: false, shot: true });
      if (browserName === 'chromium') {
        try {
          const pdf = await page.pdf({ format: 'A4', printBackground: false });
          const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
          stats.measurements += 1;
          if (pages < 1 || pages > 14) failures.push({ rule: 'printPages', key: `print ${route}`, detail: `${pages} pages`, message: `print ${route}: PDF has ${pages} pages (expected 1-14)` });
        } catch (error) {
          failures.push({ rule: 'printPdf', key: `print ${route}`, detail: String(error.message).slice(0, 80), message: `print ${route}: PDF generation failed: ${error.message}` });
        }
      }
      await page.emulateMedia({ media: 'screen' });
    }
    await context.close();
  });
  return jobs;
}

// --- run ---------------------------------------------------------------------------------

if (screenshotDir) await fs.mkdir(screenshotDir, { recursive: true });
const browser = await playwright[browserName].launch(launchOptions);
const started = Date.now();
try {
  const groups = [
    ['routes', routeJobs(browser)], ['cases', caseJobs(browser)], ['compare', compareJobs(browser)],
    ['tools', toolJobs(browser)], ['receipts', receiptJobs(browser)],
    ['controls', controlJobs(browser)], ['stress', stressJobs(browser)],
  ];
  for (const [name, jobs] of groups) {
    if (onlyGroups && !onlyGroups.includes(name)) continue;
    const before = stats.states;
    await pool(jobs);
    console.log(`  ${name.padEnd(9)} ${stats.states - before} states`);
  }
} finally {
  await browser.close();
}

// group duplicate failures: the same fault across many states is one finding
const groupsByFinding = new Map();
for (const f of failures) {
  const id = `${f.rule}|${f.detail.replace(/\d+/g, '#').slice(0, 100)}`;
  const g = groupsByFinding.get(id) || { rule: f.rule, sample: f.detail, states: [] };
  g.states.push(f.key);
  groupsByFinding.set(id, g);
}

const summary = {
  url, profile, browser: browserName, axe: withAxe, seconds: Math.round((Date.now() - started) / 1000), ...stats,
  findings: [...groupsByFinding.values()].sort((a, b) => b.states.length - a.states.length),
};
if (reportPath) {
  await fs.writeFile(reportPath, `${JSON.stringify({ ...summary, results: Object.fromEntries([...results].map(([k, v]) => [k, v.m])) }, null, 1)}\n`);
}
console.log(`\nVisual states [${profile}${withAxe ? '+axe' : ''}, ${browserName}]: ${stats.states} states, ${stats.measurements} measurements, ${stats.clicks} control clicks, ${stats.axeRuns} axe runs in ${summary.seconds}s`);
if (summary.findings.length) {
  console.error(`${summary.findings.length} distinct finding(s) across ${failures.length} violation(s):`);
  for (const f of summary.findings.slice(0, 40)) {
    console.error(`  [${f.states.length}x] ${f.rule}${f.sample ? `  ${f.sample}` : ''}\n      e.g. ${f.states.slice(0, 3).join(' | ')}`);
  }
  process.exit(1);
}
console.log('All states within budget.');

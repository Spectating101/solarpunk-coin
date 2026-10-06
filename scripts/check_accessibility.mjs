// Accessibility checks for the built Policy Lab frontend.
//
//   1. axe-core (WCAG 2.0-2.2 A/AA plus best practice) must report no violations on any route at
//      desktop, tablet and phone widths.
//   2. Keyboard behaviour: the first Tab stop is a working skip link, every tab stop on key pages
//      shows a focus indicator with at least 3:1 contrast, every page has a distinct document
//      title, and a change of page is announced politely.
//
//   npm --prefix frontend run build && npx --prefix frontend vite preview --port 4173
//   CASE_WORKBENCH_URL=http://127.0.0.1:4173/ node scripts/check_accessibility.mjs [report.json]
//   (set CHROMIUM_EXECUTABLE_PATH to use a Chromium other than Playwright's bundled build)
//
// Automated checks find a minority of accessibility problems. Passing is a floor, not a
// substitute for testing with assistive technology.
import fs from 'node:fs/promises';
import path from 'node:path';
import axe from 'axe-core';
import { chromium } from 'playwright';

const url = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const reportPath = process.argv[2] ? path.resolve(process.argv[2]) : null;

const ROUTES = [
  'lab', 'investigate', 'case/TYN-001', 'compare', 'research', 'study', 'field', 'programme',
  'receipts', 'reference', 'evidence', 'currency', 'analysis', 'verify', 'sepolia',
  'protocol', 'runs', 'reproduce',
];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['tablet', { width: 820, height: 1180 }],
  ['mobile', { width: 390, height: 844 }],
];
const KEYBOARD_ROUTES = [
  'lab', 'investigate', 'case/TYN-001', 'compare', 'receipts', 'research', 'programme',
  'evidence', 'verify', 'study', 'reproduce', 'runs',
];
const MAX_TAB_STOPS = 70;
const MIN_FOCUS_RING_CONTRAST = 3;

const failures = [];
const fail = (message) => failures.push(message);

function describeFocus() {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const parse = (v) => {
    const m = v.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const page = parse(getComputedStyle(document.body).backgroundColor) || { r: 0, g: 0, b: 0, a: 1 };
  const ring = parse(cs.outlineColor);
  const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 && ring && ring.a > 0;
  const hasShadow = Boolean(cs.boxShadow) && cs.boxShadow !== 'none';
  const ratio = ring ? (Math.max(lum(ring), lum(page)) + 0.05) / (Math.min(lum(ring), lum(page)) + 0.05) : 0;
  return {
    tag: el.tagName.toLowerCase(),
    name: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
    hasIndicator: hasOutline || hasShadow,
    ringContrast: hasOutline ? ratio : null,
  };
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
});
const report = { url, axe: {}, keyboard: {} };

try {
  // 1. axe-core on every route and width
  for (const [vpName, viewport] of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    for (const route of ROUTES) {
      const page = await context.newPage();
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      await page.evaluate(axe.source);
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
          resultTypes: ['violations'],
        });
        return result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} :: ${n.html.slice(0, 110)}`),
          count: v.nodes.length,
        }));
      });
      const key = `${vpName}:${route}`;
      report.axe[key] = violations;
      for (const v of violations) fail(`axe ${key} [${v.impact}] ${v.id} x${v.count}: ${v.help}\n      ${v.nodes.join('\n      ')}`);
      await page.close();
    }
    await context.close();
  }

  // 2. keyboard behaviour on desktop
  const context = await browser.newContext({ viewport: VIEWPORTS[0][1] });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${url}#lab`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    return { text: a.textContent.trim(), visible: r.top >= 0 && r.bottom <= innerHeight };
  });
  if (skip.text !== 'Skip to main content') fail(`keyboard: first Tab stop should be the skip link (got "${skip.text}")`);
  if (!skip.visible) fail('keyboard: the skip link is not visible on screen when focused');
  await page.keyboard.press('Enter');
  const afterSkip = await page.evaluate(() => ({ tag: document.activeElement.tagName, hash: location.hash }));
  if (afterSkip.tag !== 'MAIN') fail(`keyboard: activating the skip link should focus <main> (got ${afterSkip.tag})`);
  if (afterSkip.hash !== '#lab') fail(`keyboard: the skip link must not change the route (hash is ${afterSkip.hash})`);

  for (const route of KEYBOARD_ROUTES) {
    await page.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    const stops = [];
    let last = null;
    let repeats = 0;
    for (let i = 0; i < MAX_TAB_STOPS; i += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(describeFocus);
      if (!focus) break;
      const id = `${focus.tag}:${focus.name}`;
      repeats = id === last ? repeats + 1 : 0;
      if (repeats > 2) break; // focus is stuck: a trap, reported below
      last = id;
      stops.push(focus);
    }
    report.keyboard[route] = { tabStops: stops.length };
    if (stops.length < 10) fail(`keyboard ${route}: only ${stops.length} tab stops were reachable`);
    const noIndicator = stops.filter((s) => !s.hasIndicator);
    if (noIndicator.length) fail(`keyboard ${route}: no focus indicator on ${noIndicator.slice(0, 4).map((s) => `${s.tag} "${s.name}"`).join('; ')}`);
    const faint = stops.filter((s) => s.ringContrast !== null && s.ringContrast < MIN_FOCUS_RING_CONTRAST);
    if (faint.length) fail(`keyboard ${route}: focus ring below ${MIN_FOCUS_RING_CONTRAST}:1 on ${faint.slice(0, 3).map((s) => `${s.name} (${s.ringContrast.toFixed(2)})`).join('; ')}`);
  }

  const titles = {};
  for (const route of ['lab', 'investigate', 'case/TYN-001', 'compare', 'receipts', 'reference', 'currency']) {
    await page.evaluate((r) => { window.location.hash = r; }, route);
    await page.waitForTimeout(400);
    titles[route] = await page.title();
  }
  report.keyboard.titles = titles;
  if (new Set(Object.values(titles)).size !== Object.keys(titles).length) fail(`titles: routes share a document title: ${JSON.stringify(titles)}`);

  await page.evaluate(() => { window.location.hash = 'compare'; });
  await page.waitForTimeout(400);
  const announced = await page.evaluate(() => document.querySelector('[role="status"].visually-hidden')?.textContent);
  if (announced !== 'Compare policies page') fail(`announcement: a change of page should be announced (got "${announced}")`);
  if (pageErrors.length) fail(`page errors: ${pageErrors.slice(0, 3).join(' | ')}`);
  await context.close();
} finally {
  await browser.close();
}

if (reportPath) await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error(`Accessibility: ${failures.length} failure(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`Accessibility: axe clean on ${ROUTES.length * VIEWPORTS.length} route/viewport combinations; keyboard checks passed`);

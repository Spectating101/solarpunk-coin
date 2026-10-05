// Visual-quality budgets for the built Policy Lab frontend.
//
// Loads each route at a desktop and a phone width in headless Chromium and fails when a
// route overflows its container, clips text, falls below the type floor, drops below
// AA contrast, has undersized targets, or renders a light native <select>.
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

const url = process.env.CASE_WORKBENCH_URL || 'http://127.0.0.1:4173/';
const reportPath = process.argv[2] ? path.resolve(process.argv[2]) : null;

const ROUTES = [
  'lab', 'investigate', 'case/TYN-001', 'compare', 'research', 'study', 'field',
  'programme', 'receipts', 'reference', 'evidence', 'currency', 'analysis', 'verify',
];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

export const BUDGETS = Object.freeze({
  documentOverflowPx: 0,
  overflowingChildren: 0,
  clippedText: 0,
  minFontPx: 12,
  charsBelowMinFontPct: 0,
  charsBelowContrastPct: 1,
  targetsBelow24px: 0,
  lightNativeSelects: 0,
  consoleErrors: 0,
});

function measurePage(minFontPx) {
  const q = (selector) => Array.from(document.querySelectorAll(selector));
  const parse = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const p = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const label = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
    return `${el.tagName.toLowerCase()}${cls}`;
  };
  const backgroundOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) layers.push(c);
      if (c && c.a >= 1) break;
    }
    const body = parse(getComputedStyle(document.body).backgroundColor);
    let base = body && body.a > 0 ? { ...body, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
    for (let i = layers.length - 1; i >= 0; i -= 1) base = over(layers[i], base);
    return base;
  };

  const out = { problems: [] };
  const de = document.documentElement;
  out.documentOverflowPx = Math.max(0, de.scrollWidth - de.clientWidth);

  let chars = 0;
  let small = 0;
  let faint = 0;
  const smallSamples = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    const el = node.parentElement;
    if (!text || !el || el.closest('script,style') || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    chars += text.length;
    if (px < minFontPx) {
      small += text.length;
      smallSamples.set(`${label(el)} ${px}px`, text.slice(0, 40));
    }
    const fg = parse(cs.color);
    if (!fg) continue;
    const bg = backgroundOf(el);
    const eff = over({ ...fg, a: fg.a * (parseFloat(cs.opacity) || 1) }, bg);
    const large = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    if (ratio(eff, bg) < (large ? 3 : 4.5)) faint += text.length;
  }
  out.charsBelowMinFontPct = +(100 * small / Math.max(chars, 1)).toFixed(2);
  out.charsBelowContrastPct = +(100 * faint / Math.max(chars, 1)).toFixed(2);
  out.smallTextSamples = [...smallSamples].slice(0, 5).map(([k, v]) => `${k} "${v}"`);

  const overflowing = [];
  for (const card of q('*')) {
    if (!visible(card)) continue;
    const cs = getComputedStyle(card);
    const boxed = ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none')
      || (parse(cs.backgroundColor)?.a ?? 0) > 0.05;
    if (!boxed || cs.overflowX !== 'visible') continue;
    const box = card.getBoundingClientRect();
    if (box.width < 120 || box.height < 40) continue;
    for (const child of card.children) {
      if (!visible(child)) continue;
      const r = child.getBoundingClientRect();
      if (r.right > box.right + 2 && r.left < box.right) {
        overflowing.push(`${label(card)} > ${label(child)} (+${Math.round(r.right - box.right)}px)`);
        break;
      }
    }
  }
  out.overflowingChildren = overflowing.length;
  out.overflowingChildrenSamples = overflowing.slice(0, 4);

  const clipped = [];
  for (const el of q('*')) {
    if (!visible(el) || el.clientWidth === 0 || el.scrollWidth <= el.clientWidth + 2) continue;
    const cs = getComputedStyle(el);
    if ((cs.textOverflow === 'ellipsis' || cs.overflowX === 'hidden' || cs.overflowX === 'clip') && (el.textContent || '').trim()) {
      clipped.push(`${label(el)} (-${el.scrollWidth - el.clientWidth}px) "${el.textContent.trim().slice(0, 30)}"`);
    }
  }
  out.clippedText = clipped.length;
  out.clippedTextSamples = clipped.slice(0, 4);

  const targets = q('a,button,[role="button"],select,input,summary').filter(visible);
  const tiny = targets.filter((t) => {
    const r = t.getBoundingClientRect();
    // Inline links inside running text are exempt from the target-size minimum (WCAG 2.2, 2.5.8).
    if (t.tagName === 'A' && getComputedStyle(t).display === 'inline') return false;
    return r.width < 24 || r.height < 24;
  });
  out.targetsBelow24px = tiny.length;
  out.targetsBelow24pxSamples = tiny.slice(0, 4).map((t) => {
    const r = t.getBoundingClientRect();
    return `${label(t)} ${Math.round(r.width)}x${Math.round(r.height)} "${(t.textContent || '').trim().slice(0, 20)}"`;
  });

  out.lightNativeSelects = q('select').filter(visible).filter((s) => {
    const bg = parse(getComputedStyle(s).backgroundColor);
    return bg && lum(bg) > 0.6;
  }).length;
  return out;
}

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
      page.on('pageerror', (error) => errors.push(error.message.slice(0, 120)));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text().slice(0, 120)); });
      await page.goto(`${url}#${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      const m = await page.evaluate(measurePage, BUDGETS.minFontPx);
      m.consoleErrors = errors.length;
      const key = `${vpName}:${route}`;
      results[key] = m;
      const check = (name, value, limit, samples = []) => {
        if (value > limit) failures.push(`${key} ${name}: ${value} (budget ${limit})${samples.length ? `\n      ${samples.join('\n      ')}` : ''}`);
      };
      check('documentOverflowPx', m.documentOverflowPx, BUDGETS.documentOverflowPx);
      check('overflowingChildren', m.overflowingChildren, BUDGETS.overflowingChildren, m.overflowingChildrenSamples);
      check('clippedText', m.clippedText, BUDGETS.clippedText, m.clippedTextSamples);
      check(`charsBelow${BUDGETS.minFontPx}px %`, m.charsBelowMinFontPct, BUDGETS.charsBelowMinFontPct, m.smallTextSamples);
      check('charsBelowContrast %', m.charsBelowContrastPct, BUDGETS.charsBelowContrastPct);
      check('targetsBelow24px', m.targetsBelow24px, BUDGETS.targetsBelow24px, m.targetsBelow24pxSamples);
      check('lightNativeSelects', m.lightNativeSelects, BUDGETS.lightNativeSelects);
      check('consoleErrors', m.consoleErrors, BUDGETS.consoleErrors);
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

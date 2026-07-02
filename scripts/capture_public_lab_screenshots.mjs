#!/usr/bin/env node
/**
 * Capture Public Lab landing screenshots for visual review (ChatGPT, advisors, etc.).
 *
 * Usage:
 *   npm run demo:screenshots
 *   DEMO_URL=http://localhost:4173/ npm run demo:screenshots
 *   node scripts/capture_public_lab_screenshots.mjs --url https://spectating101.github.io/solarpunk-coin/demo/
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const DEFAULT_URL = 'https://spectating101.github.io/solarpunk-coin/';

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 1200, label: 'Desktop 1440×1200' },
  { id: 'tablet', width: 900, height: 1200, label: 'Tablet 900×1200' },
  { id: 'mobile', width: 390, height: 1200, label: 'Mobile 390×1200' },
];

/** Desktop-only section shots for ChatGPT visual audit */
const SECTIONS = [
  { id: '01-hero', selector: '.public-lab-hook', label: 'Hero / hook' },
  { id: '02-pipeline', selector: '#pipeline-heading', label: 'Proof pipeline', scrollToParent: true },
  { id: '03-proof-today', selector: '#proof-heading', label: 'What is real today', scrollToParent: true },
  { id: '04-why-matters', selector: '#why-heading', label: 'Why this matters', scrollToParent: true },
  { id: '05-audience', selector: '#audience-heading', label: 'Who should care', scrollToParent: true },
  { id: '06-gates', selector: '#gates-heading', label: 'Launch gates', scrollToParent: true },
  { id: '07-external-ask', selector: '#external-heading', label: 'External ask', scrollToParent: true },
  { id: '08-entry-points', selector: '#entry-heading', label: 'Role entry points', scrollToParent: true },
];

const CHATGPT_PROMPT = `Review these SolarPunk Public Lab v1.0 landing screenshots as a product/design critique.

Context: research demo landing page (NOT a crypto dApp or token sale). Goal: a cold visitor understands in ~90 seconds:
- Why this matters — "fourth foundation": verified renewable surplus vs fiat / gold / Bitcoin
- What was built — Sepolia testnet lab with bounded SPK issuance and network settlement
- What proof exists — contracts, tests, payments, supply, launch gates
- What is blocked — closed pilot and mainnet intentionally blocked
- What external validation is needed — one real meter/inverter export

Judge:
1. Above-the-fold hook strength (is "fourth foundation" visually dominant?)
2. Visual hierarchy and scanability
3. CTA clarity — evidence, meter data, technical console
4. Proof pipeline + proof table readability
5. Mobile layout (390px shots)
6. Does it feel like a serious research demo vs a styled student repo?

Do NOT suggest: token sale, mainnet, wallet-first hero, hiding blocked gates, "investment" language.

Return:
- Top 5 fixes ranked by impact (specific: spacing, type size, color, section order)
- 1–10 score for advisor-ready presentation
- One paragraph: what works best visually
`;

function parseArgs(argv) {
  let url = process.env.DEMO_URL || DEFAULT_URL;
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--url' && argv[i + 1]) {
      url = argv[i + 1];
      i += 1;
    }
  }
  return { url: url.endsWith('/') ? url : `${url}/` };
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

function sourceTag(url) {
  if (/localhost|127\.0\.0\.1/.test(url)) return 'local';
  return 'live';
}

async function waitForLanding(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  try {
    await page.waitForSelector('.public-lab h1, .public-lab-hero h1, .public-lab-hook h1', {
      timeout: 60_000,
    });
  } catch {
    console.warn(`Warning: hero not found at ${url} — capturing anyway (stale deploy?)`);
  }
  await page.waitForTimeout(1200);
}

async function captureSections(page, outDir, manifest) {
  const desktop = VIEWPORTS[0];
  for (const section of SECTIONS) {
    const handle = await page.$(section.selector);
    if (!handle) {
      console.warn(`Section missing: ${section.id} (${section.selector})`);
      continue;
    }
    const target = section.scrollToParent
      ? await handle.evaluateHandle((el) => el.closest('.public-lab-section') || el.parentElement || el)
      : handle;
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const file = `desktop-section-${section.id}.png`;
    await target.screenshot({ path: path.join(outDir, file) });
    manifest.files.push({
      file,
      kind: 'section',
      section: section.label,
      viewport: desktop.id,
    });
  }
}

async function capture(url, outDir) {
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = {
    captured_at: new Date().toISOString(),
    url,
    purpose: 'ChatGPT visual audit bundle',
    viewports: VIEWPORTS.map((v) => v.id),
    files: [],
  };

  const browser = await chromium.launch({ headless: true });
  try {
    let desktopPage = null;

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await waitForLanding(page, url);

      // Viewport first (above-the-fold) — before section scroll captures move the page
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const viewportFile = `${vp.id}-viewport.png`;
      await page.screenshot({
        path: path.join(outDir, viewportFile),
        fullPage: false,
      });
      manifest.files.push({ file: viewportFile, kind: 'viewport', ...vp });

      if (vp.id === 'desktop') {
        desktopPage = page;
        await captureSections(page, outDir, manifest);
      }

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const fullFile = `${vp.id}-full.png`;
      await page.screenshot({
        path: path.join(outDir, fullFile),
        fullPage: true,
      });
      manifest.files.push({ file: fullFile, kind: 'fullPage', ...vp });

      if (vp.id !== 'desktop') {
        await context.close();
      }
    }

    if (desktopPage) {
      await desktopPage.context().close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, 'CHATGPT_PROMPT.txt'), CHATGPT_PROMPT);

  const readme = `# Public Lab screenshots — ChatGPT visual audit

Captured: ${manifest.captured_at}
URL: ${url}

## Upload to ChatGPT

1. Upload **all PNG files** in this folder, or \`public-lab-screenshots.zip\` from repo root.
2. Paste the contents of \`CHATGPT_PROMPT.txt\`.

## File guide

| Pattern | Use |
|---------|-----|
| \`desktop-viewport.png\` | First impression (1440px) |
| \`mobile-viewport.png\` | Mobile first screen |
| \`desktop-section-*.png\` | Section-by-section audit |
| \`*-full.png\` | Full scroll capture |

See \`docs/project/VISUAL_REVIEW_WORKFLOW.md\`.
`;
  fs.writeFileSync(path.join(outDir, 'README.md'), readme);

  return manifest;
}

function zipDir(outDir, zipPath) {
  const parent = path.dirname(outDir);
  const base = path.basename(outDir);
  const result = spawnSync('zip', ['-r', zipPath, base], { cwd: parent, encoding: 'utf8' });
  if (result.status !== 0) {
    console.warn('zip failed (install zip?):', result.stderr || result.stdout);
    return false;
  }
  return true;
}

async function main() {
  const { url } = parseArgs(process.argv);
  const tag = sourceTag(url);
  const outDir = path.join(REPO_ROOT, 'screenshots', 'public-lab', `${stamp()}-${tag}`);
  const latestZip = path.join(REPO_ROOT, 'screenshots', `public-lab-screenshots-${tag}.zip`);
  const chatgptZip = path.join(REPO_ROOT, 'screenshots', `chatgpt-visual-audit-${tag}.zip`);

  console.log(`Capturing Public Lab screenshots from:\n  ${url}\n→ ${outDir}\n`);

  const manifest = await capture(url, outDir);

  if (zipDir(outDir, latestZip)) {
    console.log(`Zipped: ${latestZip}`);
  }

  // Flat zip for ChatGPT (all PNGs + prompt at top level)
  const flatDir = path.join(REPO_ROOT, 'screenshots', 'chatgpt-audit-flat');
  fs.rmSync(flatDir, { recursive: true, force: true });
  fs.mkdirSync(flatDir, { recursive: true });
  fs.copyFileSync(path.join(outDir, 'CHATGPT_PROMPT.txt'), path.join(flatDir, 'CHATGPT_PROMPT.txt'));
  fs.copyFileSync(path.join(outDir, 'README.md'), path.join(flatDir, 'README.md'));
  for (const entry of manifest.files) {
    fs.copyFileSync(path.join(outDir, entry.file), path.join(flatDir, entry.file));
  }
  const flatParent = path.dirname(flatDir);
  const flatBase = path.basename(flatDir);
  const flatResult = spawnSync('zip', ['-r', chatgptZip, flatBase], { cwd: flatParent, encoding: 'utf8' });
  if (flatResult.status === 0) {
    console.log(`ChatGPT bundle: ${chatgptZip}`);
  }
  fs.rmSync(flatDir, { recursive: true, force: true });

  const symlinkZip = path.join(REPO_ROOT, 'screenshots', 'chatgpt-visual-audit.zip');
  if (flatResult.status === 0) {
    fs.copyFileSync(chatgptZip, symlinkZip);
  }

  console.log(`\nDone (${tag}). Upload screenshots/chatgpt-visual-audit-${tag}.zip to ChatGPT.`);
  console.log(`Also copied to: screenshots/chatgpt-visual-audit.zip`);
  console.log(`Paste prompt from: ${path.join(outDir, 'CHATGPT_PROMPT.txt')}`);
  console.log(`Files: ${manifest.files.length} PNGs`);
  if (manifest.files.length < 10) {
    console.warn(
      '\nWarning: expected 14 PNGs (8 sections + 6 viewport/full). Missing sections usually means stale deploy or wrong DEMO_URL.',
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

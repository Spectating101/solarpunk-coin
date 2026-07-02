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

const DEFAULT_URL = 'https://spectating101.github.io/solarpunk-coin/demo/';

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 1200, label: 'Desktop 1440×1200' },
  { id: 'tablet', width: 900, height: 1200, label: 'Tablet 900×1200' },
  { id: 'mobile', width: 390, height: 1200, label: 'Mobile 390×1200' },
];

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

async function capture(url, outDir) {
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = {
    captured_at: new Date().toISOString(),
    url,
    viewports: VIEWPORTS.map((v) => v.id),
    files: [],
  };

  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
      try {
        await page.waitForSelector('.public-lab h1, .public-lab-hero h1, .public-lab-hook h1', {
          timeout: 45_000,
        });
      } catch {
        console.warn(`Warning: hero not found at ${url} — capturing anyway (stale deploy?)`);
      }
      await page.waitForTimeout(800);

      const viewportFile = `${vp.id}-viewport.png`;
      await page.screenshot({
        path: path.join(outDir, viewportFile),
        fullPage: false,
      });
      manifest.files.push({ file: viewportFile, kind: 'viewport', ...vp });

      const fullFile = `${vp.id}-full.png`;
      await page.screenshot({
        path: path.join(outDir, fullFile),
        fullPage: true,
      });
      manifest.files.push({ file: fullFile, kind: 'fullPage', ...vp });

      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const readme = `# Public Lab screenshots

Captured: ${manifest.captured_at}
URL: ${url}

## Files

| File | Viewport |
|------|----------|
${manifest.files.map((f) => `| ${f.file} | ${f.label} (${f.kind}) |`).join('\n')}

## Share with ChatGPT

Upload \`public-lab-screenshots.zip\` from the repo root (or this folder) and ask for visual critique of hierarchy, spacing, CTA strength, and mobile layout.

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
  const outDir = path.join(REPO_ROOT, 'screenshots', 'public-lab', stamp());
  const latestZip = path.join(REPO_ROOT, 'screenshots', 'public-lab-screenshots.zip');

  console.log(`Capturing Public Lab screenshots from:\n  ${url}\n→ ${outDir}\n`);

  const manifest = await capture(url, outDir);

  if (zipDir(outDir, latestZip)) {
    console.log(`Zipped: ${latestZip}`);
  }

  console.log('\nDone. Upload screenshots/public-lab-screenshots.zip to ChatGPT for visual review.');
  console.log(`Manifest: ${path.join(outDir, 'manifest.json')}`);
  console.log(`Files: ${manifest.files.length} PNGs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

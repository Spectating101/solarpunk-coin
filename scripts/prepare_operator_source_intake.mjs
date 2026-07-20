#!/usr/bin/env node
/**
 * Build a privacy-safe source-custody receipt before normalization.
 *
 * node scripts/prepare_operator_source_intake.mjs \
 *   --source=/private/operator-export.csv \
 *   --manifest=/private/operator-source-manifest.json \
 *   --out=state/private/operator-source-receipt.json
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildOperatorSourceReceipt,
  formatOperatorSourceReceipt,
  verifyOperatorSourceReceipt,
} from '../packages/constraint-core/src/workbench.js';

function argument(name) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function usage() {
  return [
    'Usage:',
    '  node scripts/prepare_operator_source_intake.mjs',
    '    --source=/path/to/operator-export.csv',
    '    --manifest=/path/to/operator-source-manifest.json',
    '    [--out=state/private/operator-source-receipt.json]',
    '    [--generated-at=2026-07-20T00:00:00Z]',
    '',
    'The command writes the receipt only. It never copies the raw source file.',
  ].join('\n');
}

const sourcePath = argument('source');
const manifestPath = argument('manifest');
const outPath = argument('out') || 'state/private/operator-source-receipt.json';
const generatedAt = argument('generated-at') || new Date().toISOString();

if (!sourcePath || !manifestPath) {
  console.error(usage());
  process.exit(2);
}

try {
  const sourceText = await readFile(path.resolve(sourcePath), 'utf8');
  const manifestText = await readFile(path.resolve(manifestPath), 'utf8');
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    throw new Error(`Manifest is not valid JSON: ${error.message}`);
  }

  const receipt = await buildOperatorSourceReceipt({
    sourceText,
    filename: path.basename(sourcePath),
    manifest,
    generatedAt,
  });
  const verification = await verifyOperatorSourceReceipt({ receipt, sourceText, manifest });
  if (!verification.ok) {
    throw new Error(`Generated receipt failed self-verification: ${verification.checks.filter((item) => !item.ok).map((item) => item.code).join(', ')}`);
  }

  const resolvedOut = path.resolve(outPath);
  await mkdir(path.dirname(resolvedOut), { recursive: true });
  await writeFile(resolvedOut, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

  process.stdout.write(formatOperatorSourceReceipt(receipt));
  process.stdout.write(`Receipt written: ${resolvedOut}\n`);
  process.stdout.write('Raw source copied: false\n');
} catch (error) {
  console.error(`Operator source intake failed: ${error.message}`);
  process.exit(1);
}

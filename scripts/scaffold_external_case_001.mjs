#!/usr/bin/env node
import { access, copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function argument(name) {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : null;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

function usage() {
  return [
    'Usage:',
    '  node scripts/scaffold_external_case_001.mjs --out=/private/external-case-001 [--force]',
    '',
    'Creates a private intake workspace and never copies source data.',
    'The target should normally be outside the public repository.',
  ].join('\n');
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

const outArgument = argument('out');
const force = hasFlag('force');

if (!outArgument) {
  console.error(usage());
  process.exit(2);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const templateRoot = path.join(repoRoot, 'data', 'operator', 'external-case-001');
const outDir = path.resolve(outArgument);

try {
  if (await exists(outDir)) {
    const entries = await readdir(outDir);
    if (entries.length > 0 && !force) {
      throw new Error(`Target directory is not empty: ${outDir}. Use --force only after reviewing its contents.`);
    }
  }

  await mkdir(outDir, { recursive: true });
  for (const directory of ['raw', 'private', 'review', 'public']) {
    await mkdir(path.join(outDir, directory), { recursive: true });
  }

  await copyFile(
    path.join(templateRoot, 'operator_source_manifest.template.json'),
    path.join(outDir, 'operator_source_manifest.json'),
  );
  await copyFile(
    path.join(templateRoot, 'column_mapping.template.json'),
    path.join(outDir, 'column_mapping.json'),
  );
  await copyFile(
    path.join(templateRoot, 'source_holder_confirmation.template.md'),
    path.join(outDir, 'source_holder_confirmation.md'),
  );

  const gitignore = [
    '# External Case 001 private workspace',
    '# Raw and private artifacts must not enter public Git history.',
    'raw/**',
    'private/**',
    '*.csv',
    '*.tsv',
    '*.xlsx',
    '*.xls',
    '*.jsonl',
    '*.parquet',
    '*.zip',
    '*.7z',
    '*.pem',
    '*.key',
    '',
  ].join('\n');
  await writeFile(path.join(outDir, '.gitignore'), gitignore, 'utf8');

  const readme = `# External Case 001 private intake workspace\n\nThis directory is for one attributable, permissioned owner/operator source. It is not itself a public case package.\n\n## Files to complete\n\n1. \`operator_source_manifest.json\` — custody, permission, measurement semantics, device metadata, assertions, and boundaries.\n2. \`column_mapping.json\` — exact source fields, units, timestamp semantics, and conversions.\n3. \`source_holder_confirmation.md\` — relationship, permission, and factual-review record.\n4. \`raw/\` — place the original source export here. Do not rename or modify it after receipt generation.\n5. \`private/\` — generated private receipts, validation notes, and unpublishable artifacts.\n6. \`review/\` — source-holder factual review and external technical-review records.\n7. \`public/\` — only privacy-safe outputs authorized by the permission scope.\n\n## Required first run\n\nAfter replacing every \`REPLACE\` value and adding the raw source, generate the custody-first receipt from the repository root:\n\n\`\`\`bash\nnode scripts/prepare_operator_source_intake.mjs \\\n  --source=${path.join(outDir, 'raw', 'REPLACE-SOURCE-FILE.csv')} \\\n  --manifest=${path.join(outDir, 'operator_source_manifest.json')} \\\n  --out=${path.join(outDir, 'private', 'operator-source-receipt.json')}\n\`\`\`\n\nThe command writes only the receipt. It does not copy raw rows.\n\n## Assurance boundary\n\n- The source begins at \`PROVENANCE-L0-BASE\`.\n- Manifest assertions cannot promote assurance.\n- Parsing, hashing, and permission do not certify physical source truth.\n- L2/L4 may be explored only as explicitly labeled counterfactual contexts until independent artifacts are verified.\n- A blocked open, pilot, or strict policy result is acceptable.\n\n## Publication boundary\n\nPublish only what \`permission_scope\` authorizes. Keep raw rows private unless the source holder explicitly selected \`public_raw\`.\n`;
  await writeFile(path.join(outDir, 'README.md'), readme, 'utf8');

  await writeFile(
    path.join(outDir, 'raw', 'README.md'),
    '# Raw source\n\nPlace the original owner/operator export here. Do not commit this directory. Preserve the exact bytes used to generate the intake receipt.\n',
    'utf8',
  );
  await writeFile(
    path.join(outDir, 'private', 'README.md'),
    '# Private artifacts\n\nStore receipts, unredacted identity records, signatures, registry evidence, API snapshots, and private diagnostics here.\n',
    'utf8',
  );
  await writeFile(
    path.join(outDir, 'review', 'README.md'),
    '# Review records\n\nStore source-holder factual review and independent technical-review records here. Review cannot alter deterministic results.\n',
    'utf8',
  );
  await writeFile(
    path.join(outDir, 'public', 'README.md'),
    '# Public outputs\n\nPlace only permission-authorized privacy-safe metadata, aggregates, decision artifacts, receipts, and capsules here.\n',
    'utf8',
  );

  process.stdout.write(`External Case 001 workspace created: ${outDir}\n`);
  process.stdout.write('Raw source copied: false\n');
  process.stdout.write('Default assurance: PROVENANCE-L0-BASE\n');
  process.stdout.write('Next: complete the three intake records, add one original source file under raw/, and generate the V2 receipt.\n');
} catch (error) {
  console.error(`External Case 001 scaffold failed: ${error.message}`);
  process.exit(1);
}

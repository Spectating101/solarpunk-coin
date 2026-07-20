#!/usr/bin/env node
/**
 * CLI: verify a Policy Lab research capsule bundle.
 *
 *   node scripts/verify_research_capsule.mjs path/to/capsule-bundle.json
 *   node scripts/verify_research_capsule.mjs path/to/capsule-bundle.json --replay-from-pack
 *
 * Exit 0 on PASS. Source truth is never certified.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatCapsuleVerificationReport,
  verifyResearchCapsuleBundle,
} from '../packages/constraint-core/src/workbench.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2).filter((argument) => argument !== '--');
const supportedFlags = new Set(['--replay-from-pack']);
const unknownFlags = args.filter((argument) => argument.startsWith('--') && !supportedFlags.has(argument));
const replay = args.includes('--replay-from-pack');
const target = args.find((argument) => !argument.startsWith('--'));

function usage() {
  return 'Usage: node scripts/verify_research_capsule.mjs <capsule-bundle.json> [--replay-from-pack]';
}

if (!target || unknownFlags.length) {
  if (unknownFlags.length) console.error(`Unknown option(s): ${unknownFlags.join(', ')}`);
  console.error(usage());
  process.exit(2);
}

async function loadPackReplay() {
  const packRoot = path.join(ROOT, 'protocol/cases/energy-v1');
  const pack = JSON.parse(await readFile(path.join(packRoot, 'case-pack.json'), 'utf8'));
  const read = async (relativePath) => JSON.parse(await readFile(path.join(packRoot, relativePath), 'utf8'));
  const cases = await Promise.all(pack.case_files.map(read));
  const evidence = await Promise.all(pack.evidence_files.map(read));
  const contexts = await Promise.all(pack.context_files.map(read));
  const scenarios = await Promise.all(pack.provenance_scenario_files.map(read));
  return {
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contextsById: Object.fromEntries(contexts.map((item) => [item.context_id, item])),
    scenariosById: Object.fromEntries(scenarios.map((item) => [item.scenario_id, item])),
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
  };
}

try {
  const raw = await readFile(path.resolve(target), 'utf8');
  let bundle;
  try {
    bundle = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Input is not valid JSON: ${error.message}`);
  }

  const options = replay ? { packReplay: await loadPackReplay() } : {};
  const result = await verifyResearchCapsuleBundle(bundle, options);
  process.stdout.write(formatCapsuleVerificationReport(result));
  process.exit(result.ok ? 0 : 1);
} catch (error) {
  console.error(`Capsule verification could not run: ${error.message}`);
  process.exit(2);
}

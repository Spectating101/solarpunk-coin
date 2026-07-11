import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildEvidenceEnvelope,
  normalizeCumulativePair,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));

test('presentation metadata does not change portable evidence identity', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const normalized = normalizeCumulativePair(start, end);

  const first = await buildEvidenceEnvelope(normalized, {
    source_label: 'reviewer demo',
    browser_local: true,
  });
  const second = await buildEvidenceEnvelope(normalized, {
    source_label: 'deploy smoke',
    browser_local: false,
  });

  assert.equal(first.evidence_hash, second.evidence_hash);
  assert.notDeepEqual(first.meta, second.meta);
  assert.deepEqual(first.diagnostics, normalized.diagnostics);
});

test('semantic evidence changes create a different evidence identity', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const first = await buildEvidenceEnvelope(normalizeCumulativePair(start, end));
  const changedEnd = structuredClone(end);
  changedEnd.counters.export_kwh_total += 1;
  changedEnd.counters.site_load_kwh_total -= 1;
  const second = await buildEvidenceEnvelope(normalizeCumulativePair(start, changedEnd));

  assert.notEqual(first.evidence_hash, second.evidence_hash);
});

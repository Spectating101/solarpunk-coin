#!/usr/bin/env node
/**
 * Gate 1 helper: normalize the checked-in operator-format CSV into a V2
 * EvidenceEnvelope + CaseManifest and write them into the energy case pack.
 *
 * Boundary: uses data/operator/sample_operator_export.csv — an operator-shaped
 * public-lab sample, not a named closed-pilot custody archive. Capabilities stay
 * unsigned / browser-local. Do not set signed or trusted_operator flags here.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildEvidenceEnvelope,
  hashCaseManifest,
  normalizeGenericCsv,
  verifyEvidenceEnvelopeHash,
} from '../packages/constraint-core/src/workbench.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSV_PATH = path.join(ROOT, 'data/operator/sample_operator_export.csv');
const EVIDENCE_PATH = path.join(ROOT, 'protocol/cases/energy-v1/evidence/ops-sample-evidence.json');
const CASE_PATH = path.join(ROOT, 'protocol/cases/energy-v1/cases/OPS-001.json');

const csvText = await readFile(CSV_PATH, 'utf8');
const normalized = normalizeGenericCsv(csvText);

normalized.source = {
  ...normalized.source,
  case_id: 'OPS-001',
  operator_format_sample: true,
  sample_fixture: false,
  custody: 'unchecked_public_lab_operator_csv_shape',
  signature_semantics: 'unsigned_generic_interval_csv',
};

normalized.capabilities = {
  ...normalized.capabilities,
  signed: false,
  cryptographically_verified: false,
  signature_verification: false,
  external_corroboration: false,
  browser_local: true,
  operator_signed: false,
};

normalized.diagnostics = [
  ...(normalized.diagnostics || []),
  {
    code: 'operator_format_sample',
    status: 'WARNING',
    detail: 'Operator-shaped CSV normalized through generic-interval-csv. Not signed, not mint authority, not a named closed-pilot custody archive.',
  },
];

normalized.summary = {
  ...normalized.summary,
  warning_count: normalized.diagnostics.filter((item) => item.status === 'WARNING').length,
  blocker_count: normalized.diagnostics.filter((item) => item.status === 'BLOCK').length,
};

const envelope = await buildEvidenceEnvelope(normalized, {
  source_label: 'OPS-001 operator-format CSV sample (public-lab fixture shape)',
  browser_local: true,
});

await verifyEvidenceEnvelopeHash(envelope);

const caseManifest = {
  schema: 'solarpunk.constraint.case_manifest.v1',
  case_id: 'OPS-001',
  subject: 'Operator-format CSV evidence pilot (Gate 1)',
  case_type: 'energy_site',
  spatial_identity: {
    site_id: 'ops_sample_site',
    latitude: 24.99,
    longitude: 121.3,
    spatial_reference: 'WGS84',
  },
  measurement_window: {
    start: '2026-05-01T00:00:00Z',
    end: '2026-05-08T00:00:00Z',
  },
  evidence_refs: [envelope.evidence_hash],
  context_refs: ['resource:tyn-001:pvwatts-v1'],
  default_policy_ref: {
    id: 'ENERGY-CASE-PILOT-005',
    version: '1.0.0',
  },
  boundaries: [
    'Operator-format CSV sample from data/operator/sample_operator_export.csv — public-lab shape, not a named closed-pilot archive.',
    'Evidence is unsigned generic-interval-csv; capabilities.signed is false; not mint authority.',
    'Reuses the TYN modeled PVWatts resource context for window alignment only; that context is TMY, not observed generation.',
    'A BLOCKED pilot-policy result is an expected and scientifically useful Gate 1 outcome.',
  ],
};

const caseHash = await hashCaseManifest(caseManifest);

await mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
await writeFile(EVIDENCE_PATH, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
await writeFile(CASE_PATH, `${JSON.stringify(caseManifest, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  ok: true,
  csv: path.relative(ROOT, CSV_PATH),
  evidence_path: path.relative(ROOT, EVIDENCE_PATH),
  case_path: path.relative(ROOT, CASE_PATH),
  evidence_hash: envelope.evidence_hash,
  case_manifest_hash: caseHash,
  adapter: envelope.adapter,
  capabilities: envelope.capabilities,
  summary: envelope.summary,
  diagnostics: envelope.diagnostics.map((d) => ({ code: d.code, status: d.status })),
}, null, 2));

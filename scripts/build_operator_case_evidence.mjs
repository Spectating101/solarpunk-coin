#!/usr/bin/env node
/**
 * Gate 1A helper: normalize the checked-in operator-format CSV into a V2
 * EvidenceEnvelope + CaseManifest and write them into the energy case pack.
 *
 * Boundary: uses data/operator/sample_operator_export.csv — a synthetic,
 * operator-shaped public-lab fixture, not a named operator custody archive.
 * Capabilities stay unsigned / browser-local. Do not set signed or trusted
 * operator flags here.
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
  sample_fixture: true,
  custody: 'synthetic_public_lab_operator_csv_fixture',
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
    detail: 'Synthetic operator-shaped CSV normalized through generic-interval-csv. Not signed, not source-truth evidence, not mint authority, and not a named operator custody archive.',
  },
];

normalized.summary = {
  ...normalized.summary,
  warning_count: normalized.diagnostics.filter((item) => item.status === 'WARNING').length,
  blocker_count: normalized.diagnostics.filter((item) => item.status === 'BLOCK').length,
};

const envelope = await buildEvidenceEnvelope(normalized, {
  source_label: 'OPS-001 synthetic operator-format CSV fixture',
  browser_local: true,
});

await verifyEvidenceEnvelopeHash(envelope);

const caseManifest = {
  schema: 'solarpunk.constraint.case_manifest.v1',
  case_id: 'OPS-001',
  subject: 'Operator-format CSV pipeline pilot (Gate 1A)',
  case_type: 'energy_site',
  spatial_identity: null,
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
    'Synthetic operator-format CSV fixture from data/operator/sample_operator_export.csv; not a named operator archive or observed field dataset.',
    'No physical site location is asserted for this synthetic fixture.',
    'Evidence is unsigned generic-interval-csv; capabilities.signed is false; not source-truth certification or mint authority.',
    'Reuses the TYN modeled PVWatts resource context for calculation-path testing only; that context is TMY, not observed generation for OPS-001.',
    'A BLOCKED pilot-policy result is an expected and scientifically useful Gate 1A pipeline outcome.',
  ],
};

const caseHash = await hashCaseManifest(caseManifest);

await mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
await writeFile(EVIDENCE_PATH, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
await writeFile(CASE_PATH, `${JSON.stringify(caseManifest, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  ok: true,
  gate: '1A_OPERATOR_FORMAT_PIPELINE',
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
#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDecisionReceipt,
  buildEvidenceEnvelope,
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlement,
  makeIssuedClaim,
  normalizeGenericCsv,
  verifyEvidenceEnvelopeHash,
  verifyResearchCapsuleBundle,
} from '../packages/constraint-core/src/workbench.js';
import { buildContextManifest } from '../packages/constraint-core/src/context.js';
import { hashCaseManifest } from '../packages/constraint-core/src/case.js';
import { parseCsv } from '../packages/constraint-core/src/csv.js';
import { buildResearchCapsule } from '../frontend/src/lib/researchCapsule.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CASE_ID = 'PUB-AUSGRID-001P';
const SOURCE_REVISION = process.env.GITHUB_SHA || process.env.VITE_SOURCE_REVISION || 'local-public-case';
const EXPECTED_ARCHIVE_SHA256 = '6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11';
const EXPECTED_ARCHIVE_BYTES = 14973763;
const BUNDLE_SCHEMA = 'solarpunk.constraint.research_capsule_bundle.v1';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function trimToAusgridHeader(csvText) {
  const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const index = lines.findIndex((line) => line.startsWith('Customer,Generator Capacity,Postcode,Consumption Category,date'));
  if (index < 0) throw new Error('Ausgrid source header not found');
  return lines.slice(index).join('\n');
}

function parseAusgridDate(value) {
  const text = String(value).trim();
  let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  match = text.match(/^(\d{1,2})([A-Za-z]{3})(\d{2,4})$/);
  if (match) {
    const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    const [, day, monRaw, yearRaw] = match;
    const month = months[monRaw.toLowerCase()];
    if (!month) throw new Error(`unsupported Ausgrid month: ${monRaw}`);
    const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }
  throw new Error(`unsupported Ausgrid date: ${value}`);
}

function addUtcDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function sydneyWinterInterval(date, timeLabel) {
  const [hourRaw, minuteRaw] = String(timeLabel).split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) throw new Error(`bad interval label ${timeLabel}`);
  const endDate = hour === 0 && minute === 0 ? addUtcDays(date, 1) : date;
  const localEnd = `${endDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+10:00`;
  const end = new Date(localEnd);
  if (!Number.isFinite(end.getTime())) throw new Error(`bad local timestamp ${localEnd}`);
  const start = new Date(end.getTime() - 30 * 60 * 1000);
  return { window_start: start.toISOString(), window_end: end.toISOString() };
}

async function sha256File(filePath) {
  const bytes = await readFile(filePath);
  return createHash('sha256').update(bytes).digest('hex');
}

function selectActualGenerationRows(rows, customer, days) {
  const candidates = rows
    .filter((row) => String(row.Customer).trim() === String(customer))
    .filter((row) => String(row['Consumption Category']).trim() === 'GG')
    .map((row) => ({ row, date: parseAusgridDate(row.date) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const actual = candidates.filter(({ row }) => String(row['Row Quality'] ?? '').trim() === '');
  if (actual.length < days) throw new Error(`requested ${days} actual GG days but only ${actual.length} are available`);
  return actual.slice(0, days);
}

function buildHalfHourGenericCsv(selected, allRows, timeColumns, customer) {
  const header = ['window_start', 'window_end', 'generation_kwh', 'site_load_kwh', 'export_kwh', 'meter_id', 'site_id', 'quality_score'];
  const lines = [header.join(',')];
  const sourceRows = [];
  for (const { row: gg, date } of selected) {
    const matching = allRows.filter((candidate) => (
      String(candidate.Customer).trim() === String(customer)
      && parseAusgridDate(candidate.date) === date
    ));
    const gc = matching.find((candidate) => String(candidate['Consumption Category']).trim() === 'GC');
    const cl = matching.find((candidate) => String(candidate['Consumption Category']).trim() === 'CL');
    if (!gc) throw new Error(`customer ${customer} has no GC row for ${date}`);
    if (String(gc['Row Quality'] ?? '').trim() !== '') throw new Error(`GC row is non-actual for ${date}`);
    if (cl && String(cl['Row Quality'] ?? '').trim() !== '') throw new Error(`CL row is non-actual for ${date}`);

    for (const label of timeColumns) {
      const generation = Number(gg[label]);
      const generalLoad = Number(gc[label]);
      const controlledLoad = cl ? Number(cl[label]) : 0;
      if (![generation, generalLoad, controlledLoad].every((value) => Number.isFinite(value) && value >= 0)) {
        throw new Error(`invalid non-negative kWh value for ${date} ${label}`);
      }
      const siteLoad = generalLoad + controlledLoad;
      const derivedExport = Math.max(generation - siteLoad, 0);
      const interval = sydneyWinterInterval(date, label);
      const record = {
        ...interval,
        generation_kwh: generation,
        site_load_kwh: siteLoad,
        export_kwh: derivedExport,
        meter_id: `AUSGRID-DEID-${customer}`,
        site_id: `AUSGRID-POSTCODE-${String(gg.Postcode).trim()}`,
        quality_score: 1,
      };
      sourceRows.push({
        date,
        interval_end_label: label,
        gg_kwh: generation,
        gc_kwh: generalLoad,
        cl_kwh: controlledLoad,
        derived_surplus_kwh: derivedExport,
      });
      lines.push(header.map((key) => csvEscape(record[key])).join(','));
    }
  }
  return { csv: `${lines.join('\n')}\n`, sourceRows };
}

function portableBundle(capsule) {
  return {
    schema: BUNDLE_SCHEMA,
    manifest: capsule.manifest,
    files: capsule.files,
    boundary: 'Portable JSON bundle for public-source case verification. It is not a legal certificate and does not certify source truth.',
  };
}

async function main() {
  const csvArg = arg('csv');
  const archiveArg = arg('archive');
  if (!csvArg || !archiveArg) throw new Error('--csv and --archive are required');
  const csvPath = path.resolve(csvArg);
  const archivePath = path.resolve(archiveArg);
  const outDir = path.resolve(arg('out', 'state/external/public-001p-ausgrid'));
  const customer = arg('customer', '1');
  const days = Number(arg('days', '7'));
  if (!Number.isInteger(days) || days < 1 || days > 31) throw new Error('--days must be an integer from 1 to 31');

  const archiveSha256 = await sha256File(archivePath);
  const archiveBytes = (await stat(archivePath)).size;
  if (archiveSha256 !== EXPECTED_ARCHIVE_SHA256) throw new Error(`mirror archive SHA-256 mismatch: ${archiveSha256}`);
  if (archiveBytes !== EXPECTED_ARCHIVE_BYTES) throw new Error(`mirror archive byte-length mismatch: ${archiveBytes}`);

  const rawCsv = await readFile(csvPath, 'utf8');
  const { rows } = parseCsv(trimToAusgridHeader(rawCsv));
  const timeColumns = Object.keys(rows[0] || {}).filter((key) => /^\d{1,2}:\d{2}$/.test(key));
  if (timeColumns.length !== 48) throw new Error(`expected 48 half-hour columns, received ${timeColumns.length}`);

  const selected = selectActualGenerationRows(rows, customer, days);
  const { csv: normalizedCsv, sourceRows } = buildHalfHourGenericCsv(selected, rows, timeColumns, customer);
  const normalized = normalizeGenericCsv(normalizedCsv, {
    timestamp: 'window_start',
    window_end: 'window_end',
    generation_kwh: 'generation_kwh',
    site_load_kwh: 'site_load_kwh',
    export_kwh: 'export_kwh',
    meter_id: 'meter_id',
    site_id: 'site_id',
    quality_score: 'quality_score',
  });

  normalized.source = {
    kind: 'public_historical_dataset_mirror',
    publisher: 'Ausgrid',
    dataset: 'Solar Home Electricity Data',
    mirror_host: 'Hugging Face / SolarSys2026/EnergyTrading',
    mirror_commit: 'ddb96f511059a410bfb3ea61c32e7def0d9c88f0',
    mirror_archive_sha256: archiveSha256,
    mirror_archive_bytes: archiveBytes,
    source_holder_confirmed: false,
    synthetic_fixture: false,
    local_only: false,
  };
  normalized.capabilities = {
    ...normalized.capabilities,
    signed: false,
    operator_signed: false,
    cryptographically_verified: false,
    external_corroboration: false,
  };
  normalized.diagnostics = [
    ...(normalized.diagnostics || []),
    {
      code: 'public_mirror_custody',
      status: 'WARNING',
      detail: 'Exact mirror bytes are frozen and hashed, but identity with the historical Ausgrid-hosted archive has not been independently proven. This is public-source L0 evidence, not source-holder custody.',
    },
    {
      code: 'derived_surplus_not_metered_export',
      status: 'WARNING',
      detail: 'GG is observed gross solar generation; GC and CL are observed consumption channels. export_kwh is conservatively derived per half-hour as max(GG - (GC + CL), 0) and is not a directly measured export channel.',
    },
    {
      code: 'actual_rows_only',
      status: 'PASS',
      detail: 'The bounded window uses rows whose Row Quality field is blank, which the Ausgrid dataset notes define as actual half-hour meter values rather than estimated/substituted rows.',
    },
  ];
  normalized.summary = {
    ...normalized.summary,
    blocker_count: normalized.diagnostics.filter((item) => item.status === 'BLOCK').length,
    warning_count: normalized.diagnostics.filter((item) => item.status === 'WARNING').length,
  };

  const evidence = await buildEvidenceEnvelope(normalized, {
    source_label: `Ausgrid public historical mirror, de-identified customer ${customer}, ${days} actual days`,
    public_source: true,
    source_owner_confirmed: false,
  });
  await verifyEvidenceEnvelopeHash(evidence);

  const generatorCapacityKw = Number(selected[0].row['Generator Capacity']);
  if (!Number.isFinite(generatorCapacityKw) || generatorCapacityKw <= 0) throw new Error('generator capacity missing');
  const context = await buildContextManifest({
    schema: 'solarpunk.constraint.context_manifest.v1',
    context_id: `resource:ausgrid-deid-${customer}:nameplate-upper-bound-v1`,
    context_type: 'resource_model',
    label: 'Ausgrid customer nameplate physical upper bound',
    source: {
      provider: 'Policy Lab declared calculation',
      source_kind: 'nameplate_physical_upper_bound',
      input: 'Ausgrid Generator Capacity field',
      formula: 'generator_capacity_kw * 24 * 365',
    },
    spatial_identity: null,
    temporal_semantics: {
      kind: 'PHYSICAL_UPPER_BOUND',
      observed_case_window: false,
      expected_generation_model: false,
    },
    values: {
      annual_ac_kwh: generatorCapacityKw * 24 * 365,
      system_capacity_kw: generatorCapacityKw,
    },
    boundary: 'Transparent non-predictive nameplate upper bound supplied only because the open research policy requires a resource-model ceiling. It is not expected generation, observed production, or independent corroboration.',
  });

  const caseManifest = {
    schema: 'solarpunk.constraint.case_manifest.v1',
    case_id: CASE_ID,
    subject: 'Ausgrid public-source L0 operability case',
    case_type: 'energy_site',
    spatial_identity: null,
    measurement_window: {
      start: evidence.intervals[0].window_start,
      end: evidence.intervals[evidence.intervals.length - 1].window_end,
    },
    evidence_refs: [evidence.evidence_hash],
    context_refs: [context.context_id],
    default_policy_ref: { id: 'ENERGY-CASE-PILOT-005', version: '1.0.0' },
    boundaries: [
      'Public historical de-identified Ausgrid dataset; no source-holder interaction was performed.',
      'Exact Hugging Face mirror archive bytes are frozen; equivalence to the historical Ausgrid-hosted archive is not independently established.',
      'GG/GC/CL are half-hour kWh channels. Derived surplus is max(GG - (GC + CL), 0) per interval and is not directly metered grid export.',
      'Evidence remains L0, unsigned, uncorroborated, and does not establish meter certification, operator identity, legal claim authority, or R4.',
      'This public-source case does not close the original human source-holder Gate 1B requirements in issue #14/#26.',
    ],
  };
  await hashCaseManifest(caseManifest);

  const scenario = {
    schema: 'solarpunk.constraint.provenance_scenario.v1',
    scenario_id: 'PUBLIC-SOURCE-L0',
    name: 'Public historical source at actual L0',
    kind: 'BASE_ASSURANCE_CONTEXT',
    provenance_context: {
      real_operator_source: false,
      trusted_operator_context: false,
      signed: false,
      operator_signed: false,
      cryptographically_verified: false,
      revenue_grade: false,
      external_corroboration: false,
    },
    observed_evidence_changed: false,
    boundary: 'Public publication and mirror byte identity do not promote source assurance beyond L0.',
  };
  const provenance = classifyProvenance(evidence, scenario.provenance_context);
  if (provenance.level !== 'L0') throw new Error(`expected L0 provenance, received ${provenance.level}`);

  const evidenceByHash = { [evidence.evidence_hash]: evidence };
  const contextsById = { [context.context_id]: context };
  const decide = async (policyId) => {
    const policy = casePolicyById(policyId);
    const decision = await evaluateCaseDecision({ caseManifest, evidenceByHash, contextsById, provenance, policy });
    return { policy, decision };
  };
  const pilot = await decide('ENERGY-CASE-PILOT-005');
  const open = await decide('LAB-CASE-OPEN-004');

  let settlement = null;
  let receipt = null;
  let capsule = null;
  let capsuleVerification = null;
  if (open.decision.decision === 'ADMIT_WITH_LIMIT') {
    const claim = await createDecisionClaimManifest({ decision: open.decision, subject: `${CASE_ID} bounded research claim` });
    const issuedClaim = makeIssuedClaim(claim);
    const settlementCapacity = Number((open.decision.capacity.admitted_maximum * 0.4).toFixed(6));
    settlement = evaluateSettlement({ claim: issuedClaim, settlement_capacity: settlementCapacity });
    receipt = buildDecisionReceipt({
      decision: open.decision,
      runtime: {
        package: '@solarpunk/constraint-core',
        package_version: '0.1.0-alpha.1',
        source_revision: SOURCE_REVISION,
      },
      data_boundary: 'Public-source case. Raw half-hour rows are excluded from the receipt/capsule; exact mirror archive identity and bounded aggregate metadata are reported separately.',
      raw_evidence_included: false,
    });
    const run = {
      caseManifest,
      evidence,
      contexts: [context],
      policy: open.policy,
      scenario,
      provenance,
      decision: open.decision,
      receipt,
    };
    const builtCapsule = await buildResearchCapsule(run, receipt);
    capsule = portableBundle(builtCapsule);
    capsuleVerification = await verifyResearchCapsuleBundle(capsule, {
      packReplay: {
        casesById: { [CASE_ID]: caseManifest },
        evidenceByHash,
        contextsById,
        scenariosById: { [scenario.scenario_id]: scenario },
      },
    });
  }

  const report = {
    schema: 'solarpunk.public_external_case_001p.v1',
    generated_at: new Date().toISOString(),
    implementation_revision: SOURCE_REVISION,
    case_id: CASE_ID,
    status: {
      public_source_operability_tested: true,
      public_case_closes_original_gate1b: false,
      human_source_holder_review: 'NOT_PERFORMED',
      actual_assurance: provenance.level,
      source_truth_certification: 'NOT_CLAIMED',
    },
    source: {
      publisher: 'Ausgrid',
      dataset: 'Solar Home Electricity Data',
      official_catalog: 'https://data.gov.au/data/dataset/nsw-solar-home-electricty-data',
      source_notes_semantics: '48 half-hour kWh columns; GG gross generation; GC general consumption; CL controlled load; blank Row Quality means actual values.',
      mirror: 'SolarSys2026/EnergyTrading',
      mirror_commit: 'ddb96f511059a410bfb3ea61c32e7def0d9c88f0',
      archive_sha256: archiveSha256,
      archive_bytes: archiveBytes,
      selected_customer: String(customer),
      postcode: String(selected[0].row.Postcode),
      generator_capacity_kw: generatorCapacityKw,
      selected_dates: selected.map((item) => item.date),
      interval_count: evidence.summary.interval_count,
      timezone_basis: 'Australia/Sydney winter standard time (+10:00) for selected July dates',
    },
    transformations: {
      source_values: ['GG kWh', 'GC kWh', 'CL kWh'],
      derived_field: 'export_kwh = max(GG - (GC + CL), 0) per half-hour',
      manual_transformations: [
        'reshape 48 half-hour columns to interval rows',
        'combine GC + CL as site_load_kwh',
        'derive conservative interval surplus',
      ],
      unresolved: [
        'mirror bytes not independently matched to historical Ausgrid-hosted bytes',
        'no source-holder confirmation',
        'derived surplus is not directly metered grid export',
      ],
    },
    evidence: {
      evidence_hash: evidence.evidence_hash,
      adapter: evidence.adapter,
      total_eligible_surplus_kwh: evidence.summary.total_eligible_surplus_kwh,
      blocker_count: evidence.summary.blocker_count,
      warning_count: evidence.summary.warning_count,
    },
    provenance,
    decisions: {
      pilot: {
        policy_id: pilot.policy.id,
        result: pilot.decision.decision,
        decision_id: pilot.decision.decision_id,
        blocking_rules: pilot.decision.admission.blocking_rules,
      },
      open: {
        policy_id: open.policy.id,
        result: open.decision.decision,
        decision_id: open.decision.decision_id,
        admitted_maximum: open.decision.capacity.admitted_maximum,
        binding_constraints: open.decision.capacity.binding_constraints,
      },
    },
    settlement: settlement ? {
      scenario_only: true,
      result: settlement.result,
      covered_quantity: settlement.covered_quantity,
      shortfall_quantity: settlement.shortfall_quantity,
    } : null,
    capsule: capsule ? {
      capsule_id: capsule.manifest.capsule_id,
      raw_evidence_included: capsule.manifest.raw_evidence_included,
      verification_ok: capsuleVerification.ok,
      integrity: capsuleVerification.summary.capsule_integrity,
      schema_validation: capsuleVerification.summary.schema_validation,
      decision_reproduction: capsuleVerification.summary.decision_reproduction,
    } : null,
    boundaries: caseManifest.boundaries,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'report.json'), jsonText(report));
  await writeFile(path.join(outDir, 'evidence-envelope.json'), jsonText(evidence));
  await writeFile(path.join(outDir, 'case.json'), jsonText(caseManifest));
  await writeFile(path.join(outDir, 'context.json'), jsonText(context));
  await writeFile(path.join(outDir, 'pilot-decision.json'), jsonText(pilot.decision));
  await writeFile(path.join(outDir, 'open-decision.json'), jsonText(open.decision));
  await writeFile(path.join(outDir, 'bounded-source-derivation.json'), jsonText({ rows: sourceRows }));
  if (settlement) await writeFile(path.join(outDir, 'settlement-result.json'), jsonText(settlement));
  if (receipt) await writeFile(path.join(outDir, 'decision-receipt.json'), jsonText(receipt));
  if (capsule) await writeFile(path.join(outDir, 'research-capsule-bundle.json'), jsonText(capsule));
  if (capsuleVerification) await writeFile(path.join(outDir, 'capsule-verification.json'), jsonText(capsuleVerification));

  const ok = (
    provenance.level === 'L0'
    && pilot.decision.decision === 'BLOCKED'
    && open.decision.decision === 'ADMIT_WITH_LIMIT'
    && capsuleVerification?.ok === true
    && capsuleVerification?.summary?.decision_reproduction === 'PASS'
  );
  console.log(jsonText({ ok, out_dir: path.relative(ROOT, outDir), report }));
  if (!ok) process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});

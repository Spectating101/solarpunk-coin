import { autoMapColumns, parseCsv, pickAlias } from './csv.js';
import {
  canonicalTimestamp,
  numeric,
  optionalNumeric,
  round,
  sha256Hex,
  stableStringify,
  sum,
  unixSeconds,
} from './stable.js';

function diagnostic(code, status, detail, extra = {}) {
  return { code, status, detail, ...extra };
}

export function deriveEligibleSurplus({ generation_kwh, site_load_kwh, export_kwh, curtailed_kwh = 0 }) {
  const generation = optionalNumeric(generation_kwh);
  const load = optionalNumeric(site_load_kwh);
  const exported = optionalNumeric(export_kwh);
  const curtailed = optionalNumeric(curtailed_kwh) ?? 0;

  if (exported != null && generation != null && load != null) {
    return {
      eligible_surplus_kwh: round(Math.max(0, Math.min(exported + curtailed, generation - load))),
      surplus_basis: 'export_plus_curtailed_capped_by_generation_minus_load',
      surplus_basis_ok: true,
    };
  }
  if (exported != null) {
    return {
      eligible_surplus_kwh: round(Math.max(0, exported + curtailed)),
      surplus_basis: curtailed > 0 ? 'export_plus_curtailed' : 'export_only',
      surplus_basis_ok: true,
    };
  }
  if (generation != null && load != null) {
    return {
      eligible_surplus_kwh: round(Math.max(0, generation - load)),
      surplus_basis: 'generation_minus_load',
      surplus_basis_ok: true,
    };
  }
  return {
    eligible_surplus_kwh: 0,
    surplus_basis: 'insufficient_surplus_basis',
    surplus_basis_ok: false,
  };
}

function canonicalInterval(input, meta = {}) {
  const windowStart = canonicalTimestamp(input.window_start ?? input.timestamp, 'window_start');
  const windowEnd = input.window_end
    ? canonicalTimestamp(input.window_end, 'window_end')
    : windowStart;
  const generation = optionalNumeric(input.generation_kwh);
  const load = optionalNumeric(input.site_load_kwh);
  const exported = optionalNumeric(input.export_kwh);
  const curtailed = optionalNumeric(input.curtailed_kwh) ?? 0;
  const quality = optionalNumeric(input.quality_score);

  for (const [field, value] of [
    ['generation_kwh', generation],
    ['site_load_kwh', load],
    ['export_kwh', exported],
    ['curtailed_kwh', curtailed],
  ]) {
    if (value != null && value < 0) throw new Error(`${field} cannot be negative`);
  }
  if (quality != null && (quality < 0 || quality > 1)) throw new Error('quality_score must be between 0 and 1');
  if (windowEnd !== windowStart && unixSeconds(windowStart) >= unixSeconds(windowEnd)) {
    throw new Error('window_end must be after window_start');
  }

  const surplus = deriveEligibleSurplus({
    generation_kwh: generation,
    site_load_kwh: load,
    export_kwh: exported,
    curtailed_kwh: curtailed,
  });

  return {
    meter_id: input.meter_id ? String(input.meter_id) : null,
    site_id: input.site_id ? String(input.site_id) : null,
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: generation,
    site_load_kwh: load,
    export_kwh: exported,
    curtailed_kwh: round(curtailed),
    cumulative_kwh: optionalNumeric(input.cumulative_kwh),
    quality_score: quality,
    source: String(input.source || meta.source || 'unknown'),
    source_kind: String(meta.source_kind || 'generic'),
    ...surplus,
  };
}

function detectDuplicateWindows(intervals) {
  const seen = new Set();
  const duplicates = [];
  intervals.forEach((row, index) => {
    const key = `${row.meter_id || '__default__'}|${row.window_start}|${row.window_end}`;
    if (seen.has(key)) duplicates.push(index);
    seen.add(key);
  });
  return duplicates;
}

function detectCounterRegression(intervals) {
  const byMeter = new Map();
  for (const row of intervals) {
    if (row.cumulative_kwh == null) continue;
    const key = row.meter_id || '__default__';
    if (!byMeter.has(key)) byMeter.set(key, []);
    byMeter.get(key).push(row);
  }
  const regressions = [];
  for (const [meterId, rows] of byMeter) {
    const sorted = [...rows].sort((a, b) => Date.parse(a.window_start) - Date.parse(b.window_start));
    let previous = null;
    for (const row of sorted) {
      if (previous != null && row.cumulative_kwh < previous) {
        regressions.push({ meter_id: meterId === '__default__' ? null : meterId, window_start: row.window_start });
      }
      previous = row.cumulative_kwh;
    }
  }
  return regressions;
}

function finalizeAdapter({ adapter_id, adapter_version = '1.0.0', source, intervals, diagnostics = [], capabilities = {} }) {
  const duplicates = detectDuplicateWindows(intervals);
  const counterRegressions = detectCounterRegression(intervals);
  const blockers = [];
  if (duplicates.length) blockers.push(diagnostic('duplicate_window', 'BLOCK', `${duplicates.length} duplicate measurement window(s) detected`, { row_indexes: duplicates }));
  if (counterRegressions.length) blockers.push(diagnostic('counter_regression', 'BLOCK', `${counterRegressions.length} cumulative counter regression(s) detected`, { regressions: counterRegressions }));
  const surplus = sum(intervals.filter((row) => row.surplus_basis_ok).map((row) => row.eligible_surplus_kwh));
  const result = {
    schema: 'solarpunk.constraint.normalized_evidence.v1',
    adapter: { id: adapter_id, version: adapter_version },
    source,
    intervals,
    diagnostics: [...diagnostics, ...blockers],
    capabilities: {
      identity: intervals.some((row) => row.meter_id || row.site_id),
      cumulative_counters: intervals.some((row) => row.cumulative_kwh != null),
      complete_energy_balance: intervals.some((row) => row.generation_kwh != null && row.site_load_kwh != null && row.export_kwh != null),
      quality_score: intervals.some((row) => row.quality_score != null),
      ...capabilities,
    },
    summary: {
      interval_count: intervals.length,
      total_eligible_surplus_kwh: surplus,
      blocker_count: [...diagnostics, ...blockers].filter((item) => item.status === 'BLOCK').length,
      warning_count: [...diagnostics, ...blockers].filter((item) => item.status === 'WARNING').length,
    },
  };
  return result;
}

export function normalizeGenericCsv(csvText, mapping = null) {
  const { headers, rows } = parseCsv(csvText);
  const map = mapping || autoMapColumns(headers);
  if (!map.timestamp) throw new Error('Generic interval CSV requires a timestamp/window_start column');
  if (!map.export_kwh && !(map.generation_kwh && map.site_load_kwh)) {
    throw new Error('Generic interval CSV requires export_kwh or generation_kwh + site_load_kwh');
  }
  const intervals = [];
  const diagnostics = [];
  rows.forEach((row, index) => {
    try {
      intervals.push(canonicalInterval({
        window_start: row[map.timestamp],
        window_end: map.window_end ? row[map.window_end] : row[map.timestamp],
        generation_kwh: map.generation_kwh ? row[map.generation_kwh] : null,
        site_load_kwh: map.site_load_kwh ? row[map.site_load_kwh] : null,
        export_kwh: map.export_kwh ? row[map.export_kwh] : null,
        curtailed_kwh: map.curtailed_kwh ? row[map.curtailed_kwh] : 0,
        meter_id: map.meter_id ? row[map.meter_id] : null,
        site_id: map.site_id ? row[map.site_id] : null,
        cumulative_kwh: map.cumulative_kwh ? row[map.cumulative_kwh] : null,
        quality_score: map.quality_score ? row[map.quality_score] : null,
      }, { source: 'browser_generic_csv', source_kind: 'generic_interval_csv' }));
    } catch (error) {
      diagnostics.push(diagnostic('row_rejected', 'BLOCK', error.message, { row_index: index + 1 }));
    }
  });
  if (!intervals.length) throw new Error('No generic interval rows survived normalization');
  return finalizeAdapter({
    adapter_id: 'generic-interval-csv',
    source: { kind: 'generic_interval_csv', local_only: true },
    intervals,
    diagnostics,
    capabilities: { browser_local: true, operator_signed: false },
  });
}

export function normalizeGreenButtonCsv(csvText) {
  const { rows } = parseCsv(csvText);
  const daily = new Map();
  const diagnostics = [];
  rows.forEach((row, index) => {
    try {
      const start = canonicalTimestamp(pickAlias(row, ['interval_start', 'start', 'window_start', 'usage_start', 'start_date_time']), 'interval_start');
      const end = canonicalTimestamp(pickAlias(row, ['interval_end', 'end', 'window_end', 'usage_end', 'end_date_time']), 'interval_end');
      const usage = numeric(pickAlias(row, ['usage', 'value', 'energy_kwh', 'kwh', 'quantity']), 'usage');
      if (usage < 0) throw new Error('usage cannot be negative');
      const flow = String(pickAlias(row, ['flow_direction', 'direction', 'flow', 'kind', 'type', 'channel']) || '').toLowerCase();
      const isExport = ['export', 'reverse', 'delivered', 'generation', 'production'].some((token) => flow.includes(token));
      const isImport = ['import', 'forward', 'received', 'consumption', 'load'].some((token) => flow.includes(token));
      if (flow && isExport === isImport) {
        diagnostics.push(diagnostic('ambiguous_flow_direction', 'WARNING', `Row ${index + 1} has ambiguous flow direction: ${flow}`));
      }
      const day = start.slice(0, 10);
      const bucket = daily.get(day) || { export_kwh: 0, site_load_kwh: 0, window_start: `${day}T00:00:00Z`, window_end: `${day}T23:59:59Z` };
      if (isImport && !isExport) bucket.site_load_kwh += usage;
      else bucket.export_kwh += usage;
      daily.set(day, bucket);
      if (unixSeconds(start) >= unixSeconds(end)) throw new Error('interval_end must be after interval_start');
    } catch (error) {
      diagnostics.push(diagnostic('utility_row_rejected', 'BLOCK', error.message, { row_index: index + 1 }));
    }
  });
  const intervals = [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, bucket]) => canonicalInterval({
    ...bucket,
    source: 'green_button_or_utility_interval',
    site_id: `utility-day-${day}`,
  }, { source_kind: 'utility_interval_export' }));
  if (!intervals.length) throw new Error('No utility rows survived normalization');
  diagnostics.push(diagnostic('utility_generation_unknown', 'WARNING', 'Utility interval exports can establish import/export flow but do not by themselves prove on-site generation. Claim policies must treat export-only evidence explicitly.'));
  return finalizeAdapter({
    adapter_id: 'green-button-utility',
    source: { kind: 'utility_interval_export', local_only: true, externally_corroborated: true },
    intervals,
    diagnostics,
    capabilities: { browser_local: true, external_corroboration: true, operator_signed: false },
  });
}

export function normalizeCumulativePair(startRaw, endRaw, options = {}) {
  const startCounters = startRaw?.counters || {};
  const endCounters = endRaw?.counters || {};
  const meterId = String(options.meter_id || endRaw?.meter_id || startRaw?.meter_id || '').trim();
  const siteId = String(options.site_id || endRaw?.site_id || startRaw?.site_id || '').trim();
  if (!meterId || !siteId) throw new Error('Cumulative snapshots require meter_id and site_id');
  if (startRaw?.meter_id && endRaw?.meter_id && startRaw.meter_id !== endRaw.meter_id) throw new Error('start and end snapshots use different meter_id values');
  if (startRaw?.site_id && endRaw?.site_id && startRaw.site_id !== endRaw.site_id) throw new Error('start and end snapshots use different site_id values');
  const windowStart = canonicalTimestamp(startRaw?.captured_at || startRaw?.timestamp, 'start.captured_at');
  const windowEnd = canonicalTimestamp(endRaw?.captured_at || endRaw?.timestamp, 'end.captured_at');
  if (unixSeconds(windowStart) >= unixSeconds(windowEnd)) throw new Error('end snapshot must be after start snapshot');
  const fields = ['generation_kwh_total', 'site_load_kwh_total', 'export_kwh_total', 'curtailed_kwh_total'];
  const delta = Object.fromEntries(fields.map((field) => {
    const start = numeric(startCounters[field] ?? (field === 'curtailed_kwh_total' ? 0 : null), `start.${field}`);
    const end = numeric(endCounters[field] ?? (field === 'curtailed_kwh_total' ? 0 : null), `end.${field}`);
    if (end < start) throw new Error(`${field} counter moved backwards`);
    return [field, round(end - start)];
  }));
  const interval = canonicalInterval({
    meter_id: meterId,
    site_id: siteId,
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: delta.generation_kwh_total,
    site_load_kwh: delta.site_load_kwh_total,
    export_kwh: delta.export_kwh_total,
    curtailed_kwh: delta.curtailed_kwh_total,
    quality_score: endRaw?.quality_score ?? options.quality_score ?? 0.97,
    source: endRaw?.provider || startRaw?.provider || 'cumulative_meter_gateway_v1',
  }, { source_kind: 'cumulative_counter_pair' });
  const balanceDrift = Math.abs((interval.generation_kwh || 0) - (interval.site_load_kwh || 0) - (interval.export_kwh || 0) - (interval.curtailed_kwh || 0));
  const tolerance = Math.max(0.001, (interval.generation_kwh || 0) * 0.02);
  const diagnostics = [
    diagnostic('counter_monotonicity', 'PASS', 'All cumulative counters are monotonic across the closed interval.'),
    diagnostic('identity_match', 'PASS', `Snapshots resolve to meter ${meterId} at site ${siteId}.`),
    diagnostic('energy_balance', balanceDrift <= tolerance ? 'PASS' : 'WARNING', `Energy balance drift is ${round(balanceDrift)} kWh; 2% tolerance is ${round(tolerance)} kWh.`),
  ];
  return finalizeAdapter({
    adapter_id: 'cumulative-meter-pair',
    source: { kind: 'cumulative_counter_pair', provider: interval.source, local_only: true },
    intervals: [interval],
    diagnostics,
    capabilities: { cumulative_counters: true, identity: true, browser_local: true, live_gateway_candidate: true },
  });
}

function froniusData(raw) {
  return raw?.Body?.Data || {};
}

function froniusProductionWh(raw) {
  const data = froniusData(raw);
  const siteTotal = optionalNumeric(data.Site?.E_Total);
  if (siteTotal != null) return siteTotal;
  const totals = Object.values(data.Inverters || {}).map((item) => optionalNumeric(item?.E_Total)).filter((value) => value != null);
  if (!totals.length) throw new Error('Fronius payload has no Site.E_Total or inverter E_Total value');
  return totals.reduce((total, value) => total + value, 0);
}

function froniusPower(raw) {
  const site = froniusData(raw).Site || {};
  const pv = optionalNumeric(site.P_PV) ?? 0;
  const load = optionalNumeric(site.P_Load) ?? 0;
  const grid = optionalNumeric(site.P_Grid) ?? 0;
  return { pv_w: Math.max(0, pv), load_w: Math.abs(load), export_w: Math.max(0, -grid), raw_grid_w: grid };
}

export function normalizeFroniusPair(startRaw, endRaw, options = {}) {
  const windowStart = canonicalTimestamp(startRaw?.Head?.Timestamp || startRaw?.timestamp, 'fronius.start.timestamp');
  const windowEnd = canonicalTimestamp(endRaw?.Head?.Timestamp || endRaw?.timestamp, 'fronius.end.timestamp');
  const seconds = unixSeconds(windowEnd) - unixSeconds(windowStart);
  if (seconds <= 0) throw new Error('Fronius end payload must be after start payload');
  const generation = round((froniusProductionWh(endRaw) - froniusProductionWh(startRaw)) / 1000);
  if (generation < 0) throw new Error('Fronius production counter moved backwards');
  const startPower = froniusPower(startRaw);
  const endPower = froniusPower(endRaw);
  const hours = seconds / 3600;
  const load = round(((startPower.load_w + endPower.load_w) / 2) * hours / 1000);
  const exported = round(((startPower.export_w + endPower.export_w) / 2) * hours / 1000);
  const interval = canonicalInterval({
    meter_id: options.meter_id || 'FRONIUS-DEMO-001',
    site_id: options.site_id || 'fronius-demo-site',
    window_start: windowStart,
    window_end: windowEnd,
    generation_kwh: generation,
    site_load_kwh: load,
    export_kwh: exported,
    curtailed_kwh: options.curtailed_kwh ?? 0,
    quality_score: options.quality_score ?? 0.82,
    source: 'fronius_powerflow_interval_v1',
  }, { source_kind: 'fronius_powerflow_pair' });
  const diagnostics = [
    diagnostic('production_counter', 'PASS', 'Generation is derived from the Fronius E_Total counter delta.'),
    diagnostic('powerflow_interval_estimate', 'WARNING', 'Site load and export use average endpoint power across the interval; this is an estimate, not revenue-grade interval metering.'),
    diagnostic('grid_sign_convention', 'WARNING', 'Negative P_Grid is treated as export. Operators must confirm the site sign convention before real-value use.'),
  ];
  return finalizeAdapter({
    adapter_id: 'fronius-powerflow-pair',
    source: { kind: 'fronius_powerflow_pair', provider: 'fronius_powerflow_v1', local_only: true },
    intervals: [interval],
    diagnostics,
    capabilities: { identity: true, browser_local: true, live_gateway_candidate: true, instantaneous_power_estimate: true },
  });
}

export async function buildEvidenceEnvelope(normalized, meta = {}) {
  const canonical = {
    schema: 'solarpunk.constraint.evidence_envelope.v1',
    adapter: normalized.adapter,
    source: normalized.source,
    intervals: normalized.intervals.map((row) => ({
      meter_id: row.meter_id,
      site_id: row.site_id,
      window_start: row.window_start,
      window_end: row.window_end,
      generation_kwh: row.generation_kwh,
      site_load_kwh: row.site_load_kwh,
      export_kwh: row.export_kwh,
      curtailed_kwh: row.curtailed_kwh,
      eligible_surplus_kwh: row.eligible_surplus_kwh,
      surplus_basis: row.surplus_basis,
      quality_score: row.quality_score,
      source: row.source,
    })),
    summary: normalized.summary,
    capabilities: normalized.capabilities,
    meta: {
      source_label: meta.source_label || normalized.source?.kind || normalized.adapter.id,
      browser_local: meta.browser_local ?? Boolean(normalized.capabilities?.browser_local),
    },
  };
  return {
    ...canonical,
    evidence_hash: await sha256Hex(stableStringify(canonical)),
    hash_algorithm: 'SHA-256',
  };
}

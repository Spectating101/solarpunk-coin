/**
 * Browser-local Evidence Lab: CSV parse, validate, surplus, SHA-256 receipt.
 * No network I/O. Deterministic.
 */

export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_ROWS = 5000;

export const FIELD_ALIASES = {
  timestamp: ['timestamp', 'window_start', 'interval start', 'interval_start', 'time', 'datetime'],
  generation_kwh: ['generation_kwh', 'generation', 'gen_kwh', 'produced_kwh', 'production_kwh'],
  consumption_kwh: ['consumption_kwh', 'consumption', 'site_load_kwh', 'load_kwh', 'usage_kwh'],
  export_kwh: ['export_kwh', 'export', 'exported_kwh', 'grid_export_kwh'],
  meter_id: ['meter_id', 'site_id', 'meter', 'site'],
  cumulative_kwh: ['cumulative_kwh', 'cumulative', 'cum_kwh', 'total_kwh'],
};

const REQUIRED = ['timestamp', 'generation_kwh'];

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

export function parseCsv(text) {
  const normalized = String(text).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#'));
  if (lines.length < 2) {
    throw new Error('CSV requires a header row and at least one data row');
  }

  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    if (cells.every((c) => c === '')) continue;
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${i + 1} has ${cells.length} cells, expected ${headers.length}`);
    }
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx];
    });
    rows.push(row);
  }
  return { headers, rows };
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error('CSV quote was not closed');
  cells.push(cell.trim());
  return cells;
}

export function autoMapColumns(headers) {
  const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));
  const mapping = {};
  for (const [canonical, aliases] of Object.entries(FIELD_ALIASES)) {
    const hit = normalized.find((h) => aliases.includes(h.norm) || aliases.includes(h.raw.toLowerCase()));
    if (hit) mapping[canonical] = hit.raw;
  }
  return mapping;
}

function toNumber(value) {
  if (value === '' || value == null) return null;
  const n = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function toIso(value) {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toISOString().replace('.000Z', 'Z');
}

function eligibleSurplus({ generation, consumption, exportKwh }) {
  if (exportKwh != null && Number.isFinite(exportKwh) && consumption != null && Number.isFinite(consumption)) {
    return Math.max(0, Math.min(exportKwh, generation - consumption));
  }
  if (exportKwh != null && Number.isFinite(exportKwh)) {
    return Math.max(0, exportKwh);
  }
  return Math.max(0, generation - (consumption ?? 0));
}

/**
 * Validate mapped rows. Returns accepted rows, rejects, totals, issuance cap.
 */
export function validateMeterRows(rawRows, mapping) {
  const missing = REQUIRED.filter((k) => !mapping[k]);
  if (missing.length) {
    return {
      ok: false,
      error: `Missing required columns: ${missing.join(', ')}`,
      accepted: [],
      rejected: [],
      totals: null,
    };
  }

  if (rawRows.length > MAX_ROWS) {
    return {
      ok: false,
      error: `Too many rows (${rawRows.length}). Limit is ${MAX_ROWS}.`,
      accepted: [],
      rejected: [],
      totals: null,
    };
  }

  const accepted = [];
  const rejected = [];
  const seenTimestamps = new Map();
  let prevCumulative = null;

  rawRows.forEach((raw, index) => {
    const issues = [];
    const tsRaw = raw[mapping.timestamp];
    const iso = toIso(tsRaw);
    if (!iso) issues.push('malformed_timestamp');

    const generation = toNumber(raw[mapping.generation_kwh]);
    if (generation == null || Number.isNaN(generation)) issues.push('malformed_generation');
    else if (generation < 0) issues.push('negative_generation');

    let consumption = null;
    if (mapping.consumption_kwh) {
      consumption = toNumber(raw[mapping.consumption_kwh]);
      if (consumption == null || Number.isNaN(consumption)) issues.push('malformed_consumption');
      else if (consumption < 0) issues.push('negative_consumption');
    }

    let exportKwh = null;
    if (mapping.export_kwh) {
      exportKwh = toNumber(raw[mapping.export_kwh]);
      if (exportKwh == null || Number.isNaN(exportKwh)) issues.push('malformed_export');
      else if (exportKwh < 0) issues.push('negative_export');
    }

    let cumulative = null;
    if (mapping.cumulative_kwh) {
      cumulative = toNumber(raw[mapping.cumulative_kwh]);
      if (cumulative == null || Number.isNaN(cumulative)) issues.push('malformed_cumulative');
      else if (prevCumulative != null && cumulative < prevCumulative) {
        issues.push('non_monotonic_cumulative');
      }
    }

    if (iso && seenTimestamps.has(iso)) issues.push('duplicate_timestamp');

    const meterId = mapping.meter_id ? String(raw[mapping.meter_id] || '').trim() || null : null;

    if (issues.length) {
      rejected.push({ row_index: index + 1, issues, raw });
      return;
    }

    if (iso) seenTimestamps.set(iso, index);
    if (cumulative != null) prevCumulative = cumulative;

    const surplus = eligibleSurplus({ generation, consumption, exportKwh });
    accepted.push({
      row_index: index + 1,
      timestamp: iso,
      generation_kwh: generation,
      consumption_kwh: consumption,
      export_kwh: exportKwh,
      cumulative_kwh: cumulative,
      meter_id: meterId,
      eligible_surplus_kwh: Number(surplus.toFixed(6)),
    });
  });

  const totalGeneration = accepted.reduce((s, r) => s + r.generation_kwh, 0);
  const totalConsumption = accepted.reduce((s, r) => s + (r.consumption_kwh ?? 0), 0);
  const totalExport = accepted.reduce((s, r) => s + (r.export_kwh ?? 0), 0);
  const totalSurplus = accepted.reduce((s, r) => s + r.eligible_surplus_kwh, 0);
  const issuanceCapSpk = Number(totalSurplus.toFixed(6));

  return {
    ok: accepted.length > 0,
    error: accepted.length === 0 ? 'No accepted rows after validation' : null,
    accepted,
    rejected,
    totals: {
      generation_kwh: Number(totalGeneration.toFixed(6)),
      consumption_kwh: Number(totalConsumption.toFixed(6)),
      export_kwh: Number(totalExport.toFixed(6)),
      eligible_surplus_kwh: Number(totalSurplus.toFixed(6)),
      issuance_cap_spk: issuanceCapSpk,
      accepted_rows: accepted.length,
      rejected_rows: rejected.length,
    },
  };
}

export function canonicalEvidencePayload(acceptedRows, meta = {}) {
  const rows = acceptedRows.map((r) => ({
    timestamp: r.timestamp,
    generation_kwh: r.generation_kwh,
    consumption_kwh: r.consumption_kwh,
    export_kwh: r.export_kwh,
    eligible_surplus_kwh: r.eligible_surplus_kwh,
    meter_id: r.meter_id,
  }));
  return {
    schema: 'solarpunk.public_lab.evidence_receipt.v1',
    lab: 'SolarPunk Public Lab v1.0',
    status: {
      validated_locally: true,
      evidence_receipt_generated: true,
      accepted_for_live_minting: false,
      physical_truth_or_revenue_grade: false,
    },
    meta: {
      source: meta.source || 'browser',
      filename: meta.filename || null,
      created_at: meta.created_at || new Date().toISOString(),
      row_count: rows.length,
    },
    rows,
    totals: meta.totals || null,
  };
}

export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
}

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function buildEvidenceReceipt(acceptedRows, totals, meta = {}) {
  const payload = canonicalEvidencePayload(acceptedRows, {
    ...meta,
    totals,
    created_at: meta.created_at || new Date().toISOString(),
  });
  // Hash excludes created_at volatility: hash rows + totals only
  const hashBody = stableStringify({
    schema: payload.schema,
    rows: payload.rows,
    totals: payload.totals,
  });
  const evidence_hash = await sha256Hex(hashBody);
  return {
    ...payload,
    evidence_hash,
    hash_algorithm: 'SHA-256',
    disclaimer:
      'Local validation only. Not accepted for live minting. Not proof of physical truth or revenue-grade meter finality.',
  };
}

export function downloadJson(filename, obj) {
  const blob = new Blob([`${JSON.stringify(obj, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

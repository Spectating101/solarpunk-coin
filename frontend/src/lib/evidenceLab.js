/**
 * Browser-local Evidence Lab: CSV parse, validate, surplus, SHA-256 receipt.
 * No network I/O. Deterministic. UTC-qualified timestamps only.
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

const TZ_QUALIFIED =
  /(?:Z|[+-]\d{2}:?\d{2})$/i;

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

/**
 * Require Z or explicit UTC offset. Never guess browser-local timezone.
 */
export function parseQualifiedTimestamp(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return { iso: null, issue: 'malformed_timestamp' };
  if (!TZ_QUALIFIED.test(raw.replace(/\s+/g, ''))) {
    return { iso: null, issue: 'ambiguous_timezone' };
  }
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return { iso: null, issue: 'malformed_timestamp' };
  return { iso: new Date(ms).toISOString().replace('.000Z', 'Z'), issue: null };
}

/**
 * Surplus requires export OR (generation AND consumption).
 * Generation alone never implies surplus.
 */
export function computeEligibleSurplus({ generation, consumption, exportKwh }) {
  const hasExport = exportKwh != null && Number.isFinite(exportKwh);
  const hasGen = generation != null && Number.isFinite(generation);
  const hasCons = consumption != null && Number.isFinite(consumption);

  if (hasExport && hasGen && hasCons) {
    return {
      surplus: Math.max(0, Math.min(exportKwh, generation - consumption)),
      basis: 'export_capped_by_generation_minus_consumption',
      surplus_basis_ok: true,
    };
  }
  if (hasExport) {
    return {
      surplus: Math.max(0, exportKwh),
      basis: 'export_only',
      surplus_basis_ok: true,
    };
  }
  if (hasGen && hasCons) {
    return {
      surplus: Math.max(0, generation - consumption),
      basis: 'generation_minus_consumption',
      surplus_basis_ok: true,
    };
  }
  return {
    surplus: 0,
    basis: 'insufficient_surplus_basis',
    surplus_basis_ok: false,
  };
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function detectIntervalGaps(acceptedRows, { multiplier = 2 } = {}) {
  const byMeter = new Map();
  for (const row of acceptedRows) {
    const key = row.meter_id || '__default__';
    if (!byMeter.has(key)) byMeter.set(key, []);
    byMeter.get(key).push(row);
  }

  const warnings = [];
  for (const [meterId, rows] of byMeter) {
    const sorted = [...rows].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    if (sorted.length < 3) continue;
    const deltas = [];
    for (let i = 1; i < sorted.length; i += 1) {
      deltas.push(Date.parse(sorted[i].timestamp) - Date.parse(sorted[i - 1].timestamp));
    }
    const expected = median(deltas.filter((d) => d > 0));
    if (!expected || expected <= 0) continue;
    const threshold = expected * multiplier;
    for (let i = 1; i < sorted.length; i += 1) {
      const delta = Date.parse(sorted[i].timestamp) - Date.parse(sorted[i - 1].timestamp);
      if (delta > threshold) {
        warnings.push({
          code: 'interval_gap',
          meter_id: meterId === '__default__' ? null : meterId,
          start: sorted[i - 1].timestamp,
          end: sorted[i].timestamp,
          observed_delta_ms: delta,
          expected_cadence_ms: expected,
        });
      }
    }
  }
  return warnings;
}

function mappingHasSurplusBasis(mapping) {
  return Boolean(mapping.export_kwh || (mapping.generation_kwh && mapping.consumption_kwh));
}

/**
 * Validate mapped rows. Returns accepted rows, rejects, gaps, totals, issuance eligibility.
 */
export function validateMeterRows(rawRows, mapping) {
  if (!mapping.timestamp) {
    return {
      ok: false,
      error: 'Missing required column: timestamp',
      accepted: [],
      rejected: [],
      gap_warnings: [],
      totals: null,
    };
  }

  const hasExportCol = Boolean(mapping.export_kwh);
  const hasGenCol = Boolean(mapping.generation_kwh);
  const hasConsCol = Boolean(mapping.consumption_kwh);

  if (!hasExportCol && !hasGenCol) {
    return {
      ok: false,
      error: 'Need export_kwh and/or generation_kwh columns to inspect energy evidence',
      accepted: [],
      rejected: [],
      gap_warnings: [],
      totals: null,
    };
  }

  if (rawRows.length > MAX_ROWS) {
    return {
      ok: false,
      error: `Too many rows (${rawRows.length}). Limit is ${MAX_ROWS}.`,
      accepted: [],
      rejected: [],
      gap_warnings: [],
      totals: null,
    };
  }

  const accepted = [];
  const rejected = [];
  const seenTimestamps = new Map(); // meterKey|iso
  const prevCumulative = new Map(); // meterKey

  rawRows.forEach((raw, index) => {
    const issues = [];
    const meterId = mapping.meter_id ? String(raw[mapping.meter_id] || '').trim() || null : null;
    const meterKey = meterId || '__default__';

    const { iso, issue: tsIssue } = parseQualifiedTimestamp(raw[mapping.timestamp]);
    if (tsIssue) issues.push(tsIssue);

    let generation = null;
    if (hasGenCol) {
      generation = toNumber(raw[mapping.generation_kwh]);
      if (generation == null || Number.isNaN(generation)) issues.push('malformed_generation');
      else if (generation < 0) issues.push('negative_generation');
    }

    let consumption = null;
    if (hasConsCol) {
      consumption = toNumber(raw[mapping.consumption_kwh]);
      if (consumption == null || Number.isNaN(consumption)) issues.push('malformed_consumption');
      else if (consumption < 0) issues.push('negative_consumption');
    }

    let exportKwh = null;
    if (hasExportCol) {
      exportKwh = toNumber(raw[mapping.export_kwh]);
      if (exportKwh == null || Number.isNaN(exportKwh)) issues.push('malformed_export');
      else if (exportKwh < 0) issues.push('negative_export');
    }

    let cumulative = null;
    if (mapping.cumulative_kwh) {
      cumulative = toNumber(raw[mapping.cumulative_kwh]);
      if (cumulative == null || Number.isNaN(cumulative)) issues.push('malformed_cumulative');
      else {
        const prev = prevCumulative.get(meterKey);
        if (prev != null && cumulative < prev) issues.push('non_monotonic_cumulative');
      }
    }

    if (iso) {
      const dupKey = `${meterKey}|${iso}`;
      if (seenTimestamps.has(dupKey)) issues.push('duplicate_timestamp');
    }

    if (issues.length) {
      rejected.push({
        row_index: index + 1,
        issues,
        meter_id: meterId,
      });
      return;
    }

    seenTimestamps.set(`${meterKey}|${iso}`, index);
    if (cumulative != null) prevCumulative.set(meterKey, cumulative);

    const { surplus, basis, surplus_basis_ok } = computeEligibleSurplus({
      generation,
      consumption,
      exportKwh,
    });

    accepted.push({
      row_index: index + 1,
      timestamp: iso,
      generation_kwh: generation,
      consumption_kwh: consumption,
      export_kwh: exportKwh,
      cumulative_kwh: cumulative,
      meter_id: meterId,
      eligible_surplus_kwh: Number(surplus.toFixed(6)),
      surplus_basis: basis,
      surplus_basis_ok,
    });
  });

  const gap_warnings = detectIntervalGaps(accepted);

  const genValues = accepted.map((r) => r.generation_kwh).filter((v) => v != null);
  const consValues = accepted.map((r) => r.consumption_kwh).filter((v) => v != null);
  const exportValues = accepted.map((r) => r.export_kwh).filter((v) => v != null);
  const surplusValues = accepted.filter((r) => r.surplus_basis_ok).map((r) => r.eligible_surplus_kwh);

  const fileHasSurplusBasis = mappingHasSurplusBasis(mapping);
  const anyRowSurplusBasis = accepted.some((r) => r.surplus_basis_ok);
  const issuance_eligible = fileHasSurplusBasis && anyRowSurplusBasis;
  const totalSurplus = surplusValues.reduce((s, v) => s + v, 0);
  const issuance_cap_spk = issuance_eligible ? Number(totalSurplus.toFixed(6)) : 0;
  const issuance_reason = issuance_eligible
    ? 'surplus_basis_present'
    : 'insufficient_surplus_basis';

  const totals = {
    generation_kwh: genValues.length ? Number(genValues.reduce((a, b) => a + b, 0).toFixed(6)) : null,
    consumption_kwh: consValues.length ? Number(consValues.reduce((a, b) => a + b, 0).toFixed(6)) : null,
    export_kwh: exportValues.length ? Number(exportValues.reduce((a, b) => a + b, 0).toFixed(6)) : null,
    eligible_surplus_kwh: issuance_eligible ? Number(totalSurplus.toFixed(6)) : 0,
    issuance_cap_spk,
    issuance_eligible,
    issuance_reason,
    surplus_basis_used: issuance_eligible
      ? [...new Set(accepted.filter((r) => r.surplus_basis_ok).map((r) => r.surplus_basis))]
      : [],
    accepted_rows: accepted.length,
    rejected_rows: rejected.length,
    gap_warning_count: gap_warnings.length,
    illustrative_cap_label:
      'Illustrative issuance cap under the Public Lab 1 SPK / eligible surplus kWh rule',
  };

  return {
    ok: accepted.length > 0,
    error: accepted.length === 0 ? 'No accepted rows after validation' : null,
    accepted,
    rejected,
    gap_warnings,
    totals,
  };
}

export function canonicalEvidencePayload(acceptedRows, meta = {}) {
  const rows = acceptedRows.map((r) => {
    const row = {
      timestamp: r.timestamp,
      generation_kwh: r.generation_kwh,
      consumption_kwh: r.consumption_kwh,
      export_kwh: r.export_kwh,
      eligible_surplus_kwh: r.eligible_surplus_kwh,
      surplus_basis: r.surplus_basis,
      meter_id: r.meter_id,
    };
    if (r.cumulative_kwh != null) row.cumulative_kwh = r.cumulative_kwh;
    return row;
  });
  return {
    schema: 'solarpunk.public_lab.evidence_receipt.v1',
    lab: 'SolarPunk Public Lab v1.0',
    status: {
      validated_locally: true,
      evidence_receipt_generated: true,
      accepted_for_live_minting: false,
      physical_truth_or_revenue_grade: false,
      unsigned_browser_receipt: true,
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
  const diagnostics = {
    accepted_rows: totals?.accepted_rows ?? acceptedRows.length,
    rejected_rows: totals?.rejected_rows ?? 0,
    rejections: (meta.rejected || []).map((r) => ({
      row_index: r.row_index,
      issues: r.issues,
      meter_id: r.meter_id ?? null,
    })),
    gap_warnings: meta.gap_warnings || [],
    issuance_eligible: Boolean(totals?.issuance_eligible),
    issuance_reason: totals?.issuance_reason || null,
    surplus_basis_used: totals?.surplus_basis_used || [],
    illustrative_cap_label: totals?.illustrative_cap_label || null,
  };

  const payload = canonicalEvidencePayload(acceptedRows, {
    ...meta,
    totals,
    created_at: meta.created_at || new Date().toISOString(),
  });

  const hashBody = stableStringify({
    schema: payload.schema,
    rows: payload.rows,
    totals: {
      eligible_surplus_kwh: totals?.eligible_surplus_kwh ?? null,
      issuance_cap_spk: totals?.issuance_cap_spk ?? null,
      issuance_eligible: totals?.issuance_eligible ?? false,
      issuance_reason: totals?.issuance_reason ?? null,
      surplus_basis_used: totals?.surplus_basis_used ?? [],
      generation_kwh: totals?.generation_kwh ?? null,
      consumption_kwh: totals?.consumption_kwh ?? null,
      export_kwh: totals?.export_kwh ?? null,
      accepted_rows: totals?.accepted_rows ?? null,
    },
  });
  const evidence_hash = await sha256Hex(hashBody);

  return {
    ...payload,
    diagnostics,
    evidence_hash,
    hash_algorithm: 'SHA-256',
    disclaimer:
      'Local unsigned validation only. Not accepted for live minting. Not proof of physical truth or revenue-grade meter finality. Generation alone is not surplus.',
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

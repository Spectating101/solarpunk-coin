export function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
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

export function parseCsv(text) {
  const lines = String(text)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'));
  if (lines.length < 2) throw new Error('CSV requires a header row and at least one data row');
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line, index) => {
    const cells = parseCsvLine(line);
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${index + 2} has ${cells.length} cells, expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex]]));
  });
  return { headers, rows };
}

export function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[\s-]+/g, '_');
}

export function pickAlias(row, aliases) {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]),
  );
  for (const alias of aliases) {
    const key = normalizeHeader(alias);
    if (normalized[key] !== undefined && normalized[key] !== '') return normalized[key];
  }
  return null;
}

export const GENERIC_FIELD_ALIASES = {
  timestamp: ['timestamp', 'window_start', 'interval start', 'interval_start', 'time', 'datetime'],
  window_end: ['window_end', 'interval end', 'interval_end', 'end'],
  generation_kwh: ['generation_kwh', 'generation', 'gen_kwh', 'produced_kwh', 'production_kwh'],
  site_load_kwh: ['site_load_kwh', 'consumption_kwh', 'consumption', 'load_kwh', 'usage_kwh'],
  export_kwh: ['export_kwh', 'export', 'exported_kwh', 'grid_export_kwh'],
  curtailed_kwh: ['curtailed_kwh', 'curtailed', 'curtailment_kwh'],
  meter_id: ['meter_id', 'meter'],
  site_id: ['site_id', 'site'],
  cumulative_kwh: ['cumulative_kwh', 'cumulative', 'cum_kwh', 'total_kwh'],
  quality_score: ['quality_score', 'quality'],
};

export function autoMapColumns(headers, aliases = GENERIC_FIELD_ALIASES) {
  const normalized = headers.map((header) => ({ raw: header, normalized: normalizeHeader(header) }));
  const mapping = {};
  for (const [canonical, candidates] of Object.entries(aliases)) {
    const hit = normalized.find((header) => candidates.some((candidate) => normalizeHeader(candidate) === header.normalized));
    if (hit) mapping[canonical] = hit.raw;
  }
  return mapping;
}

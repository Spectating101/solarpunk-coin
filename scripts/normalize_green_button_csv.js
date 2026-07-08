/**
 * Normalize Green Button / utility interval CSV exports into SPK meter-import CSV.
 * Handles common column aliases; aggregates hourly (or sub-daily) rows into daily windows.
 */
const fs = require("fs");
const path = require("path");
const { parseCsv } = require("./import_meter_csv");

const ROOT = path.join(__dirname, "..");

const SPK_COLUMNS = [
  "window_start",
  "window_end",
  "generation_kwh",
  "site_load_kwh",
  "export_kwh",
  "curtailed_kwh",
  "quality_score",
];

function getArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function normalizeHeader(header) {
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "");
}

function pick(row, aliases) {
  for (const key of aliases) {
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }
  return null;
}

function parseRowsWithAliases(rows) {
  return rows.map((row, index) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[normalizeHeader(key)] = value;
    }

    const start = pick(normalized, [
      "interval_start",
      "start",
      "window_start",
      "usage_start",
      "start_date_time",
    ]);
    const end = pick(normalized, [
      "interval_end",
      "end",
      "window_end",
      "usage_end",
      "end_date_time",
    ]);
    const usage = pick(normalized, ["usage", "value", "energy_kwh", "kwh", "quantity"]);
    const flow = String(
      pick(normalized, ["flow_direction", "direction", "flow", "kind", "type", "channel"]) || ""
    ).toLowerCase();

    if (!start || !end) {
      throw new Error(`row ${index + 1}: missing interval start/end columns`);
    }
    const usageKwh = Number(usage);
    if (!Number.isFinite(usageKwh)) {
      throw new Error(`row ${index + 1}: missing numeric usage`);
    }

    const isExport =
      flow.includes("export") ||
      flow.includes("reverse") ||
      flow.includes("delivered") ||
      flow.includes("generation") ||
      flow.includes("production");
    const isImport =
      flow.includes("import") ||
      flow.includes("forward") ||
      flow.includes("received") ||
      flow.includes("consumption") ||
      flow.includes("load");

    let exportKwh = 0;
    let loadKwh = 0;
    if (isExport && !isImport) {
      exportKwh = Math.max(0, usageKwh);
    } else if (isImport && !isExport) {
      loadKwh = Math.max(0, usageKwh);
    } else if (!flow) {
      exportKwh = Math.max(0, usageKwh);
    } else {
      exportKwh = Math.max(0, usageKwh);
    }

    return {
      window_start: new Date(start).toISOString().replace(".000Z", "Z"),
      window_end: new Date(end).toISOString().replace(".000Z", "Z"),
      export_kwh: exportKwh,
      site_load_kwh: loadKwh,
      generation_kwh: exportKwh + loadKwh,
      curtailed_kwh: 0,
      day: new Date(start).toISOString().slice(0, 10),
    };
  });
}

function aggregateDaily(intervals) {
  const byDay = new Map();
  for (const row of intervals) {
    const bucket = byDay.get(row.day) || {
      window_start: `${row.day}T00:00:00Z`,
      window_end: `${row.day}T23:59:59Z`,
      generation_kwh: 0,
      site_load_kwh: 0,
      export_kwh: 0,
      curtailed_kwh: 0,
    };
    bucket.generation_kwh += row.generation_kwh;
    bucket.site_load_kwh += row.site_load_kwh;
    bucket.export_kwh += row.export_kwh;
    bucket.curtailed_kwh += row.curtailed_kwh;
    byDay.set(row.day, bucket);
  }
  return [...byDay.values()].sort((a, b) => a.window_start.localeCompare(b.window_start));
}

function toSpkCsv(rows, options = {}) {
  const quality = options.qualityScore ?? 0.95;
  const lines = [SPK_COLUMNS.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.window_start,
        row.window_end,
        row.generation_kwh.toFixed(4),
        row.site_load_kwh.toFixed(4),
        row.export_kwh.toFixed(4),
        row.curtailed_kwh.toFixed(4),
        quality,
      ].join(",")
    );
  }
  return `${lines.join("\n")}\n`;
}

function normalizeGreenButtonCsv(csvText, options = {}) {
  const rows = parseCsv(csvText);
  const intervals = parseRowsWithAliases(rows);
  return aggregateDaily(intervals);
}

function main() {
  const inPath = path.resolve(ROOT, getArg("in", "data/meter/green_button_sample.csv"));
  const outPath = path.resolve(ROOT, getArg("out", "data/meter/green_button_normalized.csv"));
  const csvText = fs.readFileSync(inPath, "utf-8");
  const daily = normalizeGreenButtonCsv(csvText, {
    qualityScore: Number(getArg("quality-score", "0.95")),
  });
  const outCsv = toSpkCsv(daily, { qualityScore: Number(getArg("quality-score", "0.95")) });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, outCsv, "utf-8");
  console.log(`interval_rows=${parseCsv(csvText).length}`);
  console.log(`daily_windows=${daily.length}`);
  console.log(`wrote: ${outPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizeGreenButtonCsv,
  toSpkCsv,
  parseRowsWithAliases,
  aggregateDaily,
};

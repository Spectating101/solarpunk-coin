const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PVWATTS_ENDPOINT = "https://developer.nlr.gov/api/pvwatts/v8.json";
const MODEL_YEAR = 2021;

const DEFAULT_CONFIG = {
  generatedAt: null,
  pvwatts: {
    module_type: 0,
    losses: 14,
    array_type: 1,
    tilt: 20,
    azimuth: 180,
    radius: 0,
    timeframe: "hourly",
    dc_ac_ratio: 1.2,
    inv_eff: 96,
    gcr: 0.4,
  },
  spk: {
    net_spk_per_kwh_after_mint_fee: 0.04995,
  },
  sites: [
    {
      id: "taoyuan_10kw",
      label: "Taoyuan 10 kW rooftop",
      latitude: 24.99,
      longitude: 121.30,
      system_capacity_kw: 10,
      dataset: "nsrdb",
      market_note: "SolarPunk reference location; NSRDB/Himawari modeled baseline.",
    },
    {
      id: "austin_10kw",
      label: "Austin 10 kW rooftop",
      latitude: 30.2672,
      longitude: -97.7431,
      system_capacity_kw: 10,
      dataset: "nsrdb",
      market_note: "Pecan Street-adjacent climate anchor for later residential-data comparison.",
    },
    {
      id: "phoenix_10kw",
      label: "Phoenix 10 kW rooftop",
      latitude: 33.4484,
      longitude: -112.0740,
      system_capacity_kw: 10,
      dataset: "nsrdb",
      market_note: "High-solar Southwest US stress/upper-resource benchmark.",
    },
  ],
};

function readJson(relativePath, fallback = null) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf-8");
}

function fixed(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return null;
  return Number(Number(value).toFixed(digits));
}

function average(values) {
  const valid = values.map(Number).filter(Number.isFinite);
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function sum(values) {
  return values.map(Number).filter(Number.isFinite).reduce((total, value) => total + value, 0);
}

function monthDayFromHour(hourIndex) {
  const date = new Date(Date.UTC(MODEL_YEAR, 0, 1));
  date.setUTCDate(date.getUTCDate() + Math.floor(hourIndex / 24));
  return {
    date: date.toISOString().slice(0, 10),
    month_day: date.toISOString().slice(5, 10),
    month: date.getUTCMonth() + 1,
    day_of_year: Math.floor(hourIndex / 24) + 1,
  };
}

function monthName(index) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index - 1];
}

function buildPvWattsUrl(site, config, apiKey) {
  const params = new URLSearchParams({
    api_key: apiKey,
    system_capacity: String(site.system_capacity_kw),
    module_type: String(config.pvwatts.module_type),
    losses: String(config.pvwatts.losses),
    array_type: String(config.pvwatts.array_type),
    tilt: String(site.tilt ?? config.pvwatts.tilt),
    azimuth: String(site.azimuth ?? config.pvwatts.azimuth),
    lat: String(site.latitude),
    lon: String(site.longitude),
    dataset: site.dataset || "nsrdb",
    radius: String(config.pvwatts.radius),
    timeframe: config.pvwatts.timeframe,
    dc_ac_ratio: String(config.pvwatts.dc_ac_ratio),
    inv_eff: String(config.pvwatts.inv_eff),
    gcr: String(config.pvwatts.gcr),
  });
  return `${PVWATTS_ENDPOINT}?${params.toString()}`;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let raw = "";
      response.on("data", (chunk) => {
        raw += chunk;
      });
      response.on("end", () => {
        try {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}: ${raw.slice(0, 200)}`));
            return;
          }
          resolve(JSON.parse(raw));
        } catch (error) {
          reject(new Error(`NREL JSON parse failed: ${error.message}`));
        }
      });
    });
    request.setTimeout(30_000, () => {
      request.destroy(new Error("NREL PVWatts request timed out"));
    });
    request.on("error", reject);
  });
}

async function fetchPvWattsSite(site, config, apiKey) {
  const payload = await fetchJson(buildPvWattsUrl(site, config, apiKey));
  if (payload.errors?.length) {
    throw new Error(`NREL PVWatts returned errors for ${site.id}: ${payload.errors.join("; ")}`);
  }
  return payload;
}

function dailyRowsFromPvWatts(site, payload, spkConfig = DEFAULT_CONFIG.spk) {
  const outputs = payload.outputs || {};
  const ac = outputs.ac || [];
  const poa = outputs.poa || [];
  const tamb = outputs.tamb || [];
  const wspd = outputs.wspd || [];
  if (ac.length !== 8760) {
    throw new Error(`Expected 8760 hourly AC values for ${site.id}; received ${ac.length}`);
  }

  const rows = [];
  for (let start = 0; start < ac.length; start += 24) {
    const hours = ac.slice(start, start + 24);
    const poaHours = poa.slice(start, start + 24);
    const tempHours = tamb.slice(start, start + 24);
    const windHours = wspd.slice(start, start + 24);
    const dateInfo = monthDayFromHour(start);
    const acKwh = sum(hours) / 1000;
    const poaKwhM2 = sum(poaHours) / 1000;
    rows.push({
      site_id: site.id,
      site_label: site.label,
      model_date: dateInfo.date,
      month_day: dateInfo.month_day,
      month: dateInfo.month,
      day_of_year: dateInfo.day_of_year,
      system_capacity_kw: site.system_capacity_kw,
      modeled_ac_kwh: fixed(acKwh, 4),
      modeled_poa_kwh_m2: fixed(poaKwhM2, 4),
      modeled_capacity_factor: fixed(acKwh / (site.system_capacity_kw * 24), 6),
      average_temperature_c: fixed(average(tempHours), 3),
      average_wind_m_s: fixed(average(windHours), 3),
      model_spk_generation_ceiling: fixed(acKwh * spkConfig.net_spk_per_kwh_after_mint_fee, 6),
    });
  }
  return rows;
}

function monthlyRowsFromDaily(dailyRows) {
  const months = new Map();
  for (const row of dailyRows) {
    const bucket = months.get(row.month) || [];
    bucket.push(row);
    months.set(row.month, bucket);
  }
  return [...months.entries()].sort(([a], [b]) => a - b).map(([month, rows]) => ({
    month,
    label: monthName(month),
    modeled_ac_kwh: fixed(sum(rows.map((row) => row.modeled_ac_kwh)), 4),
    modeled_poa_kwh_m2: fixed(sum(rows.map((row) => row.modeled_poa_kwh_m2)), 4),
    average_daily_ac_kwh: fixed(average(rows.map((row) => row.modeled_ac_kwh)), 4),
    average_daily_capacity_factor: fixed(average(rows.map((row) => row.modeled_capacity_factor)), 6),
  }));
}

function summarizeSite(site, payload, dailyRows) {
  const outputs = payload.outputs || {};
  const annualAc = Number(outputs.ac_annual || sum(dailyRows.map((row) => row.modeled_ac_kwh)));
  const monthly = monthlyRowsFromDaily(dailyRows);
  const bestDay = dailyRows.reduce((best, row) => (row.modeled_ac_kwh > best.modeled_ac_kwh ? row : best), dailyRows[0]);
  const worstDay = dailyRows.reduce((worst, row) => (row.modeled_ac_kwh < worst.modeled_ac_kwh ? row : worst), dailyRows[0]);
  return {
    id: site.id,
    label: site.label,
    latitude: site.latitude,
    longitude: site.longitude,
    system_capacity_kw: site.system_capacity_kw,
    dataset: site.dataset || "nsrdb",
    market_note: site.market_note,
    annual_ac_kwh: fixed(annualAc, 4),
    annual_capacity_factor_pct: fixed(Number(outputs.capacity_factor), 4),
    daily_rows: dailyRows.length,
    best_day: {
      month_day: bestDay.month_day,
      modeled_ac_kwh: bestDay.modeled_ac_kwh,
    },
    worst_day: {
      month_day: worstDay.month_day,
      modeled_ac_kwh: worstDay.modeled_ac_kwh,
    },
    station_info: {
      weather_data_source: payload.station_info?.weather_data_source || "unknown",
      solar_resource_file: payload.station_info?.solar_resource_file || "unknown",
      station_latitude: fixed(payload.station_info?.lat, 6),
      station_longitude: fixed(payload.station_info?.lon, 6),
      distance_m: payload.station_info?.distance ?? null,
    },
    monthly,
  };
}

function operatorCrosscheck(operatorData, dailyRows, siteId = "taoyuan_10kw") {
  const modelRows = new Map(dailyRows.filter((row) => row.site_id === siteId).map((row) => [row.month_day, row]));
  const compared = (operatorData.daily_rows || []).map((row) => {
    const monthDay = String(row.window_start || "").slice(5, 10);
    const model = modelRows.get(monthDay);
    if (!model) return null;
    const reported = Number(row.generation_kwh || 0);
    const modelKwh = Number(model.modeled_ac_kwh || 0);
    const deviationPct = modelKwh > 0 ? ((reported - modelKwh) / modelKwh) * 100 : null;
    return {
      date: String(row.window_start || "").slice(0, 10),
      month_day: monthDay,
      reported_generation_kwh: fixed(reported, 4),
      nrel_modeled_ac_kwh: fixed(modelKwh, 4),
      deviation_pct: fixed(deviationPct, 4),
    };
  }).filter(Boolean);

  return {
    site_id: siteId,
    rows_compared: compared.length,
    average_deviation_pct: fixed(average(compared.map((row) => row.deviation_pct)), 4),
    average_absolute_deviation_pct: fixed(average(compared.map((row) => Math.abs(Number(row.deviation_pct)))), 4),
    compared_rows: compared,
    interpretation: "Compares current operator sample dates against the Taoyuan NREL/PVWatts TMY baseline by month/day. This is a plausibility check, not real metering proof.",
  };
}

function buildReport({ config = DEFAULT_CONFIG, responses, now = new Date(), operatorData = null }) {
  const allDailyRows = [];
  const siteSummaries = [];

  for (const site of config.sites) {
    const payload = responses[site.id];
    if (!payload) throw new Error(`Missing PVWatts response for site ${site.id}`);
    const dailyRows = dailyRowsFromPvWatts(site, payload, config.spk);
    allDailyRows.push(...dailyRows);
    siteSummaries.push(summarizeSite(site, payload, dailyRows));
  }

  const annualOutputs = siteSummaries.map((site) => site.annual_ac_kwh);
  const report = {
    generated_at: now.toISOString(),
    title: "NREL Solar Training Lab",
    purpose: "Build a sanitized PVWatts/NSRDB baseline dataset for SPK claim scoring, forecasting, and future model training.",
    source: {
      provider: "NREL/NLR PVWatts V8",
      endpoint: PVWATTS_ENDPOINT,
      api_key_written_to_artifact: false,
      requested_timeframe: config.pvwatts.timeframe,
      model_basis: "PVWatts V8 hourly AC output from NREL/NLR solar resource datasets.",
    },
    assumptions: {
      module_type: config.pvwatts.module_type,
      losses_pct: config.pvwatts.losses,
      array_type: config.pvwatts.array_type,
      tilt_degrees: config.pvwatts.tilt,
      azimuth_degrees: config.pvwatts.azimuth,
      dc_ac_ratio: config.pvwatts.dc_ac_ratio,
      inverter_efficiency_pct: config.pvwatts.inv_eff,
      net_spk_per_kwh_after_mint_fee: config.spk.net_spk_per_kwh_after_mint_fee,
    },
    summary: {
      sites: siteSummaries.length,
      training_rows: allDailyRows.length,
      annual_ac_kwh_min: fixed(Math.min(...annualOutputs), 4),
      annual_ac_kwh_max: fixed(Math.max(...annualOutputs), 4),
      annual_ac_kwh_average: fixed(average(annualOutputs), 4),
      training_stage: "public_model_baseline_ready",
    },
    sites: siteSummaries,
    operator_crosscheck: operatorData ? operatorCrosscheck(operatorData, allDailyRows) : null,
    training_rows: allDailyRows,
    hard_boundaries: [
      "NREL/PVWatts output is modeled solar production, not signed meter data.",
      "This artifact is appropriate for training baselines, forecasts, anomaly thresholds, and reviewer demos.",
      "It cannot authorize real-value SPK minting without signed operator meter or inverter attestations.",
      "The NREL API key is supplied only at runtime and is not written into repo artifacts.",
    ],
  };
  return report;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# NREL Solar Training Lab");
  lines.push("");
  lines.push(report.purpose);
  lines.push("");
  lines.push("## Result");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- training_stage: \`${report.summary.training_stage}\``);
  lines.push(`- sites: \`${report.summary.sites}\``);
  lines.push(`- daily training rows: \`${report.summary.training_rows}\``);
  lines.push(`- annual AC range: \`${report.summary.annual_ac_kwh_min}-${report.summary.annual_ac_kwh_max} kWh\``);
  lines.push(`- api_key_written_to_artifact: \`${report.source.api_key_written_to_artifact}\``);
  lines.push("");
  lines.push("## Site Baselines");
  lines.push("");
  lines.push("| Site | Dataset | Annual AC kWh | Capacity factor | Weather source |");
  lines.push("|---|---|---:|---:|---|");
  for (const site of report.sites) {
    lines.push(`| ${site.label} | ${site.dataset} | ${site.annual_ac_kwh} | ${site.annual_capacity_factor_pct}% | ${site.station_info.weather_data_source} |`);
  }
  lines.push("");
  if (report.operator_crosscheck) {
    lines.push("## Operator Sample Crosscheck");
    lines.push("");
    lines.push(`- rows_compared: \`${report.operator_crosscheck.rows_compared}\``);
    lines.push(`- average_deviation_pct: \`${report.operator_crosscheck.average_deviation_pct}%\``);
    lines.push(`- average_absolute_deviation_pct: \`${report.operator_crosscheck.average_absolute_deviation_pct}%\``);
    lines.push("");
    lines.push("| Date | Reported kWh | NREL modeled kWh | Deviation |");
    lines.push("|---|---:|---:|---:|");
    for (const row of report.operator_crosscheck.compared_rows) {
      lines.push(`| ${row.date} | ${row.reported_generation_kwh} | ${row.nrel_modeled_ac_kwh} | ${row.deviation_pct}% |`);
    }
    lines.push("");
  }
  lines.push("## Monthly Baselines");
  lines.push("");
  for (const site of report.sites) {
    lines.push(`### ${site.label}`);
    lines.push("");
    lines.push("| Month | AC kWh | Avg daily AC kWh | Avg capacity factor |");
    lines.push("|---|---:|---:|---:|");
    for (const month of site.monthly) {
      lines.push(`| ${month.label} | ${month.modeled_ac_kwh} | ${month.average_daily_ac_kwh} | ${month.average_daily_capacity_factor} |`);
    }
    lines.push("");
  }
  lines.push("## Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NREL_API_KEY. Run as: NREL_API_KEY=... npm run product:nrel-training");
  }

  const responses = {};
  for (const site of DEFAULT_CONFIG.sites) {
    responses[site.id] = await fetchPvWattsSite(site, DEFAULT_CONFIG, apiKey);
  }

  const operatorData = readJson("state/product/operator_data_intake.json", null);
  const report = buildReport({ config: DEFAULT_CONFIG, responses, operatorData });
  const jsonPath = path.join(ROOT, "state", "product", "nrel_solar_training_lab.json");
  const mdPath = path.join(ROOT, "docs", "product", "NREL_SOLAR_TRAINING_LAB.md");
  writeJson(jsonPath, report);
  writeText(mdPath, toMarkdown(report));
  console.log(`nrel_training_stage=${report.summary.training_stage}`);
  console.log(`sites=${report.summary.sites}`);
  console.log(`training_rows=${report.summary.training_rows}`);
  console.log(`annual_ac_range=${report.summary.annual_ac_kwh_min}-${report.summary.annual_ac_kwh_max}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  DEFAULT_CONFIG,
  buildReport,
  dailyRowsFromPvWatts,
  monthDayFromHour,
  operatorCrosscheck,
  summarizeSite,
};

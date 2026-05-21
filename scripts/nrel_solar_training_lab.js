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

const DEFAULT_MAP_CONFIG = {
  ...DEFAULT_CONFIG,
  map: {
    annual_energy_value_usd_per_kwh: 0.05,
  },
  sites: [
    ...DEFAULT_CONFIG.sites,
    {
      id: "los_angeles_10kw",
      label: "Los Angeles 10 kW rooftop",
      region: "US West Coast",
      latitude: 34.0522,
      longitude: -118.2437,
      system_capacity_kw: 10,
      dataset: "nsrdb",
      market_note: "Large distributed-solar market with strong visual demo relevance.",
    },
    {
      id: "new_york_10kw",
      label: "New York 10 kW rooftop",
      region: "US Northeast",
      latitude: 40.7128,
      longitude: -74.0060,
      system_capacity_kw: 10,
      dataset: "nsrdb",
      market_note: "Lower-resource dense-load benchmark for urban adoption cases.",
    },
    {
      id: "berlin_10kw",
      label: "Berlin 10 kW rooftop",
      region: "Europe",
      latitude: 52.52,
      longitude: 13.405,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "European energy-transition benchmark with weaker solar resource but strong policy relevance.",
    },
    {
      id: "singapore_10kw",
      label: "Singapore 10 kW rooftop",
      region: "Southeast Asia",
      latitude: 1.3521,
      longitude: 103.8198,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "Equatorial dense-city benchmark where roof area and load profile matter.",
    },
    {
      id: "tokyo_10kw",
      label: "Tokyo 10 kW rooftop",
      region: "East Asia",
      latitude: 35.6762,
      longitude: 139.6503,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "Large high-load city benchmark near the current Asia reference geography.",
    },
    {
      id: "sydney_10kw",
      label: "Sydney 10 kW rooftop",
      region: "Australia",
      latitude: -33.8688,
      longitude: 151.2093,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "Residential rooftop-solar market benchmark for public-data and pilot comparisons.",
    },
    {
      id: "nairobi_10kw",
      label: "Nairobi 10 kW rooftop",
      region: "East Africa",
      latitude: -1.2921,
      longitude: 36.8219,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "High-growth distributed-energy benchmark with strong resource quality.",
    },
    {
      id: "dubai_10kw",
      label: "Dubai 10 kW rooftop",
      region: "Middle East",
      latitude: 25.2048,
      longitude: 55.2708,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "High-solar stress benchmark for upper-bound SPK map scenarios.",
    },
    {
      id: "sao_paulo_10kw",
      label: "Sao Paulo 10 kW rooftop",
      region: "South America",
      latitude: -23.5558,
      longitude: -46.6396,
      system_capacity_kw: 10,
      dataset: "intl",
      market_note: "Large-market Southern Hemisphere benchmark with moderate solar output.",
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

function productionTier(annualAcKwh) {
  const value = Number(annualAcKwh);
  if (value >= 16_000) return "high_solar";
  if (value >= 13_000) return "strong_solar";
  if (value >= 11_000) return "moderate_solar";
  return "lower_solar";
}

function mapPosition(latitude, longitude) {
  return {
    x_pct: fixed(((Number(longitude) + 180) / 360) * 100, 3),
    y_pct: fixed(((90 - Number(latitude)) / 180) * 100, 3),
  };
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

function buildMapScenarioReport({ config = DEFAULT_MAP_CONFIG, responses, now = new Date() }) {
  const mapPoints = [];

  for (const site of config.sites) {
    const payload = responses[site.id];
    if (!payload) throw new Error(`Missing PVWatts response for map site ${site.id}`);
    const dailyRows = dailyRowsFromPvWatts(site, payload, config.spk);
    const summary = summarizeSite(site, payload, dailyRows);
    const bestMonth = summary.monthly.reduce((best, row) => (
      Number(row.modeled_ac_kwh) > Number(best.modeled_ac_kwh) ? row : best
    ), summary.monthly[0]);
    const worstMonth = summary.monthly.reduce((worst, row) => (
      Number(row.modeled_ac_kwh) < Number(worst.modeled_ac_kwh) ? row : worst
    ), summary.monthly[0]);
    const annualAc = Number(summary.annual_ac_kwh);
    const tier = productionTier(annualAc);
    const position = mapPosition(site.latitude, site.longitude);

    mapPoints.push({
      id: site.id,
      label: site.label,
      region: site.region || "reference",
      latitude: site.latitude,
      longitude: site.longitude,
      system_capacity_kw: site.system_capacity_kw,
      dataset: site.dataset || "nsrdb",
      annual_ac_kwh: summary.annual_ac_kwh,
      average_daily_ac_kwh: fixed(annualAc / 365, 4),
      annual_capacity_factor_pct: summary.annual_capacity_factor_pct,
      modeled_spk_ceiling_if_all_exported: fixed(annualAc * config.spk.net_spk_per_kwh_after_mint_fee, 6),
      modeled_energy_value_usd_at_5c: fixed(annualAc * config.map.annual_energy_value_usd_per_kwh, 2),
      best_month: {
        label: bestMonth.label,
        modeled_ac_kwh: bestMonth.modeled_ac_kwh,
      },
      worst_month: {
        label: worstMonth.label,
        modeled_ac_kwh: worstMonth.modeled_ac_kwh,
      },
      weather_data_source: summary.station_info.weather_data_source,
      solar_resource_file: summary.station_info.solar_resource_file,
      production_tier: tier,
      map_position: position,
      market_note: site.market_note,
    });
  }

  const annualOutputs = mapPoints.map((point) => Number(point.annual_ac_kwh));
  const sorted = [...mapPoints].sort((a, b) => Number(b.annual_ac_kwh) - Number(a.annual_ac_kwh));
  return {
    generated_at: now.toISOString(),
    title: "NREL Solar Map Scenarios",
    purpose: "Compact map-ready PVWatts scenarios for the frontend: one modeled 10 kW rooftop point per geography, without storing full hourly or daily traces.",
    source: {
      provider: "NREL/NLR PVWatts V8",
      endpoint: PVWATTS_ENDPOINT,
      api_key_written_to_artifact: false,
      model_basis: "PVWatts V8 hourly AC output summarized into compact site-level map points.",
    },
    assumptions: {
      system_capacity_kw: 10,
      module_type: config.pvwatts.module_type,
      losses_pct: config.pvwatts.losses,
      array_type: config.pvwatts.array_type,
      tilt_degrees: config.pvwatts.tilt,
      azimuth_degrees: config.pvwatts.azimuth,
      dc_ac_ratio: config.pvwatts.dc_ac_ratio,
      inverter_efficiency_pct: config.pvwatts.inv_eff,
      net_spk_per_kwh_after_mint_fee: config.spk.net_spk_per_kwh_after_mint_fee,
      energy_value_usd_per_kwh: config.map.annual_energy_value_usd_per_kwh,
    },
    summary: {
      map_points: mapPoints.length,
      annual_ac_kwh_min: fixed(Math.min(...annualOutputs), 4),
      annual_ac_kwh_max: fixed(Math.max(...annualOutputs), 4),
      annual_ac_kwh_average: fixed(average(annualOutputs), 4),
      strongest_site: sorted[0]?.id || null,
      weakest_site: sorted[sorted.length - 1]?.id || null,
      frontend_stage: "map_simulation_ready",
    },
    map_points: mapPoints,
    hard_boundaries: [
      "Map points are modeled 10 kW rooftop scenarios, not real customer sites.",
      "Modeled SPK ceiling assumes all generated kWh is export-eligible; real SPK requires signed surplus meter data.",
      "This compact artifact is intended for frontend simulation and reviewer explanation, not mint authorization.",
      "The NREL API key is supplied only at runtime and is not written into repo artifacts.",
    ],
  };
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

function mapScenariosToMarkdown(report) {
  const lines = [];
  lines.push("# NREL Solar Map Scenarios");
  lines.push("");
  lines.push(report.purpose);
  lines.push("");
  lines.push("## Result");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- frontend_stage: \`${report.summary.frontend_stage}\``);
  lines.push(`- map_points: \`${report.summary.map_points}\``);
  lines.push(`- annual AC range: \`${report.summary.annual_ac_kwh_min}-${report.summary.annual_ac_kwh_max} kWh\``);
  lines.push(`- strongest_site: \`${report.summary.strongest_site}\``);
  lines.push(`- weakest_site: \`${report.summary.weakest_site}\``);
  lines.push(`- api_key_written_to_artifact: \`${report.source.api_key_written_to_artifact}\``);
  lines.push("");
  lines.push("## Map Points");
  lines.push("");
  lines.push("| Site | Region | Annual AC kWh | SPK ceiling | Value at $0.05/kWh | Tier | Weather source |");
  lines.push("|---|---|---:|---:|---:|---|---|");
  for (const point of report.map_points) {
    lines.push(`| ${point.label} | ${point.region} | ${point.annual_ac_kwh} | ${point.modeled_spk_ceiling_if_all_exported} | $${point.modeled_energy_value_usd_at_5c} | \`${point.production_tier}\` | ${point.weather_data_source} |`);
  }
  lines.push("");
  lines.push("## Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  return lines.join("\n");
}

async function fetchResponsesForSites(sites, config, apiKey) {
  const responses = {};
  for (const site of sites) {
    responses[site.id] = await fetchPvWattsSite(site, config, apiKey);
  }
  return responses;
}

async function main() {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NREL_API_KEY. Run as: NREL_API_KEY=... npm run product:nrel-training or npm run product:nrel-map");
  }

  if (process.argv.includes("--map-pack")) {
    const responses = await fetchResponsesForSites(DEFAULT_MAP_CONFIG.sites, DEFAULT_MAP_CONFIG, apiKey);
    const report = buildMapScenarioReport({ config: DEFAULT_MAP_CONFIG, responses });
    const jsonPath = path.join(ROOT, "state", "product", "nrel_solar_map_scenarios.json");
    const mdPath = path.join(ROOT, "docs", "product", "NREL_SOLAR_MAP_SCENARIOS.md");
    writeJson(jsonPath, report);
    writeText(mdPath, mapScenariosToMarkdown(report));
    console.log(`nrel_map_stage=${report.summary.frontend_stage}`);
    console.log(`map_points=${report.summary.map_points}`);
    console.log(`annual_ac_range=${report.summary.annual_ac_kwh_min}-${report.summary.annual_ac_kwh_max}`);
    console.log(`wrote: ${jsonPath}`);
    console.log(`wrote: ${mdPath}`);
    return;
  }

  const responses = await fetchResponsesForSites(DEFAULT_CONFIG.sites, DEFAULT_CONFIG, apiKey);

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
  DEFAULT_MAP_CONFIG,
  buildMapScenarioReport,
  buildReport,
  dailyRowsFromPvWatts,
  mapPosition,
  productionTier,
  monthDayFromHour,
  operatorCrosscheck,
  summarizeSite,
};

const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const DEFAULT_CONFIG = {
  location: {
    name: "Taoyuan, Taiwan",
    latitude: 24.99,
    longitude: 121.30,
  },
  nasa: {
    start: "20260501",
    end: "20260511",
    parameters: ["ALLSKY_SFC_SW_DWN", "WS10M", "T2M"],
    community: "RE",
  },
  solar: {
    system_kw_dc: 10,
    module_efficiency: 0.20,
    pvwatts_loss_pct: 14,
    residential_installed_cost_usd_per_wdc: 3.15,
    mint_fee_bps: 10,
    lab_energy_price_usd_per_kwh: 0.05,
    price_sensitivity_usd_per_kwh: [0.05, 0.10, 0.20],
  },
  wind: {
    air_density_kg_m3: 1.225,
    power_coefficient: 0.35,
    availability: 0.90,
    wind_shear_alpha: 0.14,
    reference_height_m: 10,
    hub_height_m: 30,
    swept_area_m2: 50,
  },
  benchmark_capacity_kw: 10,
  oil: {
    crude_oil_btu_per_barrel: 5_800_000,
    btu_to_kwh: 0.00029307107,
    electric_conversion_efficiency: 0.33,
  },
};

function mergeConfig(overrides = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    location: { ...DEFAULT_CONFIG.location, ...(overrides.location || {}) },
    nasa: { ...DEFAULT_CONFIG.nasa, ...(overrides.nasa || {}) },
    solar: { ...DEFAULT_CONFIG.solar, ...(overrides.solar || {}) },
    wind: { ...DEFAULT_CONFIG.wind, ...(overrides.wind || {}) },
    oil: { ...DEFAULT_CONFIG.oil, ...(overrides.oil || {}) },
  };
}

function readJson(relativePath, fallback = null) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
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

function isValidPowerValue(value) {
  return Number.isFinite(Number(value)) && Number(value) > -900;
}

function isoDateFromNasaKey(key) {
  return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

function seriesFromParameter(nasaData, parameter) {
  const raw = nasaData?.properties?.parameter?.[parameter] || {};
  return Object.entries(raw)
    .filter(([, value]) => isValidPowerValue(value))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      date: isoDateFromNasaKey(date),
      value: Number(value),
    }));
}

function latestPoint(series) {
  if (!series.length) return null;
  return series[series.length - 1];
}

function buildNasaUrl(config) {
  const params = config.nasa.parameters.join(",");
  return `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=${encodeURIComponent(params)}` +
    `&community=${config.nasa.community}` +
    `&longitude=${config.location.longitude}` +
    `&latitude=${config.location.latitude}` +
    `&start=${config.nasa.start}` +
    `&end=${config.nasa.end}` +
    `&format=JSON`;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchJson(res.headers.location).then(resolve, reject);
        return;
      }

      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        try {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 200)}`));
            return;
          }
          resolve(JSON.parse(raw));
        } catch (error) {
          reject(new Error(`JSON parse failed: ${error.message}`));
        }
      });
    });
    req.setTimeout(20_000, () => {
      req.destroy(new Error("NASA POWER request timed out"));
    });
    req.on("error", reject);
  });
}

function fallbackNasaDataFromKeeper() {
  const summary = readJson("state/keeper_logs/summary.json", {});
  const latestDate = summary.latest_run?.date || "2026-05-16";
  const latest = readJson(`state/keeper_logs/${latestDate}.json`, {});
  const nasaDate = String(latest.nasa?.date || "").replaceAll("-", "");
  const ghi = latest.nasa?.ghi_kwh_m2;
  if (!nasaDate || !isValidPowerValue(ghi)) {
    throw new Error("No usable keeper fallback found for resource benchmark lab");
  }
  return {
    properties: {
      parameter: {
        ALLSKY_SFC_SW_DWN: { [nasaDate]: Number(ghi) },
        WS10M: {},
        T2M: {},
      },
    },
    fallback: {
      source: `state/keeper_logs/${latestDate}.json`,
      reason: "NASA POWER live request failed; solar-only keeper fallback used.",
    },
  };
}

function nasaGridCellEstimate(location) {
  const cellDegrees = 0.5;
  const latKm = 111.32 * cellDegrees;
  const lonKm = 111.32 * Math.cos((location.latitude * Math.PI) / 180) * cellDegrees;
  return {
    source_resolution_note: "NASA POWER Daily API docs warn that repeated point requests map to a 0.5 degree by 0.5 degree global grid cell.",
    assumed_cell_degrees: cellDegrees,
    approximate_latitude_span_km: fixed(latKm, 2),
    approximate_longitude_span_km: fixed(lonKm, 2),
    approximate_cell_area_km2: fixed(latKm * lonKm, 2),
  };
}

function calculateSolar(ghiSeries, config) {
  const latest = latestPoint(ghiSeries);
  const avgGhi = average(ghiSeries.map((point) => point.value));
  const performanceRatio = 1 - config.solar.pvwatts_loss_pct / 100;
  const panelAreaM2 = config.solar.system_kw_dc / config.solar.module_efficiency;
  const latestDailyKwh = latest ? latest.value * config.solar.system_kw_dc * performanceRatio : null;
  const averageDailyKwh = avgGhi ? avgGhi * config.solar.system_kw_dc * performanceRatio : null;
  const annualizedKwh = averageDailyKwh ? averageDailyKwh * 365 : null;
  const installedCostUsd =
    config.solar.system_kw_dc * 1000 * config.solar.residential_installed_cost_usd_per_wdc;
  const mintMultiplier = 1 - config.solar.mint_fee_bps / 10_000;

  const priceSensitivity = config.solar.price_sensitivity_usd_per_kwh.map((price) => {
    const annualRevenue = annualizedKwh ? annualizedKwh * price : null;
    return {
      energy_price_usd_per_kwh: price,
      latest_day_value_usd: fixed(latestDailyKwh ? latestDailyKwh * price : null, 4),
      latest_day_spk_after_mint_fee: fixed(latestDailyKwh ? latestDailyKwh * price * mintMultiplier : null, 4),
      annualized_value_usd: fixed(annualRevenue, 2),
      simple_capex_payback_years_before_incentives: fixed(
        annualRevenue && annualRevenue > 0 ? installedCostUsd / annualRevenue : null,
        2
      ),
    };
  });

  return {
    evidence_status: "measured_resource_estimate",
    measured_input: true,
    source_parameter: "NASA POWER ALLSKY_SFC_SW_DWN",
    conversion_model:
      "daily_ac_kwh = NASA_GHI_kWh_m2_day * system_kWdc * (1 - PVWatts_loss_pct)",
    standard_system: {
      system_kw_dc: config.solar.system_kw_dc,
      module_efficiency: config.solar.module_efficiency,
      module_efficiency_pct: fixed(config.solar.module_efficiency * 100, 2),
      panel_area_m2: fixed(panelAreaM2, 2),
      panel_area_formula: "area_m2 = kWdc / module_efficiency, assuming 1 kW/m2 STC irradiance",
      pvwatts_loss_pct: config.solar.pvwatts_loss_pct,
      performance_ratio: fixed(performanceRatio, 4),
    },
    nasa_window: {
      days: ghiSeries.length,
      latest_date: latest?.date || null,
      latest_ghi_kwh_m2_day: fixed(latest?.value, 4),
      average_ghi_kwh_m2_day: fixed(avgGhi, 4),
    },
    production_estimate: {
      latest_day_ac_kwh: fixed(latestDailyKwh, 4),
      average_window_day_ac_kwh: fixed(averageDailyKwh, 4),
      annualized_ac_kwh_from_window_average: fixed(annualizedKwh, 2),
    },
    cost_model: {
      residential_installed_cost_usd_per_wdc_assumption: config.solar.residential_installed_cost_usd_per_wdc,
      installed_cost_usd_before_incentives: fixed(installedCostUsd, 2),
      source_note: "Uses the DOE/NREL Q1 2024 residential PV benchmark as an assumption, not a quote.",
    },
    spk_value_model: {
      mint_fee_bps: config.solar.mint_fee_bps,
      can_mint_from_model_estimate: false,
      mint_rule:
        "NASA/PVWatts-style production estimates can size the opportunity, but SPK minting still requires accepted signed meter or inverter surplus attestations.",
      price_sensitivity: priceSensitivity,
    },
  };
}

function calculateWind(ws10Series, config) {
  const latest = latestPoint(ws10Series);
  const avgWs10 = average(ws10Series.map((point) => point.value));

  function outputAtSpeed(speed10m) {
    if (!Number.isFinite(Number(speed10m))) return null;
    const hubSpeed = speed10m * (config.wind.hub_height_m / config.wind.reference_height_m) ** config.wind.wind_shear_alpha;
    const rawPowerDensityWm2 = 0.5 * config.wind.air_density_kg_m3 * hubSpeed ** 3;
    const recoverablePowerDensityWm2 =
      rawPowerDensityWm2 * config.wind.power_coefficient * config.wind.availability;
    return {
      wind_speed_10m_ms: fixed(speed10m, 4),
      wind_speed_hub_height_ms: fixed(hubSpeed, 4),
      raw_power_density_w_m2: fixed(rawPowerDensityWm2, 4),
      recoverable_power_density_w_m2: fixed(recoverablePowerDensityWm2, 4),
      recoverable_kwh_per_swept_m2_day: fixed((recoverablePowerDensityWm2 * 24) / 1000, 6),
      recoverable_kwh_day_for_assumed_swept_area: fixed(
        (recoverablePowerDensityWm2 * config.wind.swept_area_m2 * 24) / 1000,
        4
      ),
    };
  }

  return {
    evidence_status: ws10Series.length ? "measured_resource_density" : "site_data_required",
    measured_input: ws10Series.length > 0,
    source_parameter: "NASA POWER WS10M",
    conversion_model:
      "recoverable_power_density = 0.5 * air_density * wind_speed_hub_height^3 * Cp * availability",
    assumptions: {
      air_density_kg_m3: config.wind.air_density_kg_m3,
      power_coefficient: config.wind.power_coefficient,
      availability: config.wind.availability,
      wind_shear_alpha: config.wind.wind_shear_alpha,
      reference_height_m: config.wind.reference_height_m,
      hub_height_m: config.wind.hub_height_m,
      swept_area_m2: config.wind.swept_area_m2,
    },
    nasa_window: {
      days: ws10Series.length,
      latest_date: latest?.date || null,
      average_ws10m_ms: fixed(avgWs10, 4),
    },
    latest_day: outputAtSpeed(latest?.value),
    average_window_day: outputAtSpeed(avgWs10),
    spk_bridge:
      "Wind is SPK-eligible only after a real turbine/meter produces signed generation/export readings; NASA wind speed is resource evidence, not mint evidence.",
  };
}

function capacityFactorBenchmark(id, label, capacityFactor, status, note) {
  const dailyKwh = DEFAULT_CONFIG.benchmark_capacity_kw * 24 * capacityFactor;
  return {
    id,
    label,
    type: "renewable_benchmark",
    evidence_status: status,
    measured_input: false,
    benchmark_capacity_kw: DEFAULT_CONFIG.benchmark_capacity_kw,
    assumed_capacity_factor: capacityFactor,
    benchmark_output_kwh_day: fixed(dailyKwh, 4),
    annualized_output_kwh: fixed(dailyKwh * 365, 2),
    mint_eligibility: "eligible_after_signed_meter_attestation_and_resource_policy",
    can_mint_from_model_estimate: false,
    next_data_needed: note,
  };
}

function oilBenchmark(config) {
  const thermalKwh = config.oil.crude_oil_btu_per_barrel * config.oil.btu_to_kwh;
  const electricKwh = thermalKwh * config.oil.electric_conversion_efficiency;
  return {
    id: "oil_barrel",
    label: "Crude oil benchmark",
    type: "fossil_benchmark_only",
    evidence_status: "unit_conversion_benchmark",
    measured_input: false,
    btu_per_barrel_assumption: config.oil.crude_oil_btu_per_barrel,
    kwh_thermal_per_barrel: fixed(thermalKwh, 2),
    assumed_electric_conversion_efficiency: config.oil.electric_conversion_efficiency,
    kwh_electric_equivalent_at_assumed_efficiency: fixed(electricKwh, 2),
    mint_eligibility: "not_eligible",
    can_mint_from_model_estimate: false,
    policy_reason: "Oil is included only to compare energy units and fossil baselines; it is not renewable and cannot mint SPK.",
  };
}

function buildResourceBenchmarkLab(options = {}) {
  const config = mergeConfig(options.config || {});
  const nasaData = options.nasaData || {};
  const ghiSeries = seriesFromParameter(nasaData, "ALLSKY_SFC_SW_DWN");
  const ws10Series = seriesFromParameter(nasaData, "WS10M");
  const tempSeries = seriesFromParameter(nasaData, "T2M");
  const solar = calculateSolar(ghiSeries, config);
  const wind = calculateWind(ws10Series, config);
  const oil = oilBenchmark(config);

  const benchmarkResources = [
    {
      id: "solar_pv_rooftop",
      label: "Solar PV rooftop",
      type: "renewable_measured_estimate",
      evidence_status: solar.evidence_status,
      measured_input: solar.measured_input,
      benchmark_output_kwh_day: solar.production_estimate.latest_day_ac_kwh,
      annualized_output_kwh: solar.production_estimate.annualized_ac_kwh_from_window_average,
      installed_cost_usd_before_incentives: solar.cost_model.installed_cost_usd_before_incentives,
      mint_eligibility: "eligible_after_signed_meter_attestation",
      can_mint_from_model_estimate: false,
      next_data_needed: "Real inverter or revenue-grade meter export for the same site.",
    },
    {
      id: "wind_turbine",
      label: "Wind turbine",
      type: "renewable_resource_density",
      evidence_status: wind.evidence_status,
      measured_input: wind.measured_input,
      benchmark_output_kwh_day: wind.average_window_day?.recoverable_kwh_day_for_assumed_swept_area || null,
      annualized_output_kwh: wind.average_window_day
        ? fixed(wind.average_window_day.recoverable_kwh_day_for_assumed_swept_area * 365, 2)
        : null,
      mint_eligibility: "eligible_after_signed_meter_attestation",
      can_mint_from_model_estimate: false,
      next_data_needed: "Turbine power curve, hub-height wind study, and metered generation/export.",
    },
    capacityFactorBenchmark(
      "geothermal",
      "Geothermal",
      0.90,
      "dispatchable_benchmark_only",
      "Site reservoir data, plant technology, interconnection, and metered generation."
    ),
    capacityFactorBenchmark(
      "tidal",
      "Tidal / marine",
      0.35,
      "site_resource_required",
      "Bathymetry, tidal-current measurements, permits, turbine curve, and metered generation."
    ),
    capacityFactorBenchmark(
      "hydro",
      "Small hydro",
      0.50,
      "site_resource_required",
      "Flow-duration curve, head, permits, turbine curve, and metered generation."
    ),
    capacityFactorBenchmark(
      "biogas_biomass",
      "Biogas / biomass",
      0.80,
      "fuel_chain_required",
      "Renewable fuel provenance, emissions boundary, generator metering, and policy review."
    ),
    oil,
  ];

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Multi-Resource Benchmark Lab",
    thesis:
      "Expand SPK from a solar-only narrative into a measured renewable-resource framework while preserving the rule that only signed surplus-energy attestations can mint.",
    location: config.location,
    data_fetch: {
      status: options.fetchStatus || "provided",
      nasa_url: options.nasaUrl || buildNasaUrl(config),
      requested_parameters: config.nasa.parameters,
      requested_start: isoDateFromNasaKey(config.nasa.start),
      requested_end: isoDateFromNasaKey(config.nasa.end),
      observations: {
        ghi_days: ghiSeries.length,
        ws10m_days: ws10Series.length,
        t2m_days: tempSeries.length,
      },
    },
    nasa_grid_cell_estimate: nasaGridCellEstimate(config.location),
    solar,
    wind,
    ambient_temperature_c: {
      source_parameter: "NASA POWER T2M",
      measured_input: tempSeries.length > 0,
      days: tempSeries.length,
      latest: latestPoint(tempSeries)
        ? {
            date: latestPoint(tempSeries).date,
            celsius: fixed(latestPoint(tempSeries).value, 4),
          }
        : null,
      average_celsius: fixed(average(tempSeries.map((point) => point.value)), 4),
    },
    resources: benchmarkResources,
    protocol_bridge_to_spk: [
      "resource_data_or_site_model",
      "real_meter_or_inverter_export",
      "signed_meter_reading",
      "derive_meter_attestations",
      "accepted_surplus_kwh",
      "mintFromSurplusAttestation",
      "SolarPunkCurrencySystem_invoice_settlement",
      "redemption_burn_into_owed_kwh_claim",
      "delivery_resolution",
    ],
    hard_boundaries: [
      "A NASA resource estimate is not mint evidence.",
      "A capacity-factor benchmark is not mint evidence.",
      "Oil is a fossil benchmark only and is never SPK mint-eligible under the renewable surplus thesis.",
      "All SPK issuance still needs accepted signed meter or inverter surplus attestations.",
      "Installation cost is an assumption for sizing, not a vendor quote or investment return promise.",
    ],
    references: [
      {
        name: "NASA POWER Daily API",
        url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
        used_for: "ALLSKY_SFC_SW_DWN, WS10M, T2M daily point data and 0.5 degree grid-cell warning.",
      },
      {
        name: "NREL PVWatts V8 API",
        url: "https://developer.nrel.gov/docs/solar/pvwatts/v8/",
        used_for: "PVWatts-style PV system capacity/loss modelling conventions.",
      },
      {
        name: "DOE Solar Photovoltaic System Cost Benchmarks",
        url: "https://www.energy.gov/eere/solar/solar-photovoltaic-system-cost-benchmarks",
        used_for: "Residential PV installed-cost benchmark assumption.",
      },
      {
        name: "NREL Annual Technology Baseline 2024",
        url: "https://atb.nrel.gov/electricity/2024/index",
        used_for: "Technology-wide electricity cost/performance benchmark framing.",
      },
      {
        name: "EIA Energy Conversion Calculators",
        url: "https://www.eia.gov/energyexplained/units-and-calculators/energy-conversion-calculators.php",
        used_for: "Btu/kWh conversion anchor for fossil energy-unit comparison.",
      },
    ],
  };
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# SolarPunk Multi-Resource Benchmark Lab");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- location: \`${report.location.name}\` (${report.location.latitude}, ${report.location.longitude})`);
  lines.push(`- fetch_status: \`${report.data_fetch.status}\``);
  lines.push(`- thesis: ${report.thesis}`);
  lines.push("");
  lines.push("## What This Adds");
  lines.push("");
  lines.push("This artifact turns the product from a solar-only pitch into a renewable-resource benchmark layer:");
  lines.push("");
  lines.push("- solar gets measured NASA irradiance plus a standard 10 kWdc PV conversion and installation-cost assumption");
  lines.push("- wind gets measured NASA 10 m wind speed plus a resource-density conversion");
  lines.push("- geothermal, tidal, hydro, and biogas/biomass get explicit benchmark-only capacity-factor models");
  lines.push("- oil is included only as a fossil energy-unit benchmark and is not SPK mint-eligible");
  lines.push("");
  lines.push("## NASA Resource Window");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|---|---:|");
  lines.push(`| Requested window | \`${report.data_fetch.requested_start} -> ${report.data_fetch.requested_end}\` |`);
  lines.push(`| GHI observations | \`${report.data_fetch.observations.ghi_days}\` |`);
  lines.push(`| Wind observations | \`${report.data_fetch.observations.ws10m_days}\` |`);
  lines.push(`| Temperature observations | \`${report.data_fetch.observations.t2m_days}\` |`);
  lines.push(`| Approx NASA grid-cell area | \`${report.nasa_grid_cell_estimate.approximate_cell_area_km2} km2\` |`);
  lines.push("");
  lines.push("## Standard Solar PV Conversion");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| System size | \`${report.solar.standard_system.system_kw_dc} kWdc\` |`);
  lines.push(`| Module efficiency assumption | \`${report.solar.standard_system.module_efficiency_pct}%\` |`);
  lines.push(`| Panel area | \`${report.solar.standard_system.panel_area_m2} m2\` |`);
  lines.push(`| PVWatts-style loss assumption | \`${report.solar.standard_system.pvwatts_loss_pct}%\` |`);
  lines.push(`| Latest NASA GHI | \`${report.solar.nasa_window.latest_ghi_kwh_m2_day} kWh/m2/day\` |`);
  lines.push(`| Average window GHI | \`${report.solar.nasa_window.average_ghi_kwh_m2_day} kWh/m2/day\` |`);
  lines.push(`| Latest day AC output | \`${report.solar.production_estimate.latest_day_ac_kwh} kWh\` |`);
  lines.push(`| Average window day AC output | \`${report.solar.production_estimate.average_window_day_ac_kwh} kWh\` |`);
  lines.push(`| Annualized AC output from window average | \`${report.solar.production_estimate.annualized_ac_kwh_from_window_average} kWh\` |`);
  lines.push(`| Residential installed-cost assumption | \`$${report.solar.cost_model.residential_installed_cost_usd_per_wdc_assumption}/Wdc\` |`);
  lines.push(`| Installed cost before incentives | \`$${report.solar.cost_model.installed_cost_usd_before_incentives}\` |`);
  lines.push("");
  lines.push("Formula:");
  lines.push("");
  lines.push("```text");
  lines.push(report.solar.conversion_model);
  lines.push(report.solar.standard_system.panel_area_formula);
  lines.push("```");
  lines.push("");
  lines.push("## Solar Value Sensitivity");
  lines.push("");
  lines.push("| Energy price | Latest day value | Latest day SPK after fee | Annualized value | Simple capex payback |");
  lines.push("|---:|---:|---:|---:|---:|");
  for (const row of report.solar.spk_value_model.price_sensitivity) {
    lines.push(
      `| $${row.energy_price_usd_per_kwh}/kWh | $${row.latest_day_value_usd} | ${row.latest_day_spk_after_mint_fee} SPK | $${row.annualized_value_usd} | ${row.simple_capex_payback_years_before_incentives} years |`
    );
  }
  lines.push("");
  lines.push("## Wind Resource Density");
  lines.push("");
  lines.push("| Metric | Latest | Window Average |");
  lines.push("|---|---:|---:|");
  lines.push(`| 10 m wind speed | \`${report.wind.latest_day?.wind_speed_10m_ms ?? "n/a"} m/s\` | \`${report.wind.average_window_day?.wind_speed_10m_ms ?? "n/a"} m/s\` |`);
  lines.push(`| Hub-height estimate | \`${report.wind.latest_day?.wind_speed_hub_height_ms ?? "n/a"} m/s\` | \`${report.wind.average_window_day?.wind_speed_hub_height_ms ?? "n/a"} m/s\` |`);
  lines.push(`| Recoverable kWh per swept m2 per day | \`${report.wind.latest_day?.recoverable_kwh_per_swept_m2_day ?? "n/a"}\` | \`${report.wind.average_window_day?.recoverable_kwh_per_swept_m2_day ?? "n/a"}\` |`);
  lines.push(`| Recoverable kWh/day at ${report.wind.assumptions.swept_area_m2} m2 swept area | \`${report.wind.latest_day?.recoverable_kwh_day_for_assumed_swept_area ?? "n/a"}\` | \`${report.wind.average_window_day?.recoverable_kwh_day_for_assumed_swept_area ?? "n/a"}\` |`);
  lines.push("");
  lines.push("## Resource Matrix");
  lines.push("");
  lines.push("| Resource | Evidence status | Measured input | Benchmark output | Mint eligibility | Next data needed |");
  lines.push("|---|---|---:|---:|---|---|");
  for (const resource of report.resources) {
    const output = resource.id === "oil_barrel"
      ? `${resource.kwh_thermal_per_barrel} kWh thermal / barrel`
      : `${resource.benchmark_output_kwh_day ?? "n/a"} kWh/day`;
    lines.push(
      `| ${resource.label} | \`${resource.evidence_status}\` | \`${resource.measured_input}\` | \`${output}\` | \`${resource.mint_eligibility}\` | ${resource.next_data_needed || resource.policy_reason || ""} |`
    );
  }
  lines.push("");
  lines.push("## Protocol Bridge");
  lines.push("");
  report.protocol_bridge_to_spk.forEach((step, index) => {
    lines.push(`${index + 1}. \`${step}\``);
  });
  lines.push("");
  lines.push("## Hard Boundaries");
  lines.push("");
  for (const boundary of report.hard_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  lines.push("## References");
  lines.push("");
  for (const reference of report.references) {
    lines.push(`- [${reference.name}](${reference.url}) - ${reference.used_for}`);
  }
  lines.push("");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
    if (arg === "--offline") args.offline = true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = mergeConfig({
    nasa: {
      start: args.start || DEFAULT_CONFIG.nasa.start,
      end: args.end || DEFAULT_CONFIG.nasa.end,
    },
    location: {
      latitude: args.lat ? Number(args.lat) : DEFAULT_CONFIG.location.latitude,
      longitude: args.lon ? Number(args.lon) : DEFAULT_CONFIG.location.longitude,
      name: args.location || DEFAULT_CONFIG.location.name,
    },
  });

  const nasaUrl = buildNasaUrl(config);
  let nasaData;
  let fetchStatus = "live_nasa_power";

  if (args.offline) {
    nasaData = fallbackNasaDataFromKeeper();
    fetchStatus = "offline_keeper_fallback";
  } else {
    try {
      nasaData = await fetchJson(nasaUrl);
    } catch (error) {
      nasaData = fallbackNasaDataFromKeeper();
      fetchStatus = `keeper_fallback_after_fetch_error:${error.message}`;
    }
  }

  const report = buildResourceBenchmarkLab({
    config,
    nasaData,
    fetchStatus,
    nasaUrl,
  });

  const jsonPath = path.join(ROOT, "state", "product", "resource_benchmark_lab.json");
  const mdPath = path.join(ROOT, "docs", "product", "RESOURCE_BENCHMARK_LAB.md");
  writeJson(jsonPath, report);
  writeMarkdown(mdPath, report);

  console.log(`fetch_status=${report.data_fetch.status}`);
  console.log(`solar_latest_kwh_day=${report.solar.production_estimate.latest_day_ac_kwh}`);
  console.log(`solar_installed_cost_usd=${report.solar.cost_model.installed_cost_usd_before_incentives}`);
  console.log(`oil_kwh_thermal_per_barrel=${report.resources.find((item) => item.id === "oil_barrel").kwh_thermal_per_barrel}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  DEFAULT_CONFIG,
  buildResourceBenchmarkLab,
  calculateSolar,
  calculateWind,
  oilBenchmark,
  seriesFromParameter,
};

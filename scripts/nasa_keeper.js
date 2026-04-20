/**
 * nasa_keeper.js — Daily NASA POWER → Sepolia oracle keeper
 *
 * Fetches real solar irradiance data for Taoyuan, Taiwan from NASA POWER,
 * normalises it against the historical monthly mean so the index sits
 * around 1.0 (average day), and pushes it to live Sepolia contracts.
 *
 * Index semantics:
 *   1.0 = average solar production day for this month in Taoyuan
 *   >1.0 = above-average irradiance (call option moves ITM)
 *   <1.0 = below-average irradiance (call OTM, put ITM)
 *
 * This puts the live index directly against the SOLAR_CALL_JUN2026_1USD
 * strike ($1.00 = 1e18), making the option economically meaningful.
 *
 * Pushes:
 *   SolarPunkOption.updateIndex(normalisedGHI, sourceHash)
 *   SolarPunkCoin.updateEnergyPrice(electricityPrice)   [stable tariff]
 *   SolarPunkCoin.updateOraclePriceAndAdjust(pegPrice)  [SPK peg, ~$1.00]
 *
 * Reads back full protocol state and writes:
 *   state/keeper_logs/YYYY-MM-DD.json
 *
 * Run:
 *   npx hardhat run scripts/nasa_keeper.js --network sepolia
 */

const { ethers } = require("hardhat");
const https = require("https");
const fs = require("fs");
const path = require("path");

// ── Config ────────────────────────────────────────────────────────────────────

const LAT = 24.99;
const LON = 121.30;
const LOCATION = "Taoyuan, Taiwan";

// Taoyuan monthly mean GHI (kWh/m²/day) derived from NASA POWER 2020–2024
// Used to normalise today's reading against seasonal baseline
const MONTHLY_MEAN_GHI = {
  1: 2.12, 2: 2.05, 3: 2.78, 4: 3.21, 5: 3.48,  6: 3.82,
  7: 4.18, 8: 4.08, 9: 3.52, 10: 3.19, 11: 2.48, 12: 2.09,
};

// Taiwan grid electricity tariff (USD/kWh) — stable, not weather-driven
const ELECTRICITY_PRICE_PER_KWH = 0.05;

// SPK peg target — kept stable at $1.00 for oracle push
const SPK_PEG_PRICE = ethers.parseEther("1.0");

// Sepolia contract addresses
const ADDRESSES = {
  SolarPunkCoin:   "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  SolarPunkOption: "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
};

// Minimal ABIs for keeper writes + reads
const SPK_ABI = [
  "function updateOraclePriceAndAdjust(uint256 newPrice) external returns (bool)",
  "function updateEnergyPrice(uint256 newPrice) external",
  "function totalSupply() external view returns (uint256)",
  "function lastOraclePrice() external view returns (uint256)",
  "function usdcReserve() external view returns (uint256)",
  "function getReserveRatio() external view returns (uint256)",
  "function isPegStable() external view returns (bool)",
  "function gridStressed() external view returns (bool)",
  "function energyPricePerKwh() external view returns (uint256)",
  "function cumulativeSurplusKwh() external view returns (uint256)",
];

const OPT_ABI = [
  "function updateIndex(uint256 newIndex, bytes32 sourceHash) external",
  "function currentIndex() external view returns (uint256)",
];

// ── NASA POWER fetch ──────────────────────────────────────────────────────────

function fetchNASA(dateStr) {
  // dateStr format: YYYYMMDD
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=ALLSKY_SFC_SW_DWN&community=RE` +
    `&longitude=${LON}&latitude=${LAT}` +
    `&start=${dateStr}&end=${dateStr}&format=JSON`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const ghi = json?.properties?.parameter?.ALLSKY_SFC_SW_DWN?.[dateStr];
          if (ghi === undefined || ghi === null) {
            reject(new Error(`GHI not found in NASA response for ${dateStr}`));
          } else if (ghi <= -900) {
            reject(new Error(`NASA returned missing-data sentinel (${ghi}) for ${dateStr}`));
          } else {
            resolve(ghi);
          }
        } catch (e) {
          reject(new Error(`NASA JSON parse failed: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`\nKeeper: ${deployer.address}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);

  // ── 1. Fetch NASA data ────────────────────────────────────────────────────
  // NASA POWER RE community has a ~2-4 week publication lag.
  // Fetch a 35-day window and take the most recent non-missing day.
  const today = new Date();
  const windowEnd = new Date(today);
  windowEnd.setDate(today.getDate() - 1);          // yesterday
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - 35);        // 35 days back

  console.log(`\nFetching NASA POWER window ${toISODate(windowStart)} → ${toISODate(windowEnd)} (${LOCATION})…`);

  const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=ALLSKY_SFC_SW_DWN&community=RE` +
    `&longitude=${LON}&latitude=${LAT}` +
    `&start=${toDateStr(windowStart)}&end=${toDateStr(windowEnd)}&format=JSON`;

  const nasaData = await new Promise((resolve, reject) => {
    https.get(nasaUrl, (res) => {
      let raw = "";
      res.on("data", c => raw += c);
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error(`NASA JSON parse failed: ${e.message}`)); }
      });
    }).on("error", reject);
  });

  const ghiByDate = nasaData?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
  if (!ghiByDate) throw new Error("NASA response missing ALLSKY_SFC_SW_DWN");

  // Walk backwards through the window to find the most recent valid day
  let ghiDate, ghi;
  for (let d = 0; d <= 35; d++) {
    const candidate = new Date(windowEnd);
    candidate.setDate(windowEnd.getDate() - d);
    const key = toDateStr(candidate);
    const val = ghiByDate[key];
    if (val !== undefined && val > -900) {
      ghi = val;
      ghiDate = candidate;
      break;
    }
  }

  if (ghi === undefined) {
    throw new Error("No valid GHI data found in the last 35 days from NASA POWER");
  }

  console.log(`  Most recent available date: ${toISODate(ghiDate)}`);
  console.log(`  GHI: ${ghi.toFixed(3)} kWh/m²/day`);

  // ── 2. Normalise GHI → index ──────────────────────────────────────────────
  const month = ghiDate.getMonth() + 1;
  const monthlyMean = MONTHLY_MEAN_GHI[month];
  const normalisedGHI = ghi / monthlyMean;   // 1.0 = average for this month

  // Convert to 1e18 format for on-chain (e.g. 1.15 → 1150000000000000000)
  const indexWei = BigInt(Math.round(normalisedGHI * 1e18));

  // Energy price per kWh stays at the stable Taiwan electricity tariff
  const energyPriceWei = BigInt(Math.round(ELECTRICITY_PRICE_PER_KWH * 1e18));

  console.log(`  Monthly mean GHI for month ${month}: ${monthlyMean.toFixed(2)} kWh/m²/day`);
  console.log(`  Normalised index: ${normalisedGHI.toFixed(4)} (${normalisedGHI > 1 ? "above" : "below"} average)`);
  console.log(`  Index (wei): ${indexWei}`);

  // Source hash encodes data provenance: lat, lon, date
  const sourceHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "int256", "int256", "uint256"],
      ["NASA_POWER_ALLSKY_SFC_SW_DWN", Math.round(LAT * 1e6), Math.round(LON * 1e6), BigInt(ghiDate.getTime())]
    )
  );

  // ── 3. Push to contracts ──────────────────────────────────────────────────
  const spk    = new ethers.Contract(ADDRESSES.SolarPunkCoin,   SPK_ABI, deployer);
  const option = new ethers.Contract(ADDRESSES.SolarPunkOption, OPT_ABI, deployer);
  const txs    = {};

  console.log("\nPushing to Sepolia…");

  // Option index — driven by real NASA irradiance
  process.stdout.write("  updateIndex… ");
  const tx1 = await option.updateIndex(indexWei, sourceHash);
  await tx1.wait();
  txs.updateIndex = tx1.hash;
  console.log(`${tx1.hash}`);

  // Energy price per kWh — stable tariff
  process.stdout.write("  updateEnergyPrice… ");
  const tx2 = await spk.updateEnergyPrice(energyPriceWei);
  await tx2.wait();
  txs.updateEnergyPrice = tx2.hash;
  console.log(`${tx2.hash}`);

  // Oracle price for PI controller — SPK peg held at $1.00
  process.stdout.write("  updateOraclePriceAndAdjust… ");
  const tx3 = await spk.updateOraclePriceAndAdjust(SPK_PEG_PRICE);
  await tx3.wait();
  txs.updateOraclePriceAndAdjust = tx3.hash;
  console.log(`${tx3.hash}`);

  // ── 4. Read back protocol state ───────────────────────────────────────────
  const [
    totalSupply,
    lastOraclePrice,
    usdcReserve,
    reserveRatioBps,
    isPegStable,
    gridStressed,
    energyPriceOnChain,
    cumulativeSurplusKwh,
    currentIndex,
  ] = await Promise.all([
    spk.totalSupply(),
    spk.lastOraclePrice(),
    spk.usdcReserve(),
    spk.getReserveRatio(),
    spk.isPegStable(),
    spk.gridStressed(),
    spk.energyPricePerKwh(),
    spk.cumulativeSurplusKwh(),
    option.currentIndex(),
  ]);

  const state = {
    total_supply_spk:        Number(totalSupply) / 1e18,
    oracle_price_usd:        Number(lastOraclePrice) / 1e18,
    usdc_reserve_usd:        Number(usdcReserve) / 1e6,
    reserve_ratio_pct:       Number(reserveRatioBps) / 100,
    peg_stable:              isPegStable,
    grid_stressed:           gridStressed,
    energy_price_per_kwh:    Number(energyPriceOnChain) / 1e18,
    cumulative_surplus_kwh:  Number(cumulativeSurplusKwh) / 1e18,
    option_index:            Number(currentIndex) / 1e18,
  };

  // ── 5. Write log ──────────────────────────────────────────────────────────
  const logDate = toISODate(today);
  const log = {
    date:            logDate,
    run_at:          new Date().toISOString(),
    keeper:          deployer.address,
    nasa: {
      date:          toISODate(ghiDate),
      location:      LOCATION,
      lat:           LAT,
      lon:           LON,
      ghi_kwh_m2:    ghi,
      monthly_mean:  monthlyMean,
      month:         month,
    },
    index: {
      normalised:    normalisedGHI,
      interpretation: normalisedGHI >= 1 ? "above seasonal average" : "below seasonal average",
      wei:           indexWei.toString(),
      source_hash:   sourceHash,
    },
    transactions:    txs,
    protocol_state:  state,
  };

  const logDir = path.join(__dirname, "../state/keeper_logs");
  fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, `${logDate}.json`);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n━━ Keeper run complete (${logDate}) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`NASA date:        ${toISODate(ghiDate)}`);
  console.log(`GHI:              ${ghi.toFixed(3)} kWh/m²/day`);
  console.log(`Monthly mean:     ${monthlyMean.toFixed(2)} kWh/m²/day`);
  console.log(`Normalised index: ${normalisedGHI.toFixed(4)} (${log.index.interpretation})`);
  console.log(`On-chain index:   ${state.option_index.toFixed(6)}`);
  console.log(`SPK supply:       ${state.total_supply_spk.toFixed(2)}`);
  console.log(`USDC reserve:     $${state.usdc_reserve_usd.toFixed(2)}`);
  console.log(`Reserve ratio:    ${state.reserve_ratio_pct.toFixed(1)}%`);
  console.log(`Peg stable:       ${state.peg_stable}`);
  console.log(`Log written:      ${logPath}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((err) => {
  console.error("\nKeeper failed:", err.message);
  process.exit(1);
});

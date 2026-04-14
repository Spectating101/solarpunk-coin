require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const rpcUrl =
    process.env.RPC_URL ||
    process.env.POLYGON_AMOY_RPC ||
    process.env.ALCHEMY_AMOY_RPC;
  const spkAddress = process.env.SPK_ADDRESS;
  const optionAddress = process.env.OPTION_ADDRESS;

  if (!rpcUrl || !spkAddress || !optionAddress) {
    console.error("Missing env vars: RPC_URL (or POLYGON_AMOY_RPC), SPK_ADDRESS, OPTION_ADDRESS");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const [spkAbi, optionAbi] = await Promise.all([
    require("../artifacts/contracts/SolarPunkCoin.sol/SolarPunkCoin.json").abi,
    require("../artifacts/contracts/SolarPunkOption.sol/SolarPunkOption.json").abi,
  ]);

  const spk = new ethers.Contract(spkAddress, spkAbi, provider);
  const option = new ethers.Contract(optionAddress, optionAbi, provider);

  const block = await provider.getBlock("latest");
  const now = block.timestamp;

  const [
    reserveRatio,
    gridStressed,
    lastOracleUpdate,
    oracleStalenessThreshold,
    totalSupply,
    usdcReserve,
    minReserveMarginPercent,
  ] = await Promise.all([
    spk.getReserveRatio(),
    spk.gridStressed(),
    spk.lastOracleUpdate(),
    spk.oracleStalenessThreshold(),
    spk.totalSupply(),
    spk.usdcReserve(),
    spk.minReserveMarginPercent(),
  ]);

  const [
    currentIndex,
    lastIndexUpdate,
    isPaused,
  ] = await Promise.all([
    option.currentIndex(),
    option.lastIndexUpdate(),
    option.paused(),
  ]);

  const spkOracleAge = now - Number(lastOracleUpdate);
  const optionOracleAge = now - Number(lastIndexUpdate);
  const optionMaxOracleAgeSeconds = Number(process.env.OPTION_MAX_ORACLE_AGE_SECONDS || 86400);

  const signals = {
    reserve_ratio_percent: Number(reserveRatio),
    min_reserve_margin_percent: Number(minReserveMarginPercent),
    reserve_ratio_breach: Number(reserveRatio) < Number(minReserveMarginPercent),
    grid_stressed: Boolean(gridStressed),
    spk_oracle_age_seconds: spkOracleAge,
    spk_oracle_stale: spkOracleAge > Number(oracleStalenessThreshold),
    option_oracle_age_seconds: optionOracleAge,
    option_oracle_stale: optionOracleAge > optionMaxOracleAgeSeconds,
    option_paused: Boolean(isPaused),
  };

  const status = signals.reserve_ratio_breach || signals.grid_stressed || signals.spk_oracle_stale || signals.option_oracle_stale
    ? "WARN"
    : "OK";
  const report = {
    generated_at: new Date().toISOString(),
    status,
    signals,
  };

  console.log("SPK Health");
  console.log(`  Reserve Ratio: ${reserveRatio}%`);
  console.log(`  Min Reserve Margin: ${minReserveMarginPercent}%`);
  console.log(`  Reserve Ratio Breach: ${signals.reserve_ratio_breach}`);
  console.log(`  Grid Stressed: ${gridStressed}`);
  console.log(`  Oracle Age: ${spkOracleAge}s (threshold ${oracleStalenessThreshold}s)`);
  console.log(`  Supply: ${ethers.formatEther(totalSupply)} SPK`);
  console.log(`  Reserve: ${usdcReserve.toString()} (reserve token decimals)`);

  console.log("\nOption Health");
  console.log(`  Current Index: ${currentIndex.toString()} (collateral decimals)`);
  console.log(`  Oracle Age: ${optionOracleAge}s (threshold ${optionMaxOracleAgeSeconds}s from env OPTION_MAX_ORACLE_AGE_SECONDS)`);
  console.log(`  Paused: ${isPaused}`);
  console.log(`\nAlert status: ${status}`);
  console.log(`Signals: ${JSON.stringify(signals)}`);

  const outputPath = process.env.HEALTH_OUTPUT_JSON;
  if (outputPath) {
    const resolved = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, JSON.stringify(report, null, 2) + "\n");
    console.log(`Health report written: ${resolved}`);
  }

  const failOnWarn = ["1", "true", "yes"].includes(
    String(process.env.HEALTH_FAIL_ON_WARN || "").toLowerCase()
  );
  if (failOnWarn && status !== "OK") {
    process.exit(2);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

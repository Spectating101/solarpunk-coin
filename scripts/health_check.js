require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const rpcUrl =
    process.env.RPC_URL ||
    process.env.POLYGON_MUMBAI_RPC ||
    process.env.ALCHEMY_MUMBAI_RPC;
  const spkAddress = process.env.SPK_ADDRESS;
  const optionAddress = process.env.OPTION_ADDRESS;

  if (!rpcUrl || !spkAddress || !optionAddress) {
    console.error("Missing env vars: RPC_URL (or POLYGON_MUMBAI_RPC), SPK_ADDRESS, OPTION_ADDRESS");
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
  ] = await Promise.all([
    spk.getReserveRatio(),
    spk.gridStressed(),
    spk.lastOracleUpdate(),
    spk.oracleStalenessThreshold(),
    spk.totalSupply(),
    spk.usdcReserve(),
  ]);

  const [
    currentIndex,
    lastUpdateTimestamp,
    maxStaleness,
    isPaused,
    minOracleQuorum,
    maxDeviationBps,
  ] = await Promise.all([
    option.currentIndex(),
    option.lastUpdateTimestamp(),
    option.maxStaleness(),
    option.isPaused(),
    option.minOracleQuorum(),
    option.maxDeviationBps(),
  ]);

  const spkOracleAge = now - Number(lastOracleUpdate);
  const optionOracleAge = now - Number(lastUpdateTimestamp);

  console.log("SPK Health");
  console.log(`  Reserve Ratio: ${reserveRatio}%`);
  console.log(`  Grid Stressed: ${gridStressed}`);
  console.log(`  Oracle Age: ${spkOracleAge}s (threshold ${oracleStalenessThreshold}s)`);
  console.log(`  Supply: ${ethers.formatEther(totalSupply)} SPK`);
  console.log(`  Reserve: ${usdcReserve.toString()} (reserve token decimals)`);

  console.log("\nOption Health");
  console.log(`  Current Index: ${currentIndex.toString()} (collateral decimals)`);
  console.log(`  Oracle Age: ${optionOracleAge}s (threshold ${maxStaleness}s)`);
  console.log(`  Paused: ${isPaused}`);
  console.log(`  Min Quorum: ${minOracleQuorum}`);
  console.log(`  Max Deviation (bps): ${maxDeviationBps}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

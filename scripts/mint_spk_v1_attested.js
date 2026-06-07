const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const { ROOT, readRuntime, mergeRuntime, getSignerFor } = require("./lib/spk_v1_runtime");
const { buildCycleBundle, mintAttestedOnSpk } = require("./lib/spk_v1_attested_mint");

function cycleId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function main() {
  const runtime = readRuntime();
  if (!runtime?.contracts?.solar_punk_coin) {
    throw new Error("Missing state/runtime/spk_v1.json");
  }

  const [deployer] = await ethers.getSigners();
  const spk = await ethers.getContractAt("SolarPunkCoin", runtime.contracts.solar_punk_coin);
  const minter = await getSignerFor(ethers, runtime.roles?.minter || deployer.address);
  const oracle = await getSignerFor(ethers, runtime.roles?.oracle || deployer.address);
  const recipient = process.env.SPK_MINT_RECIPIENT || deployer.address;
  const surplusKwh = Number(process.env.CYCLE_MINT_KWH || "50");
  const id = process.env.CYCLE_ID || cycleId();
  const latestBlock = await ethers.provider.getBlock("latest");
  const bundle = buildCycleBundle(id, surplusKwh, Number(latestBlock.timestamp));

  const mintStep = await mintAttestedOnSpk(spk, bundle, { minter, oracle, recipient });
  const proof = {
    generated_at: new Date().toISOString(),
    network: runtime.network,
    product: "SPK_V1",
    contracts: runtime.contracts,
    bundle,
    mint: mintStep,
  };

  const outDir = path.join(ROOT, "state", "proofs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `spk_v1_attested_mint_${id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(proof, null, 2) + "\n", "utf-8");

  const attestations = [...(runtime.attested_mints || []), mintStep];
  mergeRuntime({ attested_mints: attestations, latest_attested_mint: mintStep }, ROOT);

  console.log(JSON.stringify(proof, null, 2));
  console.log(`wrote: ${outPath}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };

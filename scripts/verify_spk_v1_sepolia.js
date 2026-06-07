const hre = require("hardhat");
const { readRuntime } = require("./lib/spk_v1_runtime");

async function verifyAddress(address, constructorArguments) {
  try {
    await hre.run("verify:verify", { address, constructorArguments });
    console.log(`verified ${address}`);
  } catch (error) {
    const msg = String(error.message || error);
    if (msg.includes("Already Verified") || msg.includes("already verified")) {
      console.log(`already verified ${address}`);
      return;
    }
    throw error;
  }
}

async function main() {
  if (!process.env.etherscan) {
    console.log("Skip: set etherscan=YOUR_API_KEY in .env to verify on Etherscan.");
    return;
  }

  const runtime = readRuntime();
  if (!runtime?.contracts?.solar_punk_coin) {
    throw new Error("Missing state/runtime/spk_v1.json");
  }

  const { mock_usdc, solar_punk_coin, currency_system } = runtime.contracts;
  const admin = runtime.governance_admin || runtime.deployer;

  await verifyAddress(mock_usdc, []);
  await verifyAddress(solar_punk_coin, [mock_usdc]);
  await verifyAddress(currency_system, [solar_punk_coin, admin]);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };

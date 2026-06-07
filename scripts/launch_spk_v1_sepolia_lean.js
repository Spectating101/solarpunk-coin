const { main: deploy } = require("./deploy_spk_v1_sepolia_lean");
const { main: genesis } = require("./run_spk_v1_genesis");

async function main() {
  await deploy();
  await genesis();
  console.log("spk_v1_sepolia_lean=complete");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { main };

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function getArg(name, fallback = null) {
  const key = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(key));
  if (!found) return fallback;
  return found.slice(key.length);
}

function normalizeAddress(value) {
  if (!value || typeof value !== "string") return null;
  return /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null;
}

function explorerBase(networkName) {
  const map = {
    amoy: "https://amoy.polygonscan.com",
    sepolia: "https://sepolia.etherscan.io",
    holesky: "https://holesky.etherscan.io",
  };
  return map[networkName] || null;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n");
}

function writeMarkdown(filePath, payload) {
  const lines = [];
  lines.push("# Interaction Proof Report");
  lines.push("");
  lines.push(`- generated_at: \`${payload.generated_at}\``);
  lines.push(`- network: \`${payload.network}\``);
  lines.push(`- chain_id: \`${payload.chain_id}\``);
  lines.push(`- receipt_source: \`${payload.receipt_source}\``);
  lines.push("");
  lines.push("## Contract Addresses");
  lines.push("");
  lines.push(`- MockUSDC: \`${payload.contracts.MockUSDC}\``);
  lines.push(`- ProtocolTreasury: \`${payload.contracts.ProtocolTreasury}\``);
  lines.push(`- SolarPunkCoin: \`${payload.contracts.SolarPunkCoin}\``);
  lines.push(`- SolarPunkOption: \`${payload.contracts.SolarPunkOption}\``);
  lines.push("");
  lines.push("## Interaction Transactions");
  lines.push("");
  for (const [key, tx] of Object.entries(payload.interactions)) {
    lines.push(`- ${key}: \`${tx}\``);
  }
  lines.push("");
  lines.push("## Explorer Links");
  lines.push("");
  if (payload.explorer.contracts) {
    for (const [name, link] of Object.entries(payload.explorer.contracts)) {
      lines.push(`- ${name}: \`${link}\``);
    }
  } else {
    lines.push("- not available for this network");
  }
  lines.push("");
  if (payload.explorer.transactions) {
    for (const [name, link] of Object.entries(payload.explorer.transactions)) {
      lines.push(`- tx_${name}: \`${link}\``);
    }
  }
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n") + "\n");
}

async function main() {
  const networkName = hre.network.name;
  if (networkName === "hardhat") {
    throw new Error("Use a persistent network (e.g., amoy or localhost), not ephemeral hardhat.");
  }
  const [deployer, user, trader] = await hre.ethers.getSigners();

  const root = path.join(__dirname, "..");
  const receiptArg = getArg("receipt", null);
  const receiptPath = receiptArg
    ? path.resolve(root, receiptArg)
    : path.join(root, "state", "deployments", `${networkName}_full_deploy.json`);
  const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf-8"));

  const contracts = receipt.contracts || {};
  const usdcAddress = normalizeAddress(contracts.MockUSDC?.address);
  const treasuryAddress = normalizeAddress(contracts.ProtocolTreasury?.address);
  const spkAddress = normalizeAddress(contracts.SolarPunkCoin?.address);
  const optionAddress = normalizeAddress(contracts.SolarPunkOption?.address);

  if (!usdcAddress || !treasuryAddress || !spkAddress || !optionAddress) {
    throw new Error("Invalid full deploy receipt: missing one or more contract addresses");
  }

  const usdc = await hre.ethers.getContractAt("MockUSDC", usdcAddress);
  const spk = await hre.ethers.getContractAt("SolarPunkCoin", spkAddress);
  const option = await hre.ethers.getContractAt("SolarPunkOption", optionAddress);

  const interactions = {};
  const usdcSeed = hre.ethers.parseUnits("10000", 6);

  const seedTx = await usdc.mint(deployer.address, usdcSeed);
  await seedTx.wait();
  interactions.seed_usdc = seedTx.hash;

  const approveReserveTx = await usdc.approve(spkAddress, usdcSeed);
  await approveReserveTx.wait();
  interactions.approve_reserve = approveReserveTx.hash;

  const depositReserveTx = await spk.depositReserve(usdcSeed);
  await depositReserveTx.wait();
  interactions.deposit_reserve = depositReserveTx.hash;

  const oracleTx = await spk.updateOraclePriceAndAdjust(hre.ethers.parseEther("1"));
  await oracleTx.wait();
  interactions.spk_oracle_update = oracleTx.hash;

  const mintTx = await spk.mintFromSurplus(500, user.address);
  await mintTx.wait();
  interactions.spk_mint = mintTx.hash;

  const redeemAmount = hre.ethers.parseEther("10");
  const redeemTx = await spk.connect(user).redeemForEnergy(redeemAmount);
  await redeemTx.wait();
  interactions.spk_redeem = redeemTx.hash;

  const optionSeries = hre.ethers.id(`PUBLIC_PROOF_${Date.now()}`);
  const expiry = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;
  const loosenMarginTx = await option.setMarginParams(1_000, 500, 100);
  await loosenMarginTx.wait();
  interactions.option_set_margin_params = loosenMarginTx.hash;
  const createSeriesTx = await option.createSeries(optionSeries, expiry, 1_000_000, true, 1_000);
  await createSeriesTx.wait();
  interactions.option_create_series = createSeriesTx.hash;

  const optionIndexTx = await option.updateIndex(1_000_000, hre.ethers.ZeroHash);
  await optionIndexTx.wait();
  interactions.option_update_index = optionIndexTx.hash;

  const traderMargin = 200_000_000n;
  const traderFeeBuffer = hre.ethers.parseUnits("20", 6);
  const traderTotal = traderMargin + traderFeeBuffer;
  const mintTraderTx = await usdc.mint(trader.address, traderTotal);
  await mintTraderTx.wait();
  interactions.seed_trader_usdc = mintTraderTx.hash;

  const approveOptionTx = await usdc.connect(trader).approve(optionAddress, traderTotal);
  await approveOptionTx.wait();
  interactions.approve_option = approveOptionTx.hash;

  const modifyPositionTx = await option.connect(trader).modifyPosition(optionSeries, 1, traderMargin);
  await modifyPositionTx.wait();
  interactions.option_modify_position = modifyPositionTx.hash;

  const chainId = hre.network.config.chainId || null;
  const base = explorerBase(networkName);
  const payload = {
    generated_at: new Date().toISOString(),
    network: networkName,
    chain_id: chainId,
    receipt_source: path.relative(root, receiptPath),
    contracts: {
      MockUSDC: usdcAddress,
      ProtocolTreasury: treasuryAddress,
      SolarPunkCoin: spkAddress,
      SolarPunkOption: optionAddress,
    },
    interactions,
    explorer: {
      contracts: base
        ? {
            MockUSDC: `${base}/address/${usdcAddress}`,
            ProtocolTreasury: `${base}/address/${treasuryAddress}`,
            SolarPunkCoin: `${base}/address/${spkAddress}`,
            SolarPunkOption: `${base}/address/${optionAddress}`,
          }
        : null,
      transactions: base
        ? Object.fromEntries(
            Object.entries(interactions).map(([key, hash]) => [key, `${base}/tx/${hash}`])
          )
        : null,
    },
  };

  const outJsonArg = getArg("out-json", null);
  const outMdArg = getArg("out-md", null);
  const outJson = outJsonArg
    ? path.resolve(root, outJsonArg)
    : path.join(root, "state", "deployments", `${networkName}_interaction_proof.json`);
  const outMd = outMdArg
    ? path.resolve(root, outMdArg)
    : path.join(root, "docs", "project", "INTERACTION_PROOF_REPORT.md");

  writeJson(outJson, payload);
  writeMarkdown(outMd, payload);

  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

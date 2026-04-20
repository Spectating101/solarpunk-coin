/**
 * Interaction proof: runs real on-chain transactions on Sepolia to demonstrate
 * the full SolarPunk protocol flow. Saves tx hashes as a verifiable proof artifact.
 *
 * Flow:
 *   1. Mint MockUSDC to deployer
 *   2. Deposit USDC reserve into SolarPunkCoin
 *   3. Update oracle price (deployer has ORACLE_ROLE)
 *   4. Mint SPK from energy surplus
 *   5. Redeem SPK for energy
 *   6. Open an option position (SolarPunkOption)
 *   7. Mark position to new index
 *   8. Save proof artifact
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const ADDRESSES = {
  MockUSDC:         "0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2",
  ProtocolTreasury: "0x138e793f095a33D2790349eC1066FED3A756dd2c",
  SolarPunkCoin:    "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  SolarPunkOption:  "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const explorer = "https://sepolia.etherscan.io";

  console.log("=".repeat(60));
  console.log("SolarPunk Protocol — Interaction Proof");
  console.log("=".repeat(60));
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const proof = {
    generated_at: new Date().toISOString(),
    network,
    deployer: deployer.address,
    contracts: ADDRESSES,
    transactions: [],
  };

  const record = (label, tx, note) => {
    console.log(`  ✓ ${label}`);
    console.log(`    TX: ${explorer}/tx/${tx.hash}`);
    proof.transactions.push({ step: label, tx: tx.hash, explorer: `${explorer}/tx/${tx.hash}`, note: note || "" });
  };

  // Attach contracts
  const usdc    = await hre.ethers.getContractAt("MockUSDC",         ADDRESSES.MockUSDC,         deployer);
  const spk     = await hre.ethers.getContractAt("SolarPunkCoin",    ADDRESSES.SolarPunkCoin,    deployer);
  const option  = await hre.ethers.getContractAt("SolarPunkOption",  ADDRESSES.SolarPunkOption,  deployer);

  // ── Step 1: Mint MockUSDC ──────────────────────────────────────────
  console.log("\n[1/6] Minting MockUSDC to deployer...");
  const usdcAmount = 500_000n * 1_000_000n; // 500,000 USDC (6 decimals)
  const tx1 = await (await usdc.mint(deployer.address, usdcAmount)).wait();
  record("Mint 500,000 MockUSDC", tx1, "Test collateral for reserve and option margin");

  // ── Step 2: Deposit USDC reserve into SolarPunkCoin ───────────────
  console.log("\n[2/6] Depositing USDC reserve into SolarPunkCoin...");
  const reserveAmount = 100_000n * 1_000_000n; // 100,000 USDC
  await (await usdc.approve(ADDRESSES.SolarPunkCoin, reserveAmount)).wait();
  const tx2 = await (await spk.depositReserve(reserveAmount)).wait();
  record("Deposit 100,000 USDC reserve", tx2, "Establishes reserve ratio — enables minting");

  // ── Step 3: Update oracle price ────────────────────────────────────
  console.log("\n[3/6] Updating oracle price to $1.00...");
  const tx3 = await (await spk.updateOraclePriceAndAdjust(hre.ethers.parseEther("1.00"))).wait();
  record("Oracle price update → $1.00/SPK", tx3, "Deployer holds ORACLE_ROLE — triggers PI controller");

  // ── Step 4: Mint SPK from energy surplus ──────────────────────────
  console.log("\n[4/6] Minting SPK from 10,000 kWh surplus...");
  const surplusKwh = 10_000n;
  const tx4 = await (await spk.mintFromSurplus(surplusKwh, deployer.address)).wait();
  const spkBalance = await spk.balanceOf(deployer.address);
  record(
    `Mint SPK from ${surplusKwh} kWh surplus`,
    tx4,
    `Received ${hre.ethers.formatEther(spkBalance)} SPK — fee split: 50% stability pool, 50% treasury`
  );

  // ── Step 5: Redeem SPK for energy ─────────────────────────────────
  console.log("\n[5/6] Redeeming 100 SPK for energy...");
  const redeemAmount = hre.ethers.parseEther("100");
  const tx5 = await (await spk.redeemForEnergy(redeemAmount)).wait();
  record("Redeem 100 SPK for energy", tx5, "SPK burned — redemption fee routed to treasury");

  // ── Step 6: Open option position ──────────────────────────────────
  console.log("\n[6/6] Opening option position on SolarPunkOption...");
  // notional = 10 kWh, strike = $1.00
  // Exposure = $10 USDC → IM (150%) = $15 USDC, trading fee (50bps) = $0.05
  const SERIES_ID = hre.ethers.id("SOLAR_CALL_JUN2026_1USD_v2");
  const expiry = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60; // 90 days
  const strike   = 1_000_000n; // $1.00 (6 decimals)
  const notional =        10n; // 10 kWh per contract

  await (await option.createSeries(SERIES_ID, expiry, strike, true, notional)).wait();
  await (await option.updateIndex(strike, hre.ethers.ZeroHash)).wait();

  const marginAmount = 20_000_000n; // 20 USDC — above 15 USDC IM requirement
  const tradingFee   =     50_000n; // 50 bps on $10 exposure = $0.05 USDC
  await (await usdc.approve(ADDRESSES.SolarPunkOption, marginAmount + tradingFee)).wait();
  const tx6 = await (await option.modifyPosition(SERIES_ID, 1n, marginAmount)).wait();
  record(
    "Open 1-contract long call (SOLAR_CALL_JUN2026_1USD)",
    tx6,
    "Strike $1.00, notional 10 kWh, margin 20 USDC — IM requirement $15 (150% of $10 exposure)"
  );

  // ── Mark to higher index ───────────────────────────────────────────
  const newIndex = 1_050_000n; // $1.05 → +$0.50 gain on 10 kWh notional
  await (await option.updateIndex(newIndex, hre.ethers.ZeroHash)).wait();
  const tx7 = await (await option.markPosition(deployer.address, SERIES_ID)).wait();
  const pos = await option.getPosition(deployer.address, SERIES_ID);
  record(
    "Mark position to $1.05 index (+5%)",
    tx7,
    `Margin after mark: ${Number(pos.margin) / 1e6} USDC (gain of $0.50 on 10 kWh notional)`
  );

  // ── Save proof ─────────────────────────────────────────────────────
  const outDir = path.join(__dirname, "..", "state", "proofs");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network}_interaction_proof.json`);
  fs.writeFileSync(outFile, JSON.stringify(proof, null, 2) + "\n");

  console.log("\n" + "=".repeat(60));
  console.log("INTERACTION PROOF COMPLETE");
  console.log("=".repeat(60));
  console.log(`\n${proof.transactions.length} transactions confirmed on ${network}.`);
  console.log(`Proof saved to: ${outFile}`);
  console.log("\nTransaction summary:");
  proof.transactions.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.step}`);
    console.log(`     ${t.explorer}`);
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; });

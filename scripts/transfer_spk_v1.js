/**
 * Send SPK from the deployer wallet to a test address (Sepolia).
 * Usage: RECIPIENT=0x... AMOUNT=50 npx hardhat run scripts/transfer_spk_v1.js --network sepolia
 */
const hre = require("hardhat");
const { ethers } = hre;
const { readRuntime } = require("./lib/spk_v1_runtime");

async function main() {
  const recipient = process.env.RECIPIENT;
  const amount = process.env.AMOUNT || "50";
  if (!recipient || !ethers.isAddress(recipient)) {
    throw new Error("Set RECIPIENT to a valid address, e.g. RECIPIENT=0x... AMOUNT=50");
  }

  const runtime = readRuntime();
  const spkAddress = runtime.contracts.solar_punk_coin;
  const [signer] = await ethers.getSigners();
  const spk = await ethers.getContractAt("SolarPunkCoin", spkAddress, signer);
  const wei = ethers.parseEther(amount);
  const balance = await spk.balanceOf(signer.address);

  console.log(`From: ${signer.address}`);
  console.log(`To:   ${recipient}`);
  console.log(`SPK:  ${amount} (balance before: ${ethers.formatEther(balance)})`);

  const tx = await spk.transfer(recipient, wei);
  const receipt = await tx.wait();
  const after = await spk.balanceOf(recipient);
  console.log(`Sent. tx: ${receipt.hash}`);
  console.log(`Recipient balance: ${ethers.formatEther(after)} SPK`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

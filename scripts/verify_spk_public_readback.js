const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const { ethers } = hre;
const ROOT = path.join(__dirname, "..");
const DEFAULT_PROOF_PATH = "state/proofs/sepolia_spk_attested_mint_proof.json";

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
}

function asBool(value) {
  return Boolean(value);
}

function stringify(value) {
  return typeof value === "bigint" ? value.toString() : String(value);
}

function check(name, pass, detail) {
  return { name, pass: Boolean(pass), detail };
}

function toMarkdown(readback) {
  const lines = [
    "# SPK Public Readback",
    "",
    "This proof is a read-only Sepolia verification of the attested SPK mint path.",
    "",
    "## Target",
    "",
    `- generated_at: \`${readback.generated_at}\``,
    `- network: \`${readback.network}\``,
    `- chain_id: \`${readback.chain_id}\``,
    `- SolarPunkCoin: \`${readback.contract}\``,
    `- proof_path: \`${readback.proof_path}\``,
    "",
    "## Transaction",
    "",
    `- tx_hash: \`${readback.transaction.hash}\``,
    `- status: \`${readback.transaction.status}\``,
    `- block_number: \`${readback.transaction.block_number}\``,
    `- block_timestamp: \`${readback.transaction.block_timestamp}\``,
    `- gas_used: \`${readback.transaction.gas_used}\``,
    "",
    "## On-chain State",
    "",
    `- attestation_hash: \`${readback.attestation_hash}\``,
    `- attestation_hash_consumed: \`${readback.onchain.attestation_hash_consumed}\``,
    `- source_hash: \`${readback.source_hash}\``,
    `- source_hash_consumed: \`${readback.onchain.source_hash_consumed}\``,
    `- recipient: \`${readback.recipient}\``,
    `- recipient_balance_spk: \`${readback.onchain.recipient_balance_spk}\``,
    `- total_supply_spk: \`${readback.onchain.total_supply_spk}\``,
    `- cumulative_surplus_kwh: \`${readback.onchain.cumulative_surplus_kwh}\``,
    `- energy_price_usd_per_kwh: \`${readback.onchain.energy_price_usd_per_kwh}\``,
    `- reserve_ratio_percent: \`${readback.onchain.reserve_ratio_percent}\``,
    `- peg_stable: \`${readback.onchain.peg_stable}\``,
    `- grid_stressed: \`${readback.onchain.grid_stressed}\``,
    "",
    "## Checks",
    "",
    "| Check | Pass | Detail |",
    "|---|---:|---|",
    ...readback.checks.map((item) => `| ${item.name} | \`${item.pass}\` | ${item.detail} |`),
    "",
    "## Interpretation",
    "",
    readback.all_checks_passed
      ? "All readback checks passed. The public Sepolia contract state matches the committed attested-mint proof."
      : "One or more readback checks failed. Treat the public proof as stale until investigated.",
    "",
  ];

  return lines.join("\n");
}

async function main() {
  const proofPath = process.env.PROOF_PATH || DEFAULT_PROOF_PATH;
  const proof = loadJson(proofPath);
  const expectedChainId = BigInt(proof.chain_id);
  const network = await ethers.provider.getNetwork();
  const actualChainId = network.chainId;

  if (actualChainId !== expectedChainId) {
    throw new Error(`Wrong network: proof chain ${expectedChainId}, connected ${actualChainId}`);
  }

  const contractAddress = process.env.SPK_ADDRESS || proof.contracts.SolarPunkCoin;
  const spk = await ethers.getContractAt("SolarPunkCoin", contractAddress);
  const txHash = proof.transaction.hash;
  const receipt = await ethers.provider.getTransactionReceipt(txHash);

  if (!receipt) {
    throw new Error(`Missing transaction receipt for ${txHash}`);
  }

  const code = await ethers.provider.getCode(contractAddress);
  const block = await ethers.provider.getBlock(receipt.blockNumber);
  const attestationHash = proof.attestation.attestation_hash;
  const sourceHash = proof.source.source_hash;
  const recipient = proof.attestation.recipient;
  const expectedMintedWei = BigInt(proof.mint.expected_minted_wei);
  const expectedOnchainKwh = BigInt(proof.source.onchain_surplus_kwh);

  const [
    attestationHashConsumed,
    sourceHashConsumed,
    recipientBalance,
    totalSupply,
    cumulativeSurplusKwh,
    energyPricePerKwh,
    mintingFeeBps,
    reserveRatio,
    pegStable,
    gridStressed,
  ] = await Promise.all([
    spk.usedSurplusAttestations(attestationHash),
    spk.usedSurplusSourceHashes(sourceHash),
    spk.balanceOf(recipient),
    spk.totalSupply(),
    spk.cumulativeSurplusKwh(),
    spk.energyPricePerKwh(),
    spk.mintingFee(),
    spk.getReserveRatio(),
    spk.isPegStable(),
    spk.gridStressed(),
  ]);

  const checks = [
    check("contract code present", code !== "0x", `${contractAddress} has ${Math.max(0, (code.length - 2) / 2)} bytes of bytecode`),
    check("transaction succeeded", receipt.status === 1, `receipt.status=${receipt.status}`),
    check("transaction called SPK contract", receipt.to?.toLowerCase() === contractAddress.toLowerCase(), `receipt.to=${receipt.to}`),
    check("attestation hash consumed", asBool(attestationHashConsumed), stringify(attestationHashConsumed)),
    check("source hash consumed", asBool(sourceHashConsumed), stringify(sourceHashConsumed)),
    check(
      "recipient balance covers minted amount",
      recipientBalance >= expectedMintedWei,
      `${recipientBalance.toString()} >= ${expectedMintedWei.toString()}`
    ),
    check(
      "cumulative surplus covers proof kWh",
      cumulativeSurplusKwh >= expectedOnchainKwh,
      `${cumulativeSurplusKwh.toString()} >= ${expectedOnchainKwh.toString()}`
    ),
  ];

  const readback = {
    generated_at: new Date().toISOString(),
    network: hre.network.name,
    chain_id: Number(actualChainId),
    proof_path: proofPath,
    contract: contractAddress,
    attestation_hash: attestationHash,
    source_hash: sourceHash,
    recipient,
    transaction: {
      hash: txHash,
      status: receipt.status,
      block_number: receipt.blockNumber,
      block_timestamp: block?.timestamp ?? null,
      gas_used: receipt.gasUsed.toString(),
    },
    onchain: {
      attestation_hash_consumed: asBool(attestationHashConsumed),
      source_hash_consumed: asBool(sourceHashConsumed),
      recipient_balance_wei: recipientBalance.toString(),
      recipient_balance_spk: ethers.formatEther(recipientBalance),
      total_supply_wei: totalSupply.toString(),
      total_supply_spk: ethers.formatEther(totalSupply),
      cumulative_surplus_kwh: cumulativeSurplusKwh.toString(),
      energy_price_wei_per_kwh: energyPricePerKwh.toString(),
      energy_price_usd_per_kwh: ethers.formatEther(energyPricePerKwh),
      minting_fee_bps: Number(mintingFeeBps),
      reserve_ratio_percent: `${reserveRatio.toString()}%`,
      peg_stable: asBool(pegStable),
      grid_stressed: asBool(gridStressed),
    },
    checks,
    all_checks_passed: checks.every((item) => item.pass),
  };

  writeJson("state/proofs/sepolia_spk_public_readback.json", readback);
  writeText("docs/product/SPK_PUBLIC_READBACK.md", toMarkdown(readback));

  if (!readback.all_checks_passed) {
    throw new Error("Public SPK readback checks failed");
  }

  console.log(`Public SPK readback verified: ${txHash}`);
  console.log("Wrote state/proofs/sepolia_spk_public_readback.json");
  console.log("Wrote docs/product/SPK_PUBLIC_READBACK.md");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

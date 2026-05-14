require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const SEPOLIA_CHAIN_ID = 11155111n;
const DEFAULT_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
const MIN_RECOMMENDED_BALANCE = ethers.parseEther("0.02");

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# Sepolia Attested SPK Preflight");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- status: \`${report.status}\``);
  lines.push(`- rpc_url_configured: \`${report.environment.rpc_url_configured}\``);
  lines.push(`- private_key_configured: \`${report.environment.private_key_configured}\``);
  lines.push(`- etherscan_key_configured: \`${report.environment.etherscan_key_configured}\``);
  lines.push(`- spk_address_configured: \`${report.environment.spk_address_configured}\``);
  lines.push("");
  lines.push("## Checks");
  lines.push("");
  for (const check of report.checks) {
    lines.push(`- ${check.ok ? "PASS" : "FAIL"} \`${check.name}\`: ${check.message}`);
  }
  lines.push("");
  lines.push("## Next Commands");
  lines.push("");
  for (const command of report.next_commands) {
    lines.push(`- \`${command}\``);
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- This script never prints the private key.");
  lines.push("- It does not deploy contracts or send transactions.");
  lines.push("- Public proof requires a funded Sepolia signer, latest bytecode deployment, role setup, source verification, and then `proof:spk-attested-mint` against the deployed SPK address.");
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function check(ok, name, message, extra = {}) {
  return { ok: Boolean(ok), name, message, ...extra };
}

function hasValidPrivateKey(value) {
  return Boolean(value && /^0x[0-9a-fA-F]{64}$/.test(value) && !/^0x0{64}$/.test(value));
}

function loadArtifactCheck(root) {
  const artifactPath = path.join(root, "artifacts", "contracts", "SolarPunkCoin.sol", "SolarPunkCoin.json");
  if (!fs.existsSync(artifactPath)) {
    return check(false, "attestation_enabled_artifact", "SolarPunkCoin artifact missing. Run `npm run compile` first.");
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const names = new Set((artifact.abi || []).map((entry) => entry.name).filter(Boolean));
  const required = ["mintFromSurplusAttestation", "surplusAttestationHash", "usedSurplusSourceHashes"];
  const missing = required.filter((name) => !names.has(name));
  return check(
    missing.length === 0,
    "attestation_enabled_artifact",
    missing.length ? `Artifact missing ABI entries: ${missing.join(", ")}` : "Latest SolarPunkCoin artifact includes attested mint ABI."
  );
}

function loadBundleCheck(root) {
  const bundlePath = path.join(root, "state", "attestations", "latest_attestation_bundle.json");
  if (!fs.existsSync(bundlePath)) {
    return check(false, "meter_bundle", "Missing latest attestation bundle. Run `npm run attestations:build`.");
  }
  const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf-8"));
  const accepted = Number(bundle.summary?.accepted_records || 0);
  const signatures = Number(bundle.summary?.verified_signatures || 0);
  const surplus = Number(bundle.summary?.total_surplus_kwh || 0);
  return check(
    accepted > 0 && signatures > 0 && surplus > 0,
    "meter_bundle",
    `Bundle ready: ${accepted} accepted records, ${signatures} verified signatures, ${surplus} kWh surplus.`,
    { bundle_path: "state/attestations/latest_attestation_bundle.json" }
  );
}

async function attachedSpkCheck(provider) {
  const spkAddress = process.env.SPK_ADDRESS;
  if (!spkAddress) {
    return check(true, "attached_spk_address", "No SPK_ADDRESS configured; preflight assumes a fresh deploy path.");
  }
  if (!ethers.isAddress(spkAddress)) {
    return check(false, "attached_spk_address", "SPK_ADDRESS is not a valid address.");
  }
  const code = await provider.getCode(spkAddress);
  if (code === "0x") {
    return check(false, "attached_spk_address", `No contract code at SPK_ADDRESS ${spkAddress}.`);
  }
  const abi = [
    "function surplusAttestationHash(uint256,address,uint64,uint64,uint64,uint64,bytes32) view returns (bytes32)",
  ];
  const spk = new ethers.Contract(spkAddress, abi, provider);
  try {
    await spk.surplusAttestationHash(1, ethers.ZeroAddress, 1, 2, 1, 2, ethers.ZeroHash);
    return check(true, "attached_spk_address", `SPK_ADDRESS ${spkAddress} responds to attested mint hash function.`);
  } catch (error) {
    return check(false, "attached_spk_address", `SPK_ADDRESS ${spkAddress} does not appear attestation-enabled: ${error.shortMessage || error.message}`);
  }
}

async function main() {
  const root = path.join(__dirname, "..");
  const rpcUrl = process.env.SEPOLIA_RPC || DEFAULT_SEPOLIA_RPC;
  const privateKey = process.env.PRIVATE_KEY || "";
  const hasPk = hasValidPrivateKey(privateKey);
  const checks = [];

  checks.push(check(Boolean(rpcUrl), "rpc_url", process.env.SEPOLIA_RPC ? "SEPOLIA_RPC configured." : "Using public Sepolia RPC fallback."));
  checks.push(check(hasPk, "private_key", hasPk ? "PRIVATE_KEY is configured and syntactically valid." : "PRIVATE_KEY is missing or placeholder."));
  checks.push(check(Boolean(process.env.etherscan), "etherscan_key", process.env.etherscan ? "Etherscan API key configured for verification." : "No Etherscan API key configured; source verification will be skipped/blocking."));
  checks.push(loadArtifactCheck(root));
  checks.push(loadBundleCheck(root));

  let provider;
  try {
    provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    checks.push(check(network.chainId === SEPOLIA_CHAIN_ID, "network", `RPC chain_id=${network.chainId.toString()}.`));
  } catch (error) {
    checks.push(check(false, "network", `Could not connect to Sepolia RPC: ${error.message}`));
  }

  if (provider) {
    checks.push(await attachedSpkCheck(provider));
  }

  if (provider && hasPk) {
    const wallet = new ethers.Wallet(privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    checks.push(check(
      balance >= MIN_RECOMMENDED_BALANCE,
      "deployer_balance",
      `Signer ${wallet.address} balance is ${ethers.formatEther(balance)} Sepolia ETH; recommended minimum is ${ethers.formatEther(MIN_RECOMMENDED_BALANCE)}.`
    ));
  } else {
    checks.push(check(false, "deployer_balance", "Cannot check deployer balance without a valid PRIVATE_KEY and RPC."));
  }

  const blocking = checks.filter((item) => !item.ok);
  const report = {
    generated_at: new Date().toISOString(),
    status: blocking.length === 0 ? "ready" : "blocked",
    environment: {
      rpc_url_configured: Boolean(process.env.SEPOLIA_RPC),
      private_key_configured: hasPk,
      etherscan_key_configured: Boolean(process.env.etherscan),
      spk_address_configured: Boolean(process.env.SPK_ADDRESS),
    },
    checks,
    next_commands: [
      "npm run attestations:fixture",
      "npm run attestations:build",
      "npm run compile",
      "npm run deploy:attested-spk:preflight",
      "SPK_ADDRESS=<new_attestation_enabled_spk> npm run proof:spk-attested-mint -- --network sepolia",
      "npm run product:empirics",
    ],
  };

  const outJson = path.join(root, "state", "deployments", "sepolia_attested_spk_preflight.json");
  const outMd = path.join(root, "docs", "project", "SEPOLIA_ATTESTED_DEPLOY_PREFLIGHT.md");
  writeJson(outJson, report);
  writeMarkdown(outMd, report);
  console.log(`status=${report.status}`);
  console.log(`blocking_checks=${blocking.length}`);
  console.log(`wrote: ${outJson}`);
  console.log(`wrote: ${outMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

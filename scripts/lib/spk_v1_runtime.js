const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const RUNTIME_PATH = path.join(ROOT, "state", "runtime", "spk_v1.json");
const PUBLIC_PATH = path.join(ROOT, "frontend", "public", "spk_v1.json");

function readRuntime(root = ROOT) {
  const filePath = path.join(root, "state", "runtime", "spk_v1.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeRuntime(payload, root = ROOT) {
  const runtimePath = path.join(root, "state", "runtime", "spk_v1.json");
  const publicPath = path.join(root, "frontend", "public", "spk_v1.json");
  fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
  const body = JSON.stringify(payload, null, 2) + "\n";
  fs.writeFileSync(runtimePath, body, "utf-8");
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, body, "utf-8");
  return runtimePath;
}

function mergeRuntime(patch, root = ROOT) {
  const current = readRuntime(root) || {};
  return writeRuntime({ ...current, ...patch, updated_at: new Date().toISOString() }, root);
}

async function getSignerFor(ethers, address) {
  const signers = await ethers.getSigners();
  const found = signers.find((signer) => signer.address.toLowerCase() === address.toLowerCase());
  if (!found) {
    throw new Error(`No local signer for ${address}`);
  }
  return found;
}

module.exports = {
  ROOT,
  RUNTIME_PATH,
  PUBLIC_PATH,
  readRuntime,
  writeRuntime,
  mergeRuntime,
  getSignerFor,
};

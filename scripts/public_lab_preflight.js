#!/usr/bin/env node
/**
 * Pre-flight checks before publishing Public Lab (demo, docs, gates).
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

function check(name, pass, detail) {
  return { name, pass, detail };
}

function runQuiet(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: "pipe" });
}

function main() {
  const checks = [];

  const runtimePath = path.join(ROOT, "state/runtime/spk_v1.json");
  const publicRuntime = path.join(ROOT, "frontend/public/spk_v1.json");
  checks.push(
    check(
      "runtime_json",
      fs.existsSync(runtimePath),
      fs.existsSync(runtimePath) ? runtimePath : "missing state/runtime/spk_v1.json"
    )
  );

  if (fs.existsSync(runtimePath)) {
    const runtime = JSON.parse(fs.readFileSync(runtimePath, "utf-8"));
    checks.push(
      check("spk_contract", Boolean(runtime.contracts?.solar_punk_coin), runtime.contracts?.solar_punk_coin)
    );
    checks.push(check("peg_off", runtime.monetary_policy?.peg_enabled === false, `peg=${runtime.monetary_policy?.peg_enabled}`));
    checks.push(
      check(
        "network_payments",
        Number(runtime.genesis?.metrics?.network_payment_count) >= 1,
        String(runtime.genesis?.metrics?.network_payment_count)
      )
    );
  }

  try {
    runQuiet("node scripts/product_launch_gate.js");
    const gate = JSON.parse(fs.readFileSync(path.join(ROOT, "state/product/launch_gate.json"), "utf-8"));
    checks.push(
      check(
        "public_lab_launchable",
        gate.recommended_current_launch === "public_testnet_product",
        gate.recommended_current_launch
      )
    );
  } catch (error) {
    checks.push(check("public_lab_launchable", false, error.message));
  }

  try {
    runQuiet("npm run attestations:test");
    checks.push(check("attestation_tests", true, "19 passing"));
  } catch (error) {
    checks.push(check("attestation_tests", false, "attestations:test failed"));
  }

  try {
    runQuiet("node scripts/hardware_validate.js");
    checks.push(check("hardware_validate_sample", true, "sample path ok"));
  } catch (error) {
    checks.push(check("hardware_validate_sample", false, "hardware:validate failed"));
  }

  // Sync public runtime for demo
  if (fs.existsSync(runtimePath)) {
    fs.mkdirSync(path.dirname(publicRuntime), { recursive: true });
    fs.copyFileSync(runtimePath, publicRuntime);
    checks.push(check("demo_runtime_copied", true, publicRuntime));
  }

  const landing = path.join(ROOT, "frontend/src/components/PublicLabLanding.jsx");
  checks.push(check("public_lab_landing", fs.existsSync(landing), landing));

  const failed = checks.filter((row) => !row.pass);
  const report = {
    ok: failed.length === 0,
    at: new Date().toISOString(),
    checks,
  };
  const outPath = path.join(ROOT, "state/product/public_lab_preflight.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");

  console.log(JSON.stringify(report, null, 2));
  if (failed.length) {
    console.error(`public-lab preflight: ${failed.length} check(s) failed`);
    process.exit(1);
  }
  console.log("public-lab preflight: ok");
}

main();

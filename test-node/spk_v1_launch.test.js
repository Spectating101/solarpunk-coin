const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("fs");
const path = require("path");

const { readRuntime, ROOT } = require("../scripts/lib/spk_v1_runtime");

test("spk v1 runtime exists after launch with energy-native genesis", () => {
  const runtime = readRuntime(ROOT);
  assert.ok(runtime, "state/runtime/spk_v1.json missing — run npm run spk:v1:launch");
  assert.equal(runtime.schema, "SPK_V1_RUNTIME");
  assert.equal(runtime.monetary_policy.issuance_mode, "energy_native");
  assert.equal(runtime.monetary_policy.peg_enabled, false);
  assert.ok(runtime.contracts.solar_punk_coin);
  assert.ok(runtime.contracts.currency_system);
  assert.ok(["genesis_complete", "operating"].includes(runtime.status));
  assert.ok(runtime.genesis?.metrics?.circulation_share_percent > 0);
  assert.ok(runtime.on_chain?.total_supply_spk > 0 || runtime.genesis?.minted_spk > 0);
  assert.ok(fs.existsSync(path.join(ROOT, "frontend", "public", "spk_v1.json")));
});

const assert = require("node:assert/strict");
const test = require("node:test");

const { evaluateCurrencyFramework } = require("../scripts/currency_framework_readiness");

test("currency framework readiness detects implemented settlement and redemption mechanics", () => {
  const report = evaluateCurrencyFramework({ now: new Date("2026-05-16T00:00:00Z") });
  const checkNames = new Map(report.checks.map((check) => [check.name, check]));

  assert.equal(report.current_internal_stage, "currency_framework_lab_ready");
  assert.equal(checkNames.get("Invoice settlement contract").pass, true);
  assert.equal(checkNames.get("Redemption receipt contract").pass, true);
  assert.equal(checkNames.get("Delivery resolution and dispute state").pass, true);
  assert.equal(checkNames.get("Contract regression tests").pass, true);
  assert.ok(report.mechanism_path.includes("redemption_burn"));
});

test("currency framework readiness keeps external readiness out of internal stage", () => {
  const report = evaluateCurrencyFramework({ now: new Date("2026-05-16T00:00:00Z") });

  assert.match(report.internal_boundary, /does not assert legal, audit, market, or mainnet readiness/);
  assert.equal(report.next_build_targets[0].name, "Field receipt loop");
});

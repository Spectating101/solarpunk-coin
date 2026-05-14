const assert = require("node:assert/strict");
const test = require("node:test");

const { daysSince, evaluateLaunchGate, statusFromChecks } = require("../scripts/product_launch_gate");

test("daysSince compares UTC calendar days", () => {
  const now = new Date("2026-05-14T23:59:59Z");
  assert.equal(daysSince("2026-05-14", now), 0);
  assert.equal(daysSince("2026-05-12", now), 2);
});

test("statusFromChecks blocks when any blocking check fails", () => {
  assert.equal(statusFromChecks([{ pass: true }, { pass: true }]), "launchable");
  assert.equal(statusFromChecks([{ pass: true }, { pass: false }]), "blocked");
});

test("current repository is launchable as public testnet product only", () => {
  const report = evaluateLaunchGate({ now: new Date("2026-05-14T12:00:00Z") });
  assert.equal(report.modes.public_testnet_product.status, "launchable");
  assert.equal(report.modes.closed_testnet_pilot.status, "blocked");
  assert.equal(report.modes.paid_mainnet_product.status, "blocked");
  assert.equal(report.recommended_current_launch, "public_testnet_product");
});

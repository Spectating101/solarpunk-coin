const assert = require("node:assert/strict");
const test = require("node:test");
const { ethers } = require("ethers");
const { buildMeter, upsertMeter } = require("../scripts/onboard_meter");

test("builds and inserts a new meter registry entry", () => {
  const address = ethers.Wallet.createRandom().address;
  const { meter } = buildMeter({
    meterId: "TW-TY-0099",
    siteId: "pilot-rooftop",
    deviceAddress: address,
    capacityKw: "42.5",
    activeAfter: "2026-01-01T00:00:00Z",
    activeUntil: "2027-01-01T00:00:00Z",
  });
  const registry = upsertMeter({ schema: "SPK_METER_REGISTRY_V1", meters: [] }, meter);

  assert.equal(registry.meters.length, 1);
  assert.equal(registry.meters[0].meter_id, "TW-TY-0099");
  assert.equal(registry.meters[0].device_address, ethers.getAddress(address));
});

test("blocks duplicate meter onboarding unless replace is explicit", () => {
  const address = ethers.Wallet.createRandom().address;
  const { meter } = buildMeter({
    meterId: "TW-TY-0099",
    siteId: "pilot-rooftop",
    deviceAddress: address,
    capacityKw: "42.5",
    activeAfter: "2026-01-01T00:00:00Z",
    activeUntil: "2027-01-01T00:00:00Z",
  });
  const registry = upsertMeter({ schema: "SPK_METER_REGISTRY_V1", meters: [] }, meter);

  assert.throws(() => upsertMeter(registry, meter), /already exists/);
  assert.equal(upsertMeter(registry, meter, { replace: true }).meters.length, 1);
});

test("rejects invalid meter onboarding parameters", () => {
  assert.throws(
    () =>
      buildMeter({
        meterId: "TW-TY-0099",
        siteId: "pilot-rooftop",
        deviceAddress: "not-an-address",
        capacityKw: "42.5",
        activeAfter: "2026-01-01T00:00:00Z",
        activeUntil: "2027-01-01T00:00:00Z",
      }),
    /device_address/
  );

  assert.throws(
    () =>
      buildMeter({
        meterId: "TW-TY-0099",
        siteId: "pilot-rooftop",
        deviceAddress: ethers.Wallet.createRandom().address,
        capacityKw: "0",
        activeAfter: "2026-01-01T00:00:00Z",
        activeUntil: "2027-01-01T00:00:00Z",
      }),
    /capacity_kw/
  );
});

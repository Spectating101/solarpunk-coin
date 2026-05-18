const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildPilotCsvReceipt,
  mintPreviewFromBundle,
} = require("../scripts/pilot_csv_receipt");
const { DEVICE_KEYS } = require("../scripts/build_signed_meter_fixture");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("pilot CSV proof converts signed CSV rows into mint preview", async () => {
  const receipt = await buildPilotCsvReceipt({
    now: "2026-05-16T00:00:00Z",
    generatedAt: new Date("2026-05-16T00:00:00Z"),
    useDevFixtureKey: true,
  });

  assert.equal(receipt.execution_mode, "dev_fixture_signed_sample");
  assert.equal(receipt.attestation_bundle.summary.accepted_records, 2);
  assert.equal(receipt.attestation_bundle.summary.rejected_records, 0);
  assert.equal(receipt.attestation_bundle.summary.total_surplus_kwh, 1985.5);
  assert.equal(receipt.mint_preview.onchain_surplus_kwh, 1985);
  assert.equal(receipt.mint_preview.net_spk, 99.15075);
  assert.equal(receipt.mint_preview.can_mint_spk_from_bundle, true);
  assert.equal(receipt.input.private_key_written_to_repo, false);
});

test("pilot CSV unsigned mode remains review-only and cannot mint", async () => {
  const receipt = await buildPilotCsvReceipt({
    now: "2026-05-16T00:00:00Z",
    generatedAt: new Date("2026-05-16T00:00:00Z"),
    unsigned: true,
  });

  assert.equal(receipt.execution_mode, "unsigned_review");
  assert.equal(receipt.attestation_bundle.summary.accepted_records, 0);
  assert.equal(receipt.mint_preview.can_mint_spk_from_bundle, false);
  assert.deepEqual(
    receipt.attestation_bundle.rejected_attestations.map((item) => item.reason),
    ["invalid meter signature", "invalid meter signature"]
  );
});

test("pilot CSV unsigned flag wins even if a private key is present", async () => {
  const receipt = await buildPilotCsvReceipt({
    now: "2026-05-16T00:00:00Z",
    generatedAt: new Date("2026-05-16T00:00:00Z"),
    privateKey: DEVICE_KEYS["TW-TY-0001"],
    unsigned: true,
  });

  assert.equal(receipt.execution_mode, "unsigned_review");
  assert.equal(receipt.input.unsigned, true);
  assert.equal(receipt.attestation_bundle.summary.accepted_records, 0);
  assert.equal(receipt.mint_preview.can_mint_spk_from_bundle, false);
});

test("mint preview floors fractional kWh before SPK issuance math", async () => {
  const receipt = await buildPilotCsvReceipt({
    now: "2026-05-16T00:00:00Z",
    generatedAt: new Date("2026-05-16T00:00:00Z"),
    useDevFixtureKey: true,
  });
  const preview = mintPreviewFromBundle(receipt.attestation_bundle, {
    energyPriceUsdPerKwh: 0.05,
    mintFeeBps: 10,
  });

  assert.equal(preview.onchain_surplus_kwh, 1985);
  assert.equal(preview.unminted_fractional_kwh, 0.5);
  assert.equal(preview.gross_spk, 99.25);
  assert.equal(preview.mint_fee_spk, 0.09925);
  assert.equal(preview.net_spk, 99.15075);
});

test("generated pilot CSV artifact keeps private-key and hardware boundaries explicit", () => {
  const receipt = readJson("state/product/pilot_csv_receipt.json");

  assert.equal(receipt.input.private_key_written_to_repo, false);
  assert.ok(receipt.hard_boundaries.includes("This proof does not certify hardware finality."));
  assert.ok(receipt.hard_boundaries.includes("No private key is written to repo outputs."));
});

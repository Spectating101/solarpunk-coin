const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildSpkFinanceDossier,
  feeRevenue,
} = require("../scripts/spk_finance_dossier");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf-8"));
}

test("fee revenue model respects configured bps rates", () => {
  const fees = feeRevenue({
    issuedSpk: 1000,
    redeemedSpk: 500,
    settlementVolumeSpk: 2000,
    mintFeeBps: 10,
    redemptionFeeBps: 20,
    settlementFeeBps: 5,
  });

  assert.equal(fees.mint_fee_revenue_usd, 1);
  assert.equal(fees.redemption_fee_revenue_usd, 1);
  assert.equal(fees.settlement_fee_revenue_usd, 1);
  assert.equal(fees.total_fee_revenue_usd, 3);
});

test("finance dossier exposes protocol-fee break-even gap", () => {
  const report = buildSpkFinanceDossier({
    now: new Date("2026-05-17T00:00:00Z"),
    config: { annualOperatingExpenseUsd: 120000 },
  });

  assert.ok(report.annualized_income_statement.total_protocol_fee_revenue_usd > 0);
  assert.ok(report.annualized_income_statement.total_protocol_fee_revenue_usd < 120000);
  assert.ok(report.break_even_analysis.fee_base_gap_multiple > 1000);
  assert.equal(report.finance_readiness.stage, "finance_model_ready_but_capital_and_revenue_blocked");
  assert.ok(report.finance_readiness.blockers.includes("fee_model_self_funding"));
});

test("finance dossier maps active supply to energy liability", () => {
  const report = buildSpkFinanceDossier({
    now: new Date("2026-05-17T00:00:00Z"),
  });

  assert.equal(report.monetary_unit_economics.implied_spk_unit_usd, 1);
  assert.equal(
    Number(report.balance_sheet_view.outstanding_energy_liability_usd_at_basis.toFixed(6)),
    Number(report.balance_sheet_view.active_supply_spk.toFixed(6))
  );
  assert.ok(report.balance_sheet_view.outstanding_energy_claim_kwh > 0);
});

test("generated finance dossier keeps hard finance boundaries", () => {
  const report = readJson("state/product/spk_finance_dossier.json");

  assert.match(report.finance_thesis, /balance sheet/);
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("not investment advice")));
  assert.ok(report.hard_boundaries.some((boundary) => boundary.includes("not current realized revenue")));
});

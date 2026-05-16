const assert = require("node:assert/strict");
const test = require("node:test");

const { toMarkdown: deploymentMarkdown } = require("../scripts/deploy_pilot_stack");
const {
  allPassed,
  check,
  toMarkdown: readbackMarkdown,
} = require("../scripts/read_pilot_stack");

const ADDRESS_A = "0x0000000000000000000000000000000000000001";
const ADDRESS_B = "0x0000000000000000000000000000000000000002";
const TX_A = "0x1111111111111111111111111111111111111111111111111111111111111111";
const TX_B = "0x2222222222222222222222222222222222222222222222222222222222222222";

test("pilot stack deployment markdown captures contracts, roles, and boundaries", () => {
  const markdown = deploymentMarkdown({
    generated_at: "2026-05-17T00:00:00.000Z",
    network: "sepolia",
    chain_id: 11155111,
    scope: "governed-pilot-testnet-stack",
    deployer: ADDRESS_A,
    governance_admin: ADDRESS_B,
    strict_admin_handoff: true,
    contracts: {
      MockUSDC: { address: ADDRESS_A, tx: TX_A },
      SolarPunkCoin: { address: ADDRESS_B, tx: TX_B },
    },
    roles: {
      minter: ADDRESS_A,
      oracle: ADDRESS_A,
      reserve_manager: ADDRESS_B,
      currency_operator: ADDRESS_B,
    },
    initial_parameters: {
      reserve_seed_usdc: "100000.0",
      energy_price_usd_per_kwh: "0.05",
      oracle_price_usd: "1.0",
      spk_governance_delay_seconds: 0,
      treasury_governance_delay_seconds: 0,
    },
    transactions: {
      deploy_mock_usdc: TX_A,
      deploy_spk: TX_B,
    },
    boundaries: ["test boundary"],
    receipt_path: "state/deployments/sepolia_pilot_stack.json",
  });

  assert.match(markdown, /Governed Pilot Stack Deployment/);
  assert.match(markdown, /SolarPunkCoin/);
  assert.match(markdown, /reserve_manager/);
  assert.match(markdown, /test boundary/);
  assert.match(markdown, /sepolia.etherscan.io\/tx/);
});

test("pilot stack readback helpers report pass state and markdown checks", () => {
  const checks = [
    check("a", true, "ok"),
    check("b", true, "ok"),
  ];
  const failingChecks = [
    check("a", true, "ok"),
    check("b", false, "bad"),
  ];

  assert.equal(allPassed(checks), true);
  assert.equal(allPassed(failingChecks), false);

  const markdown = readbackMarkdown({
    generated_at: "2026-05-17T00:00:00.000Z",
    network: "sepolia",
    chain_id: 11155111,
    receipt_path: "state/deployments/sepolia_pilot_stack.json",
    all_checks_passed: true,
    contracts: {
      MockUSDC: { address: ADDRESS_A, code_present: true },
    },
    state: {
      spk_owner: ADDRESS_A,
      energy_price_usd_per_kwh: "0.05",
    },
    checks,
  });

  assert.match(markdown, /Pilot Stack Readback/);
  assert.match(markdown, /all_checks_passed/);
  assert.match(markdown, /Code present/);
  assert.match(markdown, /spk_owner/);
});

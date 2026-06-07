const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const UNIT = 1_000_000;

function readJson(root, relativePath, fallback = null) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

function toUnits(value) {
  return Math.round(Number(value) * UNIT);
}

function fromUnits(units, digits = 6) {
  return Number((units / UNIT).toFixed(digits));
}

function fixed(value, digits = 4) {
  return Number(Number(value).toFixed(digits));
}

function applyTransfer(balances, tx) {
  if (tx.from) {
    balances[tx.from] = (balances[tx.from] || 0) - tx.amount_units;
    if (balances[tx.from] < 0) {
      throw new Error(`negative balance for ${tx.from}`);
    }
  }
  if (tx.to) {
    balances[tx.to] = (balances[tx.to] || 0) + tx.amount_units;
  }
}

function tx(kind, from, to, amountSpk, note) {
  return {
    kind,
    from,
    to,
    amount_units: toUnits(amountSpk),
    amount_spk: fixed(amountSpk, 6),
    note,
  };
}

function buildLedger(mintedSpk, options = {}) {
  const kwhPerSpk = Number(options.kwhPerSpk || 1);
  const redeemedSpk = Number(options.redeemedSpk || 15);
  const producer = "taoyuan_rooftop_producer";
  const gateway = "meter_gateway_operator";
  const maintenance = "maintenance_provider";
  const buyer = "community_energy_buyer";
  const merchant = "local_service_merchant";
  const burn = "optional_energy_exit";

  const transactions = [
    tx("mint", null, producer, mintedSpk, "SPK minted from verified surplus energy (issuance anchor)."),
    tx("network_payment", producer, gateway, 12, "Producer pays gateway for attestation service (SERVICE)."),
    tx("network_payment", producer, maintenance, 40, "Producer pays maintenance in SPK (LABOR)."),
    tx("network_payment", producer, buyer, 180, "Producer seeds local network circulation (NETWORK)."),
    tx("network_payment", buyer, merchant, 55, "Buyer spends SPK on local goods (GOODS)."),
    tx("network_payment", merchant, producer, 20, "Merchant settles supply invoice back to producer (GOODS)."),
    tx(
      "optional_redemption",
      buyer,
      burn,
      redeemedSpk,
      "Optional energy exit — secondary sink, not the primary money identity."
    ),
  ];

  const balances = {};
  for (const item of transactions) {
    applyTransfer(balances, item);
    if (item.kind === "optional_redemption") {
      item.energy_kwh_equivalent = fixed(item.amount_spk * kwhPerSpk, 4);
    }
    if (item.kind === "network_payment") {
      item.payment_kind = item.note.match(/\(([^)]+)\)/)?.[1] || "NETWORK";
    }
  }

  const mintedUnits = transactions
    .filter((item) => item.kind === "mint")
    .reduce((sum, item) => sum + item.amount_units, 0);
  const redeemedUnits = transactions
    .filter((item) => item.kind === "optional_redemption")
    .reduce((sum, item) => sum + item.amount_units, 0);
  const settlementVolumeUnits = transactions
    .filter((item) => item.kind === "network_payment")
    .reduce((sum, item) => sum + item.amount_units, 0);
  const activeSupplyUnits = Object.entries(balances)
    .filter(([name]) => name !== burn)
    .reduce((sum, [, amount]) => sum + amount, 0);

  return {
    actors: [producer, gateway, maintenance, buyer, merchant],
    transactions,
    balances: Object.fromEntries(
      Object.entries(balances)
        .filter(([name]) => name !== burn)
        .map(([name, units]) => [name, fromUnits(units)])
    ),
    accounting: {
      minted_spk: fromUnits(mintedUnits),
      redeemed_spk: fromUnits(redeemedUnits),
      active_supply_spk: fromUnits(activeSupplyUnits),
      settlement_volume_spk: fromUnits(settlementVolumeUnits),
      velocity_ratio: fixed(settlementVolumeUnits / mintedUnits, 4),
      circulation_share: fixed(settlementVolumeUnits / (settlementVolumeUnits + redeemedUnits), 4),
      redemption_share: fixed(redeemedUnits / (settlementVolumeUnits + redeemedUnits), 4),
      redeemed_energy_kwh_equivalent: fixed(fromUnits(redeemedUnits) * kwhPerSpk, 4),
      remaining_energy_kwh_equivalent: fixed(fromUnits(activeSupplyUnits) * kwhPerSpk, 4),
      conservation_pass: mintedUnits === activeSupplyUnits + redeemedUnits,
    },
  };
}

function buildCurrencyLab(options = {}) {
  const root = options.root || ROOT;
  const product = readJson(root, "state/proofs/spk_product_empirics.json", {});
  const readback = readJson(root, "state/proofs/sepolia_spk_public_readback.json", {});
  const launchGate = readJson(root, "state/product/launch_gate.json", {});
  const meter = product.meter_to_mint || {};
  const operational = product.operational_basis || {};
  const energyPrice = Number(readback.onchain?.energy_price_usd_per_kwh || 0.05);
  const surplusKwh = Number(meter.total_surplus_kwh || 2606);
  const mintedSpkEnergyNative = Number((surplusKwh * 0.999).toFixed(4));
  const mintedSpkSepoliaProof = Number(meter.minted_spk || 0);
  const ledger = buildLedger(mintedSpkEnergyNative, { kwhPerSpk: 1, redeemedSpk: 15 });

  return {
    generated_at: (options.now || new Date()).toISOString(),
    title: "SolarPunk Currency System Lab",
    thesis:
      "SPK is network money issued against verified energy surplus: circulation-first settlement with optional energy exit, not a dollar clone or utility coupon.",
    monetary_model: {
      issuance_anchor: "verified_surplus_kwh",
      primary_use: "network_settlement",
      secondary_sink: "optional_energy_redemption",
      peg_policy: "off_by_default",
      unit_mode: "energy_native",
    },
    source_evidence: {
      spk_contract: meter.contract_address,
      currency_framework_contract: "contracts/SolarPunkCurrencySystem.sol",
      local_spk_loop: "docs/product/FIELD_RECEIPT_LOOP.md",
      mint_tx: meter.tx_hash,
      source_hash: meter.source_hash,
      attestation_hash: meter.attestation_hash,
      accepted_surplus_kwh: meter.total_surplus_kwh,
      minted_spk_sepolia_dollar_translated: mintedSpkSepoliaProof,
      minted_spk_energy_native_model: mintedSpkEnergyNative,
      energy_price_usd_per_kwh: energyPrice,
      reference_quote_only: true,
      daily_keeper_runs: operational.total_successful_runs,
      latest_keeper_run: operational.last_successful_run,
      launch_gate: launchGate.recommended_current_launch || "unknown",
    },
    layers: [
      {
        id: 1,
        name: "Public lab primitive",
        status: "real_public_testnet",
        claim: "Signed meter fixture data has produced a replay-protected SPK mint on Sepolia with public readback.",
        evidence: ["docs/product/SPK_ATTESTED_MINT_PROOF.md", "docs/product/SPK_PUBLIC_READBACK.md"],
        blocker_to_upgrade: null,
      },
      {
        id: 2,
        name: "Local SPK settlement loop",
        status: "local_spk_settlement_loop",
        claim: "The accepted meter bundle now runs through a local end-to-end loop: SPK mint, invoice settlement, redemption burn, owed-kWh claim, and delivery resolution.",
        evidence: ["docs/product/FIELD_RECEIPT_LOOP.md", "state/product/field_receipt_loop.json"],
        blocker_to_upgrade: "Replace fixture meter data with one real meter or inverter export.",
      },
      {
        id: 3,
        name: "Redeemable SPK framework",
        status: "local_contract_tested",
        claim: "SPK can be transferred into SolarPunkCurrencySystem, burned through redeemForEnergy, and recorded as an owed-kWh claim with fulfillment/shortfall/dispute states.",
        evidence: ["contracts/SolarPunkCurrencySystem.sol", "test/SolarPunkCurrencySystem.test.js"],
        blocker_to_upgrade: "Deploy beside the attested SPK proof stack and bind to one real redemption operator.",
      },
      {
        id: 4,
        name: "Networked settlement framework",
        status: "local_contract_tested",
        claim: "SPK network payments are the primary money path; typed invoice settlement tracks GOODS/SERVICE/LABOR circulation with optional redemption as a secondary sink.",
        evidence: [
          "contracts/SolarPunkCurrencySystem.sol",
          "state/product/currency_system_lab.json",
          "docs/product/NETWORK_MONEY.md",
        ],
        blocker_to_upgrade: "Deploy and run one real invoice/counterparty settlement.",
      },
    ],
    ledger,
    claim_boundaries: [
      "Layer 1 is public Sepolia evidence.",
      "Layer 2 is a deterministic local SPK loop, not a real external pilot.",
      "Layers 3-4 now have local contract/test coverage, but no public deployment or real commercial adoption.",
      "No token sale, mainnet readiness, yield, audit completion, or legal redemption claim is made.",
      "The purpose is to move from local SPK coherence to a real meter export loop.",
    ],
  };
}

function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# SolarPunk Currency System Lab");
  lines.push("");
  lines.push(`- generated_at: \`${report.generated_at}\``);
  lines.push(`- thesis: ${report.thesis}`);
  lines.push("");
  lines.push("## Source Evidence");
  lines.push("");
  lines.push("| Item | Value |");
  lines.push("|---|---:|");
  lines.push(`| SPK contract | \`${report.source_evidence.spk_contract}\` |`);
  lines.push(`| Currency framework contract | \`${report.source_evidence.currency_framework_contract}\` |`);
  lines.push(`| Local SPK loop | \`${report.source_evidence.local_spk_loop}\` |`);
  lines.push(`| Mint tx | \`${report.source_evidence.mint_tx}\` |`);
  lines.push(`| Accepted surplus | \`${report.source_evidence.accepted_surplus_kwh}\` kWh |`);
  lines.push(`| Minted SPK (Sepolia dollar-translated proof) | \`${report.source_evidence.minted_spk_sepolia_dollar_translated}\` |`);
  lines.push(`| Minted SPK (energy-native model) | \`${report.source_evidence.minted_spk_energy_native_model}\` |`);
  lines.push(`| Energy price | \`$${report.source_evidence.energy_price_usd_per_kwh}/kWh\` |`);
  lines.push(`| Daily keeper runs | \`${report.source_evidence.daily_keeper_runs}\` |`);
  lines.push(`| Latest keeper run | \`${report.source_evidence.latest_keeper_run}\` |`);
  lines.push("");
  lines.push("## Four-Layer Thunder Path");
  lines.push("");
  lines.push("| Layer | Name | Status | Claim | Upgrade blocker |");
  lines.push("|---:|---|---|---|---|");
  for (const layer of report.layers) {
    lines.push(`| ${layer.id} | ${layer.name} | \`${layer.status}\` | ${layer.claim} | ${layer.blocker_to_upgrade || "none"} |`);
  }
  lines.push("");
  lines.push("## Settlement Ledger");
  lines.push("");
  lines.push("| Step | Type | From | To | SPK | Note |");
  lines.push("|---:|---|---|---|---:|---|");
  report.ledger.transactions.forEach((item, index) => {
    lines.push(`| ${index + 1} | ${item.kind} | ${item.from || "protocol"} | ${item.to} | ${item.amount_spk} | ${item.note} |`);
  });
  lines.push("");
  lines.push("## Accounting");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---:|");
  lines.push(`| Minted SPK | \`${report.ledger.accounting.minted_spk}\` |`);
  lines.push(`| Active supply after redemption | \`${report.ledger.accounting.active_supply_spk}\` |`);
  lines.push(`| Redeemed SPK | \`${report.ledger.accounting.redeemed_spk}\` |`);
  lines.push(`| Settlement volume | \`${report.ledger.accounting.settlement_volume_spk}\` |`);
  lines.push(`| Velocity ratio | \`${report.ledger.accounting.velocity_ratio}\` |`);
  lines.push(`| Circulation share | \`${report.ledger.accounting.circulation_share}\` |`);
  lines.push(`| Redemption share | \`${report.ledger.accounting.redemption_share}\` |`);
  lines.push(`| Redeemed energy equivalent | \`${report.ledger.accounting.redeemed_energy_kwh_equivalent}\` kWh |`);
  lines.push(`| Remaining energy equivalent | \`${report.ledger.accounting.remaining_energy_kwh_equivalent}\` kWh |`);
  lines.push(`| Conservation check | \`${report.ledger.accounting.conservation_pass}\` |`);
  lines.push("");
  lines.push("## Claim Boundaries");
  lines.push("");
  for (const boundary of report.claim_boundaries) {
    lines.push(`- ${boundary}`);
  }
  lines.push("");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function main() {
  const report = buildCurrencyLab();
  const jsonPath = path.join(ROOT, "state", "product", "currency_system_lab.json");
  const mdPath = path.join(ROOT, "docs", "product", "CURRENCY_SYSTEM_LAB.md");
  writeJson(jsonPath, report);
  writeMarkdown(mdPath, report);
  console.log(`currency_lab=${report.layers.length}_layers`);
  console.log(`conservation_pass=${report.ledger.accounting.conservation_pass}`);
  console.log(`velocity_ratio=${report.ledger.accounting.velocity_ratio}`);
  console.log(`wrote: ${jsonPath}`);
  console.log(`wrote: ${mdPath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildCurrencyLab,
  buildLedger,
};

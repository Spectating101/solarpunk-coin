#!/usr/bin/env node

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [rawKey, rawValue] = arg.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    out[key] = rawValue === undefined ? true : rawValue;
  }
  return out;
}

function readNumber(args, name, fallback) {
  const envName = name.replace(/[A-Z]/g, (char) => `_${char}`).toUpperCase();
  const value = args[name] ?? process.env[envName] ?? fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value for ${name}: ${value}`);
  }
  return parsed;
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const monthlyMintKwh = readNumber(args, "monthlyMintKwh", 200000);
  const monthlyRedeemSpk = readNumber(args, "monthlyRedeemSpk", 50000);
  const monthlyTradingVolumeUsd = readNumber(args, "monthlyTradingVolumeUsd", 100000);
  const tradingFeeBps = readNumber(args, "tradingFeeBps", 50);
  const liquidationPenaltiesUsd = readNumber(args, "liquidationPenaltiesUsd", 250);
  const bondSlashesUsd = readNumber(args, "bondSlashesUsd", 100);
  const monthlyOpsCostUsd = readNumber(args, "monthlyOpsCostUsd", 500);
  const feeRate = 0.001;
  const tradingFeeRate = tradingFeeBps / 10_000;

  const mintFeeUsd = monthlyMintKwh * feeRate;
  const redeemFeeUsd = monthlyRedeemSpk * feeRate;
  const tradingFeeUsd = monthlyTradingVolumeUsd * tradingFeeRate;
  const feeRevenueUsd = mintFeeUsd + redeemFeeUsd;
  const nonFeeRevenueUsd = liquidationPenaltiesUsd + bondSlashesUsd + tradingFeeUsd;
  const totalRevenueUsd = feeRevenueUsd + nonFeeRevenueUsd;
  const monthlyNetUsd = totalRevenueUsd - monthlyOpsCostUsd;
  const requiredFeeVolumeUsd = Math.max(0, monthlyOpsCostUsd - nonFeeRevenueUsd) / feeRate;
  const annualNetUsd = monthlyNetUsd * 12;

  console.log("=== SolarPunk Treasury Break-even Model ===");
  console.log(`Fee rate: ${formatNumber(feeRate * 100)}%`);
  console.log("");
  console.log("Inputs");
  console.log(`  Monthly mint volume:        ${formatNumber(monthlyMintKwh)} kWh-equivalent`);
  console.log(`  Monthly redeem volume:      ${formatNumber(monthlyRedeemSpk)} SPK-equivalent`);
  console.log(`  Monthly trading volume:     ${formatUsd(monthlyTradingVolumeUsd)}`);
  console.log(`  Trading fee rate:           ${formatNumber(tradingFeeRate * 100)}%`);
  console.log(`  Liquidation penalties:      ${formatUsd(liquidationPenaltiesUsd)}`);
  console.log(`  Bond slashes:               ${formatUsd(bondSlashesUsd)}`);
  console.log(`  Monthly ops cost:           ${formatUsd(monthlyOpsCostUsd)}`);
  console.log("");
  console.log("Revenue");
  console.log(`  Mint fees:                  ${formatUsd(mintFeeUsd)}`);
  console.log(`  Redemption fees:            ${formatUsd(redeemFeeUsd)}`);
  console.log(`  Trading fees:               ${formatUsd(tradingFeeUsd)}`);
  console.log(`  Liquidation penalties:      ${formatUsd(liquidationPenaltiesUsd)}`);
  console.log(`  Bond slashes:               ${formatUsd(bondSlashesUsd)}`);
  console.log(`  Total monthly revenue:      ${formatUsd(totalRevenueUsd)}`);
  console.log("");
  console.log("Break-even");
  console.log(`  Monthly net:                ${formatUsd(monthlyNetUsd)}`);
  console.log(`  Annual net:                 ${formatUsd(annualNetUsd)}`);
  console.log(`  Fee volume needed to cover ops after penalties: ${formatUsd(requiredFeeVolumeUsd)}`);
  console.log("");
  console.log("Interpretation");
  console.log(
    monthlyNetUsd >= 0
      ? "  This scenario clears the monthly ops budget."
      : "  This scenario still needs more fee volume or lower costs."
  );
}

main();

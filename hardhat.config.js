require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const fs = require("fs");
const os = require("os");
const path = require("path");

const POLYGON_AMOY_RPC = process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology/";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

// In this environment, writes into the repo can fail with EACCES at runtime.
// Put Hardhat's writable outputs under /tmp so tests/compiles can run reliably.
const HARDHAT_TMP_BASE =
  process.env.HARDHAT_TMP_DIR || path.join(os.tmpdir(), "solarpunk-bitcoin-hardhat");
fs.mkdirSync(HARDHAT_TMP_BASE, { recursive: true });

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    amoy: {
      url: POLYGON_AMOY_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
    // Mumbai deprecated April 2024 - kept for historical reference only
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    outputFile: path.join(HARDHAT_TMP_BASE, "gas-report.txt"),
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: path.join(HARDHAT_TMP_BASE, "cache"),
    // Keep artifacts in-repo so offline `--no-compile` tests can run using committed artifacts.
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};

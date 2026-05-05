export const CONTRACTS = {
  protocolTreasury: "0x138e793f095a33D2790349eC1066FED3A756dd2c",
  solarPunkCoin: "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  solarPunkOption: "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
  stabilityPool: "0xb9c2Ac8166edFc899b591bc51746d75bFCEca086",
  oracleAdapter: "0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9",
  safe: "0xB95586775C73feB0154828c77832E106425C818A",
  mockUsdc: "0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2",
};

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
export const FALLBACK_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
export const SEPOLIA_RPC_URL = normalizeSepoliaRpc(import.meta.env.VITE_RPC_URL);
export const GITHUB_REPO = "https://github.com/Spectating101/solarpunk-coin";
export const KEEPER_WORKFLOW = `${GITHUB_REPO}/actions/workflows/nasa_keeper.yml`;

function normalizeSepoliaRpc(url) {
  if (!url || url.includes("rpc.sepolia.org")) {
    return FALLBACK_SEPOLIA_RPC;
  }

  return url;
}

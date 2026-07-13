/** Canonical SPK v1 Public Lab stack (see frontend/public/spk_v1.json). */
export const SPK_V1 = {
  solarPunkCoin: "0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128",
  currencySystem: "0x520162252F9B94824417678525FFd69145014970",
  mockUsdc: "0xaD2A7169CfFBA9Bef8C45515fc85178DbBfEc2C9",
  deployer: "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
  launchMode: "unified_sepolia_lean",
};

/** Legacy options / treasury demo stack — not canonical for network money. */
export const CONTRACTS = {
  protocolTreasury: "0x138e793f095a33D2790349eC1066FED3A756dd2c",
  solarPunkCoin: "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F",
  solarPunkOption: "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104",
  stabilityPool: "0xb9c2Ac8166edFc899b591bc51746d75bFCEca086",
  oracleAdapter: "0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9",
  safe: "0xB95586775C73feB0154828c77832E106425C818A",
  mockUsdc: "0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2",
  energyRevenueFloor: "0x0000000000000000000000000000000000000000",
  attestedSolarPunkCoin: "0x8ceDa149EDE44078bf151b3334513916a84df820",
  attestedMockUsdc: "0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268",
  attestedProtocolTreasury: "0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F",
  attestedMintTx: "0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d",
};

export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";
export const FALLBACK_SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
export const SEPOLIA_RPC_URL = normalizeSepoliaRpc(import.meta.env.VITE_RPC_URL);
export const GITHUB_REPO = "https://github.com/Spectating101/solarpunk-coin";
/** The SPK reference tab retains the old v10 development PDF link until the final revised PDF is published as a repository artifact. */
export const THESIS_CANONICAL_URL = `${GITHUB_REPO}/blob/main/energy_constraint_thesis_final_submission_v10.pdf`;
export const THESIS_LINK_STATUS = "temporary_v10_pending_final_pdf_publication";
export const CEIR_DIAGNOSIS_URL = `${GITHUB_REPO}/blob/main/thesis_package/CEIR_FINAL_DIAGNOSIS.md`;
export const KEEPER_WORKFLOW = `${GITHUB_REPO}/actions/workflows/nasa_keeper.yml`;
export const PUBLIC_LAB_INQUIRY_URL = `${GITHUB_REPO}/issues/new?template=energy-data-experiment.md`;
export const HARDWARE_QUICKSTART_URL = `${GITHUB_REPO}/blob/main/docs/product/HARDWARE_OPERATOR_QUICKSTART.md`;
export const PUBLIC_LAB_DEPLOYMENT_URL = `${GITHUB_REPO}/blob/main/docs/product/PUBLIC_LAB_DEPLOYMENT.md`;
export const OPEN_LAB_WORKFLOWS_URL = `${GITHUB_REPO}/blob/main/docs/project/OPEN_LAB_WORKFLOWS.md`;
export const PUBLIC_LAB_DEMO_URL = "https://spectating101.github.io/solarpunk-coin/demo/";
export const DOCS_MAP_URL = `${GITHUB_REPO}/blob/main/DOCS.md`;

export const LIVE_OPTION_SERIES = {
  id: "0xd49655e45fedd336468b39b170f4a6fef123c5e96b4b3745a8de5def356a5637",
  label: "Live Sepolia Series A",
};

function normalizeSepoliaRpc(url) {
  if (!url || url.includes("rpc.sepolia.org")) {
    return FALLBACK_SEPOLIA_RPC;
  }

  return url;
}

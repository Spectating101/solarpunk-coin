# Contract addresses (Sepolia)

Network: Ethereum Sepolia · chain `11155111`  
Deployer: `0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54`

**Canonical state:** `state/runtime/spk_v1.json`

---

## SPK v1 — canonical product (Jun 2026)

Energy-native token + network payment contract. Source verified on Etherscan.

| Contract | Address | Etherscan |
|----------|---------|-----------|
| SolarPunkCoin | `0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128` | [code](https://sepolia.etherscan.io/address/0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128#code) |
| SolarPunkCurrencySystem | `0x520162252F9B94824417678525FFd69145014970` | [code](https://sepolia.etherscan.io/address/0x520162252F9B94824417678525FFd69145014970#code) |
| MockUSDC (reserve lab) | `0xaD2A7169CfFBA9Bef8C45515fc85178DbBfEc2C9` | [code](https://sepolia.etherscan.io/address/0xaD2A7169CfFBA9Bef8C45515fc85178DbBfEc2C9#code) |

---

## Archive — May 2026 attested proof

Dollar-basis mint demo. Thesis historical evidence; not the current product stack.

| Item | Address / tx |
|------|----------------|
| Attestation-enabled SPK | `0x8ceDa149EDE44078bf151b3334513916a84df820` |
| Signed-meter mint tx | `0x56fc987417f0d73e27cf29c81ad206bd2658c917eb7e5e67aececc54a732c75d` |
| Proof MockUSDC | `0xB9e769e347Fa1e5e9f4088FA1c5bc63A23De5268` |
| Proof Treasury | `0xeF105f48ef7d54dc1E6400E4a2D3f330Fb1d875F` |

---

## Archive — April 2026 legacy stack (options / keeper demo)

Safe multisig on core contracts. Frontend archive tabs still read these.

| Contract | Address |
|----------|---------|
| SolarPunkCoin | `0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F` |
| SolarPunkOption | `0xe40A88398b5f90D038f7A6F1f122112DCD9e4104` |
| ProtocolTreasury | `0x138e793f095a33D2790349eC1066FED3A756dd2c` |
| StabilityPool | `0xb9c2Ac8166edFc899b591bc51746d75bFCEca086` |
| ChainlinkOracleAdapter | `0x87B64cd4cE7C95a3A2465aE1e4E71582A64820C9` |
| Safe (1/1 admin) | `0xB95586775C73feB0154828c77832E106425C818A` |
| MockUSDC | `0xa467ab7BD1143fB1bF435097b4c72910AbBC1fe2` |

Legacy parameters: 24h governance delay, 100 USDC bonds, $0.05/kWh manual oracle.

---

## Not deployed

| Contract | Status |
|----------|--------|
| EnergyRevenueFloor | Tested locally only (`0x000…`) |

Deployment receipts: `state/deployments/`

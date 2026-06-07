const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const fee = (await hre.ethers.provider.getFeeData()).maxFeePerGas;
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockTx = await MockUSDC.getDeployTransaction();
  const mockGas = await hre.ethers.provider.estimateGas({ ...mockTx, from: deployer.address });
  console.log(`mock_usdc: ${hre.ethers.formatEther(mockGas * fee)} ETH`);

  const SolarPunkCoin = await hre.ethers.getContractFactory("SolarPunkCoin");
  const spkTx = await SolarPunkCoin.getDeployTransaction("0x0000000000000000000000000000000000000001");
  const spkGas = await hre.ethers.provider.estimateGas({ ...spkTx, from: deployer.address });
  console.log(`spk_deploy: ${hre.ethers.formatEther(spkGas * fee)} ETH`);

  const Currency = await hre.ethers.getContractFactory("SolarPunkCurrencySystem");
  const curTx = await Currency.getDeployTransaction(
    "0x0000000000000000000000000000000000000001",
    deployer.address
  );
  const curGas = await hre.ethers.provider.estimateGas({ ...curTx, from: deployer.address });
  console.log(`currency_system: ${hre.ethers.formatEther(curGas * fee)} ETH`);

  const setupGas = 500000n;
  const total = (mockGas + spkGas + curGas + setupGas) * fee;
  console.log(`lean_stack_estimate_with_setup: ${hre.ethers.formatEther(total)} ETH`);
  console.log(`balance: ${hre.ethers.formatEther(bal)} ETH`);
  console.log(`enough_for_lean: ${bal >= total}`);
  return;

  const plans = {
    currency_only_attached: async () => {
      const F = await hre.ethers.getContractFactory("SolarPunkCurrencySystem");
      return F.getDeployTransaction(
        "0x8ceDa149EDE44078bf151b3334513916a84df820",
        deployer.address
      );
    },
    mock_usdc: async () => (await hre.ethers.getContractFactory("MockUSDC")).getDeployTransaction(),
    spk: async () =>
      (await hre.ethers.getContractFactory("SolarPunkCoin")).getDeployTransaction(
        "0x0000000000000000000000000000000000000001"
      ),
  };

  for (const [name, build] of Object.entries(plans)) {
    const tx = await build();
    const gas = await hre.ethers.provider.estimateGas({ ...tx, from: deployer.address });
    console.log(`${name}: ${hre.ethers.formatEther(gas * fee)} ETH (${gas} gas)`);
  }
  console.log(`balance: ${hre.ethers.formatEther(bal)} ETH`);
}

main().catch(console.error);

import { SEPOLIA_EXPLORER, SEPOLIA_RPC_URL } from '../constants/contracts';

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

export async function ensureSepolia(provider) {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: SEPOLIA_CHAIN_ID_HEX }]);
  } catch (error) {
    if (error?.code === 4902) {
      await provider.send('wallet_addEthereumChain', [{
        chainId: SEPOLIA_CHAIN_ID_HEX,
        chainName: 'Sepolia',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: [SEPOLIA_RPC_URL],
        blockExplorerUrls: [SEPOLIA_EXPLORER],
      }]);
    } else {
      throw error;
    }
  }
}

export async function readWalletChainId(provider) {
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

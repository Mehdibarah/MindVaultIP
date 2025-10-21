// Wallet network switching utilities

export async function switchToBaseMainnet(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const chainId = '0x2105'; // Base mainnet chain ID in hex

  try {
    // Try to switch to Base mainnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add Base mainnet to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Base network:', addError);
        throw new Error('Failed to add Base network to MetaMask');
      }
    } else {
      console.error('Failed to switch to Base network:', switchError);
      throw new Error('Failed to switch to Base network');
    }
  }
}

export async function switchToBaseSepolia(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const chainId = '0x14A34'; // Base Sepolia chain ID in hex

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Base Sepolia network:', addError);
        throw new Error('Failed to add Base Sepolia network to MetaMask');
      }
    } else {
      console.error('Failed to switch to Base Sepolia network:', switchError);
      throw new Error('Failed to switch to Base Sepolia network');
    }
  }
}

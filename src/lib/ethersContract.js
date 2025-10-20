import { ethers } from 'ethers';
import mindVaultIPCoreABI from './mindvaultipcoreABI.json';

// Contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const PAYMENT_ADDRESS = import.meta.env.VITE_PAYMENT_ADDRESS || '0x63A8000bD167183AA43629d7C315d0FCc14B95ea';
const BASE_CHAIN_ID = 8453; // Base mainnet
const BASE_RPC_URL = 'https://mainnet.base.org';

// Contract instances cache
let contractInstance = null;
let paymentContractInstance = null;
let provider = null;
let signer = null;

/**
 * Initialize ethers provider and signer with MetaMask
 * @returns {Object} { provider, signer, isConnected }
 */
export async function initializeEthers() {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer (ethers v5)
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = await provider.getSigner();

    // Check if connected to Base network
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== BASE_CHAIN_ID) {
      throw new Error(`Please switch to Base network (Chain ID: ${BASE_CHAIN_ID}). Current network: ${network.name} (Chain ID: ${network.chainId})`);
    }

    return {
      provider,
      signer,
      isConnected: true,
      network: network.name,
      chainId: Number(network.chainId)
    };

  } catch (error) {
    console.error('Failed to initialize ethers:', error);
    throw error;
  }
}

/**
 * Get or create contract instance
 * @param {ethers.Signer} signer - Ethers signer instance
 * @returns {ethers.Contract} Contract instance
 */
export function getContractInstance(signerInstance = null) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x') {
    throw new Error('Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env file.');
  }

  if (!signerInstance && !signer) {
    throw new Error('No signer available. Please connect your wallet first.');
  }

  if (!contractInstance) {
    const currentSigner = signerInstance || signer;
    contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      mindVaultIPCoreABI,
      currentSigner
    );
  }

  return contractInstance;
}

/**
 * Get or create payment contract instance
 * @param {ethers.Signer} signer - Ethers signer instance
 * @returns {ethers.Contract} Payment contract instance
 */
export function getPaymentContractInstance(signerInstance = null) {
  if (!PAYMENT_ADDRESS || PAYMENT_ADDRESS === '0x') {
    throw new Error('Payment contract address not configured. Please set VITE_PAYMENT_ADDRESS in your .env file.');
  }

  if (!signerInstance && !signer) {
    throw new Error('No signer available. Please connect your wallet first.');
  }

  if (!paymentContractInstance) {
    const currentSigner = signerInstance || signer;
    paymentContractInstance = new ethers.Contract(
      PAYMENT_ADDRESS,
      mindVaultIPCoreABI, // Using same ABI for now
      currentSigner
    );
  }

  return paymentContractInstance;
}

/**
 * Switch to Base network if not already connected
 * @returns {Promise<boolean>} Success status
 */
export async function switchToBaseNetwork() {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed.');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
    });

    return true;
  } catch (error) {
    // If the chain doesn't exist, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [BASE_RPC_URL],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Base network:', addError);
        throw new Error('Failed to add Base network to MetaMask.');
      }
    }
    throw error;
  }
}

/**
 * Get current account address
 * @returns {Promise<string|null>} Account address or null
 */
export async function getCurrentAccount() {
  try {
    if (!window.ethereum) return null;
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Failed to get current account:', error);
    return null;
  }
}

/**
 * Get current network information
 * @returns {Promise<Object|null>} Network info or null
 */
export async function getCurrentNetwork() {
  try {
    if (!provider) return null;
    
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: Number(network.chainId),
      isBase: Number(network.chainId) === BASE_CHAIN_ID
    };
  } catch (error) {
    console.error('Failed to get current network:', error);
    return null;
  }
}

/**
 * Check if wallet is connected
 * @returns {Promise<boolean>} Connection status
 */
export async function isWalletConnected() {
  try {
    const account = await getCurrentAccount();
    return account !== null;
  } catch (error) {
    console.error('Failed to check wallet connection:', error);
    return false;
  }
}

/**
 * Listen for account changes
 * @param {Function} callback - Callback function for account changes
 * @returns {Function} Unsubscribe function
 */
export function onAccountsChanged(callback) {
  if (!window.ethereum) return () => {};

  const handleAccountsChanged = (accounts) => {
    callback(accounts.length > 0 ? accounts[0] : null);
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  return () => {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  };
}

/**
 * Listen for network changes
 * @param {Function} callback - Callback function for network changes
 * @returns {Function} Unsubscribe function
 */
export function onChainChanged(callback) {
  if (!window.ethereum) return () => {};

  const handleChainChanged = (chainId) => {
    callback(Number(chainId));
  };

  window.ethereum.on('chainChanged', handleChainChanged);

  return () => {
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  };
}

/**
 * Get contract balance for an address
 * @param {string} address - Address to check balance for
 * @returns {Promise<string>} Balance in ETH
 */
export async function getContractBalance(address) {
  try {
    const contract = getContractInstance();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get contract balance:', error);
    throw error;
  }
}

/**
 * Transfer tokens using the contract
 * @param {string} to - Recipient address
 * @param {string} amount - Amount in ETH (will be converted to wei)
 * @returns {Promise<Object>} Transaction result
 */
export async function transferTokens(to, amount) {
  try {
    const contract = getContractInstance();
    const amountWei = ethers.parseEther(amount);
    
    const tx = await contract.transferFrom(
      await signer.getAddress(),
      to,
      amountWei
    );

    const receipt = await tx.wait();
    return {
      hash: tx.hash,
      receipt,
      success: receipt.status === 1
    };
  } catch (error) {
    console.error('Failed to transfer tokens:', error);
    throw error;
  }
}

/**
 * Send ETH payment to payment contract
 * @param {string} amount - Amount in ETH
 * @returns {Promise<Object>} Transaction result
 */
export async function sendETHPayment(amount) {
  try {
    const paymentContract = getPaymentContractInstance();
    const amountWei = ethers.parseEther(amount);
    
    const tx = await signer.sendTransaction({
      to: PAYMENT_ADDRESS,
      value: amountWei
    });

    const receipt = await tx.wait();
    return {
      hash: tx.hash,
      receipt,
      success: receipt.status === 1
    };
  } catch (error) {
    console.error('Failed to send ETH payment:', error);
    throw error;
  }
}

/**
 * Get contract allowance for a spender
 * @param {string} owner - Owner address
 * @param {string} spender - Spender address
 * @returns {Promise<string>} Allowance amount
 */
export async function getAllowance(owner, spender) {
  try {
    const contract = getContractInstance();
    const allowance = await contract.allowance(owner, spender);
    return ethers.formatEther(allowance);
  } catch (error) {
    console.error('Failed to get allowance:', error);
    throw error;
  }
}

// Export contract configuration
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  paymentAddress: PAYMENT_ADDRESS,
  chainId: BASE_CHAIN_ID,
  rpcUrl: BASE_RPC_URL,
  abi: mindVaultIPCoreABI
};

// Export default contract instance getter
export default {
  getContract: getContractInstance,
  getPaymentContract: getPaymentContractInstance,
  initialize: initializeEthers,
  switchNetwork: switchToBaseNetwork,
  getAccount: getCurrentAccount,
  getNetwork: getCurrentNetwork,
  isConnected: isWalletConnected,
  onAccountsChanged,
  onChainChanged,
  getBalance: getContractBalance,
  transfer: transferTokens,
  sendPayment: sendETHPayment,
  getAllowance,
  config: CONTRACT_CONFIG
};


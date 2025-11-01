import { ethers } from 'ethers';
import mindVaultIPCoreABI from './mindvaultipcoreABI.json';

// Contract configuration
// ✅ Use checksum addresses for MetaMask verification

const rawContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const rawPaymentAddress = import.meta.env.VITE_PAYMENT_ADDRESS || '0x63A8000bD167183AA43629d7C315d0FCc14B95ea';

// Convert to checksum format (required for MetaMask verification)
// ✅ Validate address format before checksumming (must be 42 characters: 0x + 40 hex digits)
const isValidAddress = (addr) => {
  return addr && 
         typeof addr === 'string' && 
         addr.startsWith('0x') && 
         addr.length === 42 && 
         /^0x[a-fA-F0-9]{40}$/.test(addr);
};

const CONTRACT_ADDRESS = rawContractAddress && 
                         rawContractAddress !== '0x1234567890123456789012345678901234567890' &&
                         isValidAddress(rawContractAddress)
  ? ethers.utils.getAddress(rawContractAddress) 
  : rawContractAddress;
  
const PAYMENT_ADDRESS = rawPaymentAddress && isValidAddress(rawPaymentAddress)
  ? ethers.utils.getAddress(rawPaymentAddress) 
  : rawPaymentAddress;
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://base-mainnet.g.alchemy.com/v2/demo';
const BASE_CHAIN_ID = 8453; // Base mainnet
const BASE_RPC_URL = 'https://mainnet.base.org';

// Log environment variables for debugging
console.log('🔧 EthersContract Environment variables:', {
  CONTRACT_ADDRESS,
  PAYMENT_ADDRESS,
  RPC_URL,
  hasABI: !!mindVaultIPCoreABI
});

// Contract instances cache
let contractInstance = null;
let paymentContractInstance = null;
let provider = null;
let signer = null;
let defaultContract = null;

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
    
    // Request account access (not just check)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    return ethers.utils.formatEther(balance);
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
    const amountWei = ethers.utils.parseEther(amount);
    
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
    const amountWei = ethers.utils.parseEther(amount);
    
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
    return ethers.utils.formatEther(allowance);
  } catch (error) {
    console.error('Failed to get allowance:', error);
    throw error;
  }
}

/**
 * Create a default contract instance with automatic provider detection
 * @returns {Promise<ethers.Contract>} Default contract instance
 */
async function createDefaultContract() {
  try {
    // Try to get MetaMask provider first
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Request account access (not just check)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          // MetaMask is connected, use it
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            mindVaultIPCoreABI,
            web3Signer
          );
          
          console.log('✅ EthersContract: Using MetaMask provider with signer');
          return contract;
        } else {
          // MetaMask available but not connected, use provider without signer
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            mindVaultIPCoreABI,
            web3Provider
          );
          
          console.log('✅ EthersContract: Using MetaMask provider without signer');
          return contract;
        }
      } catch (error) {
        console.warn('⚠️ EthersContract: MetaMask connection failed, falling back to JSON RPC:', error.message);
      }
    }
    
    // Fallback to JSON RPC provider
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      mindVaultIPCoreABI,
      rpcProvider
    );
    
    console.log('✅ EthersContract: Using JSON RPC provider fallback');
    return contract;
    
  } catch (error) {
    console.error('❌ EthersContract: Failed to create default contract:', error);
    throw error;
  }
}

// Export contract configuration
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  paymentAddress: PAYMENT_ADDRESS,
  chainId: BASE_CHAIN_ID,
  rpcUrl: RPC_URL,
  abi: mindVaultIPCoreABI
};

// Create a synchronous contract proxy for immediate access
const contract = new Proxy({}, {
  get(target, prop) {
    // If contract is already initialized, return the property
    if (defaultContract) {
      return defaultContract[prop];
    }
    
    // For common properties, return async functions that wait for initialization
    if (prop === 'provider') {
      return {
        getNetwork: async () => {
          const contractInstance = await createDefaultContract();
          return contractInstance.provider ? await contractInstance.provider.getNetwork() : null;
        }
      };
    }
    
    if (prop === 'address') {
      return CONTRACT_ADDRESS;
    }
    
    // For methods, return async functions that wait for initialization
    if (typeof prop === 'string') {
      return async (...args) => {
        const contractInstance = await createDefaultContract();
        return contractInstance[prop](...args);
      };
    }
    
    return undefined;
  }
});

// Initialize default contract and set window globals
(async () => {
  try {
    defaultContract = await createDefaultContract();
    console.log('✅ EthersContract: Default contract initialized successfully');
    
    // Set window globals for debugging
    if (typeof window !== "undefined") {
      window.ethers = ethers;
      window.contract = contract;
      console.log('🌐 EthersContract: Window globals set:', {
        hasContract: !!window.contract,
        hasEthers: !!window.ethers,
        contractAddress: window.contract?.address
      });
    }
  } catch (error) {
    console.error('❌ EthersContract: Failed to initialize default contract:', error);
  }
})();

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
  config: CONTRACT_CONFIG,
  // Export the default contract instance
  contract: contract
};


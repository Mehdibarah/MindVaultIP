import { ethers } from "ethers";
import abi from "../api/contract.json";

// Detect ethers version
const ETHERS_VERSION = ethers.version || '5.x';
const IS_ETHERS_V6 = ETHERS_VERSION.startsWith('6');

console.log('🔍 Ethers version detected:', ETHERS_VERSION);

// Get environment variables with fallbacks
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://base-mainnet.g.alchemy.com/v2/demo';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';

// Log environment variables for debugging
console.log('🔧 Environment variables:', {
  RPC_URL,
  CONTRACT_ADDRESS,
  hasABI: !!abi,
  ethersVersion: ETHERS_VERSION
});

// Fallback RPC endpoints for Base network
const FALLBACK_RPC_URLS = [
  'https://base-mainnet.g.alchemy.com/v2/demo',
  'https://base.blockpi.network/v1/rpc/public',
  'https://base.llamarpc.com',
  'https://base.publicnode.com',
  'https://mainnet.base.org'
];

// Validate contract address
if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x' || CONTRACT_ADDRESS.length !== 42) {
  throw new Error(`Invalid contract address: ${CONTRACT_ADDRESS}. Please set VITE_CONTRACT_ADDRESS in your .env file.`);
}

// Validate RPC URL
if (!RPC_URL) {
  throw new Error('RPC URL not configured. Please set VITE_RPC_URL in your .env file.');
}

/**
 * Test RPC endpoint connectivity
 * @param {string} url - RPC URL to test
 * @returns {Promise<boolean>} - True if endpoint is working
 */
async function testRpcEndpoint(url) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(url);
    await provider.getNetwork();
    return true;
  } catch (error) {
    console.warn(`RPC endpoint ${url} failed:`, error.message);
    return false;
  }
}

/**
 * Get working RPC provider with fallback
 * @returns {Promise<ethers.providers.JsonRpcProvider>} - Working provider
 */
async function getWorkingRpcProvider() {
  // Try the configured RPC URL first
  if (await testRpcEndpoint(RPC_URL)) {
    console.log('Using configured RPC URL:', RPC_URL);
    return new ethers.providers.JsonRpcProvider(RPC_URL);
  }
  
  // Try fallback URLs
  for (const url of FALLBACK_RPC_URLS) {
    if (url !== RPC_URL && await testRpcEndpoint(url)) {
      console.log('Using fallback RPC URL:', url);
      return new ethers.providers.JsonRpcProvider(url);
    }
  }
  
  throw new Error('All RPC endpoints are unavailable. Please check your network connection.');
}

// Contract instance cache
let contractInstance = null;
let provider = null;
let signer = null;
let isMetaMaskAvailable = false;

/**
 * Check if MetaMask is available and get the best provider
 * @returns {Object} { provider, signer, isMetaMask, isConnected }
 */
async function getProvider() {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    // Server-side: use working JSON RPC provider
    try {
      const rpcProvider = await getWorkingRpcProvider();
      return {
        provider: rpcProvider,
        signer: null,
        isMetaMask: false,
        isConnected: false
      };
    } catch (error) {
      console.error('Failed to get RPC provider:', error);
      throw error;
    }
  }

  // Check if MetaMask is available
  if (window.ethereum) {
    try {
      isMetaMaskAvailable = true;
      
      // Check if already connected (NO auto eth_requestAccounts)
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        // MetaMask is connected, use correct provider based on ethers version
        let web3Provider;
        if (IS_ETHERS_V6) {
          web3Provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        
        const browserSigner = await web3Provider.getSigner();
        
        console.log('✅ MetaMask connected:', {
          address: await browserSigner.getAddress(),
          network: await web3Provider.getNetwork(),
          ethersVersion: ETHERS_VERSION
        });
        
        return {
          provider: web3Provider,
          signer: browserSigner,
          isMetaMask: true,
          isConnected: true
        };
      } else {
        // MetaMask available but not connected, use provider without signer
        let web3Provider;
        if (IS_ETHERS_V6) {
          web3Provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        
        console.log('ℹ️ MetaMask available but not connected');
        
        return {
          provider: web3Provider,
          signer: null,
          isMetaMask: true,
          isConnected: false
        };
      }
    } catch (error) {
      console.warn('⚠️ MetaMask connection failed, falling back to JSON RPC:', error.message);
      isMetaMaskAvailable = false;
    }
  }

  // Fallback to working JSON RPC provider
  console.log('Using JSON RPC provider fallback');
  try {
    const rpcProvider = await getWorkingRpcProvider();
    return {
      provider: rpcProvider,
      signer: null,
      isMetaMask: false,
      isConnected: false
    };
  } catch (error) {
    console.error('All RPC endpoints failed:', error);
    throw new Error('Unable to connect to any RPC endpoint. Please check your network connection.');
  }
}

/**
 * Get or create contract instance with automatic provider detection
 * @returns {ethers.Contract} Contract instance
 */
async function getContract() {
  if (contractInstance) {
    return contractInstance;
  }

  try {
    const { provider: currentProvider, signer: currentSigner } = await getProvider();
    
    // Use signer if available, otherwise use provider
    const contractProvider = currentSigner || currentProvider;
    
    contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      contractProvider
    );

    // Store provider and signer for later use
    provider = currentProvider;
    signer = currentSigner;

    console.log('Contract initialized:', {
      contractAddress: CONTRACT_ADDRESS,
      hasSigner: !!currentSigner,
      isMetaMask: isMetaMaskAvailable,
      providerType: currentSigner ? 'signer' : 'provider'
    });

    return contractInstance;
  } catch (error) {
    console.error('Failed to initialize contract:', error);
    throw error;
  }
}

/**
 * Connect to MetaMask and get contract with signer
 * @returns {Object} { contract, signer, provider, address }
 */
async function connectWithMetaMask() {
  if (typeof window === "undefined") {
    throw new Error('MetaMask connection is only available in browser environment');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create provider with correct ethers version syntax
    let web3Provider;
    if (IS_ETHERS_V6) {
      web3Provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    
    const browserSigner = await web3Provider.getSigner();
    
    if (!browserSigner) {
      throw new Error('Failed to get signer from MetaMask');
    }

    // Create new contract instance with signer
    const contractWithSigner = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      browserSigner
    );

    const address = await browserSigner.getAddress();
    
    console.log('✅ MetaMask connected successfully:', {
      address,
      contractAddress: CONTRACT_ADDRESS,
      ethersVersion: ETHERS_VERSION
    });

    return {
      contract: contractWithSigner,
      signer: browserSigner,
      provider: web3Provider,
      address
    };
  } catch (error) {
    console.error('❌ MetaMask connection failed:', error);
    throw error;
  }
}

/**
 * Get current connection status
 * @returns {Object} Connection status
 */
async function getConnectionStatus() {
  if (typeof window === "undefined") {
    return {
      isMetaMaskAvailable: false,
      isConnected: false,
      address: null,
      network: null
    };
  }

  if (!window.ethereum) {
    return {
      isMetaMaskAvailable: false,
      isConnected: false,
      address: null,
      network: null
    };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const isConnected = accounts.length > 0;
    
    if (isConnected && provider) {
      const network = await provider.getNetwork();
      return {
        isMetaMaskAvailable: true,
        isConnected: true,
        address: accounts[0],
        network: {
          name: network.name,
          chainId: Number(network.chainId)
        }
      };
    }

    return {
      isMetaMaskAvailable: true,
      isConnected: false,
      address: null,
      network: null
    };
  } catch (error) {
    console.error('Failed to get connection status:', error);
    return {
      isMetaMaskAvailable: false,
      isConnected: false,
      address: null,
      network: null
    };
  }
}

// Test RPC endpoint connectivity
async function testRpcEndpoint(url) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(url);
    await provider.getNetwork();
    return { url, working: true };
  } catch (error) {
    console.warn(`RPC endpoint ${url} failed:`, error.message);
    return { url, working: false, error: error.message };
  }
}

// Find working RPC endpoint
async function findWorkingRpcEndpoint() {
  console.log('Testing RPC endpoints...');
  
  for (const url of FALLBACK_RPC_URLS) {
    const isWorking = await testRpcEndpoint(url);
    if (isWorking) {
      console.log(`✅ Using RPC endpoint: ${url}`);
      return url;
    }
  }
  
  console.error('❌ No working RPC endpoints found');
  return RPC_URL; // Fallback to original
}

// Initialize contract on module load
let defaultContract = null;
let workingRpcUrl = null;

// Create a synchronous contract object that works immediately
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
          const { provider } = await getProvider();
          return provider ? await provider.getNetwork() : null;
        }
      };
    }
    
    if (prop === 'address') {
      return CONTRACT_ADDRESS;
    }
    
    // For methods, return async functions that wait for initialization
    if (typeof prop === 'string') {
      return async (...args) => {
        const contractInstance = await getContract();
        return contractInstance[prop](...args);
      };
    }
    
    return undefined;
  }
});

// Initialize with working RPC endpoint
(async () => {
  try {
    workingRpcUrl = await findWorkingRpcEndpoint();
    const contractInstance = await getContract();
    defaultContract = contractInstance;
    console.log('✅ Contract initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize contract:', error);
  }
})();

// Helper function to get contract instance for console usage
async function getContractForConsole() {
  try {
    const contractInstance = await getContract();
    return contractInstance;
  } catch (error) {
    console.error('Failed to get contract:', error);
    return null;
  }
}

// Make contract and ethers available globally in browser
if (typeof window !== "undefined") {
  window.contract = contract;
  window.ethers = ethers;
  window.connectWithMetaMask = connectWithMetaMask;
  window.getConnectionStatus = getConnectionStatus;
  window.getContractForConsole = getContractForConsole;
  
  // Add comprehensive testing functions
  window.testContract = async () => {
    console.log('🧪 Starting comprehensive contract test...');
    
    try {
      // Test environment variables
      console.log('📋 Environment check:', {
        RPC_URL,
        CONTRACT_ADDRESS,
        ethersVersion: ETHERS_VERSION,
        hasABI: !!abi
      });
      
      // Test provider
      const { provider, signer, isMetaMask, isConnected } = await getProvider();
      if (provider) {
        const network = await provider.getNetwork();
        console.log('🌐 Provider test:', {
          network: network.name,
          chainId: network.chainId,
          isMetaMask,
          isConnected,
          hasSigner: !!signer
        });
      }
      
      // Test contract
      const contractInstance = await getContractForConsole();
      if (contractInstance) {
        console.log('📄 Contract test:', {
          address: contractInstance.address,
          hasProvider: !!contractInstance.provider,
          hasSigner: !!contractInstance.signer
        });
      }
      
      console.log('✅ All tests completed successfully');
      return { provider, contract: contractInstance, signer };
    } catch (error) {
      console.error('❌ Contract test failed:', error);
      return null;
    }
  };
  
  // Add MetaMask connection test
  window.testMetaMask = async () => {
    console.log('🦊 Testing MetaMask connection...');
    try {
      const result = await connectWithMetaMask();
      console.log('✅ MetaMask test successful:', result);
      return result;
    } catch (error) {
      console.error('❌ MetaMask test failed:', error);
      return null;
    }
  };
  
  // Add simple console helpers
  window.getNetwork = async () => {
    const { provider } = await getProvider();
    return provider ? await provider.getNetwork() : null;
  };
  
  window.getContractAddress = () => CONTRACT_ADDRESS;
  
  window.getProviderInfo = async () => {
    const { provider, signer, isMetaMask, isConnected } = await getProvider();
    return {
      hasProvider: !!provider,
      hasSigner: !!signer,
      isMetaMask,
      isConnected,
      network: provider ? await provider.getNetwork() : null
    };
  };
  
  console.log('🔧 Global contract functions available:', {
    'window.contract': 'Contract instance (use: await window.contract.provider.getNetwork())',
    'window.ethers': 'Ethers library',
    'window.getNetwork()': 'Quick network info',
    'window.getContractAddress()': 'Get contract address',
    'window.getProviderInfo()': 'Get provider details',
    'window.testContract()': 'Run comprehensive tests',
    'window.testMetaMask()': 'Test MetaMask connection',
    'window.connectWithMetaMask()': 'Connect to MetaMask'
  });
}

export default contract;
export { getContract, connectWithMetaMask, getConnectionStatus, getProvider };
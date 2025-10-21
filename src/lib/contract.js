import { ethers } from "ethers";
import abi from "./mindvaultipcoreABI.json";

// Debug environment variables
console.log('🔧 Contract.js Environment variables:', {
  VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
  VITE_CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
  hasABI: !!abi
});

// Validate environment variables
if (!import.meta.env.VITE_RPC_URL) {
  throw new Error('VITE_RPC_URL is not defined in environment variables');
}

if (!import.meta.env.VITE_CONTRACT_ADDRESS) {
  throw new Error('VITE_CONTRACT_ADDRESS is not defined in environment variables');
}

// Create readonly provider using Base mainnet RPC with proper network metadata
const readonly = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL, { 
  chainId: 8453, 
  name: "base" 
});

// Create contract instance with readonly provider
const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, readonly);

// Set window globals for debugging
if (typeof window !== "undefined") {
  window.ethers = ethers;
  window.contract = contract;
  
  // Add network helper to window for debugging
  window.getNetworkInfo = async () => {
    try {
      const network = await contract.provider.getNetwork();
      console.log("Raw network:", network);
      
      // Fix network name if it's unknown but chainId is correct
      if (Number(network.chainId) === 8453 && network.name === 'unknown') {
        network.name = 'base';
        console.log("✅ Fixed network name to 'base'");
      }
      
      return network;
    } catch (error) {
      console.error("Failed to get network:", error);
      return null;
    }
  };
  
  console.log('🌐 Global contract and ethers exposed:', {
    contractAddress: contract.address,
    rpcUrl: import.meta.env.VITE_RPC_URL
  });
}

// Wallet connect utility function
export async function getSignerContract() {
  if (!window.ethereum) throw new Error("No wallet");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return window.contract.connect(signer);
}

// Export default contract
export default contract;
import { ethers } from "ethers";
import abi from "./mindvaultipcoreABI.json";

// Create readonly provider using Base mainnet RPC
const readonly = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);

// Create contract instance with readonly provider
const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, readonly);

// Set window globals for debugging
if (typeof window !== "undefined") {
  window.ethers = ethers;
  window.contract = contract;
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
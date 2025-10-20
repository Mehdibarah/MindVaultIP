import { ethers } from "ethers";
import fs from "fs";
import { config } from 'dotenv';

// Load environment variables
config();

const abi = JSON.parse(fs.readFileSync("./src/api/contract.json", "utf8"));
const RPC_URL = process.env.VITE_RPC_URL || 'https://mainnet.base.org';
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

(async () => {
  try {
    const network = await provider.getNetwork();
    console.log('Network:', network);
    console.log('Contract address:', CONTRACT_ADDRESS);
    console.log('RPC URL:', RPC_URL);
  } catch (error) {
    console.error('Error:', error);
  }
})();
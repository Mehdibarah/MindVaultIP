import { ethers } from "ethers";
import abi from "../api/contract.json";

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  abi,
  provider
);

export default contract;
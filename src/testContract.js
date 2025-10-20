import { ethers } from "ethers";
import fs from "fs";

const abi = JSON.parse(fs.readFileSync("./src/api/contract.json", "utf8"));
const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi, provider);

(async () => {
  console.log(await contract.provider.getNetwork());
})();
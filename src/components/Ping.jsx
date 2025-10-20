"use client";
import { getContract, getProvider } from "@/lib/contract";
import { useEffect } from "react";

export default function Ping() {
  useEffect(() => {
    const pingContract = async () => {
      try {
        console.log("🔍 Ping: Starting contract diagnostics...");
        
        // Get provider and test network
        const { provider, signer, isMetaMask, isConnected } = await getProvider();
        if (provider) {
          const network = await provider.getNetwork();
          console.log("🌐 Ping: Provider network:", {
            name: network.name,
            chainId: network.chainId,
            isMetaMask,
            isConnected,
            hasSigner: !!signer
          });
        } else {
          console.log("❌ Ping: No provider available");
        }
        
        // Get contract and test address
        const contract = await getContract();
        if (contract) {
          console.log("📄 Ping: Contract address:", contract.address);
          console.log("✅ Ping: Contract instance created successfully");
        } else {
          console.log("❌ Ping: No contract available");
        }
        
        console.log("🎯 Ping: Diagnostics complete");
      } catch (error) {
        console.error("❌ Ping: Failed to ping contract:", error);
      }
    };
    
    pingContract();
  }, []);
  
  return null;
}
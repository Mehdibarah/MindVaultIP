"use client";
import { useEffect } from "react";

export default function Ping() {
  useEffect(() => {
    const pingContract = async () => {
      try {
        console.log("🔍 Ping: Starting contract diagnostics...");
        
        // Test network and contract address
        if (window.contract) {
          const network = await window.contract.provider.getNetwork();
          console.log("net:", network, "addr:", window.contract.address);
          console.log("✅ Ping: Contract diagnostics complete");
        } else {
          console.log("❌ Ping: window.contract not available");
        }
      } catch (error) {
        console.error("❌ Ping: Failed to ping contract:", error);
      }
    };
    
    pingContract();
  }, []);
  
  return <></>;
}
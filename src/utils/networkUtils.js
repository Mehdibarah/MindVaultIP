// Network utilities for handling production network detection issues
import { ethers } from 'ethers';

/**
 * Get normalized network information
 * Fixes the issue where production returns {chainId: 8453, name: 'unknown'}
 */
export async function getNormalizedNetwork(provider) {
  try {
    const net = await provider.getNetwork();
    let name = net.name;

    // Fix network name based on chainId
    switch (Number(net.chainId)) {
      case 8453:
        name = "base";
        break;
      case 84532:
        name = "base-sepolia";
        break;
      case 1:
        name = "ethereum";
        break;
      case 137:
        name = "polygon";
        break;
      default:
        name = name || "unknown";
    }

    const normalized = { 
      ...net, 
      name,
      chainId: Number(net.chainId),
      isBase: Number(net.chainId) === 8453,
      isBaseSepolia: Number(net.chainId) === 84532,
      isSupported: [8453, 84532].includes(Number(net.chainId))
    };

    console.log("🌐 Network normalized:", normalized);
    return normalized;
  } catch (error) {
    console.error("❌ Failed to get network:", error);
    return {
      chainId: 0,
      name: "unknown",
      isBase: false,
      isBaseSepolia: false,
      isSupported: false
    };
  }
}

/**
 * Check if current network is Base Mainnet
 */
export function isBaseMainnet(chainId) {
  return Number(chainId) === 8453;
}

/**
 * Check if current network is supported (Base Mainnet or Sepolia)
 */
export function isSupportedNetwork(chainId) {
  return [8453, 84532].includes(Number(chainId));
}

/**
 * Get network display name
 */
export function getNetworkDisplayName(chainId) {
  switch (Number(chainId)) {
    case 8453:
      return "Base Mainnet";
    case 84532:
      return "Base Sepolia";
    case 1:
      return "Ethereum Mainnet";
    case 137:
      return "Polygon";
    default:
      return `Chain ${chainId}`;
  }
}

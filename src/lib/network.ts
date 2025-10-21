// Network detection and normalization utilities

export const BASE_MAINNET = 8453;
export const BASE_SEPOLIA = 84532;

export function isSupportedChain(id?: number): boolean {
  return id === BASE_MAINNET || id === BASE_SEPOLIA;
}

export function normalizeNetwork(net: { chainId: bigint | number; name?: string }) {
  const id = Number(net?.chainId ?? 0);
  const name = id === BASE_MAINNET ? "base" : id === BASE_SEPOLIA ? "base-sepolia" : (net?.name || "unknown");
  return { 
    chainId: id, 
    name, 
    isSupported: isSupportedChain(id) 
  };
}

export function getNetworkDisplayName(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET:
      return "Base Mainnet";
    case BASE_SEPOLIA:
      return "Base Sepolia";
    default:
      return `Chain ${chainId}`;
  }
}

export function getNetworkColor(chainId: number): string {
  switch (chainId) {
    case BASE_MAINNET:
      return "#0052FF"; // Base blue
    case BASE_SEPOLIA:
      return "#8B5CF6"; // Purple for testnet
    default:
      return "#6B7280"; // Gray for unsupported
  }
}

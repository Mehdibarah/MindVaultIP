import { normalizeNetwork, isSupportedChain, BASE_MAINNET, BASE_SEPOLIA } from '../network';

describe('Network utilities', () => {
  describe('isSupportedChain', () => {
    it('should return true for Base Mainnet', () => {
      expect(isSupportedChain(BASE_MAINNET)).toBe(true);
    });

    it('should return true for Base Sepolia', () => {
      expect(isSupportedChain(BASE_SEPOLIA)).toBe(true);
    });

    it('should return false for unsupported chains', () => {
      expect(isSupportedChain(1)).toBe(false); // Ethereum mainnet
      expect(isSupportedChain(137)).toBe(false); // Polygon
      expect(isSupportedChain(undefined)).toBe(false);
    });
  });

  describe('normalizeNetwork', () => {
    it('should normalize Base Mainnet correctly', () => {
      const result = normalizeNetwork({ chainId: BASE_MAINNET, name: 'unknown' });
      expect(result).toEqual({
        chainId: BASE_MAINNET,
        name: 'base',
        isSupported: true
      });
    });

    it('should normalize Base Sepolia correctly', () => {
      const result = normalizeNetwork({ chainId: BASE_SEPOLIA, name: 'unknown' });
      expect(result).toEqual({
        chainId: BASE_SEPOLIA,
        name: 'base-sepolia',
        isSupported: true
      });
    });

    it('should handle unsupported networks', () => {
      const result = normalizeNetwork({ chainId: 1, name: 'ethereum' });
      expect(result).toEqual({
        chainId: 1,
        name: 'ethereum',
        isSupported: false
      });
    });

    it('should handle bigint chainId', () => {
      const result = normalizeNetwork({ chainId: BigInt(BASE_MAINNET), name: 'unknown' });
      expect(result).toEqual({
        chainId: BASE_MAINNET,
        name: 'base',
        isSupported: true
      });
    });

    it('should handle missing chainId', () => {
      const result = normalizeNetwork({ chainId: 0, name: 'unknown' });
      expect(result).toEqual({
        chainId: 0,
        name: 'unknown',
        isSupported: false
      });
    });

    it('should handle undefined network', () => {
      const result = normalizeNetwork({ chainId: undefined as any, name: undefined });
      expect(result).toEqual({
        chainId: 0,
        name: 'unknown',
        isSupported: false
      });
    });
  });
});

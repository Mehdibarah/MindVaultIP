/**
 * Unit tests for conversation utilities
 */

import {
  getConversationId,
  isValidAddress,
  normalizeAddress,
  areAddressesEqual,
  formatAddress,
  getOtherParticipant,
  validateMessage,
  generateMessageId
} from '../conversationUtils';

describe('conversationUtils', () => {
  // Test addresses
  const validAddress1 = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  const validAddress2 = '0x8ba1f109551bD432803012645Hac136c';
  const invalidAddress = '0xinvalid';
  const checksumAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  describe('getConversationId', () => {
    test('should generate consistent conversation ID regardless of address order', () => {
      const id1 = getConversationId(validAddress1, validAddress2);
      const id2 = getConversationId(validAddress2, validAddress1);
      
      expect(id1).toBe(id2);
      expect(id1).toMatch(/^convo_[a-f0-9]{8}$/); // Simple hash format
    });

    test('should generate different IDs for different address pairs', () => {
      const id1 = getConversationId(validAddress1, validAddress2);
      const id3 = getConversationId(validAddress1, '0x1234567890123456789012345678901234567890');
      
      expect(id1).not.toBe(id3);
    });

    test('should handle case-insensitive addresses', () => {
      const upperAddress = validAddress1.toUpperCase();
      const lowerAddress = validAddress1.toLowerCase();
      
      const id1 = getConversationId(upperAddress, validAddress2);
      const id2 = getConversationId(lowerAddress, validAddress2);
      
      expect(id1).toBe(id2);
    });
  });

  describe('isValidAddress', () => {
    test('should validate correct Ethereum addresses', () => {
      expect(isValidAddress(validAddress1)).toBe(true);
      expect(isValidAddress(validAddress2)).toBe(true);
      expect(isValidAddress(checksumAddress)).toBe(true);
    });

    test('should reject invalid addresses', () => {
      expect(isValidAddress(invalidAddress)).toBe(false);
      expect(isValidAddress('')).toBe(false);
      expect(isValidAddress('0x')).toBe(false);
      expect(isValidAddress('not an address')).toBe(false);
    });
  });

  describe('normalizeAddress', () => {
    test('should normalize valid addresses', () => {
      const normalized = normalizeAddress(validAddress1);
      expect(normalized).toBe(validAddress1.toLowerCase());
    });

    test('should return null for invalid addresses', () => {
      expect(normalizeAddress(invalidAddress)).toBe(null);
      expect(normalizeAddress('')).toBe(null);
    });
  });

  describe('areAddressesEqual', () => {
    test('should return true for same addresses', () => {
      expect(areAddressesEqual(validAddress1, validAddress1)).toBe(true);
      expect(areAddressesEqual(validAddress1, validAddress1.toLowerCase())).toBe(true);
      expect(areAddressesEqual(validAddress1, validAddress1.toUpperCase())).toBe(true);
    });

    test('should return false for different addresses', () => {
      expect(areAddressesEqual(validAddress1, validAddress2)).toBe(false);
    });

    test('should return false for invalid addresses', () => {
      expect(areAddressesEqual(validAddress1, invalidAddress)).toBe(false);
      expect(areAddressesEqual(invalidAddress, validAddress1)).toBe(false);
    });
  });

  describe('formatAddress', () => {
    test('should format address with default parameters', () => {
      const formatted = formatAddress(validAddress1);
      expect(formatted).toBe('0x742d...4d8b6');
    });

    test('should format address with custom parameters', () => {
      const formatted = formatAddress(validAddress1, 4, 2);
      expect(formatted).toBe('0x74...b6');
    });

    test('should return full address if shorter than startChars + endChars', () => {
      const shortAddress = '0x1234';
      const formatted = formatAddress(shortAddress);
      expect(formatted).toBe(shortAddress);
    });

    test('should handle empty or null address', () => {
      expect(formatAddress('')).toBe('');
      expect(formatAddress(null as any)).toBe(null);
    });
  });

  describe('getOtherParticipant', () => {
    const myAddress = validAddress1;
    const otherAddress = validAddress2;
    const messages = [
      { sender: myAddress, recipient: otherAddress },
      { sender: otherAddress, recipient: myAddress },
      { sender: myAddress, recipient: otherAddress }
    ];

    test('should return other participant from messages', () => {
      const other = getOtherParticipant('convoId', myAddress, messages);
      expect(other).toBe(otherAddress.toLowerCase());
    });

    test('should return null if no messages', () => {
      const other = getOtherParticipant('convoId', myAddress, []);
      expect(other).toBe(null);
    });

    test('should return null if invalid address', () => {
      const other = getOtherParticipant('convoId', invalidAddress, messages);
      expect(other).toBe(null);
    });
  });

  describe('validateMessage', () => {
    test('should validate correct messages', () => {
      expect(validateMessage('Hello world')).toEqual({ isValid: true });
      expect(validateMessage('A'.repeat(2000))).toEqual({ isValid: true });
    });

    test('should reject empty messages', () => {
      const result = validateMessage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message cannot be empty');
    });

    test('should reject whitespace-only messages', () => {
      const result = validateMessage('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message cannot be empty');
    });

    test('should reject messages that are too long', () => {
      const result = validateMessage('A'.repeat(2001));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message too long (max 2000 characters)');
    });

    test('should accept messages at the limit', () => {
      const result = validateMessage('A'.repeat(2000));
      expect(result.isValid).toBe(true);
    });
  });

  describe('generateMessageId', () => {
    test('should generate unique message IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^msg_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^msg_\d+_[a-z0-9]+$/);
    });

    test('should include timestamp in ID', () => {
      const before = Date.now();
      const id = generateMessageId();
      const after = Date.now();
      
      const timestamp = parseInt(id.split('_')[1]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('Edge cases', () => {
    test('should handle null and undefined inputs gracefully', () => {
      expect(() => getConversationId(null as any, validAddress1)).toThrow();
      expect(() => getConversationId(validAddress1, undefined as any)).toThrow();
      expect(isValidAddress(null as any)).toBe(false);
      expect(isValidAddress(undefined as any)).toBe(false);
      expect(normalizeAddress(null as any)).toBe(null);
      expect(normalizeAddress(undefined as any)).toBe(null);
    });

    test('should handle very long addresses', () => {
      const longAddress = '0x' + 'a'.repeat(100);
      expect(isValidAddress(longAddress)).toBe(false);
      expect(normalizeAddress(longAddress)).toBe(null);
    });

    test('should handle special characters in addresses', () => {
      const specialAddress = '0x742d35Cc@#$%^&*()';
      expect(isValidAddress(specialAddress)).toBe(false);
      expect(normalizeAddress(specialAddress)).toBe(null);
    });
  });

  describe('Integration tests', () => {
    test('should work together for a complete conversation flow', () => {
      const user1 = validAddress1;
      const user2 = validAddress2;
      
      // Generate conversation ID
      const convoId = getConversationId(user1, user2);
      expect(convoId).toMatch(/^convo_[a-f0-9]{8}$/);
      
      // Validate addresses
      expect(isValidAddress(user1)).toBe(true);
      expect(isValidAddress(user2)).toBe(true);
      
      // Check they're different
      expect(areAddressesEqual(user1, user2)).toBe(false);
      
      // Format for display
      const formatted1 = formatAddress(user1);
      const formatted2 = formatAddress(user2);
      expect(formatted1).toContain('...');
      expect(formatted2).toContain('...');
      
      // Validate message
      const message = 'Hello, how are you?';
      const validation = validateMessage(message);
      expect(validation.isValid).toBe(true);
      
      // Generate message ID
      const messageId = generateMessageId();
      expect(messageId).toMatch(/^msg_/);
    });
  });
});

/**
 * Conversation utilities for private messaging between wallet addresses
 */

import { isAddress, getAddress } from 'viem';

/**
 * Simple hash function for browser compatibility
 * @param str - String to hash
 * @returns Hash string
 */
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generate a deterministic conversation ID for two wallet addresses
 * @param address1 - First wallet address
 * @param address2 - Second wallet address
 * @returns Deterministic conversation ID
 */
export function getConversationId(address1: string, address2: string): string {
  // Normalize addresses to lowercase
  const addr1 = address1.toLowerCase();
  const addr2 = address2.toLowerCase();
  
  // Sort addresses to ensure consistent conversation ID regardless of order
  const sortedAddresses = [addr1, addr2].sort();
  
  // Create deterministic ID using simple hash
  const combined = sortedAddresses.join(':');
  return `convo_${simpleHash(combined)}`;
}

/**
 * Validate if a string is a valid Ethereum address
 * @param address - Address to validate
 * @returns True if valid address
 */
export function isValidAddress(address: string): boolean {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Normalize an Ethereum address
 * @param address - Address to normalize
 * @returns Normalized address or null if invalid
 */
export function normalizeAddress(address: string): string | null {
  try {
    return getAddress(address);
  } catch {
    return null;
  }
}

/**
 * Check if two addresses are the same (after normalization)
 * @param address1 - First address
 * @param address2 - Second address
 * @returns True if addresses are the same
 */
export function areAddressesEqual(address1: string, address2: string): boolean {
  try {
    const norm1 = normalizeAddress(address1);
    const norm2 = normalizeAddress(address2);
    return norm1 !== null && norm2 !== null && norm1 === norm2;
  } catch {
    return false;
  }
}

/**
 * Format address for display (truncated with ellipsis)
 * @param address - Full address
 * @param startChars - Number of characters to show at start
 * @param endChars - Number of characters to show at end
 * @returns Formatted address string
 */
export function formatAddress(
  address: string, 
  startChars: number = 6, 
  endChars: number = 4
): string {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get the other participant's address in a conversation
 * @param conversationId - The conversation ID
 * @param myAddress - My wallet address
 * @param allMessages - All messages in the conversation
 * @returns The other participant's address or null
 */
export function getOtherParticipant(
  conversationId: string,
  myAddress: string,
  allMessages: Array<{ sender: string; recipient: string }>
): string | null {
  const myNormAddress = normalizeAddress(myAddress);
  if (!myNormAddress) return null;
  
  // Find a message where I'm not the sender to get the other participant
  const otherMessage = allMessages.find(msg => 
    normalizeAddress(msg.sender) !== myNormAddress
  );
  
  if (otherMessage) {
    return normalizeAddress(otherMessage.sender) || otherMessage.sender;
  }
  
  // If no messages yet, we can't determine the other participant
  return null;
}

/**
 * Validate message content
 * @param body - Message body text
 * @returns Validation result with error message if invalid
 */
export function validateMessage(body: string): { isValid: boolean; error?: string } {
  if (!body || body.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (body.length > 2000) {
    return { isValid: false, error: 'Message too long (max 2000 characters)' };
  }
  
  return { isValid: true };
}

/**
 * Generate a unique message ID
 * @returns Unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  getConversationId,
  isValidAddress,
  normalizeAddress,
  areAddressesEqual,
  formatAddress,
  getOtherParticipant,
  validateMessage,
  generateMessageId
};

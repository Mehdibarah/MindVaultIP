/**
 * Message API client for private 1:1 chats
 */

import { getConversationId, validateMessage, generateMessageId } from '@/utils/conversationUtils';

// Message data model
export interface Message {
  id: string;
  convoId: string;
  sender: string;
  recipient: string;
  body: string;
  createdAt: string;
}

// API request/response types
export interface SendMessageRequest {
  convoId: string;
  recipient: string;
  body: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface GetMessagesRequest {
  convoId: string;
  cursor?: string; // timestamp for pagination
  limit?: number;
}

export interface GetMessagesResponse {
  success: boolean;
  messages?: Message[];
  nextCursor?: string;
  error?: string;
}

// Mock data store (in a real app, this would be a database)
const messageStore: Message[] = [];

/**
 * Send a message
 * @param request - Message data
 * @param senderAddress - Sender's wallet address
 * @returns Promise with response
 */
export async function sendMessage(
  request: SendMessageRequest,
  senderAddress: string
): Promise<SendMessageResponse> {
  try {
    // Validate message content
    const validation = validateMessage(request.body);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Create message object
    const message: Message = {
      id: generateMessageId(),
      convoId: request.convoId,
      sender: senderAddress,
      recipient: request.recipient,
      body: request.body.trim(),
      createdAt: new Date().toISOString()
    };

    // Store message (in real app, save to database)
    messageStore.push(message);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return { success: true, message };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

/**
 * Get messages for a conversation
 * @param request - Request parameters
 * @returns Promise with messages
 */
export async function getMessages(
  request: GetMessagesRequest
): Promise<GetMessagesResponse> {
  try {
    // Filter messages by conversation ID
    let messages = messageStore.filter(msg => msg.convoId === request.convoId);

    // Sort by creation time (newest first)
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply cursor-based pagination
    if (request.cursor) {
      const cursorTime = new Date(request.cursor).getTime();
      messages = messages.filter(msg => new Date(msg.createdAt).getTime() < cursorTime);
    }

    // Apply limit
    const limit = request.limit || 50;
    const limitedMessages = messages.slice(0, limit);

    // Determine next cursor
    let nextCursor: string | undefined;
    if (limitedMessages.length === limit && messages.length > limit) {
      nextCursor = limitedMessages[limitedMessages.length - 1].createdAt;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      messages: limitedMessages.reverse(), // Return in chronological order
      nextCursor
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, error: 'Failed to get messages' };
  }
}

/**
 * Get all conversations for a user
 * @param userAddress - User's wallet address
 * @returns Promise with conversation list
 */
export async function getConversations(userAddress: string): Promise<{
  success: boolean;
  conversations?: Array<{
    convoId: string;
    otherParticipant: string;
    lastMessage?: Message;
    unreadCount: number;
  }>;
  error?: string;
}> {
  try {
    // Get all messages involving this user
    const userMessages = messageStore.filter(
      msg => msg.sender === userAddress || msg.recipient === userAddress
    );

    // Group by conversation ID
    const conversationMap = new Map<string, {
      convoId: string;
      otherParticipant: string;
      lastMessage?: Message;
      unreadCount: number;
    }>();

    userMessages.forEach(msg => {
      const convoId = msg.convoId;
      const otherParticipant = msg.sender === userAddress ? msg.recipient : msg.sender;
      
      if (!conversationMap.has(convoId)) {
        conversationMap.set(convoId, {
          convoId,
          otherParticipant,
          lastMessage: msg,
          unreadCount: 0 // In a real app, track read status
        });
      } else {
        const existing = conversationMap.get(convoId)!;
        if (!existing.lastMessage || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          existing.lastMessage = msg;
        }
      }
    });

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => {
        if (!a.lastMessage || !b.lastMessage) return 0;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

    return { success: true, conversations };
  } catch (error) {
    console.error('Error getting conversations:', error);
    return { success: false, error: 'Failed to get conversations' };
  }
}

/**
 * Clear all messages (for testing)
 */
export function clearAllMessages(): void {
  messageStore.length = 0;
}

/**
 * Get message count (for testing)
 */
export function getMessageCount(): number {
  return messageStore.length;
}

export default {
  sendMessage,
  getMessages,
  getConversations,
  clearAllMessages,
  getMessageCount
};

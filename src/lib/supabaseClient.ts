import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";

// Supabase configuration with validation
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const CHAT_ENABLED = !!url && !!key;

if (!CHAT_ENABLED) {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Supabase environment variables not configured. Chat features will be disabled.');
    console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  }
}

// Create Supabase client with realtime configuration (only if env vars are available)
export const supabase = CHAT_ENABLED ? createClient(url, key, { 
  realtime: { 
    params: { 
      eventsPerSecond: 10 
    } 
  } 
}) : null;

// Helper function to compute deterministic DM room ID
export function dmRoomOf(a: string, b: string): string {
  const [x, y] = [a, b].map(s => s.toLowerCase()).sort();
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${x}:${y}`));
}

// Chat room types
export const ROOM_TYPES = {
  GLOBAL: 'global',
  DIRECT_MESSAGE: 'dm'
} as const;

export type RoomType = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];

// Message interface
export interface ChatMessage {
  id: number;
  room_id: string;
  sender: string;
  text: string;
  created_at: string;
}

// Chat utilities
export class ChatService {
  /**
   * Get current wallet address from ethers
   */
  static async getCurrentAddress(): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        return await signer.getAddress();
      }
      return null;
    } catch (error) {
      console.error('Failed to get current address:', error);
      return null;
    }
  }

  /**
   * Send a message to a room
   */
  static async sendMessage(roomId: string, text: string): Promise<boolean> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured. Please set environment variables.');
      }

      const sender = await this.getCurrentAddress();
      if (!sender) {
        throw new Error('Wallet not connected');
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender,
          text
        });

      if (error) {
        console.error('Failed to send message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Subscribe to messages in a room
   */
  static subscribeToMessages(roomId: string, callback: (message: ChatMessage) => void) {
    if (!supabase) {
      if (import.meta.env.DEV) {
        console.warn('Supabase not configured. Cannot subscribe to messages.');
      }
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  /**
   * Get recent messages from a room
   */
  static async getRecentMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      if (!supabase) {
        if (import.meta.env.DEV) {
          console.warn('Supabase not configured. Cannot fetch messages.');
        }
        return [];
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch messages:', error);
        return [];
      }

      return (data || []).reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Get or create DM room ID between two addresses
   */
  static getDMRoomId(address1: string, address2: string): string {
    return dmRoomOf(address1, address2);
  }
}

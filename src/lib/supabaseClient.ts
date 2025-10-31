import { createClient, SupabaseClient } from '@supabase/supabase-js';

// WARNING: Do NOT use service_key in the frontend. Always use anon key.
// The service key bypasses RLS and should only be used in server-side code.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please set it in your .env file or Vercel environment variables.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please set it in your .env file or Vercel environment variables. ' +
    'Get your anon key from Supabase Dashboard > Settings > API.'
  );
}

// Create Supabase client with anon key for browser operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Export bucket names from environment variables
export const AWARDS_BUCKET = import.meta.env.VITE_SUPABASE_AWARDS_BUCKET;
export const PROOFS_BUCKET = import.meta.env.VITE_SUPABASE_PROOFS_BUCKET;

// دیباگ: کلاینت را روی window بگذار تا از کنسول صدا بزنیم
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  (window as any).__sb = supabase;
}

console.log('[SupabaseClient] ✅ Initialized with URL:', supabaseUrl);

// دیباگ: env را لاگ کن
console.log('🔍 ENV CHECK >>>');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', (import.meta.env.VITE_SUPABASE_ANON_KEY || '').slice(0, 10));
console.log('VITE_SUPABASE_BUCKET:', import.meta.env.VITE_SUPABASE_BUCKET);

// Chat service mock (for backward compatibility)
export const ChatService = {
  sendMessage: () => Promise.resolve({ success: true }),
  getMessages: () => Promise.resolve({ data: [], error: null }),
  createRoom: () => Promise.resolve({ data: null, error: null }),
};

// Feature flags
export const CHAT_ENABLED = false;
export const dmRoomId = (userId1: string, userId2: string) => `dm_${userId1}_${userId2}`;


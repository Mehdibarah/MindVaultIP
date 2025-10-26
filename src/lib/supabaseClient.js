// Mock Supabase client for frontend development
// This is a placeholder implementation that provides the basic structure
// without requiring actual Supabase setup

export const supabase = {
  from: (table) => ({
    select: (columns) => ({
      order: (column, options) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data) => Promise.resolve({ data: null, error: null }),
    update: (data) => ({
      eq: (column, value) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column, value) => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
};

// Chat service mock
export const ChatService = {
  sendMessage: () => Promise.resolve({ success: true }),
  getMessages: () => Promise.resolve({ data: [], error: null }),
  createRoom: () => Promise.resolve({ data: null, error: null })
};

// Feature flags
export const CHAT_ENABLED = false;
export const dmRoomId = (userId1, userId2) => `dm_${userId1}_${userId2}`;

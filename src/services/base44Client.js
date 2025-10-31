/**
 * Base44 Client - DISABLED
 * 
 * This file is kept for backward compatibility but Base44 is completely disabled.
 * All functionality now uses Supabase via AuthClient and ProofClient.
 */

// Export empty object to prevent import errors
export const base44 = {
  auth: {
    me: () => Promise.resolve(null),
  },
  entities: {
    Proof: {
      create: () => Promise.reject(new Error('Base44 is disabled. Use SupabaseProofClient.')),
      get: () => Promise.resolve(null),
      update: () => Promise.reject(new Error('Base44 is disabled. Use SupabaseProofClient.')),
      filter: () => Promise.resolve([]),
    },
    Comment: {
      filter: () => Promise.resolve([]),
    },
    User: {
      filter: () => Promise.resolve([]),
    },
    UserReport: {
      create: () => Promise.reject(new Error('Base44 is disabled.')),
    },
  },
  functions: {
    invoke: () => Promise.reject(new Error('Base44 is disabled.')),
  },
  integrations: {
    Core: {},
  },
};

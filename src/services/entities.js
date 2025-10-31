// Legacy export - use proofClient() from @/services instead
// Import proofClient function dynamically to avoid circular dependency
export const Proof = {
  create: async (data) => {
    const { proofClient } = await import('./index');
    const client = await proofClient();
    return client.create(data);
  },
  get: async (id) => {
    const { proofClient } = await import('./index');
    const client = await proofClient();
    return client.get(id);
  },
  update: async (id, data) => {
    const { proofClient } = await import('./index');
    const client = await proofClient();
    return client.update(id, data);
  },
  filter: async (query) => {
    const { proofClient } = await import('./index');
    const client = await proofClient();
    return client.filter(query);
  },
};

// Other entities - Base44 disabled, using empty placeholders
// TODO: Add Supabase implementations if needed
export const ExpertReview = null;
export const ProofAppeal = null;
export const ProofTransfer = null;
export const ProofModeration = null;
export const UserReport = null;
export const PlatformTreasury = null;
export const RewardTransaction = null;
export const ChatRoom = null;
export const ChatMessage = null;
export const Notification = null;
export const Comment = null;
export const ExpertApplication = null;

// auth sdk:
export const User = null;
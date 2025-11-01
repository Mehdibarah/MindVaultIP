/**
 * Functions - DISABLED
 * 
 * Base44 functions are disabled. These features need to be reimplemented using:
 * - Supabase Edge Functions
 * - Direct API calls
 * - Backend services
 */

// ✅ JSDoc type annotation instead of TypeScript syntax
/**
 * @param {string} name
 */
const notImplemented = (name) => {
  return () => {
    console.warn(`${name} function not available - Base44 disabled`);
    return Promise.resolve({ success: false, error: 'Function not available - Base44 disabled' });
  };
};

export const processProofReward = notImplemented('processProofReward');
export const createNotification = notImplemented('createNotification');
export const generateExpertTestQuestion = notImplemented('generateExpertTestQuestion');
export const processExpertReview = notImplemented('processExpertReview');
export const validateInventionVideo = notImplemented('validateInventionVideo');
export const validateVideoHash = notImplemented('validateVideoHash');
export const purchaseProof = notImplemented('purchaseProof');
export const createCheckoutSession = notImplemented('createCheckoutSession');
export const stripeWebhook = notImplemented('stripeWebhook');
export const getStripeConfig = notImplemented('getStripeConfig');


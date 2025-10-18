import { base44 } from './base44Client';

// Safe function exports with fallbacks to prevent undefined errors
export const processProofReward = base44.functions?.processProofReward || (() => {
  console.warn('processProofReward function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const createNotification = base44.functions?.createNotification || (() => {
  console.warn('createNotification function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const generateExpertTestQuestion = base44.functions?.generateExpertTestQuestion || (() => {
  console.warn('generateExpertTestQuestion function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const processExpertReview = base44.functions?.processExpertReview || (() => {
  console.warn('processExpertReview function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const validateInventionVideo = base44.functions?.validateInventionVideo || (() => {
  console.warn('validateInventionVideo function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const validateVideoHash = base44.functions?.validateVideoHash || (() => {
  console.warn('validateVideoHash function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const purchaseProof = base44.functions?.purchaseProof || (() => {
  console.warn('purchaseProof function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const createCheckoutSession = base44.functions?.createCheckoutSession || (() => {
  console.warn('createCheckoutSession function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const stripeWebhook = base44.functions?.stripeWebhook || (() => {
  console.warn('stripeWebhook function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});

export const getStripeConfig = base44.functions?.getStripeConfig || (() => {
  console.warn('getStripeConfig function not available');
  return Promise.resolve({ success: false, error: 'Function not available' });
});


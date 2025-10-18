import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68f3baa1243cc437dcccaa8f", 
  requiresAuth: false // Set to false to prevent automatic login-info calls
});

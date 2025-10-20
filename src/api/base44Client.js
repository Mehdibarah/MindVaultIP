import { createClient } from '@base44/sdk';
import { handleBase44Error } from '@/utils/base44ErrorHandler';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication disabled to prevent login errors
export const base44 = createClient({
  appId: "68f3baa1243cc437dcccaa8f", 
  requiresAuth: false, // Disable authentication to prevent login errors
  autoRetry: false, // Disable auto-retry to prevent repeated failed calls
  timeout: 10000, // 10 second timeout
});

// Add global error handler for Base44 client
base44.onError = (error) => {
  handleBase44Error(error, 'Base44 Client');
};
